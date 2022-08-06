import React, {useEffect} from 'react';
import AuthContextProvider from './context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './navigation/Routes';
import RNBootSplash from "react-native-bootsplash";

const App = () => {
  useEffect(() => {
    RNBootSplash.hide({fade:true})
  }, []);
  return (
    <AuthContextProvider>
      <NavigationContainer>
        <Routes/>
      </NavigationContainer>
    </AuthContextProvider>

  )
}

export default App;