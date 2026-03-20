@echo off
echo ========================================
echo 閸氼垰濮╂穱顔碱槻閸氬海娈戞鐐板姛閺堝搫娅掓禍?echo ========================================
echo.

echo [娣囶喖顦查崘鍛啇]
echo 1. URL妤犲矁鐦夋潻鏂挎礀缁绢垱鏋冮張顒婄礄娑撳秵妲窲SON閿?echo 2. 濞ｈ濮炴禍鍡椾淮鎼撮攱顥呴弻銉ь伂閻愮櫢绱欑粩顖氬經3001閿?echo 3. 娴ｈ法鏁ら弬鏉跨安閻劌鍤熺拠?echo.

echo [閺備即鍘ょ純鐢?echo   Encrypt Key: 瀹告彃鍨归梽銈忕礄閸忔娊妫撮崝鐘茬槕閿?echo   Verify Token: OpenClaw2026
echo   App ID: cli_a90a36a726b95cc0
echo   App Secret: ^<from FEISHU_APP_SECRET env^>
echo   Port: 3002
echo.

echo [濮濄儵顎僝
echo 1. 閸嬫粍顒涢幍鈧張濉秓de鏉╂稓鈻?echo 2. 缁涘绶?缁?echo 3. 閸氼垰濮╂穱顔碱槻閸氬海娈戦張宥呭
echo.

echo ========================================
echo [閹笛嗩攽]
echo.

taskkill /f /im node.exe 2>nul
echo 瀹告彃浠犲銏″閺堝《ode鏉╂稓鈻?
timeout /t 3 >nul

echo.
echo ========================================
echo [閸氼垰濮╅張宥呭]
echo.

set "FEISHU_ENCRYPT_KEY="
set "FEISHU_VERIFY_TOKEN=OpenClaw2026"
set "FEISHU_APP_ID=cli_a90a36a726b95cc0"
if "%FEISHU_APP_SECRET%"=="" (
  echo Missing FEISHU_APP_SECRET environment variable
  exit /b 1
)
set "PORT=3002"

echo [闁板秶鐤哴
echo   Encrypt Key: 瀹告彃鍨归梽?echo   Verify Token: OpenClaw2026
echo   App ID: cli_a90a36a726b95cc0
echo   Port: 3002
echo.

echo [閸氼垰濮╂穱顔碱槻閸氬海娈戦張宥呭]
start "" cmd /c "node feishu-open-bot-fixed.mjs"

echo.
echo ========================================
echo [鐎瑰本鍨歖
echo.
echo 娣囶喖顦查崥搴ｆ畱閺堝秴濮熷鎻掓儙閸旑煉绱?echo.
echo [娣囶喖顦查崘鍛啇]
echo   1. URL妤犲矁鐦夐悳鏉挎躬鏉╂柨娲栫痪顖涙瀮閺堫剨绱欐稉宥嗘ЦJSON閿?echo   2. 妞嬬偘鍔熼獮鍐插酱娑撳秳绱伴崘宥嗗Г"娑撳秵妲搁崥鍫熺《閻ㄥ嚙SON閺嶇厧绱?闁挎瑨顕?echo   3. 娴ｈ法鏁ら弬鏉跨安閻劌鍤熺拠?echo.
echo [娑撳绔村顧?echo 1. 閸︺劑顥ｆ稊锕€閽╅崣浼村櫢閺備即鍘ょ純顔荤皑娴犳儼顓归梼?echo    - 鐠囬攱鐪伴崷鏉挎絻: https://halolike-kensley-subventricous.ngrok-free.dev/webhook/feishu
echo    - Verify Token: OpenClaw2026
echo    - Encrypt Key: 娑撳秴锝為崘娆欑礄娣囨繃瀵旀稉铏光敄閿?echo    - 鐠併垽妲勬禍瀣╂: im.message.receive_v1
echo    - 閻愮懓鍤?娣囨繂鐡?閹?妤犲矁鐦?
echo.
echo 2. 閸︺劑顥ｆ稊锔惧參闁?@閺堝搫娅掓禍鐑樼ゴ鐠?echo    @claw lonchat 娴ｇ姴銈?echo.
echo ========================================
echo.
echo [缁涘绶熼張宥呭閸氼垰濮
timeout /t 5 >nul

echo.
echo ========================================
echo [濡偓閺屻儲婀囬崝顡?echo.

curl -s http://localhost:3002/health 2>nul || echo 閺堝秴濮熷Λ鈧弻銉よ厬...

echo.
echo ========================================
echo [閹绘劗銇歖
echo.
echo 婵″倹鐏夋鐐板姛楠炲啿褰存潻妯绘Ц閹躲儵鏁婇敍?echo   鐠囬鍋ｉ崙?閸掗攱鏌?閹稿鎸抽敍鍦?閿?echo   閹存牜鍋ｉ崙?闁插秵鏌婃宀冪槈"閹稿鎸?echo.
echo ========================================
echo.
pause
