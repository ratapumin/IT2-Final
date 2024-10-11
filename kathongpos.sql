-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 11, 2024 at 08:59 AM
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
(1, '0621645650', 'Ratapumin', 'Naudom', 31, 'Active'),
(18, '0935166934', 'Thitima', 'Prabuntow', 4, 'Active');

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
('ORD123452', 1, '2024-01-03 05:00:00', 'cash', 12345, 1);

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
(262, '20241011001', 10101, 1, 30.00);

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
(69, 18, 2, 'earn', '2024-09-28 19:13:42');

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
  MODIFY `order_detail_id` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=263;

--
-- AUTO_INCREMENT for table `points_history`
--
ALTER TABLE `points_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

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
