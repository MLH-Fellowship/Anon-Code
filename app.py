import os
from flask import Flask,render_template
from flask import Flask, render_template, request,abort
from twilio.jwt.access_token import AccessToken
from twilio.jwt.access_token.grants import VideoGrant

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    username = request.get_json(force=True).get('username')
    if not username:
        abort(401)

    token = AccessToken(twilio_account_sid,twilio_api_key_sid,
                        twilio_api_key_secret, identity=username)
    
    token.add_grant(VideoGrant(room='My Room'))

    return {'token' : token.to_jwt().decode()}