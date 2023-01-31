import { MdOutlineMic } from "react-icons/md";
import { runDetached } from "../extensions";
import { log } from "../logger";
import * as icons from '../types/icons';
import { KeyMapping } from "../types/key-mappings";
import { ServerAPI } from "decky-frontend-lib";

let dictateListening: boolean = false;
let server: ServerAPI | undefined = undefined;
export const keyCode = "SwitchKeys_Deckyboard_Dictate";

export function setServer(s: ServerAPI) { server = s; }

export function EndDictation() : void {
    dictateListening = false;
    runDetached(() => {
        var response = server?.callPluginMethod<any, boolean>("endDictation", {});
        log("endDictate", response);
    });
    KeyMapping.changeLabelByKeyCode(keyCode, <MdOutlineMic/>)
    //this.server?.toaster.toast({
    //    title: "Finished Listening.",
    //    body: "Dictation finished!"
    //});
}

export function StartDictation() : void {
    dictateListening = true;
    runDetached(() => {
        var response = server?.callPluginMethod<any, boolean>("startDictation", {});
        log("startDictation", response)
    });
    KeyMapping.changeLabelByKeyCode(keyCode, <icons.ActiveIcon/>)
    //this.server?.toaster.toast({
    //    title: "Listening...",
    //    body: "Dictation started!"
    //});
}

export function OnAction()
{
    if (!dictateListening) StartDictation();
    else EndDictation();
}
