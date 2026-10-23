---
id: basic-practice-0012
category: basics
type: concept
tags:
- 技术实践
prerequisites:
- basic-practice-0011
related:
- cad-0102
- cad-0104
- cad-0105
- basic-practice-0005
sources:
- https://arxiv.org/abs/1706.03762
- https://arxiv.org/abs/2006.10739
- https://arxiv.org/abs/2103.03206
- https://arxiv.org/abs/2412.14042
- https://arxiv.org/abs/2411.04954
- https://github.com/TinyLLaVA/TinyLLaVA_Factory
created: '2026-10-23'
title: 文字、图像和点云怎样进入模型
navTitle: 多模态输入与注意力
practiceGroup: papers
order: 42
status: draft
reviewed: false
updated: '2026-10-23'
outline:
- 2
- 2
---
# 文字、图像和点云怎样进入模型

输入一句话、一张图片或一份点云，模型面对的是不同结构的数据。理解多模态方法时，先沿着“原始输入 → 特征 → 连接接口 → 生成目标”画出信息流，再看模型名称。

## 先分清三件工作

| 环节 | 负责什么 | 需要追问什么 |
| --- | --- | --- |
| 编码器 | 从文字、像素或点中提取特征 | 输出有多少位置，每个位置多少维？ |
| 连接与融合 | 将这些特征交给生成器使用 | 投影、前缀拼接还是交叉注意力？ |
| 条件训练 | 让输入有助于目标预测 | 同一对象怎样配对，哪些模块更新？ |

维度一致只建立可计算的接口；配对样本与训练目标才让模型学习怎样使用信息。先看 [Text2CAD 技术导读](/cad/text2cad#technical-primer)和 [CAD-MLLM 技术导读](/cad/cad-mllm#technical-primer)，比较文字编码与多模态编码的分工。

## 文字与图像先怎样编码

Text2CAD 使用的 BERT 将文字分成 token，再根据整句上下文更新特征。它在这里提供条件表示，CAD 解码器负责预测建模序列。编码文字与生成 CAD 是两个相互连接的模块。BERT 的定义见[原论文](https://arxiv.org/abs/1810.04805)，具体适配层与连接位置见 [Text2CAD](https://arxiv.org/abs/2409.17106)。

图像编码器则将像素组织成可供模型处理的视觉特征，可能包含多个图像位置或多个视图。读到“冻结视觉塔”时，表示其参数不更新，前向提取特征仍然运行。需要继续确认特征是否保留空间位置、怎样合并多视图，以及后面的生成器如何读取它们。

## 点云：先选点，再编码坐标 {#point-features}

```powershell
python paper_tech.py features
```

本例构造上下两个圆环的 16 个点，从第一个点出发，逐次选择离已选集合较远的点，保留 4 个位置。这个过程称为最远点采样（FPS）；它控制点数和空间覆盖，不负责识别零件。

<<< ../../../examples/technical-practice/paper_tech.py#features

Fourier 特征再为坐标加入不同频率的正弦、余弦。本例保留三维原坐标，并为频率 1、2 增加特征，输出形状为 `[4,15]`。改动频率表，观察每个点的特征维度和数值怎样变化。

原始 [Fourier Features 论文](https://arxiv.org/abs/2006.10739)讨论特征映射与高频函数学习；本站使用固定逐轴频率来展示形状变化。CAD-Recode 的 FPS、特征和投影参数应回查[其原文 §4](https://arxiv.org/abs/2412.14042)。

## 交叉注意力：一组位置读取另一组位置 {#cross-attention}

想象生成器正在预测拉伸高度，它需要从文字特征中读取相关信息。注意力把当前状态变成查询 Q，把可读取特征变成键 K 和值 V，再按相似度加权汇总。

$$
\operatorname{Attention}(Q,K,V)=\operatorname{softmax}\left(\frac{QK^\top}{\sqrt{d_k}}\right)V.
$$

运行一个固定向量例子：

```powershell
python paper_tech.py attention
```

<<< ../../../examples/technical-practice/paper_tech.py#attention

这里有 2 个查询、3 个可读取位置。输出包含 `[2,3]` 的权重矩阵；每一行权重和为 1，随后得到 2 个加权输出。修改某个 key，观察哪些权重发生变化。向量为手写数值，本例没有训练，也不把权重解释成真实词语的语义定位。

自注意力的 Q、K、V 来自同一序列；交叉注意力来自两组表示。Text2CAD 用 CAD 解码状态读取 BERT 文字特征，具体结构参见[原文](https://arxiv.org/abs/2409.17106)；公式来源见 [Transformer](https://arxiv.org/abs/1706.03762)。

## 连接器、投影和 Perceiver {#connectors}

投影层可以把 `[B,N,d_in]` 映射为 `[B,N,d_model]`，解决特征宽度问题。若输入位置太多，还可以用少量可学习查询，通过交叉注意力汇聚为 `[B,M,d_model]`，其中 M 小于 N。[Perceiver](https://arxiv.org/abs/2103.03206)提供了这种潜在瓶颈思路；CAD-MLLM 的具体使用见[原文 §5](https://arxiv.org/abs/2411.04954)。

这与把特征变成软前缀再拼到语言模型输入中是相关但不完全相同的设计。阅读时要确认“位置数量怎样变、维度怎样变、在哪里融合”，不能仅凭都叫 connector 就当成同一结构。

## 真正训练连接器时，再看梯度

接着进入[冻结解码器的连接器实验](./alignment)。它使用合成几何属性降低感知难度，训练一个小网络把条件接入已有解码器。重点观察：模型前向仍运行，权重保持冻结，但损失可以经过它传回连接器。

真实图像/点云编码器、缺失点和噪声超出这个小实验的范围。要看完整模块实现，可阅读 [TinyLLaVA Factory](https://github.com/TinyLLaVA/TinyLLaVA_Factory)的 Vision Tower、Connector 与 Training Recipe；该项目环境和模型规模与本站小实验不同，应独立配置。

## 分阶段训练在安排什么

多模态系统可以先训练连接接口，再让语言模型的部分参数参与适配；也可以按阶段加入新的输入模态。阶段变化时，训练数据、冻结模块和损失可能随之变化，应该逐项记录。

CAD-MLLM 的课程式训练涉及条件与模态组合的阶段安排，具体顺序和可训练模块见[原文 §5](https://arxiv.org/abs/2411.04954)。这与将两个点云坐标系进行配准属于不同问题；仅看模块输出维度也无法判断语义学习是否成功。

## 回到论文时写下四句话

用自己的话写清楚输入是什么、特征是什么、哪些参数训练，以及目标是什么。随后把条件置零或打乱配对，思考什么结果才能支持“模型用了输入”。条件使用与几何要求满足仍需分别评价。

[下一专题：编辑中的定位与补全](./editing)
