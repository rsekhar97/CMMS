``;
import React from 'react';
import { View, StyleSheet, Dimensions, Image, Switch, Text, FlatList, Alert, ScrollView, Modal, KeyboardAvoidingView, RefreshControl, Pressable, TouchableOpacity, BackHandler, Platform, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import axios from 'axios';
import {Appbar} from 'react-native-paper';
import {useTheme} from 'react-native-paper';
import {openDatabase} from 'react-native-sqlite-storage';
import DeviceInfo from 'react-native-device-info';
import {TextInput} from 'react-native-element-textinput';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ModalSelector from 'react-native-modal-selector-searchable';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProgressLoader from 'rn-progress-loader';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {Button, SearchBar} from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import uuid from 'react-native-uuid';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import  NumericPad  from  'react-native-numeric-pad'
import {SCLAlert, SCLAlertButton} from 'react-native-scl-alert';
import Pdf from 'react-native-pdf';
import ImageViewer from 'react-native-image-zoom-viewer';
import { TextInput as RNTextInput } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { max } from 'date-fns';

var db = openDatabase({name: 'CMMS.db'});
let Baseurl, Site_cd, LoginID, EmpName, EmpID, EmpPhone, EmpWorkGrp, dvc_id, Local_ID, mst_RowID, WIFI, Asset_No, Check_No, CheckDesc;

function CheckListDetalis({route, navigation}) {

  const {colors} = useTheme();

  const [spinner, setspinner] = React.useState(false);
  const [Toolbartext, setToolbartext] = React.useState('Check List');
  const [Editable, setEditable] = React.useState(false);

  const [ZoomList, setZoomList] = React.useState([]);
  const [ZoomListvisable, setZoomListvisable] = React.useState(false);

  const [ZoomAttachments_modalVisible, setZoomAttachments_modalVisible] = React.useState(false);
  const [images_link, setimages_link] = React.useState([]);

  const [listDataSource, setListDataSource] = React.useState([]);
  const [filteredDataSource, setFilteredDataSource] = React.useState([]);

  const [search, setSearch] = React.useState('');
  const [isRender, setisRender] = React.useState(false);

  const [isDatepickerVisible, setDatePickerVisibility] = React.useState(false);

  const [dateID, setDateID] = React.useState('');

  const [isEnabled, setIsEnabled] = React.useState(false);

  const [Text_height, setText_height] = React.useState(0);
  const [Num_height, setNum_height] = React.useState(0);
  const [Date_height, setDate_height] = React.useState(0);
  const [Chek_height, setChek_height] = React.useState(0);
  const [Zoom_height, setZoom_height] = React.useState(0);

  //DropDown Modal
  const [textvalue, settextvalue] = React.useState('');
  const [Boxtextvalue, setBoxtextvalue] = React.useState('');
  const [Dropdown_data, setDropdown_data] = React.useState([]);
  const [DropDownFilteredData, setDropDownFilteredData] = React.useState([]);
  const [DropDown_modalVisible, setDropDown_modalVisible] = React.useState(false);
  const [DropDown_search, setDropDown_search] = React.useState('');
  const [refreshing, setRefreshing] = React.useState(false);

  //Alert
  const [Show, setShow] = React.useState(false);
  const [Show_two, setShow_two] = React.useState(false);
  const [Theme, setTheme] = React.useState('');
  const [Title, setTitle] = React.useState('');
  const [AlertType, setAlertType] = React.useState('');

  const [Type_link, setType_link] = React.useState();
  const [link, setlink] = React.useState([]);

  const _goBack = () => {
    if (route.params.Screenname == 'FilteringWorkOrder') {
      navigation.navigate('CheckListHeader', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        Screenname: route.params.Screenname,

        //no need back
        Selected_AssetNo: route.params.Selected_AssetNo,

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
        Selected_AssetNo: route.params.Selected_AssetNo,

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
        Selected_AssetNo: route.params.Selected_AssetNo,

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
          Selected_AssetNo: route.params.Selected_AssetNo,

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
        Selected_AssetNo: route.params.Selected_AssetNo,

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
    // Alert.alert("Alert", "Do you want to exit checkList screen?", [
    //   {
    //     text: "NO",
    //     onPress: () => null,

    //   },
    //   { text: "YES", onPress: () => _goBack() }
    // ]);

    setAlert_two(
      true,
      'warning',
      'Do you want to exit checkList screen?',
      'BACK',
    );
    return true;
  };

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  React.useEffect(() => {
    const focusHander = navigation.addListener('focus', () => {
      fetchData();
    });
    return focusHander;
  }, [navigation]);

  const fetchData = async () => {
    dvc_id = DeviceInfo.getDeviceId();

    Baseurl = await AsyncStorage.getItem('BaseURL');
    Site_cd = await AsyncStorage.getItem('Site_Cd');
    LoginID = await AsyncStorage.getItem('emp_mst_login_id');
    EmpName = await AsyncStorage.getItem('emp_mst_name');
    EmpID = await AsyncStorage.getItem('emp_mst_empl_id');
    EmpPhone = await AsyncStorage.getItem('emp_mst_homephone');
    EmpWorkGrp = await AsyncStorage.getItem('emp_det_work_grp');
    dft_mst_tim_act = await AsyncStorage.getItem('dft_mst_tim_act');
    WIFI = await AsyncStorage.getItem('WIFI');

    console.log('Check List getting VALUES: ' + JSON.stringify(route.params));

    mst_RowID = route.params.RowID;
    Local_ID = route.params.local_id;
    Asset_No = route.params.Selected_AssetNo;
    Check_No = route.params.Selected_CheckNo;
    CheckDesc = route.params.Selected_CheckDesc;

    console.log('WORK DATA LOCAL ID :  ' + Local_ID);
    console.log('WORK DATA ASSET ID :  ' + mst_RowID);
    console.log('WORK DATA MST_ROWID:', Asset_No);
    console.log('WORK DATA MST_ROWID:', Check_No);
    console.log('WORK DATA MST_ROWID:', CheckDesc);

    if (WIFI === 'OFFLINE') {
      get_check_list_detalis_offline();
    } else {
      get_check_list_header();
    }
  };

  //Check List Detalis ONLINE
  const get_check_list_header = async () => {
    const SPLIT_URL = Baseurl.split('/');
    const SPLIT_URL1 = SPLIT_URL[SPLIT_URL.length - 2];
    const SPLIT_URL2 = SPLIT_URL[SPLIT_URL.length - 1];
    const SPLIT_URL3 = SPLIT_URL1+'/'+SPLIT_URL2
    console.log('URL' + SPLIT_URL3);

    setspinner(true);
    try {
      console.log( 'JSON DATA : ' + `${Baseurl}/get_work_order_checklist_by_params.php?site_cd=${Site_cd}&mst_RowID=${route.params.RowID}&wko_isp_asset_no=${route.params.Selected_AssetNo}&dvc_id=${dvc_id}&folder=${SPLIT_URL3}&url=${Baseurl}&wko_isp_job_cd=${Check_No}`);
      const response = await axios.get( `${Baseurl}/get_work_order_checklist_by_params.php?site_cd=${Site_cd}&mst_RowID=${route.params.RowID}&wko_isp_asset_no=${route.params.Selected_AssetNo}&dvc_id=${dvc_id}&folder=${SPLIT_URL3}&url=${Baseurl}&wko_isp_job_cd=${Check_No}`);

      //console.log("JSON DATA : " + JSON.stringify( response.data))

      if (response.data.status === 'SUCCESS') {

        setListDataSource([]);
        setFilteredDataSource([]);
      
        for (let i = 0; i < response.data.data.length; ++i) {

          let rowid                 = response.data.data[i].rowid
          let mst_rowid             = response.data.data[i].mst_rowid
          let site_cd               = response.data.data[i].site_cd
          let wko_isp_asset_no      = response.data.data[i].wko_isp_asset_no
          let wko_isp_job_cd        = response.data.data[i].wko_isp_job_cd
          let wko_isp_job_desc      = response.data.data[i].wko_isp_job_desc
          let wko_isp_sec_no        = response.data.data[i].wko_isp_sec_no
          let wko_isp_sec_desc      = response.data.data[i].wko_isp_sec_desc
          let wko_isp_stp_no        = response.data.data[i].wko_isp_stp_no
          let wko_isp_stp_desc      = response.data.data[i].wko_isp_stp_desc
          let wko_isp_stp_datatype  = response.data.data[i].wko_isp_stp_datatype
          let wko_isp_stp_rowid     = response.data.data[i].wko_isp_stp_rowid

          let wko_isp_content = response.data.data[i].wko_isp_content
          let wko_isp_method = response.data.data[i].wko_isp_method
          let wko_isp_std = response.data.data[i].wko_isp_std

          let wko_isp_varchar1      = response.data.data[i].wko_isp_varchar1
          let wko_isp_varchar2      = response.data.data[i].wko_isp_varchar2
          let wko_isp_varchar3      = response.data.data[i].wko_isp_varchar3

          var number1
          if (response.data.data[i].wko_isp_numeric1 === '' || response.data.data[i].wko_isp_numeric1 === null) {
            number1 = null
          } else {

            number1 =  parseFloat(response.data.data[i].wko_isp_numeric1).toFixed(2);
          }

          let wko_isp_numeric1 =  number1

          var number2
          if (response.data.data[i].wko_isp_numeric2 === '' || response.data.data[i].wko_isp_numeric2 === null) {
            number2 = null
          } else {

            number2 =  parseFloat(response.data.data[i].wko_isp_numeric2).toFixed(2);
          }
          let wko_isp_numeric2  = number2

          var number3
          if (response.data.data[i].wko_isp_numeric3 === '' || response.data.data[i].wko_isp_numeric3 === null) {
            number3 = null
          } else {

            number3 =  parseFloat(response.data.data[i].wko_isp_numeric3).toFixed(2);
          }
          let wko_isp_numeric3  = number3

          let wko_isp_datetime1 = response.data.data[i].wko_isp_datetime1
          let wko_isp_datetime2 = response.data.data[i].wko_isp_datetime2
          let wko_isp_datetime3 = response.data.data[i].wko_isp_datetime3
          

          let wko_isp_checkbox1     = response.data.data[i].wko_isp_checkbox1
          let wko_isp_checkbox2     = response.data.data[i].wko_isp_checkbox2
          let wko_isp_checkbox3     = response.data.data[i].wko_isp_checkbox3

          let wko_isp_dropdown1     = response.data.data[i].wko_isp_dropdown1
          let wko_isp_dropdown2     = response.data.data[i].wko_isp_dropdown2
          let wko_isp_dropdown3     = response.data.data[i].wko_isp_dropdown3

          let wko_isp_uom           = response.data.data[i].wko_isp_uom
          let wko_isp_min_thr       = response.data.data[i].wko_isp_min_thr
          let wko_isp_max_thr       = response.data.data[i].wko_isp_max_thr
          let wko_isp_ovr_thr       = response.data.data[i].wko_isp_ovr_thr
          let column1               = response.data.data[i].column1
          let file_name             = response.data.data[i].file_name
          let file_link             = response.data.data[i].file_link

          let audit_user            = response.data.data[i].audit_user
          let audit_date            = response.data.data[i].audit_date
          let mbl_audit_user        = response.data.data[i].mbl_audit_user
          let mbl_audit_date        = response.data.data[i].mbl_audit_date
          


          setListDataSource(listDataSource=>[...listDataSource,{
            key:i,
            rowid:rowid,
            mst_rowid:mst_rowid,
            site_cd:site_cd,

            wko_isp_asset_no:wko_isp_asset_no,
            wko_isp_job_cd:wko_isp_job_cd,
            wko_isp_job_desc:wko_isp_job_desc,
            wko_isp_sec_no:wko_isp_sec_no,
            wko_isp_sec_desc:wko_isp_sec_desc,
            wko_isp_stp_no:wko_isp_stp_no,
            wko_isp_stp_desc:wko_isp_stp_desc,
            wko_isp_stp_datatype:wko_isp_stp_datatype,
            wko_isp_stp_rowid:wko_isp_stp_rowid,
            wko_isp_content:wko_isp_content,
            wko_isp_method:wko_isp_method,
            wko_isp_std:wko_isp_std,

            wko_isp_varchar1:wko_isp_varchar1,
            wko_isp_varchar2:wko_isp_varchar2,
            wko_isp_varchar3:wko_isp_varchar3,

            wko_isp_numeric1:wko_isp_numeric1,
            wko_isp_numeric2:wko_isp_numeric2,
            wko_isp_numeric3:wko_isp_numeric3,

            wko_isp_datetime1:wko_isp_datetime1,
            wko_isp_datetime2:wko_isp_datetime2,
            wko_isp_datetime3:wko_isp_datetime3,

            wko_isp_checkbox1:wko_isp_checkbox1,
            wko_isp_checkbox2:wko_isp_checkbox2,
            wko_isp_checkbox3:wko_isp_checkbox3,

            wko_isp_dropdown1:wko_isp_dropdown1,
            wko_isp_dropdown2:wko_isp_dropdown2,
            wko_isp_dropdown3:wko_isp_dropdown3,

            wko_isp_uom:wko_isp_uom,
            wko_isp_min_thr:wko_isp_min_thr,
            wko_isp_max_thr:wko_isp_max_thr,
            wko_isp_ovr_thr:wko_isp_ovr_thr,

            column1:column1,

            file_name:file_name,
            file_link:file_link,

            audit_user:audit_user,
            audit_date:audit_date,
            mbl_audit_user:mbl_audit_user,
            mbl_audit_date:mbl_audit_date,

          }]);

          setFilteredDataSource(filteredDataSource=>[...filteredDataSource,{
            key:i,
            rowid:rowid,
            mst_rowid:mst_rowid,
            site_cd:site_cd,

            wko_isp_asset_no:wko_isp_asset_no,
            wko_isp_job_cd:wko_isp_job_cd,
            wko_isp_job_desc:wko_isp_job_desc,
            wko_isp_sec_no:wko_isp_sec_no,
            wko_isp_sec_desc:wko_isp_sec_desc,
            wko_isp_stp_no:wko_isp_stp_no,
            wko_isp_stp_desc:wko_isp_stp_desc,
            wko_isp_stp_datatype:wko_isp_stp_datatype,
            wko_isp_stp_rowid:wko_isp_stp_rowid,
            wko_isp_content:wko_isp_content,
            wko_isp_method:wko_isp_method,
            wko_isp_std:wko_isp_std,

            wko_isp_varchar1:wko_isp_varchar1,
            wko_isp_varchar2:wko_isp_varchar2,
            wko_isp_varchar3:wko_isp_varchar3,

            wko_isp_numeric1:wko_isp_numeric1,
            wko_isp_numeric2:wko_isp_numeric2,
            wko_isp_numeric3:wko_isp_numeric3,

            wko_isp_datetime1:wko_isp_datetime1,
            wko_isp_datetime2:wko_isp_datetime2,
            wko_isp_datetime3:wko_isp_datetime3,

            wko_isp_checkbox1:wko_isp_checkbox1,
            wko_isp_checkbox2:wko_isp_checkbox2,
            wko_isp_checkbox3:wko_isp_checkbox3,

            wko_isp_dropdown1:wko_isp_dropdown1,
            wko_isp_dropdown2:wko_isp_dropdown2,
            wko_isp_dropdown3:wko_isp_dropdown3,

            wko_isp_uom:wko_isp_uom,
            wko_isp_min_thr:wko_isp_min_thr,
            wko_isp_max_thr:wko_isp_max_thr,
            wko_isp_ovr_thr:wko_isp_ovr_thr,

            column1:column1,

            file_name:file_name,
            file_link:file_link,

            audit_user:audit_user,
            audit_date:audit_date,
            mbl_audit_user:mbl_audit_user,
            mbl_audit_date:mbl_audit_date,

          }])

        }

        //setListDataSource(response.data.data);
        //setFilteredDataSource(response.data.data);

        setspinner(false);
      } else {
        setspinner(false);
        setAlert(true, 'danger', response.data.message, 'OK');
        return;
      }
    } catch (error) {
      setspinner(false);
      alert(error);
    }
  };

  // //Check List Detalis OFFLINE
  const get_check_list_detalis_offline = async () => {
   
    if (!mst_RowID) {
      console.log('not Empty');

      db.transaction(function (txn) {
        //GET OFFLINE Check List Heard
        txn.executeSql(
          'SELECT * FROM wko_isp_details WHERE  local_id =?',
          [Local_ID],
          (tx, results) => {
            var temp = [];
            console.log('Check List Heard:' + JSON.stringify(results.rows));
            if (results.rows.length > 0) {
              for (let i = 0; i < results.rows.length; ++i) {
                temp.push(results.rows.item(i));
              }

              setListDataSource(temp);
              setFilteredDataSource(temp);
              setspinner(false);
            } else {
              setspinner(false);
            }
          },
        );
      });
    } else {
      console.log(' Empty');

      db.transaction(function (txn) {
        //GET OFFLINE Check List Heard
        txn.executeSql(
          'SELECT DISTINCT  * from wko_isp_details WHERE  mst_RowID = ? and wko_isp_asset_no =? and wko_isp_job_cd =? order by wko_isp_job_cd',
          [mst_RowID, Asset_No, Check_No],
          (tx, results) => {
            var temp = [];
            console.log('get empty:' + JSON.stringify(results.rows));
            if (results.rows.length > 0) {
              for (let i = 0; i < results.rows.length; ++i) {
                temp.push(results.rows.item(i));
              }
             
              setListDataSource(temp);
              setFilteredDataSource(temp);

             
            } else {
              setspinner(false);
            }
          },
        );
      });
    }
  };

  const Save_CheckList = async () => {
    if (WIFI === 'OFFLINE') {
      off_save_checkList();
    } else {
      setspinner(true);
      ID = uuid.v4();

      const newData = listDataSource.map(item => {
        if (item.wko_isp_datetime1 === null) {
          item.wko_isp_datetime1 === null;
        } else {
          item.wko_isp_datetime1 = moment(item.wko_isp_datetime1.date).format( 'YYYY-MM-DD HH:mm');
        }

        if (item.wko_isp_datetime2 === null) {
          item.wko_isp_datetime2 === null;
        } else {
          item.wko_isp_datetime2 = moment(item.wko_isp_datetime2.date).format( 'YYYY-MM-DD HH:mm');
        }

        if (item.wko_isp_datetime3 === null) {
          item.wko_isp_datetime3 === null;
        } else {
          item.wko_isp_datetime3 = moment(item.wko_isp_datetime3.date).format( 'YYYY-MM-DD HH:mm' );
        }

        item.column1 = ID;

        if (item.audit_date === null) {
          item.audit_date === null;
        } else {
          item.audit_date = moment(item.audit_date.date).format( 'YYYY-MM-DD HH:mm' );
        }

        if (item.mbl_audit_date === null) {
          item.mbl_audit_date === null;
        } else {
          item.mbl_audit_date = moment(item.mbl_audit_date.date).format( 'YYYY-MM-DD HH:mm' );
        }

        return item;
      });

      setFilteredDataSource(newData);
      setisRender(!isRender);

      const SPLIT_URL = Baseurl.split('/');
      const SPLIT_URL1 = SPLIT_URL[SPLIT_URL.length - 2];
      const SPLIT_URL2 = SPLIT_URL[SPLIT_URL.length - 1];
      const SPLIT_URL3 = SPLIT_URL1+'/'+SPLIT_URL2
      console.log('URL' + SPLIT_URL3);
      var sync_date = moment().format('YYYY-MM-DD HH:mm:ss');

      console.log('UPDATE CHECKLIST ' + JSON.stringify(listDataSource));

      try {
        const response = await axios.post(
          `${Baseurl}/update_check_list.php?ID=${ID}&Folder=${SPLIT_URL3}&dvc_id=${dvc_id}&site_cd=${Site_cd}&sync_time=${sync_date}&LoginID=${LoginID}`,
          JSON.stringify(listDataSource),
          {headers: {'Content-Type': 'application/json'}},
        );
        console.log('Insert asset response:' + JSON.stringify(response.data));
        if (response.data.status === 'SUCCESS') {
          setspinner(false);
          // Alert.alert(response.data.status,response.data.message,
          //     [

          //         { text: "OK"  }

          //     ]);

          setAlert(true, 'success', response.data.message, 'UPDATE_CHEKLIST');
        } else {
          setspinner(false);
          // Alert.alert(response.data.status,response.data.message,
          //     [

          //         { text: "OK" }

          //     ]);
          setAlert(true, 'danger', response.data.message, 'OK');
        }
      } catch (error) {
        setspinner(false);
        alert(error);
      }
    }
  };

  const off_save_checkList = async () => {
    setspinner(true);

    const Ckecklist_Promises = [];
    for (let i = 0; i < listDataSource.length; ++i) {
      Ckecklist_Promises.push(do_CheckList_Async(listDataSource[i], i));
    }

    Promise.all(Ckecklist_Promises)
      .then(results => {
        db.transaction(function (tx) {
          tx.executeSql(
            `select SUM(CASE WHEN wko_isp_stp_datatype = 'T' and (wko_isp_varchar1 IS NULL OR wko_isp_varchar1 = '') and wko_isp_varchar3 = '1' Then 1  WHEN wko_isp_stp_datatype = 'N' and (wko_isp_numeric1 IS  NULL ) and wko_isp_varchar3 = '1' Then 1 WHEN wko_isp_stp_datatype = 'C' and (wko_isp_checkbox1 IS  0) and wko_isp_varchar3 = '1' Then 1 WHEN wko_isp_stp_datatype = 'D' and (wko_isp_datetime1 IS  NULL) and wko_isp_varchar3 = '1' Then 1 WHEN wko_isp_stp_datatype = 'Z' and (wko_isp_dropdown1 IS  NULL) and wko_isp_varchar3 = '1' Then 1 else 0 END  ) AS Done, SUM(CASE WHEN wko_isp_varchar3 = '1' then 1 else 0 end )as Total From	wko_isp_details where mst_RowID =? and wko_isp_asset_no= ? and wko_isp_job_cd= ?`,
            [mst_RowID, Asset_No, Check_No],
            (tx, results) => {
              console.log('Downtime CMP Count:' + JSON.stringify(results));

              if (results.rows.length > 0) {
                for (let i = 0; i < results.rows.length; ++i) {
                  var done = results.rows.item(i).Done;
                  var total = results.rows.item(i).Total;

                  console.log('Done', done);
                  console.log('total', total);
                  var d = results.rows.item(i).Total - results.rows.item(i).Done;
                  console.log('d', d);
                  tx.executeSql(
                    'UPDATE wko_isp_heard SET  done= ? , total =? WHERE mst_RowID = ? and  wko_isp_asset_no = ? and wko_isp_job_cd= ?',
                    [d, total, mst_RowID, Asset_No, Check_No],
                    (tx, results) => {
                      //console.log('wko_det_response Results_test', results.rowsAffected);
                      if (results.rowsAffected > 0) {
                        setspinner(false);
                        setAlert( true, 'success', 'Checklist update successfully', 'UPDATE_CHEKLIST', );
                      } else {
                        setspinner(false);
                        setAlert( true, 'warning', 'Update check list Failed', 'UPDATE_CHEKLIST', );
                        // alert('Update TABLE ast_dwntime Failed')
                      }
                    },
                  );
                }
              } else {
                setspinner(false);
              }
            },
          );
        });
      })
      .catch(e => {
        alert('CheckList Heard : ' + e);
        // Handle errors here
      });
  };

  const do_CheckList_Async = (value, count) => {
    return new Promise(resolve => {
      setTimeout(() => {
        db.transaction(function (tx) {
          tx.executeSql(
            'UPDATE wko_isp_details SET  wko_isp_varchar1=?, wko_isp_varchar2=?, wko_isp_varchar3=?, wko_isp_numeric1=?, wko_isp_numeric2=?, wko_isp_numeric3=?, wko_isp_datetime1=?, wko_isp_datetime2=?, wko_isp_datetime3=?, wko_isp_checkbox1=?, wko_isp_checkbox2=?, wko_isp_checkbox3=?, wko_isp_dropdown1=?, wko_isp_dropdown2=?, wko_isp_dropdown3=? ,total=? WHERE rowid =?',
            [
              value.wko_isp_varchar1,
              value.wko_isp_varchar2,
              value.wko_isp_varchar3,
              value.wko_isp_numeric1,
              value.wko_isp_numeric2,
              value.wko_isp_numeric3,
              value.wko_isp_datetime1,
              value.wko_isp_datetime2,
              value.wko_isp_datetime3,
              value.wko_isp_checkbox1,
              value.wko_isp_checkbox2,
              value.wko_isp_checkbox3,
              value.wko_isp_dropdown1,
              value.wko_isp_dropdown2,
              value.wko_isp_dropdown3,
              value.total,
              value.rowid,
            ],
            (tx, results) => {
              //console.log('wko_det_response Results_test', results.rowsAffected);
              if (results.rowsAffected > 0) {
                console.log('Update TABLE ast_dwntime Successfully', i);
              } else {
                setspinner(false);
                alert('Update TABLE ast_dwntime Failed');
              }
            },
          );
        });

        resolve(count);
      }, Math.floor(Math.random() * 1000));
    });
  };

  const searchFilterFunction = text => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = listDataSource.filter(function (item) {
        //const itemData = item.ast_mst_asset_no ? item.ast_mst_asset_no.toUpperCase() : ''.toUpperCase();
        //const itemData = item.ast_mst_asset_no.toUpperCase(),;
        const itemData = `${item.wko_isp_stp_desc.toUpperCase()})`;

        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });

      console.log(newData);
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(listDataSource);
      setSearch(text);
    }
  };

  const ItemView = ({item,index}) => {
    switch (item.wko_isp_stp_datatype) {
      case 'T':
        if (item.wko_isp_varchar3 === '0') {
          var togg = false;
          var text = true;
          var iocn_color = '#D6DBDF';
          var back_color = '#D6DBDF';
        } else {
          var togg = true;
          var text = false;
          var back_color = '#fff';

          if (!item.wko_isp_varchar1) {
            
            var iocn_color = '#E65100';
          } else {
            var iocn_color = '#2Ecc71';
          }
        }

        var show;
        if (item.file_link === null) {
          show = true;
        } else {
          show = false;
        }

        // This code for MR WU For PG
        // var std_show;
        // if (item.wko_isp_content === null || item.wko_isp_method === null || item.wko_isp_std === null) {
        //   std_show = true;
        // } else {
        //   std_show = false;
        // }


        return (
          <View style={[styles.card,text ? {backgroundColor:back_color,borderColor:'#AEB6BF',borderWidth:1} : {borderLeftWidth:9,borderLeftColor:iocn_color,backgroundColor:back_color}]}>
            <View style={styles.headerone}>
              <View style={{flex: 1}}>
                <Text style={{ color: '#767577', fontWeight: 'bold', fontSize: 12, marginLeft: 5 }}> {item.wko_isp_sec_desc} </Text>
              </View>
              <View style={{width: '30%'}}>
                <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row',alignItems: 'center'}}>
                  <View style={{display: !show ? 'flex' : 'none',marginRight:25}}>
                    <MaterialCommunityIcons
                    name="file-eye-outline"
                    color={'#05375a'}
                    onPress={() => Attachment_show(item)}
                    size={25}/>

                  </View>
                  <Switch
                    trackColor={{false: '#767577', true: '#81b0ff'}}
                    thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() =>
                      toggleSwitch(item.rowid, togg, item.wko_isp_stp_datatype)
                    }
                    value={togg}
                  />
                </View>
              </View>
            </View>

            <View style={{ height: 1, width: '100%', marginTop: 10, backgroundColor: '#C8C8C8' }} />

            <View style={styles.headertwo}>
              <View style={{flex: 1, justifyContent: 'center',flexDirection: 'row',}}>
                <Text style={{ color: '#05375a', fontWeight: 'bold', fontSize: 15, marginLeft: 5, }} ellipsizeMode="tail"> {item.wko_isp_stp_no } </Text>
                <View style={{flex: 1,marginLeft: 5}}>

                  <View style={{ flex: 1,flexDirection: 'row',}}>
                    <MaterialCommunityIcons
                      name="clipboard-minus-outline"
                      color={'#05375a'}
                      size={20}/>

                    <Text style={{ flex: 1,color: '#05375a', fontSize: 15, marginLeft:10, }}>{item.wko_isp_stp_desc}</Text>
                  </View>

                  {/* <View style={{ alignItems: 'center',flexDirection: 'row',marginTop:5,display: !std_show ? 'flex' : 'none',}}>
                    <MaterialCommunityIcons
                      name="clipboard-list-outline"
                      color={'#05375a'}
                      size={20}/>

                    <Text style={{ color: '#05375a', fontSize: 15, marginLeft:10 }}>{item.wko_isp_content}</Text>
                  </View>

                  <View style={{ alignItems: 'center',flexDirection: 'row',marginTop:5,display: !std_show ? 'flex' : 'none', }}>
                      <MaterialCommunityIcons
                        name="cog-transfer-outline"
                        color={'#05375a'}
                        size={20}/>

                      <Text style={{ color: '#05375a', fontSize: 15, marginLeft:10 }}>{item.wko_isp_method}</Text>
                  </View>


                  <View style={{ alignItems: 'center',flexDirection: 'row',marginTop:5,display: !std_show ? 'flex' : 'none', }}>
                      <MaterialCommunityIcons
                        name="file-document-outline"
                        color={'#05375a'}
                        size={20}/>

                      <Text style={{ color: '#05375a', fontSize: 12, marginLeft:10 }}>{item.wko_isp_std}</Text>
                  </View> */}
                </View>
              </View>
            </View>

            <View>
              {/* Text */}
              <View style={[styles.view_style]}>
                <TextInput
                  value={item.wko_isp_varchar1}
                  style={[ styles.input, {height: Platform.OS === 'ios' ? 45 : 45} ]}
                  multiline={true}
                  numberOfLines={4}
                  inputStyle={[ styles.inputStyle, {color: text ? '#808080' : '#000'}, ]}
                  labelStyle={styles.labelStyle}
                  placeholderStyle={{ fontSize: 15, color: text ? '#808080' : '#0096FF', }}
                  label="Text"
                  editable={!text}
                  selectTextOnFocus={!text}
                  onChangeText={text => { changetext(item.rowid,text)}}
                />
              </View>

              {/* Remark */}
              <View style={[styles.view_style]}>
                <TextInput
                  value={item.wko_isp_varchar2}
                  style={[ styles.input, { height: Math.max( Platform.OS === 'ios' ? 45 : 45, Text_height)}]}
                  onContentSizeChange={event => setText_height(event.nativeEvent.contentSize.height) }
                  multiline={true}
                  inputStyle={[ styles.inputStyle, {color: text ? '#808080' : '#000'}]}
                  labelStyle={styles.labelStyle}
                  placeholderStyle={{ fontSize: 12, color: text ? '#808080' : '#0096FF'}}
                  label="Remark"
                  editable={!text}
                  selectTextOnFocus={!text}
                  onChangeText={text => { changetextremark(item.rowid, text) }}
                />
              </View>
            </View>

            {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, display: !show ? 'flex' : 'none',alignItems: 'center', }}>
              <Text style={{ color: '#05375a', fontWeight: 'bold', marginLeft: 5, fontSize: 12, }}></Text>
              <Pressable onPress={() => Attachment_show(item)}>
                <View style={{ backgroundColor: '#2ECC71', padding: 5, borderRadius: 5, }}>
                  <Text placeholder="Test" style={{ color: '#FFF', fontWeight: 'bold', justifyContent: 'flex-start',fontSize: 12, }}> View Attachment </Text>
                </View>
              </Pressable>
            </View> */}
          </View>
        );
        break;
      case 'N':

        //console.log('NumberRemark item', item.index);

        if (item.wko_isp_varchar3 === '0') {
          var togg = false;
          var num = true;
          var iocn_color = '#D6DBDF';
          var back_color = '#D6DBDF';
        } else {
          var togg = true;
          var num = false;
          var back_color = '#fff';
          if (!item.wko_isp_numeric1) {
            var iocn_color = '#E65100';
          } else {
            var iocn_color = '#2Ecc71';

           

            let num = parseFloat(item.wko_isp_numeric1).toFixed(2)
            let max = parseFloat(item.wko_isp_max_thr).toFixed(2)
            let min = parseFloat(item.wko_isp_min_thr).toFixed(2)

            console.log('NUM',num)
            console.log('MAX',max)
            console.log('MIN',min)

            if(parseFloat(num) < parseFloat(min)){

              var minvlaue = true;

            }else if(parseFloat(num) > parseFloat(max)){

              var mixvlaue = true;

            } else {

              var minvlaue = false;
              var mixvlaue = false;

            }           
            

          }
        }
        
        // var number1
        // if (item.wko_isp_numeric1 === '' || item.wko_isp_numeric1 === null) {
        //    number1 = null
        // } else {

        //   number1 =  parseFloat(item.wko_isp_numeric1).toFixed(2);
        // }

        if (item.wko_isp_ovr_thr === '1') {
          var ovr_thr_check = true;
        } else {
          var ovr_thr_check = false;
        }

        var show;
        if (item.file_link === null) {
          show = true;
        } else {
          show = false;
        }

        var MIN, MAX, UOM;
        if (item.wko_isp_min_thr === '' || item.wko_isp_min_thr === null) {
          MIN = '0.0';
        } else {
          MIN = item.wko_isp_min_thr;
        }

        if (item.wko_isp_max_thr === '' || item.wko_isp_max_thr === null) {
          MAX = '0.0';
        } else {
          MAX = item.wko_isp_max_thr;
        }

        if (item.wko_isp_uom === '' || item.wko_isp_uom === null) {
          UOM = '0.0';
        } else {
          UOM = item.wko_isp_uom;
        }

        // var std_show;
        // if (item.wko_isp_content === null || item.wko_isp_method === null || item.wko_isp_std === null) {
        //   std_show = true;
        // } else {
        //   std_show = false;
        // }

        // console.log('e',item.wko_isp_min_thr)
        return (
          <View style={[styles.card,num ? {backgroundColor:back_color,borderColor:'#AEB6BF',borderWidth:1,borderLeftWidth:9} : {borderLeftWidth:9,borderLeftColor:iocn_color,backgroundColor:back_color}]}>
            <View style={styles.headerone}>
              <View style={{flex: 1}}>
                <Text style={{ color: '#767577', fontWeight: 'bold', fontSize: 12, marginLeft: 5, }}> {item.wko_isp_sec_desc} </Text>
              </View>
              <View style={{width: '30%'}}>
                <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row',alignItems: 'center', }}>

                  <View style={{display: !show ? 'flex' : 'none',marginRight:25}}>
                    <MaterialCommunityIcons
                    name="file-eye-outline"
                    color={'#05375a'}
                    onPress={() => Attachment_show(item)}
                    size={25}/>

                  </View>
                  <Switch
                    trackColor={{false: '#767577', true: '#81b0ff'}}
                    thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() =>
                      toggleSwitch(item.rowid, togg, item.wko_isp_stp_datatype)
                    }
                    value={togg}
                  />
                </View>
              </View>
            </View>

            <View style={{ height: 1, width: '100%', marginTop: 10, backgroundColor: '#C8C8C8'}} />

            <View style={styles.headertwo}>
              <View style={{flex: 1, justifyContent: 'center',flexDirection: 'row',}}>
                <Text style={{ color: '#05375a', fontWeight: 'bold', fontSize: 15, marginLeft: 5, }} ellipsizeMode="tail"> {item.wko_isp_stp_no } </Text>
                <View style={{flex: 1,marginLeft: 5}}>

                <View style={{ flex: 1,flexDirection: 'row',}}>
                    <MaterialCommunityIcons
                      name="clipboard-minus-outline"
                      color={'#05375a'}
                      size={20}/>

                    <Text style={{ flex: 1,color: '#05375a', fontSize: 15, marginLeft:10, }}>{item.wko_isp_stp_desc}</Text>
                  </View>

                  {/* <View style={{ alignItems: 'center',flexDirection: 'row',marginTop:5,display: !std_show ? 'flex' : 'none',}}>
                    <MaterialCommunityIcons
                      name="clipboard-list-outline"
                      color={'#05375a'}
                      size={20}/>

                    <Text style={{ color: '#05375a', fontSize: 15, marginLeft:10 }}>{item.wko_isp_content}</Text>
                  </View>

                  <View style={{ alignItems: 'center',flexDirection: 'row',marginTop:5,display: !std_show ? 'flex' : 'none', }}>
                      <MaterialCommunityIcons
                        name="cog-transfer-outline"
                        color={'#05375a'}
                        size={20}/>

                      <Text style={{ color: '#05375a', fontSize: 15, marginLeft:10 }}>{item.wko_isp_method}</Text>
                  </View>


                  <View style={{ alignItems: 'center',flexDirection: 'row',marginTop:5,display: !std_show ? 'flex' : 'none', }}>
                      <MaterialCommunityIcons
                        name="file-document-outline"
                        color={'#05375a'}
                        size={20}/>

                      <Text style={{ color: '#05375a', fontSize: 15, marginLeft:10 }}>{item.wko_isp_std}</Text>
                  </View> */}
                </View>
              </View>
            </View>

            <View style={{justifyContent: 'center'}}>

              <View style={[styles.view_style]}>
                <RNTextInput
                  value={item.wko_isp_numeric1}
                  style={[ styles.input, { height: Math.max( Platform.OS === 'ios' ? 45 : 45)}]}
                  key={item.rowid}
                  placeholderTextColor={num ? '#808080' : '#0096FF'}
                  inputStyle={[ styles.inputStyle, {color: num ? '#0096FF' : '#000'}]}
                  labelStyle={styles.labelStyle}
                  placeholderStyle={{ fontSize: 12, color: num ? '#808080' : '#0096FF',}}
                  textErrorStyle={styles.textErrorStyle}
                  keyboardType="numeric"
                  placeholder="Number"
                  editable={!num}
                  selectTextOnFocus={!num}
                  onChangeText={(text) => {
                    if (text===''|| text.match(/^\d+(\.\d{0,2})?$/)){

                      item.wko_isp_numeric1 = text
                        changenumbertext(item.rowid, text,index)
                    
                    }
                  }}
                />
              </View>

              {/* Remark */}
              <View style={[styles.view_style]}>
                <TextInput
                  value={item.wko_isp_varchar2}
                  style={[ styles.input, { height: Math.max( Platform.OS === 'ios' ? 45 : 45, Num_height)}]}
                  onContentSizeChange={event => setNum_height(event.nativeEvent.contentSize.height) }
                  multiline={true}
                  inputStyle={[ styles.inputStyle, {color: num ? '#808080' : '#000'}]}
                  labelStyle={styles.labelStyle}
                  placeholderStyle={{ fontSize: 12, color: num ? '#808080' : '#0096FF',}}
                  textErrorStyle={styles.textErrorStyle}
                  label="Remark"
                  editable={!num}
                  selectTextOnFocus={!num}
                  onChangeText={text => { changenumberremark(item.rowid, text)}}
                />
              </View>
            </View>

            <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-between', alignItems: 'center',}}>
              <View style={{flex: 1, flexDirection: 'row', backgroundColor:minvlaue ? 'red':'#FFF',borderRadius:5,padding:5,justifyContent: 'center'}}>
                <Text style={{ color: minvlaue ? '#FFF':'#05375a', fontSize: 12, }}> Min :</Text>
                <Text style={{color: minvlaue ? '#FFF':'#05375a', fontSize: 12,}}> {parseFloat(MIN).toFixed(2)} </Text>
              </View>

              <View style={{ flex: 1, flexDirection: 'row',backgroundColor:mixvlaue ? 'red':'#FFF',borderRadius:5,padding:5 , justifyContent: 'center',}}>
                <Text style={{ color: mixvlaue ? '#FFF':'#05375a',  fontSize: 12, }}> Max :</Text>
                <Text style={{color: mixvlaue ? '#FFF':'#05375a', fontSize: 12,}}> {parseFloat(MAX).toFixed(2)} </Text>
              </View>

              <View style={{flex: 1, flexDirection: 'row',padding:5 , justifyContent: 'center',}}>
                <Text style={{ color: '#05375a',fontSize: 12, }}> UOM :</Text>
                <Text style={{color: '#05375a',fontSize: 12,}}> {UOM} </Text>
              </View>
            </View>

            

            {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, display: !show ? 'flex' : 'none',alignItems: 'center', }}>
              <Text style={{ color: '#05375a', fontWeight: 'bold', marginLeft: 5, fontSize: 12, }}></Text>
              <Pressable onPress={() => Attachment_show(item)}>
                <View style={{ backgroundColor: '#2ECC71', padding: 5, borderRadius: 5, }}>
                  <Text placeholder="Test" style={{ color: '#FFF', fontWeight: 'bold', justifyContent: 'flex-start', fontSize: 12,}}> View Attachment </Text>
                </View>
              </Pressable>
            </View> */}
          </View>
        );
        break;
      case 'D':
        if (item.wko_isp_varchar3 === '0') {
          var togg = false;
          var date = true;
          var iocn_color = '#D6DBDF';
          var back_color = '#D6DBDF';
        } else {
          var togg = true;
          var date = false;
          var back_color = '#fff';
          if (!item.wko_isp_datetime1) {
            var iocn_color = '#E65100';
          } else {
            var iocn_color = '#2Ecc71';
          }
        }

        if (!item.wko_isp_datetime1) {
          var datetime = item.wko_isp_datetime1;
        } else {
          if (!item.wko_isp_datetime1.date) {
            var datetime = moment(item.wko_isp_datetime1).format(
              'YYYY-MM-DD hh:mm',
            );
          } else {
            var datetime = moment(item.wko_isp_datetime1.date).format(
              'YYYY-MM-DD hh:mm',
            );
          }
        }

        var show;
        if (item.file_link === null) {
          show = true;
        } else {
          show = false;
        }

        // var std_show;
        // if (item.wko_isp_content === null || item.wko_isp_method === null || item.wko_isp_std === null) {
        //   std_show = true;
        // } else {
        //   std_show = false;
        // }

        return (
          <View style={[styles.card,date ? {backgroundColor:back_color,borderColor:'#AEB6BF',borderWidth:1} : {borderLeftWidth:9,borderLeftColor:iocn_color,backgroundColor:back_color}]}>
            <View style={styles.headerone}>
              <View style={{flex: 1}}>
                <Text style={{ color: '#767577', fontWeight: 'bold', fontSize: 12, marginLeft: 5, }} ellipsizeMode="tail"> {item.wko_isp_sec_desc} </Text>
              </View>

              <View style={{width: '30%'}}>
                <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', }}>

                  <View style={{display: !show ? 'flex' : 'none',marginRight:25}}>
                    <MaterialCommunityIcons
                     name="file-eye-outline"
                    color={'#05375a'}
                    onPress={() => Attachment_show(item)}
                    size={25}/>

                  </View>
                  

                  <Switch
                    trackColor={{false: '#767577', true: '#81b0ff'}}
                    thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() =>
                      toggleSwitch(item.rowid, togg, item.wko_isp_stp_datatype)
                    }
                    value={togg}
                  />
                </View>
              </View>
            </View>

            <View style={{ height: 1, width: '100%', marginTop: 10, backgroundColor: '#C8C8C8', }} />

            <View style={styles.headertwo}>
              <View style={{flex: 1, justifyContent: 'center',flexDirection: 'row',}}>
                <Text style={{ color: '#05375a', fontWeight: 'bold', fontSize: 15, marginLeft: 5, }} ellipsizeMode="tail"> {item.wko_isp_stp_no } </Text>
                <View style={{flex: 1,marginLeft: 5}}>

                <View style={{ flex: 1,flexDirection: 'row',}}>
                    <MaterialCommunityIcons
                      name="clipboard-minus-outline"
                      color={'#05375a'}
                      size={20}/>

                    <Text style={{ flex: 1,color: '#05375a', fontSize: 15, marginLeft:10, }}>{item.wko_isp_stp_desc}</Text>
                  </View>

                  {/* <View style={{ alignItems: 'center',flexDirection: 'row',marginTop:5,display: !std_show ? 'flex' : 'none',}}>
                    <MaterialCommunityIcons
                      name="clipboard-list-outline"
                      color={'#05375a'}
                      size={20}/>

                    <Text style={{ color: '#05375a', fontSize: 15, marginLeft:10 }}>{item.wko_isp_content}</Text>
                  </View>

                  <View style={{ alignItems: 'center',flexDirection: 'row',marginTop:5,display: !std_show ? 'flex' : 'none', }}>
                      <MaterialCommunityIcons
                        name="cog-transfer-outline"
                        color={'#05375a'}
                        size={20}/>

                      <Text style={{ color: '#05375a', fontSize: 15, marginLeft:10 }}>{item.wko_isp_method}</Text>
                  </View>


                  <View style={{ alignItems: 'center',flexDirection: 'row',marginTop:5,display: !std_show ? 'flex' : 'none', }}>
                      <MaterialCommunityIcons
                        name="file-document-outline"
                        color={'#05375a'}
                        size={20}/>

                      <Text style={{ color: '#05375a', fontSize: 15, marginLeft:10 }}>{item.wko_isp_std}</Text>
                  </View> */}
                </View>
              </View>
            </View>

            <View>

            {/* From Date */}
            <View style={styles.view_style}>
              <Pressable
                onPress={() => (date ? '' : showDatePicker(item.rowid))}>
                <View pointerEvents={'none'}>
                  <TextInput
                    value={datetime}
                    style={[ styles.input, { height: Platform.OS === 'ios' ? 45 : 45 } ]}
                    inputStyle={[ styles.inputStyle, {color: date ? '#808080' : '#000'} ]}
                    labelStyle={styles.labelStyle}
                    placeholderStyle={{ fontSize: 12, color: date ? '#808080' : '#0096FF'}}
                    label="Date"
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

            {/* Date Remark */}
            <View style={[styles.view_style]}>
              <TextInput
                value={item.wko_isp_varchar2}
                style={[ styles.input, { height: Math.max( Platform.OS === 'ios' ? 45 : 45, Date_height ) } ]}
                onContentSizeChange={event => setDate_height(event.nativeEvent.contentSize.height) }
                multiline={true}
                inputStyle={[ styles.inputStyle, {color: date ? '#808080' : '#000'}, ]}
                labelStyle={styles.labelStyle}
                placeholderStyle={{ fontSize: 12, color: date ? '#808080' : '#0096FF' }}
                textErrorStyle={styles.textErrorStyle}
                label="Remark"
                editable={!date}
                selectTextOnFocus={!date}
                onChangeText={text => {
                  changedatetimeremark(item.rowid, text);
                }}
              />
            </View>
            </View>

            {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, display: !show ? 'flex' : 'none',alignItems: 'center', }}>
              <Text style={{ color: '#05375a', fontWeight: 'bold', marginLeft: 5,fontSize: 12, }}></Text>
              <Pressable onPress={() => Attachment_show(item)}>
                <View style={{ backgroundColor: '#2ECC71', padding: 5, borderRadius: 5, }}>
                  <Text placeholder="Test" style={{ color: '#FFF', fontWeight: 'bold', justifyContent: 'flex-start',fontSize: 12,}}> View Attachment </Text>
                </View>
              </Pressable>
            </View> */}
          </View>
        );
        break;
      case 'C':
       // console.log('check',item)
        if (item.wko_isp_checkbox1 === '0') {
          var checkboxvalue = false;
          var colorcode = '#767577';
        } else {
          var checkboxvalue = true;
          var colorcode = '#2Ecc71';
        }

        if (item.wko_isp_varchar3 === '0') {
          var togg = false;
          var check = true;
          var iocn_color = '#D6DBDF';
          var back_color = '#D6DBDF';
        } else {
          var togg = true;
          var check = false;
          var back_color = '#fff';
          if (item.wko_isp_checkbox1 === '0') {
            var iocn_color = '#E65100';
          } else {
            var iocn_color = '#2Ecc71';
          }
        }

        var show;
        if (item.file_link === null) {
          show = true;
        } else {
          show = false;
        }

        // var std_show;
        // if (item.wko_isp_content === null || item.wko_isp_method === null || item.wko_isp_std === null) {
        //   std_show = true;
        // } else {
        //   std_show = false;
        // }

        return (
          <View style={[styles.card,check ? {backgroundColor:back_color,borderColor:'#AEB6BF',borderWidth:1} : {borderLeftWidth:9,borderLeftColor:iocn_color,backgroundColor:back_color}]}>
            <View style={styles.headerone}>
              <View style={{flex: 1}}>
                <Text style={{ color: '#767577', fontWeight: 'bold', fontSize: 12, marginLeft: 5, }} ellipsizeMode="tail"> {item.wko_isp_sec_desc} </Text>
              </View>

              <View style={{width: '30%'}}>
                <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', }}>

                  <View style={{display: !show ? 'flex' : 'none',marginRight:25}}>
                    <MaterialCommunityIcons
                     name="file-eye-outline"
                    color={'#05375a'}
                    onPress={() => Attachment_show(item)}
                    size={25}/>

                  </View>
                  

                  <Switch
                    trackColor={{false: '#767577', true: '#81b0ff'}}
                    thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() =>
                      toggleSwitch(item.rowid, togg, item.wko_isp_stp_datatype)
                    }
                    value={togg}
                  />
                </View>
              </View>
            </View>

            <View style={{ height: 1, width: '100%', marginTop: 10, backgroundColor: '#C8C8C8', }} />

            <View style={styles.headertwo}>
              <View style={{flex: 1, justifyContent: 'center',flexDirection: 'row',}}>
                <Text style={{ color: '#05375a', fontWeight: 'bold', fontSize: 15, marginLeft: 5, }} ellipsizeMode="tail"> {item.wko_isp_stp_no } </Text>
                <View style={{flex: 1,marginLeft: 5}}>

                  <View style={{flex: 1,flexDirection: 'row',}}>
                    <MaterialCommunityIcons
                      name="clipboard-minus-outline"
                      color={'#05375a'}
                      size={20}/>

                    <Text style={{ flex: 1,color: '#05375a', fontSize: 15, marginLeft:10,}}>{item.wko_isp_stp_desc}</Text>
                  </View>

                  {/* <View style={{ alignItems: 'center',flexDirection: 'row',marginTop:5,display: !std_show ? 'flex' : 'none',}}>
                    <MaterialCommunityIcons
                      name="clipboard-list-outline"
                      color={'#05375a'}
                      size={20}/>

                    <Text style={{ color: '#05375a', fontSize: 15, marginLeft:10 }}>{item.wko_isp_content}</Text>
                  </View>

                  <View style={{ alignItems: 'center',flexDirection: 'row',marginTop:5,display: !std_show ? 'flex' : 'none', }}>
                      <MaterialCommunityIcons
                        name="cog-transfer-outline"
                        color={'#05375a'}
                        size={20}/>

                      <Text style={{ color: '#05375a', fontSize: 15, marginLeft:10 }}>{item.wko_isp_method}</Text>
                  </View>


                  <View style={{ alignItems: 'center',flexDirection: 'row',marginTop:5,display: !std_show ? 'flex' : 'none', }}>
                      <MaterialCommunityIcons
                        name="file-document-outline"
                        color={'#05375a'}
                        size={20}/>

                      <Text style={{ color: '#05375a', fontSize: 15, marginLeft:10 }}>{item.wko_isp_std}</Text>
                  </View> */}
                </View>
              </View>
            </View>

            <View>
              <View style={{alignItems: 'center'}}>
                {/* <Text style={styles.checkboxtext}>Check Box</Text> */}

                <BouncyCheckbox
                  style={{marginTop: 10}}
                  size={45}
                  fillColor={colorcode}
                  unfillColor={check ? '#D6DBDF' : '#fff'}
                  isChecked={checkboxvalue}
                  disableBuiltInState={true}
                  disabled={check}
                  iconStyle={{borderColor: '#f5dd4b', borderRadius: 10}}
                  innerIconStyle={{borderWidth: 3, borderRadius: 10}}
                  textStyle={{fontFamily: 'JosefinSans-Regular'}}
                  onPress={() => {
                    chekcbox(item.rowid, checkboxvalue);
                  }}
                />
              </View>

              {/* Remark */}
              <View style={[styles.view_style]}>
                <TextInput
                  value={item.wko_isp_varchar2}
                  style={[ styles.input, { height: Math.max( Platform.OS === 'ios' ? 45 : 45, Chek_height, ), }, ]}
                  onContentSizeChange={event => setChek_height(event.nativeEvent.contentSize.height) }
                  multiline={true}
                  inputStyle={[ styles.inputStyle, {color: check ? '#808080' : '#000'}, ]}
                  labelStyle={styles.labelStyle}
                  placeholderStyle={{ fontSize: 12,  color: check ? '#808080' : '#0096FF', }}
                  textErrorStyle={styles.textErrorStyle}
                  label="Remark"
                  editable={!check}
                  selectTextOnFocus={!check}
                  onChangeText={text => {
                    changecheckboxremark(item.rowid, text);
                  }}
                  renderRightIcon={() => (check ? '' : '')}
                />
              </View>
            </View>

            {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, display: !show ? 'flex' : 'none',alignItems: 'center', }}>
              <Text style={{ color: '#05375a', fontWeight: 'bold', marginLeft: 5,fontSize: 12, }}></Text>
              <Pressable onPress={() => Attachment_show(item)}>
                <View style={{ backgroundColor: '#2ECC71', padding: 5, borderRadius: 5, }}>
                  <Text placeholder="Test" style={{ color: '#FFF', fontWeight: 'bold', justifyContent: 'flex-start',fontSize: 12, }}> View Attachment </Text>
                </View>
              </Pressable>
            </View> */}
          </View>
        );
        break;
      case 'Z':
        if (item.wko_isp_varchar3 === '0') {
          var togg = false;
          var zoom = true;
          var iocn_color = '#D6DBDF';
          var back_color = '#D6DBDF';
        } else {
          var togg = true;
          var zoom = false;
          var back_color = '#fff';
          if (!item.wko_isp_dropdown1) {
            var iocn_color = '#E65100';
          } else {
            var iocn_color = '#2Ecc71';
          }
        }

        var show;
        if (item.file_link === null) {
          show = true;
        } else {
          show = false;
        }

        // var std_show;
        // if (item.wko_isp_content === null || item.wko_isp_method === null || item.wko_isp_std === null) {
        //   std_show = true;
        // } else {
        //   std_show = false;
        // }

        return (
          <View style={[styles.card,zoom ? {backgroundColor:back_color,borderColor:'#AEB6BF',borderWidth:1} : {borderLeftWidth:9,borderLeftColor:iocn_color,backgroundColor:back_color}]}>
            <View style={styles.headerone}>
              <View style={{flex: 1, justifyContent: 'space-between'}}>
                <Text style={{ color: '#767577', fontWeight: 'bold', fontSize: 12, marginLeft: 5, }}> {item.wko_isp_sec_desc} </Text>
              </View>

              <View style={{width: '30%'}}>
                <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', }}>

                  <View style={{display: !show ? 'flex' : 'none',marginRight:25}}>
                    <MaterialCommunityIcons
                    name="file-eye-outline"
                    color={'#05375a'}
                    onPress={() => Attachment_show(item)}
                    size={25}/>

                  </View>
                  
                  <Switch
                    trackColor={{false: '#767577', true: '#81b0ff'}}
                    thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() =>
                      toggleSwitch(item.rowid, togg, item.wko_isp_stp_datatype)
                    }
                    value={togg}
                  />
                </View>
              </View>
            </View>

            <View style={{ height: 1, width: '100%', marginTop: 10, backgroundColor: '#C8C8C8', }} />

            <View style={styles.headertwo}>
              <View style={{flex: 1, justifyContent: 'center',flexDirection: 'row',}}>
                <Text style={{ color: '#05375a', fontWeight: 'bold', fontSize: 15, marginLeft: 5, }} ellipsizeMode="tail"> {item.wko_isp_stp_no } </Text>
                <View style={{flex: 1,marginLeft: 5}}>

                <View style={{ flex: 1,flexDirection: 'row',}}>
                    <MaterialCommunityIcons
                      name="clipboard-minus-outline"
                      color={'#05375a'}
                      size={20}/>

                    <Text style={{ flex: 1,color: '#05375a', fontSize: 15, marginLeft:10, }}>{item.wko_isp_stp_desc}</Text>
                  </View>

                  {/* <View style={{ alignItems: 'center',flexDirection: 'row',marginTop:5,display: !std_show ? 'flex' : 'none',}}>
                    <MaterialCommunityIcons
                      name="clipboard-list-outline"
                      color={'#05375a'}
                      size={20}/>

                    <Text style={{ color: '#05375a', fontSize: 15, marginLeft:10 }}>{item.wko_isp_content}</Text>
                  </View>

                  <View style={{ alignItems: 'center',flexDirection: 'row',marginTop:5,display: !std_show ? 'flex' : 'none', }}>
                      <MaterialCommunityIcons
                        name="cog-transfer-outline"
                        color={'#05375a'}
                        size={20}/>

                      <Text style={{ color: '#05375a', fontSize: 15, marginLeft:10 }}>{item.wko_isp_method}</Text>
                  </View>


                  <View style={{ alignItems: 'center',flexDirection: 'row',marginTop:5,display: !std_show ? 'flex' : 'none', }}>
                      <MaterialCommunityIcons
                        name="file-document-outline"
                        color={'#05375a'}
                        size={20}/>

                      <Text style={{ color: '#05375a', fontSize: 15, marginLeft:10 }}>{item.wko_isp_std}</Text>
                  </View> */}
                </View>
              </View>
            </View>

            {/* Asset Code*/}
            <View style={styles.view_style}>
              <Pressable onPress={() => zoom ? '' : get_zoomlist( 'Zoom List', item.wko_isp_stp_rowid, item.rowid, ) }>
                <View pointerEvents={'none'}>
                  <TextInput
                    value={item.wko_isp_dropdown1}
                    style={[ styles.input, { height: Platform.OS === 'ios' ? 45 : 45 } ]}
                    inputStyle={[ styles.inputStyle, {color: zoom ? '#808080' : '#000'}]}
                    labelStyle={styles.labelStyle}
                    placeholderStyle={{ fontSize: 12, color: zoom ? '#808080' : '#0096FF' }}
                    label="Search Zoom List"
                    editable={false}
                    selectTextOnFocus={false}
                    renderRightIcon={() => (
                      <AntDesign
                        style={styles.icon}
                        color={zoom ? '#808080' : '#05375a'}
                        name={item.wko_isp_dropdown1 ? 'close' : 'search1'}
                        size={22}
                        disable={true}
                      />
                    )}
                  />
                </View>
              </Pressable>
            </View>

            {/* Remark */}
            <View style={[styles.view_style]}>
              <TextInput
                value={item.wko_isp_varchar2}
                style={[ styles.input, { height: Math.max( Platform.OS === 'ios' ? 45 : 45, Zoom_height)}]}
                onContentSizeChange={event => setZoom_height(event.nativeEvent.contentSize.height)}
                multiline={true}
                inputStyle={[ styles.inputStyle, {color: zoom ? '#808080' : '#000'}]}
                labelStyle={styles.labelStyle}
                placeholderStyle={{ fontSize: 12, color: zoom ? '#808080' : '#0096FF'}}
                textErrorStyle={styles.textErrorStyle}
                label="Remark"
                editable={!zoom}
                selectTextOnFocus={!zoom}
                onChangeText={text => { changezoomlistremark(item.rowid, text); }}
                renderRightIcon={() => (zoom ? '' : '')}
              />
            </View>

            {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, display: !show ? 'flex' : 'none', alignItems: 'center',}}>
              <Text style={{ color: '#05375a', fontWeight: 'bold', marginLeft: 5, fontSize: 12, }}></Text>
              <Pressable onPress={() => Attachment_show(item)}>
                <View style={{ backgroundColor: '#2ECC71', padding: 5, borderRadius: 5, }}>
                  <Text placeholder="Test" style={{ color: '#FFF', fontWeight: 'bold', justifyContent: 'flex-start',fontSize: 12, }}> View Attachment </Text>
                </View>
              </Pressable>
            </View> */}
          </View>
        );
        break;
    }
    return null;
  };

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View style={{ height: 0, width: '100%', backgroundColor: '#C8C8C8' }} />
    );
  };

  //Zoom Attachment
  const Attachment_show = item => {
    //console.log('show:', item);
    setimages_link([]);
   

    if (item.file_link === null) {
      alert('No Attachment file');
    } else {

     
      const lowerCaseFileName = item.file_name.toLowerCase();

      if (lowerCaseFileName.endsWith('.jpg') || lowerCaseFileName.endsWith('.jpeg')) {

        setType_link('IMAGE')

        console.log('show:', '0');

        if (WIFI == 'OFFLINE') {
          setimages_link('file://' + item.file_link);
        } else {

            console.log('show:', '1');
            setimages_link(images_link=>[...images_link,{ key:0,url:item.file_link}]);

          console.log('show:', item.file_link);
        }

      } else if (lowerCaseFileName.endsWith('.pdf')) {

        setType_link('PDF')

        if (WIFI == 'OFFLINE') {
          setimages_link('file://' + item.file_link);
        } else {
          setimages_link(item.file_link);
        }


      }

      setZoomAttachments_modalVisible(true);
    }
  };


  //Zoom Attachment
  const Attachment_PDF_show = () => {
    setType_link('PDF')

    //let url = `${Baseurl}/Report/checklist.php?site_cd=${Site_cd}&mst_rowid=${mst_RowID}`
    //console.log('item.path',item.path);
    const encodepdfurl = encodeURI(`${Baseurl}/Report/checklist.php?site_cd=${Site_cd}&mst_rowid=${mst_RowID}`);
    console.log('encodepdfurl',encodepdfurl);

    setlink(encodepdfurl);
    setZoomAttachments_modalVisible(true);
    
  };

  //Togg
  const toggleSwitch = (id, value, type) => {
    console.log('SELECTED ITEM ' + id + ': ' + value + ': ' + type);

    switch (type) {
      case 'T':
        listDataSource.map(item => {
          if (item.rowid == id) {
            item.tog = !value;
            if (!value) {
              item.wko_isp_varchar3 = '1';
            } else {
              item.wko_isp_varchar3 = '0';
              item.wko_isp_varchar1 = null;
            }

            return item;
          }
          return item;
        });

        const newData1 = filteredDataSource.map(item => {
          if (item.rowid == id) {
            item.tog = !value;
            if (!value) {
              item.wko_isp_varchar3 = '1';
            } else {
              item.wko_isp_varchar3 = '0';
              item.wko_isp_varchar1 = null;
            }

            return item;
          }
          return item;
        });

        setFilteredDataSource(newData1);

        break;

      case 'N':
        listDataSource.map(item => {
          if (item.rowid == id) {
            item.tog = !value;
            if (!value) {
              item.wko_isp_varchar3 = '1';
            } else {
              item.wko_isp_varchar3 = '0';
              item.wko_isp_numeric1 = null;
            }
            return item;
          }
          return item;
        });

        const newData2 = filteredDataSource.map(item => {
          if (item.rowid == id) {
            item.tog = !value;
            if (!value) {
              item.wko_isp_varchar3 = '1';
            } else {
              item.wko_isp_varchar3 = '0';
              item.wko_isp_numeric1 = null;
            }
            return item;
          }
          return item;
        });
        setFilteredDataSource(newData2);

        break;

      case 'D':
        listDataSource.map(item => {
          if (item.rowid == id) {
            item.tog = !value;
            if (!value) {
              item.wko_isp_varchar3 = '1';
            } else {
              item.wko_isp_varchar3 = '0';
              item.wko_isp_datetime1 = null;
            }
            return item;
          }
          return item;
        });

        const newData3 = filteredDataSource.map(item => {
          if (item.rowid == id) {
            item.tog = !value;
            if (!value) {
              item.wko_isp_varchar3 = '1';
            } else {
              item.wko_isp_varchar3 = '0';
              item.wko_isp_datetime1 = null;
            }
            return item;
          }
          return item;
        });

        setFilteredDataSource(newData3);
        break;

      case 'C':
        listDataSource.map(item => {
          if (item.rowid == id) {
            item.tog = !value;
            if (!value) {
              item.wko_isp_varchar3 = '1';
            } else {
              item.wko_isp_varchar3 = '0';
              item.wko_isp_checkbox1 = '0';
            }

            return item;
          }
          return item;
        });

        const newData4 = filteredDataSource.map(item => {
          if (item.rowid == id) {
            item.tog = !value;
            if (!value) {
              item.wko_isp_varchar3 = '1';
            } else {
              item.wko_isp_varchar3 = '0';
              item.wko_isp_checkbox1 = '0';
            }

            return item;
          }
          return item;
        });

        setFilteredDataSource(newData4);
        break;

      case 'Z':
        listDataSource.map(item => {
          if (item.rowid == id) {
            item.tog = !value;

            if (!value) {
              item.wko_isp_varchar3 = '1';
            } else {
              item.wko_isp_varchar3 = '0';
              item.wko_isp_dropdown1 = null;
            }

            return item;
          }
          return item;
        });

        const newData5 = filteredDataSource.map(item => {
          if (item.rowid == id) {
            item.tog = !value;

            if (!value) {
              item.wko_isp_varchar3 = '1';
            } else {
              item.wko_isp_varchar3 = '0';
              item.wko_isp_dropdown1 = null;
            }

            return item;
          }
          return item;
        });
        setFilteredDataSource(newData5);
        break;
    }
  };

  //Text
  const changetext = (id, value) => {
    console.log('Text RowID', id);
    console.log('Text Value', value);

    var total, text_value;
    if (!value) {
      total = 0;
      text_value = null;
    } else {
      total = 1;
      text_value = value;
    }

    listDataSource.map(item => {
      if (item.rowid == id) {
          item.wko_isp_varchar1 = text_value
          item.total = total
        return item;
      }
      return item;
    });

    filteredDataSource.map(item => {
      if (item.rowid == id) {
          item.wko_isp_varchar1 = text_value
          item.total = total
        return item;
      }
      return item;
    });

    
    setisRender(!isRender)
    
  };

  //Text Remark
  const changetextremark = (id, value) => {
    console.log('TextRemark RowID', id);
    console.log('TextRemark Value', value);

    var text_remark_value;
    if (!value) {
      text_remark_value = null;
    } else {
      text_remark_value = value;
    }

    listDataSource.map(item => {
      if (item.rowid == id) {
        item.wko_isp_varchar2 = text_remark_value
        return item;
      }
      return item;
    });

    filteredDataSource.map(item => {
      if (item.rowid == id) {
        item.wko_isp_varchar2 = text_remark_value
        return item;
      }
      return item;
    });

   
    setisRender(!isRender)
  };

  //Number Text
  const changenumbertext = (id, value,e) => {

    console.log('Number RowID', id);
    console.log('Number Value', value);
    console.log('Number e', e);

    var total, number_value;
    if (!value) {
      number_value = null;
      total = 0;
    } else {

      number_value = value
      total = 1;
    }

   listDataSource.map(item => {
      if (item.rowid == id) {
        item.wko_isp_numeric1 = value
        item.total = total
        return item;
      }
      return item;
    });


    filteredDataSource.map(item => {
      if (item.rowid == id) {
        item.wko_isp_numeric1 = value
        item.total = total
        return item;
      }
      return item;
    });

    setisRender(!isRender)

    
  };

  //Number Remark
  const changenumberremark = (id, value) => {
    console.log('NumberRemark RowID', id);
    console.log('NumberRemark Value', value);

    var number_remark_value;
    if (!value) {
      number_remark_value = null
    } else {
      number_remark_value = value
    }


    listDataSource.map(item => {
      if (item.rowid == id) {
        item.wko_isp_varchar2 = number_remark_value
        return item;
      }
      return item;
    });


    filteredDataSource.map(item => {
      if (item.rowid == id) {
        item.wko_isp_varchar2 = number_remark_value
        return item;
      }
      return item;
    });

    setisRender(!isRender)
    
    
    
  };

  //Show Date Time Picker
  const showDatePicker = id => {
    //console.warn(item)
    setDatePickerVisibility(true);
    setDateID(id);
  };

  //Cancel Date Time Picker
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  //selected Data time start and end
  const handleConfirm = date => {
    let fromDate = moment(date).format('yyyy-MM-DD HH:mm');

    var total, datetime;
    if (!fromDate) {
      datetime = null;
      total = 0;
    } else {
      datetime = fromDate;
      total = 1;
    }

    listDataSource.map(item => {
      if (item.rowid == dateID) {
        item.wko_isp_datetime1 = datetime;
        item.total = total;
        return item;
      }
      return item;
    });

    filteredDataSource.map(item => {
      if (item.rowid == dateID) {
        item.wko_isp_datetime1 = datetime;
        item.total = total;
        return item;
      }
      return item;
    });
    setisRender(!isRender)
    hideDatePicker();
  };

  //Datetime Remark
  const changedatetimeremark = (id, value) => {
    console.log('DateTimeRemark RowID', id);
    console.log('DateTimeRemark Value', value);

    var datetime_remark_value;
    if (!value) {
      datetime_remark_value = null;
    } else {
      datetime_remark_value = value;
    }

    listDataSource.map(item => {
      if (item.rowid == id) {
        item.wko_isp_varchar2 = datetime_remark_value;
        return item;
      }
      return item;
    });

    filteredDataSource.map(item => {
      if (item.rowid == id) {
        item.wko_isp_varchar2 = datetime_remark_value;
        return item;
      }
      return item;
    });

    setisRender(!isRender)
  };

  //check Box
  const chekcbox = (id, value) => {
    console.log('CheckBox RowID', id);
    console.log('CheckBox Value', value);

    var check;
    if (!value) {
      check = '1';

      console.log('if', check);
    } else {
      check = '0';

      console.log('else', check);
    }

    listDataSource.map(item => {
      if (item.rowid == id) {
        item.wko_isp_checkbox1 = check;
        item.total = check;
        return item;
      }
      return item;
    });

    filteredDataSource.map(item => {
      if (item.rowid == id) {
        item.wko_isp_checkbox1 = check;
        item.total = check;
        return item;
      }
      return item;
    });
    setisRender(!isRender)
    
  };

  //check Remark
  const changecheckboxremark = (id, value) => {
    console.log('CheckBox_Remark RowID', id);
    console.log('CheckBox_Remark Value', value);

    var checkbox_remark_value;
    if (!value) {
      checkbox_remark_value = null;
    } else {
      checkbox_remark_value = value;
    }

    listDataSource.map(item => {
      if (item.rowid == id) {
        item.wko_isp_varchar2 = checkbox_remark_value;
        return item;
      }
      return item;
    });

    filteredDataSource.map(item => {
      if (item.rowid == id) {
        item.wko_isp_varchar2 = checkbox_remark_value;
        return item;
      }
      return item;
    });

    setisRender(!isRender)
  };

  //Zoom list
  const zommlist = (id, value) => {
    console.log('EDIT TEXT ' + id);
    console.log('SELECTED ITEM ' + id);
    const newData = listDataSource.map(item => {
      if (item.rowid == id) {
        //console.log("SELECTED ITEM "+  item.selected_Employee)
        //console.log("SELECTED ITEM 2"+  option.key)
        item.wko_isp_dropdown1 = value.label;

        return item;
      }
      return item;
    });
    //console.log("SELECTED ITEM 23"+ JSON.stringify(newData) )
    setFilteredDataSource(newData);
    setisRender(!isRender);
  };

  //Zoom List Remark
  const changezoomlistremark = (id, value) => {
    console.log('Zoomlist_Remark RowID', id);
    console.log('Zoomlist_Remark Value', value);

    var zoonlist_remark_value;
    if (!value) {
      zoonlist_remark_value = null;
    } else {
      zoonlist_remark_value = value;
    }

    listDataSource.map(item => {
      if (item.rowid == id) {
        item.wko_isp_varchar2 = zoonlist_remark_value;
        return item;
      }
      return item;
    });

    filteredDataSource.map(item => {
      if (item.rowid == id) {
        item.wko_isp_varchar2 = zoonlist_remark_value;
        return item;
      }
      return item;
    });
    setisRender(!isRender)
    setZoomListvisable(false);
  };

  //Selection Dropdown

  const get_zoomlist = async (dropname, ZoomID, rowid) => {
    console.log('dropname', dropname);
    console.log('ZoomID', ZoomID);
    console.log('rowid', rowid);

    setspinner(true);

    if (WIFI === 'OFFLINE') {
      db.transaction(function (txn) {
        txn.executeSql(
          'select * from stp_zom where mst_RowID =?',
          [ZoomID],
          (tx, results) => {
            var Zoom_list = [];
            console.log('workclass:' + results.rows.length);

            if (results.rows.length > 0) {
              for (let i = 0; i < results.rows.length; ++i) {
                Zoom_list.push(results.rows.item(i));
              }

              setspinner(false);

              setZoomList(Zoom_list);
              setBoxtextvalue(rowid);
              settextvalue(dropname);
              setDropDownFilteredData(Zoom_list);
              setDropdown_data(Zoom_list);
              setDropDown_modalVisible(!DropDown_modalVisible);
            } else {
              setspinner(false);
            }
          },
        );
      });
    } else {
      try {
        console.log(
          'JSON DATA : ' +
            `${Baseurl}/get_zoomlist.php?site_cd=${Site_cd}&RowID=${ZoomID}`,
        );
        const response = await axios.get(
          `${Baseurl}/get_zoomlist.php?site_cd=${Site_cd}&RowID=${ZoomID}`,
        );

        //console.log("JSON DATA : " + JSON.stringify( response.data.data))

        if (response.data.status === 'SUCCESS') {
          if (response.data.data.length > 0) {
            setspinner(false);

            setZoomList(response.data.data);
            setBoxtextvalue(rowid);
            settextvalue(dropname);
            setDropDownFilteredData(response.data.data);
            setDropdown_data(response.data.data);
            setDropDown_modalVisible(!DropDown_modalVisible);
          } else {
            setspinner(false);
          }
        } else {
          setspinner(false);
          setAlert(true, 'danger', response.data.message, 'OK');
          return;
        }
      } catch (error) {
        setspinner(false);
        alert(error);
      }
    }
  };

  //Dropdown Filter
  const DropDown_searchFilterFunction = text => {
    // Check if searched text is not blank
    if (text) {
      let newData;

      if (textvalue == 'Zoom List') {
        newData = ZoomList.filter(function (item) {
          const itemData = `${item.stp_zom_data.toUpperCase()})`;

          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      }

      setDropDownFilteredData(newData);
      setDropDown_search(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setDropDownFilteredData(ZoomList);
      setDropDown_search(text);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);

    if (textvalue == 'Zoom List') {
      setDropDownFilteredData(ZoomList);
    }

    setRefreshing(false);
  }, [refreshing]);

  const renderText = item => {
    if (textvalue == 'Zoom List') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            {/* <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Zoom Value : </Text> 
            </View> */}
              <View style={{flex: 1}}>
                <Text
                  placeholder="Test"
                  style={{justifyContent: 'flex-start', color: '#000'}}>
                  {item.stp_zom_data}
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

  const getItem = ditem => {
    // Function for click on an item
    //alert('Id : ' + JSON.stringify(item) );

    if (textvalue == 'Zoom List') {
      listDataSource.map(item => {
        if (item.rowid == Boxtextvalue) {
          item.wko_isp_dropdown1 = ditem.stp_zom_data;
          item.total = 1;
          return item;
        }
        return item;
      });

      filteredDataSource.map(item => {
        if (item.rowid == Boxtextvalue) {
          item.wko_isp_dropdown1 = ditem.stp_zom_data;
          item.total = 1;
          return item;
        }
        return item;
      });
    }

    setDropDown_search('');
    setDropDown_modalVisible(!DropDown_modalVisible);
  };

  const setAlert = (show, theme, title, type) => {
    setShow(show);
    setTheme(theme);
    setTitle(title);
    setAlertType(type);
  };

  const setAlert_two = (show, theme, title, type) => {
    setShow_two(show);
    setTheme(theme);
    setTitle(title);
    setAlertType(type);
  };

  const One_Alret_onClick = D => {
    if (D === 'OK') {
      setShow(false);
    } else if (D === 'UPDATE_CHEKLIST') {
      setShow(false);

      setTimeout(() => {

        if (WIFI === 'OFFLINE') {
          get_check_list_detalis_offline();
        } else {
         // get_check_list_header();
        }

    }, 500)
      
    }
  };

  const Alret_onClick = D => {
    setShow_two(false);

    if (D === 'BACK') {
      _goBack();
    }
  };

  return (
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
              <Text style={{ fontSize: 15, justifyContent: 'center', textAlign: 'center', color: '#fff', fontWeight: 'bold', marginLeft: 1, }}> {Toolbartext + ' - ' + Check_No} </Text>
            </View>
          </Pressable>

          <View style={{flexDirection: 'row', alignItems: 'center',marginBottom: 5}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Pressable onPress={() => setAlert( true, 'info', 'Check List Description:' + '\n\n' + CheckDesc, 'OK', ) }>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginRight: 15 }}>
                  <Text style={{ fontSize: 15, justifyContent: 'center', textAlign: 'center', color: '#fff', fontWeight: 'bold'}}> Info </Text>
                  <AntDesign name="infocirlce" color="#FFF" size={25} style={{marginTop: 4}} />
                </View>
              </Pressable>
            </View>

            {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Pressable onPress={() => Attachment_PDF_show() }>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginRight: 15 }}>
                  <Text style={{ fontSize: 15, justifyContent: 'center', textAlign: 'center', color: '#fff', fontWeight: 'bold'}}> PDF </Text>
                  <FontAwesome5 name="file-pdf" color="#FFF" size={25} style={{marginTop: 4}} />
                </View>
              </Pressable>
            </View> */}
          </View>

          

        </View>
      </Appbar.Header>

      <SCLAlert theme={Theme} show={Show} title={Title}>
        <SCLAlertButton theme={Theme} onPress={() => One_Alret_onClick(AlertType)}> OK </SCLAlertButton>
      </SCLAlert>

      <SCLAlert theme={Theme} show={Show_two} title={Title}>
        <SCLAlertButton theme={Theme} onPress={() => Alret_onClick(AlertType)}> Yes </SCLAlertButton>
        <SCLAlertButton theme="default" onPress={() => setShow_two(false)}> No </SCLAlertButton>
      </SCLAlert>

      <DateTimePicker isVisible={isDatepickerVisible} mode="datetime" locale="en_GB" onConfirm={handleConfirm} onCancel={hideDatePicker} />

      <ProgressLoader visible={spinner} isModal={true} isHUD={true} hudColor={'#808080'} color={'#FFFFFF'} />

      
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
                Type_link === 'IMAGE' && 
                
                <ImageViewer 
                  imageUrls={images_link} 
                  style={{flex: 1}}
                  index={0}
                  onSwipeDown={() => setZoomAttachments_modalVisible(!ZoomAttachments_modalVisible)}
                  onClick={()=> setZoomAttachments_modalVisible(!ZoomAttachments_modalVisible)}
                  enableSwipeDown={true}/>

                ||


               

                Type_link === 'PDF' && 

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
                      source={{uri: images_link, cache: true }} 
                      style={{height: 700, margin: 10}}
                    /> 

                  
                </View>
                  
              }

        

             
            </View>
          </View>
      </Modal>

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
            <View style={{flexDirection: 'row', alignItems: 'center', height: 50}}>
              <Text style={{ flex: 1, fontSize: 15, justifyContent: 'center', textAlign: 'center', color: '#000', fontWeight: 'bold'}}> {textvalue} </Text>
              <Ionicons
                name="close"
                color="red"
                size={30}
                style={{marginEnd: 15}}
                onPress={() => setDropDown_modalVisible(!DropDown_modalVisible)}
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
              refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> }
            />
          </View>
        </View>
      </Modal>

      <View style={{flex: 1, marginBottom: 80,}}>
        <SearchBar
          lightTheme
          round
          inputStyle={{color: '#000'}}
          inputContainerStyle={{backgroundColor: '#FFFF'}}
          searchIcon={{size: 25}}
          onChangeText={text => searchFilterFunction(text)}
          onClear={text => searchFilterFunction('')}
          placeholder="Search here..."
          value={search}
        />

        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : null} 
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>

          <FlatList
            data={filteredDataSource}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={ItemSeparatorView}
            renderItem={ItemView}
            extraData={isRender}  
          />

        </KeyboardAwareScrollView>
      </View>

      <View style={styles.bottomView}>
        <TouchableOpacity
          style={{ width: '100%', height: 50, backgroundColor: '#8BC34A', alignItems: 'center', justifyContent: 'center'}}
          onPress={() => Save_CheckList()}>
          <Text style={{color: '#ffff', fontSize: 16,fontWeight: 'bold'}}>SUBMIT</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaProvider>
  );
}

export default CheckListDetalis;

const {width} = Dimensions.get('window');
const IMAGE_WIDTH = (width - 50) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
   
  },
  titleText: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerone: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
   
    alignItems: 'center',
  },
  headertwo: {
    flex: 1,
    marginTop: 5,
  },

  checkboxtext: {
    marginRight: 15,
  },

  zoomtext: {
    marginRight: 15,
  },

  separator: {
    height: 0.5,
    backgroundColor: '#808080',
    width: '95%',
    marginLeft: 16,
    marginRight: 16,
  },

  text: {
    fontSize: 16,
    color: '#606070',
    padding: 10,
  },

  content: {
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#fff',
  },

  bottomView: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    height: 70,
    backgroundColor: '#8BC34A',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },

  card: {
    backgroundColor: '#fff',
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 6,
    padding: 10,
    borderRadius: 10,
  },

  action: {
    flexDirection: 'row',
    height: 40,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 5,
    marginLeft: 10, marginRight: 10,
    borderColor: '#808080',
    borderRadius: 5,
  },

  model_cardview: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },

  view_style: {
    flex: 1, marginTop: 12, marginLeft: 15, marginRight: 15,
  },

  input: {
    paddingHorizontal: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#808080',
  },

  inputStyle: {fontSize: 14, marginTop: Platform.OS === 'ios' ? 8 : 0},

  labelStyle: {
    fontSize: 12,
    position: 'absolute',
    top: -10,
    color: '#808080',
    backgroundColor: 'white',
    paddingHorizontal: 4,
    marginLeft: -4,
  },

  placeholderStyle: {fontSize: 15},

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
});
