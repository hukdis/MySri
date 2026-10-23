---
id: cad-0101
title: DeepCAD：把 CAD 建模过程变成可学习的操作序列
navTitle: DeepCAD
outline:
  - 2
  - 2
category: cad
type: paper
tags:
  - 论文阅读
  - 表示基础
prerequisites:
  - cad-0003
related:
  - cad-0002
  - cad-0102
  - cad-0104
order: 20
sources:
  - sources/论文/先读/DeepCAD.md
  - 'https://arxiv.org/abs/2105.09492'
status: draft
reviewed: false
created: '2026-10-07'
updated: '2026-10-23'
---
# DeepCAD：把 CAD 建模过程变成可学习的操作序列

<!-- cad-v2-context -->
> **研究任务 · CAD生成** · [研究总览](/cad/) · [九篇详读](/cad/reading-navigation?reading=1)
<!-- /cad-v2-context -->

一个三维模型即使外形正确，也未必能像工程师设计的 CAD 那样修改：点云记录了表面，网格记录了三角形，却没有直接告诉软件草图画在哪里、孔如何形成、拉伸深度是多少。

**DeepCAD 的切入点是把生成目标从最终表面转向建模过程。** 它先将草图和拉伸写成统一的操作序列，学习这些序列的压缩表示，再从学到的潜空间生成新序列。理解这篇论文，要沿着“操作如何表示—表示能否恢复—能否产生新模型—结果能否执行”这条线走下去。它没有文本输入，也没有使用预训练大语言模型。

## 阅读前需要了解的技术 {#technical-primer}

先理解下面四个概念，就能看清本文“学习已有建模过程，再生成新过程”的技术链路。

### Transformer：让不同建模步骤交换信息 {#primer-transformer}

它把输入序列中的每个元素转成向量，再用注意力机制，按相关程度汇总其他位置的信息。例如判断一次拉伸时，需要利用前面草图的内容。输入是一组带位置的命令与参数向量，输出是包含上下文信息的向量。DeepCAD 用它编码、解码 CAD 序列；使用 Transformer 并不要求使用预训练大语言模型。

### 自编码器与潜向量：先压缩，再尝试还原 {#primer-autoencoder}

自编码器由编码器和解码器组成：**操作序列 → 潜向量 z → 恢复的操作序列**。z 是一组学习得到的数值，承载恢复模型所需的信息，不是能直接读取的孔径或高度表。训练时比较恢复结果与原序列，通过误差更新网络；重建任务提供“这种压缩表示是否保留了建模信息”的检验。

### latent GAN：为随机生成提供新的潜向量 {#primer-latent-gan}

GAN 包含生成器与判别器：生成器把随机噪声变成样本，判别器学习区分真实训练样本与生成样本，两者通过对抗训练学习数据分布。在本文中，样本是自编码器得到的潜向量，所以叫 **latent GAN（潜空间 GAN）**。它输出新的 z，再交给 CAD 解码器生成命令；不是直接生成三维表面。

### 参数量化：把预测实数变成预测档位 {#primer-quantization}

量化先把连续坐标、角度等映射到有限档位，网络再对档位分类。例如“归一化坐标落在哪一档”替代“直接回归任意坐标”。本文使用 256 档，分类预测形式更统一，但还原值存在离散误差，边界闭合等几何关系仍可能被破坏。

**理解示例**：已有的带孔零件先编码成 z，再由解码器恢复，用于训练自编码器；随机生成时则由 GAN 产生新的 z。两条流程共用解码器，潜向量的来源不同。这个示例说明信息流，不是新的实验结果。

概念依据：[Transformer 原论文](https://arxiv.org/abs/1706.03762)、[GAN 原论文](https://arxiv.org/abs/1406.2661)；具体应用见 [DeepCAD §3–4](https://arxiv.org/abs/2105.09492)。

配套实践：[CAD 表示、自编码器与潜空间](/basics/practice/representation) · [全部技术地图](/basics/practice/paper-map)。

## 从一个带孔零件开始：生成形状还缺少什么 {#_3-它解决什么问题-输入输出是什么}

设想要继续调整一个零件上的孔。如果只有表面采样点，软件并不知道哪些点来自同一次草图与拉伸；如果保留了生成零件的操作及参数，修改就有了可以落到的对象。这里的差别是有没有建模结构，而不仅是表面精度高低。

<PaperFigure src="/papers/deepcad/figure02_construction.png" title="DeepCAD 原论文图 2：CAD 构建过程" source="https://arxiv.org/abs/2105.09492" :page="3" />

<!-- figure-translation:/papers/deepcad/figure02_construction.png -->
**原文翻译（图注）**

图2：使用表1中的命令定义的一个 CAD 模型示例。上部展示模型的构建顺序，并标注命令类型；下部给出模型的命令序列。本例未展示参数归一化和量化。在“草图1”中，L2–A3–L4–L5 构成一个蓝色的环，C7 构成另一个绿色的环，这两个环共同限定灰色的草图轮廓。

**关键标记**

Parametrized command sequence：参数化命令序列。

**译注**：原图注写 C7，而图内圆命令标记为 R7；译文分别保留这两个符号。

::: details 对照英文原文

Figure 2. A CAD model example specified by the commands in Table 1. (Top) the CAD model’s construction sequence, annotated with the command types. (Bottom) the command sequence description of the model. Parameter normalization and quantization are not shown in this case. In “Sketch 1”, L2-A3-L4-L5 forms a loop (in blue) and C7 forms another loop (in green), and the two loops bounds a sketch profile (in gray).
:::

**图表解读**
<!-- /figure-translation -->

图 2 把这种差别展开了。一个草图可以包含多个闭环，闭环共同限定待拉伸区域；拉伸还要指定平面、方向、距离以及与已有实体的布尔关系。因此，要让网络学习建模过程，既要预测二维边界，也要保留边界如何成为三维实体的信息。DeepCAD 将这些信息编码进命令及参数，而不是要求网络直接输出所有 B-rep 面、边和顶点。（原文 §3.1，图 2。）

但选择操作序列也划定了能力范围：**词表没有的操作，网络就无法用该表示直接生成。** DeepCAD 主要处理草图—拉伸模型；后面看到软件中的圆角编辑时，需要记住这个起点。

## 把建模过程写成网络能够预测的序列 {#_4-核心一-如何把-cad-编成序列}

同一个草图包含坐标、半径和角度，拉伸又包含距离、姿态与布尔类型。它们原本是不同类型的量。作者将每一步统一成“命令类型 + 参数槽位”，再把连续参数量化为有限类别，使网络能够用分类损失学习。

用图 2 的过程理解：网络不是一次猜出“一个带孔零件”，而是恢复形成轮廓的直线、圆弧或圆，恢复草图平面与拉伸参数，最后由 CAD 系统执行。六种命令中，L、A、R 对应直线、圆弧、圆，E 对应拉伸，SOL 和 EOS 负责标记结构边界。

**统一预测形式的代价是离散化误差。** 连续参数量化为 256 档，局部数值接近不代表几何关系仍然成立：几条边稍有偏移，就可能无法闭合。这不是可以在方法之后略过的小问题，而是后面必须检查实体有效性的原因。（原文 §3.1、§4.1。）

:::: details 命令表、归一化与序列长度

<PaperFigure src="/papers/deepcad/table01_commands.png" title="DeepCAD 原论文表 1：命令与参数" source="https://arxiv.org/abs/2105.09492" :page="3" />

<!-- figure-translation:/papers/deepcad/table01_commands.png -->
**原文翻译（表注）**

表1：CAD 命令及其参数。〈SOL〉表示一个环的开始；〈EOS〉表示整个序列的结束。

::: details 对照英文原文

Table 1. CAD commands and their parameters. ⟨SOL⟩indicates the start of a loop; ⟨EOS⟩indicates the end of the whole sequence.
:::

**图表解读**
<!-- /figure-translation -->

表 1 给出了每类命令实际使用的参数。每条命令共有 **16 个参数槽位**，未使用槽位为 −1，并非每条命令都有 16 个有效几何参数。E 的参数涉及平面姿态与位置、轮廓尺度、双向拉伸距离及布尔类型。

整体模型归一化到边长为 2 的范围，草图轮廓另行归一化并保存尺度。训练序列补齐至 **60 条命令**；这个上限属于本文数据与模型设置，并非任意 CAD 的通用复杂度界限。（§3.1。）

::::

## 先学会还原，再学习生成新模型 {#_5-核心二-网络如何学习与生成}

把 CAD 写成序列只是定义了输出格式，还没有说明网络能够掌握它。作者先设置一个可检验的任务：把真实操作序列压缩为潜向量 z，再尝试还原原序列。如果还原后实体发生明显变形，或者根本不能构建，那么这个潜空间就不足以支撑后续生成。

<PaperFigure src="/papers/deepcad/figure03_architecture.png" title="DeepCAD 原论文图 3：网络结构" source="https://arxiv.org/abs/2105.09492" :page="4" />

<!-- figure-translation:/papers/deepcad/figure03_architecture.png -->
**原文翻译（图注）**

图3：我们的网络结构。输入 CAD 模型表示为包含 Nc 条命令的序列 M={Ci}（i=1,…,Nc），首先投影到嵌入空间，再输入编码器 E，得到潜向量 z。解码器 D 以学习得到的常量嵌入为输入，同时关注潜向量 z，随后输出预测的命令序列。

**关键标记**

Learned Constant Embeddings：学习得到的常量嵌入，是解码器的输入。

::: details 对照英文原文

Figure 3. Our network architecture. The input CAD model, represented as a command sequence M = {C_i}_{i=1}^{N_c} is first projected to an embedding space and then fed to the encoder E resulting in a latent vector z. The decoder D takes learned constant embeddings as input, and also attends to the latent vector z. It then outputs the predicted command sequence M-hat = {C-hat_i}_{i=1}^{N_c}.
:::

**图表解读**
<!-- /figure-translation -->

编码器把整条序列映射成 z，解码器根据 z 预测各位置的命令与参数。图中的“学习得到的常量嵌入”提供解码器输入，因此这里不能套用 LLM 逐个预测下一个 token 的解释。这个阶段训练的是 **CAD 自编码重建**：输入是已有操作序列，目标仍是这条序列。（§3.2，图 3。）

然而，能把已有模型压缩再还原，还不能回答随机输入应该落到哪个潜向量。为此，论文再训练一个 [latent GAN](#primer-latent-gan) 学习潜向量分布，形成第二条链路：**随机噪声 → GAN 生成的 z → 已训练的 CAD 解码器 → 操作序列 → 实体。** [自编码器](#primer-autoencoder)提供解码能力，latent GAN 提供随机生成时的潜向量来源，两者承担不同工作。（§4.2。）

:::: details 网络与训练设置

编码器与解码器各有 4 层 [Transformer](#primer-transformer)，每层 8 个注意力头；嵌入维度 256，前馈维度 512。编码器按序列位置平均池化，得到 256 维 z。损失包含命令分类与参数分类，参数项权重 β=2，并屏蔽补齐项和未使用参数。自编码器训练 1000 epochs，batch size 512；GAN 的生成器与判别器采用 MLP。（§3.2、补充材料 C。）

这些配置说明实验如何实施，论文未提供足以直接换算其他硬件训练时长的信息。

::::

## 第一项检验：准确恢复命令，是否就恢复了几何 {#_7-实验到底证明了什么}

DeepCAD 使用 **178,238 个 CAD 模型及操作序列**，从 ABC 提供的来源链接获取 Onshape 建模信息，再保留表示支持的草图—拉伸模型。结果首先适用于这个经过筛选的数据分布。（§4、补充材料 A。）

<PaperFigure src="/papers/deepcad/table02_autoencoding.png" title="DeepCAD 原论文表 2：自编码重建与消融" source="https://arxiv.org/abs/2105.09492" :page="6" />

<!-- figure-translation:/papers/deepcad/table02_autoencoding.png -->
**原文翻译（表注）**

表2：自编码的定量评价。ACCcmd 和 ACCparam 以百分比报告，CD 的显示值乘以10³。↑表示数值越大，自编码质量越好；↓表示数值越小越好。Alt-Regr 不使用量化参数，因此没有对应的 ACC 数值。

**关键标记**

ACCcmd／ACCparam：命令／参数准确率；Invalid Ratio：无效比例。

::: details 对照英文原文

Table 2. Quantitative evaluation of autoencoding. ACCcmd and ACCparam are both multiplied by 100%, and CD is multiplied by 10³. ↑: a higher metric value indicates better autoencoding quality. ↓: a lower metric value is better. ACC values for Alt-Regr are not available since Alt-Regr does not use quantized parameters.
:::

**图表解读**
<!-- /figure-translation -->

表 2 中，Ours 的命令准确率为 **99.36%**、参数准确率为 **97.47%**，但仍有 **3.30%** 的无效结果。这组数值指出了主线中的关键落差：**局部预测准确并不保证命令组合后得到有效实体。** 参数准确率还只统计命令类型正确时的有效参数，不能解读为“97.47% 的模型完全正确”。（§4.1。）

作者为什么选择量化分类，而不直接回归连续参数？同表的 Alt-Regr 将参数预测改为回归后，CD 显示值从 **0.787** 变成 **2.142**，无效比例从 **3.30%** 变成 **4.32%**。这为本文设置下的量化选择提供了实验支持，但没有证明分类对所有几何表示都更好。

另一组消融更值得联系前面的闭环问题：Alt-Rel 的参数准确率 **97.66%** 略高，CD **0.863** 和无效比例 **3.51%** 却更差。评测需要同时看命令、参数、最终形状和有效性，不能用其中一项代替其余三项。

:::: details 评测协议与定性重建对照

<PaperFigure src="/papers/deepcad/figure04_comparison.png" title="DeepCAD 原论文图 4：定性重建比较" source="https://arxiv.org/abs/2105.09492" :page="6" />

<!-- figure-translation:/papers/deepcad/figure04_comparison.png -->
**原文翻译（图注）**

图4：自编码结果比较。隐藏边也被渲染为可见的白色线条。最下方一行为真实模型（GT）；本文方法的最佳结果用虚线框突出显示。

**关键标记**

Ours+Aug：加入数据增强的本文方法。

::: details 对照英文原文

Figure 4. Comparison of autoencoding results. Hidden edges are also rendered visible (white). Ground truth (GT) is shown in the bottom row. Our best results are highlighted in the dash-line box.
:::

**图表解读**
<!-- /figure-translation -->

图 4 用局部结构的变化补充表 2。参数扰动最终怎样改变轮廓与实体，需要在执行后的模型上观察；不能仅从准确率排序推断。

数据按 90% / 5% / 5% 分为训练、验证、测试；补充材料 A 描述了依据最近邻几何距离去除测试集重复模型的处理。

ACCparam 只在命令类型预测正确时统计有效参数，量化参数差小于 3 视为正确。CD 在两个实体表面各采样 2000 点；表 2 报告中位数并乘以 1000 显示，**0.787 不是毫米误差**。Invalid Ratio 统计因几何或拓扑问题不能转换为评测所需点云的结果。数据增强版本的命令/参数准确率为 99.50% / 97.98%，CD 为 0.752，无效比例为 2.72%。（§4.1。）

::::

## 第二项检验：生成的新形状有没有失去表示的价值 {#_7-2-随机生成-不能把所有指标说成领先}

重建实验检查潜空间能否保留输入信息，随机生成实验则检查从该空间采样是否得到合理的新模型。它们不能互相替代。

<PaperFigure src="/papers/deepcad/table03_generation.png" title="DeepCAD 原论文表 3：随机生成评测" source="https://arxiv.org/abs/2105.09492" :page="7" />

<!-- figure-translation:/papers/deepcad/table03_generation.png -->
**原文翻译（表注）**

表3：在点云指标下衡量形状生成质量。使用 l-GAN 文献[6]中的指标。MMD 和 JSD 的显示值均乘以10²。↑表示越大越好，↓表示越小越好。

**关键标记**

COV：覆盖率；其余指标的含义见下文。

::: details 对照英文原文

Table 3. Shape generation measured under point-cloud metrics. We use the metrics in l-GAN [6]. Both MMD and JSD are multiplied by 10². ↑: the higher the better, ↓: the lower the better.
:::

**图表解读**
<!-- /figure-translation -->

表 3 中，Ours 的 COV/MMD/JSD 为 **78.13 / 1.45 / 3.76**，l-GAN 为 **77.73 / 1.27 / 5.02**：DeepCAD 的覆盖率和分布差异指标更好，l-GAN 的最小匹配距离更好。论文的价值因此不能归结为全部形状指标领先；更重要的是，在取得可比形状质量的同时，输出保留了可交给 CAD 系统执行的操作结构。（§4.2。）

这里的生成仍然没有文本条件。COV 衡量集合覆盖，MMD 衡量参考形状到生成集合的近邻距离，JSD 比较空间占据分布；这些指标不检查孔径是否符合一条用户指令。表中 MMD 和 JSD 乘以 100 显示。

## 从表示到可用 CAD，还剩下哪些距离 {#_8-局限-这篇论文留出了哪些问题}

回到最初那个带孔零件：DeepCAD 给出了学习建模过程的一条路径，却没有保证任意输出都可执行，也没有自动获得选择任意边、面并添加复杂特征的能力。其草图—拉伸词表、量化精度和较短序列分布，共同限定了结果。（§5、补充材料 F。）

点云重建和后续编辑示例说明这种表示有继续使用的价值，但二者也要分开理解：点云需要额外编码器才能进入潜空间；软件中添加的圆角则依赖外部 CAD 编辑功能。

:::: details 点云输入、软件编辑与失败案例

<PaperFigure src="/papers/deepcad/figure06_pointcloud.png" title="DeepCAD 原论文图 6：点云到 CAD" source="https://arxiv.org/abs/2105.09492" :page="8" />

<!-- figure-translation:/papers/deepcad/figure06_pointcloud.png -->
**原文翻译（图注）**

图6：从点云重建 CAD 模型。上方为输入点云，下方为重建的 CAD 模型。

::: details 对照英文原文

Figure 6. CAD model reconstruction from point clouds. (Top) input point clouds. (Bottom) reconstructed CAD models.
:::

**图表解读**
<!-- /figure-translation -->

图 6 使用另训的 PointNet++ 编码器将点云映射到 CAD 潜空间，再调用同一解码器。此时系统必须从表面信息推测操作，比输入真实序列的自编码任务多了一层不确定性。（§4.3。）

<PaperFigure src="/papers/deepcad/table06_pointcloud.png" title="DeepCAD 原论文表 6：点云重建评测" source="https://arxiv.org/abs/2105.09492" :page="14" />

<!-- figure-translation:/papers/deepcad/table06_pointcloud.png -->
**原文翻译（表注）**

表6：从点云重建 CAD 的定量结果。Ours-noise 对应带噪声的输入，即沿法向加入范围为[−0.02, 0.02]的均匀噪声。采用与自编码任务相同的指标；ACCcmd 和 ACCparam 以百分比报告，CD 的显示值乘以10³。

**关键标记**

Ours-noise：带噪声输入下的本文方法；Invalid Ratio：无效比例。

::: details 对照英文原文

Table 6. Quantitative results for CAD reconstruction from point clouds. Ours-noise corresponds to noisy inputs (uniform noise in [−0.02, 0.02] along normal direction). We use the same metrics as in autoencoding task; ACCcmd and ACCparam are both multiplied by 100%, and CD is multiplied by 10³.
:::

**图表解读**
<!-- /figure-translation -->

表 6 中，普通点云输入的 CD 显示值为 **10.30**、无效比例 **12.08%**；含噪点云为 **10.44、13.82%**。普通输入命令/参数准确率为 85.95% / 74.22%，含噪输入为 84.65% / 74.23%。CD 乘以 1000 显示。这些是点云重建结果，不能与表 2 当作同一输入任务直接比较。（补充材料表 6。）

<PaperFigure src="/papers/deepcad/figure07_editing.png" title="DeepCAD 原论文图 7：CAD 软件中的后续编辑" source="https://arxiv.org/abs/2105.09492" :page="8" />

<!-- figure-translation:/papers/deepcad/figure07_editing.png -->
**原文翻译（图注）**

图7：用户编辑。本文重建的 CAD 模型可以方便地在 CAD 工具中编辑。图中以橙色突出显示施加 CAD 操作的区域。

**关键标记**

Move face：移动面；Fillet：圆角。

::: details 对照英文原文

Figure 7. User Editing. Our reconstructed CAD model can be easily edited in any CAD tools. Here, the regions that undergo CAD operations are highlighted in orange color.
:::

**图表解读**
<!-- /figure-translation -->

图 7 展示生成模型在 CAD 软件中继续移动面、添加圆角。它说明输出具有后续编辑用途，**不表示 DeepCAD 本身预测了圆角操作及目标边**。（§4.3。）

<PaperFigure src="/papers/deepcad/figure11_failures.png" title="DeepCAD 原论文图 11：失败案例" source="https://arxiv.org/abs/2105.09492" :page="14" />

<!-- figure-translation:/papers/deepcad/figure11_failures.png -->
**原文翻译（图注）**

图11：形状自编码的失败示例。上方为本文方法输出的重建 CAD 模型，下方为真实 CAD 模型。

::: details 对照英文原文

Figure 11. Failure examples in shape autoencoding. Top: our reconstructed CAD outputs. Bottom: ground-truth CAD models.
:::

**图表解读**
<!-- /figure-translation -->

图 11 展示恢复失败的模型。结合高局部准确率但仍有无效实体的现象，可以理解为什么后续研究需要把几何约束或执行检查纳入系统；这是从本文结果引出的分析，而非本文已验证的修复方法。

<PaperFigure src="/papers/deepcad/figure12_length.png" title="DeepCAD 原论文图 12：序列长度与表现" source="https://arxiv.org/abs/2105.09492" :page="14" />

<!-- figure-translation:/papers/deepcad/figure12_length.png -->
**原文翻译（图注）**

图12：形状自编码定量指标随 CAD 序列长度的变化。左图为倒角距离中位数，越低越好；右图为参数准确率，越高越好。

**关键标记**

横轴为序列长度；Med CD 为 CD 中位数，Param ACC 为参数准确率。

::: details 对照英文原文

Figure 12. Quantitative metrics for shape autoencoding w.r.t. CAD sequence length. Left: median chamfer distance (the lower the better). Right: parameter accuracy (the higher the better).
:::

**图表解读**
<!-- /figure-translation -->

图 12 将误差与序列长度联系起来。长度变化伴随模型复杂度和训练样本分布变化，因此只能据本文数据讨论趋势，不能外推任意复杂工业模型。（补充材料 F。）

::::

## 读完之后，如何连接后续工作 {#_9-放回你的-a–h-研究方向地图}

DeepCAD 建立的是“操作序列能够被学习并用于生成”的基础。后续问题沿着这个基础分叉：[Text2CAD](/cad/text2cad) 引入语言条件，[CAD-Llama](/cad/cad-llama) 让描述与代码建立层次对应，[CAD-Recode](/cad/cad-recode) 从点云恢复可执行代码。它们分别改变输入条件、语义组织或输出表示，不能理解为直接继承同一套生成网络。

对本文的核心判断应停留在证据范围内：**学习建模过程为可编辑生成提供了结构，但可生成、可执行与符合设计要求，仍是三个需要分别检验的目标。**

[原论文 PDF：DeepCAD，2105.09492v2](https://arxiv.org/pdf/2105.09492)。本文图号及 PDF 页码见原图说明。

:::: details 论文信息与版本

<span id="_1-论文信息与方向定位"></span>

- **全名**：DeepCAD: A Deep Generative Network for Computer-Aided Design Models
- **作者**：Rundi Wu、Chang Xiao、Changxi Zheng。
- **会议**：ICCV 2021。
- **来源**：[arXiv 页面](https://arxiv.org/abs/2105.09492)、[DOI](https://doi.org/10.1109/ICCV48922.2021.00670)、[原论文 PDF](https://arxiv.org/pdf/2105.09492)。
- **论文版本**：arXiv 2105.09492v2，2021-08-16，共 15 页，包含补充材料。下文页码均指 **PDF 文件页码**；补充材料重新编号，可能与页脚不同。

::::

<!-- Published section anchors retained for incoming links. -->
<span id="_4-1-先看一次完整建模过程"></span>
<span id="_4-2-六种命令及参数"></span>
<span id="_4-3-为什么要归一化和量化"></span>
<span id="_5-1-自编码器的流程"></span>
<span id="_5-2-随机生成还需要-latent-gan"></span>
<span id="_5-3-训练资源能说明什么"></span>
<span id="_6-数据集与评测-读结果前先读协议"></span>
<span id="_6-1-数据集从哪里来"></span>
<span id="_6-2-四个指标分别回答什么"></span>
<span id="_7-1-自编码重建与表示消融"></span>
<span id="_7-3-点云重建与后续编辑"></span>
<span id="主方向-f-表示与实体选择"></span>
<span id="相关方向-b-重建"></span>
<span id="相关方向-g-数据评测"></span>
<span id="_10-阅读自测与可填写的阅读卡"></span>
<span id="_11-图表与核查记录"></span>

<!-- cad-v2-relations -->
::: details 研究树关联：发展关系、资源与问题

### R01 · 直接改进

[DeepCAD](/cad/deepcad) → [SkexGen](/cad/papers/xu22)

SkexGen明确在DeepCAD等表示上修改，增加面层次并改为解耦码本生成；不表示复用整个DeepCAD模型。

原文位置：Xu22 §3，PDF第2页。

### R07 · 相关基础

[DeepCAD](/cad/deepcad) → [Text2CAD](/cad/text2cad)

Text2CAD对DeepCAD模型构造多层次文本描述，用于文本条件CAD序列学习。

原文位置：Text2CAD §3，Data Annotation。

### R08 · 相关基础

[DeepCAD](/cad/deepcad) → [CAD-Llama](/cad/cad-llama)

CAD-Llama的数据与命令表示以DeepCAD为基础，再转换为SPCC并适配LLM；不继承DeepCAD的生成网络。

原文位置：数据与表示章节；原文§3–4。

### R09 · 相关基础

[DeepCAD](/cad/deepcad) → [CAD-Editor](/cad/cad-editor)

CAD-Editor从DeepCAD出发构造原始模型和编辑数据。

原文位置：原文§4、§6。

资源：[DeepCAD](/cad/datasets/ds_deepcad)。

[CAD生成](/cad/tasks/generation) · [发展关系](/cad/relationships)
:::
<!-- /cad-v2-relations -->
