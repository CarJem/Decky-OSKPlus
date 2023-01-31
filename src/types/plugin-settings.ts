export interface PluginSettings {
    dictation: {
        enabled: boolean;
    }
    style: {
        unlockKeyboardLength: boolean;
    }
	behavior: {
        dismissOnEnter: boolean;
        allowKeyRepeat: boolean;
    }
    logging: {
        events: boolean;
        init: boolean;
        mount: boolean;
        internalKeyType: boolean;
        virtualKeys: boolean; 
        keyType: boolean;
    }
    custom_layout: {
        override_layout_name: string;
        enabled: boolean;
    }
}