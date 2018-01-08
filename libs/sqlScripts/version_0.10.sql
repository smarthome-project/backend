ALTER TABLE `users` 
ADD COLUMN `pin` VARCHAR(8) NOT NULL AFTER `user_type`;


UPDATE `info` SET `version` = '0.10';