import { useEffect, useRef, useState } from 'react';

const NUM_PARTICLES = 3000;
const TRAIL_LEN = 15;
const DT = 0.02;
const C_POINT_EMOJIS = { 'Star': '⭐', 'Lemon': '🍋', 'Monstar': '💠' };

export default function SpeckleSimulation({ interactiveMode, onExit }) {
  const canvasRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const engineRef = useRef(null);

  // Camera settings
  const camRef = useRef({ x: 0, y: 0, scale: 1 });
  const dragRef = useRef({ dragging: false, startX: 0, startY: 0, camX: 0, camY: 0 });

  useEffect(() => {
    const worker = new Worker(new URL('./speckleWorker.js', import.meta.url), { type: 'module' });
    
    worker.onmessage = (e) => {
      if (e.data.type === 'progress') {
        setProgress(e.data.progress);
      } else if (e.data.type === 'DONE') {
        engineRef.current = {
          U: e.data.U,
          V: e.data.V,
          c_points: e.data.c_points,
          extent: e.data.extent,
          grid_size: e.data.grid_size,
          particles: initParticles(e.data.extent)
        };
        setReady(true);
      }
    };

    worker.postMessage({ type: 'START' });

    return () => worker.terminate();
  }, []);

  function initParticles(extent) {
    const particles = [];
    const min = -extent / 2;
    const max = extent / 2;

    for (let i = 0; i < NUM_PARTICLES; i++) {
      const x = min + Math.random() * extent;
      const y = min + Math.random() * extent;
      const trailX = new Float32Array(TRAIL_LEN).fill(x);
      const trailY = new Float32Array(TRAIL_LEN).fill(y);

      particles.push({
        x, y,
        life: Math.random() * 100,
        trailX, trailY,
        U_prev: 0, V_prev: 0
      });
    }
    return particles;
  }

  // Render Loop
  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const engine = engineRef.current;
    const min = -engine.extent / 2;
    const max = engine.extent / 2;
    const dx = engine.extent / (engine.grid_size - 1);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Compute pixel-to-world scale mapping
      const aspect = canvas.width / canvas.height;
      const isMobile = window.innerWidth < 640;
      const view_height = isMobile ? 1.5 : 1.0; 
      const view_width = aspect * view_height;
      camRef.current.view_width = view_width;
      camRef.current.view_height = view_height;
      camRef.current.px_per_unit = canvas.height / view_height;
    };
    window.addEventListener('resize', resize);
    resize();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const { view_width, view_height, px_per_unit, x: cx, y: cy } = camRef.current;
      const x_offset = canvas.width / 2 - cx * px_per_unit;
      const y_offset = canvas.height / 2 + cy * px_per_unit; // Y up in physics, down in canvas

      // Update & Draw particles
      ctx.lineWidth = 1.2;

      for (let i = 0; i < NUM_PARTICLES; i++) {
        const p = engine.particles[i];

        // Grid lookup
        let ix = Math.floor((p.x - min) / dx);
        let iy = Math.floor((p.y - min) / dx);
        if (ix < 0) ix = 0; if (ix >= engine.grid_size) ix = engine.grid_size - 1;
        if (iy < 0) iy = 0; if (iy >= engine.grid_size) iy = engine.grid_size - 1;

        const idx = iy * engine.grid_size + ix;
        let u = engine.U[idx];
        let v = engine.V[idx];

        // Flip alignment if needed
        if (u * p.U_prev + v * p.V_prev < 0) {
          u = -u; v = -v;
        }
        p.U_prev = u; p.V_prev = v;

        p.x += u * DT;
        p.y += v * DT;

        // Shift trail
        for(let t=0; t<TRAIL_LEN-1; t++) {
          p.trailX[t] = p.trailX[t+1];
          p.trailY[t] = p.trailY[t+1];
        }
        p.trailX[TRAIL_LEN-1] = p.x;
        p.trailY[TRAIL_LEN-1] = p.y;

        // Respawn check
        p.life -= 1;
        if (p.life <= 0 || p.x < min || p.x > max || p.y < min || p.y > max) {
          p.x = min + Math.random() * engine.extent;
          p.y = min + Math.random() * engine.extent;
          p.trailX.fill(p.x);
          p.trailY.fill(p.y);
          p.life = Math.random() * 100;
          p.U_prev = 0; p.V_prev = 0;
        }

        // Draw trail (Canvas Path)
        ctx.beginPath();
        for (let t = 0; t < TRAIL_LEN; t++) {
          const px = x_offset + p.trailX[t] * px_per_unit;
          const py = y_offset - p.trailY[t] * px_per_unit;
          if (t === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        // Fade alpha along trail - simplified for performance to single stroke
        ctx.strokeStyle = `rgba(156, 163, 175, 0.4)`;
        ctx.stroke();
      }

      // Draw C-points
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '16px Arial';
      for (const cp of engine.c_points) {
        const px = x_offset + cp.x * px_per_unit;
        const py = y_offset - cp.y * px_per_unit;
        
        ctx.fillText(C_POINT_EMOJIS[cp.type] || '💠', px, py);
      }

      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [ready]);

  // Mouse/Touch Interactivity
  const getClientPos = (e) => {
    if (e.touches && e.touches.length > 0) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    return { x: e.clientX, y: e.clientY };
  };

  const handleDown = (e) => {
    if (!interactiveMode) return;
    const pos = getClientPos(e);
    dragRef.current = {
      dragging: true,
      startX: pos.x, startY: pos.y,
      camX: camRef.current.x, camY: camRef.current.y
    };
  };

  const applyCameraBounds = (new_x, new_y) => {
    const extent = engineRef.current ? engineRef.current.extent : 4;
    const view_w = camRef.current.view_width || 1;
    const view_h = camRef.current.view_height || 1;
    
    const limit_x = Math.max(0, (extent - view_w) / 2);
    const limit_y = Math.max(0, (extent - view_h) / 2);
    
    camRef.current.x = Math.max(-limit_x, Math.min(limit_x, new_x));
    camRef.current.y = Math.max(-limit_y, Math.min(limit_y, new_y));
  };

  const handleMove = (e) => {
    if (!interactiveMode || !dragRef.current.dragging) return;
    const pos = getClientPos(e);
    const dx = pos.x - dragRef.current.startX;
    const dy = pos.y - dragRef.current.startY;

    // Convert pixel delta to world delta
    const world_dx = dx / camRef.current.px_per_unit;
    const world_dy = dy / camRef.current.px_per_unit;

    let new_x = dragRef.current.camX - world_dx;
    let new_y = dragRef.current.camY + world_dy;

    applyCameraBounds(new_x, new_y);
  };

  const handleUp = () => {
    dragRef.current.dragging = false;
  };

  // Nav Button Controls
  const panCamera = (dx, dy) => {
    applyCameraBounds(camRef.current.x + dx, camRef.current.y + dy);
  };

  // Keyboard controls
  useEffect(() => {
    if (!interactiveMode) return;
    const handleKeyDown = (e) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === 'ArrowUp') panCamera(0, 0.1);
      if (e.key === 'ArrowDown') panCamera(0, -0.1);
      if (e.key === 'ArrowLeft') panCamera(-0.1, 0);
      if (e.key === 'ArrowRight') panCamera(0.1, 0);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [interactiveMode]);

  const navBtnStyle = {
    background: 'rgba(255,255,255,0.8)',
    border: '1px solid var(--glass-border)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1.2rem',
    color: 'var(--text-main)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  };

  return (
    <>
      <canvas 
        id="bg-canvas" 
        ref={canvasRef} 
        style={{
          pointerEvents: interactiveMode ? 'auto' : 'none',
          cursor: interactiveMode ? (dragRef.current.dragging ? 'grabbing' : 'grab') : 'default',
          opacity: ready ? (interactiveMode ? 1 : 0.25) : 0,
          transition: 'opacity 1s ease-in-out'
        }}
        onMouseDown={handleDown}
        onMouseMove={handleMove}
        onMouseUp={handleUp}
        onMouseLeave={handleUp}
        onTouchStart={handleDown}
        onTouchMove={handleMove}
        onTouchEnd={handleUp}
        onTouchCancel={handleUp}
      />
      
      {interactiveMode && (
        <div className="sim-control-bar">
          {/* Legend */}
          <div className="sim-legend">
            <h4>Optical Singularities</h4>
            <p>
              A continuous wavefield generated by the superposition of random plane waves.
            </p>
            <div className="sim-legend-emojis">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span>⭐</span> Star</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span>🍋</span> Lemon</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span>💠</span> Monstar</div>
            </div>
          </div>
          
          {/* Controls Container */}
          <div className="sim-controls-container">
            {/* D-Pad */}
            <div className="sim-dpad">
              <div />
              <button onClick={() => panCamera(0, window.innerWidth < 640 ? 0.2 : 0.1)} style={navBtnStyle}>↑</button>
              <div />
              <button onClick={() => panCamera(-(window.innerWidth < 640 ? 0.2 : 0.1), 0)} style={navBtnStyle}>←</button>
              <button onClick={() => {camRef.current.x = 0; camRef.current.y = 0;}} style={{...navBtnStyle, fontSize: '0.8rem'}}>R</button>
              <button onClick={() => panCamera(window.innerWidth < 640 ? 0.2 : 0.1, 0)} style={navBtnStyle}>→</button>
              <div />
              <button onClick={() => panCamera(0, -(window.innerWidth < 640 ? 0.2 : 0.1))} style={navBtnStyle}>↓</button>
              <div />
            </div>

            {/* Exit Button */}
            <button
              onClick={onExit}
              className="sim-exit-btn"
            >
              Exit Interactive Mode
            </button>
          </div>
        </div>
      )}

      {!ready && (
        <div style={{ position: 'fixed', top: 20, right: 20, color: 'var(--text-muted)', fontSize: '0.9rem', zIndex: 10 }}>
          Computing vector field... {Math.round(progress * 100)}%
        </div>
      )}
    </>
  );
}
