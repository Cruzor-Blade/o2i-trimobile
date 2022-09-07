import React, {useEffect} from 'react';
import LangContextProvider from './context/LangContext';
import AuthContextProvider from './context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './navigation/Routes';
import RNBootSplash from "react-native-bootsplash";

const App = () => {
  useEffect(() => {
    RNBootSplash.hide({fade:true})
  }, []);
  return (
    <LangContextProvider>
      <AuthContextProvider>
        <NavigationContainer>
          <Routes/>
        </NavigationContainer>
      </AuthContextProvider>
    </LangContextProvider>

  )
}

export default App;