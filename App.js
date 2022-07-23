import React from 'react';
import HomeTab from './navigation/HomeTab';
import { NavigationContainer } from '@react-navigation/native';

const App = () => {
  return (
    <NavigationContainer>
      <HomeTab/>
    </NavigationContainer>

  )
}

export default App;