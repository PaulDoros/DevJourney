const fs = require('fs');
const path = require('path');

const requiredFiles = ['build/client', 'build/server/index.js'];

requiredFiles.forEach((file) => {
  if (!fs.existsSync(path.join(process.cwd(), file))) {
    console.error(`Missing required build file: ${file}`);
    process.exit(1);
  }
});

console.log('Build verification passed!');
