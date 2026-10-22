---
id: basic-practice-0001
title: 技术实践：微调、对齐与 CAD
navTitle: 技术实践 · 学习路线
category: basics
type: concept
tags: [技术实践, 学习路线]
prerequisites: []
related: [cad-0102, cad-0105, cad-0103]
sources:
  - https://github.com/rasbt/LLMs-from-scratch
  - https://github.com/HandsOnLLM/Hands-On-Large-Language-Models
  - https://github.com/datawhalechina/self-llm
  - https://github.com/TinyLLaVA/TinyLLaVA_Factory
status: draft
reviewed: false
order: 30
created: '2026-10-22'
updated: '2026-10-22'
outline: [2, 2]
---
# 技术实践：微调、对齐与 CAD

知道“用了 LoRA”和真的看懂训练之间，还差几个具体环节：样本怎样进入模型，答案怎样变成损失，哪些参数得到梯度，以及模型是否真的利用了输入。本章用一组小实验把这些环节连起来，再迁移到真实预训练模型。

**贯穿任务**：把“生成半径为 2、高度为 4 的圆柱”转成 `CYL 2 4`。先学习文字条件，再把合成点云接到同一个解码器，最后分别检查语法、参数和实体。`CYL` 是本章自定义的教学命令，完整操作范围只有圆柱；小模型实验不代表论文复现或工业 CAD 能力。

## 按这个顺序动手

| 课程 | 实际动手做什么 | 需要看懂的结果 |
| --- | --- | --- |
| [环境与数据](./setup) | 建环境，检查 JSONL 与几何划分 | 一条样本如何变成输入和目标 |
| [监督微调与损失](./sft) | 运行可控小模型，检查答案掩码 | 预测错哪里、哪些位置计算损失 |
| [LoRA 与冻结](./lora) | 只训练低秩增量，对比全量更新 | 参数量、梯度与冻结权重是否一致 |
| [多模态连接](./alignment) | 从合成点云提取特征，只训练连接器 | 输入特征怎样影响 CAD token |
| [文本与 CAD 对应学习](./text-cad) | 按几何分组留出，检查参数与导出 | 可执行与符合文本有什么区别 |
| [迁移到预训练模型](./pretrained) | 用 Transformers + PEFT 运行 LoRA 配方 | 聊天模板、保存与重新加载 |
| [评估与排错](./evaluation) | 对照消融、样本预测与梯度记录 | 区分跑通、记忆与泛化 |

主线实验只用 PyTorch 和合成数据，默认 CPU，不下载模型权重，也不调用收费 API。预训练模型课程另有显式下载步骤；STEP 导出需要独立的 CadQuery 环境。每一课都将这些条件写在运行入口附近。

## 训练中到底改什么

| 实验 | 输入 → 输出 | 更新参数 | 优化信号 |
| --- | --- | --- | --- |
| SFT | 文本 → `CYL r h` | 教学语言模型全部参数 | 答案 token 的交叉熵 |
| LoRA | 同上 | 线性层的 A、B 增量 | 同一答案损失 |
| 连接器 | 点云 → 几何特征 → 软前缀 → 命令 | 连接器；语言模型冻结 | 经过冻结解码器回传的答案损失 |
| 预训练迁移 | 聊天模板文本 → 命令 | PEFT 注入的 LoRA 参数 | 模型内部计算的因果语言损失 |

“对齐”在这里有明确含义：数据层面让同一对象的文字、点云和命令配对；模型层面学习让条件特征有助于目标命令预测。它与把两个点云坐标系配准、让输出符合人类偏好不是同一个操作。

## 参考了哪些 GitHub 知识框架

先检索再组织本章，以下是截至 **2026-10-22** 阅读各仓库 README 后采用的结构。借鉴的是教学顺序与模块拆分，本章代码和圆柱数据另行编写。

| GitHub 项目 | 可借鉴的组织方式 | 在本章中的落点 |
| --- | --- | --- |
| [LLMs-from-scratch](https://github.com/rasbt/LLMs-from-scratch) | 从文本、注意力到模型与指令微调，附 LoRA | 先看小模型内部，再接真实权重 |
| [Hands-On LLM](https://github.com/HandsOnLLM/Hands-On-Large-Language-Models) | 概念章节对应 notebook，多模态与微调各有章节 | 每课配可执行入口和结果检查 |
| [self-llm](https://github.com/datawhalechina/self-llm) | 先环境、部署使用，再微调 | 环境与推理检查放在训练之前 |
| [llm-course](https://github.com/mlabonne/llm-course) | 区分基础、训练研究与应用工程 | 只保留当前训练链路所需知识 |
| [TinyLLaVA Factory](https://github.com/TinyLLaVA/TinyLLaVA_Factory) | 分开语言模型、视觉塔、连接器与训练配置 | 单独验证冻结语言模型的连接器 |
| [llm-action](https://github.com/liguodongiot/llm-action) | 微调原理与实战代码对应 | 把参数、数据与运行命令对应起来 |

这些框架覆盖面和运行条件不同；本章选择的小任务，是为了让初次实践能够看见每一步发生了什么，不以仓库规模或模型排名作为学习顺序。

## 从哪一步开始

没有训练经验，先进入[环境与数据](./setup)。已经能运行 PyTorch，也建议读完[答案区损失](./sft#answer-loss)：后面的 LoRA、多模态连接和真实模型配方都依赖它。

完成实验后，再回到 [Text2CAD](/cad/text2cad#technical-primer)、[CAD-Llama](/cad/cad-llama#technical-primer)、[CAD-MLLM](/cad/cad-mllm#technical-primer)，比较真实论文多出了哪些数据、表示和模型约束。
