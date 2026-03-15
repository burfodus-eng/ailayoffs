import { ImageResponse } from 'next/og'
import { headers } from 'next/headers'
import { getBrandFromHost } from '@/lib/domains'

export const runtime = 'edge'
export const alt = 'AI Layoffs Tracker'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const headersList = await headers()
  const host = headersList.get('host') || 'ailayoffs.com.au'
  const brand = getBrandFromHost(host)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: brand.heroBg,
          color: brand.heroText,
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 60px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 72, fontWeight: 800, marginBottom: 20, color: brand.heroAccent }}>
            {brand.name}
          </div>
          <div style={{ fontSize: 32, opacity: 0.9, maxWidth: 900 }}>
            {brand.tagline}
          </div>
          <div style={{ fontSize: 22, opacity: 0.6, marginTop: 30 }}>
            {brand.domain}
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
