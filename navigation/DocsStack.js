import React, {useContext} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Docs from '../screens/Docs';
import ViewDoc from '../screens/ViewDoc';
import { LangContext } from '../context/LangContext';

const Stack = createStackNavigator();

const DocsStack = () => {
    const {language} = useContext(LangContext);

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
                        headerTitle:route.params?.headerTitle||language==='fr'? 'Tous les Documents':'All Documents'
                    }
                }}
            />
            <Stack.Screen
                name="ViewDoc"
                component={ViewDoc}
                options={{
                    headerTitle:language==='fr'?'Voir le Document':'See the Document'
                }}
                />
        </Stack.Navigator>
    )
}

export default DocsStack;