-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "SystemSettings" (
    "id" SERIAL NOT NULL,
    "maintenance_mode" BOOLEAN NOT NULL DEFAULT false,
    "allow_registration" BOOLEAN NOT NULL DEFAULT true,
    "review_auto_approve" BOOLEAN NOT NULL DEFAULT false,
    "payment_gateway" TEXT NOT NULL DEFAULT 'fapshi',
    "email_notifications" BOOLEAN NOT NULL DEFAULT true,
    "max_file_size" INTEGER NOT NULL DEFAULT 5,
    "currency" TEXT NOT NULL DEFAULT 'XAF',
    "currency_symbol" TEXT NOT NULL DEFAULT 'FCFA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "supportEmail" TEXT,

    CONSTRAINT "SystemSettings_pkey" PRIMARY KEY ("id")
);
