#!/bin/bash

if [ ! -d ".venv" ]; then
  python3 -m venv .venv
  echo "Virtual environment created successfully!"
else
  echo "Virtual environment already exists."
fi
source .venv/bin/activate
pip install --no-cache-dir torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu 'transformers[torch]'
pip install -r requirements.txt