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

    public KeycodeEquals(otherValue: any) : boolean 
    {
        if ((otherValue as KeyDefinition).key !== undefined && (this.definition as KeyDefinition).key === undefined) {
            var keyCodeA = (otherValue as KeyDefinition).key;
            var keyCodeB = (this.definition as KeyDefinition).key;
            return keyCodeA == keyCodeB;
        }

        return false; 
    }

    public Equals(otherValue: any) : boolean 
    {
        return otherValue == this.definition;
    }

    public GetDestinationX(KeyboardRoot: any) : number
    {
        let index = this.offset;
        if (this.target != null) {
            let targetIndex = KeyMapping.IndexOf(KeyboardRoot, this.row, this.target, this.offset);
        }
        return index;
    }
  
    public static IsCustomKey(value: any) : boolean
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
  
    public static IndexOf(KeyboardRoot: any, row: number, key: SupportedKeyTypes, offset?: number) : number | undefined
    {
        var x = 0;
        var length = KeyboardRoot.stateNode.state.standardLayout.rgLayout[row].length;
        while (x < length)
        {
            if (KeyboardRoot.stateNode.state.standardLayout.rgLayout[row][x] === key) {
                if (offset != undefined) {
                    var finalValue = x + offset;
                    if (finalValue + 1 >= length) return length;
                    else if (finalValue + 1 <= 0) return 0;
                    else return finalValue;
                }
            }
            else
                ++x;
        }
        return undefined;
    }
}