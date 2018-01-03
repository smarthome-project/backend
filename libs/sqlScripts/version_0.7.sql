CREATE TABLE `cameras` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `ip` VARCHAR(45) NOT NULL,
  `name` VARCHAR(64) NOT NULL,
  `room_id` int(11) UNSIGNED,
  `login` VARCHAR(64) NOT NULL,
  `pass` VARCHAR(128) NOT NULL,
  PRIMARY KEY (`id`));

UPDATE `info` SET `version` = '0.7';