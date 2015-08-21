ALTER TABLE `Saleleap`.`Disputes`
ADD COLUMN `actionDescription` VARCHAR(255) NULL DEFAULT NULL AFTER `actionRequested`;
