# 宴席礼金记录簿

基于 Node.js、Express 和 `data.json` 的礼金记录管理页面，支持记录增删改查、搜索筛选、排序分页、备份恢复、CSV/Excel 导出、主题切换和移动端布局。

## 运行环境

- Node.js 18 或更高版本（已在 Node.js 20/22 环境验证）
- npm

## 本地启动

```bash
npm install
npm start
```

默认访问 `http://localhost:3000/login.html`。也可以直接打开 `http://localhost:3000/` 进入主页面。服务会打印监听地址和项目目录下的数据文件路径。

可以从其他工作目录启动，页面和数据仍相对于项目目录定位：

```bash
node /path/to/gift/server.js
```

默认端口被占用时，可更换端口：

```bash
PORT=3001 npm start
```

PowerShell：`$env:PORT=3001; npm start`；Windows CMD：`set PORT=3001 && npm start`。

后端仅向浏览器提供 `index.html`、`login.html`、`config.js` 和 Excel 导出资源。`data.json`、`backups/`、服务端源码及其他文件不通过静态服务公开。数据保存在项目目录，定期备份 `data.json` 和 `backups/`。

## 前端 API 地址

- HTTP/HTTPS 页面默认请求当前页面的同源 API，适用于 localhost、局域网 IP、WSL IP 和端口转发地址。
- GitHub Pages 页面使用 `config.js` 顶部的 `GITHUB_PAGES_API_BASE_URL`。部署前请将其设为可访问的后端 HTTPS 根地址。
- 直接以 `file:` 打开页面时，API 回退到 `http://localhost:3000`；浏览器仍需允许该本地后端的跨域请求。
- 请求失败时页面显示所请求的 API 地址和检查建议；若有缓存，会保留缓存显示并提示用户。

## Windows 启动脚本

可运行 `start.bat` 或 `start.ps1`。脚本使用纯英文提示，避免旧版 Windows PowerShell/cmd 对中文编码的误读；PowerShell 脚本会检查 npm 命令和 `$LASTEXITCODE`。

若 PowerShell 执行策略阻止脚本，可仅对本次进程放宽限制：

```powershell
powershell -ExecutionPolicy Bypass -File .\start.ps1
```

无需修改系统级执行策略。

## Excel 导出

使用本地 SheetJS `xlsx` 0.18.5，许可证为 Apache-2.0，来源为 npm 发布包；许可文本随附于 `vendor/XLSX-LICENSE.txt`。本地脚本加载失败时会异步尝试 jsDelivr CDN。若本地和 CDN 均不可用，页面仍可使用，Excel 导出会明确提示；CSV 导出不依赖该库。

## API

| 方法 | 路径 | 用途 |
|---|---|---|
| GET | `/health` | 健康检查 |
| GET | `/api/gifts` | 获取记录 |
| POST | `/api/gifts` | 新增记录 |
| PUT | `/api/gifts/:id` | 更新记录 |
| DELETE | `/api/gifts/:id` | 删除记录 |
| GET | `/api/gifts/stats` | 统计数据 |
| GET/POST | `/api/gifts/backups` | 查询/创建备份 |
| POST | `/api/gifts/backups/restore` | 恢复备份 |

生产环境的跨域白名单位于 `server.js` 的 `allowedOrigins`。条目必须是纯 origin（协议、主机和可选端口，不带路径）；自定义前端域名需将其 origin 加入白名单。

## 登录与安全边界

登录页目前仅在浏览器端校验固定的 `admin` / `admin123`，登录状态写入 `localStorage`；后端 API 没有身份验证。它不构成访问控制，不能用于公开互联网或存放敏感资料的部署。阶段 5 的安全方案需先由维护者选择后再实施。

## 常见问题排查

### 端口被占用

启动日志会提示冲突端口。关闭占用进程，或通过 `PORT=3001 npm start`（PowerShell：`$env:PORT=3001; npm start`；CMD：`set PORT=3001 && npm start`）更换端口。

### 页面打不开或没有数据

确认服务进程仍运行，并检查 `http://localhost:3000/health`。页面打开后查看浏览器控制台打印的 API 地址；局域网/WSL 访问应指向页面同源地址，而不是旧的线上服务。跨设备访问还需检查防火墙和端口转发。

### Windows 脚本乱码或被阻止

启动脚本提示使用英文。若 PowerShell 报执行策略错误，请按上文使用 `-ExecutionPolicy Bypass` 临时运行；不要为此修改全局执行策略。

### CDN 加载失败或 Excel 导出不可用

应用使用本地 `vendor/xlsx.full.min.js`，CDN 仅作备用。确认从服务访问 `/vendor/xlsx.full.min.js` 返回 200；若该文件和 CDN 都不可用，Excel 导出会提示，CSV 导出仍可使用。

### 登录账号

默认演示账号为 `admin` / `admin123`。这是前端硬编码的演示校验，不是后端认证，也不能保护 API。

### 部署后数据消失

`data.json` 和 `backups/` 是运行目录的本地文件。许多云平台的实例磁盘并不持久；部署前应确认使用持久化磁盘，或定期导出并妥善保存备份。

## 部署副本说明

`deploy-package/` 是为旧的 Heroku 部署方式保留的 API-only 部署副本及元数据（`Procfile`、`app.json`），不是主应用源码目录。新部署请以仓库根目录为唯一维护源；副本的端口和 CORS 已与根目录对齐，但该副本不托管完整前端。建议后续确认旧部署已迁移后再删除整个副本。
