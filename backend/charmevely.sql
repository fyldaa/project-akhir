-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 12, 2026 at 06:24 AM
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
-- Database: `charmevely`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_add_product` (IN `p_name` VARCHAR(150), IN `p_price` INT, IN `p_category` ENUM('Bracelet','Necklace','Ring'), IN `p_image_url` VARCHAR(255), IN `p_shopee_url` VARCHAR(255), IN `p_details` JSON, IN `p_is_bestseller` TINYINT(1))   BEGIN
    INSERT INTO products (name, price, category, image_url, shopee_url, details, is_bestseller)
    VALUES (p_name, p_price, p_category, p_image_url, p_shopee_url, p_details, p_is_bestseller);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_delete_product` (IN `p_id` INT)   BEGIN
    DELETE FROM products WHERE id = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_product` (IN `p_id` INT, IN `p_name` VARCHAR(150), IN `p_price` INT, IN `p_category` ENUM('Bracelet','Necklace','Ring'), IN `p_image_url` VARCHAR(255), IN `p_shopee_url` VARCHAR(255), IN `p_details` JSON, IN `p_is_bestseller` TINYINT(1))   BEGIN
    UPDATE products
    SET name          = p_name,
        price         = p_price,
        category      = p_category,
        image_url     = IFNULL(p_image_url, image_url),
        shopee_url    = p_shopee_url,
        details       = p_details,
        is_bestseller = p_is_bestseller
    WHERE id = p_id;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

CREATE TABLE `favorites` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `favorites`
--

INSERT INTO `favorites` (`id`, `user_id`, `product_id`, `created_at`) VALUES
(2, 7, 8, '2026-05-05 22:03:00'),
(5, 9, 32, '2026-05-11 08:33:41'),
(7, 7, 3, '2026-05-11 08:58:32');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `price` int(11) NOT NULL,
  `category` enum('Bracelet','Necklace','Ring') NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `shopee_url` varchar(255) DEFAULT 'https://shopee.co.id',
  `details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`details`)),
  `is_bestseller` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `category`, `image_url`, `shopee_url`, `details`, `is_bestseller`, `created_at`) VALUES
(2, 'Titanium Bracelet', 12399, 'Bracelet', '/titanium.jpeg', 'https://id.shp.ee/SAy3vApK', '[\"material: titanium\",\"color: pink\",\"length: approx. 17 cm\",\"adjustable\",\"durable and comfortable for daily wear\"]', 1, '2026-05-05 10:05:30'),
(3, 'Cottage Core Bracelet', 21800, 'Bracelet', '/cottage.jpeg', 'https://id.shp.ee/8tknURhv', '[\"material: glass beads, alloy charm, nickel chain\",\"color: pink and green\",\"length: approx. 16–19 cm\",\"adjustable\",\"lightweight and comfy for daily wear\"]', 0, '2026-05-05 10:05:30'),
(4, 'Strawberry Bracelet', 21800, 'Bracelet', '/strawberry.jpeg', 'https://id.shp.ee/EPBfyHZq', '[\"material: glass beads, alloy charm, nickel chain\",\"color: pink\",\"length: approx. 16–19 cm\",\"adjustable\",\"cute design, comfortable for daily wear\"]', 0, '2026-05-05 10:05:30'),
(6, 'Paracord Bracelet Violet', 30500, 'Bracelet', '/violet.jpeg', 'https://id.shp.ee/U4Q2L4iA', '[\"material: paracord\",\"color: violet\",\"length: approx. 24–25 cm\",\"adjustable\",\"durable and lightweight for daily wear\"]', 0, '2026-05-05 10:05:30'),
(7, 'Italian Charm Bracelet', 39024, 'Bracelet', '/italian.png', 'https://shopee.co.id/Italian-Charm-Bracelet-kartun-pree-order-sudah-jdi-gelang-i.1492787484.48805623608?extraParams=%7B%22display_model_id%22%3A380507021047%2C%22model_selection_logic%22%3A2%7D&sp_atk=469f65e8-5912-4d4f-8a86-98546424f200&xptdk=469f65e8-59', '[\"material: stainless steel\",\"color: silver\",\"length: approx. 16–20 cm\",\"adjustable\",\"modular charm (bisa bongkar pasang)\"]', 0, '2026-05-05 10:05:30'),
(8, 'Orchid’s Beads Bracelet', 49500, 'Bracelet', '/orchid.png', 'https://shopee.co.id/Orchid%E2%80%99s-Bracelets-Beads-Bracelets-Bluefridayy-i.811658106.27030841097?extraParams=%7B%22display_model_id%22%3A195949303922%2C%22model_selection_logic%22%3A2%7D', '[\"material: beads\",\"color: blue mix\",\"stretch bracelet (free size)\",\"lightweight and comfortable for daily wear\",\"cute beads design, suitable for casual outfit\"]', 0, '2026-05-05 10:05:30'),
(9, 'Soft Mix Tasbih Bracelet', 35000, 'Bracelet', '/tasbih.png', 'https://shopee.co.id/READY-GELANG-SOFT-MIX-TASBIH-33-BUTIR-FREE-BOX-i.507862417.21035315761?extraParams=%7B%22display_model_id%22%3A59684688243%2C%22model_selection_logic%22%3A3%7D&sp_atk=c29354b3-b5c3-48a4-80d7-49241b24727a&xptdk=c29354b3-b5c3-48a4-80d7-', '[\"material: beads\",\"color: soft mix\",\"33 beads (tasbih style)\",\"adjustable\",\"lightweight and comfortable for daily wear\"]', 0, '2026-05-05 10:05:30'),
(10, 'Lover Beads Watch Bracelet', 43800, 'Bracelet', '/lover.png', 'https://shopee.co.id/Jam-tangan-HINDIA-jam-tangan-inpirasi-by-Hindia-jam-tangan-beads-i.1172329331.41773477913?extraParams=%7B%22display_model_id%22%3A435182988241%2C%22model_selection_logic%22%3A2%7D', '[\"material: beads & alloy\",\"color: mixed\",\"watch bracelet design\",\"adjustable\",\"lightweight and comfortable for daily wear\"]', 0, '2026-05-05 10:05:30'),
(11, 'Mahogany Embroidery Bracelet', 28000, 'Bracelet', '/mahogany.png', 'https://shopee.co.id/mahogany-and-black-embroidery-bracelet-series-i.1441516654.48156293353?extraParams=%7B%22display_model_id%22%3A198808675019%2C%22model_selection_logic%22%3A2%7D', '[\"material: embroidery thread\",\"color: mahogany & black\",\"length: adjustable\",\"handmade style design\",\"comfortable for daily wear\"]', 0, '2026-05-05 10:05:30'),
(12, 'Winter Thin Bracelet', 10449, 'Bracelet', '/winter.png', 'https://shopee.co.id/Winter-Bracelets-Tali-Thin-Adjustable-24cm-Snoww.Studio-i.841551855.56953376329?extraParams=%7B%22display_model_id%22%3A395323982346%2C%22model_selection_logic%22%3A2%7D', '[\"material: rope\",\"color: mixed\",\"length: approx. 24 cm\",\"adjustable\",\"lightweight and comfortable for daily wear\"]', 0, '2026-05-05 10:05:30'),
(13, 'Ribbon Necklace', 11299, 'Necklace', '/ribbon.png', 'https://shopee.co.id/Sadyye-Kalung-Mutiara-Pita-Manis-Rantai-Tulang-Selangka-Mewah-Rantai-Leher-Ceruk-Ringan-Untuk-Wanita-i.1497793003.42757301130?extraParams=%7B%22display_model_id%22%3A275617622924%2C%22model_selection_logic%22%3A3%7D', '[\"material: pearl ribbon pendant\",\"color: soft white\",\"elegant ribbon centerpiece design\",\"length: approx. 45–50 cm\",\"adjustable fit\"]', 1, '2026-05-05 10:05:30'),
(14, 'Apple Necklace', 26599, 'Necklace', '/apple.png', 'https://shopee.co.id/Ginmme-Kalung-Bintang-Apel-Warna-warni-Rantai-Tulang-Selangka-Musim-Panas-Segar-Gelang-Manik-Dopamin-i.1497657411.26487150178?extraParams=%7B%22display_model_id%22%3A276139048308%2C%22model_selection_logic%22%3A3%7D', '[\"material: glass beads\",\"color: rainbow mix\",\"playful apple charm accent\",\"length: approx. 45 cm\",\"not adjustable\"]', 0, '2026-05-05 10:05:30'),
(15, 'Butterfly Necklace', 26000, 'Necklace', '/butterfly.png', 'https://id.shp.ee/wf1fDXSX', '[\"material: clay pendant\",\"color: black & purple tone\",\"butterfly statement charm\",\"length: approx. 45 cm\",\"adjustable design\"]', 0, '2026-05-05 10:05:30'),
(16, 'Love Purple Necklace', 13185, 'Necklace', '/love.png', 'https://id.shp.ee/Fk4cTx47', '[\"material: alloy pendant\",\"color: deep purple\",\"heart love charm focus\",\"length: approx. 45 cm\",\"fixed length\"]', 0, '2026-05-05 10:05:30'),
(17, 'Peach Blossom Necklace', 20199, 'Necklace', '/peach.png', 'https://id.shp.ee/7DMyYY3q', '[\"material: resin floral charm\",\"color: soft white\",\"peach blossom aesthetic design\",\"length: approx. 48 cm\",\"non-adjustable\"]', 0, '2026-05-05 10:05:30'),
(18, 'Beads Chain Necklace', 36999, 'Necklace', '/beads.png', 'https://id.shp.ee/8vfDHncu', '[\"material: metal chain\",\"color: silver\",\"minimal chain layered look\",\"length: approx. 62 cm\",\"adjustable\"]', 0, '2026-05-05 10:05:30'),
(19, 'Crystal Beads Necklace', 45500, 'Necklace', '/crystal.png', 'https://shopee.co.id/product/124684747/53301901679', '[\"material: crystal beads\",\"color: clear sparkle mix\",\"glittery bead arrangement\",\"length: approx. 45 cm\",\"adjustable\"]', 0, '2026-05-05 10:05:30'),
(20, 'Love Initial Necklace', 38000, 'Necklace', '/initial.png', 'https://shopee.co.id/product/479483460/26553274341', '[\"material: stainless steel\",\"color: gold/silver mix\",\"initial letter pendant design\",\"length: approx. 45–50 cm\",\"adjustable\"]', 0, '2026-05-05 10:05:30'),
(21, 'Star Necklace', 21170, 'Necklace', '/star.png', 'https://shopee.co.id/product/1640624573/53151927881', '[\"material: silver plated alloy\",\"color: white silver\",\"star charm centerpiece\",\"length: approx. 45 cm\",\"adjustable\"]', 0, '2026-05-05 10:05:30'),
(22, 'Twiny Necklace', 35760, 'Necklace', '/twiny.png', 'https://shopee.co.id/product/86364944/29465938777', '[\"material: leather strap\",\"color: blue gradient\",\"double-layer aesthetic style\",\"length: approx. 45 cm\",\"adjustable\"]', 0, '2026-05-05 10:05:30'),
(23, 'Heart Stone Crystal Necklace', 29762, 'Necklace', '/heartstone.png', 'https://shopee.co.id/Heart-Stone-Barbie-Natural-Crystal-Kalung-Titanium-Inspirasi-Gold-Copper-i.114024778.23478437780', '[\"material: crystal & titanium\",\"color: gold, pink & white mix\",\"heart stone centerpiece detail\",\"length: approx. 45 cm\",\"adjustable\"]', 0, '2026-05-05 10:05:30'),
(24, 'Floral Titanium Necklace', 55000, 'Necklace', '/floral.png', 'https://shopee.co.id/(Bebas-beli-2-dapat-bonus)-K70-COD-Kalung-hijab-juntai-bunga-manis-mewat-titanium-wanita-i.206098586.42451103328', '[\"material: titanium alloy\",\"color: gold\",\"long floral pendant design\",\"length: long drop style\",\"adjustable\"]', 0, '2026-05-05 10:05:30'),
(25, 'Isabeau Karme Ring', 9888, 'Ring', '/isabeau.png', 'https://id.shp.ee/6zzmrjDL', '[\"material: alloy\",\"color: gold\",\"size: free size (adjustable)\",\"elegant minimalist design, perfect for daily wear\"]', 1, '2026-05-05 10:05:30'),
(26, 'Titanium Ring', 15996, 'Ring', '/titaniumm.png', 'https://id.shp.ee/uUL5qVqM', '[\"material: titanium, alloy\",\"color: gold\",\"size: free size (adjustable)\",\"durable and lightweight, simple modern look\"]', 0, '2026-05-05 10:05:30'),
(27, 'Heart Ring', 4199, 'Ring', '/heart.png', 'https://id.shp.ee/ZZ4pSzHy', '[\"material: alloy\",\"color: silver\",\"size: free size\",\"sweet love design, cute and romantic vibe\"]', 0, '2026-05-05 10:05:30'),
(28, 'Pearl Ring', 12499, 'Ring', '/pearl.png', 'https://id.shp.ee/3tNTqqPu', '[\"material: alloy, faux pearl\",\"color: silver, white\",\"size: free size\",\"classic pearl accent, elegant and feminine\"]', 0, '2026-05-05 10:05:30'),
(29, 'Glaze Flower Ring', 39800, 'Ring', '/flower.png', 'https://shopee.co.id/LUMI-Cincin-Bunga-Lukisan-Manis-Gaya-Gadis-Efek-Tetes-Glasir-Sederhana-Modis-Serba-Guna-E304-i.1060177424.49601294850', '[\"material: alloy, glaze coating\",\"color: pastel mix\",\"size: adjustable\",\"glossy flower design with drip effect\"]', 0, '2026-05-05 10:05:30'),
(30, 'Blue Zircon Ring', 41600, 'Ring', '/blue.png', 'https://shopee.co.id/LUMI-Cincin-Terbuka-Motif-Kupu-Kupu-Berlian-Zircon-Biru-Efek-Cat-Menetes-Aksesoris-Stylish-M166-i.1060177424.40553304559', '[\"material: alloy, zircon\",\"color: silver, blue\",\"size: adjustable (open ring)\",\"elegant but playful\"]', 0, '2026-05-05 10:05:30'),
(31, 'Flower Ring', 10800, 'Ring', '/purple.png', 'https://shopee.co.id/product/1095599031/24995646830', '[\"material: resin\",\"color: purple\",\"size: free size (elastic)\",\"trendy floral vibe, perfect for summer outfits\"]', 0, '2026-05-05 10:05:30'),
(32, 'Orchid Beads Ring', 18750, 'Ring', '/orchidd.png', 'https://shopee.co.id/Orchid%E2%80%99s-Rings-Beads-rings-Bluefridayy-i.811658106.28081616156', '[\"material: beads, elastic string\",\"color: blue mix\",\"size: free size\",\"handmade aesthetic, unique and artsy look\"]', 0, '2026-05-05 10:05:30'),
(33, 'Moon & Star Ring', 5490, 'Ring', '/moon.png', 'https://shopee.co.id/V2-Cincin-Aesthetic-Bulan-Dan-Bintang-Cincin-Open-Ring-Adjsutable-i.388529080.29944173560', '[\"material: alloy\",\"color: silver\",\"size: adjustable\",\"celestial design, simple and dreamy vibe\"]', 0, '2026-05-05 10:05:30'),
(34, 'Retro Ring', 8700, 'Ring', '/retro.png', 'https://shopee.co.id/COD-Cincin-Kupu-kupu-Cincin-Retro-Kelas-Atas-Cincin-Ceruk-Bunga-Indah-Pembukaan-Korea-Wanita-i.1511007421.40626155984', '[\"material: alloy\",\"color: gold\",\"size: adjustable\",\"butterfly detail, elegant and eye-catching\"]', 0, '2026-05-05 10:05:30'),
(35, 'Cat Ring', 26300, 'Ring', '/cat.png', 'https://shopee.co.id/LUMI-Cincin-Kucing-Imut-Glaze-Tetes-Adjustable-Jari-Telunjuk-Kartun-Manis-E281-i.1060177424.40025887399', '[\"material: alloy, glaze\",\"color: gold, pastel\",\"size: adjustable\",\"adorable cat design, playful and unique\"]', 0, '2026-05-05 10:05:30'),
(36, 'Handmade Beads Ring', 8000, 'Ring', '/beadss.png', 'https://shopee.co.id/Cincin-manik-handmade-karakter-kaca-cincin-adjustable-dengan-kawat-dan-tali-shimmer-i.2055844.48655442624', '[\"material: beads, wire, string\",\"color: mix colors\",\"size: adjustable\",\"handcrafted design, fun and colorful aesthetic\"]', 0, '2026-05-05 10:05:30'),
(37, 'Linka Bracelet', 28800, 'Bracelet', '/linka.jpeg', 'https://id.shp.ee/WWHB1Hkx', '[\"material: beads\",\"color: lavender blue\",\"length: approx. 16–22 cm\",\"adjustable\",\"lightweight and comfortable for daily wear\"]', 0, '2026-05-08 16:13:46');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `rating` tinyint(4) NOT NULL CHECK (`rating` between 1 and 5),
  `comment` text NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `product_id`, `user_id`, `rating`, `comment`, `created_at`) VALUES
(2, 8, 7, 5, 'lucubangeet', '2026-05-05 22:04:12'),
(5, 2, 7, 4, 'bagus tapi agak kebesaran', '2026-05-11 08:24:16'),
(7, 33, 7, 5, 'harganya murce, desainnya menarik', '2026-05-11 08:26:32'),
(8, 23, 9, 5, 'baguss! mirip kalung barbie', '2026-05-11 08:34:50'),
(9, 19, 10, 5, 'kualitasnya bagus dan resolusi fotonya hd 😍', '2026-05-11 11:18:38');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `is_admin` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `is_admin`, `created_at`) VALUES
(1, 'Admin', 'admin@charmevely.id', '$2a$10$IayLYe0jk9gLFm.COpw5S.5JyW2JuNcqDdtxnovshtw4fT24/4V5q', 1, '2026-05-05 21:39:58'),
(7, 'cacaa', 'caca@gmail.com', '$2a$10$rBSZxg6vHzOpzTEljAeWt.vUTjoDldZs9tyZzh2Yo3veqH9QOHuKW', 0, '2026-05-05 22:02:46'),
(8, 'Wisnu', 'wisnuakbar@gmail.com', '$2a$10$95xStL6Q4vO.TmxSoCAOeOKSxZdgEmS.8he4xC7uEjLg4PV/lzzMm', 0, '2026-05-08 18:37:20'),
(9, 'aisy', 'aisy@gmail.com', '$2a$10$j1Kr2K9.nln/F8IV/Nfa.e2i7PmE5lrXqHALXFRX/KEdFuY59gWyO', 0, '2026-05-11 08:32:55'),
(10, 'saffadhiyaa', 'saffadhiya@gmail.com', '$2a$10$Uu0ZiHlyufr5.x0aI/yP8eES96HS0/rORDGh9bOqr7OwFFI4GmWDq', 0, '2026-05-11 11:17:03');

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_products_full`
-- (See below for the actual view)
--
CREATE TABLE `v_products_full` (
`id` int(11)
,`name` varchar(150)
,`price` int(11)
,`category` enum('Bracelet','Necklace','Ring')
,`image_url` varchar(255)
,`shopee_url` varchar(255)
,`details` longtext
,`is_bestseller` tinyint(1)
,`created_at` datetime
,`avg_rating` decimal(7,4)
,`total_reviews` bigint(21)
);

-- --------------------------------------------------------

--
-- Structure for view `v_products_full`
--
DROP TABLE IF EXISTS `v_products_full`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_products_full`  AS SELECT `p`.`id` AS `id`, `p`.`name` AS `name`, `p`.`price` AS `price`, `p`.`category` AS `category`, `p`.`image_url` AS `image_url`, `p`.`shopee_url` AS `shopee_url`, `p`.`details` AS `details`, `p`.`is_bestseller` AS `is_bestseller`, `p`.`created_at` AS `created_at`, ifnull(avg(`r`.`rating`),0) AS `avg_rating`, count(`r`.`id`) AS `total_reviews` FROM (`products` `p` left join `reviews` `r` on(`p`.`id` = `r`.`product_id`)) GROUP BY `p`.`id` ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_fav` (`user_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_review` (`product_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
