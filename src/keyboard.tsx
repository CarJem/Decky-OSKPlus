import { afterPatch, beforePatch, findInReactTree, findModuleChild, Patch } from "decky-frontend-lib";
import { MdOutlineMic } from "react-icons/md";
import { log } from "./logger";
import { PluginSettings } from './types/plugin-settings';
import { KeyDefinition, KeyMapping } from './types/key-mappings';
import { ServerAPI } from "decky-frontend-lib";
import * as Style from './style';
import { KeyRepeat } from "./behaviors/key-repeat";
import * as DeckyExtendedLayout from './layouts/decky-extended';
import * as DeckyKeys from './behaviors/decky-keys';
import * as DictationKey from './behaviors/dictation-key';

import * as MoveKey from "./behaviors/move-key";
import { runDetached, waitforCondition } from "./extensions";
import { DismissOnEnter } from "./behaviors/dismiss-on-enter";

var server: ServerAPI | undefined = undefined;
var settings: PluginSettings | undefined = undefined;
var SendText_Original: any;

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

function UpdateLayout()
{
    Style.Init();
    KeyMapping.Init();
    MoveKey.Init();
    DismissOnEnter.ChangeState(settings?.behavior.dismissOnEnter);

    let layout_name = KeyMapping.KeyboardRoot.stateNode.state.standardLayout.name;
    if (layout_name === settings?.custom_layout.override_layout_name && settings?.custom_layout.enabled) {
        KeyMapping.setKeyboardLayout(DeckyExtendedLayout.GenerateLayout());
    }
    else {
        if (settings?.dictation.enabled)
            KeyMapping.insertKeyboardKey(new KeyMapping(1,   4, KeyDefinition.fromCustom({ key: DictationKey.keyCode, label: <MdOutlineMic />, type: 4 }), 0));
    }

    DeckyKeys.SyncToggleStates();
}

function OnTypeKeyInternal(e: any[])
{
    const key = e[0];

    if (settings?.logging.internalKeyType) 
        log("OnTypeKeyInternal", e);

    if (KeyRepeat.IsRepeatable(key.strKey) && key.strKeycode !== KeyRepeat.RepeatableKeyCode && settings?.behavior.allowKeyRepeat)
        KeyRepeat.Trigger(key.strKey);

    return e;
}

function AfterTypeKeyInternal(e: any[])
{
    const key = e[0];

    MoveKey.Save();

    if (settings?.logging.afterInternalKeyType) 
        log("AfterTypeKeyInternal", e);

    if (key.strKey == "SwitchKeys_Layout")
        runDetached(UpdateLayout);

    if (DeckyKeys.IsShiftKey(key.strKey)) {
        DeckyKeys.SendShiftKeys(key.strKey);
        return [];
    }

    if (DeckyKeys.IsModifierActive() && key.strKeycode != null) {
        DeckyKeys.SendKeys(key.strKeycode);
    }

    return e;
}

function SendKeys(keyString: string) 
{
    if (keyString.length === 0) return;

    if (DeckyKeys.IsCustomKey(keyString)) DeckyKeys.SendKeys(keyString);
    else if (!DeckyKeys.IsModifierActive()) SendText_Original.call(SteamClient.Input, keyString);
}

function OnPatch() {
    let instance = waitforCondition(() => KeyboardInstance());
    if (settings?.logging.init) log("keyboardInstance", instance);
    if (!instance) return;

    KeyMapping.KeyboardRoot = instance.return;
    beforePatch(KeyMapping.KeyboardRoot.stateNode, 'TypeKeyInternal', OnTypeKeyInternal);
    afterPatch(KeyMapping.KeyboardRoot.stateNode, 'TypeKeyInternal', AfterTypeKeyInternal);
    DeckyKeys.InitKeys();
    UpdateLayout();
}

function OnOpened() {
    runDetached(OnPatch);
}

function OnClosed() {
    DictationKey.EndDictation();
    DeckyKeys.ResetToggleStates();
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

    SendText_Original = SteamClient.Input.ControllerKeyboardSendText;
    SteamClient.Input.ControllerKeyboardSendText = SendKeys;
    KeyboardOpenedCallback = VirtualKeyboardManager.m_bIsVirtualKeyboardOpen.m_callbacks.Register(OnVisibilityChanged);
    DictationKey.setServer(_server);
    DeckyKeys.setServer(_server);
}

export function OnDismount()
{
    SteamClient.Input.ControllerKeyboardSendText = SendText_Original;
    KeyboardOpenedCallback?.Unregister();
    HandleVirtualKeyDownPatch?.unpatch();
    HandleVirtualKeyUpPatch?.unpatch();
}

