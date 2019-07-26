import {Messenger} from "../Messenger";
import { BuildInfo } from "../../../model/BuildInfo";
import {inject, injectable} from "inversify";
import TYPES from "../../../di/types";
import {Logger} from "../../../utils/log/Logger";
import {IncomingWebhook} from "@slack/webhook";

@injectable()
class SlackMessenger implements Messenger {

    constructor(
        @inject(TYPES.Logger) private logger: Logger
    ) {
    }

    private createVersionField(buildInfo: BuildInfo): any {
        return {
            title: "Version",
            value: buildInfo.version,
            short: true
        }
    }

    private createAuthorField(buildInfo: BuildInfo): any {
        return {
            title: "Author",
            value: buildInfo.authorName,
            short: true
        }
    }

    private createCommitField(buildInfo: BuildInfo): any {
        return {
            title: "Commit",
            value: buildInfo.commitShortHash,
            short: true
        }
    }

    private createBranchField(buildInfo: BuildInfo): any {
        return {
            title: "Branch",
            value: buildInfo.branch,
            short: true
        }
    }

    private createMessageField(buildInfo: BuildInfo): any {
        return {
            title: "Commit message",
            value: buildInfo.commitMessage,
            short: false
        }
    }

    public async sendMessage(buildInfo: BuildInfo, webhookUrl: string, color: string, text: string) {
        const webhook = new IncomingWebhook(webhookUrl);
        await webhook.send({
            username: "Jenkins [bot]",
            icon_url: "https://raw.githubusercontent.com/novalu/ci-build-notifier/master/assets/jenkins-logo.png",
            text: `${text} build ${buildInfo.build}`,
            attachments: [
                {
                    color,
                    fields: [
                        this.createVersionField(buildInfo),
                        this.createAuthorField(buildInfo),
                        this.createCommitField(buildInfo),
                        this.createBranchField(buildInfo),
                        this.createMessageField(buildInfo)
                    ]
                }
            ]
        });
        this.logger.info("Message sent");
    }

}

export { SlackMessenger }