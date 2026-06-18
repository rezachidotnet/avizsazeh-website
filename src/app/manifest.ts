import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AvizSazeh Naghsh Jahan',
    short_name: 'AvizSazeh',
    description: 'Architectural Engineering System for suspended metal ceilings',
    start_url: '/',
    display: 'standalone',
    background_color: '#0F1113',
    theme_color: '#0F1113',
    lang: 'fa',
    dir: 'rtl',
    icons: [
      { src: '/icon.png', sizes: '146x144', type: 'image/png' },
      { src: '/brand/standard-logo.png', sizes: '1386x682', type: 'image/png', purpose: 'any' },
    ],
  };
}
