// 测试存储监控功能的脚本
// 在微信开发者工具控制台中执行

function testStorageMonitor() {
  const app = getApp();
  
  console.log('=== 初始存储状态 ===');
  console.log(app.getStorageStatus());
  
  // 模拟存储大量数据
  console.log('=== 模拟存储大量数据 ===');
  for (let i = 0; i < 100; i++) {
    try {
      wx.setStorageSync(`test_data_${i}`, {
        timestamp: Date.now(),
        data: new Array(1000).fill('测试数据').join(''),
        index: i
      });
    } catch (e) {
      console.log(`存储失败，已存储 ${i} 个数据项`);
      break;
    }
  }
  
  console.log('=== 存储后的状态 ===');
  console.log(app.getStorageStatus());
  
  // 手动触发存储检查
  console.log('=== 手动触发存储检查 ===');
  app.checkStorageHealth();
  
  // 等待清理完成
  setTimeout(() => {
    console.log('=== 清理后的状态 ===');
    console.log(app.getStorageStatus());
    
    // 清理测试数据
    console.log('=== 清理测试数据 ===');
    for (let i = 0; i < 100; i++) {
      try {
        wx.removeStorageSync(`test_data_${i}`);
      } catch (e) {
        // 忽略错误
      }
    }
    
    console.log('=== 最终状态 ===');
    console.log(app.getStorageStatus());
  }, 2000);
}

// 执行测试
testStorageMonitor();