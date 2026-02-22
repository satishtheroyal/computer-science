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
  linkedListSinglyInsert: { lines: ['head -> first node', 'create new node(target)', 'go to tail node', 'tail.next = new node', 'update links', 'end'] },
  linkedListSinglyDelete: { lines: ['head -> first node', 'find node == target', 'prev.next = curr.next', 'disconnect curr node', 'update links', 'end'] },
  linkedListSinglySearch: { lines: ['head -> first node', 'while curr != null', 'if curr.value == target', 'return found position', 'curr = curr.next', 'end'] },
  linkedListSinglyUpdate: { lines: ['find node == target', 'if found, node.value = newValue', 'maintain next links', 'report updated node', 'continue/finish', 'end'] },
  linkedListDoublyInsert: { lines: ['head / tail pointers', 'create new node(target)', 'tail.next = node', 'node.prev = tail', 'tail = node', 'end'] },
  linkedListDoublyDelete: { lines: ['find node == target', 'fix prev.next link', 'fix next.prev link', 'update head/tail if needed', 'remove node', 'end'] },
  linkedListDoublySearch: { lines: ['curr = head', 'while curr != null', 'if curr.value == target', 'return found position', 'curr = curr.next', 'end'] },
  linkedListDoublyUpdate: { lines: ['find node == target', 'if found, node.value = newValue', 'keep prev/next links intact', 'report updated node', 'continue/finish', 'end'] },
  linkedListCircularInsert: { lines: ['create node(target)', 'if empty set node->node', 'else find tail', 'tail.next = node', 'node.next = head', 'end'] },
  linkedListCircularDelete: { lines: ['find target with do-while', 'if deleting head, move head', 'bypass target node', 'maintain tail.next=head', 'remove node', 'end'] },
  linkedListCircularSearch: { lines: ['curr = head', 'do until back to head', 'if curr.value == target', 'return found position', 'curr = curr.next', 'end'] },
  linkedListCircularUpdate: { lines: ['do-while traverse for target', 'if found update node.value', 'preserve circular links', 'report updated node', 'stop when back to head', 'end'] },
  treeBFS: { lines: ['build tree nodes', 'enqueue root', 'while queue not empty', 'dequeue + visit node', 'enqueue children', 'end'] },
  graphBFS: { lines: ['build adjacency list', 'enqueue start + mark visited', 'while queue not empty', 'dequeue vertex', 'enqueue unvisited neighbors', 'end'] },
  hashingLinearProbe: { lines: ['init table with empty slots', 'hash(key) = key % size', 'if collision, probe next slot', 'insert / search in probed slot', 'repeat until found/empty', 'end'] },
  stackArrayPush: { lines: ['top initialized', 'if full -> overflow', 'top = top + 1', 'stack[top] = target', 'report pushed', 'end'] },
  stackArrayPop: { lines: ['if empty -> underflow', 'value = stack[top]', 'top = top - 1', 'return value', 'update stack', 'end'] },
  stackArrayPeek: { lines: ['if empty -> no top', 'read stack[top]', 'return top value', 'no mutation', 'report state', 'end'] },
  stackArrayUpdateTop: { lines: ['if empty -> underflow', 'read stack[top]', 'stack[top] = target', 'confirm updated top', 'return state', 'end'] },
  stackLinkedPush: { lines: ['create node(target)', 'node.next = top', 'top = node', 'update links', 'report pushed', 'end'] },
  stackLinkedPop: { lines: ['if top == null', 'value = top.value', 'top = top.next', 'disconnect old top', 'return value', 'end'] },
  stackLinkedUpdateTop: { lines: ['if top == null', 'read top node', 'top.value = target', 'keep next pointer', 'return state', 'end'] },
  queueLinearEnqueue: { lines: ['if full -> overflow', 'if empty init front', 'rear = rear + 1', 'queue[rear] = target', 'report enqueue', 'end'] },
  queueLinearDequeue: { lines: ['if empty -> underflow', 'value = queue[front]', 'front = front + 1', 'if front>rear reset', 'return value', 'end'] },
  queueLinearUpdateFront: { lines: ['if empty -> underflow', 'read queue[front]', 'queue[front] = target', 'front index unchanged', 'return state', 'end'] },
  queueCircularEnqueue: { lines: ['next = (rear+1)%size', 'if next==front full', 'rear = next', 'queue[rear] = target', 'keep circular links', 'end'] },
  queueCircularDequeue: { lines: ['if empty -> underflow', 'value = queue[front]', 'front = (front+1)%size', 'if became empty reset', 'return value', 'end'] },
  queueCircularUpdateFront: { lines: ['if empty -> underflow', 'read queue[front]', 'queue[front] = target', 'front remains same', 'return state', 'end'] },
  dequePushFront: { lines: ['if full -> overflow', 'front = (front-1+size)%size', 'deque[front] = target', 'if empty sync rear', 'report push-front', 'end'] },
  dequePushBack: { lines: ['if full -> overflow', 'rear = (rear+1)%size', 'deque[rear] = target', 'if empty sync front', 'report push-back', 'end'] },
  dequePopFront: { lines: ['if empty -> underflow', 'value = deque[front]', 'front = (front+1)%size', 'if became empty reset', 'return value', 'end'] },
  dequePopBack: { lines: ['if empty -> underflow', 'value = deque[rear]', 'rear = (rear-1+size)%size', 'if became empty reset', 'return value', 'end'] },
  dequeUpdateFront: { lines: ['if empty -> underflow', 'read deque[front]', 'deque[front] = target', 'front index unchanged', 'return state', 'end'] },
  dequeUpdateBack: { lines: ['if empty -> underflow', 'read deque[rear]', 'deque[rear] = target', 'rear index unchanged', 'return state', 'end'] },
};

const algoMeta = {
  bubble: { type: 'sort', insight: 'Bubble compares neighbors and pushes larger values right on each pass.', targetRequired: false },
  selection: { type: 'sort', insight: 'Selection finds minimum in unsorted region and places it at the boundary.', targetRequired: false },
  insertion: { type: 'sort', insight: 'Insertion grows a sorted prefix by inserting each key into position.', targetRequired: false },
  merge: { type: 'sort', insight: 'Merge sort uses divide-and-conquer: split, sort, then merge.', targetRequired: false },
  quick: { type: 'sort', insight: 'Quick sort partitions around a pivot and recurses on two sides.', targetRequired: false },
  heap: { type: 'sort', insight: 'Heap sort repeatedly extracts max from a max-heap.', targetRequired: false },
  shell: { type: 'sort', insight: 'Shell sort performs gapped insertion passes with shrinking gaps.', targetRequired: false },
  linearSearch: { type: 'search', insight: 'Linear search checks one index at a time.', targetRequired: true },
  binarySearch: { type: 'search', insight: 'Binary search halves the search interval each comparison.', targetRequired: true },
  jumpSearch: { type: 'search', insight: 'Jump search skips blocks first, then scans inside one block.', targetRequired: true },
  linkedListSinglyInsert: { type: 'ds', insight: 'Singly linked-list insertion updates only next pointer.', targetRequired: true },
  linkedListSinglyDelete: { type: 'ds', insight: 'Singly linked-list delete reconnects previous node to next node.', targetRequired: true },
  linkedListSinglySearch: { type: 'ds', insight: 'Singly linked-list search walks one node at a time.', targetRequired: true },
  linkedListSinglyUpdate: { type: 'ds', insight: 'Singly linked-list update modifies value after search.', targetRequired: true },
  linkedListDoublyInsert: { type: 'ds', insight: 'Doubly linked-list insert updates next and prev pointers.', targetRequired: true },
  linkedListDoublyDelete: { type: 'ds', insight: 'Doubly linked-list delete fixes links on both sides.', targetRequired: true },
  linkedListDoublySearch: { type: 'ds', insight: 'Doubly linked-list search traverses from head using next pointers.', targetRequired: true },
  linkedListDoublyUpdate: { type: 'ds', insight: 'Doubly linked-list update keeps bidirectional links unchanged.', targetRequired: true },
  linkedListCircularInsert: { type: 'ds', insight: 'Circular linked-list insert preserves tail.next = head.', targetRequired: true },
  linkedListCircularDelete: { type: 'ds', insight: 'Circular linked-list delete must keep the ring connected.', targetRequired: true },
  linkedListCircularSearch: { type: 'ds', insight: 'Circular linked-list search stops when traversal returns to head.', targetRequired: true },
  linkedListCircularUpdate: { type: 'ds', insight: 'Circular linked-list update changes node value without breaking cycle.', targetRequired: true },
  treeBFS: { type: 'ds', insight: 'Tree BFS visits nodes level-by-level using a queue.', targetRequired: false },
  graphBFS: { type: 'ds', insight: 'Graph BFS explores breadth-first from a start vertex.', targetRequired: false },
  hashingLinearProbe: { type: 'ds', insight: 'Linear probing resolves collisions by checking next slots.', targetRequired: true },
  stackArrayPush: { type: 'ds', insight: 'Array stack push writes at incremented top index.', targetRequired: true },
  stackArrayPop: { type: 'ds', insight: 'Array stack pop removes and returns the current top.', targetRequired: false },
  stackArrayPeek: { type: 'ds', insight: 'Array stack peek reads top without modifying stack.', targetRequired: false },
  stackArrayUpdateTop: { type: 'ds', insight: 'Array stack update rewrites top element.', targetRequired: true },
  stackLinkedPush: { type: 'ds', insight: 'Linked stack push prepends node at top pointer.', targetRequired: true },
  stackLinkedPop: { type: 'ds', insight: 'Linked stack pop advances top to top.next.', targetRequired: false },
  stackLinkedUpdateTop: { type: 'ds', insight: 'Linked stack update rewrites top node value.', targetRequired: true },
  queueLinearEnqueue: { type: 'ds', insight: 'Linear queue enqueue appends at rear.', targetRequired: true },
  queueLinearDequeue: { type: 'ds', insight: 'Linear queue dequeue removes from front.', targetRequired: false },
  queueLinearUpdateFront: { type: 'ds', insight: 'Linear queue update rewrites front element.', targetRequired: true },
  queueCircularEnqueue: { type: 'ds', insight: 'Circular queue enqueue wraps index using modulo.', targetRequired: true },
  queueCircularDequeue: { type: 'ds', insight: 'Circular queue dequeue advances front circularly.', targetRequired: false },
  queueCircularUpdateFront: { type: 'ds', insight: 'Circular queue update rewrites current front.', targetRequired: true },
  dequePushFront: { type: 'ds', insight: 'Deque push-front inserts at front end.', targetRequired: true },
  dequePushBack: { type: 'ds', insight: 'Deque push-back inserts at rear end.', targetRequired: true },
  dequePopFront: { type: 'ds', insight: 'Deque pop-front removes from front end.', targetRequired: false },
  dequePopBack: { type: 'ds', insight: 'Deque pop-back removes from rear end.', targetRequired: false },
  dequeUpdateFront: { type: 'ds', insight: 'Deque update-front rewrites front element.', targetRequired: true },
  dequeUpdateBack: { type: 'ds', insight: 'Deque update-back rewrites rear element.', targetRequired: true },
};

const state = {
  algo: 'bubble',
  values: [],
  target: null,
  updateValue: null,
  position: 'end',
  steps: [],
  stepIndex: -1,
  isAnimating: false,
  autoTimer: null,
  speed: 1,
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
const countInput = document.getElementById('countInput');
const randomBtn = document.getElementById('randomBtn');
const valuesLabel = document.getElementById('valuesLabel');
const countLabel = document.getElementById('countLabel');
const targetLabel = document.getElementById('targetLabel');
const positionLabel = document.getElementById('positionLabel');
const updateLabel = document.getElementById('updateLabel');
const opSelectLabel = document.getElementById('opSelectLabel');
const opIndexLabel = document.getElementById('opIndexLabel');
const opValueLabel = document.getElementById('opValueLabel');
const targetInput = document.getElementById('targetInput');
const positionSelect = document.getElementById('positionSelect');
const updateValueInput = document.getElementById('updateValueInput');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const speedRange = document.getElementById('speedRange');
const speedLabel = document.getElementById('speedLabel');
const opSelect = document.getElementById('opSelect');
const opIndexInput = document.getElementById('opIndexInput');
const opValueInput = document.getElementById('opValueInput');
const runOpBtn = document.getElementById('runOpBtn');

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


function clampCount(raw) {
  const n = Number(raw);
  if (Number.isNaN(n)) return 6;
  return Math.max(0, Math.min(20, Math.round(n)));
}

function generateRandomValues(count) {
  return Array.from({ length: count }, () => Math.floor(Math.random() * 100));
}

function syncValuesInput() {
  valuesInput.value = state.values.join(', ');
}

function randomizeSetupValues() {
  const count = clampCount(countInput.value);
  countInput.value = String(count);
  state.values = generateRandomValues(count);
  syncValuesInput();
  statusEl.textContent = count
    ? `Generated ${count} random values for ${state.algo}.`
    : 'Generated an empty input. Useful for empty-structure simulations.';
  renderPanels();
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

function generateDsSteps(algo, input, target, position = "end", updateValue = null) {
  const out = [];
  const arr = [...input];

  const mapDelete = (a, targetVal) => {
    const idx = a.indexOf(targetVal);
    if (idx >= 0) a.splice(idx, 1);
    return idx;
  };

  if (algo.includes('linkedList')) {
    const listType = algo.includes('Doubly') ? 'doubly' : (algo.includes('Circular') ? 'circular' : 'singly');
    pushStep(out, arr, -1, -1, `Build ${listType} linked list`, 0, `Interpret input array as ${listType} linked-list nodes.`);

    const pickIndex = () => {
      if (!arr.length) return -1;
      if (position === 'beginning') return 0;
      if (position === 'middle') return Math.floor(arr.length / 2);
      return arr.length - 1;
    };

    if (algo.endsWith('Insert')) {
      const insertIdx = position === 'beginning' ? 0 : (position === 'middle' ? Math.floor(arr.length / 2) : arr.length);
      pushStep(out, arr, -1, -1, `Create node(${target})`, 1, 'Create new node for insertion.');
      arr.splice(insertIdx, 0, target);
      pushStep(out, arr, insertIdx, -1, `Insert at ${position}`, 4, `Inserted node at ${position} position.`);
      pushStep(out, arr, -1, -1, 'Insert operation complete', 5, 'Linked-list insertion finished.');
      return out;
    }

    if (algo.endsWith('Delete')) {
      if (!arr.length) {
        pushStep(out, arr, -1, -1, 'Underflow / empty list', 1, 'Cannot delete from empty linked list.');
        return out;
      }
      const idx = pickIndex();
      pushStep(out, arr, idx, -1, `Select ${position} node`, 1, 'Choose deletion target by requested position.');
      const removed = arr.splice(idx, 1)[0];
      pushStep(out, arr, idx, -1, `Delete node value ${removed}`, 2, 'Reconnect links around removed node.');
      pushStep(out, arr, -1, -1, 'Delete operation complete', 5, 'Linked-list deletion finished.');
      return out;
    }

    if (algo.endsWith('Update')) {
      if (!arr.length) {
        pushStep(out, arr, -1, -1, 'Underflow / empty list', 1, 'Cannot update an empty linked list.');
        return out;
      }
      const idx = pickIndex();
      const old = arr[idx];
      pushStep(out, arr, idx, -1, `Select ${position} node`, 1, 'Choose update target by requested position.');
      arr[idx] = updateValue;
      pushStep(out, arr, idx, -1, `Update ${old} -> ${updateValue}`, 2, 'Write new value and keep links unchanged.');
      pushStep(out, arr, -1, -1, 'Update operation complete', 5, 'Linked-list update finished.');
      return out;
    }

    if (algo.endsWith('Search')) {
      for (let i = 0; i < arr.length; i++) {
        pushStep(out, arr, i, -1, `Visit node ${i}`, 1, `Compare node value ${arr[i]} with target ${target}.`);
        if (arr[i] === target) {
          pushStep(out, arr, i, -1, `Found target at node ${i}`, 3, 'Search successful at this node.');
          pushStep(out, arr, -1, -1, 'Search operation complete', 5, 'Linked-list search finished.');
          return out;
        }
        pushStep(out, arr, i, -1, 'Move to next node', 4, 'Advance traversal pointer to next node.');
      }
      pushStep(out, arr, -1, -1, 'Target not found', 5, 'Reached end (or head again for circular) without match.');
      return out;
    }
  }


  if (algo === 'treeBFS') {
    pushStep(out, arr, 0, -1, 'Build tree nodes from level-order input', 0, 'Input is interpreted as level-order binary tree values.');
    if (!arr.length) return out;
    const q = [0];
    pushStep(out, arr, 0, -1, 'Enqueue root node', 1, 'Queue starts with root index 0.');
    while (q.length) {
      const idx = q.shift();
      pushStep(out, arr, idx, -1, `Dequeue and visit node ${idx}`, 3, `Visit value ${arr[idx]} in BFS order.`);
      const l = (2 * idx) + 1;
      const r = (2 * idx) + 2;
      if (l < arr.length) {
        q.push(l);
        pushStep(out, arr, idx, l, `Enqueue left child ${l}`, 4, 'Add left child to queue for future visit.');
      }
      if (r < arr.length) {
        q.push(r);
        pushStep(out, arr, idx, r, `Enqueue right child ${r}`, 4, 'Add right child to queue for future visit.');
      }
    }
    pushStep(out, arr, -1, -1, 'BFS complete', 5, 'Queue is empty; all tree nodes visited.');
    return out;
  }

  if (algo === 'graphBFS') {
    const n = arr.length;
    const adj = Array.from({ length: n }, () => []);
    for (let i = 0; i < n; i++) {
      if (i + 1 < n) adj[i].push(i + 1);
      if (i + 2 < n) adj[i].push(i + 2);
    }
    pushStep(out, arr, -1, -1, 'Build sample adjacency list', 0, 'Connect each vertex to next one and next-two for visual BFS demo graph.');
    if (!n) return out;
    const visited = new Set([0]);
    const q = [0];
    pushStep(out, arr, 0, -1, 'Enqueue start vertex 0', 1, 'Start BFS from first vertex.');
    while (q.length) {
      const v = q.shift();
      pushStep(out, arr, v, -1, `Dequeue vertex ${v}`, 3, `Visit vertex value ${arr[v]}.`);
      for (const nei of adj[v]) {
        if (!visited.has(nei)) {
          visited.add(nei);
          q.push(nei);
          pushStep(out, arr, v, nei, `Enqueue unvisited neighbor ${nei}`, 4, 'Mark neighbor visited and queue it.');
        }
      }
    }
    pushStep(out, arr, -1, -1, 'Graph BFS complete', 5, 'Queue exhausted; reachable vertices explored.');
    return out;
  }

  if (algo === 'hashingLinearProbe') {
    const keys = [...arr];
    const size = Math.max(7, (keys.length * 2) + 1);
    const table = Array(size).fill(0);
    pushStep(out, table, -1, -1, `Initialize hash table size=${size}`, 0, 'Use open addressing table with linear probing.');

    for (const key of keys) {
      let idx = Math.abs(key) % size;
      pushStep(out, table, idx, -1, `Hash key ${key} -> ${idx}`, 1, 'Compute base slot from key modulo table size.');
      while (table[idx] !== 0) {
        pushStep(out, table, idx, -1, `Collision at slot ${idx}`, 2, 'Slot occupied; linearly probe next index.');
        idx = (idx + 1) % size;
      }
      table[idx] = key;
      pushStep(out, table, idx, -1, `Insert key ${key} at slot ${idx}`, 3, 'Found empty slot; insert key here.');
    }

    let idx = Math.abs(target) % size;
    pushStep(out, table, idx, -1, `Search target ${target} from slot ${idx}`, 3, 'Begin linear probing search from hashed slot.');
    for (let c = 0; c < size; c++) {
      if (table[idx] === target) {
        pushStep(out, table, idx, -1, `Found target at slot ${idx}`, 4, 'Target key found during probing.');
        pushStep(out, table, -1, -1, 'Hash operation complete', 5, 'Insertion + lookup demo completed.');
        return out;
      }
      if (table[idx] === 0) break;
      idx = (idx + 1) % size;
      pushStep(out, table, idx, -1, `Probe next slot ${idx}`, 4, 'Continue probing until key found or empty slot encountered.');
    }
    pushStep(out, table, -1, -1, 'Target not found in table', 5, 'Reached empty slot or full probe cycle without match.');
    return out;
  }

  if (algo.startsWith('stackArray')) {
    const st = [...arr];
    pushStep(out, st, st.length - 1, -1, 'Initialize stack from input', 0, 'Treat rightmost index as stack top.');
    if (algo === 'stackArrayPush') {
      st.push(target);
      pushStep(out, st, st.length - 1, -1, `Push ${target}`, 3, 'Increment top and place value at top slot.');
      pushStep(out, st, -1, -1, 'Push complete', 5, 'Stack push operation finished.');
      return out;
    }
    if (algo === 'stackArrayUpdateTop') {
      if (!st.length) {
        pushStep(out, st, -1, -1, 'Underflow', 1, 'Cannot update top of empty stack.');
        return out;
      }
      const old = st[st.length - 1];
      st[st.length - 1] = target;
      pushStep(out, st, st.length - 1, -1, `Update top ${old} -> ${target}`, 2, 'Replace top value while keeping stack size unchanged.');
      pushStep(out, st, -1, -1, 'Update complete', 5, 'Stack top update completed.');
      return out;
    }
    if (!st.length) {
      pushStep(out, st, -1, -1, 'Underflow', 1, 'Cannot pop/peek from an empty stack.');
      return out;
    }
    if (algo === 'stackArrayPop') {
      const val = st.pop();
      pushStep(out, st, st.length - 1, -1, `Pop value ${val}`, 2, 'Remove previous top and decrement top index.');
      pushStep(out, st, -1, -1, 'Pop complete', 5, 'Stack pop operation finished.');
      return out;
    }
    pushStep(out, st, st.length - 1, -1, `Peek value ${st[st.length - 1]}`, 2, 'Read top element without modifying stack.');
    pushStep(out, st, -1, -1, 'Peek complete', 5, 'Stack peek operation finished.');
    return out;
  }

  if (algo.startsWith('stackLinked')) {
    const st = [...arr];
    pushStep(out, st, 0, -1, 'Initialize linked stack', 0, 'Treat head as top pointer.');
    if (algo === 'stackLinkedPush') {
      st.unshift(target);
      pushStep(out, st, 0, -1, `Push ${target}`, 2, 'Create node and move top to new head.');
      pushStep(out, st, -1, -1, 'Push complete', 5, 'Linked-stack push completed.');
      return out;
    }
    if (algo === 'stackArrayUpdateTop') {
      if (!st.length) {
        pushStep(out, st, -1, -1, 'Underflow', 1, 'Cannot update top of empty stack.');
        return out;
      }
      const old = st[st.length - 1];
      st[st.length - 1] = target;
      pushStep(out, st, st.length - 1, -1, `Update top ${old} -> ${target}`, 2, 'Replace top value while keeping stack size unchanged.');
      pushStep(out, st, -1, -1, 'Update complete', 5, 'Stack top update completed.');
      return out;
    }
    if (algo === 'stackLinkedUpdateTop') {
      if (!st.length) {
        pushStep(out, st, -1, -1, 'Underflow', 1, 'Cannot update top of empty linked stack.');
        return out;
      }
      const old = st[0];
      st[0] = target;
      pushStep(out, st, 0, -1, `Update top ${old} -> ${target}`, 2, 'Rewrite top node value and keep next links same.');
      pushStep(out, st, -1, -1, 'Update complete', 5, 'Linked-stack top update completed.');
      return out;
    }
    if (!st.length) {
      pushStep(out, st, -1, -1, 'Underflow', 1, 'Cannot pop from an empty linked stack.');
      return out;
    }
    const val = st.shift();
    pushStep(out, st, 0, -1, `Pop value ${val}`, 3, 'Advance top to top.next and remove old head node.');
    pushStep(out, st, -1, -1, 'Pop complete', 5, 'Linked-stack pop completed.');
    return out;
  }

  if (algo.startsWith('queueLinear')) {
    const q = [...arr];
    pushStep(out, q, 0, q.length - 1, 'Initialize linear queue', 0, 'Front at index 0 and rear at last index.');
    if (algo === 'queueLinearEnqueue') {
      q.push(target);
      pushStep(out, q, q.length - 1, -1, `Enqueue ${target}`, 3, 'Append value at queue rear.');
      pushStep(out, q, -1, -1, 'Enqueue complete', 5, 'Linear queue enqueue completed.');
      return out;
    }
    if (algo === 'queueLinearUpdateFront') {
      if (!q.length) {
        pushStep(out, q, -1, -1, 'Underflow', 1, 'Cannot update front of empty queue.');
        return out;
      }
      const old = q[0];
      q[0] = target;
      pushStep(out, q, 0, -1, `Update front ${old} -> ${target}`, 2, 'Rewrite front element without changing queue length.');
      pushStep(out, q, -1, -1, 'Update complete', 5, 'Linear queue front update completed.');
      return out;
    }
    if (!q.length) {
      pushStep(out, q, -1, -1, 'Underflow', 1, 'Cannot dequeue from empty queue.');
      return out;
    }
    const val = q.shift();
    pushStep(out, q, 0, -1, `Dequeue value ${val}`, 2, 'Remove value from queue front.');
    pushStep(out, q, -1, -1, 'Dequeue complete', 5, 'Linear queue dequeue completed.');
    return out;
  }

  if (algo.startsWith('queueCircular')) {
    const size = Math.max(7, arr.length + 3);
    const buf = Array(size).fill(0);
    let front = 0;
    let rear = -1;
    for (const v of arr.slice(0, size - 1)) {
      rear = (rear + 1) % size;
      buf[rear] = v;
    }
    pushStep(out, buf, front, rear, `Initialize circular queue size=${size}`, 0, 'Load initial queue snapshot in circular buffer.');
    if (algo === 'queueCircularEnqueue') {
      const next = (rear + 1) % size;
      if (next === front) {
        pushStep(out, buf, front, rear, 'Overflow', 1, 'Next rear equals front so queue is full.');
        return out;
      }
      rear = next;
      buf[rear] = target;
      pushStep(out, buf, front, rear, `Enqueue ${target}`, 3, 'Write value at wrapped rear index.');
      pushStep(out, buf, front, rear, 'Enqueue complete', 5, 'Circular queue enqueue completed.');
      return out;
    }
    if (algo === 'queueCircularUpdateFront') {
      if (rear === -1 || (buf[front] === 0 && front === ((rear + 1) % size))) {
        pushStep(out, buf, front, rear, 'Underflow', 1, 'Cannot update front in empty circular queue.');
        return out;
      }
      const old = buf[front];
      buf[front] = target;
      pushStep(out, buf, front, rear, `Update front ${old} -> ${target}`, 2, 'Rewrite current front slot and keep circular indices unchanged.');
      pushStep(out, buf, front, rear, 'Update complete', 5, 'Circular queue front update completed.');
      return out;
    }
    if (rear === -1 || (buf[front] === 0 && front === ((rear + 1) % size))) {
      pushStep(out, buf, front, rear, 'Underflow', 1, 'Queue is empty.');
      return out;
    }
    const val = buf[front];
    buf[front] = 0;
    front = (front + 1) % size;
    pushStep(out, buf, front, rear, `Dequeue value ${val}`, 2, 'Advance front index circularly after removal.');
    pushStep(out, buf, front, rear, 'Dequeue complete', 5, 'Circular queue dequeue completed.');
    return out;
  }

  if (algo.startsWith('deque')) {
    const dq = [...arr];
    pushStep(out, dq, 0, dq.length - 1, 'Initialize deque', 0, 'Double-ended queue supports both front and rear operations.');
    if (algo === 'dequePushFront' || (algo.startsWith('deque') && position === 'beginning' && algo.includes('Push'))) {
      dq.unshift(target);
      pushStep(out, dq, 0, -1, `Push front ${target}`, 2, 'Insert value at front side.');
      pushStep(out, dq, -1, -1, 'Operation complete', 5, 'Deque push-front completed.');
      return out;
    }
    if (algo === 'dequePushBack' || (algo.startsWith('deque') && position === 'end' && algo.includes('Push'))) {
      dq.push(target);
      pushStep(out, dq, dq.length - 1, -1, `Push back ${target}`, 2, 'Insert value at rear side.');
      pushStep(out, dq, -1, -1, 'Operation complete', 5, 'Deque push-back completed.');
      return out;
    }
    if (algo === 'dequeUpdateFront') {
      if (!dq.length) {
        pushStep(out, dq, -1, -1, 'Underflow', 1, 'Deque is empty.');
        return out;
      }
      const old = dq[0];
      dq[0] = target;
      pushStep(out, dq, 0, -1, `Update front ${old} -> ${target}`, 2, 'Rewrite front value in-place.');
      pushStep(out, dq, -1, -1, 'Operation complete', 5, 'Deque update-front completed.');
      return out;
    }
    if (algo === 'dequeUpdateBack') {
      if (!dq.length) {
        pushStep(out, dq, -1, -1, 'Underflow', 1, 'Deque is empty.');
        return out;
      }
      const old = dq[dq.length - 1];
      dq[dq.length - 1] = target;
      pushStep(out, dq, dq.length - 1, -1, `Update back ${old} -> ${target}`, 2, 'Rewrite rear value in-place.');
      pushStep(out, dq, -1, -1, 'Operation complete', 5, 'Deque update-back completed.');
      return out;
    }
    if (!dq.length) {
      pushStep(out, dq, -1, -1, 'Underflow', 1, 'Deque is empty.');
      return out;
    }
    if (algo === 'dequePopFront') {
      const val = dq.shift();
      pushStep(out, dq, 0, -1, `Pop front ${val}`, 2, 'Remove and return front value.');
    } else {
      const val = dq.pop();
      pushStep(out, dq, dq.length - 1, -1, `Pop back ${val}`, 2, 'Remove and return rear value.');
    }
    pushStep(out, dq, -1, -1, 'Operation complete', 5, 'Deque pop operation completed.');
    return out;
  }

  return out;
}

function generateSteps(algo, input, target, position = "end", updateValue = null) {
  const kind = algoMeta[algo].type;
  if (kind === 'sort') return generateSortSteps(algo, input);
  if (kind === 'search') return generateSearchSteps(algo, input, target);
  return generateDsSteps(algo, input, target, position, updateValue);
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

function drawLinearBars(arr, a, b) {
  const baseY = canvas.height * 0.74;
  const max = Math.max(1, ...arr.map((n) => Math.abs(n)));
  const width = Math.max(24, Math.min(48, (canvas.width - 90) / Math.max(arr.length, 1) - 8));
  const gap = 8;
  const total = arr.length * width + Math.max(arr.length - 1, 0) * gap;
  let x = (canvas.width - total) / 2;
  arr.forEach((v, i) => {
    const h = 24 + (Math.abs(v) / max) * (canvas.height * 0.55);
    const y = baseY - h;
    drawBar3D(x, y, width, h, (i === a || i === b) ? '#5eead4' : '#4f8cff', v, i);
    x += width + gap;
  });
}

function drawLinkedListDiagram(arr, a, doubly = false, circular = false) {
  const boxW = 70;
  const boxH = 48;
  const gap = 26;
  const total = arr.length * boxW + Math.max(0, arr.length - 1) * gap;
  let x = Math.max(20, (canvas.width - total) / 2);
  const y = canvas.height * 0.42;
  arr.forEach((v, i) => {
    drawBar3D(x, y, boxW, boxH, i === a ? '#5eead4' : '#4f8cff', v, i);
    if (i < arr.length - 1) {
      ctx.strokeStyle = '#9ec2ff';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x + boxW + 4, y + boxH / 2); ctx.lineTo(x + boxW + gap - 6, y + boxH / 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + boxW + gap - 6, y + boxH / 2); ctx.lineTo(x + boxW + gap - 14, y + boxH / 2 - 5); ctx.lineTo(x + boxW + gap - 14, y + boxH / 2 + 5); ctx.closePath(); ctx.fillStyle = '#9ec2ff'; ctx.fill();
      if (doubly) {
        ctx.beginPath(); ctx.moveTo(x + boxW + gap - 6, y + boxH / 2 + 10); ctx.lineTo(x + boxW + 4, y + boxH / 2 + 10); ctx.stroke();
      }
    }
    x += boxW + gap;
  });
  if (circular && arr.length > 1) {
    ctx.strokeStyle = '#86f3de';
    ctx.beginPath();
    ctx.moveTo((canvas.width + total) / 2 - boxW - gap + 40, y + boxH + 8);
    ctx.quadraticCurveTo(canvas.width / 2, y + boxH + 50, (canvas.width - total) / 2 + 22, y + boxH + 8);
    ctx.stroke();
  }
}

function drawStackArrayPile(arr, a) {
  const boxW = 120;
  const boxH = 34;
  const x = (canvas.width - boxW) / 2;
  let y = canvas.height * 0.78;
  for (let i = 0; i < arr.length; i++) {
    drawBar3D(x, y - boxH, boxW, boxH, i === a ? '#5eead4' : '#4f8cff', arr[i], i);
    y -= boxH + 8;
  }
  ctx.fillStyle = '#9ec2ff';
  ctx.font = '12px sans-serif';
  ctx.fillText('TOP', x + boxW + 14, y + boxH + 6);
}

function drawStackLinkedNodes(arr, a) {
  const boxW = 130;
  const boxH = 40;
  const x = (canvas.width - boxW) / 2;
  let y = canvas.height * 0.76;

  for (let i = 0; i < arr.length; i++) {
    drawBar3D(x, y - boxH, boxW, boxH, i === a ? '#5eead4' : '#4f8cff', arr[i], i);
    ctx.fillStyle = '#cde3ff';
    ctx.font = '11px monospace';
    ctx.fillText('next', x + boxW + 10, y - boxH / 2 + 4);

    if (i < arr.length - 1) {
      ctx.strokeStyle = '#9ec2ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + boxW - 6, y + 2);
      ctx.lineTo(x + boxW - 6, y + 14);
      ctx.lineTo(x + boxW + 16, y + 14);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + boxW + 16, y + 14);
      ctx.lineTo(x + boxW + 10, y + 10);
      ctx.lineTo(x + boxW + 10, y + 18);
      ctx.closePath();
      ctx.fillStyle = '#9ec2ff';
      ctx.fill();
    }

    y -= boxH + 14;
  }

  ctx.fillStyle = '#9ec2ff';
  ctx.font = '12px sans-serif';
  ctx.fillText('TOP (node)', x + boxW + 14, y + boxH + 10);
}

function drawQueueDiagram(arr, a, circular = false) {
  const boxW = 62;
  const boxH = 44;
  const gap = 10;
  const total = arr.length * boxW + Math.max(0, arr.length - 1) * gap;
  let x = Math.max(18, (canvas.width - total) / 2);
  const y = canvas.height * 0.5;
  arr.forEach((v, i) => {
    drawBar3D(x, y, boxW, boxH, i === a ? '#5eead4' : '#4f8cff', v, i);
    x += boxW + gap;
  });
  if (circular && arr.length > 1) {
    ctx.strokeStyle = '#86f3de';
    ctx.beginPath();
    ctx.moveTo((canvas.width + total) / 2 - 8, y + boxH + 15);
    ctx.quadraticCurveTo(canvas.width / 2, y + boxH + 55, (canvas.width - total) / 2 + 8, y + boxH + 15);
    ctx.stroke();
  }
}

function draw3DMemory(arr, a = -1, b = -1) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const algo = state.algo;

  if (algo.includes('linkedList')) {
    drawLinkedListDiagram(arr, a, algo.includes('Doubly'), algo.includes('Circular'));
  } else if (algo.startsWith('stackArray')) {
    drawStackArrayPile(arr, a >= 0 ? a : arr.length - 1);
  } else if (algo.startsWith('stackLinked')) {
    drawStackLinkedNodes(arr, a >= 0 ? a : 0);
  } else if (algo.startsWith('queue') || algo.startsWith('deque')) {
    drawQueueDiagram(arr, a >= 0 ? a : 0, algo.includes('Circular'));
  } else {
    drawLinearBars(arr, a, b);
  }

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

function drawCodeFlow(step) {
  const lines = docs[state.algo].lines;
  const active = step?.line ?? -1;

  fctx.clearRect(0, 0, flowCanvas.width, flowCanvas.height);
  fctx.fillStyle = '#0c1430';
  fctx.fillRect(0, 0, flowCanvas.width, flowCanvas.height);

  const padX = 14;
  const padY = 18;
  const gutterW = 42;
  const rowGap = 6;

  fctx.fillStyle = '#7e94d1';
  fctx.font = '12px monospace';
  fctx.textAlign = 'left';
  fctx.fillText('// Full code view with execution highlight', padX, 12);

  let y = padY;
  lines.forEach((codeLine, i) => {
    fctx.font = '11px monospace';
    const wrapped = wrapLines(fctx, codeLine, flowCanvas.width - (padX * 2) - gutterW - 12);
    const blockH = Math.max(30, 16 + (wrapped.length * 12));

    const isActive = i === active;
    const isVisited = i < active;

    fctx.fillStyle = isActive ? '#5eead4' : isVisited ? '#213d74' : '#162449';
    fctx.fillRect(padX, y, flowCanvas.width - (padX * 2), blockH);

    fctx.strokeStyle = isActive ? '#5eead4' : '#2f4d89';
    fctx.lineWidth = isActive ? 2 : 1;
    fctx.strokeRect(padX, y, flowCanvas.width - (padX * 2), blockH);

    fctx.fillStyle = isActive ? '#03201b' : '#aac4ff';
    fctx.font = '11px monospace';
    fctx.fillText(String(i + 1).padStart(2, '0'), padX + 9, y + 18);

    fctx.fillStyle = isActive ? '#03201b' : '#ecf2ff';
    wrapped.forEach((lineText, idx) => {
      fctx.fillText(lineText, padX + gutterW, y + 16 + (idx * 12));
    });

    if (isActive) {
      fctx.fillStyle = '#5eead4';
      fctx.beginPath();
      fctx.moveTo(padX - 10, y + 10);
      fctx.lineTo(padX - 2, y + 16);
      fctx.lineTo(padX - 10, y + 22);
      fctx.closePath();
      fctx.fill();
      fctx.fillText('executing', flowCanvas.width - 92, y + 18);
    }

    if (i < lines.length - 1) {
      const cx = padX + 10;
      const y1 = y + blockH;
      const y2 = y + blockH + rowGap;
      fctx.strokeStyle = i < active ? '#5eead4' : '#4f6aa8';
      fctx.lineWidth = 1.2;
      fctx.beginPath();
      fctx.moveTo(cx, y1);
      fctx.lineTo(cx, y2);
      fctx.stroke();
    }

    y += blockH + rowGap;
  });
}

async function animateToStep(fromStep, toStep) {
  const start = fromStep?.arr ?? state.values;
  const end = toStep.arr;
  const frames = Math.max(18, Math.round(44 / state.speed));
  const frameDelayMs = Math.max(12, Math.round(34 / state.speed));

  for (let f = 1; f <= frames; f++) {
    const t = easeInOutCubic(f / frames);
    const interp = end.map((v, i) => {
      const sv = start[i] ?? v;
      return sv + ((v - sv) * t);
    });
    draw3DMemory(interp, toStep.a, toStep.b);
    drawCodeFlow({ line: toStep.line });
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
  drawCodeFlow(current);
  updateButtons();
}

function getOrientationLabel(algo) {
  if (algo.includes('linkedList')) return 'Horizontal node-link orientation';
  if (algo.startsWith('stackArray')) return 'Vertical stack-pile orientation';
  if (algo.startsWith('stackLinked')) return 'Vertical linked-node stack orientation';
  if (algo.startsWith('queue') || algo.startsWith('deque')) return 'Horizontal queue/deque orientation';
  if (algo === 'treeBFS') return 'Tree level orientation';
  if (algo === 'graphBFS') return 'Graph traversal orientation';
  if (algo === 'hashingLinearProbe') return 'Hash-table slot orientation';
  return 'Array/bar memory orientation';
}

class ArrayVisualizer {
  constructor(getArray, setArray) {
    this.getArray = getArray;
    this.setArray = setArray;
    this.initial = [3, 8, 2, 5];
  }

  async animateUpdate(nextArr, hi = -1) {
    const curr = [...this.getArray()];
    const frames = Math.max(14, Math.round(30 / state.speed));
    for (let f = 1; f <= frames; f++) {
      const t = easeInOutCubic(f / frames);
      const interp = nextArr.map((v, i) => {
        const sv = curr[i] ?? v;
        return sv + ((v - sv) * t);
      });
      draw3DMemory(interp, hi, -1);
      await sleep(Math.max(8, Math.round(20 / state.speed)));
    }
    this.setArray([...nextArr]);
  }

  async insert({ value, index }, log) {
    const arr = [...this.getArray()];
    const i = Math.max(0, Math.min(index, arr.length));
    log(`Insert ${value} at index ${i}.`);
    arr.splice(i, 0, value);
    await this.animateUpdate(arr, i);
  }

  async delete({ index }, log) {
    const arr = [...this.getArray()];
    if (!arr.length) { log('Delete failed: array is empty.'); return; }
    const i = Math.max(0, Math.min(index, arr.length - 1));
    log(`Delete at index ${i} (value ${arr[i]}).`);
    arr.splice(i, 1);
    await this.animateUpdate(arr, i);
  }

  async search({ value }, log) {
    const arr = [...this.getArray()];
    log(`Searching for value ${value}.`);
    for (let i = 0; i < arr.length; i++) {
      draw3DMemory(arr, i, -1);
      log(`Checking index ${i}: ${arr[i]}`);
      await sleep(Math.max(80, Math.round(300 / state.speed)));
      if (arr[i] === value) { log(`Found ${value} at index ${i}.`); return; }
    }
    log(`Value ${value} not found.`);
  }

  async access({ index }, log) {
    const arr = [...this.getArray()];
    if (index < 0 || index >= arr.length) { log('Access failed: invalid index.'); return; }
    draw3DMemory(arr, index, -1);
    log(`Access index ${index}: ${arr[index]}`);
    await sleep(Math.max(120, Math.round(350 / state.speed)));
  }

  async traverse(_params, log) {
    const arr = [...this.getArray()];
    for (let i = 0; i < arr.length; i++) {
      draw3DMemory(arr, i, -1);
      log(`Traverse index ${i}: ${arr[i]}`);
      await sleep(Math.max(70, Math.round(220 / state.speed)));
    }
    log('Traversal complete.');
  }

  async randomize(_params, log) {
    const size = Math.floor(Math.random() * 6) + 5;
    const next = Array.from({ length: size }, () => Math.floor(Math.random() * 100));
    log(`Randomized array: [${next.join(', ')}]`);
    await this.animateUpdate(next, -1);
  }

  async reset(_params, log) {
    log('Array reset to initial state.');
    await this.animateUpdate([...this.initial], -1);
  }
}

const arrayVisualizer = new ArrayVisualizer(() => state.values, (arr) => {
  state.values = arr;
  state.steps = [];
  state.stepIndex = -1;
  renderPanels();
});


class LinkedListVisualizer {
  constructor(getList, setList) {
    this.getList = getList;
    this.setList = setList;
    this.initial = [38, 12, 5, 77];
  }

  async animate(next, hi = -1) {
    const curr = [...this.getList()];
    const frames = Math.max(14, Math.round(30 / state.speed));
    for (let f = 1; f <= frames; f++) {
      const t = easeInOutCubic(f / frames);
      const interp = next.map((v, i) => {
        const sv = curr[i] ?? v;
        return sv + ((v - sv) * t);
      });
      draw3DMemory(interp, hi, -1);
      await sleep(Math.max(8, Math.round(20 / state.speed)));
    }
    this.setList([...next]);
  }

  async insertHead({ value }, log) {
    const arr = [...this.getList()];
    log(`Insert head ${value}`);
    arr.unshift(value);
    await this.animate(arr, 0);
  }

  async insertTail({ value }, log) {
    const arr = [...this.getList()];
    log(`Insert tail ${value}`);
    arr.push(value);
    await this.animate(arr, arr.length - 1);
  }

  async deleteValue({ value }, log) {
    const arr = [...this.getList()];
    if (!arr.length) { log('Delete failed: linked list is empty.'); return; }
    const idx = arr.indexOf(value);
    if (idx < 0) { log(`Delete failed: ${value} not found.`); return; }
    log(`Delete node value ${value}`);
    arr.splice(idx, 1);
    await this.animate(arr, Math.max(0, idx - 1));
  }

  async search({ value }, log) {
    const arr = [...this.getList()];
    log(`Searching linked list for ${value}`);
    for (let i = 0; i < arr.length; i++) {
      draw3DMemory(arr, i, -1);
      log(`Checking node ${i}: ${arr[i]}`);
      await sleep(Math.max(70, Math.round(250 / state.speed)));
      if (arr[i] === value) { log(`Found ${value} at node ${i}`); return; }
    }
    log(`Value ${value} not found.`);
  }

  async reverse(_params, log) {
    const arr = [...this.getList()];
    if (!arr.length) { log('Reverse skipped: linked list is empty.'); return; }
    log('Reversing linked list links...');
    const rev = [...arr].reverse();
    await this.animate(rev, 0);
  }

  async reset(_params, log) {
    log('Reset linked list to initial nodes.');
    await this.animate([...this.initial], -1);
  }
}

const linkedListVisualizer = new LinkedListVisualizer(() => state.values, (arr) => {
  state.values = arr;
  state.steps = [];
  state.stepIndex = -1;
  renderPanels();
});

function configureOperationMenu() {
  const linked = state.algo.includes('linkedList');
  const ops = linked
    ? [
        ['insertHead', 'Insert Head'],
        ['insertTail', 'Insert Tail'],
        ['deleteValue', 'Delete Value'],
        ['search', 'Search Value'],
        ['reverse', 'Reverse'],
        ['reset', 'Reset'],
      ]
    : [
        ['insert', 'Insert'],
        ['delete', 'Delete'],
        ['search', 'Search'],
        ['access', 'Access'],
        ['traverse', 'Traverse'],
        ['randomize', 'Randomize'],
        ['reset', 'Reset'],
      ];
  opSelect.innerHTML = ops.map(([v, t]) => `<option value="${v}">${t}</option>`).join('');
}

function isPositionAlgo(algo) {
  return algo.includes('Insert') || algo.includes('Delete') || algo.includes('Update') || algo.startsWith('deque');
}

function needsTargetValue(algo) {
  if (algo.includes('Search')) return true;
  if (algo === 'hashingLinearProbe') return true;
  if (algo.includes('Push') || algo.includes('Enqueue') || algo.includes('Insert')) return true;
  return false;
}

function needsUpdateValue(algo) {
  return algo.includes('Update');
}

function algorithmAllowsEmptyInput(algo) {
  return algoMeta[algo].type === 'ds';
}

function refreshSetupFields() {
  const algo = state.algo;
  const meta = algoMeta[algo] || { type: 'sort' };
  const isDs = meta.type === 'ds';
  const isSearch = meta.type === 'search';
  const showTarget = needsTargetValue(algo);
  const showUpdate = needsUpdateValue(algo);
  const showPosition = isPositionAlgo(algo);

  const toggle = (el, show) => {
    if (!el) return;
    el.style.display = show ? '' : 'none';
  };

  targetInput.disabled = !showTarget;
  updateValueInput.disabled = !showUpdate;
  positionSelect.disabled = !showPosition;

  toggle(valuesLabel, true);
  toggle(countLabel, true);
  toggle(randomBtn, true);
  toggle(targetLabel, showTarget);
  toggle(updateLabel, showUpdate);
  toggle(positionLabel, showPosition);

  const showOps = isDs;
  toggle(opSelectLabel, showOps);
  toggle(opIndexLabel, showOps);
  toggle(opValueLabel, showOps);
  toggle(runOpBtn, showOps);

  if (!showTarget) targetInput.value = '';
  if (!showUpdate) updateValueInput.value = '';
  if (!showPosition) positionSelect.value = 'end';

  const modeHint = isDs
    ? 'DS mode: operation runner enabled.'
    : isSearch
      ? 'Search mode: configure target and step execution.'
      : 'Sort mode: generate values and step execution.';
  statusEl.textContent = modeHint;
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
  state.values = state.values.length ? [...state.values] : parseValues(valuesInput.value);
  state.target = targetInput.value === '' ? null : Number(targetInput.value);
  state.updateValue = updateValueInput.value === '' ? null : Number(updateValueInput.value);
  state.position = positionSelect.value;

  if (!state.values.length && !algorithmAllowsEmptyInput(state.algo)) {
    statusEl.textContent = 'Generate random numbers first (or provide valid values).';
    return;
  }
  if (needsTargetValue(state.algo) && (state.target === null || Number.isNaN(state.target))) {
    statusEl.textContent = 'Please enter a valid target/value for this algorithm.';
    return;
  }
  if (needsUpdateValue(state.algo) && (state.updateValue === null || Number.isNaN(state.updateValue))) {
    statusEl.textContent = 'Please enter a valid new value for update operation.';
    return;
  }

  state.steps = generateSteps(state.algo, state.values, state.target, state.position, state.updateValue);
  state.stepIndex = 0;
  statusEl.textContent = `Loaded ${state.algo} (${algoMeta[state.algo].type}) with ${state.values.length} values${needsTargetValue(state.algo) ? `, target/value=${state.target}` : ''}${needsUpdateValue(state.algo) ? `, newValue=${state.updateValue}` : ''}${isPositionAlgo(state.algo) ? `, position=${state.position}` : ''}. ${getOrientationLabel(state.algo)}. Use Prev/Next/Auto Play/Pause operations.`;
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
  }, Math.max(500, Math.round(1850 / state.speed)));
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
  updateValueInput.value = '';
  positionSelect.value = 'end';
  statusEl.textContent = 'Reset complete. Generate random numbers and load again.';
  renderPanels();
}

document.getElementById('loadBtn').addEventListener('click', loadSimulation);
randomBtn.addEventListener('click', randomizeSetupValues);
countInput.addEventListener('change', () => { countInput.value = String(clampCount(countInput.value)); });
nextBtn.addEventListener('click', () => { void nextStep(); });
prevBtn.addEventListener('click', () => { void prevStep(); });
playBtn.addEventListener('click', startAutoPlay);
pauseBtn.addEventListener('click', () => {
  stopAutoPlay();
  statusEl.textContent = 'Auto Play paused.';
});
document.getElementById('resetBtn').addEventListener('click', resetAll);
speedRange.addEventListener('input', () => {
  state.speed = Number(speedRange.value);
  speedLabel.textContent = `Speed: ${state.speed.toFixed(1)}x`;
});



runOpBtn.addEventListener('click', async () => {
  const op = opSelect.value;
  const index = opIndexInput.value === '' ? 0 : Number(opIndexInput.value);
  const value = opValueInput.value === '' ? 0 : Number(opValueInput.value);
  const log = (msg) => {
    dryEl.textContent = `${dryEl.textContent ? `${dryEl.textContent}
` : ''}${msg}`;
    statusEl.textContent = msg;
  };

  try {
    if (state.algo.includes('linkedList')) {
      if (op === 'insertHead') await linkedListVisualizer.insertHead({ value }, log);
      else if (op === 'insertTail') await linkedListVisualizer.insertTail({ value }, log);
      else if (op === 'deleteValue') await linkedListVisualizer.deleteValue({ value }, log);
      else if (op === 'search') await linkedListVisualizer.search({ value }, log);
      else if (op === 'reverse') await linkedListVisualizer.reverse({}, log);
      else if (op === 'reset') await linkedListVisualizer.reset({}, log);
      return;
    }

    if (op === 'insert') await arrayVisualizer.insert({ value, index }, log);
    else if (op === 'delete') await arrayVisualizer.delete({ index }, log);
    else if (op === 'search') await arrayVisualizer.search({ value }, log);
    else if (op === 'access') await arrayVisualizer.access({ index }, log);
    else if (op === 'traverse') await arrayVisualizer.traverse({}, log);
    else if (op === 'randomize') await arrayVisualizer.randomize({}, log);
    else if (op === 'reset') await arrayVisualizer.reset({}, log);
  } catch (e) {
    statusEl.textContent = `Operation error: ${e?.message || e}`;
  }
});

algoSelect.addEventListener('change', () => {
  state.algo = algoSelect.value;
  refreshSetupFields();
  configureOperationMenu();
  randomizeSetupValues();
  renderPanels();
});

window.addEventListener('resize', () => {
  resize();
  renderPanels();
});

speedLabel.textContent = `Speed: ${state.speed.toFixed(1)}x`;
refreshSetupFields();
configureOperationMenu();
randomizeSetupValues();
resize();
renderPanels();
