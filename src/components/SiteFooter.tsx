export function SiteFooter() {
  return (
    <footer><div className="container footer-main"><a className="brand footer-brand" href="#">IOTNECT<span className="footer-tagline">Intelligence. Connected.</span></a><div><strong>IOTNECT SDN BHD</strong><span>202501035430 (1636840-W)</span></div><a className="text-link" href="/NeoVision_Iotnect.pdf" target="_blank" rel="noopener">Company profile (PDF) ↗</a></div><div className="container footer-bottom"><span>© <span id="year">{new Date().getFullYear()}</span> IOTNECT Sdn Bhd. All rights reserved.</span><a href="#">Back to top ↑</a></div></footer>
  );
}
