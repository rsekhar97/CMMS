import React, {Fragment, useRef} from 'react';

import { View, StyleSheet, Pressable, Text, Dimensions, Image, SafeAreaView, ScrollView, TouchableOpacity, Alert, Modal, Button, BackHandler, TouchableWithoutFeedback, Keyboard, } from 'react-native';
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
const deviceWidth = Dimensions.get('screen').width;
const deviceHeight = Dimensions.get('screen').height;

const DismissKeyboard = ({children}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const Response = ({route, navigation}) => {
  
  var Valid = true;

  const {colors} = useTheme();
  const ref = useRef();

  const [spinner, setspinner] = React.useState(false);
  const [Toolbartext, setToolbartext] = React.useState('Response');
  const [Editable, setEditable] = React.useState(false);
  const [ResponsEditable, setResponsEditable] = React.useState(false);

  const [height, setHeight] = React.useState(0);

  const [showqrcode, setshowqrcode] = React.useState(false);

  const [scan, setscan] = React.useState(false);
  const [ScanResult, setScanResult] = React.useState(false);
  const [result, setresult] = React.useState(null);
  const [qrresult, setqrresult] = React.useState('');

  const [isDatepickerVisible, setDatePickerVisibility] = React.useState(false);

  const [Name, setName] = React.useState('');
  const [DateTime, setDateTime] = React.useState('');

  const [ReqName, setReqName] = React.useState('');
  const [ICNo, setICNo] = React.useState('');
  const [PhoneNo, setPhoneNo] = React.useState('');

  const[Verify_Visible,setVerify_Visible] =React.useState(true);

  const [ResponseDate, setResponseDate] = React.useState('');

  const [ResponsShow, setResponsShow] = React.useState(false);
  const [modalVisible, setmodalVisible] = React.useState(false);
  const [Verified, setVerified] = React.useState('');


  const [ResponsVisible, setResponsVisible] = React.useState(true);
  const [SaveVisible, setSaveVisible] = React.useState(false);

  const [colorcode4, setcolorcode4] = React.useState('');

  const [SingVisible, setSingVisible] = React.useState(false);
  const [signature, setSignature] = React.useState(null);
  const [Attachments_List, setAttachments_List] = React.useState([]);


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


    setAlert_two(true,'warning','Do you want to exit response screen?','BACK')

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
   

    mst_RowID =route.params.RowID;
    Local_ID =route.params.local_id;

    console.log('WORK DATA LOCAL ID :', Local_ID);
    console.log('WORK DATA MST_ROWID:', mst_RowID);

  
    setName(EmpID + ':' + EmpName);
    setDateTime(sync_date);
    setResponseDate(sync_date);
    if (WIFI === 'OFFLINE') {

      setVerify_Visible(false);

      get_Respons_offline()

    } else {
      get_respons();
    }
  };

  //GET RESPONS API
  const get_respons = async () => {
    setspinner(true);

    try {
      console.log( 'JSON DATA : ' + `${Baseurl}/get_response.php?site_cd=${Site_cd}&mst_RowID=${route.params.RowID}`);

      const response = await axios.get( `${Baseurl}/get_response.php?site_cd=${Site_cd}&mst_RowID=${route.params.RowID}`);

      //console.log(JSON.stringify(response));

      console.log('JSON DATA : ' + response.data.data.length);

      if (response.data.status === 'SUCCESS') {
        if (response.data.data.length > 0) {
          for (let i = 0; i < response.data.data.length; ++i) {
            if ( response.data.data[i].wko_det_tech_resp_id == '' || response.data.data[i].wko_det_tech_resp_id == 'null' ) {

              setResponsEditable(true);

            } else {

              setResponsVisible(false);
              setResponsShow(true);
              setResponsEditable(false);

              setName(response.data.data[i].wko_det_tech_resp_id);

              let tech_Resp_Date = moment(response.data.data[i].wko_det_tech_resp_date.date).format('YYYY-MM-DD HH:mm');
              console.log(tech_Resp_Date);
              if (tech_Resp_Date === '1900-01-01 00:00') {
                setDateTime('');
              } else {
                setDateTime(tech_Resp_Date);
              }

              //setDateTime(response.data.data[i].wko_det_tech_resp_date.date);
              setReqName(response.data.data[i].wko_det_resp_name);
              setICNo(response.data.data[i].wko_det_resp_id);
              setPhoneNo(response.data.data[i].wko_det_resp_contact);

              let Resp_Date = moment( response.data.data[i].wko_det_resp_date.date).format('YYYY-MM-DD HH:mm');
              console.log(Resp_Date);
              if (Resp_Date === '1900-01-01 00:00') {
                setResponseDate('');
              } else {
                setResponseDate(Resp_Date);
              }
            }
          }
        } else {
          setResponsEditable(true);
          get_response_attachment_by_params();
        }

        get_response_attachment_by_params();
        //setspinner(false);
      } else {
        setspinner(false);
        setAlert(true,'danger',response.data.message,'OK');
        return;
      }
    } catch (error) {
      setspinner(false);
      alert(error);
    }
  };

  // GET WORK ORDER SING_ATTACHMENT FILE API
  const get_response_attachment_by_params = async () => {
    const SPLIT_URL = Baseurl.split('/');
    const SPLIT_URL1 = SPLIT_URL[SPLIT_URL.length - 2];
    const SPLIT_URL2 = SPLIT_URL[SPLIT_URL.length - 1];
    const SPLIT_URL3 = SPLIT_URL1+'/'+SPLIT_URL2
    console.log('URL' + SPLIT_URL3);

    try {
      console.log( 'JSON DATA : ' + `${Baseurl}/get_response_attachment_by_params.php?site_cd=${Site_cd}&rowid=${route.params.RowID}&url=${Baseurl}&folder=${SPLIT_URL3}&dvc_id=${dvc_id}`);
      const response = await axios.get( `${Baseurl}/get_response_attachment_by_params.php?site_cd=${Site_cd}&rowid=${route.params.RowID}&url=${Baseurl}&folder=${SPLIT_URL3}&dvc_id=${dvc_id}`);

      console.log('JSON DATA : ' + response.data.status);
      console.log('JSON DATA : ' + Attachments_List.length);

      if (response.data.status === 'SUCCESS') {

        Attachments_List.length = 0;
        if (response.data.data.length > 0) {

          setAttachments_List([]);
          for (let value of Object.values(response.data.data)) {
            let signpath = value.full_size_link;
            setSignature(signpath);
          }

        } else {
          setspinner(false);
        }

        setspinner(false);
      } else {
        setspinner(false);
        setAlert(true,'danger',response.data.message,'OK');
        return;
      }
    } catch (error) {
      setspinner(false);
      alert(error);
    }
  };

  //GET RESPONS OFFLINE
  const get_Respons_offline = async () =>{

    setspinner(true);

    if(!mst_RowID){

      console.log("not Empty")

      db.transaction(function(txn){

       //GET OFFLINE RESPONS
       txn.executeSql('SELECT * FROM wko_det_response WHERE  local_id =?',
       [Local_ID], (tx, results) => {
        
          var temp = [];
          console.log("get empty:"+JSON.stringify(results.rows.length));
          if(results.rows.length>0){

            for (let i = 0; i < results.rows.length; ++i) {

              console.log(results.rows.item(i))

              if ( results.rows.item(i).wko_det_tech_resp_id == '' || results.rows.item(i).wko_det_tech_resp_id == 'null' ) {
                setResponsEditable(true);
              } else {
                setResponsVisible(false);
                setResponsShow(true);
                setResponsEditable(false);
  
                setName(results.rows.item(i).wko_det_tech_resp_id);
  
                let tech_Resp_Date = moment( results.rows.item(i).wko_det_tech_resp_date, ).format('YYYY-MM-DD HH:mm');
                console.log(tech_Resp_Date);
                if (tech_Resp_Date === '1900-01-01 00:00') {
                  setDateTime('');
                } else {
                  setDateTime(tech_Resp_Date);
                }
  
                //setDateTime(results.rows.item(i).wko_det_tech_resp_date.date);
                setReqName(results.rows.item(i).wko_det_resp_name);
                setICNo(results.rows.item(i).wko_det_resp_id);
                setPhoneNo(results.rows.item(i).wko_det_resp_contact);
  
                let Resp_Date = moment( results.rows.item(i).wko_det_resp_date, ).format('YYYY-MM-DD HH:mm');
                console.log(Resp_Date);
                if (Resp_Date === '1900-01-01 00:00') {
                  setResponseDate('');
                } else {
                  setResponseDate(Resp_Date);
                }
              }
            }

            Offline_get_response_attachment_by_params();

          }else{

            setspinner(false);
            setResponsEditable(true);

          }

         
        })


     })

    }else{
      console.log(" Empty")


      db.transaction(function(txn){

        //GET OFFLINE RESPONS
        txn.executeSql('SELECT * FROM wko_det_response WHERE  mst_RowID =?',
        [mst_RowID], (tx, results) => {
         
           var temp = [];
           console.log("get empty:"+JSON.stringify(results.rows.length));
           if(results.rows.length>0){
 
             for (let i = 0; i < results.rows.length; ++i) {
               if (
                 results.rows.item(i).wko_det_tech_resp_id == '' ||
                 results.rows.item(i).wko_det_tech_resp_id == 'null'
               ) {
                 setResponsEditable(true);
               } else {
                 setResponsVisible(false);
                 setResponsShow(true);
                 setResponsEditable(false);
   
                 setName(results.rows.item(i).wko_det_tech_resp_id);
   
                 let tech_Resp_Date = moment( results.rows.item(i).wko_det_tech_resp_date, ).format('YYYY-MM-DD HH:mm');
                 console.log(tech_Resp_Date);
                 if (tech_Resp_Date === '1900-01-01 00:00') {
                   setDateTime('');
                 } else {
                   setDateTime(tech_Resp_Date);
                 }
   
                 //setDateTime(results.rows.item(i).wko_det_tech_resp_date.date);
                 setReqName(results.rows.item(i).wko_det_resp_name);
                 setICNo(results.rows.item(i).wko_det_resp_id);
                 setPhoneNo(results.rows.item(i).wko_det_resp_contact);
   
                 let Resp_Date = moment(
                   results.rows.item(i).wko_det_resp_date,
                 ).format('YYYY-MM-DD HH:mm');
                 console.log(Resp_Date);
                 if (Resp_Date === '1900-01-01 00:00') {
                   setResponseDate('');
                 } else {
                   setResponseDate(Resp_Date);
                 }
               }
             }

             Offline_get_response_attachment_by_params()
 
           }else{

            setspinner(false);
 
             setResponsEditable(true);
 
           }
 
           // for (let i = 0; i < results.rows.length; ++i){   
 
           //     console.log(results.rows.item(i));                 
           // }  
       
         })
 
 
      })
    }


  };
  
  //OFFLINE WORK ORDER SING_ATTACHMENT FILE
  const Offline_get_response_attachment_by_params =()=>{

      if(!mst_RowID){

        console.log("wko_ref:"+Local_ID)

        db.transaction(function(txn){

          txn.executeSql('SELECT * FROM wko_ref where local_id=? and column2 =?', 
          [Local_ID,'RESPONSE_SIGN'], 
          (txn, results) => {
            console.log("wko_ref:"+JSON.stringify(results))
           
            if(results.rows.length >0){
  
                var path;
                setAttachments_List([]);
                for (let i = 0; i < results.rows.length; ++i) {
  
                    console.log("PATH 123"+ JSON.stringify(results.rows.item(i)));

                    if(results.rows.item(i).Exist === 'New'){

                      path = results.rows.item(i).attachment;

                    }else{


                      if(results.rows.item(i).ref_type === 'Gallery_image'){
  
                        path = results.rows.item(i).Local_link;
                      }else{
                        path = 'file://'+results.rows.item(i).Local_link;
                      }

                    }

                    
                
                    setSignature(path);
  
                    // let key = Attachments_List.length + 1;
                    // let localIdentifier = key;
                    // if(results.rows.item(i).ref_type === 'Gallery_image'){
  
                    //      path = results.rows.item(i).Local_link;
                    // }else{
                    //      path = 'file://'+results.rows.item(i).Local_link;
                    // }
                  
                    // let name = results.rows.item(i).file_name;
                    // let rowid = results.rows.item(i).rowid;
                    // let imagetype  = 'Exist';
  
                    // //console.log("PATH"+ JSON.stringify(path));
  
                    // Attachments_List.unshift({key,path,name,imagetype,localIdentifier,rowid})
                    // setAttachments_List(Attachments_List.slice(0));
                    // key++;
  
                }
  
                setspinner(false);
  
            }else{

                setspinner(false);
  
            }
        
           })

        });

      }else{

        db.transaction(function(txn){

          txn.executeSql('SELECT * FROM wko_ref where mst_RowID=? and column2 = ?', 
          [mst_RowID,'RESPONSE_SIGN'], 
          (txn, results) => {
            console.log("wko_ref:"+JSON.stringify(results))
           
            if(results.rows.length >0){
  
                var path;
                setAttachments_List([]);
                for (let i = 0; i < results.rows.length; ++i) {
  
                    console.log("PATH 123"+ JSON.stringify(results.rows.item(i).Local_link));
                    //let signpath = results.rows.item(i).Local_link;  
                    
                    if(results.rows.item(i).Exist === 'New'){

                      path = results.rows.item(i).attachment;

                    }else{


                      if(results.rows.item(i).ref_type === 'Gallery_image'){
  
                        path = results.rows.item(i).Local_link;
                      }else{
                        path = 'file://'+results.rows.item(i).Local_link;
                      }

                    }
                
                    setSignature(path);
  
                    // let key = Attachments_List.length + 1;
                    // let localIdentifier = key;
                    // if(results.rows.item(i).ref_type === 'Gallery_image'){
  
                    //      path = results.rows.item(i).Local_link;
                    // }else{
                    //      path = 'file://'+results.rows.item(i).Local_link;
                    // }
                  
                    // let name = results.rows.item(i).file_name;
                    // let rowid = results.rows.item(i).rowid;
                    // let imagetype  = 'Exist';
  
                    // //console.log("PATH"+ JSON.stringify(path));
  
                    // Attachments_List.unshift({key,path,name,imagetype,localIdentifier,rowid})
                    // setAttachments_List(Attachments_List.slice(0));
                    // key++;
  
                }
  
                setspinner(false);
  
            }else{
              
                setspinner(false);
  
            }
        
           })

        });

      }

  }

  //SCAN QR CODE
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
  const onSuccess = e => {
    const check = e.data;
    console.log('scanned data' + check);

    setresult(e);
    setscan(false);
    setScanResult(false);

    if (!check) {
      setshowqrcode(false);
      //alert('Incorrect Scan Asset: ');
      setAlert(true,'warning','Incorrect Scan Asset’','OK');
    } else {
      setshowqrcode(false);
      const strParts = e.data.split('\n');
      //console.warn("split"+strParts[0].trim());

      get_asset_verify(strParts[0].trim());
    }

    // if (check === 'http') {

    // let url = e.data
    // alert('Incorrect Scan Asset: ' + url);
    // //console.warn(url)

    // //  console.warn(e.data)

    // } else {

    // setshowqrcode(false)
    // const  strParts =  e.data.split('\n');
    // console.warn("split"+strParts[0].trim())

    // setresult(e)
    // setscan(false)
    // setScanResult(true)

    // get_asset_verify(strParts[0].trim());

    // //page(strParts[0].trim());

    // // this.setState({
    // //     result: e,
    // //     scan: false,
    // //     ScanResult: true
    // // })
    //}
  };

  const get_asset_verify = qrasset => {
    console.log(qrasset.toUpperCase() );
    console.log(route.params.Selected_AssetNo);

    if (route.params.Selected_AssetNo == qrasset.toUpperCase()) {
      setVerified('Verified')
      setqrresult(qrasset);
      setcolorcode4('#8BC34A');
      setmodalVisible(!modalVisible);
      // alert('Ver')
    } else {
      setVerified('Not Verified')
      setqrresult(qrasset);
      setcolorcode4('#FF0000');
      setmodalVisible(!modalVisible);
    }
  };

  //RESPONSE BUTTON
  const Response = () => {
    //setmodalVisible(!modalVisible)
    setSaveVisible(!SaveVisible);
    setResponsShow(!ResponsShow);
  };

  //DATE  PICKER
  const showDatePicker = title => {
    //console.warn(title)
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    let fromDate = moment(date).format('YYYY-MM-DD HH:mm');
    setResponseDate(fromDate);
    hideDatePicker();
  };

  // verify button
  const verify_asset = () => {
    setmodalVisible(!modalVisible);

    setTimeout(() => {

      if (route.params.Selected_AssetNo == qrresult.toUpperCase()) {
        Update_Verify_asset('Verified');
      } else {
        Update_Verify_asset('Not Verified');
      }

    }, 500)

    
  };

  //Verified Asset No
  const Update_Verify_asset = async verify => {
    setspinner(true);
    var sync_date = moment().format('YYYY-MM-DD HH:mm');
    var varchar9;
    if(verify === 'Verified'){
      varchar9 = EmpID;
    }else if(verify === 'Not Verified'){
      varchar9 = null
    }

    let Update_VerifyAsset = {
      mst_RowID: route.params.RowID,
      site_cd: Site_cd,
      wko_det_varchar9: varchar9,
      wko_det_varchar10: verify,
      wko_det_datetime5: sync_date,
      LOGINID: LoginID,
      scanvalue : qrresult.toUpperCase()
    };

    console.log('UPDATE Verify Asset: ' + JSON.stringify(Update_VerifyAsset));

    try {
      const response = await axios.post( `${Baseurl}/update_verify_asset.php?`, JSON.stringify(Update_VerifyAsset),
        {headers: {'Content-Type': 'application/json'}});
      console.log('Response:' + JSON.stringify(response.data.status));
      if (response.data.status === 'SUCCESS') {
        setspinner(false);
        // Alert.alert(response.data.status, response.data.message, [
        //   {text: 'OK', onPress: () => _goBack()},
        // ]);

        setAlert(true,'success',response.data.message,'UPDATE_VERIFY_ASSET');

      } else {
        setspinner(false);
        // Alert.alert(response.data.status, response.data.message, [
        //   {text: 'OK'},
        // ]);
        setAlert(true,'warning',response.data.message,'OK');
      }
    } catch (error) {
      setspinner(false);
      alert(error);
    }
  };


  const Save_response = ()=>{

    if (!ReqName) {
      //alert('Please enter requester name');
      setAlert(true,'warning','Please enter requester name','OK');
      Valid = false;
      return
    } else {

      if (!ICNo) {
        //alert('Please enter requester IC No');
        setAlert(true,'warning','Please enter requester IC No','OK');
        Valid = false;
        return
      } else {

      

        if (Attachments_List.length > 0) {
          Valid = true;
        }else{

          //alert('Please sign the response signature');
          setAlert(true,'warning','Please sign the response signature','OK');
          Valid = false;
          return

        }

      }

    }

    if(Valid){

      console.log("test",Valid);

      if (WIFI === 'OFFLINE') {

        Update_Response_offline();

      }else{

        Update_Response();

      }

    }else{

    }

    


  }

  //Save Button
  const Update_Response = async () => {
    
    setspinner(true);

    var sync_date = moment().format('YYYY-MM-DD HH:mm');
    let dvc_id = DeviceInfo.getDeviceId();

    let Update_VerifyAsset = {

      site_cd: Site_cd,
      mst_RowID: route.params.RowID,

      wko_det_tech_resp_date: sync_date,
      wko_det_tech_resp_id: EmpID,
      wko_det_resp_contact: PhoneNo,
      wko_det_resp_id: ICNo,
      wko_det_resp_date: ResponseDate,
      wko_det_resp_name: ReqName,
      wko_det_varchar9: EmpID,

      LOGINID: LoginID,
      dvc_id: dvc_id,
      sync_step: '',
      sync_time: sync_date,
      sync_status: 'online',
      sync_url: Baseurl + '/update_response.php?',
    };

    console.log('update_response: ' + JSON.stringify(Update_VerifyAsset));

    try {
      const response = await axios.post( `${Baseurl}/update_response.php?`, JSON.stringify(Update_VerifyAsset), 
      {headers: {'Content-Type': 'application/json'}},
      );
      console.log('Response:' + JSON.stringify(response.data.status));
      if (response.data.status === 'SUCCESS') {
        //setspinner(false)

        if (Attachments_List.length > 0) {
          Insert_image(response.data.message);
        } else {
          setspinner(false);
          // Alert.alert(response.data.status, response.data.message, [
          //   {text: 'OK', onPress: () => _goBack()},
          // ]);

          setAlert(true,'success',response.data.message,'UPDATE_RESPONSE');

        }
      } else {
        setspinner(false);
        // Alert.alert(response.data.status, response.data.message, [
        //   {text: 'OK'},
        // ]);

        setAlert(true,'warning',response.data.message,'OK');
      }
    } catch (error) {
      setspinner(false);
      alert(error);
    }
  };

  //INSERT WORK ORDER  RESPONSE SING FILE API
  const Insert_image = async (message) => {
   

    const SPLIT_URL = Baseurl.split('/');
    const SPLIT_URL1 = SPLIT_URL[SPLIT_URL.length - 2];
    const SPLIT_URL2 = SPLIT_URL[SPLIT_URL.length - 1];
    const SPLIT_URL3 = SPLIT_URL1+'/'+SPLIT_URL2
    console.log('URL' + SPLIT_URL3);

    let data = {
      data: {
        rowid: route.params.RowID,
        site_cd: Site_cd,
        EMPID: EmpID,
        LOGINID: LoginID,
        folder: SPLIT_URL3,
        dvc_id: dvc_id,
      },
    };

    console.log(JSON.stringify(data));
    console.log(Attachments_List);
    const formData = new FormData();
    formData.append('count', Attachments_List.length);
    formData.append('json', JSON.stringify(data));

    let k = 0;
    for (let i = 0; i < Attachments_List.length; i++) {
      k++;
      //formData.append('file_'+[k], {uri: Attachments_List[i].signpath,name: Attachments_List[i].name,type: 'image/jpeg'});
      //formData.append('photo', {uri: Attachments_List[i].path,name: Attachments_List[i].name});
      // formData.append('Content-Type', 'image/png');
      formData.append('base64string', Attachments_List[i].signpath);
    }
    console.log(JSON.stringify(formData));

    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${Baseurl}/update_response_image_file_react.php?`);
      xhr.setRequestHeader('Content-Type', 'multipart/form-data');
      xhr.send(formData);
      console.log('success', xhr.responseText);
      xhr.onreadystatechange = e => {
        if (xhr.readyState !== 4) {
          return;
        }

        if (xhr.status === 200) {
          console.log('success', xhr.responseText);
          var json_obj = JSON.parse(xhr.responseText);
          console.log('success', json_obj.data);
          if (json_obj.data.wko_ref.length > 0) {
            setspinner(false);
            // Alert.alert(json_obj.status, json_obj.message, [
            //   {text: 'OK', onPress: () => _goBack()},
            // ]);
            setAlert(true,'success',message,'UPDATE_RESPONSE');
          } else {
            setspinner(false);
            //Alert.alert(json_obj.status, json_obj.message, [{text: 'OK'}]);
            setAlert(true,'success',message,'UPDATE_RESPONSE');
          }
        } else {
          setspinner(false);
          //alert(xhr.responseText);
          setAlert(true,'warning',xhr.responseText,'OK');

          //console.log('error', xhr.responseText);
        }
      };
    } catch (error) {
      setspinner(false);
      alert(error);
    }
  };

  //INSERT WORK ORDER RESPONSE OFFLINE
  const Update_Response_offline = async () => {

    setspinner(true);
    var sync_date = moment().format('yyyy-MM-DD HH:mm');
    dvc_id = DeviceInfo.getDeviceId();

    if(!mst_RowID){

      console.log("Empty")

      db.transaction(function(txn){

        console.log('UPDATE IN sync_date', sync_date)
        console.log('UPDATE IN EmpID',EmpID)
        console.log('UPDATE IN PhoneNo',PhoneNo)
        console.log('UPDATE IN ICNo',ICNo)
        console.log('UPDATE IN ReqName' ,ReqName)
        console.log('UPDATE IN ResponseDate',ResponseDate)
        console.log('UPDATE IN LoginID',LoginID)
        console.log('UPDATE IN DB',mst_RowID)

        
        //GET OFFLINE RESPONS
       txn.executeSql('SELECT * FROM wko_det_response WHERE  local_id =?',
       [Local_ID], (tx, results) => {

        console.log("get empty:"+JSON.stringify(results.rows.length));
        if(results.rows.length > 0 ){

          txn.executeSql(
            'UPDATE wko_det_response SET wko_det_tech_resp_date=?,wko_det_tech_resp_id=?,wko_det_resp_contact=?,wko_det_resp_id=?,wko_det_resp_name=?,wko_det_resp_date=?,sts_column=?,LOGINID=? WHERE mst_RowID=?',
            [sync_date,EmpID,PhoneNo,ICNo,ReqName,ResponseDate,'',LoginID,mst_RowID],
            (txn, results) => {
                console.log('wko_det_response Results_test', results.rowsAffected);
                if (results.rowsAffected > 0) {

                  if (Attachments_List.length > 0) {

                    Insert_image_Offline()
                   }else{
                    console.log('UPDATE TABLE wko_det_response Successfully')

                    setspinner(false);
                   
                    
                    // Alert.alert(
                    //   'Success',
                    //   'Update Response successfully',
                    //   [
                    //       {
                          
                    //       text: 'Ok',
                    //       onPress: () => _goBack(),
                    //       },
                    //   ],
                    //   { cancelable: false }
                    //   );

                    setAlert(true,'success','Update Response successfully','UPDATE_RESPONSE');
      

                  }
                    
                }else{ 
                  setspinner(false);
                  setAlert(true,'warning','Update Response Unsuccessfully','OK');
                  //console.log('UPDATE TABLE wko_det_response Unsuccessfully')
                }
      
            }
          )

        }else{

          db.transaction(function (tx) {
             
            tx.executeSql('INSERT INTO wko_det_response (site_cd,RowID,mst_RowID,wko_det_tech_resp_date,wko_det_tech_resp_id,wko_det_resp_contact,wko_det_resp_id,wko_det_resp_name,wko_det_resp_date,sts_column,LOGINID,local_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
            [Site_cd,null,null,sync_date,EmpID,PhoneNo,ICNo,ReqName,ResponseDate,'',LoginID,Local_ID],
            (tx, results) => {
               //console.log('wko_det_response Results_test', results.rowsAffected);
                if (results.rowsAffected > 0) {

                  if (Attachments_List.length > 0) {

                    Insert_image_Offline()

                  }else{

                    console.log('INSERT TABLE wko_det_response Successfully')
                    setspinner(false);
                    // Alert.alert(
                    //   'Success',
                    //   'Response update successfully',
                    //   [
                    //       {
                          
                    //       text: 'Ok',
                    //       onPress: () => _goBack(),
                    //       },
                    //   ],
                    //   { cancelable: false }
                    //   );

                    setAlert(true,'success','Update Response successfully','UPDATE_RESPONSE');

                  }

                    
                }else{ 
                   setspinner(false); 
                   setAlert(true,'warning','Update Response Unsuccessfully','OK');
                   //alert('INSERT TABLE wko_det_response Failed')
                }

            }
            )
          })

          
        }

       })
        

      })

    }else{
      console.log("not Empty")
      db.transaction(function(txn){

       
        console.log('UPDATE IN sync_date', sync_date)
        console.log('UPDATE IN EmpID',EmpID)
        console.log('UPDATE IN PhoneNo',PhoneNo)
        console.log('UPDATE IN ICNo',ICNo)
        console.log('UPDATE IN ReqName' ,ReqName)
        console.log('UPDATE IN ResponseDate',ResponseDate)
        console.log('UPDATE IN LoginID',LoginID)
        console.log('UPDATE IN DB',mst_RowID)


        txn.executeSql('SELECT * FROM wko_det_response WHERE  mst_RowID =?',
        [mst_RowID], (tx, results) => {

          if(results.rows.length > 0 ){


            txn.executeSql(
              'UPDATE wko_det_response SET wko_det_tech_resp_date=?,wko_det_tech_resp_id=?,wko_det_resp_contact=?,wko_det_resp_id=?,wko_det_resp_name=?,wko_det_resp_date=?,sts_column=?,LOGINID=? WHERE mst_RowID=?',
              [sync_date,EmpID,PhoneNo,ICNo,ReqName,ResponseDate,'Update',LoginID,mst_RowID],
              (txn, results) => {
                  console.log('wko_det_response Results_test', results.rowsAffected);
                  if (results.rowsAffected > 0) {
    
    
                    if (Attachments_List.length > 0) {
    
                      Insert_image_Offline()
    
                    }else{
                      setspinner(false);
                      console.log('UPDATE TABLE wko_det_response Successfully')
                      setAlert(true,'success','Update Response successfully','UPDATE_RESPONSE');
    
                    }
                  }else{ 
                    setspinner(false);
                    setAlert(true,'warning','Update Response Unsuccessfully','OK');
                    //console.log('UPDATE TABLE wko_det_response Unsuccessfully')
                  }
        
              }
            )

          }else{

            db.transaction(function (tx) {
             
              tx.executeSql('INSERT INTO wko_det_response (site_cd,RowID,mst_RowID,wko_det_tech_resp_date,wko_det_tech_resp_id,wko_det_resp_contact,wko_det_resp_id,wko_det_resp_name,wko_det_resp_date,sts_column,LOGINID,mst_RowID) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
              [Site_cd,null,mst_RowID,sync_date,EmpID,PhoneNo,ICNo,ReqName,ResponseDate,'',LoginID,mst_RowID],
              (tx, results) => {
                 //console.log('wko_det_response Results_test', results.rowsAffected);
                  if (results.rowsAffected > 0) {
  
                    if (Attachments_List.length > 0) {
  
                      Insert_image_Offline()
  
                    }else{
  
                      console.log('INSERT TABLE wko_det_response Successfully')
                      setspinner(false);
                      
  
                      setAlert(true,'success','Update Response successfully','UPDATE_RESPONSE');
  
                    }
  
                      
                  }else{ 
                     setspinner(false); 
                     setAlert(true,'warning','Update Response Unsuccessfully','OK');
                     //alert('INSERT TABLE wko_det_response Failed')
                  }
  
              }
              )
            })

          }

        })

        
  
      })
    }
    
  };


  //INSERT WORK ORDER ATTACHMENT OFFLINE
  const Insert_image_Offline=(async()=>{

  console.log("LENGTH: "+Attachments_List.length)

  if(!mst_RowID){

    db.transaction(function (tx) {

      for (let i = 0; i < Attachments_List.length; i++){ 

        let localpath = Attachments_List[i].signpath;

        //console.log('localpath' ,localpath);

        tx.executeSql('INSERT INTO wko_ref (site_cd,type,file_name,ref_type,Exist,attachment,local_id,column2) VALUES (?,?,?,?,?,?,?,?)',
        [Site_cd,'A','Response_sign','Gallery_image','New',localpath,Local_ID,'RESPONSE_SIGN'],
        (tx, results) => {

          if (results.rowsAffected > 0) {

            console.log('INSERT TABLE wko_ref Successfully')
            setspinner(false);
                   
                    
            // Alert.alert(
            //   'Success',
            //   'Response update successfully',
            //   [
            //       {
                  
            //       text: 'Ok',
            //       onPress: () => _goBack(),
            //       },
            //   ],
            //   { cancelable: false }
            //   );

            setAlert(true,'success','Update Response successfully','UPDATE_RESPONSE');

              

          }else{

            setspinner(false);
            setAlert(true,'warning','Update Response Unsuccessfully','OK');
            //alert('INSERT TABLE wko_ref Failed')

          }

        })

      }
      

    })

        
  }else{


    db.transaction(function (tx) {

      for (let i = 0; i < Attachments_List.length; i++){ 

        let localpath = Attachments_List[i].signpath;

        //console.log('localpath' ,localpath);

        tx.executeSql('INSERT INTO wko_ref (site_cd,type,file_name,ref_type,Exist,attachment,local_id,mst_RowID,column2) VALUES (?,?,?,?,?,?,?,?,?)',
        [Site_cd,'A','Response_sign','Gallery_image','New',localpath,Local_ID,mst_RowID,'RESPONSE_SIGN'],
        (tx, results) => {

          if (results.rowsAffected > 0) {
            setspinner(false);
            console.log('INSERT TABLE wko_ref Successfully')
            // Alert.alert(
            //   'Success',
            //   'Response update successfully',
            //   [
            //       {
                  
            //       text: 'Ok',
            //       onPress: () => _goBack(),
            //       },
            //   ],
            //   { cancelable: false }
            //   );

            setAlert(true,'success','Update Response successfully','UPDATE_RESPONSE');

              

          }else{

            setspinner(false);
            setAlert(true,'warning','Update Response Unsuccessfully','OK');
           // alert('INSERT TABLE wko_ref Failed')

          }

        })

      }
     

    })



  }


  })


  const takeSnapshot = async img => {

    var sync_date = moment().format('YYYY-MM-DD HH:mm');

    var today = Math.round((new Date()).getTime() / 1000);

    console.log(today);

    setSingVisible(!SingVisible);

    console.log('path :-', img);
    console.log(img);
    setSignature(img);

    let signpath = img;
    let name = 'Signature_'+today+'.jpg';
    let exist = 'New';
    console.log('name :-', name);
    Attachments_List.unshift({signpath, name,exist});
    setAttachments_List(Attachments_List.slice(0));
  };


  const setAlert =(show,theme,title,type)=>{

    setShow(show);
    setTheme(theme);
    setTitle(title);
    setAlertType(type);
    

  }


  const setAlert_two =(show,theme,title,type,value)=>{

    setShow_two(show);
    setTheme(theme);
    setTitle(title);
    setAlertType(type);
    setImgValue(value);

  }


  const One_Alret_onClick =(D) =>{

    if(D === 'OK'){

      setShow(false)

    }else if(D === 'UPDATE_RESPONSE'){

      setShow(false)

      _goBack()

    }else if(D === 'UPDATE_VERIFY_ASSET'){

      setShow(false)

      _goBack()

    }

  }

  const Alret_onClick =(D) =>{

    setShow_two(false)

    if(D === 'BACK'){

      _goBack()

    } 

  }




  return (
    <DismissKeyboard>
      <SafeAreaProvider>
        <Appbar.Header style={{backgroundColor: '#42A5F5'}}>
          <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', }}>
            <Pressable onPress={_goBack}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <FontAwesome
                  name="angle-left"
                  color="#fff"
                  size={55}
                  style={{marginLeft: 15, marginBottom: 5}}
                />
                <Text style={{ fontSize: 20, justifyContent: 'center', textAlign: 'center', color: '#fff', fontWeight: 'bold', marginLeft: 15, }}> {Toolbartext} </Text>
              </View>
            </Pressable>
          </View>
        </Appbar.Header>

        <ProgressLoader
          visible={spinner}
          isModal={true}
          isHUD={true}
          hudColor={'#808080'}
          color={'#FFFFFF'}
        />

        <DateTimePicker
          isVisible={isDatepickerVisible}
          mode="datetime"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />

        <SCLAlert 
            theme={Theme} 
            show={Show} 
            title={Title}>

                <SCLAlertButton theme={Theme}   onPress={()=>One_Alret_onClick(AlertType)}>OK</SCLAlertButton>
        </SCLAlert>

        <SCLAlert
          theme={Theme} 
          show={Show_two} 
          title={Title} >

          <SCLAlertButton theme={Theme}  onPress={()=>Alret_onClick(AlertType)}>Yes</SCLAlertButton>
          <SCLAlertButton theme="default" onPress={()=>setShow_two(false)}>No</SCLAlertButton>

        </SCLAlert>

        <Modal visible={showqrcode}>
          <View style={styles.scrollViewStyle}>
            <Fragment>
              <SafeAreaView
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.text_stytle}></Text>
                <TouchableOpacity onPress={() => setshowqrcode(false)}>
                  <AntDesign
                    name="close"
                    color="#FFF"
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
                  <TouchableOpacity
                    onPress={activeQR}
                    style={styles.buttonScan}>
                    <View style={styles.buttonWrapper}>
                      {/* <Image source={require('../../images/camera.png')} style={{height: 36, width: 36}}></Image> */}
                      <Text
                        style={{...styles.buttonTextStyle, color: '#2196f3'}}>
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

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
           //Alert.alert('Closed');
            setmodalVisible(!modalVisible);
          }}>
          <View style={styles.model_cardview}>
            <View
              style={{ margin: 20, backgroundColor: '#FFFFFF', justifyContent: 'center', }}>
              <View
                style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0096FF', }}>
                <Text style={{ flex: 1, fontSize: 15, justifyContent: 'center', color: '#ffffffff', margin: 5, fontWeight: 'bold', }}> Asset Search </Text>
                <Ionicons
                  name="close"
                  color="#ffffffff"
                  size={25}
                  style={{marginEnd: 15, justifyContent: 'flex-end'}}
                  onPress={() => setmodalVisible(false)}
                />
              </View>

              <View style={{marginTop: 10}}>

                <Text style={{color: '#05375a', fontSize: 13, margin: 10}}> Asset No: {route.params.Selected_AssetNo} </Text>

                <Text style={{color: '#05375a', fontSize: 13, margin: 10}}> QR Code Asset NO: {qrresult} </Text>

                <Text style={{ color: colorcode4, fontSize: 15, margin: 10, fontWeight: 'bold'}}> {Verified} </Text>

              </View>

              <TouchableOpacity
                style={{ width: '100%', height: 50, alignItems: 'center', justifyContent: 'center', backgroundColor: 'green', marginTop: 10, }} onPress={verify_asset}>
                <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}> OK </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={SingVisible}
          onRequestClose={() => {
           //Alert.alert('Closed');
            setSingVisible(!SingVisible);
          }}>
          <View style={styles.model_cardview}>
            <View style={{margin: 20, height:"50%",backgroundColor: '#FFFFFF', padding: 10}}>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#0096FF', }}>
                <Text style={{ flex: 1, fontSize: 15, justifyContent: 'center', color: '#ffffffff', margin: 5, }}> Signature </Text>
                <Ionicons
                  name="close"
                  color="#ffffffff"
                  size={25}
                  style={{marginEnd: 15}}
                  onPress={() => setSingVisible(false)}
                />
              </View>

                <View style={{ flex: 1,alignItems:'center', }}>
                              
                    <Signature
                        onOK={img => takeSnapshot(img)}
                        onEmpty={() => console.log('onEmpty')}
                        onClear={() => setSignature(null)}
                        autoClear={true}
                        imageType={'image/png+xml'}
                        webStyle={style}
                    />
                </View>
            </View>
          </View>
        </Modal>

        <View style={styles.container}>

        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : null} 
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>       

            <ScrollView style={{flex: 1, marginBottom: 50}}>

              <View style={{margin: 10}}>

                {Verify_Visible && (

                    <TouchableOpacity
                      style={{ width: '100%', height: 60, backgroundColor: '#0096FF', alignItems: 'center', justifyContent: 'center'}}
                      onPress={OpenQRCode}>
                      <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}> Verify Asset </Text>
                    </TouchableOpacity>

                )}
                

                {ResponsVisible && (
                  <TouchableOpacity
                    style={{ width: '100%', height: 60, backgroundColor: '#0050A0', alignItems: 'center', justifyContent: 'center', marginTop: 10, }}
                    onPress={Response}>
                    <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}> Response </Text>
                  </TouchableOpacity>
                )}
              </View>
              
                {ResponsShow && (
                  <View style={{margin: 10}}>
                    <View style={styles.card_01}>
                      <View
                        style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#0096FF', borderTopRightRadius: 10, borderTopLeftRadius: 10, }}>
                        <Text style={{ fontSize: 15, justifyContent: 'center', color: '#ffffffff', margin: 5, fontWeight: 'bold', }}> TECHNICIAN INFORMATION </Text>
                      </View>

                        <View style={{marginTop: 5, marginBottom: 10}}>

                          {/* Name */}
                          <View style={styles.view_style}>
                            <TextInput
                              value={Name}
                              style={[ styles.input, { height: Math.max( Platform.OS === 'ios' ? 50 : 50, height)}]}
                              inputStyle={[ styles.inputStyle, {color: !Editable ? '#808080' : '#000'}, ]}
                              labelStyle={styles.labelStyle}
                              placeholderStyle={{ fontSize: 15, color: '#0096FF', }}
                              textErrorStyle={styles.textErrorStyle}
                              label="Name"
                              placeholderTextColor="gray"
                              focusColor="#808080"
                              editable={Editable}
                              selectTextOnFocus={Editable}
                              onChangeText={text => { setName(text); }}
                              renderRightIcon={() =>
                                !Editable ? (
                                  ''
                                ) : (
                                  <AntDesign
                                    style={styles.icon}
                                    color={'black'}
                                    name={Name ? 'close' : ''}
                                    size={22}
                                    disable={true}
                                    onPress={() => (Name ? setName('') : '')}
                                  />
                                )
                              }
                            />
                          </View>

                          {/* Date/Time */}
                          <View style={styles.view_style}>
                            <TextInput
                              value={DateTime}
                              style={[ styles.input, { height: Math.max( Platform.OS === 'ios' ? 50 : 50, height)}]}
                              inputStyle={[ styles.inputStyle, {color: !Editable ? '#808080' : '#000'}]}
                              labelStyle={styles.labelStyle}
                              placeholderStyle={{ fontSize: 15, color: '#0096FF'}}
                              textErrorStyle={styles.textErrorStyle}
                              label="Date/Time"
                              placeholderTextColor="gray"
                              focusColor="#808080"
                              editable={Editable}
                              selectTextOnFocus={Editable}
                              onChangeText={text => { setDateTime(text)}}
                              renderRightIcon={() =>
                                !Editable ? (
                                  ''
                                ) : (
                                  <AntDesign
                                    style={styles.icon}
                                    color={'black'}
                                    name={DateTime ? 'close' : ''}
                                    size={22}
                                    disable={true}
                                    onPress={() => (DateTime ? setDateTime('') : '')}
                                  />
                                )
                              }
                            />
                          </View>
                        </View>
                      </View>

                      <View style={styles.card_01}>
                        <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#0096FF', borderTopRightRadius: 10, borderTopLeftRadius: 10 }}>
                          <Text style={{ fontSize: 15, justifyContent: 'center', color: '#ffffffff', margin: 5, fontWeight: 'bold'}}> REQUESTER INFORMATION </Text>
                        </View>

                        <View style={{marginTop: 5, marginBottom: 10}}>
                          {/* Requester Name */}
                          <View style={styles.view_style}>
                            <TextInput
                              value={ReqName}
                              style={[ styles.input, { height: Math.max( Platform.OS === 'ios' ? 50 : 50, height)}]}
                              inputStyle={[ styles.inputStyle, {color: !ResponsEditable ? '#808080' : '#000'}]}
                              labelStyle={styles.labelStyle}
                              placeholderStyle={{ fontSize: 15, color: '#0096FF'}}
                              textErrorStyle={styles.textErrorStyle}
                              label="Name"
                              placeholderTextColor="gray"
                              focusColor="#808080"
                              editable={ResponsEditable}
                              selectTextOnFocus={ResponsEditable}
                              onChangeText={text => { setReqName(text)}}
                              renderRightIcon={() =>
                                ResponsEditable ? (
                                  ''
                                ) : (
                                  <AntDesign
                                    style={styles.icon}
                                    color={'black'}
                                    name={ResponsEditable ? 'close' : ''}
                                    size={22}
                                    disable={true}
                                    onPress={() => (ReqName ? setReqName('') : '')}
                                  />
                                )
                              }
                            />
                          </View>

                          {/* IC No */}
                          <View style={styles.view_style}>
                            <TextInput
                              value={ICNo}
                              style={[ styles.input, { height: Math.max( Platform.OS === 'ios' ? 50 : 50, height )}]}
                              inputStyle={[ styles.inputStyle, {color: !ResponsEditable ? '#808080' : '#000'}]}
                              labelStyle={styles.labelStyle}
                              placeholderStyle={{ fontSize: 15, color: '#0096FF'}}
                              textErrorStyle={styles.textErrorStyle}
                              label="Staff No"
                              placeholderTextColor="gray"
                              focusColor="#808080"
                              editable={ResponsEditable}
                              selectTextOnFocus={ResponsEditable}
                              onChangeText={text => { setICNo(text) }}
                              renderRightIcon={() =>
                                ResponsEditable ? (
                                  ''
                                ) : (
                                  <AntDesign
                                    style={styles.icon}
                                    color={'black'}
                                    name={ResponsEditable ? 'close' : ''}
                                    size={22}
                                    disable={true}
                                    onPress={() => (ICNo ? setICNo('') : '')}
                                  />
                                )
                              }
                            />
                          </View>

                          {/* Phone no */}
                          <View style={styles.view_style}>
                            <TextInput
                              value={PhoneNo}
                              style={[ styles.input, { height: Math.max( Platform.OS === 'ios' ? 50 : 50, height)}]}
                              inputStyle={[ styles.inputStyle, {color: !ResponsEditable ? '#808080' : '#000'}]}
                              labelStyle={styles.labelStyle}
                              placeholderStyle={{ fontSize: 15, color: '#0096FF'}}
                              textErrorStyle={styles.textErrorStyle}
                              label="Phone No"
                              keyboardType="numeric"
                              placeholderTextColor="gray"
                              focusColor="#808080"
                              editable={ResponsEditable}
                              selectTextOnFocus={ResponsEditable}
                              onChangeText={text => { setPhoneNo(text)}}
                              renderRightIcon={() =>
                                ResponsEditable ? (
                                  ''
                                ) : (
                                  <AntDesign
                                    style={styles.icon}
                                    color={'black'}
                                    name={PhoneNo ? '' : ''}
                                    size={22}
                                    disable={true}
                                    onPress={() => (PhoneNo ? setPhoneNo('') : '')}
                                  />
                                )
                              }
                            />
                          </View>

                          {/* Response Date */}
                          <View style={{ flexDirection: 'row', justifyContent: 'space-around'}}>
                            {/* From Date */}
                            <View style={styles.view_style}>
                              <Pressable
                                onPress={() => ResponsEditable ? showDatePicker() : '' }>
                                <View pointerEvents={'none'}>
                                  <TextInput
                                    value={ResponseDate}
                                    style={[styles.input]}
                                    inputStyle={[ styles.inputStyle, {color: !ResponsEditable ? '#808080' : '#000'}]} labelStyle={styles.labelStyle}
                                    placeholderStyle={{ fontSize: 15, color: '#0096FF'}}
                                    textErrorStyle={styles.textErrorStyle}
                                    label="Response Date"
                                    placeholderTextColor="gray"
                                    focusColor="#808080"
                                    editable={false}
                                    selectTextOnFocus={false}
                                    renderRightIcon={() => (
                                      <AntDesign
                                        style={styles.icon}
                                        color={'black'}
                                        name={'calendar'}
                                        size={20}
                                      />
                                    )}
                                  />
                                </View>
                              </Pressable>
                            </View>
                          </View>

                        </View>

                        {signature && (
                          <Image style={sing_styles.preview} source={{uri: signature,cache: "reload"}} />
                        )}

                        {SaveVisible && (
                          <TouchableOpacity
                            style={{ height: 40, backgroundColor: '#42A5F5', margin: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center'}}
                            onPress={() => setSingVisible(true)}>
                            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', }}> Signature </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  
                )}
              </ScrollView>
          </KeyboardAwareScrollView>
        </View>

        {SaveVisible && (
          <View style={styles.bottomView}>
            <TouchableOpacity
              style={{ width: '100%', height: 60, backgroundColor: '#8BC34A', alignItems: 'center', justifyContent: 'center', }}
              onPress={Save_response}>
              <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaProvider>
    </DismissKeyboard>
  );
};

export default Response;

const style = `.m-signature-pad--footer
    .button {
      background-color: #42A5F5;
      color: #FFF;
    }.m-signature-pad {
        position: fixed;
        margin:auto; 
        top: 0; 
        width:100%;
        height:85%
    }`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollViewStyle: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#2196f3',
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

  centerText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    padding: 32,
    color: 'white',
  },

  bottomContent: {
    width: deviceWidth,
    height: 120,
  },

  buttonTextStyle: {
    color: 'black',
    fontWeight: 'bold',
  },
  card_01: {
    backgroundColor: '#FFFFFF',
    margin: 10,
    borderRadius: 10,
  },
  bottomView: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },
  model_cardview: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },

  view_style: {
    flex: 1,
    marginTop: 15,
    marginLeft: 10,
    marginRight: 10,
  },

  input: {
    paddingHorizontal: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#808080',
  },

  inputStyle: {fontSize: 15, marginTop: Platform.OS === 'ios' ? 8 : 0},

  labelStyle: {
    fontSize: 13,
    position: 'absolute',
    top: -10,
    color: '#0096FF',
    backgroundColor: 'white',
    paddingHorizontal: 4,
    marginLeft: -4,
  },
  textErrorStyle: {fontSize: 16},
});

const sing_styles = StyleSheet.create({
  preview: {
    width: "100%",
    height: 200,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
    padding:20,
    marginTop: 15,
    resizeMode:"contain"
  },
  previewText: {
    color: "#FFF",
    fontSize: 14,
    height: 40,
    lineHeight: 40,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#69B2FF",
    width: 120,
    textAlign: "center",
    marginTop: 10,
  },
});
