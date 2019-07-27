"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../../../di/types"));
const webhook_1 = require("@slack/webhook");
let SlackMessenger = class SlackMessenger {
    constructor(logger) {
        this.logger = logger;
    }
    createVersionField(buildInfo) {
        return {
            title: "Version",
            value: buildInfo.version,
            short: true
        };
    }
    createBuildField(buildInfo) {
        return {
            title: "Build",
            value: buildInfo.build,
            short: true
        };
    }
    createAuthorField(buildInfo) {
        return {
            title: "Author",
            value: buildInfo.author,
            short: true
        };
    }
    createBranchField(buildInfo) {
        return {
            title: "Branch",
            value: buildInfo.branch,
            short: true
        };
    }
    createCommitField(buildInfo) {
        let textArr = [];
        if (buildInfo.commitShortHash)
            textArr.push(`#${buildInfo.commitShortHash}`);
        if (buildInfo.commitMessage)
            textArr.push(buildInfo.commitMessage);
        return {
            title: "Commit",
            value: textArr.join(" "),
            short: false
        };
    }
    createFields(buildInfo) {
        const fields = [];
        if (buildInfo.version)
            fields.push(this.createVersionField(buildInfo));
        if (buildInfo.build)
            fields.push(this.createBuildField(buildInfo));
        if (buildInfo.author)
            fields.push(this.createAuthorField(buildInfo));
        if (buildInfo.branch)
            fields.push(this.createBranchField(buildInfo));
        if (buildInfo.commitShortHash || buildInfo.commitMessage)
            fields.push(this.createCommitField(buildInfo));
        return fields;
    }
    createAttachment(buildInfo, color) {
        const attachment = {};
        attachment.fields = this.createFields(buildInfo);
        if (color)
            attachment.color = color;
        return attachment;
    }
    sendMessage(buildInfo, webhookUrl, color, text) {
        return __awaiter(this, void 0, void 0, function* () {
            const webhook = new webhook_1.IncomingWebhook(webhookUrl);
            yield webhook.send({
                username: "Jenkins [bot]",
                icon_url: "https://raw.githubusercontent.com/novalu/ci-build-notifier/master/assets/jenkins-logo.png",
                text,
                attachments: [this.createAttachment(buildInfo, color)]
            });
            this.logger.info("Message sent");
        });
    }
};
SlackMessenger = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.default.Logger)),
    __metadata("design:paramtypes", [Object])
], SlackMessenger);
exports.SlackMessenger = SlackMessenger;
//# sourceMappingURL=SlackMessenger.js.map