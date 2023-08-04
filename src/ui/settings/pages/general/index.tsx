import {
    DialogBody,
    DialogButton,
    DialogControlsSection,
    DialogControlsSectionHeader,
    Field,
    Navigation,
    ServerAPI,
    TextField,
    Toggle,
  } from 'decky-frontend-lib';
  import { useRef, useState } from 'react';
  import { FaDotCircle, FaFileArchive, FaLink, FaReact, FaSteamSymbol, FaTerminal } from 'react-icons/fa';
import React from 'react';
import { useSetting } from '../../../../settings';
import { PluginSettings } from '../../../../types/PluginSettings';

export interface GeneralSettingsProps {
    serverAPI: ServerAPI;
}

export default function GeneralSettings(props: GeneralSettingsProps) {
    const [unlockKeyboardLength, setUnlockKeyboardLength] = useSetting<boolean>(props.serverAPI, 'deckyboard.style.unlockKeyboardLength', false);

    const [dismissOnEnter, setDismissOnEnter] = useSetting<boolean>(props.serverAPI, 'deckyboard.behavior.dismissOnEnter', true);
    const [allowKeyRepeat, setAllowKeyRepeat] = useSetting<boolean>(props.serverAPI, 'deckyboard.behavior.allowKeyRepeat', true);

    //const [overrideLayoutName, setOverrideLayoutName] = useSetting<string>(props.serverAPI, 'deckyboard.custom_layout.override_layout_name', "qwerty_int");
    //const [customLayoutEnable, setCustomLayoutEnable] = useSetting<boolean>(props.serverAPI, 'deckyboard.custom_layout.enabled', true);


  
    return (
      <DialogBody>
        <DialogControlsSection>
          <DialogControlsSectionHeader>
            {'Style'}
          </DialogControlsSectionHeader>
          <Field label={'Unlock Keyboard Length'} description={''} icon={<FaDotCircle style={{ display: 'block' }} />}>
            <Toggle value={unlockKeyboardLength} onChange={(e) => { setUnlockKeyboardLength(e); PluginSettings.update(props.serverAPI); }}/>
          </Field>
        </DialogControlsSection>
        <DialogControlsSection>
          <DialogControlsSectionHeader>
            {'Behavior'}
          </DialogControlsSectionHeader>
          <Field label={'Dismiss Keyboard on Enter'} description={''} icon={<FaDotCircle style={{ display: 'block' }} />}>
            <Toggle value={dismissOnEnter} onChange={(e) => { setDismissOnEnter(e); PluginSettings.update(props.serverAPI); }}/>
          </Field>
          <Field label={'Allow Expanded Key Repeat'} description={''} icon={<FaDotCircle style={{ display: 'block' }} />}>
            <Toggle value={allowKeyRepeat} onChange={(e) => { setAllowKeyRepeat(e); PluginSettings.update(props.serverAPI); }}/>
          </Field>
        </DialogControlsSection>
      </DialogBody>
    );
  }