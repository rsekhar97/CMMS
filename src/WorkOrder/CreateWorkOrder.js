
import React,{Fragment} from 'react'
import { View, StyleSheet, Text, Image, Dimensions, TouchableOpacity, Alert, Pressable, FlatList, Modal, SafeAreaView, ScrollView, RefreshControl, TouchableWithoutFeedback, Keyboard, } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import ProgressLoader from 'rn-progress-loader';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
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
import { differenceInDays } from 'date-fns';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {ImageBackground} from 'react-native';
import StepIndicator from 'react-native-step-indicator';

var db = openDatabase({name: 'CMMS.db'});

const deviceWidth = Dimensions.get('screen').width;
const deviceHeight = Dimensions.get('screen').height;

const DismissKeyboard = ({children}) => (

  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

let Baseurl, Site_cd, LoginID, EmpName, EmpID, EmpPhone, EmpWorkGrp, dvc_id, OrgPriority, dft_mst_wko_asset_no, WIFI, mst_RowID, Local_ID, Selected_WorkOrder_no;


const CreateWorkOrder = ({route, navigation}) => { 


  const _goBack = () => {
    console.log('Screenname', route.params.Screenname);
  
    if (route.params.Screenname == 'CreateWorkOrder') {
      navigation.navigate('MainTabScreen');
    } else if (route.params.Screenname == 'FilteringWorkOrder') {
      navigation.navigate('WorkOrderListing', {
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
    } else if ( route.params.Screenname == 'MyWorkOrder' || route.params.Screenname == 'MYWO_Dashboard_Due' || route.params.Screenname == 'MYWO_Dashboard_Past' ) {
      navigation.navigate('WorkOrderListing', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,
  
        local_id: route.params.local_id,
        Selected_wko_mst_ast_cod: route.params.Selected_wko_mst_ast_cod,
        Selected_wko_mst_type: route.params.Selected_wko_mst_type,
        Screenname: route.params.Screenname,
      });
    } else if (route.params.Screenname == 'WoDashboard' || route.params.Screenname == 'MYWO_Dashboard_Due' || route.params.Screenname == 'MYWO_Dashboard_Past') {
      navigation.navigate('WorkOrderListing', {
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
        navigation.navigate('ScanAssetMaster', {
          Screenname: route.params.Screenname,
          ScanAssetType: route.params.ScanAssetType,
          ScanAssetRowID: route.params.ScanAssetRowID,
          ScanAssetno: route.params.ScanAssetno,
        });
      } else if (route.params.ScanAssetType == 'Edit') {
        navigation.navigate('WorkOrderListing', {
          Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
          RowID: route.params.RowID,
  
          Screenname: route.params.Screenname,
          ScanAssetType: route.params.ScanAssetType,
          ScanAssetno: route.params.ScanAssetno,
          ScanAssetRowID: route.params.ScanAssetRowID,
        });
      }
    } else if (route.params.Screenname == 'AssetListing') {
      navigation.navigate('WorkOrderListing', {
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
  
    return true;
  };


 

  const [isVisible, setVisible] = React.useState(false);
  const [Toolbartext, setToolbartext] = React.useState('');
  const [spinner, setspinner] = React.useState(false);
  const [Editable, setEditable] = React.useState(false);

   const [call, setcall] = React.useState('');

  const [height, setHeight] = React.useState({

    height_asset_desc:50,
    height_asset_groupcd:50,
    height_asset_loc:50,
    height_asset_level:50,
    height_cost_center:50,
    height_worktype:50,
    height_faultcd:50,
    height_wko_dsec:50,
    height_wko_status:50,
    height_assignto:50,
    height_assignto_desc:50,
    height_LA:50,
    height_MA:50,
    height_CA:50,
   

  });


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

  const [wko_mst_data, setwko_mst_data] = React.useState({

    RowID:'',
    wko_mst_originator: '',
    wko_mst_phone: '',

    wko_mst_assetno: '',
    wko_mst_pm_grp: '',
    wko_mst_type: '',

    ast_mst_asset_shortdesc: '',
    wko_mst_asset_group_code: '',
    wko_mst_work_area: '',
    wko_mst_asset_location: '',
    wko_mst_asset_level: '',
    wko_mst_chg_costcenter: '',
    ast_mst_asset_code:'',
    ast_mst_perm_id:'',
    ast_det_cus_code:'',
    ast_mst_asset_status:'',


    wko_mst_wo_no: '',
    wko_mst_orig_priority: '',
    wko_mst_orig_count: '',
    wko_mst_orig_date: '',
    wko_mst_orig_time: '',
    wko_mst_plan_priority: '',
    wko_mst_plan_count: '',
    wko_mst_due_date: '',
    wko_mst_due_time:  '',
    wko_det_work_type: '',
    wko_mst_flt_code: '',
    wko_mst_descs:'',
    wko_mst_status: '',
    wko_det_assign_to: '',
    wko_det_assign_date:'',
    wko_det_perassign_to: '',
    wko_det_assign_reason: '',
    wko_det_laccount: '',
    wko_det_caccount: '',
    wko_det_maccount: '',
    wrk_sts_typ_cd: '',

    response:'',
    chargeable:'',
    acknowledgement:'',
    completion:'',
    contractservices:'',
    materialrequest:'',
    timecard:'',
    checkListcount:'',
    assetdowntime:'',
    purchasinginfo:'',
    subworkorder:'',
    wko_ref_cnt:''
    
  });

  //Insight
  const [Insing_Visible, setInsing_Visible] = React.useState(false);
  const [Insing_list, setInsing_list] = React.useState([]);

  const [WorkOrderNo_AutoNo, setWorkOrderNo_AutoNo] = React.useState('');
  const [WorkOrderNo_editable, setWorkOrderNo_editable] = React.useState(false);
  const [WorkOrderNoValid, setWorkOrderNoValid] = React.useState(true);
  const [AssetNo_Visible, setAssetNo_Visible] = React.useState(false);
  const [Insight_Visible, setInsight_Visible] = React.useState(false);

  const [PMGroup_Visible, setPMGroup_Visible] = React.useState(false);
  const [Assigndata, setAssigndata] = React.useState([]);
  const [AssigToReason_Visible, setAssigToReason_Visible] = React.useState(false);
  const [AssigToReason_Valid, setAssigToReason_Valid] = React.useState(false);
  const [Assigtohistory_Visible, setAssigtohistory_Visible] = React.useState(false);

  //AssignModal
  const [AssignHistory_modalVisible, setAssignHistory_modalVisible] = React.useState(false);
  const [AssignHistory_data, setAssignHistory_data] = React.useState([]);
  const [AssignHistorystep, setAssignHistorystep] = React.useState(0);
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

  const [Asset_modalVisible, setAsset_modalVisible] = React.useState(false);
  const [AssetList_modalVisible, setAssetList_modalVisible] = React.useState(false);
  const [AssetList_data, setAssetList_data] = React.useState([]);
  const [AssetList_FilteredData, setAssetList_FilteredData] = React.useState([]);
  const [AssetList_search, setAssetList_search] = React.useState('');

  const [ast_mst_data, setast_mst_data] = React.useState({

    ast_mst_asset_no:'',
    ast_mst_asset_desc:'',
    ast_mst_asset_from:'',
    ast_mst_asset_to:'',
    ast_mst_asset_type:'',
    ast_mst_asset_group_code:'',
    ast_mst_asset_code:'',
    ast_mst_asset_loc:'',
    ast_mst_asset_level:'',
    ast_mst_asset_workarea:''

  })


  //DropDown Modal
  const [textvalue, settextvalue] = React.useState('');
  const [Boxtextvalue, setBoxtextvalue] = React.useState('');
  const [Dropdown_data, setDropdown_data] = React.useState([]);
  const [DropDownFilteredData, setDropDownFilteredData] = React.useState([]);
  const [DropDown_modalVisible, setDropDown_modalVisible] = React.useState(false);
  const [DropDown_search, setDropDown_search] = React.useState('');
  const [refreshing, setRefreshing] = React.useState(false);

  //More Options
  const [isMoreVisible, setMoreVisible] = React.useState(false);

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

  const [wko_mst_more, setwko_mst_more] = React.useState({

    response:'',
    chargeable:'',
    acknowledgement:'',
    completion:'',
    contractservices:'',
    materialrequest:'',
    timecard:'',
    checkListcount:'',
    assetdowntime:'',
    purchasinginfo:'',
    subworkorder:''

  })

  const [Response_color, setResponse_color] = React.useState('');
  const [Chargeable_color, setChargeable_color] = React.useState('');
  const [Acknowledgement_color, setAcknowledgement_color] = React.useState('');
  const [WOCompletion_color, setWOCompletion_color] = React.useState('');
  const [CheckList_Count, setCheckList_Count] = React.useState('');
  const [TimaeCard_Count, setTimaeCard_Count] = React.useState('');
  const [AssetDowntime_Count, setAssetDowntime_Count] = React.useState('');

  const [isDatepickerVisible, setDatePickerVisibility] = React.useState(false);
  const [isTimepickerVisible, setTimePickerVisibility] = React.useState(false);

  const [SubmitButton, setSubmitButton] = React.useState('');
  const [SubmitButtonColor, setSubmitButtonColor] = React.useState('#0096FF');
  const [Type, setType] = React.useState('');

  //Alert
  const [Show, setShow] = React.useState(false);
  const [Show_two, setShow_two] = React.useState(false);
  const [Theme, setTheme] = React.useState('');
  const [Title, setTitle] = React.useState('');
  const [AlertType, setAlertType] = React.useState('');
  const [Alert_WOK, setAlert_WOK] = React.useState('');
  const [Alert_RowID, setAlert_RowID] = React.useState('');
  const [ImgValue, setImgValue] = React.useState([]);

  const starttime = Date.now();


  //QR CODE
  const [showqrcode, setshowqrcode] = React.useState(false);
  const [scan, setscan] = React.useState(false);
  const [ScanResult, setScanResult] = React.useState(false);
  const [result, setresult] = React.useState(null);
  const [TabVisible, setTabVisible] = React.useState(false);


  const stepIndicatorStyles = {
    stepIndicatorSize: 30,
    currentStepIndicatorSize: 40,
    separatorStrokeWidth: 3,
    currentStepStrokeWidth: 5,
    stepStrokeCurrentColor: '#fe7013',
    separatorFinishedColor: '#fe7013',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: '#fe7013',
    stepIndicatorUnFinishedColor: '#aaaaaa',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 15,
    currentStepIndicatorLabelFontSize: 15,
    stepIndicatorLabelCurrentColor: '#000000',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: 'rgba(255,255,255,0.5)',
    labelColor: '#666666',
    labelSize: 15,
    currentStepLabelColor: '#fe7013',
  };

  const labels = ["Admin","Demo","Sekhar Test","Demo","Admin","Sekhar"];

  React.useEffect(() => {
    const focusHander = navigation.addListener('focus', () => {

      fetchData();
      
    });
    return focusHander;
  }, [navigation]);

  const fetchData = async () => {

    setspinner(true);

   

    dvc_id = DeviceInfo.getDeviceId();

    Baseurl = await AsyncStorage.getItem('BaseURL');
    Site_cd = await AsyncStorage.getItem('Site_Cd');
    LoginID = await AsyncStorage.getItem('emp_mst_login_id');
    EmpName = await AsyncStorage.getItem('emp_mst_name');
    EmpID = await AsyncStorage.getItem('emp_mst_empl_id');
    EmpPhone = await AsyncStorage.getItem('emp_mst_homephone');
    EmpWorkGrp = await AsyncStorage.getItem('emp_det_work_grp');
    OrgPriority = await AsyncStorage.getItem('dft_mst_wko_pri');
    dft_mst_wko_asset_no = await AsyncStorage.getItem('dft_mst_wko_asset_no');
    WIFI = await AsyncStorage.getItem('WIFI');

    mst_RowID = route.params.RowID;
    Local_ID = route.params.local_id;
    Selected_WorkOrder_no = route.params.Selected_WorkOrder_no;

    console.log('mst_RowID: ' + mst_RowID);
    console.log('Local_ID: ' + Local_ID);
    console.log('Selected_WorkOrder_no: ' + Selected_WorkOrder_no);

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

      if (WIFI == 'OFFLINE') {

        //assign_employee
        txn.executeSql( 'SELECT * FROM assign_employee', [], (tx, { rows }) => {   setAssignTo(rows.raw()) });

        txn.executeSql( 'SELECT * FROM ast_mst', [], (tx, { rows }) => {   setAssetList_data(rows.raw()), setAssetList_FilteredData(rows.raw()) });
        
        setResponse_Visible(true);
        setAcknowledgement_Visible(true);
        setWOCompletion_Visible(true);
        setCheckList_Visible(true);
        setTimaeCard_Visible(true);
        setAssetDowntime_Visible(true);

        if (!mst_RowID) {
          
          txn.executeSql( 'SELECT * FROM wko_det_response where local_id=?', [Local_ID],
            (tx, results) => {
             // console.log( 'wko_det_response Local ID :' + JSON.stringify(results));

              for (let i = 0; i < results.rows.length; ++i) {
                //console.log( 'wko_det_response:' + JSON.stringify(results.rows.item(i)), );
                //console.log( 'wko_det_response 123:' + JSON.stringify(results.rows.item(i).wko_det_tech_resp_date));

                if (results.rows.item(i).wko_det_tech_resp_date === null) {
                  setResponse_color('#FF5733')
                  
                } else {
                  let tech_Resp_Date = moment( results.rows.item(i).wko_det_tech_resp_date, ).format('YYYY-MM-DD HH:mm');

                  if (tech_Resp_Date === '1900-01-01 00:00') {
                    setResponse_color('#FF5733')
                    
                  } else {
                    setResponse_color('#5EFF33')
                    
                  }
                }
              }
            },
          );

          txn.executeSql( 'SELECT * FROM wko_det_ackowledgement where local_id=?',
            [route.params.local_id],
            (tx, results) => {
              if (results.rows.length > 0) {
                //console.log("wko_det_ackowledgement Local_id:"+JSON.stringify(results))

                for (let i = 0; i < results.rows.length; ++i) {
                  if (!results.rows.item(i).wko_det_ack_name) {
                    setAcknowledgement_color('#FF5733')
                    
                  } else {
                    setAcknowledgement_color('#5EFF33')
                   
                  }
                }
              }
            },
          );

          txn.executeSql( 'SELECT COALESCE(SUM(total), 0) AS total , COALESCE(SUM(done), 0) AS done FROM wko_isp_heard where local_id=?',
            [route.params.local_id],
            (tx, results) => {
              //console.log( 'wko_isp_heard:' + JSON.stringify(results.rows.length));
              const { total, done } = results.rows.item(0);
              console.log('Total: ' + total);
              console.log('Done: ' + done);
             
              setCheckList_Count(done+'/'+total)
            },
          );

          txn.executeSql( 'SELECT * FROM wko_ls8_timecard where local_id=?',
            [route.params.local_id],
            (tx, results) => {
              //console.log( 'wko_ls8_timecard:' + JSON.stringify(results.rows.length));
             
              setTimaeCard_Count(results.rows.length.toString())
            },
          );

          txn.executeSql( 'SELECT * FROM ast_dwntime where ast_dwntime_down_wo=?',
            [route.params.Selected_WorkOrder_no],
            (tx, results) => {
              //console.log('ast_dwntime:' + JSON.stringify(results.rows.length));
              setAssetDowntime_Count(results.rows.length.toString())
             
            },
          );

         
        } else {

          txn.executeSql( 'SELECT * FROM wko_det_response where mst_RowID=?',
            [mst_RowID],
            (tx, results) => {
              

              for (let i = 0; i < results.rows.length; ++i) {
                //console.log( 'wko_det_response:' + JSON.stringify(results.rows.item(i)), );
                //console.log( 'wko_det_response 123:' + JSON.stringify(results.rows.item(i).wko_det_tech_resp_date));

                if (results.rows.item(i).wko_det_tech_resp_date === null) {
                  setResponse_color('#FF5733')
                  
                } else {
                  let tech_Resp_Date = moment( results.rows.item(i).wko_det_tech_resp_date, ).format('YYYY-MM-DD HH:mm');

                  if (tech_Resp_Date === '1900-01-01 00:00') {
                    setResponse_color('#FF5733')
                    
                  } else {
                    setResponse_color('#5EFF33')
                    
                  }
                }
              }
            },
          );

          txn.executeSql( 'SELECT * FROM wko_det_ackowledgement where mst_RowID=?',
            [route.params.RowID],
            (tx, results) => {
              //console.log( 'wko_det_ackowledgement mst_RowID: ' + JSON.stringify(results));

              for (let i = 0; i < results.rows.length; ++i) {
                if (!results.rows.item(i).wko_det_ack_name) {
                  setAcknowledgement_color('#FF5733')
                  
                } else {
                  setAcknowledgement_color('#5EFF33')
                 
                }
              }
            },
          );

          txn.executeSql( 'SELECT COALESCE(SUM(total), 0) AS total , COALESCE(SUM(done), 0) AS done FROM wko_isp_heard where mst_RowID=?',
            [route.params.RowID],
            (tx, results) => {
              const { total, done } = results.rows.item(0);
              console.log('Total: ' + total);
              console.log('Done: ' + done);
              if(!total){
                console.log('if: ' + total);
              }else{
                console.log('else: ' + total);
              }
              setCheckList_Count(done+'/'+total)
            },
          );

          txn.executeSql( 'SELECT * FROM wko_ls8_timecard where mst_RowID=?',
            [route.params.RowID],
            (tx, results) => {
              //console.log( 'wko_ls8_timecard:' + JSON.stringify(results.rows.length), );
              setTimaeCard_Count(results.rows.length.toString())
            },
          );

          txn.executeSql( 'SELECT * FROM ast_dwntime where ast_dwntime_down_wo=?',
            [route.params.Selected_WorkOrder_no],
            (tx, results) => {
              //console.log('ast_dwntime:' + JSON.stringify(results.rows.length));
              setAssetDowntime_Count(results.rows.length.toString())
            },
          );

         
        }
      } else {
        //More List
        txn.executeSql( `SELECT * FROM cf_menu where column1='Work Order' and mobile_object_type='O'`, [],
          (tx, results) => {
            if (results.rows.length > 0) {
             

              console.log('ASSET',WIFI)

              for (let i = 0; i < results.rows.length; ++i) {
               // console.log( 'ASSET' + JSON.stringify(results.rows.item(i)),);

                if (results.rows.item(i).object_name == 'o_wo_verify_asset') {
                  if (results.rows.item(i).exe_flag == '1') {

                   // console.log('o_wo_verify_asset','1')
                    setResponse_Visible(true);
                  }

                  if (results.rows.item(i).new_flag == '1') {
                  }

                  if (results.rows.item(i).edit_flag == '1') {
                  }
                }

                if (results.rows.item(i).object_name == 'o_wo_chargeable') {
                  if (results.rows.item(i).exe_flag == '1') {
                    //console.log('o_wo_chargeable','1')
                    setChargeable_Visible(true);
                  }

                  if (results.rows.item(i).new_flag == '1') {
                  }

                  if (results.rows.item(i).edit_flag == '1') {
                  }
                }

                if ( results.rows.item(i).object_name == 'o_wo_acknowledgement' ) {
                  if (results.rows.item(i).exe_flag == '1') {
                    //console.log('o_wo_acknowledgement','1')
                    setAcknowledgement_Visible(true);
                  }

                  if (results.rows.item(i).new_flag == '1') {
                  }

                  if (results.rows.item(i).edit_flag == '1') {
                  }
                }

                if (results.rows.item(i).object_name == 'o_wo_completion') {
                  if (results.rows.item(i).exe_flag == '1') {
                    //console.log('o_wo_completion','1')
                    setWOCompletion_Visible(true);
                  }

                  if (results.rows.item(i).new_flag == '1') {
                  }

                  if (results.rows.item(i).edit_flag == '1') {
                  }
                }

                if ( results.rows.item(i).object_name == 'o_wo_contract_request' ) {
                  if (results.rows.item(i).exe_flag == '1') {
                    //console.log('o_wo_contract_request','1')
                    setContractServices_Visible(true);
                  }

                  if (results.rows.item(i).new_flag == '1') {
                  }

                  if (results.rows.item(i).edit_flag == '1') {
                  }
                }

                if ( results.rows.item(i).object_name == 'o_wo_material_request' ) {
                  if (results.rows.item(i).exe_flag == '1') {
                    //console.log('o_wo_material_request','1')
                    setMaterialRequest_Visible(true);
                  }

                  if (results.rows.item(i).new_flag == '1') {
                  }

                  if (results.rows.item(i).edit_flag == '1') {
                  }
                }

                if (results.rows.item(i).object_name == 'o_wo_checklist') {
                  if (results.rows.item(i).exe_flag == '1') {
                   // console.log('o_wo_checklist','1')
                    setCheckList_Visible(true);
                  }

                  if (results.rows.item(i).new_flag == '1') {
                  }

                  if (results.rows.item(i).edit_flag == '1') {
                  }
                }

                if (results.rows.item(i).object_name == 'o_wo_timecard') {
                  if (results.rows.item(i).exe_flag == '1') {
                    //console.log('o_wo_timecard','1')
                    setTimaeCard_Visible(true);
                  }

                  if (results.rows.item(i).new_flag == '1') {
                  }

                  if (results.rows.item(i).edit_flag == '1') {
                  }
                }

                if (results.rows.item(i).object_name == 'o_wo_downtime') {
                  if (results.rows.item(i).exe_flag == '1') {
                    //console.log('o_wo_downtime','1')
                    setAssetDowntime_Visible(true);
                  }

                  if (results.rows.item(i).new_flag == '1') {
                  }

                  if (results.rows.item(i).edit_flag == '1') {
                  }
                }

                if ( results.rows.item(i).object_name == 'o_wo_purchasing_info' ) {
                  if (results.rows.item(i).exe_flag == '1') {
                    //console.log('o_wo_purchasing_info','1')
                    setPurchasingInfo_Visible(true);
                  }

                  if (results.rows.item(i).new_flag == '1') {
                  }

                  if (results.rows.item(i).edit_flag == '1') {
                  }
                }

                if (results.rows.item(i).object_name == 'o_wo_sub_wo') {
                  if (results.rows.item(i).exe_flag == '1') {
                    //console.log('o_wo_sub_wo','1')
                    setSubWorkorder_Visible(true);
                  }

                  if (results.rows.item(i).new_flag == '1') {
                  }

                  if (results.rows.item(i).edit_flag == '1') {
                  }
                }

                if (results.rows.item(i).object_name == 'o_wo_comments') {
                  if (results.rows.item(i).exe_flag == '1') {
                    //console.log('o_wo_comments','1')
                    setComments_Visible(true);
                  }

                  if (results.rows.item(i).new_flag == '1') {
                  }

                  if (results.rows.item(i).edit_flag == '1') {
                  }
                }
              }
            }
          },
        );
      }

    });


    if (route.params.Screenname == 'CreateWorkOrder') {

      setToolbartext('Create Work Order');
      setSubmitButton('Save');
      setSubmitButtonColor('#8BC34A');

      setAssetNo_Visible(true);
      setPMGroup_Visible(false);
      setAssigtohistory_Visible(false);

     

      if (WIFI == 'OFFLINE') {
        db.transaction(function (txn) {
          //priority
          txn.executeSql( 'SELECT * FROM ast_mst order by ast_mst_asset_no asc', [],
            (tx, results) => {
              var ast_mst_temp = [];
              console.log('ast_mst:' + JSON.stringify(results));
              for (let i = 0; i < results.rows.length; ++i) {
                ast_mst_temp.push(results.rows.item(i));
              }
              setAssetList_data(ast_mst_temp);
              setAssetList_FilteredData(ast_mst_temp);
            },
          );
        });
      }

      var sync_date = moment().format('yyyy-MM-DD');
      var sync_time = format(new Date(), 'HH:mm');

      setwko_mst_data({...wko_mst_data,
      
        wko_mst_originator: EmpID + ' : ' + EmpName,
        wko_mst_phone: EmpPhone,
        wko_mst_orig_date: sync_date,
        wko_mst_due_date: sync_date,
        wko_mst_orig_time: sync_time,
        wko_mst_due_time: sync_time,

      })
      console.log('Asset OrgPriority Data: ',  OrgPriority);


      if (OrgPriority === '' || OrgPriority === null) {
        setspinner(false);
      } else {
        const split_OrgPriority1 = OrgPriority.split('-');
        setwko_mst_data({...wko_mst_data, 

          wko_mst_originator: EmpID + ' : ' + EmpName,
          wko_mst_phone: EmpPhone,
          wko_mst_orig_date: sync_date,
          wko_mst_due_date: sync_date,
          wko_mst_orig_time: sync_time,
          wko_mst_due_time: sync_time,
          wko_mst_orig_priority: split_OrgPriority1[0] })
        setspinner(false);
      }

      
      
    } else if ( route.params.Screenname == 'FilteringWorkOrder' || route.params.Screenname == 'MyWorkOrder' || route.params.Screenname == 'WoDashboard' || route.params.Screenname == 'AssetListing' || route.params.Screenname == 'MYWO_Dashboard_Due' || route.params.Screenname == 'MYWO_Dashboard_Past' ) {
      setToolbartext('Edit Work Order');
      setSubmitButton('Edit');
      setSubmitButtonColor('#0096FF');
      setEditable(true);

      setAssigtohistory_Visible(true);

      if (WIFI == 'OFFLINE') {
       
        get_workorder_list_offline();

      }else{

        setInsight_Visible(true)
        //setspinner(false);
        get_workorder_list(route.params.Selected_WorkOrder_no, route.params.RowID)

      }

      
      
    } else if (route.params.Screenname == 'ScanAssetMaster') {

      if (route.params.ScanAssetType == 'New') {

        setToolbartext('Create Work Order');
        setSubmitButton('Save');
        setSubmitButtonColor('#8BC34A');

        setAssetNo_Visible(true);
        setPMGroup_Visible(false);
        setAssigtohistory_Visible(false);

        var sync_date = moment().format('yyyy-MM-DD');
        var sync_time = format(new Date(), 'HH:mm');

        let org = ''
        if (OrgPriority === '' || OrgPriority === null) {
          setspinner(false);
          org = ''
        } else {
          const split_OrgPriority1 = OrgPriority.split('-');
          org = split_OrgPriority1[0]
          setspinner(false);
        } 

        let Asset_retrieve = {
          site_cd: Site_cd,
          ast_mst_asset_no: route.params.ScanAssetno,
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
          console.log('Asset Master Response : ' + response.data.status);

          if (response.data.status === 'SUCCESS') {
            if (response.data.data.length > 0) {
              //console.log(response.data.status)
              //console.log(response.data.message)
              //console.log(response.data.data)
              for (let i = 0; i < response.data.data.length; ++i) {
                // setAssetNo(response.data.data[i].ast_mst_asset_no);
                // setAssetDescription( response.data.data[i].ast_mst_asset_shortdesc, );
                // setAssetGroupCode_key( response.data.data[i].ast_mst_asset_group, );
                // setWorkArea_key(response.data.data[i].mst_war_work_area);
                // setAssetLocation_key(response.data.data[i].ast_mst_asset_locn);
                // setAssetLevel_key(response.data.data[i].ast_mst_asset_lvl);
                // setCostCenter_key(response.data.data[i].ast_mst_cost_center);

                // setAssetCode_key(response.data.data[i].ast_mst_asset_code);
                // setPermID_key(response.data.data[i].ast_mst_perm_id);
                // setAssetCusCode_key(response.data.data[i].ast_det_cus_code);
                // setAssetStatus_key(response.data.data[i].ast_mst_asset_status);

                setwko_mst_data({...wko_mst_data,

                  wko_mst_originator: EmpID + ' : ' + EmpName,
                  wko_mst_phone: EmpPhone,
                  wko_mst_orig_priority: org,
                  wko_mst_orig_date: sync_date,
                  wko_mst_due_date: sync_date,
                  wko_mst_orig_time: sync_time,
                  wko_mst_due_time: sync_time,

                  wko_mst_assetno: response.data.data[i].ast_mst_asset_no,
                  ast_mst_asset_shortdesc: response.data.data[i].ast_mst_asset_shortdesc,
                  wko_mst_asset_group_code: response.data.data[i].ast_mst_asset_grpcode,
                  wko_mst_work_area: response.data.data[i].mst_war_work_area,
                  wko_mst_asset_location: response.data.data[i].ast_mst_asset_locn,
                  wko_mst_asset_level: response.data.data[i].ast_mst_asset_lvl,
                  wko_mst_chg_costcenter: response.data.data[i].ast_mst_cost_center,
            
                  ast_mst_asset_code: response.data.data[i].ast_mst_asset_code,
                  ast_mst_perm_id: response.data.data[i].ast_mst_perm_id,
                  ast_det_cus_code: response.data.data[i].ast_det_cus_code,
                  ast_mst_asset_status: response.data.data[i].ast_mst_asset_status,
            
                })

                setspinner(false);
              }
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
          Alert.alert(
          'Error',
          error.message,
          [
            { text: 'OK' }
          ],
          { cancelable: false }
        );
        }

      } else if (route.params.ScanAssetType == 'Edit') {

        setToolbartext('Edit Work Order');
        setSubmitButton('Edit');
        setSubmitButtonColor('#0096FF');
        setEditable(true);

        setAssigtohistory_Visible(true);

        if (WIFI == 'OFFLINE') {
       
          get_workorder_list_offline();
  
        }else{
  
          get_workorder_list(route.params.Selected_WorkOrder_no, route.params.RowID)
  
        }
      }
    }


  }


  
  // GET WORK ORDER LIST API
  const get_workorder_list_offline = async () => {

    db.transaction(function (txn) {

      txn.executeSql( 'SELECT * FROM wko_mst where ID=?', [route.params.local_id],
        (tx, results) => {

          for (let i = 0; i < results.rows.length; i++) {
            

            setwko_mst_data({
              ...wko_mst_data,
              RowID: results.rows.item(i).RowID,
              wko_mst_originator: results.rows.item(i).wko_mst_originator,
              wko_mst_phone: results.rows.item(i).wko_mst_phone,
  
              wko_mst_assetno: results.rows.item(i).wko_mst_assetno,
              wko_mst_pm_grp: results.rows.item(i).wko_mst_pm_grp,
              wko_mst_type: results.rows.item(i).wko_mst_type,
  
              ast_mst_asset_shortdesc: results.rows.item(i).ast_mst_asset_shortdesc,
              wko_mst_asset_group_code: results.rows.item(i).ast_mst_asset_group,
              wko_mst_work_area: results.rows.item(i).wko_mst_work_area,
              wko_mst_asset_location: results.rows.item(i).wko_mst_asset_location,
              wko_mst_asset_level: results.rows.item(i).wko_mst_asset_level,
              wko_mst_chg_costcenter: results.rows.item(i).wko_mst_chg_costcenter,
  
              wko_mst_wo_no: results.rows.item(i).wko_mst_wo_no,
              wko_mst_orig_priority: results.rows.item(i).wko_mst_orig_priority,
              wko_mst_orig_date: moment(results.rows.item(i).wko_mst_org_date).format('yyyy-MM-DD'),
              wko_mst_orig_time: moment(results.rows.item(i).wko_mst_org_date).format('HH:mm'),
              wko_mst_plan_priority: results.rows.item(i).wko_mst_plan_priority,
              wko_mst_due_date:  moment(results.rows.item(i).wko_mst_due_date).format('yyyy-MM-DD'),
              wko_mst_due_time:  moment(results.rows.item(i).wko_mst_due_date).format('HH:mm'),
              wko_det_work_type: results.rows.item(i).wko_det_work_type,
              wko_mst_flt_code: results.rows.item(i).wko_mst_flt_code,
              wko_mst_descs: results.rows.item(i).wko_mst_descs,
              wko_mst_status: results.rows.item(i).wko_mst_status,
              wko_det_assign_to: results.rows.item(i).wko_det_assign_to,
              wko_det_perassign_to: results.rows.item(i).wko_det_assign_to,
              wko_det_assign_reason: '',
              wko_det_assign_date: moment(results.rows.item(i).assigndate).format('yyyy-MM-DD'),
              wko_det_laccount: results.rows.item(i).wko_det_laccount,
              wko_det_caccount: results.rows.item(i).wko_det_caccount,
              wko_det_maccount: results.rows.item(i).wko_det_maccount,
              wrk_sts_typ_cd: results.rows.item(i).wrk_sts_typ_cd,
  
             
              
            });
  
            
            if (results.rows.item(i).wko_mst_type == 'G' ) {
              setPMGroup_Visible(true);
              setAssetNo_Visible(false);
              
            } else {
              setAssetNo_Visible(true);
              setPMGroup_Visible(false);
             
            }

            if (results.rows.item(i).wrk_sts_typ_cd === 'CLOSE') {
              setSubmitButton('Work Order Closed');
              setSubmitButtonColor('#FF0000');
            } else if (results.rows.item(i).wrk_sts_typ_cd === 'COMPLETE') {
              setSubmitButton('Work Order Completed');
              setSubmitButtonColor('#0096FF');
            }

            setAssigToReason_Visible(false);
            setAssigToReason_Valid(false);
          } 
        })

        if (!mst_RowID) {
          txn.executeSql( `SELECT * FROM wko_ref where local_id=? and COALESCE(column2,'') <> 'SIGN' and COALESCE(column2,'') <> 'RESPONSE_SIGN' and COALESCE(column2,'') <> 'Checklist'`,
              [route.params.local_id],
              (tx, results) => {
                console.log('wko_ref if:' + JSON.stringify(results));

                if (results.rows.length > 0) {

                 

                  var path,type;
                  Attachments_List.length = 0;
                  images_list.length = 0;
                  images_link.length = 0;
                 
                  setAttachments_List([]);
                  setimages_list([])
                  setimages_link([])
                  for (let i = 0; i < results.rows.length; ++i) {
                  console.log( 'PATH 123' + JSON.stringify(results.rows.item(i)));

                    let key = Attachments_List.length + 1;
                    let localIdentifier = key;
                    let name = results.rows.item(i).file_name;
                    let rowid = results.rows.item(i).RowID;
                    //let type = results.rows.item(i).type;
                    let ID = results.rows.item(i).ID;
                    let imagetype = 'Exist';
                   
                    if (results.rows.item(i).ref_type === 'Gallery_image') {
                     
                      const lowerCaseFileName = results.rows.item(i).file_name.toLowerCase();
                      if (lowerCaseFileName.endsWith('.jpg') || lowerCaseFileName.endsWith('.jpeg')) {

                        type = 'image/jpg'
                        path = results.rows.item(i).Local_link;
                        images_list.unshift({ key, path, name, imagetype, localIdentifier, rowid, type, ID});
                        setimages_list(images_list.slice(0));

                        console.log('The file is a JPG image.');
                      } else if (lowerCaseFileName.endsWith('.mp4')) {
                        type = 'video/mp4'
                        path = results.rows.item(i).Local_link;
                       // console.log('The file is a PNG image.');
                      } else if (lowerCaseFileName.endsWith('.pdf')) {
                        type = 'application/pdf'
                        path = results.rows.item(i).Local_link;
                       // console.log('The file is not a JPG or PNG image.');
                      }

                    } else {
                      
                      const lowerCaseFileName = results.rows.item(i).file_name.toLowerCase();

                      if (lowerCaseFileName.endsWith('.jpg') || lowerCaseFileName.endsWith('.jpeg')) {

                        type = 'image/jpg'
                        path = 'file://' + results.rows.item(i).Local_link;
                        images_list.unshift({ key, path, name, imagetype, localIdentifier, rowid, type, ID});
                        setimages_list(images_list.slice(0));
                        //console.log('The file is a JPG image.');
                      } else if (lowerCaseFileName.endsWith('.mp4')) {
                        type = 'video/mp4'
                        path = 'file://' + results.rows.item(i).Local_link+'.mp4';
                        console.log('The file is a PNG image.');
                      } else if (lowerCaseFileName.endsWith('.pdf')) {
                        type = 'application/pdf'
                        path = 'file://' + results.rows.item(i).Local_link;
                        console.log('The file is not a JPG or PNG image.');
                      }
                      
                    }

                  

                    console.log("PATH"+ JSON.stringify(path));

                    Attachments_List.unshift({ key, path, name, imagetype, localIdentifier, rowid, type, ID });
                    setAttachments_List(Attachments_List.slice(0));
                    key++;
                  }

                  for (let i = 0; i < images_list.length; i++) {

                    let key = i + 1
                    setimages_link(images_link=>[...images_link,{ key:key,url:images_list[i].path,name:images_list[i].name,localIdentifier:images_list[i].localIdentifier}]);
        
                  }

                  setspinner(false);
                } else {
                  setspinner(false);
                }
              },
            );

        }else{

          txn.executeSql(
            `SELECT * FROM wko_ref where mst_RowID=? and COALESCE(column2,'') <> 'SIGN' and COALESCE(column2,'') <> 'RESPONSE_SIGN' and COALESCE(column2,'') <> 'Checklist'`,
            [route.params.RowID],
            (tx, results) => {
              console.log('wko_ref else:' + JSON.stringify(results));

              if (results.rows.length > 0) {
                var path,type;
                Attachments_List.length = 0;
                images_list.length = 0;
                images_link.length = 0;
               
                setAttachments_List([]);
                setimages_list([]);
                setimages_link([]);

                for (let i = 0; i < results.rows.length; ++i) {
                 console.log( 'PATH 123' + JSON.stringify(results.rows.item(i)));

                  let key = Attachments_List.length + 1;
                  let localIdentifier = key;
                  let name = results.rows.item(i).file_name;
                  let rowid = results.rows.item(i).RowID;
                  //let type = results.rows.item(i).type;
                  let ID = results.rows.item(i).ID;
                  let imagetype = 'Exist';
                 

                  if (results.rows.item(i).ref_type === 'Gallery_image') {
                   
                    const lowerCaseFileName = results.rows.item(i).file_name.toLowerCase();
                    if (lowerCaseFileName.endsWith('.jpg') || lowerCaseFileName.endsWith('.jpeg')) {

                      type = 'image/jpg'
                      path = results.rows.item(i).Local_link;
                      images_list.unshift({ key, path, name, imagetype, localIdentifier, rowid, type, ID});
                      setimages_list(images_list.slice(0));

                      console.log('The file is a JPG image.');
                    } else if (lowerCaseFileName.endsWith('.mp4')) {
                      type = 'video/mp4'
                      path = results.rows.item(i).Local_link;
                     console.log('The file is a PNG image.');
                    } else if (lowerCaseFileName.endsWith('.pdf')) {
                      type = 'application/pdf'
                      path = results.rows.item(i).Local_link;
                     console.log('The file is not a JPG or PNG image.');
                    }

                  } else {
                    
                    const lowerCaseFileName = results.rows.item(i).file_name.toLowerCase();

                    if (lowerCaseFileName.endsWith('.jpg') || lowerCaseFileName.endsWith('.jpeg')) {

                      type = 'image/jpg'
                      path = 'file://' + results.rows.item(i).Local_link;
                      images_list.unshift({ key, path, name, imagetype, localIdentifier, rowid, type, ID});
                      setimages_list(images_list.slice(0));
                      console.log('The file is a JPG image.');
                    } else if (lowerCaseFileName.endsWith('.mp4')) {
                      type = 'video/mp4'
                      path = 'file://' + results.rows.item(i).Local_link+'.mp4';
                      console.log('The file is a PNG image.');
                    } else if (lowerCaseFileName.endsWith('.pdf')) {
                      type = 'application/pdf'
                      path = 'file://' + results.rows.item(i).Local_link;
                      console.log('The file is not a JPG or PNG image.');
                    }
                    
                  }

          
                  

                  console.log("PATH"+ JSON.stringify(path));

                  Attachments_List.unshift({ key, path, name, imagetype, localIdentifier, rowid, type, ID });
                  setAttachments_List(Attachments_List.slice(0));
                  key++;
                }

                for (let i = 0; i < images_list.length; i++) {

                  let key = i + 1
                  setimages_link(images_link=>[...images_link,{ key:key,url:images_list[i].path,name:images_list[i].name,localIdentifier:images_list[i].localIdentifier}]);
      
                }
                setspinner(false);

              } else {
                setspinner(false);
              }
            },
          );

        }

    })

    

  }
  // GET WORK ORDER LIST API
  const get_workorder_list = async (workorderno, rowid) => {
    //console.log('WorkOrderNO' + workorderno);
    //console.log('RowID' + rowid);

    setspinner(true);

    let userStr = {
      site_cd: Site_cd,
      wrk_sts_typ_cd: '',
      wkr_mst_wr_no:'',
      wko_mst_wo_no: workorderno,
      wko_mst_assetno: '',
      wko_mst_descs: '',
      wko_mst_originator: '',
      wko_mst_status: '',
      wko_mst_work_area: '',
      wko_mst_type: '',
      wko_mst_asset_location: '',
      wko_mst_asset_level: '',
      wko_mst_org_date: '',
      wko_mst_due_date: '',
      asset_shortdesc: '',
      wko_det_assign_to: '',
      wko_det_work_type: '',
      wrk_sts_typ_cd: '',
      type: '',
      Dashoard_type: '',
      wko_det_supv_id:'',
      wko_mst_chg_costcenter:'',
      emp_det_work_grp: EmpWorkGrp,
      emp_id: EmpID,
    };

    console.log('get Work Order List: ' + JSON.stringify(userStr));
    
    try {
      const response = await axios.post( `${Baseurl}/get_workorderlist.php?`, JSON.stringify(userStr),
     { headers: { 'Content-Type': 'application/json'} });
      //console.log("JSON DATA : " + response.data.data)
      if (response.data.status === 'SUCCESS') {
        //console.log(response.data.status)
        //console.log(response.data.message)
        //console.log(JSON.stringify( response.data.data) )

        let wrk_count;
        response.data.data.forEach(item => {
          console.log('wrk',item.wko_ref_cnt.toString());

          wrk_count =item.wko_ref_cnt.toString();

          setwko_mst_data({
            ...wko_mst_data,
            RowID: item.RowID,
            wko_mst_originator: item.wko_mst_originator,
            wko_mst_phone: item.wko_mst_phone,

            wko_mst_assetno: item.wko_mst_assetno,
            wko_mst_pm_grp: item.wko_mst_pm_grp,
            wko_mst_type: item.wko_mst_type,

            ast_mst_asset_shortdesc: item.ast_mst_asset_shortdesc,
            wko_mst_asset_group_code: item.wko_mst_asset_group_code,
            wko_mst_work_area: item.wko_mst_work_area,
            wko_mst_asset_location: item.wko_mst_asset_location,
            wko_mst_asset_level: item.wko_mst_asset_level,
            wko_mst_chg_costcenter: item.wko_mst_chg_costcenter,

            wko_mst_wo_no: item.wko_mst_wo_no,
            wko_mst_orig_priority: item.wko_mst_orig_priority,
            wko_mst_orig_date: moment(item.wko_mst_org_date.date).format('yyyy-MM-DD'),
            wko_mst_orig_time: moment(item.wko_mst_org_date.date).format('HH:mm'),
            wko_mst_plan_priority: item.wko_mst_plan_priority,
            wko_mst_due_date:  moment(item.wko_mst_due_date.date).format('yyyy-MM-DD'),
            wko_mst_due_time:  moment(item.wko_mst_due_date.date).format('HH:mm'),
            wko_det_work_type: item.wko_det_work_type,
            wko_mst_flt_code: item.wko_mst_flt_code,
            wko_mst_descs: item.wko_mst_descs,
            wko_mst_status: item.wko_mst_status,
            wko_det_assign_to: item.wko_det_assign_to,
            wko_det_perassign_to: item.wko_det_assign_to,
            wko_det_assign_reason: '',
            wko_det_laccount: item.wko_det_laccount,
            wko_det_caccount: item.wko_det_caccount,
            wko_det_maccount: item.wko_det_maccount,
            wrk_sts_typ_cd: item.wrk_sts_typ_cd,

            response: item.wko_det_varchar9,
            chargeable: item.wko_det_safety,
            acknowledgement: item.wko_det_ack_name,
            completion: item.wko_det_COMPLETE,
            contractservices: item.ctc_cnt.toString(),
            materialrequest: item.mr_cnt.toString(),
            timecard: item.tc_cnt.toString(),
            checkListcount: item.cl_cnt.toString(),
            assetdowntime: item.dwn_cnt.toString(),
            wko_ref_cnt: item.wko_ref_cnt.toString(),

            
          });

            setAssigToReason_Visible(false);
            setAssigToReason_Valid(false);
          if (item.wko_mst_type == 'G' ) {
            setPMGroup_Visible(true);
            setAssetNo_Visible(false);
            
          } else {
            setAssetNo_Visible(true);
            setPMGroup_Visible(false);
           
          }

          if (item.wrk_sts_typ_cd === 'CLOSE') {
            setSubmitButton('Work Order Closed');
            setSubmitButtonColor('#FF0000');
          } else if (item.wrk_sts_typ_cd === 'COMPLETE') {
            setSubmitButton('Work Order Completed');
            setSubmitButtonColor('#0096FF');
          }
          
          

        })

        
       
        get_workorder_attachment(rowid,wrk_count);
       
        
      } else {
        setspinner(false);
        setAlert(true, 'danger', response.data.message, 'OK', '', '');
        
      }
    } catch (error) {
      setspinner(false);
      console.log('error', error);
      alert(error);
    }
  };

  // GET WORK ORDER ATTACHMENT FILE API
  const get_workorder_attachment = async (rowid,wrk_count) => {

  
    if(wrk_count =='0'){
     

      setspinner(false);

    }else{
      

      const SPLIT_URL = Baseurl.split('/');
      const SPLIT_URL1 = SPLIT_URL[SPLIT_URL.length - 2];
      const SPLIT_URL2 = SPLIT_URL[SPLIT_URL.length - 1];
      const SPLIT_URL3 = SPLIT_URL1+'/'+SPLIT_URL2
      // console.log('URL' + SPLIT_URL3);

      try {
        console.log( 'JSON DATA : ' + `${Baseurl}/get_workorder_attachment_by_params.php?site_cd=${Site_cd}&rowid=${rowid}&type=P&url=${Baseurl}&folder=${SPLIT_URL3}&dvc_id=${dvc_id}`);
        const response = await axios.get( `${Baseurl}/get_workorder_attachment_by_params.php?site_cd=${Site_cd}&rowid=${rowid}&type=P&url=${Baseurl}&folder=${SPLIT_URL3}&dvc_id=${dvc_id}`);

        //console.log("JSON DATA : " + response.data.status)
        //console.log("JSON DATA : " + Attachments_List.length)

        if (response.data.status === 'SUCCESS') {

          Attachments_List.length = 0;
          images_list.length = 0;
          images_link.length = 0;

          if (response.data.data.length > 0) {

            setAttachments_List([]);
            setimages_list([]);
            setimages_link([]);

            for (let value of Object.values(response.data.data)) {
              let key = Attachments_List.length + 1;
              let localIdentifier = key;
              let path = value.full_size_link;
              let name = value.file_name;
              let rowid = value.rowid;
              let imagetype = 'Exist';
              //let type = value.column2;

              let type
              const lowerCaseFileName = value.file_name.toLowerCase();

              if (lowerCaseFileName.endsWith('.jpg') || lowerCaseFileName.endsWith('.jpeg')) {

                type = 'image/jpg'
                images_list.unshift({ key, path, name, imagetype, type, localIdentifier, rowid});
                setimages_list(images_list.slice(0));
                //console.log('The file is a JPG image.');
              } else if (lowerCaseFileName.endsWith('.mp4')) {
                type = 'video/mp4'
                //console.log('The file is a PNG image.');
              } else if (lowerCaseFileName.endsWith('.pdf')) {
                type = 'application/pdf'
                //console.log('The file is not a JPG or PNG image.');
              }


              //console.log("PATH"+ JSON.stringify(path));

              Attachments_List.unshift({ key, path, name, imagetype, localIdentifier, rowid, type });
              setAttachments_List(Attachments_List.slice(0));
              key++;
            }

            for (let i = 0; i < images_list.length; i++) {

              let keys = i + 1
              setimages_link(images_link=>[...images_link,{ key:keys,url:images_list[i].path,name:images_list[i].name,localIdentifier:images_list[i].localIdentifier}]);

            }

            // const endtime = Date.now();
            // const uploadtime = endtime - starttime;
            // console.log('starttime', starttime);
            // console.log('endtime', endtime);
            // console.log('uploadtime', uploadtime);
            setspinner(false);

          
          } else {
          
            // const endtime = Date.now();
            // const uploadtime = endtime - starttime;
            // console.log('starttime', starttime);
            // console.log('endtime', endtime);
            // console.log('uploadtime', uploadtime);
            setspinner(false);
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
    }

    
  };
  
  

  const get_dropdown_Assign_Employee = async () => {

    if (WIFI == 'OFFLINE') {
      setBoxtextvalue('AssignTo');
      settextvalue('Assign To');
      setDropDownFilteredData(AssignTo);
      setDropdown_data(AssignTo);
     
      setDropDown_modalVisible(!DropDown_modalVisible);

    }else{
        setspinner(true);
      try {
        console.log( 'get_dropdown : ' + `${Baseurl}/get_dropdown.php?site_cd=${Site_cd}&type=${'Assign_Employee'}&EmpID=${EmpID}&LoginID=${LoginID}`, );
        const Dropdown = await fetch( `${Baseurl}/get_dropdown.php?site_cd=${Site_cd}&type=${'Assign_Employee'}&EmpID=${EmpID}&LoginID=${LoginID}`, );
        const responseJson = await Dropdown.json();

        if (responseJson.status === 'SUCCESS') {
          //console.log(responseJson.data.Assign_Employee);

          if (responseJson.data.Assign_Employee.length > 0) {
            
            // setAssignTo(responseJson.data.Assign_Employee);
            setspinner(false);
            setBoxtextvalue('AssignTo');
            settextvalue('Assign To');

            setDropDownFilteredData(responseJson.data.Assign_Employee);
            setDropdown_data(responseJson.data.Assign_Employee);
            setDropDown_modalVisible(!DropDown_modalVisible);
            
          } else {
            setspinner(false);
            setAlert(true, 'warning', response.data.message, 'OK', '', '');
            
          }
        } else {
          setspinner(false);
          setAlert(true, 'danger', response.data.message, 'OK', '', '');
        }
      }catch (error) {
        setspinner(false);
        Alert.alert( 'Error', error.message, [ { text: 'OK' } ], { cancelable: false } )
      }

    }  
 };

  //ASSET SEARCH BOX
  const open_search_asset_box = () => {
    if (WIFI == 'OFFLINE') {
      setAssetList_modalVisible(!AssetList_modalVisible);
    } else {
      

      setast_mst_data({...ast_mst_data,
        ast_mst_asset_no:'',
        ast_mst_asset_desc:'',
        ast_mst_asset_from:'',
        ast_mst_asset_to:'',
        ast_mst_asset_type:'',
        ast_mst_asset_group_code:'',
        ast_mst_asset_code:'',
        ast_mst_asset_loc:'',
        ast_mst_asset_level:'',
        ast_mst_asset_workarea:''})

      setAssetList_search('');

      setAsset_modalVisible(!Asset_modalVisible);
    }
  };

  //Get Asset Master Count API
  const get_assetmaster_count = async () => {

    let Asset_retrieve;

    setspinner(true);

    if (
      !ast_mst_data.ast_mst_asset_no &&
      !ast_mst_data.ast_mst_asset_desc &&
      !ast_mst_data.ast_mst_asset_from &&
      !ast_mst_data.ast_mst_asset_to &&
      !ast_mst_data.ast_mst_asset_type &&
      !ast_mst_data.ast_mst_asset_group_code &&
      !ast_mst_data.ast_mst_asset_code &&
      !ast_mst_data.ast_mst_asset_loc &&
      !ast_mst_data.ast_mst_asset_level &&
      !ast_mst_data.ast_mst_asset_workarea
    ) {
      setspinner(false);
      // alert('Please select at least one criteria to search');
      setAlert( true, 'warning', 'Please select at least one criteria to search', 'OK', '', '', );
    } else {

      let asset_type, asset_code,AssetGroupCode, WorkArea, AssetLocation, AssetLevel;

      if (!ast_mst_data.ast_mst_asset_type) {
        asset_type = '';
      } else {
        asset_type_split = ast_mst_data.ast_mst_asset_type.split(':');
        asset_type = asset_type_split[0].trim();
      }

      if (!ast_mst_data.ast_mst_asset_group_code) {
        AssetGroupCode = '';
      } else {
        AssetGroupCode_split = ast_mst_data.ast_mst_asset_group_code.split(':');
        AssetGroupCode = AssetGroupCode_split[0].trim();
      }
  
      if (!ast_mst_data.ast_mst_asset_workarea) {
        WorkArea = '';
      } else {
        WorkArea_split = ast_mst_data.ast_mst_asset_workarea.split(':');
        WorkArea = WorkArea_split[0].trim();
      }

      if (!ast_mst_data.ast_mst_asset_code) {
        asset_code = '';
      } else {
        asset_code_split = ast_mst_data.ast_mst_asset_code.split(':');
        asset_code = asset_code_split[0].trim();
      }
  
      if (!ast_mst_data.ast_mst_asset_loc) {
        AssetLocation = '';
      } else {
        AssetLocation_split = ast_mst_data.ast_mst_asset_loc.split(':');
        AssetLocation = AssetLocation_split[0].trim();
      }
  
      if (!ast_mst_data.ast_mst_asset_level) {
        AssetLevel = '';
      } else {
        AssetLevel_split = ast_mst_data.ast_mst_asset_level.split(':');
        AssetLevel = AssetLevel_split[0].trim();
      }

      Asset_retrieve = {
        site_cd: Site_cd,
        ast_mst_asset_no: ast_mst_data.ast_mst_asset_no,
        asset_shortdesc: ast_mst_data.ast_mst_asset_desc,
        cost_center: '',
        asset_status: '',
        from_date: ast_mst_data.ast_mst_asset_from,
        to_date: ast_mst_data.ast_mst_asset_to,
        asset_type: asset_type,
        asset_grpcode: AssetGroupCode,
        work_area: WorkArea,
        asset_locn: AssetLocation,
        asset_code: asset_code,
        ast_lvl: AssetLevel,
        ast_sts_typ_cd: 'Active',
        createby: '',
        emp_det_work_grp: EmpWorkGrp,
        emp_id: EmpID,
      };

      console.log('Asset Master Count: ' + JSON.stringify(Asset_retrieve));
      try {
        const response = await axios.post( `${Baseurl}/get_assetmaster_count.php?`, JSON.stringify(Asset_retrieve), );
        //console.log("Asset Master Count Response : " + response.data.status)
        if (response.data.status === 'SUCCESS') {
          
          if (response.data.data >= 1000) {
            setspinner(false);
            setAlert_two( true, 'warning', `The Current Filter return: ${response.data.data} record, it will take some time to download.Do you still want to continue?`, 'Asset_Count', '', '', );
          } else {
            get_assetmaster();
          }

        } else {
          setspinner(false);
          setAlert(true, 'danger', response.data.message, 'OK', '', '');
        }
      } catch (error) {
        setspinner(false);
        Alert.alert( 'Error', error.message, [ { text: 'OK' } ], { cancelable: false } );
      }
    }
  };

  //GET ASSET MASTER LIST API
  const get_assetmaster = async () => {

    setspinner(true);

    let asset_type, asset_code,AssetGroupCode, WorkArea, AssetLocation, AssetLevel;

      if (!ast_mst_data.ast_mst_asset_type) {
        asset_type = '';
      } else {
        asset_type_split = ast_mst_data.ast_mst_asset_type.split(':');
        asset_type = asset_type_split[0].trim();
      }

      if (!ast_mst_data.ast_mst_asset_group_code) {
        AssetGroupCode = '';
      } else {
        AssetGroupCode_split = ast_mst_data.ast_mst_asset_group_code.split(':');
        AssetGroupCode = AssetGroupCode_split[0].trim();
      }
  
      if (!ast_mst_data.ast_mst_asset_workarea) {
        WorkArea = '';
      } else {
        WorkArea_split = ast_mst_data.ast_mst_asset_workarea.split(':');
        WorkArea = WorkArea_split[0].trim();
      }

      if (!ast_mst_data.ast_mst_asset_code) {
        asset_code = '';
      } else {
        asset_code_split = ast_mst_data.ast_mst_asset_code.split(':');
        asset_code = asset_code_split[0].trim();
      }
  
      if (!ast_mst_data.ast_mst_asset_loc) {
        AssetLocation = '';
      } else {
        AssetLocation_split = ast_mst_data.ast_mst_asset_loc.split(':');
        AssetLocation = AssetLocation_split[0].trim();
      }
  
      if (!ast_mst_data.ast_mst_asset_level) {
        AssetLevel = '';
      } else {
        AssetLevel_split = ast_mst_data.ast_mst_asset_level.split(':');
        AssetLevel = AssetLevel_split[0].trim();
      }

      Asset_retrieve = {
        site_cd: Site_cd,
        ast_mst_asset_no: ast_mst_data.ast_mst_asset_no,
        asset_shortdesc: ast_mst_data.ast_mst_asset_desc,
        cost_center: '',
        asset_status: '',
        from_date: ast_mst_data.ast_mst_asset_from,
        to_date: ast_mst_data.ast_mst_asset_to,
        asset_type: asset_type,
        asset_grpcode: AssetGroupCode,
        work_area: WorkArea,
        asset_locn: AssetLocation,
        asset_code: asset_code,
        ast_lvl: AssetLevel,
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
            <Text style={{ color: '#2962FF', fontSize: 13, backgroundColor: '#D6EAF8', padding: 5, fontWeight: 'bold', }}>{item.ast_mst_asset_no}</Text>
            <Text style={{fontSize: 13, color: '#000'}}>{item.ast_mst_asset_status}</Text>
          </View>

          <View style={{flexDirection: 'row', marginTop: 10}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start'}}>Description :</Text>
            </View>
            <View style={{flex: 1.5}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.ast_mst_asset_shortdesc}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start'}}>Cost Center :</Text>
            </View>
            <View style={{flex: 1.5}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.ast_mst_cost_center}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start'}}>Work Area :</Text>
            </View>
            <View style={{flex: 1.5}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.mst_war_work_area}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start'}}>Asset Location :</Text>
            </View>

            <View style={{flex: 1.5}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.ast_mst_asset_locn}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start', }}>Level :</Text>
            </View>
            <View style={{flex: 1.5}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.ast_mst_asset_lvl}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start', }}>Short Description :</Text>
            </View>
            <View style={{flex: 1.5}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.ast_mst_asset_shortdesc}</Text>
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
          height: 1,
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

    setwko_mst_data({...wko_mst_data,

      wko_mst_assetno: item.ast_mst_asset_no,
      ast_mst_asset_shortdesc: item.ast_mst_asset_shortdesc,
      wko_mst_asset_group_code: item.ast_mst_asset_grpcode,
      wko_mst_work_area: item.mst_war_work_area,
      wko_mst_asset_location: item.ast_mst_asset_locn,
      wko_mst_asset_level: item.ast_mst_asset_lvl,
      wko_mst_chg_costcenter: item.ast_mst_cost_center,

      ast_mst_asset_code: item.ast_mst_asset_code,
      ast_mst_perm_id: item.ast_mst_perm_id,
      ast_det_cus_code: item.ast_det_cus_code,
      ast_mst_asset_status: item.ast_mst_asset_status,

    })

    // setAssetNo(item.ast_mst_asset_no);
    // setAssetDescription(item.ast_mst_asset_shortdesc);
    // setAssetGroupCode_key(item.ast_mst_asset_grpcode);
    // setWorkArea_key(item.mst_war_work_area);
    // setAssetLocation_key(item.ast_mst_asset_locn);
    // setAssetLevel_key(item.ast_mst_asset_lvl);
    // setCostCenter_key(item.ast_mst_cost_center);

    // setAssetCode_key(item.ast_mst_asset_code);
    // setPermID_key(item.ast_mst_perm_id);
    // setAssetCusCode_key(item.ast_det_cus_code);
    // setAssetStatus_key(item.ast_mst_asset_status);
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
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start'}}>ID:</Text>
            </View>
            <View style={{flex: 4}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.emp_mst_empl_id}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}>Name:</Text>
            </View>
            <View style={{flex: 4}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.emp_mst_name}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}>Title:</Text>
            </View>
            <View style={{flex: 4}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.emp_mst_title}</Text>
            </View>
          </View>
        </View>
      );
    } else if ( textvalue == 'Original Priority' || textvalue == 'Plan Priority' ) {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Priority Code : </Text>
            </View>
            <View style={{flex: 1.5}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.wrk_pri_pri_cd}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Description : </Text>
            </View>
            <View style={{flex: 1.5}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.wrk_pri_desc}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Due Date Count(mins) : </Text>
            </View>
            <View style={{flex: 1.5}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.wrk_pri_due_date_count}</Text>
            </View>
          </View>
        </View>
      );
    } else if (textvalue == 'Work Type') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Type Code : </Text>
            </View>
            <View style={{flex: 2}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.wrk_typ_typ_cd}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Description : </Text>
            </View>
            <View style={{flex: 2}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.wrk_typ_desc}</Text>
            </View>
          </View>
        </View>
      );
    } else if (textvalue == 'Work Order Status') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Status Type Code : </Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.wrk_sts_typ_cd}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Status : </Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.wrk_sts_status}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}>  Description : </Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.wrk_sts_desc}</Text>
            </View>
          </View>
        </View>
      );
    } else if (textvalue == 'Fault Code') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Fault Code : </Text>
            </View>
            <View style={{flex: 2}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.wrk_flt_fault_cd}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Description : </Text>
            </View>
            <View style={{flex: 2}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.wrk_flt_desc.trim()}</Text>
            </View>
          </View>
        </View>
      );
    } else if (textvalue == 'Cost Center') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Cost Center : </Text>
            </View>
            <View style={{flex: 2}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.costcenter}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Description : </Text>
            </View>
            <View style={{flex: 2}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.descs}</Text>
            </View>
          </View>
        </View>
      );
    } else if (textvalue == 'Asset Type' || Boxtextvalue == 'Box Asset Type') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Type Code : </Text>
            </View>
            <View style={{flex: 2}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.ast_type_cd}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Description : </Text>
            </View>
            <View style={{flex: 2}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.ast_type_descs}</Text>
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
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Asset Group Code : </Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.ast_grp_grp_cd}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Asset Group Desc : </Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.ast_grp_desc}</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Auto Number: </Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{option}</Text>
            </View>
          </View>
        </View>
      );
    } else if (textvalue == 'Asset Code' || Boxtextvalue == 'Box Asset Code') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Asset Code : </Text>
            </View>
            <View style={{flex: 2}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.ast_cod_ast_cd}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Description : </Text>
            </View>
            <View style={{flex: 2}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.ast_cod_desc}</Text>
            </View>
          </View>
        </View>
      );
    } else if (textvalue == 'Work Area' || Boxtextvalue == 'Box Work Area') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Work Area : </Text>
            </View>
            <View style={{flex: 2}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.mst_war_work_area}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Description : </Text>
            </View>
            <View style={{flex: 2}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.mst_war_desc}</Text>
            </View>
          </View>
        </View>
      );
    } else if ( textvalue == 'Asset Location' || Boxtextvalue == 'Box Asset Location' ) {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Asset Location : </Text>
            </View>
            <View style={{flex: 1.5}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.ast_loc_ast_loc}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Description : </Text>
            </View>
            <View style={{flex: 1.5}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.ast_loc_desc}</Text>
            </View>
          </View>
        </View>
      );
    } else if ( textvalue == 'Asset Level' || Boxtextvalue == 'Box Asset Level' ) {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Asset Level : </Text>
            </View>
            <View style={{flex: 2}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.ast_lvl_ast_lvl}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Description : </Text>
            </View>
            <View style={{flex: 2}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.ast_lvl_desc}</Text>
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
              <View style={{ flexDirection: 'column', flex: 5, justifyContent: 'center', marginLeft: 20, }}>
                <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.emp_mst_empl_id}</Text>
                <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.emp_mst_name}</Text>
                <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.emp_mst_title}</Text>
              </View>

              <View style={{ flexDirection: 'column', flex: 1, justifyContent: 'center', marginLeft: 20, }}>
                <View style={{ padding: 5, alignItems: 'center', alignContent: 'center', }}>
                  <Text placeholder="Test" style={{ color: '#000', fontSize: 13, fontWeight: 'bold', justifyContent: 'center', }}>  WO </Text>
                </View>

                <View style={{ backgroundColor: colorCD, padding: 5, borderRadius: 10, alignItems: 'center', alignContent: 'center', }}>
                  <Text placeholder="Test" style={{ color: '#fff', fontSize: 13, fontWeight: 'bold', justifyContent: 'center', }}>{count}</Text>
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
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Account : </Text>
            </View>
            <View style={{flex: 2}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.account}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Description : </Text>
            </View>
            <View style={{flex: 2}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.descs}</Text>
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
          height: 1,
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
     
      setwko_mst_data({...wko_mst_data,wko_mst_originator: item.emp_mst_empl_id + ' : ' + item.emp_mst_name})

    } else if (textvalue == 'Original Priority') {
     
      setwko_mst_data({...wko_mst_data,
        wko_mst_orig_priority: item.wrk_pri_pri_cd + ' : ' + item.wrk_pri_desc,
        wko_mst_orig_count:item.wrk_pri_due_date_count
      })

    } else if (textvalue == 'Plan Priority') {
      
      var count = item.wrk_pri_due_date_count;
     
      let days = count / 1440;
      let hours = (count % 1440) / 60;
      let mins = count % 60;
      var date = new Date(wko_mst_data.wko_mst_orig_date);
      date.setDate(date.getDate() + days);
      let plandate = moment(date).format('yyyy-MM-DD');

      //setwko_mst_data({...wko_mst_data,wko_mst_plan_priority: item.wrk_pri_pri_cd + ' : ' + item.wrk_pri_desc})

      setwko_mst_data({...wko_mst_data,
        wko_mst_plan_priority: item.wrk_pri_pri_cd + ' : ' + item.wrk_pri_desc,
        wko_mst_plan_count:item.wrk_pri_due_date_count,
        wko_mst_due_date:  moment(date).format('yyyy-MM-DD')
      })


    } else if (textvalue == 'Work Type') {

      setwko_mst_data({...wko_mst_data,wko_det_work_type: item.wrk_typ_typ_cd + ' : ' + item.wrk_typ_desc})

    } else if (textvalue == 'Fault Code') {
      
      
      setwko_mst_data({...wko_mst_data,
        wko_mst_flt_code: item.wrk_flt_fault_cd + ' : ' + item.wrk_flt_desc,
        wko_mst_descs:item.wrk_flt_desc
      
      })

    } else if (textvalue == 'Cost Center') {
      
      setwko_mst_data({...wko_mst_data,wko_mst_chg_costcenter: item.costcenter + ' : ' + item.descs})

    } else if (textvalue == 'Asset Group Code') {
      if (Boxtextvalue == 'Box Asset Group Code') {
      
        setast_mst_data({...ast_mst_data,ast_mst_asset_group_code: item.ast_grp_grp_cd + ' : ' + item.ast_grp_desc})

      } else {

        setwko_mst_data({...wko_mst_data,wko_mst_asset_group_code: item.ast_grp_grp_cd + ' : ' + item.ast_grp_desc})

      }
    } else if (textvalue == 'Asset Code') {
      if (Boxtextvalue == 'Box Asset Code') {

        setast_mst_data({...ast_mst_data,ast_mst_asset_code: item.ast_cod_ast_cd + ' : ' + item.ast_cod_desc })
        
      }
    } else if (textvalue == 'Work Area') {
      if (Boxtextvalue == 'Box Work Area') {
        setast_mst_data({...ast_mst_data,ast_mst_asset_workarea: item.mst_war_work_area + ' : ' + item.mst_war_desc })
        
      } else {
        
        setwko_mst_data({...wko_mst_data,wko_mst_work_area: item.mst_war_work_area + ' : ' + item.mst_war_desc})
      }
    } else if (textvalue == 'Asset Location') {
      if (Boxtextvalue == 'Box Asset Location') {

        setast_mst_data({...ast_mst_data,ast_mst_asset_loc: item.ast_loc_ast_loc + ' : ' + item.ast_loc_desc })
        
      } else {
        
        setwko_mst_data({...wko_mst_data,wko_mst_asset_location: item.ast_loc_ast_loc + ' : ' + item.ast_loc_desc})
      }
    } else if (textvalue == 'Asset Level') {
      if (Boxtextvalue == 'Box Asset Level') {

        setast_mst_data({...ast_mst_data,ast_mst_asset_level: item.ast_lvl_ast_lvl + ' : ' + item.ast_lvl_desc })
        
      } else {
        
        setwko_mst_data({...wko_mst_data,wko_mst_asset_level: item.ast_lvl_ast_lvl + ' : ' + item.ast_lvl_desc})
      }
    } else if (textvalue == 'Asset Type' || Boxtextvalue == 'Box Asset Type') {

      setast_mst_data({...ast_mst_data,ast_mst_asset_type: item.ast_type_cd + ' : ' + item.ast_type_descs })
      
    } else if (textvalue == 'Work Order Status') {
     

      setwko_mst_data({...wko_mst_data,wko_mst_status: item.wrk_sts_status + ' : ' + item.wrk_sts_desc})

    } else if (textvalue == 'Assign To') {
      console.log('PER 1', wko_mst_data.wko_det_perassign_to);
      console.log('PER 1w', item.emp_mst_empl_id);

      if ( route.params.Screenname == 'CreateWorkOrder' || route.params.Screenname == 'ScanAssetMaster' ) {
        setwko_mst_data({...wko_mst_data,wko_det_assign_to: item.emp_mst_empl_id + ' : ' + item.emp_mst_name})
      } else {
        if (!wko_mst_data.wko_det_perassign_to) {
          console.log('PER', wko_mst_data.wko_det_perassign_to);

         
          setwko_mst_data({...wko_mst_data,wko_det_assign_to: item.emp_mst_empl_id + ' : ' + item.emp_mst_name})
          setAssigToReason_Visible(true);
          setAssigToReason_Valid(true);
        } else {
          console.log('PER else', wko_mst_data.wko_det_perassign_to);

          if (item.emp_mst_empl_id == wko_mst_data.wko_det_perassign_to.split(':')[0]) {
            setwko_mst_data({...wko_mst_data,wko_det_assign_to: item.emp_mst_empl_id + ' : ' + item.emp_mst_name})
            setAssigToReason_Visible(false);
            setAssigToReason_Valid(false);
          } else {
            setwko_mst_data({...wko_mst_data,wko_det_assign_to: item.emp_mst_empl_id + ' : ' + item.emp_mst_name})
            setAssigToReason_Visible(true);
            setAssigToReason_Valid(true);
          }
        }
      }
    } else if (textvalue == 'Labor Account') {
     
      setwko_mst_data({...wko_mst_data,wko_det_laccount: item.account + ' : ' + item.descs})
    } else if (textvalue == 'Contract Account') {
      
      setwko_mst_data({...wko_mst_data,wko_det_caccount: item.account + ' : ' + item.descs})

    } else if (textvalue == 'Material Account') {
      
      setwko_mst_data({...wko_mst_data,wko_det_maccount: item.account + ' : ' + item.descs})
    }

    setDropDown_search('');
    setDropDown_modalVisible(!DropDown_modalVisible);
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
      if (!wko_mst_data.wko_mst_orig_priority) {
        alert('Please Select Original Priority');
      } else {

        let select_OrgDate = moment(date).format('yyyy-MM-DD');

        var count = wko_mst_data.wko_mst_orig_count;

       

        let days = count / 1440;
        let hours = (count % 1440) / 60;
        let mins = count % 60;

        var date = new Date(select_OrgDate);
        date.setDate(date.getDate() + days);
        let plandate = moment(date).format('yyyy-MM-DD');
        
        setwko_mst_data({ ...wko_mst_data, 
          wko_mst_orig_date: select_OrgDate,
          wko_mst_due_date: plandate
        })
      
      }
    } else if (Type === 'to') {
      if (!wko_mst_data.wko_mst_orig_priority) {
        alert('Please Select Original Priority');
      } else {
        let select_dueDate = moment(date).format('yyyy-MM-DD');
        
        setwko_mst_data({ ...wko_mst_data,wko_mst_due_date: select_dueDate })
      }
    } else if (Type === 'Box-from') {
      let select_box_fromDate = moment(date).format('yyyy-MM-DD');
      

      setast_mst_data({...ast_mst_data,ast_mst_asset_from: select_box_fromDate})

      
    } else if (Type === 'Box-to') {
      let select_box_toDate = moment(date).format('yyyy-MM-DD');
     
      setast_mst_data({...ast_mst_data,ast_mst_asset_to: select_box_toDate})
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
      if (!wko_mst_data.wko_mst_orig_priority) {
        alert('Please Select Original Priority');
      } else {
        let select_OrgTime = moment(date).format('HH:mm');
        
        setwko_mst_data({ ...wko_mst_data,wko_mst_orig_time: select_OrgTime })
      }
    } else if (Type === 'to') {
      if (!wko_mst_data.wko_mst_orig_priority) {
        alert('Please Select Original Priority');
      } else {
        let select_dueTime = moment(date).format('HH:mm');
        setwko_mst_data({ ...wko_mst_data,wko_mst_due_time: select_dueTime })
        
      }
    }

    hideTimePicker();
  };

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
      if (!wko_mst_data.wko_det_assign_reason) {
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

    if (!wko_mst_data.wko_mst_assetno) {
      //alert('Please Select Asset No');
      setAlert(true, 'warning', 'Please Select Asset No', 'OK', '', '');
      Valid = false;
      return;
    } else {
      if (!wko_mst_data.ast_mst_asset_shortdesc) {
        //alert('Please Enter Asset Description');
        setAlert( true, 'warning', 'Please Enter Asset Description', 'OK', '', '', );
        Valid = false;
        return;
      } else {
        if (!wko_mst_data.wko_mst_orig_priority) {
          //alert('Please Select Original Priority');
          setAlert( true, 'warning', 'Please Select Original Priority', 'OK', '', '', );
          Valid = false;
          return;
        } else {
          if (!wko_mst_data.wko_mst_plan_priority) {
            setAlert( true, 'warning', 'Please Select Plan Priority', 'OK', '', '', );
            //alert('Please Select Plan Priority');
            Valid = false;
            return;
          } else {
            if (!wko_mst_data.wko_mst_orig_date) {
              //alert('Please Select Origination Date');
              setAlert( true, 'warning', 'Please Select Origination Date', 'OK', '', '', );
              Valid = false;
              return;
            } else {
              if (!wko_mst_data.wko_mst_due_date) {
                //alert('Please Select Due Date');
                setAlert( true, 'warning', 'Please Select Due Date', 'OK', '', '', );
                Valid = false;
                return;
              } else {
                if (!wko_mst_data.wko_mst_orig_time) {
                  //alert('Please Select Origination Time');
                  setAlert( true, 'warning', 'Please Select Origination Time', 'OK', '', '', );
                  Valid = false;
                  return;
                } else {
                  if (!wko_mst_data.wko_mst_due_time) {
                    //alert('Please Select Due Time');
                    setAlert( true, 'warning', 'Please Select Due Time', 'OK', '', '', );
                    Valid = false;
                    return;
                  } else {
                    if (!wko_mst_data.wko_det_work_type) {
                      // alert('Please Select Work Type');
                      setAlert( true, 'warning', 'Please Select Work Type', 'OK', '', '', );
                      Valid = false;
                      return;
                    } else {
                      if (!wko_mst_data.wko_mst_flt_code) {
                        //alert('Please Select Fault Code');
                        setAlert( true, 'warning', 'Please Select Fault Code', 'OK', '', '', );
                        Valid = false;
                        return;
                      } else {
                        if (!wko_mst_data.wko_mst_status) {
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

    let EmployeeName_split,
      AssetGroupCode,
      WorkArea,
      AssetLocation,
      AssetLevel,
      CostCenter,
      AssignTo_split,
      LaborAccount_split,
      ContractAccount_split,
      MaterialAccount_split,
      AssetCode_split,
      CusCode_split;

    if (!wko_mst_data.wko_mst_originator) {
      EmployeeName_split = '';
    } else {
      Employee_split = wko_mst_data.wko_mst_originator.split(':');
      EmployeeName_split = Employee_split[0].trim();
    }

    if (!wko_mst_data.wko_mst_asset_group_code) {
      AssetGroupCode = '';
    } else {
      AssetGroupCode_split = wko_mst_data.wko_mst_asset_group_code.split(':');
      AssetGroupCode = AssetGroupCode_split[0].trim();
    }

    if (!wko_mst_data.wko_mst_work_area) {
      WorkArea = '';
    } else {
      WorkArea_split = wko_mst_data.wko_mst_work_area.split(':');
      WorkArea = WorkArea_split[0].trim();
    }

    if (!wko_mst_data.wko_mst_asset_location) {
      AssetLocation = '';
    } else {
      AssetLocation_split = wko_mst_data.wko_mst_asset_location.split(':');
      AssetLocation = AssetLocation_split[0].trim();
    }

    if (!wko_mst_data.wko_mst_asset_level) {
      AssetLevel = '';
    } else {
      AssetLevel_split = wko_mst_data.wko_mst_asset_level.split(':');
      AssetLevel = AssetLevel_split[0].trim();
    }

    if (!wko_mst_data.wko_mst_chg_costcenter) {
      CostCenter = '';
    } else {
      CostCenter_split = wko_mst_data.wko_mst_chg_costcenter.split(':');
      CostCenter = CostCenter_split[0].trim();
    }

    let OrgPriority_split = wko_mst_data.wko_mst_orig_priority.split(':');
    let PlanPriority_split = wko_mst_data.wko_mst_plan_priority.split(':');
    let org_date = wko_mst_data.wko_mst_orig_date + ' ' + wko_mst_data.wko_mst_orig_time;
    let due_date = wko_mst_data.wko_mst_due_date + ' ' + wko_mst_data.wko_mst_due_time;

    console.log(org_date);
    console.log(due_date);

    let WorkType_split = wko_mst_data.wko_det_work_type.split(':');
    let FaultCode_split = wko_mst_data.wko_mst_flt_code.split(':');
    let WorkOrderStatus_split = wko_mst_data.wko_mst_status.split(':');

    if (!wko_mst_data.wko_det_assign_to) {
      AssignTo_split = '';
    } else {
      AssignTo_key_split = wko_mst_data.wko_det_assign_to.split(':');
      AssignTo_split = AssignTo_key_split[0].trim();
    }

    if (!wko_mst_data.wko_det_laccount) {
      LaborAccount_split = '';
    } else {
      LaborAccount_key_split = wko_mst_data.wko_det_laccount.split(':');
      LaborAccount_split = LaborAccount_key_split[0].trim();
    }

    if (!wko_mst_data.wko_det_caccount) {
      ContractAccount_split = '';
    } else {
      ContractAccount_key_split = wko_mst_data.wko_det_caccount.split(':');
      ContractAccount_split = ContractAccount_key_split[0].trim();
    }

    if (!wko_mst_data.wko_det_maccount) {
      MaterialAccount_split = '';
    } else {
      MaterialAccount_key_split = wko_mst_data.wko_det_maccount.split(':');
      MaterialAccount_split = MaterialAccount_key_split[0].trim();
    }

    if (!wko_mst_data.ast_mst_asset_code) {
      AssetCode_split = '';
    } else {
      AssetCode_key_split = ast_mst_data.ast_mst_asset_code.split(':');
      AssetCode_split = AssetCode_key_split[0].trim();
    }

    if (!wko_mst_data.ast_mst_asset_status) {
      AssetStatus_split = '';
    } else {
      AssetStatus_key_split = wko_mst_data.ast_mst_asset_status.split(':');
      AssetStatus_split = AssetStatus_key_split[0].trim();
    }

    console.log('ast_mst_perm_id', wko_mst_data.ast_mst_perm_id);
    console.log('ast_det_cus_code', wko_mst_data.ast_det_cus_code);

    console.log('LoginID', LoginID);
    console.log('EmpName', EmpName);
    console.log('EmpID', EmpID);
    console.log('EmpPhone', EmpPhone);

    let Create_WorkOrder = {
      site_cd: Site_cd,
      EmpID: EmpID,
      EmpName: EmpName,

      wko_mst_originator: EmployeeName_split,
      wko_mst_phone: wko_mst_data.wko_mst_phone,

      ast_mst_asset_no: wko_mst_data.wko_mst_assetno,
      ast_mst_asset_shortdesc: wko_mst_data.ast_mst_asset_shortdesc,
      ast_mst_asset_group: AssetGroupCode,
      mst_war_work_area: WorkArea,
      ast_mst_asset_locn: AssetLocation,
      ast_mst_asset_lvl: AssetLevel,
      wko_mst_chg_costcenter: CostCenter,

      wko_mst_wo_no: wko_mst_data.wko_mst_wo_no,
      wko_mst_orig_priority: OrgPriority_split[0].trim(),
      wko_mst_plan_priority: PlanPriority_split[0].trim(),
      wko_mst_org_date: org_date,
      wko_mst_due_date: due_date,
      wko_det_work_type: WorkType_split[0].trim(),
      wko_mst_flt_code: FaultCode_split[0].trim(),
      wko_mst_descs: wko_mst_data.wko_mst_descs,
      wko_mst_status: WorkOrderStatus_split[0].trim(),
      wko_det_assign_to: AssignTo_split,
      wko_det_laccount: LaborAccount_split,
      wko_det_caccount: ContractAccount_split,
      wko_det_maccount: MaterialAccount_split,

      ast_mst_asset_code: AssetCode_split,
      ast_mst_perm_id: wko_mst_data.ast_mst_perm_id,
      ast_det_cus_code: wko_mst_data.ast_det_cus_code,
      ast_mst_asset_status: AssetStatus_split,
      cnt_mst_numbering: WorkOrderNo_AutoNo,

      dvc_id: dvc_id,
      LOGINID: LoginID,

      sync_step: '',
      sync_time: sync_date,
      sync_status: 'online',
      sync_url: Baseurl + '/insert_workorder.php?',
    };

    console.log('Create_New_Asset : ' + JSON.stringify(Create_WorkOrder));

    try {
      const response = await axios.post( `${Baseurl}/insert_workorder.php?`, JSON.stringify(Create_WorkOrder), 
      {headers: {'Content-Type': 'application/json'}}
      );
      console.log('Insert asset response:' + JSON.stringify(response.data));
      if (response.data.status === 'SUCCESS') {
        console.log('Insert asset Image lenght:' + Attachments_List);
        if (Attachments_List.length > 0) {
          Insert_image( response.data.WorkOrderno, response.data.ROW_ID, response.data.message);
        } else {
          setspinner(false);
          //    Alert.alert(response.data.status,response.data.message,
          //        [

          //            { text: "OK", onPress: () => get_SameScreen(response.data.WorkOrderno,response.data.ROW_ID) }

          //        ]);

          setAlert( true, 'success', response.data.message, 'Online_Insert_WKO', response.data.WorkOrderno, response.data.ROW_ID, );
        }
      } else {
        setspinner(false);
        //    Alert.alert(response.data.status,response.data.message,
        //        [

        //            { text: "OK" }

        //        ]);

        setAlert(true, 'warning', response.data.message, 'OK', '', '');
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
        Alert.alert( 'Error', error.message, [ { text: 'OK' } ], { cancelable: false } );
        
      });

      
    } catch (error) {
      setspinner(false);
      Alert.alert( 'Error', error.message, [ { text: 'OK' } ], { cancelable: false } );
    }
  };

   //INSERT WORK ORDER OFFLINE
  const Insert_Workorder_offline = async () => {
    setspinner(true);

    var sync_date = moment().format('YYYY-MM-DD HH:mm');
    let dvc_id = DeviceInfo.getDeviceId();

    let EmployeeName_split, AssetGroupCode, WorkArea, AssetLocation, AssetLevel, CostCenter, AssignTo_split, LaborAccount_split, ContractAccount_split, MaterialAccount_split, AssetCode_split, CusCode_split;

    if (!wko_mst_data.wko_mst_originator) {
      EmployeeName_split = '';
    } else {
     
      EmployeeName_split = wko_mst_data.wko_mst_originator;
    }

    if (!wko_mst_data.wko_mst_asset_group_code) {
      AssetGroupCode = '';
    } else {
      
      AssetGroupCode = wko_mst_data.wko_mst_asset_group_code
    }

    if (!wko_mst_data.wko_mst_work_area) {
      WorkArea = '';
    } else {
     
      WorkArea = wko_mst_data.wko_mst_work_area
    }

    if (!wko_mst_data.wko_mst_asset_location) {
      AssetLocation = '';
    } else {
     
      AssetLocation = wko_mst_data.wko_mst_asset_location
    }

    if (!wko_mst_data.wko_mst_asset_level) {
      AssetLevel = '';
    } else {
     
      AssetLevel = wko_mst_data.wko_mst_asset_level
    }

    if (!wko_mst_data.wko_mst_chg_costcenter) {
      CostCenter = '';
    } else {
      
      CostCenter = wko_mst_data.wko_mst_chg_costcenter
    }

    let OrgPriority_split = wko_mst_data.wko_mst_orig_priority
    let PlanPriority_split = wko_mst_data.wko_mst_plan_priority
    let org_date = wko_mst_data.wko_mst_orig_date + ' ' + wko_mst_data.wko_mst_orig_time;
    let due_date = wko_mst_data.wko_mst_due_date + ' ' + wko_mst_data.wko_mst_due_time;

    console.log(org_date);
    console.log(due_date);

    let WorkType_split = wko_mst_data.wko_det_work_type
    let FaultCode_split = wko_mst_data.wko_mst_flt_code
    let WorkOrderStatus_split = wko_mst_data.wko_mst_status

    if (!wko_mst_data.wko_det_assign_to) {
      AssignTo_split = '';
    } else {
      
      AssignTo_split =wko_mst_data.wko_det_assign_to
    }

    if (!wko_mst_data.wko_det_laccount) {
      LaborAccount_split = '';
    } else {
     
      LaborAccount_split = wko_mst_data.wko_det_laccount
    }

    if (!wko_mst_data.wko_det_caccount) {
      ContractAccount_split = '';
    } else {
      
      ContractAccount_split = wko_mst_data.wko_det_caccount
    }

    if (!wko_mst_data.wko_det_maccount) {
      MaterialAccount_split = '';
    } else {
      
      MaterialAccount_split = wko_mst_data.wko_det_maccount
    }

    if (!wko_mst_data.ast_mst_asset_code) {
      AssetCode_split = '';
    } else {
     
      AssetCode_split = ast_mst_data.ast_mst_asset_code
    }

    if (!wko_mst_data.ast_mst_asset_status) {
      AssetStatus_split = '';
    } else {
      
      AssetStatus_split = wko_mst_data.ast_mst_asset_status
    }

    console.log('ast_mst_perm_id', wko_mst_data.ast_mst_perm_id);
    console.log('ast_det_cus_code', wko_mst_data.ast_det_cus_code);

    console.log('LoginID', LoginID);
    console.log('EmpName', EmpName);
    console.log('EmpID', EmpID);
    console.log('EmpPhone', EmpPhone);

    db.transaction(function (txn) {
      txn.executeSql(
        'INSERT INTO wko_mst (wko_mst_originator,wko_mst_phone,wko_mst_assetno,ast_mst_asset_shortdesc,ast_mst_asset_group,wko_mst_work_area,wko_mst_asset_location,wko_mst_asset_level,wko_mst_chg_costcenter,wko_mst_wo_no,wko_mst_orig_priority,wko_mst_plan_priority,wko_mst_org_date,wko_mst_due_date,wko_det_work_type,wko_mst_flt_code,wko_mst_descs,wko_mst_status,wko_det_assign_to,wko_det_laccount,wko_det_caccount,wko_det_maccount,wko_mst_ast_cod,ast_mst_perm_id,ast_det_cus_code,ast_mst_asset_status,cnt_mst_numbering,RowID,wrk_sts_typ_cd,wko_mst_type,assigndate,site_cd,EmpID,EmpName,dvc_id,LOGINID,mbl_audit_user,mbl_audit_date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',

        [
          EmployeeName_split,
          wko_mst_data.wko_mst_phone,
          wko_mst_data.wko_mst_assetno,
          wko_mst_data.ast_mst_asset_shortdesc,
          AssetGroupCode,
          WorkArea,
          AssetLocation,
          AssetLevel,
          CostCenter,
          wko_mst_data.wko_mst_wo_no,
          OrgPriority_split,
          PlanPriority_split,
          org_date,
          due_date,
          WorkType_split,
          FaultCode_split,
          wko_mst_data.wko_mst_descs,
          WorkOrderStatus_split,
          AssignTo_split,
          LaborAccount_split,
          ContractAccount_split,
          MaterialAccount_split,
          AssetCode_split,
          wko_mst_data.ast_mst_perm_id,
          wko_mst_data.ast_det_cus_code,
          AssetStatus_split,
          WorkOrderNo_AutoNo,
          null,
          'OPEN',
          'C',
          sync_date,
          Site_cd,
          EmpID,
          EmpName,
          dvc_id,
          LoginID,
          EmpID,
          sync_date,
        ],

        (tx, results) => {
          console.log('Results', results.insertId);
          if (results.rowsAffected > 0) {
            console.log('Insert asset Image lenght:' + Attachments_List);
            if (Attachments_List.length > 0) {
              Insert_image_Offline(results.insertId);
            } else {
              setspinner(false);
              

              setAlert( true, 'success', 'Work order create successfully', 'Offline_Insert_WKO', '', '', )}
          } else {
            setspinner(false);
            setAlert(true, 'warning', 'Work order create failed', 'OK', '', '');
            //alert('Updation Failed');
          }
        },
      );
    });
  };

  //INSERT WORK ORDER ATTACHMENT OFFLINE
  const Insert_image_Offline = async LOCALID => {

    console.log('LENGTH: ' + Attachments_List.length);

    for (let i = 0; i < Attachments_List.length; i++) {


      let filename = Attachments_List[i].name;
      let localpath = Attachments_List[i].path;
      let exist = Attachments_List[i].imagetype;
      let type =Attachments_List[i].type


      if (exist === 'Exist') {

      } else {
        db.transaction(function (tx) {
          tx.executeSql(
            'INSERT INTO wko_ref (site_cd,type,file_name,ref_type,Exist,Local_link,local_id) VALUES (?,?,?,?,?,?,?)',
            [ Site_cd, type, filename, 'Gallery_image', exist, localpath, LOCALID],
            (tx, results) => {
              //console.log('wko_ref Results_test', results.rowsAffected);
              if (results.rowsAffected > 0) {
                console.log('INSERT TABLE wko_ref Successfully');
              } else {
                setspinner(false);
                setAlert( true, 'warning', 'Work order create failed', 'OK', '', '', );
              }
            },
          );
        });
      }
    }

    setspinner(false);
    setAlert( true, 'success', 'Work order create successfully', 'Offline_Insert_WKO', '', '', );
  };

  //UPDATE WORK ORDER API
  const Update_WorkOrder = async () => {
    setspinner(true);

    var sync_date = moment().format('YYYY-MM-DD HH:mm');
    let dvc_id = DeviceInfo.getDeviceId();

    let EmployeeName_split,
      AssetGroupCode,
      WorkArea,
      AssetLocation,
      AssetLevel,
      CostCenter,
      AssignTo_split,
      PerAssignTo_split,
      LaborAccount_split,
      ContractAccount_split,
      MaterialAccount_split,
      AssetCode_split,
      CusCode_split;

    if (!wko_mst_data.wko_mst_originator) {
      EmployeeName_split = '';
    } else {
      Employee_split = wko_mst_data.wko_mst_originator.split(':');
      EmployeeName_split = Employee_split[0].trim();
    }

    if (!wko_mst_data.wko_mst_asset_group_code) {
      AssetGroupCode = '';
    } else {
      AssetGroupCode_split = wko_mst_data.wko_mst_asset_group_code.split(':');
      AssetGroupCode = AssetGroupCode_split[0].trim();
    }

    if (!wko_mst_data.wko_mst_work_area) {
      WorkArea = '';
    } else {
      WorkArea_split = wko_mst_data.wko_mst_work_area.split(':');
      WorkArea = WorkArea_split[0].trim();
    }

    if (!wko_mst_data.wko_mst_asset_location) {
      AssetLocation = '';
    } else {
      AssetLocation_split = wko_mst_data.wko_mst_asset_location.split(':');
      AssetLocation = AssetLocation_split[0].trim();
    }

    if (!wko_mst_data.wko_mst_asset_level) {
      AssetLevel = '';
    } else {
      AssetLevel_split = wko_mst_data.wko_mst_asset_level.split(':');
      AssetLevel = AssetLevel_split[0].trim();
    }

    if (!wko_mst_data.wko_mst_chg_costcenter) {
      CostCenter = '';
    } else {
      CostCenter_split = wko_mst_data.wko_mst_chg_costcenter.split(':');
      CostCenter = CostCenter_split[0].trim();
    }

    let OrgPriority_split = wko_mst_data.wko_mst_orig_priority.split(':');
    let PlanPriority_split = wko_mst_data.wko_mst_plan_priority.split(':');
    let org_date = wko_mst_data.wko_mst_orig_date + ' ' + wko_mst_data.wko_mst_orig_time;
    let due_date = wko_mst_data.wko_mst_due_date + ' ' + wko_mst_data.wko_mst_due_time;

    console.log(org_date);
    console.log(due_date);

    let WorkType_split = wko_mst_data.wko_det_work_type.split(':');
    let FaultCode_split = wko_mst_data.wko_mst_flt_code.split(':');
    let WorkOrderStatus_split = wko_mst_data.wko_mst_status.split(':');

    if (!wko_mst_data.wko_det_assign_to) {
      AssignTo_split = '';
    } else {
      AssignTo_key_split = wko_mst_data.wko_det_assign_to.split(':');
      AssignTo_split = AssignTo_key_split[0].trim();
    }

    if (!wko_mst_data.wko_det_perassign_to) {
      PerAssignTo_split = '';
    } else {
      PerAssigTo_key_split = wko_mst_data.wko_det_perassign_to.split(':');
      PerAssignTo_split = PerAssigTo_key_split[0].trim();
    }

    if (!wko_mst_data.wko_det_laccount) {
      LaborAccount_split = '';
    } else {
      LaborAccount_key_split = wko_mst_data.wko_det_laccount.split(':');
      LaborAccount_split = LaborAccount_key_split[0].trim();
    }

    if (!wko_mst_data.wko_det_caccount) {
      ContractAccount_split = '';
    } else {
      ContractAccount_key_split = wko_mst_data.wko_det_caccount.split(':');
      ContractAccount_split = ContractAccount_key_split[0].trim();
    }

    if (!wko_mst_data.wko_det_maccount) {
      MaterialAccount_split = '';
    } else {
      MaterialAccount_key_split = wko_mst_data.wko_det_maccount.split(':');
      MaterialAccount_split = MaterialAccount_key_split[0].trim();
    }

    if (!ast_mst_data.ast_mst_asset_code) {
      AssetCode_split = '';
    } else {
      AssetCode_key_split = ast_mst_data.ast_mst_asset_code.split(':');
      AssetCode_split = AssetCode_key_split[0].trim();
    }

    if (!wko_mst_data.ast_mst_asset_status) {
      AssetStatus_split = '';
    } else {
      AssetStatus_key_split = wko_mst_data.ast_mst_asset_status.split(':');
      AssetStatus_split = AssetStatus_key_split[0].trim();
    }

    //console.log('LoginID', LoginID);
    //console.log('EmpName', EmpName);    //console.log('EmpID', EmpID);
    //console.log('EmpPhone', EmpPhone);

    let Update_WorkOrder = {
      RowID: wko_mst_data.RowID,
      site_cd: Site_cd,
      EmpID: EmpID,
      EmpName: EmpName,

      wko_mst_originator: EmployeeName_split,
      wko_mst_phone: wko_mst_data.wko_mst_phone,

      ast_mst_asset_no: wko_mst_data.wko_mst_assetno,
      ast_mst_asset_shortdesc: wko_mst_data.ast_mst_asset_shortdesc,
      ast_mst_asset_group: AssetGroupCode,
      mst_war_work_area: WorkArea,
      ast_mst_asset_locn: AssetLocation,
      ast_mst_asset_lvl: AssetLevel,
      wko_mst_chg_costcenter: CostCenter,

      wko_mst_wo_no: wko_mst_data.wko_mst_wo_no,
      wko_mst_orig_priority: OrgPriority_split[0].trim(),
      wko_mst_plan_priority: PlanPriority_split[0].trim(),
      wko_mst_org_date: org_date,
      wko_mst_due_date: due_date,
      wko_det_work_type: WorkType_split[0].trim(),
      wko_mst_flt_code: FaultCode_split[0].trim(),
      wko_mst_descs: wko_mst_data.wko_mst_descs,
      wko_mst_status: WorkOrderStatus_split[0].trim(),
      wko_det_assign_to: AssignTo_split,
      per_assignto: PerAssignTo_split,
      assign_remake: wko_mst_data.wko_det_assign_reason,

      wko_det_laccount: LaborAccount_split,
      wko_det_caccount: ContractAccount_split,
      wko_det_maccount: MaterialAccount_split,

      ast_mst_asset_code: AssetCode_split,

      dvc_id: dvc_id,
      LOGINID: LoginID,

      wko_mst_type: wko_mst_data.wko_mst_type,
      sync_step: '',
      sync_time: sync_date,
      sync_status: 'online',
      sync_url: Baseurl + '/update_workorder.php?',
    };

    console.log('UPDATE WORK ORDER: ' + JSON.stringify(Update_WorkOrder));

    try {
      const response = await axios.post( `${Baseurl}/update_workorder.php?`, JSON.stringify(Update_WorkOrder), 
      {headers: {'Content-Type': 'application/json'}});

      console.log( 'Update WKO Response:' + JSON.stringify(response.data.status), );

      if (response.data.status === 'SUCCESS') {
        console.log( 'Update WKO Response: Image lenght:' + JSON.stringify(Attachments_List), );

        if (Attachments_List.length > 0) {

          UploadImage( response.data.WorkOrderno, response.data.ROW_ID, response.data.message);

        } else {
          setspinner(false);
          setAlert( true, 'success', response.data.message, 'Online_Update_WKO', response.data.WorkOrderno, response.data.ROW_ID, );
        }
      } else {
        setspinner(false);
        setAlert(true, 'danger', response.data.message, 'OK', '', '');
      }
    } catch (error) {
      setspinner(false);
      Alert.alert( 'Error', error.message, [ { text: 'OK' } ], { cancelable: false } );
    }
  };

  //UPDATE WORK ORDER ATTACHMENTS API
  const UploadImage = async (WO_NO, ROW_ID, message) => {
    console.log('LENGTH: ' + Attachments_List.length);

    console.log('ROW_ID: ' + ROW_ID);

    const SPLIT_URL = Baseurl.split('/');
    const SPLIT_URL1 = SPLIT_URL[SPLIT_URL.length - 2];
    const SPLIT_URL2 = SPLIT_URL[SPLIT_URL.length - 1];
    const SPLIT_URL3 = SPLIT_URL1+'/'+SPLIT_URL2
    console.log('URL' + SPLIT_URL3);

    let imagelist = [];

    let data = {
      data: {
        rowid: ROW_ID,
        site_cd: Site_cd,
        EMPID: EmpID,
        LOGINID: LoginID,
        folder: SPLIT_URL3,
        dvc_id: dvc_id,
        LOGINID: LoginID,
      },
    };

    for (let i = 0; i < Attachments_List.length; i++) {
      if (Attachments_List[i].imagetype === 'New') {
        imagelist.push(Attachments_List[i]);
      }
    }
    //console.log("IMAGE PATH : "+JSON.stringify(imagelist));

    //console.log(JSON.stringify(data));
    ///console.log(Attachments_List.data);
    const formData = new FormData();

    formData.append('count', imagelist.length);
    formData.append('json', JSON.stringify(data));

    let k = 0;
    for (let i = 0; i < imagelist.length; i++) {
      const type = imagelist[i].type.split('/');
      console.log('type', type[0]);
      var t;
      if (type[0] === 'video') {
        t = '.mp4';
      } else {
        t = imagelist[i].name;
      }

      k++;
      formData.append('file_' + [k], {
        uri: imagelist[i].path,
        name: t,
        type: imagelist[i].type,
      });

      //formData.append('photo', {uri: Attachments_List[i].path,name: Attachments_List[i].name});
      // formData.append('Content-Type', 'image/png');
    }
    console.log('formData:',formData);

    //const starttime = Date.now();
    
    fetch(`${Baseurl}/update_workorder_image_file.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData, // Your FormData object
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response data here

        // const endtime = Date.now();
        // const uploadtime = endtime - starttime;
        // console.log('starttime', starttime);
        // console.log('endtime', endtime);
        // console.log('uploadtime', uploadtime);
        
        // alert('uploadtime:', uploadtime);
        console.log('success', data.status);
        if (data.status === 'SUCCESS') {
          setspinner(false);
          setAlert(true, 'success', message, 'Online_Update_WKO', WO_NO, ROW_ID, );

        }else{

          setspinner(false);
          setAlert(true, 'warning', data.message , 'OK', '', '');
        }
        
      })
      .catch((error) => {
        setspinner(false);
        Alert.alert( 'Error', error.message, [ { text: 'OK' } ], { cancelable: false } );
        console.error('Error:', error);
      });


    
  };

  //UPDATE WORK ORDER OFFLINE 
  const Update_work_order_offline = async () => {

    setspinner(true);

    var sync_date = moment().format('YYYY-MM-DD HH:mm');
    let dvc_id = DeviceInfo.getDeviceId();

    console.log('OFFLINE UPDATE LOCAL ID: ', route.params.local_id);

    let EmployeeName_split, AssetGroupCode, WorkArea, AssetLocation, AssetLevel, CostCenter,
     AssignTo_split, LaborAccount_split, ContractAccount_split, MaterialAccount_split, 
     AssetCode_split, CusCode_split,ast_mst_perm_id,ast_det_cus_code;

     if (!wko_mst_data.wko_mst_originator) {
      EmployeeName_split = '';
    } else {
     
      EmployeeName_split = wko_mst_data.wko_mst_originator;
    }

    if (!wko_mst_data.wko_mst_asset_group_code) {
      AssetGroupCode = '';
    } else {
      
      AssetGroupCode = wko_mst_data.wko_mst_asset_group_code
    }

    if (!wko_mst_data.wko_mst_work_area) {
      WorkArea = '';
    } else {
     
      WorkArea = wko_mst_data.wko_mst_work_area
    }

    if (!wko_mst_data.wko_mst_asset_location) {
      AssetLocation = '';
    } else {
     
      AssetLocation = wko_mst_data.wko_mst_asset_location
    }

    if (!wko_mst_data.wko_mst_asset_level) {
      AssetLevel = '';
    } else {
     
      AssetLevel = wko_mst_data.wko_mst_asset_level
    }

    if (!wko_mst_data.wko_mst_chg_costcenter) {
      CostCenter = '';
    } else {
      
      CostCenter = wko_mst_data.wko_mst_chg_costcenter
    }

    let OrgPriority_split = wko_mst_data.wko_mst_orig_priority
    let PlanPriority_split = wko_mst_data.wko_mst_plan_priority
    let org_date = wko_mst_data.wko_mst_orig_date + ' ' + wko_mst_data.wko_mst_orig_time;
    let due_date = wko_mst_data.wko_mst_due_date + ' ' + wko_mst_data.wko_mst_due_time;

    console.log(org_date);
    console.log(due_date);

    let WorkType_split = wko_mst_data.wko_det_work_type
    let FaultCode_split = wko_mst_data.wko_mst_flt_code
    let WorkOrderStatus_split = wko_mst_data.wko_mst_status

    if (!wko_mst_data.wko_det_assign_to) {
      AssignTo_split = '';
    } else {
      
      AssignTo_split =wko_mst_data.wko_det_assign_to
    }

    if (!wko_mst_data.wko_det_perassign_to) {
      PerAssignTo_split = '';
    } else {
     
      PerAssignTo_split = wko_mst_data.wko_det_perassign_to
    }

    if (!wko_mst_data.wko_det_laccount) {
      LaborAccount_split = '';
    } else {
     
      LaborAccount_split = wko_mst_data.wko_det_laccount
    }

    if (!wko_mst_data.wko_det_caccount) {
      ContractAccount_split = '';
    } else {
      
      ContractAccount_split = wko_mst_data.wko_det_caccount
    }

    if (!wko_mst_data.wko_det_maccount) {
      MaterialAccount_split = '';
    } else {
      
      MaterialAccount_split = wko_mst_data.wko_det_maccount
    }

    if (!wko_mst_data.ast_mst_asset_code) {
      AssetCode_split = '';
    } else {
     
      AssetCode_split = ast_mst_data.ast_mst_asset_code
    }

    if (!wko_mst_data.ast_mst_asset_status) {
      AssetStatus_split = '';
    } else {
      
      AssetStatus_split = wko_mst_data.ast_mst_asset_status
    }

    if (!wko_mst_data.ast_mst_perm_id) {
      ast_mst_perm_id = '';
    } else {
     
      ast_mst_perm_id = wko_mst_data.ast_mst_perm_id;
    }

    if (!wko_mst_data.ast_det_cus_code) {
      ast_det_cus_code = '';
    } else {
      
      ast_det_cus_code = wko_mst_data.ast_det_cus_code;
    }

    // console.log('ast_mst_perm_id', wko_mst_data.ast_mst_perm_id);
    // console.log('ast_det_cus_code', wko_mst_data.ast_det_cus_code);

    // console.log('LoginID', LoginID);
    // console.log('EmpName', EmpName);
    // console.log('EmpID', EmpID);
    // console.log('EmpPhone', EmpPhone);

    console.log('EmpPhone', EmployeeName_split,
    wko_mst_data.wko_mst_phone,
    wko_mst_data.wko_mst_assetno,
    wko_mst_data.ast_mst_asset_shortdesc,
    AssetGroupCode,
    WorkArea,
    AssetLocation,
    AssetLevel,
    CostCenter,
    wko_mst_data.wko_mst_wo_no,
    OrgPriority_split,
    PlanPriority_split,
    org_date,
    due_date,
    WorkType_split,
    FaultCode_split,
    wko_mst_data.wko_mst_descs,
    WorkOrderStatus_split,
    AssignTo_split,
    PerAssignTo_split,
    wko_mst_data.wko_det_assign_reason,
    LaborAccount_split,
    ContractAccount_split,
    MaterialAccount_split,
    AssetCode_split,
    ast_mst_perm_id,
    ast_det_cus_code,
    AssetStatus_split,
    WorkOrderNo_AutoNo,
    wko_mst_data.RowID,
    'OPEN',
    'C',
    wko_mst_data.wko_det_assign_date,
    Site_cd,
    'Update',
    route.params.local_id);
    if (!wko_mst_data.wko_mst_wo_no) {

      console.log('IS NOT EMPTY', wko_mst_data.wko_mst_wo_no);

      db.transaction(function (txn) {
        txn.executeSql(
          'UPDATE wko_mst SET wko_mst_originator=?,wko_mst_phone=?,wko_mst_assetno=?,ast_mst_asset_shortdesc=?,ast_mst_asset_group=?,wko_mst_work_area=?,wko_mst_asset_location=?,wko_mst_asset_level=?,wko_mst_chg_costcenter=?,wko_mst_wo_no=?,wko_mst_orig_priority=?,wko_mst_plan_priority=?,wko_mst_org_date=?,wko_mst_due_date=?,wko_det_work_type=?,wko_mst_flt_code=?,wko_mst_descs=?,wko_mst_status=?,wko_det_assign_to=?,per_assignto=?,per_assign_remake=?,wko_det_laccount=?,wko_det_caccount=?,wko_det_maccount=?,wko_mst_ast_cod=?,ast_mst_perm_id=?,ast_det_cus_code=?,ast_mst_asset_status=?,cnt_mst_numbering=?,RowID=?,wrk_sts_typ_cd=?,wko_mst_type=?,assigndate=?,site_cd=?,sts_column=? WHERE ID =?',
          [
            EmployeeName_split,
            wko_mst_data.wko_mst_phone,

            wko_mst_data.wko_mst_assetno,
            wko_mst_data.ast_mst_asset_shortdesc,
            AssetGroupCode,
            WorkArea,
            AssetLocation,
            AssetLevel,
            CostCenter,

            wko_mst_data.wko_mst_wo_no,
            OrgPriority_split,
            PlanPriority_split,
            org_date,
            due_date,
            WorkType_split,
            FaultCode_split,
            wko_mst_data.wko_mst_descs,
            WorkOrderStatus_split,
            AssignTo_split,
            PerAssignTo_split,
            wko_mst_data.wko_det_assign_reason,
            LaborAccount_split,
            ContractAccount_split,
            MaterialAccount_split,
            AssetCode_split,
            wko_mst_data.ast_mst_perm_id,
            wko_mst_data.ast_det_cus_code,
            AssetStatus_split,
            WorkOrderNo_AutoNo,
            wko_mst_data.RowID,
            'OPEN',
            'C',
            wko_mst_data.wko_det_assign_date,
            Site_cd,
            '',
            route.params.local_id,
          ],

          (tx, results) => {
            console.log('Results', results.rowsAffected);

            if (results.rowsAffected > 0) {
              if (Attachments_List.length > 0) {
                UPDATE_image_Offline();
              } else {
                setspinner(false);
                setAlert( true, 'success', 'Work order update successfully', 'Offline_Update_WKO', '', '');
              }
            } else {
              setspinner(false);
              setAlert( true, 'danger', 'Work order update Failed', 'OK', '', '');
              //alert('Updation Failed');
            }
          },
        );
      });
    } else {
      console.log('IS EMPTY', wko_mst_data.wko_mst_wo_no);
//
      db.transaction(function (txn) {
        txn.executeSql(
          'UPDATE wko_mst SET wko_mst_originator=?,wko_mst_phone=?,wko_mst_assetno=?,ast_mst_asset_shortdesc=?,ast_mst_asset_group=?,wko_mst_work_area=?,wko_mst_asset_location=?,wko_mst_asset_level=?,wko_mst_chg_costcenter=?,wko_mst_wo_no=?,wko_mst_orig_priority=?,wko_mst_plan_priority=?,wko_mst_org_date=?,wko_mst_due_date=?,wko_det_work_type=?,wko_mst_flt_code=?,wko_mst_descs=?,wko_mst_status=?,wko_det_assign_to=?,per_assignto=?,per_assign_remake=?,wko_det_laccount=?,wko_det_caccount=?,wko_det_maccount=?,wko_mst_ast_cod=?,ast_mst_perm_id=?,ast_det_cus_code=?,ast_mst_asset_status=?,cnt_mst_numbering=?,RowID=?,wrk_sts_typ_cd=?,wko_mst_type=?,assigndate=?,site_cd=?,sts_column=? WHERE ID =?',
          [
            EmployeeName_split,
            wko_mst_data.wko_mst_phone,
            wko_mst_data.wko_mst_assetno,
            wko_mst_data.ast_mst_asset_shortdesc,
            AssetGroupCode,
            WorkArea,
            AssetLocation,
            AssetLevel,
            CostCenter,
            wko_mst_data.wko_mst_wo_no,
            OrgPriority_split,
            PlanPriority_split,
            org_date,
            due_date,
            WorkType_split,
            FaultCode_split,
            wko_mst_data.wko_mst_descs,
            WorkOrderStatus_split,
            AssignTo_split,
            PerAssignTo_split,
            wko_mst_data.wko_det_assign_reason,
            LaborAccount_split,
            ContractAccount_split,
            MaterialAccount_split,
            AssetCode_split,
            ast_mst_perm_id,
            ast_det_cus_code,
            AssetStatus_split,
            WorkOrderNo_AutoNo,
            wko_mst_data.RowID,
            'OPEN',
            'C',
            wko_mst_data.wko_det_assign_date,
            Site_cd,
            'Update',
            route.params.local_id,
          ],

          (tx, results) => {
            console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              if (Attachments_List.length > 0) {
                UPDATE_image_Offline();
              } else {
                setspinner(false);
                setAlert( true, 'success', 'Work order update successfully', 'Offline_Update_WKO', '', '', );
              }
            } else {
              setspinner(false);
              //alert('Updation Failed');
              setAlert( true, 'danger', 'Work order update Failed', 'OK', '', '', );
            }
          },
        );
      });
    }
  };

  //UPDATE WORK ORDER ATTACHMENT OFFLINE
  const UPDATE_image_Offline = async () => {

    console.log('LENGTH: IMAGE  ' + Attachments_List.length);

    for (let i = 0; i < Attachments_List.length; i++) {


      let filename = Attachments_List[i].name;
      let localpath = Attachments_List[i].path;
      let exist = Attachments_List[i].imagetype;
      let type =Attachments_List[i].type

      if (exist === 'Exist') {

      } else {

        db.transaction(function (tx) {


          if (!mst_RowID) {
           

            tx.executeSql( 'INSERT INTO wko_ref (site_cd,type,file_name,ref_type,Exist,Local_link,local_id) VALUES (?,?,?,?,?,?,?)',
              [ Site_cd, type, filename, 'Gallery_image', exist, localpath, route.params.local_id],
              (tx, results) => {
                //console.log('wko_ref Results_test', results.rowsAffected);
                if (results.rowsAffected > 0) {
                  console.log('INSERT TABLE wko_ref Successfully');
                } else {
                  setspinner(false);
                  alert('INSERT TABLE wko_ref Failed');
                }
              },
            );
          } else {
            

            tx.executeSql( 'INSERT INTO wko_ref (site_cd,type,file_name,ref_type,Exist,Local_link,local_id,mst_RowID) VALUES (?,?,?,?,?,?,?,?)',
              [ Site_cd, type, filename, 'Gallery_image', exist, localpath, route.params.local_id, route.params.RowID ],
              (tx, results) => {
                //console.log('wko_ref Results_test', results.rowsAffected);
                if (results.rowsAffected > 0) {
                  console.log('INSERT TABLE wko_ref Successfully');
                } else {
                  setspinner(false);
                  alert('INSERT TABLE wko_ref Failed');
                }
              },
            );
          }
        });
      }
    }

    setspinner(false);
    setAlert( true, 'success', 'Work order update successfully', 'Offline_Update_WKO', '', '', );
  };


  //Same Screen
  const get_SameScreen = (Wo_no, Wo_rowid) => {
    setToolbartext('Edit Work Order');
    setSubmitButton('Edit');
    setSubmitButtonColor('#0096FF');
    setEditable(true);

    setAssigtohistory_Visible(true);

    if (WIFI == 'OFFLINE') {

      get_workorder_list_offline ()
    }else{
      get_workorder_list(Wo_no, Wo_rowid);
    }
   

  };

  //MORE BUTTON ONCLICK OPTIONS
  const get_more = async () => {
    console.log('button' + SubmitButton);
    console.log('PurchasingInfo_Visible' + PurchasingInfo_Visible);


    if (SubmitButton == 'Save') {
      
      setAlert( true, 'warning', 'You must save work order before you go into more options...', 'OK', '', '', );
    } else if (SubmitButton == 'Update') {
      
      setAlert( true, 'warning', 'You must update work order before you go into more options...', 'OK', '', '', );
    } else if (SubmitButton == 'Work Order Completed') {
    
      setAlert(true, 'warning', 'Work order is completed...', 'OK', '', '');
    }else if (SubmitButton == 'Work Order Closed') {
      
      setAlert(true, 'warning', 'Work order is Closed...', 'OK', '', '');
    } else {

      if (wko_mst_data.wko_mst_type == 'G' || wko_mst_data.wko_mst_type == 'P') {
       // setAssetDowntime_Visible(false);
        setSubWorkorder_Visible(true)
      }else{

        setSubWorkorder_Visible(false)
      }

      if (WIFI == 'OFFLINE') {

        setwko_mst_data({...wko_mst_data,

          response: Response_color,
          chargeable: Chargeable_color,
          acknowledgement: Acknowledgement_color,
          timecard:TimaeCard_Count,
          checkListcount: CheckList_Count,
          assetdowntime: AssetDowntime_Count

        })

      }

      setMoreVisible(!isMoreVisible);
    }
  };


  //Assign History
  const get_assign_history = async () => {
    setspinner(true);
    try {
      console.log( 'Assign History' + `${Baseurl}/get_assign_history.php?site_cd=${Site_cd}&mst_RowID=${wko_mst_data.RowID}`);
      //const response = await axios.get( `${Baseurl}/get_assign_history.php?site_cd=${Site_cd}&mst_RowID=${wko_mst_data.RowID}`);
      const response = await axios.get( `https://evantage.ddns.net:80/react_mob_dev/7.6/get_assign_history.php?site_cd=MSW&mst_RowID=602675`);
      //console.log('Assign History Response : ' + response.data.status);

      if (response.data.status === 'SUCCESS') {
        if (response.data.data.length > 0) {
          //console.log(response.data.status)
          //console.log(response.data.message)
          //console.log(response.data.data)
          setAssignHistory_modalVisible(!AssignHistory_modalVisible);
         // setAssignHistorystep(response.data.data.length)
           setAssignHistory_data(response.data.data);
           setAssignHistory_FilteredData(response.data.data);

          // for (let i = 0; i < response.data.data.length; ++i) {

          //   let name  = response.data.data[i].wko_ls7_emp_id
          
          //   console.log("JSON DATA : " + name)

          //   setAssignHistory_data(name);
            

          // }

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

  const AssignHistory_ItemView = ({item,index}) => {
    let orgdate, duedate, assigndate, re_assigndate;
    let Org_Date = moment(item.wko_ls7_wo_org_date.date).format('MMM-DD HH:mm');
    
    if (Org_Date === '1900-01-01 00:00') {
      orgdate = '';
    } else {
      orgdate = Org_Date;
    }

    let Due_Date = moment(item.wko_ls7_due_date.date).format( 'yyyy-MM-DD HH:mm');
    //console.log(Org_Date)
    if (Due_Date === '1900-01-01 00:00') {
      duedate = '';
    } else {
      duedate = Due_Date;
    }

    let Assign_Date = moment(item.audit_date.date).format('yyyy-MM-DD HH:mm');
    //console.log(Org_Date)
    if (Assign_Date === '1900-01-01 00:00') {
      assigndate = '';
    } else {
      assigndate = Assign_Date;
    }

    let Re_Assign_Date = moment(item.wko_ls7_date3.date).format( 'yyyy-mm-DD HH:mm');
    //console.log(Org_Date)
    if (Re_Assign_Date === '1900-01-01 00:00') {
      re_assigndate = '';
    } else {
      re_assigndate = Re_Assign_Date;
    }

    // let iname;
    // if(index === 0){

    //  iname = true

    // }else{

    //   iname  = flase
    // }

    const isend = index === AssignHistory_data.length - 1;
    //console.log("index1",isend )

    let col, vis
    if(isend){
      //console.log("indexif" )

      col ="#FF0000"
      vis = false
    }else{
      //console.log("index-lese" )

      col ="#05375a"
      vis = true
    }

    return (

       <TouchableOpacity >
        <View style={{ flex: 1,paddingLeft: 10, borderRadius: 10,paddingRight:10}}>
          <View style={{ alignItems: 'center',flexDirection: 'row',}}>

            <Text style={{color: col, fontSize: 12, marginLeft:5,marginBottom:vis ? 30 : -10,width:"20%", }}>{orgdate}</Text>

            <View style={{ alignItems: 'center', marginTop:5,marginLeft:-5  }}>

              <View style={{marginTop:vis ? 5 : 0}}>
               <MaterialCommunityIcons
                name={vis ? 'checkbox-blank-circle-outline' : 'cog-sync-outline' }
                color={'#05375a'}
                size={vis ? 15 : 20 }/>
              </View>
                <View style={{ height: 50, width: 1, backgroundColor: '#C8C8C8',marginTop:5 ,display: vis ? 'flex' : 'none'}} />

            </View>

            <View style={{  marginTop:5,marginLeft:10,marginBottom:vis ? 20 : -5  }}>

              <Text style={{flex: 1,color: col, fontSize: 12}}>{item.wko_ls7_emp_id}</Text>

              <Text style={{flex: 1,color: col, fontSize: 12,marginTop:vis ? 5 : 0 }}>{item.column1}</Text>

            </View>
          </View>
          
        </View>
      </TouchableOpacity>

      // <TouchableOpacity>
      //   <View style={{ margin: 10, padding: 10, borderRadius: 10, backgroundColor: '#fff', }}>
      //     <View style={{flexDirection: 'row', marginTop: 10}}>
      //       <View style={{flex: 1}}>
      //         <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Employee : </Text>
      //       </View>
      //       <View style={{flex: 1}}>
      //         <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.wko_ls7_emp_id} </Text>
      //       </View>
      //     </View>

      //     <View style={{flexDirection: 'row', marginTop: 5}}>
      //       <View style={{flex: 1}}>
      //         <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Start Date : </Text>
      //       </View>
      //       <View style={{flex: 1}}>
      //         <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {orgdate} </Text>
      //       </View>
      //     </View>

      //     <View style={{flexDirection: 'row', marginTop: 5}}>
      //       <View style={{flex: 1}}>
      //         <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Due Date : </Text>
      //       </View>
      //       <View style={{flex: 1}}>
      //         <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {duedate} </Text>
      //       </View>
      //     </View>

      //     <View style={{flexDirection: 'row', marginTop: 5}}>
      //       <View style={{flex: 1}}>
      //         <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Assignment Date : </Text>
      //       </View>

      //       <View style={{flex: 1}}>
      //         <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {assigndate} </Text>
      //       </View>
      //     </View>

      //     <View style={{flexDirection: 'row', marginTop: 5}}>
      //       <View style={{flex: 1}}>
      //         <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Re-Assignment Date : </Text>
      //       </View>
      //       <View style={{flex: 1}}>
      //         <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {re_assigndate} </Text>
      //       </View>
      //     </View>

      //     <View style={{flexDirection: 'row', marginTop: 5}}>
      //       <View style={{flex: 1}}>
      //         <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Remark : </Text>
      //       </View>
      //       <View style={{flex: 1}}>
      //         <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.column1} </Text>
      //       </View>
      //     </View>
      //   </View>
      // </TouchableOpacity>
    );
  };

  const AssignHistory_ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View style={{ height: 0, width: '100%', backgroundColor: '#C8C8C8', }} />
    );
  };


  //insight 
  const get_insight = async () => {

    console.log('Asset Master Data: ' , wko_mst_data.wko_mst_assetno);
    setspinner(true);

    Asset_retrieve = {
      site_cd: Site_cd,
      ast_mst_asset_no: wko_mst_data.wko_mst_assetno
    };

  console.log('Asset Master Data: ' + JSON.stringify(Asset_retrieve));

    try {
      
      const response = await axios.post( `${Baseurl}/get_insight.php?`, JSON.stringify(Asset_retrieve), );
      //console.log('Assign History Response : ' + response.data.status);

      if (response.data.status === 'SUCCESS') {
        if (response.data.data.length > 0) {
          
          setInsing_Visible(!Insing_Visible);
          setInsing_list(response.data.data);
          
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

  const Insing_ItemView = ({item}) => {
    // console.log(item)
    // console.log(item.ast_det_warranty_date)
    // console.log(item.ast_det_warranty_date.date)

    let orgdate,days,color_sts
    let Org_Date = moment(item.ast_det_warranty_date.date).format('DD-MM-yyyy');
    
    if (Org_Date === '01-01-1900') {
      orgdate = '';
    } else {
      orgdate = Org_Date;

      const start = new Date();
      const end   = new Date(item.ast_det_warranty_date.date);

      // const startDate = new Date('2023-11-28');
      // const endDate = new Date('2024-11-28');

      // Calculate the difference in days using date-fns
      const daysDifference = differenceInDays(end, start);

      if(daysDifference > 0){


        console.log('Days Difference if:', daysDifference);
        color_sts = '#82E0AA';
        days = ' ( '+ 'Valid ' + daysDifference +' days left'+' ) ';
      }else{
        console.log('Days Difference else:', daysDifference);
        color_sts = '#FA8072';
        days = ' ( '+ 'Expired ' + Math.abs(daysDifference) +' days ago'+' ) ';
      }

      
    }

    

    return (
      
      <View style={{flex: 1,backgroundColor: '#fff', padding:15 }}>

        {/* <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
          <MaterialIcons name="work-outline" color="#2C3E50" size={20} style={{marginRight:8}} />
          <Text placeholder="Test" style={{color:'#34495E',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:15}} >{'ASSET'}</Text>
        </View>

        <View style={{ height: 1, width: '100%', backgroundColor: '#C8C8C8',marginTop: 10}} /> */}

        <View style={{flexDirection: 'row', marginTop: 10}}>
          <View style={{width: '40%'}}>
              <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                <Feather name="box" color="#2C3E50" size={20} style={{marginRight:8, marginTop:4}}/>
                <Text placeholder="Test" style={{ color: '#000', fontWeight: 'bold', justifyContent: 'flex-start',fontSize:13}}>Asset No</Text>
              </View>
            
          </View>
          <View style={{flex: 1,justifyContent: 'center',}}>
            <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000',fontSize:13}}>{item.ast_mst_asset_no} </Text>
          </View>
        </View>

        <View style={{flexDirection: 'row', marginTop: 5}}>
          <View style={{width: '40%'}}>
              <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                <Feather name="file-text" color="#2C3E50" size={20} style={{marginRight:8, marginTop:4}}/>
                <Text placeholder="Test" style={{ color: '#000', fontWeight: 'bold', justifyContent: 'flex-start',fontSize:13}}>Description</Text>
              </View>
            
          </View>
          <View style={{flex: 1,justifyContent: 'center',}}>
            <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000',fontSize:13}}>{item.ast_mst_asset_shortdesc}
            </Text>
          </View>
        </View>

        {/* <View style={{flex:1,flexDirection:'row',alignItems:'center',marginTop: 25}}>
          <MaterialIcons name="addchart" color="#2C3E50" size={20} style={{marginRight:8, marginTop:4}} />
          <Text placeholder="Test" style={{color:'#34495E',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:20}} >{'ASSET INFORMATION'}</Text>
        </View> */}
          
        <View style={{ height: 1, width: '100%', backgroundColor: '#C8C8C8',marginTop: 10}} />

        <View style={{flexDirection: 'row', marginTop: 10}}>
          <View style={{width: '40%'}}>
              <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                <AntDesign name="calendar" color="#2C3E50" size={20} style={{marginRight:8, marginTop:4}}/>
                <Text placeholder="Test" style={{ color: '#000', fontWeight: 'bold', justifyContent: 'flex-start',fontSize:13}}>Warranty Date</Text>
              </View>
            
          </View>
          <View style={{flex: 1}}>
            <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000',fontSize:13}}>{orgdate}
            </Text>
          </View>
        </View>

        <View style={{flexDirection: 'row', marginTop: 5}}>
          <View style={{width: '40%'}}>
            <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start'}}></Text>
          </View>
          <View style={{flex: 1,alignItems:'center'}}>
            <View style={{flex: 1,alignItems:'center'}}>
              <Text placeholder="Test" style={{ fontWeight: 'bold', color: '#FFFF',fontSize:13,backgroundColor: color_sts, padding: 5, borderRadius: 10}}>{days}
              </Text>
            </View>
          </View>
        </View>

        

          
      </View>
      
    );
  };
  
    


  //Attachement File
  const Attachments_ItemView = ({item}) => {

    //console.log('ITEM PATH:' + JSON.stringify(item));
     const type = item.type.split('/');
    //console.log('loop type', type[0]);
     
 
     return (
       
 
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

      setType_link('image');
      //console.log('show KEY:', linkindex);

      console.log('show list', JSON.stringify(images_link));

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
      item => item?.localIdentifier && item?.localIdentifier !== value?.localIdentifier,
    );
    setAttachments_List(data);


    const images_list_data = images_list.filter(
      item => item?.localIdentifier && item?.localIdentifier !== value?.localIdentifier,
    );
    setimages_list(images_list_data);

    const images_link_data = images_link.filter(
      item => item?.localIdentifier && item?.localIdentifier !== value?.localIdentifier,
    );
    setimages_link(images_link_data);
  };

  const DeleteImage = async value => {

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
      Alert.alert( 'Error', error.message, [ { text: 'OK' } ], { cancelable: false } );
    }

    
  };



  const cv_response = () => {
    console.log('SCREEN NAME', route.params.Screenname);

    setMoreVisible(!isMoreVisible);

    let CostCenter, LaborAccount_split,ContractAccount_split, MaterialAccount_split;

    if (!wko_mst_data.wko_mst_chg_costcenter) {
      CostCenter = '';
    } else {
      CostCenter_split = wko_mst_data.wko_mst_chg_costcenter.split(':');
      CostCenter = CostCenter_split[0].trim();
    }

    if (!wko_mst_data.wko_det_laccount) {
      LaborAccount_split = '';
    } else {
      LaborAccount_key_split = wko_mst_data.wko_det_laccount.split(':');
      LaborAccount_split = LaborAccount_key_split[0].trim();
    }

    if (!wko_mst_data.wko_det_caccount) {
      ContractAccount_split = '';
    } else {
      ContractAccount_key_split = wko_mst_data.wko_det_caccount.split(':');
      ContractAccount_split = ContractAccount_key_split[0].trim();
    }

    if (!wko_mst_data.wko_det_maccount) {
      MaterialAccount_split = '';
    } else {
      MaterialAccount_key_split = wko_mst_data.wko_det_maccount.split(':');
      MaterialAccount_split = MaterialAccount_key_split[0].trim();
    }

    if (route.params.Screenname == 'FilteringWorkOrder') {
      navigation.navigate('Response', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        //no need back
        Selected_AssetNo: wko_mst_data.wko_mst_assetno,
        Selected_CostCenter: CostCenter,
        Selected_LaborAccount: LaborAccount_split,
        Selected_ContractAccount: ContractAccount_split,
        Selected_MaterialAccount: MaterialAccount_split,

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
      navigation.navigate('Response', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        //no need back
        Selected_AssetNo: wko_mst_data.wko_mst_assetno,
        Selected_CostCenter: CostCenter,
        Selected_LaborAccount: LaborAccount_split,
        Selected_ContractAccount: ContractAccount_split,
        Selected_MaterialAccount: MaterialAccount_split,

        local_id: route.params.local_id,
        Selected_wko_mst_ast_cod: route.params.Selected_wko_mst_ast_cod,
        Selected_wko_mst_type: route.params.Selected_wko_mst_type,
        Screenname: route.params.Screenname,
      });
    } else if (route.params.Screenname == 'WoDashboard' || route.params.Screenname == 'MYWO_Dashboard_Due' || route.params.Screenname == 'MYWO_Dashboard_Past') {
      navigation.navigate('Response', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        //no need back
        Selected_AssetNo: wko_mst_data.wko_mst_assetno,
        Selected_CostCenter: CostCenter,
        Selected_LaborAccount: LaborAccount_split,
        Selected_ContractAccount: ContractAccount_split,
        Selected_MaterialAccount: MaterialAccount_split,

        local_id: route.params.local_id,
        Selected_wko_mst_ast_cod: route.params.Selected_wko_mst_ast_cod,
        Selected_wko_mst_type: route.params.Selected_wko_mst_type,

        Screenname: route.params.Screenname,
        type: route.params.type,
      });
    } else if (route.params.Screenname == 'ScanAssetMaster') {
      navigation.navigate('Response', {});

      if (route.params.ScanAssetType == 'New') {
      } else if (route.params.ScanAssetType == 'Edit') {
        navigation.navigate('Response', {
          Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
          RowID: route.params.RowID,

          //no need back
          Selected_AssetNo: wko_mst_data.wko_mst_assetno,
          Selected_CostCenter: CostCenter,
          Selected_LaborAccount: LaborAccount_split,
          Selected_ContractAccount: ContractAccount_split,
          Selected_MaterialAccount: MaterialAccount_split,

          Screenname: route.params.Screenname,
          ScanAssetType: route.params.ScanAssetType,
          ScanAssetno: route.params.ScanAssetno,
          ScanAssetRowID: route.params.ScanAssetRowID,
        });
      }
    } else if (route.params.Screenname == 'AssetListing') {
      navigation.navigate('Response', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        //no need back
        Selected_AssetNo: wko_mst_data.wko_mst_assetno,
        Selected_CostCenter: CostCenter,
        Selected_LaborAccount: LaborAccount_split,
        Selected_ContractAccount: ContractAccount_split,
        Selected_MaterialAccount: MaterialAccount_split,

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

  const cv_chargeable = () => {
    setMoreVisible(!isMoreVisible);

    if (route.params.Screenname == 'FilteringWorkOrder') {
      navigation.navigate('Chargeable', {
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
      navigation.navigate('Chargeable', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        local_id: route.params.local_id,
        Selected_wko_mst_ast_cod: route.params.Selected_wko_mst_ast_cod,
        Selected_wko_mst_type: route.params.Selected_wko_mst_type,
        Screenname: route.params.Screenname,
      });
    }else if (route.params.Screenname == 'WoDashboard' || route.params.Screenname == 'MYWO_Dashboard_Due' || route.params.Screenname == 'MYWO_Dashboard_Past') {
      navigation.navigate('Chargeable', {
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
      } else if (route.params.ScanAssetType == 'Edit') {
        navigation.navigate('Chargeable', {
          Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
          RowID: route.params.RowID,

          Screenname: route.params.Screenname,
          ScanAssetType: route.params.ScanAssetType,
          ScanAssetno: route.params.ScanAssetno,
          ScanAssetRowID: route.params.ScanAssetRowID,
        });
      }
    } else if (route.params.Screenname == 'AssetListing') {
      navigation.navigate('Chargeable', {
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

  const cv_acknowledgement = () => {
    setMoreVisible(!isMoreVisible);

    if (route.params.Screenname == 'FilteringWorkOrder') {
      navigation.navigate('Ackowledgement', {
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
      navigation.navigate('Ackowledgement', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        local_id: route.params.local_id,
        Selected_wko_mst_ast_cod: route.params.Selected_wko_mst_ast_cod,
        Selected_wko_mst_type: route.params.Selected_wko_mst_type,
        Screenname: route.params.Screenname,
      });
    } else if (route.params.Screenname == 'WoDashboard' || route.params.Screenname == 'MYWO_Dashboard_Due' || route.params.Screenname == 'MYWO_Dashboard_Past') {
      navigation.navigate('Ackowledgement', {
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
      } else if (route.params.ScanAssetType == 'Edit') {
        navigation.navigate('Ackowledgement', {
          Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
          RowID: route.params.RowID,

          Screenname: route.params.Screenname,
          ScanAssetType: route.params.ScanAssetType,
          ScanAssetno: route.params.ScanAssetno,
          ScanAssetRowID: route.params.ScanAssetRowID,
        });
      }
    } else if (route.params.Screenname == 'AssetListing') {
      navigation.navigate('Ackowledgement', {
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

  const cv_wo_completion = () => {
    setMoreVisible(!isMoreVisible);

    let EmployeeName_split,WorkArea,AssetLocation, AssetLevel, CostCenter,LaborAccount_split, ContractAccount_split, MaterialAccount_split;

    let WorkOrderStatus_split = wko_mst_data.wko_mst_status.split(':');

    if (!wko_mst_data.wko_mst_originator) {
      EmployeeName_split = '';
    } else {
      Employee_split = wko_mst_data.wko_mst_originator.split(':');
      EmployeeName_split = Employee_split[0].trim();
    }

    if (!wko_mst_data.wko_mst_work_area) {
      WorkArea = '';
    } else {
      WorkArea_split = wko_mst_data.wko_mst_work_area.split(':');
      WorkArea = WorkArea_split[0].trim();
    }

    if (!wko_mst_data.wko_mst_asset_location) {
      AssetLocation = '';
    } else {
      AssetLocation_split = wko_mst_data.wko_mst_asset_location.split(':');
      AssetLocation = AssetLocation_split[0].trim();
    }

    if (!wko_mst_data.wko_mst_asset_level) {
      AssetLevel = '';
    } else {
      AssetLevel_split = wko_mst_data.wko_mst_asset_level.split(':');
      AssetLevel = AssetLevel_split[0].trim();
    }

    if (!wko_mst_data.wko_mst_chg_costcenter) {
      CostCenter = '';
    } else {
      CostCenter_split = wko_mst_data.wko_mst_chg_costcenter.split(':');
      CostCenter = CostCenter_split[0].trim();
    }

    if (!wko_mst_data.wko_det_laccount) {
      LaborAccount_split = '';
    } else {
      LaborAccount_key_split = wko_mst_data.wko_det_laccount.split(':');
      LaborAccount_split = LaborAccount_key_split[0].trim();
    }

    if (!wko_mst_data.wko_det_caccount) {
      ContractAccount_split = '';
    } else {
      ContractAccount_key_split = wko_mst_data.wko_det_caccount.split(':');
      ContractAccount_split = ContractAccount_key_split[0].trim();
    }

    if (!wko_mst_data.wko_det_maccount) {
      MaterialAccount_split = '';
    } else {
      MaterialAccount_key_split = wko_mst_data.wko_det_maccount.split(':');
      MaterialAccount_split = MaterialAccount_key_split[0].trim();
    }

    if (route.params.Screenname == 'FilteringWorkOrder') {
      navigation.navigate('WorkOrderCompletion', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        //no need back
        Selected_Employee: EmployeeName_split,
        Selected_PhoneNo: wko_mst_data.wko_mst_phone,

        Selected_WorkOrderDesc: wko_mst_data.wko_mst_descs,
        Selected_WorkOrderStatus: WorkOrderStatus_split[0].trim(),

        Selected_OrgDate: wko_mst_data.wko_mst_orig_date + ' ' + wko_mst_data.wko_mst_orig_time,
        Selected_DueDate: wko_mst_data.wko_mst_due_date + ' ' + wko_mst_data.wko_mst_due_time,

        Selected_AssetNo: wko_mst_data.wko_mst_assetno,
        Selected_AssetDesc: wko_mst_data.ast_mst_asset_shortdesc,
        Selected_WorkArea: WorkArea,
        Selected_AssetLocation: AssetLocation,
        Selected_AssetLevel: AssetLevel,

        Selected_CostCenter: CostCenter,
        Selected_LaborAccount: LaborAccount_split,
        Selected_ContractAccount: ContractAccount_split,
        Selected_MaterialAccount: MaterialAccount_split,

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
      navigation.navigate('WorkOrderCompletion', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        //no need back
        Selected_Employee: EmployeeName_split,
        Selected_PhoneNo: wko_mst_data.wko_mst_phone,

        Selected_WorkOrderDesc: wko_mst_data.wko_mst_descs,
        Selected_WorkOrderStatus: WorkOrderStatus_split[0].trim(),

        Selected_OrgDate: wko_mst_data.wko_mst_orig_date + ' ' + wko_mst_data.wko_mst_orig_time,
        Selected_DueDate: wko_mst_data.wko_mst_due_date + ' ' + wko_mst_data.wko_mst_due_time,

        Selected_AssetNo: wko_mst_data.wko_mst_assetno,
        Selected_AssetDesc: wko_mst_data.ast_mst_asset_shortdesc,
        Selected_WorkArea: WorkArea,
        Selected_AssetLocation: AssetLocation,
        Selected_AssetLevel: AssetLevel,

        Selected_CostCenter: CostCenter,
        Selected_LaborAccount: LaborAccount_split,
        Selected_ContractAccount: ContractAccount_split,
        Selected_MaterialAccount: MaterialAccount_split,

        local_id: route.params.local_id,
        Selected_wko_mst_ast_cod: route.params.Selected_wko_mst_ast_cod,
        Selected_wko_mst_type: route.params.Selected_wko_mst_type,
        Screenname: route.params.Screenname,
      });
    }else if (route.params.Screenname == 'WoDashboard' || route.params.Screenname == 'MYWO_Dashboard_Due' || route.params.Screenname == 'MYWO_Dashboard_Past') {
      navigation.navigate('WorkOrderCompletion', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        //no need back
        //no need back
        Selected_Employee: EmployeeName_split,
        Selected_PhoneNo: wko_mst_data.wko_mst_phone,

        Selected_WorkOrderDesc: wko_mst_data.wko_mst_descs,
        Selected_WorkOrderStatus: WorkOrderStatus_split[0].trim(),

        Selected_OrgDate: wko_mst_data.wko_mst_orig_date + ' ' + wko_mst_data.wko_mst_orig_time,
        Selected_DueDate: wko_mst_data.wko_mst_due_date + ' ' + wko_mst_data.wko_mst_due_time,

        Selected_AssetNo: wko_mst_data.wko_mst_assetno,
        Selected_AssetDesc: wko_mst_data.ast_mst_asset_shortdesc,
        Selected_WorkArea: WorkArea,
        Selected_AssetLocation: AssetLocation,
        Selected_AssetLevel: AssetLevel,

        Selected_CostCenter: CostCenter,
        Selected_LaborAccount: LaborAccount_split,
        Selected_ContractAccount: ContractAccount_split,
        Selected_MaterialAccount: MaterialAccount_split,

        local_id: route.params.local_id,
        Selected_wko_mst_ast_cod: route.params.Selected_wko_mst_ast_cod,
        Selected_wko_mst_type: route.params.Selected_wko_mst_type,

        Screenname: route.params.Screenname,
        type: route.params.type,
      });
    } else if (route.params.Screenname == 'ScanAssetMaster') {
      if (route.params.ScanAssetType == 'New') {
      } else if (route.params.ScanAssetType == 'Edit') {
        navigation.navigate('WorkOrderCompletion', {
          Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
          RowID: route.params.RowID,

          //no need back
          Selected_Employee: EmployeeName_split,
          Selected_PhoneNo: wko_mst_data.wko_mst_phone,

          Selected_WorkOrderDesc: wko_mst_data.wko_mst_descs,
          Selected_WorkOrderStatus: WorkOrderStatus_split[0].trim(),

          Selected_OrgDate: wko_mst_data.wko_mst_orig_date + ' ' + wko_mst_data.wko_mst_orig_time,
          Selected_DueDate: wko_mst_data.wko_mst_due_date + ' ' + wko_mst_data.wko_mst_due_time,

          Selected_AssetNo: wko_mst_data.wko_mst_assetno,
          Selected_AssetDesc: wko_mst_data.ast_mst_asset_shortdesc,
          Selected_WorkArea: WorkArea,
          Selected_AssetLocation: AssetLocation,
          Selected_AssetLevel: AssetLevel,

          Selected_CostCenter: CostCenter,
          Selected_LaborAccount: LaborAccount_split,
          Selected_ContractAccount: ContractAccount_split,
          Selected_MaterialAccount: MaterialAccount_split,

          Screenname: route.params.Screenname,
          ScanAssetType: route.params.ScanAssetType,
          ScanAssetno: route.params.ScanAssetno,
          ScanAssetRowID: route.params.ScanAssetRowID,
        });
      }
    } else if (route.params.Screenname == 'AssetListing') {
      navigation.navigate('WorkOrderCompletion', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        //no need back
        Selected_Employee: EmployeeName_split,
        Selected_PhoneNo: wko_mst_data.wko_mst_phone,

        Selected_WorkOrderDesc: wko_mst_data.wko_mst_descs,
        Selected_WorkOrderStatus: WorkOrderStatus_split[0].trim(),

        Selected_OrgDate: wko_mst_data.wko_mst_orig_date + ' ' + wko_mst_data.wko_mst_orig_time,
        Selected_DueDate: wko_mst_data.wko_mst_due_date + ' ' + wko_mst_data.wko_mst_due_time,

        Selected_AssetNo: wko_mst_data.wko_mst_assetno,
        Selected_AssetDesc: wko_mst_data.ast_mst_asset_shortdesc,
        Selected_WorkArea: WorkArea,
        Selected_AssetLocation: AssetLocation,
        Selected_AssetLevel: AssetLevel,

        Selected_CostCenter: CostCenter,
        Selected_LaborAccount: LaborAccount_split,
        Selected_ContractAccount: ContractAccount_split,
        Selected_MaterialAccount: MaterialAccount_split,

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

  const cv_contract_services = () => {
    setMoreVisible(!isMoreVisible);

    let CostCenter, LaborAccount_split,ContractAccount_split, MaterialAccount_split;

    if (!wko_mst_data.wko_mst_chg_costcenter) {
      CostCenter = '';
    } else {
      CostCenter_split = wko_mst_data.wko_mst_chg_costcenter.split(':');
      CostCenter = CostCenter_split[0].trim();
    }

    if (!wko_mst_data.wko_det_laccount) {
      LaborAccount_split = '';
    } else {
      LaborAccount_key_split = wko_mst_data.wko_det_laccount.split(':');
      LaborAccount_split = LaborAccount_key_split[0].trim();
    }

    if (!wko_mst_data.wko_det_caccount) {
      ContractAccount_split = '';
    } else {
      ContractAccount_key_split = wko_mst_data.wko_det_caccount.split(':');
      ContractAccount_split = ContractAccount_key_split[0].trim();
    }

    if (!wko_mst_data.wko_det_maccount) {
      MaterialAccount_split = '';
    } else {
      MaterialAccount_key_split = wko_mst_data.wko_det_maccount.split(':');
      MaterialAccount_split = MaterialAccount_key_split[0].trim();
    }

    if (route.params.Screenname == 'FilteringWorkOrder') {
      navigation.navigate('ContractService', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        //no need back
        Selected_AssetNo: wko_mst_data.wko_mst_assetno,
        Selected_CostCenter: CostCenter,
        Selected_LaborAccount: LaborAccount_split,
        Selected_ContractAccount: ContractAccount_split,
        Selected_MaterialAccount: MaterialAccount_split,
        Selected_PMGroupType: wko_mst_data.wko_mst_type,

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
      navigation.navigate('ContractService', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        //no need back
        Selected_AssetNo: wko_mst_data.wko_mst_assetno,
        Selected_CostCenter: CostCenter,
        Selected_LaborAccount: LaborAccount_split,
        Selected_ContractAccount: ContractAccount_split,
        Selected_MaterialAccount: MaterialAccount_split,
        Selected_PMGroupType: wko_mst_data.wko_mst_type,

        local_id: route.params.local_id,
        Selected_wko_mst_ast_cod: route.params.Selected_wko_mst_ast_cod,
        Selected_wko_mst_type: route.params.Selected_wko_mst_type,
        Screenname: route.params.Screenname,
      });
    } else if (route.params.Screenname == 'WoDashboard' || route.params.Screenname == 'MYWO_Dashboard_Due' || route.params.Screenname == 'MYWO_Dashboard_Past') {
      navigation.navigate('ContractService', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        //no need back
        Selected_AssetNo: wko_mst_data.wko_mst_assetno,
        Selected_CostCenter: CostCenter,
        Selected_LaborAccount: LaborAccount_split,
        Selected_ContractAccount: ContractAccount_split,
        Selected_MaterialAccount: MaterialAccount_split,
        Selected_PMGroupType: wko_mst_data.wko_mst_type,

        local_id: route.params.local_id,
        Selected_wko_mst_ast_cod: route.params.Selected_wko_mst_ast_cod,
        Selected_wko_mst_type: route.params.Selected_wko_mst_type,

        Screenname: route.params.Screenname,
        type: route.params.type,
      });
    } else if (route.params.Screenname == 'ScanAssetMaster') {
      navigation.navigate('ContractService', {});

      if (route.params.ScanAssetType == 'New') {
      } else if (route.params.ScanAssetType == 'Edit') {
        navigation.navigate('ContractService', {
          Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
          RowID: route.params.RowID,

          //no need back
          Selected_AssetNo: wko_mst_data.wko_mst_assetno,
          Selected_CostCenter: CostCenter,
          Selected_LaborAccount: LaborAccount_split,
          Selected_ContractAccount: ContractAccount_split,
          Selected_MaterialAccount: MaterialAccount_split,
          Selected_PMGroupType: wko_mst_data.wko_mst_type,

          Screenname: route.params.Screenname,
          ScanAssetType: route.params.ScanAssetType,
          ScanAssetno: route.params.ScanAssetno,
          ScanAssetRowID: route.params.ScanAssetRowID,
        });
      }
    } else if (route.params.Screenname == 'AssetListing') {
      navigation.navigate('ContractService', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        //no need back
        Selected_AssetNo: wko_mst_data.wko_mst_assetno,
        Selected_CostCenter: CostCenter,
        Selected_LaborAccount: LaborAccount_split,
        Selected_ContractAccount: ContractAccount_split,
        Selected_MaterialAccount: MaterialAccount_split,
        Selected_PMGroupType: wko_mst_data.wko_mst_type,

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

  const cv_material_request = () => {
    setMoreVisible(!isMoreVisible);

    let CostCenter, LaborAccount_split,ContractAccount_split, MaterialAccount_split;

    if (!wko_mst_data.wko_mst_chg_costcenter) {
      CostCenter = '';
    } else {
      CostCenter_split = wko_mst_data.wko_mst_chg_costcenter.split(':');
      CostCenter = CostCenter_split[0].trim();
    }

    if (!wko_mst_data.wko_det_laccount) {
      LaborAccount_split = '';
    } else {
      LaborAccount_key_split = wko_mst_data.wko_det_laccount.split(':');
      LaborAccount_split = LaborAccount_key_split[0].trim();
    }

    if (!wko_mst_data.wko_det_caccount) {
      ContractAccount_split = '';
    } else {
      ContractAccount_key_split = wko_mst_data.wko_det_caccount.split(':');
      ContractAccount_split = ContractAccount_key_split[0].trim();
    }

    if (!wko_mst_data.wko_det_maccount) {
      MaterialAccount_split = '';
    } else {
      MaterialAccount_key_split = wko_mst_data.wko_det_maccount.split(':');
      MaterialAccount_split = MaterialAccount_key_split[0].trim();
    }

    if (route.params.Screenname == 'FilteringWorkOrder') {
      navigation.navigate('MaterialRequest', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        //no need back
        Selected_AssetNo: wko_mst_data.wko_mst_assetno,
        Selected_CostCenter: CostCenter,
        Selected_LaborAccount: LaborAccount_split,
        Selected_ContractAccount: ContractAccount_split,
        Selected_MaterialAccount: MaterialAccount_split,
        Selected_PMGroupType: wko_mst_data.wko_mst_type,


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
      navigation.navigate('MaterialRequest', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        //no need back
        Selected_AssetNo: wko_mst_data.wko_mst_assetno,
        Selected_CostCenter: CostCenter,
        Selected_LaborAccount: LaborAccount_split,
        Selected_ContractAccount: ContractAccount_split,
        Selected_MaterialAccount: MaterialAccount_split,
        Selected_PMGroupType: wko_mst_data.wko_mst_type,


        local_id: route.params.local_id,
        Selected_wko_mst_ast_cod: route.params.Selected_wko_mst_ast_cod,
        Selected_wko_mst_type: route.params.Selected_wko_mst_type,
        Screenname: route.params.Screenname,
      });
    } else if (route.params.Screenname == 'WoDashboard' || route.params.Screenname == 'MYWO_Dashboard_Due' || route.params.Screenname == 'MYWO_Dashboard_Past') {
      navigation.navigate('MaterialRequest', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        //no need back
        Selected_AssetNo: wko_mst_data.wko_mst_assetno,
        Selected_CostCenter: CostCenter,
        Selected_LaborAccount: LaborAccount_split,
        Selected_ContractAccount: ContractAccount_split,
        Selected_MaterialAccount: MaterialAccount_split,
        Selected_PMGroupType: wko_mst_data.wko_mst_type,


        local_id: route.params.local_id,
        Selected_wko_mst_ast_cod: route.params.Selected_wko_mst_ast_cod,
        Selected_wko_mst_type: route.params.Selected_wko_mst_type,

        Screenname: route.params.Screenname,
        type: route.params.type,
      });
    } else if (route.params.Screenname == 'ScanAssetMaster') {
      if (route.params.ScanAssetType == 'New') {
      } else if (route.params.ScanAssetType == 'Edit') {
        navigation.navigate('MaterialRequest', {
          Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
          RowID: route.params.RowID,

          //no need back
          Selected_AssetNo: wko_mst_data.wko_mst_assetno,
          Selected_CostCenter: CostCenter,
          Selected_LaborAccount: LaborAccount_split,
          Selected_ContractAccount: ContractAccount_split,
          Selected_MaterialAccount: MaterialAccount_split,
           Selected_PMGroupType: wko_mst_data.wko_mst_type,


          Screenname: route.params.Screenname,
          ScanAssetType: route.params.ScanAssetType,
          ScanAssetno: route.params.ScanAssetno,
          ScanAssetRowID: route.params.ScanAssetRowID,
        });
      }
    } else if (route.params.Screenname == 'AssetListing') {
      navigation.navigate('MaterialRequest', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        //no need back
        Selected_AssetNo: wko_mst_data.wko_mst_assetno,
        Selected_CostCenter: CostCenter,
        Selected_LaborAccount: LaborAccount_split,
        Selected_ContractAccount: ContractAccount_split,
        Selected_MaterialAccount: MaterialAccount_split,
        Selected_PMGroupType: wko_mst_data.wko_mst_type,


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

  const cv_check_list = () => {
    setMoreVisible(!isMoreVisible);

    let CostCenter, LaborAccount_split,ContractAccount_split, MaterialAccount_split;

    if (!wko_mst_data.wko_mst_chg_costcenter) {
      CostCenter = '';
    } else {
      CostCenter_split = wko_mst_data.wko_mst_chg_costcenter.split(':');
      CostCenter = CostCenter_split[0].trim();
    }

    if (!wko_mst_data.wko_det_laccount) {
      LaborAccount_split = '';
    } else {
      LaborAccount_key_split = wko_mst_data.wko_det_laccount.split(':');
      LaborAccount_split = LaborAccount_key_split[0].trim();
    }

    if (!wko_mst_data.wko_det_caccount) {
      ContractAccount_split = '';
    } else {
      ContractAccount_key_split = wko_mst_data.wko_det_caccount.split(':');
      ContractAccount_split = ContractAccount_key_split[0].trim();
    }

    if (!wko_mst_data.wko_det_maccount) {
      MaterialAccount_split = '';
    } else {
      MaterialAccount_key_split = wko_mst_data.wko_det_maccount.split(':');
      MaterialAccount_split = MaterialAccount_key_split[0].trim();
    }

    if (route.params.Screenname == 'FilteringWorkOrder') {
      navigation.navigate('CheckListHeader', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        //no need back
        Selected_AssetNo: wko_mst_data.wko_mst_assetno,
        Selected_CostCenter: CostCenter,
        Selected_LaborAccount: LaborAccount_split,
        Selected_ContractAccount: ContractAccount_split,
        Selected_MaterialAccount: MaterialAccount_split,

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
      navigation.navigate('CheckListHeader', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        //no need back
        Selected_AssetNo: wko_mst_data.wko_mst_assetno,
        Selected_CostCenter: CostCenter,
        Selected_LaborAccount: LaborAccount_split,
        Selected_ContractAccount: ContractAccount_split,
        Selected_MaterialAccount: MaterialAccount_split,

        local_id: route.params.local_id,
        Selected_wko_mst_ast_cod: route.params.Selected_wko_mst_ast_cod,
        Selected_wko_mst_type: route.params.Selected_wko_mst_type,
        Screenname: route.params.Screenname,
      });
    } else if (route.params.Screenname == 'WoDashboard' || route.params.Screenname == 'MYWO_Dashboard_Due' || route.params.Screenname == 'MYWO_Dashboard_Past') {
      navigation.navigate('CheckListHeader', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        //no need back
        Selected_AssetNo: wko_mst_data.wko_mst_assetno,
        Selected_CostCenter: CostCenter,
        Selected_LaborAccount: LaborAccount_split,
        Selected_ContractAccount: ContractAccount_split,
        Selected_MaterialAccount: MaterialAccount_split,

        local_id: route.params.local_id,
        Selected_wko_mst_ast_cod: route.params.Selected_wko_mst_ast_cod,
        Selected_wko_mst_type: route.params.Selected_wko_mst_type,

        Screenname: route.params.Screenname,
        type: route.params.type,
      });
    } else if (route.params.Screenname == 'ScanAssetMaster') {
      if (route.params.ScanAssetType == 'New') {
      } else if (route.params.ScanAssetType == 'Edit') {
        navigation.navigate('CheckListHeader', {
          Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
          RowID: route.params.RowID,

          //no need back
          Selected_AssetNo: wko_mst_data.wko_mst_assetno,
          Selected_CostCenter: CostCenter,
          Selected_LaborAccount: LaborAccount_split,
          Selected_ContractAccount: ContractAccount_split,
          Selected_MaterialAccount: MaterialAccount_split,

          Screenname: route.params.Screenname,
          ScanAssetType: route.params.ScanAssetType,
          ScanAssetno: route.params.ScanAssetno,
          ScanAssetRowID: route.params.ScanAssetRowID,
        });
      }
    } else if (route.params.Screenname == 'AssetListing') {
      navigation.navigate('CheckListHeader', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        //no need back
        Selected_AssetNo: wko_mst_data.wko_mst_assetno,
        Selected_CostCenter: CostCenter,
        Selected_LaborAccount: LaborAccount_split,
        Selected_ContractAccount: ContractAccount_split,
        Selected_MaterialAccount: MaterialAccount_split,

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

  const cv_time_card = () => {
    setMoreVisible(!isMoreVisible);

    let CostCenter, LaborAccount_split,ContractAccount_split, MaterialAccount_split;

    if (!wko_mst_data.wko_mst_chg_costcenter) {
      CostCenter = '';
    } else {
      CostCenter_split = wko_mst_data.wko_mst_chg_costcenter.split(':');
      CostCenter = CostCenter_split[0].trim();
    }

    if (!wko_mst_data.wko_det_laccount) {
      LaborAccount_split = '';
    } else {
      LaborAccount_key_split = wko_mst_data.wko_det_laccount.split(':');
      LaborAccount_split = LaborAccount_key_split[0].trim();
    }

    if (!wko_mst_data.wko_det_caccount) {
      ContractAccount_split = '';
    } else {
      ContractAccount_key_split = wko_mst_data.wko_det_caccount.split(':');
      ContractAccount_split = ContractAccount_key_split[0].trim();
    }

    if (!wko_mst_data.wko_det_maccount) {
      MaterialAccount_split = '';
    } else {
      MaterialAccount_key_split = wko_mst_data.wko_det_maccount.split(':');
      MaterialAccount_split = MaterialAccount_key_split[0].trim();
    }

    if (route.params.Screenname == 'FilteringWorkOrder') {
      navigation.navigate('TimeCard', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        //no need back
        Selected_AssetNo: wko_mst_data.wko_mst_assetno,
        Selected_CostCenter: CostCenter,
        Selected_LaborAccount: LaborAccount_split,
        Selected_ContractAccount: ContractAccount_split,
        Selected_MaterialAccount: MaterialAccount_split,
        Selected_PMGroupType: wko_mst_data.wko_mst_type,

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
      navigation.navigate('TimeCard', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        //no need back
        Selected_AssetNo: wko_mst_data.wko_mst_assetno,
        Selected_CostCenter: CostCenter,
        Selected_LaborAccount: LaborAccount_split,
        Selected_ContractAccount: ContractAccount_split,
        Selected_MaterialAccount: MaterialAccount_split,
        Selected_PMGroupType: wko_mst_data.wko_mst_type,

        local_id: route.params.local_id,
        Selected_wko_mst_ast_cod: route.params.Selected_wko_mst_ast_cod,
        Selected_wko_mst_type: route.params.Selected_wko_mst_type,
        Screenname: route.params.Screenname,
      });
    } else if (route.params.Screenname == 'WoDashboard' || route.params.Screenname == 'MYWO_Dashboard_Due' || route.params.Screenname == 'MYWO_Dashboard_Past') {
      navigation.navigate('TimeCard', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        //no need back
        Selected_AssetNo: wko_mst_data.wko_mst_assetno,
        Selected_CostCenter: CostCenter,
        Selected_LaborAccount: LaborAccount_split,
        Selected_ContractAccount: ContractAccount_split,
        Selected_MaterialAccount: MaterialAccount_split,
        Selected_PMGroupType: wko_mst_data.wko_mst_type,

        local_id: route.params.local_id,
        Selected_wko_mst_ast_cod: route.params.Selected_wko_mst_ast_cod,
        Selected_wko_mst_type: route.params.Selected_wko_mst_type,

        Screenname: route.params.Screenname,
        type: route.params.type,
      });
    } else if (route.params.Screenname == 'ScanAssetMaster') {
      if (route.params.ScanAssetType == 'New') {
      } else if (route.params.ScanAssetType == 'Edit') {
        navigation.navigate('TimeCard', {
          Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
          RowID: route.params.RowID,

          //no need back
          Selected_AssetNo: wko_mst_data.wko_mst_assetno,
          Selected_CostCenter: CostCenter,
          Selected_LaborAccount: LaborAccount_split,
          Selected_ContractAccount: ContractAccount_split,
          Selected_MaterialAccount: MaterialAccount_split,
          Selected_PMGroupType: wko_mst_data.wko_mst_type,

          Screenname: route.params.Screenname,
          ScanAssetType: route.params.ScanAssetType,
          ScanAssetno: route.params.ScanAssetno,
          ScanAssetRowID: route.params.ScanAssetRowID,
        });
      }
    } else if (route.params.Screenname == 'AssetListing') {
      navigation.navigate('TimeCard', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        //no need back
        Selected_AssetNo: wko_mst_data.wko_mst_assetno,
        Selected_CostCenter: CostCenter,
        Selected_LaborAccount: LaborAccount_split,
        Selected_ContractAccount: ContractAccount_split,
        Selected_MaterialAccount: MaterialAccount_split,
        Selected_PMGroupType: wko_mst_data.wko_mst_type,

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

  const cv_asset_downtime = () => {
    setMoreVisible(!isMoreVisible);

    let CostCenter, LaborAccount_split,ContractAccount_split, MaterialAccount_split;

    if (!wko_mst_data.wko_mst_chg_costcenter) {
      CostCenter = '';
    } else {
      CostCenter_split = wko_mst_data.wko_mst_chg_costcenter.split(':');
      CostCenter = CostCenter_split[0].trim();
    }

    if (!wko_mst_data.wko_det_laccount) {
      LaborAccount_split = '';
    } else {
      LaborAccount_key_split = wko_mst_data.wko_det_laccount.split(':');
      LaborAccount_split = LaborAccount_key_split[0].trim();
    }

    if (!wko_mst_data.wko_det_caccount) {
      ContractAccount_split = '';
    } else {
      ContractAccount_key_split = wko_mst_data.wko_det_caccount.split(':');
      ContractAccount_split = ContractAccount_key_split[0].trim();
    }

    if (!wko_mst_data.wko_det_maccount) {
      MaterialAccount_split = '';
    } else {
      MaterialAccount_key_split = wko_mst_data.wko_det_maccount.split(':');
      MaterialAccount_split = MaterialAccount_key_split[0].trim();
    }

    if (route.params.Screenname == 'FilteringWorkOrder') {
      navigation.navigate('AssetDowntime', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        //no need back
        Selected_AssetNo: wko_mst_data.wko_mst_assetno,
        Selected_CostCenter: CostCenter,
        Selected_LaborAccount: LaborAccount_split,
        Selected_ContractAccount: ContractAccount_split,
        Selected_MaterialAccount: MaterialAccount_split,
        Selected_PMGroupType: wko_mst_data.wko_mst_type,

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
      navigation.navigate('AssetDowntime', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        //no need back
        Selected_AssetNo: wko_mst_data.wko_mst_assetno,
        Selected_CostCenter: CostCenter,
        Selected_LaborAccount: LaborAccount_split,
        Selected_ContractAccount: ContractAccount_split,
        Selected_MaterialAccount: MaterialAccount_split,
        Selected_PMGroupType: wko_mst_data.wko_mst_type,

        local_id: route.params.local_id,
        Selected_wko_mst_ast_cod: route.params.Selected_wko_mst_ast_cod,
        Selected_wko_mst_type: route.params.Selected_wko_mst_type,
        Screenname: route.params.Screenname,
      });
    } else if (route.params.Screenname == 'WoDashboard' || route.params.Screenname == 'MYWO_Dashboard_Due' || route.params.Screenname == 'MYWO_Dashboard_Past') {
      navigation.navigate('AssetDowntime', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        //no need back
        Selected_AssetNo: wko_mst_data.wko_mst_assetno,
        Selected_CostCenter: CostCenter,
        Selected_LaborAccount: LaborAccount_split,
        Selected_ContractAccount: ContractAccount_split,
        Selected_MaterialAccount: MaterialAccount_split,
        Selected_PMGroupType: wko_mst_data.wko_mst_type,

        local_id: route.params.local_id,
        Selected_wko_mst_ast_cod: route.params.Selected_wko_mst_ast_cod,
        Selected_wko_mst_type: route.params.Selected_wko_mst_type,

        Screenname: route.params.Screenname,
        type: route.params.type,
      });
    } else if (route.params.Screenname == 'ScanAssetMaster') {
      if (route.params.ScanAssetType == 'New') {
      } else if (route.params.ScanAssetType == 'Edit') {
        navigation.navigate('AssetDowntime', {
          Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
          RowID: route.params.RowID,

          //no need back
          Selected_AssetNo: wko_mst_data.wko_mst_assetno,
          Selected_CostCenter: CostCenter,
          Selected_LaborAccount: LaborAccount_split,
          Selected_ContractAccount: ContractAccount_split,
          Selected_MaterialAccount: MaterialAccount_split,
          Selected_PMGroupType: wko_mst_data.wko_mst_type,

          Screenname: route.params.Screenname,
          ScanAssetType: route.params.ScanAssetType,
          ScanAssetno: route.params.ScanAssetno,
          ScanAssetRowID: route.params.ScanAssetRowID,
        });
      }
    } else if (route.params.Screenname == 'AssetListing') {
      navigation.navigate('AssetDowntime', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        //no need back
        Selected_AssetNo: wko_mst_data.wko_mst_assetno,
        Selected_CostCenter: CostCenter,
        Selected_LaborAccount: LaborAccount_split,
        Selected_ContractAccount: ContractAccount_split,
        Selected_MaterialAccount: MaterialAccount_split,
        Selected_PMGroupType: wko_mst_data.wko_mst_type,

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

  const cv_purchasing_info = () => {

    console.log('SCREEN NAME', route.params.Screenname);

    setMoreVisible(!isMoreVisible);

    let CostCenter, LaborAccount_split,ContractAccount_split, MaterialAccount_split;

    if (!wko_mst_data.wko_mst_chg_costcenter) {
      CostCenter = '';
    } else {
      CostCenter_split = wko_mst_data.wko_mst_chg_costcenter.split(':');
      CostCenter = CostCenter_split[0].trim();
    }

    if (!wko_mst_data.wko_det_laccount) {
      LaborAccount_split = '';
    } else {
      LaborAccount_key_split = wko_mst_data.wko_det_laccount.split(':');
      LaborAccount_split = LaborAccount_key_split[0].trim();
    }

    if (!wko_mst_data.wko_det_caccount) {
      ContractAccount_split = '';
    } else {
      ContractAccount_key_split = wko_mst_data.wko_det_caccount.split(':');
      ContractAccount_split = ContractAccount_key_split[0].trim();
    }

    if (!wko_mst_data.wko_det_maccount) {
      MaterialAccount_split = '';
    } else {
      MaterialAccount_key_split = wko_mst_data.wko_det_maccount.split(':');
      MaterialAccount_split = MaterialAccount_key_split[0].trim();
    }

    if (route.params.Screenname == 'FilteringWorkOrder') {
      navigation.navigate('PurchasingInfo', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        //no need back
        Selected_AssetNo: wko_mst_data.wko_mst_assetno,
        Selected_CostCenter: CostCenter,
        Selected_LaborAccount: LaborAccount_split,
        Selected_ContractAccount: ContractAccount_split,
        Selected_MaterialAccount: MaterialAccount_split,

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
      navigation.navigate('PurchasingInfo', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        //no need back
        Selected_AssetNo: wko_mst_data.wko_mst_assetno,
        Selected_CostCenter: CostCenter,
        Selected_LaborAccount: LaborAccount_split,
        Selected_ContractAccount: ContractAccount_split,
        Selected_MaterialAccount: MaterialAccount_split,

        local_id: route.params.local_id,
        Selected_wko_mst_ast_cod: route.params.Selected_wko_mst_ast_cod,
        Selected_wko_mst_type: route.params.Selected_wko_mst_type,
        Screenname: route.params.Screenname,
      });
    } else if (route.params.Screenname == 'WoDashboard' || route.params.Screenname == 'MYWO_Dashboard_Due' || route.params.Screenname == 'MYWO_Dashboard_Past') {
      navigation.navigate('PurchasingInfo', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        //no need back
        Selected_AssetNo: wko_mst_data.wko_mst_assetno,
        Selected_CostCenter: CostCenter,
        Selected_LaborAccount: LaborAccount_split,
        Selected_ContractAccount: ContractAccount_split,
        Selected_MaterialAccount: MaterialAccount_split,

        local_id: route.params.local_id,
        Selected_wko_mst_ast_cod: route.params.Selected_wko_mst_ast_cod,
        Selected_wko_mst_type: route.params.Selected_wko_mst_type,

        Screenname: route.params.Screenname,
        type: route.params.type,
      });
    } else if (route.params.Screenname == 'ScanAssetMaster') {
      

      if (route.params.ScanAssetType == 'New') {

      } else if (route.params.ScanAssetType == 'Edit') {
        navigation.navigate('PurchasingInfo', {
          Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
          RowID: route.params.RowID,

          //no need back
          Selected_AssetNo: wko_mst_data.wko_mst_assetno,
          Selected_CostCenter: CostCenter,
          Selected_LaborAccount: LaborAccount_split,
          Selected_ContractAccount: ContractAccount_split,
          Selected_MaterialAccount: MaterialAccount_split,

          Screenname: route.params.Screenname,
          ScanAssetType: route.params.ScanAssetType,
          ScanAssetno: route.params.ScanAssetno,
          ScanAssetRowID: route.params.ScanAssetRowID,
        });
      }
    } else if (route.params.Screenname == 'AssetListing') {
      navigation.navigate('PurchasingInfo', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        //no need back
        Selected_AssetNo: wko_mst_data.wko_mst_assetno,
        Selected_CostCenter: CostCenter,
        Selected_LaborAccount: LaborAccount_split,
        Selected_ContractAccount: ContractAccount_split,
        Selected_MaterialAccount: MaterialAccount_split,

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

  const cv_sub_wo = () => {

    setMoreVisible(!isMoreVisible);

    let CostCenter, LaborAccount_split,ContractAccount_split, MaterialAccount_split;

    if (!wko_mst_data.wko_mst_chg_costcenter) {
      CostCenter = '';
    } else {
      CostCenter_split = wko_mst_data.wko_mst_chg_costcenter.split(':');
      CostCenter = CostCenter_split[0].trim();
    }

    if (!wko_mst_data.wko_det_laccount) {
      LaborAccount_split = '';
    } else {
      LaborAccount_key_split = wko_mst_data.wko_det_laccount.split(':');
      LaborAccount_split = LaborAccount_key_split[0].trim();
    }

    if (!wko_mst_data.wko_det_caccount) {
      ContractAccount_split = '';
    } else {
      ContractAccount_key_split = wko_mst_data.wko_det_caccount.split(':');
      ContractAccount_split = ContractAccount_key_split[0].trim();
    }

    if (!wko_mst_data.wko_det_maccount) {
      MaterialAccount_split = '';
    } else {
      MaterialAccount_key_split = wko_mst_data.wko_det_maccount.split(':');
      MaterialAccount_split = MaterialAccount_key_split[0].trim();
    }

    if (route.params.Screenname == 'FilteringWorkOrder') {
      navigation.navigate('SubWorkOrder', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        //no need back
        Selected_AssetNo: wko_mst_data.wko_mst_assetno,
        Selected_CostCenter: CostCenter,
        Selected_LaborAccount: LaborAccount_split,
        Selected_ContractAccount: ContractAccount_split,
        Selected_MaterialAccount: MaterialAccount_split,
        Selected_PMGroupType: wko_mst_data.wko_mst_type,

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
      navigation.navigate('SubWorkOrder', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        //no need back
        Selected_AssetNo: wko_mst_data.wko_mst_assetno,
        Selected_CostCenter: CostCenter,
        Selected_LaborAccount: LaborAccount_split,
        Selected_ContractAccount: ContractAccount_split,
        Selected_MaterialAccount: MaterialAccount_split,
        Selected_PMGroupType: wko_mst_data.wko_mst_type,

        local_id: route.params.local_id,
        Selected_wko_mst_ast_cod: route.params.Selected_wko_mst_ast_cod,
        Selected_wko_mst_type: route.params.Selected_wko_mst_type,
        Screenname: route.params.Screenname,
      });
    } else if (route.params.Screenname == 'WoDashboard' || route.params.Screenname == 'MYWO_Dashboard_Due' || route.params.Screenname == 'MYWO_Dashboard_Past') {
      navigation.navigate('SubWorkOrder', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        //no need back
        Selected_AssetNo: wko_mst_data.wko_mst_assetno,
        Selected_CostCenter: CostCenter,
        Selected_LaborAccount: LaborAccount_split,
        Selected_ContractAccount: ContractAccount_split,
        Selected_MaterialAccount: MaterialAccount_split,
        Selected_PMGroupType: wko_mst_data.wko_mst_type,

        local_id: route.params.local_id,
        Selected_wko_mst_ast_cod: route.params.Selected_wko_mst_ast_cod,
        Selected_wko_mst_type: route.params.Selected_wko_mst_type,

        Screenname: route.params.Screenname,
        type: route.params.type,
      });
    } else if (route.params.Screenname == 'ScanAssetMaster') {
      if (route.params.ScanAssetType == 'New') {
      } else if (route.params.ScanAssetType == 'Edit') {
        navigation.navigate('SubWorkOrder', {
          Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
          RowID: route.params.RowID,

          //no need back
          Selected_AssetNo: wko_mst_data.wko_mst_assetno,
          Selected_CostCenter: CostCenter,
          Selected_LaborAccount: LaborAccount_split,
          Selected_ContractAccount: ContractAccount_split,
          Selected_MaterialAccount: MaterialAccount_split,
          Selected_PMGroupType: wko_mst_data.wko_mst_type,

          Screenname: route.params.Screenname,
          ScanAssetType: route.params.ScanAssetType,
          ScanAssetno: route.params.ScanAssetno,
          ScanAssetRowID: route.params.ScanAssetRowID,
        });
      }
    } else if (route.params.Screenname == 'AssetListing') {
      navigation.navigate('SubWorkOrder', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        //no need back
        Selected_AssetNo: wko_mst_data.wko_mst_assetno,
        Selected_CostCenter: CostCenter,
        Selected_LaborAccount: LaborAccount_split,
        Selected_ContractAccount: ContractAccount_split,
        Selected_MaterialAccount: MaterialAccount_split,
        Selected_PMGroupType: wko_mst_data.wko_mst_type,

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

  const cv_chat_wo = () => {
    setMoreVisible(!isMoreVisible);
    
    let CostCenter, LaborAccount_split,ContractAccount_split, MaterialAccount_split;

    if (!wko_mst_data.wko_mst_chg_costcenter) {
      CostCenter = '';
    } else {
      CostCenter_split = wko_mst_data.wko_mst_chg_costcenter.split(':');
      CostCenter = CostCenter_split[0].trim();
    }

    if (!wko_mst_data.wko_det_laccount) {
      LaborAccount_split = '';
    } else {
      LaborAccount_key_split = wko_mst_data.wko_det_laccount.split(':');
      LaborAccount_split = LaborAccount_key_split[0].trim();
    }

    if (!wko_mst_data.wko_det_caccount) {
      ContractAccount_split = '';
    } else {
      ContractAccount_key_split = wko_mst_data.wko_det_caccount.split(':');
      ContractAccount_split = ContractAccount_key_split[0].trim();
    }

    if (!wko_mst_data.wko_det_maccount) {
      MaterialAccount_split = '';
    } else {
      MaterialAccount_key_split = wko_mst_data.wko_det_maccount.split(':');
      MaterialAccount_split = MaterialAccount_key_split[0].trim();
    }

    if (route.params.Screenname == 'FilteringWorkOrder') {
      navigation.navigate('Chat', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        
        //no need back
        Selected_AssetNo: wko_mst_data.wko_mst_assetno,
        Selected_CostCenter: CostCenter,
        Selected_LaborAccount: LaborAccount_split,
        Selected_ContractAccount: ContractAccount_split,
        Selected_MaterialAccount: MaterialAccount_split,

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
      navigation.navigate('Chat', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        //no need back
        Selected_AssetNo: wko_mst_data.wko_mst_assetno,
        Selected_CostCenter: CostCenter,
        Selected_LaborAccount: LaborAccount_split,
        Selected_ContractAccount: ContractAccount_split,
        Selected_MaterialAccount: MaterialAccount_split,

        local_id: route.params.local_id,
        Selected_wko_mst_ast_cod: route.params.Selected_wko_mst_ast_cod,
        Selected_wko_mst_type: route.params.Selected_wko_mst_type,
        Screenname: route.params.Screenname,
      });
    }else if (route.params.Screenname == 'WoDashboard' || route.params.Screenname == 'MYWO_Dashboard_Due' || route.params.Screenname == 'MYWO_Dashboard_Past') {
      navigation.navigate('Chat', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        //no need back
        Selected_AssetNo: wko_mst_data.wko_mst_assetno,
        Selected_CostCenter: CostCenter,
        Selected_LaborAccount: LaborAccount_split,
        Selected_ContractAccount: ContractAccount_split,
        Selected_MaterialAccount: MaterialAccount_split,

        local_id: route.params.local_id,
        Selected_wko_mst_ast_cod: route.params.Selected_wko_mst_ast_cod,
        Selected_wko_mst_type: route.params.Selected_wko_mst_type,

        Screenname: route.params.Screenname,
        type: route.params.type,
      });
    } else if (route.params.Screenname == 'ScanAssetMaster') {
      navigation.navigate('Chat', {});

      if (route.params.ScanAssetType == 'New') {
      } else if (route.params.ScanAssetType == 'Edit') {
        navigation.navigate('Chat', {
          Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
          RowID: route.params.RowID,

          //no need back
          Selected_AssetNo: wko_mst_data.wko_mst_assetno,
          Selected_CostCenter: CostCenter,
          Selected_LaborAccount: LaborAccount_split,
          Selected_ContractAccount: ContractAccount_split,
          Selected_MaterialAccount: MaterialAccount_split,

          Screenname: route.params.Screenname,
          ScanAssetType: route.params.ScanAssetType,
          ScanAssetno: route.params.ScanAssetno,
          ScanAssetRowID: route.params.ScanAssetRowID,
        });
      }
    } else if (route.params.Screenname == 'AssetListing') {
      navigation.navigate('Chat', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        //no need back
        Selected_AssetNo: wko_mst_data.wko_mst_assetno,
        Selected_CostCenter: CostCenter,
        Selected_LaborAccount: LaborAccount_split,
        Selected_ContractAccount: ContractAccount_split,
        Selected_MaterialAccount: MaterialAccount_split,

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

    //navigation.navigate('Chat')
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

      if (route.params.Screenname == 'CreateWorkOrder' || route.params.Screenname == 'ScanAssetMaster') {

        navigation.navigate('MainTabScreen');
      }else{
        get_SameScreen(Alert_WOK, Alert_RowID);
      }
     
    } else if (D === 'Offline_Insert_WKO') {

      setShow(false);
      navigation.navigate('MainTabScreen');

    } else if (D === 'Online_Update_WKO') {

      setShow(false);
      if (route.params.Screenname == 'CreateWorkOrder' || route.params.Screenname == 'ScanAssetMaster') {
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
        item => item?.localIdentifier && item?.localIdentifier !== ImgValue?.localIdentifier
      );
      setAttachments_List(data);

      const images_list_data = images_list.filter(
        item => item?.localIdentifier && item?.localIdentifier !== ImgValue?.localIdentifier,
      );
      setimages_list(images_list_data);
  
      const images_link_data = images_link.filter(
        item => item?.localIdentifier && item?.localIdentifier !== ImgValue?.localIdentifier,
      );
      setimages_link(images_link_data);
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

  //QR Code
  const OpenQRCode = () => {
    setshowqrcode(true);
    scanAgain(true);
  };
  
  const onSuccess = e => {
    console.log(JSON.stringify(e));

    const check = e.data.substring(0, 4);
    console.log('scanned data' + e.data);
    
  
    QR_get_assetmaster(e.data);

    setscan(false);
    setScanResult(false);
    setshowqrcode(false);

    
  };

  const QR_get_assetmaster = async (assetno) => {

    let Asset_retrieve = {
      site_cd: Site_cd,
      ast_mst_asset_no: assetno,
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

  }

  const activeQR = () => {
    setscan(true);
  };

  const scanAgain = () => {
    setscan(true), setScanResult(false);
  };

  const scanAgain2 = () => {
    setscan(false), setScanResult(false);
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        // If CAMERA Permission is granted
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
            title: 'Storage Permission',
            message: 'Your app needs access to storage to read media files.',
          }
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

      setimages_link(images_link=>[...images_link,{ key:key,url:path,name:name}]);

      // images_list.unshift({ key, path, name, imagetype, type, localIdentifier, rowid});
      // setimages_list(images_list.slice(0));
      // key++;
      // setimages_link([]);
      // for (let i = 0; i < images_list.length; i++) {

      //   let keys = i + 1
      //   setimages_link(images_link=>[...images_link,{ key:keys,url:images_list[i].path,name:images_list[i].name}]);

      // }



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

        <ProgressLoader visible={spinner} isModal={true} isHUD={true} hudColor={'#808080'} color={'#FFFFFF'} />

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

        {/* DropDown Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={DropDown_modalVisible}
          onRequestClose={() => { setDropDown_modalVisible(!DropDown_modalVisible) }}>
          <View style={styles.model2_cardview}>
            <View style={{flex: 1, margin: 20, backgroundColor: '#FFFFFF'}}>
              <View style={{ flexDirection: 'row', alignItems: 'center', height: 50, }}>
                <Text style={{ flex: 1, fontSize: 15, justifyContent: 'center', textAlign: 'center', color: '#000', fontWeight: 'bold', }}> {textvalue} </Text>
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

        {/* Assign History */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={AssignHistory_modalVisible}
          onRequestClose={() => {
           //Alert.alert('Closed');
            setAssignHistory_modalVisible(!AssignHistory_modalVisible);
          }}>
          <View style={styles.model2_cardview}>
            <View style={{flex: 1, margin: 20, backgroundColor: '#fff'}}>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#0096FF', height: 50, }}>
                <Text style={{ flex: 1, fontSize: 15, justifyContent: 'center', textAlign: 'center', color: '#fff', fontWeight: 'bold', }}> {'Assign History'} </Text>
                <Ionicons
                  name="close"
                  color="#fff"
                  size={30}
                  style={{marginEnd: 15}}
                  onPress={() =>
                    setAssignHistory_modalVisible(!AssignHistory_modalVisible)
                  }
                />
              </View>

                {/* <View style={{ flex: 1,marginVertical: 50, paddingHorizontal: 20,}} >

                  <StepIndicator
                    customStyles={stepIndicatorStyles}
                    stepCount={6}
                    direction="vertical"
                    currentPosition={6}
                    labels={labels}
                  />

                </View> */}


              <FlatList
                data={AssignHistory_FilteredData}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={AssignHistory_ItemSeparatorView}
                renderItem={AssignHistory_ItemView}
              />
            </View>
          </View>
        </Modal>

        {/* Asset Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={Asset_modalVisible}
          onRequestClose={() => {
           //Alert.alert('Closed');
            setAsset_modalVisible(!Asset_modalVisible);
          }}>
          <ProgressLoader visible={spinner} isModal={true} isHUD={true} hudColor={'#808080'} color={'#FFFFFF'} />

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

          {/* DropDown Modal */}
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
                <View style={{ flexDirection: 'row', alignItems: 'center', height: 50, }}>
                  <Text style={{ flex: 1, fontSize: 15, justifyContent: 'center', textAlign: 'center', color: '#000', fontWeight: 'bold', }}>{textvalue}</Text>
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
            onRequestClose={() => { setAssetList_modalVisible(!AssetList_modalVisible); }}> 
            <View style={styles.model2_cardview}>
              <View style={{flex: 1,margin: 20, backgroundColor: '#FFFFFF'}}>
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

          <View style={styles.model2_cardview}>
            <View style={{margin: 20, backgroundColor: '#FFFFFF'}}>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#0096FF', height: 50, }}>
                <Text style={{ flex: 1, fontSize: 15, justifyContent: 'center', color: '#fff', margin: 5, textAlign: 'center', fontWeight: 'bold', }}> Asset Search </Text>
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
                  <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', }}>
                    <View style={styles.view_style}>
                      <TextInput
                        value={ast_mst_data.ast_mst_asset_no}
                        style={styles.input}
                        inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}]}
                        labelStyle={styles.labelStyle}
                        placeholderStyle={styles.placeholderStyle}
                        label="Asset No"
                        focusColor="#808080"
                        onChangeText={text => setast_mst_data({...ast_mst_data,ast_mst_asset_no: text})}
                      />
                    </View>

                    <View style={{ alignItems: 'center', marginRight: 10}}>
                    <MaterialIcons
                      name="qr-code-scanner"
                      color={'#05375a'}
                      size={40}
                      style={{marginRight:5}}
                      onPress={OpenQRCode}
                    />

                        
                    </View>


                  </View>
                  

                  {/* Asset Description */}
                  <View style={styles.view_style}>
                    <TextInput
                      value={ast_mst_data.ast_mst_asset_desc}
                      style={[styles.input_desc,{height: Math.max(50, height.height_asset_desc)}]}
                      multiline
                      inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}, ]}
                      labelStyle={styles.labelStyle}
                      placeholderStyle={styles.placeholderStyle}
                      onContentSizeChange={event => setHeight({...height,height_asset_desc : event.nativeEvent.contentSize.height}) }
                      textErrorStyle={styles.textErrorStyle}
                      label="Description"
                      focusColor="#808080"
                      onChangeText={text => setast_mst_data({...ast_mst_data,ast_mst_asset_desc: text})}
                    />
                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-around', }}>
                    {/* From Date */}
                    <View style={styles.view_style}>
                      <Pressable
                        onPress={() => showDatePicker('Box-from')}
                        onLongPress={() => setast_mst_data({...ast_mst_data,ast_mst_asset_from:''})}>
                        <View pointerEvents={'none'}>
                          <TextInput
                            value={ast_mst_data.ast_mst_asset_from}
                            style={styles.input}
                            inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}]}
                            labelStyle={styles.labelStyle}
                            placeholderStyle={styles.placeholderStyle}
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
                        onLongPress={() => setast_mst_data({...ast_mst_data,ast_mst_asset_to:''})}>
                        <View pointerEvents={'none'}>
                          <TextInput
                            value={ast_mst_data.ast_mst_asset_to}
                            style={styles.input}
                            inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}]}
                            labelStyle={styles.labelStyle}
                            placeholderStyle={styles.placeholderStyle}
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
                      onLongPress={() => setast_mst_data({...ast_mst_data,ast_mst_asset_type:''})}>
                      <View pointerEvents={'none'}>
                        <TextInput
                          value={ast_mst_data.ast_mst_asset_type}
                          style={styles.input}
                          inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}]}
                          labelStyle={styles.labelStyle}
                          placeholderStyle={styles.placeholderStyle}
                          label="Asset Type"
                          focusColor="#808080"
                          editable={false}
                          selectTextOnFocus={false}
                          renderRightIcon={() => (
                            <AntDesign
                              style={styles.icon}
                              color={'black'}
                              name={ast_mst_data.ast_mst_asset_type ? 'close' : 'search1'}
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
                      onLongPress={() => setast_mst_data({...ast_mst_data,ast_mst_asset_group_code:''})}>
                      <View pointerEvents={'none'}>
                        <TextInput
                          value={ast_mst_data.ast_mst_asset_group_code}
                          style={styles.input}
                          inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}]}
                          labelStyle={styles.labelStyle}
                          placeholderStyle={styles.placeholderStyle}
                          label="Asset Group Code"
                          focusColor="#808080"
                          editable={false}
                          selectTextOnFocus={false}
                          renderRightIcon={() => (
                            <AntDesign
                              style={styles.icon}
                              color={'black'}
                              name={ast_mst_data.ast_mst_asset_group_code ? 'close' : 'search1'}
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
                      onLongPress={() => setast_mst_data({...ast_mst_data,ast_mst_asset_code:''})}>
                      <View pointerEvents={'none'}>
                        <TextInput
                          value={ast_mst_data.ast_mst_asset_code}
                          style={styles.input}
                          inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}]}
                          labelStyle={styles.labelStyle}
                          placeholderStyle={styles.placeholderStyle}
                          label="Asset Code"
                          focusColor="#808080"
                          editable={false}
                          selectTextOnFocus={false}
                          renderRightIcon={() => (
                            <AntDesign
                              style={styles.icon}
                              color={'black'}
                              name={ast_mst_data.ast_mst_asset_code ? 'close' : 'search1'}
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
                      onLongPress={() => setast_mst_data({...ast_mst_data,ast_mst_asset_workarea:''})}>
                      <View pointerEvents={'none'}>
                        <TextInput
                          value={ast_mst_data.ast_mst_asset_workarea}
                          style={styles.input}
                          inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}]}
                          labelStyle={styles.labelStyle}
                          placeholderStyle={styles.placeholderStyle}
                          label="Work Area"
                          focusColor="#808080"
                          editable={false}
                          selectTextOnFocus={false}
                          renderRightIcon={() => (
                            <AntDesign
                              style={styles.icon}
                              color={'black'}
                              name={ast_mst_data.ast_mst_asset_workarea ? 'close' : 'search1'}
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
                      onPress={() => select_dropdown('Box Asset Location', AssetLocation) }
                      onLongPress={() => setast_mst_data({...ast_mst_data,ast_mst_asset_loc:''})}>
                      <View pointerEvents={'none'}>
                        <TextInput
                          value={ast_mst_data.ast_mst_asset_loc}
                          style={styles.input}
                          inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}]}
                          labelStyle={styles.labelStyle}
                          placeholderStyle={styles.placeholderStyle}
                          label="Asset Location"
                          focusColor="#808080"
                          editable={false}
                          selectTextOnFocus={false}
                          renderRightIcon={() => (
                            <AntDesign
                              style={styles.icon}
                              color={'black'}
                              name={ast_mst_data.ast_mst_asset_loc ? 'close' : 'search1'}
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
                      onPress={() => select_dropdown('Box Asset Level', AssetLevel) }
                      onLongPress={() => setast_mst_data({...ast_mst_data,ast_mst_asset_level:''})}>
                      <View pointerEvents={'none'}>
                        <TextInput
                          value={ast_mst_data.ast_mst_asset_level}
                          style={styles.input}
                          inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}]}
                          labelStyle={styles.labelStyle}
                          placeholderStyle={styles.placeholderStyle}
                          label="Asset Level"
                          focusColor="#808080"
                          editable={false}
                          selectTextOnFocus={false}
                          renderRightIcon={() => (
                            <AntDesign
                              style={styles.icon}
                              color={'black'}
                              name={ast_mst_data.ast_mst_asset_level ? 'close' : 'search1'}
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
            <View style={{flex: 1,margin: 20, backgroundColor: '#FFFFFF'}}>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#0096FF', height: 50, }}>
                <Text style={{ flex: 1, fontSize: 15, justifyContent: 'center', color: '#fff', textAlign: 'center', fontWeight: 'bold', }}> Asset Listing </Text>
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

        {/* insight  */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={Insing_Visible}
          onRequestClose={() => {
           //Alert.alert('Closed');
           setInsing_Visible(!Insing_Visible);
          }}>
          <View style={styles.model2_cardview}>
            <View style={{flex: 1, margin: 20, backgroundColor: '#ffff'}}>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#0096FF', height: 50, }}>
                <Text style={{ flex: 1, fontSize: 15, justifyContent: 'center', textAlign: 'center', color: '#ffff', fontWeight: 'bold', }}> {'INSIGHT'} </Text>
                <Ionicons
                  name="close"
                  color="#fff"
                  size={30}
                  style={{marginEnd: 15}}
                  onPress={() =>
                    setInsing_Visible(!Insing_Visible)
                  }
                />
              </View>

              <FlatList
                data={Insing_list}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={AssignHistory_ItemSeparatorView}
                renderItem={Insing_ItemView}
              />
            </View>
          </View>
        </Modal>
        
        <View style={styles.container}>

          <FlatList
            ListHeaderComponent={
              <View style={styles.container_01}>
                <Pressable>

                  {/* Requester Info */}
                  <View style={styles.card}>

                    <View style={styles.card_heard}>
                      <Text style={styles.card_heard_text}> REQUESTER INFORMATION </Text>
                    </View>

                    {/*Employee*/}
                    <View style={styles.view_style}>
                      <Pressable
                        onPress={ () => !Editable ? select_dropdown('Employee', Employee) : ''  }
                        onLongPress={() => setwko_mst_data({ ...wko_mst_data,wko_mst_originator:''})}>
                        <View pointerEvents={'none'}>

                          <TextInput
                            value={wko_mst_data.wko_mst_originator}
                            style={styles.input}
                            inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}]}
                            labelStyle={styles.labelStyle}
                            placeholderStyle={styles.placeholderStyle}
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
                                  name={wko_mst_data.wko_mst_originator ? 'close' : 'search1'}
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
                        value={wko_mst_data.wko_mst_phone}
                        style={styles.input}
                        inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}]}
                        labelStyle={styles.labelStyle}
                        keyboardType="numeric"
                        placeholderStyle={styles.placeholderStyle}
                        label="Phone No"
                        editable={!Editable}
                        selectTextOnFocus={!Editable}
                        onChangeText={text => { setwko_mst_data({ ...wko_mst_data,wko_mst_phone: text }) }}
                        renderRightIcon={() =>
                          Editable ? (
                            ''
                          ) : (
                            <AntDesign
                              style={styles.icon}
                              color={'black'}
                              name={wko_mst_data.wko_mst_phone ? 'close' : ''}
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

                     {/* Assign TO */}
                     <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', }}>
                     <View style={[styles.view_style,{display: AssetNo_Visible ? 'flex' : 'none'}]}>
                      <Pressable
                        onPress={() => (!Editable ? open_search_asset_box() : '')}
                        onLongPress={() => setwko_mst_data({ ...wko_mst_data,
                          wko_mst_assetno:'',
                          ast_mst_asset_shortdesc:'',
                          wko_mst_asset_group_code:'',
                          wko_mst_work_area:'',
                          wko_mst_asset_location:'',
                          wko_mst_asset_level:'',
                          wko_mst_chg_costcenter:''
                        })}>
                        <View pointerEvents={'none'}>

                          <TextInput
                            value={wko_mst_data.wko_mst_assetno}
                            style={styles.input}
                            inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}]}
                            labelStyle={styles.labelStyle}
                            placeholderStyle={styles.placeholderStyle}
                            label="Asset No"
                            editable={Editable}
                            selectTextOnFocus={Editable}
                            renderRightIcon={() =>
                              Editable ? (
                                ''
                              ) : (
                                <AntDesign
                                  style={styles.icon}
                                  color={'black'}
                                  name={wko_mst_data.wko_mst_assetno ? 'close' : 'search1'}
                                  size={22}
                                />
                              )
                            }
                          />
                        </View>
                      </Pressable>
                      </View>

                      <View style={{ alignItems: 'center', marginRight: 10,display: Insight_Visible ? 'flex' : 'none' }}>
                        <MaterialCommunityIcons
                          name="axis-arrow-info"
                          color={'#05375a'}
                          size={35}
                          style={{ marginTop: Platform.OS === 'ios' ? 0 : 7,  marginTop: 11, }}
                          onPress={() => get_insight()}
                          //disabled={Editable}
                        />

                        <Text style={{ color: '#05375a', fontSize: 12, fontWeight: 'bold', }}> Insight </Text>
                      </View>
                    </View>

                    {/* Asset No
                    <View style={[styles.view_style,{display: AssetNo_Visible ? 'flex' : 'none'}]}>
                      <Pressable
                        onPress={() => (!Editable ? open_search_asset_box() : '')}
                        onLongPress={() => setwko_mst_data({ ...wko_mst_data,
                          wko_mst_assetno:'',
                          ast_mst_asset_shortdesc:'',
                          wko_mst_asset_group_code:'',
                          wko_mst_work_area:'',
                          wko_mst_asset_location:'',
                          wko_mst_asset_level:'',
                          wko_mst_chg_costcenter:''
                        })}>
                        <View pointerEvents={'none'}>

                          <TextInput
                            value={wko_mst_data.wko_mst_assetno}
                            style={styles.input}
                            inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}]}
                            labelStyle={styles.labelStyle}
                            placeholderStyle={styles.placeholderStyle}
                            label="Asset No"
                            editable={Editable}
                            selectTextOnFocus={Editable}
                            renderRightIcon={() =>
                              Editable ? (
                                ''
                              ) : (
                                <AntDesign
                                  style={styles.icon}
                                  color={'black'}
                                  name={wko_mst_data.wko_mst_assetno ? 'close' : 'search1'}
                                  size={22}
                                />
                              )
                            }
                          />
                        </View>
                      </Pressable>
                    </View> */}

                    {/* PM Group */}
                    <View style={[ styles.view_style, {display: wko_mst_data.wko_mst_pm_grp ? 'flex' : 'none'}]}>
                      <View pointerEvents={'none'}>
                        <TextInput
                          value={wko_mst_data.wko_mst_pm_grp}
                          style={styles.input}
                          inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#808080'}]}
                          labelStyle={styles.labelStyle}
                          placeholderStyle={styles.placeholderStyle}
                          label="PM Group"
                          editable={false}
                          selectTextOnFocus={false}
                          renderRightIcon={() =>
                            Editable ? (
                              ''
                            ) : (
                              <AntDesign
                                style={styles.icon}
                                color={'black'}
                                name={wko_mst_data.wko_mst_assetno ? '' : ''}
                                size={22}
                              />
                            )
                          }
                          
                        />
                      </View>
                    </View>

                    {/* Asset Description */}
                    <View style={styles.view_style}>
                      <TextInput
                        value={wko_mst_data.ast_mst_asset_shortdesc}
                        style={[styles.input_desc,{height: Math.max(50, height.height_asset_desc)}]}
                        multiline
                        inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}, ]}
                        labelStyle={styles.labelStyle}
                        placeholderStyle={styles.placeholderStyle}
                        onContentSizeChange={event => setHeight({...height,height_asset_desc : event.nativeEvent.contentSize.height}) }
                        label="Description"
                        placeholderTextColor="gray"
                        clearButtonMode="always"
                        editable={!Editable}
                        selectTextOnFocus={!Editable}
                        onChangeText={text => { setwko_mst_data({ ...wko_mst_data,ast_mst_asset_shortdesc: text }) }}
                        renderRightIcon={() =>
                          Editable ? (
                            ''
                          ) : (
                            <AntDesign
                              style={styles.icon}
                              name={wko_mst_data.ast_mst_asset_shortdesc ? 'close' : ''}
                              size={20}
                              disable={true}
                              onPress={() =>
                                wko_mst_data.ast_mst_asset_shortdesc ? setwko_mst_data({ ...wko_mst_data,ast_mst_asset_shortdesc: '' }) : ''
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
                        onLongPress={() => setwko_mst_data({ ...wko_mst_data,wko_mst_asset_group_code: '' }) }>
                        <View pointerEvents={'none'}>
                          <TextInput
                            value={wko_mst_data.wko_mst_asset_group_code}
                            style={[styles.input_desc,{height: Math.max(50, height.height_asset_groupcd)}]}
                            multiline
                            inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}, ]}
                            labelStyle={styles.labelStyle}
                            placeholderStyle={styles.placeholderStyle}
                            onContentSizeChange={event => setHeight({...height,height_asset_groupcd:event.nativeEvent.contentSize.height}) }
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
                                  name={wko_mst_data.wko_mst_asset_group_code ? 'close' : 'search1'}
                                  size={22}
                                  disable={true}
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
                        onLongPress={() => setwko_mst_data({ ...wko_mst_data,wko_mst_asset_location: '' })}>
                        <View pointerEvents={'none'}>
                          <TextInput
                            value={wko_mst_data.wko_mst_asset_location}
                            style={[styles.input_desc,{height: Math.max(50, height.height_asset_loc)}]}
                            inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}, ]}
                            labelStyle={styles.labelStyle}
                            multiline
                            placeholderStyle={styles.placeholderStyle}
                            onContentSizeChange={event => setHeight({...height,height_asset_loc:event.nativeEvent.contentSize.height}) }
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
                                  name={wko_mst_data.wko_mst_asset_location ? 'close' : 'search1'}
                                  size={22}
                                  disable={true}
                                  
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
                        onLongPress={() => setwko_mst_data({ ...wko_mst_data,wko_mst_asset_level: '' })}>
                        <View pointerEvents={'none'}>
                          <TextInput
                            value={wko_mst_data.wko_mst_asset_level}
                            style={[styles.input_desc,{height: Math.max(50, height.height_asset_level)}]}
                            inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}, ]}
                            labelStyle={styles.labelStyle}
                            multiline
                            placeholderStyle={styles.placeholderStyle}
                            onContentSizeChange={event => setHeight({...height,height_asset_level:event.nativeEvent.contentSize.height}) }
                            label="Asset Level"
                            editable={false}
                            selectTextOnFocus={false}
                            renderRightIcon={() =>
                              Editable ? (
                                ''
                              ) : (
                                <AntDesign
                                  style={styles.icon}
                                  color={'black'}
                                  name={wko_mst_data.wko_mst_asset_level ? 'close' : 'search1'}
                                  size={22}
                                  disable={true}
                                  
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
                        onLongPress={() => setwko_mst_data({ ...wko_mst_data,wko_mst_chg_costcenter: '' })}>
                        <View pointerEvents={'none'}>
                          <TextInput
                            value={wko_mst_data.wko_mst_chg_costcenter}
                            style={[styles.input_desc,{height: Math.max(50, height.height_cost_center)}]}
                            inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}, ]}
                            labelStyle={styles.labelStyle}
                            multiline
                            placeholderStyle={styles.placeholderStyle}
                            onContentSizeChange={event => setHeight({...height,height_cost_center:event.nativeEvent.contentSize.height}) }
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
                                  name={wko_mst_data.wko_mst_chg_costcenter ? 'close' : 'search1'}
                                  size={22}
                                  disable={true}
                                  
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
                        value={wko_mst_data.wko_mst_wo_no}
                        style={[styles.input_desc,{height: Math.max(50, height.height_asset_desc)}]}
                        inputStyle={[ styles.inputStyle, { color: WorkOrderNo_editable ? wko_mst_data.wko_mst_wo_no ? '#808080' : '#000' : wko_mst_data.wko_mst_wo_no ? '#808080' : '#000'}]}
                        labelStyle={styles.labelStyle}
                        placeholderStyle={{ fontSize: 15, color: WorkOrderNo_editable ? '#0096FF' : '#808080', }}
                        label="Work Order No"
                        editable={WorkOrderNo_editable}
                        selectTextOnFocus={WorkOrderNo_editable}
                        onChangeText={text => { setwko_mst_data({...wko_mst_data,wko_mst_wo_no:text}) }}
                        renderRightIcon={() =>
                          !WorkOrderNo_editable ? (
                            ''
                          ) : (
                            <AntDesign
                              style={styles.icon}
                              name={wko_mst_data.wko_mst_wo_no ? 'close' : 'search1'}
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
                        onLongPress={() => setwko_mst_data({ ...wko_mst_data,wko_mst_orig_priority: '' })}>
                        <View pointerEvents={'none'}>
                          <TextInput
                            value={wko_mst_data.wko_mst_orig_priority}
                            style={[ styles.input]}
                            inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}, ]}
                            labelStyle={styles.labelStyle}
                            placeholderStyle={styles.placeholderStyle}
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
                                  name={wko_mst_data.wko_mst_orig_priority ? 'close' : 'search1'}
                                  size={22}
                                  disable={true}
                                  
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
                        onLongPress={() => setwko_mst_data({ ...wko_mst_data,wko_mst_plan_priority: '' })}>
                        <View pointerEvents={'none'}>
                          <TextInput
                            value={wko_mst_data.wko_mst_plan_priority}
                            style={[ styles.input]}
                            inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}, ]}
                            labelStyle={styles.labelStyle}
                            placeholderStyle={styles.placeholderStyle}
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
                                  name={wko_mst_data.wko_mst_plan_priority ? 'close' : 'search1'}
                                  size={22}
                                  disable={true}
                                  
                                />
                              )
                            }
                          />
                        </View>
                      </Pressable>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-around'}}>
                      {/* From Date */}
                      <View style={styles.view_style}>
                        <Pressable
                          onPress={() => !Editable ? showDatePicker('from') : '' }
                          onLongPress={() => setwko_mst_data({ ...wko_mst_data,wko_mst_orig_date: '' })}>
                          <View pointerEvents={'none'}>
                            <TextInput
                              value={wko_mst_data.wko_mst_orig_date}
                              style={[ styles.input]}
                              inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}, ]}
                              labelStyle={styles.labelStyle}
                              placeholderStyle={styles.placeholderStyle}
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
                          onLongPress={() => setwko_mst_data({ ...wko_mst_data,wko_mst_due_date: '' })}>
                          <View pointerEvents={'none'}>
                            <TextInput
                              value={wko_mst_data.wko_mst_due_date}
                              style={[ styles.input]}
                              inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}, ]}
                              labelStyle={styles.labelStyle}
                              placeholderStyle={styles.placeholderStyle}
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

                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', }}>
                      {/* From Date */}
                      <View style={styles.view_style}>
                        <Pressable
                          onPress={() => !Editable ? showTimePicker('from') : '' }
                          onLongPress={() => setwko_mst_data({ ...wko_mst_data,wko_mst_orig_time: '' })}>
                          <View pointerEvents={'none'}>
                            <TextInput
                              value={wko_mst_data.wko_mst_orig_time}
                              style={[ styles.input]}
                              inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}, ]}
                              labelStyle={styles.labelStyle}
                              placeholderStyle={styles.placeholderStyle}
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
                          onLongPress={() => setwko_mst_data({ ...wko_mst_data,wko_mst_due_time: '' })}>
                          <View pointerEvents={'none'}>
                            <TextInput
                              value={wko_mst_data.wko_mst_due_time}
                              style={[ styles.input]}
                              inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}, ]}
                              labelStyle={styles.labelStyle}
                              placeholderStyle={styles.placeholderStyle}
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

                    {/* Work Type*/}
                    <View style={styles.view_style}>
                      <Pressable
                        onPress={() => !Editable ? select_dropdown('Work Type', WorkType) : '' }
                        onLongPress={() => setwko_mst_data({ ...wko_mst_data,wko_det_work_type: '' })}>
                        <View pointerEvents={'none'}>
                          <TextInput
                            value={wko_mst_data.wko_det_work_type}
                            style={[styles.input_desc,{height: Math.max(50, height.height_worktype)}]}
                            inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}, ]}
                            labelStyle={styles.labelStyle}
                            multiline
                            placeholderStyle={styles.placeholderStyle}
                            onContentSizeChange={event => setHeight({...height,height_worktype:event.nativeEvent.contentSize.height}) }
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
                                  name={wko_mst_data.wko_det_work_type ? 'close' : 'search1'}
                                  size={22}
                                  disable={true}
                                  
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
                        onPress={() => !Editable ? select_dropdown('Fault Code', FaultCode) : '' }
                        onLongPress={() => setwko_mst_data({ ...wko_mst_data,wko_mst_flt_code: '' })}>
                        <View pointerEvents={'none'}>
                          <TextInput
                            value={wko_mst_data.wko_mst_flt_code}
                            style={[styles.input_desc,{height: Math.max(50, height.height_faultcd)}]}
                            inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}, ]}
                            labelStyle={styles.labelStyle}
                            multiline
                            placeholderStyle={styles.placeholderStyle}
                            onContentSizeChange={event => setHeight({...height,height_faultcd:event.nativeEvent.contentSize.height}) }
                            label="Fault Code"
                            editable={false}
                            selectTextOnFocus={false}
                            renderRightIcon={() =>
                              Editable ? (
                                ''
                              ) : (
                                <AntDesign
                                  style={styles.icon}
                                  color={'black'}
                                  name={wko_mst_data.wko_mst_flt_code ? 'close' : 'search1'}
                                  size={22}
                                  disable={true}
                                  
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
                        value={wko_mst_data.wko_mst_descs}
                        style={[styles.input_desc,{height: Math.max(50, height.height_wko_dsec)}]}
                        inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}, ]}
                        labelStyle={styles.labelStyle}
                        multiline
                        placeholderStyle={styles.placeholderStyle}
                        onContentSizeChange={event => setHeight({...height,height_wko_dsec:event.nativeEvent.contentSize.height}) }
                        label="Work Order Description"
                        editable={!Editable}
                        selectTextOnFocus={!Editable}
                        onChangeText={text => { setwko_mst_data({ ...wko_mst_data,wko_mst_descs: text })}}
                        renderRightIcon={() =>
                          Editable ? (
                            ''
                          ) : (
                            <AntDesign
                              style={styles.icon}
                              name={wko_mst_data.wko_mst_descs ? 'close' : ''}
                              size={22}
                              disable={true}
                              onPress={() =>
                                wko_mst_data.wko_mst_descs
                                  ? setwko_mst_data({ ...wko_mst_data,wko_mst_descs: '' })
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
                        onPress={() => !Editable ? select_dropdown( 'Work Order Status', WorkOrderStatus, ) : '' }
                        onLongPress={() => setwko_mst_data({ ...wko_mst_data,wko_mst_status: '' })}>
                        <View pointerEvents={'none'}>
                          <TextInput
                            value={wko_mst_data.wko_mst_status}
                            style={[styles.input_desc,{height: Math.max(50, height.height_wko_status)}]}
                            inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}, ]}
                            labelStyle={styles.labelStyle}
                            multiline
                            placeholderStyle={styles.placeholderStyle}
                            onContentSizeChange={event => setHeight({...height,height_wko_status:event.nativeEvent.contentSize.height}) }
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
                                  name={wko_mst_data.wko_mst_status ? 'close' : 'search1'}
                                  size={22}
                                  disable={true}
                                  
                                />
                              )
                            }
                          />
                        </View>
                      </Pressable>
                    </View>

                    {/* Assign TO */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', }}>
                      <View style={styles.view_style}>
                        <Pressable
                          onPress={() => !Editable ? get_dropdown_Assign_Employee() : '' }
                          onLongPress={() => setwko_mst_data({ ...wko_mst_data,wko_det_assign_to: '' })}>
                          <View pointerEvents={'none'}>
                            <TextInput
                              value={wko_mst_data.wko_det_assign_to}
                              style={[styles.input_desc,{height: Math.max(50, height.height_assignto)}]}
                              inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}, ]}
                              labelStyle={styles.labelStyle}
                              multiline
                              placeholderStyle={styles.placeholderStyle}
                              onContentSizeChange={event => setHeight({...height,height_assignto:event.nativeEvent.contentSize.height}) }
                              label="Assign To"
                              editable={false}
                              selectTextOnFocus={false}
                              renderRightIcon={() =>
                                Editable ? (
                                  ''
                                ) : (
                                  <AntDesign
                                    style={styles.icon}
                                    color={'black'}
                                    name={wko_mst_data.wko_det_assign_to ? 'close' : 'search1'}
                                    size={22}
                                    disable={true}
                                    
                                  />
                                )
                              }
                            />
                          </View>
                        </Pressable>
                      </View>

                      <View style={{ alignItems: 'center', display: Assigtohistory_Visible ? 'flex' : 'none', }}>
                        <MaterialIcons
                          name="format-list-numbered"
                          color={'#05375a'}
                          size={45}
                          style={{ marginTop: Platform.OS === 'ios' ? 0 : 7, marginRight: 10, marginTop: 11, }}
                          onPress={() => get_assign_history()}
                          //disabled={Editable}
                        />

                        <Text style={{ color: '#05375a', fontSize: 12, fontWeight: 'bold', }}> Assign History </Text>
                      </View>
                    </View>

                    {/* Assign to Reason */}
                    <View style={[ styles.view_style, {display: AssigToReason_Visible ? 'flex' : 'none'}, ]}>
                      <TextInput
                        value={wko_mst_data.wko_det_assign_reason}
                        style={[styles.input_desc,{height: Math.max(50, height.height_assignto_desc)}]}
                        inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}, ]}
                        labelStyle={styles.labelStyle}
                        multiline
                        placeholderStyle={styles.placeholderStyle}
                        onContentSizeChange={event => setHeight({...height,height_assignto_desc:event.nativeEvent.contentSize.height}) }
                        label="Assign to Reason"
                        editable={!Editable}
                        selectTextOnFocus={!Editable}
                        onChangeText={text => { setwko_mst_data({ ...wko_mst_data,wko_det_assign_reason: text }) }}
                        renderRightIcon={() =>
                          Editable ? (
                            ''
                          ) : (
                            <AntDesign
                              style={styles.icon}
                              name={wko_mst_data.wko_det_assign_reason ? 'close' : ''}
                              size={22}
                              disable={true}
                              onPress={() =>
                                wko_mst_data.wko_det_assign_reason ? setwko_mst_data({ ...wko_mst_data,wko_det_assign_reason: '' }) : ''
                              }
                            />
                          )
                        }
                      />
                    </View>

                    {/* Labor Account*/}
                    <View style={styles.view_style}>
                      <Pressable
                        onPress={() => !Editable ? select_dropdown('Labor Account', Account) : '' }
                        onLongPress={() => setwko_mst_data({ ...wko_mst_data,wko_det_laccount: '' })}>
                        <View pointerEvents={'none'}>
                          <TextInput
                            value={wko_mst_data.wko_det_laccount}
                            style={[styles.input_desc,{height: Math.max(50, height.height_LA)}]}
                            inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}, ]}
                            labelStyle={styles.labelStyle}
                            multiline
                            placeholderStyle={styles.placeholderStyle}
                            onContentSizeChange={event => setHeight({...height,height_LA:event.nativeEvent.contentSize.height}) }
                            label="Labor Account"
                            editable={false}
                            selectTextOnFocus={false}
                            renderRightIcon={() =>
                              Editable ? (
                                ''
                              ) : (
                                <AntDesign
                                  style={styles.icon}
                                  color={'black'}
                                  name={wko_mst_data.wko_det_laccount ? 'close' : 'search1'}
                                  size={22}
                                  disable={true}
                                  
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
                        onPress={() => !Editable ? select_dropdown('Contract Account', Account) : '' }
                        onLongPress={() => setwko_mst_data({ ...wko_mst_data,wko_det_caccount: '' })}>
                        <View pointerEvents={'none'}>
                          <TextInput
                            value={wko_mst_data.wko_det_caccount}
                            style={[styles.input_desc,{height: Math.max(50, height.height_CA)}]}
                            inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}, ]}
                            labelStyle={styles.labelStyle}
                            multiline
                            placeholderStyle={styles.placeholderStyle}
                            onContentSizeChange={event => setHeight({...height,height_CA:event.nativeEvent.contentSize.height}) }
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
                                  name={wko_mst_data.wko_det_caccount ? 'close' : 'search1'}
                                  size={22}
                                  disable={true}
                                  
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
                        onPress={() => !Editable ? select_dropdown('Material Account', Account) : '' }
                        onLongPress={() => setwko_mst_data({ ...wko_mst_data,wko_det_maccount: '' })}>
                        <View pointerEvents={'none'}>
                          <TextInput
                            value={wko_mst_data.wko_det_maccount}
                            style={[styles.input_desc,{height: Math.max(50, height.height_MA)}]}
                            inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}, ]}
                            labelStyle={styles.labelStyle}
                            multiline
                            placeholderStyle={styles.placeholderStyle}
                            onContentSizeChange={event => setHeight({...height,height_MA:event.nativeEvent.contentSize.height}) }
                            
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
                                  name={wko_mst_data.wko_det_maccount ? 'close' : 'search1'}
                                  size={22}
                                  disable={true}
                                  
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
                      <Text style={styles.card_heard_text}> WORK ORDER ATTACHMENTS </Text>
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
                          
                          }
                        }

                      }}
                    />
                  </View>

                {/* More Opstion XML */}
                <View style={styles.centeredView}>
                  <Att_Modal
                    style={styles.bottomModalView}
                    isVisible={isMoreVisible}
                    onRequestClose={() => { setMoreVisible(!isMoreVisible)}}
                    backdropOpacity={0}>
                    
                    <View style={styles.modal2}>
                    <ScrollView>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 40, marginRight: 30, marginBottom: 10, }}>
                        <Text style={{ fontSize: 15, justifyContent: 'center', alignItems: 'center', color: '#000', }}></Text>
                        <Ionicons name="close" color={'#000'} size={25} onPress={() => setMoreVisible(false)} />
                      </View>

                      <Pressable
                        style={{display: Response_Visible ? 'flex' : 'none'}}
                        onPress={cv_response}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', marginLeft: 10, marginRight: 10, marginTop: 5, marginBottom: 5, borderRadius: 10, }}>
                          <AntDesign name={'qrcode'} color={'#05375a'} size={25} onPress={() => setMoreVisible(false)} />
                          <Text style={{ fontSize: 15, justifyContent: 'center', alignItems: 'center', color: '#000', marginTop: 5, }}> {'Response'} </Text>
                          <AntDesign name={'checkcircleo'} color={wko_mst_data.response} size={25} />
                        </View>
                      </Pressable>

                      <Pressable
                        style={{display: Chargeable_Visible ? 'flex' : 'none'}}
                        onPress={cv_chargeable}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', marginLeft: 10, marginRight: 10, marginTop: 5, marginBottom: 5, borderRadius: 10, }}>
                          <AntDesign name={'redenvelopes'} color={'#05375a'} size={25} />
                          <Text style={{ fontSize: 15, justifyContent: 'center', alignItems: 'center', color: '#000', marginTop: 5, }}> {'Chargeable'} </Text>
                          <AntDesign name={'checkcircleo'} color={wko_mst_data.chargeable} size={25} />
                        </View>
                      </Pressable>

                      <Pressable
                        style={{ display: Acknowledgement_Visible ? 'flex' : 'none', }}
                        onPress={cv_acknowledgement}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', marginLeft: 10, marginRight: 10, marginTop: 5, marginBottom: 5, borderRadius: 10, }}>
                          <AntDesign name={'like2'} color={'#05375a'} size={25} />
                          <Text style={{ fontSize: 15, justifyContent: 'center', alignItems: 'center', color: '#000', marginTop: 5, }}> {'Acknowledgement'} </Text>
                          <AntDesign name={'checkcircleo'} color={wko_mst_data.acknowledgement} size={25} />
                        </View>
                      </Pressable>

                      <Pressable
                        style={{ display: WOCompletion_Visible ? 'flex' : 'none', }}
                        onPress={cv_wo_completion}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', marginLeft: 10, marginRight: 10, marginTop: 5, marginBottom: 5, borderRadius: 10, }}>
                          <AntDesign name={'tool'} color={'#05375a'} size={25} />
                          <Text style={{ fontSize: 15, justifyContent: 'center', alignItems: 'center', color: '#000', marginTop: 5, }}> {'WO Completion'} </Text>
                          <AntDesign name={'checkcircleo'} color={wko_mst_data.completion} size={25} />
                        </View>
                      </Pressable>

                      <Pressable
                        style={{ display: ContractServices_Visible ? 'flex' : 'none', }}
                        onPress={cv_contract_services}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', marginLeft: 10, marginRight: 10, marginTop: 5, marginBottom: 5, borderRadius: 10, }}>
                          <AntDesign name={'carryout'} color={'#05375a'} size={25} />
                          <Text style={{ fontSize: 15, justifyContent: 'center', alignItems: 'center', color: '#000', marginTop: 5, }}> {'Contract Service'} </Text>
                          <Text style={{ fontSize: 15, justifyContent: 'center', alignItems: 'center', color: '#000', }}> {wko_mst_data.contractservices} </Text>
                        </View>
                      </Pressable>

                      <Pressable
                        style={{ display: MaterialRequest_Visible ? 'flex' : 'none', }}
                        onPress={cv_material_request}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', marginLeft: 10, marginRight: 10, marginTop: 5, marginBottom: 5, borderRadius: 10, }}>
                          <AntDesign name={'bars'} color={'#05375a'} size={25} />
                          <Text style={{ fontSize: 15, justifyContent: 'center', alignItems: 'center', color: '#000', marginTop: 5, }}> {'Material Request'} </Text>
                          <Text style={{ fontSize: 15, justifyContent: 'center', alignItems: 'center', color: '#000', }}> {wko_mst_data.materialrequest} </Text>
                        </View>
                      </Pressable>

                      <Pressable
                        style={{display: CheckList_Visible ? 'flex' : 'none'}}
                        onPress={cv_check_list}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', marginLeft: 10, marginRight: 10, marginTop: 5, marginBottom: 5, borderRadius: 10, }}>
                          <AntDesign name={'profile'} color={'#05375a'} size={25} />
                          <Text style={{ fontSize: 15, justifyContent: 'center', alignItems: 'center', color: '#000', marginTop: 5, }}> {'Check List'} </Text>
                          <Text style={{ fontSize: 15, justifyContent: 'center', alignItems: 'center', color: '#000', }}> {wko_mst_data.checkListcount} </Text>
                        </View>
                      </Pressable>

                      <Pressable
                        style={{display: TimaeCard_Visible ? 'flex' : 'none'}}
                        onPress={cv_time_card}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', marginLeft: 10, marginRight: 10, marginTop: 5, marginBottom: 5, borderRadius: 10, }}>
                          <AntDesign name={'find'} color={'#05375a'} size={25} />
                          <Text style={{ fontSize: 15, justifyContent: 'center', alignItems: 'center', color: '#000', marginTop: 5, }}> {'Time Card'} </Text>
                          <Text style={{ fontSize: 15, justifyContent: 'center', alignItems: 'center', color: '#000', }}> {wko_mst_data.timecard} </Text>
                        </View>
                      </Pressable>

                      <Pressable
                        style={{ display: AssetDowntime_Visible ? 'flex' : 'none', }}
                        onPress={cv_asset_downtime}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', marginLeft: 10, marginRight: 10, marginTop: 5, marginBottom: 5, borderRadius: 10, }}>
                          <AntDesign name={'export2'} color={'#05375a'} size={25} />
                          <Text style={{ fontSize: 15, justifyContent: 'center', alignItems: 'center', color: '#000', marginTop: 5, }}> {'Asset Downtime'} </Text>
                          <Text style={{ fontSize: 15, justifyContent: 'center', alignItems: 'center', color: '#000', }}> {wko_mst_data.assetdowntime} </Text>
                        </View>
                      </Pressable>

                      <Pressable
                        style={{ display: PurchasingInfo_Visible ? 'flex' : 'none', }}
                        onPress={cv_purchasing_info}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', marginLeft: 10, marginRight: 10, marginTop: 5, marginBottom: 5, borderRadius: 10, }}>
                          <AntDesign name={'infocirlceo'} color={'#05375a'} size={25} />
                          <Text style={{ fontSize: 15, justifyContent: 'center', alignItems: 'center', color: '#000', marginTop: 5, }}> {'Purchasing Info'} </Text>
                          <Text style={{ fontSize: 15, justifyContent: 'center', alignItems: 'center', color: '#000', }}> {''} </Text>
                        </View>
                      </Pressable>

                      <Pressable
                        style={{ display: SubWorkorder_Visible ? 'flex' : 'none', }}
                        onPress={cv_sub_wo}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', marginLeft: 10, marginRight: 10, marginTop: 5, marginBottom: 10, borderRadius: 10, }}>
                          <AntDesign name={'switcher'} color={'#05375a'} size={25} />
                          <Text style={{ fontSize: 15, justifyContent: 'center', alignItems: 'center', color: '#000', marginTop: 5, }}> {'Create Sub Work Order'} </Text>
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
                    </ScrollView>
                    </View>
                  </Att_Modal>
                </View>

                
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

          <TouchableOpacity style={{ width: '65%', height: 80, backgroundColor: SubmitButtonColor, marginRight: 5, alignItems: 'center', justifyContent: 'center', }} 
            onPress={get_button}>
            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', marginBottom: 15, }}>
              <AntDesign color={'#FFFF'} name={'Safety'} size={25} />
              <Text style={{ color: 'white', fontSize: 16, marginLeft: 8, fontWeight: 'bold', }}> {SubmitButton.toUpperCase()} </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ width: '45%', height: 80, backgroundColor: '#0096FF', alignItems: 'center', justifyContent: 'center', }}
            onPress={get_more}>
            <View
              style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15, marginRight: 20, }}>
              <AntDesign color={'#FFFF'} name={'ellipsis1'} size={26} />

              <Text style={{ color: 'white', fontSize: 16, marginLeft: 8, marginRight: 5, fontWeight: 'bold', }}> {'more'.toUpperCase()} </Text>
            </View>
          </TouchableOpacity>

        </View>

      </SafeAreaProvider>

      

    </DismissKeyboard>
  )
};

const {width} = Dimensions.get('window');
const IMAGE_WIDTH = (width - 50) / 2;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    marginBottom: 80,
    backgroundColor: '#D5D8DC',
  },

  container_01: {
    flex: 1
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
    
  },
  view_style: {
    flex: 1,
    marginTop: 12,
    marginLeft: 10,
    marginRight: 10,
  },
  input: {
    height:50,
    paddingHorizontal: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#808080',
  },
  input_desc: {
   
    paddingHorizontal: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#808080',
  },
  inputStyle: {
    fontSize: 15, 
   paddingTop:15
  },
  labelStyle: {
    fontSize: 13,
    position: 'absolute',
    top: -10,
    color: '#0096FF',
    backgroundColor: 'white',
    paddingHorizontal: 5,
    marginLeft: -4,
  },
  placeholderStyle:{
    fontSize: 15, 
    color: '#0096FF'
  },
  icon: {
    marginRight: 5,
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
  modal2: {
    height: '100%',
    borderStyle: 'solid',
    backgroundColor: '#e7e7e7',
  },

  buttonDelete: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    position: 'absolute',
    alignItems: 'center',
    top: 8,
    right: 5,
    backgroundColor: '#ffffff92',
    borderRadius: 4,
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
})

const customStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize:30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: '#fe7013',
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: '#fe7013',
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor: '#fe7013',
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: '#fe7013',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: '#fe7013',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: '#999999',
  labelSize: 13,
  currentStepLabelColor: '#fe7013'
}

export default CreateWorkOrder




