import { beforePatch } from "decky-frontend-lib";
import { FaMicrophone } from "react-icons/fa";
import { log } from "./logger";
import { PluginSettings } from './types/plugin-settings';
import { DictationKey } from './behaviors/dictation-key';
import { KeyDefinition, KeyMapping, KeyType, KeyEntry } from './types/key-mappings';
import { ServerAPI } from "decky-frontend-lib";
import * as style from './style';
import { CustomKeyBehavior } from "./behaviors/custom-key-behavior";

import { MoveKey } from "./behaviors/move-key";

var server: ServerAPI | undefined = undefined;
var settings: PluginSettings | undefined = undefined;


const CustomKeyBehavior_Alt: CustomKeyBehavior = new CustomKeyBehavior('Alt', true);
const CustomKeyBehavior_Control: CustomKeyBehavior = new CustomKeyBehavior('Control', true);
const CustomKeyBehavior_Escape: CustomKeyBehavior = new CustomKeyBehavior('Escape', true);
const CustomKeyBehavior_Move: CustomKeyBehavior = new CustomKeyBehavior('VKMove', true);
const CustomKeyBehavior_Dictation: DictationKey = new DictationKey();

const KeyMappings: Map<string, KeyMapping> = new Map<string, KeyMapping>([
    [CustomKeyBehavior_Dictation.keyCode,   new KeyMapping(1,   4, KeyDefinition.fromCustom({ key: CustomKeyBehavior_Dictation.keyCode, label: <FaMicrophone />, type: 4 }))],
    [CustomKeyBehavior_Control.keyCode,     new KeyMapping(0,   4, KeyDefinition.fromCustom({ key: CustomKeyBehavior_Control.keyCode, label: "#Key_Control", type: 3 }))],
    [CustomKeyBehavior_Alt.keyCode,         new KeyMapping(0,   4, KeyDefinition.fromCustom({ key: CustomKeyBehavior_Alt.keyCode, label: "#Key_Alt", type: 3 }))],
    [CustomKeyBehavior_Escape.keyCode,      new KeyMapping(0,   0, KeyDefinition.fromCustom({ key: CustomKeyBehavior_Escape.keyCode, label: "#Key_Escape", type: 3 }))],
    [CustomKeyBehavior_Move.keyCode,        new KeyMapping(-1,  4, KeyDefinition.fromCustom({ key: CustomKeyBehavior_Move.keyCode, label: '#Key_Move', type: 4 }))],
]);


export function setServer(s: ServerAPI)
{
    server = s;
    CustomKeyBehavior_Dictation.setServer(s);
}

export function setSettings(s: PluginSettings)
{
    settings = s;
}

export function Init(instance: any)
{
    KeyMapping.KeyboardRoot = instance.return;
    UpdateLayout();
    setTimeout(style.Init, 10);
    beforePatch(KeyMapping.KeyboardRoot.stateNode, 'TypeKeyInternal', (e: any[]) =>
    {
        //log("stateNode", NewKeyMapping.KeyboardRoot.stateNode);
        OnType(e);
        return KeyMapping.KeyboardRoot.stateNode;
    });
    return;
}

function UpdateLayout()
{
    KeyMapping.prepareKeyboardRoot();
    MoveKey.LoadOrientation();
    MoveKey.FixVKClose();

    if (settings?.DictationEnabled) KeyMapping.insertKeyboardKey(KeyMappings.get(CustomKeyBehavior_Dictation.keyCode));
    if (settings?.EnableAltKey) KeyMapping.insertKeyboardKey(KeyMappings.get(CustomKeyBehavior_Alt.keyCode));
    if (settings?.EnableCtrlKey) KeyMapping.insertKeyboardKey(KeyMappings.get(CustomKeyBehavior_Control.keyCode));
    if (settings?.EnableEscKey) KeyMapping.insertKeyboardKey(KeyMappings.get(CustomKeyBehavior_Escape.keyCode));

}

function OnType(e: any[])
{
    const key = e[0];
    log("key", key);

    if (key.strKey == MoveKey.MoveKeyCode)
        MoveKey.SaveOrientation();

    if (key.strKey == "SwitchKeys_Layout")
        setTimeout(UpdateLayout, 10);

    if (settings?.DictationEnabled && key.strKey == CustomKeyBehavior_Dictation.keyCode)
        CustomKeyBehavior_Dictation.OnAction();
}

