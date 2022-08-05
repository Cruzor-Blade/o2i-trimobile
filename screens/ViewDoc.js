import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform, PermissionsAndroid} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import UploadParams from '../assets/UploadParams';
import RNFetchBlob from 'rn-fetch-blob';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


// const RNFetchBlob = NativeModules.RNFetchBlob;
const ViewDoc = ({route}) => {
    const document = route.params.document;
    const language = 'fr'
    const dropProperties = ['domain', 'OIType', 'reportType', 'period', 'fromValidityPeriod', 'toValidityPeriod'];
    const inputProperties = ['concernedTitles', 'editor', 'journal', 'validityPeriod', 'publicationDate'];
    
    const downloadImage = () => {
        const getExtension = (filename) => {
            return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined ;
        }

        let date = new Date();
        const DocURI = document.docUrl;
        let ext = getExtension(DocURI);
        ext = '.' + ext[0];

        //Get config and fs from RNFetchBlob
        const {config, fs} = RNFetchBlob;
        let DownloadDir = fs.dirs.DownloadDir;
        let filePath = DownloadDir+ '/o2i-tri/O2ITRI_'+ document.title + '_'+
            Math.floor(date.getTime() + date.getSeconds()/2);

        if(document.type) filePath+=document.type;

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

        config(options)
        .fetch('GET', DocURI)
        .then((res) => {
          //Showing alert for successful download
          let status = res.info().status;
          if (status == 200) {
            alert("Document telecharge avec succes")
          } else {
            alert("Echec du telechargement")
            console.log('Response error: ', JSON.stringify(res))
          }
        })
        .catch((error) => {
          console.log('Error while downloading: ', error)
        })
    }

    const checkPermission = async () => {
        if (Platform.OS === 'ios') {
          downloadImage();
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title:"Acces au stockage",
                        message:"Authorisez l'acces au stockage"
                    }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Storage Permission Granted');
                downloadImage();
            } else {
              alert("l'acces au stockage n'a pas ete attribue");
            }
            } catch (error) {
                console.warn(error);
            }
        }
    }
    // console.log('document created at: ', new Date(document.createdAt.toDate()) )
    const createdAt = document.createdAt.toDate();

    const getReadableDate = (date) => {
        const monthsArray = ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        const readableDate = date.getDate() + ' ' + monthsArray[date.getMonth()]+' '+date.getFullYear();
        return readableDate
    };

    const docTypes = {
        'pdf':'PDF',
        'doc':'Word',
        'docx':'Word',
        'ppt':'PowerPoint',
        'pptx':'PowerPoint'
    };

    return (
        <View style={styles.container}>
            <View style={{width:'100%'}}>
                <View style={{flexDirection:'row'}}>
                    <FontAwesome5 color='red' style={{flex:1}} name='file-pdf' size={80} />
                    <View style={{flex:5}} >
                        <Text style={styles.title}>
                            {document.title}{document.title}{document.title}{document.title}{document.title}{document.title}{document.title}
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
                        <Text style={styles.supInfo} >• Document chargé le {getReadableDate(createdAt)}</Text>
                    </View>
                </View>
            <TouchableOpacity onPress={checkPermission}>
                <View style={styles.downloadButton}>
                    <Text style={{color:'rgb(0, 106, 179)', fontSize:18, fontWeight:'600'}}>Télécharger</Text>
                </View>
            </TouchableOpacity>
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