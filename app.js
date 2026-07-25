/**
 * TRACEMINT — CALM 3D NEURAL ENGINE
 * Dynamic connector lines drawn via canvas overlay.
 * Storytelling scroll animations. Smooth waitlist scroll.
 */

const brainCauses = {
  pricing: {
    title: "Pricing Expectation Mismatch",
    desc: "Users hesitate at checkout step 3 because the <code>[Bill Annually]</code> default creates an expectation mismatch regarding trial billing.",
    action: "Update copy to <em>'Bill Annually (starts after 14-day trial)'</em> → <strong>+28% recovery</strong>",
    whys: [
      { num: "WHY 1", label: "Replay Friction", desc: "61% mouse pause over annual badge before exit.", color: "text-cyan" },
      { num: "WHY 2", label: "Support Ticket Spike", desc: "19 tickets asking 'Am I charged immediately?'.", color: "text-amber" },
      { num: "WHY 3", label: "Code Deployment Trigger", desc: "Commit #b7a9 defaulted toggle to Annual plan.", color: "text-mint" }
    ]
  },
  onboarding: {
    title: "Onboarding Step 2 Hidden CTA",
    desc: "The <code>Skip for now</code> button is pushed 140px below the fold on 13-inch laptop displays, stalling workspace setup.",
    action: "Sticky-position CTA at card bottom → <strong>+34% completion</strong>",
    whys: [
      { num: "WHY 1", label: "Viewport Clipping", desc: "140px vertical push hides primary action.", color: "text-cyan" },
      { num: "WHY 2", label: "Session Abandonment", desc: "41.2% users exit without inviting team.", color: "text-amber" },
      { num: "WHY 3", label: "Device Correlation", desc: "88% of stalls occur on 13-inch Macbook Pro displays.", color: "text-mint" }
    ]
  },
  discoverability: {
    title: "Feature Discoverability Failure",
    desc: "78% of trial users abandon before creating their first report because the <code>+ New Query</code> CTA is hidden inside a secondary menu.",
    action: "Move CTA to primary top navbar → <strong>+42% activation</strong>",
    whys: [
      { num: "WHY 1", label: "Nav Nesting", desc: "CTA nested 2 clicks deep in dropdown.", color: "text-cyan" },
      { num: "WHY 2", label: "Zero Click Heatmap", desc: "Only 12% mouse hover over secondary tools menu.", color: "text-amber" },
      { num: "WHY 3", label: "Trial Drop-off", desc: "78% drop-off within first 3 minutes of workspace creation.", color: "text-mint" }
    ]
  },
  form: {
    title: "Checkout Form Validation Friction",
    desc: "Card exp date field fails silently on safari browsers when auto-filling, triggering 3x rage clicks before tab exit.",
    action: "Patch input format regex → <strong>+$95k ARR pipeline</strong>",
    whys: [
      { num: "WHY 1", label: "Browser Regex Bug", desc: "Safari autofill bypasses input change listener.", color: "text-cyan" },
      { num: "WHY 2", label: "Rage Click Cluster", desc: "Avg. 3.4 rage clicks on #cc-exp input field.", color: "text-amber" },
      { num: "WHY 3", label: "Silent Failure", desc: "Form submit button stays disabled without error message.", color: "text-mint" }
    ]
  }
};

let canvas, ctx;
let angleX = 0, angleY = 0;
let targetAngleX = 0, targetAngleY = 0;
let nodes = [];
let streamParticles = [];
let lightningArcs = [];
let shockwaves = [];


/* ===== CONNECTOR LINE DRAWING ===== */
let connectorCanvas, connectorCtx;
let connectorAnimFrame = 0;

document.addEventListener("DOMContentLoaded", () => {
  // Storytelling reveals
  setupStoryReveals();

  // Terminal UI
  initHeroTerminal();
  
  setupConsoleTimer();
  setupNavScroll();
  setupAmbientParticles();
  initBrainCanvas();
  initConnectorCanvas();

  // Hero reveals
  setTimeout(() => {
    document.querySelectorAll(".reveal, .reveal-line").forEach(el => {
      const delay = parseInt(el.getAttribute("data-delay") || "0", 10);
      setTimeout(() => el.classList.add("visible"), delay);
    });
  }, 100);
});

/* ---------- NAV SCROLL EFFECT ---------- */
function setupNavScroll() {
  const nav = document.getElementById("main-nav");
  if (!nav) return;
  window.addEventListener("scroll", () => {
    nav.classList.toggle("nav-scrolled", window.scrollY > 40);
  });
}

/* ---------- SUPABASE INITIALIZATION ---------- */
const SUPABASE_URL = "https://zicsyeqpeovivqneexzp.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_8kmrh0zIz1IK02zO5NgoFw_7V1NNQ6d"; 
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ---------- WAITLIST FORM SUBMIT ---------- */
async function handleWaitlistSubmit(e) {
  e.preventDefault();
  const emailInput = document.getElementById("w-email");
  const roleInput = document.getElementById("w-role");
  const email = emailInput ? emailInput.value.trim() : "";
  const role = roleInput ? roleInput.value.trim() : "";
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn ? submitBtn.innerText : "Join the waitlist";

  if (email && email.includes("@")) {
    if (submitBtn) {
      submitBtn.innerText = "Joining...";
      submitBtn.disabled = true;
    }

    // Send data to Supabase
    const { data, error } = await supabaseClient
      .from('waitlist')
      .insert([
        { email: email, role: role }
      ]);

    if (error) {
      console.error('Supabase Error:', error);
      alert('There was an issue joining the waitlist: ' + (error.message || JSON.stringify(error)));
      if (submitBtn) {
        submitBtn.innerText = originalBtnText;
        submitBtn.disabled = false;
      }
      return;
    }

    const card = document.querySelector(".waitlist-card-dark");
    if (card) {
      card.innerHTML = `
        <div class="waitlist-brand-title">
          <span class="w-mint-dot"></span>
          <span class="w-brand-text">SimplyWhy</span>
        </div>
        <div style="font-size:2.5rem;margin:10px 0;color:#00F5A0;">✓</div>
        <h3 style="font-family:var(--serif);font-size:1.8rem;color:#FFF;">You're on the waitlist!</h3>
        <p style="font-size:0.95rem;color:#94A3B8;max-width:320px;">Spot reserved for <strong>${email}</strong>. We'll reach out as early access rolls out.</p>
        <div class="waitlist-footer-note" style="margin-top:20px;">EARLY ACCESS PRIORITY QUEUE #SW-${Math.floor(1000 + Math.random() * 9000)}</div>
      `;
    }
  }
}

/* ---------- CONSOLE TIMER TICKER ---------- */
function setupConsoleTimer() {
  const timerEl = document.getElementById("console-time");
  if (!timerEl) return;
  let ms = 124;
  setInterval(() => {
    ms += 1;
    const seconds = (12 + (ms / 1000)).toFixed(2);
    timerEl.textContent = `00:00:${seconds}s`;
  }, 100);
}

/* ========================================================================
   DYNAMIC CONNECTOR LINES — drawn on a canvas overlay
   Reads actual DOM positions of input cards and output WHY items
   ======================================================================== */
function initConnectorCanvas() {
  connectorCanvas = document.getElementById("connectorCanvas");
  if (!connectorCanvas) return;
  connectorCtx = connectorCanvas.getContext("2d");
  
  drawConnectors();
  window.addEventListener("resize", drawConnectors);
}

function drawConnectors() {
  if (!connectorCanvas || !connectorCtx) return;

  const grid = document.getElementById("brain-tri-grid");
  if (!grid) return;

  const gridRect = grid.getBoundingClientRect();

  // Size canvas to match grid
  connectorCanvas.width = gridRect.width;
  connectorCanvas.height = gridRect.height;

  connectorCtx.clearRect(0, 0, connectorCanvas.width, connectorCanvas.height);

  // Get brain canvas center (relative to grid)
  const brainCanvas = document.getElementById("brainCanvas");
  if (!brainCanvas) return;
  const brainRect = brainCanvas.getBoundingClientRect();
  const brainCX = brainRect.left - gridRect.left + brainRect.width / 2;
  const brainCY = brainRect.top - gridRect.top + brainRect.height / 2;

  // Input nodes
  const inputCards = document.querySelectorAll(".trace-node-card");
  const inputColors = ["#38BDF8", "#F59E0B", "#8B5CF6", "#00F5A0"];

  inputCards.forEach((card, i) => {
    const cardRect = card.getBoundingClientRect();
    const startX = cardRect.right - gridRect.left;
    const startY = cardRect.top - gridRect.top + cardRect.height / 2;

    const endX = brainCX - brainRect.width * 0.25;
    const endY = brainCY + (i - 1.5) * 18;

    const color = inputColors[i % inputColors.length];
    drawCurvedConnector(startX, startY, endX, endY, color, 'input', i);
  });

  // Output WHY items
  const whyItems = document.querySelectorAll(".why-item");
  const outputColors = ["#00F5A0", "#38BDF8", "#8B5CF6"];

  whyItems.forEach((item, i) => {
    const itemRect = item.getBoundingClientRect();
    const endX = itemRect.left - gridRect.left;
    const endY = itemRect.top - gridRect.top + itemRect.height / 2;

    const startX = brainCX + brainRect.width * 0.25;
    const startY = brainCY + (i - 1) * 22;

    const color = outputColors[i % outputColors.length];
    drawCurvedConnector(startX, startY, endX, endY, color, 'output', i);
  });

  // Animate dash offset
  connectorAnimFrame++;
  requestAnimationFrame(animateConnectors);
}

function animateConnectors() {
  if (!connectorCanvas || !connectorCtx) return;

  const grid = document.getElementById("brain-tri-grid");
  if (!grid) return;
  const gridRect = grid.getBoundingClientRect();

  connectorCanvas.width = gridRect.width;
  connectorCanvas.height = gridRect.height;
  connectorCtx.clearRect(0, 0, connectorCanvas.width, connectorCanvas.height);

  const brainCanvas = document.getElementById("brainCanvas");
  if (!brainCanvas) return;
  const brainRect = brainCanvas.getBoundingClientRect();
  const brainCX = brainRect.left - gridRect.left + brainRect.width / 2;
  const brainCY = brainRect.top - gridRect.top + brainRect.height / 2;

  connectorAnimFrame++;

  // Input connectors
  const inputCards = document.querySelectorAll(".trace-node-card");
  const inputColors = ["#38BDF8", "#F59E0B", "#8B5CF6", "#00F5A0"];

  inputCards.forEach((card, i) => {
    const cardRect = card.getBoundingClientRect();
    const startX = cardRect.right - gridRect.left;
    const startY = cardRect.top - gridRect.top + cardRect.height / 2;
    const endX = brainCX - brainRect.width * 0.25;
    const endY = brainCY + (i - 1.5) * 18;
    drawCurvedConnector(startX, startY, endX, endY, inputColors[i], 'input', i);
  });

  // Output connectors
  const whyItems = document.querySelectorAll(".why-item");
  const outputColors = ["#00F5A0", "#38BDF8", "#8B5CF6"];

  whyItems.forEach((item, i) => {
    const itemRect = item.getBoundingClientRect();
    const endX = itemRect.left - gridRect.left;
    const endY = itemRect.top - gridRect.top + itemRect.height / 2;
    const startX = brainCX + brainRect.width * 0.25;
    const startY = brainCY + (i - 1) * 22;
    drawCurvedConnector(startX, startY, endX, endY, outputColors[i], 'output', i);
  });

  requestAnimationFrame(animateConnectors);
}

function drawCurvedConnector(x1, y1, x2, y2, color, direction, index) {
  const ctx = connectorCtx;
  if (!ctx) return;

  const midX = (x1 + x2) / 2;
  const cp1x = x1 + (x2 - x1) * 0.35;
  const cp2x = x1 + (x2 - x1) * 0.65;

  // Animated dash
  const dashOffset = direction === 'input' 
    ? -(connectorAnimFrame * 0.5 + index * 20) 
    : (connectorAnimFrame * 0.5 + index * 20);

  // Glow layer
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 6;
  ctx.globalAlpha = 0.08;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.bezierCurveTo(cp1x, y1, cp2x, y2, x2, y2);
  ctx.stroke();
  ctx.restore();

  // Main line
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.6;
  ctx.setLineDash([8, 5]);
  ctx.lineDashOffset = dashOffset;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.bezierCurveTo(cp1x, y1, cp2x, y2, x2, y2);
  ctx.stroke();
  ctx.restore();

  // Endpoint glowing dots
  ctx.save();
  ctx.fillStyle = color;
  ctx.shadowBlur = 8;
  ctx.shadowColor = color;
  ctx.globalAlpha = 0.8;
  
  ctx.beginPath();
  ctx.arc(x1, y1, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x2, y2, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/* ========================================================================
   3D BRAIN CANVAS RENDERER — Calm rotation
   ======================================================================== */
function initBrainCanvas() {
  canvas = document.getElementById("brainCanvas");
  if (!canvas) return;
  ctx = canvas.getContext("2d");

  const wrapper = document.getElementById("canvas-wrapper");
  if (wrapper) {
    wrapper.addEventListener("mousemove", (e) => {
      const rect = wrapper.getBoundingClientRect();
      const mx = e.clientX - rect.left - rect.width / 2;
      const my = e.clientY - rect.top - rect.height / 2;
      targetAngleY = (mx / rect.width) * 0.3;
      targetAngleX = (-my / rect.height) * 0.3;
    });
    wrapper.addEventListener("mouseleave", () => {
      targetAngleX = 0;
      targetAngleY = 0;
    });
  }

  // Generate brain cortex nodes
  nodes = [];
  const totalNodes = 60;
  for (let i = 0; i < totalNodes; i++) {
    const u = Math.random() * Math.PI * 2;
    const v = Math.random() * Math.PI - Math.PI / 2;
    const rx = 120 + Math.sin(u * 3) * 12;
    const ry = 85 + Math.cos(v * 3) * 10;
    const rz = 75 + Math.sin(v * 2) * 10;

    nodes.push({
      baseX: rx * Math.cos(v) * Math.cos(u),
      baseY: ry * Math.cos(v) * Math.sin(u) * 0.88,
      baseZ: rz * Math.sin(v),
      pulse: Math.random() * Math.PI * 2,
      color: i % 3 === 0 ? "#00F5A0" : (i % 2 === 0 ? "#38BDF8" : "#8B5CF6")
    });
  }

  requestAnimationFrame(renderBrainCanvas);
}

function renderBrainCanvas(time) {
  if (!canvas || !ctx) return;

  // Resize canvas to container
  const wrapper = document.getElementById("canvas-wrapper");
  if (wrapper) {
    const rect = wrapper.getBoundingClientRect();
    if (canvas.width !== rect.width || canvas.height !== rect.height) {
      canvas.width = rect.width;
      canvas.height = rect.height;
    }
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  // Very calm, slow rotation — almost meditative
  angleY += (targetAngleY + (Date.now() * 0.00003) - angleY) * 0.008;
  angleX += (targetAngleX + Math.sin(Date.now() * 0.00008) * 0.04 - angleX) * 0.008;

  const cosY = Math.cos(angleY), sinY = Math.sin(angleY);
  const cosX = Math.cos(angleX), sinX = Math.sin(angleX);
  const breathScale = 1 + Math.sin(Date.now() * 0.0008) * 0.025;

  const projectedNodes = [];

  nodes.forEach(node => {
    node.pulse += 0.012;
    let x0 = node.baseX * breathScale;
    let y0 = node.baseY * breathScale;
    let z0 = node.baseZ * breathScale;

    let x1 = x0 * cosY - z0 * sinY;
    let z1 = z0 * cosY + x0 * sinY;
    let y1 = y0 * cosX - z1 * sinX;
    let z2 = z1 * cosX + y0 * sinX;

    const scale = 280 / (280 + z2);
    const px = cx + x1 * scale;
    const py = cy + y1 * scale;

    projectedNodes.push({ px, py, scale, color: node.color, pulse: node.pulse, z: z2 });
  });

  projectedNodes.sort((a, b) => a.z - b.z);

  // Shockwave rings
  for (let i = shockwaves.length - 1; i >= 0; i--) {
    const sw = shockwaves[i];
    sw.r += sw.speed;
    sw.alpha -= 0.012;
    ctx.strokeStyle = `rgba(0, 245, 160, ${sw.alpha})`;
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#00F5A0";
    ctx.beginPath();
    ctx.arc(cx, cy, sw.r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
    if (sw.alpha <= 0) shockwaves.splice(i, 1);
  }

  // Constellation web lines
  ctx.lineWidth = 0.7;
  for (let i = 0; i < projectedNodes.length; i++) {
    for (let j = i + 1; j < projectedNodes.length; j++) {
      const n1 = projectedNodes[i];
      const n2 = projectedNodes[j];
      const dist = Math.hypot(n1.px - n2.px, n1.py - n2.py);
      if (dist < 60) {
        const alpha = (1 - dist / 60) * 0.25 * Math.min(n1.scale, n2.scale);
        ctx.strokeStyle = n1.color === n2.color ? n1.color : "rgba(56, 189, 248, 0.3)";
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.moveTo(n1.px, n1.py);
        ctx.lineTo(n2.px, n2.py);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }

  // Lightning arcs
  if (Math.random() < 0.08) {
    const idx1 = Math.floor(Math.random() * projectedNodes.length);
    const idx2 = Math.floor(Math.random() * projectedNodes.length);
    const n1 = projectedNodes[idx1];
    const n2 = projectedNodes[idx2];
    if (Math.hypot(n1.px - n2.px, n1.py - n2.py) < 100) {
      lightningArcs.push({ x1: n1.px, y1: n1.py, x2: n2.px, y2: n2.py, alpha: 0.6, color: Math.random() > 0.5 ? "#00F5A0" : "#38BDF8" });
    }
  }

  for (let i = lightningArcs.length - 1; i >= 0; i--) {
    const arc = lightningArcs[i];
    arc.alpha -= 0.04;
    ctx.strokeStyle = arc.color;
    ctx.globalAlpha = arc.alpha;
    ctx.lineWidth = 1.2;
    ctx.shadowBlur = 5;
    ctx.shadowColor = arc.color;
    ctx.beginPath();
    ctx.moveTo(arc.x1, arc.y1);
    ctx.lineTo((arc.x1 + arc.x2) / 2 + (Math.random() * 10 - 5), (arc.y1 + arc.y2) / 2 + (Math.random() * 10 - 5));
    ctx.lineTo(arc.x2, arc.y2);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    if (arc.alpha <= 0) lightningArcs.splice(i, 1);
  }

  // Glowing nodes
  projectedNodes.forEach(n => {
    const r = Math.max(1.5, (2.5 + Math.sin(n.pulse) * 0.8) * n.scale);
    ctx.shadowBlur = 8;
    ctx.shadowColor = n.color;
    ctx.fillStyle = n.color;
    ctx.beginPath();
    ctx.arc(n.px, n.py, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  });

  // Signal stream particles
  for (let i = streamParticles.length - 1; i >= 0; i--) {
    const p = streamParticles[i];
    p.progress += p.speed;
    const x = p.startX + (cx - p.startX) * p.progress;
    const y = p.startY + (cy - p.startY) * p.progress;

    ctx.shadowBlur = 12;
    ctx.shadowColor = p.color;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(x, y, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    if (p.progress >= 1) {
      shockwaves.push({ r: 5, speed: 1.5, alpha: 0.5 });
      streamParticles.splice(i, 1);
    }
  }

  requestAnimationFrame(renderBrainCanvas);
}

/* ---------- TRIGGER SIGNAL STREAM ---------- */
function triggerBrainSignal(nodeType) {
  const statusText = document.getElementById("brain-status-text");
  if (statusText) statusText.textContent = `Ingesting ${nodeType.toUpperCase()} Telemetry...`;

  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      streamParticles.push({
        startX: 10,
        startY: 50 + Math.random() * 250,
        progress: 0,
        speed: 0.014 + Math.random() * 0.006,
        color: Math.random() > 0.5 ? "#00F5A0" : "#38BDF8"
      });
    }, i * 200);
  }

  setTimeout(() => {
    if (statusText) statusText.textContent = "Synthesizing Behavioral Traces...";
  }, 1600);
}

/* ---------- RUN NEURAL SYNTHESIS ---------- */
function runNeuralSynthesis() {
  const statusText = document.getElementById("brain-status-text");
  const diagCard = document.getElementById("diag-console-card");

  if (statusText) statusText.textContent = "Synthesizing Multimodal Patterns...";

  for (let i = 0; i < 12; i++) {
    setTimeout(() => {
      streamParticles.push({
        startX: 10,
        startY: 30 + Math.random() * 280,
        progress: 0,
        speed: 0.014 + Math.random() * 0.006,
        color: i % 3 === 0 ? "#00F5A0" : (i % 2 === 0 ? "#38BDF8" : "#8B5CF6")
      });
    }, i * 150);
  }

  setTimeout(() => {
    if (diagCard) {
      diagCard.style.transform = "scale(0.98)";
      diagCard.style.opacity = "0.7";
    }
    setTimeout(() => {
      if (diagCard) {
        diagCard.style.transform = "scale(1)";
        diagCard.style.opacity = "1";
      }
      if (statusText) statusText.textContent = "Verified Root Causes Synthesized!";
    }, 400);
  }, 2200);
}

/* ---------- CAUSE CHIP SWITCHER ---------- */
function switchBrainCause(type) {
  document.querySelectorAll(".cause-chip").forEach(chip => chip.classList.remove("active"));
  const targetBtn = event ? event.target : null;
  if (targetBtn) targetBtn.classList.add("active");

  const data = brainCauses[type];
  if (!data) return;

  const titleEl = document.getElementById("diag-title");
  const descEl = document.getElementById("diag-desc");
  const fixEl = document.getElementById("diag-fix-text");
  const listEl = document.getElementById("why-breakdown-list");
  const cardEl = document.getElementById("diag-console-card");

  if (cardEl) {
    cardEl.style.transform = "scale(0.98)";
    cardEl.style.opacity = "0.7";
  }

  streamParticles.push({ startX: 10, startY: 190, progress: 0, speed: 0.016, color: "#00F5A0" });
  shockwaves.push({ r: 5, speed: 2, alpha: 0.6 });

  setTimeout(() => {
    if (titleEl) titleEl.textContent = data.title;
    if (descEl) descEl.innerHTML = data.desc;
    if (fixEl) fixEl.innerHTML = `Recommended Fix: ${data.action}`;

    if (listEl && data.whys) {
      listEl.innerHTML = data.whys.map(w => `
        <div class="why-item" data-why-idx="${data.whys.indexOf(w)}">
          <span class="why-num ${w.color}">${w.num}</span>
          <div class="why-info">
            <strong>${w.label}</strong>
            <p>${w.desc}</p>
          </div>
        </div>
      `).join("");
    }

    if (cardEl) {
      cardEl.style.transform = "scale(1)";
      cardEl.style.opacity = "1";
    }
  }, 250);
}

/* ---------- AMBIENT PARTICLES ---------- */
function setupAmbientParticles() {
  const container = document.getElementById("ambient-particles");
  if (!container) return;
  for (let i = 0; i < 18; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.top = Math.random() * 100 + "%";
    particle.style.setProperty("--dur", (12 + Math.random() * 14) + "s");
    particle.style.animationDelay = (Math.random() * 6) + "s";
    container.appendChild(particle);
  }
}

/* ========================================================================
   STORYTELLING SCROLL REVEAL SYSTEM
   Multiple animation types: fade-up, slide-left, slide-right, scale-in, etc.
   Staggered delays via data-story-delay attribute.
   ======================================================================== */
function setupStoryReveals() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.getAttribute("data-story-delay") || "0", 10);
        setTimeout(() => {
          entry.target.classList.add("visible");
        }, delay);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll(".story-reveal").forEach(el => observer.observe(el));

  // Comparison bars animation
  const barsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.bar-fill').forEach((bar, i) => {
          setTimeout(() => bar.classList.add('animated'), i * 150);
        });
        barsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  const barsEl = document.getElementById('compare-bars');
  if (barsEl) barsObserver.observe(barsEl);

  // Pipeline timeline scroll-triggered animation
  const pipelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animatePipeline();
        pipelineObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  const pipelineEl = document.getElementById('pipeline-timeline');
  if (pipelineEl) pipelineObserver.observe(pipelineEl);
}

function animatePipeline() {
  const fill = document.getElementById('pipeline-track-fill');
  const icons = document.querySelectorAll('.pipe-icon-ring');
  const stops = [12.5, 37.5, 62.5, 87.5];

  stops.forEach((stop, i) => {
    setTimeout(() => {
      if (fill) fill.style.width = `calc(${stop - 12.5}% )`;
      setTimeout(() => {
        if (icons[i]) icons[i].classList.add('glow');
      }, 700);
    }, i * 900);
  });
}

/* ========================================================================
   HERO TERMINAL ANIMATION
   ======================================================================== */
function initHeroTerminal() {
  const container = document.getElementById("term-logs-container");
  if (!container) return;

  // 3D Mouse Parallax Effect
  const terminalCol = document.querySelector(".hero-terminal-col");
  const terminal = document.getElementById("hero-terminal");
  
  if (terminalCol && terminal) {
    terminalCol.addEventListener("mousemove", (e) => {
      const rect = terminalCol.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -5; // max 5deg tilt
      const rotateY = ((x - centerX) / centerX) * 5;
      
      terminal.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    
    terminalCol.addEventListener("mouseleave", () => {
      terminal.style.transform = "rotateX(0deg) rotateY(0deg) translateZ(0)";
    });
  }

  const logs = [
    { badge: "ALERT", type: "alert", text: "ALERT: Checkout conversion dropped 32%" },
    { badge: "INVESTIGATING", type: "investigating", text: "Watching 8,213 session replays..." },
    { badge: "INVESTIGATING", type: "investigating", text: "Analyzing 42 support tickets..." },
    { badge: "INVESTIGATING", type: "investigating", text: "Comparing cohort behavior vectors..." },
    { badge: "INVESTIGATING", type: "investigating", text: "Cross-referencing deploy history..." },
    { badge: "✓ CAUSE FOUND", type: "cause-found", text: "CAUSE FOUND — 92% Confidence" },
    { badge: "ROOT CAUSE", type: "root-cause", text: "<span class='text-cause-italic'>\"Users think the annual pricing toggle defaults to non-refundable billing.\"</span>" }
  ];

  let currentLog = 0;

  function showNextLog() {
    if (currentLog >= logs.length) return;

    const log = logs[currentLog];
    const logEl = document.createElement("div");
    logEl.className = "term-line";
    logEl.innerHTML = `
      <span class="term-badge badge-${log.type}">${log.badge}</span>
      <span class="term-text">${log.text}</span>
    `;
    
    container.appendChild(logEl);

    // Trigger reflow to apply transition
    void logEl.offsetWidth;
    logEl.classList.add("visible");

    currentLog++;
    setTimeout(showNextLog, 1200);
  }

  setTimeout(showNextLog, 1000);
}
