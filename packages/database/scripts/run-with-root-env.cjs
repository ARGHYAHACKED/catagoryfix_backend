const { config } = require('dotenv');
const { existsSync } = require('node:fs');
const { resolve } = require('node:path');
const { spawnSync } = require('node:child_process');

const envPath = resolve(__dirname, '../../../.env');
if (existsSync(envPath)) {
  config({ path: envPath });
}

const [command, ...args] = process.argv.slice(2);
if (!command) {
  process.exit(1);
}

const result = spawnSync(command, args, {
  stdio: 'inherit',
  env: process.env,
  shell: true,
});
process.exit(result.status ?? 1);
