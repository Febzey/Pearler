import mineflayer from "mineflayer";
import EventEmiiter from "events";

export default class MineflayerBot extends EventEmiiter {
    public bot: mineflayer.Bot;

    constructor(options: mineflayer.BotOptions) {
        super()
        this.bot = mineflayer.createBot(options);
    }

}