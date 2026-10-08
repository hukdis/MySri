---
id: rl-0004
title: PPO：裁剪目标与语言模型训练
navTitle: PPO：裁剪策略优化
category: reinforcement-learning
type: concept
tags: [PPO, 策略梯度, Actor–Critic, RLHF]
prerequisites: [rl-0003, basic-0001]
related: [rl-0005]
sources:
  - https://zhoujx4.github.io/llm-atlas/rlhf/ppo
  - https://zhoujx4.github.io/llm-atlas/rlhf/training-loop
  - https://arxiv.org/abs/1707.06347
  - https://arxiv.org/abs/1506.02438
  - https://arxiv.org/abs/2203.02155
status: draft
reviewed: false
order: 12
created: '2026-10-08'
updated: '2026-10-08'
---

# PPO：裁剪目标与语言模型训练

::: info 高阶算法 · 待人工复核
主题参考 [LLM Atlas 的 PPO 系列](https://zhoujx4.github.io/llm-atlas/rlhf/ppo)，独立整理表述，公式依据原论文。手算与流程图为本站教学示例，不是实验结果。
:::

> **阅读目标**：理解概率比、优势和裁剪如何共同决定更新，再区分采样旧策略与 KL 参考策略。

## 前置知识与符号

先读 [RL基础中的策略梯度与 Actor–Critic](/reinforcement-learning/algorithm-map)，再用 [信息论基础](/basics/probability)复习 KL 散度。

| 符号 | 含义 | 一批数据内的变化 |
| --- | --- | --- |
| $\pi_\theta$ | 正在优化的策略 | 每次梯度更新后变化 |
| $\pi_{\mathrm{old}}$ | 生成这批样本时的策略 | 分母概率固定 |
| $\pi_{\mathrm{ref}}$ | 语言模型训练的参考策略 | 通常在本训练阶段固定 |
| $\hat A_t$ | 动作相对基线的优势估计 | 作为固定训练目标 |
| $V_\psi$ | Critic 的状态价值估计 | 随价值损失更新 |

在语言模型中，状态可以视为“提示词和已生成前缀”，动作是下一个 token。PPO 是通用策略优化方法；参考模型和奖励模型属于语言模型训练中的任务配置。

## 核心目标：为什么要比较新旧概率？

PPO-Clip 使用采样动作的新旧概率比：

$$
\rho_t(\theta)=
\frac{\pi_\theta(a_t\mid s_t)}
{\pi_{\mathrm{old}}(a_t\mid s_t)}.
$$

在本轮优化开始时，新旧策略相同，$\rho_t=1$。裁剪代理目标为：

$$
J_{\mathrm{clip}}(\theta)=
\hat{\mathbb E}_t\left[
\min\left(
\rho_t\hat A_t,\;
\operatorname{clip}(\rho_t,1-\epsilon,1+\epsilon)\hat A_t
\right)\right].
$$

这是要**最大化**的目标；若优化器最小化损失，策略损失取 $-J_{\mathrm{clip}}$。原始定义见 [PPO 论文第 3 节、式 (7)](https://arxiv.org/pdf/1707.06347)。

**由公式解释**：优势为正时，鼓励提高动作概率，但超过上侧阈值后该样本的目标不再增加；优势为负时，鼓励降低概率，但越过下侧阈值后不再获得更多改善。对使目标恶化的变化，未裁剪分支仍可发挥作用。

::: warning 裁剪的边界
裁剪发生在代理目标中，并没有把模型概率或参数强制限制在某个区间；共享参数和其他样本仍可能推动概率比越界。它也不是全局 KL 上界的保证。
:::

## 手算：正负优势分别裁哪一侧？

**本站示例**：设 $\epsilon=0.1$，区间为 $[0.9,1.1]$。只看一个样本的目标项：

| 优势 | 概率比 | 未裁剪项 | 裁剪项 | 最终取较小值 |
| --- | --- | --- | --- | --- |
| $+2$ | 1.3 | 2.6 | 2.2 | 2.2 |
| $-2$ | 0.7 | −1.4 | −1.8 | −1.8 |
| $+2$ | 0.7 | 1.4 | 1.8 | 1.4 |
| $-2$ | 1.3 | −2.6 | −2.2 | −2.6 |

**推导**：后两行保留了不利变化的惩罚。不能把所有越界样本都理解成“没有梯度”。

## Critic 如何给出优势？

常见 Actor–Critic 实现使用 GAE。以采样时的价值估计计算 TD 残差：

$$
\delta_t=r_t+\gamma V_{\mathrm{old}}(s_{t+1})
-V_{\mathrm{old}}(s_t),
\qquad
\hat A_t=\sum_{l=0}^{T-t-1}(\gamma\lambda)^l\delta_{t+l}.
$$

$\gamma$ 是折扣因子，$\lambda$ 调节多步残差的权重。真正终止的状态不再自举；时间截断是否自举要按任务边界处理。优势和价值目标在一批数据的优化阶段应保持固定。GAE 定义见 [Schulman 等人的原论文](https://arxiv.org/abs/1506.02438)。

价值网络可用固定回报目标拟合；例如取 $\hat R_t=\hat A_t+V_{\mathrm{old}}(s_t)$，最小化 $(V_\psi(s_t)-\hat R_t)^2$。这里展示基本结构，实际实现可能增加价值裁剪或熵奖励。

## 用于 RLHF：奖励与参考模型各做什么？

InstructGPT 使用监督微调、偏好奖励建模和 PPO 策略训练，并加入相对参考策略的 KL 惩罚。见 [InstructGPT 原论文第 3 节](https://arxiv.org/abs/2203.02155)。

一种便于理解的序列奖励写法是：

$$
R(x,y)=r_{\mathrm{task}}(x,y)
-\beta\sum_t\log
\frac{\pi_{\mathrm{old}}(y_t\mid x,y_{<t})}
{\pi_{\mathrm{ref}}(y_t\mid x,y_{<t})}.
$$

这是**采样阶段的教学写法**：任务分数可放在结束位置，KL 惩罚可逐 token 分配，再用于优势计算。某个样本的对数比可以为负；在对应策略分布下取期望才形成 KL。

**解释**：old 为本轮概率比提供分母，ref 为参考分布提供约束；两者承担不同作用。奖励模型评价回答，Critic 估计未来回报，不能混为一谈。也不应把“四个模型角色”理解为必须同时驻留四套独立权重。

## 一轮训练如何流动？

<MermaidDiagram title="PPO 一轮训练" caption="本站绘制：展示基本 Actor–Critic 数据流，具体调度依实现而定。" code='flowchart TD
A["提示词与本轮旧策略"] --> B["生成回答并缓存旧 logprob"]
B --> C["计算任务奖励、参考惩罚和价值"]
C --> D["固定优势与价值目标"]
D --> E["重算当前 logprob 和价值"]
E --> F["更新策略与 Critic"]
F --> G["有限次数复用本批数据"]
G --> E
G --> H["刷新采样策略，生成下一批"]' />

论文的基本循环是在旧策略采样后，进行多轮小批量优化，再刷新旧策略；见 [PPO 论文 Algorithm 1](https://arxiv.org/pdf/1707.06347)。本页采用同步流程说明，异步训练还需处理策略版本与数据滞后。

**阅读代码时检查**：旧 logprob 是否固定，优势是否停止梯度，响应与 padding 的 mask 是否正确，以及更新后的概率比与 KL 是否异常。训练奖励升高还需要独立评测确认任务效果。

## 自测与接着阅读

1. PPO 的概率比使用 old 还是 ref 作分母？
2. 优势为正、概率比低于下界时，目标是否已经封顶？
3. 奖励模型与 Critic 是否预测同一个量？

::: details 参考答案
1. 使用 old；ref 用于参考分布约束。
2. 没有。此时保留未裁剪项。
3. 奖励模型给出任务或偏好分数；Critic 估计状态价值，服务于优势估计。
:::

接着读 [GRPO：组内相对优势](/reinforcement-learning/grpo)，比较它如何替代 Critic。

## 参考来源

- **主题与阅读组织**：[LLM Atlas：PPO](https://zhoujx4.github.io/llm-atlas/rlhf/ppo)、[训练循环](https://zhoujx4.github.io/llm-atlas/rlhf/training-loop)。
- **裁剪目标**：[Schulman et al., Proximal Policy Optimization Algorithms, 2017](https://arxiv.org/abs/1707.06347)。
- **优势估计**：[Schulman et al., Generalized Advantage Estimation, 2015](https://arxiv.org/abs/1506.02438)。
- **语言模型应用**：[Ouyang et al., Training language models to follow instructions with human feedback, 2022](https://arxiv.org/abs/2203.02155)。
