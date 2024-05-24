import React,{Fragment}from "react";
import { View, StyleSheet, Text, Pressable, TouchableOpacity, FlatList, BackHandler, Image, Alert,Dimensions,Modal,SafeAreaView } from 'react-native';
import {Button, SearchBar} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressLoader from 'rn-progress-loader';
import {Appbar} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import moment from 'moment';
import axios from 'axios';
import {openDatabase} from 'react-native-sqlite-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {ImageBackground} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {SCLAlert, SCLAlertButton} from 'react-native-scl-alert';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


var db = openDatabase({name: 'CMMS.db'});

let BaseUrl, Site_cd, LoginID, EmpName, EmpID, EmpPhone, EmpWorkGrp, WIFI;


const deviceWidth = Dimensions.get('screen').width;
const deviceHeight = Dimensions.get('screen').height;

const WorkOrderListing = ({navigation, route}) => {

  const _goBack = () => {
    console.log(route.params.Screenname);

    if (route.params.Screenname === 'MyWorkOrder') {
      navigation.navigate('MainTabScreen');
    } else if (route.params.Screenname === 'FilteringWorkOrder') {
      navigation.navigate('FilteringWorkOrder');
    } else if (route.params.Screenname === 'WoDashboard' ) {
      navigation.navigate('WODashboard');
    } else if (route.params.Screenname == 'AssetListing') {
      navigation.navigate('CreateAssetScreen', {
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
    } else if (route.params.Screenname == 'ScanAssetMaster') {
      navigation.navigate('CreateAssetScreen', {
        Screenname: route.params.Screenname,
        ScanAssetno: route.params.ScanAssetno,
        ScanAssetType: route.params.ScanAssetType,
        ScanAssetRowID: route.params.ScanAssetRowID,
      });
    } else if (route.params.Screenname === 'MYWO_Dashboard_Due') {
      navigation.navigate('MainTabScreen');
    } else if (route.params.Screenname === 'MYWO_Dashboard_Past') {
      navigation.navigate('MainTabScreen');
    }

    return true;
  };

  const [spinner, setspinner] = React.useState(true);
  const [HeaderTitle, setHeaderTitle] = React.useState('');

  const [colorcode1, setcolorcode1] = React.useState('#0096FF');
  const [colorcode2, setcolorcode2] = React.useState('#FFF');
  const [colorcode3, setcolorcode3] = React.useState('#FFF');

  const [search, setSearch] = React.useState('');
  const [Open, setOpen] = React.useState('0');
  const [Complete, setComplete] = React.useState('0');
  const [Close, setClose] = React.useState('0');

  const [colorcode4, setcolorcode4] = React.useState('#FFF');
  const [status, setstatus] = React.useState('');

  const [WorkOrderList, setWorkOrderList] = React.useState([]);
  const [filteredDataSource, setFilteredDataSource] = React.useState([]);
  const [isVisible, setVisible] = React.useState(false);

  //Alert
  const [Show, setShow] = React.useState(false);
  const [Theme, setTheme] = React.useState('');
  const [Title, setTitle] = React.useState('');

  //QR CODE
  const [showqrcode, setshowqrcode] = React.useState(false);
  const [scan, setscan] = React.useState(false);
  const [ScanResult, setScanResult] = React.useState(false);
  const [result, setresult] = React.useState(null);
  const [TabVisible, setTabVisible] = React.useState(false);

  const backAction = () => {
    Alert.alert('Alert', 'Do you want to exit work order Listing?', [
      {
        text: 'No',
        onPress: () => null,
      },
      {text: 'YES', onPress: () => _goBack()},
    ]);
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
  }, [navigation,route]);

  const fetchData = async () => {
    BaseUrl = await AsyncStorage.getItem('BaseURL');
    Site_cd = await AsyncStorage.getItem('Site_Cd');
    LoginID = await AsyncStorage.getItem('emp_mst_login_id');
    EmpName = await AsyncStorage.getItem('emp_mst_name');
    EmpID = await AsyncStorage.getItem('emp_mst_empl_id');
    EmpPhone = await AsyncStorage.getItem('emp_mst_homephone');
    EmpWorkGrp = await AsyncStorage.getItem('emp_det_work_grp');

    setSearch('');

    WIFI = await AsyncStorage.getItem('WIFI');
    console.log('WORK DATA:  ' + route.params.Screenname);


    if (route.params.Screenname == 'AssetListing' || route.params.Screenname == 'ScanAssetMaster') {
      setHeaderTitle('Asset WO History')
    
    }else{
      setHeaderTitle('Work Order')
      setTabVisible(true)
    }

    if (WIFI === 'OFFLINE') {
      get_offline_workorder();
      setVisible(true);
      //get_workorder_listing();
    } else {
      get_workorder_listing();
      setVisible(false);
    }
  };

  const get_offline_workorder = async () => {
    setspinner(true);

    db.transaction(function (txn) {

      //GET OFFLINE WORK ORDER
      if (route.params.Screenname == 'MYWO_Dashboard_Due') {

        txn.executeSql( "SELECT  * FROM wko_mst where wrk_sts_typ_cd = 'OPEN' and wko_mst_due_date BETWEEN date('now') AND date('now', '+3 days') ", [], (tx, results) => {
            console.log('GET OFFLINE WORK ORDER OPEN:' + JSON.stringify(results));
            setOpen(results.rows.length);
          },
        );
  
        //GET OFFLINE WORK ORDER
        txn.executeSql( "SELECT  * FROM wko_mst where wrk_sts_typ_cd = 'COMPLETE'", [], (tx, results) => {
            console.log( 'GET OFFLINE WORK ORDER COMPLETE:' + JSON.stringify(results));
            setComplete(results.rows.length);
          },
        );
  
        //GET OFFLINE WORK ORDER
        txn.executeSql( "SELECT  * FROM wko_mst where wrk_sts_typ_cd = 'CLOSE'", [], (tx, results) => {
            console.log( 'GET OFFLINE WORK ORDER CLOSE:' + JSON.stringify(results));
            setClose(results.rows.length);
          },
        );

        txn.executeSql("SELECT * FROM wko_mst WHERE wko_mst_due_date BETWEEN date('now') AND date('now', '+3 days')", [], (tx, results) => {
            var temp = [];
            console.log( 'GET WORK ORDER OFFLINE LIST :' + JSON.stringify(results), );
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }
            setWorkOrderList(temp);
            setFilteredDataSource(temp);
            setcolorcode4('#8BC34A');
            setstatus('OPE');
            setspinner(false);
          },
        );

      }else if(route.params.Screenname == 'MYWO_Dashboard_Past'){

        txn.executeSql(
          "SELECT  * FROM wko_mst where wrk_sts_typ_cd = 'OPEN' AND date(wko_mst_due_date) < date('now')",
          [],
          (tx, results) => {
            console.log('GET OFFLINE WORK ORDER OPEN:' + JSON.stringify(results));
            setOpen(results.rows.length);
          },
        );
  
        //GET OFFLINE WORK ORDER
        txn.executeSql(
          "SELECT  * FROM wko_mst where wrk_sts_typ_cd = 'COMPLETE'",
          [],
          (tx, results) => {
            console.log( 'GET OFFLINE WORK ORDER COMPLETE:' + JSON.stringify(results), );
            setComplete(results.rows.length);
          },
        );
  
        //GET OFFLINE WORK ORDER
        txn.executeSql(
          "SELECT  * FROM wko_mst where wrk_sts_typ_cd = 'CLOSE'",
          [],
          (tx, results) => {
            console.log(
              'GET OFFLINE WORK ORDER CLOSE:' + JSON.stringify(results),
            );
            setClose(results.rows.length);
          },
        );

        txn.executeSql("SELECT * FROM wko_mst WHERE  date(wko_mst_due_date)< date('now')", [], (tx, results) => {
            var temp = [];
            console.log( 'GET WORK ORDER OFFLINE LIST :' + JSON.stringify(results), );
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }
            setWorkOrderList(temp);
            setFilteredDataSource(temp);
            setcolorcode4('#8BC34A');
            setstatus('OPE');
            setspinner(false);
          },
        );

      }else{

        txn.executeSql(
          "SELECT  * FROM wko_mst where wrk_sts_typ_cd = 'OPEN'",
          [],
          (tx, results) => {
            console.log('GET OFFLINE WORK ORDER OPEN:' + JSON.stringify(results));
            setOpen(results.rows.length);
          },
        );
  
        //GET OFFLINE WORK ORDER
        txn.executeSql(
          "SELECT  * FROM wko_mst where wrk_sts_typ_cd = 'COMPLETE'",
          [],
          (tx, results) => {
            console.log( 'GET OFFLINE WORK ORDER COMPLETE:' + JSON.stringify(results), );
            setComplete(results.rows.length);
          },
        );
  
        //GET OFFLINE WORK ORDER
        txn.executeSql(
          "SELECT  * FROM wko_mst where wrk_sts_typ_cd = 'CLOSE'",
          [],
          (tx, results) => {
            console.log(
              'GET OFFLINE WORK ORDER CLOSE:' + JSON.stringify(results),
            );
            setClose(results.rows.length);
          },
        );

        txn.executeSql(
          "SELECT  * FROM wko_mst where wrk_sts_typ_cd = 'OPEN' ORDER BY wko_mst_org_date desc",
          [],
          (tx, results) => {
            var temp = [];
            console.log( 'GET WORK ORDER OFFLINE LIST :' + JSON.stringify(results), );
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }
            setWorkOrderList(temp);
            setFilteredDataSource(temp);
            setcolorcode4('#8BC34A');
            setstatus('OPE');
            setspinner(false);
          },
        );

      }
      
    });
  };

  

  const get_workorder_listing = async () => {
    setspinner(true);

    const SPLIT_URL = BaseUrl.split('/');

    console.log('SPLIT_URL: ' +SPLIT_URL.length);

    const SPLIT_URL1 = SPLIT_URL[SPLIT_URL.length - 2];
    const SPLIT_URL2 = SPLIT_URL[SPLIT_URL.length - 1];
    const SPLIT_URL3 = SPLIT_URL1+'/'+SPLIT_URL2

    console.log('SPLIT_URL3: ' +SPLIT_URL3);
    let dvc_id = DeviceInfo.getDeviceId();
    let userStr;

    if (route.params.Screenname === 'FilteringWorkOrder') {
      userStr = {
        site_cd: Site_cd,
        wkr_mst_wr_no: route.params.WOF_WorkrequestNo,
        wko_mst_wo_no: route.params.WOF_WorkorderNo,
        wko_mst_assetno: route.params.WOF_AssetNo,
        wko_mst_descs: route.params.WOF_WorkorderDesc,
        wko_mst_originator: route.params.WOF_Originator,
        wko_mst_status: route.params.WOF_Workorderstatus,
        wko_mst_work_area: route.params.WOF_WorkArea,
        wko_mst_type: route.params.WOF_Workordercategory,
        wko_mst_asset_location: route.params.WOF_AssetLocation,
        wko_mst_asset_level: route.params.WOF_AssetLevel,
        wko_mst_org_date: route.params.WOF_Fromdate,
        wko_mst_due_date: route.params.WOF_Todate,
        asset_shortdesc: route.params.WOF_AssetDesc,
        wko_det_supv_id:route.params.WOF_SupervisorID,
        wko_mst_chg_costcenter:route.params.WOF_CostCenter,
        wko_det_assign_to: route.params.WOF_Assignto,
        wko_det_work_type: route.params.WOF_WorkType,
        wrk_sts_typ_cd: 'Open',
        type: '',
        Dashoard_type: '',
        emp_det_work_grp: EmpWorkGrp,
        emp_id: EmpID,
        Folder:SPLIT_URL3,
        dvc_id:dvc_id,
        MobileURL:BaseUrl
      };

     
    } else if (route.params.Screenname === 'MyWorkOrder') {
      userStr = {
        site_cd: Site_cd,
        wrk_sts_typ_cd: '',
        wkr_mst_wr_no: '',
        wko_mst_wo_no: '',
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
        wko_det_assign_to: EmpID,
        wko_det_work_type: '',
        wrk_sts_typ_cd: 'Open',
        wko_det_supv_id:'',
        wko_mst_chg_costcenter:'',
        type: '',
        Dashoard_type: '',
        emp_det_work_grp: EmpWorkGrp,
        emp_id: EmpID,
        Folder:SPLIT_URL3,
        dvc_id:dvc_id,
        MobileURL:BaseUrl
      };
    } else if (route.params.Screenname === 'WoDashboard') {
      switch (route.params.type) {
        case 'My_WO':
          userStr = {
            site_cd: Site_cd,
            wrk_sts_typ_cd: '',
           wkr_mst_wr_no:'',
            wko_mst_wo_no: '',
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
            wko_det_assign_to: EmpID,
            wko_det_work_type: '',
            wrk_sts_typ_cd: 'Open',
            wko_det_supv_id:'',
            wko_mst_chg_costcenter:'',
            type: 'My_WO',
            Dashoard_type: '',
            emp_det_work_grp: EmpWorkGrp,
            emp_id: EmpID,
            Folder:SPLIT_URL3,
            dvc_id:dvc_id,
            MobileURL:BaseUrl
          };
          break;

        case 'assign':
          userStr = {
            site_cd: Site_cd,
            wrk_sts_typ_cd: '',
           wkr_mst_wr_no:'',
            wko_mst_wo_no: '',
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
            type: 'assign',
            wko_det_supv_id:'',
            wko_mst_chg_costcenter:'',
            Dashoard_type: '',
            emp_det_work_grp: EmpWorkGrp,
            emp_id: EmpID,
            Folder:SPLIT_URL3,
            dvc_id:dvc_id,
            MobileURL:BaseUrl
          };
          break;

        case 'notcomplete':
          userStr = {
            site_cd: Site_cd,
            wrk_sts_typ_cd: '',
           wkr_mst_wr_no:'',
            wko_mst_wo_no: '',
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
            wko_det_supv_id:'',
            wko_mst_chg_costcenter:'',
            type: 'notcomplete',
            Dashoard_type: '',
            emp_det_work_grp: EmpWorkGrp,
            emp_id: EmpID,
            Folder:SPLIT_URL3,
            dvc_id:dvc_id,
            MobileURL:BaseUrl
          };

          break;

        case 'pmcurrent':
          var now = new Date();
          var firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
          var dateone = moment(firstDay).format('YYYY-MM-DD hh:mm');

          console.log(firstDay); // 👉️ Sat Oct 01 2022 ...

          var lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          var datetwo = moment(lastDay).format('YYYY-MM-DD hh:mm');
          console.log(lastDay); // 👉️ Mon Oct 31 2022 ...

          userStr = {
            site_cd: Site_cd,
            wrk_sts_typ_cd: '',
           wkr_mst_wr_no:'',
            wko_mst_wo_no: '',
            wko_mst_assetno: '',
            wko_mst_descs: '',
            wko_mst_originator: '',
            wko_mst_status: '',
            wko_mst_work_area: '',
            wko_mst_type: 'P',
            wko_mst_asset_location: '',
            wko_mst_asset_level: '',
            wko_mst_org_date: dateone,
            wko_mst_due_date: datetwo,
            asset_shortdesc: '',
            wko_det_assign_to: '',
            wko_det_work_type: '',
            wrk_sts_typ_cd: '',
            wko_det_supv_id:'',
            wko_mst_chg_costcenter:'',
            type: 'notcomplete',
            Dashoard_type: '',
            emp_det_work_grp: EmpWorkGrp,
            emp_id: EmpID,
            Folder:SPLIT_URL3,
            dvc_id:dvc_id,
            MobileURL:BaseUrl
          };

          break;

        case 'pmnext':
          var nownext = new Date();

          const nextfirstDay = new Date(
            nownext.getFullYear(),
            nownext.getMonth() + 1,
            1,
          );
          var dateone = moment(nextfirstDay).format('YYYY-MM-DD hh:mm');

          console.log(dateone); // 👉️ Sat Oct 01 2022 ...

          const nextlastDay = new Date(
            nownext.getFullYear(),
            nownext.getMonth() + 2,
            0,
          );
          var datetwo = moment(nextlastDay).format('YYYY-MM-DD hh:mm');
          console.log(lastDay); // 👉️ Mon Oct 31 2022 ...

          userStr = {
            site_cd: Site_cd,
            wrk_sts_typ_cd: '',
           wkr_mst_wr_no:'',
            wko_mst_wo_no: '',
            wko_mst_assetno: '',
            wko_mst_descs: '',
            wko_mst_originator: '',
            wko_mst_status: '',
            wko_mst_work_area: '',
            wko_mst_type: 'P',
            wko_mst_asset_location: '',
            wko_mst_asset_level: '',
            wko_mst_org_date: dateone,
            wko_mst_due_date: datetwo,
            asset_shortdesc: '',
            wko_det_assign_to: '',
            wko_det_work_type: '',
            wrk_sts_typ_cd: '',
            wko_det_supv_id:'',
            wko_mst_chg_costcenter:'',
            type: 'notcomplete',
            Dashoard_type: '',
            emp_det_work_grp: EmpWorkGrp,
            emp_id: EmpID,
            Folder:SPLIT_URL3,
            dvc_id:dvc_id,
            MobileURL:BaseUrl
          };

          break;

        case 'pmprevious':
          const previousnow = new Date();

          const previousfirstDay = new Date(
            previousnow.getFullYear(),
            previousnow.getMonth() - 1,
            1,
          );
          var dateone = moment(previousfirstDay).format('YYYY-MM-DD hh:mm');

          console.log(dateone); // 👉️ Sat Oct 01 2022 ...

          const previouslastDay = new Date(
            previousnow.getFullYear(),
            previousnow.getMonth(),
            0,
          );
          var datetwo = moment(previouslastDay).format('YYYY-MM-DD hh:mm');
          console.log(lastDay); // 👉️ Mon Oct 31 2022 ...

          userStr = {
            site_cd: Site_cd,
            wrk_sts_typ_cd: '',
           wkr_mst_wr_no:'',
            wko_mst_wo_no: '',
            wko_mst_assetno: '',
            wko_mst_descs: '',
            wko_mst_originator: '',
            wko_mst_status: '',
            wko_mst_work_area: '',
            wko_mst_type: 'P',
            wko_mst_asset_location: '',
            wko_mst_asset_level: '',
            wko_mst_org_date: dateone,
            wko_mst_due_date: datetwo,
            asset_shortdesc: '',
            wko_det_assign_to: '',
            wko_det_work_type: '',
            wrk_sts_typ_cd: '',
            wko_det_supv_id:'',
            wko_mst_chg_costcenter:'',
            type: 'notcomplete',
            Dashoard_type: '',
            emp_det_work_grp: EmpWorkGrp,
            emp_id: EmpID,
            Folder:SPLIT_URL3,
            dvc_id:dvc_id,
            MobileURL:BaseUrl
          };

          break;
      }
    } else if (route.params.Screenname == 'AssetListing') {
      userStr = {
        site_cd: Site_cd,
        wrk_sts_typ_cd: '',
        wko_mst_wo_no: '',
       wkr_mst_wr_no:'',
        wko_mst_assetno: route.params.ASL_Assetno,
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
        wko_det_supv_id:'',
        wko_mst_chg_costcenter:'',
        wrk_sts_typ_cd: 'Open',
        type: '',
        Dashoard_type: '',
        emp_det_work_grp: EmpWorkGrp,
        emp_id: EmpID,
        Folder:SPLIT_URL3,
        dvc_id:dvc_id,
        MobileURL:BaseUrl
      };
    } else if (route.params.Screenname == 'ScanAssetMaster') {
      userStr = {
        site_cd: Site_cd,
        wrk_sts_typ_cd: '',
       wkr_mst_wr_no:'',
        wko_mst_wo_no: '',
        wko_mst_assetno: route.params.ScanAssetno,
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
        wko_det_supv_id:'',
        wko_mst_chg_costcenter:'',
        wrk_sts_typ_cd: 'Open',
        type: '',
        Dashoard_type: '',
        emp_det_work_grp: EmpWorkGrp,
        emp_id: EmpID,
        Folder:SPLIT_URL3,
        dvc_id:dvc_id,
        MobileURL:BaseUrl
      };
    } else if (route.params.Screenname === 'MYWO_Dashboard_Due') {
      userStr = {
        site_cd: Site_cd,
        wrk_sts_typ_cd: '',
        wkr_mst_wr_no:'',
        wko_mst_wo_no: '',
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
        wko_det_assign_to: EmpID,
        wko_det_work_type: '',
        wko_det_supv_id:'',
        wko_mst_chg_costcenter:'',
        wrk_sts_typ_cd: 'Open',
        type: '',
        Dashoard_type: 'Due',
        emp_det_work_grp: EmpWorkGrp,
        emp_id: EmpID,
        Folder:SPLIT_URL3,
        dvc_id:dvc_id,
        MobileURL:BaseUrl
      };
    } else if (route.params.Screenname === 'MYWO_Dashboard_Past') {
      userStr = {
        site_cd: Site_cd,
        wrk_sts_typ_cd: '',
        wkr_mst_wr_no:'',
        wko_mst_wo_no: '',
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
        wko_det_assign_to: EmpID,
        wko_det_work_type: '',
        wrk_sts_typ_cd: 'Open',
        wko_det_supv_id:'',
        wko_mst_chg_costcenter:'',
        type: '',
        Dashoard_type: 'Past',
        emp_det_work_grp: EmpWorkGrp,
        emp_id: EmpID,
        Folder:SPLIT_URL3,
        dvc_id:dvc_id,
        MobileURL:BaseUrl
      };
    } 

    console.log('Work Order route.params.Screenname: ' + route.params.Screenname);
    console.log('USE DATA Work Order Listing: ' + JSON.stringify(userStr));

    const requestOptions = { method: 'POST', body: JSON.stringify(userStr) };  

    fetch(`${BaseUrl}/get_workorderlist_test.php?`,requestOptions)
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

          setOpen(data.Opens);
          setComplete(data.Complete);
          setClose(data.Closes);
        
        if (data.data.length > 0) {

         
          setWorkOrderList(data.data);
          setFilteredDataSource(data.data);
          setcolorcode1('#0096FF');
          setcolorcode2('#FFF');
          setcolorcode3('#FFF');
         
        
          setspinner(false);

        } else {
          setspinner(false);
          setAlert(true, 'warning', data.message);
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

    
  };

  const searchFilterFunction = text => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = WorkOrderList.filter(function (item) {
        //const itemData = item.ast_mst_asset_no ? item.ast_mst_asset_no.toUpperCase() : ''.toUpperCase();
        //const itemData = item.ast_mst_asset_no.toUpperCase(),;
        const itemData = `${item.wko_mst_assetno.toUpperCase()}
            ,${item.wko_mst_wo_no.toUpperCase()}
            ,${item.wko_mst_descs.toUpperCase()}
            ,${item.wko_mst_work_area.toUpperCase()}
            ,${item.wko_mst_asset_location.toUpperCase()}
            ,${item.wko_mst_asset_level.toUpperCase()})`;

        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(WorkOrderList);
      setSearch(text);
    }
  };

  const ItemView = ({item}) => {
    
    let orgdate, duedate, assigndate;

    if (WIFI === 'OFFLINE') {
      let Org_Date = moment(item.wko_mst_org_date).format('yyyy-MM-DD HH:mm');
      //console.log(Org_Date)
      if (Org_Date === '1900-01-01 00:00') {
        orgdate = '';
      } else {
        orgdate = moment(Org_Date).format('DD-MM-YYYY HH:mm');
      }

      let Due_Date = moment(item.wko_mst_due_date).format('yyyy-MM-DD HH:mm');
      //console.log(Org_Date)
      if (Due_Date === '1900-01-01 00:00') {
        duedate = '';
      } else {
        duedate = moment(Due_Date).format('DD-MM-YYYY HH:mm');
      }

      let Assign_Date = moment(item.assigndate).format('yyyy-MM-DD HH:mm');
      //console.log(Org_Date)
      if (Assign_Date === '1900-01-01 00:00') {
        assigndate = '';
      } else {
        assigndate = moment(Assign_Date).format('DD-MM-YYYY HH:mm');
      }
    } else {
      let Org_Date = moment(item.wko_mst_org_date.date).format('yyyy-MM-DD HH:mm');
      //console.log(Org_Date)
      if (Org_Date === '1900-01-01 00:00') {
        orgdate = '';
      } else {
        orgdate = moment(Org_Date).format('DD-MM-YYYY HH:mm');
      }

      let Due_Date = moment(item.wko_mst_due_date.date).format('yyyy-MM-DD HH:mm');
      //console.log(Org_Date)
      if (Due_Date === '1900-01-01 00:00') {
        duedate = '';
      } else {
        duedate = moment(Due_Date).format('DD-MM-YYYY HH:mm');
      }

      let Assign_Date = moment(item.assigndate.date).format('yyyy-MM-DD HH:mm');
      //console.log(Org_Date)
      if (Assign_Date === '1900-01-01 00:00') {
        assigndate = '';
      } else {
        assigndate = moment(Assign_Date).format('DD-MM-YYYY HH:mm');
      }
    }

    let color_sts,wko_mst_status;
    if (item.wrk_sts_typ_cd === 'OPEN') {
      color_sts = '#8BC34A';
     
    } else if (item.wrk_sts_typ_cd === 'COMPLETE') {
      color_sts = '#F4D03F';
     
    } else if (item.wrk_sts_typ_cd === 'CLOSE') {
      color_sts = '#FF0000';
     
    }

    let link
    if(item.attachment === null){
      link = '0'
    }else{
      link = '1'

      
    }


    return (
      <TouchableOpacity onPress={() => getItem(item)}>
        <View style={styles.item}>

          {/* <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row'}}>
            <View style={{ backgroundColor: '#D6EAF8', padding: 5, borderRadius: 10}}>
              <Text style={{color: '#2962FF', fontSize: 13, fontWeight: 'bold'}}>{item.wko_mst_wo_no}</Text>
            </View>
            <Text style={{fontSize: 13, fontWeight: 'bold', color: color_sts}}>{item.wko_mst_status}</Text>
          </View> */}

          <View style={{ flexDirection: 'row', marginTop:5 }}>
            <MaterialCommunityIcons
              name="alpha-w-circle-outline"
              color={'#05375a'}
              size={20}/>

            <Text style={{flex: 1,color: '#05375a', fontSize: 12, marginLeft:10 }}>{item.wko_mst_wo_no }</Text>

            <Text style={{color: color_sts, fontSize: 12, }}>{item.wko_mst_status}</Text>
          </View>

          <View style={{ flexDirection: 'row', marginTop:5 }}>
              <MaterialCommunityIcons
                name="align-horizontal-left"
                color={'#05375a'}
                size={20}/>

              <Text style={{flex: 1,color: '#05375a', fontSize: 12, marginLeft:10 }}>{item.wko_mst_descs.trim()}</Text>
          </View>

          <View style={{ flexDirection: 'row', marginTop:5 }}>
              <MaterialCommunityIcons
                name="barcode-scan"
                color={'#05375a'}
                size={20}/>

              <Text style={{flex: 1,color: '#05375a', fontSize: 12, marginLeft:10 }}>{item.wko_mst_assetno +' ( '+ item.ast_mst_asset_shortdesc +' )'}</Text>
          </View>
          <View style={{ alignItems: 'center',flexDirection: 'row', marginTop:5 }}>
              <MaterialCommunityIcons
                name="google-maps"
                color={'#05375a'}
                size={20}/>

              <Text style={{flex: 1,color: '#05375a', fontSize: 12, marginLeft:10 }}>{item.wko_mst_work_area}</Text>
          </View>

          <View style={{ alignItems: 'center',flexDirection: 'row', marginTop:5 }}>
              <MaterialCommunityIcons
                name="account-tie-outline"
                color={'#05375a'}
                size={20}/>

              <Text style={{flex: 1,color: '#05375a', fontSize: 12, marginLeft:10 }}>{item.wko_mst_originator}</Text>
          </View>

          <View style={{ alignItems: 'center',flexDirection: 'row', marginTop:5 }}>
              <MaterialCommunityIcons
                name="calendar-check"
                color={'#05375a'}
                size={20}/>

              <Text style={{flex: 1,color: '#05375a', fontSize: 12, marginLeft:10 }}>{orgdate}</Text>
          </View>

          <View style={{ alignItems: 'center',flexDirection: 'row', marginTop:5 }}>
              <MaterialCommunityIcons
                name="book-open-outline"
                color={'#05375a'}
                size={20}/>

              <Text style={{flex: 1,color: '#05375a', fontSize: 12, marginLeft:10 }}>{item.wko_det_work_grp}</Text>
          </View>

          
          
         
          
          <View style={{ alignItems: 'center',flexDirection: 'row', marginTop:5 }}>
              <MaterialCommunityIcons
                name="account-tie-hat-outline"
                color={'#05375a'}
                size={20}/>

              <Text style={{flex: 1,color: '#05375a', fontSize: 12, marginLeft:10 }}>{'Assign to '+item.wko_det_assign_to}</Text>
          </View>
          {/* <View style={{ flexDirection: 'row', marginTop:5 }}>
              <MaterialCommunityIcons
                name="calendar-arrow-right"
                color={'#05375a'}
                size={20}/>

              <Text style={{flex: 1,color: '#05375a', fontSize: 12, marginLeft:10 }}>{'Assign on '+assigndate}</Text>   
          </View>
          <View style={{ flexDirection: 'row', marginTop:5 }}>
             
             
              <MaterialCommunityIcons
                name="calendar-arrow-left"
                color={'#05375a'}
                size={20}/>

              <Text style={{flex: 1,color: '#05375a', fontSize: 12, marginLeft:10 }}>{'Due on '+duedate}</Text>
              
          </View> */}

          <View style={{flexDirection: 'row', marginTop:5, }}>

            <View style={{ flex: 2 }}>

              <View style={{ flexDirection: 'row' }}>
                <MaterialCommunityIcons
                  name="calendar-arrow-right"
                  color={'#05375a'}
                  size={20}/>

                <Text style={{flex: 1,color: '#05375a', fontSize: 12, marginLeft:10 }}>{'Assign on '+assigndate}</Text>   
              </View>
              <View style={{ flexDirection: 'row', marginTop:5 }}>
                
                
                  <MaterialCommunityIcons
                    name="calendar-arrow-left"
                    color={'#05375a'}
                    size={20}/>

                  <Text style={{flex: 1,color: '#05375a', fontSize: 12, marginLeft:10 }}>{'Due on '+duedate}</Text>
                  
              </View>

              
            </View>

            <View style={{ marginTop:5}}>

            {
               link === '1' &&
               <Image source={{uri:item.attachment}}  style={{width:100, height: 40}} />
               ||

               link === '0' &&
               <Image  style={{width:100, height: 50,}} />
             }

              
            </View>


          </View>
         
         

          {/* <View style={{flexDirection: 'row', marginTop: 10}}>
            <View style={{width: '40%'}}>
              <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start'}}>Origination Date :</Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{orgdate}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{width: '40%'}}>
              <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start'}}>Description :</Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.wko_mst_descs.trim()}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{width: '40%'}}>
              <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start'}}>Requester Name :</Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.wko_mst_originator}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{width: '40%'}}>
              <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start'}}>Asset No :</Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.wko_mst_assetno} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{width: '40%'}}>
              <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start'}}>Asset Description :</Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.ast_mst_asset_shortdesc}
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{width: '40%'}}>
              <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start'}}>Work Area :</Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.wko_mst_work_area} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{width: '40%'}}>
              <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start'}}>Asset Location :</Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.wko_mst_asset_location} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{width: '40%'}}>
              <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start'}}>Asset Level :</Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.wko_mst_asset_level} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{width: '40%'}}>
              <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start'}}>Work Group :</Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.wko_det_work_grp}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{width: '40%'}}>
              <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start'}}>Assign to :</Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.wko_det_assign_to}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{width: '40%'}}>
              <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start'}}>Assign Date :</Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{assigndate}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{width: '40%'}}>
              <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start'}}>Due Date :</Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{duedate}</Text>
            </View>
          </View> */}
        </View>
      </TouchableOpacity>
    );
  };

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View style={{ height: 0.5, width: '100%', backgroundColor: '#C8C8C8', }} />
    );
  };
  

  const getItem = item => {
    // Function for click on an item
    //alert('Id : ' + item.ast_mst_asset_no );

    //console.log(JSON.stringify(item));

    if (route.params.Screenname === 'FilteringWorkOrder') {
      navigation.navigate('CreateWorkOrder', {
        Selected_WorkOrder_no: item.wko_mst_wo_no,
        RowID: item.RowID,
        Selected_Asset_No: item.wko_mst_assetno,
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
    } else if (route.params.Screenname === 'MyWorkOrder') {
      navigation.navigate('CreateWorkOrder', {
        Selected_WorkOrder_no: item.wko_mst_wo_no,
        RowID: item.RowID,
        local_id: item.ID,
        Selected_wko_mst_ast_cod: item.wko_mst_ast_cod,
        Selected_wko_mst_type: item.wko_mst_type,
        Screenname: route.params.Screenname,
      });
    } else if (route.params.Screenname === 'WoDashboard') {
      navigation.navigate('CreateWorkOrder', {
        Selected_WorkOrder_no: item.wko_mst_wo_no,
        RowID: item.RowID,
        local_id: item.ID,
        Selected_wko_mst_ast_cod: item.wko_mst_ast_cod,
        Selected_wko_mst_type: item.wko_mst_type,

        Screenname: route.params.Screenname,
        type: route.params.type,
      });
    } else if (route.params.Screenname == 'AssetListing') {
      navigation.navigate('CreateWorkOrder', {
        Selected_WorkOrder_no: item.wko_mst_wo_no,
        RowID: item.RowID,
        local_id: item.ID,

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
    } else if (route.params.Screenname == 'ScanAssetMaster') {
      navigation.navigate('CreateWorkOrder', {
        Selected_WorkOrder_no: item.wko_mst_wo_no,
        RowID: item.RowID,
        local_id: item.ID,

        Screenname: route.params.Screenname,
        ScanAssetno: route.params.ScanAssetno,
        ScanAssetType: route.params.ScanAssetType,
        ScanAssetRowID: route.params.ScanAssetRowID,
      });
    } else if (route.params.Screenname === 'MYWO_Dashboard_Due') {
      navigation.navigate('CreateWorkOrder', {
        Selected_WorkOrder_no: item.wko_mst_wo_no,
        RowID: item.RowID,
        local_id: item.ID,
        Selected_wko_mst_ast_cod: item.wko_mst_ast_cod,
        Selected_wko_mst_type: item.wko_mst_type,
        Screenname: route.params.Screenname,
      });
    } else if (route.params.Screenname === 'MYWO_Dashboard_Past') {
      navigation.navigate('CreateWorkOrder', {
        Selected_WorkOrder_no: item.wko_mst_wo_no,
        RowID: item.RowID,
        local_id: item.ID,
        Selected_wko_mst_ast_cod: item.wko_mst_ast_cod,
        Selected_wko_mst_type: item.wko_mst_type,
        Screenname: route.params.Screenname,
      });
    }
  };

  const Button_select_list = async selected_value => {
    setspinner(true);

    console.log(selected_value);
    const SPLIT_URL = BaseUrl.split('/');
    const SPLIT_URL1 = SPLIT_URL[SPLIT_URL.length - 2];
    const SPLIT_URL2 = SPLIT_URL[SPLIT_URL.length - 1];
    const SPLIT_URL3 = SPLIT_URL1+'/'+SPLIT_URL2
    let dvc_id = DeviceInfo.getDeviceId();
    let userStr;

    if (WIFI === 'OFFLINE') {
      db.transaction(function (txn) {
        //GET OFFLINE WORK ORDER
        txn.executeSql( "SELECT  * FROM wko_mst where wrk_sts_typ_cd = 'OPEN'", [], (tx, results) => {
            console.log('get:' + JSON.stringify(results));
            setOpen(results.rows.length);
          },
        );

        //GET OFFLINE WORK ORDER
        txn.executeSql( "SELECT  * FROM wko_mst where wrk_sts_typ_cd = 'COMPLETE'", [], (tx, results) => {
            console.log('get:' + JSON.stringify(results));
            setComplete(results.rows.length);
          },
        );

        //GET OFFLINE WORK ORDER
        txn.executeSql( "SELECT  * FROM wko_mst where wrk_sts_typ_cd = 'CLOSE'", [], (tx, results) => {
            console.log('get:' + JSON.stringify(results));
            setClose(results.rows.length);
          },
        );

        if (selected_value == 'Open') {
          //GET OFFLINE WORK ORDER
          txn.executeSql( "SELECT  * FROM wko_mst where wrk_sts_typ_cd = 'OPEN'", [], (tx, results) => {
              var temp = [];
              console.log('get:' + JSON.stringify(results));
              for (let i = 0; i < results.rows.length; ++i) {
                temp.push(results.rows.item(i));
              }
              setWorkOrderList(temp);
              setFilteredDataSource(temp);
              setspinner(false);
            },
          );
        } else if (selected_value == 'Complete') {
          //GET OFFLINE WORK ORDER
          txn.executeSql( "SELECT  * FROM wko_mst where wrk_sts_typ_cd = 'COMPLETE'", [], (tx, results) => {
              var temp = [];
              console.log('get:' + JSON.stringify(results));
              for (let i = 0; i < results.rows.length; ++i) {
                temp.push(results.rows.item(i));
              }
              setWorkOrderList(temp);
              setFilteredDataSource(temp);
              setspinner(false);
            },
          );
        } else if (selected_value == 'Close') {
          //GET OFFLINE WORK ORDER
          txn.executeSql( "SELECT  * FROM wko_mst where wrk_sts_typ_cd = 'CLOSE'", [], (tx, results) => {
              var temp = [];
              console.log('get:' + JSON.stringify(results));
              for (let i = 0; i < results.rows.length; ++i) {
                temp.push(results.rows.item(i));
              }
              setWorkOrderList(temp);
              setFilteredDataSource(temp);
              setspinner(false);
            },
          );
        }

        if (selected_value == 'Open') {
          setcolorcode1('#0096FF');
          setcolorcode2('#FFF');
          setcolorcode3('#FFF');
          setcolorcode4('#8BC34A');
          setstatus('OPN');
        } else if (selected_value == 'Complete') {
          setcolorcode1('#FFF');
          setcolorcode2('#0096FF');
          setcolorcode3('#FFF');
          setcolorcode4('#F4D03F');
          setstatus('CMP');
        } else if (selected_value == 'Close') {
          setcolorcode1('#FFF');
          setcolorcode2('#FFF');
          setcolorcode3('#0096FF');
          setcolorcode4('#FF0000');
          setstatus('CLO');
        }
      });
    } else {
      if (route.params.Screenname === 'FilteringWorkOrder') {
        userStr = {
          site_cd: Site_cd,
          wkr_mst_wr_no: route.params.WOF_WorkrequestNo,
          wko_mst_wo_no: route.params.WOF_WorkorderNo,
          wko_mst_assetno: route.params.WOF_AssetNo,
          wko_mst_descs: route.params.WOF_WorkorderDesc,
          wko_mst_originator: route.params.WOF_Originator,
          wko_mst_status: route.params.WOF_Workorderstatus,
          wko_mst_work_area: route.params.WOF_WorkArea,
          wko_mst_type: route.params.WOF_Workordercategory,
          wko_mst_asset_location: route.params.WOF_AssetLocation,
          wko_mst_asset_level: route.params.WOF_AssetLevel,
          wko_mst_org_date: route.params.WOF_Fromdate,
          wko_mst_due_date: route.params.WOF_Todate,
          asset_shortdesc: route.params.WOF_AssetDesc,
          wko_det_supv_id:route.params.WOF_SupervisorID,
          wko_mst_chg_costcenter:route.params.WOF_CostCenter,
          wko_det_assign_to: '',
          wko_det_work_type: route.params.WOF_WorkType,
          wrk_sts_typ_cd: selected_value,
          type: '',
          Dashoard_type: '',
          emp_det_work_grp: EmpWorkGrp,
          emp_id: EmpID,
          Folder:SPLIT_URL3,
          dvc_id:dvc_id,
          MobileURL:BaseUrl
        };
      } else if (route.params.Screenname === 'MyWorkOrder') {
        userStr = {
          site_cd: Site_cd,
         wkr_mst_wr_no:'',
          wko_mst_wo_no: '',
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
          wko_det_assign_to: EmpID,
          wko_det_work_type: '',
          wrk_sts_typ_cd: selected_value,
          type: '',
          Dashoard_type: '',
          emp_det_work_grp: EmpWorkGrp,
          emp_id: EmpID,
          wko_det_supv_id:'',
          wko_mst_chg_costcenter:'',
          Folder:SPLIT_URL3,
          dvc_id:dvc_id,
          MobileURL:BaseUrl
        };
      } else if (route.params.Screenname === 'WoDashboard') {
        switch (route.params.type) {
          case 'My_WO':
            userStr = {
              site_cd: Site_cd,
             wkr_mst_wr_no:'',
              wko_mst_wo_no: '',
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
              wko_det_assign_to: EmpID,
              wko_det_work_type: '',
              wrk_sts_typ_cd: selected_value,
              type: 'My_WO',
              Dashoard_type: '',
              emp_det_work_grp: EmpWorkGrp,
              emp_id: EmpID,
              wko_det_supv_id:'',
              wko_mst_chg_costcenter:'',
              Folder:SPLIT_URL3,
              dvc_id:dvc_id,
              MobileURL:BaseUrl
            };
            break;

          case 'assign':
            userStr = {
              site_cd: Site_cd,
             wkr_mst_wr_no:'',
              wko_mst_wo_no: '',
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
              wrk_sts_typ_cd: selected_value,
              type: 'assign',
              Dashoard_type: '',
              emp_det_work_grp: EmpWorkGrp,
              emp_id: EmpID,
              wko_det_supv_id:'',
              wko_mst_chg_costcenter:'',
              Folder:SPLIT_URL3,
              dvc_id:dvc_id,
              MobileURL:BaseUrl
            };
            break;

          case 'notcomplete':
            userStr = {
              site_cd: Site_cd,
             wkr_mst_wr_no:'',
              wko_mst_wo_no: '',
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
              wrk_sts_typ_cd: selected_value,
              type: 'notcomplete',
              Dashoard_type: '',
              emp_det_work_grp: EmpWorkGrp,
              emp_id: EmpID,
              wko_det_supv_id:'',
              wko_mst_chg_costcenter:'',
              Folder:SPLIT_URL3,
              dvc_id:dvc_id,
              MobileURL:BaseUrl
            };

            break;

          case 'pmcurrent':
            var now = new Date();
            var firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
            var dateone = moment(firstDay).format('YYYY-MM-DD hh:mm');

            console.log(firstDay); // 👉️ Sat Oct 01 2022 ...

            var lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            var datetwo = moment(lastDay).format('YYYY-MM-DD hh:mm');
            console.log(lastDay); // 👉️ Mon Oct 31 2022 ...

            userStr = {
              site_cd: Site_cd,
             wkr_mst_wr_no:'',
              wko_mst_wo_no: '',
              wko_mst_assetno: '',
              wko_mst_descs: '',
              wko_mst_originator: '',
              wko_mst_status: '',
              wko_mst_work_area: '',
              wko_mst_type: 'P',
              wko_mst_asset_location: '',
              wko_mst_asset_level: '',
              wko_mst_org_date: dateone,
              wko_mst_due_date: datetwo,
              asset_shortdesc: '',
              wko_det_assign_to: '',
              wko_det_work_type: '',
              wrk_sts_typ_cd: selected_value,
              type: 'notcomplete',
              Dashoard_type: '',
              emp_det_work_grp: EmpWorkGrp,
              emp_id: EmpID,
              wko_det_supv_id:'',
              wko_mst_chg_costcenter:'',
              Folder:SPLIT_URL3,
              dvc_id:dvc_id,
              MobileURL:BaseUrl
            };

            break;

          case 'pmnext':
            var nownext = new Date();

            const nextfirstDay = new Date(
              nownext.getFullYear(),
              nownext.getMonth() + 1,
              1,
            );
            var dateone = moment(nextfirstDay).format('YYYY-MM-DD hh:mm');

            console.log(dateone); // 👉️ Sat Oct 01 2022 ...

            const nextlastDay = new Date(
              nownext.getFullYear(),
              nownext.getMonth() + 2,
              0,
            );
            var datetwo = moment(nextlastDay).format('YYYY-MM-DD hh:mm');
            console.log(lastDay); // 👉️ Mon Oct 31 2022 ...

            userStr = {
              site_cd: Site_cd,
             wkr_mst_wr_no:'',
              wko_mst_wo_no: '',
              wko_mst_assetno: '',
              wko_mst_descs: '',
              wko_mst_originator: '',
              wko_mst_status: '',
              wko_mst_work_area: '',
              wko_mst_type: 'P',
              wko_mst_asset_location: '',
              wko_mst_asset_level: '',
              wko_mst_org_date: dateone,
              wko_mst_due_date: datetwo,
              asset_shortdesc: '',
              wko_det_assign_to: '',
              wko_det_work_type: '',
              wrk_sts_typ_cd: selected_value,
              type: 'notcomplete',
              Dashoard_type: '',
              emp_det_work_grp: EmpWorkGrp,
              emp_id: EmpID,
              wko_det_supv_id:'',
              wko_mst_chg_costcenter:'',
              Folder:SPLIT_URL3,
              dvc_id:dvc_id,
              MobileURL:BaseUrl
            };

            break;

          case 'pmprevious':
            const previousnow = new Date();

            const previousfirstDay = new Date(
              previousnow.getFullYear(),
              previousnow.getMonth() - 1,
              1,
            );
            var dateone = moment(previousfirstDay).format('YYYY-MM-DD hh:mm');

            console.log(dateone); // 👉️ Sat Oct 01 2022 ...

            const previouslastDay = new Date(
              previousnow.getFullYear(),
              previousnow.getMonth(),
              0,
            );
            var datetwo = moment(previouslastDay).format('YYYY-MM-DD hh:mm');
            console.log(lastDay); // 👉️ Mon Oct 31 2022 ...

            userStr = {
              site_cd: Site_cd,
             wkr_mst_wr_no:'',
              wko_mst_wo_no: '',
              wko_mst_assetno: '',
              wko_mst_descs: '',
              wko_mst_originator: '',
              wko_mst_status: '',
              wko_mst_work_area: '',
              wko_mst_type: 'P',
              wko_mst_asset_location: '',
              wko_mst_asset_level: '',
              wko_mst_org_date: dateone,
              wko_mst_due_date: datetwo,
              asset_shortdesc: '',
              wko_det_assign_to: '',
              wko_det_work_type: '',
              wrk_sts_typ_cd: selected_value,
              type: 'notcomplete',
              Dashoard_type: '',
              emp_det_work_grp: EmpWorkGrp,
              emp_id: EmpID,
              wko_det_supv_id:'',
              wko_mst_chg_costcenter:'',
              Folder:SPLIT_URL3,
              dvc_id:dvc_id,
              MobileURL:BaseUrl
            };

            break;
        }
      } else if (route.params.Screenname == 'AssetListing') {
        userStr = {
          site_cd: Site_cd,
         wkr_mst_wr_no:'',
          wko_mst_wo_no: '',
          wko_mst_assetno: route.params.ASL_Assetno,
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
          wrk_sts_typ_cd: selected_value,
          type: '',
          Dashoard_type: '',
          emp_det_work_grp: EmpWorkGrp,
          emp_id: EmpID,
          wko_det_supv_id:'',
          wko_mst_chg_costcenter:'',
          Folder:SPLIT_URL3,
          dvc_id:dvc_id,
          MobileURL:BaseUrl
        };
      } else if (route.params.Screenname == 'ScanAssetMaster') {
        userStr = {
          site_cd: Site_cd,
         wkr_mst_wr_no:'',
          wko_mst_wo_no: '',
          wko_mst_assetno: route.params.ScanAssetno,
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
          wrk_sts_typ_cd: selected_value,
          type: '',
          Dashoard_type: '',
          emp_det_work_grp: EmpWorkGrp,
          emp_id: EmpID,
          wko_det_supv_id:'',
          wko_mst_chg_costcenter:'',
          Folder:SPLIT_URL3,
          dvc_id:dvc_id,
          MobileURL:BaseUrl
        };
      } else if (route.params.Screenname === 'MYWO_Dashboard_Due') {
        userStr = {
          site_cd: Site_cd,
         wkr_mst_wr_no:'',
          wko_mst_wo_no: '',
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
          wko_det_assign_to: EmpID,
          wko_det_work_type: '',
          wrk_sts_typ_cd: selected_value,
          type: '',
          Dashoard_type: 'Due',
          emp_det_work_grp: EmpWorkGrp,
          emp_id: EmpID,
          wko_det_supv_id:'',
          wko_mst_chg_costcenter:'',
          Folder:SPLIT_URL3,
          dvc_id:dvc_id,
          MobileURL:BaseUrl
        };
      } else if (route.params.Screenname === 'MYWO_Dashboard_Past') {
        userStr = {
          site_cd: Site_cd,
          wkr_mst_wr_no:'',
          wko_mst_wo_no: '',
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
          wko_det_assign_to: EmpID,
          wko_det_work_type: '',
          wrk_sts_typ_cd: selected_value,
          type: '',
          Dashoard_type: 'Past',
          emp_det_work_grp: EmpWorkGrp,
          emp_id: EmpID,
          wko_det_supv_id:'',
          wko_mst_chg_costcenter:'',
          Folder:SPLIT_URL3,
          dvc_id:dvc_id,
          MobileURL:BaseUrl
        };
      }

      console.log('USE DATA Work Order Listing: ' + JSON.stringify(userStr));

      try {
        const response = await axios.post( `${BaseUrl}/get_workorderlist_test.php?`, JSON.stringify(userStr));
        //console.log("JSON DATA : " + response.data.data)
        if (response.data.status === 'SUCCESS') {
          
          if (response.data.data.length > 0) {
            //console.log(responsedata.status)
            //console.log(responsedata.message)
            //console.log(responsedata.data)

            if (selected_value == 'Open') {
              setcolorcode1('#0096FF');
              setcolorcode2('#FFF');
              setcolorcode3('#FFF');
              setcolorcode4('#8BC34A');
              setstatus('OPN');
            } else if (selected_value == 'Complete') {
              setcolorcode1('#FFF');
              setcolorcode2('#0096FF');
              setcolorcode3('#FFF');
              setcolorcode4('#F4D03F');
              setstatus('CMP');
            } else if (selected_value == 'Close') {
              setcolorcode1('#FFF');
              setcolorcode2('#FFF');
              setcolorcode3('#0096FF');
              setcolorcode4('#FF0000');
              setstatus('CLO');
            }

            setOpen(response.data.Opens);
            setComplete(response.data.Complete);
            setClose(response.data.Closes);
            setWorkOrderList(response.data.data);
            setFilteredDataSource(response.data.data);
            setspinner(false);
          } else {
            setspinner(false);
            setAlert(true, 'warning', response.data.message);
          }
        } else {
          setspinner(false);
          setAlert(true, 'danger', response.data.message);
          return;
        }
      } catch (error) {
        setspinner(false);
        alert(error);
      }
    }
  };

  const setAlert = (show, theme, title) => {
    setShow(show);
    setTheme(theme);
    setTitle(title);
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
      const newData = WorkOrderList.filter(function (item) {
        //const itemData = item.ast_mst_asset_no ? item.ast_mst_asset_no.toUpperCase() : ''.toUpperCase();
          //const itemData = item.ast_mst_asset_no.toUpperCase(),;
          const itemData = `${item.wko_mst_wo_no.toUpperCase()}
          ,${item.wko_mst_assetno.toUpperCase()}`
      
        const textData =  e.data.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(e.data);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(WorkOrderList);
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
      <Appbar.Header style={{backgroundColor: '#42A5F5'}}>
        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', }}>
          <Pressable onPress={_goBack}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <FontAwesome name="angle-left" color="#fff" size={55} style={{marginLeft: 15, marginBottom: 5}} />
              <Text style={{ fontSize: 20, justifyContent: 'center', textAlign: 'center', color: '#fff', fontWeight: 'bold', marginLeft: 15, }}> {HeaderTitle} </Text>
            </View>
          </Pressable>

          <View style={{flexDirection: 'row', alignItems: 'center',display: TabVisible ? 'flex' : 'none',}}>
            <Pressable onPress={() => navigation.navigate('FilteringWorkOrder')}> 
              <View style={{ justifyContent: 'center', alignItems: 'center', display: !isVisible ? 'flex' : 'none', }}>
                <Text style={{ fontSize: 15, justifyContent: 'center', textAlign: 'center', color: '#fff', fontWeight: 'bold', marginLeft: 15, }}> Filter </Text>
                <Image source={require('../../images/filter.png')} style={{width: 30, height: 30, marginLeft: 10}} />
              </View>
            </Pressable>

            <Pressable onPress={() => navigation.navigate('CreateWorkOrder', { Screenname: 'CreateWorkOrder', }) }>
              <View style={{ justifyContent: 'center', alignItems: 'center', marginRight: 20, }}>
                <Text style={{ fontSize: 15, justifyContent: 'center', textAlign: 'center', color: '#fff', fontWeight: 'bold', marginLeft: 15, }}> New </Text>
                <Image source={require('../../images/floating.png')} style={{width: 30, height: 30, marginLeft: 10}} />
              </View>
            </Pressable>
          </View>
        </View>
      </Appbar.Header>

      <View style={styles.container}>

        <ProgressLoader visible={spinner} isModal={true} isHUD={true} hudColor={'#808080'} color={'#FFFFFF'} />

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

        <SCLAlert theme={Theme} show={Show} title={Title}>
          <SCLAlertButton theme={Theme} onPress={() => setShow(false)}> OK </SCLAlertButton>
        </SCLAlert>

        <View style={styles.view_2}>
          <Button
            title="Open"
            titleStyle={{ color: 'white', fontSize: 16, fontWeight: 'bold'}}
            onPress={() => Button_select_list('Open')}
            buttonStyle={{ backgroundColor: '#8BC34A', borderRadius: 3}}
            containerStyle={{ flex: 1, marginHorizontal: 5}}
          />

          <Button
            title="Complete"
            titleStyle={{ color: 'white', fontSize: 16, fontWeight: 'bold'}}
            onPress={() => Button_select_list('Complete')}
            buttonStyle={{ backgroundColor: '#F4D03F', borderRadius: 3}}
            containerStyle={{ flex: 1, marginHorizontal: 5}}
          />

          <Button
            title="Close"
            titleStyle={{ color: 'white', fontSize: 16, fontWeight: 'bold'}}
            onPress={() => Button_select_list('Close')}
            buttonStyle={{ backgroundColor: '#FF0000', borderRadius: 3}}
            containerStyle={{ flex: 1, marginHorizontal: 5}}
          />
        </View>

        <View style={styles.view_4}>
          <View style={{ flex: 1, backgroundColor: colorcode1, height: 2, marginHorizontal: 5}}></View>
          <View style={{ flex: 1, backgroundColor: colorcode2, height: 2, marginHorizontal: 5}}></View>
          <View style={{ flex: 1, backgroundColor: colorcode3, height: 2, marginHorizontal: 5}}></View>
        </View>

        <View style={styles.view_3}>
          <Text style={{ color: '#8BC34A', fontSize: 15, fontWeight: 'bold', flex: 1, textAlign: 'center', alignItems: 'center', justifyContent: 'center'}}> {Open} </Text>
          <Text style={{ color: '#F4D03F', fontSize: 15, fontWeight: 'bold', flex: 1, textAlign: 'center', alignItems: 'center', justifyContent: 'center'}}> {Complete} </Text>
          <Text style={{ color: '#FF0000', fontSize: 15, fontWeight: 'bold', flex: 1, textAlign: 'center', alignItems: 'center', justifyContent: 'center'}}> {Close} </Text>
        </View>

        {/* <FlatList

            data={filteredDataSource}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => selected_list(item.ast_mst_asset_no)}>
                <View style={styles.item}>
                  <Text style={{color:'#2962FF'}} >Asset_no :{item.ast_mst_asset_no}</Text>
                  <Text >Cost Center :{item.ast_mst_cost_center}</Text>
                  <Text >Work Area :{item.mst_war_work_area}</Text>
                  <Text >Asset Location :{item.ast_mst_asset_locn}</Text>
                  <Text >Level :{item.ast_mst_asset_lvl}</Text>           
                  <Text >Short Description :{item.ast_mst_asset_shortdesc}</Text>
                  <Text >Long Description :{item.ast_mst_asset_longdesc}</Text>
              </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={renderSeparator}
            ListHeaderComponent={renderHeader}
        
        /> */}

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
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={ItemSeparatorView}
          renderItem={ItemView}
          
        />
      </View>
    </SafeAreaProvider>
  );
};
export default WorkOrderListing;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  view_2: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: '#FFFF',
    paddingTop: 5,
  },
  view_3: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: '#FFFF',
    paddingTop: 5,
    paddingBottom: 5,
  },
  view_4: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: '#FFFF',
    paddingTop: 5,
  },
  view_5:{        
        
    flexDirection: 'row',       
    justifyContent: 'center',
    textAlign: 'center',
    alignItems:'center',
    marginHorizontal:5,
    backgroundColor:"#E5E7E9",
  },
  item: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
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
