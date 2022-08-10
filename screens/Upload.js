import React, {useContext, useState, useMemo, useEffect} from 'react';
import {View, Text, StyleSheet, TextInput, Platform, ActivityIndicator, TouchableOpacity} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import UploadParams from '../assets/UploadParams';
import { pick, types as DocumentTypes } from 'react-native-document-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { AuthContext } from '../context/AuthContext';
import { LangContext } from '../context/LangContext';


const Upload = () => {
    const {user}= useContext(AuthContext);
    const {language} = useContext(LangContext);

    
    const [title, setTitle] = useState('');
    const [concernedTitles, setConcernedtitles] = useState('');
    const [editor, setEditor] = useState('');
    const [journal, setJournal] = useState('');
    const [fromValidityPeriod, setFromValidityPeriod] = useState('');
    const [toValidityPeriod, setToValidityPeriod] = useState('');
    const [publicationDate, setPublicationDate] = useState('');
    
    const [country, setCountry] = useState(null);
    const [countryOpen, setCountryOpen] = useState(false);
    const [countries, setCountries] = useState(UploadParams[language].country);

    const [organisation, setOrganisation] = useState(null);
    const [organisationOpen, setOrganisationOpen] = useState(false);
    const [organisations, setOrganisations] = useState(UploadParams[language].organisation);

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
    const [categories, setCategories] = useState(UploadParams[language].category);

    const [domain, setDomain] = useState(null);
    const [domainOpen, setDomainOpen] = useState(false);
    const [domains, setDomains] = useState(UploadParams[language].domain);

    const [OIType, setOIType] = useState(null);
    const [OITypeOpen, setOITypeOpen] = useState(false);
    const [OITypes, setOITypes] = useState(UploadParams[language].OIType);
    
    const [reportType, setReportType] = useState(null);
    const [reportTypeOpen, setReportTypeOpen] = useState(false);
    const [reportTypes, setReportTypes] = useState(UploadParams[language].reportType);
    
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
    };

    function isSelectAllowed (type) {
        return category && UploadParams['fr'][type].allowed.includes(category);
    };

    function showDatepicker (setState) {
        DateTimePickerAndroid.open({
            value:(new Date()),
            onChange:(event, selectedDate) => setState(`${selectedDate.getDate()}-${selectedDate.getMonth()+1}-${selectedDate.getFullYear()}`),
            mode:'date',
            is24Hour:true
        });
    };

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
        
        
        const pickedDocument = {name: result[0].name, type: result[0].type, uri:`file://${decodeURIComponent(result[0].fileCopyUri)}`};
        setDocument(pickedDocument);
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
            .add({...properties, docUrl:downloadUrl, category, createdAt: new Date(), createdBy:user.uid});
            
            setLoading(false);
            clearForm();
            alert(language==='fr'?"Document chargé avec succès":'Uploaded successfully');
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

            try {
                saveDocument(document, category, docObj);
            } catch (error) {
                setLoading(false);
                console.log('Error while saving the document: ', error)
            }
        } else {
            setFormError(language==='fr'?'Un ou plusieurs champs sont vides':'One or more fields are empty');
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
                    placeholder={language==='fr'?'Titre':'Title'}
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
                    placeholder={language==='fr'?'Pays':'Country'}
                    selectedItemLabelStyle={{color:'rgb(0, 106, 179)'}}
                    labelStyle={{color:'rgb(0, 106, 179)'}}
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
                            selectedItemLabelStyle={{color:'rgb(0, 106, 179)'}}
                            labelStyle={{color:'rgb(0, 106, 179)'}}
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
                    placeholder={language==='fr'?'Période':'Period'}
                    zIndex={8000}
                    zIndexInverse={3000}
                    selectedItemLabelStyle={{color:'rgb(0, 106, 179)'}}
                    labelStyle={{color:'rgb(0, 106, 179)'}}
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
                    placeholder={language==='fr'?'Categorie':'Category'}
                    zIndex={7000}
                    zIndexInverse={4000}
                    selectedItemLabelStyle={{color:'rgb(0, 106, 179)'}}
                    labelStyle={{color:'rgb(0, 106, 179)'}}
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
                    style={isSelectAllowed('domain') ?{...styles.dropDownInput}:{display:'none'}}
                    placeholder={language==='fr'?'Domain':'Domaine'}
                    zIndex={6000}
                    zIndexInverse={5000}
                    selectedItemLabelStyle={{color:'rgb(0, 106, 179)'}}
                    labelStyle={{color:'rgb(0, 106, 179)'}}
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
                    style={isSelectAllowed('OIType') ?{...styles.dropDownInput}:{display:'none'}}
                    placeholder={language==='fr'?"Type d'OI":'OI Type'}
                    zIndex={5000}
                    zIndexInverse={6000}
                    selectedItemLabelStyle={{color:'rgb(0, 106, 179)'}}
                    labelStyle={{color:'rgb(0, 106, 179)'}}
                />
                <DropDownPicker
                    autoScroll
                    onPress={closePickers}
                    flatListProps={{nestedScrollEnabled:true}}
                    items={reportTypes.values[category]||[]}
                    open={reportTypeOpen}
                    value={reportType}
                    setItems={setReportTypes}
                    setOpen={setReportTypeOpen}
                    setValue={setReportType}
                    style={isSelectAllowed('reportType') ?{...styles.dropDownInput}:{display:'none'}}
                    placeholder={language==='fr'?'Type de rapport':'Report Type'}
                    zIndex={4000}
                    zIndexInverse={7000}
                    selectedItemLabelStyle={{color:'rgb(0, 106, 179)'}}
                    labelStyle={{color:'rgb(0, 106, 179)'}}
                />
                <TextInput
                    onFocus={closePickers}
                    value={concernedTitles}
                    style={isInputAllowed('concernedTitles') ?{...styles.textInput}:{display:'none'}}
                    placeholder={language==='fr'?'Titres concernés':'Concerned Titles'}
                    placeholderTextColor={'rgba(0,0,0,0.5)'}
                    onChangeText={(text) => setConcernedtitles(text)}
                />
                <TextInput
                    onFocus={closePickers}
                    value={editor}
                    style={isInputAllowed('editor') ?{...styles.textInput}:{display:'none'}}
                    placeholder={language==='fr'?'Éditeur du document':'Document editor'}
                    placeholderTextColor={'rgba(0,0,0,0.5)'}
                    onChangeText={(text) => setEditor(text)}
                />
                <TextInput
                    onFocus={closePickers}
                    value={journal}
                    style={isInputAllowed('journal') ?{...styles.textInput}:{display:'none'}}
                    placeholder='Journal'
                    placeholderTextColor={'rgba(0,0,0,0.5)'}
                    onChangeText={(text) => setJournal(text)}
                />
                <TouchableOpacity
                    onPress={() => {
                        closePickers();
                        showDatepicker(setFromValidityPeriod);
                    }}
                    >
                    <View
                        style={isInputAllowed('validityPeriod') ?{...styles.textInput}:{display:'none'}}
                    >
                        <Text style={{color:fromValidityPeriod?'rgb(0, 106, 179)':'rgba(0,0,0,0.5)'}}>
                            {
                            fromValidityPeriod? fromValidityPeriod.toLocaleString()
                                :
                                language==='fr'?'Valide du':'Valid from'
                            }
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        closePickers();
                        showDatepicker(setToValidityPeriod);
                    }}
                    >
                    <View
                        style={isInputAllowed('validityPeriod') ?{...styles.textInput}:{display:'none'}}
                    >
                        <Text style={{color:toValidityPeriod?'rgb(0, 106, 179)':'rgba(0,0,0,0.5)'}}>{
                            toValidityPeriod? toValidityPeriod.toLocaleString()
                            :
                            language==='fr'?"Valide jusqu'au":'Valid until'}
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        closePickers();
                        showDatepicker(setPublicationDate);
                    }}
                    >
                    <View
                    style={isInputAllowed('publicationDate')?{...styles.textInput} : {display:'none'}}
                        
                    >
                        <Text style={{color:publicationDate?'rgb(0, 106, 179)':'rgba(0,0,0,0.5)'}}>{
                            publicationDate? publicationDate.toLocaleString()
                            :
                            language==='fr'?'Date de publication':'Publication date'}
                        </Text>
                    </View>
                </TouchableOpacity>
                <View>
                    {document? 
                    <Text style={{marginHorizontal:20, bottom:-8, color:'#000'}}>
                        {document.name}
                    </Text>
                        :
                    null
                    }
                    <TouchableOpacity style={{backgroundColor:'rgb(0, 106, 179)', ...styles.button, marginTop:20}} onPress={pickDocument}>
                        <Text style={{color:'#fff'}}>
                            {language==='fr'?'Choisir un document':'Pick a document'}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View>
                    {formError? 
                    <Text style={{marginHorizontal:20, color:'red'}}>
                        {formError}
                    </Text>
                        :
                    null
                    }
                    <TouchableOpacity style={{backgroundColor:'rgb(71, 167, 42)', ...styles.button}} onPress={onFormSubmit}>
                        <Text style={{color:'#fff'}}>
                            {language==='fr'? 'Charger le document':'Upload'}
                        </Text>
                    </TouchableOpacity>
                </View>
                {
                    loading ?
                    <ActivityIndicator size={30} color='rgb(0, 106, 179)'/>
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
        paddingTop:20,
        paddingHorizontal:'2.5%'
    },
    textInput:{
        color:'#000000',
        height:50,
        borderRadius:8,
        borderWidth:1,
        borderColor:'#878589',
        marginVertical:5,
        paddingHorizontal:10,
        justifyContent:'center',
        backgroundColor:'#fff',
        width:'100%',
        alignSelf:'center'
    },
    dropDownInput:{
        marginVertical:2,
        // width:'95%',
        borderWidth:1,
        borderColor:'#878589',
        alignSelf:'center'
    },
    button: {
        height:45,
        width:'100%',
        marginVertical:10,
        paddingHorizontal:30,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10,
        alignSelf:'center',
    }
})