import { Metadata } from 'next'
import { JobSecurityClient } from '@/components/job-security-client'

export const metadata: Metadata = { title: 'Job Security Analyzer' }

export default function JobSecurityPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">Job Security Analyzer</h1>
      <p className="text-gray-400 mb-8">Check how AI and automation might affect your role. This tool provides estimates based on industry research and our tracked data.</p>
      <JobSecurityClient />
    </div>
  )
}
