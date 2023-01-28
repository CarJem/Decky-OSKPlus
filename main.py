import os, json, asyncio
import logging
from subprocess import Popen, run
from os import  mkdir, path, environ, sep
import urllib.request
import zipfile
from settings import SettingsManager # type: ignore
from helpers import get_user_id, get_home_path # type: ignore

os.setuid(get_user_id())

PLUGIN_PATH=environ["DECKY_PLUGIN_DIR"]
PLUGIN_BIN=path.join(PLUGIN_PATH, "bin")

environ['HOME'] = get_home_path()
environ['XDG_RUNTIME_DIR'] = path.join(path.abspath(sep), 'run', 'user', str(get_user_id()))

#Req
environ['PATH'] += ":" + PLUGIN_BIN

SETTINGS_DIR = environ["DECKY_PLUGIN_SETTINGS_DIR"]
LOGGING_DIR = environ["DECKY_PLUGIN_LOG_DIR"]
MICROPHONE_PULSE_SRC = "alsa_input.pci-0000_04_00.5-platform-acp5x_mach.0.HiFi__hw_acp5x_0__source"

logging.basicConfig(filename=path.join(LOGGING_DIR, 'backend.log'),
                    format='[DeckyBoard] %(asctime)s %(levelname)s %(message)s',
                    filemode='w+',
                    force=True)
logger=logging.getLogger()
logger.setLevel(logging.INFO) # can be changed to logging.DEBUG for debugging issues

settings = SettingsManager(name="settings", settings_directory=SETTINGS_DIR)
settings.read()


class Plugin:
    async def settings_read(self):
        output = settings.read()
        return output
    async def settings_commit(self):
        output = settings.commit()
        return output
    async def settings_get(self, key: str, default):
        output = settings.getSetting(key, default)
        return output
    async def settings_set(self, key: str, value):
        output = settings.setSetting(key, value)
        return  output

    #region Dictation
    async def startDictation(self):
        cmd = [
            os.path.join(PLUGIN_BIN, "nerd-dictation"), 
            "begin", 
            "--vosk-model-dir=" + PLUGIN_PATH + "/model" + settings.getSetting("voskModel", "vosk-model-small-en-us-0.15"), 
            "--simulate-input-tool=YDOTOOL", 
            "--pulse-device-name=" + MICROPHONE_PULSE_SRC
            ]

        logger.info("Starting nerd-dictation")
        env = os.environ.copy()
        Popen(cmd, env=env)
        logger.info("Started nerd-dictation")

    async def endDictation(self):
        logger.info("Stopping nerd-dictation")
        Popen([path.join(PLUGIN_BIN, "nerd-dictation"), "end",])

    #endregion
    async def downloadVoskModel(self, modelName):
        zipPath = f"/tmp/{modelName}.zip"
        urllib.request.urlretrieve(f"https://alphacephei.com/vosk/models/{modelName}.zip", zipPath)
        with zipfile.ZipFile(zipPath, 'r') as zip:
            modelPath = path.join(PLUGIN_PATH, "models", modelName)
            mkdir(modelPath)
            zip.extractall(modelPath)
            os.remove(zipPath)


    async def _main(self):
        logger.debug("Starting ydotoold")
        #todo change this to asyncio
        self.ydotoold_process = Popen([path.join(PLUGIN_BIN, "ydotoold")])