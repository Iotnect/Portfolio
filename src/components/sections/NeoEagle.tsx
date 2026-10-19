import { ProductMedia } from '@/components/ProductMedia';
import { productVideos } from '@/lib/productVideos';

export function NeoEagle() {
  return (
    <section className="section product product-eagle" id="neo-eagle" aria-labelledby="neo-eagle-title">
      <div className="container product-grid">
        <ProductMedia title="NEO EAGLE" poster="/assets/factory-dashboard.webp" posterAlt="Eagle Eye workforce and attendance dashboard for smart factories and buildings" video={productVideos.neoEagle} caption="Your Eagle Eye for smarter operations." description="Smart factories. Smart buildings. Connected insights." />
        <div className="product-copy">
          <p className="eyebrow">04 / MEET NEO EAGLE</p>
          <h2 id="neo-eagle-title">A clearer view.<br /><span>A smarter workplace.</span></h2>
          <p>Neo Eagle brings Eagle Eye intelligence to smart factories and smart buildings. Using existing CCTV infrastructure, it provides insights into the people, activities and operational events that shape your workplace.</p>
          <ul className="feature-list">
            <li>Workforce activity monitoring</li>
            <li>Attendance insights</li>
            <li>Safety compliance monitoring</li>
            <li>Visibility into operational events</li>
          </ul>
          <a className="button" href="#contact">Talk to us about Neo Eagle <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>
  );
}
