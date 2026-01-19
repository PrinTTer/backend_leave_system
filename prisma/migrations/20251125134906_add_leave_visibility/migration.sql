-- CreateTable
CREATE TABLE `leave_visibility` (
    `leave_visibility_id` INTEGER NOT NULL AUTO_INCREMENT,
    `viewer_user_id` INTEGER NOT NULL,
    `target_user_id` INTEGER NOT NULL,
    `created_by_user_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `uk_viewer_target`(`viewer_user_id`, `target_user_id`),
    PRIMARY KEY (`leave_visibility_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
