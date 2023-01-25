export const CustomKeyPrefix = "SwitchKeys_Deckyboard_";

export type SupportedKeyTypes =
  | string
  | KeyDefinition
  | null
  | Array<KeyDefinition | string | null>;

export type KeyDefinition =
{
    isCustom?: boolean;
    key: string;
    label: any;
    type: number;
}

export class KeyMapping 
{
    definition: SupportedKeyTypes;
    row: number;
    offset: number;
    target: SupportedKeyTypes;

    constructor(row: number, offset: number, definition: SupportedKeyTypes, target: SupportedKeyTypes = null) 
    {
        this.row = row;
        this.offset = offset;
        this.target = target;
        this.definition = definition;
    }

    public isSameKeycode(otherValue: any) : boolean 
    {
        var keyA = KeyMapping.tryGetKeycode(otherValue);
        var keyB = KeyMapping.tryGetKeycode(this.definition);
        if (keyA !== undefined && keyB !== undefined) {
            return keyA === keyB;
        }
        return false; 
    }
    public getDestinationX(KeyboardRoot: any) : number
    {
        let index = this.offset;
        if (this.target != null) {
            let targetIndex = KeyMapping.getIndex(KeyboardRoot, this.row, this.target, this.offset);
            if (targetIndex) index = targetIndex;
        }
        return index;
    }
  
    public static isCustomKey(value: any) : boolean
    {
        if (value === undefined)
            return false;
        else if (value?.key) {
            return (value as KeyDefinition).isCustom ?? false;
        }
        else if (value?.length) {
            if (value?.length >= 1) 
                return (value[0] as KeyDefinition).isCustom ?? false;
        }
        return false;
    }
    public static doKeycodesMatch(a: any, b: any) : boolean {
        var keyA = KeyMapping.tryGetKeycode(a);
        var keyB = KeyMapping.tryGetKeycode(b);
        if (keyA !== undefined && keyB !== undefined) {
            return keyA === keyB;
        }
        return false; 
    }

    public static tryGetKeycode(value: any) : String | undefined {
        var castedValue = this.tryCastDefinition(value);
        if (castedValue) {
            if ((castedValue as KeyDefinition).key !== undefined)
                return (castedValue as KeyDefinition).key;
            if ((castedValue as string).valueOf() !== undefined)
                return (castedValue as string).valueOf();
        }
        return undefined;
    }
    public static tryCastDefinition(value: any) : SupportedKeyTypes | undefined {
        return (value as SupportedKeyTypes);
    }

    public static getIndex(KeyboardRoot: any, row: number, key: SupportedKeyTypes, offset?: number) : number | undefined
    {
        var x = 0;
        var length = KeyboardRoot.stateNode.state.standardLayout.rgLayout[row].length;
        while (x < length)
        {           
            let currKey = KeyboardRoot.stateNode.state.standardLayout.rgLayout[row][x];
            if (this.doKeycodesMatch(currKey, key)) {
                if (offset != undefined) {
                    var finalValue = x + offset;
                    if (finalValue + 1 >= length) return length;
                    else if (finalValue + 1 <= 0) return 0;
                    else return finalValue;
                }
                else return x;
            }
            else
                ++x;
        }
        return undefined;
    }
}