---
id: cad-0105
title: CAD-MLLM：统一文本、图像和点云条件的 CAD 生成
navTitle: CAD-MLLM
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
updated: '2026-10-20'
---
# CAD-MLLM：统一文本、图像和点云条件的 CAD 生成

<!-- cad-v2-context -->
> **研究任务 · CAD生成** · [研究总览](/cad/) · [九篇详读](/cad/reading-navigation?reading=1)
<!-- /cad-v2-context -->

## 论文信息 {#_1-论文信息与方向定位}

- **全名**：CAD-MLLM: Unifying Multimodality-Conditioned CAD Generation With MLLM。
- **作者**：Jingwei Xu、Chenyu Wang、Zibo Zhao、Wen Liu、Yi Ma、Shenghua Gao。
- **年份与版本**：2024 年预印本；所用版本为 arXiv **2411.04954v3，2025-08-04**，共 19 页。PDF 中 “JOURNAL OF LATEX CLASS FILES ... 2015” 是模板页眉，不能据此认定发表年份或期刊。
- **来源**：[arXiv](https://arxiv.org/abs/2411.04954)、[作者项目页](https://cad-mllm.github.io/)。

**一句话理解**：针对文本、图像和点云条件的 CAD 生成通常分开建模、难以共同使用不同输入信息的问题，CAD-MLLM 构建 Omni-CAD 对齐数据，将图像与点云编码特征经 Perceiver 和投影模块接入 Vicuna-7B，再通过 LoRA 学习文本与多模态条件下的生成，输出草图与拉伸序列并重建 CAD 实体。

## 问题、输入输出与术语 {#_3-问题、输入输出与术语}

用户可能有文本、渲染图、点云，或者其中若干组合。论文希望不为每种组合单独设计完全不同的生成器。

**输入**：文本、多视图图像、点云及其组合。
**输出**：参数化 CAD 命令序列，随后转换为实体。

需要区分三类任务：

- 点云条件更接近几何重建。
- 图像条件存在未观察表面和深度歧义。
- 文本条件可能允许多个合理形状，且不一定给出精确尺寸。

术语：

- **模态**：文本、图像、点云等不同信息形式。
- **特征对齐**：把不同模态编码成语言模型能利用的嵌入。
- **Perceiver / 可学习查询**：用固定查询从多视图特征中提取、压缩信息。
- **课程式训练**：按阶段引入输入条件，逐步增加训练复杂度。
- **拓扑指标**：检查连接、开边、自交等结构，而非只看点云接近程度。
- **闭合性指标**：评测表面是否能形成闭合区域；不等于设计意图正确。

## 数据与表示：更大数据并未扩大所有操作 {#_4-数据与表示-更大数据并未扩大所有操作}

<PaperFigure src="/papers/cad-mllm/figure02_dataset.png" title="CAD-MLLM 原图 2：扩展数据示例" source="https://arxiv.org/abs/2411.04954" :page="5" />

<!-- figure-translation:/papers/cad-mllm/figure02_dataset.png -->
**原文翻译（图注）**

图2：本文 CAD 命令序列数据集与 DeepCAD[1]数据集的定性比较。如第4节所述，DeepCAD 是本文所建数据集的一部分。展示本文数据集时，排除了已经收录在 DeepCAD 中的模型 ID。扩展部分包含更复杂、更接近真实、细节更多的模型。建议放大查看。

::: details 对照英文原文

Fig. 2: Qualitative comparison between our CAD command sequence dataset and DeepCAD [1] dataset. According to Sec. 4, DeepCAD dataset is part of our created dataset. In the visualization of our dataset, we exclude the CAD models’ IDs that have been included in the DeepCAD dataset. The extension part of our dataset contains more complex and realistic models with more details. Best viewed zoomed in.
:::

**图表解读**
<!-- /figure-translation -->

**来源**：原图 2，PDF 第 5 页；对应 §4.1。

数据仍起源于 ABC/Onshape。与 DeepCAD 过滤整个含圆角/倒角模型不同，作者**逐个去掉圆角和倒角操作**，只要剩余模型拓扑完整就保留。

因此“保留原模型来源”不意味着“训练输出学会了圆角和倒角”。转换后的目标已经改变。

数据建设包含：

- 初始约 **275,717** 个模型。
- 从每次拉伸后的中间形状获得额外样本，最终约 **453,220 条序列**。
- 先划分原始模型，再仅对训练部分做中间步骤增强，以降低相关步骤跨集合泄漏。
- 每个模型渲染 **8 个视图**，采样点云及法向量。
- 标注文本由 **InternVL2-26B** 使用随机选取的 **4 个视图**生成。

论文统计中的模型/序列数与 DeepCAD 原论文统计不完全相同，应保留各自版本与处理规则，不把某个数字当作统一数据真值。

**数据独立性**：中间步骤是相关样本，不是同等数量的独立工业设计。增强后的训练/测试数量比例也不再能简单按原始 9:1 理解。

## 方法与计算资源 {#_5-方法与计算资源}

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

**来源**：原图 4，PDF 第 7 页；对应 §5。

1. **文本**由语言模型自身的 tokenizer/嵌入处理。
2. **图像**经冻结视觉编码器，使用 Perceiver 和投影层汇聚多视图信息。
3. **点云**经冻结点云编码器及投影层得到特征。
4. 选择当前输入组合，将特征与提示交给 **Vicuna-7B**。
5. 通过自回归语言建模损失学习 CAD 序列输出。

视觉编码器使用 **DINOv2**，点云编码器使用 **Michelangelo**。训练参数主要包括视觉 Perceiver、图像/点云投影层和 LLM LoRA；两种预训练编码器保持冻结。

课程式策略依次引入 **文本 → 点云 → 多视图**，并随机组合当前阶段可用模态。

### 三种视图数量不要混淆

- 数据集：每个模型 **8 个渲染视图**。
- 文本标注：抽取 **4 个视图**。
- 本文模型训练输入：最多 **2 个视图**。

原文 §6.1 报告 **16 张 H800-80GB、20 epochs、约 47 小时**，最大序列长度 **1024**。即使采用 LoRA，完整训练也有大量多模态特征和数据处理成本。

你的四张 4090 不应直接承诺完整照搬这个规模；可先把方法当作路线参考，后续通过缩小数据、缓存编码特征或只验证某个模块设计实验。这些是实验建议，尚未实测。

## 数据划分、任务基线与指标 {#_6-数据划分、任务基线与指标}

§6.1 使用 **425,726 条训练、27,494 条评测**。原始模型划分及训练增强见 §4.1，不应只依据最终条数反推划分比例。

评测分开看：

- **点云条件**：与 B-rep 重建方法及点云条件 DeepCAD 比较。
- **图像条件**：主要与 image-to-mesh 方法比较。
- **文本条件**：主要与 text-to-mesh 方法进行人工评价。

这些基线输出类型和任务目标不同。不要把 mesh 比较的优势直接表述为击败所有现代 text-to-CAD 方法。文中“当前没有基线”的描述属于该版本作者的研究背景，不是今天的全面检索结论。

指标见 §6.1.4：

- **Chamfer、F-score、Normal Consistency**：几何与表面方向。
- **SegE**：连接片段数量偏差。
- **DangEL**：仅被一个面包围的开边长度。
- **SIR**：自交面的比例。
- **FluxEE**：利用通量构造的闭合性误差。

这些拓扑检查是在网格化表示上计算的指标，不能直接称为“全部 B-rep 约束正确率”。对象归一化到指定范围，表中还存在不同的 100 倍缩放，读表先看表头。

## 结果：统一并不意味着每项都更好 {#_7-结果-统一并不意味着每项都更好}

### 点云重建 {#_7-1-点云重建}

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

**来源**：原表 3，PDF 第 10 页。

Ours(Point) 的 Chamfer 显示值为 **1.85**，DeepCAD(Point) 为 **4.51**；F-score 为 **90.88**，DeepCAD 为 **71.83**。

但是 NVDNet 的 Chamfer 为 **0.82**，Point2CAD 为 **1.25**，都低于 Ours(Point)。因此不能只按作者描述写成“几何重建指标全部最好”。本方法更突出的优势在其所列拓扑和闭合指标及生成序列输出形式。

### 文本条件的人工评价 {#_7-2-文本条件的人工评价}

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

**来源**：原表 5，PDF 第 11 页；§6.2.3。16 名参与者评价 10 对文本与生成模型，使用 1–5 分制。

本方法文本对齐 **4.16**，高于 Tripo **3.30**；模型质量 **4.45**，低于 Tripo **4.58**。

这张表样本规模有限，衡量的是人工评分，不能解释为精确尺寸或设计要求的全部满足率。

### 多模态模型与单模态模型 {#_7-3-多模态模型与单模态模型}

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

**来源**：原表 7，PDF 第 14 页。

- 图像侧：Chamfer 从图像单模态 **3.77** 改善到多模态 **3.22**。
- 点云侧：Chamfer 从点云单模态 **1.85** 变为多模态 **2.63**，反而更差；F-score 也下降。

这是本篇最适合用于理解“多模态未必总有益”的表。共享训练需要平衡多种模态，更粗的文本可能影响精确几何目标，见原文解释。

不要把表 7 与图 8 的定性补全示例混为同一个实验：前者比较训练方案，后者展示额外条件帮助处理局部/噪声输入。

## 局限与失败案例 {#_8-局限与失败案例}

<PaperFigure src="/papers/cad-mllm/figure14_failures.png" title="CAD-MLLM 原图 14：薄结构与复杂细节失败" source="https://arxiv.org/abs/2411.04954" :page="14" />

<!-- figure-translation:/papers/cad-mllm/figure14_failures.png -->
**原文翻译（图注）**

图14：本文方法在薄结构、复杂细节等具有挑战性的情形下的失败案例。这些失败结果中存在悬空边。

::: details 对照英文原文

Fig. 14: We present the failure case of our method on some challenging cases, such as thin structures and complicated details. Dangling edges exist in these failure results.
:::

**图表解读**
<!-- /figure-translation -->

**来源**：原图 14，PDF 第 14 页；对应 §7。

作者明确指出：

- InternVL2-26B 对复杂形状与透视失真敏感，可能影响文本标注。
- 文本缺少精确 CAD 尺寸，形状相似但大小可能明显不同。
- 薄结构和复杂细节会出现错误或开边。

**分析**：仅增加模态种类没有自动解决模态冲突、精确尺寸和目标约束。随机删去点云 95% 的测试，也不等同于真实扫描中大面积遮挡；随机稀疏与结构缺失要分别评价。

## 相关研究 {#_9-放回方向地图-与-cad-recode-比较}

- **几何重建**：点云和图像条件下重建 CAD。
- **条件生成**：文本也是一种条件，但文本评测证据与重建评测不同。
- **数据与评测**：Omni-CAD、划分后增强、多模态配对及拓扑指标是重要贡献。

与 CAD-Recode：

- CAD-Recode 用简单坐标投影接小型代码 LLM，输出 CadQuery。
- CAD-MLLM 用冻结视觉/点云编码器接 Vicuna，输出命令序列。
- 数据来源、操作过滤、输出表示、候选筛选和训练资源都不同。

不能只根据两个模型的参数规模选择路线。先判断你的研究问题是否需要多模态，哪些信息互补，哪些条件反而可能冲突。

## 思考与自测 {#_10-阅读自测与阅读卡}

1. 去掉圆角操作后保留模型，是否意味着模型会生成圆角？
2. 数据渲染、标注与模型输入各使用多少视图？
3. 哪些模块冻结，哪些训练？
4. 表 3 的 Chamfer 是否全面优于所有 B-rep 方法？
5. 表 7 的点云侧多模态训练是否更好？
6. 拓扑指标是否等于设计要求满足率？
7. 453,220 条序列是否意味着同样数量的独立原始设计？

<details>
<summary>参考答案：完成自测后展开</summary>

1. 不意味着，训练目标中的这些操作被删除了。
2. 分别是 8 个、4 个和最多 2 个。
3. 视觉/点云预训练编码器冻结，Perceiver、投影层及 LLM LoRA 训练。
4. 不是，例如 NVDNet 和 Point2CAD 的 Chamfer 更低。
5. 不是，点云 Chamfer 从 1.85 变为 2.63。
6. 不是，连接和闭合性不能涵盖尺寸、语义等全部要求。
7. 不是，数量包含原模型的中间步骤增强。

</details>

## 参考文献 {#_11-来源与核查记录}

- [原论文 PDF](https://arxiv.org/pdf/2411.04954)

图表引自原论文，图号与 PDF 页码见各图说明。

<!-- cad-v2-relations -->
::: details 研究树关联：发展关系、资源与问题

资源：[Omni-CAD / CAD-MLLM](/cad/datasets/ds_omnicad)。

[CAD生成](/cad/tasks/generation) · [发展关系](/cad/relationships)
:::
<!-- /cad-v2-relations -->
