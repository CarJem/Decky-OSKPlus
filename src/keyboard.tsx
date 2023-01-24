import { beforePatch } from "decky-frontend-lib";
import { FaMicrophone, FaArrowUp } from "react-icons/fa";
import { log } from "./logger";
import { PluginSettings } from './types/plugin-settings';
import { DictationKey } from './custom-keys/dictation-key';
import { OrientationKey } from './custom-keys/orientation-key';
import { CustomKeyPrefix, KeyMapping } from './types/key-mappings';
import { OSK_Key, OSK_KeyLayout } from "./types/osk-key";
import { ServerAPI } from "decky-frontend-lib";
import * as style from './style';
import * as KeyboardUtils from './utils/keyboard-utils';
import { CustomKey } from "./custom-keys/custom-key";

var server: ServerAPI | undefined = undefined;
var settings: PluginSettings | undefined = undefined;
var KeyboardRoot: any;


const CustomKey_Alt: CustomKey = new CustomKey('Alt', true);
const CustomKey_Control: CustomKey = new CustomKey('Control', true);
const CustomKey_Escape: CustomKey = new CustomKey('Escape', true);

const CustomKey_Dictation: DictationKey = new DictationKey();
const CustomKey_Orientation: OrientationKey = new OrientationKey();

const KeyMappings: Map<string, KeyMapping> = new Map<string, KeyMapping>([
    [CustomKey_Dictation.keyCode,   new KeyMapping(4,   0, { isCustom: true, key: CustomKey_Dictation.keyCode, label: <FaMicrophone />, type: 4 }, ' ')],
    [CustomKey_Control.keyCode,     new KeyMapping(4,   0, { isCustom: true, key: CustomKey_Control.keyCode, label: "#Key_Control", type: 3 }, 'SwitchKeys_Emoji')],
    [CustomKey_Alt.keyCode,         new KeyMapping(4,   0, { isCustom: true, key: CustomKey_Alt.keyCode, label: "#Key_Alt", type: 3 }, 'SwitchKeys_Layout')],
    [CustomKey_Escape.keyCode,      new KeyMapping(0,   0, { isCustom: true, key: CustomKey_Escape.keyCode, label: "#Key_Escape", type: 3 })],
    [CustomKey_Orientation.keyCode, new KeyMapping(4,  -1, { isCustom: true, key: CustomKey_Orientation.keyCode, label: <FaArrowUp />, type: 4 }, 'VKClose')],
]);


export function setServer(s: ServerAPI)
{
    server = s;
    CustomKey_Dictation.setServer(s);
    CustomKey_Orientation.setServer(s);
}

export function setSettings(s: PluginSettings)
{
    settings = s;
}

export function Init(instance: any)
{
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


function PrepareLayout()
{
    //log("layout", KeyboardRoot.stateNode.state.standardLayout);
    
    //log("beforeLayoutClone", KeyboardRoot.stateNode.state.standardLayout);
    //KeyboardRoot.stateNode.state.standardLayout = JSON.parse(JSON.stringify(KeyboardRoot.stateNode.state.standardLayout));
    //log("afterLayoutClone", KeyboardRoot.stateNode.state.standardLayout);

    var x = 0, y = 0;

    while (y < KeyboardRoot.stateNode.state.standardLayout.rgLayout.length) 
    {
        while (x < KeyboardRoot.stateNode.state.standardLayout.rgLayout[y].length)
        {
            if (KeyboardUtils.isCustomKey(KeyboardRoot.stateNode.state.standardLayout.rgLayout[y][x]))
                KeyboardRoot.stateNode.state.standardLayout.rgLayout[y].splice(x, 1);
            else
                ++x;
        }
        x = 0;
        ++y;
    }

}

function UpdateLayout()
{
    PrepareLayout();

    if (settings?.DictationEnabled) AddKey(KeyMappings.get(CustomKey_Dictation.keyCode));

    if (settings?.EnableAltKey) AddKey(KeyMappings.get(CustomKey_Alt.keyCode));
    if (settings?.EnableCtrlKey) AddKey(KeyMappings.get(CustomKey_Control.keyCode));
    if (settings?.EnableEscKey) AddKey(KeyMappings.get(CustomKey_Escape.keyCode));

    if (settings?.EnableOrientationSwapKey)
    {
        AddKey(KeyMappings.get(CustomKey_Orientation.keyCode));
        CustomKey_Orientation.Init();
    }
}

function OnType(e: any[])
{
    const key = e[0];
    log("key", key);

    //if (key.strKey == "SwitchKeys_")
    //{
    //    server?.fetchNoCors('http://localhost:9000/hooks/ydotool?key=41')
    //        .then((data) => console.log(data));
    //}

    if (key.strKey == CustomKey_Control)
        e[0] == 'Control';

    if (key.strKey == "SwitchKeys_Layout")
        setTimeout(UpdateLayout, 10);

    if (key.strKey == CustomKey_Orientation.keyCode)
        CustomKey_Orientation.OnAction();

    if (settings?.DictationEnabled && key.strKey == CustomKey_Dictation.keyCode)
        CustomKey_Dictation.OnAction()
}

function AddKey(value: KeyMapping | undefined)
{
    if (value)
    {
        let index = value.offset;
        if (value.target != null) {
            let targetIndex = KeyboardUtils.IndexOf(KeyboardRoot, value.row, value.target);
            if (targetIndex) index = targetIndex + value.offset;
        }
        
        KeyboardRoot.stateNode.state.standardLayout.rgLayout[value?.row].splice(index, 0, value?.definition);
    }
}

function RemoveKey(value: KeyMapping)
{
    var x = 0, y = 0;
    while (y < KeyboardRoot.stateNode.state.standardLayout.rgLayout.length) 
    {
        while (x < KeyboardRoot.stateNode.state.standardLayout.rgLayout[y].length)
        {
            if (KeyboardRoot.stateNode.state.standardLayout.rgLayout[y][x] === value.definition)
                KeyboardRoot.stateNode.state.standardLayout.rgLayout[y].splice(x, 1);
            else
                ++x;
        }
        x = 0;
        ++y;
    }
}

function ChangeKeyLabel(value: KeyMapping, label: any)
{
    var rN = value.row;
    for (let i = 0; i < KeyboardRoot.stateNode.state.standardLayout.rgLayout[rN].length; i++) 
    {
        if (KeyboardRoot.stateNode.state.standardLayout.rgLayout[rN][i].custom_id === value.definition)
        {
            KeyboardRoot.stateNode.state.standardLayout.rgLayout[rN][i].label = label;
        }
    }
}

export function ChangeKeyLabelById(value: string, label: any)
{
    let result = KeyMappings.get(value);
    if (result) ChangeKeyLabel(result, label);
}

