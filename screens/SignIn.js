import React, {useState} from 'react';
import auth from '@react-native-firebase/auth';
import {View, Text, ActivityIndicator, StyleSheet, TouchableOpacity} from 'react-native';
import Antdesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomInput from '../components/CustomInput';

const SignIn = ({navigation}) => {
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
                    setApiError("Une erreur est survenue.")
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
                Connectez vous à votre compte sur la plateforme <Text style={{color:'#1C7D2D', fontWeight:'500'}}>O2I-TRI</Text>
            </Text>
            <CustomInput
                IconComponent={() => <Antdesign size={30} name='mail' color='#47A72A' />}
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
            <TouchableOpacity style={styles.logger} onPress={SignIn}>
                    <Text style={{color:'#fff', fontWeight:'600', fontSize:16}}>Se Connecter</Text>
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
                    Vous n'avez pas encore un compte?
                    <Text style={{color:'#1C7D2D', fontWeight:'500'}}>
                        {' '}Créez un compte plutôt
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