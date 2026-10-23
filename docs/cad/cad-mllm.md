---
id: cad-0105
title: CAD-MLLM：统一文本、图像和点云条件的 CAD 生成
navTitle: CAD-MLLM
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
  - cad-0104
  - cad-0106
order: 24
sources:
  - sources/论文/先读/CAD-MLLM.md
  - 'https://arxiv.org/abs/2411.04954'
status: draft
reviewed: false
created: '2026-10-07'
updated: '2026-10-23'
---
# CAD-MLLM：统一文本、图像和点云条件的 CAD 生成

<!-- cad-v2-context -->
> **研究任务 · CAD生成** · [研究总览](/cad/) · [九篇详读](/cad/reading-navigation?reading=1)
<!-- /cad-v2-context -->

一张图可能遮住孔的背面，一段文字可能没有给尺寸，点云则可能存在缺失。面对同一个 CAD 目标，这些输入各有信息，也各有空白；分别训练不同生成器，并不能直接让它们共同利用这些信息。

**CAD-MLLM 尝试用一个语言模型承接文本、图像、点云及其组合。** 读这篇论文，要追踪统一所需的三个条件：数据是否描述同一个目标，不同模态怎样接入共享生成器，共享训练又是否真的改善了每种任务。最后一问的答案并非一律肯定。

## 阅读前需要了解的技术 {#technical-primer}

多模态输入不是把图片、点云和一句话直接拼成文件。本文需要先提取特征，再让语言模型学会用这些特征生成同一个 CAD 目标。

### 模态编码器与冻结：提取信息，不一定重新训练 {#primer-modality-encoders}

图像编码器把像素变成视觉特征，点云编码器把空间采样点变成几何特征；文本则经语言模型的分词与嵌入处理。“冻结”表示训练期间不更新该模块的参数，不表示不运行它。本文使用已有图像、点云编码器，主要训练后面的连接模块和语言模型的部分参数。

### Perceiver 与投影：压缩输入，建立可用接口 {#primer-multimodal-alignment}

Perceiver 用一组可学习的查询向量，通过注意力从较多输入特征中汇聚出较少表示；查询可以理解为参与训练的信息提取位置，不是人为写的文字问题。投影层再把特征映射到语言模型所需维度。本文所说的多模态对齐，涉及同一 CAD 的配对数据及可学习的特征连接，**不是空间坐标配准，也不是维度相同就已经语义一致**。

### LoRA 微调：主要训练连接和小规模权重增量 {#primer-lora}

微调从预训练权重开始，用任务样本计算误差并更新参数。LoRA 冻结原始语言模型权重，学习附加的低秩增量，减少可训练参数。本文同时学习 Perceiver、投影模块及 LoRA 参数；多模态特征不是固定接线后就自动可用，需要训练使它们有助于 CAD 预测。

### 条件生成与课程式训练：用 CAD 目标教会模型利用模态 {#primer-curriculum-training}

训练样本把文本、图像或点云条件与目标 CAD 序列配对，模型按前序内容预测后续 CAD token。语言建模损失提高正确 token 的概率，使条件特征能够参与生成。课程式训练则按阶段引入文本、点云和多视图，并组合当前可用模态；它是训练样本与条件的安排策略，不是另一种几何求解器。

**理解示例**：同一圆柱的图片、点云和描述，对应同一条建模序列。模型学习从不同输入预测这个目标；这种训练不等于逐词建立“圆柱”到某个面的对应表，更不保证尺寸与每条文字要求都正确。

概念依据：[Perceiver 原论文](https://arxiv.org/abs/2103.03206)、[LoRA 原论文](https://arxiv.org/abs/2106.09685)；对齐方式与训练设置见 [CAD-MLLM §5](https://arxiv.org/abs/2411.04954)。

配套实践：[多模态连接与 Perceiver](/basics/practice/multimodal#connectors) · [冻结梯度实验](/basics/practice/alignment) · [全部技术地图](/basics/practice/paper-map)。

## 统一模型之前，先统一它们要生成的对象 {#_4-数据与表示-更大数据并未扩大所有操作}

设想用户既有零件外观图，也有局部点云。训练时必须知道它们与哪条 CAD 操作序列对应，否则模型无从学习图像、点云和语言之间的关系。Omni-CAD 数据建设承担了这层[对齐](#primer-multimodal-alignment)。

<PaperFigure src="/papers/cad-mllm/figure02_dataset.png" title="CAD-MLLM 原图 2：扩展数据示例" source="https://arxiv.org/abs/2411.04954" :page="5" />

<!-- figure-translation:/papers/cad-mllm/figure02_dataset.png -->
**原文翻译（图注）**

图2：本文 CAD 命令序列数据集与 DeepCAD[1]数据集的定性比较。如第4节所述，DeepCAD 是本文所建数据集的一部分。展示本文数据集时，排除了已经收录在 DeepCAD 中的模型 ID。扩展部分包含更复杂、更接近真实、细节更多的模型。建议放大查看。

::: details 对照英文原文

Fig. 2: Qualitative comparison between our CAD command sequence dataset and DeepCAD [1] dataset. According to Sec. 4, DeepCAD dataset is part of our created dataset. In the visualization of our dataset, we exclude the CAD models’ IDs that have been included in the DeepCAD dataset. The extension part of our dataset contains more complex and realistic models with more details. Best viewed zoomed in.
:::

**图表解读**
<!-- /figure-translation -->

图 2 展示数据扩展。作者从 ABC/Onshape 来源获取建模信息，不再因为原模型含圆角或倒角就丢弃整个模型，而是逐个去掉这些操作，只要剩余模型拓扑完整就保留，再收集中间拉伸形状。（原文 §4.1。）

因此，**模型来源更丰富与输出操作范围更广，是两回事**：转换后的训练目标仍主要是草图—拉伸。每个目标再配视图、点云及文本，才能用于多模态条件学习。

:::: details 数据增强与独立性

初始约 **275,717 个模型**，通过中间步骤扩展到约 **453,220 条序列**。先按原始模型划分，再仅对训练部分增强；相关中间形状不能被视为同等数量的独立设计。

每个模型渲染 8 个视图，文本标注由 InternVL2-26B 随机读取 4 个视图；模型训练最多输入 2 个视图。这三个数量对应不同环节。最终训练/评测为 **425,726 / 27,494 条**，不能从增强后数量直接反推原始模型划分比例。（§4.1、§6.1。）

::::

## 不同输入不必变成同一种信息，但要能被同一生成器使用 {#_5-方法与计算资源}

<PaperFigure src="/papers/cad-mllm/figure04_network.png" title="CAD-MLLM 原图 4：多模态网络" source="https://arxiv.org/abs/2411.04954" :page="7" />

<!-- figure-translation:/papers/cad-mllm/figure04_network.png -->
**原文翻译（图注）**

图4：网络结构。网络能够处理三种单独的输入模态，或它们的任意组合；不同模态用不同颜色表示。图中展示最复杂的组合，即同时提供三种输入。除文本描述外，每种模态首先经过各自的冻结编码器，再进一步整合；随后通过可训练投影层，对齐到统一的语言特征空间。加入低秩适配（LoRA）的微调语言模型处理提示与投影后嵌入的组合，从而准确生成 CAD 模型。

**关键标记**

Multi-view Images／Textual Description／Point Cloud：多视图图像／文本描述／点云。

::: details 对照英文原文

Fig. 4: Our network architecture. The network could process three single modalities of information of input or any combinations of them, each uniquely color-coded. We consider the most complex combination of modalities, where three different inputs are provided simultaneously. Except for the textual descriptions, each modality is first processed through its corresponding frozen encoder before being further integrated. Subsequently, they are passed through a trainable projection layer, aligning them within a unified language feature space. The fine-tuned Large Language Models (LLMs), augmented with Low-Rank Adaptation (LoRA), then process a combination of the prompt and the projected embeddings, enabling the accurate generation of CAD models.
:::

**图表解读**
<!-- /figure-translation -->

图 4 为不同模态保留了各自的入口：文本由语言模型处理，图像经 DINOv2 编码，点云经 Michelangelo 编码；图像还通过 Perceiver 汇聚多视图信息，随后由投影模块把特征接到 **Vicuna-7B**。共享生成器最终预测 CAD 操作序列。（§5。）

这使外观、空间采样和语言条件可以在同一系统中出现，而不用分别定义输出。作者采用[课程式训练](#primer-curriculum-training)，依次引入 **文本 → 点云 → 多视图**，并随机组合当前可用模态。两种预训练[编码器](#primer-modality-encoders)冻结，主要训练 Perceiver、投影层和语言模型的 [LoRA](#primer-lora) 参数。

但共享接口没有消除信息差异。图像有深度歧义，文本可能只确定概括形状，点云则提供较直接的几何位置。一个统一模型如何平衡这些目标，需要通过单模态与多模态比较检验。

:::: details 训练规模与评价定义

论文报告 **16 张 H800-80GB、20 epochs、约 47 小时**，最大序列长度 1024。LoRA 减少可训练参数，不等于整个多模态训练和数据处理很轻量。（§6.1。）

Chamfer、F-score 和 Normal Consistency 衡量几何及法向；SegE 检查连接片段数量偏差，DangEL 检查开边长度，SIR 衡量自交，FluxEE 衡量闭合性。这些结构指标在网格化表示上计算，不等于所有 B-rep 约束正确率。各表的缩放需按表头读取。（§6.1.4。）

::::

## 最直接的检验：共享训练是否让各模态都受益 {#_7-3-多模态模型与单模态模型}

<PaperFigure src="/papers/cad-mllm/table07_multimodal.png" title="CAD-MLLM 原表 7：多模态训练的收益与代价" source="https://arxiv.org/abs/2411.04954" :page="14" />

<!-- figure-translation:/papers/cad-mllm/table07_multimodal.png -->
**原文翻译（表注）**

表7：使用多模态数据训练的定量研究。(a) 多模态模型在全部重建、拓扑和闭合性指标上优于仅图像模型。(b) 在拓扑和闭合性指标上，多模态模型与仅点云模型相当；但其点云重建性能略弱于仅点云模型。

**关键标记**

Ours(Image)／Ours(Point)／Ours(Multimodal)：仅图像／仅点云／多模态版本。

::: details 对照英文原文

TABLE 7: The quantitative study on training with multimodal data. (a) Our multimodal model outperforms the image-only model across all reconstruction, topology, and enclosure metrics. (b) Our multimodal model is comparable with the pointonly model in terms of topology and enclosure metrics. However, the point reconstruction performance of our multimodal model is slightly weaker than the point-only model.
:::

**图表解读**
<!-- /figure-translation -->

表 7 给出一个值得停下来看的取舍：图像侧 Chamfer 从单模态 **3.77** 降到多模态 **3.22**，但点云侧从 **1.85** 上升到 **2.63**，F-score 也下降。（§6，表 7。）

这支持统一训练可以帮助部分任务，却不支持“模态越多，每个任务越好”。按照原文解释，较粗的文本信息与精细几何目标可能存在影响；具体机制仍不能仅凭这张表完全归因。表 7 比较的是训练方案，也不能与其他图中的局部点云补全示例当作同一项实验证据。

回到外观图加局部点云的场景，多种信息有机会互补，但系统还需要学会什么时候信任哪种信息。统一生成器提供了入口，尚未保证对冲突或精度要求的理想处理。

## 几何接近、结构完整和文本对齐，需要分别评价 {#_7-结果-统一并不意味着每项都更好}

<PaperFigure src="/papers/cad-mllm/table03_points.png" title="CAD-MLLM 原表 3：点云任务" source="https://arxiv.org/abs/2411.04954" :page="10" />

<!-- figure-translation:/papers/cad-mllm/table03_points.png -->
**原文翻译（表注）**

表3：基于点云的重建任务的定量结果。在基于点云的重建指标（Chamfer、F-score、Normal C）上，本文方法与部分基于 B-rep 的重建方法相当；但在本文提出的拓扑指标（SegE、DangEL、SIR）和闭合性指标（FluxEE）上显著优于这些方法。此外，本文方法在全部评价指标上均优于基于命令序列的生成基线。

**关键标记**

Normal C：法向一致性；×100 表示显示值乘以100。

::: details 对照英文原文

TABLE 3: The quantitative results on point-based reconstruction tasks. Our method’s performance is comparable to some “B-rep”-based reconstruction methods in “point cloud”-based reconstruction metrics (Chamfer, F-score, Normal C). However, it significantly outperforms these methods in our proposed topological metrics (SegE, DangEL, and SIR) and the enclosure metric (FluxEE). Moreover, our method consistently surpasses the command sequence-based generation baseline across all evaluated metrics.
:::

**图表解读**
<!-- /figure-translation -->

表 3 中，Ours(Point) 的 Chamfer 为 **1.85**，低于 DeepCAD(Point) 的 **4.51**，F-score 为 **90.88**，高于 **71.83**。但 NVDNet 与 Point2CAD 的 Chamfer 分别为 **0.82、1.25**，都比本方法低。因此本文更突出的价值不能描述为所有几何指标最优，而应结合操作序列输出及表中拓扑、闭合性指标判断。（§6，表 3。）

<PaperFigure src="/papers/cad-mllm/table05_text.png" title="CAD-MLLM 原表 5：文本条件用户研究" source="https://arxiv.org/abs/2411.04954" :page="11" />

<!-- figure-translation:/papers/cad-mllm/table05_text.png -->
**原文翻译（表注）**

表5：文本条件生成任务的用户研究结果。从文本对齐和模型质量两个方面评价生成模型。两项均采用五分制，分数越高越好。

**关键标记**

Text Alignment：文本对齐；Model Quality：模型质量。

::: details 对照英文原文

TABLE 5: The user study results on text-conditioned generation tasks. We evaluate the generated models based on two criteria: text alignment and model quality. A higher score indicates better performance, with both criteria rated on a 5-point scale.
:::

**图表解读**
<!-- /figure-translation -->

表 5 再换到文本条件。人工评分中，本方法文本对齐 **4.16** 高于 Tripo **3.30**，模型质量 **4.45** 却低于 **4.58**。符合描述与视觉质量依然不是同一目标；评分也不是逐项尺寸验证。（§6.2.3。）

:::: details 基线与人工评价的适用范围

点云任务与 B-rep 重建及点云条件方法比较，图像任务主要与 image-to-mesh 比较，文本任务主要与 text-to-mesh 比较。输出类型和任务不同，不能据此称为击败所有 text-to-CAD 方法。

文本用户研究包含 **16 名参与者、10 对文本及生成模型、1–5 分制**，规模有限。文中有关当时基线缺乏的说明属于该版本背景，不是对当前研究的全面检索结论。

::::

## 信息更多以后，精确设计仍可能失守 {#_8-局限与失败案例}

<PaperFigure src="/papers/cad-mllm/figure14_failures.png" title="CAD-MLLM 原图 14：薄结构与复杂细节失败" source="https://arxiv.org/abs/2411.04954" :page="14" />

<!-- figure-translation:/papers/cad-mllm/figure14_failures.png -->
**原文翻译（图注）**

图14：本文方法在薄结构、复杂细节等具有挑战性的情形下的失败案例。这些失败结果中存在悬空边。

::: details 对照英文原文

Fig. 14: We present the failure case of our method on some challenging cases, such as thin structures and complicated details. Dangling edges exist in these failure results.
:::

**图表解读**
<!-- /figure-translation -->

图 14 展示薄结构与复杂细节的错误。作者还指出，视觉标注会受复杂形状和透视失真影响，文本通常缺少精确尺寸，因此外形接近仍可能大小不对。（§7。）

这与开头的问题形成对应：多模态可以补充观察，却不能凭空补全没有表达或没有学会的设计要求。随机删除点云 95% 的稀疏测试，也不等同于真实扫描大面积遮挡，二者仍需分别评价。

CAD-MLLM 建立了统一条件生成路线，其关键取舍是 **共享模型的灵活性与各任务的精度之间如何平衡**。[CAD-Recode](/cad/cad-recode) 专注点云到可执行程序，适合对照输入处理与执行筛选；[CADTests](/cad/cadtests) 则提醒我们，在形状与结构指标之外还要检查要求是否满足。

[原论文 PDF：CAD-MLLM，2411.04954v3](https://arxiv.org/pdf/2411.04954)。图表来源和 PDF 页码见各图说明。

:::: details 论文信息与版本

<span id="_1-论文信息与方向定位"></span>

- **全名**：CAD-MLLM: Unifying Multimodality-Conditioned CAD Generation With MLLM。
- **作者**：Jingwei Xu、Chenyu Wang、Zibo Zhao、Wen Liu、Yi Ma、Shenghua Gao。
- **年份与版本**：2024 年预印本；所用版本为 arXiv **2411.04954v3，2025-08-04**，共 19 页。PDF 中 “JOURNAL OF LATEX CLASS FILES ... 2015” 是模板页眉，不能据此认定发表年份或期刊。
- **来源**：[arXiv](https://arxiv.org/abs/2411.04954)、[作者项目页](https://cad-mllm.github.io/)。

::::

<!-- Published section anchors retained for incoming links. -->
<span id="_3-问题、输入输出与术语"></span>
<span id="_6-数据划分、任务基线与指标"></span>
<span id="_7-1-点云重建"></span>
<span id="_7-2-文本条件的人工评价"></span>
<span id="_9-放回方向地图-与-cad-recode-比较"></span>
<span id="_10-阅读自测与阅读卡"></span>
<span id="_11-来源与核查记录"></span>

<!-- cad-v2-relations -->
::: details 研究树关联：发展关系、资源与问题

资源：[Omni-CAD / CAD-MLLM](/cad/datasets/ds_omnicad)。

[CAD生成](/cad/tasks/generation) · [发展关系](/cad/relationships)
:::
<!-- /cad-v2-relations -->
