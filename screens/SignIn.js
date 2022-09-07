import React, {useContext, useState} from 'react';
import auth from '@react-native-firebase/auth';
import {View, Text, ActivityIndicator, StyleSheet, TouchableOpacity} from 'react-native';
import Antdesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomInput from '../components/CustomInput';
import { LangContext } from '../context/LangContext';

const SignIn = ({navigation}) => {
    const {language} = useContext(LangContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const [loading, setLoading] = useState(false);
    const [firstAttepmpt, setFirstAttempt] = useState(true);
    const [apiError, setApiError] = useState(null);
    
    const emailCond = email.includes('@')
        && email.includes('.')
        && email.trim('@', '.') === email
        && !email.includes('@.', '.@')
        && email.length >=5
        && !email.includes(['/']); 
    const passwordCond = password.length >=8;

    async function SignIn() {
        if (apiError) {
            setApiError(null);
        }

        if(emailCond &&passwordCond) {
            try {
                setLoading(true);
                await auth().signInWithEmailAndPassword(email, password);
                setLoading(false);
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
                {language==='fr'?'Connectez vous à votre compte sur la plateforme':'Login to your account on the platform'} <Text style={{color:'#1C7D2D', fontWeight:'500'}}>O2I-TRI</Text>
            </Text>
            <CustomInput
                IconComponent={() => <Antdesign size={30} name='mail' color='#47A72A' />}
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
            <TouchableOpacity style={styles.logger} onPress={SignIn}>
                    <Text style={{color:'#fff', fontWeight:'600', fontSize:16}}>{language==='fr'?'Se Connecter':'Sign In'}</Text>
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
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={{color:'#000', marginHorizontal:80, textAlign:'center'}}>
                    {language==='fr'?"Vous n'avez pas encore un compte?":"Don't have an account yet?"}
                    <Text style={{color:'#1C7D2D', fontWeight:'500'}}>
                        {language==='fr'?' Créez un compte plutôt':' Create an account instead'}
                    </Text>
                </Text>
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
    logger: {
        height:45,
        width:'95%',
        backgroundColor:'#1C7D2D',
        paddingHorizontal:30,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10,
        marginVertical:40
    },
    error:{
        color:'red'
    }
})