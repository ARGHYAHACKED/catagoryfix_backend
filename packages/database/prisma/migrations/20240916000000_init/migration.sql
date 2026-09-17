-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'DELETED');
CREATE TYPE "OrganizationRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');
CREATE TYPE "Plan" AS ENUM ('FREE', 'STARTER', 'BUSINESS', 'PRO');
CREATE TYPE "SubscriptionStatus" AS ENUM ('TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELLED', 'EXPIRED');
CREATE TYPE "ImportStatus" AS ENUM ('CREATED', 'UPLOADING', 'UPLOADED', 'QUEUED', 'PARSING', 'MAPPING_REQUIRED', 'PROCESSING', 'VALIDATING', 'READY', 'COMPLETED', 'FAILED', 'CANCELLED');
CREATE TYPE "SourcePlatform" AS ENUM ('GENERIC', 'SHOPIFY', 'WOOCOMMERCE', 'AMAZON', 'CUSTOM');
CREATE TYPE "TargetPlatform" AS ENUM ('SHOPIFY', 'WOOCOMMERCE', 'AMAZON', 'EBAY');
CREATE TYPE "ImportFileType" AS ENUM ('CATALOG', 'IMAGE_ZIP', 'OTHER');
CREATE TYPE "ProductStatus" AS ENUM ('DRAFT', 'PROCESSING', 'READY', 'INVALID', 'EXPORTED', 'PUBLISHED');
CREATE TYPE "ValidationSeverity" AS ENUM ('INFO', 'WARNING', 'ERROR');
CREATE TYPE "ImageMatchMethod" AS ENUM ('EXACT_SKU', 'SKU_PREFIX', 'BARCODE', 'SUPPLIER_ID', 'FILENAME', 'MANUAL', 'AI');
CREATE TYPE "ExportStatus" AS ENUM ('QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED');
CREATE TYPE "IntegrationType" AS ENUM ('SHOPIFY', 'WOOCOMMERCE', 'AMAZON', 'EBAY');
CREATE TYPE "IntegrationStatus" AS ENUM ('PENDING', 'CONNECTED', 'DISCONNECTED', 'ERROR');
CREATE TYPE "AIJobStatus" AS ENUM ('QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');
CREATE TYPE "AuditEvent" AS ENUM ('LOGIN', 'LOGOUT', 'ORGANIZATION_CREATED', 'MEMBER_INVITED', 'IMPORT_CREATED', 'IMPORT_STARTED', 'IMPORT_COMPLETED', 'EXPORT_CREATED', 'PRODUCT_EDITED', 'AI_CONTENT_APPLIED', 'SHOPIFY_CONNECTED', 'SHOPIFY_DISCONNECTED', 'PLAN_CHANGED');

CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "emailVerifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "replacedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EmailVerificationToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmailVerificationToken_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OrganizationMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "role" "OrganizationRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OrganizationMember_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "plan" "Plan" NOT NULL DEFAULT 'FREE',
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "stripePriceId" TEXT,
    "currentPeriodStart" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "UsageRecord" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "productsProcessed" INTEGER NOT NULL DEFAULT 0,
    "aiGenerations" INTEGER NOT NULL DEFAULT 0,
    "importsCreated" INTEGER NOT NULL DEFAULT 0,
    "exportsCreated" INTEGER NOT NULL DEFAULT 0,
    "storageBytes" BIGINT NOT NULL DEFAULT 0,
    "imageMatches" INTEGER NOT NULL DEFAULT 0,
    "shopifyPublishes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "UsageRecord_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ImportJob" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdByUserId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sourcePlatform" "SourcePlatform" NOT NULL DEFAULT 'GENERIC',
    "targetPlatform" "TargetPlatform" NOT NULL DEFAULT 'SHOPIFY',
    "status" "ImportStatus" NOT NULL DEFAULT 'CREATED',
    "totalRows" INTEGER NOT NULL DEFAULT 0,
    "processedRows" INTEGER NOT NULL DEFAULT 0,
    "successfulRows" INTEGER NOT NULL DEFAULT 0,
    "failedRows" INTEGER NOT NULL DEFAULT 0,
    "warningRows" INTEGER NOT NULL DEFAULT 0,
    "progressPercentage" INTEGER NOT NULL DEFAULT 0,
    "currentStage" TEXT,
    "detectedHeaders" JSONB,
    "detectedEncoding" TEXT,
    "detectedDelimiter" TEXT,
    "selectedSheet" TEXT,
    "sampleRows" JSONB,
    "processingLock" TEXT,
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "ImportJob_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ImportFile" (
    "id" TEXT NOT NULL,
    "importId" TEXT NOT NULL,
    "type" "ImportFileType" NOT NULL,
    "originalName" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "checksum" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ImportFile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ColumnMapping" (
    "id" TEXT NOT NULL,
    "importId" TEXT NOT NULL,
    "sourceColumn" TEXT NOT NULL,
    "targetField" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "autoDetected" BOOLEAN NOT NULL DEFAULT true,
    "confirmedByUser" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ColumnMapping_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "importId" TEXT NOT NULL,
    "externalId" TEXT,
    "sku" TEXT,
    "title" TEXT NOT NULL,
    "handle" TEXT,
    "description" TEXT,
    "descriptionHtml" TEXT,
    "vendor" TEXT,
    "productType" TEXT,
    "status" "ProductStatus" NOT NULL DEFAULT 'DRAFT',
    "price" DECIMAL(12,2),
    "compareAtPrice" DECIMAL(12,2),
    "cost" DECIMAL(12,2),
    "barcode" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "rawData" JSONB,
    "normalizedData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProductVariant" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "externalId" TEXT,
    "sku" TEXT,
    "barcode" TEXT,
    "price" DECIMAL(12,2),
    "compareAtPrice" DECIMAL(12,2),
    "cost" DECIMAL(12,2),
    "inventoryQuantity" INTEGER,
    "weight" DECIMAL(12,4),
    "weightUnit" TEXT,
    "optionValues" JSONB NOT NULL,
    "rawData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProductOption" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    CONSTRAINT "ProductOption_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProductOptionValue" (
    "id" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    CONSTRAINT "ProductOptionValue_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProductImage" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "storageKey" TEXT,
    "url" TEXT,
    "altText" TEXT,
    "position" INTEGER NOT NULL DEFAULT 1,
    "matchedBy" "ImageMatchMethod",
    "confidence" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProductTag" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "ProductTag_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ValidationIssue" (
    "id" TEXT NOT NULL,
    "importId" TEXT NOT NULL,
    "productId" TEXT,
    "variantId" TEXT,
    "field" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "severity" "ValidationSeverity" NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolution" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    CONSTRAINT "ValidationIssue_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ExportJob" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdByUserId" TEXT NOT NULL,
    "importId" TEXT,
    "platform" "TargetPlatform" NOT NULL,
    "status" "ExportStatus" NOT NULL DEFAULT 'QUEUED',
    "totalProducts" INTEGER NOT NULL DEFAULT 0,
    "processedProducts" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ExportJob_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ExportFile" (
    "id" TEXT NOT NULL,
    "exportId" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "checksum" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ExportFile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Integration" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "type" "IntegrationType" NOT NULL,
    "status" "IntegrationStatus" NOT NULL DEFAULT 'PENDING',
    "externalAccountId" TEXT,
    "encryptedCredentials" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Integration_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ShopifyStore" (
    "id" TEXT NOT NULL,
    "integrationId" TEXT NOT NULL,
    "shopDomain" TEXT NOT NULL,
    "scopes" TEXT NOT NULL,
    "installedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ShopifyStore_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AIJob" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "importId" TEXT,
    "productId" TEXT,
    "operation" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "status" "AIJobStatus" NOT NULL DEFAULT 'QUEUED',
    "inputTokens" INTEGER,
    "outputTokens" INTEGER,
    "estimatedCost" DECIMAL(12,6),
    "errorMessage" TEXT,
    "result" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    CONSTRAINT "AIJob_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT,
    "userId" TEXT,
    "event" "AuditEvent" NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "WebhookEvent" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerEventId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "processedAt" TIMESTAMP(3),
    "payloadHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "APIKey" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "keyHash" TEXT NOT NULL,
    "lastFour" TEXT NOT NULL,
    "lastUsedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "APIKey_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "Session_userId_idx" ON "Session"("userId");
CREATE UNIQUE INDEX "RefreshToken_tokenHash_key" ON "RefreshToken"("tokenHash");
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");
CREATE UNIQUE INDEX "EmailVerificationToken_tokenHash_key" ON "EmailVerificationToken"("tokenHash");
CREATE INDEX "EmailVerificationToken_userId_idx" ON "EmailVerificationToken"("userId");
CREATE UNIQUE INDEX "PasswordResetToken_tokenHash_key" ON "PasswordResetToken"("tokenHash");
CREATE INDEX "PasswordResetToken_userId_idx" ON "PasswordResetToken"("userId");
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");
CREATE UNIQUE INDEX "OrganizationMember_userId_organizationId_key" ON "OrganizationMember"("userId", "organizationId");
CREATE INDEX "OrganizationMember_organizationId_idx" ON "OrganizationMember"("organizationId");
CREATE UNIQUE INDEX "Subscription_organizationId_key" ON "Subscription"("organizationId");
CREATE UNIQUE INDEX "UsageRecord_organizationId_period_key" ON "UsageRecord"("organizationId", "period");
CREATE INDEX "ImportJob_organizationId_idx" ON "ImportJob"("organizationId");
CREATE INDEX "ImportJob_status_idx" ON "ImportJob"("status");
CREATE INDEX "ImportJob_organizationId_status_idx" ON "ImportJob"("organizationId", "status");
CREATE INDEX "ImportFile_importId_idx" ON "ImportFile"("importId");
CREATE UNIQUE INDEX "ColumnMapping_importId_sourceColumn_key" ON "ColumnMapping"("importId", "sourceColumn");
CREATE INDEX "ColumnMapping_importId_idx" ON "ColumnMapping"("importId");
CREATE INDEX "Product_importId_idx" ON "Product"("importId");
CREATE INDEX "Product_sku_idx" ON "Product"("sku");
CREATE INDEX "Product_barcode_idx" ON "Product"("barcode");
CREATE INDEX "Product_status_idx" ON "Product"("status");
CREATE INDEX "Product_importId_status_idx" ON "Product"("importId", "status");
CREATE INDEX "ProductVariant_productId_idx" ON "ProductVariant"("productId");
CREATE INDEX "ProductVariant_sku_idx" ON "ProductVariant"("sku");
CREATE INDEX "ProductOption_productId_idx" ON "ProductOption"("productId");
CREATE INDEX "ProductImage_productId_idx" ON "ProductImage"("productId");
CREATE INDEX "ProductTag_productId_idx" ON "ProductTag"("productId");
CREATE INDEX "ValidationIssue_importId_idx" ON "ValidationIssue"("importId");
CREATE INDEX "ValidationIssue_productId_idx" ON "ValidationIssue"("productId");
CREATE INDEX "ValidationIssue_importId_severity_resolved_idx" ON "ValidationIssue"("importId", "severity", "resolved");
CREATE INDEX "ExportJob_organizationId_idx" ON "ExportJob"("organizationId");
CREATE INDEX "ExportJob_importId_idx" ON "ExportJob"("importId");
CREATE INDEX "ExportFile_exportId_idx" ON "ExportFile"("exportId");
CREATE INDEX "Integration_organizationId_idx" ON "Integration"("organizationId");
CREATE UNIQUE INDEX "ShopifyStore_integrationId_key" ON "ShopifyStore"("integrationId");
CREATE INDEX "AIJob_organizationId_idx" ON "AIJob"("organizationId");
CREATE INDEX "AIJob_productId_idx" ON "AIJob"("productId");
CREATE INDEX "AuditLog_organizationId_idx" ON "AuditLog"("organizationId");
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");
CREATE INDEX "AuditLog_event_idx" ON "AuditLog"("event");
CREATE UNIQUE INDEX "WebhookEvent_provider_providerEventId_key" ON "WebhookEvent"("provider", "providerEventId");
CREATE UNIQUE INDEX "APIKey_keyHash_key" ON "APIKey"("keyHash");
CREATE INDEX "APIKey_organizationId_idx" ON "APIKey"("organizationId");

ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EmailVerificationToken" ADD CONSTRAINT "EmailVerificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OrganizationMember" ADD CONSTRAINT "OrganizationMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OrganizationMember" ADD CONSTRAINT "OrganizationMember_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UsageRecord" ADD CONSTRAINT "UsageRecord_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ImportJob" ADD CONSTRAINT "ImportJob_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ImportJob" ADD CONSTRAINT "ImportJob_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ImportFile" ADD CONSTRAINT "ImportFile_importId_fkey" FOREIGN KEY ("importId") REFERENCES "ImportJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ColumnMapping" ADD CONSTRAINT "ColumnMapping_importId_fkey" FOREIGN KEY ("importId") REFERENCES "ImportJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Product" ADD CONSTRAINT "Product_importId_fkey" FOREIGN KEY ("importId") REFERENCES "ImportJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProductOption" ADD CONSTRAINT "ProductOption_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProductOptionValue" ADD CONSTRAINT "ProductOptionValue_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "ProductOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProductTag" ADD CONSTRAINT "ProductTag_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ValidationIssue" ADD CONSTRAINT "ValidationIssue_importId_fkey" FOREIGN KEY ("importId") REFERENCES "ImportJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ValidationIssue" ADD CONSTRAINT "ValidationIssue_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ValidationIssue" ADD CONSTRAINT "ValidationIssue_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ExportJob" ADD CONSTRAINT "ExportJob_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ExportJob" ADD CONSTRAINT "ExportJob_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ExportJob" ADD CONSTRAINT "ExportJob_importId_fkey" FOREIGN KEY ("importId") REFERENCES "ImportJob"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ExportFile" ADD CONSTRAINT "ExportFile_exportId_fkey" FOREIGN KEY ("exportId") REFERENCES "ExportJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Integration" ADD CONSTRAINT "Integration_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ShopifyStore" ADD CONSTRAINT "ShopifyStore_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "Integration"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AIJob" ADD CONSTRAINT "AIJob_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AIJob" ADD CONSTRAINT "AIJob_importId_fkey" FOREIGN KEY ("importId") REFERENCES "ImportJob"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AIJob" ADD CONSTRAINT "AIJob_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "APIKey" ADD CONSTRAINT "APIKey_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "APIKey" ADD CONSTRAINT "APIKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
