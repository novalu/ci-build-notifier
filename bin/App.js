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
const env_ci_1 = __importDefault(require("env-ci"));
const git_raw_commits_1 = __importDefault(require("git-raw-commits"));
const highland_1 = __importDefault(require("highland"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const commander_1 = __importDefault(require("commander"));
const validator_1 = __importDefault(require("validator"));
const BuildInfo_1 = require("./model/BuildInfo");
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("./di/types"));
let App = class App {
    constructor(messenger, commitProvider, logger) {
        this.messenger = messenger;
        this.commitProvider = commitProvider;
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
            const commitHash = yield this.commitProvider.getCommitHash(gitPath);
            const commit = yield this.findCommit(commitHistory, commitHash);
            if (!commit)
                throw new Error(`Commit ${commitHash} not found`);
            return commit;
        });
    }
    getVersion(appPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const packageJsonPath = path_1.default.join(appPath, 'package.json');
            const packageJsonContent = yield fs_extra_1.default.readJson(packageJsonPath);
            return packageJsonContent.version;
        });
    }
    makeBuildInfo(appPath, gitPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const buildDetails = new BuildInfo_1.BuildInfo();
            const commit = yield this.getCommit(gitPath);
            buildDetails.commitShortHash = commit.shortHash;
            buildDetails.authorName = commit.authorName;
            buildDetails.commitMessage = commit.subject;
            buildDetails.version = yield this.getVersion(appPath);
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
                .option("-p, --app-path <var>", "Application path where package.json is")
                .option("-g, --git-path <var>", "GIT path")
                .option("-w, --webhook <var>", "Slack webhook URL")
                .option("-c, --color <var>", "Slack message color")
                .option("-t, --text <var>", "Slack message text")
                .parse(process.argv);
            if (!commander_1.default.appPath || commander_1.default.appPath.length === 0) {
                this.logger.error("Application path is not defined");
                return false;
            }
            if (!commander_1.default.gitPath || commander_1.default.gitPath.length === 0) {
                this.logger.error("GIT path is not defined");
                return false;
            }
            if (!commander_1.default.webhook || commander_1.default.webhook.length === 0) {
                this.logger.error("Slack webhook is not defined");
                return false;
            }
            if (!commander_1.default.color || commander_1.default.color.length === 0) {
                this.logger.error("Color is not defined");
                return false;
            }
            if (!validator_1.default.isHexColor(commander_1.default.color)) {
                this.logger.error("Color is not valid");
                return false;
            }
            if (!commander_1.default.text || commander_1.default.text.length === 0) {
                this.logger.error("Text is not defined");
                return false;
            }
            const buildInfo = yield this.makeBuildInfo(commander_1.default.appPath, commander_1.default.gitPath);
            yield this.messenger.sendMessage(buildInfo, commander_1.default.webhook, commander_1.default.color, commander_1.default.text);
            return true;
        });
    }
};
App = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.default.Messenger)),
    __param(1, inversify_1.inject(types_1.default.CommitProvider)),
    __param(2, inversify_1.inject(types_1.default.Logger)),
    __metadata("design:paramtypes", [Object, Object, Object])
], App);
exports.App = App;
//# sourceMappingURL=App.js.map