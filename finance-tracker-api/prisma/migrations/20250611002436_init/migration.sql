-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('Income', 'Expense');

-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('Bank', 'Custom');

-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('Income', 'Expense');

-- CreateTable
CREATE TABLE "zt_user" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "zt_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zt_category" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "default_category" BOOLEAN NOT NULL DEFAULT false,
    "icon_res" TEXT,
    "icon_color" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "zt_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zt_source" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "SourceType" NOT NULL,
    "initial_balance" DECIMAL(65,30) NOT NULL,
    "bank_source_title" TEXT,
    "bank_source_bank_name" TEXT,
    "bank_source_card_number" TEXT,
    "bank_source_sms_suggestion" BOOLEAN NOT NULL DEFAULT false,
    "custom_source_title" TEXT,
    "icon_res" TEXT,
    "icon_color" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "zt_source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zt_transaction" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "source_id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "zt_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zt_budget" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "zt_budget_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "zt_user_phoneNumber_key" ON "zt_user"("phoneNumber");

-- CreateIndex
CREATE INDEX "zt_category_user_id_idx" ON "zt_category"("user_id");

-- CreateIndex
CREATE INDEX "zt_category_type_idx" ON "zt_category"("type");

-- CreateIndex
CREATE INDEX "zt_source_user_id_idx" ON "zt_source"("user_id");

-- CreateIndex
CREATE INDEX "zt_source_type_idx" ON "zt_source"("type");

-- CreateIndex
CREATE INDEX "zt_transaction_user_id_idx" ON "zt_transaction"("user_id");

-- CreateIndex
CREATE INDEX "zt_transaction_category_id_idx" ON "zt_transaction"("category_id");

-- CreateIndex
CREATE INDEX "zt_transaction_source_id_idx" ON "zt_transaction"("source_id");

-- CreateIndex
CREATE INDEX "zt_transaction_date_idx" ON "zt_transaction"("date");

-- CreateIndex
CREATE INDEX "zt_budget_user_id_idx" ON "zt_budget"("user_id");

-- CreateIndex
CREATE INDEX "zt_budget_category_id_idx" ON "zt_budget"("category_id");

-- CreateIndex
CREATE INDEX "zt_budget_start_date_end_date_idx" ON "zt_budget"("start_date", "end_date");

-- AddForeignKey
ALTER TABLE "zt_category" ADD CONSTRAINT "zt_category_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "zt_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zt_source" ADD CONSTRAINT "zt_source_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "zt_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zt_transaction" ADD CONSTRAINT "zt_transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "zt_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zt_transaction" ADD CONSTRAINT "zt_transaction_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "zt_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zt_transaction" ADD CONSTRAINT "zt_transaction_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "zt_source"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zt_budget" ADD CONSTRAINT "zt_budget_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "zt_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zt_budget" ADD CONSTRAINT "zt_budget_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "zt_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
