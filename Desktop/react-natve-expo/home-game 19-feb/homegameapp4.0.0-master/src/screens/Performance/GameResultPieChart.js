import React, { Component } from "react";
import { StyleSheet, SafeAreaView, View } from "react-native";
import { ECharts } from "react-native-echarts-wrapper";
import moment from "moment";
import { kFormatter } from '../../api/service';

export default class GameResultPieChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            graph_data: [],
            data: [],
            series: [],
            totalProfit: 0,
            option: {
                title: {
                    text: 'Game',
                    subtext: 'Results',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    bottom: 10,
                    left: 'center',
                    data: []
                },
                series: [
                    {
                        type: 'pie',
                        radius: '65%',
                        center: ['50%', '50%'],
                        selectedMode: 'single',
                        data: [],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            }
        };
    }

    componentDidUpdate(prevProps, prevState) {
        // check whether client has changed
        if (prevProps.graph_data !== this.props.graph_data) {
            var totalProfit = this.props.graph_data.total_profit;
           // console.log('this.props.graph_data: ', this.props.graph_data.length)
            this.setState({ graph_data: this.props.graph_data, totalProfit: totalProfit })
            this.setOption(this.props.graph_data);
            
        }
    }
    componentDidMount() {

        this.setOption(this.props.graph_data);
    }



    setOption = (data) => {

        var colorPalette = ['#042C5C', '#C23531', '#006400'];
        
        var option = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
                bottom: 10,
                left: 'center',
                data: ['Total Win', 'Total Lost', 'Net Profit']
            },
            series: [
                {
                    name: 'Net Profit',
                    type: 'pie',
                    selectedMode: 'single',
                    radius: [0, '30%'],
                    color: ['#006400'],
                    label: {
                        position: 'inner'
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                        {value: data.total_profit, name: 'Net Profit'},
                        
                    ]
                },
                {
                    name: 'Amount',
                    type: 'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    color: colorPalette,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                        { value: data.total_won, name: 'Total Win' },
                        { value: data.total_lost, name: 'Total Lost' },
                    ],
                }
            ]
        };

        this.setState({ option: option })
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