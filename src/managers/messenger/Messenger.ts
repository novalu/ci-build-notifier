import {BuildInfo} from "../../model/BuildInfo";

interface Messenger {
    sendMessage(buildInfo: BuildInfo, slackWebhook: string, color: string, text: string);
}

export { Messenger }