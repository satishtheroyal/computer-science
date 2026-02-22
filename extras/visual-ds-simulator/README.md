# Sorting + Searching Visual Simulator

Re-started as a **feature-by-feature** learning project focused on step-by-step algorithm simulation with visual clarity.

## Current phase (sorting + searching module)
- User selects an algorithm:
  - Sorting: Bubble / Selection / Insertion / Merge / Quick
  - Searching: Linear Search / Binary Search
- User enters input values (comma separated).
- For searching algorithms, user enters a target value.
- User presses **Next Step** to walk execution one step at a time.
- Main 3D memory visual highlights active indices for each operation.
- Step details are shown directly under the 3D memory panel in an explainable format:
  - action
  - why the step happens
  - algorithm insight
  - active code line
- Transitions are intentionally slower and smoother for classroom-style explanation.
- Pseudocode + flowchart are combined into a single **3D visual control-flow panel**.
- Flowchart node shapes are compact and proportioned for better readability.
- Dry run panel shows cumulative step history side-by-side.

## Notes on searching mode
- **Linear Search** scans left-to-right and highlights the currently checked index.
- **Binary Search** first sorts a copy of input, then visualizes low/high interval narrowing.

## Run

```bash
cd extras/visual-ds-simulator
python3 -m http.server 4173
```

Open: <http://localhost:4173>
