import React, {useContext, useEffect, useState} from 'react';
import {Text} from 'react-native';
import auth from '@react-native-firebase/auth';
import { AuthContext } from '../context/AuthContext';
import AuthStack from './AuthStack';
import HomeTab from './HomeTab';


const Routes = () => {
    const {user, setUser} = useContext(AuthContext);
    const [initializing, setInitializing] = useState(true);


    // const onAuthStateChanged = (user) => {
    //     setUser(user);
    //     if (initializing) setInitializing(false);
    // }

    // useEffect(async () =>{
    //     const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    //     return subscriber;
    // }, []);

    const unsubscribe = auth().onAuthStateChanged((user) => {
        console.log('Auth state changed')
        console.log("User: ",user)
        if(initializing) setInitializing(false);
        if (user) {
          setUser(user);
        } else {
          // Signed out
        }
      });
      
      // Unsubscribe from further state changes
      useEffect(() => {
        if(user){
            (async () => {
                unsubscribe();
            })
        }
      }, [user])
    if(initializing) return null; //Return whatever we want when the app is loading
    return (
        <>  
            {user? <HomeTab/>:<AuthStack/>}
        </>
    )
}

export default Routes;