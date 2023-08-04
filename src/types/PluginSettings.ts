import { ServerAPI } from "decky-frontend-lib";
import { getSetting } from "../settings";

export interface PluginSettingsImpl {
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
        afterInternalKeyType: boolean;
    }
    custom_layout: {
        override_layout_name: string;
        enabled: boolean;
    }
}

export class PluginSettings {
    private static serverAPI: ServerAPI;
    private static settingsCache: PluginSettingsImpl;

    static async init(e: ServerAPI) {
        PluginSettings.serverAPI = e;
        await PluginSettings.internal_getPluginSettings(PluginSettings.serverAPI);
    }

    static async update(e: ServerAPI) {
        await PluginSettings.internal_getPluginSettings(e);
    }

    static get data(): PluginSettingsImpl {
        return PluginSettings.settingsCache;
    }

    private static async internal_getPluginSettings(serverAPI: ServerAPI): Promise<void> {
        let dictation_enabled = await getSetting(serverAPI, 'deckyboard.dictation.enable', true);
        let style_unlockKeyboardLength = await getSetting(serverAPI, 'deckyboard.style.unlockKeyboardLength', false);
        let behavior_dismissOnEnter = await getSetting(serverAPI, 'deckyboard.behavior.dismissOnEnter', true);
        let behavior_allowKeyRepeat = await getSetting(serverAPI, 'deckyboard.behavior.allowKeyRepeat', true);

        PluginSettings.settingsCache = {
            dictation: {
                enabled: dictation_enabled
            },
            style: {
                unlockKeyboardLength: style_unlockKeyboardLength,
            },
            behavior: {
                dismissOnEnter: behavior_dismissOnEnter,
                allowKeyRepeat: behavior_allowKeyRepeat,
            },
            logging: {
                events: false,
                init: false,
                mount: false,
                internalKeyType: false,
                keyType: false,
                virtualKeys: false,
                afterInternalKeyType: true,
            },
            custom_layout: {
                override_layout_name: "qwerty_int",
                enabled: true
            }
        };
    }
}