class BuildInfo {
    public build: string;
    public commitShortHash: string;
    public branch: string;
    public author: string;
    public commitMessage: string;
    public version: string;

    constructor() {}
}

export { BuildInfo };