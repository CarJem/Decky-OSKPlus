import React, { Key } from "react";
import { KeyMapping } from '../types/key-mappings'
import { ServerAPI } from "decky-frontend-lib";
import * as DictationKey from '../behaviors/dictation-key';
import * as ExtendedLayout from '../layouts/decky-extended';

let server: ServerAPI | undefined = undefined;
export function setServer(s: ServerAPI) { server = s; }

const KeyCodes: Map<string, number> = new Map<string,number>([
    ['Deckyboard_F1',  59],
    ['Deckyboard_F2',  60],
    ['Deckyboard_F3',  61],
    ['Deckyboard_F4',  62],
    ['Deckyboard_F5',  63],
    ['Deckyboard_F6',  64],
    ['Deckyboard_F7',  65],
    ['Deckyboard_F8',  66],
    ['Deckyboard_F9',  67],
    ['Deckyboard_F10', 68],
    ['Deckyboard_F11', 87],
    ['Deckyboard_F12', 88],
    ['Deckyboard_NumLock', 69],
    ['Deckyboard_ScrollLock', 70],
    ['Deckyboard_CapsLock', 58],
    ['Deckyboard_LAlt', 56],
    ['Deckyboard_RAlt', 100],
    ['Deckyboard_LShift', 42],
    ['Deckyboard_RShift', 54],
    ['Deckyboard_LCtrl', 29],
    ['Deckyboard_RCtrl', 97],
    ['Deckyboard_Delete', 111],
    ['Deckyboard_Insert', 110],
    ['Deckyboard_Home', 102],
    ['Deckyboard_End', 107],
    ['Deckyboard_PageDown', 109],
    ['Deckyboard_PageUp', 104],
    ['Deckyboard_ArrowLeft', 105],
    ['Deckyboard_ArrowRight', 106],
    ['Deckyboard_ArrowUp', 103],
    ['Deckyboard_ArrowDown', 108],
    ['Deckyboard_Escape', 1],
    ['Deckyboard_PauseBrk', 119],
    ['Deckyboard_Context', 139],
    ['Deckyboard_LMeta', 125],
    ['Deckyboard_RMeta', 126],
    [ExtendedLayout.ExtendedKeyCode, -1],
    [DictationKey.keyCode, -1]
]);

let ShiftKeys = new Map<string,number>([
    ['Deckyboard_LShift', 0],
    ['Deckyboard_RShift', 0],
    ['Deckyboard_LMeta', 0],
    ['Deckyboard_RMeta', 0],
    ['Deckyboard_LAlt', 0],
    ['Deckyboard_RAlt', 0],
    ['Deckyboard_LCtrl', 0],
    ['Deckyboard_RCtrl', 0],
    [ExtendedLayout.ExtendedKeyCode, 0],
]);

let LockableShiftKeys = new Array<string>(
    'Deckyboard_LShift',
    'Deckyboard_RShift',
    'Deckyboard_LMeta',
    'Deckyboard_RMeta',
    'Deckyboard_LAlt',
    'Deckyboard_RAlt',
    'Deckyboard_LCtrl',
    'Deckyboard_RCtrl'
);

const ValveKeys: Map<string, number> = new Map<string,number>([
    ["", 14],
    ["", 28],
    ["\t", 15],
    ["", 105],
    ["", 106],
    ["", 103],
    ["", 108],
]);

enum KeySendMode {
    Click = 1,
    Press = 2,
    Release = 3,
    Type = 4
};

export function IsCustomKey(strKey: string) : boolean { return strKey.startsWith('Deckyboard_'); }

export function IsValveKey(strKey: string) : boolean { return ValveKeys.has(strKey); }

export function IsShiftKey(strKey: string) : boolean { return ShiftKeys.has(strKey); }

export function IsModifierActive(): boolean { return Array.from(ShiftKeys.values()).includes(1); }


export function SendShiftKeys(strKey: string) {
    let keyCode = KeyCodes.get(strKey);
    if (ShiftKeys.has(strKey)) {
        let keyState = KeyMapping.KeyboardRoot.stateNode.state.toggleStates[strKey];
        if (keyState === 0 && ShiftKeys.get(strKey) === 0) 
        {
            if (keyCode) keySend(KeySendMode.Press, keyCode === -1 ? strKey : keyCode);
            ShiftKeys.set(strKey, 1);
        }
        else if (keyState === 1 && ShiftKeys.get(strKey) === 1 && LockableShiftKeys.includes(strKey)) 
        {
            ShiftKeys.set(strKey, 2);
        }
        else 
        {
            if (keyCode) keySend(KeySendMode.Release, keyCode === -1 ? strKey : keyCode);
            ShiftKeys.set(strKey, 0);
        }
        SyncToggleStates();
    }
}

function keySend(mode: KeySendMode, keyCode: number | string) {
    if (keyCode === DictationKey.keyCode) {
        DictationKey.OnAction();
    } 
    else if (keyCode === ExtendedLayout.ExtendedKeyCode) {
        switch (mode) {
            case KeySendMode.Press:
                ExtendedLayout.Activate();
                break;
            case KeySendMode.Release:
                ExtendedLayout.Deactivate();
                break;
        }
    }
    else {
        switch (mode) {
            case KeySendMode.Click:
                server?.callPluginMethod<any, boolean>("keyClick", {"keyCode": keyCode});
                break;
            case KeySendMode.Release:
                server?.callPluginMethod<any, boolean>("keyRelease", {"keyCode": keyCode});
                break;
            case KeySendMode.Press:
                server?.callPluginMethod<any, boolean>("keyPress", {"keyCode": keyCode});
                break;
            case KeySendMode.Type:
                server?.callPluginMethod<any, boolean>("typeText", {"text": keyCode});
                break;
        }
    }
}

export function SendKeys(strKey: string)
{
    if (IsCustomKey(strKey)) {
        let keyCode = KeyCodes.get(strKey);
        if (keyCode) keySend(KeySendMode.Click, keyCode === -1 ? strKey : keyCode);
    }
    else {
        let keyCode = Number(strKey);
        if (keyCode) keySend(KeySendMode.Click, keyCode);
    }
        
}

export function InitKeys() {
    ShiftKeys.forEach((state, key) => {
        KeyMapping.addShiftKeys(key);
    });
}

export function SyncToggleStates() {
    var mappings = KeyMapping.KeyboardRoot.stateNode.state.toggleStates;
    ShiftKeys.forEach((state, key) => {
        mappings[key] = state;
    });
    KeyMapping.KeyboardRoot.stateNode.setState({ toggleStates: mappings });
}

export function ResetToggleStates() {
    ShiftKeys.forEach((code, key) => {
        let keyCode = KeyCodes.get(key);
        if (keyCode) keySend(KeySendMode.Release, keyCode);
        ShiftKeys.set(key, 0);
    });
}

