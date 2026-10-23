<div align="center">

# STARVYON Learn

### Engineering-Grade Artificial Intelligence, Statistical Machine Learning & Autonomous Systems Curriculum

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Database: Neon](https://img.shields.io/badge/Database-Neon%20Postgres-00e599.svg)](https://neon.tech)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

<p align="center">
  A rigorous, zero-compromise learning platform built with <b>pure HTML5, CSS3, Vanilla JavaScript, and Neon PostgreSQL</b>.
  <br />
  Master state-space search, statistical optimization, deep neural calculus, transformer attention mechanisms, LLM fine-tuning, and autonomous multi-agent systems.
</p>

[Curriculum](#-the-five-pillar-curriculum) • [Interactive Labs](#-interactive-concept-labs) • [Quick Start](#-quick-start) • [Database Architecture](#-neon-database--telemetry) • [Project Structure](#-project-structure)

---

</div>

## 🌟 Tech Stack Highlights

- **Pure HTML5:** Semantic, accessible, fast loading structure.
- **Pure CSS3:** Custom responsive layout, dark theme design system, CSS variables, and fluid typography. Zero Tailwind or CSS bloat.
- **Pure Vanilla JavaScript (ES6+):** Client-side hash routing, reactive state stores, interactive concept labs, and event orchestration without frontend framework overhead.
- **Neon Serverless PostgreSQL:** Cloud database integration for user accounts, progress tracking, and activity telemetry with zero-configuration offline fallback.
- **Mathematical Typesetting:** Offline KaTeX engine for publication-grade mathematical formulations and derivations.

---

## 📚 The Five-Pillar Curriculum

The curriculum is structured into a cumulative engineering pathway: **The Artificial Intelligence Track (`TRACK-AIE`)**.

```
+---------------------------------------------------------------------------------------------------+
|                                      THE ARTIFICIAL INTELLIGENCE TRACK                            |
+---------------------------------------------------------------------------------------------------+
|  [01] AI-101   | Artificial Intelligence Foundations (PEAS, A* Search, Minimax, AC-3)             |
|  [02] ML-201   | Statistical Machine Learning (SVD, Regularization, Ensembles, Cross-Validation)   |
|  [03] DL-301   | Deep Neural Networks (Backpropagation, AdamW, ResNets, Scaled Dot-Product Attn)   |
|  [04] GENAI-401| Generative AI & LLMs (RoPE, KV-Cache, LoRA/QLoRA, DPO, Enterprise RAG)           |
|  [05] AGENT-501| Agentic AI & Autonomous Systems (Sense-Think-Act-Reflect, MCP Protocol, LangGraph)|
+---------------------------------------------------------------------------------------------------+
```

### Course Matrix

| Code | Discipline | Level | Key Modules & Topics Covered |
| :--- | :--- | :--- | :--- |
| **`AI-101`** | **AI Foundations** | Foundational | Intelligent agents, state-space search, heuristics ($h(n)$, Manhattan, Euclidean), adversarial search (Alpha-Beta pruning), CSPs (AC-3), propositional logic & planning. |
| **`ML-201`** | **Machine Learning** | Intermediate | Linear/logistic regression, cost surface convex optimization, bias-variance tradeoff, $L_1$/$L_2$ regularization, Decision Trees, Random Forests, Gradient Boosted Trees (XGBoost), PCA, SVD, $k$-Means, clustering. |
| **`DL-301`** | **Deep Learning** | Intermediate+ | Multilayer Perceptrons, computational graph autograd, forward/backward passes, optimizers (SGD, Momentum, AdamW), CNNs, ResNet residual skips, Scaled Dot-Product Attention, Transformers. |
| **`GENAI-401`** | **Generative AI** | Frontier | Decoder architectures, RoPE position embeddings, KV-Cache mechanics, token sampling (Temperature, Top-$p$, Top-$k$), PEFT fine-tuning (LoRA, QLoRA), RLHF, DPO, Enterprise RAG (Hybrid dense/sparse, Cross-encoder re-ranking). |
| **`AGENT-501`** | **Agentic AI** | Frontier | Sense-Think-Act-Reflect cognitive loop, Model Context Protocol (MCP), structured tool calling, deterministic state graphs (LangGraph), memory hierarchies (episodic, semantic, working memory), autonomous reflection. |

---

## 🔬 Interactive Concept Labs

STARVYON Learn features built-in mathematical visualizers written in vanilla JavaScript:

1. **A* Search Grid Simulator:** Interactive visualizer comparing search frontiers, path costs, and heuristic expansions.
2. **Decision Boundary Visualizer:** Real-time parameter tweaking for logistic classification, decision margins, and boundary separation.
3. **Neural Forward Pass Visualizer:** Layer-by-layer activation flow and matrix dimension inspection ($XW + b$).
4. **Enterprise RAG Pipeline Inspector:** Step-by-step query embedding, vector cosine search, chunk retrieval, and cross-encoder re-ranking.
5. **Agent MCP Trace Explorer:** Visual event stream tracing agent tool requests, JSON-RPC validation, tool executions, and state reflections.

---

## 🗄️ Neon Database & Telemetry

The platform connects to **Neon Serverless PostgreSQL** via standard HTTP SQL endpoints:

### Dual Storage Engine
- **Local Mode (Default):** Runs immediately out of the box using browser `localStorage`. No database setup required to start studying.
- **Neon Cloud Mode:** When `NEON_DATABASE_URL` is provided, user accounts, lesson completion markers, and audit logs persist directly to your cloud PostgreSQL database.

### Schema Summary
- **`users`**: Fellow accounts, credentials, roles, and profile metadata.
- **`user_activities`**: Event audit logs (`USER_LOGIN`, `TOPIC_COMPLETED`, `QUIZ_SUBMITTED`, `LAB_INTERACTED`).
- **`user_progress`**: Course topic completion markers and diagnostic quiz mastery scores.
- **`user_activity_summaries`**: Aggregation view powering learner profile and progress radar.

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/starvyon/starvyon-learn.git
cd starvyon-learn
```

### 2. Configure Environment
```bash
cp .env.example .env
```
*(Optional) If using Neon PostgreSQL, paste your connection string into `.env`:*
```env
NEON_DATABASE_URL=postgresql://user:password@ep-xyz-123.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### 3. Open in Browser
Because this is pure HTML, CSS, and JavaScript, you can run it with any lightweight server:
```bash
# Using Node / npx (optional):
npm start

# Or using Python:
python -m http.server 3000

# Or simply open index.html directly in any browser!
```

---

## 🛠️ Database Setup (Neon PostgreSQL)

```bash
# Provision database schema & seed initial student account
npm run db:setup

# Test database connection health
npm run db:test
```

The SQL schema definition is located at [`db/schema.sql`](db/schema.sql).

---

## 📁 Project Structure

```
STARVYON-Learn/
├── index.html                 # Main application markup & view mounts
├── env.js                     # Runtime environment injector
├── .env.example               # Environment variables template
├── .gitignore                 # Secret protection (.env)
├── README.md                  # Project overview & documentation
├── Roadmaps.md                # Master curriculum specifications & syllabus
├── Agent.md                   # Complete specification for Agentic AI (AGENT-501)
├── LICENSE                    # MIT open-source license
├── package.json               # Scripts & dependencies for DB setup
├── css/
│   ├── base.css               # Design system tokens, variables & typography
│   ├── layout.css             # Navigation bar, footer, and grid layout
│   ├── landing.css            # Hero section, feature matrices, and stats
│   ├── pathways.css           # Learning track milestones & syllabus timeline
│   ├── courses.css            # Course cards, search filtering & badges
│   ├── viewer.css             # Reader pane, sidebar navigation & labs
│   └── auth.css               # Modal, account forms & progress radar
├── js/
│   ├── app.js                 # Application bootstrap & event orchestration
│   ├── auth.js                # Persistent authentication engine & session manager
│   ├── db.js                  # Database client & activity telemetry layer
│   ├── store.js               # Learning mastery & topic progression store
│   ├── router.js              # Hash-based client router & dynamic view coordinator
│   ├── viewer.js              # Course reader, syllabus navigation & KaTeX trigger
│   ├── interactive.js         # Interactive mathematical labs & algorithmic visualizers
│   └── data/
│       ├── catalog.js         # Global catalog aggregator & search index
│       ├── pathwaysData.js    # Learning pathways specification
│       └── courses/           # Course syllabus content & lesson data
│           ├── aiFoundations.js
│           ├── machineLearning.js
│           ├── deepLearning.js
│           ├── generativeAi.js
│           └── agenticAi.js
├── db/
│   ├── schema.sql             # PostgreSQL DDL for Neon Serverless database
│   └── README.md              # Database documentation & provisioning guide
├── scripts/
│   ├── validate.js            # Pre-flight syntax & asset integrity test suite
│   ├── setup-db.js            # Automated Neon DB schema migrator
│   └── test-db.js             # Database connectivity & latency health check
└── vendor/
    └── katex/                 # Mathematical formula typesetting engine
        ├── katex.min.css
        ├── katex.min.js
        └── auto-render.min.js
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
