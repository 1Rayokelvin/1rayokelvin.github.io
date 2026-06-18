# Academic Physics Portfolio

Welcome to your personal portfolio website. This project is built using **React 19**, **Vite**, and **KaTeX** for mathematical equation rendering. It features a clean, bright, professional "academic journal" aesthetic and an interactive physics simulation running in the background.

---

## 📂 Project Structure & Architecture

```text
├── index.html                  # Entry point (loads KaTeX CDN stylesheets and scripts)
├── package.json                # Project dependencies (lucide-react, react, vite)
├── vite.config.js              # Vite configuration
├── src/
│   ├── main.jsx                # React DOM mounting
│   ├── App.jsx                 # Core page layout, bio, CV timeline, and notebook notes
│   ├── index.css               # Styling system (Academic bright color scheme)
│   └── components/
│       ├── MathTex.jsx         # LaTeX renderer using window.katex
│       ├── InteractiveBackground.jsx # 2D Wave Equation finite-difference simulation
│       └── ResearchGallery.jsx # Research project listings, equations, and links
```

---

## ✏️ How to Customize Content

### 1. Modifying Your Bio & Header
Open `src/App.jsx`. The hero section is located around the `<section id="about">` tag. You can edit the text inside the `<p>` tag directly to update your personal narrative.

### 2. Adding or Editing Research Cards
Research items are managed inside `src/components/ResearchGallery.jsx`. Locate the `projects` array at the top of the component:

```javascript
const projects = [
  {
    title: "Project Title",
    subtitle: "Paper / Framework",
    period: "Date Range",
    tags: ["Keywords", "Topics"],
    icon: <IconComponent className="..." />, // Lucide icons
    description: "Brief summary of the work...",
    equations: [
      {
        label: "Equation Label",
        formula: "d_{\\text{eff}} = \\dots" // Note double backslashes for escaping
      }
    ],
    presentations: [
      "Milestone or Presentation bullet point..."
    ],
    links: [
      {
        label: "Link Label",
        url: "https://...",
        icon: <IconComponent />
      }
    ]
  }
]
```
> [!IMPORTANT]
> **LaTeX Escaping Rule**: Because the LaTeX equations are written inside JavaScript strings, you must escape backslashes. For example, use `\\mu_z` instead of `\mu_z`, and `\\alpha` instead of `\alpha`.

### 3. Updating the CV Timeline
Open `src/App.jsx` and locate `<section id="cv">`. The timeline is structured with CSS classes `.timeline`, `.timeline-item`, `.timeline-marker`, and `.timeline-header`. You can add new timeline blocks following this template:
```jsx
<div className="timeline-item">
  <div className="timeline-marker"></div>
  <div className="timeline-header">
    <div>
      <h3>Subject / Role</h3>
      <span className="institution">University or Organization</span>
    </div>
    <span className="timeline-date">Timeline Range</span>
  </div>
  <div className="timeline-content">
    <p>Detailed description...</p>
  </div>
</div>
```

### 4. Updating the Mathematical Notebook (Digital Garden)
At the bottom of `src/App.jsx`, locate the `<section id="notebook">` and the `.garden-grid`. You can add or edit cards containing interesting math notes:
```jsx
<div className="garden-card">
  <h3>Concept Title</h3>
  <p>Short conceptual explanation...</p>
  <div className="math-preview">
    <MathTex math="Formula Here (escaped)" block={true} />
  </div>
</div>
```

---

## 🌌 Customizing the Physics Background

The background canvas runs a real-time **2D finite-difference wave solver** in `src/components/InteractiveBackground.jsx`.

### Wave Equation Core Variables
Inside `src/components/InteractiveBackground.jsx`, you can fine-tune these parameters:
* `cols` & `rows` (default: `50`, `35`): Grid resolution. Keep them low (under 80) to maintain high-performance calculations on mobile browsers.
* `spacing` (default: `35`): Width of grid square elements.
* `damping` (default: `0.98`): Energy absorption. Lower values (e.g., `0.95`) make waves die down faster; higher values (e.g., `0.995`) allow ripples to reflect repeatedly.
* `scale` (default: `0.35`): Multiplies the height displacement of the mesh when rendered.
* `tilt` (default: `0.65`): Rotates the mesh around the horizontal X-axis (in radians) for a 3D perspective.

### Customizing the Physics Simulation (e.g., Spacetime Curvature Grid)
If you want to swap the wave solver for a gravity-curvature grid later, you can modify the `project()` function to deform coordinates based on the mouse cursor position instead of wave amplitudes:
```javascript
const project = (col, row, z, cx, cy) => {
  let x3d = (col - cols / 2) * spacing;
  let y3d_base = (row - rows / 2) * spacing;

  // Let (mouseX, mouseY) represent a massive body.
  // Calculate distance r from node to cursor and deform the grid towards it:
  // x3d += shift_x / r, y3d_base += shift_y / r
  
  // Apply standard 3D rotation and perspective projection as written in the code.
}
```

---

## 🛠️ Run & Build Commands

Initialize the local environment and launch the dev server:

```bash
# Install NPM dependencies
npm install

# Start Vite live reload development server
npm run dev

# Bundle portfolio into static assets (compiles to /dist folder)
npm run build

# Preview production build locally
npm run preview
```
