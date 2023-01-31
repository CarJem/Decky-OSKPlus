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
import { PluginSettings } from "./types/plugin-settings";
import * as style from "./style";
import { log } from "./logger";

const Content: VFC<{ serverAPI: ServerAPI }> = ({ }) =>
{
	return (
		<PanelSection title="Panel Section">
			<PanelSectionRow>
			</PanelSectionRow>
		</PanelSection>
	);
};

const Settings: PluginSettings = {
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
	},
	custom_layout: {
		override_layout_name: "qwerty_int",
		enabled: true
	}
};



export default definePlugin((serverApi: ServerAPI) =>
{
	function OnDismount() {
		if (Settings.logging.mount) log("unloaded");
		keyboard.OnDismount();
	}

	function OnMount() {
		if (Settings.logging.mount) log("loaded");
		python.setServer(serverApi);
		style.setSettings(Settings);
		keyboard.OnMount(serverApi, Settings);

		//serverApi.toaster.toast({
        //    title: "Deckyboard",
        //    body: "Plugin Loaded",
		//	duration: 1
        //});
	}

	OnMount();

	return {
		title: <div className={staticClasses.Title}>DeckyBoard</div>,
		content: <Content serverAPI={serverApi} />,
		icon: <FaKeyboard />,
		onDismount: OnDismount,
	};
});



