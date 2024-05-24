import React,{Fragment}from "react";
import {  View,StyleSheet, Text, Alert,Image, Pressable, Modal,Dimensions,TouchableOpacity, FlatList, SafeAreaView,BackHandler} from 'react-native';
import { Button,SearchBar } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { openDatabase } from 'react-native-sqlite-storage';
import ProgressLoader from 'rn-progress-loader';
import { Appbar } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import axios from "axios";
import moment from 'moment';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {ImageBackground} from 'react-native';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';
import DeviceInfo from 'react-native-device-info';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

var db = openDatabase({ name: 'CMMS.db' });

let BaseUrl,Site_cd,LoginID,EmpName,EmpID,EmpPhone,EmpWorkGrp;
const deviceWidth = Dimensions.get('screen').width;
const deviceHeight = Dimensions.get('screen').height;

const AssetListing = ({route,navigation}) =>{    

  

  const _goBack = () => {
    
    if(route.params.Screenname === 'ScanAssetScreen'){
      navigation.navigate('MainTabScreen')
    }else{
      navigation.navigate('FilteringAsset')
    }

    return true;
  }

   
    const[spinner, setspinner]= React.useState(true)

    const[colorcode1, setcolorcode1]= React.useState("#0096FF")
    const[colorcode2, setcolorcode2]= React.useState("#FFF")
    const[colorcode3, setcolorcode3]= React.useState("#FFF")

   
    const [search, setSearch] = React.useState('');
    const [Active,setActive] = React.useState("0");
    const [Deactivate,setDeactivate] = React.useState("0");
    const [Disposed,setDisposed] = React.useState("0");

    const[colorcode4, setcolorcode4]= React.useState("#FFF")
    const[status, setstatus]= React.useState("")

    const [AssetList,setAssetList] = React.useState([])
    const [filteredDataSource, setFilteredDataSource] = React.useState([]);

    //QR CODE
    const [showqrcode, setshowqrcode] = React.useState(false);
    const [scan, setscan] = React.useState(false);
    const [ScanResult, setScanResult] = React.useState(false);
    const [result, setresult] = React.useState(null);

    const backAction = () => {
    
      setAlert_two(true,'info','Do you want to exit asset listing?')
      return true;
    };

    
     //Alert
     const [Show, setShow] = React.useState(false);
     const [Show_two, setShow_two] = React.useState(false);
     const [Theme, setTheme] = React.useState('');
     const [Title, setTitle] = React.useState('');
   
  
    React.useEffect(() => {
      BackHandler.addEventListener("hardwareBackPress", backAction);
  
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", backAction);
    }, []);
  


    React.useEffect(() => {
      const focusHander = navigation.addListener('focus', ()=>{
        fetchData();
      });
      return focusHander;

    },[navigation,route]);


    const fetchData = async ()=>{
           
      BaseUrl = await AsyncStorage.getItem('BaseURL');
      Site_cd = await AsyncStorage.getItem('Site_Cd');
      LoginID = await AsyncStorage.getItem('emp_mst_login_id');
      EmpName = await AsyncStorage.getItem('emp_mst_name');
      EmpID = await AsyncStorage.getItem('emp_mst_empl_id');
      EmpPhone = await AsyncStorage.getItem('emp_mst_homephone');
      EmpWorkGrp = await AsyncStorage.getItem('emp_det_work_grp'); 

      setSearch('')

      get_asset_listing();     
     
    };
   
   
    const get_asset_listing = (async () =>{

      setspinner(true);

      const SPLIT_URL = BaseUrl.split('/');
      const SPLIT_URL1 = SPLIT_URL[SPLIT_URL.length - 2];
      const SPLIT_URL2 = SPLIT_URL[SPLIT_URL.length - 1];
      const SPLIT_URL3 = SPLIT_URL1+'/'+SPLIT_URL2
      let dvc_id = DeviceInfo.getDeviceId();
      
      let userStr;
      

      if(route.params.Screenname === 'ScanAssetScreen'){

        userStr = {site_cd:Site_cd,
        ast_mst_asset_no:route.params.Assetno.trim(),
        asset_shortdesc:"",
        cost_center:"",
        asset_status:"",
        asset_type:"",
        asset_grpcode:"",
        work_area:"",
        asset_locn:"",
        asset_code:"",
        ast_lvl:"",
        ast_sts_typ_cd:"",
        createby:"",
        from_date:"",
        to_date:"",
        emp_det_work_grp:EmpWorkGrp,
        emp_id:EmpID,
        Folder:SPLIT_URL3,
        dvc_id:dvc_id,
        MobileURL:BaseUrl,
        type:''};

      }else{

        userStr = {site_cd:Site_cd,
        ast_mst_asset_no:route.params.ASF_Assetno.trim(),
        asset_shortdesc:route.params.ASF_AssetDescription.trim(),
        cost_center:route.params.ASF_CostCenter.trim(),
        asset_status:route.params.ASF_AssetStatus.trim(),
        asset_type:route.params.ASF_AssetType.trim(),
        asset_grpcode:route.params.ASF_AssetGroupCode.trim(),
        work_area:route.params.ASF_WorkArea.trim(),
        asset_locn:route.params.ASF_AssetLocation.trim(),
        asset_code:route.params.ASF_AssetCode.trim(),
        ast_lvl:route.params.ASF_AssetLevel.trim(),
        ast_sts_typ_cd:"Active",
        createby:route.params.ASF_Employee.trim(),
        from_date:route.params.ASF_Fromdate,
        to_date:route.params.ASF_Todate,
        emp_det_work_grp:EmpWorkGrp,
        emp_id:EmpID,
        Folder:SPLIT_URL3,
        dvc_id:dvc_id,
        MobileURL:BaseUrl,
        type:''};

      }

        console.log("USE DATA: "+JSON.stringify(userStr))  

        const requestOptions = {
            method: 'POST',
            
            body: JSON.stringify(userStr), // Convert the data to JSON format
        };  

        fetch(`${BaseUrl}/get_assetmaster_list.php?`,requestOptions)
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

              if(data.data.length >0){

                setActive(data.Active)
                setDeactivate(data.Deactivate)
                setDisposed(data.Disposed)
                setAssetList(data.data)
                setFilteredDataSource(data.data)
                setcolorcode1("#42A5F5")
                setcolorcode2("#FFF")
                setcolorcode3("#FFF")
                setcolorcode4("#8BC34A")
                setstatus("ACT")
                setspinner(false)   

              }else{
                setspinner(false);
                setAlert(true,'warning',data.message); 
              }
            

            }else{
                setAnimating(false);
                setAlert(true,'danger',data.message);
                return;
            }
        })
        .catch(error => {
          setspinner(false);
          setAlert(true,'danger',error.message);
          //console.error('Error :', error.message);
        });
        

    })

    const Button_select_list =async (selected_value)=>{
      setspinner(true)

      console.log(selected_value);   

      const SPLIT_URL = BaseUrl.split('/');
      const SPLIT_URL1 = SPLIT_URL[SPLIT_URL.length - 2];
      const SPLIT_URL2 = SPLIT_URL[SPLIT_URL.length - 1];
      const SPLIT_URL3 = SPLIT_URL1+'/'+SPLIT_URL2
      let dvc_id = DeviceInfo.getDeviceId();

      let userStr;
      if(selected_value == "Active"){

        setcolorcode1("#42A5F5")
        setcolorcode2("#FFF")
        setcolorcode3("#FFF")
        setcolorcode4("#8BC34A")
        setstatus("ACT")

      }else if(selected_value == "Deactivate"){

        setcolorcode1("#FFF")
        setcolorcode2("#42A5F5")
        setcolorcode3("#FFF")
        setcolorcode4("#F4D03F")
        setstatus("DEA")

      }else if(selected_value == "Disposed"){

        setcolorcode1("#FFF")
        setcolorcode2("#FFF")
        setcolorcode3("#42A5F5")
        setcolorcode4("#FF0000")
        setstatus("DIS")


      }

      userStr = {site_cd:Site_cd,
        ast_mst_asset_no:route.params.ASF_Assetno,
        asset_shortdesc:route.params.ASF_AssetDescription,
        cost_center:route.params.ASF_CostCenter,
        asset_status:route.params.ASF_AssetStatus,
        asset_type:route.params.ASF_AssetType,
        asset_grpcode:route.params.ASF_AssetGroupCode,
        work_area:route.params.ASF_WorkArea,
        asset_locn:route.params.ASF_AssetLocation,
        asset_code:route.params.ASF_AssetCode,
        ast_lvl:route.params.ASF_AssetLevel,
        ast_sts_typ_cd:selected_value,
        createby:route.params.ASF_Employee,
        from_date:route.params.ASF_Fromdate,
        to_date:route.params.ASF_Todate,
        emp_det_work_grp:EmpWorkGrp,
        emp_id:EmpID,
        type:'',
        emp_det_work_grp: EmpWorkGrp,
        emp_id: EmpID,
        Folder:SPLIT_URL3,
        dvc_id:dvc_id,
        MobileURL:BaseUrl,

      };

      console.log("userStr:",userStr)

      const requestOptions = {
        method: 'POST',
        body: JSON.stringify(userStr)
      };  

      fetch(`${BaseUrl}/get_assetmaster_list.php?`,requestOptions)
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

            if(data.data.length >0){

              setActive(data.Active)
              setDeactivate(data.Deactivate)
              setDisposed(data.Disposed)
              setAssetList(data.data)
              setFilteredDataSource(data.data)
              setspinner(false) 

             }else{
               setspinner(false);
               setAssetList(data.data)
               setFilteredDataSource(data.data)
               setAlert(true,'warning',data.message);
             }
          

          }else{
              setAnimating(false);
              setAlert(true,'danger',data.message);
              return;
          }
      })
      .catch(error => {
        setspinner(false);
        setAlert(true,'danger',error.message);
        //console.error('Error :', error.message);
      });
    } 
 
    const searchFilterFunction = (text) => {
      // Check if searched text is not blank
      if (text) {
        // Inserted text is not blank
        // Filter the masterDataSource
        // Update FilteredDataSource
        const newData = AssetList.filter(function (item) {
          //const itemData = item.ast_mst_asset_no ? item.ast_mst_asset_no.toUpperCase() : ''.toUpperCase();
            //const itemData = item.ast_mst_asset_no.toUpperCase(),;
            const itemData = `${item.ast_mst_asset_no.toUpperCase()}
            ,${item.ast_mst_cost_center.toUpperCase()}
            ,${item.mst_war_work_area.toUpperCase()}
            ,${item.ast_mst_asset_locn.toUpperCase()}
            ,${item.ast_mst_asset_lvl.toUpperCase()}
            ,${item.ast_mst_asset_shortdesc.toUpperCase()}
            ,${item.ast_mst_asset_longdesc.toUpperCase()})`
        
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
        setFilteredDataSource(newData);
        setSearch(text);
      } else {
        // Inserted text is blank
        // Update FilteredDataSource with masterDataSource
        setFilteredDataSource(AssetList);
        setSearch(text);
      }
    };
  
    const ItemView = ({ item }) => {

      let  cost_center = item.ast_mst_cost_center.split(":")
      let  work_area = item.mst_war_work_area.split(":")
      let  asset_locn = item.ast_mst_asset_locn.split(":")
      let  asset_lvl = item.ast_mst_asset_lvl.split(":")

      let warrantydate
      let Warranty_Date = moment(item.ast_det_warranty_date.date).format('yyyy-MM-DD HH:mm');
      //console.log(Org_Date)
      if (Warranty_Date === '1900-01-01 00:00') {
        warrantydate = '';
      } else {
        warrantydate = moment(Warranty_Date).format('DD-MM-YYYY HH:mm');
      }

      var ast_color;
      if(item.Asset_Status_Category === 'Active'){
        ast_color ='#8BC34A'
      }else if(item.Asset_Status_Category === 'Deactivate'){
        ast_color ='#F4D03F'
      }else if(item.Asset_Status_Category === 'Disposed'){
        ast_color ='#FF0000'
      }

      let link
      if(item.attachment === null){
        link = '0'
      }else{
        link = '1'

        
      }

      return (

        <TouchableOpacity onPress={() => getItem(item)} > 
          <View style={[styles.item]}>
            <View style={{ flex: 1,flexDirection: 'row'}}>
              <View style={{ width: '35%'}}>
                <View style={{height:'100%',borderTopLeftRadius:10,borderBottomLeftRadius:10, alignItems: 'center',justifyContent: 'center',}}>
                  {
                    link === '1' &&
                    <Image source={{uri:item.attachment}}  style={{width: '100%', height: '100%',borderTopLeftRadius:10,borderBottomLeftRadius:10,}} />
                    ||

                    link === '0' &&
                    <Image source={require('../../images/gallery2.jpeg')} style={{width: '30%', height: '30%',borderTopLeftRadius:10,borderBottomLeftRadius:10,} }resizeMode="contain" />
                  }
                </View> 
              </View>
              <View style={{ flex: 1,margin:10 }}>
                <View style={{ flexDirection: 'row', marginTop:5 }}>
                  <MaterialCommunityIcons
                    name="alpha-a-circle-outline"
                    color={'#05375a'}
                    size={20}/>
                    <Text style={{flex: 1,color: '#05375a', fontSize: 12, marginLeft:10 }}>{item.ast_mst_asset_no }</Text>
                  <Text style={{color: ast_color, fontSize: 12, }}>{item.ast_mst_asset_status}</Text>
                </View>

                <View style={{ flexDirection: 'row',marginTop:5 }}>
                  <MaterialCommunityIcons
                    name="align-horizontal-left"
                    color={'#05375a'}
                    size={20}/>
                  <Text style={{ flex: 1,color: '#05375a', fontSize: 12, marginLeft:10 }}>{item.ast_mst_asset_shortdesc}</Text>
                </View>

                <View style={{ flexDirection: 'row',marginTop:5 }}>
                  <MaterialCommunityIcons
                    name="archive-cog-outline"
                    color={'#05375a'}
                    size={20}/>
                  <Text style={{ flex: 1,color: '#05375a', fontSize: 12, marginLeft:10 }}>{'Cost center '+item.ast_mst_cost_center}</Text>
                </View>

                <View style={{flexDirection: 'row',marginTop:5 }}>
                  <MaterialCommunityIcons
                    name="google-maps"
                    color={'#05375a'}
                    size={20}/>
                  <Text style={{ flex: 1,color: '#05375a', fontSize: 12, marginLeft:10}}>{item.mst_war_work_area}</Text>
                </View>

                <View style={{ flexDirection: 'row',marginTop:5 }}>
                  <MaterialCommunityIcons
                    name="format-align-right"
                    color={'#05375a'}
                    size={20}/>
                  <Text style={{ flex: 1,color: '#05375a', fontSize: 12, marginLeft:10 }}>{item.ast_mst_asset_longdesc}</Text>
                </View>

                
              </View>
        </View>
        </View>
      </TouchableOpacity>
        

        // <TouchableOpacity onPress={() => getItem(item)}>

        //     <View style={styles.item}>

        //     <View style={{ flexDirection: 'row', marginTop:5 }}>
        //       <MaterialCommunityIcons
        //         name="alpha-a-circle-outline"
        //         color={'#05375a'}
        //         size={20}/>

        //       <Text style={{flex: 1,color: '#05375a', fontSize: 12, marginLeft:10 }}>{item.ast_mst_asset_no }</Text>

        //       <Text style={{color: ast_color, fontSize: 12, }}>{item.ast_mst_asset_status}</Text>
        //     </View>

        //     <View style={{ flexDirection: 'row', marginTop:5 }}>
        //         <MaterialCommunityIcons
        //           name="align-horizontal-left"
        //           color={'#05375a'}
        //           size={20}/>

        //         <Text style={{flex: 1,color: '#05375a', fontSize: 12, marginLeft:10 }}>{item.ast_mst_asset_shortdesc.trim()}</Text>
        //     </View>


        //     <View style={{ alignItems: 'center',flexDirection: 'row', marginTop:5 }}>
        //         <MaterialCommunityIcons
        //           name="archive-cog-outline"
        //           color={'#05375a'}
        //           size={20}/>

        //         <Text style={{flex: 1,color: '#05375a', fontSize: 12, marginLeft:10 }}>{"Cost Center "+item.ast_mst_cost_center}</Text>
        //     </View>

        //     <View style={{ flexDirection: 'row', marginTop:5 }}>
        //         <MaterialCommunityIcons
        //           name="google-maps"
        //           color={'#05375a'}
        //           size={20}/>

        //         <Text style={{flex: 1,color: '#05375a', fontSize: 12, marginLeft:10 }}>{item.mst_war_work_area+' / '+item.ast_mst_asset_locn+' / '+item.ast_mst_asset_lvl}</Text>
        //     </View>

        //     <View style={{ alignItems: 'center',flexDirection: 'row', marginTop:5 }}>
        //         <MaterialCommunityIcons
        //           name="align-horizontal-left"
        //           color={'#05375a'}
        //           size={20}/>

        //         <Text style={{flex: 1,color: '#05375a', fontSize: 12, marginLeft:10 }}>{item.ast_mst_asset_longdesc}</Text>
        //     </View>

        //     {/* <View style={{ alignItems: 'center',flexDirection: 'row', marginTop:5 }}>
        //       <MaterialCommunityIcons
        //         name="calendar-check"
        //         color={'#05375a'}
        //         size={20}/>

        //       <Text style={{flex: 1,color: '#05375a', fontSize: 12, marginLeft:10 }}>{'Warranty date '+warrantydate}</Text>
        //     </View> */}

            
        //       {/* <View style={{flex:1,justifyContent:'space-between',flexDirection:'row',alignItems:'center'}}>
        //         <View style={{backgroundColor:'#D6EAF8',borderRadius:10,padding:5}}>
        //           <Text style={{color:'#000',fontSize: 13,padding:5, fontWeight: 'bold',}} > {item.ast_mst_asset_no}</Text>
        //         </View>
        //         <Text style={{fontSize: 13,color:ast_color,marginRight:10,fontWeight:'bold'}} >{item.ast_mst_asset_status}</Text>
        //       </View>

              
        //       <View style={{flexDirection:"row",marginTop:10}}>
        //         <View style={{width:'40%'}} >
        //             <Text placeholder="Test" style={{color:'#42A5F5',fontWeight: 'bold',justifyContent: 'flex-start'}} >Description :</Text>
        //         </View>
        //         <View style={{flex:1}}>
        //             <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{item.ast_mst_asset_shortdesc}</Text>
        //         </View>
        //       </View>

        //       <View style={{flexDirection:"row",marginTop:5}}>
        //         <View style={{width:'40%'}}>
        //             <Text placeholder="Test" style={{color:'#42A5F5',fontWeight: 'bold',justifyContent: 'flex-start'}} >Cost Center :</Text>
        //         </View>
        //         <View style={{flex:1}}>
        //             <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{item.ast_mst_cost_center}</Text>
        //         </View>
        //       </View>

        //       <View style={{flexDirection:"row",marginTop:5}}>
        //         <View style={{width:'40%'}}>
        //             <Text placeholder="Test" style={{color:'#42A5F5',fontWeight: 'bold',justifyContent: 'flex-start'}} >Work Area :</Text>
        //         </View>
        //         <View style={{flex:1}}>
        //             <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{item.mst_war_work_area}</Text>
        //         </View>
        //       </View>

        //       <View style={{flexDirection:"row",marginTop:5}}>
        //         <View style={{width:'40%'}}>
        //             <Text placeholder="Test" style={{color:'#42A5F5',fontWeight: 'bold',justifyContent: 'flex-start'}} >Asset Location :</Text>
        //         </View>
        //         <View style={{flex:1}}>
        //             <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{item.ast_mst_asset_locn}</Text>
        //         </View>
        //       </View>

        //       <View style={{flexDirection:"row",marginTop:5}}>
        //         <View style={{width:'40%'}}>
        //             <Text placeholder="Test" style={{color:'#42A5F5',fontWeight: 'bold',justifyContent: 'flex-start'}} >Asset Level :</Text>
        //         </View>
        //         <View style={{flex:1}}>
        //             <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{item.ast_mst_asset_lvl}</Text>
        //         </View>
        //       </View>

        //       <View style={{flexDirection:"row",marginTop:5}}>
        //         <View style={{width:'40%'}}>
        //             <Text placeholder="Test" style={{color:'#42A5F5',fontWeight: 'bold',justifyContent: 'flex-start'}} >Long Description :</Text>
        //         </View>
        //         <View style={{flex:1}}>
        //             <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{item.ast_mst_asset_longdesc}</Text>
        //         </View>
        //       </View> */}



        //     </View>
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
      //alert('Id : ' + item.ast_mst_asset_no );
      navigation.navigate('CreateAssetScreen',{
        
        ASL_Assetno:item.ast_mst_asset_no,
        ASL_RowID:item.RowID,
        Screenname:"AssetListing",
        
        ASF_Assetno:route.params.ASF_Assetno,
        ASF_AssetDescription:route.params.ASF_AssetDescription,
        ASF_Employee:route.params.ASF_Employee,
        ASF_CostCenter:route.params.ASF_CostCenter,
        ASF_AssetStatus:route.params.ASF_AssetStatus,
        ASF_AssetType:route.params.ASF_AssetType,
        ASF_AssetGroupCode:route.params.ASF_AssetGroupCode,
        ASF_AssetCode:route.params.ASF_AssetCode,
        ASF_WorkArea:route.params.ASF_WorkArea,
        ASF_AssetLocation:route.params.ASF_AssetLocation,
        ASF_AssetLevel:route.params.ASF_AssetLevel,
        ASF_Fromdate:route.params.ASF_Fromdate,
        ASF_Todate:route.params.ASF_Todate,

      });
    };
    

    const onSuccess = e => {
      console.log(JSON.stringify(e));
  
      const check = e.data.substring(0, 4);
      console.log('scanned data' + e.data);

      if (e.data) {
        // Inserted text is not blank
        // Filter the masterDataSource
        // Update FilteredDataSource
        const newData = AssetList.filter(function (item) {
          //const itemData = item.ast_mst_asset_no ? item.ast_mst_asset_no.toUpperCase() : ''.toUpperCase();
            //const itemData = item.ast_mst_asset_no.toUpperCase(),;
            const itemData = `${item.ast_mst_asset_no.toUpperCase()}
            ,${item.ast_mst_cost_center.toUpperCase()}
            ,${item.mst_war_work_area.toUpperCase()}
            ,${item.ast_mst_asset_locn.toUpperCase()}
            ,${item.ast_mst_asset_lvl.toUpperCase()}
            ,${item.ast_mst_asset_shortdesc.toUpperCase()}
            ,${item.ast_mst_asset_longdesc.toUpperCase()})`
        
          const textData = e.data.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
        setFilteredDataSource(newData);
        setSearch(e.data);
      } else {
        // Inserted text is blank
        // Update FilteredDataSource with masterDataSource
        setFilteredDataSource(AssetList);
        setSearch(e.data);
      }
     
      setresult(e);
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
  
    const OpenQRCode = () => {
      setshowqrcode(true);
      scanAgain(true);
    };

    const setAlert =(show,theme,title)=>{
      setShow(show);
      setTheme(theme);
      setTitle(title);
    }
  
  
    const setAlert_two =(show,theme,title)=>{
      setShow_two(show);
      setTheme(theme);
      setTitle(title);
    }


  
  

    return(

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

            <Text style={{fontSize:20, justifyContent:'center',textAlign:'center',color:'#fff',fontWeight: 'bold',marginLeft:15}}> Asset Master</Text> 

          </View >

        </Pressable>
              
        <View style={{flexDirection:'row',alignItems:'center'}}>

          <Pressable onPress={()=>navigation.navigate("FilteringAsset")}>

            <View style={{justifyContent:'center',alignItems:'center'}}>

              <Text style={{fontSize:15, justifyContent:'center',textAlign:'center',color:'#fff',fontWeight: 'bold',marginLeft:15}}>Filter</Text> 

              <Image source={require('../../images/filter.png')} style={{ width: 30, height: 30,marginLeft:10}}/>
              
            </View>

          </Pressable>

          <Pressable onPress={()=>navigation.navigate("CreateAssetScreen",{Screenname:"CreateAsset"})}>

            <View style={{justifyContent:'center',alignItems:'center',marginLeft:5,marginRight:5}}>

              <Text style={{fontSize:15, justifyContent:'center',textAlign:'center',color:'#fff',fontWeight: 'bold',marginLeft:15}}>New</Text> 

              <Image source={require('../../images/floating.png')} style={{ width: 30, height: 30,marginLeft:10}}/>

            </View>

          </Pressable>

        </View>
              
      </View>
            
    </Appbar.Header>

    <View style={styles.container}>

      <ProgressLoader visible={spinner} isModal={true} isHUD={true} hudColor={"#808080"} color={"#FFFFFF"} />

      <SCLAlert theme={Theme} show={Show} title={Title}>
        <SCLAlertButton theme={Theme}   onPress={()=>setShow(false)}>OK</SCLAlertButton>
      </SCLAlert>


      <SCLAlert theme={Theme} show={Show_two} title={Title} >
        <SCLAlertButton theme={Theme}  onPress={()=>_goBack()}>Yes</SCLAlertButton>
        <SCLAlertButton theme="default" onPress={()=>setShow_two(false)}>No</SCLAlertButton>
      </SCLAlert>


      <Modal visible={showqrcode}>
          <View style={styles.scrollViewStyle}>
            <Fragment>
              <SafeAreaView
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text></Text>
                <TouchableOpacity onPress={() => setshowqrcode(false)}>
                  <AntDesign
                    name="close"
                    color="#fff"
                    size={30}
                    style={{marginRight: 35, marginTop: 15}}
                  />
                </TouchableOpacity>
              </SafeAreaView>
              {!scan && !ScanResult && (
                <View style={styles.qr_cardView}>
                  <Image
                    source={require('../../images/camera.png')}
                    style={{height: 36, width: 36}}></Image>
                  <Text numberOfLines={8} style={styles.descText}>
                    Please move your camera {'\n'} over the QR Code
                  </Text>
                  <Image
                    source={require('../../images/qrcodescan.png')}
                    style={{margin: 20}}></Image>
                  <TouchableOpacity onPress={activeQR} style={styles.buttonScan}>
                    <View style={styles.buttonWrapper}>
                      {/* <Image source={require('../../images/camera.png')} style={{height: 36, width: 36}}></Image> */}
                      <Text style={{...styles.buttonTextStyle, color: '#2196f3'}}>
                        Scan QR Code
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              {ScanResult && (
                <Fragment>
                  <Text style={styles.textTitle1}>Result</Text>
                  <View
                    style={ScanResult ? styles.scanCardView : styles.cardView}>
                    <Text>Type : {result.type}</Text>
                    <Text>Result : {result.data}</Text>
                    <Text numberOfLines={1}>RawData: {result.rawData}</Text>
                    <TouchableOpacity
                      onPress={scanAgain}
                      style={styles.buttonScan}>
                      <View style={styles.buttonWrapper}>
                        {/* <Image source={require('./images/camera.png')} style={{height: 36, width: 36}}></Image> */}
                        <Text
                          style={{...styles.buttonTextStyle, color: '#2196f3'}}>
                          Click to scan again
                        </Text>
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
                  topContent={
                    <Text style={styles.centerText}>
                      Please move your camera {'\n'} over the QR Code
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
                          <View>
                            {/* <Image source={require('./images/camera.png')} style={{height: 36, width: 36}}></Image> */}
                            <Text
                              style={{
                                color: '#FFFF',
                                textAlign: 'center',
                                fontSize: 18,
                                fontWeight: 'bold',
                              }}>
                              Cancel Scan
                            </Text>
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
            title="Active"
            titleStyle={{ color: "white", fontSize: 16}}
            onPress={() =>Button_select_list("Active")}
            buttonStyle={{ backgroundColor: '#8BC34A', borderRadius: 3}}
            containerStyle={{ flex: 1, marginHorizontal: 5}}
          /> 

        <Button
          title="Deactivate"
          titleStyle={{ color: "white", fontSize: 16}}
          onPress={() =>Button_select_list("Deactivate")}
          buttonStyle={{ backgroundColor: '#F4D03F', borderRadius: 3}}
          containerStyle={{ flex: 1, marginHorizontal: 5}}
        />  
    
        <Button
            title="Disposed"
            titleStyle={{ color: "white", fontSize: 16}}
            onPress={() =>Button_select_list("Disposed")}
            buttonStyle={{ backgroundColor: '#FF0000', borderRadius: 3}}
            containerStyle={{ flex: 1, marginHorizontal: 5}}
          /> 

      </View> 

      <View style={styles.view_4}> 
          <View style={{flex:1,backgroundColor:colorcode1,height:2,marginHorizontal:5} }></View>
          <View style={{flex:1,backgroundColor:colorcode2,height:2,marginHorizontal:5}}></View>
          <View style={{flex:1,backgroundColor:colorcode3,height:2,marginHorizontal:5}}></View>
      </View>

      <View style={styles.view_3}> 
          <Text style={{color:'#8BC34A', fontSize: 15,fontWeight: "bold",flex: 1,textAlign: 'center',alignItems:'center',justifyContent:'center'}}>{Active}</Text>
          <Text style={{color:'#F4D03F', fontSize: 15,fontWeight: "bold",flex: 1,textAlign: 'center',alignItems:'center',justifyContent:'center'}}>{Deactivate}</Text>
          <Text style={{color:'#FF0000', fontSize: 15,fontWeight: "bold",flex: 1,textAlign: 'center',alignItems:'center',justifyContent:'center'}}>{Disposed}</Text>
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

        


          {/* <SearchBar
            lightTheme
            round
            inputStyle={{color:'#000'}}
            inputContainerStyle={{backgroundColor:'#fff'}}
            searchIcon={{ size: 24 }}
            onChangeText={(text) => searchFilterFunction(text)}
            onClear={(text) => searchFilterFunction('')}
            placeholder="Search here..."
            value={search}
          /> */}
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
    );


};


const styles = StyleSheet.create({

    container: {
      flex: 1 ,
         
    },
    image: {
        width: 20,
        height: 20,        
        resizeMode: 'contain',
    },
    toolbar: {

        paddingTop:25,
        paddingBottom:10,
        backgroundColor: '#42A5F5',
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
        paddingTop:5,
        paddingBottom:5
    },
    view_4:{        
        
      flexDirection: 'row',
      alignItems: 'stretch',
      backgroundColor:"#FFFF"  ,
      paddingTop:2
     
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
  

export default AssetListing;