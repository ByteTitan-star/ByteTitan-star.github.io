const fs = require('fs');
const path = require('path');

function upsertFrontmatter(body, titleEn, descriptionEn) {
  if (!body.startsWith('---')) return body;
  const end = body.indexOf('\n---', 3);
  if (end < 0) return body;
  let fm = body.slice(4, end);
  const rest = body.slice(end + 4);
  if (!/^titleEn:/m.test(fm)) {
    fm = fm.replace(/^title:.*$/m, (line) => `${line}\ntitleEn: ${JSON.stringify(titleEn)}`);
  }
  if (!/^descriptionEn:/m.test(fm)) {
    fm = fm.replace(/^description:.*$/m, (line) => `${line}\ndescriptionEn: ${JSON.stringify(descriptionEn)}`);
  }
  return `---\n${fm}\n---${rest}`;
}

/** Keep code/mermaid fences; lightly mark prose for EN panel by wrapping isn't possible.
 *  Strategy: append provided EN markdown file which should include needed diagrams/code.
 */
function merge({ target, appendFile, titleEn, descriptionEn }) {
  const absTarget = path.resolve(target);
  const append = fs.readFileSync(path.resolve(appendFile), 'utf8');
  let body = fs.readFileSync(absTarget, 'utf8');
  if (body.includes('<!-- i18n:en -->')) {
    console.log('skip:', target);
    return;
  }
  body = upsertFrontmatter(body, titleEn, descriptionEn);
  const out = `${body.trimEnd()}\n${append.startsWith('\n') ? append : `\n${append}`}`;
  fs.writeFileSync(absTarget, out);
  console.log('merged:', target);
}

const jobs = [
  {
    target: 'src/content/blog/Agent前沿知识/Agent评估：Agent到底靠不靠谱.md',
    appendFile: 'scripts/en-append/agent-eval.en.md',
    titleEn: 'Agent Evaluation: Can You Trust Your Agent?',
    descriptionEn:
      'When Agents fail after launch, you need a real eval system. This article covers metrics, datasets, RAGAS/DeepEval, CI automation, and online feedback loops for RAG Agents.'
  },
  {
    target: 'src/content/blog/后端/Docker 零基础入门到实战.md',
    appendFile: 'scripts/en-append/docker.en.md',
    titleEn: 'Docker from Zero to Practice',
    descriptionEn:
      'A cloud-native starter guide to Docker—from core concepts and setup to multi-stage builds, persistence, networking, and a path from local to production.'
  },
  {
    target: 'src/content/notes/llm/rag-basics.md',
    appendFile: 'scripts/en-append/rag.en.md',
    titleEn: 'RAG Basics: From First Principles to Production',
    descriptionEn:
      'RAG is the key engineering skill for LLM apps. This note covers chunking, embeddings, hybrid recall, rerankers, grounded generation, and evaluation pitfalls.'
  },
  {
    target: 'src/content/blog/Agent前沿知识/Harness Engineering 基石：构建 LLM 应用可追溯性——LangSmith、Langfuse 与 Sentry 深度解析.md',
    appendFile: 'scripts/en-append/harness.en.md',
    titleEn: 'Harness Engineering Foundations: Building LLM App Traceability — Deep Dive into LangSmith, Langfuse, and Sentry',
    descriptionEn:
      'As software moves from deterministic to probabilistic systems, traceability becomes the foundation for harnessing LLMs. Deep dive into LangSmith, Langfuse, and Sentry as a complete traceability stack.'
  },
  {
    target: 'src/content/blog/Agent前沿知识/AI Agent 高并发实战：Redis 限流、队列、缓存与高可用全栈方案.md',
    appendFile: 'scripts/en-append/redis-ha.en.md',
    titleEn: 'AI Agent High-Concurrency in Practice: Redis Rate Limiting, Queues, Caching, and High Availability',
    descriptionEn:
      'High concurrency is the first hurdle when shipping an Agent. Gateway limits, Redis Streams, cache defenses, distributed locks, and Sentinel HA—end to end.'
  }
];

for (const job of jobs) merge(job);
