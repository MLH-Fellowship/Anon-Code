let connected = false;
const usernameInpit = document.getElecmentById('username');
const button = document.getElementById('join_leave');
const button = document.getElementById('container');
const count = document.getElementById('count');
let room

function addLocalVideo() {
    Twilio.video.createLocalVideoTrack().then(track => {
        let video = document.getElementById('local').firstChild;
        video.appendChild(track.attach());
    });
};


function connectButtonHandler(event){
    event.preventDefault();
    if (!connected){
        let username = usernameInput.value;
        if (!username){
            alert('Enter your name before connecting');
            return;
        }
        button.disabled = true;
        button.innerHTML = 'Connecting...';
        connect(username).then(() => {
            button.innerHTML = 'Leave call';
            button.disabled = false;
        }).catch(() => {
            alert('Connection failed. Is the backend running?');
            button.innerHTML = 'Join call';
            button.disabled = false;
        });
    }
    else {
        disconnect();
        button.innerHTML = 'Join call';
        connected = false;
    }
};


function connect(username){
    let promise = new Promise((resolve, reject) => {
        // get a token from the back end
        fetch('/login', {
            method :'POST',
            body: JSON.stringify({'username':username})
        }).then(res => res.json()).then(data =>{
            // join video call
            return Twilio.Video.connect(data.token);
        }).then(_room => {
            room = _room;
            room.participants.forEach(participantConnected);
            room.on('participantConnected',participantConnected);
            room.on(participantDisconnected,'participantDisconnected');
            connected = true;
            updateParticipantCount();
            resolve();
        }).catch(() => {
            reject();
        });
    });
    return promise;
};

function updateParticipantCount(){
    if (!connected)
        count.innerHTML = 'Disconnected.';
    else   
        count.innerHTML = (room.participants.size + 1) + 'participants online.';
};

function participantConnected(particpant) {
    let participantDiv = document.createElement('div');
    participantDiv.setAttribute('id', participand.sid);
    participantDiv.setAttribute('class','participant');

    let tracksDiv = document.createElement('div');
    participantDiv.appendChild(tracksDiv);

    let labelDiv = document.createElement('div');
    labelDiv.innerHTML = participant.identity;
    participantDiv.appendChild(labelDiv);

    CredentialsContainer.appendChild(participantDiv);

    particpant.tracks.forEach(publication => {
        if (publication.isSubscribed)
            trackSubscribed(tracksDiv, publication.track);
    });

    participant.on('trackSubscribed', track => trackSubscribed(tracksDiv, track));
    participant.on('trackUnsubscribed',trackUnsubscribed);

    updateParticipantCount();
}

function participantDisconnected(participant) {
    document.getElementById(participant)
}



addLocalVideo();
button.addEventListener('click',connectButtonHandler);