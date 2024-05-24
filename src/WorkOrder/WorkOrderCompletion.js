import React from 'react';
import { View, StyleSheet, Text, RefreshControl, BackHandler, Image, FlatList, ScrollView, TouchableOpacity, Alert, Pressable, Modal,TouchableWithoutFeedback ,Dimensions,Keyboard} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import ProgressLoader from 'rn-progress-loader';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import axios from 'axios';
import {Appbar} from 'react-native-paper';
import {useTheme} from 'react-native-paper';
import {openDatabase} from 'react-native-sqlite-storage';
import DeviceInfo from 'react-native-device-info';
import {SearchBar} from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ModalSelector from 'react-native-modal-selector-searchable';
import ImagePickerModal from 'react-native-image-picker-modal';
import {launchCamera} from 'react-native-image-picker';
import Video from 'react-native-video-enhanced';
import ImageViewer from 'react-native-image-zoom-viewer';
import Pdf from 'react-native-pdf';
import DocumentPicker from 'react-native-document-picker';
import { Image as CPImage} from 'react-native-compressor';
import { Video as CPVideo} from 'react-native-compressor';
import {PermissionsAndroid} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {TextInput} from 'react-native-element-textinput';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {SCLAlert, SCLAlertButton} from 'react-native-scl-alert';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

var db = openDatabase({name: 'CMMS.db'});

const DismissKeyboard = ({children}) => (

  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

let Baseurl, Site_cd, LoginID, EmpName, EmpID, EmpPhone, Selected_WorkOrder_no, dvc_id, mst_RowID, Local_ID, WIFI, Checklist_Scan, Checklist_CMP;

  function WorkOrderCompletion({route, navigation}) {
  let Valid = false;

  const {colors} = useTheme();
  const [TextColor, setTextColor] = React.useState('#000');
  const [spinner, setspinner] = React.useState(false);
  const [Toolbartext, setToolbartext] = React.useState('Work Order Completion');

  const [Editable, setEditable] = React.useState(false);
  const [height, setHeight] = React.useState(0);
  const [CorrectiveAction_height, setCorrectiveAction_height] = React.useState(0);
  const [MaintenanceRemark_height, setMaintenanceRemark_height] = React.useState(0);

  const [WorkClass, setWorkClass] = React.useState([]);
  const [WorkGroup, setWorkGroup] = React.useState([]);
  const [CauseCode, setCauseCode] = React.useState([]);
  const [ActionCode, setActionCode] = React.useState([]);
  const [WorkorderStatus, setWorkorderStatus] = React.useState([]);

  const [WorkClass_key, setWorkClass_key] = React.useState('');
  const [WorkGroup_key, setWorkGroup_key] = React.useState('');
  const [CauseCode_key, setCauseCode_key] = React.useState('');
  const [ActionCode_key, setActionCode_key] = React.useState('');
  const [WorkorderStatus_key, setWorkorderStatus_key] = React.useState('');

  const [WorkClass_label, setWorkClass_label] = React.useState('');
  const [WorkGroup_label, setWorkGroup_label] = React.useState('');
  const [CauseCode_label, setCauseCode_label] = React.useState('');
  const [ActionCode_label, setActionCode_label] = React.useState('');
  const [WorkorderStatus_label, setWorkorderStatus_label] = React.useState('');

  const [CorrectiveAction, setCorrectiveAction] = React.useState('');
  const [MaintenanceRemark, setMaintenanceRemark] = React.useState('');
  const [checkboxState, setCheckboxState] = React.useState(false);

  //DropDown Modal
  const [textvalue, settextvalue] = React.useState('');
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
  const [ImgValue, setImgValue] = React.useState([]);

  const [isVisible, setVisible] = React.useState(false);

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
    } else if (route.params.Screenname == 'WoDashboard' || route.params.Screenname == 'MYWO_Dashboard_Due' || route.params.Screenname == 'MYWO_Dashboard_Past') {
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
    // Alert.alert("Alert", "Do you want to exit wo completion screen?", [
    //   {
    //     text: "NO",
    //     onPress: () => null,

    //   },
    //   { text: "YES", onPress: () => _goBack() }
    // ]);

    setAlert_two(
      true,
      'warning',
      'Do you want to exit completion screen?',
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
    console.log(route.params);
    console.log(route.params.mst_RowID);

    dvc_id = DeviceInfo.getDeviceId();

    Baseurl = await AsyncStorage.getItem('BaseURL');
    Site_cd = await AsyncStorage.getItem('Site_Cd');
    LoginID = await AsyncStorage.getItem('emp_mst_login_id');
    EmpName = await AsyncStorage.getItem('emp_mst_name');
    EmpID = await AsyncStorage.getItem('emp_mst_empl_id');
    EmpPhone = await AsyncStorage.getItem('emp_mst_homephone');
    EmpWorkGrp = await AsyncStorage.getItem('emp_det_work_grp');
    WIFI = await AsyncStorage.getItem('WIFI');
    Checklist_Scan = await AsyncStorage.getItem('dft_mst_mbl_chk_scan');
    Checklist_CMP = await AsyncStorage.getItem('dft_mst_mbl_chk_cmp');

    console.log('Employee:', route.params.Selected_Employee);
    console.log('PhoneNo:', route.params.Selected_PhoneNo);
    console.log('WorkOrderDesc:', route.params.Selected_WorkOrderDesc);
    console.log('WorkOrderStatus:', route.params.Selected_WorkOrderStatus);

    console.log('OrgDate:', route.params.Selected_OrgDate);
    console.log('DueDate:', route.params.Selected_DueDate);
    console.log('AssetDesc:', route.params.Selected_AssetDesc);
    console.log('WorkArea:', route.params.Selected_WorkArea);
    console.log('AssetLocation:', route.params.Selected_AssetLocation);
    console.log('AssetLevel:', route.params.Selected_AssetLevel);

    console.log('WorkOrder_no:', route.params.Selected_WorkOrder_no);
    console.log('Checklist_Scan:', Checklist_Scan);
    console.log('Checklist_CMP:', Checklist_CMP);

    mst_RowID = route.params.RowID;
    Local_ID = route.params.local_id;
    Selected_WorkOrder_no = route.params.Selected_WorkOrder_no;

    console.log('WORK DATA MST_ROWID :  ' + mst_RowID);
    console.log('WORK DATA LOCAL ID :  ' + Local_ID);

    console.log('ASSETNO:', route.params.Selected_AssetNo);
    console.log('CostCenter:', route.params.Selected_CostCenter);
    console.log('LaborAccount:', route.params.Selected_LaborAccount);
    console.log('ContractAccount:', route.params.Selected_ContractAccount);
    console.log('MaterialAccount:', route.params.Selected_MaterialAccount);

    db.transaction(function (txn) {
      //workclass
      txn.executeSql(
        'SELECT * FROM workclass order by wrk_cls_cls_cd asc',
        [],
        (tx, results) => {
          var work_class = [];
          console.log('workclass:' + results.rows.length);
          for (let i = 0; i < results.rows.length; ++i) {
            work_class.push(results.rows.item(i));
          }

          setWorkClass(work_class);
        },
      );

      //wrk_group
      txn.executeSql(
        'SELECT * FROM wrk_group order by wrk_grp_grp_cd asc',
        [],
        (tx, results) => {
          var wrk_group = [];
          console.log('workGroup:' + results.rows.length);
          for (let i = 0; i < results.rows.length; ++i) {
            wrk_group.push(results.rows.item(i));
          }

          setWorkGroup(wrk_group);
        },
      );

      //casusecode
      txn.executeSql(
        'SELECT * FROM casusecode order by wrk_ccd_cause_cd asc',
        [],
        (tx, results) => {
          var casuse_code = [];
          console.log('casusecode:' + results.rows.length);
          for (let i = 0; i < results.rows.length; ++i) {
            casuse_code.push(results.rows.item(i));
          }

          setCauseCode(casuse_code);
        },
      );

      //actioncode
      txn.executeSql(
        'SELECT * FROM actioncode order by wrk_act_action_cd asc',
        [],
        (tx, results) => {
          var action_code = [];
          console.log('actioncode:' + results.rows.length);
          for (let i = 0; i < results.rows.length; ++i) {
            action_code.push(results.rows.item(i));
          }

          setActionCode(action_code);
        },
      );

      //Work Order Statu
      txn.executeSql(
        'SELECT * FROM workorderstatus where wrk_sts_typ_cd ="COMPLETE"',
        [],
        (tx, results) => {
          var wkr_status = [];
          console.log('Work Order Statu:' + results.rows.length);
          for (let i = 0; i < results.rows.length; ++i) {
            wkr_status.push(results.rows.item(i));
            setWorkorderStatus_key(
              results.rows.item(0).wrk_sts_status +
                ' : ' +
                results.rows.item(i).wrk_sts_desc,
            );
            setWorkorderStatus_label(results.rows.item(0).wrk_sts_status);
          }

          setWorkorderStatus(wkr_status);
        },
      );
    });

    if (WIFI === 'OFFLINE') {
      console.log('OFFLINE');
      get_action_workoder_OFFLINE();
    } else {
      console.log('ONLINE');
      get_action_workoder();
    }
  };

  //GET ACTION WORLORDER API
  const get_action_workoder = async () => {
    setspinner(true);

    try {
      console.log( 'JSON DATA : ' + `${Baseurl}/get_action_workoder.php?site_cd=${Site_cd}&rowid=${mst_RowID}`);

      const response = await axios.get( `${Baseurl}/get_action_workoder.php?site_cd=${Site_cd}&rowid=${mst_RowID}`);

      //console.log(JSON.stringify(response));

      //console.log("JSON DATA : " + response.data.status)

      if (response.data.status === 'SUCCESS') {
        let work_class, work_grp, cause_code, act_code;

        for (let value of Object.values(response.data.data)) {
          console.log(value.work_complete);

          setWorkClass_key(value.work_class);
          if (value.work_class === '') {
            work_class = '';
          } else {
            let work_class_split = value.work_class.split(':');
            work_class = work_class_split[0];
          }
          console.log('value.work_class' + work_class);
          setWorkClass_label(work_class);

          setWorkGroup_key(value.work_grp);

          if (value.work_grp === '') {
            work_grp = '';
          } else {
            let work_grp_split = value.work_grp.split(':');
            work_grp = work_grp_split[0];
          }
          console.log('value.work_grp' + work_grp);
          setWorkGroup_label(work_grp);

          setCauseCode_key(value.cause_code);

          if (value.cause_code === '') {
            cause_code = '';
          } else {
            let cause_code_split = value.cause_code.split(':');
            cause_code = cause_code_split[0];
          }
          console.log('value.cause_code' + cause_code);
          setCauseCode_label(cause_code);

          setActionCode_key(value.act_code);

          if (value.act_code === '') {
            act_code = '';
          } else {
            let act_code_split = value.act_code.split(':');
            act_code = act_code_split[0];
          }
          console.log('value.act_code' + act_code);

          setActionCode_label(act_code);

          setCorrectiveAction(value.wko_det_corr_action);
          setMaintenanceRemark(value.wko_det_note1);
          if (value.work_complete == '1') {
            setCheckboxState(true);
            setWorkorderStatus_key(value.work_sts);
          }

          let wrk_count = value.wko_ref_cnt.toString();
          get_workorder_attachment(mst_RowID,wrk_count);

        }

        setspinner(false);
      } else {
        setspinner(false);
        setAlert(true, 'danger', response.data.message);
        return;
      }
    } catch (error) {
      setspinner(false);
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
  //GET RESPONS OFFLINE
  const get_action_workoder_OFFLINE = async () => {
    if (!mst_RowID) {
      console.log('Empty');

      db.transaction(function (txn) {
        //GET OFFLINE RESPONS
        txn.executeSql(
          'SELECT * FROM wko_det_completion WHERE  local_id =?',
          [Local_ID],
          (tx, results) => {
            console.log('get empty:' + JSON.stringify(results.rows.length));
            if (results.rows.length > 0) {
              let work_class, work_grp, cause_code, act_code;

              for (let i = 0; i < results.rows.length; ++i) {
                if (results.rows.item(i).wko_det_work_class === '') {
                  setWorkClass_key('');
                  setWorkClass_label('');
                } else {
                  let work_class_split = results.rows .item(i) .wko_det_work_class.split(':'); work_class = work_class_split[0];

                  setWorkClass_key(results.rows.item(i).wko_det_work_class);
                  setWorkClass_label(work_class);
                }

                if (results.rows.item(i).wko_det_work_grp === '') {
                  setWorkGroup_key('');
                  setWorkGroup_label('');
                } else {
                  let work_grp_split = results.rows .item(i) .wko_det_work_grp.split(':'); work_grp = work_grp_split[0];

                  setWorkGroup_key(results.rows.item(i).wko_det_work_grp);
                  setWorkGroup_label(work_grp);
                }

                if (results.rows.item(i).wko_det_cause_code === '') {
                  setCauseCode_key('');
                  setCauseCode_label('');
                } else {
                  let cause_code_split = results.rows .item(i) .wko_det_cause_code.split(':'); cause_code = cause_code_split[0];

                  setCauseCode_key(results.rows.item(i).wko_det_cause_code);
                  setCauseCode_label(cause_code);
                }

                if (results.rows.item(i).wko_det_act_code === '') {
                  setActionCode_key('');
                  setActionCode_label('');
                } else {
                  let act_code_split = results.rows .item(i) .wko_det_act_code.split(':'); act_code = act_code_split[0];

                  setActionCode_key(results.rows.item(i).wko_det_act_code);
                  setActionCode_label(act_code);
                }

                setCorrectiveAction(results.rows.item(i).wko_det_corr_action);
                setMaintenanceRemark(results.rows.item(i).wko_det_note1);
                if (results.rows.item(i).Is_checked == '1') {
                  setCheckboxState(true);
                  setWorkorderStatus_key(results.rows.item(i).work_sts);
                } else {
                  setCheckboxState(false);
                }
              }
            }
          },
        );

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


        
      });
    } else {
      console.log('Not Empty');

      db.transaction(function (txn) {
        //GET OFFLINE RESPONS
        txn.executeSql(
          'SELECT * FROM wko_det_completion WHERE  mst_RowID =?',
          [mst_RowID],
          (tx, results) => {
            var temp = [];
            console.log( 'get Wko_det Completion:' + JSON.stringify(results.rows.length));
            if (results.rows.length > 0) {
              let work_class, work_grp, cause_code, act_code;

              for (let i = 0; i < results.rows.length; ++i) {
                console.log( 'get Wko_det Completion:' + JSON.stringify(results.rows.item(i)));

                if (results.rows.item(i).wko_det_work_class === '') {
                  setWorkClass_key('');
                  setWorkClass_label('');
                } else {
                  let work_class_split = results.rows .item(i) .wko_det_work_class.split(':'); work_class = work_class_split[0];

                  setWorkClass_key(results.rows.item(i).wko_det_work_class);
                  setWorkClass_label(work_class);
                }

                if (results.rows.item(i).wko_det_work_grp === '') {
                  setWorkGroup_key('');
                  setWorkGroup_label('');
                } else {
                  let work_grp_split = results.rows .item(i) .wko_det_work_grp.split(':'); work_grp = work_grp_split[0];

                  setWorkGroup_key(results.rows.item(i).wko_det_work_grp);
                  setWorkGroup_label(work_grp);
                }

                if (results.rows.item(i).wko_det_cause_code === '') {
                  setCauseCode_key('');
                  setCauseCode_label('');
                } else {
                  let cause_code_split = results.rows .item(i) .wko_det_cause_code.split(':'); cause_code = cause_code_split[0];

                  setCauseCode_key(results.rows.item(i).wko_det_cause_code);
                  setCauseCode_label(cause_code);
                }

                if (results.rows.item(i).wko_det_act_code === '') {
                  setActionCode_key('');
                  setActionCode_label('');
                } else {
                  let act_code_split = results.rows .item(i) .wko_det_act_code.split(':'); act_code = act_code_split[0];

                  setActionCode_key(results.rows.item(i).wko_det_act_code);
                  setActionCode_label(act_code);
                }

                setCorrectiveAction(results.rows.item(i).wko_det_corr_action);
                setMaintenanceRemark(results.rows.item(i).wko_det_note1);
                if (results.rows.item(i).Is_checked == '1') {
                  setCheckboxState(true);
                  setWorkorderStatus_key(results.rows.item(i).work_sts);
                } else {
                  setCheckboxState(false);
                }
              }
            }
          },
        );

        txn.executeSql(
          `SELECT * FROM wko_ref where mst_RowID=? and COALESCE(column2,'') <> 'SIGN' and COALESCE(column2,'') <> 'RESPONSE_SIGN' and COALESCE(column2,'') <> 'Checklist'`,
          [mst_RowID],
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
               //console.log( 'PATH 123' + JSON.stringify(results.rows.item(i)));

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

        
                

                //console.log("PATH"+ JSON.stringify(path));

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
      });
    }
  };

  const get_validation = () => {
    if (!WorkGroup_key) {
      //alert('Please select Work Group');
      setAlert(true, 'warning', 'Please select work group', 'OK');
      Valid = false;
      return;
    } else {
      if (!CauseCode_key) {
        //alert('Please select Cause Code');
        setAlert(true, 'warning', 'Please select cause code', 'OK');
        Valid = false;
        return;
      } else {
        if (!ActionCode_key) {
          //alert('Please select Action Code');
          setAlert(true, 'warning', 'Please select action code', 'OK');
          Valid = false;
          return;
        } else {
          if (checkboxState) {
            if (!WorkorderStatus_key) {
              //alert('Please select Work Order Status ');
              setAlert(true, 'warning', 'Please select work order', 'OK');
              Valid = false;
              return;
            } else {
              Valid = true;
            }
          } else {
            Valid = true;
          }
        }
      }
    }

    if (Valid) {
      if (WIFI === 'OFFLINE') {
        update_action_workorder_offline();
      } else {
        update_action_workorder();
      }
    }
  };

  //UPDATE ACTION WORKORDER API
  const update_action_workorder = async () => {
    //setspinner(true);

    var sync_date = moment().format('YYYY-MM-DD HH:mm');

    let Requested_by;

    if (route.params.Selected_Employee === '') {
      Requested_by = '';
    } else {
      let Requested_by_split = route.params.Selected_Employee.split(':');
      Requested_by = Requested_by_split[0].trim();
    }
    let Contact_no = route.params.Selected_PhoneNo;

    let WorkOrderStatus;
    if (route.params.Selected_WorkOrderStatus === '') {
      WorkOrderStatus = '';
    } else {
      let WorkOrderStatus_split = route.params.Selected_WorkOrderStatus.split(':');
      WorkOrderStatus = WorkOrderStatus_split[0].trim();
    }

    let Assetno = route.params.Selected_AssetNo;
    let AssetDescription = route.params.Selected_AssetDesc;

    let WorkArea;
    if (route.params.Selected_WorkArea === '') {
      WorkArea = '';
    } else {
      let WorkArea_split = route.params.Selected_WorkArea.split(':');
      WorkArea = WorkArea_split[0].trim();
    }
    let AssetLocation;
    if (route.params.Selected_AssetLocation === '') {
      AssetLocation = '';
    } else {
      let AssetLocation_split = route.params.Selected_AssetLocation.split(':');
      AssetLocation = AssetLocation_split[0].trim();
    }
    let AssetLevel;
    if (route.params.Selected_AssetLevel === '') {
      AssetLevel = '';
    } else {
      let AssetLevel_split = route.params.Selected_AssetLevel.split(':');
      AssetLevel = AssetLevel_split[0].trim();
    }

    let WorkOrder_no = route.params.Selected_WorkOrder_no;

    let WorkOrder_Dsc = route.params.Selected_WorkOrderDesc;
    let original_date = route.params.Selected_OrgDate;
    let Due_date = route.params.Selected_DueDate;

    if (checkboxState == 'false') {
      var check = '0';
    } else {
      var check = '1';
    }

    console.log('Aesset LO' + AssetLocation);

    let action_workorder = {
      site_cd: Site_cd,
      EmpID: EmpID,
      LOGINID: LoginID,
      RowID: mst_RowID,
      EmpName: EmpName,

      wko_mst_status: WorkOrderStatus,
      wko_mst_status_after: WorkorderStatus_label,

      wko_mst_originator: Requested_by,
      wko_mst_phone: Contact_no,

      wko_det_cause_code: CauseCode_label,
      wko_det_act_code: ActionCode_label,
      wko_det_work_class: WorkClass_label,
      wko_det_work_grp: WorkGroup_label,

      wko_det_corr_action: CorrectiveAction,
      wko_det_note1: MaintenanceRemark,
      Is_checked: checkboxState,

      wko_mst_wo_no: WorkOrder_no,

      Assestno: Assetno,
      Assest_description: AssetDescription,
      Work_Area: WorkArea,
      Assest_location: AssetLocation,
      Assest_level: AssetLevel,
      Originationdate: original_date,
      Duedate: Due_date,
      Work_Description: WorkOrder_Dsc,
      Requested_by: Requested_by,
      Contact_no: Contact_no,

      dvc_id: dvc_id,
      current_date: sync_date,

      sync_step: '',
      sync_time: sync_date,
      sync_status: 'online',
      sync_url: Baseurl + '/update_action_workorder.php?',
    };

    console.log('ACTION WORKORDE:' + JSON.stringify(action_workorder));

    try {
      const response = await axios.post( `${Baseurl}/update_action_workorder.php?`, JSON.stringify(action_workorder));
      console.log('JSON DATA : ' + response.data.message);
      if (response.data.status === 'SUCCESS') {
       
        if (Attachments_List.length > 0) {

          UploadImage( mst_RowID,response.data.message);

        }else{
          setspinner(false);
          setAlert(true, 'success', response.data.message, 'UPDATE_CMP');
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
  };

  //UPDATE WORK ORDER ATTACHMENTS API
  const UploadImage = async (ROW_ID, message) => {

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
          setAlert(true, 'success', message, 'UPDATE_CMP' );

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
  //UPDATE ACTION WORKORDER OFFLINE
  const update_action_workorder_offline = async () => {
    console.log('OFFLINE SAVE ');

    var sync_date = moment().format('yyyy-MM-DD HH:mm');

    let Requested_by;

    if (route.params.Selected_Employee === '') {
      Requested_by = '';
    } else {
      let Requested_by_split = route.params.Selected_Employee;
      Requested_by = Requested_by_split;
    }
    let Contact_no = route.params.Selected_PhoneNo;

    let WorkOrderStatus;
    if (route.params.Selected_WorkOrderStatus === '') {
      WorkOrderStatus = '';
    } else {
      let WorkOrderStatus_split = route.params.Selected_WorkOrderStatus;
      WorkOrderStatus = WorkOrderStatus_split;
    }

    let Assetno = route.params.Selected_AssetNo;
    let AssetDescription = route.params.Selected_AssetDesc;

    let WorkArea;
    if (route.params.Selected_WorkArea === '') {
      WorkArea = '';
    } else {
      let WorkArea_split = route.params.Selected_WorkArea;
      WorkArea = WorkArea_split;
    }
    let AssetLocation;
    if (route.params.Selected_AssetLocation === '') {
      AssetLocation = '';
    } else {
      let AssetLocation_split = route.params.Selected_AssetLocation;
      AssetLocation = AssetLocation_split;
    }
    let AssetLevel;
    if (route.params.Selected_AssetLevel === '') {
      AssetLevel = '';
    } else {
      let AssetLevel_split = route.params.Selected_AssetLevel;
      AssetLevel = AssetLevel_split;
    }

    let WorkOrder_no = route.params.Selected_WorkOrder_no;

    let WorkOrder_Dsc = route.params.Selected_WorkOrderDesc;
    let original_date = route.params.Selected_OrgDate;
    let Due_date = route.params.Selected_DueDate;

    let WorkorderStatusAfter;
    var check;

    if (checkboxState === false) {
      console.log('checkboxState if', checkboxState);
      check = '0';
      WorkorderStatusAfter = '';
    } else {
      console.log('checkboxState else', checkboxState);
      check = '1';
      WorkorderStatusAfter = WorkorderStatus_key;
    }

    if (!mst_RowID) {
      console.log('Empty');
      db.transaction(function (txn) {
        //GET OFFLINE wko_det_completion
        txn.executeSql(
          'SELECT * FROM wko_det_completion WHERE  local_id =?',
          [Local_ID],
          (tx, results) => {
            console.log( 'get wko_det_completion:' + JSON.stringify(results.rows.length));
            if (results.rows.length > 0) {
              if (check === '1') {
                txn.executeSql(
                  'UPDATE wko_mst SET wrk_sts_typ_cd=?,wko_mst_status=? WHERE local_id=?',
                  ['COMPLETE','CMP:WO COMPLETE', Local_ID],
                  (txn, results) => {
                    console.log('wko_mst Results_test', results.rowsAffected);
                    if (results.rowsAffected > 0) {
                      setspinner(false);
                      console.log('UPDATE TABLE wko_mst Successfully');
                    } else {
                      setspinner(false);
                      console.log( 'UPDATE TABLE wko_det_completion Unsuccessfully', );
                    }
                  },
                );
              }

              txn.executeSql(
                'UPDATE wko_det_completion SET wko_det_work_class=?,wko_det_work_grp=?,wko_det_cause_code=?,wko_det_act_code=?,wko_det_corr_action=?,wko_det_note1=?,Is_checked=?,wko_mst_status=?,wko_mst_status_after=?,sts_column=?,LOGINID=? WHERE local_id=?',
                [
                  WorkClass_key,
                  WorkGroup_key,
                  CauseCode_key,
                  ActionCode_key,
                  CorrectiveAction,
                  MaintenanceRemark,
                  check,
                  WorkOrderStatus,
                  WorkorderStatusAfter,
                  'Update',
                  LoginID,
                  Local_ID,
                ],
                (txn, results) => {
                  console.log( 'wko_det_completion Results_test', results.rowsAffected);
                  if (results.rowsAffected > 0) {
                    
                    console.log('UPDATE TABLE wko_det_completion Successfully');
                    if (Attachments_List.length > 0) {
                      UPDATE_image_Offline();
                    } else {
                      setspinner(false);
                      setAlert( true, 'success', 'Work order is completed successfully', 'UPDATE_CMP', );
                    }

                    
                  } else {
                    setspinner(false);
                    setAlert( true, 'warning', 'Update work order completion Failed', 'OK', );
                  }
                },
              );
            } else {
              console.log('SYNC', sync_date);
              console.log('REQ_BY', Requested_by);
              console.log('NO', Contact_no);
              console.log('WOR_ST', WorkOrderStatus);
              console.log('ASST_DESC', AssetDescription);
              console.log('WOR_AR', WorkArea);
              console.log('ASS_LOC', AssetLocation);
              console.log('WKO_NO', WorkOrder_no);
              console.log('WOK_DESC', WorkOrder_Dsc);
              console.log('ORG', original_date);
              console.log('DUE', Due_date);
              console.log('WOSA', WorkorderStatusAfter);
              console.log('check', check);

              if (check === '1') {
                console.log('check 123', check);
                console.log('Local_ID 123', Local_ID);

                txn.executeSql(
                  'UPDATE wko_mst SET wrk_sts_typ_cd=?, wko_mst_status =? WHERE ID=?',
                  ['COMPLETE', 'CMP:WO COMPLETE', Local_ID],
                  (txn, results) => {
                    console.log('wko_mst Results_test', results.rowsAffected);
                    if (results.rowsAffected > 0) {
                      setspinner(false);
                      console.log('Update TABLE wko_mst Successfully');
                    } else {
                      setspinner(false);
                      console.log(
                        'Update TABLE wko_det_completion Unsuccessfully',
                      );
                    }
                  },
                );
              }

              tx.executeSql(
                'INSERT INTO wko_det_completion (mst_RowID,RowID,site_cd,wko_det_cause_code,wko_det_act_code,wko_det_work_class,wko_det_work_grp,wko_mst_status,wko_mst_status_after,Is_checked,wko_det_corr_action,wko_mst_wo_no,wko_mst_assetno,wko_mst_work_area,wko_mst_asset_location,wko_mst_asset_level,wko_mst_org_date,wko_mst_due_date,wko_mst_descs,wko_det_note1,local_id,Requested_by,Contact_no,Assest_description) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                [
                  null,
                  null,
                  Site_cd,
                  CauseCode_key,
                  ActionCode_key,
                  WorkClass_key,
                  WorkGroup_key,
                  WorkOrderStatus,
                  WorkorderStatusAfter,
                  check,
                  CorrectiveAction,
                  '',
                  Assetno,
                  WorkArea,
                  AssetLocation,
                  AssetLevel,
                  original_date,
                  Due_date,
                  WorkOrder_Dsc,
                  MaintenanceRemark,
                  Local_ID,
                  Requested_by,
                  Contact_no,
                  AssetDescription,
                ],
                (tx, results) => {
                  //console.log('wko_det_response Results_test', results.rowsAffected);
                  if (results.rowsAffected > 0) {
                    console.log('INSERT TABLE wko_det_response Successfully');
                    if (Attachments_List.length > 0) {
                      UPDATE_image_Offline();
                    } else {
                      setspinner(false);
                      setAlert( true, 'success', 'Work order is completed successfully', 'UPDATE_CMP', );
                    }
                    
                  } else {
                    setspinner(false);
                    setAlert( true, 'warning', 'Update work order compelte Failed', 'OK', );
                    
                  }
                },
              );
            }
          },
        );
      });
    } else {
      console.log('ROWID check 12223', check);

      db.transaction(function (txn) {
        if (check === '1') {
          txn.executeSql(
            'UPDATE wko_mst SET wrk_sts_typ_cd=? ,wko_mst_status=? WHERE RowID=?',
            ['COMPLETE', 'CMP:WO COMPLETE',mst_RowID],
            (txn, results) => {
              console.log('wko_mst Results_test', results.rowsAffected);
              if (results.rowsAffected > 0) {
                setspinner(false);
                console.log('UPDATE TABLE wko_mst Successfully');
              } else {
                setspinner(false);
                console.log('UPDATE TABLE wko_det_completion Unsuccessfully');
              }
            },
          );
        }

        txn.executeSql(
          'UPDATE wko_det_completion SET wko_det_work_class=?,wko_det_work_grp=?,wko_det_cause_code=?,wko_det_act_code=?,wko_det_corr_action=?,wko_det_note1=?,Is_checked=?,wko_mst_status=?,wko_mst_status_after=?,sts_column=?,LOGINID=? WHERE mst_RowID=?',
          [
            WorkClass_key,
            WorkGroup_key,
            CauseCode_key,
            ActionCode_key,
            CorrectiveAction,
            MaintenanceRemark,
            check,
            WorkOrderStatus,
            WorkorderStatusAfter,
            'Update',
            LoginID,
            mst_RowID,
          ],
          (txn, results) => {
            console.log( 'wko_det_completion Results_test', results.rowsAffected, );
            if (results.rowsAffected > 0) {
              
              console.log('UPDATE TABLE wko_det_completion Successfully');
              if (Attachments_List.length > 0) {
                UPDATE_image_Offline();
              } else {
                setspinner(false);
                setAlert( true, 'success', 'Work order is completed successfully', 'UPDATE_CMP', );
              }
              
            } else {
              setspinner(false);
              setAlert( true, 'warning', 'Update work order compelte Failed', 'OK', );
              
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
              [ Site_cd, type, filename, 'Gallery_image', exist, localpath, route.params.local_id, mst_RowID ],
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
    setAlert( true, 'success', 'Work order is completed successfully', 'UPDATE_CMP', );
    
  };

  //Selection Dropdown
  const select_dropdown = (dropname, data) => {
    //console.log(data);

    settextvalue(dropname);
    setDropDownFilteredData(data);
    setDropdown_data(data);
    setDropDown_modalVisible(!DropDown_modalVisible);
  };

  //Dropdown Filter
  const DropDown_searchFilterFunction = text => {
    // Check if searched text is not blank
    if (text) {
      let newData;

      if (textvalue == 'Work Class') {
        newData = Dropdown_data.filter(function (item) {
          const itemData = `${item.wrk_cls_cls_cd.toUpperCase()},
                ,${item.wrk_cls_desc.toUpperCase()})`;

          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      } else if (textvalue == 'Work Group') {
        newData = Dropdown_data.filter(function (item) {
          const itemData = `${item.wrk_grp_grp_cd.toUpperCase()},
                ,${item.wrk_grp_desc.toUpperCase()})`;

          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      } else if (textvalue == 'Cause Code') {
        newData = Dropdown_data.filter(function (item) {
          const itemData = `${item.wrk_ccd_cause_cd.toUpperCase()},
                ,${item.wrk_ccd_desc.toUpperCase()})`;

          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      } else if (textvalue == 'Action Code') {
        newData = Dropdown_data.filter(function (item) {
          const itemData = `${item.wrk_act_action_cd.toUpperCase()},
                ,${item.wrk_act_desc.toUpperCase()})`;

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

    if (textvalue == 'Work Class') {
      setDropDownFilteredData(WorkClass);
    } else if (textvalue == 'Work Group') {
      setDropDownFilteredData(WorkGroup);
    } else if (textvalue == 'Cause Code') {
      setDropDownFilteredData(CauseCode);
    } else if (textvalue == 'Action Code') {
      setDropDownFilteredData(ActionCode);
    } else if (textvalue == 'Work Order Status') {
      setDropDownFilteredData(WorkorderStatus);
    }

    setRefreshing(false);
  }, [refreshing]);

  const renderText = item => {
    if (textvalue == 'Work Class') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{width: '40%'}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                Class Code :
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.wrk_cls_cls_cd}{' '}
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{width: '40%'}}>
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
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.wrk_cls_desc}{' '}
              </Text>
            </View>
          </View>
        </View>
      );
    } else if (textvalue == 'Work Group') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{width: '40%'}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                Work Group :
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {' '}
                {item.wrk_grp_grp_cd}{' '}
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{width: '40%'}}>
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
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {' '}
                {item.wrk_grp_desc}{' '}
              </Text>
            </View>
          </View>
        </View>
      );
    } else if (textvalue == 'Cause Code') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{width: '40%'}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                Cause Code :
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.wrk_ccd_cause_cd}
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{width: '40%'}}>
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
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.wrk_ccd_desc.trim()}
              </Text>
            </View>
          </View>
        </View>
      );
    } else if (textvalue == 'Action Code') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{width: '40%'}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                Action Code :
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.wrk_act_action_cd}
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{width: '40%'}}>
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
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.wrk_act_desc}
              </Text>
            </View>
          </View>
        </View>
      );
    } else if (textvalue == 'Work Order Status') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{width: '40%'}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                Status Type Code :
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.wrk_sts_status}
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{width: '40%'}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                Description :{' '}
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.wrk_sts_desc}
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{width: '40%'}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                Status :
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.wrk_sts_typ_cd}
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

    if (textvalue == 'Work Class') {
      setWorkClass_key(item.wrk_cls_cls_cd + ' : ' + item.wrk_cls_desc);
      setWorkClass_label(item.wrk_cls_cls_cd);
    } else if (textvalue == 'Work Group') {
      setWorkGroup_key(item.wrk_grp_grp_cd + ' : ' + item.wrk_grp_desc);
      setWorkGroup_label(item.wrk_grp_grp_cd);
    } else if (textvalue == 'Cause Code') {
      setCauseCode_key(item.wrk_ccd_cause_cd + ' : ' + item.wrk_ccd_desc);
      setCauseCode_label(item.wrk_ccd_cause_cd);
    } else if (textvalue == 'Action Code') {
      setActionCode_key(item.wrk_act_action_cd + ' : ' + item.wrk_act_desc);
      setActionCode_label(item.wrk_act_action_cd);
    } else if (textvalue == 'Work Order Status') {
      setWorkorderStatus_key(item.wrk_sts_status + ' : ' + item.wrk_sts_desc);
      setWorkorderStatus_label(item.wrk_sts_status);
    }

    setDropDown_search('');
    setDropDown_modalVisible(!DropDown_modalVisible);
  };

  const select_checkbox = () => {
    setCheckboxState(!checkboxState);

    if (WIFI === 'OFFLINE') {
      db.transaction(function (txn) {
        txn.executeSql(
          'SELECT * FROM wko_ls8_timecard WHERE  mst_RowID =? and wko_ls8_datetime2 =?',
          [mst_RowID, ''],
          (tx, results) => {
            console.log('Time Count:' + JSON.stringify(results.rows.length));

            if (results.rows.length > 0) {
              setAlert(
                true,
                'warning',
                'Please complete the timecard before proceed to work order completion',
                'TimeCard',
              );
            } else {
              //check asset Downtime
              txn.executeSql(
                'SELECT * FROM cf_menu where column1 = ? and mobile_object_type = ? and object_name = ?',
                ['Work Order', 'O', 'o_wo_downtime'],
                (tx, results) => {
                  var work_class = [];
                  console.log('Asset Downtime edit:' + results.rows.length);

                  if (results.rows.length > 0) {
                    for (let i = 0; i < results.rows.length; ++i) {
                      console.log(
                        'Asset Downtime',
                        results.rows.item(i).exe_flag,
                      );

                      if (results.rows.item(i).exe_flag === '1') {
                        txn.executeSql(
                          'SELECT * FROM ast_dwntime WHERE ast_dwntime_rts_date =? AND ast_dwntime_down_wo =? AND ast_dwntime_out_date IS NOT NULL ',
                          ['', Selected_WorkOrder_no],
                          (tx, results) => {
                            console.log(
                              'Downtime Count:' +
                                JSON.stringify(results.rows.length),
                            );

                            if (results.rows.length > 0) {
                              setAlert(
                                true,
                                'warning',
                                'Please complete the Downtime before proceed to work order completion',
                                'Downtime',
                              );
                            } else {
                              if (Checklist_Scan === '1') {
                                txn.executeSql(
                                  'select * from wko_isp_heard where mst_RowID= ? and wko_isp_datetime3 is null',
                                  [mst_RowID],
                                  (tx, results) => {
                                    console.log(
                                      'Downtime Count:' +
                                        JSON.stringify(results.rows.length),
                                    );

                                    if (results.rows.length > 0) {
                                      setAlert(
                                        true,
                                        'warning',
                                        'Please scan the asset QR code before proceed to work order completion',
                                        'Downtime',
                                      );
                                    } else {
                                      if (Checklist_CMP === '1') {
                                        txn.executeSql(
                                          `select SUM(CASE WHEN wko_isp_stp_datatype = 'T' and (wko_isp_varchar1 IS NULL OR wko_isp_varchar1 = '') and wko_isp_varchar3 = '1' Then 1  WHEN wko_isp_stp_datatype = 'N' and (wko_isp_numeric1 IS  NULL ) and wko_isp_varchar3 = '1' Then 1 WHEN wko_isp_stp_datatype = 'C' and (wko_isp_checkbox1 IS  0) and wko_isp_varchar3 = '1' Then 1 WHEN wko_isp_stp_datatype = 'D' and (wko_isp_datetime1 IS  NULL) and wko_isp_varchar3 = '1' Then 1 WHEN wko_isp_stp_datatype = 'Z' and (wko_isp_dropdown1 IS  NULL) and wko_isp_varchar3 = '1' Then 1 else 0 END  ) AS Total From	wko_isp_details where mst_RowID =?`,
                                          [mst_RowID],
                                          (tx, results) => {
                                            console.log(
                                              'Downtime CMP Count:' +
                                                JSON.stringify(results),
                                            );

                                            if (results.rows.length > 0) {
                                              for (
                                                let i = 0;
                                                i < results.rows.length;
                                                ++i
                                              ) {
                                                if (
                                                  results.rows.item(i).Total > 0
                                                ) {
                                                  setAlert(
                                                    true,
                                                    'warning',
                                                    'Please complete the checklist before proceed to work order completion',
                                                    'Downtime',
                                                  );
                                                } else {
                                                  setspinner(false);
                                                }
                                              }
                                            } else {
                                              setspinner(false);
                                            }
                                          },
                                        );
                                      } else {
                                        setspinner(false);
                                      }
                                    }
                                  },
                                );
                              } else {
                                if (Checklist_CMP === '1') {
                                  txn.executeSql(
                                    `select SUM(CASE WHEN wko_isp_stp_datatype = 'T' and (wko_isp_varchar1 IS NULL OR wko_isp_varchar1 = '') and wko_isp_varchar3 = '1' Then 1  WHEN wko_isp_stp_datatype = 'N' and (wko_isp_numeric1 IS  NULL ) and wko_isp_varchar3 = '1' Then 1 WHEN wko_isp_stp_datatype = 'C' and (wko_isp_checkbox1 IS  0) and wko_isp_varchar3 = '1' Then 1 WHEN wko_isp_stp_datatype = 'D' and (wko_isp_datetime1 IS  NULL) and wko_isp_varchar3 = '1' Then 1 WHEN wko_isp_stp_datatype = 'Z' and (wko_isp_dropdown1 IS  NULL) and wko_isp_varchar3 = '1' Then 1 else 0 END  ) AS Total From	wko_isp_details where mst_RowID =?`,
                                    [mst_RowID],
                                    (tx, results) => {
                                      console.log(
                                        'Downtime CMP Count:' +
                                          JSON.stringify(results),
                                      );

                                      if (results.rows.length > 0) {
                                        for (
                                          let i = 0;
                                          i < results.rows.length;
                                          ++i
                                        ) {
                                          if (results.rows.item(i).Total > 0) {
                                            setAlert(
                                              true,
                                              'warning',
                                              'Please complete the checklist before proceed to work order completion',
                                              'Downtime',
                                            );
                                          } else {
                                            setspinner(false);
                                          }
                                        }
                                      } else {
                                        setspinner(false);
                                      }
                                    },
                                  );
                                } else {
                                  setspinner(false);
                                }
                              }
                            }
                          },
                        );
                      } else {
                        if (Checklist_Scan === '1') {
                          txn.executeSql(
                            'select * from wko_isp_heard where mst_RowID= ? and wko_isp_datetime3 is null',
                            [mst_RowID],
                            (tx, results) => {
                              console.log(
                                'Downtime Count:' +
                                  JSON.stringify(results.rows.length),
                              );

                              if (results.rows.length > 0) {
                                setAlert(
                                  true,
                                  'warning',
                                  'Please scan the asset QR code before proceed to work order completion',
                                  'Downtime',
                                );
                              } else {
                                if (Checklist_CMP === '1') {
                                  txn.executeSql(
                                    `select SUM(CASE WHEN wko_isp_stp_datatype = 'T' and (wko_isp_varchar1 IS NULL OR wko_isp_varchar1 = '') and wko_isp_varchar3 = '1' Then 1  WHEN wko_isp_stp_datatype = 'N' and (wko_isp_numeric1 IS  NULL ) and wko_isp_varchar3 = '1' Then 1 WHEN wko_isp_stp_datatype = 'C' and (wko_isp_checkbox1 IS  0) and wko_isp_varchar3 = '1' Then 1 WHEN wko_isp_stp_datatype = 'D' and (wko_isp_datetime1 IS  NULL) and wko_isp_varchar3 = '1' Then 1 WHEN wko_isp_stp_datatype = 'Z' and (wko_isp_dropdown1 IS  NULL) and wko_isp_varchar3 = '1' Then 1 else 0 END  ) AS Total From	wko_isp_details where mst_RowID =?`,
                                    [mst_RowID],
                                    (tx, results) => {
                                      console.log(
                                        'Downtime CMP Count:' +
                                          JSON.stringify(results),
                                      );

                                      if (results.rows.length > 0) {
                                        for (
                                          let i = 0;
                                          i < results.rows.length;
                                          ++i
                                        ) {
                                          if (results.rows.item(i).Total > 0) {
                                            setAlert(
                                              true,
                                              'warning',
                                              'Please complete the checklist before proceed to work order completion',
                                              'Downtime',
                                            );
                                          } else {
                                            setspinner(false);
                                          }
                                        }
                                      } else {
                                        setspinner(false);
                                      }
                                    },
                                  );
                                } else {
                                  setspinner(false);
                                }
                              }
                            },
                          );
                        } else {
                          if (Checklist_CMP === '1') {
                            txn.executeSql(
                              `select SUM(CASE WHEN wko_isp_stp_datatype = 'T' and (wko_isp_varchar1 IS NULL OR wko_isp_varchar1 = '') and wko_isp_varchar3 = '1' Then 1  WHEN wko_isp_stp_datatype = 'N' and (wko_isp_numeric1 IS  NULL ) and wko_isp_varchar3 = '1' Then 1 WHEN wko_isp_stp_datatype = 'C' and (wko_isp_checkbox1 IS  0) and wko_isp_varchar3 = '1' Then 1 WHEN wko_isp_stp_datatype = 'D' and (wko_isp_datetime1 IS  NULL) and wko_isp_varchar3 = '1' Then 1 WHEN wko_isp_stp_datatype = 'Z' and (wko_isp_dropdown1 IS  NULL) and wko_isp_varchar3 = '1' Then 1 else 0 END  ) AS Total From	wko_isp_details where mst_RowID =?`,
                              [mst_RowID],
                              (tx, results) => {
                                console.log(
                                  'Downtime CMP Count:' +
                                    JSON.stringify(results),
                                );

                                if (results.rows.length > 0) {
                                  for (
                                    let i = 0;
                                    i < results.rows.length;
                                    ++i
                                  ) {
                                    if (results.rows.item(i).Total > 0) {
                                      setAlert(
                                        true,
                                        'warning',
                                        'Please complete the checklist before proceed to work order completion',
                                        'Downtime',
                                      );
                                    } else {
                                      setspinner(false);
                                    }
                                  }
                                } else {
                                  setspinner(false);
                                }
                              },
                            );
                          } else {
                            setspinner(false);
                          }
                        }
                      }
                    }
                  } else {
                    if (Checklist_Scan === '1') {
                      txn.executeSql(
                        'select * from wko_isp_heard where mst_RowID= ? and wko_isp_datetime3 is null',
                        [mst_RowID],
                        (tx, results) => {
                          console.log(
                            'Downtime Count:' +
                              JSON.stringify(results.rows.length),
                          );

                          if (results.rows.length > 0) {
                            setAlert(
                              true,
                              'warning',
                              'Please scan the asset QR code before proceed to work order completion',
                              'Downtime',
                            );
                          } else {
                            if (Checklist_CMP === '1') {
                              txn.executeSql(
                                `select SUM(CASE WHEN wko_isp_stp_datatype = 'T' and (wko_isp_varchar1 IS NULL OR wko_isp_varchar1 = '') and wko_isp_varchar3 = '1' Then 1  WHEN wko_isp_stp_datatype = 'N' and (wko_isp_numeric1 IS  NULL ) and wko_isp_varchar3 = '1' Then 1 WHEN wko_isp_stp_datatype = 'C' and (wko_isp_checkbox1 IS  0) and wko_isp_varchar3 = '1' Then 1 WHEN wko_isp_stp_datatype = 'D' and (wko_isp_datetime1 IS  NULL) and wko_isp_varchar3 = '1' Then 1 WHEN wko_isp_stp_datatype = 'Z' and (wko_isp_dropdown1 IS  NULL) and wko_isp_varchar3 = '1' Then 1 else 0 END  ) AS Total From	wko_isp_details where mst_RowID =?`,
                                [mst_RowID],
                                (tx, results) => {
                                  console.log(
                                    'Downtime CMP Count:' +
                                      JSON.stringify(results),
                                  );

                                  if (results.rows.length > 0) {
                                    for (
                                      let i = 0;
                                      i < results.rows.length;
                                      ++i
                                    ) {
                                      if (results.rows.item(i).Total > 0) {
                                        setAlert(
                                          true,
                                          'warning',
                                          'Please complete the checklist before proceed to work order completion',
                                          'Downtime',
                                        );
                                      } else {
                                        setspinner(false);
                                      }
                                    }
                                  } else {
                                    setspinner(false);
                                  }
                                },
                              );
                            } else {
                              setspinner(false);
                            }
                          }
                        },
                      );
                    } else {
                      if (Checklist_CMP === '1') {
                        txn.executeSql(
                          `select SUM(CASE WHEN wko_isp_stp_datatype = 'T' and (wko_isp_varchar1 IS NULL OR wko_isp_varchar1 = '') and wko_isp_varchar3 = '1' Then 1  WHEN wko_isp_stp_datatype = 'N' and (wko_isp_numeric1 IS  NULL ) and wko_isp_varchar3 = '1' Then 1 WHEN wko_isp_stp_datatype = 'C' and (wko_isp_checkbox1 IS  0) and wko_isp_varchar3 = '1' Then 1 WHEN wko_isp_stp_datatype = 'D' and (wko_isp_datetime1 IS  NULL) and wko_isp_varchar3 = '1' Then 1 WHEN wko_isp_stp_datatype = 'Z' and (wko_isp_dropdown1 IS  NULL) and wko_isp_varchar3 = '1' Then 1 else 0 END  ) AS Total From	wko_isp_details where mst_RowID =?`,
                          [mst_RowID],
                          (tx, results) => {
                            console.log(
                              'Downtime CMP Count:' + JSON.stringify(results),
                            );

                            if (results.rows.length > 0) {
                              for (let i = 0; i < results.rows.length; ++i) {
                                if (results.rows.item(i).Total > 0) {
                                  setAlert(
                                    true,
                                    'warning',
                                    'Please complete the checklist before proceed to work order completion',
                                    'Downtime',
                                  );
                                } else {
                                  setspinner(false);
                                }
                              }
                            } else {
                              setspinner(false);
                            }
                          },
                        );
                      } else {
                        setspinner(false);
                      }
                    }
                  }
                },
              );
            }
          },
        );
      });
    } else {
      get_time_card_list();
    }
  };

  const select_checkbox2 = () => {
    setCheckboxState(false);
  };

  const get_time_card_list = async () => {
    setspinner(true);

    try {
      console.log(
        'JSON DATA : ' +
          `${Baseurl}/get_time_card_list_count.php?site_cd=${Site_cd}&mst_RowID=${mst_RowID}`,
      );

      const response = await axios.get(
        `${Baseurl}/get_time_card_list_count.php?site_cd=${Site_cd}&mst_RowID=${mst_RowID}`,
      );

      //console.log(JSON.stringify(response));

      //console.log("JSON DATA : " + response.data.status)

      if (response.data.status === 'SUCCESS') {
        if (response.data.data.length > 0) {
          setspinner(false);
          // Alert.alert('Time Card','Before doing work order completion please complete the Time Card List',
          //     [

          //         { text: "OK", onPress:()=>

          //         select_checkbox2()

          //         }

          //     ]);

          setAlert(
            true,
            'warning',
            'Please complete the timecard before proceed to work order completion',
            'TimeCard',
          );
        } else {
          db.transaction(function (txn) {
            //check asset Downtime
            txn.executeSql(
              'SELECT * FROM cf_menu where column1 = ? and mobile_object_type = ? and object_name = ?',
              ['Work Order', 'O', 'o_wo_downtime'],
              (tx, results) => {
                var work_class = [];
                console.log('Asset Downtime edit:' + results.rows.length);

                if (results.rows.length > 0) {
                  for (let i = 0; i < results.rows.length; ++i) {
                    console.log(
                      'Asset Downtime',
                      results.rows.item(i).exe_flag,
                    );

                    if (results.rows.item(i).exe_flag === '1') {
                      get_downtime_count();
                    } else {
                      if (Checklist_Scan === '1') {
                        get_checklist_sacn_count();
                      } else {
                        if (Checklist_CMP === '1') {
                          get_checklist_cmp_count();
                        } else {
                          setspinner(false);
                        }
                      }
                    }
                  }
                } else {
                  if (Checklist_Scan === '1') {
                    get_checklist_sacn_count();
                  } else {
                    if (Checklist_CMP === '1') {
                      get_checklist_cmp_count();
                    } else {
                      setspinner(false);
                    }
                  }
                }
              },
            );
          });
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
  };

  const get_downtime_count = async () => {
    setspinner(true);

    try {
      console.log(
        'JSON DATA : ' +
          `${Baseurl}/get_work_order_asset_downtime_check.php?site_cd=${Site_cd}&ast_dwntime_down_wo=${route.params.Selected_WorkOrder_no}&ast_dwntime_asset_no=${route.params.Selected_AssetNo}`,
      );

      const response = await axios.get(
        `${Baseurl}/get_work_order_asset_downtime_check.php?site_cd=${Site_cd}&ast_dwntime_down_wo=${route.params.Selected_WorkOrder_no}&ast_dwntime_asset_no=${route.params.Selected_AssetNo}`,
      );

      //console.log("JSON DATA : " + response.data.status)

      if (response.data.status === 'SUCCESS') {
        console.log(response.data.data.length);

        // for (let i = 0; i < response.data.data.length; ++i){
        //     console.log(i);
        // }
        if (response.data.data.length > 0) {
          setspinner(false);
          // Alert.alert('DownTime','Before doing work order completion please complete the Downtime',
          //     [

          //         { text: "OK", onPress:()=>

          //         select_checkbox2()

          //         }

          //     ]);

          setAlert(
            true,
            'warning',
            'Please complete the downtime before proceed to work order completion',
            'Downtime',
          );
        } else {
          if (Checklist_CMP === '1') {
            get_checklist_sacn_count();
          } else {
            if (Checklist_CMP === '1') {
              get_checklist_cmp_count();
            } else {
              setspinner(false);
            }
          }
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
  };

  const get_checklist_sacn_count = async () => {
    setspinner(true);

    try {
      console.log(
        'JSON DATA : ' +
          `${Baseurl}/get_check_list_scan_count.php?site_cd=${Site_cd}&mst_RowID=${mst_RowID}`,
      );
      const response = await axios.get(
        `${Baseurl}/get_check_list_scan_count.php?site_cd=${Site_cd}&mst_RowID=${mst_RowID}`,
      );

      //console.log("JSON DATA : " + response.data.status)
      if (response.data.status === 'SUCCESS') {
        console.log(response.data.Total);
        if (response.data.Total > 0) {
          setspinner(false);
          // Alert.alert('DownTime','Before doing work order completion please complete the Downtime',
          //     [

          //         { text: "OK", onPress:()=>

          //         select_checkbox2()

          //         }

          //     ]);

          setAlert(
            true,
            'warning',
            'Please scan the asset QR code before proceed to work order completion',
            'checklist_scan',
          );
        } else {
          if (Checklist_CMP === '1') {
            get_checklist_cmp_count();
          } else {
            setspinner(false);
          }
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
  };

  const get_checklist_cmp_count = async () => {
    setspinner(true);

    try {
      console.log(
        'JSON DATA : ' +
          `${Baseurl}/get_check_list_cmp_count.php?site_cd=${Site_cd}&mst_RowID=${mst_RowID}`,
      );
      const response = await axios.get(
        `${Baseurl}/get_check_list_cmp_count.php?site_cd=${Site_cd}&mst_RowID=${mst_RowID}`,
      );
      //console.log("JSON DATA : " + response.data.status)

      if (response.data.status === 'SUCCESS') {
        console.log(response.data.Total);
        if (response.data.Total > 0) {
          setspinner(false);

          setAlert(
            true,
            'warning',
            'Please complete the checklist before proceed to work order completion',
            'checklist_scan',
          );
        }

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

  const clear_WorkClass = () => {
    setWorkClass_key('');
    setWorkClass_label('');
  };

  const clear_WorkGroup = () => {
    setWorkGroup_key('');
    setWorkGroup_label('');
  };

  const clear_CauseCode = () => {
    setCauseCode_key('');
    setCauseCode_label('');
  };

  const clear_ActionCode = () => {
    setActionCode_key('');
    setActionCode_label('');
  };

  const clear_status = () => {
    setWorkorderStatus_key('');
    setWorkorderStatus_label('');
    setCheckboxState(!checkboxState);
  };

  const setAlert = (show, theme, title, type) => {
    setShow(show);
    setTheme(theme);
    setTitle(title);
    setAlertType(type);
  };

  const setAlert_two = (show, theme, title, type, value) => {
    setShow_two(show);
    setTheme(theme);
    setTitle(title);
    setAlertType(type);
    setImgValue(value);
  };

  const One_Alret_onClick = D => {
    if (D === 'OK') {
      setShow(false);
    } else if (D === 'UPDATE_CMP') {
      setShow(false);

      _goBack();
    } else if (D === 'TimeCard' || D === 'Downtime' || D === 'checklist_scan') {
      setShow(false);

      select_checkbox2();
    }else if (D === 'Delete_IMG') {
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
    setShow_two(false);

    if (D === 'BACK') {
      _goBack();
    }else if (D === 'DeleteNewImage') {
      setShow_two(false);

      DeleteNewImage(ImgValue);
    } else if (D === 'DeleteImage') {
      setShow_two(false);

      DeleteImage(ImgValue);
    }
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
          <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', }}>
            <Pressable onPress={_goBack}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <FontAwesome name="angle-left" color="#fff" size={55} style={{marginLeft: 15, marginBottom: 5}} />
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
              <View
                style={{flexDirection: 'row', alignItems: 'center', height: 50}}>
                <Text style={{ flex: 1, fontSize: 15, justifyContent: 'center', textAlign: 'center', color: '#000', fontWeight: 'bold', }}> {textvalue} </Text>
                <Ionicons name="close" color="red" size={30} style={{marginEnd: 15}} onPress={() => setDropDown_modalVisible(!DropDown_modalVisible)} />
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
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
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


        <View style={styles.container}>

        <FlatList
            ListHeaderComponent={
              <View style={styles.container_01}>
                <Pressable>

                  <View style={styles.card_01}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#0096FF', borderTopRightRadius: 10, borderTopLeftRadius: 10, }}>
                      <Text style={{ fontSize: 15, justifyContent: 'center', color: '#ffffffff', margin: 5, fontWeight: 'bold', }}> DETAILS </Text>
                    </View>

                    {/*WorkClass*/}
                    <View style={styles.view_style}>
                      <Pressable
                        onPress={
                          () =>
                            !Editable ? select_dropdown('Work Class', WorkClass) : ''

                          //!Editable ? console.log("EE1"+Editable) : console.log("EE2"+Editable)
                        }
                        onLongPress={() => clear_WorkClass()}>
                        <View pointerEvents={'none'}>
                          <TextInput
                            value={WorkClass_key}
                            style={[ styles.input, { height: Math.max( Platform.OS === 'ios' ? 50 : 50, height)}]}
                            inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}, ]}
                            labelStyle={styles.labelStyle}
                            placeholderStyle={{ fontSize: 15, color: '#0096FF', }}
                            onContentSizeChange={event => setHeight(event.nativeEvent.contentSize.height) }
                            textErrorStyle={styles.textErrorStyle}
                            // onPressOut={()=>{!Editable ? select_dropdown("Asset Group Code",AssetGroupCode) : ''}}
                            label="Work Class"
                            focusColor="#808080"
                            editable={Editable}
                            selectTextOnFocus={Editable}
                            renderRightIcon={() =>
                              Editable ? (
                                ''
                              ) : (
                                <AntDesign
                                  style={styles.icon}
                                  color={'black'}
                                  name={WorkClass_key ? 'close' : 'search1'}
                                  size={22}
                                  disable={true}
                                  onPress={() =>
                                    WorkClass_key
                                      ? setEmployee_key('')
                                      : select_dropdown('Work Class', WorkClass)
                                  }
                                />
                              )
                            }
                          />
                        </View>
                      </Pressable>
                    </View>

                    {/*WorkGroup*/}
                    <View style={styles.view_style}>
                      <Pressable
                        onPress={
                          () =>
                            !Editable ? select_dropdown('Work Group', WorkGroup) : ''

                          //!Editable ? console.log("EE1"+Editable) : console.log("EE2"+Editable)
                        }
                        onLongPress={() => clear_WorkGroup()}>
                        <View pointerEvents={'none'}>
                          <TextInput
                            value={WorkGroup_key}
                            style={[ styles.input, { height: Math.max( Platform.OS === 'ios' ? 50 : 50, height, ), }, ]}
                            inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}, ]}
                            labelStyle={styles.labelStyle}
                            placeholderStyle={{ fontSize: 15, color: '#0096FF' }}
                            onContentSizeChange={event => setHeight(event.nativeEvent.contentSize.height) }
                            textErrorStyle={styles.textErrorStyle}
                            // onPressOut={()=>{!Editable ? select_dropdown("Asset Group Code",AssetGroupCode) : ''}}
                            label="Work Group"
                            focusColor="#808080"
                            editable={Editable}
                            selectTextOnFocus={Editable}
                            renderRightIcon={() =>
                              Editable ? (
                                ''
                              ) : (
                                <AntDesign
                                  style={styles.icon}
                                  color={'black'}
                                  name={WorkGroup_key ? 'close' : 'search1'}
                                  size={22}
                                  disable={true}
                                  onPress={() =>
                                    WorkGroup_key
                                      ? setWorkGroup_key('')
                                      : select_dropdown('Work Group', WorkGroup)
                                  }
                                />
                              )
                            }
                          />
                        </View>
                      </Pressable>
                    </View>

                    {/*CauseCode*/}
                    <View style={styles.view_style}>
                      <Pressable
                        onPress={ () => !Editable ? select_dropdown('Cause Code', CauseCode) : '' }
                        onLongPress={() => clear_CauseCode()}>
                        <View pointerEvents={'none'}>
                          <TextInput
                            value={CauseCode_key}
                            style={[ styles.input, { height: Math.max( Platform.OS === 'ios' ? 50 : 50, height ) } ]}
                            inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}, ]}
                            labelStyle={styles.labelStyle}
                            placeholderStyle={{ fontSize: 15, color: '#0096FF', }}
                            onContentSizeChange={event => setHeight(event.nativeEvent.contentSize.height) }
                            textErrorStyle={styles.textErrorStyle}
                            // onPressOut={()=>{!Editable ? select_dropdown("Asset Group Code",AssetGroupCode) : ''}}
                            label="Cause Code"
                            focusColor="#808080"
                            editable={Editable}
                            selectTextOnFocus={Editable}
                            renderRightIcon={() =>
                              Editable ? (
                                ''
                              ) : (
                                <AntDesign
                                  style={styles.icon}
                                  color={'black'}
                                  name={CauseCode_key ? 'close' : 'search1'}
                                  size={22}
                                  disable={true}
                                  onPress={() =>
                                    CauseCode_key
                                      ? setCauseCode_key('')
                                      : select_dropdown('Cause Code', CauseCode)
                                  }
                                />
                              )
                            }
                          />
                        </View>
                      </Pressable>
                    </View>

                    {/*CauseCode*/}
                    <View style={styles.view_style}>
                      <Pressable
                        onPress={ () => !Editable ? select_dropdown('Action Code', ActionCode) : '' }
                        onLongPress={() => clear_ActionCode()}>
                        <View pointerEvents={'none'}>
                          <TextInput
                            value={ActionCode_key}
                            style={[ styles.input, { height: Math.max( Platform.OS === 'ios' ? 50 : 50, height, ), }, ]}
                            inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}, ]}
                            labelStyle={styles.labelStyle}
                            placeholderStyle={{ fontSize: 15, color: '#0096FF', }}
                            onContentSizeChange={event => setHeight(event.nativeEvent.contentSize.height) }
                            textErrorStyle={styles.textErrorStyle}
                            // onPressOut={()=>{!Editable ? select_dropdown("Asset Group Code",AssetGroupCode) : ''}}
                            label="Action Code"
                            focusColor="#808080"
                            editable={Editable}
                            selectTextOnFocus={Editable}
                            renderRightIcon={() =>
                              Editable ? (
                                ''
                              ) : (
                                <AntDesign
                                  style={styles.icon}
                                  color={'black'}
                                  name={ActionCode_key ? 'close' : 'search1'}
                                  size={22}
                                  disable={true}
                                  onPress={() =>
                                    ActionCode_key
                                      ? setActionCode_key('')
                                      : select_dropdown('Action Code', ActionCode)
                                  }
                                />
                              )
                            }
                          />
                        </View>
                      </Pressable>
                    </View>

                    <View style={[styles.view_style]}>
                      <TextInput
                        value={CorrectiveAction}
                        style={[ styles.input, { height: Math.max( Platform.OS === 'ios' ? 50 : 50, CorrectiveAction_height, ) } ]}
                        multiline={true}
                        inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'} ]}
                        labelStyle={styles.labelStyle}
                        placeholderStyle={{ fontSize: 15, color: '#0096FF' }}
                        onContentSizeChange={event => setCorrectiveAction_height( event.nativeEvent.contentSize.height ) }
                        textErrorStyle={styles.textErrorStyle}
                        label="Corrective Action"
                        placeholderTextColor="gray"
                        focusColor="#808080"
                        editable={!Editable}
                        selectTextOnFocus={!Editable}
                        onChangeText={text => { setCorrectiveAction(text) }}
                        renderRightIcon={() =>
                          Editable ? (
                            ''
                          ) : (
                            <AntDesign
                              style={styles.icon}
                              name={CorrectiveAction ? 'close' : ''}
                              size={22}
                              disable={true}
                              onPress={() =>
                                CorrectiveAction ? setCorrectiveAction('') : ''
                              }
                            />
                          )
                        }
                      />
                    </View>

                    <View style={[styles.view_style]}>
                      <TextInput
                        value={MaintenanceRemark}
                        style={[ styles.input, { height: Math.max( Platform.OS === 'ios' ? 50 : 50, MaintenanceRemark_height ) } ]}
                        multiline={true}
                        numberOfLines={4}
                        inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}, ]}
                        labelStyle={styles.labelStyle}
                        placeholderStyle={{ fontSize: 15, color: '#0096FF', }}
                        onContentSizeChange={event => setMaintenanceRemark_height( event.nativeEvent.contentSize.height ) }
                        textErrorStyle={styles.textErrorStyle}
                        label="Maintenance Remark"
                        placeholderTextColor="gray"
                        focusColor="#808080"
                        editable={!Editable}
                        selectTextOnFocus={!Editable}
                        onChangeText={text => { setMaintenanceRemark(text) }}
                        renderRightIcon={() =>
                          Editable ? (
                            ''
                          ) : (
                            <AntDesign
                              style={styles.icon}
                              name={MaintenanceRemark ? 'close' : ''}
                              size={22}
                              disable={true}
                              onPress={() =>
                                MaintenanceRemark ? setMaintenanceRemark('') : ''
                              }
                            />
                          )
                        }
                      />
                    </View>

                    <View style={styles.card_row}>
                      <View style={{marginLeft: 10, marginRight: 10}}>
                        <Text style={[styles.text_footer]}>Complete ?</Text>

                        <View>
                          <BouncyCheckbox
                            style={{margin: 10}}
                            size={45}
                            fillColor="blue"
                            unfillColor="#FFFFFF"
                            isChecked={checkboxState}
                            disableBuiltInState={true}
                            iconStyle={{borderColor: 'green', borderRadius: 10}}
                            innerIconStyle={{ borderWidth: 2, borderRadius: 10, borderColor: '#808080' }}
                            textStyle={{fontFamily: 'JosefinSans-Regular'}}
                            onPress={() => select_checkbox()}
                          />
                        </View>
                      </View>

                      {checkboxState ? (
                        <View style={{flex: 1}}>
                          {/*WorkClass*/}
                          <View style={styles.view_style}>
                            <Pressable
                              onPress={ () => !Editable ? select_dropdown( 'Work Order Status', WorkorderStatus ) : '' }
                              onLongPress={() => clear_status()}>
                              <View pointerEvents={'none'}>
                                <TextInput
                                  value={WorkorderStatus_key}
                                  style={[ styles.input, { height: Math.max( Platform.OS === 'ios' ? 50 : 50, height ) } ]}
                                  inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'} ]}
                                  labelStyle={styles.labelStyle}
                                  placeholderStyle={{ fontSize: 15, color: '#0096FF' }}
                                  label="Complete Status"
                                  editable={Editable}
                                  selectTextOnFocus={Editable}
                                  renderRightIcon={() =>
                                    Editable ? (
                                      ''
                                    ) : (
                                      <AntDesign
                                        style={styles.icon}
                                        color={'black'}
                                        name={WorkorderStatus_key ? 'close' : 'search1'}
                                        size={22}
                                        disable={true}
                                        onPress={() => WorkorderStatus_key ? setWorkorderStatus_key('') : select_dropdown( 'Work Order Status', WorkorderStatus ) }
                                      />
                                    )
                                  }
                                />
                              </View>
                            </Pressable>
                          </View>
                        </View>
                      ) : null}
                    </View>

                     
                  </View>

                  {/* WORK ORDER ATTACHMENTS */}
                  <View style={styles.card}>
                      <View style={styles.card_heard}>
                        <Text style={styles.card_heard_text}> WORK ORDER ATTACHMENTS </Text>
                      </View>

                      <View style={[ styles.view_style, { display: !Editable ? 'flex' : 'none', flexDirection: 'row', }]}>
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
                
                </Pressable>

              </View>
            }
            numColumns={2}
            data={Attachments_List}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={Attachments_onItem}
            renderItem={Attachments_ItemView}
          />
          <ScrollView style={{flex: 1, marginBottom: 80}}>
            
          </ScrollView>
        </View>

        <View style={styles.bottomView}>
          <TouchableOpacity
            style={{ width: '100%', height: 60, backgroundColor: '#8BC34A', alignItems: 'center', justifyContent: 'center' }}
            onPress={() => get_validation()}>
            <Text style={{color: 'white', fontSize: 16}}>Save</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaProvider>
    </DismissKeyboard>
  );
}

export default WorkOrderCompletion;

const {width} = Dimensions.get('window');
const IMAGE_WIDTH = (width - 50) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

  card_01: {
    backgroundColor: '#FFFFFF',
    margin: 10,
    borderRadius: 10,
  },

  text_footer: {
    color: '#42A5F5',
    fontSize: 14,
    marginTop: 10,
    marginLeft: 5,
  },

  text_input: {
    flexDirection: 'row',
    height: 45,
    marginLeft: 5,
    color: '#000',
  },

  action: {
    flexDirection: 'row',
    height: 40,
    borderWidth: 1,
    alignItems: 'center',

    marginTop: 5,
    borderColor: '#808080',
    borderRadius: 5,
  },
  card_row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 10,
    alignItems: 'center',
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

  model2_cardview: {
    flex: 1,
    marginTop: 50,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },

  view_style: {
    flex: 1,
    marginTop: 12,
    marginLeft: 10,
    marginRight: 10,
  },

  dropdown_style: {
    margin: 10,
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
  model_cardview: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
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
});
