import Pearler from "./pearler.js";
import MineflayerBot from "./main.js";
import { IBotOptions } from "./config.js";
import { sleep } from "./utils.js";

interface PearlerParams {
    command: string,
    name: string,
    opts: IBotOptions
}

export default class WatcherBot extends MineflayerBot {
    private taskisRunning: boolean = false;

    constructor(options: IBotOptions, pearlers: PearlerParams[]) {
        super(options);

        this.bot.once("spawn", () => {
            this.bot.addChatPattern("chat", new RegExp("^([^ ]*) » (.*)$"), { parse: true, repeat: true })
            this.bot.addChatPattern("chat", new RegExp("^<([^ ]*)> (.*)$"), { parse: true, repeat: true })
        });

        this.bot.on("end", async () => {
            console.log("Bot has ended.")
            // set a timeout for 20 seconds to restart the bot
            await sleep(45000);
            // pm2 will restart the instance
            process.exit(0);
        })

        this.bot.on("messagestr", (...args) => {
            const thereMayBeUUID = args[3 as any];

            let msg;
            let username: string;

            for (const player of Object.values(this.bot.players)) {
                if (thereMayBeUUID && player.uuid === thereMayBeUUID) {
                    msg = args[0];
                    username = player.username;
                    break;
                }
            }

            if (this.taskisRunning) return;

            for (const pearler of pearlers) {
                if (msg === pearler.command) {
                    const { name, opts } = pearler;

                    const pearlerBot = new Pearler(opts, name);

                    pearlerBot.bot.on("login", () => {
                        this.taskisRunning = true;
                    })

                    pearlerBot.on("spawned", () => {
                        console.log(`${this.bot.username} Joined Successfully`)
                        pearlerBot.getUsersPearl(username);
                    })

                    pearlerBot.on("done", (success, baseName, botUsername) => {
                        this.taskisRunning = false;
                    })

                    pearlerBot.on("nopearl", async (username: string, pearlerName: string) => {
                        this.bot.chat(`/msg ${username} I don't see your pearl at ${pearlerName}?`)
                        await sleep(1000);
                        pearlerBot.quitBot(false);
                    })

                    pearlerBot.on("pearlfound", (username: string, pearlName: string) => {
                        this.bot.chat(`/msg ${username} Hang on, ${username}!`)
                    })

                    break;
                }
            }
        })
    }

}