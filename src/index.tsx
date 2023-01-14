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
import * as keys from './keys';
import { Settings } from "./types/settings";

const Content: VFC<{ serverAPI: ServerAPI }> = ({ }) =>
{
	return (
		<PanelSection title="Panel Section">
			<PanelSectionRow>
			</PanelSectionRow>
		</PanelSection>
	);
};

const PluginSettings: Settings = {
	DictationEnabled: false,
	EnableFunctionKeys: false,
	EnableCtrlKey: false,
	EnableOrientationSwapKey: true
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
	python.setServer(serverApi);
	keys.setServer(serverApi);
	keys.setSettings(PluginSettings)
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
			if (instance) keys.PatchKeys(instance);
		}, 1000);
	}

	function OnDismount() {
		KeyboardOpenedCallback?.Unregister();
	}

	function OnMount() {
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



