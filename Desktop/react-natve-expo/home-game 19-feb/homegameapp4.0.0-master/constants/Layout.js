import { Dimensions } from 'react-native';
import normalize from 'react-native-normalize';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  inputBoxStyle:{
    height:60,
    paddingLeft:-20,
    backgroundColor:'transparent', 
    color:'red',
    fontSize: normalize(16),
    fontFamily: 'Regular',
    includeFontPadding: false, 
},
inputBoxTheme:{ primary: "#042C5C", placeholder:'#77869E' }
};
