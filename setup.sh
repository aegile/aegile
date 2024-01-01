#!/bin/bash
sudo npm install -g pnpm
sudo npm install -g vercel
sudo npm install
sudo apt-get update
sudo apt install python3-pip -y
sudo apt install python3-venv -y
python3 -m venv .venv && source .venv/bin/activate
pip3 install -r requirements.txt