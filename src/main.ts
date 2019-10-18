import * as core from '@actions/core';
import * as child from 'child_process';

async function run() {
  try {
    const buildScript = core.getInput('build-script');

    core.debug(`Running: npm run ${buildScript}`);
    child.execSync(`npm run ${buildScript}`);
    
    core.debug(`Running: bundlesize`);
    child.execSync(`npx bundlesize`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
