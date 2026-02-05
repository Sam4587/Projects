@echo off
setlocal

:: 钉钉API一键部署脚本
:: 请在PowerShell中以管理员身份运行此脚本

echo ===================================
echo   钉钉机器人API部署助手
echo ===================================
echo.

:: 检查Node.js是否安装
where node >nul 2>nul
if errorlevel 1 (
    echo ❌ Node.js未安装，请先安装Node.js
    echo 下载地址: https://nodejs.org/zh-cn/
    pause
    exit /b 1
) else (
    echo ✅ Node.js已安装
)

:: 检查vercel是否安装
where vercel >nul 2>nul
if errorlevel 1 (
    echo 🔧 正在安装Vercel CLI...
    npm install -g vercel
    if errorlevel 1 (
        echo ❌ Verccel安装失败
        pause
        exit /b 1
    )
) else (
    echo ✅ Vercel CLI已安装
)

echo.
echo 📁 当前目录: %cd%
echo ℹ️  请确保已在 dingtalk-api 目录下

echo.
set /p confirm="确认要部署钉钉API吗? (y/n): "
if /i "%confirm%" neq "y" (
    echo ❌ 部署已取消
    pause
    exit /b 0
)

echo.
echo 🚀 开始部署钉钉机器人API...
echo 📝 正在登录Vercel(会打开浏览器)...
vercel login
if errorlevel 1 (
    echo ❌ Verccel登录失败
    pause
    exit /b 1
)

echo.
echo 📦 正在部署项目到Vercel...
vercel --prod
if errorlevel 1 (
    echo ❌ 部署失败，请检查网络连接
    pause
    exit /b 1
)

echo.
echo 🎉 部署完成！
echo.
echo ⚠️  部署完成后，请到Vercel控制台设置环境变量:
echo    1. 访问 https://vercel.com/dashboard
echo    2. 找到刚刚部署的dingtalk-api项目
echo    3. Settings > Environment Variables
echo    4. 添加:
echo       DINGTALK_TOKEN=88eba63bc98bce33a59169fcd33e64093062f0beea5a65d3830e83dfedeaac7a
echo       DINGTALK_SECRET=SEC243a3635982cb428719783a0ac2e8359acea9ced01231fede326bd5b281820fc
echo.
echo 📞 完成后，钉钉机器人就能收到用户反馈啦！
echo.

pause