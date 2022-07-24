import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/Home";
import Docs from "../screens/Docs";
import Find from "../screens/Find";
import More from "../screens/More";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';

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
                options={{
                    tabBarIcon: ({focused}) => (
                        <Octicons name="home" size={26} color={focused ? '#3f37c9' : '#666666'} />
                    ),
                    headerShown:false
                }}
            />
            <Tab.Screen
                name="Docs"
                component={Docs}
                options={{
                    tabBarIcon: ({focused}) => (
                        <Entypo name="archive" size={26} color={focused ? '#3f37c9' : '#666666'} />
                        // <MaterialCommunityIcons name="bookmark-multiple-outline" size={27} color={focused ? '#3f37c9' : '#666666'} />
                    )
                }}
            />
            <Tab.Screen
                name="Find"
                component={Find}
                options={{
                    tabBarIcon: ({focused}) => (
                        <MaterialCommunityIcons name="link-variant" size={27} color={focused ? '#3f37c9' : '#666666'} />
                    ),
                }}
            />
            <Tab.Screen
                name="More"
                component={More}
                options={{
                    tabBarIcon: ({focused}) => (
                        <Feather name="user" size={27} color={focused ? '#3f37c9' : '#666666'} />
                    )
                }}
            />

        </Tab.Navigator>
    )
}


export default HomeTab;