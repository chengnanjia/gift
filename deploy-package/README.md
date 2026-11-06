# 旧版 API 部署副本

此目录仅为既有 Heroku 部署保留 API 服务副本及 `Procfile`/`app.json` 元数据，不是主应用的维护目录，也不提供完整前端。默认端口为 3000（平台设置的 `PORT` 优先），CORS 白名单与仓库根目录保持一致。

服务启动前必须在部署平台配置 `AUTH_USERNAME`、至少 12 字符的 `AUTH_PASSWORD` 和至少 32 字节的随机 `AUTH_TOKEN_SECRET`。不要将实际凭据提交到仓库。

新部署请使用仓库根目录的 [README](../README.md) 和 [部署指南](../DEPLOY.md)。确认旧部署已迁移后，建议删除本目录，避免长期维护两份代码。
