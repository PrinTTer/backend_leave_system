/*
  Warnings:

  - Added the required column `max_leave` to the `leave_type` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `calendar` MODIFY `create_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `fact_form` MODIFY `create_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `leave_type` ADD COLUMN `max_leave` INTEGER NOT NULL,
    MODIFY `is_count_vacation` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `create_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `leave_type_document` MODIFY `is_required` BOOLEAN NOT NULL DEFAULT false;
