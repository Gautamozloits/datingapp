import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import COLOR from "../styles/Color";
import { RFPercentage } from "react-native-responsive-fontsize";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export function PlayingCardsCircle(props) {
  const {
    that,
    size,
    symbolSize,
    style,
    onPress_A,
    onPress_K,
    onPress_Q,
    onPress_J,
    onPress_10,
    onPress_9,
    onPress_8,
    onPress_7,
    onPress_6,
    onPress_5,
    onPress_4,
    onPress_3,
    onPress_2,
    onPress_club,
    onPress_diamond,
    onPress_heart,
    onPress_spade,
    club,
    diamond,
    heart,
    spade,
    type,
    borderWidthParameter,
    allSelectedCardsLength,
  } = props;

  const angleRad = Math.PI / 180;
  const radius = size / 2;

  const cal_X = (value, divideValue = 0.42) => {
    var x;
    var angle = (360 / 13) * value;
    x = radius * Math.cos(angleRad * angle) - symbolSize / 2;
    return x;
  };

  const cal_Y = (value) => {
    var y;
    var angle = (360 / 13) * value;
    y = radius * Math.sin(angleRad * angle) - symbolSize / 2;
    return y;
  };

  const cal_I_X = (value) => {
    var y;
    var angle = (360 / 8) * value;
    y = radius * Math.cos(angleRad * angle) - symbolSize;
    return y / 2;
  };

  const cal_I_Y = (value) => {
    var y;
    var angle = (360 / 8) * value;
    y = radius * Math.sin(angleRad * angle) - symbolSize;
    return y / 2;
  };

  const selectableCards = (typeValue) => {
    if(typeValue!=""){var returnValue = false;
    var cardType = that.getSelectedCardType();
    var selectable = that.selectableCardNoOrNot(cardType, typeValue, "card");
    if (allSelectedCardsLength == 0 || selectable || cardType == "") {
      returnValue = true;
    }
    return returnValue;}
  };

  const selectableCardsType = (cardType) => {
    var returnValue = false;
    var selectable = that.selectableCardNoOrNot(cardType, type, "cardType");
    if (allSelectedCardsLength == 0 || selectable || type == "") {
      returnValue = true;
    }
    return returnValue;
  };

  return (
    <View
      style={[
        s.circle,
        {
          width: size + symbolSize * borderWidthParameter,
          height: size + symbolSize * borderWidthParameter,
          borderWidth: symbolSize * borderWidthParameter,
          borderRadius: size + symbolSize * borderWidthParameter,
          borderColor: COLOR.PRIMARY_DARK,
          marginVertical: RFPercentage(2),
          marginHorizontal: RFPercentage(1),
          alignSelf: "center",
        },
      ]}
    >
          {/* || !selectableCardsType(that.getSelectedCardType()) */}

      <View style={[s.circle]}>
      {(selectableCards("T") || type == "T") && 
        <TouchableOpacity
          style={[
            s.symbol,
            {
              backgroundColor:
                type == "T" ? COLOR.BG_COLOR : COLOR.PRIMARY_DARK,
              width: symbolSize,
              height: symbolSize,
              borderRadius: symbolSize / 2,
              left: cal_X(1),
              top: cal_Y(1),
              zIndex: 100,
            },
          ]}
          onPress={onPress_10}
        >
          <Text
            style={[
              s.textCenter,
              {
                color: type == "T" ? COLOR.PRIMARY_DARK : COLOR.bg_card,
                fontFamily: "Bold",
                fontWeight: "200",
                fontSize: RFPercentage(2),
              },
            ]}
          >
            10
          </Text>
        </TouchableOpacity>
      }

      {(selectableCards("9") || type == "9") && 
        <TouchableOpacity
          style={[
            s.symbol,
            {
              backgroundColor:
                type == "9" ? COLOR.BG_COLOR : COLOR.PRIMARY_DARK,
              width: symbolSize,
              height: symbolSize,
              borderRadius: symbolSize / 2,
              left: cal_X(2),
              top: cal_Y(2),
              zIndex: 100,
            },
          ]}
          onPress={onPress_9}
        >
          <Text
            style={[
              s.textCenter,
              {
                color: type == "9" ? COLOR.PRIMARY_DARK : COLOR.bg_card,
                fontFamily: "Bold",
                fontWeight: "200",
                fontSize: RFPercentage(2),
              },
            ]}
          >
            9
          </Text>
        </TouchableOpacity>
      }

      {(selectableCards("8") || type == "8") && 
        <TouchableOpacity
          style={[
            s.symbol,
            {
              backgroundColor:
                type == "8" ? COLOR.BG_COLOR : COLOR.PRIMARY_DARK,
              width: symbolSize,
              height: symbolSize,
              borderRadius: symbolSize / 2,
              left: cal_X(3),
              top: cal_Y(3),
              zIndex: 100,
            },
          ]}
          onPress={onPress_8}
        >
          <Text
            style={[
              s.textCenter,
              {
                color: type == "8" ? COLOR.PRIMARY_DARK : COLOR.bg_card,
                fontFamily: "Bold",
                fontWeight: "200",
                fontSize: RFPercentage(2),
              },
            ]}
          >
            8
          </Text>
        </TouchableOpacity>
      }

      {(selectableCards("7") || type == "7") && 
        <TouchableOpacity
          style={[
            s.symbol,
            {
              backgroundColor:
                type == "7" ? COLOR.BG_COLOR : COLOR.PRIMARY_DARK,
              width: symbolSize,
              height: symbolSize,
              borderRadius: symbolSize / 2,
              left: cal_X(4),
              top: cal_Y(4),
              zIndex: 100,
            },
          ]}
          onPress={onPress_7}
        >
          <Text
            style={[
              s.textCenter,
              {
                color: type == "7" ? COLOR.PRIMARY_DARK : COLOR.bg_card,
                fontFamily: "Bold",
                fontWeight: "200",
                fontSize: RFPercentage(2),
              },
            ]}
          >
            7
          </Text>
        </TouchableOpacity>
      }

      {(selectableCards("6") || type == "6") && 
        <TouchableOpacity
          style={[
            s.symbol,
            {
              backgroundColor:
                type == "6" ? COLOR.BG_COLOR : COLOR.PRIMARY_DARK,
              width: symbolSize,
              height: symbolSize,
              borderRadius: symbolSize / 2,
              left: cal_X(5),
              top: cal_Y(5),
              zIndex: 100,
            },
          ]}
          onPress={onPress_6}
        >
          <Text
            style={[
              s.textCenter,
              {
                color: type == "6" ? COLOR.PRIMARY_DARK : COLOR.bg_card,
                fontFamily: "Bold",
                fontWeight: "200",
                fontSize: RFPercentage(2),
              },
            ]}
          >
            6
          </Text>
        </TouchableOpacity>
      }

      {(selectableCards("5") || type == "5") && 
        <TouchableOpacity
          style={[
            s.symbol,
            {
              backgroundColor:
                type == "5" ? COLOR.BG_COLOR : COLOR.PRIMARY_DARK,
              width: symbolSize,
              height: symbolSize,
              borderRadius: symbolSize / 2,
              left: cal_X(6),
              top: cal_Y(6),
              zIndex: 100,
            },
          ]}
          onPress={onPress_5}
        >
          <Text
            style={[
              s.textCenter,
              {
                color: type == "5" ? COLOR.PRIMARY_DARK : COLOR.bg_card,
                fontFamily: "Bold",
                fontWeight: "200",
                fontSize: RFPercentage(2),
              },
            ]}
          >
            5
          </Text>
        </TouchableOpacity>
      }

      {(selectableCards("4") || type == "4") && 
        <TouchableOpacity
          style={[
            s.symbol,
            {
              backgroundColor:
                type == "4" ? COLOR.BG_COLOR : COLOR.PRIMARY_DARK,
              width: symbolSize,
              height: symbolSize,
              borderRadius: symbolSize / 2,
              left: cal_X(7),
              top: cal_Y(7),
              zIndex: 100,
            },
          ]}
          onPress={onPress_4}
        >
          <Text
            style={[
              s.textCenter,
              {
                color: type == "4" ? COLOR.PRIMARY_DARK : COLOR.bg_card,
                fontFamily: "Bold",
                fontWeight: "200",
                fontSize: RFPercentage(2),
              },
            ]}
          >
            4
          </Text>
        </TouchableOpacity>
      }

      {(selectableCards("3") || type == "3") && 
        <TouchableOpacity
          style={[
            s.symbol,
            {
              backgroundColor:
                type == "3" ? COLOR.BG_COLOR : COLOR.PRIMARY_DARK,
              width: symbolSize,
              height: symbolSize,
              borderRadius: symbolSize / 2,
              left: cal_X(8),
              top: cal_Y(8),
              zIndex: 100,
            },
          ]}
          onPress={onPress_3}
        >
          <Text
            style={[
              s.textCenter,
              {
                color: type == "3" ? COLOR.PRIMARY_DARK : COLOR.bg_card,
                fontFamily: "Bold",
                fontWeight: "200",
                fontSize: RFPercentage(2),
              },
            ]}
          >
            3
          </Text>
        </TouchableOpacity>
      }

      {(selectableCards("2") || type == "2") && 
        <TouchableOpacity
          style={[
            s.symbol,
            {
              backgroundColor:
                type == "2" ? COLOR.BG_COLOR : COLOR.PRIMARY_DARK,
              width: symbolSize,
              height: symbolSize,
              borderRadius: symbolSize / 2,
              left: cal_X(9),
              top: cal_Y(9),
              zIndex: 100,
            },
          ]}
          onPress={onPress_2}
        >
          <Text
            style={[
              s.textCenter,
              {
                color: type == "2" ? COLOR.PRIMARY_DARK : COLOR.bg_card,
                fontFamily: "Bold",
                fontWeight: "200",
                fontSize: RFPercentage(2),
              },
            ]}
          >
            2
          </Text>
        </TouchableOpacity>
      }

      {(selectableCards("A") || type == "A") && 
        <TouchableOpacity
          style={[
            s.symbol,
            {
              backgroundColor:
                type == "A" ? COLOR.BG_COLOR : COLOR.PRIMARY_DARK,
              width: symbolSize,
              height: symbolSize,
              borderRadius: symbolSize / 2,
              left: cal_X(10),
              top: cal_Y(10),
              zIndex: 100,
            },
          ]}
          onPress={onPress_A}
        >
          <Text
            style={[
              s.textCenter,
              {
                color: type == "A" ? COLOR.PRIMARY_DARK : COLOR.bg_card,
                fontFamily: "Bold",
                fontWeight: "200",
                fontSize: RFPercentage(2),
              },
            ]}
          >
            A
          </Text>
        </TouchableOpacity>
      }

      {(selectableCards("K") || type == "K") && 
        <TouchableOpacity
          style={[
            s.symbol,
            {
              backgroundColor:
                type == "K" ? COLOR.BG_COLOR : COLOR.PRIMARY_DARK,
              width: symbolSize,
              height: symbolSize,
              borderRadius: symbolSize / 2,
              left: cal_X(11),
              top: cal_Y(11),
              zIndex: 100,
            },
          ]}
          onPress={onPress_K}
        >
          <Text
            style={[
              s.textCenter,
              {
                color: type == "K" ? COLOR.PRIMARY_DARK : COLOR.bg_card,
                fontFamily: "Bold",
                fontWeight: "200",
                fontSize: RFPercentage(2),
              },
            ]}
          >
            K
          </Text>
        </TouchableOpacity>
      }

      {(selectableCards("Q") || type == "Q") && 
        <TouchableOpacity
          style={[
            s.symbol,
            {
              backgroundColor:
                type == "Q" ? COLOR.BG_COLOR : COLOR.PRIMARY_DARK,
              width: symbolSize,
              height: symbolSize,
              borderRadius: symbolSize / 2,
              left: cal_X(12),
              top: cal_Y(12),
              zIndex: 100,
            },
          ]}
          onPress={onPress_Q}
        >
          <Text
            style={[
              s.textCenter,
              {
                color: type == "Q" ? COLOR.PRIMARY_DARK : COLOR.bg_card,
                fontFamily: "Bold",
                fontWeight: "200",
                fontSize: RFPercentage(2),
              },
            ]}
          >
            Q
          </Text>
        </TouchableOpacity>
      }

      {(selectableCards("J") || type == "J") && 
        <TouchableOpacity
          style={[
            s.symbol,
            {
              backgroundColor:
                type == "J" ? COLOR.BG_COLOR : COLOR.PRIMARY_DARK,
              width: symbolSize,
              height: symbolSize,
              borderRadius: symbolSize / 2,
              left: cal_X(13),
              top: cal_Y(13),
              zIndex: 100,
            },
          ]}
          onPress={onPress_J}
        >
          <Text
            style={[
              s.textCenter,
              {
                color: type == "J" ? COLOR.PRIMARY_DARK : COLOR.bg_card,
                fontFamily: "Bold",
                fontWeight: "200",
                fontSize: RFPercentage(2),
              },
            ]}
          >
            J
          </Text>
        </TouchableOpacity>
      }

        <View
          style={[
            {
              width: size - symbolSize * borderWidthParameter,
              height: size - symbolSize * borderWidthParameter,
              borderRadius: size - symbolSize * borderWidthParameter,
              position: "absolute",
              backgroundColor: COLOR.WHITE,
              overflow: "hidden",
            },
          ]}
        >
          <View
            style={[
              {
                height: "50%",
                width: "100%",
                flexDirection: "row",
                // borderTopRightRadius: size - symbolSize * borderWidthParameter,
                // borderTopLeftRadius: size - symbolSize * borderWidthParameter,
                // backgroundColor: COLOR.WHITE,
                // overflow: "hidden",
              },
            ]}
          >
            <TouchableOpacity
              style={[
                {
                  flex: 1,
                  // borderColor: COLOR.WHITE,
                  backgroundColor: club || that.getSelectedCardType()=="c" ? COLOR.bg_card : COLOR.WHITE,
                  borderTopLeftRadius: Math.round(
                    (size - symbolSize * borderWidthParameter) / 2
                  ),
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                  overflow: "hidden",
                },
              ]}
              activeOpacity={1}
              onPress={onPress_club}
            >
              {/* club */}

              {club && (
                <>
                  <TouchableOpacity
                    style={[
                      {
                        height: (size - symbolSize * borderWidthParameter) / 4,
                        width: (size - symbolSize * borderWidthParameter) / 4,
                        // borderColor: COLOR.WHITE,
                        // borderLeftWidth: 1,
                        // borderTopWidth: 1,
                        // borderRightWidth:1,
                        // borderBottomWidth:1,
                        backgroundColor: COLOR.WHITE,
                        borderTopLeftRadius:
                          (size - symbolSize * borderWidthParameter) / 4,
                        overflow: "hidden",
                        zIndex: 100,
                      },
                    ]}
                    activeOpacity={1}
                  ></TouchableOpacity>
                </>
              )}

              {(selectableCardsType("c") 
              // || !selectableCards(type)
              || that.getSelectedCardType()=="c"
              ) &&
              <MaterialCommunityIcons
                name="cards-club"
                size={symbolSize}
                color={"black"}
                style={[
                  s.symbol,
                  {
                    left: (size - symbolSize * borderWidthParameter) / 8,
                    top: (size - symbolSize * borderWidthParameter) / 8,
                  },
                ]}
              />
              }
            </TouchableOpacity>

            {/* club,diamond */}
            {/* {(diamond || club) && (
              <View
                style={[
                  {
                    height:
                      (size - symbolSize * borderWidthParameter) / 2 -
                      (size - symbolSize * borderWidthParameter) / 4 +
                      1,
                    width: 1,
                    backgroundColor: COLOR.WHITE,
                    alignSelf: "flex-start",
                  },
                ]}
              ></View>
            )} */}

            <TouchableOpacity
              style={[
                {
                  flex: 1,
                  // borderColor: COLOR.WHITE,
                  backgroundColor: diamond || that.getSelectedCardType()=="d" ? COLOR.bg_card : COLOR.WHITE,
                  borderTopRightRadius:
                    size - symbolSize * borderWidthParameter,
                  alignItems: "flex-start",
                  justifyContent: "flex-end",
                  overflow: "hidden",
                },
              ]}
              onPress={onPress_diamond}
              activeOpacity={1}
            >
              {/* diamond */}
              {diamond && (
                <>
                  <TouchableOpacity
                    style={[
                      {
                        height: (size - symbolSize * borderWidthParameter) / 4,
                        width: (size - symbolSize * borderWidthParameter) / 4,
                        // borderColor: COLOR.WHITE,
                        // borderRightWidth: 1,
                        // borderTopWidth: 1,
                        backgroundColor: COLOR.WHITE,
                        borderTopRightRadius:
                          (size - symbolSize * borderWidthParameter) / 4,
                        overflow: "hidden",
                        zIndex: 100,
                      },
                    ]}
                    activeOpacity={1}
                  ></TouchableOpacity>
                </>
              )}
              {(selectableCardsType("d") 
              //  || !selectableCards(type)
              || that.getSelectedCardType()=="d"
              ) &&
              <MaterialCommunityIcons
                name="cards-diamond"
                size={symbolSize}
                color={"red"}
                style={[
                  s.symbol,
                  {
                    right: (size - symbolSize * borderWidthParameter) / 8,
                    top: (size - symbolSize * borderWidthParameter) / 8,
                  },
                ]}
              />
              }
            </TouchableOpacity>
          </View>

          {/* club,heart */}
          {/* {(club || heart) && (
            <View
              style={[
                {
                  height: 1,
                  width:
                    (size - symbolSize * borderWidthParameter) / 2 - (size - symbolSize * borderWidthParameter) / 4,
                  backgroundColor: COLOR.WHITE,
                  alignSelf: "flex-start",
                },
              ]}
            ></View>
          )} */}

          {/* diamond,spade */}
          {/* {(diamond || spade) && (
            <View
              style={[
                {
                  height: 1,
                  width:
                    (size - symbolSize * borderWidthParameter) / 2 - (size - symbolSize * borderWidthParameter) / 4,
                  backgroundColor: COLOR.WHITE,
                  alignSelf: "flex-end",
                },
              ]}
            ></View>
          )} */}

          <View
            style={[
              {
                height: "50%",
                width: "100%",
                flexDirection: "row",
                backgroundColor: COLOR.WHITE,
              },
            ]}
          >
            <TouchableOpacity
              style={[
                {
                  flex: 1,
                  // borderColor: COLOR.WHITE,
                  backgroundColor: heart || that.getSelectedCardType()=="h" ? COLOR.bg_card : COLOR.WHITE,
                  borderBottomLeftRadius:
                    size - symbolSize * borderWidthParameter,
                  alignItems: "flex-end",
                  justifyContent: "flex-start",
                  overflow: "hidden",
                },
              ]}
              onPress={onPress_heart}
              activeOpacity={1}
            >
              {/* heart */}
              {heart && (
                <TouchableOpacity
                  style={[
                    {
                      height: (size - symbolSize * borderWidthParameter) / 4,
                      width: (size - symbolSize * borderWidthParameter) / 4,
                      // borderColor: COLOR.WHITE,
                      // borderLeftWidth: 1,
                      // borderBottomWidth: 1,
                      backgroundColor: COLOR.WHITE,
                      borderBottomLeftRadius:
                        (size - symbolSize * borderWidthParameter) / 4,
                      overflow: "hidden",
                      zIndex: 1000,
                    },
                  ]}
                  activeOpacity={1}
                ></TouchableOpacity>
              )}

              {(selectableCardsType("h") 
             // || !selectableCards(type)
             || that.getSelectedCardType()=="h"
              ) &&
              <MaterialCommunityIcons
                name="cards-heart"
                size={symbolSize}
                color={"red"}
                style={[
                  s.symbol,
                  {
                    left: (size - symbolSize * borderWidthParameter) / 8,
                    bottom: (size - symbolSize * borderWidthParameter) / 8,
                  },
                ]}
              />
              }
            </TouchableOpacity>

            {/* heart,spade */}
            {/* {(heart || spade) && (
              <View
                style={[
                  {
                    height:
                      (size - symbolSize * borderWidthParameter) / 2 -
                      (size - symbolSize * borderWidthParameter) / 4 +
                      1,
                    width: 1,
                    backgroundColor: COLOR.WHITE,
                    alignSelf: "flex-end",
                  },
                ]}
              ></View>
            )} */}

            <TouchableOpacity
              style={[
                {
                  flex: 1,
                  // borderColor: COLOR.WHITE,
                  backgroundColor: spade || that.getSelectedCardType()=="s"  ? COLOR.bg_card : COLOR.WHITE,
                  borderBottomRightRadius:
                    size - symbolSize * borderWidthParameter,
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  overflow: "hidden",
                },
              ]}
              onPress={onPress_spade}
              activeOpacity={1}
            >
              {/* spade */}
              {spade && (
                <TouchableOpacity
                  style={[
                    {
                      height: (size - symbolSize * borderWidthParameter) / 4,
                      width: (size - symbolSize * borderWidthParameter) / 4,
                      // borderColor: COLOR.WHITE,
                      // borderRightWidth: 1,
                      // borderBottomWidth: 1,
                      backgroundColor: COLOR.WHITE,
                      borderBottomRightRadius:
                        (size - symbolSize * borderWidthParameter) / 4,
                      overflow: "hidden",
                      zIndex: 100,
                    },
                  ]}
                  activeOpacity={1}
                ></TouchableOpacity>
              )}
              {(selectableCardsType("s") 
            //  || !selectableCards(type)
            || that.getSelectedCardType()=="s"
              ) &&
              <MaterialCommunityIcons
                name="cards-spade"
                size={symbolSize}
                color={"black"}
                style={[
                  s.symbol,
                  {
                    right: (size - symbolSize * borderWidthParameter) / 8,
                    bottom: (size - symbolSize * borderWidthParameter) / 8,
                  },
                ]}
              />
              }
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  circle: {
    backgroundColor: COLOR.white,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
  },
  symbol: {
    backgroundColor: COLOR.themeColor,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  textCenter: {
    textAlign: "center",
    textAlignVertical: "center",
    alignSelf: "center",
  },
});
