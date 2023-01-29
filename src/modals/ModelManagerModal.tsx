import {
  ButtonItem,
  ConfirmModal,
  Field,
  ServerAPI,
  Spinner,
} from "decky-frontend-lib";
import { useState } from "react";
import { useEffect } from "react";
import { FunctionComponent } from "react";
import { FaDownload } from "react-icons/fa";
import models from "../models";


interface ModelManagerModalProps {
  closeModal?(): void;
  serverAPI: ServerAPI;
}


const ModelManagerModal: FunctionComponent<ModelManagerModalProps> = ({
  closeModal,
  serverAPI
}) => {

    const [installedModelList, setInstalledModelList]= useState([] as string[]);
    const [downloading, setDownloading] = useState([] as string[]);

    function getModels(){
        serverAPI.callPluginMethod("getModels", {}).then((x) => {
            setInstalledModelList(x.result as string[])
        })
    
    useEffect(() => {
        getModels()
    }, [])


}


  return (
    <ConfirmModal onOK={closeModal} bCancelDisabled={false}>


      {Object.keys(models).map((key) => {
        const isDownloading = downloading.includes(key);
        const isInstalled = installedModelList.includes(key);
        return (<Field label={models[key]}>
          <ButtonItem layout="below" disabled={isInstalled || isDownloading} key={`${key}-down-btn`} onClick={async () => {
            setDownloading([...downloading, key])
            await serverAPI.callPluginMethod("downloadVoskModel", {modelName: key})
            setDownloading(downloading.filter(e => e !== key))
            getModels();
            }}>{isDownloading ?  <Spinner style={{ width: '1em', height: 20, display: 'block' }}/>: <div><FaDownload/><span>Download</span></div>}</ButtonItem>
        </Field>)
      })}

    </ConfirmModal>
  );
};

export default ModelManagerModal;
