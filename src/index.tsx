import
{
	definePlugin,
	PanelSection,
	PanelSectionRow,
	ServerAPI,
	staticClasses,
	findModuleChild,
	findInReactTree
} from "decky-frontend-lib";
import { VFC } from "react";
import { FaKeyboard } from "react-icons/fa";
import { log } from "./logger";
import * as python from './python';
import * as keyboard from './keyboard';
import { PluginSettings } from "./types/plugin-settings";
import * as style from "./style";

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
	UnlockKeyboardMaxLength: false
};

const KeyboardManager = findModuleChild((m) => {
	if (typeof m !== "object") return undefined;
	for (let prop in m) {
		if (m[prop]?.m_WindowStore) 
			return m[prop].ActiveWindowInstance.VirtualKeyboardManager;
	}
});

export default definePlugin((serverApi: ServerAPI) =>
{

	var KeyboardOpenedCallback: any;

	function OnCallback(e: boolean) {
		log("isOpened", e)
		if (!e) return;

		setTimeout(() => {
			let instance = findInReactTree(
				(document.getElementById('root') as any)._reactRootContainer._internalRoot.current, 
				((x) => x?.memoizedProps?.className?.startsWith('virtualkeyboard_Keyboard'))
			);			
			log("keyboardInstance", instance);
			if (instance) keyboard.Init(instance);
		}, 10);
	}

	function OnDismount() {
		KeyboardOpenedCallback?.Unregister();
	}

	function OnMount() {
		python.setServer(serverApi);
		keyboard.setServer(serverApi);
		keyboard.setSettings(Settings);
		style.setSettings(Settings);
		KeyboardOpenedCallback = KeyboardManager.m_bIsVirtualKeyboardOpen.m_callbacks.Register(OnCallback)
	}

	OnMount();

	return {
		title: <div className={staticClasses.Title}>DeckyBoard</div>,
		content: <Content serverAPI={serverApi} />,
		icon: <FaKeyboard />,
		onDismount: OnDismount,
	};
});



