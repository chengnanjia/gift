const { Sequelize } = require('sequelize');

// 创建数据库连接 (使用SQLite)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './wedding_gifts.db',
  logging: false
});

// 测试连接
sequelize.authenticate()
  .then(() => {
    console.log('数据库连接成功');
  })
  .catch((error) => {
    console.error('数据库连接失败:', error);
    console.error('请检查数据库配置是否正确');
  });

module.exports = sequelize;