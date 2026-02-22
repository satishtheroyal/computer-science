# Sorting + Searching Visual Simulator

Re-started as a **feature-by-feature** algorithm visualizer with slower, explainable transitions.

## Current phase (extended algorithms)
- User selects an algorithm:
  - Sorting: Bubble / Selection / Insertion / Merge / Quick / Heap / Shell
  - Searching: Linear Search / Binary Search / Jump Search
  - Data structures / operations:
    - Linked List (singly/doubly/circular): insert, delete, search, update
    - Stacks: array-based + linked-list push/pop/peek/update-top
    - Queues: linear + circular enqueue/dequeue/update-front
    - Deque: push/pop front/back + update-front/update-back
    - Tree BFS Traversal
    - Graph BFS Traversal
    - Hashing with Linear Probing (insert + search)
- User generates input values with **Random Numbers** (and configurable **Count**) instead of manual list typing.
- For target-based algorithms, user enters a target/value when that technique requires it.
- Setup display is dynamic per selected technique: target/value, update value, position, and operation-runner controls are shown only when relevant.
- Empty structures are handled explicitly (underflow/empty-list steps are shown for invalid delete/pop/dequeue/update operations).
- User can run operations for every algorithm using:
  - **Load**
  - **Prev Step**
  - **Next Step**
  - **Auto Play**
  - **Pause**
  - **Reset**
- Step details are explainable and include:
  - action
  - why the step happens
  - technique insight
  - active code line
- Code view shows full algorithm lines and highlights control flow line-by-line.
- Transition speed control slider lets users slow down or speed up execution animations.
- Added an Array Operation runner (insert/delete/search/access/traverse/randomize/reset) inspired by the requested visualizer workflow.
- Added a Linked-list operation runner mode (insertHead/insertTail/delete/search/reverse/reset) with animated node-flow behavior.
- Orientation adapts by structure type (horizontal linked list/queue, vertical stack) with more prominent DS-specific memory diagrams.
- Stacks show different visual forms: array stack as vertical pile, linked stack as node + next-reference chain.
- Transitions are intentionally slow and smooth for teaching.

## Run

```bash
cd extras/visual-ds-simulator
python3 -m http.server 4173
```

Open: <http://localhost:4173>
