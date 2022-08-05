import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

const Docs = ({navigation, route}) => {
    // console.log("Route params documents: ",route.params.documents);
    const documents = route.params?.documents;
    const { width } = Dimensions.get('window');
    const getReadableDate = (date) => {
        const monthsArray = ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        const readableDate = date.getDate() + ' ' + monthsArray[date.getMonth()]+' '+date.getFullYear();
        return readableDate
    };

    return (
        <View style={styles.container}>
            {
                documents ?
                <FlatList
                    data ={documents}
                    numColumns={2}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('ViewDoc', {document:item})}
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
                :
                <View style={{alignItems:'center', justifyContent:'center', flex:1}}>
                    <Text style={{fontSize:19, color:'#000'}}>Rien à voir ici pour le moment...</Text>
                </View>
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