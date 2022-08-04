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
                options={{
                    headerShown:false
                }}
            />
            <Stack.Screen
                name='SignIn'
                component={SignIn}
                options={{
                    headerTitle:'Connexion'
                }}
            />
            <Stack.Screen
                name='SignUp'
                component={SignUp}
                options={{
                    headerTitle:'Créer un compte'
                }}
            />
        </Stack.Navigator>
    )
}

export default AuthStack;