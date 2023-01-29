import { sleep } from "decky-frontend-lib";
import { log } from "../logger";
import { KeyMapping } from "../types/key-mappings";

export class KeyRepeat
{

    private static RepeatableKeys: Array<string> = ['Backspace', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];
    private static LongPressAllowedKeys : Array<string> = ['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];
    public static readonly RepeatableKeyCode = -1;

    public static IsRepeatable(strKey: string)
    {
        return this.RepeatableKeys.includes(strKey);
    }
    public static Trigger(strKey: string)
    {
        setTimeout(() => this.Run(strKey, this.LongPressAllowedKeys.includes(strKey)), 0);
    }

    private static async Run(strKey: string, allowLongPress: boolean) {
        await sleep(750);
        let state = () => {return KeyMapping.KeyboardRoot.stateNode.state;};
    
        if (state().keyDown.key) {
            while (state().keyDown.key == strKey) {
                if (state().bLongPressSentKey == true && !allowLongPress) break;
                log("state", state());
                KeyMapping.KeyboardRoot.stateNode.TypeKeyInternal({strKey: strKey, strKeycode: this.RepeatableKeyCode});
                await sleep(100);
            }
        }
    }
}





