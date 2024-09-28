import React, {useState} from 'react';
import {SafeAreaView, TextInput, View, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function WritingNavi(){

    const [uTitle, setUTitle] = useState('');
    const [uContent, setUContent] = useState('');

    return(
        <View style={styles.box}>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.input}
                    placeholder="제목을 입력해주세요"
                    onChangeText={setUTitle}
                    value={uTitle}
                />
            </View>
            <View style={styles.iconView}>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    box: {
        flex: 1,
    },
    inputView: {
        flex :3,
    },iconView : {
        flex : 1,
    },textInput : {
        
    }, input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    }
})