import React, {useContext, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import CustomInput from '../components/CustomInput';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { LangContext } from '../context/LangContext';


const SignUp = ({navigation}) => {
    const {language} = useContext(LangContext);
    
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
                    setApiError(language==='fr'?'Problème de connexion':'Network error');
                } else if (error.code == "auth/too-many-requests") {
                    setApiError(language==='fr'?"Trop de tentatives. Veuillez réessayer ultérieurement.":'Too many trials. Please come back later');
                } else if (error.code == "auth/wrong-password") {
                    setApiError(language==='fr'?"Le mot de passe est incorrect":'The password is incorrect');
                } else if (error.code == "auth/user-disabled") {
                    setApiError(language==='fr'?"Cet utilisateur est suspendu.":'The account have been suspended');
                } else if (error.code == "auth/user-not-found") {
                    setApiError(language==='fr'?"Ce compte utilisateur n'existe pas.":"This user doesn't exist");
                } else {
                    setApiError(language==='fr'?"Une erreur est survenue.":'An error occured')
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
                {language==='fr'?'Créez un compte sur la plateforme':'Create an account on the platform'}
                <Text style={{color:'#1C7D2D', fontWeight:'500'}}>O2I-TRI</Text>
            </Text>
            <CustomInput
                IconComponent={() => <Foundation size={30} name='telephone' color='#47A72A' />}
                keyboardType='phone-pad'
                value={phoneNum}
                placeholder={language==='fr'?'numero de téléphone (format international)':'phone number (international format)'}
                onChangeText={(phoneNum) => setPhoneNum('+' + phoneNum.replace(/[^0-9]/g, ''))}
            />

            {!(firstAttepmpt || phoneCond)?
                <Text style={styles.error}>{language==='fr'?'Le numero de telephone est incorrect':'Phone number is incorrect'}</Text>
                :
                null
            }
            <CustomInput
                IconComponent={() => <AntDesign size={30} name='mail' color='#47A72A' />}
                keyboardType='email-address'
                value={email}
                placeholder={language==='fr'?'addresse email':'email address'}
                onChangeText={(email) => setEmail(email)}
            />
            {!(firstAttepmpt || emailCond)?
                <Text style={styles.error}>{language==='fr'?"L'addresse email est incorrecte":'The email address is incorrect'}</Text>
                :
                null
            }
            <CustomInput
                IconComponent={() => <Ionicons size={30} name={showPassword?'eye':'eye-off'} color={showPassword? '#858789' : '#47A72A'} />}
                secureTextEntry={!showPassword}
                onIconPress={() => setShowPassword(!showPassword)}
                value={password}
                placeholder={language==='fr'?'mot de passe':'password'}
                onChangeText={(password) => setPassword(password)}
            />
            {!(firstAttepmpt || passwordCond)?
                <Text style={styles.error}>{language==='fr'?'Le mot de passe doit avoir au moins 8 charactères':'Password should have at least 8 characters'}</Text>
                :
                null
            }
            <CustomInput
                IconComponent={() => <Ionicons size={30} name={showConfirmPassword?'eye':'eye-off'} color={showConfirmPassword ? '#858789':'#47A72A'} />}
                secureTextEntry={!showConfirmPassword}
                onIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
                value={confirmPassword}
                placeholder={language==='fr'?'confirmez le mot de passe':'confirm password'}
                onChangeText={(confirmPassword) => setConfirmPassword(confirmPassword)}
            />
            {!(firstAttepmpt || confirmPasswordCond)?
                <Text style={styles.error}>{language==='fr'?'Les mots de passe ne correspondent pas':'Passwords do not match'}</Text>
                :
                null
            }
            <TouchableOpacity style={styles.logger} onPress={SignUp}>
                    <Text style={{color:'#fff', fontWeight:'600', fontSize:16}}>{language==='fr'?'Créer le compte':'Sign Up'}</Text>
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
                    {language==='fr'?'Déjà un compte?':'Already have an account?'}
                    <Text style={{color:'#1C7D2D', fontWeight:'500'}}>{language==='fr'?'Connectez vous plutôt':'Sign in instead'}</Text>
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