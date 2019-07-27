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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("../../../di/types"));
const chalk_1 = __importDefault(require("chalk"));
let ConsoleMessenger = class ConsoleMessenger {
    constructor(logger) {
        this.logger = logger;
    }
    createCommitRow(buildInfo) {
        let textArr = [];
        if (buildInfo.commitShortHash)
            textArr.push(`#${buildInfo.commitShortHash}`);
        if (buildInfo.commitMessage)
            textArr.push(buildInfo.commitMessage);
        return textArr.join(" ");
    }
    color(color, text) {
        if (color) {
            return chalk_1.default.hex(color)(text);
        }
        else {
            return text;
        }
    }
    sendMessage(buildInfo, slackWebhook, color, text) {
        this.logger.info(chalk_1.default.hex(color)(text));
        if (buildInfo.version)
            this.logger.info(this.color(color, `Version: ${buildInfo.version}`));
        if (buildInfo.build)
            this.logger.info(this.color(color, `Build: ${buildInfo.build}`));
        if (buildInfo.author)
            this.logger.info(this.color(color, `Author: ${buildInfo.author}`));
        if (buildInfo.branch)
            this.logger.info(this.color(color, `Branch: ${buildInfo.branch}`));
        if (buildInfo.commitShortHash || buildInfo.commitMessage)
            this.logger.info(this.color(color, `Commit: ${this.createCommitRow(buildInfo)}`));
    }
};
ConsoleMessenger = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.default.Logger)),
    __metadata("design:paramtypes", [Object])
], ConsoleMessenger);
exports.ConsoleMessenger = ConsoleMessenger;
//# sourceMappingURL=ConsoleMessenger.js.map