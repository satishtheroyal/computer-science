const docs = {
  bubble: {
    lines: [
      'for i = 0..n-2',
      '  for j = 0..n-i-2',
      '    if a[j] > a[j+1]',
      '      swap(a[j], a[j+1])',
    ],
  },
  selection: {
    lines: [
      'for i = 0..n-1',
      '  min = i',
      '  for j = i+1..n-1',
      '    if a[j] < a[min] then min = j',
      '  swap(a[i], a[min])',
    ],
  },
  insertion: {
    lines: [
      'for i = 1..n-1',
      '  key = a[i], j = i-1',
      '  while j>=0 and a[j] > key',
      '    a[j+1] = a[j], j--',
      '  a[j+1] = key',
    ],
  },
};

const state = { algo: 'bubble', values: [], steps: [], stepIndex: -1 };

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

function resize() {
  canvas.width = scene.clientWidth;
  canvas.height = scene.clientHeight;
  flowCanvas.width = flowCanvas.clientWidth;
  flowCanvas.height = flowCanvas.clientHeight;
}

function parseValues(raw) {
  return raw.split(',').map((s) => s.trim()).filter(Boolean).map(Number).filter((n) => !Number.isNaN(n));
}

function makeStep(arr, a = -1, b = -1, desc = '', line = 0) {
  return { arr: [...arr], a, b, desc, line };
}

function generateSteps(algo, input) {
  const a = [...input];
  const out = [makeStep(a, -1, -1, 'Initial state', 0)];

  if (algo === 'bubble') {
    for (let i = 0; i < a.length - 1; i++) {
      out.push(makeStep(a, i, -1, `Outer loop i=${i}`, 0));
      for (let j = 0; j < a.length - i - 1; j++) {
        out.push(makeStep(a, j, j + 1, `Compare a[${j}] and a[${j + 1}]`, 2));
        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          out.push(makeStep(a, j, j + 1, `Swap a[${j}] and a[${j + 1}]`, 3));
        }
      }
    }
  }

  if (algo === 'selection') {
    for (let i = 0; i < a.length; i++) {
      let min = i;
      out.push(makeStep(a, i, min, `Set min=${i}`, 1));
      for (let j = i + 1; j < a.length; j++) {
        out.push(makeStep(a, j, min, `Compare a[${j}] vs a[${min}]`, 3));
        if (a[j] < a[min]) {
          min = j;
          out.push(makeStep(a, i, min, `Update min=${min}`, 3));
        }
      }
      [a[i], a[min]] = [a[min], a[i]];
      out.push(makeStep(a, i, min, `Swap a[${i}] with a[${min}]`, 4));
    }
  }

  if (algo === 'insertion') {
    for (let i = 1; i < a.length; i++) {
      const key = a[i];
      let j = i - 1;
      out.push(makeStep(a, i, j, `Pick key=${key}`, 1));
      while (j >= 0 && a[j] > key) {
        a[j + 1] = a[j];
        out.push(makeStep(a, j, j + 1, `Shift a[${j}] right`, 3));
        j -= 1;
      }
      a[j + 1] = key;
      out.push(makeStep(a, j + 1, i, `Insert key at ${j + 1}`, 4));
    }
  }

  out.push(makeStep(a, -1, -1, 'Sorted result', 0));
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

function draw3DMemory(step) {
  const arr = step?.arr ?? state.values;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const baseY = canvas.height * 0.74;
  const max = Math.max(...arr, 1);
  const width = Math.max(36, Math.min(66, (canvas.width - 80) / Math.max(arr.length, 1) - 8));
  const gap = 10;
  const total = arr.length * width + Math.max(arr.length - 1, 0) * gap;
  let x = (canvas.width - total) / 2;

  arr.forEach((v, i) => {
    const h = 34 + (v / max) * (canvas.height * 0.52);
    const y = baseY - h;
    const active = step && (i === step.a || i === step.b);
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
  words.forEach((w) => {
    const test = cur ? `${cur} ${w}` : w;
    if (c.measureText(test).width > maxWidth && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = test;
    }
  });
  if (cur) lines.push(cur);
  return lines;
}

function drawNodeShape(c, shape, x, y, w, h, color) {
  c.fillStyle = color;
  c.strokeStyle = '#dbe6ff';
  c.lineWidth = 1.4;
  if (shape === 'terminator') {
    c.beginPath();
    c.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
    c.fill(); c.stroke();
    return;
  }
  if (shape === 'decision') {
    c.beginPath();
    c.moveTo(x + w / 2, y);
    c.lineTo(x + w, y + h / 2);
    c.lineTo(x + w / 2, y + h);
    c.lineTo(x, y + h / 2);
    c.closePath();
    c.fill(); c.stroke();
    return;
  }
  if (shape === 'loop') {
    const r = 9;
    c.beginPath();
    c.moveTo(x + r, y);
    c.lineTo(x + w - r, y);
    c.quadraticCurveTo(x + w, y, x + w, y + r);
    c.lineTo(x + w, y + h - r);
    c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    c.lineTo(x + r, y + h);
    c.quadraticCurveTo(x, y + h, x, y + h - r);
    c.lineTo(x, y + r);
    c.quadraticCurveTo(x, y, x + r, y);
    c.closePath();
    c.fill(); c.stroke();
    return;
  }
  c.fillRect(x, y, w, h);
  c.strokeRect(x, y, w, h);
}

function classifyShape(line, idx, total) {
  if (idx === 0) return 'terminator';
  if (idx === total - 1) return 'terminator';
  if (line.includes('if ') || line.includes('while ')) return 'decision';
  if (line.includes('for ')) return 'loop';
  return 'process';
}

function draw3DFlowchart(step) {
  const lines = docs[state.algo].lines;
  const active = step?.line ?? -1;
  fctx.clearRect(0, 0, flowCanvas.width, flowCanvas.height);
  fctx.fillStyle = '#0c1430';
  fctx.fillRect(0, 0, flowCanvas.width, flowCanvas.height);

  const n = lines.length;
  const nodeW = Math.min(540, flowCanvas.width - 70);
  const nodeH = Math.max(44, Math.min(62, (flowCanvas.height - 28 - (n - 1) * 14) / n));
  const x = (flowCanvas.width - nodeW) / 2;
  const top = 14;
  const gap = 14;

  fctx.font = '12px sans-serif';
  fctx.textAlign = 'center';

  for (let i = 0; i < n; i++) {
    const y = top + i * (nodeH + gap);
    const isActive = i === active;
    const shape = classifyShape(lines[i], i, n);
    const color = isActive ? '#5eead4' : '#3b5fb3';

    drawNodeShape(fctx, shape, x, y, nodeW, nodeH, color);

    const textColor = isActive ? '#03201b' : '#ecf2ff';
    fctx.fillStyle = textColor;
    const wrapped = wrapLines(fctx, lines[i], nodeW - 20).slice(0, 3);
    const ty = y + nodeH / 2 - ((wrapped.length - 1) * 7);
    wrapped.forEach((line, idx) => fctx.fillText(line, x + nodeW / 2, ty + idx * 14));

    if (i < n - 1) {
      const ax = x + nodeW / 2;
      const ay1 = y + nodeH + 3;
      const ay2 = y + nodeH + gap - 3;
      fctx.strokeStyle = i < active ? '#5eead4' : '#6781c1';
      fctx.lineWidth = 2;
      fctx.beginPath(); fctx.moveTo(ax, ay1); fctx.lineTo(ax, ay2); fctx.stroke();
      fctx.beginPath();
      fctx.moveTo(ax, ay2 + 4);
      fctx.lineTo(ax - 4, ay2 - 2);
      fctx.lineTo(ax + 4, ay2 - 2);
      fctx.closePath();
      fctx.fillStyle = fctx.strokeStyle;
      fctx.fill();
    }
  }
}

function renderPanels() {
  const upto = Math.max(0, state.stepIndex + 1);
  const list = state.steps.slice(0, upto).map((s, i) => `${i}. ${s.desc} -> [${s.arr.join(', ')}]`).join('\n');
  dryEl.textContent = list || 'No steps yet.';

  const current = state.steps[state.stepIndex] || null;
  stepEl.textContent = current
    ? `Step ${state.stepIndex}/${state.steps.length - 1}\n${current.desc}\nArray: [${current.arr.join(', ')}]\nActive line: ${current.line + 1}`
    : 'Press Load to generate dry-run.';

  draw3DMemory(current);
  draw3DFlowchart(current);
}

function loadSimulation() {
  state.algo = algoSelect.value;
  state.values = parseValues(valuesInput.value);
  if (!state.values.length) {
    statusEl.textContent = 'Please enter valid numbers (comma separated).';
    return;
  }
  state.steps = generateSteps(state.algo, state.values);
  state.stepIndex = 0;
  statusEl.textContent = `Loaded ${state.algo} with ${state.values.length} values.`;
  renderPanels();
}

function nextStep() {
  if (!state.steps.length) {
    statusEl.textContent = 'Load values first.';
    return;
  }
  if (state.stepIndex < state.steps.length - 1) {
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
document.getElementById('nextBtn').addEventListener('click', nextStep);
document.getElementById('resetBtn').addEventListener('click', resetAll);
algoSelect.addEventListener('change', () => { state.algo = algoSelect.value; renderPanels(); });

window.addEventListener('resize', () => { resize(); renderPanels(); });

resize();
renderPanels();
