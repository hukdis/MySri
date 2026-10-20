---
id: cad-0107
title: CADTests：用可执行几何测试检查文本要求是否满足
navTitle: CADTests
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
updated: '2026-10-20'
---
# CADTests：用可执行几何测试检查文本要求是否满足

<!-- cad-v2-context -->
> **研究任务 · CAD理解、评估与规划** · [研究总览](/cad/) · [九篇详读](/cad/reading-navigation?reading=1)
<!-- /cad-v2-context -->

## 论文信息 {#_1-论文信息与方向定位}

- **全名**：Text-to-CAD Evaluation with CADTESTS。
- **作者**：Dimitrios Mallis、Marco Wang、Ahmet Serdar Karadeniz 等。
- **年份与版本**：2026 年预印本；所用版本为 arXiv **2605.07807v1，2026-05-08**，共 21 页。没有据此声称已被某个会议录用。
- **来源**：[arXiv](https://arxiv.org/abs/2605.07807)、[作者代码](https://github.com/dimitrismallis/CADTestBench)、[数据链接](https://huggingface.co/datasets/dimitrismallis/CADTestBench)。
- **名字消歧**：**CADTests** 是测试方法；**CADTestBench** 是构建的基准。它们不等于矩阵中的 CADBench 或 BenchCAD。

**一句话理解**：针对形状距离难以判断生成 CAD 是否满足文字中的孔数、尺寸和位置等具体要求的问题，CADTests 将要求转成在 B-rep（边界表示）上运行的属性测试（property tests），通过变异测试（mutation testing）检查正确参考模型应通过、故意违规模型应失败，并迭代改进测试，再用这些测试评价生成结果，并为生成器提供未满足要求的反馈。

## 为什么 CD 和 IoU 不够？ {#_3-为什么-cd-和-iou-不够}

<PaperFigure src="/papers/cadtests/figure01_motivation.png" title="CADTests 原图 1：相似与符合要求的差别" source="https://arxiv.org/abs/2605.07807" :page="2" />

<!-- figure-translation:/papers/cadtests/figure01_motivation.png -->
**原文翻译（图注）**

图1：CADTESTS 是直接在生成几何上验证提示规格的可执行程序。它们能够处理含糊的设计提示（左），并识别细微的结构错误（右）。为便于展示，图中省略了 CADTESTS 的实现。

**图内文字与标记**

- Reference / Generated B-Rep：参考／生成的边界表示；Chamfer Distance (high / low)：倒角距离（高／低）；Passed All Tests (True / False)：全部测试通过（是／否）。
- 左侧提示：“创建一个细长的矩形棱柱，然后沿其长度切除一个半圆形。”测试1检查至少存在一个由半圆切口形成的圆柱面；测试2检查模型是否细长，即最大尺寸显著大于最小尺寸。
- 右侧提示：“创建一个矩形块，在顶部中心开一个圆孔，并从圆孔向最近边缘延伸出一条细的线切割槽。”测试4要求顶点总数恰为16，以符合矩形块、贯通孔与贯通槽的预期拓扑。
- 右侧失败提示：“预计带贯通孔和槽的矩形块恰有16个顶点，实际发现18个。”参考模型的细槽完全切穿；生成模型的槽未切穿，仍残留一层薄壁。
- 左图注记：“与参考模型偏差较大，但通过全部 CADTests。”右图注记：“与参考模型接近，但因结构错误未通过测试。”

::: details 对照英文原文

Figure 1: CADTESTS are executable programs that verify prompt specifications directly on the generated geometry. CADTESTS can account for ambiguous design prompts (left) and identify subtle structural errors (right). The figure ommits CADTEST implementations for clarity.
:::

**图表解读**
<!-- /figure-translation -->

**来源**：原图 1，PDF 第 2 页。

文本没有规定的细节可以变化。一个模型与参考差异较大，仍可能满足所有明确要求；另一个模型整体很像参考，却可能有孔不贯通等关键错误。

因此：

- **CD/IoU**：与某一个参考几何接近程度。
- **实体有效性**：是否能成功构建实体。
- **要求满足**：尺寸、数量、连通、穿孔、位置等是否符合文字。

三者提供不同证据。对于抽象文本，多解性尤其明显。

术语：

- **属性测试（property-based test）**：检查应满足的性质，而不是只与一个答案逐项相等。
- **CADTest**：查询 B-rep 几何/拓扑并返回通过或失败的 Python 测试。
- **mutant**：故意改错某项要求后的 CAD 程序及实体。
- **kill mutant**：测试成功发现这个故意错误。
- **mutation score**：被检测到的 mutant 比例，是针对这些错误的覆盖代理指标。
- **soundness**：测试能否让已知正确模型通过；不是数学上对所有合理设计的正确性证明。

## 测试具体检查什么？ {#_4-测试具体检查什么}

模型代码执行为 B-rep 后，可以查询面、边、实体数量、体积、包围盒、位置关系等。不同测试组合检查一条或多条要求。

论文将测试按要求分组，也按属性类别归类，包括：

- 实体/壳有效性；
- 拓扑、基元类型；
- 尺寸与比例；
- 体积；
- 对齐、对称、偏移等空间关系。

**教学例子（非论文原代码）**：文本要求“一个圆柱，中心孔贯穿”时，仅检查“存在圆柱面”不够，还需检查孔的位置及是否真正贯穿。具体 API、容差和实体查询须按实际表示实现。

测试在实体上执行，不要求生成器必须采用唯一建模程序。但面数等属性可能受实现方式、拓扑拆分影响，因此测试本身仍需要核查。

## 方法：如何用故意错误改进测试？ {#_5-方法-如何用故意错误改进测试}

<PaperFigure src="/papers/cadtests/figure02_pipeline.png" title="CADTests 原图 2：测试合成与迭代改进" source="https://arxiv.org/abs/2605.07807" :page="5" />

<!-- figure-translation:/papers/cadtests/figure02_pipeline.png -->
**原文翻译（图注）**

图2：所提出的 CADTest 合成流水线。上部将设计提示与参考 CAD 程序提供给 LLM 规划器，以生成 CAD 变异体；下部由规划器生成测试套件，并根据正确样本集合与变异集合上的执行反馈迭代改进。本例中，第1轮未被检出的变异，在第 N 轮加入比较内外圆柱面“体积”的测试后被检出。

**图内文字与标记**

- Planner：规划器；Mutation Generation：变异生成；Mutated CAD Program：变异 CAD 程序；Execution：执行；Test Suite：测试套件；Passing Set / Mutation Set：正确样本集合／变异集合。
- 设计提示：“创建一个矮而宽的圆柱体，宽度大于高度，并在中心开一个贯穿整个高度的圆孔。”
- 四个变异分别违反以下要求：①主体应为圆柱，却被改成立方体；②中心切口应较小，却被改大；③只应有一个中心切口，却被改成多个小孔；④内部切口应贯穿圆柱的全部高度。
- 第1轮的测试：检查有两个圆柱面（外圆柱和内切口）；通过检查实体中心不在材料内部来确认通孔；检查总面数为4（两个圆柱面、两个平面）。
- 第 N 轮新增测试4：“验证内部圆柱面的面积远小于外部圆柱面的面积。”Round 1 / Round N：第1轮／第 N 轮。

**译注**：原图注使用 volumes（体积），图内新增测试文字使用 face area（面面积）；译文按原图分别保留，二者不能混作同一几何量。

::: details 对照英文原文

Figure 2: Illustration of the proposed CADTest synthesis pipeline. (Top) A design prompt and reference CAD program are provided to an LLM planner to generate CAD mutants. (Bottom) The planner generates a test suite that is iteratively refined using execution feedback from the passing and mutation sets. In this example, a mutation that is not killed in R = 1 is detected in R = N after adding a test comparing the volumes of the inner and outer cylindrical faces.
:::

**图表解读**
<!-- /figure-translation -->

**来源**：原图 2，PDF 第 5 页；对应 §4。

### 生成错误变体 {#_5-1-生成错误变体}

生成器看到文本和参考程序，制造违反要求的 mutant，例如孔太大、孔不贯穿、基体形状错误。先执行程序，修复运行错误，保证变体主要用于检测几何要求违反。

### 初始测试 {#_5-2-初始测试}

测试规划器主要依据**文本提示和 CAD API 说明**生成测试，不直接读取参考程序作为答案。这样希望降低把某个参考实现写死为唯一目标的风险。

必须区分：mutant 生成可使用参考程序；测试生成器的直接输入受限。整个流水线仍通过正确模型和 mutant 的执行反馈获得监督，不能称为完全无参考的数据构建。

### 两组实体与反馈 {#_5-3-两组实体与反馈}

- **passing set**：参考模型及保持合法要求的变换版本。
- **mutation set**：错误变体及其变换版本。

在两组上执行测试，反馈哪些正确模型被误拒绝、哪些错误变体未被发现。规划器据此改写、增加或删除测试。

增强包括平移、旋转和部分缩放。**详细提示规定绝对尺寸时不做缩放增强**。实际使用还应检查文本是否固定方向或位置；不能默认所有变换都保持要求。

### 停止与筛选 {#_5-4-停止与筛选}

最多 **4 轮**改进。最后去掉仍无法让参考模型通过的测试。一个测试套件有限，不保证所有未来错误都能被发现。

这是通过 API 模型与 CAD 执行环境构建基准的路线，不是一个需要从头大规模 GPU 训练的生成网络。资源主要包括模型调用、mutant/test 生成及 CAD 执行；论文表中不能直接换算四张 4090 的运行成本。

## 数据与指标：两种“通过率”不要混淆 {#_6-数据与指标-两种-通过率-不要混淆}

CADTestBench 基于 **CADPrompt 的 200 个 CAD 程序**，每个对应抽象与详细提示，合计 **400 个提示条件**。原文 §5 报告 **5,937 个测试**，每个提示约 15 个。

表 2 展示的改进实验测试数量为 **3,091 / 2,989**，与 §5 总数不同。本笔记保留原始记录，复现应核对发布清单、过滤和统计口径，不将两处数字强行合并。

mutant 生成使用 GPT-4.1，基准测试生成使用 Claude-Sonnet-4.6，见本版本 §5。模型名称记录实验版本，不是当前最优模型推荐。

### 测试生成质量 {#_6-1-测试生成质量}

- **Valid**：测试是否能够运行。
- **Sound**：能够运行的测试是否让参考模型通过。
- **MScore**：测试套件检测到多少故意违反要求的变体。

可运行的测试也可能错；能让参考通过的测试也可能太弱。

### CAD 生成质量 {#_6-2-cad-生成质量}

- **PR，Pass Rate**：一个生成结果通过全部测试才算成功。
- **RS，Requirement Score**：每条要求的测试组全部通过才算该要求满足，再计算比例。
- **类别 Acc**：各测试属性类别的准确性。
- **IR**：生成程序执行错误率。

无效输出按失败计入相关指标，不只在有效输出子集上算分。PR 与 RS 也不是同一个东西：部分要求正确可能有较高 RS，却仍不满足 PR。

## 实验：先看测试本身，再看生成器 {#_7-实验-先看测试本身-再看生成器}

### 初始测试质量 {#_7-1-初始测试质量}

<PaperFigure src="/papers/cadtests/table01_test_generation.png" title="CADTests 原表 1：测试生成能力" source="https://arxiv.org/abs/2605.07807" :page="6" />

<!-- figure-translation:/papers/cadtests/table01_test_generation.png -->
**原文翻译（表注）**

表1：针对抽象提示，以有效性、健全性和变异分数评价 CADTESTS 的生成性能。比较不同 LLM 规划器，以及两种提示策略：在上下文中提供20个 CAD 测试示例，或提供说明测试编写方式的技能文件。表中同时给出百分比和总计数。

**图内文字与标记**

- Model / Prompting：模型／提示方式；20-shot：20个示例；Skilled：提供技能文件。
- Valid (#valid/#total)：有效测试数／全部测试数；Sound (#sound/#valid)：健全测试数／有效测试数；MScore：变异分数。
- ✓／✕表示使用／不使用相应提示方式；模型名称保留原文。

::: details 对照英文原文

Table 1: CADTESTS generation performance for abstract prompts in terms of validity, soundness, and mutation score. We evaluate various LLM planners and compare two prompting strategies: providing the planner with 20 CAD test demonstrations in its context, or supplying a skill file that disambiguated how tests should be written. The table presents both percentages and total counts.
:::

**图表解读**
<!-- /figure-translation -->

**来源**：原表 1，PDF 第 6 页；抽象提示实验。

Claude-4.6-Sonnet 初始测试 Valid **97.8%**，Sound **90.6%**，mutation score **63.0%**。能够运行且参考可通过，不意味着已检测全部错误。

不同模型、示例提示和 skill 文件会改变测试质量。这里的 skill 是论文给测试生成器的领域说明文件，不是本地 Codex 技能的性能实测。

### 迭代改进的效果 {#_7-2-迭代改进的效果}

<PaperFigure src="/papers/cadtests/table02_refinement.png" title="CADTests 原表 2：反馈迭代改进" source="https://arxiv.org/abs/2605.07807" :page="7" />

<!-- figure-translation:/papers/cadtests/table02_refinement.png -->
**原文翻译（表注）**

表2：迭代改进闭环的有效性。分别对参考实现、CAD 变异体及其增强版本报告分数。

**图内文字与标记**

- Prompt：提示；Detailed / Abstract：详细／抽象提示；Model：模型；#total：总数。
- Sound：健全性；SoundAugm：增强版本的健全性；MScore：变异分数；MScoreAugm：增强版本的变异分数；± 后的数值按原表保留。

::: details 对照英文原文

Table 2: Effectiveness of the refinement loop. Scores are reported for the reference implementation, CAD mutants, as well as their augmented variants.
:::

**图表解读**
<!-- /figure-translation -->

**来源**：原表 2，PDF 第 7 页。

详细/抽象提示的 mutation score 为 **0.91 / 0.93**；变换增强后的统计也另列。它说明针对构建的变体，测试辨别力得到改善。

不能解释为“对所有自然错误都有 91%/93% 检测能力”，因为 mutant 是特定生成机制产物。

### 用测试评测 CAD 生成 {#_7-3-用测试评测-cad-生成}

<PaperFigure src="/papers/cadtests/table03_generation.png" title="CADTests 原表 3：文本到 CAD 基准" source="https://arxiv.org/abs/2605.07807" :page="7" />

<!-- figure-translation:/papers/cadtests/table03_generation.png -->
**原文翻译（表注）**

表3：在 CADTESTBENCH 上评价文本到 CAD 方法，分别报告抽象与详细两个子集的结果。文本到 CAD 基线使用不同的 LLM 规划器，以通过率、要求得分和无效比例衡量性能。

**图内文字与标记**

- Method / Planner：方法／规划器；Detailed / Abstract：详细／抽象提示子集。
- IR：无效比例；RS：要求得分；PR：通过率；↑越大越好，↓越小越好。
- Finetuned Method：微调方法；Train-Free Methods：免训练方法；Test-based Baselines：基于测试的基线；CADTests + Log：CADTests 加执行日志。

::: details 对照英文原文

Table 3: Evaluation of Text-to-CAD methods on CADTESTBENCH. Results are reported for both the abstract and detailed partitions. Text-to-CAD baselines are evaluated using different LLM planners. Performance is measured in terms of pass rate, requirement score, and invalidity rate.
:::

**图表解读**
<!-- /figure-translation -->

**来源**：原表 3，PDF 第 7 页。

Text2CAD 在此基准详细/抽象提示 PR 为 **0.025 / 0.085**，尽管 IR 仅 **0.005 / 0.015**。这再次说明可执行不等于要求满足，也表明该基准分布不同于其原训练评测集。

Claude-4.6-Sonnet 的 ReAct 详细/抽象 PR 为 **0.580 / 0.715**；CADTests+Log 为 **0.625 / 0.810**。

但 GPT-5.2 下，加入 Log 后抽象 PR **0.700** 低于 CADTests 的 **0.720**。因此不能写“日志反馈对所有模型和设置都改善”。

基准比较包含规划器差异、工具反馈及任务分布变化，需要保留这些条件。方法不能只用一个汇总排名概括。

### 与人工判断是否一致？ {#_7-4-与人工判断是否一致}

<PaperFigure src="/papers/cadtests/table04_human.png" title="CADTests 原表 4：人工一致性" source="https://arxiv.org/abs/2605.07807" :page="9" />

<!-- figure-translation:/papers/cadtests/table04_human.png -->
**原文翻译（表注）**

表4：与人工共识标注的一致性，Cohen 的 κ=0.54。左侧比较 CADTESTS 与文献[38]中基于 LLM 的指标在通过率判定上的一致性；右侧以二元人工标签为依据，报告连续评分指标的 AUC。

**图内文字与标记**

- Pass-Rate Metric：通过率指标；Accuracy：准确率；Precision：精确率；Recall：召回率；F1：F1 分数。
- Metric：指标；AUC：曲线下面积；Chamfer Distance：倒角距离；CLIP Score：CLIP 得分；CADTests (RS Score)：CADTests 要求得分；LVM 保留原指标名称。

::: details 对照英文原文

Table 4: Agreement with human consensus annotations (Cohen’s κ=0.54). Left: Pass-rate agreement for CADTESTS and the LLM-based metric of [38]. Right: AUC for continuous score metrics against the binary human label.
:::

**图表解读**
<!-- /figure-translation -->

**来源**：原表 4，PDF 第 9 页；125 个随机生成结果、两名专家标注者。

CADTests 与人工共识的准确率 **0.938**，RS 的 AUC **0.928**。两名标注者自身 Cohen’s κ 为 **0.54**，属于存在明显歧义的判断。

这支持本样本中测试评价更接近人工共识，不等于获得了不含歧义的绝对真值。

## 局限与测试误判 {#_8-局限与测试误判}

<PaperFigure src="/papers/cadtests/figure04_examples.png" title="CADTests 原图 4：测试通过与失败案例" source="https://arxiv.org/abs/2605.07807" :page="9" />

<!-- figure-translation:/papers/cadtests/figure04_examples.png -->
**原文翻译（图注）**

图4：由 CADTest-Claude 基线生成、并使用 CADTESTS 评价的示例。绿色表示测试通过，红色表示测试失败。为便于阅读，图中仅展示部分测试描述，省略完整测试实现。

**图内文字与标记**

- Reference / Generated B-Rep：参考／生成的边界表示；Prompt：提示；Failure：失败。
- 左侧提示：“创建一个星形三维物体。先绘制一个五角星草图，再将其拉伸，每个顶点应形成略有不同的角度。”测试依次检查：至少12个面；存在拉伸且最大尺寸明显大于最小尺寸；顶点数为偶数；恰有一个实体；五个外侧星尖在轮廓平面内具有不均匀角间距。
- 左侧失败提示：“星尖角间距近似均匀，相对离散程度为0.0031，间距为[72.11,72.07,71.94,71.89,71.99]；但提示要求各顶点形成略有不同的角度。”
- 中间提示：“创建一张四腿桌子。先创建矩形，再从矩形各角的底部连接四个细长的拉伸正方形。”测试检查：桌面与四腿构成一个统一实体；所有面均为平面；四个最小面即腿底为正方形；总面数恰为18；包围盒长宽比在细长桌腿的合理范围内。
- 右侧提示：“创建一个圆并将其拉伸，再开四个小孔，使它们按正方形排列。”测试检查：恰有一个实体；恰有5个圆柱面（主体与四个孔壁）；至少10条圆边；平面多于2个；体积小于完整包围盒体积；四个孔壁圆柱面的半径相同。
- 右侧失败提示：“预计有5个圆柱面（1个主体圆柱和4个孔），实际发现8个。”

::: details 对照英文原文

Figure 4: Example generations from the CADTest-Claude baseline evaluated via CADTESTS. Green indicates passed tests and red indicates failed tests. For clarity, only a subset of test descriptions is shown and full test implementations are omitted.
:::

**图表解读**
<!-- /figure-translation -->

**来源**：原图 4，PDF 第 9 页。绿色通过、红色失败，原图仅展示部分测试说明。

原文 §7 明确承认：测试覆盖有限，仍可能误判或与人类判断不同。通过所有已列测试只说明当前测试未发现错误。

**分析**：

- 同一个模型生成 mutant 和测试，可能共享盲点。
- 过于具体的面数、包围盒或拓扑条件可能误拒绝其他合法实现。
- 正确集合只有有限示例及变换，不能覆盖全部合理设计。
- 如果把公开基准测试用于不断调参或反馈，最后还需独立留出评价；生成时自建的反馈测试和正式评测测试应区分。

这些是后续实验设计问题，不能据此未经实验直接否定论文。

## 相关研究 {#_9-放回方向地图-并回看前面的指标}

- **数据与评测**：核心是基准构建与要求评价。
- **设计约束**：将设计意图拆成可检查条件。
- **条件生成**：评测文本生成，不依赖唯一参考形状。
- **执行反馈**：测试失败与中间几何日志可用于生成反馈。

回看其他论文：

- DeepCAD：命令/参数/CD/无效比例。
- Text2CAD、CAD-Llama：文本条件生成，但序列或几何分数不能完全代表要求满足。
- CAD-Editor：还需检验修改要求以及未修改属性。
- CAD-Assistant：执行成功、模型停止之后仍需评价任务目标。

这篇适合作为你后续选题的评测思维基础。先写清“应该检查什么”，再判断现有检测是否覆盖；不必立即自建一个大基准。

## 思考与自测 {#_10-阅读自测与阅读卡}

1. 为什么形状与参考不同也可能正确？
2. Valid、Sound、MScore 各回答什么？
3. PR 与 RS 有何区别？
4. 详细提示为什么不能随意缩放？
5. 高 mutation score 是否证明检测所有自然错误？
6. 初始测试生成是否直接读取参考程序？
7. 通过全部测试是否等于满足所有潜在设计要求？

<details>
<summary>参考答案：完成自测后展开</summary>

1. 文本没有限定的细节可以变化，同一描述存在多个合理设计。
2. 分别是能运行、参考可通过、能发现构建的错误变体。
3. PR 要求全套通过，RS 逐条要求计分。
4. 它可能规定绝对尺寸，缩放会违反要求。
5. 不证明，覆盖只针对给定错误变体及其分布。
6. 本文限制测试规划器的直接输入，但 mutant 构建使用参考，迭代仍利用执行反馈。
7. 不等于，有限测试可能存在盲点。

</details>

## 参考文献 {#_11-来源与核查记录}

- [原论文 PDF](https://arxiv.org/pdf/2605.07807)

图表引自原论文，图号与 PDF 页码见各图说明。

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
