import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Docs = () => {
    return (
        <View style={styles.container}>
            <Text>Docs Screen</Text>
        </View>
    )
}

export default Docs;
const styles = StyleSheet.create({

    container:{
        alignItems:'center',
        justifyContent:'center',
    }
})