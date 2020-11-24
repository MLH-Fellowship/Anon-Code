import os
from dotenv import load_dotenv
from flask import Flask, render_template, request, abort
from twilio.jwt.access_token import AccessToken
from twilio.jwt.access_token.grants import VideoGrant, ChatGrant
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException

from flask_codemirror import CodeMirror
# # mandatory
# CODEMIRROR_LANGUAGES = ['python', 'html']
# WTF_CSRF_ENABLED = False
# SECRET_KEY = 'secret'
# # optional
# CODEMIRROR_THEME = '3024-day'

load_dotenv()
twilio_account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
twilio_api_key_sid = os.environ.get('TWILIO_API_KEY_SID')
twilio_api_key_secret = os.environ.get('TWILIO_API_KEY_SECRET')
twilio_client = Client(twilio_api_key_sid, twilio_api_key_secret,
                       twilio_account_sid)

app = Flask(__name__)
CODEMIRROR_LANGUAGES = ['python']
CODEMIRROR_THEME = '3024-day'
CODEMIRROR_ADDONS = (('dialog', 'dialog'), ('mode', 'overlay'))
CODEMIRROR_VERSION = '4.12.0'
SECRET_KEY = 'secret!'
app.config["SECRET_KEY"] = 'secret!'
app.config.from_object(__name__)

codemirror = CodeMirror(app)

####
from flask_wtf import FlaskForm
from flask_codemirror.fields import CodeMirrorField
from wtforms.fields import SubmitField

class MyForm(FlaskForm):
    source_code = CodeMirrorField(language='python', config={'lineNumbers': 'true'})
    submit = SubmitField('Submit')
####

def get_chatroom(name):
    for conversation in twilio_client.conversations.conversations.list():
        if conversation.friendly_name == name:
            return conversation

    # a conversation with the given name does not exist ==> create a new one
    return twilio_client.conversations.conversations.create(
        friendly_name=name)


@app.route('/', methods = ['GET', 'POST'])
def index():
    form = MyForm()
    if form.validate_on_submit():
        text = form.source_code.data
    return render_template('index.html', form=form)


@app.route('/login', methods=['POST'])
def login():
    username = request.get_json(force=True).get('username')
    if not username:
        abort(401)

    conversation = get_chatroom('My Room')
    try:
        conversation.participants.create(identity=username)
    except TwilioRestException as exc:
        # do not error if the user is already in the conversation
        if exc.status != 409:
            raise

    token = AccessToken(twilio_account_sid, twilio_api_key_sid,
                        twilio_api_key_secret, identity=username)
    token.add_grant(VideoGrant(room='My Room'))
    token.add_grant(ChatGrant(service_sid=conversation.chat_service_sid))

    return {'token': token.to_jwt().decode(),
            'conversation_sid': conversation.sid}


if __name__ == '__main__':
    
    app.run(host='0.0.0.0')