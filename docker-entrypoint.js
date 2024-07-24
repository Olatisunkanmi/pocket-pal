#!/usr/bin/env node

import * as nodeChild_process from 'node:child_process';

const env = { ...process.env };

(async () => {
  // If running the web server then migrate existing database
  if (process.argv.slice(2).join(' ') === 'node dist/src/main.js') {
    await exec('yarn db.migration.run');
  }

  // launch application
  await exec(process.argv.slice(2).join(' '));
})();

function exec(command) {
  const child = nodeChild_process.spawn(command, {
    shell: true,
    stdio: 'inherit',
    env,
  });
  return new Promise((resolve, reject) => {
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} failed rc=${code}`));
      }
    });
  });
}
