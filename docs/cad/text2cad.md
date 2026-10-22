---
id: cad-0102
title: Text2CAD：从不同详细程度的文本生成 CAD 建模序列
navTitle: Text2CAD
outline:
  - 2
  - 2
category: cad
type: paper
tags:
  - 论文阅读
  - 条件生成
prerequisites:
  - cad-0101
  - cad-0003
related:
  - cad-0002
  - cad-0103
  - cad-0108
order: 21
sources:
  - sources/论文/先读/Text2CAD.md
  - 'https://arxiv.org/abs/2409.17106'
status: draft
reviewed: false
created: '2026-10-07'
updated: '2026-10-22'
---
# Text2CAD：从不同详细程度的文本生成 CAD 建模序列

<!-- cad-v2-context -->
> **研究任务 · CAD生成** · [研究总览](/cad/) · [九篇详读](/cad/reading-navigation?reading=1)
<!-- /cad-v2-context -->

用户说“做一个圆柱形物体”，和详细给出草图、坐标、半径及拉伸深度，虽然都在描述 CAD，却给出了完全不同的信息。前一种描述容许多个合理设计，后一种则更接近一份可执行的建模说明。

**Text2CAD 的主线是让同一个生成器接住不同详细程度的语言。** 难点首先出现在数据上：只有 CAD 操作历史，没有与不同用户表达相对应的文字；然后才是模型如何把文字逐步变成建模操作。本文依次解决这两步，最终仍输出草图—拉伸序列。

## 阅读前需要了解的技术 {#technical-primer}

本文有两条不同流程：大模型辅助制作文字标注，生成网络学习把文字变成 CAD。下面四个概念主要用于理解后一条流程。

### BERT 与文本特征：把一句话变成一组数值表示 {#primer-bert}

文本先被拆成 token，即模型处理的文字片段，再映射成向量。BERT 根据上下文更新这些向量：同样是“孔”，与“中心”“贯穿”“两个”连用时，表示应包含不同信息。输入是 token 序列，输出是上下文相关的文本特征；在本文中，它负责提供语言条件，不直接输出 CAD 命令。

### 交叉注意力：生成 CAD 时读取相关文字 {#primer-cross-attention}

与在同一序列内汇总信息的自注意力不同，交叉注意力让一条序列读取另一条序列。这里 CAD 解码状态提供查询，文本特征提供可读取的内容，输出是加权汇总的语言信息。例如预测拉伸参数时，模型有机会利用“高度”附近的信息；这种读取是学习得到的，不是人为把某个词硬绑定到某条命令。

### 自回归与 teacher forcing：训练和使用时的前文不同 {#primer-autoregression}

自回归按顺序预测下一个 CAD token，并把已生成内容作为后续条件。训练常用 **teacher forcing**：提供正确的前序 token，让模型学习正确后续；推理时则只能接着自己的输出生成。因此，前面一次预测错误可能传到后面。训练的交叉熵损失惩罚“正确下一个 token 的预测概率过低”，不是直接检查最终实体的几何约束。

### 文本—CAD 对齐：让描述和建模目标对应 {#primer-text-cad-alignment}

在这里，“对齐”先指数据配对：同一条描述应对应正确 CAD 及其操作，再通过条件生成训练学习这种关系。它不是把两个坐标系叠合，也不表示每个词都已经对应唯一操作。Adaptive Layer（适配层）对 BERT 特征做可训练变换，帮助 CAD 解码器使用语言信息；是否真正符合要求，还要检查生成实体。

**理解示例**：输入“中间有贯通孔的圆柱”，BERT 提供文本特征，解码器边读取文本边生成草图与拉伸 token，最后执行成实体。代码能执行，并不能代替“孔是否真的贯穿”的检查。

概念依据：[BERT 原论文](https://arxiv.org/abs/1810.04805)、[Transformer 原论文](https://arxiv.org/abs/1706.03762)；具体应用见 [Text2CAD §3–4](https://arxiv.org/abs/2409.17106)。

## 同一个模型，为什么需要四种描述 {#_3-问题、输入输出与必要术语}

<PaperFigure src="/papers/text2cad/figure04_prompt_levels.png" title="Text2CAD 原图 4：四级文本提示" source="https://arxiv.org/abs/2409.17106" :page="7" />

<!-- figure-translation:/papers/text2cad/figure04_prompt_levels.png -->
**原文翻译（图注）**

图4：Text2CAD Transformer 使用不同文本提示生成参数化 CAD 模型。文本提示遵循一定结构，强调 CAD 构建流程中不同的设计要素，并以不同颜色区分。

**关键标记**

L0–L3：抽象级、初学者级、中等级、专家级；逐级增加描述细节。

::: details 对照英文原文

Figure 4: Parametric CAD model generation by Text2CAD transformer using different text prompts. Our text prompts follow a certain structure highlighting the different design aspects of CAD construction workflow (shown in different colors).
:::

**图表解读**
<!-- /figure-translation -->

图 4 用同一目标展示四级文本：L0 概括外形，L1 给出简单建模描述，L2 增加几何与过程信息，L3 明确更多参数和步骤。它们不是模型能力从初级到专家的四个档位，而是**输入信息量的四种条件**。（原文图 4，§3。）

沿着图中的圆柱形例子看，抽象描述没有唯一指定内部结构和尺寸；当文本增加同心圆、平面和拉伸深度时，可能的目标才逐渐收窄。因此，不能用“与唯一参考模型相同”概括所有级别的正确性。这一差别会一直影响后面的训练与评价。

## 第一处困难：看见外形，不等于知道建模参数 {#_5-1-标注流水线}

如果直接让视觉模型看渲染图写出详细指令，隐藏结构、坐标和精确深度未必可见。Text2CAD 因而把图像能够提供的形状信息，与操作历史能够提供的过程信息结合起来。

<PaperFigure src="/papers/text2cad/figure02_annotation.png" title="Text2CAD 原图 2：标注流水线" source="https://arxiv.org/abs/2409.17106" :page="4" />

<!-- figure-translation:/papers/text2cad/figure02_annotation.png -->
**原文翻译（图注）**

图2：Text2CAD 数据标注流水线。该流程生成不同复杂程度的多层次文本提示，用于描述 CAD 模型的构建过程。采用两个阶段：第一阶段使用视觉语言模型（VLM）生成形状描述；第二阶段使用大语言模型（LLM）生成多层次文本标注。

**关键标记**

Minimal Metadata Generator：最小元数据生成器；NLI：自然语言指令。

::: details 对照英文原文

Figure 2: Text2CAD Data Annotation Pipeline: Our data annotation pipeline generates multi-level text prompts describing the construction workflow of a CAD model with varying complexities. We use a two-stage method - (Stage 1) Shape description generation using VLM (Stage 2) Multi-Level textual annotation generation using LLM.
:::

**图表解读**
<!-- /figure-translation -->

图 2 的两条信息流最后汇合：一边渲染模型及中间部件的视图，用 LLaVA-NeXT 等模型获取外形描述；另一边把原始 CAD JSON 转成更简洁的元数据，保留草图、坐标和拉伸信息。标注模型结合二者生成详细建模语言，再通过示例提示得到 L0–L3 描述。（§3。）

这一设计的作用是让语言与可执行的过程发生对应，而不只是给每个模型附上一句外形标签。但它也带来一项取舍：文字来自合成流水线，可能包含固定表达和标注模型的误解。配对数量增加，不等于真实用户语言的多样性已经被覆盖。

:::: details 标注版本与数据规模

来源为 DeepCAD；摘要报告约 **170K 模型、660K 文本标注**，实验部分约 150K 训练 CAD，测试与验证各约 8K，每个模型有四级文本。不同描述共享几何来源，不能把文本条数视为独立模型数；划分应以几何模型为单位理解。

v1 的图与正文对 Mistral/Mixtral 系列标注模型的写法不完全一致，复现需核对代码中的具体权重。论文报告标注耗时约 **10 天**，它与生成器训练耗时是两项不同成本。（§3、§5。）

::::

## 第二处困难：一句话如何约束每一步建模 {#_5-方法-标注流水线与生成网络分开读}

配对数据准备好以后，还需要让生成器在预测具体操作时使用文本。Text2CAD 没有直接把最终生成器做成标注阶段使用的大模型，而是用 [BERT](#primer-bert) 编码语言、专用 Transformer [自回归](#primer-autoregression)解码 CAD token。

<PaperFigure src="/papers/text2cad/figure03_network.png" title="Text2CAD 原图 3：生成网络" source="https://arxiv.org/abs/2409.17106" :page="6" />

<!-- figure-translation:/papers/text2cad/figure03_network.png -->
**原文翻译（图注）**

图3：网络结构。Text2CAD Transformer 的输入为文本提示 T 和长度为 t−1 的 CAD 子序列 C1:t−1。使用预训练 BeRT 编码器[7]及其后的可训练自适应层，从 T 中提取文本嵌入 Tadapt。该嵌入与 CAD 序列嵌入 F⁰t−1 一起经过 L 个解码器模块，以自回归方式生成完整 CAD 序列。

**关键标记**

Cross-Attention：交叉注意力；Trainable／Frozen：可训练／冻结参数。

::: details 对照英文原文

Figure 3: Network architecture: Text2CAD Transformer takes as input a text prompt T and a CAD subsequence C1:t−1 of length t−1. The text embedding Tadapt is extracted from T using a pretrained BeRT Encoder ([7]) followed by a trainable Adaptive layer. The resulting embedding Tadapt and the CAD sequence embedding F0t−1 is passed through L decoder blocks to generate the full CAD sequence in auto-regressive way.
:::

**图表解读**
<!-- /figure-translation -->

图 3 中，文本先经过预训练 BERT，再经过可训练的 Adaptive Layer；CAD 解码器读取前序 token，通过[交叉注意力](#primer-cross-attention)获取文本条件，预测下一个 CAD token。沿用前面的例子，当文本提供同心圆与拉伸深度时，这些条件应在相应的草图、拉伸步骤中发挥作用。（§4。）

Adaptive Layer 的任务是将通用语言特征适配到 CAD。这个选择可以通过去除该层的实验检验，而不必仅凭网络图推断它一定有效。训练时使用真实前序 token，推理时使用自己生成的前序输出，所以前一步错误也可能影响后续建模。

:::: details 表示与网络设置

输出采用遵循 CAD-SIGNet 等工作的草图—拉伸 token，包括二维坐标和曲线、环、面、草图、拉伸等结构标记，连续值量化为 **256 档**。它不是 DeepCAD 的“六类命令 + 16 参数槽位”；最大 **272 个 CAD token** 也不能与 60 条命令直接比较。（§4、补充材料 §9。）

网络有 8 个解码块、8 个注意力头，前两层不使用交叉注意力。文本长度上限 512 tokens，文本特征维度 1024，CAD 嵌入维度 256。用交叉熵训练，推理采用 top-1 选择。论文报告 **160 epochs、单张 A100-80GB、约两天**。（§5。）

::::

## 先检验详细指令：语言适配有没有实际作用 {#_7-实验怎么读}

四级输入的信息不同，实验不能混为一个精度数字。论文先在参数最明确的 **L3 专家级提示**下，比较操作与几何恢复。

<PaperFigure src="/papers/text2cad/table01_expert.png" title="Text2CAD 原表 1：L3 提示下的结果" source="https://arxiv.org/abs/2409.17106" :page="8" />

<!-- figure-translation:/papers/text2cad/table01_expert.png -->
**原文翻译（表注）**

表1：DeepCAD[55]与本文方法的定量比较，AL 表示自适应层。只使用专家级（L3）提示计算分数。结果包括几何基元和拉伸的 F1 分数，以及 CD 的均值、中位数和 IR。CD 的显示值乘以10³。

**关键标记**

IR：无效比例；w/o AL：去掉自适应层。

::: details 对照英文原文

Table 1: Quantitative evaluation between DeepCAD [55] and our method (AL is Adaptive Layer). The scores are evaluated only for Expert Level (L3) prompts. The results include F1 scores for primitives and extrusions as well as mean and median CD and IR. CD is multiplied by 10³.
:::

**图表解读**
<!-- /figure-translation -->

表 1 中，Text2CAD 中位 CD 为 **0.37**、无效比例 IR 为 **0.93%**；去掉 Adaptive Layer 后为 **0.82、2.69%**。这组消融支持语言适配在当前设置中有帮助，也把网络中的设计选择与可观察结果连接起来。（§5，表 1；CD 乘以 1000 显示。）

不过，线、弧、圆、拉伸的 F1 分别为 **81.13 / 36.03 / 74.25 / 93.31**，不同操作的恢复难度差异很大。平均 CD **26.41** 又远高于中位数 **0.37**，提示少数较差样本会拉高误差。仅看中位数和低无效率，会遗漏这些失败。

比较基线时还要保留任务条件：这里的 DeepCAD 是增加了文本适配的两阶段基线，由 BERT 特征映射到潜空间再解码，并非原始无条件生成模型。

## 再回到抽象描述：偏好不等于精确满足要求 {#_7-2-偏好评价并不是全面领先}

<PaperFigure src="/papers/text2cad/table02_preferences.png" title="Text2CAD 原表 2：自动与人工偏好评价" source="https://arxiv.org/abs/2409.17106" :page="9" />

<!-- figure-translation:/papers/text2cad/table02_preferences.png -->
**原文翻译（表注）**

表2：每个提示层级使用1000条提示所生成的 CAD 模型进行 GPT-4 评价，并对每个层级的100个样本开展用户研究。在两类评价中，总体上 Text2CAD 比 DeepCAD 更受偏好。

**关键标记**

Undecided：未作出选择。

::: details 对照英文原文

Table 2: We conduct GPT-4 evaluation of the CAD models generated from 1000 prompts per level and User studies of 100 samples per level. In both evaluations, overall Text2CAD is a favored choice over DeepCAD.
:::

**图表解读**
<!-- /figure-translation -->

表 2 用自动评价和 CAD 设计者偏好，补充单一参考几何距离不能充分表达的质量。但结果没有显示所有级别都占优：自动评价中 L1 的偏好比例为 **48.35%**，低于基线 **51.15%**；人工评价中 L0 为 **49.05%**，低于基线 **50.95%**。详细的 L2–L3 整体更有利于 Text2CAD。（§5，表 2。）

把这项结果与开头联系起来，较合理的理解是：语言给出更多过程与参数时，条件解码更容易利用明确约束。它不是证明模型已理解任何抽象设计意图；偏好评价也没有逐项验证每个孔、每个尺寸是否正确。

:::: details 两类评价的统计口径

表 1 通过草图环匹配计算基元 F1，另报告 CD 与 IR，仅针对 L3。表 2 自动评价每级 1000 个提示，用户研究每级 100 个样本、五名不同经验的 CAD 设计者。原表标题使用 GPT-4 评价，正文记录 GPT-4V。两类协议不能相互替换，也不应把偏好比例解释为工程约束全部满足率。

::::

## 闭合的实体，仍可能是答错的模型 {#_8-局限与失败案例}

<PaperFigure src="/papers/text2cad/figure09_failures.png" title="Text2CAD 原图 9：无效结果与文本不匹配" source="https://arxiv.org/abs/2409.17106" :page="17" />

<!-- figure-translation:/papers/text2cad/figure09_failures.png -->
**原文翻译（图注）**

图9：Text2CAD Transformer 的失败案例。左侧的无效样本中，网络未能生成任何有效的 CAD 模型；右侧的不一致案例中，生成的 CAD 模型与输入文本提示不符。

**关键标记**

Invalidity：无效模型；Discrepancy：生成结果与文本不一致。

::: details 对照英文原文

Figure 9: Failure cases for Text2CAD Transformer. Invalid Samples (left): The network fails to generate any valid CAD model. Discrepancy Cases (right): The generated CAD model does not match the input text prompts.
:::

**图表解读**
<!-- /figure-translation -->

图 9 把最后一道差别摆了出来：左侧输出不能构建有效实体，右侧虽然能构建，却与文本描述不符。前者是执行与几何有效性问题，后者是条件遵从问题。IR 很低，只能回答前一类问题，不能消除后一类错误。（补充材料图 9。）

作者还指出多视图透视失真会影响标注，DeepCAD 分布偏向矩形和圆柱类形状，复杂形状泛化受限。（§6。）这些限制与方法链路一一对应：标注误差进入训练语言，操作分布限制可学结构，逐步解码又可能累积预测误差。

Text2CAD 因而把 CAD 生成向用户语言推进了一步，但没有让“形状相似”“能够执行”“满足文字要求”成为同一件事。[CAD-Llama](/cad/cad-llama) 进一步组织语言与局部代码的对应；[CADTests](/cad/cadtests) 则直接检验要求，而不是仅以几何距离或偏好判断结果。

[原论文 PDF：Text2CAD，2409.17106v1](https://arxiv.org/pdf/2409.17106)。图表出处及 PDF 页码见各图说明。

:::: details 论文信息与版本

<span id="_1-论文信息与方向定位"></span>

- **原 PDF 标题**：Text2CAD: Generating Sequential CAD Models from Beginner-to-Expert Level Text Prompts。
- **作者**：Mohammad Sadil Khan、Sankalp Sinha、Talha Uddin Sheikh 等。
- **年份与版本**：2024；所用版本为 arXiv **2409.17106v1，2024-09-25**，共 21 页，含补充材料。矩阵中使用 “Designs” 的标题写法；本笔记保留下载版本中的 “Models”，指向同一论文标识。
- **来源**：[arXiv](https://arxiv.org/abs/2409.17106)、[矩阵中的出版标识](https://doi.org/10.52202/079017-0242)、[作者项目页](https://sadilkhan.github.io/text2cad-project/)。

::::

<!-- Published section anchors retained for incoming links. -->
<span id="_4-cad-表示-继承什么-改变什么"></span>
<span id="_5-2-cad-生成网络"></span>
<span id="_6-数据、划分与指标"></span>
<span id="_7-1-详细提示下的主结果"></span>
<span id="_9-放回方向地图-并与-deepcad-连接"></span>
<span id="_10-阅读自测与阅读卡"></span>
<span id="_11-来源与核查记录"></span>

<!-- cad-v2-relations -->
::: details 研究树关联：发展关系、资源与问题

### R07 · 相关基础

[DeepCAD](/cad/deepcad) → [Text2CAD](/cad/text2cad)

Text2CAD对DeepCAD模型构造多层次文本描述，用于文本条件CAD序列学习。

原文位置：Text2CAD §3，Data Annotation。

### R12 · 相关基础

[Text2CAD](/cad/text2cad) → [CIT-CAD](/cad/papers/du26)

CIT-CAD使用Text2CAD相关样本构建其验证实验；不等于采用Text2CAD生成网络。

原文位置：Du26 §IV.A，第7页；预处理说明。

资源：[Text2CAD](/cad/datasets/ds_text2cad)。

[CAD生成](/cad/tasks/generation) · [发展关系](/cad/relationships)
:::
<!-- /cad-v2-relations -->
