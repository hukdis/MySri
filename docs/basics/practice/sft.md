---
id: basic-practice-0003
title: 监督微调：输入、答案掩码与一次参数更新
navTitle: 损失与参数更新（小模型）
category: basics
type: concept
tags:
- 技术实践
- SFT
- 交叉熵
prerequisites:
- basic-practice-0002
related:
- basic-practice-0004
- cad-0102
sources:
- https://docs.pytorch.org/docs/2.9/generated/torch.nn.CrossEntropyLoss.html
- https://github.com/rasbt/LLMs-from-scratch
status: draft
reviewed: false
order: 70
created: '2026-10-22'
updated: '2026-10-23'
outline:
- 2
- 2
practiceGroup: lab
---
# 监督微调：输入、答案掩码与一次参数更新

这是配合[真实模型微调](./pretrained)阅读的原理实验。先用一个能在 CPU 上运行的小模型，观察输入、标签和一次参数更新；需要训练内部细节时再进入本页。

## 先区分教学基座与微调目标

代码先用训练集预热一个基座，让它从文字生成 `BASE r h`，再把输出格式适配到 `CYL r h`。预热提供一个可重复的起点，也让“加载已有权重再更新”真正发生。

这个基座从本章合成数据训练，不具备通用语言预训练知识。其格式适配实验展示 SFT 的参数更新机制，不能据此预测真实大模型训练成本或 CAD 能力。

## 输入怎样排成序列

以 `make cylinder radius 2 height 4` 为例：

```text
输入： <bos> make cylinder radius 2 height 4 <sep> CYL 2 4 <eos>
标签：  -100 -100 -100 -100 -100 -100 -100 -100 CYL 2 4 <eos>
```

数字 ID 由词表映射得到，显示文字是为了便于阅读。`-100` 是损失函数的忽略标记：这些输入位置不作为预测目标，但仍参与前向计算，答案可以注意到它们。

训练时前序答案也会出现在输入中。因果注意力屏蔽未来位置，模型不能看到自己将要预测的下一个 token。这样才能用一条完整序列并行计算各位置的训练信号。

## 答案区损失怎样计算 {#answer-loss}

设答案位置集合为 $A$，目标 token 为 $y_t$，模型预测概率为 $p_\theta$，本章采用：

$$
L=-\frac{1}{|A|}\sum_{t\in A}\log p_\theta(y_t\mid x,y_{<t}).
$$

正确 token 的概率越低，惩罚越大。这里每个样本的目标有 `CYL`、两个数值和结束标记四个 token。它们被正确预测，不等于已经执行或验证几何；那是后面独立检查的工作。

下面的代码直接从实验文件导入，避免页面示例与可下载源码各维护一套：

<<< ../../../examples/technical-practice/lab.py#batch

计算损失时，位置 $t$ 的输出对比位置 $t+1$ 的标签：

<<< ../../../examples/technical-practice/lab.py#loss

输入给交叉熵的是 **logits**，不必先手工 softmax。使用 `ignore_index=-100` 后，忽略位置不进入该平均损失。[PyTorch 定义](https://docs.pytorch.org/docs/2.9/generated/torch.nn.CrossEntropyLoss.html)说明了这两个约定。后面的 Hugging Face 模型会在内部做位移，不能再重复移动一次。

## 哪些参数在更新

SFT 实验不冻结模型。token 嵌入、位置嵌入、注意力、前馈网络、归一化与输出层都参与训练。循环的关键顺序是：

```python
optimizer.zero_grad(set_to_none=True)
logits = model(input_ids)
loss = answer_loss(logits, labels)
loss.backward()
optimizer.step()
```

`backward()` 计算梯度，`step()` 才根据梯度修改参数。只执行前向和打印 loss，不会让模型学会。训练模式和评估模式也需要切换；本章固定随机种子 37，默认 CPU 两个计算线程。

## 运行与读取输出

在实验目录执行：

```powershell
python lab.py sft --steps 400 --base-steps 400 --data-dir data --output runs
python check_cad.py runs/sft-metrics.json
```

首次运行自动生成 `runs/base.pt`，再训练并保存 `runs/sft.pt`。详细结果在 `runs/sft-metrics.json`：

| 字段 | 观察重点 |
| --- | --- |
| initial_loss / final_loss | 当前训练目标的误差是否下降 |
| trainable_parameters | 全量更新包含多少参数 |
| changed_parameter_names | 哪些权重确实发生变化 |
| train / validation / test | 训练对象与留出对象的自由生成表现 |
| predictions | 把具体错误定位到半径、高度或格式 |

`test.exact_match` 是逐条自由生成的完整命令匹配率；不是把正确答案前文交给模型后的 token 准确率。比较前后结果时，以文件实际输出为准，不预设必须获得某个分数。

已有 `runs/base.pt` 会被复用。想改变预热步数或数据后重新比较，应使用一个新的输出目录，避免把不同基座当成同一实验。

## 检查是否真的学会了条件

先看训练集能否拟合，再看留出几何的完整输出。若答案总是 `CYL 2 4`，格式可能有效，却没有使用输入中的数值。修改输入半径、保持高度不变，检查输出是否只在相应参数改变；后面的[连接器实验](./alignment)会进一步把条件置零或打乱。

从这一步开始，loss 下降只作为训练是否发生的信号，不能替代任务是否完成的证据。

[对应主线：真实模型微调](./pretrained) · [继续看原理：LoRA 与冻结](./lora)
