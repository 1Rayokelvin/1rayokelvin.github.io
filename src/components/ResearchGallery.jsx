import { FileText, Compass, BarChart2, Award } from 'lucide-react'
import { MathTex } from './MathTex'

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
)

export function ResearchGallery() {
  const projects = [
    {
      title: "Dimensional Crossover in Gaussian Speckles",
      subtitle: "Research Paper Draft & Presentation",
      period: "June 2025 – April 2026",
      tags: ["Statistical Optics", "Random Matrix Theory", "Topology"],
      icon: <Compass className="w-5 h-5 text-blue-600" />,
      description: "Investigated the topological transition of complex Gaussian speckle fields moving from the 2D paraxial limit to the 3D hemispherical limit. By analyzing polarization singularities (C-points) and their 3D counterparts, we formulated a closed-form expression for effective dimensionality and singularity density, validated through large-scale numerical grid sweeps.",
      equations: [
        {
          label: "Effective Dimensionality (crossover parameter α)",
          formula: "d_{\\text{eff}} = \\frac{(2\\mu_x + \\mu_z)^2}{2\\mu_x^2 + \\mu_z^2}"
        },
        {
          label: "Normalized Density of C-points per λ² area",
          formula: "N_C = 2\\pi \\frac{\\mu_2}{\\mu_x}"
        }
      ],
      presentations: [
        "Presented at Scoposis 2025, Physical Research Laboratory (PRL)",
        "Presented at the University of Hyderabad Poster Session (January 2026)"
      ],
      links: [
        {
          label: "View LaTeX Draft",
          url: "file:///C:/Users/hp/Desktop/stuff/texs/paper_draft2/dft2.tex",
          icon: <FileText className="w-4 h-4" />
        }
      ]
    },
    {
      title: "WaveLab",
      subtitle: "Computational Wave Physics Library",
      period: "June 2025 – April 2026",
      tags: ["Computational Physics", "Python", "Simulation"],
      icon: <BarChart2 className="w-5 h-5 text-blue-600" />,
      description: "Developed a modular, high-performance Python simulation library designed to model scalar and vector wavefield propagation, polarization singularities, and transverse power spectrum fluctuations. It provides the numerical core for analyzing complex statistical systems that are difficult to investigate analytically.",
      equations: [
        {
          label: "Transverse Power Spectrum",
          formula: "S(k_x, k_y) = \\exp\\left(-\\frac{k_x^2 + k_y^2}{\\sigma_K^2}\\right)"
        }
      ],
      links: [
        {
          label: "WaveLab Repository",
          url: "https://github.com/1Rayokelvin/WaveLab",
          icon: <GithubIcon />
        },
        {
          label: "GitHub Profile",
          url: "https://github.com/1Rayokelvin",
          icon: <GithubIcon />
        }
      ]
    },
    {
      title: "Supernova SN 2023ixf Analysis",
      subtitle: "Observational Astronomy Internship",
      period: "May 2024",
      tags: ["Astro-Physics", "Data Analysis", "Python"],
      icon: <Award className="w-5 h-5 text-blue-600" />,
      description: "An online research internship under the Krittika Club of IIT Bombay. Analyzed astronomical photometry and light-curve data from Supernova SN 2023ixf. This served as my first engagement with writing code to solve physical problems, highlighting how computational analysis handles observational data.",
      links: []
    }
  ]

  return (
    <div className="research-gallery">
      {projects.map((project, index) => (
        <div key={index} className="research-card">
          <div className="card-header">
            <div className="header-left">
              <span className="project-icon">{project.icon}</span>
              <div>
                <h3>{project.title}</h3>
                <span className="subtitle">{project.subtitle}</span>
              </div>
            </div>
            <span className="period">{project.period}</span>
          </div>

          <div className="tag-container">
            {project.tags.map((tag, tIdx) => (
              <span key={tIdx} className="tag">{tag}</span>
            ))}
          </div>

          <p className="description">{project.description}</p>

          {project.equations && project.equations.length > 0 && (
            <div className="equations-box">
              <h4>Key Mathematical Symmetries:</h4>
              {project.equations.map((eq, eIdx) => (
                <div key={eIdx} className="equation-row">
                  <span className="equation-label">{eq.label}:</span>
                  <MathTex math={eq.formula} block={true} />
                </div>
              ))}
            </div>
          )}

          {project.presentations && project.presentations.length > 0 && (
            <div className="presentations-box">
              <h4>Presentations & Milestones:</h4>
              <ul>
                {project.presentations.map((pres, pIdx) => (
                  <li key={pIdx}>
                    <Award className="w-3.5 h-3.5 inline mr-1 text-blue-600" />
                    <span>{pres}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.links && project.links.length > 0 && (
            <div className="card-links">
              {project.links.map((link, lIdx) => (
                <a
                  key={lIdx}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="card-link-btn"
                >
                  {link.icon}
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
