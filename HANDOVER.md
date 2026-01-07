# GetCitedBy (formerly LLMReady) - Session Handover Document

**Created**: December 21, 2025
**Purpose**: Complete handover documentation before project rename from LLMReady to GetCitedBy

---

## Project Overview

**Product Name**: GetCitedBy (renaming from LLMReady/CitedBy)
**Domain**: AI Search Optimization SaaS
**Target Market**: Swiss businesses (expandable globally)

### Core Value Proposition
Build an "Entity & Evidence Pack" so LLMs (ChatGPT, Perplexity, Claude, etc.) can safely cite and recommend your business. Makes businesses discoverable and accurately represented in AI-powered search.

### Key Features
1. **Entity Profile Builder** - Create canonical business identity with AI extraction
2. **Citation Manager** - Track NAP consistency across Swiss directories
3. **Schema Generator** - Generate JSON-LD structured data for websites
4. **LLM Visibility Tracker** - Check how AI models perceive/recommend the business

---

## Tech Stack

```
┌────────────────────────────────────────────────────────────────┐
│  FRONTEND        Next.js 14 (App Router) + TypeScript         │
│                  Tailwind CSS + shadcn/ui                      │
├────────────────────────────────────────────────────────────────┤
│  BACKEND         Next.js API Routes + Prisma ORM              │
│                  SQLite (file-based, zero config)              │
├────────────────────────────────────────────────────────────────┤
│  AUTH            NextAuth.js (email magic link via Resend)     │
├────────────────────────────────────────────────────────────────┤
│  DEPLOYMENT      Argonaut (130.162.144.114) - planned          │
│                  Docker + nginx + Let's Encrypt                │
├────────────────────────────────────────────────────────────────┤
│  EXTERNAL APIs   OpenAI, Anthropic (LLM visibility checks)     │
│                  Stripe (billing) - not yet implemented        │
│                  Zefix (Swiss company registry)                │
│                  Resend (transactional email)                  │
└────────────────────────────────────────────────────────────────┘
```

---

## Current Status

### Completed Phases

#### Phase 1: Infrastructure Setup [COMPLETE]
- [x] Prisma schema with SQLite
- [x] NextAuth.js with email provider (magic link)
- [x] Session management
- [x] Protected route middleware
- [x] Project structure with App Router

#### Phase 2: Core Entity Module [COMPLETE]
- [x] Business onboarding form (multi-step wizard)
- [x] Zefix UID lookup integration (Swiss company registry)
- [x] AI-powered entity extraction from websites
- [x] Entity normalization utilities

#### Phase 3: Dashboard & Overview [COMPLETE]
- [x] Dashboard layout with sidebar
- [x] Business list page with score cards
- [x] Business detail page with tabs

#### Phase 4: Citations Module [COMPLETE]
- [x] 13 Swiss citation sources seeded in database
- [x] Citations manager with status tracking
- [x] NAP consistency checker with scoring
- [x] Citation sources library

#### Phase 5: Schema Generator [COMPLETE]
- [x] Organization/LocalBusiness schema
- [x] Service schema for each offering
- [x] FAQPage schema
- [x] Person schema (key staff)
- [x] Copy-paste embed codes

#### Phase 6: LLM Visibility Tracker [COMPLETE]
- [x] OpenAI API integration
- [x] Anthropic API integration
- [x] Response analysis (mentioned, accuracy, sentiment)
- [x] Comprehensive check with multiple prompts

### Remaining Phases

#### Phase 7: Billing & Subscriptions [NOT STARTED]
- [ ] Stripe products & prices setup
- [ ] Checkout session creation
- [ ] Customer portal
- [ ] Webhook handling
- [ ] Plan enforcement & feature gating

#### Phase 8: Deployment [NOT STARTED]
- [ ] PostgreSQL container on Argonaut (switch from SQLite for production)
- [ ] Next.js Docker build
- [ ] nginx config for domain
- [ ] SSL via certbot
- [ ] Environment variables

---

## File Structure

```
C:\Projects\LLMReady\  (rename to C:\Projects\GetCitedBy\)
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx              # Magic link login
│   │   ├── register/page.tsx           # Registration
│   │   └── verify/page.tsx             # Email verification
│   ├── (dashboard)/
│   │   ├── layout.tsx                  # Dashboard shell with sidebar
│   │   ├── page.tsx                    # Dashboard home
│   │   ├── businesses/
│   │   │   ├── page.tsx                # List all businesses
│   │   │   ├── new/page.tsx            # Create business form
│   │   │   └── [id]/
│   │   │       └── page.tsx            # Business detail with tabs
│   │   └── settings/page.tsx           # User settings
│   ├── (marketing)/
│   │   ├── page.tsx                    # Landing page
│   │   └── pricing/page.tsx            # Pricing page
│   └── api/
│       ├── auth/[...nextauth]/route.ts # NextAuth handlers
│       ├── businesses/route.ts         # Business CRUD
│       ├── citations/route.ts          # Citations management
│       ├── schema/route.ts             # Schema generation
│       ├── llm/route.ts                # LLM visibility checks
│       └── zefix/route.ts              # Swiss company lookup
├── components/
│   ├── dashboard/
│   │   ├── DashboardLayout.tsx         # Main layout wrapper
│   │   ├── Sidebar.tsx                 # Navigation sidebar
│   │   └── Header.tsx                  # Top header
│   ├── forms/
│   │   └── BusinessForm.tsx            # Multi-step business intake
│   └── ui/                             # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── tabs.tsx
│       └── ... (other shadcn components)
├── lib/
│   ├── auth.ts                         # NextAuth configuration
│   ├── db.ts                           # Prisma client singleton
│   ├── zefix.ts                        # Swiss company registry API
│   ├── entity/
│   │   ├── extract.ts                  # AI-powered entity extraction
│   │   └── normalize.ts                # Entity normalization utilities
│   ├── citations/
│   │   ├── sources.ts                  # Citation source definitions
│   │   └── napChecker.ts               # NAP consistency scoring
│   ├── schema/
│   │   └── generators.ts               # JSON-LD schema generators
│   └── llm/
│       └── visibilityCheck.ts          # LLM visibility testing
├── prisma/
│   ├── schema.prisma                   # Database schema (SQLite)
│   ├── seed.ts                         # Seed script (13 Swiss sources)
│   └── dev.db                          # SQLite database file
├── middleware.ts                       # Route protection
├── .env                                # Environment variables
├── .env.example                        # Example env file
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## Database Schema

### Models Overview

| Model | Purpose |
|-------|---------|
| User | User accounts with billing info |
| Account | OAuth accounts (NextAuth) |
| Session | User sessions (NextAuth) |
| VerificationToken | Email verification (NextAuth) |
| Business | Core entity - business profiles |
| Citation | Directory listings per business |
| LlmCheck | LLM visibility check results |
| SchemaItem | Generated JSON-LD schemas |
| Subscription | Stripe subscription data |
| CitationSource | Reference data - Swiss directories |
| AuditLog | Activity tracking |

### Key Schema Details

```prisma
// SQLite-compatible schema (no enums, Json stored as String)

model Business {
  id     String @id @default(cuid())
  userId String

  // Core identity
  name         String
  nameVariants String?  // JSON: {"de": "...", "fr": "...", "it": "...", "en": "..."}
  uid          String?  // Swiss UID (CHE-xxx.xxx.xxx)

  // Location (Swiss-focused)
  addressStreet  String?
  addressCity    String?
  addressPostal  String?
  addressCanton  String?  // ZH, BE, GE, etc.
  addressCountry String   @default("CH")

  // Scores (0-100)
  visibilityScore Int @default(0)
  citationScore   Int @default(0)
  schemaScore     Int @default(0)
  overallScore    Int @default(0)

  // Status: DRAFT, ACTIVE, PAUSED, ARCHIVED (stored as String)
  status         String @default("DRAFT")
  onboardingStep Int    @default(1)
}

model CitationSource {
  slug     String @unique  // 'google_business', 'local_ch'
  name     String          // "Google Business Profile"
  category String          // MAJOR_PLATFORM, NATIONAL_DIRECTORY, etc.
  country  String @default("CH")
  priority Int    @default(3)  // 1 = highest
}
```

---

## Seeded Citation Sources (13 Swiss Sources)

| Slug | Name | Category | Priority |
|------|------|----------|----------|
| google_business | Google Business Profile | MAJOR_PLATFORM | 1 |
| apple_maps | Apple Business Connect | MAJOR_PLATFORM | 2 |
| bing_places | Bing Places | MAJOR_PLATFORM | 3 |
| local_ch | local.ch | NATIONAL_DIRECTORY | 1 |
| search_ch | search.ch | NATIONAL_DIRECTORY | 2 |
| directories_ch | directories.ch | NATIONAL_DIRECTORY | 3 |
| treuhand_suisse | Treuhand Suisse | INDUSTRY_SPECIFIC | 1 |
| sav_fsa | Swiss Bar Association | INDUSTRY_SPECIFIC | 1 |
| comparis | Comparis | INDUSTRY_SPECIFIC | 2 |
| yelp | Yelp | REVIEW_PLATFORM | 3 |
| tripadvisor | TripAdvisor | REVIEW_PLATFORM | 3 |
| facebook | Facebook Business | SOCIAL_PLATFORM | 2 |
| linkedin | LinkedIn Company Page | SOCIAL_PLATFORM | 2 |

---

## API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/*` | * | NextAuth handlers |
| `/api/businesses` | GET | List user's businesses |
| `/api/businesses` | POST | Create new business |
| `/api/businesses/[id]` | GET, PATCH, DELETE | Business CRUD |
| `/api/citations` | GET | Get citations for business |
| `/api/citations` | POST | Create/update citation |
| `/api/schema` | POST | Generate JSON-LD schemas |
| `/api/llm` | POST | Run LLM visibility check |
| `/api/zefix` | GET | Search Swiss company registry |

---

## Environment Variables

Current `.env` file:

```env
# Database (SQLite)
DATABASE_URL="file:./prisma/dev.db"

# NextAuth.js
NEXTAUTH_SECRET="llmready-dev-secret-change-in-production-abc123xyz"
NEXTAUTH_URL="http://localhost:3000"

# Email (Resend) - needs API key
RESEND_API_KEY=""
EMAIL_FROM="LLMReady <noreply@llmready.ch>"

# LLM APIs - needs API keys
OPENAI_API_KEY=""
ANTHROPIC_API_KEY=""

# Stripe (not implemented yet)
STRIPE_SECRET_KEY=""
STRIPE_PUBLISHABLE_KEY=""
STRIPE_WEBHOOK_SECRET=""

# Swiss APIs
ZEFIX_API_URL="https://www.zefix.ch/ZefixREST/api/v1"

# App Config
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="LLMReady"
```

### After Rename - Update These:
- `EMAIL_FROM` → `GetCitedBy <noreply@getcitedby.com>` (or your domain)
- `NEXT_PUBLIC_APP_NAME` → `GetCitedBy`
- `NEXT_PUBLIC_APP_URL` → Your production URL

---

## Key Implementation Details

### 1. Entity Extraction (lib/entity/extract.ts)
Uses OpenAI GPT-4o-mini to extract business information from websites:
- Business name and description
- Services offered
- Contact information
- Opening hours
- Key people

### 2. NAP Consistency Scoring (lib/citations/napChecker.ts)
Compares listings against canonical business data:
- Name matching (fuzzy)
- Address normalization for Swiss formats
- Phone number normalization (+41 format)
- Returns 0-100 score with specific issues

### 3. Schema Generators (lib/schema/generators.ts)
Generates Schema.org JSON-LD for:
- **Organization/LocalBusiness** - Core business identity
- **Service** - Individual service offerings
- **FAQPage** - Common questions
- **Person** - Key staff/founders

### 4. LLM Visibility Check (lib/llm/visibilityCheck.ts)
Tests how AI models perceive the business:
- Multiple prompt templates (recommendation, info, comparison)
- OpenAI and Anthropic integration
- Response analysis for mentions, accuracy, sentiment
- Overall visibility score calculation

### 5. Swiss Industry Mappings (lib/entity/normalize.ts)
```typescript
export const SWISS_INDUSTRIES = {
  treuhand: { en: 'Fiduciary', de: 'Treuhand', fr: 'Fiduciaire', it: 'Fiduciaria' },
  legal: { en: 'Legal Services', de: 'Rechtsberatung', fr: 'Services juridiques', it: 'Servizi legali' },
  // ... more industries
}
```

---

## Commands Reference

### Development
```bash
# Install dependencies
npm install

# Run database migrations
npx prisma migrate dev

# Seed the database
npm run db:seed

# Start dev server
npm run dev

# Generate Prisma client
npx prisma generate

# View database (Prisma Studio)
npx prisma studio
```

### After Rename Steps
```bash
# 1. Rename folder
# Windows: Rename C:\Projects\LLMReady to C:\Projects\GetCitedBy

# 2. Update package.json name field
# Change "name": "llmready" to "name": "getcitedby"

# 3. Update .env variables (see above)

# 4. Update any hardcoded "LLMReady" references:
#    - app/(marketing)/page.tsx (landing page)
#    - components (headers, footers)
#    - Email templates

# 5. Reinstall and run
cd C:\Projects\GetCitedBy
npm install
npm run dev
```

---

## Known Issues / Bugs Fixed

1. **Typo in normalize.ts**: Function was named `mapServicesToP primitives` (with space) - fixed to `mapServicesToPrimitives`

2. **Business form path mismatch**: Form was at `/dashboard/businesses/new` but links pointed to `/businesses/new` - created page at correct location

3. **PostgreSQL to SQLite migration**: Removed incompatible syntax:
   - `@db.Text` annotations removed
   - `Decimal` changed to `Float`
   - `Json` fields changed to `String` (JSON serialized)
   - Enums converted to String types
   - `String[]` arrays converted to JSON strings

---

## Next Steps After Rename

1. **Update branding**:
   - Change all "LLMReady" text to "GetCitedBy"
   - Update logo/favicon
   - Update email templates

2. **Add API keys to .env**:
   - `RESEND_API_KEY` - for magic link emails
   - `OPENAI_API_KEY` - for entity extraction & visibility checks
   - `ANTHROPIC_API_KEY` - for visibility checks

3. **Implement Stripe billing** (Phase 7):
   - Create Stripe products/prices
   - Checkout flow
   - Webhook handling

4. **Deploy to Argonaut** (Phase 8):
   - Set up PostgreSQL (for production)
   - Docker configuration
   - SSL certificate

---

## Plan File Reference

Full implementation plan is at: `C:\Users\micro\.claude\plans\harmonic-floating-cat.md`

This contains the complete phase breakdown and detailed specifications.

---

## Session Summary

**What was accomplished in this session:**
1. Reviewed existing Phase 1 infrastructure
2. Completed Phase 2-6 implementations
3. Migrated from PostgreSQL to SQLite for simplicity
4. Fixed bugs (typos, path mismatches)
5. Ran all setup commands (npm install, migrate, seed)
6. Verified dev server running at localhost:3000
7. Created this handover document

**Dev server status**: Running at http://localhost:3000
- `/login` - Working (200)
- `/businesses` - Protected, redirects to login (307)
- `/businesses/new` - Protected, redirects to login (307)

---

*Document created: December 21, 2025*
*For project rename: LLMReady → GetCitedBy*
