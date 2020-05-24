import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import Axios from 'axios';
import { baseUrl, user, flaskUrl } from '../Store/Keys';
import { FlatList } from 'react-native-gesture-handler';
import { fontCustomSize } from '../function';
import { storeData, getData } from '../Store/Storage';
import { captureScreen } from "react-native-view-shot";


export default RoomScreen = (props) => {

    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true)
        Axios.post(baseUrl + "/api/room/getRoom").then(res => {
            setData(res.data)
            setLoading(false)
        })
    }, [])

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            {
                isLoading ? <View style={{ flex: 1 }}>
                    <ActivityIndicator size="large" />
                </View> : <View
                    style={{ flex: 1 }}
                >
                        <FlatList
                            data={data}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        getData(user).then(username => {
                                            var tempUser = item.users;
                                            console.log(tempUser)
                                            var userArray = []
                                            tempUser.forEach(user => {
                                                userArray = [
                                                    ...userArray,
                                                    user["name"]
                                                ]
                                            })
                                            if (userArray.includes(username)) {
                                                props.navigation.navigate("Stream", { data: item })
                                            } else {
                                                tempUser = [
                                                    ...tempUser,
                                                    { name: username, role: "User" }
                                                ]
                                                Axios.post(baseUrl + "/api/room/addUser", {
                                                    videoUrl: item.videoUrl,
                                                    users: tempUser
                                                }).then(() => {
                                                    props.navigation.navigate("Stream", { data: item })
                                                })
                                            }
                                        })
                                    }}
                                    style={{ flexDirection: "row", margin: 10, padding: 10, borderRadius: 15, borderColor: "#d4d4d4", borderWidth: 1 }}>
                                    <Image source={{ uri: item.image }} style={{ width: 70, flex: 2, height: 70, borderRadius: 50 }} />
                                    <View style={{ marginLeft: 10, justifyContent: "center", flex: 8 }}>
                                        <Text style={{ fontSize: fontCustomSize(14), fontWeight: "bold", color: "black" }}>{item.title}</Text>
                                        <Text style={{ fontSize: fontCustomSize(12), color: "#858585" }}>{item.users.length} viewer</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item) => (item._id + "")}
                        />

                    </View>
            }

            <View
                style={{ backgroundColor: '#252525', justifyContent: "center", alignItems: 'center', height: fontCustomSize(50), width: fontCustomSize(50), position: "absolute", bottom: fontCustomSize(30), borderRadius: fontCustomSize(50), right: fontCustomSize(30) }}
            >
                <TouchableOpacity
                    onPress={() => {
                        captureScreen({
                            format: "jpg",
                            quality: 0.8
                        })
                            .then(

                                link => {
                                    var photo = {
                                        uri: link,
                                        type: 'image/jpeg',
                                        name: 'photo.jpg',
                                    };

                                    var body = new FormData();
                                    body.append('photo', photo);
                                    Axios({
                                        url: flaskUrl + '/upload',
                                        data: photo,
                                        method: "POST"
                                    }).then().catch(e => console.log(e))
                                },
                                error => console.error("Oops, snapshot failed", error)
                            );
                        // props.navigation.navigate("YoutubeLink")
                    }}
                    style={{ flex: 1, height: fontCustomSize(50), width: fontCustomSize(50), justifyContent: "center", alignItems: 'center' }}>
                    <Text style={{ color: "white", fontSize: 40 }}>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}