import React, {useState, useMemo, useEffect} from 'react';
import {View, Text, StyleSheet, TextInput, ScrollView, LogBox} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import UploadParams from '../assets/UploadParams';


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

    useEffect(() => {
        setOrganisation('');
    }, [country]);
    return (
        <View style={styles.container}>
            <ScrollView
                nestedScrollEnabled
                contentContainerStyle={{paddingHorizontal:10, flex:1}}
            >
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
                
            </ScrollView>
        </View>
    )
}

export default Upload;
const styles = StyleSheet.create({
    container:{
        flex: 1,
        // paddingHorizontal:10
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