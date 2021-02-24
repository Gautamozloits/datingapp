import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, Dimensions, StyleSheet, Image, TouchableOpacity, TextInput, Modal, FlatList, StatusBar, Platform } from 'react-native';
import * as Contacts from 'expo-contacts';
import { LinearGradient } from 'expo-linear-gradient';
import { RFPercentage } from "react-native-responsive-fontsize";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { Loader } from '../../components/Loader'
import Styles from '../../styles/Styles';
import Images from '../../../constants/Images';
import { SmallButton } from '../../components/Buttons/Button';
import normalize from 'react-native-normalize';
const STATUS_BAR = StatusBar.statusBarHeight || 35;

export function PhoneBook(props) {

  const modalFlash = useRef(null);
  const [contacts, setContacts] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [contactsHolder, setContactsHolder] = useState([]);
  const [loder, setLoader] = useState(false);
  const limit = 30;
  const [length, setLength] = useState(0)
  const [lowerL, setLowerL] = useState(0)
  const [higherL, setHigherL] = useState(limit - 1)
  const [tempList, setTempList] = useState([])
  const [tempLength, setTempLength] = useState(0)

  //var isVisible = false;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {

    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        if (props.isVisible) {
          setIsVisible(props.isVisible);
          //props.that.togglePhoneBook()
          console.log('here.......',isVisible)
        }
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.FirstName, Contacts.Fields.MiddleName, Contacts.Fields.LastName, Contacts.Fields.ImageAvailable, Contacts.Fields.Image],
        });

        if (data.length > 0) {
          
          setContacts(data)
          setContactsHolder(data)

          setLength(data.length)
          setTempList([])
          if (data.length > higherL) {
            setTempList(data.slice(lowerL, higherL))
          } else {
            setTempList(data)
          }
          setTempLength(tempList.length)
        }
      }
    })();
  }, []);

  function searchFilterFunction(text) {
    setKeyword(text);
    const newData = contactsHolder.filter(item => {
      var number = '';
      if (item.phoneNumbers && item.phoneNumbers.length > 0) {
        number = `${item.phoneNumbers[0].number.toUpperCase()}`;
      }
      const itemData = `${String(item.name).toUpperCase()} ${number}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });

    setContacts(newData)

    setLength(newData.length)
    setLowerL(0)
    setHigherL(limit - 1)
    setTempList([])
    if (newData.length > higherL) {
      setTempList(newData.slice(lowerL, higherL))
    } else {
      setTempList(newData)
    }
    setTempLength(tempList.length)
  };

  function closeModal() {
    searchFilterFunction('')
    props.that.togglePhoneBook()
  };

  function getContacts(item, contact) {
    setLoader(true)
    let full_number = contact;
    full_number = full_number.replace(/-/g, "");
    full_number = full_number.replace(/ /g, "");
    full_number = full_number.replace('+', "");
    setLoader(false)
    var number_index = props.that.state.SELECTED_GROUP_USERS.findIndex((value) => {
      return value.phone_number === full_number;
    })
    if (number_index >= 0) {
      modalFlash.current.showMessage({
        message: 'This contact is already added',
        type: 'danger',
        duration: 4000,
        position: 'top',
      })
    } else {
      var number_index = props.that.state.ALL_GROUP_USERS.findIndex((value) => {
        return value.phone_number === full_number;
      })
      if (number_index >= 0) {
        props.that.state.SELECTED_GROUP_USERS[props.that.state.selectedIndexForContact] = props.that.state.ALL_GROUP_USERS[number_index]
      } else {
        props.that.state.SELECTED_GROUP_USERS[props.that.state.selectedIndexForContact].name = item.name
        props.that.state.SELECTED_GROUP_USERS[props.that.state.selectedIndexForContact].phone_number = full_number

      }
      searchFilterFunction('')
      props.that.togglePhoneBook()
    }
  };

  function saveContact() {
    if (props.that.state.openPhoneBookFor === 'name') {
      props.that.state.SELECTED_GROUP_USERS[props.that.state.selectedIndexForContact].name = keyword;
      searchFilterFunction('')
      props.that.togglePhoneBook()
    } else if (props.that.state.openPhoneBookFor === 'phone_number') {
      var number_index = props.that.state.ALL_GROUP_USERS.findIndex((value) => {
        return value.phone_number === keyword;
      })
      if (number_index >= 0) {
        modalFlash.current.
          showMessage({
            message: 'This contact is already added',
            type: 'danger',
            duration: 4000,
            position: 'top',
          })
      } else {
        props.that.state.SELECTED_GROUP_USERS[props.that.state.selectedIndexForContact].phone_number = keyword
        searchFilterFunction('')
        props.that.togglePhoneBook()
      }
    }
  }

  function phoneNumberCard(item) {
    var showNumber = '';
    var numberArr = [];
    item.phoneNumbers.map((phone, index) => {
      let full_number = phone.number; height: normalize(30),
        phone.formated_number = full_number;
        numberArr.push(phone);
    });
    const unique = [...new Set(numberArr.map(a => a.formated_number))]; // [ 'A', 'B']

    return unique.map((phone, index) => {
      return (<TouchableOpacity
        key={index + Math.random()}
        style={[{ width: '100%', justifyContent: 'center', zIndex: 1000, paddingVertical: 10, marginVertical: 1 }]}
        onPress={() => {
          getContacts(item, phone)
        }}
      ><Text key={index} style={[Styles.fontRegular, { textTransform: 'capitalize', }]}>
          Mobile: {phone}
        </Text></TouchableOpacity>);
    })
  }

  function onEndReached() {
    setTempLength(tempList.length)
    if (tempLength < length) {
      setLowerL(lowerL + limit)
      setHigherL(higherL + limit)
      setTempList(tempList.concat(contacts.slice(lowerL, higherL)))
    }
  }

  return (
    <Modal
      animationType="fade"
      fullScreen={true}
      transparent={true}
      visible={isVisible}
      onRequestClose={closeModal}>
      <View style={[styles.modalBackground]}>
        <View style={styles.modalContent}>
          <LinearGradient colors={['#77869E', '#3C434F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.modalHeader, { alignItems: "center" }]}>
            <Text style={[Styles.textWhite, Styles.font16, Styles.fontMedium]}>Phone Book</Text>
            <TouchableOpacity
              activeOpacity={Styles.touchOpacity}
              style={[{ paddingHorizontal: 20, paddingVertical: 5 }]}
              hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}
              onPress={closeModal}
            >
              <Image source={Images.crossIcon} style={{ height: RFPercentage(2.2), width: RFPercentage(2.2) }} />
            </TouchableOpacity>
          </LinearGradient>

          <View style={styles.modalBody}>
            <View style={Styles.tbRow}>
              <View style={[Styles.tbCol, { width: '80%' }]}>
                <TextInput
                  autoFocus={false}
                  onChangeText={text => searchFilterFunction(text)}
                  placeholder="Search Here..."
                  style={{ borderWidth: 1, borderColor: '#00000029', height: 35, width: '100%', padding: 10, borderRadius: 25, color: '#77869E' }}
                />
              </View>
              <View style={[Styles.tbCol, { width: '20%', alignItems: 'flex-end' }]}>
                <SmallButton onPress={() => {
                  saveContact();
                }} label="Add"
                  fontSize={normalize(16)}
                  btnStyle={{ width: '100%', height: normalize(30) }}
                />
              </View>

            </View>
            <FlatList
              data={tempList}
              onEndReached={() => { onEndReached() }}
              renderItem={({ item }) =>
                <>
                  {item.phoneNumbers && item.phoneNumbers.length > 0 ?
                    <View style={styles.bookContainer}>
                      {item.imageAvailable && item.image ?
                        <Image source={item.image} style={styles.photo} />
                        : <Image source={Images.activeGame} style={styles.photo} />}
                      <View style={styles.container_text}>
                        <TouchableOpacity activeOpacity={1} style={[{ justifyContent: 'center' }]}>
                          <Text style={[Styles.fontMedium, { textTransform: 'capitalize' }]}>
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                        {item.phoneNumbers && item.phoneNumbers.length > 0 ?
                          phoneNumberCard(item)
                          : null}
                      </View>
                    </View>
                    : null}
                </>}
              keyExtractor={item => item.id.toString()+Math.random()}
            />
          </View>
        </View>
      </View>
      <FlashMessage ref={modalFlash} position="top" />
    </Modal>
  );

}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    //padding: 20,
    backgroundColor: '#00000090',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalHeader: {
    width: '100%',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: "red"
  },
  modalContent: {
    height: '100%',
    width: '100%',
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    overflow: 'hidden',
    marginTop: Platform.OS === 'ios' ? STATUS_BAR : 0
  },
  modalBody: {
    flex: 1,
    padding: 15,
    paddingTop: 20,
    backgroundColor: '#FFF'
  },

  listContainer: {
    flex: 1,
  },

  bookContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 6,
    //marginLeft: 16,
    //marginRight: 16,
    borderRadius: 5,
    backgroundColor: '#FFF',
    borderColor: '#f4f4f5',
    borderBottomWidth: 1,
    alignItems: 'center'
  },
  container_text: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 12,
    justifyContent: 'center',
  },
  description: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  photo: {
    height: normalize(40),
    width: normalize(40),
    borderRadius: 50,
  },
});