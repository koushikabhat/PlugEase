import React from "react";

//app intro slider i need a swipeable 
import AppIntroSlider from "react-native-app-intro-slider";

import {SafeAreaView, Text, View, TouchableOpacity, Image, StyleSheet} from "react-native"

function OnBoard({navigation}){

    const slides = [
        {
            key: "one",
            title: "first",
            text: "This is the first intro screen",
            image: require("../Assets/Onboard1.png")
            
        },
        {
            key:"two",
            title:"second",
            text:"Select Stations", 
            image: require("../Assets/Onboard2.png")
        },
        {
            key:"three",
            title:"third",
            text:"Get Charged", 
            image: require("../Assets/Onboard3.png"),
            isLast : true
        }
       
    ]

    const renderItem = ({item})=>{
        if(item.isLast)
        {
            return(
                <SafeAreaView style={styles.container}>
                <Image source={item.image} style={styles.image} resizeMode="contain"/>
                <View>
                    <Text>{item.title}</Text>
                    <Text>{item.text}</Text>
                    <TouchableOpacity onPress={() => navigation.replace("Login")}>
                        <Text>Get Started</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
            )  
        }
        else{
            return (
                <SafeAreaView style={styles.container}>
                    <Image source={item.image} style={styles.image} resizeMode="contain"/>
                    <View>
                        <Text>{item.title}</Text>
                        <Text>{item.text}</Text>
                    </View>
                </SafeAreaView>
            )
            
        } 
    }

    const onDone = ()=>{
        navigation.replace("Login");
    }

    return(
        <AppIntroSlider renderItem={renderItem} data={slides} onDone={onDone}  showDoneButton={false}/>
    )
}

export default OnBoard;

const styles = StyleSheet.create({
    container:{
        backgroundColor:"#fff"
    },
    image:{
        width: 300,
        height: 300,
        marginBottom: 30
    }
})

// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: "#fff",
//       justifyContent: "center", // centers vertically
//     },
//     row: {
//       flexDirection: "row", // put image & text side by side
//       alignItems: "center", // vertically center both
//       paddingHorizontal: 20,
//     },
//     image: {
//       width: 150,
//       height: 150,
//       marginRight: 20, // spacing between image & text
//     },
//     textContainer: {
//       flex: 1, // take remaining space
//     },
//     title: {
//       fontSize: 22,
//       fontWeight: "bold",
//       marginBottom: 10,
//     },
//     text: {
//       fontSize: 16,
//       marginBottom: 20,
//     },
//     button: {
//       backgroundColor: "#007bff",
//       paddingVertical: 12,
//       paddingHorizontal: 25,
//       borderRadius: 25,
//       marginTop: 10,
//       alignSelf: "flex-start", // keep button aligned left under text
//     },
//     buttonText: {
//       color: "white",
//       fontSize: 16,
//       fontWeight: "600",
//     },
//   });
  


// use this for seperate get started button using islast true  
// const renderItem = ({item})=>{
       
//     if(item.isLast)
//     {
//         return(
//             <SafeAreaView>
//             <View>
//                 <Text>{item.title}</Text>
//                 <Text>{item.text}</Text>
//                 <TouchableOpacity onPress={() => navigation.replace("Login")}>
//                     <Text>Get Started</Text>
//                 </TouchableOpacity>
//             </View>
//         </SafeAreaView>
//         )
        
//     }
//     else{
//         return (
//             <SafeAreaView>
//                 <View>
//                     <Text>{item.title}</Text>
//                     <Text>{item.text}</Text>
//                 </View>
//             </SafeAreaView>
//         )
        
//     } 
// }