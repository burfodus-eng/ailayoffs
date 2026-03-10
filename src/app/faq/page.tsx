import { Metadata } from 'next'
import { FAQJsonLd } from '@/components/json-ld'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Common questions about AI layoff tracking methodology, data accuracy, attribution categories, and how we estimate AI-driven job displacement.',
}

const faqs = [
  {
    q: 'How accurate are these numbers?',
    a: 'Our numbers are estimates based on public reporting, not official census data. We present three tiers (conservative, core, upper bound) to reflect this uncertainty. See our methodology page for full details.',
  },
  {
    q: 'Where does the data come from?',
    a: 'We monitor news articles, press releases, earnings calls, company announcements, and other public sources. We do not fabricate or extrapolate data — every event links back to a verifiable source.',
  },
  {
    q: 'Why are there different estimates?',
    a: 'Because AI attribution is rarely black and white. A company might cut 10,000 jobs citing "efficiency improvements including AI." Is that 100% AI? 50%? 10%? Our three tiers represent different assumptions about how much to attribute to AI.',
  },
  {
    q: 'Do you track jobs created by AI too?',
    a: 'Yes. We track AI-related job creation, new roles, and redeployment alongside job losses to provide a more complete picture.',
  },
  {
    q: 'What is the difference between provisional and reviewed data?',
    a: 'Provisional events have been automatically detected and classified but not yet verified by deeper review. Reviewed events have been confirmed or corrected through additional analysis. Reviewed data overrides provisional figures when conflicts exist.',
  },
  {
    q: 'How often is the data updated?',
    a: 'The automated pipeline runs regularly to discover new events. Deeper review passes happen periodically to refine and correct the data.',
  },
  {
    q: 'Can I use this data?',
    a: 'For personal, research, and journalistic use, please cite us as the source. For commercial or API access, please contact us.',
  },
  {
    q: 'I found an error. How do I report it?',
    a: 'We actively welcome corrections. Please contact us with the specific event and your suggested correction, ideally with a source link.',
  },
]

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <FAQJsonLd questions={faqs} />
      <h1 className="text-3xl font-bold text-gray-900 dark:text-[var(--dark-text)] mb-8">Frequently Asked Questions</h1>
      <div className="space-y-6">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white dark:bg-[var(--dark-card)] border border-gray-200 dark:border-[var(--dark-border)] rounded-lg p-5 shadow-sm">
            <h2 className="text-gray-900 dark:text-[var(--dark-text)] font-semibold mb-2">{faq.q}</h2>
            <p className="text-gray-600 dark:text-[var(--dark-muted)] text-sm">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
