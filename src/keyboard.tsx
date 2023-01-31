import { afterPatch, beforePatch, findInReactTree, findModuleChild, Patch } from "decky-frontend-lib";
import { MdOutlineMic } from "react-icons/md";
import { log } from "./logger";
import { PluginSettings } from './types/plugin-settings';
import * as DictationKey from './behaviors/dictation-key';
import { KeyDefinition, KeyMapping } from './types/key-mappings';
import { ServerAPI } from "decky-frontend-lib";
import * as style from './style';
import { KeyRepeat } from "./behaviors/key-repeat";
import * as DeckyExtendedLayout from './layouts/decky-extended';

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

const CustomKey_Dictation = new KeyMapping(1,   4, KeyDefinition.fromCustom({ key: DictationKey.keyCode, label: <MdOutlineMic />, type: 4 }));


function LoadDeckyExtendedLayout() {
    let custom_keyboard = DeckyExtendedLayout.GenerateLayout();
    KeyMapping.setKeyboardLayout(custom_keyboard);
}

function LoadNormalLayout() {
    KeyMapping.insertKeyboardKey(CustomKey_Dictation);
}

function UpdateLayout()
{
    KeyMapping.prepareKeyboardRoot();
    MoveKey.FixVKClose();
    MoveKey.Load();
    DismissOnEnter.ChangeState(settings?.behavior.dismissOnEnter);

    let layout_name = KeyMapping.KeyboardRoot.stateNode.state.standardLayout.name;
    if (layout_name === settings?.custom_layout.override_layout_name && settings?.custom_layout.enabled)         
        LoadDeckyExtendedLayout();
    else
        LoadNormalLayout();
}

function OnTypeKeyInternal(e: any[])
{
    const key = e[0];

    if (settings?.logging.internalKeyType) 
        log("OnTypeKeyInternal", e);

    if (KeyRepeat.IsRepeatable(key.strKey) && key.strKeycode !== KeyRepeat.RepeatableKeyCode && settings?.behavior.allowKeyRepeat)
        KeyRepeat.Trigger(key.strKey);

    if (settings?.dictation.enabled && key.strKey == DictationKey.keyCode)
        DictationKey.OnAction();
 
    return e;
}

function AfterTypeKeyInternal(e: any[])
{
    const key = e[0];

    if (settings?.logging.internalKeyType) 
        log("AfterTypeKeyInternal", e);

    if (key.strKey == "SwitchKeys_Layout")
        setTimeout(UpdateLayout, 0);

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
    DictationKey.EndDictation();
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
    DictationKey.setServer(_server);
}

export function OnDismount()
{
    KeyboardOpenedCallback?.Unregister();
    HandleVirtualKeyDownPatch?.unpatch();
    HandleVirtualKeyUpPatch?.unpatch();
}

