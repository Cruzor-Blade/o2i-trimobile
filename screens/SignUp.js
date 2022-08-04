import React, {useContext, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';


const SignUp = ({navigation}) => {
    const [phoneNum, setPhoneNum] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    async function SignUp() {
        const resultAuth = await auth().createUserWithEmailAndPassword(email, password);
        const currentUserId = resultAuth.user.uid;
        console.log('Current user id: ', currentUserId);
        
        await firestore()
        .doc(`users/${currentUserId}`)
        .set({registeredOn: new Date(), email, phone:phoneNum});

        console.log('Account created successfully! ');
    };

    return (
        <View style={styles.container}>
            <TextInput
                keyboardType='phone-pad'
                value={phoneNum}
                placeholder='numero de téléphone'
                onChangeText={(phoneNum) => setPhoneNum(phoneNum)}
                style={styles.textInput}
            />
            <TextInput
                keyboardType='email-address'
                value={email}
                placeholder='addresse email'
                onChangeText={(email) => setEmail(email)}
                style={styles.textInput}
            />
            <TextInput
                secureTextEntry={true}
                value={password}
                placeholder='mot de passe'
                onChangeText={(password) => setPassword(password)}
                style={styles.textInput}
            />
            <TextInput
                secureTextEntry={true}
                value={confirmPassword}
                placeholder='confirmez le numero de téléphone'
                onChangeText={(confirmPassword) => setConfirmPassword(confirmPassword)}
                style={styles.textInput}
            />
            <TouchableOpacity onPress={SignUp}>
                <View style={{height:40, width:'95%', backgroundColor:'green'}}>
                    <Text>Créer le compte</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                <Text style={{color:'green'}}>Déjà un compte? Connectez vous plutôt</Text>
            </TouchableOpacity>
        </View>
    )
}

export default SignUp;
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