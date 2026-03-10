import { PrismaClient } from '../src/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter } as any)

// Add cover images to existing articles that don't have them
const coverImages: Record<string, string> = {
  // ailayoffs
  '2023-ai-layoffs-year-in-review': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=600&fit=crop',
  '2024-h1-ai-layoffs-digest': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=600&fit=crop',
  '2024-h2-ai-layoffs-digest': 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=600&fit=crop',
  'january-2025-digest': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop',
  'february-2025-digest': 'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=1200&h=600&fit=crop',
  'march-2025-digest': 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&h=600&fit=crop',
  // aicuts
  '2023-2024-ai-cuts-roundup': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=600&fit=crop',
  'jan-2025-weekly-roundup-w4': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop',
  'feb-2025-weekly-roundup-w4': 'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=1200&h=600&fit=crop',
  'mar-2025-weekly-roundup-w1': 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&h=600&fit=crop',
  // ailayoffwatch
  '2023-2024-research-analysis': 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=600&fit=crop',
  'jan-2025-research-summary': 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&h=600&fit=crop',
  'feb-mar-2025-research-summary': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=600&fit=crop',
  // robotlayoffs
  '2023-2024-automation-report': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&h=600&fit=crop',
  'q1-2025-automation-report': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=600&fit=crop',
}

async function main() {
  let updated = 0

  for (const [slug, imageUrl] of Object.entries(coverImages)) {
    // Find article by slug (could be any brand)
    const article = await prisma.brandArticle.findFirst({ where: { slug } })
    if (!article) {
      console.log(`SKIP (not found): ${slug}`)
      continue
    }
    if (article.coverImageUrl) {
      console.log(`SKIP (has image): ${slug}`)
      continue
    }

    await prisma.brandArticle.update({
      where: { id: article.id },
      data: { coverImageUrl: imageUrl },
    })
    console.log(`UPDATED image: [${article.brand}] ${slug}`)
    updated++
  }

  console.log(`\nDone. Updated ${updated} articles with cover images.`)
  await prisma.$disconnect()
  await pool.end()
}

main().catch(console.error)
