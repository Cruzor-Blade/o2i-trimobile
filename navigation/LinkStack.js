import React, {useContext} from 'react';
import {ActivityIndicator} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Menu from '../screens/Menu';
import Find from '../screens/Find';
import Upload from '../screens/Upload';
import Users from '../screens/Users';
import { LangContext } from '../context/LangContext';

const Stack = createStackNavigator()

const LinkStack = () => {
    const {language} = useContext(LangContext);

    return (
        <Stack.Navigator
            initialRouteName='Menu'
        >
            <Stack.Screen
                name='Menu'
                component={Menu}
                options={({route}) => {
                    return  {
                        headerTitle:language==='fr'?'Liens':'Links',
                        headerRight:() => route.params?.loading?<ActivityIndicator color='rgb(0, 106, 179)' size={26} style={{marginRight:15, marginLeft:10}} />:null
                    }
                }}
            />
            <Stack.Screen
                name='Find'
                component={Find}
                options={{
                    headerTitle:language==='fr'?'Trouver le Document':'Find the Document'
                }}
            />
            <Stack.Screen
                name='Upload'
                component={Upload}
                options={{
                    headerTitle:language==='fr'?'Charger un Document':'Upload a Document'
                }}
            />
            <Stack.Screen
                name='Users'
                component={Users}
                options={({route}) => {
                    return  {
                        headerTitle:language==='fr'?'Liste des utilisateurs':'Users List',
                        headerRight:() => route.params?.loading?<ActivityIndicator color='rgb(0, 106, 179)' size={26} style={{marginRight:15, marginLeft:10}} />:null
                    }
                }}
            />
        </Stack.Navigator>
    )
}

export default LinkStack;