---
id: basic-practice-0002
title: 准备环境与训练样本
navTitle: 01 · 环境与数据
category: basics
type: concept
tags:
- 技术实践
- 数据配对
- 环境
prerequisites:
- basic-practice-0001
related:
- basic-practice-0009
- basic-practice-0007
sources:
- https://pytorch.org/get-started/locally/
- https://github.com/datawhalechina/self-llm
status: draft
reviewed: false
order: 31
created: '2026-10-22'
updated: '2026-10-23'
outline:
- 2
- 2
practiceGroup: start
---
# 准备环境与训练样本

<span id="环境与数据-先看懂一条训练样本"></span>
<span id="准备代码与独立环境"></span>
<span id="一条样本有三个层次"></span>
<span id="先按对象划分-再生成不同说法"></span>
<span id="跑一个无需训练的检查"></span>

先把代码和依赖准备好，然后直接运行一个真实预训练模型。这一页只解释环境与数据；损失函数、梯度和 LoRA 矩阵会在实际训练时逐步展开。

## 建立独立环境

Windows PowerShell 中进入准备存放代码的目录，执行：

```powershell
git clone https://github.com/hukdis/MySri.git
cd MySri/examples/technical-practice
python -m venv .venv
.venv\Scripts\python.exe -m pip install --upgrade pip
.venv\Scripts\python.exe -m pip install torch==2.9.1 --index-url https://download.pytorch.org/whl/cpu
.venv\Scripts\python.exe -m pip install -r requirements-hf.txt
Set-Alias python "$PWD\.venv\Scripts\python.exe"
```

这里创建的环境只用于教程。后续命令中的 `python` 指这个解释器；关闭终端重新进入时，需要重新设置别名。Linux/macOS 使用 `.venv/bin/python`，也可以激活虚拟环境后运行。

教程固定使用 PyTorch 2.9.1、Transformers 4.57.1、PEFT 0.17.1 和 NumPy 2.2.6，以便让页面与代码使用同一组接口。CPU 配方不要求 CUDA；GPU 安装请按 [PyTorch 官方选择器](https://pytorch.org/get-started/locally/)匹配系统与驱动。

## 确认当前 Python 能加载依赖

```powershell
python -c "import sys,torch,transformers,peft; print(sys.executable); print(torch.__version__,transformers.__version__,peft.__version__); print(torch.cuda.is_available())"
```

解释器路径应指向 `.venv`，三个库都应能导入。CPU 配方最后一项为 `False` 是正常情况。若出现 `ModuleNotFoundError`，先确认安装与运行使用同一个解释器。

下一页会下载 [SmolLM2-135M-Instruct](https://huggingface.co/HuggingFaceTB/SmolLM2-135M-Instruct)。135M 表示模型规模级别；权重缓存占用磁盘，运行还需要额外内存保存模型、激活和梯度。下载大小、运行时间与可用内存应以实际环境为准。

## 看懂这次训练的输入和答案

```json
{"geometry_id":"cylinder-r2-h4","prompt":"make cylinder radius 2 height 4","target":"CYL 2 4","radius":2,"height":4}
```

模型读取 `prompt`，我们希望它输出 `target`。`radius` 与 `height` 供独立检查器核验；`geometry_id` 用来识别同一个几何对象。

例如把 make 改成 create，只是换一种说法。几何仍相同，所以两条描述应留在同一个数据集合，避免训练见过该几何、测试只换了动词。

这个样例用英文和短命令降低第一轮训练的复杂度。`CYL` 不是工业 CAD 格式，也不要求预训练模型原本认识它。先观察原模型的回答，再通过训练让输出遵守这一约定。

## 数据从哪里来

源码 `lab.py` 的 `rows()` 按半径与高度组合生成 36 个几何，每个对象有 make/create 两种表达。划分规则固定：训练 24 个对象、48 条样本；验证和测试各 6 个对象、12 条样本。

`hf_lora.py` 直接调用这份生成器，所以克隆后即可训练，不必先手工创建 JSONL。想查看或编辑原有 CPU 实验数据，可以运行：

```powershell
python lab.py data --output data
```

注意：当前 `hf_lora.py` 使用生成器提供的固定数据；修改导出的 JSONL 不会改变它的训练输入。接入自己的任务时，需要同时替换训练、验证、测试的数据读取与评价规则。

## 项目里先看哪几个文件

| 文件 | 现在怎样使用 |
| --- | --- |
| `hf_infer.py` | 运行真实模型，或加载训练后的适配器 |
| `hf_lora.py` | 数据编码、LoRA 注入、训练、评估与保存 |
| `lab.py` | 先只看 `rows()`；自写小模型留到补充实验 |
| `paper_tech.py` | 后续 CAD 专题的机制演示，仅需 Python 标准库 |
| `check_cad.py` | 独立检查生成命令与目标参数 |

也可以从 [GitHub 实验目录](https://github.com/hukdis/MySri/tree/main/examples/technical-practice)查看源码。模型权重和训练检查点只保存在本地，不随网站发布。

[下一步：运行预训练模型](./inference)
