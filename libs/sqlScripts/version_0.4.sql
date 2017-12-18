
TRUNCATE `images`;

LOCK TABLES `images` WRITE;
/*!40000 ALTER TABLE `images` DISABLE KEYS */;

INSERT INTO `images` (`id`, `name`, `path`, `type`)
VALUES
	(1,'salon1','rooms/salon1.jpg','room'),
	(2,'salon2','rooms/salon2.jpg','room'),
	(3,'salon3','rooms/salon3.jpg','room'),
	(4,'salon4','rooms/salon4.jpg','room'),
	(5,'kuchnia1','rooms/kuchnia1.jpg','room'),
	(6,'kuchnia2','rooms/kuchnia2.jpg','room'),
	(7,'kuchnia3','rooms/kuchnia3.jpg','room'),
	(8,'sypialnia1','rooms/sypialnia1.jpg','room'),
	(9,'sypialnia2','rooms/sypialnia2.jpg','room'),
	(10,'sypialnia3','rooms/sypialnia3.jpg','room'),
	(11,'sypialnia4','rooms/sypialnia4.jpg','room'),
	(12,'lazienka1','rooms/lazienka1.jpg','room'),
	(13,'lazienka2','rooms/lazienka2.jpg','room'),
	(14,'hol1','rooms/hol1.jpg','room'),
	(15,'hol2','rooms/hol2.jpg','room'),
	(16,'hol3','rooms/hol3.jpg','room'),
	(17,'ogrod1','rooms/ogrod1.jpg','room'),
	(18,'ogrod2','rooms/ogrod2.jpg','room'),
	(19,'ogrod3','rooms/ogrod3.jpg','room');

/*!40000 ALTER TABLE `images` ENABLE KEYS */;
UNLOCK TABLES;

TRUNCATE `devices_types`;

LOCK TABLES `devices_types` WRITE;
/*!40000 ALTER TABLE `devices_types` DISABLE KEYS */;
INSERT INTO `devices_types` VALUES (1,'POWER','{\"active\": false}','zasilanie'),(2,'LEDRGB','{\"rgb\": \"#000000\"}','ledy rgb'),(3,'LEDCW','{\"rgb\": \"#000000\"}','ledy ciepłe zimne');
/*!40000 ALTER TABLE `devices_types` ENABLE KEYS */;
UNLOCK TABLES;





INSERT INTO info(version) VALUES('0.4');
