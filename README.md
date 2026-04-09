# 宴席礼金记录簿

一个功能完善的宴席礼金记录管理系统，支持添加、编辑、删除、搜索、筛选、排序、分页、备份恢复等功能，具有流畅的动画效果。

## 动画效果

- ✅ 加载动画：数据加载时显示旋转动画
- ✅ Toast提示：操作成功/失败时的滑入滑出动画
- ✅ 表单验证：错误提示的淡入效果
- ✅ 表格排序：排序状态的切换动画
- ✅ 响应式布局：不同屏幕尺寸的平滑过渡

## 功能特性

- ✅ 礼金记录管理（添加、编辑、删除）
- ✅ 数据验证（姓名长度、金额范围、防重复）
- ✅ 搜索和筛选（按姓名、金额范围、时间段）
- ✅ 数据排序（按姓名、金额、时间）
- ✅ 分页显示（每页10条记录）
- ✅ 数据备份和恢复（自动备份+手动备份）
- ✅ 数据导出（CSV格式和Excel格式）
- ✅ 响应式设计（支持移动端）
- ✅ 加载动画和Toast提示
- ✅ XSS安全防护
- ✅ 金额格式化（千分位分隔符+货币符号）
- ✅ 用户认证/登录功能
- ✅ 自定义主题/颜色方案
- ✅ 统计分析和数据可视化图表
- ✅ 性能优化（数据缓存、DOM操作优化）

## 技术栈

- **前端**: HTML5, CSS3, JavaScript (原生)
- **第三方库**: SheetJS (Excel导出), Chart.js (数据可视化)
- **后端**: Node.js, Express
- **数据存储**: JSON文件
- **部署**: 支持GitHub Pages + Heroku/Railway

## 本地开发

### 1. 克隆项目

```bash
git clone https://github.com/yourusername/wedding-gift-book.git
cd wedding-gift-book
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动后端服务

```bash
npm start
```

后端服务将运行在 http://localhost:3000

### 4. 访问前端页面

在浏览器中访问 `http://localhost:3000/login.html`，使用以下默认凭据登录：
- **用户名**: admin
- **密码**: admin123

## 部署到生产环境

### 方案一：分离部署（推荐）

#### 前端部署到 GitHub Pages

1. 创建前端分支
```bash
git checkout -b gh-pages
```

2. 修改API地址为生产环境地址（见下文配置）

3. 推送到GitHub
```bash
git push origin gh-pages
```

4. 在GitHub仓库设置中启用GitHub Pages

#### 后端部署到 Heroku

1. 创建Heroku应用
```bash
heroku create your-app-name
```

2. 推送代码
```bash
git push heroku main
```

3. 后端服务将运行在 https://your-app-name.herokuapp.com

### 方案二：Railway部署（推荐）

1. 登录Railway并创建新项目
2. 连接GitHub仓库
3. 选择项目并部署
4. 获取部署后的URL

### 方案三：Vercel部署

1. 登录Vercel并导入GitHub仓库
2. 配置环境变量（如果需要）
3. 自动部署

## 配置生产环境API地址

修改 `index.html` 中的API地址：

```javascript
// 开发环境
const API_URL = 'http://localhost:3000/api/gifts';

// 生产环境（替换为你的后端地址）
const API_URL = 'https://your-backend-url.com/api/gifts';
```

## API接口文档

### 获取礼金记录列表
- **URL**: `GET /api/gifts`
- **响应**: 礼金记录列表

### 添加礼金记录
- **URL**: `POST /api/gifts`
- **请求体**: `{"name": "姓名", "amount": 金额, "blessing": "祝福语"}`

### 更新礼金记录
- **URL**: `PUT /api/gifts/{id}`
- **请求体**: `{"name": "姓名", "amount": 金额, "blessing": "祝福语"}`

### 删除礼金记录
- **URL**: `DELETE /api/gifts/{id}`

### 获取统计数据
- **URL**: `GET /api/gifts/stats`

### 获取备份列表
- **URL**: `GET /api/gifts/backups`

### 创建备份
- **URL**: `POST /api/gifts/backups`

### 恢复备份
- **URL**: `POST /api/gifts/backups/restore`
- **请求体**: `{"filename": "backup_xxx.json"}`

## 项目结构

```
wedding-gift-book/
├── index.html              # 前端主页面
├── login.html              # 登录页面
├── server.js               # 后端服务器
├── package.json            # 项目配置
├── .gitignore             # Git忽略文件
├── README.md              # 项目说明
├── 操作说明.md            # 操作说明文档
├── config/
│   └── database.js        # 数据库配置
├── models/
│   └── Gift.js            # 数据模型
├── routes/
│   └── giftRoutes.js      # API路由
└── backups/               # 备份文件目录
```

## 注意事项

1. **数据安全**: 已添加用户认证机制，默认凭据为 admin/admin123
2. **数据备份**: 定期备份data.json文件
3. **CORS配置**: 生产环境需要配置正确的CORS域名
4. **环境变量**: 敏感信息使用环境变量存储
5. **主题设置**: 支持多种主题，用户可以自由切换

## 许可证

MIT License