-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Machine: 127.0.0.1
-- Gegenereerd op: 29 jan 2016 om 16:37
-- Serverversie: 5.6.17
-- PHP-versie: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Databank: `default`
--

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `cms_page`
--

CREATE TABLE IF NOT EXISTS `cms_page` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `user` varchar(20) NOT NULL DEFAULT 'admin',
  `type` varchar(20) NOT NULL DEFAULT 'page' COMMENT 'page, collection, attachement',
  `status` varchar(20) NOT NULL DEFAULT 'publish' COMMENT 'publish, draft, private, inherit, trash',
  `date` datetime NOT NULL,
  `modified` datetime NOT NULL,
  `label` varchar(512) NOT NULL,
  `template` tinytext CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `parent` int(20) NOT NULL DEFAULT '0',
  `sort` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- Gegevens worden geëxporteerd voor tabel `cms_page`
--

INSERT INTO `cms_page` (`id`, `user`, `type`, `status`, `date`, `modified`, `label`, `template`, `parent`, `sort`) VALUES
(1, 'admin', 'page', 'publish', '2015-01-01 14:00:00', '2015-01-01 14:00:00', 'home', 'home', 0, 0);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `cms_page_meta`
--

CREATE TABLE IF NOT EXISTS `cms_page_meta` (
  `sort` int(9) NOT NULL,
  `param` varchar(254) NOT NULL,
  `id` int(6) NOT NULL AUTO_INCREMENT,
  `page_id` int(20) NOT NULL,
  `field` varchar(256) NOT NULL,
  `key` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `cms_page_meta_translation`
--

CREATE TABLE IF NOT EXISTS `cms_page_meta_translation` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `meta_id` int(20) NOT NULL,
  `language_id` int(20) NOT NULL,
  `key` text COLLATE utf8_unicode_ci NOT NULL,
  `value` text COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `cms_page_translation`
--

CREATE TABLE IF NOT EXISTS `cms_page_translation` (
  `id` int(6) NOT NULL AUTO_INCREMENT,
  `page_id` int(6) NOT NULL,
  `language_id` int(6) NOT NULL DEFAULT '1',
  `slug` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `description` text COLLATE utf8_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

--
-- Gegevens worden geëxporteerd voor tabel `cms_page_translation`
--

INSERT INTO `cms_page_translation` (`id`, `page_id`, `language_id`, `slug`, `description`, `content`) VALUES
(1, 1, 1, 'home', 'Homepage title fr', 'Homepage content fr'),
(2, 1, 2, 'home', 'Homepage title nl', 'Homepage content nl');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `cms_session`
--

CREATE TABLE IF NOT EXISTS `cms_session` (
  `id` varchar(32) NOT NULL,
  `create` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `access` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `data` text NOT NULL,
  `details` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `cms_user`
--

CREATE TABLE IF NOT EXISTS `cms_user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `ip_address` varbinary(16) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(80) NOT NULL,
  `salt` varchar(40) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `activation_code` varchar(40) DEFAULT NULL,
  `forgotten_password_code` varchar(40) DEFAULT NULL,
  `forgotten_password_time` int(11) unsigned DEFAULT NULL,
  `remember_code` varchar(40) DEFAULT NULL,
  `created_on` int(11) unsigned NOT NULL,
  `last_login` int(11) unsigned DEFAULT NULL,
  `active` tinyint(1) unsigned DEFAULT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `company` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` varchar(125) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- Gegevens worden geëxporteerd voor tabel `cms_user`
--

INSERT INTO `cms_user` (`id`, `ip_address`, `username`, `password`, `salt`, `email`, `activation_code`, `forgotten_password_code`, `forgotten_password_time`, `remember_code`, `created_on`, `last_login`, `active`, `first_name`, `last_name`, `company`, `phone`, `role`) VALUES
(1, '::1', 'stefan@netdust.be', '$2a$08$8ZYHFVysjefykNt6FXAd/O3KdJgjDsp6AZz6omH1SOcSto6GmrvvG', '94a2b692ee9488d58d08f9133b927bf0d22287c4', 'stefan@netdust.be', NULL, '2460239837eaefd4c86efd09ce0301e6071dd856', 1444745222, '61b2d24a2e657598cce030d432b13148d04df9d4', 1426500914, 1454066878, 1, 'Stefan', 'Vandermeulen', 'netdust gcv.', '0475238704', 'admin');
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
