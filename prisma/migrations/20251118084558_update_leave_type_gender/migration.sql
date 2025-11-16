/*
  Warnings:

  - The values [femal] on the enum `leave_type_gender` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `leave_type` MODIFY `gender` ENUM('male', 'female', 'all') NOT NULL DEFAULT 'all';
