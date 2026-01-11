const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 读取 .env 文件
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');

// 解析环境变量
const envVars = {};
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  }
});

// 设置环境变量
process.env.ELECTRON_MIRROR = 'https://npmmirror.com/mirrors/electron/';
process.env.HTTP_PROXY = 'http://127.0.0.1:10809';
process.env.HTTPS_PROXY = 'http://127.0.0.1:10809';

// 从 .env 文件设置 GITHUB_TOKEN
if (envVars.GITHUB_TOKEN) {
  process.env.GITHUB_TOKEN = envVars.GITHUB_TOKEN;
  console.log('✓ GITHUB_TOKEN 已从 .env 文件加载');
} else {
  console.error('✗ 错误: .env 文件中未找到 GITHUB_TOKEN');
  process.exit(1);
}

// 执行 electron-builder
try {
  console.log('开始发布到 GitHub...');
  execSync('electron-builder --publish always', {
    stdio: 'inherit',
    env: process.env,
    cwd: path.join(__dirname, '..')
  });
  console.log('✓ 发布完成');
} catch (error) {
  console.error('✗ 发布失败:', error.message);
  process.exit(1);
}
