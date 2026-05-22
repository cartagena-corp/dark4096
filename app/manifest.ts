import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '4096 Dark — The Number Tile Game',
    short_name: '4096 Dark',
    description:
      'Join the numbers and get to the 4096 tile! A modern, mobile-friendly take on the classic tile-merging game.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#1a1625',
    theme_color: '#1a1625',
    categories: ['games', 'entertainment'],
    icons: [
      {
        src: '/icon.svg',
        type: 'image/svg+xml',
        sizes: 'any',
      },
      {
        src: '/icon-dark-32x32.png',
        type: 'image/png',
        sizes: '32x32',
      },
      {
        src: '/apple-icon.png',
        type: 'image/png',
        sizes: '180x180',
      },
    ],
  }
}
