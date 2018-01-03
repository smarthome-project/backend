CREATE TABLE `alarms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `alarm` tinyint(1) unsigned DEFAULT '0',
  `secured` tinyint(1) unsigned DEFAULT '0',
  PRIMARY KEY (`id`)
);

INSERT INTO `alarms` (`alarm`, `secured`) VALUES ('0', '0');

UPDATE `info` SET `version` = '0.8';