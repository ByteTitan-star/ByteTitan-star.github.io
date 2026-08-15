const fs = require('fs');
const path = require('path');

function replaceEnSection(target, enBodyPath) {
  const abs = path.resolve(target);
  const enBody = fs.readFileSync(path.resolve(enBodyPath), 'utf8').replace(/^\uFEFF/, '');
  let body = fs.readFileSync(abs, 'utf8');
  const marker = '<!-- i18n:en -->';
  const idx = body.indexOf(marker);
  if (idx < 0) throw new Error('missing marker: ' + target);
  const head = body.slice(0, idx + marker.length);
  const next = `${head}\n\n${enBody.trim()}\n`;
  fs.writeFileSync(abs, next);
  console.log('replaced EN:', target, 'chars', enBody.length);
}

const job = process.argv[2];
const map = {
  eval: [
    'src/content/blog/Agent前沿知识/Agent评估：Agent到底靠不靠谱.md',
    'scripts/en-full/agent-eval.en.md'
  ],
  docker: [
    'src/content/blog/后端/Docker 零基础入门到实战.md',
    'scripts/en-full/docker.en.md'
  ],
  rag: [
    'src/content/notes/llm/rag-basics.md',
    'scripts/en-full/rag.en.md'
  ],
  harness: [
    'src/content/blog/Agent前沿知识/Harness Engineering 基石：构建 LLM 应用可追溯性——LangSmith、Langfuse 与 Sentry 深度解析.md',
    'scripts/en-full/harness.en.md'
  ],
  redis: [
    'src/content/blog/Agent前沿知识/AI Agent 高并发实战：Redis 限流、队列、缓存与高可用全栈方案.md',
    'scripts/en-full/redis.en.md'
  ]
};

if (!map[job]) {
  console.error('usage: node scripts/replace-en-section.cjs <eval|docker|rag|harness|redis>');
  process.exit(1);
}
replaceEnSection(map[job][0], map[job][1]);
