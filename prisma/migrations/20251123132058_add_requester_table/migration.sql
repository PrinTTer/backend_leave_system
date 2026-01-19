-- CreateTable
CREATE TABLE `requester` (
    `user_id` INTEGER NOT NULL,
    `approver_id` INTEGER NOT NULL,
    `approver_order` INTEGER NOT NULL,

    UNIQUE INDEX `user_id`(`user_id`, `approver_id`, `approver_order`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
