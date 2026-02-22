const docs = {
  bubble: { lines: [
    'for i = 0..n-2',
    'for j = 0..n-i-2',
    'if a[j] > a[j+1] ?',
    'swap(a[j], a[j+1])',
    'next j / next i',
    'end',
  ]},
  selection: { lines: [
    'for i = 0..n-1',
    'min = i',
    'for j = i+1..n-1',
    'if a[j] < a[min] ? min=j',
    'swap(a[i], a[min])',
    'end',
  ]},
  insertion: { lines: [
    'for i = 1..n-1',
    'key = a[i], j=i-1',
    'while j>=0 and a[j] > key',
    'a[j+1]=a[j], j--',
    'a[j+1]=key',
    'end',
  ]},
};

const state = {
  algo: 'bubble',
  values: [],
  steps: [],
  stepIndex: -1,
  displayArr: [],
  activeLine: -1,
  activePair: [-1, -1],
};

const canvas = document.getElementById('vizCanvas');
const ctx = canvas.getContext('2d');
const flowCanvas = document.getElementById('flowCanvas');
const fctx = flowCanvas.getContext('2d');
const scene = document.getElementById('scene');
const statusEl = document.getElementById('status');
const dryEl = document.getElementById('dryRunBlock');
const stepEl = document.getElementById('stepBlock');
const algoSelect = document.getElementById('algorithmSelect');
const valuesInput = document.getElementById('valuesInput');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function resize() {
  canvas.width = scene.clientWidth;
  canvas.height = scene.clientHeight;
  flowCanvas.width = flowCanvas.clientWidth;
  flowCanvas.height = flowCanvas.clientHeight;
}

function parseValues(raw) {
  return raw.split(',').map((s) => s.trim()).filter(Boolean).map(Number).filter((n) => !Number.isNaN(n));
}

function makeStep(arr, a, b, desc, line, explain) {
  return { arr: [...arr], a, b, desc, line, explain };
}

function generateSteps(algo, input) {
  const a = [...input];
  const out = [makeStep(a, -1, -1, 'Initial state', 0, 'We start with the unsorted array in memory.')];

  if (algo === 'bubble') {
    for (let i = 0; i < a.length - 1; i++) {
      out.push(makeStep(a, i, -1, `Start outer pass i=${i}`, 0, `Largest element in unsorted range will bubble to index ${a.length - 1 - i}.`));
      for (let j = 0; j < a.length - i - 1; j++) {
        out.push(makeStep(a, j, j + 1, `Compare a[${j}] and a[${j + 1}]`, 2, `Compare neighbors (${a[j]} and ${a[j + 1]}).`));
        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          out.push(makeStep(a, j, j + 1, `Swap a[${j}] and a[${j + 1}]`, 3, 'Left value was bigger, so swap to move larger value right.'));
        }
      }
    }
  }

  if (algo === 'selection') {
    for (let i = 0; i < a.length; i++) {
      let min = i;
      out.push(makeStep(a, i, min, `Set min = ${i}`, 1, `Assume index ${i} is minimum in unsorted part.`));
      for (let j = i + 1; j < a.length; j++) {
        out.push(makeStep(a, j, min, `Compare a[${j}] with current min a[${min}]`, 3, `Check if ${a[j]} is smaller than current min ${a[min]}.`));
        if (a[j] < a[min]) {
          min = j;
          out.push(makeStep(a, i, min, `Update min = ${min}`, 3, `New minimum found at index ${min}.`));
        }
      }
      [a[i], a[min]] = [a[min], a[i]];
      out.push(makeStep(a, i, min, `Swap a[${i}] with a[${min}]`, 4, `Place the smallest value of this pass at sorted index ${i}.`));
    }
  }

  if (algo === 'insertion') {
    for (let i = 1; i < a.length; i++) {
      const key = a[i];
      let j = i - 1;
      out.push(makeStep(a, i, j, `Pick key = ${key}`, 1, `Treat left side [0..${i - 1}] as sorted and insert key into it.`));
      while (j >= 0 && a[j] > key) {
        a[j + 1] = a[j];
        out.push(makeStep(a, j, j + 1, `Shift a[${j}] to the right`, 3, `Shift ${a[j + 1]} right because it is greater than key ${key}.`));
        j -= 1;
      }
      a[j + 1] = key;
      out.push(makeStep(a, j + 1, i, `Insert key at index ${j + 1}`, 4, `Insert key ${key} into its correct position.`));
    }
  }

  out.push(makeStep(a, -1, -1, 'Sorted result', 5, 'All passes complete. Array is sorted.'));
  return out;
}

function drawBar3D(x, y, w, h, color, value, idx) {
  const d = 9;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#78a8ff';
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + d, y - d); ctx.lineTo(x + d + w, y - d); ctx.lineTo(x + w, y); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#2e5fb5';
  ctx.beginPath(); ctx.moveTo(x + w, y); ctx.lineTo(x + w + d, y - d); ctx.lineTo(x + w + d, y + h - d); ctx.lineTo(x + w, y + h); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#dbe6ff'; ctx.strokeRect(x, y, w, h);
  ctx.fillStyle = '#f5f8ff'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(String(value), x + w / 2, y - 10);
  ctx.fillText(`i:${idx}`, x + w / 2, y + h + 15);
}

function draw3DMemory(arr, a = -1, b = -1) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const baseY = canvas.height * 0.74;
  const max = Math.max(...arr, 1);
  const width = Math.max(34, Math.min(58, (canvas.width - 80) / Math.max(arr.length, 1) - 8));
  const gap = 9;
  const total = arr.length * width + Math.max(arr.length - 1, 0) * gap;
  let x = (canvas.width - total) / 2;
  arr.forEach((v, i) => {
    const h = 30 + (v / max) * (canvas.height * 0.56);
    const y = baseY - h;
    const active = i === a || i === b;
    drawBar3D(x, y, width, h, active ? '#5eead4' : '#4f8cff', v, i);
    x += width + gap;
  });
  ctx.fillStyle = '#a9bcff';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('3D Memory Visual', 12, 22);
}

function wrapLines(c, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w;
    if (c.measureText(test).width > maxWidth && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = test;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function classifyShape(line, idx, total) {
  if (idx === 0 || idx === total - 1) return 'terminator';
  if (line.includes('if ') || line.includes('while ')) return 'decision';
  if (line.includes('for ')) return 'loop';
  return 'process';
}

function drawNodeShape(shape, x, y, w, h, color) {
  fctx.fillStyle = color;
  fctx.strokeStyle = '#dbe6ff';
  fctx.lineWidth = 1.4;
  if (shape === 'terminator') {
    fctx.beginPath(); fctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2); fctx.fill(); fctx.stroke(); return;
  }
  if (shape === 'decision') {
    fctx.beginPath(); fctx.moveTo(x + w / 2, y); fctx.lineTo(x + w, y + h / 2); fctx.lineTo(x + w / 2, y + h); fctx.lineTo(x, y + h / 2); fctx.closePath(); fctx.fill(); fctx.stroke(); return;
  }
  if (shape === 'loop') {
    const r = 10;
    fctx.beginPath();
    fctx.moveTo(x + r, y); fctx.lineTo(x + w - r, y); fctx.quadraticCurveTo(x + w, y, x + w, y + r);
    fctx.lineTo(x + w, y + h - r); fctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    fctx.lineTo(x + r, y + h); fctx.quadraticCurveTo(x, y + h, x, y + h - r);
    fctx.lineTo(x, y + r); fctx.quadraticCurveTo(x, y, x + r, y); fctx.closePath();
    fctx.fill(); fctx.stroke();
    return;
  }
  fctx.fillRect(x, y, w, h); fctx.strokeRect(x, y, w, h);
}

function drawFlow(step) {
  const lines = docs[state.algo].lines;
  const active = step?.line ?? -1;
  fctx.clearRect(0, 0, flowCanvas.width, flowCanvas.height);
  fctx.fillStyle = '#0c1430'; fctx.fillRect(0, 0, flowCanvas.width, flowCanvas.height);

  const n = lines.length;
  const nodeW = Math.min(560, flowCanvas.width - 70);
  const nodeH = Math.max(42, Math.min(60, (flowCanvas.height - 24 - (n - 1) * 12) / n));
  const x = (flowCanvas.width - nodeW) / 2;
  const top = 12;
  const gap = 12;

  for (let i = 0; i < n; i++) {
    const y = top + i * (nodeH + gap);
    const shape = classifyShape(lines[i], i, n);
    const isActive = i === active;
    drawNodeShape(shape, x, y, nodeW, nodeH, isActive ? '#5eead4' : '#3b5fb3');

    fctx.fillStyle = isActive ? '#03201b' : '#ecf2ff';
    fctx.font = '12px sans-serif';
    fctx.textAlign = 'center';
    const wrapped = wrapLines(fctx, lines[i], nodeW - 24);
    const ty = y + nodeH / 2 - ((wrapped.length - 1) * 7);
    wrapped.slice(0, 4).forEach((line, idx) => fctx.fillText(line, x + nodeW / 2, ty + idx * 14));

    if (i < n - 1) {
      const cx = x + nodeW / 2;
      const y1 = y + nodeH + 2;
      const y2 = y + nodeH + gap - 2;
      fctx.strokeStyle = i < active ? '#5eead4' : '#6781c1';
      fctx.lineWidth = 2;
      fctx.beginPath(); fctx.moveTo(cx, y1); fctx.lineTo(cx, y2); fctx.stroke();
      fctx.beginPath(); fctx.moveTo(cx, y2 + 4); fctx.lineTo(cx - 4, y2 - 2); fctx.lineTo(cx + 4, y2 - 2); fctx.closePath(); fctx.fillStyle = fctx.strokeStyle; fctx.fill();
      if (classifyShape(lines[i], i, n) === 'decision') {
        fctx.fillStyle = '#bcd4ff'; fctx.font = '10px sans-serif';
        fctx.fillText('Yes/No', cx + 36, y + nodeH / 2 + 3);
      }
    }
  }
}

async function animateToStep(fromStep, toStep) {
  const start = fromStep?.arr ?? state.values;
  const end = toStep.arr;
  const a = toStep.a;
  const b = toStep.b;
  const frames = 18;
  for (let f = 1; f <= frames; f++) {
    const t = f / frames;
    const interp = end.map((v, i) => start[i] === undefined ? v : start[i] + (v - start[i]) * t);
    draw3DMemory(interp, a, b);
    drawFlow({ line: toStep.line });
    await sleep(28);
  }
}

function renderPanels() {
  const upto = Math.max(0, state.stepIndex + 1);
  dryEl.textContent = state.steps.slice(0, upto).map((s, i) => `${i}. ${s.desc} -> [${s.arr.join(', ')}]`).join('\n') || 'No steps yet.';
  const current = state.steps[state.stepIndex] || null;
  stepEl.textContent = current
    ? `Step ${state.stepIndex}/${state.steps.length - 1}\nAction: ${current.desc}\nWhy: ${current.explain}\nArray: [${current.arr.join(', ')}]\nActive code line: ${current.line + 1}`
    : 'Press Load to generate dry-run.';
  draw3DMemory(current?.arr ?? state.values, current?.a ?? -1, current?.b ?? -1);
  drawFlow(current);
}

function loadSimulation() {
  state.algo = algoSelect.value;
  state.values = parseValues(valuesInput.value);
  if (!state.values.length) { statusEl.textContent = 'Please enter valid numbers (comma separated).'; return; }
  state.steps = generateSteps(state.algo, state.values);
  state.stepIndex = 0;
  statusEl.textContent = `Loaded ${state.algo} with ${state.values.length} values.`;
  renderPanels();
}

async function nextStep() {
  if (!state.steps.length) { statusEl.textContent = 'Load values first.'; return; }
  if (state.stepIndex < state.steps.length - 1) {
    const prev = state.steps[state.stepIndex];
    const next = state.steps[state.stepIndex + 1];
    await animateToStep(prev, next);
    state.stepIndex += 1;
    renderPanels();
  }
  statusEl.textContent = state.stepIndex >= state.steps.length - 1 ? 'Done. Sorted complete.' : `Step ${state.stepIndex}/${state.steps.length - 1}`;
}

function resetAll() {
  state.values = [];
  state.steps = [];
  state.stepIndex = -1;
  valuesInput.value = '';
  statusEl.textContent = 'Reset complete. Enter values and load again.';
  renderPanels();
}

document.getElementById('loadBtn').addEventListener('click', loadSimulation);
document.getElementById('nextBtn').addEventListener('click', () => { void nextStep(); });
document.getElementById('resetBtn').addEventListener('click', resetAll);
algoSelect.addEventListener('change', () => { state.algo = algoSelect.value; renderPanels(); });
window.addEventListener('resize', () => { resize(); renderPanels(); });

resize();
renderPanels();
