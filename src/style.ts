import { findSP } from "decky-frontend-lib";
import { PluginSettings } from "./types/PluginSettings";
import { virtualKeyboardClasses } from './types/extensions/ValveExt'
import { waitforCondition } from "./extensions";
import { KeyMapping } from "./types/key-mapping/KeyMapping";


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

var spectrumColors : Array<Array<string>> = [
    ['#6E143A', '#6c143880'],
    ['#6E145A', '#6e145a80'],
    ['#57146E', '#57146e80'],
    ['#36146E', '#36146e80'],
    ['#14186E', '#14186e80'],
    ['#14336E', '#14336e80'],
    ['#144E6E', '#144e6e80'],
    ['#146E6E', '#146e6e80'],
    ['#146E48', '#146e4880'],
    ['#1B6E14', '#1b6e1480'],
    ['#5C6E14', '#5c6e1480'],
    ['#6E5A14', '#6e5a1480']
];

var candyColors : Array<Array<string>> = [
    ['#008cff63', '#0065bcbf', '#012d6617', '#bcd4ffa8', '#012ba05c'],
    ['#91d6dcc9', '#64a0a9d4', '#01576617', '#71d5e39e', '#019ba054'],
    ['#6cdd68c9', '#31a127d4', '#01660917', '#71e3849e', '#01a00e54'],
    ['#ffd1008f', '#ecd40080', '#665f0117', '#fdefb1', '#a0900154'],
    ['#f59a1363', '#ff880094', '#663a0127', '#ffd8a5', '#a05b0154'],
    ['#fe000047', '#bf00009e', '#66010117', '#ffb3b3', '#a0010154'],
    ['#df76bf5c', '#ff00a98f', '#66013c17', '#ffc7ee9e', '#a0016b54'],
    ['#1900ff30', '#3200bc8a', '#17016617', '#d9bcff', '#3e01a05c']
];

var candyIndex = 0;



function getSpectrumColors(keyName: string, position: number, rowLength: number) {

    var result = ['', ''];
    switch (keyName) {
        case "Deckyboard_Dictate":
            result = spectrumColors[0];
            break;   
        case "Deckyboard_LMeta":
            result = spectrumColors[0];
            break;   
        case "Deckyboard_LAlt":
            result = spectrumColors[0];
            break;   
        case "Deckyboard_RAlt":
            result = spectrumColors[7];
            break;   
        default:
            let NewMax = spectrumColors.length;
            let NewMin = 0;
        
            let OldMax = rowLength;
            let OldMin = 0;
        
            let OldValue = position;
        
            let OldRange = (OldMax - OldMin)  
            let NewRange = (NewMax - NewMin)  
            let NewValue = Math.round((((OldValue - OldMin) * NewRange) / OldRange) + NewMin)
            result = spectrumColors[NewValue];
            break;
    }



    return result;
}

function getSpectrumStyle(keyName: string, position: number, rowLength: number) {
    let spectrum_colors = getSpectrumColors(keyName, position, rowLength);
    let css = `.Spectrum .virtualkeyboard_KeyboardKey_2KhPX.KeyTheme_${keyName} {
        color: #ffffff;
        background-color: ${spectrum_colors[0]};
    }
    
    .Spectrum .virtualkeyboard_KeyboardKey_2KhPX.KeyTheme_${keyName}.virtualkeyboard_Focused_21EoN {
        color: ${spectrum_colors[0]};
        background-color: #ffffff
    }
    
    .Spectrum .virtualkeyboard_KeyboardKey_2KhPX.KeyTheme_${keyName}.virtualkeyboard_Touched_3UFQq {
        color: #ffffff;
        background-color: ${spectrum_colors[1]};
    }`;
    return css;
}

function getCandyColors(keyName: string, position: number, rowLength: number) {
    if (candyIndex >= candyColors.length - 1) candyIndex = 0;
    let result = candyColors[candyIndex];
    candyIndex += 1;
    return result;
}

function getCandyStyle(keyName: string, position: number, rowLength: number) {
    let candyColors = getCandyColors(keyName, position, rowLength);
    let css = `.Candy .virtualkeyboard_KeyboardKey_2KhPX.KeyTheme_${keyName} {
        border-radius: 22px;
        box-sizing: border-box;
        border: 1px solid #ababab;
        background: linear-gradient(45deg, #ffffff 0%, #cacaca 100%);
        box-shadow: 0px 0px 0px 2px #67676717, inset 0px 1px 0px 0px #ffffffad, inset 0px -1px 0px 0 #a5a5a554;
    }

    .Candy .virtualkeyboard_KeyboardKey_2KhPX.KeyTheme_${keyName}.virtualkeyboard_Focused_21EoN {
        border: 1px solid #ababab;
        background: linear-gradient(45deg, ${candyColors[0]} 0%, ${candyColors[1]} 100%);
        box-shadow: 0px 0px 0px 2px ${candyColors[2]}, inset 0px 1px 0px 0px ${candyColors[3]}, inset 0px -1px 0px 0 ${candyColors[4]};
    }

    .Candy .virtualkeyboard_KeyboardKey_2KhPX.KeyTheme_${keyName}:focus {
        border: 1px solid #ababab;
        background: linear-gradient(45deg, ${candyColors[0]} 0%, ${candyColors[1]} 100%);
        box-shadow: 0px 0px 0px 2px ${candyColors[2]}, inset 0px 1px 0px 0px ${candyColors[3]}, inset 0px -1px 0px 0 ${candyColors[4]};
    }

    .Candy .virtualkeyboard_KeyboardKey_2KhPX.KeyTheme_${keyName}.virtualkeyboard_Touched_3UFQq {
        border: 1px solid #ababab;
        background: linear-gradient(45deg, ${candyColors[0]} 0%, ${candyColors[1]} 100%);
        box-shadow: 0px 0px 0px 2px ${candyColors[2]}, inset 0px -1px 0px 0px ${candyColors[3]}, inset 0px 1px 0px 0 ${candyColors[4]}, inset 0px 2px 0px 0 #00000024, inset 0px -3px 15px 6px #0000001f;
    }

    .Candy .virtualkeyboard_KeyboardKey_2KhPX.KeyTheme_${keyName}:active {
        border: 1px solid #ababab;
        background: linear-gradient(45deg, ${candyColors[0]} 0%, ${candyColors[1]} 100%);
        box-shadow: 0px 0px 0px 2px ${candyColors[2]}, inset 0px -1px 0px 0px ${candyColors[3]}, inset 0px 1px 0px 0 ${candyColors[4]}, inset 0px 2px 0px 0 #00000024, inset 0px -3px 15px 6px #0000001f;
    }`;
    return css;
}

function fixKeyTheming(mapping: KeyMapping, rowCounts: Array<number>) {

    let cssList = new Array<string>();

    mapping.definition.keys.forEach((x) => {
        let keyName = x.key;
        if (keyName?.startsWith('Deckyboard_')) {
            let spectrum = getSpectrumStyle(keyName, mapping.positionX, rowCounts[mapping.positionY]);
            let candy = getCandyStyle(keyName, mapping.positionX, rowCounts[mapping.positionY]);
            cssList.push(spectrum);
            cssList.push(candy);
        }
    });

    return cssList;
}

export function fixKeyboardTheming(layout: Array<KeyMapping>, rowCounts: Array<number>) {
    var sp = findSP();
    
    var sheetToBeRemoved = sp.document.getElementById('deckyboard_stylesheet');
    if (sheetToBeRemoved) {
        var sheetParent = sheetToBeRemoved.parentNode;
        if (sheetParent) sheetParent.removeChild(sheetToBeRemoved);
    }

    candyIndex = 0;
    let cssRules = new Array<string>();
    layout.forEach((mapping) =>
    {
        if (mapping === undefined)
            return;
        else {
            let style = fixKeyTheming(mapping, rowCounts);
            style.forEach(x => cssRules.push(x));
        }
    });

    var sp = findSP();
    var head = sp.document.head;
    var sheet = sp.document.createElement('style');
    sheet.setAttribute("id", "deckyboard_stylesheet");
    sheet.innerHTML = cssRules.join('\r\n');
    head.appendChild(sheet);
}