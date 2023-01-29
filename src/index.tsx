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
	Focusable,
	ButtonItem,
	showModal
} from "decky-frontend-lib";
import { VFC } from "react";
import { FaKeyboard } from "react-icons/fa";
import { log } from "./logger";
import * as python from './python';
import * as keyboard from './keyboard';
import { PluginSettings } from "./types/plugin-settings";
import * as style from "./style";
import { useState } from "react";
import models from "./models";

import ModelManagerModal from "./modals/ModelManagerModal";
import { useEffect } from "react";



const Content: VFC<{ serverAPI: ServerAPI }> = ({ serverAPI}) =>
{	
	const [modelOptions, setModelOptions] = useState([] as DropdownOption[]);

	const [selectedModel, setSelectedModel] = useState();

useEffect(() => {

	serverAPI.callPluginMethod("settings_get", {key: "voskModel", default:"vosk-model-small-en-us-0.15"}).then((x => {
		console.log(x);
	}))

	serverAPI.callPluginMethod("getModels", {}).then((x) => {
		var results = x.result as string[];
		const opts: DropdownOption[] = []; 
		results.forEach(x=> {
			if (models[x]){
				opts.push({label: models[x], data: x});
			}else {
				opts.push({label: x, data: x});
			}
		})
		setModelOptions(opts);	
	})


},[])



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
				<Dropdown menuLabel="Model"
 rgOptions={modelOptions} selectedOption={selectedModel} onChange={(x) => {
				setSelectedModel(x.data);
					serverAPI.callPluginMethod("settings_set", {key: "voskModel", value: x.data})
				}}></Dropdown>
				</div>
				</Focusable>
			</PanelSectionRow>
			<PanelSectionRow>
				<ButtonItem onClick={() => {
					showModal(<ModelManagerModal serverAPI={serverAPI}/>, window)
				}}>Manage Models</ButtonItem>
				{selectedModel}
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



