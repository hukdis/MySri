---
id: basic-practice-0015
category: basics
type: concept
tags:
- 技术实践
prerequisites:
- basic-practice-0007
- basic-practice-0014
related:
- cad-0106
- rl-0004
- rl-0005
sources:
- https://arxiv.org/abs/2305.18290
- https://arxiv.org/abs/2505.22304
- https://github.com/eric-mitchell/direct-preference-optimization
created: '2026-10-23'
title: 从标准答案到偏好与奖励
navTitle: 偏好学习与强化学习
practiceGroup: papers
order: 46
status: draft
reviewed: false
updated: '2026-10-23'
outline:
- 2
- 2
---
# 从标准答案到偏好与奖励

完成 SFT 后，还会遇到一个问题：同一输入有多个候选，怎样让模型更倾向于产生有用的那个？先看训练数据提供了什么信号，再区分偏好优化、奖励优化和推理时筛选。

## 四种信号怎样区分

| 方法 | 训练或选择依据 | 是否更新参数 |
| --- | --- | --- |
| SFT | 输入与目标答案 | 是，提升目标答案概率 |
| DPO | 同一输入的优选与劣选回答 | 是，优化相对参考模型的偏好目标 |
| PPO / GRPO | 采样输出及奖励、优势等统计 | 是，按各自策略目标更新 |
| 测试时筛选 | 当前候选的执行或评价分数 | 通常只选择候选 |

评价函数提供一个数值，还不等于系统已经采用强化学习。应继续查它有没有进入可训练目标、怎样采样，以及优化器更新了谁。

## 先理解 DPO 的一对回答 {#dpo}

给定同一份错误程序与观察，反馈 A 准确指出槽数问题并定位循环；反馈 B 只泛泛地说“模型有误”。如果按明确标准将 A 标为优选、B 标为劣选，就得到一条偏好样本 `(x, y_w, y_l)`。

偏好标注的依据可能来自人工或修复效果，必须记录。这个例子只是说明数据结构；CADReview 的偏好构造及反馈训练参照[其原文 §4](https://arxiv.org/abs/2505.22304)。

## 运行一个 DPO 目标的数值例子

```powershell
python paper_tech.py preference
```

脚本固定参考模型对优选、劣选回答的序列 log 概率，再比较三种策略模型：与参考相同、更偏向优选、更偏向劣选。这里的概率是手写演示数值，没有从真实模型测量。

$$
\ell=-\log\sigma\left(\beta\left[
\log\pi_\theta(y_w\mid x)-\log\pi_\theta(y_l\mid x)
-\log\pi_{\rm ref}(y_w\mid x)+\log\pi_{\rm ref}(y_l\mid x)
\right]\right).
$$

<<< ../../../examples/technical-practice/paper_tech.py#preference

相对参考模型更偏向优选，损失会下降；若相对差异为零，损失为 `log(2)`。代码使用稳定的 softplus 写法避免数值溢出。完整公式与假设来源见 [DPO 原论文](https://arxiv.org/abs/2305.18290)。

真实训练需要对两份回答计算序列 log 概率，把损失反传给策略模型，并保持参考模型冻结。本站这个标量实验只解释目标，还没有执行完整 DPO 微调。若接入长代码，要核对回答掩码、序列长度和偏好数据质量。

## PPO 与 GRPO 又多了哪些环节

PPO 的常见 Actor–Critic 实现利用价值估计与优势，约束新旧策略的更新。结果奖励 GRPO 则按同一问题采样多个回答，用组内奖励统计构造相对优势。具体目标、KL 和实现差异分别见本站 [PPO](/reinforcement-learning/ppo)与 [GRPO](/reinforcement-learning/grpo)。

应用到 CAD 时，首先需要定义奖励：程序能否执行、哪些要求满足、是否保留已有结构、代价如何计算。若奖励只覆盖程序运行，模型可能学会容易执行却不满足设计的程序。

这些是连接 CAD 任务与策略优化的学习问题，不表示本站九篇论文都采用 PPO 或 GRPO。判断某篇方法时，以其原文训练目标和实现为准。

## 下一步怎样选择实验

刚完成 LoRA，先理解单条标准答案怎样贡献损失；读 CADReview 时，再看成对偏好怎样改变反馈生成器。只有具备可靠评价和足够计算条件后，才考虑完整策略优化实验。

继续学习可以从 [DPO 作者项目](https://github.com/eric-mitchell/direct-preference-optimization)的训练流程入手，或对照现有强化学习章节。完整训练的数据、资源和效果需要另行验证，本页不提供虚构的 CAD 奖励实验成绩。

[返回论文技术地图](./paper-map) · [遇到问题：评估与排错](./evaluation)
