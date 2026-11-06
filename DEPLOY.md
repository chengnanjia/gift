# 部署指南

## 方案一：GitHub Pages + Heroku（推荐）

### 第一步：部署后端到 Heroku

1. **注册Heroku账号**
   - 访问 https://signup.heroku.com/ 注册账号

2. **安装Heroku CLI**
   - 下载地址：https://devcenter.heroku.com/articles/heroku-cli

3. **登录Heroku**
   ```bash
   heroku login
   ```

4. **创建Heroku应用**
   ```bash
   heroku create your-wedding-gift-app
   ```

5. **推送代码到Heroku**
   ```bash
   git push heroku main
   ```

6. **获取后端URL**
   - 后端将运行在: `https://your-wedding-gift-app.herokuapp.com`
   - 记住这个URL，后面需要配置到前端

### 第二步：修改前端配置

1. **编辑 `config.js` 文件**
   - 将顶部的 `GITHUB_PAGES_API_BASE_URL` 改为你的后端 HTTPS 根地址（不要附加 `/api/gifts`）。
   - 普通 HTTP/HTTPS 部署会自动使用当前页面的 `origin`；只有 `*.github.io` 页面使用该独立后端地址。

2. **提交修改**
   ```bash
   git add config.js
   git commit -m "更新生产环境API地址"
   git push origin main
   ```

### 第三步：部署前端到 GitHub Pages

1. **创建GitHub仓库**
   - 访问 https://github.com/new
   - 创建名为 `wedding-gift-book` 的公开仓库

2. **推送代码到GitHub**
   ```bash
   git remote add origin https://github.com/yourusername/wedding-gift-book.git
   git branch -M main
   git push -u origin main
   ```

3. **启用GitHub Pages**
   - 进入仓库 Settings → Pages
   - Source 选择 "Deploy from a branch"
   - Branch 选择 "main" 和 "/ (root)"
   - 点击 Save

4. **等待部署完成**
   - 访问 `https://yourusername.github.io/wedding-gift-book`

## 方案二：Railway部署（更简单）

### 部署后端到 Railway

1. **注册Railway账号**
   - 访问 https://railway.app/ 使用GitHub账号登录

2. **创建新项目**
   - 点击 "New Project"
   - 选择 "Deploy from GitHub repo"
   - 选择你的仓库

3. **自动部署**
   - Railway会自动检测Node.js项目并部署
   - 获取部署后的URL（如：`https://wedding-gift-app.up.railway.app`）

4. **更新前端配置**
   - 修改 `config.js` 中的 `GITHUB_PAGES_API_BASE_URL`
   - 重新部署前端到GitHub Pages

## 方案三：Vercel部署

### 部署后端到 Vercel

1. **注册Vercel账号**
   - 访问 https://vercel.com/ 使用GitHub账号登录

2. **导入项目**
   - 点击 "Add New Project"
   - 导入GitHub仓库

3. **配置环境变量**
   - 在项目设置中添加环境变量（如果需要）

4. **部署**
   - Vercel会自动部署并生成URL

## 配置CORS（重要）

部署完成后，需要更新后端的CORS配置：

编辑 `server.js` 文件，添加你的GitHub Pages域名：

```javascript
const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    // 添加你的GitHub Pages域名
    'https://yourusername.github.io',
    // 或者你的自定义域名
    'https://your-domain.com'
];
```

然后重新部署后端。

## 验证部署

1. **测试后端API**
   ```bash
   curl https://your-backend-url.com/health
   ```
   应该返回：`{"status":"ok"}`

2. **测试前端页面**
   - 打开 `https://yourusername.github.io/wedding-gift-book`
   - 打开浏览器开发者工具（F12）
   - 查看Console，确认API地址正确
   - 测试添加、编辑、删除功能

## 故障排除

### CORS错误
- 检查后端CORS配置是否包含前端域名
- 确认协议一致（http/https）

### API连接失败
- 检查API地址是否正确
- 确认后端服务正在运行
- 查看浏览器Console的错误信息

### 数据不保存
- 检查后端文件写入权限
- 查看后端日志：`heroku logs --tail`

## 安全建议

1. **添加用户认证**（生产环境必需）
2. **使用HTTPS**（Heroku/Railway/Vercel默认提供）
3. **定期备份数据**
4. **限制API访问频率**
5. **使用环境变量存储敏感信息**

## 成本考虑

- **Heroku**: 免费套餐（每月550小时，会休眠）
- **Railway**: 免费套餐（每月5美元额度）
- **Vercel**: 免费套餐（无限部署，有使用限制）
- **GitHub Pages**: 完全免费

推荐使用 **Railway + GitHub Pages** 组合，免费额度足够个人使用。