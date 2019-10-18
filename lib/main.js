"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
const github = __importStar(require("@actions/github"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let output = '';
            let error = '';
            const options = {};
            options.listeners = {
                stdout: (data) => {
                    output += data.toString();
                },
                stderr: (data) => {
                    error += data.toString();
                }
            };
            const buildScript = core.getInput('build-script');
            const bundlesizeGithubToken = core.getInput('bundlesize-github-token');
            const githubPayload = github.context.payload;
            if (!githubPayload)
                throw new Error('Failed when trying to get PR information');
            const commitSHA = githubPayload.pull_request ? githubPayload.pull_request.head.sha : '';
            const prTitle = githubPayload.pull_request ? githubPayload.pull_request.title : '';
            const repoOwner = githubPayload.repository ? githubPayload.repository.owner.login : '';
            const repoName = githubPayload.repository ? githubPayload.repository.name : '';
            core.exportVariable('CI_REPO_OWNER', repoOwner);
            core.exportVariable('CI_REPO_NAME', repoName);
            core.exportVariable('CI_COMMIT_MESSAGE', prTitle);
            core.exportVariable('CI_COMMIT_SHA', commitSHA);
            core.exportVariable('CI', 'true');
            core.exportVariable('BUNDLESIZE_GITHUB_TOKEN', bundlesizeGithubToken);
            console.log(`Running: npm run ${buildScript}`);
            yield exec.exec(`npm run ${buildScript}`, undefined);
            console.log(`Running: bundlesize`);
            yield exec.exec(`npx bundlesize`, undefined, options);
            if (output)
                console.info(output);
            if (error)
                throw new Error(error);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
