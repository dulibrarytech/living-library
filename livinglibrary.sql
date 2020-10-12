# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.26)
# Database: livinglibrary
# Generation Time: 2020-10-12 20:31:01 +0000
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




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
