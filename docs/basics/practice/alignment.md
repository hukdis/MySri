---
id: basic-practice-0005
title: 多模态连接：冻结语言模型，只训练输入接口
navTitle: 连接器与冻结梯度
category: basics
type: concept
tags:
- 技术实践
- 多模态对齐
- 连接器
prerequisites:
- basic-practice-0003
related:
- cad-0105
- cad-0104
- basic-practice-0008
sources:
- https://github.com/TinyLLaVA/TinyLLaVA_Factory
- https://arxiv.org/abs/2411.04954
status: draft
reviewed: false
order: 72
created: '2026-10-22'
updated: '2026-10-23'
outline:
- 2
- 2
practiceGroup: lab
---
# 多模态连接：冻结语言模型，只训练输入接口

先读[多模态输入专题](./multimodal)，再用本页的小实验观察连接器如何获得梯度。实验把合成点云转成已知几何属性，冻结教学解码器，只训练条件接口。

## 先看完整信息流

**合成圆柱点云 → 固定几何特征 → 连接器 → 六个软前缀向量 → 冻结的语言模型 → 命令。**

本实验不是训练视觉识别：点云由圆柱参数生成，固定几何编码器直接计算最大径向距离和高度，得到两个归一化属性。它刻意降低感知难度，让我们集中检查连接器怎样学、冻结模型怎样参与反传。真实点云缺失、噪声和复杂结构均不在这个编码器的能力验证范围内。

## 固定编码器输出什么

合成点云包含底部和顶部两个圆环，共 32 个三维点。编码器得到 `[radius / 6, height / 6]`，形状为 `[batch, 2]`。连接器通过两层小网络，把它映射为 `[batch, 6, 48]`。

<<< ../../../examples/technical-practice/lab.py#connector

为什么输出六个向量？文字模型的输入是六个词加边界标记，本章用六个连续向量替换这段文字的位置，保留统一的序列接口。软前缀可以直接参与计算，不需要先取最近的文字 token；维度 48 与教学语言模型的嵌入宽度相同。

这个数量属于教学设计，不是 CAD-MLLM 的实际连接器结构。TinyLLaVA 的模块划分与 [CAD-MLLM](https://arxiv.org/abs/2411.04954)提供了理解冻结编码器、连接器和语言模型关系的参照。

## 这里的对齐怎样发生

训练时，某个点云特征与同一对象的目标命令配对。连接器产生软前缀，语言模型据此前缀预测答案，仍计算[答案区交叉熵](./sft#answer-loss)。梯度经解码器传回连接器，使它的输出逐渐对命令预测有用。

本实验没有加入 CLIP 式对比损失，也没有显式让某个点与某个文字词对齐。**相同维度只解决接口形状，学习目标和配对数据才提供任务信号。**

| 部分 | 前向是否运行 | 参数是否更新 |
| --- | --- | --- |
| 固定几何编码器 | 是 | 否；手写函数无训练参数 |
| 连接器 | 是 | 是 |
| 教学语言模型 | 是 | 否 |

## 冻结权重，不等于关闭梯度链路

```python
model.requires_grad_(False)
soft_prefix = connector(features)
logits = model(input_ids, soft_prefix)
loss = answer_loss(logits, labels)
loss.backward()
```

这里不应在语言模型前向外套 `torch.no_grad()` 或把 logits `detach()`。它的权重不用梯度，但连接器需要通过它获得“软前缀改变后答案损失怎样变化”的梯度。若剪断链路，连接器即使列在优化器中也无法学习。

## 运行与检查

先完成 SFT，确保相同目录中有 `sft.pt`：

```powershell
python lab.py sft --steps 400 --data-dir data --output runs
python lab.py align --steps 400 --data-dir data --output runs
python check_cad.py runs/align-metrics.json
```

输出保存在 `align-metrics.json`。`trainable_parameters` 应只包含连接器，`changed_parameter_names` 应以 `connector.` 开头，`frozen_changed` 应为空。

先检查训练样本能否拟合，再读留出样本。若训练本身失败，问题可能在连接器、前缀接口或冻结解码器的可适配性；这时不能只把错误归咎于测试形状复杂。

## 怎样排除模型只会背命令

脚本还执行两项条件消融：

- **zero_condition**：将特征置零，所有输入失去数值信息。
- **shuffled_condition**：在测试样本间交换特征，但保留原目标，故意破坏配对。

如果正确配对明显好于这些消融，支持模型利用了本实验中的条件信息；如果结果几乎不变，就要检查是否只是输出常见命令。消融不是额外训练，也没有更新权重。

这些结果不能证明真实视觉—语言语义对齐。它们只回答这个连接器是否能把已知几何属性接到已训练解码器，为阅读实际多模态论文提供可操作的参照。

[回到多模态专题](./multimodal) · [查看评估与排错](./evaluation)
