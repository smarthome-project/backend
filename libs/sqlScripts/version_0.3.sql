ALTER TABLE devices_types ADD pl_name varchar(30);

CREATE TABLE IF NOT EXISTS `images` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(40) NOT NULL,
  `path` varchar(100)  NOT NULL ,
  `type` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO info(version) VALUES('0.3');
