import
{
	definePlugin,
	PanelSection,
	PanelSectionRow,
	ServerAPI,
	staticClasses
} from "decky-frontend-lib";
import { VFC } from "react";
import { FaKeyboard } from "react-icons/fa";
import * as python from './python';
import * as keyboard from './keyboard';
import { PluginSettings } from "./types/PluginSettings";
import * as style from "./style";
import { log } from "./logger";

const CONTENT: VFC<{ serverAPI: ServerAPI }> = ({ }) =>
{
	return (
		<PanelSection title="Panel Section">
			<PanelSectionRow>
			</PanelSectionRow>
		</PanelSection>
	);
};

const SETTINGS: PluginSettings = {
    dictation: {
        enabled: true,
    },
    style: {
        unlockKeyboardLength: false,
    },
	behavior: {
        dismissOnEnter: true,
		allowKeyRepeat: true,
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



export default definePlugin((serverApi: ServerAPI) =>
{
	function onDismount() {
		if (SETTINGS.logging.mount) log("unloaded");
		keyboard.onDismount();
	}

	function onMount() {
		if (SETTINGS.logging.mount) log("loaded");
		python.setServer(serverApi);
		style.setSettings(SETTINGS);
		keyboard.onMount(serverApi, SETTINGS);

		//serverApi.toaster.toast({
        //    title: "Deckyboard",
        //    body: "Plugin Loaded",
		//	duration: 1
        //});
	}

	onMount();

	return {
		title: <div className={staticClasses.Title}>DeckyBoard</div>,
		content: <CONTENT serverAPI={serverApi} />,
		icon: <FaKeyboard />,
		onDismount: onDismount,
	};
});



