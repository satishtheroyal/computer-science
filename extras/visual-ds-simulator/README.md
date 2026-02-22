# Sorting Visual Simulator

Re-started as a **feature-by-feature** learning project focused first on sorting.

## Current phase (basic sorting module)
- User selects sorting technique (Bubble / Selection / Insertion).
- User enters input values.
- Side-by-side panels show:
  - pseudocode / algorithm,
  - flowchart,
  - dry run history,
  - current step details.
- Main canvas shows a 3D-style memory visualization of values.
- User presses **Next Step** to walk through execution step-by-step.
- Desktop layout uses a single-screen landscape orientation so visuals + panels are visible together (no scrolling).

## Run

```bash
cd extras/visual-ds-simulator
python3 -m http.server 4173
```

Open: <http://localhost:4173>
