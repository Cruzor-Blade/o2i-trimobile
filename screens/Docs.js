import React, {useContext, useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, ActivityIndicator, Image, ImageBackground} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import firestore from '@react-native-firebase/firestore';
import { LangContext } from '../context/LangContext';

const Docs = ({navigation, route}) => {
    let paramsDocs = route.params?.documents||null;
    
    const {language} = useContext(LangContext);
    const [documents, setDocuments] = useState(paramsDocs);
    const [loading, setLoading] = useState(false);
    
    const { width } = Dimensions.get('window');
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

    const getDocs = async () => {
        setLoading(true);
        let docsArray = [];
        const docs = await firestore()
        .collection('resources')
        .doc('documents')
        .collection('validated')
        .get();

        docs.forEach(document => {
            docsArray.push({...document.data(), id:document.id});
        });
        setDocuments(docsArray);

        setLoading(false);
    };

    //Force state update after navigation if there are documents in the params
    //and clear the documents params to avoid rerender (since documents params would still exists if not)
    if(route.params?.documents) {
        setDocuments(route.params?.documents);
        route.params.documents = undefined;
    }
    useEffect(() => {
        if(!documents) {
            getDocs();
        };
        
    }, []);
    // console.log('Waiting docs: ', route.params?.waitingDocs)
    return (
        <View style={styles.container}>
            {
                loading ?
                <View style={{alignItems:'center', justifyContent:'center', flex:1}}>
                    <ActivityIndicator size='large' />
                </View>
                :
                <FlatList
                    data ={documents}
                    numColumns={2}
                    keyExtractor={item => item.id}
                    ListEmptyComponent={() => (
                        <View style={{alignItems:'center', marginTop:120}}>
                            <Text style={{marginHorizontal:20, fontSize:19, color:'#000', textAlign:'center'}}>
                                {language==='fr'?'Aucun document correspondant pour le moment.':'No corresponding document for the moment.'}
                            </Text>
                            <Image source={require('../assets/nofile.png')} style={{width:250, height:320, resizeMode:'contain', tintColor:'#aaaaaa'}}/>
                        </View>
                    )}
                    renderItem={({item}) => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('ViewDoc', {document:item, waitingDoc:route.params?.waitingDocs})}
                            activeOpacity={0.9}
                            >
                            <View style={{...styles.docContainer, width:width/2.2, marginHorizontal:width/44}}>
                                <FontAwesome5 name='file-pdf' color='red' size={80} style={{margin:10}} />
                                <Text style={styles.docTitle}>
                                    {item.title}
                                </Text>
                                <Text style={styles.docOthers}>
                                    {item.organisation}
                                </Text>
                                <Text style={{...styles.docOthers, marginBottom:8}}>
                                    {getReadableDate(item.createdAt.toDate())}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            }
        </View>
    )
}

export default Docs;
const styles = StyleSheet.create({

    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    docContainer: {
        // borderWidth:1,
        backgroundColor:'#fff',
        minHeight:160,
        marginVertical:20,
        borderRadius:10,
        elevation:1,
        // shadowColor:'green'
    },
    docTitle:{
        color:'rgb(0, 106, 179)',
        fontSize:16,
        fontWeight:'500',
        marginHorizontal:10,
        marginBottom:5
    },
    docOthers:{
        color:'#000',
        marginHorizontal:8,
        marginVertical:0
    }
})