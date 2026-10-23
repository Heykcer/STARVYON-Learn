// STARVYON Learn - Client-side Hash Router and View Coordinator
// Handles routing across Landing, Pathways, Courses, Course Syllabus, Reader, Auth, and Legal views.

window.STARVYONRouter = (function() {
  var contentMount = null;

  function init(mountElement) {
    contentMount = mountElement;
    window.addEventListener("hashchange", handleRoute);
    handleRoute();
  }

  function handleRoute() {
    var hash = window.location.hash || "#landing";
    updateActiveNavLinks(hash);

    if (hash === "#landing" || hash === "" || hash === "#") {
      renderLandingView();
    } else if (hash === "#pathways") {
      renderPathwaysListView();
    } else if (hash.indexOf("#pathway/") === 0) {
      var pathwayId = hash.replace("#pathway/", "");
      renderPathwayDetailView(pathwayId);
    } else if (hash === "#courses") {
      renderCoursesCatalogView();
    } else if (hash.indexOf("#course/") === 0) {
      var courseId = hash.replace("#course/", "");
      renderCourseSyllabusView(courseId);
    } else if (hash.indexOf("#learn/") === 0) {
      var parts = hash.replace("#learn/", "").split("/");
      var learnCourseId = parts[0];
      var learnTopicId = parts[1] || null;
      window.STARVYONViewer.renderCourseView(contentMount, learnCourseId, learnTopicId);
    } else if (hash === "#profile") {
      renderProfileView();
    } else if (hash === "#terms") {
      renderTermsView();
    } else if (hash === "#privacy") {
      renderPrivacyView();
    } else {
      renderLandingView();
    }
  }

  function updateActiveNavLinks(hash) {
    var links = document.querySelectorAll(".nav-link");
    links.forEach(function(l) {
      var href = l.getAttribute("href");
      if (href === hash || (hash.indexOf(href) === 0 && href !== "#landing")) {
        l.classList.add("active");
      } else {
        l.classList.remove("active");
      }
    });
  }

  // --- View Renderers ---

  // 1. Landing View
  function renderLandingView() {
    var pathways = window.STARVYONCatalog.getPathways();
    var courses = window.STARVYONCatalog.getAllCourses();

    var pathwaysHtml = pathways.map(function(p) {
      var isUpcoming = p.status === "Upcoming Track";
      var linked = p.linkedCourseIds.length > 0 ? p.linkedCourseIds.map(function(cid) {
        var c = window.STARVYONCatalog.getCourseById(cid);
        return c ? c.code : cid;
      }).join(" -> ") : "3 Courses in Development";

      return `
        <div class="pathway-card" style="${isUpcoming ? 'opacity: 0.9; border-style: dashed;' : ''}">
          <div>
            <div class="pathway-card-header">
              <span class="badge ${p.badgeClass}">${p.category}</span>
              <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--ink-muted);">${p.estimatedHours} Hours</span>
            </div>
            <h3 class="pathway-card-title">${p.title}</h3>
            ${p.subtitle ? `<div style="font-family: var(--font-mono); font-size: 0.82rem; color: var(--ink-secondary); margin-top: -0.25rem; margin-bottom: 0.5rem; font-weight: 500;">Learning Path: ${p.subtitle} (${p.code})</div>` : ''}
            <p class="pathway-card-description">${p.summary}</p>
            <ul class="pathway-topics-preview">
              ${p.milestones.slice(0, 4).map(function(m) {
                return `<li><span>${m.stage ? m.stage + ': ' : ''}${m.title}</span><span style="font-family: var(--font-mono);">${m.step}</span></li>`;
              }).join("")}
            </ul>
          </div>
          <div class="pathway-card-footer">
            <span style="font-size: 0.82rem; font-family: var(--font-mono); color: var(--ink-muted);">${isUpcoming ? 'Status: In Development' : 'Sequenced: ' + linked}</span>
            <a href="#pathway/${p.id}" class="btn-secondary" style="font-size: 0.82rem;">${isUpcoming ? 'Track Preview' : 'Inspect Track &rarr;'}</a>
          </div>
        </div>
      `;
    }).join("");

    contentMount.innerHTML = `
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="container hero-layout">
          <div>
            <span class="hero-meta-kicker">Engineering-Grade Curriculum</span>
            <h1 class="hero-title">Definitive Education for Modern Artificial Intelligence</h1>
            <p class="hero-lead">
              STARVYON Learn is a structured, zero-compromise learning platform. Master foundational search, statistical machine learning, deep neural calculus, modern large language models, and autonomous multi-agent systems with rigorous mathematics and production Python.
            </p>
            <div class="hero-actions">
              <a href="#pathways" class="btn-primary" style="padding: 0.75rem 1.4rem;">Browse Learning Pathways</a>
              <a href="#courses" class="btn-secondary" style="padding: 0.75rem 1.4rem;">Explore All Courses</a>
            </div>
          </div>
          <div class="hero-preview-panel">
            <div class="preview-header">
              <span class="preview-title">Curriculum Standard</span>
              <span class="badge badge-forest">Production Grade</span>
            </div>
            <div class="preview-spec-list">
              <div class="preview-spec-item">
                <span class="preview-spec-label">Pedagogy</span>
                <span class="preview-spec-value">7-Part Master Structure per topic (Math, Code, Pitfalls, Lab, Quiz)</span>
              </div>
              <div class="preview-spec-item">
                <span class="preview-spec-label">Frameworks</span>
                <span class="preview-spec-value">PyTorch 2.x, Scikit-Learn, FastMCP, LangGraph</span>
              </div>
              <div class="preview-spec-item">
                <span class="preview-spec-label">Verification</span>
                <span class="preview-spec-value">Diagnostic knowledge checks and dynamic in-browser parameter simulators</span>
              </div>
              <div class="preview-spec-item">
                <span class="preview-spec-label">Track Structure</span>
                <span class="preview-spec-value">Master Artificial Intelligence Track grouping 5 core courses (AI, ML, DL, GenAI, Agentic AI)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Pathways Binary Grid (2 Columns, Never 3 Cards!) -->
      <section class="container" style="padding: 4rem 0;">
        <div class="section-headline">
          <div class="section-kicker">Curated Tracks</div>
          <h2 class="section-title">Select an Engineering Pathway</h2>
          <p class="section-subtitle">
            Pathways link specialized courses into cohesive learning sequences, starting from first principles and progressing to frontier engineering.
          </p>
        </div>
        <div class="pathways-binary-grid">
          ${pathwaysHtml}
        </div>
      </section>

      <!-- Methodology Section (Editorial 2-Column Grid) -->
      <section class="methodology-section">
        <div class="container">
          <div class="section-headline" style="margin-top: 0;">
            <div class="section-kicker">Engineering Methodology</div>
            <h2 class="section-title">Built for Permanent Retention</h2>
          </div>
          <div class="methodology-grid">
            <div class="methodology-item">
              <div class="methodology-num">01 / Formulation</div>
              <h3 class="methodology-heading">Exact Mathematical Derivations</h3>
              <p>Every concept includes closed-form equations, variable breakdowns, and loss formulations. We avoid superficial summaries and present the true mechanics of optimization, attention, and probability.</p>
            </div>
            <div class="methodology-item">
              <div class="methodology-num">02 / Implementation</div>
              <h3 class="methodology-heading">Production-Ready Python Code</h3>
              <p>Code snippets adhere strictly to current industry standards: PyTorch nn.Module architecture, vectorized NumPy operations, and modern Model Context Protocol implementations.</p>
            </div>
            <div class="methodology-item">
              <div class="methodology-num">03 / Diagnostics</div>
              <h3 class="methodology-heading">Common Failure Modes & Pitfalls</h3>
              <p>Understand the edge cases that standard tutorials omit: numerical instability in softmax, data leakage across validation folds, dying ReLUs, and tool execution error propagation in autonomous loops.</p>
            </div>
            <div class="methodology-item">
              <div class="methodology-num">04 / Verification</div>
              <h3 class="methodology-heading">Interactive Simulation Labs</h3>
              <p>Test dynamic behavior directly inside the browser. Adjust regularization penalties, inspect neural activations, evaluate RAG retrieval rankings, and step through ReAct trajectories.</p>
            </div>
          </div>
        </div>
      </section>
    `;
    window.scrollTo(0, 0);
  }

  // 2. Pathways List View
  function renderPathwaysListView() {
    var pathways = window.STARVYONCatalog.getPathways();

    var html = pathways.map(function(p) {
      var isUpcoming = p.status === "Upcoming Track";
      var linkedCoursesHtml = "";

      if (p.linkedCourseIds && p.linkedCourseIds.length > 0) {
        linkedCoursesHtml = p.linkedCourseIds.map(function(cid, idx) {
          var c = window.STARVYONCatalog.getCourseById(cid);
          if (!c) return "";
          var prg = window.STARVYONStore.getCourseProgress(cid);
          return `
            <div class="linked-course-card">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem;">
                  <span class="badge ${p.badgeClass}">${c.code}</span>
                  <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--ink-muted);">Course 0${idx + 1} of 05</span>
                </div>
                <h4 class="linked-course-title">${c.title}</h4>
                <p class="linked-course-summary">${c.summary}</p>
              </div>
              <div class="linked-course-footer">
                <span>Progress: ${prg.percentage}% (${prg.completed}/${prg.total} topics)</span>
                <div style="display: flex; gap: 0.4rem;">
                  <a href="#course/${c.id}" class="btn-secondary" style="font-size: 0.75rem; padding: 0.25rem 0.65rem;">Syllabus</a>
                  <a href="#learn/${c.id}/${c.modules[0].topics[0].topicId}" class="btn-primary" style="font-size: 0.75rem; padding: 0.25rem 0.65rem;">Start &rarr;</a>
                </div>
              </div>
            </div>
          `;
        }).join("");
      } else {
        linkedCoursesHtml = `
          <div style="grid-column: 1 / -1; padding: 1.5rem; border: 1px dashed var(--border-hairline); background: var(--bg-canvas); border-radius: var(--radius-subtle); color: var(--ink-secondary); font-size: 0.9rem;">
            <strong>Curriculum Under Active Formulation:</strong> ${p.courseCount || 3} courses planned in distributed computing substrates, low-latency runtimes, and scalable architectures. See roadmap milestones below.
          </div>
        `;
      }

      var milestonesHtml = p.milestones.map(function(m) {
        return `<li style="font-size: 0.88rem; color: var(--ink-secondary); margin-bottom: 0.35rem;"><strong style="font-family: var(--font-mono);">${m.step}</strong> &mdash; ${m.stage ? m.stage + ': ' : ''}${m.title}</li>`;
      }).join("");

      return `
        <article class="pathway-block" style="${isUpcoming ? 'opacity: 0.9; border-style: dashed;' : ''}">
          <div class="pathway-block-header">
            <div>
              <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem;">
                <span class="badge ${p.badgeClass}">${p.category}</span>
                ${isUpcoming ? '<span class="badge badge-slate">Upcoming Track</span>' : '<span class="badge badge-forest">Active Learning Path</span>'}
              </div>
              <h2 class="pathway-block-title">${p.title}</h2>
              ${p.subtitle ? `<div style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--ink-secondary); margin-bottom: 0.4rem; font-weight: 500;">Learning Path: ${p.subtitle} (${p.code})</div>` : ''}
              <div class="pathway-block-meta">
                <span>Code: ${p.code}</span>
                <span>Level: ${p.level}</span>
                <span>Duration: ${p.estimatedHours} Hours</span>
                <span>${p.linkedCourseIds.length > 0 ? p.linkedCourseIds.length + ' Courses Grouped' : (p.courseCount || 3) + ' Courses Planned'}</span>
              </div>
            </div>
            <a href="#pathway/${p.id}" class="btn-primary" style="font-size: 0.85rem;">${isUpcoming ? 'Inspect Roadmap &rarr;' : 'View Track Details &rarr;'}</a>
          </div>
          <p style="font-size: 1rem; color: var(--ink-secondary); margin-bottom: 1.5rem;">${p.description}</p>
          
          <div class="pathway-linked-courses-title">${isUpcoming ? 'Planned Courses in this Track' : 'The 5 Grouped Courses in this Track (Artificial Intelligence Engineering)'}</div>
          <div class="pathway-courses-grid">
            ${linkedCoursesHtml}
          </div>

          <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-hairline);">
            <div style="font-family: var(--font-mono); font-size: 0.78rem; text-transform: uppercase; color: var(--ink-muted); margin-bottom: 0.5rem;">Sequential Milestone Structure</div>
            <ul style="list-style: none;">
              ${milestonesHtml}
            </ul>
          </div>
        </article>
      `;
    }).join("");

    contentMount.innerHTML = `
      <div class="page-header-band">
        <div class="container">
          <h1 class="page-title">Learning Pathways</h1>
          <p class="page-subtitle">
            Engineered progression tracks uniting specialized coursework into comprehensive, cumulative disciplines. The master <strong>Artificial Intelligence Track</strong> groups all five core subjects (AI, ML, DL, GenAI, and Agentic AI) under one unified pathway called <strong>Artificial Intelligence Engineering</strong>.
          </p>
        </div>
      </div>
      <div class="container pathway-master-list">
        ${html}
      </div>
    `;
    window.scrollTo(0, 0);
  }

  // 3. Pathway Detail View
  function renderPathwayDetailView(pathwayId) {
    var p = window.STARVYONCatalog.getPathwayById(pathwayId);
    if (!p) {
      contentMount.innerHTML = "<div class='container' style='padding: 4rem 0;'><h2>Pathway Not Found</h2><a href='#pathways' class='btn-secondary'>Return to Pathways</a></div>";
      return;
    }

    var linkedCoursesHtml = "";
    if (p.linkedCourseIds && p.linkedCourseIds.length > 0) {
      linkedCoursesHtml = p.linkedCourseIds.map(function(cid, idx) {
        var c = window.STARVYONCatalog.getCourseById(cid);
        if (!c) return "";
        var prg = window.STARVYONStore.getCourseProgress(cid);
        return `
          <div class="linked-course-card" style="padding: 1.5rem;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem;">
                <span class="badge ${p.badgeClass}">${c.code}</span>
                <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--ink-muted);">Course 0${idx + 1} of 05 &bull; ${c.estimatedHours} Hours</span>
              </div>
              <h3 style="font-size: 1.35rem; margin-bottom: 0.5rem;">${c.title}</h3>
              <p style="font-size: 0.95rem; color: var(--ink-secondary); margin-bottom: 1.25rem;">${c.description}</p>
            </div>
            <div class="linked-course-footer">
              <span>Completion: ${prg.percentage}%</span>
              <div style="display: flex; gap: 0.5rem;">
                <a href="#course/${c.id}" class="btn-secondary" style="font-size: 0.8rem;">View Syllabus</a>
                <a href="#learn/${c.id}/${c.modules[0].topics[0].topicId}" class="btn-primary" style="font-size: 0.8rem;">Start Course &rarr;</a>
              </div>
            </div>
          </div>
        `;
      }).join("");
    } else {
      linkedCoursesHtml = `
        <div style="padding: 2rem; border: 1px dashed var(--border-strong); background: var(--bg-surface); border-radius: var(--radius-subtle); color: var(--ink-secondary); font-size: 0.95rem; line-height: 1.6;">
          <h4 style="font-size: 1.1rem; color: var(--ink-primary); margin-bottom: 0.5rem;">Curriculum Under Construction</h4>
          <p>This pathway's course specifications and interactive modules are currently being designed. Check back soon or explore the active <strong>Artificial Intelligence Track</strong>.</p>
        </div>
      `;
    }

    var rolesHtml = p.targetRoles.map(function(r) {
      return `<li style="font-size: 0.95rem; margin-bottom: 0.35rem; color: var(--ink-secondary);">${r}</li>`;
    }).join("");

    var milestonesHtml = p.milestones.map(function(m) {
      return `
        <div style="display: flex; gap: 1.25rem; align-items: baseline; padding: 0.75rem 0; border-bottom: 1px solid var(--border-hairline);">
          <span style="font-family: var(--font-mono); font-size: 0.9rem; font-weight: 600; color: var(--ink-primary);">${m.step}</span>
          <span style="font-size: 1rem; color: var(--ink-secondary);">${m.title}</span>
        </div>
      `;
    }).join("");

    contentMount.innerHTML = `
      <div class="page-header-band">
        <div class="container">
          <nav class="content-breadcrumb">
            <a href="#pathways">Pathways</a>
            <span>/</span>
            <span>${p.title}</span>
          </nav>
          <div style="display: flex; gap: 0.75rem; align-items: center; margin-bottom: 0.5rem;">
            <span class="badge ${p.badgeClass}">${p.category}</span>
            <span style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--ink-muted);">${p.estimatedHours} Hours Required</span>
            ${p.subtitle ? `<span style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--ink-secondary);">&bull; ${p.subtitle} (${p.code})</span>` : ''}
          </div>
          <h1 class="page-title">${p.title}</h1>
          <p class="page-subtitle">${p.summary}</p>
        </div>
      </div>

      <div class="container" style="margin-bottom: 4rem;">
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 3rem;">
          <div>
            <h2 style="font-size: 1.6rem; margin-bottom: 1rem;">Track Overview & Philosophy</h2>
            <p style="font-size: 1.05rem; line-height: 1.8; margin-bottom: 2rem;">${p.description}</p>
            
            <h3 style="font-size: 1.35rem; margin-bottom: 1rem;">Associated Courses</h3>
            <div style="display: flex; flex-direction: column; gap: 1.5rem; margin-bottom: 3rem;">
              ${linkedCoursesHtml}
            </div>

            <h3 style="font-size: 1.35rem; margin-bottom: 1rem;">Roadmap Milestones</h3>
            <div style="border-top: 1px solid var(--border-hairline); margin-bottom: 2rem;">
              ${milestonesHtml}
            </div>
          </div>

          <aside>
            <div style="border: 1px solid var(--border-strong); background: var(--bg-surface); padding: 1.75rem; border-radius: var(--radius-subtle); margin-bottom: 2rem;">
              <h4 style="font-size: 1.05rem; margin-bottom: 1rem; border-bottom: 1px solid var(--border-hairline); padding-bottom: 0.5rem;">Target Engineering Roles</h4>
              <ul style="list-style: square inside; margin-bottom: 1rem;">
                ${rolesHtml}
              </ul>
              <div style="font-size: 0.85rem; color: var(--ink-muted); line-height: 1.5;">
                Graduates of this pathway possess verified competency in production algorithms, testing, and system architecture.
              </div>
            </div>
          </aside>
        </div>
      </div>
    `;
    window.scrollTo(0, 0);
  }

  // 4. Courses Catalog View
  function renderCoursesCatalogView() {
    var aiCourses = window.STARVYONCatalog.getCoursesByCategory("Artificial Intelligence");
    if (!aiCourses || aiCourses.length === 0) {
      aiCourses = window.STARVYONCatalog.getAllCourses();
    }

    var upcomingSystemsCourses = [
      {
        code: "SYS-101",
        category: "Systems & Infrastructure",
        estimatedHours: 60,
        title: "GPU Cluster Architecture, CUDA Kernels, and Interconnects",
        summary: "Hardware compute substrates, GPU streaming multiprocessor anatomy, high-bandwidth memory (HBM3), InfiniBand topology, and raw CUDA C++ kernel optimization.",
        plannedModules: ["SM Architecture & Warps", "CUDA Memory Hierarchy", "NCCL Collectives & NVLink"]
      },
      {
        code: "SYS-201",
        category: "Systems & Infrastructure",
        estimatedHours: 55,
        title: "High-Throughput Model Serving with vLLM and TensorRT-LLM",
        summary: "Continuous batching, PagedAttention memory management, speculative decoding, TensorRT engine compilation, and low-latency Triton inference orchestration.",
        plannedModules: ["PagedAttention & KV Pools", "Speculative Decoding Engines", "Multi-GPU Triton Cluster Setup"]
      },
      {
        code: "SYS-301",
        category: "Systems & Infrastructure",
        estimatedHours: 65,
        title: "Data, Tensor, and Pipeline Parallelism for Trillion-Parameter Models",
        summary: "Megatron-LM 3D parallelism, ZeRO stage 1-3 memory sharding, pipeline bubble minimization, and fault-tolerant distributed checkpointing.",
        plannedModules: ["Megatron 3D Parallelism", "DeepSpeed ZeRO-3 Memory Sharding", "Fault Tolerance & Elastic Checkpoints"]
      }
    ];

    var upcomingDataCourses = [
      {
        code: "DAT-101",
        category: "Data Engineering",
        estimatedHours: 45,
        title: "Event Streaming Architectures and Distributed Logs",
        summary: "High-throughput event sourcing with Apache Kafka, consumer group partition balancing, exactly-once processing semantics, and real-time CDC ingestion.",
        plannedModules: ["Distributed Commit Log Mechanics", "Exactly-Once Semantics (EOS)", "CDC Pipeline Integration"]
      },
      {
        code: "DAT-201",
        category: "Data Engineering",
        estimatedHours: 50,
        title: "High-Dimension Vector Indexing, HNSW Sharding, and Hybrid Retrieval",
        summary: "Hierarchical Navigable Small World (HNSW) graph construction, product quantization (PQ), distributed shard replication, and reciprocal rank fusion.",
        plannedModules: ["HNSW Graph Index Topology", "Product & Scalar Quantization", "Distributed Sharded Vector Stores"]
      },
      {
        code: "DAT-301",
        category: "Data Engineering",
        estimatedHours: 45,
        title: "Transactional Storage Formats and Continuous Feature Pipelines",
        summary: "Apache Iceberg and Delta Lake table ACID transactions, low-latency point-in-time feature computation with Flink, and feature store serving.",
        plannedModules: ["Iceberg Snapshot Isolation", "Point-in-Time Correct Feature Joins", "Low-Latency Online Feature Serving"]
      }
    ];

    function buildAiCourseCards(coursesList) {
      if (coursesList.length === 0) {
        return "<div style='grid-column: 1 / -1; padding: 2.5rem; text-align: center; color: var(--ink-muted); background: var(--bg-surface); border: 1px dashed var(--border-hairline); border-radius: var(--radius-subtle);'>No courses found in this category matching your search criteria.</div>";
      }

      return coursesList.map(function(c) {
        var progress = window.STARVYONStore.getCourseProgress(c.id);
        var modulesPreview = c.modules.map(function(m) {
          return `<li>${m.title} (${m.topics.length} topics)</li>`;
        }).join("");

        return `
          <article class="course-card-editorial" id="course-card-${c.id}">
            <div class="course-card-top">
              <div class="course-card-meta">
                <span class="badge badge-forest">${c.code}</span>
                <span style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--ink-muted);">${c.category}</span>
                <span style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--ink-muted);">&bull; ${c.estimatedHours}h</span>
              </div>
              <h3 class="course-card-title">${c.title}</h3>
              <p class="course-card-summary">${c.summary}</p>
              
              <ol class="course-syllabus-preview">
                ${modulesPreview}
              </ol>
            </div>
            
            <div class="course-card-bottom">
              <div class="course-progress-indicator">
                <div class="progress-track">
                  <div class="progress-fill" style="width: ${progress.percentage}%;"></div>
                </div>
                <span>${progress.percentage}%</span>
              </div>
              <div style="display: flex; gap: 0.5rem;">
                <a href="#course/${c.id}" class="btn-secondary" style="font-size: 0.8rem; padding: 0.35rem 0.75rem;">View Syllabus</a>
                <a href="#learn/${c.id}/${c.modules[0].topics[0].topicId}" class="btn-primary" style="font-size: 0.8rem; padding: 0.35rem 0.75rem;">Enter Course &rarr;</a>
              </div>
            </div>
          </article>
        `;
      }).join("");
    }

    function buildUpcomingCards(list) {
      return list.map(function(u) {
        var modulesList = u.plannedModules.map(function(m) {
          return `<li>${m}</li>`;
        }).join("");

        return `
          <article class="upcoming-course-card">
            <div class="course-card-top">
              <div class="course-card-meta">
                <span class="badge badge-slate">${u.code}</span>
                <span style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--ink-muted);">${u.category}</span>
                <span style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--ink-muted);">&bull; ${u.estimatedHours}h</span>
              </div>
              <h3 class="course-card-title" style="color: var(--ink-secondary); font-size: 1.25rem;">${u.title}</h3>
              <p class="course-card-summary">${u.summary}</p>
              
              <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--ink-muted); margin-bottom: 0.4rem; text-transform: uppercase;">Planned Core Modules:</div>
              <ul style="list-style: square inside; font-size: 0.84rem; color: var(--ink-muted); margin-bottom: 1rem;">
                ${modulesList}
              </ul>
            </div>

            <div class="course-card-bottom">
              <span class="upcoming-badge">Status: In Curriculum Formulation</span>
              <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--ink-muted);">Enrollment Opening Q4 2026</span>
            </div>
          </article>
        `;
      }).join("");
    }

    contentMount.innerHTML = `
      <div class="page-header-band">
        <div class="container">
          <h1 class="page-title">Course Catalog</h1>
          <p class="page-subtitle">
            Explore individual courses. All 5 core engineering courses below are standalone curricula categorized under the <strong>Artificial Intelligence</strong> discipline and linked to the master <strong>Artificial Intelligence Track</strong>. As more learning paths launch in the future (such as Systems Architecture and Data Engineering), their respective courses will appear under new discipline categories below.
          </p>
        </div>
      </div>

      <div class="container">
        <!-- Filter and Search Toolbar -->
        <div class="catalog-toolbar">
          <div class="filter-group">
            <button class="filter-btn active" data-filter="all">All Disciplines (5 Active + Upcoming)</button>
            <button class="filter-btn" data-filter="cat-ai">Category: Artificial Intelligence (5)</button>
            <button class="filter-btn" data-filter="cat-sys">Category: Systems & Infrastructure (3 Upcoming)</button>
            <button class="filter-btn" data-filter="cat-data">Category: Data Engineering (3 Upcoming)</button>
            <button class="filter-btn" data-filter="ai-foundations">AI-101</button>
            <button class="filter-btn" data-filter="machine-learning">ML-201</button>
            <button class="filter-btn" data-filter="deep-learning">DL-301</button>
            <button class="filter-btn" data-filter="generative-ai">GENAI-401</button>
            <button class="filter-btn" data-filter="agentic-ai">AGENT-501</button>
          </div>
          <div class="search-input-wrapper">
            <input type="text" id="catalog-search" class="catalog-search-input" placeholder="Search algorithms, topics, codes...">
          </div>
        </div>

        <!-- 1. Category Section: Artificial Intelligence (The 5 Core Courses) -->
        <section class="catalog-category-block" id="category-ai-block">
          <div class="catalog-category-header">
            <div class="catalog-category-title-wrap">
              <span class="badge badge-forest">Discipline</span>
              <h2 class="catalog-category-title">Artificial Intelligence</h2>
              <span class="catalog-category-count">(5 Standalone Courses)</span>
            </div>
            <div class="catalog-category-pathway-link">
              <span>Governing Track:</span>
              <a href="#pathway/path-ai-engineering">Artificial Intelligence Track (Artificial Intelligence Engineering) &rarr;</a>
            </div>
          </div>
          <p class="catalog-category-desc">
            Complete mathematical and algorithmic progression spanning rational agent search, statistical machine learning, deep neural backpropagation calculus, modern generative LLM stacks, and autonomous multi-agent systems. View each course independently or complete the track in sequence.
          </p>
          <div class="courses-grid-two-column" id="courses-grid-ai">
            ${buildAiCourseCards(aiCourses)}
          </div>
        </section>

        <!-- 2. Upcoming Category Section: Systems & Infrastructure -->
        <section class="catalog-category-block" id="category-sys-block">
          <div class="catalog-category-header">
            <div class="catalog-category-title-wrap">
              <span class="badge badge-slate">Upcoming Discipline</span>
              <h2 class="catalog-category-title" style="color: var(--ink-secondary);">Systems & Infrastructure</h2>
              <span class="catalog-category-count">(3 Courses in Development)</span>
            </div>
            <div class="catalog-category-pathway-link">
              <span>Future Learning Path:</span>
              <a href="#pathway/path-systems-infrastructure">Systems Architecture & High-Performance Infrastructure &rarr;</a>
            </div>
          </div>
          <p class="catalog-category-desc">
            Hardware compute substrates, GPU streaming multiprocessor anatomy, InfiniBand topology, and low-latency inference serving engines (vLLM, TensorRT-LLM) for large model deployments.
          </p>
          <div class="courses-grid-two-column">
            ${buildUpcomingCards(upcomingSystemsCourses)}
          </div>
        </section>

        <!-- 3. Upcoming Category Section: Data Engineering -->
        <section class="catalog-category-block" id="category-data-block">
          <div class="catalog-category-header">
            <div class="catalog-category-title-wrap">
              <span class="badge badge-slate">Upcoming Discipline</span>
              <h2 class="catalog-category-title" style="color: var(--ink-secondary);">Data Engineering</h2>
              <span class="catalog-category-count">(3 Courses in Development)</span>
            </div>
            <div class="catalog-category-pathway-link">
              <span>Future Learning Path:</span>
              <a href="#pathway/path-data-engineering">Data Systems & Real-Time Streaming Infrastructure &rarr;</a>
            </div>
          </div>
          <p class="catalog-category-desc">
            Petabyte-scale distributed event streaming, vector search database sharding, and transactional feature stores for real-time model inference and training loops.
          </p>
          <div class="courses-grid-two-column">
            ${buildUpcomingCards(upcomingDataCourses)}
          </div>
        </section>
      </div>
    `;

    // Filter and search listeners
    var searchInput = contentMount.querySelector("#catalog-search");
    var gridAi = contentMount.querySelector("#courses-grid-ai");
    var blockAi = contentMount.querySelector("#category-ai-block");
    var blockSys = contentMount.querySelector("#category-sys-block");
    var blockData = contentMount.querySelector("#category-data-block");
    var filterBtns = contentMount.querySelectorAll(".filter-btn");

    function applySearchAndFilter() {
      var q = searchInput.value.toLowerCase().trim();
      var activeFilter = contentMount.querySelector(".filter-btn.active").getAttribute("data-filter");
      var results = window.STARVYONCatalog.search(q);
      var filteredAi = results.filter(function(c) { return c.category === "Artificial Intelligence"; });

      if (activeFilter === "cat-ai") {
        blockAi.style.display = "block";
        blockSys.style.display = "none";
        blockData.style.display = "none";
      } else if (activeFilter === "cat-sys") {
        blockAi.style.display = "none";
        blockSys.style.display = "block";
        blockData.style.display = "none";
      } else if (activeFilter === "cat-data") {
        blockAi.style.display = "none";
        blockSys.style.display = "none";
        blockData.style.display = "block";
      } else if (activeFilter === "all") {
        blockAi.style.display = "block";
        blockSys.style.display = q === "" ? "block" : "none";
        blockData.style.display = q === "" ? "block" : "none";
      } else {
        // Individual course ID selected
        blockAi.style.display = "block";
        blockSys.style.display = "none";
        blockData.style.display = "none";
        filteredAi = filteredAi.filter(function(c) { return c.id === activeFilter; });
      }

      gridAi.innerHTML = buildAiCourseCards(filteredAi);
    }

    searchInput.oninput = applySearchAndFilter;

    filterBtns.forEach(function(btn) {
      btn.onclick = function() {
        filterBtns.forEach(function(b) { b.classList.remove("active"); });
        btn.classList.add("active");
        applySearchAndFilter();
      };
    });

    window.scrollTo(0, 0);
  }

  // 5. Course Syllabus View
  function renderCourseSyllabusView(courseId) {
    var course = window.STARVYONCatalog.getCourseById(courseId);
    if (!course) {
      contentMount.innerHTML = "<div class='container' style='padding: 4rem 0;'><h2>Course Not Found</h2><a href='#courses' class='btn-secondary'>Return to Catalog</a></div>";
      return;
    }

    var progress = window.STARVYONStore.getCourseProgress(course.id);
    var firstTopicId = course.modules[0].topics[0].topicId;

    var modulesHtml = course.modules.map(function(m) {
      var topicsList = m.topics.map(function(t) {
        var isDone = window.STARVYONStore.isTopicCompleted(course.id, t.topicId);
        return `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid var(--border-hairline);">
            <div>
              <a href="#learn/${course.id}/${t.topicId}" style="font-weight: 500; font-size: 0.95rem; color: var(--ink-primary);">${t.title}</a>
              <div style="font-size: 0.8rem; color: var(--ink-muted); font-family: var(--font-mono); margin-top: 0.2rem;">
                Estimated: ${t.estimatedMinutes} mins &bull; ${t.subtopics.length} subtopics
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
              <span style="font-family: var(--font-mono); font-size: 0.78rem; color: ${isDone ? 'var(--accent-forest)' : 'var(--ink-muted)'};">
                ${isDone ? '[Completed]' : '[Pending]'}
              </span>
              <a href="#learn/${course.id}/${t.topicId}" class="btn-secondary" style="font-size: 0.75rem; padding: 0.25rem 0.65rem;">Read Topic</a>
            </div>
          </div>
        `;
      }).join("");

      return `
        <div style="margin-bottom: 2rem; border: 1px solid var(--border-hairline); background: var(--bg-surface); padding: 1.5rem; border-radius: var(--radius-subtle);">
          <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">${m.title}</h3>
          <div style="margin-top: 1rem;">
            ${topicsList}
          </div>
        </div>
      `;
    }).join("");

    contentMount.innerHTML = `
      <div class="page-header-band">
        <div class="container">
          <nav class="content-breadcrumb">
            <a href="#courses">Courses</a>
            <span>/</span>
            <span>${course.code}</span>
          </nav>
          <div style="display: flex; gap: 0.75rem; align-items: center; margin-bottom: 0.5rem;">
            <span class="badge badge-forest">${course.code}</span>
            <span style="font-family: var(--font-mono); font-size: 0.82rem; color: var(--ink-muted);">${course.category}</span>
          </div>
          <h1 class="page-title">${course.title}</h1>
          <p class="page-subtitle">${course.summary}</p>
        </div>
      </div>

      <div class="container" style="margin-bottom: 4rem;">
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 3rem;">
          <div>
            <h2 style="font-size: 1.5rem; margin-bottom: 1rem;">Course Description & Goals</h2>
            <p style="font-size: 1.05rem; line-height: 1.8; margin-bottom: 2.5rem;">${course.description}</p>
            
            <h3 style="font-size: 1.35rem; margin-bottom: 1.25rem;">Comprehensive Course Syllabus</h3>
            ${modulesHtml}
          </div>

          <aside>
            <div style="border: 1px solid var(--border-strong); background: var(--bg-surface); padding: 1.75rem; border-radius: var(--radius-subtle); margin-bottom: 2rem;">
              <h4 style="font-size: 1.05rem; margin-bottom: 1rem; border-bottom: 1px solid var(--border-hairline); padding-bottom: 0.5rem;">Course Statistics</h4>
              <div style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.9rem; margin-bottom: 1.5rem;">
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: var(--ink-muted);">Level</span>
                  <strong>${course.level}</strong>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: var(--ink-muted);">Estimated Effort</span>
                  <strong>${course.estimatedHours} Hours</strong>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: var(--ink-muted);">Completion</span>
                  <strong>${progress.percentage}% (${progress.completed}/${progress.total})</strong>
                </div>
              </div>
              <a href="#learn/${course.id}/${firstTopicId}" class="btn-primary" style="display: block; text-align: center; padding: 0.65rem 1rem;">
                ${progress.percentage > 0 ? 'Continue Course &rarr;' : 'Begin Course &rarr;'}
              </a>
            </div>

            <div style="border: 1px solid var(--border-hairline); background: var(--bg-canvas); padding: 1.5rem; border-radius: var(--radius-subtle);">
              <h4 style="font-size: 0.95rem; margin-bottom: 0.75rem;">Required Prerequisites</h4>
              <ul style="list-style: square inside; font-size: 0.88rem; color: var(--ink-secondary);">
                ${course.prerequisites.map(function(pr) { return `<li>${pr}</li>`; }).join("")}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    `;
    window.scrollTo(0, 0);
  }

  // 6. Profile View
  function renderProfileView() {
    var user = window.STARVYONAuth.getCurrentUser();
    var stats = window.STARVYONStore.getOverallStats();
    var progress = window.STARVYONStore.getProgress();

    if (!user) {
      contentMount.innerHTML = `
        <div class="container" style="padding: 4rem 0; max-width: 600px;">
          <h2>Sign in to view your profile</h2>
          <p>Create an account or sign in to track your learning journey across all pathways and courses.</p>
          <button id="profile-login-btn" class="btn-primary" style="margin-top: 1rem;">Sign In / Register</button>
        </div>
      `;
      contentMount.querySelector("#profile-login-btn").onclick = function() {
        window.STARVYONApp.openAuthModal();
      };
      return;
    }

    contentMount.innerHTML = `
      <div class="page-header-band">
        <div class="container">
          <h1 class="page-title">Fellow Profile & Progress Radar</h1>
          <p class="page-subtitle">Track your mastery, completed diagnostic assessments, and persistent credentials.</p>
        </div>
      </div>

      <div class="container" style="margin-bottom: 4rem;">
        <div class="profile-card">
          <div class="profile-header">
            <div>
              <h2 class="profile-name">${user.name}</h2>
              <div class="profile-email">${user.email} &bull; Role: ${user.role}</div>
            </div>
            <button id="logout-btn" class="btn-secondary" style="font-size: 0.8rem;">Sign Out</button>
          </div>

          <div class="profile-stats-grid">
            <div class="stat-item">
              <div class="stat-label">Topics Completed</div>
              <div class="stat-value">${stats.completedTopics} <span style="font-size: 0.9rem; font-family: var(--font-sans); color: var(--ink-muted);">/ ${stats.totalTopics}</span></div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Completion Ratio</div>
              <div class="stat-value">${stats.completionRate}%</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Knowledge Checks Passed</div>
              <div class="stat-value">${stats.quizzesTaken}</div>
            </div>
          </div>
        </div>

        <h3 style="font-size: 1.35rem; margin-bottom: 1.25rem;">Active Course Standings</h3>
        <div class="pathway-courses-grid">
          ${window.STARVYONCatalog.getAllCourses().map(function(c) {
            var prg = window.STARVYONStore.getCourseProgress(c.id);
            return `
              <div class="linked-course-card" style="padding: 1.5rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                  <span class="badge badge-forest">${c.code}</span>
                  <span style="font-family: var(--font-mono); font-size: 0.8rem; font-weight: 600;">${prg.percentage}%</span>
                </div>
                <h4 style="font-size: 1.15rem; margin-bottom: 0.5rem;">${c.title}</h4>
                <div class="progress-track" style="width: 100%; margin: 0.75rem 0;">
                  <div class="progress-fill" style="width: ${prg.percentage}%;"></div>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; font-family: var(--font-mono); color: var(--ink-muted);">
                  <span>${prg.completed} of ${prg.total} modules</span>
                  <a href="#learn/${c.id}/${c.modules[0].topics[0].topicId}" class="btn-secondary" style="font-size: 0.75rem; padding: 0.2rem 0.55rem;">Continue</a>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;

    var logoutBtn = contentMount.querySelector("#logout-btn");
    if (logoutBtn) {
      logoutBtn.onclick = function() {
        window.STARVYONAuth.logout();
        window.location.hash = "#landing";
        window.location.reload();
      };
    }
  }

  // 7. Terms of Service View
  function renderTermsView() {
    contentMount.innerHTML = `
      <div class="page-header-band">
        <div class="container">
          <h1 class="page-title">Terms of Service</h1>
          <p class="page-subtitle">Effective Date: October 22, 2026</p>
        </div>
      </div>
      <div class="container" style="max-width: 800px; margin-bottom: 4rem;">
        <section style="margin-bottom: 2rem;">
          <h3 style="margin-bottom: 0.75rem;">1. Agreement to Terms</h3>
          <p>By accessing or using the STARVYON Learn platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please refrain from using the platform.</p>
        </section>
        <section style="margin-bottom: 2rem;">
          <h3 style="margin-bottom: 0.75rem;">2. Intellectual Property and Curriculum Rights</h3>
          <p>All curriculum text, mathematical formulations, architecture diagrams, code implementations, and interactive labs hosted on STARVYON Learn are protected by copyright and intellectual property laws. You are granted a personal, non-commercial, revocable license to read, execute, and study the materials.</p>
        </section>
        <section style="margin-bottom: 2rem;">
          <h3 style="margin-bottom: 0.75rem;">3. User Accounts and Data Integrity</h3>
          <p>When creating an account, you agree to provide accurate information. You are solely responsible for maintaining the confidentiality of your account credentials and for all learning progress and code evaluations associated with your account.</p>
        </section>
        <section style="margin-bottom: 2rem;">
          <h3 style="margin-bottom: 0.75rem;">4. Limitation of Liability</h3>
          <p>Educational materials and code samples are provided on an "as is" and "as available" basis without warranties of any kind. STARVYON Learn shall not be liable for any indirect, incidental, or consequential damages resulting from the execution or deployment of code taught within the curriculum.</p>
        </section>
      </div>
    `;
    window.scrollTo(0, 0);
  }

  // 8. Privacy Policy View
  function renderPrivacyView() {
    contentMount.innerHTML = `
      <div class="page-header-band">
        <div class="container">
          <h1 class="page-title">Privacy Policy</h1>
          <p class="page-subtitle">Effective Date: October 22, 2026</p>
        </div>
      </div>
      <div class="container" style="max-width: 800px; margin-bottom: 4rem;">
        <section style="margin-bottom: 2rem;">
          <h3 style="margin-bottom: 0.75rem;">1. Information We Collect</h3>
          <p>We respect your privacy. STARVYON Learn collects only the minimal information required to maintain your learning progress: your name, email address, password hash, completed lesson markers, and diagnostic quiz scores.</p>
        </section>
        <section style="margin-bottom: 2rem;">
          <h3 style="margin-bottom: 0.75rem;">2. How We Store and Use Your Data</h3>
          <p>Your user profile and learning history are stored locally within your browser's persistent storage and synced strictly for tracking pathway progress and quiz evaluations. We do not sell, rent, or share personal data with third-party advertising networks.</p>
        </section>
        <section style="margin-bottom: 2rem;">
          <h3 style="margin-bottom: 0.75rem;">3. Data Retention and Erasure</h3>
          <p>You have the absolute right to inspect, export, or permanently erase your learning progress and account records at any time by clearing your browser storage or contacting the platform administrator.</p>
        </section>
      </div>
    `;
    window.scrollTo(0, 0);
  }

  return {
    init: init
  };
})();
