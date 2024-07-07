-- DropForeignKey
ALTER TABLE "Ref_Mapping" DROP CONSTRAINT "Ref_Mapping_refereeEmail_fkey";

-- DropForeignKey
ALTER TABLE "Ref_Mapping" DROP CONSTRAINT "Ref_Mapping_referrerId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Ref_Mapping" ADD CONSTRAINT "Ref_Mapping_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ref_Mapping" ADD CONSTRAINT "Ref_Mapping_refereeEmail_fkey" FOREIGN KEY ("refereeEmail") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;
