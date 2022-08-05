import React from "react";
import { View, Text } from 'react-native';
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
                options={{
                    tabBarIcon: ({focused}) => (
                        <Octicons name="home" size={26} color={focused ? 'rgb(0, 106, 179)' : '#878589'} />
                    ),
                    header:() => (
                        <View style={{borderWidth:2, borderColor:'rgb(0, 106, 179)', backgroundColor:'#fff', borderBottomLeftRadius:10, borderBottomRightRadius:10, borderTopWidth:0, elevation:5}}>
                            <Text style={{textAlign:'center', fontSize:24, paddingVertical:8, color:'rgb(71, 167, 42)'}}>
                                Les Catégories
                            </Text>
                        </View>
                    )
                }}
            />
            <Tab.Screen
                name="DocsStack"
                component={DocsStack}
                options={{
                    tabBarIcon: ({focused}) => (
                        <Entypo name="archive" size={26} color={focused ? 'rgb(0, 106, 179)' : '#878589'} />
                        // <MaterialCommunityIcons name="bookmark-multiple-outline" size={27} color={focused ? '#3f37c9' : '#666666'} />
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