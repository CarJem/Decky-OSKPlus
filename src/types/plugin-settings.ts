export interface PluginSettings {
    DictationEnabled: boolean;
    EnableFunctionKeys: boolean;
    EnableCtrlKey: boolean;
    EnableAltKey: boolean;
    EnableEscKey: boolean;
    EnableOrientationSwapKey: boolean;
    UnlockKeyboardMaxLength: boolean;
    DismissOnEnter: boolean;
    logging: {
        events: boolean;
        init: boolean;
        mount: boolean;
        internalKeyType: boolean;
        virtualKeys: boolean; 
        keyType: boolean;
    }
}