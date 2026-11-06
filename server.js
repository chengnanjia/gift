const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const os = require('os');
const giftRoutes = require('./routes/giftRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const frontendFiles = new Set([
  '/index.html',
  '/login.html',
  '/config.js',
  '/vendor/xlsx.full.min.js'
]);

// CORS配置
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = new Set([
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:5500',
      'http://127.0.0.1:5500',
      'https://chengnanjia.github.io'
    ]);
    
    // 开发环境允许所有来源
    if (NODE_ENV === 'development' || !origin) {
      callback(null, true);
    } else if (allowedOrigins.has(origin)) {
      callback(null, true);
    } else {
      console.error(`[CORS] 拒绝跨域请求 Origin=${origin}。请检查 server.js 中的 allowedOrigins。`);
      callback(new Error(`CORS 拒绝来源: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// 中间件
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
// 路由
app.use('/api/gifts', giftRoutes);

// 仅提供前端入口和运行配置，避免将数据、备份及服务端源码作为静态文件公开。
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.use((req, res, next) => {
  if (!frontendFiles.has(req.path)) {
    return next();
  }
  return express.static(__dirname, { index: false })(req, res, next);
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({
    code: 500,
    data: null,
    message: '服务器内部错误'
  });
});

// 启动服务器
const server = app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log(`数据文件: ${path.join(__dirname, 'data.json')}`);
  console.log(`环境: ${NODE_ENV}`);
  for (const addresses of Object.values(os.networkInterfaces())) {
    for (const address of addresses || []) {
      if (!address.internal) {
        const host = address.family === 'IPv6' ? `[${address.address}]` : address.address;
        console.log(`局域网访问: http://${host}:${PORT}`);
      }
    }
  }
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`端口 ${PORT} 已被占用，请关闭占用进程或更换端口。`);
    console.error('Linux/macOS: PORT=3001 npm start');
    console.error('Windows PowerShell: $env:PORT=3001; npm start');
    console.error('Windows CMD: set PORT=3001 && npm start');
    process.exitCode = 1;
    return;
  }
  throw error;
});

process.on('uncaughtException', (error) => {
  console.error('发生未捕获异常，服务即将退出:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('发生未处理的 Promise 拒绝:', reason);
});