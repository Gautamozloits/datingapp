/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

'use strict';

import { StyleSheet } from 'react-native';
import COLOR from './Color';
import { RFPercentage } from "react-native-responsive-fontsize";
import normalize from 'react-native-normalize';

export default StyleSheet.create({
    fontBold: {
        fontFamily: 'Bold',
        includeFontPadding: false
    },
    fontLight: {
        fontFamily: 'Light',
        includeFontPadding: false
    },
    fontMedium: {
        fontFamily: 'Medium',
        includeFontPadding: false,
    },
    fontRegular: {
        fontFamily: 'Regular',
        includeFontPadding: false, 
    },
    fontSemiBold: {
        fontFamily: 'SemiBold',
        includeFontPadding: false
    },
    fontExtraBold: {
        fontFamily: 'Poppins-ExtraBold',
        includeFontPadding: false
    },

    font60: {
        fontSize: RFPercentage(12)
    },
    font55: {
        fontSize: RFPercentage(7),
    },
    font30: {
        fontSize: normalize(32)
    },
    font28: {
        fontSize: normalize(30)
    },
    font26: {
        fontSize: normalize(28)
    },
    font24: {
        fontSize: normalize(26)
    },
    font22: {
        fontSize: normalize(24)
    },
    font20: {
        fontSize: normalize(22)
    },
    font18: {
        fontSize: normalize(20)
    },
    font16: {
        fontSize: normalize(18)
    },
    font14: {
        fontSize: normalize(16)
    },
    font13: {
        fontSize: normalize(15)
    },
    font12: {
        fontSize: normalize(14)
    },
    font11: {
        fontSize: normalize(13),
    },
    font10: {
        fontSize: normalize(12),
    },
    font9: {
        fontSize: normalize(11)
    },
    font8: {
        fontSize: normalize(10)
    },
    font6: {
        fontSize: normalize(8)
    },

    ml1:{
        marginLeft: 1
    },
    ml2:{
        marginLeft: 2
    },
    ml3:{
        marginLeft: 3
    },
    ml4:{
        marginLeft: 4
    },
    ml5:{
        marginLeft: 5
    },
    touchOpacity:0.5,
    headerTitle:{
        fontFamily: 'Bold',
        fontSize: RFPercentage(3.0),
        color: COLOR.WHITE,
    },  
    headerImage:{
        height: RFPercentage(3.2)
    },
    headerHeight:{ flex: 1, height: RFPercentage(2) },
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5
    },

    safearea: {
        flex: 1,
        backgroundColor: COLOR.WHITE,
    },
    formGroup: {
        paddingBottom: normalize(20),
        width: '100%'
    },
    formGroupNew: {
        paddingBottom: normalize(10),
        width: '100%'
    },
    formInlineGroup: {
        paddingBottom: normalize(20),
        display: 'flex',
        flexDirection: 'row'
    },
    centerText: {
        display: 'flex',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center'
    },
    leftText2: {
        display: 'flex',
        textAlign: 'left',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignContent: 'flex-start'
    },
    leftText: {
        display: 'flex',
        textAlign: 'left',
        justifyContent: 'center',
        alignItems: 'flex-start',
        alignContent: 'center'
    },
    rightText: {
        display: 'flex',
        textAlign: 'right',
        justifyContent: 'center',
        alignItems: 'flex-end',
        alignContent: 'center'
    },
    tbRow: {
        flexDirection: 'row',
        paddingBottom: normalize(5)
    },
    tbCol: { justifyContent: 'center', flexDirection: 'column' },

    textWhite: {
        color: COLOR.WHITE
    },
    textPrimary: {
        color: COLOR.PRIMARY
    },
    textPrimaryDark: {
        color: COLOR.PRIMARY_DARK
    },
    textPrimaryLight: {
        color: COLOR.PRIMARY_LIGHT
    },
    textGrayLight: {
        color: COLOR.GRAY_LIGHT
    },
    textGray: {
        color: COLOR.GRAY
    },
    textGrayDark: {
        color: COLOR.GRAY_DARK
    },
    textBlack: {
        color: COLOR.BLACK
    },

    aligncenter: {
        flexDirection: 'column',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    container2: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    modalBackground: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
    },
    innerContainer: {
        borderRadius: 10,
    },
    innerContainerTransparent: {
        backgroundColor: COLOR.WHITE,
        padding: 20,
    },
    appheader: {
        resizeMode: 'contain',
        height: 60,
        alignSelf: 'center',
    },
    loginform: {
        //flex: 1,
       // alignItems: 'stretch',
        paddingLeft: normalize(35),
        paddingRight: normalize(35),
    },
    loginbutton: {
        color: COLOR.BUTTON,
        fontSize: 16,
        alignSelf: 'center',
        paddingTop: 20,
        textAlign: 'center',
    },
    forminput: {
        padding: 5,
        marginBottom: 10,
        color: COLOR.ACCENT,
        height: 40,
        borderColor: COLOR.ACCENT,
        borderWidth: 1,
        borderRadius: 4,
    },
    inputField: {
        borderColor: '#DFE7F5',
        borderWidth: 1,
        borderRadius: 4,
        height: normalize(30),
        width: '100%',
        paddingLeft: 5,
        paddingRight:5,
        fontSize: normalize(14),
        color: '#77869E',
        fontFamily: 'Medium'
    },
    useragent: {
        flex: 1,
        flexDirection: 'column',
    },
    selfview: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 100,
        height: 120,
    },
    remotevideo: {
        flex: 1,
    },
    videoPanel: {
        flex: 1,
        position: 'relative',
    },
    call_controls: {
        height: 70,
    },
    margin: {
        margin: 10,
    },

    call_connecting_label: {
        fontSize: 18,
        alignSelf: 'center',
    },
    headerButton: {
        color: COLOR.WHITE,
        fontSize: 16,
        alignSelf: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 5,
        textAlign: 'center',
    },
    incoming_call: {
        justifyContent: 'center',
        alignSelf: 'center',
        fontSize: 22,
    },
    blue:{
        color: '#2A395B'
    },
    green:{
        color: '#1BC773'
    },
    gray:{
        color: '#E9EBEE'
    },
    red:{
        color: '#EE5A55'
    },
    bgYellow:{
        backgroundColor: '#FFBB33'
    },
    bgBrown:{
        backgroundColor: '#2A2A2A'
    },
    bottomBorderImage:{width: '90%', height:5, alignSelf:'center'},
    borderBottom:{borderBottomColor:'#dfe7f5', borderBottomWidth:1},
    bottomBorderFullImage:{width: '100%', height:5, alignSelf:'center'},
    checkBoxImage: {height:normalize(20), width:normalize(20)},
    checkBoxText: {
        color: '#77869E',
        //fontSize: RFPercentage(2.4),
        fontSize: normalize(16),
        fontWeight: '200',
        fontFamily: 'Regular'
    },
    title:{
        textTransform:'capitalize'
    },
    shadow2:{
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        
        elevation: 2,
    },
    shadow5:{
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    pickerLi:{
        marginBottom:5,
        paddingLeft: 5,
        paddingRight: 5,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor:'#F7F8F8'
    },
    pickerOptions:{
        fontSize: normalize(12),
        color: '#2A395B',
        fontFamily:'Regular',
    },
    pickerStyles:{
        width:'100%', 
        marginTop:10, 
        zIndex:0, 
        backgroundColor:'#FFF', 
        position: 'absolute', 
        paddingTop:15, 
        paddingBottom: 5, 
        borderBottomLeftRadius:11, 
        borderBottomRightRadius: 11, 
        borderColor: '#00000029',
        borderWidth: 1,
    },
    droupDown:{
        width:'100%', 
        height: '100%',
        //marginTop:25, 
       // zIndex:2, 
        backgroundColor:'#FFF', 
        position: 'absolute', 
       // paddingTop:15, 
        //paddingBottom: 5, 
        borderBottomLeftRadius:11, 
        borderBottomRightRadius: 11, 
        borderColor: '#00000029',
        borderWidth: 1,
    },
    dropdownOptions:{
       // zIndex: 1,
        flexDirection:'row',
        padding: 5,
        marginBottom: 2,
        borderBottomWidth:1,
        borderBottomColor: '#000',
        alignContent:'center',
        alignItems:'center'
    },

    dropdown_2_dropdown: {
        width: normalize(100),
        height: normalize(85),
        borderColor: '#DFE7F5',
        borderWidth: 1,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        overflow:'hidden'
    },
    dropdown_filter: {
        width: normalize(90),
        height: normalize(50),
        borderColor: '#DFE7F5',
        borderWidth: 1,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        overflow:'hidden'
    },
    required:{
        color: '#FF0000'
    },
    bgWhite:{
        backgroundColor:'#FFF'
    },
    bgGray:{
        backgroundColor: '#EAEAEA'
    },
    disabled:{
        backgroundColor: '#dcdcdc'
    },
    btnLink:{
        backgroundColor:'#000'
    },
    colCenter:{flexDirection:'row', justifyContent:'center', alignItems:'center'},
    payoutCoins:{ height: normalize(30), width: normalize(30), marginRight:5 },
    borderHr: {backgroundColor:'#E9EBEE', width:1,height:'70%'},
    cardSize: { width: RFPercentage(6), height: RFPercentage(9), },

    inputBoxStyle:{
        height:normalize(60),
        paddingLeft:-20,
        backgroundColor:'transparent', 
        color:'red',
        fontSize: normalize(16),
        fontFamily: 'Regular',
        includeFontPadding: false, 
    },
    inputLeftIcon:{
        marginLeft:-15
    },
    closeBtn:{
        paddingLeft:10,
        paddingRight:10,
        paddingBottom:5,
        paddingTop:5,
    },
    redBorder:{
        borderColor: '#ff0000'
    }
});
