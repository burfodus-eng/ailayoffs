import { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { formatNumberFull } from '@/lib/utils'

export const metadata: Metadata = { title: 'AI Jobs Created' }
export const dynamic = 'force-dynamic'

export default async function JobsCreatedPage() {
  const stats = await prisma.event.aggregate({
    where: { eventType: 'AI_JOB_CREATED', reviewStatus: { not: 'EXCLUDED' }, supersededByEventId: null },
    _sum: { conservativeAiJobs: true, weightedAiJobs: true, upperAiJobs: true },
    _count: true,
  })

  const events = await prisma.event.findMany({
    where: { eventType: 'AI_JOB_CREATED', reviewStatus: { not: 'EXCLUDED' }, supersededByEventId: null },
    orderBy: { dateAnnounced: 'desc' },
    take: 50,
  })

  const total = stats._sum.weightedAiJobs || 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">AI Jobs Created</h1>
      <p className="text-gray-400 mb-8">Tracking new jobs, roles, and opportunities created by AI adoption.</p>

      <div className="bg-gradient-to-b from-green-950/30 to-transparent rounded-xl p-8 text-center mb-12">
        {total > 0 ? (
          <>
            <p className="text-green-400/70 text-sm uppercase tracking-widest mb-2">Estimated AI-Created Jobs</p>
            <div className="text-5xl font-black text-green-400 tabular-nums">{formatNumberFull(total)}</div>
            <div className="flex items-center justify-center gap-8 mt-4 text-sm">
              <div><span className="text-gray-500 text-xs">Conservative: </span><span className="text-gray-300">{formatNumberFull(stats._sum.conservativeAiJobs || 0)}</span></div>
              <div><span className="text-gray-500 text-xs">Upper: </span><span className="text-gray-300">{formatNumberFull(stats._sum.upperAiJobs || 0)}</span></div>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 text-lg">No data yet</p>
            <p className="text-gray-600 text-sm mt-2">AI job creation events will appear here as they are discovered.</p>
          </>
        )}
      </div>

      {events.length > 0 ? (
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 flex items-center justify-between">
              <div>
                <span className="text-white font-medium">{event.companyName || 'Unknown'}</span>
                {event.country && <span className="text-gray-500 text-sm ml-2">{event.country}</span>}
                {event.publicSummary && <p className="text-gray-400 text-sm mt-1">{event.publicSummary}</p>}
              </div>
              <div className="text-green-400 font-bold tabular-nums">{event.weightedAiJobs.toLocaleString()}</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 text-sm">No events tracked yet.</p>
      )}
    </div>
  )
}
