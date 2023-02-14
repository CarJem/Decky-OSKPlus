import { afterPatch, beforePatch, findInReactTree, findModuleChild, Patch } from "decky-frontend-lib";
import { log } from "./logger";
import { PluginSettings } from './types/PluginSettings';
import { KeyMapping } from './types/key-mapping/KeyMapping';
import { ServerAPI } from "decky-frontend-lib";
import * as Style from './style';
import { KeyRepeat } from "./behaviors/KeyRepeating";
import * as DeckyExtendedLayout from './layouts/DeckyExtended';
import * as DeckyKeys from './behaviors/DeckyboardKeys';
import * as DictationKey from './behaviors/DictationKey';
import { runDetached, waitforCondition } from "./extensions";
import { DismissOnEnter } from "./behaviors/DismissOnEnter";

var settings: PluginSettings | undefined = undefined;
var sendTextPatchOriginal: any;
var keyboardOpenedPatchCallback: any;
var handleVirtualKeyDownPatch: Patch;
var handleVirtualKeyUpPatch: Patch;

const VIRTUAL_KEYBOARD_MANAGER = findModuleChild((m) => {
	if (typeof m !== "object") return undefined;
	for (let prop in m) {
		if (m[prop]?.m_WindowStore) 
			return m[prop].ActiveWindowInstance.VirtualKeyboardManager;
	}
});

const KEYBOARD_INSTANCE = () => { return findInReactTree(
    (document.getElementById('root') as any)._reactRootContainer._internalRoot.current, 
    ((x) => x?.memoizedProps?.className?.startsWith('virtualkeyboard_Keyboard'))
)};

export function onMount(_server: ServerAPI, _settings: PluginSettings)
{
    settings = _settings;

    sendTextPatchOriginal = SteamClient.Input.ControllerKeyboardSendText;
    SteamClient.Input.ControllerKeyboardSendText = sendKeys;
    keyboardOpenedPatchCallback = VIRTUAL_KEYBOARD_MANAGER.m_bIsVirtualKeyboardOpen.m_callbacks.Register(onVisibilityChanged);
    DictationKey.setServer(_server);
    DeckyKeys.setServer(_server);
}

export function onDismount()
{
    SteamClient.Input.ControllerKeyboardSendText = sendTextPatchOriginal;
    keyboardOpenedPatchCallback?.Unregister();
    handleVirtualKeyDownPatch?.unpatch();
    handleVirtualKeyUpPatch?.unpatch();
}

function updateLayout()
{
    Style.init();
    KeyMapping.init();
    DismissOnEnter.changeState(settings?.behavior.dismissOnEnter);

    if (settings?.custom_layout.enabled) DeckyExtendedLayout.injectKey();
    if (settings?.dictation.enabled) DictationKey.injectKey();

    DeckyKeys.syncShiftStates();
}

function onTypeKeyInternal(e: any[])
{
    const key = e[0];

    if (settings?.logging.internalKeyType) 
        log("OnTypeKeyInternal", e);

    if (KeyRepeat.IsRepeatable(key.strKey) && key.strKeycode !== KeyRepeat.RepeatableKeyCode && settings?.behavior.allowKeyRepeat)
        KeyRepeat.Trigger(key.strKey);

    return e;
}

function afterTypeKeyInternal(e: any[])
{
    const key = e[0];

    if (settings?.logging.afterInternalKeyType) 
        log("AfterTypeKeyInternal", e);

    if (key.strKey == "SwitchKeys_Layout") {
        DeckyExtendedLayout.deactivate(false);
        runDetached(updateLayout);
    }

    if (DeckyKeys.isShiftKey(key.strKey)) {
        DeckyKeys.sendShiftKeys(key.strKey);
        return [];
    }

    if (DeckyKeys.isModifierActive() && key.strKeycode != null) {
        DeckyKeys.sendKeys(key.strKeycode);
    }

    return e;
}

function sendKeys(keyString: string) 
{
    if (keyString.length === 0) return;

    if (DeckyKeys.isCustomKey(keyString)) DeckyKeys.sendKeys(keyString);
    else if (!DeckyKeys.isModifierActive()) sendTextPatchOriginal.call(SteamClient.Input, keyString);
}

function onPatch() {
    let instance = waitforCondition(() => KEYBOARD_INSTANCE());
    if (settings?.logging.init) log("keyboardInstance", instance);
    if (!instance) return;

    KeyMapping.KEYBOARD_ROOT = instance.return;
    beforePatch(KeyMapping.KEYBOARD_ROOT.stateNode, 'TypeKeyInternal', onTypeKeyInternal);
    afterPatch(KeyMapping.KEYBOARD_ROOT.stateNode, 'TypeKeyInternal', afterTypeKeyInternal);
    DeckyKeys.initKeys();
    updateLayout();
}

function onOpened() {
    runDetached(onPatch);
}

function onClosed() {
    DictationKey.endDictation();
    DeckyKeys.resetShiftStates();
    DeckyExtendedLayout.deactivate();
}

function onVisibilityChanged(isOpen: boolean) {
    log("isOpen", isOpen);
    if (isOpen) onOpened();
    else onClosed();
}

