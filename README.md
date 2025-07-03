# ⚙️ Pipeline Editor – DAG Builder

An interactive React-based editor for visually creating and managing Directed Acyclic Graphs (DAGs), simulating real-time data pipelines or workflows.

### 🌐 Live Demo
[Click to View Deployed App](https://pipeline-editor-dag-builder-plum.vercel.app/)

---

## 🚀 Features

- ➕ Add nodes with custom labels
- 🔗 Draw directional edges with arrowheads
- 🔄 Enforce connection rules (no self-loops, no incoming→incoming)
- 🗑️ Delete nodes or edges using the `Delete` key or toolbar
- 🧠 Real-time DAG validation (cycle detection, connectivity)
- 🧭 Auto layout using `dagre` for clean visual flow
- 🧩 JSON structure preview for debugging
- 🎨 Dark theme, intuitive UX, responsive UI

---

## 🛠️ Technologies Used

- **React** – UI framework
- **React Flow** – Interactive graph library
- **Dagre.js** – Auto layout engine
- **JavaScript** – Core logic
- **Vercel** – Deployment

---

## 📦 Installation

```bash
git clone https://github.com/Sri7580/pipeline-editor-dag-builder.git
cd pipeline-editor-dag-builder
npm install
npm start 
