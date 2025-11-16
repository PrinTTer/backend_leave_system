-- DropIndex
DROP INDEX `user_id_UNIQUE` ON `fact_leave_credit`;

-- AlterTable
ALTER TABLE `fact_leave_credit` ADD PRIMARY KEY (`user_id`, `leave_type_id`);
