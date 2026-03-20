@echo off
echo ========================================
echo 娓呯悊骞堕噸鍚涔︽満鍣ㄤ汉锛堟柊搴旂敤锛?echo ========================================
echo.

echo [姝ラ1/3] 鍋滄鎵€鏈塶ode杩涚▼]
taskkill /f /im node.exe 2>nul
echo 宸插仠姝㈡墍鏈塶ode杩涚▼

echo.
echo [绛夊緟3绉抅
timeout /t 3 >nul

echo.
echo ========================================
echo [姝ラ2/3] 鏄剧ず鏂伴厤缃甝
echo ========================================
echo.
echo [搴旂敤淇℃伅]
echo   App ID: cli_a90a36a726b95cc0
echo   App Secret: ^<from FEISHU_APP_SECRET env^>
echo   Verify Token: OpenClaw2026
echo   Encrypt Key: 宸插垹闄わ紙鍏抽棴鍔犲瘑锛?echo   Port: 3002
echo.
echo [Webhook]
echo   椋炰功缇ゆ満鍣ㄤ汉: https://open.feishu.cn/open-apis/bot/v2/hook/35908601-2567-405b-b099-7cba056c01f3
echo.
echo [璇存槑]
echo   - 杩欐槸涓€涓柊鐨勯涔﹀簲鐢?echo   - Encrypt Key 宸插垹闄わ紝涓嶄娇鐢ㄥ姞瀵?echo   - 椋炰功浼氬彂閫侀潪鍔犲瘑浜嬩欢
echo   - 鏈哄櫒浜鸿兘姝ｅ父澶勭悊骞跺洖澶?echo.
echo ========================================
echo [姝ラ3/3] 鍚姩椋炰功鏈哄櫒浜烘湇鍔
echo ========================================
echo.

cd /d C:\Users\57684\saasfly
start "" cmd /c "node feishu-open-bot.mjs"

echo.
echo ========================================
echo [瀹屾垚]
echo.
echo 椋炰功鏈哄櫒浜烘湇鍔″凡鍚姩锛?echo.
echo [绛夊緟5绉掕鏈嶅姟瀹屽叏鍚姩]
timeout /t 5 >nul

echo.
echo ========================================
echo [鏈嶅姟鐘舵€佹鏌
echo.

curl -s http://localhost:3002/health 2>nul || echo 鏈嶅姟妫€鏌ヤ腑...

echo.
echo ========================================
echo [涓嬩竴姝
echo.
echo 1. 鍦ㄩ涔﹀钩鍙伴噸鏂伴厤缃簨浠惰闃?echo    - 璇锋眰鍦板潃: https://halolike-kensley-subventricous.ngrok-free.dev/webhook/feishu
echo    - Verify Token: OpenClaw2026
echo    - Encrypt Key: 涓嶅～鍐欙紙淇濇寔涓虹┖锛?echo    - 璁㈤槄浜嬩欢: im.message.receive_v1
echo.
echo 2. 鍦ㄩ涔︾兢娣诲姞鏂版満鍣ㄤ汉
echo    - 鎼滅储鏈哄櫒浜哄悕绉帮紙渚嬪: "claw lonchat"锛?echo    - 娣诲姞鍒扮兢鑱?echo.
echo 3. 娴嬭瘯
echo    - 鍦ㄧ兢閲?@鏈哄櫒浜? @claw lonchat 浣犲ソ
echo.
echo ========================================
pause
