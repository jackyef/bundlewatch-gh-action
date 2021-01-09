import fs from 'fs';
import path from 'path';
import bundlewatch, { STATUSES } from 'bundlewatch';
import chalk from 'chalk';
import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as github from '@actions/github';

import { BundlewatchConfig, BundlewatchResults } from './types';
import { logger } from './logger';
import { prettyPrintResults } from './prettyPrintResults';

export const getBranchNameFromRef = (ref: string) => {
  return ref.replace(/^refs\/heads\//, '');
};

async function run() {
  try {
    const buildScript = core.getInput('build-script');
    const configFile = core.getInput('bundlewatch-config');

    const githubPayload = github.context.payload;

    if (!githubPayload) {
      throw new Error('Failed when trying to get GitHub Payload');
    }

    if (buildScript) {
      console.log(`Running build script: "${buildScript}"`);
      await exec.exec(`${buildScript}`, undefined);
    }

    let config: BundlewatchConfig = {
      files: []
    };

    if (configFile) {
      try {
        const projectBundlewatchConfig = require(path.resolve(
          './',
          configFile
        ));

        config = {
          ...config,
          ...projectBundlewatchConfig
        };
      } catch {
        core.setFailed(
          `Failed while reading the configuration file at "${configFile}"`
        );

        return 1;
      }
    } else {
      // Try getting the configuration from package.json
      try {
        const projectBundlewatchConfig = JSON.parse(
          fs.readFileSync('package.json', 'utf-8')
        ).bundlewatch;

        config = {
          ...config,
          ...projectBundlewatchConfig
        };
      } catch {
        core.setFailed(
          `Failed while reading the configuration from package.json`
        );

        return 1;
      }
    }

    config = {
      ...config,
      ci: {
        ...config.ci,
        githubAccessToken: core.getInput('bundlewatch-github-token'),
        repoOwner: githubPayload.repository
          ? githubPayload.repository.owner.login
          : '',
        repoName: githubPayload.repository ? githubPayload.repository.name : '',
        repoCurrentBranch: githubPayload.pull_request
          ? githubPayload.pull_request.head.ref
          : getBranchNameFromRef(githubPayload.ref),
        repoBranchBase:
          core.getInput('branch-base') ||
          (githubPayload.pull_request
            ? githubPayload.pull_request.base.ref
            : 'master'),
        commitSha: githubPayload.pull_request
          ? githubPayload.pull_request.head.sha
          : githubPayload.after
      }
    };

    // Taken and modified from the official binary:
    // https://github.com/bundlewatch/bundlewatch/blob/7ad173476dcd2910429600af364f3118889be8c8/src/bin/index.js#L42
    if (config.files && config.files.length > 0) {
      const results: BundlewatchResults = await bundlewatch(config);

      if (results.url) {
        logger.log('');
        logger.log(
          `${chalk.cyanBright('Result breakdown at:')} ${results.url}`
        );
      }

      prettyPrintResults(results.fullResults);

      if (results.status === STATUSES.FAIL) {
        logger.log(chalk.redBright(`bundlewatch FAIL`));
        logger.log(results.summary);
        core.setFailed('');
        return 1;
      }

      if (results.status === STATUSES.WARN) {
        logger.log(chalk.redBright(`bundlewatch WARN`));
        logger.log(results.summary);
        logger.log('');
        return 0;
      }

      logger.log(chalk.greenBright(`bundlewatch PASS`));
      logger.log(results.summary);
      logger.log('');

      return 0;
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

void run();

export default run;
