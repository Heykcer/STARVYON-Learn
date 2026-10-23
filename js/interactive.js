// STARVYON Learn - Interactive Concept Labs
// Self-contained mathematical and algorithmic visualizers (No external frameworks, no canvas blobs).

window.STARVYONInteractive = {
  renderLab: function(containerElement, labConfig) {
    if (!containerElement || !labConfig) return;
    containerElement.innerHTML = "";

    switch (labConfig.type) {
      case "astar_grid":
        this.renderAStarGrid(containerElement);
        break;
      case "decision_boundary":
        this.renderDecisionBoundary(containerElement);
        break;
      case "neural_forward":
        this.renderNeuralForward(containerElement);
        break;
      case "rag_pipeline":
        this.renderRagPipeline(containerElement);
        break;
      case "agent_mcp_trace":
        this.renderAgentMcpTrace(containerElement);
        break;
      default:
        containerElement.innerHTML = "<p style='color: var(--ink-muted); font-size: 0.9rem;'>Interactive module ready for parameter inspection.</p>";
    }
  },

  // 1. A* Search Grid Simulator
  renderAStarGrid: function(container) {
    var rows = 8;
    var cols = 12;
    var start = [1, 1];
    var goal = [6, 10];
    var walls = { "2,3": true, "3,3": true, "4,3": true, "5,3": true, "4,6": true, "4,7": true, "4,8": true };

    var html = `
      <div style="width: 100%; display: flex; flex-direction: column; gap: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; font-family: var(--font-mono);">
          <span>Click grid cells to place or remove walls.</span>
          <div style="display: flex; gap: 0.5rem;">
            <button id="astar-run-btn" class="btn-primary" style="padding: 0.35rem 0.85rem; font-size: 0.8rem;">Execute A* Search</button>
            <button id="astar-reset-btn" class="btn-secondary" style="padding: 0.35rem 0.85rem; font-size: 0.8rem;">Clear Obstacles</button>
          </div>
        </div>
        <div id="astar-grid-canvas" style="display: grid; grid-template-columns: repeat(${cols}, 1fr); gap: 2px; background: var(--border-hairline); border: 1px solid var(--border-strong); padding: 2px;"></div>
        <div id="astar-status-bar" style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--ink-muted); padding: 0.5rem 0;">Status: Ready for pathfinding.</div>
      </div>
    `;
    container.innerHTML = html;

    var gridCanvas = container.querySelector("#astar-grid-canvas");
    var statusBar = container.querySelector("#astar-status-bar");
    var runBtn = container.querySelector("#astar-run-btn");
    var resetBtn = container.querySelector("#astar-reset-btn");

    function drawGrid(pathNodes, visitedNodes) {
      gridCanvas.innerHTML = "";
      pathNodes = pathNodes || {};
      visitedNodes = visitedNodes || {};

      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
          var key = r + "," + c;
          var cell = document.createElement("div");
          cell.style.height = "32px";
          cell.style.display = "flex";
          cell.style.alignItems = "center";
          cell.style.justifyContent = "center";
          cell.style.fontSize = "0.75rem";
          cell.style.fontFamily = "var(--font-mono)";
          cell.style.cursor = "pointer";

          if (r === start[0] && c === start[1]) {
            cell.style.background = "#203248";
            cell.style.color = "#fbfaf6";
            cell.innerText = "S";
          } else if (r === goal[0] && c === goal[1]) {
            cell.style.background = "#1e3526";
            cell.style.color = "#fbfaf6";
            cell.innerText = "G";
          } else if (walls[key]) {
            cell.style.background = "#2d2d29";
          } else if (pathNodes[key]) {
            cell.style.background = "#c9dbcd";
            cell.style.color = "#1e3526";
            cell.innerText = "*";
          } else if (visitedNodes[key]) {
            cell.style.background = "#eeece2";
          } else {
            cell.style.background = "#fbfaf6";
          }

          (function(cellR, cellC, cellKey) {
            cell.onclick = function() {
              if ((cellR === start[0] && cellC === start[1]) || (cellR === goal[0] && cellC === goal[1])) return;
              if (walls[cellKey]) delete walls[cellKey];
              else walls[cellKey] = true;
              drawGrid();
            };
          })(r, c, key);

          gridCanvas.appendChild(cell);
        }
      }
    }

    function runAStar() {
      // Priority queue heuristic search
      var startKey = start[0] + "," + start[1];
      var goalKey = goal[0] + "," + goal[1];
      var openSet = [{ pos: start, g: 0, f: Math.abs(start[0]-goal[0]) + Math.abs(start[1]-goal[1]) }];
      var cameFrom = {};
      var gScore = {};
      gScore[startKey] = 0;
      var visited = {};

      while (openSet.length > 0) {
        // Sort by f
        openSet.sort(function(a, b) { return a.f - b.f; });
        var current = openSet.shift();
        var curKey = current.pos[0] + "," + current.pos[1];
        visited[curKey] = true;

        if (current.pos[0] === goal[0] && current.pos[1] === goal[1]) {
          // Reconstruct path
          var path = {};
          var currBack = curKey;
          var steps = 0;
          while (cameFrom[currBack]) {
            path[currBack] = true;
            currBack = cameFrom[currBack];
            steps++;
          }
          drawGrid(path, visited);
          statusBar.innerText = "Optimal path found in " + steps + " steps. Visited nodes: " + Object.keys(visited).length;
          return;
        }

        var neighbors = [
          [current.pos[0] + 1, current.pos[1]],
          [current.pos[0] - 1, current.pos[1]],
          [current.pos[0], current.pos[1] + 1],
          [current.pos[0], current.pos[1] - 1]
        ];

        for (var i = 0; i < neighbors.length; i++) {
          var nr = neighbors[i][0];
          var nc = neighbors[i][1];
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
          var nKey = nr + "," + nc;
          if (walls[nKey]) continue;

          var tentativeG = gScore[curKey] + 1;
          if (gScore[nKey] === undefined || tentativeG < gScore[nKey]) {
            cameFrom[nKey] = curKey;
            gScore[nKey] = tentativeG;
            var h = Math.abs(nr - goal[0]) + Math.abs(nc - goal[1]); // Manhattan heuristic
            var f = tentativeG + h;
            openSet.push({ pos: [nr, nc], g: tentativeG, f: f });
          }
        }
      }
      statusBar.innerText = "Search exhausted. No valid path exists around obstacles.";
      drawGrid({}, visited);
    }

    runBtn.onclick = runAStar;
    resetBtn.onclick = function() {
      walls = {};
      drawGrid();
      statusBar.innerText = "Grid cleared.";
    };

    drawGrid();
  },

  // 2. Decision Boundary & Regularization Simulator
  renderDecisionBoundary: function(container) {
    container.innerHTML = `
      <div style="width: 100%; display: flex; flex-direction: column; gap: 1rem;">
        <div style="display: flex; gap: 1.5rem; align-items: center; flex-wrap: wrap;">
          <label style="font-family: var(--font-mono); font-size: 0.8rem;">
            Polynomial Degree: <strong id="poly-val">2</strong>
            <input type="range" id="poly-slider" min="1" max="5" value="2" style="margin-left: 0.5rem; vertical-align: middle;">
          </label>
          <label style="font-family: var(--font-mono); font-size: 0.8rem;">
            L2 Penalty (Lambda): <strong id="lambda-val">0.05</strong>
            <input type="range" id="lambda-slider" min="0" max="100" value="5" style="margin-left: 0.5rem; vertical-align: middle;">
          </label>
        </div>
        <div id="decision-canvas" style="border: 1px solid var(--border-hairline); background: var(--bg-canvas); padding: 1.5rem; font-family: var(--font-mono); font-size: 0.82rem;">
          <div style="margin-bottom: 0.5rem;">Estimated Variance: <span id="boundary-var" style="color: var(--accent-terracotta);">Moderate</span> | Estimated Bias: <span id="boundary-bias" style="color: var(--accent-forest);">Low</span></div>
          <div style="margin-bottom: 0.5rem;">Regularization State: <span id="reg-status">Sufficiently constrained</span></div>
          <div style="height: 120px; display: flex; align-items: flex-end; gap: 8px; border-bottom: 1px solid var(--border-strong); padding-bottom: 4px;" id="poly-bars">
          </div>
        </div>
      </div>
    `;

    var polySlider = container.querySelector("#poly-slider");
    var lambdaSlider = container.querySelector("#lambda-slider");
    var polyVal = container.querySelector("#poly-val");
    var lambdaVal = container.querySelector("#lambda-val");
    var varSpan = container.querySelector("#boundary-var");
    var biasSpan = container.querySelector("#boundary-bias");
    var regSpan = container.querySelector("#reg-status");
    var barsContainer = container.querySelector("#poly-bars");

    function update() {
      var degree = parseInt(polySlider.value, 10);
      var lambda = parseInt(lambdaSlider.value, 10) / 100;
      polyVal.innerText = degree;
      lambdaVal.innerText = lambda.toFixed(2);

      if (degree >= 4 && lambda < 0.05) {
        varSpan.innerText = "High (Overfitting Risk)";
        biasSpan.innerText = "Extremely Low";
        regSpan.innerText = "Warning: High polynomial degree without shrinkage fits dataset noise.";
      } else if (degree === 1 && lambda > 0.5) {
        varSpan.innerText = "Near Zero";
        biasSpan.innerText = "Severe (Underfitting)";
        regSpan.innerText = "Model is too rigid to capture non-linear patterns.";
      } else {
        varSpan.innerText = "Balanced";
        biasSpan.innerText = "Low";
        regSpan.innerText = "Optimal compromise on bias-variance frontier.";
      }

      barsContainer.innerHTML = "";
      for (var d = 1; d <= 6; d++) {
        var barHeight = Math.max(8, (d <= degree ? (100 / d) * (1 / (1 + lambda * 2)) : 4));
        var bar = document.createElement("div");
        bar.style.width = "40px";
        bar.style.height = barHeight + "px";
        bar.style.background = d <= degree ? "var(--accent-forest)" : "var(--bg-inset)";
        bar.style.border = "1px solid var(--border-hairline)";
        bar.title = "Degree " + d + " Coefficient Weight";
        barsContainer.appendChild(bar);
      }
    }

    polySlider.oninput = update;
    lambdaSlider.oninput = update;
    update();
  },

  // 3. Neural Network Forward Signal Simulator
  renderNeuralForward: function(container) {
    container.innerHTML = `
      <div style="width: 100%; display: flex; flex-direction: column; gap: 1rem;">
        <div style="display: flex; gap: 1.5rem; align-items: center; flex-wrap: wrap; font-size: 0.85rem; font-family: var(--font-mono);">
          <label>Input x1: <input type="number" id="nn-x1" value="1.5" step="0.5" style="width: 60px; padding: 2px 4px;"></label>
          <label>Input x2: <input type="number" id="nn-x2" value="-0.8" step="0.5" style="width: 60px; padding: 2px 4px;"></label>
          <label>Activation: 
            <select id="nn-act" style="padding: 2px 4px;">
              <option value="relu">ReLU</option>
              <option value="sigmoid">Sigmoid</option>
              <option value="gelu">GELU</option>
            </select>
          </label>
        </div>
        <div style="border: 1px solid var(--border-strong); background: var(--bg-canvas); padding: 1.5rem; display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; text-align: center; font-family: var(--font-mono); font-size: 0.82rem;">
          <div style="border: 1px solid var(--border-hairline); background: var(--bg-surface); padding: 1rem;">
            <strong>Layer 0 (Input)</strong>
            <div id="nn-l0" style="margin-top: 0.5rem;">[1.50, -0.80]</div>
          </div>
          <div style="border: 1px solid var(--border-hairline); background: var(--bg-surface); padding: 1rem;">
            <strong>Layer 1 (Hidden)</strong>
            <div id="nn-l1" style="margin-top: 0.5rem;">Calculating...</div>
          </div>
          <div style="border: 1px solid var(--border-hairline); background: var(--bg-surface); padding: 1rem;">
            <strong>Layer 2 (Output Logits)</strong>
            <div id="nn-l2" style="margin-top: 0.5rem;">Calculating...</div>
          </div>
        </div>
      </div>
    `;

    var x1Input = container.querySelector("#nn-x1");
    var x2Input = container.querySelector("#nn-x2");
    var actSelect = container.querySelector("#nn-act");
    var l0Box = container.querySelector("#nn-l0");
    var l1Box = container.querySelector("#nn-l1");
    var l2Box = container.querySelector("#nn-l2");

    function activate(val, type) {
      if (type === "relu") return Math.max(0, val);
      if (type === "sigmoid") return 1 / (1 + Math.exp(-val));
      if (type === "gelu") return 0.5 * val * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (val + 0.044715 * Math.pow(val, 3))));
      return val;
    }

    function calculate() {
      var x1 = parseFloat(x1Input.value) || 0;
      var x2 = parseFloat(x2Input.value) || 0;
      var act = actSelect.value;
      l0Box.innerText = "[" + x1.toFixed(2) + ", " + x2.toFixed(2) + "]";

      // Fixed weights for demonstration
      var w1 = [[0.8, -0.5], [1.2, 0.4]];
      var b1 = [0.1, -0.2];
      var h1_pre = x1 * w1[0][0] + x2 * w1[0][1] + b1[0];
      var h2_pre = x1 * w1[1][0] + x2 * w1[1][1] + b1[1];
      var h1 = activate(h1_pre, act);
      var h2 = activate(h2_pre, act);
      l1Box.innerText = "[" + h1.toFixed(2) + ", " + h2.toFixed(2) + "]";

      var w2 = [0.9, -1.1];
      var out_logit = h1 * w2[0] + h2 * w2[1] + 0.05;
      l2Box.innerText = "y = " + out_logit.toFixed(3);
    }

    x1Input.oninput = calculate;
    x2Input.oninput = calculate;
    actSelect.onchange = calculate;
    calculate();
  },

  // 4. Step-by-Step RAG Pipeline Flow
  renderRagPipeline: function(container) {
    container.innerHTML = `
      <div style="width: 100%; display: flex; flex-direction: column; gap: 1rem; font-family: var(--font-mono); font-size: 0.85rem;">
        <div style="display: flex; gap: 0.5rem;">
          <input type="text" id="rag-query-input" value="What is the learning rate decay policy in AdamW?" style="flex: 1; padding: 0.45rem 0.75rem; border: 1px solid var(--border-strong); background: var(--bg-canvas); font-family: var(--font-mono);">
          <button id="rag-exec-btn" class="btn-primary" style="font-size: 0.8rem;">Run Pipeline</button>
        </div>
        <div id="rag-trace-box" style="border: 1px solid var(--border-hairline); background: var(--bg-surface); padding: 1rem; display: flex; flex-direction: column; gap: 0.75rem;">
          <div>1. Query Embedding: Generated 1024-dim dense representation via BGE-Large.</div>
          <div>2. Candidate Search: Retrieved top-25 chunks using HNSW vector index (cosine sim).</div>
          <div>3. Cross-Encoder Re-rank: Re-scored top 5 chunks with ms-marco Cross-Encoder.</div>
          <div style="padding: 0.5rem; background: var(--bg-canvas); border: 1px solid var(--border-hairline);">
            <strong>Top Chunk Selected:</strong> "AdamW decouples weight decay lambda from the first/second moment calculations..." (Score: 0.942)
          </div>
          <div>4. Context Injection: Augmented system prompt assembled with token count: 488 tokens.</div>
        </div>
      </div>
    `;

    var queryInput = container.querySelector("#rag-query-input");
    var execBtn = container.querySelector("#rag-exec-btn");
    var traceBox = container.querySelector("#rag-trace-box");

    execBtn.onclick = function() {
      var q = queryInput.value.trim() || "Sample query";
      traceBox.innerHTML = `
        <div>1. Query Embedding: Dense vector encoded for "${q.substring(0, 35)}..."</div>
        <div>2. Vector ANN Index: Scanned 120,000 vector chunks in 1.4ms.</div>
        <div>3. Re-Ranker: Cross-encoder evaluated 25 candidate passages.</div>
        <div style="padding: 0.5rem; background: var(--bg-canvas); border: 1px solid var(--border-hairline);">
          <strong>Top Chunk Selected:</strong> "Context snippet verified against corpus for: ${q}" (Confidence: 0.961)
        </div>
        <div>4. Context Injected: Final generation prompt dispatched to model inference endpoint.</div>
      `;
    };
  },

  // 5. ReAct & Model Context Protocol (MCP) Trace
  renderAgentMcpTrace: function(container) {
    container.innerHTML = `
      <div style="width: 100%; display: flex; flex-direction: column; gap: 0.75rem; font-family: var(--font-mono); font-size: 0.82rem;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>Target Goal: "Query server latency metrics and generate alert summary"</span>
          <button id="agent-step-btn" class="btn-primary" style="padding: 0.25rem 0.75rem; font-size: 0.75rem;">Advance Step (1/4)</button>
        </div>
        <div id="mcp-trace-log" style="border: 1px solid var(--border-strong); background: var(--bg-code); padding: 1.25rem; display: flex; flex-direction: column; gap: 0.65rem; min-height: 180px;">
          <div style="color: var(--ink-muted);">[STEP 0: Initialized] Agent loaded with MCP Server 'metrics_server' via stdio transport.</div>
        </div>
      </div>
    `;

    var stepBtn = container.querySelector("#agent-step-btn");
    var traceLog = container.querySelector("#mcp-trace-log");
    var currentStep = 0;

    var steps = [
      {
        title: "STEP 1: Reason & Plan",
        content: "THOUGHT: I need to query the current server latency metric from the metrics MCP server to evaluate if it exceeds the 200ms threshold."
      },
      {
        title: "STEP 2: MCP Tool Invocation (Act)",
        content: `CALL: JSON-RPC 2.0 -> tools/call\n{\n  "name": "get_service_latency",\n  "arguments": { "service": "api-gateway", "window_minutes": 15 }\n}`
      },
      {
        title: "STEP 3: Tool Observation (Observe)",
        content: `OBSERVATION from 'metrics_server':\n{\n  "p50_latency_ms": 42.1,\n  "p99_latency_ms": 284.6,\n  "anomaly_flag": true\n}`
      },
      {
        title: "STEP 4: Metacognitive Reflection & Final Output",
        content: "REFLECTION: The p99 latency (284.6ms) exceeds the target threshold of 200ms. I have sufficient verified data.\nFINAL OUTPUT: Alert dispatched. P99 latency is elevated at 284.6ms over the last 15 minutes."
      }
    ];

    stepBtn.onclick = function() {
      if (currentStep < steps.length) {
        var s = steps[currentStep];
        var entry = document.createElement("div");
        entry.style.borderLeft = "2px solid var(--ink-primary)";
        entry.style.paddingLeft = "0.75rem";
        entry.style.marginBottom = "0.5rem";
        entry.innerHTML = "<strong>" + s.title + "</strong><pre style='margin-top: 4px; white-space: pre-wrap; font-family: var(--font-mono); color: var(--ink-secondary);'>" + s.content + "</pre>";
        traceLog.appendChild(entry);
        currentStep++;
        if (currentStep < steps.length) {
          stepBtn.innerText = "Advance Step (" + (currentStep + 1) + "/4)";
        } else {
          stepBtn.innerText = "Trace Completed (Reset)";
        }
      } else {
        currentStep = 0;
        traceLog.innerHTML = "<div style='color: var(--ink-muted);'>[STEP 0: Initialized] Agent loaded with MCP Server 'metrics_server' via stdio transport.</div>";
        stepBtn.innerText = "Advance Step (1/4)";
      }
    };
  }
};
