import React, {useContext, useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform, PermissionsAndroid, ActivityIndicator} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import UploadParams from '../assets/UploadParams';
import RNFetchBlob from 'rn-fetch-blob';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage'; 
import { LangContext } from '../context/LangContext';
import mime from 'mime-types';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const RNFetchBlob = NativeModules.RNFetchBlob;
const ViewDoc = ({route, navigation}) => {
    const document = route.params.document;
    const waitingDoc = route.params?.waitingDoc;

    const {language} = useContext(LangContext);
    const [loading, setLoading] = useState(false);
    const [docSavedData, setDocSavedData] = useState(null);

    const {config, fs, android} = RNFetchBlob;

    const dropProperties = ['domain', 'OIType', 'reportType', 'period', 'fromValidityPeriod', 'toValidityPeriod'];
    const inputProperties = ['concernedTitles', 'editor', 'journal', 'validityPeriod', 'publicationDate'];
    
    const getSavedDocs = async() => {
        let docs = await JSON.parse(await AsyncStorage.getItem('storedDocs'));
        
        if(docs && docs[document.id]){
            if(fs.exists(docs[document.id].path)===true) { //fs.exists() may return an object if the path is not valid. Make sure that it is true
                setDocSavedData(docs[document.id]);
            } else {
                docs[document.id] = undefined;
                AsyncStorage.setItem('storedDocs', JSON.stringify(docs));
            }
        }
    }

    const openImage = () => {
        android.actionViewIntent(docSavedData.path, docSavedData.type);
    }

    const downloadImage = async () => {
        const getExtension = (filename) => {
            return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined ;
        }

        let date = new Date();
        const DocURI = document.docUrl;
        let ext = getExtension(DocURI);
        ext = '.' + ext[0];

        //Get config and fs from RNFetchBlob
        
        let DownloadDir = fs.dirs.DownloadDir;
        let filePath = DownloadDir+ '/o2i-tri/O2ITRI_'+ document.title + '_'+
            Math.floor(date.getTime() + date.getSeconds()/2);

        if(document.type) filePath+='.'+document.type;

        let options = {
          fileCache: true,
          addAndroidDownloads: {
            //related to android only
            useDownloadManager: true,
            notification:true,
            path:filePath
            // description: 'Document'
          }
        }

        await config(options)
        .fetch('GET', DocURI)
        .then(async(res) => {
            let stored = JSON.parse(await AsyncStorage.getItem('storedDocs'));
            if(!stored) {
                stored={};
            }
            console.log('Document id: ', document.id);
            stored[document.id] ={path:res.path(), type:mime.lookup(document.type)}
            AsyncStorage.setItem('storedDocs', JSON.stringify(stored));
            setDocSavedData({path:res.path(), type:mime.lookup(document.type)});
            android.actionViewIntent(res.path(), mime.lookup(document.type));
            
        })
        .catch((error) => {
          console.log('Error while downloading: ', error)
        })
    }

    const checkPermission = async () => {
        setLoading(true);
        if (Platform.OS === 'ios') {
          await downloadImage();
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title:language==='fr'?"Accès au stockage":'Storage access',
                        message:language==='fr'?"Authorisez l'accès au stockage":'Grant access to storage'
                    }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                // console.log('Storage Permission Granted');
                await downloadImage();
            } else {
              alert(language==='fr'?"l'accès au stockage n'a pas été attribué":'Storage permission denied');
            }
            } catch (error) {
                console.warn(error);
            }
        }

        setLoading(false);
    }
    // console.log('document created at: ', new Date(document.createdAt.toDate()) )
    const createdAt = document.createdAt.toDate();

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

    const onValidation= async () => {
        if(!loading) {
            setLoading(true);

            let docWithoutId = document;
            const docId = document.id;
            delete docWithoutId.id;
            
            try {
            await firestore().collection('resources/documents/validated').add(docWithoutId);
            await firestore().doc(`resources/documents/waiting/${docId}`).delete();
            } catch (error) {
                console.log('Error during document validation: ', error);
            };
    
            await navigation.setParams({waitingDoc:false});
            // console.log('Validated successfully');
        
            setLoading(false);
        }
    }

    const onInvalidation = async () => {
        if(!loading) {
            setLoading(true);
            const docId = document.id;
    
            try {
                await firestore().doc(`resources/documents/waiting/${docId}`).delete(),
                await Promise.allSettled([
                    storage().refFromURL(document.docUrl).delete()
                ]);
                navigation.goBack();
            } catch (error) {
                console.log('Error during document deletion ', error);
            }
            setLoading(false);
        }
    };

    const docTypes = {
        'pdf':'PDF',
        'doc':'Word',
        'docx':'Word',
        'ppt':'PowerPoint',
        'pptx':'PowerPoint',
        'xls':'Excel',
        'xlsx':'Excel',
        'txt':'Texte'
    };

    useEffect(() => {
        getSavedDocs();
    }, [])
    return (
        <View style={styles.container}>
            <View style={{width:'100%'}}>
                <View style={{flexDirection:'row'}}>
                    <FontAwesome5 color='red' style={{flex:1}} name='file-pdf' size={80} />
                    <View style={{flex:5}} >
                        <Text style={styles.title}>
                            {document.title}
                        </Text>
                    </View>
                </View>
                <View style={styles.supInfosContainer}>
                    <View style={styles.supLead}>
                        <MaterialCommunityIcons color='rgb(0, 106, 179)' name="map-marker-radius" size={22} style={{marginRight:5}} />
                        <Text style={styles.supInfo} >{UploadParams[language].country.filter(country => country.value=== document.country)[0].label}</Text>
                    </View>
                    <View style={styles.supLead}>
                        <Ionicons color='rgb(0, 106, 179)' name='ios-people' size={22} style={{marginRight:5}} />
                        <Text style={styles.supInfo} >{UploadParams[language].organisation[document.country].filter(org => org.value === document.organisation)[0].label}</Text>
                    </View>
                    <View style={styles.supLead}>
                        <MaterialCommunityIcons color='rgb(0, 106, 179)' name="map-marker-radius" size={22} style={{marginRight:5}} />
                        <Text style={styles.supInfo} >{UploadParams[language].category.filter(item => item.value === document.category)[0].label}</Text>
                    </View>
                    <Text style={styles.supInfo} >• Document {docTypes[document.type]}</Text>
                    {dropProperties.map(prop => {
                        if (document[prop]) {
                            if (prop === 'reportType') {
                            return <Text style={styles.supInfo} >• {UploadParams[language].reportType.values[document.category].filter(obj => obj.value === document.reportType)[0].label}</Text>
                            } else if(prop==='period') {
                            return <Text style={styles.supInfo} >• {language==='fr'? 'Période: ':'Period: '} {document['period']}</Text>
                            } else if(prop === 'fromValidityPeriod') {
                            return <Text style={styles.supInfo} >• {language==='fr'? 'Valide du':'Valid from the'} {document['fromValidityPeriod']} {language==='fr'? 'au':'to the'} {document['toValidityPeriod']}</Text>
                            } else if(prop === 'toValidityPeriod') {
                            return null;
                            } else {
                            return <Text style={styles.supInfo} >• {UploadParams[language][prop].values.filter(obj => obj.value === document[prop])[0].label}</Text>
                            }
                        } else {
                            return null;
                        }
                        })}
                        {inputProperties.map(prop => {
                        if (document[prop]) {
                            return <Text style={styles.supInfo} >• {document[prop]}</Text>
                        } else {
                            return null;
                        }
                    })}
                    <Text style={styles.supInfo} >• {language==='fr'?'Document chargé le ':'Document loaded on the '} {getReadableDate(createdAt)}</Text>
                </View>
            </View>
            {
                waitingDoc?
                <View style={{flexDirection:'row', justifyContent:'space-evenly'}}>
                    <TouchableOpacity onPress={onInvalidation}>
                        <View style={{...styles.downloadButton, marginHorizontal:0, width:110, borderColor:'red'}}>
                            <Text style={{color:'red', fontSize:18, fontWeight:'600'}}>{language==='fr'?'Invalider':'Invalidate'}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onValidation}>
                        <View style={{...styles.downloadButton, marginHorizontal:0, width:110, borderColor:'#1C7D2D'}}>
                            <Text style={{color:'#1C7D2D', fontSize:18, fontWeight:'600'}}>{language==='fr'?'Valider':'Validate'}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                :
                docSavedData?
                    <TouchableOpacity onPress={openImage}>
                        <View style={styles.downloadButton}>
                            <Text style={{color:'rgb(0, 106, 179)', fontSize:18, fontWeight:'600'}}>{language==='fr'?'Ouvrir':'Open'}</Text>
                        </View>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={checkPermission}>
                        <View style={styles.downloadButton}>
                            <Text style={{color:'rgb(0, 106, 179)', fontSize:18, fontWeight:'600'}}>{language==='fr'?'Télécharger':'Download'}</Text>
                        </View>
                    </TouchableOpacity>
            }
            {
                    loading ?
                    <ActivityIndicator size={30} color='rgb(0, 106, 179)'/>
                    :
                    null
            }
        </View>
    );
};

export default ViewDoc;

const styles = StyleSheet.create({
    container:{
        paddingHorizontal:20,
        paddingVertical:30
    },
    title:{
        marginHorizontal:20,
        fontSize:19,
        textAlign:'justify',
        color:'rgb(0, 106, 179)'
    },
    supInfosContainer:{
        marginHorizontal:15,
        marginTop:25
    },
    supInfo:{
        color:'#000',
        fontSize:16,
        marginVertical:1
    },
    supLead:{
        flexDirection:'row',
        alignItems:'center',
    },
    downloadButton: {
        borderColor:'rgb(0, 106, 179)',
        borderWidth:4,
        marginHorizontal:50,
        height:50,
        alignItems:'center',
        justifyContent:'center',
        marginTop:40,
        borderRadius:10,
        backgroundColor:'#fff'
    }
})
