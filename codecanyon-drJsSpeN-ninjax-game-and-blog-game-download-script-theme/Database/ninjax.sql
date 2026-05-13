-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 25, 2024 at 04:13 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ninjax`
--

-- --------------------------------------------------------

--
-- Table structure for table `ad_senses`
--

CREATE TABLE `ad_senses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `Location` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `Display` varchar(191) NOT NULL,
  `Type` varchar(191) NOT NULL DEFAULT '1',
  `Active` varchar(191) NOT NULL DEFAULT '1',
  `ImageUpload_id` varchar(500) DEFAULT NULL,
  `url` longtext DEFAULT NULL,
  `code` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `parent_id` int(10) UNSIGNED DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT 1,
  `Title_ar` longtext NOT NULL,
  `Title_en` longtext DEFAULT NULL,
  `Title_fr` longtext DEFAULT NULL,
  `slug` varchar(191) NOT NULL,
  `color` varchar(191) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `parent_id`, `order`, `Title_ar`, `Title_en`, `Title_fr`, `slug`, `color`, `created_at`, `updated_at`) VALUES
(27, 1, 1, 'خيال', 'Fiction', 'Fiction', 'fiction', 'danger', '2020-02-15 17:39:56', '2020-02-15 17:39:56'),
(28, 2, 2, 'أجراءات', 'Action', 'Action', 'action', 'danger', '2020-02-15 17:40:39', '2020-02-15 17:40:39'),
(29, 3, 3, 'إستراتيجية', 'Strategy', 'Strategy', 'strategy', 'danger', '2020-02-15 17:41:11', '2020-02-15 17:41:11'),
(30, 4, 4, 'رعب', 'Horror', 'Horror', 'horror', 'primary', '2020-02-15 17:41:42', '2020-02-15 17:41:42'),
(31, 5, 5, 'قتال', 'Fight', 'Fight', 'fight', 'primary', '2020-02-15 17:43:20', '2020-02-15 17:43:20'),
(32, 6, 6, 'اكس بوكس', 'Xbox', 'Xbox', 'xbox', 'danger', '2020-02-15 17:44:02', '2020-02-15 17:44:02'),
(33, 7, 7, 'سباق', 'Racing', 'Racing', 'racing', 'complete', '2020-02-15 17:44:35', '2020-02-15 17:44:35');

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

CREATE TABLE `clients` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `Title_ar` longtext NOT NULL,
  `Title_en` longtext NOT NULL,
  `Title_fr` longtext NOT NULL,
  `body_ar` longtext NOT NULL,
  `body_en` longtext NOT NULL,
  `body_fr` longtext NOT NULL,
  `ImageUpload_id` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`id`, `Title_ar`, `Title_en`, `Title_fr`, `body_ar`, `body_en`, `body_fr`, `ImageUpload_id`, `created_at`, `updated_at`) VALUES
(12, 'القطع الفنية الغامضة', 'Bloodmoon Rebellion', 'Bloodmoon Rebellion', 'قم بتكوين تحالفات مع المغامرين الآخرين واستول على السحر العنصري الموجود داخل البلورات لتصبح بطلاً أسطوريًا', 'Navigate treacherous dungeons, battle fierce monsters, and unravel the mysteries of the Crystal Veil to restore balance to the realm.', 'Navigate treacherous dungeons, battle fierce monsters, and unravel the mysteries of the Crystal Veil to restore balance to the realm.', '340', '2024-04-25 10:04:53', '2024-04-25 10:04:53'),
(13, 'القطع الأثرية الغامضة', 'Bloodmoon Rebellion', 'Bloodmoon Rebellion', 'قم بتكوين تحالفات مع المغامرين الآخرين واستول على السحر العنصري الموجود داخل البلورات لتصبح بطلاً أسطوريًا', 'Navigate treacherous dungeons, battle fierce monsters, and unravel the mysteries of the Crystal Veil to restore balance to the realm.', 'Navigate treacherous dungeons, battle fierce monsters, and unravel the mysteries of the Crystal Veil to restore balance to the realm.', '341', '2024-04-25 10:05:58', '2024-04-25 10:05:58'),
(14, 'الغزو المجرة', 'Galactic Conquest', 'Galactic Conquest', 'قم بتكوين تحالفات مع المغامرين الآخرين واستول على السحر العنصري الموجود داخل البلورات لتصبح بطلاً أسطوريًا', 'Navigate treacherous dungeons, battle fierce monsters, and unravel the mysteries of the Crystal Veil to restore balance to the realm.', 'Navigate treacherous dungeons, battle fierce monsters, and unravel the mysteries of the Crystal Veil to restore balance to the realm.', '342', '2024-04-25 10:06:37', '2024-04-25 10:06:37'),
(15, 'الكشاب مغام', 'Eternal Kingdoms', 'Eternal Kingdoms', 'قم بتكوين تحالفات مع المغامرين الآخرين واستول على السحر العنصري الموجود داخل البلورات لتصبح بطلاً أسطوريًا', 'Navigate treacherous dungeons, battle fierce monsters, and unravel the mysteries of the Crystal Veil to restore balance to the realm.', 'Navigate treacherous dungeons, battle fierce monsters, and unravel the mysteries of the Crystal Veil to restore balance to the realm.', '343', '2024-04-25 10:07:17', '2024-04-25 10:07:17'),
(16, 'التحمل البلورات القديمة', 'Realm of Legends', 'Galactic Conquest', 'قم بتكوين تحالفات مع المغامرين الآخرين واستول على السحر العنصري الموجود داخل البلورات لتصبح بطلاً أسطوريًا', 'Navigate treacherous dungeons, battle fierce monsters, and unravel the mysteries of the Crystal Veil to restore balance to the realm.', 'Navigate treacherous dungeons, battle fierce monsters, and unravel the mysteries of the Crystal Veil to restore balance to the realm.', '344', '2024-04-25 10:08:05', '2024-04-25 10:08:05'),
(17, 'حارب الوحوش الشرسة', 'Abyssal Descent', 'Abyssal Descent', 'قم بتكوين تحالفات مع المغامرين الآخرين واستول على السحر العنصري الموجود داخل البلورات لتصبح بطلاً أسطوريًا', 'Navigate treacherous dungeons, battle fierce monsters, and unravel the mysteries of the Crystal Veil to restore balance to the realm.', 'Navigate treacherous dungeons, battle fierce monsters, and unravel the mysteries of the Crystal Veil to restore balance to the realm.', '345', '2024-04-25 10:08:54', '2024-04-25 10:08:54'),
(18, 'التحالفات مع المغامرين', 'Inferno Requiem', 'Inferno Requiem', 'قم بتكوين تحالفات مع المغامرين الآخرين واستول على السحر العنصري الموجود داخل البلورات لتصبح بطلاً أسطوريًا', 'Navigate treacherous dungeons, battle fierce monsters, and unravel the mysteries of the Crystal Veil to restore balance to the realm.', 'Navigate treacherous dungeons, battle fierce monsters, and unravel the mysteries of the Crystal Veil to restore balance to the realm.', '346', '2024-04-25 10:10:05', '2024-04-25 10:10:05'),
(19, 'التحمل البلورات القديمة', 'Phoenix Ascension', 'Phoenix Ascension', 'قم بتكوين تحالفات مع المغامرين الآخرين واستول على السحر العنصري الموجود داخل البلورات لتصبح بطلاً أسطوريًا', 'Navigate treacherous dungeons, battle fierce monsters, and unravel the mysteries of the Crystal Veil to restore balance to the realm.', 'Navigate treacherous dungeons, battle fierce monsters, and unravel the mysteries of the Crystal Veil to restore balance to the realm.', '347', '2024-04-25 10:10:51', '2024-04-25 10:10:51');

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `Post_id` int(11) NOT NULL DEFAULT 1,
  `User_id` int(11) NOT NULL DEFAULT 1,
  `Comment` longtext NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `galleries`
--

CREATE TABLE `galleries` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `Title_ar` longtext NOT NULL,
  `Title_en` longtext NOT NULL,
  `Title_fr` longtext NOT NULL,
  `body_ar` longtext NOT NULL,
  `body_en` longtext NOT NULL,
  `body_fr` longtext NOT NULL,
  `Prize` varchar(155) NOT NULL,
  `Platform` varchar(155) NOT NULL,
  `Player` varchar(155) NOT NULL,
  `ImageUpload_id` varchar(200) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `galleries`
--

INSERT INTO `galleries` (`id`, `Title_ar`, `Title_en`, `Title_fr`, `body_ar`, `body_en`, `body_fr`, `Prize`, `Platform`, `Player`, `ImageUpload_id`, `created_at`, `updated_at`) VALUES
(11, 'الانحدار السحيق', 'Abyssal Descent', 'Abyssal Descent', 'قم بتكوين تحالفات مع المغامرين الآخرين واستول على السحر العنصري الموجود داخل البلورات لتصبح بطلاً أسطوريًا', 'Navigate treacherous dungeons, battle fierce monsters, and unravel the mysteries of the Crystal Veil to restore balance to the realm.', 'Navigate treacherous dungeons, battle fierce monsters, and unravel the mysteries of the Crystal Veil to restore balance to the realm.', '35k', 'PC', '54/54', '348', '2024-04-25 10:13:12', '2024-04-25 10:13:12'),
(12, 'السجلات الهشيم', 'Wildfire Chronicles', 'Wildfire Chronicles', 'قم بتكوين تحالفات مع المغامرين الآخرين واستول على السحر العنصري الموجود داخل البلورات لتصبح بطلاً أسطوريًا', 'Navigate treacherous dungeons, battle fierce monsters, and unravel the mysteries of the Crystal Veil to restore balance to the realm.', 'Navigate treacherous dungeons, battle fierce monsters, and unravel the mysteries of the Crystal Veil to restore balance to the realm.', '35k', 'PC', '54/54', '349', '2024-04-25 10:14:24', '2024-04-25 10:14:24'),
(13, 'تمرد قمر الدم', 'Bloodmoon Rebellion Plus', 'Bloodmoon Rebellion Plus', 'قم بتكوين تحالفات مع المغامرين الآخرين واستول على السحر العنصري الموجود داخل البلورات لتصبح بطلاً أسطوريًا', 'Navigate treacherous dungeons, battle fierce monsters, and unravel the mysteries of the Crystal Veil to restore balance to the realm.', 'Navigate treacherous dungeons, battle fierce monsters, and unravel the mysteries of the Crystal Veil to restore balance to the realm.', '35k', 'PC', '54/54', '350', '2024-04-25 10:15:48', '2024-04-25 10:15:48'),
(14, 'التحالفات مع المغامرين', 'Cybernetic Uprising', 'Cybernetic Uprising', 'قم بتكوين تحالفات مع المغامرين الآخرين واستول على السحر العنصري الموجود داخل البلورات لتصبح بطلاً أسطوريًا', 'Navigate treacherous dungeons, battle fierce monsters, and unravel the mysteries of the Crystal Veil to restore balance to the realm.', 'Navigate treacherous dungeons, battle fierce monsters, and unravel the mysteries of the Crystal Veil to restore balance to the realm.', '35k', 'PC', '54/54', '351', '2024-04-25 10:16:36', '2024-04-25 10:16:36');

-- --------------------------------------------------------

--
-- Table structure for table `image_uploads`
--

CREATE TABLE `image_uploads` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `filename` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `image_uploads`
--

INSERT INTO `image_uploads` (`id`, `filename`, `created_at`, `updated_at`) VALUES
(181, 'images/avatar.png', '2020-01-28 20:24:38', '2020-01-28 20:24:38'),
(218, 'images/favicon-16x16.png', '2020-02-15 16:00:09', '2020-02-15 16:00:09'),
(219, 'images/favicon-32x32.png', '2020-02-15 16:00:12', '2020-02-15 16:00:12'),
(227, 'images/logo.png', '2020-02-15 16:15:32', '2020-02-15 16:15:32'),
(328, 'images/662a3fcc7b474logo-rtl.png', '2024-04-25 08:34:36', '2024-04-25 08:34:36'),
(329, 'images/662a401883693auth-logo.png', '2024-04-25 08:35:52', '2024-04-25 08:35:52'),
(330, 'images/662a4b43131a5icon.png', '2024-04-25 09:23:31', '2024-04-25 09:23:31'),
(331, 'images/662a4d1307ab0icon.png', '2024-04-25 09:31:15', '2024-04-25 09:31:15'),
(332, 'images/662a502463968600x400.png', '2024-04-25 09:44:20', '2024-04-25 09:44:20'),
(333, 'images/662a511b41059600x400.png', '2024-04-25 09:48:27', '2024-04-25 09:48:27'),
(334, 'images/662a51a607feb600x400.png', '2024-04-25 09:50:46', '2024-04-25 09:50:46'),
(335, 'images/662a51ee01053600x400.png', '2024-04-25 09:51:58', '2024-04-25 09:51:58'),
(336, 'images/662a527b31638600x400.png', '2024-04-25 09:54:19', '2024-04-25 09:54:19'),
(337, 'images/662a52df7fba3600x400.png', '2024-04-25 09:55:59', '2024-04-25 09:55:59'),
(338, 'images/662a53b87f0f1600x400.png', '2024-04-25 09:59:36', '2024-04-25 09:59:36'),
(339, 'images/662a54720642c600x400.png', '2024-04-25 10:02:42', '2024-04-25 10:02:42'),
(340, 'images/662a54efa71c3600x400.png', '2024-04-25 10:04:47', '2024-04-25 10:04:47'),
(341, 'images/662a552ca983e600x400.png', '2024-04-25 10:05:48', '2024-04-25 10:05:48'),
(342, 'images/662a555b5cb8d600x400.png', '2024-04-25 10:06:35', '2024-04-25 10:06:35'),
(343, 'images/662a55823f40a600x400.png', '2024-04-25 10:07:14', '2024-04-25 10:07:14'),
(344, 'images/662a55b1283e0600x400.png', '2024-04-25 10:08:01', '2024-04-25 10:08:01'),
(345, 'images/662a55e275fc3600x400.png', '2024-04-25 10:08:50', '2024-04-25 10:08:50'),
(346, 'images/662a562b1f9f6600x400.png', '2024-04-25 10:10:03', '2024-04-25 10:10:03'),
(347, 'images/662a565a03459600x400.png', '2024-04-25 10:10:50', '2024-04-25 10:10:50'),
(348, 'images/662a56e62705f600x400.png', '2024-04-25 10:13:10', '2024-04-25 10:13:10'),
(349, 'images/662a572e93013600x400.png', '2024-04-25 10:14:22', '2024-04-25 10:14:22'),
(350, 'images/662a578018188600x400.png', '2024-04-25 10:15:44', '2024-04-25 10:15:44'),
(351, 'images/662a57b15dc39600x400.png', '2024-04-25 10:16:33', '2024-04-25 10:16:33'),
(352, 'images/662a642c13d67600x400.png', '2024-04-25 11:09:48', '2024-04-25 11:09:48');

-- --------------------------------------------------------

--
-- Table structure for table `instagrams`
--

CREATE TABLE `instagrams` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `Title_ar` longtext NOT NULL,
  `Title_en` longtext NOT NULL,
  `Title_fr` longtext NOT NULL,
  `body_ar` longtext NOT NULL,
  `body_en` longtext NOT NULL,
  `body_fr` longtext NOT NULL,
  `ImageUpload_id` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `menus`
--

CREATE TABLE `menus` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `Title` longtext NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `menus`
--

INSERT INTO `menus` (`id`, `Title`, `created_at`, `updated_at`) VALUES
(1, 'Main-menu', '2020-01-02 11:39:50', '2020-01-02 11:39:50');

-- --------------------------------------------------------

--
-- Table structure for table `menu_items`
--

CREATE TABLE `menu_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `menu_id` int(11) NOT NULL DEFAULT 0,
  `order` int(11) NOT NULL DEFAULT 0,
  `Title_en` varchar(191) NOT NULL,
  `Title_ar` varchar(191) NOT NULL,
  `Title_fr` varchar(191) NOT NULL,
  `url` varchar(191) NOT NULL,
  `target` varchar(191) NOT NULL DEFAULT '_self',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `menu_items`
--

INSERT INTO `menu_items` (`id`, `menu_id`, `order`, `Title_en`, `Title_ar`, `Title_fr`, `url`, `target`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'Home', 'الصفحة الرئيسية', 'Accueil', '/', '_self', '2020-01-13 10:48:19', '2020-01-13 10:48:19'),
(3, 1, 1, 'Teams', 'الفرق', 'Teams', 'Teams', '', '2020-01-13 10:42:03', '2020-01-13 10:42:03'),
(8, 1, 1, 'Games', 'ألعاب', 'Games', 'Games', '_self', '2020-02-17 12:34:51', '2020-02-17 12:34:51'),
(9, 1, 2, 'Trend Games', 'العاب تريند', 'Trend Games', 'Games', '_self', '2020-02-17 12:35:31', '2020-02-17 12:35:31'),
(10, 1, 3, 'Gaming Tournament', 'بطولة الألعاب', 'Gaming Tournament', 'Tournaments', '_self', '2020-02-17 12:36:10', '2020-02-17 12:36:10');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `Subject` longtext NOT NULL,
  `name` longtext NOT NULL,
  `mail` longtext NOT NULL,
  `User_id` longtext NOT NULL,
  `Message` longtext NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(191) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(2, '2014_10_12_100000_create_password_resets_table', 1),
(3, '2019_08_19_000000_create_failed_jobs_table', 1),
(4, '2019_12_09_143619_create_permission_tables', 2),
(5, '2016_09_13_070520_add_verification_to_user_table', 3),
(6, '2014_10_12_000000_create_users_table', 4),
(7, '2019_12_29_153111_create_image_uploads_table', 5),
(8, '2019_12_30_141843_create_posts_table', 6),
(9, '2019_12_30_142016_create_categories_table', 7),
(10, '2019_12_30_142116_create_clients_table', 7),
(11, '2019_12_30_142137_create_ad_senses_table', 7),
(12, '2019_12_30_142156_create_menus_table', 7),
(13, '2019_12_30_142250_create_menu_items_table', 7),
(14, '2019_12_30_142326_create_galleries_table', 7),
(15, '2019_12_30_142339_create_instagrams_table', 7),
(16, '2019_12_30_142418_create_messages_table', 7),
(17, '2019_12_30_170524_create_comments_table', 8),
(18, '2019_12_30_171111_create_menu_items_table', 9),
(19, '2017_03_03_100000_create_options_table', 10),
(20, '2014_10_12_200000_add_two_factor_columns_to_users_table', 11),
(21, '2019_12_14_000001_create_personal_access_tokens_table', 11),
(22, '2021_04_02_130814_create_sessions_table', 11);

-- --------------------------------------------------------

--
-- Table structure for table `model_has_permissions`
--

CREATE TABLE `model_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(191) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `model_has_permissions`
--

INSERT INTO `model_has_permissions` (`permission_id`, `model_type`, `model_id`) VALUES
(31, 'App\\User', 43);

-- --------------------------------------------------------

--
-- Table structure for table `model_has_roles`
--

CREATE TABLE `model_has_roles` (
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(191) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `model_has_roles`
--

INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES
(30, 'App\\User', 43),
(34, 'App\\User', 43);

-- --------------------------------------------------------

--
-- Table structure for table `options`
--

CREATE TABLE `options` (
  `id` int(10) UNSIGNED NOT NULL,
  `key` varchar(191) NOT NULL,
  `value` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `options`
--

INSERT INTO `options` (`id`, `key`, `value`) VALUES
(2, 'Home_fr', '\"Ninjax – Game and Blog / Game Download Script Theme\"'),
(3, 'Home_ar', '\"اللعبة والمدونة / موضوع تنزيل اللعبة نينجااكس\"'),
(4, 'Home_en', '\"Ninjax – Game and Blog / Game Download Script Theme\"'),
(5, 'Favicon', '\"images/favicon-32x32.png\"'),
(6, 'LinkTwo', '\"LinkTwo\"'),
(8, 'youtube', '\"youtube\"'),
(9, 'GitHub', '\"GitHub\"'),
(10, 'Twitter', '\"Twitter\"'),
(11, 'Pinterest', '\"Pinterest\"'),
(12, 'Tumblr', '\"Tumblr\"'),
(13, 'Snapchat', '\"Snapchat\"'),
(14, 'LinkedIn', '\"LinkedIn\"'),
(15, 'Instagram', '\"Instagram\"'),
(16, 'Facebook', '\"Facebook\"'),
(17, 'MetaKeyWords', '\"Ninjax   Games Download gaming magazine\"'),
(18, 'MetaDescription', '\"Ninjax - Games and Blog / Games Download script Theme. It is a simple and clean theme with a great elegant design and simple to use out of the box.\"'),
(19, 'video', '\"video\"'),
(20, 'Googlemap', '\"Googlemap\"'),
(21, 'Email', '\"Ninjax@gmail.com\"'),
(22, 'PhoneNumber', '\"0220-10022-52\"'),
(24, 'SiteTitle', '\"Ninjax\"'),
(25, 'Language', '\"Language\"'),
(28, 'Metaauthor', '\"author\"'),
(29, 'Metarobots', '\"Metarobots\"'),
(30, 'coveruser', '\"images/321450.jpg\"'),
(32, 'covernew', '\"images/321450.jpg\"'),
(33, 'coverMessage', '\"images/321450.jpg\"'),
(34, 'coverAdSense', '\"images/321450.jpg\"'),
(35, 'coverInstagrams', '\"images/321450.jpg\"'),
(36, 'coverSettings', '\"images/321450.jpg\"'),
(37, 'logo', '\"images/logo.png\"'),
(39, 'logo-rtl', '\"images\\/662a3fcc7b474logo-rtl.png\"'),
(40, 'auth-logo', '\"images\\/662a401883693auth-logo.png\"');

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `email` varchar(191) NOT NULL,
  `token` varchar(191) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `password_resets`
--

INSERT INTO `password_resets` (`email`, `token`, `created_at`) VALUES
('admin@admin.com', '$2y$10$bui5fl4azCrQhE2fjJQ6YOvAdyRJHXJVsJeAYuVLNWOGWCl9QFXM2', '2019-12-09 14:13:59');

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) NOT NULL,
  `guard_name` varchar(191) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(31, 'edit articles', 'web', '2020-01-04 14:37:28', '2020-01-04 14:37:28'),
(35, 'User', 'web', '2020-01-04 16:05:35', '2020-01-04 16:05:35');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(191) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `author_id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `Title_ar` longtext DEFAULT NULL,
  `Title_en` longtext NOT NULL,
  `Title_fr` longtext DEFAULT NULL,
  `body_ar` longtext DEFAULT NULL,
  `body_en` longtext NOT NULL,
  `body_fr` longtext DEFAULT NULL,
  `ImageUpload_id` int(11) DEFAULT NULL,
  `slug` longtext NOT NULL,
  `meta_description` longtext DEFAULT NULL,
  `meta_keywords` longtext DEFAULT NULL,
  `seo_title` longtext DEFAULT NULL,
  `Downloud` varchar(300) DEFAULT NULL,
  `featured` varchar(200) NOT NULL DEFAULT 'out',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `author_id`, `category_id`, `Title_ar`, `Title_en`, `Title_fr`, `body_ar`, `body_en`, `body_fr`, `ImageUpload_id`, `slug`, `meta_description`, `meta_keywords`, `seo_title`, `Downloud`, `featured`, `created_at`, `updated_at`) VALUES
(56, 43, 27, 'حارب الوحوش الشرسة', 'Shadowfall Chronicles', 'Shadowfall Chronicles', 'يتم دفع اللاعبين إلى عالم تتمتع فيه البلورات القديمة بقوة لا يمكن تصورها. كمغامر شاب، تشرع في مهمة لكشف أسرار هذه القطع الأثرية الغامضة وإنقاذ وطنك من الهلاك الوشيك. انتقل إلى الزنزانات الغادرة، وحارب الوحوش الشرسة، واكشف أسرار  لاستعادة التوازن إلى العالم', 'players are thrust into a world where ancient crystals hold unimaginable power. As a young adventurer, you embark on a quest to uncover the secrets of these mystical artifacts and save your homeland from impending doom. Navigate treacherous dungeons, battle fierce monsters, and unravel the mysteries of the Crystal Veil to restore balance to the realm.', 'Shadowfall Chronicles players are thrust into a world where ancient crystals hold unimaginable power. As a young adventurer, you embark on a quest to uncover the secrets of these mystical artifacts and save your homeland from impending doom. Navigate treacherous dungeons, battle fierce monsters, and unravel the mysteries of the Crystal Veil to restore balance to the realm.', 332, 'shadowfall-chronicles', 'one', 'two', '40MB', 'https://www.mediafire.com/file/ot5ji6su4kszfjv/game.zip/file', 'on', '2024-04-25 09:44:28', '2024-04-25 09:44:28'),
(57, 43, 27, 'القطع الأثرية الغامضة', 'Celestial Odyssey', 'Celestial Odyssey', 'يتم دفع اللاعبين إلى عالم تتمتع فيه البلورات القديمة بقوة لا يمكن تصورها. كمغامر شاب، تشرع في مهمة لكشف أسرار هذه القطع الأثرية الغامضة وإنقاذ وطنك من الهلاك الوشيك. انتقل إلى الزنزانات الغادرة، وحارب الوحوش الشرسة، واكشف أسرار لاستعادة التوازن إلى العالميتم دفع اللاعبين إلى عالم تتمتع فيه البلورات القديمة بقوة لا يمكن تصورها. كمغامر شاب، تشرع في مهمة لكشف أسرار هذه القطع الأثرية الغامضة وإنقاذ وطنك من الهلاك الوشيك. انتقل إلى الزنزانات الغادرة، وحارب الوحوش الشرسة، واكشف أسرار لاستعادة التوازن إلى العالم', '<p>players are thrust into a world where ancient crystals hold unimaginable power. As a young adventurer, you embark on a quest to uncover the secrets of these mystical artifacts and save your homeland from impending doom. Navigate treacherous dungeons, battle fierce monsters, and unravel the mysteries of the Crystal Veil to restore balance to the realm.<br></p>', 'Celestial Odyssey players are thrust into a world where ancient crystals hold unimaginable power. As a young adventurer, you embark on a quest to uncover the secrets of these mystical artifacts and save your homeland from impending doom. Navigate treacherous dungeons, battle fierce monsters, and unravel the mysteries of the Crystal Veil to restore balance to the realm.', 333, 'celestial-odyssey', 'Celestial Odyssey', 'Celestial Odyssey', '40MB', 'https://www.mediafire.com/file/ot5ji6su4kszfjv/game.zip/file', 'on', '2024-04-25 09:48:42', '2024-04-25 09:48:42'),
(58, 43, 27, 'الوطنك من الدمار الوشيك', 'Nexus Prime', 'Nexus Prime', 'في يُلقى اللاعبون في عالم حيث تحمل البلورات القديمة قوة لا تُصدق. كشاب مغامر، تبدأ رحلتك في البحث عن أسرار هذه القطع الفنية الغامضة وإنقاذ وطنك من الدمار الوشيك. اجتز المتاهات الغادرة، وتقاتل الوحوش الشرسة، وكشف أسرار الستار البلوري لاستعادة التوازن في العالم. على طول الطريق، قم بتكوين تحالفات مع المغامرين الآخرين واستول على السحر العنصري الموجود داخل البلورات لتصبح بطلاً أسطوريًا هل ستخرج منتصرًا، أم أن قوة البلورات ستبتلعك؟ يتعلق مصير العالم في', 'players are thrust into a world where ancient crystals hold unimaginable power. As a young adventurer, you embark on a quest to uncover the secrets of these mystical artifacts and save your homeland from impending doom. Navigate treacherous dungeons, battle fierce monsters, and unravel the mysteries of the Crystal Veil to restore balance to the realm.', 'Nexus Prime players are thrust into a world where ancient crystals hold unimaginable power. As a young adventurer, you embark on a quest to uncover the secrets of these mystical artifacts and save your homeland from impending doom. Navigate treacherous dungeons, battle fierce monsters, and unravel the mysteries of the Crystal Veil to restore balance to the realm.', 334, 'nexus-prime', 'Celestial Odyssey', 'Celestial Odyssey', '6GB', 'https://www.mediafire.com/file/ot5ji6su4kszfjv/game.zip/file', 'on', '2024-04-25 09:50:49', '2024-04-25 09:50:49'),
(59, 43, 27, 'تحالفات مع المغامرين', 'Echoes of Eternity', 'Echoes of Eternity', 'في يُلقى اللاعبون في عالم حيث تحمل البلورات القديمة قوة لا تُصدق. كشاب مغامر، تبدأ رحلتك في البحث عن أسرار هذه القطع الفنية الغامضة وإنقاذ وطنك من الدمار الوشيك. اجتز المتاهات الغادرة، وتقاتل الوحوش الشرسة، وكشف أسرار الستار البلوري لاستعادة التوازن في العالم. على طول الطريق، قم بتكوين تحالفات مع المغامرين الآخرين واستول على السحر العنصري الموجود داخل البلورات لتصبح بطلاً أسطوريًا. هل ستخرج منتصرًا، أم أن قوة البلورات ستبتلعك؟ يتعلق مصير العالم في', 'In \"Crystal Veil,\" players are thrust into a world where ancient crystals hold unimaginable power. As a young adventurer, you embark on a quest to uncover the secrets of these mystical artifacts and save your homeland from impending doom. Navigate treacherous dungeons, battle fierce monsters, and unravel the mysteries of the Crystal Veil to restore balance to the realm. Along the way, forge alliances with fellow adventurers and master the elemental magic infused within the crystals to become a legendary hero. Will you emerge victorious, or will the power of the crystals consume you? The fate of the world hangs in the balance in \"Crystal Veil.\"', 'In \"Crystal Veil,\" players are thrust into a world where ancient crystals hold unimaginable power. As a young adventurer, you embark on a quest to uncover the secrets of these mystical artifacts and save your homeland from impending doom. Navigate treacherous dungeons, battle fierce monsters, and unravel the mysteries of the Crystal Veil to restore balance to the realm. Along the way, forge alliances with fellow adventurers and master the elemental magic infused within the crystals to become a legendary hero. Will you emerge victorious, or will the power of the crystals consume you? The fate of the world hangs in the balance in \"Crystal Veil.\"', 335, 'echoes-of-eternity', 'Celestial Odyssey', 'Celestial Odyssey', '6GB', 'https://www.mediafire.com/file/ot5ji6su4kszfjv/game.zip/file', 'on', '2024-04-25 09:52:02', '2024-04-25 09:52:02'),
(60, 43, 27, 'الكشاب مغام', 'Arcane Legends', 'Arcane Legends', 'في \"Crystal Veil\"، يُلقى اللاعبون في عالم حيث تحمل البلورات القديمة قوة لا تُصدق. كشاب مغامر، تبدأ رحلتك في البحث عن أسرار هذه القطع الفنية الغامضة وإنقاذ وطنك من الدمار الوشيك. اجتز المتاهات الغادرة، وتقاتل الوحوش الشرسة، وكشف أسرار الستار البلوري لاستعادة التوازن في العالم. على طول الطريق، قم بتكوين تحالفات مع المغامرين الآخرين واستول على السحر العنصري الموجود داخل البلورات لتصبح بطلاً أسطوريًا. هل ستخرج منتصرًا، أم أن قوة البلورات ستبتلعك؟ يتعلق مصير العالم في \"Crystal Veil\".', 'In \"Crystal Veil,\" players are thrust into a world where ancient crystals hold unimaginable power. As a young adventurer, you embark on a quest to uncover the secrets of these mystical artifacts and save your homeland from impending doom. Navigate treacherous dungeons, battle fierce monsters, and unravel the mysteries of the Crystal Veil to restore balance to the realm. Along the way, forge alliances with fellow adventurers and master the elemental magic infused within the crystals to become a legendary hero. Will you emerge victorious, or will the power of the crystals consume you? The fate of the world hangs in the balance in \"Crystal Veil.\"', 'In \"Crystal Veil,\" players are thrust into a world where ancient crystals hold unimaginable power. As a young adventurer, you embark on a quest to uncover the secrets of these mystical artifacts and save your homeland from impending doom. Navigate treacherous dungeons, battle fierce monsters, and unravel the mysteries of the Crystal Veil to restore balance to the realm. Along the way, forge alliances with fellow adventurers and master the elemental magic infused within the crystals to become a legendary hero. Will you emerge victorious, or will the power of the crystals consume you? The fate of the world hangs in the balance in \"Crystal Veil.\"', 336, 'arcane-legends', 'Arcane Legends', 'Arcane Legends', '40MB', 'https://www.mediafire.com/file/ot5ji6su4kszfjv/game.zip/file', 'on', '2024-04-25 09:54:20', '2024-04-25 09:54:20'),
(61, 43, 27, 'تحمل البلورات القديمة', 'World where ancient', 'Crystal Veils', 'في  يُلقى اللاعبون في عالم حيث تحمل البلورات القديمة قوة لا تُصدق. كشاب مغامر، تبدأ رحلتك في البحث عن أسرار هذه القطع الفنية الغامضة وإنقاذ وطنك من الدمار الوشيك. اجتز المتاهات الغادرة، وتقاتل الوحوش الشرسة، وكشف أسرار الستار البلوري لاستعادة التوازن في العالم. على طول الطريق، قم بتكوين تحالفات مع المغامرين الآخرين واستول على السحر العنصري الموجود داخل البلورات لتصبح بطلاً أسطوريًا. هل ستخرج منتصرًا، أم أن قوة البلورات ستبتلعك؟ يتعلق مصير العالم في', 'In \"Crystal Veil,\" players are thrust into a world where ancient crystals hold unimaginable power. As a young adventurer, you embark on a quest to uncover the secrets of these mystical artifacts and save your homeland from impending doom. Navigate treacherous dungeons, battle fierce monsters, and unravel the mysteries of the Crystal Veil to restore balance to the realm. Along the way, forge alliances with fellow adventurers and master the elemental magic infused within the crystals to become a legendary hero. Will you emerge victorious, or will the power of the crystals consume you? The fate of the world hangs in the balance in \"Crystal Veil.\"', 'In \"Crystal Veil,\" players are thrust into a world where ancient crystals hold unimaginable power. As a young adventurer, you embark on a quest to uncover the secrets of these mystical artifacts and save your homeland from impending doom. Navigate treacherous dungeons, battle fierce monsters, and unravel the mysteries of the Crystal Veil to restore balance to the realm. Along the way, forge alliances with fellow adventurers and master the elemental magic infused within the crystals to become a legendary hero. Will you emerge victorious, or will the power of the crystals consume you? The fate of the world hangs in the balance', 337, 'world-where-ancient', 'Celestial Odyssey', 'Celestial Odyssey', '6GB', 'https://www.mediafire.com/file/ot5ji6su4kszfjv/game.zip/file', 'on', '2024-04-25 09:56:19', '2024-04-25 09:56:19'),
(62, 43, 27, 'القطع الفنية الغامضة', 'crystals hold ginable', 'crystals hold unimaginable', 'في يُلقى اللاعبون في عالم حيث تحمل البلورات القديمة قوة لا تُصدق. كشاب مغامر، تبدأ رحلتك في البحث عن أسرار هذه القطع الفنية الغامضة وإنقاذ وطنك من الدمار الوشيك. اجتز المتاهات الغادرة، وتقاتل الوحوش الشرسة، وكشف أسرار الستار البلوري لاستعادة التوازن في العالم. على طول الطريق، قم بتكوين تحالفات مع المغامرين الآخرين واستول على السحر العنصري الموجود داخل البلورات لتصبح بطلاً أسطوريًا هل ستخرج منتصرًا، أم أن قوة البلورات ستبتلعك؟ يتعلق مصير العالم في', 'In \"Crystal Veil,\" players are thrust into a world where ancient crystals hold unimaginable power. As a young adventurer, you embark on a quest to uncover the secrets of these mystical artifacts and save your homeland from impending doom. Navigate treacherous dungeons, battle fierce monsters, and unravel the mysteries of the Crystal Veil to restore balance to the realm. Along the way, forge alliances with fellow adventurers and master the elemental magic infused within the crystals to become a legendary hero. Will you emerge victorious, or will the power of the crystals consume you? The fate of the world hangs in the balance.', 'players are thrust into a world where ancient crystals hold unimaginable power. As a young adventurer, you embark on a quest to uncover the secrets of these mystical artifacts and save your homeland from impending doom. Navigate treacherous dungeons, battle fierce monsters, and unravel the mysteries of the Crystal Veil to restore balance to the realm. Along the way, forge alliances with fellow adventurers and master the elemental magic infused within the crystals to become a legendary hero. Will you emerge victorious, or will the power of the crystals consume you The fate of the world hangs in the balance.', 338, 'crystals-hold-ginable', 'crystals hold unimaginable', 'crystals hold unimaginable', '6GB', 'https://www.mediafire.com/file/ot5ji6su4kszfjv/game.zip/file', 'on', '2024-04-25 09:59:45', '2024-04-25 09:59:45'),
(63, 43, 28, 'القطع الفنية الغامضة', 'Nexus Prime', 'eCommerce Customized', 'فييُلقى اللاعبون في عالم حيث تحمل البلورات القديمة قوة لا تُصدق. كشاب مغامر، تبدأ رحلتك في البحث عن أسرار هذه القطع الفنية الغامضة وإنقاذ وطنك من الدمار الوشيك. اجتز المتاهات الغادرة وتقاتل الوحوش الشرسة، وكشف أسرار الستار البلوري لاستعادة التوازن في العالم. على طول الطريق، قم بتكوين تحالفات مع المغامرين الآخرين واستول على السحر العنصري الموجود داخل البلورات لتصبح بطلاً أسطوريًا هل ستخرج منتصرًا، أم أن قوة البلورات ستبتلعك؟ يتعلق مصير العالم في', 'In \"Crystal Veil,\" players are thrust into a world where ancient crystals hold unimaginable power. As a young adventurer, you embark on a quest to uncover the secrets of these mystical artifacts and save your homeland from impending doom. Navigate treacherous dungeons, battle fierce monsters, and unravel the mysteries of the Crystal Veil to restore balance to the realm. Along the way, forge alliances with fellow adventurers and master the elemental magic infused within the crystals to become a legendary hero. Will you emerge victorious, or will the power of the crystals consume you? The fate of the world hangs in the balance in \"Crystal Veil.\"', 'eCommerce Customized In \"Crystal Veil,\" players are thrust into a world where ancient crystals hold unimaginable power. As a young adventurer, you embark on a quest to uncover the secrets of these mystical artifacts and save your homeland from impending doom. Navigate treacherous dungeons, battle fierce monsters, and unravel the mysteries of the Crystal Veil to restore balance to the realm. Along the way, forge alliances with fellow adventurers and master the elemental magic infused within the crystals to become a legendary hero. Will you emerge victorious, or will the power of the crystals consume you? The fate of the world hangs in the balance in \"Crystal Veil.\"', 339, 'ecommerce-customized', 'Celestial Odyssey', 'Celestial Odyssey', '6GB', 'https://www.mediafire.com/file/ot5ji6su4kszfjv/game.zip/file', 'on', '2024-04-25 10:02:44', '2024-04-25 10:02:44'),
(64, 43, 27, 'مباريات اللعبة', 'Game Matches', 'Game Matches', 'في  يُلقى اللاعبون في عالم حيث تحمل البلورات القديمة قوة لا تُصدق. كشاب مغامر، تبدأ رحلتك في البحث عن أسرار هذه القطع الفنية الغامضة وإنقاذ وطنك من الدمار الوشيك. اجتز المتاهات الغادرة، وتقاتل الوحوش الشرسة، وكشف أسرار الستار البلوري لاستعادة التوازن في العالم. على طول الطريق، قم بتكوين تحالفات مع المغامرين الآخرين واستول على السحر العنصري الموجود داخل البلورات لتصبح بطلاً أسطوريًا. هل ستخرج منتصرًا، أم أن قوة البلورات ستبتلعك؟ يتعلق مصير العالم في', 'In \"Crystal Veil,\" players are thrust into a world where ancient crystals hold unimaginable power. As a young adventurer, you embark on a quest to uncover the secrets of these mystical artifacts and save your homeland from impending doom. Navigate treacherous dungeons, battle fierce monsters, and unravel the mysteries of the Crystal Veil to restore balance to the realm. Along the way, forge alliances with fellow adventurers and master the elemental magic infused within the crystals to become a legendary hero. Will you emerge victorious, or will the power of the crystals consume you? The fate of the world hangs in the balance in \"Crystal Veil.\"', 'Game Matches In \"Crystal Veil,\" players are thrust into a world where ancient crystals hold unimaginable power. As a young adventurer, you embark on a quest to uncover the secrets of these mystical artifacts and save your homeland from impending doom. Navigate treacherous dungeons, battle fierce monsters, and unravel the mysteries of the Crystal Veil to restore balance to the realm. Along the way, forge alliances with fellow adventurers and master the elemental magic infused within the crystals to become a legendary hero. Will you emerge victorious, or will the power of the crystals consume you? The fate of the world hangs in the balance .', 352, 'game-matches', 'Game Matches', 'Game Matches', '30GB', 'https://www.mediafire.com/file/ot5ji6su4kszfjv/game.zip/file', 'on', '2024-04-25 11:09:56', '2024-04-25 11:09:56');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) NOT NULL,
  `guard_name` varchar(191) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(30, 'Super-Admin', 'web', '2020-01-04 14:37:28', '2020-01-04 14:37:28'),
(34, 'User', 'web', '2020-01-04 16:05:35', '2020-01-04 16:05:35');

-- --------------------------------------------------------

--
-- Table structure for table `role_has_permissions`
--

CREATE TABLE `role_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(191) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` text NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('9nk3mMx3n9q1CGZOe6vJZSTmpF4PMoyRNuNKXocf', 43, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0', 'YTo3OntzOjY6Il90b2tlbiI7czo0MDoieVNpZzVnYUxUcTVxcUY5NUxkZHAyaGNpMmhQaGZlSjRMTlc3OEs2VyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Njc6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9lbi9EYXNoYm9hcmQvUG9zdHMvc2hhZG93ZmFsbC1jaHJvbmljbGVzL2VkaXQiO31zOjY6ImxvY2FsZSI7czoyOiJlbiI7czozOiJ1cmwiO2E6MDp7fXM6NTA6ImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjQzO3M6NDoiYXV0aCI7YToxOntzOjIxOiJwYXNzd29yZF9jb25maXJtZWRfYXQiO2k6MTcxNDA1MjQ5MTt9fQ==', 1714054348),
('9ZOwTwjKBrw7K1LSFL9tNz3LwpR6S1CNfkSYr18x', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoia01wZnlWVDFoV3h6YkhkNnlaRFkxOEtubFBQYW5XRU9RRFVCOVY2NyI7czo2OiJsb2NhbGUiO3M6MjoiZW4iO3M6OToiX3ByZXZpb3VzIjthOjE6e3M6MzoidXJsIjtzOjMzOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvZW4vVGVhbXMvMTkiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1714051292),
('krc2hr5UemL1qWCONaR1fEylY7nCB4iwPHW8gFBe', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiOGY2anJsUERRWmRPclhWWWh1WUdCbWI2dEsxbUs4OThvOFFvcm84dSI7czo2OiJsb2NhbGUiO3M6MjoiYXIiO3M6OToiX3ByZXZpb3VzIjthOjE6e3M6MzoidXJsIjtzOjMwOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvYXIvVGVhbXMiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1714053850),
('PpDjBZPKq7LCSKsTyuoyuE35aVg59NjjjavUhwfT', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoieWxQUUoxMDJpSHVMR09ZVHJEVkZVVExhblFpNEdiTFI5R1J3bmV0SyI7czo2OiJsb2NhbGUiO3M6MjoiYXIiO3M6OToiX3ByZXZpb3VzIjthOjE6e3M6MzoidXJsIjtzOjI0OiJodHRwOi8vbG9jYWxob3N0OjgwMDAvYXIiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1714052935),
('PTDyKsO3oaqa7pfoWEIb8G6YHQRvpB1KIENvuQoV', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiQno3VmJsdzJpYnZ3YmY1b2MxRWJjWHdsT0dqVFZtY3FyYXVXS2FaMyI7czo2OiJsb2NhbGUiO3M6MjoiZW4iO3M6OToiX3ByZXZpb3VzIjthOjE6e3M6MzoidXJsIjtzOjI0OiJodHRwOi8vbG9jYWxob3N0OjgwMDAvZW4iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1714051592),
('vu1zFsrKDZomC1KN3WVL6ymVnRq9vf2lBp0fNqZl', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiWmR0eHJ4b3JqRkNvNWplYXdlSm0yQjlZbkVBRnlsRTNodmN2T2hTdSI7czo2OiJsb2NhbGUiO3M6MjoiZW4iO3M6OToiX3ByZXZpb3VzIjthOjE6e3M6MzoidXJsIjtzOjUyOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvZW4vR2FtZXMvY3J5c3RhbHMtaG9sZC1naW5hYmxlIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1714053996);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(191) NOT NULL,
  `two_factor_secret` text DEFAULT NULL,
  `two_factor_recovery_codes` text DEFAULT NULL,
  `ImageUpload_id` varchar(191) DEFAULT '181',
  `Phone` varchar(191) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `two_factor_secret`, `two_factor_recovery_codes`, `ImageUpload_id`, `Phone`, `remember_token`, `created_at`, `updated_at`) VALUES
(43, 'Ninjax', 'Dashbourd@ninjax.com', NULL, '$2y$10$oMDyuwen20C7.RCmhFJheOcUmfoIMUE5IyMEMOCBDyFTLWHMIUVU6', NULL, NULL, '181', '963852', 'hIcPufwFOOVj5EILRVdhBeGmsw5jOxQ0lq3z8sF2kawBksAN69Qp7ODJajxs', '2020-01-25 15:16:19', '2020-01-25 15:16:19');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ad_senses`
--
ALTER TABLE `ad_senses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `categories_slug_unique` (`slug`);

--
-- Indexes for table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `galleries`
--
ALTER TABLE `galleries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `image_uploads`
--
ALTER TABLE `image_uploads`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `instagrams`
--
ALTER TABLE `instagrams`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `menus`
--
ALTER TABLE `menus`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `menu_items`
--
ALTER TABLE `menu_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  ADD KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indexes for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  ADD KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indexes for table `options`
--
ALTER TABLE `options`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `options_key_unique` (`key`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD KEY `password_resets_email_index` (`email`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `posts_slug_unique` (`slug`) USING HASH;

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`role_id`),
  ADD KEY `role_has_permissions_role_id_foreign` (`role_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ad_senses`
--
ALTER TABLE `ad_senses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `clients`
--
ALTER TABLE `clients`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `galleries`
--
ALTER TABLE `galleries`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `image_uploads`
--
ALTER TABLE `image_uploads`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=353;

--
-- AUTO_INCREMENT for table `instagrams`
--
ALTER TABLE `instagrams`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `menus`
--
ALTER TABLE `menus`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `menu_items`
--
ALTER TABLE `menu_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `options`
--
ALTER TABLE `options`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
