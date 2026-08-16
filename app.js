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
  initEvidenceCanvas();
  initTimelineScroll();
  initSignalsInteractivity();
  initScanKeyboardAccessibility();
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
   WHY CHAIN INTERACTIVE DRILL-DOWN
   ========================================================================== */
const whySteps = [
  { text: "WHY DID REVENUE DROP?", hint: "Click to investigate deeper →", final: false },
  { text: "WHY DID CHECKOUT CONVERSION DROP?", hint: "Click to analyze user behavior →", final: false },
  { text: "WHY ARE USERS ABANDONING CHECKOUT?", hint: "Click to isolate cohorts →", final: false },
  { text: "WHY ARE SAFARI USERS FAILING?", hint: "Click to correlate engineering changes →", final: false },
  { 
    text: "PAYMENT VALIDATION BUG", 
    hint: "Root cause verified.", 
    final: true, 
    detail: "Introduced in deployment <code>#2841</code>. Safari autofill triggered infinite validation loops on the payment submit handler." 
  }
];

let currentWhyIndex = 0;

function advanceWhyChain() {
  if (currentWhyIndex < whySteps.length - 1) {
    currentWhyIndex++;
  } else {
    currentWhyIndex = 0;
  }

  const step = whySteps[currentWhyIndex];
  const button = document.getElementById("why-current");
  const hint = document.getElementById("why-hint");
  const detail = document.getElementById("why-detail");

  if (!button) return;

  // Animation transition
  button.style.transform = "scale(0.95)";
  button.style.opacity = "0.4";

  setTimeout(() => {
    button.textContent = step.text;
    button.className = step.final ? "why-step final" : "why-step";
    button.style.transform = "scale(1)";
    button.style.opacity = "1";

    if (hint) {
      hint.textContent = step.hint;
      hint.className = step.final ? "why-step-hint" : "why-step-hint visible";
    }

    if (detail) {
      if (step.final && step.detail) {
        detail.innerHTML = step.detail;
        detail.classList.add("visible");
      } else {
        detail.classList.remove("visible");
      }
    }
  }, 180);
}

/* ==========================================================================
   SIGNALS INTERACTIVITY
   ========================================================================== */
function initSignalsInteractivity() {
  const cards = document.querySelectorAll(".signal-card");
  cards.forEach(card => {
    card.addEventListener("mouseenter", () => {
      cards.forEach(c => c.classList.remove("highlighted"));
      card.classList.add("highlighted");
    });
  });
}

/* ==========================================================================
   EVIDENCE GRAPH CANVAS
   ========================================================================== */
let evidenceNodes = [];

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
        y: h * 0.16,
        color: "#8B5CF6",
        meta: { "Tickets": "283 complaints", "Spike": "+37%", "Keyword": "Payment stuck" }
      },
      {
        id: "session",
        name: "SESSION",
        x: w * 0.18,
        y: h * 0.38,
        color: "#38BDF8",
        meta: { "Sessions": "12,481", "Avg Duration": "1m 12s", "Drop Step": "Payment" }
      },
      {
        id: "checkout",
        name: "CHECKOUT",
        x: w * 0.5,
        y: h * 0.38,
        color: "#F59E0B",
        meta: { "Conversion": "68% → 47%", "Failure Rate": "31.2%", "Cohort": "Safari Mobile" }
      },
      {
        id: "funnel",
        name: "FUNNEL",
        x: w * 0.82,
        y: h * 0.38,
        color: "#38BDF8",
        meta: { "Step 1": "94%", "Step 2": "86%", "Step 3 (Pay)": "47%" }
      },
      {
        id: "rage",
        name: "RAGE CLICKS",
        x: w * 0.18,
        y: h * 0.65,
        color: "#EF4444",
        meta: { "Count": "1,842 clicks", "Element": "#btn-pay-now", "Intensity": "High" }
      },
      {
        id: "deploy",
        name: "DEPLOY #2841",
        x: w * 0.5,
        y: h * 0.65,
        color: "#EF4444",
        meta: { "Time": "10:12 AM", "Author": "payments-team", "Impact": "+31% errors", "Correlation": "94%" }
      },
      {
        id: "bug",
        name: "PAYMENT BUG",
        x: w * 0.5,
        y: h * 0.84,
        color: "#00F5A0",
        meta: { "Type": "Regex Loop", "Target": "Safari Autofill", "Severity": "P0" }
      }
    ];
  }

  resize();
  window.addEventListener("resize", resize);

  let hoveredNode = null;
  let animTime = 0;

  // Mouse hover detection
  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    let found = null;
    evidenceNodes.forEach(node => {
      const dist = Math.hypot(node.x - mx, node.y - my);
      if (dist < 42) {
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

      tooltip.style.left = `${Math.min(found.x + 15, rect.width - 220)}px`;
      tooltip.style.top = `${Math.max(found.y - 40, 10)}px`;
      tooltip.classList.add("visible");
    } else if (tooltip) {
      tooltip.classList.remove("visible");
    }
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
      ["checkout", "deploy"],
      ["deploy", "bug"]
    ];

    links.forEach(([fromId, toId]) => {
      const from = evidenceNodes.find(n => n.id === fromId);
      const to = evidenceNodes.find(n => n.id === toId);
      if (!from || !to) return;

      const isHigh = hoveredNode && (hoveredNode.id === fromId || hoveredNode.id === toId);

      ctx.strokeStyle = isHigh ? 'rgba(0, 245, 160, 0.8)' : 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = isHigh ? 2 : 1;
      ctx.setLineDash(isHigh ? [] : [6, 4]);

      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();

      // Traveling pulse
      const pulseProg = (animTime + from.x * 0.01) % 1;
      const px = from.x + (to.x - from.x) * pulseProg;
      const py = from.y + (to.y - from.y) * pulseProg;

      ctx.fillStyle = isHigh ? '#00F5A0' : from.color;
      ctx.shadowBlur = isHigh ? 10 : 4;
      ctx.shadowColor = ctx.fillStyle;
      ctx.beginPath();
      ctx.arc(px, py, isHigh ? 3.5 : 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    ctx.setLineDash([]);

    // Draw Nodes
    evidenceNodes.forEach(node => {
      const isHovered = hoveredNode && hoveredNode.id === node.id;
      const boxW = 120;
      const boxH = 34;

      ctx.save();
      ctx.fillStyle = isHovered ? 'rgba(30, 32, 40, 0.95)' : 'rgba(17, 17, 19, 0.9)';
      ctx.strokeStyle = isHovered ? '#00F5A0' : (node.color || 'rgba(255, 255, 255, 0.2)');
      ctx.lineWidth = isHovered ? 2 : 1;

      if (isHovered) {
        ctx.shadowColor = '#00F5A0';
        ctx.shadowBlur = 16;
      }

      ctx.beginPath();
      ctx.roundRect(node.x - boxW / 2, node.y - boxH / 2, boxW, boxH, 8);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      ctx.font = '600 11px "JetBrains Mono", monospace';
      ctx.fillStyle = isHovered ? '#00F5A0' : '#FAFAFA';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.name, node.x, node.y);
    });

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   INCIDENT TIMELINE SCROLL ANIMATION
   ========================================================================== */
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
          }, i * 220);
        });
        observer.unobserve(timeline);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(timeline);
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

