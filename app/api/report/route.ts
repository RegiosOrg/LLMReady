/**
 * PDF Report Generator API
 * Generates audit reports in PDF format
 */

import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { AuditReportDocument } from '@/lib/pdf/auditReport'
import React from 'react'

interface ReportRequest {
  businessName: string
  city: string
  industry: string
  overallScore: number
  mentionedIn: string
  results: {
    provider: string
    prompt: string
    response: string
    mentioned: boolean
    score: number
  }[]
  recommendations: string[]
  timestamp: string
}

export async function POST(req: NextRequest) {
  try {
    const body: ReportRequest = await req.json()

    const {
      businessName,
      city,
      industry,
      overallScore,
      mentionedIn,
      results,
      recommendations,
      timestamp,
    } = body

    // Validate required fields
    if (!businessName || !city || !results) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate PDF
    const element = React.createElement(AuditReportDocument, {
      businessName,
      city,
      industry: industry || 'Business',
      overallScore: overallScore || 0,
      mentionedIn: mentionedIn || '0/0',
      results: results || [],
      recommendations: recommendations || [],
      timestamp: timestamp || new Date().toISOString(),
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfBuffer = await renderToBuffer(element as any)

    // Return PDF as response
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="audit-report-${businessName.replace(/\s+/g, '-').toLowerCase()}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF report' },
      { status: 500 }
    )
  }
}
