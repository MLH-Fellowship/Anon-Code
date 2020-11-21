#!/bin/sh


if [ ! -d "venv" ];
then
    echo ----------------------------
    echo Creating virtual environment
    echo ----------------------------
    python -m venv backend/venv
fi

echo ------------------------
echo Activating environment
echo ------------------------
source backend/venv/bin/activate


if [ -f "requirements.txt" ];
then
    echo ----------------------------
    echo Installing requirements
    echo ----------------------------
    pip install -r backend/requirements.txt
fi


echo -------------------------
echo Setting FLask environment
echo -------------------------
export FLASK_APP=backend/app.py
flask run