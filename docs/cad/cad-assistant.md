---
id: cad-0109
title: CAD-Assistant：让视觉语言模型调用 CAD 工具完成任务
navTitle: CAD-Assistant
outline:
  - 2
  - 2
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
updated: '2026-10-22'
---
# CAD-Assistant：让视觉语言模型调用 CAD 工具完成任务

<!-- cad-v2-context -->
> **研究任务 · CAD理解、评估与规划** · [研究总览](/cad/) · [九篇详读](/cad/reading-navigation?reading=1)
<!-- /cad-v2-context -->

视觉语言模型可以看懂“把手绘草图转成带约束的 CAD”这句话，却不等于能正确建立几何、添加约束并处理求解后的变化。这里缺少的不只是答案知识，还有操作软件和观察真实状态的能力。

**CAD-Assistant 用工具交互补上这条链路：计划—执行—观察—再调整。** 规划器生成 [Python 动作](#primer-tool-agent)，FreeCAD 与专用工具返回几何、日志或渲染信息，模型据此决定下一步。论文不重新[微调](#primer-inference-context)规划器，但任务表现仍依赖预训练模块、工具质量和交互预算。

## 阅读前需要了解的技术 {#technical-primer}

本文的能力主要来自预训练模型与工具的协作。先理解状态怎样传递、几何怎样求解，就能分清工具调用、任务完成和模型训练。

### 工具代理：模型提出动作，外部程序真正执行 {#primer-tool-agent}

模型读任务、工具说明和已有结果，生成计划及 Python 动作；解释器与 CAD 软件执行动作，再返回日志、数据或图像。一次请求中连续发生的这些步骤组成交互轨迹。模型生成“调用某工具”的文字只是决策，执行器需要实际运行它并保留 CAD 状态。

### 多模态观察：把软件状态重新提供给模型 {#primer-multimodal-observation}

视觉语言模型可以接收图像和文字，观察工具则把当前 CAD 渲染图、参数或结构化数据返回给它。本文利用这些已有接口，帮助规划器判断下一步。它与训练 CAD-MLLM 的多模态投影、LoRA 是不同层次的工作：在一次工具交互中看到新图像，不代表模型正在更新权重学习对齐。

### 几何约束求解器：关系交给数值系统落实 {#primer-constraint-solver}

草图约束规定平行、相等、相切或距离等关系。求解器输入几何参数和约束，尝试找到满足它们的参数值，因而可能改变当前形状；矛盾或不足的约束也会影响结果。模型负责选择和添加关系，求解器负责求解，检查工具再报告变化。约束语句能执行，不保证求解后的形状就是用户想要的。

### 推理上下文与微调：当次利用结果，与长期改变参数 {#primer-inference-context}

推理把说明、示例与工具返回放入当前上下文，让固定模型据此输出；微调则需要训练样本、损失计算与参数更新。本文不为这些 CAD 任务重新微调规划器，但仍依赖已有预训练模块。上下文反复传入会产生 token 与工具执行成本，因此免训练不等于推理没有成本。

**理解示例**：把手绘草图变成 CAD 后，规划器添加平行约束，求解器调整线段位置，检查工具返回变化，规划器再决定是否继续。模型自己宣布结束，只是停止信号，任务正确性仍需单独检查。

概念参考：[ReAct 原论文中的推理—行动交互](https://arxiv.org/abs/2210.03629)；本文工具、求解器与观察方式见 [CAD-Assistant §3–4](https://arxiv.org/abs/2412.13810)。

配套实践：[区分参数训练与执行结果检查](/basics/practice/evaluation)。

## 让模型行动之前，先让它能够观察实际 CAD 状态 {#_4-框架与工具集}

<PaperFigure src="/papers/cad-assistant/figure02_loop.png" title="CAD-Assistant 原图 2：闭环框架" source="https://arxiv.org/abs/2412.13810" :page="4" />

<!-- figure-translation:/papers/cad-assistant/figure02_loop.png -->
**原文翻译（图注）**

图2：CAD-Assistant 框架概览。将多模态用户请求作为上下文提供给 VLLM 规划器 P。在时间步 t，规划器生成计划 pt 与动作 at（Python 代码）。动作在环境 E 中执行，产生的执行输出 ft 被反馈给规划器，用于生成下一个时间步的内容。

**关键标记**

Planner／ToolSet／Environment：规划器／工具集／环境；Plan／Action：自然语言计划／Python 动作。

::: details 对照英文原文

Figure 2. Overview of CAD-Assistant framework. A multimodal user request is provided as context to a VLLM planner P. At step t, the planner generates a plan pt and an action at (python code). The action is executed on an environment E and the generated execution output ft is fed back to the planner, enabling generation for the next timestep.
:::

**图表解读**
<!-- /figure-translation -->

图 2 以手绘草图参数化展示交互：模型先读请求和接口说明，计划提取几何，再生成 Python 调用；环境执行并更新 FreeCAD 状态，返回结果成为下一轮上下文。模型不必一次猜完所有操作，而可以根据实际反馈继续处理。（原文 §3.1。）

但闭环里的“观察”必须有内容。若只有报错日志，系统可能知道某个 API 调用失败，却不知道几何是否符合要求；若能读取参数、看到标注渲染或检查约束，就有了更具体的判断依据。

<PaperFigure src="/papers/cad-assistant/table01_tools.png" title="CAD-Assistant 原表 1：工具集" source="https://arxiv.org/abs/2412.13810" :page="5" />

<!-- figure-translation:/papers/cad-assistant/table01_tools.png -->
**原文翻译（表注）**

表1：CAD 专用工具概览。

**关键标记**

Constraint Checker：约束检查工具；Crosssection Extract：截面提取工具。

::: details 对照英文原文

Table 1. Overview of CAD-specific tools.
:::

**图表解读**
<!-- /figure-translation -->

表 1 因而不只是工具清单：FreeCAD 执行几何操作，草图/实体识别工具把状态变成可读信息，约束检查观察求解影响，截面工具提供另一种几何观察。手绘参数化还调用已有专用方法，所以“免训练框架”并不意味着所有组件都没有经过训练。（§3。）

## 反馈怎样表达，决定模型能否利用它 {#_5-为什么表示和工具调用会影响结果}

同一条线可以用端点坐标表示，也可以用方向和距离表示；相同几何还可以序列化为 JSON 或其他格式。它们包含的信息与推理难度未必相同。论文先比较这些输入表达，作为后续工具接口设计的依据。

在表 2 的 GPT-4o 设置中，点式 JSON 为 **0.748**，原 SGPBench 格式为 **0.674**；精确草图渲染为 **0.754**，手绘图为 **0.616**。（§4.1。）这些结果说明模型表现依赖观察方式，但不能外推为 JSON 在所有任务上最优。

沿着手绘例子继续看，参数化工具先把视觉输入变成 CAD 几何，识别工具再让模型观察当前参数，约束检查提供求解后的变化。生成动作与解释反馈交替发生，才构成论文的系统能力。

## 最关键的消融：加入约束检查，是否真的改变结果 {#_7-2-自动约束与工具消融}

添加约束不是把一行关系写进文件就算成功。[CAD 求解器](#primer-constraint-solver)可能调整几何，最终形状及约束都需要评价。因此，约束检查比仅确认代码运行多了一层任务信息。

<PaperFigure src="/papers/cad-assistant/table04_05_constraints.png" title="CAD-Assistant 原表 4–5：约束任务与工具消融" source="https://arxiv.org/abs/2412.13810" :page="7" />

<!-- figure-translation:/papers/cad-assistant/table04_05_constraints.png -->
**原文翻译（表注）**

表4：自动添加约束任务的评价。在 SketchGraphs[48]上使用 PF1 和 CF1 衡量性能。

表5：CAD 专用工具和提示策略对 CAD-Assistant 自动添加约束任务的影响。

**关键标记**

PF1／CF1：几何基元／约束的 F1 分数；ConstrCheck：约束检查。

::: details 对照英文原文

Table 4. Evaluation on the task of autoconstraining. Performance is measured in terms of PF1 and CF1 on the SketchGraphs [48].
Table 5. Impact of CAD-specific tools and prompting strategies for CAD-Assistant on the autoconstraining task.
:::

**图表解读**
<!-- /figure-translation -->

表 4–5 中，仅用识别工具、没有约束检查时，PF1/CF1 为 **0.747 / 0.329**；加入检查后为 **0.979 / 0.484**。五个示例加工具说明的设置为 **0.984 / 0.529**。这为“让规划器观察求解结果”提供了直接证据。（§4.2。）

同时，PF1 很高而 CF1 仍明显较低，表明恢复几何基元与恢复正确约束并非同一难度。**PF1 0.979 不是 97.9% 的草图全部约束正确。** 两项指标在应用 CAD 求解器后计算，不能只检查模型给出的约束文本。

:::: details 约束任务的测试与匹配条件

自动约束使用 SketchGraphs 中约 **700 个草图**，手绘参数化采用相同测试分段。PF1 要求基元类型和参数匹配，CF1 还要求相关基元正确。论文为与基线比较而量化结果，不代表代理使用相同离散 token 预测格式。（§4.2。）

::::

## 工具帮助了哪些任务，哪些指标仍然没有领先 {#_7-结果与消融怎么读}

<PaperFigure src="/papers/cad-assistant/table03_qa.png" title="CAD-Assistant 原表 3：问答结果" source="https://arxiv.org/abs/2412.13810" :page="6" />

<!-- figure-translation:/papers/cad-assistant/table03_qa.png -->
**原文翻译（表注）**

表3：在 SGPBench[45]的二维和三维子集上，比较所提出的 CAD-Assistant 与 CAD 问答（CQA）基线。CAD-Assistant 的结果分别使用不同规划器报告。

**关键标记**

2D Acc／3D Acc：二维／三维准确率。

::: details 对照英文原文

Table 3. Comparison for the proposed CAD-ASSISTANT to baselines for CQA on the 2D and 3D subsets of SGPBench [45]. For CAD-Assistant performance is reported for different planners.
:::

**图表解读**
<!-- /figure-translation -->

问答任务中，GPT-4o 下 CAD-Assistant 的 2D/3D 准确率为 **0.791 / 0.857**，基线为 **0.686 / 0.782**。外部几何操作与观察在这个设置中有帮助，但 GPT-4 mini 的增益较小，规划器自身能力仍然重要。（§4.1，表 3。）

这里模型通过 FreeCAD 理解预载对象，不是每种对比方法都接收完全相同的信息。结果应理解为完整系统设置的比较，不能把全部收益归结为一条提示。

<PaperFigure src="/papers/cad-assistant/table06_sketches.png" title="CAD-Assistant 原表 6：手绘参数化" source="https://arxiv.org/abs/2412.13810" :page="7" />

<!-- figure-translation:/papers/cad-assistant/table06_sketches.png -->
**原文翻译（表注）**

表6：手绘图像参数化任务的评价，与文献[21、49]中的任务专用模型进行比较。

**关键标记**

Acc：准确率；CD：倒角距离。

::: details 对照英文原文

Table 6. Evaluation on the task of hand-drawn image parametrization. Comparison against the task-specific models of [21, 49].
:::

**图表解读**
<!-- /figure-translation -->

手绘草图参数化中，本方法参数准确率 **0.784**，略低于 Davinci 的 **0.789**；图像空间 CD 为 **0.680**，低于 **1.184**。它说明最终几何距离改善，但参数准确率没有同时领先。这个二维图像指标也不能与其他论文的三维点云 CD 直接比较。（§4，表 6。）

这些任务各有输出和成功条件：问答返回答案，约束任务修改草图，参数化任务恢复可用几何。它们不应合成一个“完整工业 CAD 生成成功率”。

## 交互闭环既引入计算能力，也引入推理成本 {#_6-实验任务、指标与推理成本}

工具框架不需要重新训练规划器，不等于推理免费。模型反复读取历史、图像和工具结果，轮数增加还会累积调用与执行成本。

:::: details 论文记录的请求成本

<PaperFigure src="/papers/cad-assistant/table11_cost.png" title="CAD-Assistant 原表 11：API 请求成本" source="https://arxiv.org/abs/2412.13810" :page="15" />

<!-- figure-translation:/papers/cad-assistant/table11_cost.png -->
**原文翻译（表注）**

表11：使用 GPT-4o 作为 VLLM 规划器时，CAD-Assistant 每个用户请求的成本。

**关键标记**

Avg Cost per User Request：每个用户请求的平均成本，金额单位为美元。

::: details 对照英文原文

Table 11. Cost per user request for the CAD-Assistant utilizing GPT-4o as VLLM planner.
:::

**图表解读**
<!-- /figure-translation -->

表 11 使用 GPT-4o 规划器。CAD 问答平均 **11280 输入 / 178 输出 tokens，$0.0299**；自动约束 **28422 / 852，$0.0795**；手绘参数化 **31170 / 1081，$0.0887**。这是论文实验时记录的历史成本，不是当前 API 报价，也没有替代对本地工具耗时的测量。（补充材料表 11。）

::::

## 模型决定结束，并不等于任务已经完成 {#_8-失败分析与扩展能力的范围}

<PaperFigure src="/papers/cad-assistant/figure04_failures.png" title="CAD-Assistant 原图 4：问答失败类型" source="https://arxiv.org/abs/2412.13810" :page="7" />

<!-- figure-translation:/papers/cad-assistant/figure04_failures.png -->
**原文翻译（图注）**

图4：CAD 问答任务中错误回答的失败类型分类。

**关键标记**

Incorrect Reasoning／Image Interpretation：推理错误／图像理解；Incorrect Coding Logic：代码逻辑错误。

::: details 对照英文原文

Figure 4. Classification of failure case types for erroneous responses in the CAD Question Answering task.
:::

**图表解读**
<!-- /figure-translation -->

图 4 对 **100 条错误问答轨迹**分类，主要错误来源包含推理错误与图像误解。即使工具成功执行，规划器仍可能误读结果或给出错误答案。（§4。）

另有两名标注者检查 **200 条约束/参数化轨迹**，报告工具使用有效率 **98.5%**。它只表明调用是否有效，不能当作任务成功率。同理，模型生成 TERMINATE 是停止判断，而不是独立的正确性证明。

作者还展示了旋转、圆角和扫描截面等扩展案例，说明工具接口有扩展空间，却没有提供同等规模的完整工业建模基准。观察质量、长轨迹管理和目标验证仍然限制系统。（原文及补充 §10。）

回到手绘草图请求，CAD-Assistant 的推进在于把语言模型放进真正的 CAD 操作环境，并让执行结果参与下一步决策。要继续改进它，除了问“会不会调用工具”，还要独立检查“生成的几何与约束是否符合请求”。[CADTests](/cad/cadtests) 的要求测试与这里的工具反馈可以对照阅读；[CAD-Editor](/cad/cad-editor) 则提供了另一种学习局部修改的路线。

[原论文 PDF：CAD-Assistant，2412.13810v3](https://arxiv.org/pdf/2412.13810) · [作者代码](https://github.com/dimitrismallis/CAD-Assistant)。图表出处及 PDF 页码见各图说明。

:::: details 论文信息与版本

<span id="_1-论文信息与方向定位"></span>

- **全名**：CAD-Assistant: Tool-Augmented VLLMs as Generic CAD Task Solvers。
- **作者**：Dimitrios Mallis、Ahmet Serda Karadeniz、Sebastian Cavada 等。
- **出处与版本**：2024 年预印本、ICCV 2025；所用版本为 arXiv **2412.13810v3，2025-08-26**，共 28 页。
- **来源**：[arXiv](https://arxiv.org/abs/2412.13810)、[出版 DOI](https://doi.org/10.1109/ICCV51701.2025.00684)、[作者代码链接](https://github.com/dimitrismallis/CAD-Assistant)。

::::

<!-- Published section anchors retained for incoming links. -->
<span id="_3-输入、输出与必要术语"></span>
<span id="_7-1-cad-问答"></span>
<span id="_7-3-手绘草图参数化"></span>
<span id="_9-放回方向地图-与修复模型和测试路线连接"></span>
<span id="_10-阅读自测与阅读卡"></span>
<span id="_11-来源与核查记录"></span>

<!-- cad-v2-relations -->
::: details 研究树关联：发展关系、资源与问题

[CAD理解、评估与规划](/cad/tasks/analysis) · [发展关系](/cad/relationships)
:::
<!-- /cad-v2-relations -->
