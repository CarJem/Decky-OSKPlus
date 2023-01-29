import { findModuleChild } from "decky-frontend-lib";

const VirtualKeyboardManager = findModuleChild((m) => {
    if (typeof m !== "object") return undefined;
    for (let prop in m) {
        if (m[prop]?.m_WindowStore) 
            return m[prop].ActiveWindowInstance.VirtualKeyboardManager;
    }
});

export class DismissOnEnter
{ 
    public static ChangeState(state?: boolean) 
    {
        if (state !== undefined)
            VirtualKeyboardManager.m_bDismissOnEnter = state;
    }
}





