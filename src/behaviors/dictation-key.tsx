import { FaMicrophone } from "react-icons/fa";
import { log } from "../logger";
import * as icons from '../types/icons';
import { KeyMapping } from "../types/key-mappings";
import { CustomKeyBehavior } from "./custom-key-behavior";

export class DictationKey extends CustomKeyBehavior {

    dictateListening: boolean = false;

    constructor() {
        super('Dicate');
    }

    public override OnAction(): void
    {
        if (!this.dictateListening)
        {
            this.dictateListening = true;
            var response = this.server?.callPluginMethod<any, boolean>("startDictation", {});
            log("startDictation", response)
    
            // serverApi.fetchNoCors('http://localhost:9000/hooks/start-dictate')
            //   .then((data) => console.log(data));
            KeyMapping.changeLabelByKeyCode(this.keyCode, <icons.ActiveIcon/>)
            //this.server?.toaster.toast({
            //    title: "Listening...",
            //    body: "Dictation started!"
            //});
        } else
        {
            this.dictateListening = false;
            var response = this.server?.callPluginMethod<any, boolean>("endDictation", {});
            log("endDictate", response)
            // serverApi.fetchNoCors('http://localhost:9000/hooks/end-dictate')
            //   .then((data) => console.log(data));
            KeyMapping.changeLabelByKeyCode(this.keyCode, <FaMicrophone/>)
            //this.server?.toaster.toast({
            //    title: "Finished Listening.",
            //    body: "Dictation finished!"
            //});
        }
    }
}
