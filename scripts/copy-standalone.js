const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const out = path.join(root, 'dist-standalone');

// Bersihkan hasil lama
fs.rmSync(out, { recursive: true, force: true });

// 1. Salin server standalone
fs.cpSync(path.join(root, '.next', 'standalone'), out, { recursive: true });

// Keep the packaged Electron app's database configuration in sync with the project .env
fs.copyFileSync(path.join(root, '.env'), path.join(out, '.env'));

// 2. Salin aset statis (tidak otomatis ikut di standalone)
fs.cpSync(
    path.join(root, '.next', 'static'),
    path.join(out, '.next', 'static'),
    { recursive: true }
);

// 3. Salin folder public jika ada
const publicDir = path.join(root, 'public');
if (fs.existsSync(publicDir)) {
    fs.cpSync(publicDir, path.join(out, 'public'), { recursive: true });
}

console.log('Standalone siap di:', out);