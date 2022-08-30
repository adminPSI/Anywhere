/*
 Target Server Type    : MySQL
 Target Server Version : 50533
 File Encoding         : utf-8
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `calendar`
-- ----------------------------
DROP TABLE IF EXISTS `calendar`;
CREATE TABLE `calendar` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `parent_id` bigint(20) DEFAULT NULL,
  `created_dt` datetime NOT NULL,
  `created_by` varchar(60) NOT NULL,
  `description` varchar(400) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

-- ----------------------------
--  Table structure for `events`
-- ----------------------------
DROP TABLE IF EXISTS `events`;
CREATE TABLE `events` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(60) DEFAULT NULL,
  `description` varchar(400) DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `all_day` int(1) DEFAULT NULL,
  `calendar_id` bigint(20) DEFAULT NULL,
  `repeat_mode` varchar(10) DEFAULT NULL,
  `event_type` varchar(20) DEFAULT NULL,
  `rel_event_id` bigint(20) DEFAULT NULL,
  `repeat_end_date` date DEFAULT NULL,
  `event_delete_ind` int(1) DEFAULT NULL,
  `recur_sequence` varchar(12) DEFAULT NULL,
  `repeat_count` int(11) DEFAULT NULL,
  `day_only_weekdays` int(1) DEFAULT NULL,
  `week_days` varchar(30) DEFAULT NULL,
  `month_weeknumber` int(1) DEFAULT NULL,
  `month_weekday` int(1) DEFAULT NULL,
  `month_repeatdate` date DEFAULT NULL,
  `year_repeatdate` date DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `created_dt` datetime DEFAULT NULL,
  `created_by` varchar(60) DEFAULT NULL,
  `assigned_to` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=latin1;

-- ----------------------------
--  Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(60) NOT NULL,
  `last_name` varchar(60) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(400) NOT NULL,
  `created_dt` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

SET FOREIGN_KEY_CHECKS = 1;
