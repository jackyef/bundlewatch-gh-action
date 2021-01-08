import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as github from '@actions/github';

export const getBranchNameFromRef = (ref: string) => {
  return ref.replace(/^refs\/heads\//, '');
};

async function run() {
  try {
    const buildScript = core.getInput('build-script');
    const configFile = core.getInput('bundlewatch-config');
    const bundlewatchGithubToken = core.getInput('bundlewatch-github-token');

    const githubPayload = github.context.payload;

    if (!githubPayload) throw new Error('Failed when trying to get GitHub Payload');

    const commitSHA = githubPayload.pull_request ? githubPayload.pull_request.head.sha : githubPayload.after;
    const branchName = githubPayload.pull_request
      ? githubPayload.pull_request.head.ref
      : getBranchNameFromRef(githubPayload.ref);
    const repoOwner = githubPayload.repository ? githubPayload.repository.owner.login : '';
    const repoName = githubPayload.repository ? githubPayload.repository.name : '';

    core.exportVariable('CI_REPO_OWNER', repoOwner);
    core.exportVariable('CI_REPO_NAME', repoName);
    core.exportVariable('CI_COMMIT_SHA', commitSHA);
    core.exportVariable('CI_BRANCH', branchName);
    core.exportVariable('BUNDLEWATCH_GITHUB_TOKEN', bundlewatchGithubToken);

    if (buildScript) {
      console.log(`Running build script: "${buildScript}"`);
      await exec.exec(`${buildScript}`, undefined);
    }

    if (configFile) {
      console.log(`Running: bundlewatch --config ${configFile}`);
      await exec.exec(`npx bundlewatch --config ${configFile}`, undefined);
    } else {
      console.log(`Running: bundlewatch`);
      await exec.exec(`npx bundlewatch`, undefined);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

export default run;
