import { useEffect, useRef } from 'react'

export function MathTex({ math, block = false }) {
  const ref = useRef(null)

  useEffect(() => {
    const renderMath = () => {
      if (window.katex && ref.current) {
        try {
          window.katex.render(math, ref.current, {
            throwOnError: false,
            displayMode: block
          })
        } catch (err) {
          console.error("KaTeX rendering error:", err)
        }
      } else {
        // Fallback if KaTeX is not loaded yet
        setTimeout(renderMath, 100)
      }
    }

    renderMath()
  }, [math, block])

  return block ? (
    <div style={{ margin: '1.25rem 0', overflowX: 'auto', overflowY: 'hidden' }}>
      <span ref={ref} className="katex-display-container">$$ {math} $$</span>
    </div>
  ) : (
    <span ref={ref} className="katex-inline-container">$ {math} $</span>
  )
}
