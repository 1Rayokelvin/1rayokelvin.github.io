import { useState } from 'react'
import SpeckleSimulation from './SpeckleSimulation'
import { projects } from './data/projects'
import ProjectModal from './components/ProjectModal'

function App() {
  const [interactiveMode, setInteractiveMode] = useState(false);
  const [bgEnabled, setBgEnabled] = useState(true);
  const [activeProject, setActiveProject] = useState(null);

  return (
    <>
      {bgEnabled && <SpeckleSimulation interactiveMode={interactiveMode} onExit={() => setInteractiveMode(false)} />}
      
      <div 
        className="container" 
        style={{ 
          opacity: interactiveMode ? 0 : 1, 
          pointerEvents: interactiveMode ? 'none' : 'auto',
          transition: 'opacity 0.5s ease-in-out'
        }}
      >
        <nav>
          <div className="logo">M. Soni</div>
          <div className="nav-links">
            <a href="#about">About me</a>
            <a href="#portfolio">My works</a>
          </div>
        </nav>

        <section id="about" className="hero">
          <h1>Physics, Mathematics, and Computation.</h1>
          <p className="subtitle">
            I am an Integrated M.Sc. Physics student at the University of Hyderabad, interested in theoretical and computational physics. 
            My work has focused on singular optics, where I have developed computational tools for studying optical singularities{' '}
            <span
              onClick={() => {
                setBgEnabled(true);
                setInteractiveMode(true);
              }}
              style={{
                cursor: 'pointer',
                textDecoration: 'none',
                borderBottom: '2px solid var(--accent-color)',
                color: 'var(--accent-color)',
                fontWeight: '600',
                paddingBottom: '2px'
              }}
            >
              (click to interact)
            </span>
            . More broadly, I'm interested in how topology shows up in physics (e.g. Dirac monopoles, Berry phases).
          </p>
        </section>

        <section id="portfolio" className="section">
          <h2>Selected Work</h2>
          <div className="card-grid">
            {projects.map((proj) => (
              <div 
                className="card" 
                key={proj.id}
                onClick={() => setActiveProject(proj)}
              >
                {proj.tags.map(tag => <span className="tag" key={tag}>{tag}</span>)}
                <h3>{proj.title}</h3>
                <p>{proj.summary}</p>
                <div style={{ color: 'var(--text-main)', fontWeight: 'bold', fontSize: '0.9rem', marginTop: 'auto' }}>
                  Read More &rarr;
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <footer style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p>&copy; {new Date().getFullYear()} M. Soni. All rights reserved.</p>
        </footer>
      </div>

      <ProjectModal activeProject={activeProject} onClose={() => setActiveProject(null)} />

      {/* Persistent Background Toggle */}
      {!interactiveMode && (
        <button
          onClick={() => setBgEnabled(!bgEnabled)}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 900,
            padding: '0.75rem 1.5rem',
            borderRadius: '30px',
            background: bgEnabled ? 'rgba(255, 255, 255, 0.8)' : 'var(--text-main)',
            color: bgEnabled ? 'var(--text-main)' : 'white',
            border: '1px solid var(--glass-border)',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(5px)',
            transition: 'all 0.3s ease'
          }}
        >
          {bgEnabled ? 'Disable Background' : 'Enable Background'}
        </button>
      )}
    </>
  )
}

export default App
