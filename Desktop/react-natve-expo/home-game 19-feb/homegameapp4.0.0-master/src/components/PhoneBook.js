import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  StatusBar,
  Platform,
} from "react-native";
import * as Contacts from "expo-contacts";
import { LinearGradient } from "expo-linear-gradient";
import { RFPercentage } from "react-native-responsive-fontsize";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { ToastMessage } from './ToastMessage';
import { Loader } from "./Loader";
import Styles from "../styles/Styles";
import Images from "../../constants/Images";
import { SmallButton } from "./Buttons/Button";
import normalize from "react-native-normalize";
const STATUS_BAR = StatusBar.statusBarHeight || 35;

export function PhoneBook(props) {
  const modalFlash = useRef(null);
  const [contacts, setContacts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [contactsHolder, setContactsHolder] = useState([]);
  const [loder, setLoader] = useState(false);
  const limit = 30;
  const [length, setLength] = useState(0);
  const [lowerL, setLowerL] = useState(0);
  const [higherL, setHigherL] = useState(limit - 1);
  const [tempList, setTempList] = useState([]);
  const [tempLength, setTempLength] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  // var isVisible = false;
  // if (props.isVisible) {
  //   isVisible = props.isVisible;
  // }

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        if (props.isVisible) {
          setIsVisible(props.isVisible);
        }
        getAllData();
      }else{
        if(Platform.OS == 'ios'){
          ToastMessage('You declined access contact permission. Please allow app from settings to access contacts.')
        }else{
          ToastMessage('You declined access contact permission.')
        }
        
      }
    })();

    
  }, []);

  function setTempListFunction(data) {
    try {
      data = data.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {}
    var blank =[]
    if (data.length > 0) {
      setLength(data.length);
      setLowerL(0);
      setHigherL(29);
      if (data.length > 29) {
        blank=data.slice(0, 29)
        setTempList(blank);
      } else {
        setTempList(data);
      }
      setTempLength(blank.length);
    }
  }

  async function getAllData () {
    var { data } = await Contacts.getContactsAsync({
      fields: [
        Contacts.Fields.PhoneNumbers,
        Contacts.Fields.FirstName,
        Contacts.Fields.MiddleName,
        Contacts.Fields.LastName,
        Contacts.Fields.ImageAvailable,
        Contacts.Fields.Image,
      ],
    });
    console.log(" >>>>>>>>>>>>>>>>>>>>>>> ",data.length)
    setTimeout(() => {
      if (data.length > 0) {
        setContacts(data);
        setContactsHolder(data);
        setTempListFunction(data);
      }
    }, 50);
  }

  async function searchFilterFunction(text) {
    setKeyword(text);
    var newData = contactsHolder.filter((item) => {
      var number = "";
      if (item.phoneNumbers && item.phoneNumbers.length > 0) {
        number = `${item.phoneNumbers[0].number.toUpperCase()}`;
      }
      const itemData = `${String(item.name).toUpperCase()} ${number}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setTempListFunction(newData);
  }

  function closeModal() {
    getAllData();
    props.that.togglePhoneBook();
  }

  function getContacts(item, contact) {
    setLoader(true);
    let full_number = contact;
    full_number = full_number.replace(/-/g, "");
    full_number = full_number.replace(/ /g, "");
    full_number = full_number.replace("+", "");
    setLoader(false);

    let user = { name: item.name, phone_number: full_number }
    searchFilterFunction('')
    props.that.selectContact(user)
  }

  function saveContact() {
    if (props.that.state.openPhoneBookFor === "name") {
      props.that.state.SELECTED_GROUP_USERS[
        props.that.state.selectedIndexForContact
      ].name = keyword;
      searchFilterFunction("");
      props.that.togglePhoneBook();
    } else if (props.that.state.openPhoneBookFor === "phone_number") {
      var number_index = props.that.state.ALL_GROUP_USERS.findIndex((value) => {
        return value.phone_number === keyword;
      });
      if (number_index >= 0) {
        modalFlash.current.showMessage({
          message: "This contact is already added",
          type: "danger",
          duration: 4000,
          position: "top",
        });
      } else {
        props.that.state.SELECTED_GROUP_USERS[
          props.that.state.selectedIndexForContact
        ].phone_number = keyword;
        searchFilterFunction("");
        props.that.togglePhoneBook();
      }
    }
  }

  function phoneNumberCard(item) {
    var numberArr = [];
    item.phoneNumbers.map((phone, index) => {
      let full_number = phone.number;
      full_number = full_number.replace(/-/g, "");
      full_number = full_number.replace(/ /g, "");
      full_number = full_number.replace('+', "");
      phone.formated_number = full_number;
      numberArr.push(phone);
    });
    const unique = [...new Set(numberArr.map(a => a.formated_number))]; // [ 'A', 'B']
    return unique.map((phone, index) => {
      return (<TouchableOpacity
        activeOpacity={0.1}
        key={index + Math.random()}
        style={[{ height: normalize(30), width: '100%', justifyContent: 'center', marginBottom: 2 }]}
        onPress={() => getContacts(item, phone)}
      ><Text key={index} style={[Styles.fontRegular, { textTransform: 'capitalize' }]}>
          Mobile: {phone}
        </Text></TouchableOpacity>);
    })
  }

  function onEndReached() {
    setTempLength(tempList.length);
    if (tempList.length < length) {
      setLowerL(lowerL + limit);
      setHigherL(higherL + limit);
      var lL = lowerL + limit;
      var hL = higherL + limit;
      var list = contacts.slice(lL, hL);
      var listT = tempList.concat(list);
      try {
        listT = listT.sort((a, b) => a.name.localeCompare(b.name));
      } catch (error) {}
      if (JSON.stringify(tempList) != JSON.stringify(list)) {
        setTimeout(() => {
          setTempList(listT);
        }, 10);
      }
    }
  }

  return (
    <Modal
      animationType="fade"
      fullScreen={true}
      transparent={true}
      visible={isVisible}
      onRequestClose={closeModal}
    >
      <View style={[styles.modalBackground]}>
        <View style={styles.modalContent}>
          <LinearGradient
            colors={["#77869E", "#3C434F"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.modalHeader, { alignItems: "center" }]}
          >
            <Text style={[Styles.textWhite, Styles.font16, Styles.fontMedium]}>
              Phone Book
            </Text>
            <TouchableOpacity
              activeOpacity={Styles.touchOpacity}
              style={[{ paddingHorizontal: 20, paddingVertical: 5 }]}
              hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}
              onPress={closeModal}
            >
              <Image
                source={Images.crossIcon}
                style={{ height: RFPercentage(2.2), width: RFPercentage(2.2) }}
              />
            </TouchableOpacity>
          </LinearGradient>

          <View style={styles.modalBody}>
            <View style={Styles.tbRow}>
              <View style={[Styles.tbCol, { width: "100%" }]}>
                <TextInput
                  autoFocus={false}
                  onChangeText={(text) => searchFilterFunction(text)}
                  placeholder="Search Here..."
                  style={{
                    borderWidth: 1,
                    borderColor: "#00000029",
                    height: 35,
                    width: "100%",
                    padding: 10,
                    borderRadius: 25,
                    color: "#77869E",
                  }}
                />
              </View>
              {/* <View
                style={[Styles.tbCol, { width: "20%", alignItems: "flex-end" }]}
              >
                <SmallButton
                  onPress={() => {
                    saveContact();
                  }}
                  label="Add"
                  fontSize={normalize(16)}
                  btnStyle={{ width: "100%", height: normalize(30) }}
                />
              </View> */}
            </View>
            <FlatList
              data={tempList}
              onEndReached={() => {
                onEndReached();
              }}
              renderItem={({ item }) => (
                <>
                  {item.phoneNumbers && item.phoneNumbers.length > 0 ? (
                    <View style={styles.bookContainer}>
                      {item.imageAvailable && item.image ? (
                        <Image source={item.image} style={styles.photo} />
                      ) : (
                        <Image
                          source={Images.activeGame}
                          style={styles.photo}
                        />
                      )}
                      <View style={styles.container_text}>
                        <TouchableOpacity
                          activeOpacity={1}
                          style={[{ justifyContent: "center" }]}
                        >
                          <Text
                            style={[
                              Styles.fontMedium,
                              { textTransform: "capitalize" },
                            ]}
                          >
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                        {item.phoneNumbers && item.phoneNumbers.length > 0
                          ? phoneNumberCard(item)
                          : null}
                      </View>
                    </View>
                  ) : null}
                </>
              )}
              keyExtractor={(item) => item.id.toString() + Math.random()}
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
    backgroundColor: "#00000090",
    alignItems: "center",
    justifyContent: "center",
  },
  modalHeader: {
    width: "100%",
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "red",
  },
  modalContent: {
    height: "90%",
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: Platform.OS === "ios" ? STATUS_BAR : 0,
  },
  modalBody: {
    flex: 1,
    padding: 15,
    paddingTop: 20,
    backgroundColor: "#FFF",
  },
  listContainer: {
    flex: 1,
  },
  bookContainer: {
    flex: 1,
    flexDirection: "row",
    padding: 6,
    //marginLeft: 16,
    //marginRight: 16,
    borderRadius: 5,
    backgroundColor: "#FFF",
    borderColor: "#f4f4f5",
    borderBottomWidth: 1,
    alignItems: "center",
  },
  container_text: {
    flex: 1,
    flexDirection: "column",
    marginLeft: 12,
    justifyContent: "center",
  },
  description: {
    fontSize: 11,
    fontStyle: "italic",
  },
  photo: {
    height: normalize(40),
    width: normalize(40),
    borderRadius: 50,
  },
});
