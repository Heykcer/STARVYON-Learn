// STARVYON Learn - Learning Pathways Data
// Unified tracks grouping specialized courses with sequential prerequisites.

window.STARVYONPathways = [
  {
    id: "path-ai-engineering",
    title: "Artificial Intelligence Track",
    subtitle: "Artificial Intelligence Engineering",
    code: "TRACK-AIE",
    category: "Artificial Intelligence",
    badgeClass: "badge-forest",
    level: "Foundational to Frontier",
    estimatedHours: 262,
    courseCount: 5,
    targetRoles: [
      "AI Systems Engineer",
      "Machine Learning Research Engineer",
      "Foundation Model Architect",
      "Autonomous Agent Developer"
    ],
    summary: "The unified Learning Path called Artificial Intelligence Engineering. Groups the five core disciplines—Artificial Intelligence, Machine Learning, Deep Learning, Generative AI, and Agentic AI—into a single rigorous, cumulative engineering track.",
    description: "The Artificial Intelligence Track unites the five indispensable pillars of modern computational intelligence under one comprehensive curriculum. Rather than fragmenting into disconnected tutorials, learners advance systematically: from classical state-space search and logic (AI), through statistical regularization and ensembles (ML), to neural backpropagation and PyTorch mechanics (DL), modern decoder transformers and parameter-efficient fine-tuning (GenAI), and finally autonomous agency with tool calling and Model Context Protocol (Agentic AI).",
    linkedCourseIds: [
      "ai-foundations",
      "machine-learning",
      "deep-learning",
      "generative-ai",
      "agentic-ai"
    ],
    milestones: [
      { step: "01", stage: "Symbolic & Search", courseCode: "AI-101", title: "Artificial Intelligence Foundations (PEAS, A* Search, Minimax, AC-3)" },
      { step: "02", stage: "Statistical Inference", courseCode: "ML-201", title: "Machine Learning (SVD, Regularization, Ensembles, Cross-Validation)" },
      { step: "03", stage: "Neural Mechanics", courseCode: "DL-301", title: "Deep Learning (Backpropagation, AdamW, ResNet, Scaled Dot-Product Attention)" },
      { step: "04", stage: "Generative Systems", courseCode: "GENAI-401", title: "Generative AI & Foundation Models (RoPE, KV-Cache, LoRA/QLoRA, DPO, Enterprise RAG)" },
      { step: "05", stage: "Autonomous Agency", courseCode: "AGENT-501", title: "Agentic AI & Autonomous Systems (Sense-Think-Act-Reflect Loop, MCP Protocol, LangGraph)" }
    ]
  },
  {
    id: "path-systems-infrastructure",
    title: "Systems Architecture & High-Performance Infrastructure",
    subtitle: "AI Infrastructure & Compute Topology",
    code: "TRACK-SYS",
    category: "Systems & Infrastructure",
    badgeClass: "badge-slate",
    level: "Advanced",
    estimatedHours: 180,
    status: "Upcoming Track",
    courseCount: 3,
    targetRoles: [
      "AI Infrastructure Engineer",
      "High-Performance Computing Specialist",
      "Distributed Systems Architect"
    ],
    summary: "Upcoming learning path focusing on distributed GPU cluster orchestration, Triton & vLLM inference engines, InfiniBand networking, and pipeline parallelism.",
    description: "Currently in active curriculum design. This track will focus on the compute, memory, and networking substrates required to train and serve trillion-parameter foundation models at scale.",
    linkedCourseIds: [],
    milestones: [
      { step: "01", stage: "Compute Substrates", courseCode: "SYS-101", title: "GPU Cluster Architecture, CUDA Kernels, and Interconnects" },
      { step: "02", stage: "Serving Engines", courseCode: "SYS-201", title: "High-Throughput Model Serving with vLLM and TensorRT-LLM" },
      { step: "03", stage: "Distributed Compute", courseCode: "SYS-301", title: "Data, Tensor, and Pipeline Parallelism for Trillion-Parameter Models" }
    ]
  },
  {
    id: "path-data-engineering",
    title: "Data Systems & Real-Time Streaming Infrastructure",
    subtitle: "Data Intensive Intelligence",
    code: "TRACK-DATA",
    category: "Data Engineering",
    badgeClass: "badge-slate",
    level: "Intermediate to Advanced",
    estimatedHours: 140,
    status: "Upcoming Track",
    courseCount: 3,
    targetRoles: [
      "Data Systems Architect",
      "Real-Time Stream Engineer",
      "Lakehouse Infrastructure Lead"
    ],
    summary: "Upcoming learning path covering high-throughput vector index sharding, stream processing with Apache Flink, and low-latency feature stores.",
    description: "In development. This track prepares engineers to design petabyte-scale data pipelines, vector search clusters, and real-time feature delivery backends.",
    linkedCourseIds: [],
    milestones: [
      { step: "01", stage: "Stream Engines", courseCode: "DAT-101", title: "Event Streaming Architectures and Distributed Logs" },
      { step: "02", stage: "Vector Scale", courseCode: "DAT-201", title: "High-Dimension Vector Indexing, HNSW Sharding, and Hybrid Retrieval" },
      { step: "03", stage: "Lakehouse Storage", courseCode: "DAT-301", title: "Transactional Storage Formats and Continuous Feature Pipelines" }
    ]
  }
];
