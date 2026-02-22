# Sorting + Searching Visual Simulator

Re-started as a **feature-by-feature** algorithm visualizer with slower, explainable transitions.

## Current phase (extended algorithms)
- User selects an algorithm:
  - Sorting: Bubble / Selection / Insertion / Merge / Quick / Heap / Shell
  - Searching: Linear Search / Binary Search / Jump Search
  - Data structures / traversal / hashing:
    - Linked List Traversal
    - Tree BFS Traversal
    - Graph BFS Traversal
    - Hashing with Linear Probing (insert + search)
- User enters input values (comma separated).
- For target-based algorithms, user enters a target value.
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
- Code view shows algorithm lines and highlights control flow line-by-line.
- Transitions are intentionally slow and smooth for teaching.

## Run

```bash
cd extras/visual-ds-simulator
python3 -m http.server 4173
```

Open: <http://localhost:4173>
