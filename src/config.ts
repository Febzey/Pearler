export class IBotOptions {
    host       = process.env.MC_HOST;
    username   = ""
    version    = process.env.VERSION as string
    port       = parseInt(process.env.MC_PORT as string)
    auth       = "microsoft" as "microsoft"
       
    logErrors?: boolean | undefined;
    respawn?: boolean;

    constructor(username: string) { 
        this.username = username;
    }
}   