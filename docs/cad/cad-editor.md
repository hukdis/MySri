---
id: cad-0108
title: CAD-Editor：先定位修改区域，再补全编辑后的 CAD 序列
navTitle: CAD-Editor
outline:
  - 2
  - 2
category: cad
type: paper
tags:
  - 论文阅读
  - 指令编辑
prerequisites:
  - cad-0101
  - cad-0003
related:
  - cad-0002
  - cad-0106
  - cad-0109
order: 27
sources:
  - sources/论文/先读/CAD-Editor.md
  - 'https://arxiv.org/abs/2502.03997'
status: draft
reviewed: false
created: '2026-10-07'
updated: '2026-10-22'
---
# CAD-Editor：先定位修改区域，再补全编辑后的 CAD 序列

<!-- cad-v2-context -->
> **研究任务 · CAD编辑** · [研究总览](/cad/) · [九篇详读](/cad/reading-navigation?reading=1)
<!-- /cad-v2-context -->

“把圆柱变高一点，同时缩小直径”听起来只是局部修改，但模型若重新生成整条 CAD 序列，可能连不相关的结构也一起改变。编辑的目标不仅是得到新形状，还包括确定哪些内容应该保留。

**CAD-Editor 将这个目标拆成先定位、再补全。** 它先自动构造“原模型—指令—目标模型”的训练样本，再从模型对中生成修改区域监督，最后让语言模型围绕该区域生成新内容。读这篇论文，应沿着“修改数据从哪里来—位置怎样确定—位置确定后是否更容易改对”推进。

## 阅读前需要了解的技术 {#technical-primer}

本文不是从零学习 CAD 语言，而是微调已有模型，使它围绕原序列中的修改区域生成新内容。需要先区分监督训练、序列定位和补全。

### 指令微调与 LoRA：用编辑答案改变模型参数 {#primer-edit-finetuning}

训练样本包括原序列、编辑指令及目标序列，模型学习在给定输入时提高正确输出 token 的概率。这个过程更新参数，区别于推理时临时给几个示例。本文使用 LoRA：冻结原模型权重，学习较小的低秩增量。数据合成中的视觉大模型，与最终接受序列及指令的编辑模型，是不同环节。

### LCS：用共同 token 找出可保留的内容 {#primer-lcs}

最长公共子序列（LCS）寻找两条序列中顺序相同、但不必连续的最长共同部分。用原序列和目标序列作比较，可以把共同内容视为保留候选，把其余部分标成修改区域。例如示意序列 `A B C D` 与 `A B X D` 的共同部分是 `A B D`。这只是 token 层面的对应，不保证等于唯一正确的几何编辑位置。

### mask 与 infill：给定缺口，生成修改后的内容 {#primer-infilling}

mask 是占位标记，表示哪些位置待修改或插入；infill 指依据原模型、指令及带 mask 的序列生成最终编辑结果。定位阶段先决定缺口，补全阶段再生成变化。这里不是简单给原图某块像素涂黑，也不能直接套用 BERT 的掩码词恢复机制：本文用指令模型学习这两类序列任务。

### 人工筛选再训练：把较好候选变成新监督数据 {#primer-selective-training}

作者先生成多个编辑候选，由人工选择较好结果形成 selective dataset，再继续微调。选择发生在训练数据准备阶段，不等于每次部署推理都有人工兜底，也不能直接称为 DPO：只有优选数据继续监督训练，与使用优选/劣选成对损失是不同机制。

**理解示例**：指令要求提高圆柱高度，定位模型标记相关区域，补全模型给出新序列。LCS 提供的是训练时从已知编辑对中构造定位监督的方法；推理时没有目标序列，仍需要模型根据指令预测位置。

概念依据：[LoRA 原论文](https://arxiv.org/abs/2106.09685)；LCS 监督、定位后补全与人工筛选见 [CAD-Editor §4–5](https://arxiv.org/abs/2502.03997)。

配套实践：[理解指令适配中的 LoRA](/basics/practice/lora)。

## 一次编辑包含两个目标：改变指定部分，保留其余部分 {#_3-问题、输入输出与必要术语}

<PaperFigure src="/papers/cad-editor/figure02_task.png" title="CAD-Editor 原图 2：任务输入输出" source="https://arxiv.org/abs/2502.03997" :page="3" />

<!-- figure-translation:/papers/cad-editor/figure02_task.png -->
**原文翻译（图注）**

图2：左侧为 CAD-Editor 的输入与输出示例。输入由原始 CAD 序列和编辑指令构成，输出为编辑后的 CAD 序列。为节省空间，具体序列缩写为“[原始 CAD 序列]”或“[编辑后 CAD 序列]”。右侧展示一条具体 CAD 序列及其渲染模型。

**关键标记**

示例指令：“增大圆柱的高度，并以中心为基准减小其直径。”

::: details 对照英文原文

Figure 2. Left: Example input and output for CAD-Editor. The input combines the original CAD sequence with the editing instruction, and the output is the edited CAD sequence. The specific CAD sequence is shortened to ‘[Original (or Edited) CAD Sequence]’ to save space. Right: An illustration for a specific CAD sequence and its rendered CAD model.
:::

**图表解读**
<!-- /figure-translation -->

图 2 中，输入是原始草图—拉伸序列与编辑指令，输出是编辑后的序列。与从零生成不同，系统必须理解原模型如何构成，再把“增加高度”“减小直径”落到对应的参数或操作上。（原文 §3。）

图中渲染帮助人理解变化，但推理输入仍是文本化序列与指令，并非用户截图直接驱动的多模态编辑。这个任务定义也限定了后面所谓“定位”：它首先是在序列中找修改区域，不是已经解决任意 B-rep 面、边选择。

## 先有真实变化，再把变化说成一条指令 {#_4-数据合成-先有-cad-对-再写编辑指令}

缺少大量人工编辑记录时，怎样获得训练三元组？作者先让模型发生变化，再为变化生成语言，而不是先随意写指令、再假设能找到准确目标。

<PaperFigure src="/papers/cad-editor/figure03_dataset.png" title="CAD-Editor 原图 3：训练数据合成" source="https://arxiv.org/abs/2502.03997" :page="4" />

<!-- figure-translation:/papers/cad-editor/figure03_dataset.png -->
**原文翻译（图注）**

图3：自动数据合成流水线示意。

**关键标记**

Design Variation Generation：设计变体生成；Stepwise Captioning：逐步描述。

::: details 对照英文原文

Figure 3. Illustration of automated data synthesis pipeline.
:::

**图表解读**
<!-- /figure-translation -->

图 3 从 DeepCAD 模型出发，用 **Hnc-CAD** 生成设计变体，再将原模型与变体、不同变体两两配对，形成增加、删除、替换等差异。随后利用渲染图与序列观察变化，先描述两者、再比较差异、最后压缩成指令。（§4。）

这种分步过程给指令生成提供了可追溯的变化依据。GPT-4o 处理视觉，LLaMA-3-70B 处理序列：前者更容易描述外形结构，后者更接近具体参数。但一个模型对可能存在多处差异，生成的一句话未必覆盖全部变化，因而合成监督仍可能有错。

:::: details 数据规模与划分

DeepCAD 约 178K 原模型按 90/5/5 分割并去重，合成约 **120K 编辑三元组**；从测试部分取 **2K 例**生成编辑对并人工检查。每例生成五个输出，共约 **10K 结果**参与评价。（§6.1。）

相关变体与逆向编辑应按原模型来源理解划分；最后三元组互斥不自动排除上游变体生成器的数据重叠。图像参与合成标注，不改变最终编辑器的序列输入定义。

::::

## 用不变部分界定修改范围，再生成变化部分 {#_5-方法-定位与补全如何训练}

<PaperFigure src="/papers/cad-editor/figure04_network.png" title="CAD-Editor 原图 4：定位与补全网络" source="https://arxiv.org/abs/2502.03997" :page="5" />

<!-- figure-translation:/papers/cad-editor/figure04_network.png -->
**原文翻译（图注）**

图4：(a)–(b)为先定位、后补全（Locate-then-Infill）框架的概览。(c)为输入与输出示例：左列以图例抽象表示，中列给出具体序列，右列展示渲染后的可视物体。

**关键标记**

Locating Stage／Infilling Stage：定位阶段／补全阶段。

::: details 对照英文原文

Figure 4. (a)-(b): Overview of Locate-then-Infill framework. (c): Examples of input and output, where the left column shows abstracted representations using legends, the middle column displays concrete sequences and the right column presents rendered visual objects.
:::

**图表解读**
<!-- /figure-translation -->

图 4 的定位模型读取原序列与指令，输出带 [mask](#primer-infilling) 的序列：保留部分复制，要改或插入的区域标记出来。补全模型再结合原模型、指令和 mask 结果生成最终编辑序列。（§5。）

定位监督来自原序列与目标序列的 **[LCS](#primer-lcs)（最长公共子序列）**：共同 token 作为保留内容，差异和插入处转为 mask，连续 mask 合并。这使监督能够从编辑对自动获得，而无需逐 token 人工标注。

沿着圆柱例子看，方法希望把注意力集中到高度、直径及相关操作。但 LCS 只按 token 对齐，不保证找到唯一的语义修改区域；重复结构或等价建模历史，都可能使文本差异与几何编辑含义错位。因此，定位后补全是一种结构约束，而不是正确编辑的保证。

作者还生成候选，由人工挑选较好结果形成 [selective dataset](#primer-selective-training) 后继续微调。这一训练步骤包含人工筛选，应与前面的自动合成区分。（§5。）

:::: details 模型、训练与候选预算

使用 **Llama-3-8B-Instruct**，[LoRA](#primer-edit-finetuning) rank 32、序列长度 1024，在 4 张 A800-80GB 上训练 70 epochs。定位与补全顺序运行，温度和 top-p 均为 0.9。评价每例五个输出，不能理解成确定性单候选结果。（§6.1。）

::::

## 先检验核心设计：定位是否比直接重写更稳 {#_7-2-消融不是所有指标都同向改善}

<PaperFigure src="/papers/cad-editor/table02_ablation.png" title="CAD-Editor 原表 2：消融实验" source="https://arxiv.org/abs/2502.03997" :page="8" />

<!-- figure-translation:/papers/cad-editor/table02_ablation.png -->
**原文翻译（表注）**

表2：消融研究。CAD-Editor-mini 使用包含1万个示例的小数据集训练。

**关键标记**

Basic／Step：基础／逐步描述；Direct／L-I：直接编辑／先定位后补全；HS：人工筛选。

::: details 对照英文原文

Table 2. Ablation studies. The CAD-Editor-mini is trained on a small set with 10k examples.
:::

**图表解读**
<!-- /figure-translation -->

表 2 中，Direct 直接编辑的有效比例 VR 为 **86.1%**，Locate-then-Infill 为 **96.5%**。这一消融直接回应方法选择：先标出修改区域，再生成内容，在当前协议下更容易得到可解析、可渲染的模型。（§6，表 2。）

人工筛选又带来不同取舍：L-I & HS 的 VR 从 **96.5%** 变为 **95.6%**，CD 从 **1.13** 变为 **1.18**，但 D-CLIP 从 **0.03** 提高到 **0.11**，JSD 从 **0.67** 降至 **0.65**。因此，筛选改善了某些语义/分布指标，没有让所有指标同时更好。

小规模 10K 样本消融也显示分步描述优于直接写指令。它支持的是本文的数据合成流程，而不是任意任务采用分步提示都会受益。

## 模型能执行之后，距离“改对”还有多远 {#_7-实验-有效率与成功率的差距}

<PaperFigure src="/papers/cad-editor/table01_main.png" title="CAD-Editor 原表 1：主实验" source="https://arxiv.org/abs/2502.03997" :page="7" />

<!-- figure-translation:/papers/cad-editor/table01_main.png -->
**原文翻译（表注）**

表1：定量评价。SkexGen、Hnc-CAD、FlexCAD 和 Text2CAD 不支持基于文本的编辑，因此只比较它们的生成质量。JSD、CD 和 D-CLIP 的显示值乘以10²。↑表示越大越好，↓表示越小越好。

**关键标记**

VR：有效比例；H-Eval：人工评价。

::: details 对照英文原文

Table 1. Quantitative evaluations. SkexGen, Hnc-CAD, FlexCAD and Text2CAD do not support text-based editing, so only their generation quality is compared. JSD, CD, and D-CLIP values are scaled by 10². ↑: the higher the better, ↓: the lower the better.
:::

**图表解读**
<!-- /figure-translation -->

表 1 最值得并排看的两个数字是 **VR 95.6%** 与 **H-Eval 43.2%**。前者衡量能否解析并渲染，后者衡量人工认为文本对齐且视觉质量较高的成功情况。方法很大程度改善了可执行性，但正确完成编辑仍然困难。（§6，表 1。）

GPT-4o-IC 的对应结果为 **84.5% / 15.6%**，支持本方法在所列协议中的收益。表中若干生成方法不具有同样的文本编辑任务，只比较部分生成质量，不能将空缺的编辑指标当成它们在完整任务中全部失败。

:::: details 指标为何不能合成一个“约束保持率”

主方法 JSD 为 **0.65**、CD **1.18**、D-CLIP **0.11**，按原表乘以 100 显示。JSD 比较分布，CD 比较目标几何，D-CLIP 比较视觉变化与文本方向；H-Eval 为人工评价。它们都没有直接逐项验证所有未编辑约束是否保持。

尤其是模糊指令可能容许多个正确目标，CD 依赖具体参考，D-CLIP 也未必发现隐藏结构和精确尺寸错误。VR 高不能替代这些要求检查。

::::

## 单次局部修改，不等于长期编辑都能保持设计 {#_8-局限与多轮编辑的证据范围}

<PaperFigure src="/papers/cad-editor/figure10_iterative.png" title="CAD-Editor 原图 10：连续编辑示例" source="https://arxiv.org/abs/2502.03997" :page="9" />

<!-- figure-translation:/papers/cad-editor/figure10_iterative.png -->
**原文翻译（图注）**

图10：反复应用 CAD-Editor 编辑一个 CAD 模型，直至满足用户要求。

::: details 对照英文原文

Figure 10. Apply CAD-Editor iteratively to edit a CAD model until it meets user requirements.
:::

**图表解读**
<!-- /figure-translation -->

图 10 展示连续指令使模型逐步变化，但属于定性示例，没有同等规模的多轮稳定性基准。原文还指出多图标注成本及长上下文、长输出对复杂 CAD 的限制。（§7。）

把这些限制接回方法，可以看到错误传递的来源：定位一旦出错，补全会沿着错误区域修改；单次结果看似合理，也可能在多轮后逐渐丢失原有关系。后者是对系统链路的分析，并非论文已经测量的长期退化规律。

CAD-Editor 的贡献是为局部修改建立了可训练的结构。继续阅读时，应同时问“改在哪里、怎样改、其他部分是否保持”。[CADReview](/cad/cadreview) 从错误诊断提供修改位置，[CADTests](/cad/cadtests) 从实体属性提供要求检查；二者可以帮助区分编辑生成与编辑验证。

[原论文 PDF：CAD-Editor，2502.03997v2](https://arxiv.org/pdf/2502.03997) · [作者代码](https://github.com/microsoft/CAD-Editor)。图表出处及 PDF 页码见各图说明。

:::: details 论文信息与版本

<span id="_1-论文信息与方向定位"></span>

- **全名**：CAD-Editor: A Locate-then-Infill Framework with Automated Training Data Synthesis for Text-Based CAD Editing。
- **作者**：Yu Yuan、Shizhao Sun、Qi Liu、Jiang Bian。
- **年份与版本**：2025；所用版本为 arXiv **2502.03997v2，2025-07-03**，共 16 页。
- **来源**：[arXiv](https://arxiv.org/abs/2502.03997)、[作者代码链接](https://github.com/microsoft/CAD-Editor)。

::::

<!-- Published section anchors retained for incoming links. -->
<span id="_5-1-定位阶段"></span>
<span id="_5-2-补全阶段"></span>
<span id="_5-3-训练与推理设置"></span>
<span id="_6-数据划分与指标"></span>
<span id="_7-1-主结果"></span>
<span id="_9-放回方向地图-与生成和修复区别开"></span>
<span id="_10-阅读自测与阅读卡"></span>
<span id="_11-来源与核查记录"></span>

<!-- cad-v2-relations -->
::: details 研究树关联：发展关系、资源与问题

### R09 · 相关基础

[DeepCAD](/cad/deepcad) → [CAD-Editor](/cad/cad-editor)

CAD-Editor从DeepCAD出发构造原始模型和编辑数据。

原文位置：原文§4、§6。

### R10 · 相关基础

[HNC-CAD](/cad/papers/xu23) → [CAD-Editor](/cad/cad-editor)

CAD-Editor用HNC-CAD生成设计变体，再抽取差异并形成编辑三元组。

原文位置：原文§4，数据合成。

资源：[CAD-Editor编辑三元组](/cad/datasets/ds_cadeditor)。

问题：[I-C-01](/cad/issues/i-c-01)。

[CAD编辑](/cad/tasks/editing) · [发展关系](/cad/relationships)
:::
<!-- /cad-v2-relations -->
