import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const Docs = ({navigation, route}) => {
    const getDocs = async () => {
        const documents = await firestore()
        .collection('resources')
        .doc('documents')
        .collection('validated')
        .get()

        documents.forEach(document => {
            console.log(document.data())
        })
    }
    useEffect(() => {
        getDocs();
    }, [])
    return (
        <View style={styles.container}>
            <Text>Docs Screen</Text>
        </View>
    )
}

export default Docs;
const styles = StyleSheet.create({

    container:{
        alignItems:'center',
        justifyContent:'center',
    }
})