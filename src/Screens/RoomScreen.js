import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import Axios from 'axios';
import { baseUrl } from '../Store/Keys';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { fontCustomSize } from '../function';

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
                                <View>
                                    <Text>{item.videoUrl}</Text>
                                    <Text>{item.users.length}</Text>
                                </View>
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
                        props.navigation.navigate("YoutubeLink")
                    }}
                    style={{ flex: 1, height: fontCustomSize(50), width: fontCustomSize(50), justifyContent: "center", alignItems: 'center' }}>
                    <Text style={{ color: "white", fontSize: 40 }}>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}