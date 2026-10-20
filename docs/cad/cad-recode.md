---
id: cad-0104
title: CAD-Recode：把点云反向工程成可执行 CadQuery 代码
navTitle: CAD-Recode
category: cad
type: paper
tags:
  - 论文阅读
  - 几何重建
prerequisites:
  - cad-0101
  - cad-0003
related:
  - cad-0002
  - cad-0105
  - cad-0107
order: 23
sources:
  - sources/论文/先读/CAD-Recode.md
  - 'https://arxiv.org/abs/2412.14042'
status: draft
reviewed: false
created: '2026-10-07'
updated: '2026-10-20'
---
# CAD-Recode：把点云反向工程成可执行 CadQuery 代码

<!-- cad-v2-context -->
> **研究任务 · CAD重建** · [研究总览](/cad/) · [九篇详读](/cad/reading-navigation?reading=1)
<!-- /cad-v2-context -->

## 论文信息 {#_1-论文信息与方向定位}

- **全名**：CAD-Recode: Reverse Engineering CAD Code from Point Clouds。
- **作者**：Danila Rukhovich、Elona Dupont、Dimitrios Mallis 等。
- **出处与版本**：2024 年预印本、ICCV 2025；所用版本为 arXiv **2412.14042v2，2025-03-11**，共 22 页。
- **来源**：[arXiv](https://arxiv.org/abs/2412.14042)、[出版 DOI](https://doi.org/10.1109/ICCV51701.2025.00914)。本次以下载版本为核查依据，不将后续版本或仓库新增能力混入结果。

**一句话理解**：针对点云只记录物体表面、无法直接提供可修改的 CAD 建模程序的问题，CAD-Recode 程序化合成大量 CAD 代码及对应点云，通过傅里叶位置编码和线性投影器将点云接入 Qwen2-1.5B，训练其恢复 CadQuery Python 程序，推理时生成并执行多个候选程序，按与输入点云的 Chamfer Distance（CD）选出 CAD 重建结果。

主要输入是点云，不是文本。论文展示的自然语言编辑还调用了另一个 GPT-4o，不能与点云重建模型混成同一能力。

## 问题、输入输出与必要术语 {#_3-问题、输入输出与必要术语}

**输入**：三维点云；**输出**：Python/CadQuery 建模程序；执行后生成 B-rep 实体。

典型场景是扫描物体后恢复可编辑模型。单纯恢复表面网格，与恢复建模操作不同。

术语：

- **反向工程**：从已有形状推回参数化建模表示。
- **CadQuery**：用 Python 语法构建参数化 CAD 的库。
- **点云投影器**：把点坐标变成语言模型可以接收的特征 token。
- **最远点采样（FPS）**：选取空间中较分散的点，降低点云长度。
- **Fourier 位置编码**：用不同频率的数值特征表示坐标。
- **测试时多候选采样**：生成多个解，执行和评测后选择一个，增加推理计算。

**理解边界**：同一最终形状可能由多种操作历史得到。几何重建好，不自动证明恢复了人类原始建模历史。这是对任务的研究理解。

## 为什么用代码表示？ {#_4-为什么用代码表示}

<PaperFigure src="/papers/cad-recode/figure02_representation.png" title="CAD-Recode 原图 2：建模序列与代码" source="https://arxiv.org/abs/2412.14042" :page="3" />

<!-- figure-translation:/papers/cad-recode/figure02_representation.png -->
**原文翻译（图注）**

图2：草图—拉伸序列位于上方；其中间形式为 DeepCAD 表示，下方为本文的 CadQuery 代码。

**图内文字与标记**

- (a) Sketch-Extrude sequence：草图—拉伸序列；(b) DeepCAD representation：DeepCAD 表示；(c) Our CadQuery representation：本文的 CadQuery 表示。
- Sketch / Extrude：草图／拉伸；Line / Circle：直线／圆；NewBody / Union：新建实体／并集。Python 语句和参数值保留原样。

::: details 对照英文原文

Figure 2. Sketch-extrude sequence (top) in DeepCAD representation (middle) and our CadQuery code (bottom).
:::

**图表解读**
<!-- /figure-translation -->

**来源**：原图 2，PDF 第 3 页；对应 §3.1。

代码形式允许借用已有语言模型的 Python 先验，并用 box、circle、extrude、union 等调用表达形状。共享工作平面和坐标也使代码更紧凑。

与 CAD-Llama 的区别：这里是使用 **CadQuery 的可执行 Python**，不是 SPCC 的 Python 风格伪代码。

需要区分：

1. CadQuery 库本身能提供很多操作。
2. 数据生成器实际合成了哪些操作。
3. 训练后的模型在实验中验证了哪些操作。

本文训练设计聚焦草图–拉伸及基本形状抽象，不能因库支持圆角或旋转，就声称模型已经可靠重建了这些操作。

附录 B 将模型归一化，并将坐标量化到 **−100 至 100**、最小分辨率 **1 单位**的范围。这里的单位属于归一化表示，不应直接当作工业毫米精度。

## 方法：小模型如何接收点云？ {#_5-方法-小模型如何接收点云}

<PaperFigure src="/papers/cad-recode/figure04_network.png" title="CAD-Recode 原图 4：网络结构" source="https://arxiv.org/abs/2412.14042" :page="5" />

<!-- figure-translation:/papers/cad-recode/figure04_network.png -->
**原文翻译（图注）**

图4：CAD-Recode 概览。流程包括两部分：蓝色部分是点云投影器，黄色部分是经过微调的预训练大语言模型。输入点云先由点云投影器处理，所得输出再传给语言模型，由其以可执行 Python 代码的形式预测 CAD 草图—拉伸序列。

**图内文字与标记**

- Point Cloud：点云；Linear Layer：线性层；Large Language Model：大语言模型；Tokenizer：分词器。
- Python interpreter：Python 解释器；CAD model：CAD 模型；代码、序列起止标记与数字保持原文。

::: details 对照英文原文

Figure 4. Overview of CAD-Recode. The pipeline comprises two parts: (1) a point cloud projector (marked blue) (2) a fine-tuned pretrained LLM (yellow). An input point cloud is processed using (1), and outputs are then passed to an LLM (2), which predicts a CAD sketch-extrude sequence in the form of executable Python code.
:::

**图表解读**
<!-- /figure-translation -->

**来源**：原图 4，PDF 第 5 页；对应 §4.2–4.3。

流程：

1. 输入点云通过 FPS 下采样到 **256 点**。
2. 坐标经 Fourier 编码和线性层，映射成语言模型维度的点云 token。
3. 点云 token 与代码 token 拼接，送入 **Qwen2-1.5B**。
4. 以自回归方式预测 CadQuery 代码。
5. 执行代码，得到 B-rep。

投影特征维度为 **1536**。训练中以一定概率加入坐标高斯噪声，目标是正确 CAD 代码的负对数似然。点云投影器从头学习，预训练语言模型微调。

**值得注意**：这里没有使用一个很深的专用点云编码网络。方法强调简单投影器与代码 LLM 的组合，但不意味着在任何复杂几何数据上简单投影器都足够。

### 推理还包括候选筛选

论文从不同点云采样产生 **10 个候选程序**，执行后从生成实体采样点，计算它与输入点云的 CD，选择距离最小的候选。

筛选使用的是输入点云，不能描述为推理时读取隐藏真值 CAD。也不能把包含十候选执行的结果称为单次前向输出质量。

### 训练成本

附录 A（PDF 第 9 页）报告：**单张 H100，约 12 小时，batch size 18，100K iterations**。这说明作者的训练设置，不是本地四张 4090 的时长保证。推理还需要记录候选数量及 CAD 执行耗时。

## 数据、划分与评价 {#_6-数据、划分与评价}

### 一百万样本怎样生成？ {#_6-1-一百万样本怎样生成}

§3.2 与附录 B 构建程序化数据：

- 用几何规则生成有效二维草图，检查环交叉、基元长度等。
- 在选定平面中拉伸并组合。
- 使用高层基本形状简化代码。
- 检查代码可执行性及 B-rep 几何有效性。
- 采用重复检测方法避免数据内部重复。

训练中没有直接加入人类设计历史，但合成规则决定了可见结构和操作分布。**内部去重不等于已证明与所有外部测试库完全没有几何重叠**。

作者还将 DeepCAD 转成 CadQuery，作为另一训练设置。比较合成数据价值时，应控制模型结构、训练样本量与测试时采样。

### 测试任务 {#_6-2-测试任务}

§5.1 评测 DeepCAD（**8046** 模型）、Fusion360（**1725**）和真实扫描 CC3D（**2973**）。

- DeepCAD/Fusion360 点云由表面采样得到。
- CC3D 来自实际扫描，存在噪声、缺失和边缘平滑；部分模型包含训练操作范围之外的结构。

### 指标 {#_6-3-指标}

- **CD**：使用 **8192 点**，报告均值和中位数；显示值乘以 **1000**。
- **IoU**：生成与目标体积/形状的重叠，表中按百分比显示。
- **IR**：不能生成有效 CAD 实体的比例。

不同论文采样点数、归一化和无效结果处理不同，不能直接拿 CD 显示值跨论文排序。

## 主实验与关键消融 {#_7-主实验与关键消融}

### 公共数据集结果 {#_7-1-公共数据集结果}

<PaperFigure src="/papers/cad-recode/table01_reconstruction.png" title="CAD-Recode 原表 1：DeepCAD 与 Fusion360" source="https://arxiv.org/abs/2412.14042" :page="6" />

<!-- figure-translation:/papers/cad-recode/table01_reconstruction.png -->
**原文翻译（表注）**

表1：在 DeepCAD 与 Fusion360 数据集上比较 CAD 逆向工程方法。使用16万条 DeepCAD 数据训练的 CAD-Recode，在生成草图—拉伸序列的几何保真度和有效性上优于现有先进方法。本文程序化生成的数据集进一步显著提升预测质量。

**图内文字与标记**

- Method：方法；Train Dataset Name / Size：训练数据集名称／规模；DeepCAD / Fusion360 Test Set：对应测试集。
- Mean / Med. CD：CD 均值／中位数；IoU：交并比；IR：无效比例；Ours：本文数据；160k / 1M：16万／100万。

::: details 对照英文原文

Table 1. Comparison of CAD reverse engineering methods on DeepCAD and Fusion360 datasets. Our CAD-Recode trained on the 160 k DeepCAD dataset demonstrates an improvement over existing state-of-the-art methods both in terms of geometric fidelity and validity of the generated sketch-extrude sequences. Our procedurally generated dataset provides a significant boost in the prediction quality.
:::

**图表解读**
<!-- /figure-translation -->

**来源**：原表 1，PDF 第 6 页。

用 1M 合成数据训练时：

- DeepCAD：平均 CD **0.30**、中位 CD **0.16**、IoU **92.0%**、IR **0.4%**。
- Fusion360：平均 CD **0.35**、中位 CD **0.15**、IoU **87.8%**、IR **0.5%**。

用 DeepCAD 160K 训练的同方法在 DeepCAD 上平均 CD **1.98**、IoU **80.7%**。因此主结果包含了数据变化的收益，不能全部归因于模型结构。

部分基线结果引用自既有论文。原表提供比较证据，但不等于本次已独立重跑所有方法。

### 真实扫描结果 {#_7-2-真实扫描结果}

<PaperFigure src="/papers/cad-recode/table02_scans.png" title="CAD-Recode 原表 2：CC3D" source="https://arxiv.org/abs/2412.14042" :page="7" />

<!-- figure-translation:/papers/cad-recode/table02_scans.png -->
**原文翻译（表注）**

表2：CC3D 数据集上的结果，其输入点云采样自真实三维扫描。CAD-Recode 显著优于 DeepCAD 和 CAD-SIGNet。

**图内文字与标记**

- Method：方法；Mean / Med. CD：CD 均值／中位数；IoU：交并比；IR：无效比例；↑越大越好，↓越小越好。

::: details 对照英文原文

Table 2. Results on the CC3D dataset, where input point clouds are sampled from real 3D scans. CAD-Recode significantly outperforms DeepCAD, and CAD-SIGNet.
:::

**图表解读**
<!-- /figure-translation -->

**来源**：原表 2，PDF 第 7 页。

CAD-Recode 的平均 CD **0.76**、中位 CD **0.31**、IoU **74.2%**、IR **0.3%**。这支持合成训练对该真实扫描集合具有一定迁移能力，但不能据此说所有实际工业扫描都已解决。

### 多候选筛选有多大影响？ {#_7-3-多候选筛选有多大影响}

<PaperFigure src="/papers/cad-recode/table03_sampling.png" title="CAD-Recode 原表 3：数据与候选筛选消融" source="https://arxiv.org/abs/2412.14042" :page="8" />

<!-- figure-translation:/papers/cad-recode/table03_sampling.png -->
**原文翻译（表注）**

表3：训练数据和测试时采样的消融。结果展示了程序化生成训练数据的优势，测试时采样则有助于降低无效比例。CD 指平均倒角距离。

**图内文字与标记**

- Train Dataset Name / Size：训练数据集名称／规模；Test-time Sampling：测试时采样；Real-World CC3D：真实场景 CC3D。
- Previous best：此前最佳方法；Ours：本文数据；✓／✗：采用／不采用；IoU：交并比；IR：无效比例。

::: details 对照英文原文

Table 3. Ablation of training data and test-time sampling. The results demonstrate the advantage of training on our procedurally generated data, while the test-time sampling helps reducing the invalidity ratio. CD stands for mean Chamfer distance.
:::

**图表解读**
<!-- /figure-translation -->

**来源**：原表 3，PDF 第 8 页。此表 CD 为**平均值**，不要与表 4 的中位值混用。

1M 合成训练、没有测试时多候选采样时，IR 在 DeepCAD/Fusion360/CC3D 上为 **4.9% / 8.7% / 16.8%**；使用采样后为 **0.4% / 0.5% / 0.3%**。

这说明很低的主结果无效率显著受筛选策略影响。做你自己的实验时应同时记录：

- 单候选质量；
- 同等候选预算下的质量；
- 候选执行与距离计算成本。

160K 合成数据与 160K DeepCAD 训练的对比，则更有助于把“数据来源”与“数据规模”分开理解。

## 局限与编辑示例的证据范围 {#_8-局限与编辑示例的证据范围}

<PaperFigure src="/papers/cad-recode/figure06_editing.png" title="CAD-Recode 原图 6：GPT-4o 辅助编辑" source="https://arxiv.org/abs/2412.14042" :page="8" />

<!-- figure-translation:/papers/cad-recode/figure06_editing.png -->
**原文翻译（图注）**

图6：CAD 模型的交互式编辑。给定 CAD-Recode 输出的代码和一个通用提示，可以利用 GPT-4o 对 CAD 模型进行自动化、交互式编辑。

**图内文字与标记**

- CAD-Recode Output：CAD-Recode 输出；User Prompt：用户提示；Executed Code：已执行代码；User Edit：用户编辑。
- Base Diam. / Base Height：底座直径／高度；Top Diam. / Top Height：顶部直径／高度。
- 用户提示：“重构代码，增加能让代码更易编辑、更可解释的函数和变量。在代码中加入滑块，以编辑每个基元的尺寸。”

::: details 对照英文原文

Figure 6. Interactive editing of a CAD model. Given the code output from CAD-Recode and a generic prompt, GPT-4o allows automated and interactive editing of the CAD model.
:::

**图表解读**
<!-- /figure-translation -->

**来源**：原图 6，PDF 第 8 页；对应 §5.2。

图中把生成代码交给 **GPT-4o**，重构为带参数和滑块的形式。它展示了可解释代码的后续用途，并非说明 CAD-Recode 本身经过全面指令编辑训练。

原文及附录失败分析说明：较小特征可能因量化变为零厚度；训练范围不能覆盖旋转、圆角等复杂操作。真实扫描中的缺失、噪声和训练外结构也可能导致恢复错误。

**分析**：代码可执行、几何相似和原设计历史一致是三种不同要求；一百万合成样本的数量不替代结构分布分析。

## 相关研究 {#_9-放回方向地图-与其他论文连接}

- **几何重建**：直接任务是点云重建。
- **CAD 表示**：可执行 CadQuery 表示将几何重建与代码先验连接。
- **编辑与交互**：可解释代码支持后续 GPT-4o 编辑示例，证据范围是本文演示。

与 DeepCAD：最终都能得到操作过程，但这里使用预训练代码 LLM 和可执行程序。
与 CAD-Llama：两者借用语言模型，前者以点云为条件并输出 CadQuery，后者以文本/任务为条件输出 SPCC。
下一篇 CAD-MLLM：将看到点云、图像和文本共同接入一个模型的路线。

现阶段最值得记住的研究变量是**表示、数据分布、候选预算**。不要只将贡献压缩成“用了一个小 LLM”。

## 思考与自测 {#_10-阅读自测与阅读卡}

1. CAD-Recode 的主要输入与输出是什么？
2. 点云 token 如何形成？
3. 主结果是否只生成一个候选？
4. 候选 CD 筛选是否用到隐藏目标 CAD？
5. 为什么 1M 主结果不能全部归因于模型结构？
6. 图 6 的编辑由哪个模型完成？
7. 几何重建好是否证明原始历史被恢复？

<details>
<summary>参考答案：完成自测后展开</summary>

1. 点云 → CadQuery Python → 执行后的 CAD 实体。
2. 最远点采样、Fourier 编码和线性投影。
3. 不是，推理使用十个候选并筛选。
4. 使用输入点云，不是隐藏目标 CAD。
5. 同时改变了训练数据来源与规模，需要表 3 等受控比较。
6. 另一个 GPT-4o 对生成代码进行重构与编辑。
7. 不证明，同一形状可能对应不同建模历史。

</details>

## 参考文献 {#_11-来源与核查记录}

- [原论文 PDF](https://arxiv.org/pdf/2412.14042)

图表引自原论文，图号与 PDF 页码见各图说明。

<!-- cad-v2-relations -->
::: details 研究树关联：发展关系、资源与问题

资源：[CAD-Recode（v1 / v1.5）](/cad/datasets/ds_cadrecode) · [CC3D / SHARP 2023](/cad/datasets/ds_cc3d)。

问题：[I-A-01](/cad/issues/i-a-01)。

[CAD重建](/cad/tasks/reconstruction) · [发展关系](/cad/relationships)
:::
<!-- /cad-v2-relations -->
