import Pearler         from "./pearler.js";
import MineflayerBot   from "./main.js";
import { IBotOptions } from "./config.js";
import { sleep } from "./utils.js";

interface PearlerParams {
    command: string,
    name:    string,
    opts:    IBotOptions
}

export default class WatcherBot extends MineflayerBot {
    private taskisRunning: boolean = false;

    constructor(options: IBotOptions, pearlers: PearlerParams[]) {
        super(options);

        this.bot.once("spawn", () => {
            this.bot.addChatPattern("chat", new RegExp("^(?:[^ ]* )?([^ ]+)(?: [^ ]*)? » (.*)$"), { parse: true, repeat: true })
            this.bot.addChatPattern("chat", new RegExp("^<([^ ]*)> (.*)$"), { parse: true, repeat: true })
        });

        this.bot.on("end", () => {
            console.log("Bot has ended.")
        })


        //@ts-ignore
        this.bot.on("chat:chat", (args: any) => {
            const msg = args[0][1];
            const user = args[0][0];

            if (this.taskisRunning) return;

            for (const pearler of pearlers) {
                if (msg === pearler.command) {
                    const { name, opts } = pearler;

                    const pearlerBot = new Pearler(opts, name);
                    this.taskisRunning = true;

                    pearlerBot.on("spawned", () => {
                        console.log(`Pearler Bot: ${this.bot.username} Joined Successfully`)
                        pearlerBot.getUsersPearl(user);
                    })

                    pearlerBot.on("done", (success) => {
                        console.log(`Pearler Bot: ${this.bot.username} Finished ${success?"Successfully":"With A Failure"}`)

                        this.taskisRunning = false;
                    })

                    pearlerBot.on("nopearl", async (username: string, pearlerName: string) => {
                        this.bot.chat(`${username}, are you sure you set a pearl at ${pearlerName}?`)
                        await sleep(1000);
                        pearlerBot.quitBot(false);
                    })

                    pearlerBot.on("pearlfound", (username: string, pearlName: string) => {
                        this.bot.chat(`Hang on, ${username}!`)
                    })

                    break;
                }
            }

        })
    }

}