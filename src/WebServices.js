import React ,{ Fragment }from 'react';
import {View,Text,TouchableOpacity,Dimensions,TextInput,Platform,StyleSheet,ScrollView,
    StatusBar,Pressable,Image, Modal,Alert,SafeAreaView, NativeModules,NativeMethods, Linking} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { ImageBackground } from 'react-native';
import ProgressLoader from 'rn-progress-loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from "axios";
import DeviceInfo from 'react-native-device-info'
import { PermissionsAndroid } from 'react-native'
import RNExitApp from 'react-native-exit-app';
import SpInAppUpdates, { NeedsUpdateResponse, IncomingStatusUpdateEvent, UPDATE_TYPE, NeedsUpdateResponseAndroid, HIGH_PRIORITY_UPDATE } from 'sp-react-native-in-app-updates';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert'
import { checkVersion } from "react-native-check-version";

import {useNetInfo} from "@react-native-community/netinfo";
import {requestUserPermission,notificationListeners} from './Utils/notificationServices';

const deviceWidth = Dimensions.get('screen').width;
const deviceHeight = Dimensions.get('screen').height;

const WebServices = ({navigation}) => {    

   

    const [url, onChangeUrl] = React.useState(null); 
    const [showqrcode,setshowqrcode]=React.useState(false);

    const [scan,setscan]=React.useState(false);
    const [ScanResult,setScanResult]=React.useState(false);
    const [result,setresult]=React.useState(null);

    const[spinner, setspinner]= React.useState(false)    
    

    //Alert
    const [Show, setShow] = React.useState(false);
    const [UpdateShow, setUpdateShow] = React.useState(false);
    const [Theme, setTheme] = React.useState('default');
    const [Title, setTitle] = React.useState('Title');
    const [Subtitle, setsubtitle] = React.useState('subtitle');

    const version = DeviceInfo.getVersion();

    React.useEffect(() => {

        const focusHander = navigation.addListener('focus', ()=>{
      
            checkForUpdates()
           
        });
        return focusHander;

       
    },[navigation]);


    const checkForUpdates = (async() => {

        try{
            const appversion = await checkVersion();
            console.log("Got version info:", appversion);
            if (appversion.needsUpdate) {

                console.log(`App has a ${appversion.updateType} update pending.`);

                setAlert_update(true,'warning','Update CMMS?','CMMS recommends that you update to the latest version..');


            }else{

                NotificationPermission();
            }

        }catch(error){
            console.log({error})
        }
    });


    const NotificationPermission = async () => {

        if (Platform.OS === 'android') {

            try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
                {
                title: "Push Notification",
                message:"App needs allow Push Notificationa ",
                buttonNeutral: "Ask Me Later",
                buttonNegative: "Cancel",
                buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("Camera permission given");

            requestCameraPermission()

            } else {
            console.log("Camera permission denied");
            requestCameraPermission()
            }
        } catch (err) {
            console.warn(err);
        }

        }
        
    };

    const requestCameraPermission = async () => {

        if (Platform.OS === 'android') {

            try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                title: "App Camera Permission",
                message:"App needs access to your camera ",
                buttonNeutral: "Ask Me Later",
                buttonNegative: "Cancel",
                buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("Camera permission given");

            request_Read_Extrnal_Storage_Permission();

            } else {
            console.log("Camera permission denied");
            }
        } catch (err) {
            console.warn(err);
        }

        }
        
    };

    const request_Read_Extrnal_Storage_Permission = async () => {
        
        if (Platform.OS === 'android') {

            try {
                const granted = await PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                  {
                    title: 'Get Read External Storage Access',
                    message: 'get read external storage access for detecting screenshots',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                  },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                  console.log("Read External Storage permission given");
        
                  request_WRITE_EXTERNAL_STORAGE_Permission()
                } else {
                  console.log("Read External Storage permission denied");
                }
               
              } catch (err) {
                console.warn(err);
               
              }

        }
          
       
    };

    const request_WRITE_EXTERNAL_STORAGE_Permission = async () => {
        
        if (Platform.OS === 'android') {

            try {
                const granted = await PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                  {
                    title: 'External Storage Write Permission',
                    message: 'get Write external storage write file',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                  },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("Write external storage permission given");
                   
                    requestUserPermission();
                    notificationListeners();
                    
                } else {
                    console.log("Write external storage permission denied");
                }
               
            } catch (err) {
            console.warn(err);
            
            }

        }
        
     
    };

    const onSuccess = (e) => {

        console.log(JSON.stringify(e));
        
        const check = e.data.substring(0, 4);
        console.log('scanned data' + check);
        setresult(e)
        setscan(false)
        setScanResult(false)
       
        if (check === 'http') {
         
          setshowqrcode(false)   
          onChangeUrl(e.data)
         
         
        } else {
            setshowqrcode(false)
            
            let dataurl = e.data
            setAlert(true,'danger','Incorrect IP Address'+'\n'+dataurl)
            
            setresult(e)
            setscan(false)
            setScanResult(true)
            scanAgain(true)
        }
    }

    const activeQR = () => {setscan(true)}

    const scanAgain = () => {setscan(true) ,setScanResult(false)}

    const scanAgain2 = () => {setscan(false) ,setScanResult(false)}


    const OpenQRCode =()=>{      

        setshowqrcode(true)
        scanAgain(true)

    }

    const submit =async()=>{

         //navigation.navigate("LoginScreen")
         console.log('scanned button: ' + url);
         setspinner(true);
         if(!url){

            setspinner(false);
            setAlert(true,'warning','Uri Connection is Required')
            return
         }else{

            const check = url.substring(0, 4);
            console.log('scanned button: ' + check);
            if (check === 'http') {

                get_version();

              } else {
                setspinner(false);
                setAlert(true,'danger','Incorrect IP Address'+'\n'+url)
                
              }
 
            
         }

      
 
    }

    const get_version = async()=>{

        console.log("URL VERSION: ", `${url}/${version}/get_version.php?`)
        fetch(`${url}/${version}/get_version.php?`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Process the data
            //console.log('data :', data);
            if (data.status === 'Update Alert') {

                get_settings();
            

            }else{
                setspinner(false);
                setAlert(true,'danger',data.message);
                return;
            }
        })
        .catch(error => {
            setspinner(false);
            if(error.message === 'HTTP error! Status: 404'){
                setAlert(true,'danger','please contact system administrator');
                console.log('Error :', error.message);
            }else{
                setAlert(true,'danger',error.message);
                console.log('Error :', error.message);
            }
            
        });
        
    }
    
    const get_settings = async()=>{

        console.log("URL SETTING: " , `${url}/${version}/get_settings.php?`)
        fetch(`${url}/${version}/get_settings.php?`)
        .then(response => {
            if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Process the data
            //console.log('data :', data);
            if (data.status === 'SUCCESS') {

                setspinner(false);
                AsyncStorage.setItem('BaseURL', url+'/'+version)                
                navigation.navigate("LoginScreen")
            

            }else{
                setspinner(false);
                setAlert(true,'danger',data.message);
                return;
            }
        })
        .catch(error => {
            setspinner(false);
            setAlert(true,'danger',error.message);
            console.log('Error :', error.message);
        });
            
         

    }

    const setAlert =(show,theme,title)=>{

        setShow(show);
        setTheme(theme);
        setTitle(title);
        
    
    };

    const setAlert_update =(show,theme,title,subtitle)=>{

        setUpdateShow(show);
        setTheme(theme);
        setTitle(title);
        setsubtitle(subtitle);
    
    };

    const setupdate = () => {
    
        setUpdateShow(false)
    
        if(Platform.OS === 'android'){
    
          Linking.openURL("https://play.google.com/store/apps/details?id=com.evantage.cmmshybrid&hl=us");
          RNExitApp.exitApp();
    
        }else{
    
        }
        
    };
    
  

    return (
      
      <View style={styles.container}>
        <StatusBar backgroundColor='#42A5F5' barStyle="light-content"/>

        <ProgressLoader visible={spinner} isModal={true} isHUD={true} hudColor={"#808080"} color={"#FFFFFF"}/>

        <SCLAlert theme={Theme} show={Show} title={Title}  >
            <SCLAlertButton theme={Theme} onPress={()=>setShow(false)}>OK</SCLAlertButton>
        </SCLAlert>

        <SCLAlert theme={Theme} show={UpdateShow} title={Title} subtitle={Subtitle}>
            <SCLAlertButton theme={Theme} onPress={()=>setupdate()}>Update</SCLAlertButton>
        </SCLAlert>

            <Modal visible={showqrcode}>                
                <View style={styles.scrollViewStyle}>
                    <Fragment>

                        <SafeAreaView style={{flexDirection:'row', justifyContent: 'space-between'}}>
                            <Text style={styles.text_stytle}></Text>
                            <TouchableOpacity onPress={()=>setshowqrcode(false)}>
                                <AntDesign name="close" color="#FFF" size={30} style={{marginRight:35, marginTop:15}}/>
                            </TouchableOpacity>
                        </SafeAreaView>

                        {!scan && !ScanResult &&
                            <View style={styles.qr_cardView} >
                                {/* <Image source={require('../images/camera.png')} style={{height: 36, width: 36}}></Image> */}
                                <Text numberOfLines={8} style={styles.descText}>Please move your camera {"\n"} over the QR Code</Text>
                               
                                <MaterialCommunityIcons 
                                    name="qrcode-scan"
                                    color="#05375a"
                                    size={50}
                                />
                                 <TouchableOpacity onPress={activeQR} style={styles.buttonScan}>
                                    <View style={styles.buttonWrapper}>
                                    {/* <Image source={require('../../images/camera.png')} style={{height: 36, width: 36}}></Image> */}
                                    <Text style={{...styles.buttonTextStyle, color: '#2196f3'}}>Scan QR Code</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        }
                        {ScanResult &&
                            <Fragment>
                                <Text style={styles.textTitle1}>Result</Text>
                                <View style={ScanResult ? styles.scanCardView : styles.cardView}>
                                    <Text>Type : {result.type}</Text>
                                    <Text>Result : {result.data}</Text>
                                    <Text numberOfLines={1}>RawData: {result.rawData}</Text>
                                    <TouchableOpacity onPress={scanAgain} style={styles.buttonScan}>
                                        <View style={styles.buttonWrapper}>
                                            {/* <Image source={require('./images/camera.png')} style={{height: 36, width: 36}}></Image> */}
                                            <Text style={{...styles.buttonTextStyle, color: '#2196f3'}}>Click to scan again</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </Fragment>
                        }
                        {scan &&
                            <QRCodeScanner
                                reactivate={true}
                                showMarker={true}
                            //  ref={(node) => { this.scanner = node }}
                                onRead={onSuccess}
                                topContent={ <Text style={styles.centerText}> Please move your camera {"\n"} over the QR Code </Text> }
                                bottomContent={
                                    <View>
                                        <ImageBackground style={styles.bottomContent}>
                                            {/* <TouchableOpacity style={styles.buttonScan2} 
                                                onPress={() => this.scanner.reactivate()} 
                                                onLongPress={() => this.setState({ scan: false })}>
                                                <Image source={require('../../images/camera.png')}></Image>
                                            </TouchableOpacity> */}

                                            <TouchableOpacity onPress={scanAgain2}>
                                                <View >
                                                    {/* <Image source={require('./images/camera.png')} style={{height: 36, width: 36}}></Image> */}
                                                    <Text style={{ color: '#FFFF',textAlign:'center',fontSize: 18,fontWeight: 'bold'}}>Cancel Scan</Text>
                                                </View>
                                            </TouchableOpacity>

                                        </ImageBackground>
                                    </View>
                                }
                            />
                        }
                    </Fragment>
                </View>

            </Modal>
        <View style={styles.header}>
            <Text style={styles.text_header}>Register Now</Text>
        </View>
        <Animatable.View animation="fadeInUpBig" style={styles.footer}>
            <ScrollView >
                <View>
                    <Text style={styles.text_footer}>Url Connection</Text>
                    <View style={styles.action}>
                        <FontAwesome name="link" color="#05375a" size={20} />
                        <TextInput placeholder="Url Connection" style={styles.textInput} autoCapitalize="none" value={url} onChangeText={(val) => onChangeUrl(val)} />
                        <Pressable onPress={OpenQRCode}>     
                        <MaterialCommunityIcons name="qrcode-scan" color="#05375a" size={30}/>
                        </Pressable> 

                        {/* {data.check_textInputChange ? 
                        <Animatable.View
                            animation="bounceIn"
                        >
                            <Feather 
                                name="link"
                                color="green"
                                size={20}
                            />
                        </Animatable.View>
                        : null} */}
                    </View>          
                    <View style={styles.button}>
                        <TouchableOpacity style={styles.signIn} onPress={() => {submit()}} >
                        <LinearGradient colors={['#42A5F5', '#42A5F5']} style={styles.signIn} >
                            <Text style={[styles.textSign, {color:'#fff'}]}>Validate</Text>
                        </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </Animatable.View>
        <View style={styles.version_style}>
            <Text style={{color: '#000', fontSize: 12}}> Version: {version} </Text>
        </View>
      </View>
    );
};

export default WebServices;

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: '#42A5F5'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: Platform.OS === 'ios' ? 3 : 5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        marginTop:18,
        marginLeft:15,
        fontSize: 25,
        fontFamily: 'DancingScript-Regular', 
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18,
        marginTop:150
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5,
        justifyContent:'center'
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#000',
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },

    color_textPrivate: {
        color: 'grey'
    },
    image: {
        width: 50,
        height: 50,        
        resizeMode: 'contain',
    },
    scrollViewStyle: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: '#2196f3'
    },
  
    qr_cardView: {
        width: deviceWidth - 32,
        height: deviceHeight - 350,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        padding: 25,
        marginLeft: 5,
        marginRight: 5,
        marginTop: '10%',
        backgroundColor: 'white'
    },
    scanCardView: {
        width: deviceWidth - 32,
        height: deviceHeight / 2,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        padding: 25,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        backgroundColor: 'white'
    },
    buttonWrapper: {
        display: 'flex', 
        flexDirection: 'row',
        alignItems: 'center'
    },
    buttonScan: {
        borderWidth: 2,
        borderRadius: 10,
        borderColor: '#258ce3',
        paddingTop: 5,
        paddingRight: 25,
        paddingBottom: 5,
        paddingLeft: 25,
        marginTop: 20
    },
    buttonScan2: {
        marginLeft: deviceWidth / 2 - 50,
        width: 100,
        height: 100,
    },
    descText: {
        padding: 16,
        textAlign: 'center',
        fontSize: 16
    },

    centerText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        padding: 32,
        color: 'white',
    },
  
    bottomContent: {
       width: deviceWidth,
       height: 120,
    },

    buttonTextStyle: {
        color: 'black',
        fontWeight: 'bold',
    },
    version_style: {
        flexDirection: 'row',
        width: '100%',
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
      },
});
