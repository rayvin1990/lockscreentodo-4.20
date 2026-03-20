const fs = require('fs');
const FormData = require('form-data');

// Test the API with a simple file upload
async function testAPI() {
  try {
    // Create a simple test image buffer (1x1 PNG pixel)
    const testImageData = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00,
      0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
      0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49,
      0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);

    // Create form data
    const form = new FormData();
    form.append('file', testImageData, {
      filename: 'test.png',
      contentType: 'image/png'
    });
    form.append('prompt', '请描述一下这个图片并生成适合的提示词');

    console.log('Testing API with FormData...');

    const response = await fetch('http://localhost:3002/api/ai-prompt', {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('Response body:', responseText);

    if (response.ok) {
      console.log('✅ API test successful!');
    } else {
      console.log('❌ API test failed');
    }

  } catch (error) {
    console.error('Test error:', error);
  }
}

testAPI();