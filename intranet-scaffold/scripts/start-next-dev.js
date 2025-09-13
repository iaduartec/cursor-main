const { spawn } = require('child_process');
const path = require('path');

async function main() {
    const cwd = path.resolve(__dirname, '..');
    const nextBin = require.resolve('next/dist/bin/next');

    const env = Object.assign({}, process.env, {
        USE_IN_MEMORY_DB: process.env.USE_IN_MEMORY_DB || '1',
        SKIP_CONTENTLAYER: process.env.SKIP_CONTENTLAYER || '1',
        INTRANET_DEBUG_TOKEN: process.env.INTRANET_DEBUG_TOKEN || 'test-token-123',
    });

    console.log('Starting Next dev from', nextBin, 'cwd', cwd);
    const child = spawn(process.execPath, [nextBin, 'dev', '-H', '127.0.0.1', '-p', '3000'], {
        cwd,
        env,
        stdio: 'inherit',
        shell: false,
    });

    // Keep process alive until Next exits
    child.on('close', (code) => {
        console.log('Next dev exited with', code);
        process.exit(code || 0);
    });
}

main().catch((e) => {
    console.error('Failed to start Next dev', e);
    process.exit(1);
});
