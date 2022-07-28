import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Download from '../components/Download';

const categories = [
    {
        title:'Documents stratégiques',
        description:"Plan d'action, stratégie, charte...",
        value:'SD'
    },
    {
        title:'Documents contractuels',
        description:"Contrat, protocole d'accord, Mandat/Termes de référence de l'OI, acte créant les CDL",
        value:'CD'
    },
    {
        title:"Rapports de missions d'OI",
        description:"Missions conjointes, indépendantes, accompagnées, vérification et autres...",
        value:'OI-R'
    },
    {
        title:"Syntheses techniques sur l'OI",
        description:"Note d'analyse, note d'information, Note de synthese des rapports d'OI",
        value:'OI-TS'
    },
    {
        title:"Rapport périodique",
        description:"Rapport de thématique, rapport d'activité et narratif",
        value:'PR'
    },
    {
        title:"Manuel / guide d'OI",
        description:"OIEs, OIMs...",
        value:'OI-G'
    },
    {
        title:"CR/PV commité de lecture / commité ad hoc",
        description:"",
        value:'CR-PV'
    },
    {
        title:"Articles de presse",
        description:"Atelier, conférence de presse, information générale",
        value:'PA'
    },
    {
        title:"Publication scientifique sur l'OI",
        description:"Thématique",
        value:'SP-OI'
    }
];

const Home = ({navigation}) => {
    const getDocs = async (category) => {
        console.log('Category: ', category)
        let docsArray = [];
        const documents = await firestore()
        .collection('resources')
        .doc('documents')
        .collection('validated')
        .where('category', '==', category)
        .get()

        documents.forEach(document => {
            docsArray.push({...document.data(), id:document.id});
        });
        return docsArray;
    };
    
    const seeDocs = async(category) => {
        const categoryDocs = await getDocs(category);
        console.log("Docs on home screen: ", categoryDocs);
        navigation.navigate('DocsStack', {
            screen:'Docs',
            params: {documents:categoryDocs}
        });
    }
    return (
        <View style={styles.container}>
            <Download/>
            <FlatList
                ListHeaderComponent={() => 
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerTitle}>Les categories</Text>
                    </View>
                }
                stickyHeaderIndices={[0]}
                data={categories}
                keyExtractor={item => item.title}
                renderItem={({item}) => (
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => seeDocs(item.value)}
                        >
                        <View style={styles.category}>
                            <Text style={styles.categoryTitle}>
                                {item.title}
                            </Text>
                            <Text style={styles.categoryDescription}>
                                {item.description}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
                contentContainerStyle={{paddingVertical:10}}
            />
        </View>
    )
}

export default Home;
const styles = StyleSheet.create({

    container:{
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#ffffff',
    },
    headerContainer:{
        backgroundColor:'#555555'
    },
    headerTitle: {
        textAlign:'center',
        fontSize:24,
        paddingVertical:8

    },
    category:{
        // minHeight:100,
        flex:1,
        marginVertical:15,
        marginHorizontal:25,
        backgroundColor:'#dddddd',
        borderRadius:10,
    },
    categoryTitle:{
        textAlign:'center',
        paddingHorizontal:10,
        marginVertical:5,
        fontSize:19
    },
    categoryDescription:{
        paddingHorizontal:15,
        fontSize:16,
        marginBottom:15
    }
})