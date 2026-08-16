/**
 * SIMPLYWHY — ROOT CAUSE INTELLIGENCE
 * Visual-First Product Demo, Autonomous Scroll Controller & Visualizations
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
  const originalBtnText = submitBtn ? submitBtn.innerText : "Get early access →";

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
  initCinematicScrollEngine();
  initCinemaEvidenceCanvas();
  initCinemaRecoveryCanvas();
  initLiveTelemetryTicker();
  playSessionReplayLoop();
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
  ctx.beginPath();
  ctx.arc(lastX, lastY, 2.5, 0, Math.PI * 2);
  ctx.fill();
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

    // Baseline grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
    ctx.lineWidth = 1;
    for (let y = 15; y < h; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Telemetry wave
    ctx.beginPath();
    for (let x = 0; x <= w; x += 3) {
      const dropWeight = x > w * 0.5 ? Math.sin((x - w * 0.5) / (w * 0.5) * Math.PI) * 16 : 0;
      const y = h * 0.5 + Math.sin((x * 0.04) + t) * 8 + dropWeight;
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

function scrollToInvestigation() {
  const el = document.getElementById("investigation");
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ==========================================================================
   2. CINEMATIC STICKY SCROLL ENGINE & FRAME CONTROLLER
   ========================================================================== */
let currentCinemaStep = 0;

function setCinematicStep(stepIndex) {
  currentCinemaStep = stepIndex;

  const frame = document.getElementById("cinema-app-frame");
  const scrubSteps = document.querySelectorAll(".scrub-step");
  const urlText = document.getElementById("frame-url-text");
  const statusText = document.getElementById("frame-status-text");

  // Update Scrubber Pills
  scrubSteps.forEach((step, idx) => {
    step.classList.toggle("active", idx === stepIndex);
  });

  if (!frame) return;

  // State Transitions
  if (stepIndex === 0) {
    // 01: Full Session Replay Focus
    frame.classList.remove("view-split", "view-verdict");
    if (urlText) urlText.textContent = "store.acme.com/checkout/pay";
    if (statusText) statusText.textContent = "Step 1/5: Session playback active";
  } else if (stepIndex === 1) {
    // 02: Anomaly & Rage Click Freeze
    frame.classList.remove("view-split", "view-verdict");
    const banner = document.getElementById("rage-click-banner");
    if (banner) banner.classList.add("visible");
    if (urlText) urlText.textContent = "simplywhy.ai/anomaly-alert/SAFARI-CHK";
    if (statusText) statusText.textContent = "Step 2/5: Rage clicks detected · Freezing session";
  } else if (stepIndex === 2) {
    // 03: Split Replay + Neural Causal Graph
    frame.classList.add("view-split");
    frame.classList.remove("view-verdict");
    if (urlText) urlText.textContent = "simplywhy.ai/causal-graph/INC-2841";
    if (statusText) statusText.textContent = "Step 3/5: Cross-stream causal vector isolated";
    if (typeof resizeCinemaEvidence === 'function') resizeCinemaEvidence();
  } else if (stepIndex === 3) {
    // 04: Root Cause Found
    frame.classList.remove("view-split");
    frame.classList.add("view-verdict");
    if (urlText) urlText.textContent = "simplywhy.ai/diagnosis/INC-2841";
    if (statusText) statusText.textContent = "Step 4/5: Root cause identified with 94% confidence";
  } else if (stepIndex === 4) {
    // 05: Projected Recovery
    frame.classList.remove("view-split");
    frame.classList.add("view-verdict");
    if (urlText) urlText.textContent = "simplywhy.ai/recovery-projection/INC-2841";
    if (statusText) statusText.textContent = "Step 5/5: Remediation projected (+21.0 pts conversion)";
    if (typeof animateRecoveryCurve === 'function') animateRecoveryCurve();
  }
}

/* Scroll Listener for Milestone Progression */
function initCinematicScrollEngine() {
  const container = document.getElementById("cinematic-container");
  if (!container) return;

  window.addEventListener("scroll", () => {
    const rect = container.getBoundingClientRect();
    const totalHeight = rect.height - window.innerHeight;
    if (totalHeight <= 0) return;

    // Relative scroll progress through the container: 0 to 1
    const progress = Math.max(0, Math.min(1, -rect.top / totalHeight));

    const stepIndex = Math.min(4, Math.floor(progress * 5));
    if (stepIndex !== currentCinemaStep) {
      setCinematicStep(stepIndex);
    }
  }, { passive: true });
}

/* ==========================================================================
   REALISTIC SIMULATED BROWSER SESSION REPLAY
   ========================================================================== */
let replayTimer = null;

function playSessionReplayLoop() {
  const cursor = document.getElementById("virtual-cursor");
  const pulse = document.getElementById("cursor-pulse");
  const btn = document.getElementById("demo-pay-btn");
  const spinner = document.getElementById("demo-btn-spinner");
  const banner = document.getElementById("rage-click-banner");
  const playhead = document.getElementById("scrubber-playhead");
  const progress = document.getElementById("scrubber-progress");

  if (!cursor || !btn) return;

  // Reset initial positions
  cursor.style.top = "50px";
  cursor.style.left = "40px";
  btn.classList.remove("btn-stuck", "btn-clicked");
  if (spinner) spinner.style.display = "none";
  if (banner && currentCinemaStep === 0) banner.classList.remove("visible");
  if (playhead) playhead.style.left = "15%";
  if (progress) progress.style.width = "15%";

  // Step 1: Glide cursor towards payment button
  setTimeout(() => {
    cursor.style.top = `${btn.offsetTop + 14}px`;
    cursor.style.left = `${btn.offsetLeft + btn.offsetWidth / 2}px`;
    if (playhead) playhead.style.left = "45%";
    if (progress) progress.style.width = "45%";
  }, 600);

  // Step 2: First click on payment button
  setTimeout(() => {
    if (pulse) {
      pulse.classList.remove("pulse-active");
      void pulse.offsetWidth;
      pulse.classList.add("pulse-active");
    }
    btn.classList.add("btn-clicked");
    if (spinner) spinner.style.display = "inline-block";
  }, 1400);

  // Step 3: Button unresponsiveness & rapid frustrated clicks
  setTimeout(() => {
    btn.classList.add("btn-stuck");
    if (pulse) {
      pulse.classList.remove("pulse-active");
      void pulse.offsetWidth;
      pulse.classList.add("pulse-active");
    }
  }, 2100);

  setTimeout(() => {
    if (pulse) {
      pulse.classList.remove("pulse-active");
      void pulse.offsetWidth;
      pulse.classList.add("pulse-active");
    }
    if (banner) banner.classList.add("visible");
    if (playhead) playhead.style.left = "75%";
    if (progress) progress.style.width = "75%";
  }, 2600);
}

function replaySessionAnimation() {
  playSessionReplayLoop();
}

/* ==========================================================================
   NEURAL EVIDENCE GRAPH CANVAS
   ========================================================================== */
let resizeCinemaEvidence = null;

const cinemaNodes = [
  { id: 'safari', label: 'Safari 17.2', x: 0.18, y: 0.35, radius: 18, color: '#22D3EE', isCausal: true },
  { id: 'checkout', label: 'Checkout Failures', x: 0.45, y: 0.45, radius: 22, color: '#EF4444', isCausal: true },
  { id: 'validation', label: 'Validation Loop', x: 0.72, y: 0.45, radius: 24, color: '#F59E0B', isCausal: true },
  { id: 'deploy', label: 'Deploy #2841', x: 0.90, y: 0.75, radius: 20, color: '#00F5A0', isCausal: true }
];

const cinemaEdges = [
  { from: 'safari', to: 'checkout' },
  { from: 'checkout', to: 'validation' },
  { from: 'validation', to: 'deploy' }
];

function initCinemaEvidenceCanvas() {
  const canvas = document.getElementById("cinemaEvidenceCanvas");
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
  resizeCinemaEvidence = resize;
  resize();
  window.addEventListener("resize", resize);

  function draw() {
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    // Draw Causal Links
    cinemaEdges.forEach((edge, idx) => {
      const src = cinemaNodes.find(n => n.id === edge.from);
      const dst = cinemaNodes.find(n => n.id === edge.to);
      if (!src || !dst) return;

      const sx = src.x * w;
      const sy = src.y * h;
      const dx = dst.x * w;
      const dy = dst.y * h;

      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(dx, dy);
      ctx.strokeStyle = "rgba(0, 245, 160, 0.4)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Traveling photon particle along link
      const progress = ((t * 0.8 + idx * 0.3) % 1);
      const px = sx + (dx - sx) * progress;
      const py = sy + (dy - sy) * progress;

      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#00F5A0";
      ctx.shadowColor = "#00F5A0";
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Draw Nodes
    cinemaNodes.forEach(n => {
      const x = n.x * w;
      const y = n.y * h;

      ctx.beginPath();
      ctx.arc(x, y, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(14, 16, 22, 0.9)";
      ctx.strokeStyle = n.color;
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#FAFAFA";
      ctx.font = "9px JetBrains Mono, monospace";
      ctx.textAlign = "center";
      ctx.fillText(n.label, x, y + n.radius + 12);
    });

    t += 0.015;
    requestAnimationFrame(draw);
  }
  draw();
}

/* ==========================================================================
   RECOVERY PROJECTION CANVAS
   ========================================================================== */
let recoveryAnimationProgress = 0;

function initCinemaRecoveryCanvas() {
  const canvas = document.getElementById("cinemaRecoveryCanvas");
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
    const endY = h * 0.75 - (recoveryAnimationProgress * (h * 0.55));
    ctx.bezierCurveTo(w * 0.35, h * 0.75, w * 0.65, endY, w - 10, endY);
    ctx.strokeStyle = "#00F5A0";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    requestAnimationFrame(draw);
  }
  draw();
}

function animateRecoveryCurve() {
  let step = 0;
  const total = 30;
  const interval = setInterval(() => {
    step++;
    recoveryAnimationProgress = step / total;
    if (step >= total) clearInterval(interval);
  }, 25);
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

  const buttons = document.querySelectorAll(".uc-btn");
  buttons.forEach(btn => {
    btn.classList.toggle("active", btn.textContent.toLowerCase().includes(key));
  });

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
    text.textContent = "Watch the live investigation above. SimplyWhy has already isolated the culprit to deployment #2841 with 94% attribution confidence.";
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

  let seconds = 1.8;
  setInterval(() => {
    seconds = (Math.random() * 2 + 1).toFixed(1);
    scanTime.textContent = `${seconds}s ago`;
  }, 4000);
}
