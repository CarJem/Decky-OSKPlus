import { BiMicrophone } from "react-icons/bi";
import { runDetached } from "../extensions";
import { log } from "../logger";
import * as icons from '../types/icons';
import { KeyMapping } from "../types/key-mappings";
import { CustomKeyBehavior } from "./custom-key-behavior";

export class DictationKey extends CustomKeyBehavior {

    dictateListening: boolean = false;

    constructor() {
        super('Dicate');
    }

    public EndDictation() : void {
        this.dictateListening = false;
        runDetached(() => {
            var response = this.server?.callPluginMethod<any, boolean>("endDictation", {});
            log("endDictate", response);
        });
        KeyMapping.changeLabelByKeyCode(this.keyCode, <BiMicrophone/>)
        //this.server?.toaster.toast({
        //    title: "Finished Listening.",
        //    body: "Dictation finished!"
        //});
    }

    public StartDictation() : void {
        this.dictateListening = true;
        runDetached(() => {
            var response = this.server?.callPluginMethod<any, boolean>("startDictation", {});
            log("startDictation", response)
        });
        KeyMapping.changeLabelByKeyCode(this.keyCode, <icons.ActiveIcon/>)
        //this.server?.toaster.toast({
        //    title: "Listening...",
        //    body: "Dictation started!"
        //});
    }

    public override OnAction(): void
    {
        if (!this.dictateListening) this.StartDictation();
        else this.EndDictation();
    }
}
