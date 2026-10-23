---
id: basic-practice-0013
category: basics
type: concept
tags:
- 技术实践
prerequisites:
- basic-practice-0011
related:
- cad-0108
- basic-practice-0014
sources:
- https://arxiv.org/abs/2502.03997
- https://github.com/microsoft/CAD-Editor
created: '2026-10-23'
title: 局部编辑：先定位，再补全
navTitle: 编辑 · 定位与补全
practiceGroup: papers
order: 44
status: draft
reviewed: false
updated: '2026-10-23'
outline:
- 2
- 2
---
# 局部编辑：先定位，再补全

“只把高度从 4 改为 6，底面不变”同时包含两个目标：改变指定参数，保留其余设计。直接重写整段序列可能破坏本来正确的部分，因此可以先找修改位置，再生成缺口内容。

## 先看一对序列

```text
修改前：SKETCH RECT 10 6 EXTRUDE 4 EOS
修改后：SKETCH RECT 10 6 EXTRUDE 6 EOS
```

两者共享大部分 token。训练数据若同时提供前后序列，就可以从差异构造定位和补全监督。推理时只有原模型与修改指令，所以定位仍需要模型判断。

## 运行 LCS 与 mask 演示

本页只需标准库：

```powershell
python paper_tech.py editing
```

输出中的 `retained_pairs` 保存两条序列的对应位置，`masked` 将改变的位置替换为 `<mask>`，`inserted` 给出要补入的目标 token。本例只有一个高度变化，容易逐项核对。

<<< ../../../examples/technical-practice/paper_tech.py#editing

LCS 是最长公共子序列，保留的 token 不要求连续。动态规划比较“两个位置相同，向后推进”和“跳过一个位置”的最长结果。这里比较 token，不是直接比较三维实体。

## 为什么不能把相同数字直接配对

例子中数字 6 同时可能代表底面深度和新高度。只看 token 值，不能确定几何语义；因此脚本返回位置配对，而不是把所有相同字符串都当成同一个设计参数。

较复杂序列还会出现多个最优公共子序列、不同程序表达同一几何、修改造成后续引用改变等问题。这个演示能说明差异监督的来源，不能独立判断设计意图。

## 两个训练阶段分别学什么

<MermaidDiagram title="定位与补全的信息流" caption="简化教学结构；具体输入、特殊 token 和数据构造以 CAD-Editor 原文为准。" code='flowchart LR
 A["原 CAD + 编辑指令"] --> B["定位模型"] --> C["带 mask 的 CAD"]
 C --> D["补全模型"] --> E["修改后 CAD"]
 E --> F["执行并检查改变与保留部分"]' />

定位阶段学习“哪里需要改”，补全阶段学习“缺口应该填什么”。两阶段都可以用目标答案进行 SFT，再选择 LoRA 等参数更新方法。LCS 用于从成对答案构造训练监督，不能在真实推理时偷看目标编辑后的 CAD。

[CAD-Editor §4–5](https://arxiv.org/abs/2502.03997)还涉及成对 CAD 合成、编辑指令生成和人工筛选后训练。数据筛选改变了训练样本；它本身不能直接等同于 PPO 或 GRPO。

## 从小例子走到作者实现

[CAD-Editor 作者仓库](https://github.com/microsoft/CAD-Editor)把流程分成数据准备、定位训练和补全训练。先在本站例子中理解 mask 来自哪里，再对照仓库中的数据配对与训练入口。

完整仓库需要独立环境、数据和模型条件；部分数据标注流程还涉及外部模型接口。本站本页只运行确定性的 LCS 演示，没有调用这些服务，也没有训练完整编辑器。

## 结果怎样检查

先核对新高度，再核对宽、深和其他几何是否保持。最后检查实体是否有效。编辑成功应同时满足修改要求与保留要求；仅生成一个可执行序列还不够。

可以把例子改成“宽度和高度同时变化”，再次观察定位目标。若 token 改变却没有造成预期几何变化，继续追查表示与执行层，而不是只比较文本差异。

[下一专题：执行反馈与工具](./feedback)
