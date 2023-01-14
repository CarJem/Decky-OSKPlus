import { beforePatch } from "decky-frontend-lib";
import { ServerAPI } from "decky-frontend-lib";
import React, { VFC } from "react";
import { FaMicrophone } from "react-icons/fa";
import { log } from "../logger";
import * as icons from '../icons';

var dictateListening = false;
var server: ServerAPI | undefined = undefined;

export function setServer(s: ServerAPI) {
  server = s;
}

export function ToggleDictation(KeyboardRoot: any) {
    if (!dictateListening)
    {
        dictateListening = true;
        var response = server?.callPluginMethod<any, boolean>("startDictation", {});
        log("startDictation", response)

        // serverApi.fetchNoCors('http://localhost:9000/hooks/start-dictate')
        //   .then((data) => console.log(data));
        KeyboardRoot.stateNode.state.standardLayout.rgLayout[4][1].label = <icons.ActiveIcon />;
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
        KeyboardRoot.stateNode.state.standardLayout.rgLayout[4][1].label = <FaMicrophone />;
        server?.toaster.toast({
            title: "Finished Listening.",
            body: "Dictation finished!"
        });
    }
}