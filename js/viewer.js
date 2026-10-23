// STARVYON Learn - Course Content Reader & Navigation Renderer
// Manages lesson display, table of contents sidebar, code copy, and quizzes.

window.STARVYONViewer = {
  renderCourseView: function(container, courseId, targetTopicId) {
    var course = window.STARVYONCatalog.getCourseById(courseId);
    if (!course) {
      container.innerHTML = "<div class='container' style='padding: 4rem 0;'><h2>Course Not Found</h2><p>The requested course identifier does not exist.</p><a href='#courses' class='btn-secondary'>Return to Courses</a></div>";
      return;
    }

    // Default to first topic if none specified
    if (!targetTopicId) {
      if (course.modules.length > 0 && course.modules[0].topics.length > 0) {
        targetTopicId = course.modules[0].topics[0].topicId;
      }
    }

    var topicMeta = window.STARVYONCatalog.getTopicById(courseId, targetTopicId);
    if (!topicMeta) {
      targetTopicId = course.modules[0].topics[0].topicId;
      topicMeta = window.STARVYONCatalog.getTopicById(courseId, targetTopicId);
    }

    var progress = window.STARVYONStore.getCourseProgress(courseId);

    // Build Viewer Layout
    container.innerHTML = `
      <div class="viewer-layout">
        <!-- Sidebar Navigation -->
        <aside class="viewer-sidebar">
          <div class="sidebar-header">
            <div class="sidebar-course-kicker">${course.code} &bull; ${course.category}</div>
            <h3 class="sidebar-course-title">${course.title}</h3>
            <div class="sidebar-progress-bar-wrap">
              <div class="sidebar-progress-text">
                <span>Course Progress</span>
                <span id="sidebar-progress-pct">${progress.percentage}%</span>
              </div>
              <div class="sidebar-progress-bar">
                <div id="sidebar-progress-fill" class="sidebar-progress-fill" style="width: ${progress.percentage}%;"></div>
              </div>
            </div>
          </div>
          <nav class="syllabus-nav">
            ${this.buildSidebarNavHtml(course, targetTopicId)}
          </nav>
        </aside>

        <!-- Main Reading Pane -->
        <main class="viewer-content-pane" id="viewer-main-pane">
          ${this.buildLessonHtml(course, topicMeta.module, topicMeta.topic)}
        </main>
      </div>
    `;

    // Initialize interactive lab if present
    if (topicMeta.topic.interactiveLab) {
      var labContainer = container.querySelector("#interactive-lab-mount");
      if (labContainer) {
        window.STARVYONInteractive.renderLab(labContainer, topicMeta.topic.interactiveLab);
      }
    }

    // Attach handlers
    this.attachViewerHandlers(container, course, topicMeta);
    window.scrollTo(0, 0);
  },

  buildSidebarNavHtml: function(course, activeTopicId) {
    var html = "";
    for (var m = 0; m < course.modules.length; m++) {
      var mod = course.modules[m];
      html += `<div class="module-group">`;
      html += `<div class="module-group-title">${mod.title}</div>`;
      html += `<ul class="topic-nav-list">`;
      for (var t = 0; t < mod.topics.length; t++) {
        var top = mod.topics[t];
        var isActive = top.topicId === activeTopicId;
        var isDone = window.STARVYONStore.isTopicCompleted(course.id, top.topicId);
        html += `
          <li class="topic-nav-item ${isActive ? 'active' : ''}" data-topic-id="${top.topicId}">
            <span>${top.title}</span>
            <span class="topic-status-marker ${isDone ? 'completed' : ''}">${isDone ? '[Completed]' : ''}</span>
          </li>
        `;
      }
      html += `</ul></div>`;
    }
    return html;
  },

  buildLessonHtml: function(course, mod, topic) {
    var isDone = window.STARVYONStore.isTopicCompleted(course.id, topic.topicId);
    var subtopicsHtml = topic.subtopics.map(function(s) {
      return `<li style="font-size: 0.95rem; margin-bottom: 0.4rem; color: var(--ink-secondary);">${s}</li>`;
    }).join("");

    var pitfallHtml = topic.pitfalls ? topic.pitfalls.map(function(p) {
      return `<li style="font-size: 0.95rem; margin-bottom: 0.5rem; color: var(--ink-secondary);">${p}</li>`;
    }).join("") : "";

    var labSectionHtml = "";
    if (topic.interactiveLab) {
      labSectionHtml = `
        <section class="lesson-section">
          <h3 class="lesson-section-title">Interactive Concept Verification Lab</h3>
          <div class="interactive-lab-container">
            <div class="interactive-lab-header">
              <div class="badge badge-forest" style="margin-bottom: 0.5rem;">Live Simulation</div>
              <h4 class="lab-title">${topic.interactiveLab.title}</h4>
              <p class="lab-description">Test mathematical parameters directly to verify dynamic system behavior.</p>
            </div>
            <div id="interactive-lab-mount" class="lab-canvas-area"></div>
          </div>
        </section>
      `;
    }

    var quizHtml = this.buildQuizSectionHtml(topic);

    return `
      <!-- Breadcrumb -->
      <nav class="content-breadcrumb">
        <a href="#courses">Courses</a>
        <span>/</span>
        <a href="#course/${course.id}">${course.title}</a>
        <span>/</span>
        <span>${mod.title}</span>
      </nav>

      <!-- Content Header -->
      <header class="content-header">
        <h1 class="content-title">${topic.title}</h1>
        <div class="content-meta-row">
          <span>Estimated: ${topic.estimatedMinutes} minutes</span>
          <span>&bull;</span>
          <span>Course: ${course.code}</span>
          <span>&bull;</span>
          <button id="toggle-complete-btn" class="${isDone ? 'btn-secondary' : 'btn-primary'}" style="padding: 0.25rem 0.75rem; font-size: 0.78rem;">
            ${isDone ? 'Mark Incomplete' : 'Mark as Completed'}
          </button>
        </div>
      </header>

      <!-- Syllabus Subtopics -->
      <section class="lesson-section">
        <h3 class="lesson-section-title">Topic Syllabus & Learning Objectives</h3>
        <ul style="list-style: decimal inside; margin: 1rem 0;">
          ${subtopicsHtml}
        </ul>
      </section>

      <!-- Textbook Reading Chapters or Core Intuition -->
      ${this.buildTextbookContentHtml(topic)}

      <!-- Mathematics -->
      ${topic.mathematics ? `
        <section class="lesson-section">
          <h3 class="lesson-section-title">Mathematical Formulation and Derivation</h3>
          <div class="math-block">
            <div class="math-equation">${topic.mathematics.equation}</div>
            <p class="math-explanation">${topic.mathematics.explanation}</p>
          </div>
          ${topic.mathematics.variables ? `
            <div style="font-size: 0.88rem; color: var(--ink-secondary); margin-top: 0.75rem;">
              <strong>Variable Definitions:</strong>
              <ul style="margin: 0.5rem 0 0 1.25rem;">
                ${topic.mathematics.variables.map(function(v) { return `<li>${v}</li>`; }).join("")}
              </ul>
            </div>
          ` : ""}
        </section>
      ` : ""}

      <!-- Production Code -->
      ${topic.code ? `
        <section class="lesson-section">
          <h3 class="lesson-section-title">Production Implementation (${topic.code.filename})</h3>
          <div class="code-block-container">
            <div class="code-block-header">
              <span>Language: ${topic.code.language} | ${topic.code.filename}</span>
              <button class="copy-code-btn" id="copy-code-trigger">Copy Code</button>
            </div>
            <pre class="code-pre"><code>${this.escapeHtml(topic.code.snippet)}</code></pre>
          </div>
        </section>
      ` : ""}

      <!-- Pitfalls -->
      ${pitfallHtml ? `
        <section class="lesson-section">
          <h3 class="lesson-section-title">Common Engineering Pitfalls and Failure Modes</h3>
          <ul style="list-style: disc inside; margin: 0.75rem 0;">
            ${pitfallHtml}
          </ul>
        </section>
      ` : ""}

      <!-- Interactive Lab Mount -->
      ${labSectionHtml}

      <!-- Knowledge Verification Quiz -->
      ${quizHtml}

      <!-- Academic References & Literature Citations -->
      ${topic.citations && topic.citations.length > 0 ? `
        <section class="lesson-section">
          <div class="textbook-citation-block">
            <div class="textbook-citation-title">Key Academic Literature & Canonical References</div>
            ${topic.citations.map(function(c) {
              return `<div class="textbook-citation-item">&bull; ${c}</div>`;
            }).join("")}
          </div>
        </section>
      ` : ""}

      <!-- Navigation Footer -->
      <footer class="viewer-nav-footer" id="viewer-nav-footer">
        ${this.buildNavFooterHtml(course, topic.topicId)}
      </footer>
    `;
  },

  buildTextbookContentHtml: function(topic) {
    if (!topic.sections || topic.sections.length === 0) {
      return `
        <!-- Conceptual Foundations -->
        <section class="lesson-section">
          <h3 class="lesson-section-title">1. Conceptual Foundations and Mental Model</h3>
          <div class="textbook-prose">${this.formatProse(topic.intuition)}</div>
        </section>
      `;
    }

    var self = this;
    var html = "";
    for (var i = 0; i < topic.sections.length; i++) {
      var sec = topic.sections[i];
      html += `
        <section class="lesson-section">
          <h3 class="lesson-section-title">${sec.heading}</h3>
          <div class="textbook-prose">
            ${this.formatProse(sec.content)}
          </div>
      `;

      if (sec.callout) {
        html += `
          <div class="textbook-callout ${sec.callout.type || 'insight'}">
            <div class="textbook-callout-header">
              <span class="textbook-callout-title">${sec.callout.title}</span>
              <span class="textbook-callout-tag">${sec.callout.tag || 'Theoretical Principle'}</span>
            </div>
            <div class="textbook-callout-body">
              ${this.formatProse(sec.callout.text)}
            </div>
          </div>
        `;
      }

      if (sec.equations && sec.equations.length > 0) {
        for (var eqIdx = 0; eqIdx < sec.equations.length; eqIdx++) {
          var eq = sec.equations[eqIdx];
          html += `
            <div class="math-block">
              ${eq.label ? `<div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom: 0.35rem;"><strong style="font-size:0.82rem; color:var(--ink-muted); text-transform:uppercase;">${eq.label}</strong><span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--ink-muted);">(Eq. ${i + 1}.${eqIdx + 1})</span></div>` : ""}
              <div class="math-equation">${eq.equation}</div>
              <p class="math-explanation">${eq.explanation}</p>
            </div>
          `;
        }
      }

      if (sec.code) {
        html += `
          <div class="code-block-container">
            <div class="code-block-header">
              <span>Language: ${sec.code.language} | ${sec.code.filename}</span>
              <button class="copy-code-btn">Copy Code</button>
            </div>
            <pre class="code-pre"><code>${self.escapeHtml(sec.code.snippet)}</code></pre>
          </div>
        `;
      }

      html += `</section>`;
    }
    return html;
  },

  formatProse: function(text) {
    if (!text) return "";
    if (Array.isArray(text)) {
      return text.map(function(p) { return `<p>${p}</p>`; }).join("");
    }
    var parts = text.split(/\n\s*\n/);
    return parts.map(function(p) {
      var trimmed = p.trim();
      return trimmed ? `<p>${trimmed}</p>` : "";
    }).join("");
  },


  buildQuizSectionHtml: function(topic) {
    if (!topic.quiz || topic.quiz.length === 0) return "";
    var q = topic.quiz[0];
    var optionsHtml = q.options.map(function(opt, idx) {
      return `
        <label class="quiz-option-label" data-opt-idx="${idx}">
          <input type="radio" name="lesson_quiz_option" value="${idx}" style="margin-top: 3px;">
          <span>${opt}</span>
        </label>
      `;
    }).join("");

    return `
      <section class="lesson-section">
        <h3 class="lesson-section-title">5. Diagnostic Knowledge Verification</h3>
        <div class="quiz-container" id="quiz-block">
          <div class="quiz-header">
            <div class="badge badge-slate" style="margin-bottom: 0.5rem;">Concept Verification</div>
            <div class="quiz-question-text">${q.question}</div>
          </div>
          <div class="quiz-options-list" id="quiz-options-list">
            ${optionsHtml}
          </div>
          <button id="submit-quiz-btn" class="btn-primary" style="font-size: 0.85rem;">Submit Answer</button>
          <div id="quiz-feedback" class="quiz-feedback-box hidden"></div>
        </div>
      </section>
    `;
  },

  buildNavFooterHtml: function(course, currentTopicId) {
    // Find flattened list of all topics in order
    var flat = [];
    for (var m = 0; m < course.modules.length; m++) {
      for (var t = 0; t < course.modules[m].topics.length; t++) {
        flat.push(course.modules[m].topics[t]);
      }
    }

    var currentIndex = -1;
    for (var i = 0; i < flat.length; i++) {
      if (flat[i].topicId === currentTopicId) {
        currentIndex = i;
        break;
      }
    }

    var prevTopic = currentIndex > 0 ? flat[currentIndex - 1] : null;
    var nextTopic = currentIndex < flat.length - 1 ? flat[currentIndex + 1] : null;

    var html = "";
    if (prevTopic) {
      html += `
        <button class="btn-secondary viewer-nav-btn" data-target-topic="${prevTopic.topicId}">
          <span class="viewer-nav-sub">Previous Topic</span>
          <span class="viewer-nav-label">&larr; ${prevTopic.title}</span>
        </button>
      `;
    } else {
      html += `<div></div>`;
    }

    if (nextTopic) {
      html += `
        <button class="btn-primary viewer-nav-btn next" data-target-topic="${nextTopic.topicId}">
          <span class="viewer-nav-sub">Next Topic</span>
          <span class="viewer-nav-label">${nextTopic.title} &rarr;</span>
        </button>
      `;
    } else {
      html += `
        <a href="#courses" class="btn-primary viewer-nav-btn next">
          <span class="viewer-nav-sub">Course Completed</span>
          <span class="viewer-nav-label">Return to Catalog &rarr;</span>
        </a>
      `;
    }
    return html;
  },

  attachViewerHandlers: function(container, course, topicMeta) {
    var self = this;
    var topic = topicMeta.topic;

    // Sidebar topic clicks
    var sidebarItems = container.querySelectorAll(".topic-nav-item");
    sidebarItems.forEach(function(item) {
      item.onclick = function() {
        var tid = item.getAttribute("data-topic-id");
        window.location.hash = "#learn/" + course.id + "/" + tid;
      };
    });

    // Prev / Next button clicks
    var navBtns = container.querySelectorAll(".viewer-nav-btn[data-target-topic]");
    navBtns.forEach(function(btn) {
      btn.onclick = function() {
        var tid = btn.getAttribute("data-target-topic");
        window.location.hash = "#learn/" + course.id + "/" + tid;
      };
    });

    // Toggle complete button
    var completeBtn = container.querySelector("#toggle-complete-btn");
    if (completeBtn) {
      completeBtn.onclick = function() {
        var isNowDone = window.STARVYONStore.toggleTopicCompleted(course.id, topic.topicId);
        completeBtn.innerText = isNowDone ? "Mark Incomplete" : "Mark as Completed";
        completeBtn.className = isNowDone ? "btn-secondary" : "btn-primary";
        
        // Refresh sidebar progress
        var p = window.STARVYONStore.getCourseProgress(course.id);
        var pctText = container.querySelector("#sidebar-progress-pct");
        var fill = container.querySelector("#sidebar-progress-fill");
        if (pctText) pctText.innerText = p.percentage + "%";
        if (fill) fill.style.width = p.percentage + "%";

        // Update markers in sidebar
        var marker = container.querySelector(".topic-nav-item.active .topic-status-marker");
        if (marker) {
          marker.innerText = isNowDone ? "[Completed]" : "";
          if (isNowDone) marker.classList.add("completed");
          else marker.classList.remove("completed");
        }
      };
    }

    // Copy code button
    var copyBtn = container.querySelector("#copy-code-trigger");
    if (copyBtn) {
      copyBtn.onclick = function() {
        navigator.clipboard.writeText(topic.code.snippet).then(function() {
          copyBtn.innerText = "Copied";
          setTimeout(function() { copyBtn.innerText = "Copy Code"; }, 2000);
        });
      };
    }

    // Quiz submission
    var submitQuizBtn = container.querySelector("#submit-quiz-btn");
    if (submitQuizBtn && topic.quiz && topic.quiz.length > 0) {
      var quizData = topic.quiz[0];
      submitQuizBtn.onclick = function() {
        var selected = container.querySelector("input[name='lesson_quiz_option']:checked");
        var feedback = container.querySelector("#quiz-feedback");
        if (!selected) {
          alert("Please select an answer option.");
          return;
        }

        var chosenIdx = parseInt(selected.value, 10);
        var isCorrect = chosenIdx === quizData.correctIndex;

        // Visual highlight on options
        var optionLabels = container.querySelectorAll(".quiz-option-label");
        optionLabels.forEach(function(lbl, idx) {
          lbl.classList.remove("correct", "incorrect");
          if (idx === quizData.correctIndex) {
            lbl.classList.add("correct");
          } else if (idx === chosenIdx && !isCorrect) {
            lbl.classList.add("incorrect");
          }
        });

        feedback.classList.remove("hidden");
        if (isCorrect) {
          feedback.innerHTML = `<strong style="color: var(--accent-forest);">Correct.</strong> ${quizData.explanation}`;
          window.STARVYONStore.recordQuizScore(course.id, topic.topicId, 1, 1);
          window.STARVYONStore.markTopicCompleted(course.id, topic.topicId);
          // Update button state
          if (completeBtn) {
            completeBtn.innerText = "Mark Incomplete";
            completeBtn.className = "btn-secondary";
          }
        } else {
          feedback.innerHTML = `<strong style="color: var(--accent-terracotta);">Incorrect.</strong> ${quizData.explanation}`;
          window.STARVYONStore.recordQuizScore(course.id, topic.topicId, 0, 1);
        }
      };
    }
  },

  escapeHtml: function(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
};
