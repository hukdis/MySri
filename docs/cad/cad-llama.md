---
id: cad-0103
title: CAD-Llama：让预训练语言模型学习带层次描述的 CAD 代码
navTitle: CAD-Llama
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
  - cad-0105
  - cad-0104
order: 22
sources:
  - sources/论文/先读/CAD-Llama.md
  - 'https://arxiv.org/abs/2505.04481'
status: draft
reviewed: false
created: '2026-10-07'
updated: '2026-10-20'
---
# CAD-Llama：让预训练语言模型学习带层次描述的 CAD 代码

<!-- cad-v2-context -->
> **研究任务 · CAD生成** · [研究总览](/cad/) · [九篇详读](/cad/reading-navigation?reading=1)
<!-- /cad-v2-context -->

## 论文信息 {#_1-论文信息与方向定位}

- **全名**：CAD-Llama: Leveraging Large Language Models for Computer-Aided Design Parametric 3D Model Generation。
- **作者**：Jiahao Li、Weijian Ma、Xueyang Li 等。
- **出处与版本**：矩阵记录为 CVPR 2025；所用版本为 arXiv **2505.04481v2，2025-06-10**，共 31 页，含补充材料。
- **来源**：[arXiv](https://arxiv.org/abs/2505.04481)、[出版 DOI](https://doi.org/10.1109/CVPR52734.2025.01730)。

**一句话理解**：针对普通数值命令难以让预训练语言模型学到部件含义及其建模方式的问题，CAD-Llama 将 CAD 历史改写为整体描述、部件描述与建模代码相互对应的 SPCC 层次语料，对 LLaMA3-8B 先做领域适配预训练，再用 LoRA 做多任务指令微调，使模型能够按文本要求输出参数化建模代码。

这篇确实使用预训练 LLM。名称中的 Llama 对应具体模型路线，但方法贡献不能只概括为“把模型换成 LLaMA”。

## 问题、任务与必要术语 {#_3-问题、任务与必要术语}

直接把一串数值 CAD 命令交给通用语言模型，既难表达语义，也不利于借用其代码能力。论文希望让模型知道“这段代码对应哪个部件、部件之间如何组合”。

任务包括：

1. **文本到 CAD**：自然语言描述 → SPCC。
2. **无条件生成**：给共同格式前缀 → 新 CAD。
3. **补全、描述、添加和删除**：输入已有代码或部分表示 → 指定输出。

这里的“部件”多指模型内的建模组件，不应默认等同于工业装配中的独立零件。

术语：

- **SPCC**：Structured Parametric CAD Code，结构化参数 CAD 代码表示。
- **领域适配预训练**：继续用 CAD 语料训练已有语言模型，让它学习领域格式与分布。
- **指令微调**：用“输入任务—输出答案”配对训练模型按要求完成任务。
- **LoRA**：通过额外低秩参数进行微调，减少可训练参数。
- **层次描述**：整体描述与局部部件描述相互关联，而不只是给代码加一个总标题。

## 表示与标注：为什么需要 SPCC？ {#_4-表示与标注-为什么需要-spcc}

### 总体框架 {#_4-1-总体框架}

<PaperFigure src="/papers/cad-llama/figure02_overview.png" title="CAD-Llama 原图 2：整体框架与 SPCC" source="https://arxiv.org/abs/2505.04481" :page="3" />

<!-- figure-translation:/papers/cad-llama/figure02_overview.png -->
**原文翻译（图注）**

图2：所提出的 CAD-Llama 框架概览。框架包括两部分：第一部分是 SPCC 数据合成，利用层次标注流水线将 CAD 序列转换为 SPCC 表示；第二部分是预训练与指令微调，利用所得 SPCC 语料提升模型性能。

**关键标记**

SPCC Adaptive Pretraining：SPCC 适配预训练；CAD-Centric Instruction Tuning：面向 CAD 的指令微调。

::: details 对照英文原文

Figure 2. Overview of the proposed framework CAD-Llama. The framework consists of two parts: (1) SPCC data synthesis, which employs the hierarchical annotation pipeline to convert CAD sequences into SPCC representations, and (2) the pretraining and instruction tuning process, where the resulting SPCC corpus is leveraged to enhance model performance.
:::

**图表解读**
<!-- /figure-translation -->

**来源**：原图 2，PDF 第 3 页；对应 §3。

SPCC 将整体抽象/详细描述、部件名称/描述与对应建模代码组合起来，让几何结构与语言在同一文本中出现。

**代码形式边界**：补充材料 C 明确将其称为 **Python-like pseudocode**。其中 Loop、Line、Arc、Circle、Extrude 等由论文定义。不要把它直接当作使用任意现成 CadQuery API 的 Python 脚本；复现时需要对应解释或转换实现。

它保留 DeepCAD 草图–拉伸的表示范围，不因为用了代码就自动支持所有 CAD 操作。坐标仍有量化；代码形式主要改进语义与结构表达，而不是消除了几何精度限制。

### 层次标注流程 {#_4-2-层次标注流程}

<PaperFigure src="/papers/cad-llama/figure03_annotation.png" title="CAD-Llama 原图 3：两阶段层次标注" source="https://arxiv.org/abs/2505.04481" :page="4" />

<!-- figure-translation:/papers/cad-llama/figure03_annotation.png -->
**原文翻译（图注）**

图3：层次标注流水线。图中展示 CAD 模型的两阶段标注过程：第一阶段生成各部件的详细描述；第二阶段生成全局描述，同时包含抽象概述，以及能够表达部件间空间关系的详细描述。

**关键标记**

Components Desc／Overall Desc：部件描述／整体描述。

::: details 对照英文原文

Figure 3. Hierarchical Annotation Pipeline. The figure illustrates our two-stage annotation process for CAD models. In the first stage, detailed descriptions of individual components are generated. In the second stage, a global description is produced, which includes both an abstract overview and detailed descriptions that capture the spatial relationships between components.
:::

**图表解读**
<!-- /figure-translation -->

**来源**：原图 3，PDF 第 4 页；对应 §3.2。

- **阶段一**：输入部件的三维渲染、二维草图和部分参数，使用 GPT-4o 生成局部描述。
- **阶段二**：结合整体模型、强调目标部件的图像和局部描述，生成整体描述及部件短名称。
- 名称把整体语言和局部建模组件连接起来；对重复结构也进行合并处理，见补充材料 D.1。

**分析**：价值不只是“更多描述”，而是让模型在生成某段代码时能够利用相关语义。但 VLM 描述可能有误，格式化后的文本也可能具有合成模板偏差。

## 两阶段训练，以及成本如何阅读 {#_5-两阶段训练-以及成本如何阅读}

### SPCC 适配预训练 {#_5-1-spcc-适配预训练}

使用 **LLaMA3-8B**，在 SPCC 语料上继续训练。作者还根据模型渲染图的 CLIP 特征组织相似 CAD 文档，使同一上下文包含相近实例。

训练目标仍是语言模型的下一个 token 预测。相似文档组织是训练数据的排列策略，不是推理阶段的 CAD 执行验证器。

### CAD 指令微调 {#_5-2-cad-指令微调}

在生成、补全、描述、增删等任务上用 LoRA 微调，得到 **CAD-Llama-INS**。主文报告适配阶段全参数训练；指令阶段 LoRA rank **256**、alpha **128**。上下文长度分别 **2048 / 4096**（§4.1，PDF 第 6 页）。

**需要区分**：CAD-Llama 是适配预训练后的模型，CAD-Llama-INS 是后续指令微调版本。表格比较时先看用了哪个版本。

### 原论文成本 {#_5-3-原论文成本}

<PaperFigure src="/papers/cad-llama/table07_cost.png" title="CAD-Llama 原表 7：训练与标注成本" source="https://arxiv.org/abs/2505.04481" :page="12" />

<!-- figure-translation:/papers/cad-llama/table07_cost.png -->
**原文翻译（表注）**

表7：两个训练阶段的训练成本与 token 消耗。表中的 token 用于各阶段的提示生成。

**关键标记**

A100-GPU Hours：A100 GPU 小时数；Tokens (GPT-4o)：GPT-4o token 数。

::: details 对照英文原文

Table 7. Training costs and token consumption during the two training stages. Tokens are used for prompt generation in each stage.
:::

**图表解读**
<!-- /figure-translation -->

**来源**：补充材料表 7，PDF 第 12 页。

两个训练阶段均使用 **4 张 A100**。表中分别记录：

- 适配预训练：**38 A100-GPU hours**，GPT-4o 标注约 **70M tokens**。
- 指令微调：**12 A100-GPU hours**，GPT-4o 标注约 **6M tokens**。

**GPU hours 是论文表格所用单位**，不能直接称为“38 小时墙钟时间”。同时，GPT-4o tokens 是数据标注开销，不是本地训练 token 成本。

四张 4090 的显存和通信条件不同，本文数字不足以直接换算本地成本。先准备数据与小规模试跑，再判断是否复现完整适配训练。

## 数据与指标：ACCT 不是什么？ {#_6-数据与指标-acct-不是什么}

原始数据来自 DeepCAD，约 **178K CAD**。作者去掉大部分重复简单模型并采用去重策略，约 **100K CAD** 留用于训练。指令阶段从任务中采样构成约 **48K 条**数据（§4.1，PDF 第 6 页）。

去重方法和训练规模要跟本篇记录；不能直接沿用 Text2CAD 的数据规模与结果。增删指令由 GPT-4o 辅助生成，并考虑删除部件后操作是否仍合理。

指标按任务变化：

- 无条件生成：COV、MMD、JSD、成功率 SR、Novel。
- 文本到 CAD：命令准确率、参数准确率、SR，以及 MCD/MMD/JSD。
- 描述：BLEU、ROUGE。
- 删除：Exact Match；添加：命令与参数准确率。

**ACCT 的定义**：对命令与参数准确率取平均，再与成功率取平均，即：

ACCT = ((ACCcmd + ACCparam) / 2 + SR) / 2。

因此 **ACCT 是混合分数**，不是“完整文本要求满足率”。高 SR 会推高它；也不能把 ACCT 与其他论文的 F1、人工偏好或 CADTests pass rate 当作同一指标。

Novel 主要检验生成序列与训练样本是否重复，不自动证明生成了新的工程设计功能。

## 实验与消融：哪些证据最有用？ {#_7-实验与消融-哪些证据最有用}

### 文本到 CAD {#_7-1-文本到-cad}

<PaperFigure src="/papers/cad-llama/table04_text.png" title="CAD-Llama 原表 4：文本生成结果" source="https://arxiv.org/abs/2505.04481" :page="7" />

<!-- figure-translation:/papers/cad-llama/table04_text.png -->
**原文翻译（表注）**

表4：文本到 CAD 任务的结果。ACCT 以百分比报告；MCD、MMD、JSD 的显示值乘以10²。

**关键标记**

↑ 越大越好；↓ 越小越好。

::: details 对照英文原文

Table 4. Results on text-to-CAD task. The metric ACCT is multiplied by 100%. MCD, MMD, and JSD are multiplied by 10².
:::

**图表解读**
<!-- /figure-translation -->

**来源**：原表 4，PDF 第 7 页。ACCT 按百分比显示，MCD/MMD/JSD 显示值乘以 100。

CAD-Llama-INS 的 ACCT 为 **84.72**，Text2CAD 在本篇设置下为 **69.91**。差为 **14.81 个百分点**，不应混淆为相对提升 14.81%。

MCD 为 **10.53**，与 Text2CAD 的 **20.64** 相比更低。不能再拿这些显示值和 Text2CAD 原论文表 1 的 **0.37** 直接排序：数据处理、任务协议、指标缩放和比较设置需要逐项统一。

### 表示消融更接近方法贡献 {#_7-2-表示消融更接近方法贡献}

<PaperFigure src="/papers/cad-llama/table06_representation.png" title="CAD-Llama 原表 6：表示消融" source="https://arxiv.org/abs/2505.04481" :page="8" />

<!-- figure-translation:/papers/cad-llama/table06_representation.png -->
**原文翻译（表注）**

表6：文本到 CAD 任务中不同 CAD 表示方法的评价。SDCS 使用单个文本描述作为 CAD 命令序列的前缀；SDCC 使用单个描述配合 CAD 代码；SPCS 将层次描述与 CAD 命令序列结合；SPCC 则将层次描述与 CAD 代码结合。

**关键标记**

ACCcmd／ACCparam：命令／参数准确率；SR：成功率。

::: details 对照英文原文

Table 6. Evaluation of different CAD representation methods in the Text-to-CAD task. SDCS uses a single textual description as a prefix along with CAD command sequences, while SDCC uses CAD code with a single description. SPCS incorporates hierarchical descriptions with CAD command sequences, and SPCC combines hierarchical descriptions with CAD code.
:::

**图表解读**
<!-- /figure-translation -->

**来源**：原表 6，PDF 第 8 页。

四种表示分别为：

- **SDCS**：单一描述 + 命令序列。
- **SDCC**：单一描述 + CAD 代码。
- **SPCS**：层次描述 + 命令序列。
- **SPCC**：层次描述 + CAD 代码。

SPCC 的命令/参数准确率为 **80.41% / 59.09%**，SR **99.30%**。SPCS 的 SR 也较高，为 **98.71%**；单一描述两种表示的 SR 为 **18.14% / 21.46%**。

这张表支持层次描述与代码形式在本训练设置中有帮助。但每项变化还涉及序列长度、描述信息量等因素，不能将其解释为对所有代码表示的一般性证明。

**还有一处值得复查**：表 5（PDF 第 8 页）中 Deletion* 的 GPT-4 分数 **90.41** 高于 CAD-Llama-INS **89.55**。作者方法并非每项任务都第一；添加和删除也不能概括为任意自然语言编辑能力。

## 局限与失败案例 {#_8-局限与失败案例}

<PaperFigure src="/papers/cad-llama/figure25_failures.png" title="CAD-Llama 原图 25：参数错误和文本不匹配" source="https://arxiv.org/abs/2505.04481" :page="31" />

<!-- figure-translation:/papers/cad-llama/figure25_failures.png -->
**原文翻译（图注）**

图25：CAD-Llama-INS 的失败案例。这里展示两类错误：参数设置不准确，以及与文本提示不匹配。

**关键标记**

Parameter Error：参数错误；Mismatch Text Description：与文本描述不符。

::: details 对照英文原文

Figure 25. Failure cases for CAD-Llama-INS. We illustrate two types of errors: inaccuracies in parameter settings and misalignment with the text prompts.
:::

**图表解读**
<!-- /figure-translation -->

**来源**：补充材料图 25，PDF 第 31 页；失败分析见补充材料 E.6。

原文展示两类错误：参数生成错误，以及文本与生成操作不一致。高实体成功率没有排除这些问题。

还需保留范围：

- 学习的基础数据仍是特定草图–拉伸分布。
- SPCC 中的名称有助于语义组织，但不能据此声称已解决任意 B-rep 边/面选择。
- 添加、删除任务不等于复杂组合编辑的全面验证。
- 层次标注有 API 成本，也有描述误差风险。
- 参数化代码表示不保证所有设计意图或约束被保持。

后面几项是结合任务和协议的**分析**，不能伪装成作者做过的独立实验证明。

## 相关研究 {#_9-放回方向地图-并与前两篇连接}

- **条件生成**：直接实现文本到 CAD。
- **CAD 表示**：SPCC 将几何、代码和层次语义组织在一起；实体选择更多是表示基础，不是全面解决。
- **编辑与交互**：补全、添加、删除展示了交互用途，范围由任务定义限制。
- **数据与评测**：合成标注、去重、混合指标和训练语料组织会影响比较与泛化。

与 Text2CAD 相比：两篇都依赖文本标注，Text2CAD 训练专用 CAD 解码器，CAD-Llama 继续训练已有 LLM。与 DeepCAD 相比：核心 CAD 操作范围仍相近，但语言和代码组织更丰富。

读完不必立即选 8B 全参数训练路线。先说明你希望利用的是层次表示、标注策略，还是预训练代码先验，之后再做受控实验。

## 思考与自测 {#_10-阅读自测与阅读卡}

1. CAD-Llama 和 CAD-Llama-INS 有什么区别？
2. SPCC 是否可以直接等同于任意 CadQuery Python？
3. ACCT=84.72 是否意味着 84.72% 模型完全满足文本？
4. 38 A100-GPU hours 是否等于 38 小时训练时长？
5. 表 6 最主要在比较什么？
6. 高 SR 为什么仍会出现图 25 的错误？

<details>
<summary>参考答案：完成自测后展开</summary>

1. 前者完成领域适配预训练，后者进一步进行 CAD 指令微调。
2. 不可以，它是论文定义的 Python 风格伪代码及相关表示。
3. 不是，ACCT 是命令、参数和成功率的混合分数。
4. 不能如此转换，应保留 GPU hours 单位并核查计时定义。
5. 单一/层次描述与序列/代码形式的组合。
6. 可执行或可构建不代表尺寸正确或与文本意图一致。

</details>

## 参考文献 {#_11-来源与核查记录}

- [原论文 PDF](https://arxiv.org/pdf/2505.04481)

图表引自原论文，图号与 PDF 页码见各图说明。

<!-- cad-v2-relations -->
::: details 研究树关联：发展关系、资源与问题

### R08 · 相关基础

[DeepCAD](/cad/deepcad) → [CAD-Llama](/cad/cad-llama)

CAD-Llama的数据与命令表示以DeepCAD为基础，再转换为SPCC并适配LLM；不继承DeepCAD的生成网络。

原文位置：数据与表示章节；原文§3–4。

[CAD生成](/cad/tasks/generation) · [发展关系](/cad/relationships)
:::
<!-- /cad-v2-relations -->
