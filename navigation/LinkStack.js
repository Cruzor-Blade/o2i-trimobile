import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Menu from '../screens/Menu';
import Find from '../screens/Find';
import Upload from '../screens/Upload';

const Stack = createStackNavigator()

const LinkStack = () => {
    return (
        <Stack.Navigator
            initialRouteName='Menu'
        >
            <Stack.Screen
                name='Menu'
                component={Menu}
            />
            <Stack.Screen
                name='Find'
                component={Find}
            />
            <Stack.Screen
                name='Upload'
                component={Upload}
            />
        </Stack.Navigator>
    )
}

export default LinkStack;