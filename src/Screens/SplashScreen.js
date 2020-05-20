import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import { getData, storeData } from '../Store/Storage'
import { user } from '../Store/Keys';
import Stream from './Stream';

const Stack = createStackNavigator();
export default SplashScren = () => {

    const [isUser, setIsUser] = useState(false);
    const [isLoading, setLoading] = useState(true)
    const [name, setUser] = useState('');

    useEffect(() => {
        getData(user).then(res => {
            if (res == null || res == undefined) {
                setIsUser(false)
            } else {
                setIsUser(true)
            }
            setLoading(false)
        })
    }, [])

    LoadingScreen = () => {
        return (
            <View>
                <Text>
                    {isUser}
                </Text>
            </View>
        );
    }

    CreateAccountScreen = () => {
        const [newName, setNewName] = useState("")

        return (
            <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
                <TextInput
                    value={newName}
                    onChangeText={res => {
                        setNewName(res)
                    }}
                    style={{ borderBottomWidth: 1, borderColor: "black", width: "80%" }} />
                <TouchableOpacity
                    onPress={() => {
                        storeData(user, newName).then(() => {
                            setIsUser(true)
                        })
                    }}
                >
                    <Text>
                        Create Account
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }


    return (
        <NavigationContainer>
            <Stack.Navigator>
                {isLoading ? <Stack.Screen component={LoadingScreen} name="Splash" /> : isUser ? <Stack.Screen component={Stream} name="Stream" /> : <Stack.Screen component={CreateAccountScreen} name="Nam" options={{ headerShown: false }} />}
            </Stack.Navigator>
        </NavigationContainer >
    )
}