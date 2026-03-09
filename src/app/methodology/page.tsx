import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Methodology' }

export default function MethodologyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Methodology</h1>

      <div className="prose prose-invert prose-sm max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-white">What We Track</h2>
          <p className="text-gray-300">
            This tracker estimates global job losses that are publicly attributed to artificial intelligence,
            automation, and robotics. We monitor public reporting including news articles, press releases,
            earnings calls, and company announcements to identify workforce reductions where AI or automation
            is cited as a contributing factor.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">What We Do Not Track</h2>
          <ul className="text-gray-300 list-disc pl-5 space-y-1">
            <li>Job losses with no public reporting or announcement</li>
            <li>Natural attrition or unfilled positions</li>
            <li>Layoffs with no stated connection to AI or automation</li>
            <li>Speculative future predictions (only announced or completed events)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">Attribution Model</h2>
          <p className="text-gray-300">
            Each event is classified by the strength of its connection to AI or automation:
          </p>
          <div className="mt-4 space-y-3">
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <span className="inline-block w-20 text-center px-2 py-1 bg-red-600 text-white text-xs font-semibold rounded">Explicit</span>
                <span className="text-gray-300 text-sm">Company directly states AI caused or enabled job cuts</span>
              </div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <span className="inline-block w-20 text-center px-2 py-1 bg-orange-500 text-white text-xs font-semibold rounded">Strong</span>
                <span className="text-gray-300 text-sm">AI clearly cited as a major factor, even if mixed with other reasons</span>
              </div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <span className="inline-block w-20 text-center px-2 py-1 bg-yellow-500 text-black text-xs font-semibold rounded">Moderate</span>
                <span className="text-gray-300 text-sm">Evidence strongly suggests AI-driven efficiency, but not fully explicit</span>
              </div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <span className="inline-block w-20 text-center px-2 py-1 bg-gray-400 text-white text-xs font-semibold rounded">Weak</span>
                <span className="text-gray-300 text-sm">AI only loosely connected; minimal effect on totals</span>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">Three Estimate Tiers</h2>
          <p className="text-gray-300 mb-4">
            We present three estimates to reflect uncertainty:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-300">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-2 text-white">Category</th>
                  <th className="text-right py-2 text-white">Conservative</th>
                  <th className="text-right py-2 text-white">Core</th>
                  <th className="text-right py-2 text-white">Upper Bound</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-800"><td className="py-2">Explicit</td><td className="text-right">100%</td><td className="text-right">100%</td><td className="text-right">100%</td></tr>
                <tr className="border-b border-slate-800"><td className="py-2">Strong</td><td className="text-right">0%</td><td className="text-right">75%</td><td className="text-right">100%</td></tr>
                <tr className="border-b border-slate-800"><td className="py-2">Moderate</td><td className="text-right">0%</td><td className="text-right">40%</td><td className="text-right">70%</td></tr>
                <tr className="border-b border-slate-800"><td className="py-2">Weak</td><td className="text-right">0%</td><td className="text-right">15%</td><td className="text-right">35%</td></tr>
                <tr><td className="py-2">Fringe</td><td className="text-right">0%</td><td className="text-right">5%</td><td className="text-right">15%</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">Provisional vs Reviewed Data</h2>
          <p className="text-gray-300">
            Events enter the tracker as <strong>provisional</strong> when first detected by our automated pipeline.
            They are later upgraded to <strong>reviewed</strong> status after deeper analysis confirms or corrects
            the initial classification. Reviewed records override provisional values. Totals may be revised
            as better evidence is found.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">Deduplication</h2>
          <p className="text-gray-300">
            Multiple news outlets often cover the same event. We group related articles into event clusters
            and count the underlying event only once, preferring the highest-quality source. Related article
            links are preserved for reference.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">Copyright & Sources</h2>
          <p className="text-gray-300">
            We do not republish full articles. Each event entry includes a short summary generated from the source,
            along with a link back to the original publisher. Source links remain with original publishers.
            This site is informational and does not represent official government data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">Corrections</h2>
          <p className="text-gray-300">
            If you believe an event has been misclassified, miscounted, or is missing, please contact us.
            We actively manage corrections and maintain revision history for transparency.
          </p>
        </section>
      </div>
    </div>
  )
}
