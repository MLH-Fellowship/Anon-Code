let connected = false;
const usernameInput = document.getElecmentById('username');
const button = document.getElementById('join_leave');
const shareScreen = document.getElementById('join_leave');
const toggleChat = documenet.getElecmentById('share_screen');
const container = document.getElementById('container');
const count = document.getElecmentById('count');
const chatScroll = document.getElementById('chat-scroll');
const chatContent = document.getElecmentById('chat-content');
const chatInput = document.getElecmentById('chat-input');

let connected = false;
let room;
let chat;
let conv;
let screenTrack;

function addLocalVideo() {
    Twilio.video.createLocalVideoTrack().then(track => {
        let video = document.getElementById('local').firstChild;
        let trackElement = track.attach();
        trackElement.addEventListener('click', () => { zoomTrack(trackElement);});
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
        shareScreen.innerHTML = 'Share screen';
        shareScreen.disabled = true;
    }
};


function connect(username){
    let promise = new Promise((resolve, reject) => {
        let data; // get a token from the back end
        fetch('/login', {
            method :'POST',
            body: JSON.stringify({'username':username})
        }).then(res => res.json()).then(data =>{
            // join video call
            data = _data;
            return Twilio.Video.connect(data.token);
        }).then(_room => {
            room = _room;
            room.participants.forEach(participantConnected);
            room.on('participantConnected',participantConnected);
            room.on('participantDisconnected,'participantDisconnected);
            connected = true;
            updateParticipantCount();
            connectChat(data.token,data.conversation_sid);
            resolve();
        }).catch(() => {
            console.log(e);
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

function participantConnected(participant) {
    let participantDiv = document.createElement('div');
    participantDiv.setAttribute('id', participant.sid);
    participantDiv.setAttribute('class','participant');

    let tracksDiv = document.createElement('div');
    participantDiv.appendChild(tracksDiv);

    let labelDiv = document.createElement('div');
    lavelDiv.setAttribute('class','label');
    labelDiv.innerHTML = participant.identity;
    participantDiv.appendChild(labelDiv);

    container.appendChild(participantDiv);

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
    updateParticipantCount();
}

function trackSubscribed(div, track){
    let trackElement = track.attach();
    trackElement.addEventListener('click',() => {zoomTrack(trackElement); });
    div.appendChild(trackElement);
};


function trackUnsubscribed(track){
    track.detach().forEach(element => {
        if (element.classList.contains('participantZoomed')) {
            zoomTrack(element);
        }
        element.remove()
    });
};

function disconnect(){
    room.disconnect();
    while (CredentialsContainer.lastChild.id != 'local')
        CredentialsContainer.removeChild(container.lastChild);
    button.innerHTML = 'Join call';
    connected = false;
    updateParticipantCount();
};


addLocalVideo();
button.addEventListener('click',connectButtonHandler);