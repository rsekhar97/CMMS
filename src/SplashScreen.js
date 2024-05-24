import React from 'react';
import { View, Text, Dimensions,StyleSheet,StatusBar } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LogBox } from 'react-native';
import DeviceInfo from 'react-native-device-info'


LogBox.ignoreLogs([ "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!"]);

const SplashScreen = ({navigation}) => {

    const { colors } = useTheme();   

    const version = DeviceInfo.getVersion();
    console.log(version);

    React.useEffect(() => {


        const focusHander = navigation.addListener('focus', ()=>{
      

            fetchData();
    
        });
        return focusHander;

       
    },[navigation]);

    const fetchData = async ()=>{
        
        let BaseURL = await AsyncStorage.getItem('BaseURL');
        let Emp_id = await AsyncStorage.getItem('emp_mst_empl_id');

        setTimeout(() => {
            
           
            console.log("BASE URL : "+BaseURL);
            if (!BaseURL) {
                navigation.replace('WebServices');
                //navigation.replace('QRCode'); 
            } else {
    
                if(!Emp_id){
                    navigation.replace('LoginScreen');
                }else{
                    navigation.replace('MainTabScreen');

                    // navigation.replace('CreateAssetScreen');  
    
                }
        
            }



        }, 1000);

        

    }
    
    const onstart =async()=>{       
       
        let BaseURL = await AsyncStorage.getItem('BaseURL');
        let Emp_id = await AsyncStorage.getItem('emp_mst_empl_id');
        console.log("BASE URL : "+BaseURL);
        if (!BaseURL) {
            navigation.replace('WebServices');
            //navigation.replace('QRCode'); 
          } else {
   
               if(!Emp_id){
                 navigation.replace('LoginScreen');
               }else{
                 navigation.replace('MainTabScreen');

                // navigation.replace('CreateAssetScreen');  
   
               }
     
          }

    }


  return (
    <View style={styles.container}>
        <StatusBar backgroundColor='#42A5F5' barStyle="light-content"/>
        <View style={styles.header}>
            <Animatable.Image 
                animation="bounceIn"
                duraton="1500"
            source={require('../images/logo.png.png')}
            style={styles.logo}
            resizeMode="stretch"
            />

            <Text style={{ color: '#FFF',
                fontSize: 40,
                margin:10,
                fontWeight: 'bold'}}>Evantage</Text>
        </View>
        <Animatable.View 
            style={[styles.footer, {
                backgroundColor: colors.background
            }]}
            animation="fadeInUpBig">

            <Text style={[styles.title, {
                color: colors.text
            }]}>CMMS - Computerized Maintenance Management System</Text>

            <Text style={styles.text}>Manage maintenance tasks and Asset Tagging in the field with an easy-to-use mobile maintenance app without any further delay on information.</Text>
            {/* <View style={styles.button}>
                <TouchableOpacity onPress={onstart}>
                    <LinearGradient
                        colors={['#42A5F5', '#42A5F5']}
                        style={styles.signIn}
                    >

                        <Text style={styles.textSign}>Get Started</Text>
                        <MaterialIcons 
                            name="navigate-next"
                            color="#fff"
                            size={20}
                        />
                    </LinearGradient>
                </TouchableOpacity>
            </View > */}

                
            
        </Animatable.View>
        <View style={styles.version_style}>
            
                <Text style={{color: '#000',
                        fontSize: 12,
                        fontWeight: 'bold'}}>Version: {version+'.dev'}</Text>
           
            </View>
      </View>
  )
}

export default SplashScreen

const {height} = Dimensions.get("screen");
const height_logo = height * 0.15;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#64B5F6'
  },
  header: {
      flex: 1.5,
      justifyContent: 'center',
      alignItems: 'center'
  },
  footer: {
      flex: 1,
      backgroundColor: '#fff',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingVertical: 50,
      paddingHorizontal: 30
  },
  logo: {
      width: height_logo,
      height: height_logo
  },
  title: {
      color: '#05375a',
      fontSize: 18,
      fontWeight: 'bold'
  },
  text: {
      color: 'grey',
      marginTop:9
  },
  button: {
      alignItems: 'flex-end',
      marginTop: 30
  },
  signIn: {
      width: 150,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 50,
      flexDirection: 'row'
  },
  textSign: {
      color: 'white',
      fontWeight: 'bold'
  },
  version_style:{
    width: '100%',
    position: 'absolute',
    justifyContent: 'center', 
    alignItems: 'center',
    bottom: 40
  }
});