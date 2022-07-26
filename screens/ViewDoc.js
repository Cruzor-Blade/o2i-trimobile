import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import UploadParams from '../assets/UploadParams';

const ViewDoc = ({route}) => {
    const document = route.params.document;
    const language = 'fr'
    const dropProperties = ['domain', 'OIType', 'reportType', 'period', 'fromValidityPeriod', 'toValidityPeriod'];
    const inputProperties = ['concernedTitles', 'editor', 'journal', 'validityPeriod', 'publicationDate'];
    
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
                    <Text>• Document chargé le {document.createdAt.getDay()+ ' '+document.createdAt.getMonth()+' '+ document.createdAt.getFullYear()}</Text>
            </View>
            <TouchableOpacity>
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