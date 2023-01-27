import { findSP } from "decky-frontend-lib";
import { KeyEntry, KeyMapping, KeyType } from "../types/key-mappings";
import { virtualKeyboardClasses } from '../types/personal-static-classes'

export class MoveKey
{


    public static readonly MoveKeyCode: string = "VKMove";
    private static LastOrientation: string = "center-bottom";

    public static SaveOrientation()
    {
        let className = virtualKeyboardClasses.Keyboard;
        let osk = findSP().document.getElementsByClassName(className)[0] as HTMLElement;

        if (osk.classList.contains("center-top"))
            this.LastOrientation = "center-top";
        else if (osk.classList.contains("center-bottom"))
            this.LastOrientation = "center-bottom";
        else if (osk.classList.contains("lower-left"))
            this.LastOrientation = "lower-left";
        else if (osk.classList.contains("lower-right"))
            this.LastOrientation = "lower-right";
        else if (osk.classList.contains("upper-left"))
            this.LastOrientation = "upper-left";
        else if (osk.classList.contains("upper-right"))
            this.LastOrientation = "upper-right";
    }
    public static LoadOrientation() 
    {
        let className = virtualKeyboardClasses.Keyboard;
        let osk = findSP().document.getElementsByClassName(className)[0] as HTMLElement;
        if (osk)
        {
            osk.classList.remove("center-top");
            osk.classList.remove("center-bottom");
            osk.classList.remove("lower-left");
            osk.classList.remove("lower-right");
            osk.classList.remove("upper-left");
            osk.classList.remove("upper-right");

            osk.classList.add(this.LastOrientation);
        }
    }
    public static FixVKClose()
    {
        var query = (value: KeyMapping) => {
            if (value.definition.keyType === KeyType.Multiple 
                && value.definition.keys.length === 2
                && value.definition.keys[0].key === "VKClose") {
                    return true;
                }
            return false;
        };
        var result = KeyMapping.findKeyboardKey(query);
        if (result) {
            result.definition.keys[1] = new KeyEntry({
                key: 'VKMove',
                keyType: KeyType.Extended,
                label: '#Key_Move',
                type: 5
            });
            KeyMapping.setKeyboardKey(result);
        }
    }
}





