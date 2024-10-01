import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';

export default function Detailed({route, navigation}){
    const {item} = route.params;

    const goBack = () => {
        navigation.goBack();
    }
    // const goEdit = () => {
    //     Alert.alert(
    //         '수정?',
    //         '수정하시겠습니까?',
    //         [
    //             {text: '네', onPress: () => {navigation.navigate('Edited', {item: item})}},
    //             {text:'취소', style: 'cancel', onPress:()=>{}}
    //         ]
    //     )
    // }

    return(
        <View style={styles.background}>
            <Nav goBack={goBack} title={item.title} item={item} navigation={navigation}></Nav>
            <View style={styles.main}>
                <Text style={{marginTop: 10, fontSize: 18}}>{item.content}</Text>
            </View>
        </View>
    );
}


function Nav({goBack, title,navigation, item}) {

    return(
        <View style={styles.nav}>
            <TouchableOpacity onPress={goBack} style={styles.side}>
                <Text>◀</Text>
            </TouchableOpacity>
            <Text style={styles.center}>
                {title}
            </Text>
            <TouchableOpacity onPress={()=>{navigation.navigate('Edited', {item:item})}} style={styles.side}>
                <Text>
                    수정하기
                </Text>
            </TouchableOpacity>
        </View>
    )
}


    const styles = StyleSheet.create({
        background: {
            flex: 1,
            padding: 20,
        },
        top: {
            flex: 1,
            justifyContent: 'center',
        },
        main: {
            flex: 7
        },
        side: {
            flex: 1,
        },
        center: {
            flex: 3
        },
        nav: {
            flexDirection: 'row',
        }
    })