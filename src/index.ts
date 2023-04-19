import "dotenv/config";
import {
    PearlerOptions,
    MainBotOptions,
    PearlerHomeOptions
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
        opts: PearlerOptions
    },
    {
        command: "!home",
        name: "home",
        opts: PearlerHomeOptions
    }
]


new WatcherBot(MainBotOptions, pearlers);
