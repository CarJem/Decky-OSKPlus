import { beforePatch, ServerAPI, findSP, findModule } from "decky-frontend-lib";
import {  } from "decky-frontend-lib";
import React, { VFC } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { log } from "./logger";
import { PluginSettings } from "./types/plugin-settings";
import { virtualKeyboardClasses } from './types/personal-static-classes'


var settings: PluginSettings | undefined = undefined;

export function setSettings(s: PluginSettings) {
    settings = s;
}

export function Init() {
    let className = virtualKeyboardClasses.Keyboard;
    let osk = findSP().document.getElementsByClassName(className)[0] as HTMLElement;
    //log('osk', className, osk);
    if (osk) {
        if (settings?.UnlockKeyboardMaxLength) osk.style.maxWidth = '100%';
        else osk.style.maxWidth = '';
    }
}