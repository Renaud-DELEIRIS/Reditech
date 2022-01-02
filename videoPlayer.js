import Video from 'react-native-video';
import React, {useState, useEffect, Component} from 'react';
import {
    Text,
    StyleSheet,
    View,
    Dimensions,
    ScrollView
} from 'react-native';

import video from './movie.mp4';

export default class Videos extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={{flex: 1}}>
                <Video
                source={{ uri: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4?_=1' }}
                style={{ width: 300, height: 300 }}
                controls={true}
                ref={(ref) => {
                    this.player = ref
                }}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#5EFFB1',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30
    },
    scrollView: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flex: 1
    },
    video: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: 200,
        height: 200,
    },
    fakeContent: {
        height: 850,
        backgroundColor: "#CCC",
        paddingTop: 250,
        alignItems: "center"
    },
});