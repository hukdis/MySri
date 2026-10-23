---
id: basic-practice-0011
category: basics
type: concept
tags:
- 技术实践
prerequisites:
- basic-practice-0010
related:
- cad-0101
- cad-0103
- cad-0104
sources:
- https://arxiv.org/abs/2105.09492
- https://arxiv.org/abs/1406.2661
- https://arxiv.org/abs/2412.14042
- https://arxiv.org/abs/2505.04481
created: '2026-10-23'
title: CAD 怎样变成模型能学习的表示
navTitle: CAD 表示与序列生成
practiceGroup: papers
order: 40
status: draft
reviewed: false
updated: '2026-10-23'
outline:
- 2
- 2
---
# CAD 怎样变成模型能学习的表示

先想一个普通零件：在平面上画矩形，再拉伸成实体。你可以记录建模步骤、写一段建模代码，也可以保存实体的边界几何。三者对应的信息和可执行方式各不相同。

## 从一个具体建模过程开始

```text
草图：宽 10，深 6 的矩形
操作：拉伸高度 4
结果：一个长方体
```

序列模型需要把操作类型与参数编码成有限长度的数据。教学示意可以写成 `SKETCH RECT 10 6 EXTRUDE 4 EOS`。`EOS` 表示结束；实际论文还需要定义坐标系、操作参数、无效参数位置以及最大长度。

DeepCAD 学习的是草图与拉伸操作序列。它的命令表、参数设计和训练设置见[原文 §3–4](https://arxiv.org/abs/2105.09492)。这里的短序列只是帮助理解编码，不与其格式逐字段兼容。

## 先运行参数量化

无需安装深度学习库，在实验目录执行：

```powershell
python paper_tech.py representation --bins 256
python paper_tech.py representation --bins 16
```

程序对同一组归一化参数输出原值、整数 token、解码值与绝对误差。比较两次结果，观察档位数变化怎样影响还原误差。

<<< ../../../examples/technical-practice/paper_tech.py#representation

本例用 `round(x × (bins−1))` 把 `[0,1]` 映射到离散档位，再除以 `bins−1` 解码。它解释“预测一个类别怎样代表一个实数”；实际 CAD 参数的归一化与量化规则仍须查论文实现。

档位更多，分类空间也更大。即使各参数的误差很小，闭合轮廓或约束关系仍可能被破坏。因此，token 预测与几何有效性是两个需要分别检查的环节。

## 从序列到潜向量 {#latent}

DeepCAD 还有一条理解主线：**序列 → 编码器 → 潜向量 z → 解码器 → 恢复序列**。编码器把较长的操作信息汇入固定维度的表示，解码器尝试把它还原。

可以把一次训练理解为：输入已有零件的操作序列，恢复操作类型与参数，比较恢复目标，再更新编码器和解码器。z 是学习得到的内部表示，不能直接把它的某个维度当成“孔径”。

随机生成时需要新的 z。latent GAN 的生成器把噪声变成潜向量，判别器区分它与编码器产生的训练潜向量；生成的 z 再进入 CAD 解码器。自编码器先学习表示，GAN 再学习潜空间分布，二者的目标和数据流应分开看。

<MermaidDiagram title="恢复已有序列与随机生成" caption="信息流教学示意；本页量化脚本没有训练自编码器或 GAN。" code='flowchart LR
 S["已有序列"] --> E["编码器"] --> Z["潜向量"] --> D["解码器"] --> O["CAD 序列"]
 N["随机噪声"] --> G["latent GAN 生成器"] --> D' />

运行完整模型时，可从 [DeepCAD 作者实现](https://github.com/rundiwu/DeepCAD)的自编码器训练与 latent GAN 流程继续。先确认数据、环境和模型文件，再按其 README 执行；本页实验不下载其数据或权重。

## 代码表示又改变了什么 {#programs}

同一个长方体也可以用 CadQuery 表达：

```python
shape = cq.Workplane("XY").rect(10, 6).extrude(4)
```

这里预测的是代码 token。执行环境把程序解释成几何，语言模型则学习在给定条件下续写程序。[CAD-Recode](https://arxiv.org/abs/2412.14042)采用点云条件的 CadQuery 程序生成；[CAD-Llama](https://arxiv.org/abs/2505.04481)讨论带层次描述的代码表示与训练。

CAD-Llama 的 SPCC 还将代码按层次组织，并把相应描述与局部代码配对。这样“学习某个部件怎样建成”可以落到具体代码片段；它与只给整个程序附一句总描述的数据安排不同。表示与描述如何对应，应结合[其原文 §3–4](https://arxiv.org/abs/2505.04481)阅读。

程序能表达建模过程，但执行得到的 B-rep 还需要检查。B-rep 描述实体的面、边、顶点和拓扑关系，不能据此假设建模历史或设计意图都被保存。

## 自回归生成时，错误怎样传下去

训练常给模型正确的前序 token，让它预测下一个；使用时则接着自己的输出继续。前面把 `EXTRUDE` 或一个尺寸写错，后续预测读取的上下文就变了。

读到 teacher forcing 时，可以回看[答案区损失实验](./sft#answer-loss)。生成完成后再到[独立要求检查](./text-cad)，观察格式正确是否足以保证参数满足。

本页量化、短序列和长方体为教学示例。自编码器和 GAN 的定义参照 [GAN 原论文](https://arxiv.org/abs/1406.2661)，CAD 中的具体组合参照 [DeepCAD](https://arxiv.org/abs/2105.09492)。

[下一专题：多模态输入与注意力](./multimodal)
