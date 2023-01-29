import { afterPatch, beforePatch, findInReactTree, findModuleChild, Patch } from "decky-frontend-lib";
import { FaMicrophone } from "react-icons/fa";
import { log } from "./logger";
import { PluginSettings } from './types/plugin-settings';
import { DictationKey } from './behaviors/dictation-key';
import { KeyDefinition, KeyMapping } from './types/key-mappings';
import { ServerAPI } from "decky-frontend-lib";
import * as style from './style';
import { CustomKeyBehavior } from "./behaviors/custom-key-behavior";
import { KeyRepeat } from "./behaviors/key-repeat";
import * as CustomKeyboard from './custom-keyboard';

import * as MoveKey from "./behaviors/move-key";
import { runDetached, waitforCondition } from "./extensions";
import { DismissOnEnter } from "./behaviors/dismiss-on-enter";

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

const CustomKeyBehavior_Dictation: DictationKey = new DictationKey();
const CustomKey_Dictation = new KeyMapping(1,   4, KeyDefinition.fromCustom({ key: CustomKeyBehavior_Dictation.keyCode, label: <FaMicrophone />, type: 4 }));
const DeckyCustom_OverrideLayoutName = "qwerty_int";


function LoadCustomLayout() {
    let custom_keyboard = CustomKeyboard.GenerateDeckyExtendedLayout();
    KeyMapping.KeyboardRoot.stateNode.state.standardLayout.rgLayout = [[],[],[],[],[]];
    custom_keyboard.forEach((mapping) => {
        KeyMapping.insertKeyboardKey(mapping)
    });
}

function LoadNormalLayout() {
    KeyMapping.insertKeyboardKey(CustomKey_Dictation);
}

function UpdateLayout()
{
    KeyMapping.prepareKeyboardRoot();
    MoveKey.FixVKClose();
    MoveKey.Load();
    DismissOnEnter.ChangeState(settings?.DismissOnEnter);

    let layout_name = KeyMapping.KeyboardRoot.stateNode.state.standardLayout.name;
    if (layout_name === DeckyCustom_OverrideLayoutName)         
        LoadCustomLayout();
    else
        LoadNormalLayout();
}

function OnTypeKeyInternal(e: any[])
{
    const key = e[0];

    if (settings?.logging.internalKeyType) 
        log("OnTypeKeyInternal", e);

    if (KeyRepeat.IsRepeatable(key.strKey) && key.strKeycode !== KeyRepeat.RepeatableKeyCode)
        KeyRepeat.Trigger(key.strKey);

    if (settings?.DictationEnabled && key.strKey == CustomKeyBehavior_Dictation.keyCode)
        CustomKeyBehavior_Dictation.OnAction();
 
    return e;
}

function AfterTypeKeyInternal(e: any[])
{
    const key = e[0];

    if (settings?.logging.internalKeyType) 
        log("AfterTypeKeyInternal", e);

    if (key.strKey == "SwitchKeys_Layout")
        setTimeout(UpdateLayout, 500);

    MoveKey.Save();
 
    return e;
}

function OnHandleVirtualKeyDown(e: any[]) {
    if (settings?.logging.virtualKeys) log("HandleVirtualKeyDown", e);
    return e;
}

function OnHandleVirtualKeyUp(e: any[]) {
    if (settings?.logging.virtualKeys) log("HandleVirtualKeyUp", e);
    return e;
}

function OnTypeKey(e: any[]) {
    if (settings?.logging.keyType) log("OnTypeKey", e);
    return e;
}

function OnPatch() {
    let instance = waitforCondition(() => KeyboardInstance());
    if (settings?.logging.init) log("keyboardInstance", instance);
    if (!instance) return;

    KeyMapping.KeyboardRoot = instance.return;
    beforePatch(KeyMapping.KeyboardRoot.stateNode, 'TypeKeyInternal', OnTypeKeyInternal);
    afterPatch(KeyMapping.KeyboardRoot.stateNode, 'TypeKeyInternal', AfterTypeKeyInternal);
    beforePatch(KeyMapping.KeyboardRoot.stateNode, 'TypeKey', OnTypeKey);
    style.Init();
    UpdateLayout();
}

function OnOpened() {
    runDetached(OnPatch);
}

function OnClosed() {
    CustomKeyBehavior_Dictation.EndDictation();
}

function OnVisibilityChanged(isOpen: boolean) {
    log("isOpen", isOpen);
    if (isOpen) OnOpened();
    else OnClosed();
}

export function OnMount(_server: ServerAPI, _settings: PluginSettings)
{
    settings = _settings;
    server = _server;

    KeyboardOpenedCallback = VirtualKeyboardManager.m_bIsVirtualKeyboardOpen.m_callbacks.Register(OnVisibilityChanged);
    HandleVirtualKeyDownPatch = beforePatch(VirtualKeyboardManager, 'HandleVirtualKeyDown', OnHandleVirtualKeyDown);
    HandleVirtualKeyUpPatch = beforePatch(VirtualKeyboardManager, 'HandleVirtualKeyUp', OnHandleVirtualKeyUp);
    CustomKeyBehavior_Dictation.setServer(_server);
}

export function OnDismount()
{
    KeyboardOpenedCallback?.Unregister();
    HandleVirtualKeyDownPatch?.unpatch();
    HandleVirtualKeyUpPatch?.unpatch();
}

