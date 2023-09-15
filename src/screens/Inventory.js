import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  Alert,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import sampleData from '../data/sampleData.json';
import {useNavigation} from '@react-navigation/native';
import Modal from 'react-native-modal';

export const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [userRoles, setUserRoles] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [updatedItemName, setUpdatedItemName] = useState('');
  const [updatedVendorName, setUpdatedVendorName] = useState('');
  const [updatedMRP, setUpdatedMRP] = useState('');
  const [updatedBatchNumber, setUpdatedBatchNumber] = useState('');
  const [updatedBatchDate, setUpdatedBatchDate] = useState('');
  const [updatedQuantity, setUpdatedQuantity] = useState('');
  const navigation = useNavigation();
  const [newItem, setNewItem] = useState({
    productId: '',
    productName: '',
    vendor: '',
    mrp: '',
    batchNumber: '',
    batchDate: '',
    quantity: '',
  });

  useEffect(() => {
    console.log('Component mounted, loading inventory data and user roles...');
    loadUserRoles();
    loadInventoryData();
  }, []);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  // userRoles == 'Store Manager' ? ()

  const removeItemFromInventory = async (itemId, userRoles) => {
    try {
      const data = await AsyncStorage.getItem('sampleData');
      if (data) {
        const parsedData = JSON.parse(data);

        const itemIndex = parsedData.inventory.findIndex(
          item => item.id === itemId,
        );

        if (itemIndex !== -1) {
          if (userRoles == 'Department Manager') {
            parsedData.inventory[itemIndex].status = 'Deletion Pending';
          } else if (userRoles == 'Store Manager') {
            parsedData.inventory.splice(itemIndex, 1);
            Alert.alert('Item removed successfully!');
          }

          await AsyncStorage.setItem('sampleData', JSON.stringify(parsedData));

          setInventory(parsedData.inventory);
        }
      }
    } catch (error) {
      console.error('Error removing item from inventory: ', error);
      // Optionally, you can display an error message to the user
      Alert.alert('Error removing item from inventory. Please try again.');
    }
  };

  const approveItem = async itemId => {
    const updatedInventory = inventory.map(item => {
      if (item.id === itemId) {
        if (userRoles === 'Store Manager') {
          if (item.status === 'Pending Approval') {
            item.status = 'Approved';
          } else {
            item.status = 'Approved';
          }

          console.log('Approved item =============================>', item.id);
        } else if (userRoles === 'Department Manager') {
          item.status = 'Pending Approval';
          console.log(
            'Pending Approved item =============================>',
            item.id,
          );
        }
      }
      return item;
    });

    try {
      await AsyncStorage.setItem(
        'sampleData',
        JSON.stringify({
          ...JSON.parse(await AsyncStorage.getItem('sampleData')),
          inventory: updatedInventory,
        }),
      );
      setInventory(updatedInventory);
    } catch (error) {
      console.error('Error updating data: ', error);
    }
  };

  const handleUpdateItem = async () => {
    try {
      const updatedInventory = inventory.map(item => {
        if (item.id === selectedItemId) {
        
          if (
            userRoles === 'Department Manager' 
             
          ) {
          
            item.status = 'Change Approval';
            item.productName = updatedItemName;
            item.vendor = updatedVendorName;
            item.mrp = updatedMRP;
            item.batchNumber = updatedBatchNumber;
            item.batchDate = updatedBatchDate;
            item.quantity = updatedQuantity;
            
          }else if(userRoles === 'Store Manager'){
            item.status = 'Approved';
            item.productName = updatedItemName;
            item.vendor = updatedVendorName;
            item.mrp = updatedMRP;
            item.batchNumber = updatedBatchNumber;
            item.batchDate = updatedBatchDate;
            item.quantity = updatedQuantity;
          }
        }
        return item;
      });

      await AsyncStorage.setItem(
        'sampleData',
        JSON.stringify({
          ...JSON.parse(await AsyncStorage.getItem('sampleData')),
          inventory: updatedInventory,
        }),
      );
      setInventory(updatedInventory);
      setUpdateModalVisible(false);

    
      Alert.alert('Item updated successfully!');
    } catch (error) {
      console.error('Error updating item: ', error);
      // Optionally, you can display an error message to the user
      Alert.alert('Error updating item. Please try again.');
    }
  };

  const addItemToInventory = async newItem => {
    try {
      const data = await AsyncStorage.getItem('sampleData');
      if (data) {
        const parsedData = JSON.parse(data);

        const lastItemId = parsedData.inventory.reduce(
          (maxId, item) => (item.id > maxId ? item.id : maxId),
          0,
        );

        const newItemId = lastItemId + 1;

        const newItemObject = {
          id: newItemId,
          productId: newItem.productId,
          productName: newItem.productName,
          vendor: newItem.vendor,
          mrp: newItem.mrp,
          batchNumber: newItem.batchNumber,
          batchDate: newItem.batchDate,
          quantity: newItem.quantity,
          status:
            userRoles == 'Department Manager' ? 'Pending Approval' : 'Approved',
          requestedBy: userRoles,
        };

        parsedData.inventory.push(newItemObject);

        await AsyncStorage.setItem('sampleData', JSON.stringify(parsedData));

        setInventory(parsedData.inventory);

        Alert.alert('Item added successfully!');
      }
    } catch (error) {
      console.error('Error adding item to inventory: ', error);

      Alert.alert('Error adding item to inventory. Please try again.');
    }
  };
  const handleAddNewItem = () => {
    addItemToInventory(newItem);

    setNewItem({
      productId: '',
      productName: '',
      vendor: '',
      mrp: '',
      batchNumber: '',
      batchDate: '',
      quantity: '',
    });

    toggleModal();
  };

  const loadUserRoles = async () => {
    try {
      const roles = await AsyncStorage.getItem('userRole');
      const roles0 = JSON.parse(roles);
      console.log(
        'Roles From AsyncStorage =============================>',
        roles0,
      );
      if (roles !== null) {
        console.log('Roles =============================>', roles0);

        setUserRoles(roles0[0]);
      }
    } catch (error) {
      console.error('Error loading user roles: ', error);
    }
  };

  const loadInventoryData = async () => {
    try {
      const data = await AsyncStorage.getItem('sampleData');
      if (data !== null) {
        console.log(
          ' Data Present, Parse the data from JSON.================================================================>',
        );
        const parsedData = JSON.parse(data);
        setInventory(parsedData.inventory);
      } else {
        const initialData = require('../data/sampleData.json');
        await AsyncStorage.setItem('sampleData', JSON.stringify(initialData));
        setInventory(initialData.inventory);
      }
    } catch (error) {
      console.error('Error loading data: ', error);
    }
  };

  const openUpdateModal = itemId => {
    setSelectedItemId(itemId);
  
    // Find the item in the inventory by its ID and set the initial values for the input fields
    const selectedItem = inventory.find(item => item.id === itemId);
    if (selectedItem) {
      setUpdatedItemName(selectedItem.productName || '');
      setUpdatedVendorName(selectedItem.vendor || '');
      setUpdatedMRP(selectedItem.mrp || '');
      setUpdatedBatchNumber(selectedItem.batchNumber || '');
      setUpdatedBatchDate(selectedItem.batchDate || '');
      setUpdatedQuantity(selectedItem.quantity || '');
    }
  
    setUpdateModalVisible(true);
  };


  return (
    <SafeAreaView style={styles.container}>
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add New Item</Text>

          {/* Input fields for the new item */}
          <TextInput
            placeholder="Product ID"
            style={styles.modalInput}
            onChangeText={text => setNewItem({...newItem, productId: text})}
            value={newItem.productId}
            placeholderTextColor={'black'}
          />

          <TextInput
            placeholder="Product Name"
            style={styles.modalInput}
            onChangeText={text => setNewItem({...newItem, productName: text})}
            value={newItem.productName}
            placeholderTextColor={'black'}
          />

          <TextInput
            placeholder="Vendor Name"
            style={styles.modalInput}
            onChangeText={text => setNewItem({...newItem, vendor: text})}
            value={newItem.vendor}
            placeholderTextColor={'black'}
          />

          <TextInput
            placeholder="MRP"
            style={styles.modalInput}
            onChangeText={text => setNewItem({...newItem, mrp: text})}
            value={newItem.mrp}
            placeholderTextColor={'black'}
          />

          <TextInput
            placeholder="Batch Number"
            style={styles.modalInput}
            onChangeText={text => setNewItem({...newItem, batchNumber: text})}
            value={newItem.batchNumber}
            placeholderTextColor={'black'}
          />

          <TextInput
            placeholder="Batch Date"
            style={styles.modalInput}
            onChangeText={text => setNewItem({...newItem, batchDate: text})}
            value={newItem.batchDate}
            placeholderTextColor={'black'}
          />

          <TextInput
            placeholder="Quantity"
            style={styles.modalInput}
            onChangeText={text => setNewItem({...newItem, quantity: text})}
            value={newItem.quantity}
            placeholderTextColor={'black'}
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity
              onPress={handleAddNewItem}
              style={styles.modalButton}>
              <Text style={styles.modalButtonLabel}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleModal} style={styles.modalButton}>
              <Text style={styles.modalButtonLabel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={updateModalVisible}
        animationType="slide"
        transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Update Item</Text>
            <TextInput
              placeholder="Product Name"
              value={updatedItemName}
              onChangeText={text => setUpdatedItemName(text)}
              style={styles.modalInput}
              placeholderTextColor={'black'}
            />
            <TextInput
              placeholder="Vendor Name"
              value={updatedVendorName}
              onChangeText={text => setUpdatedVendorName(text)}
              style={styles.modalInput}
              placeholderTextColor={'black'}
            />
            <TextInput
              placeholder="MRP"
              value={updatedMRP}
              onChangeText={text => setUpdatedMRP(text)}
              style={styles.modalInput}
              placeholderTextColor={'black'}
            />
            <TextInput
              placeholder="Batch Number"
              value={updatedBatchNumber}
              onChangeText={text => setUpdatedBatchNumber(text)}
              style={styles.modalInput}
              placeholderTextColor={'black'}
            />
            <TextInput
              placeholder="Batch Date"
              value={updatedBatchDate}
              onChangeText={text => setUpdatedBatchDate(text)}
              style={styles.modalInput}
              placeholderTextColor={'black'}
            />
            <TextInput
              placeholder="Quantity"
              value={updatedQuantity}
              onChangeText={text => setUpdatedQuantity(text)}
              style={styles.modalInput}
              placeholderTextColor={'black'}
            />

            {/* Add input fields for other item details here */}
            <View style={{marginBottom:10}}>
            <Button title="Update" onPress={handleUpdateItem}  />
            </View>
            
            <Button
              title="Cancel"
              onPress={() => setUpdateModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
      <View>
        <TouchableOpacity onPress={toggleModal} style={styles.addButton}>
          <Text style={styles.addButtonLabel}>Add New Item</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={inventory}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => {
          console.log('Inventory Items================================>', item);

          return (
            <TouchableOpacity
              style={styles.inventoryItem}
              onPress={() => openUpdateModal(item.id)}>
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 0.8}}>
                  <Text style={{fontSize: 14, color: 'black'}}>
                    Product: {item.productName}
                  </Text>

                  <Text style={{fontSize: 14, color: 'black'}}>
                    Product ID: {item.productId}
                  </Text>
                  <Text style={{fontSize: 14, color: 'black'}}>
                    Vendor: {item.vendor}
                  </Text>
                  <Text style={{fontSize: 14, color: 'black'}}>
                    MRP: {item.mrp}
                  </Text>
                  <Text style={{fontSize: 14, color: 'black'}}>
                    Batch Number: {item.batchNumber}
                  </Text>
                  <Text style={{fontSize: 14, color: 'black'}}>
                    Batch Date: {item.batchDate}
                  </Text>
                  <Text style={{fontSize: 14, color: 'black'}}>
                    Quantity: {item.quantity}
                  </Text>
                  <View style={{alignItems: 'center', flexDirection: 'row'}}>
                    <Text style={{fontSize: 14, color: 'black'}}>Status :</Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color:
                          item.status == 'Pending'
                            ? '#00CE61'
                            : item.status == 'Pending Approval'
                            ? 'blue'
                            : item.status == 'Deletion Pending'
                            ? 'red'
                            : item.status == 'Change Approval' ? 'orange':'black',
                        marginLeft: 5,
                      }}>
                      {item.status}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={{
                    backgroundColor: 'red',
                    borderRadius: 5,
                    flex: 0.2,
                    alignSelf: 'flex-start',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => removeItemFromInventory(item.id, userRoles)}>
                  <Text style={{color: 'white', fontSize: 14}}>Delete</Text>
                </TouchableOpacity>
              </View>

              {userRoles == 'Store Manager'
                ? item.status == 'Pending' && (
                    <Button
                      title="Approve"
                      onPress={() => approveItem(item.id)}
                      disabled={
                        item.status !== 'Pending' &&
                        item.status !== 'Pending Approval'
                      }
                    />
                  )
                : null}

              {userRoles == 'Store Manager'
                ? item.status == 'Pending Approval' && (
                    <Button
                      title="Approve"
                      onPress={() => approveItem(item.id)}
                      disabled={
                        item.status !== 'Pending' &&
                        item.status !== 'Pending Approval'
                      }
                    />
                  )
                : null}
                {userRoles == 'Store Manager'
                ? item.status == 'Change Approval' && (
                    <Button
                      title="Approve"
                      onPress={() => approveItem(item.id)}
                      disabled={
                        item.status !== 'Pending' &&
                        item.status !== 'Pending Approval' && item.status !== 'Change Approval'
                      }
                    />
                  )
                : null}
              {console.log('userRoles=========================>', userRoles)}
              {userRoles == 'Department Manager'
                ? item.status === 'Pending' && (
                    <Button
                      title="Approve"
                      onPress={() => approveItem(item.id)}
                      disabled={
                        item.status !== 'Pending' &&
                        item.status !== 'Pending Approval'
                      }
                    />
                  )
                : null}
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    color: 'black',
  },
  inventoryItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: 'black',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  modalButtonLabel: {
    color: 'white',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 20,
  },
  addButtonLabel: {
    color: 'white',
    textAlign: 'center',
  },
});
