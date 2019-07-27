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

    private createBuildField(buildInfo: BuildInfo): any {
        return {
            title: "Build",
            value: buildInfo.build,
            short: true
        }
    }

    private createAuthorField(buildInfo: BuildInfo): any {
        return {
            title: "Author",
            value: buildInfo.author,
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

    private createCommitField(buildInfo: BuildInfo): any {
        let textArr = [];
        if (buildInfo.commitShortHash) textArr.push(`#${buildInfo.commitShortHash}`);
        if (buildInfo.commitMessage) textArr.push(buildInfo.commitMessage);
        return {
            title: "Commit",
            value: textArr.join(" "),
            short: false
        }
    }

    private createFields(buildInfo: BuildInfo): any[] {
        const fields = [];
        if (buildInfo.version) fields.push(this.createVersionField(buildInfo));
        if (buildInfo.build) fields.push(this.createBuildField(buildInfo));
        if (buildInfo.author) fields.push(this.createAuthorField(buildInfo));
        if (buildInfo.branch) fields.push(this.createBranchField(buildInfo));
        if (buildInfo.commitShortHash || buildInfo.commitMessage) fields.push(this.createCommitField(buildInfo));
        return fields;
    }

    private createAttachment(buildInfo: BuildInfo, color: string): object {
        const attachment: any = {};
        attachment.fields = this.createFields(buildInfo);
        if (color) attachment.color = color;
        return attachment;
    }

    public async sendMessage(buildInfo: BuildInfo, webhookUrl: string, color: string, text: string) {
        const webhook = new IncomingWebhook(webhookUrl);
        await webhook.send({
            username: "Jenkins [bot]",
            icon_url: "https://raw.githubusercontent.com/novalu/ci-build-notifier/master/assets/jenkins-logo.png",
            text,
            attachments: [ this.createAttachment(buildInfo, color) ]
        });
        this.logger.info("Message sent");
    }

}

export { SlackMessenger }