# Agent.md — The Engineering Guide to Agentic AI & Autonomous Systems

> **STARVYON Learn Reference Document**  
> **Discipline:** Artificial Intelligence  
> **Course Code:** AGENT-501  
> **Governing Track:** Artificial Intelligence Track (Artificial Intelligence Engineering)  
> **Source Material:** Extracted from roadmap.sh AI Agents (Agentic AI) specification & production engineering patterns.

---

## 1. Executive Summary & Paradigm Shift

Agentic AI represents the transition from **passive, reactive language models** (which merely predict the next token given a prompt) to **active, autonomous cognitive agents** capable of perceiving their environment, reasoning over ambiguous objectives, breaking goals down into sequential subtasks, executing tools against external APIs and sandboxes, observing real-world feedback, and reflecting to correct their trajectory.

Unlike static chains or deterministic workflows, an agent operates in a closed cybernetic feedback loop with persistent state, working memory, and tool permissions.

```
       +-------------------------------------------------------+
       |                  AGENT COGNITIVE LOOP                 |
       |                                                       |
       |   +--------------+                 +--------------+   |
       |   | 1. PERCEIVE  | --------------> |  2. REASON   |   |
       |   | Multimodal   |                 | Goal Decomp  |   |
       |   | Ingestion    |                 | Strategy Sel |   |
       |   +--------------+                 +--------------+   |
       |          ^                                |           |
       |          |                                v           |
       |   +--------------+                 +--------------+   |
       |   |  4. REFLECT  | <-------------- |   3. ACT     |   |
       |   | Error Audit  |                 | Tool Call    |   |
       |   | State Update |                 | MCP Exec     |   |
       |   +--------------+                 +--------------+   |
       +-------------------------------------------------------+
```

---

## 2. Prerequisites & LLM Engineering Foundations

### 2.1 Developer Prerequisites
* **Systems Architecture:** Asynchronous programming (`asyncio` in Python), event-driven architectures, concurrency models.
* **API Protocols:** RESTful services, JSON-RPC 2.0, Server-Sent Events (SSE), WebSockets.
* **Environment Controls:** Docker containerization, Linux process namespaces, virtual environments (`venv`, `uv`), environment secret management.

### 2.2 LLM Runtime Mechanics
* **Tokenization & Context Limits:** Subword tokenization (BPE, WordPiece), context window saturation, attention degradation with sequence length ($O(N^2)$ vs. flash linear scaling).
* **Inference Sampling Parameters:**
  * **Temperature ($T$):** Controls the entropy of the softmax distribution:
    $$P(w_i) = \frac{\exp(z_i / T)}{\sum_j \exp(z_j / T)}$$
    For deterministic agent tool routing and JSON serialization, $T \in [0.0, 0.2]$.
  * **Top-$p$ (Nucleus Sampling):** Samples from the smallest set of tokens whose cumulative probability exceeds threshold $p$.
  * **Presence and Frequency Penalties:** Penalizes token recurrence to prevent circular reasoning loops.
  * **Stop Sequences:** Enforcing boundary tokens (e.g., `<|endofaction|>`, `\nObservation:`) to yield control back to the orchestrator.
* **Model Families:**
  * **Open Weights:** Llama 3/3.1 (8B, 70B, 405B), Mistral/Mixtral, Qwen 2.5 (optimized for tool calling and reasoning).
  * **Frontier Hosted:** Claude 3.5 Sonnet (computer use & tool routing), OpenAI GPT-4o / o1 / o3-mini (chain-of-thought reasoning), Gemini 1.5/2.0 Flash/Pro (large 1M-2M context).

---

## 3. The 4-Step Cognitive Loop (In-Depth)

Every autonomous agent executes a cyclic trajectory consisting of four invariant stages:

### Step 1: Perception & Environment Ingestion
* Ingests the user query, system prompt, conversation history, memory retrieval contexts, and real-time environmental observations (e.g., file trees, browser DOMs, database schemas).
* Normalizes inputs into structured multimodal message blocks (`role: "system" | "user" | "assistant" | "tool"`).

### Step 2: Reason & Plan (Cognitive Deliberation)
* Analyzes the distance between the current state $S_t$ and the goal state $G$.
* Decomposes complex goals into sequential sub-goals or directed acyclic graphs (DAGs).
* Determines whether the goal is achieved or if an external tool action $a_t$ is required.

### Step 3: Act & Tool Invocation
* Emits a structured tool call adhering strictly to the JSON schema registered for that tool:
  $$\text{Action} = \mathcal{M}_{\theta}(\text{Context}_t) \to \{\text{tool}: \text{"search_database"}, \text{args}: \{\dots\}\}$$
* The orchestrator intercepts the action, verifies security policies, and executes the physical call.

### Step 4: Observe & Reflect
* Captures the physical output (stdout, stderr, HTTP status, JSON payload) as an `Observation`.
* Evaluates outcome:
  * Did the tool succeed?
  * Was the output truncated or rate-limited?
  * Does the new information require updating the working plan?
* Injects the observation back into the context buffer for the next iteration:
  $$\text{Context}_{t+1} = \text{Context}_t \cup \{\text{Action}_t, \text{Observation}_t\}$$

---

## 4. Prompt Engineering for Autonomous Agents

Agents require radically stricter prompting than conversational chatbots. Key tenets:

1. **Role & Operating Boundary Specification:** Define explicit operational domain, authorization constraints, and non-goals.
2. **Deterministic Output Constraints:** Mandate strict JSON schemas or XML tags (`<thought>`, `<action>`, `<parameter>`).
3. **Few-Shot In-Context Trajectories:** Supply 2–3 canonical multi-turn examples illustrating error handling and backtracking.
4. **Anti-Hallucination & Uncertainty Directives:** Explicitly instruct the agent to declare missing parameters rather than fabricating arguments.
5. **Fail-Fast & Timeout Awareness:** Direct the agent to stop after $K$ failed consecutive tool calls on the same subtask.

---

## 5. Tools & Action Interfaces

### 5.1 Tool Definition Standard
A production tool specification requires:
* **Unique Identifier:** Descriptive, namespaced string (e.g., `github_create_pull_request`).
* **Semantic Description:** Precise explanation of *when* and *why* to use this tool versus alternatives.
* **JSON Schema Parameter Validation:** Type constraints, required fields, enum boundaries, and regex patterns.
* **Idempotency & Safety Flags:** Declaring whether the tool is read-only (safe for automated execution) or mutation-heavy (requiring human confirmation).

### 5.2 Core Tool Taxonomy
| Tool Category | Primary Implementations | Security Constraints |
| :--- | :--- | :--- |
| **Search & Retrieval** | Tavily, Google Serper, Hybrid Vector Search | Rate limiting, domain allowlisting |
| **Code Execution** | Docker Sandboxes, E2B Firecracker microVMs, WASM | Memory limits, zero network egress |
| **Storage & Data** | PostgreSQL, SQLite, Neo4j, Redis, Qdrant | Read-only credentials, parameterized queries |
| **System & Shell** | Bash / PowerShell CLI, Git commands | Blocked `rm -rf`, blocked `sudo`, timeout kill |
| **Web Interaction** | Playwright, Puppeteer headless browsing | Cross-origin isolation, cookie masking |

---

## 6. Model Context Protocol (MCP)

The **Model Context Protocol (MCP)**, open-sourced by Anthropic, is the modern standard for separating agent reasoning from tool and data connectivity.

```
+--------------------+        JSON-RPC 2.0        +--------------------+
|     MCP HOST       | <------------------------> |     MCP CLIENT     |
| (IDE / Agent Host) |       (stdio / SSE)        | (Orchestrator)     |
+--------------------+                            +--------------------+
                                                             |
                                      +----------------------+----------------------+
                                      |                      |                      |
                                      v                      v                      v
                             +------------------+   +------------------+   +------------------+
                             |    MCP SERVER    |   |    MCP SERVER    |   |    MCP SERVER    |
                             |   (PostgreSQL)   |   |   (Local Files)  |   |   (Git / GitHub) |
                             +------------------+   +------------------+   +------------------+
```

### 6.1 Core MCP Primitives
1. **Prompts:** Pre-engineered templates exposed by servers to guide host interactions.
2. **Resources:** Read-only data payloads (file contents, database rows, logs) identifiable by URIs (`file:///`, `postgres://`).
3. **Tools:** Callable functions with side effects returning content blocks to the model.

### 6.2 Transport Mechanisms
* **Standard Input/Output (`stdio`):** Fast, local process-to-process communication. Ideal for desktop applications and local IDE extensions.
* **Server-Sent Events (`SSE`) over HTTP:** Remote, distributed architecture allowing centralized tool servers to serve remote agent workers.

---

## 7. Agent Memory Architectures

Memory allows an agent to maintain consistency across long-horizon executions and multi-session user relationships.

```
                                  AGENT MEMORY TAXONOMY
                                            |
                  +-------------------------+-------------------------+
                  |                                                   |
          SHORT-TERM MEMORY                                   LONG-TERM MEMORY
                  |                                                   |
        +---------+---------+                               +---------+---------+
        |                   |                               |                   |
   Working Memory     Scratchpad                       Episodic Memory     Semantic Memory
   (Active Context)   (State Trace)                    (Past Executions)   (World Knowledge)
```

### 7.1 Memory Tiers
1. **Working / Short-Term Memory:**
   * Resides within the active model context window.
   * Houses the system prompt, immediate conversation turn, and current tool execution stack.
2. **Episodic Long-Term Memory:**
   * Stores complete past execution trajectories, failures, and user preferences.
   * Indexed via dense embeddings in vector stores (e.g., Qdrant, Milvus, Chroma).
   * Retrieved dynamically via similarity search:
     $$\text{sim}(q, d_i) = \frac{\mathbf{e}_q \cdot \mathbf{e}_i}{\|\mathbf{e}_q\| \|\mathbf{e}_i\|}$$
3. **Semantic Long-Term Memory:**
   * Knowledge graphs and structured documents representing ground truths, API documentation, and code schemas.

### 7.2 Context Management & Eviction Policies
* **Sliding Window:** Retaining only the last $N$ interactions; prone to catastrophic forgetting of initial constraints.
* **Recursive Rolling Summarization:** Periodic background task condensing past $K$ turns into a concise factual summary.
* **Hierarchical State Compression:** Pruning raw tool outputs (e.g., stripping HTML boilerplates) before appending to history.

---

## 8. Cognitive Architectural Patterns

### 8.1 ReAct (Reason + Act)
* **Mechanics:** Interleaves reasoning traces with concrete actions in alternating fashion: `Thought -> Action -> Observation -> Thought -> Action -> ...`
* **Strength:** Allows the model to inspect intermediate results before deciding the subsequent step.

### 8.2 Planner-Executor (Plan-and-Solve)
* **Mechanics:**
  1. A **Planner Model** generates a comprehensive step-by-step plan upfront.
  2. An **Executor Model** processes subtasks sequentially.
  3. A **Replanner Unit** audits progress and dynamically rewrites downstream steps if an unexpected error occurs.

### 8.3 Tree-of-Thoughts (ToT)
* **Mechanics:** Explores multiple candidate thoughts at each juncture as a tree, evaluating heuristics for each branch and employing depth-first (DFS) or breadth-first (BFS) search with backtracking.

### 8.4 Multi-Agent Collaboration Patterns
* **Supervisor / Router Pattern:** A central coordinator delegates subtasks to specialized worker agents (e.g., `ResearcherAgent`, `CoderAgent`, `TesterAgent`).
* **Debate & Consensus Pattern:** Multiple agent instances critique each other's outputs to eliminate hallucinations before final emission.
* **State Machine Graphs (LangGraph):** Cyclic state graphs where nodes represent agent actions and edges represent conditional transitions based on state schemas.

---

## 9. Frameworks & Ecosystem Comparison

| Framework | Core Philosophy | Best Suited For | Key Differentiator |
| :--- | :--- | :--- | :--- |
| **LangGraph** | Graph-based cyclic state machines | Complex enterprise workflows | First-class checkpointing, time-travel debugging |
| **CrewAI** | Role-playing hierarchical teams | High-level collaborative workflows | Human-intuitive agent personas |
| **AutoGen** | Conversational multi-agent systems | Code generation & execution loops | Dynamic conversational consensus |
| **LlamaIndex** | Data-centric retrieval agents | Knowledge base & enterprise RAG agents | Advanced query engines & index structures |
| **Smolagents** | Code-first execution agents | Lightweight, deterministic scripting | LLM writes raw Python executable code |

---

## 10. Evaluation, Diagnostics & Observability

### 10.1 Key Performance Indicators (KPIs)
* **Goal Completion Rate (GCR):** Percentage of agent runs successfully reaching the verified objective.
* **Trajectory Efficiency:** Average number of tool turns required to complete a task versus the optimal path.
* **Tool Invocation Accuracy:** Frequency of schema violations, invalid arguments, or hallucinated tool names.
* **Token Expenditure & Unit Cost:** Average input/output token consumption per task resolution.

### 10.2 Observability Stack
* **Distributed Tracing:** Recording spans for every LLM invocation, vector retrieval, and tool execution (OpenTelemetry, OpenLLMetry).
* **Evaluation Platforms:** LangSmith, Arize Phoenix, LangFuse, DeepEval.
* **Deterministic Replayability:** Checkpointing graph state at every step to reproduce and diagnose production anomalies.

---

## 11. Security, Sandboxing & Safety Engineering

### 11.1 Indirect Prompt Injection
* **Threat Model:** Malicious instructions embedded inside external data sources (web pages, customer emails, PDF documents) that hijack the agent's system prompt upon retrieval.
* **Defenses:**
  * Strict separation of untrusted data blocks using delimited XML/markdown tags.
  * Secondary validation LLM auditing proposed tool calls prior to execution.
  * Content security policy forbidding tool execution based purely on untrusted text fields.

### 11.2 Tool Execution Sandboxing
* Run all code execution tools inside short-lived, unprivileged containers (Docker, Firecracker microVMs).
* Enforce read-only file systems for operational code.
* Enforce human-in-the-loop (HITL) authorization gates for high-risk irreversible actions (e.g., payments, email dispatch, database drops).
