import React, { useState } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  FlatList,
  Text,
  TextInput,
} from "react-native";
import { Style } from "./Style";
import { allCountry } from "../../../AllCountry";
import { RFPercentage } from "react-native-responsive-fontsize";

export function ShowModal(props) {
  const { showModal, that, type } = props;
  const [keyword, setKeyword] = useState("");
  const [data, setData] = useState(allCountry);

  function onSelect(item) {
    // alert(item.callingCodes[0])
    if (type == "country_code") {
      that.setState({
        countryCode: "+" + item.callingCodes[0],
        showModal: false,
        phone_number: "",
      });
    } else {
      that.setState({
        symbol: item.symbol[0].symbol,
        cur_name: item.symbol[0].name,
        showModal: false,
      });
    }
  }

  function searchFilterFunction(text) {
    setKeyword(text);
    const newData = allCountry.filter((item) => {
      const itemData = `${String(item.name).toUpperCase()}${
        item.callingCodes[0]
      }`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setData(newData);
  }

  return (
    <>
      <View style={Style.container}>
        <Modal
          transparent={true}
          animationType={"none"}
          visible={showModal}
          onRequestClose={() => {
            that.setState({ showModal: false });
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              that.setState({ showModal: false });
            }}
            style={Style.modalBackground}
          >
            <View style={[Style.innerContainer, {}]}>
              <TextInput
                returnKeyType={"done"}
                autoFocus={false}
                onChangeText={(text) => searchFilterFunction(text)}
                placeholder="Search Here..."
                value={keyword}
                style={{
                  //   borderWidth: 1,
                  borderColor: "#00000029",
                  height: 35,
                  width: "90%",
                  padding: 10,
                  borderRadius: 25,
                  color: "#77869E",
                  alignSelf: "center",
                }}
              />
              <FlatList
                style={[{ paddingHorizontal: RFPercentage(2) }]}
                data={data}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{}}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                      onSelect(item);
                    }}
                    style={[Style.flatListContainer]}
                  >
                    {/* <Text style={[{}]} numberOfLines={1} ellipsizeMode="tail" >{item.callingCodes[0]}</Text> */}
                    <Text
                      style={[Style.input]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.flag + "  " + item.name}
                    </Text>
                    <Text
                      style={[Style.sideText]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {type == "country_code"
                        ? "+" + item.callingCodes[0]
                        : item.symbol[0].symbol}
                    </Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.name}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </>
  );
}

// <ShowModal that={this} showModal={showModal} />
