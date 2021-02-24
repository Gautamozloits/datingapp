"use strict";
import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { postData, getData, getUserDetail } from "../../api/service";
import COLOR from "../../styles/Color";
import Styles from "../../styles/Styles";
import Images from "../../../constants/Images";
import ContainerFixScreen from "../Views/ContainerFixScreen";
import {
  HeaderBG,
  HeaderLeft,
  HeaderOddsCalculator,
  HeaderLeftBack,
} from "../../components/HeaderOptions";
const { width, height } = Dimensions.get("window");
import { calculateEquity } from "poker-odds";
import { PlayingCardsCircle } from "../../components/PlayingCardsCircle";
import { ProgressBar, Colors } from "react-native-paper";
import { Feather, MaterialIcons, AntDesign } from "@expo/vector-icons";
import { SwipeListView, SwipeRow } from "react-native-swipe-list-view";
import { SmallButton, SwipeBtn } from "../../components/Buttons/Button";
import { Loader } from '../../components/Loader';

export default class OddsCalc extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => (
        <Text style={Styles.headerTitle}>Odds Calculator</Text>
      ),
      headerTitleAlign: "center",
      headerBackground: () => <HeaderBG />,
      headerBackImage: () => <HeaderLeftBack />,
      headerRight: () => (
        <HeaderOddsCalculator
          onPress={() => { }}
          addPlayers={navigation.getParam("addPlayers")}
        />
      ),
      headerBackTitle: " ",
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      club: false,
      diamond: false,
      heart: false,
      spade: false,
      type: "",
      listRecords: [],
      boardList: [
        { status: true, value: "" },
        { status: false, value: "" },
        { status: false, value: "" },
        { status: false, value: "" },
        { status: false, value: "" },
      ],
      noOfPlayers: 2,
      selectedPlayerIndex: 0,
      setBoard: false,
      boardSelected: true,
      currentBoardIndex: 0,
      card1Selected: true,
      allSelected: false,
      showCardSelector: true,
      refreshing: false,
      allSelectedCards: [],
      players: [
        {
          name: "P1",
          card1: { status: false, value: "" },
          card2: { status: false, value: "" },
          result: { win: 0, loss: 0, tie: 0, outs: 0 },
          allCardSelected: false,
        },
        {
          name: "P2",
          card1: { status: false, value: "" },
          card2: { status: false, value: "" },
          result: { win: 0, loss: 0, tie: 0, outs: 0 },
          allCardSelected: false,
        },
      ],
      showIndicator: false,
    };
  }

  resetAll = () => {
    this.setState({
      club: false,
      diamond: false,
      heart: false,
      spade: false,
      type: "",
      listRecords: [],
      boardList: [
        { status: true, value: "" },
        { status: false, value: "" },
        { status: false, value: "" },
        { status: false, value: "" },
        { status: false, value: "" },
      ],
      noOfPlayers: 2,
      selectedPlayerIndex: 0,
      setBoard: false,
      boardSelected: true,
      currentBoardIndex: 0,
      card1Selected: true,
      allSelected: false,
      showCardSelector: true,
      refreshing: false,
      allSelectedCards: [],
      players: [
        {
          name: "P1",
          card1: { status: false, value: "" },
          card2: { status: false, value: "" },
          result: { win: 0, loss: 0, tie: 0, outs: 0 },
          allCardSelected: false,
        },
        {
          name: "P2",
          card1: { status: false, value: "" },
          card2: { status: false, value: "" },
          result: { win: 0, loss: 0, tie: 0, outs: 0 },
          allCardSelected: false,
        },
      ],
    });
  };

  resetCurrent = () => {
    const {
      selectedPlayerIndex,
      boardSelected,
      currentBoardIndex,
      card1Selected,
      boardList,
      players,
      setBoard,
    } = this.state;
    var list = [];
    this.setState({
      club: false,
      diamond: false,
      heart: false,
      spade: false,
      type: "",
    });
    var callCal = false;
    if (boardSelected) {
      list = boardList;
      list[currentBoardIndex].value = "";
      var selectedBoardCardsNo = 0
      list.map((item) => {
        if (item.value) {
          selectedBoardCardsNo = selectedBoardCardsNo + 1;
        }
      });
      if (selectedBoardCardsNo > 2) {
        this.setState({ setBoard: true });
      } else {
        this.setState({ setBoard: false });
      }
      this.setState({
        boardList: list,
      });
      players.map((item, index) => {
        if (item.card1.value && item.card2.value) {
          callCal = true;
        }
      });
      if (callCal) {
        this.pokerOdds();
      }
    } else {
      list = players;
      var player = list[selectedPlayerIndex];
      if (card1Selected) {
        player.card1.value = "";
      } else {
        player.card2.value = "";
      }
      player.result.loss = 0
      player.result.outs = 0
      player.result.tie = 0
      player.result.win = 0
      list[selectedPlayerIndex] = player;
      list.map((item, index) => {
        if (item.card1.value && item.card2.value) {
          callCal = true;
        }
      });
      this.setState({
        players: list,
      });
      this.setState({ players: list }, () => {
        setTimeout(() => {
          if (callCal) {
            this.pokerOdds();
          }
        }, 100)
      })
    }
  };

  componentDidMount() {
    this.props.navigation.setParams({ addPlayers: this.addPlayers });
  }

  pokerOdds = () => {
    this.setState({ showIndicator: true })
    var result = [];
    var board = [];
    const { boardList, players } = this.state;
    let i = 0;
    if (this.boardSelectedOrNot()) {
      boardList.map((item, index) => {
        if (
          typeof item.value != "undefined" &&
          item.value != null &&
          item.value != "" &&
          item.value.length != 0
        ) {
          board[i] = item.value;
          i++;
        }
      });
    }
    var playerList = [];
    let j = 0;
    players.map((item, index) => {
      var p = [];
      if (item.card1.value && item.card2.value) {
        p[0] = item.card1.value;
        p[1] = item.card2.value;
        playerList[j] = p;
        j++;
      }
    });
    if (playerList && playerList.length) {
      result = calculateEquity(playerList, board);
      this.setResultPokerOdds(result);
    }
  };

  setResultPokerOdds = (result) => {
    const { players, selectedPlayerIndex } = this.state;
    var list = players;
    list.map((item, index) => {
      if (!item.card1.value || !item.card2.value) {
        list[index].result.loss = 0
        list[index].result.outs = 0
        list[index].result.tie = 0
        list[index].result.win = 0
        result.splice(index, 0, list[index])
      }
    });
    result.map((item, index) => {
      if (item && item != "undefined" && item.count != 2) {
        var win;
        var tie;
        var loss
        if (item.wins != 0) {
          win = this.roundValue((item.wins * 100) / item.count, 2);
        } else {
          win = 0;
        }
        if (item.ties != 0) {
          tie = this.roundValue((item.ties * 100) / item.count, 2);
        } else {
          tie = 0;
        }
        if (win != 0 && tie != 0) {
          loss = this.roundValue(Number(100 - (win + tie)), 2);
        } else {
          loss = 0;
        }
        if (list[index].result) {
          list[index].result.win = win;
          list[index].result.tie = tie;
          list[index].result.loss = loss;
        }
      }
    });
    this.setState({ players: list, showIndicator: false });
  };

  pokerOddsCalculator = () => {
    const { boardList, players } = this.state;
    var boardSt = "";
    var result;
    boardList.map((item, index) => {
      if (
        typeof item.value != "undefined" &&
        item.value != null &&
        item.value != "" &&
        item.value.length != 0
      ) {
        boardSt = boardSt + item.value;
      }
    });
    var playerList = [];
    players.map((item, index) => {
      if (
        typeof item.card1.value != "undefined" &&
        item.card1.value != null &&
        item.card1.value != "" &&
        item.card1.value.length != 0 &&
        typeof item.card2.value != "undefined" &&
        item.card2.value != null &&
        item.card2.value != "" &&
        item.card2.value != 0
      ) {
        playerList[index] = CardGroup.fromString(
          item.card1.value + item.card2.value
        );
      }
    });
    if (playerList && playerList.length) {
      result = OddsCalculator.calculate(
        playerList,
        CardGroup.fromString(boardSt)
      );
    }
    // this.setResultOddsCalculator(result);
  };

  setResultOddsCalculator = (result) => {
    const { players } = this.state;
    var list = players;
    result.equities.map((item, index) => {
      if (item && item != "undefined" && item.possibleHandsCount != 0) {
        var win;
        var tie;
        if (item.bestHandCount != 0) {
          win = this.roundValue(
            (item.bestHandCount * 100) / item.possibleHandsCount,
            0
          );
        } else {
          win = 0;
        }
        if (item.tieHandCount != 0) {
          tie = this.roundValue(
            (item.tieHandCount * 100) / item.possibleHandsCount,
            0
          );
        } else {
          tie = 0;
        }
        var loss = 100 - (win + tie);
        list[index].result.win = win;
        list[index].result.tie = tie;
        list[index].result.loss = loss;
      }
    });
    this.setState({ players: list });
  };

  roundValue = (value, precision) => {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  };

  setSelectedCards = () => {
    const { boardList, players } = this.state;
    var allSelectedCardsIndex = 0;
    var allSelectedCardsTemp = [];
    boardList.map((item, index) => {
      if (item.value) {
        allSelectedCardsTemp[allSelectedCardsIndex] = item.value;
        allSelectedCardsIndex = allSelectedCardsIndex + 1;
      }
    });
    players.map((item, index) => {
      if (item.card1.value) {
        allSelectedCardsTemp[allSelectedCardsIndex] = item.card1.value;
        allSelectedCardsIndex = allSelectedCardsIndex + 1;
      }
      if (item.card2.value) {
        allSelectedCardsTemp[allSelectedCardsIndex] = item.card2.value;
        allSelectedCardsIndex = allSelectedCardsIndex + 1;
      }
    });
    this.setState({ allSelectedCards: allSelectedCardsTemp });
  };

  changeBoardList = (position) => {
    const { boardList, players } = this.state;
    var cardType = "";
    var card = "";
    var list = boardList;
    // list[position].status = true;
    // list[position].status = !list[position].status;
    var allSelectedCardsIndex = 0;
    var allSelectedCardsTemp = [];
    list.map((item, index) => {
      if (position == index) {
        list[position].status = true;
        if (list[position].value) {
          var selectedCard = list[position].value.slice();
          card = selectedCard[0];
          cardType = selectedCard[1];
        }
      } else {
        list[index].status = false;
      }
      if (list[index].value) {
        allSelectedCardsTemp[allSelectedCardsIndex] = list[index].value;
        allSelectedCardsIndex = allSelectedCardsIndex + 1;
      }
    });
    var playerList = players;
    playerList.map((item, index) => {
      playerList[index].card1.status = false;
      playerList[index].card2.status = false;
      if (item.card1.value) {
        allSelectedCardsTemp[allSelectedCardsIndex] = item.card1.value;
        allSelectedCardsIndex = allSelectedCardsIndex + 1;
      }
      if (item.card2.value) {
        allSelectedCardsTemp[allSelectedCardsIndex] = item.card2.value;
        allSelectedCardsIndex = allSelectedCardsIndex + 1;
      }
    });
    this.setState({
      boardList: list,
      players: playerList,
      currentBoardIndex: position,
      boardSelected: true,
      allSelectedCards: allSelectedCardsTemp,
    });
    if (card && cardType) {
      this.setState({ type: card });
      this.changeCardType(cardType);
    } else {
      this.setState({
        type: "",
        club: false,
        heart: false,
        diamond: false,
        spade: false,
      });
    }
  };

  changePlayerList = (position, card1Selected) => {
    const { players, setBoard, boardList } = this.state;
    var cardType = "";
    var card = "";
    // if (!setBoard) {
    //   // alert("Please select at least three board cards first!");
    // } else {
    var list = players;
    var setCard1;
    var allSelectedCardsIndex = 0;
    var allSelectedCardsTemp = [];
    // if (card1Selected) {
    //   list[position].card1.status = true;
    //   list[position].card2.status = false;
    //   setCard1 = true;
    // } else {
    //   list[position].card1.status = false;
    //   list[position].card2.status = true;
    //   setCard1 = false;
    // }
    list.map((item, index) => {
      if (position == index) {
        if (card1Selected) {
          list[position].card1.status = true;
          list[position].card2.status = false;
          setCard1 = true;
          if (list[position].card1.value) {
            var selectedCard = list[position].card1.value.slice();
            card = selectedCard[0];
            cardType = selectedCard[1];
          }
        } else {
          list[position].card1.status = false;
          list[position].card2.status = true;
          setCard1 = false;
          if (list[position].card2.value) {
            var selectedCard = list[position].card2.value.slice();
            card = selectedCard[0];
            cardType = selectedCard[1];
          }
        }
      } else {
        list[index].card1.status = false;
        list[index].card2.status = false;
      }
      if (item.card1.value) {
        allSelectedCardsTemp[allSelectedCardsIndex] = item.card1.value;
        allSelectedCardsIndex = allSelectedCardsIndex + 1;
      }
      if (item.card2.value) {
        allSelectedCardsTemp[allSelectedCardsIndex] = item.card2.value;
        allSelectedCardsIndex = allSelectedCardsIndex + 1;
      }
    });
    var boardListTemp = boardList;
    boardListTemp.map((item, index) => {
      boardListTemp[index].status = false;
      if (boardListTemp[index].value) {
        allSelectedCardsTemp[allSelectedCardsIndex] =
          boardListTemp[index].value;
        allSelectedCardsIndex = allSelectedCardsIndex + 1;
      }
    });
    this.setState({
      boardList: boardListTemp,
      players: list,
      boardSelected: false,
      selectedPlayerIndex: position,
      card1Selected: setCard1,
      allSelectedCards: allSelectedCardsTemp,
    });
    if (card && cardType) {
      this.setState({ type: card });
      this.changeCardType(cardType);
    } else {
      this.setState({
        type: "",
        club: false,
        heart: false,
        diamond: false,
        spade: false,
      });
    }
    // }
  };

  addPlayers = () => {
    const { noOfPlayers, players } = this.state;
    if (noOfPlayers > 22) {
      alert("You can't add more than 23 players");
    } else {
      var list = players;
      var value = noOfPlayers + 1;
      list[noOfPlayers] = {
        name: "P" + value,
        card1: { status: false, value: "" },
        card2: { status: false, value: "" },
        result: { win: 0, loss: 0, tie: 0, outs: 0 },
        allCardSelected: false,
      };
      this.setState({ players: list, noOfPlayers: value });
    }
  };

  removeElement = (array, elem) => {
    var index = array.indexOf(elem);
    if (index > -1) {
      array.splice(index, 1);
    }
  };

  removePlayers = (index) => {
    const { noOfPlayers, players } = this.state;
    if (noOfPlayers > 2) {
      var list = players;
      var value = noOfPlayers - 1;
      // list.pop();
      var index = list.indexOf(list[index]);
      if (index > -1) {
        list.splice(index, 1);
      }
      this.setState({
        players: list,
        noOfPlayers: value,
        selectedPlayerIndex: index == 0 ? 0 : index - 1,
        card1Selected: true,
      });
      var callCal = false;
      players.map((item, index) => {
        if (item.card1.value && item.card2.value) {
          callCal = true;
        }
      });
      if (callCal) {
        this.pokerOdds();
      }
    } else {
      alert("For calculation, minimum two players are required.");
    }
  };

  onCardSelect = (typeValue, cardType) => {
    var selectedBoardCardsNo = 0;
    const {
      boardSelected,
      currentBoardIndex,
      boardList,
      selectedPlayerIndex,
      players,
      card1Selected,
    } = this.state;
    if (typeValue && cardType) {
      var list = boardList;
      if (boardSelected) {
        list[currentBoardIndex].value = typeValue + cardType + "";
        list[currentBoardIndex].status = true;
        boardList.map((item) => {
          if (item.value) {
            selectedBoardCardsNo = selectedBoardCardsNo + 1;
          }
        });
        if (selectedBoardCardsNo > 2) {
          this.setState({ setBoard: true });
        }
        this.setState({ boardList: list });
        var callCal = false;
        players.map((item, index) => {
          if (item.card1.value && item.card2.value) {
            callCal = true;
          }
        });
        if (callCal) {
          this.pokerOdds();
        }
      } else {
        let list = players;
        if (card1Selected) {
          list[selectedPlayerIndex].card1.value = typeValue + cardType + "";
          list[selectedPlayerIndex].card1.status = true;
        } else {
          list[selectedPlayerIndex].card2.value = typeValue + cardType + "";
          list[selectedPlayerIndex].card2.status = true;
        }
        if (
          list[selectedPlayerIndex].card1.value &&
          list[selectedPlayerIndex].card2.value
        ) {
          list[selectedPlayerIndex].allCardSelected = true;
        }
        if (list[selectedPlayerIndex].allCardSelected) {
          this.setState({ players: list }, () => {
            setTimeout(() => {
              this.pokerOdds()
            }, 200)
          })
        } else {
          this.setState({ players: list });
        }

      }
    }
    this.setSelectedCards();
  };

  selectableCardNoOrNot = (cardType, typeValue, type) => {
    const { allSelectedCards } = this.state;
    var cList = [];
    var dList = [];
    var hList = [];
    var sList = [];
    var cIndex = 0;
    var dIndex = 0;
    var hIndex = 0;
    var sIndex = 0;
    var selectable = false;
    var selectableCardType = true;

    allSelectedCards.map((item, index) => {
      var card = item.slice();
      if (card[1] == "c") {
        cList[cIndex] = card[0];
        cIndex = cIndex + 1;
      } else if (card[1] == "d") {
        dList[dIndex] = card[0];
        dIndex = dIndex + 1;
      } else if (card[1] == "h") {
        hList[hIndex] = card[0];
        hIndex = hIndex + 1;
      } else if (card[1] == "s") {
        sList[sIndex] = card[0];
        sIndex = sIndex + 1;
      }
    });

    if (cardType == "c") {
      const found = cList.find((element) => element == typeValue);
      if (typeof found == "undefined") {
        selectable = true;
      } else {
        selectableCardType = false;
      }
    } else if (cardType == "d") {
      const found = dList.find((element) => element == typeValue);
      if (typeof found == "undefined") {
        selectable = true;
      } else {
        selectableCardType = false;
      }
    } else if (cardType == "h") {
      const found = hList.find((element) => element == typeValue);
      if (typeof found == "undefined") {
        selectable = true;
      } else {
        selectableCardType = false;
      }
    } else if (cardType == "s") {
      const found = sList.find((element) => element == typeValue);
      if (typeof found == "undefined") {
        selectable = true;
      } else {
        selectableCardType = false;
      }
    }

    if (type == "card") {
      return selectable;
    } else {
      return selectableCardType;
    }
  };

  onCardNumberSelect = (typeValue) => {
    this.setSelectedCards();
    setTimeout(() => {
      const { allSelectedCards } = this.state;
      var cardType = this.getSelectedCardType();
      var selectable = this.selectableCardNoOrNot(cardType, typeValue, "card");
      if (allSelectedCards.length == 0 || selectable || cardType == "") {
        this.setState({ type: typeValue });
        this.onCardSelect(typeValue, cardType);
      }
    }, 50);
  };

  onCardTypeSelect = (cardType) => {
    this.setSelectedCards();
    setTimeout(() => {
      const { allSelectedCards, type } = this.state;
      var selectable = this.selectableCardNoOrNot(cardType, type, "cardType");
      if (allSelectedCards.length == 0 || selectable || type == "") {
        this.changeCardType(cardType);
        this.onCardSelect(type, cardType);
      }
    }, 50);
  };

  changeCardType = (cardType) => {
    var club = false;
    var diamond = false;
    var heart = false;
    var spade = false;
    if (cardType == "c") {
      club = true;
    } else if (cardType == "d") {
      diamond = true;
    } else if (cardType == "h") {
      heart = true;
    } else if (cardType == "s") {
      spade = true;
    }
    this.setState({
      club: club,
      diamond: diamond,
      heart: heart,
      spade: spade,
    });
  };

  getSelectedCardType = () => {
    const { club, heart, spade, diamond } = this.state;
    var cardType = "";
    if (club) {
      cardType = "c";
    } else if (heart) {
      cardType = "h";
    } else if (spade) {
      cardType = "s";
    } else if (diamond) {
      cardType = "d";
    }
    return cardType;
  };

  boardSelectedOrNot = () => {
    const { boardList, setBoard } = this.state;
    var returnValue = true;
    var lastSelectedIndex = 0;
    boardList.map((item, index) => {
      if (item.value) {
        lastSelectedIndex = index;
      }
    });
    for (let i = 0; i < lastSelectedIndex; i++) {
      if (boardList[i].value == "") {
        returnValue = false;
      }
    }
    return returnValue && setBoard;
  };

  leftArrow = () => {
    const {
      selectedPlayerIndex,
      boardSelected,
      currentBoardIndex,
      card1Selected,
      players,
    } = this.state;
    var index = currentBoardIndex - 1;
    var playerMinus = selectedPlayerIndex - 1;
    if (boardSelected) {
      if (currentBoardIndex != 0) {
        this.setState({ currentBoardIndex: index });
        this.changeBoardList(index);
      } else {
        // this.setState({ currentBoardIndex: 4 });
        // this.changeBoardList(4);
        this.setState({
          boardSelected: false,
          selectedPlayerIndex: players.length - 1,
          card1Selected: false,
        });
        this.changePlayerList(players.length - 1, false);
      }
    } else {
      if (!card1Selected) {
        this.setState({
          card1Selected: !card1Selected,
          selectedPlayerIndex: selectedPlayerIndex,
        });
        this.changePlayerList(selectedPlayerIndex, !card1Selected);
      } else {
        if (playerMinus > -1) {
          this.setState({
            card1Selected: false,
            selectedPlayerIndex: playerMinus,
          });
          this.changePlayerList(playerMinus, false);
        } else {
          this.setState({ currentBoardIndex: 4, boardSelected: true });
          this.changeBoardList(4);
        }
      }
    }
  };

  rightArrow = () => {
    const {
      selectedPlayerIndex,
      boardSelected,
      currentBoardIndex,
      card1Selected,
      players,
    } = this.state;
    var index = currentBoardIndex + 1;
    var playerPlus = selectedPlayerIndex + 1;
    if (boardSelected) {
      if (currentBoardIndex != 4) {
        this.setState({ currentBoardIndex: index });
        this.changeBoardList(index);
      } else {
        // this.setState({ currentBoardIndex: 0 });
        // this.changeBoardList(0);
        this.setState({
          boardSelected: false,
          selectedPlayerIndex: 0,
          card1Selected: true,
        });
        this.changePlayerList(0, true);
      }
    } else {
      if (card1Selected) {
        this.setState({
          card1Selected: !card1Selected,
          selectedPlayerIndex: selectedPlayerIndex,
        });
        this.changePlayerList(selectedPlayerIndex, !card1Selected);
      } else {
        if (playerPlus < players.length) {
          this.setState({
            card1Selected: true,
            selectedPlayerIndex: playerPlus,
          });
          this.changePlayerList(playerPlus, true);
        } else {
          this.setState({ currentBoardIndex: 0, boardSelected: true });
          this.changeBoardList(0);
        }
      }
    }
  };

  // Design

  renderCard = (item, index) => {
    const { listRecords } = this.state;
    return (
      <View style={{ flex: 1 }} key={index}>
        <View style={[styles.box]}>
          <View style={[Styles.tbCol, { width: "70%" }]}>
            <Text
              style={[Styles.fontRegular, Styles.font16, Styles.textPrimary]}
            >
              {item.title}
            </Text>
          </View>
          <View
            style={[Styles.tbCol, { width: "30%", alignItems: "flex-end" }]}
          >
            <Text
              style={[
                Styles.fontRegular,
                Styles.font16,
                Styles.textGrayDark,
                Styles[item.color],
              ]}
            >
              {item.value}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  progressText = (title, value) => {
    var tempValue = value ? value : 0
    return (
      <View style={[{ width: "90%" }]}>
        <View style={[{ flexDirection: "row", alignItems: "center" }]}>
          <Text style={[styles.progressText, { flex: 1 }]}>{title}</Text>
          <Text style={[styles.progressText]}>{tempValue} %</Text>
        </View>
        <ProgressBar
          progress={tempValue / 100}
          color={COLOR.PRIMARY_DARK}
          style={[
            {
              width: "100%",
              height: 2,
              marginVertical: 2,
              marginBottom: title == "Outs" ? 5 : 0,
              // marginTop: title == "Win" && 5,
            },
          ]}
        />
      </View>
    );
  };

  player = (item, index) => {
    const { players, setBoard, boardSelected } = this.state;
    return (
      <View
        key={index}
        style={[
          styles.roundModal,
          {
            width: "100%",
            flexDirection: "row",
            height: RFPercentage(11),
            // justifyContent: "space-evenly",
            marginHorizontal: 20,
            // alignItems: "center",
            alignSelf: "center",
          },
        ]}
      >
        <View style={[styles.roundButtonContainer]}>
          <Text style={[styles.roundButton]}>P{Number(index + 1)}</Text>
        </View>

        <View
          style={[
            {
              alignItems: "baseline",
              justifyContent: "center",
            },
          ]}
        >
          <View
            style={[
              {
                width: "95%",
                flexDirection: "row",
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                this.changePlayerList(index, true);
                // !setBoard
                //   ? alert("Please select at least three board cards first!")
                //   : this.changePlayerList(index, true);
                // !setBoard
                //   ? alert("Please select at least three board cards first!")
                //   : index == 0
                //   ? this.changePlayerList(index)
                //   : players[index - 1].card2.value
                //   ? this.changePlayerList(index)
                //   : alert("Please select card for previous player first!");
                this.setState({ card1Selected: true });
              }}
              style={[{ marginRight: RFPercentage(1) }]}
            >
              <Image

                resizeMethod={"auto"}
                source={
                  players[index].card1.status || players[index].card1.value
                    ? players[index].card1.value
                      ? Images["card_" + players[index].card1.value]
                      : Images.card
                    : Images.unselected_card
                }
                style={[
                  Styles.cardSize,
                  players[index].card1.value &&
                  players[index].card1.status &&
                  !boardSelected &&
                  styles.selectedCard,
                ]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                // players[index].card1.value
                //   ? this.changePlayerList(index)
                //   : alert("Please select card 1 first!");
                this.changePlayerList(index, false);
                this.setState({ card1Selected: false });
              }}
              style={[{}]}
            >
              <Image

                resizeMethod={"auto"}
                source={
                  players[index].card2.status || players[index].card2.value
                    ? players[index].card2.value
                      ? Images["card_" + players[index].card2.value]
                      : Images.card
                    : Images.unselected_card
                }
                style={[
                  Styles.cardSize,
                  players[index].card2.value &&
                  players[index].card2.status &&
                  !boardSelected &&
                  styles.selectedCard,
                  { marginRight: RFPercentage(1) },
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* <View
          style={{
            borderStyle: "dashed",
            borderWidth: 0.2,
            height: "100%",
            borderColor: COLOR.GRAY,
          }}
        ></View> */}

        <View style={styles.borderVertical}>
          <Image source={Images.verticalLine} resizeMode="contain" style={{ width: RFPercentage(1), height: '100%' }} />
        </View>

        <View
          style={[
            {
              margin: 5,
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
            },
          ]}
        >
          {this.progressText("Win", item.result.win)}
          {this.progressText("Lose", item.result.loss)}
          {this.progressText("Tie", item.result.tie)}
          {/* {this.progressText("Outs", item.result.outs)} */}
        </View>
      </View>
    );
  };

  renderList = () => {
    const {
      club,
      diamond,
      heart,
      spade,
      type,
      boardList,
      players,
      selectedPlayerIndex,
      boardSelected,
      currentBoardIndex,
      card1Selected,
      showCardSelector,
      refreshing,
      allSelectedCards,
    } = this.state;

    return (
      <View
        style={[
          styles.content,
          { backgroundColor: COLOR.bg_gray, paddingTop: 20 },
        ]}
      >
        <View style={[{ paddingHorizontal: 20, alignItems: "center" }]}>
          <View
            style={[styles.roundModal, { width: "100%", flexDirection: "row" }]}
          >
            <View style={[styles.roundButtonContainer]}>
              <Text style={[styles.roundButton]}>B</Text>
            </View>
            <View
              style={[
                {
                  // width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-around",
                  paddingVertical: RFPercentage(1),
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  this.changeBoardList(0);
                }}
                activeOpacity={1}
                style={[{ marginRight: RFPercentage(1) }]}
              >
                <Image
                  source={
                    boardList[0].status || boardList[0].value
                      ? boardList[0].value
                        ? Images["card_" + boardList[0].value]
                        : Images.card
                      : Images.unselected_card
                  }
                  style={[
                    Styles.cardSize,
                    boardList[0].value &&
                    boardList[0].status &&
                    boardSelected &&
                    styles.selectedCard,
                  ]}

                  resizeMethod={"auto"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  // boardList[0].value
                  //   ? this.changeBoardList(1)
                  //   : alert("Please select previous card first!");
                  this.changeBoardList(1);
                }}
                activeOpacity={1}
                style={[{ marginRight: RFPercentage(1) }]}
              >
                <Image
                  source={
                    boardList[1].status || boardList[1].value
                      ? boardList[1].value
                        ? Images["card_" + boardList[1].value]
                        : Images.card
                      : Images.unselected_card
                  }
                  style={[
                    Styles.cardSize,
                    boardList[1].value &&
                    boardList[1].status &&
                    boardSelected &&
                    styles.selectedCard,
                  ]}

                  resizeMethod={"auto"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  // boardList[1].value
                  //   ? this.changeBoardList(2)
                  //   : alert("Please select previous card first!");
                  this.changeBoardList(2);
                }}
                activeOpacity={1}
                style={[{ marginRight: RFPercentage(3) }]}
              >
                <Image
                  source={
                    boardList[2].status || boardList[2].value
                      ? boardList[2].value
                        ? Images["card_" + boardList[2].value]
                        : Images.card
                      : Images.unselected_card
                  }
                  style={[
                    Styles.cardSize,
                    boardList[2].value &&
                    boardList[2].status &&
                    boardSelected &&
                    styles.selectedCard,
                  ]}

                  resizeMethod={"auto"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  // boardList[2].value
                  //   ? this.changeBoardList(3)
                  //   : alert("Please select previous card first!");
                  this.changeBoardList(3);
                }}
                activeOpacity={1}
                style={[{ marginRight: RFPercentage(3) }]}
              >
                <Image
                  source={
                    boardList[3].status || boardList[3].value
                      ? boardList[3].value
                        ? Images["card_" + boardList[3].value]
                        : Images.card
                      : Images.unselected_card
                  }
                  style={[
                    Styles.cardSize,
                    boardList[3].value &&
                    boardList[3].status &&
                    boardSelected &&
                    styles.selectedCard,
                  ]}

                  resizeMethod={"auto"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  // boardList[3].value
                  //   ? this.changeBoardList(4)
                  //   : alert("Please select previous card first!");
                  this.changeBoardList(4);
                }}
                activeOpacity={1}
                style={[{}]}
              >
                <Image
                  source={
                    boardList[4].status || boardList[4].value
                      ? boardList[4].value
                        ? Images["card_" + boardList[4].value]
                        : Images.card
                      : Images.unselected_card
                  }
                  style={[
                    Styles.cardSize,
                    boardList[4].value &&
                    boardList[4].status &&
                    boardSelected &&
                    styles.selectedCard,
                  ]}

                  resizeMethod={"auto"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <SwipeListView
          keyExtractor={(rowData, index) => {
            return index + Math.random();
          }}
          showsVerticalScrollIndicator={false}
          style={[
            {
              // maxHeight: !showCardSelector
              //   ? RFPercentage(100)
              //   : RFPercentage(25),
              // minHeight: RFPercentage(10),
              width: "100%",
              marginBottom: RFPercentage(0.5),
              alignSelf: "center",
            },
          ]}
          contentContainerStyle={[{ paddingHorizontal: 20 }]}
          data={players}
          rightOpenValue={-RFPercentage(12)}
          disableLeftSwipe={false}
          renderItem={(data, index) => this.player(data.item, data.index)}
          renderHiddenItem={(data, rowMap) => (
            <View
              style={[
                styles.roundModal,
                {
                  flexDirection: "row",
                  backgroundColor: COLOR.PRIMARY_LIGHT,
                  height: RFPercentage(11),
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "flex-end",
                  alignContent: "flex-end",
                },
              ]}
            >
              <SwipeBtn
                onPress={() => {
                  this.removePlayers(data.index);
                }}
                image={Images.deleteIcon}
                label="Remove"
                fontSize={1.4}
                btnStyle={{
                  width: RFPercentage(10),
                  justifyContent: "center",
                  alignSelf: "flex-end",
                  marginRight: RFPercentage(1),
                }}
              />
              {/* <TouchableOpacity
                style={[
                  {
                    flex: 1,
                    alignItems: "flex-end",
                    alignSelf: "center",
                  },
                ]}
                onPress={() => {
                  this.removePlayers(data.index);
                }}
              >
                <View
                  style={[
                    {
                      alignItems: "center",
                      justifyContent: "center",
                      marginHorizontal: RFPercentage(1),
                    },
                  ]}
                >
                  <Feather
                    name="user-minus"
                    size={RFPercentage(2.5)}
                    color={COLOR.WHITE}
                    style={[{ alignSelf: "center" }]}
                  />
                  <Text
                    style={[
                      styles.progressText,
                      { fontSize: RFPercentage(1.5), color: COLOR.WHITE },
                    ]}
                  >
                    {"Remove Players"}
                  </Text>
                </View>
              </TouchableOpacity> */}
            </View>
          )}
        />

        <View
          style={[
            {
              paddingHorizontal: 20,
              alignItems: "center",
              marginBottom: RFPercentage(14),
            },
          ]}
        >
          <View
            style={[
              styles.roundModal,
              {
                flexDirection: "row",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 50,
              },
            ]}
          >
            <Feather
              name={showCardSelector ? "chevron-down" : "chevron-up"}
              size={RFPercentage(4)}
              color={COLOR.PRIMARY_DARK}
              onPress={() => {
                this.setState({ showCardSelector: !showCardSelector });
              }}
              style={[showCardSelector ? styles.closeShow : styles.closeHide]}
            />

            {/* <SwipeBtn
              onPress={() => {
                this.resetAll();
              }}
              label="Clear All"
              fontSize={1.4}
              mainStyle={[
                showCardSelector ? styles.closeShow : styles.closeHide,
              ]}
            /> */}

            {/* <SwipeBtn
              onPress={() => {
                this.resetCurrent();
              }}
              label="Clear"
              fontSize={1.4}
              mainStyle={[
                showCardSelector ? styles.clearShow : styles.clearHide,
              ]}
            /> */}

            <TouchableOpacity
              style={[
                showCardSelector ? styles.clearShow : styles.clearHide,
                {
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: COLOR.bg_card,
                  height: RFPercentage(5),
                  width: RFPercentage(5),
                  borderRadius: RFPercentage(5),
                },
              ]}
              onPress={() => {
                this.resetCurrent();
              }}
              onLongPress={() => {
                this.resetAll();
              }}
            >
              <Text
                style={[
                  {
                    textAlignVertical: "center",
                    textAlign: "center",
                    color: COLOR.PRIMARY_DARK,
                    fontFamily: "Bold",
                    fontSize: RFPercentage(1.5),
                  },
                ]}
              >
                CLR
              </Text>
            </TouchableOpacity>

            {showCardSelector && (
              <View
                style={[
                  {
                    flexDirection: "row",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                ]}
              >
                <Feather
                  name="chevron-left"
                  size={RFPercentage(6)}
                  // color={
                  //   (boardSelected && currentBoardIndex == 0) ||
                  //   (!boardSelected && card1Selected)
                  //     ? COLOR.PRIMARY_LIGHT
                  //     : COLOR.PRIMARY_DARK
                  // }
                  color={COLOR.PRIMARY_DARK}
                  onPress={() => {
                    this.leftArrow();
                  }}
                  style={[{}]}
                />

                <PlayingCardsCircle
                  onPress_A={() => {
                    this.onCardNumberSelect("A");
                  }}
                  onPress_2={() => {
                    this.onCardNumberSelect("2");
                  }}
                  onPress_3={() => {
                    this.onCardNumberSelect("3");
                  }}
                  onPress_4={() => {
                    this.onCardNumberSelect("4");
                  }}
                  onPress_5={() => {
                    this.onCardNumberSelect("5");
                  }}
                  onPress_6={() => {
                    this.onCardNumberSelect("6");
                  }}
                  onPress_7={() => {
                    this.onCardNumberSelect("7");
                  }}
                  onPress_8={() => {
                    this.onCardNumberSelect("8");
                  }}
                  onPress_9={() => {
                    this.onCardNumberSelect("9");
                  }}
                  onPress_10={() => {
                    this.onCardNumberSelect("T");
                  }}
                  onPress_K={() => {
                    this.onCardNumberSelect("K");
                  }}
                  onPress_Q={() => {
                    this.onCardNumberSelect("Q");
                  }}
                  onPress_J={() => {
                    this.onCardNumberSelect("J");
                  }}
                  onPress_club={() => {
                    this.onCardTypeSelect("c");
                  }}
                  onPress_diamond={() => {
                    this.onCardTypeSelect("d");
                  }}
                  onPress_heart={() => {
                    this.onCardTypeSelect("h");
                  }}
                  onPress_spade={() => {
                    this.onCardTypeSelect("s");
                  }}
                  club={club}
                  diamond={diamond}
                  heart={heart}
                  spade={spade}
                  type={type}
                  borderWidthParameter={1.2}
                  size={RFPercentage(22)}
                  symbolSize={RFPercentage(3.5)}
                  that={this}
                  allSelectedCardsLength={allSelectedCards.length}
                />

                <Feather
                  name="chevron-right"
                  size={RFPercentage(6)}
                  // color={
                  //   (boardSelected && currentBoardIndex == 4) ||
                  //   (!boardSelected && !card1Selected)
                  //     ? COLOR.PRIMARY_LIGHT
                  //     : COLOR.PRIMARY_DARK
                  // }
                  color={COLOR.PRIMARY_DARK}
                  onPress={() => {
                    this.rightArrow();
                  }}
                  style={[{}]}
                />
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  render() {
    const {
      showIndicator
    } = this.state;
    return (
      // <ScrollView style={[{ backgroundColor: COLOR.bg_gray }]}>
      // <ContainerFixScreen children={this.renderList()} />
      // </ScrollView>

      <>
        {showIndicator && <Loader />}
        {this.renderList()}
      </>
    );
    listRecords;
  }
}

const styles = StyleSheet.create({
  content: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  box: {
    height: "60%",
    width: "80%",
    flex: 1,
    flexDirection: "row",
    paddingLeft: 20,
    paddingRight: 20,
  },
  flexContainer: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
  },
  fixBox: {
    flexGrow: 1,
    backgroundColor: "#FFF",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 75,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  roundButtonContainer: {
    width: RFPercentage(3),
    height: RFPercentage(3),
    borderRadius: RFPercentage(3),
    margin: RFPercentage(1),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLOR.BLACK_LIGHT,
    overflow: "hidden",
  },
  roundButton: {
    textAlign: "center",
    textAlignVertical: "center",
    color: COLOR.bg_card,
    fontFamily: "Bold",
    fontWeight: "200",
    fontSize: RFPercentage(1.5),
  },
  progressText: {
    textAlignVertical: "center",
    color: COLOR.PRIMARY_DARK,
    fontFamily: "Bold",
    fontSize: RFPercentage(1.5),
  },
  roundModal: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: RFPercentage(1),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 1,
  },
  bigText: {
    textAlignVertical: "center",
    color: COLOR.PRIMARY_DARK,
    fontFamily: "Bold",
    fontSize: RFPercentage(5),
  },
  selectedCard: {
    borderWidth: 1,
    borderColor: COLOR.PRIMARY_DARK,
    borderRadius: 5,
  },
  closeShow: {
    position: "absolute",
    left: RFPercentage(3),
    bottom: RFPercentage(2),
    zIndex: 100,
    alignSelf: "center",
  },
  closeHide: {
    position: "absolute",
    left: RFPercentage(1),
    zIndex: 100,
    alignSelf: "center",
  },
  clearShow: {
    position: "absolute",
    right: RFPercentage(3),
    bottom: RFPercentage(2),
    zIndex: 100,
  },
  clearHide: {
    position: "absolute",
    right: RFPercentage(1),
    zIndex: 100,
  },
});