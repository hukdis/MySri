---
id: cad-0106
title: CADReview：先定位 CAD 程序错误，再生成反馈与修正代码
navTitle: CADReview
outline:
  - 2
  - 2
category: cad
type: paper
tags:
  - 论文阅读
  - 反馈与评测
prerequisites:
  - cad-0101
  - cad-0003
related:
  - cad-0002
  - cad-0107
  - cad-0108
order: 25
sources:
  - sources/论文/先读/CADReview.md
  - 'https://arxiv.org/abs/2505.22304'
status: draft
reviewed: false
created: '2026-10-07'
updated: '2026-10-23'
---
# CADReview：先定位 CAD 程序错误，再生成反馈与修正代码

<!-- cad-v2-context -->
> **研究任务 · CAD编辑** · [研究总览](/cad/) · [九篇详读](/cad/reading-navigation?reading=1)
<!-- /cad-v2-context -->

一段 CAD 程序可以顺利运行，却把槽的数量、部件位置或切除逻辑写错。解释器只能告诉我们程序是否可执行，未必能指出为什么生成的形状与目标不符。

**CADReview 把这类错误拆成“看出差异—定位代码—生成修复”三步。** 它用正确参考图与当前渲染作对照，训练 ReCAD 先将几何部件与代码块对应，再生成错误反馈并修改 OpenSCAD 程序。主线中的难点是从可见症状追溯到可修改的原因。

## 阅读前需要了解的技术 {#technical-primer}

本文不仅训练模型修改程序，还训练它把可见的形状异常对应到代码。先区分下面四种学习与反馈环节，才能理解 ReCAD 的完整链路。

### 视觉—代码定位：把部件对应到程序块 {#primer-visual-grounding}

定位既要识别图像中的几何组件，也要指出哪个代码块构造了它。例如“缺少一个槽”是外观判断，“应检查循环生成槽的代码块”才进入可操作的位置。GCR（几何组件识别）用描述和定位数据训练这种联系；它不是把所有像素与代码 token 逐一对齐，也不是三维坐标配准。

### 监督微调与空间操作学习：用目标答案训练参数 {#primer-supervised-tuning}

监督微调（SFT）把输入和正确输出组成样本，惩罚正确答案 token 的低预测概率，并更新选定参数。本文的输入可包含程序、图像和反馈，目标是诊断或修改代码。SGO 相关训练还包括遮蔽部分代码块再恢复，以及强调数字预测；这些任务帮助学习空间变化，和推理时仅添加一句提示不同。LoRA 则用较小的附加参数完成微调。

### DPO：用优选与劣选反馈做偏好学习 {#primer-dpo}

同一个输入可以有两条反馈，一条定位准确且有助修复，另一条效果较差。DPO 利用这种成对偏好，相对于参考模型调整两种回答的相对概率，更新反馈生成器。它与只提供一条标准答案的监督学习不同，也不需要按 PPO 那样另训练一个显式奖励模型再在线优化；偏好来自什么标准，仍决定它会学到什么。

### 渲染反馈与修复评价：能运行只是第一关 {#primer-render-feedback}

渲染器把 CAD 程序执行成形状，再生成图像供模型比较；自然语言诊断再交给代码编辑器。执行成功只能说明程序可运行，参考对比提供形状差异，错误定位与最终修复又需要分别检查。图像看似接近，也未必能排除隐藏尺寸错误。

**理解示例**：当前模型的槽数少了，反馈生成器定位循环代码块，编辑器依据反馈修改程序，再执行、渲染并评价。训练时可用两条候选反馈的修复效果组织偏好；不是让一条反馈反复变长就能保证改对。

概念依据：[DPO 原论文](https://arxiv.org/abs/2305.18290)、[LoRA 原论文](https://arxiv.org/abs/2106.09685)；视觉定位、SGO 与反馈链见 [CADReview §4](https://arxiv.org/abs/2505.22304)。

配套实践：[反馈定位](/basics/practice/feedback) · [DPO 偏好目标](/basics/practice/optimization#dpo) · [全部技术地图](/basics/practice/paper-map)。

## 槽少了，应该修改常量还是循环逻辑 {#_3-问题、输入输出与术语}

<PaperFigure src="/papers/cadreview/figure06_correction.png" title="CADReview 原图 6：错误定位与修正案例" source="https://arxiv.org/abs/2505.22304" :page="8" />

<!-- figure-translation:/papers/cadreview/figure06_correction.png -->
**原文翻译（图注）**

图6：不同方法的案例。绿色表示预测正确，红色表示预测错误。

**关键标记**

constant error：常量错误；logic error：逻辑错误。

::: details 对照英文原文

Figure 6: Cases of different methods. The green and red denote correct and incorrect prediction, respectively.
:::

**图表解读**
<!-- /figure-translation -->

图 6 展示一个贯穿全文的区别：基线也发现槽数不一致，却把问题归到不合适的常量；ReCAD 进一步定位到相关的循环逻辑代码块。只会描述“看起来不一样”，还不足以指导正确修改。（原文图 6。）

因此，任务输入不只有可疑程序，还包含**正确参考图和当前渲染**；输出既包括诊断反馈，也包括修改后的程序。参考图提供“应该是什么样”的依据，这与没有目标参照的通用错误检测不同。CADReview 是论文及任务名称，ReCAD 是本文方法名称。

## 要学会定位原因，数据必须把错误与代码关联起来 {#_4-数据与错误表示}

<PaperFigure src="/papers/cadreview/figure02_dataset.png" title="CADReview 原图 2：数据构建" source="https://arxiv.org/abs/2505.22304" :page="3" />

<!-- figure-translation:/papers/cadreview/figure02_dataset.png -->
**原文翻译（图注）**

图2：CADReview 数据集的构建流程，包括收集程序—图像对、创建错误，以及标注反馈。

**关键标记**

Error Creation：错误创建；Feedback Annotation：反馈标注。

::: details 对照英文原文

Figure 2: Construction workflow of our CADReview dataset, including program-drawing pairs collection, error creation and feedback annotation.
:::

**图表解读**
<!-- /figure-translation -->

图 2 的流程先收集正确程序、拆分代码块并渲染参考，再由熟悉 OpenSCAD 的设计者修改程序制造错误，GPT-4o 辅助生成反馈并由人工检查。数据同时包括人工编写程序和由几何基元构成的机器程序，使系统有机会学习不同结构下的错误。（§3。）

<PaperFigure src="/papers/cadreview/figure03_errors.png" title="CADReview 原图 3：八类程序错误" source="https://arxiv.org/abs/2505.22304" :page="4" />

<!-- figure-translation:/papers/cadreview/figure03_errors.png -->
**原文翻译（图注）**

图3：CADReview 数据集中八类 CAD 程序错误的示例。第一行为从一个采样视角观察到的参考图像；第二行展示对 CAD 程序创建错误时修改的代码片段；最后一行为错误程序渲染出的三维物体。

**关键标记**

Primitive／Rotation／Position／Size：基元／旋转／位置／尺寸；Logic／Missing／Redundant：逻辑／缺失／冗余。

::: details 对照英文原文

Figure 3: Examples of 8 types of CAD program error from our CADReview dataset. Top row: The reference images from one sampled viewpoint. Second row: Error creation on CAD programs, showing the edited code segments. Bottom row: The rendered 3D objects by erroneous programs.
:::

**图表解读**
<!-- /figure-translation -->

图 3 规定八类错误：基元、旋转、位置、尺寸、常量、逻辑、缺失与冗余代码块。它们要求不同的修改方式：位置错可能调整变换，缺失需要新增代码，逻辑错则可能必须改循环。把问题统一看成数字替换，就会错过开头的槽数案例。（§3。）

这些是作者构造的错误分布，不等于真实生成器自然错误的完整覆盖。约 1.5K 人工程序与约 1.6K 机器程序是来源程序数量，多次造错后的样本不能都视为独立物体。

## 从视觉症状走到代码修改，需要两种不同能力 {#_5-方法-为什么先学对齐与空间操作}

<PaperFigure src="/papers/cadreview/figure04_network.png" title="CADReview 原图 4：ReCAD 框架" source="https://arxiv.org/abs/2505.22304" :page="5" />

<!-- figure-translation:/papers/cadreview/figure04_network.png -->
**原文翻译（图注）**

图4：ReCAD 概览。分别设计几何部件识别（GCR）与空间几何操作（SGO）机制，初始化反馈生成器 φ1 和代码编辑器 φ2。

**关键标记**

GCR：几何部件识别；SGO：空间几何操作；DPO：直接偏好优化。

::: details 对照英文原文

Figure 4: Overview of our ReCAD. We design geometric component recognition (GCR) and spatial geometric operation (SGO) mechanisms to initialize feedback generator φ1 and code editor φ2, respectively.
:::

**图表解读**
<!-- /figure-translation -->

图 4 中，反馈生成器先通过 **[GCR](#primer-visual-grounding)（几何组件识别）**学习组件描述及图像位置与代码块的对应，再学习判断哪个块属于哪类错误。它解决的是“该改哪里、为什么改”。相关辅助描述与定位数据超过 700K，并非 CADReview 测试集规模。（§4。）

代码编辑器还要解决“具体怎样改”。作者用 **[SGO](#primer-supervised-tuning)（空间几何操作）**相关学习，包括遮蔽 30% 代码块的补全任务，并提高数字 token 的损失权重，让训练不能仅靠学会语法就获得较低损失。之后编辑器结合参考、当前程序、渲染与诊断反馈生成修改。

反馈是否有用，也不能只看文字流畅程度。作者生成多条候选反馈，依据错误块/类型诊断以及修正后视觉相似性组织偏好对，使用 [DPO](#primer-dpo) 优化反馈生成器。这里优化的是特定诊断与修复链，不是泛指任意在线工具代理。（§4。）

:::: details 数据记录、划分与训练配置

主文训练/验证/测试为 **17,334 / 2,000 / 1,615**，合计 **20,949**；附录 A.1 总量记录为 **21,949**，相差 1000。此处保留差异，复现应核对实际清单，不能猜测补齐。附录说明不同集合的原始对象互斥。

骨干为约 7B 的 Qwen2-VL / LLaVA-OV，对应 ReCAD-QW / ReCAD-LA；使用 **4 张 A100-80GB**。反馈 LoRA rank 8、上下文 3072，编辑器 rank 64、上下文 8192。训练成本还包含 GCR、SGO 等辅助阶段。（§5.1。）

::::

## 先问定位是否准确，再问形状是否修好 {#_7-实验与消融}

<PaperFigure src="/papers/cadreview/table01_main.png" title="CADReview 原表 1：主结果" source="https://arxiv.org/abs/2505.22304" :page="7" />

<!-- figure-translation:/papers/cadreview/table01_main.png -->
**原文翻译（表注）**

表1：基线与 ReCAD 的主要结果。†表示在 CADReview 数据集上进行微调。CD、MMD 和 JSD 的显示值乘以10³；粗体表示最佳结果。

**关键标记**

RL：ROUGE-L，此处并非强化学习；BS：BERTScore；Acc：错误定位准确率。

::: details 对照英文原文

Table 1: Main results of baselines and our ReCAD. †: fine-tuning on CADReview dataset. CD, MMD and JSD are multiplied by 10³. Bold: best results.
:::

**图表解读**
<!-- /figure-translation -->

表 1 的诊断 Acc 要求**代码块与错误类型同时正确**。ReCAD-QW 在机器程序上为 **71.83%**，人工程序上为 **63.60%**；GPT-4o 对应为 **41.54% / 31.84%**。这表明本任务中的专门训练改善了诊断，但仍有相当部分错误没有定位正确。（§5，表 1。）

再看修复结果：机器程序 CD 为 **1.43**、IR 为 **0.00%**，人工程序为 **4.42、10.59%**。人工程序显然更难。机器程序没有无效结果，也不能说全部修对：程序有效与几何符合参考由不同指标检验。

把两组指标拆开，才能判断系统是找错了位置，还是定位正确却修改失败。ROUGE-L、BERTScore 描述反馈文本质量，也不能代替这两个判断。表头 **RL 是 ROUGE-L**，并非强化学习；CD/MMD/JSD 按表头乘以 1000 显示。

## 把对齐、空间学习与反馈拿掉，结果怎样变化 {#_7-2-反馈是否真的有帮助}

<PaperFigure src="/papers/cadreview/table02_ablation.png" title="CADReview 原表 2：模块消融" source="https://arxiv.org/abs/2505.22304" :page="7" />

<!-- figure-translation:/papers/cadreview/table02_ablation.png -->
**原文翻译（表注）**

表2：消融研究结果。Fed 表示反馈，Red 表示奖励函数。CD 和 JSD 的显示值乘以10³；粗体表示最佳结果。

**关键标记**

w/o：去掉对应模块；GCR／SGO：几何部件识别／空间几何操作。

::: details 对照英文原文

Table 2: Results of ablation study. Fed: feedback. Red: reward functions. CD and JSD are multiplied by 10³. Bold: best results.
:::

**图表解读**
<!-- /figure-translation -->

表 2 中，去掉 GCR 会降低诊断准确率；去掉 SGO 或反馈会影响修复后的几何。例如 QW 人工程序一列，去掉 SGO 时 CD 为 **8.08**，完整方法为 **4.42**。（§5，表 2。）

这与前面的设计链相互呼应：视觉—代码对应帮助找到修改位置，空间操作学习帮助做出修改，反馈把二者衔接起来。但它并不支持“反馈越长越好”或“让任意模型自我反思就能修复”。这些收益依赖当前数据、辅助训练和参照条件。

## 修复依赖什么，就应把什么当作结论边界 {#_8-局限与证据范围}

回到槽数错误，系统若没有看到隐藏结构，或参考图本身存在歧义，就可能缺少判断依据；即使修出相似形状，也未必恢复原始程序。作者明确指出，同一几何可以有不同程序，本文没有求解最优代码编辑，且数据只覆盖 OpenSCAD。（§7。）

进一步的任务分析是：人工造错可能与真实模型错误不同，正确诊断不保证修改不损伤其他部分，视觉相似也不检验全部尺寸要求。因此，对修复系统应保留“诊断准确—修改有效—几何接近—要求满足”的分层评价，而不是一个笼统成功率。

CADReview 将“看出有错”推进到“定位并指导代码修改”；[CAD-Editor](/cad/cad-editor) 则从用户主动编辑出发学习修改区域，[CADTests](/cad/cadtests) 尝试把文字要求变成可执行判定。三者分别提供修改目标、修改位置和检查依据，参照条件各不相同。

[原论文 PDF：CADReview，2505.22304v1](https://arxiv.org/pdf/2505.22304) · [ACL 出版页](https://aclanthology.org/2025.acl-long.489/)。图表出处与 PDF 页码见各图说明。

:::: details 论文信息与版本

<span id="_1-论文信息与方向定位"></span>

- **全名**：CADReview: Automatically Reviewing CAD Programs with Error Detection and Correction。
- **作者**：Jiali Chen、Xusen Hei、Hongfei Liu 等。
- **出处与版本**：矩阵出版 DOI 指向 ACL 2025；所用版本为 arXiv **2505.22304v1，2025-05-28**，共 19 页，含附录。
- **来源**：[arXiv](https://arxiv.org/abs/2505.22304)、[ACL 出版页](https://aclanthology.org/2025.acl-long.489/)、[作者项目页](https://cgl-pro.github.io/cadreview)。
- **名字消歧**：**CADReview** 是论文/数据任务名称；**ReCAD** 是本文方法名称。

::::

<!-- Published section anchors retained for incoming links. -->
<span id="_4-1-数据怎样构建"></span>
<span id="_4-2-八种错误"></span>
<span id="_5-1-反馈生成器"></span>
<span id="_5-2-代码编辑器"></span>
<span id="_5-3-偏好优化"></span>
<span id="_5-4-训练资源"></span>
<span id="_6-划分、统计问题与指标"></span>
<span id="_7-1-人工程序和机器程序分别看"></span>
<span id="_7-3-原图中的错误定位"></span>
<span id="_9-放回方向地图-与编辑-代理路线区分"></span>
<span id="_10-阅读自测与阅读卡"></span>
<span id="_11-来源与核查记录"></span>

<!-- cad-v2-relations -->
::: details 研究树关联：发展关系、资源与问题

### R11 · 相关基础

[CADTalk](/cad/papers/yua23) → [CADReview / ReCAD](/cad/cadreview)

CADReview的辅助学习数据使用CADTalk来源；这里只记录数据关系。

原文位置：Che25 §4.1.1，第5页；附录B。

资源：[CADReview](/cad/datasets/ds_cadreview)。

[CAD编辑](/cad/tasks/editing) · [发展关系](/cad/relationships)
:::
<!-- /cad-v2-relations -->
