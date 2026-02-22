# Sorting + Searching Visual Simulator

Re-started as a **feature-by-feature** learning project focused on step-by-step algorithm simulation.

## Current phase (sorting + searching module)
- User selects an algorithm:
  - Sorting: Bubble / Selection / Insertion
  - Searching: Linear Search / Binary Search
- User enters input values (comma separated).
- For searching algorithms, user enters a target value.
- User presses **Next Step** to walk execution one step at a time.
- Main 3D memory visual is shown with highlighted compared/swap indices.
- Step details are shown directly under the 3D memory visual panel in an explainable format (action + reason + active line).
- Next-step transitions are smooth and intentionally slow for learning clarity.
- Pseudocode + Flowchart are combined into a single **3D visual control-flow panel** (full code line shown inside each flow element).
- Flowchart uses proper shapes (terminator, loop/process, decision) for control-flow readability.
- Dry run panel shows cumulative step history side-by-side.

## Notes on searching mode
- **Linear Search** scans left-to-right and highlights the currently checked index.
- **Binary Search** automatically sorts a copy of the input first (shown as the first step), then visualizes low/high interval narrowing and mid checks.

## Run

```bash
cd extras/visual-ds-simulator
python3 -m http.server 4173
```

Open: <http://localhost:4173>
