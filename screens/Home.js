import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Home = () => {
    return (
        <View style={styles.container}>
            <Text>Home Screen</Text>
        </View>
    )
}

export default Home;
const styles = StyleSheet.create({

    container:{
        alignItems:'center',
        justifyContent:'center',
    }
})