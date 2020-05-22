import React, { useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import Axios from 'axios';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { storeData, getData } from '../Store/Storage';
import { user, baseUrl } from '../Store/Keys';

export default YoutubeAddScreen = ({ navigation }) => {

    const [isLoading, setLoading] = useState(false);
    const [link, setLink] = useState("")
    const [password, setPassword] = useState("");

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <TextInput
                onChangeText={res => {
                    setLink(res)
                }}
                value={link}
                placeholder={"Zi3VGpnvwWs"}
                style={{ borderBottomColor: "black", borderBottomWidth: 1, backgroundColor: "#f4f4f4" }} />

            <TextInput
                onChangeText={res => {
                    setPassword(res)
                }}
                value={password}
                placeholder={"Secure your room"}
                style={{ borderBottomColor: "black", marginTop: 10, borderBottomWidth: 1, backgroundColor: "#f4f4f4" }} />


            <TouchableOpacity
                onPress={() => {
                    setLoading(true)
                    // var id = link.substring(32, link.length).split("&")[0]
                    var id = link
                    Axios.get("https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + id + "&key=AIzaSyCm7cvQdOwCnslbRqECA015md9Pj_n4ZnM").then(yData => {
                        getData(user).then(username => {
                            var snippet = yData.data.items[0].snippet
                            var getData = {
                                videoUrl: id,
                                title: snippet.title,
                                image: snippet.thumbnails.default.url,
                                channelId: snippet.channelTitle,
                                currentPosition: 0,
                                status: "Loading",
                                users: [{
                                    name: username,
                                    role: "Host"
                                }],
                                password: password,
                                createdOn: new Date()
                            }
                            Axios.post(baseUrl + "/api/room/createRoom", getData).then(res => {
                                setLoading(false)
                            }).then(() => {
                                navigation.pop();
                                navigation.navigate("Stream", { data: getData })
                            })
                        })
                    })
                }}
                style={{ backgroundColor: "#5454df", margin: 10, elevation: 3, justifyContent: "center", alignItems: 'center', paddingTop: 10, paddingBottom: 10 }}
            >
                <Text style={{ color: "white", fontSize: 20 }}>
                    Create Room
                </Text>
            </TouchableOpacity>
            {isLoading ? <View style={{ flex: 1, justifyContent: "center", alignItems: 'center' }}>
                <ActivityIndicator style={{ position: "absolute" }} size="large" />
            </View> : null}
        </View>
    );
}