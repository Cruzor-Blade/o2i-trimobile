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
                options={{
                    headerTitle:'Documents'
                }}
            />
            <Stack.Screen name="ViewDoc" component={ViewDoc} />
        </Stack.Navigator>
    )
}

export default DocsStack;