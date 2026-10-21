'use client';

import { useEffect, useRef, useState } from 'react';
import { attachAmbientVideo } from '@/lib/ambientVideo';

type Props = { src: string; poster: string; title: string; captions?: string; autoPlay: boolean };

export function ProductVideo({ src, poster, title, captions, autoPlay }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const recoveryRef = useRef<ReturnType<typeof attachAmbientVideo> | null>(null);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    setBlocked(false);
    if (!autoPlay || !videoRef.current) return;
    const recovery = attachAmbientVideo(videoRef.current, setBlocked);
    recoveryRef.current = recovery;
    return () => { recovery.dispose(); recoveryRef.current = null; };
  }, [autoPlay, src]);

  return (
    <div className="product-video-shell">
      <video
        ref={videoRef}
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
        poster={poster}
        aria-label={`${title} product demonstration`}
      >
        <source src={src} type={src.endsWith('.mp4') ? 'video/mp4' : undefined} />
        {captions && <track kind="captions" src={captions} srcLang="en" label="English" default />}
        Your browser does not support video playback.
      </video>
      {autoPlay && blocked && (
        <button className="product-video-resume" onClick={() => recoveryRef.current?.retry()} aria-label={`Play ${title} demonstration`}>
          <span aria-hidden="true">▶</span> Play demo
        </button>
      )}
    </div>
  );
}
