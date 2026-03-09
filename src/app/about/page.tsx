import { Metadata } from 'next'

export const metadata: Metadata = { title: 'About' }

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">About</h1>
      <div className="prose prose-invert prose-sm max-w-none space-y-6">
        <p className="text-gray-300">
          This tracker was created to provide a clear, continuously updated estimate of how AI and automation
          are affecting global employment. We believe this information should be accessible, transparent, and
          free from hype in either direction.
        </p>
        <p className="text-gray-300">
          Our goal is not to advocate for or against AI adoption, but to document what is happening based on
          public reporting. We track both job losses and job creation to provide a balanced picture.
        </p>
        <h2 className="text-xl font-semibold text-white">How It Works</h2>
        <p className="text-gray-300">
          We use a combination of automated monitoring and editorial review to discover, classify, and verify
          reports of AI-related workforce changes. Each event is scored by the strength of its connection to AI
          and presented as a range from conservative to upper-bound estimates.
        </p>
        <h2 className="text-xl font-semibold text-white">Contact</h2>
        <p className="text-gray-300">
          For corrections, data inquiries, or media requests, please reach out via our contact channels.
        </p>
      </div>
    </div>
  )
}
