import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import Video from 'react-native-video';

export default Stream = () => {
    const refVideo = useRef(null);
    const [old, setOld] = useState(0);

    useEffect(() => {
        refVideo.current.presentFullscreenPlayer()
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <Video source={{ uri: "http://www.onirikal.com/videos/mp4/battle_games.mp4" }}   // Can be a URL or a local file.
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
            />
        </View>
    );
}