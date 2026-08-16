/**
 * SIMPLYWHY — ROOT CAUSE INTELLIGENCE
 * Visual-First Architecture, Intelligence Core Centerpiece, Causal Graph & Investigation Engine
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
  initHeroIntelligenceCoreCanvas();
  initCinemaEvidenceCanvas();
  initCinemaRecoveryCanvas();
  initConvergenceCanvas();
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
   1. HERO INTELLIGENCE CORE (5 Streams -> Central Processor)
   ========================================================================== */
function initHeroIntelligenceCoreCanvas() {
  const canvas = document.getElementById("heroCoreCanvas");
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

  const streams = [
    { name: 'BEHAVIOR', x: 0.10, y: 0.25, color: '#22D3EE' },
    { name: 'SUPPORT', x: 0.30, y: 0.20, color: '#F59E0B' },
    { name: 'PRODUCT', x: 0.50, y: 0.18, color: '#3B82F6' },
    { name: 'ENGINEERING', x: 0.70, y: 0.20, color: '#00F5A0' },
    { name: 'CONTEXT', x: 0.90, y: 0.25, color: '#EF4444' }
  ];

  function draw() {
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    const coreX = w * 0.5;
    const coreY = h * 0.65;

    // Draw Stream Lines to Core
    streams.forEach((s, idx) => {
      const sx = s.x * w;
      const sy = s.y * h;

      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.quadraticCurveTo(sx, coreY, coreX, coreY);
      ctx.strokeStyle = `rgba(255, 255, 255, 0.08)`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Traveling Data Particles
      const progress = (t * 0.8 + idx * 0.2) % 1;
      const px = (1 - progress) * (1 - progress) * sx + 2 * (1 - progress) * progress * sx + progress * progress * coreX;
      const py = (1 - progress) * (1 - progress) * sy + 2 * (1 - progress) * progress * coreY + progress * progress * coreY;

      ctx.beginPath();
      ctx.arc(px, py, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.shadowColor = s.color;
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Draw Central Processor Core
    const pulse = Math.sin(t * 3) * 2;
    ctx.beginPath();
    ctx.arc(coreX, coreY, 14 + pulse, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0, 245, 160, 0.12)";
    ctx.strokeStyle = "rgba(0, 245, 160, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(coreX, coreY, 6, 0, Math.PI * 2);
    ctx.fillStyle = "#00F5A0";
    ctx.shadowColor = "#00F5A0";
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;

    t += 0.02;
    requestAnimationFrame(draw);
  }
  draw();
}

function scrollToInvestigation() {
  const el = document.getElementById("investigation");
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ==========================================================================
   2. CINEMATIC AUTONOMOUS INVESTIGATION ENGINE (CENTERPIECE)
   ========================================================================== */
let currentCinemaStep = 0;
let isDemoAutoplaying = true;
let demoAutoplayTimeout = null;
let isInvestigationInView = false;
let neuralBrainState = "STANDBY";

const DEMO_STEP_DURATIONS = [4500, 4800, 5200, 5000, 6000];

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
      label.textContent = "SIMPLYWHY ENGINE · STANDBY";
      if (activityText) activityText.textContent = "Waiting for investigation...";
      break;
    case "INGESTING":
      dot.classList.add("dot-ingesting");
      label.textContent = "RECEIVING SIGNALS (5/5)";
      if (activityText) activityText.textContent = "INGESTING";
      break;
    case "ANALYZING":
      dot.classList.add("dot-processing");
      label.textContent = "ANALYZING & TESTING HYPOTHESES";
      if (activityText) activityText.textContent = "EVALUATING";
      break;
    case "CORRELATING":
      dot.classList.add("dot-correlating");
      label.textContent = "ISOLATING CAUSAL VECTOR";
      if (activityText) activityText.textContent = "CAUSAL GRAPH";
      break;
    case "RESOLVED":
      dot.classList.add("dot-resolved");
      label.textContent = "ROOT CAUSE FOUND";
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
  const hypoPanel = document.getElementById("hypothesis-eval-panel");
  const canvasBox = document.getElementById("graph-canvas-box");
  const causalChain = document.getElementById("graph-causal-chain");

  // Update Scrubber Pills
  scrubSteps.forEach((step, idx) => {
    step.classList.toggle("active", idx === stepIndex);
  });

  if (!frame) return;

  // Step 0: Signals Arrive & Replay
  if (stepIndex === 0) {
    frame.classList.remove("view-split", "view-verdict");
    const banner = document.getElementById("rage-click-banner");
    if (banner) banner.classList.remove("visible");
    if (urlText) urlText.textContent = "store.acme.com/checkout/pay";
    if (statusText) statusText.textContent = "Step 1/5: Receiving signals & session playback";
    setBrainState("INGESTING");
    playSessionReplayLoop();
  }
  // Step 1: Hypothesis Testing & Elimination
  else if (stepIndex === 1) {
    frame.classList.add("view-split");
    frame.classList.remove("view-verdict");
    if (hypoPanel) hypoPanel.style.display = "flex";
    if (canvasBox) canvasBox.style.display = "none";
    if (causalChain) causalChain.style.display = "none";

    if (urlText) urlText.textContent = "simplywhy.ai/hypotheses/INC-2841";
    if (statusText) statusText.textContent = "Step 2/5: Evaluating evidence & eliminating weak causes";
    setBrainState("ANALYZING");
    runHypothesisEliminationSequence();
  }
  // Step 2: Causal Graph Construction
  else if (stepIndex === 2) {
    frame.classList.add("view-split");
    frame.classList.remove("view-verdict");
    if (hypoPanel) hypoPanel.style.display = "none";
    if (canvasBox) canvasBox.style.display = "block";
    if (causalChain) causalChain.style.display = "flex";

    if (urlText) urlText.textContent = "simplywhy.ai/causal-graph/INC-2841";
    if (statusText) statusText.textContent = "Step 3/5: Dynamic Causal Graph isolating root cause";
    setBrainState("CORRELATING");
    if (typeof resizeCinemaEvidence === 'function') resizeCinemaEvidence();
  }
  // Step 3: Root Cause Found
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

/* Hypothesis Elimination Animation */
function runHypothesisEliminationSequence() {
  const hNet = document.getElementById("hypo-net");
  const hDb = document.getElementById("hypo-db");
  const hPay = document.getElementById("hypo-pay");
  const hBrowser = document.getElementById("hypo-browser");
  const hDeploy = document.getElementById("hypo-deploy");

  // Reset
  [hNet, hDb, hPay].forEach(el => { if (el) el.classList.remove("hypo-eliminated"); });
  if (hDeploy) hDeploy.classList.remove("hypo-confirmed");

  setTimeout(() => { if (hNet) hNet.classList.add("hypo-eliminated"); }, 600);
  setTimeout(() => { if (hDb) hDb.classList.add("hypo-eliminated"); }, 1200);
  setTimeout(() => { if (hPay) hPay.classList.add("hypo-eliminated"); }, 1800);
  setTimeout(() => { if (hDeploy) hDeploy.classList.add("hypo-confirmed"); }, 2400);
}

/* Flying Signal Particle Animation */
function launchFlyingSignalParticle() {
  const particle = document.getElementById("flying-signal-particle");
  const payBtn = document.getElementById("demo-pay-btn");
  const canvasBox = document.querySelector(".graph-canvas-box");
  if (!particle || !payBtn || !canvasBox) return;

  const btnRect = payBtn.getBoundingClientRect();
  const boxRect = canvasBox.getBoundingClientRect();

  particle.style.transition = 'none';
  particle.style.left = `${btnRect.left - boxRect.left + btnRect.width / 2}px`;
  particle.style.top = `${btnRect.top - boxRect.top + btnRect.height / 2}px`;
  particle.style.opacity = '1';

  requestAnimationFrame(() => {
    particle.style.transition = 'all 0.7s cubic-bezier(0.22, 1, 0.36, 1)';
    particle.style.left = '50%';
    particle.style.top = '40%';
    setTimeout(() => {
      particle.style.opacity = '0';
    }, 650);
  });
}

/* Viewport-Triggered Initialization */
function initCinematicScrollEngine() {
  const investigationSection = document.getElementById("investigation");
  if (!investigationSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
        if (!isInvestigationInView) {
          isInvestigationInView = true;
          setBrainState("INGESTING");
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
   SIMULATED BROWSER SESSION REPLAY
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

  cursor.style.top = "50px";
  cursor.style.left = "40px";
  btn.classList.remove("btn-stuck", "btn-clicked");
  if (spinner) spinner.style.display = "none";
  if (banner && currentCinemaStep === 0) banner.classList.remove("visible");
  if (playhead) playhead.style.left = "15%";
  if (progress) progress.style.width = "15%";

  setTimeout(() => {
    cursor.style.top = `${btn.offsetTop + 14}px`;
    cursor.style.left = `${btn.offsetLeft + btn.offsetWidth / 2}px`;
    if (playhead) playhead.style.left = "45%";
    if (progress) progress.style.width = "45%";
  }, 600);

  setTimeout(() => {
    if (pulse) {
      pulse.classList.remove("pulse-active");
      void pulse.offsetWidth;
      pulse.classList.add("pulse-active");
    }
    btn.classList.add("btn-clicked");
    if (spinner) spinner.style.display = "inline-block";
  }, 1400);

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
    launchFlyingSignalParticle();
  }, 2600);
}

function replaySessionAnimation() {
  playSessionReplayLoop();
}

/* ==========================================================================
   ANIMATED CAUSAL GRAPH CANVAS (NODE-BY-NODE CONSTRUCTION)
   ========================================================================== */
let resizeCinemaEvidence = null;

const causalNodes = [
  { id: 'safari', label: 'Safari 17.2', x: 0.12, y: 0.35, radius: 14, color: '#22D3EE', isCausal: true },
  { id: 'btn', label: 'Payment Button', x: 0.30, y: 0.35, radius: 14, color: '#EF4444', isCausal: true },
  { id: 'err', label: 'Validation Error', x: 0.50, y: 0.35, radius: 16, color: '#F59E0B', isCausal: true },
  { id: 'drop', label: 'Checkout Drop', x: 0.70, y: 0.35, radius: 16, color: '#EF4444', isCausal: true },
  { id: 'deploy', label: 'Deploy #2841', x: 0.88, y: 0.35, radius: 18, color: '#00F5A0', isCausal: true },
  // Unrelated / Noise Nodes
  { id: 'auth', label: 'Auth Token TTL', x: 0.40, y: 0.75, radius: 9, color: '#71717A', isCausal: false },
  { id: 'db', label: 'DB Query Index', x: 0.60, y: 0.75, radius: 9, color: '#71717A', isCausal: false }
];

const causalEdges = [
  { from: 'safari', to: 'btn', isCausal: true },
  { from: 'btn', to: 'err', isCausal: true },
  { from: 'err', to: 'drop', isCausal: true },
  { from: 'drop', to: 'deploy', isCausal: true },
  { from: 'auth', to: 'db', isCausal: false },
  { from: 'db', to: 'deploy', isCausal: false }
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
    const isCorrelating = (neuralBrainState === "CORRELATING");

    // Draw Edges
    causalEdges.forEach((edge, idx) => {
      const src = causalNodes.find(n => n.id === edge.from);
      const dst = causalNodes.find(n => n.id === edge.to);
      if (!src || !dst) return;

      const sx = src.x * w;
      const sy = src.y * h;
      const dx = dst.x * w;
      const dy = dst.y * h;

      const alpha = edge.isCausal ? (isStandby ? 0.25 : 0.85) : (isCorrelating ? 0.05 : 0.2);

      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(dx, dy);
      ctx.strokeStyle = edge.isCausal 
        ? `rgba(0, 245, 160, ${alpha})` 
        : `rgba(161, 161, 170, ${alpha})`;
      ctx.lineWidth = edge.isCausal ? 2.2 : 1;
      ctx.stroke();

      if (edge.isCausal && !isStandby) {
        const progress = ((t * 1.2 + idx * 0.25) % 1);
        const px = sx + (dx - sx) * progress;
        const py = sy + (dy - sy) * progress;

        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#00F5A0";
        ctx.shadowColor = "#00F5A0";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });

    // Draw Nodes
    causalNodes.forEach(n => {
      const x = n.x * w;
      const y = n.y * h;
      const alpha = n.isCausal ? 1.0 : (isCorrelating ? 0.08 : 0.3);

      const pulse = n.isCausal ? Math.sin(t * 3 + n.x * 5) * 2 : 0;
      const r = n.radius + pulse;

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(10, 12, 16, ${0.9 * alpha})`;
      ctx.strokeStyle = n.isCausal ? "#00F5A0" : `rgba(113, 113, 122, ${alpha})`;
      ctx.lineWidth = n.isCausal ? 2 : 1;
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = n.isCausal ? "#00F5A0" : `rgba(161, 161, 170, ${alpha})`;
      ctx.fill();

      if (alpha > 0.2) {
        ctx.fillStyle = n.isCausal ? "#FAFAFA" : `rgba(161, 161, 170, ${alpha})`;
        ctx.font = "8px JetBrains Mono, monospace";
        ctx.textAlign = "center";
        ctx.fillText(n.label, x, y + r + 11);
      }
    });

    t += (isStandby ? 0.008 : 0.02);
    requestAnimationFrame(draw);
  }
  draw();
}

/* ==========================================================================
   CONVERGENCE CANVAS (FIVE SIGNALS CONVERGING INTO CORE)
   ========================================================================== */
function initConvergenceCanvas() {
  const canvas = document.getElementById("convergenceCanvas");
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
  resize();
  window.addEventListener("resize", resize);

  function draw() {
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    const cx = w * 0.5;
    const cy = h * 0.45;

    // Concentric neural rings
    for (let r = 20; r <= 55; r += 15) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 245, 160, ${0.15 - r * 0.002})`;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Rotating orbital satellites
    const satCount = 6;
    for (let i = 0; i < satCount; i++) {
      const angle = t + (i * Math.PI * 2) / satCount;
      const orbitR = 40 + Math.sin(t * 2 + i) * 6;
      const sx = cx + Math.cos(angle) * orbitR;
      const sy = cy + Math.sin(angle) * orbitR;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(sx, sy);
      ctx.strokeStyle = "rgba(0, 245, 160, 0.25)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = "#00F5A0";
      ctx.shadowColor = "#00F5A0";
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Central core glowing nucleus
    ctx.beginPath();
    ctx.arc(cx, cy, 10 + Math.sin(t * 3) * 2, 0, Math.PI * 2);
    ctx.fillStyle = "#00F5A0";
    ctx.shadowColor = "#00F5A0";
    ctx.shadowBlur = 14;
    ctx.fill();
    ctx.shadowBlur = 0;

    t += 0.02;
    requestAnimationFrame(draw);
  }
  draw();
}

function showSignalTooltip(type) {
  // Handled by CSS hover, interactive function available if needed
}

function hideSignalTooltip() {
  // Handled by CSS
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
    symptom: "Signup completion fell 28.4%",
    signals: "OAuth 400 errors + Form abandonment + Deploy #2839",
    cause: "OAuth callback domain whitelist mismatch"
  },
  support: {
    badge: "ONBOARDING FLOW DIAGNOSIS",
    conf: "92% CONFIDENCE",
    symptom: "Support ticket volume surged 410%",
    signals: "401 Token Expired logs + Zendesk 'invite broken' + Commit #2835",
    cause: "Workspace invitation JWT expiration bug"
  },
  revenue: {
    badge: "PAYMENT PROCESSING DIAGNOSIS",
    conf: "95% CONFIDENCE",
    symptom: "Daily GMV fell $34K across European tiers",
    signals: "Stripe 422 Unprocessable + EUR dropoff + Deploy #2828",
    cause: "Currency rounding overflow on VAT calculation engine"
  },
  latency: {
    badge: "INFRASTRUCTURE DIAGNOSIS",
    conf: "93% CONFIDENCE",
    symptom: "API p99 latency spiked 120ms → 4,200ms",
    signals: "Slow query log spike + Connection pool exhaustion + Commit #2830",
    cause: "Unindexed database query migration in release #2830"
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

  if (badge) badge.textContent = data.badge;
  if (conf) conf.textContent = data.conf;
  if (symptom) symptom.textContent = data.symptom;
  if (cause) cause.textContent = data.cause;
  if (signals) signals.textContent = data.signals;
}

/* ==========================================================================
   INTERACTIVE COPILOT ASSISTANT WITH MINI-INVESTIGATION FLOW
   ========================================================================== */
function toggleAIAssistant() {
  const win = document.getElementById("ai-assistant-window");
  if (win) win.classList.toggle("open");
}

function askAIAssistant(prompt) {
  const progressBox = document.getElementById("ai-mini-progress");
  const stepMsg = document.getElementById("ai-step-msg");
  const barFill = document.getElementById("ai-bar-fill");
  const responseArea = document.getElementById("ai-response-area");
  const responseText = document.getElementById("ai-response-text");

  if (!progressBox || !responseText) return;

  // Show Mini-Investigation Simulation
  progressBox.style.display = "flex";
  if (responseArea) responseArea.style.display = "none";

  if (stepMsg) stepMsg.textContent = "Ingesting 5 telemetry streams...";
  if (barFill) barFill.style.width = "25%";

  setTimeout(() => {
    if (stepMsg) stepMsg.textContent = "SimplyWhy Core processing evidence...";
    if (barFill) barFill.style.width = "60%";
  }, 450);

  setTimeout(() => {
    if (stepMsg) stepMsg.textContent = "Isolating causal vector...";
    if (barFill) barFill.style.width = "90%";
  }, 900);

  setTimeout(() => {
    progressBox.style.display = "none";
    if (responseArea) responseArea.style.display = "block";

    if (prompt.includes("conversion")) {
      responseText.innerHTML = "CHECKOUT CONVERSION ↓18.4%<br><br><strong>ROOT CAUSE:</strong> Payment validation loop in deployment #2841 (94% confidence). 78% of affected checkout drops are isolated to Safari 17.2 WebKit regex handler.";
    } else if (prompt.includes("today")) {
      responseText.innerHTML = "7 deployments pushed today across core services.<br><br><strong>CRITICAL ANOMALY:</strong> Checkout validation loop (#2841). Recommended action: Rollback commit #2841.";
    } else {
      responseText.innerHTML = "PRIORITY INVESTIGATION: Checkout Conversion drop (-18.4%).<br><br><strong>ATTRIBUTION:</strong> Causal vector resolved to deployment #2841 with 94% attribution confidence.";
    }
  }, 1350);
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
