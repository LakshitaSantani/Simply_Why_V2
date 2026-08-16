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
  initCinemaEvidenceCanvas();
  initCinemaRecoveryCanvas();
  initLiveTelemetryTicker();
  setBrainState("STANDBY");
  initCinematicScrollEngine();
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
   2. CINEMATIC AUTONOMOUS FLOW & NEURAL BRAIN ENGINE
   ========================================================================== */
let currentCinemaStep = 0;
let isDemoAutoplaying = true;
let demoAutoplayTimeout = null;
let isInvestigationInView = false;
let neuralBrainState = "STANDBY"; // STANDBY, INGESTING, PROCESSING, CORRELATING, FILTERING, RESOLVED

const DEMO_STEP_DURATIONS = [4500, 3800, 5200, 5000, 6000];

/* Brain State Labels & UI Updates */
function setBrainState(state) {
  neuralBrainState = state;
  const pill = document.getElementById("brain-status-pill");
  const dot = pill ? pill.querySelector(".brain-status-dot") : null;
  const label = document.getElementById("brain-status-label");
  const activityText = document.getElementById("neural-activity-text");

  if (!label || !dot) return;

  dot.className = "brain-status-dot";

  switch (state) {
    case "STANDBY":
      dot.classList.add("dot-standby");
      label.textContent = "NEURAL CORE · STANDBY";
      if (activityText) activityText.textContent = "IDLE";
      break;
    case "INGESTING":
      dot.classList.add("dot-ingesting");
      label.textContent = "INGESTING SIGNALS (5/5)";
      if (activityText) activityText.textContent = "INGESTING";
      break;
    case "PROCESSING":
      dot.classList.add("dot-processing");
      label.textContent = "NEURAL CORE · PROCESSING";
      if (activityText) activityText.textContent = "REASONING";
      break;
    case "CORRELATING":
      dot.classList.add("dot-correlating");
      label.textContent = "CROSS-STREAM CORRELATING";
      if (activityText) activityText.textContent = "SYNCHRONIZING";
      break;
    case "FILTERING":
      dot.classList.add("dot-filtering");
      label.textContent = "FILTERING NOISE (94% CONF)";
      if (activityText) activityText.textContent = "ISOLATING";
      break;
    case "RESOLVED":
      dot.classList.add("dot-resolved");
      label.textContent = "ROOT CAUSE ISOLATED";
      if (activityText) activityText.textContent = "94% CONFIDENCE";
      break;
  }
}

function startDemoAutoplay() {
  isDemoAutoplaying = true;
  updateDemoToggleButton();
  scheduleNextDemoStep();
}

function pauseDemoAutoplay() {
  isDemoAutoplaying = false;
  clearTimeout(demoAutoplayTimeout);
  updateDemoToggleButton();
}

function toggleDemoAutoplay() {
  if (isDemoAutoplaying) {
    pauseDemoAutoplay();
  } else {
    startDemoAutoplay();
  }
}

function updateDemoToggleButton() {
  const icon = document.getElementById("demo-play-icon");
  const label = document.getElementById("demo-play-label");
  const btn = document.getElementById("btn-demo-autoplay");
  if (btn) btn.classList.toggle("is-paused", !isDemoAutoplaying);
  if (icon) icon.textContent = isDemoAutoplaying ? "⏸" : "▶";
  if (label) label.textContent = isDemoAutoplaying ? "Auto-playing" : "Play demo";
}

function scheduleNextDemoStep() {
  clearTimeout(demoAutoplayTimeout);
  if (!isDemoAutoplaying || !isInvestigationInView) return;

  const duration = DEMO_STEP_DURATIONS[currentCinemaStep] || 4500;
  demoAutoplayTimeout = setTimeout(() => {
    if (!isDemoAutoplaying || !isInvestigationInView) return;
    const nextStep = (currentCinemaStep + 1) % 5;
    setCinematicStep(nextStep, false);
    scheduleNextDemoStep();
  }, duration);
}

function setCinematicStep(stepIndex, isUserClick = true) {
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

  // Step 0: Session Replay
  if (stepIndex === 0) {
    frame.classList.remove("view-split", "view-verdict");
    const banner = document.getElementById("rage-click-banner");
    if (banner) banner.classList.remove("visible");
    if (urlText) urlText.textContent = "store.acme.com/checkout/pay";
    if (statusText) statusText.textContent = "Step 1/5: Session playback active";
    setBrainState("STANDBY");
    playSessionReplayLoop();
  }
  // Step 1: Anomaly & Signal Ejection
  else if (stepIndex === 1) {
    frame.classList.remove("view-split", "view-verdict");
    const banner = document.getElementById("rage-click-banner");
    if (banner) banner.classList.add("visible");
    if (urlText) urlText.textContent = "simplywhy.ai/anomaly-alert/SAFARI-CHK";
    if (statusText) statusText.textContent = "Step 2/5: Rage clicks detected · Signal dispatched to Neural Core";
    setBrainState("INGESTING");
    launchFlyingSignalParticle();
  }
  // Step 2: Causal Evidence & Neural Processing
  else if (stepIndex === 2) {
    frame.classList.add("view-split");
    frame.classList.remove("view-verdict");
    if (urlText) urlText.textContent = "simplywhy.ai/causal-graph/INC-2841";
    if (statusText) statusText.textContent = "Step 3/5: Neural Core filtering noise & isolating cause";
    setBrainState("PROCESSING");
    setTimeout(() => {
      if (currentCinemaStep === 2) setBrainState("FILTERING");
    }, 2200);
    if (typeof resizeCinemaEvidence === 'function') resizeCinemaEvidence();
  }
  // Step 3: Root Cause Isolated
  else if (stepIndex === 3) {
    frame.classList.remove("view-split");
    frame.classList.add("view-verdict");
    if (urlText) urlText.textContent = "simplywhy.ai/diagnosis/INC-2841";
    if (statusText) statusText.textContent = "Step 4/5: Root cause identified with 94% confidence";
    setBrainState("RESOLVED");
  }
  // Step 4: Projected Recovery
  else if (stepIndex === 4) {
    frame.classList.remove("view-split");
    frame.classList.add("view-verdict");
    if (urlText) urlText.textContent = "simplywhy.ai/recovery-projection/INC-2841";
    if (statusText) statusText.textContent = "Step 5/5: Remediation projected (+21.0 pts conversion)";
    setBrainState("RESOLVED");
    if (typeof animateRecoveryCurve === 'function') animateRecoveryCurve();
  }

  if (isUserClick && isDemoAutoplaying) {
    scheduleNextDemoStep();
  }
}

/* Flying Signal Particle Animation (Session Replay -> Neural Core) */
function launchFlyingSignalParticle() {
  const particle = document.getElementById("flying-signal-particle");
  const payBtn = document.getElementById("demo-pay-btn");
  const canvasBox = document.querySelector(".graph-canvas-box");
  if (!particle || !payBtn || !canvasBox) return;

  const btnRect = payBtn.getBoundingClientRect();
  const boxRect = canvasBox.getBoundingClientRect();

  // Position at button
  particle.style.transition = 'none';
  particle.style.left = `${btnRect.left - boxRect.left + btnRect.width / 2}px`;
  particle.style.top = `${btnRect.top - boxRect.top + btnRect.height / 2}px`;
  particle.style.opacity = '1';

  // Animate towards Neural Core center
  requestAnimationFrame(() => {
    particle.style.transition = 'all 0.7s cubic-bezier(0.22, 1, 0.36, 1)';
    particle.style.left = '45%';
    particle.style.top = '40%';
    setTimeout(() => {
      particle.style.opacity = '0';
    }, 650);
  });
}

/* Viewport-Triggered Initialization with IntersectionObserver */
function initCinematicScrollEngine() {
  const investigationSection = document.getElementById("investigation");
  if (!investigationSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
        if (!isInvestigationInView) {
          isInvestigationInView = true;
          // Wake up the Neural Core & start autonomous flow
          setBrainState("STANDBY");
          startDemoAutoplay();
        }
      } else if (!entry.isIntersecting) {
        isInvestigationInView = false;
        clearTimeout(demoAutoplayTimeout);
      }
    });
  }, { threshold: [0, 0.2, 0.5] });

  observer.observe(investigationSection);
}

/* ==========================================================================
   REALISTIC SIMULATED BROWSER SESSION REPLAY
   ========================================================================== */
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
   ADVANCED NEURAL CORE & COMPUTATIONAL BRAIN CANVAS
   ========================================================================== */
let resizeCinemaEvidence = null;

// Multi-layered Neural Brain Network Nodes
const neuralNodes = [
  // Layer 0: Input Streams (Left)
  { id: 'session', label: 'Session Replays', x: 0.12, y: 0.22, radius: 14, color: '#22D3EE', isCausal: true, isInput: true },
  { id: 'errors', label: 'Error Logs', x: 0.12, y: 0.44, radius: 13, color: '#EF4444', isCausal: false, isInput: true },
  { id: 'support', label: 'Support Tickets', x: 0.12, y: 0.64, radius: 13, color: '#F59E0B', isCausal: false, isInput: true },
  { id: 'deploy', label: 'Git Deploy #2841', x: 0.12, y: 0.84, radius: 14, color: '#00F5A0', isCausal: true, isInput: true },

  // Layer 1: Hidden Processing Synapses (Center-Left)
  { id: 'h_safari', label: 'Safari 17.2 Check', x: 0.38, y: 0.26, radius: 16, color: '#22D3EE', isCausal: true },
  { id: 'h_auth', label: 'Auth Token TTL', x: 0.36, y: 0.50, radius: 10, color: '#71717A', isCausal: false },
  { id: 'h_db', label: 'DB Latency Spike', x: 0.38, y: 0.74, radius: 10, color: '#71717A', isCausal: false },

  // Layer 2: Hidden Reasoning Clusters (Center-Right)
  { id: 'h_checkout', label: 'Checkout Failure', x: 0.62, y: 0.36, radius: 18, color: '#EF4444', isCausal: true },
  { id: 'h_cart', label: 'Cart Hydration', x: 0.62, y: 0.68, radius: 10, color: '#71717A', isCausal: false },

  // Layer 3: Causal Output Verdict (Right)
  { id: 'h_validation', label: 'Validation Loop', x: 0.86, y: 0.42, radius: 20, color: '#00F5A0', isCausal: true }
];

// Synaptic Connections
const neuralEdges = [
  // Causal Vector Connections (Primary)
  { from: 'session', to: 'h_safari', isCausal: true },
  { from: 'h_safari', to: 'h_checkout', isCausal: true },
  { from: 'h_checkout', to: 'h_validation', isCausal: true },
  { from: 'deploy', to: 'h_validation', isCausal: true },

  // Background / Noise Connections (Filtered out in later steps)
  { from: 'errors', to: 'h_auth', isCausal: false },
  { from: 'support', to: 'h_checkout', isCausal: false },
  { from: 'support', to: 'h_cart', isCausal: false },
  { from: 'deploy', to: 'h_db', isCausal: false },
  { from: 'h_auth', to: 'h_cart', isCausal: false },
  { from: 'h_db', to: 'h_validation', isCausal: false }
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

    const isStandby = (neuralBrainState === "STANDBY");
    const isProcessing = (neuralBrainState === "PROCESSING" || neuralBrainState === "INGESTING");
    const isFiltering = (neuralBrainState === "FILTERING");
    const isResolved = (neuralBrainState === "RESOLVED");

    // Dynamic Alpha for Noise vs Causal Paths
    const noiseAlpha = isStandby ? 0.08 : (isProcessing ? 0.4 : (isFiltering ? 0.06 : 0.02));
    const causalAlpha = isStandby ? 0.25 : (isProcessing ? 0.8 : 1.0);

    // Draw Synaptic Links
    neuralEdges.forEach((edge, idx) => {
      const src = neuralNodes.find(n => n.id === edge.from);
      const dst = neuralNodes.find(n => n.id === edge.to);
      if (!src || !dst) return;

      const sx = src.x * w;
      const sy = src.y * h;
      const dx = dst.x * w;
      const dy = dst.y * h;

      const alpha = edge.isCausal ? causalAlpha : noiseAlpha;
      if (alpha <= 0.01) return;

      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(dx, dy);
      ctx.strokeStyle = edge.isCausal 
        ? `rgba(0, 245, 160, ${alpha * 0.7})` 
        : `rgba(161, 161, 170, ${alpha * 0.4})`;
      ctx.lineWidth = edge.isCausal ? 2.2 : 1;
      ctx.stroke();

      // Photon packet propagation along the synapse
      if (!isStandby && (edge.isCausal || isProcessing)) {
        const speed = edge.isCausal ? 1.2 : 0.7;
        const progress = ((t * speed + idx * 0.2) % 1);
        const px = sx + (dx - sx) * progress;
        const py = sy + (dy - sy) * progress;

        ctx.beginPath();
        ctx.arc(px, py, edge.isCausal ? 3 : 2, 0, Math.PI * 2);
        ctx.fillStyle = edge.isCausal ? "#00F5A0" : "#38BDF8";
        ctx.shadowColor = edge.isCausal ? "#00F5A0" : "#38BDF8";
        ctx.shadowBlur = edge.isCausal ? 8 : 4;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });

    // Draw Neural Nodes & Processing Clusters
    neuralNodes.forEach(n => {
      const x = n.x * w;
      const y = n.y * h;

      const alpha = n.isCausal ? causalAlpha : noiseAlpha;
      if (alpha <= 0.01) return;

      // Pulse wave for active nodes
      const pulseSize = (!isStandby && n.isCausal) ? Math.sin(t * 3 + n.x * 10) * 3 : 0;
      const currentRadius = n.radius + pulseSize;

      // Node background
      ctx.beginPath();
      ctx.arc(x, y, currentRadius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(10, 12, 16, ${0.9 * alpha})`;
      ctx.strokeStyle = n.isCausal ? (isResolved ? "#00F5A0" : n.color) : `rgba(113, 113, 122, ${alpha})`;
      ctx.lineWidth = n.isCausal ? 2 : 1;
      ctx.fill();
      ctx.stroke();

      // Center core light
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = n.isCausal ? "#00F5A0" : `rgba(161, 161, 170, ${alpha})`;
      ctx.fill();

      // Node Label
      if (alpha > 0.3 || n.isCausal) {
        ctx.fillStyle = n.isCausal ? "#FAFAFA" : `rgba(161, 161, 170, ${alpha})`;
        ctx.font = "8.5px JetBrains Mono, monospace";
        ctx.textAlign = "center";
        ctx.fillText(n.label, x, y + currentRadius + 11);
      }
    });

    t += (isStandby ? 0.006 : 0.018);
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
