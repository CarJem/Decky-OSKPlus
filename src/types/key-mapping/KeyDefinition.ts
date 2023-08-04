import { KeyType } from "./KeyType";
import { KeyEntry } from "./KeyEntry";


export class KeyDefinition
{

    keyType: KeyType;
    keys: Array<KeyEntry>;

    constructor(keyType: KeyType, keys: Array<KeyEntry>)
    {
        this.keyType = keyType;
        this.keys = keys;
    }

    public static fromCustom(value: Partial<KeyEntry>): KeyDefinition
    {
        value.deckyType = KeyType.Extended;
        let key = [new KeyEntry(value)];
        return new KeyDefinition(value.deckyType, key);
    }

    public static fromAny(value: any): KeyDefinition
    {
        let keyType = KeyType.Null;
        let keys = Array<KeyEntry>();

        if (typeof value === 'string')
        {
            keyType = KeyType.Basic;
            keys.push(KeyEntry.fromString(value as string));
        }
        else if ((value as KeyEntry)?.key !== undefined ?? false)
        {
            keyType = KeyType.Extended;
            keys.push(KeyEntry.fromClass(value as KeyEntry));
        }
        else if ((Array.isArray(value)))
        {
            keyType = KeyType.Multiple;
            value.forEach(function (item)
            {
                if (typeof item === 'string')
                {
                    keys.push(KeyEntry.fromString(item as string));
                }
                else if ((item as KeyEntry)?.key !== undefined ?? false)
                {
                    keys.push(KeyEntry.fromClass(item as KeyEntry));
                }
                else if (item === null)
                {
                    keys.push(KeyEntry.fromNull());
                }
            });
        }

        return new KeyDefinition(keyType, keys);
    }

    public toInternal(): any
    {
        if (this.keyType === KeyType.Null)
            return null;
        else if (this.keyType === KeyType.Basic && this.keys.length === 1)
            return this.keys[0].key?.toString();
        else if (this.keyType === KeyType.Extended && this.keys.length === 1)
            return this.keys[0].toInternal();
        else if (this.keyType === KeyType.Multiple)
        {
            let returnArray = new Array<any>();
            this.keys.forEach(function (item)
            {
                returnArray.push(item.toInternal());
            });
            return returnArray;
        }
        else
            return undefined;
    }
}
