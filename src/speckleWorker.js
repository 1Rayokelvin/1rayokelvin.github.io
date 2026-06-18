// Complex math helpers
function c_mult(a_re, a_im, b_re, b_im) {
  return [a_re * b_re - a_im * b_im, a_re * b_im + a_im * b_re];
}

// Global configuration
const N = 100;
const WAVELENGTH = 1.0;
const SCALE = 1;
const GRID_SIZE = 600;
const GLOBAL_EXTENT = 4 * SCALE;

function generateSpeckleFieldParams() {
  const k = [];
  const c = [];

  for (let i = 0; i < N; i++) {
    const z = 1.0 - (i + 0.5) / N;
    const r = Math.sqrt(1 - z * z);
    const phi = Math.PI * (3.0 - Math.sqrt(5.0)) * i;

    const kx_hat = r * Math.cos(phi);
    const ky_hat = r * Math.sin(phi);
    const kz_hat = z;

    const k_mag = 2 * Math.PI / WAVELENGTH;
    k.push({ x: k_mag * kx_hat, y: k_mag * ky_hat, z: k_mag * kz_hat });

    // Random vectors
    const rx = Math.random() * 2 - 1;
    const ry = Math.random() * 2 - 1;
    const rz = Math.random() * 2 - 1;

    // Cross product k_hat x r
    let px = ky_hat * rz - kz_hat * ry;
    let py = kz_hat * rx - kx_hat * rz;
    let pz = kx_hat * ry - ky_hat * rx;

    const p_norm = Math.sqrt(px * px + py * py + pz * pz);
    px /= p_norm;
    py /= p_norm;
    pz /= p_norm;

    // Complex amplitude (Gaussian)
    // Box-Muller transform for normal distribution
    const u1 = Math.random();
    const u2 = Math.random();
    const u3 = Math.random();
    const u4 = Math.random();
    
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    const z1 = Math.sqrt(-2.0 * Math.log(u3)) * Math.cos(2.0 * Math.PI * u4);

    const amp_re = z0 / Math.sqrt(2 * N);
    const amp_im = z1 / Math.sqrt(2 * N);

    c.push({
      x_re: px * amp_re, x_im: px * amp_im,
      y_re: py * amp_re, y_im: py * amp_im
    });
  }
  return { k, c };
}

function computeGlobalField(k, c) {
  const dx = GLOBAL_EXTENT / (GRID_SIZE - 1);
  const start = -GLOBAL_EXTENT / 2;

  const U = new Float32Array(GRID_SIZE * GRID_SIZE);
  const V = new Float32Array(GRID_SIZE * GRID_SIZE);
  const S1_grid = new Float32Array(GRID_SIZE * GRID_SIZE);
  const S2_grid = new Float32Array(GRID_SIZE * GRID_SIZE);

  for (let iy = 0; iy < GRID_SIZE; iy++) {
    const y = start + iy * dx;
    for (let ix = 0; ix < GRID_SIZE; ix++) {
      const x = start + ix * dx;

      let Ex_re = 0, Ex_im = 0;
      let Ey_re = 0, Ey_im = 0;

      for (let i = 0; i < N; i++) {
        const phase = k[i].x * x + k[i].y * y;
        const cos_p = Math.cos(phase);
        const sin_p = Math.sin(phase);

        Ex_re += c[i].x_re * cos_p - c[i].x_im * sin_p;
        Ex_im += c[i].x_re * sin_p + c[i].x_im * cos_p;
        Ey_re += c[i].y_re * cos_p - c[i].y_im * sin_p;
        Ey_im += c[i].y_re * sin_p + c[i].y_im * cos_p;
      }

      const absEx2 = Ex_re * Ex_re + Ex_im * Ex_im;
      const absEy2 = Ey_re * Ey_re + Ey_im * Ey_im;
      
      const S0 = absEx2 + absEy2;
      const S0_safe = S0 === 0 ? 1 : S0;
      
      const S1_unnorm = absEx2 - absEy2;
      const S2_unnorm = 2 * (Ex_re * Ey_re + Ex_im * Ey_im);

      const S1 = S1_unnorm / S0_safe;
      const S2 = S2_unnorm / S0_safe;

      const psi = 0.5 * Math.atan2(S2_unnorm, S1_unnorm);

      const idx = iy * GRID_SIZE + ix;
      U[idx] = Math.cos(psi);
      V[idx] = Math.sin(psi);
      S1_grid[idx] = S1;
      S2_grid[idx] = S2;
    }
    // Report progress
    if (iy % 50 === 0) {
      postMessage({ type: 'progress', progress: (iy / GRID_SIZE) * 0.8 }); // First 80% is grid
    }
  }

  return { U, V, S1_grid, S2_grid };
}

function exactStokesAndGrads(x_pts, y_pts, k, c) {
  const len = x_pts.length;
  const res = {
    S1: new Float64Array(len), S2: new Float64Array(len),
    S1_x: new Float64Array(len), S1_y: new Float64Array(len),
    S2_x: new Float64Array(len), S2_y: new Float64Array(len)
  };

  for (let p = 0; p < len; p++) {
    const x = x_pts[p];
    const y = y_pts[p];

    let Ex_re = 0, Ex_im = 0, Ey_re = 0, Ey_im = 0;
    let Ex_x_re = 0, Ex_x_im = 0, Ex_y_re = 0, Ex_y_im = 0;
    let Ey_x_re = 0, Ey_x_im = 0, Ey_y_re = 0, Ey_y_im = 0;

    for (let i = 0; i < N; i++) {
      const phase = k[i].x * x + k[i].y * y;
      const cos_p = Math.cos(phase);
      const sin_p = Math.sin(phase);

      const ex_re = c[i].x_re * cos_p - c[i].x_im * sin_p;
      const ex_im = c[i].x_re * sin_p + c[i].x_im * cos_p;
      const ey_re = c[i].y_re * cos_p - c[i].y_im * sin_p;
      const ey_im = c[i].y_re * sin_p + c[i].y_im * cos_p;

      Ex_re += ex_re; Ex_im += ex_im;
      Ey_re += ey_re; Ey_im += ey_im;

      // 1j * kx * ex = [-kx * ex_im, kx * ex_re]
      Ex_x_re += -k[i].x * ex_im; Ex_x_im += k[i].x * ex_re;
      Ex_y_re += -k[i].y * ex_im; Ex_y_im += k[i].y * ex_re;
      
      Ey_x_re += -k[i].x * ey_im; Ey_x_im += k[i].x * ey_re;
      Ey_y_re += -k[i].y * ey_im; Ey_y_im += k[i].y * ey_re;
    }

    const S0 = (Ex_re**2 + Ex_im**2) + (Ey_re**2 + Ey_im**2);
    const S0_safe = S0 === 0 ? 1 : S0;
    
    const S1_unnorm = (Ex_re**2 + Ex_im**2) - (Ey_re**2 + Ey_im**2);
    const S2_unnorm = 2 * (Ex_re * Ey_re + Ex_im * Ey_im);

    res.S1[p] = S1_unnorm / S0_safe;
    res.S2[p] = S2_unnorm / S0_safe;

    const S0_x = 2 * (Ex_x_re * Ex_re + Ex_x_im * Ex_im + Ey_x_re * Ey_re + Ey_x_im * Ey_im);
    const S0_y = 2 * (Ex_y_re * Ex_re + Ex_y_im * Ex_im + Ey_y_re * Ey_re + Ey_y_im * Ey_im);

    const dS1_x_unnorm = 2 * (Ex_x_re * Ex_re + Ex_x_im * Ex_im) - 2 * (Ey_x_re * Ey_re + Ey_x_im * Ey_im);
    const dS1_y_unnorm = 2 * (Ex_y_re * Ex_re + Ex_y_im * Ex_im) - 2 * (Ey_y_re * Ey_re + Ey_y_im * Ey_im);

    const dS2_x_unnorm = 2 * (Ex_x_re * Ey_re + Ex_x_im * Ey_im + Ex_re * Ey_x_re + Ex_im * Ey_x_im);
    const dS2_y_unnorm = 2 * (Ex_y_re * Ey_re + Ex_y_im * Ey_im + Ex_re * Ey_y_re + Ex_im * Ey_y_im);

    res.S1_x[p] = (S0 * dS1_x_unnorm - S1_unnorm * S0_x) / (S0_safe**2);
    res.S1_y[p] = (S0 * dS1_y_unnorm - S1_unnorm * S0_y) / (S0_safe**2);

    res.S2_x[p] = (S0 * dS2_x_unnorm - S2_unnorm * S0_x) / (S0_safe**2);
    res.S2_y[p] = (S0 * dS2_y_unnorm - S2_unnorm * S0_y) / (S0_safe**2);
  }
  return res;
}

function findCPoints(k, c, S1_grid, S2_grid) {
  const dx = GLOBAL_EXTENT / (GRID_SIZE - 1);
  const start = -GLOBAL_EXTENT / 2;

  let x_pts = [];
  let y_pts = [];

  // Find 2x2 cells where both S1 and S2 cross zero
  for (let iy = 0; iy < GRID_SIZE - 1; iy++) {
    for (let ix = 0; ix < GRID_SIZE - 1; ix++) {
      const idx1 = iy * GRID_SIZE + ix;
      const idx2 = iy * GRID_SIZE + (ix + 1);
      const idx3 = (iy + 1) * GRID_SIZE + ix;
      const idx4 = (iy + 1) * GRID_SIZE + (ix + 1);

      const s1_vals = [S1_grid[idx1], S1_grid[idx2], S1_grid[idx3], S1_grid[idx4]];
      const s2_vals = [S2_grid[idx1], S2_grid[idx2], S2_grid[idx3], S2_grid[idx4]];

      const s1_max = Math.max(...s1_vals);
      const s1_min = Math.min(...s1_vals);
      const s2_max = Math.max(...s2_vals);
      const s2_min = Math.min(...s2_vals);

      if (s1_max > 0 && s1_min < 0 && s2_max > 0 && s2_min < 0) {
        x_pts.push(start + ix * dx);
        y_pts.push(start + iy * dx);
      }
    }
  }

  postMessage({ type: 'progress', progress: 0.85 }); // Phase 2: Refinement

  // Newton-Raphson
  for (let iter = 0; iter < 5; iter++) {
    const { S1, S2, S1_x, S1_y, S2_x, S2_y } = exactStokesAndGrads(x_pts, y_pts, k, c);
    
    for (let i = 0; i < x_pts.length; i++) {
      const det = S1_x[i] * S2_y[i] - S1_y[i] * S2_x[i];
      if (Math.abs(det) > 1e-14) {
        x_pts[i] += (-S2_y[i] * S1[i] + S1_y[i] * S2[i]) / det;
        y_pts[i] += ( S2_x[i] * S1[i] - S1_x[i] * S2[i]) / det;
      }
    }
  }

  postMessage({ type: 'progress', progress: 0.95 }); // Phase 3: Classification

  // Classification
  const { S1_x, S1_y, S2_x, S2_y } = exactStokesAndGrads(x_pts, y_pts, k, c);
  const c_points = [];

  for (let i = 0; i < x_pts.length; i++) {
    const D_I = S1_x[i] * S2_y[i] - S1_y[i] * S2_x[i];
    
    // NL classification
    const term1 = (2*S1_y[i] + S2_x[i])**2 - 3*S2_y[i]*(2*S1_x[i] - S2_y[i]);
    const term2 = (2*S1_x[i] - S2_y[i])**2 + 3*S2_x[i]*(2*S1_y[i] + S2_x[i]);
    const term3 = (2*S1_x[i]*S1_y[i] + S1_x[i]*S2_x[i] - S1_y[i]*S2_y[i] + 4*S2_x[i]*S2_y[i])**2;
    const NL = term1 * term2 - term3;

    let ctype = 'Star';
    if (D_I >= 0) {
      ctype = NL < 0 ? 'Lemon' : 'Monstar';
    }

    c_points.push({ x: x_pts[i], y: y_pts[i], type: ctype });
  }

  return c_points;
}

self.onmessage = function(e) {
  if (e.data.type === 'START') {
    const { k, c } = generateSpeckleFieldParams();
    const { U, V, S1_grid, S2_grid } = computeGlobalField(k, c);
    const c_points = findCPoints(k, c, S1_grid, S2_grid);
    
    postMessage({
      type: 'DONE',
      U, V, c_points, 
      extent: GLOBAL_EXTENT, 
      grid_size: GRID_SIZE
    }, [U.buffer, V.buffer]); // Transfer buffers for performance
  }
};
