import React from 'react';
import {NativeModules,View, Text, TouchableOpacity, StyleSheet, Platform, PermissionsAndroid} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import UploadParams from '../assets/UploadParams';
import RNFetchBlob from 'rn-fetch-blob';

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
    const createdAt = document.createdAt.toDate()             

    return (
        <View style={styles.container}>
            <View>
                <View>
                    <FontAwesome5 name='file-pdf' size={30} />
                    <Text>
                        {document.title}
                    </Text>
                </View>
                <Text>{UploadParams[language].country.filter(country => country.value=== document.country)[0].label}</Text>
                <Text>{UploadParams[language].organisation[document.country].filter(org => org.value === document.organisation)[0].label}</Text>
                <Text>{UploadParams[language].category.filter(item => item.value === document.category)[0].label}</Text>
                {dropProperties.map(prop => {
                    if (document[prop]) {
                        if (prop === 'reportType') {
                        return <Text>• {UploadParams[language].reportType.values[document.category].filter(obj => obj.value === document.reportType)[0].label}</Text>
                        } else if(prop==='period') {
                        return <Text>• {language==='fr'? 'Période: ':'Period: '} {document['period']}</Text>
                        } else if(prop === 'fromValidityPeriod') {
                        return <Text>• {language==='fr'? 'Valide du':'Valid from the'} {document['fromValidityPeriod']} {language==='fr'? 'au':'to the'} {document['toValidityPeriod']}</Text>
                        } else if(prop === 'toValidityPeriod') {
                        return null;
                        } else {
                        return <Text>• {UploadParams[language][prop].values.filter(obj => obj.value === document[prop])[0].label}</Text>
                        }
                    } else {
                        return null;
                    }
                    })}
                    {inputProperties.map(prop => {
                    if (document[prop]) {
                        return <Text>• {document[prop]}</Text>
                    } else {
                        return null;
                    }
                    })}
                    <Text>• Document chargé le {createdAt.getDay() + ' '+ createdAt.getMonth()+ ' ' + createdAt.getFullYear()}</Text>
            </View>
            <TouchableOpacity onPress={checkPermission}>
                <View style={styles.downloadButton}>
                    <Text>Télécharger</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default ViewDoc;

const styles = StyleSheet.create({
    container:{
        marginHorizontal:20,
        marginVertical:30
    },
    downloadButton: {
        backgroundColor:'#0000ff',
        paddingVertical:5,
        marginTop:20
    }
})