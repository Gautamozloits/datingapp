/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React, { Component } from 'react';
import {
  Text,
  View,
  Image, ImageBackground, StyleSheet, Dimensions, FlatList, TouchableOpacity
} from 'react-native';
import { RFPercentage } from "react-native-responsive-fontsize";
import { LinearGradient } from 'expo-linear-gradient';
import { postData, getData, convertLocalToUTC } from '../../api/service';

import COLOR_SCHEME from '../../styles/ColorScheme';
import COLOR from '../../styles/Color';
import Styles from '../../styles/Styles';
import Images from '../../../constants/Images';
import FloatingLabel from '../../components/FloatingLabel';
import { IconButton, CircleButton, SwitchExample } from '../../components/Buttons/Button';
import ContainerFixScreen from '../Views/ContainerFixScreen';
import { HeaderBG, HeaderLeft, PeriodFilter } from '../../components/HeaderOptions';
import normalize from 'react-native-normalize';
import { DateFilter } from '../../components/DateFilter';

import EChartsExample from './EChartsExample';
import GameResultPieChart from './GameResultPieChart';
import GameCountPieChart from './GameCountPieChart';

import { ScrollView } from 'react-native-gesture-handler';
import moment from "moment";

const { width, height } = Dimensions.get('window');

export default class MyPerformance extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => <Text style={Styles.headerTitle}>My Performance</Text>,
      headerTitleAlign: 'center',
      headerBackground: () => <HeaderBG />,
      headerLeft: () => <HeaderLeft onPress={() => navigation.openDrawer()} />,
      headerRight: () => <PeriodFilter options={['Weekly', 'Monthly', 'Yearly']} changeFilter={navigation.getParam('changeFilter')} />,

    };
  };
  constructor(props) {
    super(props);
    this.state = {
      listRecords: [],
      filter_mode: 'week',
      graph_view: false,
      graph_data:[],
      game_count: {},
      game_result:{},
      isGraphShow: false,
      selectedDates: [],
      win_games: [],
      lost_games: [],
      draw_games: []
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({ changeFilter: this.changeFilter });

    //this.getPerformance()
  }
  toggleSwitch = (value) => {
    this.setState({ graph_view: value })
    if(value){
      this.getPerformanceGraph(this.state.selectedDates)
    }else{
      this.getPerformance(this.state.selectedDates)
    }
    
}

  changeFilter = (id, name) => {
    var filter = ['week', 'month', 'year'];
    var type = filter[id];
    this.setState({ filter_mode: type })
    //this.getPerformance(type)
  }
  getPerformance = (dates) => {
    this.setState({selectedDates: dates})
    let start_date = convertLocalToUTC(dates.start_date+' 00:00:00');
    let end_date = convertLocalToUTC(dates.end_date+' 23:59:59');

    let params = { start_date: start_date, end_date: end_date };
    postData('my-performance', params).then(async (res) => {
      console.log('my-performance .....',JSON.stringify(res))
      if (res.status) {
        let lists = res.data;
        
        let total_games = res.total_games;
        let win_games = []; 
        let lost_games = []; 
        let draw_games = [];
        lists[0].games = total_games;
        total_games.map((game, key) => {
          if(game.result === 'Winner'){
            win_games.push(game)
          }else if(game.result === 'Loser'){
            lost_games.push(game)
          }else if(game.result === 'Quits'){
            draw_games.push(game)
          }
        });
        lists[1].games = win_games;
        lists[2].games = lost_games;
        lists[3].games = draw_games;
       // console.log('win_games.....',JSON.stringify(lists))

        this.setState({ listRecords: lists, win_games: win_games, lost_games: lost_games, draw_games: draw_games })
      }
    })
  }

  getPerformanceGraph = (dates) => {
    this.setState({isGraphShow: false, selectedDates: dates})
    let start_date = convertLocalToUTC(dates.start_date+' 00:00:00');
    let end_date = convertLocalToUTC(dates.end_date+' 23:59:59');
    let params = { start_date: start_date, end_date: end_date };
    postData('my-performance/graph', params).then(async (res) => {
      if (res.status) {
        
        this.setState({ graph_data: res.data,game_count: res.game_count, game_result: res.game_result, isGraphShow: true })
      }
    })
  }

  backwordFilter = () => {
    console.log('back...')
  }
  forwordFilter = () => {
    console.log('forword...')
  }

  updateLayout = index => {
    var array = [];
      array = [...this.state.listRecords];
    

    array.map((value, placeindex) =>
      placeindex === index
        ? (array[placeindex]['isExpanded'] = !array[placeindex]['isExpanded'])
        : (array[placeindex]['isExpanded'] = false)
    );
    this.setState(() => {
        return {
          listRecords: array,
        };
    });
    

  };
  
  renderCard = (item, index) => {
    //const { listRecords } = this.state;
   
    if(item.type && item.type !== ''){
      //console.log('index: ',JSON.stringify(item))
      return (<ExpandableItemComponent
        key={item.id.toString() + Math.random()}
        onClickFunction={this.updateLayout.bind(this, index)}
        that={this}
        item={item}
      />)
    }else{
      return (
        <View style={{ flex: 1, height:normalize(80) }} key={index}>
          <View style={[styles.box]}>
            <View style={[Styles.tbCol, { width: '70%' }]}>
              <Text style={[Styles.fontRegular, Styles.font16, Styles.textPrimary]}>{item.title}</Text>
            </View>
            <View style={[Styles.tbCol, { width: '30%', alignItems: 'flex-end' }]}>
              <Text style={[Styles.fontRegular, Styles.font16, Styles.textGrayDark, Styles[item.color]]}>{item.value}</Text>
            </View>
          </View>
          <Image source={Images.bottomBorder} resizeMode="cover" style={Styles.bottomBorderImage} /> 
        </View>
      );
    }
    
    
  }

  renderGraphCard = () => {
    const { graph_data, game_count, game_result, isGraphShow, filter_mode } = this.state;
    return (<ScrollView style={{flex:1, paddingBottom:50}}>
      <View >
        {isGraphShow ? 
        <>
        <View style={[{marginBottom:20,flex:1, height:250}]}>
        <EChartsExample filter_mode={filter_mode} graph_data={graph_data} game_result={game_result}/> 
        </View>
        <View style={[{marginBottom:20,flex:1, height:350}]}>
        <GameResultPieChart graph_data={game_result}/>
        </View>
        <View style={[{marginBottom:20,flex:1, height:350}]}>
        <GameCountPieChart graph_data={game_count}/>
        </View>
        
        </>
        : null}
      
      </View>
      <View style={{height:50}}>
      
      </View>
      </ScrollView>);
  }

  renderList = () => {
    const { listRecords, filter_mode, graph_view } = this.state;
    return (
      
      <View style={styles.fixBox}>
        
          
        <LinearGradient colors={['#77869E', '#3C434F']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={[{ width: '100%', height: normalize(50), paddingLeft: 0, paddingRight: 0, borderTopLeftRadius: 10, borderTopRightRadius: 10, justifyContent:'space-around' }]}>
        <View style={[{flex:1, flexDirection:'row'}]}>
          <View style={[Styles.tbCol, {width:'100%'}]}>
            <DateFilter onChangeFilter={value => { (graph_view) ? this.getPerformanceGraph(value) : this.getPerformance(value) }} mode={filter_mode} />
          </View>
          {/* <View style={[Styles.tbCol, Styles.centerText, {width:'20%'}]}>
            {(this.state.graph_view) ? 
            <IconButton onPress={() => this.toggleSwitch(false)} 
            name="list-alt" 
            color="#FFF" 
            type="FontAwesome5"
            fontSize={30}
          />
          : 
            <IconButton onPress={() => this.toggleSwitch(true)} 
            name="chart-bar" 
            color="#FFF" 
            type="FontAwesome5"
            fontSize={30}
          />
          }
            
          </View> */}
          </View>
          
        </LinearGradient>
        
        <View style={styles.content}>
          
        
        {this.state.graph_view ? <ScrollView style={{flex:1, paddingBottom:50}}>
        {this.renderGraphCard()}
        <View style={{height:50}} />
          </ScrollView>
          :
          <FlatList
                contentContainerStyle={{ paddingBottom: 90, paddingLeft: 2, paddingRight: 2 }}
                showsVerticalScrollIndicator={false}
                data={listRecords}
                renderItem={({ item, index }) => this.renderCard(item, index)}
                keyExtractor={item => item.id.toString() + Math.random()}
                //ListFooterComponent={() => <LoaderFooter visible={show_footer_loader} />}
                //ListEmptyComponent={() => <NoRecord visible={show_no_record} />}
                
              />
        }
        </View>
      </View>
    );
  }

  render() {
    // return (<View style={{height:300}}>
    //   <EChartsExample />
    //   </View>);
    
    return (
      <ContainerFixScreen children={this.renderList()} />
    );
  }
}


class ExpandableItemComponent extends Component {
  //Custom Component for the Expandable List
  
  getChildren = (item, key) => {
    let boxClass = styles.grayBox;
    let circleColor =  styles.grayCircle;
    let textColor = {};
    if(item.result == 'Winner'){
      boxClass = styles.greenBox;
      circleColor =  styles.greenCircle;
      textColor = Styles.green;
    }else if(item.result == 'Loser'){
      boxClass = styles.redBox;
      circleColor =  styles.redCircle;
      textColor = Styles.red;
    }
      return (<View key={'child_' + key} style={[Styles.tbRow, { paddingLeft: 10, paddingRight: 10, marginBottom: 5, height: 50 }]}>
        <View style={[boxClass, { flexDirection: 'row', height: RFPercentage(7) }]}>
          <View style={[Styles.tbCol, Styles.centerText, { width: '15%' }]}>
            <View style={[Styles.centerText, Styles.shadow5, circleColor]}>
              <Text style={[Styles.font12, Styles.fontBold, Styles.textPrimaryDark, textColor]}>{key + 1}</Text>
            </View>
          </View>
          <View style={styles.verticalBorder} />
          <View style={[Styles.tbCol, Styles.centerText, { width: '55%' }]}>
            <Text style={[Styles.font12, Styles.fontMedium, Styles.textPrimaryDark]}>{moment(item.start_time, 'YYYY-MM-DD HH:mm:ss').format('DD MMMM YYYY')}</Text>
          </View>
          <View style={styles.verticalBorder} />
          <View style={[Styles.tbCol, Styles.centerText, { width: '20%', flexDirection: 'row' }]}>
            {/* <View style={[Styles.shadow5, { borderRadius: 50 }]}>
              <Image source={Images.currancyIcon} style={{ height: normalize(15), width: normalize(15) }} />
            </View> */}
            <Text style={[Styles.font14, Styles.fontBold, Styles.textPrimaryDark, textColor]}>{(item.amount) ? item.amount : 0}</Text>
          </View>
          
        </View>
      </View>
      )
   



  }

  render() {
    const { item } = this.props;
    return (
      
      <View style={{ flexDirection: 'column',marginBottom: 5 }}>
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={this.props.onClickFunction}
            style={{flex: 1}}
          >
        <View style={[styles.box, { marginBottom: 5,height:normalize(80) }]}>
          <View style={[Styles.tbCol, { width: '70%' }]}>
            <Text style={[Styles.fontRegular, Styles.font16, Styles.textPrimary]}>{item.title}</Text>
          </View>
          <View style={[Styles.tbCol, { width: '30%', alignItems: 'flex-end' }]}>
            <View style={[Styles.tbRow, Styles.centerText]}>
              <Text style={[Styles.fontRegular, Styles.font16, Styles.textGrayDark, Styles[item.color]]}>{item.value}</Text>
              <View style={[Styles.centerText, Styles.shadow5, styles.togleCircle, {marginLeft:normalize(10)}]}>
              <IconButton  
              onPress={this.props.onClickFunction}
              name={(item.isExpanded) ? "chevron-small-down" : "chevron-small-up"} 
              color="#000" 
              type="Entypo"
              fontSize={20}
            />
            </View>
            </View>
          </View>
        </View>
        </TouchableOpacity>

        <View style={{
          height: (item.isExpanded) ? null : 0,
          overflow: 'hidden',
        }}>
          {(item.games) ? item.games.map((child, key) => this.getChildren(child, key)) : null}

        </View>
        <Image source={Images.bottomBorder} resizeMode="cover" style={Styles.bottomBorderImage} /> 
      </View>

    );
  }
}


const styles = StyleSheet.create({
  content: { height: '100%', width: '100%', display: 'flex', flexDirection: 'column' },
  box: { width: '100%', flex: 1, flexDirection: 'row', paddingLeft: 20, paddingRight: 20 },

  flexContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  fixBox: {
    //flexGrow: 1,
    backgroundColor: '#FFF',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: normalize(100),
    marginTop: normalize(25),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },

  row: {
    flex: 1, backgroundColor: '#FFF', marginTop: 5, borderRadius: 10, flexDirection: 'row', padding: normalize(5),
  },
  list: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 5
      },
      togleCircle: {
        height: RFPercentage(3),
        width: RFPercentage(3),
        backgroundColor: '#FFF',
        borderRadius: 50,
        alignContent: 'center',
        alignItems: 'center'
      },
      whiteCircle: {
        height: RFPercentage(4),
        width: RFPercentage(4),
        backgroundColor: '#FFF',
        borderRadius: 50,
        alignContent: 'center',
        alignItems: 'center'
      },
      greenCircle: {
        height: RFPercentage(4),
        width: RFPercentage(4),
        backgroundColor: '#E9F9F1',
        borderRadius: 50,
        alignContent: 'center',
        alignItems: 'center'
      },
      grayCircle: {
        height: RFPercentage(4),
        width: RFPercentage(4),
        backgroundColor: '#E9EBEE',
        borderRadius: 50,
        alignContent: 'center',
        alignItems: 'center'
      },
      redCircle: {
        height: RFPercentage(4),
        width: RFPercentage(4),
        backgroundColor: '#FEECED',
        borderRadius: 50,
        alignContent: 'center',
        alignItems: 'center'
      },
      
      greenBox: {
        flexDirection: 'row',
        borderWidth: 1, borderColor: '#E9F9F1', borderRadius: 8,
        overflow: 'hidden',
        alignItems:'center'
      },
    
      redBox: {
        flexDirection: 'row',
        borderWidth: 1, borderColor: '#FEECED', borderRadius: 8,
        overflow: 'hidden',
        alignItems:'center'
      },
      grayBox: {
        flexDirection: 'row',
        borderWidth: 1, borderColor: '#E9EBEE', borderRadius: 8,
        overflow: 'hidden',
        alignItems:'center'
      },
      rowBack: {
        alignItems: 'center',
        backgroundColor: '#A8B0BC',
        //flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15, borderRadius: 10,
        paddingRight: 15,
        marginBottom: 5,
        height: normalize(56)
      },
      verticalBorder:{width:'5%',height:'60%', borderLeftColor:'#DFE7F5', borderLeftWidth:1}
})