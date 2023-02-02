import { findSP } from "decky-frontend-lib";
import { KeyEntry, KeyMapping, KeyType } from "../types/key-mappings";
import { virtualKeyboardClasses } from '../types/personal-static-classes'
import { waitforCondition } from '../extensions';




export const MoveKeyCode: string = "VKMove";
const Orientations: string[] = ["center-bottom", "lower-right", "upper-right", "center-top", "upper-left", "lower-left"];
//const Orientations: string[] = ["center-bottom", "center-top"]
let LastOrientation: number = 0;

function GetLocations() : string[] {
    return KeyMapping.KeyboardRoot.stateNode.m_rgKeyboardLocations;
}

function GetCurrentLocation() : number {
    var locations = GetLocations();
    var nextLocation = GetNextLocation();
    var indexFunction = () => { return (nextLocation - 1) % locations.length };
    return indexFunction() < 0 ? locations.length + indexFunction() : indexFunction();
}

function GetNextLocation() : number {
    return KeyMapping.KeyboardRoot.stateNode.m_iNextKeyboardLocation;
}

export function Init()
{
    KeyMapping.KeyboardRoot.stateNode.m_rgKeyboardLocations = Orientations;

    let className = virtualKeyboardClasses.Keyboard;
    let osk = waitforCondition(() => findSP().document.getElementsByClassName(className)[0] as HTMLElement);
    if (osk) {
        Orientations.forEach((value) => {
            if (osk) osk.classList.remove(value);
        });
    
        osk.classList.add(GetLocations()[LastOrientation]);
    }

    KeyMapping.KeyboardRoot.stateNode.m_iNextKeyboardLocation = (LastOrientation + 1) % Orientations.length;
}

export function Save()
{
    LastOrientation = GetCurrentLocation();
}

export function FixVKClose()
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






