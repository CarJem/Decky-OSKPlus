import { beforePatch } from "decky-frontend-lib";
import { FaMicrophone, FaArrowUp } from "react-icons/fa";
import { log } from "./logger";
import { PluginSettings } from './types/settings';
import * as dictation from './keys/dictation';
import * as orientation from './keys/orientation';
import { KeyDefinition, KeyMapping } from './types/key-mappings';
import { ServerAPI } from "decky-frontend-lib";
import * as style from './style';

var server: ServerAPI | undefined = undefined;
var settings: PluginSettings | undefined = undefined;
var KeyboardRoot: any;

const KeyMappings: Map<string, KeyMapping> = new Map<string, KeyMapping>([
    [dictation.KeyCode,       { row: 4,  offset: 1,  definition: { key: "SwitchKeys_Dicate", label: <FaMicrophone />, type: 4 }}],
    ["alt_key",               { row: 4,  offset: 0,  definition: { key: "SwitchKeys_Alt", label: "#Key_Alt", type: 5 }}],
    ["ctrl_key",              { row: 4,  offset: 0,  definition: { key: "SwitchKeys_Control", label: "#Key_Control", type: 5 }}],
    ["esc_key",               { row: 0,  offset: 0,  definition: { key: "SwitchKeys_Escape", label: "#Key_Escape", type: 4 }}],
    [orientation.KeyCode,     { row: 4,  offset: -1, definition: { key: "SwitchKeys_Orientation", label: <FaArrowUp />, type: 4 }}],
  //["function_f1_key",       { row: 0,  offset: 0,  definition: { key: "", label: "#KeyboardKey_F1",  type: 5}}],
]);

export function setServer(s: ServerAPI) {
  server = s;
}

export function setSettings(s: PluginSettings) {
    settings = s;
}

export function Init(instance: any) {
    KeyboardRoot = instance.return;
    UpdateLayout();
    setTimeout(style.Init, 10);
    beforePatch(KeyboardRoot.stateNode, 'TypeKeyInternal', (e: any[]) =>
    {
        //log("stateNode", KeyboardRoot.stateNode);
        OnType(e);
        return KeyboardRoot.stateNode;
    });
    return;
}

function UpdateLayout() {
    //log("keys", KeyboardRoot)
    //log("keys", KeyboardRoot.stateNode.state.standardLayout.rgLayout);

    
    //log("beforeLayoutClone", KeyboardRoot.stateNode.state.standardLayout);
    //KeyboardRoot.stateNode.state.standardLayout = JSON.parse(JSON.stringify(KeyboardRoot.stateNode.state.standardLayout));
    //log("afterLayoutClone", KeyboardRoot.stateNode.state.standardLayout);


    KeyMappings.forEach(function (value) {
        RemoveKey(value)
    }); 

    if (settings?.DictationEnabled) AddKey(KeyMappings.get(dictation.KeyCode));

    if (settings?.EnableAltKey) AddKey(KeyMappings.get("alt_key"));
    if (settings?.EnableCtrlKey) AddKey(KeyMappings.get("ctrl_key"));
    if (settings?.EnableEscKey) AddKey(KeyMappings.get("esc_key"));

    if (settings?.EnableOrientationSwapKey) {
        AddKey(KeyMappings.get(orientation.KeyCode));
        orientation.Init();
    } 
    //if (settings?.EnableFunctionKeys) AddKey(KeyMappings.get("function_f1_key"));

}

function OnType(e: any[]) {
    const key = e[0];
    log("key", key);

    //if (key.strKey == "SwitchKeys_")
    //{
    //    server?.fetchNoCors('http://localhost:9000/hooks/ydotool?key=41')
    //        .then((data) => console.log(data));
    //}

    if (key.strKey == "SwitchKeys_Layout")
        setTimeout(UpdateLayout, 10);

    if (key.strKey == KeyMappings.get(orientation.KeyCode)?.definition.key) 
        orientation.OnOrientationKey();

    if (settings?.DictationEnabled && key.strKey == KeyMappings.get(dictation.KeyCode)?.definition.key) 
        dictation.ToggleDictation();
}

function AddKey(value: KeyMapping | undefined) {
    if (value) {
        let index = value.offset;
        KeyboardRoot.stateNode.state.standardLayout.rgLayout[value?.row].splice(index, 0 ,value?.definition);
    }
}

function RemoveKey(value: KeyMapping) {
    var i = 0;
    var rN = value.row;
    while (i < KeyboardRoot.stateNode.state.standardLayout.rgLayout[rN].length) {
      if (KeyboardRoot.stateNode.state.standardLayout.rgLayout[rN][i].key === value.definition.key) {
        KeyboardRoot.stateNode.state.standardLayout.rgLayout[rN].splice(i, 1);
      } else {
        ++i;
      }
    }
}

function ChangeKeyLabel(value: KeyMapping, label: any) {
    var rN = value.row;
    for (let i = 0; i < KeyboardRoot.stateNode.state.standardLayout.rgLayout[rN].length; i++) 
    {
      if (KeyboardRoot.stateNode.state.standardLayout.rgLayout[rN][i].key === value.definition.key)  {
          KeyboardRoot.stateNode.state.standardLayout.rgLayout[rN][i].label = label; 
      }
    }
}

export function ChangeKeyLabelById(value: string, label: any) {
    let result = KeyMappings.get(value);
    if (result) ChangeKeyLabel(result, label);
}

