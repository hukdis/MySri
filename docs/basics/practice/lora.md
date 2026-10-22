---
id: basic-practice-0004
title: LoRA：只训练低秩增量，怎样证明原权重没变
navTitle: 03 · LoRA 与冻结
category: basics
type: concept
tags: [技术实践, LoRA, 参数冻结]
prerequisites: [basic-practice-0003]
related: [basic-practice-0007, cad-0103, cad-0108]
sources: [https://arxiv.org/abs/2106.09685, https://huggingface.co/docs/peft/en/quicktour]
status: draft
reviewed: false
order: 33
created: '2026-10-22'
updated: '2026-10-22'
outline: [2, 2]
---
# LoRA：只训练低秩增量，怎样证明原权重没变

上一课更新了整个模型。现在保持同一训练数据、同一答案损失和同一个教学基座，只改变可训练参数，观察 LoRA 到底减少了什么。

## 一层线性映射怎样加入增量

原层为 $y=Wx+b$，其中 $W$ 的形状为 $d_{out}\times d_{in}$。LoRA 增加两个小矩阵：

$$
y=Wx+b+\frac{\alpha}{r}BAx,
\quad A\in\mathbb{R}^{r\times d_{in}},\quad
B\in\mathbb{R}^{d_{out}\times r}.
$$

原权重冻结，只学习 A、B。新增参数为 $r(d_{in}+d_{out})$，而不是 $d_{in}d_{out}$。本实验 rank 为 4、alpha 为 8；当输入输出维度较大时，低秩增量减少需要优化的权重。

这没有消除原模型：它仍须加载并参与前向计算。可训练参数少，不代表推理模型或所有激活显存都按同样比例变小。[LoRA 原论文](https://arxiv.org/abs/2106.09685)描述了这一参数化。

## 最小实现

<<< ../../../examples/technical-practice/lab.py#lora

原模型先整体冻结，再将线性层替换成上面的包装。训练优化器只收集 `requires_grad=True` 的参数。本章注意力与前馈层为显式线性映射，所以可以直接观察 A/B；真实模型使用 PEFT 管理模块匹配，见[预训练模型课程](./pretrained)。

## 为什么 B 从零开始

本实现 A 随机初始化、B 为零。开始时增量 BA 为零，包装后的层与原层输出相同。第一次反向传播时，A 的梯度可能为零，B 则能够获得梯度；不能因一个矩阵首步未变就判断整个 LoRA 没有训练。

训练中更有意义的检查是：存在有效的可训练梯度，若干更新后增量发生变化，而所有冻结参数保持逐元素一致。

## 运行，并与全量更新分开保存

```powershell
python lab.py lora --steps 400 --data-dir data --output runs
python check_cad.py runs/lora-metrics.json
```

这一步读取 `runs/base.pt`，不是读取上一课微调后的 `sft.pt`。因此 SFT 与 LoRA 都从同一个预热起点适配 `BASE → CYL`，避免比较时起点不同。

| 检查项 | 全量 SFT | LoRA |
| --- | --- | --- |
| 基座来源 | 同一 base.pt | 同一 base.pt |
| 输入与答案 | 相同 | 相同 |
| 损失 | 答案区交叉熵 | 答案区交叉熵 |
| 可训练部分 | 全部权重 | 线性层 A/B |
| 结果文件 | sft-metrics.json | lora-metrics.json |

查看 `trainable_parameters` 与 `total_parameters`，计算可训练比例；查看 `changed_parameter_names`，应主要是 `.A`、`.B`；`frozen_changed` 应为空。脚本会对冻结参数前后进行逐元素比较，发现被改动就报错。

## 怎样判断这次适配有没有用

同时比较训练 loss、训练对象匹配率、留出对象匹配率。若训练对象能拟合而留出对象很差，首先检查数据覆盖和条件学习，不应只靠增大 rank 掩盖问题。若 loss 根本不降，再检查目标模块、梯度与学习率。

本章固定步数没有为两种方法分别做超参数搜索，因而只能展示机制与这个小任务的结果；不能据此宣称 LoRA 普遍优于或劣于全参数微调。

[下一课：只训练多模态连接器](./alignment)
