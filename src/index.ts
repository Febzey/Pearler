import "dotenv/config";
import {
    PearlerOptions,
    MainBotOptions,
    PearlerHomeOptions,
    IBotOptions
}                 from "./config.js";
import WatcherBot from "./watcher.js";
import chalk      from "chalk";


console.log(`
    ${chalk.red(`
    ██████╗ ███████╗ █████╗ ██████╗ ██╗     ███████╗██████╗       ██████╗  ██████╗ ████████╗
    ██╔══██╗██╔════╝██╔══██╗██╔══██╗██║     ██╔════╝██╔══██╗      ██╔══██╗██╔═══██╗╚══██╔══╝
    ██████╔╝█████╗  ███████║██████╔╝██║     █████╗  ██████╔╝█████╗██████╔╝██║   ██║   ██║   
    ██╔═══╝ ██╔══╝  ██╔══██║██╔══██╗██║     ██╔══╝  ██╔══██╗╚════╝██╔══██╗██║   ██║   ██║   
    ██║     ███████╗██║  ██║██║  ██║███████╗███████╗██║  ██║      ██████╔╝╚██████╔╝   ██║   
    ╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝      ╚═════╝  ╚═════╝    ╚═╝                                                      
    `)}
                                    made by Febzey#1854
`);


const pearlers = [
    {
        command: "s!",
        name: "spawn camp",
        opts: new IBotOptions(process.env.MC_PEARLER_USERNAME as string)
    },
    {
        command: "!fish",
        name: "home",
        opts: new IBotOptions(process.env.MC_HOME_PEARLER_USERNAME as string)
    },
    {
        command :"c!",
        name: "crusade base.",
        opts: new IBotOptions(process.env.huey as string)
    }
]


new WatcherBot(MainBotOptions, pearlers);
