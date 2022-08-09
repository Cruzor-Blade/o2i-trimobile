import React from "react";
import { ActivityIndicator } from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/Home";
import More from "../screens/More";
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import DocsStack from "./DocsStack";
import LinkStack from "./LinkStack";


const Tab = createBottomTabNavigator();

const HomeTab = () => {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{tabBarShowLabel:false}}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={({route}) => {
                    return {
                        tabBarIcon: ({focused}) => (
                            <Octicons name="home" size={26} color={focused ? 'rgb(0, 106, 179)' : '#878589'} />
                        ),
                        headerTitle:'Les Catégories',
                        headerRight:() => route.params?.loading?<ActivityIndicator color='rgb(0, 106, 179)' size={26} style={{marginRight:15, marginLeft:10}} />:null
                    }
                }}
            />
            <Tab.Screen
                name="DocsStack"
                component={DocsStack}
                options={{
                    tabBarIcon: ({focused}) => (
                        <Entypo name="archive" size={26} color={focused ? 'rgb(0, 106, 179)' : '#878589'} />
                    ),
                    headerShown:false
                }}
            />
            <Tab.Screen
                name="LinkStack"
                component={LinkStack}
                options={{
                    tabBarIcon: ({focused}) => (
                        <MaterialCommunityIcons name="link-variant" size={27} color={focused ? 'rgb(0, 106, 179)' : '#878589'} />
                    ),
                    headerShown:false
                }}
            />
            <Tab.Screen
                name="More"
                component={More}
                options={{
                    tabBarIcon: ({focused}) => (
                        <Feather name="user" size={27} color={focused ? 'rgb(0, 106, 179)' : '#878589'} />
                    )
                }}
            />

        </Tab.Navigator>
    )
}


export default HomeTab;