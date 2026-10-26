const fs = require('fs');
const path = require('path');

exports.default = async function (context) {
    const src = path.join(context.packager.projectDir, 'dist-standalone');
    const dest = path.join(context.appOutDir, 'resources', 'standalone');

    fs.rmSync(dest, { recursive: true, force: true });
    fs.cpSync(src, dest, { recursive: true, dereference: true });

    // Gagalkan build jika node_modules tidak ikut
    if (!fs.existsSync(path.join(dest, 'node_modules', 'next'))) {
        throw new Error('node_modules/next tidak ada di ' + dest);
    }
    console.log('Standalone disalin ke:', dest);
};