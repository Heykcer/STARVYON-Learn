# Roadmaps.md — Master Curriculum & Extracted Roadmaps Compendium

> **STARVYON Learn Master Specification**  
> **Repository:** STARVYON Learn (`c:\Users\Tanjil Alam\Desktop\Projects\STARVYON-Learn`)  
> **Master Track:** Artificial Intelligence Track (Artificial Intelligence Engineering)  
> **Compiled From:** Industry-standard extracted roadmaps (Artificial Intelligence, Machine Learning, Deep Learning, Generative AI, and Agentic AI)

---

## Table of Contents
1. [Master Architecture: The Unified Artificial Intelligence Track](#1-master-architecture-the-unified-artificial-intelligence-track)
2. [Roadmap 1: Artificial Intelligence Foundations (AI-101) — 10 Modules](#2-roadmap-1-artificial-intelligence-foundations-ai-101--10-modules)
3. [Roadmap 2: Statistical Machine Learning (ML-201) — 10 Modules](#3-roadmap-2-statistical-machine-learning-ml-201--10-modules)
4. [Roadmap 3: Deep Neural Networks and Architectures (DL-301) — 10 Modules](#4-roadmap-3-deep-neural-networks-and-architectures-dl-301--10-modules)
5. [Roadmap 4: Generative AI and Foundation Models (GENAI-401) — 10 Modules](#5-roadmap-4-generative-ai-and-foundation-models-genai-401--10-modules)
6. [Roadmap 5: Agentic AI and Autonomous Systems (AGENT-501) — 11 Modules](#6-roadmap-5-agentic-ai-and-autonomous-systems-agent-501--11-modules)
7. [Future Horizons: Upcoming Engineering Tracks](#7-future-horizons-upcoming-engineering-tracks)

---

## 1. Master Architecture: The Unified Artificial Intelligence Track

The five core subjects of modern artificial intelligence do not exist in isolation. In **STARVYON Learn**, they are organized into a single, cohesive **Learning Path called Artificial Intelligence Engineering** (the **Artificial Intelligence Track**, code: `TRACK-AIE`).

In the Courses catalog (`#courses`), each discipline is available as a distinct standalone course with its own syllabus, yet all five are categorized under **Artificial Intelligence**:

```
+----------------------------------------------------------------------------------------------------+
|                      LEARNING PATH: ARTIFICIAL INTELLIGENCE ENGINEERING (262h)                    |
|                                                                                                    |
|   +------------------+    +------------------+    +------------------+    +--------------------+   |
|   |  01. AI-101      | -> |  02. ML-201      | -> |  03. DL-301      | -> |  04. GENAI-401     |   |
|   |  Classical AI &  |    |  Statistical ML  |    |  Deep Neural     |    |  Foundation Models |   |
|   |  Search Calculus |    |  & Regularization|    |  & Optimization  |    |  & Enterprise RAG  |   |
|   +------------------+    +------------------+    +------------------+    +--------------------+   |
|                                                                                     |              |
|                                                                                     v              |
|                                                                           +--------------------+   |
|                                                                           |  05. AGENT-501     |   |
|                                                                           |  Autonomous Agents |   |
|                                                                           |  & MCP Protocol    |   |
|                                                                           +--------------------+   |
+----------------------------------------------------------------------------------------------------+
```

---

## 2. Roadmap 1: Artificial Intelligence Foundations (AI-101) — 10 Modules

* **Code:** `AI-101` | **Duration:** 36 Hours | **Discipline:** Artificial Intelligence
* **Focus:** Rational agents, state-space search, heuristic algorithms, adversarial game theory, propositional logic, automated planning, Bayesian inference, and sequential decisions.

### Module 1: Rational Agents & Problem Formulation
* **The PEAS Framework:**
  * Performance Measures: Defining objective, non-arbitrary utility functions $\mathcal{U}(s')$.
  * Environment Taxonomy: Fully observable vs. Partially observable, Deterministic vs. Stochastic, Episodic vs. Sequential, Static vs. Dynamic, Discrete vs. Continuous, Single-agent vs. Multi-agent.
  * Actuators & Sensors: Physical and virtual interfaces.
* **Agent Architectures:**
  * Simple Reflex Agents (condition-action rules).
  * Model-Based Reflex Agents (internal state tracking of unobserved world dimensions).
  * Goal-Based Agents (deliberative planning).
  * Utility-Based Agents (tradeoff optimization under uncertainty).
  * Learning Agents (critic, learning element, performance element, problem generator).

### Module 2: Uninformed (Blind) State-Space Search
* **State Space Graph Representation:** Initial State, Action Space $\mathcal{A}(s)$, Transition Model $\text{Result}(s, a)$, Goal Test Predicate, and Step Cost Function $c(s, a, s')$.
* **Search Strategies:**
  * Breadth-First Search (BFS): Queue FIFO frontier, completeness, $O(b^d)$ time and space complexity.
  * Uniform-Cost Search (Dijkstra): Priority queue ordering by cumulative path cost $g(n)$, guaranteed optimal for non-negative step costs.
  * Depth-First Search (DFS): Stack LIFO frontier, linear space complexity $O(bm)$, vulnerability to infinite paths.
  * Depth-Limited and Iterative Deepening Search (IDS): Unifying BFS optimality with DFS $O(bd)$ memory footprint.

### Module 3: Informed Heuristic Search & The $A^*$ Algorithm
* **Heuristic Functions:** Estimating distance $h(n)$ to goal state from node $n$.
* **Evaluation Metric:** $f(n) = g(n) + h(n)$.
* **Heuristic Properties:**
  * Admissibility: $h(n) \le h^*(n)$ (never overestimating true physical cost).
  * Consistency (Monotonicity): $h(n) \le c(n, a, n') + h(n')$ (triangle inequality).
  * Dominance: If $h_2(n) \ge h_1(n)$ for all $n$, $h_2$ dominates $h_1$ and expands fewer or equal nodes.
* **Memory-Bounded Heuristic Search:** Iterative Deepening A* (IDA*) and Recursive Best-First Search (RBFS).

### Module 4: Adversarial Search & Game Playing
* **Minimax Theorem:**
  * Two-player zero-sum games with perfect information.
  * Minimax Value Recursion:
    $$V(s) = \begin{cases} \text{Utility}(s) & \text{if Terminal}(s) \\ \max_{a} V(\text{Result}(s, a)) & \text{if Player}(s) = \text{MAX} \\ \min_{a} V(\text{Result}(s, a)) & \text{if Player}(s) = \text{MIN} \end{cases}$$
* **Alpha-Beta Pruning:**
  * Pruning condition: Prune subtree when $\alpha \ge \beta$.
  * Effective branching factor reduction: $O(b^d) \to O(b^{d/2})$ with optimal move ordering.
  * Move ordering heuristics: Transposition tables, killer moves, and quiescence search (mitigating the horizon effect).

### Module 5: Constraint Satisfaction Problems (CSP)
* **CSP Formulation:** Variables $X = \{X_1, \dots, X_n\}$, Domains $D = \{D_1, \dots, D_n\}$, Constraints $C = \{C_1, \dots, C_m\}$.
* **Constraint Propagation & Consistency:**
  * Node Consistency and Arc Consistency.
  * **AC-3 Algorithm:** Enforcing arc consistency in $O(c \cdot d^3)$ time.
* **Backtracking Search for CSP:**
  * Minimum Remaining Values (MRV) heuristic (Most Constrained Variable).
  * Degree Heuristic (tie-breaker).
  * Least Constraining Value (LCV) heuristic.
  * Forward Checking and Conflict-Directed Backjumping.

### Module 6: Propositional Logic & Resolution Theorem Proving
* **Propositional Syntax & Semantics:** Truth tables, models, entailment ($KB \models \alpha$).
* **Conjunctive Normal Form (CNF):** Eliminating implications, De Morgan's laws, distributing disjunctions.
* **The Resolution Inference Rule:**
  $$\frac{l_1 \lor \dots \lor l_i \lor \dots \lor l_k, \quad m_1 \lor \dots \lor m_j \lor \dots \lor m_n}{(l_1 \lor \dots \lor l_{i-1} \lor l_{i+1} \dots \lor l_k) \lor (m_1 \dots \lor m_{j-1} \lor m_{j+1} \dots \lor m_n)} \quad (\text{where } l_i = \neg m_j)$$
* **Proof by Refutation:** Demonstrating $KB \land \neg \alpha$ is unsatisfiable (deriving the empty clause $\square$).
* **Horn Clauses:** Linear-time inference via Forward and Backward Chaining.

### Module 7: First-Order Predicate Logic & Automated Reasoning
* **First-Order Logic (FOL):** Objects, Predicates, Functions, and Quantifiers ($\forall, \exists$).
* **The Unification Algorithm:** Finding substitution $\theta$ such that $\text{UNIFY}(p, q) = \theta$.
* **Most General Unifier (MGU) & Occur-Check:** Preventing circular variable assignments.
* **Generalized Modus Ponens (GMP):** Forward chaining on definite first-order clauses.
* **Skolemization:** Replacing existential quantifiers with Skolem constants or Skolem functions.

### Module 8: Classical Planning & State-Space Exploration
* **Planning Domain Definition Language (PDDL):** Actions with Preconditions, Add lists, and Delete lists.
* **State Progression vs. Goal Regression:**
  $$\text{Applicable}(a, s) \iff \text{Precond}(a) \subseteq s, \quad \text{Result}(s, a) = (s \setminus \text{Delete}(a)) \cup \text{Add}(a)$$
* **Planning Graphs & GraphPlan:** Mutex (Mutual Exclusion) relations between actions and propositions.
* **Heuristics for Domain-Independent Planning:** The $h_{\text{add}}$ and $h_{\text{max}}$ delete-relaxation heuristics.

### Module 9: Probabilistic Reasoning & Bayesian Networks
* **Representing Uncertainty:** Joint probability distributions and exponential state bloat.
* **Bayesian Network Factorization:**
  $$P(X_1, \dots, X_n) = \prod_{i=1}^n P(X_i \mid \text{Parents}(X_i))$$
* **d-Separation:** Conditional independence rules across Chains, Forks, and Colliders / V-structures (explaining away).
* **Inference Algorithms:**
  * Exact Inference: The Variable Elimination algorithm.
  * Approximate Inference: Rejection Sampling, Likelihood Weighting, and Markov Chain Monte Carlo (MCMC).

### Module 10: Sequential Decisions & Markov Decision Processes (MDPs)
* **MDP Formalism:** States $\mathcal{S}$, Actions $\mathcal{A}$, Transition Probabilities $P(s' \mid s, a)$, Reward Function $R(s, a, s')$, and Discount Factor $\gamma \in [0, 1)$.
* **The Bellman Optimality Equation:**
  $$V^*(s) = \max_{a \in \mathcal{A}} \sum_{s'} P(s' \mid s, a) \left[ R(s, a, s') + \gamma V^*(s') \right]$$
* **Dynamic Programming Solvers:**
  * Value Iteration: Contraction mapping in the infinity-norm guaranteeing unique convergence.
  * Policy Iteration: Alternating Policy Evaluation and Policy Improvement.

---

## 3. Roadmap 2: Statistical Machine Learning (ML-201) — 10 Modules

* **Code:** `ML-201` | **Duration:** 48 Hours | **Discipline:** Artificial Intelligence
* **Focus:** Statistical learning theory, linear/logistic regression, regularization geometry, kernel SVMs, decision trees, gradient boosting ensembles, clustering, and production Scikit-Learn workflows.

### Module 1: Vector Calculus & Matrix Decompositions
* **Calculus & Vector Derivatives:** Partial derivatives, Gradients ($\nabla f$), Jacobian Matrix ($J$), Hessian Matrix ($H$).
* **Linear Algebra & Matrix Decompositions:**
  * Vector spaces, inner products, $L_1, L_2, L_\infty$ norms.
  * Matrix Inverses, Determinants, Condition Numbers, and Rank.
  * Spectral Theorem, Eigenvalues & Eigenvectors: $A \mathbf{v} = \lambda \mathbf{v}$.
  * Singular Value Decomposition (SVD): $A = U \Sigma V^T = \sum_{i=1}^r \sigma_i \mathbf{u}_i \mathbf{v}_i^T$.

### Module 2: Statistical Parameter Estimation & Information Theory
* **Likelihood vs. Probability:** Probability density $P(x \mid \theta)$ vs. Likelihood function $L(\theta)$.
* **Maximum Likelihood Estimation (MLE):**
  $$\hat{\theta}_{\text{MLE}} = \arg\max_\theta \sum_{i=1}^n \log P(x_i \mid \theta)$$
  * Equivalence of MSE to Gaussian MLE with constant variance.
  * Equivalence of Binary Cross-Entropy to Bernoulli MLE.
* **Maximum A Posteriori (MAP):** Incorporating prior distributions $P(\theta)$ via Bayes' Theorem.
* **Information Theory:** Shannon Entropy $H(X)$, Kullback-Leibler (KL) Divergence $D_{\text{KL}}(P \parallel Q)$, and Mutual Information $I(X; Y)$.

### Module 3: Robust Data Preprocessing & Feature Engineering
* **Missing Value Imputation:** MCAR, MAR, and MNAR mechanisms; Median, KNN, and Iterative MICE imputation.
* **Scaling Geometry:**
  * StandardScaler (Z-score): $z = \frac{x - \mu}{\sigma}$.
  * RobustScaler: $x_{\text{robust}} = \frac{x - Q_2(x)}{Q_3(x) - Q_1(x)}$ (outlier-immune IQR scaling).
  * MinMaxScaler: $x_{\text{scaled}} = \frac{x - x_{\min}}{x_{\max} - x_{\min}}$.
* **Categorical Encoding:** One-Hot Encoding, Ordinal Encoding, and Target/Bayesian Encoding with cross-fold smoothing.
* **Feature Selection:** Variance Thresholding, Mutual Information, and Recursive Feature Elimination (RFE).
* **Data Leakage Prevention:** Strict isolation of transformer fitting to training folds.

### Module 4: Linear Regression Models & Numerical Optimization
* **Ordinary Least Squares (OLS):**
  * Analytical Normal Equations: $\mathbf{w}^* = (X^T X)^{-1} X^T \mathbf{y}$.
  * Computational complexity: $O(p^3)$ matrix inversion vs. $O(np)$ iterative gradient steps.
* **Optimization Algorithms:** Batch Gradient Descent (BGD), Mini-batch SGD, and Stochastic Gradient Descent.
* **Convexity & Condition Number:** Curvature analysis via Hessian eigenvalues $\lambda_{\max} / \lambda_{\min}$.
* **Gauss-Markov Theorem & Classical Assumptions:** Linearity, Homoscedasticity, Independence, and Normality of residuals.

### Module 5: Regularization Geometry: Ridge, Lasso & ElasticNet
* **Regularization Objective:**
  $$\mathcal{J}(w) = \frac{1}{2n} \|y - Xw\|_2^2 + \lambda \left[ \alpha \|w\|_1 + \frac{1 - \alpha}{2} \|w\|_2^2 \right]$$
* **Ridge Regression ($L_2$ Penalty):** Closed-form $\mathbf{w}^* = (X^T X + \lambda I)^{-1} X^T \mathbf{y}$; strictly guarantees matrix invertibility by shifting eigenvalues.
* **Lasso Regression ($L_1$ Penalty):** Diamond constraint geometry whose sharp vertices intersect loss contours on coordinate axes, inducing exact feature sparsity.
* **ElasticNet:** Convex combination balancing feature grouping ($L_2$) with exact sparsity ($L_1$).

### Module 6: Logistic Regression & Classification Diagnostics
* **Logistic Function & Odds Ratio:** $\sigma(z) = \frac{1}{1 + e^{-z}}$, mapping linear log-odds to calibrated probabilities.
* **Binary Cross-Entropy Loss:**
  $$\mathcal{L}_{\text{BCE}}(w) = -\frac{1}{n} \sum_{i=1}^n \left[ y_i \log \sigma(w^T x_i) + (1 - y_i) \log(1 - \sigma(w^T x_i)) \right]$$
* **Classification Evaluation Metrics:**
  * Confusion Matrix: TP, FP, TN, FN.
  * Precision, Recall, and the $F_1$-score harmonic mean.
  * Receiver Operating Characteristic (ROC-AUC) vs. Precision-Recall AUC (PR-AUC) under severe class imbalance.

### Module 7: Support Vector Machines & Non-Linear Kernels
* **Maximum Margin Hyperplane:** Maximizing geometric margin $\frac{2}{\|w\|}$.
* **Lagrangian Dual & KKT Conditions:** Support vectors satisfy $\alpha_i > 0$.
* **Soft-Margin SVM:** Slack variables $\xi_i$ and the regularization parameter $C$.
* **The Kernel Trick (Mercer's Theorem):**
  $$K(\mathbf{x}, \mathbf{x}') = \exp\left(-\gamma \|\mathbf{x} - \mathbf{x}'\|^2\right), \quad f(\mathbf{x}) = \sum_{i=1}^n \alpha_i y_i K(\mathbf{x}_i, \mathbf{x}) + b$$
* **Non-Linear Kernels:** Radial Basis Function (RBF / Gaussian), Polynomial, and Sigmoid kernels.

### Module 8: Decision Trees & Recursive Partitioning Algorithms
* **Recursive Binary Splitting:** Greedy top-down partitioning of feature space into hyper-rectangles.
* **Splitting Criteria:**
  * Shannon Entropy: $H(S) = -\sum p_k \log_2 p_k$.
  * Gini Impurity: $\text{Gini}(S) = 1 - \sum p_k^2$.
  * Information Gain: $\text{IG}(S, A) = H(S) - \sum \frac{|S_v|}{|S|} H(S_v)$.
* **Cost-Complexity Pruning:** $\mathcal{R}_\alpha(T) = \mathcal{R}(T) + \alpha |T|$, balancing misclassification rate against leaf count penalty.

### Module 9: Ensemble Architectures: Random Forests & Modern Gradient Boosting
* **The Bias-Variance Decomposition:** $\text{Error} = \text{Bias}^2 + \text{Variance} + \text{Irreducible Noise}$.
* **Bagging (Bootstrap Aggregation):** Independent parallel trees reducing ensemble variance by $\frac{1}{M}$.
* **Random Forests:** Decorrelating trees via random feature subspace sampling at each split.
* **Gradient Boosting Machines (GBM):**
  $$F_m(x) = F_{m-1}(x) + \eta h_m(x), \quad r_{im} = -\left[ \frac{\partial \mathcal{L}(y_i, F(x_i))}{\partial F(x_i)} \right]_{F = F_{m-1}}$$
* **Modern Frameworks:** XGBoost (second-order Taylor expansions), LightGBM (Histogram binning and GOSS), and CatBoost.

### Module 10: Unsupervised Clustering, Dimensionality Reduction & Production Pipelines
* **Clustering Algorithms:**
  * $K$-Means and $K$-Means++ distance-weighted probabilistic centroid initialization.
  * Hierarchical Agglomerative Clustering (Single, Complete, and Ward's minimum variance linkage).
  * DBSCAN: $\epsilon$-neighborhoods, MinPts, core points, border points, and noise filtering.
* **Dimensionality Reduction:** Principal Component Analysis (PCA) via covariance eigenvectors $X^T X$, $t$-SNE, and UMAP.
* **Production MLOps Pipelines:** Scikit-Learn `Pipeline`, `ColumnTransformer`, custom transformers, and atomic `joblib` serialization.

---

## 4. Roadmap 3: Deep Neural Networks and Architectures (DL-301) — 10 Modules

* **Code:** `DL-301` | **Duration:** 54 Hours | **Discipline:** Artificial Intelligence
* **Focus:** Backpropagation calculus, computational graphs, AdamW optimization, normalization layers, CNNs/ResNets, sequence models (LSTM), attention foundations, and PyTorch production patterns.

### Module 1: Perceptrons, MLPs & Universal Approximation
* **Artificial Neurons:** Affine transformation $z = \mathbf{w}^T \mathbf{x} + b$ followed by non-linear activation $\sigma(z)$.
* **Multi-Layer Perceptrons (MLPs):** Composition of affine maps and non-linearities: $\mathbf{h}^{(l)} = \sigma(W^{(l)} \mathbf{h}^{(l-1)} + \mathbf{b}^{(l)})$.
* **Universal Approximation Theorem (Cybenko 1989, Hornik 1991):** Finite sums of non-linear units are dense in continuous function spaces.
* **Why Depth Matters:** Exponential efficiency of deep compositional hierarchies over flat shallow networks.

### Module 2: Activation Functions & Gradient Saturation Dynamics
* **Sigmoid and Tanh Limitations:** Derivative bounded at $\sigma'(z) \le 0.25$, causing exponential gradient decay across deep layers.
* **Rectified Linear Unit (ReLU):** $f(x) = \max(0, x)$, non-saturating positive gradient, and the dying ReLU failure mode.
* **Modern Smooth Activations:** Leaky ReLU, Parametric ReLU (PReLU), Exponential Linear Unit (ELU).
* **Foundation Model Standards:**
  * Gaussian Error Linear Unit (GELU): $\text{GELU}(x) = x \cdot \Phi(x) = x \cdot P(X \le x)$.
  * Swish / SiLU: $f(x) = x \cdot \sigma(\beta x)$.

### Module 3: Computational Graphs & Reverse-Mode AutoDiff
* **Computational Graphs:** Directed Acyclic Graphs (DAGs) representing composite tensor operations.
* **Forward vs. Backward Mode:** Why reverse-mode automatic differentiation computes gradients for millions of parameters in a single pass.
* **Vector-Jacobian Products (VJPs):** Computing $\mathbf{v}^T J$ without instantiating dense $p \times p$ Jacobian matrices.
* **Analytical Chain Rule Derivation:**
  $$\delta^{(l)} = \left( (W^{(l+1)})^T \delta^{(l+1)} \right) \odot \sigma'(\mathbf{z}^{(l)}), \quad \frac{\partial \mathcal{L}}{\partial W^{(l)}} = \delta^{(l)} (\mathbf{h}^{(l-1)})^T$$

### Module 4: Loss Surfaces & Momentum Optimization
* **Loss Surfaces:** Non-convex landscapes, ill-conditioned ravines, and saddle points in high dimensions.
* **Stochastic Gradient Descent (SGD):** Mini-batch noise as an implicit regularizer.
* **Polyak Momentum:**
  $$\mathbf{v}_t = \beta \mathbf{v}_{t-1} + \eta \nabla \mathcal{L}(\theta_t), \quad \theta_{t+1} = \theta_t - \mathbf{v}_t$$
* **Nesterov Accelerated Gradient (NAG):** Look-ahead gradient evaluations dampening oscillations across ravines.

### Module 5: Adaptive Optimizers & Decoupled Weight Decay
* **RMSprop:** Running mean square normalization $s_t = \gamma s_{t-1} + (1-\gamma) (\nabla \mathcal{L})^2$.
* **Adam Optimizer:** First and second moment estimation with bias corrections:
  $$\hat{m}_t = \frac{m_t}{1 - \beta_1^t}, \quad \hat{v}_t = \frac{v_t}{1 - \beta_2^t}$$
* **AdamW (Decoupled Weight Decay):** Separating weight decay from adaptive gradient scaling:
  $$\theta_{t+1} = \theta_t - \eta_t \lambda \theta_t - \frac{\eta_t}{\sqrt{\hat{v}_t} + \epsilon} \hat{m}_t$$
* **Learning Rate Schedulers:** Linear warmup followed by Cosine Annealing decay.

### Module 6: Normalization Mechanics & Deep Layer Dynamics
* **Internal Covariate Shift:** Compounding distribution drift across deep stacks.
* **Batch Normalization (BatchNorm):** Normalizing across batch dimensions $(N, H, W)$ for computer vision.
* **Layer Normalization (LayerNorm):** Normalizing across feature dimensions $(C, H, W)$ per token independently:
  $$\text{LayerNorm}(\mathbf{x}) = \frac{\mathbf{x} - \mu}{\sqrt{\sigma^2 + \epsilon}} \odot \gamma + \beta$$
* **Root Mean Square Normalization (RMSNorm):** Removing mean computation for 10-15% throughput gains in modern LLMs.

### Module 7: Generalization & Regularization in Deep Networks
* **Overparameterization & Double Descent:** Interpolation threshold and benign overfitting.
* **Inverted Dropout:** Scaling surviving activations by $\frac{1}{1-p}$ during training for zero inference overhead:
  $$\tilde{\mathbf{h}} = \frac{\mathbf{m} \odot \mathbf{h}}{1 - p}, \quad \mathbf{m} \sim \text{Bernoulli}(1 - p)$$
* **Early Stopping & Weight Decay ($L_2$):** Preventing parameter magnitude explosion.
* **Label Smoothing:** Softening one-hot target distributions to prevent overconfident logit predictions.

### Module 8: Convolutional Neural Networks (CNNs) & Computer Vision
* **Spatial Locality & Translation Equivariance:** Replacing dense matrix multiplication with shared 2D filters.
* **2D Discrete Convolution:** Kernel filters, stride $s$, and padding $p$:
  $$W_{\text{out}} = \left\lfloor \frac{W_{\text{in}} - k + 2p}{s} \right\rfloor + 1$$
* **Receptive Field Calculations:** Exponential context expansion across deep layers.
* **Downsampling:** Max Pooling vs. Strided Convolutions.

### Module 9: Deep Residual Networks (ResNet) & Modern ConvNets
* **The Degradation Problem:** Plain deep networks suffering higher training error due to gradient attenuation.
* **Identity Skip Connections:**
  $$\mathbf{y} = \mathcal{F}(\mathbf{x}, \{W_i\}) + \mathbf{x}, \quad \frac{\partial \mathcal{L}}{\partial \mathbf{x}} = \frac{\partial \mathcal{L}}{\partial \mathbf{y}} \left( \frac{\partial \mathcal{F}}{\partial \mathbf{x}} + I \right)$$
* **Bottleneck Residual Blocks:** $1 \times 1$ conv dimension reduction $\to 3 \times 3$ conv $\to 1 \times 1$ conv expansion.
* **ResNet Architectures:** ResNet-50, 101, 152; ConvNeXt and comparison with Vision Transformers (ViT).

### Module 10: Recurrent Networks, Attention Foundations & Distributed PyTorch
* **Recurrent Architectures:** RNN hidden recurrence and Backpropagation Through Time (BPTT).
* **Long Short-Term Memory (LSTM):** Forget gate $f_t$, Input gate $i_t$, Candidate cell state $\tilde{C}_t$, Cell state update $C_t$, and Output gate $o_t$.
* **Attention Foundations:** Why attention ($O(1)$ path length) replaced recurrence ($O(N)$ path length).
* **Scaled Dot-Product Attention:**
  $$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{Q K^T}{\sqrt{d_k}}\right) V$$
* **Production PyTorch Ecosystem:** Automatic Mixed Precision (AMP `torch.cuda.amp.autocast`) and multi-GPU Distributed Data Parallel (`torch.nn.parallel.DistributedDataParallel` - DDP).

---

## 5. Roadmap 4: Generative AI and Foundation Models (GENAI-401) — 10 Modules

* **Code:** `GENAI-401` | **Duration:** 60 Hours | **Discipline:** Artificial Intelligence
* **Focus:** Modern decoder-only Transformer stacks, Rotary Positional Embeddings (RoPE), KV-Caching, parameter-efficient fine-tuning (LoRA/QLoRA), enterprise RAG, and direct preference alignment (DPO).

### Module 1: Modern Decoder-Only Transformers & Scaled Attention
* **Decoder-Only Architecture:** Causal autoregressive token prediction without cross-attention blocks.
* **Multi-Head Attention (MHA):** Independent projection heads for Queries, Keys, and Values.
* **Multi-Query Attention (MQA) & Grouped-Query Attention (GQA):**
  $$\text{GQA Head}_g = \text{Attention}\left(Q_g, K_{\lfloor g/G \rfloor}, V_{\lfloor g/G \rfloor}\right)$$
  Sharing KV heads across query head groups to slash inference memory bandwidth.

### Module 2: Positional Embeddings & Context Scaling
* **Absolute vs. Relative Positional Encodings:** Why absolute sinusoidal embeddings fail at long-context extrapolation.
* **Rotary Position Embedding (RoPE):** Rotating Query and Key vectors in 2D complex subspace:
  $$R_{\Theta, m}^d = \text{diag}\left( \begin{pmatrix} \cos m\theta_i & -\sin m\theta_i \\ \sin m\theta_i & \cos m\theta_i \end{pmatrix}_{i=1}^{d/2} \right)$$
* **Long-Context Window Extrapolation:** Attention with Linear Biases (ALiBi), RoPE frequency scaling, YaRN, and Dynamic NTK-aware interpolation.

### Module 3: Normalization, Activations & Architectural Innovations
* **Pre-LayerNorm Stability:** Normalizing inputs before attention and feedforward blocks to prevent gradient instability.
* **Root Mean Square Normalization (RMSNorm):**
  $$\text{RMSNorm}(\mathbf{x}) = \frac{\mathbf{x}}{\text{RMS}(\mathbf{x})} \odot \mathbf{g}, \quad \text{RMS}(\mathbf{x}) = \sqrt{\frac{1}{d} \sum_{i=1}^d x_i^2 + \epsilon}$$
* **SwiGLU Gated Feedforward Units:**
  $$\text{SwiGLU}(\mathbf{x}) = \left( \mathbf{x} W_{\text{gate}} \cdot \sigma(\mathbf{x} W_{\text{gate}}) \right) \odot (\mathbf{x} W_{\text{up}}) W_{\text{down}}$$
* **Mixture of Experts (MoE) Sparse Routing:** Top-2 gating across decoupled expert feedforward blocks.

### Module 4: Inference Optimization, KV-Caching & FlashAttention
* **Prefill vs. Decode Phase:** Compute-bound prompt ingestion vs. Memory bandwidth-bound token generation.
* **Autoregressive KV-Caching:** Preserving past Key and Value tensors to turn generation step complexity from $O(N^2)$ to $O(N)$.
* **KV-Cache Memory Footprint:**
  $$\text{VRAM}_{\text{KV}} = 2 \times 2 \times L \times H_{\text{KV}} \times D \times S \text{ bytes}$$
* **FlashAttention-1, 2, 3:** IO-aware SRAM tiling and online softmax computing exact attention with zero $N \times N$ HBM memory overhead.
* **PagedAttention & Continuous Batching:** Eliminating internal and external memory fragmentation in vLLM serving engines.

### Module 5: Pretraining Protocols, Tokenization & Chinchilla Scaling
* **Subword Tokenization:** Byte-Pair Encoding (BPE), WordPiece, and SentencePiece tokenizers.
* **Causal Language Modeling Loss:**
  $$\mathcal{L}_{\text{CLM}} = -\frac{1}{T} \sum_{t=1}^T \log P(x_t \mid x_{<t}; \theta)$$
* **Chinchilla Compute-Optimal Scaling Laws (Hoffmann et al. 2022):**
  $$\text{FLOPs} \approx 6ND, \quad D^* \approx 20 \times N$$
* **Data Curation:** MinHash LSH deduplication, heuristic quality filtering, synthetic data generation, and tokenizer training.

### Module 6: Parameter-Efficient Fine-Tuning: LoRA Architecture
* **The Intrinsic Rank Hypothesis:** Adaptation parameter changes lie in a low-dimensional manifold.
* **LoRA Decomposition Formulation:**
  $$W = W_0 + \Delta W = W_0 + \frac{\alpha}{r} (B \cdot A), \quad B \in \mathbb{R}^{d \times r}, \quad A \in \mathbb{R}^{r \times k}$$
* **Initialization Guarantees:** $B = 0$ and $A \sim \mathcal{N}(0, \sigma^2)$ guaranteeing $\Delta W = 0$ on step zero.
* **Zero Inference Latency:** Merging adapter weights directly into base model weights for production serving.

### Module 7: Quantization & 4-Bit Fine-Tuning (QLoRA)
* **Numerical Precision Formats:** FP32, FP16, BF16, INT8, and INT4.
* **NormalFloat4 (NF4) Distribution:** Information-theoretically optimal quantiles for normally distributed weights.
* **Double Quantization (DQ):** Quantizing quantization constants to save 0.37 bits per parameter.
* **Paged Optimizers:** Utilizing CUDA Unified Memory to page memory spikes to CPU RAM, enabling 70B parameter fine-tuning on a single 48GB GPU.

### Module 8: Enterprise Retrieval-Augmented Generation (RAG) Architecture
* **Structural & Semantic Chunking:** Preserving document syntax, Markdown headers, and code integrity.
* **Dense Bi-Encoder Embeddings:** Contextual semantic representations (BGE, text-embedding-3).
* **Vector Index Topologies:**
  * Hierarchical Navigable Small World (HNSW) graphs with logarithmic search complexity $O(\log N)$.
  * Inverted File with Product Quantization (IVF-PQ) for billion-scale vector indexes.
* **Multi-tenant Namespaces & Metadata Filtering:** Enforcing tenant isolation and document authorization.

### Module 9: Advanced Hybrid Retrieval & Cross-Encoder Re-Ranking
* **Sparse Lexical Search:** BM25 probabilistic relevance scoring for exact keywords, acronyms, and part numbers.
* **Reciprocal Rank Fusion (RRF):**
  $$\text{RRF}(d) = \sum_{m \in M} \frac{1}{k + r_m(d)}$$
* **Cross-Encoder Re-Ranking:** Full joint cross-attention scoring over top-25 candidate passages.
* **Advanced RAG Paradigms:** Hypothetical Document Embeddings (HyDE), Parent-Child Chunking, and Self-RAG retrieval critique.

### Module 10: Alignment & Preference Optimization: RLHF to DPO
* **Supervised Fine-Tuning (SFT):** Instruction-tuning on curated demonstration datasets.
* **Classical RLHF:** Training Bradley-Terry reward models followed by Proximal Policy Optimization (PPO) with KL penalties.
* **Direct Preference Optimization (DPO):**
  $$\mathcal{L}_{\text{DPO}}(\theta; \pi_{\text{ref}}) = -\mathbb{E}_{(x, y_w, y_l)} \left[ \log \sigma \left( \beta \log \frac{\pi_\theta(y_w \mid x)}{\pi_{\text{ref}}(y_w \mid x)} - \beta \log \frac{\pi_\theta(y_l \mid x)}{\pi_{\text{ref}}(y_l \mid x)} \right) \right]$$
  Eliminating the reward model and PPO instability by parameterizing reward directly via closed-form language model likelihoods.

---

## 6. Roadmap 5: Agentic AI and Autonomous Systems (AGENT-501) — 11 Modules

* **Code:** `AGENT-501` | **Duration:** 64 Hours | **Discipline:** Artificial Intelligence
* **Focus:** Cognitive agent loops, tool calling, Model Context Protocol (MCP), memory systems, multi-agent state graphs (LangGraph), sandboxed execution, and security against prompt injection.

### Module 1: The Autonomous Agent Paradigm & Agency Spectrum
* **Agency Spectrum:** Passive Chatbot $\to$ Deterministic Chains $\to$ Router Agents $\to$ Autonomous Multi-Agent Swarms.
* **Closed-Loop Cybernetic Systems:** Environmental grounding, sensory perception, and real-world tool execution.
* **Environmental Grounding:** File trees, terminal execution, browser DOMs, and database mutations.
* **Autonomy Levels:** Bounded autonomy and Human-in-the-Loop (HITL) authorization gates for high-risk operations.

### Module 2: The 4-Step Cognitive Loop (Perceive, Reason, Act, Reflect)
* **The Cognitive Cycle:**
  * **Perceive:** Multimodal observation ingestion, context normalization.
  * **Reason:** Goal decomposition, dependency analysis, subtask DAG formulation.
  * **Act:** Structured tool calling conforming strictly to JSON schemas.
  * **Reflect:** Outcome evaluation, error analysis, and dynamic replanning.
* **Exception Recovery:** Handling tool crashes, timeouts, and network rate limits dynamically.

### Module 3: Prompt Engineering & Deterministic Trajectory Directives
* **Strict Control Prompts:** Why agent prompts require 10x stricter constraints than conversational chatbots.
* **Role Specification & Operational Boundaries:** Defining permissible domains and explicit non-goals.
* **Deterministic Delimiters:** Mandating XML tags (`<thought>`, `<action>`, `<parameter>`) or constrained JSON outputs.
* **Anti-Hallucination Directives:** Requiring agents to declare missing parameters rather than fabricating arguments.
* **Fail-Fast Directives:** Hard limits on consecutive failed tool executions.

### Module 4: Tool Taxonomy & Schema Validation
* **Function Calling Protocols:** OpenAI Tool Calling schema, Anthropic Tool Use, Gemini Function Calling.
* **JSON Schema Enforcement:** Enums, types, required properties, and Pydantic validation models.
* **Action Classification:** Read-only (safe for automated execution) vs. State-mutating (requiring confirmation).
* **Semantic Descriptions:** Engineering optimal docstrings that serve as clear routing signals for model deliberation.
* **Constrained Decoding:** Grammar-based sampling (Outlines, Jsonformer) guaranteeing valid JSON output.

### Module 5: Model Context Protocol (MCP) Standard
* **Open Architecture:** Standardizing agent-to-tool interoperability and eliminating proprietary tool wrappers.
* **Core Roles:**
  * **MCP Host:** The runtime application/IDE managing agent workflows.
  * **MCP Client:** The protocol adapter maintaining active communication sessions.
  * **MCP Server:** Lightweight process exposing resources, tools, and prompts.
* **Transports:** Standard Input/Output (`stdio`) for local process IPC; Server-Sent Events (`SSE` over HTTP) for remote distributed microservices.
* **Implementation:** Developing production MCP servers using the official Python FastMCP SDK.

### Module 6: Tiered Agent Memory Architectures & Context Management
* **The Three Memory Tiers:**
  * **Working Memory:** Active context window scratchpad and immediate trajectory history.
  * **Episodic Memory:** Vector-indexed historical action-observation-reflection execution traces.
  * **Semantic Memory:** Knowledge graphs, world ground truths, and API specifications.
* **Context Eviction Strategies:** Recursive rolling summarization, hierarchical state compression, and token budget management.

### Module 7: Advanced Cognitive Reasoning Patterns
* **ReAct (Reason + Act):** Interleaving `Thought -> Action -> Observation -> Thought` cycles for iterative exploration.
* **Planner-Executor:** Generating complete directed acyclic graphs (DAGs) followed by worker execution and dynamic replanning.
* **Tree-of-Thoughts (ToT):** Tree search over intermediate problem steps with heuristic branch pruning and backtracking.
* **Reflexion:** Verbal reinforcement learning using self-critique buffers across trial attempts.

### Module 8: Graph-Based State Machines & LangGraph Orchestration
* **Cyclic State Machines:** Overcoming the limitations of linear DAG chains by supporting loops and conditional transitions.
* **LangGraph Core Components:** Typed State schemas, Nodes (functions), and Edges (transitions).
* **Checkpointing & State Persistence:** Serializing execution state to SQLite or PostgreSQL after every node.
* **Time-Travel Debugging:** Rewinding, modifying, and resuming historical graph states.
* **Human-in-the-Loop (HITL):** Pausing graph execution at critical breakpoint edges for human approval.

### Module 9: Multi-Agent Collaboration Topologies & Swarms
* **Role Specialization:** Researcher, Architect, Coder, Tester, and Reviewer personas with uncluttered context windows.
* **Supervisor-Worker Pattern:** Central orchestrator dynamically routing subtasks to specialized subordinate workers.
* **Hierarchical Agent Teams:** Multi-tiered managers coordinating sub-swarms.
* **Peer Debate & Consensus:** Multi-agent critique loops eliminating hallucinations before final delivery.
* **Communication Paradigms:** Message passing vs. Shared blackboard state schemas.

### Module 10: Production Tool Sandboxing & Execution Isolation
* **Execution Vulnerabilities:** Fork bombs, resource exhaustion, secret exfiltration, and host takeover.
* **Docker Sandboxing:** Unprivileged containers, cgroup resource limits (CPU, RAM ceilings), and read-only filesystems.
* **MicroVM Sandboxes:** AWS Firecracker and E2B cloud microVMs with sub-100ms startup times.
* **Network Egress Isolation:** Restricting sandbox containers to `--network none` or domain allowlists, blocking cloud metadata services (`169.254.169.254`).

### Module 11: Security Engineering, Prompt Injection Defense & Observability
* **Indirect Prompt Injection:** Threat modeling when reading untrusted external data (web pages, customer emails, PDFs).
* **Attack Vectors:** Hidden zero-font instructions, markdown image exfiltration, and tool parameter hijacking.
* **Defense-in-Depth:**
  * Strict XML delimiter isolation (`<untrusted_data>`).
  * Secondary dual-LLM security auditor vetting proposed tool calls against original user intent.
* **Agent Observability:** Distributed tracing with OpenTelemetry, OpenLLMetry, LangSmith, and Arize Phoenix.
* **Key Performance Indicators (KPIs):** Goal Completion Rate (GCR), Trajectory Efficiency, Tool Accuracy, and Token Unit Cost.

---

## 7. Future Horizons: Upcoming Engineering Tracks

STARVYON Learn is engineered to scale across subsequent engineering disciplines beyond artificial intelligence:

### Upcoming Track 2: Systems Architecture & High-Performance Infrastructure
* **Track Code:** `TRACK-SYS` | **Level:** Advanced | **Estimated Hours:** 180h
* **Planned Courses:**
  * `SYS-101`: GPU Cluster Architecture, CUDA Kernels, and Interconnects (SM anatomy, HBM3, InfiniBand).
  * `SYS-201`: High-Throughput Model Serving with vLLM and TensorRT-LLM (PagedAttention, speculative decoding, Triton).
  * `SYS-301`: Data, Tensor, and Pipeline Parallelism for Trillion-Parameter Models (Megatron-LM, DeepSpeed ZeRO-3).

### Upcoming Track 3: Data Systems & Real-Time Streaming Infrastructure
* **Track Code:** `TRACK-DATA` | **Level:** Intermediate to Advanced | **Estimated Hours:** 140h
* **Planned Courses:**
  * `DAT-101`: Event Streaming Architectures and Distributed Logs (Apache Kafka, EOS semantics, CDC).
  * `DAT-201`: High-Dimension Vector Indexing, HNSW Sharding, and Hybrid Retrieval (HNSW graph topology, PQ).
  * `DAT-301`: Transactional Storage Formats and Continuous Feature Pipelines (Apache Iceberg, Apache Flink, online feature stores).
