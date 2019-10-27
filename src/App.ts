import envCi from "env-ci";
import gitCommits from "git-raw-commits";
import high from "highland";
import fs from "fs-extra";
import path from "path";
import commander from "commander";
import validator from "validator";
import container from "./di/container";

import { BuildInfo } from "./model/BuildInfo";
import { inject, injectable } from "inversify";
import TYPES from "./di/types";
import { Logger } from "./utils/log/Logger";
import { CommitProvider } from "./providers/commit_provider/CommitProvider";
import {Messenger} from "./managers/messenger/Messenger";
import {ConsoleMessenger} from "./managers/messenger/impl/ConsoleMessenger";
import {SlackMessenger} from "./managers/messenger/impl/SlackMessenger";
import {AppLastCommitCommitProvider} from "./providers/commit_provider/impl/AppLastCommitCommitProvider";
import {CiCommitProvider} from "./providers/commit_provider/impl/CiCommitProvider";

@injectable()
class App {

    private static readonly JENKINS_LOGO_URL = "https://raw.githubusercontent.com/novalu/ci-build-notifier/master/assets/jenkins-logo.png";

    constructor(
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
        const commitProvider = container.get<CommitProvider>(TYPES.CommitProvider);
        const commitHash = await commitProvider.getCommitHash(gitPath);
        const commit = await this.findCommit(commitHistory, commitHash);

        if (!commit) throw new Error(`Commit ${commitHash} not found`);

        return commit;
    }

    private async getVersionFromApp(appPath: string) {
        const packageJsonPath = path.join(appPath, 'package.json');
        const packageJsonContent = await fs.readJson(packageJsonPath);
        return packageJsonContent.version;
    }

    private async makeBuildInfo(appPath: string, gitPath: string, version: string): Promise<BuildInfo> {
        const buildDetails = new BuildInfo();
        const commit: any = await this.getCommit(gitPath);
        buildDetails.commitShortHash = commit.shortHash;
        buildDetails.commitMessage = commit.subject;
        buildDetails.author = commit.authorName;
        if (appPath) {
            buildDetails.version = await this.getVersionFromApp(appPath);
        } else if (version) {
            buildDetails.version = version;
        }
        buildDetails.build = envCi().build;
        buildDetails.branch = envCi().branch;
        return buildDetails;
    }

    public async start(): Promise<boolean> {
        const packageJsonContent = await fs.readJson(path.join(__dirname, '..', 'package.json'));

        commander
            .version(packageJsonContent.version)
            .option("-g, --git-path <var>", "GIT root path")
            .option("-u --username <var>", "Bot username (optional, \"Build notifier\" if not set)")
            .option("-i --icon <var>", "Bot icon (optional, Jenkins icon if not set)")
            .option("-t, --text <var>", "Message text")
            .option("-a, --node-app-path <var>", "Node.js application path as a source for version (optional)")
            .option("-v, --app-version <var>", "Set version manually (optional)")
            .option("--last-commit", "Use last commit from GIT history instead of current commit from CI")
            .option("-c, --color <var>", "Message hex color (optional)")
            .option("--use-console", "Use console output instead of Slack")
            .option("-s, --slack-webhook <var>", "Slack webhook URL (used only if --use-console is not set)")
          .parse(process.argv);

        if (commander.nodeAppPath && !(await fs.pathExists(commander.nodeAppPath))) {
            this.logger.error("Application path is defined but does not exist");
            return false;
        }

        if (!commander.gitPath || !(await fs.pathExists(commander.gitPath))) {
            this.logger.error("GIT path is not defined or does not exist");
            return false;
        }

        if (!commander.useConsole && (!commander.slackWebhook || commander.slackWebhook.length === 0)) {
            this.logger.error("Slack webhook is not defined");
            return false;
        }

        if (commander.color && !validator.isHexColor(commander.color)) {
            this.logger.error("Color is defined but it is not valid");
            return false;
        }

        if (!commander.text || commander.text.length === 0) {
            this.logger.error("Text is not defined");
            return false;
        }

        const username = commander.username || "Build notifier";

        const icon = commander.icon || App.JENKINS_LOGO_URL;
        if (!validator.isURL(icon)) {
            this.logger.error("Icon is not valid URL");
            return false;
        }

        container.bind<CommitProvider>(TYPES.CommitProvider).to(
            commander.lastCommit ? AppLastCommitCommitProvider : CiCommitProvider);

        container.bind<Messenger>(TYPES.Messenger).to(
            commander.useConsole ? ConsoleMessenger : SlackMessenger);
        const messenger = container.get<Messenger>(TYPES.Messenger);

        const buildInfo = await this.makeBuildInfo(commander.nodeAppPath, commander.gitPath, commander.appVersion);
        await messenger.sendMessage(buildInfo, commander.slackWebhook, commander.color, commander.text, username, icon);

        return true;
    }

}

export { App }