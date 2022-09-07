import React, {useContext, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import auth from '@react-native-firebase/auth';
import { LangContext } from '../context/LangContext';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const More = () => {
    const {isAdmin, user, setUser} = useContext(AuthContext);
    const {language, setLanguage} = useContext(LangContext);

    const [langOpen, setLangOpen] = useState(false);
    const [lang, setLang] = useState(language);

    async function logOut() {
        await auth().signOut();
        setUser(null);
    };

    function changeLanguage (languageTag) {
        AsyncStorage.setItem('currentLanguage', languageTag);
        setLanguage(languageTag);
    }
    return (
        <View style={styles.container}>
            <Text style={{color:'#000', fontSize:20, marginVertical:20, textAlign:'center'}}>{user.email}</Text>
            <View style={{flexDirection:'row', alignItems:'center', marginVertical:10}}>
                {/* <Text>
                    {language==='fr'?'Langue: ':'Language'}
                </Text> */}
                <DropDownPicker
                    autoScroll
                    items={[{label:'Français', value:'fr'}, {label:'English', value:'en'}]}
                    open={langOpen}
                    value={lang}
                    setOpen={setLangOpen}
                    setValue={setLang}
                    onChangeValue={changeLanguage}
                    style={styles.dropDownInput}
                    placeholder={language==='fr'?"langue":'language'}
                    zIndex={5000}
                    zIndexInverse={6000}
                    selectedItemLabelStyle={{color:'rgb(0, 106, 179)', fontSize:15}}
                    labelStyle={{color:'rgb(0, 106, 179)'}}
                />

            </View>
            <TouchableOpacity style={styles.signOut} onPress={logOut}>
                <Text style={styles.signOutLabel}>{language==='fr'?'Se déconnecter':'Sign out'}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default More;
const styles = StyleSheet.create({
    container:{
        flex:1,
        paddingHorizontal:'2.5%',
    },
    signOut:{
        flexGrow:0,
        height:50,
        backgroundColor:'rgb(0, 106, 179)',
        alignItems:'center',
        justifyContent:'center',
        marginHorizontal:70,
        borderRadius:10
    },
    signOutLabel:{
        fontSize:18,
        color:'#fff'
    },
    dropDownInput:{
        marginVertical:2,
        borderWidth:1,
        borderColor:'#878589',
        alignSelf:'center',
        width:200,
        paddingLeft:50
    },
})