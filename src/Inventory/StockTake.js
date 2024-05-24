import React from "react";
import {  View,StyleSheet, Text, Pressable,TouchableOpacity,FlatList,BackHandler,Image,Alert} from 'react-native';
import { Button,SearchBar } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressLoader from 'rn-progress-loader';
import { Appbar } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from "axios";
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { openDatabase } from 'react-native-sqlite-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
var db = openDatabase({ name: 'CMMS.db' });

let BaseUrl,Site_cd,LoginID,EmpName,EmpID,EmpPhone,EmpWorkGrp;

const StockTake = ({navigation,route}) => {

  const _goBack = () => {

    if(route.params.Screenname === 'StockTake'){
      navigation.navigate('MainTabScreen')
    }
    
  }

  const[spinner, setspinner]= React.useState(false)
  const[StockTake,setStockTake] = React.useState([])

  const backAction = () => {
    Alert.alert("Alert", "Do you want to exit Stock Master?", [
      {
        text: "No",
        onPress: () => null,
       
      },
      { text: "YES", onPress: () => _goBack() }
    ]);
    return true;
  };
  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  React.useEffect(() => {            

      const focusHander = navigation.addListener('focus', ()=>{


          fetchData();

      });
      return focusHander;
    
      
  },[navigation]);


  const fetchData = async ()=>{

    BaseUrl = await AsyncStorage.getItem('BaseURL');
    Site_cd = await AsyncStorage.getItem('Site_Cd');
    LoginID = await AsyncStorage.getItem('emp_mst_login_id');
    EmpName = await AsyncStorage.getItem('emp_mst_name');
    EmpID = await AsyncStorage.getItem('emp_mst_empl_id');
    EmpPhone = await AsyncStorage.getItem('emp_mst_homephone');
    EmpWorkGrp = await AsyncStorage.getItem('emp_det_work_grp'); 


    get_stockMaster_list();
  }

   // STEP : 1 GET Stock Master LIST API
   const get_stockMaster_list =(async ()=>{

        
    setspinner(true); 

    try{
      console.log("MR-Stock_No JSON DATA " + `${BaseUrl}/get_inventory_count_book_by_params.php?site_cd=${Site_cd}`)

      const response = await axios.get(`${BaseUrl}/get_inventory_count_book_by_params.php?site_cd=${Site_cd}`);
     // console.log("JSON DATA DASHBOARD 2 : " + response.data.data)
      if (response.data.status === 'SUCCESS') {

        
        //console.log(response.data.data) 
        setStockTake(response.data.data);
        setspinner(false);

      }else{
        setspinner(false);
        alert(response.data.message);
        return
      }
      
    }catch(error){
      setspinner(false);
      alert(error);
    }

      

  })


   const ItemView = ({ item }) => {

    let pending = item.itm_rcb_total_item - item.itm_rcb_item_count

    if (item.itm_rcb_completed === '0') {
      var checkboxvalue = false;
      var colorcode = '#808080';
    } else {
      var checkboxvalue = true;
      var colorcode = '#808080';
    }

        
      return (
      

        <TouchableOpacity onPress={() => getItem(item)}>
          <View style={styles.item}>

            <View style={{flexDirection:"row",marginTop:2,justifyContent:'space-between',}}>

              <View style={{flexDirection:"row"}}>

                <View>
                    <Text placeholder="Test" style={{color:'#42A5F5',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12,}} >Count Book : </Text>
                </View>
                <View>
                    <Text placeholder="Test" style={{justifyContent: 'flex-start',fontWeight: 'bold',color:'#42A5F5',fontSize:12,}} >{item.itm_rcb_book_no}</Text>
                </View>

              </View>
              

              <View style={{flexDirection:"row"}}>

                <View>
                    <Text placeholder="Test" style={{color:'#42A5F5',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12}} >Total Item : </Text>
                </View>
                <View>
                    <Text placeholder="Test" style={{justifyContent: 'flex-start',fontWeight: 'bold',color:'#42A5F5',fontSize:12}} >{item.itm_rcb_total_item}</Text>
                </View>

              </View>
              
            </View>

            <View style={{flexDirection:"row",marginTop:2,justifyContent:'space-between',}}>

              <View style={{flexDirection:"row"}}>

                <View>
                    <Text placeholder="Test" style={{color:'#808080',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12,}} >Description : </Text>
                </View>
                <View>
                    <Text placeholder="Test" style={{justifyContent: 'flex-start',fontWeight: 'bold',color:'#808080',fontSize:12,}} >{item.itm_rcb_desc}</Text>
                </View>

              </View>
              

              <View style={{flexDirection:"row"}}>

                <View>
                    <Text placeholder="Test" style={{color:'#8BC34A',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12}} > Item Count : </Text>
                </View>
                <View>
                    <Text placeholder="Test" style={{justifyContent: 'flex-start',fontWeight: 'bold',color:'#8BC34A',fontSize:12}} >{item.itm_rcb_item_count}</Text>
                </View>

              </View>
              
            </View>

            <View style={{flexDirection:"row",marginTop:2,justifyContent:'space-between',}}>

              <View style={{flexDirection:"row",alignItems: 'center'}}>

               
                <View style={{alignItems: 'center'}}>
                  {/* <Text style={styles.checkboxtext}>Check Box</Text> */}

                  <BouncyCheckbox
                  
                    size={30}
                    fillColor={colorcode}
                    unfillColor="#FFFFFF"
                    isChecked={checkboxvalue}
                    disableBuiltInState={true}
                    disabled={true}
                    iconStyle={{borderColor: '#f5dd4b', borderRadius: 5}}
                    innerIconStyle={{borderWidth: 3, borderRadius: 5}}
                    textStyle={{fontFamily: 'JosefinSans-Regular'}}
                  />

                </View>

              <View>
                <Text placeholder="Test" style={{color:'#42A5F5',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12,}} >Completed </Text>
              </View>

              </View>
              

              <View style={{flexDirection:"row",alignItems: 'center'}}>

                <View>
                    <Text placeholder="Test" style={{color:'#FF0000',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12}} > Pending Count : </Text>
                </View>
                <View>
                    <Text placeholder="Test" style={{justifyContent: 'flex-start',fontWeight: 'bold',color:'#FF0000',fontSize:12}} >{pending}</Text>
                </View>

              </View>
              
            </View>
              
              
          </View>
        </TouchableOpacity>   

        
      );
    };
    
    const ItemSeparatorView = () => {
      return (
        // Flat List Item Separator
        <View
        style={{
          height: 0.5,
          width: '100%',
          backgroundColor: '#C8C8C8',
        }}
      />
      );
    };
  
    const getItem = (item) => {
      // Function for click on an item
      //alert('Id : ' + item.itm_mst_stockno );
      navigation.navigate('StockTakeDetails',{
        Screenname:route.params.Screenname,
        Selected_itm_rcb_book_no:item.itm_rcb_book_no,
        Selected_itm_rcb_desc:item.itm_rcb_desc
      })
    
      
    };

  return (
    <SafeAreaProvider>

      <Appbar.Header style={{backgroundColor:"#42A5F5"}}>

        <View style={{flexDirection:'row',flex:1,justifyContent:'space-between'}}>

          <Pressable onPress={_goBack}>

            <View style={{flexDirection:'row',alignItems:'center',}}>

              <FontAwesome 
                  name="angle-left"
                  color='#fff'
                  size={55}
                  style={{marginLeft:12,marginBottom:5}}
                
              />  

              <Text style={{fontSize:20, justifyContent:'center',textAlign:'center',color:'#fff',fontWeight: 'bold',marginLeft:15}}>Stock Take</Text> 

            </View >

          </Pressable>

          

        </View>
      </Appbar.Header>

      <View style={styles.container}>

        <ProgressLoader
          visible={spinner}
          isModal={true} 
          isHUD={true}
          hudColor={"#808080"}
          color={"#FFFFFF"} />


          <FlatList
            data={StockTake}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator ={false}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={ItemSeparatorView}
            renderItem={ItemView}
          />
      </View>    

    </SafeAreaProvider> 
  )
}

export default StockTake

const styles = StyleSheet.create({

  container: {
    flex: 1 ,
       
  },

  
  view_2:{        
      
      flexDirection: 'row',       
      alignItems: 'stretch',
      justifyContent:'space-between',
      backgroundColor:"#FFFF",
      margin:5
  },
  view_3:{        
      
      flexDirection: 'row',       
      alignItems: 'stretch',
      justifyContent: 'center',
      backgroundColor:"#FFFF",
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