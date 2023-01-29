import React, { Key } from "react";
import { KeyMapping } from './types/key-mappings'
import * as FA from "react-icons/fa";
import * as BS from "react-icons/bs";
import * as TB from "react-icons/tb";
import * as MD from "react-icons/md";
import * as IO from "react-icons/io5";

export function GenerateDeckyExtendedLayout() : Array<KeyMapping> {
    let play_pause = <MD.MdPlayArrow style={{width: "auto", height: "auto"}}/>;
    let arrow_up = <FA.FaArrowUp/>;
    let arrow_down = <FA.FaArrowDown/>;
    let arrow_left = <FA.FaArrowLeft/>;
    let arrow_right = <FA.FaArrowRight/>;
    let context_icon = <FA.FaBars/>;
    let vkclose_icon = <MD.MdKeyboardHide/>
    let media_backwards = <MD.MdFastRewind style={{width: "auto", height: "auto"}}/>;
    let media_forwards = <MD.MdFastForward style={{width: "auto", height: "auto"}}/>;
    let media_volup = <MD.MdVolumeUp style={{width: "auto", height: "auto"}}/>;
    let media_voldown = <MD.MdVolumeUp style={{width: "auto", height: "auto"}}/>;
    let media_volmute = <MD.MdVolumeMute style={{width: "auto", height: "auto"}}/>;
    let meta_icon = <BS.BsFillXDiamondFill/>;
    let layout_icon = <TB.TbLetterCase/>;
    let home_icon = <span style={{zoom: "0.7", display: 'inline-flex'}}>Home</span>;
    let del_icon = <span style={{zoom: "0.7", display: 'inline-flex'}}>Delete</span>;
    let ins_icon = <span style={{zoom: "0.7", display: 'inline-flex'}}>Insert</span>;
    let pgup_icon = <span style={{zoom: "0.7", display: 'inline-flex'}}>PgUp</span>;
    let pausebreak_icon = <span style={{zoom: "0.7", display: 'inline-flex'}}>Pause / Break</span>;
    let printscreen_icon = <span style={{zoom: "0.7", display: 'inline-flex'}}>PrtSc</span>;
    let cut_icon = <MD.MdContentCut/>;
    let paste_icon = <MD.MdContentPaste/>;
    let copy_icon = <MD.MdContentCopy/>;
    let selectall_icon = <MD.MdSelectAll/>;
    let numlock_icon = <span style={{zoom: "0.7", display: 'inline-flex'}}>Num Lock</span>;
    let scrolllock_icon = <span style={{zoom: "0.7", display: 'inline-flex'}}>Scroll Lock</span>;
    let pgdn_icon = <span style={{zoom: "0.7", display: 'inline-flex'}}>PgDn</span>;
    let end_icon = <span style={{zoom: "0.7", display: 'inline-flex'}}>End</span>;
    let ex_icon = 'Ex';
    let fn_icon = 'Fn';
    let reserved_icon = '.';
    let plugin_icon = <IO.IoExtensionPuzzleSharp style={{width: "auto", height: "auto"}}/>;


    let num_7_label = <span style={{display: "-webkit-inline-box"}}>7</span>;
    let num_8_label = <span style={{display: "-webkit-inline-box"}}>8</span>;
    let num_9_label = <span style={{display: "-webkit-inline-box"}}>9</span>;
    let num_divide_label = <span style={{display: "-webkit-inline-box"}}>/</span>;
    let dummy_label = <span style={{display: "-webkit-inline-box"}}> </span>;


    let keyList = Array<KeyMapping>();

    keyList.push(KeyMapping.keyGen(0, 0,  [{key: "Deckyboard_Escape", label: "Esc", type: 3 }]));
    keyList.push(KeyMapping.keyGen(0, 1,  [{key: "Deckyboard_F1", label: "F1" }, {key: "Deckyboard_MediaBackward", label: media_backwards  }]));
    keyList.push(KeyMapping.keyGen(0, 2,  [{key: "Deckyboard_F2", label: "F2" }, {key: "Deckyboard_MediaPlay", label: play_pause      }]));
    keyList.push(KeyMapping.keyGen(0, 3,  [{key: "Deckyboard_F3", label: "F3" }, {key: "Deckyboard_MediaForward", label: media_forwards   }]));
    keyList.push(KeyMapping.keyGen(0, 4,  [{key: "Deckyboard_F4", label: "F4" }, {key: "", label: dummy_label}]));
    keyList.push(KeyMapping.keyGen(0, 5,  [{key: "Deckyboard_F5", label: "F5" }, {key: "", label: dummy_label}]));
    keyList.push(KeyMapping.keyGen(0, 6,  [{key: "Deckyboard_F6", label: "F6" }, {key: "Deckyboard_Numpad7", label: num_7_label }]));
    keyList.push(KeyMapping.keyGen(0, 7,  [{key: "Deckyboard_F7", label: "F7" }, {key: "Deckyboard_Numpad8", label: num_8_label}]));
    keyList.push(KeyMapping.keyGen(0, 8,  [{key: "Deckyboard_F8", label: "F8" }, {key: "Deckyboard_Numpad9", label: num_9_label }]));
    keyList.push(KeyMapping.keyGen(0, 9,  [{key: "Deckyboard_F9", label: "F9" }, {key: "Deckyboard_NumpadDivide", label: num_divide_label }]));
    keyList.push(KeyMapping.keyGen(0, 10, [{key: "Deckyboard_F10", label: "F10" }, {key: "Deckyboard_VolumeMute", label: media_volmute }]));
    keyList.push(KeyMapping.keyGen(0, 11, [{key: "Deckyboard_F11", label: "F11" }, {key: "Deckyboard_VolumeDown", label: media_voldown }]));
    keyList.push(KeyMapping.keyGen(0, 12, [{key: "Deckyboard_F12", label: "F12" }, {key: "Deckyboard_VolumeUp", label: media_volup   }]));
    keyList.push(KeyMapping.keyGen(0, 13, [{key: "Backspace", label: "#Key_Backspace", leftActionButton: 2, type: 8 }]));

    keyList.push(KeyMapping.keyGen(1, 0,  [{key: "Tab", label: "#Key_Tab", type: 3  }]));
    keyList.push(KeyMapping.keyGen(1, 1,  [{key: "Deckyboard_Reserved", label: reserved_icon }]));
    keyList.push(KeyMapping.keyGen(1, 2,  [{key: "Deckyboard_Delete", label: del_icon }]));
    keyList.push(KeyMapping.keyGen(1, 3,  [{key: "Deckyboard_Insert", label: ins_icon }]));
    keyList.push(KeyMapping.keyGen(1, 4,  [{key: "Deckyboard_Home", label: home_icon }]));
    keyList.push(KeyMapping.keyGen(1, 5,  [{key: "Deckyboard_PageUp", label: pgup_icon }]));
    keyList.push(KeyMapping.keyGen(1, 6,  [{key: "Deckyboard_Plugin1", label: plugin_icon }, {key: "Deckyboard_Numpad4", label: "4"}]));
    keyList.push(KeyMapping.keyGen(1, 7,  [{key: "Deckyboard_Plugin2", label: plugin_icon }, {key: "Deckyboard_Numpad5", label: "5"}]));
    keyList.push(KeyMapping.keyGen(1, 8,  [{key: "Deckyboard_Plugin3", label: plugin_icon }, {key: "Deckyboard_Numpad6", label: "6"}]));
    keyList.push(KeyMapping.keyGen(1, 9,  [{key: "Deckyboard_PrtScrn", label: printscreen_icon }, {key: "Deckyboard_NumpadMultiply", label: "*"}]));
    keyList.push(KeyMapping.keyGen(1, 10, [{key: "Deckyboard_PauseBrk", label: pausebreak_icon }]));
    keyList.push(KeyMapping.keyGen(1, 11, [{key: "Deckyboard_ClipboardPaste", label: paste_icon }]));
    keyList.push(KeyMapping.keyGen(1, 12, [{key: "Deckyboard_ClipboardSelectAll", label: selectall_icon }]));
    keyList.push(KeyMapping.keyGen(1, 13, [{key: "Deckyboard_Reserved", label: reserved_icon, type: 8 }]));

    keyList.push(KeyMapping.keyGen(2, 0,  [{key: "Deckyboard_CapsLock", label: "#Key_Caps", type: 3 }]));
    keyList.push(KeyMapping.keyGen(2, 1,  [{key: "Deckyboard_NumLock", label: numlock_icon }]));
    keyList.push(KeyMapping.keyGen(2, 2,  [{key: "Deckyboard_Reserved", label: reserved_icon }]));
    keyList.push(KeyMapping.keyGen(2, 3,  [{key: "Deckyboard_End", label: end_icon }]));
    keyList.push(KeyMapping.keyGen(2, 4,  [{key: "Deckyboard_ArrowUp",label: arrow_up }]));
    keyList.push(KeyMapping.keyGen(2, 5,  [{key: "Deckyboard_PageDn", label: pgdn_icon }]));
    keyList.push(KeyMapping.keyGen(2, 6,  [{key: "Deckyboard_Plugin4", label: plugin_icon }, {key: "Deckyboard_Numpad1", label: "1"}]));
    keyList.push(KeyMapping.keyGen(2, 7,  [{key: "Deckyboard_Plugin5", label: plugin_icon }, {key: "Deckyboard_Numpad2", label: "2"}]));
    keyList.push(KeyMapping.keyGen(2, 8,  [{key: "Deckyboard_Plugin6", label: plugin_icon }, {key: "Deckyboard_Numpad3", label: "3"}]));
    keyList.push(KeyMapping.keyGen(2, 9,  [{key: "Deckyboard_Reserved", label: reserved_icon }, {key: "Deckyboard_NumpadSubtract", label: "-"}]));
    keyList.push(KeyMapping.keyGen(2, 10, [{key: "Deckyboard_Ex", label: ex_icon }]));
    keyList.push(KeyMapping.keyGen(2, 11, [{key: "Deckyboard_ClipboardCut", label: cut_icon }]));
    keyList.push(KeyMapping.keyGen(2, 12, [{key: "Deckyboard_ClipboardCopy", label: copy_icon }]));
    keyList.push(KeyMapping.keyGen(2, 13, [{key: "Enter", label: "#Key_Enter", leftActionButton: 15, type: 8 }]));

    keyList.push(KeyMapping.keyGen(3, 0,  [{key: "Deckyboard_LShift", label: "LShift",type: 3 }]));
    keyList.push(KeyMapping.keyGen(3, 1,  [{key: "Deckyboard_ScrollLock", label: scrolllock_icon }]));
    keyList.push(KeyMapping.keyGen(3, 2,  [{key: "Deckyboard_Reserved", label: reserved_icon }]));
    keyList.push(KeyMapping.keyGen(3, 3,  [{key: "Deckyboard_ArrowLeft", label: arrow_left }]));
    keyList.push(KeyMapping.keyGen(3, 4,  [{key: "Deckyboard_ArrowDown", label: arrow_down }]));
    keyList.push(KeyMapping.keyGen(3, 5,  [{key: "Deckyboard_ArrowRight", label: arrow_right }]));
    keyList.push(KeyMapping.keyGen(3, 6,  [{key: "Deckyboard_Plugin7", label: plugin_icon }, {key: "Deckyboard_Numpad0", label: "0"}]));
    keyList.push(KeyMapping.keyGen(3, 7,  [{key: "Deckyboard_Plugin8", label: plugin_icon }, {key: "Deckyboard_NumpadDecimal", label: "."}]));
    keyList.push(KeyMapping.keyGen(3, 8,  [{key: "Deckyboard_Plugin9", label: plugin_icon }, {key: "Deckyboard_NumpadPrecent", label: "%"}]));
    keyList.push(KeyMapping.keyGen(3, 9,  [{key: "Deckyboard_Reserved", label: reserved_icon }, {key: "Deckyboard_NumpadAdd", label: "+"}]));
    keyList.push(KeyMapping.keyGen(3, 10, [{key: "Shift", label: fn_icon }])); //Deckyboard_Fn
    keyList.push(KeyMapping.keyGen(3, 11, [{key: "Deckyboard_Context", label: context_icon }]));
    keyList.push(KeyMapping.keyGen(3, 12, [{key: "Deckyboard_Reserved", label: reserved_icon }]));
    keyList.push(KeyMapping.keyGen(3, 13, [{key: "Deckyboard_RShift", label: "RShift",type: 8 }]));

    keyList.push(KeyMapping.keyGen(4, 0,  [{key: "SwitchKeys_Layout", label: layout_icon, type: 4 }]));
    keyList.push(KeyMapping.keyGen(4, 1,  [{key: "Deckyboard_LCtrl", label: "LCtrl", type: 6 }]));
    keyList.push(KeyMapping.keyGen(4, 2,  [{key: "Deckyboard_LMeta", label: meta_icon, type: 4 }]));
    keyList.push(KeyMapping.keyGen(4, 3,  [{key: "Deckyboard_LAlt", label: "LAlt", type: 6 }]));
    keyList.push(KeyMapping.keyGen(4, 4,  [{key: " ", label: " ", type: 10, leftActionButton: 3 }]));
    keyList.push(KeyMapping.keyGen(4, 5,  [{key: "Deckyboard_RAlt", label: "RAlt", type: 6 }]));
    keyList.push(KeyMapping.keyGen(4, 6,  [{key: "Deckyboard_RMeta", label: meta_icon, type: 4 }]));
    keyList.push(KeyMapping.keyGen(4, 7,  [{key: "Deckyboard_RCtrl", label: "RCtrl",type: 6 }]));
    keyList.push(KeyMapping.keyGen(4, 8,  [{key: "VKClose",   label: vkclose_icon, type: 5, }, {key: "VKMove", type: 5, label: "#Key_Move" }]));

    return keyList;
}