---
id: cad-0107
title: CADTests：用可执行几何测试检查文本要求是否满足
navTitle: CADTests
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
  - cad-0109
  - cad-0106
order: 26
sources:
  - sources/论文/先读/CADTests.md
  - 'https://arxiv.org/abs/2605.07807'
status: draft
reviewed: false
created: '2026-10-07'
updated: '2026-10-23'
---
# CADTests：用可执行几何测试检查文本要求是否满足

<!-- cad-v2-context -->
> **研究任务 · CAD理解、评估与规划** · [研究总览](/cad/) · [九篇详读](/cad/reading-navigation?reading=1)
<!-- /cad-v2-context -->

文本要求一个贯通孔，生成结果却留下一层很薄的底壁。整体形状可能几乎没变，几何距离也很小，但这个孔已经不能完成预期功能。

**CADTests 从这类差别出发，把评价目标从“像不像参考”转向“是否满足明确要求”。** 它让语言模型编写在 B-rep 上执行的[属性测试](#primer-property-testing)，再用正确模型与故意错误的变体检验测试。主线里最关键的转折是：生成器需要评价，评价器本身也需要评价。

## 阅读前需要了解的技术 {#technical-primer}

本文借用了软件测试的思路，但检查对象是执行后的 CAD 实体。这里的“学习改进”主要发生在模型调用与测试迭代中，不是训练一个新的 CAD 生成网络。

### B-rep 属性测试：查询实体，而不是只检查代码文字 {#primer-property-testing}

B-rep 用面、边、顶点及其连接关系描述实体，CAD 接口还能查询体积、包围盒等属性。属性测试把要求写成能返回通过或失败的程序，例如检查孔数或空间位置。输入是待测实体，输出是判定；生成器采用哪条建模历史不必唯一，但查询方式和容差必须合理。

### 变异测试：用故意错误来检验测试够不够强 {#primer-mutation-testing}

mutant 是故意改错一个要求的程序及其实体。例如将通孔改成盲孔，再看现有测试能否发现。测试成功拒绝这个错误，称为“杀死变体”。变异分数统计所构造变体被检出的比例，衡量的是这组错误上的辨别力，不是对所有未来错误的检测保证。

### 健全性与覆盖：既要放过正确，也要挡住错误 {#primer-test-soundness}

可运行测试不一定写对，能让一个参考通过也不一定够强。本文用正确参考及允许变换组成 passing set，用错误变体组成 mutation set，分别观察误拒与漏检。这里的 soundness 是针对已知正确集合的检查，不等于已经证明测试对所有合理设计都正确。

### 执行反馈迭代：修改测试文本，不是更新模型权重 {#primer-execution-refinement}

规划器根据要求和接口说明生成测试，工具执行后返回哪些正确模型被误拒、哪些变体未发现，规划器再增删或改写测试。改变的是测试代码与后续上下文；这一步不应称为大模型微调。生成器也可以读取未通过测试的日志继续修改 CAD，但反馈测试与最终独立评价需要区分。

**理解示例**：要求“中心孔贯穿”，只检测圆柱面可能放过盲孔。构造一个盲孔变体后，测试遗漏就显现出来；据此增加有关贯穿性质的检查。这是逻辑示意，具体实现必须使用真实 CAD API 与容差。

技术定义与本文用法见 [CADTests §3–5](https://arxiv.org/abs/2605.07807)，实现接口见 [CADTestBench 作者代码](https://github.com/dimitrismallis/CADTestBench)。

配套实践：[属性测试与变异测试](/basics/practice/feedback#property-tests) · [全部技术地图](/basics/practice/paper-map)。

## 一个很像的错误答案，为什么可能得到好分数 {#_3-为什么-cd-和-iou-不够}

<PaperFigure src="/papers/cadtests/figure01_motivation.png" title="CADTests 原图 1：相似与符合要求的差别" source="https://arxiv.org/abs/2605.07807" :page="2" />

<!-- figure-translation:/papers/cadtests/figure01_motivation.png -->
**原文翻译（图注）**

图1：CADTESTS 是直接在生成几何上验证提示规格的可执行程序。它们能够处理含糊的设计提示（左），并识别细微的结构错误（右）。为便于展示，图中省略了 CADTESTS 的实现。

**关键标记**

Chamfer Distance：倒角距离；Passed All Tests：全部测试通过。

::: details 对照英文原文

Figure 1: CADTESTS are executable programs that verify prompt specifications directly on the generated geometry. CADTESTS can account for ambiguous design prompts (left) and identify subtle structural errors (right). The figure ommits CADTEST implementations for clarity.
:::

**图表解读**
<!-- /figure-translation -->

图 1 展示两种情况：与参考差异较大的模型可能满足全部明确要求；与参考很接近的模型，却可能因为槽没有切穿而失败。CD/IoU 比较的是与一个参考的几何关系，而抽象文字往往容许多个合理实现。（原文图 1。）

因此本文区分三个目标：程序能否执行成实体、实体与参考是否接近、实体是否满足要求。只报告其中一个，会遗漏另外两种错误。CADTests 尝试直接检查数量、比例、穿孔和空间关系；CADTestBench 则是据此构建的基准，二者名称不应混用。

## 将要求写成检查，比规定唯一建模程序更宽松 {#_4-测试具体检查什么}

模型执行成 B-rep 后，可以查询面、边、实体数量、体积和包围盒等属性，再编写返回通过或失败的 Python 测试。只要采用的程序能生成满足条件的实体，就不必与某条参考操作历史完全相同。（§3–4。）

对开头的贯通孔，测试不能只确认“有圆柱面”，还需要涉及孔的位置与贯穿性质。这是解释测试逻辑的例子，并非论文原代码。具体 API、几何容差与查询方式会影响判定。

更宽松也不等于自动正确：某个面数限制可能把另一种合法拓扑拆分误判为错误；一个只检查圆柱面的弱测试，又可能放过没有贯穿的孔。于是，**怎样知道生成的测试既不过严、也不过松**，成为下一步的核心。

## 用两类反例检查测试，而不是直接相信测试文字 {#_5-方法-如何用故意错误改进测试}

<PaperFigure src="/papers/cadtests/figure02_pipeline.png" title="CADTests 原图 2：测试合成与迭代改进" source="https://arxiv.org/abs/2605.07807" :page="5" />

<!-- figure-translation:/papers/cadtests/figure02_pipeline.png -->
**原文翻译（图注）**

图2：所提出的 CADTest 合成流水线。上部将设计提示与参考 CAD 程序提供给 LLM 规划器，以生成 CAD 变异体；下部由规划器生成测试套件，并根据正确样本集合与变异集合上的执行反馈迭代改进。本例中，第1轮未被检出的变异，在第 N 轮加入比较内外圆柱面“体积”的测试后被检出。

**关键标记**

Mutation Generation：变异生成；Passing Set／Mutation Set：正确样本集合／变异集合。

**译注**：原图注使用 volumes（体积），图内新增测试文字使用 face area（面面积）；译文按原图分别保留，二者不能混作同一几何量。

::: details 对照英文原文

Figure 2: Illustration of the proposed CADTest synthesis pipeline. (Top) A design prompt and reference CAD program are provided to an LLM planner to generate CAD mutants. (Bottom) The planner generates a test suite that is iteratively refined using execution feedback from the passing and mutation sets. In this example, a mutation that is not killed in R = 1 is detected in R = N after adding a test comparing the volumes of the inner and outer cylindrical faces.
:::

**图表解读**
<!-- /figure-translation -->

图 2 把实体分成两组。一组是参考模型及保持要求的变换版本，应当通过；另一组是故意违反要求的 mutant 及其变换版本，应被测试发现。测试错拒正确模型，说明可能过严；放过错误变体，说明可能过弱。执行反馈据此驱动测试增加、删除或改写，最多进行 **4 轮**。（§4。）

流水线中各模块看到的信息不同：错误变体生成器可以读文本与参考程序；初始测试[规划器](#primer-execution-refinement)主要读文本和 CAD API 说明，不直接把参考程序作为答案。整个构建过程仍通过参考与变体的执行反馈获得监督，不能因此称为无参考评测器构建。

变换增强也需要受文本约束。例如详细提示规定绝对尺寸时不做缩放增强。平移、旋转能否保留要求，同样取决于文本是否固定位置和方向。最终过滤仍无法让参考通过的测试，改善的是这组已知样本上的[健全性](#primer-test-soundness)，不是对所有合理设计的形式化证明。

## 第一项证据：测试能够运行，还远远不够 {#_7-1-初始测试质量}

<PaperFigure src="/papers/cadtests/table01_test_generation.png" title="CADTests 原表 1：测试生成能力" source="https://arxiv.org/abs/2605.07807" :page="6" />

<!-- figure-translation:/papers/cadtests/table01_test_generation.png -->
**原文翻译（表注）**

表1：针对抽象提示，以有效性、健全性和变异分数评价 CADTESTS 的生成性能。比较不同 LLM 规划器，以及两种提示策略：在上下文中提供20个 CAD 测试示例，或提供说明测试编写方式的技能文件。表中同时给出百分比和总计数。

**关键标记**

Valid：有效测试比例；Sound：健全测试比例；MScore：变异分数。

::: details 对照英文原文

Table 1: CADTESTS generation performance for abstract prompts in terms of validity, soundness, and mutation score. We evaluate various LLM planners and compare two prompting strategies: providing the planner with 20 CAD test demonstrations in its context, or supplying a skill file that disambiguated how tests should be written. The table presents both percentages and total counts.
:::

**图表解读**
<!-- /figure-translation -->

表 1 的抽象提示设置中，Claude-4.6-Sonnet 初始测试 **Valid 97.8%**、**Sound 90.6%**，但[变异分数](#primer-mutation-testing)仅 **63.0%**。也就是说，多数测试能运行且参考可通过，仍遗漏不少故意错误。三项指标分别检查执行、误拒和检出能力，不能互相替代。（§5，表 1。）

<PaperFigure src="/papers/cadtests/table02_refinement.png" title="CADTests 原表 2：反馈迭代改进" source="https://arxiv.org/abs/2605.07807" :page="7" />

<!-- figure-translation:/papers/cadtests/table02_refinement.png -->
**原文翻译（表注）**

表2：迭代改进闭环的有效性。分别对参考实现、CAD 变异体及其增强版本报告分数。

**关键标记**

SoundAugm／MScoreAugm：增强版本的健全性／变异分数。

::: details 对照英文原文

Table 2: Effectiveness of the refinement loop. Scores are reported for the reference implementation, CAD mutants, as well as their augmented variants.
:::

**图表解读**
<!-- /figure-translation -->

迭代后的表 2 中，详细/抽象提示的变异分数为 **0.91 / 0.93**。这支持执行反馈改善了针对所构造错误的辨别力，却不能解读为所有真实自然错误都有 91%/93% 的检测率。（§5，表 2。）

:::: details 基准来源与统计口径

CADTestBench 基于 CADPrompt 的 **200 个 CAD 程序**，分别提供抽象与详细提示，共 **400 个提示条件**。§5 报告 **5,937 个测试**，平均每个提示约 15 个；表 2 的改进实验数量为 **3,091 / 2,989**。两处统计口径不同，复现需核对发布清单与过滤步骤，不应强行合并。

本版本 mutant 生成使用 GPT-4.1，基准测试生成使用 Claude-Sonnet-4.6。它们是论文实验记录，不是当前模型推荐。资源包括模型调用和 CAD 执行，并非从头训练大型生成网络。

::::

## 第二项证据：检验实体要求，会改变对生成质量的判断 {#_7-3-用测试评测-cad-生成}

<PaperFigure src="/papers/cadtests/table03_generation.png" title="CADTests 原表 3：文本到 CAD 基准" source="https://arxiv.org/abs/2605.07807" :page="7" />

<!-- figure-translation:/papers/cadtests/table03_generation.png -->
**原文翻译（表注）**

表3：在 CADTESTBENCH 上评价文本到 CAD 方法，分别报告抽象与详细两个子集的结果。文本到 CAD 基线使用不同的 LLM 规划器，以通过率、要求得分和无效比例衡量性能。

**关键标记**

IR：无效比例；RS：要求得分；PR：通过率。

::: details 对照英文原文

Table 3: Evaluation of Text-to-CAD methods on CADTESTBENCH. Results are reported for both the abstract and detailed partitions. Text-to-CAD baselines are evaluated using different LLM planners. Performance is measured in terms of pass rate, requirement score, and invalidity rate.
:::

**图表解读**
<!-- /figure-translation -->

表 3 中，Text2CAD 在详细/抽象提示上的程序执行错误率 IR 只有 **0.005 / 0.015**，但全部测试通过率 PR 为 **0.025 / 0.085**。可执行结果很多，满足全部已测要求的结果却很少。这将开头的薄底壁问题从示例推进到了基准测量。（§5–6，表 3。）

测试还能作为生成时反馈。Claude-4.6-Sonnet 的 ReAct 详细/抽象 PR 为 **0.580 / 0.715**，CADTests+Log 为 **0.625 / 0.810**。但 GPT-5.2 的抽象设置中，加 Log 后为 **0.700**，低于 CADTests 的 **0.720**。反馈的作用依赖规划器和配置，并非增加日志就一定提高质量。

:::: details PR、RS 与无效输出

**PR** 要求一个结果通过全部测试。**RS** 按每条要求的测试组是否全部通过计分，再计算满足要求的比例。部分要求正确可以提高 RS，但 PR 仍可能为零。无效输出按失败计入，而非只在有效实体子集评价。IR 表示程序执行错误率，不应和所有几何/语义错误混为一谈。

这里的基准与 Text2CAD 原训练评测集分布不同；比较还涉及规划器与反馈预算，不能将差距全部归因于某一个模型结构。

::::

## 最后仍要回到人类判断，以及测试没有覆盖的部分 {#_7-4-与人工判断是否一致}

<PaperFigure src="/papers/cadtests/table04_human.png" title="CADTests 原表 4：人工一致性" source="https://arxiv.org/abs/2605.07807" :page="9" />

<!-- figure-translation:/papers/cadtests/table04_human.png -->
**原文翻译（表注）**

表4：与人工共识标注的一致性，Cohen 的 κ=0.54。左侧比较 CADTESTS 与文献[38]中基于 LLM 的指标在通过率判定上的一致性；右侧以二元人工标签为依据，报告连续评分指标的 AUC。

**关键标记**

Precision／Recall：精确率／召回率；AUC：曲线下面积。

::: details 对照英文原文

Table 4: Agreement with human consensus annotations (Cohen’s κ=0.54). Left: Pass-rate agreement for CADTESTS and the LLM-based metric of [38]. Right: AUC for continuous score metrics against the binary human label.
:::

**图表解读**
<!-- /figure-translation -->

表 4 在 **125 个随机生成结果、两名专家标注者**上比较：CADTests 与人工共识的准确率为 **0.938**，RS 的 AUC 为 **0.928**。它为评价与人类判断的关联提供证据。但两名标注者自身 Cohen’s κ 为 **0.54**，任务本身存在明显歧义，不能把共识当成完全无歧义的绝对真值。（§6，表 4。）

<PaperFigure src="/papers/cadtests/figure04_examples.png" title="CADTests 原图 4：测试通过与失败案例" source="https://arxiv.org/abs/2605.07807" :page="9" />

<!-- figure-translation:/papers/cadtests/figure04_examples.png -->
**原文翻译（图注）**

图4：由 CADTest-Claude 基线生成、并使用 CADTESTS 评价的示例。绿色表示测试通过，红色表示测试失败。为便于阅读，图中仅展示部分测试描述，省略完整测试实现。

**关键标记**

Failure：测试未通过的原因；左图星尖角间距近似均匀，右图圆柱面数量与要求不符。

::: details 对照英文原文

Figure 4: Example generations from the CADTest-Claude baseline evaluated via CADTESTS. Green indicates passed tests and red indicates failed tests. For clarity, only a subset of test descriptions is shown and full test implementations are omitted.
:::

**图表解读**
<!-- /figure-translation -->

图 4 给出星形、桌子和带孔模型的通过/失败示例。实体测试能指出星尖角间距或圆柱面数量不符，比一个几何距离更接近具体要求；但若测试把某种实现的面数写得过死，也可能拒绝其他合理构造。（§7；后者为对测试设计的分析。）

本文的终点不是“测试已保证正确”，而是 **把要求变成可执行检查，并使检查接受反例检验**。正确集合和 mutant 都有限，通过所有测试只意味着当前检查未发现错误。若把测试反复用于调参或生成反馈，最终还需要独立留出的评价，避免把适应测试当成真正泛化。

与 [CADReview](/cad/cadreview) 对照，前者依靠参考图诊断程序哪里错，CADTests 依据文字约束检查实体哪里不满足要求；与 [CAD-Assistant](/cad/cad-assistant) 对照，又可以区分工具执行反馈与独立任务判定。三种反馈的依据不能相互替换。

[原论文 PDF：CADTests，2605.07807v1](https://arxiv.org/pdf/2605.07807) · [CADTestBench 代码](https://github.com/dimitrismallis/CADTestBench)。图表页码见各图说明。

:::: details 论文信息与版本

<span id="_1-论文信息与方向定位"></span>

- **全名**：Text-to-CAD Evaluation with CADTESTS。
- **作者**：Dimitrios Mallis、Marco Wang、Ahmet Serdar Karadeniz 等。
- **年份与版本**：2026 年预印本；所用版本为 arXiv **2605.07807v1，2026-05-08**，共 21 页。没有据此声称已被某个会议录用。
- **来源**：[arXiv](https://arxiv.org/abs/2605.07807)、[作者代码](https://github.com/dimitrismallis/CADTestBench)、[数据链接](https://huggingface.co/datasets/dimitrismallis/CADTestBench)。
- **名字消歧**：**CADTests** 是测试方法；**CADTestBench** 是构建的基准。它们不等于矩阵中的 CADBench 或 BenchCAD。

::::

<!-- Published section anchors retained for incoming links. -->
<span id="_5-1-生成错误变体"></span>
<span id="_5-2-初始测试"></span>
<span id="_5-3-两组实体与反馈"></span>
<span id="_5-4-停止与筛选"></span>
<span id="_6-数据与指标-两种-通过率-不要混淆"></span>
<span id="_6-1-测试生成质量"></span>
<span id="_6-2-cad-生成质量"></span>
<span id="_7-实验-先看测试本身-再看生成器"></span>
<span id="_7-2-迭代改进的效果"></span>
<span id="_8-局限与测试误判"></span>
<span id="_9-放回方向地图-并回看前面的指标"></span>
<span id="_10-阅读自测与阅读卡"></span>
<span id="_11-来源与核查记录"></span>

<!-- cad-v2-relations -->
::: details 研究树关联：发展关系、资源与问题

### R13 · 相关基础

[CADCodeVerify](/cad/papers/alr24) → [CADTests](/cad/cadtests)

CADTestBench基于CADPrompt设计要求测试与评价；这条线区分数据/任务基础和方法继承。

原文位置：Mal26 §5，第6页。

资源：[CADTestBench / CADTests](/cad/datasets/ds_cadtestbench)。

问题：[I-E-01](/cad/issues/i-e-01) · [I-G-01](/cad/issues/i-g-01)。

[CAD理解、评估与规划](/cad/tasks/analysis) · [发展关系](/cad/relationships)
:::
<!-- /cad-v2-relations -->
