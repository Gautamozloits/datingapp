
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  Button,
  SafeAreaView,
} from 'react-native';
import BraintreeDropIn from 'react-native-braintree-dropin-ui';
// import braintree from 'braintree';



const FlexDirectionBasics = () => {
  useEffect(() => {
    // console.log("llllll", BTClient);
   
  },[])
 const  paypalTry = () => {
    

    BraintreeDropIn.show({
      clientToken: 'sandbox_383fqcrg_gx4py578yxtwjq5t',
      merchantIdentifier: '1953896702662410263',
      googlePayMerchantId: '1953896702662410263',
      countryCode: 'US',    //apple pay setting
      currencyCode: 'USD',   //apple pay setting
      merchantName: 'Apple Pay',
      orderTotal:'Total Price',
      googlePay: true,
      applePay: true,
      // vaultManager: true,
      // cardDisabled: false,
      darkTheme: true,
      venmo: "sandbox_383fqcrg_gx4py578yxtwjq5t",

      paypal: {
        container: 'paypal-container',
        singleUse: true, // Required
        amount: 10.00, // Required
        currency: 'USD', // Required
        locale: 'en_US',
        enableShippingAddress: true,
        shippingAddressOverride: {
          recipientName: 'Scruff McGruff',
          streetAddress: '1234 Main St.',
          extendedAddress: 'Unit 1',
          locality: 'Chicago',
          countryCodeAlpha2: 'US',
          postalCode: '60652',
          region: 'IL',
          phone: '123.456.7890',
          editable: false
        }
      },

    })
    .then(result => console.log("yyyyyyy",result))
    .catch((error) => {
      if (error.code === 'USER_CANCELLATION') {
        // update your UI to handle cancellation
      } else {
        console.log("uu errrrr",error)
        // update your UI to handle other errors
      }
    });

    
  }

  
    return (
      <SafeAreaView>
      
      <View>
      <View style={{padding:60}}>
        <Text style={{paddingBottom:20, fontFamily: "fontBold", fontSize: 20}}>payment Gateway drop-in</Text>
        </View>
        <View style={{ width:200, justifyContent: "center", paddingTop:60, paddingLeft:50}}>
        <Button style={{width:100,  height:10, borderRadius:20,  paddingBottom:30}} title="Paypal" onPress={()=>paypalTry()} />  
      </View>
      </View>
      </SafeAreaView>
    );
};

export default FlexDirectionBasics;
