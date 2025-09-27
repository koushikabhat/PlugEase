import React from "react";
import { View, TextInput, StyleSheet, Button } from "react-native";
import api  from "../utils/axiosConfig"; 



export default function SearchScreen() {

  const[query, setQuery] = React.useState("");

  const handleSearch = async()=>{
    try{
      const response = await api.post("/stations/search-stations", {query});
      console.log(response.data);
    }
    catch(error)
    {
      console.log("Error Occured at the HandleSearch Querry")
    }
  }


  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Type to search..."
        value="query"
        onChangeText={setQuery}
        style={styles.input}
        autoFocus
      />
      <Button title="search"  onPress={handleSearch}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
});
