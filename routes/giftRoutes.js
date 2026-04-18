const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// 数据存储文件路径
const dataFile = path.join(__dirname, '../data.json');

// 确保数据文件存在
function ensureDataFile() {
  try {
    if (!fs.existsSync(dataFile)) {
      console.log('创建数据文件:', dataFile);
      fs.writeFileSync(dataFile, JSON.stringify([]));
      console.log('数据文件创建成功');
    }
  } catch (error) {
    console.error('确保数据文件存在失败:', error);
    throw error;
  }
}

// 读取数据
function readData() {
  try {
    ensureDataFile();
    const data = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('读取数据失败:', error);
    throw error;
  }
}

// 写入数据
function writeData(data) {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    console.log('数据写入成功');
  } catch (error) {
    console.error('写入数据失败:', error);
    throw error;
  }
}

// 备份目录
const backupDir = path.join(__dirname, '../backups');

// 确保备份目录存在
function ensureBackupDir() {
  try {
    if (!fs.existsSync(backupDir)) {
      console.log('创建备份目录:', backupDir);
      fs.mkdirSync(backupDir, { recursive: true });
      console.log('备份目录创建成功');
    }
  } catch (error) {
    console.error('确保备份目录存在失败:', error);
    // 备份目录创建失败不影响主功能，返回false
    return false;
  }
  return true;
}

// 创建备份
function createBackup() {
  try {
    const backupDirCreated = ensureBackupDir();
    if (!backupDirCreated) {
      console.warn('备份目录创建失败，跳过备份');
      return null;
    }
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const backupFile = path.join(backupDir, `backup_${timestamp}.json`);
    const data = readData();
    fs.writeFileSync(backupFile, JSON.stringify(data, null, 2));
    return backupFile;
  } catch (error) {
    console.error('创建备份失败:', error);
    return null;
  }
}

// 自动备份（每次数据变更时）
function autoBackup() {
  const backupFile = createBackup();
  if (backupFile) {
    console.log('自动备份已创建:', backupFile);
  }
}

// 获取备份列表
function getBackups() {
  ensureBackupDir();
  const files = fs.readdirSync(backupDir);
  return files
    .filter(file => file.startsWith('backup_') && file.endsWith('.json'))
    .map(file => {
      const stats = fs.statSync(path.join(backupDir, file));
      return {
        filename: file,
        created: stats.birthtime,
        size: stats.size
      };
    })
    .sort((a, b) => new Date(b.created) - new Date(a.created));
}

// 恢复备份
function restoreBackup(filename) {
  try {
    const backupFile = path.join(backupDir, filename);
    if (!fs.existsSync(backupFile)) {
      return false;
    }
    const data = fs.readFileSync(backupFile, 'utf8');
    fs.writeFileSync(dataFile, data);
    return true;
  } catch (error) {
    console.error('恢复备份失败:', error);
    return false;
  }
}

// 获取礼金记录列表
router.get('/', (req, res) => {
  try {
    const gifts = readData();
    res.json({
      code: 200,
      data: gifts,
      message: 'success'
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      data: null,
      message: '获取礼金记录失败'
    });
  }
});

// 验证数据
function validateData(name, amount) {
  const errors = [];
  
  // 验证姓名
  if (!name || name.trim() === '') {
    errors.push('宾客姓名不能为空');
  } else if (name.trim().length > 50) {
    errors.push('宾客姓名不能超过50个字符');
  }
  
  // 验证金额
  if (!amount || amount === '') {
    errors.push('礼金金额不能为空');
  } else {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum < 0) {
      errors.push('礼金金额不能为负数');
    } else if (amountNum > 999999.99) {
      errors.push('礼金金额不能超过999,999.99元');
    }
  }
  
  return errors;
}

// 检查是否重复
function isDuplicate(gifts, name, excludeId = null) {
  const trimmedName = name.trim();
  return gifts.some(gift => {
    if (excludeId && gift.id === excludeId) return false;
    return gift.name.trim() === trimmedName;
  });
}

// 添加礼金记录
router.post('/', (req, res) => {
  try {
    const { name, amount, blessing } = req.body;
    const gifts = readData();
    
    // 验证数据
    const errors = validateData(name, amount);
    if (errors.length > 0) {
      return res.status(400).json({
        code: 400,
        data: null,
        message: errors.join('；')
      });
    }
    
    // 检查是否重复
    if (isDuplicate(gifts, name)) {
      return res.status(400).json({
        code: 400,
        data: null,
        message: '该宾客已存在'
      });
    }
    
    const newGift = {
      id: Date.now().toString(),
      name: name.trim(),
      amount,
      blessing,
      recordTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
    
    gifts.push(newGift);
    writeData(gifts);
    
    // 自动备份
    autoBackup();
    
    res.json({
      code: 200,
      data: newGift,
      message: 'success'
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      data: null,
      message: '添加礼金记录失败'
    });
  }
});

// 更新礼金记录
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, amount, blessing } = req.body;
    const gifts = readData();
    
    // 验证数据
    const errors = validateData(name, amount);
    if (errors.length > 0) {
      return res.status(400).json({
        code: 400,
        data: null,
        message: errors.join('；')
      });
    }
    
    const giftIndex = gifts.findIndex(gift => gift.id === id);
    if (giftIndex === -1) {
      return res.status(404).json({
        code: 404,
        data: null,
        message: '礼金记录不存在'
      });
    }
    
    // 检查是否重复（排除当前编辑的记录）
    if (isDuplicate(gifts, name, id)) {
      return res.status(400).json({
        code: 400,
        data: null,
        message: '该宾客姓名已存在'
      });
    }
    
    gifts[giftIndex] = {
      ...gifts[giftIndex],
      name: name.trim(),
      amount,
      blessing
    };
    
    writeData(gifts);
    
    res.json({
      code: 200,
      data: gifts[giftIndex],
      message: 'success'
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      data: null,
      message: '更新礼金记录失败'
    });
  }
});

// 删除礼金记录
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const gifts = readData();
    
    const filteredGifts = gifts.filter(gift => gift.id !== id);
    if (filteredGifts.length === gifts.length) {
      return res.status(404).json({
        code: 404,
        data: null,
        message: '礼金记录不存在'
      });
    }
    
    writeData(filteredGifts);
    
    res.json({
      code: 200,
      data: null,
      message: 'success'
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      data: null,
      message: '删除礼金记录失败'
    });
  }
});

// 获取统计数据
router.get('/stats', (req, res) => {
  try {
    const gifts = readData();
    const totalGuests = gifts.length;
    const totalAmount = gifts.reduce((sum, gift) => sum + parseFloat(gift.amount), 0);
    const averageAmount = totalGuests > 0 ? (totalAmount / totalGuests).toFixed(2) : '0.00';
    
    res.json({
      code: 200,
      data: {
        totalGuests,
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        averageAmount: parseFloat(averageAmount)
      },
      message: 'success'
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      data: null,
      message: '获取统计数据失败'
    });
  }
});

// 获取备份列表
router.get('/backups', (req, res) => {
  try {
    const backups = getBackups();
    res.json({
      code: 200,
      data: backups,
      message: 'success'
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      data: null,
      message: '获取备份列表失败'
    });
  }
});

// 手动创建备份
router.post('/backups', (req, res) => {
  try {
    const backupFile = createBackup();
    if (backupFile) {
      res.json({
        code: 200,
        data: { filename: path.basename(backupFile) },
        message: '备份创建成功'
      });
    } else {
      res.status(500).json({
        code: 500,
        data: null,
        message: '备份创建失败'
      });
    }
  } catch (error) {
    res.status(500).json({
      code: 500,
      data: null,
      message: '备份创建失败'
    });
  }
});

// 恢复备份
router.post('/backups/restore', (req, res) => {
  try {
    const { filename } = req.body;
    if (!filename) {
      return res.status(400).json({
        code: 400,
        data: null,
        message: '请提供备份文件名'
      });
    }
    
    if (restoreBackup(filename)) {
      res.json({
        code: 200,
        data: null,
        message: '数据恢复成功'
      });
    } else {
      res.status(400).json({
        code: 400,
        data: null,
        message: '备份文件不存在或恢复失败'
      });
    }
  } catch (error) {
    res.status(500).json({
      code: 500,
      data: null,
      message: '数据恢复失败'
    });
  }
});

module.exports = router;