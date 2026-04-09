const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const giftRoutes = require('./routes/giftRoutes');

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// CORS配置
const corsOptions = {
  origin: function (origin, callback) {
    // 允许的开发环境
    const allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:5500',
      'http://127.0.0.1:5500',
      // GitHub Pages域名（替换为你的实际域名）
      'https://github.com/chengnanjia/gift_system',
      // 其他生产环境域名
      'https://github.github.io/chengnanjia/gift_system'
    ];
    
    // 开发环境允许所有来源
    if (NODE_ENV === 'development' || !origin) {
      callback(null, true);
    } else if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS阻止的请求来源:', origin);
      callback(new Error('不允许的来源'));
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

// 静态文件服务（生产环境）
if (NODE_ENV === 'production') {
  app.use(express.static('public'));
}

// 路由
app.use('/api/gifts', giftRoutes);

// 根路由
app.get('/', (req, res) => {
  res.json({
    message: '宴席礼金记录簿后端服务',
    version: '1.0.0',
    environment: NODE_ENV,
    timestamp: new Date().toISOString()
  });
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
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log(`环境: ${NODE_ENV}`);
});