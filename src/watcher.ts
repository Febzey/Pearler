import Pearler          from "./pearler.js";
import mineflayer       from "mineflayer";
import MineflayerBot    from "./main.js";
import { IBotOptions }  from "./config.js";

interface PearlerParams {
    command: string,
    name: string,
    opts: IBotOptions
}


export default class WatcherBot extends MineflayerBot {
    private taskisRunning: boolean = false;

    constructor(options: mineflayer.BotOptions, pearlers: PearlerParams[]) {
        super(options);

        this.bot.addChatPattern("chat", new RegExp("^(?:[^ ]* )?([^ ]+)(?: [^ ]*)? » (.*)$"), { parse: true, repeat: true })
        this.bot.addChatPattern("chat", new RegExp("^<([^ ]*)> (.*)$"), { parse: true, repeat: true })


        //@ts-ignore
        this.bot.on("chat:chat", (args: any) => {
            const msg  = args[0][1];
            const user = args[0][0];

            if (this.taskisRunning) return;

            for (const pearler of pearlers) {
                if (msg === pearler.command) {
                    const { name, opts } = pearler;

                    this.taskisRunning = true;
                    const pearlerBot = new Pearler(opts, name);

                    pearlerBot.on("spawned", () => {
                        console.log("pearler spawned.")
                        pearlerBot.getUsersPearl(user);
                    })

                    pearlerBot.on("done", () => {
                        console.log("Pearler has finished");
                        this.taskisRunning = false;
                    })

                    pearlerBot.on("nopearl", (username: string, pearlerName: string) => {
                        this.bot.chat(`${username}, it seems you don't have a pearl set at '${pearlerName}'`)
                    })

                    pearlerBot.on("pearlfound", (username: string, pearlName: string) => {
                        this.bot.chat(`Hang on ${username}, teleporting you to '${pearlName}'!`)
                    })

                    break;
                }
            }

        })
    }

}