import { log } from "../../logger";
import { cloneDeep } from "lodash";
import { KeyDefinition } from "./KeyDefinition";
import { fixKeyboardTheming } from "../../style";




export class KeyMapping
{

    definition: KeyDefinition;
    positionX: number;
    positionY: number;
    keyCode: number;

    public constructor(positionX: number, positionY: number, definition: KeyDefinition, keyCode: number)
    {
        this.definition = definition;
        this.positionX = positionX;
        this.positionY = positionY;
        this.keyCode = keyCode;
    }

    //#region Keyboard Root
    public static init()
    {
        log("beforeLayoutClone", this.KEYBOARD_ROOT.stateNode.state.standardLayout);
        let clonedLayout = cloneDeep(this.KEYBOARD_ROOT.stateNode.state.standardLayout);
        
        //Special Patch to work with Valve's new Rules for Keys
        clonedLayout.refLayout = clonedLayout.rgLayout(this.KEYBOARD_ROOT.stateNode.GetLayoutOptions());
        clonedLayout.rgLayout_org = clonedLayout.rgLayout;
        clonedLayout.rgLayout = (e: any) => clonedLayout.refLayout;

        if (clonedLayout.rgKeycodes == undefined)
        {
            clonedLayout.rgKeycodes = new Array<Array<any>>();
            let layout = clonedLayout.refLayout as Array<Array<any>>;
            layout.forEach((row, positionY) =>
            {
                clonedLayout.rgKeycodes.push(new Array<any>());
                row.forEach((key) =>
                {
                    clonedLayout.rgKeycodes[positionY].push(0);
                });
            });
        }

        this.KEYBOARD_ROOT.stateNode.state.standardLayout = clonedLayout;

        log("afterLayoutClone", this.KEYBOARD_ROOT.stateNode.state.standardLayout);
    }

    public static KEYBOARD_ROOT: any;

    //#endregion
    //#region Layout / Key Generations
    public static addShiftKeys(key: string)
    {
        Object.defineProperty(this.KEYBOARD_ROOT.elementType.s_keyToggleData, key, { value: key, writable: true });
    }

    public static layoutGen(layout: Array<Array<any>>, keyCodes: Array<Array<number>>): Array<KeyMapping>
    {
        let resultingLayout = Array<KeyMapping>();
        layout.forEach((rowList, positionY) =>
        {
            rowList.forEach((key, positionX) =>
            {
                
                let keyCode = keyCodes[positionY][positionX] ? keyCodes[positionY][positionX] : 0;
                resultingLayout.push(KeyMapping.keyGen(positionY, positionX, key, keyCode));
            });
        });
        return resultingLayout;
    }

    public static keyGen(positionY: number, positionX: number, definition: any, keyCode: number = 0): KeyMapping
    {
        return new KeyMapping(positionX, positionY, KeyDefinition.fromAny(definition), keyCode);
    }

    //#endregion
    //#region Get / Set
    public static setKeyboardLayout(layout: Array<KeyMapping>)
    {
        var ref_standardLayout = KeyMapping.KEYBOARD_ROOT.stateNode.state.standardLayout;
        ref_standardLayout.refLayout = [[], [], [], [], []];
        ref_standardLayout.rgKeycodes = [[], [], [], [], []];

        var rowCounts: Array<number> = [];

        layout.forEach((mapping) =>
        {
            if (mapping === undefined)
                return;
            ref_standardLayout.refLayout[mapping.positionY].splice(mapping.positionX, 0, mapping?.definition.toInternal());
            ref_standardLayout.rgKeycodes[mapping.positionY].splice(mapping.positionX, 0, mapping?.keyCode);
        });

        ref_standardLayout.refLayout.forEach((mapping: Array<any>) => {
            rowCounts.push(mapping.length);
        });

        fixKeyboardTheming(layout, rowCounts);

        this.KEYBOARD_ROOT.stateNode.setState({ standardLayout: ref_standardLayout });
    }

    public static getKeyboardLayout(): Array<KeyMapping> | undefined
    {
        let clonedLayout = cloneDeep(this.KEYBOARD_ROOT.stateNode.state.standardLayout);

        let refLayout = clonedLayout.refLayout as Array<Array<any>>;
        let rgKeycodes = clonedLayout.rgKeycodes as Array<Array<any>>;

        if (refLayout && rgKeycodes)
        {
            return this.layoutGen(refLayout, rgKeycodes);
        }
        else
            return undefined;
    }

    public static setKeyboardKey(mapping: KeyMapping)
    {
        let [x, y] = [mapping.positionX, mapping.positionY];
        var ref_standardLayout = KeyMapping.KEYBOARD_ROOT.stateNode.state.standardLayout;
        ref_standardLayout.refLayout[y][x] = mapping.definition.toInternal();
        ref_standardLayout.rgKeycodes[y][x] = mapping.keyCode;
        this.KEYBOARD_ROOT.stateNode.setState({ standardLayout: ref_standardLayout });
    }

    public static getKeyboardKey(x: number, y: number): KeyMapping
    {
        let value = this.KEYBOARD_ROOT.stateNode.state.standardLayout.refLayout[y][x];
        let keyCode = this.KEYBOARD_ROOT.stateNode.state.standardLayout.rgKeycodes[y][x] ? this.KEYBOARD_ROOT.stateNode.state.standardLayout.rgKeycodes[y][x] : 0;
        return new KeyMapping(x, y, KeyDefinition.fromAny(value), keyCode);
    }

    //#endregion
    //#region Utilities
    public static insertKeyboardKey(mapping: KeyMapping | undefined)
    {
        if (mapping === undefined)
            return;
        var ref_standardLayout = KeyMapping.KEYBOARD_ROOT.stateNode.state.standardLayout;
        ref_standardLayout.refLayout[mapping.positionY].splice(mapping.positionX, 0, mapping?.definition.toInternal());
        ref_standardLayout.rgKeycodes[mapping.positionY].splice(mapping.positionX, 0, mapping?.keyCode);
        this.KEYBOARD_ROOT.stateNode.setState({ standardLayout: ref_standardLayout });
    }

    public static findKeyboardKey(query: (value: KeyMapping) => boolean): KeyMapping | undefined
    {
        for (let y = 0; y < this.KEYBOARD_ROOT.stateNode.state.standardLayout.refLayout.length; y++)
        {
            for (let x = 0; x < this.KEYBOARD_ROOT.stateNode.state.standardLayout.refLayout[y].length; x++)
            {
                let key = this.getKeyboardKey(x, y);
                if (query(key))
                    return key;
            }
        }

        return undefined;
    }

    public static changeLabelByKeyCode(keyCode: string, label: any)
    {
        let query = (value: KeyMapping) =>
        {
            var item = value.definition.keys.find(x => x.key === keyCode);
            if (item)
                return true;
            return false;
        };

        let result = this.findKeyboardKey(query);
        if (result === undefined)
            return;

        let index = result.definition.keys.findIndex(x => x.key === keyCode);
        if (index === -1)
            return;

        result.definition.keys[index].changeLabel(label);

        this.setKeyboardKey(result);
    }
    //#endregion

}
