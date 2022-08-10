import React, {useContext} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Onboarding from '../screens/Onboarding';
import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';
import { LangContext } from '../context/LangContext';

const Stack = createStackNavigator();

const AuthStack = () => {
    const {language} = useContext(LangContext);
    
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
                    headerTitle:language==='fr' ? 'Connexion':'Sign in'
                }}
            />
            <Stack.Screen
                name='SignUp'
                component={SignUp}
                options={{
                    headerTitle:language==='fr'?'Créer un compte':'Sign Up'
                }}
            />
        </Stack.Navigator>
    )
}

export default AuthStack;