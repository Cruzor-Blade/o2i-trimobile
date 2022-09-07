import React, {useContext, useState, useMemo, useEffect} from 'react';
import {View, Text, StyleSheet, TextInput, Platform, ActivityIndicator, TouchableOpacity} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import UploadParams from '../assets/UploadParams';
import firestore from '@react-native-firebase/firestore';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { LangContext } from '../context/LangContext';

const Find = ({navigation}) => {
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

    let periodOptions = [];
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


    const onFormSubmit = async () => {
        const condition = category ? true : false;       
        setFormError(null);

        const getCorrespondingDocs = async () => {
            let validatedDocsArr = [];
            const dbDocs = await firestore()
            .collection('resources/documents/validated')
            .orderBy('createdAt')
            .where('category', '==', category )
            .get();
            
            dbDocs.forEach(doc => {
                validatedDocsArr.push({...doc.data(), id: doc.id})
            });

            // console.log('Category docs: ', validatedDocsArr);
            return validatedDocsArr;
        };


        if (condition) {
            let filterObj = {};
            if (title) filterObj.title = (docs) => docs.filter(doc => doc.title.toLowerCase().includes(title.toLowerCase()));
            if (country) filterObj.country = (docs) => docs.filter(doc => doc.country.includes(country));
            if (organisation) filterObj.organisation = (docs) => docs.filter(doc => doc.organisation.includes(organisation));
            if (period) filterObj.period = (docs) => docs.filter(doc => doc.period.includes(period));
            if (isSelectAllowed('domain') && domain) filterObj.domain = (docs) => docs.filter(doc => doc.domain.includes(domain));
            if (isSelectAllowed('OIType') && OIType) filterObj.OIType = (docs) => docs.filter(doc => doc.OIType.includes(OIType));
            if (isSelectAllowed('reportType') && reportType) filterObj.reportType = (docs) => docs.filter(doc => doc.reportType.includes(reportType));
            if (isInputAllowed('concernedTitles') && concernedTitles) filterObj.concernedTitles = (docs) => docs.filter(doc => doc.concernedTitles.toLowerCase().includes(concernedTitles.toLowerCase()));
            if (isInputAllowed('editor') && docEditor) filterObj.editor = (docs) => docs.filter(doc => doc.editor.toLowerCase().includes(editor.toLowerCase()));
            if (isInputAllowed('journal')&& journal) filterObj.journal = (docs) => docs.filter(doc => doc.journal.toLowerCase().includes(journal.toLowerCase()));
            if (isInputAllowed('validityPeriod') && fromValidityPeriod) filterObj.fromValidityPeriod = (docs) => docs.filter(doc => doc.fromValidityPeriod >= fromValidityPeriod);
            if (isInputAllowed('validityPeriod') && toValidityPeriod) filterObj.toValidityPeriod = (docs) => docs.filter(doc => doc.toValidityPeriod <= toValidityPeriod);
            if (isInputAllowed('publicationDate') && publicationDate) filterObj.publicationDate = (docs) => docs.filter(doc => doc.publicationDate == publicationDate);

            
            setLoading(true);

            const resultDocs = await getCorrespondingDocs();
            let filteredDocs = resultDocs;
            Object.keys(filterObj).forEach(key => filteredDocs= filterObj[key](filteredDocs));
            
            setLoading(false);
            navigation.navigate('DocsStack', {
                screen:'Docs',
                params: {documents:filteredDocs, headerTitle:language==='fr'?'Résultats de la Recherche':'Search Results'}
            });
        } else {
            setFormError(language==='fr'?'Choisissez une categorie':'Choose a category');
        }
    };


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
                    placeholder={language==='fr'?'Catégorie':'Category'}
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
                    placeholder={language==='fr'?'Domaine':'Domain'}
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
                    placeholder={language==='fr'?'Type de rapport':'Report type'}
                    zIndex={4000}
                    zIndexInverse={7000}
                    selectedItemLabelStyle={{color:'rgb(0, 106, 179)'}}
                    labelStyle={{color:'rgb(0, 106, 179)'}}
                />
                <TextInput
                    onFocus={closePickers}
                    value={concernedTitles}
                    style={isInputAllowed('concernedTitles') ?{...styles.textInput}:{display:'none'}}
                    placeholder={language==='fr'?'Titre concernés':'Concerned Titles'}
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
                    {formError? 
                    <Text style={{marginHorizontal:20, color:'red'}}>
                        {formError}
                    </Text>
                        :
                    null
                    }
                    <TouchableOpacity style={styles.button} onPress={onFormSubmit}>
                        <Text style={{color:'#fff'}}>
                            {language==='fr'?'Rechercher le document':'Search the document'}
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

export default Find;
const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingTop:20,
        paddingHorizontal:'2.5%'
    },
    textInput:{
        color:'rgb(0, 106, 179)',
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
        width:'95%',
        marginVertical:10,
        paddingHorizontal:30,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10,
        alignSelf:'center',
        backgroundColor:'rgb(0, 106, 179)'
    }
})