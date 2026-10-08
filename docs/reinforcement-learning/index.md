# 强化学习

> RL基础沿用 sources 中的课程知识地图；高阶算法按你的选择接入 PPO 与 GRPO，参考 LLM Atlas 系列并注明原论文来源。

::: info 阅读状态
以下内容包含草稿与模板，尚未人工复核；资料整理和构建检查不代表学术正确性已验证。
:::


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

| 文章 | 标签 | 状态 | 更新日期 |
| --- | --- | --- | --- |
| [RL基础](/reinforcement-learning/algorithm-map) | RL基础 · 课程笔记 · 算法地图 | 草稿 · 待复核 | 2026-10-08 |
| [PPO：裁剪目标与语言模型训练](/reinforcement-learning/ppo) | PPO · 策略梯度 · Actor–Critic · RLHF | 草稿 · 待复核 | 2026-10-08 |
| [GRPO：组内相对优势与 PPO 对比](/reinforcement-learning/grpo) | GRPO · 组内优势 · PPO · 语言模型 | 草稿 · 待复核 | 2026-10-08 |
