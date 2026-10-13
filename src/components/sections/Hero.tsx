export function Hero() {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow"><span className="dot"></span> YOUR TECHNOLOGY PARTNER</p>
          <h1>Intelligent vision.<br /><span>Real-world impact.</span></h1>
          <p className="hero-description">See beyond the ordinary. We connect AI, data and technology to help you understand what matters — and act on it.</p>
          <div className="actions"><a className="button" href="#neo-vision">Discover Neo Vision <span aria-hidden="true">↗</span></a><a className="text-link" href="#expertise">Explore our expertise <span aria-hidden="true">→</span></a></div>
          <div className="hero-note"><span className="small-line"></span> Built for businesses. Connected to possibilities.</div>
        </div>
        <div className="hero-visual">
          <img className="tech-image" src="/assets/technology.webp" alt="Code and data visualisation representing connected technology" width={1400} height={1120} fetchPriority="high" />
          <div className="visual-shade"></div>
          <div className="visual-top"><span className="visual-label">NEO VISION™</span><span className="visual-badge">AI-POWERED</span></div>
          <div className="vision-frame"><span></span><span></span><span></span><span></span><div className="vision-mark">NV<span>VISION BEYOND LIMITS</span></div></div>
          <div className="visual-bottom"><span className="dot"></span><span>Your Eagle Eye Partner</span><span aria-hidden="true">↗</span></div>
          <div className="floating-card"><span className="floating-icon" aria-hidden="true">◎</span><div><strong>Existing cameras.<br />New intelligence.</strong><span>Unlock the potential of your CCTV.</span></div></div>
        </div>
      </div>
      <div className="container hero-foot"><span>AI COMPUTER VISION</span><span className="divider">/</span><span>INTERNET OF THINGS</span><span className="divider">/</span><span>INTELLIGENT DASHBOARDS</span><a href="#about" aria-label="Scroll to about us">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></a></div>
    </section>
  );
}
