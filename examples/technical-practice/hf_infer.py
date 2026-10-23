"""Inspect a real pretrained model, or reload a locally trained LoRA adapter."""
from __future__ import annotations

import argparse
import json
from pathlib import Path

import torch
from peft import PeftConfig, PeftModel
from transformers import AutoModelForCausalLM, AutoTokenizer


def run(args: argparse.Namespace) -> None:
    torch.set_num_threads(2)
    if args.adapter:
        config = PeftConfig.from_pretrained(args.adapter)
        if config.base_model_name_or_path != args.model:
            raise ValueError('Use --model matching adapter_config.json base_model_name_or_path.')
    # region load
    tokenizer = AutoTokenizer.from_pretrained(args.adapter or args.model)
    model = AutoModelForCausalLM.from_pretrained(args.model, torch_dtype=torch.float32)
    if args.adapter:
        model = PeftModel.from_pretrained(model, args.adapter)
    model.to(args.device).eval()
    # endregion load
    if tokenizer.pad_token_id is None:
        tokenizer.pad_token = tokenizer.eos_token
    # region generate
    messages = [{'role': 'user', 'content': args.prompt}]
    inputs = tokenizer.apply_chat_template(messages, add_generation_prompt=True,
                                          return_dict=True, return_tensors='pt').to(args.device)
    with torch.inference_mode():
        output = model.generate(**inputs, do_sample=False, max_new_tokens=args.max_new_tokens,
                                pad_token_id=tokenizer.pad_token_id)
    answer = tokenizer.decode(output[0, inputs['input_ids'].shape[1]:],
                              skip_special_tokens=True).strip()
    # endregion generate
    report = {'model': args.model, 'adapter': str(args.adapter) if args.adapter else None,
              'prompt': args.prompt, 'formatted_prompt': tokenizer.decode(inputs['input_ids'][0]),
              'input_tokens': inputs['input_ids'].shape[1], 'prediction': answer,
              'model_revision': getattr(model.config, '_commit_hash', None)}
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--model', default='HuggingFaceTB/SmolLM2-135M-Instruct')
    parser.add_argument('--adapter', type=Path)
    parser.add_argument('--prompt', default='make cylinder radius 2 height 4')
    parser.add_argument('--max-new-tokens', type=int, default=32)
    parser.add_argument('--device', choices=['cpu', 'cuda'], default='cpu')
    parser.add_argument('--output', type=Path)
    args = parser.parse_args()
    if args.max_new_tokens < 1:
        parser.error('max-new-tokens must be positive')
    run(args)
