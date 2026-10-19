import type { ProductVideoSource } from '@/lib/productVideos';

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
    <video
      className={autoPlay ? 'product-video-ambient' : undefined}
      controls={!autoPlay}
      autoPlay={autoPlay}
      muted={autoPlay}
      loop={autoPlay}
      playsInline
      disablePictureInPicture={autoPlay}
      disableRemotePlayback={autoPlay}
      tabIndex={autoPlay ? -1 : undefined}
      preload="metadata"
      poster={video.poster ?? poster}
      aria-label={`${title} product demonstration`}
    >
      <source src={video.src} type={video.src.endsWith('.mp4') ? 'video/mp4' : undefined} />
      {video.captions && <track kind="captions" src={video.captions} srcLang="en" label="English" default />}
      Your browser does not support video playback.
    </video>
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
