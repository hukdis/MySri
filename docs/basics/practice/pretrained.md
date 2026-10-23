---
id: basic-practice-0007
title: 完成一次真实模型的 LoRA 微调
navTitle: 03 · LoRA 微调与重载
category: basics
type: concept
tags:
- 技术实践
- Transformers
- PEFT
prerequisites:
- basic-practice-0009
related:
- basic-practice-0003
- basic-practice-0004
- cad-0103
- cad-0105
sources:
- https://huggingface.co/docs/transformers/v4.57.1/en/chat_templating
- https://huggingface.co/docs/peft/en/quicktour
- https://huggingface.co/HuggingFaceTB/SmolLM2-135M-Instruct
status: draft
reviewed: false
order: 33
created: '2026-10-22'
updated: '2026-10-23'
outline:
- 2
- 2
practiceGroup: start
---
# 完成一次真实模型的 LoRA 微调

<span id="迁移到预训练模型-聊天模板、peft-与权重保存"></span>
<span id="先分清两种运行方式"></span>
<span id="用模型自己的聊天模板构造输入"></span>
<span id="用-peft-注入-lora"></span>
<span id="损失在模型内部计算-不再手动位移"></span>
<span id="先跑离线-smoke-再决定是否下载权重"></span>
<span id="保存的适配器不是完整模型"></span>

上一页已经记录原模型怎样回答。现在使用成对的“描述—命令”样本，让它学习输出格式，再保存适配器并在新进程中使用。

**SFT 是用输入和标准答案进行监督训练；LoRA 决定训练时更新哪些参数。本页做的是使用 LoRA 的 SFT。** 不需要先完成自写 Transformer 的课程。

## 先跑通完整流程

在实验目录与已安装依赖的环境中执行：

```powershell
python hf_lora.py --steps 20 --eval-samples 12 --check-reload --output runs/hf-first
python check_cad.py runs/hf-first/hf-metrics.json
```

默认加载真实的 SmolLM2-135M-Instruct，首次使用会下载权重。CPU 是默认设备；有兼容 CUDA 环境时可加 `--device cuda`。20 步用于观察完整流程，不能保证充分训练或高匹配率。每次比较请使用新的输出目录；脚本拒绝覆盖已有 adapter。

运行依次完成：加载基座 → 构造训练样本 → 测量原始回答 → 更新 LoRA → 测量训练后的回答 → 保存 → 重新加载并比较。终端每隔若干步打印 loss，最终报告保存到 `hf-metrics.json`。

| 产物 | 打开后看什么 |
| --- | --- |
| `hf-metrics.json` | `before`、`after` 中同一组测试输入的预测；`validation` 为独立验证对象 |
| `loss_history` | 训练过程中的答案损失记录 |
| `adapter/adapter_config.json` | 基座名称与 LoRA 配置 |
| `adapter/adapter_model.safetensors` | 本次学习的增量权重 |
| `adapter/` 中的 tokenizer 文件 | 重载时使用一致的输入格式 |

先确认 `smoke=false`、`frozen_unchanged=true`、`reload_matches=true`，再看生成结果。前后任务匹配率没有提高，也应保留真实输出；接着到[评估与排错](./evaluation)定位原因。

## 数据怎样变成训练输入

<<< ../../../examples/technical-practice/hf_lora.py#encode

程序先用 user 消息构造生成前缀，再用 user 和 assistant 标准答案构造完整对话。完整训练对话使用 `add_generation_prompt=False`，答案和结束标记由聊天模板处理。脚本检查完整对话的开头是否与生成前缀一致；若替换模型后不一致，应重新设计答案掩码。

`input_ids` 保留整段对话，`labels` 把提示部分设成 `-100`。这意味着模型仍能读取问题，但只在目标回答区域受到训练。padding 位置同样不计算损失。进一步拆解见[答案区损失](./sft#answer-loss)。

输入格式依据 [Transformers 固定版本文档](https://huggingface.co/docs/transformers/v4.57.1/en/chat_templating)，避免为所有模型手写同一种 `User/Assistant` 格式。

## LoRA 加在了哪里

<<< ../../../examples/technical-practice/hf_lora.py#peft

`get_peft_model` 给基座附加低秩增量。这里 `r=4`、`lora_alpha=8`，并用 `all-linear` 选择 PEFT 支持的线性模块；它是本例的训练配置，不是所有 CAD 论文的统一设置。优化器只接收 `requires_grad=True` 的参数。

先看报告的可训练参数量，再读 [LoRA 矩阵实验](./lora)，就能把“参数更少”对应到具体的 A、B 矩阵。接口参照 [PEFT 0.17 系列 Quicktour](https://huggingface.co/docs/peft/v0.17.0/en/quicktour)；本站固定安装 0.17.1。

## 一次更新发生了什么

<<< ../../../examples/technical-practice/hf_lora.py#step

模型根据完整输入预测后续 token，内部计算因果语言损失。`backward()` 计算梯度，`step()` 更新参数。这里的模型已经在内部移动预测与标签位置，不再调用教学模型中的手动位移函数。

脚本对冻结参数计算训练前后的摘要，并在保存后重新创建基座、加载适配器，检查同一组自由生成结果。这些检查分别回答“哪些参数改变”和“保存的产物能否重新使用”。

## 在新进程中使用训练结果

```powershell
python hf_infer.py --adapter runs/hf-first/adapter --prompt "make cylinder radius 2 height 4" --output runs/after.json
```

与上一页的 `before.json` 比较。再把半径改成 3，检查输入变化是否带来相应的输出变化；一条恰好正确的回答不能代替完整测试集评价。

适配器依赖同一个基座与兼容的分词配置。替换模型时，需要重新核对聊天模板、目标模块、长度和保存重载，不能直接混用旧 adapter。

::: details 没有网络时，检查脚本接口
```powershell
python hf_lora.py --smoke --steps 2 --check-reload --output runs/hf-smoke-new
```
`--smoke` 使用随机初始化的小 GPT-2，只检查训练、冻结和保存重载接口。它不下载真实权重；报告会明确记录 `smoke=true`。这项检查与上面的真实模型实验分别记录。
:::

## 回到 CAD 论文

[CAD-Llama](/cad/cad-llama#technical-primer)和 [CAD-MLLM](/cad/cad-mllm#technical-primer)都涉及模型适配，但使用的数据、CAD 表示、输入接口和训练阶段各不相同。本例完成了真实权重上的短格式适配；要理解论文，接下来需要看这些差异。

这次的实际运行条件和结果见[评估页](./evaluation#real-model-run)。

[下一步：按论文查技术](./paper-map) · [继续：CAD 表示与序列生成](./representation)
