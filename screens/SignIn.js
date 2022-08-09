import React, {useState} from 'react';
import auth from '@react-native-firebase/auth';
import {View, Text, ActivityIndicator, StyleSheet, TouchableOpacity} from 'react-native';
import Antdesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomInput from '../components/CustomInput';

const SignIn = ({navigation}) => {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    async function SignIn() {
        setLoading(true);
        await auth().signInWithEmailAndPassword(email, password);
        setLoading(false);
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
            <CustomInput
                IconComponent={() => <Ionicons size={30} name={showPassword?'eye':'eye-off'} color={showPassword? '#858789' : '#47A72A'} />}
                secureTextEntry={!showPassword}
                onIconPress={() => setShowPassword(!showPassword)}
                value={password}
                placeholder='mot de passe'
                onChangeText={(password) => setPassword(password)}
            />
            <TouchableOpacity style={styles.logger} onPress={SignIn}>
                    <Text style={{color:'#fff', fontWeight:'600', fontSize:16}}>Se Connecter</Text>
            </TouchableOpacity>
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
    }
})