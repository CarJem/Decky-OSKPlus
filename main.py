import logging
import os, json, asyncio
import socket
import struct
from subprocess import Popen, run, check_output
from os import geteuid, path
import decky_plugin


# os.setuid(1000)
# os.environ['HOME'] = "/home/deck"
# os.environ['XDG_RUNTIME_DIR'] = "/run/user/1000"
# os.environ['PATH'] = os.environ['PATH'] + ":" + os.path.join(os.path.dirname(__file__), "out")

logger=decky_plugin.logger
logger.setLevel(logging.DEBUG)

# Function to send a key event
def send_key_event(socket, key_code, key_value):
    """
    Sends a key event.

    :param socket: The socket to send data through.
    :param key_code: The key code of the event.
    :param key_value: The value of the event (1 for key down, 0 for key up).
    """
    # Send key event
    data = struct.pack('qqHHi', 0, 0, 1, key_code, key_value)
    socket.send(data)
    # Send syn packet
    data = struct.pack('qqHHi', 0, 0, 0, 0, 0)
    socket.send(data)


class Plugin:
    #region Dictation
    async def startDictation(self):
        pulse_device_name = check_output(["pactl", "get-default-source"]).strip().decode('UTF-8')
        cmd = [
            os.path.join(os.path.dirname(__file__), "bin/nd/nerd-dictation"), 
            "begin", 
            "--vosk-model-dir=" + os.path.dirname(__file__) + "/bin/model", 
            "--simulate-input-tool=YDOTOOL", 
            "--pulse-device-name=" + pulse_device_name
            ]

        logger.info("Starting nerd-dictation")
        env = os.environ.copy()
        Popen(cmd, env=env)
        logger.info("Started nerd-dictation")

    async def endDictation(self):
        logger.info("Stopping nerd-dictation")
        Popen([os.path.join(os.path.dirname(__file__), "bin/nd/nerd-dictation"),"end",])

    #endregion

    async def keyClick(self, keyCode):
        logger.info("attemptingKeyClick")
        try:
            with socket.socket(socket.AF_UNIX, socket.SOCK_DGRAM) as s:
                s.connect('/tmp/.ydotool_socket')
                send_key_event(s, keyCode, 1)  # Key down
                send_key_event(s, keyCode, 0)  # Key up
        except socket.error as e:
            logger.error(f"Socket error: {e}")


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
        try:
            with socket.socket(socket.AF_UNIX, socket.SOCK_DGRAM) as s:
                s.connect('/tmp/.ydotool_socket')
                send_key_event(s, keyCode, 1)  # Key down
        except socket.error as e:
            logger.error(f"Socket error: {e}")

    async def keyRelease(self, keyCode):
        try:
            with socket.socket(socket.AF_UNIX, socket.SOCK_DGRAM) as s:
                s.connect('/tmp/.ydotool_socket')
                send_key_event(s, keyCode, 0)  # Key up
        except socket.error as e:
            logger.error(f"Socket error: {e}")

    async def _main(self):
        logger.debug("Starting ydotoold")
        self.ydotoold_process = asyncio.create_subprocess_exec(os.path.join(os.path.dirname(__file__), "bin/ydotoold"))
        await self.ydotoold_process.wait()