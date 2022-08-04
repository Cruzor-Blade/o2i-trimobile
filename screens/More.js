import React, {useContext} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import firestore from '@react-native-firebase/firestore';


const More = () => {
    const {isAdmin, user, } = useContext(AuthContext);
    console.log('Is admin: ', isAdmin);

    return (
        <View style={styles.container}>
            <Text>{user.email}</Text>
        </View>
    );
};

export default More;
const styles = StyleSheet.create({

    container:{
        alignItems:'center',
        justifyContent:'center',
    }
})