-- CreateTable
CREATE TABLE "HireEnquiry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT,
    "disciplines" JSONB NOT NULL,
    "need" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HireEnquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HireEnquiry_email_idx" ON "HireEnquiry"("email");

-- CreateIndex
CREATE INDEX "HireEnquiry_createdAt_idx" ON "HireEnquiry"("createdAt");
