---
id: basic-practice-0009
category: basics
type: concept
tags:
- 技术实践
prerequisites:
- basic-practice-0002
related:
- basic-practice-0007
sources:
- https://huggingface.co/docs/transformers/v4.57.1/en/chat_templating
- https://huggingface.co/HuggingFaceTB/SmolLM2-135M-Instruct
created: '2026-10-23'
title: 先运行一个真实预训练模型
navTitle: 02 · 真实模型推理
practiceGroup: start
order: 32
status: draft
reviewed: false
updated: '2026-10-23'
outline:
- 2
- 2
---
# 先运行一个真实预训练模型

先不训练。我们要确认模型可以加载、输入经过正确格式化，并保存它原本的回答。后面的微调比较从这里开始。

## 先得到第一份回答

在[环境页](./setup)的实验目录与虚拟环境中运行：

```powershell
python hf_infer.py --prompt "make cylinder radius 2 height 4" --output runs/before.json
```

默认加载 `HuggingFaceTB/SmolLM2-135M-Instruct`。首次运行会下载模型与分词器，之后复用本地缓存。它是已经完成预训练和指令训练的英文小模型；模型卡说明了训练、用途、限制和 Apache 2.0 许可。

终端与 `before.json` 会给出输入、聊天模板文本、token 数量及模型回答。这里不预设模型会输出 `CYL 2 4`，那是我们稍后要通过任务适配建立的约定。

## 加载模型时，实际拿到了什么

<<< ../../../examples/technical-practice/hf_infer.py#load

`AutoTokenizer` 负责文字与 token ID 的转换；`AutoModelForCausalLM` 加载能预测下一个 token 的模型。权重提供已有能力，`eval()` 切换到推理模式。`--device cuda` 可切到兼容的 GPU 环境；默认 float32 与 CPU 配方便于首次检查。

`adapter` 参数此时没有设置。它将在训练完成后，让同一个加载入口附加 LoRA 权重。

## 一句话怎样进入聊天模型

<<< ../../../examples/technical-practice/hf_infer.py#generate

程序先构造一条 `user` 消息，再由模型自己的聊天模板加入角色与边界标记。`add_generation_prompt=True` 表示接下来轮到 assistant 回答。模型读取的仍是一串 token，而不是 Python 字典本身。

`generate()` 在输入后继续生成，代码只截取新生成部分，再解码为文字。`do_sample=False` 使用确定性选择，便于比较同一配置的训练前后输出；`max_new_tokens` 控制最多继续生成多少 token。

具体接口依据 [Transformers 4.57.1 聊天模板文档](https://huggingface.co/docs/transformers/v4.57.1/en/chat_templating)。

## 改一个输入，读懂一份输出

保持高度不变，只改半径：

```powershell
python hf_infer.py --prompt "make cylinder radius 3 height 4" --output runs/before-r3.json
```

比较两份报告的 `formatted_prompt` 和 `prediction`。先确认数值确实进入输入，再观察模型是否给出说明文字、代码或其他回答。这个步骤建立对原模型行为的认识，尚不评价 CAD 任务是否成功。

若下载失败，检查网络能否访问模型卡和权重文件；若内存不足，先关闭其他占用内存的程序。不要通过删改训练样本来处理模型加载失败。

## 微调后怎样回到同一个入口

完成下一页训练后，运行：

```powershell
python hf_infer.py --adapter runs/hf-first/adapter --prompt "make cylinder radius 2 height 4" --output runs/after.json
```

程序会核对适配器记录的基座名称。新进程需要重新加载基座，再附加适配器；仅有 adapter 文件并不包含整个语言模型。

模型资料：[SmolLM2-135M-Instruct 模型卡](https://huggingface.co/HuggingFaceTB/SmolLM2-135M-Instruct)。

[下一步：完成真实模型的 LoRA 微调](./pretrained)
