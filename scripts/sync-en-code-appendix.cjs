/**
 * Enrich short EN sections by appending every fenced code/mermaid block
 * from the ZH half, so English UI still has runnable snippets.
 */
const fs = require('fs');
const path = require('path');

const files = [
  'src/content/blog/后端/Docker 零基础入门到实战.md',
  'src/content/notes/llm/rag-basics.md',
  'src/content/blog/Agent前沿知识/Harness Engineering 基石：构建 LLM 应用可追溯性——LangSmith、Langfuse 与 Sentry 深度解析.md',
  'src/content/blog/Agent前沿知识/AI Agent 高并发实战：Redis 限流、队列、缓存与高可用全栈方案.md'
];

const fenceRe = /```[\s\S]*?```/g;

for (const file of files) {
  const abs = path.resolve(file);
  let body = fs.readFileSync(abs, 'utf8');
  const marker = '<!-- i18n:en -->';
  const idx = body.indexOf(marker);
  if (idx < 0) continue;
  const zh = body.slice(0, idx);
  let en = body.slice(idx + marker.length);
  if (en.includes('<!-- en-code-sync -->')) {
    console.log('skip sync', file);
    continue;
  }
  const blocks = zh.match(fenceRe) || [];
  if (!blocks.length) continue;
  const appendix = [
    '',
    '<!-- en-code-sync -->',
    '',
    '## Appendix: Code & diagrams from the article',
    '',
    'The English narrative above is localized for the language toggle. The following fenced blocks are copied unchanged from the Chinese version so you can still copy-paste every command and snippet while reading in English.',
    '',
    ...blocks
  ].join('\n');
  en = en.trimEnd() + '\n' + appendix + '\n';
  body = body.slice(0, idx + marker.length) + '\n' + en;
  fs.writeFileSync(abs, body);
  console.log('synced code blocks:', file, blocks.length);
}
