import React, {useContext} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import auth from '@react-native-firebase/auth';
import { LangContext } from '../context/LangContext';


const More = () => {
    const {isAdmin, user, setUser} = useContext(AuthContext);
    const {language} = useContext(LangContext);

    async function logOut() {
        await auth().signOut();
        setUser(null);
    };

    return (
        <View style={styles.container}>
            <Text>{user.email}</Text>
            <TouchableOpacity onPress={logOut}>
                <View style={{height:35, width:100, backgroundColor:'green', alignItems:'center', justifyContent:'center'}}>
                    <Text>{language==='fr'?'Se déconnecter':'Sign out'}</Text>
                </View>
            </TouchableOpacity>
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