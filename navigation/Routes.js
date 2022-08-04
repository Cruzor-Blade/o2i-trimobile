import React, {useContext, useEffect, useState} from 'react';
import {Text} from 'react-native';
import auth from '@react-native-firebase/auth';
import { AuthContext } from '../context/AuthContext';
import AuthStack from './AuthStack';
import HomeTab from './HomeTab';
import firestore from '@react-native-firebase/firestore';

const Routes = () => {
    const {user, setUser} = useContext(AuthContext);
    const [initializing, setInitializing] = useState(true);
      
    const unsubscribe = auth().onAuthStateChanged((user) => {
        if(initializing) setInitializing(false);
        if (user) {
          setUser(user);
        } else {
          // Signed out
        }
      });
      

      useEffect(() => {
          if(user){
            unsubscribe();
        }
      }, [user]);
    if(initializing) return null; //Return whatever we want when the app is loading
    return (
        <>  
            {user? <HomeTab/>:<AuthStack/>}
        </>
    )
}

export default Routes;