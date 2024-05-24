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
import {useTheme} from 'react-native-paper';
import {openDatabase} from 'react-native-sqlite-storage';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import ImagePickerModal from 'react-native-image-picker-modal';
import Att_Modal from 'react-native-modal';
import Feather from 'react-native-vector-icons/Feather';
import {TextInput} from 'react-native-element-textinput';
import {Dropdown} from 'react-native-element-dropdown';
import {SearchBar} from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';
import UserAvatar from '@muhzi/react-native-user-avatar';
import ImageZoom from 'react-native-image-pan-zoom';
import Pdf from 'react-native-pdf';
import DocumentPicker from 'react-native-document-picker';
import Video from 'react-native-video-enhanced';
import ImageViewer from 'react-native-image-zoom-viewer';
var db = openDatabase({name: 'CMMS.db'});
let Baseurl, Site_cd, LoginID, EmpName, EmpID, EmpPhone, EmpWorkGrp, dvc_id, OrgPriority, dft_mst_wkr_asset_no;
const DismissKeyboard = ({children}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const CreateWorkRequestApproval = ({route, navigation}) => {

  const _goBack = () => {
    if (route.params.Screenname === 'WRApprovalAll') {
      navigation.navigate('WorkRequestApprovalListing', {
        Screenname: route.params.Screenname,
      });
    } else if (route.params.Screenname === 'WRApprovalMy') {
      navigation.navigate('WorkRequestApprovalListing', {
        Screenname: route.params.Screenname,
      });
    }

    return true;
  };

  let Valid = false;

  const [isVisible, setVisible] = React.useState(false);
  const [spinner, setspinner] = React.useState(false);
  const [Toolbartext, setToolbartext] = React.useState('');
  const [Editable, setEditable] = React.useState(false);
  const [height, setHeight] = React.useState(0);

  const [RowID, setRowID] = React.useState('');

  const [Employee, setEmployee] = React.useState([]);
  const [OriginalPriority, setOriginalPriority] = React.useState([]);
  const [WorkGroup, setWorkGroup] = React.useState([]);
  const [WorkOrderStatus, setWorkOrderStatus] = React.useState([]);
  const [FaultCode, setfaultCode] = React.useState([]);
  const [AssignTo_Employee, setAssignTo_Employee] = React.useState([]);
  //Asset POP UP DropDown
  const [AssetType, setAssetType] = React.useState([]);
  const [AssetGroupCode, setAssetGroupCode] = React.useState([]);
  const [Assetcode, setAssetcode] = React.useState([]);
  const [WorkArea, setWorkArea] = React.useState([]);
  const [AssetLocation, setAssetLocation] = React.useState([]);
  const [AssetLevel, setAssetLevel] = React.useState([]);
  const [CostCenter, setCostCenter] = React.useState([]);

  const [Employee_key, setEmployee_key] = React.useState('');
  const [PhoneNo, setPhoneNo] = React.useState('');

  const [WorkRequestNo_AutoNo, setWokrRequestNo_AutoNo] = React.useState('');
  const [WorkRequestNo, setWorkRequestNo] = React.useState('');
  const [WorkRequestNo_editable, setWorkRequestNo_editable] = React.useState(false);
  const [WorkRequestNoValid, setWorkRequestNoValid] = React.useState(true);

  const [OrgPriority_key, setOrgPriority_key] = React.useState('');
  const [OrgCount, setOrgCount] = React.useState('');

  const [isDatepickerVisible, setDatePickerVisibility] = React.useState(false);
  const [isTimepickerVisible, setTimePickerVisibility] = React.useState(false);
  const [Type, setType] = React.useState('');
  const [OrgDate, setOrgDate] = React.useState('');
  const [DueDate, setDueDate] = React.useState('');

  const [OrgTime, setOrgTime] = React.useState('');
  const [DueTime, setDueTime] = React.useState('');

  const [WorkGroup_key, setWorkGroup_key] = React.useState('');
  const [FaultCode_key, setFaultCode_key] = React.useState('');
  const [WorkOrderDescription, setWorkOrderDescription] = React.useState('');

  const [Asset_modalVisible, setAsset_modalVisible] = React.useState(false);
  const [AssetList_modalVisible, setAssetList_modalVisible] = React.useState(false);
  const [AssetList_data, setAssetList_data] = React.useState([]);
  const [AssetList_FilteredData, setAssetList_FilteredData] = React.useState([]);
  const [AssetList_search, setAssetList_search] = React.useState('');

  const [AssetNo, setAssetNo] = React.useState('');
  const [AssetDescription, setAssetDescription] = React.useState('');
  const [WorkArea_key, setWorkArea_key] = React.useState('');
  const [AssetLocation_key, setAssetLocation_key] = React.useState('');
  const [AssetLevel_key, setAssetLevel_key] = React.useState('');
  const [CostCenter_key, setCostCenter_key] = React.useState('');

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

  const [Box_AssignTo, setBox_AssignTo] = React.useState('');
  const [Box_WorkOrderStatus, setBox_WorkOrderStatus] = React.useState('');
  const [Box_WorkGroup, setBox_WorkGroup] = React.useState('');

  const [Box_AssignTo_labe, setBox_AssignTo_labe] = React.useState('');
  const [Box_WorkOrderStatus_labe, setBox_WorkOrderStatus_labe] = React.useState('');
  const [Box_WorkGroup_labe, setBox_WorkGroup_labe] = React.useState('');

  const [Box_DisapproveReason, setBox_DisapproveReason] = React.useState('');

  const [Box_AssetType_label, setBox_AssetType_label] = React.useState('');
  const [Box_AssetGroupCode_label, setBox_AssetGroupCode_label] = React.useState('');
  const [Box_AssetCode_label, setBox_AssetCode_label] = React.useState('');
  const [Box_WorkArea_label, setBox_WorkArea_label] = React.useState('');
  const [Box_AssetLocation_label, setBox_AssetLocation_label] = React.useState('');
  const [Box_AssetLevel_label, setBox_AssetLevel_label] = React.useState('');

  const [Approval_modalVisible, setApproval_modalVisible] = React.useState(false);
  const [Disapproval_modalVisible, setDisapproval_modalVisible] = React.useState(false);

  const [visible_ApprovalBox, setvisible_ApprovalBox] = React.useState(false);
  const [visible_DisApprovalBox, setvisible_DisApprovalBox] = React.useState(false);

  const [ApprovalBy, setApprovalBy] = React.useState('');
  const [ApprovalDate, setApprovalDate] = React.useState('');
  const [WorkOrderNo, setWorkOrderNo] = React.useState('');
  const [WorkOrderStatus_key, setWorkOrderStatus_key] = React.useState('');

  const [RejectedBy, setRejectedBy] = React.useState('');
  const [RejectedDate, setRejectedDate] = React.useState('');
  const [RejectedDesc, setRejectedDesc] = React.useState('');

  //DropDown Modal
  const [textvalue, settextvalue] = React.useState('');
  const [Boxtextvalue, setBoxtextvalue] = React.useState('');
  const [Dropdown_data, setDropdown_data] = React.useState([]);
  const [DropDownFilteredData, setDropDownFilteredData] = React.useState([]);
  const [DropDown_modalVisible, setDropDown_modalVisible] = React.useState(false);
  const [DropDown_search, setDropDown_search] = React.useState('');
  const [refreshing, setRefreshing] = React.useState(false);

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
  const [visible_bottomView, setvisible_bottomView] = React.useState(true);

  //Alert
  const [Show, setShow] = React.useState(false);
  const [Show_two, setShow_two] = React.useState(false);
  const [Theme, setTheme] = React.useState('');
  const [Title, setTitle] = React.useState('');
  const [AlertType, setAlertType] = React.useState('');
  const [ImgValue, setImgValue] = React.useState([]);


  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', _goBack);

    return () => BackHandler.removeEventListener('hardwareBackPress', _goBack);
  }, []);

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
    dft_mst_wkr_asset_no = await AsyncStorage.getItem('dft_mst_wkr_asset_no');

    db.transaction(function (txn) {
      //employee
      txn.executeSql( 'SELECT * FROM employee', [], (tx, { rows }) => { setEmployee(rows.raw())});
      
      //priority
      txn.executeSql( 'SELECT * FROM priority', [], (tx, { rows }) => { setOriginalPriority(rows.raw()) });
      
      //wrk_group
      txn.executeSql( 'SELECT * FROM wrk_group', [], (tx, { rows }) => { setWorkGroup(rows.raw()) });
      
      //faultcode
      txn.executeSql( 'SELECT * FROM faultcode', [], (tx, { rows }) => { setfaultCode(rows.raw()) });
      
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
      txn.executeSql( 'SELECT * FROM assetlocation', [], (tx, { rows }) => { setAssetLocation(rows.raw()) });
      
      //assetlevel
      txn.executeSql( 'SELECT * FROM assetlevel', [], (tx, { rows }) => { setAssetLevel(rows.raw()) });

      //WorkOrderStatus
      txn.executeSql( `SELECT * FROM workorderstatus where  wrk_sts_typ_cd NOT IN('COMPLETE','CLOSE','CANCEL','FORCE-CLOSE')`, [], (tx, { rows }) => { setWorkOrderStatus(rows.raw()) });
      

      //wkr_auto_numbering
      txn.executeSql('SELECT * FROM wkr_auto_numbering', [], (tx, results) => {
        var criticalfactor_temp = [];
        let cnt_mst_numbering, cnt_mst_option, cnt_mst_module_cd;
        console.log('wkr_auto_numbering:' + results.rows);
        for (let i = 0; i < results.rows.length; ++i) {
          cnt_mst_numbering = results.rows.item(i).cnt_mst_numbering;
          cnt_mst_option = results.rows.item(i).cnt_mst_option;
          cnt_mst_module_cd = results.rows.item(i).cnt_mst_module_cd;
        }

        console.log('WR AUTO NO: ' + cnt_mst_numbering);
        //console.log(cnt_mst_option)
        //console.log(cnt_mst_module_cd)
        setWokrRequestNo_AutoNo(cnt_mst_numbering);

        if (cnt_mst_numbering === 'M') {
          setWorkRequestNo_editable(true);
          setWorkRequestNoValid(true);
        } else {
          setWorkRequestNo_editable(false);
          setWorkRequestNoValid(false);
        }
      });
    });

    setToolbartext('Work Request Approval');
    setEditable(true);

    

    get_dropdown_Assign_Employee();
  };


  //Assing EMP
  const get_dropdown_Assign_Employee = async () => {

    console.log( 'get_dropdown : ' + `${Baseurl}/get_assign_emp.php?site_cd=${Site_cd}&emp_id=${EmpID}`);
    fetch(`${Baseurl}/get_assign_emp.php?site_cd=${Site_cd}&emp_id=${EmpID}`)
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

          if (data.data.length > 0) {

            setAssignTo_Employee(data.data);
            get_workorder_listing(route.params.Selected_WorkRequest_no);

          }else {
            get_workorder_listing(route.params.Selected_WorkRequest_no);
          }
        
         

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

  // GET WORK REQUEST LIST API
  const get_workorder_listing = async WorkRequestNO => {

    console.log(WorkRequestNO);

    let WR_listing = {
      site_cd: Site_cd,
      wkr_mst_wr_status: '',

      wkr_mst_wr_no: WorkRequestNO,
      wkr_mst_wr_descs: '',

      wkr_mst_assetno: '',
      ast_mst_asset_shortdesc: '',
      wkr_mst_originator: '',
      wkr_mst_work_area: '',
      wko_mst_asset_location: '',
      wko_mst_asset_level: '',

      wkr_mst_chg_costcenter: '',
      wkr_mst_org_date: '',
      wkr_mst_due_date: '',
      createby: '',

      emp_det_work_grp: EmpWorkGrp,
      emp_id: EmpID,
    };

    console.log('Work Request Listing: ' + JSON.stringify(WR_listing));

    try {
      const response = await axios.post( `${Baseurl}/get_workrequestlist.php?`, JSON.stringify(WR_listing));
      //console.log('JSON DATA : ' + response.data.data);

      if (response.data.status === 'SUCCESS') {

        if (response.data.data.length > 0) {

          for (let value of Object.values(response.data.data)) {

            setRowID(value.RowID);
            setEmployee_key(value.wkr_mst_originator);
            setPhoneNo(value.wkr_mst_phone);

            setWorkRequestNo(value.wkr_mst_wr_no);
            setOrgPriority_key(value.wkr_mst_orig_priority);

            let Org_Date = moment(value.wkr_mst_org_date.date).format( 'yyyy-MM-DD');
            console.log(Org_Date);
            if (Org_Date === '1900-01-01') {
              setOrgDate('');
            } else {
              setOrgDate(Org_Date);
            }

            let Due_Date = moment(value.wkr_mst_due_date.date).format( 'yyyy-MM-DD');
            console.log(Due_Date);
            if (Due_Date === '1900-01-01') {
              setDueDate('');
            } else {
              setDueDate(Due_Date);
            }

            let Org_Time = moment(value.wkr_mst_org_date.date).format('HH:mm');
            console.log(Org_Date);
            if (Org_Date === '00:00') {
              setOrgTime('');
            } else {
              setOrgTime(Org_Time);
            }

            let Due_Time = moment(value.wkr_mst_due_date.date).format('HH:mm');
            console.log(Due_Time);
            if (Due_Date === '00:00') {
              setDueTime('');
            } else {
              setDueTime(Due_Time);
            }

            if (value.wkr_mst_wr_status == 'A') {
              setvisible_ApprovalBox(true);
              setvisible_bottomView(false);

              setApprovalBy(value.wkr_det_approver);
              let Rej_Date = moment(value.wkr_det_appr_date.date).format( 'yyyy-MM-DD HH:mm');
              console.log(Rej_Date);
              if (Due_Date === '1900-01-01 00:00') {
                setApprovalDate('');
              } else {
                setApprovalDate(Rej_Date);
              }

              setWorkOrderNo(value.wkr_det_wo);
              setWorkOrderStatus_key(value.wkr_mst_wr_status);
            } else if (value.wkr_mst_wr_status == 'D') {
              setvisible_DisApprovalBox(true);
              setvisible_bottomView(false);
              setRejectedBy(value.wkr_det_reject_by);

              let Rej_Date = moment(value.wkr_det_reject_date.date).format( 'yyyy-MM-DD HH:mm');
              console.log(Rej_Date);
              if (Due_Date === '1900-01-01 00:00') {
                setRejectedDate('');
              } else {
                setRejectedDate(Rej_Date);
              }

              setRejectedDesc(value.wkr_det_reject_desc);
            }

            setWorkGroup_key(value.wkr_mst_work_group);
            setFaultCode_key(value.wkr_mst_fault_code);
            setWorkOrderDescription(value.wkr_mst_wr_descs);

            setAssetNo(value.wkr_mst_assetno);
            setAssetDescription(value.ast_mst_asset_shortdesc);
            setWorkArea_key(value.wkr_mst_work_area);
            setAssetLocation_key(value.wkr_mst_location);
            setAssetLevel_key(value.wkr_mst_assetlocn);
            setCostCenter_key(value.wkr_mst_chg_costcenter);
          }
          get_workrequest_attachment();
        } else {
           setspinner(false);
           setAlert(true,'warning',response.data.message,'OK');
        }
      } else {
        setspinner(false);
        setAlert(true,'danger',response.data.message,'OK');
      }
    } catch (error) {
      setspinner(false);
      alert(error);
    }
  };

  // GET WORK ORDER ATTACHMENT FILE API
  const get_workrequest_attachment = async () => {
    const SPLIT_URL = Baseurl.split('/');
    const SPLIT_URL1 = SPLIT_URL[SPLIT_URL.length - 2];
    const SPLIT_URL2 = SPLIT_URL[SPLIT_URL.length - 1];
    const SPLIT_URL3 = SPLIT_URL1+'/'+SPLIT_URL2
    console.log('URL' + SPLIT_URL3);

    try {
      console.log( 'JSON DATA : ' + `${Baseurl}/get_work_request_attachment_by_params.php?site_cd=${Site_cd}&rowid=${route.params.RowID}&type=P&url=${Baseurl}&folder=${SPLIT_URL3}&dvc_id=${dvc_id}`, );
      const response = await axios.get( `${Baseurl}/get_work_request_attachment_by_params.php?site_cd=${Site_cd}&rowid=${route.params.RowID}&type=P&url=${Baseurl}&folder=${SPLIT_URL3}&dvc_id=${dvc_id}`, );
      //console.log("JSON DATA : " + response.data.status)
      if (response.data.status === 'SUCCESS') {

        if (response.data.data.length > 0) {

          setAttachments_List([]);
          setimages_list([])
          setimages_link([])
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

            //console.log('PATH' + JSON.stringify(path));

            Attachments_List.unshift({ key, path, name, imagetype, type, localIdentifier, rowid, });
            setAttachments_List(Attachments_List.slice(0));
            key++;
          }
          for (let i = 0; i < images_list.length; i++) {

            let key = i + 1
            setimages_link(images_link=>[...images_link,{ key:key,url:images_list[i].path,name:images_list[i].name}]);

          }
          setspinner(false);
        } else {
          setspinner(false);
        }
      } else {
        setspinner(false);
        setAlert(true,'danger',response.data.message,'OK');
      }
    } catch (error) {
      setspinner(false);
      alert(error);
    }
  };

  //Approve
  const get_butoon_approve = () => {
    setApproval_modalVisible(!Approval_modalVisible);
  };

  //Disapprove
  const get_butoon_disapprove = () => {
    setDisapproval_modalVisible(!Disapproval_modalVisible);
  };

  const Approve = () => {
    setspinner(true);

    if (!Box_AssignTo) {
      //alert('Please Select Assign To');
      setAlert(true,'warning','Please Select Assign To','OK');
      Valid = false;
      setspinner(false);
    } else {
      if (!Box_WorkOrderStatus) {
        //alert('Please Select Work Request Status');
        setAlert(true,'warning','Please Select Work Order Status','OK');
        Valid = false;
        setspinner(false);
      } else {
        if (!Box_WorkGroup) {
          //alert('Please Enter Work Group');
          setAlert(true,'warning','Please Enter Work Group','OK');
          Valid = false;
          setspinner(false);
        } else {
          Valid = true;

          if (Valid) {
            get_workrequest_approval();
          }
        }
      }
    }
  };

  const Disapprove = () => {
    setspinner(true);

    if (!Box_DisapproveReason) {
      //alert('Please Enter Disapprove Reason');
      setAlert(true,'warning','Please Enter Disapprove Reason','OK');
      Valid = false;
      setspinner(false);
    } else {
      Valid = true;

      if (Valid) {
        get_workrequest_disapproval();
      }
    }
  };

  //APPROVE WORK REQUEST API
  const get_workrequest_approval = async () => {
    let dvc_id = DeviceInfo.getDeviceId();

    let Approve_WorkRequest = {
      site_cd: Site_cd,
      EmpID: EmpID,
      EmpName: EmpName,
      RowID: RowID,
      dvc_id: dvc_id,

      wko_det_assign_to: Box_AssignTo_labe,
      wrk_status: Box_WorkOrderStatus_labe,
      wkr_mst_work_group: Box_WorkGroup_labe,

      LOGINID: LoginID,
    };

    console.log('Approve work Request: ' + JSON.stringify(Approve_WorkRequest));

    try {
      const response = await axios.post( `${Baseurl}/insert_work_request_approval.php?`, JSON.stringify(Approve_WorkRequest), 
      {headers: {'Content-Type': 'application/json'}});
      //console.log('Insert asset response:' + JSON.stringify(response.data));
      if (response.data.status === 'SUCCESS') {
        setspinner(false);
        //setApproval_modalVisible(!Approval_modalVisible);
        // Alert.alert(response.data.status, response.data.message, [
        //   {text: 'OK', onPress: () => _goBack()},
        // ]);

        setAlert(true,'success',response.data.message,'Approve_WRK');

      } else {
        setspinner(false);
        setAlert(true,'danger',response.data.message,'OK');
      }
    } catch (error) {
      setspinner(false);
      alert(error);
    }
  };

  //DISAPPROVE WORK REQUEST API
  const get_workrequest_disapproval = async () => {
    let Disapprove_WorkRequest = {
      site_cd: Site_cd,
      EmpID: EmpID,
      EmpName: EmpName,
      RowID: RowID,
      dis_Dec: Box_DisapproveReason,
      LOGINID: LoginID,
    };

    console.log( 'Disapprove work Request: ' + JSON.stringify(Disapprove_WorkRequest), );
    try {
      const response = await axios.post( `${Baseurl}/insert_work_request_disapproval.php?`, JSON.stringify(Disapprove_WorkRequest), 
      {headers: {'Content-Type': 'application/json'}});

      if (response.data.status === 'SUCCESS') {
        //console.log('Insert asset response:'+ JSON.stringify(response.data.status));
        setspinner(false);
       // setDisapproval_modalVisible(!Disapproval_modalVisible);
        // Alert.alert(response.data.status, response.data.message, [
        //   {text: 'OK', onPress: () => _goBack()},
        // ]);

        setAlert(true,'success',response.data.message,'Disapprove_WRK');

      } else {
        setspinner(false);
        // Alert.alert(response.data.status, response.data.message, [
        //   {text: 'OK'},
        // ]);

        setAlert(true,'danger',response.data.message,'OK');

      }
    } catch (error) {
      setspinner(false);
      alert(error);
    }
  };

  //ASSET SEARCH BOX
  const open_search_asset_box = () => {
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

    setAsset_modalVisible(!Asset_modalVisible);
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
      //alert('Please select at least one criteria to search');
      setAlert(true,'warning','Please select at least one criteria to search','OK');
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
      const response = await axios.post( `${Baseurl}/get_assetmaster_count.php?`, JSON.stringify(Asset_retrieve), );
      //console.log("Asset Master Count Response : " + response.data.status)
      if (response.data.status === 'SUCCESS') {
        console.log('Asset Master Count Response : ' + response.data.status);
        console.log('Asset Master Count Response : ' + response.data.message);
        console.log('Asset Master Count Response : ' + response.data.data);

        if (response.data.data >= 1000) {
          setspinner(false);
          // Alert.alert(
          //   response.data.status,
          //   `The Current Filter return: ${response.data.data} record, it will take some time to download.Do you still want to continue?`,
          //   [
          //     {
          //       text: 'Yes',
          //       onPress: () => {
          //         get_assetmaster();
          //       },
          //     },
          //     {text: 'No'},
          //   ],
          // );

          setAlert_two(true,'warning',`The Current Filter return: ${response.data.data} record, it will take some time to download.Do you still want to continue?`,'Asset_Count')
        } else {
          get_assetmaster();
        }
      } else {
        setspinner(false);
        setAlert(true,'danger',response.data.message,'OK');
      }
    } catch (error) {
      setspinner(false);
      alert(error);
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
      const response = await axios.post(
        `${Baseurl}/get_assetmaster.php?`,
        JSON.stringify(Asset_retrieve),
      );
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
          setAlert(true,'warning',response.data.message,'OK');
        }
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
          <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row'}}>
            <Text style={{ color: '#2962FF', fontSize: 13, backgroundColor: '#D6EAF8', padding: 5, fontWeight: 'bold', }}> {item.ast_mst_asset_no} </Text>
            <Text style={{fontSize: 13, color: '#000'}}> {item.ast_mst_asset_status} </Text>
          </View>

          <View style={{flexDirection: 'row', marginTop: 10}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Description : </Text>
            </View>
            <View style={{flex: 1.5}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.ast_mst_asset_shortdesc} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Cost Center : </Text>
            </View>
            <View style={{flex: 1.5}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.ast_mst_cost_center} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Work Area : </Text>
            </View>
            <View style={{flex: 1.5}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.mst_war_work_area} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Asset Location : </Text>
            </View>

            <View style={{flex: 1.5}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.ast_mst_asset_locn} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Level : </Text>
            </View>
            <View style={{flex: 1.5}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.ast_mst_asset_lvl} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Long Description : </Text>
            </View>
            <View style={{flex: 1.5}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.ast_mst_asset_longdesc} </Text>
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
    setAssetList_modalVisible(!AssetList_modalVisible);
    setAsset_modalVisible(!Asset_modalVisible);

    setAssetNo(item.ast_mst_asset_no);
    setAssetDescription(item.ast_mst_asset_shortdesc);
    setWorkArea_key(item.mst_war_work_area);
    setAssetLocation_key(item.ast_mst_asset_locn);
    setAssetLevel_key(item.ast_mst_asset_lvl);
    setCostCenter_key(item.ast_mst_cost_center);
  };

  //Selection Dropdown
  const select_dropdown = (dropname, data) => {
    //console.log(data);
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
    } else if (dropname === 'Box Employee') {
      settextvalue('Assign Employee');
      setBoxtextvalue(dropname);
    } else if (dropname === 'Box Work Order Status') {
      settextvalue('Work Order Status');
      setBoxtextvalue(dropname);
    } else if (dropname === 'Box Work Group') {
      settextvalue('Work Group');
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
    if (text) {
      let newData;

      if (textvalue == 'Employee' || Boxtextvalue == 'Box Employee') {
        newData = Dropdown_data.filter(function (item) {
          const itemData = `${item.emp_mst_empl_id.toUpperCase()},
            ,${item.emp_mst_title.toUpperCase()}
            ,${item.emp_mst_name.toUpperCase()})`;

          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      } else if (textvalue == 'Original Priority') {
        newData = Dropdown_data.filter(function (item) {
          const itemData = `${item.wrk_pri_pri_cd.toUpperCase()},
            ,${item.wrk_pri_desc.toUpperCase()})`;

          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      } else if (
        textvalue == 'Work Group' ||
        Boxtextvalue == 'Box Work Group'
      ) {
        newData = Dropdown_data.filter(function (item) {
          const itemData = `${item.wrk_grp_grp_cd.toUpperCase()},
            ,${item.wrk_grp_desc.toUpperCase()})`;

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
      } else if (
        textvalue == 'Asset Type' ||
        Boxtextvalue == 'Box Asset Type'
      ) {
        newData = Dropdown_data.filter(function (item) {
          const itemData = `${item.ast_type_cd.toUpperCase()},
            ,${item.ast_type_descs.toUpperCase()})`;

          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      } else if (
        textvalue == 'Asset Group Code' ||
        Boxtextvalue == 'Box Asset Group Code'
      ) {
        newData = Dropdown_data.filter(function (item) {
          const itemData = `${item.ast_grp_grp_cd.toUpperCase()},
            ,${item.ast_grp_desc.toUpperCase()})`;

          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      } else if (
        textvalue == 'Asset Code' ||
        Boxtextvalue == 'Box Asset Code'
      ) {
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
      } else if (textvalue == 'Work Order Status') {
        newData = Dropdown_data.filter(function (item) {
          const itemData = `${item.wrk_sts_typ_cd.toUpperCase()},
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

  //Dropdown Refresh
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);

    if (textvalue == 'Employee') {
      setDropDownFilteredData(Employee);
    } else if (textvalue == 'Original Priority') {
      setDropDownFilteredData(OriginalPriority);
    } else if (textvalue == 'Work Group') {
      setDropDownFilteredData(WorkGroup);
    } else if (textvalue == 'Fault Code') {
      setDropDownFilteredData(FaultCode);
    } else if (textvalue == 'Asset Type' || Boxtextvalue == 'Box Asset Type') {
      setDropDownFilteredData(AssetType);
    } else if ( textvalue == 'Asset Group Code' || Boxtextvalue == 'Box Asset Group Code' ) {
      setDropDownFilteredData(AssetGroupCode);
    } else if (textvalue == 'Asset Code' || Boxtextvalue == 'Box Asset Code') {
      setDropDownFilteredData(Assetcode);
    } else if (textvalue == 'Work Area' || Boxtextvalue == 'Box Work Area') {
      setDropDownFilteredData(WorkArea);
    } else if ( textvalue == 'Asset Location' || Boxtextvalue == 'Box Asset Location' ) {
      setDropDownFilteredData(AssetLocation);
    } else if ( textvalue == 'Asset Level' || Boxtextvalue == 'Box Asset Level' ) {
      setDropDownFilteredData(AssetLevel);
    } else if (textvalue == 'Cost Center') {
      setDropDownFilteredData(CostCenter);
    }

    setRefreshing(false);
  }, [refreshing]);

  //Dropdown XML
  const renderText = item => {
    if (textvalue == 'Employee') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> ID : </Text>
            </View>
            <View style={{flex: 4}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.emp_mst_empl_id} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Name : </Text>
            </View>
            <View style={{flex: 4}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.emp_mst_name} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Title : </Text>
            </View>
            <View style={{flex: 4}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.emp_mst_title} </Text>
            </View>
          </View>
        </View>
      );
    } else if (textvalue == 'Original Priority') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Priority Code : </Text>
            </View>
            <View style={{flex: 1.5}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.wrk_pri_pri_cd} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Description : </Text>
            </View>
            <View style={{flex: 1.5}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.wrk_pri_desc} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Due Date Count : </Text>
            </View>
            <View style={{flex: 1.5}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.wrk_pri_due_date_count} </Text>
            </View>
          </View>
        </View>
      );
    } else if (textvalue == 'Work Group' || Boxtextvalue == 'Box Work Group') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Group Code : </Text>
            </View>
            <View style={{flex: 2}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.wrk_grp_grp_cd} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Description : </Text>
            </View>
            <View style={{flex: 2}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.wrk_grp_desc} </Text>
            </View>
          </View>
        </View>
      );
    } else if (textvalue == 'Fault Code') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Fault Code :
              </Text>
            </View>
            <View style={{flex: 2}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.wrk_flt_fault_cd} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Description : </Text>
            </View>
            <View style={{flex: 2}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.wrk_flt_desc} </Text>
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
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.costcenter} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Description : </Text>
            </View>
            <View style={{flex: 2}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.descs} </Text>
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
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Asset Group Code : </Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.ast_grp_grp_cd} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Asset Group Desc : </Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.ast_grp_desc} </Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Asset No : </Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {option} </Text>
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
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.ast_cod_ast_cd} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Description : </Text>
            </View>
            <View style={{flex: 2}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.ast_cod_desc} </Text>
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
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.mst_war_work_area} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Description : </Text>
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
    } else if (textvalue == 'Work Order Status') {
      return (
        <View style={styles.dropdown_style}>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Status : </Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.wrk_sts_status} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Description : </Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.wrk_sts_desc} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Status Type Code : </Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.wrk_sts_typ_cd} </Text>
            </View>
          </View>

          

         
        </View>
      );
    }else if (Boxtextvalue == 'Box Employee') {
      var colorCD, colorECD, count;
      if (item.TotalWO === 0 || item.TotalWO === '0') {
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

      count = Number(item.TotalWO);
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
              <View style={{ flexDirection: 'column', flex: 5, justifyContent: 'center', marginLeft: 20}}>
                <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.emp_mst_empl_id} </Text>
                <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.emp_mst_name} </Text>
                <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.emp_mst_title} </Text>
              </View>

              <View style={{ flexDirection: 'column', flex: 1, justifyContent: 'center', marginLeft: 20}}>

                <View style={{ padding: 5, alignItems: 'center', alignContent: 'center'}}>
                  <Text placeholder="Test" style={{ color: '#000', fontSize: 13, fontWeight: 'bold', justifyContent: 'center'}}> WO </Text>
                </View>

                <View style={{ backgroundColor: colorCD, padding: 5, borderRadius: 10, alignItems: 'center', alignContent: 'center'}}>
                  <Text placeholder="Test" style={{ color: '#fff', fontSize: 13, fontWeight: 'bold', justifyContent: 'center'}}> {count} </Text>
                </View>

              </View>
            </View>
          </View>
        </View>
      );
    }
  };

  //Dropdown View
  const Dropdown_ItemView = ({item}) => {
    return (
      <TouchableOpacity onPress={() => getItem(item)}>
        {renderText(item)}
      </TouchableOpacity>
    );
  };

  //Dropdown Serparator line
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

  //SELECT Dropdown ITEM
  const getItem = item => {
    // Function for click on an item
    //alert('Id : ' + JSON.stringify(item) );

    if (textvalue == 'Employee') {

      setEmployee_key(item.emp_mst_empl_id + ' : ' + item.emp_mst_name);

      
    } else if (textvalue == 'Original Priority') {
      setOrgPriority_key(item.wrk_pri_pri_cd + ' : ' + item.wrk_pri_desc);

      var count = item.wrk_pri_due_date_count;
      setOrgCount(count);

      let days = count / 1440;
      let hours = (count % 1440) / 60;
      let mins = count % 60;

      var date = new Date(OrgDate);
      date.setDate(date.getDate() + days);

      let plandate = moment(date).format('yyyy-MM-DD');
      setDueDate(plandate);
    } else if (textvalue == 'Work Group') {
      if (Boxtextvalue == 'Box Work Group') {
        setBox_WorkGroup(item.wrk_grp_grp_cd + ' : ' + item.wrk_grp_desc);
        setBox_WorkGroup_labe(item.wrk_grp_grp_cd);
      } else {
        setWorkGroup_key(item.wrk_grp_grp_cd + ' : ' + item.wrk_grp_desc);
      }
    } else if (textvalue == 'Fault Code') {
      setFaultCode_key(item.wrk_flt_fault_cd + ' : ' + item.wrk_flt_desc);
      setWorkOrderDescription(item.wrk_flt_desc);
    } else if (textvalue == 'Cost Center') {
      setCostCenter_key(item.costcenter + ' : ' + item.descs);
    } else if (textvalue == 'Asset Group Code') {
      if (Boxtextvalue == 'Box Asset Group Code') {
        setBox_AssetGroupCode(item.ast_grp_grp_cd + ' : ' + item.ast_grp_desc);
        setBox_AssetGroupCode_label(item.ast_grp_grp_cd);
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
      setBox_AssetType_label(item.wrk_sts_status);
    } else if (textvalue == 'Work Order Status') {
      setBox_WorkOrderStatus(item.wrk_sts_typ_cd + ' : ' + item.wrk_sts_desc);
      setBox_WorkOrderStatus_labe(item.wrk_sts_status);
    }else if (Boxtextvalue == 'Box Employee') {
      setBox_AssignTo(item.emp_mst_empl_id + ' : ' + item.emp_mst_name);
      setBox_AssignTo_labe(item.emp_mst_empl_id);
    } 

    setDropDown_search('');
    setDropDown_modalVisible(!DropDown_modalVisible);
  };

  //Attachement File
  const onDelete = value => {
    console.log(value);

    if (value.imagetype == 'New') {
      // Alert.alert('Delet Image', 'Do you want to delete this image?', [
      //   {
      //     text: 'NO',
      //     onPress: () => console.log('Cancel Pressed'),
      //     style: 'cancel',
      //   },
      //   {text: 'YES', onPress: () => DeleteNewImage(value)},
      // ]);

      setAlert_two(true,'delete','Do you want to delete this image?','DeleteNewImage',value)

    } else {
      // Alert.alert('Delet Image', 'Do you want to delete this image?', [
      //   {
      //     text: 'NO',
      //     onPress: () => console.log('Cancel Pressed'),
      //     style: 'cancel',
      //   },
      //   {text: 'YES', onPress: () => DeleteImage(value)},
      // ]);

      setAlert_two(true,'delete','Do you want to delete this image?','DeleteImage',value)
    }
  };

  //Delete Attachement File
  const DeleteNewImage = value => {
    const data = Attachments_List.filter(
      item =>
        item?.localIdentifier &&
        item?.localIdentifier !== value?.localIdentifier,
    );
    setAttachments_List(data);
  };

  const DeleteImage = async value => {
    console.log('VALUE IMG', value.rowid);
    setspinner(true);

    try {
      console.log( 'Delete Image API : ' + `${Baseurl}/delete_asset_attachment_file.php?site_cd=${Site_cd}&RowID=${value.rowid}`, );
      const response = await axios.get( `${Baseurl}/delete_asset_attachment_file.php?site_cd=${Site_cd}&RowID=${value.rowid}`, );

      //console.log('JSON DATA : ' + response.data.status);

      if (response.data.status === 'SUCCESS') {
        // Alert.alert(response.data.status, response.data.message, [
        //   {
        //     text: 'OK',
        //     onPress: () => {
        //       const data = Attachments_List.filter(
        //         item =>
        //           item?.localIdentifier &&
        //           item?.localIdentifier !== value?.localIdentifier,
        //       );
        //       setAttachments_List(data);
        //     },
        //   },
        // ]);

         setAlert(true,'success',response.data.message,'Delete_IMG');

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

  const Attachments_ItemView = ({item}) => {
    // console.log('ITEM:' + JSON.stringify(item));

    const type = item.type.split('/');
    console.log('loop type', type[0]);

    return (
      //   <TouchableOpacity >
      //     <View style={{flex: 1,backgroundColor: '#fff',borderRadius: 10,margin:10}}>
      //         <Image style={{width: 150,height: 150,margin:10}}
      //             source={ {uri: item.path}}/>

      //     </View>
      //   </TouchableOpacity>

      <View style={{flex: 1,backgroundColor: '#fff', borderRadius: 10, margin: 10,alignItems: 'center'}}>
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
    console.log(item);

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
    console.log('show:', item.path);


    const type = item.type.split('/');
    console.log('type',type[0]);
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
        //alert('Please Select Original Priority');
        setAlert(true,'warning','Please Select Original Priority','OK');
        
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
        //alert('Please Select Original Priority');
        setAlert(true,'warning','Please Select Original Priority','OK');
      } else {
        let select_dueDate = moment(date).format('yyyy-MM-DD');
        setDueDate(select_dueDate);
      }
    } else if (Type === 'Box-from') {
      let select_box_fromDate = moment(date).format('yyyy-MM-DD');
      setBox_FromDate(select_box_fromDate);
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
        //alert('Please Select Original Priority');
        setAlert(true,'warning','Please Select Original Priority','OK');
      } else {
        let select_OrgTime = moment(date).format('HH:mm');
        setOrgTime(select_OrgTime);
      }
    } else if (Type === 'to') {
      if (!OrgPriority_key) {
        //alert('Please Select Original Priority');
        setAlert(true,'warning','Please Select Original Priority','OK');
      } else {
        let select_dueTime = moment(date).format('HH:mm');
        setDueTime(select_dueTime);
      }
    }

    hideTimePicker();
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

    console.log('DD',D)

    if(D === 'OK'){

      setShow(false)

    }else if(D === 'Approve_WRK'){

      setShow(false)
      setApproval_modalVisible(!Approval_modalVisible);

      _goBack()

    }else if(D === 'Disapprove_WRK'){

      setShow(false)
      setDisapproval_modalVisible(!Disapproval_modalVisible)
      _goBack()

    }else if (D ==='Delete_IMG'){

      setShow(false)

        const data = Attachments_List.filter(
          item =>
            item?.localIdentifier &&
            item?.localIdentifier !== ImgValue?.localIdentifier,
        );
        setAttachments_List(data);

    }

  }

  const Alret_onClick =(D) =>{

    setShow_two(false)

    if(D === 'DeleteNewImage'){

      DeleteNewImage(ImgValue)

    } else if(D === 'DeleteImage'){

      DeleteImage(ImgValue)

    }else if(D === 'Asset_Count'){

      get_assetmaster();

    }    

  }

  return (

    <DismissKeyboard>
        <SafeAreaProvider>
          <Appbar.Header style={{backgroundColor: '#42A5F5'}}>
              <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
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
            <SCLAlertButton theme={Theme}   onPress={()=>One_Alret_onClick(AlertType)}>OK</SCLAlertButton>
          </SCLAlert>


          <SCLAlert theme={Theme} show={Show_two} title={Title} >
            <SCLAlertButton theme={Theme}  onPress={()=>Alret_onClick(AlertType)}>Yes</SCLAlertButton>
            <SCLAlertButton theme="default" onPress={()=>setShow_two(false)}>No</SCLAlertButton>
          </SCLAlert>

        <DateTimePicker isVisible={isDatepickerVisible} mode="date" locale="en_GB" onConfirm={handleConfirm} onCancel={hideDatePicker} />

        <DateTimePicker isVisible={isTimepickerVisible} mode="time" locale="en_GB" onConfirm={Time_handleConfirm} onCancel={hideTimePicker} />

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

            <View style={styles.model_cardview}>
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
                    <View style={styles.view_style}>
                    <TextInput
                        value={Box_AssetNo}
                        style={[ styles.input, { height: Math.max( Platform.OS === 'ios' ? 50 : 50, height ) } ]}
                        inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'} ]}
                        labelStyle={styles.labelStyle}
                        placeholderStyle={{ fontSize: 15, color: '#0096FF' }}
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
                        style={[ styles.input, { height: Math.max( Platform.OS === 'ios' ? 50 : 50, height ) } ]}
                        inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'} ]}
                        labelStyle={styles.labelStyle}
                        placeholderStyle={{ fontSize: 15, color: '#0096FF' }}
                        onContentSizeChange={event =>
                         setHeight(event.nativeEvent.contentSize.height)
                        }
                        textErrorStyle={styles.textErrorStyle}
                        label="Description"
                        clearButtonMode="always"
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
                        onPress={() => select_dropdown('Box Asset Type', AssetType)}
                        onLongPress={() => setBox_AssetType('')}>
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
                                onPress={() =>
                                Box_AssetType
                                    ? setBox_AssetType('')
                                    : select_dropdown('Box Asset Type', AssetType)
                                }
                            />
                            )}
                        />
                        </View>
                    </Pressable>
                    </View>

                    {/* Asset GroupCode*/}
                    <View style={styles.view_style}>
                    <Pressable
                        onPress={() =>
                        select_dropdown('Box Asset Group Code', AssetGroupCode)
                        }
                        onLongPress={() => setBox_AssetGroupCode('')}>
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
                                onPress={() =>
                                Box_AssetGroupCode
                                    ? setBox_AssetGroupCode('')
                                    : select_dropdown(
                                        'Box Asset Group Code',
                                        AssetGroupCode,
                                    )
                                }
                            />
                            )}
                        />
                        </View>
                    </Pressable>
                    </View>

                    {/* Asset Code*/}
                    <View style={styles.view_style}>
                    <Pressable
                        onPress={() => select_dropdown('Box Asset Code', Assetcode)}
                        onLongPress={() => setBox_AssetCode('')}>
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
                                onPress={() =>
                                Box_AssetCode
                                    ? setBox_AssetCode('')
                                    : select_dropdown('Box Asset Code', Assetcode)
                                }
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
                        onLongPress={() => setBox_WorkArea('')}>
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
                                onPress={() =>
                                Box_WorkArea
                                    ? setBox_WorkArea('')
                                    : select_dropdown('Box Work Area', WorkArea)
                                }
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
                        onLongPress={() => setBox_AssetLocation('')}>
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
                                onPress={() =>
                                Box_AssetLocation
                                    ? setBox_AssetLocation('')
                                    : select_dropdown(
                                        'Box Asset Location',
                                        AssetLocation,
                                    )
                                }
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
                        onLongPress={() => setBox_AssetLevel('')}>
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
                                onPress={() =>
                                Box_AssetLevel
                                    ? setBox_AssetLevel('')
                                    : select_dropdown('Box Asset Level', AssetLevel)
                                }
                            />
                            )}
                        />
                        </View>
                    </Pressable>
                    </View>

                    <TouchableOpacity
                    style={{
                        width: '100%',
                        height: 50,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#42A5F5',
                        marginTop: 10,
                    }}
                    onPress={get_assetmaster_count}>
                    <Text
                        style={{color: 'white', fontSize: 15, fontWeight: 'bold'}}>
                        Retrieve
                    </Text>
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
            onRequestClose={() => {
           //Alert.alert('Closed');
            setDropDown_modalVisible(!DropDown_modalVisible);
            }}>
            <View style={styles.model2_cardview}>
            <View style={{flex: 1, margin: 20, backgroundColor: '#FFFFFF'}}>
                <View
                style={{flexDirection: 'row', alignItems: 'center', height: 50}}>
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
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
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
              setZoomAttachments_modalVisible(!ZoomAttachments_modalVisible); }}>
            <View style={styles.model_cardview}>
              <View style={{ flex: 1,backgroundColor: '#FFFFFF'}}>
                

                {
                  //Type_link === 'image' && <Image width={IMAGE_WIDTH} resizeMode="contain"  source={{uri: link}} style={{alignSelf: 'center', height:'100%', width:'100%', margin: 10,}}/> ||
                  Type_link === 'image' && 

                  <ImageViewer 
                    imageUrls={images_link} 
                    style={{flex: 1}} 
                    onSwipeDown={() =>  setZoomAttachments_modalVisible(!ZoomAttachments_modalVisible)}
                    onClick={()=>  setZoomAttachments_modalVisible(!ZoomAttachments_modalVisible)} 
                    enableSwipeDown={true}/>

                  ||


                  Type_link === 'video' &&  
                  
                  <View style={{flex: 1}}>

                    <Appbar.Header style={{backgroundColor: '#000'}}>
                        <View style={{ flex: 1,alignItems:'flex-end'}}>
                          
                            <AntDesign style={{marginRight:20}} color="#fff" name={'close'} size={25} onPress={() =>  setZoomAttachments_modalVisible(!ZoomAttachments_modalVisible) } />
                          
                        </View>
                      </Appbar.Header>

                    <Video 
                          source={{uri: link}} 
                          
                          //ref={ref => (videoPlayer.current = ref)}
                      // the video file
                        
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
                          
                            <AntDesign style={{marginRight:20}} color="#fff" name={'close'} size={25} onPress={() =>  setZoomAttachments_modalVisible(!ZoomAttachments_modalVisible) } />
                          
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

        {/* Approval Modal */}
        <Modal
            animationType="slide"
            transparent={true}
            visible={Approval_modalVisible}
            onRequestClose={() => {
           //Alert.alert('Closed');
            setApproval_modalVisible(!Approval_modalVisible);
            }}>
              <ProgressLoader visible={spinner} isModal={true} isHUD={true} hudColor={'#808080'} color={'#FFFFFF'} />

              <SCLAlert theme={Theme} show={Show} title={Title}>
                <SCLAlertButton theme={Theme}   onPress={()=>One_Alret_onClick(AlertType)}>OK</SCLAlertButton>
              </SCLAlert>


              <SCLAlert theme={Theme} show={Show_two} title={Title} >
                <SCLAlertButton theme={Theme}  onPress={()=>Alret_onClick(AlertType)}>Yes</SCLAlertButton>
                <SCLAlertButton theme="default" onPress={()=>setShow_two(false)}>No</SCLAlertButton>
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
                <View style={{ flex: 1, backgroundColor: '#FFFFFF',margin:20}}>

                  <Appbar.Header style={{backgroundColor: '#FFFFFF'}}>

                    <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={{ flex: 1, fontSize: 15, justifyContent: 'center', textAlign: 'center', color: '#000', fontWeight: 'bold', }}> {textvalue} </Text>
                      <Ionicons name="close" color="red" size={30} style={{marginEnd: 15}} onPress={() => setDropDown_modalVisible(!DropDown_modalVisible) } />
                    </View>
                    
                  </Appbar.Header>
                  

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

            <View style={styles.model_cardview}>
              <View style={{height: '50%',margin: 20, backgroundColor: '#FFFFFF'}}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#0096FF', height: 50}}>
                  <Text style={{ flex: 1, fontSize: 15, justifyContent: 'center', color: '#fff', margin: 5, textAlign: 'center', fontWeight: 'bold', }}> Approval Work Request </Text>
                  <Ionicons
                      name="close"
                      color="#ffffffff"
                      size={25}
                      style={{marginEnd: 15}}
                      onPress={() => setApproval_modalVisible(!Approval_modalVisible)}
                  />
                  </View>

                  
                  <View style={{flex: 1,marginTop: 10}}>
                      {/*Employee*/}
                      <View style={{margin:10}}>
                        <Pressable
                            onPress={ () => select_dropdown('Box Employee', AssignTo_Employee) }
                            onLongPress={() => setBox_AssignTo('')}>
                            <View pointerEvents={'none'}>
                              <TextInput
                                  value={Box_AssignTo}
                                  style={[ styles.input, { height: Math.max( Platform.OS === 'ios' ? 50 : 50, height)}]}
                                  inputStyle={[ styles.inputStyle, {color: Editable ? '#000' : '#000'}]}
                                  labelStyle={styles.labelStyle}
                                  placeholderStyle={{ fontSize: 15, color: '#0096FF'}}
                                  onContentSizeChange={event => setHeight(event.nativeEvent.contentSize.height)}
                                  textErrorStyle={styles.textErrorStyle}
                                  // onPressOut={()=>{!Editable ? select_dropdown("Asset Group Code",AssetGroupCode) : ''}}
                                  label="Assign To"
                                  focusColor="#808080"
                                  renderRightIcon={() => (
                                  <AntDesign
                                      style={styles.icon}
                                      color={'black'}
                                      name={Box_AssignTo ? 'close' : 'search1'}
                                      size={22}
                                      disable={true}
                                      onPress={() =>
                                      Box_AssignTo
                                          ? setAssetGroupCode_key('')
                                          : select_dropdown('Box Employee', AssignTo_Employee)
                                      }
                                  />
                                  )}
                              />
                            </View>
                        </Pressable>
                      </View>

                      {/* Work Order Status*/}
                      <View style={{margin:10}}>
                      <Pressable
                          onPress={() => select_dropdown('Box Work Order Status', WorkOrderStatus) }
                          onLongPress={() => setBox_WorkOrderStatus('')}>
                          <View pointerEvents={'none'}>
                          <TextInput
                              value={Box_WorkOrderStatus}
                              style={[ styles.input, { height: Math.max( Platform.OS === 'ios' ? 50 : 50, height)}]}
                              inputStyle={[ styles.inputStyle, {color: Editable ? '#000' : '#000'}]}
                              labelStyle={styles.labelStyle}
                              placeholderStyle={{ fontSize: 15, color: '#0096FF'}}
                              onContentSizeChange={event => setHeight(event.nativeEvent.contentSize.height)}
                              textErrorStyle={styles.textErrorStyle}
                              label="Work Order Status"
                              focusColor="#808080"
                              editable={false}
                              selectTextOnFocus={false}
                              renderRightIcon={() => (
                              <AntDesign
                                  style={styles.icon}
                                  color={'black'}
                                  name={Box_WorkOrderStatus ? 'close' : 'search1'}
                                  size={22}
                                  disable={true}
                                  onPress={() =>
                                  Box_WorkOrderStatus
                                      ? setBox_WorkOrderStatus('')
                                      : select_dropdown(
                                          'Box Work Order Status',
                                          WorkOrderStatus,
                                      )
                                  }
                              />
                              )}
                          />
                          </View>
                      </Pressable>
                      </View>

                      {/* Work Group*/}
                      <View style={{margin:10}}>
                      <Pressable
                          onPress={() => select_dropdown('Box Work Group', WorkGroup)}
                          onLongPress={() => setBox_WorkGroup('')}>
                          <View pointerEvents={'none'}>
                          <TextInput
                              value={Box_WorkGroup}
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
                              {color: Editable ? '#000' : '#000'},
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
                              label="Work Group"
                              placeholderTextColor="gray"
                              focusColor="#808080"
                              editable={false}
                              selectTextOnFocus={false}
                              renderRightIcon={() => (
                              <AntDesign
                                  style={styles.icon}
                                  color={'black'}
                                  name={Box_WorkGroup ? 'close' : 'search1'}
                                  size={22}
                                  disable={true}
                                  onPress={() =>
                                  Box_WorkGroup
                                      ? setWorkGroup_key('')
                                      : select_dropdown('Box Work Group', WorkGroup)
                                  }
                              />
                              )}
                          />
                          </View>
                      </Pressable>
                      </View>

                      <TouchableOpacity
                        style={{ width: '100%', height: 50, alignItems: 'center', justifyContent: 'center', backgroundColor: '#8BC34A', marginTop: 10,position: 'absolute', bottom: 0,}}
                        onPress={Approve}>
                        <Text style={{color: 'white', fontSize: 15, fontWeight: 'bold'}}> OK </Text>
                      </TouchableOpacity>
                  </View>
                  
              </View>
            </View>
        </Modal>

        {/* Disapproval Modal */}
        <Modal
            animationType="slide"
            transparent={true}
            visible={Disapproval_modalVisible}
            onRequestClose={() => { setDisapproval_modalVisible(!Disapproval_modalVisible)}}>

            <ProgressLoader visible={spinner} isModal={true} isHUD={true} hudColor={'#808080'} color={'#FFFFFF'} />


            <SCLAlert theme={Theme} show={Show} title={Title}>
              <SCLAlertButton theme={Theme}   onPress={()=>One_Alret_onClick(AlertType)}>OK</SCLAlertButton>
            </SCLAlert>


            <SCLAlert theme={Theme} show={Show_two} title={Title} >
              <SCLAlertButton theme={Theme}  onPress={()=>Alret_onClick(AlertType)}>Yes</SCLAlertButton>
              <SCLAlertButton theme="default" onPress={()=>setShow_two(false)}>No</SCLAlertButton>
            </SCLAlert>

            <DismissKeyboard>
              <View style={styles.model_cardview}>
                <View style={{margin: 20, backgroundColor: '#FFFFFF'}}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#0096FF', height: 50, }}>
                    <Text style={{ flex: 1, fontSize: 15, justifyContent: 'center', color: '#fff', margin: 5, textAlign: 'center', fontWeight: 'bold', }}> Disapproval Work Request </Text>
                    <Ionicons name="close" color="#ffffffff" size={25} style={{marginEnd: 15}} onPress={() => setDisapproval_modalVisible(!Disapproval_modalVisible) } />
                  </View>

                <ScrollView>
                <View style={{marginTop: 10}}>
                    {/* Work Order Description */}
                    <View style={styles.view_style}>
                      <TextInput
                          value={Box_DisapproveReason}
                          style={[ styles.input, { height: Math.max( Platform.OS === 'ios' ? 150 : 150, height)}]}
                          multiline={true}
                          numberOfLines={4}
                          inputStyle={[ styles.inputStyle, {color: Editable ? '#000' : '#000'}, ]}
                          labelStyle={styles.labelStyle}
                          placeholderStyle={{ fontSize: 15, color: '#0096FF', }}
                          textErrorStyle={styles.textErrorStyle}
                          label="Disapprove Reason"
                          placeholderTextColor="gray"
                          focusColor="#808080"
                          onChangeText={text => { setBox_DisapproveReason(text); }}
                      />
                    </View>

                    <TouchableOpacity
                      style={{ width: '100%', height: 50, alignItems: 'center', justifyContent: 'center', backgroundColor: 'green', marginTop: 10, }}
                      onPress={Disapprove}>
                      <Text style={{color: 'white', fontSize: 15, fontWeight: 'bold'}}> OK </Text>
                    </TouchableOpacity>
                </View>
                </ScrollView>
            </View>
            </View>

            </DismissKeyboard>
        </Modal>

        <View style={{flex: 1, marginBottom: visible_bottomView ? 60 : 0}}>
            <FlatList
            ListHeaderComponent={
                <View style={styles.container}>
                {/* REQUESTER INFORMATION */}
                <Pressable>
                <View style={styles.card}>
                    <View style={styles.card_heard}>
                    <Text style={styles.card_heard_text}> REQUESTER INFORMATION </Text>
                    </View>

                    {/*Employee*/}
                    <View style={styles.view_style}>
                    <Pressable
                        onPress={
                        () =>
                            !Editable ? select_dropdown('Employee', Employee) : ''

                        //!Editable ? console.log("EE1"+Editable) : console.log("EE2"+Editable)
                        }
                        onLongPress={() => setEmployeekey('')}>
                        <View pointerEvents={'none'}>
                        <TextInput
                            value={Employee_key}
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
                            // onPressOut={()=>{!Editable ? select_dropdown("Asset Group Code",AssetGroupCode) : ''}}
                            label="Name"
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
                                name={Employee_key ? 'close' : 'search1'}
                                size={22}
                                disable={true}
                                onPress={() =>
                                    Employee_key
                                    ? setAssetGroupCode_key('')
                                    : select_dropdown('Employee', Employee)
                                }
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
                        textErrorStyle={styles.textErrorStyle}
                        label="Phone No"
                        placeholderTextColor="gray"
                        focusColor="#808080"
                        editable={!Editable}
                        selectTextOnFocus={!Editable}
                        onChangeText={text => {
                        setPhoneNo(text);
                        }}
                        renderRightIcon={() =>
                        Editable ? (
                            ''
                        ) : (
                            <AntDesign
                            style={styles.icon}
                            color={'black'}
                            name={'close'}
                            size={22}
                            disable={true}
                            onPress={() => (Employee_key ? setPhoneNo('') : '')}
                            />
                        )
                        }
                    />
                    </View>
                </View>

                {/* WORK REQUEST INFORMATION */}
                <View style={styles.card}>
                    <View style={styles.card_heard}>
                    <Text style={styles.card_heard_text}>
                        WORK REQUEST INFORMATION
                    </Text>
                    </View>

                    {/* WorkRequestNo */}
                    <View style={styles.view_style}>
                    <TextInput
                        value={WorkRequestNo}
                        style={[styles.input, {height: 50}]}
                        inputStyle={[
                        styles.inputStyle,
                        {
                            color: WorkRequestNo_editable
                            ? WorkRequestNo
                                ? '#808080'
                                : '#000'
                            : WorkRequestNo
                            ? '#808080'
                            : '#000',
                        },
                        ]}
                        labelStyle={styles.labelStyle}
                        placeholderStyle={{
                        fontSize: 15,
                        color: WorkRequestNo_editable ? '#0096FF' : '#808080',
                        }}
                        textErrorStyle={styles.textErrorStyle}
                        label="Work Request No"
                        placeholderTextColor="gray"
                        focusColor="#808080"
                        editable={WorkRequestNo_editable}
                        selectTextOnFocus={WorkRequestNo_editable}
                        onChangeText={text => {
                        setWorkRequestNo(text);
                        }}
                        renderRightIcon={() =>
                        !WorkRequestNo_editable ? (
                            ''
                        ) : (
                            <AntDesign
                            style={styles.icon}
                            name={Assetno ? 'close' : 'search1'}
                            size={20}
                            disable={true}
                            onPress={() =>
                                WorkRequestNo ? setWorkRequestNo() : ''
                            }
                            />
                        )
                        }
                    />
                    </View>

                    {/* Original Priority */}
                    <View style={styles.view_style}>
                    <Pressable
                        onPress={() =>
                        !Editable
                            ? select_dropdown('Original Priority', OriginalPriority)
                            : ''
                        }
                        onLongPress={() => setOrgPriority_key('')}>
                        <View pointerEvents={'none'}>
                        <TextInput
                            value={OrgPriority_key}
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
                            //onTouchStart={()=>{!Editable ? select_dropdown("Asset Status",AssetStatus) : ''}}
                            label="Original Priority"
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

                    <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                    }}>
                    {/* From Date */}
                    <View style={styles.view_style}>
                        <Pressable
                        onPress={() => (!Editable ? showDatePicker('from') : '')}
                        onLongPress={() => setWR_fromdate('')}>
                        <View pointerEvents={'none'}>
                            <TextInput
                            value={OrgDate}
                            style={[styles.input]}
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
                            label="Origination Date"
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

                    {/* To Date */}
                    <View style={styles.view_style}>
                        <Pressable
                        onPress={() => (!Editable ? showDatePicker('to') : '')}
                        onLongPress={() => setWR_todate('')}>
                        <View pointerEvents={'none'}>
                            <TextInput
                            value={DueDate}
                            style={styles.input}
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
                            label="Due Date"
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

                    <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                    }}>
                    {/* From Date */}
                    <View style={styles.view_style}>
                        <Pressable
                        onPress={() => (!Editable ? showTimePicker('from') : '')}
                        onLongPress={() => setWR_fromdate('')}>
                        <View pointerEvents={'none'}>
                            <TextInput
                            value={OrgTime}
                            style={[styles.input]}
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
                            label="Origination Time"
                            placeholderTextColor="gray"
                            focusColor="#808080"
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
                        onLongPress={() => setWR_todate('')}>
                        <View pointerEvents={'none'}>
                            <TextInput
                            value={DueTime}
                            style={styles.input}
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
                            label="Due Time"
                            placeholderTextColor="gray"
                            focusColor="#808080"
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
                        !Editable ? select_dropdown('Work Group', WorkGroup) : ''
                        }
                        onLongPress={() => setWorkGroup_key('')}>
                        <View pointerEvents={'none'}>
                        <TextInput
                            value={WorkGroup_key}
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
                            label="Work Group"
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

                    {/* Fault Code*/}
                    <View style={styles.view_style}>
                    <Pressable
                        onPress={() =>
                        !Editable ? select_dropdown('Fault Code', FaultCode) : ''
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
                        label="Work Request Description"
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
                            color={'black'}
                            name={'close'}
                            size={22}
                            disable={true}
                            onPress={() =>
                                Employee_key ? setWorkOrderDescription('') : ''
                            }
                            />
                        )
                        }
                    />
                    </View>
                </View>

                {/* ASSET INFORMATION */}
                <View style={styles.card}>
                    <View style={styles.card_heard}>
                    <Text style={styles.card_heard_text}>ASSET INFORMATION</Text>
                    </View>

                    {/* Asset No */}
                    <View style={styles.view_style}>
                    <Pressable
                        onPress={() => (!Editable ? open_search_asset_box() : '')}
                        onLongPress={() => setAssetNo('')}>
                        <View pointerEvents={'none'}>
                        <TextInput
                            value={AssetNo}
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
                            {color: Editable ? '#808080' : '#808080'},
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
                            //onTouchStart={()=>{!Editable ? select_dropdown("Work Area",WorkArea) : ''}}
                            label="Asset No"
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
                                name={AssetNo ? 'close' : 'search1'}
                                size={22}
                                disable={true}
                                onPress={() =>
                                    AssetNo
                                    ? setAssetNo('')
                                    : open_search_asset_box()
                                }
                                />
                            )
                            }
                        />
                        </View>
                    </Pressable>
                    </View>

                    {/* Asset Description */}
                    <View style={styles.view_style}>
                    <TextInput
                        value={AssetDescription}
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
                        onContentSizeChange={event =>
                        setHeight(event.nativeEvent.contentSize.height)
                        }
                        textErrorStyle={styles.textErrorStyle}
                        label="Description"
                        placeholderTextColor="gray"
                        clearButtonMode="always"
                        editable={!Editable}
                        selectTextOnFocus={!Editable}
                        focusColor="#808080"
                        onChangeText={text => {
                        setAssetDescription(text);
                        }}
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

                    {/* Work Area*/}
                    <View style={styles.view_style}>
                    <Pressable
                        onPress={() =>
                        !Editable ? select_dropdown('Work Area', WorkArea) : ''
                        }
                        onLongPress={() => setWorkArea_key('')}>
                        <View pointerEvents={'none'}>
                        <TextInput
                            value={WorkArea_key}
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
                            //onTouchStart={()=>{!Editable ? select_dropdown("Work Area",WorkArea) : ''}}
                            label="Work Area"
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
                        onPress={() =>
                        !Editable
                            ? select_dropdown('Asset Location', AssetLocation)
                            : ''
                        }
                        onLongPress={() => setAssetLocation_key('')}>
                        <View pointerEvents={'none'}>
                        <TextInput
                            value={AssetLocation_key}
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
                            // onTouchStart={()=>{!Editable ? select_dropdown("Asset Location",AssetLocation) : ''}}

                            label="Asset Location"
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
                        onPress={() =>
                        !Editable
                            ? select_dropdown('Asset Level', AssetLevel)
                            : ''
                        }
                        onLongPress={() => setAssetLevel_key('')}>
                        <View pointerEvents={'none'}>
                        <TextInput
                            value={AssetLevel_key}
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
                            //onTouchStart={()=>{!Editable ? select_dropdown("Asset Level",AssetLevel) : ''}}

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
                        onPress={() =>
                        !Editable
                            ? select_dropdown('Cost Center', CostCenter)
                            : ''
                        }
                        onLongPress={() => setCostCenter_key('')}>
                        <View pointerEvents={'none'}>
                        <TextInput
                            value={CostCenter_key}
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
                            label="Cost Center"
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

                {/* APPROVE DETAIL */}
                <View
                    style={[
                    styles.card,
                    {display: visible_ApprovalBox ? 'flex' : 'none'},
                    ]}>
                    <View style={styles.card_heard}>
                    <Text style={styles.card_heard_text}>APPROVE DETAIL</Text>
                    </View>

                    {/* Approval By */}
                    <View style={[styles.view_style]}>
                    <TextInput
                        value={ApprovalBy}
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
                        textErrorStyle={styles.textErrorStyle}
                        label="Approval By"
                        placeholderTextColor="gray"
                        focusColor="#808080"
                        editable={false}
                        selectTextOnFocus={false}
                        onChangeText={text => {
                        setApprovalBy(text);
                        }}
                        renderRightIcon={() =>
                        Editable ? (
                            ''
                        ) : (
                            <AntDesign
                            style={styles.icon}
                            color={'black'}
                            name={ApprovalBy ? 'close' : 'search1'}
                            size={22}
                            disable={true}
                            onPress={() => (ApprovalBy ? setApprovalBy('') : '')}
                            />
                        )
                        }
                    />
                    </View>

                    {/* Approval Date */}
                    <View style={[styles.view_style]}>
                    <TextInput
                        value={ApprovalDate}
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
                        textErrorStyle={styles.textErrorStyle}
                        label="Approval Date"
                        placeholderTextColor="gray"
                        focusColor="#808080"
                        editable={false}
                        selectTextOnFocus={false}
                        onChangeText={text => {
                        setApprovalDate(text);
                        }}
                        renderRightIcon={() =>
                        Editable ? (
                            ''
                        ) : (
                            <AntDesign
                            style={styles.icon}
                            color={'black'}
                            name={ApprovalDate ? 'close' : 'search1'}
                            size={22}
                            disable={true}
                            onPress={() =>
                                ApprovalDate ? setApprovalDate('') : ''
                            }
                            />
                        )
                        }
                    />
                    </View>

                    {/* Work Order No*/}
                    <View style={[styles.view_style]}>
                    <TextInput
                        value={WorkOrderNo}
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
                        textErrorStyle={styles.textErrorStyle}
                        label="Work Order No"
                        focusColor="#808080"
                        editable={false}
                        selectTextOnFocus={false}
                        onChangeText={text => {
                        setWorkOrderNo(text);
                        }}
                        renderRightIcon={() =>
                        Editable ? (
                            ''
                        ) : (
                            <AntDesign
                            style={styles.icon}
                            color={'black'}
                            name={WorkOrderNo ? 'close' : 'search1'}
                            size={22}
                            disable={true}
                            onPress={() =>
                                WorkOrderNo ? setWorkOrderNo('') : ''
                            }
                            />
                        )
                        }
                    />
                    </View>

                    {/* Work Order Status*/}
                    <View style={[styles.view_style]}>
                    <TextInput
                        value={WorkOrderStatus_key}
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
                        textErrorStyle={styles.textErrorStyle}
                        label="Work Request Status"
                        focusColor="#808080"
                        editable={false}
                        selectTextOnFocus={false}
                        onChangeText={text => {
                        setWorkOrderStatus_key(text);
                        }}
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
                                : ''
                            }
                            />
                        )
                        }
                    />
                    </View>
                </View>

                {/* DISAPPROVE DETAIL */}
                <View
                    style={[
                    styles.card,
                    {display: visible_DisApprovalBox ? 'flex' : 'none'},
                    ]}>
                    <View style={styles.card_heard}>
                    <Text style={styles.card_heard_text}>DISAPPROVE DETAIL</Text>
                    </View>

                    {/* Rejected By */}
                    <View style={[styles.view_style]}>
                    <TextInput
                        value={RejectedBy}
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
                        textErrorStyle={styles.textErrorStyle}
                        label="Rejected By"
                        focusColor="#808080"
                        editable={false}
                        selectTextOnFocus={false}
                        onChangeText={text => {
                        setRejectedBy(text);
                        }}
                        renderRightIcon={() =>
                        Editable ? (
                            ''
                        ) : (
                            <AntDesign
                            style={styles.icon}
                            color={'black'}
                            name={RejectedBy ? 'close' : 'search1'}
                            size={22}
                            disable={true}
                            onPress={() => (RejectedBy ? setRejectedBy('') : '')}
                            />
                        )
                        }
                    />
                    </View>

                    {/* Rejected Date */}
                    <View style={[styles.view_style]}>
                    <TextInput
                        value={RejectedDate}
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
                        textErrorStyle={styles.textErrorStyle}
                        label="Rejected Date"
                        focusColor="#808080"
                        editable={false}
                        selectTextOnFocus={false}
                        onChangeText={text => {
                        setRejectedDate(text);
                        }}
                        renderRightIcon={() =>
                        Editable ? (
                            ''
                        ) : (
                            <AntDesign
                            style={styles.icon}
                            color={'black'}
                            name={RejectedDate ? 'close' : 'search1'}
                            size={22}
                            disable={true}
                            onPress={() =>
                                RejectedDate ? setRejectedDate('') : ''
                            }
                            />
                        )
                        }
                    />
                    </View>

                    {/* RejectedDesc*/}
                    <View style={[styles.view_style]}>
                    <TextInput
                        value={RejectedDesc}
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
                        textErrorStyle={styles.textErrorStyle}
                        label="Rejected Desc"
                        editable={false}
                        selectTextOnFocus={false}
                        onChangeText={text => {
                        setRejectedDesc(text);
                        }}
                        renderRightIcon={() =>
                        Editable ? (
                            ''
                        ) : (
                            <AntDesign
                            style={styles.icon}
                            color={'black'}
                            name={RejectedDesc ? 'close' : 'search1'}
                            size={22}
                            disable={true}
                            onPress={() =>
                                RejectedDesc ? setRejectedDesc('') : ''
                            }
                            />
                        )
                        }
                    />
                    </View>
                </View>

                <View style={styles.card}>
                    <View style={styles.card_heard}>
                    <Text style={styles.card_heard_text}>
                        WORK REQUEST ATTACHMENTS
                    </Text>
                    </View>

                    <View style={styles.view_style}>
                    <TouchableOpacity
                        style={{
                        flex: 1.5,
                        marginTop: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        }}
                        onPress={() => setVisible(!isVisible)}
                        disabled={Editable}>
                        <View
                        style={{
                            height: 60,
                            width: 60,
                            borderRadius: 30,
                            padding: 10,
                            backgroundColor: '#F7DC6F',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <MaterialIcons
                            name="add-a-photo"
                            color="#05375a"
                            size={30}
                        />
                        </View>

                        <Text
                        style={{
                            margin: 10,
                            color: '#000',
                            fontWeight: 'bold',
                        }}>
                        Attachments Image{' '}
                        </Text>
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
                        console.log(item);
                        setVisible(false);
                        for (let value of Object.values(item.assets)) {
                        console.log('Valeu', value.uri);
                        let key = Attachments_List.length + 1;
                        let localIdentifier = key;
                        let path = value.uri;
                        let name = value.fileName;
                        let rowid = '';
                        let imagetype = 'New';
                        Attachments_List.unshift({
                            key,
                            path,
                            name,
                            imagetype,
                            localIdentifier,
                            rowid,
                        });
                        setAttachments_List(Attachments_List.slice(0));
                        key++;
                        }

                        // setSelectedItem(item);
                        // openPicker()
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
        </View>

        <View style={[ styles.bottomView, {display: visible_bottomView ? 'flex' : 'none'}]}>
            <TouchableOpacity
              style={{ width: '100%', height: 80, flex: 1, marginRight: 5, backgroundColor: '#8BC34A', alignItems: 'center', justifyContent: 'center', }}
              onPress={get_butoon_approve}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15, }}>
                  <AntDesign color={'#FFFF'} name={'checkcircleo'} size={25} />

                  <Text style={{ color: 'white', fontSize: 16, marginLeft: 8, fontWeight: 'bold', }}> Approve </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ width: '100%', height: 80, flex: 1, backgroundColor: 'red', alignItems: 'center', justifyContent: 'center', }}
              onPress={get_butoon_disapprove}>
            <View
                style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15, }}>
                <AntDesign color={'#FFFF'} name={'closecircleo'} size={25} />

                <Text style={{ color: 'white', fontSize: 16, marginLeft: 8, fontWeight: 'bold', }}> Disapprove </Text>
            </View>
            </TouchableOpacity>
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightgrey',
  },
  bottomModalView: {
    justifyContent: 'flex-end',
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
    width: '100%',
    height: '40%',
    borderRadius: 10,
    borderWidth: 2,
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

  model_cardview: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  model2_cardview: {
    flex: 1,
    justifyContent: 'center',
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

export default CreateWorkRequestApproval;
