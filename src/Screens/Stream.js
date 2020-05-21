import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import Video from 'react-native-video';
import YouTube from 'react-native-youtube';
import io from 'socket.io-client';
import { storeData, getData } from '../Store/Storage';
import { name, user, baseUrl } from '../Store/Keys';

export default Stream = () => {
    const refVideo = useRef(null);
    const [isPlaying, setPlaying] = useState(true);

    const [role, setRole] = useState(null)
    // Load and set video status
    const [videoStatus, setVideoStatus] = useState({
        currentTime: 0,
        status: "Loading"
    });
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
        this.socket = io(baseUrl);
        getData(user).then(username => {
            this.socket.on("connect", () => {
                console.log(this.socket.id)
                this.socket.emit("updateUser", {
                    name: username,
                    id: this.socket.id
                })
            })
            var roleTemp = null;

            data[0]["users"].forEach((res, index) => {
                console.log(res["id"]);
                if (res["id"] == username) {
                    roleTemp = data[0]["users"][index]["role"];
                    setRole(data[0]["users"][index]["role"]);
                }
            })
            setInterval(() => {
                if (roleTemp == "Host") {
                    refVideo.current.getCurrentTime().then(res => {
                        tempVid = videoStatus;
                        tempVid["currentTime"] = res;
                        setVideoStatus(tempVid)
                        this.socket.emit("setVideoData", tempVid)
                    })
                }
            }, 500)


            this.socket.on("updateVideo", res => {
                refVideo.current.getCurrentTime().then(videoTime => {
                    if (!((videoTime > res.currentTime - 4) && (videoTime < res.currentTime + 4))) {
                        var tem = parseInt(res.currentTime) + 4;
                        console.log("update " + tem)
                        refVideo.current.seekTo(tem)
                        if (res.status == "playing") {
                            setPlaying(true)
                        } else {
                            setPlaying(false)
                        }
                    }
                })

            })

        })
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <YouTube
                ref={refVideo}
                apiKey="AIzaSyCm7cvQdOwCnslbRqECA015md9Pj_n4ZnM"
                videoId={data[0]["videoUrl"]}
                style={{ alignSelf: 'stretch', height: 300 }}
                showinfo={true}
                controls={role == "Host" ? 1 : 1}             //1 -> yes 2 -> no
                modestbranding={true}
                play={isPlaying}
                onChangeState={e => {
                    temp = videoStatus;
                    temp["status"] = e["state"];
                    setVideoStatus(temp)
                }}
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