// 配置文件
const config = {
  // 开发环境
  development: {
    API_URL: 'http://localhost:3000/api/gifts',
    API_BASE_URL: 'http://localhost:3000'
  },
  
  // 生产环境（部署后需要修改这里）
  production: {
    // 替换为你的后端服务地址
    API_URL: 'https://web-production-aebaa.up.railway.app/api/gifts',
    API_BASE_URL: 'https://web-production-aebaa.up.railway.app'
  }
};

// 自动检测环境
const ENV = window.location.hostname === 'localhost' || 
            window.location.hostname === '127.0.0.1' ||
            window.location.protocol === 'file:'
            ? 'development' 
            : 'production';

// 导出配置
window.appConfig = config[ENV];
window.ENV = ENV;