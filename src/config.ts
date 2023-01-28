import type { BotOptions } from "mineflayer";
import "dotenv/config";

class PearlerOptions implements BotOptions {
    host     = process.env.MC_HOST
    username = process.env.MC_PEARLER_USERNAME as string
    version  = process.env.VERSION
    port     = parseInt(process.env.MC_PORT as string)
    auth     = "microsoft" as "microsoft"
}

class MainBotOptions implements BotOptions {
    host     = process.env.MC_HOST
    username = process.env.MC_MAIN_USERNAME as string
    version  = process.env.VERSION
    port     = parseInt(process.env.MC_PORT as string)
    auth     = "microsoft" as "microsoft"
}

export { PearlerOptions, MainBotOptions }