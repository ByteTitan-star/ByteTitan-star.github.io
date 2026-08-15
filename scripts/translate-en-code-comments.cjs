const fs = require('fs');
const path = require('path');

const cjk = /[\u4e00-\u9fff]/;
const marker = '<!-- i18n:en -->';

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.md$/i.test(e.name)) out.push(p);
  }
  return out;
}

function translateFence(lang, code) {
  // --- Agent paradigms ---
  if (code.includes('def react_agent')) {
    return `def react_agent(user_query):
    while True:
        # 1. Reason: ask the LLM for a Thought and optional Action from history + state
        thought, action = llm.generate_thought_and_action(user_query, history)
        if action is None:
            # No more actions — return the final answer
            return thought
        # 2. Act: execute the tool call
        observation = execute_tool(action)
        # 3. Append the observation to history and continue
        history.append(f"Observation: {observation}")
`;
  }
  if (code.includes('def plan_and_execute_agent')) {
    return `def plan_and_execute_agent(user_query):
    # Step 1: create a plan
    plan = llm.create_plan(user_query)  # returns a list of steps
    context = {}
    for step in plan:
        if step.requires_tool:
            # Executor invokes tools
            result = execute_tool(step.action, context)
            context.update(result)
        else:
            # Executor produces text or an operation directly
            result = llm.execute_step(step, context)
            context.update(result)
    return context["final_answer"]
`;
  }
  if (code.includes('def rewoo_agent')) {
    return `def rewoo_agent(user_query):
    # 1. Planner emits a plan with special markers for tool calls, e.g. #E1 = search("xxx")
    plan = llm.generate_plan_with_tool_placeholders(user_query)
    # 2. Worker parses the plan, extracts all tool calls, and runs them in batch
    observations = resolve_all_tools(plan)
    # 3. Solver substitutes observations back into the plan and produces the final answer
    final_answer = llm.generate_final_answer(plan, observations)
    return final_answer
`;
  }
  if (code.includes('def llm_compiler_agent')) {
    return `def llm_compiler_agent(user_query):
    # 1. Compiler builds a DAG
    dag = llm.generate_dag(user_query)  # nodes are function calls; edges are dependencies
    # 2. Execute in parallel
    results = parallel_execute(dag)  # dependency-aware concurrency
    # 3. Merge the final result
    final_answer = llm.merge_results(results)
    return final_answer
`;
  }

  // --- Agent eval ---
  if (code.includes('def generate_qa_pairs')) {
    return `import json
from openai import OpenAI

client = OpenAI()

def generate_qa_pairs(documents: list[str], num_pairs: int = 10) -> list[dict]:
    """
    Auto-generate QA pairs from document content with an LLM.
    """
    qa_pairs = []
    for doc in documents:
        prompt = f"""You are a professional test-data generator. Based on the document below,
generate {num_pairs} high-quality question-answer pairs.
Requirements:
- Questions must be grounded in the document — no invented facts
- Answers must be accurate and complete, citing concrete details from the text
- Diversify question types: fact lookup, comparison, summarization, etc.
- Return a JSON array; each element has "question" and "answer" fields

Document:
{doc[:3000]}  # truncate to stay within the token budget
"""
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.7
        )
        result = json.loads(response.choices[0].message.content)
        qa_pairs.extend(result.get("qa_pairs", []))
    return qa_pairs

# Usage example
documents = [
    "RAG combines retrieval and generation: it retrieves relevant docs from a knowledge base, then has the LLM answer grounded in those docs.",
    "RAG's core strength is reducing hallucinations so LLM answers stay evidence-based."
]
qa_pairs = generate_qa_pairs(documents, num_pairs=3)
for qa in qa_pairs:
    print(f"Q: {qa['question']}\\nA: {qa['answer']}\\n")
`;
  }
  if (code.includes('from datasets import Dataset') && code.includes('ground_truth')) {
    return `from datasets import Dataset
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy, context_precision, context_recall

# Evaluation data: question, answer, retrieved contexts, optional ground truth
eval_dataset = Dataset.from_dict({
    "question": ["What is RAG?", "What are RAG's advantages?"],
    "answer": [
        "RAG combines retrieval and generation: it retrieves relevant docs, then has the LLM answer from them.",
        "RAG's core strengths are fewer hallucinations, better traceability, and access to up-to-date knowledge."
    ],
    "contexts": [
        ["RAG combines retrieval and generation..."],
        ["RAG advantages include fewer hallucinations, better traceability, and up-to-date knowledge..."]
    ],
    "ground_truth": [
        "RAG stands for Retrieval-Augmented Generation — a pattern that combines retrieval and generation.",
        "RAG can reduce hallucinations, improve answer traceability, and use the latest knowledge."
    ]
})

# Run evaluation
result = evaluate(
    eval_dataset,
    metrics=[faithfulness, answer_relevancy, context_precision, context_recall]
)
print(result)
# Example output:
# {'faithfulness': 0.95, 'answer_relevancy': 0.88, 'context_precision': 0.92, 'context_recall': 0.85}
`;
  }
  if (code.includes('FaithfulnessMetric') && code.includes('assert_test')) {
    return `from deepeval import assert_test
from deepeval.metrics import FaithfulnessMetric, AnswerRelevancyMetric
from deepeval.test_case import LLMTestCase

# Define a test case
test_case = LLMTestCase(
    input="What are RAG's advantages?",
    actual_output="RAG can reduce hallucinations, improve answer traceability, and use up-to-date knowledge.",
    retrieval_context=[
        "RAG advantages include fewer hallucinations, better traceability, and up-to-date knowledge."
    ]
)

# Metrics with thresholds
faithfulness_metric = FaithfulnessMetric(threshold=0.8)
answer_relevancy_metric = AnswerRelevancyMetric(threshold=0.7)

# Run the test
def test_rag_quality():
    assert_test(test_case, [faithfulness_metric, answer_relevancy_metric])
    # Fails if faithfulness < 0.8 or answer relevancy < 0.7
`;
  }
  if (lang === 'yaml' && /阻断 CI/.test(code)) {
    return code.replace(
      /# 如果评估分数低于阈值，退出码非 0，阻断 CI/,
      '# Non-zero exit if scores are below threshold — block the CI pipeline'
    );
  }

  // --- Harness ASCII diagram ---
  if (code.includes('用户请求')) {
    return `            User request
               |
        [ LLM application service ]
          /      |      \\
    SDK call  SDK report  Exception
    (callback)  (async)    (capture)
      |         |         |
   LangSmith   Langfuse   Sentry
  (experiment/ (prod obs) (error
   debug)                  tracking)
`;
  }

  // --- Docker ---
  if (code.includes('docker --version') && cjk.test(code)) {
    return `# Check Docker version — a version string means install succeeded
docker --version
# Inspect Docker details and confirm the daemon is healthy
docker info
`;
  }
  if (code.includes('AS builder') && cjk.test(code)) {
    return `# Build stage: full Node image — install deps and build the project
FROM node:18-alpine AS builder
# Set working directory
WORKDIR /app
# Copy package.json first to leverage layer cache when deps are unchanged
COPY package*.json ./
# Install dependencies
RUN npm install
# Copy the rest of the project
COPY . .
# Build artifacts into dist/
RUN npm run build

# Runtime stage: lightweight nginx — keep only build output
FROM nginx:1.25-alpine
# Copy dist from the builder into nginx's static root
COPY --from=builder /app/dist /usr/share/nginx/html
# Declare port 80
EXPOSE 80
# Start nginx
CMD ["nginx", "-g", "daemon off;"]
`;
  }
  if (code.includes('docker volume create mysql-data') && cjk.test(code)) {
    return `    # Create a volume named mysql-data
    docker volume create mysql-data
    # Run MySQL and mount the data directory to the volume
    docker run -d --name mysql-demo -p 3306:3306 -v mysql-data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 mysql:8.0
`;
  }
  if (code.includes('docker network create my-net') && cjk.test(code)) {
    return `    # 1. Create a custom bridge network
    docker network create my-net
    # 2. Run MySQL on my-net
    docker run -d --name mysql-demo --network my-net -e MYSQL_ROOT_PASSWORD=123456 mysql:8.0
    # 3. Run the backend on the same network — reach MySQL by container name mysql-demo
    docker run -d --name backend-demo --network my-net my-backend:v1
`;
  }
  if (code.includes('<title>我的个人博客</title>')) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Personal Blog</title>
</head>
<body>
    <h1>Welcome to My Personal Blog</h1>
    <p>This is a static blog deployed with Docker</p>
</body>
</html>
`;
  }
  if (code.includes('COPY ./index.html') && cjk.test(code)) {
    return `# Lightweight nginx alpine as the base image
FROM nginx:1.25-alpine
# Copy local HTML into nginx's static root
COPY ./index.html /usr/share/nginx/html/index.html
# Declare port 80
EXPOSE 80
# Run nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
`;
  }

  // --- RAG ---
  if (code.includes('RecursiveCharacterTextSplitter')) {
    return `from langchain.text_splitter import RecursiveCharacterTextSplitter

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=512,        # max tokens per chunk
    chunk_overlap=50,      # overlap tokens to keep context continuity
    separators=["\\n\\n", "\\n", "。", ".", " "],  # prefer semantic boundaries (incl. Chinese period)
)
chunks = text_splitter.split_text(document)
`;
  }
  if (code.includes('def multi_stage_recall')) {
    return `def multi_stage_recall(query, top_k=10):
    # 1. Vector recall
    vec_results = vector_db.search(query, top_k=top_k)

    # 2. BM25 keyword recall
    bm25_results = bm25_index.search(query, top_k=top_k)

    # 3. Merge and deduplicate
    all_results = merge_and_deduplicate(vec_results, bm25_results)

    # 4. Rerank with a reranker
    reranked = reranker.rerank(query, all_results, top_k=5)
    return reranked
`;
  }
  if (code.includes('def rrf(')) {
    return `def rrf(results_lists, k=60):
    """
    results_lists: ranked result lists from multiple recall channels (best first)
    """
    scores = {}
    for rank_list in results_lists:
        for rank, doc_id in enumerate(rank_list):
            scores[doc_id] = scores.get(doc_id, 0) + 1.0 / (k + rank + 1)
    return sorted(scores.items(), key=lambda x: x[1], reverse=True)
`;
  }
  if (code.includes('你是一个基于给定资料') || code.includes('参考资料：')) {
    return `You are an assistant that answers only from the provided reference material.
If the material does not contain the answer, say "I don't know" — do not invent.

Reference material:
{retrieved_context}

User question: {query}

Answer requirements:
1. Prefer extracting facts from the references
2. If references conflict, call that out
3. Cite sources as [Source: document name]
4. If information is incomplete, state what is missing
`;
  }
  if (code.includes('faithfulness_score') && code.includes('ragas')) {
    return `from ragas.metrics import faithfulness
from ragas import evaluate

# Auto-evaluate faithfulness after generation
faithfulness_score = evaluate(
    dataset,
    metrics=[faithfulness]
)
# If below threshold, degrade to an unreliable-answer response
if faithfulness_score < 0.7:
    return "Based on the current material, I cannot give a reliable answer. Please confirm with a human."
`;
  }
  if (code.includes('class SearchQuery')) {
    return `from typing import Optional
from pydantic import BaseModel

class SearchQuery(BaseModel):
    query_text: str           # semantic search text
    author: Optional[str]     # filter: author
    date_range: Optional[str] # filter: time range
    category: Optional[str]   # filter: category

# Use an LLM to parse user input into a structured SearchQuery
# e.g. user: "Transformer papers from 2024"
# -> query_text="Transformer papers", date_range="2024"
`;
  }
  if (code.includes('def rewrite_query')) {
    return `def rewrite_query(original_query: str, conversation_history: list = None) -> str:
    """
    Rewrite the user question with an LLM — resolve pronouns and normalize phrasing
    """
    prompt = f"""
    Rewrite the user question into a clearer retrieval query with explicit keywords.
    Keep all key entities and constraints; fill in missing referents when possible.

    Original question: {original_query}
    Conversation history: {conversation_history}

    Output only the rewritten query text:
    """
    return llm.generate(prompt)
`;
  }

  return null;
}

function rewriteBody(body) {
  let replaced = 0;
  const unhandled = [];
  const next = body.replace(/```([\w-]*)\n([\s\S]*?)```/g, (full, lang, code) => {
    if (!cjk.test(code)) return full;
    const eng = translateFence(lang || '', code);
    if (!eng) {
      unhandled.push({
        lang,
        lines: code.split('\n').filter((l) => cjk.test(l)).slice(0, 8),
      });
      return full;
    }
    replaced++;
    return '```' + lang + '\n' + eng.replace(/\n$/, '') + '\n```';
  });
  return { next, replaced, unhandled };
}

function processMarkdown(file) {
  const abs = path.resolve(file);
  const body = fs.readFileSync(abs, 'utf8');
  const idx = body.indexOf(marker);
  if (idx < 0) return { file, skipped: true };
  const head = body.slice(0, idx + marker.length);
  const { next, replaced, unhandled } = rewriteBody(body.slice(idx + marker.length));
  fs.writeFileSync(abs, head + next);
  return { file, replaced, unhandled };
}

function processEnFull() {
  const dir = 'scripts/en-full';
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((n) => n.endsWith('.en.md'))
    .map((n) => {
      const abs = path.join(dir, n);
      const body = fs.readFileSync(abs, 'utf8');
      const { next, replaced, unhandled } = rewriteBody(body);
      fs.writeFileSync(abs, next);
      return { file: abs, replaced, unhandled };
    });
}

const summary = [];
for (const f of walk('src/content')) {
  const r = processMarkdown(f);
  if (!r.skipped) summary.push(r);
}
summary.push(...processEnFull());

let total = 0;
for (const r of summary) {
  total += r.replaced || 0;
  if ((r.replaced || 0) > 0 || (r.unhandled || []).length) {
    console.log(r.file, 'replaced=', r.replaced, 'unhandled=', (r.unhandled || []).length);
    for (const u of r.unhandled || []) console.log('  ', u.lang, u.lines);
  }
}
console.log('TOTAL replaced', total);

const remaining = [];
for (const f of walk('src/content')) {
  const b = fs.readFileSync(f, 'utf8');
  const i = b.indexOf(marker);
  if (i < 0) continue;
  const en = b.slice(i);
  const re = /```([\w-]*)\n([\s\S]*?)```/g;
  let m;
  while ((m = re.exec(en))) {
    if (!cjk.test(m[2])) continue;
    remaining.push({
      file: f,
      lang: m[1],
      lines: m[2].split('\n').filter((l) => cjk.test(l)),
    });
  }
}
console.log('REMAINING CJK fences:', remaining.length);
for (const r of remaining) {
  console.log(r.file, r.lang, r.lines.join(' | '));
}
fs.writeFileSync('scripts/_cjk-remaining.json', JSON.stringify(remaining, null, 2));
