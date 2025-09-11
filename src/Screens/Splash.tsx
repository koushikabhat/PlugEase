import React, { useEffect } from "react";
import { SafeAreaView, Text, View } from "react-native";

function Splash({navigation}) {
    useEffect(() => {
     setTimeout(() => {
        navigation.replace("OnBoard");
     }, 3000);
    }, [])
    
  return (
    <SafeAreaView>
      <View>
        <Text>This is a splash screen</Text>
      </View>
    </SafeAreaView>
  );
}

export default Splash;
