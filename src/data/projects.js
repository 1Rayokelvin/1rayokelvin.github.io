export const projects = [
  {
    id: 'vectorwaves',
    tags: ['Simulation', 'Framework'],
    title: 'VectorWaves',
    summary: 'A high-performance Python framework for plane-wave superposition in vacuum. Built around a flexible configuration system, it provides tools for generating, analyzing, and visualizing electromagnetic wavefields ranging from simple interference patterns to complex singular optical structures.',
    body: [
      {
        type: 'text',
        content:'VectorWaves provides a framework for constructing and analyzing electromagnetic wavefields through plane-wave superpositions. A flexible configuration system allows a wide range of beams, from structured-light modes to vector speckles, to be generated with only a few lines of code.'
      },
      {
        type: 'text',
        content: 'Configurations are translated into intuitive beam objects that expose visualization and analysis tools, like wavelength spectra and three-dimensional k-space representations.'
      },
      {
        type: 'image',
        src: './images/kspace3d.png',
        caption: 'K-space representation of a gaussian beam with modes colored according to amplitude.'
      },
      {
        type: 'image',
        src: './images/wavelength_spectrum.png',
        caption: 'Lorentzian wavelength spectrum.'
      },
      {
        type: 'text',
        content: 'A GPU-accelerated engine evaluates electromagnetic fields throughout space and time, which in turn supports the study of polarization singularities such as C points, Cᵀ points, and Lᵀ points. These structures can be located, analyzed, and traced through three dimensions, enabling the exploration of complex singular-optics systems like knots.'
      },
      {
        type: 'image',
        src: './images/singularities_network.png',
        caption: 'Networks of Cᵀ (green) and Lᵀ (red) lines with translucent L surfaces (white).'
      },
      {
        type: 'text',
        content: 'For a more comprehensive introduction, detailed examples, and tutorials demonstrating the full capabilities of the framework, see the project documentation.'
      },
    ],
    links: [
      { href: 'https://1rayokelvin.github.io/VectorWaves/', label: 'View Documentation' },
      { href: 'https://github.com/1Rayokelvin/VectorWaves', label: 'GitHub' },
      { href: 'https://pypi.org/project/vectorwaves/', label: 'PyPI' }
    ]
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
        src: './images/d_eff.png',
        caption: 'Effective dimensionality across the paraxial-hemispherical limits.'
      },
      {
        type: 'text',
        content: 'The topology of the wavefield is examined through polarization singularities. This is done by tracking the density of Stokes-parameter C-points through the crossover and also through spatial, gradient based correspondence with their three-dimensional counterparts, Cᵀ-points.'
      },
      {
        type: 'image',
        src: './images/N_C.png',
        caption: 'Normalized C-point density across α.'
      },
      {
        type: 'image',
        src: './images/cct_correspondence.png',
        caption: 'Parameters quantifying the correspondence between C-points and Cᵀ-points across α.'
      },
      {
        type: 'text',
        content: 'Together, these results provide a quantitative framework for understanding how the statistical and topological properties of Gaussian speckles evolve between the canonical two- and three-dimensional limits.'
      }
    ],
    status: 'Release planned shortly.'
  },
  {
    id: 'topology_curiosity',
    tags: ['Current Interest', 'Topology'],
    title: 'Topology in Physics',
    summary: 'An area of physics I hope to study more deeply, especially how topological ideas connect quantum mechanics, condensed matter, and gauge theories.',

    body: [
      {
        type: 'text',
        content: 'My interest began while working with polarization singularities and has since grown into a broader curiosity about topology throughout physics.'
      }]
  }
];