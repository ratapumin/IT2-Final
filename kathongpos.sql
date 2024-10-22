-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 22, 2024 at 08:50 AM
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
-- Table structure for table `points_history`
--

CREATE TABLE `points_history` (
  `id` int(11) NOT NULL,
  `c_id` int(11) DEFAULT NULL,
  `points` int(11) DEFAULT NULL,
  `type` enum('earn','redeem') NOT NULL,
  `transaction_date` datetime DEFAULT current_timestamp(),
  `order_id` varchar(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `points_history`
--

INSERT INTO `points_history` (`id`, `c_id`, `points`, `type`, `transaction_date`, `order_id`) VALUES
(61, 1, 2, 'earn', '2024-09-26 13:51:13', '0039'),
(62, 1, 2, 'earn', '2024-09-26 13:51:33', '0040'),
(63, 1, 24, 'earn', '2024-09-27 14:45:28', '0041'),
(64, 1, -10, 'redeem', '2024-09-27 14:45:28', '0041'),
(65, 1, 3, 'earn', '2024-09-28 19:11:45', '0042'),
(66, 18, 1, 'earn', '2024-09-28 19:12:12', '0043'),
(67, 18, 1, 'earn', '2024-09-28 19:13:02', '0044'),
(68, 1, 1, 'earn', '2024-09-28 19:13:23', '0045'),
(69, 18, 2, 'earn', '2024-09-28 19:13:42', '0046'),
(70, 1, 1, 'earn', '2024-10-11 15:05:41', '20241011005'),
(71, 1, 10, 'earn', '2024-10-11 15:06:01', '20241011007'),
(72, 1, -10, 'redeem', '2024-10-11 15:06:01', '20241011007'),
(73, 18, 1, 'earn', '2024-10-11 15:06:33', '20241011012'),
(74, 1, 1, 'earn', '2024-10-11 15:06:46', '20241011014'),
(75, 18, 8, 'earn', '2024-10-11 15:07:11', '20241011015'),
(76, 18, 4, 'earn', '2024-10-11 15:07:44', '20241011017'),
(78, 1, -10, 'redeem', '2024-10-11 15:59:02', '20241011007'),
(79, 1, 1, 'earn', '2024-10-18 10:14:18', '20241018001'),
(80, 1, 2, 'earn', '2024-10-18 10:39:11', '20241018002'),
(81, 1, -10, 'redeem', '2024-10-18 10:39:11', '20241018002'),
(82, 1, 4, 'earn', '2024-10-18 13:46:57', '20241018004'),
(83, 1, 1, 'earn', '2024-10-18 13:52:59', '20241018005'),
(84, 1, -10, 'redeem', '2024-10-18 13:52:59', '20241018005'),
(85, 1, 1, 'earn', '2024-10-18 14:33:33', '20241018007'),
(86, 1, -10, 'redeem', '2024-10-18 14:33:33', '20241018007'),
(87, 1, 2, 'earn', '2024-10-19 10:00:56', '20241019003'),
(88, 1, -10, 'redeem', '2024-10-19 10:00:56', '20241019003'),
(89, 1, 5, 'earn', '2024-10-20 14:24:14', '20241020001'),
(90, 1, -10, 'redeem', '2024-10-20 14:24:14', '20241020001'),
(91, 18, 43, 'earn', '2024-10-20 14:28:22', '20241020002'),
(92, 18, -10, 'redeem', '2024-10-20 14:28:22', '20241020002'),
(93, 1, 1, 'earn', '2024-10-20 14:47:53', '20241020004'),
(94, 1, -10, 'redeem', '2024-10-20 14:47:53', '20241020004'),
(95, 1, 3, 'earn', '2024-10-22 09:33:21', '20241022001'),
(96, 1, -10, 'redeem', '2024-10-22 09:33:21', '20241022001'),
(97, 18, 3, 'earn', '2024-10-22 09:33:39', '20241022002'),
(98, 18, -10, 'redeem', '2024-10-22 09:33:39', '20241022002'),
(99, 1, 3, 'earn', '2024-10-22 09:50:11', '20241022003'),
(100, 1, -10, 'redeem', '2024-10-22 09:50:11', '20241022003'),
(101, 1, 5, 'earn', '2024-10-22 09:50:29', '20241022004'),
(102, 1, -10, 'redeem', '2024-10-22 09:50:29', '20241022004'),
(103, 1, 1, 'earn', '2024-10-22 12:15:16', '20241022005'),
(104, 1, 2, 'earn', '2024-10-22 13:49:38', '20241022006'),
(105, 1, -10, 'redeem', '2024-10-22 13:49:38', '20241022006');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `points_history`
--
ALTER TABLE `points_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `c_id` (`c_id`),
  ADD KEY `points_history_ibfk_2` (`order_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `points_history`
--
ALTER TABLE `points_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=106;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `points_history`
--
ALTER TABLE `points_history`
  ADD CONSTRAINT `points_history_ibfk_1` FOREIGN KEY (`c_id`) REFERENCES `customers` (`c_id`),
  ADD CONSTRAINT `points_history_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
