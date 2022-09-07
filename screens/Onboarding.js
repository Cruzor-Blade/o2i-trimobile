import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Onboarding = () => {
    return (
        <View style={styles.container}>
            <Text>Onboarding Screen</Text>
        </View>
    )
}

export default Onboarding;
const styles = StyleSheet.create({

    container:{
        alignItems:'center',
        justifyContent:'center',
    }
})