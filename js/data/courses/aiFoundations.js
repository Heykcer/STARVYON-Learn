// STARVYON Learn - Course Data: Artificial Intelligence Foundations (AI-101)
// Complete Textbook Edition: Exhaustive academic chapters, multi-section theoretical prose, formal proofs, callouts, and canonical literature citations.

window.STARVYONCourses = window.STARVYONCourses || {};

window.STARVYONCourses["ai-foundations"] = {
  id: "ai-foundations",
  title: "Artificial Intelligence Foundations",
  code: "AI-101",
  category: "Artificial Intelligence",
  pathwayId: "path-ai-engineering",
  estimatedHours: 36,
  level: "Foundational to Intermediate",
  summary: "Comprehensive 10-chapter academic textbook covering rational agency, state-space search calculus, heuristic optimization, game theory, CSP arc consistency, propositional and first-order logic, automated planning, Bayesian networks, and Markov Decision Processes.",
  description: "This course serves as an exhaustive, university-grade textbook establishing the foundational mathematics, computational complexity, and symbolic architectures of artificial intelligence. Students study 10 complete chapters: formalizing the PEAS rational agency framework; calculating time and memory bounds across uninformed state-space exploration (BFS/DFS/UCS); proving the global optimality and monotonicity of the A* heuristic search algorithm; deriving the Minimax theorem with alpha-beta branch pruning; proving AC-3 constraint propagation bounds; converting logical sentences to Conjunctive Normal Form for refutation resolution; implementing the First-Order Logic unification algorithm; formulating STRIPS planning tasks in PDDL; proving d-separation independence in Bayesian Belief Networks; and solving stochastic sequential decision problems via Bellman dynamic programming.",
  prerequisites: ["Discrete Mathematics", "Data Structures & Algorithms", "Basic Python"],
  modules: [
    {
      moduleId: "ai-mod-1",
      title: "Module 1: Rational Agents and Problem Formulation",
      topics: [
        {
          topicId: "ai-1-1",
          title: "The PEAS Framework and Agent Typology",
          estimatedMinutes: 60,
          subtopics: [
            "Formal definition of rational agency vs. human-like thought and behavioral emulation",
            "The PEAS specification: Performance Measure, Environment, Actuators, and Sensors",
            "Mathematical taxonomy of environments: Observability, Determinism, Episodic nature, Dynamism, Discreteness, and Agency",
            "Four agent architectural tiers: Simple Reflex, Model-Based Reflex, Goal-Based, and Utility-Based Agents",
            "The Learning Element architecture: Critic, Learning Element, Performance Element, and Problem Generator"
          ],
          sections: [
            {
              heading: "1.1 Rationality vs. Omniscience: The Foundational Definition",
              content: [
                "Historically, artificial intelligence has oscillated between two distinct objectives: emulating human behavior (the cognitive modeling and Turing test approach) and acting rationally (the laws of thought and rational agent approach). Russell & Norvig formalized modern AI around the rational agent paradigm: an agent is simply an entity that perceives its environment through sensors and acts upon that environment via actuators.",
                "Crucially, rationality must not be confused with omniscience, clairvoyance, or perfection. An omniscient agent knows the actual outcome of its actions and can act accordingly; but omniscience is physically impossible in real-world stochastic environments. Rationality maximizes expected performance, given the percept sequence accumulated up to the current instant and built-in prior knowledge. A rational agent makes the optimal choice given existing information, even if unexpected events later produce an unfavorable outcome."
              ],
              callout: {
                type: "definition",
                title: "Mathematical Formalization of the Rational Agent Function",
                tag: "Core Definition",
                text: "Let P be the set of all individual percepts, and P* be the set of all historical sequences of percepts. An agent is mathematically described by an agent function f: P* -> A mapping historical sequences to actions A. An optimal rational agent selects action a* = argmax_{a in A} E[ U(s') | a, P* ], maximizing the expected utility U of successor states s' given observation history P*."
              }
            },
            {
              heading: "1.2 The PEAS Environmental Specification",
              content: [
                "In engineering an intelligent system, the first task is always to specify the operational environment as thoroughly as possible using the PEAS framework: Performance Measure, Environment, Actuators, and Sensors.",
                "The Performance Measure defines the objective criterion of success. A fundamental engineering principle is that the performance measure must be defined in terms of desired external real-world states, not in terms of the agent's internal subjective feelings or reward counters. If an agent's performance measure is rewarded purely for cleaning dirt, it can achieve infinite reward by repeatedly dumping dirt on the floor and vacuuming it up.",
                "The Actuators and Sensors define the physical or virtual boundary interfaces between the agent and reality. Sensors translate environmental energy (photons, acoustic pressure, network packets) into internal data structures, while actuators execute state mutations."
              ]
            },
            {
              heading: "1.3 Environmental Taxonomies and Agent Architectural Tiers",
              content: [
                "The complexity of an agent's internal design is largely dictated by the dimensions of the environment in which it operates. Environments are classified across six fundamental orthogonal axes: Fully vs. Partially Observable (whether sensors detect the complete world state), Deterministic vs. Stochastic (whether the next state is completely determined by current state and action), Episodic vs. Sequential (whether current decisions affect future episodes), Static vs. Dynamic (whether the world changes while the agent deliberates), Discrete vs. Continuous (state and action granularity), and Single-agent vs. Multi-agent.",
                "These dimensions dictate the minimum required internal agent architecture. A Simple Reflex Agent operates purely via condition-action rules without memory; it succeeds only in fully observable domains. In partially observable domains, the agent requires a Model-Based Reflex architecture with internal state tracking to maintain beliefs about unobserved features. Goal-Based Agents introduce deliberative search to plan trajectories toward objectives, while Utility-Based Agents quantify trade-offs among conflicting goals under risk."
              ]
            }
          ],
          mathematics: {
            equation: "f: \\mathcal{P}^* \\to \\mathcal{A}, \\quad a^* = \\arg\\max_{a \\in \\mathcal{A}} \\sum_{s'} P(s' \\mid s, a) \\mathcal{U}(s')",
            explanation: "The agent function f maps the complete history of percepts P* to an action in A. The rational choice maximizes expected utility across transition probabilities P(s' | s, a).",
            variables: [
              "\\mathcal{P}^*: Sequence of all sensor percepts accumulated from step 0 to step t",
              "\\mathcal{A}: Discrete or continuous action space available to agent actuators",
              "\\mathcal{U}(s'): Objective mathematical utility assigned to environmental outcome s'"
            ]
          },
          code: {
            language: "python",
            filename: "peas_agent_taxonomy.py",
            snippet: `class Environment:\n    """Simulated partially observable, discrete, dynamic environment."""\n    def __init__(self):\n        self.rooms = {'A': 'Dirty', 'B': 'Dirty'}\n        self.agent_pos = 'A'\n        self.time_step = 0\n\n    def get_percept(self):\n        # Partial observability: agent only perceives its current room\n        return (self.agent_pos, self.rooms[self.agent_pos])\n\n    def step(self, action):\n        self.time_step += 1\n        if action == 'Suck':\n            self.rooms[self.agent_pos] = 'Clean'\n        elif action == 'Right':\n            self.agent_pos = 'B'\n        elif action == 'Left':\n            self.agent_pos = 'A'\n        return self.get_performance()\n\n    def get_performance(self):\n        # Objective external performance measure: +10 per clean room\n        clean_count = sum(1 for status in self.rooms.values() if status == 'Clean')\n        return clean_count * 10 - self.time_step\n\nclass ModelBasedReflexAgent:\n    """Maintains internal belief state over unobserved world coordinates."""\n    def __init__(self):\n        self.world_model = {'A': 'Unknown', 'B': 'Unknown'}\n        self.last_action = None\n\n    def decide(self, percept):\n        pos, status = percept\n        self.world_model[pos] = status  # Update internal model\n\n        if status == 'Dirty':\n            self.last_action = 'Suck'\n            return 'Suck'\n        elif pos == 'A' and self.world_model['B'] != 'Clean':\n            self.last_action = 'Right'\n            return 'Right'\n        elif pos == 'B' and self.world_model['A'] != 'Clean':\n            self.last_action = 'Left'\n            return 'Left'\n        return 'NoOp'`
          },
          pitfalls: [
            "Conflating rationality with omniscience: A rational decision is the mathematically optimal choice given available percept history, not hindsight evaluation.",
            "Designing internal reward loops inside agent code rather than evaluating objective environmental performance states."
          ],
          quiz: [
            {
              question: "Under the formal PEAS taxonomy, why can a Simple Reflex Agent never achieve optimal rational behavior in a partially observable environment?",
              options: [
                "It lacks floating point capabilities",
                "Because its decision rule is purely a function of the immediate percept f(p_t), it cannot distinguish between different world states that produce identical sensor readings (infinite perceptual aliasing loops)",
                "Simple reflex agents cannot execute actions"
              ],
              correctIndex: 1,
              explanation: "In a partially observable environment, identical sensor readings can correspond to vastly different world states. Without an internal model tracking history, a simple reflex agent cannot disambiguate states and will get trapped in loops."
            }
          ],
          citations: [
            "Russell, S., & Norvig, P. (2020). Artificial Intelligence: A Modern Approach (4th ed.). Pearson.",
            "Wooldridge, M. (2009). An Introduction to MultiAgent Systems (2nd ed.). John Wiley & Sons.",
            "Franklin, S., & Graesser, A. (1996). Is it an Agent, or just a Program?: A Taxonomy for Autonomous Agents. ECAI Proceedings."
          ]
        }
      ]
    },
    {
      moduleId: "ai-mod-2",
      title: "Module 2: Uninformed (Blind) State-Space Search",
      topics: [
        {
          topicId: "ai-2-1",
          title: "Breadth-First, Depth-First, and Uniform-Cost Search",
          estimatedMinutes: 60,
          subtopics: [
            "State space graph formalization: Initial state, Actions, Transition model, Goal test, and Path cost",
            "Measuring algorithmic complexity: Branching factor b, Shallowest goal depth d, and Maximum tree depth m",
            "Breadth-First Search (BFS): Completeness, optimality for uniform step costs, and exponential O(b^d) memory footprint",
            "Uniform-Cost Search (Dijkstra): Priority queue frontier ordering by cumulative path cost g(n)",
            "Depth-First Search (DFS): Linear memory efficiency O(bm) and vulnerability to infinite branches",
            "Iterative Deepening Search (IDS): Unifying BFS optimality with DFS O(bd) memory efficiency"
          ],
          sections: [
            {
              heading: "2.1 The Mathematical Formalism of Problem Solving by Search",
              content: [
                "When an agent cannot immediately map its percepts to an optimal action via closed-form rules, it must formulate a problem as a search through a state space. A formal search problem is defined by five mathematical components: (1) An Initial State s_0 in S; (2) An Action Function Actions(s) specifying legal moves in state s; (3) A Transition Model Result(s, a) defining the deterministic successor state resulting from action a in state s; (4) A Goal Test Predicate is_goal(s) determining if s satisfies the objective; and (5) A Step Cost Function c(s, a, s') >= 0 defining the positive physical expenditure of each action.",
                "A solution is a sequence of actions mapping initial state s_0 to a goal state. The path cost C(p) is the sum of step costs along the path. An optimal solution is a path achieving the absolute minimal path cost C*(s_0)."
              ]
            },
            {
              heading: "2.2 The Duality of Breadth-First and Depth-First Strategies",
              content: [
                "Uninformed search strategies explore state spaces using only the problem definition, without domain-specific heuristics estimating distance to the goal. Breadth-First Search (BFS) expands the shallowest unexpanded node first, implementing the frontier as a First-In-First-Out (FIFO) queue. BFS is complete (guaranteed to find a solution if one exists) and optimal when all step costs are equal. However, its memory consumption is catastrophic: BFS retains every generated node in memory, demanding O(b^d) space.",
                "Depth-First Search (DFS) expands the deepest unexpanded node first, implementing the frontier as a Last-In-First-Out (LIFO) stack. DFS has an extraordinary space efficiency: it requires storing only the current trajectory path from root to leaf and unexpanded sibling nodes, requiring linear memory O(bm), where m is the maximum depth of the state space. However, DFS is incomplete in infinite-depth spaces and frequently returns wildly suboptimal paths."
              ],
              callout: {
                type: "theorem",
                title: "Iterative Deepening Search (IDS) Optimality & Complexity",
                tag: "Asymptotic Proof",
                text: "Iterative Deepening Search (IDS) repeatedly executes depth-limited DFS with increasing depth limits l = 0, 1, 2, ..., d. IDS is complete and optimal like BFS, but requires only linear memory O(bd) like DFS! While it regenerates upper nodes, the overhead is negligible: in a tree with branching factor b = 10, the leaf nodes at depth d account for 90% of all nodes; repeating the upper 10% introduces an asymptotic overhead of only b / (b - 1), scaling with identical asymptotic time O(b^d)."
              }
            },
            {
              heading: "2.3 Uniform-Cost Search (Dijkstra) and Graph-Search visited Sets",
              content: [
                "When step costs vary, BFS is no longer optimal: it finds the path with the fewest steps, not the lowest cost. Uniform-Cost Search (UCS) orders the frontier priority queue by cumulative path cost g(n). UCS expands the node with the lowest g(n) value, guaranteeing that when a goal node is selected for expansion, the optimal path has been found.",
                "Crucially, the goal test in UCS must be applied when a node is selected for expansion, NOT when it is first generated! Applying the goal test upon generation can cause UCS to terminate prematurely with a suboptimal path that was discovered early along a high-cost route."
              ]
            }
          ],
          mathematics: {
            equation: "\\mathcal{C}(p) = \\sum_{i=1}^{k} c(s_{i-1}, a_i, s_i), \\quad \\text{Space}_{\\text{BFS}} = \\mathcal{O}(b^d), \\quad \\text{Space}_{\\text{DFS}} = \\mathcal{O}(bm), \\quad \\text{Space}_{\\text{IDS}} = \\mathcal{O}(bd)",
            explanation: "Path cost is the cumulative sum of non-negative step costs c. While BFS requires exponential space O(b^d), Iterative Deepening Search achieves identical BFS completeness in linear space O(bd).",
            variables: [
              "b: Branching factor (average number of successor nodes per expansion)",
              "d: Depth of the shallowest optimal goal state",
              "m: Maximum depth of any branch in the state space graph"
            ]
          },
          code: {
            language: "python",
            filename: "uniform_cost_search_engine.py",
            snippet: `import heapq\n\ndef uniform_cost_search(initial_state, is_goal_fn, get_successors_fn):\n    # Priority queue stores tuples: (cumulative_cost_g, unique_id, state, path)\n    frontier = []\n    heapq.heappush(frontier, (0.0, 0, initial_state, [initial_state]))\n    explored = set()\n    cost_so_far = {initial_state: 0.0}\n    counter = 0\n\n    while frontier:\n        cost_g, _, current_state, path = heapq.heappop(frontier)\n\n        # Goal test applied at EXPANSION time, strictly guaranteeing optimality\n        if is_goal_fn(current_state):\n            return path, cost_g\n\n        if current_state in explored:\n            continue\n        explored.add(current_state)\n\n        for next_state, step_cost in get_successors_fn(current_state):\n            new_cost = cost_g + step_cost\n            if next_state not in explored and (next_state not in cost_so_far or new_cost < cost_so_far[next_state]):\n                cost_so_far[next_state] = new_cost\n                counter += 1\n                heapq.heappush(frontier, (new_cost, counter, next_state, path + [next_state]))\n    return None, float('inf')`
          },
          pitfalls: [
            "Testing for goal completion upon node generation rather than upon expansion in Uniform-Cost Search: This prematurely halts the search before discovering cheaper, multi-step alternate routes.",
            "Omitting an explored set in cyclic graph domains, causing DFS and UCS to enter catastrophic infinite expansion loops."
          ],
          quiz: [
            {
              question: "Why is the goal test in Uniform-Cost Search (UCS) evaluated when a node is selected for expansion, rather than when it is first generated?",
              options: [
                "It reduces Python memory overhead",
                "A goal node may be generated early via a path with high cumulative cost g(n), but another cheaper path may still be sitting in the frontier with lower g(n) that has not yet reached the goal",
                "UCS cannot evaluate goal tests on leaf nodes"
              ],
              correctIndex: 1,
              explanation: "Because UCS expands nodes strictly in non-decreasing order of cost g(n), the first time a goal node is removed from the priority queue for expansion, its path is guaranteed to be optimal."
            }
          ],
          citations: [
            "Dijkstra, E. W. (1959). A note on two problems in connexion with graphs. Numerische Mathematik, 1(1), 269-271.",
            "Korf, R. E. (1985). Depth-first iterative-deepening: An optimal admissible tree search. Artificial Intelligence, 27(1), 97-109.",
            "Russell, S., & Norvig, P. (2020). Artificial Intelligence: A Modern Approach (Chapter 3). Pearson."
          ]
        }
      ]
    },
    {
      moduleId: "ai-mod-3",
      title: "Module 3: Informed Heuristic Search & The A* Algorithm",
      topics: [
        {
          topicId: "ai-3-1",
          title: "Heuristic Design, A* Optimality, and Consistency",
          estimatedMinutes: 60,
          subtopics: [
            "Heuristic evaluation functions h(n) estimating minimal cost to goal",
            "The A* evaluation metric: f(n) = g(n) + h(n)",
            "Heuristic admissibility condition: h(n) <= h*(n) (never overestimating true cost)",
            "Heuristic consistency (monotonicity): h(n) <= c(n, a, n') + h(n') and triangle inequality",
            "Proof of A* graph search optimality: Why consistent heuristics eliminate the need to reopen closed nodes",
            "Dominance of heuristics: How h2(n) >= h1(n) guarantees fewer or equal node expansions",
            "Memory-bounded search: Iterative Deepening A* (IDA*) and Recursive Best-First Search (RBFS)"
          ],
          sections: [
            {
              heading: "3.1 From Blind Expansion to Heuristic Directionality",
              content: [
                "Uniform-cost search expands nodes uniformly in concentric spheres of cost g(n) in all directions. In vast physical or combinatorial search spaces (such as 15-puzzles, robotics, or GPS pathfinding), blind spherical expansion is completely impractical. Informed search incorporates domain-specific knowledge via a heuristic function h(n), which estimates the cost of the cheapest path from node n to a goal state.",
                "Greedy Best-First Search prioritizes nodes strictly by h(n). While fast, greedy search is incomplete in cyclic graphs and frequently gets led astray by deceptive local minima, returning wildly suboptimal paths.",
                "The A* algorithm (Hart, Nilsson, & Raphael, 1968) solves this dilemma by evaluating nodes via the composite function f(n) = g(n) + h(n), where g(n) is the exact cost incurred to reach node n from the start, and h(n) is the estimated cost from n to the goal. Thus, f(n) estimates the total cost of the cheapest complete solution constrained to pass through node n."
              ]
            },
            {
              heading: "3.2 Admissibility, Consistency, and the Mathematical Proof of Optimality",
              content: [
                "An admissible heuristic is one that never overestimates the cost to reach the goal: for all nodes n, h(n) <= h*(n), where h*(n) is the true minimal cost to reach the nearest goal from n. Admissibility guarantees that A* tree search will return an optimal solution.",
                "In graph search, however, multiple paths can reach the identical state. To guarantee optimality in graph search without expensive reopening of closed nodes, the heuristic must satisfy a stricter condition: Consistency (Monotonicity). A heuristic is consistent if, for every node n and every successor n' generated by action a, h(n) <= c(n, a, n') + h(n'). This is simply the triangle inequality of Euclidean geometry.",
                "When h(n) is consistent, the f(n) values along any path are monotonically non-decreasing: f(n') = g(n') + h(n') = g(n) + c(n, a, n') + h(n') >= g(n) + h(n) = f(n). Consequently, when A* selects a node n for expansion, the optimal path to that state has already been found. A* never needs to revisit or reopen an expanded node!"
              ],
              callout: {
                type: "theorem",
                title: "Theorem of A* Optimality and Dominance",
                tag: "Formal Proof",
                text: "If heuristic h(n) is consistent, A* graph search is optimal and expands no nodes with f(n) > C*. Furthermore, among all optimal algorithms using the same heuristic, A* is optimally efficient: any algorithm that expands fewer nodes than A* risks missing the optimal solution. If h_2(n) >= h_1(n) for all n, h_2 dominates h_1 and A* using h_2 will expand fewer or equal nodes."
              }
            },
            {
              heading: "3.3 Designing Admissible Heuristics: The Relaxed Problem Paradigm",
              content: [
                "Where do good heuristics come from? The formal mathematical technique for constructing admissible heuristics is problem relaxation. By removing constraints from the original problem definition, actions become easier to execute, and the exact cost of the optimal solution in the relaxed problem becomes an admissible heuristic for the original problem.",
                "In the 8-puzzle: The rules state that a tile can slide from square A to square B if B is adjacent to A and B is blank. Relaxing rule 2 (ignoring the blank requirement) yields the Manhattan Distance heuristic: the sum of horizontal and vertical distances of tiles from their goal positions. Relaxing both rules yields the Misplaced Tiles heuristic. Because Manhattan distance dominates Misplaced Tiles (h_Manhattan >= h_Misplaced for all states), Manhattan distance expands far fewer search nodes."
              ]
            }
          ],
          mathematics: {
            equation: "f(n) = g(n) + h(n), \\quad h(n) \\le h^*(n), \\quad h(n) \\le c(n, a, n') + h(n')",
            explanation: "The A* evaluation metric balances cost incurred g(n) with estimated remaining cost h(n). Admissibility requires h(n) <= h*(n); consistency enforces triangle inequality monotonicity.",
            variables: [
              "g(n): Exact accumulated path cost from start state s_0 to node n",
              "h(n): Domain heuristic function estimating cost from node n to the nearest goal",
              "h^*(n): True minimal physical cost from node n to the goal",
              "c(n, a, n'): Step cost incurred executing action a from node n to successor n'"
            ]
          },
          code: {
            language: "python",
            filename: "astar_search_canonical.py",
            snippet: `import heapq\n\ndef astar_search(initial_state, is_goal_fn, get_neighbors_fn, heuristic_fn):\n    # Priority queue stores tuples: (f_score, g_score, unique_counter, state, path)\n    frontier = []\n    h0 = heuristic_fn(initial_state)\n    heapq.heappush(frontier, (h0, 0.0, 0, initial_state, [initial_state]))\n    \n    # Best known cost to reach state\n    g_costs = {initial_state: 0.0}\n    closed_set = set()\n    counter = 0\n\n    while frontier:\n        f_score, g_cost, _, current_state, path = heapq.heappop(frontier)\n\n        if is_goal_fn(current_state):\n            return path, g_cost\n\n        if current_state in closed_set:\n            continue\n        closed_set.add(current_state)\n\n        for neighbor, edge_cost in get_neighbors_fn(current_state):\n            tentative_g = g_cost + edge_cost\n            if tentative_g < g_costs.get(neighbor, float('inf')):\n                g_costs[neighbor] = tentative_g\n                f = tentative_g + heuristic_fn(neighbor)\n                counter += 1\n                heapq.heappush(frontier, (f, tentative_g, counter, neighbor, path + [neighbor]))\n    return None, float('inf')`
          },
          pitfalls: [
            "Using an inadmissible heuristic: If h(n) > h*(n), A* can prune the true optimal trajectory and return a suboptimal path.",
            "Omitting the closed/visited set: On grid maps or cyclic state spaces, omitting the closed set leads to exponential redundant path re-expansion."
          ],
          interactiveLab: {
            id: "astar-grid-sim",
            title: "A* Pathfinding Visualizer",
            type: "astar_grid"
          },
          quiz: [
            {
              question: "If heuristic h1(n) is admissible and h2(n) is admissible, which constructed heuristic is mathematically guaranteed to be both admissible and dominant over both?",
              options: [
                "h(n) = (h1(n) + h2(n)) / 2",
                "h(n) = max(h1(n), h2(n))",
                "h(n) = min(h1(n), h2(n))"
              ],
              correctIndex: 1,
              explanation: "The pointwise maximum max(h1(n), h2(n)) never exceeds h*(n) (preserving admissibility) and is >= both individual heuristics, guaranteeing fewer or equal node expansions."
            }
          ],
          citations: [
            "Hart, P. E., Nilsson, N. J., & Raphael, B. (1968). A formal basis for the heuristic determination of minimum cost paths. IEEE TSSC, 4(2), 100-107.",
            "Pearl, J. (1984). Heuristics: Intelligent Search Strategies for Computer Problem Solving. Addison-Wesley.",
            "Dechter, R., & Pearl, J. (1985). Generalized best-first search strategies and the optimality of A*. JACM, 32(3), 505-536."
          ]
        }
      ]
    },
    {
      moduleId: "ai-mod-4",
      title: "Module 4: Adversarial Search & Game Playing",
      topics: [
        {
          topicId: "ai-4-1",
          title: "The Minimax Theorem and Alpha-Beta Pruning",
          estimatedMinutes: 60,
          subtopics: [
            "Two-player zero-sum deterministic games with perfect information",
            "Game tree formulation: Ply, Depth, Terminal utilities, and Minimax recursion",
            "Alpha-Beta pruning mechanics: Maintaining alpha (MAX best) and beta (MIN best)",
            "Asymptotic proof of alpha-beta efficiency: O(b^d) -> O(b^(d/2)) under optimal move ordering",
            "Heuristic evaluation functions and the Horizon Effect",
            "Quiescence search and Transposition tables (Zobrist hashing)"
          ],
          sections: [
            {
              heading: "4.1 Game Theory and the Minimax Theorem",
              content: [
                "In classical state-space search, the environment is passive: the agent plans a path to the goal without opposing forces. In competitive games (such as Chess, Checkers, or Go), the environment contains an adversarial opponent whose actions actively aim to minimize the agent's utility.",
                "In a two-player zero-sum game of perfect information between MAX and MIN, pure cooperation is impossible: any gain for MAX is an identical loss for MIN (Utility_MAX + Utility_MIN = 0). John von Neumann's Minimax Theorem (1928) proves that for every finite two-player zero-sum game, there exists a unique minimax value V(s): MAX seeks to maximize the payoff assuming MIN will play the move that minimizes MAX's payoff.",
                "The minimax algorithm evaluates game trees recursively: at terminal leaves, an evaluation function computes state utility. At MAX nodes, the agent computes the maximum of child values; at MIN nodes, the agent computes the minimum of child values."
              ]
            },
            {
              heading: "4.2 Alpha-Beta Pruning Mechanics and Complexity Reduction",
              content: [
                "Full minimax tree evaluation requires visiting all b^d leaf nodes. In chess (b approx 35, d approx 80), b^d exceeds the number of atoms in the observable universe. Alpha-Beta pruning evaluates the exact identical minimax value without exploring branches that are mathematically guaranteed to have no influence on the final decision.",
                "Alpha-beta maintains two bounding variables down the recursion: alpha represents the highest utility value that MAX has already proven it can achieve along the current path; beta represents the lowest utility value that MIN has proven it can hold MAX to. When alpha >= beta at any node, a cutoff occurs: the current parent will never select this branch, allowing the remaining subtree to be pruned immediately.",
                "The efficiency of alpha-beta depends critically on move ordering. In the worst case (worst move examined first), alpha-beta evaluates all O(b^d) nodes. Under optimal move ordering (best move examined first), alpha-beta evaluates only O(b^{d/2}) nodes! This effectively doubles the searchable depth within the identical computational budget."
              ],
              callout: {
                type: "theorem",
                title: "The Horizon Effect and Quiescence Search",
                tag: "Game Engine Architecture",
                text: "When game search is cut off at a fixed depth d, the agent evaluates non-terminal states with heuristic evaluation functions. If an unstable tactical exchange (e.g. Queen capturing a Pawn) is in mid-flight at depth d, the heuristic may return a wildly inaccurate score. Quiescence Search resolves this by continuing the search past depth d exclusively for 'noisy' captures and checks until a quiet state is reached."
              }
            },
            {
              heading: "4.3 Transposition Tables and Zobrist Hashing",
              content: [
                "Because different permutations of moves often lead to the exact same board configuration (transpositions), evaluating game trees as naive trees causes exponential redundant work. Modern game engines maintain a Transposition Table—a high-performance hash table indexed by 64-bit Zobrist keys.",
                "Zobrist hashing generates random 64-bit bitstrings for each (piece, square) tuple. Updating the board key requires only a fast XOR operation (key = key XOR piece_hash). If a state has already been evaluated at an equal or greater depth, its stored minimax value, alpha/beta bounds, and optimal killer move are returned in O(1) time."
              ]
            }
          ],
          mathematics: {
            equation: "V(s) = \\begin{cases} \\text{Utility}(s) & \\text{if Terminal}(s) \\\\ \\max_{a} V(\\text{Result}(s, a)) & \\text{if Player}(s) = \\text{MAX} \\\\ \\min_{a} V(\\text{Result}(s, a)) & \\text{if Player}(s) = \\text{MIN} \\end{cases}, \\quad \\alpha \\ge \\beta \\implies \\text{Prune}",
            explanation: "Minimax computes the unique game-theoretic value. Alpha-beta pruning terminates recursion whenever the lower bound for MAX (alpha) exceeds the upper bound for MIN (beta).",
            variables: [
              "V(s): Minimax value of game board state s",
              "\\alpha: Highest value guaranteed to MAX along the search path so far",
              "\\beta: Lowest value guaranteed to MIN along the search path so far"
            ]
          },
          code: {
            language: "python",
            filename: "alphabeta_engine_zobrist.py",
            snippet: `def alphabeta_search(state, depth, alpha, beta, is_max, eval_fn, terminal_fn, actions_fn, result_fn, tt_table=None):\n    if tt_table is None:\n        tt_table = {}\n\n    # Check transposition table cache\n    state_key = hash(state)\n    if state_key in tt_table and tt_table[state_key]['depth'] >= depth:\n        return tt_table[state_key]['value'], tt_table[state_key]['best_action']\n\n    if depth == 0 or terminal_fn(state):\n        return eval_fn(state), None\n\n    best_action = None\n    if is_max:\n        max_eval = -float('inf')\n        for action in actions_fn(state):\n            val, _ = alphabeta_search(result_fn(state, action), depth - 1, alpha, beta, False, eval_fn, terminal_fn, actions_fn, result_fn, tt_table)\n            if val > max_eval:\n                max_eval = val\n                best_action = action\n            alpha = max(alpha, val)\n            if beta <= alpha:\n                break  # Beta cut-off: MIN would never allow MAX to reach this branch\n        tt_table[state_key] = {'depth': depth, 'value': max_eval, 'best_action': best_action}\n        return max_eval, best_action\n    else:\n        min_eval = float('inf')\n        for action in actions_fn(state):\n            val, _ = alphabeta_search(result_fn(state, action), depth - 1, alpha, beta, True, eval_fn, terminal_fn, actions_fn, result_fn, tt_table)\n            if val < min_eval:\n                min_eval = val\n                best_action = action\n            beta = min(beta, val)\n            if beta <= alpha:\n                break  # Alpha cut-off: MAX would avoid this path\n        tt_table[state_key] = {'depth': depth, 'value': min_eval, 'best_action': best_action}\n        return min_eval, best_action`
          },
          pitfalls: [
            "Failing to pass updated alpha and beta values correctly through recursive child calls, leading to unsound branch pruning.",
            "Failing to implement move ordering heuristics: Without move ordering, alpha-beta degenerates to standard minimax O(b^d)."
          ],
          quiz: [
            {
              question: "Under optimal move ordering (examining the best move first at every node), what is the effective time complexity of alpha-beta pruning relative to depth d and branching factor b?",
              options: [
                "O(b * d)",
                "O(b^(d/2))",
                "O(d^b)"
              ],
              correctIndex: 1,
              explanation: "Under optimal move ordering, alpha-beta examines O(b^(d/2)) nodes instead of O(b^d), effectively reducing the branching factor to sqrt(b) and doubling the searchable depth."
            }
          ],
          citations: [
            "Von Neumann, J. (1928). Zur theorie der gesellschaftsspiele. Mathematische Annalen, 100(1), 295-320.",
            "Knuth, D. E., & Moore, R. W. (1975). An analysis of alpha-beta pruning. Artificial Intelligence, 6(4), 293-326.",
            "Campbell, M., Hoane, A. J., & Hsu, F. H. (2002). Deep Blue. Artificial Intelligence, 134(1-2), 57-83."
          ]
        }
      ]
    },
    {
      moduleId: "ai-mod-5",
      title: "Module 5: Constraint Satisfaction Problems (CSPs)",
      topics: [
        {
          topicId: "ai-5-1",
          title: "Constraint Propagation, Arc Consistency (AC-3), and Backtracking",
          estimatedMinutes: 60,
          subtopics: [
            "CSP Formalization: Variables X = {X1, ..., Xn}, Domains D = {D1, ..., Dn}, and Constraints C",
            "Constraint propagation: Node consistency, Arc consistency, and k-consistency",
            "The AC-3 algorithm: Enforcing arc consistency in O(cd^3) time",
            "Backtracking search: Variable ordering via Minimum Remaining Values (MRV) and Degree heuristic",
            "Value ordering via Least Constraining Value (LCV) heuristic",
            "Forward Checking and Conflict-Directed Backjumping (CBJ)"
          ],
          sections: [
            {
              heading: "5.1 Factored Representations vs. Atomic States",
              content: [
                "In standard state-space search (BFS, A*), states are black boxes: the search algorithm has no insight into the internal structure of a state beyond evaluating its heuristic or successor list. In Constraint Satisfaction Problems (CSP), the state representation is factored into a set of variables X = {X_1, ..., X_n}, each with a domain of allowable values D_i, and a set of mathematical constraints C = {C_1, ..., C_m}.",
                "A state in a CSP is an assignment of values to some or all variables. An assignment is consistent if it violates no constraints; it is complete if every variable is assigned a value. The goal is to find a complete, consistent assignment.",
                "By exposing internal structure via mathematical constraints, general-purpose heuristic algorithms can solve massive combinatorial problems (e.g. Boolean satisfiability, scheduling, circuit layout, Sudoku) without requiring domain-specific pathfinding heuristics."
              ]
            },
            {
              heading: "5.2 Constraint Propagation and the AC-3 Algorithm",
              content: [
                "Instead of blindly searching through variable assignments, an agent can perform constraint propagation: using constraints to prune impossible values from variable domains before or during search. The most widely used local consistency condition is Arc Consistency.",
                "A directed arc (X_i, X_j) is consistent if, for every value x in the current domain D_i of X_i, there exists at least one value y in domain D_j that satisfies the binary constraint between X_i and X_j. If a value x in D_i has no valid supporting value in D_j, x is pruned from D_i permanently.",
                "The AC-3 algorithm (Mackworth, 1977) initializes a queue with all directed binary arcs in the CSP. It pops an arc (X_i, X_j) and tests consistency. If domain D_i is revised (values pruned), all incoming arcs (X_k, X_i) from neighbors X_k must be re-inserted into the queue, because pruning values from D_i may destroy support for values in D_k. AC-3 runs in worst-case time O(c d^3), where c is the number of constraints and d is maximum domain size."
              ],
              callout: {
                type: "theorem",
                title: "Complexity Bound of the AC-3 Algorithm",
                tag: "Algorithmic Bound",
                text: "A CSP has at most 2c directed arcs. Each arc (X_i, X_j) can be inserted into the queue at most d times, because variable X_i has at most d values that can be deleted. Testing consistency of an arc takes at most O(d^2) comparisons. Therefore, the total worst-case time complexity of AC-3 is O(2c * d * d^2) = O(c * d^3)."
              }
            },
            {
              heading: "5.3 Intelligent Backtracking Heuristics",
              content: [
                "When arc consistency terminates and domains still contain multiple values, the agent executes Backtracking Search (depth-first search that chooses values for one variable at a time). Three domain-independent heuristics accelerate backtracking dramatically:",
                "1. Minimum Remaining Values (MRV): Choose the variable with the fewest remaining legal values ('fail-first' heuristic, pruning the search tree as high up as possible).",
                "2. Degree Heuristic: Tie-breaker for MRV; choose the variable involved in the largest number of constraints on unassigned variables.",
                "3. Least Constraining Value (LCV): When assigning a value, choose the value that rules out the fewest choices for neighboring variables in the constraint graph ('fail-last' heuristic, preserving maximum flexibility)."
              ]
            }
          ],
          mathematics: {
            equation: "\\text{Arc}(X_i, X_j) \\text{ consistent} \\iff \\forall x \\in D_i, \\; \\exists y \\in D_j \\text{ s.t. } (x, y) \\in C_{ij}, \\quad \\mathcal{O}(\\text{AC-3}) = \\mathcal{O}(c \\cdot d^3)",
            explanation: "Arc consistency requires every value in D_i to have at least one valid supporting value in D_j. AC-3 propagates domain reductions in O(c * d^3) worst-case time.",
            variables: [
              "X_i, X_j: Variables in the CSP specification",
              "D_i, D_j: Finite domains of permissible variable assignments",
              "c, d: Number of binary constraints c and maximum domain cardinality d"
            ]
          },
          code: {
            language: "python",
            filename: "ac3_csp_solver_canonical.py",
            snippet: `from collections import deque\n\ndef ac3(csp):\n    # Initialize queue with all directed arcs\n    queue = deque(csp.get_all_directed_arcs())\n    while queue:\n        xi, xj = queue.popleft()\n        if revise(csp, xi, xj):\n            if len(csp.domains[xi]) == 0:\n                return False  # Inconsistent assignment: domain collapsed to empty\n            # Re-enqueue all incoming neighbor arcs (X_k, X_i)\n            for xk in csp.get_neighbors(xi):\n                if xk != xj:\n                    queue.append((xk, xi))\n    return True\n\ndef revise(csp, xi, xj):\n    revised = False\n    for x in list(csp.domains[xi]):\n        # If no y in D_j satisfies the binary constraint with x, prune x\n        has_support = any(csp.is_satisfied(xi, x, xj, y) for y in csp.domains[xj])\n        if not has_support:\n            csp.domains[xi].remove(x)\n            revised = True\n    return revised`
          },
          pitfalls: [
            "Failing to re-enqueue neighbor arcs when a variable's domain is pruned in AC-3, leading to incomplete constraint propagation.",
            "Assuming arc consistency eliminates all need for backtracking: AC-3 narrows domains, but NP-complete CSPs still require backtracking search."
          ],
          quiz: [
            {
              question: "What is the primary rationale behind the Minimum Remaining Values (MRV) variable selection heuristic in backtracking CSP solvers?",
              options: [
                "It maximizes the branching factor at the root",
                "It is a 'fail-first' heuristic that picks the most constrained variable, minimizing the branching factor and causing branches that lead to failure to collapse immediately near the top of the search tree",
                "It selects variables with the largest domains"
              ],
              correctIndex: 1,
              explanation: "Choosing the variable with the fewest legal choices minimizes branching and detects dead ends early, pruning huge subtrees."
            }
          ],
          citations: [
            "Mackworth, A. K. (1977). Consistency in networks of relations. Artificial Intelligence, 8(1), 99-118.",
            "Dechter, R. (2003). Constraint Processing. Morgan Kaufmann.",
            "Russell, S., & Norvig, P. (2020). Artificial Intelligence: A Modern Approach (Chapter 6). Pearson."
          ]
        }
      ]
    },
    {
      moduleId: "ai-mod-6",
      title: "Module 6: Propositional Logic & Resolution Theorem Proving",
      topics: [
        {
          topicId: "ai-6-1",
          title: "Propositional Inference, Conjunctive Normal Form (CNF), and Resolution",
          estimatedMinutes: 60,
          subtopics: [
            "Syntax and semantics of Propositional Logic: Atomic propositions, connectives, and truth tables",
            "Logical Entailment (KB |= alpha): Knowledge base entails alpha iff alpha is true in all models where KB is true",
            "Conversion to Conjunctive Normal Form (CNF): Eliminating implications, De Morgan's laws, and distributing disjunctions",
            "The Resolution Inference Rule: Deriving (A or C) from (A or B) and (not B or C)",
            "Proof by Refutation: Demonstrating that KB and not alpha is unsatisfiable (deriving the empty clause)",
            "Horn clauses and linear-time Forward/Backward chaining"
          ],
          sections: [
            {
              heading: "6.1 Knowledge-Based Agents and Logical Entailment",
              content: [
                "In reflex and search-based agents, knowledge is implicit in algorithms and state graphs. In knowledge-based agents, knowledge is represented explicitly as formal declarative sentences in a logic language. An agent interacts with its Knowledge Base (KB) via two core operations: TELL (asserting new facts) and ASK (querying whether a sentence is entailed by the KB).",
                "The central concept of logical reasoning is Entailment: KB |= alpha asserts that sentence alpha follows logically from KB. Formally, KB entails alpha if and only if in every possible world (model) where KB is true, alpha is also true (M(KB) subseteq M(alpha)). Entailment is truth-preserving: if the premises are true in the real world, any entailed conclusion is guaranteed to be true in the real world."
              ]
            },
            {
              heading: "6.2 Conjunctive Normal Form (CNF) Conversion",
              content: [
                "While truth-table checking tests entailment across all 2^n models, its exponential complexity renders it unusable for hundreds of propositions. Automated theorem proving uses mechanical inference rules. The foundation of automated inference is the Resolution Rule (Robinson, 1965), which requires sentences to be represented in Conjunctive Normal Form (CNF)—a conjunction of disjunctions of literals (a conjunction of clauses).",
                "Any arbitrary propositional sentence can be converted into CNF via deterministic equivalence transformations: (1) Eliminate biconditionals: P <=> Q becomes (P => Q) and (Q => P); (2) Eliminate implications: P => Q becomes not P or Q; (3) Move negations inward using De Morgan's laws: not (P and Q) becomes (not P or not Q); and (4) Distribute disjunctions over conjunctions: (A or (B and C)) becomes (A or B) and (A or C)."
              ],
              callout: {
                type: "theorem",
                title: "The Resolution Rule and Refutation Completeness",
                tag: "Logical Foundations",
                text: "The Resolution Rule states that if clause C_1 contains literal l_i and clause C_2 contains complementary literal m_j = not l_i, they resolve to produce a resolvent clause containing all literals from C_1 and C_2 except the complementary pair. Resolution is sound and refutation complete: KB |= alpha if and only if the set of clauses KB cup {not alpha} is unsatisfiable, which is guaranteed to derive the empty clause (contradiction) in finite steps."
              }
            },
            {
              heading: "6.3 Horn Clauses and Linear-Time Chaining",
              content: [
                "General propositional resolution is NP-complete (equivalent to Boolean Satisfiability / SAT). However, in many real-world domains, knowledge can be restricted to Horn Clauses: clauses with at most one positive literal (e.g. not A or not B or C, which is logically equivalent to the implication (A and B) => C).",
                "On knowledge bases restricted to definite Horn clauses, entailment can be solved in linear time O(n) using Forward Chaining (data-driven reasoning starting from known facts and firing implications until query is reached) or Backward Chaining (goal-driven reasoning working backward from query to premises), forming the core of logic programming languages like Prolog."
              ]
            }
          ],
          mathematics: {
            equation: "\\frac{l_1 \\lor \\dots \\lor l_i \\lor \\dots \\lor l_k, \\quad m_1 \\lor \\dots \\lor m_j \\lor \\dots \\lor m_n}{(l_1 \\dots \\lor l_{i-1} \\lor l_{i+1} \\dots \\lor l_k) \\lor (m_1 \\dots \\lor m_{j-1} \\lor m_{j+1} \\dots \\lor m_n)} \\quad (l_i = \\neg m_j), \\quad KB \\models \\alpha \\iff (KB \\land \\neg \\alpha) \\vdash \\square",
            explanation: "The resolution rule cancels complementary literals. Proof by refutation adds the negated query not alpha to the KB; deriving the empty clause proves entailment.",
            variables: [
              "l_i, m_j: Propositional literals (atomic variables or their negations)",
              "KB: Knowledge base represented as a set of CNF clauses",
              "\\square: The empty clause representing a logical contradiction (False)"
            ]
          },
          code: {
            language: "python",
            filename: "propositional_resolution_engine.py",
            snippet: `def pl_resolve(ci, cj):\n    """Resolves two frozenset clauses over complementary literals."""\n    resolvents = set()\n    for di in ci:\n        for dj in cj:\n            # Complementary pair check: P and ~P\n            if (di.startswith('~') and di[1:] == dj) or (dj.startswith('~') and dj[1:] == di):\n                new_clause = (ci - {di}) | (cj - {dj})\n                resolvents.add(frozenset(new_clause))\n    return resolvents\n\ndef pl_resolution(kb_clauses, query_literal):\n    clauses = set(kb_clauses)\n    # Add negated query to KB (Proof by refutation)\n    negated_q = query_literal[1:] if query_literal.startswith('~') else '~' + query_literal\n    clauses.add(frozenset([negated_q]))\n    new = set()\n\n    while True:\n        clause_list = list(clauses)\n        for i in range(len(clause_list)):\n            for j in range(i + 1, len(clause_list)):\n                resolvents = pl_resolve(clause_list[i], clause_list[j])\n                if frozenset() in resolvents:\n                    return True  # Empty clause derived: KB entails query\n                new.update(resolvents)\n        if new.issubset(clauses):\n            return False  # No new clauses: KB does not entail query\n        clauses.update(new)`
          },
          pitfalls: [
            "Resolving more than one pair of complementary literals simultaneously: Resolving (A or B) and (~A or ~B) yields (B or ~B), NOT the empty clause!",
            "Failing to convert sentences strictly into CNF before running resolution algorithms."
          ],
          quiz: [
            {
              question: "Why does the resolution refutation algorithm add the negation of the query sentence (~alpha) to the knowledge base?",
              options: [
                "To reduce the number of variables in the knowledge base",
                "Because KB entails alpha if and only if KB and ~alpha is unsatisfiable (proof by contradiction)",
                "Because resolution cannot operate on positive literals"
              ],
              correctIndex: 1,
              explanation: "By contradiction, if assuming ~alpha alongside the knowledge base leads to an impossible state (deriving the empty clause), then alpha must be true in all models where KB is true."
            }
          ],
          citations: [
            "Robinson, J. A. (1965). A machine-oriented logic based on the resolution principle. JACM, 12(1), 23-41.",
            "Davis, M., Logemann, G., & Loveland, D. (1962). A machine program for theorem-proving. CACM, 5(7), 394-397.",
            "Russell, S., & Norvig, P. (2020). Artificial Intelligence: A Modern Approach (Chapter 7). Pearson."
          ]
        }
      ]
    },
    {
      moduleId: "ai-mod-7",
      title: "Module 7: First-Order Predicate Logic & Automated Reasoning",
      topics: [
        {
          topicId: "ai-7-1",
          title: "First-Order Logic, Unification, and Generalized Modus Ponens",
          estimatedMinutes: 60,
          subtopics: [
            "Syntax and semantics of First-Order Logic (FOL): Objects, Predicates, Functions, and Quantifiers (Universal, Existential)",
            "The expressive limitations of propositional logic vs. first-order quantification",
            "The Unification Algorithm: Finding substitution theta such that UNIFY(p, q) = theta",
            "Most General Unifier (MGU) and the Occur-Check condition",
            "Generalized Modus Ponens (GMP) for forward chaining on definite clauses",
            "Skolemization and conversion of FOL sentences into Clausal Normal Form"
          ],
          sections: [
            {
              heading: "7.1 The Expressive Power of First-Order Logic",
              content: [
                "Propositional logic lacks expressive power: declaring facts about a world of n objects requires creating separate propositions for every individual pair (e.g. at(Truck1, London), at(Truck2, Paris)). Asserting general rules like 'all trucks are vehicles' requires an infinite conjunction of specific assertions.",
                "First-Order Logic (FOL) introduces objects (nouns), relations/predicates (verbs/properties), functions, and quantifiers: Universal (forall x) and Existential (exists x). This allows asserting general principles across infinite domains with compact sentences: forall x: Truck(x) => Vehicle(x)."
              ]
            },
            {
              heading: "7.2 The Unification Algorithm and the Occur-Check",
              content: [
                "In propositional logic, two literals resolve if they are syntactically identical complementary symbols (P and ~P). In First-Order Logic, literals contain variables and function terms (e.g. Knows(John, x) and Knows(y, Bill)).",
                "The Unification algorithm is an algorithmic process that finds a parameter substitution theta = {v_1/t_1, ..., v_k/t_k} that makes two structured logical expressions syntactically identical: UNIFY(p, q) = theta implies SUBST(theta, p) = SUBST(theta, q).",
                "Unification algorithms must enforce the Occur-Check: verifying that a variable x does not appear inside the term t it is being bound to. Unifying x with f(x) without an occur-check creates an infinite circular structure x = f(f(f(...))), rendering theorem provers unsound."
              ],
              callout: {
                type: "theorem",
                title: "Gödel's Completeness Theorem for First-Order Logic",
                tag: "Mathematical Logic",
                text: "Kurt Gödel (1930) proved that First-Order Logic is complete: there exists a mechanical proof procedure (first-order resolution with unification) that can prove any sentence that is logically entailed by a set of axioms. However, Alan Turing and Alonzo Church (1936) proved that FOL is semidecidable: if KB |= alpha, resolution will terminate and prove it in finite time; but if KB does NOT entail alpha, the algorithm may search forever without terminating."
              }
            },
            {
              heading: "7.3 Skolemization and Clausal Normal Form",
              content: [
                "To apply resolution theorem proving to First-Order Logic, sentences must be transformed into Clausal Normal Form: (1) Eliminate implications; (2) Move negations inward; (3) Standardize variables apart (renaming variables so each quantifier binds a unique name); (4) Skolemize existential quantifiers; (5) Drop universal quantifiers (all remaining variables are implicitly universally quantified); and (6) Distribute disjunctions.",
                "Skolemization eliminates existential quantifiers exists x: P(x) by replacing x with a fresh constant symbol (Skolem Constant) c: P(c). When an existential quantifier lies within the scope of universal quantifiers (e.g. forall x exists y: Mother(y, x)), y is replaced with a Skolem Function f(x): Mother(f(x), x)."
              ]
            }
          ],
          mathematics: {
            equation: "\\text{UNIFY}(p, q) = \\theta \\implies \\text{SUBST}(\\theta, p) = \\text{SUBST}(\\theta, q), \\quad \\frac{p_1', \\dots, p_n', \\quad (p_1 \\land \\dots \\land p_n \\implies q)}{\\text{SUBST}(\\theta, q)}",
            explanation: "Unification finds substitution theta aligning expressions. Generalized Modus Ponens applies theta to infer conclusion q in forward chaining.",
            variables: [
              "p, q: First-order atomic predicates or functional terms",
              "\\theta: Substitution mapping dictionary mapping variables to terms",
              "\\text{SUBST}(\\theta, p): Result of substituting all mapped variables in expression p"
            ]
          },
          code: {
            language: "python",
            filename: "fol_unification_algorithm.py",
            snippet: `def unify(x, y, theta=None):\n    if theta is None:\n        theta = {}\n    if x == y:\n        return theta\n    elif isinstance(x, str) and x.islower():  # Lowercase indicates variable\n        return unify_var(x, y, theta)\n    elif isinstance(y, str) and y.islower():\n        return unify_var(y, x, theta)\n    elif isinstance(x, list) and isinstance(y, list):\n        if len(x) != len(y):\n            return None\n        return unify(x[1:], y[1:], unify(x[0], y[0], theta))\n    return None\n\ndef unify_var(var, x, theta):\n    if var in theta:\n        return unify(theta[var], x, theta)\n    elif x in theta:\n        return unify(var, theta[x], theta)\n    elif occurs_check(var, x, theta):\n        return None  # Occurs check failed: prevents infinite circular binding\n    new_theta = dict(theta)\n    new_theta[var] = x\n    return new_theta\n\ndef occurs_check(var, x, theta):\n    if var == x:\n        return True\n    if isinstance(x, str) and x in theta:\n        return occurs_check(var, theta[x], theta)\n    if isinstance(x, list):\n        return any(occurs_check(var, arg, theta) for arg in x)\n    return False`
          },
          pitfalls: [
            "Omitting the occurs-check during unification: Unifying variable x with term f(x) creates an infinite circular pointer structure, causing unsound theorem proving.",
            "Re-using identical variable names across different rules without standardizing variables apart before unification."
          ],
          quiz: [
            {
              question: "What is the purpose of the occurs-check in the First-Order Logic unification algorithm?",
              options: [
                "To ensure predicates have the same number of arguments",
                "To prevent circular variable binding such as unifying variable x with f(x), which would create infinite loops and unsound deductions",
                "To eliminate existential quantifiers"
              ],
              correctIndex: 1,
              explanation: "The occurs-check verifies that variable x does not appear anywhere inside the expression it is being bound to, preventing circular self-referential terms."
            }
          ],
          citations: [
            "Robinson, J. A. (1965). A machine-oriented logic based on the resolution principle. JACM, 12(1), 23-41.",
            "Gödel, K. (1930). Die Vollständigkeit der Axiome des logischen Funktionenkalküls. Monatshefte für Mathematik und Physik.",
            "Russell, S., & Norvig, P. (2020). Artificial Intelligence: A Modern Approach (Chapter 9). Pearson."
          ]
        }
      ]
    },
    {
      moduleId: "ai-mod-8",
      title: "Module 8: Classical Planning & State-Space Exploration",
      topics: [
        {
          topicId: "ai-8-1",
          title: "PDDL, STRIPS Operators, and Progression vs. Regression Planning",
          estimatedMinutes: 60,
          subtopics: [
            "The Planning Domain Definition Language (PDDL) standard",
            "STRIPS operator representation: Preconditions, Add list, and Delete list",
            "Forward State-Space Progression search: Navigating from initial state toward goal",
            "Backward State-Space Regression search: Subgoal exploration from goal back to initial state",
            "Planning Graphs and Mutex (Mutual Exclusion) relations in GraphPlan",
            "Domain-independent planning heuristics: The relaxed problem delete-relaxation heuristic"
          ],
          sections: [
            {
              heading: "8.1 The Planning Domain Definition Language (PDDL)",
              content: [
                "Classical search requires writing custom successor functions in Python or C++ for every new task. Classical automated planning solves this by using a standardized domain-independent representation: PDDL (Planning Domain Definition Language).",
                "In PDDL, a world state is represented as a conjunction of positive ground relational fluents (e.g. at(Plane1, JFK) and in(Cargo2, Plane1)). Actions are defined as schema operators with three explicit predicate lists: (1) Preconditions (predicates that must be true in the current state for the action to be legally executable); (2) Add List (predicates made true by executing the action); and (3) Delete List (predicates made false by executing the action)."
              ]
            },
            {
              heading: "8.2 Progression vs. Regression and the Curse of Dimensionality",
              content: [
                "A planner can search in two directions: Forward State-Space Progression searches forward from the initial state, applying applicable actions to generate successor states until the goal state is reached. Progression has high branching factors because many legal actions are irrelevant to the goal.",
                "Backward State-Space Regression starts at the goal description and searches backward toward the initial state, considering only relevant actions whose Add lists achieve at least one goal fluent. Regression has smaller branching factors, but requires reasoning over sets of states (subgoal conjunctions) rather than concrete single states.",
                "The breakthrough in modern classical planning came from Planning Graphs and Delete-Relaxation Heuristics. By relaxing the planning problem (ignoring all delete effects of actions so that propositions are never undone), the resulting relaxed planning problem can be solved in polynomial time, delivering powerful admissible heuristic distance estimates (such as h_add and h_max) automatically."
              ],
              callout: {
                type: "theorem",
                title: "Planning Graphs and Mutex Relations",
                tag: "GraphPlan Architecture",
                text: "A Planning Graph is a directed layered graph alternating between proposition levels S_i and action levels A_i. Blum and Furst (1997) proved that mutual exclusion (Mutex) relations between parallel actions (Inconsistent Effects, Interference, Competing Needs) can be propagated monotonically in polynomial time, proving when goals cannot possibly be achieved."
              }
            },
            {
              heading: "8.3 Fast-Forward (FF) and Modern SAT-Based Planners",
              content: [
                "Modern industrial planners (like the FF planner and LAMA) extract relaxed plans from planning graphs at every step, using the length of the relaxed plan as an informed guide for forward progression search. Furthermore, planning problems can be compiled directly into Boolean Satisfiability (SAT) formulas and solved via modern CDCL SAT solvers."
              ]
            }
          ],
          mathematics: {
            equation: "\\text{Applicable}(a, s) \\iff \\text{Precond}(a) \\subseteq s, \\quad \\text{Result}(s, a) = (s \\setminus \\text{Delete}(a)) \\cup \\text{Add}(a), \\quad h_{\\text{relax}}(s) = |\\text{RelaxedPlan}(s)|",
            explanation: "Action applicability requires preconditions to be satisfied in state s. Successor states subtract delete effects and add new fluents. Relaxed planning heuristics ignore delete sets.",
            variables: [
              "s: State represented as a set of positive ground relational fluents",
              "\\text{Precond}(a): Set of required state predicates for action a",
              "\\text{Add}(a), \\text{Delete}(a): Effect sets added or removed from the state"
            ]
          },
          code: {
            language: "python",
            filename: "pddl_strips_planner.py",
            snippet: `class STRIPSAction:\n    def __init__(self, name, preconditions, add_effects, delete_effects):\n        self.name = name\n        self.preconditions = set(preconditions)\n        self.add_effects = set(add_effects)\n        self.delete_effects = set(delete_effects)\n\n    def is_applicable(self, state):\n        return self.preconditions.issubset(state)\n\n    def apply(self, state):\n        return (state - self.delete_effects) | self.add_effects\n\ndef forward_state_space_search(initial_state, goal_state, actions, max_depth=12):\n    frontier = [(initial_state, [])]\n    visited = {frozenset(initial_state)}\n\n    while frontier:\n        current_state, plan = frontier.pop(0)\n        if goal_state.issubset(current_state):\n            return plan  # Goal condition satisfied\n\n        if len(plan) >= max_depth:\n            continue\n\n        for action in actions:\n            if action.is_applicable(current_state):\n                next_s = action.apply(current_state)\n                key = frozenset(next_s)\n                if key not in visited:\n                    visited.add(key)\n                    frontier.append((next_s, plan + [action.name]))\n    return None`
          },
          pitfalls: [
            "Forward progression search without delete-relaxation heuristics: Exploring all applicable actions forward without heuristic pruning suffers from exponential branching factor explosion.",
            "Failing to account for action interference: Applying two parallel actions in the same time step when one action deletes a precondition required by the other."
          ],
          quiz: [
            {
              question: "How does the delete-relaxation heuristic estimate the distance to a goal state in domain-independent classical automated planning?",
              options: [
                "By measuring Euclidean distance in feature space",
                "By solving a relaxed planning problem in which all delete effects of actions are dropped, turning the search into a polynomial-time monotonic achievement graph",
                "By running Monte Carlo rollouts"
              ],
              correctIndex: 1,
              explanation: "Ignoring delete effects means achievements are never undone. A relaxed plan can be extracted in polynomial time, providing an informed heuristic for the real search space."
            }
          ],
          citations: [
            "Fikes, R. E., & Nilsson, N. J. (1971). STRIPS: A new approach to the application of theorem proving to problem solving. Artificial Intelligence, 2(3-4), 189-208.",
            "Blum, A. L., & Furst, M. L. (1997). Fast planning through planning graph analysis. Artificial Intelligence, 90(1-2), 281-300.",
            "Hoffmann, J., & Nebel, B. (2001). The FF planning system: Fast plan generation through heuristic search. JAIR, 14, 253-302."
          ]
        }
      ]
    },
    {
      moduleId: "ai-mod-9",
      title: "Module 9: Probabilistic Reasoning & Bayesian Networks",
      topics: [
        {
          topicId: "ai-9-1",
          title: "Bayesian Networks, d-Separation, and Variable Elimination",
          estimatedMinutes: 60,
          subtopics: [
            "Representing uncertainty in complex domains: The combinatorial explosion of full joint probability tables",
            "Bayesian Network syntax: Directed Acyclic Graphs (DAGs) representing conditional dependencies",
            "The Chain Rule factorization: Factoring joint distributions into local Conditional Probability Tables (CPTs)",
            "d-Separation: Geometric criterion for determining conditional independence across Chains, Forks, and Colliders",
            "The Collider (V-structure) and the 'Explaining Away' phenomenon",
            "Exact probabilistic inference: The Variable Elimination dynamic programming algorithm",
            "Approximate inference: Rejection Sampling, Likelihood Weighting, and Markov Chain Monte Carlo (MCMC)"
          ],
          sections: [
            {
              heading: "9.1 Managing Uncertainty and Conditional Independence",
              content: [
                "In real-world environments, pure classical logic fails due to three fundamental obstacles: Laziness (too much work to list all antecedents), Theoretical Ignorance (lacking complete physical laws), and Practical Ignorance (sensors unable to measure all variables). An agent must reason under uncertainty using probability theory.",
                "Specifying a full joint probability distribution over n binary random variables requires 2^n - 1 numbers—demanding massive memory and millions of samples to estimate. Bayesian Networks (Judea Pearl, 1988) exploit conditional independence, allowing joint probability distributions to be factored into local Conditional Probability Tables (CPTs) at each graph node."
              ]
            },
            {
              heading: "9.2 Graph Topology, d-Separation, and Explaining Away",
              content: [
                "A Bayesian Network is a Directed Acyclic Graph (DAG) where nodes represent random variables and directed edges represent direct probabilistic dependencies. By the network factorization rule, the joint probability is the product of the conditional probability of each node given its parents: P(X_1, ..., X_n) = prod_{i=1}^n P(X_i | Parents(X_i)).",
                "d-Separation (directed separation) is the geometric criterion that determines whether variable set X is conditionally independent of variable set Y given evidence set E. It evaluates three topological connections: (1) Causal Chains (A -> B -> C): Evidence on B blocks the path; (2) Common Causes / Forks (A <- B -> C): Evidence on B blocks the path; and (3) Common Effects / Colliders / V-structures (A -> C <- B): A collider is naturally blocked when C is UNKNOWN. However, observing evidence on collider C (or any of its descendants) OPENS the path between A and B! This counter-intuitive property is known as 'Explaining Away': if both Earthquake and Burglar can trigger Alarm, observing an Earthquake explains away the alarm, dramatically lowering the posterior probability of a Burglar."
              ],
              callout: {
                type: "theorem",
                title: "Complexity of Probabilistic Inference",
                tag: "Computational Complexity",
                text: "Cooper (1990) proved that exact probabilistic inference in arbitrary Bayesian networks is NP-hard. In polytrees (singly connected networks with no undirected cycles), exact inference runs in polynomial time O(n). In multiply connected networks, the Variable Elimination algorithm groups variables into intermediate factor matrices, with complexity scaling exponentially with the network's induced tree-width."
              }
            },
            {
              heading: "9.3 Exact Inference via Variable Elimination",
              content: [
                "Naive inference by enumeration sums out irrelevant variables from the full joint distribution, repeating redundant multiplications. Variable Elimination evaluates queries by applying dynamic programming: it pushes summations inward through factors using the distributive law a * b + a * c = a * (b + c), computing intermediate factor tensors once and reusing them."
              ]
            }
          ],
          mathematics: {
            equation: "P(X_1, \\dots, X_n) = \\prod_{i=1}^n P(X_i \\mid \\text{Parents}(X_i)), \\quad P(A \\mid B, C) = P(A \\mid C) \\iff A \\perp\\!\\!\\!\\perp B \\mid C",
            explanation: "Joint distribution factorizes into local CPTs over parents. Conditional independence A ind B | C holds if all undirected paths between A and B are d-separated by evidence C.",
            variables: [
              "X_i: Random variable in the Bayesian Network",
              "\\text{Parents}(X_i): Set of immediate parent nodes directed into X_i in the DAG",
              "A \\perp\\!\\!\\!\\perp B \\mid C: Statement asserting that A is conditionally independent of B given evidence C"
            ]
          },
          code: {
            language: "python",
            filename: "bayesian_network_factorization.py",
            snippet: `class BayesNetNode:\n    def __init__(self, name, parents, cpt_table):\n        self.name = name\n        self.parents = parents\n        self.cpt = cpt_table  # Dict mapping parent tuple to P(X=True)\n\nclass BayesianNetwork:\n    def __init__(self):\n        self.nodes = {}\n\n    def add_node(self, name, parents, cpt):\n        self.nodes[name] = BayesNetNode(name, parents, cpt)\n\n    def compute_joint_probability(self, assignment):\n        """Computes joint probability of an assignment using network factorization."""\n        prob = 1.0\n        for name, node in self.nodes.items():\n            val = assignment[name]\n            parent_vals = tuple(assignment[p] for p in node.parents)\n            p_true = node.cpt[parent_vals]\n            prob *= p_true if val else (1.0 - p_true)\n        return prob\n\n# Construct classic Earthquake / Burglary network\nbn = BayesianNetwork()\nbn.add_node("Burglary", [], {(): 0.001})\nbn.add_node("Earthquake", [], {(): 0.002})\nbn.add_node("Alarm", ["Burglary", "Earthquake"], {\n    (True, True): 0.95,\n    (True, False): 0.94,\n    (False, True): 0.29,\n    (False, False): 0.001\n})\njoint = bn.compute_joint_probability({"Burglary": True, "Earthquake": False, "Alarm": True})\nprint(f"P(Burglary=T, Earthquake=F, Alarm=T): {joint:.6e}")`
          },
          pitfalls: [
            "Misinterpreting colliders (V-structures A -> C <- B): Assuming A and B remain independent after observing C. Conditioning on a collider creates conditional dependency (explaining away).",
            "Applying exact variable elimination on dense, high-treewidth graphs where intermediate factor tensors explode in memory."
          ],
          quiz: [
            {
              question: "In a Bayesian network collider structure (A -> C <- B), are variables A and B conditionally independent given evidence on C?",
              options: [
                "Yes, observing evidence always preserves independence",
                "No, observing evidence on a common child (collider) or its descendants OPENS the path between its parents, creating conditional dependency (explaining away)",
                "They are only independent if the network is bipartite"
              ],
              correctIndex: 1,
              explanation: "Unlike causal chains and forks, a collider is blocked when unobserved. Observing evidence on the collider activates the path, causing its parents to become conditionally dependent."
            }
          ],
          citations: [
            "Pearl, J. (1988). Probabilistic Reasoning in Intelligent Systems: Networks of Plausible Inference. Morgan Kaufmann.",
            "Cooper, G. F. (1990). The computational complexity of probabilistic inference using Bayesian belief networks. Artificial Intelligence, 42(2-3), 393-405.",
            "Koller, D., & Friedman, N. (2009). Probabilistic Graphical Models: Principles and Techniques. MIT Press."
          ]
        }
      ]
    },
    {
      moduleId: "ai-mod-10",
      title: "Module 10: Sequential Decisions & Markov Decision Processes (MDPs)",
      topics: [
        {
          topicId: "ai-10-1",
          title: "Bellman Optimality Equations, Value Iteration, and Policy Iteration",
          estimatedMinutes: 60,
          subtopics: [
            "Sequential decision making under uncertainty: States S, Actions A, Transition Probabilities P(s'|s,a), Reward R(s,a,s'), and Discount Factor gamma",
            "The Markov Property: Independence of future states from history given current state",
            "State-Value function V^pi(s) and Action-Value function Q^pi(s, a)",
            "The Bellman Expectation Equation and Bellman Optimality Equation",
            "Value Iteration: Proof of convergence via Banach Fixed-Point Contraction Mapping in the L_infinity norm",
            "Policy Iteration: Alternating Policy Evaluation and Greedy Policy Improvement"
          ],
          sections: [
            {
              heading: "10.1 The Formalism of Sequential Decision Making",
              content: [
                "In classical planning, actions have deterministic outcomes. In real-world robotics and reinforcement learning, transitions are stochastic: an action succeeds with probability p and slips into an unintended state with probability 1 - p. Furthermore, decisions have delayed consequences: an agent must endure short-term penalties to achieve large long-term rewards.",
                "A Markov Decision Process (MDP) is a 5-tuple (S, A, P, R, gamma). The Markov property asserts that environmental dynamics depend strictly on the current state and action: P(s_{t+1} | s_t, a_t, s_{t-1}, a_{t-1}, ...) = P(s_{t+1} | s_t, a_t).",
                "The discount factor gamma in [0, 1) balances immediate reward against future reward, mathematically bounding infinite-horizon cumulative returns: G_t = sum_{k=0}^inf gamma^k R_{t+k+1} <= R_max / (1 - gamma)."
              ]
            },
            {
              heading: "10.2 The Bellman Optimality Equation and Contraction Mapping",
              content: [
                "Richard Bellman (1957) formulated the foundational principle of dynamic programming: the value of a state is the expected immediate reward plus the discounted value of the subsequent state.",
                "The optimal state value function V*(s) is the expected return from following the optimal policy pi*. The Bellman Optimality Equation expresses V*(s) recursively: V*(s) = max_{a in A} sum_{s'} P(s' | s, a) [ R(s, a, s') + gamma V*(s') ].",
                "Value Iteration updates state values iteratively using the Bellman operator: V_{k+1}(s) = max_a sum_{s'} P(s' | s, a) [ R + gamma V_k(s') ]. By the Banach Fixed-Point Theorem, the Bellman backup operator is a contraction mapping in the infinity-norm: ||B(V) - B(U)||_inf <= gamma ||V - U||_inf. Because gamma < 1, Value Iteration is mathematically guaranteed to converge geometrically to a unique fixed point regardless of initial values!"
              ],
              callout: {
                type: "theorem",
                title: "Policy Iteration vs. Value Iteration",
                tag: "Dynamic Programming",
                text: "While Value Iteration updates values until they converge within epsilon, Policy Iteration maintains an explicit policy pi. It alternates between Policy Evaluation (solving linear equations V^pi(s) = sum P [ R + gamma V^pi(s') ] for fixed policy pi) and Policy Improvement (updating pi(s) = argmax Q^pi(s, a)). Policy Iteration typically converges in vastly fewer iterations because the policy often becomes optimal long before value functions converge to high decimal precision."
              }
            },
            {
              heading: "10.3 From Model-Based MDPs to Model-Free Reinforcement Learning",
              content: [
                "Dynamic programming algorithms assume the agent has full access to the transition probabilities P(s' | s, a) and reward function R. In model-free Reinforcement Learning (Q-Learning and SARSA), transition probabilities are completely unknown: the agent must explore the environment via trial and error, estimating Q-values directly from sampled experience."
              ]
            }
          ],
          mathematics: {
            equation: "V^*(s) = \\max_{a \\in \\mathcal{A}} \\sum_{s'} P(s' \\mid s, a) \\left[ R(s, a, s') + \\gamma V^*(s') \\right], \\quad \\|\\mathcal{B}(V) - \\mathcal{B}(U)\\|_\\infty \\le \\gamma \\|V - U\\|_\\infty",
            explanation: "The Bellman Optimality Equation expresses state value recursively. The Bellman operator B is a gamma-contraction mapping, guaranteeing geometric convergence to unique V*.",
            variables: [
              "V^*(s): Optimal long-term expected cumulative value from state s",
              "\\gamma \\in [0, 1): Discount factor balancing immediate vs. future rewards",
              "P(s' \\mid s, a): Transition probability of reaching state s' after executing action a in state s",
              "R(s, a, s'): Reward received transitioning from s to s' under action a"
            ]
          },
          code: {
            language: "python",
            filename: "mdp_value_and_policy_iteration.py",
            snippet: `def value_iteration(states, actions, transition_prob_fn, reward_fn, gamma=0.95, epsilon=1e-6):\n    V = {s: 0.0 for s in states}\n    policy = {s: None for s in states}\n\n    while True:\n        delta = 0.0\n        new_V = {}\n        for s in states:\n            q_values = {}\n            for a in actions:\n                # Q(s, a) = sum_{s'} P(s'|s, a) * [R(s, a, s') + gamma * V(s')]\n                q = sum(\n                    prob * (reward_fn(s, a, next_s) + gamma * V[next_s])\n                    for next_s, prob in transition_prob_fn(s, a)\n                )\n                q_values[a] = q\n            best_action = max(q_values, key=q_values.get)\n            best_q = q_values[best_action]\n            new_V[s] = best_q\n            policy[s] = best_action\n            delta = max(delta, abs(V[s] - best_q))\n        V = new_V\n        # Stopping condition guaranteeing epsilon-optimality\n        if delta < epsilon * (1.0 - gamma) / gamma:\n            break\n    return V, policy`
          },
          pitfalls: [
            "Setting gamma = 1.0 in infinite-horizon MDPs with non-zero rewards: Without discounting, value sums diverge to infinity.",
            "Stopping value iteration too early: The termination threshold must satisfy delta < epsilon * (1 - gamma) / gamma to guarantee that the induced policy is epsilon-optimal."
          ],
          quiz: [
            {
              question: "What mathematical property guarantees that Value Iteration converges to a unique optimal value function V* regardless of initial values?",
              options: [
                "The Central Limit Theorem",
                "The Bellman backup operator is a gamma-contraction mapping in the infinity-norm (Banach Fixed-Point Theorem)",
                "The Markov property ensures zero variance"
              ],
              correctIndex: 1,
              explanation: "Because gamma < 1, applying the Bellman backup operator shrinks the distance between any two value functions by at least gamma, guaranteeing geometric convergence to a unique fixed point."
            }
          ],
          citations: [
            "Bellman, R. (1957). Dynamic Programming. Princeton University Press.",
            "Sutton, R. S., & Barto, A. G. (2018). Reinforcement Learning: An Introduction (2nd ed.). MIT Press.",
            "Puterman, M. L. (2014). Markov Decision Processes: Discrete Stochastic Dynamic Programming. John Wiley & Sons."
          ]
        }
      ]
    }
  ]
};
