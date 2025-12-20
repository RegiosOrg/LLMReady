# LLMReady - Technical Architecture

## Recommended Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                    TECH STACK                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  FRONTEND                                                        │
│  ├── Next.js 14 (App Router)                                     │
│  ├── TypeScript                                                  │
│  ├── Tailwind CSS                                                │
│  └── shadcn/ui components                                        │
│                                                                  │
│  BACKEND                                                         │
│  ├── Next.js API Routes (main app)                               │
│  ├── Node.js workers (background jobs)                           │
│  └── PostgreSQL (Supabase or self-hosted)                        │
│                                                                  │
│  INFRASTRUCTURE                                                  │
│  ├── Yamato server (85.10.201.144)                               │
│  ├── Docker containers                                           │
│  ├── nginx reverse proxy                                         │
│  └── Let's Encrypt SSL                                           │
│                                                                  │
│  EXTERNAL SERVICES                                               │
│  ├── OpenAI API (LLM checks)                                     │
│  ├── Anthropic API (LLM checks)                                  │
│  ├── Stripe (billing)                                            │
│  ├── Resend (transactional email)                                │
│  └── Zefix API (Swiss company registry)                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Why This Stack?

### Next.js 14

- Full-stack in one codebase
- Server components for fast initial loads
- API routes for backend logic
- Great DX with TypeScript
- Easy deployment

### PostgreSQL (not MySQL)

- Better JSON support (for entity profiles, schema data)
- Full-text search built-in
- Excellent for complex queries
- Supabase provides managed option

### Yamato Server

- Already set up for SEO/CRM projects
- Has Docker, nginx, SSL configured
- Enough resources for MVP
- Can scale to dedicated infra later

---

## Database Schema (Core Tables)

```sql
-- Businesses (main entity)
CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),

    -- Core identity
    name VARCHAR(255) NOT NULL,
    name_variants JSONB,  -- {"de": "...", "fr": "...", "en": "..."}
    uid VARCHAR(20),  -- Swiss UID (CHE-xxx.xxx.xxx)

    -- Location
    address_street VARCHAR(255),
    address_city VARCHAR(100),
    address_postal VARCHAR(10),
    address_canton VARCHAR(2),
    address_country VARCHAR(2) DEFAULT 'CH',
    geo_lat DECIMAL(10, 8),
    geo_lng DECIMAL(11, 8),

    -- Contact
    phone VARCHAR(30),
    email VARCHAR(255),
    website VARCHAR(255),

    -- Business details
    industry VARCHAR(100),
    services JSONB,  -- Array of service objects
    opening_hours JSONB,

    -- Entity profile (generated)
    entity_profile JSONB,

    -- Scores
    visibility_score INTEGER DEFAULT 0,
    citation_score INTEGER DEFAULT 0,
    schema_score INTEGER DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Citations (directory listings)
CREATE TABLE citations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id),

    source VARCHAR(100) NOT NULL,  -- 'google_business', 'local_ch', etc.
    source_url VARCHAR(500),

    -- NAP data on this citation
    listed_name VARCHAR(255),
    listed_address TEXT,
    listed_phone VARCHAR(30),

    -- Status
    status VARCHAR(20) DEFAULT 'pending',  -- pending, submitted, verified, conflict
    nap_match_score INTEGER,  -- 0-100

    last_checked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- LLM Visibility Checks
CREATE TABLE llm_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id),

    provider VARCHAR(20) NOT NULL,  -- 'openai', 'anthropic', 'perplexity'
    model VARCHAR(50),
    prompt TEXT NOT NULL,
    response TEXT,

    -- Analysis
    mentioned BOOLEAN DEFAULT FALSE,
    accuracy_score INTEGER,  -- 0-100
    sentiment VARCHAR(20),  -- positive, neutral, negative

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Schema Implementations
CREATE TABLE schema_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id),

    schema_type VARCHAR(50) NOT NULL,  -- 'Organization', 'LocalBusiness', etc.
    json_ld JSONB NOT NULL,

    status VARCHAR(20) DEFAULT 'generated',  -- generated, implemented, verified

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),

    -- Profile
    name VARCHAR(255),
    company VARCHAR(255),

    -- Billing
    stripe_customer_id VARCHAR(100),
    plan VARCHAR(20) DEFAULT 'free',  -- free, starter, growth, pro

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),

    stripe_subscription_id VARCHAR(100),
    plan VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',

    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## API Structure

```
/api
├── /auth
│   ├── POST /login
│   ├── POST /register
│   ├── POST /logout
│   └── GET  /me
│
├── /businesses
│   ├── GET    /                    # List user's businesses
│   ├── POST   /                    # Create business
│   ├── GET    /:id                 # Get business details
│   ├── PATCH  /:id                 # Update business
│   ├── DELETE /:id                 # Delete business
│   ├── POST   /:id/analyze         # Run entity analysis
│   └── GET    /:id/visibility      # Get visibility score
│
├── /citations
│   ├── GET    /:businessId         # List citations
│   ├── POST   /:businessId         # Add citation
│   ├── PATCH  /:id                 # Update citation status
│   └── POST   /:businessId/check   # Check all citations
│
├── /schema
│   ├── GET    /:businessId         # Get schema items
│   ├── POST   /:businessId/generate # Generate schema
│   └── GET    /:businessId/export  # Export JSON-LD
│
├── /llm
│   ├── POST   /:businessId/check   # Run LLM visibility check
│   ├── GET    /:businessId/history # Get check history
│   └── GET    /:businessId/report  # Get visibility report
│
├── /billing
│   ├── POST   /checkout            # Create Stripe checkout
│   ├── POST   /portal              # Create customer portal
│   └── POST   /webhook             # Stripe webhook
│
└── /admin
    ├── GET    /stats               # Dashboard stats
    └── GET    /users               # User management
```

---

## Background Jobs

```typescript
// jobs/llmVisibilityCheck.ts
// Runs daily for all active businesses
// Checks visibility across ChatGPT, Claude, Perplexity

// jobs/citationHealthCheck.ts
// Runs weekly
// Verifies NAP consistency across all citations

// jobs/schemaValidator.ts
// Runs after schema generation
// Validates JSON-LD against schema.org

// jobs/alerter.ts
// Runs on events
// Sends email alerts for visibility drops, conflicts
```

---

## LLM Visibility Check Implementation

```typescript
// lib/llm/visibilityCheck.ts

interface VisibilityPrompt {
  category: string;
  prompt: string;
  expectedMention: string;
}

const PROMPTS: VisibilityPrompt[] = [
  {
    category: 'discovery',
    prompt: 'Best {industry} in {city}',
    expectedMention: '{businessName}'
  },
  {
    category: 'identity',
    prompt: 'Who is {businessName}?',
    expectedMention: '{businessName}'
  },
  {
    category: 'service',
    prompt: 'How much does {service} cost in {city}?',
    expectedMention: '{businessName}'
  }
];

async function checkVisibility(business: Business): Promise<VisibilityReport> {
  const results = [];

  for (const prompt of PROMPTS) {
    const filledPrompt = fillPrompt(prompt.prompt, business);

    // Check across providers
    const openaiResult = await checkOpenAI(filledPrompt);
    const claudeResult = await checkClaude(filledPrompt);

    results.push({
      prompt: filledPrompt,
      openai: analyzeResponse(openaiResult, business),
      claude: analyzeResponse(claudeResult, business)
    });
  }

  return calculateScore(results);
}

function analyzeResponse(response: string, business: Business) {
  return {
    mentioned: response.toLowerCase().includes(business.name.toLowerCase()),
    accuracy: calculateAccuracy(response, business),
    sentiment: analyzeSentiment(response)
  };
}
```

---

## Swiss Citations Sources

```typescript
// lib/citations/sources/swiss.ts

export const SWISS_CITATION_SOURCES = [
  {
    id: 'google_business',
    name: 'Google Business Profile',
    url: 'https://business.google.com',
    priority: 1,
    hasApi: true,
    autoSubmit: false
  },
  {
    id: 'local_ch',
    name: 'local.ch',
    url: 'https://www.local.ch',
    priority: 2,
    hasApi: false,
    autoSubmit: false
  },
  {
    id: 'search_ch',
    name: 'search.ch',
    url: 'https://www.search.ch',
    priority: 2,
    hasApi: false,
    autoSubmit: false
  },
  {
    id: 'apple_maps',
    name: 'Apple Business Connect',
    url: 'https://businessconnect.apple.com',
    priority: 3,
    hasApi: true,
    autoSubmit: false
  },
  {
    id: 'bing_places',
    name: 'Bing Places',
    url: 'https://www.bingplaces.com',
    priority: 3,
    hasApi: true,
    autoSubmit: false
  },
  // Industry-specific
  {
    id: 'treuhand_suisse',
    name: 'Treuhand Suisse',
    url: 'https://www.treuhandsuisse.ch',
    priority: 2,
    industries: ['treuhand'],
    hasApi: false
  },
  {
    id: 'comparis',
    name: 'Comparis',
    url: 'https://www.comparis.ch',
    priority: 3,
    industries: ['insurance', 'healthcare'],
    hasApi: false
  }
];
```

---

## Folder Structure

```
LLMReady/
├── app/                      # Next.js App Router
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── businesses/
│   │   ├── citations/
│   │   ├── schema/
│   │   ├── visibility/
│   │   └── settings/
│   ├── (marketing)/
│   │   ├── page.tsx          # Landing page
│   │   ├── pricing/
│   │   └── about/
│   ├── api/
│   │   ├── auth/
│   │   ├── businesses/
│   │   ├── citations/
│   │   ├── schema/
│   │   ├── llm/
│   │   └── billing/
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── ui/                   # shadcn components
│   ├── dashboard/
│   ├── forms/
│   └── marketing/
│
├── lib/
│   ├── db/                   # Database client
│   ├── llm/                  # LLM check logic
│   ├── citations/            # Citation sources
│   ├── schema/               # Schema generators
│   ├── billing/              # Stripe logic
│   └── utils/
│
├── jobs/                     # Background workers
│   ├── visibilityCheck.ts
│   ├── citationHealth.ts
│   └── index.ts
│
├── prisma/
│   └── schema.prisma
│
├── public/
├── .env.example
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

---

## Environment Variables

```bash
# .env.example

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/llmready

# Auth
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000

# LLM APIs
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
RESEND_API_KEY=re_...

# Swiss APIs
ZEFIX_API_KEY=...
```

---

## Deployment

### Option 1: Yamato Server (Recommended for MVP)

```bash
# On Yamato (85.10.201.144)
cd /home/layfon
git clone https://github.com/RegiosOrg/LLMReady.git
cd LLMReady

# Docker Compose
docker-compose up -d

# nginx config
sudo nano /etc/nginx/sites-available/llmready.ch
sudo ln -s /etc/nginx/sites-available/llmready.ch /etc/nginx/sites-enabled/
sudo certbot --nginx -d llmready.ch -d www.llmready.ch
sudo systemctl reload nginx
```

### Option 2: Vercel (Easier but more expensive)

- Deploy Next.js directly to Vercel
- Use Vercel Postgres or external DB
- Good for scaling, but costs add up

---

## Development Setup

```bash
# Clone and install
git clone https://github.com/RegiosOrg/LLMReady.git
cd LLMReady
npm install

# Set up database
cp .env.example .env
# Edit .env with your values
npx prisma migrate dev

# Run development server
npm run dev
```

---

## MVP Milestones

### Week 1-2: Core Infrastructure
- [ ] Next.js project setup
- [ ] Database schema + Prisma
- [ ] Auth (NextAuth.js)
- [ ] Basic dashboard layout

### Week 3-4: Entity Module
- [ ] Business intake form
- [ ] Entity profile generation
- [ ] Zefix UID lookup integration
- [ ] Service mapping

### Week 5-6: Citations Module
- [ ] Citation sources database
- [ ] NAP consistency checker
- [ ] Citation status tracking
- [ ] Dashboard display

### Week 7-8: LLM Visibility
- [ ] OpenAI integration
- [ ] Claude integration
- [ ] Visibility check logic
- [ ] Score calculation
- [ ] History tracking

### Week 9-10: Billing + Polish
- [ ] Stripe integration
- [ ] Pricing tiers
- [ ] Email notifications
- [ ] Landing page
- [ ] Documentation
