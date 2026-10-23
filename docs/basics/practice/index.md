---
id: basic-practice-0001
title: CAD 论文技术实践
navTitle: 路线 · 从真实模型到 CAD 技术
category: basics
type: concept
tags:
- 技术实践
- 学习路线
prerequisites: []
related:
- basic-practice-0010
- basic-practice-0007
- cad-0103
- cad-0105
sources:
- https://github.com/rasbt/LLMs-from-scratch
- https://github.com/HandsOnLLM/Hands-On-Large-Language-Models
- https://github.com/datawhalechina/self-llm
- https://github.com/TinyLLaVA/TinyLLaVA_Factory
status: draft
reviewed: false
order: 30
created: '2026-10-22'
updated: '2026-10-23'
outline:
- 2
- 2
practiceGroup: start
---
# CAD 论文技术实践

<span id="技术实践-微调、对齐与-cad"></span>
<span id="按这个顺序动手"></span>
<span id="训练中到底改什么"></span>
<span id="参考了哪些-github-知识框架"></span>
<span id="从哪一步开始"></span>

读到一篇 CAD 论文时，我们既要知道模型用了哪些技术，也要知道这些技术在解决什么问题。这里先完成真实模型的推理与微调，再逐步拆开 CAD 表示、多模态输入、局部编辑、执行反馈和偏好学习。

第一次来，按下面的路线做；正在读论文，可以直接进入[论文—技术—实践地图](./paper-map)，找到对应的概念、实验和原始出处。

## 第一站：让真实模型跑起来

**[准备环境与样本](./setup) → [运行预训练模型](./inference) → [完成 LoRA 微调](./pretrained)。**

这一段使用 HuggingFaceTB/SmolLM2-135M-Instruct 的真实预训练权重。先记录它对输入的原始回答，再用少量“描述—目标命令”配对数据训练，最后在新进程加载适配器，比较同一组输入。模型以英文为主，第一轮使用受控英文描述。

入门任务是把 `make cylinder radius 2 height 4` 转成 `CYL 2 4`。这段短命令便于看见训练前后的变化；它是本站定义的数据格式。后续专题会采用各自合适的例子，不要求所有技术都围绕圆柱展开。

首次使用需要下载模型权重；教程默认 CPU，可按环境切换 CUDA。网络与内存条件见运行页；不需要付费推理 API。

## 第二站：沿论文学习关键技术

1. **[CAD 表示与序列生成](./representation)**：几何怎样变成模型能预测的对象？从命令与参数量化开始，理解潜向量和代码表示。
2. **[多模态输入与注意力](./multimodal)**：模型怎样读取文字、图像和点云？运行点采样、Fourier 特征和注意力实验，再理解连接器。
3. **[编辑：定位与补全](./editing)**：怎样只改要求修改的部分？用成对序列观察 LCS、mask 与补全目标。
4. **[执行反馈与工具](./feedback)**：怎样发现并修正生成错误？从逐项检查走到候选筛选、反馈循环与工具调用。
5. **[偏好学习与强化学习](./optimization)**：怎样利用好坏评价训练模型？先计算 DPO 目标，再连接 SFT、PPO 与 GRPO。

这些页面先给具体例子和可运行的机制实验，再引导阅读论文实现。机制实验的运行条件、训练与否、几何执行与否均在各页说明。它们帮助理解论文中的环节，不代表已经复现整篇方法。

## 想看清训练内部时

| 补充实验 | 适合什么时候打开 |
| --- | --- |
| [答案区损失与参数更新](./sft) | 训练跑起来了，想知道一个 token 怎样产生梯度 |
| [LoRA 低秩增量](./lora) | 想亲眼检查哪些权重改变、哪些保持不变 |
| [冻结解码器的连接器](./alignment) | 想理解冻结模型为什么仍能传递梯度 |
| [文本要求与几何检查](./text-cad) | 想区分命令正确、参数正确与实体正确 |
| [评估与排错](./evaluation) | 遇到 loss 不降、重载不一致、训练好而测试差 |

原有 CPU 小模型保留在这些补充实验中。可以在真实模型主线遇到疑问时按需阅读，不必先学完自写 Transformer 才开始微调。

## 从参考项目中学什么

主线采用 [self-llm](https://github.com/datawhalechina/self-llm)“环境、模型使用、微调”的顺序；概念与关键代码分步展开，参考 [LLMs-from-scratch](https://github.com/rasbt/LLMs-from-scratch)；每个专题配一个明确实验，参考 [Hands-On LLM](https://github.com/HandsOnLLM/Hands-On-Large-Language-Models) 的章节与 notebook 对应方式。

多模态模块结合 [TinyLLaVA Factory](https://github.com/TinyLLaVA/TinyLLaVA_Factory) 的编码器、连接器、语言模型划分。具体 CAD 方法回到各论文原文及作者实现。本站小实验另行编写，来源与实验范围在对应文章中说明。
