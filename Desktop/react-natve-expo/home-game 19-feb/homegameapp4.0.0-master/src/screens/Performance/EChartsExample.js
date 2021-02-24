import React, { Component } from "react";
import { StyleSheet, SafeAreaView, Button, View } from "react-native";
import { ECharts } from "react-native-echarts-wrapper";
import moment from "moment";
import { kFormatter } from '../../api/service';

export default class EChartsExample extends Component {
    constructor(props) {
        super(props);
        this.state = {
            graph_data:[],
            game_result:{},
          data: [],
          series: [],
          option:{
            color: ['#3398DB'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: [],
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: 'Amount',
                    type: 'bar',
                    barWidth: '60%',
                    data: []
                }
            ]
          }
        };
      }
    //   unsafe_componentWillReceiveProps(nextProps) {
    //       console.log('nextProps: ', nextProps.graph_data)
    //     //this.setState({value: nextProps.value})
    //   }
    // componentDidUpdate(prevState, prevProps) {
    //        console.log('prevState: ',prevState.graph_data)  
    //        console.log('prevProps: ',prevProps.graph_data)          
    //     //if(this.state.game_data != prevProps.game_data){
    //         //this.setState({game_data: this.props.graph_data})
    //     //}
        
    // }
    componentDidUpdate(prevProps, prevState) {
        // check whether client has changed
        if (prevProps.graph_data !== this.props.graph_data) {
          console.log('this.props.graph_data: ',this.props.game_result)
          this.setState({graph_data: this.props.graph_data, game_result: this.props.game_result})
          this.setOption(this.props.graph_data);
        }
      }
    componentDidMount(){
        this.setOption(this.props.graph_data);
        
    }
  
    setOption = (game_data) => {
        //let game_data = this.state.graph_data;    
       // console.log('game_data',JSON.stringify(this.props.graph_data))
        var data = [];
        var series = [];
        var yAxis = [];
        
        

        game_data.map((value) => {
            data.push(moment(value.end_time).format('DD/MM'));
            series.push(parseInt(value.amount))
            if(value.amount < 0){
                yAxis.push(kFormatter(parseInt(value.amount* -1)))
            }else{
                yAxis.push(kFormatter(parseInt(value.amount)))
            }
            
        })


        var option = {
          title: {
            text: 'Win/Loss Statistics',
            //subtext: 'Results',
            left: 'center'
          },
            color: ['#042C5C'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    axisLabel: {rotate: 90},
                    data: data,
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                   
                }
            ],
            series: [
                {
                    name: 'Amount',
                    type: 'bar',
                    barWidth: '60%',
                    data: series,
                    animationDelay: function (idx) {
                      return idx * 10;
                  }
                    // markLine: {
                    //     data: [
                    //         {type: 'average', name: 'Average win'}
                    //     ]
                    // }
                },
              
            ]
        };
        this.setState({option: option})
        this.forceUpdate()
    }

  additionalCode = `
        chart.on('click', function(param) {
            var obj = {
            type: 'event_clicked',
            data: param.data
            };

            sendData(JSON.stringify(obj));
        });
    `;

  onData = param => {
    const obj = JSON.parse(param);

    if (obj.type === "event_clicked") {
      //alert(`you tapped the chart series: ${obj.data}`);
    }
  };

  onRef = ref => {
    if (ref) {
      this.chart = ref;
    }
  };

  onButtonClearPressed = () => {
    this.chart.clear();
  };

  render() {
    const { option } = this.state;

    return (
      <View style={styles.chartContainer}>
        <ECharts
          ref={this.onRef}
          option={option}
          additionalCode={this.additionalCode}
          onData={this.onData}
          onLoadEnd={() => {
            this.chart.setBackgroundColor("rgba(253, 253, 253, 0.1)");
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  chartContainer: {
    flex: 1,
    backgroundColor: "#F5FCFF",
    
  }
});