import { ServerAPI } from "decky-frontend-lib";


export class CustomKey
{

    server: ServerAPI | undefined = undefined;
    keyCode: string;

    constructor(keyCode: string, excludePrefix: boolean = false)
    {
       if (!excludePrefix) this.keyCode = "SwitchKeys_Deckyboard_" + keyCode;
       else this.keyCode = keyCode;
    }
    public OnAction() { }
    setServer(s: ServerAPI) { this.server = s; }
}
