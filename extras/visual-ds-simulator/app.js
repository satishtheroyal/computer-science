const docs = {
  array: {
    code: [
      "insert(v): arr.push(v)",
      "delete(v): scan arr to find index",
      "if found: arr.splice(index, 1)",
      "search(v): return first matching index",
    ],
    flowchart: ["Start", "Read op + value", "Traverse if needed", "Mutate structure", "Render", "End"],
    complexity: [["Insert", "O(1) amortized", "O(1)"], ["Delete", "O(n)", "O(1)"], ["Search", "O(n)", "O(1)"]],
  },
  linkedList: {
    code: [
      "insert(v): newNode.next = head",
      "head = newNode",
      "delete(v): traverse(prev,curr)",
      "if match: prev.next = curr.next",
    ],
    flowchart: ["Start", "Create/read node", "Traverse pointers", "Relink pointers", "Render", "End"],
    complexity: [["Insert", "O(1)", "O(1)"], ["Delete", "O(n)", "O(1)"], ["Search", "O(n)", "O(1)"]],
  },
  stack: {
    code: ["push(v): top += 1", "arr[top] = v", "pop(): return arr[top--]", "search(v): linear scan"],
    flowchart: ["Start", "Push/Pop/Search", "Touch top", "Update stack", "Render", "End"],
    complexity: [["Push", "O(1)", "O(1)"], ["Pop", "O(1)", "O(1)"], ["Search", "O(n)", "O(1)"]],
  },
  queue: {
    code: ["enqueue(v): rear.next = new", "rear = new", "dequeue(): head = head.next", "search(v): traverse from head"],
    flowchart: ["Start", "Enqueue/Dequeue/Search", "Head/Rear action", "Update queue", "Render", "End"],
    complexity: [["Enqueue", "O(1)", "O(1)"], ["Dequeue", "O(1)", "O(1)"], ["Search", "O(n)", "O(1)"]],
  },
  binarySearchTree: {
    code: [
      "insert(v): compare with node",
      "go left/right recursively",
      "delete(v): handle 0/1/2-child cases",
      "search(v): branch by compare",
    ],
    flowchart: ["Start", "Compare at node", "Go left/right", "Match?", "Update", "End"],
    complexity: [["Insert", "O(log n)*", "O(h)"], ["Delete", "O(log n)*", "O(h)"], ["Search", "O(log n)*", "O(1)"]],
  },
};

const DS = {
  array: () => {
    const arr = [];
    return {
      insert(v) { arr.push(v); return { ok: true, index: arr.length - 1 }; },
      delete(v) {
        const i = arr.findIndex((x) => x === v);
        if (i < 0) return { ok: false };
        arr.splice(i, 1);
        return { ok: true, index: i };
      },
      deleteDefault() { return { ok: false, message: "Array delete requires a value." }; },
      search(v) { return { ok: true, index: arr.findIndex((x) => x === v) }; },
      traversalPath(v) { return arr.map((x, i) => ({ index: i, value: x, match: x === v })); },
      toArray() { return [...arr]; },
      memory() { return `Contiguous blocks\n[${arr.join(", ")}]`; },
      clear() { arr.length = 0; },
    };
  },
  linkedList: () => {
    let head = null;
    const toArray = () => { const out=[]; let n=head; while(n){out.push(n.value);n=n.next;} return out; };
    return {
      insert(v) { head = { value: v, next: head }; return { ok: true, index: 0 }; },
      delete(v) {
        let prev = null; let cur = head; let idx = 0;
        while (cur) {
          if (cur.value === v) {
            if (!prev) head = cur.next; else prev.next = cur.next;
            return { ok: true, index: idx };
          }
          prev = cur; cur = cur.next; idx += 1;
        }
        return { ok: false };
      },
      deleteDefault() { return { ok: false, message: "Linked list delete requires a value." }; },
      search(v) { return { ok: true, index: toArray().findIndex((x) => x === v) }; },
      traversalPath(v) { return toArray().map((x, i) => ({ index: i, value: x, match: x === v })); },
      toArray,
      memory() {
        const items = []; let n = head; let i = 0;
        while (n) { items.push(`node${i}: {value:${n.value}, next:${n.next ? `node${i + 1}` : "null"}}`); n = n.next; i += 1; }
        return items.length ? items.join("\n") : "head -> null";
      },
      clear() { head = null; },
    };
  },
  stack: () => {
    const arr = [];
    return {
      insert(v) { arr.push(v); return { ok: true, index: arr.length - 1 }; },
      delete() { if (!arr.length) return { ok: false }; return { ok: true, index: arr.length - 1, value: arr.pop() }; },
      deleteDefault() { return this.delete(); },
      search(v) { return { ok: true, index: arr.findIndex((x) => x === v) }; },
      traversalPath(v) { return arr.map((x, i) => ({ index: i, value: x, match: x === v })); },
      toArray() { return [...arr]; },
      memory() { return `top -> ${arr.length ? arr[arr.length - 1] : "empty"}\n[${arr.join(", ")}]`; },
      clear() { arr.length = 0; },
    };
  },
  queue: () => {
    const arr = [];
    return {
      insert(v) { arr.push(v); return { ok: true, index: arr.length - 1 }; },
      delete() { if (!arr.length) return { ok: false }; return { ok: true, index: 0, value: arr.shift() }; },
      deleteDefault() { return this.delete(); },
      search(v) { return { ok: true, index: arr.findIndex((x) => x === v) }; },
      traversalPath(v) { return arr.map((x, i) => ({ index: i, value: x, match: x === v })); },
      toArray() { return [...arr]; },
      memory() { return `front -> ${arr[0] ?? "empty"}\nrear -> ${arr[arr.length - 1] ?? "empty"}\n[${arr.join(", ")}]`; },
      clear() { arr.length = 0; },
    };
  },
  binarySearchTree: () => {
    let root = null;
    const insertNode = (n, v) => {
      if (!n) return { value: v, left: null, right: null };
      if (v < n.value) n.left = insertNode(n.left, v); else n.right = insertNode(n.right, v);
      return n;
    };
    const inorder = (n, out) => { if (!n) return; inorder(n.left, out); out.push(n.value); inorder(n.right, out); };
    const searchPath = (v) => {
      const path = []; let n = root;
      while (n) {
        path.push(n.value);
        if (v === n.value) break;
        n = v < n.value ? n.left : n.right;
      }
      return path;
    };
    const removeNode = (n, v) => {
      if (!n) return [null, false];
      if (v < n.value) { const [x, ok] = removeNode(n.left, v); n.left = x; return [n, ok]; }
      if (v > n.value) { const [x, ok] = removeNode(n.right, v); n.right = x; return [n, ok]; }
      if (!n.left) return [n.right, true];
      if (!n.right) return [n.left, true];
      let p = n; let s = n.right;
      while (s.left) { p = s; s = s.left; }
      if (p !== n) p.left = s.right; else p.right = s.right;
      n.value = s.value;
      return [n, true];
    };
    return {
      insert(v) { root = insertNode(root, v); return { ok: true }; },
      delete(v) { const [r, ok] = removeNode(root, v); root = r; return { ok }; },
      deleteDefault() { return { ok: false, message: "BST delete requires a value." }; },
      search(v) {
        const path = searchPath(v);
        const found = path.length && path[path.length - 1] === v;
        return { ok: true, index: found ? this.toArray().findIndex((x) => x === v) : -1, path };
      },
      traversalPath(v) { return searchPath(v).map((value) => ({ value, match: value === v })); },
      toArray() { const out = []; inorder(root, out); return out; },
      memory() { return JSON.stringify(root, null, 2) || "null"; },
      clear() { root = null; },
      getRoot() { return root; },
    };
  },
};

const INITIAL_DATA = [];
const state = { type: "array", highlight: null, action: "Init (empty structure)", busy: false };
const trace = { codeSteps: [], flowSteps: [], index: -1, timer: null };
const models = Object.fromEntries(Object.keys(DS).map((k) => [k, DS[k]()]))

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

function currentModel() { return models[state.type]; }
function dataArray() { return currentModel().toArray(); }
function setBusy(b) { state.busy = b; opButtons.forEach((el) => { el.disabled = b; }); }
function resizeCanvas() { canvas.width = sceneWrap.clientWidth; canvas.height = sceneWrap.clientHeight; traceCanvas.width = traceCanvas.clientWidth; traceCanvas.height = traceCanvas.clientHeight; }
function structureArea() { return { x: 0, y: 0, w: canvas.width, h: Math.floor(canvas.height * 0.58) }; }
function codeFlowArea() { return { x: 0, y: Math.floor(canvas.height * 0.58), w: canvas.width, h: canvas.height - Math.floor(canvas.height * 0.58) }; }

function drawArrow(c, x1, y1, x2, y2, color = "#5eead4") {
  c.strokeStyle = color; c.lineWidth = 2; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
}
function drawCube(c, x, y, w, h, d, color, text) {
  c.fillStyle = color; c.fillRect(x, y, w, h);
  c.fillStyle = "#6ea1ff"; c.beginPath(); c.moveTo(x, y); c.lineTo(x + d, y - d); c.lineTo(x + d + w, y - d); c.lineTo(x + w, y); c.closePath(); c.fill();
  c.fillStyle = "#2a4b96"; c.beginPath(); c.moveTo(x + w, y); c.lineTo(x + w + d, y - d); c.lineTo(x + w + d, y + h - d); c.lineTo(x + w, y + h); c.closePath(); c.fill();
  c.strokeStyle = "#dbe6ff"; c.strokeRect(x, y, w, h);
  c.fillStyle = "#f5f8ff"; c.font = "bold 14px sans-serif"; c.textAlign = "center"; c.fillText(String(text), x + w / 2, y + h / 2 + 5);
}

function drawLinear(mode) {
  const a = structureArea();
  const values = dataArray();
  const yBase = mode === "stack" ? a.y + a.h - 65 : a.y + 95;
  values.forEach((value, i) => {
    const x = mode === "stack" ? a.x + a.w / 2 - 35 : a.x + 30 + i * 95;
    const y = mode === "stack" ? yBase - i * 50 : yBase;
    drawCube(ctx, x, y, 64, 40, 9, state.highlight === i ? "#25c9b7" : "#4f8cff", value);
    if ((mode === "queue" || mode === "linkedList") && i < values.length - 1) drawArrow(ctx, x + 72, y + 18, x + 92, y + 18);
  });
}

function drawBST() {
  const a = structureArea();
  const root = currentModel().getRoot();
  const nodes = [];
  const walk = (n, d, x) => { if (!n) return; nodes.push({ n, x, y: a.y + 50 + d * 64, d }); walk(n.left, d + 1, x - Math.max(42, 130 - d * 16)); walk(n.right, d + 1, x + Math.max(42, 130 - d * 16)); };
  walk(root, 0, a.x + a.w / 2);
  nodes.forEach(({ n, x, y }) => {
    if (n.left) { const c = nodes.find((k) => k.n === n.left); drawArrow(ctx, x, y + 10, c.x, c.y - 12, "#7bc7ff"); }
    if (n.right) { const c = nodes.find((k) => k.n === n.right); drawArrow(ctx, x, y + 10, c.x, c.y - 12, "#7bc7ff"); }
  });
  nodes.forEach(({ n, x, y }) => {
    ctx.beginPath(); ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fillStyle = state.highlightValue === n.value ? "#25c9b7" : "#4f8cff";
    ctx.fill(); ctx.strokeStyle = "#dbe6ff"; ctx.stroke();
    ctx.fillStyle = "#f5f8ff"; ctx.font = "bold 13px sans-serif"; ctx.textAlign = "center"; ctx.fillText(String(n.value), x, y + 4);
  });
}

function drawTraceInMainCanvas() {
  const a = codeFlowArea();
  ctx.fillStyle = "#0a1126"; ctx.fillRect(a.x, a.y, a.w, a.h);
  const lanes = [
    { title: "Code Path", steps: trace.codeSteps, x0: 16, w: a.w / 2 - 24, color: "#2f4d9e" },
    { title: "Flowchart Path", steps: trace.flowSteps, x0: a.w / 2 + 8, w: a.w / 2 - 24, color: "#2f6d77" },
  ];
  ctx.strokeStyle = "#2d3d70"; ctx.beginPath(); ctx.moveTo(a.w / 2, a.y + 10); ctx.lineTo(a.w / 2, a.y + a.h - 10); ctx.stroke();
  lanes.forEach((lane) => {
    ctx.fillStyle = "#a9bcff"; ctx.font = "bold 12px sans-serif"; ctx.textAlign = "left"; ctx.fillText(lane.title, lane.x0, a.y + 18);
    const nodeW = Math.max(90, Math.min(120, lane.w / Math.max(lane.steps.length, 1) - 12));
    let x = lane.x0;
    lane.steps.forEach((step, i) => {
      drawCube(ctx, x, a.y + 32, nodeW, 26, 6, i === trace.index ? "#5eead4" : lane.color, i + 1);
      ctx.fillStyle = "#dce7ff"; ctx.font = "10px sans-serif"; ctx.fillText(step.slice(0, 16), x + 2, a.y + 72);
      if (i < lane.steps.length - 1) drawArrow(ctx, x + nodeW + 2, a.y + 45, x + nodeW + 12, a.y + 45, i < trace.index ? "#5eead4" : "#57679d");
      x += nodeW + 14;
    });
  });
}

function drawBackground() {
  const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
  g.addColorStop(0, "#0d1330"); g.addColorStop(1, "#0a1026"); ctx.fillStyle = g; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#20305b"; ctx.beginPath(); ctx.moveTo(0, structureArea().h); ctx.lineTo(canvas.width, structureArea().h); ctx.stroke();
}

function drawTraceMirror() {
  tctx.fillStyle = "#091027"; tctx.fillRect(0, 0, traceCanvas.width, traceCanvas.height);
  tctx.fillStyle = "#8fa8ff"; tctx.font = "bold 14px sans-serif"; tctx.fillText("3D Trace Mirror", 12, 20);
}

function renderStructure() {
  drawBackground();
  if (state.type === "binarySearchTree") drawBST();
  else drawLinear(state.type);
  drawTraceInMainCanvas();

  const doc = docs[state.type];
  codeEl.textContent = doc.code.join("\n");
  flowEl.textContent = doc.flowchart.join("\n");
  complexityBody.innerHTML = doc.complexity.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join("");
  memoryEl.textContent = currentModel().memory();
  statusEl.textContent = `${state.action}.`;
}

function setTrace(codeSteps, flowSteps) { trace.codeSteps = codeSteps; trace.flowSteps = flowSteps; trace.index = -1; renderTrace(); }
function renderTrace() {
  codeTraceEl.innerHTML = trace.codeSteps.map((s, i) => `<li class="${i === trace.index ? "active" : ""}">${s}</li>`).join("");
  flowTraceEl.innerHTML = trace.flowSteps.map((s, i) => `<li class="${i === trace.index ? "active" : ""}">${s}</li>`).join("");
  flowStatusEl.textContent = trace.index < 0 ? "Trace loaded. Click Step/Auto Play." : `Step ${trace.index + 1} / ${Math.max(trace.codeSteps.length, trace.flowSteps.length)}`;
  drawTraceMirror();
  renderStructure();
}
function nextTraceStep() { const m = Math.max(trace.codeSteps.length, trace.flowSteps.length); if (!m) return; trace.index = Math.min(trace.index + 1, m - 1); renderTrace(); }
function stopAutoPlay() { if (trace.timer) clearInterval(trace.timer); trace.timer = null; }

function readValueOrNull() { const raw = valueInput.value.trim(); if (!raw) return null; const n = Number(raw); return Number.isNaN(n) ? NaN : n; }

function buildTrace(op, value, ok) {
  return {
    codeSteps: [`op=${op}`, `input=${value ?? "n/a"}`, "traverse/compare", ok ? "apply success path" : "apply fail path", "render"],
    flowSteps: ["Start", `Operation ${op}`, "Decision", ok ? "Success" : "Failure", "End"],
  };
}

async function animateTraversal(path, isBst = false) {
  for (const step of path) {
    if (isBst) {
      state.highlightValue = step.value;
      state.action = `Visiting node ${step.value}`;
    } else {
      state.highlight = step.index;
      state.action = `Visiting index ${step.index}`;
    }
    renderStructure();
    await wait(220);
  }
}

async function applyOp(op) {
  if (state.busy) return;
  setBusy(true);
  const model = currentModel();
  const value = readValueOrNull();
  state.highlight = null; state.highlightValue = null;
  let ok = false;
  try {
    if (op === "insert") {
      if (value === null || Number.isNaN(value)) { statusEl.textContent = "Enter a valid number for insert."; return; }
      state.action = `Inserting ${value}`; renderStructure(); await wait(180);
      const r = model.insert(value); ok = r.ok;
      if (state.type === "binarySearchTree") state.highlightValue = value; else state.highlight = r.index;
      state.action = ok ? `Inserted ${value}` : `Insert failed`;
    }

    if (op === "delete") {
      if (state.type === "stack" || state.type === "queue") {
        const r = model.deleteDefault();
        if (!r.ok) { statusEl.textContent = "Nothing to delete; structure is empty."; return; }
        state.highlight = r.index; state.action = state.type === "stack" ? "Popping top" : "Dequeuing front"; renderStructure(); await wait(200);
        ok = true; state.action = `${state.type === "stack" ? "Popped" : "Dequeued"} ${r.value}`;
      } else {
        if (value === null || Number.isNaN(value)) { statusEl.textContent = "Enter a valid number to delete."; return; }
        const path = model.traversalPath(value);
        await animateTraversal(path, state.type === "binarySearchTree");
        const r = model.delete(value); ok = r.ok;
        state.action = ok ? `Deleted ${value}` : `Value ${value} not found`;
      }
    }

    if (op === "search") {
      if (value === null || Number.isNaN(value)) { statusEl.textContent = "Enter a valid number to search."; return; }
      const path = model.traversalPath(value);
      await animateTraversal(path, state.type === "binarySearchTree");
      const r = model.search(value); ok = r.index >= 0;
      if (state.type !== "binarySearchTree") state.highlight = r.index;
      state.action = ok ? `Found ${value}` : `${value} not found`;
    }

    stopAutoPlay();
    const t = buildTrace(op, value, ok);
    setTrace(t.codeSteps, t.flowSteps);
    renderStructure();
  } finally {
    setBusy(false);
  }
}

function resetAllStructures() {
  Object.values(models).forEach((m) => m.clear());
  INITIAL_DATA.forEach((v) => models[state.type].insert(v));
}

document.getElementById("structureSelect").addEventListener("change", (e) => {
  state.type = e.target.value;
  state.highlight = null; state.highlightValue = null;
  state.action = `Switched to ${state.type} (empty)`;
  stopAutoPlay(); setTrace([], []); renderStructure();
});

document.getElementById("insertBtn").addEventListener("click", () => applyOp("insert"));
document.getElementById("deleteBtn").addEventListener("click", () => applyOp("delete"));
document.getElementById("searchBtn").addEventListener("click", () => applyOp("search"));
document.getElementById("resetBtn").addEventListener("click", () => {
  resetAllStructures();
  state.highlight = null; state.highlightValue = null;
  state.action = "Reset to empty";
  stopAutoPlay(); setTrace([], []); renderStructure();
});

document.getElementById("stepBtn").addEventListener("click", nextTraceStep);
document.getElementById("playBtn").addEventListener("click", () => {
  stopAutoPlay();
  trace.timer = setInterval(() => {
    const m = Math.max(trace.codeSteps.length, trace.flowSteps.length);
    if (trace.index >= m - 1) return stopAutoPlay();
    nextTraceStep();
  }, 650);
});
document.getElementById("pauseBtn").addEventListener("click", stopAutoPlay);

window.addEventListener("resize", () => { resizeCanvas(); renderStructure(); drawTraceMirror(); });

resetAllStructures();
resizeCanvas();
setTrace([], []);
renderStructure();
