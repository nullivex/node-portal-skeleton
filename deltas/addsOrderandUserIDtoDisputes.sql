ALTER TABLE `SaleLeap`.`disputes`
ADD COLUMN `OrderId` INT(11) NULL DEFAULT NULL AFTER `updatedAt`,
ADD COLUMN `UserId` INT(11) NULL DEFAULT NULL AFTER `OrderId`;