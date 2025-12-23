const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const output = fs.createWriteStream(path.join(__dirname, 'dice.zip'));
const archive = archiver('zip', {
  zlib: { level: 9 }
});

output.on('close', function() {
  console.log(archive.pointer() + ' total bytes');
  console.log('dice.zip has been created.');
});

archive.on('warning', function(err) {
  if (err.code === 'ENOENT') {
    console.warn(err);
  } else {
    throw err;
  }
});

archive.on('error', function(err) {
  throw err;
});

archive.pipe(output);

archive.glob('**/*', {
  cwd: __dirname,
  dot: true,
  ignore: [
    'node_modules/**',
    'themes/**',
    'dist/**',
    'build/**',
    'coverage/**',
    'logs/**',
    '*.log',
    '.env',
    '.cache/**',
    '**/.DS_Store',
    '**/Thumbs.db',
    '.git/**',
    'dice.zip',
    'make-zip.js'
  ]
});

archive.finalize();