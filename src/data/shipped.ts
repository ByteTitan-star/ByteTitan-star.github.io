export type ShippedMetric = {
  value: string;
  valueZh: string;
  label: string;
  labelZh: string;
};

export type ShippedKpi = {
  value: string;
  valueZh: string;
  label: string;
  labelZh: string;
  hint?: string;
  hintZh?: string;
  compactValue?: boolean;
};

export type ShippedProject = {
  title: string;
  kicker: string;
  kickerZh: string;
  image: string;
  imageAlt: string;
  href: string;
  description: string;
  descriptionZh: string;
  kpis: ShippedKpi[];
};

export const shippedMetrics: ShippedMetric[] = [
  {
    value: '800+',
    valueZh: '800+',
    label: 'Institutions',
    labelZh: '机构用户'
  },
  {
    value: '30+',
    valueZh: '30+',
    label: 'Leading enterprises / Fortune 500',
    labelZh: '领军企业 / Fortune 500'
  },
  {
    value: '$2B+',
    valueZh: '$20亿+',
    label: 'Cumulative order volume',
    labelZh: '累计订单规模'
  }
];

export const shippedProjects: ShippedProject[] = [
  {
    title: 'BioMap OS',
    kicker: 'Life-science R&D OS',
    kickerZh: '生命科学研发操作系统',
    image: '/figures/BioMap-os.webp',
    imageAlt: 'BioMap OS interface',
    href: 'https://stage.biomap.com/',
    description:
      'A unified R&D workbench that brings knowledge assistants, AgentOS, protein design, intelligent experiments, and data centers into one multi-agent operating surface—shipping core capabilities while improving recall quality and sandbox reuse.',
    descriptionZh:
      '统一知识助手、AgentOS、蛋白设计、智能实验与数据中心，把多 Agent 能力收敛到同一研发工作台，并持续优化召回效果与沙箱复用效率。',
    kpis: [
      {
        value: '3',
        valueZh: '3',
        label: 'Core Capabilities Shipped',
        labelZh: '已上线核心能力',
        hint: 'GeneralQA · DeepResearch · MD2PDF',
        hintZh: 'GeneralQA · DeepResearch · MD2PDF'
      },
      {
        value: '80%',
        valueZh: '80%',
        label: 'Sandbox Session Reuse',
        labelZh: '沙箱会话复用'
      },
      {
        value: '96%',
        valueZh: '96%',
        label: 'Skill Recall@3',
        labelZh: 'Skill Recall@3',
        hint: '62% → 96%',
        hintZh: '62% → 96%'
      }
    ]
  },
  {
    title: 'GnoSight',
    kicker: 'Target assessment agent',
    kickerZh: '靶点评估 Agent',
    image: '/figures/gnosight.webp',
    imageAlt: 'GnoSight target assessment agent',
    href: 'https://hidiamondbio.biomap.com/',
    description:
      'An online agent for target-value assessment that connects target biology, disease association, clinical evidence, and literature into an experiential evaluation entry—with end-to-end tracing and lower inference cost.',
    descriptionZh:
      '面向靶点价值评估的线上 Agent：串联靶点生物学、疾病关联、临床与文献证据，形成可体验的评估入口，并支持端到端追踪与推理成本优化。',
    kpis: [
      {
        value: '4',
        valueZh: '4',
        label: 'Production Releases',
        labelZh: '生产版本发布'
      },
      {
        value: '30% ↓',
        valueZh: '30% ↓',
        label: 'Token Cost',
        labelZh: 'Token 成本'
      },
      {
        value: 'End-to-End',
        valueZh: '端到端',
        label: 'Traceability',
        labelZh: '全链路可追踪',
        hint: 'Request → Tool → Report',
        hintZh: '请求 → 工具 → 报告',
        compactValue: true
      }
    ]
  }
];
