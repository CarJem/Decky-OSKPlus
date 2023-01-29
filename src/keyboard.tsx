import { beforePatch, findInReactTree, findModuleChild, Patch } from "decky-frontend-lib";
import { FaMicrophone } from "react-icons/fa";
import { log } from "./logger";
import { PluginSettings } from './types/plugin-settings';
import { DictationKey } from './behaviors/dictation-key';
import { KeyDefinition, KeyMapping } from './types/key-mappings';
import { ServerAPI } from "decky-frontend-lib";
import * as style from './style';
import { CustomKeyBehavior } from "./behaviors/custom-key-behavior";
import { KeyRepeat } from "./behaviors/key-repeat";
import { DismissOnEnter } from "./behaviors/dismiss-on-enter";

import { MoveKey } from "./behaviors/move-key";

var server: ServerAPI | undefined = undefined;
var settings: PluginSettings | undefined = undefined;

var KeyboardOpenedCallback: any;
var HandleVirtualKeyDownPatch: Patch;
var HandleVirtualKeyUpPatch: Patch;

const VirtualKeyboardManager = findModuleChild((m) => {
	if (typeof m !== "object") return undefined;
	for (let prop in m) {
		if (m[prop]?.m_WindowStore) 
			return m[prop].ActiveWindowInstance.VirtualKeyboardManager;
	}
});

const KeyboardInstance = () => { return findInReactTree(
    (document.getElementById('root') as any)._reactRootContainer._internalRoot.current, 
    ((x) => x?.memoizedProps?.className?.startsWith('virtualkeyboard_Keyboard'))
)};

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



function UpdateLayout()
{
    KeyMapping.prepareKeyboardRoot();
    MoveKey.FixVKClose();
    MoveKey.LoadOrientation();
    DismissOnEnter.ChangeState(settings?.DismissOnEnter);

    if (settings?.DictationEnabled) KeyMapping.insertKeyboardKey(KeyMappings.get(CustomKeyBehavior_Dictation.keyCode));
    if (settings?.EnableAltKey) KeyMapping.insertKeyboardKey(KeyMappings.get(CustomKeyBehavior_Alt.keyCode));
    if (settings?.EnableCtrlKey) KeyMapping.insertKeyboardKey(KeyMappings.get(CustomKeyBehavior_Control.keyCode));
    if (settings?.EnableEscKey) KeyMapping.insertKeyboardKey(KeyMappings.get(CustomKeyBehavior_Escape.keyCode));

}

function TypeKeyInternal(e: any[])
{
    //log("stateNode", NewKeyMapping.KeyboardRoot.stateNode);

    const key = e[0];
    log("TypeKeyInternal", e);

    if (key.strKey == MoveKey.MoveKeyCode)
        setTimeout(MoveKey.SaveOrientation, 150);

    if (KeyRepeat.IsRepeatable(key.strKey) && key.strKeycode !== KeyRepeat.RepeatableKeyCode)
        KeyRepeat.Trigger(key.strKey);
        
    if (key.strKey == "SwitchKeys_Layout")
        setTimeout(UpdateLayout, 10);

    if (settings?.DictationEnabled && key.strKey == CustomKeyBehavior_Dictation.keyCode)
        CustomKeyBehavior_Dictation.OnAction();
 
    //return KeyMapping.KeyboardRoot.stateNode;
    return e;
}

function HandleVirtualKeyDown(e: any[]) {
    //log("HandleVirtualKeyDown", e);
    return e;
}

function HandleVirtualKeyUp(e: any[]) {
    //log("HandleVirtualKeyUp", e);
    return e;
}

function TypeKey(e: any[]) {
    log("TypeKey", e);
    return e;
}

function InjectPlugin() {

    let instance = KeyboardInstance();
    log("keyboardInstance", instance);
    if (instance) {
        KeyMapping.KeyboardRoot = instance.return;
        setTimeout(style.Init, 10);
        beforePatch(KeyMapping.KeyboardRoot.stateNode, 'TypeKeyInternal', TypeKeyInternal);
        beforePatch(KeyMapping.KeyboardRoot.stateNode, 'TypeKey', TypeKey);
        UpdateLayout();
    }
}

function OnVisibilityChanged(e: boolean) {
    log("isOpened", e);
    if (!e) {
        CustomKeyBehavior_Dictation.EndDictation();
        return;
    }
    setTimeout(InjectPlugin, 10);
}


export function OnMount(_server: ServerAPI, _settings: PluginSettings)
{
    settings = _settings;
    server = _server;

    KeyboardOpenedCallback = VirtualKeyboardManager.m_bIsVirtualKeyboardOpen.m_callbacks.Register(OnVisibilityChanged);
    HandleVirtualKeyDownPatch = beforePatch(VirtualKeyboardManager, 'HandleVirtualKeyDown', HandleVirtualKeyDown);
    HandleVirtualKeyUpPatch = beforePatch(VirtualKeyboardManager, 'HandleVirtualKeyUp', HandleVirtualKeyUp);
    CustomKeyBehavior_Dictation.setServer(_server);
}

export function OnDismount()
{
    KeyboardOpenedCallback?.Unregister();
    HandleVirtualKeyDownPatch?.unpatch();
    HandleVirtualKeyUpPatch?.unpatch();
}

