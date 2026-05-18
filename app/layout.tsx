import type { Metadata, Viewport } from 'next'
import { Nunito } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: '4096 Dark — The Number Tile Game',
  description:
    'Join the numbers and get to the 4096 tile! A modern, mobile-friendly take on the classic tile-merging game. Play for free in your browser.',
  keywords: ['4096', '2048', 'tile game', 'number puzzle', 'browser game'],
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5ede0' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1625' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${nunito.variable} bg-background`}>
      <head>
        {/* Apply dark mode before first paint to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('4096-theme');if(t!=='light')document.documentElement.classList.add('dark')}catch(e){}})()`,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
