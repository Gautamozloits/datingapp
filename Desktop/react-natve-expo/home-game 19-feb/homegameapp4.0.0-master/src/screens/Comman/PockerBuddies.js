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
import { ToastMessage } from '../../components/ToastMessage';
import { Loader } from "../../components/Loader";
import Styles from "../../styles/Styles";
import Images from "../../../constants/Images";
import normalize from "react-native-normalize";
import { isValidName, isInvalidUsername, postData, isUsernameExist } from '../../api/service';
import { SmallButton } from '../../components/Buttons/Button';

const STATUS_BAR = StatusBar.statusBarHeight || 35;

export function PockerBuddies(props) {
  const modalFlash = useRef(null);
  const [contacts, setContacts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [contactsHolder, setContactsHolder] = useState([]);
  const [loder, setLoader] = useState(false);
  const limit = 30;
  const [isVisible, setIsVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState([]);
  const [temp, setTemp] = useState('')
  // var isVisible = false;
  // if (props.isVisible) {
  //   isVisible = props.isVisible;
  // }

  useEffect(() => {
    (async () => {
      if (props.isVisible) {
        setIsVisible(props.isVisible);
      }
      postData('pocker-buddies', {}).then(async (res) => {
        console.log(JSON.stringify(res))
        setContacts(res.data);
        setContactsHolder(res.data);
      });
    })();
  }, []);



  async function searchFilterFunction(text) {
    setKeyword(text);
    var newData = contactsHolder.filter((item) => {

      const itemData = `${String(item.name).toUpperCase()} ${String(item.nickname).toUpperCase()} ${String(item.username).toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setContacts(newData);
  }

  function closeModal() {
    props.that.setState({ isPhoneBookModalVisible: false, isAddPlayerModalVisible: true })
  }

  function showLocalMessage(msg) {
    modalFlash.current.showMessage({
      message: msg,
      type: 'danger',
      duration: 4000,
      position: 'top',
      floating: 'yes',
      style: {
        backgroundColor: '#646560',
        borderRadius: 25,
        display: 'flex',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center'
      },
      titleStyle: {
        color: '#FFFFFF'
      }
    })
  }
  function getContacts(user, index) {

    searchFilterFunction('')
    props.that.selectContact(user)

  };
  
  function selectMultipleContacts() {
    console.log(JSON.stringify(selectedUser))
    searchFilterFunction('')
    props.that.selectContact(selectedUser, 'multiple')

  };

  const checkUncheckUser = (item, index) => {
    let users = selectedUser;
    var user_index = selectedUser.findIndex((value) => {
      return value.id === item.id;
      })
      if(user_index > -1){
        users.splice(user_index, 1)
      }else{
        users.push(item)
      }
      setSelectedUser(users)
      
      if(contacts[index]['is_selected']){
        contacts[index]['is_selected'] = false;
      }else{
        contacts[index]['is_selected'] = true;
      }
      setContacts(contacts)
      setTemp(Math.random())
  }
  
  const checkSelectedUser = (item) => {
    let users = selectedUser;
    var user_index = selectedUser.findIndex((value) => {
      return value.id === item.id;
      })
      console.log(item.id+' :user_index: ',user_index)
      if(user_index > -1){
        return Images.checked;
      }else{
        return Images.unchecked;
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
              Poker Buddies
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
              data={contacts}

              renderItem={({ item, index }) => (
                <>
                  <View

                    style={[{ justifyContent: "center" }]}
                  >
                    <View style={styles.bookContainer}>
                      {(props.isMultiple) ?
                        <TouchableOpacity
                          onPress={() =>
                            checkUncheckUser(item, index)
                          }
                          style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                          <Image source={(item.is_selected) ? Images.checked : Images.unchecked} style={{ height: normalize(25), width: normalize(25) }} />
                        </TouchableOpacity>
                        : <Image
                          source={Images.activeGame}
                          style={styles.photo}
                        />}


                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                          getContacts(item, index)
                        }}
                        style={[styles.container_text]}
                      >
                        <View style={styles.container_text}>
                        <Text>{item.id}</Text>
                          <Text
                            style={[
                              Styles.fontMedium,
                              { textTransform: "capitalize" },
                            ]}
                          >
                            {item.display_name} {item.is_selected}
                            {/* {(item.nickname) ? item.nickname : item.name} */}
                          </Text>
                          {(item.temp_id && item.temp_id !== '') ?
                            <Text
                              style={[
                                Styles.fontRegular,
                                Styles.textGray,
                                { textTransform: "capitalize" },
                              ]}
                            >
                              {item.temp_id}
                            </Text>
                            : <Text
                              style={[
                                Styles.fontRegular,
                                Styles.textGray,
                                { textTransform: "capitalize" },
                              ]}
                            >
                              {item.username}
                            </Text>}


                        </View>
                      </TouchableOpacity>


                    </View>

                  </View>
                </>
              )}
              keyExtractor={(item) => item.id.toString() + Math.random()}
            />
            <View style={[ Styles.centerText]}>
            <SmallButton onPress={() => {
                selectMultipleContacts()
                //this.setState({showCreateUser:true});
            }} label="Add" fontSize={12} btnStyle={{ width: '30%' }} />
            </View>
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
