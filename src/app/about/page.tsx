import { Metadata } from 'next'
import { headers } from 'next/headers'
import { getBrandFromHost } from '@/lib/domains'

export const metadata: Metadata = { title: 'About' }

export default async function AboutPage() {
  const headersList = await headers()
  const host = headersList.get('host') || 'ailayoffs.com.au'
  const brand = getBrandFromHost(host)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-[var(--dark-text)] mb-8">About {brand.name}</h1>
      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
        <p className="text-gray-700 dark:text-[var(--dark-text)]">
          {brand.name} was created to provide a clear, continuously updated estimate of how AI and automation
          are affecting global employment. We believe this information should be accessible, transparent, and
          free from hype in either direction.
        </p>
        <p className="text-gray-700 dark:text-[var(--dark-text)]">
          Our goal is not to advocate for or against AI adoption, but to document what is happening based on
          public reporting. We track both job losses and job creation to provide a balanced picture.
        </p>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-[var(--dark-text)]">How It Works</h2>
        <p className="text-gray-700 dark:text-[var(--dark-text)]">
          We use a combination of automated monitoring and editorial review to discover, classify, and verify
          reports of AI-related workforce changes. Each event is scored by the strength of its connection to AI
          and presented as a range from conservative to upper-bound estimates.
        </p>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-[var(--dark-text)]">Contact</h2>
        <p className="text-gray-700 dark:text-[var(--dark-text)]">
          For corrections, data inquiries, or media requests, please reach out via our contact channels.
        </p>
      </div>
    </div>
  )
}
