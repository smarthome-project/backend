CREATE TABLE IF NOT EXISTS `pin_settings` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `type` varchar(60) NOT NULL,
  `pin_plus` int(11) UNSIGNED NOT NULL,
  `pin_minus` int(11) UNSIGNED NOT NULL ,
  `pin_data_one` int(11) UNSIGNED,
  `pin_data_two` int(11) UNSIGNED,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `inputs` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `pin_settings_id` int(11) UNSIGNED NOT NULL, 
  `number` int(11) UNSIGNED NOT NUll,
  `type` varchar(60) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `devices` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `input_id`int(11) UNSIGNED NOT NULL,
  `room_id`int(11) UNSIGNED,
  `state` json DEFAULT NULL,
  `name` varchar(60) NOT NULL,
  `type` varchar(60) NOT NULL,
  `img` varchar(60),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `login` varchar(30) NOT NULL,
  `pass` varchar(128) NOT NULL,
  `imie` varchar(30) DEFAULT NULL,
  `nazwisko` varchar(30) DEFAULT NULL,
  `user_type` int(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `users`
  ADD UNIQUE KEY `login_uniq` (`login`);

CREATE TABLE IF NOT EXISTS`rooms` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(40) DEFAULT NULL,
  `image_path` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS`info` (
  `version` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO info(version) VALUES('0.1');

