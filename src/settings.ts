import { ServerAPI } from "decky-frontend-lib";
import { useEffect, useState } from 'react';

interface GetSettingArgs<T> {
    key: string;
    default: T;
  }
  
interface SetSettingArgs<T> {
    key: string;
    value: T;
}

export async function getSetting<T>(serverAPI: ServerAPI, key: string, def: T): Promise<T> {
    const res = (await serverAPI.callServerMethod('get_setting', {
        key,
        default: def,
    } as GetSettingArgs<T>)) as { result: T };
    return res.result;
}

export async function setSetting<T>(serverAPI: ServerAPI, key: string, value: T): Promise<void> {
    await serverAPI.callServerMethod('set_setting', {
        key,
        value,
    } as SetSettingArgs<T>);
}

export function useSetting<T>(serverAPI: ServerAPI, key: string, def: T): [value: T, setValue: (value: T) => Promise<void>] {
  const [value, setValue] = useState(def);

  useEffect(() => {
    (async () => {
      const res = await getSetting<T>(serverAPI, key, def);
      setValue(res);
    })();
  }, []);

  return [
    value,
    async (val: T) => {
      setValue(val);
      await setSetting(serverAPI, key, val);
    },
  ];
}