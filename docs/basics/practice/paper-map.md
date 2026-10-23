---
id: basic-practice-0010
category: basics
type: concept
tags:
- 技术实践
prerequisites: []
related:
- cad-0101
- cad-0102
- cad-0103
- cad-0104
- cad-0105
- cad-0106
- cad-0107
- cad-0108
- cad-0109
sources:
- https://arxiv.org/abs/2105.09492
- https://arxiv.org/abs/2409.17106
- https://arxiv.org/abs/2505.04481
- https://arxiv.org/abs/2412.14042
- https://arxiv.org/abs/2411.04954
- https://arxiv.org/abs/2502.03997
- https://arxiv.org/abs/2412.13810
- https://arxiv.org/abs/2505.22304
- https://arxiv.org/abs/2605.07807
created: '2026-10-23'
title: 从 CAD 论文找到要学的技术
navTitle: 论文—技术—实践地图
practiceGroup: papers
order: 39
status: draft
reviewed: false
updated: '2026-10-23'
outline:
- 2
- 2
---
# 从 CAD 论文找到要学的技术

同一个术语在不同论文中承担的工作可能不同。先找到论文要解决的问题，再沿着输入、表示、模型和反馈追踪技术，比一次记住所有模型名称更容易。

下面依据本站已有九篇详读的技术导读组织。表中的论文机制应以链接中的原文为准；学习顺序与实验安排是本站的教学建议。

## 正在读哪篇论文

| 论文与原始出处 | 先掌握的技术 | 实践入口 |
| --- | --- | --- |
| [DeepCAD](/cad/deepcad#technical-primer) · [原文 §3–4](https://arxiv.org/abs/2105.09492) | CAD 序列、参数量化、Transformer、自编码器、潜空间 GAN | [表示与潜向量](./representation#latent)；[注意力](./multimodal#cross-attention) |
| [Text2CAD](/cad/text2cad#technical-primer) · [原文 §3–4](https://arxiv.org/abs/2409.17106) | BERT 特征、适配层、交叉注意力、自回归、teacher forcing、文字与 CAD 配对 | [条件输入与注意力](./multimodal)；[答案损失](./sft#answer-loss) |
| [CAD-Llama](/cad/cad-llama#technical-primer) · [原文 §3–4](https://arxiv.org/abs/2505.04481) | 领域继续预训练、指令微调、LoRA、分层代码及描述配对 | [真实 LoRA 微调](./pretrained)；[表示选择](./representation#programs) |
| [CAD-Recode](/cad/cad-recode#technical-primer) · [原文 §4](https://arxiv.org/abs/2412.14042) | FPS、Fourier 特征、点云投影、自回归代码微调、测试时采样筛选 | [点云特征](./multimodal#point-features)；[候选筛选](./feedback#candidate-selection) |
| [CAD-MLLM](/cad/cad-mllm#technical-primer) · [原文 §5](https://arxiv.org/abs/2411.04954) | 图像/点云编码器、Perceiver、投影、LoRA、分阶段多模态训练 | [连接器与 Perceiver](./multimodal#connectors)；[冻结梯度实验](./alignment) |
| [CAD-Editor](/cad/cad-editor#technical-primer) · [原文 §4–5](https://arxiv.org/abs/2502.03997) | 成对数据、LCS、修改定位、mask/infill、人工筛选与监督训练 | [定位与补全](./editing) |
| [CAD-Assistant](/cad/cad-assistant#technical-primer) · [原文 §3–4](https://arxiv.org/abs/2412.13810) | 工具调用、多模态观察、约束求解、推理上下文 | [工具与反馈](./feedback#tool-loop) |
| [CADReview](/cad/cadreview#technical-primer) · [原文 §4](https://arxiv.org/abs/2505.22304) | 视觉—代码定位、SFT、LoRA、空间操作学习、DPO、渲染反馈 | [反馈链](./feedback)；[偏好目标](./optimization#dpo) |
| [CADTests](/cad/cadtests#technical-primer) · [原文 §3–5](https://arxiv.org/abs/2605.07807) | B-rep 属性测试、变异测试、测试健全性与覆盖、执行反馈修正 | [评价与检查](./feedback#property-tests)；[几何要求检查](./text-cad) |

## 按依赖关系选择下一步

<MermaidDiagram title="从真实模型到 CAD 专题" caption="本站建议的学习关系；不是论文之间的继承关系。" code='flowchart TD
 A["模型加载与推理"] --> B["样本与 LoRA SFT"]
 B --> C["CAD 表示与序列"]
 C --> D["多模态条件输入"]
 C --> E["局部编辑"]
 C --> F["执行与评价"]
 F --> G["偏好学习与策略优化"]' />

已经能运行微调，可以从当前论文对应的专题开始。阅读 DeepCAD 时，应优先学习表示与潜空间；阅读 CAD-Assistant 时，应优先理解工具与状态反馈，不必先完成所有微调实验。

## 四类容易混淆的过程

| 过程 | 主要变化的是什么 | 阅读时怎样判断 |
| --- | --- | --- |
| 训练与微调 | 参数 | 看监督目标、损失、优化器和更新模块 |
| 推理时反馈修正 | 当前上下文、候选或建模状态 | 看观察、执行和下一轮输入 |
| 模态连接 | 输入特征与模型接口 | 看编码、维度、连接位置、配对训练 |
| 几何配准与求解 | 坐标变换或几何变量 | 看约束、坐标系与求解器 |

例如“对齐”可能指配对学习，也可能指空间坐标对齐。应先写清楚输入输出，不能只根据术语猜测实现。

## 实验能帮助理解到哪一步

真实模型主线完成权重加载、LoRA 训练及重载。`paper_tech.py` 提供量化、FPS/Fourier、注意力、LCS、候选检查与 DPO 标量目标的可运行示例。它们使用明确的教学输入，其中固定向量和候选不来自训练模型。

自编码器与 latent GAN、BERT/Perceiver、多模态编码器和完整 CAD 工具系统在专题中解释信息流，并给出原始来源与实现入口。运行这些简化实验，不等于已经训练或复现这些完整模型。

[从真实模型开始](./setup) · [进入表示专题](./representation)
