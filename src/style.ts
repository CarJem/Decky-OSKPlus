import { findSP } from "decky-frontend-lib";
import { PluginSettings } from "./types/plugin-settings";
import { virtualKeyboardClasses } from './types/personal-static-classes'
import { waitforCondition } from "./extensions";


var settings: PluginSettings | undefined = undefined;

export function setSettings(s: PluginSettings) {
    settings = s;
}

export function Init() {
    let className = virtualKeyboardClasses.Keyboard;
    let osk = waitforCondition(() => findSP().document.getElementsByClassName(className)[0] as HTMLElement);
    if (osk) {
        if (settings?.UnlockKeyboardMaxLength) osk.style.maxWidth = '100%';
        else osk.style.maxWidth = '';
    }
}