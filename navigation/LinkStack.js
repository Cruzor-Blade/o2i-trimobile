import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Menu from '../screens/Menu';
import Find from '../screens/Find';
import Upload from '../screens/Upload';
import Users from '../screens/Users';

const Stack = createStackNavigator()

const LinkStack = () => {
    return (
        <Stack.Navigator
            initialRouteName='Menu'
        >
            <Stack.Screen
                name='Menu'
                component={Menu}
                options={({route}) => {
                    return  {
                        headerTitle:'Liens',
                        headerRight:() => route.params?.loading?<ActivityIndicator color='rgb(0, 106, 179)' size={26} style={{marginRight:15, marginLeft:10}} />:null
                    }
                }}
            />
            <Stack.Screen
                name='Find'
                component={Find}
                options={{
                    headerTitle:'Trouver le document'
                }}
            />
            <Stack.Screen
                name='Upload'
                component={Upload}
                options={{
                    headerTitle:'Charger un document'
                }}
            />
            <Stack.Screen
                name='Users'
                component={Users}
                options={({route}) => {
                    return  {
                        headerTitle:'Liste des utilisateurs',
                        headerRight:() => route.params?.loading?<ActivityIndicator color='rgb(0, 106, 179)' size={26} style={{marginRight:15, marginLeft:10}} />:null
                    }
                }}
            />
        </Stack.Navigator>
    )
}

export default LinkStack;