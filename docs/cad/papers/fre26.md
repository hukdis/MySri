---
id: cad-ref-fre26
title: CodeCAD · 人类编写OpenSCAD程序
category: cad
type: paper
tags:
  - 论文资料记录
prerequisites: []
related: []
sources:
  - 'https://doi.org/10.1145/3770855.3817592'
  - 'https://api.crossref.org/works/10.1145%2F3770855.3817592'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# CodeCAD · 人类编写OpenSCAD程序


## 论文信息

- **全名**：CodeCAD: A Parametric CAD Dataset for Programmatic 3D Model Generation
- **作者**：David Fresacher、Klaus Diepold
- **论文时间**：2026-08-08（正式/机构年份记录）
- **正式发表记录**：2026-08-08；Proceedings of the 32nd ACM SIGKDD Conference on Knowledge Discovery and Data Mining V.2

## 任务定位

研究任务：共用基础。

人类编写可读OpenSCAD程序的数据资源。

## 方法与贡献

- 针对可读参数化CAD程序稀缺的问题，整理人类编写的OpenSCAD模型及描述、渲染、许可元数据，并进行语法、语义、去重和质量处理。它为文本到程序生成提供真实代码资源，区别于只含固定草图拉伸操作的命令序列数据。论文摘要的9.5万余模型与当前v2仓库76,047模型属于不同口径，使用时需锁定版本和逐模型许可，OpenSCAD程序也不等于原生B-Rep历史。

## 技术要点

- **输入**：文本 · 图像

- **表示**：OpenSCAD

- **对象**：零件

- **要求**：可执行性

## 关联资源与问题

资源：[CodeCAD（v2）](/cad/datasets/ds_codecad)。

## 参考文献

- [原始来源 1](https://doi.org/10.1145/3770855.3817592)
- [原始来源 2](https://api.crossref.org/works/10.1145%2F3770855.3817592)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
