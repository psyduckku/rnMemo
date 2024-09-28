import {NavigationContainer} from '@react-navigation/native';
import {View, Text, Button} from 'react-native';
export default function NaviContainer(){


    return(
        <NavigationContainer independent={true}>
            <View></View>
            <View>멤멤모멤멤</View>
            <View><Button title="추가"></Button></View>
        </NavigationContainer>
    )
}