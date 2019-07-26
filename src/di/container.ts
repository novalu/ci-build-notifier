import { Container } from "inversify";
import TYPES from "./types";
import { App } from "../App";
import { Logger } from "../utils/log/Logger";
import { SignaleLogger } from "../utils/log/impl/SignaleLogger";
import { CommitProvider } from "../providers/commit_provider/CommitProvider";
import { AppLastCommitCommitProvider } from "../providers/commit_provider/impl/AppLastCommitCommitProvider";
import {Messenger} from "../managers/messenger/Messenger";
import {SlackMessenger} from "../managers/messenger/impl/SlackMessenger";

const container = new Container();

container
    .bind<App>(TYPES.App)
    .to(App)
    .inSingletonScope();

container
    .bind<Messenger>(TYPES.Messenger)
    .to(SlackMessenger)
    .inSingletonScope();

container
    .bind<CommitProvider>(TYPES.CommitProvider)
    .to(AppLastCommitCommitProvider)
    .inSingletonScope();

container
    .bind<Logger>(TYPES.Logger)
    .to(SignaleLogger)
    .inSingletonScope();

export default container;