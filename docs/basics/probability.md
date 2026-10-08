---
id: basic-0001
title: 信息论基础：熵、交叉熵与 KL 散度
navTitle: 信息论基础
category: basics
type: concept
tags: [信息论, 熵, 交叉熵, KL散度, 困惑度]
prerequisites: []
related: [rl-0003]
sources:
  - https://zhoujx4.github.io/llm-atlas/guide/info-theory
  - https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf
  - https://docs.pytorch.org/docs/2.14/generated/torch.nn.CrossEntropyLoss.html
  - https://docs.pytorch.org/docs/2.14/generated/torch.nn.KLDivLoss.html
  - https://huggingface.co/docs/transformers/perplexity
  - https://arxiv.org/abs/1503.02531
status: draft
reviewed: false
order: 1
created: '2026-10-07'
updated: '2026-10-08'
---

# 信息论基础：熵、交叉熵与 KL 散度

::: info 内容来源 · 待人工复核
按 [LLM Atlas「信息论基础」](https://zhoujx4.github.io/llm-atlas/guide/info-theory)的主题范围重新编写，覆盖信息量、熵、交叉熵、KL 散度和困惑度。定义与应用另附原始论文和官方文档；例题为本站推导。
:::

## 先看这些量分别回答什么

| 概念 | 回答的问题 | 需要的分布 |
| --- | --- | --- |
| 信息量 | 某个结果出现时，提供多少信息？ | 结果的概率 |
| 熵 | 一个分布平均有多少不确定性？ | 分布 $p$ |
| 交叉熵 | 按 $p$ 出现的数据，用 $q$ 预测的平均代价是多少？ | 目标 $p$、预测 $q$ |
| KL 散度 | 分布偏离带来多少额外代价？ | 有方向的 $p$ 与 $q$ |
| 困惑度 | 平均负对数似然取指数后是多少？ | 模型对评测序列的条件概率 |

下文讨论离散分布：$p_i,q_i\geq0$，且各自的概率和为 1。使用 $\log_2$ 时单位为 bit；使用自然对数 $\ln$ 时单位为 nat，$1\,\mathrm{nat}=1/\ln2\,\mathrm{bit}$。对数底决定单位，参见 [Shannon 原论文，第 1 节](https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf)。

## 1. 信息量与熵：从一次结果到平均值

概率为 $p_i$ 的结果，其自信息为：

$$
I(i)=-\log_2p_i.
$$

概率为 $1/8$ 时，信息量为 3 bit；概率为 1 时，信息量为 0。越难预先确定的结果，出现后提供的信息量越大。

熵是自信息在分布 $p$ 下的期望：

$$
H_2(p)=\mathbb{E}_{i\sim p}[I(i)]=-\sum_i p_i\log_2p_i.
$$

约定 $0\log0=0$。对于 $K$ 个可能结果，$0\leq H_2(p)\leq\log_2K$；确定性分布达到下界，均匀分布达到上界。这些性质见 [Shannon 原论文，第 6 节](https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf)。

**解释**：熵描述整个分布的不确定性。预测熵小，说明模型输出更集中；是否正确，还需要对照目标结果。

## 2. 交叉熵：用预测分布评价目标数据

设 $p$ 为目标分布，$q$ 为预测分布。交叉熵用 $p$ 加权，用 $q$ 计算对数代价：

$$
H_2(p,q)=-\sum_i p_i\log_2q_i.
$$

分类样本的标签为 $y$ 时，独热目标仅在 $y$ 处为 1。使用自然对数，损失简化为：

$$
\ell=-\ln q_y.
$$

提高正确类别的预测概率，会降低这条样本的损失。软标签则保留多个类别的概率权重。这两类目标都可用于交叉熵，见 [PyTorch CrossEntropyLoss](https://docs.pytorch.org/docs/2.14/generated/torch.nn.CrossEntropyLoss.html)。

::: tip 实现时注意
PyTorch 的 CrossEntropyLoss 接收未经 softmax 的 logits，并在内部处理对数概率。软标签需要满足非负且总和为 1 的概率约束。
:::

## 3. KL 散度：交叉熵中多出来的部分

从 $p$ 到 $q$ 的 KL 散度定义为：

$$
D_{\mathrm{KL},2}(p\Vert q)=\sum_i p_i\log_2\frac{p_i}{q_i}.
$$

由定义直接整理：

$$
\begin{aligned}
D_{\mathrm{KL},2}(p\Vert q)
&=\sum_i p_i\log_2p_i-\sum_i p_i\log_2q_i\\
&=H_2(p,q)-H_2(p).
\end{aligned}
$$

所以三个量的关系是：

$$
\boxed{H_2(p,q)=H_2(p)+D_{\mathrm{KL},2}(p\Vert q)}.
$$

KL 散度非负，两个分布相同时为 0；一般不满足对称性，因此不能当作普通距离。如果某项 $p_i>0$ 而 $q_i=0$，交叉熵和 KL 散度为无穷大。

**推导结论**：目标分布 $p$ 固定时，$H(p)$ 与预测模型参数无关，最小化交叉熵等价于最小化这个方向的 KL。交换 $p,q$ 会改变目标。

逐项定义见 [PyTorch KLDivLoss](https://docs.pytorch.org/docs/2.14/generated/torch.nn.KLDivLoss.html)。该接口的 input 使用对数概率，target 默认使用概率；参数位置需要与数学式中的分布对应。

## 4. 算一遍：同一组分布的三个量

**本站例题**：目标与预测分别为

$$
p=\left(\frac12,\frac14,\frac14\right),\qquad
q=\left(\frac13,\frac13,\frac13\right).
$$

| 量 | 计算 | 结果 |
| --- | --- | --- |
| 目标熵 $H_2(p)$ | $\frac12\times1+\frac14\times2+\frac14\times2$ | 1.5 bit |
| 交叉熵 $H_2(p,q)$ | 每项预测概率均为 $1/3$ | $\log_2 3\approx1.585$ bit |
| KL 散度 | 交叉熵减去目标熵 | 约 0.085 bit |

**解释**：目标分布自身有 1.5 bit 的熵；使用均匀预测，增加了约 0.085 bit 的平均代价。若改为 $q=p$，交叉熵为 1.5 bit，KL 为 0。

## 5. 困惑度：语言模型的平均预测代价

长度为 $T$ 的评测序列中，自回归模型使用前文预测当前 token。平均负对数似然与困惑度分别为：

$$
L=-\frac1T\sum_{t=1}^{T}\ln q_\theta(x_t\mid x_{<t}),
\qquad \mathrm{PPL}=e^L.
$$

若平均交叉熵使用以 2 为底的对数，则使用 $\mathrm{PPL}=2^{H_2}$，其中 $H_2$ 指同一批有效预测位置的平均交叉熵。

**本站推导**：每个评测位置的正确 token 概率均为 $1/4$ 时，$L=\ln4$、PPL 为 4。一般情况下，PPL 为 4 并不意味着每个位置都有四个等概率候选。

PPL 用于评价自回归语言模型；比较时要对齐评测数据、分词方式及上下文处理方式。它不能直接替代问答正确率或任务评价。定义与评测条件见 [Hugging Face 困惑度文档](https://huggingface.co/docs/transformers/perplexity)。

## 6. 训练中如何使用这些概念

| 场景 | 分布或目标 | 阅读公式时关注什么 |
| --- | --- | --- |
| 分类与监督微调 | 已知标签、模型预测 | 正确标签的负对数概率 |
| 知识蒸馏 | 教师软标签、学生预测 | 对齐教师分布的交叉熵或 KL |
| 策略约束 | 当前策略、参考策略 | KL 的方向、求期望的分布及约束系数 |

蒸馏使用教师提供的软目标，是 [Hinton 等人的原始论文](https://arxiv.org/abs/1503.02531)中的核心做法。**由恒等式推导**：固定教师、输入和温度时，教师熵对学生参数仍是常数，因此软目标交叉熵与教师到学生的 KL 具有相同的学生参数梯度。

策略约束的具体目标取决于算法；课程学习继续见 [RL基础](/reinforcement-learning/algorithm-map)。

## 自测：能否区分目标与预测？

1. 目标分布固定时，交叉熵与 KL 为什么有相同的优化目标？
2. 预测分布非常集中，是否足以说明模型正确？
3. 平均负对数似然为 $\ln5$ 时，困惑度是多少？

::: details 参考答案
1. 两者只相差与预测模型参数无关的目标熵 $H(p)$。
2. 不足以。集中程度反映预测熵，正确性还需要对照目标。
3. PPL 为 $e^{\ln5}=5$。比较模型前，还要确认评测条件一致。
:::

## 来源与延伸阅读

- **主题参考**：[LLM Atlas：信息论基础](https://zhoujx4.github.io/llm-atlas/guide/info-theory)。本文使用独立表述与自拟例题。
- **熵与信息单位**：[Shannon, A Mathematical Theory of Communication, 1948](https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf)。
- **损失定义与接口**：[CrossEntropyLoss](https://docs.pytorch.org/docs/2.14/generated/torch.nn.CrossEntropyLoss.html)、[KLDivLoss](https://docs.pytorch.org/docs/2.14/generated/torch.nn.KLDivLoss.html)。
- **语言模型评测**：[Hugging Face：Perplexity of fixed-length models](https://huggingface.co/docs/transformers/perplexity)。
- **知识蒸馏**：[Hinton, Vinyals & Dean：Distilling the Knowledge in a Neural Network, 2015](https://arxiv.org/abs/1503.02531)。
