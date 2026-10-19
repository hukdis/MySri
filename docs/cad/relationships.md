---
id: cad-v2-relationships
title: 发展关系与技术联系
category: cad
type: concept
tags:
  - 研究树第二版
prerequisites: []
related: []
sources: []
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-19'
---
# 发展关系与技术联系

时间先后不自动表示继承。这里只展示来源材料明确列出的 30 条关系；关系定位沿用材料记录，待人工复核。

## 局部关系图

<CadRelations />

## 基础概念节点

- **几何约束求解基础**：[CAD理解、评估与规划](/cad/tasks/analysis) · [CAD编辑](/cad/tasks/editing)
- **草图约束预测**：[CAD理解、评估与规划](/cad/tasks/analysis) · [CAD生成](/cad/tasks/generation)
- **设计意图条件生成**：[CAD生成](/cad/tasks/generation)
- **规格与几何要求验证**：[CAD理解、评估与规划](/cad/tasks/analysis)
- **语义参数与实体引用**：[CAD生成](/cad/tasks/generation) · [CAD编辑](/cad/tasks/editing)
- **装配模型构建**：[CAD生成](/cad/tasks/generation)
- **类型化工具执行**：[CAD生成](/cad/tasks/generation) · [CAD编辑](/cad/tasks/editing)
- **物理分析与反馈**：[CAD理解、评估与规划](/cad/tasks/analysis) · [CAD生成](/cad/tasks/generation)
- **执行反馈机制**：[CAD生成](/cad/tasks/generation) · [CAD重建](/cad/tasks/reconstruction) · [CAD编辑](/cad/tasks/editing)
- **评价资源与协议**：[CAD理解、评估与规划](/cad/tasks/analysis)
- **装配过程与说明规划**：[CAD理解、评估与规划](/cad/tasks/analysis)

## 有来源的发展关系

### R01 · 直接改进

[DeepCAD](/cad/deepcad) → [SkexGen](/cad/papers/xu22)

SkexGen明确在DeepCAD等表示上修改，增加面层次并改为解耦码本生成；不表示复用整个DeepCAD模型。

来源材料定位：Xu22 §3，PDF第2页。

### R02 · 相关基础

[CurveGen / TurtleGen](/cad/papers/wil21) → [SkexGen](/cad/papers/xu22)

SkexGen明确借鉴TurtleGen的表示，再做表达与学习方面的调整。

来源材料定位：Xu22 §3，PDF第2页。

### R03 · 直接改进

[SkexGen](/cad/papers/xu22) → [HNC-CAD](/cad/papers/xu23)

HNC使用SkexGen的VQ-VAE及CAD解码基础，增加层次码树、掩码跳连和部分输入条件。

来源材料定位：Xu23 §§4–5，PDF第4–5页。

### R04 · 相关基础

[SketchGraphs](/cad/papers/sef20) → [Vitruvion](/cad/papers/sef21)

Vitruvion使用SketchGraphs数据和约束监督，并适配其基线进行比较；这条线记录数据基础。

来源材料定位：Sef21 §§4.1–4.2，PDF第7页。

### R05 · 直接改进

[Vitruvion](/cad/papers/sef21) → [Design Alignment](/cad/papers/cas25)

Design Alignment采用Vitruvion作为基础模型，在其上加入求解器反馈的对齐训练。

来源材料定位：Cas25 §4.2，第4页；§§4.3–4.4。

### R06 · 相关基础

[SketchGraphs](/cad/papers/sef20) → [Design Alignment](/cad/papers/cas25)

Design Alignment的训练数据来自SketchGraphs。

来源材料定位：Cas25 §5.1，第6页。

### R07 · 相关基础

[DeepCAD](/cad/deepcad) → [Text2CAD](/cad/text2cad)

Text2CAD对DeepCAD模型构造多层次文本描述，用于文本条件CAD序列学习。

来源材料定位：Text2CAD §3，Data Annotation。

### R08 · 相关基础

[DeepCAD](/cad/deepcad) → [CAD-Llama](/cad/cad-llama)

CAD-Llama的数据与命令表示以DeepCAD为基础，再转换为SPCC并适配LLM；不继承DeepCAD的生成网络。

来源材料定位：数据与表示章节；原文§3–4。

### R09 · 相关基础

[DeepCAD](/cad/deepcad) → [CAD-Editor](/cad/cad-editor)

CAD-Editor从DeepCAD出发构造原始模型和编辑数据。

来源材料定位：原文§4、§6。

### R10 · 相关基础

[HNC-CAD](/cad/papers/xu23) → [CAD-Editor](/cad/cad-editor)

CAD-Editor用HNC-CAD生成设计变体，再抽取差异并形成编辑三元组。

来源材料定位：原文§4，数据合成。

### R11 · 相关基础

[CADTalk](/cad/papers/yua23) → [CADReview / ReCAD](/cad/cadreview)

CADReview的辅助学习数据使用CADTalk来源；这里只记录数据关系。

来源材料定位：Che25 §4.1.1，第5页；附录B。

### R12 · 相关基础

[Text2CAD](/cad/text2cad) → [CIT-CAD](/cad/papers/du26)

CIT-CAD使用Text2CAD相关样本构建其验证实验；不等于采用Text2CAD生成网络。

来源材料定位：Du26 §IV.A，第7页；预处理说明。

### R13 · 相关基础

[CADCodeVerify](/cad/papers/alr24) → [CADTests](/cad/cadtests)

CADTestBench基于CADPrompt设计要求测试与评价；这条线区分数据/任务基础和方法继承。

来源材料定位：Mal26 §5，第6页。

### R14 · 相关基础

[CADBench](/cad/papers/dor26) → [CADForge](/cad/papers/lu26g)

CADForge沿用CADBench的部分数据处理协议，非继承其模型。

来源材料定位：Lu26g Appendix B.1，PDF第14页。

### R15 · 独立路线

[AutoMate](/cad/papers/jon21) → [JoinABLe](/cad/papers/wil21c)

JoinABLe称AutoMate为同期工作，比较用户指定区域的推荐与自动联合轴预测；没有方法或数据继承证据。

来源材料定位：JoinABLe §2，第3页；Appendix A.1.1。

### R16 · 比较关系

[UV-Net](/cad/papers/jay21) → [JoinABLe](/cad/papers/wil21c)

JoinABLe的B-Grid比较基线使用UV-Net网格采样，主模型不是UV-Net架构。

来源材料定位：JoinABLe §5.2；Appendix A.2.6。

### R17 · 相关基础

[neuralCAD-Edit](/cad/papers/per26) → [AgenticCADedit](/cad/papers/sin26b)

AgenticCADedit复用neuralCAD-Edit基准和评价协议，并改变交互接口；不声称继承其模型或训练。

来源材料定位：Sin26b §6.1，第7页；§3.2，第5–6页。

### R18 · 比较关系

[CAD-Coder · Doris](/cad/papers/dor25) → [CADForge](/cad/papers/lu26g)

CAD-Coder在CADForge中是比较基线，没有已核实的直接方法采用。

来源材料定位：Lu26g §4.1，第6页；Appendix C。

### R19 · 比较关系

[Pointer-CAD](/cad/papers/qi26b) → [Vision2CAD](/cad/papers/che26e)

Vision2CAD讨论Pointer-CAD实体选择能力作为背景；不能把引用当成继承其实现。

来源材料定位：Che26e §2.3，PDF第5页。

### R20 · 学习归类

[Sketch2CAD](/cad/papers/li20) → [Free2CAD](/cad/papers/li22)

两者同属草图到操作路线，分别侧重上下文逐步编辑与自由整体笔画；未核实直接架构继承，因此并列。

来源材料定位：Li20、Li22摘要；关系为本树归类。

### R21 · 学习归类

[SolidGen](/cad/papers/jay22) → [BrepGen](/cad/papers/xu24b)

直接B-Rep生成中自回归与扩散的代表分支；没有核实直接继承，按方法范式并列。

来源材料定位：Jay22、Xu24b摘要。

### R22 · 学习归类

[持久拓扑命名](/cad/papers/kri95) → [Pointer-CAD](/cad/papers/qi26b)

阅读实体指针前先理解持久引用问题；不表示Pointer-CAD采用1995的命名算法。

来源材料定位：持久命名期刊摘要与Pointer-CAD摘要；仅学习联系。

### R23 · 学习归类

几何约束求解基础 → 草图约束预测

传统约束求解是理解神经草图与求解器对齐的概念前提，不构成所有模型的算法继承。

来源材料定位：方向定义与阅读安排。

### R24 · 跨方向融合

设计意图条件生成 → 规格与几何要求验证

CIT-CAD和ReliCAD将需求生成与显式规格/关系核验连接；此线连接研究问题，非论文继承。

来源材料定位：Du26、Zhe26原文摘要。

### R25 · 跨方向融合

语义参数与实体引用 → 设计意图条件生成

Pointer-CAD将B-Rep实体选择带入条件生成；Intent2CAD把可复用语义参数带入监督。

来源材料定位：Qi26b摘要；sources/selected_primary_3.md。

### R26 · 跨方向融合

装配模型构建 → 类型化工具执行

Embodied CAD把装配技能、类型化操作及求解器反馈组合为执行系统。

来源材料定位：Liu26c原文摘要。

### R27 · 跨方向融合

物理分析与反馈 → 执行反馈机制

FEA反馈代理将结构分析用作设计迭代反馈；GReFEM则是分析辅助的不同任务。

来源材料定位：Son26原文摘要。

### R28 · 跨方向融合

评价资源与协议 → 执行反馈机制

CADTests把可执行要求测试作为评价，同时允许用测试反馈引导生成。

来源材料定位：原文§5–6。

### R29 · 跨方向融合

装配过程与说明规划 → 规格与几何要求验证

装配说明框架用产品图和确定性顺序约束语言输出，并在发布前设置人工检查。

来源材料定位：AX2610_11896原文摘要。

### R30 · 直接改进

[Pointer-CAD](/cad/papers/qi26b) → [Pointer-CAD v2 · 先规划再构造](/cad/papers/qi26)

Pointer-CAD v2摘要明确与v1比较，改为计划先行和连续参数引用以避免量化误差；这条关系不扩展为所有模块、权重或数据均直接复用。

来源材料定位：arXiv摘要：Compared with v1 (arXiv:2603.04337)。
