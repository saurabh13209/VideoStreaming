import React, { useRef, useEffect, useState } from 'react';
import { View, Text, AppState, BackHandler, Image, Animated } from 'react-native';
import Video from 'react-native-video';
import YouTube from 'react-native-youtube';
import io from 'socket.io-client';
import { storeData, getData } from '../Store/Storage';
import { name, user, baseUrl } from '../Store/Keys';

export default Stream = (props) => {
    const refVideo = useRef(null);
    const [isPlaying, setPlaying] = useState(true);
    const [role, setRole] = useState(null)
    const [dime, setDime] = useState({
        height: 300,
        width: 400
    });
    this.videoStatus = "stopped";
    const bottomValue = useRef(new Animated.Value(0)).current;

    removeUserFunc = () => {
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
            this.socket.emit("removeUser", { videoUrl: props.route.params.data["videoUrl"], newUser: temp })
        })
    }

    // AppState.addEventListener("change", res => {
    //     if (res == "background") {
    //         if (role == "Host") {
    //             this.socket.emit("closeRoom", props.route.params.data["videoUrl"])
    //         } else {
    //             removeUserFunc();
    //         }
    //         props.navigation.pop();
    //     }
    // })

    BackHandler.addEventListener("hardwareBackPress", res => {
        if (role == "Host") {
            this.socket.emit('closeRoom', props.route.params.data["videoUrl"])
        } else {
            removeUserFunc();
        }
        props.navigation.pop();
        return true
    })
    useEffect(() => {
        // Animated.timing(
        //     bottomValue,
        //     {
        //         toValue: dime.height + 50,
        //         duration: 4000
        //     }
        // ).start()
        this.socket = io(baseUrl);
        this.isFullScreen = false;
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
                console.log(this.isFullScreen)

            }, 500)


            this.socket.on("updateVideo", res => {
                refVideo.current.getCurrentTime().then(videoTime => {
                    if (res.status == "playing") {
                        if (!((videoTime > res.currentTime - 4) && (videoTime < res.currentTime + 4))) {
                            var tem = parseInt(res.currentTime) + 2;
                            console.log("update " + tem)
                            refVideo.current.seekTo(tem)
                        }
                        setPlaying(true)
                    } else {
                        setPlaying(false)
                    }

                })
            })

            this.socket.on("closeVideo", res => {
                props.navigation.pop();
            })

        })
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <View
                onLayout={r => setDime(r.nativeEvent.layout)}
            >
                {/* <View style={{ position: "absolute", top: 0, height: Math.round(dime.height), right: 20, width: Math.round(dime.width) / 3, zIndex: 20 }}>
                    <Animated.Image
                        source={require("../../assests/image/heaty.png")}
                        resizeMode={"contain"}
                        style={{ position: "absolute", bottom: bottomValue, height: (Math.round(dime.height) / 3) - 20, width: (Math.round(dime.width) / 3) - 20 }}
                    />
                </View> */}
                <YouTube
                    style={{ zIndex: 0 }}
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
                    controls={role == "Host" ? 1 : 0}
                    modestbranding={true}
                    play={isPlaying}
                    onChangeState={e => {
                        this.videoStatus = e["state"]
                    }}
                    onChangeFullscreen={e => {
                        this.isFullScreen = e.isFullscreen
                    }}
                    onError={e => console.log(e)}
                />
            </View>

            <View style={{ backgroundColor: "blue" }}>
                <Text>a</Text>
            </View>

        </View >
    );
}