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
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var App_1;
Object.defineProperty(exports, "__esModule", { value: true });
const env_ci_1 = __importDefault(require("env-ci"));
const git_raw_commits_1 = __importDefault(require("git-raw-commits"));
const highland_1 = __importDefault(require("highland"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const commander_1 = __importDefault(require("commander"));
const validator_1 = __importDefault(require("validator"));
const container_1 = __importDefault(require("./di/container"));
const BuildInfo_1 = require("./model/BuildInfo");
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("./di/types"));
const ConsoleMessenger_1 = require("./managers/messenger/impl/ConsoleMessenger");
const SlackMessenger_1 = require("./managers/messenger/impl/SlackMessenger");
const AppLastCommitCommitProvider_1 = require("./providers/commit_provider/impl/AppLastCommitCommitProvider");
const CiCommitProvider_1 = require("./providers/commit_provider/impl/CiCommitProvider");
let App = App_1 = class App {
    constructor(logger) {
        this.logger = logger;
    }
    getCommitHistory(appPath) {
        return git_raw_commits_1.default({ format: "{\"hash\": \"%H\", \"shortHash\": \"%h\", \"authorName\": \"%an\", \"subject\": \"%s\"}" }, { cwd: appPath });
    }
    findCommit(history, requestedHash) {
        return __awaiter(this, void 0, void 0, function* () {
            return highland_1.default(history)
                .map((chunk) => JSON.parse(chunk.toString()))
                .filter((commit) => requestedHash === commit.hash)
                .take(1)
                .toPromise(Promise);
        });
    }
    getCommit(gitPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const commitHistory = this.getCommitHistory(gitPath);
            const commitProvider = container_1.default.get(types_1.default.CommitProvider);
            const commitHash = yield commitProvider.getCommitHash(gitPath);
            const commit = yield this.findCommit(commitHistory, commitHash);
            if (!commit)
                throw new Error(`Commit ${commitHash} not found`);
            return commit;
        });
    }
    getVersionFromApp(appPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const packageJsonPath = path_1.default.join(appPath, 'package.json');
            const packageJsonContent = yield fs_extra_1.default.readJson(packageJsonPath);
            return packageJsonContent.version;
        });
    }
    makeBuildInfo(appPath, gitPath, version) {
        return __awaiter(this, void 0, void 0, function* () {
            const buildDetails = new BuildInfo_1.BuildInfo();
            const commit = yield this.getCommit(gitPath);
            buildDetails.commitShortHash = commit.shortHash;
            buildDetails.commitMessage = commit.subject;
            buildDetails.author = commit.authorName;
            if (appPath) {
                buildDetails.version = yield this.getVersionFromApp(appPath);
            }
            else if (version) {
                buildDetails.version = version;
            }
            buildDetails.build = env_ci_1.default().build;
            buildDetails.branch = env_ci_1.default().branch;
            return buildDetails;
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const packageJsonContent = yield fs_extra_1.default.readJson(path_1.default.join(__dirname, '..', 'package.json'));
            commander_1.default
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
            if (commander_1.default.nodeAppPath && !(yield fs_extra_1.default.pathExists(commander_1.default.nodeAppPath))) {
                this.logger.error("Application path is defined but does not exist");
                return false;
            }
            if (!commander_1.default.gitPath || !(yield fs_extra_1.default.pathExists(commander_1.default.gitPath))) {
                this.logger.error("GIT path is not defined or does not exist");
                return false;
            }
            if (!commander_1.default.useConsole && (!commander_1.default.slackWebhook || commander_1.default.slackWebhook.length === 0)) {
                this.logger.error("Slack webhook is not defined");
                return false;
            }
            if (commander_1.default.color && !validator_1.default.isHexColor(commander_1.default.color)) {
                this.logger.error("Color is defined but it is not valid");
                return false;
            }
            if (!commander_1.default.text || commander_1.default.text.length === 0) {
                this.logger.error("Text is not defined");
                return false;
            }
            const username = commander_1.default.username || "Build notifier";
            const icon = commander_1.default.icon || App_1.JENKINS_LOGO_URL;
            if (!validator_1.default.isURL(icon)) {
                this.logger.error("Icon is not valid URL");
                return false;
            }
            container_1.default.bind(types_1.default.CommitProvider).to(commander_1.default.lastCommit ? AppLastCommitCommitProvider_1.AppLastCommitCommitProvider : CiCommitProvider_1.CiCommitProvider);
            container_1.default.bind(types_1.default.Messenger).to(commander_1.default.useConsole ? ConsoleMessenger_1.ConsoleMessenger : SlackMessenger_1.SlackMessenger);
            const messenger = container_1.default.get(types_1.default.Messenger);
            const buildInfo = yield this.makeBuildInfo(commander_1.default.nodeAppPath, commander_1.default.gitPath, commander_1.default.appVersion);
            yield messenger.sendMessage(buildInfo, commander_1.default.slackWebhook, commander_1.default.color, commander_1.default.text, username, icon);
            return true;
        });
    }
};
App.JENKINS_LOGO_URL = "https://raw.githubusercontent.com/novalu/ci-build-notifier/master/assets/jenkins-logo.png";
App = App_1 = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.default.Logger)),
    __metadata("design:paramtypes", [Object])
], App);
exports.App = App;
//# sourceMappingURL=App.js.map