export type Publication = {
  title: string;
  authors: { name: string; self?: boolean }[];
  venue: string;
  venueZh: string;
  year: string;
  category: string;
  categoryZh: string;
  tags: string[];
  image: string;
  imageAlt: string;
  description: string;
  descriptionZh: string;
  paper?: string;
  code?: string;
  bibtex?: string;
};

export const publications: Publication[] = [
  {
    title: 'AGPD-Net: Adaptive Gaussian-Prior Decomposition for Long-Term Time Series Forecasting',
    authors: [
      { name: 'YP Sun' },
      { name: 'Lei Zhang' },
      { name: 'Xin Wang', self: true }
    ],
    venue: 'Accepted at WISA 2026',
    venueZh: 'WISA 2026 已录用',
    year: '2026',
    category: 'Time Series · Forecasting',
    categoryZh: '时间序列 · 预测',
    tags: ['Gaussian Prior', 'Decomposition', 'Attention', 'Forecasting'],
    image: '/figures/agpdnet.webp',
    imageAlt: 'AGPD-Net overview',
    description:
      'AGPD-Net uses an adaptive Gaussian-prior decomposition module and dual-path attention to model non-stationary trends, multi-scale variation, intra-series evolution, and inter-variable dependencies for long-term forecasting. The decomposition separates complex temporal patterns into manageable components, while complementary attention paths preserve within-series dynamics and cross-variable relationships for richer stable long-horizon representations.',
    descriptionZh:
      'AGPD-Net 通过自适应高斯先验分解与双路径注意力，同时建模非平稳趋势、多尺度变化、序列内演化和变量间依赖，用于长期时间序列预测。该方法进一步通过分解过程把复杂时间模式组织为更易建模的成分，并利用两条互补的注意力路径同时保留单个序列内部的动态变化与不同变量之间的关联，从而形成更完整的长期演化表示。'
  },
  {
    title: 'Selection Aware Poisoning Boosting Clean Label Backdoor Attacks via Distribution Deviation and Projection Residual Metrics',
    authors: [
      { name: 'Xin Wang', self: true },
      { name: 'Liming Liu' },
      { name: 'Xu Han' },
      { name: 'Yuanbo Li' },
      { name: 'Jun Li' },
      { name: 'Lei Zhang' }
    ],
    venue: 'Accepted at IJCNN 2026',
    venueZh: 'IJCNN 2026 已录用',
    year: '2026',
    category: 'AI Security · Backdoor Attack',
    categoryZh: 'AI 安全 · 后门攻击',
    tags: ['Clean-label', 'Backdoor', 'Poisoning', 'Model Security'],
    image: '/figures/2026IJCNN-pipeline.webp',
    imageAlt: 'IJCNN 2026 pipeline',
    description:
      'We propose two training-free, auxiliary-data-free sample selection metrics, DDM and PRM, to identify high-risk poisoning samples and strengthen clean-label backdoor attacks across datasets and architectures. Rather than treating candidates equally, the method prioritizes samples with poisoning potential before attack construction, making selection more targeted without extra training or external data.',
    descriptionZh:
      '提出两种无需训练、无需辅助数据的样本选择指标 DDM 与 PRM，用于识别高风险投毒样本，并在多种数据集和模型架构上增强干净标签后门攻击效果。与对所有候选样本进行同等处理不同，该方法在构造攻击之前优先筛选更具投毒潜力的样本，使样本选择过程更加有针对性，同时保持干净标签设定，并避免额外训练流程或外部辅助数据。'
  }
];
