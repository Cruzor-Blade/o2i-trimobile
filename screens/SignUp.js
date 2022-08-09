import React, {useContext, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import CustomInput from '../components/CustomInput';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';


const SignUp = ({navigation}) => {
    const [phoneNum, setPhoneNum] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    async function SignUp() {
        setLoading(true);
        const resultAuth = await auth().createUserWithEmailAndPassword(email, password);
        const currentUserId = resultAuth.user.uid;
        
        await firestore()
        .doc(`users/${currentUserId}`)
        .set({registeredOn: new Date(), email, phone:phoneNum});

        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={{fontSize:24, color:'#000', marginHorizontal:30, textAlign:'center', marginBottom:35}}>
                Créez un compte sur la plateforme <Text style={{color:'#1C7D2D', fontWeight:'500'}}>O2I-TRI</Text>
            </Text>
            <CustomInput
                IconComponent={() => <Foundation size={30} name='telephone' color='#47A72A' />}
                keyboardType='phone-pad'
                value={phoneNum}
                placeholder='numero de téléphone'
                onChangeText={(phoneNum) => setPhoneNum(phoneNum)}
            />
            <CustomInput
                IconComponent={() => <AntDesign size={30} name='mail' color='#47A72A' />}
                keyboardType='email-address'
                value={email}
                placeholder='addresse email'
                onChangeText={(email) => setEmail(email)}
            />
            <CustomInput
                IconComponent={() => <Ionicons size={30} name={showPassword?'eye':'eye-off'} color={showPassword? '#858789' : '#47A72A'} />}
                secureTextEntry={!showPassword}
                onIconPress={() => setShowPassword(!showPassword)}
                value={password}
                placeholder='mot de passe'
                onChangeText={(password) => setPassword(password)}
            />
            <CustomInput
                IconComponent={() => <Ionicons size={30} name={showConfirmPassword?'eye':'eye-off'} color={showConfirmPassword ? '#858789':'#47A72A'} />}
                secureTextEntry={!showConfirmPassword}
                onIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
                value={confirmPassword}
                placeholder='confirmez le numero de téléphone'
                onChangeText={(confirmPassword) => setConfirmPassword(confirmPassword)}
            />
            <TouchableOpacity style={styles.logger} onPress={SignUp}>
                    <Text style={{color:'#fff', fontWeight:'600', fontSize:16}}>Créer le compte</Text>
            </TouchableOpacity>
            {
                loading ?
                    <ActivityIndicator color='rgb(0, 106, 179)' size={26} />
                :
                    null
            }
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                <Text style={{color:'#000', marginHorizontal:80, textAlign:'center'}}>
                    Déjà un compte? <Text style={{color:'#1C7D2D', fontWeight:'500'}}>Connectez vous plutôt</Text>
                </Text>
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
        borderColor:'rgba(71, 167, 42, 0.7)',
        marginVertical:5,
        paddingHorizontal:10,
        justifyContent:'center',
        backgroundColor:'#fff',
        width:'95%'
    },
    logger: {
        height:45,
        width:'95%',
        backgroundColor:'#1C7D2D',
        paddingHorizontal:30,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10,
        marginVertical:40
    }
})