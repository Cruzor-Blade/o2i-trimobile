import React, {useState} from 'react';
import auth from '@react-native-firebase/auth';
import {View, Text, TextInput, StyleSheet, TouchableOpacity} from 'react-native';

const SignIn = ({navigation}) => {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

    function SignIn() {
        auth().signInWithEmailAndPassword(email, password);
    };

    return (
        <View style={styles.container}>
            <TextInput
                value={email}
                placeholder='addresse email'
                onChangeText={(email) => setEmail(email)}
                style={styles.textInput}
            />
            <TextInput
                value={password}
                placeholder='mot de passe'
                onChangeText={(password) => setPassword(password)}
                style={styles.textInput}
            />
            <TouchableOpacity onPress={SignIn}>
                <View style={{height:40, width:'95%', backgroundColor:'green'}}>
                    <Text>Log In</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={{color:'green'}}>Don't have an account? Register instead</Text>
            </TouchableOpacity>
        </View>
    )
}

export default SignIn;
const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    textInput:{
        color:'#000000',
        height:50,
        borderRadius:8,
        borderWidth:1,
        marginVertical:3,
        paddingHorizontal:10,
        justifyContent:'center',
        backgroundColor:'#fff',
        width:'95%'
    },
})