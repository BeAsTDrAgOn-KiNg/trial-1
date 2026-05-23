-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Admin', 'Doctor', 'Data Entry');

-- CreateEnum
CREATE TYPE "CaseStatus" AS ENUM ('open', 'closed', 'under_treatment', 'recovery', 'critical', 'released', 'permanent', 'deceased');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "role" TEXT NOT NULL DEFAULT 'Data Entry',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "animals" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "breed" TEXT,
    "age" INTEGER,
    "gender" TEXT,
    "health_status" TEXT,
    "location" TEXT,
    "image_url" TEXT,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "animals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cases" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "status" "CaseStatus" NOT NULL DEFAULT 'open',
    "reported_by" TEXT,
    "image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinical_entries" (
    "id" TEXT NOT NULL,
    "case_id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "symptoms" TEXT,
    "diagnosis" TEXT NOT NULL,
    "treatment" TEXT NOT NULL,
    "doctor_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clinical_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wildlife_cases" (
    "id" TEXT NOT NULL,
    "case_number" TEXT NOT NULL,
    "date_time" TEXT NOT NULL,
    "animal" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "schedule" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "complainant_name" TEXT NOT NULL,
    "complainant_phone" TEXT NOT NULL,
    "forest_dept_contact" TEXT,
    "release_plan" TEXT,
    "is_ready_for_release" BOOLEAN NOT NULL DEFAULT false,
    "sent_for" TEXT,
    "destination" TEXT,
    "correspondence" TEXT,
    "signature" TEXT,
    "reported_date" TEXT,
    "resolved_date" TEXT,
    "image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wildlife_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "abc_records" (
    "id" TEXT NOT NULL,
    "animal_id" TEXT,
    "male_count" INTEGER,
    "female_count" INTEGER,
    "area" TEXT,
    "sterilized" BOOLEAN NOT NULL,
    "vaccination_done" BOOLEAN NOT NULL,
    "surgery_date" TEXT NOT NULL,
    "remarks" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "abc_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adoption_applications" (
    "id" TEXT NOT NULL,
    "app_number" TEXT NOT NULL,
    "adopter_name" TEXT NOT NULL,
    "adopter_age" TEXT,
    "adopter_gender" TEXT,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "animal_type" TEXT NOT NULL,
    "target_gender" TEXT NOT NULL,
    "target_color" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "description" TEXT,
    "id_proof" TEXT,
    "house_type" TEXT,
    "has_other_pets" TEXT,
    "vet_name" TEXT,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "adoption_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adoptions" (
    "id" TEXT NOT NULL,
    "animal_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "adoptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "declarations" (
    "id" TEXT NOT NULL,
    "form_no" TEXT NOT NULL,
    "declarer_name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "age" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "declarations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donations" (
    "id" TEXT NOT NULL,
    "donor_name" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TEXT,
    "message" TEXT,
    "payment_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "donations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "housekeeping_supplies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "min_stock_level" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "housekeeping_supplies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "min_stock_level" DOUBLE PRECISION,
    "last_restocked" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medicines" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "expiry_date" TEXT,
    "min_stock_level" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "medicines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medicine_usages" (
    "id" TEXT NOT NULL,
    "medicine_id" TEXT NOT NULL,
    "medicine_name" TEXT NOT NULL,
    "quantity" TEXT NOT NULL,
    "taken_by" TEXT NOT NULL,
    "date_time" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "ward" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "medicine_usages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_members" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "joined_date" TEXT NOT NULL,
    "bank_full_name" TEXT,
    "bank_name" TEXT,
    "bank_branch" TEXT,
    "ifsc_code" TEXT,
    "account_number" TEXT,
    "salary" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "staff_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "abc_records_animal_id_key" ON "abc_records"("animal_id");

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_reported_by_fkey" FOREIGN KEY ("reported_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinical_entries" ADD CONSTRAINT "clinical_entries_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "abc_records" ADD CONSTRAINT "abc_records_animal_id_fkey" FOREIGN KEY ("animal_id") REFERENCES "animals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adoptions" ADD CONSTRAINT "adoptions_animal_id_fkey" FOREIGN KEY ("animal_id") REFERENCES "animals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adoptions" ADD CONSTRAINT "adoptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicine_usages" ADD CONSTRAINT "medicine_usages_medicine_id_fkey" FOREIGN KEY ("medicine_id") REFERENCES "medicines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
