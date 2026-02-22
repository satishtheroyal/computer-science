# Sorting Visual Simulator

Re-started as a **feature-by-feature** learning project focused first on sorting.

## Current phase (basic sorting module)
- User selects sorting technique (Bubble / Selection / Insertion).
- User enters input values.
- User presses **Next Step** to walk execution one step at a time.
- Main 3D memory visual is shown with highlighted compared/swap indices.
- Step details are shown directly under the 3D memory visual panel.
- Pseudocode + Flowchart are combined into a single **3D visual control-flow panel** (code shown inside flow elements).
- Dry run panel shows cumulative step history side-by-side.

## Run

```bash
cd extras/visual-ds-simulator
python3 -m http.server 4173
```

Open: <http://localhost:4173>
