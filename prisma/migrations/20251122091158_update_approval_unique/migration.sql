/*
  Warnings:

  - A unique constraint covering the columns `[user_id,aprover_id,fact_form_id]` on the table `approval` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `aprover_id_UNIQUE` ON `approval`;

-- DropIndex
DROP INDEX `user_id_UNIQUE` ON `approval`;

-- AlterTable
ALTER TABLE `approval` ADD PRIMARY KEY (`user_id`, `aprover_id`, `fact_form_id`);

-- CreateIndex
CREATE UNIQUE INDEX `unique_user_approver_form` ON `approval`(`user_id`, `aprover_id`, `fact_form_id`);
