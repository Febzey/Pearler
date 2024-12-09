import Pearler from "./pearler.js";
import MineflayerBot from "./main.js";
import { IBotOptions } from "./config.js";
import { sleep } from "./utils.js";
import { readFile, writeFile } from "fs/promises";

interface PearlerParams {
    command: string,
    name: string,
    opts: IBotOptions
}

export default class WatcherBot extends MineflayerBot {
    private taskisRunning: boolean = false;

    public whitelist: string[] = [];

    constructor(options: IBotOptions, pearlers: PearlerParams[]) {
        super(options);

        this.bot.once("spawn", () => {
            this.bot.addChatPattern("chat", new RegExp("^(?:[^ ]* )?([^ ]+)(?: [^ ]*)? » (.*)"), { parse: true, repeat: true })

            this.bot.addChatPattern("chat", new RegExp("^(?:\\[.*?\\] )?([^ ]*) » (.*)$"), { parse: true, repeat: true })
            this.bot.addChatPattern("chat", new RegExp("^(?:\\[.*?\\] )?<([^ ]*)> (.*)$"), { parse: true, repeat: true })
            this.loadWhiteList();
        });

        this.bot.on("end", async () => {
            console.log("Bot has ended.")
            await sleep(45000);
            process.exit(0);
        })

        //@ts-ignore
        this.bot.on("messagestr", async (...args) => {

            const thereMayBeUUID = args[3 as any];

            let msg = "";
            let username = "";

            for (const player of Object.values(this.bot.players)) {
                if (thereMayBeUUID && player.uuid === thereMayBeUUID) {

                    msg = args[0];
                    username = player.username;
                    break;
                }
            }

            console.log(msg, ": ", username);

            if (username === this.bot.username) return;
            if (username === "Febzey_" || username === "Furia") {
                const msgArr = msg.split(" ");
                console.log(msgArr)
                if (msgArr[0] === "!wl") {
                    // get the second argument in the msg
                    await this.addWhiteList(msgArr[1]);
                    this.bot.chat(`/msg ${msgArr[1]} You're on the whitelist now!`);
                    return;
                }
            }

            if (!this.whitelist.includes(username)) return;

            if (this.taskisRunning) return;

            for (const pearler of pearlers) {
                if (msg?.includes(pearler.command)) {
                    const { name, opts } = pearler;

                    const pearlerBot = new Pearler(opts, name, username);

                    pearlerBot.bot.on("login", () => {
                        this.taskisRunning = true;
                    })

                    pearlerBot.on("spawned", () => {
                        console.log(`${this.bot.username} Joined Successfully`)
                        pearlerBot.getUsersPearl(username);
                    })

                    pearlerBot.on("done", (success, baseName, botUsername, pearledUser) => {
                        this.taskisRunning = false;
                        if (success) {
                            this.bot.chat(`/msg ${username} Welcome to ${baseName}, ${pearledUser}!`);
                        }
                    })

                    pearlerBot.on("nopearl", async (username: string, pearlerName: string) => {
                        this.bot.chat(`/msg ${username} Pearl not found at ${pearlerName}.`)
                        await sleep(1000);
                        pearlerBot.emit("done", false, pearlerName, this.bot.username, username);
                    })

                    pearlerBot.on("pearlfound", (username: string, pearlName: string) => {
                        this.bot.chat(`/msg ${username} You're going to ${pearlName}...`)
                    })

                    break;
                }
            }
        })
    }


    public async loadWhiteList() {
        const file = await readFile("./json/whitelist.json", "utf-8");
        const whitelist = JSON.parse(file);
        this.whitelist = whitelist;
        return;
    }

    public async addWhiteList(username: string) {
        this.whitelist.push(username);
        await this.saveWhiteList();
        await this.loadWhiteList();
    }

    private async saveWhiteList() {
        await writeFile("./json/whitelist.json", JSON.stringify(this.whitelist));
    }

}