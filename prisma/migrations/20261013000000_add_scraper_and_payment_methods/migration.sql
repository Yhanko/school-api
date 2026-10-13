-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'PEDAGOGICAL_DIRECTOR';

-- AlterTable
ALTER TABLE "Institution" ADD COLUMN "multicaixaExpress" TEXT,
ADD COLUMN "paymentReference" TEXT,
ADD COLUMN "twilioAccountSid" TEXT,
ADD COLUMN "twilioApiKey" TEXT,
ADD COLUMN "twilioApiSecret" TEXT,
ADD COLUMN "twilioAuthToken" TEXT,
ADD COLUMN "twilioWhatsappNumber" TEXT;

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('NOTICIA', 'CONCURSO', 'SEMINARIO', 'COMUNICADO');

-- CreateTable
CREATE TABLE "ScrapedNotification" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "sourceUrl" TEXT NOT NULL,
    "sourceName" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "scrapedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contentHash" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ScrapedNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationRead" (
    "id" TEXT NOT NULL,
    "notificationId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationRead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ScrapedNotification_sourceUrl_key" ON "ScrapedNotification"("sourceUrl");

-- CreateIndex
CREATE UNIQUE INDEX "ScrapedNotification_contentHash_key" ON "ScrapedNotification"("contentHash");

-- CreateIndex
CREATE INDEX "ScrapedNotification_type_publishedAt_idx" ON "ScrapedNotification"("type", "publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationRead_notificationId_teacherId_key" ON "NotificationRead"("notificationId", "teacherId");

-- AddForeignKey
ALTER TABLE "NotificationRead" ADD CONSTRAINT "NotificationRead_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "ScrapedNotification"("id") ON DELETE CASCADE ON UPDATE CASCADE;
