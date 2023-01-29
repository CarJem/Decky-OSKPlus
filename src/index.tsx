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
	DictationEnabled: true,
	EnableFunctionKeys: false,
	EnableCtrlKey: false,
	EnableAltKey: false,
	EnableEscKey: false,
	EnableOrientationSwapKey: true,
	UnlockKeyboardMaxLength: false,
	DismissOnEnter: false
};



export default definePlugin((serverApi: ServerAPI) =>
{
	function OnDismount() {
		log("unloaded");
		keyboard.OnDismount();
	}

	function OnMount() {
		log("loaded");
		python.setServer(serverApi);
		style.setSettings(Settings);
		keyboard.OnMount(serverApi, Settings);
	}

	OnMount();

	return {
		title: <div className={staticClasses.Title}>DeckyBoard</div>,
		content: <Content serverAPI={serverApi} />,
		icon: <FaKeyboard />,
		onDismount: OnDismount,
	};
});



