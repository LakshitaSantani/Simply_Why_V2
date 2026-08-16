/**
 * SIMPLYWHY — ROOT CAUSE INTELLIGENCE
 * Unified Interactive Investigation Engine & Visualizations (V3 Consolidation)
 */

/* ---------- SUPABASE INITIALIZATION ---------- */
const SUPABASE_URL = "https://zicsyeqpeovivqneexzp.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_8kmrh0zIz1IK02zO5NgoFw_7V1NNQ6d";
let supabaseClient = null;

try {
  if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch (err) {
  console.warn("Supabase init error:", err);
}

/* ---------- WAITLIST FORM SUBMISSION ---------- */
async function handleWaitlistSubmit(e) {
  e.preventDefault();
  const emailInput = document.getElementById("w-email");
  const roleInput = document.getElementById("w-role");
  const email = emailInput ? emailInput.value.trim() : "";
  const role = roleInput ? roleInput.value.trim() : "";
  const submitBtn = document.getElementById("waitlist-btn") || e.target.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn ? submitBtn.innerText : "Run your first diagnosis →";

  if (!email || !email.includes("@")) return;

  if (submitBtn) {
    submitBtn.innerText = "Securing early access...";
    submitBtn.disabled = true;
  }

  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('waitlist')
        .insert([{ email: email, role: role }]);

      if (error) {
        console.error('Supabase Error:', error);
        alert('Notice: ' + (error.message || 'Could not connect to database.'));
        if (submitBtn) {
          submitBtn.innerText = originalBtnText;
          submitBtn.disabled = false;
        }
        return;
      }
    } catch (err) {
      console.error('Supabase execution error:', err);
    }
  }

  // Render clean success state
  const container = document.getElementById("waitlist-container");
  if (container) {
    container.innerHTML = `
      <div class="waitlist-success" style="padding:24px;border-radius:12px;background:rgba(0,245,160,0.05);border:1px solid rgba(0,245,160,0.3);text-align:center;">
        <div style="font-size:1.6rem;color:var(--accent);margin-bottom:8px;">✓</div>
        <h3 style="font-size:1.2rem;font-weight:700;color:var(--text-primary);margin-bottom:6px;">You're on the priority list.</h3>
        <p style="font-size:0.88rem;color:var(--text-secondary);">Spot reserved for <strong style="color:var(--text-primary);">${email}</strong>. We'll send your diagnostic credentials as early access rolls out.</p>
        <div style="font-family:var(--font-mono);font-size:0.75rem;color:var(--accent);margin-top:12px;">QUEUE POSITION #SW-${Math.floor(1000 + Math.random() * 9000)}</div>
      </div>
    `;
  }
}

/* ==========================================================================
   INITIALIZATION ON DOM LOAD
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  initNavbarScroll();
  initScrollReveals();
  initProductHealthSparklines();
  initHeroVizCanvas();
  initSignalNetworkCanvas();
  initEvidenceCanvas();
  initRecoveryCanvas();
  initLiveTelemetryTicker();
});

/* ---------- NAVBAR SCROLL ---------- */
function initNavbarScroll() {
  const nav = document.getElementById("main-nav");
  if (!nav) return;
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 30);
  });
}

/* ---------- SCROLL REVEALS ---------- */
function initScrollReveals() {
  const reveals = document.querySelectorAll(".reveal, .reveal-scale");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

  reveals.forEach(el => observer.observe(el));
}

/* ==========================================================================
   1. HERO PRODUCT HEALTH SPARKLINES & VIZ
   ========================================================================== */
let activeHeroMetric = 'checkout';

function initProductHealthSparklines() {
  drawSparkline('spark-conv', [22, 21, 20, 19.5, 19, 18.4], '#EF4444');
  drawSparkline('spark-checkout', [12, 14, 15, 18, 25, 31.2], '#EF4444');
  drawSparkline('spark-rage', [8, 9, 11, 16, 28, 42.1], '#F59E0B');
}

function drawSparkline(canvasId, dataPoints, strokeColor) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const width = 90;
  const height = 24;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  const min = Math.min(...dataPoints) * 0.9;
  const max = Math.max(...dataPoints) * 1.1;
  const stepX = (width - 8) / (dataPoints.length - 1);

  ctx.clearRect(0, 0, width, height);

  // Gradient fill under line
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, strokeColor === '#EF4444' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(245, 158, 11, 0.25)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0.0)');

  ctx.beginPath();
  dataPoints.forEach((val, i) => {
    const x = 4 + i * stepX;
    const y = height - 4 - ((val - min) / (max - min)) * (height - 8);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 1.8;
  ctx.stroke();

  ctx.lineTo(4 + (dataPoints.length - 1) * stepX, height);
  ctx.lineTo(4, height);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  const lastX = 4 + (dataPoints.length - 1) * stepX;
  const lastY = height - 4 - ((dataPoints[dataPoints.length - 1] - min) / (max - min)) * (height - 8);
  ctx.fillStyle = strokeColor;
  ctx.shadowColor = strokeColor;
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.arc(lastX, lastY, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
}

function handleMetricHover(metricType) {
  const rows = document.querySelectorAll('.viz-metric-row');
  rows.forEach(row => {
    row.classList.toggle('active-highlight', row.getAttribute('data-metric') === metricType);
  });
  activeHeroMetric = metricType;
}

function handleMetricLeave() {
  handleMetricHover('checkout');
}

function initHeroVizCanvas() {
  const canvas = document.getElementById("vizCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let t = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  }
  resize();
  window.addEventListener("resize", resize);

  function draw() {
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    // Draw baseline grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
    ctx.lineWidth = 1;
    for (let y = 15; y < h; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Sine wave telemetry
    ctx.beginPath();
    for (let x = 0; x <= w; x += 3) {
      const dropoffWeight = x > w * 0.5 ? Math.sin((x - w * 0.5) / (w * 0.5) * Math.PI) * 16 : 0;
      const y = h * 0.5 + Math.sin((x * 0.04) + t) * 8 + dropoffWeight;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "rgba(239, 68, 68, 0.7)";
    ctx.lineWidth = 2;
    ctx.stroke();

    t += 0.04;
    requestAnimationFrame(draw);
  }
  draw();
}

/* ==========================================================================
   2. MASTER INTERACTIVE INVESTIGATION CONTROLLER ("LET'S FIND OUT WHY")
   ========================================================================== */
let currentInvestigationStep = 0;
let isAutoInvestigating = false;
let autoTimer = null;

function setInvestigationStep(stepIndex) {
  currentInvestigationStep = stepIndex;

  // Update tabs
  const tabs = document.querySelectorAll(".inv-tab");
  tabs.forEach((tab, idx) => {
    tab.classList.toggle("active", idx === stepIndex);
  });

  // Update view panes
  for (let i = 0; i <= 6; i++) {
    const pane = document.getElementById(`inv-view-${i}`);
    if (pane) {
      pane.classList.toggle("active", i === stepIndex);
    }
  }

  // Trigger tab-specific initialization & canvas redrawing
  if (stepIndex === 1) {
    if (typeof resizeSignalCanvas === 'function') resizeSignalCanvas();
  } else if (stepIndex === 2) {
    renderWhyLayer(currentWhyLayerIndex);
  } else if (stepIndex === 3) {
    if (typeof resizeEvidenceCanvas === 'function') resizeEvidenceCanvas();
  } else if (stepIndex === 5) {
    setTimeout(runSessionReplayAnimation, 200);
  } else if (stepIndex === 6) {
    if (typeof resizeRecoveryCanvas === 'function') resizeRecoveryCanvas();
    const confFill = document.getElementById("confidence-fill");
    if (confFill) confFill.style.width = "94%";
  }
}

function startMasterInvestigation() {
  const invSection = document.getElementById("investigation");
  if (invSection) {
    invSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  setInvestigationStep(0);
}

function runAutomatedInvestigation() {
  const btn = document.getElementById("btn-auto-investigate");
  if (isAutoInvestigating) {
    clearInterval(autoTimer);
    isAutoInvestigating = false;
    if (btn) btn.innerHTML = `<span class="bolt-icon">⚡</span> Run Full Investigation`;
    return;
  }

  isAutoInvestigating = true;
  if (btn) {
    btn.classList.add("is-running");
    btn.innerHTML = `<span>⏳</span> Investigating...`;
  }

  let step = 0;
  setInvestigationStep(step);

  autoTimer = setInterval(() => {
    step++;
    if (step <= 6) {
      setInvestigationStep(step);
    } else {
      clearInterval(autoTimer);
      isAutoInvestigating = false;
      if (btn) {
        btn.classList.remove("is-running");
        btn.innerHTML = `<span class="bolt-icon">✓</span> Investigation Complete`;
      }
    }
  }, 2200);
}

/* ==========================================================================
   STAGE 2: SIGNAL NETWORK TOPOLOGY CANVAS
   ========================================================================== */
let signalCanvasResize = null;

function initSignalNetworkCanvas() {
  const canvas = document.getElementById("signalNetworkCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let t = 0;

  function resize() {
    const parent = canvas.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  }
  signalCanvasResize = resize;
  resize();
  window.addEventListener("resize", resize);

  const nodes = [
    { id: "support", x: 0.5, y: 0.16, color: "#8B5CF6" },
    { id: "session", x: 0.2, y: 0.40, color: "#38BDF8" },
    { id: "funnel", x: 0.8, y: 0.40, color: "#F59E0B" },
    { id: "deployments", x: 0.32, y: 0.82, color: "#F43F5E" },
    { id: "errors", x: 0.68, y: 0.82, color: "#EF4444" }
  ];
  const core = { x: 0.5, y: 0.48 };

  function draw() {
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    const corePx = { x: core.x * w, y: core.y * h };

    nodes.forEach((n, idx) => {
      const nodePx = { x: n.x * w, y: n.y * h };

      // Link line
      ctx.beginPath();
      ctx.moveTo(nodePx.x, nodePx.y);
      ctx.lineTo(corePx.x, corePx.y);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Traveling photon particle
      const progress = ((t * 0.8 + idx * 0.2) % 1);
      const px = nodePx.x + (corePx.x - nodePx.x) * progress;
      const py = nodePx.y + (corePx.y - nodePx.y) * progress;

      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fillStyle = n.color;
      ctx.shadowColor = n.color;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    t += 0.015;
    requestAnimationFrame(draw);
  }
  draw();
}

function resizeSignalCanvas() {
  if (signalCanvasResize) signalCanvasResize();
}

function handleSignalNodeHover(sourceKey) {
  const hubs = document.querySelectorAll(".sig-node-hub");
  hubs.forEach(hub => {
    const isTarget = hub.getAttribute("data-source") === sourceKey;
    hub.classList.toggle("is-active", isTarget);
    hub.classList.toggle("is-dimmed", !isTarget);
  });
}

function handleSignalNodeLeave() {
  const hubs = document.querySelectorAll(".sig-node-hub");
  hubs.forEach(hub => {
    hub.classList.remove("is-active", "is-dimmed");
  });
}

function triggerSignalCorrelationDemo() {
  const btn = document.getElementById("btn-correlate-signals");
  const coreStatus = document.getElementById("core-status-text");
  if (btn) btn.classList.add("is-active");
  if (coreStatus) coreStatus.textContent = "SYNTHESIZING (94%)";

  const hubs = document.querySelectorAll(".sig-node-hub");
  hubs.forEach(hub => hub.classList.add("is-active"));

  setTimeout(() => {
    if (coreStatus) coreStatus.textContent = "CORRELATED";
  }, 1200);
}

/* ==========================================================================
   STAGE 3: WHY → WHY → WHY DRILLDOWN ENGINE
   ========================================================================== */
const whyLayers = [
  {
    stepNum: "01",
    phase: "01 · SYMPTOM ISOLATION",
    question: "WHY DID REVENUE DROP?",
    depthLabel: "DEPTH LEVEL 01 / 04",
    summary: "Revenue trajectory fell below baseline across the primary payment funnel.",
    evidenceList: [
      { tag: "SIGNAL", tagClass: "tag-signal", text: "Daily GMV run-rate dropped from $142K → $99.2K at 10:18 AM" },
      { tag: "IMPACT", tagClass: "tag-impact", text: "Isolated to new subscription checkout flow" }
    ],
    hint: "Click to correlate behavioral signals →",
    isFinal: false
  },
  {
    stepNum: "02",
    phase: "02 · FUNNEL ANALYSIS",
    question: "WHY DID CHECKOUT CONVERSION DROP?",
    depthLabel: "DEPTH LEVEL 02 / 04",
    summary: "Step 1 & Step 2 remained constant. Step 3 (Payment Form) experienced a 31.2% dropoff spike.",
    evidenceList: [
      { tag: "FUNNEL", tagClass: "tag-funnel", text: "Cart → Checkout: 94% (Normal baseline)" },
      { tag: "FUNNEL", tagClass: "tag-funnel", text: "Checkout → Form Submit: 47% (Anomaly -21pts)" },
      { tag: "SUPPORT", tagClass: "tag-support", text: "283 customer tickets: 'Payment submit button unresponsive'" }
    ],
    hint: "Click to isolate user cohort →",
    isFinal: false
  },
  {
    stepNum: "03",
    phase: "03 · COHORT ISOLATION",
    question: "WHY ARE SAFARI USERS FAILING?",
    depthLabel: "DEPTH LEVEL 03 / 04",
    summary: "Cross-cohort dimensional analysis isolates 88% of checkout failures to Safari macOS & iOS.",
    evidenceList: [
      { tag: "COHORT", tagClass: "tag-cohort", text: "Chrome & Firefox completion: 74% (Normal)" },
      { tag: "COHORT", tagClass: "tag-cohort", text: "Safari completion: 18.2% (Critical Failure)" },
      { tag: "GIT", tagClass: "tag-git", text: "Deploy #2841 pushed at 10:12 AM by @payments-core" }
    ],
    hint: "Click to isolate root cause verdict →",
    isFinal: false
  },
  {
    stepNum: "04",
    phase: "04 · ROOT CAUSE FOUND",
    question: "PAYMENT VALIDATION LOOP",
    depthLabel: "DEPTH LEVEL 04 / 04 (VERIFIED)",
    summary: "Payment validation loop introduced in deployment #2841 is affecting Safari users.",
    evidenceList: [
      { tag: "VERIFIED", tagClass: "tag-verified", text: "Root cause: Regex validation recursion on Safari autofill event" },
      { tag: "IMPACT", tagClass: "tag-impact", text: "$42,800 revenue at risk across 1,842 affected users" }
    ],
    hint: "Investigation complete · Click to restart ↺",
    isFinal: true
  }
];

let currentWhyLayerIndex = 0;
let isWhyTransitioning = false;

function goToWhyLayer(targetIndex, e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  if (isWhyTransitioning || targetIndex === currentWhyLayerIndex) return;
  renderWhyLayer(targetIndex);
}

function advanceWhyLayer(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  if (isWhyTransitioning) return;
  const nextIndex = (currentWhyLayerIndex < whyLayers.length - 1) ? currentWhyLayerIndex + 1 : 0;
  renderWhyLayer(nextIndex);
}

function renderWhyLayer(index) {
  isWhyTransitioning = true;
  currentWhyLayerIndex = index;
  const layer = whyLayers[index];

  const panel = document.getElementById("why-central-panel");
  const depthLabel = document.getElementById("why-depth-label");
  const badge = document.getElementById("why-badge");
  const question = document.getElementById("why-question");
  const summary = document.getElementById("why-summary");
  const evidenceGrid = document.getElementById("why-evidence-grid");
  const hint = document.getElementById("why-action-hint");
  const confPill = document.getElementById("why-confidence-pill");
  const pills = document.querySelectorAll(".why-pill");

  if (panel) panel.style.opacity = "0.4";

  // Update pills
  pills.forEach((pill, i) => {
    pill.classList.toggle("active", i === index);
  });

  setTimeout(() => {
    if (depthLabel) depthLabel.textContent = layer.depthLabel;
    if (badge) badge.textContent = layer.phase;
    if (question) question.textContent = layer.question;
    if (summary) summary.textContent = layer.summary;

    if (confPill) {
      confPill.style.display = layer.isFinal ? "inline-flex" : "none";
    }

    if (hint) {
      hint.textContent = layer.hint;
    }

    if (evidenceGrid) {
      evidenceGrid.innerHTML = layer.evidenceList.map(ev => `
        <div class="why-evidence-chip">
          <span class="chip-tag ${ev.tagClass}">${ev.tag}</span>
          <span class="chip-desc">${ev.text}</span>
        </div>
      `).join("");
    }

    if (panel) panel.style.opacity = "1";
    isWhyTransitioning = false;
  }, 120);
}

/* ==========================================================================
   STAGE 4: NEURAL EVIDENCE GRAPH CANVAS
   ========================================================================== */
let evidenceMode = 'all';
let evidenceCanvasResize = null;

const evidenceNodes = [
  { id: 'safari', label: 'Safari Users', type: 'frontend', x: 0.18, y: 0.28, radius: 24, isCausal: true },
  { id: 'ios', label: 'iOS Cohort', type: 'frontend', x: 0.18, y: 0.72, radius: 20, isCausal: false },
  { id: 'checkout', label: 'Checkout Failures', type: 'frontend', x: 0.42, y: 0.35, radius: 28, isCausal: true },
  { id: 'dropoff', label: 'Dropoff Spike', type: 'frontend', x: 0.40, y: 0.78, radius: 20, isCausal: false },
  { id: 'validation', label: 'Payment Validation Loop', type: 'backend', x: 0.68, y: 0.38, radius: 30, isCausal: true },
  { id: 'regex', label: 'Autofill Regex Bug', type: 'backend', x: 0.65, y: 0.78, radius: 22, isCausal: false },
  { id: 'deploy', label: 'Deployment #2841', type: 'git', x: 0.88, y: 0.42, radius: 26, isCausal: true },
  { id: 'pr', label: '@payments-core PR', type: 'git', x: 0.88, y: 0.80, radius: 20, isCausal: false }
];

const evidenceEdges = [
  { from: 'safari', to: 'checkout', isCausal: true },
  { id: 'ios_chk', from: 'ios', to: 'checkout', isCausal: false },
  { id: 'chk_drop', from: 'checkout', to: 'dropoff', isCausal: false },
  { from: 'checkout', to: 'validation', isCausal: true },
  { from: 'validation', to: 'deploy', isCausal: true },
  { id: 'val_reg', from: 'validation', to: 'regex', isCausal: false },
  { id: 'dep_pr', from: 'deploy', to: 'pr', isCausal: false }
];

function initEvidenceCanvas() {
  const canvas = document.getElementById("evidenceCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  function resize() {
    const parent = canvas.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  }
  evidenceCanvasResize = resize;
  resize();
  window.addEventListener("resize", resize);

  function draw() {
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    // Edges
    evidenceEdges.forEach(edge => {
      const src = evidenceNodes.find(n => n.id === edge.from);
      const dst = evidenceNodes.find(n => n.id === edge.to);
      if (!src || !dst) return;

      const isHighlight = evidenceMode === 'all' || (evidenceMode === 'causal' && edge.isCausal);
      ctx.beginPath();
      ctx.moveTo(src.x * w, src.y * h);
      ctx.lineTo(dst.x * w, dst.y * h);
      ctx.strokeStyle = isHighlight ? (edge.isCausal ? '#00F5A0' : 'rgba(255,255,255,0.12)') : 'rgba(255,255,255,0.03)';
      ctx.lineWidth = edge.isCausal && isHighlight ? 2.5 : 1;
      ctx.stroke();
    });

    // Nodes
    evidenceNodes.forEach(n => {
      const isHighlight = evidenceMode === 'all' || (evidenceMode === 'causal' && n.isCausal);
      const x = n.x * w;
      const y = n.y * h;

      ctx.beginPath();
      ctx.arc(x, y, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = isHighlight ? (n.isCausal ? 'rgba(0,245,160,0.15)' : 'rgba(255,255,255,0.05)') : 'rgba(255,255,255,0.02)';
      ctx.strokeStyle = isHighlight ? (n.isCausal ? '#00F5A0' : 'rgba(255,255,255,0.2)') : 'rgba(255,255,255,0.05)';
      ctx.lineWidth = n.isCausal && isHighlight ? 2 : 1;
      ctx.fill();
      ctx.stroke();

      // Label
      ctx.fillStyle = isHighlight ? '#FAFAFA' : '#52525B';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(n.label, x, y + n.radius + 14);
    });

    requestAnimationFrame(draw);
  }
  draw();
}

function setEvidenceMode(mode) {
  evidenceMode = mode;
  const btnAll = document.getElementById("ev-tab-all");
  const btnCausal = document.getElementById("ev-tab-causal");
  if (btnAll) btnAll.classList.toggle("active", mode === "all");
  if (btnCausal) btnCausal.classList.toggle("active", mode === "causal");
}

function resizeEvidenceCanvas() {
  if (evidenceCanvasResize) evidenceCanvasResize();
}

/* ==========================================================================
   STAGE 5: INCIDENT TIMELINE REPLAY
   ========================================================================== */
function replayIncidentSequence() {
  const events = document.querySelectorAll(".timeline-event");
  events.forEach((ev, idx) => {
    ev.style.opacity = "0.3";
    setTimeout(() => {
      ev.style.opacity = "1";
      ev.style.transition = "opacity 0.3s ease";
    }, idx * 250);
  });
}

/* ==========================================================================
   STAGE 6: SIMULATED BROWSER SESSION REPLAY
   ========================================================================== */
function runSessionReplayAnimation() {
  const cursor = document.getElementById("virtual-cursor");
  const pulse = document.getElementById("cursor-pulse");
  const btn = document.getElementById("replay-submit-btn");
  const spinner = document.getElementById("btn-spinner");
  const alertBox = document.getElementById("rage-click-alert");

  if (!cursor || !btn) return;

  // Reset
  cursor.style.top = "60px";
  cursor.style.left = "40px";
  if (alertBox) alertBox.classList.remove("visible");
  btn.classList.remove("btn-stuck", "btn-clicked");
  if (spinner) spinner.style.display = "none";

  // Step 1: Cursor moves to payment submit button
  setTimeout(() => {
    const btnRect = btn.getBoundingClientRect();
    const parentRect = btn.parentElement.getBoundingClientRect();
    cursor.style.top = `${btn.offsetTop + 18}px`;
    cursor.style.left = `${btn.offsetLeft + btn.offsetWidth / 2}px`;
  }, 400);

  // Step 2: Click pulse and spinner stall
  setTimeout(() => {
    if (pulse) {
      pulse.classList.remove("pulse-active");
      void pulse.offsetWidth;
      pulse.classList.add("pulse-active");
    }
    btn.classList.add("btn-clicked");
    if (spinner) spinner.style.display = "inline-block";
  }, 1100);

  // Step 3: Rapid rage click simulation
  setTimeout(() => {
    btn.classList.add("btn-stuck");
    if (alertBox) alertBox.classList.add("visible");
  }, 1800);
}

/* ==========================================================================
   STAGE 7: RECOVERY SIMULATION ENGINE & TRAJECTORY CANVAS
   ========================================================================== */
let recoveryCanvasResize = null;
let recoveryProgress = 0;
let isSimulatingRecovery = false;

function initRecoveryCanvas() {
  const canvas = document.getElementById("recoveryCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  function resize() {
    const parent = canvas.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  }
  recoveryCanvasResize = resize;
  resize();
  window.addEventListener("resize", resize);

  function draw() {
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    // Baseline horizontal dashed line
    ctx.beginPath();
    ctx.moveTo(10, h * 0.75);
    ctx.lineTo(w - 10, h * 0.75);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Curve
    ctx.beginPath();
    ctx.moveTo(10, h * 0.75);
    const endY = h * 0.75 - (recoveryProgress * (h * 0.5));
    ctx.bezierCurveTo(w * 0.35, h * 0.75, w * 0.65, endY, w - 10, endY);
    ctx.strokeStyle = recoveryProgress > 0.05 ? "#00F5A0" : "rgba(255,255,255,0.2)";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    requestAnimationFrame(draw);
  }
  draw();
}

function resizeRecoveryCanvas() {
  if (recoveryCanvasResize) recoveryCanvasResize();
}

function runRecoverySimulation() {
  if (isSimulatingRecovery) return;
  isSimulatingRecovery = true;

  const convVal = document.getElementById("sim-conversion-val");
  const revVal = document.getElementById("sim-revenue-val");
  const statusPill = document.getElementById("recovery-status-pill");

  let step = 0;
  const totalSteps = 40;

  const interval = setInterval(() => {
    step++;
    const t = step / totalSteps;
    recoveryProgress = t;

    // Increment conversion 47% -> 68%
    const currentConv = Math.round(47 + (68 - 47) * t);
    if (convVal) convVal.textContent = `${currentConv}%`;

    // Increment revenue $0 -> $42,800
    const currentRev = Math.round(42800 * t);
    if (revVal) revVal.textContent = `$${currentRev.toLocaleString()}`;

    if (step >= totalSteps) {
      clearInterval(interval);
      isSimulatingRecovery = false;
      if (convVal) convVal.classList.add("recovered");
      if (revVal) revVal.classList.add("recovered");
      if (statusPill) statusPill.classList.add("visible");
    }
  }, 30);
}

/* ==========================================================================
   5. WHAT ELSE CAN IT FIND? — USE CASES DATA SWITCHER
   ========================================================================== */
const USE_CASES_DATA = {
  signups: {
    badge: "AUTHENTICATION DIAGNOSIS",
    conf: "96% CONFIDENCE",
    symptom: "Signup completion fell 28.4% within 90 seconds of release",
    cause: "OAuth callback domain whitelist mismatch in deployment #2839",
    signals: "Google OAuth 400 errors + Form abandonments + Commit #2839 auth secret update",
    action: "Revert OAuth client configuration in deployment #2839 and refresh callback domains"
  },
  support: {
    badge: "ONBOARDING FLOW DIAGNOSIS",
    conf: "92% CONFIDENCE",
    symptom: "Support ticket volume surged 410% on invitation links",
    cause: "Workspace invitation JWT token expiration bug in deployment #2835",
    signals: "401 Token Expired logs + Zendesk keyword 'invite broken' + Git commit #2835",
    action: "Deploy JWT expiration tolerance patch and reissue pending workspace invitations"
  },
  revenue: {
    badge: "PAYMENT PROCESSING DIAGNOSIS",
    conf: "95% CONFIDENCE",
    symptom: "Daily GMV fell $34K across European localized checkout tiers",
    cause: "Currency rounding overflow on localized VAT calculation engine",
    signals: "Stripe API 422 Unprocessable Entity + EUR checkout dropoff + Deploy #2828",
    action: "Patch decimal precision handler in billing microservice"
  },
  latency: {
    badge: "INFRASTRUCTURE DIAGNOSIS",
    conf: "93% CONFIDENCE",
    symptom: "API p99 latency spiked from 120ms to 4,200ms during peak load",
    cause: "Unindexed database query migration in release #2830",
    signals: "Postgres slow query log spike + Connection pool exhaustion + Migration commit #2830",
    action: "Execute concurrent index creation on workspace_id foreign key column"
  }
};

function selectUseCase(key) {
  const data = USE_CASES_DATA[key];
  if (!data) return;

  // Update tabs
  const buttons = document.querySelectorAll(".uc-btn");
  buttons.forEach(btn => {
    btn.classList.toggle("active", btn.textContent.toLowerCase().includes(key));
  });

  // Update card
  const badge = document.getElementById("uc-badge");
  const conf = document.getElementById("uc-conf");
  const symptom = document.getElementById("uc-symptom");
  const cause = document.getElementById("uc-cause");
  const signals = document.getElementById("uc-signals");
  const action = document.getElementById("uc-action");

  if (badge) badge.textContent = data.badge;
  if (conf) conf.textContent = data.conf;
  if (symptom) symptom.textContent = data.symptom;
  if (cause) cause.textContent = data.cause;
  if (signals) signals.textContent = data.signals;
  if (action) action.textContent = data.action;
}

/* ==========================================================================
   FLOATING SIMPLYWHY AI CO-PILOT ASSISTANT
   ========================================================================== */
function toggleAIAssistant() {
  const win = document.getElementById("ai-assistant-window");
  if (win) win.classList.toggle("open");
}

function askAIAssistant(prompt) {
  const text = document.getElementById("ai-response-text");
  if (!text) return;

  if (prompt.includes("conversion")) {
    text.textContent = "Checkout conversion dropped 18.4% after deployment #2841. 78% of affected users are on Safari. Session replays show repeated clicks on the payment button without a successful response.";
  } else if (prompt.includes("today")) {
    text.textContent = "7 deployments pushed across core services. 3 correlated anomalies detected: checkout payment loop, OAuth whitelist mismatch, and invite token expiration.";
  } else {
    text.textContent = "Start by investigating the primary checkout drop. SimplyWhy has already isolated the culprit to deployment #2841 with 94% attribution confidence.";
  }
}

function closeAIAndScroll(targetSelector) {
  toggleAIAssistant();
  const el = document.querySelector(targetSelector);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ==========================================================================
   LIVE TELEMETRY TICKER
   ========================================================================== */
function initLiveTelemetryTicker() {
  const scanTime = document.getElementById("live-scan-time");
  if (!scanTime) return;

  let seconds = 2.4;
  setInterval(() => {
    seconds = (Math.random() * 2 + 1).toFixed(1);
    scanTime.textContent = `${seconds}s ago`;
  }, 4000);
}
