import React, { Key } from "react";
import { KeyMapping } from '../types/key-mappings'
import * as FA from "react-icons/fa";
import * as BS from "react-icons/bs";
import * as CustomIcons from "../types/icons";
import * as MD from "react-icons/md";
import * as IO from "react-icons/io5";
import { ServerAPI } from "decky-frontend-lib";

let server: ServerAPI | undefined = undefined;
export function setServer(s: ServerAPI) { server = s; }

const KeyCodes: Map<string, number> = new Map<string,number>([
    ['F1',  59],
    ['F2',  60],
    ['F3',  61],
    ['F4',  62],
    ['F5',  63],
    ['F6',  64],
    ['F7',  65],
    ['F8',  66],
    ['F9',  67],
    ['F10', 68],
    ['F11', 87],
    ['F12', 88],
    ['NumLock', 69],
    ['ScrollLock', 70],
    ['CapsLock', 58],
    ['LAlt', 56],
    ['RAlt', 100],
    ['LShift', 42],
    ['RShift', 54],
    ['LCtrl', 29],
    ['RCtrl', 97],
    ['Delete', 111],
    ['Insert', 110],
    ['Home', 102],
    ['End', 107],
    ['PageDown', 109],
    ['PageUp', 104],
    ['ArrowLeft', 105],
    ['ArrowRight', 106],
    ['ArrowUp', 103],
    ['ArrowDown', 108],
    ['Escape', 1],
    ['PauseBrk', 119],
    ['Context', 139],
    ['LMeta', 125],
    ['RMeta', 126]
]);

const ShiftKeys = ['LShift', 'RShift', 'LMeta', 'RMeta', 'LAlt', 'RAlt'];

let Decky_ToggleStates: any;


export function GenerateLayout(): Array<KeyMapping>
{
    let play_pause = <MD.MdPlayArrow style={{ width: "auto", height: "auto" }} />;
    let arrow_up = <FA.FaArrowUp />;
    let arrow_down = <FA.FaArrowDown />;
    let arrow_left = <FA.FaArrowLeft />;
    let arrow_right = <FA.FaArrowRight />;
    let context_icon = <FA.FaBars />;
    let vkclose_icon = <CustomIcons.VKClose />
    let media_backwards = <MD.MdFastRewind style={{ width: "auto", height: "auto" }} />;
    let media_forwards = <MD.MdFastForward style={{ width: "auto", height: "auto" }} />;
    let media_volup = <MD.MdVolumeUp style={{ width: "auto", height: "auto" }} />;
    let media_voldown = <MD.MdVolumeUp style={{ width: "auto", height: "auto" }} />;
    let media_volmute = <MD.MdVolumeMute style={{ width: "auto", height: "auto" }} />;
    let meta_icon = <BS.BsFillXDiamondFill />;
    let layout_icon = <CustomIcons.SwitchKeys_Layout/>;
    let home_icon = <span style={{ zoom: "0.7", display: 'inline-flex' }}>Home</span>;
    let del_icon = <span style={{ zoom: "0.7", display: 'inline-flex' }}>Delete</span>;
    let ins_icon = <span style={{ zoom: "0.7", display: 'inline-flex' }}>Insert</span>;
    let pgup_icon = <span style={{ zoom: "0.7", display: 'inline-flex' }}>PgUp</span>;
    let pausebreak_icon = <span style={{ zoom: "0.7", display: 'inline-flex' }}>Pause Break</span>;
    let printscreen_icon = <span style={{ zoom: "0.7", display: 'inline-flex' }}>PrtSc</span>;
    let cut_icon = <MD.MdContentCut />;
    let paste_icon = <MD.MdContentPaste />;
    let copy_icon = <MD.MdContentCopy />;
    let selectall_icon = <MD.MdSelectAll />;
    let numlock_icon = <span style={{ zoom: "0.7", display: 'inline-flex' }}>Num Lock</span>;
    let scrolllock_icon = <span style={{ zoom: "0.7", display: 'inline-flex' }}>Scroll Lock</span>;
    let pgdn_icon = <span style={{ zoom: "0.7", display: 'inline-flex' }}>PgDn</span>;
    let end_icon = <span style={{ zoom: "0.7", display: 'inline-flex' }}>End</span>;
    let ex_icon = 'Ex';
    let fn_icon = 'Fn';
    let reserved_icon = ' ';
    let plugin_icon = <IO.IoExtensionPuzzleSharp style={{ width: "auto", height: "auto", margin: "5px" }} />;
    let capslock_icon = <span style={{ zoom: "0.7", display: 'inline-flex' }}>Caps Lock</span>;
    let num_7_label = <span style={{ display: "-webkit-inline-box" }}>7</span>;
    let num_8_label = <span style={{ display: "-webkit-inline-box" }}>8</span>;
    let num_9_label = <span style={{ display: "-webkit-inline-box" }}>9</span>;
    let num_divide_label = <span style={{ display: "-webkit-inline-box" }}>/</span>;
    let dummy_label = <span style={{ display: "-webkit-inline-box" }}> </span>;

    let keyList = [
        [
            [{ key: "Deckyboard_Reserved", label: reserved_icon }],
            [{ key: "Deckyboard_F1", label: "F1" }, { key: "Deckyboard_MediaBackward", label: media_backwards }],
            [{ key: "Deckyboard_F2", label: "F2" }, { key: "Deckyboard_MediaPlay", label: play_pause }],
            [{ key: "Deckyboard_F3", label: "F3" }, { key: "Deckyboard_MediaForward", label: media_forwards }],
            [{ key: "Deckyboard_F4", label: "F4" }, { key: "", label: dummy_label }],
            [{ key: "Deckyboard_F5", label: "F5" }, { key: "", label: dummy_label }],
            [{ key: "Deckyboard_F6", label: "F6" }, { key: "Deckyboard_Numpad7", label: num_7_label }],
            [{ key: "Deckyboard_F7", label: "F7" }, { key: "Deckyboard_Numpad8", label: num_8_label }],
            [{ key: "Deckyboard_F8", label: "F8" }, { key: "Deckyboard_Numpad9", label: num_9_label }],
            [{ key: "Deckyboard_F9", label: "F9" }, { key: "Deckyboard_NumpadDivide", label: num_divide_label }],
            [{ key: "Deckyboard_F10", label: "F10" }, { key: "Deckyboard_VolumeMute", label: media_volmute }],
            [{ key: "Deckyboard_F11", label: "F11" }, { key: "Deckyboard_VolumeDown", label: media_voldown }],
            [{ key: "Deckyboard_F12", label: "F12" }, { key: "Deckyboard_VolumeUp", label: media_volup }],
            [{ key: "Backspace", label: "#Key_Backspace", leftActionButton: 2, type: 9 }],
        ],
        [
            [{ key: "Tab", label: "#Key_Tab", type: 3 }],
            [{ key: "Deckyboard_Delete", label: del_icon }],
            [{ key: "Deckyboard_Insert", label: ins_icon }],
            [{ key: "Deckyboard_Home", label: home_icon }],
            [{ key: "Deckyboard_End", label: end_icon }],
            [{ key: "Deckyboard_Plugin1", label: plugin_icon }, { key: "Deckyboard_Numpad4", label: "4" }],
            [{ key: "Deckyboard_Plugin2", label: plugin_icon }, { key: "Deckyboard_Numpad5", label: "5" }],
            [{ key: "Deckyboard_Plugin3", label: plugin_icon }, { key: "Deckyboard_Numpad6", label: "6" }],
            [{ key: "Deckyboard_PrtScrn", label: printscreen_icon }, { key: "Deckyboard_NumpadMultiply", label: "*" }],
            [{ key: "Deckyboard_Reserved", label: reserved_icon }],
            [{ key: "Deckyboard_PauseBrk", label: pausebreak_icon }],
            [{ key: "Deckyboard_CapsLock", label: capslock_icon }],
            [{ key: "Deckyboard_ScrollLock", label: scrolllock_icon }],
            [{ key: "Deckyboard_NumLock", label: numlock_icon }],
        ],
        [
            [{ key: "Deckyboard_Escape", label: 'Esc', type: 6 }],
            [{ key: "Deckyboard_ArrowUp", label: arrow_up }],
            [{ key: "Deckyboard_ArrowDown", label: arrow_down }],
            [{ key: "Deckyboard_Reserved", label: reserved_icon }],
            [{ key: "Deckyboard_Plugin4", label: plugin_icon }, { key: "Deckyboard_Numpad1", label: "1" }],
            [{ key: "Deckyboard_Plugin5", label: plugin_icon }, { key: "Deckyboard_Numpad2", label: "2" }],
            [{ key: "Deckyboard_Plugin6", label: plugin_icon }, { key: "Deckyboard_Numpad3", label: "3" }],
            [{ key: "Deckyboard_Reserved", label: reserved_icon }, { key: "Deckyboard_NumpadSubtract", label: "-" }],
            [{ key: "Deckyboard_ClipboardCut", label: cut_icon }],
            [{ key: "Deckyboard_ClipboardCopy", label: copy_icon }],
            [{ key: "Deckyboard_ClipboardPaste", label: paste_icon }],
            [{ key: "Deckyboard_ClipboardSelectAll", label: selectall_icon }],
            [{ key: "Enter", label: "#Key_Enter", leftActionButton: 15, type: 1 }],
        ],
        [
            [{ key: "Deckyboard_LShift", label: "LShift", type: 7 }],
            [{ key: "Deckyboard_ArrowLeft", label: arrow_left }],
            [{ key: "Deckyboard_ArrowRight", label: arrow_right }],
            [{ key: "Deckyboard_Plugin7", label: plugin_icon }, { key: "Deckyboard_Numpad0", label: "0" }],
            [{ key: "Deckyboard_Plugin8", label: plugin_icon }, { key: "Deckyboard_NumpadDecimal", label: "." }],
            [{ key: "Deckyboard_Plugin9", label: plugin_icon }, { key: "Deckyboard_NumpadPrecent", label: "%" }],
            [{ key: "Deckyboard_Reserved", label: reserved_icon }, { key: "Deckyboard_NumpadAdd", label: "+" }],
            [{ key: "Deckyboard_PageUp", label: pgup_icon }],
            [{ key: "Deckyboard_PageDown", label: pgdn_icon }],
            [{ key: "Shift", label: fn_icon }], //Deckyboard_Fn
            [{ key: "Deckyboard_Ex", label: ex_icon }],
            [{ key: "Deckyboard_Context", label: context_icon }],
            [{ key: "Deckyboard_RShift", label: "RShift", type: 8 }],
        ],
        [
            [{ key: "Deckyboard_LCtrl", label: "LCtrl", type: 3 }],
            [{ key: "Deckyboard_LMeta", label: meta_icon, type: 4 }],
            [{ key: "SwitchKeys_Layout", label: layout_icon, type: 4 }],
            [{ key: "Deckyboard_LAlt", label: "LAlt", type: 3 }],
            [{ key: " ", label: " ", type: 10, leftActionButton: 3 }],
            [{ key: "Deckyboard_RAlt", label: "RAlt", type: 3 }],
            [{ key: "Deckyboard_RMeta", label: meta_icon, type: 4 }],
            [{ key: "Deckyboard_RCtrl", label: "RCtrl", type: 3 }],
            [{ key: "VKClose", label: vkclose_icon, type: 5, }, { key: "VKMove", type: 5, label: "#Key_Move" }],
    ]];

    KeyMapping.addShiftKeys("Deckyboard_LCtrl");
    KeyMapping.addShiftKeys("Deckyboard_LMeta");
    KeyMapping.addShiftKeys("Deckyboard_LAlt");
    KeyMapping.addShiftKeys("Deckyboard_LShift");

    KeyMapping.addShiftKeys("Deckyboard_RCtrl");
    KeyMapping.addShiftKeys("Deckyboard_RMeta");
    KeyMapping.addShiftKeys("Deckyboard_RAlt");
    KeyMapping.addShiftKeys("Deckyboard_RShift");

    KeyMapping.addShiftKeys("Deckyboard_CapsLock");
    KeyMapping.addShiftKeys("Deckyboard_ScrollLock");
    KeyMapping.addShiftKeys("Deckyboard_NumLock");

    return KeyMapping.layoutGen(keyList);
}

export function RestoreToggleState() {
    KeyMapping.KeyboardRoot.stateNode.setState({
        toggleStates: Decky_ToggleStates
    });
}

export function UpdateToggleState() {
    Decky_ToggleStates = KeyMapping.KeyboardRoot.stateNode.toggleStates;
}

export function IsCustomKey(strKey: string) : boolean
{
    return strKey.startsWith('Deckyboard_');
}
export function OnTypeKeyInternal(strKey: string)
{
    let key = strKey.replace("Deckyboard_", "");

    let keyCode = KeyCodes.get(key);
    if (keyCode) {
        if (ShiftKeys.includes(key)) {
            var state = KeyMapping.KeyboardRoot.stateNode.state.toggleStates[strKey];
            if (state) {
                if (state === 0) {
                    var response = server?.callPluginMethod<any, boolean>("keyPress", {"keyCode": keyCode});
                }
                else if (state === 1) {
                    var response = server?.callPluginMethod<any, boolean>("keyRelease", {"keyCode": keyCode});
                }
            }
        }
        else {
            var response = server?.callPluginMethod<any, boolean>("keyClick", {"keyCode": keyCode});
        }
    }
}

