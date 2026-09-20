-- CreateEnum
CREATE TYPE "Role" AS ENUM ('FREE', 'PRO', 'ENTERPRISE', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('STUDENT', 'JUNIOR', 'MID_LEVEL', 'SENIOR', 'STAFF');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'STAFF');

-- CreateEnum
CREATE TYPE "CompanyTrack" AS ENUM ('GOOGLE', 'AMAZON', 'META', 'NETFLIX', 'GENERAL');

-- CreateEnum
CREATE TYPE "InterviewStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'ABANDONED');

-- CreateEnum
CREATE TYPE "InterviewStage" AS ENUM ('REQUIREMENTS_GATHERING', 'NON_FUNCTIONAL_REQUIREMENTS', 'CAPACITY_ESTIMATION', 'HIGH_LEVEL_DESIGN', 'DETAILED_DESIGN', 'SCALABILITY', 'RELIABILITY', 'TRADEOFFS', 'FINAL_ASSESSMENT');

-- CreateEnum
CREATE TYPE "MessageRole" AS ENUM ('USER', 'ASSISTANT', 'SYSTEM');

-- CreateEnum
CREATE TYPE "EvaluationStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "DiagramFormat" AS ENUM ('MERMAID', 'SVG', 'PNG', 'DRAW_IO');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('INTERVIEW_COMPLETED', 'SCORE_GENERATED', 'LEARNING_REMINDER', 'SUBSCRIPTION_EXPIRING');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'FREE',
    "profilePicture" TEXT,
    "experienceLevel" "ExperienceLevel",
    "currentPosition" TEXT,
    "yearsOfExperience" INTEGER,
    "targetCompany" TEXT,
    "targetLevel" TEXT,
    "preferredDifficulty" "Difficulty",
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "description" TEXT NOT NULL,
    "expectedComponents" TEXT[],
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interviews" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "companyTrack" "CompanyTrack" NOT NULL DEFAULT 'GENERAL',
    "currentStage" "InterviewStage" NOT NULL DEFAULT 'REQUIREMENTS_GATHERING',
    "status" "InterviewStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
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
    "strengths" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "weaknesses" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "recommendations" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "failureReason" TEXT,
    "generatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "evaluation_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_messages" (
    "id" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,
    "role" "MessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "stage" "InterviewStage" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interview_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diagrams" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "interviewId" TEXT,
    "title" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "format" "DiagramFormat" NOT NULL DEFAULT 'MERMAID',
    "diagramCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "diagrams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diagram_reviews" (
    "id" TEXT NOT NULL,
    "diagramId" TEXT NOT NULL,
    "completenessScore" INTEGER NOT NULL,
    "spofRisks" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "securityRisks" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "scalabilityRisks" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "reliabilityRisks" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "summary" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "diagram_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_tokenHash_key" ON "refresh_tokens"("tokenHash");

-- CreateIndex
CREATE INDEX "refresh_tokens_userId_idx" ON "refresh_tokens"("userId");

-- CreateIndex
CREATE INDEX "interviews_userId_status_idx" ON "interviews"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "evaluation_reports_interviewId_key" ON "evaluation_reports"("interviewId");

-- CreateIndex
CREATE INDEX "evaluation_reports_status_idx" ON "evaluation_reports"("status");

-- CreateIndex
CREATE INDEX "interview_messages_interviewId_idx" ON "interview_messages"("interviewId");

-- CreateIndex
CREATE INDEX "diagrams_userId_idx" ON "diagrams"("userId");

-- CreateIndex
CREATE INDEX "diagram_reviews_diagramId_idx" ON "diagram_reviews"("diagramId");

-- CreateIndex
CREATE INDEX "notifications_userId_isRead_idx" ON "notifications"("userId", "isRead");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluation_reports" ADD CONSTRAINT "evaluation_reports_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "interviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_messages" ADD CONSTRAINT "interview_messages_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "interviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagrams" ADD CONSTRAINT "diagrams_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagrams" ADD CONSTRAINT "diagrams_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "interviews"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagram_reviews" ADD CONSTRAINT "diagram_reviews_diagramId_fkey" FOREIGN KEY ("diagramId") REFERENCES "diagrams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
