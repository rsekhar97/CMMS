import React, {Fragment, useRef} from 'react';

import { View, StyleSheet, Pressable, Text, FlatList, Image, SafeAreaView, ScrollView, TouchableOpacity, Alert, Modal, Button, BackHandler, TouchableWithoutFeedback, Keyboard, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressLoader from 'rn-progress-loader';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import axios from 'axios';
import {Appbar} from 'react-native-paper';
import {useTheme} from 'react-native-paper';
import {openDatabase} from 'react-native-sqlite-storage';
import DeviceInfo from 'react-native-device-info';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {TextInput} from 'react-native-element-textinput';
import moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {ImageBackground} from 'react-native';
import Signature from 'react-native-signature-canvas';
import Permissions from 'react-native-permissions';
import RNFetchBlob from 'react-native-blob-util';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';


var db = openDatabase({name: 'CMMS.db'});

let Baseurl, Site_cd, LoginID, EmpName, EmpID, EmpPhone, EmpWorkGrp, dvc_id, WIFI, Local_ID,mst_RowID;

const PurchasingInfo = ({route, navigation}) => {



  const [spinner, setspinner] = React.useState(false);
  const [Toolbartext, setToolbartext] = React.useState('Response');
  const [Editable, setEditable] = React.useState(false);


  const [PurchasingInfo_List, setPurchasingInfo_List] = React.useState([]);


  //Alert
  const [Show, setShow] = React.useState(false);
  const [Show_two, setShow_two] = React.useState(false);
  const [Theme, setTheme] = React.useState('');
  const [Title, setTitle] = React.useState('');
  const [AlertType, setAlertType] = React.useState('');
  const [ImgValue, setImgValue] = React.useState([]);

  const _goBack = () => {

    if (route.params.Screenname == 'FilteringWorkOrder') {

      navigation.navigate('CreateWorkOrder', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        Screenname: route.params.Screenname,

        WOF_Workordercategory: route.params.WOF_Workordercategory,
        WOF_Workorderstatus: route.params.WOF_Workorderstatus,
        WOF_WorkrequestNo: route.params.WOF_WorkrequestNo,
        WOF_WorkorderNo: route.params.WOF_WorkorderNo,
        WOF_WorkorderDesc: route.params.WOF_WorkorderDesc,
        WOF_AssetNo: route.params.WOF_AssetDesc,
        WOF_AssetDesc: route.params.WOF_AssetDesc,
        WOF_Originator: route.params.WOF_Originator,
        WOF_Assignto: route.params.WOF_Assignto,
        WOF_WorkArea: route.params.WOF_WorkArea,
        WOF_WorkType: route.params.WOF_WorkType,
        WOF_SupervisorID: route.params.WOF_SupervisorID,
        WOF_AssetLocation: route.params.WOF_AssetLocation,
        WOF_AssetLevel: route.params.WOF_AssetLevel,
        WOF_CostCenter: route.params.WOF_CostCenter,
        WOF_Fromdate: route.params.WOF_Fromdate,
        WOF_Todate: route.params.WOF_Todate,
      });
    } else if (route.params.Screenname == 'MyWorkOrder') {
      navigation.navigate('CreateWorkOrder', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        local_id: route.params.local_id,
        Selected_wko_mst_ast_cod: route.params.Selected_wko_mst_ast_cod,
        Selected_wko_mst_type: route.params.Selected_wko_mst_type,
        Screenname: route.params.Screenname,
      });
    } else if (route.params.Screenname == 'WoDashboard'  || route.params.Screenname == 'MYWO_Dashboard_Due' || route.params.Screenname == 'MYWO_Dashboard_Past') {
      navigation.navigate('CreateWorkOrder', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        local_id: route.params.local_id,
        Selected_wko_mst_ast_cod: route.params.Selected_wko_mst_ast_cod,
        Selected_wko_mst_type: route.params.Selected_wko_mst_type,

        Screenname: route.params.Screenname,
        type: route.params.type,
      });
    } else if (route.params.Screenname == 'ScanAssetMaster') {
      if (route.params.ScanAssetType == 'New') {
        navigation.navigate('CreateWorkOrder', {
          Screenname: route.params.Screenname,
          ScanAssetType: route.params.ScanAssetType,
          ScanAssetRowID: route.params.ScanAssetRowID,
          ScanAssetno: route.params.ScanAssetno,
        });
      } else if (route.params.ScanAssetType == 'Edit') {

        navigation.navigate('CreateWorkOrder', {
          Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
          RowID: route.params.RowID,

          Screenname: route.params.Screenname,
          ScanAssetType: route.params.ScanAssetType,
          ScanAssetno: route.params.ScanAssetno,
          ScanAssetRowID: route.params.ScanAssetRowID,
        });
      }
    } else if (route.params.Screenname == 'AssetListing') {

      navigation.navigate('CreateWorkOrder', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        ASL_Assetno: route.params.ASL_Assetno,
        ASL_RowID: route.params.ASL_RowID,
        Screenname: route.params.Screenname,

        ASF_Assetno: route.params.ASF_Assetno,
        ASF_AssetDescription: route.params.ASF_AssetDescription,
        ASF_Employee: route.params.ASF_Employee,
        ASF_Fromdate: route.params.ASF_Fromdate,
        ASF_Todate: route.params.ASF_Todate,
        ASF_CostCenter: route.params.ASF_CostCenter,
        ASF_AssetStatus: route.params.ASF_AssetStatus,
        ASF_AssetType: route.params.ASF_AssetType,
        ASF_AssetGroupCode: route.params.ASF_AssetGroupCode,
        ASF_AssetCode: route.params.ASF_AssetCode,
        ASF_WorkArea: route.params.ASF_WorkArea,
        ASF_AssetLocation: route.params.ASF_AssetLocation,
        ASF_AssetLevel: route.params.ASF_AssetLevel,
      });
    }
  };


  const backAction = () => {
    // Alert.alert("Alert", "Do you want to exit response screen?", [
    //   {
    //     text: "NO",
    //     onPress: () => null,
        
    //   },
    //   { text: "YES", onPress: () => _goBack() }
    // ]);


    setAlert_two(true,'warning','Do you want to exit Purchasing Info screen?','BACK')
 
    return true;
  };

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  React.useEffect(() => {
    const focusHander = navigation.addListener('focus', () => {
      fetchData();
    });
    return focusHander;
  }, [navigation]);

  const fetchData = async () => {

    var sync_date = moment().format('yyyy-MM-DD HH:mm');
    dvc_id = DeviceInfo.getDeviceId();

    Baseurl = await AsyncStorage.getItem('BaseURL');
    Site_cd = await AsyncStorage.getItem('Site_Cd');
    LoginID = await AsyncStorage.getItem('emp_mst_login_id');
    EmpName = await AsyncStorage.getItem('emp_mst_name');
    EmpID = await AsyncStorage.getItem('emp_mst_empl_id');
    EmpPhone = await AsyncStorage.getItem('emp_mst_homephone');
    EmpWorkGrp = await AsyncStorage.getItem('emp_det_work_grp');
    WIFI = await AsyncStorage.getItem('WIFI');

    console.log('SCREE NAME:',route.params.Screenname);
    console.log('WorkOrder_no:', route.params.Selected_WorkOrder_no);
    console.log('ASSETNO:', route.params.Selected_AssetNo);
    console.log('CostCenter:', route.params.Selected_CostCenter);
    console.log('LaborAccount:', route.params.Selected_LaborAccount);
    console.log('ContractAccount:', route.params.Selected_ContractAccount);
    console.log('MaterialAccount:', route.params.Selected_MaterialAccount);
   
    get_purchasing_info();

    
  };

   // Step : 01
   const get_purchasing_info = async () => {

    setspinner(true);

    console.log( 'PIECHART TWO' + `${Baseurl}/get_purchasing_info.php?site_cd=${Site_cd}&wko_mst_wo_no=${route.params.Selected_WorkOrder_no}`);

      fetch(`${Baseurl}/get_purchasing_info.php?site_cd=${Site_cd}&wko_mst_wo_no=${route.params.Selected_WorkOrder_no}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {

        if (data.status === 'SUCCESS') {

          setPurchasingInfo_List(data.data)
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

   

    
  };

  const ItemView = ({ item,index }) => {

    let requestdate,status,color_sts;
    let Request_Date = moment(item.pur_mst_rqn_date.date).format('yyyy-MM-DD HH:mm');
    console.log(index)
    if (Request_Date === '1900-01-01 00:00') {
      requestdate = '';
    } else {
      requestdate = moment(Request_Date).format('DD-MM-YYYY HH:mm');
    }

    if (item.pur_mst_purq_approve === 'W') {
      status = 'Awaiting';
      color_sts = '#FF0000';
    } else if (item.pur_mst_purq_approve === 'A'){
      status = 'Approve';
      color_sts = '#8BC34A';
    }

    

    return (
      

      

          <View style={styles.item}>
            
            <View style={{flexDirection:"row",marginTop:10}}>
              <View style={{width:'40%'}} >
                  <Text placeholder="Test" style={{color:'#42A5F5',fontWeight: 'bold',justifyContent: 'flex-start'}} >PR No:</Text>
              </View>
              <View style={{flex:1}}>
                  <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{item.pur_mst_porqnnum}</Text>
              </View>
            </View>

            <View style={{flexDirection:"row",marginTop:5}}>
              <View style={{width:'40%'}}>
                  <Text placeholder="Test" style={{color:'#42A5F5',fontWeight: 'bold',justifyContent: 'flex-start'}} >PR Line No:</Text>
              </View>
              <View style={{flex:1}}>
                  <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{index+1}</Text>
              </View>
            </View>

            <View style={{flexDirection:"row",marginTop:5}}>
              <View style={{width:'40%'}}>
                  <Text placeholder="Test" style={{color:'#42A5F5',fontWeight: 'bold',justifyContent: 'flex-start'}} >Request Date:</Text>
              </View>
              <View style={{flex:1}}>
                  <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{requestdate}</Text>
              </View>
            </View>

            <View style={{flexDirection:"row",marginTop:5}}>
              <View style={{width:'40%'}}>
                  <Text placeholder="Test" style={{color:'#42A5F5',fontWeight: 'bold',justifyContent: 'flex-start'}} >Approval Status:</Text>
              </View>
              <View style={{flex:1}}>
                  <Text placeholder="Test" style={{justifyContent: 'flex-start',color:color_sts}} >{status}</Text>
              </View>
            </View>

            <View style={{flexDirection:"row",marginTop:5}}>
              <View style={{width:'40%'}}>
                  <Text placeholder="Test" style={{color:'#42A5F5',fontWeight: 'bold',justifyContent: 'flex-start'}} >Description</Text>
              </View>
              <View style={{flex:1}}>
                  <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{item.pur_ls1_desc}</Text>
              </View>
            </View>

            <View style={{flexDirection:"row",marginTop:5}}>
              <View style={{width:'40%'}}>
                  <Text placeholder="Test" style={{color:'#42A5F5',fontWeight: 'bold',justifyContent: 'flex-start'}} >Order UOM:</Text>
              </View>
              <View style={{flex:1}}>
                  <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{item.pur_ls1_ord_uom}</Text>
              </View>
            </View>

            <View style={{flexDirection:"row",marginTop:5}}>
              <View style={{width:'40%'}}>
                  <Text placeholder="Test" style={{color:'#42A5F5',fontWeight: 'bold',justifyContent: 'flex-start'}} >PO No:</Text>
              </View>
              <View style={{flex:1}}>
                  <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{item.pur_ls1_po_no}</Text>
              </View>
            </View>

            <View style={{flexDirection:"row",marginTop:5}}>
              <View style={{width:'40%'}}>
                  <Text placeholder="Test" style={{color:'#42A5F5',fontWeight: 'bold',justifyContent: 'flex-start'}} >PO Line No:</Text>
              </View>
              <View style={{flex:1}}>
                  <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{item.pur_ls1_po_lineno}</Text>
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
        height: 1,
        width: '100%',
        backgroundColor: '#C8C8C8',
      }}
    />
    );
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

            <Text style={{fontSize:20, justifyContent:'center',textAlign:'center',color:'#fff',fontWeight: 'bold',marginLeft:15}}> Purchasing info</Text> 

          </View >

        </Pressable>

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

        <FlatList
          data={PurchasingInfo_List}
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

export default PurchasingInfo

const styles = StyleSheet.create({

  container: {
    flex: 1 ,   
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

  item:{
    backgroundColor: '#fff',
    margin:10,
    padding: 10,
    borderRadius: 10,
  },
  
  

});