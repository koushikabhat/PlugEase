// import React from "react";

// //app intro slider i need a swipeable 
// import AppIntroSlider from "react-native-app-intro-slider";

// import {SafeAreaView, Text, View, TouchableOpacity, Image, StyleSheet} from "react-native"

// function OnBoard({navigation}){

//     const slides = [
//         {
//             key: "one",
//             title: "first",
//             text: "This is the first intro screen",
//             image: require("../Assets/Onboard1.png")
            
//         },
//         {
//             key:"two",
//             title:"second",
//             text:"Select Stations", 
//             image: require("../Assets/Onboard2.png")
//         },
//         {
//             key:"three",
//             title:"third",
//             text:"Get Charged", 
//             image: require("../Assets/Onboard3.png"),
//             isLast : true
//         }
       
//     ]

//     // const renderItem = ({item})=>{
//     //     if(item.isLast)
//     //     {
//     //         return(
//     //             <SafeAreaView style={styles.container}>
//     //             <Image source={item.image} style={styles.image} resizeMode="contain"/>
//     //             <View>
//     //                 <Text>{item.title}</Text>
//     //                 <Text>{item.text}</Text>
//     //                 <TouchableOpacity onPress={() => navigation.replace("Login")}>
//     //                     <Text>Get Started</Text>
//     //                 </TouchableOpacity>
//     //             </View>
//     //         </SafeAreaView>
//     //         )  
//     //     }
//     //     else{
//     //         return (
//     //             <SafeAreaView style={styles.container}>
//     //                 <Image source={item.image} style={styles.image} resizeMode="contain"/>
//     //                 <View>
//     //                     <Text>{item.title}</Text>
//     //                     <Text>{item.text}</Text>
//     //                 </View>
//     //             </SafeAreaView>
//     //         )
            
//     //     } 
//     // }

//     const renderItem = ({ item }) => {
//         return (
//           <SafeAreaView style={styles.container}>
//             <View style={styles.row}>
//               {/* Left side image */}
//               <Image source={item.image} style={styles.image} resizeMode="contain" />
      
//               {/* Right side text */}
//               <View style={styles.textContainer}>
//                 <Text style={styles.title}>{item.title}</Text>
//                 <Text style={styles.text}>{item.text}</Text>
      
//                 {item.isLast && (
//                   <TouchableOpacity style={styles.button} onPress={() => navigation.replace("Login")}>
//                     <Text style={styles.buttonText}>Get Started</Text>
//                   </TouchableOpacity>
//                 )}
//               </View>
//             </View>
//           </SafeAreaView>
//         );
//       };
      

//     const onDone = ()=>{
//         navigation.replace("Login");
//     }

//     return(
//         <AppIntroSlider renderItem={renderItem} data={slides} onDone={onDone}  showDoneButton={false}/>
//     )
// }

// export default OnBoard;

// // const styles = StyleSheet.create({
// //     container:{
// //         backgroundColor:"#fff"
// //     },
// //     image:{
// //         width: 300,
// //         height: 300,
// //         marginBottom: 30
// //     }
// // })

import React from "react";
import AppIntroSlider from "react-native-app-intro-slider";
import { SafeAreaView, Text, View, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";

function OnBoard({ navigation }) {
  const { height, width } = Dimensions.get("window"); // get device size

  const slides = [
    {
      key: "one",
      title: "first",
      text: "Select Station Based on your Location",
      image: require("../Assets/onboard2.png"),
    },
    {
      key: "two",
      title: "second",
      text: "Select Stations",
      image: require("../Assets/onboard1.png"),
    },
    {
      key: "three",
      title: "third",
      text: "Get Charged",
      image: require("../Assets/Onboard3.png"),
      isLast: true,
    },
  ];

  const renderItem = ({ item }) => {
    return (
      <SafeAreaView style={styles.container}>
        <Image source={item.image} style={[styles.image,{ height: height * 0.75, width: width * 0.9 }]} resizeMode="contain" />
        <View>
          {item.isLast && (
            <TouchableOpacity style={styles.button} onPress={() => navigation.replace("Login")}>
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  };

  const onDone = () => {
    navigation.replace("Login");
  };

  const renderNextButton = () => (
    <View style={styles.nextButton}>
      <Text style={styles.nextText}>--›</Text> 
    </View>
  );

  return <AppIntroSlider renderItem={renderItem} data={slides} onDone={onDone} showDoneButton={false}  renderNextButton={renderNextButton}/>;
}

export default OnBoard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center", // center everything horizontally
    justifyContent: "center",
  },
  image: {
    marginBottom:0,
    height: 900,
    width: 330
  },
  nextButton: {
    width: 54,
    height: 54,
    borderRadius: 30,
    backgroundColor: "#00AB82",
    justifyContent: "center",
    alignItems: "center",
  },
  nextText: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
  },
  button: {
    height:55,
    width:250,
    borderRadius: 15,
    backgroundColor: "#00AB82",
    paddingVertical: 10,
    paddingHorizontal: 60,
  },
  buttonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "500",
  },
});
