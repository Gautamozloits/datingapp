import React, { useState } from 'react';
import { View, Text, Dimensions, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Styles from '../styles/Styles';
import Images from '../../constants/Images';
import * as Permissions from 'expo-permissions';
import { Overlay } from 'react-native-elements';
import { LoaderIndicator } from './Loader'

export function ImageModal(props) {

    const [show, setShow] = useState(false);
    const { width, height } = Dimensions.get('window');
    var isVisible = false;
    if (props.isVisible) {
        isVisible = props.isVisible
    }

    async function checkPermission(type) {
        if (type == "camera") {
            const { status } = await Permissions.getAsync(Permissions.CAMERA)
            if (status != 'granted') {
                const { status } = await Permissions.askAsync(Permissions.CAMERA);
                if (status != 'granted') {
                    Alert.alert('Warning', "App need permission for camera to take pictures.", [{ text: 'OK', onPress: () => { } }], { cancelable: false });
                    return;
                } else {
                    openCamera()
                }
            } else {
                openCamera()
            }
        } else if (type == "gallery") {
            const { status } = await Permissions.getAsync(Permissions.CAMERA_ROLL)
            if (status != 'granted') {
                const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
                if (status != 'granted') {
                    Alert.alert('Warning', "App need permission for gallery to choose pictures.", [{ text: 'OK', onPress: () => { } }], { cancelable: false });
                    return;
                } else {
                    openGallery()
                }
            } else {
                openGallery()
            }
        }
    }

    function callImageOption(type) {
        if (type == "camera") {
            openCamera()
        } else if (type == "gallery") {
            openGallery()
        }
    }

    async function openCamera() {

        try {
            await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.1,
                exif: true,
                base64: true
            }).then(result => { if (!result.cancelled) { call_image(result.uri) } })
                .catch(error => onError(console.log("error image >>>>>>>>>>>>>>>>>>>>>>", error)));;
        } catch (error) { }
    }

    async function openGallery() {
        try {
            await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.1,
                exif: true,
                base64: true
            }).then(result => { if (!result.cancelled) { call_image(result.uri) } })
                .catch(error => onError(console.log("error gallery >>>>>>>>>>>>>>>>>>>>>>", error)));;
        } catch (error) { }
    }

    async function closeModal() {
        props.that.setState({ isModalVisible: false })
    }

    function call_image(img) {
        var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
        if (allowedExtensions.exec(img)) {
            if (img != null) {
                props.that.setState({
                    pickedImage: {
                        uri: img,
                        name: 'my_photo.jpg',
                        type: 'image/jpg'
                    },
                    selectedImage: 'Selected'
                })
                closeModal()
            }
        } else {
            alert("Sorry ! Please upload image ,this is not image type")
        }
    }

    return (
        <Overlay isVisible={isVisible}
            windowBackgroundColor="rgba(0, 0, 0, .5)"
            overlayBackgroundColor="rgba(0, 0, 0, .3)"
            width="100%"
            height="100%"
        >

            <View
                style={{ justifyContent: 'center', flex: 1, padding: 20 }}
            >
                <View style={{
                    backgroundColor: '#ffffff',
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 10,
                    },
                    shadowOpacity: 0.20,
                    shadowRadius: 1.41,
                    elevation: 5,
                }}>{show ? <LoaderIndicator /> : null}
                    <View style={{ borderBottomColor: '#2F3B70', borderBottomWidth: 2 }}>
                        <Text style={[Styles.font18, { color: '#2F3B70', textAlign: 'center', padding: 20 }]}>Select Image</Text>
                    </View>
                    <View>
                        <TouchableOpacity onPress={() => checkPermission("camera")} >
                            <Image source={Images.camera} style={{ height: 90, margin: 10, alignSelf: 'center' }} resizeMode="contain" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => checkPermission("gallery")} >
                            <Image source={Images.gallery} style={{ height: 90, margin: 10, alignSelf: 'center' }} resizeMode="contain" />
                        </TouchableOpacity>
                    </View>
                    <View style={{ padding: 20 }}>
                        <TouchableOpacity onPress={() => closeModal()} >
                            <Text style={[Styles.font16, { textAlign: 'right', color: '#2F3B70' }]}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Overlay>
    );

}
