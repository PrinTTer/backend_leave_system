-- CreateTable
CREATE TABLE `calendar` (
    `calendar_id` INTEGER NOT NULL,
    `calendar_type` ENUM('holiday', 'academic', 'fiscal') NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `total_day` INTEGER NOT NULL,
    `description` TEXT NULL,
    `update_at` TIMESTAMP(0) NOT NULL,
    `create_at` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`calendar_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fact_form` (
    `fact_form_id` VARCHAR(45) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `leave_type_id` INTEGER NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `total_day` FLOAT NOT NULL DEFAULT 0,
    `fiscal_year` INTEGER NOT NULL,
    `status` ENUM('draft', 'pending', 'approve', 'reject', 'cancel') NOT NULL,
    `approve_date` DATE NOT NULL,
    `note` VARCHAR(225) NULL,
    `file_leave` INTEGER NOT NULL,
    `update_at` TIMESTAMP(0) NOT NULL,
    `create_at` TIMESTAMP(0) NOT NULL,

    INDEX `fk_fact_form_leave_type_idx`(`leave_type_id`),
    PRIMARY KEY (`fact_form_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `leave_approval_rule` (
    `leave_approval_rule_id` INTEGER NOT NULL,
    `leave_type_id` INTEGER NOT NULL,
    `leave_less_than` INTEGER NOT NULL,
    `approval_level` VARCHAR(45) NOT NULL,

    INDEX `fk_leave_approval_rule_leave_type1_idx`(`leave_type_id`),
    PRIMARY KEY (`leave_approval_rule_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `leave_type` (
    `leave_type_id` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `gender` ENUM('male', 'femal', 'all') NOT NULL DEFAULT 'all',
    `count_vacation` TINYINT NOT NULL,
    `number_approver` INTEGER NOT NULL,
    `category` ENUM('general', 'vacation') NOT NULL,
    `update_at` TIMESTAMP(0) NOT NULL,
    `create_at` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`leave_type_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `leave_type_document` (
    `leave_type_document_id` INTEGER NOT NULL,
    `leave_type_id` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `file_type` ENUM('pdf', 'png', 'doc', 'jpg') NOT NULL,
    `is_required` TINYINT NOT NULL,

    INDEX `fk_leave_type_document_leave_type1_idx`(`leave_type_id`),
    PRIMARY KEY (`leave_type_document_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vacation_rule` (
    `vacation_rule_id` INTEGER NOT NULL,
    `leave_type_id` INTEGER NOT NULL,
    `service_year` INTEGER NOT NULL,
    `annual_leave` INTEGER NOT NULL,
    `max_leave` INTEGER NOT NULL,

    INDEX `fk_vacation_rule_leave_type1_idx`(`leave_type_id`),
    PRIMARY KEY (`vacation_rule_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `fact_form` ADD CONSTRAINT `fk_fact_form_leave_type` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_type`(`leave_type_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `leave_approval_rule` ADD CONSTRAINT `fk_leave_approval_rule_leave_type1` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_type`(`leave_type_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `leave_type_document` ADD CONSTRAINT `fk_leave_type_document_leave_type1` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_type`(`leave_type_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `vacation_rule` ADD CONSTRAINT `fk_vacation_rule_leave_type1` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_type`(`leave_type_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
