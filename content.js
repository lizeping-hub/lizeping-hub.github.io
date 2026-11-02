/* 维护内容：替换项目占位时，将 status 改为实际状态，并填写 title、description、image、links。
 * links: [{ label: '在线体验', url: 'https://...' }, { label: '查看源码', url: 'https://...' }]
 * 不填链接时，卡片会显示“内容待补充”，不会生成空按钮。
 */
window.PORTFOLIO_CONTENT = {
  projects: [
    { title: 'AI 产品设计项目', category: '产品方案', status: '预留展示位', image: 'assets/diagrams/product-design.svg', alt: '移动端线框图汇总为产品规格文档的功能示意', description: '这里将展示项目背景、用户问题、产品方案与关键设计取舍。', note: '项目内容待补充 · 配图为方向示意', tags: ['需求洞察', '产品设计', '交互原型'], links: [] },
    { title: 'AI 工作流项目', category: '工作流实践', status: '预留展示位', image: 'assets/diagrams/workflow.svg', alt: '输入内容经 Skill 处理后生成两份交付文档的功能示意', description: '这里将展示任务拆解、工作流编排，以及从输入到交付的完整过程。', note: '项目内容待补充 · 配图为方向示意', tags: ['任务拆解', 'AI 工作流', '效果验证'], links: [] },
    { title: '知识库与 RAG 项目', category: '知识库应用', status: '预留展示位', image: 'assets/diagrams/knowledge.svg', alt: '知识文档、检索召回、模型生成与来源引用的流程示意', description: '为后续知识库与 RAG 实践预留的位置，将补充场景、实现与评测结果。', note: '项目内容待补充 · 配图为方向示意', tags: ['RAG', '知识检索', '来源引用'], links: [] }
  ],
  resources: [
    { title: 'AI Product Teardown', category: '产品研究 Skill', status: 'v0.1.0 预发布', image: 'assets/diagrams/research.svg', alt: '真实任务、过程记录与交付原件汇总为产品研究报告的示意', description: '基于真实任务与交付原件，研究产品定位、用户价值、人机分工与模型成本，输出可追溯的结构化报告。', note: '产品研究 · 竞品分析 · 证据核验', tags: ['Codex Skill', '产品拆解', '结构化报告'], links: [{ label: '查看公开仓库', url: 'https://github.com/lizeping-hub/ai-product-teardown' }] },
    { title: 'Note Craft', category: '学习笔记整理 Skill', status: 'v0.1.0 预发布', image: 'assets/diagrams/workflow.svg', alt: '混合图文笔记生成基础整理版与研究报告版的功能示意', description: '处理包含图片、表格、代码与链接的 Markdown 笔记，产出基础整理版和研究报告版，并用脚本检查格式与覆盖记录。', note: '知识整理 · 双版本内容交付', tags: ['Codex Skill', 'Python', 'Markdown'], links: [{ label: '介绍与安装', url: 'https://lizeping-hub.github.io/note-craft-skill/' }, { label: '项目源码', url: 'https://github.com/lizeping-hub/note-craft-skill' }] },
    { title: '哔哩哔哩概念落地页', category: '交互与前端练习', status: '已上线 · 个人概念设计', image: 'assets/diagrams/prototype.svg', alt: '桌面界面、内容卡片与鼠标指针的交互原型示意，非项目截图', description: '用可操作的中文单页表达交互方案，包含兴趣选择、弹幕互动和个人档案 PNG 生成，兼顾移动端与减少动态效果的使用偏好。', note: '学习与练习作品 · 非官方产品', tags: ['React', 'TypeScript', 'GSAP', 'Canvas'], links: [{ label: '在线体验', url: 'https://lizeping-hub.github.io/landing-page-bilibili/' }, { label: '项目源码', url: 'https://github.com/lizeping-hub/landing-page-bilibili' }] }
  ],
  writing: [
    { title: '删掉 8 个数据库和 7 条 AI 流水线后，我终于停止了假装努力', category: '知识管理与工作流', status: '微信公众号「泽小舟」', image: 'assets/diagrams/writing-focus.svg', alt: '多个复杂节点收束为一个清晰任务的知识管理示意', description: '反思知识管理与自动化工作流的维护负担，把注意力从整理工具转回真实任务，也讨论极简之后仍然存在的取舍。', tags: ['知识管理', 'AI 工作流', '效率反思'], links: [{ label: '阅读公众号原文', url: 'https://mp.weixin.qq.com/s/Bo3ju_7tTbbxPQJN7PaKqg' }] },
    { title: '单日暴涨 2.2K Star！Together AI 大佬开源的 Hallmark，真能消灭 AI 烂设计吗？', category: 'AI 产品观察', status: '微信公众号「泽小舟」', image: 'assets/diagrams/writing-design.svg', alt: '界面线框图与布局、内容、验证审查清单的设计示意', description: '从 AI 生成页面的常见问题出发，讨论设计约束、审查机制与使用边界，以及真实物料和清晰需求在 AI 辅助设计中的作用。', tags: ['AI 产品观察', 'Agent Skills', '前端设计'], links: [{ label: '阅读公众号原文', url: 'https://mp.weixin.qq.com/s/hsagTMGfJLa61ulqmstZJQ' }] }
  ]
};
