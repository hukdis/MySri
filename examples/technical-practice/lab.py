"""CPU teaching experiments: masked SFT, LoRA and a frozen-LM connector.

The synthetic CYL grammar is an educational task, not an industrial CAD language.
No pretrained weights, API keys, or external datasets are downloaded by this file.
"""
from __future__ import annotations

import argparse
import json
import math
import random
import time
from pathlib import Path

import torch
from torch import nn
from torch.nn import functional as F

SEED = 37
WORDS = ['<pad>', '<bos>', '<eos>', '<sep>', '<feature>',
         'make', 'create', 'cylinder', 'radius', 'height', 'BASE', 'CYL']
WORDS += [str(i) for i in range(1, 7)]
TOKEN = {word: i for i, word in enumerate(WORDS)}
PAD, BOS, EOS, SEP, FEATURE = range(5)
DATA_DIR: Path | None = None


def seed_all() -> None:
    random.seed(SEED)
    torch.manual_seed(SEED)
    torch.set_num_threads(2)


def rows(split: str) -> list[dict]:
    if DATA_DIR is not None:
        file = DATA_DIR / (split + '.jsonl')
        return [json.loads(line) for line in file.read_text(encoding='utf-8').splitlines() if line.strip()]
    result = []
    for radius in range(1, 7):
        for height in range(1, 7):
            bucket = (radius + 2 * height) % 6
            group = 'test' if bucket == 0 else 'validation' if bucket == 1 else 'train'
            if group != split:
                continue
            for verb in ['make', 'create']:
                result.append({'geometry_id': f'cylinder-r{radius}-h{height}',
                               'prompt': f'{verb} cylinder radius {radius} height {height}',
                               'target': f'CYL {radius} {height}',
                               'radius': radius, 'height': height})
    return result


def encode(text: str) -> list[int]:
    return [TOKEN[word] for word in text.split()]


# region batch
def batch(data: list[dict], base_task: bool = False,
          point_input: bool = False) -> tuple[torch.Tensor, torch.Tensor]:
    sequences, targets = [], []
    for row in data:
        prefix = [BOS] + ([FEATURE] * 6 if point_input else encode(row['prompt'])) + [SEP]
        answer = ('BASE' if base_task else 'CYL') + f" {row['radius']} {row['height']}"
        sequence = prefix + encode(answer) + [EOS]
        # Prompt tokens remain visible as input, but never act as target labels.
        labels = [-100] * len(prefix) + encode(answer) + [EOS]
        sequences.append(sequence)
        targets.append(labels)
    return torch.tensor(sequences), torch.tensor(targets)
# endregion batch


class Block(nn.Module):
    def __init__(self, width: int = 48, heads: int = 4) -> None:
        super().__init__()
        self.heads = heads
        self.norm1, self.norm2 = nn.LayerNorm(width), nn.LayerNorm(width)
        self.qkv = nn.Linear(width, 3 * width)
        self.out = nn.Linear(width, width)
        self.ff1, self.ff2 = nn.Linear(width, 2 * width), nn.Linear(2 * width, width)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        batch_size, length, width = x.shape
        q, k, v = self.qkv(self.norm1(x)).chunk(3, dim=-1)
        q, k, v = [t.view(batch_size, length, self.heads, width // self.heads)
                   .transpose(1, 2) for t in (q, k, v)]
        scores = q @ k.transpose(-2, -1) / math.sqrt(width // self.heads)
        causal = torch.ones(length, length, dtype=torch.bool).triu(1)
        scores = scores.masked_fill(causal, float('-inf'))
        attention = scores.softmax(-1) @ v
        x = x + self.out(attention.transpose(1, 2).reshape(batch_size, length, width))
        return x + self.ff2(F.gelu(self.ff1(self.norm2(x))))


class TinyLM(nn.Module):
    def __init__(self) -> None:
        super().__init__()
        self.embedding = nn.Embedding(len(WORDS), 48)
        self.position = nn.Embedding(32, 48)
        self.blocks = nn.ModuleList([Block(), Block()])
        self.norm = nn.LayerNorm(48)
        self.head = nn.Linear(48, len(WORDS))

    def forward(self, ids: torch.Tensor, soft_prefix: torch.Tensor | None = None) -> torch.Tensor:
        hidden = self.embedding(ids)
        if soft_prefix is not None:
            hidden = torch.cat([hidden[:, :1], soft_prefix, hidden[:, 7:]], dim=1)
        hidden = hidden + self.position(torch.arange(ids.shape[1]))
        for block in self.blocks:
            hidden = block(hidden)
        return self.head(self.norm(hidden))


# region loss
def answer_loss(logits: torch.Tensor, labels: torch.Tensor) -> torch.Tensor:
    # Position t predicts token t+1. Prompt/padding labels use ignore_index=-100.
    return F.cross_entropy(logits[:, :-1].reshape(-1, len(WORDS)),
                           labels[:, 1:].reshape(-1), ignore_index=-100)
# endregion loss


# region lora
class LoRALinear(nn.Module):
    def __init__(self, base: nn.Linear, rank: int = 4, alpha: int = 8) -> None:
        super().__init__()
        self.base = base.requires_grad_(False)
        self.A = nn.Parameter(torch.empty(rank, base.in_features))
        self.B = nn.Parameter(torch.zeros(base.out_features, rank))
        nn.init.kaiming_uniform_(self.A, a=math.sqrt(5))
        self.scale = alpha / rank

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.base(x) + F.linear(F.linear(x, self.A), self.B) * self.scale


def add_lora(module: nn.Module) -> None:
    for name, child in list(module.named_children()):
        if isinstance(child, nn.Linear):
            setattr(module, name, LoRALinear(child))
        else:
            add_lora(child)
# endregion lora


# region connector
def point_features(data: list[dict]) -> torch.Tensor:
    features = []
    angles = torch.arange(16) * (2 * math.pi / 16)
    for row in data:
        r, h = row['radius'], row['height']
        ring = torch.stack([r * angles.cos(), r * angles.sin()], dim=1)
        bottom = torch.cat([ring, torch.zeros(16, 1)], dim=1)
        top = torch.cat([ring, torch.full((16, 1), float(h))], dim=1)
        points = torch.cat([bottom, top])
        # Hand-written frozen geometric encoder; not a learned vision encoder.
        radius = points[:, :2].square().sum(-1).sqrt().max()
        height = points[:, 2].max() - points[:, 2].min()
        features.append(torch.stack([radius, height]) / 6)
    return torch.stack(features)


class Connector(nn.Module):
    def __init__(self) -> None:
        super().__init__()
        self.network = nn.Sequential(nn.Linear(2, 64), nn.Tanh(), nn.Linear(64, 6 * 48))

    def forward(self, features: torch.Tensor) -> torch.Tensor:
        return self.network(features).reshape(-1, 6, 48)
# endregion connector


def parse_command(text: str) -> tuple[int, int] | None:
    words = text.split()
    if len(words) != 3 or words[0] != 'CYL':
        return None
    try:
        r, h = int(words[1]), int(words[2])
    except ValueError:
        return None
    return (r, h) if 1 <= r <= 6 and 1 <= h <= 6 else None


@torch.no_grad()
def evaluate(model: TinyLM, data: list[dict], connector: Connector | None = None,
             condition: str = 'correct') -> dict:
    model.eval()
    if connector:
        connector.eval()
    features = point_features(data)
    if condition == 'zero':
        features = torch.zeros_like(features)
    elif condition == 'shuffled':
        features = features.roll(2, dims=0)  # Two prompts belong to each geometry.
    exact, valid, requirements, predictions = 0, 0, 0, []
    for index, row in enumerate(data):
        prefix = [BOS] + ([FEATURE] * 6 if connector else encode(row['prompt'])) + [SEP]
        ids = torch.tensor([prefix])
        soft = connector(features[index:index + 1]) if connector else None
        output = []
        for _ in range(6):
            token = int(model(ids, soft)[0, -1].argmax())
            if token == EOS:
                break
            output.append(WORDS[token])
            ids = torch.cat([ids, torch.tensor([[token]])], dim=1)
        text = ' '.join(output)
        parsed = parse_command(text)
        is_exact = text == row['target']
        exact += is_exact
        valid += parsed is not None
        if parsed:
            requirements += int(parsed[0] == row['radius']) + int(parsed[1] == row['height'])
        predictions.append({'geometry_id': row['geometry_id'], 'prompt': row['prompt'],
                            'target': row['target'], 'prediction': text, 'exact': is_exact})
    return {'samples': len(data), 'geometries': len({r['geometry_id'] for r in data}),
            'exact_match': exact / len(data), 'valid_command': valid / len(data),
            'requirements': requirements / (2 * len(data)), 'predictions': predictions}


def train(model: TinyLM, steps: int, base_task: bool = False,
          connector: Connector | None = None) -> dict:
    data = rows('train')
    ids, labels = batch(data, base_task, connector is not None)
    parameters = list(model.named_parameters())
    if connector:
        parameters += [('connector.' + n, p) for n, p in connector.named_parameters()]
    before = {name: p.detach().clone() for name, p in parameters}
    optimizer = torch.optim.AdamW([p for _, p in parameters if p.requires_grad],
                                 lr=0.006 if not connector else 0.01, weight_decay=0)
    initial, final = 0.0, 0.0
    for step in range(steps):
        model.train()
        soft = connector(point_features(data)) if connector else None
        # Do not use no_grad on the frozen LM: connector gradients pass through it.
        loss = answer_loss(model(ids, soft), labels)
        if step == 0:
            initial = float(loss.detach())
        optimizer.zero_grad(set_to_none=True)
        loss.backward()
        if step == 0:
            assert any(p.grad is not None and p.grad.abs().sum() > 0
                       for _, p in parameters if p.requires_grad), 'No usable gradient'
        optimizer.step()
        final = float(loss.detach())
    frozen_changed = [name for name, p in parameters
                      if not p.requires_grad and not torch.equal(p.detach(), before[name])]
    assert not frozen_changed, frozen_changed
    changed = [name for name, p in parameters if not torch.equal(p.detach(), before[name])]
    return {'initial_loss': initial, 'final_loss': final,
            'trainable_parameters': sum(p.numel() for _, p in parameters if p.requires_grad),
            'total_parameters': sum(p.numel() for _, p in parameters),
            'changed_parameter_names': changed, 'frozen_changed': frozen_changed}


def load_model(file: Path) -> TinyLM:
    model = TinyLM()
    model.load_state_dict(torch.load(file, map_location='cpu', weights_only=True))
    return model


def run(args: argparse.Namespace) -> None:
    global DATA_DIR
    DATA_DIR = args.data_dir
    seed_all()
    started = time.perf_counter()
    out = args.output
    out.mkdir(parents=True, exist_ok=True)
    if args.stage == 'data':
        if DATA_DIR is not None:
            raise SystemExit('The data stage generates built-in examples; omit --data-dir.')
        for split in ['train', 'validation', 'test']:
            data = rows(split)
            (out / (split + '.jsonl')).write_text('\n'.join(json.dumps(r) for r in data) + '\n')
        print(json.dumps({'train': len(rows('train')), 'validation': len(rows('validation')),
                          'test': len(rows('test')), 'output': str(out)}))
        return
    groups = [{r['geometry_id'] for r in rows(split)} for split in ['train', 'validation', 'test']]
    if any(groups[i] & groups[j] for i in range(3) for j in range(i + 1, 3)):
        raise SystemExit('Geometry IDs must not overlap across train/validation/test.')
    for split in ['train', 'validation', 'test']:
        if not rows(split):
            raise SystemExit('Each split must contain data.')
        for row in rows(split):
            if parse_command(row['target']) != (row['radius'], row['height']):
                raise SystemExit('Target command does not match the geometry attributes.')
            encode(row['prompt'])  # Fail early if the tiny vocabulary cannot encode a prompt.
    base_file, sft_file = out / 'base.pt', out / 'sft.pt'
    if not base_file.exists() or args.stage == 'base':
        base = TinyLM()
        warmup = train(base, args.base_steps, base_task=True)
        torch.save(base.state_dict(), base_file)
        if args.stage == 'base':
            print(json.dumps(warmup))
            return
    if args.stage == 'align' and not sft_file.exists():
        raise SystemExit('Run the sft stage first, using the same --output directory.')
    model = load_model(sft_file if args.stage == 'align' else base_file)
    connector = None
    if args.stage == 'lora':
        model.requires_grad_(False)
        add_lora(model)
    elif args.stage == 'align':
        model.requires_grad_(False)
        connector = Connector()
    result = {'stage': args.stage, 'seed': SEED, 'device': 'cpu', 'torch': torch.__version__,
              'steps': args.steps, 'before': evaluate(model, rows('test'), connector)}
    result.update(train(model, args.steps, connector=connector))
    result['train'] = evaluate(model, rows('train'), connector)
    result['validation'] = evaluate(model, rows('validation'), connector)
    result['test'] = evaluate(model, rows('test'), connector)
    if connector:
        result['zero_condition'] = evaluate(model, rows('test'), connector, 'zero')
        result['shuffled_condition'] = evaluate(model, rows('test'), connector, 'shuffled')
        torch.save(connector.state_dict(), out / 'connector.pt')
    elif args.stage == 'sft':
        torch.save(model.state_dict(), sft_file)
    else:
        torch.save(model.state_dict(), out / 'lora.pt')
    result['seconds'] = time.perf_counter() - started
    (out / (args.stage + '-metrics.json')).write_text(json.dumps(result, indent=2), encoding='utf-8')
    compact = {k: v for k, v in result.items() if k not in ['before', 'train', 'validation', 'test',
               'zero_condition', 'shuffled_condition', 'changed_parameter_names']}
    compact['test'] = {k: v for k, v in result['test'].items() if k != 'predictions'}
    print(json.dumps(compact, indent=2))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('stage', choices=['data', 'base', 'sft', 'lora', 'align'])
    parser.add_argument('--steps', type=int, default=400)
    parser.add_argument('--base-steps', type=int, default=400)
    parser.add_argument('--output', type=Path, default=Path('runs'))
    parser.add_argument('--data-dir', type=Path, help='Directory containing train/validation/test.jsonl')
    options = parser.parse_args()
    if options.steps < 1 or options.base_steps < 1:
        parser.error('steps must be positive')
    run(options)
