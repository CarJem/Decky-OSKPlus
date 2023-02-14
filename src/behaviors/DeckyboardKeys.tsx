import React, { Key } from "react";
import { KeyMapping } from '../types/key-mapping/KeyMapping'
import { ServerAPI } from "decky-frontend-lib";
import * as DictationKey from './DictationKey';
import * as ExtendedLayout from '../layouts/DeckyExtended';
import { DeckySendMode } from "../types/decky-keys/DeckySendMode";
import { DeckyShiftState } from "../types/decky-keys/DeckyShiftState";

const KEY_CODES: Map<string, number | string> = new Map<string,number | string>([
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
    [ExtendedLayout.KEY_CODE, ExtendedLayout.KEY_CODE],
    [DictationKey.KEY_CODE, DictationKey.KEY_CODE]
]);
const VALVE_KEY_CODES: Map<string, number> = new Map<string,number>([
    ["", 14],
    ["", 28],
    ["\t", 15],
    ["", 105],
    ["", 106],
    ["", 103],
    ["", 108],
]);


let shiftKeys = new Map<string, DeckyShiftState>([
    ['Deckyboard_LShift', {state: 0, lockable: true, isModifier: true}],
    ['Deckyboard_RShift', {state: 0, lockable: true, isModifier: true}],
    ['Deckyboard_LMeta', {state: 0, lockable: true, isModifier: true}],
    ['Deckyboard_RMeta', {state: 0, lockable: true, isModifier: true}],
    ['Deckyboard_LAlt', {state: 0, lockable: true, isModifier: true}],
    ['Deckyboard_RAlt', {state: 0, lockable: true, isModifier: true}],
    ['Deckyboard_LCtrl', {state: 0, lockable: true, isModifier: true}],
    ['Deckyboard_RCtrl', {state: 0, lockable: true, isModifier: true}],
    [ExtendedLayout.KEY_CODE, {state: 0, lockable: false, isModifier: false}],
]);
let server: ServerAPI | undefined = undefined;


export function setServer(s: ServerAPI) : any { server = s; }

export function isCustomKey(strKey: string) : boolean { return strKey.startsWith('Deckyboard_'); }

export function isValveKey(strKey: string) : boolean { return VALVE_KEY_CODES.has(strKey); }

export function isShiftKey(strKey: string) : boolean { return shiftKeys.has(strKey); }

export function isModifierActive(): boolean { return Array.from(shiftKeys.values()).some(x => x.isModifier === true && x.state > 0); }

export function initKeys() {
    shiftKeys.forEach((state, key) => {
        KeyMapping.addShiftKeys(key);
    });
}

export function sendKeys(strKey: string) {
    if (isCustomKey(strKey)) sendKeyInput(DeckySendMode.Click, KEY_CODES.get(strKey));
    else sendKeyInput(DeckySendMode.Click, Number(strKey));
}

export function sendShiftKeys(strKey: string) {
    if (shiftKeys.has(strKey)) {
        if (doesShiftMatch(strKey, 0)) {
            sendKeyInput(DeckySendMode.Press, KEY_CODES.get(strKey));
            setShiftState(strKey, 2);
        }
        else if (doesShiftMatch(strKey, 1)) {
            sendKeyInput(DeckySendMode.ShiftHold, KEY_CODES.get(strKey));
            setShiftState(strKey, 2);
        }
        else {
            sendKeyInput(DeckySendMode.Release, KEY_CODES.get(strKey));
            setShiftState(strKey, 0);
        }
        syncShiftStates();
    }
}

export function syncShiftStates() {
    var mappings = KeyMapping.KEYBOARD_ROOT.stateNode.state.toggleStates;
    shiftKeys.forEach((state, key) => {
        mappings[key] = state;
    });
    KeyMapping.KEYBOARD_ROOT.stateNode.setState({ toggleStates: mappings });
}

export function resetShiftStates() {
    shiftKeys.forEach((code, key) => {
        sendKeyInput(DeckySendMode.Release, KEY_CODES.get(key));
        setShiftState(key, 0);
    });
}

function sendKeyInput(mode: DeckySendMode, keyCode: number | string | undefined) {

    if (!keyCode) return;

    if (keyCode === DictationKey.KEY_CODE) DictationKey.onAction(mode); 
    else if (keyCode === ExtendedLayout.KEY_CODE) ExtendedLayout.onAction(mode);
    else 
    {
        switch (mode) 
        {
            case DeckySendMode.Click:
                server?.callPluginMethod<any, boolean>("keyClick", {"keyCode": keyCode});
                break;
            case DeckySendMode.Release:
                server?.callPluginMethod<any, boolean>("keyRelease", {"keyCode": keyCode});
                break;
            case DeckySendMode.Press:
                server?.callPluginMethod<any, boolean>("keyPress", {"keyCode": keyCode});
                break;
            case DeckySendMode.Type:
                server?.callPluginMethod<any, boolean>("typeText", {"text": keyCode});
                break;
        }
    }
}

function doesShiftMatch(strKey: string, state: number) {
    let keyState = KeyMapping.KEYBOARD_ROOT.stateNode.state.toggleStates[strKey];
    return keyState === state && shiftKeys.get(strKey)?.state === state;
}

function setShiftState(strKey: string, state: number) {
    let shiftState = shiftKeys.get(strKey);
    if (shiftState) {
        shiftState.state = state;
        shiftKeys.set(strKey, shiftState);
    }
}

