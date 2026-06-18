export default function ProjectModal({ activeProject, onClose }) {
  if (!activeProject) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        <div style={{ marginBottom: '1rem' }}>
          {activeProject.tags.map((tag) => (
            <span className="tag" key={tag}>{tag}</span>
          ))}
        </div>

        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
          {activeProject.title}
        </h2>

        <div className="modal-body">
          {activeProject.body ? (() => {
            const blocks = activeProject.body;
            const rendered = [];
            let i = 0;

            while (i < blocks.length) {
              const block = blocks[i];
              const nextBlock = blocks[i + 1];

              // Render side-by-side images if two consecutive images are found
              if (block.type === 'image' && nextBlock?.type === 'image') {
                rendered.push(
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      margin: '2rem 0',
                    }}
                  >
                    {[block, nextBlock].map((imgBlock, idx) => (
                      <figure
                        key={idx}
                        style={{
                          flex: '1 1 300px',
                          margin: 0,
                          minWidth: 0,
                        }}
                      >
                        <img
                          src={imgBlock.src}
                          alt={imgBlock.caption}
                          style={{
                            width: '100%',
                            borderRadius: '12px',
                            display: 'block',
                          }}
                        />
                        <figcaption
                          style={{
                            marginTop: '0.75rem',
                            textAlign: 'center',
                            fontSize: '0.9rem',
                            opacity: 0.8,
                          }}
                        >
                          {imgBlock.caption}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                );
                i += 2;
              } else if (block.type === 'text') {
                rendered.push(<p key={i}>{block.content}</p>);
                i++;
              } else if (block.type === 'image') {
                rendered.push(
                  <figure
                    key={i}
                    style={{
                      margin: '2rem auto',
                      maxWidth: '400px',
                    }}
                  >
                    <img
                      src={block.src}
                      alt={block.caption}
                      style={{
                        width: '100%',
                        borderRadius: '12px',
                        display: 'block',
                      }}
                    />
                    <figcaption
                      style={{
                        marginTop: '0.75rem',
                        textAlign: 'center',
                        fontSize: '0.9rem',
                        opacity: 0.8,
                      }}
                    >
                      {block.caption}
                    </figcaption>
                  </figure>
                );
                i++;
              } else {
                i++;
              }
            }
            return rendered;
          })() : <p>{activeProject.details}</p>}

          {activeProject.link && (
            <a
              href={activeProject.link}
              target="_blank"
              rel="noreferrer"
              className="btn"
              style={{
                marginTop: '1.5rem',
                display: 'inline-block',
              }}
            >
              {activeProject.linkLabel || 'View Project'}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
