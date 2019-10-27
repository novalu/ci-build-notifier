import {Messenger} from "../Messenger";
import { BuildInfo } from "../../../model/BuildInfo";
import {inject, injectable} from "inversify";
import TYPES from "../../../di/types";
import {Logger} from "../../../utils/log/Logger";
import chalk from "chalk";

@injectable()
class ConsoleMessenger implements Messenger {

    constructor(
        @inject(TYPES.Logger) private logger: Logger
    ) {}

    private createCommitRow(buildInfo: BuildInfo): string {
        let textArr = [];
        if (buildInfo.commitShortHash) textArr.push(`#${buildInfo.commitShortHash}`);
        if (buildInfo.commitMessage) textArr.push(buildInfo.commitMessage);
        return textArr.join(" ");
    }

    private color(color: string, text: string): string {
        if (color) {
            return chalk.hex(color)(text);
        } else {
            return text;
        }
    }

    sendMessage(buildInfo: BuildInfo, slackWebhook: string, color: string, text: string, username: string, icon: string) {
        this.logger.info(chalk.hex(color)(text));
        if (buildInfo.version) this.logger.info(this.color(color, `Version: ${buildInfo.version}`));
        if (buildInfo.build) this.logger.info(this.color(color, `Build: ${buildInfo.build}`));
        if (buildInfo.author) this.logger.info(this.color(color, `Author: ${buildInfo.author}`));
        if (buildInfo.branch) this.logger.info(this.color(color, `Branch: ${buildInfo.branch}`));
        if (buildInfo.commitShortHash || buildInfo.commitMessage) this.logger.info(this.color(color, `Commit: ${this.createCommitRow(buildInfo)}`));
    }

}

export { ConsoleMessenger }