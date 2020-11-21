
## To Be Decided


## How to Run

There are two methods of running this program:

### Method 1
In a terminal run the command `. init.sh` (Make sure you are in the root directory)
Open another terminal and run the following command `. ngrok.sh`.

### Method 2
In a terminal run the following steps
1. `python -m venv venv`
2. `source venv/bin/activate`
3. `pip install -r requirements.txt`
4. `FLASK_ENV=development flask run`

Next Open another terminal and run.
5. `source venv/bin/activate`
6 . `ngrok http 5000`


## References
- [Twilio Video Chat Blog](https://www.twilio.com/blog/build-video-chat-application-python-javascript-twilio-programmable-video)
