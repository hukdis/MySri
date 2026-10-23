---
id: cad-0103
title: CAD-Llama：让预训练语言模型学习带层次描述的 CAD 代码
navTitle: CAD-Llama
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
  - cad-0105
  - cad-0104
order: 22
sources:
  - sources/论文/先读/CAD-Llama.md
  - 'https://arxiv.org/abs/2505.04481'
status: draft
reviewed: false
created: '2026-10-07'
updated: '2026-10-23'
---
# CAD-Llama：让预训练语言模型学习带层次描述的 CAD 代码

<!-- cad-v2-context -->
> **研究任务 · CAD生成** · [研究总览](/cad/) · [九篇详读](/cad/reading-navigation?reading=1)
<!-- /cad-v2-context -->

把 CAD 命令改写成文本，并不意味着通用语言模型就知道哪段数值代表底座、哪段操作形成孔。若语言只描述整体外形，而代码是一长串坐标，二者之间仍缺少局部对应。

**CAD-Llama 把这一对应关系写进训练表示：整体描述、部件名称、部件描述与建模代码相互嵌套。** 然后让预训练 LLaMA3-8B 先学习这种表示，再学习按指令使用它。论文值得追踪的是语义如何落到代码，而不只是骨干模型换成了 Llama。

## 阅读前需要了解的技术 {#technical-primer}

本文真正训练了预训练语言模型。理解“训练了什么、怎样让语言对应代码”，比先记住模型规模更有帮助。

### 领域适配预训练：继续学习 CAD 的表达方式 {#primer-domain-pretraining}

预训练模型已经从大量通用文本学习到一些语言与代码规律。领域适配是在这个基础上继续训练：输入 CAD 描述和代码构成的文本序列，预测下一个 token，并据误差更新权重。它让模型接触领域格式与结构，不是推理时临时给模型看一份资料。本文先用 SPCC 语料做这一步。

### 指令微调：用任务示例教模型怎样回答 {#primer-instruction-tuning}

指令微调把输入组织为请求与上下文，把输出组织为期望答案。例如输入“已有代码 + 删除底座的指令”，目标是编辑后的表示。监督训练提高正确答案 token 的预测概率，更新模型参数；生成、补全、描述等任务可以共用骨干。它改变模型权重，而 few-shot 提示只是在当次上下文中提供示例。

### LoRA：冻结原权重，训练较小的增量 {#primer-lora}

普通全参数微调更新原模型的全部权重；LoRA 冻结选定层的原权重，在其上学习由两个低秩矩阵组成的增量，常写成 **W′ = W + BA**。输入输出仍经过原有网络，只是可训练参数减少。本文适配预训练使用全参数训练，后续指令阶段使用 LoRA；LoRA 不等于把整个模型压缩成小模型。

### SPCC 的语义对应：让部件描述靠近部件代码 {#primer-spcc-alignment}

SPCC 将整体描述、部件名称、部件描述与对应代码分层组织。它提供“这段话和哪段建模过程相关”的训练线索，并不要求额外为每个词标注唯一几何对象。模型仍通过 token 预测学习；这里的代码是论文定义的 Python 风格伪代码，不应当作任意 Python 环境可直接运行的程序。

**理解示例**：先通过大量“底座描述 + 底座代码”学习领域表示，再用“生成一个带底座的模型 → 目标代码”学习按请求输出。前后两个阶段都在学习，目标与数据组织方式不同。

概念依据：[LoRA 原论文](https://arxiv.org/abs/2106.09685)；训练阶段与 SPCC 组织见 [CAD-Llama §3–4](https://arxiv.org/abs/2505.04481)。

配套实践：[真实模型 LoRA 微调](/basics/practice/pretrained) · [全部技术地图](/basics/practice/paper-map)。

## 语言描述落到哪里，决定模型能够学到什么 {#_3-问题、任务与必要术语}

设想描述一个由圆柱底座和带切口结构组成的模型。整段文字与完整命令序列配对，只告诉网络二者相关；如果底座、切口分别有名字和描述，并紧邻对应代码，语言与局部建模操作之间就多了一层组织。这是理解 [SPCC](#primer-spcc-alignment) 的入口。

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

图 2 中的 **SPCC（Structured Parametric CAD Code）** 将整体抽象/详细描述、局部名称/描述与对应代码组合起来。模型生成某个组件时，可以在同一文本上下文中看到该组件的语义和实现。（原文 §3。）

这里有两项容易混淆的边界。其一，“部件”主要指建模组件，并不自动等于装配中的独立零件。其二，SPCC 是论文定义的 **Python-like pseudocode**，需要相应解释或转换实现；它不是任意环境中可直接运行的 CadQuery 脚本。底层仍保留草图—拉伸及坐标量化范围。（补充材料 C。）

## 先建立局部含义，再把局部组织成整体 {#_4-表示与标注-为什么需要-spcc}

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

图 3 的两阶段标注不是简单把描述写得更长。第一阶段利用部件渲染、二维草图和部分参数，让 GPT-4o 描述局部；第二阶段再结合整体模型、突出目标部件的图像和已有描述，生成整体描述及部件短名称。名称把整体叙述中的对象与代码段连接起来。（§3.2、补充材料 D.1。）

沿着前面的底座例子，模型需要学到的不只是“存在圆柱”，而是这段关于圆柱底座的语言对应哪段构造代码。对重复结构的合并处理也发生在这种组织过程中。由此可以理解，标注质量会直接影响代码对齐：如果视觉模型误认部件或遗漏关系，层次结构本身并不能保证描述正确。

## 学会 CAD 表达，与学会按指令使用它，是两步训练 {#_5-两阶段训练-以及成本如何阅读}

第一步在 SPCC 语料上继续训练 **LLaMA3-8B**，仍采用下一个 token 预测目标。它使模型接触 CAD 的领域格式与组件组织。作者还用渲染图 CLIP 特征将相似 CAD 文档排入同一上下文；这是训练数据组织策略，不是推理时的几何验证器。（§3–4。）

第二步使用生成、补全、描述、添加、删除等指令数据进行 [LoRA](#primer-lora) 微调，得到 **CAD-Llama-INS**。这一步才明确教模型在不同输入任务下产生相应输出。因此，表格中的 CAD-Llama 与 CAD-Llama-INS 需要分开看，不能将两阶段效果混成一个“预训练 LLM 原生能力”。

:::: details 数据、训练参数与标注成本

原始来源约 178K DeepCAD 模型；去重并去掉大部分重复简单模型后，约 **100K CAD** 用于训练，指令阶段约 **48K 条**。这与 Text2CAD 的处理和规模不同，不能直接沿用其划分或数值。

适配阶段全参数训练；指令阶段 LoRA rank 256、alpha 128，两阶段上下文长度分别 2048 / 4096。（§4.1。）

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

表 7 两阶段均使用 4 张 A100，分别记录 **38 / 12 A100-GPU hours**，以及 GPT-4o 标注 **70M / 6M tokens**。GPU hours 不应直接称为同等小时的墙钟训练时长；标注 token 与本地训练开销也属于不同成本。（补充材料表 7。）

::::

## 最关键的证据：收益是否来自层次对应 {#_7-2-表示消融更接近方法贡献}

如果只是展示完整模型比某个基线更好，很难判断收益来自预训练骨干、代码形式还是描述信息。表示消融更贴近这篇论文的核心主张。

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

表 6 将“单一/层次描述”与“命令序列/代码”组合成 SDCS、SDCC、SPCS、SPCC 四种表示。SPCC 命令/参数准确率为 **80.41% / 59.09%**，成功率 SR 为 **99.30%**；层次描述加命令序列的 SPCS，SR 也达到 **98.71%**，而两种单一描述表示的 SR 分别为 **18.14% / 21.46%**。（§4，表 6。）

这使“语言与局部结构对应很重要”获得了比总排名更直接的支持，同时也提醒我们：代码形式不是唯一变化因素。描述信息量、序列组织和长度都可能共同影响结果，不能据此证明任何代码表示在所有任务上都更好。

## 总分提高之后，还要拆开看模型究竟答对了什么 {#_7-实验与消融-哪些证据最有用}

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

表 4 中，CAD-Llama-INS 的 ACCT 为 **84.72**，本篇设置下 Text2CAD 为 **69.91**，相差 **14.81 个百分点**。但 ACCT 是把命令/参数准确率均值再与 SR 平均得到的混合分数，不能称为完整文字要求满足率。（§4，表 4。）

本方法 MCD 为 **10.53**，比较方法为 **20.64**，在本表协议下更低。它不能与 Text2CAD 原论文表中的 **0.37** 直接排序：数据处理、评价定义与缩放不一致。表 4 的证据说明本设置下的改进，不构成脱离协议的跨论文排行榜。

:::: details 指标定义与其他任务的范围

**ACCT = ((ACCcmd + ACCparam) / 2 + SR) / 2**。较高 SR 会推高总分；可执行但参数有误的模型仍可能取得不低的混合分数。表 4 的 MCD/MMD/JSD 乘以 100 显示。

无条件生成还使用 COV、MMD、JSD、Novel，描述任务使用 BLEU、ROUGE，删除任务有 Exact Match。Novel 检查与训练序列重复的情况，不直接证明新工程功能。

表 5 的 Deletion* 中，GPT-4 得分 **90.41** 高于 CAD-Llama-INS **89.55**。添加和删除任务也不能概括成任意自然语言组合编辑能力。（§4。）

::::

## 层次语义降低了理解门槛，却没有替代几何验证 {#_8-局限与失败案例}

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

图 25 将失败分成参数错误与文本不匹配两类。联系表示消融中的高 SR，这张图说明：即使程序成功构建了实体，数值和设计含义仍可能出错。部件名称使代码更有语义，但名称本身不负责检查孔径、数量或空间关系。（补充材料 E.6。）

回到开头，CAD-Llama 的推进在于让“底座是什么”与“底座怎样构造”更紧密地共同出现，并借两阶段训练将这种表示用于多任务。它仍受草图—拉伸数据分布、量化及合成描述误差限制，也没有由此解决任意 B-rep 边/面选择。

与本文对照阅读，[CAD-Recode](/cad/cad-recode) 使用可执行 CadQuery Python，并将点云作为主要输入；[CAD-Editor](/cad/cad-editor) 则把编辑区域的定位单独建模。它们分别沿着执行表示与局部修改继续推进，不应只按语言模型名称归类。

[原论文 PDF：CAD-Llama，2505.04481v2](https://arxiv.org/pdf/2505.04481)。图表来源与 PDF 页码见各图说明。

:::: details 论文信息与版本

<span id="_1-论文信息与方向定位"></span>

- **全名**：CAD-Llama: Leveraging Large Language Models for Computer-Aided Design Parametric 3D Model Generation。
- **作者**：Jiahao Li、Weijian Ma、Xueyang Li 等。
- **出处与版本**：矩阵记录为 CVPR 2025；所用版本为 arXiv **2505.04481v2，2025-06-10**，共 31 页，含补充材料。
- **来源**：[arXiv](https://arxiv.org/abs/2505.04481)、[出版 DOI](https://doi.org/10.1109/CVPR52734.2025.01730)。

::::

<!-- Published section anchors retained for incoming links. -->
<span id="_4-1-总体框架"></span>
<span id="_4-2-层次标注流程"></span>
<span id="_5-1-spcc-适配预训练"></span>
<span id="_5-2-cad-[指令微调](#primer-instruction-tuning)"></span>
<span id="_5-3-原论文成本"></span>
<span id="_6-数据与指标-acct-不是什么"></span>
<span id="_7-1-文本到-cad"></span>
<span id="_9-放回方向地图-并与前两篇连接"></span>
<span id="_10-阅读自测与阅读卡"></span>
<span id="_11-来源与核查记录"></span>

<!-- cad-v2-relations -->
::: details 研究树关联：发展关系、资源与问题

### R08 · 相关基础

[DeepCAD](/cad/deepcad) → [CAD-Llama](/cad/cad-llama)

CAD-Llama的数据与命令表示以DeepCAD为基础，再转换为SPCC并适配LLM；不继承DeepCAD的生成网络。

原文位置：数据与表示章节；原文§3–4。

[CAD生成](/cad/tasks/generation) · [发展关系](/cad/relationships)
:::
<!-- /cad-v2-relations -->
