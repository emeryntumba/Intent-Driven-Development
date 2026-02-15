#!/usr/bin/env node
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, '..');
const tsConfigPath = join(projectRoot, 'tsconfig.json');
const entryPoint = join(__dirname, 'intent.ts');

// Resolve the loader absolute path to ensure it works from any CWD
// We catch errors just in case, but in this repo it should exist.
let loaderArg = 'ts-node/esm';
try {
    // Attempt to resolve absolute URL to ts-node/esm
    const resolved = await import.meta.resolve('ts-node/esm');
    loaderArg = resolved;
} catch (e) {
    // Fallback to simple string if resolve fails (mostly for older node versions, though v22 is fine)
}

const args = [
    '--loader', loaderArg,
    '--no-warnings',
    entryPoint,
    ...process.argv.slice(2)
];

const child = spawn(process.execPath, args, {
    stdio: 'inherit',
    env: {
        ...process.env,
        TS_NODE_PROJECT: tsConfigPath
    }
});

child.on('close', (code) => {
    process.exit(code ?? 0);
});
child.on('error', (err) => {
    console.error('Failed to start Intent CLI:', err);
    process.exit(1);
});
