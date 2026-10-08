// 阅读组织与速读摘要依据本站先读稿整理；不构成新的论文核验或实验结果。
export const groups = [
  {key:'representation',title:'表示基础',question:'CAD 的建模过程怎样变成可学习的表示？'},
  {key:'generation',title:'条件生成',question:'文本或多模态信息怎样进入生成器？'},
  {key:'reconstruction',title:'几何重建',question:'观察到的表面怎样恢复为建模程序？'},
  {key:'editing',title:'指令编辑',question:'已有模型怎样按要求修改并保留其余部分？'},
  {key:'feedback',title:'反馈与评测',question:'怎样发现错误、修复模型并检查要求？'}
]
export const papers = [
  {id:'cad-0101',name:'DeepCAD',slug:'deepcad',group:'representation',source:'https://arxiv.org/abs/2105.09492',
    question:'让生成结果保留可执行的 CAD 建模步骤。',input:'CAD 序列／随机噪声；点云为下游任务',output:'草图–拉伸序列 → 实体',representation:'带参数的操作序列',role:'Transformer 自编码器与潜空间 GAN；未使用预训练 LLM',feedback:'随机生成主线无执行反馈闭环',evaluation:'序列准确率、几何距离、无效比例与分布指标',
    method:'先将操作序列编码为潜向量，再解码还原；随机生成另用潜空间 GAN。',evidence:'优先读原表 2 的表示消融与原表 3 的随机生成结果，区分重建任务和生成任务。',limit:'操作类型有限；预测出序列不保证实体有效，也不证明理解了文本意图。',next:['cad-0102','cad-0104'],reason:'先看 Text2CAD 怎样加入文本条件；对点云恢复感兴趣则转到 CAD-Recode。',
    diagram:'flowchart LR\n A["CAD 操作序列"] --> B["Transformer 编码器"] --> C["潜向量"] --> D["CAD 解码器"] --> E["操作序列"] --> F["执行为实体"]\n N["随机噪声"] --> G["潜空间 GAN"] --> C'},
  {id:'cad-0102',name:'Text2CAD',slug:'text2cad',group:'generation',source:'https://arxiv.org/abs/2409.17106',
    question:'从不同详细程度的自然语言描述生成 CAD。',input:'自然语言描述',output:'草图–拉伸序列 → 实体',representation:'参数化命令序列',role:'VLM/LLM 用于数据标注；生成器为 BERT + Transformer',feedback:'文本条件生成；主线无执行反馈闭环',evaluation:'命令 F1、几何距离、无效比例与偏好评价',
    method:'标注流水线构建分级文本，BERT 编码文本，带交叉注意力的解码器预测 CAD 命令。',evidence:'原表 1 看详细提示下的几何与有效性；原表 2 看自动偏好与人工偏好是否一致。',limit:'提示更详细不等于专家设计能力；形状相似和偏好评分不验证全部工程要求。',next:['cad-0103','cad-0108'],reason:'转到 CAD-Llama 比较预训练 LLM 的作用；转到 CAD-Editor 比较生成与修改已有模型。',
    diagram:'flowchart LR\n A["文本描述"] --> B["BERT 文本编码"] --> C["交叉注意力解码器"] --> D["CAD 命令序列"] --> E["执行为实体"]'},
  {id:'cad-0103',name:'CAD-Llama',slug:'cad-llama',group:'generation',source:'https://arxiv.org/abs/2505.04481',
    question:'将部件语义与 CAD 代码组织为语言模型可学习的语料。',input:'文本／指定 CAD 任务',output:'SPCC 参数化建模代码',representation:'整体描述、部件描述与代码的层次表示',role:'LLaMA3 领域适配预训练 + LoRA 指令微调',feedback:'任务条件生成；主线无执行反馈闭环',evaluation:'文本生成结果、几何质量与表示消融',
    method:'构建 SPCC 层次语料，再分别进行领域适配和多任务指令微调。',evidence:'原表 4 查看文本任务，原表 6 比较表示消融，避免把表示贡献只归于模型更换。',limit:'参数错误与文本不匹配仍存在；支持的操作与数据分布限制可推广的能力。',next:['cad-0105','cad-0104'],reason:'用 CAD-MLLM 比较多模态条件；用 CAD-Recode 比较代码表示和点云条件。',
    diagram:'flowchart LR\n A["层次描述与 CAD 历史"] --> B["SPCC 语料"] --> C["领域适配预训练"] --> D["指令微调"]\n T["文本或任务"] --> E["CAD-Llama"] --> F["参数化代码"]\n D --> E'},
  {id:'cad-0104',name:'CAD-Recode',slug:'cad-recode',group:'reconstruction',source:'https://arxiv.org/abs/2412.14042',
    question:'把表面点云恢复为可执行的建模程序。',input:'三维点云',output:'CadQuery Python → B-rep 实体',representation:'可执行 CadQuery 程序',role:'点云投影接入 Qwen2 小型代码模型',feedback:'执行多个候选，按输入点云的几何距离筛选',evaluation:'几何距离、无效比例及候选筛选消融',
    method:'将点云位置编码映射为模型输入，生成多个程序，执行后用与输入点云的距离选择候选。',evidence:'原表 1–2 分别看公共数据与扫描；原表 3 看候选筛选的影响。',limit:'多候选结果不等于单次输出；自然语言编辑示例使用另一个模型，需与重建能力分开。',next:['cad-0105','cad-0107'],reason:'用 CAD-MLLM 比较命令序列与代码输出，再用 CADTests 理解几何相似和要求满足的区别。',
    diagram:'flowchart LR\n A["输入点云"] --> B["位置编码与投影"] --> C["代码模型"] --> D["候选 CadQuery 程序"] --> E["执行与采样"] --> F["按输入点云距离筛选"]'},
  {id:'cad-0105',name:'CAD-MLLM',slug:'cad-mllm',group:'generation',source:'https://arxiv.org/abs/2411.04954',
    question:'在同一生成模型中接入文本、图像和点云条件。',input:'文本、图像、点云及其组合',output:'草图–拉伸序列 → 实体',representation:'参数化 CAD 命令序列',role:'视觉／点云编码特征接入 Vicuna，LoRA 训练',feedback:'多模态条件生成；主线无执行反馈闭环',evaluation:'几何、拓扑与闭合指标；人工评价与模态消融',
    method:'编码并投影视觉与点云特征，结合文本提示，通过多阶段训练学习 CAD 序列。',evidence:'原表 3 看点云任务，原表 7 看多模态训练相对单模态的收益与代价。',limit:'共享多模态模型并非每项任务都更好；薄结构、尺寸和复杂细节仍有失败。',next:['cad-0104','cad-0106'],reason:'与 CAD-Recode 对照点云重建设置，再读 CADReview 了解参考图如何用于审查。',
    diagram:'flowchart LR\n T["文本"] --> L["Vicuna 与 LoRA"]\n I["图像或点云"] --> E["编码器与特征投影"] --> L\n L --> S["CAD 命令序列"] --> C["执行为实体"]'},
  {id:'cad-0106',name:'CADReview',slug:'cadreview',group:'feedback',source:'https://arxiv.org/abs/2505.22304',
    question:'定位 CAD 程序错误，再产生反馈与修正。',input:'可疑程序、参考图与当前渲染',output:'自然语言反馈 + 修正程序',representation:'OpenSCAD 程序及带编号代码块',role:'视觉–代码对齐、空间操作学习与模型训练',feedback:'参考图与当前渲染提供诊断依据',evaluation:'诊断准确率、修正后几何质量与消融',
    method:'将视觉组件与代码块对齐，定位错误，生成解释反馈并修正程序。',evidence:'原表 1 区分人工与机器程序；原表 2 看对齐、空间操作和反馈的消融。',limit:'依赖参考图；OpenSCAD 和造错分布限制泛化，几何修正不等于全部要求满足。',next:['cad-0107','cad-0108'],reason:'用 CADTests 补充要求验证，用 CAD-Editor 对照按指令修改与按错误修复。',
    diagram:'flowchart LR\n A["参考图与当前渲染"] --> B["视觉与代码块对齐"]\n C["可疑 OpenSCAD 程序"] --> B\n B --> D["错误定位与反馈"] --> E["修正程序"] --> F["执行与评价"]'},
  {id:'cad-0107',name:'CADTests',slug:'cadtests',group:'feedback',source:'https://arxiv.org/abs/2605.07807',
    question:'用可执行测试检查 CAD 是否满足文字要求。',input:'要求、参考模型与变体；待评价实体',output:'Python 几何测试与通过／失败结果',representation:'B-rep 几何／拓扑查询',role:'生成测试并利用执行反馈改进',feedback:'正确示例、错误变体与测试执行日志',evaluation:'测试有效性、soundness、mutation score 与要求满足',
    method:'把要求转成几何属性测试，借助正确示例和故意改错的变体改进辨别力，再评价生成结果。',evidence:'先读原表 1–2 检查测试本身，再读原表 3–4 检查生成评价与人工一致性。',limit:'测试覆盖有限且可能误判；通过已列测试不保证满足所有可能要求。',next:['cad-0109','cad-0106'],reason:'读 CAD-Assistant 区分工具执行与任务成功，再与 CADReview 比较反馈依据。',
    diagram:'flowchart LR\n R["文字要求"] --> G["生成几何测试"] --> T["测试执行"]\n V["正确示例与错误变体"] --> T\n T --> F["反馈改进测试"] --> G\n G --> E["评价待测 CAD"]'},
  {id:'cad-0108',name:'CAD-Editor',slug:'cad-editor',group:'editing',source:'https://arxiv.org/abs/2502.03997',
    question:'按编辑指令局部修改已有 CAD 序列。',input:'已有 CAD 序列 + 编辑指令',output:'编辑后的草图–拉伸序列',representation:'文本化 SE 序列与 mask',role:'先定位需要修改的位置，再补全序列',feedback:'编辑指令与已有模型；主线为定位后补全',evaluation:'有效率、几何／语义指标与人工成功评价',
    method:'定位模型复制保留 token、标记修改区域，补全模型生成最终编辑序列。',evidence:'原表 1 对照实体有效率与人工成功评价；原表 2 分开看定位补全和人工筛选。',limit:'有效实体不等于正确编辑；多轮示例不证明长期约束保持。',next:['cad-0106','cad-0109'],reason:'与 CADReview 比较修复任务，再用 CAD-Assistant 理解工具和当前状态如何参与交互。',
    diagram:'flowchart LR\n A["已有 CAD 序列与指令"] --> L["定位修改区域"] --> M["带 mask 的序列"] --> I["补全编辑内容"] --> O["编辑后的序列"] --> E["执行与评价"]'},
  {id:'cad-0109',name:'CAD-Assistant',slug:'cad-assistant',group:'feedback',source:'https://arxiv.org/abs/2412.13810',
    question:'让视觉语言模型通过工具与 CAD 环境交互。',input:'任务文字、草图或当前 CAD 状态',output:'答案／更新的几何与约束，随任务而变',representation:'CAD 环境状态与 Python 工具调用',role:'规划动作、调用工具并观察结果',feedback:'CAD 环境、约束求解器及观察工具',evaluation:'问答、约束、草图参数化；工具调用另行统计',
    method:'规划器根据当前状态调用工具，环境执行并返回观察，模型据此调整后续动作。',evidence:'原表 3 看问答，原表 4–5 看约束与工具消融，原表 6 看手绘参数化。',limit:'工具调用有效率与任务成功率不同；扩展示例不构成完整工业建模基准。',next:['cad-0107','cad-0108'],reason:'用 CADTests 检查目标要求，再回到 CAD-Editor 比较交互式执行与直接序列编辑。',
    diagram:'flowchart LR\n R["任务与当前状态"] --> P["视觉语言模型规划"] --> A["Python 工具动作"] --> E["CAD 环境执行"] --> O["观察与日志"] --> P\n P --> S["结束或继续"]'}
]

export function renderCadOverview(rows) {
  const byId = new Map(rows.map(row => [row.id,row]))
  const link = id => {const row=byId.get(id);if(!row)throw new Error(`缺少 CAD 阅读页 ${id}`);return `[${row.navTitle??row.title}](${row.url})`}
  let content = '# CAD · 从表示到验证\n\n<div class="edition-label">学习图谱 1.1 · 9 篇先读</div>\n\n> 先弄清模型输出什么，再比较它怎样生成、编辑和验证。这里按阅读问题组织已有论文，不预设你的最终研究方向。\n\n::: info 阅读状态\n摘要与方法示意依据所提供的阅读稿整理，均待人工复核；比较表用于理解任务差异，不作为统一性能排名。\n:::\n\n## 从哪里开始\n\n| 你的问题 | 推荐路线 | 阅读后应能解释 |\n| --- | --- | --- |\n| 想读懂 CAD 生成 | '+link('cad-0101')+' → '+link('cad-0102')+' → '+link('cad-0103')+' | 操作序列、文本条件和预训练 LLM 分别起什么作用 |\n| 想理解几何重建 | '+link('cad-0101')+' → '+link('cad-0104')+' → '+link('cad-0105')+' | 点云如何进入模型；命令序列与程序输出的区别 |\n| 想研究修改与反馈 | '+link('cad-0108')+' → '+link('cad-0106')+' → '+link('cad-0107')+' → '+link('cad-0109')+' | 编辑、错误诊断、要求测试与工具执行各提供什么证据 |\n\n先读 [CAD 术语与小练习](/cad/concepts)，再进入论文。路线是本站的阅读建议，可按已有基础调整。\n\n## 按问题阅读\n'
  for (const group of groups) {
    content += `\n### ${group.title}\n\n${group.question}\n\n| 论文 | 先抓住这一点 |\n| --- | --- |\n`
    for (const paper of papers.filter(p=>p.group===group.key)) content += `| ${link(paper.id)} | ${paper.question} |\n`
  }
  content += '\n## 横向比较：输入、输出与表示\n\n同一论文可能有多个任务；这里标出主线与必要例外。各行链接进入对应阅读稿与原论文出处。\n\n| 论文 | 输入 | 输出 | CAD 表示 | 模型的作用 |\n| --- | --- | --- | --- | --- |\n'
  for (const paper of papers) content += `| ${link(paper.id)} | ${paper.input} | ${paper.output} | ${paper.representation} | ${paper.role} |\n`
  content += '\n## 横向比较：反馈与评测\n\n执行成功、几何相似和要求满足应分别检查。各论文的任务、数据与协议不同，跨论文数值不能直接合并排名。\n\n| 论文 | 反馈或条件来源 | 主要检查什么 |\n| --- | --- | --- |\n'
  for (const paper of papers) content += `| ${link(paper.id)} | ${paper.feedback} | ${paper.evaluation} |\n`
  content += '\n## 带着问题完成一轮阅读\n\n1. 写下输入、输出与表示，指出是否已有目标模型或参考图。\n2. 画出方法流程，标出模型预测与工具执行的边界。\n3. 找到一张关键实验表，记录它支持什么、没有支持什么。\n4. 比较一篇相关论文，解释任务设定的差异。\n\n[19 篇资料导航](/cad/reading-navigation) · [论文解读模板](/cad/paper-reading) · [研究与写作](/basics/research-writing)\n'
  return content
}
