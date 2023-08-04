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
import * as QAM from "./ui/qam"
import SettingsPage from './ui/settings/index'

const CONTENT: VFC<{ serverAPI: ServerAPI }> = QAM.default;



export default definePlugin((serverApi: ServerAPI) =>
{
	

	function onDismount() {
		if (PluginSettings.data.logging.mount) log("unloaded");
		keyboard.onDismount();
	}

	async function onMount() {
		await PluginSettings.init(serverApi);
		if (PluginSettings.data.logging.mount) log("loaded");
		python.setServer(serverApi);
		keyboard.onMount(serverApi);

		serverApi.routerHook.addRoute("/deckyboard/settings", () => (
			<SettingsPage serverAPI={serverApi}></SettingsPage>
		));
	}

	onMount();

	return {
		title: <div className={staticClasses.Title}>DeckyBoard</div>,
		content: <CONTENT serverAPI={serverApi} />,
		icon: <FaKeyboard />,
		onDismount: onDismount,
	};
});



