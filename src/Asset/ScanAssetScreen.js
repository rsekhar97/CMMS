import React, { Fragment } from 'react';
import { TouchableOpacity, Text, Linking, View, Image, ImageBackground, BackHandler } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Dimensions,StyleSheet ,SafeAreaView,StatusBar} from 'react-native';
const deviceWidth = Dimensions.get('screen').width;
const deviceHeight = Dimensions.get('screen').height;



const SacnAssetScreen = ({route,navigation})=>{

    const [scan,setscan]=React.useState(true);
    const [ScanResult,setScanResult]=React.useState(false);
    const [result,setresult]=React.useState(null);

    console.log(route.params.Screenname)

    const _goBack = () => {


        navigation.navigate('MainTabScreen')

        
    }

    const onSuccess = (e) => {

        const check = e.data.substring(0, 4);
        console.log('scanned data' + check);

        setresult(e)
        setscan(false)
        setScanResult(false)
       
        if (check === 'http') {
          
          let url = e.data
          alert('Incorrect Scan Asset: ' + url);
          //console.warn(url)
          
        //  console.warn(e.data)
         
        } else {
            

            const  strParts =  e.data.split('\n');
            //console.warn("split"+strParts[0])
                
            setresult(e)
            setscan(false)
            setScanResult(true)
            page(strParts[0].trim());
            
            // this.setState({
            //     result: e,
            //     scan: false,
            //     ScanResult: true
            // })
        }
    }


    const activeQR = () => {setscan(true)}

    const scanAgain = () => {setscan(true) ,setScanResult(false)}
    const scanAgain2 = () => {setscan(false) ,setScanResult(false)}

    const page =(result)=>{

        if(route.params.Screenname === "FilteringWorkOrder"){
            navigation.navigate('FilteringWorkOrder',{Assetno:result})   
       
        }else{
            navigation.navigate('ScanAssetMaster',{ Screenname:"ScanAssetMaster",ScanAssetno:result}) ; 
       
        }

    }


    return(
        <View style={styles.container}>

            <StatusBar backgroundColor='#42A5F5' barStyle="light-content"/>

            <View style={styles.scrollViewStyle}>
                  <Fragment>
                      <SafeAreaView style={{flexDirection:'row', justifyContent: 'space-between',}}>

                          <Text style={styles.text_stytle}></Text>
                          <TouchableOpacity onPress={()=>_goBack()}>
                              <AntDesign name="close" color="#FFF" size={30} style={{marginRight:35, marginTop:15}}/>
                          </TouchableOpacity>
                      </SafeAreaView>
                      {!scan && !ScanResult &&
                          <View style={styles.qr_cardView} >
                              <Image source={require('../../images/camera.png')} style={{height: 36, width: 36}}></Image>
                              <Text numberOfLines={8} style={styles.descText}>Please move your camera {"\n"} over the QR Code</Text>
                              <Image source={require('../../images/qrcodescan.png')} style={{margin: 20}}></Image>
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
                              topContent={
                                  <Text style={styles.centerText}>
                                  Please move your camera {"\n"} over the QR Code
                                  </Text>
                              }
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
        </View>
    );



};


export default SacnAssetScreen;

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
        color: '#05375a',
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
    textPrivate: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20
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

    qr_header: {
        
        flexDirection: 'row',

       
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
    highlight: {
        fontWeight: '700',
    },
    centerText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        padding: 32,
        color: 'white',
    },
    textBold: {
        fontWeight: '500',
        color: '#000',
    },
    bottomContent: {
       width: deviceWidth,
       height: 120,
    },
    buttonTouchable: {
        fontSize: 21,
        backgroundColor: 'white',
        marginTop: 32,
        width: deviceWidth - 62,
        justifyContent: 'center',
        alignItems: 'center',
        height: 44
    },
    buttonTextStyle: {
        color: 'black',
        fontWeight: 'bold',
    }
  });