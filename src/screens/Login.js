import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Touchable,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import sampleData from '../data/sampleData.json';

import { loginAxiosReqres } from '../data/AxiosApiReques';
export const LoginScreen = () => {
  const [role, setRole] = useState('');
  // const [reqresemail, setreqresEmail] = useState('eve.holt@reqres.in');
  // const [reqrespassword, setreqresPassword] = useState('cityslicka');
  const [useremail, setuserEmail] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

 

  useEffect(() => {
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

    function isValidEmail(email) {
      return emailRegex.test(email);
    }

    if (isValidEmail(username)) {
      console.log(`${username} is a email.`);
      setuserEmail(true)
    } else {
      console.log(`${username} is username and not email.`);
    }
    
  }, [username]);

  const handleLogin = async () => {
    
    if (useremail){
      // try {
      //   let reqresemail = 'eve.holt@reqres.in'
      //   let reqrespassword = 'cityslicka'
      //   console.log("Username or Email", reqresemail, reqrespassword)
      //   const response = await axios.post('https://reqres.in/api/login', {
      //     email : reqresemail,
      //     password  : reqrespassword,
      //   });
  
      //   if (response.status === 200) {
      //     AsyncStorage.setItem('userRole', JSON.stringify(['Store Manager']));
      //     navigation.navigate('Home', { roles: ['Store Manager'], username:username, email:username  });
      //   }
      // } catch (error) {
      //   console.error('Login Error:', error);
      // }
      const res = await loginAxiosReqres(username, password);
      if (res.status === 200) {
        await AsyncStorage.setItem('userRole', JSON.stringify(['Store Manager']));
        await AsyncStorage.setItem("token", res.data.token);
        role == 'Store Manager' ?  navigation.navigate('Home', { roles: ['Store Manager'] }) :  navigation.navigate('Home', { roles: ['Department Manager'] })
       
      }
    }
   else{
    const user = sampleData.users.find(
      (user) => user.username === username && user.password === password
    );

    if (user) {
      AsyncStorage.setItem('userRole', JSON.stringify(user.roles));
      if (user.roles.includes(role)) {
        await AsyncStorage.setItem("token", '3124524563546dummytoken12469654235');
        navigation.navigate('Home', { roles: user.roles, username:user.username, email:user.email  });
      } else {
        Alert.alert('You selected an incorrect role for this user.');
      }
    } else {
      Alert.alert('Invalid username or password. Please try again.');
    }
   }





    
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Inventory Management App</Text>
      <View>
        <Text
          style={{
            color: 'black',
            fontSize: 14,
            marginBottom: 5,
          }}>
          Select Role
        </Text>

        <TouchableOpacity
          style={{
            borderWidth: 2,
            borderColor: role == 'Department Manager' ? '#00ce61' : 'grey',
            borderRadius: 5,
            width: wp(80),
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,

            backgroundColor: role == 'Department Manager' ? '#E2FEEF' : 'white',
            fontWeight: role == 'Department Manager' ? 'bold' : '400',
          }}
          onPress={() => {
            setRole('Department Manager');
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: 14,
            }}>
            Department Manager
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            borderWidth: 2,
            borderColor: role == 'Store Manager' ? '#00ce61' : 'grey',
            borderRadius: 5,
            width: wp(80),
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
            backgroundColor: role == 'Store Manager' ? '#E2FEEF' : 'white',
            fontWeight: role == 'Store Manager' ? 'bold' : '400',
          }}
          onPress={() => {
            setRole('Store Manager');
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: 14,
            }}>
            Store Manager
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{marginTop: 20, width: '100%', alignItems: 'center'}}>
        <TextInput
          placeholder="Username / Email"
          onChangeText={text => setUsername(text)}
          style={styles.input}
          placeholderTextColor="#000"
        />
        <TextInput
          placeholder="Password"
          onChangeText={text => setPassword(text)}
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#000"
        />
        <Button title="Login" onPress={handleLogin} disabled={role=='' ? true : false} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    color: 'black',
    position: 'absolute',
    top: 0,
  },
  input: {
    width: '80%',
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    color: 'black',
  },
});
