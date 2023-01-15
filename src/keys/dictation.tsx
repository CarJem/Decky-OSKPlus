import { beforePatch } from "decky-frontend-lib";
import { ServerAPI } from "decky-frontend-lib";
import React, { VFC } from "react";
import { FaMicrophone } from "react-icons/fa";
import { log } from "../logger";
import * as icons from '../types/icons';
import { ChangeKeyLabelById } from "../keyboard";

var dictateListening = false;
var server: ServerAPI | undefined = undefined;


export const KeyCode: string = "dictation_key";

export function setServer(s: ServerAPI) {
  server = s;
}

export function ToggleDictation() {
    if (!dictateListening)
    {
        dictateListening = true;
        var response = server?.callPluginMethod<any, boolean>("startDictation", {});
        log("startDictation", response)

        // serverApi.fetchNoCors('http://localhost:9000/hooks/start-dictate')
        //   .then((data) => console.log(data));
        ChangeKeyLabelById(KeyCode, <icons.ActiveIcon/>)
        server?.toaster.toast({
            title: "Listening...",
            body: "Dictation started!"
        });
    } else
    {
        dictateListening = false;
        var response = server?.callPluginMethod<any, boolean>("endDictation", {});
        log("endDictate", response)
        // serverApi.fetchNoCors('http://localhost:9000/hooks/end-dictate')
        //   .then((data) => console.log(data));
        ChangeKeyLabelById(KeyCode, <FaMicrophone/>)
        server?.toaster.toast({
            title: "Finished Listening.",
            body: "Dictation finished!"
        });
    }
}