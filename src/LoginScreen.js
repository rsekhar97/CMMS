import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Dimensions, Platform, StyleSheet, BackHandler, StatusBar, Alert, TouchableWithoutFeedback, Keyboard, Modal, } from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import ProgressLoader from 'rn-progress-loader';
import {useTheme} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {openDatabase} from 'react-native-sqlite-storage';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import moment from 'moment';
import StepIndicator from 'react-native-step-indicator';
import {Dropdown} from 'react-native-element-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SCLAlert, SCLAlertButton} from 'react-native-scl-alert';

import {useNetInfo} from '@react-native-community/netinfo';

var db = openDatabase({name: 'CMMS.db'});
let Baseurl;

const DismissKeyboard = ({children}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const LoginScreen = ({route, navigation}) => {

  const netInfo = useNetInfo();

  const version = DeviceInfo.getVersion();

  const [spinner, setspinner] = React.useState(false);

  //Alert
  const [Show, setShow] = React.useState(false);
  const [Theme, setTheme] = React.useState('');
  const [Title, setTitle] = React.useState('');


  //let [site_cd, setPicker] = React.useState('');

  const [data, setData] = React.useState({
    username: '',
    password: '',
    check_textInputChange: false,
    secureTextEntry: true,
    isValidUser: true,
    isValidPassword: true,
  });

  const [Progress_modalVisible, setProgress_modalVisible] = React.useState(false);
  let [progress, setprogress] = React.useState('');

  const [site_label, setsite_label] = React.useState('');
  const [site_cd, setsite_cd] = React.useState('');
  const [Site_dsc, setSite_dsc] = React.useState('');

  const [sub, setsub] = React.useState([]);

  const {colors} = useTheme();

  const data2 = [
    {label: 'Item 1', value: '1'},
    {label: 'Item 2', value: '2'},
    {label: 'Item 3', value: '3'},
    {label: 'Item 4', value: '4'},
    {label: 'Item 5', value: '5'},
    {label: 'Item 6', value: '6'},
    {label: 'Item 7', value: '7'},
    {label: 'Item 8', value: '8'},
  ];

  const [value, setValue] = React.useState(null);
  const [isFocus, setIsFocus] = React.useState(false);

  // Call back function when back button is pressed
  const backActionHandler = () => {
    
    BackHandler.exitApp();
    return true;
  };

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backActionHandler);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backActionHandler);
    };
  }, []);

  React.useEffect(() => {
    const focusHander = navigation.addListener('focus', () => {
      fetchData();
    });
    return focusHander;
  }, [navigation]);

  const fetchData = async () => {

    Baseurl = await AsyncStorage.getItem('BaseURL');
    //console.log(Baseurl)

    let dvc_id = DeviceInfo.getUniqueId();
    console.log(JSON.stringify(dvc_id));

    db.transaction(function (txn) {
      //01 emp_det
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='emp_det'",
        [],
        function (tx, res) {
          console.log('1 emp_det:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS emp_det', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS emp_det(ID INTEGER PRIMARY KEY AUTOINCREMENT, Site_Cd VARCHAR(10),emp_mst_empl_id VARCHAR(50),emp_mst_name VARCHAR(50),emp_mst_title VARCHAR(50),emp_mst_homephone VARCHAR(20),emp_mst_login_id VARCHAR(20),emp_det_wr_approver VARCHAR(10),emp_det_mr_approver VARCHAR(10),emp_det_mr_limit VARCHAR(100),emp_det_pr_approver VARCHAR(100),emp_det_pr_approval_limit VARCHAR(100),emp_det_work_grp VARCHAR(50),emp_det_craft VARCHAR(50),emp_ls1_charge_rate VARCHAR(50),require_offline VARCHAR(50))',
              [],
            );
          }
        },
      );

      //02 dft_mst
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='dft_mst'",
        [],
        function (tx, res) {
          console.log('2 dft_mst:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS dft_mst', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS dft_mst(ID INTEGER PRIMARY KEY AUTOINCREMENT, dft_mst_wko_sts VARCHAR(3),dft_mst_lab_act VARCHAR(50),dft_mst_mat_act VARCHAR(50),dft_mst_con_act VARCHAR(50),dft_mst_wko_pri VARCHAR(1),dft_mst_temp_ast VARCHAR(1),dft_mst_wko_asset_no VARCHAR(30),dft_mst_wkr_asset_no VARCHAR(30),dft_mst_wo_default_cc VARCHAR(1),dft_mst_time_card_by VARCHAR(1),dft_mst_itm_resv VARCHAR(1),dft_mst_mr_approval VARCHAR(1),dft_mst_pur_email_approver VARCHAR(1),dft_mst_mtr_email_approver VARCHAR(1),dft_mst_tim_act VARCHAR(50),dft_mst_gen_inv VARCHAR(1),dft_mst_mbl_chk_cmp VARCHAR(1),dft_mst_mbl_chk_scan VARCHAR(1),site_name VARCHAR(50))',
              [],
            );
          }
        },
      );

      //03 costcenter - DropDown
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='costcenter'",
        [],
        function (tx, res) {
          console.log('3 costcenter:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS costcenter', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS costcenter(ID INTEGER PRIMARY KEY AUTOINCREMENT, costcenter VARCHAR(50),descs VARCHAR(50))',
              [],
            );
          }
        },
      );

      //04 account - DropDown
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='account'",
        [],
        function (tx, res) {
          console.log('4 account:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS account', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS account(ID INTEGER PRIMARY KEY AUTOINCREMENT, account VARCHAR(50),descs VARCHAR(50))',
              [],
            );
          }
        },
      );

      //05 faultcode - DropDown
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='faultcode'",
        [],
        function (tx, res) {
          console.log('5 faultcode:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS faultcode', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS faultcode(ID INTEGER PRIMARY KEY AUTOINCREMENT, wrk_flt_fault_cd VARCHAR(50),wrk_flt_desc VARCHAR(50))',
              [],
            );
          }
        },
      );

      //06 priority - DropDown
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='priority'",
        [],
        function (tx, res) {
          console.log('6 priority:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS priority', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS priority(ID INTEGER PRIMARY KEY AUTOINCREMENT, wrk_pri_desc VARCHAR(50),wrk_pri_due_date_count VARCHAR(50),wrk_pri_pri_cd VARCHAR(1))',
              [],
            );
          }
        },
      );

      //07 actioncode - DropDown
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='actioncode'",
        [],
        function (tx, res) {
          console.log('7 actioncode:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS actioncode', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS actioncode(ID INTEGER PRIMARY KEY AUTOINCREMENT, wrk_act_action_cd VARCHAR(50),wrk_act_desc VARCHAR(50))',
              [],
            );
          }
        },
      );

      //08 workarea - DropDown
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='workarea'",
        [],
        function (tx, res) {
          console.log('8 workarea:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS workarea', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS workarea(ID INTEGER PRIMARY KEY AUTOINCREMENT, mst_war_desc VARCHAR(50),mst_war_work_area VARCHAR(50))',
              [],
            );
          }
        },
      );

      //09 casusecode - DropDown
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='casusecode'",
        [],
        function (tx, res) {
          console.log('9 casusecode:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS casusecode', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS casusecode(ID INTEGER PRIMARY KEY AUTOINCREMENT, wrk_ccd_cause_cd VARCHAR(50),wrk_ccd_desc VARCHAR(50))',
              [],
            );
          }
        },
      );

      //10 workclass - DropDown
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='workclass'",
        [],
        function (tx, res) {
          console.log('10 workclass:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS workclass', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS workclass(ID INTEGER PRIMARY KEY AUTOINCREMENT, wrk_cls_cls_cd VARCHAR(50),wrk_cls_desc VARCHAR(50))',
              [],
            );
          }
        },
      );

      //11 wrk_group - DropDown
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='wrk_group'",
        [],
        function (tx, res) {
          console.log('11 wrk_group:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS wrk_group', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS wrk_group(ID INTEGER PRIMARY KEY AUTOINCREMENT, wrk_grp_grp_cd VARCHAR(50),wrk_grp_desc VARCHAR(50))',
              [],
            );
          }
        },
      );

      //12 workorderstatus - DropDown
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='workorderstatus'",
        [],
        function (tx, res) {
          console.log('12 workorderstatus:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS workorderstatus', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS workorderstatus(ID INTEGER PRIMARY KEY AUTOINCREMENT, wrk_sts_typ_cd VARCHAR(50),wrk_sts_status VARCHAR(50),wrk_sts_email_flag VARCHAR(1),wrk_sts_desc VARCHAR(1),column1 VARCHAR(1))',
              [],
            );
          }
        },
      );

      //13 worktype - DropDown
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='worktype'",
        [],
        function (tx, res) {
          console.log('13 worktype:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS worktype', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS worktype(ID INTEGER PRIMARY KEY AUTOINCREMENT, wrk_typ_typ_cd VARCHAR(50),wrk_typ_desc VARCHAR(50),wrk_typ_option VARCHAR(1),wrk_typ_pm_option VARCHAR(1))',
              [],
            );
          }
        },
      );

      //14 assetcode - DropDown
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='assetcode'",
        [],
        function (tx, res) {
          console.log('14 assetcode:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS assetcode', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS assetcode(ID INTEGER PRIMARY KEY AUTOINCREMENT, ast_cod_ast_cd VARCHAR(50),ast_cod_desc VARCHAR(50))',
              [],
            );
          }
        },
      );

      //15 criticalfactor - DropDown
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='criticalfactor'",
        [],
        function (tx, res) {
          console.log('15 criticalfactor:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS criticalfactor', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS criticalfactor(ID INTEGER PRIMARY KEY AUTOINCREMENT, ast_cri_cri_factor VARCHAR(50),ast_cri_desc VARCHAR(50))',
              [],
            );
          }
        },
      );

      //16 assetgroupcode - DropDown
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='assetgroupcode'",
        [],
        function (tx, res) {
          console.log('16 assetgroupcode:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS assetgroupcode', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS assetgroupcode(ID INTEGER PRIMARY KEY AUTOINCREMENT, ast_grp_grp_cd VARCHAR(50),ast_grp_desc VARCHAR(50),ast_grp_option VARCHAR(50))',
              [],
            );
          }
        },
      );

      //17 assetlevel - DropDown
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='assetlevel'",
        [],
        function (tx, res) {
          console.log('17 assetlevel:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS assetlevel', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS assetlevel(ID INTEGER PRIMARY KEY AUTOINCREMENT, ast_lvl_ast_lvl VARCHAR(50),ast_lvl_desc VARCHAR(50))',
              [],
            );
          }
        },
      );

      //18 assetlocation - DropDown
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='assetlocation'",
        [],
        function (tx, res) {
          console.log('18 assetlocation:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS assetlocation', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS assetlocation(ID INTEGER PRIMARY KEY AUTOINCREMENT, ast_loc_ast_loc VARCHAR(50),ast_loc_desc VARCHAR(50),ast_loc_pm_option VARCHAR(50),ast_loc_wo_option VARCHAR(50),ast_loc_wr_option VARCHAR(50))',
              [],
            );
          }
        },
      );

      //19 assetstatus - DropDown
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='assetstatus'",
        [],
        function (tx, res) {
          console.log('19 assetstatus:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS assetstatus', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS assetstatus(ID INTEGER PRIMARY KEY AUTOINCREMENT, ast_sts_status VARCHAR(50),ast_sts_desc VARCHAR(50))',
              [],
            );
          }
        },
      );

      //20 assettype - DropDown
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='assettype'",
        [],
        function (tx, res) {
          console.log('20 assettype:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS assettype', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS assettype(ID INTEGER PRIMARY KEY AUTOINCREMENT, ast_type_cd VARCHAR(50),ast_type_descs VARCHAR(50))',
              [],
            );
          }
        },
      );

      //21 employee - DropDown
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='employee'",
        [],
        function (tx, res) {
          console.log('21 employee:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS employee', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS employee(ID INTEGER PRIMARY KEY AUTOINCREMENT, emp_mst_empl_id VARCHAR(50),emp_mst_name VARCHAR(50),emp_mst_emg_phone VARCHAR(50),emp_ls1_charge_rate VARCHAR(50),emp_det_craft VARCHAR(50),emp_mst_title VARCHAR(50))',
              [],
            );
          }
        },
      );

      //22 auto_numnering - DropDown
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='auto_numnering'",
        [],
        function (tx, res) {
          console.log('22 auto_numnering:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS auto_numnering', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS auto_numnering(ID INTEGER PRIMARY KEY AUTOINCREMENT, cnt_mst_module_cd VARCHAR(50),cnt_mst_numbering VARCHAR(1),cnt_mst_option VARCHAR(1))',
              [],
            );
          }
        },
      );

      //23 wko_auto_numbering - DropDown
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='wko_auto_numbering'",
        [],
        function (tx, res) {
          console.log('23 wko_auto_numbering:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS wko_auto_numbering', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS wko_auto_numbering(ID INTEGER PRIMARY KEY AUTOINCREMENT, cnt_mst_module_cd VARCHAR(50),cnt_mst_numbering VARCHAR(1),cnt_mst_option VARCHAR(1))',
              [],
            );
          }
        },
      );

      //24 ratingquestion - DropDown
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='ratingquestion'",
        [],
        function (tx, res) {
          console.log('24 ratingquestion:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS ratingquestion', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS ratingquestion(ID INTEGER PRIMARY KEY AUTOINCREMENT, column_name VARCHAR(50),language_cd VARCHAR(1),table_name VARCHAR(1),default_label VARCHAR(50),customize_label VARCHAR(50),default_header VARCHAR(50),customize_header VARCHAR(50),cfr_flag VARCHAR(1),cf_label_required VARCHAR(1))',
              [],
            );
          }
        },
      );

      //25 mrstockno - DropDown
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='mrstockno'",
        [],
        function (tx, res) {
          console.log('25 mrstockno:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS mrstockno', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS mrstockno(ID INTEGER PRIMARY KEY AUTOINCREMENT, RowID VARCHAR(20),itm_mst_stockno VARCHAR(50),itm_mst_costcenter VARCHAR(1),itm_mst_mstr_locn VARCHAR(1),itm_mst_desc VARCHAR(50),itm_mst_issue_price VARCHAR(20),itm_mst_ttl_oh VARCHAR(20),itm_det_part_deac_status VARCHAR(50),itm_det_order_pt VARCHAR(20),itm_det_ttl_oh VARCHAR(20), category VARCHAR(20),itm_mst_issue_uom VARCHAR(20),itm_mst_account VARCHAR(20),itm_mst_ext_desc VARCHAR(50),itm_mst_partno VARCHAR(50))',
              [],
            );
          }
        },
      );

      //26 hourstype - DropDown
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='hourstype'",
        [],
        function (tx, res) {
          console.log('26 hourstype:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS hourstype', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS hourstype(ID INTEGER PRIMARY KEY AUTOINCREMENT, hours_type_cd VARCHAR(50),hours_type_multiplier VARCHAR(10),hours_type_adder VARCHAR(10))',
              [],
            );
          }
        },
      );

      //27 TimeCraft - DropDown
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='TimeCraft'",
        [],
        function (tx, res) {
          console.log('27 TimeCraft:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS TimeCraft', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS TimeCraft(ID INTEGER PRIMARY KEY AUTOINCREMENT, emp_mst_empl_id VARCHAR(50),emp_ls1_craft VARCHAR(50),emp_ls1_charge_rate VARCHAR(20))',
              [],
            );
          }
        },
      );

      //28 supplier - DropDown
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='supplier'",
        [],
        function (tx, res) {
          console.log('28 supplier:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS supplier', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS supplier(ID INTEGER PRIMARY KEY AUTOINCREMENT, sup_mst_supplier_cd VARCHAR(50),sup_mst_desc VARCHAR(10),sup_mst_status VARCHAR(10))',
              [],
            );
          }
        },
      );

      //29 uom - DropDown
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='uom'",
        [],
        function (tx, res) {
          console.log('29 uom:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS uom', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS uom(ID INTEGER PRIMARY KEY AUTOINCREMENT, uom_mst_uom VARCHAR(50),uom_mst_desc VARCHAR(10))',
              [],
            );
          }
        },
      );

      //30 tax_cd - DropDown
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='tax_cd'",
        [],
        function (tx, res) {
          console.log('30 tax_cd:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS tax_cd', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS tax_cd(ID INTEGER PRIMARY KEY AUTOINCREMENT, tax_mst_tax_cd VARCHAR(50),tax_mst_desc VARCHAR(100),tax_mst_tax_rate VARCHAR(10))',
              [],
            );
          }
        },
      );

      //31 approve_workorderstatus - DropDown
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='approve_workorderstatus'",
        [],
        function (tx, res) {
          console.log('31 approve_workorderstatus:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS approve_workorderstatus', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS approve_workorderstatus(ID INTEGER PRIMARY KEY AUTOINCREMENT, wrk_sts_typ_cd VARCHAR(50),wrk_sts_desc VARCHAR(100),wrk_sts_status VARCHAR(10),wrk_sts_email_flag VARCHAR(10))',
              [],
            );
          }
        },
      );

      //32 wkr_auto_numbering - DropDown
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='wkr_auto_numbering'",
        [],
        function (txn, res) {
          console.log('32 wkr_auto_numbering:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS wkr_auto_numbering', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS wkr_auto_numbering(ID INTEGER PRIMARY KEY AUTOINCREMENT, cnt_mst_module_cd VARCHAR(50),cnt_mst_numbering VARCHAR(1),cnt_mst_option VARCHAR(1))',
              [],
            );
          }
        },
      );

      //33 ast_mst
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='ast_mst'",
        [],
        function (txn, res) {
          console.log('33 ast_mst:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS ast_mst', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS ast_mst(ID INTEGER PRIMARY KEY AUTOINCREMENT,site_cd VARCHAR(4),RowID VARCHAR(10),ast_mst_wrk_grp VARCHAR(15),ast_mst_asset_no VARCHAR(30),ast_mst_asset_grpcode VARCHAR(25),ast_mst_asset_shortdesc VARCHAR(80),ast_mst_asset_longdesc VARCHAR(2000),ast_mst_perm_id VARCHAR(30),ast_det_cus_code VARCHAR(20),ast_mst_asset_type VARCHAR(10),ast_mst_asset_code VARCHAR(30),mst_war_work_area VARCHAR(50),ast_mst_asset_locn VARCHAR(50),ast_mst_asset_lvl VARCHAR(50),ast_mst_asset_status VARCHAR(10),ast_mst_cri_factor VARCHAR(10),ast_mst_cost_center VARCHAR(50),Asset_Status_Category VARCHAR(20),ast_det_warranty_date VARCHAR(20))',
              [],
            );
          }
        },
        function (error) {
          console.log(error);
        },
      );

      //34 Work Order (wko_mst)
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='wko_mst'",
        [],
        function (txn, res) {
          console.log('34 wko_mst:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS wko_mst', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS wko_mst(ID INTEGER PRIMARY KEY AUTOINCREMENT,RowID VARCHAR(10),site_cd VARCHAR(4),EmpID VARCHAR(10),EmpName VARCHAR(50),wko_mst_originator VARCHAR(25),wko_mst_phone VARCHAR(10),wko_mst_assetno VARCHAR(30),ast_mst_asset_shortdesc VARCHAR(200),ast_mst_asset_group VARCHAR(20),wko_mst_work_area VARCHAR(20),wko_mst_asset_location VARCHAR(50),wko_mst_asset_level VARCHAR(50),wko_mst_chg_costcenter VARCHAR(50),wko_mst_wo_no VARCHAR(11),wko_mst_orig_priority VARCHAR(5),wko_mst_plan_priority VARCHAR(5),wko_mst_org_date VARCHAR(10),wko_mst_due_date VARCHAR(10),wko_det_work_type VARCHAR(20),wko_mst_flt_code VARCHAR(20),wko_mst_descs VARCHAR(200),wko_mst_status VARCHAR(20),wko_det_assign_to VARCHAR(20),wko_det_laccount VARCHAR(20),wko_det_caccount VARCHAR(20),wko_det_maccount VARCHAR(20),ast_mst_asset_code VARCHAR(20),ast_mst_perm_id VARCHAR(20),ast_det_cus_code VARCHAR(20),ast_mst_asset_status VARCHAR(20),cnt_mst_numbering VARCHAR(50),dvc_id VARCHAR(100),LOGINID VARCHAR(20),wko_mst_type VARCHAR(20),wko_mst_pm_grp VARCHAR(20),wko_det_work_grp VARCHAR(20),wrk_sts_typ_cd VARCHAR(20),sts_column VARCHAR(200),per_assignto VARCHAR(20),per_assign_remake VARCHAR(200),wko_mst_ast_cod VARCHAR(20),assigndate VARCHAR(20),wko_det_varchar9 VARCHAR(20),wko_det_varchar10 VARCHAR(20),wko_det_datetime5 VARCHAR(20),wko_mst_asset_status VARCHAR(20),mbl_audit_user VARCHAR(20),mbl_audit_date VARCHAR(20))',
              [],
            );
          }
        },
      );

      //35 Work order Attachment(wko_ref)
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='wko_ref'",
        [],
        function (txn, res) {
          console.log('35 wko_ref:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS wko_ref', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS wko_ref(ID INTEGER PRIMARY KEY AUTOINCREMENT,RowID VARCHAR(10),site_cd VARCHAR(4),type VARCHAR(10),file_name VARCHAR(50),thumbnail_link VARCHAR(25),full_size_link VARCHAR(10),file_source VARCHAR(30),ref_type VARCHAR(200),Exist VARCHAR(20),Local_link VARCHAR(20),mst_RowID VARCHAR(50),column2 VARCHAR(50),local_id VARCHAR(50),sts_column VARCHAR(11),attachment IMAGE(100))',
              [],
            );
          }
        },
      );

      //36 Work order Completion (wko_det_completion)
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='wko_det_completion'",
        [],
        function (txn, res) {
          console.log('36 wko_det_completion:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS wko_det_completion', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS wko_det_completion(ID INTEGER PRIMARY KEY AUTOINCREMENT,RowID VARCHAR(10),site_cd VARCHAR(4),EmpID VARCHAR(10),EmpName VARCHAR(50),LOGINID VARCHAR(25),wko_mst_status VARCHAR(50),wko_mst_status_after VARCHAR(50),wko_det_cause_code VARCHAR(50),wko_det_act_code VARCHAR(50),wko_det_work_class VARCHAR(20),wko_det_work_grp VARCHAR(20),wko_det_corr_action VARCHAR(50),Is_checked VARCHAR(20),wko_mst_wo_no VARCHAR(20),wko_mst_assetno VARCHAR(20),wko_mst_work_area VARCHAR(50),wko_mst_asset_location VARCHAR(50),wko_mst_asset_level VARCHAR(20),wko_mst_org_date VARCHAR(10),wko_mst_due_date VARCHAR(10),wko_mst_descs VARCHAR(200),wko_det_note1 VARCHAR(200),Requested_by VARCHAR(20),Contact_no VARCHAR(20),dvc_id VARCHAR(50),currentDateandTime VARCHAR(20),Assest_description VARCHAR(200),sts_column VARCHAR(200),local_id VARCHAR(20),mst_RowID VARCHAR(20))',
              [],
            );
          }
        },
      );

      //37 Work order Ackonwledgement (wko_det_ackowledgement)
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='wko_det_ackowledgement'",
        [],
        function (txn, res) {
          console.log('37 wko_det_ackowledgement:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS wko_det_ackowledgement', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS wko_det_ackowledgement(ID INTEGER PRIMARY KEY AUTOINCREMENT,RowID VARCHAR(10),site_cd VARCHAR(4),EmpID VARCHAR(10),EmpName VARCHAR(50),LOGINID VARCHAR(25),wko_det_rating1 VARCHAR(50),wko_det_rating2 VARCHAR(50),wko_det_rating3 VARCHAR(50),wko_det_ack_name VARCHAR(50),wko_det_ack_contact VARCHAR(20),wko_det_ack_id VARCHAR(20),sts_column VARCHAR(200),local_id VARCHAR(20),mst_RowID VARCHAR(20))',
              [],
            );
          }
        },
      );

      //38 wko_isp_heard
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='wko_isp_heard'",
        [],
        function (txn, res) {
          console.log('38 wko_isp_heard:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS wko_isp_heard', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS wko_isp_heard (ID INTEGER PRIMARY KEY AUTOINCREMENT,RowID VARCHAR(10),site_cd VARCHAR(4),EmpID VARCHAR(10),EmpName VARCHAR(50),LOGINID VARCHAR(25),wko_isp_asset_no VARCHAR(50),ast_mst_asset_shortdesc VARCHAR(50),ast_mst_work_area VARCHAR(50),ast_mst_asset_locn VARCHAR(50),ast_mst_ast_lvl VARCHAR(20),total VARCHAR(20),done VARCHAR(20),na VARCHAR(20),sts_column VARCHAR(200),local_id VARCHAR(20),mst_RowID VARCHAR(20),wko_isp_job_cd VARCHAR(50),wko_isp_job_desc VARCHAR(50),wko_isp_datetime3 VARCHAR(20))',
              [],
            );
          }
        },
      );

      //39 wko_isp_details
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='wko_isp_details'",
        [],
        function (txn, res) {
          console.log('39 wko_isp_details:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS wko_isp_details', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS wko_isp_details (ID INTEGER PRIMARY KEY AUTOINCREMENT,rowid VARCHAR(10),mst_RowID VARCHAR(10),site_cd VARCHAR(4),EmpID VARCHAR(10),EmpName VARCHAR(50),LOGINID VARCHAR(10),wko_isp_asset_no VARCHAR(50),wko_isp_job_cd VARCHAR(50),wko_isp_job_desc VARCHAR(100),wko_isp_sec_no VARCHAR(50),wko_isp_sec_desc VARCHAR(100),wko_isp_stp_no VARCHAR(10),wko_isp_stp_desc VARCHAR(100),wko_isp_stp_datatype VARCHAR(10),wko_isp_stp_rowid VARCHAR(20),wko_isp_varchar1 VARCHAR(100),wko_isp_varchar2 VARCHAR(100),wko_isp_varchar3 VARCHAR(100),wko_isp_numeric1 VARCHAR(20),wko_isp_numeric2 VARCHAR(20),wko_isp_numeric3 VARCHAR(20),wko_isp_datetime1 VARCHAR(20),wko_isp_datetime2 VARCHAR(20),wko_isp_datetime3 VARCHAR(20),wko_isp_checkbox1 VARCHAR(20),wko_isp_checkbox2 VARCHAR(20),wko_isp_checkbox3 VARCHAR(20),wko_isp_dropdown1 VARCHAR(200),wko_isp_dropdown2 VARCHAR(200),wko_isp_dropdown3 VARCHAR(200),audit_user VARCHAR(20),audit_date VARCHAR(20),type VARCHAR(20),total VARCHAR(20),done VARCHAR(20),na VARCHAR(20),local_id VARCHAR(20),sts_column VARCHAR(20),count_text VARCHAR(20),count_no VARCHAR(20),count_date VARCHAR(20),count_checkbox VARCHAR(20),count_dropdown VARCHAR(20),count_text_update VARCHAR(20),count_no_update VARCHAR(20),count_date_update VARCHAR(20),count_checkbox_update VARCHAR(20),count_dropdown_update VARCHAR(20),mbl_audit_user VARCHAR(20),mbl_audit_date VARCHAR(20),file_name VARCHAR(100),file_link VARCHAR(100),column1 VARCHAR(100),wko_isp_content VARCHAR(50),wko_isp_method VARCHAR(50),wko_isp_std VARCHAR(50),wko_isp_min_thr VARCHAR(50),wko_isp_max_thr VARCHAR(50),wko_isp_ovr_thr VARCHAR(50),wko_isp_uom VARCHAR(50))',
              [],
            );
          }
        },
      );

      //40 stp_zom
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='stp_zom'",
        [],
        function (txn, res) {
          console.log('40 stp_zom:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS stp_zom', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS stp_zom (ID INTEGER PRIMARY KEY AUTOINCREMENT,mst_RowID VARCHAR(10),site_cd VARCHAR(4),stp_zom_data VARCHAR(50))',
              [],
            );
          }
        },
      );

      //41 wko_ls2
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='wko_ls2'",
        [],
        function (txn, res) {
          console.log('41 wko_ls2:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS wko_ls2', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS wko_ls2 (ID INTEGER PRIMARY KEY AUTOINCREMENT,site_cd VARCHAR(4),wko_ls2_assetno VARCHAR(10),wko_ls2_activity_code VARCHAR(50),wko_ls2_stockno VARCHAR(25),wko_ls2_desc VARCHAR(50),wko_ls2_qty_needed VARCHAR(50),wko_ls2_item_cost VARCHAR(200),wko_ls2_mr_no VARCHAR(50),wko_ls2_mr_lineno VARCHAR(200),mtr_mst_status VARCHAR(20),mtr_ls1_rcv_qty VARCHAR(20),wko_ls2_rec_supplier VARCHAR(20),wko_ls2_act_qty VARCHAR(200),wko_ls2_act_cost VARCHAR(20),wko_ls2_mtl_uom VARCHAR(20),wko_ls2_taxable VARCHAR(20),wko_ls2_chg_costcenter VARCHAR(20),wko_ls2_stk_locn VARCHAR(20),audit_user VARCHAR(20),audit_date VARCHAR(20),mst_RowID VARCHAR(20),RowID VARCHAR(20),TotalAvailable VARCHAR(20),mtr_ls1_clear_qty VARCHAR(20),stockstatus VARCHAR(20))',
              [],
            );
          }
        },
      );

      //42 wko_ls8_timecard
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='wko_ls8_timecard'",
        [],
        function (txn, res) {
          console.log('42 wko_ls8_timecard:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS wko_ls8_timecard', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS wko_ls8_timecard (ID INTEGER PRIMARY KEY AUTOINCREMENT,mst_RowID VARCHAR(10),site_cd VARCHAR(4),wko_ls8_assetno VARCHAR(10),wko_ls8_empl_id VARCHAR(50),wko_ls8_craft VARCHAR(25),wko_ls8_hours_type VARCHAR(50),wko_ls8_hrs VARCHAR(50),wko_ls8_rate VARCHAR(200),wko_ls8_multiplier VARCHAR(50),wko_ls8_adder VARCHAR(200),wko_ls8_act_cost VARCHAR(20),wko_ls8_chg_costcenter VARCHAR(20),wko_ls8_chg_account VARCHAR(20),wko_ls8_crd_costcenter VARCHAR(200),wko_ls8_crd_account VARCHAR(20),wko_ls8_time_card_no VARCHAR(20),wko_ls8_datetime1 VARCHAR(20),wko_ls8_datetime2 VARCHAR(20),audit_user VARCHAR(20),audit_date VARCHAR(20),RowID VARCHAR(20),wko_mst_wo_no VARCHAR(20),sts_column VARCHAR(20),local_id VARCHAR(20))',
              [],
            );
          }
        },
      );

      //43 prm_ast
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='prm_ast'",
        [],
        function (txn, res) {
          console.log('43 prm_ast:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS prm_ast', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS prm_ast(ID INTEGER PRIMARY KEY AUTOINCREMENT,site_cd VARCHAR(4),prm_ast_wo_no VARCHAR(20),prm_ast_grp_cd VARCHAR(20),ast_mst_asset_no VARCHAR(20),ast_mst_asset_shortdesc VARCHAR(200),ast_mst_asset_type VARCHAR(20),ast_mst_asset_status VARCHAR(20),ast_mst_work_area VARCHAR(20),ast_mst_asset_locn VARCHAR(20),ast_mst_cost_center VARCHAR(20))',
              [],
            );
          }
        },
      );

      //44 wko_det_response
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='wko_det_response'",
        [],
        function (txn, res) {
          console.log('44 wko_det_response:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS wko_det_response', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS wko_det_response(ID INTEGER PRIMARY KEY AUTOINCREMENT,site_cd VARCHAR(4),RowID VARCHAR(20),mst_RowID VARCHAR(20),wko_det_tech_resp_date VARCHAR(20),wko_det_tech_resp_id VARCHAR(200),wko_det_resp_contact VARCHAR(20),wko_det_resp_id VARCHAR(20),wko_det_resp_name VARCHAR(20),wko_det_resp_date VARCHAR(20),mbl_audit_user VARCHAR(20),mbl_audit_date VARCHAR(20),sts_column VARCHAR(20),LOGINID VARCHAR(20),local_id VARCHAR(20))',
              [],
            );
          }
        },
      );

      //45 Dashbord permission
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='cf_menu'",
        [],
        function (txn, res) {
          console.log('45 cf_menu:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS cf_menu', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS cf_menu(ID INTEGER PRIMARY KEY AUTOINCREMENT,object_name VARCHAR(30),object_descs VARCHAR(100),exe_flag VARCHAR(1),new_flag VARCHAR(1),edit_flag VARCHAR(1),column1 VARCHAR(50),mobile_object_type VARCHAR(1),cf_menu_seq VARCHAR(1),cf_menu_color VARCHAR(50),cf_menu_count VARCHAR(30))',
              [],
            );
          }
        },
      );

      //46 Asset_IN_Service - DropDown
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='asset_in_service'",
        [],
        function (tx, res) {
          console.log('46 asset_in_service:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS asset_in_service', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS asset_in_service(ID INTEGER PRIMARY KEY AUTOINCREMENT, ast_sts_status VARCHAR(50),ast_sts_desc VARCHAR(10))',
              [],
            );
          }
        },
      );

      //47 Asset_outof_Service - DropDown
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='asset_outof_service'",
        [],
        function (tx, res) {
          console.log('46 Asset_outof_service:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS asset_outof_service', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS asset_outof_service(ID INTEGER PRIMARY KEY AUTOINCREMENT, ast_sts_status VARCHAR(50),ast_sts_desc VARCHAR(10))',
              [],
            );
          }
        },
      );

      //48 Assign employee - DropDown
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='assign_employee'",
        [],
        function (tx, res) {
          console.log('48 assign_employee:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS assign_employee', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS assign_employee(ID INTEGER PRIMARY KEY AUTOINCREMENT, emp_mst_empl_id VARCHAR(50),emp_mst_name VARCHAR(50),emp_mst_emg_phone VARCHAR(50),emp_ls1_charge_rate VARCHAR(50),emp_det_craft VARCHAR(50),emp_mst_title VARCHAR(50),WOASSIGN VARCHAR(20))',
              [],
            );
          }
        },
      );

      //49 Asset Down Time
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='ast_dwntime'",
        [],
        function (tx, res) {
          console.log('49 ast_dwntime:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS ast_dwntime', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS ast_dwntime(ID INTEGER PRIMARY KEY AUTOINCREMENT, site_cd VARCHAR(10),ast_dwntime_out_date VARCHAR(20),ast_dwntime_rts_date VARCHAR(20),ast_dwntime_downtime VARCHAR(20),ast_dwntime_repair_from VARCHAR(20),ast_dwntime_repair_to VARCHAR(20),ast_dwntime_repairtime VARCHAR(20),ast_dwntime_down_wo VARCHAR(20),ast_dwntime_up_wo VARCHAR(20),ast_dwntime_asset_no VARCHAR(20),ast_dwntime_sched_flag VARCHAR(20),ast_dwntime_remark VARCHAR(100),audit_user VARCHAR(20),audit_date VARCHAR(20),rowid VARCHAR(20),mst_RowID VARCHAR(20),sts_column VARCHAR(20),LOGINID VARCHAR(20),local_id VARCHAR(20))',
              [],
            );
          }
        },
      );

      //50 report_current_week
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='report_current_week'",
        [],
        function (tx, res) {
          console.log('50 report_current_week:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS report_current_week', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS report_current_week(ID INTEGER PRIMARY KEY AUTOINCREMENT, Total NUMERIC(10),DAY_NAME VARCHAR(20),DATEE VARCHAR(20),MONTHH VARCHAR(20))',
              [],
            );
          }
        },
      );
    });

    get_siteCode();

  };

  const setAlert = (show, theme, title) => {
    setShow(show);
    setTheme(theme);
    setTitle(title);
  };

  const get_siteCode = async () => {

    setspinner(true);
    console.log("URL site_cd: " , `${Baseurl}/get_sitecode.php?`)

    fetch(`${Baseurl}/get_sitecode.php?`)
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

          let cities = data.data.map(item => ({
            label: item.site_cd + ':' + item.site_name,
            value: item.site_cd,
          }));
  
          setsub(cities);
          setspinner(false);

        }else{
          setspinner(false);
          setAlert(true,'danger',data.message);
          return;
        }
    })
    .catch(error => {
        setspinner(false);
        setAlert(true,'danger',error.message);
        console.log('Error :', error.message);
    });

  };

  const textInputChange = val => {
    if (val.trim().length >= 4) {
      setData({ ...data, username: val, check_textInputChange: true, isValidUser: true});
    } else {
      setData({ ...data, username: val, check_textInputChange: false, isValidUser: false});
    }
  };

  const handlePasswordChange = val => {
    if (val.trim().length >= 1) {
      setData({ ...data, password: val, isValidPassword: true});
    } else {
      setData({ ...data, password: val, isValidPassword: false});
    }
  };

  const updateSecureTextEntry = () => {
    setData({ ...data, secureTextEntry: !data.secureTextEntry});
  };

  const handleValidUser = val => {
    if (val.trim().length >= 4) {
      setData({ ...data, isValidUser: true});
    } else {
      setData({ ...data, isValidUser: false});
    }
  };

  const select_site_code = e => {
    console.log('sitcd' + e);
    if (!e) {
      console.log('if sit' + e);
    } else {
      setsite_label(e);
      setIsFocus(false);
      let Site_code = e.split(':');
      let site_cd = Site_code[0];
      let site_cd_dsc = Site_code[0];
      setsite_cd(site_cd.trim());
      setSite_dsc(site_cd_dsc.trim());
    }
  };

  const loginHandle = async (userName, password) => {

    let dvc_id = DeviceInfo.getDeviceId();

    setspinner(true);

    if (!userName) {
      setAlert(true, 'warning', 'Please Enter the User Name');
      setspinner(false);
      return;
    }
    if (!password) {
      setAlert(true, 'warning', 'Please Enter the Password');
      setspinner(false);
      return;
    }
    if (!site_cd) {
      setAlert(true, 'warning', 'Please Select the SiteCode');
      setspinner(false);
      return;
    }

    if (userName && password) {

      console.log( 'JSON DATA : ', `${Baseurl}/authenticate_login.php?login_id=${encodeURIComponent( userName)}&secret_key=&encrypted=&iv=&site_cd=${site_cd}&password=${encodeURIComponent( password, )}&device_ID=${dvc_id}`);
      fetch(`${Baseurl}/authenticate_login.php?login_id=${encodeURIComponent( userName)}&secret_key=&encrypted=&iv=&site_cd=${site_cd}&password=${encodeURIComponent( password, )}&device_ID=${dvc_id}`)
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

              console.log( 'Results_test', site_cd, data.data[i].emp_mst_empl_id, data.data[i].emp_mst_name, data.data[i].emp_mst_title, data.data[i].emp_mst_homephone, data.data[i].emp_mst_login_id, data.data[i].emp_det_wr_approver, data.data[i].emp_det_mr_approve, data.data[i].emp_det_mr_limit, data.data[i].emp_det_pr_approver, data.data[i].emp_det_pr_approval_limit, data.data[i].emp_det_work_grp, data.data[i].emp_det_craft, data.data[i].emp_ls1_charge_rate, data.data[i].require_offline, );

              AsyncStorage.setItem('Site_Cd', site_cd);
              // AsyncStorage.setItem('Site_dsc',Site_dsc);
              AsyncStorage.setItem( 'emp_mst_empl_id', data.data[i].emp_mst_empl_id);
              AsyncStorage.setItem( 'emp_mst_name', data.data[i].emp_mst_name);
              AsyncStorage.setItem( 'emp_mst_title', data.data[i].emp_mst_title);
              AsyncStorage.setItem( 'emp_mst_homephone', data.data[i].emp_mst_homephone);
              AsyncStorage.setItem( 'emp_mst_login_id', data.data[i].emp_mst_login_id);
              AsyncStorage.setItem( 'emp_det_wr_approver', data.data[i].emp_det_wr_approver);
              AsyncStorage.setItem( 'emp_det_mr_approver', data.data[i].emp_det_mr_approver);
              AsyncStorage.setItem( 'emp_det_mr_limit', data.data[i].emp_det_mr_limit);
              AsyncStorage.setItem( 'emp_det_pr_approver', data.data[i].emp_det_pr_approver);
              AsyncStorage.setItem( 'emp_det_pr_approval_limit', data.data[i].emp_det_pr_approval_limit);
              AsyncStorage.setItem( 'emp_det_work_grp', data.data[i].emp_det_work_grp);
              AsyncStorage.setItem( 'emp_det_craft', data.data[i].emp_det_craft);
              AsyncStorage.setItem( 'emp_ls1_charge_rate', data.data[i].emp_ls1_charge_rate);
              AsyncStorage.setItem( 'require_offline', data.data[i].require_offline);
              AsyncStorage.setItem('WIFI', 'ONLINE');

              db.transaction(function (tx) {
                tx.executeSql(
                  'INSERT INTO emp_det (Site_Cd ,emp_mst_empl_id ,emp_mst_name ,emp_mst_title ,emp_mst_homephone ,emp_mst_login_id ,emp_det_wr_approver ,emp_det_mr_approver ,emp_det_mr_limit ,emp_det_pr_approver ,emp_det_pr_approval_limit ,emp_det_work_grp ,emp_det_craft ,emp_ls1_charge_rate ,require_offline) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                  [
                    site_cd,
                    data.data[i].emp_mst_empl_id,
                    data.data[i].emp_mst_name,
                    data.data[i].emp_mst_title,
                    data.data[i].emp_mst_homephone,
                    data.data[i].emp_mst_login_id,
                    data.data[i].emp_det_wr_approver,
                    data.data[i].emp_det_mr_approve,
                    data.data[i].emp_det_mr_limit,
                    data.data[i].emp_det_pr_approver,
                    data.data[i].emp_det_pr_approval_limit,
                    data.data[i].emp_det_work_grp,
                    data.data[i].emp_det_craft,
                    data.data[i].emp_ls1_charge_rate,
                    data.data[i].require_offline,
                  ],
                  (tx, results) => {
                    console.log('Results_test', results.rowsAffected);
                    if (results.rowsAffected > 0) {
                      //navigation.navigate("MainTabScreen")
  
                      get_default_values();
                      //setspinner(false);
                    } else {
                      setspinner(false);
                      setAlert(true, 'danger', 'Insert employee table failed');
                      //alert('INSERT TABLE Emp_det Failed');
                    }
                  },
                );
              });

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
          console.log('Error :', error.message);
      });

     
    } else {
      console.log('No DATA', setspinner(false));
    }
  };

  const get_default_site_cd = async val => {
    console.log( 'get_default_site_cd : ' + `${Baseurl}/get_default_site_cd.php?empl_id=${val}`);
    fetch(`${Baseurl}/get_default_site_cd.php?empl_id=${val}`)
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

          select_site_code(data.default_site);
        

        }else{
            setspinner(false);
            setAlert(true,'danger',data.message);
            return;
        }
    })
    .catch(error => {
        setspinner(false);
        setAlert(true,'danger',error.message);
        console.log('Error :', error.message);
    });
    
  };

  const get_default_values = async () => {
    console.log( 'get_default_values : ' + `${Baseurl}/get_default_values.php?site_cd=${site_cd}`);
    fetch(`${Baseurl}/get_default_values.php?site_cd=${site_cd}`)
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

            AsyncStorage.setItem( 'dft_mst_wko_sts', data.data[i].dft_mst_wko_sts, );
            AsyncStorage.setItem( 'dft_mst_lab_act', data.data[i].dft_mst_lab_act, );
            AsyncStorage.setItem( 'dft_mst_mat_act', data.data[i].dft_mst_mat_act, );
            AsyncStorage.setItem( 'dft_mst_con_act', data.data[i].dft_mst_con_act, );
            AsyncStorage.setItem( 'dft_mst_wko_pri', data.data[i].dft_mst_wko_pri, );
            AsyncStorage.setItem( 'dft_mst_temp_ast', data.data[i].dft_mst_temp_ast, );
            AsyncStorage.setItem( 'dft_mst_wko_asset_no', data.data[i].dft_mst_wko_asset_no, );
            AsyncStorage.setItem( 'dft_mst_wkr_asset_no', data.data[i].dft_mst_wkr_asset_no, );
            AsyncStorage.setItem( 'dft_mst_wo_default_cc', data.data[i].dft_mst_wo_default_cc, );
            AsyncStorage.setItem( 'dft_mst_time_card_by', data.data[i].dft_mst_time_card_by, );
            AsyncStorage.setItem( 'dft_mst_itm_resv', data.data[i].dft_mst_itm_resv, );
            AsyncStorage.setItem( 'dft_mst_mr_approval', data.data[i].dft_mst_mr_approval, );
            AsyncStorage.setItem( 'dft_mst_pur_email_approver', data.data[i].dft_mst_pur_email_approver, );
            AsyncStorage.setItem( 'dft_mst_mtr_email_approver', data.data[i].dft_mst_mtr_email_approver, );
            AsyncStorage.setItem( 'dft_mst_tim_act', data.data[i].dft_mst_tim_act, );
            AsyncStorage.setItem( 'dft_mst_gen_inv', data.data[i].dft_mst_gen_inv, );
            AsyncStorage.setItem( 'dft_mst_mbl_chk_cmp', data.data[i].dft_mst_mbl_chk_cmp, );
            AsyncStorage.setItem( 'dft_mst_mbl_chk_scan', data.data[i].dft_mst_mbl_chk_scan, );
            AsyncStorage.setItem('site_name', data.data[i].site_name);

            db.transaction(function (tx) {
              tx.executeSql(
                'INSERT INTO dft_mst (dft_mst_wko_sts ,dft_mst_lab_act ,dft_mst_mat_act ,dft_mst_con_act ,dft_mst_wko_pri ,dft_mst_temp_ast ,dft_mst_wko_asset_no ,dft_mst_wkr_asset_no,dft_mst_wo_default_cc ,dft_mst_time_card_by ,dft_mst_itm_resv ,dft_mst_mr_approval ,dft_mst_pur_email_approver ,dft_mst_mtr_email_approver ,dft_mst_tim_act,dft_mst_gen_inv,dft_mst_mbl_chk_cmp,dft_mst_mbl_chk_scan,site_name) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                [
                  data.data[i].dft_mst_wko_sts,
                  data.data[i].dft_mst_lab_act,
                  data.data[i].dft_mst_mat_act,
                  data.data[i].dft_mst_con_act,
                  data.data[i].dft_mst_wko_pri,
                  data.data[i].dft_mst_temp_ast,
                  data.data[i].dft_mst_wko_asset_no,
                  data.data[i].dft_mst_wkr_asset_no,
                  data.data[i].dft_mst_wo_default_cc,
                  data.data[i].dft_mst_time_card_by,
                  data.data[i].dft_mst_itm_resv,
                  data.data[i].dft_mst_mr_approval,
                  data.data[i].dft_mst_pur_email_approver,
                  data.data[i].dft_mst_mtr_email_approver,
                  data.data[i].dft_mst_tim_act,
                  data.data[i].dft_mst_gen_inv,
                  data.data[i].dft_mst_mbl_chk_cmp,
                  data.data[i].dft_mst_mbl_chk_scan,
                  data.data[i].site_name,
                ],
                (tx, results) => {
                  console.log( 'get_default_values Results_test', results.rowsAffected, );
                  if (results.rowsAffected > 0) {
                    insert_mobile_info();
                  } else {
                    setspinner(false);
                    setAlert(true, 'danger', 'Default value table failed');
                    //alert('INSERT TABLE dft_mst Failed');
                  }
                },
              );
            });

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
        console.log('Error :', error.message);
    });
    
  };

  const insert_mobile_info = async () => {

    var DateTime = moment().format('YYYY-MM-DD HH:mm');

    let brand = DeviceInfo.getBrand();

    let model = DeviceInfo.getModel();

    let dvc_id = DeviceInfo.getDeviceId();

    let EmpID = await AsyncStorage.getItem('emp_mst_empl_id');

    let token = await AsyncStorage.getItem('fcmToken');

    console.log('USE token' + token);
    console.log('USE EmpID' + EmpID);

    let mobile_info = {
      site_cd: site_cd,
      brand: brand,
      model: model,
      online: '1',
      last_user: EmpID,
      DateTime: DateTime,
      token: token,
      dvc_id: dvc_id,
    };


    console.log('USE DATA insert_mobile_info: ' + JSON.stringify(mobile_info));

    const requestOptions = {
      method: 'POST',
      body: JSON.stringify(mobile_info), // Convert the data to JSON format
    };

    fetch(`${Baseurl}/insert_mobile_info.php?`,requestOptions)
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
            navigation.replace('MainTabScreen');
        

        }else{
            setspinner(false);
            setAlert(true,'danger',data.message);
            return;
        }
    })
    .catch(error => {
        setspinner(false);
        setAlert(true,'danger',error.message);
        console.log('Error :', error.message);
    });

    
  };

  const get_url = async () => {
    let keys = [];
    try {
      keys = await AsyncStorage.clear();
    } catch (e) {
      console.log(e);
    }
    navigation.navigate('WebServices');
  };

  return (
    <DismissKeyboard>
      <View style={styles.container}>
        <ProgressLoader visible={spinner} isModal={true} isHUD={true} hudColor={'#808080'} color={'#FFFFFF'} />

        <SCLAlert theme={Theme} show={Show} title={Title}>
          <SCLAlertButton theme={Theme} onPress={() => setShow(false)}> OK </SCLAlertButton>
        </SCLAlert>

        <View style={styles.header}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Animatable.Image
              animation="bounceIn"
              duraton="1500"
              source={require('../images/logo.png.png')}
              style={styles.logo}
              resizeMode="stretch"
            />

            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 30, marginLeft: 10, }}> Evantage CMMS </Text>
          </View>
          <Text style={styles.text_header}></Text>
        </View>

        <Animatable.View
          animation="fadeInUpBig"
          style={[styles.footer, {backgroundColor: colors.background}]}>
          <View style={{alignItems: 'flex-end'}}>
            <Ionicons
              name="settings-outline"
              color={colors.text}
              onPress={get_url}
              size={30}
            />
          </View>

          <Text style={[styles.text_footer, {color: colors.text, marginTop: 20}]}> Username </Text>

          <View style={styles.action}>
            <FontAwesome name="user-o" color={colors.text} size={20} />

            <TextInput
              placeholder="Your Username"
              placeholderTextColor="#666666"
              style={[
                styles.textInput,
                {
                  color: colors.text,
                },
              ]}
              autoCapitalize="none"
              onChange={val => console.log('VAL' + val)}
              onChangeText={val => textInputChange(val)}
              onEndEditing={e => handleValidUser(e.nativeEvent.text)}
            />

            {data.check_textInputChange ? (
              <Animatable.View animation="bounceIn">
                <Feather name="check-circle" color="green" size={20} />
              </Animatable.View>
            ) : null}
          </View>

          {data.isValidUser ? null : (
            <Animatable.View animation="fadeInLeft" duration={500}>
              <Text style={styles.errorMsg}>
                Username must be 4 characters long.
              </Text>
            </Animatable.View>
          )}

          <Text style={[styles.text_footer, {color: colors.text, marginTop: 20}]}> Password </Text>

          <View style={styles.action}>
            <Feather name="lock" color={colors.text} size={20} />

            <TextInput
              placeholder="Your Password"
              placeholderTextColor="#666666"
              secureTextEntry={data.secureTextEntry ? true : false}
              style={[
                styles.textInput,
                {
                  color: colors.text,
                },
              ]}
              autoCapitalize="none"
              onFocus={() => get_default_site_cd(data.username)}
              onChangeText={val => handlePasswordChange(val)}
            />

            <TouchableOpacity onPress={updateSecureTextEntry}>
              {data.secureTextEntry ? (
                <Feather name="eye-off" color="grey" size={20} />
              ) : (
                <Feather name="eye" color="grey" size={20} />
              )}
            </TouchableOpacity>
          </View>

          {data.isValidPassword ? null : (
            <Animatable.View animation="fadeInLeft" duration={500}>
              <Text style={styles.errorMsg}>
                Password must be 8 characters long.
              </Text>
            </Animatable.View>
          )}

          <Text
            style={[styles.text_footer, {color: colors.text, marginTop: 20}]}>
            Site Code
          </Text>

          <View>
            <Dropdown
              style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
              data={sub}
              containerStyle={styles.containerStyle}
              maxHeight={300}
              labelField="label"
              valueField="value"
              selectedTextProps={{
                style: {
                  color: '#000',
                },
              }}
              placeholder={site_label ? site_label : 'Select site code'}
              itemTextStyle={{color: '#000'}}
              value={site_label}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                select_site_code(item.value);
              }}
            />
            {/* <RNPickerSelect
                            style={pickerStyles} 
                            useNativeAndroidPickerStyle={false}
                            onValueChange={(value) => select_site_code(value)}                                            
                            items={sub}
                            Icon={() => {
                                return <FontAwesome name="chevron-down" size={15} color= '#808080'style={{marginRight:25,marginTop:25}}/>;
                            }}

                        />                   */}

            {/* <Picker
                            onChanged={setPicker}
                            options={sub}
                            style={{fontSize: 16,
                            paddingVertical: 8,
                            paddingHorizontal: 10,
                            borderWidth: 1.5,
                            borderColor: '#42A5F5',
                            borderRadius: 5,
                            color: 'black',
                            marginTop:10,
                            marginLeft:10,
                            marginRight:10,
                            paddingRight: 30}}
                            value={site_cd}
                        /> */}
          </View>

          <View style={styles.button}>
            <TouchableOpacity
              style={styles.signIn}
              //loginHandle( data.username, data.password )
              onPress={() => {
                loginHandle(data.username, data.password);
              }}>
              <LinearGradient
                colors={['#2196f3', '#2196f3']}
                style={styles.signIn}>
                <Text style={[styles.textSign, {color: '#fff'}]}>Login</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* <TouchableOpacity
                        onPress={get_url}
                        style={[styles.signIn, {
                            borderColor: '#2196f3',
                            borderWidth: 1,
                            marginTop: 15
                        }]}>

                        <Text style={[styles.textSign, {
                            color: '#2196f3'
                        }]}>Switch URL Connection</Text>

                        </TouchableOpacity> */}

           
          </View>

          <View style={styles.version_style}>
            <Text style={{color: '#000', fontSize: 12}}> Version: {version} </Text>
          </View>
        </Animatable.View>

        
      </View>
    </DismissKeyboard>
  );
};

const {height} = Dimensions.get('screen');
const {width} = Dimensions.get('window');
const height_logo = height * 0.1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2196f3',
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 3,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 10,
    marginTop: 10,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 15,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2196f3',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  button: {
    alignItems: 'center',
    marginTop: 50,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textSign: {
    fontSize: 15,
    fontWeight: 'bold',
  },

  logo: {
    width: height_logo,
    height: height_logo,
  },

  model_cardview: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },

  dropdown: {
    marginTop: 10,
    width: '100%',
    height: 50,

    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingRight: 20,
    paddingLeft: 10,
  },

  containerStyle: {
    marginTop: 5,
  },
  version_style: {
    flexDirection: 'row',
    width: '100%',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },
});

const pickerStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1.5,
    borderColor: '#42A5F5',
    borderRadius: 5,
    color: 'black',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: '#42A5F5',
    borderRadius: 5,
    color: 'black',
    marginTop: 10,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default LoginScreen;
