---
id: cad-0104
title: CAD-Recode：把点云反向工程成可执行 CadQuery 代码
navTitle: CAD-Recode
outline:
  - 2
  - 2
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
updated: '2026-10-23'
---
# CAD-Recode：把点云反向工程成可执行 CadQuery 代码

<!-- cad-v2-context -->
> **研究任务 · CAD重建** · [研究总览](/cad/) · [九篇详读](/cad/reading-navigation?reading=1)
<!-- /cad-v2-context -->

扫描一个零件能得到点云，却得不到调整孔径、改变底座高度所需的建模程序。即使表面重建得很像，输出若只是网格，仍与可编辑的参数化 CAD 相隔一步。

**CAD-Recode 的目标是从点云恢复可执行的 CadQuery Python 程序。** 它把问题拆成相互衔接的三部分：生成足够多的代码—点云训练对，让代码语言模型接收几何输入，再通过执行与几何距离筛选候选。很低的最终错误率来自这整条链路，不能只归功于一次代码生成。

## 阅读前需要了解的技术 {#technical-primer}

本文把点云接入代码语言模型。需要理解的不是一套新的 CAD 操作，而是几何输入怎样进入模型，以及生成程序怎样被选择。

### 最远点采样与 Fourier 编码：先整理几何输入 {#primer-point-features}

最远点采样（FPS）逐次选择离已选点集合较远的点，得到数量较少、空间上较分散的输入点。Fourier 编码则把坐标变成不同频率的正弦、余弦特征，增加网络可使用的坐标表达。前者减少点数，后者扩展每个点的特征；二者都不直接恢复 CAD 结构。

### 投影器与点云 token：把坐标特征接到语言模型 {#primer-point-projection}

语言模型通常读取固定维度的向量，而不是直接理解一个原始三维坐标文件。投影器是可训练映射：输入每个点的特征，输出与语言模型输入维度匹配的向量，这些向量在这里充当点云 token。维度匹配只建立接口，必须依靠点云—代码配对训练，模型才有机会学会利用它们；这也不是点云的刚体配准。

### 自回归代码微调：给定点云，学习逐段写程序 {#primer-code-finetuning}

模型从预训练 Qwen2 的权重开始，读取点云特征与前序代码，预测下一个代码 token。正确 CadQuery 程序作为监督目标，训练通过负对数似然损失更新点云投影器与语言模型。这里微调的是条件代码生成能力；训练目标不是直接把两组三维表面距离最小化。

### 测试时采样：用更多计算换候选选择机会 {#primer-test-time-sampling}

推理时生成多个候选程序，执行后比较其实体与输入点云的距离，再选一个结果。它不更新模型权重，因此不属于再次训练。本文使用十个候选，筛选依据来自输入点云；它增加了程序执行与距离计算开销，最终成绩应与这一预算一起理解。

**理解示例**：一份扫描点云经过采样、编码与投影，生成器写出多个建模程序；程序执行后，系统选出最接近扫描的实体。选得更像，不代表一定找回了人类原来的建模历史。

概念依据：[Fourier Features 原论文](https://arxiv.org/abs/2006.10739)；具体接口、代码训练与筛选见 [CAD-Recode §4](https://arxiv.org/abs/2412.14042)。

配套实践：[点云采样与编码](/basics/practice/multimodal#point-features) · [测试时筛选](/basics/practice/feedback#candidate-selection) · [全部技术地图](/basics/practice/paper-map)。

## 要恢复可修改的对象，先选择怎样的输出 {#_4-为什么用代码表示}

设想输入是一段底座与顶部结构的点云。扫描点没有“底座高度”这个变量；如果输出代码使用工作平面、草图、拉伸与组合操作，参数就有机会成为后续编辑的入口。

<PaperFigure src="/papers/cad-recode/figure02_representation.png" title="CAD-Recode 原图 2：建模序列与代码" source="https://arxiv.org/abs/2412.14042" :page="3" />

<!-- figure-translation:/papers/cad-recode/figure02_representation.png -->
**原文翻译（图注）**

图2：草图—拉伸序列位于上方；其中间形式为 DeepCAD 表示，下方为本文的 CadQuery 代码。

**关键标记**

Sketch-Extrude sequence：草图—拉伸序列；Our CadQuery representation：本文的 CadQuery 表示。

::: details 对照英文原文

Figure 2. Sketch-extrude sequence (top) in DeepCAD representation (middle) and our CadQuery code (bottom).
:::

**图表解读**
<!-- /figure-translation -->

图 2 对比操作序列、DeepCAD 表示与 CadQuery 表示。CadQuery 既能用代码组织几何，也能借用预训练语言模型已有的 Python 能力；共享工作平面和坐标还可以使表达更紧凑。与 CAD-Llama 的 SPCC 不同，这里输出的是调用 **CadQuery 库的可执行 Python**。（原文 §3.1。）

不过，输出语言的能力上限不等于训练模型的能力。CadQuery 库支持的操作很多，本文合成规则与实验主要围绕草图—拉伸及基本形状。代码形式不会自动使网络掌握训练中未覆盖的圆角、旋转等复杂操作。

## 没有足够的建模历史，就先生成程序与几何的配对 {#_6-1-一百万样本怎样生成}

选定输出代码后，数据问题变得直接：需要大量程序，同时还要知道执行它们会出现什么形状。作者程序化构造草图、拉伸与组合，检查二维轮廓和最终 B-rep 的有效性，再由实体采样点云，从而得到 **1M 合成训练样本**。（§3.2、附录 B。）

这一顺序提供了程序与输入几何的明确对应，无需先收集同等数量的人类设计历史；代价则是生成规则决定了模型能见到哪些结构。数据内部去重也不等于已证明与所有外部测试库没有几何重合。

论文另外将 DeepCAD 转成 CadQuery 作为训练设置。它使“代码模型能否工作”与“数据规模、数据来源带来多少收益”成为可以分别检查的问题，而不是把一百万样本的作用隐含在模型名称中。

## 点云怎样进入一个代码语言模型 {#_5-方法-小模型如何接收点云}

<PaperFigure src="/papers/cad-recode/figure04_network.png" title="CAD-Recode 原图 4：网络结构" source="https://arxiv.org/abs/2412.14042" :page="5" />

<!-- figure-translation:/papers/cad-recode/figure04_network.png -->
**原文翻译（图注）**

图4：CAD-Recode 概览。流程包括两部分：蓝色部分是点云投影器，黄色部分是经过微调的预训练大语言模型。输入点云先由点云投影器处理，所得输出再传给语言模型，由其以可执行 Python 代码的形式预测 CAD 草图—拉伸序列。

**关键标记**

Python interpreter：Python 解释器，负责执行生成代码。

::: details 对照英文原文

Figure 4. Overview of CAD-Recode. The pipeline comprises two parts: (1) a point cloud projector (marked blue) (2) a fine-tuned pretrained LLM (yellow). An input point cloud is processed using (1), and outputs are then passed to an LLM (2), which predicts a CAD sketch-extrude sequence in the form of executable Python code.
:::

**图表解读**
<!-- /figure-translation -->

图 4 的连接方式很简洁：点云经最远点采样保留 **256 点**，坐标经 [Fourier](#primer-point-features) 编码和线性投影变成语言模型维度的 token，与代码 token 一起进入 **Qwen2-1.5B**，然后自回归预测程序。训练目标是正确代码的[负对数似然](#primer-code-finetuning)，[投影器](#primer-point-projection)从头学习，语言模型进行微调。（§4.2–4.3。）

因此，网络并非先输出一套完整三维几何，再把几何翻译成代码，而是直接学习“点云条件—程序序列”的关系。简单投影器减少了专用点云网络的复杂性，但能否处理复杂细节，仍由数据和实验回答。

:::: details 训练与表示精度

投影维度为 **1536**，训练时以一定概率加入坐标高斯噪声。模型归一化，坐标量化到 **−100 至 100**、最小分辨率 **1 单位**；这是归一化表示的单位，不是毫米精度保证。（附录 B。）

附录 A 报告单张 H100 训练约 **12 小时**，batch size 18，100K iterations。它只描述作者设置；推理还需要另计程序执行与筛选开销。

::::

## 一次生成不够可靠，就把执行结果用于候选选择 {#_7-3-多候选筛选有多大影响}

从点云到程序通常不止一个可能答案。论文从不同点云采样生成 **10 个候选程序**，执行后从生成实体采样点，选择与**输入点云**的 CD 最小者。筛选没有读取隐藏的真值 CAD，但增加了生成、执行和距离计算预算。（§4.3。）

<PaperFigure src="/papers/cad-recode/table03_sampling.png" title="CAD-Recode 原表 3：数据与候选筛选消融" source="https://arxiv.org/abs/2412.14042" :page="8" />

<!-- figure-translation:/papers/cad-recode/table03_sampling.png -->
**原文翻译（表注）**

表3：训练数据和测试时采样的消融。结果展示了程序化生成训练数据的优势，测试时采样则有助于降低无效比例。CD 指平均倒角距离。

**关键标记**

Test-time Sampling：测试时采样；✓／✗：采用／不采用。

::: details 对照英文原文

Table 3. Ablation of training data and test-time sampling. The results demonstrate the advantage of training on our procedurally generated data, while the test-time sampling helps reducing the invalidity ratio. CD stands for mean Chamfer distance.
:::

**图表解读**
<!-- /figure-translation -->

表 3 把这个步骤的影响显式列出：使用 1M 合成数据但不做测试时多候选采样，DeepCAD/Fusion360/CC3D 的 IR 为 **4.9% / 8.7% / 16.8%**；采用采样后为 **0.4% / 0.5% / 0.3%**。（§5，表 3。）

这组结果改变了对主成绩的理解：系统最终很少返回无效实体，并不意味着每次原始代码预测都同样可靠。比较其他方法时，候选数量与执行成本必须一起考虑。表中等量 160K 合成数据与 160K DeepCAD 的比较，也比直接比较 1M 与 160K 更适合分析数据来源。

## 合成训练能否越过数据来源，恢复真实形状 {#_7-主实验与关键消融}

<PaperFigure src="/papers/cad-recode/table01_reconstruction.png" title="CAD-Recode 原表 1：DeepCAD 与 Fusion360" source="https://arxiv.org/abs/2412.14042" :page="6" />

<!-- figure-translation:/papers/cad-recode/table01_reconstruction.png -->
**原文翻译（表注）**

表1：在 DeepCAD 与 Fusion360 数据集上比较 CAD 逆向工程方法。使用16万条 DeepCAD 数据训练的 CAD-Recode，在生成草图—拉伸序列的几何保真度和有效性上优于现有先进方法。本文程序化生成的数据集进一步显著提升预测质量。

**关键标记**

Mean／Med. CD：CD 均值／中位数；IR：无效比例。

::: details 对照英文原文

Table 1. Comparison of CAD reverse engineering methods on DeepCAD and Fusion360 datasets. Our CAD-Recode trained on the 160 k DeepCAD dataset demonstrates an improvement over existing state-of-the-art methods both in terms of geometric fidelity and validity of the generated sketch-extrude sequences. Our procedurally generated dataset provides a significant boost in the prediction quality.
:::

**图表解读**
<!-- /figure-translation -->

表 1 中，用 1M 合成数据训练时，DeepCAD 平均 CD 为 **0.30**、IoU 为 **92.0%**、IR 为 **0.4%**；Fusion360 为 **0.35、87.8%、0.5%**。同方法仅用 DeepCAD 160K 训练时，DeepCAD 平均 CD 为 **1.98**、IoU 为 **80.7%**。这说明完整主结果包含重要的数据收益，不能全部归因于语言模型结构。（§5.1。）

<PaperFigure src="/papers/cad-recode/table02_scans.png" title="CAD-Recode 原表 2：CC3D" source="https://arxiv.org/abs/2412.14042" :page="7" />

<!-- figure-translation:/papers/cad-recode/table02_scans.png -->
**原文翻译（表注）**

表2：CC3D 数据集上的结果，其输入点云采样自真实三维扫描。CAD-Recode 显著优于 DeepCAD 和 CAD-SIGNet。

**关键标记**

IoU：交并比；IR：无效比例。

::: details 对照英文原文

Table 2. Results on the CC3D dataset, where input point clouds are sampled from real 3D scans. CAD-Recode significantly outperforms DeepCAD, and CAD-SIGNet.
:::

**图表解读**
<!-- /figure-translation -->

表 2 再转向有噪声、缺失和边缘平滑的真实扫描 CC3D：平均 CD **0.76**、IoU **74.2%**、IR **0.3%**。结果支持合成训练向该扫描集合迁移，但较高有效性没有使几何误差消失，也没有覆盖所有工业扫描结构。

:::: details 测试集合与指标口径

DeepCAD、Fusion360、CC3D 测试分别包含 **8046、1725、2973** 个模型。CD 用 8192 点计算，显示值乘以 1000；IoU 以百分比显示。表 1 中位 CD 分别为 0.16 / 0.15，表 2 为 0.31。表 3 的 CD 为均值，不能与其他表的中位值混用。（§5.1。）

部分基线数值引自既有论文，表格并不表示本次重新运行了全部方法。不同点采样、归一化和无效结果处理，也使跨论文 CD 显示值不能直接排序。

::::

## 从可执行程序到可编辑设计，还需要额外判断 {#_8-局限与编辑示例的证据范围}

<PaperFigure src="/papers/cad-recode/figure06_editing.png" title="CAD-Recode 原图 6：GPT-4o 辅助编辑" source="https://arxiv.org/abs/2412.14042" :page="8" />

<!-- figure-translation:/papers/cad-recode/figure06_editing.png -->
**原文翻译（图注）**

图6：CAD 模型的交互式编辑。给定 CAD-Recode 输出的代码和一个通用提示，可以利用 GPT-4o 对 CAD 模型进行自动化、交互式编辑。

**关键标记**

User Prompt：用户提示；Executed Code：执行的代码；User Edit：用户编辑。

::: details 对照英文原文

Figure 6. Interactive editing of a CAD model. Given the code output from CAD-Recode and a generic prompt, GPT-4o allows automated and interactive editing of the CAD model.
:::

**图表解读**
<!-- /figure-translation -->

图 6 把恢复的代码交给另一个 **GPT-4o**，重构成含变量、函数和滑块的形式，再让用户调整尺寸。它展示了代码输出的后续价值，不能视为 CAD-Recode 本身已经接受全面自然语言编辑训练。（§5.2。）

回到开头那个扫描零件，几何接近只是目标之一。同样的最终形状可能由不同操作历史得到；从点云恢复一个合理程序，不等于识别出了设计者原来的步骤。薄小特征还可能在量化后变成零厚度，训练外操作与缺失区域也会导致错误。（原文及附录失败分析；历史非唯一性为任务层面的分析。）

CAD-Recode 的主张应理解为：**可执行代码、合成数据和执行后筛选共同构成了一条反向工程路线。** 要继续推进它，既要问形状是否更接近，也要问单候选有多可靠、筛选花费多少，以及恢复的程序是否适合后续修改。[CADTests](/cad/cadtests) 提供了另一种实体检查思路，但其文本要求测试与这里的点云距离筛选是不同目标。

[原论文 PDF：CAD-Recode，2412.14042v2](https://arxiv.org/pdf/2412.14042)。图表出处和 PDF 页码见各图说明。

:::: details 论文信息与版本

<span id="_1-论文信息与方向定位"></span>

- **全名**：CAD-Recode: Reverse Engineering CAD Code from Point Clouds。
- **作者**：Danila Rukhovich、Elona Dupont、Dimitrios Mallis 等。
- **出处与版本**：2024 年预印本、ICCV 2025；所用版本为 arXiv **2412.14042v2，2025-03-11**，共 22 页。
- **来源**：[arXiv](https://arxiv.org/abs/2412.14042)、[出版 DOI](https://doi.org/10.1109/ICCV51701.2025.00914)。本次以下载版本为核查依据，不将后续版本或仓库新增能力混入结果。

::::

<!-- Published section anchors retained for incoming links. -->
<span id="_3-问题、输入输出与必要术语"></span>
<span id="_6-数据、划分与评价"></span>
<span id="_6-2-测试任务"></span>
<span id="_6-3-指标"></span>
<span id="_7-1-公共数据集结果"></span>
<span id="_7-2-真实扫描结果"></span>
<span id="_9-放回方向地图-与其他论文连接"></span>
<span id="_10-阅读自测与阅读卡"></span>
<span id="_11-来源与核查记录"></span>

<!-- cad-v2-relations -->
::: details 研究树关联：发展关系、资源与问题

资源：[CAD-Recode（v1 / v1.5）](/cad/datasets/ds_cadrecode) · [CC3D / SHARP 2023](/cad/datasets/ds_cc3d)。

问题：[I-A-01](/cad/issues/i-a-01)。

[CAD重建](/cad/tasks/reconstruction) · [发展关系](/cad/relationships)
:::
<!-- /cad-v2-relations -->
