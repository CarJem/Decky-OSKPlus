#!/bin/sh
set -e

mkdir out
cd out

pacman -S --noconfirm --needed git wget unzip

wget -O ydotool https://github.com/ReimuNotMoe/ydotool/releases/download/v1.0.4/ydotool-release-ubuntu-latest
wget -O ydotoold https://github.com/ReimuNotMoe/ydotool/releases/download/v1.0.4/ydotoold-release-ubuntu-latest
git clone https://github.com/ideasman42/nerd-dictation nd
wget https://alphacephei.com/kaldi/models/vosk-model-small-en-us-0.15.zip
unzip vosk-model-small-en-us-0.15.zip
mv vosk-model-small-en-us-0.15 model
rm vosk-model-small-en-us-0.15.zip