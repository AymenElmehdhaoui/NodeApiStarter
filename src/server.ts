import "reflect-metadata";

import AppStarter from "./App";
import { DIContainerClass } from "./middlewares/DIContainer";
import Options from "./config/Options";
import { IApp } from "./IApp";

const {TYPES} = Options;

DIContainerClass.pushBind<IApp>(AppStarter, TYPES.AppStarter).start();