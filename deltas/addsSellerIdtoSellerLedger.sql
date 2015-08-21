ALTER TABLE `SaleLeap`.`sellerledgers`
ADD COLUMN `SellerId` INT(11) NULL DEFAULT NULL AFTER `updatedAt`;