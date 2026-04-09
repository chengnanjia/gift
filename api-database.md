# 宴席礼金记录簿 - 接口与数据库设计

## 1. 数据存储方式

当前实现使用浏览器的 `localStorage` 进行本地数据存储，键名为 `weddingGifts`，存储格式为 JSON 数组。

### 数据结构

```json
[
  {
    "id": "1620000000000",
    "name": "张三",
    "amount": "500",
    "blessing": "百年好合，早生贵子",
    "recordTime": "2026-03-30 12:00"
  }
]
```

## 2. 后端接口设计（如果需要）

如果需要将应用扩展为前后端分离架构，可以设计以下接口：

### 2.1 获取礼金记录列表
- **URL**: `/api/gifts`
- **方法**: GET
- **响应**: 
  ```json
  {
    "code": 200,
    "data": [
      {
        "id": "1",
        "name": "张三",
        "amount": 500,
        "blessing": "百年好合，早生贵子",
        "recordTime": "2026-03-30 12:00"
      }
    ],
    "message": "success"
  }
  ```

### 2.2 添加礼金记录
- **URL**: `/api/gifts`
- **方法**: POST
- **请求体**: 
  ```json
  {
    "name": "李四",
    "amount": 800,
    "blessing": "永结同心，白头偕老"
  }
  ```
- **响应**: 
  ```json
  {
    "code": 200,
    "data": {
      "id": "2",
      "name": "李四",
      "amount": 800,
      "blessing": "永结同心，白头偕老",
      "recordTime": "2026-03-30 12:30"
    },
    "message": "success"
  }
  ```

### 2.3 更新礼金记录
- **URL**: `/api/gifts/{id}`
- **方法**: PUT
- **请求体**: 
  ```json
  {
    "name": "李四",
    "amount": 1000,
    "blessing": "永结同心，白头偕老，幸福美满"
  }
  ```
- **响应**: 
  ```json
  {
    "code": 200,
    "data": {
      "id": "2",
      "name": "李四",
      "amount": 1000,
      "blessing": "永结同心，白头偕老，幸福美满",
      "recordTime": "2026-03-30 12:30"
    },
    "message": "success"
  }
  ```

### 2.4 删除礼金记录
- **URL**: `/api/gifts/{id}`
- **方法**: DELETE
- **响应**: 
  ```json
  {
    "code": 200,
    "data": null,
    "message": "success"
  }
  ```

### 2.5 获取统计数据
- **URL**: `/api/gifts/stats`
- **方法**: GET
- **响应**: 
  ```json
  {
    "code": 200,
    "data": {
      "totalGuests": 2,
      "totalAmount": 1500,
      "averageAmount": 750
    },
    "message": "success"
  }
  ```

## 3. 数据库设计（如果需要）

### 3.1 礼金记录表 (`gifts`)

| 字段名 | 数据类型 | 约束 | 描述 |
| :--- | :--- | :--- | :--- |
| `id` | `INT` | `PRIMARY KEY AUTO_INCREMENT` | 记录ID |
| `name` | `VARCHAR(100)` | `NOT NULL` | 宾客姓名 |
| `amount` | `DECIMAL(10,2)` | `NOT NULL` | 礼金金额 |
| `blessing` | `TEXT` | | 祝福语 |
| `record_time` | `DATETIME` | `NOT NULL DEFAULT CURRENT_TIMESTAMP` | 记录时间 |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | 创建时间 |
| `updated_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | 更新时间 |

### 3.2 SQL 创建表语句

```sql
CREATE TABLE `gifts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `blessing` TEXT,
  `record_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## 4. 前端与后端集成方案

如果要将当前的本地存储方案迁移到后端，可以：

1. 修改前端代码，将 localStorage 操作替换为 API 调用
2. 保持数据结构不变，确保前端可以无缝迁移
3. 添加错误处理和加载状态，提升用户体验

### 前端 API 调用示例

```javascript
// 获取礼金记录列表
async function getGifts() {
  try {
    const response = await fetch('/api/gifts');
    const data = await response.json();
    if (data.code === 200) {
      return data.data;
    }
    throw new Error(data.message);
  } catch (error) {
    console.error('获取礼金记录失败:', error);
    return [];
  }
}

// 添加礼金记录
async function addGift(gift) {
  try {
    const response = await fetch('/api/gifts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(gift)
    });
    const data = await response.json();
    if (data.code === 200) {
      return data.data;
    }
    throw new Error(data.message);
  } catch (error) {
    console.error('添加礼金记录失败:', error);
    return null;
  }
}
```

## 5. 扩展功能建议

1. **用户认证**：添加登录功能，确保数据安全
2. **数据备份**：支持导出/导入数据，防止数据丢失
3. **多场景支持**：增加婚礼、生日、乔迁等不同场景的礼金记录
4. **数据可视化**：添加礼金分布图表，更直观地展示数据
5. **批量操作**：支持批量导入和批量删除功能