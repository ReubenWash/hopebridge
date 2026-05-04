import { useState, useEffect } from 'react'

const ScrollButtons = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show buttons after scrolling 300px
      setVisible(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  }

  if (!visible) return null

  return (
    <div className="scroll-buttons">
      <button onClick={scrollToTop} title="Scroll to top">
        <i className="fas fa-chevron-up"></i>
      </button>
      <button onClick={scrollToBottom} title="Scroll to bottom">
        <i className="fas fa-chevron-down"></i>
      </button>
    </div>
  )
}

export default ScrollButtons