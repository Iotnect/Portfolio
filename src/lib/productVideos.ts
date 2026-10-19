export type ProductVideoSource =
  | { kind: 'file'; src: string; poster?: string; captions?: string }
  | { kind: 'embed'; src: string };

// Supply the approved local video paths or provider embed URLs here.
// An unconfigured product retains its existing screenshot without a broken player.
export const productVideos: {
  neoVision?: ProductVideoSource;
  neoEagle?: ProductVideoSource;
} = {
  neoVision: {
    kind: 'file',
    src: '/videos/neovision-demo.mp4',
    poster: '/videos/neovision-demo-poster.jpg',
  },
};
