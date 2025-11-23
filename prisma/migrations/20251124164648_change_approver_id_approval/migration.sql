/*
  Warnings:

  - The primary key for the `approval` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `aprover_id` on the `approval` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,approver_id,fact_form_id]` on the table `approval` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `approver_id` to the `approval` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `unique_user_approver_form` ON `approval`;

-- AlterTable
ALTER TABLE `approval` DROP PRIMARY KEY,
    DROP COLUMN `aprover_id`,
    ADD COLUMN `approver_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`user_id`, `approver_id`, `fact_form_id`);

-- CreateIndex
CREATE UNIQUE INDEX `unique_user_approver_form` ON `approval`(`user_id`, `approver_id`, `fact_form_id`);
