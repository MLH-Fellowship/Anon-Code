#!/bin/sh

if [ ! -d "venv" ];
then
    echo ----------------------------
    echo Creating virtual environment
    echo ----------------------------
    python -m venv venv
fi

if [ -f "requirements.txt" ];
then
    echo ----------------------------
    echo Installing requirements
    echo ----------------------------
    pip install -r requirements.txt
fi

echo ------------------------
echo Activating environment
echo ------------------------
source venv/bin/activate

echo -------------------------
echo Setting FLask environment
echo -------------------------
FLASK_ENV=development flask run