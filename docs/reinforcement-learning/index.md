# 强化学习

> 从 Bellman 方程与价值估计开始，理解策略梯度，再深入 PPO 与 GRPO。


## 建议阅读路线

[信息论基础](/basics/probability) → [RL基础](/reinforcement-learning/algorithm-map) → [PPO](/reinforcement-learning/ppo) → [GRPO](/reinforcement-learning/grpo)。先理解优势与策略梯度，再比较 Critic 和组内奖励统计。

## PPO 与 GRPO 的关键区别

| 对比项 | PPO 的常见 Actor–Critic 实现 | 结果奖励 GRPO |
| --- | --- | --- |
| 优势来源 | 价值估计与 GAE | 同题多回答的组内奖励统计 |
| 价值网络 | 训练 Critic | 无需单独 Critic |
| 共同机制 | 新旧概率比、裁剪目标 | 新旧概率比、裁剪目标 |

此表概括本站两篇文章的教学配置，公式、适用条件和原始来源见各篇正文。

## 阅读目录

| 文章 | 主题 | 更新日期 |
| --- | --- | --- |
| [RL基础](/reinforcement-learning/algorithm-map) | RL基础 · 课程笔记 · 算法地图 | 2026-10-20 |
| [PPO：裁剪目标与语言模型训练](/reinforcement-learning/ppo) | PPO · 策略梯度 · Actor–Critic · RLHF | 2026-10-20 |
| [GRPO：组内相对优势与 PPO 对比](/reinforcement-learning/grpo) | GRPO · 组内优势 · PPO · 语言模型 | 2026-10-20 |
