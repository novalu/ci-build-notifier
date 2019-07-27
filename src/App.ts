import envCi from "env-ci";
import gitCommits from "git-raw-commits";
import high from "highland";
import fs from "fs-extra";
import path from "path";
import commander from "commander";
import validator from "validator";

import { BuildInfo } from "./model/BuildInfo";
import { inject, injectable } from "inversify";
import TYPES from "./di/types";
import { Logger } from "./utils/log/Logger";
import { CommitProvider } from "./providers/commit_provider/CommitProvider";
import {Messenger} from "./managers/messenger/Messenger";

@injectable()
class App {

    constructor(
        @inject(TYPES.Messenger) private messenger: Messenger,
        @inject(TYPES.CommitProvider) private commitProvider: CommitProvider,
        @inject(TYPES.Logger) private logger: Logger
    ) {}

    private getCommitHistory(appPath: string) {
        return gitCommits(
            {format: "{\"hash\": \"%H\", \"shortHash\": \"%h\", \"authorName\": \"%an\", \"subject\": \"%s\"}"},
            {cwd: appPath}
        );
    }

    private async findCommit(history, requestedHash: string): Promise<any> {
        return high(history)
            .map((chunk) => JSON.parse(chunk.toString()))
            .filter((commit) => requestedHash === commit.hash)
            .take(1)
            .toPromise(Promise);
    }

    private async getCommit(gitPath: string): Promise<object> {
        const commitHistory = this.getCommitHistory(gitPath);
        const commitHash = await this.commitProvider.getCommitHash(gitPath);
        const commit = await this.findCommit(commitHistory, commitHash);

        if (!commit) throw new Error(`Commit ${commitHash} not found`);

        return commit;
    }

    private async getVersion(appPath: string) {
        const packageJsonPath = path.join(appPath, 'package.json');
        const packageJsonContent = await fs.readJson(packageJsonPath);
        return packageJsonContent.version;
    }

    private async makeBuildInfo(appPath: string, gitPath: string): Promise<BuildInfo> {
        const buildDetails = new BuildInfo();
        const commit: any = await this.getCommit(gitPath);
        buildDetails.commitShortHash = commit.shortHash;
        buildDetails.author = commit.authorName;
        buildDetails.commitMessage = commit.subject;
        buildDetails.version = await this.getVersion(appPath);
        buildDetails.build = envCi().build;
        buildDetails.branch = envCi().branch;
        return buildDetails;
    }

    public async start(): Promise<boolean> {
        const packageJsonContent = await fs.readJson(path.join(__dirname, '..', 'package.json'));

        commander
            .version(packageJsonContent.version)
            .option("-p, --app-path <var>", "Application path where package.json is")
            .option("-g, --git-path <var>", "GIT path")
            .option("-w, --webhook <var>", "Slack webhook URL")
            .option("-c, --color [var]", "Message color")
            .option("-t, --text <var>", "Message text")
          .parse(process.argv);

        if (!commander.appPath || commander.appPath.length === 0) {
            this.logger.error("Application path is not defined");
            return false;
        }

        if (!commander.gitPath || commander.gitPath.length === 0) {
            this.logger.error("GIT path is not defined");
            return false;
        }

        if (!commander.webhook || commander.webhook.length === 0) {
            this.logger.error("Slack webhook is not defined");
            return false;
        }

        if (commander.color && !validator.isHexColor(commander.color)) {
            this.logger.error("Color is not valid");
            return false;
        }

        if (!commander.text || commander.text.length === 0) {
            this.logger.error("Text is not defined");
            return false;
        }

        const buildInfo = await this.makeBuildInfo(commander.appPath, commander.gitPath);
        await this.messenger.sendMessage(buildInfo, commander.webhook, commander.color, commander.text);

        return true;
    }

}

export { App }