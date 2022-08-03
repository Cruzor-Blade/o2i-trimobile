import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Onboarding from '../screens/Onboarding';
import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';

const Stack = createStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator
            initialRouteName='SignIn'
        >
            <Stack.Screen
                name='Onboarding'
                component={Onboarding}
            />
            <Stack.Screen
                name='SignIn'
                component={SignIn}
            />
            <Stack.Screen
                name='SignUp'
                component={SignUp}
            />
        </Stack.Navigator>
    )
}

export default AuthStack;