---
id: basic-practice-0002
title: 环境与数据：先看懂一条训练样本
navTitle: 01 · 环境与数据
category: basics
type: concept
tags: [技术实践, 数据配对, 环境]
prerequisites: [basic-practice-0001]
related: [basic-practice-0003, basic-practice-0006]
sources: [https://pytorch.org/get-started/locally/, https://github.com/datawhalechina/self-llm]
status: draft
reviewed: false
order: 31
created: '2026-10-22'
updated: '2026-10-22'
outline: [2, 2]
---
<script setup>
import { withBase } from 'vitepress'
</script>

# 环境与数据：先看懂一条训练样本

这一课只做两件事：确认 Python 使用了正确环境，确认同一个几何对象没有同时出现在训练和测试里。先不启动大模型下载。

## 准备代码与独立环境

在终端进入准备存放项目的目录。Windows 可使用 PowerShell，安装好 Git 和 Python 后执行：

```powershell
git clone https://github.com/hukdis/MySri.git
cd MySri/examples/technical-practice
python -m venv .venv
.venv\Scripts\python.exe -m pip install --upgrade pip
.venv\Scripts\python.exe -m pip install torch==2.9.1 --index-url https://download.pytorch.org/whl/cpu
.venv\Scripts\python.exe -m pip install numpy==2.2.6
```

后续 PowerShell 命令里的 `python` 均指这个环境的解释器。可以先定义别名，避免激活脚本的执行策略问题：

```powershell
Set-Alias python "$PWD\.venv\Scripts\python.exe"
python -c "import sys, torch; print(sys.executable); print(torch.__version__); print(torch.cuda.is_available())"
```

CPU 配方中最后一项是 `False` 也可以正常学习。Linux/macOS 将解释器路径换成 `.venv/bin/python`；GPU 版本应依据 [PyTorch 官方安装选择器](https://pytorch.org/get-started/locally/)匹配自己的系统与驱动。

本章固定教学依赖为 PyTorch 2.9.1、NumPy 2.2.6，真实模型课程再添加 Transformers 4.57.1、PEFT 0.17.1。固定版本用于缩小 API 差异，不表示它们是当前最新版本。

不想先克隆仓库，也可直接下载 <a :href="withBase('/practice-lab/lab.py')" download>lab.py</a>、<a :href="withBase('/practice-lab/hf_lora.py')" download>hf_lora.py</a>、<a :href="withBase('/practice-lab/check_cad.py')" download>check_cad.py</a>、[基础依赖](/practice-lab/requirements.txt)、[真实模型依赖](/practice-lab/requirements-hf.txt)，放在同一文件夹中。完整源码见 [GitHub 实验目录](https://github.com/hukdis/MySri/tree/main/examples/technical-practice)。

## 一条样本有三个层次

```json
{"geometry_id":"cylinder-r2-h4","prompt":"make cylinder radius 2 height 4","target":"CYL 2 4","radius":2,"height":4}
```

`prompt` 是给模型看的输入，`target` 是希望生成的答案，`radius`、`height` 是用来核验答案的几何属性。`geometry_id` 标识同一个对象，即使将 make 改为 create，它仍是同一几何，不能因此拆进不同集合。

本章输入使用受控英文，便于把分词和命令预测压缩到一个小词表。`CYL` 只有“圆柱、半径、高度”这一个命令，不含草图历史、装配或任意 CAD 操作。尺寸先用教学单位，导出 CadQuery 时再约定模型单位。

## 先按对象划分，再生成不同说法

圆柱半径与高度分别取 1–6，共 36 个几何对象，每个对应 make/create 两种描述。固定划分得到：

| 集合 | 几何对象 | 文字—命令样本 |
| --- | --- | --- |
| 训练 | 24 | 48 |
| 验证 | 6 | 12 |
| 测试 | 6 | 12 |

测试对象的参数组合未见于训练，但数字和词汇都在训练词表中。因此它检查的是受控组合的留出表现，并非任意语言、尺寸或复杂形状泛化。

生成可编辑数据文件：

```powershell
python lab.py data --output data
```

也可下载 <a :href="withBase('/practice-lab/data/train.jsonl')" download>训练集</a>、<a :href="withBase('/practice-lab/data/validation.jsonl')" download>验证集</a>、<a :href="withBase('/practice-lab/data/test.jsonl')" download>测试集</a>，放入 `data` 文件夹。后面的命令用 `--data-dir data` 明确读取这三个文件，省略该参数则使用相同规则的内置数据。

训练前脚本检查几何 ID 互斥、目标命令与属性一致、输入词汇是否能被小词表编码。随意添加中文或未注册操作会触发词表错误；这时需要扩展分词器与任务定义，而不只是增加一行数据。

## 跑一个无需训练的检查

```powershell
python -c "import lab; print(lab.batch(lab.rows('train'))[0].shape)"
```

应得到 48 条序列，每条包含输入、分隔符、答案与结束标记。下一课将逐个解释这些位置怎样参与预测。

如果报找不到 torch，先看 `sys.executable` 是否指向刚创建的环境；如果下载中断，重试安装即可，不需要删除网站目录或个人资料。

[下一课：监督微调与损失](./sft)
