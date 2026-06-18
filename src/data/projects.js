export const projects = [
  {
    id: 'wavelab',
    tags: ['Simulation', 'Framework'],
    title: 'WaveLab',
    summary: 'A high-performance Python framework for plane-wave superposition in vacuum. Built around a flexible configuration system, it provides tools for generating, analyzing, and visualizing electromagnetic wavefields ranging from simple interference patterns to complex singular optical structures.',
    body: [
      {
        type: 'text',
        content:'WaveLab provides a framework for constructing and analyzing electromagnetic wavefields through plane-wave superpositions. A flexible configuration system allows a wide range of beams, from structured-light modes to vector speckles, to be generated with only a few lines of code.'
      },
      {
        type: 'text',
        content: 'Configurations are translated into intuitive beam objects that expose visualization and analysis tools, like wavelength spectra and three-dimensional k-space representations.'
      },
      {
        type: 'image',
        src: '/images/kspace3d.png',
        caption: 'K-space representation of a gaussian beam with modes colored according to amplitude.'
      },
      {
        type: 'image',
        src: '/images/wavelength_spectrum.png',
        caption: 'Lorentzian wavelength spectrum.'
      },
      {
        type: 'text',
        content: 'A GPU-accelerated engine evaluates electromagnetic fields throughout space and time, which in turn supports the study of polarization singularities such as C points, Cᵀ points, and Lᵀ points. These structures can be located, analyzed, and traced through three dimensions, enabling the exploration of complex singular-optics systems like knots.'
      },
      {
        type: 'image',
        src: '/images/singularities_network.png',
        caption: 'Networks of Cᵀ (green) and Lᵀ (red) lines with translucent L surfaces (white).'
      },
      {
        type: 'text',
        content: 'For a more comprehensive introduction, detailed examples, and tutorials demonstrating the full capabilities of the framework, see the project documentation.'
      },
    ],
    link: 'https://1rayokelvin.github.io/WaveLab/',
    linkLabel: 'View Documentation'
  },
  {
    id: 'speckle_crossover',
    tags: ['Research Paper', 'Singular Optics'],
    title: 'Crossover in Vector Speckle Fields',
    summary: 'A study of the continuous transition between paraxial and fully three-dimensional Gaussian speckle fields. By introducing an effective dimensionality parameter, the work characterizes how field statistics and polarization singularities evolve across the 2D-3D crossover.',
    body: [
      {
        type: 'text',
        content: 'Gaussian speckle fields are well understood in two limiting cases: the paraxial regime, where the longitudinal electric-field component is negligible, and the fully three-dimensional hemispherical regime, where all field components are statistically equivalent. This work investigates the continuous transition between these limits.'
      },
      {
        type: 'text',
        content: 'The crossover is controlled through the transverse power spectrum of the speckle field, which is modeled as a Gaussian. A dimensionless parameter α is introduced to quantify the width of this spectrum, playing a role analogous to the numerical aperture of a coherent beam. Analysis of the resulting intensity statistics yields an effective dimensionality parameter d_eff, which continuously changes between the paraxial limit (d_eff ≈ 2) and the maximally divergent hemispherical limit (d_eff ≈ 3).'
      },
      {
        type: 'image',
        src: '/images/d_eff.png',
        caption: 'Effective dimensionality across the paraxial-hemispherical limits.'
      },
      {
        type: 'text',
        content: 'The topology of the wavefield is examined through polarization singularities. This is done by tracking the density of Stokes-parameter C-points through the crossover and also through spatial, gradient based correspondence with their three-dimensional counterparts, Cᵀ-points.'
      },
      {
        type: 'image',
        src: '/images/N_C.png',
        caption: 'Normalized C-point density across α.'
      },
      {
        type: 'image',
        src: '/images/cct_correspondence.png',
        caption: 'Parameters quantifying the correspondence between C-points and Cᵀ-points across α.'
      },
      {
        type: 'text',
        content: 'Together, these results provide a quantitative framework for understanding how the statistical and topological properties of Gaussian speckles evolve between the canonical two- and three-dimensional limits. For details, the archive link is attached.'
      }
    ],
    link: 'https://arxiv.org/',
    linkLabel: 'Read Paper'
  },
  {
    id: 'monopoles',
    tags: ['Future Research', 'Theoretical'],
    title: 'Dirac Monopoles & General Relativity',
    summary: 'Upcoming numerical frameworks focusing on the intersection of topology and astrophysics. Planned projects include 3D computational renderings of black holes, neutron stars, and the visualization of Dirac monopoles.',
    body: [
      {
        type: 'text',
        content: 'This area of research is currently in the foundational study phase. Future numerical frameworks will explore the intersection of topology and astrophysics, aiming to build 3D computational renderings of black holes, neutron stars, and the visualization of Dirac monopoles.'
      },
      {
        type: 'text',
        content: 'Status: Pending study and development. Check back later for simulations and detailed findings!'
      }
    ]
  }
];
