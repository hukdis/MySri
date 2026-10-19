---
id: cad-data-ds_deepcad
title: DeepCAD
category: cad
type: concept
tags:
  - 数据资源
  - JSON
  - HDF5命令向量
prerequisites: []
related: []
sources:
  - 'https://raw.githubusercontent.com/rundiwu/DeepCAD/master/README.md'
  - 'https://raw.githubusercontent.com/rundiwu/DeepCAD/master/LICENSE'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-19'
cadRecord: true
---
# DeepCAD

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资源记录 · DS_DeepCAD · 版本与访问状态沿用材料记录，不代表整库已下载或已执行几何验证。

## 任务、格式与版本

- **任务入口**：[CAD生成](/cad/tasks/generation) · [CAD重建](/cad/tasks/reconstruction) · [CAD编辑](/cad/tasks/editing)
- **格式**：JSON · HDF5命令向量
- **规模**：论文常用约17.9万序列；实际可执行/预处理子集依版本过滤而变
- **年份依据**：关联论文年份；不自动等于数据包首次公开时间
- **版本**：

## 官方入口与获取记录

- [原始来源 1](https://raw.githubusercontent.com/rundiwu/DeepCAD/master/README.md)
- [原始来源 2](https://raw.githubusercontent.com/rundiwu/DeepCAD/master/LICENSE)
- [原始来源 3](https://github.com/rundiwu/DeepCAD)

- **记录状态**：公开入口
- **资料核查日期**：2026-10-15
- **核查范围**：官方说明/数据卡核对；具体样本与端点检查另列
- **存储与获取**：官方未给出可靠总大小；先查看文件列表再分批获取

公开入口与许可条件分开判断；本轮未下载完整数据集或进行训练

## 许可、划分与来源


**数据许可**

仓库MIT；原始模型来自Onshape，不能仅凭代码许可覆盖上游模型权利


**代码许可**

见官方仓库，代码与数据分开核查


**使用条件**

按此版本数据页和逐文件附带条件使用；本表为来源记录，不替代原条款


**官方划分**

使用作者train_val_test_split.json；预处理后保存未改变的原始模型归属


**分组单位**

原始CAD模型/设计文档


**泄漏检查**

同一模型的不同文本、视图、噪声和派生版本应留在同一数据组；另做几何近重复检查


**上游来源**

- DS_ABC


**说明**

README说明从ABC所列Onshape公共文档解析，不应将ABC和DeepCAD默认视为完全独立来源


## 最小使用方式


**使用步骤**

- 从作者data.tar或备份获取cad_json、cad_vec和原始划分，保持文件标识。
- 先读50个JSON，检查sketch/extrude历史；用官方json2vec.py核对向量格式。
- 如需点云，用dataset/json2pc.py先处理测试小样本，记录pythonocc版本与失败项。


**执行后端**

先检查文件与配对，再按官方环境准备CAD执行后端


**预期产物**

保留下载版本、文件清单、样本标识、划分及核查日志


## 已知限制

- 主要是草图与拉伸，不能代表全部CAD操作。
- 缺少天然的编辑指令三元组；DeepCAD衍生文本、编辑数据与它共享几何来源。

## 样例检查范围

- deepcad_archive：2026-10-15；endpoint_reachable；几何执行：未执行。

样例文件或格式检查不等于 CAD 内核有效性检查，也不代表全部数据均可获取。

## 关联论文与问题

[DeepCAD](/cad/deepcad)

[I-B-01](/cad/issues/i-b-01) · [I-B-02](/cad/issues/i-b-02) · [I-E-03](/cad/issues/i-e-03) · [I-F-03](/cad/issues/i-f-03)

[返回数据与评测资源](/cad/resources)
