const docs = {
  bubble: { lines: ['for i = 0..n-2', 'for j = 0..n-i-2', 'if a[j] > a[j+1] ?', 'swap(a[j], a[j+1])', 'next j / next i', 'end'] },
  selection: { lines: ['for i = 0..n-1', 'min = i', 'for j = i+1..n-1', 'if a[j] < a[min] ? min=j', 'swap(a[i], a[min])', 'end'] },
  insertion: { lines: ['for i = 1..n-1', 'key = a[i], j=i-1', 'while j>=0 and a[j] > key', 'a[j+1]=a[j], j--', 'a[j+1]=key', 'end'] },
  merge: { lines: ['split array recursively', 'sort left half', 'sort right half', 'compare heads of halves', 'write smaller to temp/result', 'end'] },
  quick: { lines: ['choose pivot (rightmost)', 'partition by pivot', 'swap smaller left', 'place pivot at boundary', 'recurse left / recurse right', 'end'] },
  linearSearch: { lines: ['for i = 0..n-1', 'if a[i] == target ?', 'return index i', 'continue scan', 'not found', 'end'] },
  binarySearch: { lines: ['sort array (if needed)', 'low=0, high=n-1', 'mid=(low+high)//2', 'if a[mid] == target ?', 'adjust low/high by compare', 'end'] },
};

const algoMeta = {
  bubble: { type: 'sort', insight: 'Bubble compares neighbors and pushes larger values right on each pass.' },
  selection: { type: 'sort', insight: 'Selection finds minimum in unsorted region, then places it at the next sorted index.' },
  insertion: { type: 'sort', insight: 'Insertion grows a sorted prefix by inserting the current key in the right spot.' },
  merge: { type: 'sort', insight: 'Merge sort follows divide-and-conquer: split, sort subproblems, and merge.' },
  quick: { type: 'sort', insight: 'Quick sort partitions around a pivot so values smaller than pivot move left.' },
  linearSearch: { type: 'search', insight: 'Linear search checks one index at a time from left to right.' },
  binarySearch: { type: 'search', insight: 'Binary search halves the search interval on each comparison in a sorted array.' },
};

const state = {
  algo: 'bubble',
  values: [],
  target: null,
  steps: [],
  stepIndex: -1,
  isAnimating: false,
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
const targetInput = document.getElementById('targetInput');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

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

function addFinalSortedStep(out, arr) {
  out.push(makeStep(arr, -1, -1, 'Sorted result', 5, 'Process complete: all values are in nondecreasing order.'));
}

function generateSortSteps(algo, input) {
  const a = [...input];
  const out = [makeStep(a, -1, -1, 'Initial state', 0, 'We begin with the user-provided unsorted values in memory.')];

  if (algo === 'bubble') {
    for (let i = 0; i < a.length - 1; i++) {
      out.push(makeStep(a, i, -1, `Start pass i=${i}`, 0, `Pass ${i + 1} bubbles the largest unsorted value toward index ${a.length - 1 - i}.`));
      for (let j = 0; j < a.length - i - 1; j++) {
        out.push(makeStep(a, j, j + 1, `Compare a[${j}] and a[${j + 1}]`, 2, `Compare adjacent values ${a[j]} and ${a[j + 1]}.`));
        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          out.push(makeStep(a, j, j + 1, `Swap a[${j}] and a[${j + 1}]`, 3, 'Left value is larger, so swap to keep bigger value moving right.'));
        }
      }
    }
    addFinalSortedStep(out, a);
    return out;
  }

  if (algo === 'selection') {
    for (let i = 0; i < a.length; i++) {
      let min = i;
      out.push(makeStep(a, i, min, `Set min=i=${i}`, 1, `Assume index ${i} is current minimum in unsorted region.`));
      for (let j = i + 1; j < a.length; j++) {
        out.push(makeStep(a, j, min, `Compare a[${j}] with min a[${min}]`, 3, `Check if ${a[j]} improves minimum over ${a[min]}.`));
        if (a[j] < a[min]) {
          min = j;
          out.push(makeStep(a, i, min, `Update min=${min}`, 3, `New minimum found at index ${min}.`));
        }
      }
      [a[i], a[min]] = [a[min], a[i]];
      out.push(makeStep(a, i, min, `Swap a[${i}] with a[${min}]`, 4, `Place pass minimum at sorted boundary index ${i}.`));
    }
    addFinalSortedStep(out, a);
    return out;
  }

  if (algo === 'insertion') {
    for (let i = 1; i < a.length; i++) {
      const key = a[i];
      let j = i - 1;
      out.push(makeStep(a, i, j, `Pick key=${key}`, 1, `Insert key into sorted prefix [0..${i - 1}].`));
      while (j >= 0 && a[j] > key) {
        a[j + 1] = a[j];
        out.push(makeStep(a, j, j + 1, `Shift a[${j}] right`, 3, `${a[j + 1]} is greater than key ${key}, so shift right.`));
        j -= 1;
      }
      a[j + 1] = key;
      out.push(makeStep(a, j + 1, i, `Insert key at index ${j + 1}`, 4, `Key ${key} is now placed in correct order position.`));
    }
    addFinalSortedStep(out, a);
    return out;
  }

  if (algo === 'merge') {
    const mergeSort = (lo, hi) => {
      if (lo >= hi) return;
      const mid = Math.floor((lo + hi) / 2);
      out.push(makeStep(a, lo, hi, `Split range [${lo}..${hi}] at mid=${mid}`, 0, 'Divide current range into two smaller subproblems.'));
      out.push(makeStep(a, lo, mid, `Sort left half [${lo}..${mid}]`, 1, 'Recursively sort left half first.'));
      mergeSort(lo, mid);
      out.push(makeStep(a, mid + 1, hi, `Sort right half [${mid + 1}..${hi}]`, 2, 'Recursively sort right half.'));
      mergeSort(mid + 1, hi);

      const left = a.slice(lo, mid + 1);
      const right = a.slice(mid + 1, hi + 1);
      let i = 0;
      let j = 0;
      let k = lo;
      while (i < left.length && j < right.length) {
        out.push(makeStep(a, lo + i, mid + 1 + j, `Compare left ${left[i]} vs right ${right[j]}`, 3, 'Choose the smaller front element from two sorted halves.'));
        if (left[i] <= right[j]) {
          a[k] = left[i++];
        } else {
          a[k] = right[j++];
        }
        out.push(makeStep(a, k, -1, `Write merged value at index ${k}`, 4, 'Write selected minimum into merged output region.'));
        k += 1;
      }
      while (i < left.length) {
        a[k] = left[i++];
        out.push(makeStep(a, k, -1, `Copy remaining left value to index ${k}`, 4, 'Right half exhausted; copy remaining left values.'));
        k += 1;
      }
      while (j < right.length) {
        a[k] = right[j++];
        out.push(makeStep(a, k, -1, `Copy remaining right value to index ${k}`, 4, 'Left half exhausted; copy remaining right values.'));
        k += 1;
      }
    };

    mergeSort(0, a.length - 1);
    addFinalSortedStep(out, a);
    return out;
  }

  if (algo === 'quick') {
    const quickSort = (lo, hi) => {
      if (lo >= hi) return;
      const pivot = a[hi];
      out.push(makeStep(a, hi, -1, `Choose pivot=${pivot} at index ${hi}`, 0, 'Use rightmost value as pivot for current partition.'));
      let i = lo;
      for (let j = lo; j < hi; j++) {
        out.push(makeStep(a, j, hi, `Compare a[${j}] with pivot`, 1, `If ${a[j]} <= ${pivot}, move it into left partition.`));
        if (a[j] <= pivot) {
          [a[i], a[j]] = [a[j], a[i]];
          out.push(makeStep(a, i, j, `Swap into left partition`, 2, `Placed ${a[i]} into pivot-left partition boundary.`));
          i += 1;
        }
      }
      [a[i], a[hi]] = [a[hi], a[i]];
      out.push(makeStep(a, i, hi, `Place pivot at index ${i}`, 3, 'Pivot is now in final sorted position for this partition.'));
      out.push(makeStep(a, lo, i - 1, `Recurse left [${lo}..${i - 1}]`, 4, 'Sort values smaller than pivot.'));
      quickSort(lo, i - 1);
      out.push(makeStep(a, i + 1, hi, `Recurse right [${i + 1}..${hi}]`, 4, 'Sort values larger than pivot.'));
      quickSort(i + 1, hi);
    };

    quickSort(0, a.length - 1);
    addFinalSortedStep(out, a);
    return out;
  }

  return out;
}

function generateSearchSteps(algo, input, target) {
  const out = [];
  if (algo === 'linearSearch') {
    out.push(makeStep(input, -1, -1, `Start linear search for ${target}`, 0, 'Linear search scans each index in order until a match appears.'));
    for (let i = 0; i < input.length; i++) {
      out.push(makeStep(input, i, -1, `Compare a[${i}] (${input[i]}) with target ${target}`, 1, 'Compare current value with target.'));
      if (input[i] === target) {
        out.push(makeStep(input, i, -1, `Found target at index ${i}`, 2, 'Match found, so we stop immediately.'));
        out.push(makeStep(input, i, -1, 'End', 5, 'Search successful.'));
        return out;
      }
      out.push(makeStep(input, i, -1, 'No match, continue scan', 3, 'Current value differs from target, move forward one index.'));
    }
    out.push(makeStep(input, -1, -1, 'Target not found', 4, 'All positions checked and no value matched target.'));
    out.push(makeStep(input, -1, -1, 'End', 5, 'Search ended with not found result.'));
    return out;
  }

  if (algo === 'binarySearch') {
    const arr = [...input].sort((a, b) => a - b);
    out.push(makeStep(arr, -1, -1, 'Sort input for binary search', 0, 'Binary search requires sorted order, so we work on sorted copy.'));
    let low = 0;
    let high = arr.length - 1;
    out.push(makeStep(arr, low, high, `Initialize low=${low}, high=${high}`, 1, 'The current search interval starts as the entire sorted array.'));

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      out.push(makeStep(arr, mid, -1, `Check mid=${mid}, value=${arr[mid]}`, 2, 'Midpoint splits current interval into two halves.'));
      if (arr[mid] === target) {
        out.push(makeStep(arr, mid, -1, `Found target at sorted index ${mid}`, 3, 'Middle value equals target, so search is complete.'));
        out.push(makeStep(arr, mid, -1, 'End', 5, 'Search successful.'));
        return out;
      }
      if (arr[mid] < target) {
        low = mid + 1;
        out.push(makeStep(arr, low, high, `Target is larger, set low=${low}`, 4, 'Discard left half including mid; target can only be on the right side.'));
      } else {
        high = mid - 1;
        out.push(makeStep(arr, low, high, `Target is smaller, set high=${high}`, 4, 'Discard right half including mid; target can only be on the left side.'));
      }
    }
    out.push(makeStep(arr, -1, -1, 'Target not found', 5, 'Interval became empty, which proves target is absent.'));
    return out;
  }

  return out;
}

function generateSteps(algo, input, target) {
  return algoMeta[algo].type === 'sort' ? generateSortSteps(algo, input) : generateSearchSteps(algo, input, target);
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
  const max = Math.max(1, ...arr.map((n) => Math.abs(n)));
  const width = Math.max(26, Math.min(52, (canvas.width - 80) / Math.max(arr.length, 1) - 8));
  const gap = 8;
  const total = arr.length * width + Math.max(arr.length - 1, 0) * gap;
  let x = (canvas.width - total) / 2;
  arr.forEach((v, i) => {
    const h = 24 + (Math.abs(v) / max) * (canvas.height * 0.56);
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
  if (line.includes('if ') || line.includes('while ') || line.includes('partition')) return 'decision';
  if (line.includes('for ') || line.includes('recurse') || line.includes('split')) return 'loop';
  return 'process';
}

function drawNodeShape(shape, x, y, w, h, color) {
  fctx.fillStyle = color;
  fctx.strokeStyle = '#dbe6ff';
  fctx.lineWidth = 1.4;

  if (shape === 'terminator') {
    fctx.beginPath();
    fctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
    fctx.fill();
    fctx.stroke();
    return;
  }

  if (shape === 'decision') {
    fctx.beginPath();
    fctx.moveTo(x + w / 2, y);
    fctx.lineTo(x + w, y + h / 2);
    fctx.lineTo(x + w / 2, y + h);
    fctx.lineTo(x, y + h / 2);
    fctx.closePath();
    fctx.fill();
    fctx.stroke();
    return;
  }

  if (shape === 'loop') {
    const r = 8;
    fctx.beginPath();
    fctx.moveTo(x + r, y); fctx.lineTo(x + w - r, y); fctx.quadraticCurveTo(x + w, y, x + w, y + r);
    fctx.lineTo(x + w, y + h - r); fctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    fctx.lineTo(x + r, y + h); fctx.quadraticCurveTo(x, y + h, x, y + h - r);
    fctx.lineTo(x, y + r); fctx.quadraticCurveTo(x, y, x + r, y); fctx.closePath();
    fctx.fill();
    fctx.stroke();
    return;
  }

  fctx.fillRect(x, y, w, h);
  fctx.strokeRect(x, y, w, h);
}

function drawFlow(step) {
  const lines = docs[state.algo].lines;
  const active = step?.line ?? -1;
  fctx.clearRect(0, 0, flowCanvas.width, flowCanvas.height);
  fctx.fillStyle = '#0c1430';
  fctx.fillRect(0, 0, flowCanvas.width, flowCanvas.height);

  const n = lines.length;
  const nodeW = Math.min(460, flowCanvas.width - 88);
  const x = (flowCanvas.width - nodeW) / 2;
  const top = 12;
  const gap = 10;

  const shapeMeta = lines.map((line, i) => classifyShape(line, i, n));
  const weight = (shape) => (shape === 'decision' ? 1.1 : shape === 'terminator' ? 0.92 : shape === 'loop' ? 1.03 : 0.96);
  const totalWeight = shapeMeta.reduce((acc, shape) => acc + weight(shape), 0);
  const availableH = flowCanvas.height - (2 * top) - ((n - 1) * gap);
  const baseH = Math.max(30, Math.min(48, availableH / Math.max(totalWeight, 1)));

  let yCursor = top;
  for (let i = 0; i < n; i++) {
    const shape = shapeMeta[i];
    const nodeH = baseH * weight(shape);
    const y = yCursor;
    const isActive = i === active;
    drawNodeShape(shape, x, y, nodeW, nodeH, isActive ? '#5eead4' : '#3b5fb3');

    fctx.fillStyle = isActive ? '#03201b' : '#ecf2ff';
    fctx.font = '11px sans-serif';
    fctx.textAlign = 'center';
    const wrapped = wrapLines(fctx, lines[i], nodeW - 20);
    const visibleLines = wrapped.slice(0, 3);
    const ty = y + (nodeH / 2) - ((visibleLines.length - 1) * 6);
    visibleLines.forEach((line, idx) => fctx.fillText(line, x + nodeW / 2, ty + (idx * 12)));

    if (i < n - 1) {
      const cx = x + nodeW / 2;
      const y1 = y + nodeH + 2;
      const y2 = y + nodeH + gap - 2;
      fctx.strokeStyle = i < active ? '#5eead4' : '#6781c1';
      fctx.lineWidth = 1.8;
      fctx.beginPath(); fctx.moveTo(cx, y1); fctx.lineTo(cx, y2); fctx.stroke();
      fctx.beginPath(); fctx.moveTo(cx, y2 + 3); fctx.lineTo(cx - 3.5, y2 - 1.5); fctx.lineTo(cx + 3.5, y2 - 1.5); fctx.closePath(); fctx.fillStyle = fctx.strokeStyle; fctx.fill();
    }

    yCursor += nodeH + gap;
  }
}

async function animateToStep(fromStep, toStep) {
  const start = fromStep?.arr ?? state.values;
  const end = toStep.arr;
  const a = toStep.a;
  const b = toStep.b;
  const frames = 42;
  const frameDelayMs = 34;

  for (let f = 1; f <= frames; f++) {
    const t = easeInOutCubic(f / frames);
    const interp = end.map((v, i) => {
      const sv = start[i] ?? v;
      return sv + ((v - sv) * t);
    });
    draw3DMemory(interp, a, b);
    drawFlow({ line: toStep.line });
    await sleep(frameDelayMs);
  }
}

function renderPanels() {
  const upto = Math.max(0, state.stepIndex + 1);
  dryEl.textContent = state.steps
    .slice(0, upto)
    .map((s, i) => `${i}. ${s.desc} -> [${s.arr.join(', ')}]`)
    .join('\n') || 'No steps yet.';

  const current = state.steps[state.stepIndex] || null;
  const insight = algoMeta[state.algo]?.insight ?? '';
  stepEl.textContent = current
    ? `Step ${state.stepIndex}/${state.steps.length - 1}\nAction: ${current.desc}\nWhy: ${current.explain}\nTechnique insight: ${insight}\nCurrent array: [${current.arr.join(', ')}]\nActive code line: ${current.line + 1}`
    : 'Press Load to generate step-by-step dry run.';

  draw3DMemory(current?.arr ?? state.values, current?.a ?? -1, current?.b ?? -1);
  drawFlow(current);
}

function loadSimulation() {
  state.algo = algoSelect.value;
  state.values = parseValues(valuesInput.value);
  state.target = targetInput.value === '' ? null : Number(targetInput.value);

  if (!state.values.length) {
    statusEl.textContent = 'Please enter valid numbers (comma separated).';
    return;
  }

  if (algoMeta[state.algo].type === 'search' && (state.target === null || Number.isNaN(state.target))) {
    statusEl.textContent = 'Please enter a valid target for searching.';
    return;
  }

  state.steps = generateSteps(state.algo, state.values, state.target);
  state.stepIndex = 0;
  statusEl.textContent = `Loaded ${state.algo} (${algoMeta[state.algo].type}) with ${state.values.length} values${algoMeta[state.algo].type === 'search' ? `, target=${state.target}` : ''}.`;
  renderPanels();
}

async function nextStep() {
  if (state.isAnimating) return;
  if (!state.steps.length) {
    statusEl.textContent = 'Load values first.';
    return;
  }

  if (state.stepIndex < state.steps.length - 1) {
    state.isAnimating = true;
    const prev = state.steps[state.stepIndex];
    const next = state.steps[state.stepIndex + 1];
    statusEl.textContent = `Animating step ${state.stepIndex + 1}/${state.steps.length - 1} slowly...`;
    await animateToStep(prev, next);
    state.stepIndex += 1;
    renderPanels();
    state.isAnimating = false;
  }

  statusEl.textContent = state.stepIndex >= state.steps.length - 1 ? 'Done.' : `Step ${state.stepIndex}/${state.steps.length - 1}`;
}

function resetAll() {
  state.values = [];
  state.target = null;
  state.steps = [];
  state.stepIndex = -1;
  valuesInput.value = '';
  targetInput.value = '';
  statusEl.textContent = 'Reset complete. Enter values and load again.';
  renderPanels();
}

document.getElementById('loadBtn').addEventListener('click', loadSimulation);
document.getElementById('nextBtn').addEventListener('click', () => { void nextStep(); });
document.getElementById('resetBtn').addEventListener('click', resetAll);

algoSelect.addEventListener('change', () => {
  state.algo = algoSelect.value;
  targetInput.disabled = algoMeta[state.algo].type !== 'search';
  renderPanels();
});

window.addEventListener('resize', () => {
  resize();
  renderPanels();
});

targetInput.disabled = true;
resize();
renderPanels();
