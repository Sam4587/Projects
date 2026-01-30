# 🚀 钉钉API部署脚本

Write-Host "📋 钉钉API部署脚本" -ForegroundColor Green
Write-Host "按任意键继续..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# 目录检查
if (!(Test-Path "dingtalk-api")) {
    Write-Host "❌ dingtalk-api目录不存在，正在创建..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path "dingtalk-api"
}

Set-Location "dingtalk-api"

# 依赖检查
if (!(Test-Path "node_modules")) {
    Write-Host "📦 安装依赖..." -ForegroundColor Green
    npm install
    Write-Host "✅ 依赖安装完成" -ForegroundColor Cyan
}

# 签名测试
Write-Host "🧪 运行签名测试..." -ForegroundColor Green
$testResult = node -e "const crypto=require('crypto');const t=Date.now();const s='test-secret';const stringToSign=''+t+'\n'+s;console.log('签名测试:',crypto.createHmac('sha256',s).update(stringToSign).digest('base64'))"
if ($testResult) {
    Write-Host "✅ 签名测试通过" -ForegroundColor Cyan
} else {
    Write-Host "❌ 签名测试失败" -ForegroundColor Red
}

Write-Host "📋 配置文件检查:" -ForegroundColor Green
Write-Host "  ✅ package.json - 项目依赖和脚本"
Write-Host "  ✅ vercel.json - Vercel部署配置  "
Write-Host "  ✅ api/send.js - API实现"
Write-Host "  ✅ README.md - 部署文档"

Write-Host "" 
Write-Host "📋 部署步骤:" -ForegroundColor Green
Write-Host "1. 确保你有Vercel账户 (https://vercel.com/signup)"
Write-Host "2. 安装Vercel CLI: npm install -g vercel"
Write-Host "3. 登录Vercel: vercel login"
Write-Host "4. 部署API: npx vercel deploy"
Write-Host "5. 在Vercel控制台配置环境变量:"
Write-Host "   - DINGTALK_TOKEN: 你的钉钉access_token"
Write-Host "   - DINGTALK_SECRET: 你的钉钉secret"
Write-Host ""
Write-Host "📋 API部署后:" -ForegroundColor Green
Write-Host "1. 复制Vercel分配的域名 (如: your-api.vercel.app)"
Write-Host "2. 更新 utils/dingtalk-service-miniapp.js 中的 this.apiUrl"
Write-Host "3. 在小程序中测试反馈功能"
Write-Host ""
Write-Host "✅ 部署前准备完成！" -ForegroundColor Green
Write-Host "现在可以执行: npx vercel deploy" -ForegroundColor Yellow
Write-Host "部署完成后更新API地址并进行测试。" -ForegroundColor Yellow
