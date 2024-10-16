-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 11, 2024 at 11:11 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kathongpos`
--

-- --------------------------------------------------------

--
-- Table structure for table `closedaily`
--

CREATE TABLE `closedaily` (
  `id` int(11) NOT NULL,
  `cash_in_machine` decimal(10,2) NOT NULL,
  `cash_in_system` decimal(10,2) NOT NULL,
  `cash_difference` decimal(10,2) NOT NULL,
  `user_id` int(11) NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `closedaily`
--

INSERT INTO `closedaily` (`id`, `cash_in_machine`, `cash_in_system`, `cash_difference`, `user_id`, `date`) VALUES
(1, 50.00, 30.00, -20.00, 12345, '2024-10-11');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `c_id` int(5) NOT NULL,
  `c_tel` varchar(10) NOT NULL,
  `c_fname` varchar(30) NOT NULL,
  `c_lname` varchar(30) NOT NULL,
  `c_points` int(11) DEFAULT 0,
  `c_status` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`c_id`, `c_tel`, `c_fname`, `c_lname`, `c_points`, `c_status`) VALUES
(1, '0621645650', 'Ratapumin', 'Naudom', 77, 'Active'),
(18, '0935166934', 'Thitima', 'Prabuntow', 17, 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` varchar(12) NOT NULL,
  `order_no` int(3) NOT NULL,
  `order_date_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `payment_type` varchar(10) NOT NULL,
  `user_id` int(5) DEFAULT NULL,
  `c_id` int(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `order_no`, `order_date_time`, `payment_type`, `user_id`, `c_id`) VALUES
('', 0, '2024-03-24 10:41:18', 'promtpay', 12345, NULL),
('0002', 2, '2024-02-22 08:31:49', 'promtpay', 12345, NULL),
('0003', 3, '2024-01-15 06:22:38', 'cash', 12345, 1),
('0004', 4, '2024-02-23 08:31:51', 'promtpay', 12345, NULL),
('0005', 5, '2024-01-22 04:19:26', 'cash', 12345, NULL),
('0006', 6, '2024-02-22 08:31:45', 'promtpay', 12345, 1),
('0007', 7, '2024-03-24 07:27:52', 'cash', 12345, 1),
('0008', 8, '2023-08-20 08:16:29', 'cash', 12345, 1),
('0009', 9, '2024-03-24 10:31:03', 'promtpay', 12345, NULL),
('0010', 10, '2024-03-24 10:44:31', 'promtpay', 12345, 1),
('0011', 11, '2024-04-24 10:48:06', 'promtpay', 12345, NULL),
('0012', 12, '2024-04-24 10:53:40', 'promtpay', 12345, NULL),
('0013', 13, '2024-04-24 10:56:23', 'promtpay', 12345, NULL),
('0014', 14, '2024-04-24 11:08:47', 'promtpay', 12345, 1),
('0015', 15, '2024-05-24 11:11:37', 'promtpay', 12345, NULL),
('0016', 16, '2024-05-24 11:13:21', 'cash', 12345, NULL),
('0017', 17, '2024-05-24 11:14:39', 'promtpay', 12345, NULL),
('0018', 18, '2024-05-25 06:54:43', 'cash', 12345, 1),
('0019', 19, '2024-06-25 07:09:18', 'promtpay', 12345, NULL),
('0020', 20, '2024-06-25 07:21:39', 'promtpay', 12345, NULL),
('0021', 21, '2024-06-25 07:21:47', 'promtpay', 12345, NULL),
('0022', 22, '2024-06-25 07:22:25', 'promtpay', 12345, 1),
('0023', 23, '2024-06-25 07:23:20', 'promtpay', 12345, NULL),
('0024', 24, '2024-07-25 07:24:17', 'cash', 12345, NULL),
('0025', 25, '2024-07-25 07:28:20', 'promtpay', 12345, NULL),
('0026', 26, '2023-09-25 07:29:05', 'cash', 12345, 1),
('0027', 27, '2024-07-25 07:30:06', 'promtpay', 12345, 1),
('0028', 28, '2024-07-25 07:30:19', 'cash', 12345, 1),
('0029', 29, '2024-07-25 07:30:31', 'cash', 12345, NULL),
('0030', 30, '2024-07-25 07:36:18', 'promtpay', 12345, NULL),
('0031', 31, '2024-07-25 07:36:33', 'cash', 12345, NULL),
('0032', 32, '2024-07-25 07:38:09', 'promtpay', 12345, NULL),
('0033', 33, '2024-08-25 07:38:55', 'promtpay', 12345, NULL),
('0034', 34, '2024-08-25 07:39:09', 'promtpay', 12345, NULL),
('0035', 35, '2024-08-25 07:40:46', 'promtpay', 12345, NULL),
('0036', 36, '2024-08-25 07:41:02', 'promtpay', 12345, NULL),
('0037', 37, '2024-08-25 07:41:31', 'promtpay', 12345, NULL),
('0038', 38, '2024-08-25 07:42:14', 'promtpay', 12345, NULL),
('0039', 39, '2023-09-26 06:51:13', 'promtpay', 12345, 1),
('0040', 40, '2023-09-26 06:51:33', 'cash', 12345, 1),
('0041', 41, '2023-09-27 07:45:28', 'cash', 12345, 1),
('0042', 42, '2023-09-28 12:11:45', 'promtpay', 12345, 1),
('0043', 43, '2023-09-28 12:12:12', 'cash', 12345, 18),
('0044', 44, '2023-10-28 12:13:02', 'promtpay', 12345, 18),
('0045', 45, '2023-10-28 12:13:23', 'cash', 12345, 1),
('0046', 46, '2023-10-28 12:13:42', 'cash', 12345, 18),
('0047', 47, '2023-10-28 12:13:48', 'cash', 12345, NULL),
('0048', 48, '2023-11-28 12:13:55', 'cash', 12345, NULL),
('0049', 49, '2023-11-28 12:14:01', 'cash', 12345, NULL),
('0050', 50, '2023-11-28 12:14:07', 'cash', 12345, NULL),
('0051', 51, '2023-11-28 12:14:13', 'cash', 12345, NULL),
('0052', 52, '2023-12-28 12:14:20', 'promtpay', 12345, NULL),
('0053', 53, '2023-12-28 12:17:51', 'cash', 12345, NULL),
('0054', 54, '2023-12-28 12:19:57', 'cash', 12345, NULL),
('0055', 55, '2023-12-28 12:22:35', 'cash', 12345, NULL),
('0056', 56, '2023-12-28 12:22:41', 'cash', 12345, NULL),
('0057', 57, '2023-08-01 12:22:48', 'cash', 12345, NULL),
('0058', 58, '2023-08-08 12:24:23', 'cash', 12345, NULL),
('0059', 59, '2024-09-28 12:42:00', 'promtpay', 12345, NULL),
('0060', 60, '2024-09-28 12:42:09', 'cash', 12345, NULL),
('0061', 61, '2024-09-28 12:44:02', 'cash', 12345, NULL),
('0062', 62, '2024-09-28 12:45:10', 'cash', 12345, NULL),
('0063', 63, '2024-09-28 12:46:07', 'cash', 12345, NULL),
('0064', 64, '2024-09-28 12:46:38', 'cash', 12345, NULL),
('0065', 65, '2024-09-28 12:47:01', 'cash', 12345, NULL),
('0066', 66, '2024-09-28 12:49:46', 'promtpay', 12345, NULL),
('0067', 67, '2024-09-28 12:56:08', 'cash', 12345, NULL),
('0068', 68, '2024-09-28 12:58:44', 'cash', 12345, NULL),
('0069', 69, '2024-09-28 13:06:25', 'cash', 12345, NULL),
('1', 1, '2024-01-15 06:19:27', 'cash', 12345, NULL),
('20241011001', 1, '2024-10-11 06:57:09', 'cash', 12345, NULL),
('20241011002', 2, '2024-10-11 08:05:22', 'cash', 12345, NULL),
('20241011003', 3, '2024-10-11 08:05:28', 'cash', 12345, NULL),
('20241011004', 4, '2024-10-11 08:05:32', 'promtpay', 12345, NULL),
('20241011005', 5, '2024-10-11 08:05:41', 'promtpay', 12345, 1),
('20241011006', 6, '2024-10-11 08:05:48', 'cash', 12345, NULL),
('20241011007', 7, '2024-10-11 08:06:01', 'promtpay', 12345, 1),
('20241011008', 8, '2024-10-11 08:06:07', 'cash', 12345, NULL),
('20241011009', 9, '2024-10-11 08:06:12', 'cash', 12345, NULL),
('20241011010', 10, '2024-10-11 08:06:18', 'cash', 12345, NULL),
('20241011011', 11, '2024-10-11 08:06:22', 'cash', 12345, NULL),
('20241011012', 12, '2024-10-11 08:06:33', 'cash', 12345, 18),
('20241011013', 13, '2024-10-11 08:06:38', 'cash', 12345, NULL),
('20241011014', 14, '2024-10-11 08:06:46', 'promtpay', 12345, 1),
('20241011015', 15, '2024-10-11 08:07:11', 'cash', 12345, 18),
('20241011016', 16, '2024-10-11 08:07:25', 'cash', 12345, NULL),
('20241011017', 17, '2024-10-11 08:07:44', 'cash', 12345, 18),
('20241011018', 18, '2024-10-11 08:07:49', 'promtpay', 12345, NULL),
('20241011019', 19, '2024-10-11 08:07:56', 'promtpay', 12345, NULL),
('20241011020', 20, '2024-10-11 08:08:00', 'promtpay', 12345, NULL),
('20241011021', 21, '2024-10-11 08:08:09', 'promtpay', 12345, NULL),
('20241011022', 22, '2023-09-11 08:08:13', 'promtpay', 12345, NULL),
('20241011023', 23, '2023-07-11 08:55:23', 'promtpay', 12345, NULL),
('20241011024', 24, '2023-06-11 08:57:06', 'cash', 12345, NULL),
('20241011025', 25, '2023-05-11 08:59:02', 'cash', 12345, 1),
('20241011026', 26, '2023-04-11 09:00:03', 'cash', 12345, NULL),
('20241011027', 27, '2024-10-11 09:00:30', 'cash', 12345, NULL),
('20241011028', 28, '2023-08-11 09:00:59', 'cash', 12345, NULL),
('20241011029', 29, '2023-03-11 09:01:24', 'cash', 12345, NULL),
('20241011030', 30, '2023-02-11 09:01:48', 'cash', 12345, NULL),
('20241011031', 31, '2023-01-11 09:02:26', 'cash', 12345, NULL),
('20241011032', 32, '2023-09-11 09:07:03', 'cash', 12345, NULL),
('20241011033', 33, '2023-10-11 09:07:44', 'cash', 12345, NULL),
('20241011034', 34, '2023-11-11 09:08:10', 'cash', 12345, NULL),
('20241011035', 35, '2023-12-11 09:08:46', 'cash', 12345, NULL),
('ORD123452', 1, '2023-09-03 05:00:00', 'cash', 12345, 1);

-- --------------------------------------------------------

--
-- Table structure for table `order_detail`
--

CREATE TABLE `order_detail` (
  `order_detail_id` int(3) NOT NULL,
  `order_id` varchar(12) NOT NULL,
  `p_id` int(5) NOT NULL,
  `quantity` int(5) NOT NULL,
  `price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_detail`
--

INSERT INTO `order_detail` (`order_detail_id`, `order_id`, `p_id`, `quantity`, `price`) VALUES
(131, '1', 10101, 2, 30.00),
(132, '1', 10106, 2, 35.00),
(133, '0002', 10106, 2, 35.00),
(134, '0003', 10102, 3, 30.00),
(135, '0003', 10103, 1, 30.00),
(136, '0003', 10104, 1, 30.00),
(137, '0003', 10203, 1, 25.00),
(138, '0003', 20201, 1, 15.00),
(139, '0003', 20202, 1, 15.00),
(140, '0003', 20203, 1, 25.00),
(141, '0003', 20204, 1, 15.00),
(142, '0004', 10101, 1, 30.00),
(143, '0004', 10106, 2, 35.00),
(144, '0004', 10102, 1, 30.00),
(145, '0005', 20101, 2, 25.00),
(146, '0005', 20102, 1, 25.00),
(147, '0005', 30102, 1, 25.00),
(148, '0005', 30101, 1, 30.00),
(149, '0005', 30202, 1, 15.00),
(150, '0005', 30201, 1, 25.00),
(151, '0005', 20205, 1, 25.00),
(152, '0006', 10101, 1, 30.00),
(153, '0006', 20101, 1, 25.00),
(154, '0006', 20102, 1, 25.00),
(155, '0006', 20103, 1, 30.00),
(156, '0006', 30101, 1, 30.00),
(157, '0006', 30102, 1, 25.00),
(158, '0006', 30202, 1, 15.00),
(159, '0006', 20205, 1, 25.00),
(160, '0006', 10206, 1, 30.00),
(161, '0007', 10101, 1, 30.00),
(162, '0007', 10106, 1, 35.00),
(163, '0008', 10106, 5, 35.00),
(164, '0008', 10105, 1, 30.00),
(165, '0008', 10104, 1, 30.00),
(166, '0008', 10103, 1, 30.00),
(167, '0008', 20102, 4, 25.00),
(168, '0008', 20103, 2, 30.00),
(169, '0008', 20104, 1, 25.00),
(170, '0008', 20105, 1, 30.00),
(171, '0008', 20101, 1, 25.00),
(172, '0009', 30101, 2, 30.00),
(180, '', 10101, 1, 30.00),
(181, '', 10106, 1, 35.00),
(182, '0010', 10103, 2, 30.00),
(183, '0011', 10103, 2, 30.00),
(186, '0012', 10104, 1, 30.00),
(188, 'ORD123452', 10101, 2, 100.00),
(189, 'ORD123452', 10202, 1, 50.00),
(190, '0013', 10105, 1, 30.00),
(191, '0014', 10102, 1, 30.00),
(192, '0015', 10103, 1, 30.00),
(193, '0015', 10106, 1, 35.00),
(194, '0016', 10103, 1, 30.00),
(195, '0017', 10102, 1, 30.00),
(196, '0017', 10106, 1, 35.00),
(197, '0018', 10105, 2, 30.00),
(198, '0019', 10105, 1, 30.00),
(199, '0020', 10103, 1, 30.00),
(200, '0021', 10101, 1, 30.00),
(201, '0021', 10106, 1, 35.00),
(202, '0022', 20102, 2, 25.00),
(203, '0022', 20103, 1, 30.00),
(204, '0023', 10102, 1, 30.00),
(205, '0023', 10106, 1, 35.00),
(206, '0024', 10101, 1, 30.00),
(207, '0025', 10101, 1, 30.00),
(208, '0025', 10106, 1, 35.00),
(209, '0026', 10101, 1, 30.00),
(210, '0026', 10106, 1, 35.00),
(211, '0027', 10104, 1, 30.00),
(212, '0028', 30101, 2, 30.00),
(213, '0028', 30102, 1, 25.00),
(214, '0029', 10103, 1, 30.00),
(215, '0030', 10102, 1, 30.00),
(216, '0031', 10101, 1, 30.00),
(217, '0032', 10102, 1, 30.00),
(218, '0033', 10105, 1, 30.00),
(219, '0034', 10105, 1, 30.00),
(220, '0035', 10105, 1, 30.00),
(221, '0036', 10105, 1, 30.00),
(222, '0037', 10106, 1, 35.00),
(223, '0038', 10106, 1, 35.00),
(224, '0039', 10101, 1, 30.00),
(225, '0039', 10106, 1, 35.00),
(226, '0040', 20105, 1, 30.00),
(227, '0040', 20104, 1, 25.00),
(228, '0040', 20202, 1, 15.00),
(229, '0041', 30101, 20, 30.00),
(230, '0042', 20101, 1, 25.00),
(231, '0042', 20102, 1, 25.00),
(232, '0042', 20103, 1, 30.00),
(233, '0043', 30101, 1, 30.00),
(234, '0044', 20101, 1, 25.00),
(235, '0045', 10101, 1, 30.00),
(236, '0046', 30102, 1, 25.00),
(237, '0046', 30202, 1, 15.00),
(238, '0046', 30201, 1, 25.00),
(239, '0047', 10206, 1, 30.00),
(240, '0048', 20201, 1, 15.00),
(241, '0049', 30201, 1, 25.00),
(242, '0050', 30101, 1, 30.00),
(243, '0051', 20101, 1, 25.00),
(244, '0052', 20101, 1, 25.00),
(245, '0053', 10101, 1, 30.00),
(246, '0054', 20101, 1, 25.00),
(247, '0055', 10103, 1, 30.00),
(248, '0056', 10102, 1, 30.00),
(249, '0057', 10103, 1, 30.00),
(250, '0058', 10104, 1, 30.00),
(251, '0059', 20102, 1, 25.00),
(252, '0060', 10102, 1, 30.00),
(253, '0061', 10106, 1, 35.00),
(254, '0062', 10103, 1, 30.00),
(255, '0063', 10103, 1, 30.00),
(256, '0064', 20102, 1, 25.00),
(257, '0065', 20103, 1, 30.00),
(258, '0066', 20102, 1, 25.00),
(259, '0067', 10106, 1, 35.00),
(260, '0068', 10101, 1, 30.00),
(261, '0069', 10101, 1, 30.00),
(262, '20241011001', 10101, 1, 30.00),
(263, '20241011002', 10101, 1, 30.00),
(264, '20241011002', 10106, 1, 35.00),
(265, '20241011003', 20101, 1, 25.00),
(266, '20241011004', 20101, 1, 25.00),
(267, '20241011004', 20102, 1, 25.00),
(268, '20241011004', 20103, 1, 30.00),
(269, '20241011005', 30102, 1, 25.00),
(270, '20241011006', 30101, 1, 30.00),
(271, '20241011006', 30102, 1, 25.00),
(272, '20241011006', 30202, 1, 15.00),
(273, '20241011006', 20201, 1, 15.00),
(274, '20241011006', 20202, 1, 15.00),
(275, '20241011007', 10106, 2, 35.00),
(276, '20241011007', 10202, 4, 25.00),
(277, '20241011007', 20201, 5, 15.00),
(278, '20241011007', 30202, 1, 15.00),
(279, '20241011008', 30101, 1, 30.00),
(280, '20241011009', 20101, 1, 25.00),
(281, '20241011010', 20102, 1, 25.00),
(282, '20241011011', 30102, 1, 25.00),
(283, '20241011012', 10101, 1, 30.00),
(284, '20241011013', 30102, 1, 25.00),
(285, '20241011014', 20101, 1, 25.00),
(286, '20241011015', 30102, 1, 25.00),
(287, '20241011015', 20202, 2, 15.00),
(288, '20241011015', 20203, 1, 25.00),
(289, '20241011015', 20204, 1, 15.00),
(290, '20241011015', 20205, 1, 25.00),
(291, '20241011015', 30201, 1, 25.00),
(292, '20241011015', 30202, 1, 15.00),
(293, '20241011015', 10202, 1, 25.00),
(294, '20241011015', 10206, 1, 30.00),
(295, '20241011016', 30102, 1, 25.00),
(296, '20241011016', 10202, 1, 25.00),
(297, '20241011016', 10106, 1, 35.00),
(298, '20241011016', 20102, 1, 25.00),
(299, '20241011017', 30102, 1, 25.00),
(300, '20241011017', 20202, 1, 15.00),
(301, '20241011017', 30202, 1, 15.00),
(302, '20241011017', 20205, 1, 25.00),
(303, '20241011017', 10204, 1, 25.00),
(304, '20241011018', 20101, 1, 25.00),
(305, '20241011019', 30102, 1, 25.00),
(306, '20241011019', 30202, 1, 15.00),
(307, '20241011020', 20101, 1, 25.00),
(308, '20241011021', 10106, 1, 35.00),
(309, '20241011021', 10101, 1, 30.00),
(310, '20241011021', 10103, 1, 30.00),
(311, '20241011021', 10202, 1, 25.00),
(312, '20241011021', 10203, 1, 25.00),
(313, '20241011021', 30202, 1, 15.00),
(314, '20241011021', 30201, 1, 25.00),
(315, '20241011022', 30102, 1, 25.00),
(316, '20241011023', 10101, 4, 30.00),
(317, '20241011023', 10106, 3, 35.00),
(318, '20241011023', 10103, 2, 30.00),
(319, '20241011023', 10102, 3, 30.00),
(320, '20241011023', 10205, 2, 25.00),
(321, '20241011023', 10204, 2, 25.00),
(322, '20241011023', 10203, 2, 25.00),
(323, '20241011023', 10202, 2, 25.00),
(324, '20241011023', 20202, 2, 15.00),
(325, '20241011023', 20201, 3, 15.00),
(326, '20241011023', 20203, 2, 25.00),
(327, '20241011023', 20204, 2, 15.00),
(328, '20241011023', 20205, 2, 25.00),
(329, '20241011023', 30202, 2, 15.00),
(330, '20241011023', 30201, 2, 25.00),
(331, '20241011023', 10206, 1, 30.00),
(332, '20241011023', 10201, 1, 25.00),
(333, '20241011023', 30102, 1, 25.00),
(334, '20241011023', 30101, 1, 30.00),
(335, '20241011023', 20101, 1, 25.00),
(336, '20241011023', 20102, 2, 25.00),
(337, '20241011023', 20103, 1, 30.00),
(338, '20241011023', 20104, 1, 25.00),
(339, '20241011023', 20105, 1, 30.00),
(340, '20241011023', 10104, 1, 30.00),
(341, '20241011023', 10105, 1, 30.00),
(342, '20241011024', 10101, 2, 30.00),
(343, '20241011024', 10106, 2, 35.00),
(344, '20241011024', 10102, 1, 30.00),
(345, '20241011024', 10103, 2, 30.00),
(346, '20241011024', 10105, 3, 30.00),
(347, '20241011024', 20101, 2, 25.00),
(348, '20241011024', 20102, 2, 25.00),
(349, '20241011024', 20103, 2, 30.00),
(350, '20241011024', 20104, 2, 25.00),
(351, '20241011024', 20105, 2, 30.00),
(352, '20241011024', 20202, 4, 15.00),
(353, '20241011024', 20201, 8, 15.00),
(354, '20241011024', 10201, 4, 25.00),
(355, '20241011024', 10206, 3, 30.00),
(356, '20241011024', 10202, 2, 25.00),
(357, '20241011024', 10203, 2, 25.00),
(358, '20241011024', 10204, 2, 25.00),
(359, '20241011024', 10205, 2, 25.00),
(360, '20241011024', 20203, 3, 25.00),
(361, '20241011024', 20205, 3, 25.00),
(362, '20241011024', 30202, 2, 15.00),
(363, '20241011024', 30201, 3, 25.00),
(364, '20241011024', 30102, 1, 25.00),
(365, '20241011024', 30101, 1, 30.00),
(366, '20241011024', 10104, 1, 30.00),
(367, '20241011024', 20204, 2, 15.00),
(368, '20241011025', 10101, 1, 30.00),
(369, '20241011025', 10106, 1, 35.00),
(370, '20241011025', 10102, 1, 30.00),
(371, '20241011025', 10103, 1, 30.00),
(372, '20241011025', 10104, 1, 30.00),
(373, '20241011025', 10105, 1, 30.00),
(374, '20241011025', 10201, 6, 25.00),
(375, '20241011025', 10206, 2, 30.00),
(376, '20241011025', 10202, 2, 25.00),
(377, '20241011025', 10203, 3, 25.00),
(378, '20241011025', 10204, 2, 25.00),
(379, '20241011025', 10205, 4, 25.00),
(380, '20241011025', 20201, 6, 15.00),
(381, '20241011025', 20202, 2, 15.00),
(382, '20241011025', 20203, 3, 25.00),
(383, '20241011025', 20204, 1, 15.00),
(384, '20241011025', 20205, 1, 25.00),
(385, '20241011025', 20101, 2, 25.00),
(386, '20241011025', 20102, 5, 25.00),
(387, '20241011025', 20103, 1, 30.00),
(388, '20241011025', 20104, 2, 25.00),
(389, '20241011025', 20105, 2, 30.00),
(390, '20241011025', 30102, 2, 25.00),
(391, '20241011025', 30101, 2, 30.00),
(392, '20241011025', 30202, 1, 15.00),
(393, '20241011025', 30201, 1, 25.00),
(394, '20241011026', 10101, 8, 30.00),
(395, '20241011026', 20102, 6, 25.00),
(396, '20241011026', 20101, 12, 25.00),
(397, '20241011026', 20103, 3, 30.00),
(398, '20241011026', 20104, 1, 25.00),
(399, '20241011026', 20105, 3, 30.00),
(400, '20241011026', 20205, 3, 25.00),
(401, '20241011026', 20204, 1, 15.00),
(402, '20241011026', 20203, 2, 25.00),
(403, '20241011026', 20202, 2, 15.00),
(404, '20241011026', 20201, 2, 15.00),
(405, '20241011026', 10201, 1, 25.00),
(406, '20241011026', 10206, 1, 30.00),
(407, '20241011026', 10202, 1, 25.00),
(408, '20241011026', 10203, 1, 25.00),
(409, '20241011026', 10204, 1, 25.00),
(410, '20241011026', 10205, 1, 25.00),
(411, '20241011026', 10103, 2, 30.00),
(412, '20241011026', 10102, 11, 30.00),
(413, '20241011026', 10106, 2, 35.00),
(414, '20241011026', 10104, 2, 30.00),
(415, '20241011026', 10105, 2, 30.00),
(416, '20241011026', 30102, 2, 25.00),
(417, '20241011026', 30101, 2, 30.00),
(418, '20241011026', 30202, 1, 15.00),
(419, '20241011026', 30201, 1, 25.00),
(420, '20241011027', 10101, 2, 30.00),
(421, '20241011027', 10106, 2, 35.00),
(422, '20241011027', 10102, 2, 30.00),
(423, '20241011027', 20103, 1, 30.00),
(424, '20241011027', 20102, 5, 25.00),
(425, '20241011027', 20101, 8, 25.00),
(426, '20241011027', 20205, 1, 25.00),
(427, '20241011027', 20204, 1, 15.00),
(428, '20241011027', 20203, 1, 25.00),
(429, '20241011027', 20202, 1, 15.00),
(430, '20241011027', 20201, 1, 15.00),
(431, '20241011027', 10201, 4, 25.00),
(432, '20241011027', 10206, 3, 30.00),
(433, '20241011027', 10202, 2, 25.00),
(434, '20241011027', 10203, 4, 25.00),
(435, '20241011027', 10204, 1, 25.00),
(436, '20241011027', 10205, 1, 25.00),
(437, '20241011027', 10103, 1, 30.00),
(438, '20241011027', 10104, 1, 30.00),
(439, '20241011027', 10105, 1, 30.00),
(440, '20241011027', 30102, 1, 25.00),
(441, '20241011027', 30101, 6, 30.00),
(442, '20241011027', 30202, 1, 15.00),
(443, '20241011027', 30201, 1, 25.00),
(444, '20241011028', 10101, 5, 30.00),
(445, '20241011028', 10106, 1, 35.00),
(446, '20241011028', 10102, 1, 30.00),
(447, '20241011028', 10103, 1, 30.00),
(448, '20241011028', 10104, 1, 30.00),
(449, '20241011028', 10105, 1, 30.00),
(450, '20241011028', 10201, 9, 25.00),
(451, '20241011028', 10206, 1, 30.00),
(452, '20241011028', 10202, 4, 25.00),
(453, '20241011028', 10203, 1, 25.00),
(454, '20241011028', 10204, 1, 25.00),
(455, '20241011028', 10205, 1, 25.00),
(456, '20241011028', 20101, 7, 25.00),
(457, '20241011028', 20102, 4, 25.00),
(458, '20241011028', 20103, 2, 30.00),
(459, '20241011028', 20104, 3, 25.00),
(460, '20241011028', 20105, 1, 30.00),
(461, '20241011028', 20201, 2, 15.00),
(462, '20241011028', 20202, 1, 15.00),
(463, '20241011028', 20204, 1, 15.00),
(464, '20241011028', 20203, 1, 25.00),
(465, '20241011028', 20205, 1, 25.00),
(466, '20241011028', 30201, 2, 25.00),
(467, '20241011028', 30102, 2, 25.00),
(468, '20241011028', 30202, 1, 15.00),
(469, '20241011028', 30101, 1, 30.00),
(470, '20241011029', 10101, 7, 30.00),
(471, '20241011029', 10106, 2, 35.00),
(472, '20241011029', 10102, 1, 30.00),
(473, '20241011029', 10103, 1, 30.00),
(474, '20241011029', 10104, 1, 30.00),
(475, '20241011029', 10105, 1, 30.00),
(476, '20241011029', 10201, 7, 25.00),
(477, '20241011029', 10206, 2, 30.00),
(478, '20241011029', 10202, 3, 25.00),
(479, '20241011029', 10203, 1, 25.00),
(480, '20241011029', 10204, 1, 25.00),
(481, '20241011029', 10205, 1, 25.00),
(482, '20241011029', 20201, 6, 15.00),
(483, '20241011029', 20202, 1, 15.00),
(484, '20241011029', 20203, 1, 25.00),
(485, '20241011029', 20204, 1, 15.00),
(486, '20241011029', 20205, 1, 25.00),
(487, '20241011029', 20102, 1, 25.00),
(488, '20241011029', 20101, 6, 25.00),
(489, '20241011029', 20103, 1, 30.00),
(490, '20241011029', 20104, 1, 25.00),
(491, '20241011029', 20105, 1, 30.00),
(492, '20241011029', 30101, 8, 30.00),
(493, '20241011029', 30102, 1, 25.00),
(494, '20241011029', 30202, 1, 15.00),
(495, '20241011029', 30201, 3, 25.00),
(496, '20241011030', 10101, 7, 30.00),
(497, '20241011030', 10106, 1, 35.00),
(498, '20241011030', 10102, 1, 30.00),
(499, '20241011030', 10103, 1, 30.00),
(500, '20241011030', 10104, 1, 30.00),
(501, '20241011030', 10105, 2, 30.00),
(502, '20241011030', 10201, 6, 25.00),
(503, '20241011030', 10206, 1, 30.00),
(504, '20241011030', 10202, 1, 25.00),
(505, '20241011030', 10203, 1, 25.00),
(506, '20241011030', 10204, 1, 25.00),
(507, '20241011030', 10205, 1, 25.00),
(508, '20241011030', 20201, 6, 15.00),
(509, '20241011030', 20202, 1, 15.00),
(510, '20241011030', 20203, 1, 25.00),
(511, '20241011030', 20204, 1, 15.00),
(512, '20241011030', 20205, 1, 25.00),
(513, '20241011030', 20101, 6, 25.00),
(514, '20241011030', 20102, 1, 25.00),
(515, '20241011030', 20103, 1, 30.00),
(516, '20241011030', 20104, 1, 25.00),
(517, '20241011030', 20105, 1, 30.00),
(518, '20241011030', 30101, 9, 30.00),
(519, '20241011030', 30102, 1, 25.00),
(520, '20241011030', 30202, 1, 15.00),
(521, '20241011030', 30201, 1, 25.00),
(522, '20241011031', 10101, 9, 30.00),
(523, '20241011031', 10106, 2, 35.00),
(524, '20241011031', 10102, 2, 30.00),
(525, '20241011031', 10103, 1, 30.00),
(526, '20241011031', 10104, 2, 30.00),
(527, '20241011031', 10105, 4, 30.00),
(528, '20241011031', 20101, 9, 25.00),
(529, '20241011031', 20102, 2, 25.00),
(530, '20241011031', 20103, 2, 30.00),
(531, '20241011031', 20104, 2, 25.00),
(532, '20241011031', 20105, 1, 30.00),
(533, '20241011031', 30102, 2, 25.00),
(534, '20241011031', 30101, 2, 30.00),
(535, '20241011031', 30201, 4, 25.00),
(536, '20241011031', 30202, 1, 15.00),
(537, '20241011031', 20202, 2, 15.00),
(538, '20241011031', 20201, 4, 15.00),
(539, '20241011031', 20203, 1, 25.00),
(540, '20241011031', 20205, 1, 25.00),
(541, '20241011031', 20204, 1, 15.00),
(542, '20241011031', 10201, 1, 25.00),
(543, '20241011031', 10206, 1, 30.00),
(544, '20241011031', 10202, 1, 25.00),
(545, '20241011031', 10203, 1, 25.00),
(546, '20241011031', 10204, 1, 25.00),
(547, '20241011031', 10205, 1, 25.00),
(548, '20241011032', 10101, 9, 30.00),
(549, '20241011032', 10106, 1, 35.00),
(550, '20241011032', 10102, 1, 30.00),
(551, '20241011032', 10103, 4, 30.00),
(552, '20241011032', 10104, 2, 30.00),
(553, '20241011032', 10105, 2, 30.00),
(554, '20241011032', 10201, 5, 25.00),
(555, '20241011032', 10206, 1, 30.00),
(556, '20241011032', 10202, 1, 25.00),
(557, '20241011032', 10203, 1, 25.00),
(558, '20241011032', 10204, 1, 25.00),
(559, '20241011032', 10205, 1, 25.00),
(560, '20241011032', 20201, 6, 15.00),
(561, '20241011032', 20202, 1, 15.00),
(562, '20241011032', 20203, 1, 25.00),
(563, '20241011032', 20204, 1, 15.00),
(564, '20241011032', 20205, 1, 25.00),
(565, '20241011032', 20101, 5, 25.00),
(566, '20241011032', 20102, 1, 25.00),
(567, '20241011032', 20103, 1, 30.00),
(568, '20241011032', 20104, 1, 25.00),
(569, '20241011032', 20105, 1, 30.00),
(570, '20241011032', 30101, 2, 30.00),
(571, '20241011032', 30102, 2, 25.00),
(572, '20241011032', 30201, 2, 25.00),
(573, '20241011032', 30202, 1, 15.00),
(574, '20241011033', 10101, 12, 30.00),
(575, '20241011033', 10106, 1, 35.00),
(576, '20241011033', 10102, 1, 30.00),
(577, '20241011033', 10103, 1, 30.00),
(578, '20241011033', 10104, 2, 30.00),
(579, '20241011033', 10105, 1, 30.00),
(580, '20241011033', 10201, 1, 25.00),
(581, '20241011033', 10206, 1, 30.00),
(582, '20241011033', 10202, 1, 25.00),
(583, '20241011033', 10203, 1, 25.00),
(584, '20241011033', 10204, 1, 25.00),
(585, '20241011033', 10205, 1, 25.00),
(586, '20241011033', 20101, 12, 25.00),
(587, '20241011033', 20102, 1, 25.00),
(588, '20241011033', 20103, 1, 30.00),
(589, '20241011033', 20104, 1, 25.00),
(590, '20241011033', 20105, 1, 30.00),
(591, '20241011033', 20201, 2, 15.00),
(592, '20241011033', 20202, 1, 15.00),
(593, '20241011033', 20203, 1, 25.00),
(594, '20241011033', 20204, 1, 15.00),
(595, '20241011033', 20205, 1, 25.00),
(596, '20241011033', 30201, 4, 25.00),
(597, '20241011033', 30202, 1, 15.00),
(598, '20241011033', 30101, 2, 30.00),
(599, '20241011033', 30102, 1, 25.00),
(600, '20241011034', 10101, 7, 30.00),
(601, '20241011034', 10106, 3, 35.00),
(602, '20241011034', 10102, 13, 30.00),
(603, '20241011034', 10103, 1, 30.00),
(604, '20241011034', 10104, 1, 30.00),
(605, '20241011034', 10105, 1, 30.00),
(606, '20241011034', 10202, 1, 25.00),
(607, '20241011034', 10201, 4, 25.00),
(608, '20241011034', 10206, 2, 30.00),
(609, '20241011034', 10203, 2, 25.00),
(610, '20241011034', 10204, 2, 25.00),
(611, '20241011034', 10205, 1, 25.00),
(612, '20241011034', 20201, 4, 15.00),
(613, '20241011034', 20202, 1, 15.00),
(614, '20241011034', 20203, 1, 25.00),
(615, '20241011034', 20204, 1, 15.00),
(616, '20241011034', 20205, 1, 25.00),
(617, '20241011034', 20101, 10, 25.00),
(618, '20241011034', 20102, 1, 25.00),
(619, '20241011034', 20103, 1, 30.00),
(620, '20241011034', 20104, 1, 25.00),
(621, '20241011034', 20105, 1, 30.00),
(622, '20241011034', 30101, 5, 30.00),
(623, '20241011034', 30102, 2, 25.00),
(624, '20241011035', 10101, 14, 30.00),
(625, '20241011035', 10106, 5, 35.00),
(626, '20241011035', 10102, 5, 30.00),
(627, '20241011035', 10103, 3, 30.00),
(628, '20241011035', 10104, 1, 30.00),
(629, '20241011035', 10105, 1, 30.00),
(630, '20241011035', 10201, 7, 25.00),
(631, '20241011035', 10206, 4, 30.00),
(632, '20241011035', 10202, 3, 25.00),
(633, '20241011035', 10203, 2, 25.00),
(634, '20241011035', 10204, 2, 25.00),
(635, '20241011035', 10205, 2, 25.00),
(636, '20241011035', 20201, 7, 15.00),
(637, '20241011035', 20102, 1, 25.00),
(638, '20241011035', 20101, 9, 25.00),
(639, '20241011035', 20103, 6, 30.00),
(640, '20241011035', 20104, 1, 25.00),
(641, '20241011035', 20105, 1, 30.00),
(642, '20241011035', 20202, 2, 15.00),
(643, '20241011035', 20203, 1, 25.00),
(644, '20241011035', 20204, 1, 15.00),
(645, '20241011035', 20205, 1, 25.00),
(646, '20241011035', 30201, 4, 25.00),
(647, '20241011035', 30202, 4, 15.00),
(648, '20241011035', 30101, 2, 30.00),
(649, '20241011035', 30102, 4, 25.00);

-- --------------------------------------------------------

--
-- Table structure for table `points_history`
--

CREATE TABLE `points_history` (
  `id` int(11) NOT NULL,
  `c_id` int(11) DEFAULT NULL,
  `points` int(11) DEFAULT NULL,
  `type` enum('earn','redeem') NOT NULL,
  `transaction_date` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `points_history`
--

INSERT INTO `points_history` (`id`, `c_id`, `points`, `type`, `transaction_date`) VALUES
(23, 1, 2, 'earn', '2024-09-04 20:20:51'),
(24, 1, -5, 'redeem', '2024-09-04 20:20:51'),
(25, 1, 2, 'earn', '2024-09-04 20:31:21'),
(26, 1, -2, 'redeem', '2024-09-04 20:31:21'),
(27, 1, 2, 'earn', '2024-09-04 20:43:33'),
(28, 1, -10, 'redeem', '2024-09-04 20:43:33'),
(29, 1, 3, 'earn', '2024-09-04 20:46:26'),
(30, 1, 2, 'earn', '2024-09-04 20:46:38'),
(31, 1, 2, 'earn', '2024-09-04 20:47:12'),
(32, 1, 2, 'earn', '2024-09-05 13:16:00'),
(33, 1, 2, 'earn', '2024-09-05 13:17:18'),
(34, 1, -10, 'redeem', '2024-09-05 13:17:18'),
(35, 1, 2, 'earn', '2024-09-05 13:22:20'),
(36, 1, -10, 'redeem', '2024-09-05 13:22:20'),
(37, 1, 2, 'earn', '2024-09-15 12:48:42'),
(38, 1, 9, 'earn', '2024-09-15 06:22:38'),
(39, 1, 9, 'earn', '2024-09-22 15:31:24'),
(40, 1, 2, 'earn', '2024-09-24 14:27:52'),
(41, 1, -10, 'redeem', '2024-09-24 14:27:52'),
(42, 1, 20, 'earn', '2024-09-24 15:16:29'),
(43, 1, -10, 'redeem', '2024-09-24 15:16:29'),
(46, 1, 2, 'earn', '2024-09-24 17:44:31'),
(47, 1, -10, 'redeem', '2024-09-24 17:44:31'),
(48, 1, 3, 'earn', '2024-09-03 12:00:00'),
(49, 1, 1, 'earn', '2024-09-24 18:08:47'),
(50, 1, -10, 'redeem', '2024-09-24 18:08:47'),
(51, 1, 2, 'earn', '2024-09-25 13:54:43'),
(52, 1, -10, 'redeem', '2024-09-25 13:54:43'),
(53, 1, 3, 'earn', '2024-09-25 14:22:25'),
(54, 1, -10, 'redeem', '2024-09-25 14:22:25'),
(55, 1, 2, 'earn', '2024-09-25 14:29:05'),
(56, 1, -10, 'redeem', '2024-09-25 14:29:05'),
(57, 1, 1, 'earn', '2024-09-25 14:30:06'),
(58, 1, -10, 'redeem', '2024-09-25 14:30:06'),
(59, 1, 3, 'earn', '2024-09-25 14:30:19'),
(60, 1, -10, 'redeem', '2024-09-25 14:30:19'),
(61, 1, 2, 'earn', '2024-09-26 13:51:13'),
(62, 1, 2, 'earn', '2024-09-26 13:51:33'),
(63, 1, 24, 'earn', '2024-09-27 14:45:28'),
(64, 1, -10, 'redeem', '2024-09-27 14:45:28'),
(65, 1, 3, 'earn', '2024-09-28 19:11:45'),
(66, 18, 1, 'earn', '2024-09-28 19:12:12'),
(67, 18, 1, 'earn', '2024-09-28 19:13:02'),
(68, 1, 1, 'earn', '2024-09-28 19:13:23'),
(69, 18, 2, 'earn', '2024-09-28 19:13:42'),
(70, 1, 1, 'earn', '2024-10-11 15:05:41'),
(71, 1, 10, 'earn', '2024-10-11 15:06:01'),
(72, 1, -10, 'redeem', '2024-10-11 15:06:01'),
(73, 18, 1, 'earn', '2024-10-11 15:06:33'),
(74, 1, 1, 'earn', '2024-10-11 15:06:46'),
(75, 18, 8, 'earn', '2024-10-11 15:07:11'),
(76, 18, 4, 'earn', '2024-10-11 15:07:44'),
(77, 1, 54, 'earn', '2024-10-11 15:59:02'),
(78, 1, -10, 'redeem', '2024-10-11 15:59:02');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `p_id` int(5) NOT NULL,
  `p_name` varchar(30) NOT NULL,
  `p_price` float NOT NULL,
  `p_type` varchar(10) DEFAULT NULL,
  `category` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`p_id`, `p_name`, `p_price`, `p_type`, `category`) VALUES
(10101, 'Americano', 30, 'Coffee', 'ICE'),
(10102, 'Espresso', 30, 'Coffee', 'ICE'),
(10103, 'Cappuccino', 30, 'Coffee', 'ICE'),
(10104, 'Mocha', 30, 'Coffee', 'ICE'),
(10105, 'Latte', 30, 'Coffee', 'ICE'),
(10106, 'Black Honey Lemon', 35, 'Coffee', 'ICE'),
(10201, 'Americano', 25, 'Coffee', 'HOT'),
(10202, 'Espresso', 25, 'Coffee', 'HOT'),
(10203, 'Cappuccino', 25, 'Coffee', 'HOT'),
(10204, 'Mocha', 25, 'Coffee', 'HOT'),
(10205, 'Latte', 25, 'Coffee', 'HOT'),
(10206, 'Black Honey Lemon', 30, 'Coffee', 'HOT'),
(20101, 'Tea Thai', 25, 'Tea', 'ICE'),
(20102, 'Black Tea', 25, 'Tea', 'ICE'),
(20103, 'Green Tea', 30, 'Tea', 'ICE'),
(20104, 'Lemon Tea', 25, 'Tea', 'ICE'),
(20105, 'Black Green Tea', 30, 'Tea', 'ICE'),
(20201, 'Tea Thai', 15, 'Tea', 'HOT'),
(20202, 'Black Tea', 15, 'Tea', 'HOT'),
(20203, 'Green Tea', 25, 'Tea', 'HOT'),
(20204, ' Lemon Tea', 15, 'Tea', 'HOT'),
(20205, 'Black Green Tea', 25, 'Tea', 'HOT'),
(30101, ' Cocoa', 30, 'Chocolate', 'ICE'),
(30102, 'Ovaltine', 25, 'Chocolate', 'ICE'),
(30201, 'Cocoa', 25, 'Chocolate', 'HOT'),
(30202, 'Ovaltine', 15, 'Chocolate', 'HOT');

-- --------------------------------------------------------

--
-- Table structure for table `user_account`
--

CREATE TABLE `user_account` (
  `user_id` int(5) NOT NULL,
  `user_fname` varchar(30) NOT NULL,
  `user_lname` varchar(30) NOT NULL,
  `user_tel` varchar(10) NOT NULL,
  `user_id_card` varchar(13) NOT NULL,
  `role_type` varchar(1) NOT NULL,
  `user_status` varchar(10) NOT NULL,
  `user_password` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_account`
--

INSERT INTO `user_account` (`user_id`, `user_fname`, `user_lname`, `user_tel`, `user_id_card`, `role_type`, `user_status`, `user_password`) VALUES
(5151, 'kanya', 'jampa', '0824315254', '3900987581154', 'O', 'Active', '12345'),
(11927, 'admin', 'admin', '0621645651', '1909802511927', 'A', 'Active', '11111'),
(12345, 'thiti', 'prabun', '0935166934', '1955487632514', 'O', 'Active', '12345'),
(22453, 'Thitima', 'Prabuntow', '0935166935', '3909887515495', 'E', 'Active', '12345'),
(53725, 'Ratapumin', 'Naudom', '0621645650', '1909802511928', 'E', 'Active', '11111');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `closedaily`
--
ALTER TABLE `closedaily`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`c_id`),
  ADD UNIQUE KEY `c_tel` (`c_tel`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `c_id` (`c_id`);

--
-- Indexes for table `order_detail`
--
ALTER TABLE `order_detail`
  ADD PRIMARY KEY (`order_detail_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `p_id` (`p_id`);

--
-- Indexes for table `points_history`
--
ALTER TABLE `points_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `c_id` (`c_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`p_id`);

--
-- Indexes for table `user_account`
--
ALTER TABLE `user_account`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `user_tel` (`user_tel`),
  ADD UNIQUE KEY `user_id_card` (`user_id_card`) USING BTREE;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `closedaily`
--
ALTER TABLE `closedaily`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `c_id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `order_detail`
--
ALTER TABLE `order_detail`
  MODIFY `order_detail_id` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=650;

--
-- AUTO_INCREMENT for table `points_history`
--
ALTER TABLE `points_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `p_id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10210206;

--
-- AUTO_INCREMENT for table `user_account`
--
ALTER TABLE `user_account`
  MODIFY `user_id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=123457;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `closedaily`
--
ALTER TABLE `closedaily`
  ADD CONSTRAINT `closedaily_user_id` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`user_id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`user_id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`c_id`) REFERENCES `customers` (`c_id`);

--
-- Constraints for table `order_detail`
--
ALTER TABLE `order_detail`
  ADD CONSTRAINT `order_detail_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  ADD CONSTRAINT `order_detail_ibfk_2` FOREIGN KEY (`p_id`) REFERENCES `products` (`p_id`);

--
-- Constraints for table `points_history`
--
ALTER TABLE `points_history`
  ADD CONSTRAINT `points_history_ibfk_1` FOREIGN KEY (`c_id`) REFERENCES `customers` (`c_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
