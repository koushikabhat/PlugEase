import { useEffect } from "react";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = React.useState(true);
    const  [isLoggedIn, setIsLoggedIn] = React.useState(false); 
    const [hasOnboarded, setHasOnboarded] = React.useState(false);


    useEffect(() => {
      const LoadData = async()=>{
        try{
            const isLoggedIn = await AsyncStorage.getItem('userToken');
            const hasOnboarded = await AsyncStorage.getItem('hasOnboarded');
            setIsLoggedIn(!!isLoggedIn);
            setHasOnboarded(!!hasOnboarded);
        }
        catch(e)
        {
            console.log("Error at context",e);
        }finally{
            setIsLoading(false);
        }
      };

      LoadData();
    }, [])
    

    const LogOut = async()=>{
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('hasOnboarded');
        setIsLoggedIn(false);
        setHasOnboarded(false);
    }

    const completeOnboarding = async()=>{ 
        await AsyncStorage.setItem('hasOnboarded','true');
        setHasOnboarded(true);  
     } 
    return(
        <AuthContext.Provider value={{
            isLoading,
            setIsLoading,
            isLoggedIn,
            setIsLoggedIn,
            hasOnboarded,
            setHasOnboarded,
            LogOut,
            completeOnboarding
        }}>
            {children}
        </AuthContext.Provider>
    );
}
