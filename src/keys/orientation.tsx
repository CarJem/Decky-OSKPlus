import { beforePatch, ServerAPI, findSP, findModule } from "decky-frontend-lib";
import {  } from "decky-frontend-lib";
import React, { VFC } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { log } from "../logger";
import * as icons from '../icons';
import { ChangeKeyLabelById } from "../keys";

var server: ServerAPI | undefined = undefined;
var orientation: boolean = false;


type VirtualKeyboardContainerClasses = Record <
  | 'VirtualKeyboardStandaloneContainer'
  | 'VirtualKeyboardContainer'
  | 'keyboard_appear',
  string
>;

export const virtualKeyboardContainerClasses: VirtualKeyboardContainerClasses = findModule(
    (mod) => typeof mod === 'object' && mod?.VirtualKeyboardContainer?.includes('virtualkeyboardcontainer_'),
);

export function setServer(s: ServerAPI) {
  server = s;
}

export function Init(KeyboardRoot: any) {
    orientation = false;
}

export function OnOrientationKey(KeyboardRoot: any) {
    let className = virtualKeyboardContainerClasses.VirtualKeyboardContainer;

    let osk = findSP().document.getElementsByClassName(className)[0];
    if (osk) {
        osk.style.position = '';
        osk.style.width = '';

        if (orientation) {
            osk.style.position = 'absolute';
            osk.style.width = '100%';
            ChangeKeyLabelById("orientation_key", <FaArrowDown/>)
        }
        else {
            ChangeKeyLabelById("orientation_key", <FaArrowUp/>)
        }

        orientation = !orientation;
    }
}