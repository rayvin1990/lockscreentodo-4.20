@echo off
echo ========================================
echo 飞书机器人 - 使用新的Encrypt Key重启
echo ========================================
echo.

echo [新配置]
echo   Encrypt Key: 4glH23XTK2itoADWOCWmwpwLzFiWEJn0
echo   Verify Token: OpenClaw2026
echo   App ID: cli_a9f5af0e51f89cc4
echo   Port: 3002
echo.

echo [步骤]
echo 1. 停止所有node进程
echo 2. 等待2秒
echo 3. 启动飞书机器人服务（使用新Encrypt Key）
echo.

echo ========================================
echo [执行]
echo.

taskkill /f /im node.exe 2>nul
echo 已停止所有node进程

timeout /t 2 >nul
echo.

echo ========================================
echo [启动服务]
echo.

start "" cmd /c "node feishu-open-bot.mjs"

echo.
echo ========================================
echo [完成]
echo.
echo 服务已重启！
echo.
echo [新Encrypt Key已应用]
echo   4glH23XTK2itoADWOCWmwpwLzFiWEJn0
echo.
echo [下一步]
echo 1. 等待服务启动（3-5秒）
echo 2. 在飞书群里 @机器人测试
echo 3. 查看服务窗口日志，看是否收到正常事件
echo.
echo ========================================
echo.
pause
