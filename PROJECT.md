# LLMReady - AI Search Optimization for Local Businesses

> **One-liner:** Turn your business into an entity that AI assistants can find, trust, and recommend.

## The Problem

When customers ask ChatGPT, Perplexity, or Google AI "Who's the best Treuhänder in Zürich?", your business needs to appear. But LLMs don't crawl like Google - they need:

- **Consistent entity data** across trusted sources
- **Structured markup** they can parse
- **Authoritative citations** they can verify
- **Clear, unambiguous pages** about what you do and where

Traditional SEO (blog spam, backlinks, keyword stuffing) doesn't help. LLMs want **facts they can cite**.

---

## The Solution: LLMReady

A productized SaaS + service that builds your business's "AI Presence":

```
┌─────────────────────────────────────────────────────────────────┐
│                    LLMReady SYSTEM                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. ENTITY LAYER (Who are you?)                                  │
│     - Canonical business name, address, phone                    │
│     - Services you offer (mapped to intents)                     │
│     - Key people, credentials, certifications                    │
│                                                                  │
│  2. EVIDENCE LAYER (Why should AI trust you?)                    │
│     - Citations across authoritative directories                 │
│     - NAP consistency across all listings                        │
│     - Press mentions, association memberships                    │
│                                                                  │
│  3. MACHINE LAYER (Can AI read your site?)                       │
│     - Schema.org structured data                                 │
│     - AI-friendly page structure                                 │
│     - FAQ banks matching conversational queries                  │
│                                                                  │
│  4. MONITORING LAYER (Are you showing up?)                       │
│     - Track LLM mentions of your brand                           │
│     - Alert on citation drift or conflicts                       │
│     - Monthly "AI Visibility Score"                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Target Market

### Primary ICP: Swiss Local Businesses

- GmbH/AG service businesses
- Treuhand, Notar, Anwalt, Zahnarzt, Physiotherapie
- Handwerker, clinics, consultants
- Already spend on marketing but have fragmented online presence

### Why Swiss First?

- High-value services (can afford premium pricing)
- Multilingual complexity (DE/FR/IT/EN) creates a moat
- Trust-focused culture matches "accuracy" positioning
- Less saturated than US/UK markets

### Global Expansion

Same framework works anywhere - only citation sources change per country.

---

## Product Modules

### Module 1: Entity Graph Builder

**What it does:**
- Intake form + document upload (Handelsregister, website, etc.)
- Extracts and normalizes business identity
- Maps services to search intents
- Outputs canonical "Entity Profile"

**Automation potential:** 80%
- OCR for documents
- AI extraction of services from website
- Automatic Handelsregister lookup (UID → company data)

### Module 2: Citations Manager

**What it does:**
- Checklist of citation sources per country/industry
- Guided submission workflows
- NAP consistency scoring
- Duplicate detection and cleanup alerts

**Swiss citation sources:**
- Handelsregister (official)
- local.ch
- search.ch
- Google Business Profile
- Apple Business Connect
- Bing Places
- Industry associations (Treuhand Suisse, etc.)
- Yelp, TripAdvisor (where relevant)
- Vertical directories (Comparis, etc.)

**Automation potential:** 60%
- Some directories have APIs
- Others need guided manual submission
- Duplicate detection is fully automatable

### Module 3: Schema Generator

**What it does:**
- Generates JSON-LD blocks for:
  - Organization / LocalBusiness
  - Service (for each offering)
  - FAQPage
  - Person (key staff)
  - Review (aggregated)
- Produces "AI-friendly" page structure recommendations
- Optional: generates page drafts in DE/FR/IT/EN

**Automation potential:** 95%
- Template-based generation from Entity Profile
- AI can write page drafts

### Module 4: LLM Visibility Tracker

**What it does:**
- Runs periodic prompts against ChatGPT, Claude, Perplexity
- Checks if business appears in answers
- Compares AI answers to ground truth
- Scores accuracy and frequency of mentions

**Example prompts to monitor:**
- "Best [service] in [city]"
- "Who is [company name]?"
- "[Company name] reviews"
- "How much does [service] cost in [city]?"

**Automation potential:** 90%
- API calls to LLM providers
- Semantic comparison for accuracy
- Alerting on significant changes

### Module 5: Content Generator (Optional Add-on)

**What it does:**
- "Answer-first" pages for common questions
- Case studies / proof pages
- Service explanation pages
- FAQ banks

**Automation potential:** 70%
- AI generates drafts
- Human review for accuracy (especially for regulated industries)

---

## Pricing Tiers

### Starter - CHF 149/month
- Entity Profile setup
- 20 citations audit + guidance
- Basic schema generation
- Monthly visibility check (1 keyword set)

### Growth - CHF 299/month
- Everything in Starter
- 50 citations with submission tracking
- Full schema for all services
- Weekly visibility monitoring
- Citation drift alerts
- Quarterly optimization recommendations

### Pro - CHF 599/month
- Everything in Growth
- Done-for-you citation submissions
- AI-generated content drafts
- Daily visibility monitoring
- Priority support
- Multilingual support (DE/FR/IT/EN)

### Enterprise - Custom
- Multi-location businesses
- White-label for agencies
- API access
- Custom integrations

---

## Technical Requirements

### Core Features for MVP

1. **Onboarding Flow**
   - Business intake form
   - Website URL analysis
   - Handelsregister UID lookup
   - Entity Profile generation

2. **Dashboard**
   - AI Visibility Score
   - Citation health status
   - Schema implementation status
   - Recent LLM mentions

3. **Citations Module**
   - Directory checklist
   - NAP consistency checker
   - Submission status tracking
   - Duplicate alerts

4. **Schema Generator**
   - JSON-LD output
   - Copy-paste snippets
   - WordPress/Webflow integration guides

5. **LLM Monitor**
   - Prompt-based checking
   - Answer accuracy scoring
   - Historical tracking
   - Email alerts

### Integrations Needed

- OpenAI API (GPT-4 for visibility checks)
- Anthropic API (Claude for visibility checks)
- Perplexity API (if available)
- Google Business Profile API
- Zefix/UID API (Swiss company registry)
- Stripe (payments)

---

## Competitive Landscape

### Direct Competitors

| Competitor | Focus | Gap |
|------------|-------|-----|
| BrightLocal | Traditional local SEO | No LLM monitoring |
| Yext | Enterprise listings | Too expensive for SMBs |
| Moz Local | Citation management | US-focused, no AI |
| Semrush Local | Traditional SEO | No LLM optimization |

### Our Differentiation

1. **LLM-first** - Built specifically for AI search, not adapted from SEO
2. **Swiss-focused** - Understands multilingual, high-trust market
3. **Affordable** - SMB pricing, not enterprise
4. **Automated** - Minimal manual work required
5. **Outcome-focused** - "Show up in ChatGPT" not "here's a report"

---

## Go-to-Market

### Phase 1: Swiss Launch (Months 1-3)

- Target: Treuhand, Notar, Anwalt in Zürich
- Channel: Direct outreach, LinkedIn
- Offer: Free AI Visibility Audit
- Goal: 20 paying customers

### Phase 2: Swiss Expansion (Months 4-6)

- Target: Healthcare, Handwerker, broader services
- Channel: Partnerships with web agencies
- Goal: 100 paying customers

### Phase 3: DACH Expansion (Months 7-12)

- Target: Germany, Austria (same industries)
- Adapt citation sources for DE/AT
- Goal: 500 paying customers

---

## Success Metrics

### For Customers
- AI Visibility Score improvement
- Mentions in LLM responses
- Citation consistency score
- Leads attributed to AI discovery

### For Business
- MRR growth
- Churn rate
- Customer acquisition cost
- Time to first value

---

## Roadmap

### MVP (Month 1-2)
- [ ] Entity intake form
- [ ] Basic dashboard
- [ ] Swiss citations checklist
- [ ] Schema generator
- [ ] Manual LLM visibility check

### V1.0 (Month 3-4)
- [ ] Automated LLM monitoring
- [ ] NAP consistency checker
- [ ] Citation status tracking
- [ ] Stripe billing

### V1.5 (Month 5-6)
- [ ] AI content generator
- [ ] Multi-language support
- [ ] API integrations
- [ ] White-label option

---

## Open Questions

1. **Domain name?** llmready.ch / aiready.ch / entityrank.ch?
2. **Hosting?** Yamato (SEO server) or new infrastructure?
3. **Tech stack?** Laravel vs Next.js vs other?
4. **Start with service or SaaS?** Manual first to validate?
