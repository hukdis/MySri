---
id: rl-0005
title: GRPO：组内相对优势与 PPO 对比
navTitle: GRPO：组内相对优势
category: reinforcement-learning
type: concept
tags: [GRPO, 组内优势, PPO, 语言模型]
prerequisites: [rl-0003, basic-0001, rl-0004]
related: [rl-0004]
sources:
  - https://zhoujx4.github.io/llm-atlas/rlhf/grpo
  - https://zhoujx4.github.io/llm-atlas/rlhf/
  - https://arxiv.org/abs/2402.03300
  - https://huggingface.co/docs/trl/grpo_trainer
status: draft
reviewed: false
order: 13
created: '2026-10-08'
updated: '2026-10-08'
---

# GRPO：组内相对优势与 PPO 对比

::: info 高阶算法 · 待人工复核
主题参考 [LLM Atlas 的 GRPO 系列](https://zhoujx4.github.io/llm-atlas/rlhf/grpo)，公式对照 DeepSeekMath 原论文重新整理。本文讲解结果奖励版本；手算、解释与流程图为本站教学内容。
:::

> **阅读目标**：理解“同一道题多次采样”如何提供相对优势，明确省去 Critic 后仍然需要哪些计算。

## 前置知识与核心变化

先读 [PPO 的概率比与裁剪目标](/reinforcement-learning/ppo)，以及 [信息论基础中的 KL](/basics/probability)。

**原论文事实**：DeepSeekMath 提出 Group Relative Policy Optimization，用同一问题多个回答的奖励统计估计基线，省去单独的价值函数近似。结果奖励版本将归一化的回答奖励作为该回答各 token 的优势。见 [DeepSeekMath 第 4.1 节](https://arxiv.org/html/2402.03300v1)。

**解释**：PPO 常用 Critic 判断动作相对状态价值的好坏；GRPO 用同一提示词下的样本作比较。它仍然是策略梯度优化，也仍然需要采样与奖励信号。

## 一组回答如何变成优势？

对提示词 $x$，用旧策略采样 $G$ 个回答 $y_1,\ldots,y_G$，获得奖励 $R_1,\ldots,R_G$。定义组均值和标准差：

$$
\bar R=\frac1G\sum_{i=1}^G R_i,\qquad
s_R=\sqrt{\frac1G\sum_{i=1}^G(R_i-\bar R)^2}.
$$

结果奖励版本的优势写为：

$$
\hat A_{i,t}=\hat A_i=\frac{R_i-\bar R}{s_R+\eta}.
$$

这里明确采用总体标准差；$\eta>0$ 是数值稳定项，原论文式中未写该项。不同实现的标准差约定和零方差处理需要单独核对。

**由公式解释**：高于组均值的回答得到正优势，低于均值的回答得到负优势。组均值包含当前回答自身，不能据此直接宣称得到严格无偏的策略梯度。

## 手算：同样的奖励，在组内意味着什么？

**本站示例**：同一道题生成四个回答，奖励为 $[0,0,2,2]$。暂忽略 $\eta$：

$$
\bar R=1,\qquad s_R=1,\qquad
\hat A=[-1,-1,1,1].
$$

| 回答 | 奖励 | 相对优势 | 策略更新的方向 |
| --- | --- | --- | --- |
| 第 1、2 个 | 0 | −1 | 降低相应采样 token 的概率 |
| 第 3、4 个 | 2 | +1 | 提高相应采样 token 的概率 |

**推导**：若奖励都变为 2，则每项 $R_i-\bar R=0$，奖励部分没有相对优势信号。若保留 KL 正则，整体损失仍可能产生更新。全部正确与全部错误都可能出现零方差，所以平均奖励和零方差组比例应一起观察。

## 裁剪目标与参考 KL

令 $s_{i,t}=(x,y_{i,<t})$，$T_i$ 为回答长度：

$$
\rho_{i,t}=
\frac{\pi_\theta(y_{i,t}\mid s_{i,t})}
{\pi_{\mathrm{old}}(y_{i,t}\mid s_{i,t})}.
$$

将原论文的 token 级目标写成较紧凑的形式：

$$
C_{i,t}=
\min\left(
\rho_{i,t}\hat A_i,\;
\operatorname{clip}(\rho_{i,t},1-\epsilon,1+\epsilon)\hat A_i
\right),
$$

$$
J(\theta)=
\mathbb E_{x,\{y_i\}\sim\pi_{\mathrm{old}}}
\left[
\frac1G\sum_{i=1}^G\frac1{T_i}
\sum_{t=1}^{T_i}(C_{i,t}-\beta\hat k_{i,t})
\right].
$$

这里展示原始 GRPO 的按回答长度归一化形式，$\hat k_{i,t}$ 是相对参考策略的 KL 估计项。式 (3)、(4) 及结果奖励优势见 [DeepSeekMath 原论文](https://arxiv.org/html/2402.03300v1)。

**解释**：回答级优势可以沿 token 共享，但概率比仍是 token 级。最大化 $J$ 对应最小化 $-J$；$\epsilon$ 控制裁剪，$\beta$ 控制参考正则，它们不能相互替代。

### KL 估计的采样条件

原论文使用如下逐 token 形式：

$$
u_{i,t}=
\frac{\pi_{\mathrm{ref}}(y_{i,t}\mid s_{i,t})}
{\pi_\theta(y_{i,t}\mid s_{i,t})},
\qquad
\hat k_{i,t}=u_{i,t}-\ln u_{i,t}-1.
$$

**本站推导**：由 $\ln u\leq u-1$ 可知，该项非负。在固定状态、样本来自当前策略且分布支持条件满足时，它的期望等于当前策略到参考策略的 KL。

训练数据来自 old，多轮更新后 old 与当前策略可能不同，因此不能忽略采样分布而把有限批均值当成精确 KL。阅读实现时应检查重要性修正和复用数据的方式。

## 训练流程：省去 Critic 后还剩什么？

<MermaidDiagram title="GRPO 一轮训练" caption="本站绘制：结果奖励版本的基本数据流。" code='flowchart TD
A["一批提示词"] --> B["旧策略为每题生成 G 个回答"]
B --> C["奖励模型或规则评分"]
C --> D["逐题计算组均值、标准差与优势"]
D --> E["固定样本、旧 logprob 与优势"]
E --> F["重算当前 logprob 和参考项"]
F --> G["裁剪目标与 KL 正则"]
G --> H["更新策略并刷新下一轮采样"]' />

奖励可以由模型或任务规则提供。省去 Critic 不等于省去奖励、参考概率或组采样。模型角色、是否共享参数、是否使用参考项以及生成配置，都会影响实际资源开销。

本文按一轮内固定参考策略说明；原论文的迭代训练还会在外层刷新参考策略并更新奖励模型，应区分内层优化和外层迭代。

## PPO 与 GRPO 对照

| 维度 | 本站 PPO 页的基本实现 | 本页结果奖励 GRPO |
| --- | --- | --- |
| 优势来源 | Critic 与 GAE | 同题组内奖励统计 |
| 价值网络 | 训练价值估计 | 无需单独 Critic |
| 采样组织 | 采样轨迹后估计优势 | 每题组织多个回答 |
| 概率比 | 当前策略 / 采样旧策略 | 当前策略 / 采样旧策略 |
| 参考约束 | 常见做法是奖励中的 KL 惩罚 | 原始形式在目标中加入 KL 项 |
| 信号特点 | 依赖价值估计质量 | 依赖组内奖励差异 |
| 成本来源 | 策略、价值及相关前向计算 | 多回答生成及相关前向计算 |

**解释边界**：这里比较两种具体教学配置。PPO 不只对应一种优势估计，GRPO 也有过程奖励和后续变体；不能把表格当成所有实现的硬性规定，更不能推断显存必然减少一半。

## 实现与常见误解

当前 [TRL GRPOTrainer 官方文档](https://huggingface.co/docs/trl/grpo_trainer)提供多种 loss 和奖励归一化配置，其实现可能与原始公式不同。阅读代码时，至少记录以下配置：

- 每题采样数、采样温度、最大回答长度及截断处理。
- 标准差按组还是按批计算，是否启用奖励缩放。
- loss 按回答长度、有效 token 数还是常数归一化。
- 是否启用 KL、使用什么参考策略，以及旧 logprob 的缓存方式。

**由公式解释**：全组奖励相同会丢失奖励的相对学习信号；共享序列优势也不等于识别出每个 token 的真实贡献。训练奖励与独立任务评测应分别记录。

## 自测与相关阅读

1. 全组都得到相同奖励时，奖励优势是什么？
2. GRPO 中没有 Critic，是否说明无需生成多条回答？
3. 组内优势是序列级，概率比是否也必须为序列级？

::: details 参考答案
1. 减去组均值后为 0；保留 KL 时仍可能有正则更新。
2. 不成立。组采样就是相对统计的来源之一。
3. 不必。本页原始目标采用 token 级概率比。
:::

回看 [PPO](/reinforcement-learning/ppo)，或从 [强化学习总览](/reinforcement-learning/)重新选择阅读顺序。

## 参考来源

- **主题参考**：[LLM Atlas：GRPO](https://zhoujx4.github.io/llm-atlas/rlhf/grpo)、[RLHF 总览](https://zhoujx4.github.io/llm-atlas/rlhf/)。
- **算法原始来源**：[Shao et al., DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models, 2024](https://arxiv.org/abs/2402.03300)，第 4.1 节。
- **实现配置**：[Hugging Face TRL：GRPOTrainer](https://huggingface.co/docs/trl/grpo_trainer)，访问日期 2026-10-08；使用时按安装版本核对。
