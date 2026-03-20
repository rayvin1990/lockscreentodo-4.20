// 测试下载限制API
async function testDownloadLimit() {
  try {
    const response = await fetch('http://localhost:3000/api/download/check-limit');
    const data = await response.json();
    
    console.log('=== Download Limit API Response ===');
    console.log('Status:', response.status);
    console.log('canDownload:', data.canDownload);
    console.log('isPro:', data.isPro);
    console.log('isTrialActive:', data.isTrialActive);
    console.log('isTrialExpired:', data.isTrialExpired);
    console.log('weekDownloadCount:', data.weekDownloadCount);
    console.log('remainingThisWeek:', data.remainingThisWeek);
    console.log('message:', data.message);
    console.log('==============================');
  } catch (error) {
    console.error('Error:', error);
  }
}

testDownloadLimit();
