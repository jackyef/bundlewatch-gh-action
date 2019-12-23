import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as github from '@actions/github';

async function run() {
  try {
    let output = '';
    let error = '';

    const options: any = {};

    options.listeners = {
      stdout: (data: Buffer) => {
        output += data.toString();
      },
      stderr: (data: Buffer) => {
        error += data.toString();
      }
    };

    const buildScript = core.getInput('build-script');
    const bundlesizeGithubToken = core.getInput('bundlewatch-github-token');

    const githubPayload = github.context.payload;

    if (!githubPayload) throw new Error('Failed when trying to get PR information');
    
    const commitSHA = githubPayload.pull_request ? githubPayload.pull_request.head.sha : '';
    const branchName = githubPayload.pull_request ? githubPayload.pull_request.head.ref : '';
    const prTitle = githubPayload.pull_request ? githubPayload.pull_request.title : '';
    const repoOwner = githubPayload.repository ? githubPayload.repository.owner.login : '';
    const repoName = githubPayload.repository ? githubPayload.repository.name : '';

    core.exportVariable('CI_REPO_OWNER', repoOwner);
    core.exportVariable('CI_REPO_NAME', repoName);
    core.exportVariable('CI_COMMIT_SHA', commitSHA);
    core.exportVariable('CI_BRANCH', branchName);
    core.exportVariable('BUNDLEWATCH_GITHUB_TOKEN', bundlesizeGithubToken);

    console.log(`Running build script: "${buildScript}"`);
    await exec.exec(`${buildScript}`, undefined);

    console.log(`Running: bundlewatch`);
    await exec.exec(`npx bundlewatch`, undefined, options);
    if (output) console.info(output);
    if (error) throw new Error(error);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
