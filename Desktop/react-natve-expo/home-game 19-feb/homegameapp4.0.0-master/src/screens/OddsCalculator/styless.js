import { StyleSheet, Dimensions } from 'react-native';
import Util from '../../utils/util';
import Colors from '../../utils/colors';

const styless = StyleSheet.create({
  mainView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashLogo: {
    height: Util.getHeight(30),
    width: Util.getWidth(50),
  },
  container: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
    // alignSelf: 'baseline'
  },
  containerScroll: {
    flex: 1,
    flexDirection: "column"
  },
  iconStyle: {
    flex: 1,
    width: 20,
    height: 20,
    resizeMode: 'contain'
  },
  iconForgotPass: {
    flex: 1,
    width: 150,
    height: 150,
    resizeMode: 'contain'
  },
  rememberMeText: {

    fontSize: Util.normalize(13),
  },
  boxContainer: {

    flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    marginTop:Util.getHeight(4)

  },
  loginBox: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    height: Util.getHeight(70),

  },
  closeButton: {
    marginRight: '-10%',
    width: 40,
    height: 40,
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    // ali:'flex-end',
    backgroundColor: Colors.EXTRACOLORS.WHITE
    // backgroundColor: 'red'

  },
  loginContinue: {
    textAlign: 'left',
    color: Colors.NavyBlue,
    fontSize: Util.normalize(25),
    fontWeight: 'bold',
    marginTop: '8%',
    marginLeft: '-15%'

  },
  box1: {
    flexGrow: 1,
    position: 'absolute',
    top: 20,
    alignSelf: 'baseline',
    width: "100%",
    marginLeft: '20%',
    marginRight: '20%',
    //justifyContent: 'center',
    // alignContent: 'center',
    height: Util.getHeight(57),
    alignSelf: 'center',
    borderRadius: Util.getWidth(5),
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: 'white'


  },
  box2: {
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: '25%',
    marginRight: '25%',
    position: 'absolute',
    top: 30,
    alignSelf: 'baseline',
    width: "100%",
    alignContent: 'center',
    justifyContent: 'center',
    height: Util.getHeight(58),
    borderRadius: Util.getWidth(5),

    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    opacity: 0.8,

  },
  box3: {
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: '28%',
    marginRight: '28%',
    position: 'absolute',
    top: 40,
    alignSelf: 'baseline',
    alignContent: 'center',
    justifyContent: 'center',
    width: "100%",
    alignSelf: 'center',
    height: Util.getHeight(58),
    borderRadius: Util.getWidth(5),
    alignItems: 'center',
    backgroundColor: 'white',
    opacity: 0.5,


  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center'
  },
  imageStyle: {
    marginTop: '5%', flex: 1,
    width: 80,
    height: 40,
    resizeMode: 'contain'
  },
  pleaseEnterCredential: {
    marginTop: 15,
    marginBottom: '5%',
    textAlign: 'left',
    marginLeft: '-20%',
    color: Colors.TextColor.SecondaryTextColor,
    fontSize: Util.normalize(12),
    fontWeight: 'bold'
  },
  radioForgetView: {
    flexDirection: 'row',
    width: '95%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '5%'
    // marginRight:'13%'
    // paddingLeft: '3%',
    // marginHorizontal: 7,
  },
  checkbox: {
    height: 15,
    width: 15,
    borderWidth: 1.2,
    borderRadius: 2,
  },
  forgetPsw: {
    color: '#3366FF',
    fontSize: Util.normalize(13),

  },
  // container: {
  //   flex: 1,
  //   alignItems: "center",
  //   justifyContent: "center",
  // },
  cover: {
    backgroundColor: "rgba(0,0,0,.5)",
  },
  sheet: {
    position: "absolute",
    top: Dimensions.get("window").height,
    left: 0,
    right: 0,
    height: "100%",
    width: '100%',
    justifyContent: "flex-end",
  },
  popup: {
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    height: Util.getHeight(85),
    minHeight: 80,
  },
  resetPassword: {
    fontSize: Util.normalize(23),
    fontWeight: 'bold',
    marginLeft: '-10%',
    alignItems: 'flex-start'
  },
  forgotPasswordTetx: {
    fontSize: Util.normalize(22.5),
    fontWeight: 'bold',
    color:Colors.NavyBlue,
    marginTop:Util.getHeight(2),
    marginLeft:Util.getWidth(10)

  },
  forgotPasswordSentence: {
    fontSize: Util.normalize(11),
    fontWeight: 'bold',
    color:Colors.TextColor.SecondaryTextColor,
    marginTop:Util.getHeight(0.5),
    marginLeft:Util.getWidth(10)

  }

});
export default styless;
