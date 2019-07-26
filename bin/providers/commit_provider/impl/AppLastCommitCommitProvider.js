"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
const last_commit_log_1 = __importDefault(require("last-commit-log"));
const inversify_1 = require("inversify");
let AppLastCommitCommitProvider = class AppLastCommitCommitProvider {
    getCommitHash(appPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const lastCommitLog = new last_commit_log_1.default(appPath);
            const lastCommit = yield lastCommitLog.getLastCommit();
            return lastCommit.hash;
        });
    }
};
AppLastCommitCommitProvider = __decorate([
    inversify_1.injectable()
], AppLastCommitCommitProvider);
exports.AppLastCommitCommitProvider = AppLastCommitCommitProvider;
//# sourceMappingURL=AppLastCommitCommitProvider.js.map