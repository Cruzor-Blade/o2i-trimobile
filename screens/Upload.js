import React, {useState, useMemo} from 'react';
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
                <DropDownPicker
                    onPress={closePickers}
                    flatListProps={{nestedScrollEnabled:true}}
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
                    onPress={closePickers}
                    flatListProps={{nestedScrollEnabled:true}}
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
                    onPress={closePickers}
                    flatListProps={{nestedScrollEnabled:true}}
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
                    onPress={closePickers}
                    flatListProps={{nestedScrollEnabled:true}}
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