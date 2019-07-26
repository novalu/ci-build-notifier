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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const pretty_error_1 = __importDefault(require("pretty-error"));
const signale_1 = __importStar(require("signale"));
let SignaleLogger = class SignaleLogger {
    constructor() {
        this.pe = new pretty_error_1.default();
        signale_1.default.config({
            displayTimestamp: true
        });
        this.signale = new signale_1.Signale({
            types: {
                debug: {
                    badge: ".",
                    color: "grey",
                    label: "debug"
                }
            }
        });
    }
    logExtra(op, extra) {
        if (extra instanceof Error) {
            op(this.pe.render(extra));
        }
        else {
            op(extra);
        }
    }
    debug(body, extra) {
        this.signale.debug(body);
        if (extra)
            this.logExtra((extraParam) => this.signale.debug(extraParam), extra);
    }
    error(body, extra) {
        this.signale.error(body);
        if (extra)
            this.logExtra((extraParam) => this.signale.error(extraParam), extra);
    }
    info(body, extra) {
        this.signale.info(body);
        if (extra)
            this.logExtra((extraParam) => this.signale.info(extraParam), extra);
    }
    trace(body, extra) {
        this.signale.fancyLog(body);
        if (extra)
            this.logExtra((extraParam) => this.signale.log(extraParam), extra);
    }
    warn(body, extra) {
        this.signale.warn(body);
        if (extra)
            this.logExtra((extraParam) => this.signale.warn(extraParam), extra);
    }
    fatal(body, extra) {
        this.signale.fatal(body);
        if (extra)
            this.logExtra((extraParam) => this.signale.fatal(extraParam), extra);
    }
};
SignaleLogger = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], SignaleLogger);
exports.SignaleLogger = SignaleLogger;
//# sourceMappingURL=SignaleLogger.js.map