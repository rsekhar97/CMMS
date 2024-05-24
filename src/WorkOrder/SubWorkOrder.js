import React from 'react';
import { View, StyleSheet, Text, Image, Dimensions, TouchableOpacity, Alert, Pressable, FlatList, Modal, BackHandler, ScrollView, RefreshControl, TouchableWithoutFeedback, Keyboard, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import ProgressLoader from 'rn-progress-loader';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {Appbar} from 'react-native-paper';
import {openDatabase} from 'react-native-sqlite-storage';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import ImagePickerModal from 'react-native-image-picker-modal';
import Att_Modal from 'react-native-modal';
import {TextInput} from 'react-native-element-textinput';
import {SearchBar} from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {PermissionsAndroid} from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import {launchCamera} from 'react-native-image-picker';
import Video from 'react-native-video-enhanced';
import ImageViewer from 'react-native-image-zoom-viewer';
import {SCLAlert, SCLAlertButton} from 'react-native-scl-alert';
import UserAvatar from '@muhzi/react-native-user-avatar';
import { format } from 'date-fns';
import Pdf from 'react-native-pdf';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import { Image as CPImage} from 'react-native-compressor';
import { Video as CPVideo} from 'react-native-compressor';

var db = openDatabase({name: 'CMMS.db'});

const DismissKeyboard = ({children}) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
);

let Baseurl, Site_cd, LoginID, EmpName, EmpID, EmpPhone, EmpWorkGrp, dvc_id, OrgPriority, dft_mst_wko_asset_no, WIFI, mst_RowID, Local_ID,emp_ls1_charge_rate,emp_det_craft,dft_mst_tim_act;

const SubWorkOrder = ({route,navigation}) => {

    const _goBack = () => {

        console.log('Screenname', route.params.Screenname);
        if (route.params.Screenname == 'FilteringWorkOrder'){

            navigation.navigate('CreateWorkOrder',{
      
            Selected_WorkOrder_no:route.params.Selected_WorkOrder_no,
            RowID:route.params.RowID,
      
            //no need back
            Selected_AssetNo:route.params.Selected_AssetNo,
           
            Screenname:route.params.Screenname,
      
      
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
          }else if (route.params.Screenname == 'MyWorkOrder') {
              navigation.navigate('CreateWorkOrder',{
      
                Selected_WorkOrder_no:route.params.Selected_WorkOrder_no,
                RowID:route.params.RowID,
      
      
                //no need back
                Selected_AssetNo:route.params.Selected_AssetNo,
      
                local_id:route.params.local_id,
                Selected_wko_mst_ast_cod:route.params.Selected_wko_mst_ast_cod,
                Selected_wko_mst_type:route.params.Selected_wko_mst_type,
                Screenname:route.params.Screenname,
      
              });
          }else if (route.params.Screenname == 'WoDashboard'  || route.params.Screenname == 'MYWO_Dashboard_Due' || route.params.Screenname == 'MYWO_Dashboard_Past') {
              navigation.navigate('CreateWorkOrder',{
      
                Selected_WorkOrder_no:route.params.Selected_WorkOrder_no,
                RowID:route.params.RowID,
      
      
                //no need back
                Selected_AssetNo:route.params.Selected_AssetNo,
      
                local_id:route.params.local_id,
                Selected_wko_mst_ast_cod:route.params.Selected_wko_mst_ast_cod,
                Selected_wko_mst_type:route.params.Selected_wko_mst_type,
      
                Screenname:route.params.Screenname,
                type:route.params.type,
      
              });
          }else if (route.params.Screenname == 'ScanAssetMaster'){
      
              if(route.params.ScanAssetType =='New'){
      
                  
      
              }else if(route.params.ScanAssetType =='Edit'){
      
                  navigation.navigate('CreateWorkOrder',{
      
                    Selected_WorkOrder_no:route.params.Selected_WorkOrder_no,
                    RowID:route.params.RowID,
      
                    //no need back
                    Selected_AssetNo:route.params.Selected_AssetNo,
      
                    Screenname:route.params.Screenname,
                    ScanAssetType:route.params.ScanAssetType,
                    ScanAssetno:route.params.ScanAssetno,
                    ScanAssetRowID:route.params.ScanAssetRowID
      
                  });
      
              }
              
          }else if(route.params.Screenname == "AssetListing"){    
              navigation.navigate('CreateWorkOrder',{
      
                Selected_WorkOrder_no:route.params.Selected_WorkOrder_no,
                RowID:route.params.RowID,
      
      
                //no need back
                Selected_AssetNo:route.params.Selected_AssetNo,
      
                ASL_Assetno:route.params.ASL_Assetno,
                ASL_RowID:route.params.ASL_RowID,
                Screenname:route.params.Screenname, 
              
      
                ASF_Assetno:route.params.ASF_Assetno,
                ASF_AssetDescription:route.params.ASF_AssetDescription,
                ASF_Employee:route.params.ASF_Employee,
                ASF_Fromdate: route.params.ASF_Fromdate,
                ASF_Todate: route.params.ASF_Todate,
                ASF_CostCenter:route.params.ASF_CostCenter,
                ASF_AssetStatus:route.params.ASF_AssetStatus,
                ASF_AssetType:route.params.ASF_AssetType,
                ASF_AssetGroupCode:route.params.ASF_AssetGroupCode,
                ASF_AssetCode:route.params.ASF_AssetCode,
                ASF_WorkArea:route.params.ASF_WorkArea,
                ASF_AssetLocation:route.params.ASF_AssetLocation,
                ASF_AssetLevel:route.params.ASF_AssetLevel
              });
      
        } 

    }

  let Valid = false;

  const [isVisible, setVisible] = React.useState(false);
  const [spinner, setspinner] = React.useState(false);
  const [Toolbartext, setToolbartext] = React.useState('');
  const [Editable, setEditable] = React.useState(false);
  const [height, setHeight] = React.useState(0);

  const [FaultCode_height, setFaultCode_height] = React.useState(0);
  const [WRDesc_height, setWRDesc_height] = React.useState(0);

  const [RowID, setRowID] = React.useState('');

  const [Employee, setEmployee] = React.useState();
  const [OriginalPriority, setOriginalPriority] = React.useState();
  const [WorkType, setWorkType] = React.useState();
  const [WorkOrderStatus, setWorkOrderStatus] = React.useState();
  const [AssignTo, setAssignTo] = React.useState();
  const [FaultCode, setfaultCode] = React.useState();
  const [Account, setAccount] = React.useState();

  //Asset POP UP DropDown
  const [AssetType, setAssetType] = React.useState();
  const [AssetGroupCode, setAssetGroupCode] = React.useState();
  const [Assetcode, setAssetcode] = React.useState();
  const [WorkArea, setWorkArea] = React.useState();
  const [AssetLocation, setAssetLocation] = React.useState();
  const [AssetLevel, setAssetLevel] = React.useState();
  const [CostCenter, setCostCenter] = React.useState();

  const [Employee_key, setEmployee_key] = React.useState('');
  const [PhoneNo, setPhoneNo] = React.useState('');

  const [WorkOrderNo_AutoNo, setWorkOrderNo_AutoNo] = React.useState('');
  const [WorkOrderNo, setWorkOrderNo] = React.useState('');
  const [WorkOrderNo_editable, setWorkOrderNo_editable] = React.useState(false);
  const [WorkOrderNoValid, setWorkOrderNoValid] = React.useState(true);

  const [OrgPriority_key, setOrgPriority_key] = React.useState('');
  const [PlanPriority_key, setPlanPriority_key] = React.useState('');

  const [OrgCount, setOrgCount] = React.useState('');
  const [PlanCount, setPlanCount] = React.useState('');

  const [isDatepickerVisible, setDatePickerVisibility] = React.useState(false);
  const [isTimepickerVisible, setTimePickerVisibility] = React.useState(false);
  const [Type, setType] = React.useState('');
  const [OrgDate, setOrgDate] = React.useState('');
  const [DueDate, setDueDate] = React.useState('');

  const [OrgTime, setOrgTime] = React.useState('');
  const [DueTime, setDueTime] = React.useState('');

  const [WorkType_key, setWorkType_key] = React.useState('');
  const [FaultCode_key, setFaultCode_key] = React.useState('');
  const [WorkOrderDescription, setWorkOrderDescription] = React.useState('');
  const [WorkOrderStatus_key, setWorkOrderStatus_key] = React.useState('');
  const [AssigTo_key, setAssigTo_key] = React.useState('');
  const [PerAssigTo_key, setPerAssigTo_key] = React.useState('');
  const [AssigTo_Reason, setAssigTo_Reason] = React.useState('');
  const [Assigndata, setAssigndata] = React.useState([]);
  const [AssigToReason_Visible, setAssigToReason_Visible] = React.useState(false);
  const [AssigToReason_Valid, setAssigToReason_Valid] = React.useState(false);
  const [Assigtohistory_Visible, setAssigtohistory_Visible] = React.useState(false);

  const [LaborAccount_key, setLaborAccount_key] = React.useState('');
  const [ContractAccount_key, setContractAccount_key] = React.useState('');
  const [MaterialAccount_key, setMaterialAccount_key] = React.useState('');

  const [Asset_modalVisible, setAsset_modalVisible] = React.useState(false);
  const [AssetList_modalVisible, setAssetList_modalVisible] = React.useState(false);
  const [AssetList_data, setAssetList_data] = React.useState([]);
  const [AssetList_FilteredData, setAssetList_FilteredData] = React.useState([]);
  const [AssetList_search, setAssetList_search] = React.useState('');
  const [PMGroupAsset,setPMGroupAsset] = React.useState([]);

  const [PMGroup, setPMGroup] = React.useState('');
  const [PMGroupType, setPMGroupType] = React.useState('');
  const [PMGroup_Visible, setPMGroup_Visible] = React.useState(false);
  const [PMGroup_Editable, setPMGroup_Editable] = React.useState(false);

  const [AssetNo, setAssetNo] = React.useState('');
  const [AssetNo_Visible, setAssetNo_Visible] = React.useState(false);

  const [AssetDescription, setAssetDescription] = React.useState('');
  const [AssetGroupCode_key, setAssetGroupCode_key] = React.useState('');
  const [WorkArea_key, setWorkArea_key] = React.useState('');
  const [AssetLocation_key, setAssetLocation_key] = React.useState('');
  const [AssetLevel_key, setAssetLevel_key] = React.useState('');
  const [CostCenter_key, setCostCenter_key] = React.useState('');

  const [AssetCode_key, setAssetCode_key] = React.useState('');
  const [PermID_key, setPermID_key] = React.useState('');
  const [AssetCusCode_key, setAssetCusCode_key] = React.useState('');
  const [AssetStatus_key, setAssetStatus_key] = React.useState('');

  const [Box_AssetNo, setBox_AssetNo] = React.useState('');
  const [Box_AssetDescription, setBox_AssetDescription] = React.useState('');
  const [Box_FromDate, setBox_FromDate] = React.useState('');
  const [Box_ToDate, setBox_ToDate] = React.useState('');
  const [Box_AssetType, setBox_AssetType] = React.useState('');
  const [Box_AssetGroupCode, setBox_AssetGroupCode] = React.useState('');
  const [Box_AssetCode, setBox_AssetCode] = React.useState('');
  const [Box_WorkArea, setBox_WorkArea] = React.useState('');
  const [Box_AssetLocation, setBox_AssetLocation] = React.useState('');
  const [Box_AssetLevel, setBox_AssetLevel] = React.useState('');

  const [Box_AssetType_label, setBox_AssetType_label] = React.useState('');
  const [Box_AssetGroupCode_label, setBox_AssetGroupCode_label] = React.useState('');
  const [Box_AssetCode_label, setBox_AssetCode_label] = React.useState('');
  const [Box_WorkArea_label, setBox_WorkArea_label] = React.useState('');
  const [Box_AssetLocation_label, setBox_AssetLocation_label] = React.useState('');
  const [Box_AssetLevel_label, setBox_AssetLevel_label] = React.useState('');

  //DropDown Modal
  const [textvalue, settextvalue] = React.useState('');
  const [Boxtextvalue, setBoxtextvalue] = React.useState('');
  const [Dropdown_data, setDropdown_data] = React.useState([]);
  const [DropDownFilteredData, setDropDownFilteredData] = React.useState([]);
  const [DropDown_modalVisible, setDropDown_modalVisible] = React.useState(false);
  const [DropDown_search, setDropDown_search] = React.useState('');
  const [refreshing, setRefreshing] = React.useState(false);

  //AssignModal
  const [AssignHistory_modalVisible, setAssignHistory_modalVisible] = React.useState(false);
  const [AssignHistory_data, setAssignHistory_data] = React.useState([]);
  const [AssignHistory_FilteredData, setAssignHistory_FilteredData] = React.useState([]);

  //Attachement Modal
  const [Attachments_modalVisible, setAttachments_modalVisible] = React.useState(false);
  const [ZoomAttachments_modalVisible, setZoomAttachments_modalVisible] = React.useState(false);
  const [images, setImages] = React.useState([]);
  const [Attachments_List, setAttachments_List] = React.useState([]);

  const [images_list, setimages_list] = React.useState([]);


  const [Type_link, setType_link] = React.useState();
  const [link, setlink] = React.useState([]);
  const [images_link, setimages_link] = React.useState([]);
  const [linkindex, setlinkindex] = React.useState(0);

  const [SubmitButton, setSubmitButton] = React.useState('');
  const [SubmitButtonColor, setSubmitButtonColor] = React.useState('#0096FF');

  //More Options
  const [MoreList, setMoreList] = React.useState([]);
  const [isMoreVisible, setMoreVisible] = React.useState(false);
  const [isRender, setisRender] = React.useState(false);

  const [Response_Visible, setResponse_Visible] = React.useState(false);
  const [Chargeable_Visible, setChargeable_Visible] = React.useState(false);
  const [Acknowledgement_Visible, setAcknowledgement_Visible] = React.useState(false);
  const [WOCompletion_Visible, setWOCompletion_Visible] = React.useState(false);
  const [ContractServices_Visible, setContractServices_Visible] = React.useState(false);
  const [MaterialRequest_Visible, setMaterialRequest_Visible] = React.useState(false);
  const [CheckList_Visible, setCheckList_Visible] = React.useState(false);
  const [TimaeCard_Visible, setTimaeCard_Visible] = React.useState(false);
  const [AssetDowntime_Visible, setAssetDowntime_Visible] = React.useState(false);
  const [PurchasingInfo_Visible, setPurchasingInfo_Visible] = React.useState(false);
  const [SubWorkorder_Visible, setSubWorkorder_Visible] = React.useState(false);
  const [Comments_Visible, setComments_Visible] = React.useState(false);

  const [Response_color, setResponse_color] = React.useState('');
  const [Chargeable_color, setChargeable_color] = React.useState('');
  const [Acknowledgement_color, setAcknowledgement_color] = React.useState('');
  const [WOCompletion_color, setWOCompletion_color] = React.useState('');
  const [ContractServices_Count, setContractServices_Count] = React.useState('');
  const [MaterialRequest_Count, setMaterialRequest_Count] = React.useState('');
  const [CheckList_Count, setCheckList_Count] = React.useState('');
  const [TimaeCard_Count, setTimaeCard_Count] = React.useState('');
  const [AssetDowntime_Count, setAssetDowntime_Count] = React.useState('');
  const [PurchasingInfo_Count, setPurchasingInfo_Count] = React.useState('');
  const [SubWorkorder_Count, setSubWorkorder_Count] = React.useState('');

  //Alert
  const [Show, setShow] = React.useState(false);
  const [Show_two, setShow_two] = React.useState(false);
  const [Theme, setTheme] = React.useState('');
  const [Title, setTitle] = React.useState('');
  const [AlertType, setAlertType] = React.useState('');
  const [Alert_WOK, setAlert_WOK] = React.useState('');
  const [Alert_RowID, setAlert_RowID] = React.useState('');
  const [ImgValue, setImgValue] = React.useState([]);

 
    const backAction = () => {
        setAlert_two(true,'warning','Do you want to exit time card screen?','BACK')
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

        dvc_id = DeviceInfo.getDeviceId();

        Baseurl = await AsyncStorage.getItem('BaseURL');
        Site_cd = await AsyncStorage.getItem('Site_Cd');
        LoginID = await AsyncStorage.getItem('emp_mst_login_id');
        EmpName = await AsyncStorage.getItem('emp_mst_name');
        EmpID = await AsyncStorage.getItem('emp_mst_empl_id');
        EmpPhone = await AsyncStorage.getItem('emp_mst_homephone');
        EmpWorkGrp = await AsyncStorage.getItem('emp_det_work_grp');
        OrgPriority = await AsyncStorage.getItem('dft_mst_wko_pri');
        emp_ls1_charge_rate = await AsyncStorage.getItem('emp_ls1_charge_rate');
        emp_det_craft = await AsyncStorage.getItem('emp_det_craft');
        dft_mst_tim_act = await AsyncStorage.getItem('dft_mst_tim_act');
        WIFI = await AsyncStorage.getItem('WIFI');
    
        console.log('WORK OFF DATA:  ' + WIFI);
        console.log('dft_mst_tim_act:', dft_mst_tim_act)
        console.log('emp_det_craft:', emp_det_craft)
        console.log('emp_ls1_charge_rate:', emp_ls1_charge_rate)
        console.log('WorkOrder_no:', route.params.Selected_WorkOrder_no)
        console.log('mst_RowID:', route.params.RowID)
        console.log('ASSETNO:', route.params.Selected_AssetNo)
        console.log('CostCenter:', route.params.Selected_CostCenter)
        console.log('LaborAccount:', route.params.Selected_LaborAccount)
        console.log('ContractAccount:', route.params.Selected_ContractAccount)
        console.log('MaterialAccount:', route.params.Selected_MaterialAccount)
        console.log('PMGroupType:', route.params.Selected_PMGroupType)
        console.log('PMGroupType:', route.params.Selected_wko_mst_Type)

       
    
        mst_RowID =route.params.RowID;
        Local_ID =route.params.local_id;
    
        console.log("WORK mst_RowID:  "+ mst_RowID);
        console.log("WORK Local_ID:  "+ Local_ID);

        db.transaction(function (txn) {

            //employee
            txn.executeSql( 'SELECT * FROM employee', [], (tx, { rows }) => { setEmployee(rows.raw())});

            //priority
            txn.executeSql( 'SELECT * FROM priority', [], (tx, { rows }) => { setOriginalPriority(rows.raw()) });
            
            //worktype
            txn.executeSql( 'SELECT * FROM worktype', [], (tx, { rows }) => { setWorkType(rows.raw()) });
            
            //workorderstatus
            txn.executeSql( `SELECT * FROM workorderstatus where  wrk_sts_typ_cd NOT IN('COMPLETE','CLOSE','CANCEL','FORCE-CLOSE')`, [], (tx, { rows }) => { setWorkOrderStatus(rows.raw()) });
            
            //faultcode
            txn.executeSql( 'SELECT * FROM faultcode', [], (tx, { rows }) => { setfaultCode(rows.raw()) });
            
            //Account
            txn.executeSql( 'SELECT * FROM account', [], (tx, { rows }) => { setAccount(rows.raw()) });
            
            //costcenter
            txn.executeSql( 'SELECT * FROM costcenter', [], (tx, { rows }) => { setCostCenter(rows.raw()) });
            
            //assettype
            txn.executeSql( 'SELECT * FROM assettype', [], (tx, { rows }) => { setAssetType(rows.raw()) });
            
            //assetgroupcode
            txn.executeSql( 'SELECT * FROM assetgroupcode', [], (tx, { rows }) => { setAssetGroupCode(rows.raw()) });
            
            //assetcode
            txn.executeSql( 'SELECT * FROM assetcode', [], (tx, { rows }) => { setAssetcode(rows.raw()) });
            
            //workarea
            txn.executeSql( 'SELECT * FROM workarea', [], (tx, { rows }) => { setWorkArea(rows.raw()) });
            
            //assetlocation
            txn.executeSql( 'SELECT * FROM assetlocation', [], (tx, { rows }) => {  setAssetLocation(rows.raw()) });
            
            //assetlevel
            txn.executeSql( 'SELECT * FROM assetlevel', [], (tx, { rows }) => {  setAssetLevel(rows.raw()) });
            
            //wko_auto_numbering
            txn.executeSql('SELECT * FROM wko_auto_numbering', [], (tx, results) => {
                var criticalfactor_temp = [];
                let cnt_mst_numbering, cnt_mst_option, cnt_mst_module_cd;
            // console.log('wko_auto_numbering:' + JSON.stringify(results));
                for (let i = 0; i < results.rows.length; ++i) {
                //console.log('wko_auto_numbering:' + JSON.stringify(results.rows.item(i)));
                cnt_mst_numbering = results.rows.item(i).cnt_mst_numbering;
                cnt_mst_option = results.rows.item(i).cnt_mst_option;
                cnt_mst_module_cd = results.rows.item(i).cnt_mst_module_cd;
                }

                //console.log('WO AUTO NO: ' + cnt_mst_numbering);
                //console.log(cnt_mst_option)
                //console.log(cnt_mst_module_cd)
                setWorkOrderNo_AutoNo(cnt_mst_numbering);

                if (cnt_mst_numbering === 'M') {
                setWorkOrderNo_editable(true);
                setWorkOrderNoValid(true);
                } else {
                setWorkOrderNo_editable(false);
                setWorkOrderNoValid(false);
                }
            });

        })

        setspinner(true);

        setToolbartext('Create PM Sub Work Order');
        setSubmitButton('Save');
        setSubmitButtonColor('#8BC34A');
  
        setAssetNo_Visible(true);
        setPMGroup_Visible(false);
        setAssigtohistory_Visible(false);
  
        setEmployee_key(EmpID + ' : ' + EmpName);
        setPhoneNo(EmpPhone);
  
        var sync_date = moment().format('yyyy-MM-DD');
        var sync_time = format(new Date(), 'HH:mm');
  
        setOrgDate(sync_date);
        setOrgTime(sync_time);
        setDueDate(sync_date);
        setDueTime(sync_time);
  
        if (OrgPriority === '' || OrgPriority === null) {
          
        } else {
          const split_OrgPriority1 = OrgPriority.split('-');
          setOrgPriority_key(split_OrgPriority1[0]);
        }

        get_assign_emp();

    }

    const get_assign_emp = (async()=>{
        
        try {
            console.log( 'get_dropdown : ' + `${Baseurl}/get_dropdown.php?site_cd=${Site_cd}&type=${'Assign_Employee'}&EmpID=${EmpID}&LoginID=${LoginID}`);
            const Dropdown = await fetch( `${Baseurl}/get_dropdown.php?site_cd=${Site_cd}&type=${'Assign_Employee'}&EmpID=${EmpID}&LoginID=${LoginID}`);
  
            const responseJson = await Dropdown.json();
  
            if (responseJson.status === 'SUCCESS') {
              //console.log(responseJson.data.Assign_Employee);
  
              if (responseJson.data.Assign_Employee.length > 0) {

                setAssignTo(responseJson.data.Assign_Employee);

                if(route.params.Selected_wko_mst_Type === 'G'){
                  get_pm_assetno();
                }else{
                  get_assetmaster_select();
                }
               
              } else {
                setspinner(false);
                setAlert(true, 'warning', response.data.message, 'OK', '', '');
                return;
              }
            } else {
              setspinner(false);
              setAlert(true, 'danger', response.data.message, 'OK', '', '');
            }
        } catch (error) {
        setspinner(false);
        Alert.alert( 'Error', error.message, [ { text: 'OK' } ], { cancelable: false } );
        }

    })


    const get_pm_assetno = (async()=>{

        let PM_GROUPTYPE={

            site_cd:Site_cd,
            grp_ast_grp_cd:route.params.Selected_AssetNo,
            //prm_ast_wo_no:route.params.Selected_WorkOrder_no,
        }
          console.log("Get PM Group Type : "+JSON.stringify(PM_GROUPTYPE));

        try {
            const response = await axios.post(`${Baseurl}/get_pm_group_assetmaster.php?`,JSON.stringify(PM_GROUPTYPE),
            {headers:{ 'Content-Type': 'application/json'}});
            //console.log('PM GROUP  response:'+ JSON.stringify(response.data));
            if (response.data.status === 'SUCCESS'){
                setspinner(false)

               
                setAssetList_data(response.data.data);
                setAssetList_FilteredData(response.data.data);
               
        
            }else{
                setspinner(false)
                setAlert(true,'danger',response.data.message,'OK');
            }
        } catch (error) {
        setspinner(false);
        Alert.alert( 'Error', error.message, [ { text: 'OK' } ], { cancelable: false } );
        }


    })


    const get_assetmaster_select = (async()=>{

      let Asset_retrieve = {
        site_cd: Site_cd,
        ast_mst_asset_no: route.params.Selected_AssetNo,
        asset_shortdesc: '',
        cost_center: '',
        asset_status: '',
        from_date: '',
        to_date: '',
        asset_type: '',
        asset_grpcode: '',
        work_area: '',
        asset_locn: '',
        asset_code: '',
        ast_lvl: '',
        ast_sts_typ_cd: '',
        createby: '',
        type: '',
        emp_det_work_grp: '',
        emp_id: EmpID,
      };

      console.log('Asset Master Data: ' + JSON.stringify(Asset_retrieve));

      try {
        const response = await axios.post( `${Baseurl}/get_assetmaster.php?`, JSON.stringify(Asset_retrieve));
        //console.log("Asset Master Response : " + (response.data.status))

        if (response.data.status === 'SUCCESS') {
          if (response.data.data.length > 0) {
            //console.log(response.data.status)
            //console.log(response.data.message)
            //console.log(response.data.data)
            for (let i = 0; i < response.data.data.length; ++i) {
              setAssetNo(response.data.data[i].ast_mst_asset_no);
              setAssetDescription( response.data.data[i].ast_mst_asset_shortdesc);
              setAssetGroupCode_key( response.data.data[i].ast_mst_asset_group);
              setWorkArea_key(response.data.data[i].mst_war_work_area);
              setAssetLocation_key( response.data.data[i].ast_mst_asset_locn);
              setAssetLevel_key(response.data.data[i].ast_mst_asset_lvl);
              setCostCenter_key(response.data.data[i].ast_mst_cost_center);
              setAssetCode_key(response.data.data[i].ast_mst_asset_code);
              setPermID_key(response.data.data[i].ast_mst_perm_id);
              setAssetCusCode_key(response.data.data[i].ast_det_cus_code);
              setAssetStatus_key( response.data.data[i].ast_mst_asset_status);
            }
            setspinner(false);
          } else {
            setspinner(false);
            setAlert(true, 'warning', response.data.message, 'OK', '', '');
          }
        } else {
          setspinner(false);
          setAlert(true, 'danger', response.data.message, 'OK', '', '');
          return;
        }
      } catch (error) {
        setspinner(false);
        Alert.alert( 'Error', error.message, [ { text: 'OK' } ], { cancelable: false } );
      }


    })
    //BUTTON EDIT
  const get_button = () => {
    if (SubmitButton == 'Save') {
      get_validation();
    } else if (SubmitButton == 'Edit') {
      setSubmitButton('Update');
      setSubmitButtonColor('#8BC34A');
      setEditable(false);
    } else if (SubmitButton == 'Update') {
      get_validation();
    }
  };

  //VALIDATION
  const get_validation = () => {
    console.log('WKR Valid : ' + WorkOrderNoValid);
    if (WorkOrderNoValid) {
      //alert('Please Enter Work Order No');
      setAlert(true, 'warning', 'Please Enter Work Order No', 'OK', '', '');
      Valid = false;
      return;
    } else {
      Valid = true;
    }

    if (AssigToReason_Valid) {
      if (!AssigTo_Reason) {
        //alert('Please Key in the reassign to reason');
        setAlert( true, 'warning', 'Please Key in the reassign to reason', 'OK', '', '', );
        Valid = false;
        return;
      } else {
        Valid = true;
      }
    } else {
      Valid = true;
    }

    if (!AssetNo) {
      //alert('Please Select Asset No');
      setAlert(true, 'warning', 'Please Select Asset No', 'OK', '', '');
      Valid = false;
      return;
    } else {
      if (!AssetDescription) {
        //alert('Please Enter Asset Description');
        setAlert( true, 'warning', 'Please Enter Asset Description', 'OK', '', '', );
        Valid = false;
        return;
      } else {
        if (!OrgPriority_key) {
          //alert('Please Select Original Priority');
          setAlert( true, 'warning', 'Please Select Original Priority', 'OK', '', '', );
          Valid = false;
          return;
        } else {
          if (!PlanPriority_key) {
            setAlert( true, 'warning', 'Please Select Plan Priority', 'OK', '', '', );
            //alert('Please Select Plan Priority');
            Valid = false;
            return;
          } else {
            if (!OrgDate) {
              //alert('Please Select Origination Date');
              setAlert( true, 'warning', 'Please Select Origination Date', 'OK', '', '', );
              Valid = false;
              return;
            } else {
              if (!DueDate) {
                //alert('Please Select Due Date');
                setAlert( true, 'warning', 'Please Select Due Date', 'OK', '', '', );
                Valid = false;
                return;
              } else {
                if (!OrgTime) {
                  //alert('Please Select Origination Time');
                  setAlert( true, 'warning', 'Please Select Origination Time', 'OK', '', '', );
                  Valid = false;
                  return;
                } else {
                  if (!DueTime) {
                    //alert('Please Select Due Time');
                    setAlert( true, 'warning', 'Please Select Due Time', 'OK', '', '', );
                    Valid = false;
                    return;
                  } else {
                    if (!WorkType_key) {
                      // alert('Please Select Work Type');
                      setAlert( true, 'warning', 'Please Select Work Type', 'OK', '', '', );
                      Valid = false;
                      return;
                    } else {
                      if (!FaultCode_key) {
                        //alert('Please Select Fault Code');
                        setAlert( true, 'warning', 'Please Select Fault Code', 'OK', '', '', );
                        Valid = false;
                        return;
                      } else {
                        if (!WorkOrderStatus_key) {
                          //alert('Please Select Work Order Status');
                          setAlert( true, 'warning', 'Please Select Work Order Status', 'OK', '', '', );
                          Valid = false;
                          return;
                        } else {
                          Valid = true;

                          console.log(Valid);

                          if (Valid) {
                            if (SubmitButton == 'Save') {
                              if (WIFI == 'OFFLINE') {
                                Insert_Workorder_offline();
                                console.log('OFFLINE Save');
                              } else {
                                Create_WorkOrder();
                                console.log('ONLINE Save');
                              }
                            } else if (SubmitButton == 'Update') {
                              if (WIFI == 'OFFLINE') {
                                Update_work_order_offline();
                                console.log('OFFLINE UPDATE');
                              } else {
                                Update_WorkOrder();
                                console.log('ONLINE UPDATE');
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };

  //INSERT WORK ORDER API
  const Create_WorkOrder = async () => {
      setspinner(true);
  
      var sync_date = moment().format('YYYY-MM-DD HH:mm');
      let dvc_id = DeviceInfo.getDeviceId();
  
      let EmployeeName_split, AssetGroupCode, WorkArea, AssetLocation, AssetLevel, CostCenter, AssignTo_split, LaborAccount_split, ContractAccount_split, MaterialAccount_split, AssetCode_split, CusCode_split,parent_Wo_No;
  
      parent_Wo_No = route.params.Selected_WorkOrder_no;

      if (!Employee_key) {
        EmployeeName_split = '';
      } else {
        Employee_split = Employee_key.split(':');
        EmployeeName_split = Employee_split[0].trim();
      }
  
      if (!AssetGroupCode_key) {
        AssetGroupCode = '';
      } else {
        AssetGroupCode_split = AssetGroupCode_key.split(':');
        AssetGroupCode = AssetGroupCode_split[0].trim();
      }
  
      if (!WorkArea_key) {
        WorkArea = '';
      } else {
        WorkArea_split = WorkArea_key.split(':');
        WorkArea = WorkArea_split[0].trim();
      }
  
      if (!AssetLocation_key) {
        AssetLocation = '';
      } else {
        AssetLocation_split = AssetLocation_key.split(':');
        AssetLocation = AssetLocation_split[0].trim();
      }
  
      if (!AssetLevel_key) {
        AssetLevel = '';
      } else {
        AssetLevel_split = AssetLevel_key.split(':');
        AssetLevel = AssetLevel_split[0].trim();
      }
  
      if (!CostCenter_key) {
        CostCenter = '';
      } else {
        CostCenter_split = CostCenter_key.split(':');
        CostCenter = CostCenter_split[0].trim();
      }
  
      let OrgPriority_split = OrgPriority_key.split(':');
      let PlanPriority_split = PlanPriority_key.split(':');
      let org_date = OrgDate + ' ' + OrgTime;
      let due_date = DueDate + ' ' + DueTime;
  
      console.log(org_date);
      console.log(due_date);
  
      let WorkType_split = WorkType_key.split(':');
      let FaultCode_split = FaultCode_key.split(':');
      let WorkOrderStatus_split = WorkOrderStatus_key.split(':');
  
      if (!AssigTo_key) {
        AssignTo_split = '';
      } else {
        AssignTo_key_split = AssigTo_key.split(':');
        AssignTo_split = AssignTo_key_split[0].trim();
      }
  
      if (!LaborAccount_key) {
        LaborAccount_split = '';
      } else {
        LaborAccount_key_split = LaborAccount_key.split(':');
        LaborAccount_split = LaborAccount_key_split[0].trim();
      }
  
      if (!ContractAccount_key) {
        ContractAccount_split = '';
      } else {
        ContractAccount_key_split = ContractAccount_key.split(':');
        ContractAccount_split = ContractAccount_key_split[0].trim();
      }
  
      if (!MaterialAccount_key) {
        MaterialAccount_split = '';
      } else {
        MaterialAccount_key_split = MaterialAccount_key.split(':');
        MaterialAccount_split = MaterialAccount_key_split[0].trim();
      }
  
      if (!AssetCode_key) {
        AssetCode_split = '';
      } else {
        AssetCode_key_split = AssetCode_key.split(':');
        AssetCode_split = AssetCode_key_split[0].trim();
      }
  
      if (!AssetStatus_key) {
        AssetStatus_split = '';
      } else {
        AssetStatus_key_split = AssetStatus_key.split(':');
        AssetStatus_split = AssetStatus_key_split[0].trim();
      }
  
      console.log('LoginID', LoginID);
      console.log('EmpName', EmpName);
      console.log('EmpID', EmpID);
      console.log('EmpPhone', EmpPhone);
  
      let Create_WorkOrder = {
        site_cd: Site_cd,
        EmpID: EmpID,
        EmpName: EmpName,
  
        wko_mst_originator: EmployeeName_split,
        wko_mst_phone: PhoneNo,
  
        ast_mst_asset_no: AssetNo,
        ast_mst_asset_shortdesc: AssetDescription,
        ast_mst_asset_group: AssetGroupCode,
        mst_war_work_area: WorkArea,
        ast_mst_asset_locn: AssetLocation,
        ast_mst_asset_lvl: AssetLevel,
        wko_mst_chg_costcenter: CostCenter,
  
        wko_mst_wo_no: WorkOrderNo,
        wko_mst_orig_priority: OrgPriority_split[0].trim(),
        wko_mst_plan_priority: PlanPriority_split[0].trim(),
        wko_mst_org_date: org_date,
        wko_mst_due_date: due_date,
        wko_det_work_type: WorkType_split[0].trim(),
        wko_mst_flt_code: FaultCode_split[0].trim(),
        wko_mst_descs: WorkOrderDescription,
        wko_mst_status: WorkOrderStatus_split[0].trim(),
        wko_det_assign_to: AssignTo_split,
        wko_det_laccount: LaborAccount_split,
        wko_det_caccount: ContractAccount_split,
        wko_det_maccount: MaterialAccount_split,
  
        ast_mst_asset_code: AssetCode_split,
        ast_mst_perm_id: PermID_key,
        ast_det_cus_code: AssetCusCode_key,
        ast_mst_asset_status: AssetStatus_split,
        cnt_mst_numbering: WorkOrderNo_AutoNo,
  
        dvc_id: dvc_id,
        LOGINID: LoginID,
        wko_det_parent_wo:parent_Wo_No,
  
        sync_step: '',
        sync_time: sync_date,
        sync_status: 'online',
        sync_url: Baseurl + '/insert_pm_sub_workorder.php?',
      };
  
      console.log('Create_New_Asset : ' + JSON.stringify(Create_WorkOrder));
  
      try {
        const response = await axios.post( `${Baseurl}/insert_pm_sub_workorder.php?`, JSON.stringify(Create_WorkOrder), 
        {headers: {'Content-Type': 'application/json'}}
        );
        console.log('Insert asset response:' + JSON.stringify(response.data));
        if (response.data.status === 'SUCCESS') {
          console.log('Insert asset Image lenght:' + Attachments_List);
          if (Attachments_List.length > 0) {
            Insert_image( response.data.WorkOrderno, response.data.ROW_ID, response.data.message);
          } else {
            setspinner(false);
            setAlert( true, 'success', response.data.message, 'Online_Insert_WKO', response.data.WorkOrderno, response.data.ROW_ID, );
          }
        } else {
          setspinner(false);
          setAlert(true, 'warning', response.data.message, 'OK', '', '');
        }
      } catch (error) {
        setspinner(false);
        Alert.alert( 'Error', error.message, [ { text: 'OK' } ], { cancelable: false } );
      }
    };
  
  //INSERT WORK ORDER ATTACHMENT FILE API
  const Insert_image = async (Wo_No, ROW_ID, message) => {
    console.log('LENGTH: ' + Attachments_List.length);
    console.log('ROW_ID: ' + ROW_ID);

    const SPLIT_URL = Baseurl.split('/');
    const SPLIT_URL1 = SPLIT_URL[SPLIT_URL.length - 2];
    const SPLIT_URL2 = SPLIT_URL[SPLIT_URL.length - 1];
    const SPLIT_URL3 = SPLIT_URL1+'/'+SPLIT_URL2
    console.log('URL' + SPLIT_URL3);

    let data = {
      data: {
        rowid: ROW_ID,
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
      const type = Attachments_List[i].type.split('/');
      console.log('type', type[0]);
      var t;
      if (type[0] === 'video') {
        t = '.mp4';
      } else {
        t = Attachments_List[i].name;
      }

      k++;
      formData.append('file_' + [k], {
        uri: Attachments_List[i].path,
        name: t,
        type: Attachments_List[i].type,
      });
      //formData.append('photo', {uri: Attachments_List[i].path,name: Attachments_List[i].name});
      // formData.append('Content-Type', 'image/png');
    }
    console.log(JSON.stringify(formData));

    try {

      fetch(`${Baseurl}/insert_workorder_image_file.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData, // Your FormData object
      })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response data here
        console.log('success', data.status);
        if (data.status === 'SUCCESS') {
          setspinner(false);
          setAlert(true, 'success', message, 'Online_Insert_WKO', Wo_No, ROW_ID, );

        }else{

          setspinner(false);
          setAlert(true, 'warning', data.message , 'OK', '', '');
        }
        
      })
      .catch((error) => {
        setspinner(false);
        Alert.alert(
          'Error',
          error.message,
          [
            { text: 'OK' }
          ],
          { cancelable: false }
        );
        console.error('Error:', error);
      });

      // const xhr = new XMLHttpRequest();
      // xhr.open('POST', `${Baseurl}/insert_workorder_image_file.php?`);
      // xhr.setRequestHeader('Content-Type', 'multipart/form-data');
      // xhr.send(formData);
      // console.log('success', xhr.responseText);
      // xhr.onreadystatechange = e => {
      //   if (xhr.readyState !== 4) {
      //     return;
      //   }

      //   if (xhr.status === 200) {
      //     console.log('success', xhr.responseText);
      //     var json_obj = JSON.parse(xhr.responseText);
      //     console.log('success', json_obj.data);
      //     if (json_obj.data.wko_ref.length > 0) {
      //       setspinner(false);
      //       // Alert.alert(json_obj.status,message+" "+json_obj.message,
      //       //     [

      //       //         { text: "OK",onPress: () => get_SameScreen(Wo_No,ROW_ID)}

      //       //     ]);

      //       //setAlert_two(true,'delete','Do you want to delete this image?','DeleteNewImage',value)

      //       setAlert( true, 'success', message, 'Online_Insert_WKO', Wo_No, ROW_ID, );
      //     } else {
      //       setspinner(false);
      //       // Alert.alert(json_obj.status,message+" "+json_obj.message,
      //       //     [

      //       //         { text: "OK", onPress: () => get_SameScreen(Wo_No,ROW_ID)}

      //       //     ]);

      //       //setAlert_two(true,'delete','Do you want to delete this image?','DeleteImage',value)
      //       setAlert( true, 'success', message, 'Online_Insert_WKO', Wo_No, ROW_ID, );
      //     }
      //   } else {
      //     setspinner(false);
      //     //alert(xhr.responseText);
      //     setAlert(true, 'warning', xhr.responseText, 'OK', '', '');
      //     //console.log('error', xhr.responseText);
      //   }
      // };
    } catch (error) {
      setspinner(false);
      Alert.alert(
          'Error',
          error.message,
          [
            { text: 'OK' }
          ],
          { cancelable: false }
        );
    }
  };




  //ASSET SEARCH BOX
  const open_search_asset_box = () => {


    if(route.params.Selected_wko_mst_Type === 'G'){
      setAssetList_modalVisible(!AssetList_modalVisible);
    }else{
      setBox_AssetNo('');
      setBox_AssetDescription('');
      setBox_FromDate('');
      setBox_ToDate('');
      setBox_AssetType('');
      setBox_AssetGroupCode('');
      setBox_AssetCode('');
      setBox_WorkArea('');
      setBox_AssetLocation('');
      setBox_AssetLevel('');

      setAssetList_search('');

      setAsset_modalVisible(!Asset_modalVisible);
    }

   
    
  };


  //Get Asset Master Count API
  const get_assetmaster_count = async () => {
    let Asset_retrieve;
    setspinner(true);

    if (
      !Box_AssetNo &&
      !Box_AssetDescription &&
      !Box_FromDate &&
      !Box_ToDate &&
      !Box_AssetType &&
      !Box_AssetGroupCode &&
      !Box_AssetCode &&
      !Box_WorkArea &&
      !Box_AssetLocation &&
      !Box_AssetLevel
    ) {
      setspinner(false);
      // alert('Please select at least one criteria to search');
      setAlert(
        true,
        'warning',
        'Please select at least one criteria to search',
        'OK',
        '',
        '',
      );
    } else {
      Asset_retrieve = {
        site_cd: Site_cd,
        ast_mst_asset_no: Box_AssetNo,
        asset_shortdesc: Box_AssetDescription,
        cost_center: '',
        asset_status: '',
        from_date: Box_FromDate,
        to_date: Box_ToDate,
        asset_type: Box_AssetType_label,
        asset_grpcode: Box_AssetGroupCode_label,
        work_area: Box_WorkArea_label,
        asset_locn: Box_AssetLocation_label,
        asset_code: Box_AssetCode_label,
        ast_lvl: Box_AssetLevel_label,
        ast_sts_typ_cd: 'Active',
        createby: '',
        emp_det_work_grp: EmpWorkGrp,
        emp_id: EmpID,
      };

      console.log('Asset Master Count: ' + JSON.stringify(Asset_retrieve));
      try {
        const response = await axios.post(
          `${Baseurl}/get_assetmaster_count.php?`,
          JSON.stringify(Asset_retrieve),
        );
        //console.log("Asset Master Count Response : " + response.data.status)
        if (response.data.status === 'SUCCESS') {
          console.log('Asset Master Count Response : ' + response.data.status);
          console.log('Asset Master Count Response : ' + response.data.message);
          console.log('Asset Master Count Response : ' + response.data.data);

          if (response.data.data >= 1000) {
            setspinner(false);
            // Alert.alert(

            //     response.data.status,
            //     `The Current Filter return: ${response.data.data} record, it will take some time to download.Do you still want to continue?`,
            //     [
            //         {text:"Yes",
            //         onPress:()=>{get_assetmaster()}
            //         },
            //         {text:"No"}
            //     ]
            // )

            setAlert_two(
              true,
              'warning',
              `The Current Filter return: ${response.data.data} record, it will take some time to download.Do you still want to continue?`,
              'Asset_Count',
              '',
              '',
            );
          } else {
            get_assetmaster();
          }
        } else {
          setspinner(false);
          //alert(response.data.message);
          setAlert(true, 'danger', response.data.message, 'OK', '', '');
        }
      } catch (error) {
        setspinner(false);
        Alert.alert(
          'Error',
          error.message,
          [
            { text: 'OK' }
          ],
          { cancelable: false }
        );
      }
    }
  };

  //GET ASSET MASTER LIST API
  const get_assetmaster = async () => {
    let Asset_retrieve = {
      site_cd: Site_cd,
      ast_mst_asset_no: Box_AssetNo,
      asset_shortdesc: Box_AssetDescription,
      cost_center: '',
      asset_status: '',
      from_date: Box_FromDate,
      to_date: Box_ToDate,
      asset_type: Box_AssetType_label,
      asset_grpcode: Box_AssetGroupCode_label,
      work_area: Box_WorkArea_label,
      asset_locn: Box_AssetLocation_label,
      asset_code: Box_AssetCode_label,
      ast_lvl: Box_AssetLevel_label,
      ast_sts_typ_cd: 'Active',
      createby: '',
      type: '',
      emp_det_work_grp: EmpWorkGrp,
      emp_id: EmpID,
    };

    console.log('Asset Master Data: ' + JSON.stringify(Asset_retrieve));

    try {
      const response = await axios.post( `${Baseurl}/get_assetmaster.php?`, JSON.stringify(Asset_retrieve), );
      console.log('Asset Master Response : ' + response.data.status);

      if (response.data.status === 'SUCCESS') {
        if (response.data.data.length > 0) {
          //console.log(response.data.status)
          //console.log(response.data.message)
          //console.log(response.data.data)
          setAssetList_modalVisible(!AssetList_modalVisible);
          setAssetList_data(response.data.data);
          setAssetList_FilteredData(response.data.data);
          setspinner(false);
        } else {
          setspinner(false);
          //alert(response.data.message);
          setAlert(true, 'warning', response.data.message, 'OK', '', '');
        }
      } else {
        setspinner(false);
        //alert(response.data.message);
        setAlert(true, 'danger', response.data.message, 'OK', '', '');
        return;
      }
    } catch (error) {
      setspinner(false);
      Alert.alert(
          'Error',
          error.message,
          [
            { text: 'OK' }
          ],
          { cancelable: false }
        );
    }
  };


  //ASSET LIST FILTER
  const AssetList_FilterFunction = text => {
    if (text) {
      const newData = AssetList_data.filter(function (item) {
        const itemData = `${item.ast_mst_asset_no.toUpperCase()}
            ,${item.ast_mst_cost_center.toUpperCase()}
            ,${item.mst_war_work_area.toUpperCase()}
            ,${item.ast_mst_asset_locn.toUpperCase()}
            ,${item.ast_mst_asset_lvl.toUpperCase()}
            ,${item.ast_mst_asset_shortdesc.toUpperCase()}
            ,${item.ast_mst_asset_longdesc.toUpperCase()})`;

        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });

      setAssetList_FilteredData(newData);
      setAssetList_search(text);
    } else {
      setAssetList_FilteredData(AssetList_data);
      setAssetList_search(text);
    }
  };

  //ASSET LIST
  const AssetList_ItemView = ({item}) => {
    return (
      <TouchableOpacity onPress={() => AssetList_getItem(item)}>
        <View style={styles.item}>
          <View
            style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row'}}>
            <Text style={{ color: '#2962FF', fontSize: 13, backgroundColor: '#D6EAF8', padding: 5, fontWeight: 'bold', }}>{item.ast_mst_asset_no} </Text>
            <Text style={{fontSize: 13, color: '#000'}}> {item.ast_mst_asset_status} </Text>
          </View>

          <View style={{flexDirection: 'row', marginTop: 10}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start'}}>Description : </Text>
            </View>
            <View style={{flex: 1.5}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.ast_mst_asset_shortdesc} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start'}}>Cost Center : </Text>
            </View>
            <View style={{flex: 1.5}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.ast_mst_cost_center} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start'}}>Work Area : </Text>
            </View>
            <View style={{flex: 1.5}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.mst_war_work_area} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start'}}>Asset Location : </Text>
            </View>

            <View style={{flex: 1.5}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.ast_mst_asset_locn}
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Level : </Text>
            </View>
            <View style={{flex: 1.5}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.ast_mst_asset_lvl}
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Short Description : </Text>
            </View>
            <View style={{flex: 1.5}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.ast_mst_asset_shortdesc}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const AssetList_ItemSeparatorView = () => {
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

  //SELECT ASSET ITEM IN LIST
  const AssetList_getItem = item => {
    // Function for click on an item
    //alert('Id : ' + item.ast_mst_asset_no );

    if (WIFI == 'OFFLINE') {
      setAssetList_modalVisible(!AssetList_modalVisible);
    } else {
      setAssetList_modalVisible(!AssetList_modalVisible);
      setAsset_modalVisible(!Asset_modalVisible);
    }

    setAssetNo(item.ast_mst_asset_no);
    setAssetDescription(item.ast_mst_asset_shortdesc);
    setAssetGroupCode_key(item.ast_mst_asset_grpcode);
    setWorkArea_key(item.mst_war_work_area);
    setAssetLocation_key(item.ast_mst_asset_locn);
    setAssetLevel_key(item.ast_mst_asset_lvl);
    setCostCenter_key(item.ast_mst_cost_center);

    setAssetCode_key(item.ast_mst_asset_code);
    setPermID_key(item.ast_mst_perm_id);
    setAssetCusCode_key(item.ast_det_cus_code);
    setAssetStatus_key(item.ast_mst_asset_status);
  };

  //Selection Dropdown
  const select_dropdown = (dropname, data) => {
    //  console.log(data)
    if (dropname === 'Box Asset Type') {
      settextvalue('Asset Type');
      setBoxtextvalue(dropname);
    } else if (dropname === 'Box Asset Group Code') {
      settextvalue('Asset Group Code');
      setBoxtextvalue(dropname);
    } else if (dropname === 'Box Asset Code') {
      settextvalue('Asset Code');
      setBoxtextvalue(dropname);
    } else if (dropname === 'Box Work Area') {
      settextvalue('Work Area');
      setBoxtextvalue(dropname);
    } else if (dropname === 'Box Asset Location') {
      settextvalue('Asset Location');
      setBoxtextvalue(dropname);
    } else if (dropname === 'Box Asset Level') {
      settextvalue('Asset Level');
      setBoxtextvalue(dropname);
    } else {
      setBoxtextvalue('');
      settextvalue(dropname);
    }

    setDropDownFilteredData(data);
    setDropdown_data(data);
    setDropDown_modalVisible(!DropDown_modalVisible);
  };

  //Dropdown Filter
  const DropDown_searchFilterFunction = text => {
    // Check if searched text is not blank

    console.log('r', textvalue);
    if (text) {
      let newData;

      if (textvalue == 'Employee') {
        newData = Dropdown_data.filter(function (item) {
          const itemData = `${item.emp_mst_empl_id.toUpperCase()},
            ,${item.emp_mst_title.toUpperCase()}
            ,${item.emp_mst_name.toUpperCase()})`;

          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      } else if ( textvalue == 'Original Priority' || textvalue == 'Plan Priority' ) {
        newData = Dropdown_data.filter(function (item) {
          const itemData = `${item.wrk_pri_pri_cd.toUpperCase()},
            ,${item.wrk_pri_desc.toUpperCase()})`;

          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      } else if (textvalue == 'Fault Code') {
        newData = Dropdown_data.filter(function (item) {
          const itemData = `${item.wrk_flt_fault_cd.toUpperCase()},
            ,${item.wrk_flt_desc.toUpperCase()})`;

          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      } else if (textvalue == 'Cost Center') {
        newData = Dropdown_data.filter(function (item) {
          const itemData = `${item.costcenter.toUpperCase()},
            ,${item.descs.toUpperCase()})`;

          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      } else if ( textvalue == 'Asset Type' || Boxtextvalue == 'Box Asset Type' ) {
        newData = Dropdown_data.filter(function (item) {
          const itemData = `${item.ast_type_cd.toUpperCase()},
            ,${item.ast_type_descs.toUpperCase()})`;

          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      } else if ( textvalue == 'Asset Group Code' || Boxtextvalue == 'Box Asset Group Code' ) {
        newData = Dropdown_data.filter(function (item) {
          const itemData = `${item.ast_grp_grp_cd.toUpperCase()},
            ,${item.ast_grp_desc.toUpperCase()})`;

          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      } else if ( textvalue == 'Asset Code' || Boxtextvalue == 'Box Asset Code' ) {
        newData = Dropdown_data.filter(function (item) {
          const itemData = `${item.ast_cod_ast_cd.toUpperCase()},
            ,${item.ast_cod_desc.toUpperCase()})`;

          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      } else if (textvalue == 'Work Area' || Boxtextvalue == 'Box Work Area') {
        newData = Dropdown_data.filter(function (item) {
          const itemData = `${item.mst_war_work_area.toUpperCase()},
            ,${item.mst_war_desc.toUpperCase()})`;

          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      } else if (
        textvalue == 'Asset Location' ||
        Boxtextvalue == 'Box Asset Location'
      ) {
        newData = Dropdown_data.filter(function (item) {
          const itemData = `${item.ast_loc_ast_loc.toUpperCase()},
            ,${item.ast_loc_desc.toUpperCase()})`;

          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      } else if (
        textvalue == 'Asset Level' ||
        Boxtextvalue == 'Box Asset Level'
      ) {
        newData = Dropdown_data.filter(function (item) {
          const itemData = `${item.ast_lvl_ast_lvl.toUpperCase()},
            ,${item.ast_lvl_desc.toUpperCase()})`;

          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      } else if (textvalue == 'Work Type') {
        newData = Dropdown_data.filter(function (item) {
          const itemData = `${item.wrk_typ_typ_cd.toUpperCase()},
            ,${item.wrk_typ_desc.toUpperCase()})`;

          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      } else if (textvalue == 'Work Order Status') {
        newData = Dropdown_data.filter(function (item) {
          const itemData = `${item.wrk_sts_status.toUpperCase()},
            ,${item.wrk_sts_desc.toUpperCase()})`;

          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      } else if (textvalue == 'Assign To') {
        newData = Dropdown_data.filter(function (item) {
          const itemData = `${item.emp_mst_empl_id.toUpperCase()},
            ,${item.emp_mst_title.toUpperCase()}
            ,${item.emp_mst_name.toUpperCase()})`;

          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      } else if (textvalue == 'Labor Account' || textvalue == 'Contract Account' || textvalue == 'Material Account') {
        newData = Dropdown_data.filter(function (item) {
          const itemData = `${item.account.toUpperCase()},
            ,${item.descs.toUpperCase()})`;

          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      }

      setDropDownFilteredData(newData);
      setDropDown_search(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setDropDownFilteredData(Dropdown_data);
      setDropDown_search(text);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);

    console.log('ONLINE0040', textvalue);

    if (textvalue == 'Employee') {
      setDropDownFilteredData(Employee);
    } else if (
      textvalue == 'Original Priority' ||
      textvalue == 'Plan Priority'
    ) {
      setDropDownFilteredData(OriginalPriority);
    } else if (textvalue == 'Work Type') {
      setDropDownFilteredData(WorkType);
    } else if (textvalue == 'Work Order Status') {
      setDropDownFilteredData(WorkOrderStatus);
    } else if (textvalue == 'Fault Code') {
      setDropDownFilteredData(FaultCode);
    } else if (textvalue == 'Asset Type' || Boxtextvalue == 'Box Asset Type') {
      setDropDownFilteredData(AssetType);
    } else if (
      textvalue == 'Asset Group Code' ||
      Boxtextvalue == 'Box Asset Group Code'
    ) {
      setDropDownFilteredData(AssetGroupCode);
    } else if (textvalue == 'Asset Code' || Boxtextvalue == 'Box Asset Code') {
      setDropDownFilteredData(Assetcode);
    } else if (textvalue == 'Work Area' || Boxtextvalue == 'Box Work Area') {
      setDropDownFilteredData(WorkArea);
    } else if (
      textvalue == 'Asset Location' ||
      Boxtextvalue == 'Box Asset Location'
    ) {
      setDropDownFilteredData(AssetLocation);
    } else if (
      textvalue == 'Asset Level' ||
      Boxtextvalue == 'Box Asset Level'
    ) {
      setDropDownFilteredData(AssetLevel);
    } else if (textvalue == 'Cost Center') {
      setDropDownFilteredData(CostCenter);
    } else if (textvalue == 'Assign To') {
      //console.log('ONLINE000',WIFI)

      if (WIFI === 'OFFLINE') {
        console.log('OFFLINE');

        setDropDownFilteredData(AssignTo);
      } else {
        console.log('ONLINE');
        get_dropdown_Assign_Employee();
      }

      //setDropDownFilteredData(AssignTo);
    } else if (
      textvalue == 'Labor Account' ||
      textvalue == 'Contract Account' ||
      textvalue == 'Material Account'
    ) {
      setDropDownFilteredData(Account);
    }

    setRefreshing(false);
  }, [refreshing]);

  const renderText = item => {
    // console.log(textvalue)

    if (textvalue == 'Employee') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                ID :
              </Text>
            </View>
            <View style={{flex: 4}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.emp_mst_empl_id}
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                Name :
              </Text>
            </View>
            <View style={{flex: 4}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.emp_mst_name}
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                Title :
              </Text>
            </View>
            <View style={{flex: 4}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.emp_mst_title}
              </Text>
            </View>
          </View>
        </View>
      );
    } else if ( textvalue == 'Original Priority' || textvalue == 'Plan Priority' ) {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                Priority Code :
              </Text>
            </View>
            <View style={{flex: 1.5}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.wrk_pri_pri_cd}
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                Description :
              </Text>
            </View>
            <View style={{flex: 1.5}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.wrk_pri_desc}
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                Due Date Count(mins) :
              </Text>
            </View>
            <View style={{flex: 1.5}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.wrk_pri_due_date_count}
              </Text>
            </View>
          </View>
        </View>
      );
    } else if (textvalue == 'Work Type') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                Type Code :
              </Text>
            </View>
            <View style={{flex: 2}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.wrk_typ_typ_cd}
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                Description :
              </Text>
            </View>
            <View style={{flex: 2}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.wrk_typ_desc}
              </Text>
            </View>
          </View>
        </View>
      );
    } else if (textvalue == 'Work Order Status') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                {' '}
                Status Type Code :{' '}
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {' '}
                {item.wrk_sts_typ_cd}{' '}
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                {' '}
                Status :{' '}
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {' '}
                {item.wrk_sts_status}{' '}
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                {' '}
                Description :{' '}
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {' '}
                {item.wrk_sts_desc}{' '}
              </Text>
            </View>
          </View>
        </View>
      );
    } else if (textvalue == 'Fault Code') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                Fault Code :
              </Text>
            </View>
            <View style={{flex: 2}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {' '}
                {item.wrk_flt_fault_cd}{' '}
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                Description :
              </Text>
            </View>
            <View style={{flex: 2}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {' '}
                {item.wrk_flt_desc.trim()}{' '}
              </Text>
            </View>
          </View>
        </View>
      );
    } else if (textvalue == 'Cost Center') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                Cost Center :
              </Text>
            </View>
            <View style={{flex: 2}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.costcenter}
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                Description :
              </Text>
            </View>
            <View style={{flex: 2}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.descs}
              </Text>
            </View>
          </View>
        </View>
      );
    } else if (textvalue == 'Asset Type' || Boxtextvalue == 'Box Asset Type') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                Type Code :
              </Text>
            </View>
            <View style={{flex: 2}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.ast_type_cd}
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                Description :
              </Text>
            </View>
            <View style={{flex: 2}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.ast_type_descs}
              </Text>
            </View>
          </View>
        </View>
      );
    } else if ( textvalue == 'Asset Group Code' || Boxtextvalue == 'Box Asset Group Code' ) {
      let option;
      if (item.ast_grp_option == 1) {
        option = 'Yes';
      } else {
        option = 'No';
      }
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                Asset Group Code :
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.ast_grp_grp_cd}
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                Asset Group Desc :
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.ast_grp_desc}
              </Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                Auto Number:
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {option}
              </Text>
            </View>
          </View>
        </View>
      );
    } else if (textvalue == 'Asset Code' || Boxtextvalue == 'Box Asset Code') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                Asset Code :
              </Text>
            </View>
            <View style={{flex: 2}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.ast_cod_ast_cd}
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                Description :
              </Text>
            </View>
            <View style={{flex: 2}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.ast_cod_desc}
              </Text>
            </View>
          </View>
        </View>
      );
    } else if (textvalue == 'Work Area' || Boxtextvalue == 'Box Work Area') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                Work Area :
              </Text>
            </View>
            <View style={{flex: 2}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.mst_war_work_area}
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                Description :
              </Text>
            </View>
            <View style={{flex: 2}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.mst_war_desc}
              </Text>
            </View>
          </View>
        </View>
      );
    } else if ( textvalue == 'Asset Location' || Boxtextvalue == 'Box Asset Location' ) {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                Asset Location :
              </Text>
            </View>
            <View style={{flex: 1.5}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.ast_loc_ast_loc}
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                Description :
              </Text>
            </View>
            <View style={{flex: 1.5}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.ast_loc_desc}
              </Text>
            </View>
          </View>
        </View>
      );
    } else if ( textvalue == 'Asset Level' || Boxtextvalue == 'Box Asset Level' ) {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                Asset Level :
              </Text>
            </View>
            <View style={{flex: 2}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.ast_lvl_ast_lvl}
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                Description :
              </Text>
            </View>
            <View style={{flex: 2}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.ast_lvl_desc}
              </Text>
            </View>
          </View>
        </View>
      );
    } else if (textvalue == 'Assign To') {
      var colorCD, colorECD, count;
      if (item.WOASSIGN === 0 || item.WOASSIGN === '0') {
        colorCD = '#ABB2B9';
      } else {
        colorCD = '#2ECC71';
      }

      if (item.emp_mst_att_sts === '') {
        colorECD = '#ABB2B9';
      } else if (item.emp_mst_att_sts === 'ONS') {
        colorECD = '#28B463';
      } else if (item.emp_mst_att_sts === 'ONC') {
        colorECD = '#F1C40F';
      } else if (item.emp_mst_att_sts === 'OFS') {
        colorECD = '#E74C3C';
      } else if (item.emp_mst_att_sts === 'ONL') {
        colorECD = '#95A5A6';
      }

      count = Number(item.WOASSIGN);
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{alignContent: 'center', marginTop: 8}}>
              <UserAvatar
                userName={item.emp_mst_name}
                size={50}
                backgroundColor='#F5DEB3'
               
                activeCircleColor={colorECD}
                textColor="#000"
                active
                fontSize={15}
              />
            </View>

            <View style={{flexDirection: 'row', flex: 1}}>
              <View
                style={{
                  flexDirection: 'column',
                  flex: 5,
                  justifyContent: 'center',
                  marginLeft: 20,
                }}>
                <Text
                  placeholder="Test"
                  style={{justifyContent: 'flex-start', color: '#000'}}>
                  {' '}
                  {item.emp_mst_empl_id}{' '}
                </Text>
                <Text
                  placeholder="Test"
                  style={{justifyContent: 'flex-start', color: '#000'}}>
                  {' '}
                  {item.emp_mst_name}{' '}
                </Text>
                <Text
                  placeholder="Test"
                  style={{justifyContent: 'flex-start', color: '#000'}}>
                  {' '}
                  {item.emp_mst_title}{' '}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'column',
                  flex: 1,
                  justifyContent: 'center',
                  marginLeft: 20,
                }}>
                <View
                  style={{
                    padding: 5,
                    alignItems: 'center',
                    alignContent: 'center',
                  }}>
                  <Text
                    placeholder="Test"
                    style={{
                      color: '#000',
                      fontSize: 13,
                      fontWeight: 'bold',
                      justifyContent: 'center',
                    }}>
                    {' '}
                    WO{' '}
                  </Text>
                </View>

                <View
                  style={{
                    backgroundColor: colorCD,
                    padding: 5,
                    borderRadius: 10,
                    alignItems: 'center',
                    alignContent: 'center',
                  }}>
                  <Text
                    placeholder="Test"
                    style={{
                      color: '#fff',
                      fontSize: 13,
                      fontWeight: 'bold',
                      justifyContent: 'center',
                    }}>
                    {' '}
                    {count}{' '}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      );
    } else if ( textvalue == 'Labor Account' || textvalue == 'Contract Account' || textvalue == 'Material Account' ) {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                Account :
              </Text>
            </View>
            <View style={{flex: 2}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.account}
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                Description :
              </Text>
            </View>
            <View style={{flex: 2}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.descs}
              </Text>
            </View>
          </View>
        </View>
      );
    }
  };

  const Dropdown_ItemView = ({item}) => {
    return (
      <TouchableOpacity onPress={() => getItem(item)}>
        {renderText(item)}
      </TouchableOpacity>
    );
  };

  const Dropdown_ItemSeparatorView = () => {
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

  const getItem = item => {
    // Function for click on an item
    //alert('Id : ' + JSON.stringify(item) );

    console.log(item);

    if (textvalue == 'Employee') {
      setEmployee_key(item.emp_mst_empl_id + ' : ' + item.emp_mst_name);
    } else if (textvalue == 'Original Priority') {
      setOrgPriority_key(item.wrk_pri_pri_cd + ' : ' + item.wrk_pri_desc);

      // var count = item.wrk_pri_due_date_count;
      // setOrgCount(count);

      // let days = count/1440;
      // let hours = (count % 1440)/60;
      // let mins = count % 60;

      // var date=new Date(OrgDate)
      // date.setDate(date.getDate() + days)

      // let plandate = moment(date).format('yyyy-MM-DD');
      // setDueDate(plandate)
    } else if (textvalue == 'Plan Priority') {
      setPlanPriority_key(item.wrk_pri_pri_cd + ' : ' + item.wrk_pri_desc);

      var count = item.wrk_pri_due_date_count;
      setPlanCount(count);

      let days = count / 1440;
      let hours = (count % 1440) / 60;
      let mins = count % 60;

      var date = new Date(OrgDate);
      date.setDate(date.getDate() + days);

      let plandate = moment(date).format('yyyy-MM-DD');
      setDueDate(plandate);
    } else if (textvalue == 'Work Type') {
      setWorkType_key(item.wrk_typ_typ_cd + ' : ' + item.wrk_typ_desc);
    } else if (textvalue == 'Fault Code') {
      setFaultCode_key(item.wrk_flt_fault_cd + ' : ' + item.wrk_flt_desc);
      setWorkOrderDescription(item.wrk_flt_desc);
    } else if (textvalue == 'Cost Center') {
      setCostCenter_key(item.costcenter + ' : ' + item.descs);
    } else if (textvalue == 'Asset Group Code') {
      if (Boxtextvalue == 'Box Asset Group Code') {
        setBox_AssetGroupCode(item.ast_grp_grp_cd + ' : ' + item.ast_grp_desc);
        setBox_AssetGroupCode_label(item.ast_grp_grp_cd);
      } else {
        setAssetGroupCode_key(item.ast_grp_grp_cd + ' : ' + item.ast_grp_desc);
      }
    } else if (textvalue == 'Asset Code') {
      if (Boxtextvalue == 'Box Asset Code') {
        setBox_AssetCode(item.ast_cod_ast_cd + ' : ' + item.ast_cod_desc);
        setBox_AssetCode_label(item.ast_cod_ast_cd);
      }
    } else if (textvalue == 'Work Area') {
      if (Boxtextvalue == 'Box Work Area') {
        setBox_WorkArea(item.mst_war_work_area + ' : ' + item.mst_war_desc);
        setBox_WorkArea_label(item.mst_war_work_area);
      } else {
        setWorkArea_key(item.mst_war_work_area + ' : ' + item.mst_war_desc);
      }
    } else if (textvalue == 'Asset Location') {
      if (Boxtextvalue == 'Box Asset Location') {
        setBox_AssetLocation(item.ast_loc_ast_loc + ' : ' + item.ast_loc_desc);
        setBox_AssetLocation_label(item.ast_loc_ast_loc);
      } else {
        setAssetLocation_key(item.ast_loc_ast_loc + ' : ' + item.ast_loc_desc);
      }
    } else if (textvalue == 'Asset Level') {
      if (Boxtextvalue == 'Box Asset Level') {
        setBox_AssetLevel(item.ast_lvl_ast_lvl + ' : ' + item.ast_lvl_desc);
        setBox_AssetLevel_label(item.ast_lvl_ast_lvl);
      } else {
        setAssetLevel_key(item.ast_lvl_ast_lvl + ' : ' + item.ast_lvl_desc);
      }
    } else if (textvalue == 'Asset Type' || Boxtextvalue == 'Box Asset Type') {
      setBox_AssetType(item.ast_type_cd + ' : ' + item.ast_type_descs);
      setBox_AssetType_label(item.ast_type_cd);
    } else if (textvalue == 'Work Order Status') {
      setWorkOrderStatus_key(item.wrk_sts_status + ' : ' + item.wrk_sts_desc);
    } else if (textvalue == 'Assign To') {
      console.log('PER 1', PerAssigTo_key);
      console.log('PER 1w', item.emp_mst_empl_id);
      setAssigTo_key(item.emp_mst_empl_id + ' : ' + item.emp_mst_name);

    //   if ( route.params.Screenname == 'CreateWorkOrder' || route.params.Screenname == 'ScanAssetMaster' ) {
    //     setAssigTo_key(item.emp_mst_empl_id + ' : ' + item.emp_mst_name);
    //   } else {
    //     if (!PerAssigTo_key) {
    //       console.log('PER', PerAssigTo_key);

    //       setAssigTo_key(item.emp_mst_empl_id + ' : ' + item.emp_mst_name);
    //       setAssigToReason_Visible(true);
    //       setAssigToReason_Valid(true);
    //     } else {
    //       console.log('PER else', PerAssigTo_key);

    //       if (item.emp_mst_empl_id == PerAssigTo_key.split(':')[0]) {
    //         setAssigTo_key(item.emp_mst_empl_id + ' : ' + item.emp_mst_name);
    //         setAssigToReason_Visible(false);
    //         setAssigToReason_Valid(false);
    //       } else {
    //         setAssigTo_key(item.emp_mst_empl_id + ' : ' + item.emp_mst_name);
    //         setAssigToReason_Visible(true);
    //         setAssigToReason_Valid(true);
    //       }
    //     }
    //   }
    } else if (textvalue == 'Labor Account') {
      setLaborAccount_key(item.account + ' : ' + item.descs);
    } else if (textvalue == 'Contract Account') {
      setContractAccount_key(item.account + ' : ' + item.descs);
    } else if (textvalue == 'Material Account') {
      setMaterialAccount_key(item.account + ' : ' + item.descs);
    }

    setDropDown_search('');
    setDropDown_modalVisible(!DropDown_modalVisible);
  };

  //Attachement File
  const onDelete = value => {
    

    if (value.imagetype == 'New') {
     
      setAlert_two( true, 'delete', 'Do you want to delete this image?', 'DeleteNewImage', value);
    } else {
      
      setAlert_two( true, 'delete', 'Do you want to delete this image?', 'DeleteImage', value);
    }
  };

  //Delete Attachement File
  const DeleteNewImage = value => {
    const data = Attachments_List.filter(
      item => item?.localIdentifier && item?.localIdentifier !== value?.localIdentifier, );
    setAttachments_List(data);
  };

  const DeleteImage = async value => {

    if (WIFI == 'OFFLINE') {

      console.log('Delete Image File : ',value);

     if(value.rowid  === null){

      db.transaction(function (txn) {

        txn.executeSql( 'DELETE FROM wko_ref where ID=?',
          [value.ID],
          (tx, results) => {

            if (results.rowsAffected > 0) {
              const data = Attachments_List.filter(
                item =>
                  item?.localIdentifier &&
                  item?.localIdentifier !== value?.localIdentifier,
              );
              setAttachments_List(data);

            }else{

            }

          }
        )

      })

     }else{

      db.transaction(function (txn) {

        txn.executeSql( 'DELETE FROM wko_ref where RowID=?',
          [value.rowid],
          (tx, results) => {

            if (results.rowsAffected > 0) {
              const data = Attachments_List.filter(
                item =>
                  item?.localIdentifier &&
                  item?.localIdentifier !== value?.localIdentifier,
              );
              setAttachments_List(data);

            }else{
             
            }

        })
      })


     }

      
    } else {
      console.log('VALUE IMG', value.rowid);
      setspinner(true);

      try {
        console.log( 'Delete Image API : ' + `${Baseurl}/delete_workorder_attachment_file.php?site_cd=${Site_cd}&RowID=${value.rowid}`, );
        const response = await axios.get( `${Baseurl}/delete_workorder_attachment_file.php?site_cd=${Site_cd}&RowID=${value.rowid}`, );

        console.log('JSON DATA : ' + response.data.status);

        if (response.data.status === 'SUCCESS') {
         
          setAlert(true, 'success', response.data.message, 'Delete_IMG');

          setspinner(false);
        } else {
          setspinner(false);
          //alert(response.data.message);
          setAlert(true, 'danger', response.data.message, 'OK');
          return;
        }
      } catch (error) {
        setspinner(false);
        Alert.alert(
          'Error',
          error.message,
          [
            { text: 'OK' }
          ],
          { cancelable: false }
        );
      }
    }
  };

  const Attachments_ItemView = ({item}) => {

   //console.log('ITEM PATH:' + JSON.stringify(item));
    const type = item.type.split('/');
   //console.log('loop type', type[0]);
    

    return (
      //   <TouchableOpacity >
      //     <View style={{flex: 1,backgroundColor: '#fff',borderRadius: 10,margin:10}}>
      //         <Image style={{width: 150,height: 150,margin:10}}
      //             source={ {uri: item.path}}/>

      //     </View>
      //   </TouchableOpacity>

      <View style={{flex: 1,backgroundColor: '#fff', borderRadius: 10, margin: 10, alignItems: 'center'}}>
        <TouchableOpacity onPress={() => Attachment_show(item)}>

        {
          type[0] === 'image' && <Image width={IMAGE_WIDTH} source={{uri: item.path}} resizeMode="contain" style={{width: 160, height: 160, margin: 10}} /> ||
          type[0] === 'video' && <Image width={IMAGE_WIDTH} source={require('../../images/playervideo.png')} style={{width: 160, height: 160, margin: 10}} /> ||
          type[0] === 'application' && <Image width={IMAGE_WIDTH} source={require('../../images/pdf.png')} style={{width: 160, height: 160, margin: 10}} />
        }
          
        </TouchableOpacity>

        {!Editable && (
          <TouchableOpacity
            onPress={() => onDelete(item)}
            activeOpacity={0.5}
            style={styles.buttonDelete}>
            <Ionicons name="close-circle-outline" color="red" size={35} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const Attachments_onItem = item => {
    //console.log(item);

    return (
      // Flat List Item Separator
      <View
        style={{
          height: 1,
          marginLeft: 5,
          marginRight: 5,
          backgroundColor: '#C8C8C8',
        }}
      />
    );
  };

  const Attachment_show = item => {
    //console.log('show:', 'file://'+RNFS.DocumentDirectoryPath+'storage/emulated/0/Download/AC/image_757997BA-9A70-4A83-9BF5-02FCF29AD0F5.jpg');

   // console.log('Att_show:',  JSON.stringify(item));

    const type = item.type.split('/');
    //console.log('type',type[0]);
    if(type[0] === 'image'){

      setType_link('image')
      console.log('show list', JSON.stringify(link));

      for (let i = 0; i < images_link.length; i++) {
        
        if(item.name === images_link[i].name){

          setlinkindex(images_link[i].key -1)

          console.log('show KEY:', images_link[i].key);

          console.log('show KEY after:', images_link[i].key -1 );

        }
     
      }

    }else if(type[0] === 'video'){

      setType_link('video')
      setlink(item.path);

    }else if(type[0] === 'application'){

      setType_link('application')
      setlink(item.path);
    }
    
    setZoomAttachments_modalVisible(!ZoomAttachments_modalVisible);
  };

  const Attachment = () => {
    setVisible(!isVisible);
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'App Camera Permission',
            message: 'App needs access to your camera ',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //   console.log("Camera permission given");

        //   setVisible(!isVisible)
        // } else {
        //   console.log("Camera permission denied");
        // }
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };

  const requestExternalReadPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'External Storage Read Permission',
            message: 'App needs read permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };

  //Select Dates
  const showDatePicker = type => {
    // console.warn(type)

    setDatePickerVisibility(true);
    setType(type);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    if (Type === 'from') {
      if (!OrgPriority_key) {
        alert('Please Select Original Priority');
      } else {
        let select_OrgDate = moment(date).format('yyyy-MM-DD');
        setOrgDate(select_OrgDate);

        var count = OrgCount;

        let days = count / 1440;
        let hours = (count % 1440) / 60;
        let mins = count % 60;

        var date = new Date(select_OrgDate);
        date.setDate(date.getDate() + days);

        let plandate = moment(date).format('yyyy-MM-DD');
        setDueDate(plandate);
      }
    } else if (Type === 'to') {
      if (!OrgPriority_key) {
        alert('Please Select Original Priority');
      } else {
        let select_dueDate = moment(date).format('yyyy-MM-DD');
        setDueDate(select_dueDate);
      }
    } else if (Type === 'Box-from') {
      let select_box_fromDate = moment(date).format('yyyy-MM-DD');
      setBox_FromDate(select_box_fromDate);
      if (!Box_ToDate) {
        setBox_ToDate(select_box_fromDate);
      }
    } else if (Type === 'Box-to') {
      let select_box_fromDate = moment(date).format('yyyy-MM-DD');
      setBox_ToDate(select_box_fromDate);
    }

    hideDatePicker();
  };

  //Select Time
  const showTimePicker = type => {
    //console.warn(title)

    setTimePickerVisibility(true);
    setType(type);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const Time_handleConfirm = date => {
    if (Type === 'from') {
      if (!OrgPriority_key) {
        alert('Please Select Original Priority');
      } else {
        let select_OrgTime = moment(date).format('HH:mm');
        setOrgTime(select_OrgTime);
      }
    } else if (Type === 'to') {
      if (!OrgPriority_key) {
        alert('Please Select Original Priority');
      } else {
        let select_dueTime = moment(date).format('HH:mm');
        setDueTime(select_dueTime);
      }
    }

    hideTimePicker();
  };


  const setAlert = (show, theme, title, type, WKONO, RoWID) => {
    setShow(show);
    setTheme(theme);
    setTitle(title);
    setAlertType(type);
    setAlert_WOK(WKONO);
    setAlert_RowID(RoWID);
  };

  const setAlert_two = (show, theme, title, type, value) => {
    setShow_two(show);
    setTheme(theme);
    setTitle(title);
    setAlertType(type);
    setImgValue(value);
  };

  const One_Alret_onClick = D => {
    //console.log('DD',D)

    if (D === 'OK') {
      setShow(false);
    } else if (D === 'Online_Insert_WKO') {
      setShow(false);

      if (route.params.Screenname == 'CreateWorkOrder') {
        navigation.navigate('MainTabScreen');
      }else{
       _goBack()
      }
     
    } else if (D === 'Offline_Insert_WKO') {
      setShow(false);
      get_SameScreen('', '');
    } else if (D === 'Online_Update_WKO') {
      setShow(false);
      if (route.params.Screenname == 'CreateWorkOrder') {
        navigation.navigate('MainTabScreen');
      }else{
        get_SameScreen(Alert_WOK, Alert_RowID);
      }
    } else if (D === 'Offline_Update_WKO') {
      setShow(false);
      get_SameScreen('', '');
    } else if (D === 'Asset_Count') {
      setShow(false);

      get_assetmaster();
    } else if (D === 'Delete_IMG') {
      setShow(false);

      const data = Attachments_List.filter(
        item =>
          item?.localIdentifier &&
          item?.localIdentifier !== ImgValue?.localIdentifier,
      );
      setAttachments_List(data);
    }
  };

  const Alret_onClick = D => {
    console.log('DD', D);

    if (D === 'DeleteNewImage') {
      setShow_two(false);

      DeleteNewImage(ImgValue);
    } else if (D === 'DeleteImage') {
      setShow_two(false);

      DeleteImage(ImgValue);
    } else if (D === 'Asset_Count') {
      setShow_two(false);

      get_assetmaster();
    } else if (D === 'BACK') {
      setShow_two(false);

      _goBack();
    }
  };

  //video
  const captureImage = async type => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      videoQuality: 'high',
      durationLimit: 30, //Video max duration in seconds
      saveToPhotos: true,
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    if(DeviceInfo.getSystemVersion() === '13'){

      launchCamera(options, response => {
        console.log('Response = ', response);

        if (response.didCancel) {
          //alert('User cancelled camera picker');
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          alert('Camera not available on device');
          return;
        } else if (response.errorCode == 'permission') {
          alert('Permission not satisfied');
          return;
        } else if (response.errorCode == 'others') {
          alert(response.errorMessage);
          return;
        }

        for (let value of Object.values(response.assets)) {
          console.log('Valeu', value.uri);
          compress(value.uri,value.fileName,value.type,value.fileSize)
          // let key = Attachments_List.length + 1;
          // let localIdentifier = key;
          // let path = value.uri;
          // let name = value.fileName;
          // let rowid = '';
          // let type = value.type;
          // let imagetype = 'New';
          // Attachments_List.unshift({
          //   key,
          //   path,
          //   name,
          //   type,
          //   imagetype,
          //   localIdentifier,
          //   rowid,
          // });
          // setAttachments_List(Attachments_List.slice(0));
          // key++;
        }
      });

    }else{

      if (isCameraPermitted && isStoragePermitted) {
        launchCamera(options, response => {
          console.log('Response = ', response);
  
          if (response.didCancel) {
            //alert('User cancelled camera picker');
            return;
          } else if (response.errorCode == 'camera_unavailable') {
            alert('Camera not available on device');
            return;
          } else if (response.errorCode == 'permission') {
            alert('Permission not satisfied');
            return;
          } else if (response.errorCode == 'others') {
            alert(response.errorMessage);
            return;
          }
  
          for (let value of Object.values(response.assets)) {
            console.log('Valeu', value.uri);
            compress(value.uri,value.fileName,value.type,value.fileSize)
            // let key = Attachments_List.length + 1;
            // let localIdentifier = key;
            // let path = value.uri;
            // let name = value.fileName;
            // let rowid = '';
            // let type = value.type;
            // let imagetype = 'New';
            // Attachments_List.unshift({
            //   key,
            //   path,
            //   name,
            //   type,
            //   imagetype,
            //   localIdentifier,
            //   rowid,
            // });
            // setAttachments_List(Attachments_List.slice(0));
            // key++;
          }
        });
      }

    }
    
  };

//PDF
const selectFile = async () => {
// Opening Document Picker to select one file

let isReadPermitted = await requestExternalReadPermission();

if(DeviceInfo.getSystemVersion() === '13'){

    try {
    const res = await DocumentPicker.pick({
        // Provide which type of file you want user to pick
        type: [DocumentPicker.types.pdf],
        copyTo:'documentDirectory'
        // There can me more options as well
        // DocumentPicker.types.allFiles
        // DocumentPicker.types.images
        // DocumentPicker.types.plainText
        // DocumentPicker.types.audio
        // DocumentPicker.types.pdf
    });
    // Printing the log realted to the file
    console.log('res : ' + JSON.stringify(res));
    // Setting the state to show single file attributes
    //setSingleFile(res);


    for (let value of Object.values(res)) {
        console.log('Valeu', value.uri);
        let key = Attachments_List.length + 1;
        let localIdentifier = key;
        let path = value.fileCopyUri;
        let name = value.name;
        let rowid = '';
        let type = value.type;
        let imagetype = 'New';
        Attachments_List.unshift({
        key,
        path,
        name,
        type,
        imagetype,
        localIdentifier,
        rowid,
        });
        setAttachments_List(Attachments_List.slice(0));
        key++;
    }

    } catch (err) {
    //setSingleFile(null);
    // Handling any exception (If any)
    if (DocumentPicker.isCancel(err)) {
        // If user canceled the document selection
        //alert('Canceled');
    } else {
        // For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
    }
    }

}else{

    if(isReadPermitted){

    try {
        const res = await DocumentPicker.pick({
        // Provide which type of file you want user to pick
        type: [DocumentPicker.types.pdf],
        copyTo:'documentDirectory'
        // There can me more options as well
        // DocumentPicker.types.allFiles
        // DocumentPicker.types.images
        // DocumentPicker.types.plainText
        // DocumentPicker.types.audio
        // DocumentPicker.types.pdf
        });
        // Printing the log realted to the file
        console.log('res : ' + JSON.stringify(res));
        // Setting the state to show single file attributes
        //setSingleFile(res);
    
    
        for (let value of Object.values(res)) {
        console.log('Valeu', value.uri);
        let key = Attachments_List.length + 1;
        let localIdentifier = key;
        let path = value.fileCopyUri;
        let name = value.name;
        let rowid = '';
        let type = value.type;
        let imagetype = 'New';
        Attachments_List.unshift({
            key,
            path,
            name,
            type,
            imagetype,
            localIdentifier,
            rowid,
        });
        setAttachments_List(Attachments_List.slice(0));
        key++;
        }
    
    } catch (err) {
        //setSingleFile(null);
        // Handling any exception (If any)
        if (DocumentPicker.isCancel(err)) {
        // If user canceled the document selection
        //alert('Canceled');
        } else {
        // For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
        }
    }

    }

}


};

const compress =async (uri,fileName,IMGtype,IMGSIZE) =>{

const sp_type = IMGtype.split('/');
console.log('type',sp_type[0]);

if(sp_type[0] === 'image'){

    const result = await CPImage.compress(uri);

    let key = Attachments_List.length + 1
    let localIdentifier = key
    let path = result
    let name = fileName
    let rowid = ''
    let type = IMGtype
    let imagetype = 'New'
    let filesize = IMGSIZE
    Attachments_List.unshift({ key, path, name, type, imagetype, localIdentifier, rowid,filesize});
    setAttachments_List(Attachments_List.slice(0));
    images_list.unshift({ key, path, name, imagetype, type, localIdentifier, rowid});
    setimages_list(images_list.slice(0));
    key++;
    setimages_link([]);
    for (let i = 0; i < images_list.length; i++) {

      let key = i + 1
      setimages_link(images_link=>[...images_link,{ key:key,url:images_list[i].path,name:images_list[i].name}]);

    }

}else if(sp_type[0] === 'video'){

    const result = await CPVideo.compress(
    uri,
    {compressionMethod: 'auto'},
    (progress) => {
        console.log('Compression Progress: ', progress);

        setspinner(true);
        
    }
    );
    
    let key = Attachments_List.length + 1
    let localIdentifier = key
    let path = result
    let name = fileName
    let rowid = ''
    let type = IMGtype
    let imagetype = 'New'
    let filesize = IMGSIZE
    Attachments_List.unshift({ key, path, name, type, imagetype, localIdentifier, rowid,filesize});
    setAttachments_List(Attachments_List.slice(0));
    key++;
    setspinner(false);
}




}

  return (
    <DismissKeyboard>
      <SafeAreaProvider>
        <Appbar.Header style={{backgroundColor: '#42A5F5'}}>
          <View
            style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between'}}>
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

        <SCLAlert theme={Theme} show={Show} title={Title}>
          <SCLAlertButton theme={Theme} onPress={() => One_Alret_onClick(AlertType)}> OK </SCLAlertButton>
        </SCLAlert>

        <SCLAlert theme={Theme} show={Show_two} title={Title}>
          <SCLAlertButton theme={Theme} onPress={() => Alret_onClick(AlertType)}> Yes </SCLAlertButton>

          <SCLAlertButton theme="default" onPress={() => setShow_two(false)}> No </SCLAlertButton>
        </SCLAlert>

        <DateTimePicker
          isVisible={isDatepickerVisible}
          mode="date"
          locale="en_GB"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />

        <DateTimePicker
          isVisible={isTimepickerVisible}
          mode="time"
          locale="en_GB"
          onConfirm={Time_handleConfirm}
          onCancel={hideTimePicker}
        />


         {/* Asset Modal */}
         <Modal
          animationType="slide"
          transparent={true}
          visible={Asset_modalVisible}
          onRequestClose={() => {
           //Alert.alert('Closed');
            setAsset_modalVisible(!Asset_modalVisible);
          }}>
          <ProgressLoader
            visible={spinner}
            isModal={true}
            isHUD={true}
            hudColor={'#808080'}
            color={'#FFFFFF'}
          />

          <DateTimePicker
            isVisible={isDatepickerVisible}
            mode="date"
            locale="en_GB"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />

        <SCLAlert theme={Theme} show={Show} title={Title}>
          <SCLAlertButton theme={Theme} onPress={() => One_Alret_onClick(AlertType)}> OK </SCLAlertButton>
        </SCLAlert>

        <SCLAlert theme={Theme} show={Show_two} title={Title}>
          <SCLAlertButton theme={Theme} onPress={() => Alret_onClick(AlertType)}> Yes </SCLAlertButton>

          <SCLAlertButton theme="default" onPress={() => setShow_two(false)}> No </SCLAlertButton>
        </SCLAlert>

          <Modal
            animationType="slide"
            transparent={true}
            visible={DropDown_modalVisible}
            onRequestClose={() => {
             //Alert.alert('Closed');
              setDropDown_modalVisible(!DropDown_modalVisible);
            }}>
            <View style={styles.model2_cardview}>
              <View style={{flex: 1, margin: 20, backgroundColor: '#FFFFFF'}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: 50,
                  }}>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 15,
                      justifyContent: 'center',
                      textAlign: 'center',
                      color: '#000',
                      fontWeight: 'bold',
                    }}>
                    {' '}
                    {textvalue}{' '}
                  </Text>
                  <Ionicons
                    name="close"
                    color="red"
                    size={30}
                    style={{marginEnd: 15}}
                    onPress={() =>
                      setDropDown_modalVisible(!DropDown_modalVisible)
                    }
                  />
                </View>

                <SearchBar
                  lightTheme
                  round
                  inputStyle={{color: '#000'}}
                  inputContainerStyle={{backgroundColor: '#FFFF'}}
                  searchIcon={{size: 24}}
                  onChangeText={text => DropDown_searchFilterFunction(text)}
                  onClear={text => DropDown_searchFilterFunction('')}
                  placeholder="Search here..."
                  value={DropDown_search}
                />

                <FlatList
                  data={DropDownFilteredData}
                  keyExtractor={(item, index) => index.toString()}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  ItemSeparatorComponent={Dropdown_ItemSeparatorView}
                  renderItem={Dropdown_ItemView}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                />
              </View>
            </View>
          </Modal>

          <Modal
            animationType="slide"
            transparent={true}
            visible={AssetList_modalVisible}
            onRequestClose={() => {
             //Alert.alert('Closed');
              setAssetList_modalVisible(!AssetList_modalVisible);
            }}>
            <View style={styles.model2_cardview}>
              <View style={{margin: 20, backgroundColor: '#FFFFFF'}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#0096FF',
                    height: 50,
                  }}>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 15,
                      justifyContent: 'center',
                      color: '#fff',
                      margin: 5,
                      textAlign: 'center',
                      fontWeight: 'bold',
                    }}>
                    Asset Listing
                  </Text>
                  <Ionicons
                    name="close"
                    color="#ffffffff"
                    size={25}
                    style={{marginEnd: 15}}
                    onPress={() =>
                      setAssetList_modalVisible(!AssetList_modalVisible)
                    }
                  />
                </View>

                <SearchBar
                  lightTheme
                  round
                  inputStyle={{color: '#000'}}
                  inputContainerStyle={{backgroundColor: '#FFFF'}}
                  searchIcon={{size: 24}}
                  onChangeText={text => AssetList_FilterFunction(text)}
                  onClear={text => AssetList_FilterFunction('')}
                  placeholder="Search here..."
                  value={AssetList_search}
                />

                <FlatList
                  data={AssetList_FilteredData}
                  keyExtractor={(item, index) => index.toString()}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  ItemSeparatorComponent={AssetList_ItemSeparatorView}
                  renderItem={AssetList_ItemView}
                />
              </View>
            </View>
          </Modal>

          <View style={styles.model_cardview}>
            <View style={{margin: 20, backgroundColor: '#FFFFFF'}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#0096FF',
                  height: 50,
                }}>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 15,
                    justifyContent: 'center',
                    color: '#fff',
                    margin: 5,
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}>
                  Asset Search
                </Text>
                <Ionicons
                  name="close"
                  color="#ffffffff"
                  size={25}
                  style={{marginEnd: 15}}
                  onPress={() => setAsset_modalVisible(!Asset_modalVisible)}
                />
              </View>

              <ScrollView>
                <View>
                  {/* Asset No */}
                  <View style={styles.view_style}>
                    <TextInput
                      value={Box_AssetNo}
                      style={[
                        styles.input,
                        {
                          height: Math.max(
                            Platform.OS === 'ios' ? 50 : 50,
                            height,
                          ),
                        },
                      ]}
                      inputStyle={[
                        styles.inputStyle,
                        {color: Editable ? '#808080' : '#000'},
                      ]}
                      labelStyle={styles.labelStyle}
                      placeholderStyle={{
                        fontSize: 15,
                        color: '#0096FF',
                      }}
                      onContentSizeChange={event =>
                        setHeight(event.nativeEvent.contentSize.height)
                      }
                      textErrorStyle={styles.textErrorStyle}
                      label="Asset No"
                      focusColor="#808080"
                      onChangeText={text => setBox_AssetNo(text)}
                    />
                  </View>

                  {/* Asset Description */}
                  <View style={styles.view_style}>
                    <TextInput
                      value={Box_AssetDescription}
                      style={[
                        styles.input,
                        {
                          height: Math.max(
                            Platform.OS === 'ios' ? 50 : 50,
                            height,
                          ),
                        },
                      ]}
                      inputStyle={[
                        styles.inputStyle,
                        {color: Editable ? '#808080' : '#000'},
                      ]}
                      labelStyle={styles.labelStyle}
                      placeholderStyle={{
                        fontSize: 15,
                        color: '#0096FF',
                      }}
                      onContentSizeChange={event =>
                        setHeight(event.nativeEvent.contentSize.height)
                      }
                      textErrorStyle={styles.textErrorStyle}
                      label="Description"
                      focusColor="#808080"
                      onChangeText={text => {
                        setBox_AssetDescription(text);
                      }}
                    />
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    }}>
                    {/* From Date */}
                    <View style={styles.view_style}>
                      <Pressable
                        onPress={() => showDatePicker('Box-from')}
                        onLongPress={() => setBox_FromDate('')}>
                        <View pointerEvents={'none'}>
                          <TextInput
                            value={Box_FromDate}
                            style={[
                              styles.input,
                              {
                                height: Math.max(
                                  Platform.OS === 'ios' ? 50 : 50,
                                  height,
                                ),
                              },
                            ]}
                            inputStyle={[
                              styles.inputStyle,
                              {color: Editable ? '#808080' : '#000'},
                            ]}
                            labelStyle={styles.labelStyle}
                            placeholderStyle={{
                              fontSize: 15,
                              color: '#0096FF',
                            }}
                            onContentSizeChange={event =>
                              setHeight(event.nativeEvent.contentSize.height)
                            }
                            textErrorStyle={styles.textErrorStyle}
                            label="From Date"
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

                    {/* To Date */}
                    <View style={styles.view_style}>
                      <Pressable
                        onPress={() => showDatePicker('Box-to')}
                        onLongPress={() => setBox_ToDate('')}>
                        <View pointerEvents={'none'}>
                          <TextInput
                            value={Box_ToDate}
                            style={[
                              styles.input,
                              {
                                height: Math.max(
                                  Platform.OS === 'ios' ? 50 : 50,
                                  height,
                                ),
                              },
                            ]}
                            inputStyle={[
                              styles.inputStyle,
                              {color: Editable ? '#808080' : '#000'},
                            ]}
                            labelStyle={styles.labelStyle}
                            placeholderStyle={{
                              fontSize: 15,
                              color: '#0096FF',
                            }}
                            onContentSizeChange={event =>
                              setHeight(event.nativeEvent.contentSize.height)
                            }
                            textErrorStyle={styles.textErrorStyle}
                            label="To Date"
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

                  {/* Asset Type*/}
                  <View style={styles.view_style}>
                    <Pressable
                      onPress={() => select_dropdown('Box Asset Type', AssetType) } 
                      onLongPress={() => {setBox_AssetType(''),setBox_AssetType_label('')}}>
                      <View pointerEvents={'none'}>
                        <TextInput
                          value={Box_AssetType}
                          style={[
                            styles.input,
                            {
                              height: Math.max(
                                Platform.OS === 'ios' ? 50 : 50,
                                height,
                              ),
                            },
                          ]}
                          inputStyle={[
                            styles.inputStyle,
                            {color: Editable ? '#808080' : '#000'},
                          ]}
                          labelStyle={styles.labelStyle}
                          placeholderStyle={{
                            fontSize: 15,
                            color: '#0096FF',
                          }}
                          onContentSizeChange={event =>
                            setHeight(event.nativeEvent.contentSize.height)
                          }
                          textErrorStyle={styles.textErrorStyle}
                          label="Asset Type"
                          focusColor="#808080"
                          editable={false}
                          selectTextOnFocus={false}
                          renderRightIcon={() => (
                            <AntDesign
                              style={styles.icon}
                              color={'black'}
                              name={Box_AssetType ? 'close' : 'search1'}
                              size={22}
                              disable={true}
                              
                            />
                          )}
                        />
                      </View>
                    </Pressable>
                  </View>

                  {/* Asset GroupCode*/}
                  <View style={styles.view_style}>
                    <Pressable
                      onPress={() => select_dropdown('Box Asset Group Code', AssetGroupCode) }
                      onLongPress={() => {setBox_AssetGroupCode(''),setBox_AssetGroupCode_label('')}}>
                      <View pointerEvents={'none'}>
                        <TextInput
                          value={Box_AssetGroupCode}
                          style={[
                            styles.input,
                            {
                              height: Math.max(
                                Platform.OS === 'ios' ? 50 : 50,
                                height,
                              ),
                            },
                          ]}
                          inputStyle={[
                            styles.inputStyle,
                            {color: Editable ? '#808080' : '#000'},
                          ]}
                          labelStyle={styles.labelStyle}
                          placeholderStyle={{
                            fontSize: 15,
                            color: '#0096FF',
                          }}
                          onContentSizeChange={event =>
                            setHeight(event.nativeEvent.contentSize.height)
                          }
                          textErrorStyle={styles.textErrorStyle}
                          label="Asset Group Code"
                          focusColor="#808080"
                          editable={false}
                          selectTextOnFocus={false}
                          renderRightIcon={() => (
                            <AntDesign
                              style={styles.icon}
                              color={'black'}
                              name={Box_AssetGroupCode ? 'close' : 'search1'}
                              size={22}
                              disable={true}
                              
                            />
                          )}
                        />
                      </View>
                    </Pressable>
                  </View>

                  {/* Asset Code*/}
                  <View style={styles.view_style}>
                    <Pressable
                      onPress={() => select_dropdown('Box Asset Code', Assetcode) }
                      onLongPress={() => {setBox_AssetCode(''),setBox_AssetCode_label('')}}>
                      <View pointerEvents={'none'}>
                        <TextInput
                          value={Box_AssetCode}
                          style={[
                            styles.input,
                            {
                              height: Math.max(
                                Platform.OS === 'ios' ? 50 : 50,
                                height,
                              ),
                            },
                          ]}
                          inputStyle={[
                            styles.inputStyle,
                            {color: Editable ? '#808080' : '#000'},
                          ]}
                          labelStyle={styles.labelStyle}
                          placeholderStyle={{
                            fontSize: 15,
                            color: '#0096FF',
                          }}
                          onContentSizeChange={event =>
                            setHeight(event.nativeEvent.contentSize.height)
                          }
                          textErrorStyle={styles.textErrorStyle}
                          label="Asset Code"
                          focusColor="#808080"
                          editable={false}
                          selectTextOnFocus={false}
                          renderRightIcon={() => (
                            <AntDesign
                              style={styles.icon}
                              color={'black'}
                              name={Box_AssetCode ? 'close' : 'search1'}
                              size={22}
                              disable={true}
                              
                            />
                          )}
                        />
                      </View>
                    </Pressable>
                  </View>

                  {/* Work Area*/}
                  <View style={styles.view_style}>
                    <Pressable
                      onPress={() => select_dropdown('Box Work Area', WorkArea)}
                      onLongPress={() => {setBox_WorkArea(''),setBox_WorkArea_label('')}}>
                      <View pointerEvents={'none'}>
                        <TextInput
                          value={Box_WorkArea}
                          style={[
                            styles.input,
                            {
                              height: Math.max(
                                Platform.OS === 'ios' ? 50 : 50,
                                height,
                              ),
                            },
                          ]}
                          inputStyle={[
                            styles.inputStyle,
                            {color: Editable ? '#808080' : '#000'},
                          ]}
                          labelStyle={styles.labelStyle}
                          placeholderStyle={{
                            fontSize: 15,
                            color: '#0096FF',
                          }}
                          onContentSizeChange={event =>
                            setHeight(event.nativeEvent.contentSize.height)
                          }
                          textErrorStyle={styles.textErrorStyle}
                          label="Work Area"
                          focusColor="#808080"
                          editable={false}
                          selectTextOnFocus={false}
                          renderRightIcon={() => (
                            <AntDesign
                              style={styles.icon}
                              color={'black'}
                              name={Box_WorkArea ? 'close' : 'search1'}
                              size={22}
                              disable={true}
                              
                            />
                          )}
                        />
                      </View>
                    </Pressable>
                  </View>

                  {/* Asset Location */}
                  <View style={styles.view_style}>
                    <Pressable
                      onPress={() =>
                        select_dropdown('Box Asset Location', AssetLocation)
                      }
                      onLongPress={() => {setBox_AssetLocation(''),setBox_AssetLocation_label('')}}>
                      <View pointerEvents={'none'}>
                        <TextInput
                          value={Box_AssetLocation}
                          style={[
                            styles.input,
                            {
                              height: Math.max(
                                Platform.OS === 'ios' ? 50 : 50,
                                height,
                              ),
                            },
                          ]}
                          inputStyle={[
                            styles.inputStyle,
                            {color: Editable ? '#808080' : '#000'},
                          ]}
                          labelStyle={styles.labelStyle}
                          placeholderStyle={{
                            fontSize: 15,
                            color: '#0096FF',
                          }}
                          onContentSizeChange={event =>
                            setHeight(event.nativeEvent.contentSize.height)
                          }
                          textErrorStyle={styles.textErrorStyle}
                          label="Asset Location"
                          focusColor="#808080"
                          editable={false}
                          selectTextOnFocus={false}
                          renderRightIcon={() => (
                            <AntDesign
                              style={styles.icon}
                              color={'black'}
                              name={Box_AssetLocation ? 'close' : 'search1'}
                              size={22}
                              disable={true}
                              
                            />
                          )}
                        />
                      </View>
                    </Pressable>
                  </View>

                  {/* Asset Level */}
                  <View style={styles.view_style}>
                    <Pressable
                      onPress={() =>
                        select_dropdown('Box Asset Level', AssetLevel)
                      }
                      onLongPress={() =>{ setBox_AssetLevel(''),setBox_AssetLevel_label('')}}>
                      <View pointerEvents={'none'}>
                        <TextInput
                          value={Box_AssetLevel}
                          style={[
                            styles.input,
                            {
                              height: Math.max(
                                Platform.OS === 'ios' ? 50 : 50,
                                height,
                              ),
                            },
                          ]}
                          inputStyle={[
                            styles.inputStyle,
                            {color: Editable ? '#808080' : '#000'},
                          ]}
                          labelStyle={styles.labelStyle}
                          placeholderStyle={{
                            fontSize: 15,
                            color: '#0096FF',
                          }}
                          onContentSizeChange={event =>
                            setHeight(event.nativeEvent.contentSize.height)
                          }
                          textErrorStyle={styles.textErrorStyle}
                          label="Asset Level"
                          focusColor="#808080"
                          editable={false}
                          selectTextOnFocus={false}
                          renderRightIcon={() => (
                            <AntDesign
                              style={styles.icon}
                              color={'black'}
                              name={Box_AssetLevel ? 'close' : 'search1'}
                              size={22}
                              disable={true}
                              
                            />
                          )}
                        />
                      </View>
                    </Pressable>
                  </View>

                  <TouchableOpacity
                    style={{ width: '100%', height: 50, alignItems: 'center', justifyContent: 'center', backgroundColor: '#42A5F5', marginTop: 10}}
                    onPress={get_assetmaster_count}>
                    <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold', }}> Retrieve </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* DropDown Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={DropDown_modalVisible}
          onRequestClose={() => { setDropDown_modalVisible(!DropDown_modalVisible) }}>
          <View style={styles.model2_cardview}>
            <View style={{flex: 1, margin: 20, backgroundColor: '#FFFFFF'}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  height: 50,
                }}>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 15,
                    justifyContent: 'center',
                    textAlign: 'center',
                    color: '#000',
                    fontWeight: 'bold',
                  }}>
                  {textvalue}
                </Text>
                <Ionicons
                  name="close"
                  color="red"
                  size={30}
                  style={{marginEnd: 15}}
                  onPress={() =>
                    setDropDown_modalVisible(!DropDown_modalVisible)
                  }
                />
              </View>

              <SearchBar
                lightTheme
                round
                inputStyle={{color: '#000'}}
                inputContainerStyle={{backgroundColor: '#FFFF'}}
                searchIcon={{size: 24}}
                onChangeText={text => DropDown_searchFilterFunction(text)}
                onClear={text => DropDown_searchFilterFunction('')}
                placeholder="Search here..."
                value={DropDown_search}
              />

              <FlatList
                data={DropDownFilteredData}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={Dropdown_ItemSeparatorView}
                renderItem={Dropdown_ItemView}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              />
            </View>
          </View>
        </Modal>

        {/* Asset Listing */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={AssetList_modalVisible}
          onRequestClose={() => {
           //Alert.alert('Closed');
            setAssetList_modalVisible(!AssetList_modalVisible);
          }}>
          <View style={styles.model2_cardview}>
            <View style={{margin: 20, backgroundColor: '#FFFFFF'}}>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#0096FF', height: 50, }}>
                <Text style={{ flex: 1, fontSize: 15, justifyContent: 'center', color: '#fff', margin: 5, textAlign: 'center', fontWeight: 'bold', }}> Asset Listing </Text>
                <Ionicons
                  name="close"
                  color="#ffffffff"
                  size={25}
                  style={{marginEnd: 15}}
                  onPress={() =>
                    setAssetList_modalVisible(!AssetList_modalVisible)
                  }
                />
              </View>

              <SearchBar
                lightTheme
                round
                inputStyle={{color: '#000'}}
                inputContainerStyle={{backgroundColor: '#FFFF'}}
                searchIcon={{size: 24}}
                onChangeText={text => AssetList_FilterFunction(text)}
                onClear={text => AssetList_FilterFunction('')}
                placeholder="Search here..."
                value={AssetList_search}
              />

              <FlatList
                data={AssetList_FilteredData}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={AssetList_ItemSeparatorView}
                renderItem={AssetList_ItemView}
              />
            </View>
          </View>
        </Modal>

        {/* Attachment */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={Attachments_modalVisible}
          onRequestClose={() => {
           //Alert.alert('Closed');
            setAttachments_modalVisible(!Attachments_modalVisible);
          }}>
          <View style={styles.model_cardview}>
            <View style={{margin: 20, backgroundColor: '#FFFFFF', padding: 10}}>
              <View style={{marginTop: 10}}>
                <View style={{alignItems: 'flex-end'}}>
                  <AntDesign
                    style={styles.icon}
                    color="red"
                    name={'closecircleo'}
                    size={25}
                    onPress={() =>
                      setAttachments_modalVisible(!Attachments_modalVisible)
                    }
                  />
                </View>

                <Image
                  width={IMAGE_WIDTH}
                  source={{uri: images_link}}
                  style={{height: 360, margin: 10}}
                />
              </View>
            </View>
          </View>
        </Modal>

        {/*ZOOM Attachment */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={ZoomAttachments_modalVisible}
          onRequestClose={() => {
           //Alert.alert('Closed');
            setZoomAttachments_modalVisible(!ZoomAttachments_modalVisible);
          }}>
          <View style={styles.model_cardview}>
            <View style={{ flex: 1,backgroundColor: '#FFFFFF'}}>
              

              {
                //Type_link === 'image' && <Image width={IMAGE_WIDTH} resizeMode="contain"  source={{uri: link}} style={{alignSelf: 'center', height:'100%', width:'100%', margin: 10,}}/> ||
                Type_link === 'image' && 

                <ImageViewer 
                  imageUrls={images_link} 
                  style={{flex: 1}} 
                  index={linkindex}
                  onSwipeDown={() => setZoomAttachments_modalVisible(!ZoomAttachments_modalVisible)}
                  onClick={()=> setZoomAttachments_modalVisible(!ZoomAttachments_modalVisible)}
                  enableSwipeDown={true}/>

                ||


                Type_link === 'video' &&  
                
                <View style={{flex: 1}}>

                  <Appbar.Header style={{backgroundColor: '#000'}}>
                      <View style={{ flex: 1,alignItems:'flex-end'}}>
                        
                           <AntDesign style={{marginRight:20}} color="#fff" name={'close'} size={25} onPress={() =>setZoomAttachments_modalVisible(!ZoomAttachments_modalVisible) } />
                         
                      </View>
                    </Appbar.Header>

                  <Video 
                        source={{uri: link}} 
                        
                        //ref={ref => (videoPlayer.current = ref)}
                     // the video file
                       
                        disableFullscreen={true}
                        disableVolume={true}
                        disableBack={true}
                        resizeMode="contain"
                        paused={false}       
                        style={{ 
                          flex: 1,
                          
                        }}   // Can be a URL or a local file.
                        />     

                  
                </View>
                // <Video source={{ uri: link }} style={{flex: 1}} muted={false}/>
                
                ||

                Type_link === 'application' && 

                <View style={{flex: 1}}>

                  <Appbar.Header style={{backgroundColor: '#000'}}>
                      <View style={{ flex: 1,alignItems:'flex-end'}}>
                        
                           <AntDesign style={{marginRight:20}} color="#fff" name={'close'} size={25} onPress={() => setZoomAttachments_modalVisible(!ZoomAttachments_modalVisible) } />
                         
                      </View>
                    </Appbar.Header>
                    <Pdf 
                      trustAllCerts={false}
                      onError={(error) => { console.log(error)}} 
                      onLoadComplete={(numberOfPages, filePath) => { console.log(`Number of pages: ${numberOfPages}`) }}
                      source={{uri: link, cache: true }} 
                      style={{height: 700, margin: 10}}
                    /> 

                  
                </View>
                  
              }

        

             
            </View>
          </View>
        </Modal>

        <View style={{flex: 1, marginBottom: 80}}>
          <FlatList
            ListHeaderComponent={
              <View style={styles.container}>
                <Pressable>
                {/* REQUESTER INFORMATION */}
                <View style={styles.card}>
                  <View style={styles.card_heard}>
                    <Text style={styles.card_heard_text}> REQUESTER INFORMATION </Text>
                  </View>

                  {/*Employee*/}
                  <View style={styles.view_style}>
                    <Pressable
                      onPress={ () => !Editable ? select_dropdown('Employee', Employee) : ''  }
                      onLongPress={() => setEmployee_key('')}>
                      <View pointerEvents={'none'}>
                        <TextInput
                          value={Employee_key}
                          style={[ styles.input, { height: Platform.OS === 'ios' ? 50 : 50, }]}
                          inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}]}
                          labelStyle={styles.labelStyle}
                          placeholderStyle={{ fontSize: 15, color: '#0096FF'}}
                          label="Name"
                          editable={Editable}
                          selectTextOnFocus={Editable}
                          renderRightIcon={() =>
                            Editable ? (
                              ''
                            ) : (
                              <AntDesign
                                style={styles.icon}
                                color={'black'}
                                name={Employee_key ? 'close' : 'search1'}
                                size={22}
                              />
                            )
                          }
                        />
                      </View>
                    </Pressable>
                  </View>

                  {/* Phone No */}
                  <View style={styles.view_style}>
                    <TextInput
                      value={PhoneNo}
                      style={[ styles.input, { height: Platform.OS === 'ios' ? 50 : 50, }]}
                      inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}]}
                      labelStyle={styles.labelStyle}
                      keyboardType="numeric"
                      placeholderStyle={{ fontSize: 15, color: '#0096FF'}}
                      label="Phone No"
                      editable={!Editable}
                      selectTextOnFocus={!Editable}
                      onChangeText={text => { setPhoneNo(text) }}
                      renderRightIcon={() =>
                        Editable ? (
                          ''
                        ) : (
                          <AntDesign
                            style={styles.icon}
                            color={'black'}
                            name={PhoneNo ? 'close' : ''}
                            size={22}
                          />
                        )
                      }
                    />
                  </View>
                </View>

                {/* ASSET INFORMATION */}
                <View style={styles.card}>
                  <View style={styles.card_heard}>
                    <Text style={styles.card_heard_text}> ASSET INFORMATION </Text>
                  </View>

                  {/* Asset No */}
                  <View style={[ styles.view_style, {display: AssetNo_Visible ? 'flex' : 'none'}]}>
                    <Pressable
                      onPress={() => (!Editable ? open_search_asset_box() : '')}
                      onLongPress={() => {setAssetNo(''),setAssetDescription(''),setAssetGroupCode_key(''),setWorkArea_key(''),setAssetLocation_key(''),setAssetLevel_key(''),setCostCenter_key('')}}>
                      <View pointerEvents={'none'}>
                        <TextInput
                          value={AssetNo}
                          style={[ styles.input, { height: Platform.OS === 'ios' ? 50 : 50 }]}
                          inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}]}
                          labelStyle={styles.labelStyle}
                          placeholderStyle={{ fontSize: 15, color: '#0096FF'}}
                          label="Asset No"
                          editable={false}
                          selectTextOnFocus={false}
                          renderRightIcon={() =>
                            Editable ? (
                              ''
                            ) : (
                              <AntDesign
                                style={styles.icon}
                                color={'black'}
                                name={AssetNo ? 'close' : 'search1'}
                                size={22}
                              />
                            )
                          }
                        />
                      </View>
                    </Pressable>
                  </View>

                  {/* PM Group */}
                  <View
                    style={[ styles.view_style, {display: PMGroup_Visible ? 'flex' : 'none'}]}>
                    <Pressable>
                      <View pointerEvents={'none'}>
                        <TextInput
                          value={PMGroup}
                          style={[ styles.input, { height: Platform.OS === 'ios' ? 50 : 50}]}
                          inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#808080'}]}
                          labelStyle={styles.labelStyle}
                          placeholderStyle={{ fontSize: 15, color: '#0096FF'}}
                          label="PM Group"
                          editable={false}
                          selectTextOnFocus={false}
                          renderRightIcon={() => (Editable ? '' : '')}
                        />
                      </View>
                    </Pressable>
                  </View>

                  {/* Asset Description */}
                  <View style={styles.view_style}>
                    <TextInput
                      value={AssetDescription}
                      style={[ styles.input, { height: Math.max( Platform.OS === 'ios' ? 50 : 50, height, ), }, ]}
                      multiline
                      inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}, ]}
                      labelStyle={styles.labelStyle}
                      placeholderStyle={{ fontSize: 15, color: '#0096FF', }}
                      onContentSizeChange={event => setHeight(event.nativeEvent.contentSize.height) }
                      label="Description"
                      placeholderTextColor="gray"
                      clearButtonMode="always"
                      editable={!Editable}
                      selectTextOnFocus={!Editable}
                      onChangeText={text => { setAssetDescription(text); }}
                      renderRightIcon={() =>
                        Editable ? (
                          ''
                        ) : (
                          <AntDesign
                            style={styles.icon}
                            name={AssetDescription ? 'close' : ''}
                            size={20}
                            disable={true}
                            onPress={() =>
                              AssetDescription ? setAssetDescription('') : ''
                            }
                          />
                        )
                      }
                    />
                  </View>

                  {/* Asset Group Code*/}
                  <View style={styles.view_style}>
                    <Pressable
                      onPress={() => !Editable ? select_dropdown('Asset Group Code', AssetGroupCode) : '' }
                      onLongPress={() => setAssetGroupCode_key('')}>
                      <View pointerEvents={'none'}>
                        <TextInput
                          value={AssetGroupCode_key}
                          style={[ styles.input, { height: Platform.OS === 'ios' ? 50 : 50, }, ]}
                          inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}, ]}
                          labelStyle={styles.labelStyle}
                          placeholderStyle={{ fontSize: 15, color: '#0096FF', }}
                          onContentSizeChange={event => setHeight(event.nativeEvent.contentSize.height) }
                          label="Asset Group Code"
                          editable={false}
                          selectTextOnFocus={false}
                          renderRightIcon={() =>
                            Editable ? (
                              ''
                            ) : (
                              <AntDesign
                                style={styles.icon}
                                color={'black'}
                                name={AssetGroupCode_key ? 'close' : 'search1'}
                                size={22}
                                disable={true}
                                onPress={() =>
                                  AssetGroupCode_key
                                    ? setAssetGroupCode_key('')
                                    : select_dropdown(
                                        'Asset Group Code',
                                        AssetGroupCode,
                                      )
                                }
                              />
                            )
                          }
                        />
                      </View>
                    </Pressable>
                  </View>

                  {/* Work Area*/}
                  <View style={styles.view_style}>
                    <Pressable
                      onPress={() => !Editable ? select_dropdown('Work Area', WorkArea) : '' }
                      onLongPress={() => setWorkArea_key('')}>
                      <View pointerEvents={'none'}>
                        <TextInput
                          value={WorkArea_key}
                          style={[ styles.input, { height: Platform.OS === 'ios' ? 50 : 50, }, ]}
                          inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}, ]}
                          labelStyle={styles.labelStyle}
                          placeholderStyle={{ fontSize: 15, color: '#0096FF', }}
                          label="Work Area"
                          editable={false}
                          selectTextOnFocus={false}
                          renderRightIcon={() =>
                            Editable ? (
                              ''
                            ) : (
                              <AntDesign
                                style={styles.icon}
                                color={'black'}
                                name={WorkArea_key ? 'close' : 'search1'}
                                size={22}
                                disable={true}
                                onPress={() =>
                                  WorkArea_key
                                    ? setWorkArea_key('')
                                    : select_dropdown('Work Area', WorkArea)
                                }
                              />
                            )
                          }
                        />
                      </View>
                    </Pressable>
                  </View>

                  {/* Asset Location */}
                  <View style={styles.view_style}>
                    <Pressable
                      onPress={() => !Editable ? select_dropdown('Asset Location', AssetLocation) : '' }
                      onLongPress={() => setAssetLocation_key('')}>
                      <View pointerEvents={'none'}>
                        <TextInput
                          value={AssetLocation_key}
                          style={[ styles.input, { height: Platform.OS === 'ios' ? 50 : 50, }, ]}
                          inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}, ]}
                          labelStyle={styles.labelStyle}
                          multiline={true}
                          placeholderStyle={{ fontSize: 15, color: '#0096FF', }}
                          label="Asset Location"
                          editable={false}
                          selectTextOnFocus={false}
                          renderRightIcon={() =>
                            Editable ? (
                              ''
                            ) : (
                              <AntDesign
                                style={styles.icon}
                                color={'black'}
                                name={AssetLocation_key ? 'close' : 'search1'}
                                size={22}
                                disable={true}
                                onPress={() =>
                                  AssetLocation_key
                                    ? setAssetLocation_key('')
                                    : select_dropdown(
                                        'Asset Location',
                                        AssetLocation,
                                      )
                                }
                              />
                            )
                          }
                        />
                      </View>
                    </Pressable>
                  </View>

                  {/* Asset Level */}
                  <View style={styles.view_style}>
                    <Pressable
                      onPress={() => !Editable ? select_dropdown('Asset Level', AssetLevel) : '' }
                      onLongPress={() => setAssetLevel_key('')}>
                      <View pointerEvents={'none'}>
                        <TextInput
                          value={AssetLevel_key}
                          style={[ styles.input, { height: Platform.OS === 'ios' ? 50 : 50, }, ]}
                          inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}, ]}
                          labelStyle={styles.labelStyle}
                          multiline={true}
                          placeholderStyle={{ fontSize: 15, color: '#0096FF', }}
                          label="Asset Level"
                          placeholderTextColor="gray"
                          focusColor="#808080"
                          editable={false}
                          selectTextOnFocus={false}
                          renderRightIcon={() =>
                            Editable ? (
                              ''
                            ) : (
                              <AntDesign
                                style={styles.icon}
                                color={'black'}
                                name={AssetLevel_key ? 'close' : 'search1'}
                                size={22}
                                disable={true}
                                onPress={() =>
                                  AssetLevel_key
                                    ? setAssetLevel_key('')
                                    : select_dropdown('Asset Level', AssetLevel)
                                }
                              />
                            )
                          }
                        />
                      </View>
                    </Pressable>
                  </View>

                  {/* Cost Center */}
                  <View style={styles.view_style}>
                    <Pressable
                      onPress={() => !Editable ? select_dropdown('Cost Center', CostCenter) : '' }
                      onLongPress={() => setCostCenter_key('')}>
                      <View pointerEvents={'none'}>
                        <TextInput
                          value={CostCenter_key}
                          style={[ styles.input, { height: Platform.OS === 'ios' ? 50 : 50, }, ]}
                          inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}, ]}
                          labelStyle={styles.labelStyle}
                          placeholderStyle={{ fontSize: 15, color: '#0096FF', }}
                          label="Cost Center"
                          editable={false}
                          selectTextOnFocus={false}
                          renderRightIcon={() =>
                            Editable ? (
                              ''
                            ) : (
                              <AntDesign
                                style={styles.icon}
                                color={'black'}
                                name={CostCenter_key ? 'close' : 'search1'}
                                size={22}
                                disable={true}
                                onPress={() =>
                                  CostCenter_key
                                    ? setCostCenter_key('')
                                    : select_dropdown('Cost Center', CostCenter)
                                }
                              />
                            )
                          }
                        />
                      </View>
                    </Pressable>
                  </View>
                </View>

                {/* WORK ORDER INFORMATION */}
                <View style={styles.card}>
                  <View style={styles.card_heard}>
                    <Text style={styles.card_heard_text}> WORK ORDER INFORMATION </Text>
                  </View>

                  {/* WorkRequestNo */}
                  <View style={styles.view_style}>
                    <TextInput
                      value={WorkOrderNo}
                      style={[ styles.input, { height: Platform.OS === 'ios' ? 50 : 50, }, ]}
                      inputStyle={[ styles.inputStyle, { color: WorkOrderNo_editable ? WorkOrderNo ? '#808080' : '#000' : WorkOrderNo ? '#808080' : '#000', }, ]}
                      labelStyle={styles.labelStyle}
                      placeholderStyle={{ fontSize: 15, color: WorkOrderNo_editable ? '#0096FF' : '#808080', }}
                      label="Work Order No"
                      editable={WorkOrderNo_editable}
                      selectTextOnFocus={WorkOrderNo_editable}
                      onChangeText={text => { setWorkOrderNo(text); }}
                      renderRightIcon={() =>
                        !WorkOrderNo_editable ? (
                          ''
                        ) : (
                          <AntDesign
                            style={styles.icon}
                            name={Assetno ? 'close' : 'search1'}
                            size={20}
                            disable={true}
                            onPress={() =>
                              WorkOrderNo ? setWorkOrderNo() : ''
                            }
                          />
                        )
                      }
                    />
                  </View>

                  {/* Original Priority */}
                  <View style={styles.view_style}>
                    <Pressable
                      onPress={() => !Editable ? select_dropdown( 'Original Priority', OriginalPriority, ) : '' }
                      onLongPress={() => setOrgPriority_key('')}>
                      <View pointerEvents={'none'}>
                        <TextInput
                          value={OrgPriority_key}
                          style={[ styles.input, { height: Platform.OS === 'ios' ? 50 : 50, }, ]}
                          inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}, ]}
                          labelStyle={styles.labelStyle}
                          multiline={true}
                          placeholderStyle={{ fontSize: 15, color: '#0096FF', }}
                          label="Original Priority"
                          editable={false}
                          selectTextOnFocus={false}
                          renderRightIcon={() =>
                            Editable ? (
                              ''
                            ) : (
                              <AntDesign
                                style={styles.icon}
                                color={'black'}
                                name={OrgPriority_key ? 'close' : 'search1'}
                                size={22}
                                disable={true}
                                onPress={() =>
                                  OrgPriority_key
                                    ? setOrgPriority_key('')
                                    : select_dropdown(
                                        'Original Priority',
                                        OriginalPriority,
                                      )
                                }
                              />
                            )
                          }
                        />
                      </View>
                    </Pressable>
                  </View>

                  {/* Plan Priority */}
                  <View style={styles.view_style}>
                    <Pressable
                      onPress={() => !Editable ? select_dropdown('Plan Priority', OriginalPriority) : '' }
                      onLongPress={() => setPlanPriority_key('')}>
                      <View pointerEvents={'none'}>
                        <TextInput
                          value={PlanPriority_key}
                          style={[
                            styles.input,
                            {
                              height: Platform.OS === 'ios' ? 50 : 50,
                            },
                          ]}
                          inputStyle={[
                            styles.inputStyle,
                            {color: Editable ? '#808080' : '#000'},
                          ]}
                          labelStyle={styles.labelStyle}
                          multiline={true}
                          placeholderStyle={{
                            fontSize: 15,
                            color: '#0096FF',
                          }}
                          label="Plan Priority"
                          editable={false}
                          selectTextOnFocus={false}
                          renderRightIcon={() =>
                            Editable ? (
                              ''
                            ) : (
                              <AntDesign
                                style={styles.icon}
                                color={'black'}
                                name={PlanPriority_key ? 'close' : 'search1'}
                                size={22}
                                disable={true}
                                onPress={() =>
                                  PlanPriority_key
                                    ? setOrgPriority_key('')
                                    : select_dropdown(
                                        'Plan Priority',
                                        OriginalPriority,
                                      )
                                }
                              />
                            )
                          }
                        />
                      </View>
                    </Pressable>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    }}>
                    {/* From Date */}
                    <View style={styles.view_style}>
                      <Pressable
                        onPress={() =>
                          !Editable ? showDatePicker('from') : ''
                        }
                        onLongPress={() => setOrgDate('')}>
                        <View pointerEvents={'none'}>
                          <TextInput
                            value={OrgDate}
                            style={[
                              styles.input,
                              {
                                height: Platform.OS === 'ios' ? 50 : 50,
                              },
                            ]}
                            inputStyle={[
                              styles.inputStyle,
                              {color: Editable ? '#808080' : '#000'},
                            ]}
                            labelStyle={styles.labelStyle}
                            placeholderStyle={{
                              fontSize: 15,
                              color: '#0096FF',
                            }}
                            label="Origination Date"
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

                    {/* To Date */}
                    <View style={styles.view_style}>
                      <Pressable
                        onPress={() => (!Editable ? showDatePicker('to') : '')}
                        onLongPress={() => setDueDate('')}>
                        <View pointerEvents={'none'}>
                          <TextInput
                            value={DueDate}
                            style={[
                              styles.input,
                              {
                                height: Platform.OS === 'ios' ? 50 : 50,
                              },
                            ]}
                            inputStyle={[
                              styles.inputStyle,
                              {color: Editable ? '#808080' : '#000'},
                            ]}
                            labelStyle={styles.labelStyle}
                            placeholderStyle={{
                              fontSize: 15,
                              color: '#0096FF',
                            }}
                            label="Due Date"
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

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    }}>
                    {/* From Date */}
                    <View style={styles.view_style}>
                      <Pressable
                        onPress={() =>
                          !Editable ? showTimePicker('from') : ''
                        }
                        onLongPress={() => setOrgTime('')}>
                        <View pointerEvents={'none'}>
                          <TextInput
                            value={OrgTime}
                            style={[
                              styles.input,
                              {
                                height: Platform.OS === 'ios' ? 50 : 50,
                              },
                            ]}
                            inputStyle={[
                              styles.inputStyle,
                              {color: Editable ? '#808080' : '#000'},
                            ]}
                            labelStyle={styles.labelStyle}
                            placeholderStyle={{
                              fontSize: 15,
                              color: '#0096FF',
                            }}
                            label="Origination Time"
                            editable={false}
                            selectTextOnFocus={false}
                            renderRightIcon={() => (
                              <AntDesign
                                style={styles.icon}
                                color={'black'}
                                name={'clockcircleo'}
                                size={20}
                              />
                            )}
                          />
                        </View>
                      </Pressable>
                    </View>

                    {/* To Date */}
                    <View style={styles.view_style}>
                      <Pressable
                        onPress={() => (!Editable ? showTimePicker('to') : '')}
                        onLongPress={() => setDueTime('')}>
                        <View pointerEvents={'none'}>
                          <TextInput
                            value={DueTime}
                            style={[
                              styles.input,
                              {
                                height: Platform.OS === 'ios' ? 50 : 50,
                              },
                            ]}
                            inputStyle={[
                              styles.inputStyle,
                              {color: Editable ? '#808080' : '#000'},
                            ]}
                            labelStyle={styles.labelStyle}
                            placeholderStyle={{
                              fontSize: 15,
                              color: '#0096FF',
                            }}
                            label="Due Time"
                            editable={false}
                            selectTextOnFocus={false}
                            renderRightIcon={() => (
                              <AntDesign
                                style={styles.icon}
                                color={'black'}
                                name={'clockcircleo'}
                                size={20}
                              />
                            )}
                          />
                        </View>
                      </Pressable>
                    </View>
                  </View>

                  {/* Work Group*/}
                  <View style={styles.view_style}>
                    <Pressable
                      onPress={() =>
                        !Editable ? select_dropdown('Work Type', WorkType) : ''
                      }
                      onLongPress={() => setWorkType_key('')}>
                      <View pointerEvents={'none'}>
                        <TextInput
                          value={WorkType_key}
                          style={[
                            styles.input,
                            {
                              height: Platform.OS === 'ios' ? 50 : 50,
                            },
                          ]}
                          inputStyle={[
                            styles.inputStyle,
                            {color: Editable ? '#808080' : '#000'},
                          ]}
                          labelStyle={styles.labelStyle}
                          multiline={true}
                          placeholderStyle={{
                            fontSize: 15,
                            color: '#0096FF',
                          }}
                          label="Work Type"
                          editable={false}
                          selectTextOnFocus={false}
                          renderRightIcon={() =>
                            Editable ? (
                              ''
                            ) : (
                              <AntDesign
                                style={styles.icon}
                                color={'black'}
                                name={WorkType_key ? 'close' : 'search1'}
                                size={22}
                                disable={true}
                                onPress={() =>
                                  WorkType_key
                                    ? setWorkType_key('')
                                    : select_dropdown('Work Type', WorkType)
                                }
                              />
                            )
                          }
                        />
                      </View>
                    </Pressable>
                  </View>

                  {/* Fault Code*/}
                  <View style={styles.view_style}>
                    <Pressable
                      onPress={() =>
                        !Editable
                          ? select_dropdown('Fault Code', FaultCode)
                          : ''
                      }
                      onLongPress={() => setFaultCode_key('')}>
                      <View pointerEvents={'none'}>
                        <TextInput
                          value={FaultCode_key}
                          style={[
                            styles.input,
                            {
                              height: Math.max(
                                Platform.OS === 'ios' ? 50 : 50,
                                FaultCode_height,
                              ),
                            },
                          ]}
                          inputStyle={[
                            styles.inputStyle,
                            {color: Editable ? '#808080' : '#000'},
                          ]}
                          labelStyle={styles.labelStyle}
                          multiline={true}
                          placeholderStyle={{
                            fontSize: 15,
                            color: '#0096FF',
                          }}
                          onContentSizeChange={event =>
                            setFaultCode_height(
                              event.nativeEvent.contentSize.height,
                            )
                          }
                          textErrorStyle={styles.textErrorStyle}
                          //onTouchStart={()=>{!Editable ? select_dropdown("Cost Center",CostCenter) : ''}}
                          label="Fault Code"
                          placeholderTextColor="gray"
                          focusColor="#808080"
                          editable={false}
                          selectTextOnFocus={false}
                          renderRightIcon={() =>
                            Editable ? (
                              ''
                            ) : (
                              <AntDesign
                                style={styles.icon}
                                color={'black'}
                                name={FaultCode_key ? 'close' : 'search1'}
                                size={22}
                                disable={true}
                                onPress={() =>
                                  FaultCode_key
                                    ? setFaultCode_key('')
                                    : select_dropdown('Fault Code', FaultCode)
                                }
                              />
                            )
                          }
                        />
                      </View>
                    </Pressable>
                  </View>

                  {/* Work Order Description */}
                  <View style={styles.view_style}>
                    <TextInput
                      value={WorkOrderDescription}
                      style={[
                        styles.input,
                        {
                          height: Math.max(
                            Platform.OS === 'ios' ? 50 : 50,
                            WRDesc_height,
                          ),
                        },
                      ]}
                      multiline={true}
                      numberOfLines={4}
                      inputStyle={[
                        styles.inputStyle,
                        {color: Editable ? '#808080' : '#000'},
                      ]}
                      labelStyle={styles.labelStyle}
                      placeholderStyle={{
                        fontSize: 15,
                        color: '#0096FF',
                      }}
                      onContentSizeChange={event =>
                        setWRDesc_height(event.nativeEvent.contentSize.height)
                      }
                      textErrorStyle={styles.textErrorStyle}
                      label="Work Order Description"
                      placeholderTextColor="gray"
                      focusColor="#808080"
                      editable={!Editable}
                      selectTextOnFocus={!Editable}
                      onChangeText={text => {
                        setWorkOrderDescription(text);
                      }}
                      renderRightIcon={() =>
                        Editable ? (
                          ''
                        ) : (
                          <AntDesign
                            style={styles.icon}
                            name={WorkOrderDescription ? 'close' : ''}
                            size={22}
                            disable={true}
                            onPress={() =>
                              WorkOrderDescription
                                ? setWorkOrderDescription('')
                                : ''
                            }
                          />
                        )
                      }
                    />
                  </View>

                  {/* Work Order Status*/}
                  <View style={styles.view_style}>
                    <Pressable
                      onPress={() =>
                        !Editable
                          ? select_dropdown(
                              'Work Order Status',
                              WorkOrderStatus,
                            )
                          : ''
                      }
                      onLongPress={() => setWorkOrderStatus_key('')}>
                      <View pointerEvents={'none'}>
                        <TextInput
                          value={WorkOrderStatus_key}
                          style={[
                            styles.input,
                            {
                              height: Platform.OS === 'ios' ? 50 : 50,
                            },
                          ]}
                          inputStyle={[
                            styles.inputStyle,
                            {color: Editable ? '#808080' : '#000'},
                          ]}
                          labelStyle={styles.labelStyle}
                          multiline={true}
                          placeholderStyle={{
                            fontSize: 15,
                            color: '#0096FF',
                          }}
                          label="Work Order Status"
                          editable={false}
                          selectTextOnFocus={false}
                          renderRightIcon={() =>
                            Editable ? (
                              ''
                            ) : (
                              <AntDesign
                                style={styles.icon}
                                color={'black'}
                                name={WorkOrderStatus_key ? 'close' : 'search1'}
                                size={22}
                                disable={true}
                                onPress={() =>
                                  WorkOrderStatus_key
                                    ? setWorkOrderStatus_key('')
                                    : select_dropdown(
                                        'Work Order Status',
                                        WorkOrderStatus,
                                      )
                                }
                              />
                            )
                          }
                        />
                      </View>
                    </Pressable>
                  </View>

                  {/* Assign TO */}
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                    }}>
                    <View style={styles.view_style}>
                      <Pressable
                        onPress={() =>
                          !Editable
                            ? select_dropdown('Assign To', AssignTo)
                            : ''
                        }
                        onLongPress={() => setAssigTo_key('')}>
                        <View pointerEvents={'none'}>
                          <TextInput
                            value={AssigTo_key}
                            style={[
                              styles.input,
                              {
                                height: Math.max(
                                  Platform.OS === 'ios' ? 50 : 50,
                                  height,
                                ),
                              },
                            ]}
                            inputStyle={[
                              styles.inputStyle,
                              {color: Editable ? '#808080' : '#000'},
                            ]}
                            labelStyle={styles.labelStyle}
                            multiline={true}
                            placeholderStyle={{
                              fontSize: 15,
                              color: '#0096FF',
                            }}
                            onContentSizeChange={event =>
                              setHeight(event.nativeEvent.contentSize.height)
                            }
                            textErrorStyle={styles.textErrorStyle}
                            //onTouchStart={()=>{!Editable ? select_dropdown("Cost Center",CostCenter) : ''}}
                            label="Assign To"
                            placeholderTextColor="gray"
                            focusColor="#808080"
                            editable={false}
                            selectTextOnFocus={false}
                            renderRightIcon={() =>
                              Editable ? (
                                ''
                              ) : (
                                <AntDesign
                                  style={styles.icon}
                                  color={'black'}
                                  name={AssigTo_key ? 'close' : 'search1'}
                                  size={22}
                                  disable={true}
                                  onPress={() =>
                                    AssigTo_key
                                      ? setAssigTo_key('')
                                      : select_dropdown('Assign To', AssignTo)
                                  }
                                />
                              )
                            }
                          />
                        </View>
                      </Pressable>
                    </View>

                    <View
                      style={{
                        alignItems: 'center',
                        display: Assigtohistory_Visible ? 'flex' : 'none',
                      }}>
                      <MaterialIcons
                        name="format-list-numbered"
                        color={'#05375a'}
                        size={45}
                        style={{
                          marginTop: Platform.OS === 'ios' ? 0 : 7,
                          marginRight: 10,
                          marginTop: 11,
                        }}
                        onPress={() => get_assign_history()}
                        disabled={Editable}
                      />

                      <Text
                        style={{
                          color: '#05375a',
                          fontSize: 12,
                          fontWeight: 'bold',
                        }}>
                        Assign History
                      </Text>
                    </View>
                  </View>

                  {/* Assign to Reason */}
                  <View
                    style={[
                      styles.view_style,
                      {display: AssigToReason_Visible ? 'flex' : 'none'},
                    ]}>
                    <TextInput
                      value={AssigTo_Reason}
                      style={[
                        styles.input,
                        {
                          height: Math.max(
                            Platform.OS === 'ios' ? 50 : 50,
                            height,
                          ),
                        },
                      ]}
                      multiline={true}
                      numberOfLines={4}
                      inputStyle={[
                        styles.inputStyle,
                        {color: Editable ? '#808080' : '#000'},
                      ]}
                      labelStyle={styles.labelStyle}
                      placeholderStyle={{
                        fontSize: 15,
                        color: '#0096FF',
                      }}
                      textErrorStyle={styles.textErrorStyle}
                      label="Assign to Reason"
                      placeholderTextColor="gray"
                      focusColor="#808080"
                      editable={!Editable}
                      selectTextOnFocus={!Editable}
                      onChangeText={text => {
                        setAssigTo_Reason(text);
                      }}
                      renderRightIcon={() =>
                        Editable ? (
                          ''
                        ) : (
                          <AntDesign
                            style={styles.icon}
                            name={AssigTo_Reason ? 'close' : ''}
                            size={22}
                            disable={true}
                            onPress={() =>
                              AssigTo_Reason ? setAssigTo_Reason('') : ''
                            }
                          />
                        )
                      }
                    />
                  </View>

                  {/* Labor Account*/}
                  <View style={styles.view_style}>
                    <Pressable
                      onPress={() =>
                        !Editable
                          ? select_dropdown('Labor Account', Account)
                          : ''
                      }
                      onLongPress={() => setLaborAccount_key('')}>
                      <View pointerEvents={'none'}>
                        <TextInput
                          value={LaborAccount_key}
                          style={[
                            styles.input,
                            {
                              height: Platform.OS === 'ios' ? 50 : 50,
                            },
                          ]}
                          inputStyle={[
                            styles.inputStyle,
                            {color: Editable ? '#808080' : '#000'},
                          ]}
                          labelStyle={styles.labelStyle}
                          multiline={true}
                          placeholderStyle={{
                            fontSize: 15,
                            color: '#0096FF',
                          }}
                          label="Labor Account"
                          placeholderTextColor="gray"
                          focusColor="#808080"
                          editable={false}
                          selectTextOnFocus={false}
                          renderRightIcon={() =>
                            Editable ? (
                              ''
                            ) : (
                              <AntDesign
                                style={styles.icon}
                                color={'black'}
                                name={LaborAccount_key ? 'close' : 'search1'}
                                size={22}
                                disable={true}
                                onPress={() =>
                                  LaborAccount_key
                                    ? setLaborAccount_key('')
                                    : select_dropdown('Labor Account', Account)
                                }
                              />
                            )
                          }
                        />
                      </View>
                    </Pressable>
                  </View>

                  {/* Contract Account*/}
                  <View style={styles.view_style}>
                    <Pressable
                      onPress={() =>
                        !Editable
                          ? select_dropdown('Contract Account', Account)
                          : ''
                      }
                      onLongPress={() => setContractAccount_key('')}>
                      <View pointerEvents={'none'}>
                        <TextInput
                          value={ContractAccount_key}
                          style={[
                            styles.input,
                            {
                              height: Platform.OS === 'ios' ? 50 : 50,
                            },
                          ]}
                          inputStyle={[
                            styles.inputStyle,
                            {color: Editable ? '#808080' : '#000'},
                          ]}
                          labelStyle={styles.labelStyle}
                          multiline={true}
                          placeholderStyle={{
                            fontSize: 15,
                            color: '#0096FF',
                          }}
                          label="Contract Account"
                          editable={false}
                          selectTextOnFocus={false}
                          renderRightIcon={() =>
                            Editable ? (
                              ''
                            ) : (
                              <AntDesign
                                style={styles.icon}
                                color={'black'}
                                name={ContractAccount_key ? 'close' : 'search1'}
                                size={22}
                                disable={true}
                                onPress={() =>
                                  ContractAccount_key
                                    ? setContractAccount_key('')
                                    : select_dropdown(
                                        'Contract Account',
                                        Account,
                                      )
                                }
                              />
                            )
                          }
                        />
                      </View>
                    </Pressable>
                  </View>

                  {/* Material Account*/}
                  <View style={styles.view_style}>
                    <Pressable
                      onPress={() =>
                        !Editable
                          ? select_dropdown('Material Account', Account)
                          : ''
                      }
                      onLongPress={() => setMaterialAccount_key('')}>
                      <View pointerEvents={'none'}>
                        <TextInput
                          value={MaterialAccount_key}
                          style={[
                            styles.input,
                            {
                              height: Platform.OS === 'ios' ? 50 : 50,
                            },
                          ]}
                          inputStyle={[
                            styles.inputStyle,
                            {color: Editable ? '#808080' : '#000'},
                          ]}
                          labelStyle={styles.labelStyle}
                          multiline={true}
                          placeholderStyle={{
                            fontSize: 15,
                            color: '#0096FF',
                          }}
                          label="Material Account"
                          editable={false}
                          selectTextOnFocus={false}
                          renderRightIcon={() =>
                            Editable ? (
                              ''
                            ) : (
                              <AntDesign
                                style={styles.icon}
                                color={'black'}
                                name={MaterialAccount_key ? 'close' : 'search1'}
                                size={22}
                                disable={true}
                                onPress={() =>
                                  MaterialAccount_key
                                    ? setMaterialAccount_key('')
                                    : select_dropdown(
                                        'Material Account',
                                        Account,
                                      )
                                }
                              />
                            )
                          }
                        />
                      </View>
                    </Pressable>
                  </View>
                </View>

                {/* WORK ORDER ATTACHMENTS */}
                <View style={styles.card}>
                  <View style={styles.card_heard}>
                    <Text style={styles.card_heard_text}>
                      WORK ORDER ATTACHMENTS
                    </Text>
                  </View>

                  <View
                    style={[ styles.view_style, { display: !Editable ? 'flex' : 'none', flexDirection: 'row', }]}>
                    <TouchableOpacity
                      style={{ flex: 1.5, marginTop: 10, justifyContent: 'center', alignItems: 'center'}}
                      onPress={() => Attachment()}
                      disabled={Editable}>
                      <View
                        style={{ height: 60, width: 60, borderRadius: 30, padding: 10, backgroundColor: '#F7DC6F', justifyContent: 'center', alignItems: 'center', }}>
                        <MaterialIcons name="add-a-photo" color="#05375a" size={30} />
                      </View>

                      <Text style={{margin: 10, color: '#000', fontWeight: 'bold'}}> Image </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{ flex: 1.5, marginTop: 10, justifyContent: 'center', alignItems: 'center'}}
                      onPress={() => captureImage('video')}
                      //onPress={() => console.log("Video")}
                      disabled={Editable}>
                      <View style={{ height: 60, width: 60, borderRadius: 30, padding: 10, backgroundColor: '#F7DC6F', justifyContent: 'center', alignItems: 'center', }}>
                        <MaterialIcons name="switch-video" color="#05375a" size={30} />
                      </View>
                      <Text style={{margin: 10, color: '#000', fontWeight: 'bold'}}> Video </Text>
                    </TouchableOpacity>


                    <TouchableOpacity
                      style={{ flex: 1.5, marginTop: 10, justifyContent: 'center', alignItems: 'center'}}
                      onPress={() => selectFile()}
                      disabled={Editable}>
                      <View style={{ height: 60, width: 60, borderRadius: 30, padding: 10, backgroundColor: '#F7DC6F', justifyContent: 'center', alignItems: 'center'}}>
                        <MaterialIcons
                          name="picture-as-pdf"
                          color="#05375a"
                          size={30}
                        />
                      </View>
                      <Text style={{margin: 10, color: '#000', fontWeight: 'bold'}}> PDF </Text>
                    </TouchableOpacity>

                  </View>

                  <ImagePickerModal
                    title="You can either take a picture or select one from your album."
                    data={['Take a photo', 'Select from the library']}
                    isVisible={isVisible}
                    onCancelPress={() => {
                      setVisible(false);
                    }}
                    onBackdropPress={() => {
                      setVisible(false);
                    }}
                    onPress={item => {
                      console.log('item', item);
                      setVisible(false);
                      for (let value of Object.values(item.assets)) {
                        if (value.duration > 30) {
                          setAlert( true, 'danger', 'Video duration more then 30sec please select file less then 30sec', 'OK', '', );
                          return;
                        } else {
                          console.log('Valeu', value.uri);
                          compress(value.uri,value.fileName,value.type,value.fileSize)
                          // let key = Attachments_List.length + 1;
                          // let localIdentifier = key;
                          // let path = value.uri;
                          // let name = value.fileName;
                          // let rowid = '';
                          // let type = value.type;
                          // let imagetype = 'New';
                          // Attachments_List.unshift({
                          //   key,
                          //   path,
                          //   name,
                          //   imagetype,
                          //   type,
                          //   localIdentifier,
                          //   rowid,
                          // });
                          // setAttachments_List(Attachments_List.slice(0));
                          // key++;
                        }
                      }

                      // setSelectedItem(item);
                      // openPicker()
                    }}
                  />
                </View>

                {/* More Opstion XML */}
                {/* <View style={styles.centeredView}>
                  <Att_Modal
                    style={styles.bottomModalView}
                    isVisible={isMoreVisible}
                    onRequestClose={() => { setMoreVisible(!isMoreVisible)}}
                    backdropOpacity={0}>
                    <View style={styles.modal2}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 40, marginRight: 30, marginBottom: 10, }}>
                        <Text style={{ fontSize: 15, justifyContent: 'center', alignItems: 'center', color: '#000', }}></Text>

                        <Ionicons
                          name="close"
                          color={'#000'}
                          size={25}
                          onPress={() => setMoreVisible(false)}
                        />
                      </View>

                      <Pressable
                        style={{display: Response_Visible ? 'flex' : 'none'}}
                        onPress={cv_response}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', marginLeft: 10, marginRight: 10, marginTop: 5, marginBottom: 5, borderRadius: 10, }}>
                          <AntDesign name={'qrcode'} color={'#05375a'} size={25} onPress={() => setMoreVisible(false)} />
                          <Text style={{ fontSize: 15, justifyContent: 'center', alignItems: 'center', color: '#000', marginTop: 5, }}> {'Response'} </Text>
                          <AntDesign name={'checkcircleo'} color={Response_color} size={25} onPress={() => setMoreVisible(false)} />
                        </View>
                      </Pressable>

                      <Pressable
                        style={{display: Chargeable_Visible ? 'flex' : 'none'}}
                        onPress={cv_chargeable}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', marginLeft: 10, marginRight: 10, marginTop: 5, marginBottom: 5, borderRadius: 10, }}>
                          <AntDesign name={'redenvelopes'} color={'#05375a'} size={25} />

                          <Text style={{ fontSize: 15, justifyContent: 'center', alignItems: 'center', color: '#000', marginTop: 5, }}> {'Chargeable'} </Text>
                          <AntDesign name={'checkcircleo'} color={Chargeable_color} size={25} />
                        </View>
                      </Pressable>

                      <Pressable
                        style={{ display: Acknowledgement_Visible ? 'flex' : 'none', }}
                        onPress={cv_acknowledgement}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', marginLeft: 10, marginRight: 10, marginTop: 5, marginBottom: 5, borderRadius: 10, }}>
                          <AntDesign name={'like2'} color={'#05375a'} size={25} />
                          <Text style={{ fontSize: 15, justifyContent: 'center', alignItems: 'center', color: '#000', marginTop: 5, }}> {'Acknowledgement'} </Text>
                          <AntDesign name={'checkcircleo'} color={Acknowledgement_color} size={25} />
                        </View>
                      </Pressable>

                      <Pressable
                        style={{ display: WOCompletion_Visible ? 'flex' : 'none', }}
                        onPress={cv_wo_completion}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', marginLeft: 10, marginRight: 10, marginTop: 5, marginBottom: 5, borderRadius: 10, }}>
                          <AntDesign name={'tool'} color={'#05375a'} size={25} />
                          <Text style={{ fontSize: 15, justifyContent: 'center', alignItems: 'center', color: '#000', marginTop: 5, }}> {'WO Completion'} </Text>
                          <AntDesign name={'checkcircleo'} color={WOCompletion_color} size={25} />
                        </View>
                      </Pressable>

                      <Pressable
                        style={{ display: ContractServices_Visible ? 'flex' : 'none', }}
                        onPress={cv_contract_services}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', marginLeft: 10, marginRight: 10, marginTop: 5, marginBottom: 5, borderRadius: 10, }}>
                          <AntDesign name={'carryout'} color={'#05375a'} size={25} />
                          <Text style={{ fontSize: 15, justifyContent: 'center', alignItems: 'center', color: '#000', marginTop: 5, }}> {'Contract Service'} </Text>

                          <Text style={{ fontSize: 15, justifyContent: 'center', alignItems: 'center', color: '#000', }}> {ContractServices_Count} </Text>
                        </View>
                      </Pressable>

                      <Pressable
                        style={{ display: MaterialRequest_Visible ? 'flex' : 'none', }}
                        onPress={cv_material_request}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', marginLeft: 10, marginRight: 10, marginTop: 5, marginBottom: 5, borderRadius: 10, }}>
                          <AntDesign name={'bars'} color={'#05375a'} size={25} />
                          <Text style={{ fontSize: 15, justifyContent: 'center', alignItems: 'center', color: '#000', marginTop: 5, }}> {'Material Request'} </Text>
                          <Text style={{ fontSize: 15, justifyContent: 'center', alignItems: 'center', color: '#000', }}> {MaterialRequest_Count} </Text>
                        </View>
                      </Pressable>

                      <Pressable
                        style={{display: CheckList_Visible ? 'flex' : 'none'}}
                        onPress={cv_check_list}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', marginLeft: 10, marginRight: 10, marginTop: 5, marginBottom: 5, borderRadius: 10, }}>
                          <AntDesign name={'profile'} color={'#05375a'} size={25} />
                          <Text style={{ fontSize: 15, justifyContent: 'center', alignItems: 'center', color: '#000', marginTop: 5, }}> {'Check List'} </Text>
                          <Text style={{ fontSize: 15, justifyContent: 'center', alignItems: 'center', color: '#000', }}> {CheckList_Count} </Text>
                        </View>
                      </Pressable>

                      <Pressable
                        style={{display: TimaeCard_Visible ? 'flex' : 'none'}}
                        onPress={cv_time_card}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', marginLeft: 10, marginRight: 10, marginTop: 5, marginBottom: 5, borderRadius: 10, }}>
                          <AntDesign name={'find'} color={'#05375a'} size={25} />
                          <Text style={{ fontSize: 15, justifyContent: 'center', alignItems: 'center', color: '#000', marginTop: 5, }}> {'Time Card'} </Text>
                          <Text style={{ fontSize: 15, justifyContent: 'center', alignItems: 'center', color: '#000', }}> {TimaeCard_Count} </Text>
                        </View>
                      </Pressable>

                      <Pressable
                        style={{ display: AssetDowntime_Visible ? 'flex' : 'none', }}
                        onPress={cv_asset_downtime}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', marginLeft: 10, marginRight: 10, marginTop: 5, marginBottom: 5, borderRadius: 10, }}>
                          <AntDesign name={'export2'} color={'#05375a'} size={25} />
                          <Text style={{ fontSize: 15, justifyContent: 'center', alignItems: 'center', color: '#000', marginTop: 5, }}> {'Asset Downtime'} </Text>
                          <Text style={{ fontSize: 15, justifyContent: 'center', alignItems: 'center', color: '#000', }}> {AssetDowntime_Count} </Text>
                        </View>
                      </Pressable>

                      <Pressable
                        style={{ display: PurchasingInfo_Visible ? 'flex' : 'none', }}
                        onPress={cv_purchasing_info}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', marginLeft: 10, marginRight: 10, marginTop: 5, marginBottom: 5, borderRadius: 10, }}>
                          <AntDesign name={'form'} color={'#05375a'} size={25} />
                          <Text style={{ fontSize: 15, justifyContent: 'center', alignItems: 'center', color: '#000', marginTop: 5, }}> {'Purchasing Info'} </Text>
                          <Text style={{ fontSize: 15, justifyContent: 'center', alignItems: 'center', color: '#000', }}> {PurchasingInfo_Count} </Text>
                        </View>
                      </Pressable>

                      <Pressable
                        style={{ display: SubWorkorder_Visible ? 'flex' : 'none', }} 
                        onPress={cv_sub_wo}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', marginLeft: 10, marginRight: 10, marginTop: 5, marginBottom: 10, borderRadius: 10, }}>
                          <AntDesign name={'switcher'} color={'#05375a'} size={25} />
                          <Text style={{ fontSize: 15, justifyContent: 'center', alignItems: 'center', color: '#000', marginTop: 5, }}> {'Sub Work Order'} </Text>
                          <Text style={{ fontSize: 15, justifyContent: 'center', alignItems: 'center', color: '#000', }}> {''} </Text>
                        </View>
                      </Pressable>

                      <Pressable
                        style={{display: Comments_Visible ? 'flex' : 'none'}}
                        onPress={cv_chat_wo}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', marginLeft: 10, marginRight: 10, marginTop: 5, marginBottom: 10, borderRadius: 10, }}>
                          <AntDesign name={'form'} color={'#05375a'} size={25} />
                          <Text style={{ fontSize: 15, justifyContent: 'center', alignItems: 'center', color: '#000', marginTop: 5, }}> {'Comments'} </Text>
                          <Text style={{ fontSize: 15, justifyContent: 'center', alignItems: 'center', color: '#000', }}> {''} </Text>
                        </View>
                      </Pressable>
                    </View>
                  </Att_Modal>
                </View> */}
                </Pressable>
              </View>
            }
            numColumns={2}
            data={Attachments_List}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={Attachments_onItem}
            renderItem={Attachments_ItemView}
          />
        </View>

        <View style={styles.bottomView}>
          <TouchableOpacity
            style={{ width: '100%', height: 80, backgroundColor: SubmitButtonColor, marginRight: 5, alignItems: 'center', justifyContent: 'center', }}
            onPress={get_button}>
            <View
              style={{ flexDirection: 'row', flex: 1, alignItems: 'center', marginBottom: 15, }}>
              <AntDesign color={'#FFFF'} name={'Safety'} size={25} />
              <Text style={{ color: 'white', fontSize: 16, marginLeft: 8, fontWeight: 'bold', }}> {SubmitButton.toUpperCase()} </Text>
            </View>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={{ width: '45%', height: 80, backgroundColor: '#0096FF', alignItems: 'center', justifyContent: 'center', }} >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15, marginRight: 20, }}>
              <AntDesign color={'#FFFF'} name={'ellipsis1'} size={26} />
              <Text style={{ color: 'white', fontSize: 16, marginLeft: 8, marginRight: 5, fontWeight: 'bold', }}> {'more'.toUpperCase()} </Text>
            </View>
          </TouchableOpacity> */}
        </View>
      </SafeAreaProvider>
    </DismissKeyboard>
  );
};

const {width} = Dimensions.get('window');

const IMAGE_WIDTH = (width - 50) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  card: {
    backgroundColor: '#FFFFFF',
    margin: 10,
    paddingBottom: 20,
    borderRadius: 10,
  },

  card_heard: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#0096FF',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },

  card_heard_text: {
    fontSize: 15,
    justifyContent: 'center',
    color: '#ffffffff',
    fontWeight: 'bold',
  },

  view_style: {
    flex: 1,
    marginTop: 12,
    marginLeft: 10,
    marginRight: 10,
  },

  bottomView: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },

  centeredView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightgrey',
  },
  bottomModalView: {
    margin: 0,
  },

  buttonDelete: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    position: 'absolute',
    alignItems: 'center',
    top: 8,
    right: 5,
    backgroundColor: '#ffffff92',
    borderRadius: 4,
  },

  modal2: {
    height: '100%',
    borderStyle: 'solid',
    backgroundColor: '#e7e7e7',
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
    paddingHorizontal: 5,
    marginLeft: -4,
  },
  placeholderStyle: {fontSize: 15},

  placeholderStyle_text: {fontSize: 15},
  textErrorStyle: {fontSize: 16},

  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 5,
    top: -10,
    zIndex: 999,
    color: '#0096FF',
    paddingHorizontal: 8,
    fontSize: 13,
  },

  selectedTextStyle: {
    fontSize: 15,
  },
  iconStyle: {
    width: 25,
    height: 25,
  },
  inputSearchStyle: {
    height: 50,
    fontSize: 15,
    color: '#000',
  },

  model_cardview: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  model2_cardview: {
    flex: 1,
    marginTop: 50,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  dropdown_style: {
    margin: 10,
  },
  item: {
    margin: 10,
    borderRadius: 10,
  },

  centeredView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightgrey',
  },


  playercontainer: {
    backgroundColor: '#000',
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'space-between',
  },
  
  playervideo: {
      overflow: 'hidden',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
  },
});

export default SubWorkOrder