import React from 'react';
import {View, Text} from 'react-native';

export default function Detailed({route}){
    const {item} = route.params;


    return(
        <View style={{padding: 20}}>
            <Text style={{fontSize: 24, fontWeight: 'bold'}}>{item.title}</Text>
            <Text style={{marginTop: 10, fontSize: 18}}>{item.content}</Text>
        </View>
    );
}