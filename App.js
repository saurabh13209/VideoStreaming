import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals
} from 'react-native-webrtc';

export default App = () => {

  const [stream, setStream] = useState(null);
  const [isFront, setFont] = useState(null);

  useEffect(() => {
    const configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };
    const pc = new RTCPeerConnection(configuration);
    let isFront = true;
    mediaDevices.enumerateDevices().then(sourceInfos => {
      console.log(sourceInfos);
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (sourceInfo.kind == "videoinput" && sourceInfo.facing == (isFront ? "front" : "environment")) {
          videoSourceId = sourceInfo.deviceId;
        }
      }
      mediaDevices.getUserMedia({
        audio: true,
        video: {
          mandatory: {
            minWidth: 500, // Provide your own width, height and frame rate here
            minHeight: 300,
            minFrameRate: 30
          },
          facingMode: (isFront ? "user" : "environment"),
          optional: (videoSourceId ? [{ sourceId: videoSourceId }] : [])
        }
      })
        .then(stream => {
          setStream(stream.toURL())
          pc.addStream(stream)
        })
        .catch(error => {
          console.log(error)
        });
    });
    pc.createOffer().then(desc => {
      pc.setLocalDescription(desc).then(() => {
        console.log("")
      });
    });

    pc.onicecandidate = function (event) {
      console.log(event)
    };
  }, [])

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <RTCView style={{ flex: 1, height: Dimensions.get("window").height, width: Dimensions.get("window").width }} streamURL={stream} />
    </View>
  );
}