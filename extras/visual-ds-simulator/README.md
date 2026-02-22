# Sorting Visual Simulator

Re-started as a **feature-by-feature** learning project focused first on sorting.

## Current phase (basic sorting module)
- User selects sorting technique (Bubble / Selection / Insertion).
- User enters input values.
- User presses **Next Step** to walk execution one step at a time.
- Main 3D memory visual is shown with highlighted compared/swap indices.
- Step details are shown directly under the 3D memory visual panel in an explainable format (action + reason + active line).
- Next-step transitions are smooth and intentionally slow for learning clarity.
- Pseudocode + Flowchart are combined into a single **3D visual control-flow panel** (full code line shown inside each flow element).
- Flowchart uses proper shapes (terminator, loop/process, decision) for control-flow readability.
- Dry run panel shows cumulative step history side-by-side.

## Run

```bash
cd extras/visual-ds-simulator
python3 -m http.server 4173
```

Open: <http://localhost:4173>
