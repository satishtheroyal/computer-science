const docs = {
  array: {
    code: ["insert(v): arr.push(v)", "delete(v): find index", "if found: remove + shift", "search(v): linear scan"],
    flowchart: ["Start", "Choose operation", "Insert? append", "Delete? find then shift", "Search? scan", "End"],
    complexity: [["Insert", "O(1) amortized", "O(1)"], ["Delete", "O(n)", "O(1)"], ["Search", "O(n)", "O(1)"]],
  },
  linkedList: {
    code: ["insertFront(v): node.next=head", "head=node", "delete(v): traverse with prev", "search(v): next pointers"],
    flowchart: ["Start", "Select operation", "Insert front", "Delete by relinking", "Search traversal", "End"],
    complexity: [["Insert", "O(1)", "O(1)"], ["Delete", "O(n)", "O(1)"], ["Search", "O(n)", "O(1)"]],
  },
  stack: {
    code: ["push(v): add to top", "pop(): remove top", "search(v): linear scan"],
    flowchart: ["Start", "Push/Pop/Search", "Push => top+1", "Pop => top-1", "Search => linear", "End"],
    complexity: [["Push", "O(1)", "O(1)"], ["Pop", "O(1)", "O(1)"], ["Search", "O(n)", "O(1)"]],
  },
  queue: {
    code: ["enqueue(v): add rear", "dequeue(): remove front", "search(v): linear scan"],
    flowchart: ["Start", "Enqueue/Dequeue/Search", "Enqueue at rear", "Dequeue at front", "Search traversal", "End"],
    complexity: [["Enqueue", "O(1)", "O(1)"], ["Dequeue", "O(1)", "O(1)"], ["Search", "O(n)", "O(1)"]],
  },
  binarySearchTree: {
    code: ["insert(v): compare + branch", "delete(v): 0/1/2 children", "search(v): branch left/right"],
    flowchart: ["Start", "Compare with node", "< go left", "> go right", "= found", "Repeat/End"],
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

function setBusy(busy) {
  state.busy = busy;
  opButtons.forEach((el) => { el.disabled = busy; });
}

function resizeCanvas() {
  canvas.width = sceneWrap.clientWidth;
  canvas.height = sceneWrap.clientHeight;
  traceCanvas.width = traceCanvas.clientWidth;
  traceCanvas.height = traceCanvas.clientHeight;
}

function drawCube(x, y, w, h, depth, color, text) {
  const top = { x: x + depth, y: y - depth };
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = "#6ea1ff";
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(top.x, top.y);
  ctx.lineTo(top.x + w, top.y);
  ctx.lineTo(x + w, y);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#2a4b96";
  ctx.beginPath();
  ctx.moveTo(x + w, y);
  ctx.lineTo(top.x + w, top.y);
  ctx.lineTo(top.x + w, top.y + h);
  ctx.lineTo(x + w, y + h);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#dbe6ff";
  ctx.strokeRect(x, y, w, h);
  ctx.fillStyle = "#f5f8ff";
  ctx.font = "bold 18px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(String(text), x + w / 2, y + h / 2 + 6);
}

function drawArrow(c, x1, y1, x2, y2, color = "#5eead4") {
  c.strokeStyle = color;
  c.lineWidth = 2;
  c.beginPath();
  c.moveTo(x1, y1);
  c.lineTo(x2, y2);
  c.stroke();
}

function drawLinear(mode) {
  const yBase = mode === "stack" ? canvas.height - 85 : 145;
  state.data.forEach((value, i) => {
    const x = mode === "stack" ? canvas.width / 2 - 40 : 50 + i * 105;
    const y = mode === "stack" ? yBase - i * 55 : yBase;
    drawCube(x, y, 70, 45, 10, state.highlight === i ? "#25c9b7" : "#4f8cff", value);
    if (mode === "queue" && i < state.data.length - 1) drawArrow(ctx, x + 80, y + 20, x + 95, y + 20);
  });
}

function drawBST() {
  function bstInsert(root, val) {
    if (!root) return { val, left: null, right: null };
    if (val < root.val) root.left = bstInsert(root.left, val); else root.right = bstInsert(root.right, val);
    return root;
  }
  let root = null;
  state.data.forEach((v) => { root = bstInsert(root, v); });
  const nodes = [];
  const walk = (n, d, x) => {
    if (!n) return;
    nodes.push({ n, d, x, y: 80 + d * 85 });
    walk(n.left, d + 1, x - Math.max(50, 140 - d * 22));
    walk(n.right, d + 1, x + Math.max(50, 140 - d * 22));
  };
  walk(root, 0, canvas.width / 2);
  nodes.forEach(({ n, x, y }) => {
    if (n.left) { const c = nodes.find((k) => k.n === n.left); drawArrow(ctx, x, y + 16, c.x, c.y - 16); }
    if (n.right) { const c = nodes.find((k) => k.n === n.right); drawArrow(ctx, x, y + 16, c.x, c.y - 16); }
  });
  nodes.forEach(({ n, x, y }) => {
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, Math.PI * 2);
    const idx = state.data.findIndex((v) => v === n.val);
    ctx.fillStyle = idx === state.highlight ? "#25c9b7" : "#4f8cff";
    ctx.fill();
    ctx.strokeStyle = "#dbe6ff";
    ctx.stroke();
    ctx.fillStyle = "#f5f8ff";
    ctx.textAlign = "center";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(String(n.val), x, y + 5);
  });
}

function drawBackground() {
  const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
  g.addColorStop(0, "#0d1330");
  g.addColorStop(1, "#0a1026");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawTrace3DNode(x, y, w, h, text, active, laneColor) {
  const d = 8;
  tctx.fillStyle = active ? "#5eead4" : laneColor;
  tctx.fillRect(x, y, w, h);
  tctx.fillStyle = active ? "#83fff1" : "#5f79d3";
  tctx.beginPath();
  tctx.moveTo(x, y);
  tctx.lineTo(x + d, y - d);
  tctx.lineTo(x + d + w, y - d);
  tctx.lineTo(x + w, y);
  tctx.closePath();
  tctx.fill();
  tctx.fillStyle = active ? "#2a726a" : "#334f9a";
  tctx.beginPath();
  tctx.moveTo(x + w, y);
  tctx.lineTo(x + w + d, y - d);
  tctx.lineTo(x + w + d, y + h - d);
  tctx.lineTo(x + w, y + h);
  tctx.closePath();
  tctx.fill();
  tctx.strokeStyle = "#d9e5ff";
  tctx.strokeRect(x, y, w, h);
  tctx.fillStyle = active ? "#03231e" : "#eef3ff";
  tctx.font = "bold 12px sans-serif";
  tctx.textAlign = "center";
  tctx.fillText(text, x + w / 2, y + h / 2 + 4);
}

function drawTraceScene() {
  const w = traceCanvas.width;
  const h = traceCanvas.height;
  const bg = tctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, "#091027");
  bg.addColorStop(1, "#070d1d");
  tctx.fillStyle = bg;
  tctx.fillRect(0, 0, w, h);

  tctx.fillStyle = "#9eb1ff";
  tctx.font = "bold 14px sans-serif";
  tctx.fillText("Code Path", 20, 24);
  tctx.fillText("Flowchart Path", 20, h / 2 + 24);

  const laneData = [{ steps: trace.codeSteps, y: 45, color: "#2f4d9e" }, { steps: trace.flowSteps, y: h / 2 + 45, color: "#2f6d77" }];
  laneData.forEach((lane) => {
    const n = Math.max(lane.steps.length, 1);
    const nodeW = 140;
    const nodeH = 36;
    const gap = n > 1 ? Math.max(20, (w - 50 - n * nodeW) / (n - 1)) : 0;
    lane.steps.forEach((step, i) => {
      const x = 20 + i * (nodeW + gap);
      const y = lane.y;
      drawTrace3DNode(x, y, nodeW, nodeH, `${i + 1}. ${step.slice(0, 20)}`, i === trace.index, lane.color);
      if (i < lane.steps.length - 1) drawArrow(tctx, x + nodeW + 8, y + nodeH / 2, x + nodeW + gap - 4, y + nodeH / 2, i < trace.index ? "#5eead4" : "#4e5f8f");
    });
  });
}

function setTrace(codeSteps, flowSteps) {
  trace.codeSteps = codeSteps;
  trace.flowSteps = flowSteps;
  trace.index = -1;
  renderTrace();
}

function renderTrace() {
  codeTraceEl.innerHTML = trace.codeSteps.map((s, i) => `<li class="${i === trace.index ? "active" : ""}">${s}</li>`).join("");
  flowTraceEl.innerHTML = trace.flowSteps.map((s, i) => `<li class="${i === trace.index ? "active" : ""}">${s}</li>`).join("");
  flowStatusEl.textContent = trace.index < 0 ? "Trace loaded. Click Step/Auto Play." : `Step ${trace.index + 1} / ${Math.max(trace.codeSteps.length, trace.flowSteps.length)}`;
  drawTraceScene();
}

function nextTraceStep() {
  const maxSteps = Math.max(trace.codeSteps.length, trace.flowSteps.length);
  if (maxSteps === 0) return;
  trace.index = Math.min(trace.index + 1, maxSteps - 1);
  renderTrace();
}

function stopAutoPlay() {
  if (trace.timer) clearInterval(trace.timer);
  trace.timer = null;
}

function buildTrace(op, value, found) {
  const v = value ?? "v";
  return {
    codeSteps: [`op=${op}`, `read value=${v}`, found ? "branch: success" : "branch: fallback", "mutate/scan structure", "render + status"],
    flowSteps: ["Start", `Operation: ${op}`, "Decision", found ? "Success path" : "Not-found path", "End"],
  };
}

function renderStructure() {
  drawBackground();
  if (["array", "linkedList", "stack", "queue"].includes(state.type)) drawLinear(state.type === "linkedList" ? "queue" : state.type);
  if (state.type === "binarySearchTree") drawBST();

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
  if (raw === "") return null;
  const parsed = Number(raw);
  return Number.isNaN(parsed) ? NaN : parsed;
}

async function animateLinearScan(target) {
  for (let i = 0; i < state.data.length; i++) {
    state.highlight = i;
    state.action = `Scanning index ${i}...`;
    renderStructure();
    await wait(220);
    if (Number(state.data[i]) === Number(target)) return i;
  }
  return -1;
}

async function applyOp(op) {
  if (state.busy) return;
  setBusy(true);

  const value = readValueOrNull();
  state.highlight = null;
  let found = false;

  try {
    if (op === "insert") {
      if (value === null || Number.isNaN(value)) return (statusEl.textContent = "Enter a valid number for insert."), setBusy(false);
      state.action = `Preparing to insert ${value}...`;
      renderStructure();
      await wait(200);
      state.data.push(value);
      state.highlight = state.data.length - 1;
      state.action = `Inserted ${value}`;
      found = true;
    } else if (op === "delete") {
      if (state.data.length === 0) return (statusEl.textContent = "Nothing to delete; structure is empty."), setBusy(false);
      if (state.type === "stack") {
        state.highlight = state.data.length - 1;
        state.action = "Popping top...";
        renderStructure();
        await wait(220);
        state.action = `Popped ${state.data.pop()}`;
        found = true;
      } else if (state.type === "queue") {
        state.highlight = 0;
        state.action = "Dequeuing front...";
        renderStructure();
        await wait(220);
        state.action = `Dequeued ${state.data.shift()}`;
        found = true;
      } else {
        if (value === null || Number.isNaN(value)) return (statusEl.textContent = "Enter a valid number to delete."), setBusy(false);
        const idx = await animateLinearScan(value);
        if (idx === -1) state.action = `Value ${value} not found`;
        else {
          state.highlight = idx;
          await wait(150);
          state.data.splice(idx, 1);
          state.action = `Deleted ${value}`;
          found = true;
        }
      }
    } else if (op === "search") {
      if (value === null || Number.isNaN(value)) return (statusEl.textContent = "Enter a valid number to search."), setBusy(false);
      const idx = await animateLinearScan(value);
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
