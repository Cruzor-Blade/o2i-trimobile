import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TextInput, ScrollView, LogBox} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import UploadParams from '../assets/UploadParams';
import Picker from '../components/Picker';


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
        // {label:2010, value:2010},
        // {label:2011, value:2011},
        // {label:2012, value:2012},
        // {label:2013, value:2013},
        // {label:2014, value:2014},
        // {label:2015, value:2015},
        // {label:2016, value:2016},
        // {label:2017, value:2017},
        // {label:2018, value:2018},
        // {label:2019, value:2019},
        // {label:2020, value:2020},
        // {label:2021, value:2021},
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
    
    useEffect(() => {
        // console.log("Periods: ", periods)
        // LogBox.ignoreLogs(['VirtualizedLists should never be nested inside plain ScrollViews'])
    }, []);

    let pickerItems = [
        {label: 'Spain', value: 'spain'},
        {label: 'Madrid', value: 'madrid'},
        {label: 'Barcelona', value: 'barcelona'},
    
        {label: 'Italy', value: 'italy'},
        {label: 'Rome', value: 'rome'},
    
        {label: 'Finland', value: 'finland'}
      ];
      const initialValue = ['italy', 'spain', 'barcelona', 'finland'];

    return (
        <View style={styles.container}>
            <ScrollView
                nestedScrollEnabled
            >
                <TextInput
                    value={title}
                    style={styles.textInput}
                    placeholder='Title'
                    onChangeText={(text) => setTitle(text)}
                />
                <DropDownPicker
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
                <DropDownPicker
                    items={organisations.CMR}
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
                <DropDownPicker
                    // listMode="SCROLLVIEW"
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
                    items={domains.values}
                    open={domainOpen}
                    value={domain}
                    setItems={setDomains}
                    setOpen={setDomainOpen}
                    setValue={setDomain}
                    style={styles.dropDownInput}
                    placeholder='Domain'
                    zIndex={6000}
                    zIndexInverse={5000}
                />
                <DropDownPicker
                    items={OITypes.values}
                    open={OITypeOpen}
                    value={OIType}
                    setItems={setOITypes}
                    setOpen={setOITypeOpen}
                    setValue={setOIType}
                    style={styles.dropDownInput}
                    placeholder='OI Type'
                    zIndex={5000}
                    zIndexInverse={6000}
                />
                <DropDownPicker
                    items={reportTypes.values.SD}
                    open={reportTypeOpen}
                    value={reportType}
                    setItems={setReportTypes}
                    setOpen={setReportTypeOpen}
                    setValue={setReportType}
                    style={styles.dropDownInput}
                    placeholder='Report Type'
                    zIndex={4000}
                    zIndexInverse={7000}
                />
                <TextInput
                    value={concernedTitles}
                    style={styles.textInput}
                    placeholder='Concerned Titles'
                    onChangeText={(text) => setConcernedtitles(text)}
                />
                <TextInput
                    value={editor}
                    style={styles.textInput}
                    placeholder='Document editor'
                    onChangeText={(text) => setEditor(text)}
                />
                <TextInput
                    value={journal}
                    style={styles.textInput}
                    placeholder='Journal'
                    onChangeText={(text) => setJournal(text)}
                />
                <TextInput
                    value={fromValidityPeriod}
                    style={styles.textInput}
                    //Date input
                    placeholder='Valid from'
                    onChangeText={(text) => setFromValidityPeriod(text)}
                />
                <TextInput
                    value={toValidityPeriod}
                    style={styles.textInput}
                    //Date input
                    placeholder='Valid until'
                    onChangeText={(text) => setToValidityPeriod(text)}
                />
                <TextInput
                    value={publicationDate}
                    style={styles.textInput}
                    //Date input
                    placeholder='Publication date'
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
    },
    textInput:{
        flex:1
    }
})