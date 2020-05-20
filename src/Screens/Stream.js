import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import Video from 'react-native-video';
import YouTube from 'react-native-youtube';
import io from 'socket.io-client';
import { storeData, getData } from '../Store/Storage';
import { name, user } from '../Store/Keys';

export default Stream = () => {
    const refVideo = useRef(null);
    const [isPlaying, setPlaying] = useState(true);

    const [role, setRole] = useState(null)
    const data = [
        {
            "users": [
                {
                    "id": "saurabh13209",
                    "role": "Host"
                },
                {
                    "id": "vikas",
                    "role": "User"
                }
            ],
            "_id": "5ec558bf21cc53349f4e6fda",
            "videoUrl": "1KMCKphn6CY",
            "password": "",
            "createdOn": "2020-05-20T16:20:15.606Z",
            "__v": 0
        }
    ]


    useEffect(() => {
        getData(user).then(username => {
            data[0]["users"].forEach((res, index) => {
                console.log(res["id"]);
                if (res["id"] == username) {
                    console.log(username, data[0]["users"][index]["role"])
                    setRole(data[0]["users"][index]["role"]);
                }
            })
        })
        this.socket = io('http://192.168.43.249:4000');
        setInterval(() => {
            if (role == "Host") {
                refVideo.current.getCurrentTime().then(res => {
                    this.socket.emit("setVideoData", {
                        sec: res
                    })
                })
            } else {
                this.socket.on("DataChanged", (res) => {
                    console.log(res);
                })
            }
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
                videoId={data[0]["videoUrl"]} // The YouTube video ID
                play // control playback of video with true/false
                loop // control whether the video should loop when ended
                style={{ alignSelf: 'stretch', height: 300 }}
                showinfo={true}
                controls={role == "Host" ? 1 : 0}             //1 -> yes 2 -> no
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