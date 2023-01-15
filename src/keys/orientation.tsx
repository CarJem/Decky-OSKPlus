import { beforePatch, ServerAPI, findSP, findModule } from "decky-frontend-lib";
import {  } from "decky-frontend-lib";
import React, { VFC } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { log } from "../logger";
import * as icons from '../types/icons';
import { ChangeKeyLabelById } from "../keyboard";
import { virtualKeyboardContainerClasses } from '../types/personal-static-classes'

var server: ServerAPI | undefined = undefined;
var orientation: boolean = false;

export const KeyCode: string = "orientation_key";

export function setServer(s: ServerAPI) {
  server = s;
}

export function Init() {
    UpdateStyle();
}

export function OnOrientationKey() {
    orientation = !orientation;
    UpdateStyle();
}

function UpdateStyle() {
    let className = virtualKeyboardContainerClasses.VirtualKeyboardContainer;
    let osk = findSP().document.getElementsByClassName(className)[0] as HTMLElement;

    let Footer = findSP().document.getElementById('Footer') as HTMLElement;
    let Root = findSP().document.getElementById('root_1_') as HTMLElement;
    let Core = findSP().document.getElementById('MainNavMenu-Rest') as HTMLElement;
    
    if (osk && Footer && Root && Core) {


        osk.style.backgroundColor = 'black';
        
        if (orientation) {
            //osk.style.position = 'absolute';
            //osk.style.width = '100%';
            Core.insertBefore(osk, Root);
            ChangeKeyLabelById(KeyCode, <FaArrowDown/>)
        }
        else {
            //osk.style.position = '';
            //osk.style.width = '';
            Core.insertBefore(osk, Footer.nextSibling);
            ChangeKeyLabelById(KeyCode, <FaArrowUp/>)
        }
    }
}

