import { beforePatch, ServerAPI, findSP } from "decky-frontend-lib";
import {  } from "decky-frontend-lib";
import React, { VFC } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { log } from "../logger";
import * as icons from '../icons';
import { ChangeKeyLabelById } from "../keys";

var server: ServerAPI | undefined = undefined;
var orientation: boolean = false;

export function setServer(s: ServerAPI) {
  server = s;
}

export function Init(KeyboardRoot: any) {
    orientation = false;
}

export function OnOrientationKey(KeyboardRoot: any) {
    let className = "virtualkeyboardcontainer_VirtualKeyboardContainer_Oel3O";

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