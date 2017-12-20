CREATE TABLE IF NOT EXISTS `schedules` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `room_id` int(11) UNSIGNED,
  `device_id` int(11) UNSIGNED NOT NULL ,
  `cron` varchar(60) NOT NULL,
  `state` json NOT NULL,
  `transiton_time` int(11) DEFAULT NUll,
  `createdAt` DATETIME,
  `updatedAt` DATETIME,
  `active` TINYINT(1),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `devices_types` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `type`varchar(60) NOT NULL,
  `default` json NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


UPDATE `info` SET `version` = '0.2';

