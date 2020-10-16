# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.26)
# Database: livinglibrary
# Generation Time: 2020-10-16 23:27:04 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table tbl_donations
# ------------------------------------------------------------

CREATE TABLE `tbl_donations` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `donor` text,
  `who_to_notify` text,
  `recipient` text,
  `book` text,
  `is_completed` tinyint(1) NOT NULL DEFAULT '0',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `is_completed_index` (`is_completed`),
  KEY `created_index` (`created`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `tbl_donations` WRITE;
/*!40000 ALTER TABLE `tbl_donations` DISABLE KEYS */;

INSERT INTO `tbl_donations` (`id`, `donor`, `who_to_notify`, `recipient`, `book`, `is_completed`, `created`)
VALUES
	(1,'{\"donor_title\":\"Ms.\",\"donor_first_name\":\"Jane\",\"donor_last_name\":\"Doe\",\"donor_address\":\"123 Test Dr\",\"donor_city\":\"Denver\",\"donor_state\":\"CO\",\"donor_zip\":\"80208\",\"donor_amount_of_donation\":100,\"donor_date_of_donation\":\"2020-10-16\",\"donor_notes\":\"Here are some notes about the donation.\",\"donor_subject_areas\":[\"Mathematics\",\"Computer Science\"]}','[{\"notify_title\":\"Mr.\",\"notify_first_name\":\"John\",\"notify_last_name\":\"Doe\",\"notify_address\":\"456 Test Dr\",\"notify_city\":\"Denver\",\"notify_state\":\"CO\",\"notify_zip\":\"80208\",\"notify_relation_to_donor\":\"Father\"},{\"notify_title\":\"Ms.\",\"notify_first_name\":\"Jessica\",\"notify_last_name\":\"Doe\",\"notify_address\":\"789 Test Dr\",\"notify_city\":\"Denver\",\"notify_state\":\"CO\",\"notify_zip\":\"80208\",\"notify_relation_to_donor\":\"Aunt\"}]','{\"recipient_title\":\"Mrs.\",\"recipient_first_name\":\"Jennifer\",\"recipient_last_name\":\"Doe\",\"recipient_donation_type\":\"In Honor of\"}','{\"book_author_name\":\"Jill Smith\",\"book_title\":\"A Book about Math\",\"book_bibliographic_number\":\"ABC123\",\"book_call_number\":\"DEF456\",\"book_publisher\":\"\",\"book_date_published\":\"\",\"book_timestamp\":\"2020-10-16T23:14:03.260Z\"}',1,'2020-10-16 16:11:42');

/*!40000 ALTER TABLE `tbl_donations` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table tbl_relationships_lookup
# ------------------------------------------------------------

CREATE TABLE `tbl_relationships_lookup` (
  `relationship_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `relationship` varchar(255) NOT NULL DEFAULT '',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`relationship_id`),
  KEY `is_active_index` (`is_active`),
  KEY `relationship_index` (`relationship`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `tbl_relationships_lookup` WRITE;
/*!40000 ALTER TABLE `tbl_relationships_lookup` DISABLE KEYS */;

INSERT INTO `tbl_relationships_lookup` (`relationship_id`, `relationship`, `is_active`, `timestamp`)
VALUES
	(2,'Son',1,'2011-03-22 11:40:27'),
	(3,'Daughter',1,'2011-03-22 11:40:37'),
	(4,'Father',1,'2011-05-09 13:22:31'),
	(5,'Mother',1,'2020-10-16 16:21:59'),
	(6,'Uncle',1,'2011-05-11 12:39:02'),
	(7,'Aunt',1,'2011-05-11 13:46:31'),
	(9,'Friend',1,'2011-06-10 09:46:12'),
	(10,'Spouse',1,'2020-10-16 16:22:08');

/*!40000 ALTER TABLE `tbl_relationships_lookup` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table tbl_states_lookup
# ------------------------------------------------------------

CREATE TABLE `tbl_states_lookup` (
  `state_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `state` varchar(10) NOT NULL DEFAULT '',
  `state_full` varchar(255) NOT NULL DEFAULT '',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`state_id`),
  KEY `is_active_index` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `tbl_states_lookup` WRITE;
/*!40000 ALTER TABLE `tbl_states_lookup` DISABLE KEYS */;

INSERT INTO `tbl_states_lookup` (`state_id`, `state`, `state_full`, `is_active`, `timestamp`)
VALUES
	(2,'AL','ALABAMA',1,'2011-05-23 15:46:35'),
	(3,'AK','ALASKA',1,'2011-05-23 15:46:55'),
	(4,'AS','AMERICAN SAMOA',1,'2011-05-23 15:47:16'),
	(5,'AZ','ARIZONA',1,'2011-05-23 15:47:38'),
	(6,'AR','ARKANSAS',1,'2011-05-23 15:47:59'),
	(7,'CA','CALIFORNIA',1,'2011-05-23 15:48:21'),
	(8,'CO','COLORADO',1,'2011-05-23 15:48:41'),
	(9,'CT','CONNECTICUT',1,'2011-05-23 15:49:28'),
	(10,'DE','DELAWARE',1,'2011-05-23 15:49:47'),
	(11,'DC','DISTRICT OF COLUMBIA',1,'2011-05-23 15:50:10'),
	(12,'FM','FEDERATED STATES OF MICRONESIA',1,'2011-05-23 15:50:33'),
	(13,'FL','FLORIDA',1,'2011-05-23 15:50:57'),
	(14,'GA','GEORGIA',1,'2011-05-23 15:51:17'),
	(15,'GU','GUAM',1,'2011-05-23 15:51:35'),
	(16,'HI','HAWAII ',1,'2011-05-23 15:52:03'),
	(17,'ID','IDAHO',1,'2011-05-23 15:52:22'),
	(18,'IL','ILLINOIS',1,'2011-05-23 15:53:01'),
	(19,'IN','INDIANA',1,'2011-05-23 15:53:28'),
	(20,'IA','IOWA',1,'2011-05-23 15:53:51'),
	(21,'KS','KANSAS',1,'2011-05-23 15:54:08'),
	(22,'KY','KENTUCKY',1,'2011-05-23 15:54:26'),
	(23,'LA','LOUISIANA',1,'2011-05-24 10:01:32'),
	(24,'ME','MAINE',1,'2011-05-24 10:01:56'),
	(25,'MH','MARSHALL ISLANDS',1,'2011-05-24 10:02:32'),
	(26,'MD','MARYLAND',1,'2011-05-24 10:02:58'),
	(27,'MA','MASSACHUSETTS ',1,'2011-05-24 10:03:23'),
	(28,'MI','MICHIGAN',1,'2011-05-24 10:03:46'),
	(29,'MN','MINNESOTA',1,'2011-05-24 10:05:02'),
	(30,'MS','MISSISSIPPI',1,'2011-05-24 10:05:21'),
	(31,'MO','MISSOURI',1,'2011-05-24 10:06:06'),
	(32,'MT','MONTANA',1,'2011-05-24 10:06:23'),
	(33,'NE','NEBRASKA',1,'2011-05-24 10:06:39'),
	(34,'NV','NEVADA',1,'2011-05-24 10:07:01'),
	(35,'NH','NEW HAMPSHIRE',1,'2011-05-24 10:07:19'),
	(36,'NJ','NEW JERSEY',1,'2011-05-24 10:07:33'),
	(37,'NM','NEW MEXICO',1,'2011-05-24 10:09:13'),
	(38,'NY','NEW YORK',1,'2011-05-24 10:09:33'),
	(39,'NC','NORTH CAROLINA',1,'2011-05-24 10:09:50'),
	(40,'ND','NORTH DAKOTA',1,'2011-05-24 10:10:06'),
	(41,'MP','NORTHERN MARIANA ISLANDS',1,'2011-05-24 10:10:21'),
	(42,'OH','OHIO',1,'2011-05-24 10:10:38'),
	(43,'OK','OKLAHOMA',1,'2011-05-24 10:10:52'),
	(44,'OR','OREGON',1,'2011-05-24 10:11:09'),
	(45,'PW','PALAU',1,'2011-05-24 10:11:27'),
	(46,'PA','PENNSYLVANIA',1,'2011-05-24 10:11:44'),
	(47,'PR','PUERTO RICO',1,'2011-05-24 10:11:58'),
	(48,'RI','RHODE ISLAND',1,'2011-05-24 10:12:15'),
	(49,'SC','SOUTH CAROLINA',1,'2011-05-24 10:12:32'),
	(50,'SD','SOUTH DAKOTA',1,'2011-05-24 10:12:48'),
	(51,'TN','TENNESSEE',1,'2011-05-24 10:13:04'),
	(52,'TX','TEXAS',1,'2011-05-24 10:13:20'),
	(53,'UT','UTAH',1,'2011-05-24 10:13:35'),
	(54,'VT','VERMONT',1,'2011-05-24 10:13:51'),
	(55,'VI','VIRGIN ISLANDS',1,'2011-05-24 10:14:08'),
	(56,'VA','VIRGINIA',1,'2011-05-24 10:14:26'),
	(57,'WA','WASHINGTON',1,'2011-05-24 10:14:42'),
	(58,'WV','WEST VIRGINIA',1,'2011-05-24 10:14:56'),
	(59,'WI','WISCONSIN',1,'2011-05-24 10:15:13'),
	(60,'WY','WYOMING',1,'2011-05-24 10:15:30');

/*!40000 ALTER TABLE `tbl_states_lookup` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table tbl_subject_areas_lookup
# ------------------------------------------------------------

CREATE TABLE `tbl_subject_areas_lookup` (
  `subject_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `subject` varchar(255) NOT NULL DEFAULT '',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`subject_id`),
  KEY `is_active_index` (`is_active`),
  KEY `subject_index` (`subject`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `tbl_subject_areas_lookup` WRITE;
/*!40000 ALTER TABLE `tbl_subject_areas_lookup` DISABLE KEYS */;

INSERT INTO `tbl_subject_areas_lookup` (`subject_id`, `subject`, `is_active`, `timestamp`)
VALUES
	(35,'General Interest',1,'2011-02-22 10:24:35'),
	(36,'General Arts & Humanities',1,'2011-02-22 10:24:51'),
	(37,'Art',1,'2011-02-22 10:25:02'),
	(38,'English Literature',1,'2011-02-22 10:25:18'),
	(39,'Performing Arts',1,'2011-02-22 10:25:30'),
	(40,'Theatre',1,'2011-02-22 10:25:40'),
	(41,'Foreign Language',1,'2011-02-22 10:25:55'),
	(42,'History',1,'2011-02-22 10:26:07'),
	(43,'Music',1,'2011-02-22 10:26:16'),
	(44,'Philosophy',1,'2011-02-22 10:26:29'),
	(45,'Religion',1,'2011-02-22 10:27:04'),
	(46,'Library Science',1,'2011-02-22 10:27:12'),
	(47,'Mathematics',1,'2011-02-22 10:27:28'),
	(48,'Computer Science',1,'2011-02-22 10:27:40'),
	(49,'General Science',1,'2011-02-22 10:27:56'),
	(50,'Biology',1,'2011-02-22 10:28:06'),
	(51,'Chemistry',1,'2011-02-22 10:28:22'),
	(52,'Engineering',1,'2011-02-22 10:28:39'),
	(53,'Geography',1,'2011-02-22 10:28:53'),
	(54,'Geology',1,'2011-02-22 10:29:38'),
	(55,'Physics',1,'2011-02-22 10:29:48'),
	(56,'Astronomy',1,'2011-02-22 10:29:59'),
	(57,'Sports Science/Physical Education',1,'2011-02-22 10:30:22'),
	(58,'General Social Science',1,'2011-02-22 10:30:44'),
	(59,'Anthropology',1,'2011-02-22 10:31:08'),
	(60,'Economics/Business',1,'2011-02-22 10:31:23'),
	(61,'Education',1,'2011-02-22 10:31:33'),
	(62,'Communication',1,'2011-02-22 10:31:44'),
	(63,'Film',1,'2011-02-22 10:31:56'),
	(64,'Political Science/International Relations',1,'2011-02-22 10:32:14'),
	(65,'Psychology',1,'2011-02-22 10:32:26'),
	(66,'Sociology',1,'2011-02-22 10:32:46'),
	(67,'Cookbooks',1,'2011-02-22 10:32:56'),
	(68,'Gender and Women\'s Studies',1,'2011-02-22 10:33:12'),
	(80,'Women in Business',1,'2011-06-02 13:40:14');

/*!40000 ALTER TABLE `tbl_subject_areas_lookup` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table tbl_titles_lookup
# ------------------------------------------------------------

CREATE TABLE `tbl_titles_lookup` (
  `title_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(20) NOT NULL DEFAULT '',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`title_id`),
  KEY `is_active_index` (`is_active`),
  KEY `title_index` (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `tbl_titles_lookup` WRITE;
/*!40000 ALTER TABLE `tbl_titles_lookup` DISABLE KEYS */;

INSERT INTO `tbl_titles_lookup` (`title_id`, `title`, `is_active`, `timestamp`)
VALUES
	(2,'Mr.',1,'2011-02-22 09:55:05'),
	(3,'Mrs.',1,'2011-02-22 09:55:12'),
	(4,'Dr.',1,'2011-05-09 12:24:04'),
	(5,'Ms.',1,'2011-05-11 12:05:58'),
	(8,'Mr. and Mrs.',1,'2012-03-14 13:44:20');

/*!40000 ALTER TABLE `tbl_titles_lookup` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
