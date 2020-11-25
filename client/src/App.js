import React, { Col, useEffect, useState, useRef  } from 'react';
import Editor from './editor';
//import { Component  } from 'react';

// import { Controlled as CodeMirror } from "react-codemirror2";
// import Pusher from "pusher-js";
// import pushid from "pushid";
// import axios from "axios";

import './App.css';
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";

// import "codemirror/lib/codemirror.css";
// import "codemirror/theme/material.css";

// import "codemirror/mode/htmlmixed/htmlmixed";
// import "codemirror/mode/css/css";
// import "codemirror/mode/javascript/javascript";

const Container = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  height: 3%;
  width: 100%;
`;

const EqualDivider = styled.div`
  display: flex;
  margin: 0.5rem;
  padding: 1rem;
  height: 70%;
  ${props => props.vertical && "flex-direction: column;"}

  > * {
    flex: 1;

    &:not(:first-child) {
      ${props => props.vertical ? "margin-top" : "margin-left"}: 0.1rem;
    }
  }
`;

const Video = styled.video`
  border: 1px solid blue;
  width: 80%;
  height: 50%;
`;



// class App extends Component {
//   constructor() {
//     super();
//     this.state = {
//       id: "",
//       html: "",
//       css: "",
//       js: ""
//     };

//     this.pusher = new Pusher("196226a06016fd16ae27", {
//       cluster: "us2",
//       forceTLS: true
//     });

//     this.channel = this.pusher.subscribe("editor");
//   }

//   componentDidUpdate() {
//     this.runCode();
//   }

//   componentDidMount() {
//     this.setState({
//       id: pushid()
//     });

//     this.channel.bind("text-update", data => {
//       const { id } = this.state;
//       if (data.id === id) return;

//       this.setState({
//         html: data.html,
//         css: data.css,
//         js: data.js
//       });
//     });
//   }

//   syncUpdates = () => {
//     const data = { ...this.state };

//     axios
//       .post("http://localhost:5000/update-editor", data)
//       .catch(console.error);
//   };

//   runCode = () => {
//     const { html, css, js } = this.state;

//     const iframe = this.refs.iframe;
//     const document = iframe.contentDocument;
//     const documentContents = `
//       <!DOCTYPE html>
//       <html lang="en">
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <meta http-equiv="X-UA-Compatible" content="ie=edge">
//         <title>Document</title>
//         <style>
//           ${css}
//         </style>
//       </head>
//       <body>
//         ${html}
//         <script type="text/javascript">
//           ${js}
//         </script>
//       </body>
//       </html>
//     `;

//     document.open();
//     document.write(documentContents);
//     document.close();
//   };

//   render() {
//     const { html, js, css } = this.state;
//     const codeMirrorOptions = {
//       theme: "material",
//       lineNumbers: true,
//       scrollbarStyle: null,
//       lineWrapping: true
//     };

//     return (
//       <div className="App">
//         <section className="playground">
//           <div className="code-editor html-code">
//             <div className="editor-header">HTML</div>
//             <CodeMirror
//               value={html}
//               options={{
//                 mode: "htmlmixed",
//                 ...codeMirrorOptions
//               }}
//               onBeforeChange={(editor, data, html) => {
//                 this.setState({ html }, () => this.syncUpdates());
//               }}
//             />
//           </div>
//           <div className="code-editor css-code">
//             <div className="editor-header">CSS</div>
//             <CodeMirror
//               value={css}
//               options={{
//                 mode: "css",
//                 ...codeMirrorOptions
//               }}
//               onBeforeChange={(editor, data, css) => {
//                 this.setState({ css }, () => this.syncUpdates());
//               }}
//             />
//           </div>
//           <div className="code-editor js-code">
//             <div className="editor-header">JavaScript</div>
//             <CodeMirror
//               value={js}
//               options={{
//                 mode: "javascript",
//                 ...codeMirrorOptions
//               }}
//               onBeforeChange={(editor, data, js) => {
//                 this.setState({ js }, () => this.syncUpdates());
//               }}
//             />
//           </div>
//         </section>
//         <section className="result">
//           <iframe title="result" className="iframe" ref="iframe" />
//         </section>
//       </div>
      
//     );
//   }
// }

function VideoApp() {
  const [yourID, setYourID] = useState("");
  const [users, setUsers] = useState({});
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);

  const userVideo = useRef();
  const partnerVideo = useRef();
  const socket = useRef();
  
  useEffect(() => {
    socket.current = io.connect("/");
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      setStream(stream);
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    })

    socket.current.on("yourID", (id) => {
      setYourID(id);
    })
    socket.current.on("allUsers", (users) => {
      setUsers(users);
    })

    socket.current.on("hey", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    })
  }, []);

  function callPeer(id) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      config: {

        iceServers: [
            {
                urls: "stun:numb.viagenie.ca",
                username: "sultan1640@gmail.com",
                credential: "98376683"
            },
            {
                urls: "turn:numb.viagenie.ca",
                username: "sultan1640@gmail.com",
                credential: "98376683"
            }
        ]
    },
      stream: stream,
    });

    peer.on("signal", data => {
      socket.current.emit("callUser", { userToCall: id, signalData: data, from: yourID })
    })

    peer.on("stream", stream => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    socket.current.on("callAccepted", signal => {
      setCallAccepted(true);
      peer.signal(signal);
    })

  }

  function acceptCall() {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", data => {
      socket.current.emit("acceptCall", { signal: data, to: caller })
    })

    peer.on("stream", stream => {
      partnerVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
  }

  let UserVideo;
  if (stream) {
    UserVideo = (
      <Video playsInline muted ref={userVideo} autoPlay />
    );
  }

  let PartnerVideo;
  if (callAccepted) {
    PartnerVideo = (
      <Video playsInline ref={partnerVideo} autoPlay />
    );
  }

  let incomingCall;
  if (receivingCall) {
    incomingCall = (
      <div>
        <h1>{caller} is calling you</h1>
        <button onClick={acceptCall}>Accept</button>
      </div>
    )
  }
  return (
    
    <Container>
      <EqualDivider>
      <EqualDivider vertical>
        {UserVideo}
        {PartnerVideo}
      </EqualDivider>
      <Editor></Editor>
      </EqualDivider>
      <Row>
        {Object.keys(users).map(key => {
          if (key === yourID) {
            return null;
          }
          return (
            <button onClick={() => callPeer(key)}>Call {key}</button>
          );
        })}
      </Row>
      <Row>
        {incomingCall}
      </Row>
    </Container>
  );
}


//export default App;
export default VideoApp;
