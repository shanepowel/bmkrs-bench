-- bmkrs bench: partner trust model, projects, engagements

-- CreateEnum
CREATE TYPE "PartnerStatus" AS ENUM ('APPLIED', 'REVIEWED', 'TRUSTED', 'CORE');
CREATE TYPE "BriefVisibility" AS ENUM ('DRAFT', 'INVITED');

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'APPLICANT';

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "TalentProfile" ADD COLUMN "partnerStatus" "PartnerStatus" NOT NULL DEFAULT 'APPLIED';
ALTER TABLE "TalentProfile" ADD COLUMN "dayRateBand" TEXT;
ALTER TABLE "TalentProfile" ADD COLUMN "studioNotes" TEXT;
ALTER TABLE "TalentProfile" ADD COLUMN "referenceOne" TEXT;
ALTER TABLE "TalentProfile" ADD COLUMN "referenceTwo" TEXT;

ALTER TABLE "Job" ADD COLUMN "projectId" TEXT;
ALTER TABLE "Job" ADD COLUMN "visibility" "BriefVisibility" NOT NULL DEFAULT 'INVITED';

-- CreateTable
CREATE TABLE "PartnerStatusEvent" (
    "id" TEXT NOT NULL,
    "talentProfileId" TEXT NOT NULL,
    "fromStatus" "PartnerStatus",
    "toStatus" "PartnerStatus" NOT NULL,
    "byUserId" TEXT,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartnerStatusEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Engagement" (
    "talentProfileId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "startedAt" DATE,
    "completedAt" DATE,

    CONSTRAINT "Engagement_pkey" PRIMARY KEY ("talentProfileId","projectId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");
CREATE INDEX "Project_clientId_idx" ON "Project"("clientId");
CREATE INDEX "TalentProfile_partnerStatus_idx" ON "TalentProfile"("partnerStatus");
CREATE INDEX "Job_projectId_idx" ON "Job"("projectId");
CREATE INDEX "Job_visibility_idx" ON "Job"("visibility");
CREATE INDEX "PartnerStatusEvent_talentProfileId_createdAt_idx" ON "PartnerStatusEvent"("talentProfileId", "createdAt");
CREATE INDEX "Engagement_projectId_idx" ON "Engagement"("projectId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Job" ADD CONSTRAINT "Job_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "PartnerStatusEvent" ADD CONSTRAINT "PartnerStatusEvent_talentProfileId_fkey" FOREIGN KEY ("talentProfileId") REFERENCES "TalentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PartnerStatusEvent" ADD CONSTRAINT "PartnerStatusEvent_byUserId_fkey" FOREIGN KEY ("byUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Engagement" ADD CONSTRAINT "Engagement_talentProfileId_fkey" FOREIGN KEY ("talentProfileId") REFERENCES "TalentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Engagement" ADD CONSTRAINT "Engagement_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
