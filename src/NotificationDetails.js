import React from "react";
import { View ,StyleSheet,Image,Text,FlatList,Alert,SafeAreaView,Pressable} from "react-native";
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressLoader from 'rn-progress-loader';
import axios from "axios";
import moment from 'moment';
import { openDatabase } from 'react-native-sqlite-storage';
import { Appbar } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Svg, { Path } from 'react-native-svg';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert'
import FontAwesome from 'react-native-vector-icons/FontAwesome';

var db = openDatabase({ name: 'CMMS.db' });

let BaseUrl,Login_id,Emp_id,Emp_name,Site_Cd;

  const NotificationDetails = ({route,navigation}) => {

    const[spinner, setspinner]= React.useState(true)
    const [notification_list,setnotification_list] = React.useState([])

    const [LOGTitle, setLOGTitle] = React.useState('');
    const [LOGBody, setLOGBody] = React.useState('');
    const [LOGRcvDate, setLOGRcvDate] = React.useState('');
    const [LOGMgs, setLOGMgs] = React.useState('');

    //Alert
    const [Show, setShow] = React.useState(false);
    const [Theme, setTheme] = React.useState('');
    const [Title, setTitle] = React.useState('');


    const _goBack = () => {

      navigation.navigate('NotificationScreen');
  
      return true;
    };



    React.useEffect(() => {            

      const focusHander = navigation.addListener('focus', ()=>{
  
  
          fetchData();
  
      });
      return focusHander;
      
        
    },[navigation]);
    
    const fetchData = async ()=>{
              
      BaseUrl = await AsyncStorage.getItem('BaseURL');
      Login_id = await AsyncStorage.getItem('emp_mst_login_id');
      Emp_id = await AsyncStorage.getItem('emp_mst_empl_id');
      Emp_name = await AsyncStorage.getItem('emp_mst_name');           
      Site_Cd = await AsyncStorage.getItem('Site_Cd');  
  
      get_notification();     
    
    };

    const get_notification = async () => {

      setspinner(true)
      console.log("JSON DATA : " + `${BaseUrl}/get_notification_details.php?site_cd=${Site_Cd}&ntf_log_to=${Emp_id}&RowID=${route.params.RowID}`)

      fetch(`${BaseUrl}/get_notification_details.php?site_cd=${Site_Cd}&ntf_log_to=${Emp_id}&RowID=${route.params.RowID}`)
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

            let rcvdate;

            for (let i = 0; i < data.data.length; ++i) {

             
              //console.log(Org_Date)
              if (data.data[i].ntf_log_rcv_date === null) {
                rcvdate = '';
              } else {
                rcvdate = moment(data.data[i].ntf_log_rcv_date.date).format('DD-MM-YYYY HH:mm');
              }


              setLOGTitle(data.data[i].ntf_log_title);
              setLOGBody(data.data[i].ntf_log_body);
              setLOGRcvDate(rcvdate);
              setLOGMgs(data.data[i].ntf_log_msg);

            }

            setspinner(false);
            
          }else{
            setspinner(false);
            setAlert(true,'danger',data.message);
            return;
          }
      })
      .catch(error => {
        setspinner(false);
        setAlert(true,'danger',error.message);
        console.error('Error :', error.message);
      });
    
      
          
    }

    const setAlert =(show,theme,title)=>{
      setShow(show);
      setTheme(theme);
      setTitle(title);
    };
      
    return(

      <SafeAreaProvider>
        <Appbar.Header style={{backgroundColor:"#42A5F5"}}>
          <View style={{flexDirection:'row',flex:1,justifyContent:'space-between'}}>
            <Pressable onPress={_goBack}>
              <View style={{flexDirection:'row',alignItems:'center',}}>
                <FontAwesome name="angle-left" color='#fff' size={55} style={{marginLeft:15,marginBottom:5}} />  
              </View >
            </Pressable>
          </View>
        </Appbar.Header>

        <View style={styles.container}>

          <ProgressLoader visible={spinner} isModal={true} isHUD={true} hudColor={"#808080"} color={"#FFFFFF"} />

          <SCLAlert theme={Theme} show={Show} title={Title}  >
            <SCLAlertButton theme={Theme} onPress={()=>setShow(false)}>OK</SCLAlertButton>
          </SCLAlert>

          <View style={{ backgroundColor: '#42A5F5', height: 90}}>

            <Svg height="140%" width="100%" viewBox="0 0 1440 320" style={{ position: 'absolute', top: 50, }} >
              <Path
                fill="#42A5F5"
                d="M0,96L48,112C96,128,192,160,288,186.7C384
                ,213,480,235,576,213.3C672,192,768,128,864,
                128C960,128,1056,192,1152,208C1248,224,1344,192,
                1392,176L1440,160L1440,0L1392,0C1344,0,1248,0,
                1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,
                384,0,288,0C192,0,96,0,48,0L0,0Z"
              />
            </Svg>

              <View style={{alignItems: 'center'}}>
                <AntDesign name="notification" color="#fff" size={80} style={{marginRight: 15}} />
              </View>

          </View>

          <ScrollView>
            <View style={{flex:1,marginTop:70}}>

              <View style={{flex:1,flexDirection:'row',alignItems:'center',marginLeft:20}}>
                <MaterialIcons name="work-outline" color="#1E90FF" size={20} style={{marginRight: 15}} />
                <Text placeholder="Test" style={{flex:1,color:'#000',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:20,marginRight:5}} >{LOGTitle}</Text>
              </View>

              <View style={{ height: 1, width: '100%', backgroundColor: '#C8C8C8',marginTop: 10}} />

              <View style={{flex:1,flexDirection:'row',alignItems:'center',marginLeft:20,marginTop: 20}}>
                <MaterialIcons name="workspaces-outline" color="#1E90FF" size={20} style={{marginRight: 15}} />
                <Text placeholder="Test" style={{flex:1,color:'#000',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:13,marginRight:5}} >{LOGBody}</Text>
              </View>

              <View style={{ height: 1, width: '100%', backgroundColor: '#C8C8C8',marginTop: 20}} />

              <View style={{flex:1,flexDirection:'row',alignItems:'center',marginLeft:20,marginTop: 20}}>
                <AntDesign name="calendar" color="#1E90FF" size={20} style={{marginRight:15, marginTop:4}}/>
                <Text placeholder="Test" style={{color:'#000',justifyContent: 'flex-start',fontSize:13}} >{LOGRcvDate}</Text>
              </View>

              <View style={{marginLeft:50,marginTop: 10}}>
                <Text style={{flex:1,marginRight:5,fontSize: 13,marginTop:5,color:'black'}}>{LOGMgs.trim()}</Text>                  
              </View>  
              
            </View>

          </ScrollView>


        </View>

      </SafeAreaProvider>
    
    )
  }
  
  
  
  const styles = StyleSheet.create({
  
    container: {
      flex: 1    
    },
  
    image_ta: {
  
      width: 45,
      height: 45,        
      resizeMode: 'contain',
    },
  
    image: {
        width: 30,
        height: 30,     
        resizeMode: 'contain',
    },
  
    View_01:{
  
      
      backgroundColor: '#42A5F5',
  
    },
  
    view_tab:{
      margin:10,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  
    text_stytle_ta:{
      
      fontSize:15,
     fontWeight: "bold",
     marginTop:10,
     marginLeft:10,
     color:'#ffffffff'
    },
    image: {
        width: 20,
        height: 20,        
        resizeMode: 'contain',
    },
    toolbar: {
  
        paddingTop:25,
        paddingBottom:10,
        backgroundColor: '#0096FF',
        flexDirection:'row',
        alignItems:'center'       
    },
    toolbartext:{
        fontSize:20,
        color:'#fff'
    },
    
    view_2:{        
        
        flexDirection: 'row',       
        alignItems: 'stretch',
        justifyContent: 'center',
        backgroundColor:"#FFFF"  ,
        paddingTop:5
    },
    view_3:{        
        
        flexDirection: 'row',       
        alignItems: 'stretch',
        justifyContent: 'center',
        backgroundColor:"#FFFF"  ,
        paddingTop:10,
        paddingBottom:10
    },
    view_4:{        
        
      flexDirection: 'row',
      alignItems: 'stretch',
      backgroundColor:"#FFFF"  ,
      paddingTop:5
      
  },
    item:{
    
        backgroundColor: '#fff',
        height: 500,
        margin:10,
       
        borderRadius: 10,
        
    
    },
    
  
  });

export default NotificationDetails

