---
id: cad-data-ds_drawing2cad
title: CAD-VGDrawing / Drawing2CAD
category: cad
type: concept
tags:
  - 数据资源
  - SVG
  - NPY图纸向量
prerequisites: []
related: []
sources:
  - 'https://raw.githubusercontent.com/lllssc/Drawing2CAD/main/README.md'
  - 'https://raw.githubusercontent.com/lllssc/STEP2SVG-Pipeline/main/README.md'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-19'
cadRecord: true
---
# CAD-VGDrawing / Drawing2CAD

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资源记录 · DS_Drawing2CAD · 版本与访问状态沿用材料记录，不代表整库已下载或已执行几何验证。

## 任务、格式与版本

- **任务入口**：[CAD重建](/cad/tasks/reconstruction)
- **格式**：SVG · NPY图纸向量 · HDF5 CAD向量
- **规模**：本轮原README未确认归档总模型数；四视图不作为四个独立模型
- **年份依据**：关联论文年份；不自动等于数据包首次公开时间
- **版本**：

## 官方入口与获取记录

- [原始来源 1](https://raw.githubusercontent.com/lllssc/Drawing2CAD/main/README.md)
- [原始来源 2](https://raw.githubusercontent.com/lllssc/STEP2SVG-Pipeline/main/README.md)
- [原始来源 3](https://github.com/lllssc/Drawing2CAD)

- **记录状态**：公开入口
- **资料核查日期**：2026-10-15
- **核查范围**：官方说明/数据卡核对；具体样本与端点检查另列
- **存储与获取**：官方未给出可靠总大小；先查看文件列表再分批获取

公开入口与许可条件分开判断；本轮未下载完整数据集或进行训练

## 许可、划分与来源


**数据许可**

仓库许可与底层DeepCAD条件分开核对，未将全数据默认声明为同一许可


**代码许可**

见官方仓库，代码与数据分开核查


**使用条件**

按此版本数据页和逐文件附带条件使用；本表为来源记录，不替代原条款


**官方划分**

沿用DeepCAD原模型归属，四视图及派生PNG必须在同一组


**分组单位**

原始CAD模型/设计文档


**泄漏检查**

同一模型的不同文本、视图、噪声和派生版本应留在同一数据组；另做几何近重复检查


**上游来源**

- DS_DeepCAD


**说明**

按原始模型标识保存来源，不把模态变体计作独立设计


## 最小使用方式


**使用步骤**

- 从作者Drive取svg_raw、svg_vec和cad_vec，按模型ID检查配对。
- 保留Front/Top/Right/FrontTopRight视图顺序；SVG转PNG用CairoSVG并固定尺寸和背景。
- 自建图纸可用STEP2SVG：FreeCAD导出→normalize.py→reorder.py；此官方导出流程需要可见GUI，不应称为无界面批处理。


**执行后端**

官方FreeCAD GUI导出、SVG处理与DeepCAD表示


**预期产物**

保留下载版本、文件清单、样本标识、划分及核查日志


## 已知限制

- 数据来自DeepCAD，与其训练集并非天然独立。
- 简化/重排SVG的顺序是表示选择；栅格扫描标注识别属于另一个任务。

## 样例检查范围


样例文件或格式检查不等于 CAD 内核有效性检查，也不代表全部数据均可获取。

## 关联论文与问题

[Drawing2CAD](/cad/papers/qin25)

[I-B-01](/cad/issues/i-b-01)

[返回数据与评测资源](/cad/resources)
