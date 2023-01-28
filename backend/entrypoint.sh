#!/bin/sh
set -e

cd /backend

touch requirements.txt && pip3 install --upgrade -r requirements.txt -t py_modules

wget -O ydotool https://github.com/ReimuNotMoe/ydotool/releases/download/v1.0.1/ydotool-release-ubuntu-latest
wget -O ydotoold https://github.com/ReimuNotMoe/ydotool/releases/download/v1.0.1/ydotoold-release-ubuntu-latest
chmod +x ydotool
chmod +x ydotoold

mkdir out

cp ydotool out
cp ydotoold bin

git clone https://github.com/ideasman42/nerd-dictation