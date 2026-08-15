---

title: "Harness Engineering 基石：构建 LLM 应用可追溯性——LangSmith、Langfuse 与 Sentry 深度解析"
titleEn: "Harness Engineering Foundations: Building LLM App Traceability — Deep Dive into LangSmith, Langfuse, and Sentry"
description: "当软件从确定性进入概率时代，可追溯性成为驾驭 LLM 的基石。本文深度解析 LangSmith、Langfuse、Sentry 铁三角组合，分别覆盖开发调试、生产观测与异常归因，构建完整的 LLM 应用可追溯性体系。"
descriptionEn: "As software moves from deterministic to probabilistic systems, traceability becomes the foundation for harnessing LLMs. This article deep-dives into the LangSmith, Langfuse, and Sentry triad—covering development debugging, production observability, and exception attribution—to build a complete LLM application traceability stack."
pubDate: 2026-08-12
---

# Harness Engineering 基石：构建 LLM 应用可追溯性——LangSmith、Langfuse 与 Sentry 深度解析

> 当软件从确定性逻辑迈入概率生成时代，我们不再只是在“调试代码”，而是在“调教模型”。  
> Harness Engineering（驾驭工程）应运而生，它要求我们将大语言模型（LLM）应用当作一个复杂系统去治理，而非一个简单功能去实现。  
> 而治理的起点，永远是可追溯性——你必须看得见每一次推理的完整路径、每一分钱的成本流向、每一次失败的深层原因。  
> 本文将用万字篇幅，系统拆解 LangSmith、Langfuse 与 Sentry 如何分别覆盖开发、生产与异常场景，最终编织成一张无缝的可追溯性网络。

---

## 第一章 当“黑箱”成为新常态：为什么我们需要 Harness Engineering

在传统软件工程中，一个函数的输出由输入和内部逻辑唯一确定。当系统出问题时，我们可以依赖日志、堆栈追踪和断点调试，逐步逼近真相。这种“可追溯性”是开发者与系统之间的信任契约——一切行为都可以被解释，一切状态都可以被复现。

然而，大语言模型彻底打破了这层契约。同样的提示词，在不同时间可能产生截然不同的结果；一个看似完美的 Agent 链路，可能仅仅因为工具返回格式的微小变化就全线崩溃；你甚至无法精确计算一次请求的实际成本，因为 Token 用量、模型版本、重试策略都让账单变得难以预测。

**Harness Engineering（驾驭工程）** 正是在这种混沌中提出的解决方案。它不是一套工具，而是一种**思维范式转换**：

- 从 **“控制”** 到 **“驾驭”** ：我们无法完全控制 LLM 的输出，但可以通过工程手段引导、观测、约束和优化它的行为。
- 从 **“代码为中心”** 到 **“数据流为中心”** ：LLM 应用的本质是数据（提示词、上下文、工具输出）的流动与转换，必须将这条数据流完整地记录下来。
- 从 **“事后排查”** 到 **“全息记录”** ：在调用发生的那一刻，就为未来的任何疑问埋下线索，而不是等故障发生后再去大海捞针。

Harness Engineering 的四大支柱分别是：**可追溯性（Observability/Traceability）、可评估性（Evaluation）、可治理性（Guardrails）和可优化性（Optimization）**。而本文要聚焦的，正是最基础也是最关键的一环——**可追溯性**。

可追溯性回答了五个根本问题：
1. **发生了什么？**（完整调用链与输入输出）
2. **代价是什么？**（成本与延迟）
3. **为什么发生？**（决策路径与上下文）
4. **在哪里出错？**（异常定位与归因）
5. **如何改进？**（实验回溯与对比）

为了构建这样的可追溯性体系，我们无法依赖单一工具。LLM 应用的生命周期包含三个截然不同的阶段：**开发调试期、生产运行期、故障排查期**。每个阶段对“追溯”的粒度和侧重点都有不同要求。经过业界大量实践，一个稳定的铁三角组合逐渐浮现：

- **LangSmith**：负责开发调试期的追踪与评估，让“实验”可追溯。
- **Langfuse**：负责生产环境的全量观测与成本治理，让“运行”可追溯。
- **Sentry**：负责全生命周期的错误捕捉与堆栈还原，让“失败”可追溯。

三者绝非简单的“监控全家桶”，而是在 Harness Engineering 思想下，围绕“可追溯性”这一核心目标，形成了完美的分工与互补。接下来，我们将逐一深入它们的设计哲学、核心能力、追踪机制以及最佳实践，并最终展示它们如何协同编织出驾驭 LLM 的缰绳。

---

## 第二章 LangSmith：开发期的“实验追踪者”

### 2.1 定位：LLM 开发者的调试工作台

LangSmith 由 LangChain 团队打造，其初衷是解决 LLM 应用开发过程中最棘手的几个挑战：提示词调试、链路编排验证、模型选型对比。它在业界的定位非常清晰——LLM 应用的 **“开发期可观测性平台”**。

在传统开发模式下，你修改了一行代码，通过单元测试或肉眼查看日志来验证效果。但在 LLM 开发中，你修改的可能只是一句提示词，却可能导致下游 Agent 的逻辑走向完全不同的分支。如果没有端到端的链路追踪，你将陷入反复试错的噩梦。

LangSmith 的思路是：**将每一次 LLM 调用抽象为一个“Trace（追踪）”，让开发者能够像浏览分布式调用链一样，审视一次推理的完整生命周期。**

### 2.2 核心能力拆解

#### 2.2.1 自动埋点与无侵入追踪

LangSmith 最强大的地方在于其对主流 LLM 框架的深度集成。无论你使用的是 LangChain、LlamaIndex、Haystack，还是直接调用 OpenAI/Azure SDK，只需设置几个环境变量并引入回调处理器，即可自动捕获调用链，无需手动编写埋点代码。

这种“零侵入”的设计思想，完美契合 Harness Engineering 中“可追溯性不应成为开发负担”的理念。开发者只需关注业务逻辑，追踪信号会自动附着在每一次 LLM 调用上，并随数据流贯穿整个应用。

#### 2.2.2 Trace 树状结构：还原决策路径

LangSmith 的 Trace 并不是扁平的日志列表，而是一个**层次化调用树**。一次典型的 Agent 调用可能产生如下结构：

- **根 Span**：用户请求入口
    - **LLM 调用 Span**：第一次模型推理（思考与工具选择）
        - 提示词模板
        - 模型参数（温度、top_p）
        - 输入消息与输出
    - **工具调用 Span**：执行搜索引擎或数据库查询
        - 工具输入参数
        - 工具返回结果
    - **LLM 调用 Span**：第二次模型推理（基于工具结果生成最终答案）
        - ……

这种树状结构让开发者能够直观地看到 Agent “思考-行动-观察”的完整循环。当模型做出错误决策时，你可以迅速定位是第一次推理就选错了工具，还是工具返回的内容误导了后续推理。这在 Prompt Engineering 中至关重要：**我们要追溯的不是单个调用，而是决策的因果链。**

#### 2.2.3 输入输出与元数据全记录

LangSmith 不仅记录输入输出文本，还关联了丰富的元数据：
- **Token 用量**：提示 Token、完成 Token 及总计，方便评估成本。
- **延迟**：端到端延迟及各节点耗时，用于识别性能瓶颈。
- **模型信息**：模型名称、版本、配置参数，确保回归对比时的环境一致性。
- **自定义标签与元数据**：你可以附加用户 ID、会话 ID、实验批次等信息，将业务上下文注入跟踪。

这些元数据正是可追溯性从“能看”升级到“能用”的关键。当你想回溯上周某个付费用户的糟糕体验时，只需通过标签过滤，即可精确拉取当时那条 Trace，完整复现现场。

#### 2.2.4 实验管理与数据集

如果说 Trace 是微观层面的追溯，那么 LangSmith 的 **实验（Experiment）** 与 **数据集（Dataset）** 功能则提供了宏观视角。你可以将一组用例整理为数据集，针对不同的提示词或模型版本发起批量实验，每个实验的输出都会被完整记录。

通过对比实验面板，你可以清晰地看到：新版本提示词在 70% 的用例中提升了相关性，但在 15% 的用例中引入了幻觉。这种 **“版本-结果-原因”** 的可追溯性，让迭代不再是盲目试错，而是基于数据驱动的决策。这完美体现了 Harness Engineering 中“驾驭”的本质：不是一次做对，而是能系统性地从错误中学习。

![LangSmith页面展示](https://i-blog.csdnimg.cn/direct/cad19715c2a4495f9689dc92277f9314.png)


### 2.3 LangSmith 在 Harness Engineering 中的角色

LangSmith 将“开发阶段的不确定性”变成了“可追溯的实验”。它让提示工程和链路编排从一门“玄学”变为一种“工程实践”。当你能够回溯每一次实验的完整上下文，你才能真正驾驭模型的行为，而不是被它的随机性牵着走。

然而，LangSmith 的战场主要在**开发与离线评估**阶段。其数据更多由开发者主动触发，缺少对生产流量全量、实时的监控与成本聚合。这正是 Langfuse 登场的理由。

---

## 第三章 Langfuse：生产环境的“全息记录仪”

### 3.1 定位：开源的生产级 LLM 可观测性平台

Langfuse 的诞生源于一个核心诉求：**我们需要一个专门为 LLM 设计的、可自托管的生产级追踪系统。** 它不像传统 APM 工具那样只关注延迟和吞吐量，也不像通用日志系统那样仅记录离散事件。Langfuse 将每一条 LLM 调用视为珍贵的“数据资产”，进行全量、结构化的采集与存储。

它的开源与自托管特性，使得企业在数据安全与合规方面拥有绝对控制权——所有调用数据都留在你自己的基础设施中。这一点对于金融、医疗等敏感行业尤为重要。

在 Harness Engineering 的体系中，Langfuse 承担的是 **“生产环境可观测性底盘”** 的角色。它是连接开发实验与线上真实表现的桥梁，也是成本治理与质量监控的核心数据源。

### 3.2 核心能力深度剖析

#### 3.2.1 无死角的调用采集

Langfuse 提供了覆盖主流语言（Python、JS/TS）和框架（LangChain、LlamaIndex、OpenAI SDK）的原生 SDK。通过简单的装饰器或回调集成，即可将生产环境中的每一次 LLM 交互完整上报。

它捕捉的信息维度远超传统日志：
- **完整对话上下文**：多轮对话中，每一条 Trace 关联其所属的 Session，你可以在 Langfuse 中无缝浏览一个用户从开始到结束的完整对话历程。
- **嵌套执行追踪**：与 LangSmith 类似，Langfuse 也通过 **Trace - Span - Generation** 的层次模型记录复杂链路，如 RAG 中的检索与生成、Agent 中的多次推理与工具调用。
- **自定义评分与反馈**：你可以在代码中为生成结果打分，也可以收集终端用户的点赞/点踩，并将这些评分关联回对应的 Trace。这让“质量”这一主观概念变得可量化、可追溯。

#### 3.2.2 成本与 Token 的精细治理

这是 Langfuse 相比于开发工具最突出的生产特性。它会自动解析每个模型调用的 Token 消耗，并结合你配置的各模型单价，**实时计算出每一次调用的精确成本**。

在 Dashboard 中，你可以按模型、用户、环境、项目等维度，查看任意时间范围内的成本分布。当你发现某天的账单异常上涨时，可以直接下钻到成本最高的几条 Trace，分析是否因为提示词过长或用户输入导致大量 Token 消耗。这种 **“成本 -> Trace -> 根因”** 的追溯路径，是 FinOps 中成本可追溯性的核心实践。

#### 3.2.3 实时流式处理与告警

Langfuse 支持实时数据摄取，这意味着你可以基于生产数据构建准实时的质量监控。例如，你可以配置规则：当某个模型的平均生成延迟超过阈值，或者错误率突增时，通过 Webhook 发送告警。这种能力将“追溯”从被动查询变为主动预警，真正把可观测性嵌入到日常运维中。

#### 3.2.4 数据集与回测评估

Langfuse 不仅记录线上数据，还允许你将这些真实数据转化为**评估数据集**。你可以将线上采集到的用户问题和模型回答筛选出来，重新用于离线评估或回归测试。这种闭环让可追溯性具备了“反哺”价值——线上数据 -> 数据集 -> 离线实验 -> 指导优化 -> 上线验证，形成一个持续改进的飞轮。

![langfuse页面展示](https://i-blog.csdnimg.cn/direct/9a9ce970430c40a28a6bf7f0d364edd4.png)


### 3.3 Langfuse 在 Harness Engineering 中的角色

Langfuse 将“生产黑盒”变成了“全链路记录”。它让运营者和开发者第一次拥有了对线上 LLM 行为的全景视角：每一笔开销用在哪里，每一次慢响应卡顿在哪个环节，每一个差评发生在哪次调用中，都清晰可追溯。

但 Langfuse 和 LangSmith 有一个共同的盲区：它们追踪的都是 **“正常的”调用流程**——即使是失败的调用，只要代码层面未抛出异常，它们仍会正常记录。而当真正的应用异常发生时（例如网络超时、JSON 解析错误、内存溢出），Trace 可能根本来不及生成，或者只生成了一半。这时，我们需要一个能捕捉一切“崩溃”的工具。

---

## 第四章 Sentry：故障排查期的“堆栈还原者”

### 4.1 定位：从传统异常追踪到 LLM 错误归因

Sentry 长期以来是应用性能监控（APM）与错误追踪领域的标杆。它的核心能力是捕获代码运行中的任何未处理异常，并记录下完整的堆栈追踪、面包屑（Breadcrumbs）和环境上下文，让开发者能够快速定位问题代码。

当 LLM 融入应用后，错误的形式发生了巨变：不再仅仅是 `NullPointerException` 或 `DatabaseTimeout`，更多是“模型返回了非 JSON 格式”、“工具调用参数超出限制”、“OpenAI API 返回 429”等。这些错误有些是可预见的，有些则深藏于复杂的 Agent 循环中。

Sentry 在 LLM 工程中的独特价值在于：**它是唯一专注于“失败瞬间”的追溯者。** Langfuse 和 LangSmith 记录的是调用的“完整故事”，而 Sentry 记录的是故事的“中断现场”。两者结合，才能看清失败的全貌。

### 4.2 核心能力：不止于技术栈

#### 4.2.1 全栈异常捕获

Sentry 通过 SDK 嵌入应用运行时，能够自动捕获任何未被 try-catch 捕获的异常。对于 LLM 应用，这包括但不限于：
- 调用 LLM 服务时的网络错误、超时错误
- 响应解析失败（如预期 JSON 但收到纯文本）
- 工具执行错误（如数据库连接断开、外部 API 拒绝）
- Agent 循环控制逻辑引发的异常（如无限循环保护）

每一个异常都会被赋予一个唯一 ID，并携带完整的调用堆栈、发生时的局部变量状态以及请求上下文。

#### 4.2.2 强大的上下文与面包屑

Sentry 的 **Breadcrumbs（面包屑）** 机制是问题追溯中的关键一环。它能在异常发生前，记录下应用的一系列操作：用户点击了按钮、发起了 API 请求、获取了 LLM 响应……当异常发生时，所有这些事件按照时间轴排列，就像飞机黑匣子的驾驶舱语音记录器。

对于 LLM 应用，你可以主动埋点添加面包屑，记录“开始调用 GPT-4”、“接收到响应”、“开始解析工具参数”等关键事件。当解析突然崩溃时，面包屑会告诉你崩溃前最后一次成功的步骤是什么，以及当时的数据是什么样子。

#### 4.2.3 LLM 专用线索

新版本的 Sentry 开始提供对 LLM 调用的专门支持。它能识别出异常是否与 LLM 交互相关，并尝试将提示词摘要、模型信息、Token 数量等关键信息附加到事件中。这使得开发者无需再查阅外部日志，直接在 Sentry 的 Issue 页面上就能初步判断：是不是提示词过长导致超时？是不是模型版本不一致？

#### 4.2.4 版本关联与回归告警

Sentry 与 Git 仓库深度集成，能识别出异常是由哪个版本的代码引入的。当你部署一个新模型或新提示词后，如果特定类型的错误开始飙升，Sentry 可以立即发出告警，并将嫌疑精确到某次提交。这种“代码变更 -> 错误引入”的可追溯性，对于快速迭代的 LLM 应用来说价值不可估量。

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/34bfc997f7864555a68bb0dee1265b83.png)


### 4.3 Sentry 在 Harness Engineering 中的角色

Sentry 弥补了可追溯性中“异常真空”的那一环。它确保 **“没有一次失败是死无对证的”**。当 Langfuse 显示某条 Trace 状态为 Error 但细节不足时，你可以通过时间戳和用户 ID，直接跳转到 Sentry 中查看对应的异常现场。Harness Engineering 追求的“任何异常都能归因”，正是由 Sentry 来实现的。

---

## 第五章 铁三角的协同：编织全链路可追溯性之网

单个工具解决单点问题，但真正的“驾驭”来自于协同。LangSmith、Langfuse 与 Sentry 并非彼此孤立，它们在数据流和使用场景上可以形成完美的闭环。

### 5.1 场景一：新功能上线后的回归验证

1. **开发阶段**：团队在 LangSmith 上创建了 50 个典型用例的数据集，并基于新版提示词发起实验。LangSmith 的 Trace 清晰地展示了每个用例的决策路径与输出，通过对比旧版本，确认整体质量提升，但发现一个用例出现格式错误。
2. **上线前夕**：针对该用例，调整提示词或添加格式校验代码，再次实验直到通过。
3. **生产发布**：应用部署后，所有真实调用被 Langfuse 全量摄取。
4. **异常捕捉**：上线一小时后，Sentry 收到几条 `ValidationError`，正是之前那种格式错误。通过 Sentry 的堆栈和面包屑，发现是某个旧版客户端仍在发送不规范请求。
5. **追溯与解决**：在 Langfuse 中通过 Sentry 提供的时间戳和用户 ID，找到对应的 Trace，确认模型输出格式无误，问题出在客户端。团队修复客户端版本，并发布补丁。

这个场景中，**LangSmith 负责“实验可追溯”，Langfuse 负责“生产可追溯”，Sentry 负责“异常可追溯”**。三者数据互补，将问题定位时间从天级缩短到分钟级。

### 5.2 场景二：成本异常飙升的深度分析

1. **告警触发**：Langfuse 的成本监控发现“GPT-4 调用费用突然暴涨 300%”。
2. **宏观定位**：在 Langfuse Dashboard 中，按用户分组查看，发现 90% 的额外成本来自 3 个特定用户。进一步下钻到他们的 Trace，发现每次请求的提示 Token 数量异常巨大。
3. **根因追溯**：查看这些 Trace 的完整调用链，发现是因为上游数据源返回了超长上下文，而 RAG 的剪枝逻辑由于一个配置错误未能生效。这个配置错误并没有抛出异常，所以 Sentry 没有捕获。
4. **修复与验证**：在 LangSmith 上，复现这个超长上下文场景，验证修复后的剪枝逻辑，确认 Token 消耗回归正常，然后上线。
5. **持续观测**：发布后，在 Langfuse 上观察成本曲线回落，确认问题解决。

此处，**Langfuse 提供了端到端的成本可追溯性，而 LangSmith 则提供了安全修复和验证的实验环境**。如果没有 Langfuse 的全量记录，成本飙升可能会被淹没在总账单中，直到月底才发现，但那时已无法追溯是哪几个用户、哪几次调用导致的。

### 5.3 架构图：三者的位置与数据流

我们可以用一张简化的架构图来描述它们在生产系统中所处的位置：

```text
            用户请求
               |
        [ LLM 应用服务 ]
          /      |      \
    SDK 调用  SDK 上报  异常抛出
    (回调)    (异步)     (捕获)
      |         |         |
   LangSmith   Langfuse   Sentry
  (实验/调试) (生产观测)  (错误追踪)
```

在一个成熟的 Harness Engineering 实践中，建议的集成方式是：
- **LangSmith**：在开发与预发环境中作为主要追踪后端，同时也可在生产环境中保留采样追踪（如 1% 流量），用于与实验数据进行长期对比。
- **Langfuse**：在生产环境中作为主力可观测性平台，负责 100% 流量的全量追踪与成本计算。
- **Sentry**：作为全局异常处理器，捕获所有环境（开发、预发、生产）下的未处理异常。

三者通过 `trace_id`、`user_id`、时间戳等通用字段关联，构成完整的可追溯矩阵。

---

## 第六章 Harness Engineering 深度实践：可追溯性驱动的开发范式

拥有工具不等于拥有能力。Harness Engineering 的真正力量在于将可追溯性融入到日常开发与运维流程中，形成新的工作范式。

### 6.1 提示词迭代：从“我觉得”到“数据显示”

在引入可追溯性之前，提示词的优化往往依赖直觉和小规模人工测评，充满主观性。借助铁三角，这个流程可以变为：
1. 在 LangSmith 中定义评估数据集（覆盖边界情况、长尾查询、对抗性输入）。
2. 修改提示词，发起实验，获取全量 Trace 和自动评估得分。
3. 确认新提示词明显更优后，标记版本号，提交代码。
4. 部署上线后，通过 Langfuse 监控真实用户的反馈评分和任务成功率。
5. 若发现某些细分场景表现下降，通过 Sentry 确认是否有解析错误，在 Langfuse 中下钻到具体 Trace，找出退化样本，将其加入 LangSmith 数据集，进入下一轮迭代。

这个闭环，让“经验”变成了“证据”，可追溯性成为了持续改进的引擎。

### 6.2 智能体（Agent）的稳定治理

Agent 链路长、分支多，是 LLM 应用中最容易失控的形态。Harness Engineering 要求对 Agent 实施“全生命周期可追溯”：
- **每一步都要留痕**：在代码中确保每次 LLM 推理、工具调用都生成独立的 Span，并关联回根 Trace。
- **失败安全隔离**：工具调用必须包裹 try-catch，异常时不仅记录日志，还要在 Span 中标记错误状态，并抛出给 Sentry 捕获。
- **轨迹回放与调试**：当一个 Agent 在线上做出错误决策时，在 Langfuse 中找到该 Trace，导出其完整输入输出，然后在 LangSmith 中创建一个复现实验，逐步调试并修复提示词或工具定义。
- **合规审计**：对于需要审计的行业，Langfuse 的自托管存储可确保所有对话记录和决策依据完整保留，任何历史决策都可追溯到原始数据与模型版本。

### 6.3 成本“可追溯”到人

当 LLM 成本成为重要开支时，需将成本追溯到具体用户或业务线，实现精细化管理：
- 在调用 LLM 时，将业务标识（如项目 ID、客户标识）写入 Langfuse 的 Trace 元数据。
- 利用 Langfuse 的自定义 Dashboard 或 API，定期生成各维度的成本报表。
- 当某个客户成本异常时，直接从报表深入对应的 Trace 列表，分析是滥用、低效提示还是其他原因。

这种“成本透明度”本身就是一种驾驭力。它让团队能理性决策：是优化提示词，还是升级模型，或是调整产品定价。

---

## 第七章 未来展望与总结

随着 LLM 应用从原型走向核心业务，Harness Engineering 的方法论会越来越被重视。可追溯性不再是“有了挺好”的附加功能，而是保障系统可靠性、合规性、成本可控性的基础设施。

LangSmith、Langfuse 和 Sentry 这一组合，恰好代表了三种互补的可追溯性视角：
- **LangSmith**：开发者的实验追溯视角，关注“我们如何让模型变得更好”。
- **Langfuse**：运维者的生产观测视角，关注“线上正发生什么，成本如何”。
- **Sentry**：所有人的故障归因视角，关注“是什么让系统崩溃了”。

它们共同回答了一个核心问题：**我们是否真正驾驭了正在运行的模型？**

Harness Engineering 的本质是承认不可控，然后通过工程手段建立掌控感。这种掌控感，就来源于当你任何一个同事、审计员甚至未来的自己，问起“那天那个回答为什么那么奇怪？”或者“为什么这笔费用这么高？”时，你能够打开系统，在几分钟内完成从现象到根因的完整追溯。

**这就是可追溯性的终极价值：不是记录一切，而是随时可解释一切。**

而 LangSmith、Langfuse 与 Sentry，正是你实现这一目标的、值得信赖的伙伴。

---


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

<!-- en-code-sync -->

## Appendix: Code & diagrams from the article

The English narrative above is localized for the language toggle. The following fenced blocks are copied unchanged from the Chinese version so you can still copy-paste every command and snippet while reading in English.

```text
            用户请求
               |
        [ LLM 应用服务 ]
          /      |      \
    SDK 调用  SDK 上报  异常抛出
    (回调)    (异步)     (捕获)
      |         |         |
   LangSmith   Langfuse   Sentry
  (实验/调试) (生产观测)  (错误追踪)
```
