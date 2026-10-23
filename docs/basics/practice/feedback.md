---
id: basic-practice-0014
category: basics
type: concept
tags:
- 技术实践
prerequisites:
- basic-practice-0011
related:
- cad-0104
- cad-0106
- cad-0107
- cad-0109
sources:
- https://arxiv.org/abs/2412.14042
- https://arxiv.org/abs/2412.13810
- https://arxiv.org/abs/2505.22304
- https://arxiv.org/abs/2605.07807
- https://github.com/dimitrismallis/CAD-Assistant
- https://github.com/dimitrismallis/CADTestBench
created: '2026-10-23'
title: 生成之后：执行、检查与反馈
navTitle: 执行反馈与工具
practiceGroup: papers
order: 45
status: draft
reviewed: false
updated: '2026-10-23'
outline:
- 2
- 2
---
# 生成之后：执行、检查与反馈

一个程序没有报错，不代表它满足设计要求。要形成可改进的流程，需要把“哪里错、怎样观察、下一轮用什么信息”写清楚。

## 先运行一个能逐项检查的例子

```powershell
python paper_tech.py feedback
```

目标是宽 10、深 6、高 6。脚本依次检查三份手写候选：高度错误、宽度错误、全部满足。输出 `failed_requirements`，让你看到反馈应该指向哪项条件。

<<< ../../../examples/technical-practice/paper_tech.py#feedback

候选由代码预先列出；此例执行属性字典检查，没有调用生成模型或 CAD 内核。它说明评价接口怎样把一个笼统分数变成具体问题。实际命令与可选 STEP 导出见[几何检查实验](./text-cad)。

## 评价器本身也要检查 {#property-tests}

可以先给评价器一份已知正确答案，确认它不会误报；再故意改一个尺寸，确认它能发现错误。这种构造错误版本的思路称为变异测试。

对于“宽 10、深 6、高 6”的目标，若评价器只检查体积，它可能接受另一组乘积相同的尺寸。一个总量检查无法覆盖所有要求，因此需要明确每项测试究竟约束什么。

[CADTests](https://arxiv.org/abs/2605.07807)讨论对真实 B-rep 的属性测试及测试改进。这里的字典检查只是解释接口；没有查询面、边、孔的拓扑。完整接口参照 [CADTestBench 作者仓库](https://github.com/dimitrismallis/CADTestBench)。

## 多候选筛选与逐轮修正 {#candidate-selection}

两种常见推理方式可以分别理解：一次生成多个候选后择优；或者先生成一个，执行并把错误反馈给下一轮。它们都增加测试时计算，但只有真正运行优化器更新权重时才发生训练。

CAD-Recode 生成多个候选程序，执行后利用与输入点云的距离选择结果，具体预算与指标见[原文 §4](https://arxiv.org/abs/2412.14042)。点云距离可以支持形状比较，但不能证明找回了唯一的原始建模历史。

候选筛选的指标必须来自任务允许的信息。重建可以使用输入点云；面向用户的真实生成不能假设拥有用户心中目标程序作为筛选答案。

## 工具循环怎样组织 {#tool-loop}

<MermaidDiagram title="模型与执行环境的分工" caption="教学示意。工具返回的是当前状态与检查结果，是否训练另由优化步骤决定。" code='flowchart LR
 A["要求与当前状态"] --> B["模型选择操作"] --> C["执行工具"] --> D["几何或渲染观察"] --> E["检查与反馈"] --> A' />

模型提出操作，CAD 环境执行，渲染或查询工具提供观察。下一轮输入包含更新后的状态和反馈，模型据此继续。这需要明确工具名称、参数、返回值和停止条件。

[CAD-Assistant](https://arxiv.org/abs/2412.13810)将视觉语言模型与 CAD 工具连接；其[作者实现](https://github.com/dimitrismallis/CAD-Assistant)涉及 FreeCAD 与外部模型接口。阅读时还应区分模型提出几何关系与求解器实际满足约束这两个角色。

本站不把字典检查称为真实 FreeCAD 代理。要接入完整系统，应先在独立环境验证一个具体工具，然后增加观察和模型调用，最后记录调用预算、失败与停止原因。

## 反馈为什么还需要定位

“形状不对”很难直接转成代码修改。CADReview 把视觉异常、相关代码和修复串起来，并分别训练相关能力，参照[原文 §4](https://arxiv.org/abs/2505.22304)。

例如槽数错误时，先定位生成槽的代码块，再提供修改依据。模型输出的反馈也会出错，因此还要通过执行、独立检查和最终形状评价验证它。下一页讨论怎样利用较好与较差反馈构造训练信号。

[下一专题：偏好学习与强化学习](./optimization)
