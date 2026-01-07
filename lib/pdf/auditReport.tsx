import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer'

// Register fonts (optional - uses built-in fonts by default)
// Font.register({
//   family: 'Inter',
//   src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2',
// })

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#0f172a',
    padding: 40,
    fontFamily: 'Helvetica',
    color: '#e2e8f0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBox: {
    width: 40,
    height: 40,
    backgroundColor: '#6366f1',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  date: {
    fontSize: 10,
    color: '#94a3b8',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 30,
  },
  scoreSection: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 30,
    marginBottom: 30,
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 64,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  scoreGood: {
    color: '#22c55e',
  },
  scoreMedium: {
    color: '#eab308',
  },
  scorePoor: {
    color: '#ef4444',
  },
  scoreMax: {
    fontSize: 14,
    color: '#64748b',
  },
  businessInfo: {
    fontSize: 16,
    color: '#ffffff',
    marginTop: 12,
    fontWeight: 'bold',
  },
  mentionedText: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  resultCard: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultProvider: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#e2e8f0',
  },
  resultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 'bold',
  },
  badgeMentioned: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    color: '#22c55e',
  },
  badgeNotFound: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    color: '#ef4444',
  },
  resultPrompt: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 8,
  },
  resultResponse: {
    fontSize: 10,
    color: '#94a3b8',
    lineHeight: 1.5,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingLeft: 8,
  },
  recommendationNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    color: '#818cf8',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
  },
  recommendationText: {
    flex: 1,
    fontSize: 11,
    color: '#e2e8f0',
    lineHeight: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  footerText: {
    fontSize: 9,
    color: '#64748b',
  },
  footerUrl: {
    fontSize: 9,
    color: '#818cf8',
    fontWeight: 'bold',
  },
  ctaSection: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 8,
    padding: 20,
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  ctaTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  ctaText: {
    fontSize: 10,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 12,
  },
  ctaUrl: {
    fontSize: 12,
    color: '#818cf8',
    fontWeight: 'bold',
  },
})

interface AuditResult {
  provider: string
  prompt: string
  response: string
  mentioned: boolean
  score: number
}

interface AuditReportProps {
  businessName: string
  city: string
  industry: string
  overallScore: number
  mentionedIn: string
  results: AuditResult[]
  recommendations: string[]
  timestamp: string
}

const getScoreStyle = (score: number) => {
  if (score >= 70) return styles.scoreGood
  if (score >= 40) return styles.scoreMedium
  return styles.scorePoor
}

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const AuditReportDocument = ({
  businessName,
  city,
  industry,
  overallScore,
  mentionedIn,
  results,
  recommendations,
  timestamp,
}: AuditReportProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logo}>
          <View style={styles.logoBox}>
            <Text style={{ color: '#ffffff', fontSize: 20 }}>G</Text>
          </View>
          <Text style={styles.logoText}>GetCitedBy</Text>
        </View>
        <Text style={styles.date}>
          Generated: {new Date(timestamp).toLocaleDateString('de-CH')}
        </Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>AI Visibility Audit Report</Text>
      <Text style={styles.subtitle}>
        Analyzing how AI assistants perceive your business
      </Text>

      {/* Score Section */}
      <View style={styles.scoreSection}>
        <Text style={styles.scoreLabel}>AI Visibility Score</Text>
        <Text style={[styles.scoreValue, getScoreStyle(overallScore)]}>
          {overallScore}
        </Text>
        <Text style={styles.scoreMax}>out of 100</Text>
        <Text style={styles.businessInfo}>
          {businessName} - {city}
        </Text>
        <Text style={styles.mentionedText}>
          Mentioned in {mentionedIn} AI checks
        </Text>
      </View>

      {/* Check Results */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Check Results</Text>
        {results.map((result, index) => (
          <View key={index} style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultProvider}>{result.provider}</Text>
              <View
                style={[
                  styles.resultBadge,
                  result.mentioned ? styles.badgeMentioned : styles.badgeNotFound,
                ]}
              >
                <Text>{result.mentioned ? 'MENTIONED' : 'NOT FOUND'}</Text>
              </View>
            </View>
            <Text style={styles.resultPrompt}>
              Prompt: "{truncateText(result.prompt, 80)}"
            </Text>
            <Text style={styles.resultResponse}>
              {truncateText(result.response, 300)}
            </Text>
          </View>
        ))}
      </View>

      {/* Recommendations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommendations</Text>
        {recommendations.map((rec, index) => (
          <View key={index} style={styles.recommendationItem}>
            <Text style={styles.recommendationNumber}>{index + 1}</Text>
            <Text style={styles.recommendationText}>{rec}</Text>
          </View>
        ))}
      </View>

      {/* CTA */}
      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>Want to Improve Your Score?</Text>
        <Text style={styles.ctaText}>
          GetCitedBy monitors your AI visibility and helps you get recommended by ChatGPT, Claude, and other AI assistants.
        </Text>
        <Text style={styles.ctaUrl}>https://getcitedby.com</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          AI Visibility Platform for Swiss Businesses
        </Text>
        <Text style={styles.footerUrl}>getcitedby.com</Text>
      </View>
    </Page>
  </Document>
)

export default AuditReportDocument
