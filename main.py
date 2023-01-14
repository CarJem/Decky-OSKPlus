import os, json, asyncio
import logging
from subprocess import Popen, run
from os import geteuid, path
from utilities import Utilities

pluginManagerUtils = Utilities(None)

os.setuid(1000)
os.environ['HOME'] = "/home/deck"
os.environ['XDG_RUNTIME_DIR'] = "/run/user/1000"

logger=logging.getLogger()
logger.setLevel(logging.DEBUG)

class Plugin:

    #region Dictation
    async def startDictation(self):
        cmd = [os.path.join(os.path.dirname(__file__), "out/nd/nerd-dictation"), "begin", "--vosk-model-dir=" + os.path.dirname(__file__) + "/out/model", "--simulate-input-tool=YDOTOOL", "--pulse-device-name=alsa_input.pci-0000_04_00.5-platform-acp5x_mach.0.HiFi__hw_acp5x_0__source"]

        logger.info("Starting nerd-dictation")
        env = os.environ.copy()
        Popen(cmd, env=env)

    async def endDictation(self):
        logger.info("Stopping nerd-dictation")
        Popen([
                    os.path.join(os.path.dirname(__file__), "out/nd/nerd-dictation"),
                    "end",
                ]
        )

    #endregion

    #region OSK

    async def _updateOSK(self, options):
        cssStyles = ".virtualkeyboard_VirtualKeyboardContainer_33MO2"
        cssStyles += "{"

        if options.OSK_VERTICALALIGNMENT_TOP:
            cssStyles += "position: absolute;"

        if options.OSK_OPACITY == 10:
            cssStyles += "opacity: 1.0;"
        else:
            cssStyles += "opacity: 0.{};".format(options.OSK_OPACITY)

        cssStyles += "}"
            

        if options.OSK_STYLESHEET_ID != None:
            pluginManagerUtils.remove_css_from_tab("SP", options.OSK_STYLESHEET_ID)
        
        self.OSK_STYLESHEET_ID = pluginManagerUtils.inject_css_into_tab("SP", cssStyles)
        
        pass
        
    #endregion

    async def _main(self):
        logger.debug("Starting ydotoold")
        self.ydotoold_process = Popen([os.path.join(os.path.dirname(__file__), "out/ydotoold")])