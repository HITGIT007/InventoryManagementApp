import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import {getAxiosReqres} from '../data/AxiosApiReques';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const Vendor = () => {
  const [vendors, setvendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };


  useEffect(() => {
    setLoading(true);
    fetchVendors(page);
  }, [page]);

  const fetchVendors = async page => {
    const res = await getAxiosReqres(page);
    if (res.status === 200) {
      console.log("res.data.data==========>",res.data.data)
      setvendors(res.data.data);
      setLoading(false);
    }
    setLoading(false);
  };

  const renderFeed = item => {
    return (
      <TouchableOpacity
        onPress={() => {
          toggleModal();
          setFirstName(item.first_name);
          setLastName(item.last_name);
          setEmail(item.email);

          setAvatar(item?.avatar);
        
        }}
        
        style={{ width:wp(80), borderWidth:1, marginTop:10, borderRadius:10}}
        >
        <View
          style={{
            flexDirection: 'row',
            width: wp(100),
            alignItems: 'center',
            padding: 5,
            marginTop: 10
          }}>
          <View
            style={{
              height: 45,
              width: 45,
             
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={{uri: item?.avatar}} 
              style={{
                height: 35,
                width: 35,
                resizeMode: 'contain',
                marginTop: -10,
              }}
            />
          </View>
      
          <View
            style={{
              flexDirection: 'row',
              width: wp(100),
              alignItems: 'center',
            }}>
            <Text style={{color: 'black', fontSize: 14}}>
              {item.first_name} {item.last_name}
            </Text>
          </View>
        </View>
        
          {/* <Text style={{color: 'red',marginHorizontal: 5, marginBottom: 10}}> {item.email}</Text> */}
     
        <Text style={{color: 'black', margin:10, marginTop:0}}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{alignItems: 'center', flex:1, }}>
      {/* <View style={{height:50, width:wp(80), borderBottomEndRadius:10, borderBottomLeftRadius:10, backgroundColor:'black', alignItems:'center', justifyContent:'center',}}>
        
        <Text style={{color:'white'}}>Vendor List</Text>
      </View> */}
      <Modal isVisible={isModalVisible}>
        <View
          style={{
            width: wp(80),
           
            borderRadius: 10,
            backgroundColor: 'white',
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: wp(100),
              alignItems: 'center',
              padding: 5,
              marginTop: 10,
            }}>
            <View
              style={{
                height: 45,
                width: 45,

                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={{uri: avatar}} // Pass the URL as the 'uri' property
                style={{
                  height: 35,
                  width: 35,
                  resizeMode: 'contain',
          
                }}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                width: wp(100),
                alignItems: 'center',
              }}>
              <Text style={{color: 'black', fontSize: 14}}>
                {firstName} {lastName}
              </Text>
            </View>
          </View>

          <Text style={{color: 'red', marginHorizontal: 5, marginBottom: 10}}>
            {' '}
            {email}
          </Text>

          <TouchableOpacity
            onPress={toggleModal}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'pink',
              borderRadius: 10,
            }}>
            <Text style={{color: 'black'}}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <View style={{}}>
        {loading ? (
          <View style={{alignItems:'center', justifyContent:'center', flex:1}}>
            <Text style={{color:'black'}}>Loading...</Text>
          </View>
       
        ) : (
          <FlatList
            data={vendors}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => renderFeed(item)}
            style={{}}
            ItemSeparatorComponent={<View style={{backgroundColor:'yellow', height:5}}>

            </View>}
            
          />
        )}
      </View>
      <View
              style={{
                flexDirection: 'row',
                position: 'absolute',
                bottom: 40,
                justifyContent: 'space-around',
              }}>
              <TouchableOpacity
                onPress={() => {
                  if (page == 2) {
                    setPage(page - 1);
                  } else {
                    setPage(page);
                  }
                }}
                style={{
                  backgroundColor: 'grey',
                  height: 40,
                  width: 100,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10,
                  marginRight: 10,
                }}>
                <Text style={{color: 'white'}}>Previous</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: 'grey',
                  height: 40,
                  width: 100,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10,
                }}
                onPress={() => {
                  if (page == 1) {
                    setPage(page + 1);
                  } else {
                    setPage(page);
                  }
                }}>
                <Text style={{color: 'white'}}>Next</Text>
              </TouchableOpacity>
            </View>
    
    </SafeAreaView>
  );
};

export default Vendor;
