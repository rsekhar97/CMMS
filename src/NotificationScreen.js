import React from "react";
import { View ,StyleSheet,Image,Text,FlatList,Alert,SafeAreaView} from "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressLoader from 'rn-progress-loader';
import axios from "axios";
import moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { openDatabase } from 'react-native-sqlite-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert'
var db = openDatabase({ name: 'CMMS.db' });

let BaseUrl,Login_id,Emp_id,Emp_name,Site_Cd;

const NotificationScreen = ({navigation}) => {   

    const[spinner, setspinner]= React.useState(true)
    const [notification_list,setnotification_list] = React.useState([])

    //Alert
    const [Show, setShow] = React.useState(false);
    const [Theme, setTheme] = React.useState('');
    const [Title, setTitle] = React.useState('');

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

    console.log("Notifty"+BaseUrl);
    get_notification();     
  
  };


  const get_notification = async () => {

    setspinner(true)
    console.log("JSON DATA : " + `${BaseUrl}/get_notification_list.php?site_cd=${Site_Cd}&ntf_log_to=${Emp_id}`)
    fetch(`${BaseUrl}/get_notification_list.php?site_cd=${Site_Cd}&ntf_log_to=${Emp_id}`)
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

            setnotification_list(data.data);
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

  const ItemView = ({ item }) => {

    return (
      <TouchableOpacity onPress={() => getItem(item)}>
        <View style={styles.item}>
            <View style={{flex:1,justifyContent:'space-between',flexDirection:'row',alignItems:'center'}}>
                <AntDesign name="clockcircleo" color="#05375a" size={15} style={{marginRight:15, marginTop:4}} onPress={()=>logout()}/>
                <Text style={{fontSize: 13,marginTop:5,color:'black',alignItems:'flex-start',flex:1}}>{item.ntf_log_title}</Text>
                <Text style={{fontSize: 10,marginTop:5,color:'#1E90FF',borderWidth:1,borderRadius:10,padding:5,borderColor:'#1E90FF',}}>See more</Text>
            </View>
            
            <View style={{flex:1,marginTop:5,flexDirection:'row',alignItems:'center'}}>
                <MaterialIcons
                    name="workspaces-outline"
                    color="#05375a"
                    size={15}
                    style={{marginRight:15,marginTop: 4}}
                    onPress={() => logout()}
                />
                <Text style={{flex:1,fontSize: 12,color:'black'}}>{item.ntf_log_body}</Text>
            </View>                      
            
            <View style={{flexDirection:'row',alignItems:'center',marginTop:5,}}>

                <AntDesign name="calendar" color="#05375a" size={15} style={{marginRight:15, marginTop:4}} onPress={()=>logout()}/>
                <Text style={{fontSize: 12,marginTop:5,textAlign: 'right',color:'black'}}>{moment(item.ntf_log_send_date.date).format('yyyy-MM-DD HH:mm')}</Text>
            </View>
           
        </View>
      </TouchableOpacity>   

      
    );
  };
  
  const ItemSeparatorView = () => {
      return (
        // Flat List Item Separator
        <View style={{ height: 1, width: '100%', backgroundColor: '#C8C8C8'}} />
      );
  };
  
  const getItem = (item) => {
    navigation.navigate('NotificationDetails', { RowID: item.RowID});
  };


  const setAlert =(show,theme,title)=>{
    setShow(show);
    setTheme(theme);
    setTitle(title);
  };
    

  return(
    <View style={styles.container}>
        <SafeAreaView style={styles.View_01}>
          <View style={styles.view_tab}>
            <View style={{flexDirection: 'row'}}>
                <Image style={styles.image_ta} source={require('../images/logo.png.png')}/>
                <Text style={styles.text_stytle_ta}>{'Evantage C M M S'}</Text>
            </View>
          </View>
        </SafeAreaView>

        <ProgressLoader visible={spinner} isModal={true} isHUD={true} hudColor={"#808080"} color={"#FFFFFF"} />

        <SCLAlert theme={Theme} show={Show} title={Title}  >
            <SCLAlertButton theme={Theme} onPress={()=>setShow(false)}>OK</SCLAlertButton>
        </SCLAlert>
          
        <FlatList
            data={notification_list}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator ={false}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={ItemSeparatorView}
            renderItem={ItemView}
        />
      
    </View>
  
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
      margin:10,
      padding: 10,
      borderRadius: 10,
      
  
  },
  

});



export default NotificationScreen;