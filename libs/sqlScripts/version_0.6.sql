CREATE TABLE `secret` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `secretPart` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`id`));

UPDATE `info` SET `version` = '0.6';