import { db } from '@/lib/db'
import { PLANS, PlanKey } from '@/lib/stripe'

export interface UserLimits {
  plan: PlanKey
  planName: string
  maxBusinesses: number
  maxCitationsPerBusiness: number
  maxLlmChecksPerMonth: number
  businessesUsed: number
  llmChecksUsed: number
  canAddBusiness: boolean
  canRunLlmCheck: boolean
}

export async function getUserLimits(userId: string): Promise<UserLimits> {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      subscription: true,
      businesses: {
        select: { id: true },
      },
    },
  })

  if (!user) {
    throw new Error('User not found')
  }

  const plan = (user.plan as PlanKey) || 'FREE'
  const planConfig = PLANS[plan]

  // Count LLM checks this month
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const llmChecksThisMonth = await db.llmCheck.count({
    where: {
      business: {
        userId,
      },
      createdAt: {
        gte: startOfMonth,
      },
    },
  })

  const businessesUsed = user.businesses.length
  const maxBusinesses = planConfig.maxBusinesses
  const maxLlmChecks = planConfig.maxLlmChecksPerMonth

  return {
    plan,
    planName: planConfig.name,
    maxBusinesses,
    maxCitationsPerBusiness: planConfig.maxCitationsPerBusiness,
    maxLlmChecksPerMonth: maxLlmChecks,
    businessesUsed,
    llmChecksUsed: llmChecksThisMonth,
    canAddBusiness: maxBusinesses === -1 || businessesUsed < maxBusinesses,
    canRunLlmCheck: maxLlmChecks === -1 || llmChecksThisMonth < maxLlmChecks,
  }
}

export async function checkPlanLimit(
  userId: string,
  limitType: 'business' | 'llmCheck'
): Promise<{ allowed: boolean; message?: string }> {
  const limits = await getUserLimits(userId)

  if (limitType === 'business') {
    if (!limits.canAddBusiness) {
      return {
        allowed: false,
        message: `You've reached the maximum of ${limits.maxBusinesses} businesses on the ${limits.planName} plan. Upgrade to add more.`,
      }
    }
  }

  if (limitType === 'llmCheck') {
    if (!limits.canRunLlmCheck) {
      return {
        allowed: false,
        message: `You've used all ${limits.maxLlmChecksPerMonth} LLM checks this month on the ${limits.planName} plan. Upgrade for more checks.`,
      }
    }
  }

  return { allowed: true }
}

export function isPlanFeatureEnabled(plan: PlanKey, feature: string): boolean {
  const planConfig = PLANS[plan]

  // Feature flags based on plan
  const featureMatrix: Record<string, PlanKey[]> = {
    'api-access': ['BUSINESS', 'ENTERPRISE'],
    'white-label': ['BUSINESS', 'ENTERPRISE'],
    'priority-support': ['BUSINESS', 'ENTERPRISE'],
    'email-alerts': ['PROFESSIONAL', 'BUSINESS', 'ENTERPRISE'],
    'nap-monitoring': ['PROFESSIONAL', 'BUSINESS', 'ENTERPRISE'],
    'advanced-schema': ['PROFESSIONAL', 'BUSINESS', 'ENTERPRISE'],
    'all-citations': ['PROFESSIONAL', 'BUSINESS', 'ENTERPRISE'],
  }

  const enabledPlans = featureMatrix[feature]
  if (!enabledPlans) return true // Unknown features are enabled by default

  return enabledPlans.includes(plan)
}
