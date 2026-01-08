/**
 * Benchmark API - Get industry competitive data
 *
 * Returns benchmark data for competitive positioning
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  getIndustryBenchmark,
  getCompetitivePosition,
  INDUSTRY_BENCHMARKS,
  OVERALL_STATS
} from '@/lib/benchmarks/industryData'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const industry = searchParams.get('industry')
  const score = searchParams.get('score')

  // If no industry specified, return all industries summary
  if (!industry) {
    const summary = Object.entries(INDUSTRY_BENCHMARKS).map(([key, data]) => ({
      id: key,
      name: data.industryDE,
      avgScore: data.avgScore,
      medianScore: data.medianScore,
      topPerformerScore: data.topPerformers[0]?.score || 0,
      invisiblePercent: data.distribution.invisible + data.distribution.poor
    }))

    return NextResponse.json({
      industries: summary,
      overall: OVERALL_STATS
    })
  }

  // Get specific industry benchmark
  const benchmark = getIndustryBenchmark(industry)

  if (!benchmark) {
    return NextResponse.json(
      { error: 'Industry not found', availableIndustries: Object.keys(INDUSTRY_BENCHMARKS) },
      { status: 404 }
    )
  }

  // If score provided, include competitive position
  let competitivePosition = null
  if (score) {
    const scoreNum = parseInt(score)
    if (!isNaN(scoreNum)) {
      competitivePosition = getCompetitivePosition(scoreNum, industry)
    }
  }

  return NextResponse.json({
    industry: benchmark.industry,
    industryDE: benchmark.industryDE,
    avgScore: benchmark.avgScore,
    medianScore: benchmark.medianScore,
    topPerformers: benchmark.topPerformers,
    distribution: benchmark.distribution,
    insight: benchmark.insight,
    competitivePosition
  })
}
