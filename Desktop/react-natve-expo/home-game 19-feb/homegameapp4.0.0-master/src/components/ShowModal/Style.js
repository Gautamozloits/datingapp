import { StyleSheet } from "react-native";
import COLOR from "../../styles/Color";
import { RFPercentage } from "react-native-responsive-fontsize";

export const Style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  modalBackground: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: "#00000080",
  },
  innerContainer: {
    // alignItems: 'center',
    alignSelf: "center",
    width: "90%",
    backgroundColor: COLOR.WHITE,
    borderRadius: RFPercentage(1),
    paddingVertical: RFPercentage(1),
    // padding: RFPercentage(1),
    justifyContent: "center",
    maxHeight: RFPercentage(75),
    zIndex: 100,
  },
  input: {
    flex: 1,
    borderColor: "transparent",
    justifyContent: "center",
    color: COLOR.PRIMARY_DARK,
  },
  sideText: {
    color: COLOR.PRIMARY_DARK,
    marginLeft: RFPercentage(1),
  },
  flatListContainer: {
    flexDirection: "row",
    backgroundColor: "#E5ECF7",
    borderRadius: 5,
    marginBottom: 5,
    padding: 5,
    borderWidth: 0.5,
    borderColor: COLOR.PRIMARY_DARK,
  },
});
