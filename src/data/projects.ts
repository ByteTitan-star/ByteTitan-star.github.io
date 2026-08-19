export type Project = {
  number: string;
  title: string;
  kicker: string;
  kickerZh: string;
  image: string;
  imageAlt: string;
  source: string;
  demo?: string;
  description: string;
  descriptionZh: string;
  stack: string[];
  flow: string[];
};

export const projects: Project[] = [
  {
    number: '01',
    title: 'GameForge',
    kicker: 'AI-powered browser game studio',
    kickerZh: '浏览器 AI 游戏工作室',
    image: '/figures/GameForge.png',
    imageAlt: 'GameForge System',
    source: 'https://github.com/ByteTitan-star/GameForge-Copilot',
    demo: 'http://62.234.65.18/agent',
    description:
      'An AI-assisted browser game studio that turns a natural-language gameplay idea into a playable browser game through multi-round dialogue, structured planning, human confirmation, and generation with live progress. It supports delivery targets such as React and other modern web frameworks, and creators can playtest in the browser, manage versions, meter tokens, and download or publish builds without writing code.',
    descriptionZh:
      '面向浏览器游戏的 AI 辅助创作工作区：从自然语言玩法描述出发，经多轮对话、结构化策划、人工确认与游戏生成，得到可直接试玩的浏览器游戏作品，并支持 React 等现代前端框架交付；同时继续完成版本管理、Token 计量、下载与发布，把创意推进为可交付的浏览器游戏。',
    stack: ['React 19', 'Harness', 'LangGraph', 'Langfuse', 'Sandbox', 'FastAPI', 'Redis', 'RabbitMQ', 'SSE', 'Agent'],
    flow: ['IDEA', 'PLAN', 'CONFIRM', 'GENERATE', 'PLAY']
  },
  {
    number: '02',
    title: 'PaperDistiller',
    kicker: 'Multi-agent research workspace',
    kickerZh: '多智能体科研工作台',
    image: '/figures/paperDistriller.png',
    imageAlt: 'PaperDistiller System',
    source: 'https://github.com/ByteTitan-star/Agent_PaperDistiller',
    description:
      'A unified research workspace for paper reading and analysis that combines PDF parsing, layout-aware structured extraction, RAG question answering, novelty analysis, bilingual translation, and collaborative agents. Task orchestration, streaming feedback, and knowledge-base management connect the full path from paper import to understanding and insight capture.',
    descriptionZh:
      '围绕论文阅读与科研分析场景，把 PDF 解析、版面与结构化信息抽取、RAG 检索问答、创新点分析、双语翻译和多智能体协作整合到统一工作流中，并通过任务编排、流式反馈与知识库管理串联从论文导入、内容理解到观点沉淀的完整过程，减少工具切换与重复整理成本。',
    stack: ['Vue 3', 'FastAPI', 'RAG', 'LangGraph', 'ToT', 'SSE', 'ChromaDB', 'BM25'],
    flow: ['PDF', 'PARSE', 'RETRIEVE', 'AGENTS', 'INSIGHT']
  },
  {
    number: '03',
    title: 'SoulMate',
    kicker: 'Personalized AI companion platform',
    kickerZh: '个性化 AI 伴侣平台',
    image: '/figures/SoulMate.png',
    imageAlt: 'SoulMate Application',
    source: 'https://github.com/ByteTitan-star/Agent_SoulMate',
    description:
      'A full-stack AI companion designed for long-term personalized interaction, with user-defined personas, private knowledge binding, short- and long-term conversational memory, tool use, and scalable vector retrieval. The system coordinates persona management, context assembly, knowledge recall, and continuous dialogue so each character can respond consistently from user-owned information.',
    descriptionZh:
      '面向长期陪伴与个性化交互场景，支持用户自定义角色设定、私有知识绑定、长期与短期对话记忆、工具调用和可扩展向量检索，并通过前后端协作完成角色管理、上下文组织、知识召回与连续对话，让不同角色能够基于用户自己的资料形成更稳定、更具连续性的交互体验。',
    stack: ['React 18', 'Django 4', 'LangChain', 'Agent', 'Milvus'],
    flow: ['PERSONA', 'MEMORY', 'TOOLS', 'KNOWLEDGE', 'CHAT']
  }
];
