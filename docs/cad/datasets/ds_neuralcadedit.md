---
id: cad-data-ds_neuralcadedit
title: neuralCAD-Edit
category: cad
type: concept
tags:
  - 数据资源
  - ZIP
  - Mongita数据库
prerequisites: []
related: []
sources:
  - >-
    https://raw.githubusercontent.com/AutodeskAILab/neuralCAD-Edit/main/README.md
  - 'https://huggingface.co/datasets/autodesk/neuralCAD-Edit/raw/main/README.md'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-19'
cadRecord: true
---
# neuralCAD-Edit

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资源记录 · DS_neuralCADEdit · 版本与访问状态沿用材料记录，不代表整库已下载或已执行几何验证。

## 任务、格式与版本

- **任务入口**：[CAD编辑](/cad/tasks/editing)
- **格式**：ZIP · Mongita数据库 · STEP · F3D · 图像 · 视频/转录
- **规模**：192个编辑请求、384次编辑；编辑次数不是独立请求数
- **年份依据**：关联论文年份；不自动等于数据包首次公开时间
- **版本**：

## 官方入口与获取记录

- [原始来源 1](https://raw.githubusercontent.com/AutodeskAILab/neuralCAD-Edit/main/README.md)
- [原始来源 2](https://huggingface.co/datasets/autodesk/neuralCAD-Edit/raw/main/README.md)
- [原始来源 3](https://huggingface.co/datasets/autodesk/neuralCAD-Edit)

- **记录状态**：公开入口
- **资料核查日期**：2026-10-15
- **核查范围**：官方说明/数据卡核对；具体样本与端点检查另列
- **存储与获取**：官方未给出可靠总大小；先查看文件列表再分批获取

公开入口与许可条件分开判断；本轮未下载完整数据集或进行训练

## 许可、划分与来源


**数据许可**

数据CC BY-NC 4.0；代码MIT


**代码许可**

见官方仓库，代码与数据分开核查


**使用条件**

按此版本数据页和逐文件附带条件使用；本表为来源记录，不替代原条款


**官方划分**

以request分组保留评测协议；没有足够证据支持大规模训练划分


**分组单位**

原始CAD模型/设计文档


**泄漏检查**

同一模型的不同文本、视图、噪声和派生版本应留在同一数据组；另做几何近重复检查


**上游来源**

未记录。


**说明**

按原始模型标识保存来源，不把模态变体计作独立设计


## 最小使用方式


**使用步骤**

- 取数据ZIP，按官方config设置storage_dir，用visualise_examples.ipynb检查数据库。
- 以request连接输入、人工编辑、输出几何与评分，不把384 edits当384独立任务。
- 若比较新模型，按同一STEP/等距+六正交视图目录结构导出，再运行自动评价；人工/VLM评价单列。


**执行后端**

官方Mongita环境；CadQuery无界面转换或Fusion工具


**预期产物**

保留下载版本、文件清单、样本标识、划分及核查日志


## 已知限制

- 更适合独立评测，不能默认当训练集。
- Mongita记录与外置几何文件通过相对路径关联；只拷数据库会缺数据。

## 样例检查范围


样例文件或格式检查不等于 CAD 内核有效性检查，也不代表全部数据均可获取。

## 关联论文与问题

[neuralCAD-Edit](/cad/papers/per26) · [AgenticCADedit](/cad/papers/sin26b)

[I-C-01](/cad/issues/i-c-01) · [I-C-02](/cad/issues/i-c-02) · [I-G-02](/cad/issues/i-g-02)

[返回数据与评测资源](/cad/resources)
