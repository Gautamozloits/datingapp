import React, { Component } from "react";
import { StyleSheet, SafeAreaView, View } from "react-native";
import { ECharts } from "react-native-echarts-wrapper";
import moment from "moment";
import { kFormatter } from '../../api/service';

export default class GameCountPieChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            graph_data: [],
            data: [],
            series: [],
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
            console.log('this.props.graph_data: ', this.props.graph_data.length)
            this.setState({ graph_data: this.props.graph_data })
            this.setOption(this.props.graph_data);
        }
    }
    componentDidMount() {

        this.setOption(this.props.graph_data);
    }



    setOption = (data) => {
        var colorPalette = ['#042C5C', '#C23531', '#749F83'];
        console.log(data)

        var option = {
            title: {
                text: 'Games Statistics',
                //subtext: 'Results',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                bottom: 10,
                left: 'center',
                data: ['Games Won', 'Games Lost', 'Games Draw']
            },
            series: [
                {
                    name: 'Game',
                    type: 'pie',
                    radius: '70%',
                    center: ['50%', '50%'],
                    selectedMode: 'single',
                    color: colorPalette,
                    label: {
                        position: 'inner'
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                        { value: data.game_won, name: 'Games Won' },
                        { value: data.game_lost, name: 'Games Lost' },
                        { value: data.game_draw, name: 'Games Draw' },
                    ],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
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