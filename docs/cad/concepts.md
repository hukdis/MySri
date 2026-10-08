---
id: cad-0003
title: CAD 术语与小练习
navTitle: 术语与小练习
category: cad
type: concept
tags: [前置知识, CAD 表示, 阅读练习]
prerequisites: []
related: [cad-0101, cad-0104, cad-0107]
sources:
  - sources/论文/先读/DeepCAD.md
  - sources/论文/先读/CAD-Recode.md
  - sources/论文/先读/CADTests.md
  - https://arxiv.org/abs/2105.09492
  - https://arxiv.org/abs/2412.14042
  - https://arxiv.org/abs/2605.07807
status: draft
reviewed: false
order: 13
created: '2026-10-07'
updated: '2026-10-07'
---
# CAD 术语与小练习

<div class="edition-label">1.1 · 前置阅读</div>

> 阅读论文前，先区分建模过程、程序和最终几何。下面的概念依据所提供的先读稿整理；示例为本站设计的教学练习。

::: info 整理草稿 · 待人工复核
术语与论文关联尚待人工复核。练习中的尺寸与计算是理想几何示例，未运行 CAD 内核或进行论文复现。
:::

## 操作序列：记录怎么建出来

**草图**是在平面上描述的二维几何；**拉伸**将轮廓沿指定方向形成体积。**操作序列**记录建模步骤及参数，执行后才得到实体。

例如“画一个矩形，再拉伸”与“已经存在一个长方体”提供的信息不同：前者保留过程，后者描述结果。[DeepCAD 原论文](https://arxiv.org/abs/2105.09492)与本站[表示讲解](/cad/deepcad#_4-核心一-如何把-cad-编成序列)提供具体背景。

<MermaidDiagram title="从建模步骤到几何结果" caption="教学示意：不是任何论文的原图，也不代表实际 CAD 内核输出。" code='flowchart LR
 A["矩形草图"] --> B["给定拉伸高度"] --> C["执行建模步骤"] --> D["三维实体"]' />

## 程序与 B-rep：区分描述与结果

| 概念 | 阅读时怎样理解 | 对应论文 |
| --- | --- | --- |
| 命令序列 | 模型预测操作类型及参数 | [DeepCAD](/cad/deepcad)、[Text2CAD](/cad/text2cad) |
| CadQuery 程序 | 用 Python 建模代码表达操作，执行后构建实体 | [CAD-Recode](/cad/cad-recode) |
| OpenSCAD 程序 | 以脚本描述几何与构造操作 | [CADReview](/cad/cadreview) |
| B-rep | 以面、边、顶点及其连接关系描述实体边界 | [CAD-Recode](/cad/cad-recode)、[CADTests](/cad/cadtests) |

**阅读判断**：预测程序和直接预测边界表示是不同的输出方式。程序能执行也不代表形状或要求正确。依据：[CAD-Recode](https://arxiv.org/abs/2412.14042)与[CADTests](https://arxiv.org/abs/2605.07807)；详细设置见对应阅读稿。

## 评测：分别问三个问题

| 问题 | 可以提供的证据 | 仍需另行检查 |
| --- | --- | --- |
| 能执行吗？ | 程序运行、实体构建、有效性统计 | 是否满足文字要求 |
| 形状接近吗？ | Chamfer Distance、IoU 等几何比较 | 精确尺寸、孔是否贯通、条件是否满足 |
| 要求满足吗？ | 针对要求设计的几何或拓扑测试 | 测试本身的正确性与覆盖范围 |

**Chamfer Distance**比较两个点集的近邻距离，具体归一化和缩放必须看论文定义。**IoU**比较相交与相并区域的比例。几何比较与要求满足检查提供不同证据，见 [CADTests 阅读稿](/cad/cadtests#_3-为什么-cd-和-iou-不够)及其[原论文](https://arxiv.org/abs/2605.07807)。

## 小练习：改高度时，哪些量应变化？

本站教学设定：用一个 **10 × 6** 的矩形拉伸成高度 **4** 的理想长方体，长度使用同一任意单位。现在要求“只把高度改为 **6**，保持底面尺寸”。

1. 写出修改前后两条建模步骤，指出唯一应变化的参数。
2. 计算修改前后的体积，说明体积的变化来自哪里。
3. 写下三个独立检查：实体是否有效、底面尺寸是否保持、高度是否符合新要求。

::: details 参考答案与完成标准
修改前：矩形 10 × 6 → 拉伸高度 4。修改后：矩形 10 × 6 → 拉伸高度 6。

原体积为 $10\times6\times4=240$，新体积为 $10\times6\times6=360$。单位为所选长度单位的三次方。变化来自高度，底面面积仍为 60。

完成标准：能指出修改参数、给出两次体积，并分别列出有效性与尺寸检查。这里的正确计算不证明某个生成器或 CAD 工具已经执行成功。
:::

## 接着阅读

- [DeepCAD](/cad/deepcad)：理解表示如何学习。
- [CAD-Editor](/cad/cad-editor)：理解已有序列怎样被局部修改。
- [CADTests](/cad/cadtests)：理解要求怎样变成可执行检查。

## 来源与范围

术语及论文对应关系依据本地 DeepCAD、CAD-Recode、CADTests 等先读稿和其中记录的原论文入口整理。流程图与长方体练习为本站派生教学材料；本次未独立核验各论文实验。
