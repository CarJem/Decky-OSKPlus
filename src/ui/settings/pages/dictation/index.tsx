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
  import { FaFileArchive, FaLanguage, FaLink, FaMicrophone, FaReact, FaSteamSymbol, FaTerminal } from 'react-icons/fa';
import React from 'react';
import { useSetting } from '../../../../settings';
import { PluginSettings } from '../../../../types/PluginSettings';

export interface DictationSettingsProps {
  serverAPI: ServerAPI;
}

export default function DictationSettings(props: DictationSettingsProps) {
    const [enableDictation, setEnableDictation] = useSetting<boolean>(props.serverAPI, 'deckyboard.dictation.enable', true);
  
    return (
      <DialogBody>
        <DialogControlsSection>
          <Field
            label={'Enable Speech to Text'}
            description={
              <span style={{ whiteSpace: 'pre-line' }}>
                {'Allows you to speak via your voice to type text using '}{' '}
                <span style={{ color: 'lightblue' }}>{' nerd-dictation'}</span>
              </span>
            }
            icon={<FaMicrophone style={{ display: 'block' }} />}
          >
            <Toggle
              value={enableDictation}
              onChange={(toggleValue) => { setEnableDictation(toggleValue); PluginSettings.update(props.serverAPI); }}
            />
          </Field>
        </DialogControlsSection>
        <DialogControlsSection>
          <DialogControlsSectionHeader>
            {'Voice Models'}
          </DialogControlsSectionHeader>
          <Field
            label={'Download More Voice Models'}
            description={<span style={{ whiteSpace: 'pre-line' }}>{'Get more languages or use diffrent recognition patterns from other VOSK compatible voice models'}</span>}
            icon={<FaLanguage style={{ display: 'block' }} />}
          >
            <DialogButton
              onClick={() => {}}
            >
              {'Manage'}
            </DialogButton>
          </Field>
        </DialogControlsSection>
      </DialogBody>
    );
  }