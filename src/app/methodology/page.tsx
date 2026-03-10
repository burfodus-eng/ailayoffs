import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Methodology' }

export default function MethodologyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-[var(--dark-text)] mb-8">Methodology</h1>

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-[var(--dark-text)]">What We Track</h2>
          <p className="text-gray-700 dark:text-[var(--dark-text)]">
            This tracker estimates global job losses that are publicly attributed to artificial intelligence,
            automation, and robotics. We monitor public reporting including news articles, press releases,
            earnings calls, and company announcements to identify workforce reductions where AI or automation
            is cited as a contributing factor.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-[var(--dark-text)]">What We Do Not Track</h2>
          <ul className="text-gray-700 dark:text-[var(--dark-text)] list-disc pl-5 space-y-1">
            <li>Job losses with no public reporting or announcement</li>
            <li>Natural attrition or unfilled positions</li>
            <li>Layoffs with no stated connection to AI or automation</li>
            <li>Speculative future predictions (only announced or completed events)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-[var(--dark-text)]">Attribution Model</h2>
          <p className="text-gray-700 dark:text-[var(--dark-text)]">
            Each event is classified by the strength of its connection to AI or automation:
          </p>
          <div className="mt-4 space-y-3">
            <div className="bg-white dark:bg-[var(--dark-card)] border border-gray-200 dark:border-[var(--dark-border)] rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="inline-block w-20 text-center px-2 py-1 bg-red-600 text-white text-xs font-semibold rounded">Explicit</span>
                <span className="text-gray-700 dark:text-[var(--dark-text)] text-sm">Company directly states AI caused or enabled job cuts</span>
              </div>
            </div>
            <div className="bg-white dark:bg-[var(--dark-card)] border border-gray-200 dark:border-[var(--dark-border)] rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="inline-block w-20 text-center px-2 py-1 bg-orange-500 text-white text-xs font-semibold rounded">Strong</span>
                <span className="text-gray-700 dark:text-[var(--dark-text)] text-sm">AI clearly cited as a major factor, even if mixed with other reasons</span>
              </div>
            </div>
            <div className="bg-white dark:bg-[var(--dark-card)] border border-gray-200 dark:border-[var(--dark-border)] rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="inline-block w-20 text-center px-2 py-1 bg-yellow-500 text-black text-xs font-semibold rounded">Moderate</span>
                <span className="text-gray-700 dark:text-[var(--dark-text)] text-sm">Evidence strongly suggests AI-driven efficiency, but not fully explicit</span>
              </div>
            </div>
            <div className="bg-white dark:bg-[var(--dark-card)] border border-gray-200 dark:border-[var(--dark-border)] rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="inline-block w-20 text-center px-2 py-1 bg-gray-400 text-white text-xs font-semibold rounded">Weak</span>
                <span className="text-gray-700 dark:text-[var(--dark-text)] text-sm">AI only loosely connected; minimal effect on totals</span>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-[var(--dark-text)]">Three Estimate Tiers</h2>
          <p className="text-gray-700 dark:text-[var(--dark-text)] mb-4">
            We present three estimates to reflect uncertainty:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-700 dark:text-[var(--dark-text)]">
              <thead>
                <tr className="border-b border-gray-300 dark:border-[var(--dark-border)]">
                  <th className="text-left py-2 text-gray-900 dark:text-[var(--dark-text)]">Category</th>
                  <th className="text-right py-2 text-gray-900 dark:text-[var(--dark-text)]">Conservative</th>
                  <th className="text-right py-2 text-gray-900 dark:text-[var(--dark-text)]">Core</th>
                  <th className="text-right py-2 text-gray-900 dark:text-[var(--dark-text)]">Upper Bound</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 dark:border-[var(--dark-border)]"><td className="py-2">Explicit</td><td className="text-right">100%</td><td className="text-right">100%</td><td className="text-right">100%</td></tr>
                <tr className="border-b border-gray-200 dark:border-[var(--dark-border)]"><td className="py-2">Strong</td><td className="text-right">0%</td><td className="text-right">75%</td><td className="text-right">100%</td></tr>
                <tr className="border-b border-gray-200 dark:border-[var(--dark-border)]"><td className="py-2">Moderate</td><td className="text-right">0%</td><td className="text-right">40%</td><td className="text-right">70%</td></tr>
                <tr className="border-b border-gray-200 dark:border-[var(--dark-border)]"><td className="py-2">Weak</td><td className="text-right">0%</td><td className="text-right">15%</td><td className="text-right">35%</td></tr>
                <tr><td className="py-2">Fringe</td><td className="text-right">0%</td><td className="text-right">5%</td><td className="text-right">15%</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-[var(--dark-text)]">Provisional vs Reviewed Data</h2>
          <p className="text-gray-700 dark:text-[var(--dark-text)]">
            Events enter the tracker as <strong>provisional</strong> when first detected by our automated pipeline.
            They are later upgraded to <strong>reviewed</strong> status after deeper analysis confirms or corrects
            the initial classification. Reviewed records override provisional values. Totals may be revised
            as better evidence is found.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-[var(--dark-text)]">Deduplication</h2>
          <p className="text-gray-700 dark:text-[var(--dark-text)]">
            Multiple news outlets often cover the same event. We group related articles into event clusters
            and count the underlying event only once, preferring the highest-quality source. Related article
            links are preserved for reference.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-[var(--dark-text)]">Copyright & Sources</h2>
          <p className="text-gray-700 dark:text-[var(--dark-text)]">
            We do not republish full articles. Each event entry includes a short summary generated from the source,
            along with a link back to the original publisher. Source links remain with original publishers.
            This site is informational and does not represent official government data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-[var(--dark-text)]">Corrections</h2>
          <p className="text-gray-700 dark:text-[var(--dark-text)]">
            If you believe an event has been misclassified, miscounted, or is missing, please contact us.
            We actively manage corrections and maintain revision history for transparency.
          </p>
        </section>
      </div>
    </div>
  )
}
