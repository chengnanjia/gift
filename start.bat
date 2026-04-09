@echo off

echo 宴席礼金记录簿启动脚本
echo ======================
echo.

rem 检查是否安装了Node.js
echo 检查Node.js安装...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到Node.js，请先安装Node.js
    echo 请前往 https://nodejs.org/ 下载并安装
    pause
    exit /b 1
)
echo Node.js安装正常

rem 检查是否安装了依赖
echo 检查项目依赖...
if not exist "node_modules" (
    echo 未找到依赖，正在安装...
    npm install
    if %errorlevel% neq 0 (
        echo 依赖安装失败，请检查网络连接
        pause
        exit /b 1
    )
    echo 依赖安装成功
)

rem 启动后端服务
echo 启动后端服务...
echo 服务将运行在 http://localhost:3000
echo 按 Ctrl+C 停止服务
echo.
npm start
