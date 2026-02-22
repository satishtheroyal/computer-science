const docs = {
  bubble: {
    code: `for i = 0..n-2\n  for j = 0..n-i-2\n    if a[j] > a[j+1]\n      swap(a[j], a[j+1])`,
    flow: `Start -> Outer loop i\nInner loop j\nCompare neighbors\nSwap if left > right\nRepeat\nEnd`,
  },
  selection: {
    code: `for i = 0..n-1\n  min = i\n  for j = i+1..n-1\n    if a[j] < a[min]\n      min = j\n  swap(a[i], a[min])`,
    flow: `Start -> pick i\nFind min in unsorted part\nSwap min with i\nMove boundary\nEnd`,
  },
  insertion: {
    code: `for i = 1..n-1\n  key = a[i]\n  j = i-1\n  while j>=0 and a[j] > key\n    a[j+1] = a[j]; j--\n  a[j+1] = key`,
    flow: `Start -> pick key\nShift bigger items right\nInsert key in hole\nRepeat\nEnd`,
  },
};

const state = {
  algo: 'bubble',
  values: [],
  steps: [],
  stepIndex: -1,
};

const canvas = document.getElementById('vizCanvas');
const ctx = canvas.getContext('2d');
const scene = document.getElementById('scene');
const statusEl = document.getElementById('status');
const codeEl = document.getElementById('codeBlock');
const flowEl = document.getElementById('flowchartBlock');
const dryEl = document.getElementById('dryRunBlock');
const stepEl = document.getElementById('stepBlock');
const algoSelect = document.getElementById('algorithmSelect');
const valuesInput = document.getElementById('valuesInput');

function resize() {
  canvas.width = scene.clientWidth;
  canvas.height = scene.clientHeight;
}

function parseValues(raw) {
  return raw.split(',').map((s) => s.trim()).filter(Boolean).map(Number).filter((n) => !Number.isNaN(n));
}

function makeStep(arr, a = -1, b = -1, desc = '') {
  return { arr: [...arr], a, b, desc };
}

function generateSteps(algo, input) {
  const a = [...input];
  const out = [makeStep(a, -1, -1, 'Initial state')];

  if (algo === 'bubble') {
    for (let i = 0; i < a.length - 1; i++) {
      for (let j = 0; j < a.length - i - 1; j++) {
        out.push(makeStep(a, j, j + 1, `Compare a[${j}] and a[${j + 1}]`));
        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          out.push(makeStep(a, j, j + 1, `Swap a[${j}] and a[${j + 1}]`));
        }
      }
    }
  }

  if (algo === 'selection') {
    for (let i = 0; i < a.length; i++) {
      let min = i;
      out.push(makeStep(a, i, min, `Start pass i=${i}, min=${min}`));
      for (let j = i + 1; j < a.length; j++) {
        out.push(makeStep(a, j, min, `Compare a[${j}] with current min a[${min}]`));
        if (a[j] < a[min]) {
          min = j;
          out.push(makeStep(a, i, min, `New min index = ${min}`));
        }
      }
      if (min !== i) {
        [a[i], a[min]] = [a[min], a[i]];
        out.push(makeStep(a, i, min, `Swap a[${i}] with a[${min}]`));
      }
    }
  }

  if (algo === 'insertion') {
    for (let i = 1; i < a.length; i++) {
      const key = a[i];
      let j = i - 1;
      out.push(makeStep(a, i, j, `Pick key=${key} at i=${i}`));
      while (j >= 0 && a[j] > key) {
        a[j + 1] = a[j];
        out.push(makeStep(a, j, j + 1, `Shift a[${j}] right`));
        j--;
      }
      a[j + 1] = key;
      out.push(makeStep(a, j + 1, i, `Insert key at position ${j + 1}`));
    }
  }

  out.push(makeStep(a, -1, -1, 'Sorted result'));
  return out;
}

function draw3DMemory(step) {
  const arr = step?.arr ?? state.values;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const baseY = canvas.height * 0.70;
  const max = Math.max(...arr, 1);
  const width = Math.max(40, Math.min(70, (canvas.width - 80) / Math.max(arr.length, 1) - 10));
  const gap = 12;
  const total = arr.length * width + Math.max(arr.length - 1, 0) * gap;
  let x = (canvas.width - total) / 2;

  arr.forEach((v, i) => {
    const h = 40 + (v / max) * 180;
    const y = baseY - h;
    const active = i === step.a || i === step.b;
    const color = active ? '#5eead4' : '#4f8cff';
    drawBar3D(x, y, width, h, color, v, i);
    x += width + gap;
  });

  ctx.fillStyle = '#a9bcff';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('3D Memory Blocks (values as heights)', 14, 24);
}

function drawBar3D(x, y, w, h, color, value, idx) {
  const d = 9;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);

  ctx.fillStyle = '#78a8ff';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + d, y - d);
  ctx.lineTo(x + d + w, y - d);
  ctx.lineTo(x + w, y);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#2e5fb5';
  ctx.beginPath();
  ctx.moveTo(x + w, y);
  ctx.lineTo(x + w + d, y - d);
  ctx.lineTo(x + w + d, y + h - d);
  ctx.lineTo(x + w, y + h);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#dbe6ff';
  ctx.strokeRect(x, y, w, h);
  ctx.fillStyle = '#f5f8ff';
  ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(String(value), x + w / 2, y - 10);
  ctx.fillText(`i:${idx}`, x + w / 2, y + h + 16);
}

function renderPanels() {
  const doc = docs[state.algo];
  codeEl.textContent = doc.code;
  flowEl.textContent = doc.flow;

  const upto = Math.max(0, state.stepIndex + 1);
  const list = state.steps.slice(0, upto).map((s, i) => `${i}. ${s.desc} -> [${s.arr.join(', ')}]`).join('\n');
  dryEl.textContent = list || 'No steps yet.';

  const current = state.steps[state.stepIndex] || null;
  stepEl.textContent = current
    ? `Step: ${state.stepIndex}/${state.steps.length - 1}\n${current.desc}\nArray: [${current.arr.join(', ')}]`
    : 'Press Load to generate dry-run.';

  draw3DMemory(current);
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
