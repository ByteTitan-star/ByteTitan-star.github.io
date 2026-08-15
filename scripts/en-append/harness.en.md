

<!-- i18n:en -->

# Harness Engineering Foundations: LLM App Traceability with LangSmith, Langfuse, and Sentry

> As software shifts from deterministic logic to probabilistic generation, we are no longer only “debugging code”—we are steering models.  
> **Harness Engineering** treats LLM applications as complex systems to govern, not features to slap together.  
> Governance starts with **traceability**: every inference path, every dollar of cost, every failure cause must be visible.  
> This article unpacks how LangSmith, Langfuse, and Sentry cover development, production, and exception attribution as one stack.

## 1. Why Traceability Is the Harness

LLM apps fail in new ways: silent quality regressions, tool-call storms, prompt drift, and cost spikes without a stack trace that classic APM understands. Without traces/spans for prompts, retrieval, tools, and model I/O, you cannot reproduce or improve.

## 2. The Triad

| Layer | Tool | Primary job |
| --- | --- | --- |
| Dev debugging | **LangSmith** | Dataset runs, prompt diffs, step-level traces while building |
| Prod observability | **Langfuse** | Self-hostable tracing, scores, cost/latency dashboards |
| Exception attribution | **Sentry** | Error grouping, release health, user impact for the non-LLM periphery |

Use them together: LangSmith for iteration speed, Langfuse for continuous prod truth, Sentry for crashes and infrastructure faults around the model path.

## 3. LangSmith in Development

Capture nested runs (chain → retriever → LLM → tool). Attach datasets and evaluators. Compare prompt versions on the same cases before you ship. Treat traces as the unit of debugging—not log lines alone.

## 4. Langfuse in Production

Open-source friendly tracing with scores (user feedback / LLM judges), token cost, and latency histograms. Sample wisely at high QPS; keep PII redaction policies explicit. Feed online negatives back into eval sets (see the Agent Evaluation article).

## 5. Sentry for the Edges

Model calls can “succeed” HTTP-wise while business logic throws. Sentry still owns unhandled exceptions, release regressions, and performance transactions for API/gateway layers. Correlate `trace_id` across Langfuse and Sentry where possible.

## 6. A Practical Wiring Pattern

1. Instrument every LLM/tool span with a shared request id  
2. Record prompts/outputs with redaction  
3. Score critical paths (faithfulness / task success)  
4. Alert on error rate, P99 latency, and cost anomalies  
5. Close the loop: prod failure → dataset case → LangSmith re-run → fix → release  

## 7. Closing

Harness Engineering is not a dashboard fad—it is how you keep probabilistic systems under control. LangSmith, Langfuse, and Sentry each cover a blind spot; together they make LLM apps operable.

> Keep any code/config samples from the Chinese section unchanged; diagrams and narrative above follow the English UI language.
