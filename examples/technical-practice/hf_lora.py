"""A small pretrained-model LoRA recipe, plus a fully offline random-GPT2 smoke mode."""
from __future__ import annotations

import argparse
import gc
import hashlib
import json
import random
import time
import platform
from pathlib import Path

import torch
import transformers
import peft
from peft import LoraConfig, PeftModel, get_peft_model
from transformers import AutoModelForCausalLM, AutoTokenizer, GPT2Config, GPT2LMHeadModel
from transformers import PreTrainedTokenizerFast

from lab import WORDS, parse_command, rows, seed_all


def smoke_model() -> tuple[PreTrainedTokenizerFast, GPT2LMHeadModel]:
    from tokenizers import Tokenizer
    from tokenizers.models import WordLevel
    from tokenizers.pre_tokenizers import WhitespaceSplit
    vocab = {word: i for i, word in enumerate(WORDS + ['<user>', '<assistant>', '<unk>'])}
    backend = Tokenizer(WordLevel(vocab, unk_token='<unk>'))
    backend.pre_tokenizer = WhitespaceSplit()
    tokenizer = PreTrainedTokenizerFast(tokenizer_object=backend, bos_token='<bos>',
                eos_token='<eos>', pad_token='<pad>', unk_token='<unk>')
    tokenizer.chat_template = (
        "{% for m in messages %}{{ '<user> ' if m['role'] == 'user' else '<assistant> ' }}"
        "{{ m['content'] + ' ' }}{% if m['role'] == 'assistant' %}{{ eos_token + ' ' }}{% endif %}"
        "{% endfor %}{% if add_generation_prompt %}{{ '<assistant> ' }}{% endif %}")
    model = GPT2LMHeadModel(GPT2Config(vocab_size=len(tokenizer), n_positions=128,
                           n_embd=24, n_layer=1, n_head=2,
                           bos_token_id=tokenizer.bos_token_id,
                           eos_token_id=tokenizer.eos_token_id,
                           pad_token_id=tokenizer.pad_token_id))
    return tokenizer, model


# region encode
def encode_pair(tokenizer, row: dict) -> dict:
    prefix = tokenizer.apply_chat_template([{'role': 'user', 'content': row['prompt']}],
                                          tokenize=False, add_generation_prompt=True)
    prompt = tokenizer(prefix, add_special_tokens=False)['input_ids']
    full = tokenizer.apply_chat_template(
        [{'role': 'user', 'content': row['prompt']},
         {'role': 'assistant', 'content': row['target']}],
        tokenize=True, add_generation_prompt=False)
    if full[:len(prompt)] != prompt:
        raise ValueError('This chat template does not preserve the generation prefix; adapt the answer mask.')
    answer = full[len(prompt):]
    return {'input_ids': prompt + answer, 'labels': [-100] * len(prompt) + answer}
# endregion encode


def collate(records: list[dict], pad: int, device: str) -> dict:
    length = max(len(row['input_ids']) for row in records)
    return {key: torch.tensor([row[key] + [fill] * (length - len(row[key])) for row in records],
                              device=device)
            for key, fill in [('input_ids', pad), ('labels', -100)]} | {
            'attention_mask': torch.tensor([[1] * len(row['input_ids']) +
                                [0] * (length - len(row['input_ids'])) for row in records], device=device)}


def frozen_hash(model: torch.nn.Module) -> str:
    digest = hashlib.sha256()
    for name, parameter in model.named_parameters():
        if not parameter.requires_grad:
            digest.update(name.encode())
            digest.update(parameter.detach().cpu().contiguous().view(torch.uint8).numpy().tobytes())
    return digest.hexdigest()


@torch.no_grad()
def predict(model, tokenizer, data: list[dict], device: str) -> dict:
    model.eval()
    predictions = []
    for row in data:
        ids = tokenizer.apply_chat_template([{'role': 'user', 'content': row['prompt']}],
                       add_generation_prompt=True, return_tensors='pt').to(device)
        attention = torch.ones_like(ids)
        output = model.generate(input_ids=ids, attention_mask=attention, do_sample=False,
                                max_new_tokens=16, pad_token_id=tokenizer.pad_token_id)
        text = tokenizer.decode(output[0, ids.shape[1]:], skip_special_tokens=True).strip()
        predictions.append({'prompt': row['prompt'], 'target': row['target'], 'prediction': text,
                            'geometry_id': row['geometry_id'], 'exact': text == row['target']})
    return {'samples': len(data), 'exact_match': sum(p['exact'] for p in predictions) / len(data),
            'valid_command': sum(parse_command(p['prediction']) is not None for p in predictions) / len(data),
            'predictions': predictions}


def run(args: argparse.Namespace) -> None:
    seed_all()
    started = time.perf_counter()
    if (args.output / 'adapter').exists():
        raise FileExistsError('Adapter output already exists. Choose a new --output directory.')
    args.output.mkdir(parents=True, exist_ok=True)
    if args.smoke:
        tokenizer, base = smoke_model()
        base.save_pretrained(args.output / 'smoke-base')
    else:
        tokenizer = AutoTokenizer.from_pretrained(args.model)
        base = AutoModelForCausalLM.from_pretrained(args.model, torch_dtype=torch.float32)
    if tokenizer.pad_token_id is None:
        tokenizer.pad_token = tokenizer.eos_token
    base.to(args.device)
    # region peft
    config = LoraConfig(task_type='CAUSAL_LM', r=4, lora_alpha=8,
                        lora_dropout=0.0, target_modules='all-linear')
    model = get_peft_model(base, config)
    optimizer = torch.optim.AdamW([p for p in model.parameters() if p.requires_grad], lr=0.001)
    # endregion peft
    training = [encode_pair(tokenizer, row) for row in rows('train')]
    validation = rows('validation')
    test = rows('test')[:args.eval_samples]
    result = {'model': 'random GPT2 smoke model' if args.smoke else args.model,
              'smoke': args.smoke, 'seed': 37, 'steps': args.steps,
              'model_revision': getattr(base.config, '_commit_hash', None),
              'environment': {'python': platform.python_version(), 'torch': torch.__version__,
                              'transformers': transformers.__version__, 'peft': peft.__version__,
                              'device': args.device},
              'batch_size': 4, 'learning_rate': 0.001,
              'train_samples': len(training), 'validation_samples': len(validation),
              'before': predict(model, tokenizer, test, args.device),
              'trainable_parameters': sum(p.numel() for p in model.parameters() if p.requires_grad),
              'total_parameters': sum(p.numel() for p in model.parameters())}
    initial_frozen = frozen_hash(model)
    result['loss_history'] = []
    for step in range(args.steps):
        model.train()
        records = random.sample(training, min(4, len(training)))
        inputs = collate(records, tokenizer.pad_token_id, args.device)
        # region step
        optimizer.zero_grad(set_to_none=True)
        loss = model(**inputs).loss  # Hugging Face shifts causal labels internally: no second shift.
        loss.backward()
        optimizer.step()
        # endregion step
        if step == 0:
            result['initial_loss'] = float(loss.detach())
        if step == 0 or (step + 1) % 10 == 0 or step == args.steps - 1:
            result['loss_history'].append({'step': step + 1, 'loss': float(loss.detach())})
            print(f"step {step + 1}/{args.steps}: loss={float(loss.detach()):.4f}", flush=True)
    result['final_loss'] = float(loss.detach())
    result['frozen_unchanged'] = initial_frozen == frozen_hash(model)
    assert result['frozen_unchanged']
    result['after'] = predict(model, tokenizer, test, args.device)
    result['validation'] = predict(model, tokenizer, validation, args.device)
    model.save_pretrained(args.output / 'adapter')
    tokenizer.save_pretrained(args.output / 'adapter')
    if args.check_reload:
        del inputs, loss
        del model, base, optimizer
        gc.collect()
        fresh = AutoModelForCausalLM.from_pretrained(
            args.output / 'smoke-base' if args.smoke else args.model, torch_dtype=torch.float32)
        restored = PeftModel.from_pretrained(fresh, args.output / 'adapter').to(args.device)
        reload_result = predict(restored, tokenizer, test, args.device)
        result['reload_matches'] = reload_result == result['after']
        assert result['reload_matches']
    result['elapsed_seconds'] = round(time.perf_counter() - started, 3)
    (args.output / 'hf-metrics.json').write_text(json.dumps(result, indent=2), encoding='utf-8')
    print(json.dumps(result, indent=2))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--smoke', action='store_true', help='Offline pipeline test with random weights')
    parser.add_argument('--model', default='HuggingFaceTB/SmolLM2-135M-Instruct')
    parser.add_argument('--steps', type=int, default=20)
    parser.add_argument('--eval-samples', type=int, default=4)
    parser.add_argument('--device', choices=['cpu', 'cuda'], default='cpu')
    parser.add_argument('--check-reload', action='store_true')
    parser.add_argument('--output', type=Path, default=Path('runs/hf'))
    options = parser.parse_args()
    if options.steps < 1 or not 1 <= options.eval_samples <= 12:
        parser.error('steps must be positive; eval-samples must be between 1 and 12')
    run(options)
