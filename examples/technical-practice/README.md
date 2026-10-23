# 技术实践实验

面向 CAD 论文阅读者，先运行真实预训练模型与 LoRA 微调，再按需学习表示、点云与注意力、编辑、执行反馈及偏好目标。代码和合成数据为本网站编写；各机制实验与论文完整实现分别说明。

网站教程：<https://hukdis.github.io/MySri/basics/practice/>

## 快速运行

在独立 Python 环境中安装固定依赖，再运行真实模型：

```shell
python -m pip install torch==2.9.1 --index-url https://download.pytorch.org/whl/cpu
python -m pip install -r requirements-hf.txt
python hf_infer.py --output runs/before.json
python hf_lora.py --steps 20 --eval-samples 12 --check-reload --output runs/hf-first
python check_cad.py runs/hf-first/hf-metrics.json
python hf_infer.py --adapter runs/hf-first/adapter --output runs/after.json
```

默认下载 SmolLM2-135M-Instruct，之后复用本机缓存；默认 CPU，可加 `--device cuda`。训练目录不能已有 adapter，请为每次实验选择新目录。`hf_lora.py` 调用 `lab.rows()` 的固定样本，编辑导出的 JSONL 不会改变真实模型配方的数据。

## CAD 论文机制实验

以下只依赖 Python 标准库，不下载模型：

```shell
python paper_tech.py representation --bins 256
python paper_tech.py features
python paper_tech.py attention
python paper_tech.py editing
python paper_tech.py feedback
python paper_tech.py preference
python -m unittest discover -s . -p "test_paper_tech.py"
```

分别演示参数量化、FPS/Fourier 特征、注意力加权、LCS/mask、属性候选检查和 DPO 标量损失。向量、候选和概率为教学设定；没有训练完整多模态模型、编辑器、代理或偏好模型，也没有在这些脚本中执行 CAD 几何。

## 补充：CPU 小模型

需要观察训练内部时，再运行旧版原理实验：

```shell
python -m pip install torch==2.9.1 --index-url https://download.pytorch.org/whl/cpu
python -m pip install numpy==2.2.6
python lab.py data --output data
python lab.py sft --steps 400 --base-steps 400 --data-dir data --output runs
python lab.py lora --steps 400 --data-dir data --output runs
python lab.py align --steps 400 --data-dir data --output runs
python check_cad.py runs/align-metrics.json
```

`sft` 和 `lora` 都读取同一 `base.pt`，分别进行全量和增量更新。`align` 读取 `sft.pt`，冻结解码器，只训练从固定几何特征到六个软前缀向量的连接器。重新更换数据、预热设置时，请使用新的输出目录，避免混用旧检查点。

JSONL 是按几何对象分组的 48/12/12 条样本，训练时可以用 `--data-dir` 显式读取；词表和命令范围固定，扩展任务需同时修改分词、生成器和检查器。

## 离线接口检查

```shell
python -m pip install -r requirements-hf.txt
python hf_lora.py --smoke --steps 2 --check-reload --output runs/hf-smoke
```

上面使用随机小 GPT-2，不下载模型，只检查接口。真实预训练配方见最前面的快速运行；两种结果独立记录。

`check_cad.py` 默认只验证教学命令和两个参数，`--export-step` 需要另行安装 CadQuery。没有执行导出时，输出 `brep_export_executed=false`。

## 实际运行记录

`observed-pretrained-run.json` 是 2026-10-23 的真实 SmolLM2 运行：CPU、20 步、48 条训练描述，测试为 12 条描述与 6 个留出几何。完整命令匹配由 0/12 变为 12/12，冻结参数摘要与保存重载一致；新进程的适配器推理也已运行。它只说明受控格式适配，未执行 STEP 导出，不能推出真实复杂 CAD 能力。详细版本、模型 revision、损失和逐样本预测在记录内。

`observed-run.json` 记录了 Windows / Python 3.13.11 / PyTorch 2.9.1+cpu、种子 37 的一次运行。SFT 和 LoRA 在六个留出几何的 12 条表达上完整匹配率均为 100%；连接器为 33.3%，尽管训练对象为 100%。连接器置零与打乱条件后为 0%。保留失败结果，用于区分拟合、条件利用和泛化，不据此提供论文级性能结论。

离线 HF smoke 两步训练的任务分数为零，但冻结参数、梯度链路、适配器保存及重载一致性通过。原始基座、训练检查点和环境文件不提交；代码、合成数据与可核查运行记录随网站发布。

## 教学结构来源

- <https://github.com/rasbt/LLMs-from-scratch>：从数据与训练循环逐步深入。
- <https://github.com/HandsOnLLM/Hands-On-Large-Language-Models>：概念与可运行实例对应。
- <https://github.com/datawhalechina/self-llm>：先环境、运行，再微调。
- <https://github.com/TinyLLaVA/TinyLLaVA_Factory>：分开编码器、连接器、语言模型与训练阶段。

具体软件 API 与算法出处见各篇教程的原始来源链接。
