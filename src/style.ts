import { findSP } from "decky-frontend-lib";
import { PluginSettings } from "./types/PluginSettings";
import { virtualKeyboardClasses } from './types/extensions/ValveExt'
import { waitforCondition } from "./extensions";


var settings: PluginSettings | undefined = undefined;

export function setSettings(s: PluginSettings) {
    settings = s;
}

export function init() {
    let className = virtualKeyboardClasses.Keyboard;
    let osk = waitforCondition(() => findSP().document.getElementsByClassName(className)[0] as HTMLElement);
    if (osk) {
        if (settings?.style.unlockKeyboardLength) osk.style.maxWidth = '100%';
        else osk.style.maxWidth = '';
    }
}