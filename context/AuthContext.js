import React, {createContext, useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';

export const AuthContext = createContext();

const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    const addUserInfo = async () => {
        const userAdminDoc = await firestore()
            .collection('admins')
            .doc(user.uid)
            .get();

        setIsAdmin(userAdminDoc.exists);    
    }


    useEffect(() => {
        if(user) {
            addUserInfo()
        }
    }, [user]);
    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                isAdmin,
                setIsAdmin
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider;