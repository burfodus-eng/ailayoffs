import { ImageResponse } from 'next/og'
import { headers } from 'next/headers'
import { getBrandFromHost } from '@/lib/domains'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

const brandIcons: Record<string, { bg: string; accent: string; text: string; label: string }> = {
  ailayoffs: { bg: '#0f172a', accent: '#ef4444', text: '#f59e0b', label: 'AI' },
  aicuts: { bg: '#1c1917', accent: '#f59e0b', text: '#fafaf9', label: 'AC' },
  ailayoffwatch: { bg: '#0c1222', accent: '#38bdf8', text: '#dbeafe', label: 'AW' },
  robotlayoffs: { bg: '#0f0a1e', accent: '#a78bfa', text: '#e9e5f5', label: 'RL' },
}

export default async function Icon() {
  const headersList = await headers()
  const host = headersList.get('host') || 'ailayoffs.com.au'
  const brand = getBrandFromHost(host)
  const icon = brandIcons[brand.key] || brandIcons.ailayoffs

  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 4,
          background: icon.bg,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 900,
            fontFamily: 'monospace',
            color: icon.text,
            lineHeight: 1,
          }}
        >
          {icon.label}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 3,
            left: 4,
            right: 4,
            height: 2,
            background: icon.accent,
            borderRadius: 1,
          }}
        />
      </div>
    ),
    { ...size }
  )
}
