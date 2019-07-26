import envCi from "env-ci";

import { CommitProvider } from "../CommitProvider";
import { injectable } from "inversify";

@injectable()
class CiCommitProvider implements CommitProvider {

  async getCommitHash(appPath: string): Promise<string> {
    return envCi().commit;
  }

}

export { CiCommitProvider }