-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "emailVerified" DATETIME,
    "name" TEXT,
    "image" TEXT,
    "stripeCustomerId" TEXT,
    "plan" TEXT NOT NULL DEFAULT 'FREE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Business" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameVariants" TEXT,
    "uid" TEXT,
    "addressStreet" TEXT,
    "addressCity" TEXT,
    "addressPostal" TEXT,
    "addressCanton" TEXT,
    "addressCountry" TEXT NOT NULL DEFAULT 'CH',
    "geoLat" REAL,
    "geoLng" REAL,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "industry" TEXT,
    "description" TEXT,
    "services" TEXT,
    "openingHours" TEXT,
    "keyPeople" TEXT,
    "entityProfile" TEXT,
    "visibilityScore" INTEGER NOT NULL DEFAULT 0,
    "citationScore" INTEGER NOT NULL DEFAULT 0,
    "schemaScore" INTEGER NOT NULL DEFAULT 0,
    "overallScore" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "onboardingStep" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Business_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Citation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "businessId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "sourceName" TEXT,
    "sourceUrl" TEXT,
    "sourceIcon" TEXT,
    "listedName" TEXT,
    "listedAddress" TEXT,
    "listedPhone" TEXT,
    "listedWebsite" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "napMatchScore" INTEGER,
    "issues" TEXT,
    "submittedAt" DATETIME,
    "verifiedAt" DATETIME,
    "lastCheckedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Citation_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LlmCheck" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "businessId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "model" TEXT,
    "prompt" TEXT NOT NULL,
    "response" TEXT,
    "mentioned" BOOLEAN NOT NULL DEFAULT false,
    "accuracyScore" INTEGER,
    "sentiment" TEXT,
    "mentionContext" TEXT,
    "extractedInfo" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LlmCheck_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SchemaItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "businessId" TEXT NOT NULL,
    "schemaType" TEXT NOT NULL,
    "jsonLd" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'generated',
    "validationErrors" TEXT,
    "implementedAt" DATETIME,
    "verifiedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SchemaItem_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "stripeSubscriptionId" TEXT,
    "stripePriceId" TEXT,
    "stripeCurrentPeriodEnd" DATETIME,
    "plan" TEXT NOT NULL DEFAULT 'FREE',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "businessesUsed" INTEGER NOT NULL DEFAULT 0,
    "citationsUsed" INTEGER NOT NULL DEFAULT 0,
    "llmChecksUsed" INTEGER NOT NULL DEFAULT 0,
    "currentPeriodStart" DATETIME,
    "currentPeriodEnd" DATETIME,
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CitationSource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "iconUrl" TEXT,
    "category" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'CH',
    "industries" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 3,
    "hasApi" BOOLEAN NOT NULL DEFAULT false,
    "autoSubmit" BOOLEAN NOT NULL DEFAULT false,
    "submissionUrl" TEXT,
    "submissionGuide" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "businessId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "metadata" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");

-- CreateIndex
CREATE INDEX "Business_userId_idx" ON "Business"("userId");

-- CreateIndex
CREATE INDEX "Business_status_idx" ON "Business"("status");

-- CreateIndex
CREATE INDEX "Citation_businessId_idx" ON "Citation"("businessId");

-- CreateIndex
CREATE INDEX "Citation_status_idx" ON "Citation"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Citation_businessId_source_key" ON "Citation"("businessId", "source");

-- CreateIndex
CREATE INDEX "LlmCheck_businessId_idx" ON "LlmCheck"("businessId");

-- CreateIndex
CREATE INDEX "LlmCheck_provider_idx" ON "LlmCheck"("provider");

-- CreateIndex
CREATE INDEX "LlmCheck_createdAt_idx" ON "LlmCheck"("createdAt");

-- CreateIndex
CREATE INDEX "SchemaItem_businessId_idx" ON "SchemaItem"("businessId");

-- CreateIndex
CREATE INDEX "SchemaItem_schemaType_idx" ON "SchemaItem"("schemaType");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeSubscriptionId_key" ON "Subscription"("stripeSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "CitationSource_slug_key" ON "CitationSource"("slug");

-- CreateIndex
CREATE INDEX "CitationSource_country_idx" ON "CitationSource"("country");

-- CreateIndex
CREATE INDEX "CitationSource_category_idx" ON "CitationSource"("category");

-- CreateIndex
CREATE INDEX "CitationSource_isActive_idx" ON "CitationSource"("isActive");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_businessId_idx" ON "AuditLog"("businessId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");
