@echo off
echo ========================================
echo 彻底重启飞书机器人
echo ========================================
echo.

echo [步骤1: 停止所有node进程]
echo.

taskkill /f /im node.exe 2>nul
echo 已停止所有node进程

echo.
echo [等待3秒]
timeout /t 3 >nul

echo.
echo ========================================
echo [步骤2: 确认所有node进程已停止]
echo.

tasklist | findstr /i "node.exe"
echo.

echo 如果上面还显示node.exe进程，请手动结束
echo.
echo ========================================
echo [步骤3: 启动飞书机器人]
echo.

cd /d C:\Users\57684\saasfly

echo.
echo [配置]
echo   Encrypt Key: 4glH23XTK2itoADWOCWmwpwLzFiWEJn0
echo   Verify Token: OpenClaw2026
echo   App ID: cli_a9f5af0e51f89cc4
echo   Port: 3002
echo.

echo.
echo [启动服务]
start "" cmd /c "node feishu-open-bot.mjs"

echo.
echo ========================================
echo [完成]
echo.
echo 服务已重启！
echo.
echo [等待5秒让服务启动]
timeout /t 5 >nul

echo.
echo ========================================
echo [下一步]
echo.
echo 1. 等待服务窗口显示：飞书开放平台机器人启动成功！
echo.
echo 2. 在飞书群里 @机器人测试
echo.
echo 3. 查看服务窗口日志
echo.
echo ========================================
pause
