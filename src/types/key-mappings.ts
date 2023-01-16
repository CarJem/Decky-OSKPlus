import { OSK_KeyLayout } from "./osk-key";

export const CustomKeyPrefix = "SwitchKeys_Deckyboard_";

export class KeyMapping {
    definition: OSK_KeyLayout;
    row: number;
    offset: number;
    target: OSK_KeyLayout;

    constructor(row: number, offset: number, definition: OSK_KeyLayout, target: OSK_KeyLayout = null) 
    {
        this.row = row;
        this.offset = offset;
        this.target = target;
        this.definition = definition;
    }
}