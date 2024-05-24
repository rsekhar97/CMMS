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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DeviceInfo from 'react-native-device-info';
var db = openDatabase({ name: 'CMMS.db' });

const StockBelowMinQty = ({navigation,route}) => {

    const [search, setSearch] = React.useState('');
    const[spinner, setspinner]= React.useState(false);
    const [StockMasterList,setStockMasterList] = React.useState([]);
    const [filteredDataSource, setFilteredDataSource] = React.useState([]);


    const _goBack = () => {

        if(route.params.Screenname === 'InventoryDashboard' || route.params.Screenname === 'WoDashboard'){
          navigation.navigate('InventoryDashboard')
        }
        
    }

    const backAction = () => {
        Alert.alert("Alert", "Do you want to exit Stock Below Min Quantity?", [
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

    //     setspinner(true); 

    //    setTimeout(() => {

    //     setspinner(false); 

    //   }, 5000)

    //     db.transaction(function(txn){           

        

    //         txn.executeSql("SELECT * FROM mrstockno where category='BELOW' ", [], (tx, { rows }) => { 

    //             var len = rows.raw().length;
    //             console.log('BELOW', len);

    //             setStockMasterList(rows.raw());
    //             setFilteredDataSource(rows.raw());

    //         });

        

      
    //     });
       

        get_stockMaster_list()
    };


     // STEP : 1 GET Stock Master LIST API
     const get_stockMaster_list =(async ()=>{

      
        setspinner(true); 
  
        const SPLIT_URL = BaseUrl.split('/');
        const SPLIT_URL1 = SPLIT_URL[SPLIT_URL.length - 2];
        const SPLIT_URL2 = SPLIT_URL[SPLIT_URL.length - 1];
        const SPLIT_URL3 = SPLIT_URL1+'/'+SPLIT_URL2
        let dvc_id = DeviceInfo.getDeviceId();
  
        try{
          console.log("MR-Stock_No JSON DATA " + `${BaseUrl}/get_inventory_stock_master_below_list.php?site_cd=${Site_cd}&Folder=${SPLIT_URL3}&dvc_id=${dvc_id}&MobileURL=${BaseUrl}`)
  
          const response = await axios.get(`${BaseUrl}/get_inventory_stock_master_below_list.php?site_cd=${Site_cd}&Folder=${SPLIT_URL3}&dvc_id=${dvc_id}&MobileURL=${BaseUrl}`);
          // console.log("JSON DATA DASHBOARD 2 : " + response.data.data)
          if (response.data.status === 'SUCCESS') {
  
            if (response.data.data.length > 0) {

                setStockMasterList(response.data.data);
                // const newData = StockMasterList.filter(function (item) {
                // //const itemData = item.ast_mst_asset_no ? item.ast_mst_asset_no.toUpperCase() : ''.toUpperCase();
                //     //const itemData = item.ast_mst_asset_no.toUpperCase(),;
                //     const itemData = `${item.category.toUpperCase()}`
                
                //     const textData = 'BELOW';
                //     return itemData.indexOf(textData) > -1;
                // });
                setFilteredDataSource(response.data.data);
                setspinner(false);

               
  
            }else{

                setspinner(false);
  
            }
  
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

      

    const searchFilterFunction = (text) => {
        // Check if searched text is not blank
        if (text) {
            // Inserted text is not blank
            // Filter the masterDataSource
            // Update FilteredDataSource
            const newData = StockMasterList.filter(function (item) {
            //const itemData = item.ast_mst_asset_no ? item.ast_mst_asset_no.toUpperCase() : ''.toUpperCase();
                //const itemData = item.ast_mst_asset_no.toUpperCase(),;
                const itemData = `${item.itm_mst_stockno.toUpperCase()}
                ,${item.itm_mst_desc.toUpperCase()}
                ,${item.itm_mst_mstr_locn.toUpperCase()})`
            
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
            });
            setFilteredDataSource(newData);
            setSearch(text);
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            setFilteredDataSource(StockMasterList);
            setSearch(text);
        }
    };
    
    const ItemView = ({ item }) => {

    let min,issue,total;

    if(item.itm_det_order_pt == '.0000'){
        min = '0'
    }else{
        min = item.itm_det_order_pt
    }

    if(item.itm_mst_issue_price == '.0000'){
        issue = '0'
    }else{
        issue = item.itm_mst_issue_price
    }

    if(item.itm_mst_ttl_oh == '.0000'){
        total = '0'
    }else{
        total = item.itm_mst_ttl_oh
    }
    
        
    let val_min = parseFloat(min).toFixed(2);
    let val_issue = parseFloat(issue).toFixed(2);
    let val_total = parseFloat(total).toFixed(2);

    let link
    if(item.attachment === null){
    link = '0'
    }else{
    link = '1' 
    }

    var  ast_color ='#8BC34A';
    
    

    return (
    
        <TouchableOpacity onPress={() => getItem(item)} > 
          <View style={[styles.item,{borderLeftWidth:9,borderLeftColor:ast_color}]}>
            <View style={{ flex: 1,flexDirection: 'row'}}>
              <View style={{ width: '35%'}}>
                <View style={{height:'100%',borderTopLeftRadius:10,borderBottomLeftRadius:10, alignItems: 'center',justifyContent: 'center',}}>
                  {
                    link === '1' &&
                    <Image source={{uri:item.attachment}}  style={{width: '100%', height: '100%',}} />
                    ||

                    link === '0' &&
                    <Image source={require('../../images/gallery2.jpeg')} style={{width: '30%', height: '30%',borderTopLeftRadius:10,borderBottomLeftRadius:10,} }resizeMode="contain" />
                  }
                </View> 
              </View>
              <View style={{ flex: 1,margin:10 }}>
                <View style={{ flexDirection: 'row', marginTop:5 }}>
                  <MaterialCommunityIcons
                    name="alpha-s-circle-outline"
                    color={'#05375a'}
                    size={20}/>
                    <Text style={{flex: 1,color: '#05375a', fontSize: 12, marginLeft:10 }}>{item.itm_mst_stockno }</Text>
                  <Text style={{color: '#05375a', fontSize: 12, }}>{item.itm_det_part_deac_status}</Text>
                </View>

                <View style={{ flexDirection: 'row',marginTop:5 }}>
                  <MaterialCommunityIcons
                    name="align-horizontal-left"
                    color={'#05375a'}
                    size={20}/>
                  <Text style={{ flex: 1,color: '#05375a', fontSize: 12, marginLeft:10 }}>{item.itm_mst_desc}</Text>
                </View>

                <View style={{ flexDirection: 'row',marginTop:5 }}>
                  <MaterialCommunityIcons
                    name="archive-cog-outline"
                    color={'#05375a'}
                    size={20}/>
                  <Text style={{ flex: 1,color: '#05375a', fontSize: 12, marginLeft:10 }}>{'Cost center '+item.itm_mst_costcenter}</Text>
                </View>

                <View style={{flexDirection: 'row',marginTop:5 }}>
                  <MaterialCommunityIcons
                    name="google-maps"
                    color={'#05375a'}
                    size={20}/>
                  <Text style={{ flex: 1,color: '#05375a', fontSize: 12, marginLeft:10}}>{item.itm_mst_mstr_locn}</Text>
                </View>

                <View style={{ flexDirection: 'row',marginTop:5 }}>
                  <MaterialCommunityIcons
                    name="cart-check"
                    color={'#05375a'}
                    size={20}/>
                  <Text style={{ flex: 1,color: '#05375a', fontSize: 12, marginLeft:10 }}>{val_total+' (RM '+val_issue+')'}</Text>
                </View>  
            </View>
        </View>
        </View>
      </TouchableOpacity>
      

        // <TouchableOpacity onPress={() => getItem(item)}>
        // <View style={styles.item}>

        //     <View style={{flex:1,justifyContent:'space-between',flexDirection:'row'}}>
        //     <Text style={{color:'#2962FF',fontSize: 13,backgroundColor:'#D6EAF8',padding:10, fontWeight: 'bold',borderRadius:10,fontSize:12}} > {item.itm_mst_stockno}</Text>
        //     <Text style={{fontSize: 16,color:'#8BC34A',fontWeight: 'bold',fontSize:12}} >{item.itm_det_part_deac_status}</Text>
        //     </View>

        //     <View style={{flexDirection:"row",marginTop:10}}>
        //         <View style={{width:'40%'}}>
        //             <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12}} >Cost Center :</Text>
        //         </View>
        //         <View style={{flex:1}}>
        //             <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000',fontSize:12}} >{item.itm_mst_costcenter}</Text>
        //         </View>
        //     </View>

        //     <View style={{flexDirection:"row",marginTop:2}}>
        //         <View style={{width:'40%'}}>
        //             <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12}} >Master Location :</Text>
        //         </View>
        //         <View style={{flex:1}}>
        //             <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000',fontSize:12}} >{item.itm_mst_mstr_locn}</Text>
        //         </View>

        //     </View>

        //     <View style={{flexDirection:"row",marginTop:2}}>
        //         <View style={{width:'40%'}}>
        //             <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12}} >Description :</Text>
        //         </View>
        //         <View style={{flex:1}}>
        //             <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000',fontSize:12}} >{item.itm_mst_desc}</Text>
        //         </View>
        //     </View>

        //     <View style={{flexDirection:"row",marginTop:2}}>
        //         <View style={{width:'40%'}}>
        //             <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12}} >Extended Desc :</Text>
        //         </View>
        //         <View style={{flex:1}}>
        //             <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000',fontSize:12}} >{item.itm_mst_ext_desc}</Text>
        //         </View>
        //     </View>

        //     <View style={{flexDirection:"row",marginTop:2}}>
        //         <View style={{width:'40%'}}>
        //             <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12}} >Part No :</Text>
        //         </View>
        //         <View style={{flex:1}}>
        //             <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000',fontSize:12}} >{item.itm_mst_partno}</Text>
        //         </View>
        //     </View>

        //     <View style={{flexDirection:"row",marginTop:2,justifyContent:'space-between',}}>

        //         <View style={{flexDirection:"row"}}>

        //         <View>
        //             <Text placeholder="Test" style={{color:'#FF5733',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12,}} >Min Qty : </Text>
        //         </View>
        //         <View>
        //             <Text placeholder="Test" style={{justifyContent: 'flex-start',fontWeight: 'bold',color:'#FF5733',fontSize:12,}} >{val_min}</Text>
        //         </View>

        //         </View>
                

        //         <View style={{flexDirection:"row"}}>

        //         <View>
        //             <Text placeholder="Test" style={{color:'#FF5733',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12}} >Issue Price : </Text>
        //         </View>
        //         <View>
        //             <Text placeholder="Test" style={{justifyContent: 'flex-start',fontWeight: 'bold',color:'#FF5733',fontSize:12}} >{val_issue}</Text>
        //         </View>

        //         </View>

                

        //         <View style={{flexDirection:"row"}}>

        //         <View >
        //             <Text placeholder="Test" style={{color:'#FF5733',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12}} >Total OH : </Text>
        //         </View>
        //         <View >
        //             <Text placeholder="Test" style={{justifyContent: 'flex-start',fontWeight: 'bold',color:'#FF5733',fontSize:12}} >{val_total}</Text>
        //         </View>
        //         </View>

                
        //     </View>
            
            
        // </View>
        // </TouchableOpacity>   

        
    );
    };
    
    const ItemSeparatorView = () => {
    return (
        // Flat List Item Separator
        <View
        style={{
        height: 0,
        width: '100%',
        backgroundColor: '#C8C8C8',
        }}
    />
    );
    };
    
    const getItem = (item) => {
    // Function for click on an item
    //alert('Id : ' + item.itm_mst_stockno );
    navigation.navigate('StockMasterDetails',{
        Screenname:route.params.Screenname,
        Selected_Stock_no:item.itm_mst_stockno
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

                        <Text style={{fontSize:20, justifyContent:'center',textAlign:'center',color:'#fff',fontWeight: 'bold',marginLeft:15}}>Stock Below Min Quantity</Text> 

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

                <SearchBar
                    lightTheme
                    round
                    inputStyle={{color:'#000'}}
                    inputContainerStyle={{backgroundColor:'#fff'}}
                    searchIcon={{ size: 24 }}
                    onChangeText={(text) => searchFilterFunction(text)}
                    onClear={(text) => searchFilterFunction('')}
                    placeholder="Search here..."
                    value={search}
                />

                <FlatList
                    data={filteredDataSource}
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

export default StockBelowMinQty

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
      marginLeft: 8,
      marginRight:8,
      marginTop:6,
      borderRadius: 10,
        
    },
    
  
});
  