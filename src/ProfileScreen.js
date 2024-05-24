import React from 'react';
import { View, StyleSheet, Alert, Text, ScrollView, SafeAreaView, Image, TouchableOpacity, Modal, FlatList,Pressable} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ProgressLoader from 'rn-progress-loader';
import {useTheme} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {openDatabase} from 'react-native-sqlite-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DeviceInfo from 'react-native-device-info';
import {useFirstInstallTime} from 'react-native-device-info';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TextInput} from 'react-native-element-textinput';
import axios from 'axios';
import Feather from 'react-native-vector-icons/Feather';
import UserAvatar from '@muhzi/react-native-user-avatar';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import {SCLAlert, SCLAlertButton} from 'react-native-scl-alert';
import Svg, { Path } from 'react-native-svg';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import {requestUserPermission,notificationListeners} from './Utils/notificationServices';
import { checkVersion } from "react-native-check-version";
var db = openDatabase({name: 'CMMS.db'});

let Baseurl, Site_Cd, Site_dsc, WIFI, LoginID,EmpID,TOKEN,WR_Approver,MR_Approver,PR_Approver;
const ProfileScreen = ({navigation}) => {
  const {colors} = useTheme();

  let Valid = false;
  const [spinner, setspinner] = React.useState(false);

  //Alert
  const [Show, setShow] = React.useState(false);
  const [Show_two, setShow_two] = React.useState(false);
  const [Theme, setTheme] = React.useState('');
  const [Title, setTitle] = React.useState('');
  const [Type, setType] = React.useState('');
  const [value, setvalue] = React.useState([]);

  const [selectedIndex, setselectedIndex] = React.useState(0);
  const [IndexColor, setIndexColor] = React.useState('#28B463');

  let [welcome, setwelcome] = React.useState('');
  let [LoginID, setLoginID] = React.useState('');
  let [Version, setVersion] = React.useState('');
  let [DeviceID, setDeviceID] = React.useState('');
  let [UpdateTime, setUpdateTime] = React.useState('');
  let [site_name, setsite_name] = React.useState('');
  let [token, settoken] = React.useState('');

  const {loading, result} = useFirstInstallTime();

  let [sitecd, setsitecd] = React.useState('');
  let [sitedsc, setsite_dsc] = React.useState('');
  let [url, seturl] = React.useState('');

  const [NewPassword, setNewPassword] = React.useState('');
  const [Confirm_Password, setConfirm_Password] = React.useState('');
  const [Editable, setEditable] = React.useState(false);

  const [Indicators_Visible, setIndicators_Visible] = React.useState(false);

  const [EMP_modalVisible, setEMP_modalVisible] = React.useState(false);
  const [deviceVisible, setdeviceVisible] = React.useState(false);
  const [EMPG_data, setEMPG_data] = React.useState([]);

  React.useEffect(() => {
    const focusHander = navigation.addListener('focus', () => {
      fetchData();
    });
    return focusHander;
  }, [navigation]);

  const fetchData = async () => {

    Baseurl = await AsyncStorage.getItem('BaseURL');
    Site_Cd = await AsyncStorage.getItem('Site_Cd');
    Site_dsc = await AsyncStorage.getItem('Site_dsc');
    WIFI = await AsyncStorage.getItem('WIFI');
    LoginID = await AsyncStorage.getItem('emp_mst_login_id');
    EmpID = await AsyncStorage.getItem('emp_mst_empl_id');
    TOKEN = await AsyncStorage.getItem('fcmToken');

    WR_Approver = await AsyncStorage.getItem('emp_det_wr_approver'); 
    MR_Approver = await AsyncStorage.getItem('emp_det_mr_limit'); 
    PR_Approver = await AsyncStorage.getItem('emp_det_pr_approval_limit'); 

    settoken(TOKEN);
    setsitecd(Site_Cd);
    setsite_dsc(Site_dsc);
    seturl(Baseurl);
    
    setVersion(DeviceInfo.getVersion());
    setDeviceID(DeviceInfo.getDeviceId());

    
    
    DeviceInfo.getLastUpdateTime().then((lastUpdateTIme)=>{

      console.log('Device ID : ',lastUpdateTIme);

      const date = new Date(lastUpdateTIme);
      var datetwo = moment(date).format('YYYY-MM-DD hh:mm');
      setUpdateTime('2023-11-27 10:00 AM');
      console.log('Device ID : ',datetwo);


    });

    db.transaction(function (txn) {
      txn.executeSql('SELECT * FROM emp_det', [], (tx, results) => {
        var len = results.rows.length;
        console.log('len', len);
        if (len > 0) {
          let res = results.rows.item(0);
          console.log(res);
          setLoginID(res.emp_mst_login_id);
          setwelcome(res.emp_mst_name);
          console.log(welcome);
          setspinner(false);
        } else {
          alert('No user found');
        }
      });

      txn.executeSql('SELECT * FROM dft_mst', [], (tx, results) => {
        var len = results.rows.length;
        console.log('len', len);
        if (len > 0) {
          let res = results.rows.item(0);
          // console.log(res.emp_mst_name)
          setsite_name(res.site_name);
          console.log(site_name);
          setspinner(false);
        } else {
          alert('No user found');
        }
      });
    });


    checkForUpdates()

   
   
  };


  const checkForUpdates = (async() => {

    try{

        const version = await checkVersion();
        console.log("Got version info:", version);
        if (version.needsUpdate) {
            console.log(`App has a ${version.updateType} update pending.`);

            if(Platform.OS === 'android'){

                Alert.alert(
                    'Update CMMS?',
                    'CMMS recommends that you update to the latest version..',
                    [
                        {
                            text: 'No Thanks',
                            onPress:()=>console.log('Cancel Pressed'),
                            style:'cancle'
                        },
                        {
                            text: 'UPDATE',
                            onPress:()=>Linking.openURL("https://play.google.com/store/apps/details?id=com.evantage.cmmshybrid&hl=us"),
                            //onPress:()=>console.log('Update'), 
                            style:'cancle'
                        }
                    ]
                )

            }else{

                Alert.alert(
                    'Update CMMS?',
                    'CMMS recommends that you update to the latest version..',
                    [
                        {
                            text: 'No Thanks',
                            onPress:()=>console.log('Cancel Pressed'),
                            style:'cancle'
                        },
                        {
                            text: 'UPDATE',
                            onPress:()=>Linking.openURL("https://apps.apple.com/us/app/evantage-cmms/id6448298088?uo=4"),
                            //onPress:()=>console.log('Update'), 
                            style:'cancle'
                        }
                    ]
                )
                
            }
                
        }else{

          if (WIFI == 'OFFLINE') {

          }else{
            get_emp_status();
          }

        }

        

    }catch(error){
        console.log({error})
    }
});

  //get More option API
  const get_emp_status = async () => {

    setspinner(true);
    console.log( 'get_emp_status : ',`${Baseurl}/get_emp_status.php?site_cd=${Site_Cd}&emp_mst_empl_id=${EmpID}`);
    fetch(`${Baseurl}/get_emp_status.php?site_cd=${Site_Cd}&emp_mst_empl_id=${EmpID}`)
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

          for (let i = 0; i < data.data.length; ++i) {
          
            if (data.data[i].emp_mst_att_sts === 'ONS') {
              setselectedIndex(0);
              setIndexColor('#28B463');
            } else if (data.data[i].emp_mst_att_sts === 'ONC') {
              setselectedIndex(1);
              setIndexColor('#F1C40F');
            } else if (data.data[i].emp_mst_att_sts === 'OFS') {
              setselectedIndex(2);
              setIndexColor('#E74C3C');
            } else if (data.data[i].emp_mst_att_sts === 'ONL') {
              setselectedIndex(3);
              setIndexColor('#95A5A6');
            }
          }

          setspinner(false);

        }else{
          setspinner(false);
          setAlert(true,'danger',data.message,'');
          return;
        }
    })
    .catch(error => {
        setspinner(false);
        setAlert(true,'danger',error.message,'');
        console.error('Error :', error.message);
    });

  };

  const setShow_Updatepassword = (show, theme, title) => {

    if (WIFI == 'OFFLINE') {
      setAlert(true,'danger','Offline mode can not update....','');
    }else{
      setIndicators_Visible(true);
    }
    
  };

  const setAlert = (show, theme, title,type) => {
    setShow(show);
    setTheme(theme);
    setTitle(title);
    setType(type);
  };

  const setAlert_two = (show, theme, title, type) => {
    setShow_two(show);
    setTheme(theme);
    setTitle(title);
    setType(type);
  };

  const get_validation = () => {
    if (!NewPassword) {
      setAlert(true, 'warning', 'Please Enter New Password','');
      Valid = false;
      return;
    } else {
      if (!Confirm_Password) {
        setAlert(true, 'warning', 'Please Enter Confirm New Password','');
        Valid = false;
        return;
      } else {
        if (NewPassword === Confirm_Password) {
          Valid = true;
          setIndicators_Visible(false);

          if (Valid) {
            get_update_password();
          }
        } else {
          setAlert( true, 'warning', 'Password and Confirm Password not match.!','');
          Valid = false;
          return;
        }
      }
    }
  };

  const get_update_password = async () => {

    setspinner(true);

    console.log( 'JSON DATA : ' + `${Baseurl}/update_password.php?login_id=${LoginID}&new_passwod=${NewPassword}`);
    fetch(`${Baseurl}/update_password.php?login_id=${LoginID}&new_passwod=${NewPassword}`)
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

          setspinner(false);
          setAlert(true, 'success', response.data.message,'');

        }else{
          setspinner(false);
          setAlert(true,'danger',data.message,'');
          return;
        }
    })
    .catch(error => {
        setspinner(false);
        setAlert(true,'danger',error.message,'');
        console.error('Error :', error.message);
    });

    
  };

  const logout = () => {
    if (WIFI == 'OFFLINE') {
      setAlert_two(
        true,
        'info',
        'Please switch to online mode before you want to logout...',
        'Offline',
      );
    } else {
      setAlert_two(true, 'info', 'Do you confirm to logout?', 'Online');
    }
  };

  const Alret_onClick = D => {
    if (D === 'Online') {
      setShow_two(false);
      delete_data();
    } else  if (D === 'Logout') {

      delete_data_nonetwork();

    }else {
      setShow_two(false);
      navigation.navigate('SyncingData');
    }
  };

  const Alret = D => {

    if (D === 'Logout') {
      
      setShow(false);
      delete_data_nonetwork();

    }else {


      console.log('Error :', D);
      setShow(false);
      
    }
  };




 
  const delete_data = async () => {

    let dvc_id = DeviceInfo.getDeviceId();
    console.log( 'PIECHART TWO' + `${Baseurl}/get_delete_mobile_info.php?tkn_dvc_id=${dvc_id}`);
    fetch(`${Baseurl}/get_delete_mobile_info.php?tkn_dvc_id=${dvc_id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {

      if (data.status === 'SUCCESS') {

        delete_data_nonetwork();


      }else{

        setspinner(false);
        setAlert_two(true, 'danger', data.message, 'Logout');
        console.error('Error :', data.message);
        return;
          
      }

    })
    .catch(error => {
      setspinner(false);
      setAlert(true, 'danger', error.message +' forcefully logout the app', 'Logout');
      console.log('Error :', error.message);
    });



    
    
  };

  const delete_data_nonetwork = async () => {

    await AsyncStorage.removeItem('Site_Cd');
    await AsyncStorage.removeItem('emp_mst_empl_id');
    await AsyncStorage.removeItem('emp_mst_name');
    await AsyncStorage.removeItem('emp_mst_title');
    await AsyncStorage.removeItem('emp_mst_homephone');
    await AsyncStorage.removeItem('emp_mst_login_id');
    await AsyncStorage.removeItem('emp_det_wr_approver');
    await AsyncStorage.removeItem('emp_det_mr_approver');
    await AsyncStorage.removeItem('emp_det_mr_limit');
    await AsyncStorage.removeItem('emp_det_pr_approver');
    await AsyncStorage.removeItem('emp_det_pr_approval_limit');
    await AsyncStorage.removeItem('emp_det_work_grp');
    await AsyncStorage.removeItem('emp_det_craft');
    await AsyncStorage.removeItem('emp_ls1_charge_rate');
    await AsyncStorage.removeItem('require_offline');

    await AsyncStorage.removeItem('dft_mst_wko_sts');
    await AsyncStorage.removeItem('dft_mst_lab_act');
    await AsyncStorage.removeItem('dft_mst_mat_act');
    await AsyncStorage.removeItem('dft_mst_con_act');
    await AsyncStorage.removeItem('dft_mst_wko_pri');
    await AsyncStorage.removeItem('dft_mst_temp_ast');
    await AsyncStorage.removeItem('dft_mst_wko_asset_no');
    await AsyncStorage.removeItem('dft_mst_wkr_asset_no');
    await AsyncStorage.removeItem('dft_mst_wo_default_cc');
    await AsyncStorage.removeItem('dft_mst_time_card_by');
    await AsyncStorage.removeItem('dft_mst_itm_resv');
    await AsyncStorage.removeItem('dft_mst_mr_approval');
    await AsyncStorage.removeItem('dft_mst_pur_email_approver');
    await AsyncStorage.removeItem('dft_mst_mtr_email_approver');
    await AsyncStorage.removeItem('dft_mst_tim_act');
    await AsyncStorage.removeItem('dft_mst_gen_inv');
    await AsyncStorage.removeItem('dft_mst_mbl_chk_cmp');
    await AsyncStorage.removeItem('dft_mst_mbl_chk_scan');
    await AsyncStorage.removeItem('site_name');
    await AsyncStorage.removeItem('WIFI');

    db.transaction(tx => {
      //01 emp_det
      tx.executeSql('DELETE FROM  emp_det', [], (tx, results) => {
        console.log('01-emp_det Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('01-emp_det deleted successfully');
        } else {
          console.log('emp_det unsuccessfully');
        }
      });

      //02 dft_mst
      tx.executeSql('DELETE FROM  dft_mst', [], (tx, results) => {
        console.log('02-dft_mst Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('02-dft_mst deleted successfully');
        } else {
          console.log('dft_mst unsuccessfully');
        }
      });

      //03 costcenter
      tx.executeSql('DELETE FROM  costcenter', [], (tx, results) => {
        console.log('03-costcenter Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('03-costcenter deleted successfully');
        } else {
          console.log('costcenter unsuccessfully');
        }
      });

      //04 account
      tx.executeSql('DELETE FROM  account', [], (tx, results) => {
        console.log('04-account Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('04-account deleted successfully');
        } else {
          console.log('account unsuccessfully');
        }
      });

      //05 faultcode
      tx.executeSql('DELETE FROM  faultcode', [], (tx, results) => {
        console.log('05-faultcode Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('05-faultcode deleted successfully');
        } else {
          console.log('faultcode unsuccessfully');
        }
      });

      //06 priority
      tx.executeSql('DELETE FROM  priority', [], (tx, results) => {
        console.log('06-priority Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('06-priority deleted successfully');
        } else {
          console.log('priority unsuccessfully');
        }
      });

      //07 actioncode
      tx.executeSql('DELETE FROM  actioncode', [], (tx, results) => {
        console.log('07-actioncode Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('07-actioncode deleted successfully');
        } else {
          console.log('actioncode unsuccessfully');
        }
      });

      //08 workarea
      tx.executeSql('DELETE FROM  workarea', [], (tx, results) => {
        console.log('08-workarea Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('08-workarea deleted successfully');
        } else {
          console.log('workarea unsuccessfully');
        }
      });

      //09 casusecode
      tx.executeSql('DELETE FROM  casusecode', [], (tx, results) => {
        console.log('09-casusecode Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('09-casusecode deleted successfully');
        } else {
          console.log('casusecode unsuccessfully');
        }
      });

      //10 workclass
      tx.executeSql('DELETE FROM  workclass', [], (tx, results) => {
        console.log('10-workclass Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('10-workclass deleted successfully');
        } else {
          console.log('workclass unsuccessfully');
        }
      });

      //11 wrk_group
      tx.executeSql('DELETE FROM  wrk_group', [], (tx, results) => {
        console.log('11-wrk_group Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('11-wrk_group deleted successfully');
        } else {
          console.log('wrk_group unsuccessfully');
        }
      });

      //12 workorderstatus
      tx.executeSql('DELETE FROM  workorderstatus', [], (tx, results) => {
        console.log('12-workorderstatus Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('12-workorderstatus deleted successfully');
        } else {
          console.log('workorderstatus unsuccessfully');
        }
      });

      //13 worktype
      tx.executeSql('DELETE FROM  worktype', [], (tx, results) => {
        console.log('13-worktype Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('13-worktype deleted successfully');
        } else {
          console.log('worktype unsuccessfully');
        }
      });

      //14 assetcode
      tx.executeSql('DELETE FROM  assetcode', [], (tx, results) => {
        console.log('14-assetcode Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('14-assetcode deleted successfully');
        } else {
          console.log('assetcode unsuccessfully');
        }
      });

      //15 criticalfactor
      tx.executeSql('DELETE FROM  criticalfactor', [], (tx, results) => {
        console.log('15-criticalfactor Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('15-criticalfactor deleted successfully');
        } else {
          console.log('criticalfactor unsuccessfully');
        }
      });

      //16 assetgroupcode
      tx.executeSql('DELETE FROM  assetgroupcode', [], (tx, results) => {
        console.log('16-assetgroupcode Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('16-assetgroupcode deleted successfully');
        } else {
          console.log('assetgroupcode unsuccessfully');
        }
      });

      //17 assetlevel
      tx.executeSql('DELETE FROM  assetlevel', [], (tx, results) => {
        console.log('17-assetlevel Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('17-assetlevel deleted successfully');
        } else {
          console.log('assetlevel unsuccessfully');
        }
      });

      //18 assetlocation
      tx.executeSql('DELETE FROM  assetlocation', [], (tx, results) => {
        console.log('18-assetlocation Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('18-assetlocation deleted successfully');
        } else {
          console.log('assetlocation unsuccessfully');
        }
      });

      //19 assetstatus
      tx.executeSql('DELETE FROM  assetstatus', [], (tx, results) => {
        console.log('19-assetstatus Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('19-assetstatus deleted successfully');
        } else {
          console.log('assetstatus unsuccessfully');
        }
      });

      //20 assettype
      tx.executeSql('DELETE FROM  assettype', [], (tx, results) => {
        console.log('20-assettype Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('20-assettype deleted successfully');
        } else {
          console.log('assettype unsuccessfully');
        }
      });

      //21 employee
      tx.executeSql('DELETE FROM  employee', [], (tx, results) => {
        console.log('employee Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('employee deleted successfully');
        } else {
          console.log('employee unsuccessfully');
        }
      });

      //22 auto_numnering
      tx.executeSql('DELETE FROM  auto_numnering', [], (tx, results) => {
        console.log('auto_numnering Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('auto_numnering deleted successfully');
        } else {
          console.log('auto_numnering unsuccessfully');
        }
      });

      //23 wko_auto_numbering
      tx.executeSql('DELETE FROM  wko_auto_numbering', [], (tx, results) => {
        console.log('wko_auto_numbering Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('wko_auto_numbering deleted successfully');
        } else {
          console.log('wko_auto_numbering unsuccessfully');
        }
      });

      //24 ratingquestion
      tx.executeSql('DELETE FROM  ratingquestion', [], (tx, results) => {
        console.log('ratingquestion Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('ratingquestion deleted successfully');
        } else {
          console.log('ratingquestion  unsuccessfully');
        }
      });

      //25 mrstockno
      tx.executeSql('DELETE FROM  mrstockno', [], (tx, results) => {
        console.log('mrstockno Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('mrstockno deleted successfully');
        } else {
          console.log('mrstockno unsuccessfully');
        }
      });

      //26 hourstype
      tx.executeSql('DELETE FROM  hourstype', [], (tx, results) => {
        console.log('hourstype Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('hourstype deleted successfully');
        } else {
          console.log('hourstype unsuccessfully');
        }
      });

      //27 TimeCraft
      tx.executeSql('DELETE FROM  TimeCraft', [], (tx, results) => {
        console.log('TimeCraft Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('TimeCraft deleted successfully');
        } else {
          console.log('TimeCraft unsuccessfully');
        }
      });

      //28 supplier
      tx.executeSql('DELETE FROM  supplier', [], (tx, results) => {
        console.log('supplier Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('supplier deleted successfully');
        } else {
          console.log('supplier unsuccessfully');
        }
      });

      //29 uom
      tx.executeSql('DELETE FROM  uom', [], (tx, results) => {
        console.log('uom Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('uom deleted successfully');
        } else {
          console.log('uom unsuccessfully');
        }
      });

      //30 tax_cd
      tx.executeSql('DELETE FROM  tax_cd', [], (tx, results) => {
        console.log('tax_cd Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('tax_cd deleted successfully');
        } else {
          console.log('tax_cd unsuccessfully');
        }
      });

      //31 approve_workorderstatus
      tx.executeSql(
        'DELETE FROM  approve_workorderstatus',
        [],
        (tx, results) => {
          console.log( 'approve_workorderstatus Results', results.rowsAffected, );
          if (results.rowsAffected > 0) {
            console.log('approve_workorderstatus deleted successfully');
          } else {
            console.log('approve_workorderstatus unsuccessfully');
          }
        },
      );

      //32 wkr_auto_numbering
      tx.executeSql('DELETE FROM  wkr_auto_numbering', [], (tx, results) => {
        console.log('wkr_auto_numbering Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('wkr_auto_numbering deleted successfully');
        } else {
          console.log('wkr_auto_numbering unsuccessfully');
        }
      });

      //33 ast_mst
      tx.executeSql('DELETE FROM  ast_mst', [], (tx, results) => {
        console.log('ast_mst Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('ast_mst deleted successfully');
        } else {
          console.log('ast_mst unsuccessfully');
        }
      });

      //34 wko_mst
      tx.executeSql('DELETE FROM  wko_mst', [], (tx, results) => {
        console.log('wko_mst Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('wko_mst deleted successfully');
        } else {
          console.log('wko_mst unsuccessfully');
        }
      });

      //35 wko_ref
      tx.executeSql('DELETE FROM  wko_ref', [], (tx, results) => {
        console.log('wko_ref Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('wko_ref deleted successfully');
        } else {
          console.log('wko_ref unsuccessfully');
        }
      });

      //36 wko_det_completion
      tx.executeSql('DELETE FROM  wko_det_completion', [], (tx, results) => {
        console.log('wko_det_completion Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('wko_det_completion deleted successfully');
        } else {
          console.log('wko_det_completion unsuccessfully');
        }
      });

      //37 wko_det_ackowledgement
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

      //38 wko_isp_heard
      tx.executeSql('DELETE FROM  wko_isp_heard', [], (tx, results) => {
        console.log('wko_isp_heard Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('wko_isp_heard deleted successfully');
        } else {
          console.log('wko_isp_heard unsuccessfully');
        }
      });

      //39 wko_isp_details
      tx.executeSql('DELETE FROM  wko_isp_details', [], (tx, results) => {
        console.log('wko_isp_details Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('wko_isp_details deleted successfully');
        } else {
          console.log('wko_isp_details unsuccessfully');
        }
      });

      //40 stp_zom
      tx.executeSql('DELETE FROM  stp_zom', [], (tx, results) => {
        console.log('stp_zom Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('stp_zom deleted successfully');
        } else {
          console.log('stp_zom unsuccessfully');
        }
      });

      //41 wko_ls2
      tx.executeSql('DELETE FROM  wko_ls2', [], (tx, results) => {
        console.log('wko_ls2 Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('wko_ls2 deleted successfully');
        } else {
          console.log('wko_ls2 unsuccessfully');
        }
      });

      //42 wko_ls8_timecard
      tx.executeSql('DELETE FROM  wko_ls8_timecard', [], (tx, results) => {
        console.log('wko_ls8_timecard Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('wko_ls8_timecard deleted successfully');
        } else {
          console.log('wko_ls8_timecard unsuccessfully');
        }
      });

      //43 prm_ast
      tx.executeSql('DELETE FROM  prm_ast', [], (tx, results) => {
        console.log('prm_ast Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('prm_ast deleted successfully');
        } else {
          console.log('prm_ast unsuccessfully');
        }
      });

      //44 wko_det_response
      tx.executeSql('DELETE FROM  wko_det_response', [], (tx, results) => {
        console.log('wko_det_response Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('wko_det_response deleted successfully');
        } else {
          console.log('wko_det_response unsuccessfully');
        }
      });

      //45 cf_menu
      tx.executeSql('DELETE FROM  cf_menu', [], (tx, results) => {
        console.log('cf_menu Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('cf_menu deleted successfully');
        } else {
          console.log('cf_menu unsuccessfully');
        }
      });

      //46 assign_employee
      tx.executeSql('DELETE FROM  assign_employee', [], (tx, results) => {
        console.log('assign_employee Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('assign_employee deleted successfully');
        } else {
          console.log('assign_employee unsuccessfully');
        }
      });


      //47 Asset Down Time
      tx.executeSql('DELETE FROM  ast_dwntime', [], (tx, results) => {
        console.log('ast_dwntime Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('ast_dwntime deleted successfully');
        } else {
          console.log('ast_dwntime unsuccessfully');
        }
      });


      //50 Asset Down Time
      tx.executeSql('DELETE FROM  report_current_week', [], (tx, results) => {
        console.log('report_current_week Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          console.log('report_current_week deleted successfully');
        } else {
          console.log('report_current_week unsuccessfully');
        }
      });
    });

    // //48 Asset_in_service
    // tx.executeSql('DELETE FROM  Asset_in_service', [], (tx, results) => {
    //   console.log('Asset_in_service Results', results.rowsAffected);
    //   if (results.rowsAffected > 0) {
    //     console.log('Asset_in_service deleted successfully');
    //   } else {
    //     console.log('Asset_in_service unsuccessfully');
    //   }
    // });

    // //49 Asset_outof_service
    // tx.executeSql('DELETE FROM  Asset_outof_service', [], (tx, results) => {
    //   console.log('Asset_outof_service Results', results.rowsAffected);
    //   if (results.rowsAffected > 0) {
    //     console.log('Asset_outof_service deleted successfully');
    //   } else {
    //     console.log('Asset_outof_service unsuccessfully');
    //   }
    // });

    
    setspinner(false);
    navigation.navigate('LoginScreen');
 

  };

  renderImage = () => (
    <FontAwesome
      name="angle-left"
      color="#fff"
      size={55}
      style={{marginLeft: 15, marginBottom: 5}}
    />
  );

  const show_emp = (value) => {

    if (WIFI == 'OFFLINE') {

    }else{
      get_dropdown();
    }
    
  };


  const show_device = () => {
    //Alert.alert('Closed');
    setdeviceVisible(true);
    
  };

  //ASSET LIST
  const EMPG_ItemView = ({item}) => {
    return (
      <TouchableOpacity>
        <View style={styles.item}>
          <View style={{flexDirection: 'row', marginTop: 0}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.emp_ls5_work_group} </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const EMPG_ItemSeparatorView = () => {
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

  //get_dropdown
  const get_dropdown = async () => {

    setspinner(true);
    console.log( 'get_dropdown : ' + `${Baseurl}/get_dropdown.php?site_cd=${Site_Cd}&type=emp_ls5&EmpID=${EmpID}&LoginID=${LoginID}`);

    fetch(`${Baseurl}/get_dropdown.php?site_cd=${Site_Cd}&type=emp_ls5&EmpID=${EmpID}&LoginID=${LoginID}`)
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

          if (data.data.emp_ls5.length > 0) {
            setEMP_modalVisible(!EMP_modalVisible);
            setEMPG_data(data.data.emp_ls5);
          } else {
            //setAlert(true, 'warning', 'No Records found', 'OK');
            setEMP_modalVisible(!EMP_modalVisible);

          }
          setspinner(false);
        }else{
          setspinner(false);
          setAlert(true,'danger',data.message,'');
          return;
        }
    })
    .catch(error => {
        setspinner(false);
        setAlert(true,'danger',error.message,'');
        console.log('Error :', error.message);
    });

  };

  handleSingleIndexSelect = index => {
    //setselectedIndex(prevState => ({ ...prevState, selectedIndex: index }))

    if (WIFI == 'OFFLINE') {
      setAlert(true,'danger','Offline mode can not update....');
    }else{
      console.log(index);

      if (index === 0) {
        get_update_emp('ONS', index);
        setselectedIndex(index);
        setIndexColor('#28B463');
      } else if (index === 1) {
        get_update_emp('ONC', index);
        setselectedIndex(index);
        setIndexColor('#F1C40F');
      } else if (index === 2) {
        get_update_emp('OFS', index);
        setselectedIndex(index);
        setIndexColor('#E74C3C');
      } else if (index === 3) {
        get_update_emp('ONL', index);
        setselectedIndex(index);
        setIndexColor('#95A5A6');
      }
    }

    
  };

  const get_update_emp = async (status, index) => {

    setspinner(true);

    console.log( 'JSON DATA : ' + `${Baseurl}/update_emp_status.php?site_cd=${Site_Cd}&emp_mst_empl_id=${EmpID}&emp_mst_att_sts=${status}`);

    fetch(`${Baseurl}/update_emp_status.php?site_cd=${Site_Cd}&emp_mst_empl_id=${EmpID}&emp_mst_att_sts=${status}`)
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

          if (index === 0) {
            setselectedIndex(index);
            setIndexColor('#28B463');
          } else if (index === 1) {
            setselectedIndex(index);
            setIndexColor('#F1C40F');
          } else if (index === 2) {
            setselectedIndex(index);
            setIndexColor('#E74C3C');
          } else if (index === 3) {
            setselectedIndex(index);
            setIndexColor('#95A5A6');
          }

          setspinner(false);

        }else{
          setspinner(false);
          setAlert(true,'danger',data.message);
          return;
        }
    })
    .catch(error => {
        setspinner(false);
        setAlert(true,'danger',error.message,'');
        console.log('Error :', error.message);
    });

    
  };

  const get_token = () => {

    if (WIFI == 'OFFLINE') {

    }else{
      if(!token){
        console.log('if')
        requestUserPermission();
      }else{
        console.log('else')
        get_mobile_info();
      }
    }

    
  };

  const get_mobile_info = async () => {

    let device_id = DeviceInfo.getDeviceId();

    setspinner(true);
    console.log( 'get_mobile_info : ' + `${Baseurl}/get_mobile_info.php?tkn_site=${Site_Cd}&tkn_user=${EmpID}&tkn_dvc_id=${device_id}`);
    fetch(`${Baseurl}/get_mobile_info.php?tkn_site=${Site_Cd}&tkn_user=${EmpID}&tkn_dvc_id=${device_id}`)
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

          for (let i = 0; i < data.data.length; ++i) {

            if (data.data[i].tkn_token === '' || data.data[i].tkn_token == 'NULL') {
              setspinner(false);
              Alert.alert(
                'Update the Token',
                'Do you confirm to Update the token',
                [
                  {text: 'No'},
        
                  {text: 'Yes', onPress: () => update_token()},
                  //{text: 'Yes', onPress: () => get_offline_WKO_images()},
                ],
              );
              return;
            }else{
              setspinner(false);
            }
          
           
          }

          setspinner(false);

        }else{
          setspinner(false);
          setAlert(true,'danger',data.message,'');
          return;
        }
    })
    .catch(error => {
        setspinner(false);
        setAlert(true,'danger',error.message);
        console.error('Error :', error.message);
    });
    
  };

  const update_token = async () => {

    let device_id = DeviceInfo.getDeviceId();

    setspinner(true);
    console.log( 'get_mobile_info : ' + `${Baseurl}/update_token.php?tkn_site=${Site_Cd}&tkn_user=${EmpID}&tkn_dvc_id=${device_id}&tkn_token=${TOKEN}`);
    fetch(`${Baseurl}/update_token.php?tkn_site=${Site_Cd}&tkn_user=${EmpID}&tkn_dvc_id=${device_id}&tkn_token=${TOKEN}`)
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

          setspinner(false);
          setAlert(true,'success',data.message,'');

        }else{
          setspinner(false);
          
          return;
        }
    })
    .catch(error => {
        setspinner(false);
        setAlert(true,'danger',error.message,'');
        console.log('Error :', error.message);
    });
    
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.View_01}>
        <View style={{ backgroundColor: '#42A5F5', height: 170 }}>
            <Svg height="85%" width="100%" viewBox="0 0 1440 320" style={{ position: 'absolute', top: 130 }} >
              <Path
                fill="#42A5F5"
                d="M0,96L48,112C96,128,192,160,288,186.7C384
                ,213,480,235,576,213.3C672,192,768,128,864,
                128C960,128,1056,192,1152,208C1248,224,1344,192,
                1392,176L1440,160L1440,0L1392,0C1344,0,1248,0,
                1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,
                384,0,288,0C192,0,96,0,48,0L0,0Z"
              />
            </Svg>

            <View style={{flexDirection: 'row',justifyContent:'space-between',marginTop: 10,marginHorizontal:10}}>
              <View style={{flexDirection: 'row'}}>
                <Image style={styles.image} source={require('../images/logo.png.png')} />
                <Text style={styles.text_stytle}>{'Evantage C M M S'}</Text>
              </View>

              <View >
                <AntDesign name="logout" color="#FFF" size={25} style={{marginRight: 10, marginTop: 4}} onPress={() => logout()} />
              </View>

            </View>

          <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>

            <UserAvatar
                userName={welcome}
                size={80}
                backgroundColor="#FFFFFF"
                activeCircleColor={IndexColor}
                textColor="#42A5F5"
                active
            />

                <Text style={styles.text_stytle}>{'Welcome, ' + welcome}</Text>

                <Text style={styles.text_stytle}>{site_name}</Text>

          </View>

          

             
        </View>

        {/* <View style={styles.view_tab}>
          <View style={{flexDirection: 'row'}}>
            <Image
              style={styles.image}
              source={require('../images/logo.png.png')}
            />

            <Text style={styles.text_stytle}>{'Evantage C M M S'}</Text>
          </View>

          <View>
            <AntDesign
              name="logout"
              color="#FFF"
              size={25}
              style={{marginRight: 15, marginTop: 4}}
              onPress={() => logout()}
            />
          </View>
        </View>

        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <UserAvatar
            userName={welcome}
            size={80}
            backgroundColor="#FFFFFF"
            activeCircleColor={IndexColor}
            textColor="#42A5F5"
            active
          />
          <Text style={styles.text_stytle}>{'Welcome, ' + welcome}</Text>

          <Text style={styles.text_stytle}>{site_name}</Text>

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
            }}>
            <SegmentedControlTab
              values={['On Shift', 'On Call', 'Off Shift', 'On Leave']}
              selectedIndex={selectedIndex}
              tabStyle={{borderColor: IndexColor}}
              //tabsContainerStyle={{ height: 50 }}
              activeTabStyle={{backgroundColor: IndexColor}}
              tabTextStyle={{color: IndexColor}}
              onTabPress={handleSingleIndexSelect}
            />
          </View>
        </View> */}
      </SafeAreaView>

      <ProgressLoader visible={spinner} isModal={true} isHUD={true} hudColor={'#808080'} color={'#FFFFFF'} />

      <SCLAlert theme={Theme} show={Show} title={Title}>
        <SCLAlertButton theme={Theme} onPress={() => Alret(Type)}> OK </SCLAlertButton>
      </SCLAlert>

      <SCLAlert theme={Theme} show={Show_two} title={Title}>
        <SCLAlertButton theme={Theme} onPress={() => Alret_onClick(Type)}> Yes </SCLAlertButton>

        <SCLAlertButton theme="default" onPress={() => setShow_two(false)}> No </SCLAlertButton>
      </SCLAlert>

      <Modal
        animationType="slide"
        transparent={true}
        visible={Indicators_Visible}
        onRequestClose={() => {
         //Alert.alert('Closed');
          setIndicators_Visible(!Indicators_Visible);
        }}>
        <View style={styles.model_cardview}>
          <View style={{ backgroundColor: '#FFFFFF', margin: 20, height: 400, borderRadius: 20, }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', height: 60, marginTop: 10, }}>
              <Text style={{ flex: 1, fontSize: 20, color: '#2C3E50', fontWeight: 'bold', marginLeft: 20,}}>Change Password</Text>
              <Ionicons
                name="close"
                color="red"
                size={30}
                style={{marginEnd: 15}}
                onPress={() => setIndicators_Visible(!Indicators_Visible)}
              />
            </View>

            <View style={{flex: 1}}>
              <View style={styles.view_style}>
                <TextInput
                  value={LoginID}
                  style={[ styles.input, { height: Platform.OS === 'ios' ? 50 : 50, }, ]}
                  inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#808080'}, ]}
                  labelStyle={styles.labelStyle}
                  placeholderStyle={{ fontSize: 15, color: '#0096FF', }}
                  editable={false}
                  textErrorStyle={styles.textErrorStyle}
                  label="Login ID"
                  focusColor="#808080"
                  renderRightIcon={() =>
                    Editable ? (
                      ''
                    ) : (
                      <AntDesign
                        style={styles.icon}
                        color={'black'}
                        name={''}
                        size={22}
                      />
                    )
                  }
                />
              </View>

              <View style={styles.view_style}>
                <TextInput
                  value={NewPassword}
                  style={[ styles.input, { height: Platform.OS === 'ios' ? 50 : 50, }, ]}
                  inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}, ]}
                  labelStyle={styles.labelStyle}
                  placeholderStyle={{ fontSize: 15, color: '#0096FF', }}
                  textErrorStyle={styles.textErrorStyle}
                  label="New Password"
                  focusColor="#808080"
                  onChangeText={text => {
                    setNewPassword(text);
                  }}
                  renderRightIcon={() =>
                    Editable ? (
                      ''
                    ) : (
                      <AntDesign
                        style={styles.icon}
                        color={'black'}
                        name={NewPassword ? 'close' : ''}
                        size={22}
                        onPress={() => (NewPassword ? setNewPassword('') : '')}
                      />
                    )
                  }
                />
              </View>

              <View style={styles.view_style}>
                <TextInput
                  value={Confirm_Password}
                  style={[ styles.input, { height: Platform.OS === 'ios' ? 50 : 50, }, ]}
                  inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}, ]}
                  labelStyle={styles.labelStyle}
                  placeholderStyle={{ fontSize: 15, color: '#0096FF', }}
                  textErrorStyle={styles.textErrorStyle}
                  label="Confirm New Password"
                  focusColor="#808080"
                  onChangeText={text => {
                    setConfirm_Password(text);
                  }}
                  renderRightIcon={() =>
                    Editable ? (
                      ''
                    ) : (
                      <AntDesign
                        style={styles.icon}
                        color={'black'}
                        name={Confirm_Password ? 'close' : ''}
                        size={22}
                        onPress={() =>
                          Confirm_Password ? setConfirm_Password('') : ''
                        }
                      />
                    )
                  }
                />
              </View>

              <View style={{ flexDirection: 'row', margin: 20, justifyContent: 'center', alignItems: 'center', }}>
                <TouchableOpacity
                  style={{ width: '50%', height: 50, backgroundColor: '#0096FF', marginRight: 5, }}
                  onPress={() => get_validation()}>
                  <View
                    style={{ flexDirection: 'row', height: 50, alignItems: 'center', justifyContent: 'center', }}>
                    <AntDesign color={'#FFFF'} name={'Safety'} size={20} />

                    <Text style={{ color: 'white', fontSize: 15, marginLeft: 8, fontWeight: 'bold', }}> {'OK'.toUpperCase()} </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ width: '50%', height: 50, backgroundColor: '#0096FF', alignItems: 'center', justifyContent: 'center', }}
                  onPress={() => setIndicators_Visible(!Indicators_Visible)}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', height: 50, }}>
                    <AntDesign
                      color={'#FFFF'}
                      name={'closecircleo'}
                      size={20}
                    />

                    <Text style={{ color: 'white', fontSize: 15, marginLeft: 8, marginRight: 5, fontWeight: 'bold', }}> {'CANCEL'.toUpperCase()} </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={EMP_modalVisible}
        onRequestClose={() => {
         //Alert.alert('Closed');
          setEMP_modalVisible(!EMP_modalVisible);
        }}>
        <View style={styles.model_cardview}>
          <View style={{margin: 20, backgroundColor: '#FFFFFF'}}>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#0096FF', height: 50, }}>
              <Text style={{ flex: 1, fontSize: 15, justifyContent: 'center', color: '#fff', margin: 5, textAlign: 'center', fontWeight: 'bold', }}> Employee Privilege </Text>
              <Ionicons
                name="close"
                color="#ffffffff"
                size={25}
                style={{marginEnd: 15}}
                onPress={() => setEMP_modalVisible(!EMP_modalVisible)}
              />
            </View>

            

            <FlatList
             ListHeaderComponent={

              <View style={{flex: 1,backgroundColor: '#fff' }}>
                <View style={{flex: 1,flexDirection: 'row',padding:10}}>
                  <View style={{width:'50%'}}>
                      <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                        <Feather name="box" color="#2C3E50" size={20} style={{marginRight:8, marginTop:4}}/>
                        <Text placeholder="Test" style={{ color: '#000', fontWeight: 'bold', justifyContent: 'flex-start',fontSize:13}}>MR Approver Limit </Text>
                      </View>
                    
                  </View>
                  <View style={{flex: 1,justifyContent: 'center',}}>
                    <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000',fontSize:13}}>{MR_Approver} </Text>
                  </View>
                </View>

                <View style={{flex: 1,flexDirection: 'row',padding:10}}>
                  <View style={{flex: 1,}}>
                      <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Feather name="box" color="#2C3E50" size={20} style={{marginRight:8, marginTop:4}}/>
                        <Text placeholder="Test" style={{ color: '#000', fontWeight: 'bold', justifyContent: 'flex-start',fontSize:13}}>PR Approver Limit </Text>
                      </View>
                    
                  </View>
                  <View style={{flex: 1,justifyContent: 'center',}}>
                    <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000',fontSize:13}}>{PR_Approver} </Text>
                  </View>
                </View>

                <View style={{flex:1,flexDirection:'row',alignItems:'center',marginTop: 20,marginLeft:10}}>
                  <Feather name="book-open" color="#2C3E50" size={20} style={{marginRight: 10}} />
                  <Text placeholder="Test" style={{color:'#000',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:20}} >{"Employee Work Group"}</Text>
                </View>

              </View>

             }
              data={EMPG_data}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={EMPG_ItemSeparatorView}
              renderItem={EMPG_ItemView}
            />


          </View>

          
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={deviceVisible}
        onRequestClose={() => {
         //Alert.alert('Closed');
         setdeviceVisible(!deviceVisible);
        }}>
        <View style={styles.model_cardview}>
          <View style={{margin: 20, backgroundColor: '#FFFFFF'}}>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#0096FF', height: 50, }}>
              <Text style={{ flex: 1, fontSize: 15, justifyContent: 'center', color: '#fff', margin: 5, textAlign: 'center', fontWeight: 'bold', }}> Device Info </Text>
              <Ionicons
                name="close"
                color="#ffffffff"
                size={25}
                style={{marginEnd: 15}}
                onPress={() => setdeviceVisible(!deviceVisible)}
              />
            </View>

            <View style={{margin: 10,}}>
              <Text style={styles.text_footer}>Device ID</Text>
              <View style={styles.action}>
                <Text style={styles.textInput}>{DeviceID}</Text>
              </View>

              <TouchableOpacity  onPress={() => get_token()}>
                <Text style={styles.text_footer}>Token ID</Text>
                <View style={styles.action}>
                  <Text style={styles.textInput}>
                    {token}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

          </View>

          
        </View>
      </Modal>

      <View style={{flex: 1,marginTop: 25, }}>
        <ScrollView>
          <View style={{margin: 20}}>

          <View style={{ justifyContent: 'center', alignItems: 'center',marginTop: 45 }}>
            <SegmentedControlTab
              values={['On Shift', 'On Call', 'Off Shift', 'On Leave']}
              selectedIndex={selectedIndex}
              tabStyle={{borderColor: IndexColor}}
              //tabsContainerStyle={{ height: 50 }}
              activeTabStyle={{backgroundColor: IndexColor}}
              tabTextStyle={{color: IndexColor}}
              onTabPress={handleSingleIndexSelect}
            />
          </View>

            <Text style={styles.text_footer}>Login ID</Text>
            <View style={styles.action}>
              <Text style={styles.textInput}>{LoginID}</Text>
            </View>

            
            <View style={{ flex: 1,flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
              <View style={{flex: 1}}>
                <Text style={styles.text_footer}>Emploee ID</Text>
                <View style={styles.action}>
                  <Text style={styles.textInput}>{welcome}</Text> 
                  {/* <View style={{ alignItems: 'center', marginRight: 10 }}>
                    <MaterialIcons
                      name="admin-panel-settings"
                      color={'#05375a'}
                      size={30}
                      onPress={() => show_emp('emp')}
                      disabled={Editable}
                    />

                    <Text style={{ color: '#05375a', fontSize: 12, fontWeight: 'bold', }}> Privilege </Text>
                  </View> */}
                </View>

              </View>

              

            </View>
           
            {/* <TouchableOpacity onPress={() => show_emp('emp')}>
              <Text style={styles.text_footer}>Employee Work Group</Text>
              <View style={styles.action}>
                <Text style={styles.textInput}> Tap to view employee work group </Text>
              </View>
            </TouchableOpacity> */}

            <Text style={styles.text_footer}>URL Connection</Text>
            <View style={styles.action}>
              <Text style={styles.textInput}>{url}</Text>
            </View>

            <Text style={styles.text_footer}>Version</Text>
            <View style={styles.action}>
              <Text style={styles.textInput}>{Version}</Text>
            </View>

            <Text style={styles.text_footer}>APK File Generated Date/Time</Text>
            <View style={styles.action}>
              <Text style={styles.textInput}>{UpdateTime}</Text>
            </View>

            {/* <Text style={styles.text_footer}>Device ID</Text>
            <View style={styles.action}>
              <Text style={styles.textInput}>{DeviceID}</Text>
            </View> */}

            {/* <TouchableOpacity  onPress={() => get_token()}>
              <Text style={styles.text_footer}>Token ID</Text>
              <View style={styles.action}>
                <Text style={styles.textInput}>
                  {token}
                </Text>
              </View>
            </TouchableOpacity> */}

            {/* <TouchableOpacity onPress={() => setShow_Updatepassword()}>
              <View style={styles.card_view_two}>
                <Image style={styles.image_two} source={require('../images/update_password.png')} />

                <Text style={{  flex: 1, fontSize: 12, color: '#05375a',textAlign:'center',fontWeight: 'bold',}}> {'Change Password'} </Text>
              </View>
            </TouchableOpacity> */}

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', borderRadius: 10, marginTop: 20, }}>

              <Pressable>
                <View style={{ alignItems: 'center' }}>
                  <MaterialIcons
                    name="admin-panel-settings"
                    color={'#05375a'}
                    size={30}
                    onPress={() => show_emp('emp')}
                    disabled={Editable}
                  />

                  <Text style={{ color: '#05375a', fontSize: 12, fontWeight: 'bold', }}>Privilege</Text>
                </View>
              </Pressable>
                  

              <View style={{ alignItems: 'center',marginLeft: 15, }}>
                <MaterialCommunityIcons
                  name="form-textbox-password"
                  color={'#05375a'}
                  size={30}
                  onPress={() => setShow_Updatepassword()}
                  disabled={Editable}
                />

                <Text style={{ color: '#05375a', fontSize: 12, fontWeight: 'bold', }}>Change Password</Text>
              </View>

              <View style={{ alignItems: 'center', }}>
                <MaterialIcons
                  name="app-settings-alt"
                  color={'#05375a'}
                  size={30}
                  onPress={() => show_device()}
                  disabled={Editable}
                />

                <Text style={{ color: '#05375a', fontSize: 12, fontWeight: 'bold', }}>Device Info</Text>
              </View>
            </View>            
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  View_01: {
    flex: 0.3,
    backgroundColor: '#42A5F5',
  },

  view_tab: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  text_stytle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 5,
    marginLeft: 10,
    color: '#ffffffff',
  },

  action: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#2196f3',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    fontSize: 11,
    color: '#707B7C',
  },
  text_footer: {
    color: '#05375a',
    fontWeight: 'bold',
    fontSize: 12,
    marginTop: 10,
  },
  image: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
  },
  card_view_two: {
    height: 50,
    width: '100%',
    flexDirection: 'row',
    borderRadius: 10,
    marginTop: 15,
    backgroundColor: '#ffffffff',
    alignItems: 'center',
    
  },

  image_two: {
   
    height: 30,
    marginLeft: 10,
    resizeMode: 'contain',
    alignItems: 'center',
    alignContent:'center'
  },

  model_cardview: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },

  view_style: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  input: {
    paddingHorizontal: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#808080',
  },

  item: {
    backgroundColor: '#fff',
    margin: 5,
    padding: 5,
    borderRadius: 10,
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
});

export default ProfileScreen;
