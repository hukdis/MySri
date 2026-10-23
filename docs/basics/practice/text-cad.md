---
id: basic-practice-0006
title: 文本与 CAD 对应学习：从配对数据到独立要求检查
navTitle: 文本要求与几何检查
category: basics
type: concept
tags:
- 技术实践
- 文本到CAD
- 要求验证
prerequisites:
- basic-practice-0003
related:
- cad-0102
- cad-0107
- basic-practice-0008
sources:
- https://arxiv.org/abs/2409.17106
- https://arxiv.org/abs/2605.07807
- https://cadquery.readthedocs.io/en/latest/quickstart.html
status: draft
reviewed: false
order: 73
created: '2026-10-22'
updated: '2026-10-23'
outline:
- 2
- 2
practiceGroup: lab
---
# 文本与 CAD 对应学习：从配对数据到独立要求检查

这是[执行反馈专题](./feedback)的补充实验。从文字、目标命令与几何属性的对应关系出发，分别检查语法、参数和可选的实体导出。

## 同一个对象可以有多种表达

```text
make cylinder radius 2 height 4   → CYL 2 4
create cylinder radius 2 height 4 → CYL 2 4
```

输入说法不同，目标几何相同。训练将这些输入与目标配对，优化答案预测；它没有额外监督“radius 这个词必须逐点对应某个圆柱面”。因此，文本条件生成、显式词—几何定位和实体要求验证是三件不同的事情。

本章只覆盖明确数值描述。Text2CAD 的 L0–L3 则改变描述详细程度，模糊文本可能有多个合理答案；不能把本章的完整命令匹配率照搬为所有 text-to-CAD 任务的唯一指标。

## 改一项条件，观察对应输出

先从 `sft-metrics.json` 的逐条预测中找同一高度、不同半径的样本。预期变化为：

```text
radius 2, height 4 → CYL 2 4
radius 3, height 4 → CYL 3 4
```

如果模型把高度也改了，说明条件与参数对应仍不稳定。这里的数值是解释检查逻辑的示意，不是声称某次运行必然产生的输出。

比较时还应区分训练对象和留出对象。仅把 make 换成 create、而几何仍出现在训练集，不能声称验证了新几何泛化。数据按 `geometry_id` 分组正是为避免这一点。

## 独立检查三种正确性

```powershell
python check_cad.py runs/sft-metrics.json
```

检查器不用训练模型，也不执行模型生成的任意 Python：

| 层次 | 本章检查方式 | 仍然无法证明什么 |
| --- | --- | --- |
| 命令语法 | 恰好是 `CYL 整数 整数`，参数在 1–6 | 复杂操作历史有效 |
| 参数要求 | 半径与高度分别对照目标 | 任意语言要求全部满足 |
| 基础几何 | 圆柱体积有限且为正 | B-rep 拓扑和工业约束正确 |

`valid_command` 统计有效命令比例；`radius_height_satisfaction` 对两项参数逐项评分。预测 `CYL 2 3` 而目标为 `CYL 2 4`，可以语法有效且满足一项要求，但不是完整正确答案。

这体现了 [CADTests](https://arxiv.org/abs/2605.07807) 中“可执行与满足要求分开看”的思想，本章检查器远小于真实 CAD 属性测试体系。

## 可选：把合法命令交给 CadQuery

在已安装 CadQuery 的独立环境中，可以导出预测实体：

已有 Conda 时，可先按[官方安装说明](https://cadquery.readthedocs.io/en/latest/installation.html)建立环境：

```powershell
conda create -n myrsi-cad python=3.11 -y
conda activate myrsi-cad
conda install -c conda-forge cadquery
```

在新的 Conda 终端运行，不要沿用第一课为训练环境设置的 `python` 别名。进入同一实验目录后执行：

```powershell
python check_cad.py runs/sft-metrics.json --export-step runs/step
```

实际构造只允许以下固定操作，不使用 `eval` 或 `exec`：

```python
shape = cq.Workplane("XY").circle(radius).extrude(height)
cq.exporters.export(shape, "prediction.step")
```

安装与 API 参见 [CadQuery 官方 QuickStart](https://cadquery.readthedocs.io/en/latest/quickstart.html)。这里把数值按 CAD 环境约定解释，不用教学整数范围声称毫米级预测精度。

只有输出报告显示 `brep_export_executed: true`，才表示本次真的执行了 CadQuery 导出；普通属性检查会显示 false。环境验证范围见[评估课](./evaluation#verification-scope)，不能将命令检查说成已经验证 B-rep。

## 怎样逐步接近真实 CAD 数据

下一步扩展应一次改变一个环节：先增加几何或操作范围，再替换分词与模型，再引入真实数据。每次都重新核对数据分组、数值编码、执行失败如何计分。

不能直接把 `CYL` 标签替换成几百行 CAD 程序并沿用所有结论。真实流程需要更长序列、几何约束和表示设计；[CAD-Llama](/cad/cad-llama) 的结构化代码与 [CAD-Recode](/cad/cad-recode) 的可执行 CadQuery 路线，正好展示了不同选择。

[回到执行反馈](./feedback) · [查看评估与排错](./evaluation)
