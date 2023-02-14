import { findSP } from "decky-frontend-lib";
import { KeyEntry } from '../types/key-mapping/KeyEntry';
import { KeyMapping } from '../types/key-mapping/KeyMapping';
import { KeyType } from '../types/key-mapping/KeyType';
import { DeckySendMode } from "../types/decky-keys/DeckySendMode";
import { virtualKeyboardClasses } from '../types/extensions/ValveExt'
import { waitforCondition } from '../extensions';




export const KEY_CODE: string = "VKMove";
const ORIENTATIONS: string[] = ["center-bottom", "lower-right", "upper-right", "center-top", "upper-left", "lower-left"];
//const Orientations: string[] = ["center-bottom", "center-top"]
let lastOrientation: number = 0;

function getLocations() : string[] {
    return KeyMapping.KEYBOARD_ROOT.stateNode.m_rgKeyboardLocations;
}

function getCurrentLocation() : number {
    var locations = getLocations();
    var nextLocation = getNextLocation();
    var indexFunction = () => { return (nextLocation - 1) % locations.length };
    return indexFunction() < 0 ? locations.length + indexFunction() : indexFunction();
}

function getNextLocation() : number {
    return KeyMapping.KEYBOARD_ROOT.stateNode.m_iNextKeyboardLocation;
}

export function init()
{
    KeyMapping.KEYBOARD_ROOT.stateNode.m_rgKeyboardLocations = ORIENTATIONS;

    let className = virtualKeyboardClasses.Keyboard;
    let osk = waitforCondition(() => findSP().document.getElementsByClassName(className)[0] as HTMLElement);
    if (osk) {
        ORIENTATIONS.forEach((value) => {
            if (osk) osk.classList.remove(value);
        });
    
        osk.classList.add(getLocations()[lastOrientation]);
    }

    KeyMapping.KEYBOARD_ROOT.stateNode.m_iNextKeyboardLocation = (lastOrientation + 1) % ORIENTATIONS.length;
}

export function save()
{
    lastOrientation = getCurrentLocation();
}

export function injectKey()
{
    var query = (value: KeyMapping) =>
    {
        if (value.definition.keyType === KeyType.Multiple
            && value.definition.keys.length === 2
            && value.definition.keys[0].key === "VKClose")
        {
            return true;
        }
        return false;
    };
    var result = KeyMapping.findKeyboardKey(query);
    if (result)
    {
        result.definition.keys[1] = new KeyEntry({
            key: 'VKMove',
            deckyType: KeyType.Extended,
            label: '#Key_Move',
            type: 5
        });
        KeyMapping.setKeyboardKey(result);
    }
}






