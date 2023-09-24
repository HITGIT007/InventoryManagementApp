import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getAxiosReqres} from '../data/AxiosApiReques';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const Vendor = () => {
  const [vendors, setvendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetchVendors(page);
  }, []);

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
          console.log(
            '======================================Item',
            JSON.stringify(item),
          );
        
        }}
        
        style={{ width:wp(80), borderWidth:1, marginVertical:10, borderRadius:10}}
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
              source={{uri: item?.avatar}} // Pass the URL as the 'uri' property
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
        
          <Text style={{color: 'red',marginHorizontal: 5, marginBottom: 10}}> {item.email}</Text>
     
        <Text style={{color: 'black', margin:10, marginTop:0}}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{alignItems: 'center', flex:1, }}>
      <View style={{height:50, width:wp(80), borderBottomEndRadius:10, borderBottomLeftRadius:10, backgroundColor:'black', alignItems:'center', justifyContent:'center'}}>
        <Text style={{color:'white'}}>Vendor List</Text>
      </View>
      <View>
        {loading ? (
          <Text style={{color:'black'}}>Loading...</Text>
        ) : (
          <FlatList
            data={vendors}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => renderFeed(item)}
            style={{flex:1, }}
          />
        )}
      </View>
    
    </SafeAreaView>
  );
};

export default Vendor;
