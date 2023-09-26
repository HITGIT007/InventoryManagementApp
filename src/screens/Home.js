import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  BackHandler,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { myFetchGetRequest, myFetchPostRequest, myFetchPutRequest } from '../data/FetchApiRequests';
export const Home = ({route}) => {
  const [inventory, setInventory] = useState([]);
  const sampleData = require('../data/sampleData.json');

  const products = sampleData.inventory;

  const navigation = useNavigation();

  //const userRole = route.params.roles;

  useEffect(() => {
    const disableBackButton = () => {
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', disableBackButton);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', disableBackButton);
    };
  }, []);

  useEffect(() => {
    console.log('Sample Data =============================>', sampleData);
    setInventory(products);
  }, []);
  
  useEffect(() => {
   // getFetchData() 
   // postFetchData()
    putFetchData()
   
  }, []);

  const getFetchData = async ()=> {
    const res = await myFetchGetRequest()
    console.log('myFetchGetRequest =============================>', res);
  }


  const postFetchData = async ()=> {
    const res = await myFetchPostRequest({
      title: 'foodd',
      body:'barrr',
      userId:1
   })
    console.log('myFetchPostRequest =============================>', res);
  }

  const putFetchData = async ()=> {
    const data = {
      
      title: 'foewweo',
      body:'baqwr',
      userId:1
   }
    const res = await myFetchPutRequest(101, data);
    console.log('myFetchPutRequest =============================>', res);
  }

  // const putFetchData = async ()=> {
  //   const data = {
      
  //     title: 'foewweo',
  //     body:'baqwr',
  //     userId:1
  //  }
  //   const res = await myFetchPutRequest(101, data);
  //   console.log('myFetchPutRequest =============================>', res);
  // }
  

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();

      navigation.navigate('Login');
    } catch (error) {
      console.error('Error clearing AsyncStorage: ', error);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={{position: 'absolute', top: 10, left: 10}}>
        <Text style={{color: 'black', fontSize: 14}}>WELCOME</Text>
        {/* <Text style={{color: 'red', fontSize: 14}}>
          {route.params.email}
        </Text> */}
        {/* <Text style={{color: 'red', fontSize: 14}}>{route.params.email}</Text> */}
      </View>
      <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
      <TouchableOpacity
          onPress={() => {
            navigation.navigate('Vendor');
          }}
          style={{
            backgroundColor: 'orange',
            width: wp(80),
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 5,
            marginBottom:10
          }}>
          <Text style={{color: 'black', fontSize: 14}}>Vendor List</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Inventory');
          }}
          style={{
            backgroundColor: '#00CE61',
            width: wp(80),
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 5,
          }}>
          <Text style={{color: 'black', fontSize: 14}}>Inventory Items</Text>
        </TouchableOpacity>
      </View>

      <View style={{position: 'absolute', bottom: 10}}>
        <Button title="Logout" onPress={handleLogout} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,

    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    marginBottom: 10,
    color: 'black',
  },
  roles: {
    fontSize: 18,
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 20,
    marginBottom: 10,
    color: 'black',
  },
  pendingInventory: {
    marginTop: 20,
  },
  inventoryItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});
