const docs = {
  array: {
    code: `insert(v):\n  arr.push(v)\n\ndelete(v):\n  i = arr.indexOf(v)\n  if i != -1: remove arr[i]\n\nsearch(v):\n  scan all items until match`,
    flowchart: `Start -> choose operation\nInsert? append\nDelete? find then shift\nSearch? linear scan\nEnd`,
    complexity: [["Insert", "O(1) amortized", "O(1)"], ["Delete", "O(n)", "O(1)"], ["Search", "O(n)", "O(1)"]],
  },
  linkedList: {
    code: `insertFront(v):\n  node.next = head\n  head = node\n\ndelete(v):\n  find prev + reconnect\n\nsearch(v):\n  traverse next pointers`,
    flowchart: `Start -> operation\nInsert front\nDelete by relinking\nSearch by traversal\nEnd`,
    complexity: [["Insert", "O(1)", "O(1)"], ["Delete", "O(n)", "O(1)"], ["Search", "O(n)", "O(1)"]],
  },
  stack: {
    code: `push(v): add to top\npop(): remove top\nsearch(v): linear scan`,
    flowchart: `Start -> push/pop/search\nPush to top\nPop from top\nSearch linear\nEnd`,
    complexity: [["Push", "O(1)", "O(1)"], ["Pop", "O(1)", "O(1)"], ["Search", "O(n)", "O(1)"]],
  },
  queue: {
    code: `enqueue(v): add to rear\ndequeue(): remove front\nsearch(v): traverse`,
    flowchart: `Start -> enqueue/dequeue/search\nEnqueue at rear\nDequeue from front\nSearch linear\nEnd`,
    complexity: [["Enqueue", "O(1)", "O(1)"], ["Dequeue", "O(1)", "O(1)"], ["Search", "O(n)", "O(1)"]],
  },
  binarySearchTree: {
    code: `insert(v): branch left/right\ndelete(v): handle 0/1/2 child cases\nsearch(v): compare + branch`,
    flowchart: `Start -> compare to node\n< go left\n> go right\n= found\nrepeat`,
    complexity: [["Insert", "O(log n)*", "O(h)"], ["Delete", "O(log n)*", "O(h)"], ["Search", "O(log n)*", "O(1)"]],
  },
};

const INITIAL_DATA = [8, 3, 12, 1, 5];
const state = { type: "array", data: [...INITIAL_DATA], highlight: null, action: "Init" };

const canvas = document.getElementById("vizCanvas");
const ctx = canvas.getContext("2d");
const sceneWrap = document.getElementById("scene");
const statusEl = document.getElementById("status");
const codeEl = document.getElementById("codeBlock");
const flowEl = document.getElementById("flowchart");
const memoryEl = document.getElementById("memory");
const complexityBody = document.querySelector("#complexityTable tbody");
const valueInput = document.getElementById("valueInput");

function resizeCanvas() {
  canvas.width = sceneWrap.clientWidth;
  canvas.height = sceneWrap.clientHeight;
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
  ctx.lineWidth = 1.2;
  ctx.strokeRect(x, y, w, h);

  ctx.fillStyle = "#f5f8ff";
  ctx.font = "bold 18px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(String(text), x + w / 2, y + h / 2 + 6);
}

function drawArrow(x1, y1, x2, y2) {
  ctx.strokeStyle = "#5eead4";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const size = 8;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - size * Math.cos(angle - Math.PI / 6), y2 - size * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(x2 - size * Math.cos(angle + Math.PI / 6), y2 - size * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fillStyle = "#5eead4";
  ctx.fill();
}

function drawLinear(mode) {
  const yBase = mode === "stack" ? canvas.height - 85 : 145;
  state.data.forEach((value, i) => {
    const highlighted = state.highlight === i;
    const x = mode === "stack" ? canvas.width / 2 - 40 : 50 + i * 105;
    const y = mode === "stack" ? yBase - i * 55 : yBase;
    drawCube(x, y, 70, 45, 10, highlighted ? "#25c9b7" : "#4f8cff", value);
    if (mode === "queue" && i < state.data.length - 1) {
      drawArrow(x + 80, y + 20, x + 95, y + 20);
    }
  });
}

function drawLinkedList() {
  drawLinear("queue");
}

function bstInsert(root, val) {
  if (!root) return { val, left: null, right: null };
  if (val < root.val) root.left = bstInsert(root.left, val);
  else root.right = bstInsert(root.right, val);
  return root;
}

function drawBST() {
  let root = null;
  for (const v of state.data) root = bstInsert(root, v);
  const nodes = [];
  const walk = (n, depth, x) => {
    if (!n) return;
    nodes.push({ n, depth, x });
    walk(n.left, depth + 1, x - Math.max(50, 140 - depth * 22));
    walk(n.right, depth + 1, x + Math.max(50, 140 - depth * 22));
  };
  walk(root, 0, canvas.width / 2);

  const pos = new Map();
  nodes.forEach(({ n, depth, x }) => pos.set(n, { x, y: 80 + depth * 85 }));
  nodes.forEach(({ n }) => {
    [n.left, n.right].forEach((child) => {
      if (!child) return;
      const a = pos.get(n);
      const b = pos.get(child);
      drawArrow(a.x, a.y + 16, b.x, b.y - 16);
    });
  });

  nodes.forEach(({ n }) => {
    const { x, y } = pos.get(n);
    const i = state.data.findIndex((v) => v === n.val);
    const fill = i === state.highlight ? "#25c9b7" : "#4f8cff";
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = "#dbe6ff";
    ctx.stroke();
    ctx.fillStyle = "#f5f8ff";
    ctx.textAlign = "center";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(String(n.val), x, y + 6);
  });
}

function drawBackground() {
  const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
  g.addColorStop(0, "#0d1330");
  g.addColorStop(1, "#0a1026");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#22305f";
  for (let x = 0; x < canvas.width; x += 36) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
}

function renderStructure() {
  drawBackground();
  if (["array", "stack", "queue"].includes(state.type)) drawLinear(state.type);
  if (state.type === "linkedList") drawLinkedList();
  if (state.type === "binarySearchTree") drawBST();

  const doc = docs[state.type];
  codeEl.textContent = doc.code;
  flowEl.textContent = doc.flowchart;
  complexityBody.innerHTML = doc.complexity.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join("");
  const memoryHint = state.type === "linkedList"
    ? "Nodes: [value | next_ptr]"
    : state.type === "binarySearchTree"
      ? "Nodes: [value | left_ptr | right_ptr]"
      : "Memory blocks: contiguous (array-like view)";
  memoryEl.textContent = `Structure: ${state.type}\nData: [${state.data.join(", ")}]\n${memoryHint}`;
  statusEl.textContent = `${state.action}.`;
}

function readValueOrNull() {
  const raw = valueInput.value.trim();
  if (raw === "") return null;
  const parsed = Number(raw);
  return Number.isNaN(parsed) ? NaN : parsed;
}

function applyOp(op) {
  const value = readValueOrNull();
  state.highlight = null;

  if (op === "insert") {
    if (value === null || Number.isNaN(value)) return (statusEl.textContent = "Enter a valid number for insert.");
    state.data.push(value);
    state.action = `Inserted ${value}`;
  } else if (op === "delete") {
    if (state.data.length === 0) return (statusEl.textContent = "Nothing to delete; structure is empty.");
    if (state.type === "stack") {
      state.highlight = state.data.length - 1;
      state.action = `Popped ${state.data.pop()}`;
    } else if (state.type === "queue") {
      state.highlight = 0;
      state.action = `Dequeued ${state.data.shift()}`;
    } else {
      if (value === null || Number.isNaN(value)) return (statusEl.textContent = "Enter a valid number to delete.");
      const idx = state.data.findIndex((x) => Number(x) === Number(value));
      if (idx === -1) return (statusEl.textContent = `Value ${value} not found.`);
      state.highlight = idx;
      state.data.splice(idx, 1);
      state.action = `Deleted ${value}`;
    }
  } else if (op === "search") {
    if (value === null || Number.isNaN(value)) return (statusEl.textContent = "Enter a valid number to search.");
    const idx = state.data.findIndex((x) => Number(x) === Number(value));
    state.highlight = idx >= 0 ? idx : null;
    state.action = idx >= 0 ? `Found ${value} at position ${idx}` : `${value} not found`;
  }

  renderStructure();
}

document.getElementById("structureSelect").addEventListener("change", (e) => {
  state.type = e.target.value;
  state.data = [...INITIAL_DATA];
  state.highlight = null;
  state.action = `Switched to ${state.type}`;
  renderStructure();
});

document.getElementById("insertBtn").addEventListener("click", () => applyOp("insert"));
document.getElementById("deleteBtn").addEventListener("click", () => applyOp("delete"));
document.getElementById("searchBtn").addEventListener("click", () => applyOp("search"));
document.getElementById("resetBtn").addEventListener("click", () => {
  state.data = [...INITIAL_DATA];
  state.highlight = null;
  state.action = "Reset";
  renderStructure();
});

window.addEventListener("resize", () => {
  resizeCanvas();
  renderStructure();
});

resizeCanvas();
renderStructure();
