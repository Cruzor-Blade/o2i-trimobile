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
    const [firstAttepmpt, setFirstAttempt] = useState(true);
    const [apiError, setApiError] = useState(null);

    const phoneCond = phoneNum.length > 8 && phoneNum.length <= 16;
    const emailCond = email.includes('@')
        && email.includes('.')
        && email.trim('@', '.') === email
        && !email.includes('@.', '.@')
        && email.length >=5
        && !email.includes(['/']); 
    const passwordCond = password.length >=8;
    const confirmPasswordCond = password === confirmPassword;
    
    async function SignUp() {
        if (apiError) {
            setApiError(null);
        }
        if(phoneCond && emailCond && passwordCond && confirmPasswordCond) {
            try {
                setLoading(true);
                const resultAuth = await auth().createUserWithEmailAndPassword(email, password);
                const currentUserId = resultAuth.user.uid;
                
                await firestore()
                .doc(`users/${currentUserId}`)
                .set({registeredOn: new Date(), email, phone:phoneNum});
        
            } catch (error) {
                if (error.code == "auth/network-request-failed") {
                    setApiError('Problème de connexion');
                } else if (error.code == "auth/too-many-requests") {
                    setApiError("Trop de tentatives. Veuillez réessayer ultérieurement.");
                } else if (error.code == "auth/wrong-password") {
                    setApiError("Le mot de passe est incorrect");
                } else if (error.code == "auth/user-disabled") {
                    setApiError("Cet utilisateur est suspendu.");
                } else if (error.code == "auth/user-not-found") {
                    setApiError("Ce compte utilisateur n'existe pas.");
                } else {
                    setApiError("Une erreur est survenue.");
                }
            } 
            setLoading(false);
        } else {
            if(firstAttepmpt) {
                setFirstAttempt(false);
            }
        }
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
                placeholder='numero de téléphone (format international)'
                onChangeText={(phoneNum) => setPhoneNum('+' + phoneNum.replace(/[^0-9]/g, ''))}
            />

            {!(firstAttepmpt || phoneCond)?
                <Text style={styles.error}>Le numero de telephone est incorrect</Text>
                :
                null
            }
            <CustomInput
                IconComponent={() => <AntDesign size={30} name='mail' color='#47A72A' />}
                keyboardType='email-address'
                value={email}
                placeholder='addresse email'
                onChangeText={(email) => setEmail(email)}
            />
            {!(firstAttepmpt || emailCond)?
                <Text style={styles.error}>L'addresse email est incorrecte</Text>
                :
                null
            }
            <CustomInput
                IconComponent={() => <Ionicons size={30} name={showPassword?'eye':'eye-off'} color={showPassword? '#858789' : '#47A72A'} />}
                secureTextEntry={!showPassword}
                onIconPress={() => setShowPassword(!showPassword)}
                value={password}
                placeholder='mot de passe'
                onChangeText={(password) => setPassword(password)}
            />
            {!(firstAttepmpt || passwordCond)?
                <Text style={styles.error}>Le mot de passe doit avoir au moins 8 charactères</Text>
                :
                null
            }
            <CustomInput
                IconComponent={() => <Ionicons size={30} name={showConfirmPassword?'eye':'eye-off'} color={showConfirmPassword ? '#858789':'#47A72A'} />}
                secureTextEntry={!showConfirmPassword}
                onIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
                value={confirmPassword}
                placeholder='confirmez le numero de téléphone'
                onChangeText={(confirmPassword) => setConfirmPassword(confirmPassword)}
            />
            {!(firstAttepmpt || confirmPasswordCond)?
                <Text style={styles.error}>Confirmez le mot de passe</Text>
                :
                null
            }
            <TouchableOpacity style={styles.logger} onPress={SignUp}>
                    <Text style={{color:'#fff', fontWeight:'600', fontSize:16}}>Créer le compte</Text>
            </TouchableOpacity>
            {
                apiError?
                <Text style={{color:'red', top:-15, fontSize:15}}>{apiError}</Text>
                :
                null
            }
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
    error:{
        color:'red'
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