import { KeyType } from "./KeyType";


export class KeyEntry
{
    toKeyCode(): any
    {
        throw new Error("Method not implemented.");
    }
    deckyType?: KeyType;
    isCustom?: boolean;
    key?: string;
    label?: any;
    type?: number;
    leftActionButton?: number;
    rightActionButton?: number;
    isDead?: boolean;

    constructor(params: Partial<KeyEntry>)
    {
        Object.assign(this, params);
    }

    public changeLabel(value: any)
    {
        if (this.deckyType === KeyType.Extended)
        {
            this.label = value;
        }
    }

    public static fromString(value: string): KeyEntry
    {
        return new KeyEntry({ deckyType: KeyType.Basic, key: value });
    }

    public static fromClass(value: KeyEntry): KeyEntry
    {
        value.deckyType = KeyType.Extended;
        return new KeyEntry(value);
    }

    public static fromNull(): KeyEntry
    {
        return new KeyEntry({ deckyType: KeyType.Null });
    }

    public toInternal(): any
    {
        if (this.deckyType === KeyType.Basic)
        {
            return this.key?.toString();
        }
        else if (this.deckyType === KeyType.Extended)
        {
            return {
                'key': this.key,
                'label': this.label,
                'type': this.type,
                'leftActionButton': this.leftActionButton,
                'rightActionButton': this.rightActionButton,
                'isDead': this.isDead,
            };
        }
        else
            return null;
    }
}
