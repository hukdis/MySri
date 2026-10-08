# CAD · 从表示到验证

> 按研究问题浏览 9 篇已接入的论文；每篇正文沿用 source 阅读稿结构，并恢复原论文图表截图。

::: info 阅读状态
内容待人工复核，比较表不构成统一性能排名。截图保留原图注、页码与论文出处；原 PDF 不发布。
:::

## 按问题浏览

### 表示基础

CAD 的建模过程怎样变成可学习的表示？

| 论文 | 先抓住这一点 |
| --- | --- |
| [DeepCAD](/cad/deepcad) | 让生成结果保留可执行的 CAD 建模步骤。 |

### 条件生成

文本或多模态信息怎样进入生成器？

| 论文 | 先抓住这一点 |
| --- | --- |
| [Text2CAD](/cad/text2cad) | 从不同详细程度的自然语言描述生成 CAD。 |
| [CAD-Llama](/cad/cad-llama) | 将部件语义与 CAD 代码组织为语言模型可学习的语料。 |
| [CAD-MLLM](/cad/cad-mllm) | 在同一生成模型中接入文本、图像和点云条件。 |

### 几何重建

观察到的表面怎样恢复为建模程序？

| 论文 | 先抓住这一点 |
| --- | --- |
| [CAD-Recode](/cad/cad-recode) | 把表面点云恢复为可执行的建模程序。 |

### 指令编辑

已有模型怎样按要求修改并保留其余部分？

| 论文 | 先抓住这一点 |
| --- | --- |
| [CAD-Editor](/cad/cad-editor) | 按编辑指令局部修改已有 CAD 序列。 |

### 反馈与评测

怎样发现错误、修复模型并检查要求？

| 论文 | 先抓住这一点 |
| --- | --- |
| [CADReview](/cad/cadreview) | 定位 CAD 程序错误，再产生反馈与修正。 |
| [CADTests](/cad/cadtests) | 用可执行测试检查 CAD 是否满足文字要求。 |
| [CAD-Assistant](/cad/cad-assistant) | 让视觉语言模型通过工具与 CAD 环境交互。 |

## 横向比较：输入、输出与表示

同一论文可能有多个任务；这里标出主线与必要例外。各行链接进入对应阅读稿与原论文出处。

| 论文 | 输入 | 输出 | CAD 表示 | 模型的作用 |
| --- | --- | --- | --- | --- |
| [DeepCAD](/cad/deepcad) | CAD 序列／随机噪声；点云为下游任务 | 草图–拉伸序列 → 实体 | 带参数的操作序列 | Transformer 自编码器与潜空间 GAN；未使用预训练 LLM |
| [Text2CAD](/cad/text2cad) | 自然语言描述 | 草图–拉伸序列 → 实体 | 参数化命令序列 | VLM/LLM 用于数据标注；生成器为 BERT + Transformer |
| [CAD-Llama](/cad/cad-llama) | 文本／指定 CAD 任务 | SPCC 参数化建模代码 | 整体描述、部件描述与代码的层次表示 | LLaMA3 领域适配预训练 + LoRA 指令微调 |
| [CAD-Recode](/cad/cad-recode) | 三维点云 | CadQuery Python → B-rep 实体 | 可执行 CadQuery 程序 | 点云投影接入 Qwen2 小型代码模型 |
| [CAD-MLLM](/cad/cad-mllm) | 文本、图像、点云及其组合 | 草图–拉伸序列 → 实体 | 参数化 CAD 命令序列 | 视觉／点云编码特征接入 Vicuna，LoRA 训练 |
| [CADReview](/cad/cadreview) | 可疑程序、参考图与当前渲染 | 自然语言反馈 + 修正程序 | OpenSCAD 程序及带编号代码块 | 视觉–代码对齐、空间操作学习与模型训练 |
| [CADTests](/cad/cadtests) | 要求、参考模型与变体；待评价实体 | Python 几何测试与通过／失败结果 | B-rep 几何／拓扑查询 | 生成测试并利用执行反馈改进 |
| [CAD-Editor](/cad/cad-editor) | 已有 CAD 序列 + 编辑指令 | 编辑后的草图–拉伸序列 | 文本化 SE 序列与 mask | 先定位需要修改的位置，再补全序列 |
| [CAD-Assistant](/cad/cad-assistant) | 任务文字、草图或当前 CAD 状态 | 答案／更新的几何与约束，随任务而变 | CAD 环境状态与 Python 工具调用 | 规划动作、调用工具并观察结果 |

## 横向比较：反馈与评测

执行成功、几何相似和要求满足应分别检查。各论文的任务、数据与协议不同，跨论文数值不能直接合并排名。

| 论文 | 反馈或条件来源 | 主要检查什么 |
| --- | --- | --- |
| [DeepCAD](/cad/deepcad) | 随机生成主线无执行反馈闭环 | 序列准确率、几何距离、无效比例与分布指标 |
| [Text2CAD](/cad/text2cad) | 文本条件生成；主线无执行反馈闭环 | 命令 F1、几何距离、无效比例与偏好评价 |
| [CAD-Llama](/cad/cad-llama) | 任务条件生成；主线无执行反馈闭环 | 文本生成结果、几何质量与表示消融 |
| [CAD-Recode](/cad/cad-recode) | 执行多个候选，按输入点云的几何距离筛选 | 几何距离、无效比例及候选筛选消融 |
| [CAD-MLLM](/cad/cad-mllm) | 多模态条件生成；主线无执行反馈闭环 | 几何、拓扑与闭合指标；人工评价与模态消融 |
| [CADReview](/cad/cadreview) | 参考图与当前渲染提供诊断依据 | 诊断准确率、修正后几何质量与消融 |
| [CADTests](/cad/cadtests) | 正确示例、错误变体与测试执行日志 | 测试有效性、soundness、mutation score 与要求满足 |
| [CAD-Editor](/cad/cad-editor) | 编辑指令与已有模型；主线为定位后补全 | 有效率、几何／语义指标与人工成功评价 |
| [CAD-Assistant](/cad/cad-assistant) | CAD 环境、约束求解器及观察工具 | 问答、约束、草图参数化；工具调用另行统计 |

## 带着问题完成一轮阅读

1. 写下输入、输出与表示，指出是否已有目标模型或参考图。
2. 画出方法流程，标出模型预测与工具执行的边界。
3. 找到一张关键实验表，记录它支持什么、没有支持什么。
4. 比较一篇相关论文，解释任务设定的差异。

[19 篇资料导航](/cad/reading-navigation) · [论文解读模板](/cad/paper-reading) · [研究与写作](/basics/research-writing)
