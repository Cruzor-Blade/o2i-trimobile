import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Docs from '../screens/Docs';
import ViewDoc from '../screens/ViewDoc';

const Stack = createStackNavigator();

const DocsStack = () => {
    return (
        <Stack.Navigator
            initialRouteName='Docs'
        >
            <Stack.Screen
                name="Docs"
                component={Docs}
                options={({navigation, route}) => {
                    console.log('Route params: ', route.params)
                    return {
                        headerTitle:route.params?.headerTitle||'Tous les documents'
                    }
                }}
            />
            <Stack.Screen
                name="ViewDoc"
                component={ViewDoc}
                options={{
                    headerTitle:'Voir le document'
                }}
                />
        </Stack.Navigator>
    )
}

export default DocsStack;