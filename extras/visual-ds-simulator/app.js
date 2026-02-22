const docs = {
  bubble: { lines: ['for i = 0..n-2', 'for j = 0..n-i-2', 'if a[j] > a[j+1] ?', 'swap(a[j], a[j+1])', 'next j / next i', 'end'] },
  selection: { lines: ['for i = 0..n-1', 'min = i', 'for j = i+1..n-1', 'if a[j] < a[min] ? min=j', 'swap(a[i], a[min])', 'end'] },
  insertion: { lines: ['for i = 1..n-1', 'key = a[i], j=i-1', 'while j>=0 and a[j] > key', 'a[j+1]=a[j], j--', 'a[j+1]=key', 'end'] },
  merge: { lines: ['split array recursively', 'sort left half', 'sort right half', 'compare heads of halves', 'write smaller to temp/result', 'end'] },
  quick: { lines: ['choose pivot (rightmost)', 'partition by pivot', 'swap smaller left', 'place pivot at boundary', 'recurse left / recurse right', 'end'] },
  heap: { lines: ['build max heap', 'heapify parent', 'swap root with end', 'shrink heap size', 'heapify root again', 'end'] },
  shell: { lines: ['gap = n//2', 'for i=gap..n-1', 'shift by gap while needed', 'insert temp at correct gap spot', 'gap = gap//2', 'end'] },
  linearSearch: { lines: ['for i = 0..n-1', 'if a[i] == target ?', 'return index i', 'continue scan', 'not found', 'end'] },
  binarySearch: { lines: ['sort array (if needed)', 'low=0, high=n-1', 'mid=(low+high)//2', 'if a[mid] == target ?', 'adjust low/high by compare', 'end'] },
  jumpSearch: { lines: ['sort array (if needed)', 'jump by block size √n', 'find block where target may exist', 'linear scan inside block', 'return index or not found', 'end'] },
};

const algoMeta = {
  bubble: { type: 'sort', insight: 'Bubble compares neighbors and pushes larger values right on each pass.' },
  selection: { type: 'sort', insight: 'Selection finds minimum in unsorted region and places it at the boundary.' },
  insertion: { type: 'sort', insight: 'Insertion grows a sorted prefix by inserting each key into position.' },
  merge: { type: 'sort', insight: 'Merge sort uses divide-and-conquer: split, sort, then merge.' },
  quick: { type: 'sort', insight: 'Quick sort partitions around a pivot and recurses on two sides.' },
  heap: { type: 'sort', insight: 'Heap sort repeatedly extracts max from a max-heap.' },
  shell: { type: 'sort', insight: 'Shell sort performs gapped insertion passes with shrinking gaps.' },
  linearSearch: { type: 'search', insight: 'Linear search checks one index at a time.' },
  binarySearch: { type: 'search', insight: 'Binary search halves the search interval each comparison.' },
  jumpSearch: { type: 'search', insight: 'Jump search skips blocks first, then scans inside one block.' },
};

const state = {
  algo: 'bubble',
  values: [],
  target: null,
  steps: [],
  stepIndex: -1,
  isAnimating: false,
  autoTimer: null,
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
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');

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
  out.push(makeStep(arr, -1, -1, 'Sorted result', 5, 'Sorting completed: all values are in ascending order.'));
}

function pushStep(out, arr, a, b, desc, line, explain) {
  out.push(makeStep(arr, a, b, desc, line, explain));
}

function generateSortSteps(algo, input) {
  const a = [...input];
  const out = [makeStep(a, -1, -1, 'Initial state', 0, 'We begin with the user-provided array in memory.')];

  if (algo === 'bubble') {
    for (let i = 0; i < a.length - 1; i++) {
      pushStep(out, a, i, -1, `Start pass i=${i}`, 0, `Pass ${i + 1}: move the largest remaining value toward index ${a.length - 1 - i}.`);
      for (let j = 0; j < a.length - i - 1; j++) {
        pushStep(out, a, j, j + 1, `Compare a[${j}] and a[${j + 1}]`, 2, `Compare neighbors ${a[j]} and ${a[j + 1]}.`);
        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          pushStep(out, a, j, j + 1, 'Swap neighbors', 3, 'Left value is larger, so swap to preserve ascending order.');
        }
      }
    }
    addFinalSortedStep(out, a);
    return out;
  }

  if (algo === 'selection') {
    for (let i = 0; i < a.length; i++) {
      let min = i;
      pushStep(out, a, i, min, `Set min=i=${i}`, 1, 'Start by assuming current boundary value is minimum.');
      for (let j = i + 1; j < a.length; j++) {
        pushStep(out, a, j, min, `Compare a[${j}] and a[min]`, 3, `Check if ${a[j]} is smaller than current minimum ${a[min]}.`);
        if (a[j] < a[min]) {
          min = j;
          pushStep(out, a, i, min, `Update min=${min}`, 3, 'Found a new minimum index in unsorted region.');
        }
      }
      [a[i], a[min]] = [a[min], a[i]];
      pushStep(out, a, i, min, `Swap boundary with min`, 4, 'Place smallest unsorted value at next sorted boundary.');
    }
    addFinalSortedStep(out, a);
    return out;
  }

  if (algo === 'insertion') {
    for (let i = 1; i < a.length; i++) {
      const key = a[i];
      let j = i - 1;
      pushStep(out, a, i, j, `Pick key=${key}`, 1, 'Take current value and insert into sorted prefix.');
      while (j >= 0 && a[j] > key) {
        a[j + 1] = a[j];
        pushStep(out, a, j, j + 1, 'Shift right by one', 3, `${a[j + 1]} is greater than key ${key}, so shift it right.`);
        j -= 1;
      }
      a[j + 1] = key;
      pushStep(out, a, j + 1, i, 'Insert key', 4, 'Key is placed into its correct sorted position.');
    }
    addFinalSortedStep(out, a);
    return out;
  }

  if (algo === 'merge') {
    const mergeSort = (lo, hi) => {
      if (lo >= hi) return;
      const mid = Math.floor((lo + hi) / 2);
      pushStep(out, a, lo, hi, `Split [${lo}..${hi}]`, 0, 'Divide array into two smaller subproblems.');
      pushStep(out, a, lo, mid, `Sort left [${lo}..${mid}]`, 1, 'Recursively solve left half first.');
      mergeSort(lo, mid);
      pushStep(out, a, mid + 1, hi, `Sort right [${mid + 1}..${hi}]`, 2, 'Then recursively solve right half.');
      mergeSort(mid + 1, hi);

      const left = a.slice(lo, mid + 1);
      const right = a.slice(mid + 1, hi + 1);
      let i = 0;
      let j = 0;
      let k = lo;

      while (i < left.length && j < right.length) {
        pushStep(out, a, lo + i, mid + 1 + j, 'Compare front of both halves', 3, 'Choose the smaller front element to maintain sorted merge output.');
        if (left[i] <= right[j]) {
          a[k] = left[i++];
        } else {
          a[k] = right[j++];
        }
        pushStep(out, a, k, -1, `Write at index ${k}`, 4, 'Write selected value into merge destination.');
        k += 1;
      }
      while (i < left.length) {
        a[k] = left[i++];
        pushStep(out, a, k, -1, `Copy remaining left`, 4, 'Right half finished, copy left remainder.');
        k += 1;
      }
      while (j < right.length) {
        a[k] = right[j++];
        pushStep(out, a, k, -1, `Copy remaining right`, 4, 'Left half finished, copy right remainder.');
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
      let i = lo;
      pushStep(out, a, hi, -1, `Choose pivot=${pivot}`, 0, 'Use last element as pivot for partitioning.');
      for (let j = lo; j < hi; j++) {
        pushStep(out, a, j, hi, `Compare with pivot`, 1, `If ${a[j]} <= ${pivot}, move it to left partition.`);
        if (a[j] <= pivot) {
          [a[i], a[j]] = [a[j], a[i]];
          pushStep(out, a, i, j, 'Swap into left partition', 2, 'Preserve invariant: left partition values are <= pivot.');
          i += 1;
        }
      }
      [a[i], a[hi]] = [a[hi], a[i]];
      pushStep(out, a, i, hi, `Place pivot at ${i}`, 3, 'Pivot reaches final sorted position for this partition.');
      pushStep(out, a, lo, i - 1, `Recurse left`, 4, 'Sort smaller-than-pivot section.');
      quickSort(lo, i - 1);
      pushStep(out, a, i + 1, hi, `Recurse right`, 4, 'Sort greater-than-pivot section.');
      quickSort(i + 1, hi);
    };
    quickSort(0, a.length - 1);
    addFinalSortedStep(out, a);
    return out;
  }

  if (algo === 'heap') {
    const heapify = (n, i) => {
      let largest = i;
      const l = (2 * i) + 1;
      const r = (2 * i) + 2;
      pushStep(out, a, i, -1, `Heapify node ${i}`, 1, 'Ensure parent is greater than its children in max heap.');
      if (l < n && a[l] > a[largest]) largest = l;
      if (r < n && a[r] > a[largest]) largest = r;
      if (largest !== i) {
        [a[i], a[largest]] = [a[largest], a[i]];
        pushStep(out, a, i, largest, 'Swap parent with larger child', 2, 'Move larger child upward to maintain heap property.');
        heapify(n, largest);
      }
    };

    for (let i = Math.floor(a.length / 2) - 1; i >= 0; i--) {
      pushStep(out, a, i, -1, `Build heap at i=${i}`, 0, 'Build max heap from last non-leaf up to root.');
      heapify(a.length, i);
    }

    for (let end = a.length - 1; end > 0; end--) {
      [a[0], a[end]] = [a[end], a[0]];
      pushStep(out, a, 0, end, `Move max to index ${end}`, 2, 'Current max (root) moves to final sorted suffix.');
      pushStep(out, a, 0, end, `Reduce heap size to ${end}`, 3, 'Sorted suffix grows by one from right side.');
      heapify(end, 0);
      pushStep(out, a, 0, -1, 'Re-heapify root', 4, 'Restore heap property for reduced heap.');
    }
    addFinalSortedStep(out, a);
    return out;
  }

  if (algo === 'shell') {
    for (let gap = Math.floor(a.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
      pushStep(out, a, gap, -1, `Set gap=${gap}`, 0, 'Use larger jumps first, then refine with smaller gaps.');
      for (let i = gap; i < a.length; i++) {
        const temp = a[i];
        let j = i;
        pushStep(out, a, i, -1, `Consider value ${temp}`, 1, 'Insert this value into its gap-sorted subsequence.');
        while (j >= gap && a[j - gap] > temp) {
          a[j] = a[j - gap];
          pushStep(out, a, j - gap, j, 'Gap-shift right', 2, 'Shift larger value right by gap to make insertion spot.');
          j -= gap;
        }
        a[j] = temp;
        pushStep(out, a, j, i, `Place temp at ${j}`, 3, 'Insert value at correct position for this gap pass.');
      }
      pushStep(out, a, gap, -1, `Shrink gap`, 4, 'Reduce gap to increase sorting precision.');
    }
    addFinalSortedStep(out, a);
    return out;
  }

  return out;
}

function generateSearchSteps(algo, input, target) {
  const out = [];

  if (algo === 'linearSearch') {
    pushStep(out, input, -1, -1, `Start linear search for ${target}`, 0, 'Scan indices one by one until match or end.');
    for (let i = 0; i < input.length; i++) {
      pushStep(out, input, i, -1, `Compare index ${i}`, 1, `Check if ${input[i]} equals target ${target}.`);
      if (input[i] === target) {
        pushStep(out, input, i, -1, `Found target at ${i}`, 2, 'Match found, terminate immediately.');
        pushStep(out, input, i, -1, 'End', 5, 'Search successful.');
        return out;
      }
      pushStep(out, input, i, -1, 'Continue scan', 3, 'No match here, move to next index.');
    }
    pushStep(out, input, -1, -1, 'Not found', 4, 'All positions checked; target is absent.');
    pushStep(out, input, -1, -1, 'End', 5, 'Search unsuccessful.');
    return out;
  }

  if (algo === 'binarySearch') {
    const arr = [...input].sort((a, b) => a - b);
    pushStep(out, arr, -1, -1, 'Sort input copy', 0, 'Binary search needs sorted order.');
    let low = 0;
    let high = arr.length - 1;
    pushStep(out, arr, low, high, `Init low=${low}, high=${high}`, 1, 'Start with full interval.');
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      pushStep(out, arr, mid, -1, `Check mid=${mid}`, 2, `Mid value is ${arr[mid]}.`);
      if (arr[mid] === target) {
        pushStep(out, arr, mid, -1, `Found target at ${mid}`, 3, 'Mid equals target.');
        pushStep(out, arr, mid, -1, 'End', 5, 'Search successful.');
        return out;
      }
      if (arr[mid] < target) {
        low = mid + 1;
        pushStep(out, arr, low, high, `Move low to ${low}`, 4, 'Target is larger, discard left half.');
      } else {
        high = mid - 1;
        pushStep(out, arr, low, high, `Move high to ${high}`, 4, 'Target is smaller, discard right half.');
      }
    }
    pushStep(out, arr, -1, -1, 'Not found', 5, 'Interval collapsed without a match.');
    return out;
  }

  if (algo === 'jumpSearch') {
    const arr = [...input].sort((a, b) => a - b);
    const n = arr.length;
    const jump = Math.max(1, Math.floor(Math.sqrt(n)));
    pushStep(out, arr, -1, -1, 'Sort input copy', 0, 'Jump search works on sorted data.');
    let prev = 0;
    let step = jump;
    pushStep(out, arr, prev, Math.min(step, n) - 1, `Set jump size=${jump}`, 1, 'Use block size ≈ √n to skip ahead quickly.');

    while (prev < n && arr[Math.min(step, n) - 1] < target) {
      pushStep(out, arr, Math.min(step, n) - 1, -1, 'Jump to next block', 2, 'Block end is still less than target; skip this block.');
      prev = step;
      step += jump;
      if (prev >= n) {
        pushStep(out, arr, -1, -1, 'Not found', 5, 'Jumped beyond array bounds without candidate block.');
        return out;
      }
      pushStep(out, arr, prev, Math.min(step, n) - 1, 'New candidate block', 2, 'Target may exist in this new block range.');
    }

    for (let i = prev; i < Math.min(step, n); i++) {
      pushStep(out, arr, i, -1, `Linear check index ${i}`, 3, 'Perform local linear scan inside candidate block.');
      if (arr[i] === target) {
        pushStep(out, arr, i, -1, `Found target at ${i}`, 4, 'Matched inside block scan.');
        pushStep(out, arr, i, -1, 'End', 5, 'Search successful.');
        return out;
      }
    }

    pushStep(out, arr, -1, -1, 'Not found', 5, 'Target absent in candidate block and array.');
    return out;
  }

  return out;
}

function generateSteps(algo, input, target) {
  return algoMeta[algo].type === 'sort' ? generateSortSteps(algo, input) : generateSearchSteps(algo, input, target);
}

function drawBar3D(x, y, w, h, color, value, idx) {
  const d = 8;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#78a8ff';
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + d, y - d); ctx.lineTo(x + d + w, y - d); ctx.lineTo(x + w, y); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#2e5fb5';
  ctx.beginPath(); ctx.moveTo(x + w, y); ctx.lineTo(x + w + d, y - d); ctx.lineTo(x + w + d, y + h - d); ctx.lineTo(x + w, y + h); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#dbe6ff'; ctx.strokeRect(x, y, w, h);
  ctx.fillStyle = '#f5f8ff'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(String(Math.round(value * 100) / 100), x + w / 2, y - 10);
  ctx.fillText(`i:${idx}`, x + w / 2, y + h + 15);
}

function draw3DMemory(arr, a = -1, b = -1) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const baseY = canvas.height * 0.74;
  const max = Math.max(1, ...arr.map((n) => Math.abs(n)));
  const width = Math.max(24, Math.min(48, (canvas.width - 90) / Math.max(arr.length, 1) - 8));
  const gap = 8;
  const total = arr.length * width + Math.max(arr.length - 1, 0) * gap;
  let x = (canvas.width - total) / 2;
  arr.forEach((v, i) => {
    const h = 24 + (Math.abs(v) / max) * (canvas.height * 0.55);
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
  if (line.includes('if ') || line.includes('while ') || line.includes('partition') || line.includes('found')) return 'decision';
  if (line.includes('for ') || line.includes('recurse') || line.includes('split') || line.includes('jump')) return 'loop';
  return 'process';
}

function drawNodeShape(shape, x, y, w, h, color) {
  fctx.fillStyle = color;
  fctx.strokeStyle = '#dbe6ff';
  fctx.lineWidth = 1.2;
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
    const r = 7;
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
  const nodeW = Math.min(420, flowCanvas.width - 90);
  const x = (flowCanvas.width - nodeW) / 2;
  const top = 12;
  const gap = 10;
  const shapeMeta = lines.map((line, i) => classifyShape(line, i, n));
  const weight = (shape) => (shape === 'decision' ? 1.08 : shape === 'terminator' ? 0.9 : shape === 'loop' ? 1.0 : 0.95);
  const totalWeight = shapeMeta.reduce((acc, shape) => acc + weight(shape), 0);
  const availableH = flowCanvas.height - (2 * top) - ((n - 1) * gap);
  const baseH = Math.max(28, Math.min(44, availableH / Math.max(1, totalWeight)));

  let yCursor = top;
  for (let i = 0; i < n; i++) {
    const shape = shapeMeta[i];
    const nodeH = baseH * weight(shape);
    const y = yCursor;
    drawNodeShape(shape, x, y, nodeW, nodeH, i === active ? '#5eead4' : '#3b5fb3');

    fctx.fillStyle = i === active ? '#03201b' : '#ecf2ff';
    fctx.font = '11px sans-serif';
    fctx.textAlign = 'center';
    const wrapped = wrapLines(fctx, lines[i], nodeW - 20).slice(0, 3);
    const textY = y + (nodeH / 2) - ((wrapped.length - 1) * 6);
    wrapped.forEach((line, idx) => fctx.fillText(line, x + nodeW / 2, textY + (idx * 12)));

    if (i < n - 1) {
      const cx = x + nodeW / 2;
      const y1 = y + nodeH + 2;
      const y2 = y + nodeH + gap - 2;
      fctx.strokeStyle = i < active ? '#5eead4' : '#6781c1';
      fctx.lineWidth = 1.7;
      fctx.beginPath(); fctx.moveTo(cx, y1); fctx.lineTo(cx, y2); fctx.stroke();
      fctx.beginPath(); fctx.moveTo(cx, y2 + 3); fctx.lineTo(cx - 3.5, y2 - 1); fctx.lineTo(cx + 3.5, y2 - 1); fctx.closePath(); fctx.fillStyle = fctx.strokeStyle; fctx.fill();
    }

    yCursor += nodeH + gap;
  }
}

async function animateToStep(fromStep, toStep) {
  const start = fromStep?.arr ?? state.values;
  const end = toStep.arr;
  const frames = 44;
  const frameDelayMs = 34;

  for (let f = 1; f <= frames; f++) {
    const t = easeInOutCubic(f / frames);
    const interp = end.map((v, i) => {
      const sv = start[i] ?? v;
      return sv + ((v - sv) * t);
    });
    draw3DMemory(interp, toStep.a, toStep.b);
    drawFlow({ line: toStep.line });
    await sleep(frameDelayMs);
  }
}

function updateButtons() {
  const loaded = state.steps.length > 0;
  prevBtn.disabled = !loaded || state.stepIndex <= 0 || state.isAnimating;
  nextBtn.disabled = !loaded || state.stepIndex >= state.steps.length - 1 || state.isAnimating;
  playBtn.disabled = !loaded || state.stepIndex >= state.steps.length - 1 || state.isAnimating;
  pauseBtn.disabled = state.autoTimer === null;
}

function renderPanels() {
  const upto = Math.max(0, state.stepIndex + 1);
  dryEl.textContent = state.steps.slice(0, upto).map((s, i) => `${i}. ${s.desc} -> [${s.arr.join(', ')}]`).join('\n') || 'No steps yet.';

  const current = state.steps[state.stepIndex] || null;
  const insight = algoMeta[state.algo]?.insight ?? '';
  stepEl.textContent = current
    ? `Step ${state.stepIndex}/${state.steps.length - 1}\nAction: ${current.desc}\nWhy: ${current.explain}\nTechnique insight: ${insight}\nCurrent array: [${current.arr.join(', ')}]\nActive code line: ${current.line + 1}`
    : 'Press Load to generate step-by-step dry run.';

  draw3DMemory(current?.arr ?? state.values, current?.a ?? -1, current?.b ?? -1);
  drawFlow(current);
  updateButtons();
}

function stopAutoPlay() {
  if (state.autoTimer !== null) {
    clearInterval(state.autoTimer);
    state.autoTimer = null;
  }
  updateButtons();
}

function loadSimulation() {
  stopAutoPlay();
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
  statusEl.textContent = `Loaded ${state.algo} (${algoMeta[state.algo].type}) with ${state.values.length} values${algoMeta[state.algo].type === 'search' ? `, target=${state.target}` : ''}. Use Prev/Next/Auto Play/Pause operations.`;
  renderPanels();
}

async function goToStep(newIndex) {
  if (state.isAnimating || !state.steps.length) return;
  if (newIndex < 0 || newIndex >= state.steps.length || newIndex === state.stepIndex) return;
  state.isAnimating = true;
  statusEl.textContent = `Animating to step ${newIndex}/${state.steps.length - 1}...`;
  await animateToStep(state.steps[state.stepIndex], state.steps[newIndex]);
  state.stepIndex = newIndex;
  state.isAnimating = false;
  statusEl.textContent = state.stepIndex >= state.steps.length - 1 ? 'Done.' : `Step ${state.stepIndex}/${state.steps.length - 1}`;
  renderPanels();
}

async function nextStep() {
  if (!state.steps.length) {
    statusEl.textContent = 'Load values first.';
    return;
  }
  await goToStep(state.stepIndex + 1);
}

async function prevStep() {
  if (!state.steps.length) {
    statusEl.textContent = 'Load values first.';
    return;
  }
  await goToStep(state.stepIndex - 1);
}

function startAutoPlay() {
  if (!state.steps.length || state.stepIndex >= state.steps.length - 1) return;
  stopAutoPlay();
  statusEl.textContent = 'Auto Play running (slow mode)...';
  state.autoTimer = setInterval(() => {
    if (state.isAnimating) return;
    if (state.stepIndex >= state.steps.length - 1) {
      stopAutoPlay();
      statusEl.textContent = 'Auto Play complete.';
      return;
    }
    void nextStep();
  }, 1850);
  updateButtons();
}

function resetAll() {
  stopAutoPlay();
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
nextBtn.addEventListener('click', () => { void nextStep(); });
prevBtn.addEventListener('click', () => { void prevStep(); });
playBtn.addEventListener('click', startAutoPlay);
pauseBtn.addEventListener('click', () => {
  stopAutoPlay();
  statusEl.textContent = 'Auto Play paused.';
});
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
