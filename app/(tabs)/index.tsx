import React from 'react';
import { NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Main from '../src/Main';
import Writing from '../src/Writing';
import Detailed from '../src/Detailed';

const Stack = createNativeStackNavigator();

export default function App() {
    return(
        <NavigationContainer independent={true}>
            <Stack.Navigator initialRouteName="Main">
                <Stack.Screen name="Main" component={Main}/>
                <Stack.Screen name="Writing" component={Writing}/>
                <Stack.Screen name="Detailed" component={Detailed}/>
            </Stack.Navigator>
        </NavigationContainer>
    );

}
