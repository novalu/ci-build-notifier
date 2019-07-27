"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const types_1 = __importDefault(require("./types"));
const App_1 = require("../App");
const SignaleLogger_1 = require("../utils/log/impl/SignaleLogger");
const container = new inversify_1.Container();
container
    .bind(types_1.default.App)
    .to(App_1.App)
    .inSingletonScope();
container
    .bind(types_1.default.Logger)
    .to(SignaleLogger_1.SignaleLogger)
    .inSingletonScope();
exports.default = container;
//# sourceMappingURL=container.js.map