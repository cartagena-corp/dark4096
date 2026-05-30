import type { Metadata, Viewport } from 'next'
import { Nunito } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { I18nProvider } from '@/hooks/use-i18n'
import { PostHogProvider } from '@/components/posthog-provider'
import { getSiteUrl, SITE_NAME } from '@/lib/seo'
import './globals.css'

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '600', '700', '800', '900'],
})

const siteUrl = getSiteUrl()

const title = '4096 Dark — The Number Tile Game'
const description =
  'Join the numbers and get to the 4096 tile! A modern, mobile-friendly take on the classic tile-merging game. Play for free in your browser — no install, no sign-up.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: '%s — 4096 Dark',
  },
  description,
  applicationName: SITE_NAME,
  keywords: [
    '4096',
    '4096 game',
    '2048',
    '2048 game',
    'tile game',
    'number puzzle',
    'merge game',
    'browser game',
    'free online game',
    'puzzle game',
  ],
  authors: [{ name: 'Kenn Marcucci' }],
  creator: 'Kenn Marcucci',
  publisher: SITE_NAME,
  category: 'games',
  alternates: {
    canonical: '/',
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title,
    description,
    url: siteUrl,
    locale: 'en_US',
    images: [
      {
        url: '/icon.svg',
        alt: '4096 Dark — number tile puzzle game',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title,
    description,
    images: ['/icon.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
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

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'VideoGame',
  name: SITE_NAME,
  alternateName: '4096 — The Number Tile Game',
  description,
  url: siteUrl,
  image: `${siteUrl}/icon.svg`,
  applicationCategory: 'GameApplication',
  genre: 'Puzzle',
  operatingSystem: 'Web Browser',
  playMode: 'SinglePlayer',
  inLanguage: ['en', 'es', 'fr', 'pt'],
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  author: {
    '@type': 'Person',
    name: 'Kenn Marcucci',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} bg-background`}
      suppressHydrationWarning
    >
      <head>
        {/* Apply dark mode before first paint to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('4096-theme');if(t!=='light')document.documentElement.classList.add('dark')}catch(e){}})()`,
          }}
        />
        {/* Structured data for rich search results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <PostHogProvider>
          <I18nProvider>{children}</I18nProvider>
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </PostHogProvider>
      </body>
    </html>
  )
}
