# 技术实践实验

面向第一次训练的读者，演示答案区交叉熵、全量更新、LoRA、冻结语言模型的连接器，以及 Transformers/PEFT 的迁移。代码和合成数据为本网站编写，不复制外部教程，不构成论文复现。

网站教程：<https://hukdis.github.io/MySri/basics/practice/>

## 快速运行

在独立 Python 环境中安装 CPU PyTorch 及基础依赖：

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

## 真实模型接口

```shell
python -m pip install -r requirements-hf.txt
python hf_lora.py --smoke --steps 2 --check-reload --output runs/hf-smoke
```

上面使用随机小 GPT-2，不下载模型。去掉 `--smoke` 才会下载默认 SmolLM2-135M-Instruct，运行真正的预训练适配；本次未执行这一下载与训练，因此不声称验证了其任务效果。

`check_cad.py` 默认只验证教学命令和两个参数，`--export-step` 需要另行安装 CadQuery。没有执行导出时，输出 `brep_export_executed=false`。

## 实际运行记录

`observed-run.json` 记录了 Windows / Python 3.13.11 / PyTorch 2.9.1+cpu、种子 37 的一次运行。SFT 和 LoRA 在六个留出几何的 12 条表达上完整匹配率均为 100%；连接器为 33.3%，尽管训练对象为 100%。连接器置零与打乱条件后为 0%。保留失败结果，用于区分拟合、条件利用和泛化，不据此提供论文级性能结论。

离线 HF smoke 两步训练的任务分数为零，但冻结参数、梯度链路、适配器保存及重载一致性通过。原始基座、训练检查点和环境文件不提交；代码、合成数据与可核查运行记录随网站发布。

## 教学结构来源

- <https://github.com/rasbt/LLMs-from-scratch>：从数据与训练循环逐步深入。
- <https://github.com/HandsOnLLM/Hands-On-Large-Language-Models>：概念与可运行实例对应。
- <https://github.com/datawhalechina/self-llm>：先环境、运行，再微调。
- <https://github.com/TinyLLaVA/TinyLLaVA_Factory>：分开编码器、连接器、语言模型与训练阶段。

具体软件 API 与算法出处见各篇教程的原始来源链接。
