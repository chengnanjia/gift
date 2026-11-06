# 部署指南

## 部署前须知

- Node.js 运行环境需为 18 或更高版本。云平台通常会提供 `PORT` 环境变量，服务会优先使用它，否则默认监听 3000。
- `data.json` 和 `backups/` 是本地文件。请确认部署平台提供持久化磁盘，并定期备份；容器或临时实例的本地文件可能在重启、重新部署后丢失。
- 必须在平台环境变量中配置 `AUTH_USERNAME`、至少 12 字符的 `AUTH_PASSWORD` 和至少 32 字节的随机 `AUTH_TOKEN_SECRET`。不要将凭据写入代码或仓库文件。
- `.env.example` 中是无效占位值，不能直接作为真实配置使用；服务检测到占位值会拒绝启动。
- 登录签发 8 小时 Bearer 令牌；所有礼金和备份 API 都受保护。生产环境必须启用 HTTPS。

## 单域名部署

将仓库根目录作为 Node.js 应用部署，构建/启动命令使用：

```bash
npm install
npm start
```

应用会在平台分配的端口启动，并提供页面与 `/api/gifts`。健康探针可使用 `/health`。根目录是唯一推荐维护源。

## GitHub Pages 前端 + 独立后端

1. 将后端部署到支持 Node.js 的服务，确认 `https://<后端域名>/health` 可访问，并配置持久化数据存储。
2. 在后端平台配置 `AUTH_USERNAME`、`AUTH_PASSWORD` 和 `AUTH_TOKEN_SECRET` 环境变量。
3. 在根目录 `config.js` 中，将顶部 `GITHUB_PAGES_API_BASE_URL` 改为后端 HTTPS 根地址（不要附加 `/api/gifts`）。
4. 后端 `server.js` 的 `allowedOrigins` 需要包含 GitHub Pages 的纯 origin。默认配置包含 `https://chengnanjia.github.io`；自定义域名也必须单独加入。
5. 将前端文件部署至 `https://chengnanjia.github.io/<仓库名>/`。应用会将该域名识别为 GitHub Pages 并使用单独的 API 地址。
6. 打开浏览器开发者工具确认控制台打印的 API 地址正确，并验证登录、查询和写入操作。

通过普通 HTTP/HTTPS 域名或 LAN IP 打开页面时，配置默认请求 `window.location.origin`，无需手工拼接路径。直接以 `file:` 打开时则请求本机 `http://localhost:3000`。

## CORS 配置

生产模式按完整 origin 精确匹配，例如 `https://example.com` 或 `http://localhost:5500`。Origin 不包含页面路径。若页面部署在其他域名，请在 `server.js` 的 `allowedOrigins` 中添加 `协议://主机[:端口]`，然后重启后端。被拒绝的 Origin 会在后端日志中明确记录。

开发模式允许跨域便于本地调试；不要将 `NODE_ENV=development` 用于公开生产服务。

## Windows 本地启动

在仓库根目录运行 `start.bat` 或 `start.ps1`。若 PowerShell 执行策略拦截脚本，可对当前调用临时绕过：

```powershell
powershell -ExecutionPolicy Bypass -File .\start.ps1
```

## 常见问题排查

### 端口占用

服务会报告被占用的端口。可释放端口，或用 `PORT=3001 npm start` 启动。PowerShell：`$env:PORT=3001; npm start`；CMD：`set PORT=3001 && npm start`。

### 页面打不开或数据显示为空

先访问 `/health` 确认后端运行，再检查浏览器控制台的 API 地址和 Network 请求。局域网访问要用页面所在主机的 IP，并确认防火墙、WSL 端口转发和服务监听地址允许外部访问。空数组表示 API 已连通但当前数据文件没有记录，不会自动从其他数据库恢复。

### CORS 拒绝

查看服务端日志中的 `[CORS]` Origin，将页面地址的 scheme、host、port（不含路径）加入白名单。浏览器中页面地址、前端 API 地址和后端 CORS 配置需要匹配。

### Windows 脚本乱码或不能执行

脚本采用英文提示避免旧代码页解码问题。执行策略错误按上文临时使用 `-ExecutionPolicy Bypass`；无需改系统级策略。

### CDN 或 Excel 导出失败

Excel 使用本地 `vendor/xlsx.full.min.js`，CDN 仅在本地脚本不可用时异步回退。若两处均失败，Excel 导出会明确提示；CSV 与其他页面功能不依赖 XLSX。

### 登录账号或安全

使用平台环境变量中配置的账号密码。服务缺少认证环境变量时会拒绝启动；请确认令牌密钥长度至少 32 字节。不要将密钥放入 GitHub Pages 的前端配置。

### 云部署后数据丢失

确认云平台挂载了持久化目录，并核实 `data.json` 与 `backups/` 位于该目录。临时文件系统在实例重启或重新部署后可能被清空。

## 旧部署副本

`deploy-package/` 为旧 Heroku API-only 部署副本，保留其 `Procfile` 和 `app.json` 以兼容已存在的部署。其默认端口和 CORS 配置已与根目录一致；不托管完整前端。新部署请使用仓库根目录，待旧部署确认迁移后可删除该副本。
