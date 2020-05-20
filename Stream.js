import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import Video from 'react-native-video';
import YouTube from 'react-native-youtube';
import io from 'socket.io-client';

const socket = io('http://localhost');
export default Stream = () => {
    const refVideo = useRef(null);
    const [old, setOld] = useState(0);
    const [isPlaying, setPlaying] = useState(true);

    useEffect(() => {
        setInterval(() => {
            refVideo.current.getCurrentTime().then(res => {

            })
        }, 2000)
    }, [])

    return (
        <View style={{ flex: 1 }}>
            {/* <Video source={{ uri: "https://www.youtube.com/watch?v=1KMCKphn6CY&list=RD1KMCKphn6CY" }}   // Can be a URL or a local file.
                ref={refVideo}
                onBuffer={() => {
                    console.log("B")
                }}
                onProgress={(d) => {
                    if (old == d.currentTime) {
                        console.log("Paused")
                    } else {
                        console.log("Playinh")
                    }
                    setOld(d.currentTime)
                }}
                onError={(e) => console.log(e)}               // Callback when video cannot be loaded
                controls={true}
                fullscreen={true}
                fullscreenAutorotate={true}
                fullscreenOrientation={"landscape"}
                style={{
                    flex: 1
                }}
                playInBackground={true}
                playWhenInactive={true}
                pictureInPicture={true}
                bufferConfig={{
                    minBufferMs: 15000,
                    maxBufferMs: 50000,
                    bufferForPlaybackMs: 2500,
                    bufferForPlaybackAfterRebufferMs: 5000
                }}
            /> */}
            <YouTube
                ref={refVideo}
                apiKey="AIzaSyCm7cvQdOwCnslbRqECA015md9Pj_n4ZnM"
                videoId="1KMCKphn6CY" // The YouTube video ID
                play // control playback of video with true/false
                loop // control whether the video should loop when ended
                style={{ alignSelf: 'stretch', height: 300 }}
                showinfo={true}
                controls={1}            //1 -> yes 2 -> no
                modestbranding={true}
                play={isPlaying}
                onChangeState={e => console.log(e)}  //playing
                onProgress={e => console.log(e)}
            />
            <TouchableOpacity
                onPress={() => {
                    setPlaying(!isPlaying);
                }}
            >
                <Text>Play</Text>
            </TouchableOpacity>

        </View>
    );
}