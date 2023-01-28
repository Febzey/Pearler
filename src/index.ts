import Pearler from "./pearler.js";
import mineflayer from "mineflayer";
import { PearlerOptions, MainBotOptions } from "./config.js";
import MineflayerBot from "./main.js";
import { readFile } from "fs/promises";

const config = await JSON.parse(await readFile("./config.json", "utf8"));

const pearlerOptions = new PearlerOptions()

class WatcherBot extends MineflayerBot { 
    private taskisRunning: boolean = false;

    constructor(options: mineflayer.BotOptions) {
        super(options);
        this.bot.on("chat", (user, msg) => {
            if (msg === `${config.pearlCommand}`) {
                if (this.taskisRunning) return;
                this.taskisRunning = true;

                const pearler = new Pearler(pearlerOptions);
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

new WatcherBot(new MainBotOptions());
