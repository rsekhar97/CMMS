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
import { openDatabase } from 'react-native-sqlite-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
var db = openDatabase({ name: 'CMMS.db' });
import BouncyCheckbox from 'react-native-bouncy-checkbox';

let BaseUrl,Site_cd,LoginID,EmpName,EmpID,EmpPhone,EmpWorkGrp;

const StockMasterLocation = ({navigation,route}) => {

    const _goBack = () => {

        navigation.navigate('StockMasterDetails',{
            Screenname:route.params.Screenname,
            Selected_Stock_no:route.params.Selected_Stock_no
          })
       
        
    }

    const[spinner, setspinner]= React.useState(false);
    const [StockMasterList,setStockMasterList] = React.useState([]);

    React.useEffect(() => {            

        const focusHander = navigation.addListener('focus', ()=>{


            fetchData();
            console.log('stock_no: ',route.params.Selected_Stock_no)
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
    
    
      };

       // STEP : 1 GET Stock Master LIST API
       const get_stockMaster_list =(async ()=>{

        let select_stockno = route.params.Selected_Stock_no;
        setspinner(true); 
  
        try{

          console.log("MR-Stock_No JSON DATA " + `${BaseUrl}/get_inventory_location_by_params.php?site_cd=${Site_cd}&itm_mst_stockno=${select_stockno}`)
          const response = await axios.get(`${BaseUrl}/get_inventory_location_by_params.php?site_cd=${Site_cd}&itm_mst_stockno=${select_stockno}`);
         // console.log("JSON DATA DASHBOARD 2 : " + response.data.data)
          if (response.data.status === 'SUCCESS') {

            //console.log(response.data.data) 
            setStockMasterList(response.data.data);
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

        let loc;

        if(item.itm_loc_oh_qty == '.0000'){
            loc = '0'
        }else{
            loc = item.itm_loc_oh_qty
        }

        let val_loc = parseFloat(loc).toFixed(2);

        if (item.itm_loc_prim_locn_flg === '0') {
            var checkboxvalue = false;
            var colorcode = '#808080';
          } else {
            var checkboxvalue = true;
            var colorcode = '#808080';
          }
        
       
  
        return (
        
  
         
            <View style={styles.item}>

                <View style={{flex:1,justifyContent:'space-between',flexDirection:'row',alignItems: 'center'}}>

                    <View style={{flex:1,padding:8, marginRight:2,alignItems: 'center',borderRadius:10}}>
                        <Text style={{color:'#2962FF',fontSize: 13, fontWeight: 'bold',justifyContent:'center',alignContent:'center',alignItems:'center'}} > {'Primary Loc'}</Text>
                    </View>

                    <View style={{flex:1,padding:8, marginRight:2,alignItems: 'center',borderRadius:10}}>
                        <Text style={{color:'#2962FF',fontSize: 13, fontWeight: 'bold',justifyContent:'center',alignContent:'center',alignItems:'center'}} > {'Stock Loc'}</Text>
                    </View>

                    <View style={{flex:1,padding:8, marginRight:2,alignItems: 'center',borderRadius:10}}>
                        <Text style={{color:'#2962FF',fontSize: 13, fontWeight: 'bold',justifyContent:'center',alignContent:'center',alignItems:'center'}} > {item.itm_loc_stk_loc}</Text>
                    </View>
                    
                </View>

                <View style={{flex:1,justifyContent:'space-between',flexDirection:'row',alignItems: 'center'}}>

                    <View style={{flex:1,padding:8, marginRight:2,alignItems: 'center',borderRadius:10}}>
                        <BouncyCheckbox

                            style={{flex:1,marginTop: 10}}
                            size={35}
                            fillColor={colorcode}
                            unfillColor="#FFFFFF"
                            isChecked={checkboxvalue}
                            disableBuiltInState={true}
                            disabled={true}
                            iconStyle={{borderColor: '#f5dd4b', borderRadius: 10}}
                            innerIconStyle={{borderWidth: 3, borderRadius: 10}}
                            textStyle={{fontFamily: 'JosefinSans-Regular'}}
                        
                        />
                    </View>

                    <View style={{flex:1,padding:8, marginRight:2,alignItems: 'center',borderRadius:10}}>
                        <Text style={{color:'#E65100',fontSize: 13, fontWeight: 'bold',justifyContent:'center',alignContent:'center',alignItems:'center'}} > {'QH Quantity'}</Text>
                    </View>

                    <View style={{flex:1,padding:8, marginRight:2,alignItems: 'center',borderRadius:10}}>
                        <Text style={{color:'#2Ecc71',fontSize: 13, fontWeight: 'bold',justifyContent:'center',alignContent:'center',alignItems:'center'}} > {val_loc}</Text>
                    </View>

                   
                </View>
                
            </View>
         
  
          
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
                        style={{marginLeft:15,marginBottom:5}}
                        
                    />  

                    <Text style={{fontSize:20, justifyContent:'center',textAlign:'center',color:'#fff',fontWeight: 'bold',marginLeft:15}}>Stock Location</Text> 

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
                data={StockMasterList}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator ={false}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={ItemSeparatorView}
                renderItem={ItemView}/>
        </View>    

    </SafeAreaProvider>
  )
}

export default StockMasterLocation

const styles = StyleSheet.create({

    container: {
      flex: 1 ,
         
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