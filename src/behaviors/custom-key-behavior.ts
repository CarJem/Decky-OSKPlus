import { ServerAPI } from "decky-frontend-lib";
import { CustomKeyPrefix } from "../types/key-mappings";


export class CustomKeyBehavior
{

    server: ServerAPI | undefined = undefined;
    keyCode: string;

    constructor(keyCode: string, excludePrefix: boolean = false)
    {
       if (!excludePrefix) this.keyCode = CustomKeyPrefix + keyCode;
       else this.keyCode = keyCode;
    }
    public OnAction() { }
    setServer(s: ServerAPI) { this.server = s; }
}