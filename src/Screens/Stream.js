import React, { useRef, useEffect, useState } from 'react';
import { View, Text, AppState, BackHandler } from 'react-native';
import Video from 'react-native-video';
import YouTube from 'react-native-youtube';
import io from 'socket.io-client';
import { storeData, getData } from '../Store/Storage';
import { name, user, baseUrl } from '../Store/Keys';

export default Stream = (props) => {
    const refVideo = useRef(null);
    const [isPlaying, setPlaying] = useState(true);
    const [role, setRole] = useState(null)
    this.videoStatus = "stopped";

    BackHandler.addEventListener("hardwareBackPress", res => {
        if (role == "Host") {
            this.socket.emit('closeRoom', props.route.params.data["videoUrl"])
        } else {
            getData(user).then(res => {
                var temp = []
                props.route.params.data.users.forEach(user => {
                    if (user["name"] != res) {
                        temp = [
                            ...temp,
                            user
                        ]
                    }
                })
                console.log(temp)
                this.socket.emit("removeUser", { videoUrl: props.route.params.data["videoUrl"], newUser: temp })
            })
        }
        props.navigation.pop();
        return true
    })
    useEffect(() => {
        this.socket = io(baseUrl);
        getData(user).then(username => {
            this.socket.on("connect", () => {
                this.socket.emit("updateUser", {
                    name: username,
                    id: this.socket.id
                })
            })
            var roleTemp = null;

            props.route.params.data["users"].forEach((res, index) => {
                console.log(res["name"]);
                if (res["name"] == username) {
                    roleTemp = props.route.params.data["users"][index]["role"];
                    setRole(roleTemp);
                }
            })
            setInterval(() => {
                if (roleTemp == "Host") {
                    if (refVideo.current != null) {
                        refVideo.current.getCurrentTime().then(res => {
                            this.currentTime = res;
                            tempVid = {
                                currentTime: res,
                                status: this.videoStatus,
                                videoUrl: props.route.params.data["videoUrl"]
                            };
                            this.socket.emit("setVideoData", tempVid)
                        })
                    }
                }
            }, 500)


            this.socket.on("updateVideo", res => {
                refVideo.current.getCurrentTime().then(videoTime => {
                    if (res.status == "playing") {
                        if (!((videoTime > res.currentTime - 4) && (videoTime < res.currentTime + 4))) {
                            var tem = parseInt(res.currentTime) + 4;
                            console.log("update " + tem)
                            refVideo.current.seekTo(tem)
                            setPlaying(true)
                        }
                    } else {
                        setPlaying(false)
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
                videoId={props.route.params.data["videoUrl"]}
                style={{ alignSelf: 'stretch', height: 300 }}
                showinfo={true}
                onReady={res => {
                    refVideo.current.seekTo(props.route.params.data.currentPosition)
                    this.currentTime = props.route.params.data.currentPosition
                    if (props.route.params.data.status == "playing") {
                        setPlaying(true)
                    } else {
                        setPlaying(false)
                    }
                }}
                controls={role == "Host" ? 1 : 0}             //1 -> yes 2 -> no
                modestbranding={true}
                play={isPlaying}
                onChangeState={e => {
                    this.videoStatus = e["state"]
                }}
            />

            <Text>{role}</Text>
        </View>
    );
}