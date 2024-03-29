import React, {useContext} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import UploadParams from '../assets/UploadParams';
import { LangContext } from '../context/LangContext';

const categories = {
    en:[
        {
            title:'Strategic documents',
            description:"Action plan, strategy, charter...",
            value:'SD'
        },
        {
            title:'Contratcual documents',
            description:"Contract, protocol of agreement, mandate/terms of reference of the OI, act creating CDLs",
            value:'CD'
        },
        {
            title:"OI mission reports",
            description:"Conjoints, independent, accompanied, verification and others missions",
            value:'OI-R'
        },
        {
            title:"OI technical synthesis",
            description:"Analysis note, information note, synthese note of OI reports",
            value:'OI-TS'
        },
        {
            title:"Periodical report",
            description:"Thematic report, activity and narrative report",
            value:'PR'
        },
        {
            title:"OI Manual / guide",
            description:"OIEs, OIMs...",
            value:'OI-G'
        },
        {
            title:"'CR/PV Lecture commitee/ Ad-hoc commitee'",
            description:"",
            value:'CR-PV'
        },
        {
            title:"Press Articles",
            description:"Workshop, press conference, general information",
            value:'PA'
        },
        {
            title:"Scientific publications on the OI",
            description:"Thematic",
            value:'SP-OI'
        }
    ],
    fr:[
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
]};

const Home = ({navigation}) => {
    const {language} = useContext(LangContext);

    const getDocs = async (category) => {
        console.log('Category: ', category)
        let docsArray = [];
        const documents = await firestore()
        .collection('resources')
        .doc('documents')
        .collection('validated')
        .where('category', '==', category)
        .get();

        documents.forEach(document => {
            docsArray.push({...document.data(), id:document.id});
        });
        return docsArray;
    };
    
    const seeDocs = async(category) => {
        await navigation.setParams({loading:true});
        
        const categoryDocs = await getDocs(category);
        
        const headerTitle = UploadParams[language].category.filter(item => item.value === category)[0].label;
        await navigation.setParams({loading:false});

        navigation.navigate('DocsStack', {
            screen:'Docs',
            params: {documents:categoryDocs, waitingDocs:false, headerTitle}
        });
    };

    return (
        <View style={styles.container}>
            <FlatList
                // ListHeaderComponent={() => 
                //     <View style={styles.headerContainer}>
                //         <Text style={styles.headerTitle}>Les catégories</Text>
                //     </View>
                // }
                // stickyHeaderIndices={[0]}
                data={categories[language]}
                keyExtractor={item => item.title}
                renderItem={({item}) => (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => seeDocs(item.value)}
                        >
                        <View
                            colors={['rgba(57, 205, 83, 0.9)', 'rgba(65, 177, 70, 1)', 'rgba(71, 167, 42, 1)']}
                            style={styles.category}>
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
        borderWidth:4,
        borderColor:'rgb(0, 106, 179)',
        backgroundColor:'#fff',
        borderRadius:10
    },
    headerTitle: {
        textAlign:'center',
        fontSize:24,
        paddingVertical:8,
        color:'rgb(71, 167, 42)'

    },
    category:{
        // minHeight:100,
        flex:1,
        marginVertical:15,
        marginHorizontal:25,
        backgroundColor:'#efefef',
        borderRadius:10,
        borderWidth:4,
        borderColor:'rgb(0, 106, 179)'
    },
    categoryTitle:{
        textAlign:'center',
        paddingHorizontal:10,
        marginVertical:5,
        fontSize:19,
        fontWeight:'500',
        color:'rgb(0, 106, 179)'
    },
    categoryDescription:{
        paddingHorizontal:15,
        fontSize:16,
        marginBottom:15,
        color:'rgb(0, 106, 179)'
    }
})