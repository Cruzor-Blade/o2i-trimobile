import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const Menu = ({navigation}) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate('Upload')} >
                <View style={styles.menuItem}>
                    <Text>
                        Charger un document
                    </Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Find')}>
                <View style={styles.menuItem}>
                    <Text>
                        Trouver le document
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default Menu;
const styles = StyleSheet.create({

    container:{
        flex:1,
    },
    menuItem:{
        backgroundColor:'#fff',
        width:'100%',
        height:40,
        margin:5,
        justifyContent:'center'
    }
})