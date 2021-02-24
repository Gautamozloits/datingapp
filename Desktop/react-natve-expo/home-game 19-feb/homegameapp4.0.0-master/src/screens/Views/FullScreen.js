/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import React from 'react';
import {
    Text,
    View,
    TextInput,
    Platform,
    Modal,
    TouchableHighlight,
    TouchableOpacity,
    SafeAreaView,
    StatusBar, Image, ScrollView
} from 'react-native';

import COLOR_SCHEME from '../../styles/ColorScheme';
import COLOR from '../../styles/Color';
import Styles from '../../styles/Styles';

export default class FullScreen extends React.Component {
    constructor(props) {
        super(props);
        this.password = '';
        this.state = {
            username: '',
            isModalOpen: false,
            modalText: '',
        };
    }

    componentDidMount() {

    }


    render() {
        return (
            <ScrollView style={[ { flex: 1 }]}>
            <SafeAreaView style={[Styles.safearea, {paddingBottom:20}]}>
                <StatusBar barStyle={Platform.OS === 'ios' ? COLOR_SCHEME.DARK : COLOR_SCHEME.LIGHT} backgroundColor={COLOR.PRIMARY_DARK} />

                <View style={[Styles.container]}>
                    {this.props.children}
                </View>

            </SafeAreaView>
            </ScrollView>
        );
    }
}
