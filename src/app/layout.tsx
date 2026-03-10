import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { headers } from 'next/headers'
import { getBrandFromHost } from '@/lib/domains'
import { BrandProvider } from '@/lib/brand-context'
import { ThemeProvider } from '@/lib/theme-context'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { OrganizationJsonLd } from '@/components/json-ld'

const inter = Inter({ subsets: ['latin'] })

// Brand-specific dark mode palettes
const darkPalettes: Record<string, Record<string, string>> = {
  ailayoffs: {
    '--dark-bg': '#0f172a',
    '--dark-surface': '#1e293b',
    '--dark-card': '#1e293b',
    '--dark-border': '#334155',
    '--dark-text': '#e2e8f0',
    '--dark-muted': '#94a3b8',
    '--dark-accent': '#ef4444',
    '--dark-header': '#0f172a',
  },
  aicuts: {
    '--dark-bg': '#1c1917',
    '--dark-surface': '#292524',
    '--dark-card': '#292524',
    '--dark-border': '#44403c',
    '--dark-text': '#fafaf9',
    '--dark-muted': '#a8a29e',
    '--dark-accent': '#f59e0b',
    '--dark-header': '#1c1917',
  },
  ailayoffwatch: {
    '--dark-bg': '#0c1222',
    '--dark-surface': '#162032',
    '--dark-card': '#162032',
    '--dark-border': '#1e3a5f',
    '--dark-text': '#dbeafe',
    '--dark-muted': '#93c5fd',
    '--dark-accent': '#38bdf8',
    '--dark-header': '#0c1222',
  },
  robotlayoffs: {
    '--dark-bg': '#0f0a1e',
    '--dark-surface': '#1a1230',
    '--dark-card': '#1a1230',
    '--dark-border': '#2e1f5e',
    '--dark-text': '#e9e5f5',
    '--dark-muted': '#a78bfa',
    '--dark-accent': '#a78bfa',
    '--dark-header': '#0f0a1e',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers()
  const host = headersList.get('host') || 'ailayoffs.com.au'
  const brand = getBrandFromHost(host)
  const origin = `https://${brand.domain}`

  return {
    metadataBase: new URL(origin),
    title: {
      default: `${brand.name} — ${brand.tagline}`,
      template: `%s | ${brand.name}`,
    },
    description: brand.description,
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: `${brand.name} — ${brand.tagline}`,
      description: brand.description,
      type: 'website',
      siteName: brand.name,
      url: origin,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${brand.name} — ${brand.tagline}`,
      description: brand.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const host = headersList.get('host') || 'ailayoffs.com.au'
  const brand = getBrandFromHost(host)
  const palette = darkPalettes[brand.key] || darkPalettes.ailayoffs

  const cssVars = Object.entries(palette).map(([k, v]) => `${k}: ${v}`).join(';\n  ')

  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: `:root {\n  ${cssVars};\n}` }} />
        <OrganizationJsonLd name={brand.name} url={`https://${brand.domain}`} description={brand.description} />
      </head>
      <body className={inter.className}>
        {process.env.NEXT_PUBLIC_UMAMI_URL && process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <Script
            src={`${process.env.NEXT_PUBLIC_UMAMI_URL}/script.js`}
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            strategy="afterInteractive"
          />
        )}
        <BrandProvider brand={brand}>
          <ThemeProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </BrandProvider>
      </body>
    </html>
  )
}
