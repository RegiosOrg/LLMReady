# GetCitedBy - Session Summary

## Project Rename
- **Old Name**: LLMReady
- **New Name**: GetCitedBy
- **Domain**: getcitedby.com (to be registered - add funds to Namecheap first)

## Manual Steps After This Session

1. **Close this Claude Code session**

2. **Rename the folder**:
   ```powershell
   cd C:\Projects
   Rename-Item LLMReady GetCitedBy
   ```

3. **Register the domain** at https://www.namecheap.com:
   - Search for `getcitedby.com`
   - Add funds to account first
   - Register for 1 year (~$10-13)

4. **Update Windows Terminal profile** (after folder rename):
   ```powershell
   # Update the profile in Windows Terminal settings
   # Change startingDirectory from LLMReady to GetCitedBy
   ```

5. **Update desktop shortcut**:
   - Right-click LLMReady.lnk on desktop
   - Update target path and working directory to GetCitedBy

---

## What Was Built This Session

### Phase 1: Infrastructure (COMPLETE)

#### Database Schema (`prisma/schema.prisma`)
- **User**: Auth with NextAuth, linked to businesses
- **Business**: Core entity with scores, NAP data, services
- **Citation**: Directory listings with NAP match tracking
- **LlmCheck**: AI visibility check results
- **SchemaItem**: JSON-LD schema markup items
- **Subscription**: Billing tiers (FREE/STARTER/PRO/AGENCY)
- **CitationSource**: Swiss directory sources database
- **AuditLog**: Activity tracking

#### Authentication (`lib/auth.ts`)
- NextAuth.js with magic link (email) authentication
- Configured for Resend email provider
- JWT session strategy
- Auto-creates FREE subscription on signup

#### Middleware (`middleware.ts`)
- Route protection for dashboard routes
- Public routes: /, /login, /register, /verify, /api/auth/*

#### UI Components (`components/ui/`)
- Button, Input, Label, Card, Badge, Progress, Avatar, Separator
- Following shadcn/ui patterns with CVA

#### Dashboard Layout (`app/(dashboard)/`)
- Sidebar navigation with main nav, tools section, secondary nav
- Header with user menu
- Responsive layout

#### Auth Pages (`app/(auth)/`)
- `/login` - Magic link login
- `/register` - New user registration
- `/verify` - Email verification pending page

### Phase 2: Core Entity Module (COMPLETE)

#### Zefix API Client (`lib/zefix.ts`)
- Swiss company registry integration
- Search by name, UID lookup
- UID validation and formatting
- Canton list with codes

#### API Route (`app/api/zefix/route.ts`)
- GET endpoint for searching Swiss companies
- Returns company data for form auto-fill

#### Entity Extraction (`lib/entity/extract.ts`)
- AI-powered extraction from website URLs
- Uses OpenAI GPT-4o-mini
- Extracts: name, address, phone, services, hours, social profiles
- Confidence scoring

#### Entity Normalization (`lib/entity/normalize.ts`)
- Phone number formatting (Swiss +41 format)
- Website URL normalization
- NAP consistency scoring (Dice coefficient)
- Industry-specific service primitives mapping
- 12 Swiss industries with search intents:
  - treuhand, legal, notary, healthcare, real_estate
  - hospitality, retail, it_services, construction
  - insurance, finance, consulting

### Phase 3: Business Management (COMPLETE)

#### Business Form (`components/forms/BusinessForm.tsx`)
- Multi-step wizard (4 steps)
- Step 1: Basic Info (name, UID, industry, website)
- Step 2: Location (address, canton)
- Step 3: Contact (phone, email)
- Step 4: Services (tag-based with suggestions)

#### Business API (`app/api/businesses/`)
- `route.ts`: GET (list), POST (create)
- `[id]/route.ts`: GET (detail), PATCH (update), DELETE

#### Businesses List Page (`app/(dashboard)/businesses/page.tsx`)
- Cards with scores (visibility, citations, schema)
- Status badges
- Empty state for new users

#### Business Detail Page (`app/(dashboard)/businesses/[id]/page.tsx`)
- Tabbed interface: Overview, Citations, Schema, Visibility
- Score cards with progress bars
- Recent activity feed
- Contact information display

### Phase 4: Citations Module (COMPLETE)

#### Citation Sources (`lib/citations/sources.ts`)
- 20+ Swiss citation sources defined:
  - Major platforms: Google Business, Apple Maps, Bing Places
  - Swiss directories: local.ch, search.ch, directories.ch, Zefix
  - Industry-specific: Treuhand Suisse, EXPERTsuisse, SAV-FSA, doctorfmh
  - Review platforms: Yelp, TripAdvisor, Trustpilot
  - Social: Facebook, LinkedIn, Instagram
- Category, priority, NAP field support metadata

#### NAP Checker (`lib/citations/napChecker.ts`)
- Consistency scoring across citations
- Issue detection with severity levels
- Recommendation generation
- Canonical NAP building from business data

#### Citations API (`app/api/citations/route.ts`)
- GET: List citations with checklist view
- POST: Create citation with validation
- Auto-updates citation score on changes

### Phase 5: Schema Generator (COMPLETE)

#### Schema Generators (`lib/schema/generators.ts`)
- Organization/LocalBusiness schema
- Service schema for each service
- FAQ schema
- Breadcrumb schema
- WebSite schema with search action
- Industry-to-SchemaType mapping
- Opening hours specification
- Embed code generation
- Schema validation

---

## Files Created/Modified

```
C:\Projects\LLMReady\
├── prisma/
│   ├── schema.prisma          # Full database schema
│   └── seed.ts                # Swiss citation sources seeding
├── lib/
│   ├── auth.ts                # NextAuth configuration
│   ├── db.ts                  # Prisma client
│   ├── utils.ts               # Utility functions (cn)
│   ├── zefix.ts               # Zefix API client
│   ├── entity/
│   │   ├── extract.ts         # AI entity extraction
│   │   └── normalize.ts       # NAP normalization
│   ├── citations/
│   │   ├── sources.ts         # Swiss citation sources
│   │   └── napChecker.ts      # NAP consistency checker
│   └── schema/
│       └── generators.ts      # JSON-LD generators
├── app/
│   ├── layout.tsx             # Root layout with SessionProvider
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── businesses/
│   │   │   ├── route.ts       # List/Create
│   │   │   └── [id]/route.ts  # Detail/Update/Delete
│   │   ├── citations/route.ts
│   │   └── zefix/route.ts
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── verify/page.tsx
│   └── (dashboard)/
│       ├── layout.tsx
│       ├── dashboard/page.tsx
│       └── businesses/
│           ├── page.tsx       # List
│           └── [id]/page.tsx  # Detail with tabs
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── progress.tsx
│   │   ├── avatar.tsx
│   │   └── separator.tsx
│   ├── dashboard/
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   └── forms/
│       └── BusinessForm.tsx
├── types/
│   └── next-auth.d.ts         # Type extensions
├── middleware.ts              # Route protection
├── .env.example               # Environment template
└── SESSION_SUMMARY.md         # This file
```

---

## Environment Variables Needed (.env)

```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/getcitedby"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-secure-secret"

# Email (Resend)
RESEND_API_KEY="re_xxxxx"
EMAIL_FROM="noreply@getcitedby.com"

# OpenAI (for entity extraction)
OPENAI_API_KEY="sk-xxxxx"

# Stripe (for billing - Phase 7)
STRIPE_SECRET_KEY="sk_xxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxx"
```

---

## Next Steps (Remaining Phases)

### Phase 6: LLM Visibility Tracker
- [ ] OpenAI API integration for visibility checks
- [ ] Anthropic API integration
- [ ] Prompt templates for business queries
- [ ] Result parsing and scoring
- [ ] Visibility check scheduling

### Phase 7: Billing (Stripe)
- [ ] Stripe products/prices setup
- [ ] Checkout session creation
- [ ] Webhook handling
- [ ] Subscription management UI

### Phase 8: Deployment
- [ ] Docker configuration
- [ ] Deploy to Argonaut server (130.162.144.114)
- [ ] Nginx configuration
- [ ] SSL certificate
- [ ] DNS configuration for getcitedby.com

---

## Server Deployment Target

- **Server**: Argonaut (Oracle Cloud)
- **IP**: 130.162.144.114
- **User**: ubuntu
- **Domain**: getcitedby.com (to be registered)
