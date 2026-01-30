@echo off

title 腾讯云函数部署包生成工具

echo.
echo ===============================================
echo  腾讯云函数部署包生成工具
echo  用于随礼那点事儿钉钉反馈功能
echo ===============================================
echo.

:: 检查并创建必要的文件
if not exist index.js (
    echo 错误: index.js 不存在!
    exit /b 1
)

if not exist package.json (
    echo 错误: package.json 不存在!
    exit /b 1
)

:: 创建临时目录
if exist deploy_temp rmdir /s /q deploy_temp
mkdir deploy_temp

:: 复制必要的文件到临时目录
copy index.js deploy_temp\ > nul
copy package.json deploy_temp\ > nul

echo [步骤1/3] 文件复制完成

:: 检查并安装依赖
echo [步骤2/3] 检查依赖...
cd deploy_temp

:: 安装依赖
call npm install --production > nul 2>&1

if %ERRORLEVEL% EQU 0 (
    echo 依赖安装完成
) else (
    echo 警告: 依赖安装可能有问题，继续打包
)

:: 打包为zip文件
echo [步骤3/3] 创建部署包...
cd ..

:: 使用PowerShell创建zip
powershell -Command "Compress-Archive -Path deploy_temp\* -DestinationPath tencent-dingtalk-api-deployment.zip -Force"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ===============================================
    echo ✅ 部署包创建成功!
    echo.
    echo 文件位置: tencent-dingtalk-api-deployment.zip
    echo 文件大小: 
    dir tencent-dingtalk-api-deployment.zip | find "zip"
    echo.
    echo 请按照以下步骤上传到腾讯云:
    echo 1. 访问 https://console.cloud.tencent.com/scf 
    echo 2. 创建新函数: dingtalk-feedback
    echo 3. 运行环境: Node.js 16.13.0
    echo 4. 提交方式: 上传zip
    echo 5. 设置环境变量 DINGTALK_TOKEN 和 DINGTALK_SECRET
    echo ===============================================
) else (
    echo ❌ 创建部署包失败!
)

:: 清理临时文件
rmdir /s /q deploy_temp
echo.
echo 按任意键退出...
pause > nul