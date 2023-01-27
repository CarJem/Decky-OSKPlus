import { log } from "../logger";
import { cloneDeep } from "lodash";

export enum KeyType {
    Null,
    Basic,
    Extended,
    Multiple
}

export class KeyEntry {
    keyType?: KeyType;
    isCustom?: boolean;
    key?: string;
    label?: any;
    type?: number;

    constructor(params: Partial<KeyEntry>) {
        Object.assign(this, params);
    }

    public changeLabel(value: any) {
        if (this.keyType === KeyType.Extended) {
            this.label = value;
        }
    }

    public static fromString(value: string) : KeyEntry {
        return new KeyEntry({ keyType: KeyType.Basic, key: value });
    }

    public static fromClass(value: KeyEntry) : KeyEntry {
        value.keyType = KeyType.Extended;
        return new KeyEntry(value);
    }

    public static fromNull() : KeyEntry {
        return new KeyEntry({ keyType: KeyType.Null });
    }

    public toInternal() : any {
        if (this.keyType === KeyType.Basic) {
            return this.key?.toString();
        }
        else if (this.keyType === KeyType.Extended) {
            return {
                'key': this.key,
                'label': this.label,
                'type': this.type,
            };
        }
        else return null;
    }
}

export class KeyDefinition {
    keyType: KeyType;
    keys: Array<KeyEntry>

    constructor(keyType: KeyType, keys: Array<KeyEntry>) {
        this.keyType = keyType;
        this.keys = keys;
    }

    public static fromCustom(value: Partial<KeyEntry>) : KeyDefinition {
        value.keyType = KeyType.Extended;
        let key = [new KeyEntry(value)];
        return new KeyDefinition(value.keyType, key);
    }

    public static fromAny(value: any) : KeyDefinition {
        let keyType = KeyType.Null;
        let keys = Array<KeyEntry>();

        if (typeof value === 'string') {
            keyType = KeyType.Basic;
            keys.push(KeyEntry.fromString(value as string));
        }
        else if ((value as KeyEntry)?.key !== undefined ?? false) {
            keyType = KeyType.Extended;
            keys.push(KeyEntry.fromClass(value as KeyEntry));
        }
        else if ((Array.isArray(value))) {
            keyType = KeyType.Multiple;
            value.forEach(function(item) {
                if (typeof item === 'string') {
                    keys.push(KeyEntry.fromString(item as string));
                }
                else if ((item as KeyEntry)?.key !== undefined ?? false) {
                    keys.push(KeyEntry.fromClass(item as KeyEntry));
                }
                else if (item === null) {
                    keys.push(KeyEntry.fromNull());
                }
            });
        }

        return new KeyDefinition(keyType, keys);
    }

    public toInternal() : any {
        if (this.keyType === KeyType.Null) 
            return null;
        else if (this.keyType === KeyType.Basic && this.keys.length === 1)
            return this.keys[0].key?.toString();
            else if (this.keyType === KeyType.Extended && this.keys.length === 1)
            return this.keys[0].toInternal();
        else if (this.keyType === KeyType.Multiple) {
            let returnArray = new Array<any>();
            this.keys.forEach(function(item) {
                returnArray.push(item.toInternal());
            });
            return returnArray;
        }
        else return undefined;
    }
}

export class KeyMapping {

    definition: KeyDefinition;
    positionX: number;
    positionY: number;

    public constructor(positionX: number, positionY: number, definition: KeyDefinition) {
        this.definition = definition;
        this.positionX = positionX;
        this.positionY = positionY;
    }

    //#region Keyboard Root

    public static prepareKeyboardRoot()
    {
        log("beforeLayoutClone", this.KeyboardRoot.stateNode.state.standardLayout);
        this.KeyboardRoot.stateNode.state.standardLayout = cloneDeep(this.KeyboardRoot.stateNode.state.standardLayout);
        log("afterLayoutClone", this.KeyboardRoot.stateNode.state.standardLayout);
    }

    public static KeyboardRoot: any;

    //#endregion

    public static setKeyboardKey(mapping: KeyMapping) {
        let [x, y] = [mapping.positionX, mapping.positionY];
        this.KeyboardRoot.stateNode.state.standardLayout.rgLayout[y][x] = mapping.definition.toInternal();
    }

    public static getKeyboardKey(x: number, y: number) : KeyMapping {
        let value = this.KeyboardRoot.stateNode.state.standardLayout.rgLayout[y][x];
        return new KeyMapping(x, y, KeyDefinition.fromAny(value));
    }

    public static insertKeyboardKey(mapping: KeyMapping | undefined)
    {
        if (mapping === undefined) return;
        this.KeyboardRoot.stateNode.state.standardLayout.rgLayout[mapping.positionY].splice(mapping.positionX, 0, mapping?.definition.toInternal());
    }

    public static findKeyboardKey(query: (value: KeyMapping) => boolean) : KeyMapping | undefined {
        for (let y = 0; y < this.KeyboardRoot.stateNode.state.standardLayout.rgLayout.length; y++) {
            for (let x = 0; x < this.KeyboardRoot.stateNode.state.standardLayout.rgLayout[y].length; x++) {
                let key = this.getKeyboardKey(x, y);
                if (query(key)) return key;
            }
        }

        return undefined;
    }

    public static changeLabelByKeyCode(keyCode: string, label: any)
    {
        let query = (value: KeyMapping) => {
            var item = value.definition.keys.find(x => x.key === keyCode);
            if (item) return true;
            return false;
        };

        let result = this.findKeyboardKey(query);
        if (result === undefined) return;

        let index = result.definition.keys.findIndex(x => x.key === keyCode);
        if (index === -1) return;
            
        result.definition.keys[index].changeLabel(label);

        this.setKeyboardKey(result);
    }
    
}