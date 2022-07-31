import React, {useState, useMemo, useEffect} from 'react';
import {View, Text, StyleSheet, TextInput, Platform, ActivityIndicator, TouchableOpacity} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import UploadParams from '../assets/UploadParams';
import { pick, types as DocumentTypes } from 'react-native-document-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import RNFetchBlob from 'rn-fetch-blob';


const Find = ({navigation}) => {
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

            
            const resultDocs = await getCorrespondingDocs();
            let filteredDocs = resultDocs;
            Object.keys(filterObj).forEach(key => filteredDocs= filterObj[key](filteredDocs));
            
            navigation.navigate('DocsStack', {
                screen:'Docs',
                params: {documents:filteredDocs}
            });
        } else {
            setFormError('Choisissez une categorie');
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
                                Rechercher le document
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

export default Find;
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