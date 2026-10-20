---
id: cad-0109
title: CAD-Assistant：让视觉语言模型调用 CAD 工具完成任务
navTitle: CAD-Assistant
category: cad
type: paper
tags:
  - 论文阅读
  - 反馈与评测
prerequisites:
  - cad-0101
  - cad-0003
related:
  - cad-0002
  - cad-0107
  - cad-0108
order: 28
sources:
  - sources/论文/先读/CAD-Assistant.md
  - 'https://arxiv.org/abs/2412.13810'
status: draft
reviewed: false
created: '2026-10-07'
updated: '2026-10-20'
---
# CAD-Assistant：让视觉语言模型调用 CAD 工具完成任务

<!-- cad-v2-context -->
> **研究任务 · CAD理解、评估与规划** · [研究总览](/cad/) · [九篇详读](/cad/reading-navigation?reading=1)
<!-- /cad-v2-context -->

## 论文信息 {#_1-论文信息与方向定位}

- **全名**：CAD-Assistant: Tool-Augmented VLLMs as Generic CAD Task Solvers。
- **作者**：Dimitrios Mallis、Ahmet Serda Karadeniz、Sebastian Cavada 等。
- **出处与版本**：2024 年预印本、ICCV 2025；所用版本为 arXiv **2412.13810v3，2025-08-26**，共 28 页。
- **来源**：[arXiv](https://arxiv.org/abs/2412.13810)、[出版 DOI](https://doi.org/10.1109/ICCV51701.2025.00684)、[作者代码链接](https://github.com/dimitrismallis/CAD-Assistant)。

**一句话理解**：针对通用视觉语言模型缺少直接操作 CAD 软件和检查几何状态的能力，CAD-Assistant 采用免训练的工具增强视觉语言模型（tool-augmented VLLM）框架，提供 Python/FreeCAD、草图识别和约束检查工具，让规划器把用户请求分解为操作，执行后读取几何与运行反馈并继续调整，直到模型判断任务结束或达到交互限制。

“免训练”指该框架不需要为这些 CAD 任务重新微调规划器，不代表没有预训练模块，也不代表推理免费。

## 输入、输出与必要术语 {#_3-输入、输出与必要术语}

输入可以是任务文字、手绘草图、三维模型状态或扫描相关请求。不同任务的最终输出不同：

- CAD 问答：答案。
- 自动添加约束：更新后的 CAD 草图及约束。
- 手绘草图参数化：在 CAD 软件中可用的几何与约束。
- 扩展展示：实体生成、旋转、圆角、扫描截面重建等。

不能把以上都等同于一个统一的“生成完整工业 CAD 成功率”。

术语：

- **planner**：根据请求和当前状态产生计划的模型。
- **action**：交给工具/解释器执行的 Python 操作。
- **environment**：保存 CAD 状态、执行代码并返回结果的环境。
- **trajectory**：一条请求从开始到结束的工具交互记录。
- **solver**：CAD 几何约束求解器，会根据约束调整几何参数。
- **docstring**：工具接口的说明，帮助模型知道函数用途、参数和返回值。

## 框架与工具集 {#_4-框架与工具集}

<PaperFigure src="/papers/cad-assistant/figure02_loop.png" title="CAD-Assistant 原图 2：闭环框架" source="https://arxiv.org/abs/2412.13810" :page="4" />

<!-- figure-translation:/papers/cad-assistant/figure02_loop.png -->
**原文翻译（图注）**

图2：CAD-Assistant 框架概览。将多模态用户请求作为上下文提供给 VLLM 规划器 P。在时间步 t，规划器生成计划 pt 与动作 at（Python 代码）。动作在环境 E 中执行，产生的执行输出 ft 被反馈给规划器，用于生成下一个时间步的内容。

**图内文字与标记**

- Planner / ToolSet / Environment：规划器／工具集／环境；Context：上下文；Plan / Action：计划／动作。
- Generated FreeCAD Sketch / Input Hand-drawn Sketch：生成的 FreeCAD 草图／输入的手绘草图。
- 用户请求：“将手绘图像转换为带约束的 CAD 草图。”计划示例：“要把图像转换为带约束的 CAD 草图，我先使用 sketch_from_image 提取几何元素。”
- Plan at time step t, expressed as natural language：时间步 t 的计划，用自然语言表示；Action at time step t, expressed as Python code：时间步 t 的动作，用 Python 代码表示。

::: details 对照英文原文

Figure 2. Overview of CAD-Assistant framework. A multimodal user request is provided as context to a VLLM planner P. At step t, the planner generates a plan pt and an action at (python code). The action is executed on an environment E and the generated execution output ft is fed back to the planner, enabling generation for the next timestep.
:::

**图表解读**
<!-- /figure-translation -->

**来源**：原图 2，PDF 第 4 页；对应 §3.1。

一轮流程：

1. 模型读取用户请求、历史和工具说明。
2. 用自然语言形成计划。
3. 生成 Python 操作。
4. 环境执行，更新 FreeCAD 状态。
5. 返回日志、JSON 或渲染图，成为下一轮上下文。
6. 模型生成 TERMINATE，宣告已处理。

**TERMINATE 是模型的结束判断，不是独立正确性证明。** 实际评价仍要检查答案、几何或约束是否正确。

<PaperFigure src="/papers/cad-assistant/table01_tools.png" title="CAD-Assistant 原表 1：工具集" source="https://arxiv.org/abs/2412.13810" :page="5" />

<!-- figure-translation:/papers/cad-assistant/table01_tools.png -->
**原文翻译（表注）**

表1：CAD 专用工具概览。

**图内文字与标记**

- Module Type / Module Description：模块类型／模块描述。
- Python：动作格式与逻辑运算；FreeCAD：与 CAD 软件[11]集成。
- Sketch Parameterizer（草图参数化工具）：借助文献[21]将手绘草图图像转换为 CAD 草图。
- Sketch Recognizer（草图识别工具）：渲染草图并标出参数；Solid Recognizer（实体识别工具）：渲染三维 CAD 模型并标出参数。
- Constraint Checker（约束检查工具）：分析几何约束；Crosssection Extract（截面提取工具）：从三维网格生成截面图像。

::: details 对照英文原文

Table 1. Overview of CAD-specific tools.
:::

**图表解读**
<!-- /figure-translation -->

**来源**：原表 1，PDF 第 5 页。

工具包括 Python、FreeCAD、手绘草图参数化、草图/实体识别与渲染、约束检查、截面提取。

学习这篇时尤其注意：工具可以真正计算几何，而不只是让模型“想象”几何。FreeCAD 中的参数、实体查询和约束求解是外部事实来源。

手绘参数化工具采用已有专用方法，因此“免训练代理”也会依赖此前训练好的模块。

## 为什么表示和工具调用会影响结果？ {#_5-为什么表示和工具调用会影响结果}

§4.1 比较不同几何参数化、序列化形式和渲染输入：

- 一条线可按端点表示，也可按方向及距离表示。
- 同样几何可序列化为 CSV、Markdown、HTML、JSON。
- 精确渲染与手绘图提供不同质量的信息。

原表 2（PDF 第 5 页）中，GPT-4o 的点式 JSON 结果 **0.748**，原 SGPBench 格式 **0.674**；精确草图渲染 **0.754**，手绘图 **0.616**。

这些差异支持信息表达影响推理。不能把它概括为“JSON 对任何 LLM 任务都最优”；本文任务和参数定义构成条件。

作者采用视觉与文本相结合的识别工具，把几何结构和参数提供给规划器。在约束任务中，还使用检查工具观察求解前后的几何变化。

## 实验任务、指标与推理成本 {#_6-实验任务、指标与推理成本}

量化实验主要有三个：

1. **CAD 问答（CQA）**：使用 SGPBench 的 2D/3D 部分。模型在 FreeCAD 中通过工具理解预载模型，而不是所有对比方案都接收完全相同输入。
2. **自动约束**：使用 SketchGraphs 中约 **700 个草图**，报告原语 F1（PF1）和约束 F1（CF1）。
3. **手绘草图参数化**：报告参数准确率及图像空间 CD，采用与约束任务相同测试分段。

PF1 要求基元类型和参数匹配；CF1 还要求相关基元正确，见 §4.2。**指标是在应用 CAD 求解器后计算的**：不能只评价模型输出的约束语句是否像答案。

论文为与基线比较，对结果进行量化，代理本身不依赖同一离散 token 预测格式。图像空间 CD 也不能和三维点云 CD 直接比较。

### 原论文推理成本

<PaperFigure src="/papers/cad-assistant/table11_cost.png" title="CAD-Assistant 原表 11：API 请求成本" source="https://arxiv.org/abs/2412.13810" :page="15" />

<!-- figure-translation:/papers/cad-assistant/table11_cost.png -->
**原文翻译（表注）**

表11：使用 GPT-4o 作为 VLLM 规划器时，CAD-Assistant 每个用户请求的成本。

**图内文字与标记**

- Task：任务；Avg Input / Output Tokens：平均输入／输出 token 数；Avg Cost per User Request：每个用户请求的平均成本。
- CAD Question Answering：CAD 问答；Autoconstraining：自动添加约束；Handdrawn sketch parameterization：手绘草图参数化。
- 图中金额单位为美元，数值沿用论文实验记录。

::: details 对照英文原文

Table 11. Cost per user request for the CAD-Assistant utilizing GPT-4o as VLLM planner.
:::

**图表解读**
<!-- /figure-translation -->

**来源**：补充材料表 11，PDF 第 15 页。

论文使用 GPT-4o 规划器，报告每个请求的历史平均成本：

- CAD 问答：**11280 输入 / 178 输出 tokens，$0.0299**。
- 自动约束：**28422 / 852，$0.0795**。
- 手绘参数化：**31170 / 1081，$0.0887**。

这些是**论文实验时的成本**，不是当前 API 报价。重复上下文、交互轮数、图像和工具执行会影响总开销；本地 GPU 数量不能消除远程模型成本。

## 结果与消融怎么读？ {#_7-结果与消融怎么读}

### CAD 问答 {#_7-1-cad-问答}

<PaperFigure src="/papers/cad-assistant/table03_qa.png" title="CAD-Assistant 原表 3：问答结果" source="https://arxiv.org/abs/2412.13810" :page="6" />

<!-- figure-translation:/papers/cad-assistant/table03_qa.png -->
**原文翻译（表注）**

表3：在 SGPBench[45]的二维和三维子集上，比较所提出的 CAD-Assistant 与 CAD 问答（CQA）基线。CAD-Assistant 的结果分别使用不同规划器报告。

**图内文字与标记**

- Method / Planner：方法／规划器；2D Acc / 3D Acc：二维／三维准确率。
- 表中上半部分为 SGPBench 基线，下半部分为 CAD-Assistant；各 GPT 模型名称保留原文。

::: details 对照英文原文

Table 3. Comparison for the proposed CAD-ASSISTANT to baselines for CQA on the 2D and 3D subsets of SGPBench [45]. For CAD-Assistant performance is reported for different planners.
:::

**图表解读**
<!-- /figure-translation -->

**来源**：原表 3，PDF 第 6 页。

GPT-4o 下，CAD-Assistant 2D/3D 准确率为 **0.791 / 0.857**，基线为 **0.686 / 0.782**。

工具框架在此设置中有帮助，但 GPT-4 mini 的增幅更小。规划器本身的能力仍然重要，不能认为“只要接工具，小模型就与大模型等效”。

### 自动约束与工具消融 {#_7-2-自动约束与工具消融}

<PaperFigure src="/papers/cad-assistant/table04_05_constraints.png" title="CAD-Assistant 原表 4–5：约束任务与工具消融" source="https://arxiv.org/abs/2412.13810" :page="7" />

<!-- figure-translation:/papers/cad-assistant/table04_05_constraints.png -->
**原文翻译（表注）**

表4：自动添加约束任务的评价。在 SketchGraphs[48]上使用 PF1 和 CF1 衡量性能。

表5：CAD 专用工具和提示策略对 CAD-Assistant 自动添加约束任务的影响。

**图内文字与标记**

- Method / Type：方法／类型；zero-shot / supervised：零样本／监督学习；PF1 / CF1：几何基元／约束的 F1 分数。
- CAD-Specific Tools / Prompting：CAD 专用工具／提示方式；MMrecog：多模态识别；ConstrCheck：约束检查。
- Demonstr：示例数；Docstr：文档字符串；0-shot / 5-shot：零个／五个示例；✓／✕表示使用／不使用。

::: details 对照英文原文

Table 4. Evaluation on the task of autoconstraining. Performance is measured in terms of PF1 and CF1 on the SketchGraphs [48].
Table 5. Impact of CAD-specific tools and prompting strategies for CAD-Assistant on the autoconstraining task.
:::

**图表解读**
<!-- /figure-translation -->

**来源**：原表 4和表 5，PDF 第 7 页；同一原文区域保留两张表及表注。

零样本 CAD-Assistant 的 **PF1 0.979、CF1 0.484**。这不是“97.9% 草图全部约束正确”；PF1 是基元指标，CF1 才检查约束对应。

消融中，仅识别工具而无约束检查时 PF1/CF1 为 **0.747 / 0.329**；加入约束检查为 **0.979 / 0.484**。五示例加工具说明时为 **0.984 / 0.529**。

这说明观察求解后的几何变化有价值。指标不是任意工程设计意图的完全判定。

### 手绘草图参数化 {#_7-3-手绘草图参数化}

<PaperFigure src="/papers/cad-assistant/table06_sketches.png" title="CAD-Assistant 原表 6：手绘参数化" source="https://arxiv.org/abs/2412.13810" :page="7" />

<!-- figure-translation:/papers/cad-assistant/table06_sketches.png -->
**原文翻译（表注）**

表6：手绘图像参数化任务的评价，与文献[21、49]中的任务专用模型进行比较。

**图内文字与标记**

- Method：方法；Acc：准确率；CD：倒角距离；↑越大越好，↓越小越好。

::: details 对照英文原文

Table 6. Evaluation on the task of hand-drawn image parametrization. Comparison against the task-specific models of [21, 49].
:::

**图表解读**
<!-- /figure-translation -->

**来源**：原表 6，PDF 第 7 页。

本方法准确率 **0.784**，略低于 Davinci 的 **0.789**；CD **0.680**，低于 Davinci **1.184**。因此应描述“几何距离改善、参数准确率相近”，不能写成两项均最优。

## 失败分析与扩展能力的范围 {#_8-失败分析与扩展能力的范围}

<PaperFigure src="/papers/cad-assistant/figure04_failures.png" title="CAD-Assistant 原图 4：问答失败类型" source="https://arxiv.org/abs/2412.13810" :page="7" />

<!-- figure-translation:/papers/cad-assistant/figure04_failures.png -->
**原文翻译（图注）**

图4：CAD 问答任务中错误回答的失败类型分类。

**图内文字与标记**

- Error Classification of Misclassified CQA Trajectories：回答错误的 CAD 问答轨迹的错误分类。
- Incorrect Reasoning：推理错误；Image Interpretation：图像理解；JSON Interpretation：JSON 理解；Incorrect Coding Logic：代码逻辑错误。
- # of Cases：案例数量。

::: details 对照英文原文

Figure 4. Classification of failure case types for erroneous responses in the CAD Question Answering task.
:::

**图表解读**
<!-- /figure-translation -->

**来源**：原图 4，PDF 第 7 页。

作者对 **100 条错误问答轨迹**分类，多数来自推理错误和图像误解。工具使用也可能正确而答案错误。

另外，两名人工标注者检查 **200 条**约束/参数化轨迹，报告工具使用有效率 **98.5%**。**这是工具调用有效率，不是任务成功率。**

原图 5与补充示例展示旋转、圆角和扫描截面等，说明接口可扩展。但这些示例没有提供相同规模的完整三维工业建模基准。

**分析**：

- 规划器停止不保证目标满足。
- 执行日志能发现 API 错误，却未必检测尺寸或语义错误。
- 观察工具的质量会限制模型判断。
- 长轨迹、API 开销和状态管理是复现时必须测量的因素。

补充 §10 提及更强规划和验证作为未来工作，不应将所有验证问题写成已解决。

## 相关研究 {#_9-放回方向地图-与修复模型和测试路线连接}

- **执行反馈**：利用执行反馈更新后续操作。
- **设计约束**：约束生成和 CAD 求解器参与设计状态调整。
- **编辑与交互**：用户请求、工具操作与状态反馈形成交互。

与 CADReview：本篇利用通用规划器和外部工具；CADReview 学习特定反馈及程序修正任务。
与 CAD-Recode：一个主要生成点云对应代码，一个在 FreeCAD 状态中多轮执行多任务。
与 CADTests：执行成功之后，还需要独立检查输出是否满足设计要求。

## 思考与自测 {#_10-阅读自测与阅读卡}

1. 免训练是否意味着没有已训练模块或没有成本？
2. 一轮闭环有哪些步骤？
3. TERMINATE 是否是任务正确性证明？
4. PF1=0.979 是否等于所有约束 97.9% 正确？
5. 为什么约束评价要经过 solver？
6. 工具使用有效率 98.5% 是否等于任务成功率？
7. 表 11 的成本是否是现在的价格？

<details>
<summary>参考答案：完成自测后展开</summary>

1. 不是，仍有预训练规划器/专用模块，以及推理和 API 成本。
2. 计划、动作、环境执行、状态反馈、更新上下文。
3. 不是，仍需独立评价。
4. 不是，它是基元 F1，约束 F1 另行计算。
5. 约束会改变几何，需要检查实际求解结果。
6. 不等于，调用合法也可能规划或判断错误。
7. 不是，只记录论文实验时期的成本。

</details>

## 参考文献 {#_11-来源与核查记录}

- [原论文 PDF](https://arxiv.org/pdf/2412.13810)

图表引自原论文，图号与 PDF 页码见各图说明。

<!-- cad-v2-relations -->
::: details 研究树关联：发展关系、资源与问题

[CAD理解、评估与规划](/cad/tasks/analysis) · [发展关系](/cad/relationships)
:::
<!-- /cad-v2-relations -->
