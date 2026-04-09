-- 创建数据库
CREATE DATABASE IF NOT EXISTS `wedding_gifts` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE `wedding_gifts`;

-- 创建礼金记录表
CREATE TABLE IF NOT EXISTS `gifts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `blessing` TEXT,
  `recordTime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 插入示例数据
INSERT INTO `gifts` (`name`, `amount`, `blessing`) VALUES
('张三', 500.00, '百年好合，早生贵子'),
('李四', 800.00, '永结同心，白头偕老'),
('王五', 1000.00, '幸福美满，万事如意');
