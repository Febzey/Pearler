import type { Block } from "prismarine-block";
import mineflayer     from "mineflayer";
import { sleep }      from "./utils.js";
import PathFinder     from "mineflayer-pathfinder";
import MineflayerBot  from "./main.js";

const pathfinder   = PathFinder.pathfinder;
const Movements    = PathFinder.Movements;
const { GoalNear } = PathFinder.goals;


const trapDoorTypes = [
    "oak_trapdoor",
    "spruce_trapdoor",
    "birch_trapdoor",
    "jungle_trapdoor",
    "acacia_trapdoor",
    "dark_oak_trapdoor",
    "crimson_trapdoor",
    "warped_trapdoor",
]

const signTypes = [
    "oak_wall_sign",
    "spruce_wall_sign",
    "birch_wall_sign",
    "jungle_wall_sign",
    "acacia_wall_sign",
    "dark_oak_wall_sign",
    "crimson_wall_sign",
    "warped_wall_sign"
]

class Pearler extends MineflayerBot {
    /**
     * <Pearl Owner> { trapdoor: Block }
     */
   
    public pearlerName: string;
    public knownPearls: Map<string, { trapdoor: Block }> = new Map()
    private defaultMovements: any;

    constructor(options: mineflayer.BotOptions, pearlerName: string) {       
        super(options)

        this.pearlerName = pearlerName;

        this.start()
    }

    public start() {
        this.bot.loadPlugin(pathfinder);
        this.defaultMovements = new Movements(this.bot, this.bot.registry);
        this.defaultMovements.allowSprinting = false;

        this.bot.on("spawn", this.onSpawn.bind(this));
        this.bot.on('error', this.onError);
        return this.bot;
    }

    public quitBot() {
        this.bot.quit();
        this.bot.end();
        this.emit("done");
    }

    private async onSpawn(this: this) {
        await sleep(2000)
        this.getAllPearlsAndSignsInView()
        await sleep(1000)
        this.emit("spawned");
    }
    private onError(reason: Error) {
        console.log("error ", reason)
    }

    //look for sign and pearl;
    private async getAllPearlsAndSignsInView() {
        const wallSigns = await this.findBlocks(signTypes);
        const onlinePlayers = Object.keys(this.bot.players);

        for (const sign of wallSigns as any) {
            if (!sign) continue;

            const signText = sign.signText;
            if (!signText || !onlinePlayers.some(user => signText.includes(user))) continue;

            console.log("Found "+ signText.trim() +"'s sign");
            const signPos = sign.position;

            //we need to check for the trap door underneath, and a pearl.
            const onePosLower = signPos;
            onePosLower.y = onePosLower.y - 1;

            const trapdoor = this.bot.blockAt(onePosLower);
            if (!trapdoor || !trapDoorTypes.some(n => trapdoor.name !== n)) {
                console.log("Could not find trapdoor");
                this.emit("notrapdoor", this.pearlerName);
                this.quitBot();
                return;
            }

            this.knownPearls.set(signText.trim(), { trapdoor });
        }
    }

    private findBlocks(names: string[]) {
        return new Promise((resolve) => {
            const ids = names.map(name => this.bot.registry.blocksByName[name].id);
            const blocksPos = this.bot.findBlocks({ matching:ids,maxDistance:50,count:25 });
            const blocks = [];
            for (const pos of blocksPos) {
                let block = this.bot.blockAt(pos)
                blocks.push(block);
            }
            return resolve(blocks);
        })
    }


    /**
     * This is where the bot will attempt to activate the trap door.
     * @param username 
     * @returns 
     */
    public async getUsersPearl(username: string) {
        const userPearl = this.knownPearls.get(username);
        
        if (!userPearl) {
            this.emit("nopearl", username, this.pearlerName);
            this.quitBot();
            return;
        }

        this.emit("pearlfound", username, this.pearlerName);

        const trapdoor = userPearl.trapdoor;
        const canActivate = this.bot.canDigBlock(trapdoor);

        if (!canActivate) {
            return this.goToTrapDoor(trapdoor);
        } else {
            this.activateTrapDoor(trapdoor);
        }
    }

    private goToTrapDoor(trapdoor: Block) {
        this.bot.pathfinder.setMovements(this.defaultMovements);
        this.bot.pathfinder.setGoal(new GoalNear(trapdoor.position.x, trapdoor.position.y, trapdoor.position.z, 2));
        this.bot.on("goal_reached", async () => this.activateTrapDoor(trapdoor));
    }

    private async activateTrapDoor(block: Block) {
        await sleep(1000);
        await this.bot.activateBlock(block);
        await sleep(100);
        this.quitBot();
    }

}

export default Pearler;