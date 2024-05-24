import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, Image, RefreshControl, FlatList, ScrollView, Pressable, } from 'react-native';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Appbar} from 'react-native-paper';

import ProgressLoader from 'rn-progress-loader';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import {openDatabase} from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import {useTheme} from 'react-native-paper';
import StepIndicator from 'react-native-step-indicator';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {SearchBar} from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {TextInput} from 'react-native-element-textinput';
import RNFetchBlob from 'react-native-blob-util';
import RNFS from 'react-native-fs';
import ImagePicker from 'react-native-image-picker';
import {PacmanIndicator} from 'react-native-indicators';
import uuid from 'react-native-uuid';
import {PermissionsAndroid} from 'react-native';
import { DeleteMedia, ErrorCodes } from "react-native-delete-media";
import {SCLAlert, SCLAlertButton} from 'react-native-scl-alert';

const fs = RNFetchBlob.fs;

var db = openDatabase({name: 'CMMS.db'});
let Baseurl, Site_cd, LoginID, EmpName, EmpID, EmpPhone, EmpWorkGrp, dvc_id, WIFI;

const SyncingData = ({route, navigation}) => {
  const {colors} = useTheme();

  const _goBack = () => {
    navigation.navigate('MainTabScreen');
  };
  const [spinner, setspinner] = React.useState(false);

  const [Editable, setEditable] = React.useState(false);
  const [height, setHeight] = React.useState(0);

  const [Asset_modalVisible, setAsset_modalVisible] = React.useState(false);


  //Asset POP UP DropDown
  const [AssetType, setAssetType] = React.useState();
  const [AssetGroupCode, setAssetGroupCode] = React.useState();
  const [Assetcode, setAssetcode] = React.useState();
  const [WorkArea, setWorkArea] = React.useState();
  const [AssetLocation, setAssetLocation] = React.useState();
  const [AssetLevel, setAssetLevel] = React.useState();
  const [CostCenter, setCostCenter] = React.useState();

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

  const [isDatepickerVisible, setDatePickerVisibility] = React.useState(false);
  const [Type, setType] = React.useState('');

  const [wifiname, setwifiname] = React.useState('wifi');
  const [wificolor, setwificolor] = React.useState('green');
  const [OnlineText, setOnlineText] = React.useState('Online');
  const [OnText, setOnText] = React.useState('On');

  const [wifi_data ,setwifi_data] = React.useState({

    wifiname:'wifi',
    wificolor:'green',
    OnlineText:'Online',
    OnText:'On',
    
  });


  const [modalVisible, setmodalVisible] = React.useState(false);

  const [Indicators_Visible, setIndicators_Visible] = React.useState(false);
  const [Indicators_step, setIndicators_step] = React.useState('');
  const [Indicators_text, setIndicators_text] = React.useState('');

  const [AssetCount, setAssetCount] = React.useState('0');
  const [WorkOrderCount, setWorkOrderCount] = React.useState('0');
  const [WorkOrderCompletionCount, setWorkOrderCompletionCount] = React.useState('0');
  const [WorkOrderAcknowledgementCount, setWorkOrderAcknowledgementCount] = React.useState('0');
  const [WorkOrderResponseCount, setWorkOrderResponseCount] = React.useState('0');
  const [WorkOrderChecklistCount, setWorkOrderChecklistCount] = React.useState('0');
  const [WorkOrderTimeCardCount, setWorkOrderTimeCardCount] = React.useState('0');
  const [AssetDownTimeCount, setAssetDownTimeCount] = React.useState('0');

  

  let [progress, setprogress] = React.useState('');

  //Alert
  const [Show, setShow] = React.useState(false);
  const [Show_two, setShow_two] = React.useState(false);
  const [Theme, setTheme] = React.useState('');
  const [Title, setTitle] = React.useState('');
  const [AlertType, setAlertType] = React.useState('');

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
    WIFI = await AsyncStorage.getItem('WIFI');


    if (WIFI == 'OFFLINE') {

      setwifi_data({...wifi_data,
      
        wifiname:'wifi-off',
        wificolor:'red',
        OnlineText:'Offline',
        OnText:'Off',

      })
      
    } else {

      setwifi_data({...wifi_data,
      
        wifiname:'wifi',
        wificolor:'green',
        OnlineText:'Online',
        OnText:'On',

      })

     
    }

    db.transaction(function (txn) {

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
      

      //wko_mst
      txn.executeSql('SELECT * FROM wko_mst', [], (tx, results) => {
        setWorkOrderCount(results.rows.length)
        
      });

      //wko_det_completion
      txn.executeSql('SELECT * FROM wko_det_completion', [], (tx, results) => {
        setWorkOrderCompletionCount(results.rows.length)
        
      });

      //wko_det_ackowledgement
      txn.executeSql( 'SELECT * FROM wko_det_ackowledgement', [], (tx, results) => {
        setWorkOrderAcknowledgementCount(results.rows.length)
       
        },
      );

      //wko_isp_heard
      txn.executeSql('SELECT * FROM wko_isp_heard', [], (tx, results) => {
        setWorkOrderChecklistCount(results.rows.length)
       
      });

      //wko_det_response
      txn.executeSql('SELECT * FROM wko_det_response', [], (tx, results) => {
        setWorkOrderResponseCount(results.rows.length)
        
      });

      //wko_ls8_timecard
      txn.executeSql('SELECT * FROM wko_ls8_timecard', [], (tx, results) => {
        setWorkOrderTimeCardCount(results.rows.length)
        
      });

      //ast_dwntime
      txn.executeSql('SELECT * FROM ast_dwntime', [], (tx, results) => {
        setAssetDownTimeCount(results.rows.length)
        
      });

      setspinner(false);
    });
  };

  const get_offline = async() => {

    WIFI = await AsyncStorage.getItem('WIFI');
    
    if (WIFI == 'OFFLINE') {
      Alert.alert(
        'Mode Switching',
        'Do you confirm to switch to online mode?',
        [
          {text: 'No'},

          {text: 'Yes', onPress: () => get_offline_New_WorkOrder_list()},
          //{text: 'Yes', onPress: () => get_offline_WKO_images()},
        ],
      );
    } else {
      Alert.alert(
        'Mode Switching',
        'Do you confirm to switch to offline mode?',
        [
          {text: 'No'},
          {text: 'Yes', onPress: () => open_search_asset_box()}
          //{text: 'Yes', onPress: () => get_report_current_week()}
        ],
      );

     
     
    }
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
    if (Type === 'Box-from') {
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

  //ASSET SEARCH BOX
  const open_search_asset_box = () => {

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

    db.transaction(tx => {

      //01 ast_mst
      tx.executeSql('DELETE FROM  ast_mst', [], (tx, results) => {
        console.log('ast_mst Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('ast_mst deleted successfully');
        } else {
          console.log('ast_mst unsuccessfully');
        }
      });

      //02 wko_mst
      tx.executeSql('DELETE FROM  wko_mst', [], (tx, results) => {
        console.log('wko_mst Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('wko_mst deleted successfully');
        } else {
          console.log('wko_mst unsuccessfully');
        }
      });

      //03 wko_det_completion
      tx.executeSql('DELETE FROM  wko_det_completion', [], (tx, results) => {
        console.log('wko_det_completion Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('wko_det_completion deleted successfully');
        } else {
          console.log('wko_det_completion unsuccessfully');
        }
      });

      //04 wko_det_ackowledgement
      tx.executeSql(
        'DELETE FROM  wko_det_ackowledgement',
        [],
        (tx, results) => {
          console.log('wko_det_ackowledgement Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            console.log('wko_det_ackowledgement deleted successfully');
          } else {
            console.log('wko_det_ackowledgement unsuccessfully');
          }
        },
      );

      //05 wko_isp_heard
      tx.executeSql('DELETE FROM  wko_isp_heard', [], (tx, results) => {
        console.log('wko_isp_heard Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('wko_isp_heard deleted successfully');
        } else {
          console.log('wko_isp_heard unsuccessfully');
        }
      });

      //06 wko_isp_details
      tx.executeSql('DELETE FROM  wko_isp_details', [], (tx, results) => {
        console.log('wko_isp_details Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('wko_isp_details deleted successfully');
        } else {
          console.log('wko_isp_details unsuccessfully');
        }
      });

      //07 stp_zom
      tx.executeSql('DELETE FROM  stp_zom', [], (tx, results) => {
        console.log('stp_zom Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('stp_zom deleted successfully');
        } else {
          console.log('stp_zom unsuccessfully');
        }
      });

      //08 stp_zom
      tx.executeSql('DELETE FROM  wko_ls8_timecard', [], (tx, results) => {
        console.log('wko_ls8_timecard Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('wko_ls8_timecard deleted successfully');
        } else {
          console.log('wko_ls8_timecard unsuccessfully');
        }
      });

      //09 prm_ast
      tx.executeSql('DELETE FROM  prm_ast', [], (tx, results) => {
        console.log('prm_ast Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('prm_ast deleted successfully');
        } else {
          console.log('prm_ast unsuccessfully');
        }
      });

      //10 wko_det_response
      tx.executeSql('DELETE FROM  wko_det_response', [], (tx, results) => {
        console.log('wko_det_response Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('wko_det_response deleted successfully');
        } else {
          console.log('wko_det_response unsuccessfully');
        }
      });

      //11 ast_dwntime
      tx.executeSql('DELETE FROM  ast_dwntime', [], (tx, results) => {
        console.log('ast_dwntime Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('ast_dwntime deleted successfully');
        } else {
          console.log('ast_dwntime unsuccessfully');
        }
      });

      //12 report_current_week
      tx.executeSql('DELETE FROM  report_current_week', [], (tx, results) => {
        console.log('report_current_week Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('report_current_week deleted successfully');
        } else {
          console.log('report_current_week unsuccessfully');
        }
      });

      //13 wko_ref
      tx.executeSql('DELETE FROM  wko_ref', [], (tx, results) => {
        console.log('wko_ref Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('wko_ref deleted successfully');
        } else {
          console.log('wko_ref unsuccessfully');
        }
      });
    });

    setAsset_modalVisible(true);

    console.log('Asset_modalVisible', Asset_modalVisible);
    //setIndicators_Visible(true);
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
      alert('Please select at least one criteria to search');
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
    }

    console.log('Asset Master Count: ' + JSON.stringify(Asset_retrieve));

    try {
      const response = await axios.post( `${Baseurl}/get_assetmaster_count.php?`, JSON.stringify(Asset_retrieve), );

      if (response.data.status === 'SUCCESS') {
        //console.log('Asset Master Count Response : ' + response.data.status);
        //console.log('Asset Master Count Response : ' + response.data.message);
        //console.log('Asset Master Count Response : ' + response.data.data);

        if (response.data.data >= 1000) {
          setspinner(false);
          Alert.alert(
            response.data.status,
            `The Current Filter return: ${response.data.data} record, it will take some time to download.Do you still want to continue?`,
            [
              {text: 'No'},
              {
                text: 'Yes',
                onPress: () => {
                  get_assetmaster();
                },
              },
            ],
          );
        } else {
          setspinner(false);
          get_assetmaster();
        }
      } else {
        setspinner(false);
        alert('Asset count :', response.data.message);
      }
    } catch (error) {
      setspinner(false);
      alert('Asset count :', error);
    }
  };

  //GET ASSET MASTER LIST API
  const get_assetmaster = async () => {
    setIndicators_Visible(true);
    setIndicators_step('01');
    setIndicators_text('Asset Master Data syncing....');

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

    //console.log('Asset Master Data: ' + JSON.stringify(Asset_retrieve));

    try {
      const response = await axios.post( `${Baseurl}/get_assetmaster.php?`, JSON.stringify(Asset_retrieve));
      console.log( 'Asset Master Response : ' + JSON.stringify(response.data.data.length));

      if (response.data.status === 'SUCCESS') {
        if (response.data.data.length > 0) {
          db.transaction(function (tx) {
            let insertQuery = 'INSERT INTO ast_mst (site_cd,RowID,ast_mst_wrk_grp,ast_mst_asset_no,ast_mst_asset_grpcode,ast_mst_asset_shortdesc,ast_mst_asset_longdesc,ast_mst_perm_id,ast_det_cus_code,ast_mst_asset_type,ast_mst_asset_code,mst_war_work_area,ast_mst_asset_locn,ast_mst_asset_lvl,ast_mst_asset_status,ast_mst_cri_factor,ast_mst_cost_center,Asset_Status_Category,ast_det_warranty_date) VALUES';
            let values = [];
            response.data.data.forEach((record, index) => {

              var warranty_date;

              if ( record.ast_det_warranty_date.date === '1900-01-01 00:00:00.000000' ) {
                warranty_date = null;
              } else {
                warranty_date = moment( record.ast_det_warranty_date.date).format('yyyy-MM-DD HH:mm');
              }

              insertQuery += '(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?),';
              values.push( record.site_cd, record.RowID, record.ast_mst_wrk_grp, record.ast_mst_asset_no, record.ast_mst_asset_grpcode, record.ast_mst_asset_shortdesc, record.ast_mst_asset_longdesc, record.ast_mst_perm_id, record.ast_det_cus_code, record.ast_mst_asset_type, record.ast_mst_asset_code, record.mst_war_work_area, record.ast_mst_asset_locn, record.ast_mst_asset_lvl, record.ast_mst_asset_status, record.ast_mst_cri_factor, record.ast_mst_cost_center, record.Asset_Status_Category, warranty_date, );

              //console.log('Asset Master Done', values);

              const batchSize = 20;
              if ( (index + 1) % batchSize === 0 || index === response.data.data.length - 1 ) {
                insertQuery = insertQuery.slice(0, -1);
                tx.executeSql(insertQuery, values, (tx, results) => {
                  if (results.rowsAffected > 0) {
                    //console.log('INSERT TABLE ast_mst Successfully');
                  } else {
                    console.log('INSERT TABLE ast_mst unsuccessfully');
                    alert('Step : 01 Asset Master Insert Table unsuccessfully');
                  }
                });

                insertQuery = 'INSERT INTO ast_mst (site_cd,RowID,ast_mst_wrk_grp,ast_mst_asset_no,ast_mst_asset_grpcode,ast_mst_asset_shortdesc,ast_mst_asset_longdesc,ast_mst_perm_id,ast_det_cus_code,ast_mst_asset_type,ast_mst_asset_code,mst_war_work_area,ast_mst_asset_locn,ast_mst_asset_lvl,ast_mst_asset_status,ast_mst_cri_factor,ast_mst_cost_center,Asset_Status_Category,ast_det_warranty_date) VALUES';
                values = [];
              }
            });
          });

          get_workorder_listing();
        } else {
          setIndicators_Visible(false);
          alert('Step: 01 Asset Master', response.data.message);
        }
      } else {
        setIndicators_Visible(false);
        alert('Step: 01 Asset Master', response.data.message);
      }
    } catch (error) {
      setIndicators_Visible(false);
      alert('Step: 01 Asset Master', error);
    }
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

      if ( textvalue == 'Asset Type' || Boxtextvalue == 'Box Asset Type' ) {
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
      } else if ( textvalue == 'Asset Location' || Boxtextvalue == 'Box Asset Location' ) {
        newData = Dropdown_data.filter(function (item) {
          const itemData = `${item.ast_loc_ast_loc.toUpperCase()},
                ,${item.ast_loc_desc.toUpperCase()})`;

          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      } else if ( textvalue == 'Asset Level' || Boxtextvalue == 'Box Asset Level' ) {
        newData = Dropdown_data.filter(function (item) {
          const itemData = `${item.ast_lvl_ast_lvl.toUpperCase()},
                ,${item.ast_lvl_desc.toUpperCase()})`;

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

    if (textvalue == 'Asset Type' || Boxtextvalue == 'Box Asset Type') {
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
    } 

    setRefreshing(false);
  }, [refreshing]);

  const renderText = item => {
    if (textvalue == 'Asset Type' || Boxtextvalue == 'Box Asset Type') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Type Code : </Text>
            </View>
            <View style={{flex: 2}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.ast_type_cd} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Description : </Text>
            </View>
            <View style={{flex: 2}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.ast_type_descs} </Text>
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
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.mst_war_desc} </Text>
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
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.ast_loc_ast_loc} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Description : </Text>
            </View>
            <View style={{flex: 1.5}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.ast_loc_desc} </Text>
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
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.ast_lvl_ast_lvl} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Description : </Text>
            </View>
            <View style={{flex: 2}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.ast_lvl_desc} </Text>
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

     if (textvalue == 'Asset Group Code') {
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
    } 

    setDropDown_search('');
    setDropDown_modalVisible(!DropDown_modalVisible);
  };

  

  //Step 02 GET WORK ORDER
  const get_workorder_listing = async () => {
    setIndicators_step('02');
    setIndicators_text('Work Order Master Data syncing....');

    let userStr = {
      site_cd: Site_cd,
      wrk_sts_typ_cd: '',
      wko_mst_wo_no: '',
      wkr_mst_wr_no:'',
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
      type: '',
      Dashoard_type: '',
      emp_det_work_grp: EmpWorkGrp,
      emp_id: EmpID,
      wko_det_supv_id:'',
      wko_mst_chg_costcenter:'',
    };

    //console.log('USE DATA Work Order Listing: ' + JSON.stringify(userStr));

    try {
      const response = await axios.post( `${Baseurl}/get_workorderlist.php?`, JSON.stringify(userStr));
      //console.log("JSON DATA : " + response.data.data)
      console.log(' Work Order Master Length: ', response.data.data.length);

      if (response.data.status === 'SUCCESS') {
        if (response.data.data.length > 0) {
          db.transaction(function (tx) {
            let insertQuery = 'INSERT INTO wko_mst (RowID, site_cd, wko_mst_originator, wko_mst_phone, wko_mst_assetno, ast_mst_asset_shortdesc, ast_mst_asset_group, wko_mst_work_area, wko_mst_asset_location, wko_mst_asset_level, wko_mst_chg_costcenter, wko_mst_wo_no, wko_mst_orig_priority, wko_mst_plan_priority, wko_mst_org_date, wko_mst_due_date, wko_mst_type, wko_mst_flt_code, wko_mst_descs, wko_mst_status, wko_det_assign_to,per_assignto, wko_det_work_type, wko_det_laccount, wko_det_caccount, wko_det_maccount, wko_mst_pm_grp, wko_det_work_grp, wrk_sts_typ_cd, wko_mst_ast_cod, assigndate, wko_det_varchar9, wko_det_varchar10, wko_det_datetime5, wko_mst_asset_status) VALUES';
            let values = [];

            response.data.data.forEach((record, index) => {
              let org_date, due_date, datetime5, assigndate;

              if ( record.wko_mst_org_date.date === '1900-01-01 00:00:00.000000') {
                org_date = null;
              } else {
                org_date = moment(record.wko_mst_org_date.date).format('yyyy-MM-DD HH:mm');
              }

              if ( record.wko_mst_due_date.date === '1900-01-01 00:00:00.000000' ) {
                due_date = null;
              } else {
                due_date = moment(record.wko_mst_due_date.date).format('yyyy-MM-DD HH:mm');
              }

              if ( record.wko_det_datetime5.date === '1900-01-01 00:00:00.000000' ) {
                datetime5 = null;
              } else {
                datetime5 = moment(record.wko_det_datetime5.date).format('yyyy-MM-DD HH:mm');
              }

              if (record.assigndate.date === '1900-01-01 00:00:00.000000') {
                assigndate = null;
              } else {
                assigndate = moment(record.assigndate.date).format('yyyy-MM-DD HH:mm');
              }

              insertQuery += '(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?),';
              values.push(
                record.RowID,
                record.site_cd,
                record.wko_mst_originator,
                record.wko_mst_phone,
                record.wko_mst_assetno,
                record.ast_mst_asset_shortdesc,
                record.wko_mst_asset_group_code,
                record.wko_mst_work_area,
                record.wko_mst_asset_location,
                record.wko_mst_asset_level,
                record.wko_mst_chg_costcenter,
                record.wko_mst_wo_no,
                record.wko_mst_orig_priority,
                record.wko_mst_plan_priority,
                org_date,
                due_date,
                record.wko_mst_type,
                record.wko_mst_flt_code,
                record.wko_mst_descs,
                record.wko_mst_status,
                record.wko_det_assign_to,
                record.wko_det_assign_to,
                record.wko_det_work_type,
                record.wko_det_laccount,
                record.wko_det_caccount,
                record.wko_det_maccount,
                record.wko_mst_pm_grp,
                record.wko_det_work_grp,
                record.wrk_sts_typ_cd,
                record.wko_mst_ast_cod,
                assigndate,
                record.wko_det_varchar9,
                record.wko_det_varchar10,
                datetime5,
                record.wko_mst_asset_status,
              );

              const batchSize = 20;
              if (
                (index + 1) % batchSize === 0 ||
                index === response.data.data.length - 1
              ) {
                insertQuery = insertQuery.slice(0, -1);

                tx.executeSql(insertQuery, values, (tx, results) => {
                  if (results.rowsAffected > 0) {
                    //console.log('INSERT TABLE wko_mst Successfully');
                  } else {
                    setIndicators_Visible(false);
                    alert( 'Step :02 Work Order Master Insert Table unsuccessfully', );
                  }
                });

                insertQuery = 'INSERT INTO wko_mst (RowID, site_cd, wko_mst_originator, wko_mst_phone, wko_mst_assetno, ast_mst_asset_shortdesc, ast_mst_asset_group, wko_mst_work_area, wko_mst_asset_location, wko_mst_asset_level, wko_mst_chg_costcenter, wko_mst_wo_no, wko_mst_orig_priority, wko_mst_plan_priority, wko_mst_org_date, wko_mst_due_date, wko_mst_type, wko_mst_flt_code, wko_mst_descs, wko_mst_status, wko_det_assign_to,per_assignto, wko_det_work_type, wko_det_laccount, wko_det_caccount, wko_det_maccount, wko_mst_pm_grp, wko_det_work_grp, wrk_sts_typ_cd, wko_mst_ast_cod, assigndate, wko_det_varchar9, wko_det_varchar10, wko_det_datetime5, wko_mst_asset_status) VALUES';
                values = [];
              }
            });
          });

          off_get_action_workoder();
        } else {
          off_get_action_workoder();
        }
      } else {
        setIndicators_Visible(false);
        alert('Step :02 Work Order Master : ' + response.data.message);
      }
    } catch (error) {
      setIndicators_Visible(false);
      alert('Step :02 Work Order Master : ' + error);
    }
  };

  //Step 03 GET Workorder Completion
  const off_get_action_workoder = async () => {
    setIndicators_step('03');
    setIndicators_text('Work Order Completion Data syncing....');

    // console.log( 'Work Order Completion : ' + `${Baseurl}/off_get_action_workorder.php?site_cd=${Site_cd}&wko_det_assign_to=${EmpID}`);
    const response = await axios.get( `${Baseurl}/off_get_action_workorder.php?site_cd=${Site_cd}&wko_det_assign_to=${EmpID}`, );

    try {
      console.log('Work Order Completion Length: ' + response.data.data.length);

      if (response.data.status === 'SUCCESS') {
        if (response.data.data.length > 0) {
          db.transaction(function (tx) {
            let insertQuery = 'INSERT INTO wko_det_completion (mst_RowID,RowID,site_cd,wko_det_cause_code,wko_det_act_code,wko_det_work_class,wko_det_work_grp,wko_mst_status,Is_checked,wko_det_corr_action,wko_mst_wo_no,wko_mst_assetno,wko_mst_work_area,wko_mst_asset_location,wko_mst_asset_level,wko_mst_org_date,wko_mst_due_date,wko_mst_descs,wko_det_note1,Requested_by,Contact_no,Assest_description) VALUES';
            let values = [];

            response.data.data.forEach((record, index) => {
              let org_date, due_date;

              if ( record.wko_mst_org_date.date === '1900-01-01 00:00:00.000000' ) {
                org_date = null;
              } else {
                org_date = moment(record.wko_mst_org_date.date).format('yyyy-MM-DD HH:mm');
              }

              if ( record.wko_mst_due_date.date === '1900-01-01 00:00:00.000000' ) {
                due_date = null;
              } else {
                due_date = moment(record.wko_mst_due_date.date).format('yyyy-MM-DD HH:mm');
              }

              insertQuery += '(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?),';
              values.push(
                record.mst_RowID,
                record.RowID,
                record.site_cd,
                record.wko_det_cause_code,
                record.wko_det_act_code,
                record.wko_det_work_class,
                record.wko_det_work_grp,
                record.wrk_sts_status,
                record.work_complete,
                record.wko_det_corr_action,
                record.wko_mst_wo_no,
                record.wko_mst_assetno,
                record.wko_mst_work_area,
                record.wko_mst_asset_location,
                record.wko_mst_asset_level,
                org_date,
                due_date,
                record.wko_mst_descs,
                record.wko_det_note1,
                record.wko_mst_originator,
                record.wko_mst_phone,
                record.ast_mst_asset_shortdesc,
              );

               const batchSize = 20;
              if (
                (index + 1) % batchSize === 0 ||
                index === response.data.data.length - 1
              ) {
                insertQuery = insertQuery.slice(0, -1);

                tx.executeSql(insertQuery, values, (tx, results) => {
                  if (results.rowsAffected > 0) {
                    //console.log('INSERT TABLE wko_det Successfully');
                  } else {
                    setIndicators_Visible(false);
                    alert( 'Step :03 Work Order Completion Insert Table unsuccessfully');
                  }
                });

                insertQuery = 'INSERT INTO wko_det_completion (mst_RowID,RowID,site_cd,wko_det_cause_code,wko_det_act_code,wko_det_work_class,wko_det_work_grp,wko_mst_status,Is_checked,wko_det_corr_action,wko_mst_wo_no,wko_mst_assetno,wko_mst_work_area,wko_mst_asset_location,wko_mst_asset_level,wko_mst_org_date,wko_mst_due_date,wko_mst_descs,wko_det_note1,Requested_by,Contact_no,Assest_description) VALUES';
                values = [];
              }
            });
          });

          off_get_acknowledgement_list();
        } else {
          off_get_acknowledgement_list();
        }
      } else {
        setIndicators_Visible(false);
        alert('Step :03 Work Order Completion : ' + response.data.message);
      }
    } catch (error) {
      setIndicators_Visible(false);
      alert('Step :03 Work Order Completion : ' + error);
    }
  };

  //Step 04 GET Workorder Acknowledgement
  const off_get_acknowledgement_list = async () => {
    setIndicators_step('04');
    setIndicators_text('Acknowledgement Data syncing....');

    //console.log( 'Work Order Acknowledgement : ' + `${Baseurl}/off_get_acknowledgement_list.php?site_cd=${Site_cd}&wko_det_assign_to=${EmpID}`, );
    const response = await axios.get( `${Baseurl}/off_get_acknowledgement_list.php?site_cd=${Site_cd}&wko_det_assign_to=${EmpID}`, );

    try {
      //console.log("JSON DATA Work Order Acknowledgement: " + response.data.status)
      console.log( 'Work Order Acknowledgement Length: ' + response.data.data.length, );

      if (response.data.status === 'SUCCESS') {
        if (response.data.data.length > 0) {
          db.transaction(function (tx) {
            let insertQuery = 'INSERT INTO wko_det_ackowledgement (site_cd,mst_RowID, RowID, wko_det_rating1, wko_det_rating2,wko_det_rating3,wko_det_ack_name,wko_det_ack_contact,wko_det_ack_id) VALUES ';
            let values = [];

            response.data.data.forEach((record, index) => {
              insertQuery += '(?,?,?,?,?,?,?,?,?),';
              values.push(
                record.site_cd,
                record.mst_RowID,
                record.RowID,
                record.wko_det_rating1,
                record.wko_det_rating2,
                record.wko_det_rating3,
                record.wko_det_ack_name,
                record.wko_det_ack_contact,
                record.wko_det_ack_id,
              );

               const batchSize = 20;
              if ( (index + 1) % batchSize === 0 || index === response.data.data.length - 1 ) {
                insertQuery = insertQuery.slice(0, -1);

                tx.executeSql(insertQuery, values, (tx, results) => {
                  if (results.rowsAffected > 0) {
                    //console.log( 'INSERT TABLE wko_det_ackowledgement Successfully', );
                  } else {
                    setIndicators_Visible(false);
                    alert( 'Step :04 Work Order ackowledgement Insert Table unsuccessfully', );
                  }
                });

                insertQuery = 'INSERT INTO wko_det_ackowledgement (site_cd,mst_RowID, RowID, wko_det_rating1, wko_det_rating2,wko_det_rating3,wko_det_ack_name,wko_det_ack_contact,wko_det_ack_id) VALUES';
                values = [];
              }
            });
          });

          get_workorder_response();
        } else {
          get_workorder_response();
        }
      } else {
        setIndicators_Visible(false);
        alert('Step :04 Work Order Acknowledgement : ' + response.data.message);
      }
    } catch (error) {
      setIndicators_Visible(false);
      alert('Step :04 Work Order Acknowledgement : ' + error);
    }
  };

  //Step 05 GET Work Order Response
  const get_workorder_response = async () => {
    setIndicators_step('05');
    setIndicators_text('Response Data syncing....');

    //console.log( 'Work Order Response : ' + `${Baseurl}/off_get_response.php?site_cd=${Site_cd}&wko_det_assign_to=${EmpID}`);
    const response = await axios.get( `${Baseurl}/off_get_response.php?site_cd=${Site_cd}&wko_det_assign_to=${EmpID}`, );

    try {
      console.log('Work Order Response Length: ' + response.data.data.length);

      if (response.data.status === 'SUCCESS') {
        if (response.data.data.length > 0) {
          db.transaction(function (tx) {
            let insertQuery = 'INSERT INTO wko_det_response (site_cd,RowID,mst_RowID,wko_det_tech_resp_date,wko_det_tech_resp_id,wko_det_resp_contact,wko_det_resp_id,wko_det_resp_name,wko_det_resp_date) VALUES';
            let values = [];

            response.data.data.forEach((record, index) => {

              

              let tech_resp_date, resp_date;
              if ( record.wko_det_tech_resp_date.date === '1900-01-01 00:00:00.000000' ) {
                tech_resp_date = null;
              } else {
                tech_resp_date = moment(record.wko_det_tech_resp_date.date).format('yyyy-MM-DD HH:mm');
              }

              if ( record.wko_det_resp_date.date === '1900-01-01 00:00:00.000000') {
                resp_date = null;
              } else {
                resp_date = moment(record.wko_det_resp_date.date).format('yyyy-MM-DD HH:mm');
              }

              insertQuery += '(?,?,?,?,?,?,?,?,?),';
              values.push( record.site_cd, record.RowID, record.mst_RowID, tech_resp_date, record.wko_det_tech_resp_id, record.wko_det_resp_contact, record.wko_det_resp_id, record.wko_det_resp_name, resp_date);

              
            //console.log('Work Order Response Length 3: ' + index);
               const batchSize = 20;
              if ( (index + 1) % batchSize === 0 || index === response.data.data.length - 1 ) {
                insertQuery = insertQuery.slice(0, -1);

                tx.executeSql(insertQuery, values, (tx, results) => {
                  if (results.rowsAffected > 0) {
                    //console.log('INSERT TABLE wko_det_response Successfully');
                  } else {
                    setIndicators_Visible(false);
                    alert( 'Step :05 Work Order Response Insert Table unsuccessfully', );
                  }
                });

                insertQuery = 'INSERT INTO wko_det_response (site_cd,RowID,mst_RowID,wko_det_tech_resp_date,wko_det_tech_resp_id,wko_det_resp_contact,wko_det_resp_id,wko_det_resp_name,wko_det_resp_date) VALUES';
                values = [];
              }
            });
          });

          get_timecared();
          
        } else {
          get_timecared();
           
        }
      } else {
        setIndicators_Visible(false);
        alert('Step: 05 Work Order Response' + response.data.message);
      }
    } catch (error) {
      setIndicators_Visible(false);
      alert('Step: 05 Work Order Response' + error);
    }
  };

  //Step 06 GET Workorder Time cared
  const get_timecared = async () => {
    setIndicators_step('06');
    setIndicators_text('Time Card Data syncing....');

    console.log( 'Work Order Time cared : ' + `${Baseurl}/get_timecard_list.php?site_cd=${Site_cd}&wko_det_assign_to=${EmpID}`, );
    const response = await axios.get( `${Baseurl}/get_timecard_list.php?site_cd=${Site_cd}&wko_det_assign_to=${EmpID}`, );

    try {
      //console.log("JSON DATA Work Order Time cared : " + response.data.status)

      console.log('Time Card List Length: ' + response.data.data.length);
      if (response.data.status === 'SUCCESS') {
        if (response.data.data.length > 0) {
          db.transaction(function (tx) {
            let insertQuery = 'INSERT INTO wko_ls8_timecard (mst_RowID, RowID, site_cd, wko_ls8_assetno, wko_ls8_empl_id, wko_ls8_craft, wko_ls8_hours_type, wko_ls8_hrs, wko_ls8_rate, wko_ls8_multiplier, wko_ls8_adder, wko_ls8_act_cost, wko_ls8_chg_costcenter, wko_ls8_chg_account, wko_ls8_crd_costcenter, wko_ls8_crd_account, wko_ls8_time_card_no, wko_ls8_datetime1, wko_ls8_datetime2,audit_date, audit_user, wko_mst_wo_no) VALUES';
            let values = [];

            response.data.data.forEach((record, index) => {
              let wko_ls8_datetime1;
              if (record.wko_ls8_datetime1 === null) {
                wko_ls8_datetime1 = '';
              } else {
                wko_ls8_datetime1 = moment( record.wko_ls8_datetime1.date, ).format('yyyy-MM-DD HH:mm');
              }

              let wko_ls8_datetime2;
              if (record.wko_ls8_datetime2 === null) {
                wko_ls8_datetime2 = '';
              } else {
                wko_ls8_datetime2 = moment( record.wko_ls8_datetime2.date, ).format('yyyy-MM-DD HH:mm');
              }

              insertQuery += '(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?),';
              values.push(
                record.mst_RowID,
                record.RowID,
                record.site_cd,
                record.wko_ls8_assetno,
                record.wko_ls8_empl_id,
                record.wko_ls8_craft,
                record.wko_ls8_hours_type,
                record.wko_ls8_hrs,
                record.wko_ls8_rate,
                record.wko_ls8_multiplier,
                record.wko_ls8_adder,
                record.wko_ls8_act_cost,
                record.wko_ls8_chg_costcenter,
                record.wko_ls8_chg_account,
                record.wko_ls8_crd_costcenter,
                record.wko_ls8_crd_account,
                record.wko_ls8_time_card_no,
                wko_ls8_datetime1,
                wko_ls8_datetime2,
                record.audit_date.date,
                record.audit_user,
                record.wko_mst_wo_no,
              );

               const batchSize = 20;
              if (
                (index + 1) % batchSize === 0 ||
                index === response.data.data.length - 1
              ) {
                insertQuery = insertQuery.slice(0, -1);

                tx.executeSql(insertQuery, values, (tx, results) => {
                  if (results.rowsAffected > 0) {
                    //console.log('INSERT TABLE wko_ls8_timecard Successfully');
                  } else {
                    setIndicators_Visible(false);
                    alert('Step :06 Time Card Insert Table unsuccessfully');
                  }
                });

                insertQuery = 'INSERT INTO wko_ls8_timecard (mst_RowID, RowID, site_cd, wko_ls8_assetno, wko_ls8_empl_id, wko_ls8_craft, wko_ls8_hours_type, wko_ls8_hrs, wko_ls8_rate, wko_ls8_multiplier, wko_ls8_adder, wko_ls8_act_cost, wko_ls8_chg_costcenter, wko_ls8_chg_account, wko_ls8_crd_costcenter, wko_ls8_crd_account, wko_ls8_time_card_no, wko_ls8_datetime1, wko_ls8_datetime2,audit_date, audit_user, wko_mst_wo_no) VALUES';
                values = [];
              }
            });
          });

          get_zoom_list_task();
        } else {
          get_zoom_list_task();
        }
      } else {
        setIndicators_Visible(false);
        alert('Step: 06 Work Order Time cared' + response.data.message);
      }
    } catch (error) {
      setIndicators_Visible(false);
      alert('Step: 06 Work Order Time cared' + error);
    }
  };

  //Step 07 GET ZOOMList
  const get_zoom_list_task = async () => {
    setIndicators_step('07');
    setIndicators_text('Zoom List Data syncing....');

    console.log( 'Zoom List: ' + `${Baseurl}/get_zoom_dropdown.php?site_cd=${Site_cd}` );
    const response = await axios.get( `${Baseurl}/get_zoom_dropdown.php?site_cd=${Site_cd}`);

    try {
      //console.log("JSON DATA Zoom List: " + response.data.status)

      console.log('Zoom List Length: ' + response.data.data.length);

      if (response.data.status === 'SUCCESS') {
        if (response.data.data.length > 0) {
          db.transaction(function (tx) {
            let insertQuery = 'INSERT INTO stp_zom (mst_RowID, stp_zom_data, site_cd) VALUES';
            let values = [];

            response.data.data.forEach((record, index) => {
              insertQuery += '(?,?,?),';
              values.push( record.mst_RowID, record.stp_zom_data, record.site_cd);

               const batchSize = 20;
              if ( (index + 1) % batchSize === 0 || index === response.data.data.length - 1 ) {
                insertQuery = insertQuery.slice(0, -1);

                tx.executeSql(insertQuery, values, (tx, results) => {
                  if (results.rowsAffected > 0) {
                    //console.log('INSERT TABLE stp_zom Successfully');
                  } else {
                    setIndicators_Visible(false);
                    alert( 'Step :07 Time Card Zoom List Insert Table unsuccessfully', );
                  }
                });

                insertQuery = 'INSERT INTO stp_zom (mst_RowID, stp_zom_data, site_cd) VALUES';
                values = [];
              }
            });
          });

          get_timecared_groupasset();
        } else {
          get_timecared_groupasset();
        }
      } else {
        setIndicators_Visible(false);
        alert('Step :07 Work Order ZOOMList' + response.data.message);
      }
    } catch (error) {
      setIndicators_Visible(false);
      alert('Step: 07 Work Order ZOOMList' + error);
    }
  };

  //Step 08 GET Time Card PM Group Asset
  const get_timecared_groupasset = async () => {
    setIndicators_step('08');
    setIndicators_text('Time Card PM Group Asset Data syncing....');

    console.log( 'Work Order Time cared PM Group Asset : ' + `${Baseurl}/get_offline_pm_group_asset.php?site_cd=${Site_cd}&wko_det_assign_to=${EmpID}`, );
    const response = await axios.get( `${Baseurl}/get_offline_pm_group_asset.php?site_cd=${Site_cd}&wko_det_assign_to=${EmpID}`, );

    try {
      //console.log( 'JSON DATA Work Order Time cared  PM Group Asset: ' + response.data.status, );
      console.log('Time Card PM Group Length: ' + response.data.data.length);

      if (response.data.status === 'SUCCESS') {
        if (response.data.data.length > 0) {
          db.transaction(function (tx) {
            let insertQuery = 'INSERT INTO prm_ast (site_cd,prm_ast_wo_no,prm_ast_grp_cd,ast_mst_asset_no,ast_mst_asset_shortdesc,ast_mst_asset_type,ast_mst_asset_status,ast_mst_work_area,ast_mst_asset_locn,ast_mst_cost_center) VALUES';
            let values = [];

            response.data.data.forEach((record, index) => {
              insertQuery += '(?,?,?,?,?,?,?,?,?,?),';
              values.push(
                record.site_cd,
                record.prm_ast_wo_no,
                record.prm_ast_grp_cd,
                record.ast_mst_asset_no,
                record.ast_mst_asset_shortdesc,
                record.ast_mst_asset_type,
                record.ast_mst_asset_status,
                record.ast_mst_work_area,
                record.ast_mst_asset_locn,
                record.ast_mst_cost_center,
              );

               const batchSize = 20;
              if (
                (index + 1) % batchSize === 0 ||
                index === response.data.data.length - 1
              ) {
                insertQuery = insertQuery.slice(0, -1);

                tx.executeSql(insertQuery, values, (tx, results) => {
                  if (results.rowsAffected > 0) {
                    //console.log('INSERT TABLE prm_ast Successfully');
                  } else {
                    setIndicators_Visible(false);
                    alert( 'Step :08 Time Card PM Group List Insert Table unsuccessfully', );
                  }
                });

                insertQuery = 'INSERT INTO prm_ast (site_cd,prm_ast_wo_no,prm_ast_grp_cd,ast_mst_asset_no,ast_mst_asset_shortdesc,ast_mst_asset_type,ast_mst_asset_status,ast_mst_work_area,ast_mst_asset_locn,ast_mst_cost_center) VALUES';
                values = [];
              }
            });
          });

          get_workorder_assetdowntime();
        } else {
          get_workorder_assetdowntime();
        }
      } else {
        setIndicators_Visible(false);
        alert( 'Step: 08 Work Order Time cared PM Group Asset' + response.data.message, );
      }
    } catch (error) {
      setIndicators_Visible(false);
      alert('Step: 08 Work Order Time cared PM Group Asset' + error);
    }
  };

  //Step 09 GET Work Order Asset Down TIme List
  const get_workorder_assetdowntime = async () => {
    setIndicators_step('09');
    setIndicators_text('Asset Down Time Data syncing....');

    console.log( 'Asset Down Time : ' + `${Baseurl}/off_get_assetdowntime_list.php?site_cd=${Site_cd}&wko_det_assign_to=${EmpID}`, );
    const response = await axios.get( `${Baseurl}/off_get_assetdowntime_list.php?site_cd=${Site_cd}&wko_det_assign_to=${EmpID}`, );

    try {
      //console.log("JSON DATA Asset Down Time: " + response.data.status)
      console.log('Asset Down Time: ' + response.data.data.length);

      if (response.data.status === 'SUCCESS') {
        if (response.data.data.length > 0) {
          db.transaction(function (tx) {
            let insertQuery = 'INSERT INTO ast_dwntime (site_cd,ast_dwntime_out_date,ast_dwntime_rts_date,ast_dwntime_downtime,ast_dwntime_repair_from,ast_dwntime_repair_to,ast_dwntime_repairtime,ast_dwntime_down_wo,ast_dwntime_up_wo,ast_dwntime_asset_no,ast_dwntime_sched_flag,ast_dwntime_remark,audit_user,audit_date,rowid,mst_RowID,sts_column,LOGINID,local_id) VALUES';
            let values = [];

            response.data.data.forEach((record, index) => {
              let ast_dwntime_out_date,
                ast_dwntime_rts_date,
                ast_dwntime_repair_from,
                ast_dwntime_repair_to;

              if (record.ast_dwntime_out_date === null || record.ast_dwntime_out_date === '1900-01-01 00:00:00.000000') {
                ast_dwntime_out_date = '';
              } else {
                ast_dwntime_out_date = moment(record.ast_dwntime_out_date.date).format('yyyy-MM-DD HH:mm');
              }

              if (record.ast_dwntime_rts_date === null || record.ast_dwntime_rts_date === '1900-01-01 00:00:00.000000') {
                ast_dwntime_rts_date = '';
              } else {
                ast_dwntime_rts_date = moment(record.ast_dwntime_rts_date.date).format('yyyy-MM-DD HH:mm');
              }

              if (record.ast_dwntime_repair_from === null || record.ast_dwntime_repair_from === '1900-01-01 00:00:00.000000') {
                ast_dwntime_repair_from = '';
              } else {
                ast_dwntime_repair_from = moment(record.ast_dwntime_repair_from.date).format('yyyy-MM-DD HH:mm');
              }

              if (record.ast_dwntime_repair_to === null || record.ast_dwntime_repair_to === '1900-01-01 00:00:00.000000') {
                ast_dwntime_repair_to = '';
              } else {
                ast_dwntime_repair_to = moment(record.ast_dwntime_repair_to.date).format('yyyy-MM-DD HH:mm');
              }

              if (record.audit_date === null || record.audit_date === '1900-01-01 00:00:00.000000' ) {
                audit_date = '';
              } else {
                audit_date = moment(record.audit_date.date).format( 'yyyy-MM-DD HH:mm');
              }

              insertQuery += '(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?),';
              values.push(
                record.site_cd,
                ast_dwntime_out_date,
                ast_dwntime_rts_date,
                record.ast_dwntime_downtime,
                ast_dwntime_repair_from,
                ast_dwntime_repair_to,
                record.ast_dwntime_repairtime,
                record.ast_dwntime_down_wo,
                record.ast_dwntime_up_wo,
                record.ast_dwntime_asset_no,
                record.ast_dwntime_sched_flag,
                record.ast_dwntime_remark,
                record.audit_user,
                audit_date,
                record.rowid,
                record.mst_RowID,
                '',
                '',
                '',
              );

               const batchSize = 20;
              if ( (index + 1) % batchSize === 0 || index === response.data.data.length - 1 ) {
                insertQuery = insertQuery.slice(0, -1);

                tx.executeSql(insertQuery, values, (tx, results) => {
                  if (results.rowsAffected > 0) {
                    //console.log('INSERT TABLE ast_dwntime Successfully');
                  } else {
                    setIndicators_Visible(false);
                    alert( 'Step :09 Asset Downtime Insert Table unsuccessfully', );
                  }
                });

                insertQuery = 'INSERT INTO ast_dwntime (site_cd,ast_dwntime_out_date,ast_dwntime_rts_date,ast_dwntime_downtime,ast_dwntime_repair_from,ast_dwntime_repair_to,ast_dwntime_repairtime,ast_dwntime_down_wo,ast_dwntime_up_wo,ast_dwntime_asset_no,ast_dwntime_sched_flag,ast_dwntime_remark,audit_user,audit_date,rowid,mst_RowID,sts_column,LOGINID,local_id) VALUES';
                values = [];
              }
            });
          });

          off_check_list_header();
        } else {
          off_check_list_header();
        }
      } else {
        setIndicators_Visible(false);
        alert('Step 09 Work Order Asset Down Time ' + response.data.message);
      }
    } catch (error) {
      setIndicators_Visible(false);
      alert('Step 09 Work Order Asset Down Time ' + error);
    }
  };

  //Step 10 GET Workorder CheckList Header
  const off_check_list_header = async () => {
    setIndicators_step('10');
    setIndicators_text('CheckList Header Data syncing....');

    console.log( 'Work Order CheckList Header : ' + `${Baseurl}/off_check_list_header.php?site_cd=${Site_cd}&wko_det_assign_to=${EmpID}`, );
    const response = await axios.get( `${Baseurl}/off_check_list_header.php?site_cd=${Site_cd}&wko_det_assign_to=${EmpID}`, );

    try {
      //console.log("JSON DATA Work Order CheckList Heard: " + response.data.status)
      console.log('Check List Header Length: ' + response.data.data.length);
      if (response.data.status === 'SUCCESS') {
        if (response.data.data.length > 0) {
          db.transaction(function (tx) {
            let insertQuery = 'INSERT INTO wko_isp_heard (mst_RowID, site_cd, wko_isp_asset_no, ast_mst_asset_shortdesc,ast_mst_asset_locn,ast_mst_ast_lvl,ast_mst_work_area,total,done,na,wko_isp_job_cd,wko_isp_job_desc,wko_isp_datetime3,RowID) VALUES';
            let values = [];

            response.data.data.forEach((record, index) => {
              let datetime3;

              if (record.wko_isp_datetime3 === null) {
                datetime3 = null;
              } else {
                datetime3 = moment(record.wko_isp_datetime3.date).format(
                  'yyyy-MM-DD HH:mm',
                );
              }

              insertQuery += '(?,?,?,?,?,?,?,?,?,?,?,?,?,?),';
              values.push(
                record.mst_rowid,
                record.site_cd,
                record.wko_isp_asset_no,
                record.ast_mst_asset_shortdesc,
                record.ast_mst_asset_locn,
                record.ast_mst_ast_lvl,
                record.ast_mst_work_area,
                record.total,
                record.done,
                record.na,
                record.wko_isp_job_cd,
                record.wko_isp_job_desc,
                datetime3,
                record.rowid,
              );

               const batchSize = 20;
              if (
                (index + 1) % batchSize === 0 ||
                index === response.data.data.length - 1
              ) {
                insertQuery = insertQuery.slice(0, -1);

                tx.executeSql(insertQuery, values, (tx, results) => {
                  if (results.rowsAffected > 0) {
                    //console.log('INSERT TABLE wko_isp_heard Successfully');
                  } else {
                    setIndicators_Visible(false);
                    alert( 'Step :10 Check List Header Insert Table unsuccessfully');
                  }
                });

                insertQuery = 'INSERT INTO wko_isp_heard (mst_RowID, site_cd, wko_isp_asset_no, ast_mst_asset_shortdesc,ast_mst_asset_locn,ast_mst_ast_lvl,ast_mst_work_area,total,done,na,wko_isp_job_cd,wko_isp_job_desc,wko_isp_datetime3,RowID) VALUES';
                values = [];
              }
            });
          });

          get_check_list_by();
        } else {
          //get_check_list_by();
          get_check_list_by();
        }
      } else {
        setIndicators_Visible(false);
        alert('Step :10 Work Order CheckList Header : ' + response.data.message);
      }
    } catch (error) {
      setIndicators_Visible(false);
      alert('Step :10 Work Order CheckList Header : ' + error);
    }
  };

  //Step 11 GET Workorder CheckList details
  const get_check_list_by = async () => {
    setIndicators_step('11');
    setIndicators_text('CheckList Details Data syncing....');

    console.log( 'Work Order CheckList details : ' + `${Baseurl}/off_check_list_details.php?site_cd=${Site_cd}&wko_det_assign_to=${EmpID}`);
    const response = await axios.get( `${Baseurl}/off_check_list_details.php?site_cd=${Site_cd}&wko_det_assign_to=${EmpID}`);

    try {
     
      console.log('Check List Details Length: ' + response.data.data.length);

      if (response.data.status === 'SUCCESS') {
        if (response.data.data.length > 0) {

          

          db.transaction(function (tx) {
            let insertQuery = 'INSERT INTO wko_isp_details (mst_RowID, rowid, site_cd, wko_isp_asset_no, wko_isp_job_cd, wko_isp_job_desc, wko_isp_sec_no, wko_isp_sec_desc, wko_isp_stp_no, wko_isp_stp_desc, wko_isp_stp_datatype, wko_isp_stp_rowid, wko_isp_varchar1, wko_isp_varchar2, wko_isp_varchar3, wko_isp_numeric1, wko_isp_numeric2, wko_isp_numeric3, wko_isp_datetime1, wko_isp_datetime2, wko_isp_datetime3, wko_isp_checkbox1, wko_isp_checkbox2, wko_isp_checkbox3, wko_isp_dropdown1, wko_isp_dropdown2, wko_isp_dropdown3, total, done, audit_user,audit_date,file_name,file_link,mbl_audit_user,mbl_audit_date,column1,wko_isp_min_thr,wko_isp_max_thr,wko_isp_ovr_thr,wko_isp_uom) VALUES';
            let values = [];

            

            response.data.data.forEach((record, index) => {

              //console.log("JSON DATA Work Order CheckList details: "+ index)

              let audit_date, mbl_audit_date, datetime1, datetime2, datetime3;

              if (record.audit_date === null) {
                audit_date = null;
                //console.log("JSON DATA Work Order CheckList details: if"+ index)
              } else {
                //console.log("JSON DATA Work Order CheckList details: "+ index)
                audit_date = moment(record.audit_date.date).format( 'yyyy-MM-DD HH:mm');
              }

              if (record.mbl_audit_date === null) {
                mbl_audit_date = null;
              } else {
                mbl_audit_date = moment(record.mbl_audit_date.date).format( 'yyyy-MM-DD HH:mm');
              }

              if (record.wko_isp_datetime1 === null) {
                datetime1 = null;
              } else {
                datetime1 = moment(record.wko_isp_datetime1.date).format( 'yyyy-MM-DD HH:mm');
              }

              if (record.wko_isp_datetime2 === null) {
                datetime2 = null;
              } else {
                datetime2 = moment(record.wko_isp_datetime2.date).format( 'yyyy-MM-DD HH:mm');
              }

              if (record.wko_isp_datetime3 === null) {
                datetime3 = null;
              } else {
                datetime3 = moment(record.wko_isp_datetime3.date).format( 'yyyy-MM-DD HH:mm');
              }

              var local_link;
              if (record.file_link === null) {
                 
                local_link = record.file_link;
              } else {

                 

                let image_URL = record.file_link;
                let ext = getExtention(image_URL);
                ext = '.' + ext[0];
                const {config, fs} = RNFetchBlob;

                let PictureDir = Platform.OS === 'ios' ? fs.dirs.PictureDir : fs.dirs.DownloadDir + '/AC/';
                let options = {
                  
                  path: PictureDir + '/Images/' + record.file_name,
                  addAndroidDownloads: {
                    // Related to the Android only
                    useDownloadManager: true,
                    notification: true,
                    path: PictureDir + record.file_name,
                    description: 'Image',
                  },
                };
                config( {fileCache: true,options})
                  .fetch('GET', image_URL)
                  .then(res => {
                    //console.log('res -> ', JSON.stringify(res.data));
                    local_link = res.data;
                  });
              }

              insertQuery += '(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?),';
              values.push( record.mst_rowid, record.rowid, record.site_cd, record.wko_isp_asset_no, record.wko_isp_job_cd, record.wko_isp_job_desc, record.wko_isp_sec_no, record.wko_isp_sec_desc, record.wko_isp_stp_no, record.wko_isp_stp_desc, record.wko_isp_stp_datatype, record.wko_isp_stp_rowid, record.wko_isp_varchar1, record.wko_isp_varchar2, record.wko_isp_varchar3, record.wko_isp_numeric1, record.wko_isp_numeric2, record.wko_isp_numeric3, datetime1, datetime2, datetime3, record.wko_isp_checkbox1, record.wko_isp_checkbox2, record.wko_isp_checkbox3, record.wko_isp_dropdown1, record.wko_isp_dropdown2, record.wko_isp_dropdown3, record.total, record.done, record.audit_user, audit_date, record.file_name, local_link, record.mbl_audit_user, mbl_audit_date, record.column1,record.wko_isp_min_thr,record.wko_isp_max_thr,record.wko_isp_ovr_thr,record.wko_isp_uom );
 
              const batchSize = 20;
              if ( (index + 1) % batchSize === 0 || index === response.data.data.length - 1 ) {
                insertQuery = insertQuery.slice(0, -1);
              
                try {

                  tx.executeSql(insertQuery, values, (tx, results) => {
                  //console.log('INSERT TABLE wko_isp_details Successfully',results);
                  if (results.rowsAffected > 0) {
                    //console.log('INSERT TABLE wko_isp_details Successfully');
                  } else {
                    setIndicators_Visible(false);
                    alert( 'Step :11 Check List Details Insert Table unsuccessfully', );
                  }
                });

                insertQuery = 'INSERT INTO wko_isp_details (mst_RowID, rowid, site_cd, wko_isp_asset_no, wko_isp_job_cd, wko_isp_job_desc, wko_isp_sec_no, wko_isp_sec_desc, wko_isp_stp_no, wko_isp_stp_desc, wko_isp_stp_datatype, wko_isp_stp_rowid, wko_isp_varchar1, wko_isp_varchar2, wko_isp_varchar3, wko_isp_numeric1, wko_isp_numeric2, wko_isp_numeric3, wko_isp_datetime1, wko_isp_datetime2, wko_isp_datetime3, wko_isp_checkbox1, wko_isp_checkbox2, wko_isp_checkbox3, wko_isp_dropdown1, wko_isp_dropdown2, wko_isp_dropdown3, total, done, audit_user,audit_date,file_name,file_link,mbl_audit_user,mbl_audit_date,column1,wko_isp_min_thr,wko_isp_max_thr,wko_isp_ovr_thr,wko_isp_uom) VALUES';
                values = [];

                }catch (error) {
                  setIndicators_Visible(false);
                  alert('Step :11 Work Order CheckList details', error);
                }
                
              }
            });
          });
          get_report_current_week()
          
        } else {
          get_report_current_week()
        }
      } else {
        setIndicators_Visible(false);
        alert( 'Step :11 Work Order CheckList details : ', response.data.message);
      }
    } catch (error) {
      setIndicators_Visible(false);
      alert('Step :11 Work Order CheckList details', error);
    }
  };

  //Step 12 GET Workorder CheckList details
  const get_report_current_week = async () => {
    setIndicators_step('12');
    setIndicators_text('WO Report Current Week syncing....');

    console.log( 'WO Report Current Week : ' , `${Baseurl}/get_report_wo_by_current_week.php?site_cd=${Site_cd}&emp_id=${EmpID}`);
    const response = await axios.get( `${Baseurl}/get_report_wo_by_current_week.php?site_cd=${Site_cd}&emp_id=${EmpID}`);

    try {
     
      console.log('WO Report Current Week Length: ' + response.data.data.length);

      if (response.data.status === 'SUCCESS') {

        if (response.data.data.length > 0) {

          let insertQuery = 'INSERT INTO report_current_week (Total, DAY_NAME, DATEE, MONTHH) VALUES';
            let values = [];
            db.transaction(function (tx) {
              response.data.data.forEach((record, index) => {
                

                insertQuery += '(?,?,?,?),';
                values.push(
                  record.Total,
                  record.DAY_NAME,
                  record.DATEE,
                  record.MONTHH
                );

                const batchSize = 10;
                if (
                  (index + 1) % batchSize === 0 ||
                  index === response.data.data.length - 1
                ) {
                  insertQuery = insertQuery.slice(0, -1);

                  tx.executeSql(insertQuery, values, (tx, results) => {
                    if (results.rowsAffected > 0) {
                      console.log('INSERT TABLE report_current_week Successfully');
                    } else {
                      setIndicators_Visible(false);
                      alert( 'Step :12 Asset report_current_week Insert Table unsuccessfully', );
                    }
                  });

                  insertQuery = 'INSERT INTO report_current_week (Total, DAY_NAME, DATEE, MONTHH) VALUES';
                  values = [];
                }
              });
         
            })
        
          Alert.alert(
            'Work Order Attachment',
            'Do you want to download work order attachments too?',
            [
              {
                text: 'No',
                onPress: () => { Count_Offline_data() },
              },
              {
                text: 'Yes',
                onPress: () => Downloads_images(),
              },
            ],
            {cancelable: false},
          );
        } else {
          Alert.alert(
            'Work Order Attachment',
            'Do you want to download work order attachments too?',
            [
              {
                text: 'No',
                onPress: () => { Count_Offline_data() },
              },
              {
                text: 'Yes',
                onPress: () => Downloads_images(),
              },
            ],
            {cancelable: false},
          );
        }
      } else {
        setIndicators_Visible(false);
        alert( 'Step :12 Work Order CheckList details : ', response.data.message);
      }
    } catch (error) {
      setIndicators_Visible(false);
      alert('Step :12 Work Order CheckList details', error);
    }
  };



  const Downloads_images = async () => {
    setIndicators_step('13');
    setIndicators_text('Response Data syncing....');

    let dvc_id = DeviceInfo.getDeviceId();

    const SPLIT_URL = Baseurl.split('/');
    const SPLIT_URL1 = SPLIT_URL[SPLIT_URL.length - 2];
    const SPLIT_URL2 = SPLIT_URL[SPLIT_URL.length - 1];
    const SPLIT_URL3 = SPLIT_URL1+'/'+SPLIT_URL2
    console.log('URL' + SPLIT_URL3);

    console.log( 'Work Order Response : ' + `${Baseurl}/get_workorder_attachment.php?site_cd=${Site_cd}&EmpID=${EmpID}&url=${Baseurl}&folder=${SPLIT_URL3}&dvc_id=${dvc_id}`, );
    const response = await axios.get( `${Baseurl}/get_workorder_attachment.php?site_cd=${Site_cd}&EmpID=${EmpID}&url=${Baseurl}&folder=${SPLIT_URL3}&dvc_id=${dvc_id}`, );

    try {
      //console.log( 'JSON DATA Work Order Images Downloads: ' + response.data.status);
      console.log( 'Work Order Images Downloads: Length: ' + response.data.data.length);

      if (response.data.status === 'SUCCESS') {
        if (response.data.data.length > 0) {
          const Img_Promises = [];
          for (let i = 0; i < response.data.data.length; i++) {
            Img_Promises.push(do_Downloads_Img_Async(response.data.data[i], i));
          }

          Promise.all(Img_Promises)
            .then(results => {
              Count_Offline_data();
            })
            .catch(e => {
              setIndicators_Visible(false);
              alert('Step: 13 Work Order Images Downloads' + e);
              // Handle errors here
            });
        } else {
          Count_Offline_data();
        }
      } else {
        setIndicators_Visible(false);
        alert('Step: 13 Work Order Images Downloads' + response.data.message);
      }
    } catch (error) {
      setIndicators_Visible(false);
      alert('Step: 13 Work Order Images Downloads' + error);
    }
  };

  const do_Downloads_Img_Async_base64 = (value, count) => {
    return new Promise(resolve => {
      setTimeout(() => {
        let imagePath = value.full_size_link;

        RNFetchBlob.config({
          fileCache: true,
        })
          .fetch('GET', imagePath)
          // the image is now Dowloaded to device's storage
          .then(resp => {
            // the image path you can use it directly with Image component
            //console.log("Work Order Images Downloads: Length: "+JSON.stringify(resp))
            imagePath = resp.path();
            console.log(imagePath);
            return resp.readFile('base64');
          })
          .then(base64Data => {
            // here's base64 encoded image
            //console.log(base64Data);
            //console.log(imagePath);
            // db.transaction(function (tx) {

            //     tx.executeSql('INSERT INTO wko_ref (RowID, site_cd, type, file_name, thumbnail_link, full_size_link, file_source, ref_type, Exist, Local_link, mst_RowID, column2, local_id, sts_column,attachment) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
            //     [value.rowid, value.site_cd, value.type, value.file_name,value.thumbnail_link, value.full_size_link, value.file_source, 'DB_image', 'Exist', '', value.mst_RowID, value.column2, '', '',base64Data],
            //     (tx, results) => {
            //         //console.log('wko_ref Results_test', results.rowsAffected);
            //         if (results.rowsAffected > 0) {

            //             console.log('INSERT TABLE wko_ref Successfully')

            //         }else{
            //             setIndicators_Visible(false);
            //             alert('INSERT TABLE wko_ref Failed')
            //         }

            //     }
            //     )
            // })
            // remove the file from storage
            return fs.unlink(imagePath);
          });

        resolve(count);
      }, Math.floor(Math.random() * 1000));
    });
  };

  const do_Downloads_Img_Async = (value, count) => {
    return new Promise(resolve => {
      setTimeout(() => {
        //downloadImage(value.full_size_link,value.file_name);

        // Main function to download the image
        // To add the time suffix in filename
        let date = new Date();
        // Image URL which we want to download
        let image_URL = value.full_size_link;
        // Getting the extention of the file
        let ext = getExtention(image_URL);
        ext = '.' + ext[0];
        // Get config and fs from RNFetchBlob
        // config: To pass the downloading related options
        // fs: Directory path where we want our image to download
        const {config, fs} = RNFetchBlob;
        //let PictureDir = fs.dirs.DocumentDir;
        //const PictureDir = Platform.OS == 'ios' ? fs.dirs.PictureDir : fs.dirs.DownloadDir+ '/AC'
        let PictureDir = Platform.OS === 'ios' ? fs.dirs.DocumentDir : fs.dirs.DownloadDir + '/AC/';

        let options = {
         
          path: PictureDir + '/Images/' + value.file_name,
          addAndroidDownloads: {
            // Related to the Android only
            useDownloadManager: true,
            notification: true,
            path: PictureDir + value.file_name,
            description: 'Image',
          },
        };
        config( {fileCache: true,options})
          .fetch('GET', image_URL)
          .then(res => {
            // Showing alert after successful downloading

            console.log('res -> ', JSON.stringify(res.data));
            db.transaction(function (tx) {
              tx.executeSql(
                'INSERT INTO wko_ref (RowID, site_cd, type, file_name, thumbnail_link, full_size_link, file_source, ref_type, Exist, Local_link, mst_RowID, column2, local_id, sts_column) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                [
                  value.rowid,
                  value.site_cd,
                  value.type,
                  value.file_name,
                  value.thumbnail_link,
                  value.full_size_link,
                  value.file_source,
                  'DB_image',
                  'Exist',
                  res.data,
                  value.mst_RowID,
                  value.column2,
                  '',
                  '',
                ],
                (tx, results) => {
                  //console.log('wko_ref Results_test', results.rowsAffected);
                  if (results.rowsAffected > 0) {
                    console.log('INSERT TABLE wko_ref Successfully');
                  } else {
                    setIndicators_Visible(false);
                    alert('INSERT TABLE wko_ref Failed');
                  }
                },
              );
            });

            // if (Platform.OS === "ios") {
            //     console.log('res -> ', JSON.stringify(res.data));
            //     //RNFetchBlob.ios.openDocument(res.data);
            //     }else{
            //     console.log('res -> ', JSON.stringify(res.data));
            //     db.transaction(function (tx) {

            //         tx.executeSql('INSERT INTO wko_ref (RowID, site_cd, type, file_name, thumbnail_link, full_size_link, file_source, ref_type, Exist, Local_link, mst_RowID, column2, local_id, sts_column) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
            //         [value.rowid, value.site_cd, value.type, value.file_name,value.thumbnail_link, value.full_size_link, value.file_source, 'DB_image', 'Exist', res.data, value.mst_RowID, value.column2, '', ''  ],
            //         (tx, results) => {
            //             //console.log('wko_ref Results_test', results.rowsAffected);
            //             if (results.rowsAffected > 0) {

            //                 console.log('INSERT TABLE wko_ref Successfully')

            //             }else{
            //                 setIndicators_Visible(false);
            //                 alert('INSERT TABLE wko_ref Failed')
            //             }

            //         }
            //         )
            //     })

            //     }

            //alert('Image Downloaded Successfully.');
          });

        resolve(count);
      }, Math.floor(Math.random() * 1000));
    });
  };

  const downloadImage = (IMAGE_PATH, FILE_NAME) => {
    // Main function to download the image

    // To add the time suffix in filename
    let date = new Date();
    // Image URL which we want to download
    let image_URL = IMAGE_PATH;
    // Getting the extention of the file
    let ext = getExtention(image_URL);
    ext = '.' + ext[0];
    // Get config and fs from RNFetchBlob
    // config: To pass the downloading related options
    // fs: Directory path where we want our image to download
    const {config, fs} = RNFetchBlob;
    //let PictureDir = fs.dirs.PictureDir + '/AC';
    const PictureDir =
      Platform.OS == 'ios' ? fs.dirs.DocumentDir : fs.dirs.DownloadDir + '/AC';
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        // Related to the Android only
        useDownloadManager: true,
        notification: true,
        path: PictureDir + '/image_' + FILE_NAME,
        description: 'Image',
      },
    };
    config(options)
      .fetch('GET', image_URL)
      .then(res => {
        // Showing alert after successful downloading

        if (Platform.OS === 'ios') {
          RNFetchBlob.ios.openDocument(resp.data);
        } else {
          console.log('res -> ', JSON.stringify(res));
        }
        setIndicators_Visible(false);
        //alert('Image Downloaded Successfully.');
      });
  };

  const getExtention = filename => {
    // To get the file extension
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  };

  //Count
  const Count_Offline_data = () => {
    setIndicators_step('13');
    setIndicators_text('Total Count Data syncing....');

    db.transaction(function (txn) {
      
      //ast_mst
      txn.executeSql('SELECT * FROM ast_mst', [], (tx, results) => {
        setAssetCount(results.rows.length)
        
      });

      //wko_mst
      txn.executeSql('SELECT * FROM wko_mst', [], (tx, results) => {
        setWorkOrderCount(results.rows.length)
        
      });

      //wko_det_completion
      txn.executeSql('SELECT * FROM wko_det_completion', [], (tx, results) => {
        setWorkOrderCompletionCount(results.rows.length)
        
      });

      //wko_det_ackowledgement
      txn.executeSql( 'SELECT * FROM wko_det_ackowledgement', [], (tx, results) => {
        setWorkOrderAcknowledgementCount(results.rows.length)
       
        },
      );

      //wko_isp_heard
      txn.executeSql('SELECT * FROM wko_isp_heard', [], (tx, results) => {
        setWorkOrderChecklistCount(results.rows.length)
       
      });

      //wko_det_response
      txn.executeSql('SELECT * FROM wko_det_response', [], (tx, results) => {
        setWorkOrderResponseCount(results.rows.length)
        
      });

      //wko_ls8_timecard
      txn.executeSql('SELECT * FROM wko_ls8_timecard', [], (tx, results) => {
        setWorkOrderTimeCardCount(results.rows.length)
        
      });

      //ast_dwntime
      txn.executeSql('SELECT * FROM ast_dwntime', [], (tx, results) => {
        setAssetDownTimeCount(results.rows.length)
        
      });

      setIndicators_Visible(false);
      setAsset_modalVisible(false);
      AsyncStorage.setItem('WIFI', 'OFFLINE');
      setwifi_data({...wifi_data,
      
        wifiname:'wifi-off',
        wificolor:'red',
        OnlineText:'Offline',
        OnText:'Off',

      })

      navigation.navigate('SyncingData');
      
    });
  };

  // ONLINE
  //Switch_to_Online
  const Switch_to_Online = () => {
    console.log('SWTING....');

    db.transaction(tx => {
      //01 ast_mst
      tx.executeSql('DELETE FROM  ast_mst', [], (tx, results) => {
        console.log('ast_mst Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('ast_mst deleted successfully');
        } else {
          console.log('ast_mst unsuccessfully');
        }
      });

      //02 wko_mst
      tx.executeSql('DELETE FROM  wko_mst', [], (tx, results) => {
        console.log('wko_mst Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('wko_mst deleted successfully');
        } else {
          console.log('wko_mst unsuccessfully');
        }
      });

      //03 wko_det_completion
      tx.executeSql('DELETE FROM  wko_det_completion', [], (tx, results) => {
        console.log('wko_det_completion Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('wko_det_completion deleted successfully');
        } else {
          console.log('wko_det_completion unsuccessfully');
        }
      });

      //04 wko_det_ackowledgement
      tx.executeSql(
        'DELETE FROM  wko_det_ackowledgement',
        [],
        (tx, results) => {
          console.log('wko_det_ackowledgement Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            console.log('wko_det_ackowledgement deleted successfully');
          } else {
            console.log('wko_det_ackowledgement unsuccessfully');
          }
        },
      );

      //05 wko_isp_heard
      tx.executeSql('DELETE FROM  wko_isp_heard', [], (tx, results) => {
        console.log('wko_isp_heard Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('wko_isp_heard deleted successfully');
        } else {
          console.log('wko_isp_heard unsuccessfully');
        }
      });

      //06 wko_isp_details
      tx.executeSql('DELETE FROM  wko_isp_details', [], (tx, results) => {
        console.log('wko_isp_details Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('wko_isp_details deleted successfully');
        } else {
          console.log('wko_isp_details unsuccessfully');
        }
      });

      //07 stp_zom
      tx.executeSql('DELETE FROM  stp_zom', [], (tx, results) => {
        console.log('stp_zom Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('stp_zom deleted successfully');
        } else {
          console.log('stp_zom unsuccessfully');
        }
      });

      //08 stp_zom
      tx.executeSql('DELETE FROM  wko_ls8_timecard', [], (tx, results) => {
        console.log('wko_ls8_timecard Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('wko_ls8_timecard deleted successfully');
        } else {
          console.log('wko_ls8_timecard unsuccessfully');
        }
      });

      //09 prm_ast
      tx.executeSql('DELETE FROM  prm_ast', [], (tx, results) => {
        console.log('prm_ast Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('prm_ast deleted successfully');
        } else {
          console.log('prm_ast unsuccessfully');
        }
      });

      //10 wko_det_response
      tx.executeSql('DELETE FROM  wko_det_response', [], (tx, results) => {
        console.log('wko_det_response Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('wko_det_response deleted successfully');
        } else {
          console.log('wko_det_response unsuccessfully');
        }
      });

      //11 Asset Down Time
      tx.executeSql('DELETE FROM  ast_dwntime', [], (tx, results) => {
        console.log('ast_dwntime Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('ast_dwntime deleted successfully');
        } else {
          console.log('ast_dwntime unsuccessfully');
        }
      });

      //ast_mst
      txn.executeSql('SELECT * FROM ast_mst', [], (tx, results) => {
        console.log('Asset Master List Count: ' + results.rows.length);
        setAssetCount(results.rows.length);
      });

      //wko_mst
      txn.executeSql('SELECT * FROM wko_mst', [], (tx, results) => {
        console.log('Work Order Master List Count: ' + results.rows.length);
        setWorkOrderCount(results.rows.length);
      });

      //wko_det_completion
      txn.executeSql('SELECT * FROM wko_det_completion', [], (tx, results) => {
        console.log('Work Order Completion List Count: ' + results.rows.length);
        setWorkOrderCompletionCount(results.rows.length);
      });

      //wko_det_ackowledgement
      txn.executeSql(
        'SELECT * FROM wko_det_ackowledgement',
        [],
        (tx, results) => {
          console.log(
            'Work Order Ackowledgement List Count: ' + results.rows.length,
          );
          setWorkOrderAcknowledgementCount(results.rows.length);
        },
      );

      //wko_isp_heard
      txn.executeSql('SELECT * FROM wko_isp_heard', [], (tx, results) => {
        console.log(
          'Work Order Check List Heard Count: ' + results.rows.length,
        );
        setWorkOrderChecklistCount(results.rows.length);
      });

      //wko_det_response
      txn.executeSql('SELECT * FROM wko_det_response', [], (tx, results) => {
        console.log('Work Order Responces List Count: ' + results.rows.length);
        setWorkOrderResponseCount(results.rows.length);
      });

      //wko_ls8_timecard
      txn.executeSql('SELECT * FROM wko_ls8_timecard', [], (tx, results) => {
        console.log('Work Order TimeCard List Count: ' + results.rows.length);
        setWorkOrderTimeCardCount(results.rows.length);
      });

      setIndicators_Visible(false);
      AsyncStorage.setItem('WIFI', 'ONLINE');
      setOnlineText('Online');
      setOnText('On');
      setwifiname('wifi');
      setwificolor('green');
    });
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  //Step 01 OFFLINE Insert New Work Order
  const get_offline_New_WorkOrder_list = async () => {

    setIndicators_Visible(true);
    setIndicators_step('1');
    setIndicators_text('Update New Work order syncing....');

    db.transaction(function (tx) {
      tx.executeSql(
        'SELECT * FROM wko_mst WHERE RowID is null',
        [],
        (tx, results) => {
          console.log('wko_mst Results_test', results);

          if (results.rows.length > 0) {
            const WKO_MST_Promises = [];
            for (let i = 0; i < results.rows.length; ++i) {

              var sync_date = moment().format('YYYY-MM-DD HH:mm:ss');
              let dvc_id = DeviceInfo.getDeviceId();
              var LOCAL_ID = results.rows.item(i).ID;

              let EmployeeName_split, AssignTo_split, LaborAccount_split, ContractAccount_split, MaterialAccount_split, AssetCode_split, CusCode_split;

              if (!results.rows.item(i).wko_mst_originator) {
                EmployeeName_split = '';
              } else {
                Employee_split = results.rows .item(i) .wko_mst_originator.split(':');
                EmployeeName_split = Employee_split[0].trim();
              }

              let AssetGroup_split = results.rows.item(i).ast_mst_asset_group.split(':');
              let WorkArea_split = results.rows.item(i).wko_mst_work_area.split(':');
              let AssetLoca_split = results.rows.item(i).wko_mst_asset_location.split(':');
              let AssetLevel_split = results.rows.item(i).wko_mst_asset_level.split(':');
              let CosetCenter_split = results.rows.item(i).wko_mst_chg_costcenter.split(':');

              let OrgPriority_split = results.rows.item(i).wko_mst_orig_priority.split(':');
              let PlanPriority_split = results.rows.item(i).wko_mst_plan_priority.split(':');
              let org_date = results.rows.item(i).wko_mst_org_date;
              let due_date = results.rows.item(i).wko_mst_due_date;

              console.log(org_date);
              console.log(due_date);

              let WorkType_split = results.rows.item(i) .wko_det_work_type.split(':');
              let FaultCode_split = results.rows.item(i) .wko_mst_flt_code.split(':');
              let WorkOrderStatus_split = results.rows .item(i) .wko_mst_status.split(':');

              if (!results.rows.item(i).wko_det_assign_to) {
                AssignTo_split = '';
              } else {
                AssignTo_key_split = results.rows.item(i) .wko_det_assign_to.split(':');
                AssignTo_split = AssignTo_key_split[0].trim();
              }

              if (!results.rows.item(i).wko_det_laccount) {
                LaborAccount_split = '';
              } else {
                LaborAccount_key_split = results.rows.item(i) .wko_det_laccount.split(':');
                LaborAccount_split = LaborAccount_key_split[0].trim();
              }

              if (!results.rows.item(i).wko_det_caccount) {
                ContractAccount_split = '';
              } else {
                ContractAccount_key_split = results.rows.item(i) .wko_det_caccount.split(':');
                ContractAccount_split = ContractAccount_key_split[0].trim();
              }

              if (!results.rows.item(i).wko_det_maccount) {
                MaterialAccount_split = '';
              } else {
                MaterialAccount_key_split = results.rows.item(i) .wko_det_maccount.split(':');
                MaterialAccount_split = MaterialAccount_key_split[0].trim();
              }

              if (!results.rows.item(i).ast_mst_asset_code) {
                AssetCode_split = '';
              } else {
                AssetCode_key_split = results.rows .item(i) .ast_mst_asset_code.split(':');
                AssetCode_split = AssetCode_key_split[0].trim();
              }

              if (!results.rows.item(i).ast_mst_asset_status) {
                AssetStatus_split = '';
              } else {
                AssetStatus_key_split = results.rows .item(i) .ast_mst_asset_status.split(':');
                AssetStatus_split = AssetStatus_key_split[0].trim();
              }

              let Create_WorkOrder = {
                site_cd: Site_cd,
                EmpID: results.rows.item(i).EmpID,
                EmpName: results.rows.item(i).EmpName,

                wko_mst_originator: EmployeeName_split,
                wko_mst_phone: results.rows.item(i).wko_mst_phone,

                ast_mst_asset_no: results.rows.item(i).wko_mst_assetno,
                ast_mst_asset_shortdesc:
                  results.rows.item(i).ast_mst_asset_shortdesc,
                ast_mst_asset_group: AssetGroup_split[0].trim(),
                mst_war_work_area: WorkArea_split[0].trim(),
                ast_mst_asset_locn: AssetLoca_split[0].trim(),
                ast_mst_asset_lvl: AssetLevel_split[0].trim(),
                wko_mst_chg_costcenter: CosetCenter_split[0].trim(),

                wko_mst_wo_no: results.rows.item(i).wko_mst_wo_no,
                wko_mst_orig_priority: OrgPriority_split[0].trim(),
                wko_mst_plan_priority: PlanPriority_split[0].trim(),
                wko_mst_org_date: org_date,
                wko_mst_due_date: due_date,
                wko_det_work_type: WorkType_split[0].trim(),
                wko_mst_flt_code: FaultCode_split[0].trim(),
                wko_mst_descs: results.rows.item(i).wko_mst_descs,
                wko_mst_status: WorkOrderStatus_split[0].trim(),
                wko_det_assign_to: AssignTo_split,
                wko_det_laccount: LaborAccount_split,
                wko_det_caccount: ContractAccount_split,
                wko_det_maccount: MaterialAccount_split,

                ast_mst_asset_code: AssetCode_split,
                ast_mst_perm_id: results.rows.item(i).ast_mst_perm_id,
                ast_det_cus_code: results.rows.item(i).ast_det_cus_code,
                ast_mst_asset_status: AssetStatus_split,
                cnt_mst_numbering: results.rows.item(i).cnt_mst_numbering,

                dvc_id: results.rows.item(i).dvc_id,
                LOGINID: results.rows.item(i).LOGINID,

                sync_step: 'Step 1 Upload New Work Order',
                sync_time: sync_date,
                sync_status: 'offline',
                sync_url: Baseurl + '/insert_workorder.php?',
              
              };

              console.log( 'wko_mst List', JSON.stringify(Create_WorkOrder));

              WKO_MST_Promises.push( UP_insert_workorder(Create_WorkOrder, LOCAL_ID, i));
            }

            Promise.all(WKO_MST_Promises)
              .then(results => {
                setTimeout(() => {
                  get_offline_Edit_WorkOrder_list();
                }, 10000);
              })
              .catch(e => {
                setIndicators_Visible(false);
                console.log('Step 1 Upload New Work Order', e);
              });
          } else {
            get_offline_Edit_WorkOrder_list();
          }
        },
      );
    });
  };

  const UP_insert_workorder = (Create_WorkOrder, LOCAL_ID, i) => {
    return new Promise(resolve => {
      setTimeout(() => {

        offline_insert_workorder(Create_WorkOrder, LOCAL_ID);

        resolve(i);
      }, Math.floor(Math.random() * 1000));
    });
  };

  const offline_insert_workorder = async (Create_WorkOrder, LOCAL_ID) => {
    try {
      const response = await axios.post( `${Baseurl}/insert_workorder.php?`, JSON.stringify(Create_WorkOrder), {headers: {'Content-Type': 'application/json'}});
      console.log( 'Insert Work Order response:' + JSON.stringify(response.data));

      if (response.data.status === 'SUCCESS') {
        db.transaction(function (txn) {

          txn.executeSql(
            'UPDATE wko_mst SET RowID=?, wko_mst_wo_no=? WHERE ID=?',
            [response.data.ROW_ID,response.data.WorkOrderno, LOCAL_ID],
            (txn, results) => {
              console.log( 'wko_mst Results_test', results.rowsAffected);
              if (results.rowsAffected > 0) {
                console.log('UPDATE TABLE wko_mst Successfully');
              } else {
                console.log('UPDATE TABLE wko_mst Unsuccessfully');
              }
            },
          );

          txn.executeSql(
            'UPDATE wko_det_response SET mst_RowID=? WHERE local_id=?',
            [response.data.ROW_ID, LOCAL_ID],
            (txn, results) => {
              console.log( 'wko_det_response Results_test', results.rowsAffected, );
              if (results.rowsAffected > 0) {
                console.log('UPDATE TABLE wko_det_response Successfully');
              } else {
                console.log('UPDATE TABLE wko_det_response Unsuccessfully');
              }
            },
          );

          txn.executeSql(
            'UPDATE wko_det_ackowledgement SET mst_RowID=? WHERE local_id=?',
            [response.data.ROW_ID, LOCAL_ID],
            (txn, results) => {
              console.log( 'wko_det_ackowledgement Results_test', results.rowsAffected, );
              if (results.rowsAffected > 0) {
                console.log('UPDATE TABLE wko_det_ackowledgement Successfully');
              } else {
                console.log(
                  'UPDATE TABLE wko_det_ackowledgement Unsuccessfully',
                );
              }
            },
          );

          txn.executeSql(
            'UPDATE wko_det_completion SET wko_mst_wo_no=?, mst_RowID=? WHERE local_id=?',
            [response.data.WorkOrderno, response.data.ROW_ID, LOCAL_ID],
            (txn, results) => {
              console.log( 'wko_det_completion Results_test', results.rowsAffected);
              if (results.rowsAffected > 0) {
                console.log('UPDATE TABLE wko_det_completion Successfully');
              } else {
                console.log('UPDATE TABLE wko_det_completion Unsuccessfully');
              }
            },
          );

          txn.executeSql(
            'UPDATE wko_ls8_timecard SET wko_mst_wo_no=?, mst_RowID=? WHERE local_id=?',
            [response.data.WorkOrderno, response.data.ROW_ID, LOCAL_ID],
            (txn, results) => {
              console.log( 'wko_ls8_timecard Results_test', results.rowsAffected);
              if (results.rowsAffected > 0) {
                console.log('UPDATE TABLE wko_ls8_timecard Successfully');
              } else {
                console.log('UPDATE TABLE wko_ls8_timecard Unsuccessfully');
              }
            },
          );

          txn.executeSql(
            'UPDATE wko_ref SET mst_RowID=? WHERE local_id=?',
            [response.data.ROW_ID, LOCAL_ID],
            (txn, results) => {
              console.log('wko_ref Results_test', results.rowsAffected);
              if (results.rowsAffected > 0) {
                console.log('UPDATE TABLE wko_ref Successfully');
              } else {
                console.log('UPDATE TABLE wko_ref Unsuccessfully');
              }
            },
          );

          txn.executeSql(
            'SELECT * FROM ast_dwntime WHERE  local_id =?',
            [LOCAL_ID],
            (tx, results) => {
              if (results.rows.length > 0) {
                for (let i = 0; i < results.rows.length; ++i) {
                  let down_wo;
                  if (results.rows.item(i).ast_dwntime_out_date === '') {
                    down_wo = '';
                  } else {
                    down_wo = response.data.WorkOrderno;
                  }

                  let up_wo;
                  if (results.rows.item(i).ast_dwntime_rts_date === '') {
                    up_wo = '';
                  } else {
                    up_wo = response.data.WorkOrderno;
                  }

                  txn.executeSql(
                    'UPDATE ast_dwntime SET ast_dwntime_down_wo=?,ast_dwntime_up_wo =? WHERE local_id=?',
                    [down_wo, up_wo, LOCAL_ID],
                    (txn, results) => {
                      console.log(
                        'ast_dwntime Results_test',
                        results.rowsAffected,
                      );
                      if (results.rowsAffected > 0) {
                        console.log('UPDATE TABLE ast_dwntime Successfully');
                      } else {
                        console.log('UPDATE TABLE ast_dwntime Unsuccessfully');
                      }
                    },
                  );
                }
              }
            },
          );
        });
      } else {
        setIndicators_Visible(false);
        Alert.alert(response.data.status, response.data.message, [ {text: 'OK'}]);
      }
    } catch (error) {
      setIndicators_Visible(false);
      alert('Step 1 Upload New Work Order', error);
    }
  };

  //Step 02 OFFLINE Edit Work Order
  const get_offline_Edit_WorkOrder_list = async () => {
    setIndicators_step('2');
    setIndicators_text('Update Edit Work order syncing....');

    db.transaction(function (tx) {
      tx.executeSql(
        'SELECT * FROM wko_mst WHERE sts_column =? and RowID is not null',
        ['Update'],
        (tx, results) => {

          console.log('wko_mst Results_test', results.rows.length);

          if (results.rows.length > 0) {
           

            const Edit_Wko_mst = [];

            for (let i = 0; i < results.rows.length; ++i) {

        

              let EmployeeName_split, AssignTo_split, LaborAccount_split, ContractAccount_split, MaterialAccount_split, AssetCode_split, CusCode_split,PerAssignTo_split;

              if (!results.rows.item(i).wko_mst_originator) {
                EmployeeName_split = '';
              } else {
                Employee_split = results.rows .item(i) .wko_mst_originator.split(':');
                EmployeeName_split = Employee_split[0].trim();
              }

              let AssetGroup_split = results.rows .item(i) .ast_mst_asset_group.split(':');
              let WorkArea_split = results.rows .item(i) .wko_mst_work_area.split(':');
              let AssetLoca_split = results.rows .item(i) .wko_mst_asset_location.split(':');
              let AssetLevel_split = results.rows .item(i) .wko_mst_asset_level.split(':');
              let CosetCenter_split = results.rows .item(i) .wko_mst_chg_costcenter.split(':');

              let OrgPriority_split = results.rows .item(i) .wko_mst_orig_priority.split(':');
              let PlanPriority_split = results.rows .item(i) .wko_mst_plan_priority.split(':');
              let org_date = results.rows.item(i).wko_mst_org_date;
              let due_date = results.rows.item(i).wko_mst_due_date;

              console.log(org_date);
              console.log(due_date);

              let WorkType_split = results.rows .item(i) .wko_det_work_type.split(':');
              let FaultCode_split = results.rows .item(i) .wko_mst_flt_code.split(':');
              let WorkOrderStatus_split = results.rows .item(i) .wko_mst_status.split(':');

              if (!results.rows.item(i).wko_det_assign_to) {
                AssignTo_split = '';
              } else {
                AssignTo_key_split = results.rows .item(i) .wko_det_assign_to.split(':');
                AssignTo_split = AssignTo_key_split[0].trim();
              }

              if (!results.rows.item(i).per_assignto) {
                PerAssignTo_split = '';
              } else {
                PerAssignTo_key_split = results.rows.item(i).per_assignto.split(':');
                PerAssignTo_split = PerAssignTo_key_split[0].trim();
              }




              if (!results.rows.item(i).wko_det_laccount) {
                LaborAccount_split = '';
              } else {
                LaborAccount_key_split = results.rows .item(i) .wko_det_laccount.split(':');
                LaborAccount_split = LaborAccount_key_split[0].trim();
              }

              if (!results.rows.item(i).wko_det_caccount) {
                ContractAccount_split = '';
              } else {
                ContractAccount_key_split = results.rows .item(i) .wko_det_caccount.split(':');
                ContractAccount_split = ContractAccount_key_split[0].trim();
              }

              if (!results.rows.item(i).wko_det_maccount) {
                MaterialAccount_split = '';
              } else {
                MaterialAccount_key_split = results.rows .item(i) .wko_det_maccount.split(':');
                MaterialAccount_split = MaterialAccount_key_split[0].trim();
              }

              if (!results.rows.item(i).ast_mst_asset_code) {
                AssetCode_split = '';
              } else {
                AssetCode_key_split = results.rows .item(i) .ast_mst_asset_code.split(':');
                AssetCode_split = AssetCode_key_split[0].trim();
              }

              if (!results.rows.item(i).ast_mst_asset_status) {
                AssetStatus_split = '';
              } else {
                AssetStatus_key_split = results.rows .item(i) .ast_mst_asset_status.split(':');
                AssetStatus_split = AssetStatus_key_split[0].trim();
              }

              let datetime5;
              if ( results.rows.item(i).wko_det_datetime5 === '1900-01-01 00:00:00.000000' ) {
                datetime5 = '';
              } else {
                datetime5 = results.rows.item(i).wko_det_datetime5;
              }

              let Update_WorkOrder = {

                site_cd: Site_cd,
                EmpID: EmpID,
                EmpName: EmpName,

                wko_mst_originator: EmployeeName_split,
                wko_mst_phone: results.rows.item(i).wko_mst_phone,

                ast_mst_asset_no: results.rows.item(i).wko_mst_assetno,
                ast_mst_asset_shortdesc: results.rows.item(i).ast_mst_asset_shortdesc,
                ast_mst_asset_group: AssetGroup_split[0].trim(),
                mst_war_work_area: WorkArea_split[0].trim(),
                ast_mst_asset_locn: AssetLoca_split[0].trim(),
                ast_mst_asset_lvl: AssetLevel_split[0].trim(),
                wko_mst_chg_costcenter: CosetCenter_split[0].trim(),

                wko_mst_wo_no: results.rows.item(i).wko_mst_wo_no,
                wko_mst_orig_priority: OrgPriority_split[0].trim(),
                wko_mst_plan_priority: PlanPriority_split[0].trim(),
                wko_mst_org_date: org_date,
                wko_mst_due_date: due_date,
                wko_det_work_type: WorkType_split[0].trim(),
                wko_mst_flt_code: FaultCode_split[0].trim(),
                wko_mst_descs: results.rows.item(i).wko_mst_descs,
                wko_mst_status: WorkOrderStatus_split[0].trim(),
                wko_det_assign_to: AssignTo_split,
                wko_det_laccount: LaborAccount_split,
                wko_det_caccount: ContractAccount_split,
                wko_det_maccount: MaterialAccount_split,

                ast_mst_asset_code: AssetCode_split,
                per_assignto: PerAssignTo_split,
                assign_remake: results.rows.item(i).per_assign_remake,
                RowID: results.rows.item(i).RowID,
                wko_det_varchar9: results.rows.item(i).wko_det_varchar9,
                wko_det_varchar10: results.rows.item(i).wko_det_varchar10,
                wko_det_datetime5: datetime5,

                LOGINID: LoginID,
                dvc_id: dvc_id,

        
              };

              Edit_Wko_mst.push(Update_WorkOrder);
              var Wko_mstList = {
                  Header: Edit_Wko_mst,
              };

              
            }

            update_edit_workorder(Wko_mstList)
            
          } else {
            get_offline_response();
          }
        },
      );
    });
  };

  const update_edit_workorder = async (Wko_mstList)=>{

    var sync_url =  Baseurl + '/update_workorder.php?';
    var sync_date = moment().format('YYYY-MM-DD HH:mm:ss');
    var dvc_id = DeviceInfo.getDeviceId();
    

    try {
      const response = await axios.post( `${Baseurl}/off_update_workorder.php?site_cd=${Site_cd}&sync_step=Step 2 Upload Edit Work Order&sync_time=${sync_date}&sync_status=offline&sync_url=${sync_url}&LOGINID=${LoginID}&dvc_id=${dvc_id}`,
        JSON.stringify(Wko_mstList),
        {headers: {'Content-Type': 'application/json'}},
      );
       //console.log('Edit Work Order:' + JSON.stringify(response.data.status));
      if (response.data.status === 'SUCCESS') {
        //console.log('Edit Work Order:' + JSON.stringify(response.data.message));

        get_offline_response();
        
      } else {
        setIndicators_Visible(false);
        Alert.alert(response.data.status, response.data.message, [ {text: 'OK'}]);
      }
    } catch (error) {
      setIndicators_Visible(false);
      console.log('Step 2 Upload Edit Work Order', error);
      alert('Step 2 Upload Edit Work Order', error);
    }

  }

  //Step 03 OFFLINE Response
  const get_offline_response = async () => {
    setIndicators_step('3');
    setIndicators_text('Update Work order response syncing....');

    db.transaction(function (tx) {
      tx.executeSql(
        'SELECT * FROM wko_det_response WHERE sts_column =? OR RowID is null',
        ['Update'],
        (tx, results) => {
          console.log('Response Count', results.rows.length);
          if (results.rows.length > 0) {
            const wko_det_response = [];

            for (let i = 0; i < results.rows.length; ++i) {

              let Update_Response = {

                site_cd: Site_cd,
                mst_RowID: results.rows.item(i).mst_RowID,

                wko_det_tech_resp_date: results.rows.item(i).wko_det_tech_resp_date,
                wko_det_tech_resp_id: results.rows.item(i).wko_det_tech_resp_id,
                wko_det_resp_contact: results.rows.item(i).wko_det_resp_contact,
                wko_det_resp_id: results.rows.item(i).wko_det_resp_id,
                wko_det_resp_date: results.rows.item(i).wko_det_resp_date,
                wko_det_resp_name: results.rows.item(i).wko_det_resp_name,
                wko_det_varchar9: EmpID,

                LOGINID: LoginID,
                dvc_id: dvc_id,
               
              };

              //console.log('Response List', JSON.stringify(Update_Response));
              wko_det_response.push(Update_Response);

              var ResponseList = {
                Header: wko_det_response,
              };
            }
            off_update_response(ResponseList);
          } else {
            get_offline_ackowledgement();
          }
        },
      );
    });
  };

  const off_update_response = async (ResponseList)=>{

    var sync_url =  Baseurl + '/off_update_response.php?';
    var sync_date = moment().format('YYYY-MM-DD HH:mm:ss');
    var dvc_id = DeviceInfo.getDeviceId();
    

    try {
      const response = await axios.post( `${Baseurl}/off_update_response.php?site_cd=${Site_cd}&sync_step=Step 3 Upload Work Order Response&sync_time=${sync_date}&sync_status=offline&sync_url=${sync_url}&LOGINID=${LoginID}&dvc_id=${dvc_id}`,
        JSON.stringify(ResponseList),
        {headers: {'Content-Type': 'application/json'}},
      );
       //console.log('Edit Work Order:' + JSON.stringify(response.data.status));
      if (response.data.status === 'SUCCESS') {
     
        get_offline_ackowledgement();
        
      } else {
        setIndicators_Visible(false);
        Alert.alert(response.data.status, response.data.message, [ {text: 'OK'}]);
      }
    } catch (error) {
      setIndicators_Visible(false);
      alert('Step 3 Upload Work Order Response', error);
    }

  }


  //Step 04 OFFLINE Ackledgement
  const get_offline_ackowledgement = async () => {
    setIndicators_step('4');
    setIndicators_text('Update Work order Ackledgement syncing....');

    db.transaction(function (tx) {
      tx.executeSql(
        'SELECT * FROM wko_det_ackowledgement WHERE sts_column =? OR RowID is null',
        ['Update'],
        (tx, results) => {
          console.log('acknowledgement Count', results.rows.length);
          if (results.rows.length > 0) {
            const WKO_ACK = [];
            for (let i = 0; i < results.rows.length; ++i) {

             
              let update_acknowledgement = {
                site_cd: Site_cd,
                mst_RowID: results.rows.item(i).mst_RowID,

                rating1: results.rows.item(i).wko_det_rating1,
                rating2: results.rows.item(i).wko_det_rating2,
                rating3: results.rows.item(i).wko_det_rating3,

                ack_name: results.rows.item(i).wko_det_ack_name,
                ack_contact: results.rows.item(i).wko_det_ack_contact,
                ack_id: results.rows.item(i).wko_det_ack_id,

                dvc_id: dvc_id,
                LOGINID: LoginID,

              };

             // console.log( 'Acknowledgement List', JSON.stringify(update_acknowledgement));
             WKO_ACK.push(update_acknowledgement)

             var Wko_ackList = {
              Header: WKO_ACK,
             };
            
            }
            update_acknowledgement(Wko_ackList);
            
          } else {
            get_offline_timecard();
          }
        },
      );
    });
  };

  const update_acknowledgement = async (Wko_ackList)=>{

    var sync_url =  Baseurl + '/off_update_acknowledgement.php?';
    var sync_date = moment().format('YYYY-MM-DD HH:mm:ss');
    var dvc_id = DeviceInfo.getDeviceId();
    

    try {
      const response = await axios.post( `${Baseurl}/off_update_acknowledgement.php?site_cd=${Site_cd}&sync_step=Step 4 Upload acknowledgement&sync_time=${sync_date}&sync_status=offline&sync_url=${sync_url}&LOGINID=${LoginID}&dvc_id=${dvc_id}`,
        JSON.stringify(Wko_ackList),
        {headers: {'Content-Type': 'application/json'}},
      );
       //console.log('Edit Work Order:' + JSON.stringify(response.data.status));
      if (response.data.status === 'SUCCESS') {
        //console.log('Edit Work Order:' + JSON.stringify(response.data.message));

        get_offline_timecard();
        
      } else {
        setIndicators_Visible(false);
        Alert.alert(response.data.status, response.data.message, [ {text: 'OK'}]);
      }
    } catch (error) {
      setIndicators_Visible(false);
      alert('Step 4 Upload acknowledgement', error);
    }

  }

 
  //Step 05 OFFLINE Time Card
  const get_offline_timecard = async () => {
    setIndicators_step('5');
    setIndicators_text('Update Work order Time Card syncing....');

    db.transaction(function (tx) {
      tx.executeSql('SELECT * FROM wko_ls8_timecard', [], (tx, results) => {
        console.log('wko_ls8_timecard Results_test', results.rows.length);

        if (results.rows.length > 0) {
          const timecard = [];
          const timecard_Promises = [];

          for (let i = 0; i < results.rows.length; ++i) {
            var sync_date = moment().format('YYYY-MM-DD HH:mm:ss');
            let dvc_id = DeviceInfo.getDeviceId();

            let mst_RowID = results.rows.item(i).mst_RowID;

            let wko_ls8_assetno = results.rows.item(i).wko_ls8_assetno;

            let wko_ls8_empl_id = results.rows.item(i).wko_ls8_empl_id;
            let wko_ls8_craft = results.rows.item(i).wko_ls8_craft;
            let wko_ls8_hours_type = results.rows.item(i).wko_ls8_hours_type;

            let wko_ls8_hrs = parseFloat( results.rows.item(i).wko_ls8_hrs, ).toFixed(4);
            let wko_ls8_multiplier = parseFloat( results.rows.item(i).wko_ls8_multiplier, ).toFixed(4);
            let wko_ls8_adder = parseFloat( results.rows.item(i).wko_ls8_adder, ).toFixed(4);
            let wko_ls8_rate = parseFloat( results.rows.item(i).wko_ls8_rate, ).toFixed(4);
            let wko_ls8_act_cost = parseFloat( results.rows.item(i).wko_ls8_act_cost, ).toFixed(4);

            let wko_ls8_chg_costcenter = results.rows.item(i).wko_ls8_chg_costcenter;
            let wko_ls8_chg_account = results.rows.item(i).wko_ls8_chg_account;
            let time_card_no = results.rows.item(i).wko_ls8_time_card_no;

            let wko_ls8_datetime1 = results.rows.item(i).wko_ls8_datetime1;
            let wko_ls8_datetime2 = results.rows.item(i).wko_ls8_datetime2;
            let rowid = results.rows.item(i).RowID;

            let wko_mst_wo_no = results.rows.item(i).wko_mst_wo_no;

            let insert_time_card = {
              site_cd: Site_cd,
              mst_RowID: mst_RowID,
              assetno: wko_ls8_assetno,
              wko_mst_wo_no: wko_mst_wo_no,

              originator: wko_ls8_empl_id,
              craft: wko_ls8_craft,
              hourtype: wko_ls8_hours_type,

              total_hrs: wko_ls8_hrs,
              rate: wko_ls8_rate,
              multiplier: wko_ls8_multiplier,
              adder: wko_ls8_adder,

              act_cost: wko_ls8_act_cost,
              chg_costcenter: wko_ls8_chg_costcenter,
              chg_account: wko_ls8_chg_account,
              time_card_no: time_card_no,
              datetime1: wko_ls8_datetime1,
              datetime2: wko_ls8_datetime2,
              audit_user: EmpID,
              audit_date: sync_date,
              RowId: rowid,

              LOGINID: LoginID,
              dvc_id: results.rows.item(i).dvc_id,
             
            };

            timecard.push(insert_time_card);

            var timecardList = {
              Header: timecard,
            };

            console.log('final insert_time_card List', JSON.stringify(timecardList));

            //timecard_Promises.push(UP_TimeCard(timecardList,i))
          }

          offline_TimeCard(timecardList);
        } else {
          get_offline_asset_downtime();
        }
      });
    });
  };

  const offline_TimeCard = async timecardList => {

    var sync_url =  Baseurl + '/off_insert_time_card.php?';
    var sync_date = moment().format('YYYY-MM-DD HH:mm:ss');
    var dvc_id = DeviceInfo.getDeviceId();

    try {
      const response = await axios.post( `${Baseurl}/off_insert_time_card.php?site_cd=${Site_cd}&sync_step=Step 5 Upload Work Order Time Card&sync_time=${sync_date}&sync_status=offline&sync_url=${sync_url}&LOGINID=${LoginID}&dvc_id=${dvc_id}`,
      JSON.stringify(timecardList), 
      {headers: {'Content-Type': 'application/json'}},
      );
      console.log('Insert Time Card response:' + JSON.stringify(response.data));

      if (response.data.status === 'SUCCESS') {
        console.log('Time Card:' + JSON.stringify(response.data.message));
        get_offline_asset_downtime();
      } else {
        setIndicators_Visible(false);
        Alert.alert(response.data.status, response.data.message, [ {text: 'OK'}]);
      }
    } catch (error) {
      setIndicators_Visible(false);
      alert('Step 5 Upload Work Order Time Card', error);
    }
  };

  //Step 06 OFFLINE Asset DownTime
  const get_offline_asset_downtime = async () => {
    setIndicators_step('6');
    setIndicators_text('Update Work order Asset DownTime syncing....');

    db.transaction(function (tx) {
      tx.executeSql('SELECT * FROM ast_dwntime', [], (tx, results) => {
        console.log('Asset DownTime Count:', results.rows.length);

        if (results.rows.length > 0) {
          const ast_dwntime_Promises = [];
          const ast_dwntime = [];
          for (let i = 0; i < results.rows.length; ++i) {
            var sync_date = moment().format('YYYY-MM-DD HH:mm:ss');
            let dvc_id = DeviceInfo.getDeviceId();

            let assetno = results.rows.item(i).ast_dwntime_asset_no;
            let out_Date = results.rows.item(i).ast_dwntime_out_date;
            let return_Date = results.rows.item(i).ast_dwntime_rts_date;

            let dwntime = results.rows.item(i).ast_dwntime_downtime;

            let from_Date = results.rows.item(i).ast_dwntime_repair_from;
            let to_Date = results.rows.item(i).ast_dwntime_repair_to;

            let reprtime = results.rows.item(i).ast_dwntime_repairtime;
            let down_wo = results.rows.item(i).ast_dwntime_down_wo;
            let up_wo = results.rows.item(i).ast_dwntime_up_wo;
            let sched_flg = results.rows.item(i).ast_dwntime_sched_flag;
            let desc = results.rows.item(i).ast_dwntime_remark;
            let rowid = results.rows.item(i).rowid;

            let asset_downtime = {
              site_cd: Site_cd,
              ast_dwntime_asset_no: assetno,
              ast_dwntime_out_date: out_Date,
              ast_dwntime_rts_date: return_Date,
              ast_dwntime_downtime: dwntime,
              ast_dwntime_repair_from: from_Date,
              ast_dwntime_repair_to: to_Date,
              ast_dwntime_repairtime: reprtime,
              ast_dwntime_down_wo: down_wo,
              ast_dwntime_up_wo: up_wo,
              ast_dwntime_status_original: '',
              ast_dwntime_status_down: '',
              ast_dwntime_status_up: '',
              ast_dwntime_sched_flag: sched_flg,
              ast_dwntime_remark: desc,
              LOGINID: LoginID,
              EmpID: EmpID,
              RowID: rowid,
             
            };

            ast_dwntime.push(asset_downtime);

            var AssestDowntime = {
              Header: ast_dwntime,
            };
            //console.log('final asset_downtime List', JSON.stringify(AssestDowntime));
          }

          offline_AssetDownTime(AssestDowntime);
        } else {
          get_offline_WKO_images();
        }
      });
    });
  };

  const offline_AssetDownTime = async asset_downtime => {

    var sync_url =  Baseurl + '/off_insert_work_order_asset_downtime.php?';
    var sync_date = moment().format('YYYY-MM-DD HH:mm:ss');
    var dvc_id = DeviceInfo.getDeviceId();
    

    try {
      const response = await axios.post( `${Baseurl}/off_insert_work_order_asset_downtime.php?site_cd=${Site_cd}&sync_step=Step 6 Upload Work Order Asset Down Time&sync_time=${sync_date}&sync_status=offline&sync_url=${sync_url}&LOGINID=${LoginID}&dvc_id=${dvc_id}`,
      JSON.stringify(asset_downtime),
      {headers: {'Content-Type': 'application/json'}},
      );
     // console.log( 'Insert Asset Dow Time response:' + JSON.stringify(response.data), );

      if (response.data.status === 'SUCCESS') {
        console.log('Asset DowTime:' + JSON.stringify(response.data.message));

        get_offline_WKO_images();
      } else {
        setIndicators_Visible(false);
        Alert.alert(response.data.status, response.data.message, [
          {text: 'OK'},
        ]);
      }
    } catch (error) {
      setIndicators_Visible(false);
      console.log('Asset DowTime:',error);
      alert('Step 6 Upload Work Order Asset DownTime', error);
    }
  };

  //step 07 OFFLINE WORK ORDER IMAGE UPLOAD
  const get_offline_WKO_images = async () => {
    setIndicators_step('7');
    setIndicators_text('Update Work order Attachment syncing....');

    db.transaction(function (tx) {
      tx.executeSql(
        'SELECT * FROM wko_ref WHERE Exist =? and type is not ?',
        ['New', 'A'],
        (tx, results) => {
          console.log('Work order Attachment Count:', results.rows.length);
          if (results.rows.length > 0) {
            const wko_ref_Promises = [];

            let k = 0;
            for (let i = 0; i < results.rows.length; ++i) {
              const type = results.rows.item(i).type.split('/');
              console.log('type', results.rows.item(i));
              var t;
              if (type[0] === 'video') {
                t = '.mp4';
              } else {
                t = results.rows.item(i).file_name;
              }

              let mst_RowID = results.rows.item(i).mst_RowID;
              let file_name = t;
              let local_path = results.rows.item(i).Local_link;
              let Type = results.rows.item(i).type;

              k++;

              console.log('type', file_name);
              wko_ref_Promises.push( UP_wko_ref_Attachment( mst_RowID, file_name, local_path, Type, i, ), );
            }

            Promise.all(wko_ref_Promises)
              .then(results => {
                setTimeout(() => {
                  get_offline_WKO_Resp_images();
                }, 10000);
              })
              .catch(e => {
                setIndicators_Visible(false);
                alert('Step 7 Update Work order Attachment', e);
              });
          } else {
             get_offline_WKO_Resp_images();
          }
        },
      );
    });
  };

  const UP_wko_ref_Attachment = (mst_RowID, file_name, local_path, Type, i) => {
    return new Promise(resolve => {
      setTimeout(() => {
        offline_wko_ref_Attachment(mst_RowID, file_name, local_path, Type);

        resolve(i);
      }, Math.floor(Math.random() * 1000));
    });
  };

  const offline_wko_ref_Attachment = async ( mst_RowID, file_name, local_path, Type, ) => {

    console.log('Baseurl' + Baseurl);
    const SPLIT_URL = Baseurl.split('/');
    const SPLIT_URL1 = SPLIT_URL[SPLIT_URL.length - 2];
    const SPLIT_URL2 = SPLIT_URL[SPLIT_URL.length - 1];
    const SPLIT_URL3 = SPLIT_URL1+'/'+SPLIT_URL2
    console.log('URL' + SPLIT_URL3);

    let data = {
      data: {
        rowid: mst_RowID,
        site_cd: Site_cd,
        EMPID: EmpID,
        LOGINID: LoginID,
        folder: SPLIT_URL3,
        dvc_id: dvc_id,
        LOGINID: LoginID,
      },
    };

    let loa = {uri: local_path, name: file_name, type: Type};

    const formData = new FormData();

    formData.append('count', '1');
    formData.append('json', JSON.stringify(data));
    formData.append('file_1', {uri: local_path, name: file_name, type: Type});

    console.log('IMAGE VALUES: ', JSON.stringify(formData));

    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${Baseurl}/off_insert_workorder_image_file.php?`);
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
          console.log('success ATT', json_obj.data);
        } else {
          setIndicators_Visible(false);
          alert('Step 7 Update Work order Attachment', xhr.responseText);
          console.log('error', xhr.responseText, xhr.status);
        }
      };

      //   let res = await fetch(`${Baseurl}/off_insert_workorder_image_file.php?`, {
      //     method: 'post',
      //     body: formData,
      //     headers: {
      //       'Content-Type': 'multipart/form-data; ',
      //     },
      //   });
      //   let responseJson = await res.json();

      //   console.log('error', JSON.stringify(responseJson));
      //   if (responseJson.status == 1) {
      //     alert('Upload Successful');
      //   }
    } catch (error) {
      setIndicators_Visible(false);
      alert('Step 7 Update Work order Attachment', error);
      console.log('error', error);
    }
  };

  //step 08 OFFLINE WORK ORDER RESPONSE SIGN IMAGE UPLOAD
  const get_offline_WKO_Resp_images = async () => {
    setIndicators_step('8');
    setIndicators_text('Update Work order Response Sign syncing....');

    db.transaction(function (tx) {
      tx.executeSql(
        'SELECT * FROM wko_ref WHERE Exist =? and type =? and column2=?',
        ['New', 'A', 'RESPONSE_SIGN'],
        (tx, results) => {
          console.log('Work order Response Sign Count:', results.rows.length);
          if (results.rows.length > 0) {
            const wko_ref_Promises = [];
            let k = 0;
            for (let i = 0; i < results.rows.length; ++i) {
              let mst_RowID = results.rows.item(i).mst_RowID;
              let file_name = results.rows.item(i).file_name;
              let local_path = results.rows.item(i).attachment;

              k++;
              wko_ref_Promises.push(
                UP_wko_ref_response(mst_RowID, local_path, file_name, i),
              );
            }

            Promise.all(wko_ref_Promises)
              .then(results => {
                get_offline_WKO_Ack_images();
              })
              .catch(e => {
                setIndicators_Visible(false);
                alert('Step 8 Update Work order Response Sign', e);
              });
          } else {
            get_offline_WKO_Ack_images();
          }
        },
      );
    });
  };

  const UP_wko_ref_response = (ROW_ID, path, name, i) => {
    return new Promise(resolve => {
      setTimeout(() => {
        offline_wko_ref_response(ROW_ID, path, name, i);

        resolve(i);
      }, Math.floor(Math.random() * 1000));
    });
  };

  const offline_wko_ref_response = async (ROW_ID, path, name, i) => {
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

    console.log('RESP', JSON.stringify(data));

    const formData = new FormData();
    formData.append('count', '1');
    formData.append('json', JSON.stringify(data));
    formData.append('base64string', path);

    //formData.append('file_'+[i], {uri:path,name:name,type:'image/jpeg'});

    //console.log(JSON.stringify( path));

    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${Baseurl}/update_response_image_file_react.php?`);
      xhr.setRequestHeader('Content-Type', 'multipart/form-data');
      xhr.send(formData);
      //console.log('success', xhr.responseText);
      xhr.onreadystatechange = e => {
        if (xhr.readyState !== 4) {
          return;
        }

        if (xhr.status === 200) {
          //console.log('success', xhr.responseText);
          var json_obj = JSON.parse(xhr.responseText);
          console.log('success RESP', json_obj.data);
        } else {
          setIndicators_Visible(false);
          alert('Step 8 Update Work order Response Sign', xhr.responseText);
          //console.log('error', xhr.responseText);
        }
      };
    } catch (error) {
      setIndicators_Visible(false);
      alert('Step 8 Update Work order Response Sign', error);
    }
  };

  //step 9 OFFLINE WORK ORDER ACKNOWLEDGEMENT SIGN IMAGE UPLOAD
  const get_offline_WKO_Ack_images = async () => {
    setIndicators_step('9');
    setIndicators_text('Update Work Order Acknowledgement Sign syncing....');

    db.transaction(function (tx) {
      tx.executeSql(
        'SELECT * FROM wko_ref WHERE Exist =? and type =? and column2=?',
        ['New', 'A', 'SIGN'],
        (tx, results) => {
          console.log(
            'Work order Acknowledgement Sign Count:',
            results.rows.length,
          );
          if (results.rows.length > 0) {
            const wko_ref_Promises = [];
            let k = 0;
            for (let i = 0; i < results.rows.length; ++i) {
              let mst_RowID = results.rows.item(i).mst_RowID;
              let file_name = results.rows.item(i).file_name;
              let local_path = results.rows.item(i).attachment;

              k++;
              wko_ref_Promises.push( UP_wko_ref_ack(mst_RowID, local_path, file_name, i), );
            }

            Promise.all(wko_ref_Promises)
              .then(results => {
                get_offline_CheckList();
                
              })
              .catch(e => {
                setIndicators_Visible(false);
                alert('Step 10 Update Work order Acknowledgement Sign', e);
              });
          } else {
            get_offline_CheckList();

            
          }
        },
      );
    });
  };

  const UP_wko_ref_ack = (ROW_ID, path, name, i) => {
    return new Promise(resolve => {
      setTimeout(() => {
        offline_wko_ref_ack(ROW_ID, path, name, i);

        resolve(i);
      }, Math.floor(Math.random() * 1000));
    });
  };

  const offline_wko_ref_ack = async (ROW_ID, path, name, i) => {
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

    const formData = new FormData();
    formData.append('count', '1');
    formData.append('json', JSON.stringify(data));
    formData.append('base64string', path);

    try {
      const xhr = new XMLHttpRequest();
      xhr.open( 'POST', `${Baseurl}/update_action_workorder_image_file_react.php?`, );
      xhr.setRequestHeader('Content-Type', 'multipart/form-data');
      xhr.send(formData);
      //console.log('success', xhr.responseText);
      xhr.onreadystatechange = e => {
        if (xhr.readyState !== 4) {
          return;
        }

        if (xhr.status === 200) {
          //console.log('success', xhr.responseText);
          var json_obj = JSON.parse(xhr.responseText);
          console.log(' ACK success', json_obj.data);
        } else {
          setIndicators_Visible(false);
          alert(
            'Step 9 Update Work order Acknowledgement Sign',
            xhr.responseText,
          );
          //console.log('error', xhr.responseText);
        }
      };
    } catch (error) {
      setIndicators_Visible(false);
      alert('Step 9 Update Work order Acknowledgement Sign', error);
    }
  };

  //Step 10 OFFLINE CheckList
  const get_offline_CheckList = async () => {
    setIndicators_step('10');
    setIndicators_text('Update Work order CheckList syncing....');
    //Switch_to_Online()

    ID = uuid.v4();

    db.transaction(function (tx) {
      tx.executeSql(
        'UPDATE wko_isp_details SET column1 = ?',
        [ID],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log('Update success');
          } else {
            setAlert(true, 'danger', 'Update Timestamp Failed', 'OK');
          }
        },
      );

      tx.executeSql('SELECT * FROM wko_isp_details', [], (tx, results) => {
        console.log('wko_isp_details Results_test', results.rows.length);

        if (results.rows.length > 0) {
          const wko_isp_details = [];
          const wko_isp_details_Promises = [];

          for (let i = 0; i < results.rows.length; ++i) {
            var sync_date = moment().format('YYYY-MM-DD HH:mm:ss');
            let dvc_id = DeviceInfo.getDeviceId();
            var LOCAL_ID = results.rows.item(i).ID;

            let check_list = {
              site_cd: results.rows.item(i).site_cd,
              rowid: results.rows.item(i).rowid,
              mst_rowid: results.rows.item(i).mst_RowID,
              wko_isp_asset_no: results.rows.item(i).wko_isp_asset_no,

              wko_isp_job_cd: results.rows.item(i).wko_isp_job_cd,
              wko_isp_job_desc: results.rows.item(i).wko_isp_job_desc,
              wko_isp_sec_no: results.rows.item(i).wko_isp_sec_no,
              wko_isp_sec_desc: results.rows.item(i).wko_isp_sec_desc,
              wko_isp_stp_no: results.rows.item(i).wko_isp_stp_no,
              wko_isp_stp_desc: results.rows.item(i).wko_isp_stp_desc,
              wko_isp_stp_datatype: results.rows.item(i).wko_isp_stp_datatype,
              wko_isp_stp_rowid: results.rows.item(i).wko_isp_stp_rowid,

              wko_isp_varchar1: results.rows.item(i).wko_isp_varchar1,
              wko_isp_varchar2: results.rows.item(i).wko_isp_varchar2,
              wko_isp_varchar3: results.rows.item(i).wko_isp_varchar3,

              wko_isp_numeric1: results.rows.item(i).wko_isp_numeric1,
              wko_isp_numeric2: results.rows.item(i).wko_isp_numeric2,
              wko_isp_numeric3: results.rows.item(i).wko_isp_numeric3,

              wko_isp_datetime1: results.rows.item(i).wko_isp_datetime1,
              wko_isp_datetime2: results.rows.item(i).wko_isp_datetime2,
              wko_isp_datetime3: results.rows.item(i).wko_isp_datetime3,

              wko_isp_checkbox1: results.rows.item(i).wko_isp_checkbox1,
              wko_isp_checkbox2: results.rows.item(i).wko_isp_checkbox2,
              wko_isp_checkbox3: results.rows.item(i).wko_isp_checkbox3,

              wko_isp_dropdown1: results.rows.item(i).wko_isp_dropdown1,
              wko_isp_dropdown2: results.rows.item(i).wko_isp_dropdown2,
              wko_isp_dropdown3: results.rows.item(i).wko_isp_dropdown3,

              wko_isp_uom: results.rows.item(i).wko_isp_uom,
              wko_isp_min_thr: results.rows.item(i).wko_isp_min_thr,
              wko_isp_max_thr: results.rows.item(i).wko_isp_max_thr,
              wko_isp_ovr_thr: results.rows.item(i).wko_isp_ovr_thr,
              file_name: results.rows.item(i).file_name,
              

              audit_user: results.rows.item(i).audit_user,
              audit_date: sync_date,
              mbl_audit_user: LoginID,
              mbl_audit_date: sync_date,

              dvc_id: dvc_id,
              LOGINID: LoginID,
              column1: results.rows.item(i).column1,

              sync_step: 'Step 10 Work Order Check list',
              sync_time: sync_date,
              sync_status: 'offline',
              sync_url: Baseurl + '/update_check_list.php?',
            };

            wko_isp_details.push(check_list);
            var checklist = { Header: wko_isp_details, };
          }

          //console.log('final check_list List', JSON.stringify(checklist));
          offline_check_list(wko_isp_details, ID);
        } else {

          get_offline_workorder_complete();
          db.transaction(txn => {
            //01 ast_mst
            txn.executeSql('DELETE FROM  ast_mst', [], (txn, results) => {
              console.log('ast_mst Results', results.rowsAffected);
              if (results.rowsAffected > 0) {
                console.log('ast_mst deleted successfully');
              } else {
                console.log('ast_mst unsuccessfully');
              }
            });

            //02 wko_mst
            txn.executeSql('DELETE FROM  wko_mst', [], (txn, results) => {
              console.log('wko_mst Results', results.rowsAffected);
              if (results.rowsAffected > 0) {
                console.log('wko_mst deleted successfully');
              } else {
                console.log('wko_mst unsuccessfully');
              }
            });

            //03 wko_det_completion
            txn.executeSql(
              'DELETE FROM  wko_det_completion',
              [],
              (txn, results) => {
                console.log('wko_det_completion Results', results.rowsAffected);
                if (results.rowsAffected > 0) {
                  console.log('wko_det_completion deleted successfully');
                } else {
                  console.log('wko_det_completion unsuccessfully');
                }
              },
            );

            //04 wko_det_ackowledgement
            txn.executeSql(
              'DELETE FROM  wko_det_ackowledgement',
              [],
              (txn, results) => {
                console.log(
                  'wko_det_ackowledgement Results',
                  results.rowsAffected,
                );
                if (results.rowsAffected > 0) {
                  console.log('wko_det_ackowledgement deleted successfully');
                } else {
                  console.log('wko_det_ackowledgement unsuccessfully');
                }
              },
            );

            //05 wko_isp_heard
            txn.executeSql('DELETE FROM  wko_isp_heard', [], (txn, results) => {
              console.log('wko_isp_heard Results', results.rowsAffected);
              if (results.rowsAffected > 0) {
                console.log('wko_isp_heard deleted successfully');
              } else {
                console.log('wko_isp_heard unsuccessfully');
              }
            });

            //06 wko_isp_details
            txn.executeSql(
              'DELETE FROM  wko_isp_details',
              [],
              (txn, results) => {
                console.log('wko_isp_details Results', results.rowsAffected);
                if (results.rowsAffected > 0) {
                  console.log('wko_isp_details deleted successfully');
                } else {
                  console.log('wko_isp_details unsuccessfully');
                }
              },
            );

            //07 stp_zom
            txn.executeSql('DELETE FROM  stp_zom', [], (txn, results) => {
              console.log('stp_zom Results', results.rowsAffected);
              if (results.rowsAffected > 0) {
                console.log('stp_zom deleted successfully');
              } else {
                console.log('stp_zom unsuccessfully');
              }
            });

            //08 stp_zom
            txn.executeSql(
              'DELETE FROM  wko_ls8_timecard',
              [],
              (txn, results) => {
                console.log('wko_ls8_timecard Results', results.rowsAffected);
                if (results.rowsAffected > 0) {
                  console.log('wko_ls8_timecard deleted successfully');
                } else {
                  console.log('wko_ls8_timecard unsuccessfully');
                }
              },
            );

            //09 prm_ast
            txn.executeSql('DELETE FROM  prm_ast', [], (txn, results) => {
              console.log('prm_ast Results', results.rowsAffected);
              if (results.rowsAffected > 0) {
                console.log('prm_ast deleted successfully');
              } else {
                console.log('prm_ast unsuccessfully');
              }
            });

            //10 wko_det_response
            txn.executeSql(
              'DELETE FROM  wko_det_response',
              [],
              (txn, results) => {
                console.log('wko_det_response Results', results.rowsAffected);
                if (results.rowsAffected > 0) {
                  console.log('wko_det_response deleted successfully');
                } else {
                  console.log('wko_det_response unsuccessfully');
                }
              },
            );

            //11 wko_ref
            txn.executeSql('DELETE FROM  wko_ref', [], (txn, results) => {
              console.log('wko_ref Results', results.rowsAffected);
              if (results.rowsAffected > 0) {
                console.log('wko_ref deleted successfully');
              } else {
                console.log('wko_ref unsuccessfully');
              }
            });

            //11 Asset Down Time
            txn.executeSql('DELETE FROM  ast_dwntime', [], (txn, results) => {
              console.log('ast_dwntime Results', results.rowsAffected);
              if (results.rowsAffected > 0) {
                console.log('ast_dwntime deleted successfully');
              } else {
                console.log('ast_dwntime unsuccessfully');
              }
            });

            //ast_mst
            txn.executeSql('SELECT * FROM ast_mst', [], (txn, results) => {
              console.log('Asset Master List Count: ' + results.rows.length);
              setAssetCount(results.rows.length);
            });

            //wko_mst
            txn.executeSql('SELECT * FROM wko_mst', [], (txn, results) => {
              console.log(
                'Work Order Master List Count: ' + results.rows.length,
              );
              setWorkOrderCount(results.rows.length);
            });

            //wko_det_completion
            txn.executeSql(
              'SELECT * FROM wko_det_completion',
              [],
              (txn, results) => {
                console.log(
                  'Work Order Completion List Count: ' + results.rows.length,
                );
                setWorkOrderCompletionCount(results.rows.length);
              },
            );

            //wko_det_ackowledgement
            txn.executeSql(
              'SELECT * FROM wko_det_ackowledgement',
              [],
              (txn, results) => {
                console.log(
                  'Work Order Ackowledgement List Count: ' +
                    results.rows.length,
                );
                setWorkOrderAcknowledgementCount(results.rows.length);
              },
            );

            //wko_isp_heard
            txn.executeSql(
              'SELECT * FROM wko_isp_heard',
              [],
              (txn, results) => {
                console.log(
                  'Work Order Check List Heard Count: ' + results.rows.length,
                );
                setWorkOrderChecklistCount(results.rows.length);
              },
            );

            //wko_det_response
            txn.executeSql(
              'SELECT * FROM wko_det_response',
              [],
              (txn, results) => {
                console.log(
                  'Work Order Responces List Count: ' + results.rows.length,
                );
                setWorkOrderResponseCount(results.rows.length);
              },
            );

            //wko_ls8_timecard
            txn.executeSql(
              'SELECT * FROM wko_ls8_timecard',
              [],
              (txn, results) => {
                console.log(
                  'Work Order TimeCard List Count: ' + results.rows.length,
                );
                setWorkOrderTimeCardCount(results.rows.length);
              },
            );

            //ast_dwntime
            txn.executeSql('SELECT * FROM ast_dwntime', [], (tx, results) => {
              console.log(
                'Work Order Asset Down Time Count: ' + results.rows.length,
              );
              setAssetDownTimeCount(results.rows.length);
            });

            //Delete image Folder
            let PictureDir = Platform.OS === 'ios' ? fs.dirs.PictureDir : fs.dirs.DownloadDir + '/AC';
            RNFS.unlink(PictureDir); 


            setIndicators_Visible(false);
            AsyncStorage.setItem('WIFI', 'ONLINE');
            setOnlineText('Online');
            setOnText('On');
            setwifiname('wifi');
            setwificolor('green');
          });
        }
      });
    });
  };

  const offline_check_list = async (checklist, ID) => {
    const SPLIT_URL = Baseurl.split('/');
    const SPLIT_URL1 = SPLIT_URL[SPLIT_URL.length - 2];
    const SPLIT_URL2 = SPLIT_URL[SPLIT_URL.length - 1];
    const SPLIT_URL3 = SPLIT_URL1+'/'+SPLIT_URL2
    console.log('URL' + SPLIT_URL3);
    var sync_date = moment().format('YYYY-MM-DD HH:mm:ss');

    try {
      const response = await axios.post( `${Baseurl}/update_check_list.php?ID=${ID}&Folder=${SPLIT_URL3}&dvc_id=${dvc_id}&site_cd=${Site_cd}&sync_time=${sync_date}&LoginID=${LoginID}`,
        JSON.stringify(checklist),
        {headers: {'Content-Type': 'application/json'}},
      );
      console.log('Insert CheckList response:' + JSON.stringify(response.data));

      if (response.data.status === 'SUCCESS') {
        console.log('CheckList:' + JSON.stringify(response.data.message));

        get_offline_workorder_complete();

        
      } else {
        setIndicators_Visible(false);
        Alert.alert(response.data.status, response.data.message, [ {text: 'OK'}]);
      }
    } catch (error) {
      setIndicators_Visible(false);
      alert(error);
    }
  };

   //Step 05 OFFLINE Work Order Completions
   const get_offline_workorder_complete = async () => {
    setIndicators_step('5');
    setIndicators_text('Update Work order Completions syncing....');

    db.transaction(function (tx) {
      tx.executeSql(
        'SELECT * FROM wko_det_completion WHERE sts_column =? OR RowID is null',
        ['Update'],
        (tx, results) => {
          console.log('Completion Count:', results.rows.length);
          if (results.rows.length > 0) {
            const wko_det_comp = [];
            for (let i = 0; i < results.rows.length; ++i) {
              var sync_date = moment().format('YYYY-MM-DD HH:mm:ss');
              var LOCAL_ID = results.rows.item(i).ID;

              let CauseCode;
              if (results.rows.item(i).wko_det_cause_code === '') {
                CauseCode = '';
              } else {
                let CauseCode_split = results.rows .item(i) .wko_det_cause_code.split(':');
                CauseCode = CauseCode_split[0].trim();
              }

              let ActionCode;
              if (results.rows.item(i).wko_det_act_code === '') {
                ActionCode = '';
              } else {
                let ActionCode_split = results.rows .item(i) .wko_det_act_code.split(':');
                ActionCode = ActionCode_split[0].trim();
              }

              let WorkClass;
              if (results.rows.item(i).wko_det_work_class === '') {
                WorkClass = '';
              } else {
                let WorkClass_split = results.rows .item(i) .wko_det_work_class.split(':');
                WorkClass = WorkClass_split[0].trim();
              }

              let WorkGroup;
              if (results.rows.item(i).wko_det_work_grp === '') {
                WorkGroup = '';
              } else {
                let WorkGroup_split = results.rows .item(i) .wko_det_work_grp.split(':');
                WorkGroup = WorkGroup_split[0].trim();
              }

              let CorrectiveAction = results.rows.item(i).wko_det_corr_action;
              let MaintenanceRemark = results.rows.item(i).wko_det_note1;
              let checkboxState = results.rows.item(i).Is_checked;

              let Requested_by;

              if (results.rows.item(i).Requested_by === '') {
                Requested_by = '';
              } else {
                let Requested_by_split = results.rows .item(i) .Requested_by.split(':');
                Requested_by = Requested_by_split[0].trim();
              }
              let Contact_no = results.rows.item(i).Contact_no;

              let WorkOrderStatus;
              if (results.rows.item(i).wko_mst_status === '') {
                WorkOrderStatus = '';
              } else {
                let WorkOrderStatus_split = results.rows .item(i) .wko_mst_status.split(':');
                WorkOrderStatus = WorkOrderStatus_split[0].trim();
              }

              let WorkOrderStatusAfter;
              if (results.rows.item(i).wko_mst_status_after === '') {
                WorkOrderStatusAfter = '';
              } else {
                let WorkOrderStatusAfter_split = results.rows .item(i) .wko_mst_status_after.split(':');
                WorkOrderStatusAfter = WorkOrderStatusAfter_split[0].trim();
              }

              let Assetno = results.rows.item(i).wko_mst_assetno;
              let AssetDescription = results.rows.item(i).Assest_description;

              let WorkArea;
              if (results.rows.item(i).wko_mst_work_area === '') {
                WorkArea = '';
              } else {
                let WorkArea_split = results.rows .item(i) .wko_mst_work_area.split(':');
                WorkArea = WorkArea_split[0].trim();
              }

              let AssetLocation;
              if (results.rows.item(i).wko_mst_asset_location === '') {
                AssetLocation = '';
              } else {
                let AssetLocation_split = results.rows .item(i) .wko_mst_asset_location.split(':');
                AssetLocation = AssetLocation_split[0].trim();
              }
              let AssetLevel;
              if (results.rows.item(i).wko_mst_asset_level === '') {
                AssetLevel = '';
              } else {
                let AssetLevel_split = results.rows .item(i) .wko_mst_asset_level.split(':');
                AssetLevel = AssetLevel_split[0].trim();
              }

              let WorkOrder_no = results.rows.item(i).wko_mst_wo_no;

              let WorkOrder_Dsc = results.rows.item(i).wko_mst_descs;
              let original_date = results.rows.item(i).wko_mst_org_date;
              let Due_date = results.rows.item(i).wko_mst_due_date;

              let ischeck;
              var check = results.rows.item(i).Is_checked;
              if (check == '1') {
                ischeck = 'true';
              } else {
                ischeck = 'false';
              }

              var mst_RowID = results.rows.item(i).mst_RowID;

              let action_workorder = {
                site_cd: Site_cd,
                EmpID: EmpID,
                LOGINID: LoginID,
                RowID: mst_RowID,
                EmpName: EmpName,

                wko_mst_status: WorkOrderStatus,
                wko_mst_status_after: WorkOrderStatusAfter,

                wko_mst_originator: Requested_by,
                wko_mst_phone: Contact_no,

                wko_det_cause_code: CauseCode,
                wko_det_act_code: ActionCode,
                wko_det_work_class: WorkClass,
                wko_det_work_grp: WorkGroup,

                wko_det_corr_action: CorrectiveAction,
                wko_det_note1: MaintenanceRemark,
                Is_checked: ischeck,

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

                
              };

              //console.log( 'ACTION WORKORDE:' + JSON.stringify(action_workorder), );

              wko_det_comp.push(action_workorder);
              var wko_det_comp_List = {
                Header: wko_det_comp,
            };
            }
            update_workorder_complete(wko_det_comp_List)
            
          } else {
            db.transaction(txn => {
              //01 ast_mst
              txn.executeSql('DELETE FROM  ast_mst', [], (txn, results) => {
                console.log('ast_mst Results', results.rowsAffected);
                if (results.rowsAffected > 0) {
                  console.log('ast_mst deleted successfully');
                } else {
                  console.log('ast_mst unsuccessfully');
                }
              });
    
              //02 wko_mst
              txn.executeSql('DELETE FROM  wko_mst', [], (txn, results) => {
                console.log('wko_mst Results', results.rowsAffected);
                if (results.rowsAffected > 0) {
                  console.log('wko_mst deleted successfully');
                } else {
                  console.log('wko_mst unsuccessfully');
                }
              });
    
              //03 wko_det_completion
              txn.executeSql(
                'DELETE FROM  wko_det_completion',
                [],
                (txn, results) => {
                  console.log('wko_det_completion Results', results.rowsAffected);
                  if (results.rowsAffected > 0) {
                    console.log('wko_det_completion deleted successfully');
                  } else {
                    console.log('wko_det_completion unsuccessfully');
                  }
                },
              );
    
              //04 wko_det_ackowledgement
              txn.executeSql(
                'DELETE FROM  wko_det_ackowledgement',
                [],
                (txn, results) => {
                  console.log(
                    'wko_det_ackowledgement Results',
                    results.rowsAffected,
                  );
                  if (results.rowsAffected > 0) {
                    console.log('wko_det_ackowledgement deleted successfully');
                  } else {
                    console.log('wko_det_ackowledgement unsuccessfully');
                  }
                },
              );
    
              //05 wko_isp_heard
              txn.executeSql('DELETE FROM  wko_isp_heard', [], (txn, results) => {
                console.log('wko_isp_heard Results', results.rowsAffected);
                if (results.rowsAffected > 0) {
                  console.log('wko_isp_heard deleted successfully');
                } else {
                  console.log('wko_isp_heard unsuccessfully');
                }
              });
    
              //06 wko_isp_details
              txn.executeSql('DELETE FROM  wko_isp_details', [], (txn, results) => {
                console.log('wko_isp_details Results', results.rowsAffected);
                if (results.rowsAffected > 0) {
                  console.log('wko_isp_details deleted successfully');
                } else {
                  console.log('wko_isp_details unsuccessfully');
                }
              });
    
              //07 stp_zom
              txn.executeSql('DELETE FROM  stp_zom', [], (txn, results) => {
                console.log('stp_zom Results', results.rowsAffected);
                if (results.rowsAffected > 0) {
                  console.log('stp_zom deleted successfully');
                } else {
                  console.log('stp_zom unsuccessfully');
                }
              });
    
              //08 stp_zom
              txn.executeSql(
                'DELETE FROM  wko_ls8_timecard',
                [],
                (txn, results) => {
                  console.log('wko_ls8_timecard Results', results.rowsAffected);
                  if (results.rowsAffected > 0) {
                    console.log('wko_ls8_timecard deleted successfully');
                  } else {
                    console.log('wko_ls8_timecard unsuccessfully');
                  }
                },
              );
    
              //09 prm_ast
              txn.executeSql('DELETE FROM  prm_ast', [], (txn, results) => {
                console.log('prm_ast Results', results.rowsAffected);
                if (results.rowsAffected > 0) {
                  console.log('prm_ast deleted successfully');
                } else {
                  console.log('prm_ast unsuccessfully');
                }
              });
    
              //10 wko_det_response
              txn.executeSql(
                'DELETE FROM  wko_det_response',
                [],
                (txn, results) => {
                  console.log('wko_det_response Results', results.rowsAffected);
                  if (results.rowsAffected > 0) {
                    console.log('wko_det_response deleted successfully');
                  } else {
                    console.log('wko_det_response unsuccessfully');
                  }
                },
              );
    
              //11 wko_ref
              txn.executeSql('DELETE FROM  wko_ref', [], (txn, results) => {
                console.log('wko_ref Results', results.rowsAffected);
                if (results.rowsAffected > 0) {
                  console.log('wko_ref deleted successfully');
                } else {
                  console.log('wko_ref unsuccessfully');
                }
              });
    
              //11 Asset Down Time
              txn.executeSql('DELETE FROM  ast_dwntime', [], (txn, results) => {
                console.log('ast_dwntime Results', results.rowsAffected);
                if (results.rowsAffected > 0) {
                  console.log('ast_dwntime deleted successfully');
                } else {
                  console.log('ast_dwntime unsuccessfully');
                }
              });
    
              //ast_mst
              txn.executeSql('SELECT * FROM ast_mst', [], (txn, results) => {
                console.log('Asset Master List Count: ' + results.rows.length);
                setAssetCount(results.rows.length);
              });
    
              //wko_mst
              txn.executeSql('SELECT * FROM wko_mst', [], (txn, results) => {
                console.log('Work Order Master List Count: ' + results.rows.length);
                setWorkOrderCount(results.rows.length);
              });
    
              //wko_det_completion
              txn.executeSql(
                'SELECT * FROM wko_det_completion',
                [],
                (txn, results) => {
                  console.log(
                    'Work Order Completion List Count: ' + results.rows.length,
                  );
                  setWorkOrderCompletionCount(results.rows.length);
                },
              );
    
              //wko_det_ackowledgement
              txn.executeSql(
                'SELECT * FROM wko_det_ackowledgement',
                [],
                (txn, results) => {
                  console.log(
                    'Work Order Ackowledgement List Count: ' + results.rows.length,
                  );
                  setWorkOrderAcknowledgementCount(results.rows.length);
                },
              );
    
              //wko_isp_heard
              txn.executeSql('SELECT * FROM wko_isp_heard', [], (txn, results) => {
                console.log(
                  'Work Order Check List Heard Count: ' + results.rows.length,
                );
                setWorkOrderChecklistCount(results.rows.length);
              });
    
              //wko_det_response
              txn.executeSql(
                'SELECT * FROM wko_det_response',
                [],
                (txn, results) => {
                  console.log(
                    'Work Order Responces List Count: ' + results.rows.length,
                  );
                  setWorkOrderResponseCount(results.rows.length);
                },
              );
    
              //wko_ls8_timecard
              txn.executeSql(
                'SELECT * FROM wko_ls8_timecard',
                [],
                (txn, results) => {
                  console.log(
                    'Work Order TimeCard List Count: ' + results.rows.length,
                  );
                  setWorkOrderTimeCardCount(results.rows.length);
                },
              );
    
              //ast_dwntime
              txn.executeSql('SELECT * FROM ast_dwntime', [], (tx, results) => {
                console.log(
                  'Work Order Asset Down Time Count: ' + results.rows.length,
                );
                setAssetDownTimeCount(results.rows.length);
              });
    
    
              //Delete The Image Folder
              let PictureDir = Platform.OS === 'ios' ? fs.dirs.PictureDir : fs.dirs.DownloadDir + '/AC';
              RNFS.unlink(PictureDir);
    
              setIndicators_Visible(false);
              AsyncStorage.setItem('WIFI', 'ONLINE');
              setOnlineText('Online');
              setOnText('On');
              setwifiname('wifi');
              setwificolor('green');
    
              navigation.navigate('SyncingData');
    
            });
            
          }
        },
      );
    });
  };

  const update_workorder_complete = async (wko_det_comp_List)=>{

    var sync_url =  Baseurl + '/off_update_action_workorder.php?';
    var sync_date = moment().format('YYYY-MM-DD HH:mm:ss');
    var dvc_id = DeviceInfo.getDeviceId();
    

    try {
      const response = await axios.post( `${Baseurl}/off_update_action_workorder.php?site_cd=${Site_cd}&sync_step=Step 5 Upload action workorder&sync_time=${sync_date}&sync_status=offline&sync_url=${sync_url}&LOGINID=${LoginID}&dvc_id=${dvc_id}`,
        JSON.stringify(wko_det_comp_List),
        {headers: {'Content-Type': 'application/json'}},
      );
       //console.log('Edit Work Order:' + JSON.stringify(response.data.status));
      if (response.data.status === 'SUCCESS') {
        //console.log('Edit Work Order:' + JSON.stringify(response.data.message));
        db.transaction(txn => {
          //01 ast_mst
          txn.executeSql('DELETE FROM  ast_mst', [], (txn, results) => {
            console.log('ast_mst Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              console.log('ast_mst deleted successfully');
            } else {
              console.log('ast_mst unsuccessfully');
            }
          });

          //02 wko_mst
          txn.executeSql('DELETE FROM  wko_mst', [], (txn, results) => {
            console.log('wko_mst Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              console.log('wko_mst deleted successfully');
            } else {
              console.log('wko_mst unsuccessfully');
            }
          });

          //03 wko_det_completion
          txn.executeSql(
            'DELETE FROM  wko_det_completion',
            [],
            (txn, results) => {
              console.log('wko_det_completion Results', results.rowsAffected);
              if (results.rowsAffected > 0) {
                console.log('wko_det_completion deleted successfully');
              } else {
                console.log('wko_det_completion unsuccessfully');
              }
            },
          );

          //04 wko_det_ackowledgement
          txn.executeSql(
            'DELETE FROM  wko_det_ackowledgement',
            [],
            (txn, results) => {
              console.log(
                'wko_det_ackowledgement Results',
                results.rowsAffected,
              );
              if (results.rowsAffected > 0) {
                console.log('wko_det_ackowledgement deleted successfully');
              } else {
                console.log('wko_det_ackowledgement unsuccessfully');
              }
            },
          );

          //05 wko_isp_heard
          txn.executeSql('DELETE FROM  wko_isp_heard', [], (txn, results) => {
            console.log('wko_isp_heard Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              console.log('wko_isp_heard deleted successfully');
            } else {
              console.log('wko_isp_heard unsuccessfully');
            }
          });

          //06 wko_isp_details
          txn.executeSql('DELETE FROM  wko_isp_details', [], (txn, results) => {
            console.log('wko_isp_details Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              console.log('wko_isp_details deleted successfully');
            } else {
              console.log('wko_isp_details unsuccessfully');
            }
          });

          //07 stp_zom
          txn.executeSql('DELETE FROM  stp_zom', [], (txn, results) => {
            console.log('stp_zom Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              console.log('stp_zom deleted successfully');
            } else {
              console.log('stp_zom unsuccessfully');
            }
          });

          //08 stp_zom
          txn.executeSql(
            'DELETE FROM  wko_ls8_timecard',
            [],
            (txn, results) => {
              console.log('wko_ls8_timecard Results', results.rowsAffected);
              if (results.rowsAffected > 0) {
                console.log('wko_ls8_timecard deleted successfully');
              } else {
                console.log('wko_ls8_timecard unsuccessfully');
              }
            },
          );

          //09 prm_ast
          txn.executeSql('DELETE FROM  prm_ast', [], (txn, results) => {
            console.log('prm_ast Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              console.log('prm_ast deleted successfully');
            } else {
              console.log('prm_ast unsuccessfully');
            }
          });

          //10 wko_det_response
          txn.executeSql(
            'DELETE FROM  wko_det_response',
            [],
            (txn, results) => {
              console.log('wko_det_response Results', results.rowsAffected);
              if (results.rowsAffected > 0) {
                console.log('wko_det_response deleted successfully');
              } else {
                console.log('wko_det_response unsuccessfully');
              }
            },
          );

          //11 wko_ref
          txn.executeSql('DELETE FROM  wko_ref', [], (txn, results) => {
            console.log('wko_ref Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              console.log('wko_ref deleted successfully');
            } else {
              console.log('wko_ref unsuccessfully');
            }
          });

          //11 Asset Down Time
          txn.executeSql('DELETE FROM  ast_dwntime', [], (txn, results) => {
            console.log('ast_dwntime Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              console.log('ast_dwntime deleted successfully');
            } else {
              console.log('ast_dwntime unsuccessfully');
            }
          });

          //ast_mst
          txn.executeSql('SELECT * FROM ast_mst', [], (txn, results) => {
            console.log('Asset Master List Count: ' + results.rows.length);
            setAssetCount(results.rows.length);
          });

          //wko_mst
          txn.executeSql('SELECT * FROM wko_mst', [], (txn, results) => {
            console.log('Work Order Master List Count: ' + results.rows.length);
            setWorkOrderCount(results.rows.length);
          });

          //wko_det_completion
          txn.executeSql(
            'SELECT * FROM wko_det_completion',
            [],
            (txn, results) => {
              console.log(
                'Work Order Completion List Count: ' + results.rows.length,
              );
              setWorkOrderCompletionCount(results.rows.length);
            },
          );

          //wko_det_ackowledgement
          txn.executeSql(
            'SELECT * FROM wko_det_ackowledgement',
            [],
            (txn, results) => {
              console.log(
                'Work Order Ackowledgement List Count: ' + results.rows.length,
              );
              setWorkOrderAcknowledgementCount(results.rows.length);
            },
          );

          //wko_isp_heard
          txn.executeSql('SELECT * FROM wko_isp_heard', [], (txn, results) => {
            console.log(
              'Work Order Check List Heard Count: ' + results.rows.length,
            );
            setWorkOrderChecklistCount(results.rows.length);
          });

          //wko_det_response
          txn.executeSql(
            'SELECT * FROM wko_det_response',
            [],
            (txn, results) => {
              console.log(
                'Work Order Responces List Count: ' + results.rows.length,
              );
              setWorkOrderResponseCount(results.rows.length);
            },
          );

          //wko_ls8_timecard
          txn.executeSql(
            'SELECT * FROM wko_ls8_timecard',
            [],
            (txn, results) => {
              console.log(
                'Work Order TimeCard List Count: ' + results.rows.length,
              );
              setWorkOrderTimeCardCount(results.rows.length);
            },
          );

          //ast_dwntime
          txn.executeSql('SELECT * FROM ast_dwntime', [], (tx, results) => {
            console.log(
              'Work Order Asset Down Time Count: ' + results.rows.length,
            );
            setAssetDownTimeCount(results.rows.length);
          });


          //Delete The Image Folder
          let PictureDir = Platform.OS === 'ios' ? fs.dirs.PictureDir : fs.dirs.DownloadDir + '/AC';
          RNFS.unlink(PictureDir);

          setIndicators_Visible(false);
          AsyncStorage.setItem('WIFI', 'ONLINE');
          setOnlineText('Online');
          setOnText('On');
          setwifiname('wifi');
          setwificolor('green');

          navigation.navigate('SyncingData');

        });
       
        
      } else {
        setIndicators_Visible(false);
        Alert.alert(response.data.status, response.data.message, [ {text: 'OK'}]);
      }
    } catch (error) {
      setIndicators_Visible(false);
      alert('Step 5 Upload Work order Completions', error);
    }

  }

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
    }
  };

  const Alret_onClick = D => {
    setShow_two(false);

    if (D === 'BACK') {
      _goBack();
    } else if (D === 'ONLINE') {
      _goBack();
    } else if (D === 'OFFLINE') {
      setAsset_modalVisible(!Asset_modalVisible);
    }
  };

  return (
    <SafeAreaProvider>
      <Appbar.Header style={{backgroundColor: '#42A5F5'}}>
        <Appbar.BackAction onPress={_goBack} color={'#FFF'} size={30} />

        <Appbar.Content title="Syncing Data" color={'#FFF'} />
      </Appbar.Header>

      <ProgressLoader
        visible={spinner}
        isModal={true}
        isHUD={true}
        hudColor={'#808080'}
        color={'#ffff'}
      />

      {/* <SCLAlert 
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

        </SCLAlert> */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={Indicators_Visible}
        onRequestClose={() => {
         //Alert.alert('Closed');
          setIndicators_Visible(!Indicators_Visible);
        }}>
        <View style={styles.model_cardview}>
          <View style={{ backgroundColor: '#FFFFFF', margin: 20, height: 200, borderRadius: 20, }}>
            <Text style={{ fontSize: 20, marginTop: 20, color: '#0096FF', fontWeight: 'bold', textAlign: 'center', }}> Step: {Indicators_step}</Text>
            <Text style={{ fontSize: 16, marginTop: 30, color: '#0096FF', fontWeight: 'bold', textAlign: 'center', }}>{Indicators_text}</Text>
            <View style={{justifyContent: 'center', marginTop: 50}}>
              <PacmanIndicator color="#2ECC71" size={70} />
            </View>
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

        <Modal
          animationType="slide"
          transparent={true}
          visible={Indicators_Visible}
          onRequestClose={() => {
           //Alert.alert('Closed');
            setIndicators_Visible(!Indicators_Visible);
          }}>
          <View style={styles.model_cardview}>
            <View style={{ backgroundColor: '#FFFFFF', margin: 20, height: 200, borderRadius: 20, }}>
              <Text style={{ fontSize: 20, marginTop: 20, color: '#0096FF', fontWeight: 'bold', textAlign: 'center', }}>Step: {Indicators_step}</Text>
              <Text style={{ fontSize: 16, marginTop: 30, color: '#0096FF', fontWeight: 'bold', textAlign: 'center', }}>{Indicators_text} </Text>
              <View style={{justifyContent: 'center', marginTop: 50}}>
                <PacmanIndicator color="#2ECC71" size={70} />
              </View>
            </View>
          </View>
        </Modal>

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
          onRequestClose={() => {
           //Alert.alert('Closed');
            setDropDown_modalVisible(!DropDown_modalVisible);
          }}>
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

                  {/* Asset Description */}
                  <View style={styles.view_style}>
                    <TextInput
                      value={ast_mst_data.ast_mst_asset_desc}
                      style={styles.input}
                      multiline
                      inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}, ]}
                      labelStyle={styles.labelStyle}
                      placeholderStyle={styles.placeholderStyle}
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

      <TouchableOpacity onPress={() => get_offline()}>
        <View style={styles.card_view}>
          <Feather
            name={wifi_data.wifiname}
            color={wifi_data.wificolor}
            size={25}
            style={{marginEnd: 15}}
            onPress={() => setmodalVisible(false)}
          />

          <Text style={styles.textCenter}>{wifi_data.OnlineText}</Text>

          <Text style={styles.textCenter2}>{wifi_data.OnText}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.card_01}>
        <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#0096FF', borderTopRightRadius: 10, borderTopLeftRadius: 10, }}>
          <Text style={{ fontSize: 15, justifyContent: 'center', color: '#ffffffff', margin: 5, }}> Master Table Log File </Text>
        </View>

        <View style={styles.card_view2}>
          <Image style={styles.image} source={require('../../images/iconassest.png')} />
          <Text style={styles.textCenter}>Asset</Text>
          <Text style={styles.textCenter2}>{AssetCount}</Text>
        </View>

        <View style={styles.card_view2}>
          <Image style={styles.image} source={require('../../images/newwok.png')} />
          <Text style={styles.textCenter}>Work Order</Text>
          <Text style={styles.textCenter2}>{WorkOrderCount}</Text>
        </View>

        <View style={styles.card_view2}>
          <Image style={styles.image} source={require('../../images/approv.png')} />
          <Text style={styles.textCenter}>Work Order Completion</Text>
          <Text style={styles.textCenter2}>{WorkOrderCompletionCount}</Text>
        </View>

        <View style={styles.card_view2}>
          <Image style={styles.image} source={require('../../images/warehouse.png')} />
          <Text style={styles.textCenter}>Work Order Acknowledgement</Text>
          <Text style={styles.textCenter2}> {WorkOrderAcknowledgementCount} </Text>
        </View>

        <View style={styles.card_view2}>
          <Image style={styles.image} source={require('../../images/workrequest1.png')} />
          <Text style={styles.textCenter}>Work Order Response</Text>
          <Text style={styles.textCenter2}>{WorkOrderResponseCount}</Text>
        </View>

        <View style={styles.card_view2}>
          <Image style={styles.image} source={require('../../images/report.png')} />
          <Text style={styles.textCenter}>Work Order Check List</Text>
          <Text style={styles.textCenter2}>{WorkOrderChecklistCount}</Text>
        </View>

        <View style={styles.card_view2}>
          <Image style={styles.image} source={require('../../images/dashboard.png')} />
          <Text style={styles.textCenter}>Work Order Timecard</Text>
          <Text style={styles.textCenter2}>{WorkOrderTimeCardCount}</Text>
        </View>

        <View style={styles.card_view2}>
          <Image style={styles.image} source={require('../../images/time.png')} />
          <Text style={styles.textCenter}>Asset Down Time</Text>
          <Text style={styles.textCenter2}>{AssetDownTimeCount}</Text>
        </View>
      </View>
    </SafeAreaProvider>
  );
};

export default SyncingData;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0e0eb',
  },
  card_view: {
    height: 60,
    borderRadius: 10,
    padding: 10,
    margin: 10,
    backgroundColor: '#ffffffff',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center', //Centered vertically
  },
  card_view2: {
    height: 60,
    padding: 10,
    backgroundColor: '#ffffffff',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center', //Centered vertically
  },

  card_view3: {
    flex: 1,
    marginVertical: 50,
    paddingHorizontal: 20,
  },
  image: {
    width: 35,
    height: 35,
  },

  textCenter: {
    fontSize: 15,
    marginTop: 10,
    color: 'black',
  },

  textCenter2: {
    fontSize: 15,
    marginTop: 10,
    marginRight: 10,
    color: 'black',
  },

  card_01: {
    backgroundColor: '#FFFFFF',
    margin: 10,
    borderRadius: 10,
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

  image: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
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

  dropdown_style: {
    margin: 10,
  },
  item: {
    margin: 10,
    borderRadius: 10,
  },
});
