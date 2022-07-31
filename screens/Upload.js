import React, {useState, useMemo, useEffect} from 'react';
import {View, Text, StyleSheet, TextInput, Platform, ActivityIndicator, TouchableOpacity} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import UploadParams from '../assets/UploadParams';
import { pick, types as DocumentTypes } from 'react-native-document-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import RNFetchBlob from 'rn-fetch-blob';


const Upload = () => {
    const [title, setTitle] = useState('');
    const [concernedTitles, setConcernedtitles] = useState('');
    const [editor, setEditor] = useState('');
    const [journal, setJournal] = useState('');
    const [fromValidityPeriod, setFromValidityPeriod] = useState('');
    const [toValidityPeriod, setToValidityPeriod] = useState('');
    const [publicationDate, setPublicationDate] = useState('');
    
    const [country, setCountry] = useState(null);
    const [countryOpen, setCountryOpen] = useState(false);
    const [countries, setCountries] = useState(UploadParams.fr.country);

    const [organisation, setOrganisation] = useState(null);
    const [organisationOpen, setOrganisationOpen] = useState(false);
    const [organisations, setOrganisations] = useState(UploadParams.fr.organisation);

    let periodOptions = [
        ];
    for (let i =2010; i< 2035; i++){
        periodOptions.push({label: i.toString(), value:i})
    };
    const [period, setPeriod] = useState(null);
    const [periodOpen, setPeriodOpen] = useState(false);
    const [periods, setPeriods] = useState(periodOptions);

    const [category, setCategory] = useState(null);
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [categories, setCategories] = useState(UploadParams.fr.category);

    const [domain, setDomain] = useState(null);
    const [domainOpen, setDomainOpen] = useState(false);
    const [domains, setDomains] = useState(UploadParams.fr.domain);

    const [OIType, setOIType] = useState(null);
    const [OITypeOpen, setOITypeOpen] = useState(false);
    const [OITypes, setOITypes] = useState(UploadParams.fr.OIType);
    
    const [reportType, setReportType] = useState(null);
    const [reportTypeOpen, setReportTypeOpen] = useState(false);
    const [reportTypes, setReportTypes] = useState(UploadParams.fr.reportType);
    
    const [document, setDocument] = useState(null);
    

    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState(null);
    
    
    //Use memo recomputes the value (that may require a lot of computations) only when one
    //or more of the dependencies changes. Thus, rerenders doesn't necessarily triggers
    //recomputations.
    const pickerArray = useMemo(() => [
        [countryOpen, setCountryOpen],
        [organisationOpen, setOrganisationOpen],
        [periodOpen, setPeriodOpen],
        [categoryOpen, setCategoryOpen],
        [domainOpen, setDomainOpen],
        [OITypeOpen, setOITypeOpen],
        [reportTypeOpen, setReportTypeOpen],
    ], [countryOpen, organisationOpen, periodOpen, categoryOpen, domainOpen, OITypeOpen, reportTypeOpen]);


    const closePickers = () => {
        pickerArray.forEach(stateArray => {
            if(stateArray[0] ===true) {
                stateArray[1](false);
            }
        });
    };

    // console.log('Category value: ', category);
    function isInputAllowed (type) {
        return category && UploadParams['fr'].placeholders[type].allowed.includes(category);
    }

    function isSelectAllowed (type) {
        return category && UploadParams['fr'][type].allowed.includes(category);
    }

    async function pickDocument () {
        const result = await pick({
            allowMultiSelection:false,
            type:[
                DocumentTypes.pdf,
                DocumentTypes.doc,
                DocumentTypes.docx,
                DocumentTypes.ppt,
                DocumentTypes.pptx
            ],
            copyTo:'cachesDirectory'
        });
        
        const pathForFirebase = async (uri) => {
            if (Platform.OS ==='ios') {
                return uri;
            } else {
                const stat = await RNFetchBlob.fs.stat(uri);
                return stat.path;
            }
        }
        const pickedDocument = {name: result[0].name, type: result[0].type, uri:`file://${decodeURIComponent(result[0].fileCopyUri)}`};
        setDocument(pickedDocument);
        console.log('Picked doc: ', pickedDocument);
    };


    const onFormSubmit = () => {
        if(formError) setFormError(null);
        const saveDocument = async(document, category, properties) => {
            const currentDate = new Date();
            const fileName = properties.title.split('.').join('_') + currentDate.toISOString() + '.' + document.type;
            const storageRef = storage().ref(`documents/${fileName}`);
            setLoading(true);
            await storageRef.putFile(document.uri);
            const downloadUrl = await storageRef.getDownloadURL();

            firestore()
            .collection('resources/documents/waiting')
            .add({...properties, docUrl:downloadUrl, category, createdAt: new Date()});
            
            setLoading(false);
            clearForm();
            alert("Document charge avec succes");
        }

        const condition = 
            title
            &&country 
            &&organisation
            && period
            && category
            && (!isSelectAllowed('domain') || domain)
            && (!isSelectAllowed('OIType') || OIType)
            && (!isSelectAllowed('reportType') || reportType)
            && (!isInputAllowed('concernedTitles') || concernedTitles)
            && (!isInputAllowed('editor') || editor)
            && (!isInputAllowed('journal') || journal)
            && (!isInputAllowed('validityPeriod') || (fromValidityPeriod && toValidityPeriod))
            && (!isInputAllowed('publicationDate') || publicationDate)
            && document?true:false;

        console.log('condition satisfied: ', condition);
        if (condition) {
            let docObj = {};
            docObj.title = title;
            docObj.country = country;
            docObj.organisation = organisation;
            docObj.period = period;
            docObj.type = document.name.split('.')[document.name.split('.').length-1];
            if (isSelectAllowed('domain')) docObj.domain = domain;
            if (isSelectAllowed('OIType')) docObj.OIType = OIType;
            if (isSelectAllowed('reportType')) docObj.reportType = reportType;
            if (isInputAllowed('concernedTitles')) docObj.concernedTitles = concernedTitles;
            if (isInputAllowed('editor')) docObj.editor = editor;
            if (isInputAllowed('journal')) docObj.journal = journal;
            if (isInputAllowed('validityPeriod')) docObj.fromValidityPeriod = fromValidityPeriod;
            if (isInputAllowed('validityPeriod')) docObj.toValidityPeriod = toValidityPeriod;
            if (isInputAllowed('publicationDate')) docObj.publicationDate = publicationDate;

            console.log('Category: ', category);
            console.log('Document properties: ', docObj);
            try {
                saveDocument(document, category, docObj);
            } catch (error) {
                setLoading(false);
                console.log('Error while saving the document: ', error)
            }
        } else {
            setFormError('One or more fields are empty, please check again');
        }

        const clearForm = () => {
            setTitle(null);
            setCountry(null);
            setOrganisation(null);
            setPeriod(null);
            setCategory(null);
            setDomain(null);
            setOIType(null);
            setReportType(null);
            setConcernedtitles(null);
            setEditor(null);
            setJournal(null);
            setFromValidityPeriod(null);
            setToValidityPeriod(null);
            setPublicationDate(null);
            setDocument(null);
        }
    }


    useEffect(() => {
        setOrganisation('');
    }, [country]);
    return (
        <View style={styles.container}>
                <TextInput
                    onFocus={closePickers}
                    value={title}
                    style={styles.textInput}
                    placeholder='Title'
                    placeholderTextColor={'rgba(0,0,0,0.5)'}
                    onChangeText={(text) => setTitle(text)}
                />
                <DropDownPicker
                    autoScroll
                    onPress={closePickers}
                    flatListProps={{nestedScrollEnabled:true}}
                    listMode='FLATLIST' //Flatlist is the default mode
                    items={countries}
                    open={countryOpen}
                    value={country}
                    setItems={setCountries}
                    setOpen={setCountryOpen}
                    setValue={setCountry}
                    style={{...styles.dropDownInput}}
                    zIndex={10000}
                    zIndexInverse={1000}
                    placeholder='country'
                />
                {
                    country ? (

                        <DropDownPicker
                            autoScroll
                            onPress={closePickers}
                            flatListProps={{nestedScrollEnabled:true}}
                            items={organisations[country]}
                            open={organisationOpen}
                            value={organisation}
                            setItems={setOrganisations}
                            setOpen={setOrganisationOpen}
                            setValue={setOrganisation}
                            style={styles.dropDownInput}
                            placeholder='Organisation'
                            zIndex={9000}
                            zIndexInverse={2000}
                        />
                    )
                    :
                    null
                }
                <DropDownPicker
                    autoScroll
                    onPress={closePickers}
                    flatListProps={{nestedScrollEnabled:true}}
                    items={periods}
                    open={periodOpen}
                    value={period}
                    setItems={setPeriods}
                    setOpen={setPeriodOpen}
                    setValue={setPeriod}
                    style={[styles.dropDownInput]}
                    placeholder='Period'
                    zIndex={8000}
                    zIndexInverse={3000}
                />
                
                <DropDownPicker
                    autoScroll
                    onPress={closePickers}
                    flatListProps={{nestedScrollEnabled:true}}
                    items={categories}
                    open={categoryOpen}
                    value={category}
                    setItems={setCategories}
                    setOpen={setCategoryOpen}
                    setValue={setCategory}
                    style={styles.dropDownInput}
                    placeholder='Category'
                    zIndex={7000}
                    zIndexInverse={4000}
                />
                <DropDownPicker
                    autoScroll
                    onPress={closePickers}
                    flatListProps={{nestedScrollEnabled:true}}
                    items={domains.values}
                    open={domainOpen}
                    value={domain}
                    setItems={setDomains}
                    setOpen={setDomainOpen}
                    setValue={setDomain}
                    style={{...styles.dropDownInput, display:!isSelectAllowed('domain') ? 'none':undefined}}
                    placeholder='Domain'
                    zIndex={6000}
                    zIndexInverse={5000}
                />
                <DropDownPicker
                    autoScroll
                    onPress={closePickers}
                    flatListProps={{nestedScrollEnabled:true}}
                    items={OITypes.values}
                    open={OITypeOpen}
                    value={OIType}
                    setItems={setOITypes}
                    setOpen={setOITypeOpen}
                    setValue={setOIType}
                    style={{...styles.dropDownInput, display:!isSelectAllowed('OIType') ? 'none':undefined}}
                    placeholder='OI Type'
                    zIndex={5000}
                    zIndexInverse={6000}
                />
                <DropDownPicker
                    autoScroll
                    onPress={closePickers}
                    flatListProps={{nestedScrollEnabled:true}}
                    items={reportTypes.values.SD}
                    open={reportTypeOpen}
                    value={reportType}
                    setItems={setReportTypes}
                    setOpen={setReportTypeOpen}
                    setValue={setReportType}
                    style={{...styles.dropDownInput, display:!isSelectAllowed('reportType') ? 'none':undefined}}
                    placeholder='Report Type'
                    zIndex={4000}
                    zIndexInverse={7000}
                />
                <TextInput
                    onFocus={closePickers}
                    value={concernedTitles}
                    style={{...styles.textInput, display:!isInputAllowed('concernedTitles') ? 'none':undefined}}
                    placeholder='Concerned Titles'
                    placeholderTextColor={'rgba(0,0,0,0.5)'}
                    onChangeText={(text) => setConcernedtitles(text)}
                />
                <TextInput
                    onFocus={closePickers}
                    value={editor}
                    style={{...styles.textInput, display:!isInputAllowed('editor') ? 'none':undefined}}
                    placeholder='Document editor'
                    placeholderTextColor={'rgba(0,0,0,0.5)'}
                    onChangeText={(text) => setEditor(text)}
                />
                <TextInput
                    onFocus={closePickers}
                    value={journal}
                    style={{...styles.textInput, display:!isInputAllowed('journal') ? 'none':undefined}}
                    placeholder='Journal'
                    placeholderTextColor={'rgba(0,0,0,0.5)'}
                    onChangeText={(text) => setJournal(text)}
                />
                <TextInput
                    onFocus={closePickers}
                    value={fromValidityPeriod}
                    style={{...styles.textInput, display:!isInputAllowed('validityPeriod') ? 'none':undefined}}
                    //Date input
                    placeholder='Valid from'
                    placeholderTextColor={'rgba(0,0,0,0.5)'}
                    onChangeText={(text) => setFromValidityPeriod(text)}
                />
                <TextInput
                    onFocus={closePickers}
                    value={toValidityPeriod}
                    style={{...styles.textInput, display:!isInputAllowed('validityPeriod') ? 'none':undefined}}
                    //Date input
                    placeholder='Valid until'
                    placeholderTextColor={'rgba(0,0,0,0.5)'}
                    onChangeText={(text) => setToValidityPeriod(text)}
                />
                <TextInput
                    onFocus={closePickers}
                    value={publicationDate}
                    style={{...styles.textInput, display:!isInputAllowed('publicationDate') ? 'none':undefined}}
                    //Date input
                    placeholder='Publication date'
                    placeholderTextColor={'rgba(0,0,0,0.5)'}
                    onChangeText={(text) => setPublicationDate(text)}
                />
                <View>
                    {document? 
                    <Text>
                        {document.name}
                    </Text>
                        :
                    null
                    }
                    <TouchableOpacity onPress={pickDocument}>
                        <View style={{backgroundColor:'blue', width:'95%', paddingVertical:15}}>
                            <Text>
                                Choisir un document
                            </Text>
                        </View>          
                    </TouchableOpacity>
                </View>
                <View>
                    {formError? 
                    <Text>
                        {formError}
                    </Text>
                        :
                    null
                    }
                    <TouchableOpacity onPress={onFormSubmit}>
                        <View style={{backgroundColor:'blue', width:'95%', paddingVertical:15}}>
                            <Text>
                                Charger le document
                            </Text>
                        </View>          
                    </TouchableOpacity>
                </View>
                {
                    loading ?
                    <ActivityIndicator size={30} color='#00ff00'/>
                    :
                    null
                }
        </View>
    )
}

export default Upload;
const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingHorizontal:10
    },
    textInput:{
        color:'#000000',
        height:50,
        borderRadius:8,
        borderWidth:1,
        marginVertical:3,
        paddingHorizontal:10,
        backgroundColor:'#fff'
    },
    dropDownInput:{
        marginVertical:2,
    }
})