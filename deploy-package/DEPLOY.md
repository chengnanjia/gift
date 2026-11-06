# 部署说明

此目录是旧版 API-only 部署副本。新部署请使用仓库根目录的 [部署指南](../DEPLOY.md)；旧 Heroku 部署继续使用本目录中的 `Procfile` 和 `app.json`，服务端口由平台的 `PORT` 环境变量决定，未设置时为 3000。

启动前还需在平台配置 `AUTH_USERNAME`、至少 12 字符的 `AUTH_PASSWORD` 和至少 32 字节的随机 `AUTH_TOKEN_SECRET`。所有 `/api/gifts` 路由都要求后端签发的 Bearer 令牌。
