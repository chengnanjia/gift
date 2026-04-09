Write-Host "宴席礼金记录簿启动脚本" -ForegroundColor Green
Write-Host "======================" -ForegroundColor Green
Write-Host ""

# 检查是否安装了Node.js
Write-Host "检查Node.js安装..." -ForegroundColor Cyan
try {
    $nodeVersion = node --version
    Write-Host "Node.js安装正常: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "错误: 未找到Node.js，请先安装Node.js" -ForegroundColor Red
    Write-Host "请前往 https://nodejs.org/ 下载并安装" -ForegroundColor Yellow
    pause
    exit 1
}

# 检查是否安装了依赖
Write-Host "检查项目依赖..." -ForegroundColor Cyan
if (-not (Test-Path "node_modules")) {
    Write-Host "未找到依赖，正在安装..." -ForegroundColor Yellow
    try {
        npm install
        Write-Host "依赖安装成功" -ForegroundColor Green
    } catch {
        Write-Host "依赖安装失败，请检查网络连接" -ForegroundColor Red
        pause
        exit 1
    }
} else {
    Write-Host "依赖已安装" -ForegroundColor Green
}

# 启动后端服务
Write-Host "启动后端服务..." -ForegroundColor Cyan
Write-Host "服务将运行在 http://localhost:3000" -ForegroundColor Yellow
Write-Host "按 Ctrl+C 停止服务" -ForegroundColor Yellow
Write-Host ""
try {
    npm start
} catch {
    Write-Host "服务启动失败: $_" -ForegroundColor Red
    pause
    exit 1
}