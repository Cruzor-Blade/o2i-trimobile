import React from 'react';
import AuthContextProvider from './context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './navigation/Routes';

const App = () => {
  return (
    <AuthContextProvider>
      <NavigationContainer>
        <Routes/>
      </NavigationContainer>
    </AuthContextProvider>

  )
}

export default App;