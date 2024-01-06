import "dotenv/config";
import WatcherBot from "./watcher.js";
import chalk      from "chalk";
import {
    IBotOptions
}                 from "./config.js";

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
        command: "!s",
        name: "spawn base",
        opts: new IBotOptions(process.env.MC_SPAWNBASE_USERNAME as string)
    },
]


new WatcherBot(new IBotOptions(process.env.MC_MAIN_USERNAME as string), pearlers);
