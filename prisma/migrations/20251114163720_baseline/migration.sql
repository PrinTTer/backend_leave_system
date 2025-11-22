-- CreateTable
CREATE TABLE `calendar` (
    `calendar_id` INTEGER NOT NULL AUTO_INCREMENT,
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
    `fact_form_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `leave_type_id` INTEGER NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `total_day` FLOAT NOT NULL DEFAULT 0,
    `fiscal_year` INTEGER NOT NULL,
    `status` ENUM('draft', 'pending', 'approve', 'reject', 'cancel') NOT NULL,
    `approve_date` DATE NOT NULL,
    `note` VARCHAR(225) NULL,
    `file_leave` VARCHAR(45) NOT NULL,
    `update_at` TIMESTAMP(0) NOT NULL,
    `create_at` TIMESTAMP(0) NOT NULL,

    INDEX `fk_fact_form_leave_type1_idx`(`leave_type_id`),
    PRIMARY KEY (`fact_form_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `leave_approval_rule` (
    `leave_approval_rule_id` INTEGER NOT NULL AUTO_INCREMENT,
    `leave_type_id` INTEGER NOT NULL,
    `leave_less_than` INTEGER NOT NULL,
    `approval_level` INTEGER NOT NULL,

    INDEX `fk_leave_approval_rule_leave_type1_idx`(`leave_type_id`),
    PRIMARY KEY (`leave_approval_rule_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `leave_type` (
    `leave_type_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `gender` ENUM('male', 'femal', 'all') NOT NULL DEFAULT 'all',
    `is_count_vacation` TINYINT NOT NULL DEFAULT 0,
    `service_year` INTEGER NOT NULL,
    `number_approver` INTEGER NOT NULL,
    `category` ENUM('general', 'vacation') NOT NULL,
    `update_at` TIMESTAMP(0) NOT NULL,
    `create_at` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`leave_type_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `leave_type_document` (
    `leave_type_document_id` INTEGER NOT NULL AUTO_INCREMENT,
    `leave_type_id` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `file_type` ENUM('pdf', 'png', 'doc', 'jpg') NOT NULL,
    `is_required` TINYINT NOT NULL DEFAULT 0,

    INDEX `fk_leave_type_document_leave_type1_idx`(`leave_type_id`),
    PRIMARY KEY (`leave_type_document_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vacation_rule` (
    `vacation_rule_id` INTEGER NOT NULL AUTO_INCREMENT,
    `leave_type_id` INTEGER NOT NULL,
    `service_year` INTEGER NOT NULL,
    `annual_leave` INTEGER NOT NULL,
    `max_leave` INTEGER NOT NULL,

    INDEX `fk_vacation_rule_leave_type1_idx`(`leave_type_id`),
    PRIMARY KEY (`vacation_rule_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `approval` (
    `user_id` INTEGER NOT NULL,
    `aprover_id` INTEGER NOT NULL,
    `fact_form_id` INTEGER NOT NULL,
    `status` ENUM('approve', 'reject', 'pending') NOT NULL,

    UNIQUE INDEX `user_id_UNIQUE`(`user_id`),
    UNIQUE INDEX `aprover_id_UNIQUE`(`aprover_id`),
    INDEX `fk_approval_fact_form1_idx`(`fact_form_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fact_leave_credit` (
    `user_id` INTEGER NOT NULL,
    `leave_type_id` INTEGER NOT NULL,
    `annual_leave` FLOAT NOT NULL,
    `used_leave` FLOAT NOT NULL,
    `left_leave` FLOAT NOT NULL,

    UNIQUE INDEX `user_id_UNIQUE`(`user_id`),
    INDEX `fk_fact_leave_credit_leave_type1_idx`(`leave_type_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `fact_form` ADD CONSTRAINT `fk_fact_form_leave_type` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_type`(`leave_type_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `leave_approval_rule` ADD CONSTRAINT `fk_leave_approval_rule_leave_type1` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_type`(`leave_type_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `leave_type_document` ADD CONSTRAINT `fk_leave_type_document_leave_type1` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_type`(`leave_type_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `vacation_rule` ADD CONSTRAINT `fk_vacation_rule_leave_type1` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_type`(`leave_type_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `approval` ADD CONSTRAINT `fk_approval_fact_form1` FOREIGN KEY (`fact_form_id`) REFERENCES `fact_form`(`fact_form_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `fact_leave_credit` ADD CONSTRAINT `fk_fact_leave_credit_leave_type1` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_type`(`leave_type_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
