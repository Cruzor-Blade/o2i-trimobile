import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

const Docs = ({navigation, route}) => {
    console.log("Route params documents: ",route.params.documents);
    const documents = route.params?.documents;
    const { width } = Dimensions.get('window');
    console.log(documents);
    return (
        <View style={styles.container}>
            
            <Text>Docs Screen</Text>
            <FlatList
                data ={documents}
                numColumns={2}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                    <TouchableOpacity onPress={() => navigation.navigate('ViewDoc', {document:item})}>
                        <View style={{...styles.docContainer, width:width/2.2, marginHorizontal:width/44}}>
                            <FontAwesome5 name='file-pdf' size={30} />
                            <Text>
                                {item.title}
                            </Text>
                            <Text>
                                {item.organisation}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}

export default Docs;
const styles = StyleSheet.create({

    container:{
        alignItems:'center',
        justifyContent:'center',
    },
    docContainer: {
        borderWidth:1
    }
})