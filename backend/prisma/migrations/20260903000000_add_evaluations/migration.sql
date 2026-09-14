CREATE TYPE "EvaluationStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

CREATE TABLE "evaluation_reports" (
  "id" TEXT NOT NULL,
  "interviewId" TEXT NOT NULL,
  "status" "EvaluationStatus" NOT NULL DEFAULT 'PENDING',
  "overallScore" INTEGER,
  "requirementsScore" INTEGER,
  "architectureScore" INTEGER,
  "scalabilityScore" INTEGER,
  "databaseDesignScore" INTEGER,
  "reliabilityScore" INTEGER,
  "securityScore" INTEGER,
  "costAwarenessScore" INTEGER,
  "strengths" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "weaknesses" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "recommendations" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "failureReason" TEXT,
  "generatedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "evaluation_reports_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "evaluation_reports_interviewId_key" ON "evaluation_reports"("interviewId");
CREATE INDEX "evaluation_reports_status_idx" ON "evaluation_reports"("status");
ALTER TABLE "evaluation_reports" ADD CONSTRAINT "evaluation_reports_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "interviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;
