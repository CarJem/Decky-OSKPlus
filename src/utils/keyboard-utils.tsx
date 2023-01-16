import { OSK_Key, OSK_KeyLayout } from '../types/osk-key';

export function isCustomKey(value: any) : boolean
{
    if (value === undefined)
        return false;
    else if (value?.key) {
        return (value as OSK_Key).isCustom ?? false;
    }
    else if (value?.length) {
        if (value?.length >= 1) 
            return (value[0] as OSK_Key).isCustom ?? false;
    }
    return false;
}

export function IndexOf(KeyboardRoot: any, row: number, key: OSK_KeyLayout) : number | undefined
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
