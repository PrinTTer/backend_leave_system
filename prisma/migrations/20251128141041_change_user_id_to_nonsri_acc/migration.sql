/*
  Warnings:

  - The primary key for the `approval` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `approver_id` on the `approval` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `approval` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `fact_form` table. All the data in the column will be lost.
  - The primary key for the `fact_leave_credit` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_id` on the `fact_leave_credit` table. All the data in the column will be lost.
  - You are about to drop the column `created_by_user_id` on the `leave_visibility` table. All the data in the column will be lost.
  - You are about to drop the column `target_user_id` on the `leave_visibility` table. All the data in the column will be lost.
  - You are about to drop the column `viewer_user_id` on the `leave_visibility` table. All the data in the column will be lost.
  - You are about to drop the column `approver_id` on the `requester` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `requester` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nontri_account,approver_nontri_account,fact_form_id]` on the table `approval` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[viewer_nontri_account,target_nontri_account]` on the table `leave_visibility` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nontri_account,approver_nontri_account,approver_order]` on the table `requester` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `approver_nontri_account` to the `approval` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nontri_account` to the `approval` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nontri_account` to the `fact_form` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nontri_account` to the `fact_leave_credit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `target_nontri_account` to the `leave_visibility` table without a default value. This is not possible if the table is not empty.
  - Added the required column `viewer_nontri_account` to the `leave_visibility` table without a default value. This is not possible if the table is not empty.
  - Added the required column `approver_nontri_account` to the `requester` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nontri_account` to the `requester` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `unique_user_approver_form` ON `approval`;

-- DropIndex
DROP INDEX `uk_viewer_target` ON `leave_visibility`;

-- DropIndex
DROP INDEX `user_id` ON `requester`;

-- AlterTable
ALTER TABLE `approval` DROP PRIMARY KEY,
    DROP COLUMN `approver_id`,
    DROP COLUMN `user_id`,
    ADD COLUMN `approver_nontri_account` VARCHAR(45) NOT NULL,
    ADD COLUMN `nontri_account` VARCHAR(45) NOT NULL,
    ADD PRIMARY KEY (`nontri_account`, `approver_nontri_account`, `fact_form_id`);

-- AlterTable
ALTER TABLE `fact_form` DROP COLUMN `user_id`,
    ADD COLUMN `nontri_account` VARCHAR(45) NOT NULL;

-- AlterTable
ALTER TABLE `fact_leave_credit` DROP PRIMARY KEY,
    DROP COLUMN `user_id`,
    ADD COLUMN `nontri_account` VARCHAR(45) NOT NULL,
    ADD PRIMARY KEY (`nontri_account`, `leave_type_id`);

-- AlterTable
ALTER TABLE `leave_visibility` DROP COLUMN `created_by_user_id`,
    DROP COLUMN `target_user_id`,
    DROP COLUMN `viewer_user_id`,
    ADD COLUMN `created_by_nontri_account` VARCHAR(45) NULL,
    ADD COLUMN `target_nontri_account` VARCHAR(45) NOT NULL,
    ADD COLUMN `viewer_nontri_account` VARCHAR(45) NOT NULL;

-- AlterTable
ALTER TABLE `requester` DROP COLUMN `approver_id`,
    DROP COLUMN `user_id`,
    ADD COLUMN `approver_nontri_account` VARCHAR(45) NOT NULL,
    ADD COLUMN `nontri_account` VARCHAR(45) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `unique_user_approver_form` ON `approval`(`nontri_account`, `approver_nontri_account`, `fact_form_id`);

-- CreateIndex
CREATE UNIQUE INDEX `uk_viewer_target` ON `leave_visibility`(`viewer_nontri_account`, `target_nontri_account`);

-- CreateIndex
CREATE UNIQUE INDEX `nontri_account` ON `requester`(`nontri_account`, `approver_nontri_account`, `approver_order`);
