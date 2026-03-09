export interface WeightProfile {
  name: string
  explicit: number
  strong: number
  moderate: number
  weak: number
  fringe: number
}

export const weightProfiles: Record<string, WeightProfile> = {
  conservative: {
    name: 'Conservative',
    explicit: 1.0,
    strong: 0,
    moderate: 0,
    weak: 0,
    fringe: 0,
  },
  core: {
    name: 'Core Estimate',
    explicit: 1.0,
    strong: 0.75,
    moderate: 0.40,
    weak: 0.15,
    fringe: 0.05,
  },
  upper: {
    name: 'Upper Bound',
    explicit: 1.0,
    strong: 1.0,
    moderate: 0.70,
    weak: 0.35,
    fringe: 0.15,
  },
}

export function calculateWeightedJobs(
  totalAnnounced: number,
  category: string,
  profile: WeightProfile
): number {
  const categoryKey = category.toLowerCase() as keyof Omit<WeightProfile, 'name'>
  const weight = profile[categoryKey] ?? 0
  return Math.round(totalAnnounced * weight)
}
