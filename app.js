/**
 * SIMPLYWHY — ROOT CAUSE INTELLIGENCE
 * Interactive Product Demo Engine & Animations
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
      <div class="waitlist-success">
        <div class="waitlist-success-icon">✓</div>
        <h3>You're on the priority list.</h3>
        <p>Spot reserved for <strong style="color:var(--text-primary);">${email}</strong>. We'll send your diagnostic credentials as early access rolls out.</p>
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
  initTimelineScroll();
  initRecoveryCanvas();
  initScanKeyboardAccessibility();
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

/* ---------- SCROLL REVEALS & METRIC TRIGGERS ---------- */
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

  // Trigger confidence bar fill on Diagnosis section
  const diagCard = document.querySelector(".diagnosis-card");
  if (diagCard) {
    const diagObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = document.getElementById("confidence-fill");
          if (fill) fill.style.width = "94%";
          diagObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    diagObserver.observe(diagCard);
  }
}

/* ==========================================================================
   PRODUCT HEALTH SPARKLINES & INTERACTIVE HOVER
   ========================================================================== */
let activeHeroMetric = 'checkout';

function initProductHealthSparklines() {
  drawSparkline('spark-conv', [22, 21, 20, 19.5, 19, 18.4], '#EF4444');
  drawSparkline('spark-checkout', [12, 14, 15, 18, 25, 31.2], '#EF4444');
  drawSparkline('spark-rage', [8, 9, 11, 16, 28, 42.1], '#EF4444');
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
  grad.addColorStop(0, 'rgba(239, 68, 68, 0.25)');
  grad.addColorStop(1, 'rgba(239, 68, 68, 0.0)');

  ctx.beginPath();
  dataPoints.forEach((val, i) => {
    const x = 4 + i * stepX;
    const y = height - 4 - ((val - min) / (max - min)) * (height - 8);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  // Stroke line
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 1.8;
  ctx.stroke();

  // Fill path
  ctx.lineTo(4 + (dataPoints.length - 1) * stepX, height);
  ctx.lineTo(4, height);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Glowing end dot
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
  const group = document.getElementById('viz-metrics-group');
  if (group) group.classList.add('is-hovering');

  const rows = document.querySelectorAll('.viz-metric-row');
  rows.forEach(row => {
    const isTarget = row.getAttribute('data-metric') === metricType;
    row.classList.toggle('is-active', isTarget);
  });

  activeHeroMetric = metricType;

  // Highlight or expand drilldown panel
  const drilldown = document.getElementById('viz-drilldown-panel');
  if (drilldown) {
    if (metricType === 'checkout') {
      drilldown.style.borderColor = 'rgba(0, 245, 160, 0.4)';
      drilldown.style.boxShadow = '0 0 20px rgba(0, 245, 160, 0.15)';
    } else {
      drilldown.style.borderColor = 'var(--border)';
      drilldown.style.boxShadow = 'none';
    }
  }
}

function handleMetricLeave() {
  const group = document.getElementById('viz-metrics-group');
  if (group) group.classList.remove('is-hovering');

  const rows = document.querySelectorAll('.viz-metric-row');
  rows.forEach(row => row.classList.remove('is-active'));

  activeHeroMetric = 'checkout';
}

/* ==========================================================================
   HERO PRODUCT VISUALIZATION CANVAS
   Shows dynamic graph: Session & Support signals flowing into Correlation -> Deployment -> Root Cause
   ========================================================================== */
function initHeroVizCanvas() {
  const canvas = document.getElementById("vizCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * (window.devicePixelRatio || 1) || 400;
    canvas.height = rect.height * (window.devicePixelRatio || 1) || 150;
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
  }
  resize();
  window.addEventListener("resize", resize);

  let frame = 0;

  function draw() {
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    frame += 0.025;

    // Node coordinates
    const nodes = [
      { id: 'session', label: 'SESSION', x: w * 0.2, y: 24, color: '#38BDF8' },
      { id: 'support', label: 'SUPPORT', x: w * 0.8, y: 24, color: '#8B5CF6' },
      { id: 'corr', label: 'CORRELATION', x: w * 0.5, y: 64, color: '#F59E0B' },
      { id: 'deploy', label: 'DEPLOY #2841', x: w * 0.5, y: 104, color: '#EF4444' },
      { id: 'root', label: 'ROOT CAUSE', x: w * 0.5, y: 136, color: '#00F5A0' }
    ];

    // Connecting paths
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);

    // Session -> Correlation
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.beginPath();
    ctx.moveTo(nodes[0].x, nodes[0].y);
    ctx.lineTo(nodes[2].x, nodes[2].y);
    ctx.stroke();

    // Support -> Correlation
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.35)';
    ctx.beginPath();
    ctx.moveTo(nodes[1].x, nodes[1].y);
    ctx.lineTo(nodes[2].x, nodes[2].y);
    ctx.stroke();

    // Correlation -> Deploy
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.beginPath();
    ctx.moveTo(nodes[2].x, nodes[2].y);
    ctx.lineTo(nodes[3].x, nodes[3].y);
    ctx.stroke();

    // Deploy -> Root Cause
    ctx.strokeStyle = 'rgba(0, 245, 160, 0.5)';
    ctx.beginPath();
    ctx.moveTo(nodes[3].x, nodes[3].y);
    ctx.lineTo(nodes[4].x, nodes[4].y);
    ctx.stroke();

    ctx.setLineDash([]);

    // Animated signal pulses
    const pulse1 = (frame * 1.2) % 1;
    const p1x = nodes[0].x + (nodes[2].x - nodes[0].x) * pulse1;
    const p1y = nodes[0].y + (nodes[2].y - nodes[0].y) * pulse1;
    ctx.fillStyle = '#38BDF8';
    ctx.shadowBlur = 8; ctx.shadowColor = '#38BDF8';
    ctx.beginPath(); ctx.arc(p1x, p1y, 3, 0, Math.PI * 2); ctx.fill();

    const pulse2 = ((frame + 0.5) * 1.2) % 1;
    const p2x = nodes[1].x + (nodes[2].x - nodes[1].x) * pulse2;
    const p2y = nodes[1].y + (nodes[2].y - nodes[1].y) * pulse2;
    ctx.fillStyle = '#8B5CF6';
    ctx.shadowColor = '#8B5CF6';
    ctx.beginPath(); ctx.arc(p2x, p2y, 3, 0, Math.PI * 2); ctx.fill();

    const pulse3 = (frame * 1.5) % 1;
    const p3x = nodes[2].x + (nodes[3].x - nodes[2].x) * pulse3;
    const p3y = nodes[2].y + (nodes[3].y - nodes[2].y) * pulse3;
    ctx.fillStyle = '#F59E0B';
    ctx.shadowColor = '#F59E0B';
    ctx.beginPath(); ctx.arc(p3x, p3y, 3, 0, Math.PI * 2); ctx.fill();

    const pulse4 = ((frame + 0.3) * 1.5) % 1;
    const p4x = nodes[3].x + (nodes[4].x - nodes[3].x) * pulse4;
    const p4y = nodes[3].y + (nodes[4].y - nodes[3].y) * pulse4;
    ctx.fillStyle = '#00F5A0';
    ctx.shadowColor = '#00F5A0';
    ctx.beginPath(); ctx.arc(p4x, p4y, 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;

    // Draw Nodes
    nodes.forEach((n) => {
      const isHighlighted = (activeHeroMetric === 'checkout' && (n.id === 'deploy' || n.id === 'root')) ||
                            (activeHeroMetric === 'conversion' && n.id === 'session') ||
                            (activeHeroMetric === 'rage' && n.id === 'corr');

      ctx.fillStyle = isHighlighted ? 'rgba(25, 27, 35, 0.95)' : '#111113';
      ctx.strokeStyle = isHighlighted ? '#00F5A0' : n.color;
      ctx.lineWidth = isHighlighted ? 1.8 : 1;
      
      const padX = 8, padY = 3;
      ctx.font = '600 8.5px "JetBrains Mono", monospace';
      const textWidth = ctx.measureText(n.label).width;
      const boxW = textWidth + padX * 2;
      const boxH = 16;

      ctx.beginPath();
      ctx.roundRect(n.x - boxW / 2, n.y - boxH / 2, boxW, boxH, 4);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isHighlighted ? '#00F5A0' : n.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(n.label, n.x, n.y);
    });

    requestAnimationFrame(draw);
  }
  draw();
}

/* ==========================================================================
   WHY INVESTIGATION — AI LAYER CONTROLLER
   ========================================================================== */
const whyLayers = [
  {
    stepNum: "01",
    phase: "01 · SYMPTOM ISOLATION",
    question: "WHY DID REVENUE DROP?",
    depthLabel: "DEPTH LEVEL 01 / 05",
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
    depthLabel: "DEPTH LEVEL 02 / 05",
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
    question: "WHY ARE USERS ABANDONING CHECKOUT?",
    depthLabel: "DEPTH LEVEL 03 / 05",
    summary: "Cross-cohort dimensional analysis isolates 88% of checkout failures to Safari macOS & iOS.",
    evidenceList: [
      { tag: "COHORT", tagClass: "tag-cohort", text: "Chrome & Firefox completion: 74% (Normal)" },
      { tag: "COHORT", tagClass: "tag-cohort", text: "Safari completion: 18.2% (Critical Failure)" },
      { tag: "REPLAY", tagClass: "tag-replay", text: "1,842 rage clicks on #btn-pay-now submit trigger" }
    ],
    hint: "Click to correlate engineering changes →",
    isFinal: false
  },
  {
    stepNum: "04",
    phase: "04 · CODE ATTRIBUTION",
    question: "WHY ARE SAFARI USERS FAILING?",
    depthLabel: "DEPTH LEVEL 04 / 05",
    summary: "Git commit history and error stack traces correlate with payment validation handler.",
    evidenceList: [
      { tag: "GIT", tagClass: "tag-git", text: "Deploy #2841 pushed at 10:12 AM by @payments-core" },
      { tag: "TRACE", tagClass: "tag-trace", text: "TypeError: Safari autofill regex recursion in input listener" }
    ],
    hint: "Click to generate root cause verdict →",
    isFinal: false
  },
  {
    stepNum: "05",
    phase: "05 · ROOT CAUSE FOUND",
    question: "PAYMENT VALIDATION LOOP",
    depthLabel: "DEPTH LEVEL 05 / 05 (VERIFIED)",
    summary: "Payment validation loop introduced in deployment #2841 is affecting Safari users.",
    evidenceList: [
      { tag: "VERIFIED", tagClass: "tag-verified", text: "Root cause: Regex validation recursion on Safari autofill event" },
      { tag: "IMPACT", tagClass: "tag-impact", text: "$42,800 revenue at risk across 1,842 affected users" },
      { tag: "ACTION", tagClass: "tag-action", text: "Roll back deployment #2841 or deploy validation patch" }
    ],
    hint: "Investigation complete · Click to restart ↺",
    isFinal: true
  }
];

let currentWhyLayerIndex = 0;
let isWhyTransitioning = false;

function goToWhyLayer(targetIndex) {
  if (isWhyTransitioning || targetIndex === currentWhyLayerIndex) return;
  renderWhyLayer(targetIndex);
}

function advanceWhyLayer() {
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

  if (panel) panel.classList.add("is-transitioning");

  // Update progress pills
  pills.forEach((pill, i) => {
    pill.classList.toggle("active", i === index);
    pill.classList.toggle("completed", i < index);
  });

  // Scale depth rings dynamically
  const rings = document.querySelectorAll(".why-ring");
  rings.forEach((ring, rIdx) => {
    const scaleFactor = 1 - (index * 0.05);
    ring.style.transform = `scale(${scaleFactor})`;
  });

  setTimeout(() => {
    if (depthLabel) depthLabel.textContent = layer.depthLabel;
    if (badge) badge.textContent = layer.phase;
    if (question) question.textContent = layer.question;
    if (summary) summary.textContent = layer.summary;

    if (panel) {
      panel.classList.toggle("final-verdict", layer.isFinal);
    }

    if (confPill) {
      confPill.style.display = layer.isFinal ? "inline-flex" : "none";
    }

    if (hint) {
      hint.textContent = layer.hint;
    }

    // Render Evidence Chips
    if (evidenceGrid) {
      evidenceGrid.innerHTML = layer.evidenceList.map(ev => `
        <div class="why-evidence-chip">
          <span class="chip-tag ${ev.tagClass}">${ev.tag}</span>
          <span class="chip-desc">${ev.text}</span>
        </div>
      `).join("");
    }

    if (panel) panel.classList.remove("is-transitioning");
    isWhyTransitioning = false;
  }, 180);
}

/* ==========================================================================
   SIGNAL SOURCES — INTERACTIVE TOPOLOGY NETWORK
   ========================================================================== */
let activeSignalHover = null;
let isSignalCorrelating = false;

function handleSignalNodeHover(sourceId) {
  if (isSignalCorrelating) return;
  activeSignalHover = sourceId;
  const hubs = document.querySelectorAll(".sig-node-hub:not(.sig-hub-core)");
  hubs.forEach(hub => {
    if (hub.getAttribute("data-source") === sourceId) {
      hub.classList.add("is-active");
      hub.classList.remove("is-dimmed");
    } else {
      hub.classList.remove("is-active");
      hub.classList.add("is-dimmed");
    }
  });
}

function handleSignalNodeLeave() {
  if (isSignalCorrelating) return;
  activeSignalHover = null;
  const hubs = document.querySelectorAll(".sig-node-hub");
  hubs.forEach(hub => {
    hub.classList.remove("is-active");
    hub.classList.remove("is-dimmed");
  });
}

function triggerSignalCorrelationDemo() {
  if (isSignalCorrelating) return;
  isSignalCorrelating = true;

  const btn = document.getElementById("btn-correlate-signals");
  const coreStatus = document.getElementById("core-status-text");
  const footerHint = document.querySelector(".footer-hint");
  const hubs = document.querySelectorAll(".sig-node-hub");

  if (btn) btn.classList.add("is-active");
  if (coreStatus) coreStatus.textContent = "✦ CORRELATING VECTORS...";
  if (footerHint) footerHint.textContent = "✦ Ingesting telemetry across Sessions, Support, Errors & Deployments...";

  // Highlight suspect nodes: session, support, errors, deploys
  hubs.forEach(hub => {
    const src = hub.getAttribute("data-source");
    if (src === "funnel") {
      hub.classList.add("is-dimmed");
    } else {
      hub.classList.add("is-active");
    }
  });

  setTimeout(() => {
    if (coreStatus) coreStatus.textContent = "✦ ROOT CAUSE IDENTIFIED (94%)";
    if (footerHint) footerHint.textContent = "✓ Root cause verified: Deployment #2841 introduced payment validation loop on Safari.";
  }, 1600);

  setTimeout(() => {
    isSignalCorrelating = false;
    if (btn) btn.classList.remove("is-active");
    if (coreStatus) coreStatus.textContent = "INGESTING TELEMETRY";
    if (footerHint) footerHint.textContent = "Hover any node to inspect telemetry stream · Click Auto-Correlate to simulate AI root cause synthesis";
    handleSignalNodeLeave();
  }, 5000);
}

function initSignalNetworkCanvas() {
  const canvas = document.getElementById("signalNetworkCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const viewport = canvas.parentElement;

  let animFrame = null;
  let time = 0;

  function resize() {
    const rect = viewport.getBoundingClientRect();
    canvas.width = rect.width * (window.devicePixelRatio || 1);
    canvas.height = rect.height * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
  }
  resize();
  window.addEventListener("resize", resize);

  function getNodeCenter(el) {
    if (!el) return { x: 0, y: 0 };
    const rect = el.getBoundingClientRect();
    const parentRect = viewport.getBoundingClientRect();
    return {
      x: rect.left - parentRect.left + rect.width / 2,
      y: rect.top - parentRect.top + rect.height / 2
    };
  }

  function render() {
    const rect = viewport.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);
    time += 0.025;

    const coreEl = document.getElementById("node-core");
    const supportEl = document.querySelector('[data-source="support"]');
    const sessionEl = document.querySelector('[data-source="session"]');
    const funnelEl = document.querySelector('[data-source="funnel"]');
    const deployEl = document.querySelector('[data-source="deploys"]');
    const errorEl = document.querySelector('[data-source="errors"]');

    if (!coreEl) return;

    const corePt = getNodeCenter(coreEl);
    const supportPt = getNodeCenter(supportEl);
    const sessionPt = getNodeCenter(sessionEl);
    const funnelPt = getNodeCenter(funnelEl);
    const deployPt = getNodeCenter(deployEl);
    const errorPt = getNodeCenter(errorEl);

    const streams = [
      { id: "support", from: supportPt, to: corePt, color: "#8B5CF6" },
      { id: "session", from: sessionPt, to: corePt, color: "#38BDF8" },
      { id: "funnel", from: funnelPt, to: corePt, color: "#F59E0B" },
      { id: "deploys", from: deployPt, to: corePt, color: "#EF4444" },
      { id: "errors", from: errorPt, to: deployPt, color: "#EF4444" }
    ];

    streams.forEach(stream => {
      const isHovered = activeSignalHover === stream.id;
      const isSuspect = isSignalCorrelating && stream.id !== "funnel";

      ctx.save();
      if (isHovered || isSuspect) {
        ctx.strokeStyle = '#00F5A0';
        ctx.lineWidth = 2.4;
        ctx.shadowColor = '#00F5A0';
        ctx.shadowBlur = 12;
        ctx.setLineDash([]);
      } else {
        ctx.strokeStyle = activeSignalHover ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
      }

      ctx.beginPath();
      ctx.moveTo(stream.from.x, stream.from.y);
      ctx.lineTo(stream.to.x, stream.to.y);
      ctx.stroke();
      ctx.restore();

      // Traveling photon
      const photonProg = (time + stream.from.x * 0.005) % 1;
      const px = stream.from.x + (stream.to.x - stream.from.x) * photonProg;
      const py = stream.from.y + (stream.to.y - stream.from.y) * photonProg;

      ctx.save();
      ctx.fillStyle = (isHovered || isSuspect) ? '#00F5A0' : stream.color;
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = (isHovered || isSuspect) ? 14 : 6;
      ctx.beginPath();
      ctx.arc(px, py, (isHovered || isSuspect) ? 4 : 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    animFrame = requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   EVIDENCE GRAPH — INTERACTIVE NODE CORRELATION MAP
   ========================================================================== */
let evidenceNodes = [];
let evidenceMode = 'all'; // 'all' | 'causal'
let selectedEvidenceNode = 'deploy';

function setEvidenceMode(mode) {
  evidenceMode = mode;
  const tabAll = document.getElementById("ev-tab-all");
  const tabCausal = document.getElementById("ev-tab-causal");
  if (tabAll && tabCausal) {
    tabAll.classList.toggle("active", mode === 'all');
    tabCausal.classList.toggle("active", mode === 'causal');
  }
}

function selectEvidenceDrawerNode(nodeId) {
  selectedEvidenceNode = nodeId;
  const node = evidenceNodes.find(n => n.id === nodeId);
  if (!node) return;

  const titleEl = document.getElementById("drawer-node-title");
  const tagEl = document.getElementById("drawer-node-tag");
  const bodyEl = document.getElementById("drawer-node-body");

  if (titleEl) titleEl.textContent = node.name;
  if (tagEl) tagEl.textContent = node.drawerTag || "TELEMETRY EVIDENCE";
  if (bodyEl) bodyEl.innerHTML = node.drawerBody || Object.entries(node.meta).map(([k, v]) => `<strong>${k}:</strong> ${v}`).join(' · ');
}

function initEvidenceCanvas() {
  const canvas = document.getElementById("evidenceCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const tooltip = document.getElementById("evidence-tooltip");
  const tooltipTitle = document.getElementById("tooltip-title");
  const tooltipRows = document.getElementById("tooltip-rows");

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * (window.devicePixelRatio || 1);
    canvas.height = rect.height * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    setupNodes(rect.width, rect.height);
  }

  function setupNodes(w, h) {
    evidenceNodes = [
      {
        id: "support",
        name: "SUPPORT",
        x: w * 0.5,
        y: h * 0.12,
        color: "#8B5CF6",
        meta: { "Tickets": "283 complaints", "Trend": "+37%", "Keyword": "Payment stuck" },
        drawerTag: "CUSTOMER CONVERSATION STREAM",
        drawerBody: "283 support tickets filed within 40 minutes of deployment #2841 mentioning unresponsive payment submit button on Safari."
      },
      {
        id: "session",
        name: "SESSION",
        x: w * 0.18,
        y: h * 0.28,
        color: "#38BDF8",
        meta: { "Sessions": "12,481 analyzed", "Avg Duration": "1m 12s", "Drop Step": "Payment" },
        drawerTag: "USER BEHAVIOR TELEMETRY",
        drawerBody: "12,481 user sessions analyzed. 88% of abandonments isolated to Safari Desktop and iOS checkout runs."
      },
      {
        id: "checkout",
        name: "CHECKOUT",
        x: w * 0.5,
        y: h * 0.28,
        color: "#F59E0B",
        meta: { "Conversion": "68% → 47%", "Failure Rate": "+31.2%", "Cohort": "Safari Mobile" },
        drawerTag: "FUNNEL ANOMALY",
        drawerBody: "Checkout step completion plunged from 68% to 47%. Form submission listener fails to trigger next state."
      },
      {
        id: "funnel",
        name: "FUNNEL",
        x: w * 0.82,
        y: h * 0.28,
        color: "#38BDF8",
        meta: { "Step 1 (Cart)": "94%", "Step 2 (Info)": "86%", "Step 3 (Pay)": "47%" },
        drawerTag: "STEP DROP-OFF",
        drawerBody: "Top of funnel healthy at 94%. Isolated bottleneck located squarely at Payment Authorization phase."
      },
      {
        id: "rage",
        name: "RAGE CLICKS",
        x: w * 0.22,
        y: h * 0.48,
        color: "#EF4444",
        meta: { "Count": "1,842 clicks", "Element": "#btn-pay-now", "Intensity": "High" },
        drawerTag: "SESSION REPLAY ANOMALY",
        drawerBody: "1,842 rage clicks detected on primary CTA button '#btn-pay-now' due to silent client-side validation failure."
      },
      {
        id: "deploy",
        name: "DEPLOY #2841",
        x: w * 0.5,
        y: h * 0.48,
        color: "#EF4444",
        meta: { "Released": "10:12 AM", "Checkout failures": "+31%", "Correlation": "94%" },
        drawerTag: "SUSPECT COMMIT ATTRIBUTION",
        drawerBody: "Deployment #2841 released at 10:12 AM by @payments-core. Code changes in payment validation regex introduced infinite validation loops on Safari autofill."
      },
      {
        id: "bug",
        name: "PAYMENT BUG",
        x: w * 0.5,
        y: h * 0.68,
        color: "#00F5A0",
        meta: { "Type": "Regex Loop", "Target": "Safari Autofill", "Severity": "P0 Critical" },
        drawerTag: "ROOT CAUSE MECHANISM",
        drawerBody: "Infinite regex recursion triggered whenever Safari native autofill dispatches non-standard synthetic input events."
      },
      {
        id: "risk",
        name: "$42.8K AT RISK",
        x: w * 0.5,
        y: h * 0.86,
        color: "#00F5A0",
        meta: { "Projected Loss": "$42,800", "Affected Users": "1,842", "Remediation": "Rollback #2841" },
        drawerTag: "BUSINESS IMPACT & ACTION",
        drawerBody: "Estimated $42,800 GMV at risk. Recommended immediate rollback to commit #b7a8 to recover 98% of lost conversions."
      }
    ];
  }

  resize();
  window.addEventListener("resize", resize);

  let hoveredNode = null;
  let animTime = 0;

  // Mouse hover & click detection
  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    let found = null;
    evidenceNodes.forEach(node => {
      const dist = Math.hypot(node.x - mx, node.y - my);
      if (dist < 46) {
        found = node;
      }
    });

    hoveredNode = found;

    if (found && tooltip && tooltipTitle && tooltipRows) {
      tooltipTitle.textContent = found.name;
      tooltipRows.innerHTML = Object.entries(found.meta)
        .map(([k, v]) => `
          <div class="evidence-tooltip-row">
            <span>${k}</span>
            <span class="val">${v}</span>
          </div>
        `).join("");

      tooltip.style.left = `${Math.min(found.x + 15, rect.width - 240)}px`;
      tooltip.style.top = `${Math.max(found.y - 45, 10)}px`;
      tooltip.classList.add("visible");
    } else if (tooltip) {
      tooltip.classList.remove("visible");
    }
  });

  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    evidenceNodes.forEach(node => {
      const dist = Math.hypot(node.x - mx, node.y - my);
      if (dist < 46) {
        selectEvidenceDrawerNode(node.id);
      }
    });
  });

  canvas.addEventListener("mouseleave", () => {
    hoveredNode = null;
    if (tooltip) tooltip.classList.remove("visible");
  });

  function render() {
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    animTime += 0.02;

    // Connections between nodes
    const links = [
      ["support", "checkout"],
      ["session", "checkout"],
      ["funnel", "checkout"],
      ["session", "rage"],
      ["rage", "deploy"],
      ["checkout", "deploy"],
      ["deploy", "bug"],
      ["bug", "risk"]
    ];

    const causalPath = ["session", "checkout", "deploy", "bug", "risk"];

    links.forEach(([fromId, toId]) => {
      const from = evidenceNodes.find(n => n.id === fromId);
      const to = evidenceNodes.find(n => n.id === toId);
      if (!from || !to) return;

      const isCausalLink = (fromId === "session" && toId === "checkout") ||
                          (fromId === "checkout" && toId === "deploy") ||
                          (fromId === "deploy" && toId === "bug") ||
                          (fromId === "bug" && toId === "risk");

      const isDirectHover = hoveredNode && (hoveredNode.id === fromId || hoveredNode.id === toId);
      const isHighlighted = (evidenceMode === 'causal' && isCausalLink) || isDirectHover;

      ctx.save();
      if (isHighlighted) {
        ctx.strokeStyle = '#00F5A0';
        ctx.lineWidth = 2.2;
        ctx.shadowColor = '#00F5A0';
        ctx.shadowBlur = 10;
        ctx.setLineDash([]);
      } else {
        ctx.strokeStyle = (evidenceMode === 'causal' || hoveredNode) ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 4]);
      }

      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
      ctx.restore();

      // Traveling pulse
      const pulseProg = (animTime + from.x * 0.01) % 1;
      const px = from.x + (to.x - from.x) * pulseProg;
      const py = from.y + (to.y - from.y) * pulseProg;

      ctx.save();
      ctx.fillStyle = isHighlighted ? '#00F5A0' : from.color;
      ctx.shadowBlur = isHighlighted ? 12 : 4;
      ctx.shadowColor = ctx.fillStyle;
      ctx.beginPath();
      ctx.arc(px, py, isHighlighted ? 3.5 : 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Draw Nodes
    evidenceNodes.forEach(node => {
      const isHovered = hoveredNode && hoveredNode.id === node.id;
      const isSelected = selectedEvidenceNode === node.id;
      const isCausalNode = causalPath.includes(node.id);
      const isDimmed = (evidenceMode === 'causal' && !isCausalNode) ||
                       (hoveredNode && !isHovered && !links.some(([f, t]) => (f === hoveredNode.id && t === node.id) || (t === hoveredNode.id && f === node.id)));

      const boxW = 126;
      const boxH = 34;

      ctx.save();
      ctx.globalAlpha = isDimmed ? 0.22 : 1;

      ctx.fillStyle = (isHovered || isSelected) ? 'rgba(26, 32, 44, 0.96)' : 'rgba(17, 17, 19, 0.9)';
      ctx.strokeStyle = (isHovered || isSelected || (evidenceMode === 'causal' && isCausalNode)) ? '#00F5A0' : (node.color || 'rgba(255, 255, 255, 0.2)');
      ctx.lineWidth = (isHovered || isSelected) ? 2 : 1;

      if (isHovered || isSelected || (evidenceMode === 'causal' && isCausalNode)) {
        ctx.shadowColor = '#00F5A0';
        ctx.shadowBlur = 16;
      }

      ctx.beginPath();
      ctx.roundRect(node.x - boxW / 2, node.y - boxH / 2, boxW, boxH, 8);
      ctx.fill();
      ctx.stroke();

      ctx.font = '700 10.5px "JetBrains Mono", monospace';
      ctx.fillStyle = (isHovered || isSelected || (evidenceMode === 'causal' && isCausalNode)) ? '#00F5A0' : '#FAFAFA';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.name, node.x, node.y);
      ctx.restore();
    });

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   INCIDENT TIMELINE & REPLAY CONTROLLER
   ========================================================================== */
let incidentReplayTimers = [];
let isIncidentReplaying = false;

function clearIncidentReplayTimers() {
  incidentReplayTimers.forEach(t => clearTimeout(t));
  incidentReplayTimers = [];
}

function initTimelineScroll() {
  const timeline = document.getElementById("timeline");
  const fill = document.getElementById("timeline-fill");
  const events = document.querySelectorAll(".timeline-event");
  if (!timeline || !fill) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        fill.style.height = "100%";
        events.forEach((ev, i) => {
          setTimeout(() => {
            ev.classList.add("visible");
          }, i * 200 + 100);
        });
        
        // Auto-run session replay once in view
        setTimeout(() => {
          runSessionReplayAnimation();
        }, 1200);

        observer.unobserve(timeline);
      }
    });
  }, { threshold: 0.15 });

  observer.observe(timeline);
}

function replayIncidentSequence() {
  if (isIncidentReplaying) return;
  isIncidentReplaying = true;
  clearIncidentReplayTimers();

  const btn = document.getElementById("btn-replay-incident");
  const fill = document.getElementById("timeline-fill");
  const events = document.querySelectorAll(".timeline-event");
  const momentCard = document.getElementById("timeline-moment-card");

  if (btn) btn.classList.add("is-replaying");
  if (momentCard) momentCard.classList.remove("visible");

  events.forEach(ev => {
    ev.classList.remove("active-step");
    ev.classList.add("visible");
  });

  if (fill) fill.style.height = "0%";

  events.forEach((ev, i) => {
    const t = setTimeout(() => {
      events.forEach(e => e.classList.remove("active-step"));
      ev.classList.add("active-step");

      if (fill) {
        const pct = Math.min((i / (events.length - 1)) * 100, 100);
        fill.style.height = `${pct}%`;
      }

      // If at suspect commit #2841 or final step, highlight
      if (i === 1 || i === 6) {
        ev.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // At final step
      if (i === events.length - 1) {
        if (momentCard) {
          const tCard = setTimeout(() => {
            momentCard.classList.add("visible");
          }, 400);
          incidentReplayTimers.push(tCard);
        }

        const tDone = setTimeout(() => {
          isIncidentReplaying = false;
          if (btn) btn.classList.remove("is-replaying");
        }, 3000);
        incidentReplayTimers.push(tDone);
      }

    }, i * 750 + 200);

    incidentReplayTimers.push(t);
  });
}

/* ==========================================================================
   SIMULATED BROWSER SESSION REPLAY CONTROLLER
   ========================================================================== */
let sessionReplayTimers = [];
let isSessionReplaying = false;

function clearSessionReplayTimers() {
  sessionReplayTimers.forEach(t => clearTimeout(t));
  sessionReplayTimers = [];
}

function runSessionReplayAnimation() {
  if (isSessionReplaying) return;
  isSessionReplaying = true;
  clearSessionReplayTimers();

  const cursor = document.getElementById("virtual-cursor");
  const pulse = document.getElementById("cursor-pulse");
  const btn = document.getElementById("replay-submit-btn");
  const spinner = document.getElementById("btn-spinner");
  const alert = document.getElementById("rage-click-alert");

  // Reset state
  if (cursor) {
    cursor.style.top = "20px";
    cursor.style.left = "20px";
  }
  if (btn) {
    btn.className = "replay-submit-btn";
  }
  if (spinner) spinner.classList.remove("active");
  if (alert) alert.classList.remove("visible");

  // Step 1: Cursor moves to submit button
  const t1 = setTimeout(() => {
    if (cursor) {
      cursor.style.top = "248px";
      cursor.style.left = "180px";
    }

    // Step 2: 1st Click
    const t2 = setTimeout(() => {
      if (pulse) {
        pulse.classList.remove("pulse-active");
        void pulse.offsetWidth;
        pulse.classList.add("pulse-active");
      }
      if (btn) btn.classList.add("btn-clicked");
      if (spinner) spinner.classList.add("active");

      const t2b = setTimeout(() => {
        if (btn) btn.classList.remove("btn-clicked");
        if (spinner) spinner.classList.remove("active");
      }, 500);
      sessionReplayTimers.push(t2b);

      // Step 3: 2nd Click (Nothing happens)
      const t3 = setTimeout(() => {
        if (pulse) {
          pulse.classList.remove("pulse-active");
          void pulse.offsetWidth;
          pulse.classList.add("pulse-active");
        }
        if (btn) btn.classList.add("btn-clicked");
        const t3b = setTimeout(() => {
          if (btn) btn.classList.remove("btn-clicked");
        }, 200);
        sessionReplayTimers.push(t3b);

        // Step 4: Rapid Rage Clicks (3 clicks in rapid succession)
        const t4 = setTimeout(() => {
          let count = 0;
          const rageInterval = setInterval(() => {
            count++;
            if (pulse) {
              pulse.classList.remove("pulse-active");
              void pulse.offsetWidth;
              pulse.classList.add("pulse-active");
            }
            if (btn) {
              btn.classList.add("btn-clicked");
              setTimeout(() => btn.classList.remove("btn-clicked"), 100);
            }

            if (count >= 3) {
              clearInterval(rageInterval);

              // Step 5: Rage Click Detected Alert
              const t5 = setTimeout(() => {
                if (btn) btn.classList.add("btn-stuck");
                if (alert) alert.classList.add("visible");
                isSessionReplaying = false;
              }, 300);
              sessionReplayTimers.push(t5);
            }
          }, 180);

        }, 700);
        sessionReplayTimers.push(t4);

      }, 1000);
      sessionReplayTimers.push(t3);

    }, 800);
    sessionReplayTimers.push(t2);

  }, 400);
  sessionReplayTimers.push(t1);
}

/* ==========================================================================
   NEURAL SCAN 5-STAGE STATE MACHINE & MODAL CONTROLLER
   ========================================================================== */
let scanTimeouts = [];
let scanCanvasAnim = null;

function clearAllScanTimers() {
  scanTimeouts.forEach(t => clearTimeout(t));
  scanTimeouts = [];
  if (scanCanvasAnim) {
    cancelAnimationFrame(scanCanvasAnim);
    scanCanvasAnim = null;
  }
}

function initScanKeyboardAccessibility() {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const overlay = document.getElementById("neural-scan");
      if (overlay && overlay.classList.contains("active")) {
        closeNeuralScan();
      }
    }
  });

  const whyPanel = document.getElementById("why-central-panel");
  if (whyPanel) {
    whyPanel.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        advanceWhyLayer();
      }
    });
  }

  // Close when clicking directly on the backdrop
  const overlay = document.getElementById("neural-scan");
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        closeNeuralScan();
      }
    });
  }
}

function openNeuralScan() {
  const overlay = document.getElementById("neural-scan");
  if (!overlay) return;

  clearAllScanTimers();
  overlay.classList.add("active");
  document.body.style.overflow = "hidden";

  runScanSequence();
}

function closeNeuralScan() {
  const overlay = document.getElementById("neural-scan");
  if (!overlay) return;

  clearAllScanTimers();
  overlay.classList.remove("active");
  document.body.style.overflow = "";
}

function showScanStage(stageNum) {
  for (let i = 1; i <= 5; i++) {
    const stage = document.getElementById(`scan-stage-${i}`);
    if (stage) stage.classList.toggle("active", i === stageNum);
  }
}

function runScanSequence() {
  // RESET ALL STAGES STATE
  for (let i = 1; i <= 5; i++) {
    const stage = document.getElementById(`scan-stage-${i}`);
    if (stage) stage.classList.remove("active");
  }

  // Reset Checklist Items
  const checkItems = document.querySelectorAll(".scan-check-item");
  checkItems.forEach(item => {
    item.className = "scan-check-item";
    const icon = item.querySelector(".check-icon");
    if (icon) icon.textContent = "○";
  });

  // Reset Chain Items
  const chainItems = document.querySelectorAll(".scan-chain-item");
  const chainArrows = document.querySelectorAll(".scan-chain-arrow");
  chainItems.forEach(el => el.classList.remove("visible"));
  chainArrows.forEach(el => el.classList.remove("visible"));

  // Reset Stats
  ['stat-sessions', 'stat-conversations', 'stat-deploys', 'stat-anomalies'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = "0";
  });

  // ----------------------------------------------------
  // STATE 1: ANALYZING YOUR PRODUCT...
  // ----------------------------------------------------
  showScanStage(1);

  checkItems.forEach((item, index) => {
    const t = setTimeout(() => {
      item.classList.add("scanning");
      const icon = item.querySelector(".check-icon");

      const t2 = setTimeout(() => {
        item.classList.remove("scanning");
        item.classList.add("checked");
        if (icon) icon.textContent = "✓";
      }, 320);
      scanTimeouts.push(t2);

    }, index * 380 + 100);
    scanTimeouts.push(t);
  });

  // ----------------------------------------------------
  // STATE 2: CORRELATING SIGNALS...
  // ----------------------------------------------------
  const tState2 = setTimeout(() => {
    showScanStage(2);
    startScanParticleCanvas();

    animateCounter("stat-sessions", 12481, 1400);
    animateCounter("stat-conversations", 2341, 1400);
    animateCounter("stat-deploys", 7, 1000);
    animateCounter("stat-anomalies", 43, 1200);

    // ----------------------------------------------------
    // STATE 3: ANOMALY DETECTED
    // ----------------------------------------------------
    const tState3 = setTimeout(() => {
      showScanStage(3);

      // ----------------------------------------------------
      // STATE 4: CAUSAL PROPAGATION CHAIN
      // ----------------------------------------------------
      const tState4 = setTimeout(() => {
        showScanStage(4);

        chainItems.forEach((el, i) => {
          const tChain = setTimeout(() => {
            el.classList.add("visible");
            if (chainArrows[i]) chainArrows[i].classList.add("visible");
          }, i * 360 + 100);
          scanTimeouts.push(tChain);
        });

        // ----------------------------------------------------
        // STATE 5: ROOT CAUSE FOUND
        // ----------------------------------------------------
        const tState5 = setTimeout(() => {
          showScanStage(5);
        }, 2100);
        scanTimeouts.push(tState5);

      }, 1600);
      scanTimeouts.push(tState4);

    }, 2400);
    scanTimeouts.push(tState3);

  }, 2700);
  scanTimeouts.push(tState2);
}

function animateCounter(elemId, targetVal, duration) {
  const el = document.getElementById(elemId);
  if (!el) return;
  const startTime = performance.now();

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(easeOut * targetVal);
    el.textContent = current.toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function startScanParticleCanvas() {
  const canvas = document.getElementById("scanCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const total = 120;

  for (let i = 0; i < total; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      targetX: canvas.width / 2 + (Math.random() - 0.5) * 260,
      targetY: canvas.height / 2 + (Math.random() - 0.5) * 180,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      size: Math.random() * 2 + 1.2,
      color: Math.random() > 0.5 ? '#00F5A0' : (Math.random() > 0.4 ? '#38BDF8' : '#8B5CF6'),
      alpha: Math.random() * 0.7 + 0.3
    });
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.x += (p.targetX - p.x) * 0.025 + p.vx;
      p.y += (p.targetY - p.y) * 0.025 + p.vy;

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    scanCanvasAnim = requestAnimationFrame(loop);
  }

  loop();
}

/* ---------- UTILITY: SMOOTH SCROLL ---------- */
function scrollToSection(selector) {
  const target = document.querySelector(selector);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function closeNeuralScanAndScroll(selector) {
  closeNeuralScan();
  setTimeout(() => {
    scrollToSection(selector);
  }, 250);
}

/* ==========================================================================
   DIAGNOSIS EVIDENCE DRAWER TOGGLE
   ========================================================================== */
function toggleDiagnosisEvidence() {
  const drawer = document.getElementById("diag-evidence-drawer");
  const arrow = document.getElementById("evidence-btn-arrow");
  if (!drawer) return;

  const isExpanded = drawer.classList.contains("expanded");
  drawer.classList.toggle("expanded", !isExpanded);
  if (arrow) {
    arrow.textContent = isExpanded ? "↓" : "↑";
  }
}

/* ==========================================================================
   RECOVERY SIMULATION CONTROLLER & TRAJECTORY GRAPH
   ========================================================================== */
let recoverySimulationProgress = 0; // 0 (baseline/drop) -> 1 (recovered)
let isRecoverySimulating = false;
let recoveryCanvasAnim = null;

function initRecoveryCanvas() {
  const canvas = document.getElementById("recoveryCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * (window.devicePixelRatio || 1);
    canvas.height = rect.height * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
  }
  resize();
  window.addEventListener("resize", resize);

  function draw() {
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    const pad = 24;
    const plotW = w - pad * 2;
    const plotH = h - pad * 2;

    // Grid baseline
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    // 68% normal baseline line
    const y68 = pad + plotH * (1 - 0.68);
    ctx.beginPath();
    ctx.moveTo(pad, y68);
    ctx.lineTo(w - pad, y68);
    ctx.stroke();

    // 47% degraded line
    const y47 = pad + plotH * (1 - 0.47);
    ctx.beginPath();
    ctx.moveTo(pad, y47);
    ctx.lineTo(w - pad, y47);
    ctx.stroke();

    ctx.setLineDash([]);

    // Curve points:
    // Pt 0: 09:41 (68%)
    // Pt 1: 10:12 (68%)
    // Pt 2: 10:18 (52%)
    // Pt 3: 10:27 (47% - trough)
    // Pt 4: 10:34 (47% -> 68% based on recoverySimulationProgress)
    // Pt 5: Recovery (68% based on recoverySimulationProgress)

    const points = [
      { x: pad, y: y68, label: "09:41" },
      { x: pad + plotW * 0.25, y: y68, label: "10:12" },
      { x: pad + plotW * 0.42, y: pad + plotH * (1 - 0.54), label: "10:18" },
      { x: pad + plotW * 0.6, y: y47, label: "10:27" },
      { 
        x: pad + plotW * 0.8, 
        y: y47 - (y47 - (pad + plotH * (1 - 0.62))) * recoverySimulationProgress, 
        label: "PATCH" 
      },
      { 
        x: w - pad, 
        y: y47 - (y47 - y68) * recoverySimulationProgress, 
        label: "RESTORED" 
      }
    ];

    // Fill gradient area under curve
    const grad = ctx.createLinearGradient(0, pad, 0, h - pad);
    if (recoverySimulationProgress > 0.5) {
      grad.addColorStop(0, 'rgba(0, 245, 160, 0.25)');
      grad.addColorStop(1, 'rgba(0, 245, 160, 0.0)');
    } else {
      grad.addColorStop(0, 'rgba(239, 68, 68, 0.2)');
      grad.addColorStop(1, 'rgba(239, 68, 68, 0.0)');
    }

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cx = (prev.x + curr.x) / 2;
      ctx.bezierCurveTo(cx, prev.y, cx, curr.y, curr.x, curr.y);
    }
    ctx.lineTo(w - pad, h - pad);
    ctx.lineTo(pad, h - pad);
    ctx.closePath();
    ctx.fill();

    // Draw stroke curve
    ctx.strokeStyle = recoverySimulationProgress > 0.5 ? '#00F5A0' : '#EF4444';
    ctx.lineWidth = 2.4;
    ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = 10;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cx = (prev.x + curr.x) / 2;
      ctx.bezierCurveTo(cx, prev.y, cx, curr.y, curr.x, curr.y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw key vertices dots
    points.forEach((pt, idx) => {
      ctx.fillStyle = (idx >= 4 && recoverySimulationProgress > 0.5) ? '#00F5A0' : (idx >= 2 && idx <= 3 ? '#EF4444' : '#FAFAFA');
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI * 2);
      ctx.fill();
    });

    recoveryCanvasAnim = requestAnimationFrame(draw);
  }

  draw();
}

function runRecoverySimulation() {
  if (isRecoverySimulating) return;
  isRecoverySimulating = true;

  const btn = document.getElementById("btn-simulate-recovery");
  const convVal = document.getElementById("sim-conversion-val");
  const convStatus = document.getElementById("sim-conversion-status");
  const revVal = document.getElementById("sim-revenue-val");
  const revStatus = document.getElementById("sim-revenue-status");
  const statusPill = document.getElementById("recovery-status-pill");

  if (btn) btn.classList.add("is-simulating");

  const startTime = performance.now();
  const duration = 2000;

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);

    recoverySimulationProgress = ease;

    const scen = INCIDENT_SCENARIOS[currentScenarioKey] || INCIDENT_SCENARIOS.checkout;

    // Conversion rate counter
    const startC = parseInt(scen.initialConv) || 47;
    const endC = parseInt(scen.restoredConv) || 68;
    const currentConv = Math.floor(startC + ease * (endC - startC));
    if (convVal) convVal.textContent = `${currentConv}%`;

    // Revenue recovered counter
    if (scen.id === "INC-2835") {
      const currentSeats = Math.floor(ease * 1450);
      if (revVal) revVal.textContent = `${currentSeats.toLocaleString()} Seats`;
    } else {
      const maxRev = scen.id === "INC-2839" ? 58000 : 42800;
      const currentRev = Math.floor(ease * maxRev);
      if (revVal) revVal.textContent = `$${currentRev.toLocaleString()}`;
    }

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      if (convVal) {
        convVal.textContent = scen.restoredConv;
        convVal.classList.add("recovered");
      }
      if (convStatus) convStatus.textContent = `Restored to normal baseline (${scen.restoredConv})`;

      if (revVal) {
        revVal.textContent = scen.recoveredRev;
        revVal.classList.add("recovered");
      }
      if (revStatus) revStatus.textContent = "Remediation projected successfully";

      if (statusPill) statusPill.classList.add("visible");
      if (btn) btn.classList.remove("is-simulating");
      isRecoverySimulating = false;
    }
  }

  requestAnimationFrame(step);
}

/* ==========================================================================
   LIVE TELEMETRY TICKER
   ========================================================================== */
function initLiveTelemetryTicker() {
  const scanTimeEl = document.getElementById("live-scan-time");
  if (!scanTimeEl) return;

  let seconds = 2.4;
  setInterval(() => {
    seconds += 0.8;
    if (seconds > 8.0) {
      seconds = 1.1;
    }
    scanTimeEl.textContent = `${seconds.toFixed(1)}s ago`;
  }, 1200);
}

/* ==========================================================================
   MULTI-SCENARIO INCIDENT SYSTEM
   ========================================================================== */
const INCIDENT_SCENARIOS = {
  checkout: {
    id: "INC-2841",
    name: "Checkout dropped",
    icon: "💳",
    heroMetricLabel: "Conversion",
    heroMetricVal: "↓ 18.4%",
    heroMetricSub: "Checkout failures ↑ 31.2% · Rage clicks ↑ 42.1%",
    incidentTitle: "CHECKOUT CONVERSION DROP",
    rootCause: "Payment validation loop introduced in deployment <code>#2841</code>",
    confidence: "94%",
    confidenceVal: 94,
    impact: "$42,800 revenue at risk",
    reasoning: '"The failure began 6 minutes after deployment #2841, is concentrated among Safari users, appears in session replays, and matches a 412% increase in validation errors."',
    recommendation: 'Roll back deployment <code>#2841</code> and deploy the validation patch to restore Safari checkout functionality.',
    breakdown: [
      { label: "Session correlation", val: "+31%", width: "31%" },
      { label: "Support correlation", val: "+26%", width: "26%" },
      { label: "Deployment timing", val: "+22%", width: "22%" },
      { label: "Error correlation", val: "+15%", width: "15%" }
    ],
    initialConv: "47%",
    restoredConv: "68%",
    recoveredRev: "$38K – $44K",
    aiResponses: {
      "Why did conversion drop?": "Checkout conversion dropped 18.4% after deployment #2841. 78% of affected users are on Safari. Session replays show repeated clicks on the payment button without a successful response.",
      "Why are users leaving?": "Safari users trigger an infinite validation recursion on form submit due to synthetic autofill events introduced in #2841. 1,842 users experienced rage clicks.",
      "What changed today?": "Deployment #2841 was pushed at 10:12 AM by @payments-core containing a regex validation overhaul for credit card inputs."
    }
  },
  signups: {
    id: "INC-2839",
    name: "Signups disappeared",
    icon: "👤",
    heroMetricLabel: "Signups",
    heroMetricVal: "↓ 28.4%",
    heroMetricSub: "OAuth failures ↑ 64.2% · Form dropoff ↑ 51.0%",
    incidentTitle: "SIGNUP CONVERSION DROP",
    rootCause: "OAuth callback whitelist mismatch introduced in deployment <code>#2839</code>",
    confidence: "96%",
    confidenceVal: 96,
    impact: "4,200 lost signups / week ($58,000 ARR)",
    reasoning: '"Signup drops occurred within 90 seconds of deployment #2839. 92% of failed registrations originated from Google/GitHub OAuth redirect timeouts."',
    recommendation: 'Revert OAuth client configuration in deployment <code>#2839</code> and refresh Google/GitHub callback domain whitelist.',
    breakdown: [
      { label: "OAuth telemetry correlation", val: "+38%", width: "38%" },
      { label: "Git timing attribution", val: "+28%", width: "28%" },
      { label: "Session dropoff vector", val: "+18%", width: "18%" },
      { label: "Error log clustering", val: "+12%", width: "12%" }
    ],
    initialConv: "32%",
    restoredConv: "64%",
    recoveredRev: "$52K – $58K",
    aiResponses: {
      "Why did conversion drop?": "Signup conversion dropped 28.4% immediately following deployment #2839 due to an invalid OAuth redirect URI matching policy.",
      "Why are users leaving?": "Users clicking 'Sign in with Google' receive a 400 redirect_uri_mismatch error and bounce before reaching onboarding.",
      "What changed today?": "Deployment #2839 updated identity authentication services at 08:30 AM without syncing staging and production OAuth client secrets."
    }
  },
  support: {
    id: "INC-2835",
    name: "Support tickets exploded",
    icon: "🎫",
    heroMetricLabel: "Support Volume",
    heroMetricVal: "↑ 410%",
    heroMetricSub: "Onboarding tickets ↑ 520% · CSAT ↓ 1.8pts",
    incidentTitle: "SUPPORT TICKET SURGE",
    rootCause: "Broken workspace onboarding token expiration in deployment <code>#2835</code>",
    confidence: "92%",
    confidenceVal: 92,
    impact: "1,450 blocked enterprise seats",
    reasoning: '"Support ticket volume spiked 410% within 15 minutes of deployment #2835. 89% of tickets specifically contain the phrase \'Invalid invitation link\'."',
    recommendation: 'Deploy hotfix <code>#2836</code> to repair email token signature verification on team invitation acceptances.',
    breakdown: [
      { label: "Ticket keyword clustering", val: "+35%", width: "35%" },
      { label: "Auth token stack traces", val: "+27%", width: "27%" },
      { label: "Deployment timing correlation", val: "+20%", width: "20%" },
      { label: "Enterprise cohort isolation", val: "+10%", width: "10%" }
    ],
    initialConv: "19%",
    restoredConv: "84%",
    recoveredRev: "1,450 Seats",
    aiResponses: {
      "Why did conversion drop?": "Support tickets increased by 410% because invited workspace members are receiving 'Token Expired' errors on fresh invitation links.",
      "Why are users leaving?": "Invited team members cannot join enterprise organizations, stalling active user growth across 42 enterprise accounts.",
      "What changed today?": "Deployment #2835 pushed a JWT token expiration change from 7 days to 7 minutes by mistake in the invitation worker service."
    }
  }
};

let currentScenarioKey = "checkout";

function switchIncidentScenario(scenarioKey) {
  const scen = INCIDENT_SCENARIOS[scenarioKey];
  if (!scen) return;
  currentScenarioKey = scenarioKey;

  // 1. Update Scenario Buttons UI
  document.querySelectorAll(".scenario-btn").forEach(btn => btn.classList.remove("active"));
  const activeBtn = document.getElementById(`btn-scenario-${scenarioKey}`);
  if (activeBtn) activeBtn.classList.add("active");

  // 2. Update Hero Metrics
  const heroH1 = document.querySelector(".hero-h1");
  const heroMetricVal = document.querySelector(".hero-metric-val");
  const heroMetricSub = document.querySelector(".hero-metric-sub");
  if (heroMetricVal) heroMetricVal.textContent = scen.heroMetricVal;
  if (heroMetricSub) heroMetricSub.textContent = scen.heroMetricSub;

  // 3. Update Diagnosis Card
  const diagId = document.querySelector(".diag-id-tag");
  const diagTitle = document.querySelector(".diag-title");
  const diagValue = document.querySelector(".diag-value");
  const confScore = document.getElementById("diag-confidence-score");
  const confFill = document.getElementById("confidence-fill");
  const reasoningText = document.querySelector(".reasoning-text");
  const impactText = document.querySelector(".diag-impact");

  if (diagId) diagId.textContent = `INCIDENT #${scen.id}`;
  if (diagTitle) diagTitle.textContent = scen.incidentTitle;
  if (diagValue) diagValue.innerHTML = scen.rootCause;
  if (confScore) confScore.textContent = scen.confidence;
  if (confFill) confFill.style.width = `${scen.confidenceVal}%`;
  if (reasoningText) reasoningText.textContent = scen.reasoning;
  if (impactText) impactText.textContent = scen.impact;

  // 4. Update Breakdown Weights
  const weightRows = document.querySelector(".evidence-weight-rows");
  if (weightRows && scen.breakdown) {
    weightRows.innerHTML = scen.breakdown.map(b => `
      <div class="weight-row">
        <span class="weight-label">${b.label}</span>
        <div class="weight-bar-wrap"><div class="weight-bar-fill" style="width: ${b.width};"></div></div>
        <span class="weight-val">${b.val}</span>
      </div>
    `).join("");
  }

  // 5. Update Recommendation & Reset Recovery Simulation
  const recFixText = document.querySelector(".rec-fix-text");
  const simConvVal = document.getElementById("sim-conversion-val");
  const simConvStatus = document.getElementById("sim-conversion-status");
  const simRevVal = document.getElementById("sim-revenue-val");
  const simRevStatus = document.getElementById("sim-revenue-status");
  const statusPill = document.getElementById("recovery-status-pill");
  const btnSim = document.getElementById("btn-simulate-recovery");

  if (recFixText) recFixText.innerHTML = scen.recommendation;
  if (simConvVal) {
    simConvVal.textContent = scen.initialConv;
    simConvVal.classList.remove("recovered");
  }
  if (simConvStatus) simConvStatus.textContent = "Current degraded baseline";
  if (simRevVal) {
    simRevVal.textContent = "$0";
    simRevVal.classList.remove("recovered");
  }
  if (simRevStatus) simRevStatus.textContent = "Projected recovery potential";
  if (statusPill) statusPill.classList.remove("visible");
  if (btnSim) btnSim.className = "btn-simulate-recovery";

  recoverySimulationProgress = 0;

  // 6. Update AI Assistant Default Response
  const aiRespText = document.getElementById("ai-response-text");
  if (aiRespText) {
    aiRespText.textContent = scen.aiResponses["Why did conversion drop?"];
  }

  // Smoothly scroll to diagnosis so user sees the change
  const diagCard = document.getElementById("diagnosis");
  if (diagCard) {
    diagCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

/* ==========================================================================
   SIMPLYWHY AI FLOATING ASSISTANT CONTROLLER
   ========================================================================== */
function toggleAIAssistant() {
  const windowEl = document.getElementById("ai-assistant-window");
  if (!windowEl) return;
  windowEl.classList.toggle("open");
}

function askAIAssistant(promptText) {
  const scen = INCIDENT_SCENARIOS[currentScenarioKey] || INCIDENT_SCENARIOS.checkout;
  const answer = scen.aiResponses[promptText] || scen.reasoning;
  const contentEl = document.getElementById("ai-response-text");
  if (!contentEl) return;

  contentEl.style.opacity = "0.4";
  setTimeout(() => {
    contentEl.textContent = answer;
    contentEl.style.opacity = "1";
  }, 180);
}

function closeAIAndScroll(selector) {
  const windowEl = document.getElementById("ai-assistant-window");
  if (windowEl) windowEl.classList.remove("open");
  setTimeout(() => {
    scrollToSection(selector);
  }, 200);
}

