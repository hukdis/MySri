---
id: basic-practice-0007
title: 迁移到预训练模型：聊天模板、PEFT 与权重保存
navTitle: 06 · 预训练模型迁移
category: basics
type: concept
tags: [技术实践, Transformers, PEFT]
prerequisites: [basic-practice-0004]
related: [cad-0103, cad-0108, basic-practice-0008]
sources: [https://huggingface.co/docs/transformers/v4.57.1/en/chat_templating, https://huggingface.co/docs/peft/en/quicktour, https://huggingface.co/HuggingFaceTB/SmolLM2-135M-Instruct]
status: draft
reviewed: false
order: 36
created: '2026-10-22'
updated: '2026-10-22'
outline: [2, 2]
---
# 迁移到预训练模型：聊天模板、PEFT 与权重保存

前面的小模型让损失和冻结机制可见。这一课把同样的任务接到 Transformers 与 PEFT，保留清晰的训练循环，并把模型格式、适配器和保存流程交给成熟库。

## 先分清两种运行方式

| 方式 | 模型来源 | 网络与资源 | 用于检查什么 |
| --- | --- | --- | --- |
| `--smoke` | 本机随机初始化的小 GPT-2 配置 | 不下载模型权重，CPU | API、掩码、LoRA 更新与保存重载 |
| 默认预训练配方 | SmolLM2-135M-Instruct | 首次下载权重，训练需更多内存与时间 | 真实预训练模型的任务适配 |

smoke 跑通不等于真实预训练模型已被成功微调。默认模型选择较小规模，是为了降低第一次迁移的门槛，并不代表它是 CAD 专用模型或当前最优选择。[模型卡](https://huggingface.co/HuggingFaceTB/SmolLM2-135M-Instruct)可核对架构与权重条件。

安装额外依赖：

```powershell
python -m pip install -r requirements-hf.txt
```

## 用模型自己的聊天模板构造输入

用户消息不能直接假设为所有模型通用的 `User: ... Assistant:`。tokenizer 的聊天模板负责加入角色与边界标记；输入前缀和训练目标必须遵循一致的格式。

<<< ../../../examples/technical-practice/hf_lora.py#encode

这里先构造生成前缀，再拼接目标命令及结束标记。只有答案部分保留标签，用户输入仍置为 -100。使用 `tokenize=False` 后再次分词时设 `add_special_tokens=False`，避免重复添加特殊 token。详细约定参见 [Transformers 4.57.1 聊天模板文档](https://huggingface.co/docs/transformers/v4.57.1/en/chat_templating)。

## 用 PEFT 注入 LoRA

<<< ../../../examples/technical-practice/hf_lora.py#peft

`all-linear` 按 PEFT 的规则选择线性/Conv1D 模块，对 PreTrainedModel 排除输出层，避免把示例模型中手工替换所有线性层的逻辑不加区分地套上来。[固定版本实现](https://github.com/huggingface/peft/blob/v0.17.1/src/peft/tuners/lora/config.py)给出了该配置含义。

观察脚本报告的可训练参数量，再检查原模型冻结权重的摘要是否一致。不要只因为代码中写了 LoRA 就假设冻结一定正确。

## 损失在模型内部计算，不再手动位移

<<< ../../../examples/technical-practice/hf_lora.py#step

输入包含 `input_ids`、`attention_mask` 与 `labels`。本配方的因果语言模型在内部完成下一 token 标签位移，所以这里不能再次调用前面教学模型的 `answer_loss()`。

每个 batch 右侧填充到相同长度，填充位置 attention mask 为 0、标签为 -100。这样不会把填充当作需要学习的答案。

## 先跑离线 smoke，再决定是否下载权重

```powershell
python hf_lora.py --smoke --steps 2 --eval-samples 4 --check-reload --output runs/hf-smoke
```

检查 `hf-metrics.json` 中：

- `smoke` 为 true，明确本次不是预训练模型训练。
- `trainable_parameters` 小于 `total_parameters`。
- `frozen_unchanged` 为 true，冻结权重摘要一致。
- `reload_matches` 为 true，保存后重载的自由生成结果一致。

随机小模型两步训练不要求获得高任务分数；这一阶段检查的是管线完整性。

准备好网络和内存后，再显式运行真实模型：

```powershell
python hf_lora.py --steps 20 --eval-samples 12 --check-reload --output runs/hf-smollm
```

CPU 是默认设备，有匹配的 CUDA 环境可加 `--device cuda`。默认预训练模型会从 Hugging Face 下载并使用本地缓存，不调用付费推理 API。20 步是验证训练入口的小预算，不是推荐的充分训练量。

## 保存的适配器不是完整模型

`adapter/` 保存 LoRA 权重、配置和 tokenizer；真实模型使用时还需要相同基座。本章 `--check-reload` 会新建基座、加载适配器并比较输出，避免只验证“文件写出成功”。

如果替换基座，必须重新核对 tokenizer、聊天模板、上下文长度与目标模块。适配器不能不加检查地移到另一个架构上。

本章不会以训练 loss 下降作为 CAD 成功证明：仍需对所有自由生成结果计算命令有效性与半径/高度要求，失败和无效样本都保留在分母中。

[下一课：评估与排错](./evaluation)
