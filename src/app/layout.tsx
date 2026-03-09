import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { headers } from 'next/headers'
import { getBrandFromHost } from '@/lib/domains'
import { BrandProvider } from '@/lib/brand-context'
import { ThemeProvider } from '@/lib/theme-context'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers()
  const host = headersList.get('host') || 'ailayoffs.com.au'
  const brand = getBrandFromHost(host)

  return {
    title: {
      default: `${brand.name} — ${brand.tagline}`,
      template: `%s | ${brand.name}`,
    },
    description: brand.description,
    openGraph: {
      title: `${brand.name} — ${brand.tagline}`,
      description: brand.description,
      type: 'website',
    },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const host = headersList.get('host') || 'ailayoffs.com.au'
  const brand = getBrandFromHost(host)

  return (
    <html lang="en">
      <body className={inter.className}>
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
