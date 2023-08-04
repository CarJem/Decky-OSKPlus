import { ServerAPI, SidebarNavigation } from 'decky-frontend-lib';
import * as decky from 'decky-frontend-lib';
import { lazy } from 'react';
import { FaCode, FaKeyboard, FaMicrophone, FaPlug } from 'react-icons/fa';
import GeneralSettings from './pages/general';
import DictationSettings from './pages/dictation';
import React from 'react';


export interface SettingsPageProps {
    serverAPI: ServerAPI;
}

export default function SettingsPage(props: SettingsPageProps) {
  //const [isDeveloper, setIsDeveloper] = useSetting<boolean>('developer.enabled', false);
  //const { t } = useTranslation();
  
  const pages = [
    {
      title: 'General',
      content: <GeneralSettings serverAPI={props.serverAPI} />,
      route: '/deckyboard/settings/general',
      icon: <FaKeyboard />
    },
    {
        title: 'Dictation',
        content: <DictationSettings serverAPI={props.serverAPI} />,
        route: '/deckyboard/settings/dictation',
        icon: <FaMicrophone />
      },
  ];

  return <SidebarNavigation pages={pages} />;
}