const docs = {
  array: {
    code: ["insert(v): arr.push(v)", "delete(v): scan arr for v", "if found: remove + shift", "search(v): linear scan"],
    flowchart: ["Start", "Read operation", "Scan/locate", "Apply update", "Render", "End"],
    complexity: [["Insert", "O(1) amortized", "O(1)"], ["Delete", "O(n)", "O(1)"], ["Search", "O(n)", "O(1)"]],
  },
  linkedList: {
    code: ["insert(v): new.next=head", "head=new", "delete(v): traverse prev/curr", "search(v): follow next pointers"],
    flowchart: ["Start", "Choose op", "Traverse nodes", "Relink pointers", "Render", "End"],
    complexity: [["Insert", "O(1)", "O(1)"], ["Delete", "O(n)", "O(1)"], ["Search", "O(n)", "O(1)"]],
  },
  stack: {
    code: ["push(v): top++", "stack[top]=v", "pop(): return top", "search(v): scan"],
    flowchart: ["Start", "Push/Pop/Search", "Touch top", "Update stack", "Render", "End"],
    complexity: [["Push", "O(1)", "O(1)"], ["Pop", "O(1)", "O(1)"], ["Search", "O(n)", "O(1)"]],
  },
  queue: {
    code: ["enqueue(v): push rear", "dequeue(): shift front", "search(v): scan front->rear"],
    flowchart: ["Start", "Enqueue/Dequeue/Search", "Front/Rear action", "Update queue", "Render", "End"],
    complexity: [["Enqueue", "O(1)", "O(1)"], ["Dequeue", "O(1)", "O(1)"], ["Search", "O(n)", "O(1)"]],
  },
  binarySearchTree: {
    code: ["insert(v): compare root", "go left/right recursively", "delete(v): remove node", "search(v): branch by compare"],
    flowchart: ["Start", "Compare at node", "Left/Right branch", "Found?", "Update", "End"],
    complexity: [["Insert", "O(log n)*", "O(h)"], ["Delete", "O(log n)*", "O(h)"], ["Search", "O(log n)*", "O(1)"]],
  },
};

const INITIAL_DATA = [];
const state = { type: "array", data: [...INITIAL_DATA], highlight: null, action: "Init (empty structure)", busy: false };
const trace = { codeSteps: [], flowSteps: [], index: -1, timer: null };

const canvas = document.getElementById("vizCanvas");
const ctx = canvas.getContext("2d");
const traceCanvas = document.getElementById("traceCanvas");
const tctx = traceCanvas.getContext("2d");
const sceneWrap = document.getElementById("scene");
const statusEl = document.getElementById("status");
const codeEl = document.getElementById("codeBlock");
const flowEl = document.getElementById("flowchart");
const memoryEl = document.getElementById("memory");
const complexityBody = document.querySelector("#complexityTable tbody");
const valueInput = document.getElementById("valueInput");
const codeTraceEl = document.getElementById("codeTrace");
const flowTraceEl = document.getElementById("flowTrace");
const flowStatusEl = document.getElementById("flowStatus");
const opButtons = ["insertBtn", "deleteBtn", "searchBtn", "resetBtn", "stepBtn", "playBtn", "pauseBtn", "structureSelect"].map((id) => document.getElementById(id));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function setBusy(busy) { state.busy = busy; opButtons.forEach((el) => { el.disabled = busy; }); }

function resizeCanvas() {
  canvas.width = sceneWrap.clientWidth;
  canvas.height = sceneWrap.clientHeight;
  traceCanvas.width = traceCanvas.clientWidth;
  traceCanvas.height = traceCanvas.clientHeight;
}

function drawArrow(c, x1, y1, x2, y2, color = "#5eead4") {
  c.strokeStyle = color; c.lineWidth = 2;
  c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
  const angle = Math.atan2(y2 - y1, x2 - x1), s = 7;
  c.fillStyle = color;
  c.beginPath();
  c.moveTo(x2, y2);
  c.lineTo(x2 - s * Math.cos(angle - Math.PI / 6), y2 - s * Math.sin(angle - Math.PI / 6));
  c.lineTo(x2 - s * Math.cos(angle + Math.PI / 6), y2 - s * Math.sin(angle + Math.PI / 6));
  c.closePath(); c.fill();
}

function drawCube(c, x, y, w, h, d, color, text) {
  c.fillStyle = color; c.fillRect(x, y, w, h);
  c.fillStyle = "#6ea1ff";
  c.beginPath(); c.moveTo(x, y); c.lineTo(x + d, y - d); c.lineTo(x + d + w, y - d); c.lineTo(x + w, y); c.closePath(); c.fill();
  c.fillStyle = "#2a4b96";
  c.beginPath(); c.moveTo(x + w, y); c.lineTo(x + w + d, y - d); c.lineTo(x + w + d, y + h - d); c.lineTo(x + w, y + h); c.closePath(); c.fill();
  c.strokeStyle = "#dbe6ff"; c.strokeRect(x, y, w, h);
  c.fillStyle = "#f5f8ff"; c.font = "bold 16px sans-serif"; c.textAlign = "center"; c.fillText(String(text), x + w / 2, y + h / 2 + 5);
}

function structureArea() { return { x: 0, y: 0, w: canvas.width, h: Math.floor(canvas.height * 0.58) }; }
function codeFlowArea() { return { x: 0, y: Math.floor(canvas.height * 0.58), w: canvas.width, h: canvas.height - Math.floor(canvas.height * 0.58) }; }

function drawLinear(mode) {
  const a = structureArea();
  const yBase = mode === "stack" ? a.y + a.h - 65 : a.y + 95;
  state.data.forEach((value, i) => {
    const x = mode === "stack" ? a.x + a.w / 2 - 35 : a.x + 30 + i * 95;
    const y = mode === "stack" ? yBase - i * 50 : yBase;
    drawCube(ctx, x, y, 64, 40, 9, state.highlight === i ? "#25c9b7" : "#4f8cff", value);
    if ((mode === "queue" || mode === "linkedList") && i < state.data.length - 1) drawArrow(ctx, x + 72, y + 18, x + 90, y + 18);
    if (mode === "linkedList") {
      ctx.fillStyle = "#9eb1ff";
      ctx.font = "11px sans-serif";
      ctx.fillText("next", x + 46, y + 54);
    }
  });
}

function bstBuild(values) {
  const root = null;
  function insert(node, v) {
    if (!node) return { val: v, left: null, right: null };
    if (v < node.val) node.left = insert(node.left, v); else node.right = insert(node.right, v);
    return node;
  }
  let r = root;
  values.forEach((v) => { r = insert(r, v); });
  return r;
}

function bstPath(root, target) {
  const path = [];
  let n = root;
  while (n) {
    path.push(n.val);
    if (target === n.val) break;
    n = target < n.val ? n.left : n.right;
  }
  return path;
}

function drawBST() {
  const a = structureArea();
  const root = bstBuild(state.data);
  const nodes = [];
  const walk = (n, d, x) => {
    if (!n) return;
    nodes.push({ n, x, y: a.y + 50 + d * 64, d });
    walk(n.left, d + 1, x - Math.max(42, 130 - d * 16));
    walk(n.right, d + 1, x + Math.max(42, 130 - d * 16));
  };
  walk(root, 0, a.x + a.w / 2);
  nodes.forEach(({ n, x, y }) => {
    if (n.left) { const c = nodes.find((k) => k.n === n.left); drawArrow(ctx, x, y + 10, c.x, c.y - 12, "#7bc7ff"); }
    if (n.right) { const c = nodes.find((k) => k.n === n.right); drawArrow(ctx, x, y + 10, c.x, c.y - 12, "#7bc7ff"); }
  });
  nodes.forEach(({ n, x, y }) => {
    ctx.beginPath(); ctx.arc(x, y, 20, 0, Math.PI * 2);
    const idx = state.data.findIndex((v) => v === n.val);
    ctx.fillStyle = idx === state.highlight ? "#25c9b7" : "#4f8cff";
    ctx.fill(); ctx.strokeStyle = "#dbe6ff"; ctx.stroke();
    ctx.fillStyle = "#f5f8ff"; ctx.font = "bold 14px sans-serif"; ctx.textAlign = "center"; ctx.fillText(String(n.val), x, y + 5);
  });
}

function drawTraceMiniInMainCanvas() {
  const a = codeFlowArea();
  ctx.fillStyle = "#0a1126";
  ctx.fillRect(a.x, a.y, a.w, a.h);
  ctx.strokeStyle = "#263566";
  ctx.beginPath(); ctx.moveTo(a.w / 2, a.y + 8); ctx.lineTo(a.w / 2, a.y + a.h - 8); ctx.stroke();

  const lanes = [
    { title: "Code Path", steps: trace.codeSteps, x0: 15, w: a.w / 2 - 20, color: "#2f4d9e" },
    { title: "Flowchart Path", steps: trace.flowSteps, x0: a.w / 2 + 5, w: a.w / 2 - 20, color: "#2f6d77" },
  ];

  lanes.forEach((lane) => {
    ctx.fillStyle = "#a9bcff"; ctx.font = "bold 12px sans-serif"; ctx.textAlign = "left"; ctx.fillText(lane.title, lane.x0, a.y + 18);
    const steps = lane.steps;
    const nodeW = Math.max(90, Math.min(130, lane.w / Math.max(steps.length, 1) - 12));
    const nodeH = 28;
    let x = lane.x0;
    const y = a.y + 34;
    steps.forEach((s, i) => {
      drawCube(ctx, x, y, nodeW, nodeH, 6, i === trace.index ? "#5eead4" : lane.color, `${i + 1}`);
      ctx.fillStyle = i === trace.index ? "#041a17" : "#dce7ff";
      ctx.font = "11px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(s.slice(0, 15), x + 6, y + nodeH + 14);
      if (i < steps.length - 1) drawArrow(ctx, x + nodeW + 4, y + nodeH / 2, x + nodeW + 12, y + nodeH / 2, i < trace.index ? "#5eead4" : "#57679d");
      x += nodeW + 18;
    });
  });
}

function drawBackground() {
  const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
  g.addColorStop(0, "#0d1330"); g.addColorStop(1, "#0a1026");
  ctx.fillStyle = g; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#20305b";
  ctx.beginPath();
  ctx.moveTo(0, structureArea().h);
  ctx.lineTo(canvas.width, structureArea().h);
  ctx.stroke();
}

function drawTraceScene() {
  const w = traceCanvas.width, h = traceCanvas.height;
  tctx.fillStyle = "#091027"; tctx.fillRect(0, 0, w, h);
  tctx.fillStyle = "#8fa8ff"; tctx.font = "bold 14px sans-serif"; tctx.fillText("3D Trace Mirror", 12, 20);
  const steps = [...trace.codeSteps, ...trace.flowSteps];
  steps.forEach((_, i) => {
    const x = 20 + (i % 6) * 155, y = 35 + Math.floor(i / 6) * 50;
    drawCube(tctx, x, y, 120, 32, 6, i === trace.index ? "#5eead4" : "#3257a7", i + 1);
  });
}

function setTrace(codeSteps, flowSteps) { trace.codeSteps = codeSteps; trace.flowSteps = flowSteps; trace.index = -1; renderTrace(); }

function renderTrace() {
  codeTraceEl.innerHTML = trace.codeSteps.map((s, i) => `<li class="${i === trace.index ? "active" : ""}">${s}</li>`).join("");
  flowTraceEl.innerHTML = trace.flowSteps.map((s, i) => `<li class="${i === trace.index ? "active" : ""}">${s}</li>`).join("");
  flowStatusEl.textContent = trace.index < 0 ? "Trace loaded. Click Step/Auto Play." : `Step ${trace.index + 1} / ${Math.max(trace.codeSteps.length, trace.flowSteps.length)}`;
  drawTraceScene();
  renderStructure();
}

function nextTraceStep() {
  const max = Math.max(trace.codeSteps.length, trace.flowSteps.length);
  if (!max) return;
  trace.index = Math.min(trace.index + 1, max - 1);
  renderTrace();
}

function stopAutoPlay() { if (trace.timer) clearInterval(trace.timer); trace.timer = null; }

function buildTrace(op, value, found) {
  const v = value ?? "v";
  return {
    codeSteps: [`op=${op}`, `input=${v}`, "traverse structure", found ? "branch: success" : "branch: fail", "render output"],
    flowSteps: ["Start", `Operation ${op}`, "Decision", found ? "Success" : "Not Found", "End"],
  };
}

function renderStructure() {
  drawBackground();
  if (state.type === "binarySearchTree") drawBST();
  else drawLinear(state.type);
  drawTraceMiniInMainCanvas();

  const doc = docs[state.type];
  codeEl.textContent = doc.code.join("\n");
  flowEl.textContent = doc.flowchart.join("\n");
  complexityBody.innerHTML = doc.complexity.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join("");
  const memoryHint = state.type === "linkedList" ? "Nodes: [value | next_ptr]" : state.type === "binarySearchTree" ? "Nodes: [value | left_ptr | right_ptr]" : "Memory blocks: contiguous (array-like view)";
  memoryEl.textContent = `Structure: ${state.type}\nData: [${state.data.join(", ")}]\n${memoryHint}`;
  statusEl.textContent = `${state.action}.`;
}

function readValueOrNull() {
  const raw = valueInput.value.trim();
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isNaN(parsed) ? NaN : parsed;
}

async function animateLinearScan(target) {
  for (let i = 0; i < state.data.length; i++) {
    state.highlight = i; state.action = `Scanning index ${i}`; renderStructure();
    await wait(220);
    if (Number(state.data[i]) === Number(target)) return i;
  }
  return -1;
}

async function animateBSTSearch(target) {
  const root = bstBuild(state.data);
  const pathVals = bstPath(root, target);
  for (const val of pathVals) {
    state.highlight = state.data.findIndex((x) => x === val);
    state.action = `BST compare with ${val}`;
    renderStructure();
    await wait(280);
  }
  return state.data.findIndex((x) => Number(x) === Number(target));
}

async function applyOp(op) {
  if (state.busy) return;
  setBusy(true);
  const value = readValueOrNull();
  state.highlight = null;
  let found = false;

  try {
    if (op === "insert") {
      if (value === null || Number.isNaN(value)) { statusEl.textContent = "Enter a valid number for insert."; return; }
      state.action = `Inserting ${value}...`; renderStructure(); await wait(220);
      if (state.type === "linkedList") state.data.unshift(value); else state.data.push(value);
      state.highlight = state.type === "linkedList" ? 0 : state.data.length - 1;
      state.action = `Inserted ${value}`; found = true;
    } else if (op === "delete") {
      if (state.data.length === 0) { statusEl.textContent = "Nothing to delete; structure is empty."; return; }
      if (state.type === "stack") {
        state.highlight = state.data.length - 1; state.action = "Popping top..."; renderStructure(); await wait(240);
        state.action = `Popped ${state.data.pop()}`; found = true;
      } else if (state.type === "queue") {
        state.highlight = 0; state.action = "Dequeuing front..."; renderStructure(); await wait(240);
        state.action = `Dequeued ${state.data.shift()}`; found = true;
      } else {
        if (value === null || Number.isNaN(value)) { statusEl.textContent = "Enter a valid number to delete."; return; }
        const idx = state.type === "binarySearchTree" ? await animateBSTSearch(value) : await animateLinearScan(value);
        if (idx === -1) state.action = `Value ${value} not found`;
        else {
          state.highlight = idx; await wait(140);
          state.data.splice(idx, 1);
          state.action = `Deleted ${value}`; found = true;
        }
      }
    } else if (op === "search") {
      if (value === null || Number.isNaN(value)) { statusEl.textContent = "Enter a valid number to search."; return; }
      const idx = state.type === "binarySearchTree" ? await animateBSTSearch(value) : await animateLinearScan(value);
      state.highlight = idx >= 0 ? idx : null;
      found = idx >= 0;
      state.action = found ? `Found ${value} at position ${idx}` : `${value} not found`;
    }

    stopAutoPlay();
    const t = buildTrace(op, value, found);
    setTrace(t.codeSteps, t.flowSteps);
    renderStructure();
  } finally {
    setBusy(false);
  }
}

document.getElementById("structureSelect").addEventListener("change", (e) => {
  state.type = e.target.value;
  state.data = [...INITIAL_DATA];
  state.highlight = null;
  state.action = `Switched to ${state.type} (empty)`;
  stopAutoPlay();
  setTrace([], []);
  renderStructure();
});

document.getElementById("insertBtn").addEventListener("click", () => applyOp("insert"));
document.getElementById("deleteBtn").addEventListener("click", () => applyOp("delete"));
document.getElementById("searchBtn").addEventListener("click", () => applyOp("search"));
document.getElementById("resetBtn").addEventListener("click", () => {
  state.data = [...INITIAL_DATA];
  state.highlight = null;
  state.action = "Reset to empty";
  stopAutoPlay();
  setTrace([], []);
  renderStructure();
});

document.getElementById("stepBtn").addEventListener("click", nextTraceStep);
document.getElementById("playBtn").addEventListener("click", () => {
  stopAutoPlay();
  trace.timer = setInterval(() => {
    const max = Math.max(trace.codeSteps.length, trace.flowSteps.length);
    if (trace.index >= max - 1) return stopAutoPlay();
    nextTraceStep();
  }, 650);
});
document.getElementById("pauseBtn").addEventListener("click", stopAutoPlay);

window.addEventListener("resize", () => {
  resizeCanvas();
  renderStructure();
  drawTraceScene();
});

resizeCanvas();
setTrace([], []);
renderStructure();
