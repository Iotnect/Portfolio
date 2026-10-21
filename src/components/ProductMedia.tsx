import type { ProductVideoSource } from '@/lib/productVideos';
import { ProductVideo } from './ProductVideo';

type ProductMediaProps = {
  title: string;
  poster: string;
  posterAlt: string;
  video?: ProductVideoSource;
  caption: string;
  description: string;
  frame?: 'laptop';
  autoPlay?: boolean;
};

export function ProductMedia({ title, poster, posterAlt, video, caption, description, frame, autoPlay = false }: ProductMediaProps) {
  const media = video?.kind === 'file' ? (
    <ProductVideo src={video.src} poster={video.poster ?? poster} title={title} captions={video.captions} autoPlay={autoPlay} />
  ) : video?.kind === 'embed' ? (
    <iframe src={video.src} title={`${title} product demonstration`} loading="lazy" allow="fullscreen; picture-in-picture" allowFullScreen />
  ) : (
    <img src={poster} alt={posterAlt} width={1440} height={923} loading="lazy" />
  );

  return (
    <div className="product-visual">
      <div className="product-visual-header">
        <span><span className="dot" /> {title} / PRODUCT OVERVIEW</span>
        <span aria-hidden="true">↗</span>
      </div>
      <div className={`product-media${frame === 'laptop' && video ? ' product-media--laptop' : ''}`}>
        {frame === 'laptop' && video ? (
          <div className="product-laptop">
            <img className="product-laptop-frame" src={poster} alt="" aria-hidden="true" width={1440} height={923} />
            <div className="product-laptop-screen">{media}</div>
          </div>
        ) : media}
      </div>
      <div className="product-caption"><strong>{caption}</strong><span>{description}</span></div>
    </div>
  );
}
