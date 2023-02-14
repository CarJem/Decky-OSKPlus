import { findModuleChild } from "decky-frontend-lib";

const VIRTUAL_KEYBOARD_MANAGER = findModuleChild((m) => {
    if (typeof m !== "object") return undefined;
    for (let prop in m) {
        if (m[prop]?.m_WindowStore) 
            return m[prop].ActiveWindowInstance.VirtualKeyboardManager;
    }
});

export class DismissOnEnter
{ 
    public static changeState(state?: boolean) 
    {
        if (state !== undefined)
            VIRTUAL_KEYBOARD_MANAGER.m_bDismissOnEnter = state;
    }
}





