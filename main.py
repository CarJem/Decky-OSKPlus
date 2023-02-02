import os, json, asyncio
import logging
from subprocess import Popen, run, check_output
from os import geteuid, path
from utilities import Utilities

pluginManagerUtils = Utilities(None)

os.setuid(1000)
os.environ['HOME'] = "/home/deck"
os.environ['XDG_RUNTIME_DIR'] = "/run/user/1000"
os.environ['PATH'] = os.environ['PATH'] + ":" + os.path.join(os.path.dirname(__file__), "out")

logger=logging.getLogger()
logger.setLevel(logging.DEBUG)

class Plugin:

    #region Dictation
    async def startDictation(self):
        pulse_device_name = check_output(["pactl", "get-default-source"]).strip().decode('UTF-8')
        cmd = [
            os.path.join(os.path.dirname(__file__), "out/nd/nerd-dictation"), 
            "begin", 
            "--vosk-model-dir=" + os.path.dirname(__file__) + "/out/model", 
            "--simulate-input-tool=YDOTOOL", 
            "--pulse-device-name=" + pulse_device_name
            ]

        logger.info("Starting nerd-dictation")
        env = os.environ.copy()
        Popen(cmd, env=env)
        logger.info("Started nerd-dictation")

    async def endDictation(self):
        logger.info("Stopping nerd-dictation")
        Popen([os.path.join(os.path.dirname(__file__), "out/nd/nerd-dictation"),"end",])

    #endregion

    async def keyClick(self, keyCode):
        logger.info("attemptingKeyClick")
        cmd = [
            os.path.join(os.path.dirname(__file__), "out/ydotool"), 
            "key", 
            str(keyCode) + ":1", 
            str(keyCode) + ":0"
        ]
        logger.info(cmd)
        Popen(cmd, env=os.environ.copy())

    async def typeText(self, text):
        logger.info("attemptingTypeText")
        cmd = [
            os.path.join(os.path.dirname(__file__), "out/ydotool"), 
            "type", 
            str(text)
        ]
        logger.info(cmd)
        Popen(cmd, env=os.environ.copy())

    async def keyPress(self, keyCode):
        cmd = [
            os.path.join(os.path.dirname(__file__), "out/ydotool"), 
            "key", 
            str(keyCode) + ":1"
        ]
        logger.info(cmd)
        Popen(cmd, env=os.environ.copy())

    async def keyRelease(self, keyCode):
        cmd = [
            os.path.join(os.path.dirname(__file__), "out/ydotool"), 
            "key", 
            str(keyCode) + ":0"
        ]
        logger.info(cmd)
        Popen(cmd, env=os.environ.copy())

    async def _main(self):
        logger.debug("Starting ydotoold")
        self.ydotoold_process = Popen([os.path.join(os.path.dirname(__file__), "out/ydotoold")])