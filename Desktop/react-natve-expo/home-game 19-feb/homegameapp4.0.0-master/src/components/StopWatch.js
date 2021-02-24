import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
//import { formatTimeString } from './utils';
import moment from "moment";

class StopWatch extends Component {
    static propTypes = {
        start: PropTypes.bool,
        options: PropTypes.object,
        startTime: PropTypes.number,
    }

    constructor(props) {
        super(props);
        const { startTime } = props;
        this.state = {
            startTime: null,
            startTimeString: '',
            elapsed: startTime || 0,
            gameStartTime: ''
        };
        this.start = this.start.bind(this);
        this.formatTime = this.formatTime.bind(this);
        const width = props.msecs ? 220 : 150;
        this.defaultStyles = {
            container: {
                backgroundColor: '#000',
                padding: 5,
                borderRadius: 5,
                width: width,
            },
            text: {
                fontSize: 30,
                color: '#FFF',
                marginLeft: 7,
            }
        };
    }

    componentDidMount() {
        if (this.props.start) {
            this.start(this.props.startTime);
        }
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        if (newProps.start) {
            clearInterval(this.interval);
            this.start(newProps.startTime);
        }
    }

    componentWillUnmount() {

        clearInterval(this.interval);
    }

    getFormattedString(time){
        
        let seconds = Math.floor(time / 1000);
        let minutes = Math.floor(time / 60000);
        let hours = Math.floor(time / 3600000);
        seconds = seconds - minutes * 60;
        minutes = minutes - hours * 60;
        let formatted2;
        
        formatted2 = `${hours < 10 ? 0 : ""}${hours}:${
        minutes < 10 ? 0 : ""
        }${minutes}:${seconds < 10 ? 0 : ""}${seconds}`;
       
        return formatted2;
    }
    start(secs) {
        
        let game_time = moment.utc(this.props.gameStartTime).toDate();
        let game_time_local = moment(game_time).local().format('X')
        let current_time = moment().format('X')
        var diffTime = current_time - game_time_local;
        var new_sec = new Date() - diffTime;
        var formatted = moment.utc(diffTime*1000).format('HH:mm:ss');

        this.setState({ startTimeString: formatted });

        this.interval = setInterval(() => {
            
            let game_time = moment.utc(this.props.gameStartTime).toDate();
            let game_time_local = moment(game_time).local().format('X')
            let current_time = moment().format('X')
            var diffTime = current_time - game_time_local;
            var new_sec = new Date() - diffTime;
            var formatted = moment.utc(diffTime*1000).format('HH:mm:ss');
            this.setState({ startTimeString: formatted });
        }, 1000);
    }




    formatTime() {
        return this.state.startTimeString;
    }


    render() {

        const styles = this.props.options ? this.props.options : this.defaultStyles;

        return (
            <View ref="stopwatch" style={styles.container}>
                <Text style={styles.text}>{this.formatTime()}</Text>
            </View>
        );
    }
}

export default StopWatch;
