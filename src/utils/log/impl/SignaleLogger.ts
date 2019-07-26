import { injectable } from "inversify";
import PrettyError from "pretty-error";
import signale, { Signale } from "signale";
import { Logger } from "../Logger";

@injectable()
class SignaleLogger implements Logger {

  private pe: PrettyError;
  private signale: any;

  constructor() {
    this.pe = new PrettyError();
    signale.config({
      displayTimestamp: true
    });
    this.signale = new Signale({
      types: {
        debug: {
          badge: ".",
          color: "grey",
          label: "debug"
        }
      }
    });
  }

  private logExtra(op: (extra) => void, extra: any) {
    if (extra instanceof Error) {
      op(this.pe.render(extra))
    } else {
      op(extra);
    }
  }

  public debug(body: string, extra?: any) {
    this.signale.debug(body);
    if (extra) this.logExtra((extraParam) => this.signale.debug(extraParam), extra);
  }

  public error(body: string, extra?: any) {
    this.signale.error(body);
    if (extra) this.logExtra((extraParam) => this.signale.error(extraParam), extra);
  }

  public info(body: string, extra?: any) {
    this.signale.info(body);
    if (extra) this.logExtra((extraParam) => this.signale.info(extraParam), extra);
  }

  public trace(body: string, extra?: any) {
    this.signale.fancyLog(body);
    if (extra) this.logExtra((extraParam) => this.signale.log(extraParam), extra);
  }

  public warn(body: string, extra?: any) {
    this.signale.warn(body);
    if (extra) this.logExtra((extraParam) => this.signale.warn(extraParam), extra);
  }

  public fatal(body: string, extra?: any) {
    this.signale.fatal(body);
    if (extra) this.logExtra((extraParam) => this.signale.fatal(extraParam), extra);
  }
}

export { SignaleLogger };
