import
{
	definePlugin,
	PanelSection,
	PanelSectionRow,
	ServerAPI,
	staticClasses,
	findModuleChild,
	findInReactTree,
	Dropdown,
	DropdownOption,
	ButtonItem,
	Focusable
} from "decky-frontend-lib";
import { VFC } from "react";
import { FaDownload, FaKeyboard } from "react-icons/fa";
import { log } from "./logger";
import * as python from './python';
import * as keyboard from './keyboard';
import { PluginSettings } from "./types/plugin-settings";
import * as style from "./style";
import { useState } from "react";

const options : DropdownOption[] = [
	{ label: "English", data: "vosk-model-small-en-us-0.15" },
	{ label: "Indian English", data: "vosk-model-small-en-in-0.4" },
	{ label: "Chinese", data: "vosk-model-small-cn-0.22" },
	{ label: "Russian", data: "vosk-model-small-ru-0.22" },
	{ label: "French", data: "vosk-model-small-fr-0.22" },
	{ label: "French (pguyot)", data: "vosk-model-small-fr-pguyot-0.3" },
	{ label: "German", data: "vosk-model-small-de-0.15" },
	{ label: "Spanish", data: "vosk-model-small-es-0.42" },
	{ label: "Portuguese", data: "vosk-model-small-pt-0.3" },
	{ label: "Turkish", data: "vosk-model-small-tr-0.3" },
	{ label: "Vietnamese", data: "vosk-model-small-vn-0.3" },
	{ label: "Italian", data: "vosk-model-small-it-0.22" },
	{ label: "Dutch", data: "vosk-model-small-nl-0.22" },
	{ label: "Catalan", data: "vosk-model-small-ca-0.4" },
	{ label: "Farsi", data: "vosk-model-small-fa-0.5" },
	{ label: "Ukrainian", data: "vosk-model-small-uk-v3-nano" },
	{ label: "Kazakh", data: "vosk-model-small-kz-0.15" },
	{ label: "Swedish", data: "vosk-model-small-sv-rhasspy-0.15" },
	{ label: "Japanese", data: "vosk-model-small-ja-0.22" },
	{ label: "Esperanto", data: "vosk-model-small-eo-0.42" },
	{ label: "Hindi", data: "vosk-model-small-hi-0.22" },
	{ label: "Czech", data: "vosk-model-small-cs-0.4-rhasspy" },
	{ label: "Uzbek", data: "vosk-model-small-uz-0.22" },
	{ label: "Korean", data: "vosk-model-small-ko-0.22" }
	]

const Content: VFC<{ serverAPI: ServerAPI }> = ({ serverAPI}) =>
{	
	const [modelOption, setModelOption] = useState(serverAPI.callPluginMethod("settings_get", {key: "voskModel", default:"vosk-model-small-en-us-0.15"})
	);

	return (
		<PanelSection title="DeckyBoard">
			<PanelSectionRow>
			<Focusable style={{ display: 'flex', maxWidth: '100%' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              minWidth: '100%',
              maxWidth: '100%',
            }}
          >
				<Dropdown               menuLabel="Model"
 rgOptions={options} selectedOption={modelOption} onChange={(x) => {
					setModelOption(x.data);
					serverAPI.callPluginMethod("settings_set", {key: "voskModel", value: x.data})
				}}></Dropdown>
				<ButtonItem>{FaDownload}</ButtonItem>
				</div>
				</Focusable>
			</PanelSectionRow>
			<PanelSectionRow>
				{modelOption}
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



