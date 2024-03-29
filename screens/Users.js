import React, {useContext} from 'react';
import {View, Text, StyleSheet, FlatList, Switch} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../context/AuthContext';
import {LangContext} from '../context/LangContext';

const Users = ({route, navigation}) =>{
    const {user} = useContext(AuthContext);
    const {language} = useContext(LangContext);
    const users = route.params.users;
    const admins = route.params.admins;
    
    const getReadableDate = (date) => {
        const months = {
            en:['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September','October', 'November', 'December'],
            fr:['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin',
                'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
            };
        const readableDate = date.getDate() + ' ' + months[language][date.getMonth()]+' '+date.getFullYear();
        return readableDate
    };

    const promoteAdmin = async(id) => {
        await navigation.setParams({loading:true});

        await firestore()
        .doc(`admins/${id}`)
        .set({admin:true, superadmin:false, isAdminSince: new Date()});
        
        let adminsArr = [];
        const adminsSnapshot = await firestore()
            .collection('admins')
            .orderBy('isAdminSince')
            .get();

        adminsSnapshot.forEach((doc) => {
            adminsArr.push({...doc.data(), id: doc.id})    
        });

        navigation.setParams({admins:adminsArr, loading:false});
    };


    const removeAdmin = async(id) => {
        await navigation.setParams({loading:true});
        await firestore()
        .doc(`admins/${id}`)
        .delete();
        
        navigation.setParams({admins: admins.filter(member => member.id != id), loading:false});
    }

    return (
        <View style={styles.container}>
            <FlatList
                ListHeaderComponent={() =>
                    <>
                        {
                            users.filter(user => !admins.every(member => member.id != user.id)).map((item) => (
                                <View key={item.id} style={styles.user}>
                                <View style={{ justifyContent:'space-between'}}>
                                    <Text style={{fontSize:16, color:'rgb(0, 106, 179)', fontWeight:'500', marginBottom:5}}>{item.email}</Text>
                                    <Text style={{color:'#000'}}>{item.phone}</Text>
                                    <Text style={{color:'#000'}}>
                                        {language==='fr'?'Admin depuis le':'Admin since the'} {getReadableDate(admins.filter(user => user.id == item.id)[0].isAdminSince.toDate())} 
                                    </Text>
                                </View>
                                <View style={{justifyContent:'space-around'}}>
                                    <Text style={{color:'#1C7D2D'}}>admin</Text>
                                    <Switch
                                        value={true}
                                        onValueChange={() => removeAdmin(item.id)}
                                        // thumbColor='#1C7D2D'
                                        // trackColor={{false:'#000', true:'green'}}
                                    />
                                </View>
                            </View>
                            ))
                        }
                    <View style={{width:'100%', marginTop:25}} />
                    </>
                }
                keyExtractor={item => item.id}
                data={users.filter(user => admins.every(member => member.id != user.id))}
                renderItem={({item}) => (
                    <View key={item.id} style={styles.user}>
                        <View style={{ justifyContent:'space-between'}}>
                            <Text style={{fontSize:16, color:'rgb(0, 106, 179)', fontWeight:'500', marginBottom:5}}>{item.email}</Text>
                            <Text style={{color:'#000'}}>{item.phone}</Text>
                            <Text style={{color:'#000'}}>
                                {language==='fr'?'A rejoint depuis le ':'Joined since '}{getReadableDate(item.registeredOn.toDate())} 
                            </Text>
                        </View>
                        <View style={{justifyContent:'space-around'}}>
                            {/* <Text style={{color:'#1C7D2D'}}>admin</Text> */}
                            <Switch
                                value={false}
                                onValueChange={() => promoteAdmin(item.id)}
                                // thumbColor='#1C7D2D'
                                // trackColor={{false:'#000', true:'green'}}
                            />
                        </View>
                    </View>
                )}
                contentContainerStyle={{paddingVertical:30, marginHorizontal:15}}
            />
        </View>
    )
}

export default Users;

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    user:{
        backgroundColor:'#fff',
        width:'100%',
        borderRadius:10,
        marginVertical:5,
        paddingVertical:10,
        paddingHorizontal:15,
        flexDirection:'row',
        justifyContent:'space-between'
    }
})