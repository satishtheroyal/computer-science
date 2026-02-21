# 3D Visual Data Structures Simulator

A standalone browser-based simulator that combines:
- Visual 3D-style models for common data structures (rendered using native HTML `<canvas>`).
- Example algorithm pseudocode.
- Flowchart-like operation steps.
- Memory representation panel.
- Time and space complexity table.
- Code + flowchart control-flow tracer (step and autoplay).
- 3D execution-path canvas for both code path and flowchart path.
- Starts empty by default and shows live step-by-step visualization while operations run.

## Run locally

```bash
cd extras/visual-ds-simulator
python3 -m http.server 4173
```

Open: <http://localhost:4173>

## How to use this in Canvas (or environments where CDN scripts fail)

This version does **not** depend on external JavaScript libraries (like Three.js CDN), so it works in strict environments that block third-party scripts.

1. Upload `index.html`, `styles.css`, and `app.js` into the same folder/module in your Canvas-hosted files.
2. Ensure all three files keep their exact names and relative paths.
3. Open `index.html` from Canvas file preview (or embed it in an iframe).
4. Use controls:
   - select structure,
   - enter value for insert/search (and delete for array/list/bst),
   - for stack/queue delete, input is optional (pop/dequeue behavior).

If your LMS blocks direct file preview scripting, host these files via a static server (GitHub Pages, Netlify, or your own server) and embed that URL in Canvas.
