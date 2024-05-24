import React,{Fragment}from "react";
import {  View,StyleSheet, Text, Pressable,TouchableOpacity,FlatList,BackHandler,Image,Alert,Dimensions,Modal,SafeAreaView} from 'react-native';
import { Button,SearchBar } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressLoader from 'rn-progress-loader';
import { Appbar } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from "axios";
import DeviceInfo from 'react-native-device-info';
import { openDatabase } from 'react-native-sqlite-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {ImageBackground} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

var db = openDatabase({ name: 'CMMS.db' });

let BaseUrl,Site_cd,LoginID,EmpName,EmpID,EmpPhone,EmpWorkGrp;

const deviceWidth = Dimensions.get('screen').width;
const deviceHeight = Dimensions.get('screen').height;

const StockMaster = ({navigation,route}) => {

    const _goBack = () => {

        if(route.params.Screenname === 'StockMaster'){
          navigation.navigate('MainTabScreen')
        }else if(route.params.Screenname === 'InventoryDashboard' || route.params.Screenname === 'WoDashboard')
        {
            navigation.navigate('InventoryDashboard',{Screenname:route.params.Screenname})
        }
        
    }


    const[spinner, setspinner]= React.useState(false)
    const[colorcode1, setcolorcode1]= React.useState("#0096FF")
    const[colorcode2, setcolorcode2]= React.useState("#FFF")
    const[colorcode3, setcolorcode3]= React.useState("#FFF")

    const [search, setSearch] = React.useState('');
    const [AllStock,setAllStock] = React.useState("0");
    const [Below_Qty,setBelow_Qty] = React.useState("0");
    const [Normal_Qty,setNormal_Qty] = React.useState("0");

    const [StockMasterList,setStockMasterList] = React.useState([])
    const [filteredDataSource, setFilteredDataSource] = React.useState([]);


    //QR CODE
    const [showqrcode, setshowqrcode] = React.useState(false);
    const [scan, setscan] = React.useState(false);
    const [ScanResult, setScanResult] = React.useState(false);
    const [result, setresult] = React.useState(null);


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

    //   setspinner(true); 

    //    setTimeout(() => {

    //     setspinner(false); 

    //   }, 500)

    //   db.transaction(function(txn){           



    //     txn.executeSql( 'SELECT * FROM mrstockno', [], (tx, { rows }) => { 

    //       var len = rows.raw().length;
    //       setAllStock(len)
    //       console.log('ALL', len);

    //       setStockMasterList(rows.raw());
    //       setFilteredDataSource(rows.raw());

    //     });

    //     txn.executeSql("SELECT * FROM mrstockno where category='BELOW' ", [], (tx, { rows }) => { 

    //       var len = rows.raw().length;
    //       setBelow_Qty(len)
    //       console.log('BELOW', len);

    //     });

    //     txn.executeSql("SELECT * FROM mrstockno where category='NORMAL' ", [], (tx, { rows }) => { 

    //       var len = rows.raw().length;
    //       setNormal_Qty(len)
    //       console.log('NORMAL', len);

    //     });

      
    // });

   

   
      get_stockMaster_list();  
  
  
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
        console.log("MR-Stock_No JSON DATA " + `${BaseUrl}/get_inventory_stock_master_list.php?site_cd=${Site_cd}&status=ACTIVE&Folder=${SPLIT_URL3}&dvc_id=${dvc_id}&MobileURL=${BaseUrl}`)

        const response = await axios.get(`${BaseUrl}/get_inventory_stock_master_list.php?site_cd=${Site_cd}&status=ACTIVE&Folder=${SPLIT_URL3}&dvc_id=${dvc_id}&MobileURL=${BaseUrl}`);
        // console.log("JSON DATA DASHBOARD 2 : " + response.data.data)
        if (response.data.status === 'SUCCESS') {

          // if (response.data.data.length > 0) {

          //   db.transaction(function (tx) {

          //     tx.executeSql('DELETE FROM  mrstockno', [], (tx, results) => {
          //       console.log('mrstockno Results', results.rowsAffected);
          //       if (results.rowsAffected > 0) {
          //         console.log('mrstockno deleted successfully');
          //       } else {
          //         console.log('mrstockno unsuccessfully');
          //       }
          //     });

          //     let insertQuery = 'INSERT INTO mrstockno (RowID, itm_mst_stockno, itm_mst_costcenter, itm_mst_mstr_locn, itm_mst_desc, itm_mst_issue_price, itm_mst_ttl_oh, itm_det_part_deac_status, itm_det_order_pt, itm_det_ttl_oh, category, itm_mst_issue_uom, itm_mst_account, itm_mst_ext_desc,itm_mst_partno) VALUES';
          //     let values =[];
  
          //     response.data.data.forEach((record, index)=>{
  
          //       insertQuery +='(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?),';
          //       values.push(
          //         record.RowID,
          //         record.itm_mst_stockno,
          //         record.itm_mst_costcenter,
          //         record.itm_mst_mstr_locn,
          //         record.itm_mst_desc,
          //         record.itm_mst_issue_price,
          //         record.itm_mst_ttl_oh,
          //         record.itm_det_part_deac_status,
          //         record.itm_det_order_pt,
          //         record.itm_det_ttl_oh,
          //         record.category,
          //         record.itm_mst_issue_uom,
          //         record.itm_mst_account,
          //         record.itm_mst_ext_desc,
          //         record.itm_mst_partno,
          //       );
  
          //       // console.log( 'lopp ',index, values);
  
          //       const batchSize = 20;
          //       if((index +1)% batchSize === 0 || index === response.data.data.length -1){
          //         insertQuery = insertQuery.slice(0,-1);
          //         //console.log( 'lopp ',index, insertQuery);
          //         tx.executeSql(insertQuery,values,(tx,results)=>{
          //           if (results.rowsAffected > 0) {
          //             console.log('INSERT TABLE mrstockno Successfully')
          //           } else {
          //             console.log('INSERT TABLE mrstockno unsuccessfully')
          //           }
          //         });
  
          //         insertQuery = 'INSERT INTO mrstockno (RowID, itm_mst_stockno, itm_mst_costcenter, itm_mst_mstr_locn, itm_mst_desc, itm_mst_issue_price, itm_mst_ttl_oh, itm_det_part_deac_status, itm_det_order_pt, itm_det_ttl_oh, category, itm_mst_issue_uom, itm_mst_account, itm_mst_ext_desc,itm_mst_partno) VALUES';
          //         values =[];
  
          //       }
  
          //     })
  
          //   })

          // }


          setcolorcode1('#0096FF')
          setcolorcode2('#FFF')
          setcolorcode3('#FFF')
  

          console.log(response.data.data.length) 

          let N =0,B=0;
          for (let i = 0; i < response.data.data.length; ++i) {
            if(response.data.data[i].category == 'NORMAL'){

              N++

            }else{
             B++
            }
            
          }

          console.log('NORMAL', N) 
          console.log('BELOW', B) 

          setAllStock(response.data.data.length)
          setBelow_Qty(B)
          setNormal_Qty(N)

          setStockMasterList(response.data.data);
          setFilteredDataSource(response.data.data);
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

    //Button 
    const Button_select_list =(e)=>{

      setspinner(true); 
      setTimeout(() => {

        setspinner(false); 

      }, 500)

      if(e == 'ALL_STOCK'){

        setcolorcode1('#0096FF')
        setcolorcode2('#FFF')
        setcolorcode3('#FFF')

        // db.transaction(function(txn){     
          
          
        //   txn.executeSql( 'SELECT * FROM mrstockno', [], (tx, { rows }) => { 

        //     var len = rows.raw().length;
        //     console.log('ALL', len);
        //     setStockMasterList(rows.raw());
        //     setFilteredDataSource(rows.raw());
  
        //   });

        // });

        setFilteredDataSource(StockMasterList);
       

      }else if(e == 'MIN'){

        setcolorcode1('#FFF')
        setcolorcode2('#0096FF')
        setcolorcode3('#FFF')

        const newData = StockMasterList.filter(function (item) {
          //const itemData = item.ast_mst_asset_no ? item.ast_mst_asset_no.toUpperCase() : ''.toUpperCase();
            //const itemData = item.ast_mst_asset_no.toUpperCase(),;
            const itemData = `${item.category.toUpperCase()}`
        
            const textData = 'BELOW';
            return itemData.indexOf(textData) > -1;
        });
        setFilteredDataSource(newData);
        

        // db.transaction(function(txn){    
          
        //   txn.executeSql("SELECT * FROM mrstockno where category='BELOW'", [], (tx, { rows }) => { 

        //     var len = rows.raw().length;
        //     console.log('BELOW', len);
        //     setStockMasterList(rows.raw());
        //     setFilteredDataSource(rows.raw());
  
        //   });

        // });

      }else if(e == 'NORMAL'){

        setcolorcode1('#FFF')
        setcolorcode2('#FFF')
        setcolorcode3('#0096FF')

        const newData = StockMasterList.filter(function (item) {
          //const itemData = item.ast_mst_asset_no ? item.ast_mst_asset_no.toUpperCase() : ''.toUpperCase();
            //const itemData = item.ast_mst_asset_no.toUpperCase(),;
            const itemData = `${item.category.toUpperCase()}`
        
            const textData = 'NORMAL';
            return itemData.indexOf(textData) > -1;
        });
        setFilteredDataSource(newData);
       


        // db.transaction(function(txn){    
          
        //   txn.executeSql("SELECT * FROM mrstockno where category='NORMAL'", [], (tx, { rows }) => { 

        //     var len = rows.raw().length;
        //     console.log('NORMAL', len);
        //     setStockMasterList(rows.raw());
        //     setFilteredDataSource(rows.raw());
  
        //   });

          
          
        // });


      }

      

    }

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

      var ast_color;
      if(item.category === 'NORMAL'){
        ast_color ='#8BC34A'
      }else if(item.category === 'BELOW'){
        ast_color ='#FF0000'
      }

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
        //   <View style={styles.item}>

        //       <View style={{flex:1,justifyContent:'space-between',flexDirection:'row'}}>
        //       <Text style={{color:'#2962FF',fontSize: 13,backgroundColor:'#D6EAF8',padding:10, fontWeight: 'bold',borderRadius:10,fontSize:12}} > {item.itm_mst_stockno}</Text>
        //       <Text style={{fontSize: 16,color:'#8BC34A',fontWeight: 'bold',fontSize:12}} >{item.itm_det_part_deac_status}</Text>
        //       </View>

        //       <View style={{flexDirection:"row",marginTop:10}}>
        //         <View style={{width:'40%'}}>
        //             <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12}} >Cost Center :</Text>
        //         </View>
        //         <View style={{flex:1}}>
        //             <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000',fontSize:12}} >{item.itm_mst_costcenter}</Text>
        //         </View>
        //       </View>

        //       <View style={{flexDirection:"row",marginTop:2}}>
        //         <View style={{width:'40%'}}>
        //             <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12}} >Master Location :</Text>
        //         </View>
        //         <View style={{flex:1}}>
        //             <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000',fontSize:12}} >{item.itm_mst_mstr_locn}</Text>
        //         </View>

        //       </View>

        //       <View style={{flexDirection:"row",marginTop:2}}>
        //         <View style={{width:'40%'}}>
        //             <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12}} >Description :</Text>
        //         </View>
        //         <View style={{flex:1}}>
        //             <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000',fontSize:12}} >{item.itm_mst_desc}</Text>
        //         </View>
        //       </View>

        //       <View style={{flexDirection:"row",marginTop:2}}>
        //         <View style={{width:'40%'}}>
        //             <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12}} >Extended Desc :</Text>
        //         </View>
        //         <View style={{flex:1}}>
        //             <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000',fontSize:12}} >{item.itm_mst_ext_desc}</Text>
        //         </View>
        //       </View>

        //       <View style={{flexDirection:"row",marginTop:2}}>
        //         <View style={{width:'40%'}}>
        //             <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12}} >Part No :</Text>
        //         </View>
        //         <View style={{flex:1}}>
        //             <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000',fontSize:12}} >{item.itm_mst_partno}</Text>
        //         </View>
        //       </View>

        //       <View style={{flexDirection:"row",marginTop:2,justifyContent:'space-between',}}>

        //         <View style={{flexDirection:"row"}}>

        //           <View>
        //               <Text placeholder="Test" style={{color:'#FF5733',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12,}} >Min Qty : </Text>
        //           </View>
        //           <View>
        //               <Text placeholder="Test" style={{justifyContent: 'flex-start',fontWeight: 'bold',color:'#FF5733',fontSize:12,}} >{val_min}</Text>
        //           </View>

        //         </View>
                

        //          <View style={{flexDirection:"row"}}>

        //           <View >
        //               <Text placeholder="Test" style={{color:'#FF5733',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12}} >Total OH : </Text>
        //           </View>
        //           <View >
        //               <Text placeholder="Test" style={{justifyContent: 'flex-start',fontWeight: 'bold',color:'#FF5733',fontSize:12}} >{val_total}</Text>
        //           </View>
        //         </View>

        //         <View style={{flexDirection:"row"}}>

        //           <View>
        //               <Text placeholder="Test" style={{color:'#FF5733',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12}} >Issue Price : </Text>
        //           </View>
        //           <View>
        //               <Text placeholder="Test" style={{justifyContent: 'flex-start',fontWeight: 'bold',color:'#FF5733',fontSize:12}} >{val_issue}</Text>
        //           </View>

        //         </View>

                
        //       </View>
              
              
        //   </View>
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


    //QR Code
    const OpenQRCode = () => {
      setshowqrcode(true);
      scanAgain(true);
    };

    const onSuccess = e => {
      console.log(JSON.stringify(e));
  
      const check = e.data.substring(0, 4);
      console.log('scanned data' + e.data);
     
      setresult(e);

      if ( e.data) {
        // Inserted text is not blank
        // Filter the masterDataSource
        // Update FilteredDataSource
        const newData = StockMasterList.filter(function (item) {
          //const itemData = item.ast_mst_asset_no ? item.ast_mst_asset_no.toUpperCase() : ''.toUpperCase();
            //const itemData = item.ast_mst_asset_no.toUpperCase(),;
            const itemData = `${item.itm_mst_stockno.toUpperCase()}`
        
          const textData =  e.data.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
        setFilteredDataSource(newData);
        setSearch(e.data);
      } else {
        // Inserted text is blank
        // Update FilteredDataSource with masterDataSource
        setFilteredDataSource(StockMasterList);
        setSearch(e.data);
      }

      
      setscan(false);
      setScanResult(false);
      setshowqrcode(false);
  
      
    };
  
    const activeQR = () => {
      setscan(true);
    };

    const scanAgain = () => {
      setscan(true), setScanResult(false);
    };

    const scanAgain2 = () => {
      setscan(false), setScanResult(false);
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
              <Text style={{fontSize:20, justifyContent:'center',textAlign:'center',color:'#fff',fontWeight: 'bold',marginLeft:15}}>Stock Master</Text> 
            </View >
          </Pressable>

          {/* <View style={{flexDirection:'row',alignItems:'center'}}>
            <Pressable onPress={()=> get_stockMaster_list()}>
              <View style={{justifyContent:'center',alignItems:'center'}}>
                <Text style={{fontSize:12, justifyContent:'center',textAlign:'center',color:'#fff',fontWeight: 'bold',marginRight:25}}>Refresh</Text> 
                <FontAwesome 
                  name="refresh"
                  color='#fff'
                  size={25}
                  style={{marginRight:20,marginBottom:5}}
                /> 
              </View>
            </Pressable>
          </View> */}
        </View>
      </Appbar.Header>

    <View style={styles.container}>

      <ProgressLoader visible={spinner} isModal={true} isHUD={true} hudColor={"#808080"} color={"#FFFFFF"} />

      <Modal visible={showqrcode}>
        <View style={styles.scrollViewStyle}>
          <Fragment>
            <SafeAreaView style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text></Text>
              <TouchableOpacity onPress={() => setshowqrcode(false)}>
                <AntDesign name="close" color="#fff" size={30} style={{marginRight: 35, marginTop: 15}} />
              </TouchableOpacity>
            </SafeAreaView>
            {!scan && !ScanResult && (
              <View style={styles.qr_cardView}>
                <Image source={require('../../images/camera.png')} style={{height: 36, width: 36}}></Image>
                <Text numberOfLines={8} style={styles.descText}> Please move your camera {'\n'} over the QR Code </Text>
                <Image source={require('../../images/qrcodescan.png')} style={{margin: 20}}></Image>
                <TouchableOpacity onPress={activeQR} style={styles.buttonScan}>
                  <View style={styles.buttonWrapper}>
                    {/* <Image source={require('../../images/camera.png')} style={{height: 36, width: 36}}></Image> */}
                    <Text style={{...styles.buttonTextStyle, color: '#2196f3'}}> Scan QR Code </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            {ScanResult && (
              <Fragment>
                <Text style={styles.textTitle1}>Result</Text>
                <View style={ScanResult ? styles.scanCardView : styles.cardView}>
                  <Text>Type : {result.type}</Text>
                  <Text>Result : {result.data}</Text>
                  <Text numberOfLines={1}>RawData: {result.rawData}</Text>
                  <TouchableOpacity
                    onPress={scanAgain}
                    style={styles.buttonScan}>
                    <View style={styles.buttonWrapper}>
                      {/* <Image source={require('./images/camera.png')} style={{height: 36, width: 36}}></Image> */}
                      <Text style={{...styles.buttonTextStyle, color: '#2196f3'}}> Click to scan again </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </Fragment>
            )}
            {scan && (
              <QRCodeScanner
                reactivate={true}
                showMarker={true}
                //  ref={(node) => { this.scanner = node }}
                onRead={onSuccess}
                topContent={ <Text style={styles.centerText}> Please move your camera {'\n'} over the QR Code </Text> }
                bottomContent={
                  <View>
                    <ImageBackground style={styles.bottomContent}>
                      {/* <TouchableOpacity style={styles.buttonScan2} onPress={() => this.scanner.reactivate()} onLongPress={() => this.setState({ scan: false })}> <Image source={require('../../images/camera.png')}></Image> </TouchableOpacity> */}
                      <TouchableOpacity onPress={scanAgain2}>
                        <View>
                          {/* <Image source={require('./images/camera.png')} style={{height: 36, width: 36}}></Image> */}
                          <Text style={{ color: '#FFFF', textAlign: 'center', fontSize: 18, fontWeight: 'bold', }}> Cancel Scan </Text>
                        </View>
                      </TouchableOpacity>
                    </ImageBackground>
                  </View>
                }
              />
            )}
          </Fragment>
        </View>
      </Modal>


      <View style={styles.view_2}> 

        <Button
          title="All Stock"
          titleStyle={{ color: "white", fontSize: 15, fontWeight: 'bold'}}
          onPress={() =>Button_select_list("ALL_STOCK")}
          buttonStyle={{ backgroundColor: '#F4D03F', borderRadius: 3}}
          containerStyle={{ flex: 1, marginHorizontal: 3}}
        /> 

        <Button
          title="Below Min Qty"
          titleStyle={{ color: "white", fontSize: 15, fontWeight: 'bold', }}
          onPress={() =>Button_select_list("MIN")}
          buttonStyle={{ backgroundColor: '#FF0000', borderRadius: 3}}
          containerStyle={{ flex: 1, marginHorizontal: 3}}
        />  
    
        <Button
          title="Normal Lev Qty"
          titleStyle={{ color: "white", fontSize: 15, fontWeight: 'bold'}}
          onPress={() =>Button_select_list("NORMAL")}
          buttonStyle={{ backgroundColor: '#8BC34A', borderRadius: 3}}
          containerStyle={{ flex: 1, marginHorizontal: 3}}
        /> 

      </View> 

      <View style={styles.view_4}> 
          <View style={{flex:1,backgroundColor:colorcode1,height:2,marginHorizontal:5} }></View>
          <View style={{flex:1,backgroundColor:colorcode2,height:2,marginHorizontal:5}}></View>
          <View style={{flex:1,backgroundColor:colorcode3,height:2,marginHorizontal:5}}></View>
      </View>

      <View style={styles.view_3}> 
          <Text style={{color:'#F4D03F', fontSize: 14,fontWeight: "bold",flex: 1,textAlign: 'center',alignItems:'center',justifyContent:'center'}}>{AllStock}</Text>
          <Text style={{color:'#FF0000', fontSize: 14,fontWeight: "bold",flex: 1,textAlign: 'center',alignItems:'center',justifyContent:'center'}}>{Below_Qty}</Text>
          <Text style={{color:'#8BC34A', fontSize: 14,fontWeight: "bold",flex: 1,textAlign: 'center',alignItems:'center',justifyContent:'center'}}>{Normal_Qty}</Text>
      </View>


        <View style={styles.view_5}> 

          <SearchBar
            lightTheme
            round
            containerStyle={{flex:1}}
            inputStyle={{color:'#000'}}
            inputContainerStyle={{backgroundColor:'#fff'}}
            searchIcon={{ size: 24 }}
            onChangeText={(text) => searchFilterFunction(text)}
            onClear={(text) => searchFilterFunction('')}
            placeholder="Search here..."
            value={search}
          /> 

          <MaterialIcons
            name="qr-code-scanner"
            color={'#05375a'}
            size={45}
            style={{marginRight:5}}
            onPress={OpenQRCode}
          />


        </View>

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

export default StockMaster

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
        backgroundColor:"#FFFF",
        paddingTop:5,
        paddingBottom:5
    },
    view_4:{        
        
      flexDirection: 'row',
      alignItems: 'stretch',
      backgroundColor:"#FFFF"  ,
      paddingTop:5
     
  },
  view_5:{        
        
    flexDirection: 'row',       
    justifyContent: 'center',
    textAlign: 'center',
    alignItems:'center',
    marginHorizontal:5,
    backgroundColor:"#E5E7E9",
  },
  
    item:{
   
      backgroundColor: '#fff',
      marginLeft: 8,
      marginRight:8,
      marginTop:6,
      borderRadius: 10,
        
    
    },
    
    //SCAN QR CODE STYLES
scrollViewStyle: {
  flex: 1,
  justifyContent: 'flex-start',
  backgroundColor: '#2196f3',
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
  backgroundColor: 'white',
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
  backgroundColor: 'white',
},
buttonWrapper: {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
},
buttonScan: {
  borderWidth: 2,
  borderRadius: 10,
  borderColor: '#258ce3',
  paddingTop: 5,
  paddingRight: 25,
  paddingBottom: 5,
  paddingLeft: 25,
  marginTop: 20,
},
buttonScan2: {
  marginLeft: deviceWidth / 2 - 50,
  width: 100,
  height: 100,
},
descText: {
  padding: 16,
  textAlign: 'center',
  fontSize: 16,
},
  
  });
  