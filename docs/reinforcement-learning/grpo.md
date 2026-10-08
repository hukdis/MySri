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

<MermaidDiagram title="GRPO 一轮训练" caption="本站绘制：结果奖励版本的基本数据流。" :compact="true" code='flowchart LR
 A["每题多次采样"] --> B["组内奖励统计"] --> C["裁剪与参考项"] --> D["更新策略"]' />

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

## 从组奖励到一次参数更新

### 一题一组，不能把不同题目随意混起来

**本站例题**：两道题分别得到奖励 $[0,0,2,2]$ 和 $[10,10,12,12]$。按每题独立统计，两组都得到优势 $[-1,-1,1,1]$。这反映各自题目内的相对好坏。

若将八个奖励合在一起求均值，均值为 6，第一题的回答会全部低于基线，第二题的回答全部高于基线。此时优化信号同时混入了题目奖励尺度差异，不再是原本的逐题相对比较。

**由公式推导**：忽略稳定项时，对一个组的全部奖励作 $R_i'=aR_i+b$、$a>0$，组内标准化优势保持不变。启用稳定项、改变缩放方式或混合不同奖励时，应重新核对这个性质的适用范围。

### 多种奖励先写清聚合方式

假设任务有答案正确性、格式和工具执行等评分，先定义奖励函数各自的取值范围，再说明权重与聚合步骤：

$$
R_i=\sum_{m=1}^{M}w_m r_m(x,y_i).
$$

这只是一个**本站教学配置**。按“先加权求和、再组内标准化”计算，与“每类奖励先标准化、再求和”一般不同。分数很大的奖励项可能主导前一种配置；后一种配置则改变各项对更新的相对贡献。

不要只记录总奖励。分别保存各奖励项，才能区分“答案变好了”和“格式分刷高了”。

### 有效 token、长度与梯度权重

原始目标先对一条回答的 $T_i$ 个 token 求平均，再对 $G$ 条回答求平均。若两条回答分别长 20 与 100 个 token，在相同优势、相同概率比下，每个 token 的目标权重分别包含 $1/20$ 与 $1/100$。

**由公式推导**：回答在外层平均中具有相同权重，但 token 的权重不同。改成全批有效 token 平均，就会改变长短回答之间的权重关系。这里描述的是目标中的加权，不能据此直接断言模型一定更偏好哪种长度。

[TRL 官方文档](https://huggingface.co/docs/trl/grpo_trainer)区分了多种 loss 与奖励缩放配置。实验记录应写出实际配置和版本，而不仅写“使用 GRPO”。

### 最小训练伪代码

~~~python
# 同一提示词的回答要保留共同 group_id
batch = sample_groups(policy, prompts, group_size)
rewards = evaluate_reward(batch)
advantage = normalize_within_prompt(rewards, batch.group_id)
old_logprob = batch.old_logprob.detach()
advantage = advantage.detach()

for minibatch in finite_reuse(batch):
    new_logprob = forward_policy(minibatch)
    ratio = exp(new_logprob - old_logprob[minibatch.indices])
    token_advantage = broadcast_sequence_advantage(advantage[minibatch.indices], minibatch)
    surrogate = min(
        ratio * token_advantage,
        clamp(ratio, 1 - epsilon, 1 + epsilon) * token_advantage,
    )
    reference_term = estimate_reference_kl(minibatch)
    # 本页对应原始按回答长度归一化版本
    loss = -mean_of_response_means(surrogate - beta * reference_term, minibatch.mask)
    optimize(loss)
~~~

以上是结构示例：各缓存量须按同一索引取出，padding 不参与求均值，组统计在进入小批量更新前计算完成。新 logprob 需要梯度，旧 logprob 和优势不应随学习阶段的参数更新变化。

## 哪些组值得重点检查？

| 情况 | 公式中的信号 | 需要进一步核查 |
| --- | --- | --- |
| 全部正确或全部错误 | 奖励差为 0 | 题目难度、采样多样性、评分器区分能力 |
| 大部分相同，少数异常高分 | 少数回答获得较大相对优势 | 高分是否源于有效解答或奖励漏洞 |
| 正确性升高但总奖励下降 | 多奖励聚合可能在起作用 | 各奖励项尺度与权重 |
| 长回答占比不断增加 | 生成与加权配置可能影响行为 | 长度分布、截断率、实际正确率 |
| 多轮复用后比值变化很大 | 当前策略远离采样时策略 | 更新次数、学习率、旧样本滞后 |

**解释**：零方差组并不是“无用题目”的充分证据，也不等于必须删除；应结合实际成功率及采样配置判断。组内优势只能比较已经生成的回答，未采样到的解法不会自动提供训练信号。

## 结果奖励和过程奖励应分开理解

本页主要讨论每条回答得到一个最终分数的版本。如果每个推理步骤都有评分，token 的优势可以由后续步骤的归一化奖励累积构成：

$$
\hat A_{i,t}=\sum_{j:\,e_j\geq t}\widetilde r_{i,j},
$$

其中 $e_j$ 是步骤 $j$ 的结束位置。此时同一回答的不同 token 不一定共享完全相同的优势。该区别见 [DeepSeekMath 第 4.1.2–4.1.3 节](https://arxiv.org/html/2402.03300v1)；过程评分如何获得、是否可靠，仍需单独说明。

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
