import { beforePatch } from "decky-frontend-lib";
import React, { VFC } from "react";
import { FaShip, FaMicrophone, FaArrowsAltV } from "react-icons/fa";
import { log } from "./logger";
import * as python from './python';
import * as icons from './icons';
import { Settings } from './types/settings';

var dictateListening = false;
var KeyboardRoot: any;
var isTopsided = false;

import { ServerAPI } from "decky-frontend-lib";

var server: ServerAPI | undefined = undefined;
var settings: Settings | undefined = undefined;

export function setServer(s: ServerAPI) {
  server = s;
}

export function setSettings(s: Settings) {
    settings = s;
}

export function PatchKeys(instance: any) {
    KeyboardRoot = instance.return;
    UpdateKeyPlacement();
    beforePatch(KeyboardRoot.stateNode, 'TypeKeyInternal', (e: any[]) =>
    {
        log("stateNode", KeyboardRoot.stateNode)
        OnType(e);
        return KeyboardRoot.stateNode;
    });
    return;
}

function RemoveKey(rN: number, value: any) {
    var i = 0;
    while (i < KeyboardRoot.stateNode.state.standardLayout.rgLayout[rN].length) {
      if (KeyboardRoot.stateNode.state.standardLayout.rgLayout[rN][i].key === value) {
        KeyboardRoot.stateNode.state.standardLayout.rgLayout[rN].splice(i, 1);
      } else {
        ++i;
      }
    }
}

function AddKey(rN: number, value: any) {
    KeyboardRoot.stateNode.state.standardLayout.rgLayout[rN].unshift(value);
}

function UpdateKeyPlacement() {

    //log("keys", KeyboardRoot)
    log("keys", KeyboardRoot.stateNode.state.standardLayout.rgLayout);

    var dictateKey = { key: "SwitchKeys_Dicate", label: <FaMicrophone />, type: 4 };
    var ctrlKey = { key: "Control", label: "#Key_Control", type: 5 };
    var orientationKey = { key: "SwitchKeys_Orientation", label: <FaArrowsAltV />, type: 4 };
    var f1Key = {key: "", label: "#KeyboardKey_F1",  type: 5};
    var escKey = { key: "Escape", label: "#Key_Escape", type: 5 };

    RemoveKey(4, dictateKey.key);
    if (settings?.DictationEnabled) AddKey(4, dictateKey);

    RemoveKey(4, ctrlKey.key);
    if (settings?.EnableCtrlKey) AddKey(4, ctrlKey);

    RemoveKey(4, orientationKey.key);
    if (settings?.EnableOrientationSwapKey) AddKey(4, orientationKey);

    RemoveKey(0, f1Key.key);
    if (settings?.EnableFunctionKeys) AddKey(0, f1Key);

    RemoveKey(0, escKey.key);
    if (settings?.EnableFunctionKeys) AddKey(0, escKey);

}

function OnType(e: any[]) {

    const key = e[0];
    log("key", key);

    //if (key.strKey == "SwitchKeys_")
    //{
    //    server?.fetchNoCors('http://localhost:9000/hooks/ydotool?key=41')
    //        .then((data) => console.log(data));
    //}

    if (key.strKey == "SwitchKeys_Orientation") OnOrientationKey();
    if (settings?.DictationEnabled && key.strKey == "SwitchKeys_Dicate") OnDictateKey();
}

function OnOrientationKey() {
        
}

function OnDictateKey() {
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