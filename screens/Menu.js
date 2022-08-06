import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const Menu = ({navigation}) => {
    const MenuItem = ({title, screen, Icon}) => {
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate(screen)} >
                <View style={styles.menuItem}>
                    <Icon/>
                    <Text style={{fontSize:16, color:'#fff'}}>
                        {title}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <MenuItem
                title='Charger un document'
                screen='Upload'
                Icon={() => <Feather style={styles.menuIcon} name='upload' size={28} />}
            />
            <MenuItem
                title='Trouver le document'
                screen='Find'
                Icon={() => <Feather style={styles.menuIcon} name='search' size={28} />}
            />
        </View>
    )
}

export default Menu;
const styles = StyleSheet.create({

    container:{
        flex:1,
        paddingVertical:20
    },
    menuItem:{
        backgroundColor:'rgb(0, 106, 179)',
        width:'100%',
        height:45,
        marginVertical:2,
        alignItems:'center',
        flexDirection:'row'
    },
    menuIcon:{
        marginHorizontal:10,
        color:'#fff'
    }
})