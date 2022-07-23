import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const More = () => {
    return (
        <View style={styles.container}>
            <Text>More Screen</Text>
        </View>
    )
}

export default More;
const styles = StyleSheet.create({

    container:{
        alignItems:'center',
        justifyContent:'center',
    }
})