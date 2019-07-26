import LastCommitLog from "last-commit-log";

import { CommitProvider } from "../CommitProvider";
import { injectable } from "inversify";

@injectable()
class AppLastCommitCommitProvider implements CommitProvider {

  async getCommitHash(appPath: string): Promise<string> {
    const lastCommitLog = new LastCommitLog(appPath);
    const lastCommit = await lastCommitLog.getLastCommit();
    return lastCommit.hash;
  }

}

export { AppLastCommitCommitProvider }