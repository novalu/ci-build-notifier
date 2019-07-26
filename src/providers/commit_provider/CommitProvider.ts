interface CommitProvider {

  getCommitHash(appPath: string): Promise<string>

}

export { CommitProvider }