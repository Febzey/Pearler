import Pearler from "./pearler.js";
import mineflayer from "mineflayer";
import { PearlerOptions, MainBotOptions, PearlerHomeOptions } from "./config.js";
import MineflayerBot from "./main.js";
import { readFile } from "fs/promises";

const config = await JSON.parse(await readFile("./config.json", "utf8"));

class WatcherBot extends MineflayerBot { 
    private taskisRunning: boolean = false;

    constructor(options: mineflayer.BotOptions) {
        super(options);

        this.bot.addChatPattern("chat", new RegExp("^(?:[^ ]* )?([^ ]+)(?: [^ ]*)? » (.*)$"), { parse: true, repeat: true })

        //@ts-ignore
        this.bot.on("chat:chat", (args: any) => {
            const msg = args[0][1];
            const user = args[0][0];
            
            if (msg === `${config.spawnCommand}`) {
                if (this.taskisRunning) return;
                this.taskisRunning = true;

                const pearler = new Pearler(PearlerOptions);
                pearler.on("spawned", () => {
                    console.log("pearler spawned.") 
                    pearler.getUsersPearl(user);
                })

                pearler.on("done", () => {
                    console.log("Pearler has finished");
                    this.taskisRunning = false;
                })

            }

            if (msg === `${config.homeCommand}`) {
                if (this.taskisRunning) return;
                this.taskisRunning = true;

                const pearler = new Pearler(PearlerHomeOptions);
                pearler.on("spawned", () => {
                    console.log("pearler spawned.") 
                    pearler.getUsersPearl(user);
                })

                pearler.on("done", () => {
                    console.log("Pearler has finished");
                    this.taskisRunning = false;
                })
            }

        })
    }

}

new WatcherBot(MainBotOptions);
