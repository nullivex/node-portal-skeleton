ALTER TABLE `SaleLeap`.`items`
ADD COLUMN `SellerId` INT(11) NULL DEFAULT NULL AFTER `updatedAt`;
