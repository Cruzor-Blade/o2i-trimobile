import React, {createContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';

export const LangContext = createContext();

const LangContextProvider = ({children}) => {
    const [language, setLanguage] = useState(null);
    
    async function getLanguage() {
        let currentLanguage;
        let languageTag;
        currentLanguage = await AsyncStorage.getItem('currentLanguage');

        if(currentLanguage) {
            languageTag = currentLanguage;
        } else {
            currentLanguage = RNLocalize.findBestAvailableLanguage(['fr', 'en']);
            languageTag = currentLanguage.languageTag;
        }

        setLanguage(currentLanguage? languageTag : 'fr');
        
        if(!currentLanguage) {
            await AsyncStorage.setItem('currentLanguage', languageTag || 'fr');
        }
        console.log('Current language: ', languageTag);
    }

    useEffect(() => {
        getLanguage();
    }, []);
    return (
        <LangContext.Provider
            value={{
                language,
                setLanguage
            }}
        >
            {children}
        </LangContext.Provider>
    )
}

export default LangContextProvider;