import React, {Fragment, useRef} from 'react';
import { View, StyleSheet, Text, Dimensions, Image, FlatList, BackHandler, SafeAreaView, ScrollView, TouchableOpacity, Alert, Pressable, RefreshControl, Modal, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import axios from 'axios';
import {Appbar} from 'react-native-paper';
import {useTheme} from 'react-native-paper';
import {openDatabase} from 'react-native-sqlite-storage';
import DeviceInfo from 'react-native-device-info';
import ProgressLoader from 'rn-progress-loader';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityicons from 'react-native-vector-icons/MaterialCommunityIcons';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {ImageBackground} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Pdf from 'react-native-pdf';
import ImageViewer from 'react-native-image-zoom-viewer';
import {SCLAlert, SCLAlertButton} from 'react-native-scl-alert';

var db = openDatabase({name: 'CMMS.db'});
let Baseurl, Site_cd, LoginID, EmpName, EmpID, EmpPhone, EmpWorkGrp, dvc_id, Local_ID, mst_RowID, WIFI;

const deviceWidth = Dimensions.get('screen').width;
const deviceHeight = Dimensions.get('screen').height;

function CheckListHeader({route, navigation}) {
  const {colors} = useTheme();

  const [spinner, setspinner] = React.useState(false);
  const [Toolbartext, setToolbartext] = React.useState('Check List');

  const [checkList, setCheckList] = React.useState([]);
  const [filteredDataSource, setFilteredDataSource] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  //Alert
  const [Show, setShow] = React.useState(false);
  const [Show_two, setShow_two] = React.useState(false);
  const [Theme, setTheme] = React.useState('');
  const [Title, setTitle] = React.useState('');
  const [AlertType, setAlertType] = React.useState('');
  const [AlertData, setAlertData] = React.useState('');

  //QR CODE
  const [showqrcode, setshowqrcode] = React.useState(false);

  const [scan, setscan] = React.useState(false);
  const [ScanResult, setScanResult] = React.useState(false);
  const [result, setresult] = React.useState(null);
  const [qrresult, setqrresult] = React.useState('');

  const [ZoomAttachments_modalVisible, setZoomAttachments_modalVisible] = React.useState(false);
  const [images_link, setimages_link] = React.useState([]);
  const [Type_link, setType_link] = React.useState();
  const [link, setlink] = React.useState([]);

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
    } else if (
      route.params.Screenname == 'WoDashboard' ||
      route.params.Screenname == 'MYWO_Dashboard_Due' ||
      route.params.Screenname == 'MYWO_Dashboard_Past'
    ) {
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
    // Alert.alert("Alert", "Do you want to exit checkList Header screen?", [
    //   {
    //     text: "NO",
    //     onPress: () => null,

    //   },
    //   { text: "YES", onPress: () => _goBack() }
    // ]);
    setAlert_two( true, 'warning', 'Do you want to exit checkList screen?', 'BACK');
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

    console.log('WORK DATA LOCAL ID :  ' + Local_ID);
    console.log('WORK DATA MST_ROWID:', mst_RowID);

    if (WIFI === 'OFFLINE') {
      get_check_list_header_offline();
    } else {
      get_check_list_header();
    }
  };

  const get_check_list_header = async () => {
    setspinner(true);
    try {
      console.log(
        'JSON DATA : ' +
          `${Baseurl}/get_check_list_header.php?site_cd=${Site_cd}&rowid=${route.params.RowID}`,
      );
      const response = await axios.get(
        `${Baseurl}/get_check_list_header.php?site_cd=${Site_cd}&rowid=${route.params.RowID}`,
      );

      console.log('JSON DATA : ' + JSON.stringify(response.data.data));

      if (response.data.status === 'SUCCESS') {
        setCheckList(response.data.data);
        setFilteredDataSource(response.data.data);
        setspinner(false);
      } else {
        setspinner(false);
        setAlert(true, 'warning', response.data.message, 'OK');
        return;
      }
    } catch (error) {
      setspinner(false);
      alert(error);
    }
  };

  //GET RESPONS OFFLINE
  const get_check_list_header_offline = async () => {
    setspinner(true);
    if (!mst_RowID) {
      console.log('not Empty');

      db.transaction(function (txn) {
        //GET OFFLINE Check List Heard
        txn.executeSql(
          'SELECT * FROM wko_isp_heard WHERE  local_id =?',
          [Local_ID],
          (tx, results) => {
            var temp = [];
            console.log('Check List Heard:' + JSON.stringify(results.rows));
            if (results.rows.length > 0) {
              for (let i = 0; i < results.rows.length; ++i) {
                temp.push(results.rows.item(i));
              }

              setCheckList(temp);
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
          'SELECT * FROM wko_isp_heard WHERE  mst_RowID =? order by wko_isp_asset_no,ast_mst_asset_shortdesc,ast_mst_work_area,ast_mst_asset_locn,ast_mst_ast_lvl',
          [mst_RowID],
          (tx, results) => {
            var temp = [];
            console.log('get empty:' + JSON.stringify(results.rows));
            if (results.rows.length > 0) {
              for (let i = 0; i < results.rows.length; ++i) {
                temp.push(results.rows.item(i));
              }

              setCheckList(temp);
              setFilteredDataSource(temp);
              setspinner(false);
            } else {
              setspinner(false);
            }
          },
        );
      });
    }
  };

  const ItemView = ({item, index}) => {
    console.log('DATA' + item.wko_isp_datetime3);

    let done = Number(item.done);
    let total = Number(item.total);
    var timestamp;
    let Visible;

    if (item.wko_isp_datetime3 === null || item.wko_isp_datetime3 === '') {
      Visible = false;
    } else {
      Visible = true;
      if (WIFI == 'OFFLINE') {
        timestamp = moment(item.wko_isp_datetime3).format('yyyy-MM-DD HH:mm');
      } else {
        timestamp = moment(item.wko_isp_datetime3.date).format(
          'yyyy-MM-DD HH:mm',
        );
      }
    }

    return (
      <TouchableOpacity onPress={() => getItem(item)}>
        <View style={styles.Check_item}>
          <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', }}>
            <Text style={{ color: '#2962FF', fontSize: 12, backgroundColor: '#D6EAF8', padding: 5, fontWeight: 'bold', }}> {item.wko_isp_asset_no} </Text>
            <Text style={{fontSize: 12, color: '#FB8C00', fontWeight: 'bold'}}> {' ( ' + done + ' / ' + total + ' ) '} </Text>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, alignItems: 'center'}}>
            <View style={{width: '30%'}}>
              <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start',fontSize: 12, }}> Description : </Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000',fontSize: 12,}}> {item.ast_mst_asset_shortdesc} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, alignItems: 'center'}}>
            <View style={{width: '30%'}}>
              <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start',fontSize: 12, }}> C.List Code : </Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000',fontSize: 12,}}> {item.wko_isp_job_cd} </Text>
            </View>
          </View>

          <View
            style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{width: '30%'}}>
              <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start', fontSize: 12,}}> C.List Desc: </Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000',fontSize: 12,}}> {item.wko_isp_job_desc.trim()} </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', marginTop: 5, justifyContent: 'space-between', alignContent: 'center', alignItems: 'center', display: Visible ? 'flex' : 'none', }}>
            <View style={{width: '30%'}}>
              <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start',fontSize: 12, }}> Timestamp: </Text>
            </View>

            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ justifyContent: 'flex-start', fontWeight: 'bold', color: '#2ECC71',fontSize: 12, }}> {timestamp} </Text>
            </View>

            <View style={{ alignItems: 'flex-end', marginRight: 10}}>
              <MaterialCommunityicons
                name="clock-check-outline"
                color="#2ECC71"
                size={25}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          backgroundColor: '#C8C8C8',
        }}
      />
    );
  };

  const getItem = item => {
    // Function for click on an item
    //alert('Id : ' + item.wko_isp_asset_no );

    if (route.params.Screenname == 'FilteringWorkOrder') {
      navigation.navigate('ChekListDetalisupdate', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        //no need back
        Selected_AssetNo: item.wko_isp_asset_no,
        Selected_CheckNo: item.wko_isp_job_cd,
        Selected_CheckDesc: item.wko_isp_job_desc,

        Screenname: route.params.Screenname,

        WOF_Workordercategory: route.params.WOF_Workordercategory,
        WOF_Workorderstatus: route.params.WOF_Workorderstatus,
        WOF_WorkrequestNo: route.params.WOF_WorkrequestNo,
        WOF_WorkorderNo: route.params.WOF_WorkorderNo,
        WOF_WorkorderDesc: route.params.WOF_WorkorderDesc,
        WOF_AssetNo: route.params.WOF_AssetDesc,
        WOF_AssetDesc: route.params.WOF_AssetDesc,
        WOF_Originator: route.params.WOF_Originator,
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
      navigation.navigate('ChekListDetalisupdate', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        //no need back
        Selected_AssetNo: item.wko_isp_asset_no,
        Selected_CheckNo: item.wko_isp_job_cd,
        Selected_CheckDesc: item.wko_isp_job_desc,

        local_id: route.params.local_id,
        Selected_wko_mst_ast_cod: route.params.Selected_wko_mst_ast_cod,
        Selected_wko_mst_type: route.params.Selected_wko_mst_type,
        Screenname: route.params.Screenname,
      });
    } else if (
      route.params.Screenname == 'WoDashboard' ||
      route.params.Screenname == 'MYWO_Dashboard_Due' ||
      route.params.Screenname == 'MYWO_Dashboard_Past'
    ) {
      navigation.navigate('ChekListDetalisupdate', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        //no need back
        Selected_AssetNo: item.wko_isp_asset_no,
        Selected_CheckNo: item.wko_isp_job_cd,
        Selected_CheckDesc: item.wko_isp_job_desc,

        local_id: route.params.local_id,
        Selected_wko_mst_ast_cod: route.params.Selected_wko_mst_ast_cod,
        Selected_wko_mst_type: route.params.Selected_wko_mst_type,

        Screenname: route.params.Screenname,
        type: route.params.type,
      });
    } else if (route.params.Screenname == 'ScanAssetMaster') {
      if (route.params.ScanAssetType == 'New') {
      } else if (route.params.ScanAssetType == 'Edit') {
        navigation.navigate('ChekListDetalisupdate', {
          Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
          RowID: route.params.RowID,

          //no need back
          Selected_AssetNo: item.wko_isp_asset_no,
          Selected_CheckNo: item.wko_isp_job_cd,
          Selected_CheckDesc: item.wko_isp_job_desc,

          Screenname: route.params.Screenname,
          ScanAssetType: route.params.ScanAssetType,
          ScanAssetno: route.params.ScanAssetno,
          ScanAssetRowID: route.params.ScanAssetRowID,
        });
      }
    } else if (route.params.Screenname == 'AssetListing') {
      navigation.navigate('ChekListDetalisupdate', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        //no need back
        Selected_AssetNo: item.wko_isp_asset_no,
        Selected_CheckNo: item.wko_isp_job_cd,
        Selected_CheckDesc: item.wko_isp_job_desc,

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

    //MaterialCommunityicons
  };

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
      setAlert(true, 'warning', 'Incorrect Scan Asset’', 'OK');
    } else {
      setshowqrcode(false);
      const strParts = e.data.split('\n');
      //console.warn("split"+strParts[0].trim());

      const newData = checkList.filter(function (item) {
        //const itemData = item.ast_mst_asset_no ? item.ast_mst_asset_no.toUpperCase() : ''.toUpperCase();
        //const itemData = item.ast_mst_asset_no.toUpperCase(),;
        const itemData = `${item.wko_isp_asset_no.toUpperCase()})`;

        const textData = strParts[0].trim();
        return itemData.indexOf(textData) > -1;
      });

      //console.warn("COUNT: ",newData.length);

      if (newData.length > 0) {
        //   newData.filter(function (item) {

        //   return
        // });

        // newData.map(item =>{

        //   if(!item.wko_isp_datetime3){

        //     searchFilterFunction(strParts[0].trim());
        //     return

        //   }else{

        //     setAlert_two(true,'warning','This Asset no scanning is done,Do you want to do it aging?','SCAN_ASSET',strParts[0].trim())

        //     return

        //   }
        //   return

        // })

        searchFilterFunction(strParts[0].trim());
      } else {
        setAlert(
          true,
          'warning',
          'Asset no is not matched in this check list...',
          'OK',
        );
      }
    }
  };

  const searchFilterFunction = text => {
    let timestamp = moment().format('yyyy-MM-DD HH:mm');

    timestampdate = {
      date: timestamp,
    };

    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = checkList.filter(function (item) {
        //const itemData = item.ast_mst_asset_no ? item.ast_mst_asset_no.toUpperCase() : ''.toUpperCase();
        //const itemData = item.ast_mst_asset_no.toUpperCase(),;
        const itemData = `${item.wko_isp_asset_no.toUpperCase()})`;

        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });

      const newData2 = newData.map(item => {
        if (item.wko_isp_asset_no == text) {
          //console.log("SELECTED ITEM "+  item.selected_Employee)
          //console.log("SELECTED ITEM 2"+  option.key)
          item.wko_isp_datetime3 = timestamp;

          return item;
        }
        return item;
      });

      if (WIFI === 'OFFLINE') {
        update_off_checklist_hearder(newData2, text, timestamp);
      } else {
        update_checklist_header(newData2, text, timestamp);
      }
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(checkList);
      setSearch(text);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);

    if (WIFI === 'OFFLINE') {
      get_check_list_header_offline();
    } else {
      get_check_list_header();
    }

    setRefreshing(false);
  }, [refreshing]);

  //Update Timestamp Onilne
  const update_checklist_header = async (list, assetno, time) => {
    try {
      console.log(
        'JSON DATA : ' +
          `${Baseurl}/update_check_list_header.php?site_cd=${Site_cd}&wko_isp_asset_no=${assetno}&wko_isp_datetime3=${time}`,
      );
      const response = await axios.get(
        `${Baseurl}/update_check_list_header.php?site_cd=${Site_cd}&wko_isp_asset_no=${assetno}&wko_isp_datetime3=${time}`,
      );

      if (response.data.status === 'SUCCESS') {
        setFilteredDataSource(list);
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

  //Update timestamp Offline
  const update_off_checklist_hearder = async (list, assetno, time) => {
    console.log('assetno', assetno);
    console.log('time', time);

    db.transaction(function (tx) {
      tx.executeSql(
        'UPDATE wko_isp_heard SET wko_isp_datetime3 = ? WHERE wko_isp_asset_no = ?',
        [time, assetno],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            setFilteredDataSource(list);

            console.log('Update success');
          } else {
            setAlert(true, 'danger', 'Update Timestamp Failed', 'OK');
          }
        },
      );

      tx.executeSql(
        'UPDATE wko_isp_details SET wko_isp_datetime3 = ? WHERE wko_isp_asset_no = ?',
        [time, assetno],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            setFilteredDataSource(list);

            console.log('Update success');
          } else {
            setAlert(true, 'danger', 'Update Timestamp Failed', 'OK');
          }
        },
      );
    });
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
    setAlertData(value);
  };

  const One_Alret_onClick = D => {
    if (D === 'OK') {
      setShow(false);
    } else if (D === 'UPDATE_RESPONSE') {
      setShow(false);

      _goBack();
    }
  };

  const Alret_onClick = D => {
    if (D === 'BACK') {
      setShow_two(false);
      _goBack();
    } else if (D === 'SCAN_ASSET') {
      setShow_two(false);
      searchFilterFunction(AlertData);
    }
  };

  //Zoom Attachment
  const Attachment_show = item => {
    console.log('show:', item);

    if (item.file_link === null) {
      alert('No Attachment file');
    } else {
      if (WIFI == 'OFFLINE') {
        setimages_link('file://' + item.file_link);
      } else {
        setimages_link(item.file_link);
      }

      setZoomAttachments_modalVisible(!ZoomAttachments_modalVisible);
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
    setZoomAttachments_modalVisible(!ZoomAttachments_modalVisible);
    
  };

  return (
    <SafeAreaProvider>
      <Appbar.Header style={{backgroundColor: '#42A5F5'}}>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'space-between',
          }}>
          <Pressable onPress={_goBack}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <FontAwesome name="angle-left" color="#fff" size={55} style={{marginLeft: 15, marginBottom: 5}} />
              <Text style={{ fontSize: 20, justifyContent: 'center', textAlign: 'center', color: '#fff', fontWeight: 'bold', marginLeft: 15, }}> {Toolbartext} </Text>
            </View>
          </Pressable>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Pressable onPress={OpenQRCode}>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginRight: 25, }}>
                  <MaterialCommunityicons name="qrcode-scan" color="#FFF" size={30} style={{marginTop: 4, marginBottom: 5}} />
                </View>
            </Pressable>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Pressable onPress={() => Attachment_PDF_show() }>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginRight: 20 }}>
                  {/* <Text style={{ fontSize: 15, justifyContent: 'center', textAlign: 'center', color: '#fff', fontWeight: 'bold'}}> PDF </Text> */}
                  <FontAwesome5 name="file-pdf" color="#FFF" size={30} style={{marginTop: 4 ,marginBottom: 5}} />
                </View>
              </Pressable>
            </View>

          </View>
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
        <SCLAlertButton
          theme={Theme}
          onPress={() => One_Alret_onClick(AlertType)}>
          OK
        </SCLAlertButton>
      </SCLAlert>

      <SCLAlert theme={Theme} show={Show_two} title={Title}>
        <SCLAlertButton theme={Theme} onPress={() => Alret_onClick(AlertType)}>
          Yes
        </SCLAlertButton>
        <SCLAlertButton theme="default" onPress={() => setShow_two(false)}>
          No
        </SCLAlertButton>
      </SCLAlert>

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
                      source={{uri: link, cache: true }} 
                      style={{height: 700, margin: 10}}
                    /> 

                  
                </View>
                  
              }

        

             
            </View>
          </View>
      </Modal>

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

      <View style={{flex: 1, marginBottom: 10}}>
        <FlatList
          data={filteredDataSource}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeparatorView}
          renderItem={ItemView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    </SafeAreaProvider>
  );
}

export default CheckListHeader;

const styles = StyleSheet.create({
  Check_item: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 10,
    borderRadius: 10,
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
  model_cardview: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
});
