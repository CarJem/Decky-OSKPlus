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
            let targetIndex = KeyMapping.IndexOf(KeyboardRoot, this.row, this.target);
            if (targetIndex) index = targetIndex + this.offset;
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
  
    public static IndexOf(KeyboardRoot: any, row: number, key: SupportedKeyTypes) : number | undefined
    {
        var x = 0;
        while (x < KeyboardRoot.stateNode.state.standardLayout.rgLayout[row].length)
        {
            if (KeyboardRoot.stateNode.state.standardLayout.rgLayout[row][x] === key)
              return x;
            else
                ++x;
        }
        return undefined;
    }
}