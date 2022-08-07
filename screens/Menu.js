import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';


const Menu = ({navigation}) => {
    const MenuItem = ({title, onPress, Icon}) => {
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={onPress} >
                <View style={styles.menuItem}>
                    <Icon/>
                    <Text style={{fontSize:16, color:'#fff'}}>
                        {title}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    };

    const getUsers = async() => {
        let usersArr = [];
        const querySnapshot = await firestore()
            .collection("users")
            .orderBy("registeredOn")
            .get()
        querySnapshot.forEach((doc) => {
        usersArr.push({...doc.data(), id: doc.id})
        });

        let adminsArr = [];
        const adminsSnapshot = await firestore()
            .collection('admins')
            .orderBy('isAdminSince')
            .get();

        adminsSnapshot.forEach((doc) => {
            adminsArr.push({...doc.data(), id: doc.id})    
        })

        navigation.navigate('Users', {users:usersArr, admins:adminsArr})
    };

    const getWaitingDocs = async() => {
        let waitingDocsArr = [];
        const querySnapshot =
            await firestore()
            .collection("resources/documents/waiting")
            .orderBy('createdAt')
            .get();
        
            querySnapshot.forEach((doc) => {
                waitingDocsArr.push({...doc.data(), id: doc.id})
            });
            
        console.log('Waiting docs: ', waitingDocsArr);
        navigation.navigate('DocsStack', {
            screen:'Docs',
            params: {documents:waitingDocsArr}
        });
    };

    return (
        <View style={styles.container}>
            <MenuItem
                title='Charger un document'
                onPress={() => navigation.navigate('Upload')}
                Icon={() => <Feather style={styles.menuIcon} name='upload' size={28} />}
            />
            <MenuItem
                title='Trouver le document'
                onPress={() => navigation.navigate('Find')}
                Icon={() => <Feather style={styles.menuIcon} name='search' size={28} />}
            />
            <MenuItem
                title='Documents en attente'
                onPress={getWaitingDocs}
                Icon={() => <Ionicons style={styles.menuIcon} name='timer-outline' size={28} />}
            />
            <MenuItem
                title='Utilisateurs'
                onPress={getUsers}
                Icon={() => <Feather style={styles.menuIcon} name="user" size={27}/>}
            />
        </View>
    )
}

export default Menu;
const styles = StyleSheet.create({

    container:{
        flex:1,
        paddingVertical:20
    },
    menuItem:{
        backgroundColor:'rgb(0, 106, 179)',
        height:45,
        marginVertical:3,
        alignItems:'center',
        flexDirection:'row',
        marginHorizontal:3
    },
    menuIcon:{
        marginHorizontal:10,
        color:'#fff'
    }
})