import { MdOutlineMic } from "react-icons/md";
import { runDetached } from "../extensions";
import { log } from "../logger";
import * as icons from '../types/icons';
import { KeyDefinition } from "../types/key-mapping/KeyDefinition";
import { KeyMapping } from '../types/key-mapping/KeyMapping';
import { DeckySendMode } from "../types/decky-keys/DeckySendMode";
import { ServerAPI } from "decky-frontend-lib";

let dictateListening: boolean = false;
let server: ServerAPI | undefined = undefined;
export const KEY_CODE = "Deckyboard_Dictate";

export function setServer(s: ServerAPI) { server = s; }

export function endDictation() : void {
    dictateListening = false;
    runDetached(() => {
        var response = server?.callPluginMethod<any, boolean>("endDictation", {});
        log("endDictate", response);
    });
    KeyMapping.changeLabelByKeyCode(KEY_CODE, <MdOutlineMic/>)
    //this.server?.toaster.toast({
    //    title: "Finished Listening.",
    //    body: "Dictation finished!"
    //});
}

export function startDictation() : void {
    dictateListening = true;
    runDetached(() => {
        var response = server?.callPluginMethod<any, boolean>("startDictation", {});
        log("startDictation", response)
    });
    KeyMapping.changeLabelByKeyCode(KEY_CODE, <icons.ActiveIcon/>)
    //this.server?.toaster.toast({
    //    title: "Listening...",
    //    body: "Dictation started!"
    //});
}

export function onAction(mode: DeckySendMode)
{
    if (!dictateListening) startDictation();
    else endDictation();
}

export function injectKey()
{
    KeyMapping.insertKeyboardKey(new KeyMapping(1,   4, KeyDefinition.fromCustom({ key: KEY_CODE, label: <MdOutlineMic />, type: 4 }), 0));
}

