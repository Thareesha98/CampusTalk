-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: localhost    Database: campustalk_db
-- ------------------------------------------------------
-- Server version	8.0.43-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `club_followers`
--

DROP TABLE IF EXISTS `club_followers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `club_followers` (
  `club_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`club_id`,`user_id`),
  KEY `FKbumfwgdwxa4cu35vbdbqkv4vg` (`user_id`),
  CONSTRAINT `FKbumfwgdwxa4cu35vbdbqkv4vg` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKf38mg83pwqnju2da74ghfub39` FOREIGN KEY (`club_id`) REFERENCES `clubs` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `club_followers`
--

LOCK TABLES `club_followers` WRITE;
/*!40000 ALTER TABLE `club_followers` DISABLE KEYS */;
INSERT INTO `club_followers` VALUES (4,12),(11,13),(4,14);
/*!40000 ALTER TABLE `club_followers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `club_members`
--

DROP TABLE IF EXISTS `club_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `club_members` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `role` varchar(255) DEFAULT NULL,
  `club_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKbwqgge4dgaaxukg2hytd9enhp` (`club_id`),
  KEY `FKrhejy2k7mkjakkwdckyps1jfo` (`user_id`),
  CONSTRAINT `FKbwqgge4dgaaxukg2hytd9enhp` FOREIGN KEY (`club_id`) REFERENCES `clubs` (`id`),
  CONSTRAINT `FKrhejy2k7mkjakkwdckyps1jfo` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `club_members`
--

LOCK TABLES `club_members` WRITE;
/*!40000 ALTER TABLE `club_members` DISABLE KEYS */;
/*!40000 ALTER TABLE `club_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clubs`
--

DROP TABLE IF EXISTS `clubs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clubs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` text,
  `name` varchar(255) DEFAULT NULL,
  `chairman_id` bigint DEFAULT NULL,
  `university_id` bigint DEFAULT NULL,
  `profile_pic_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKlw54ccca6j5qe4s56huqonwb7` (`chairman_id`),
  KEY `FKb5ot11r9gevdy8h5e1igfota6` (`university_id`),
  CONSTRAINT `FKb5ot11r9gevdy8h5e1igfota6` FOREIGN KEY (`university_id`) REFERENCES `universities` (`id`),
  CONSTRAINT `FKlw54ccca6j5qe4s56huqonwb7` FOREIGN KEY (`chairman_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clubs`
--

LOCK TABLES `clubs` WRITE;
/*!40000 ALTER TABLE `clubs` DISABLE KEYS */;
INSERT INTO `clubs` VALUES (4,'Computer Science Student Community','CSSC',13,1,'https://campus-talk-images.s3.amazonaws.com/club-logos/d193af63-63af-43ca-b72c-9b7ae8e64303_cssc.jpeg'),(11,'Let\'s Song','Ru Musix',13,1,'https://campus-talk-images.s3.amazonaws.com/club-logos/739d83d5-5893-48bc-9085-ddee0fc30b37_music_club_logo.png'),(13,'Meeka tamai Gatta','CS Gattaa',14,7,'https://campus-talk-images.s3.amazonaws.com/club-logos/d7e5e3a3-b71f-44a5-b3e6-9a70ab5c9be8_dcs.png');
/*!40000 ALTER TABLE `clubs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` text,
  `created_at` datetime(6) DEFAULT NULL,
  `post_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `text` text,
  PRIMARY KEY (`id`),
  KEY `FKh4c7lvsc298whoyd4w9ta25cr` (`post_id`),
  KEY `FK8omq0tc18jd43bu5tjh6jvraq` (`user_id`),
  CONSTRAINT `FK8omq0tc18jd43bu5tjh6jvraq` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKh4c7lvsc298whoyd4w9ta25cr` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (6,NULL,'2025-11-06 22:44:22.396636',12,14,'Gammakk'),(7,NULL,'2025-11-07 00:28:28.607476',12,14,'Supiri');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date_time` datetime(6) DEFAULT NULL,
  `description` text,
  `location` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `club_id` bigint DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKmt9rjn9hbh6g8isda7c1g14bd` (`club_id`),
  KEY `FKmpv90a1lsx9lcxsj7xjcvvsxg` (`created_by`),
  CONSTRAINT `FKmpv90a1lsx9lcxsj7xjcvvsxg` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `FKmt9rjn9hbh6g8isda7c1g14bd` FOREIGN KEY (`club_id`) REFERENCES `clubs` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'2025-12-01 23:09:00.000000','𝐑𝐮𝐬𝐡 𝐂𝐨𝐝𝐞𝐫 𝐕 𝟐.𝟎 -  Be a part of the Revolution... Let\'s Rush Apply now!','Matara','RushCoder 2025',4,13,'https://campus-talk-images.s3.amazonaws.com/event-images/c02bbd82-0fc3-453c-8cb0-8312172acc4a_rushCorder.jpeg'),(2,'2025-11-13 21:23:00.000000','Flashbackkkk','Matara','Musical Show',11,13,'https://campus-talk-images.s3.amazonaws.com/event-images/16f257b9-f14c-4346-aaa7-f21d272b514d_test-img.jpeg');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `is_read` bit(1) DEFAULT NULL,
  `reference_id` bigint DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK9y21adhxn0ayjhfocscqox7bh` (`user_id`),
  CONSTRAINT `FK9y21adhxn0ayjhfocscqox7bh` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` text,
  `created_at` datetime(6) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `club_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `likes` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKhj8dylgk572syl0gsa8of997a` (`club_id`),
  KEY `FK5lidm6cqbc7u4xhqpxm898qme` (`user_id`),
  CONSTRAINT `FK5lidm6cqbc7u4xhqpxm898qme` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKhj8dylgk572syl0gsa8of997a` FOREIGN KEY (`club_id`) REFERENCES `clubs` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (10,'Rush Coder V 2.0 ','2025-11-06 22:28:35.614287','https://campus-talk-images.s3.amazonaws.com/club-posts/5a930c1c-d5ab-4d97-a444-e85c3ca6bd24_rushCorder.jpeg',4,13,0),(11,'NadaGama','2025-11-06 22:31:49.105189','https://campus-talk-images.s3.amazonaws.com/club-posts/ed178162-74ca-4653-a0eb-0af7d624a524_nadagama.png',11,13,0),(12,'Welcome to Computer Science','2025-11-06 22:43:51.497020','https://campus-talk-images.s3.amazonaws.com/club-posts/d5c31fbd-12b4-4d85-ba30-0a5b87a6d73b_cs-batches.png',13,14,2);
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_token`
--

DROP TABLE IF EXISTS `refresh_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_token` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `expiry_date` datetime(6) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKf95ixxe7pa48ryn1awmh2evt7` (`user_id`),
  CONSTRAINT `FKjtx87i0jvq2svedphegvdwcuy` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_token`
--

LOCK TABLES `refresh_token` WRITE;
/*!40000 ALTER TABLE `refresh_token` DISABLE KEYS */;
/*!40000 ALTER TABLE `refresh_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_tokens`
--

DROP TABLE IF EXISTS `refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_tokens` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `expiry_date` datetime(6) NOT NULL,
  `token` varchar(255) NOT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKghpmfn23vmxfu3spu3lfg4r2d` (`token`),
  UNIQUE KEY `UK7tdcd6ab5wsgoudnvj7xf1b7l` (`user_id`),
  CONSTRAINT `FK1lih5y2npsf8u5o3vhdb9y0os` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
INSERT INTO `refresh_tokens` VALUES (2,'2025-11-07 19:48:17.526159','c6b116df-5862-41e5-bd55-d41c823380cd',6),(9,'2025-11-09 06:46:06.557461','61e72446-792d-4ece-a2cc-1c84b97d814d',8),(12,'2025-11-09 07:22:06.900074','96180e61-1e2c-43d3-a65e-51d076f7624f',5),(27,'2025-11-09 12:30:55.481664','ae0e586d-d75b-4747-9ac7-f944d5a46cc7',10),(28,'2025-11-09 12:36:13.849916','df5260eb-bc6f-4415-be50-99b225cea9ce',11),(39,'2025-11-10 04:08:09.903222','09dd9f23-c1ef-4115-a385-4a464a858b57',9),(95,'2025-11-13 18:58:08.098551','3c6e6073-5fc7-4ac8-98b2-34c3bf72a0ed',14),(98,'2025-11-22 17:28:02.325908','5256bde4-854a-40ca-8019-2a844cf011c6',12),(99,'2025-11-22 17:38:12.080659','631e2944-95e8-47a2-afd6-fbc31083a5b1',13);
/*!40000 ALTER TABLE `refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rsvp`
--

DROP TABLE IF EXISTS `rsvp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rsvp` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `status` varchar(255) DEFAULT NULL,
  `timestamp` datetime(6) DEFAULT NULL,
  `event_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK1w4gusckkqul6iyf6r0teov88` (`event_id`),
  KEY `FKku8yxwk1j6g9muxm7c2f1dmwv` (`user_id`),
  CONSTRAINT `FK1w4gusckkqul6iyf6r0teov88` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`),
  CONSTRAINT `FKku8yxwk1j6g9muxm7c2f1dmwv` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rsvp`
--

LOCK TABLES `rsvp` WRITE;
/*!40000 ALTER TABLE `rsvp` DISABLE KEYS */;
INSERT INTO `rsvp` VALUES (2,'INTERESTED','2025-11-04 00:58:01.825656',1,12),(4,'GOING','2025-11-06 22:02:09.577617',2,13),(5,'INTERESTED','2025-11-06 22:02:13.963611',1,13),(6,'INTERESTED','2025-11-07 00:29:13.312616',1,14);
/*!40000 ALTER TABLE `rsvp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `universities`
--

DROP TABLE IF EXISTS `universities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `universities` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKb5hrh2ogsxka1cp118awltx1i` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `universities`
--

LOCK TABLES `universities` WRITE;
/*!40000 ALTER TABLE `universities` DISABLE KEYS */;
INSERT INTO `universities` VALUES (1,'Leading university in Sri Lanka','Colombo','https://example.com/colombo.png','University of Colombo'),(2,'Top engineering university','Moratuwa','https://example.com/moratuwa.png','University of Moratuwa'),(3,'Oldest and most scenic university','Kandy','https://example.com/peradeniya.png','University of Peradeniya'),(5,'Known for humanities and science','Kelaniya','https://example.com/kelaniya.png','University of Kelaniya'),(6,'Main university in the Northern Province','Jaffna','https://example.com/jaffna.png','University of Jaffna'),(7,'Leading university in the South','Matara','https://example.com/ruhuna.png','University of Ruhuna'),(8,'Serving the Eastern Province','Vantharumoolai','https://example.com/eastern.png','Eastern University, Sri Lanka'),(9,'Located in Belihuloya','Belihuloya','https://example.com/sabaragamuwa.png','Sabaragamuwa University of Sri Lanka'),(10,'University in the North Central Province','Mihintale','https://example.com/rajarata.png','Rajarata University of Sri Lanka'),(11,'Located in Oluvil','Oluvil','https://example.com/seu.png','South Eastern University of Sri Lanka'),(12,'University in the North Western Province','Kuliyapitiya','https://example.com/wayamba.png','Wayamba University of Sri Lanka'),(13,'National university in Badulla','Badulla','https://example.com/uwu.png','Uva Wellassa University');
/*!40000 ALTER TABLE `universities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `department` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `profile_pic_url` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `year` varchar(255) DEFAULT NULL,
  `university_id` bigint DEFAULT NULL,
  `bio` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  KEY `FKm6cuniuttvvmhstb2s32jsotf` (`university_id`),
  CONSTRAINT `FKm6cuniuttvvmhstb2s32jsotf` FOREIGN KEY (`university_id`) REFERENCES `universities` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'IT','admin@example.com','Admin User','$2a$10$J4sIJJcbwa45wpF73f1nVunXKH6JCdcP4v.52dOql/dPicH0KvarG',NULL,'ADMIN','4',NULL,NULL),(3,'CS','thareesha@uom.lk','Thareesha','$2a$10$ChLpqzXhgvZL7Ezt9XjIm.nuBcBkmM1FuqXf2kw5O69uDaBanKl6C',NULL,'STUDENT','3',NULL,NULL),(4,'IT','tharindu@uoc.lk','Tharindu Perera','$2a$10$H7mPJbDncChM9l7mOk.MnOPTCjKzY1k.WGBPIzmhw4mzJQbJVwGhq',NULL,'STUDENT','2',1,NULL),(5,NULL,'admin@campustalk.com','Admin User','$2a$10$5d/LQZnbfXsDWKUebJW2lu6VdFQNWKEx4MCPZFAMrKcSKFWVY0xT2','https://campus-talk-images.s3.amazonaws.com/user-profile-pics/a57b06eb-320c-42aa-aa1f-a47e42533f5f_test-img.jpeg','ADMIN',NULL,1,NULL),(6,NULL,'chairman@campustalk.com','John Chairman','$2a$10$7epIZdxGuyk2Nq1Vc5HnWuQplUjJBg0M8twUGs6in8Njj.c4d9vx.',NULL,'CHAIRMAN',NULL,1,NULL),(8,NULL,'ff@gm.com','fvdvf','$2a$10$4ZsbkiJ3t8zRVkMqrReuHefM23lqzk9CXcV7uz.pINW6KOfdeWykq',NULL,'STUDENT',NULL,1,NULL),(9,NULL,'thareesha98@gmail.com','Thareesha Marasinghe','$2a$10$olT1mueTkBcZhZJFU1yfjOXw.nP6LC1b8tC1QOq.fxXoTI8j5UsCq','https://campus-talk-images.s3.amazonaws.com/user-profile-pics/344af52a-7a9c-4f30-9967-0c9c99a52a06_test-img.jpeg','STUDENT',NULL,1,'Helloo world.. I am from ruhuna'),(10,NULL,'ss@gm.com','mayura','$2a$10$tZOWq4dcw9TxSu4iC.ZCN.MSYuTET.5CJQI57naAjgOmO9zsmpq3.',NULL,'STUDENT',NULL,1,NULL),(11,NULL,'nnn@gmail.com','Naveen','$2a$10$RU6i1gJ4usBahynxzM1uvuvGu5c9C780aVKe6WHE.7f.DxZd2/fz.',NULL,'STUDENT',NULL,1,NULL),(12,NULL,'mayura@gmail.com','Mayura Pabasara','$2a$10$gU3Rzvfm6.gsQXwyIsbBm.KpKzQ6ojnd6pqNXvOSXY.f3eEtDSG2y','https://campus-talk-images.s3.amazonaws.com/user-profile-pics/6c527894-f190-4b73-95fb-f3eb93a25270_1720067517707.jpeg','STUDENT',NULL,1,'I am the Batch representative at University of Ruhuna Department of Computer Science'),(13,NULL,'nandul@gmail.com','Nandul Hissella','$2a$10$j8wFKggD/bUKNYPUd1MnCuZb4Oxls.3EFlae1T7DHaPw5loH3dLom','https://campus-talk-images.s3.amazonaws.com/user-profile-pics/08c9bf60-7d6b-468c-9368-2f2ef4ad4cc3_test-img.jpeg','CHAIRMAN',NULL,1,'Biiidi gahamu'),(14,NULL,'mayura1@gmail.com','Mayura Pabasara','$2a$10$/8z4D1Y9laQUaxLuibrMieSYSwUa9lrmkd6kEp0rIGlHzCNNrlRh2','https://campus-talk-images.s3.amazonaws.com/user-profile-pics/56c37d4b-ffc5-4b87-a7d8-e53bb28da98a_1720067517707.jpeg','CHAIRMAN',NULL,7,'Batch representative of 13th batch of Computer Science ');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-15 23:35:27
