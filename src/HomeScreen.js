import React from 'react';
import { View, Text, Alert, ScrollView, StyleSheet, Image, SafeAreaView, Modal,Dimensions,TouchableOpacity,Linking } from 'react-native';

import ProgressLoader from 'rn-progress-loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { openDatabase } from 'react-native-sqlite-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ToggleSwitch from 'toggle-switch-react-native';
import axios from 'react-native-axios';
import moment from 'moment';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert'
import Svg, { Path } from 'react-native-svg';
import { checkVersion } from "react-native-check-version";
import { PacmanIndicator} from 'react-native-indicators';
import RNExitApp from 'react-native-exit-app';
import {BarChart} from 'react-native-chart-kit';
import { BarChart as BarChat_two } from "react-native-gifted-charts";

import DeviceInfo from 'react-native-device-info';
import {useNetInfo} from "@react-native-community/netinfo";

var db = openDatabase({ name: 'CMMS.db' });
let Baseurl, Site_Cd, Site_dsc, WIFI, LoginID,EmpID, Welcome_Name, Site_Name;

const HomeScreen = ({ navigation,route }) => {

  const width = Dimensions.get('window').width;

  const [spinner, setspinner] = React.useState(false);
  const [online, setonline] = React.useState(true);
  const [ontext, setontext] = React.useState('Online');
  
  let [welcome, setwelcome] = React.useState('');
  let [sitecd, setsitecd] = React.useState('');
  let [site_name, setsite_name] = React.useState('');

  const [open_Perctage, setopen_Perctage] = React.useState(0);
  const [complete_Perctage, setcomplete_Perctage] = React.useState(0);
  const [close_Perctage, setclose_Perctage] = React.useState(0);

  const [Indicators_Visible, setIndicators_Visible ] = React.useState(false); 
  const [Indicators_step, setIndicators_step ] = React.useState(''); 
  const [Indicators_text, setIndicators_text ] = React.useState(''); 


  //Alert
  const [Show, setShow] = React.useState(false);
  const [Show_two, setShow_two] = React.useState(false);
  const [UpdateShow, setUpdateShow] = React.useState(false);
  const [Theme, setTheme] = React.useState('default');
  const [Title, setTitle] = React.useState('Title');
  const [Subtitle, setsubtitle] = React.useState('subtitle');
  const [Type, setType] = React.useState('');

  //chat
  const [week, setweek] = React.useState([]);
  const [per, setper] = React.useState([]);


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
    LoginID = await AsyncStorage.getItem('emp_mst_login_id');
    EmpID = await AsyncStorage.getItem('emp_mst_empl_id');
    Welcome_Name = await AsyncStorage.getItem('emp_mst_name');
    Site_Name = await AsyncStorage.getItem('site_name');
    WIFI = await AsyncStorage.getItem('WIFI');

    let dvc_id = DeviceInfo.getUniqueId();
    console.log(JSON.stringify(dvc_id));

    setwelcome(Welcome_Name);
    setsitecd(Site_Cd);
    setsite_name(Site_Name);

    console.log(WIFI);

    if (WIFI == 'OFFLINE') {
      setonline(false);
      setontext('Offline');

      Get_report_one()

    } else {
      setonline(true);
      setontext('Online');

      checkForUpdates()

    }
    
  };

  const checkForUpdates = (async() => {

    try{

      const version = await checkVersion();
      console.log("Got version info:", version);
      if (version.needsUpdate) {
          
       setAlert_update(true,'warning','Update CMMS?','CMMS recommends that you update to the latest version..');

        //Get_report_one();
              
      }else{

        Get_report_one();

      }

    }catch(error){
     
      setAlert(true,'danger',error,'');
      console.log({error})
    }
});
  

  // Step : 01
  const Get_report_one = async () => {

    setspinner(true);

    if (WIFI == 'OFFLINE') {

      db.transaction(function (txn) {

        txn.executeSql('select * from wko_mst  where wrk_sts_typ_cd =?', ['OPEN'], (tx, results) => {

          
          if (results.rows) {
            console.log('ALL WO', results.rows.length);
            setopen_Perctage(Number(results.rows.length));
          }else{
            setspinner(false);
            console.error('SQL Error:', tx.message);

          }
         

        });


        txn.executeSql("SELECT * FROM wko_mst WHERE wko_mst_due_date BETWEEN date('now') AND date('now', '+3 days')", [], (tx, results) => {
          if (results.rows) {
            console.log('Due WO', results.rows.length);
            setcomplete_Perctage(Number(results.rows.length));
          } else {
            setspinner(false);
            console.error('SQL Error:', tx.message);
          }
        });


        txn.executeSql("SELECT * FROM wko_mst WHERE  date(wko_mst_due_date)< date('now')", [], (tx, results) => {
          if (results.rows) {
            console.log('PAST WO', results.rows.length);
            setclose_Perctage(Number(results.rows.length));
          } else {
            setspinner(false);
            console.error('SQL Error:', tx.message);
          }
        });

      })


      Get_report_two();


    }else{

      console.log( 'PIECHART TWO' + `${Baseurl}/get_report_dashboard.php?site_cd=${Site_Cd}&emp_id=${EmpID}`);

      fetch(`${Baseurl}/get_report_dashboard.php?site_cd=${Site_Cd}&emp_id=${EmpID}`)
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

            setopen_Perctage(data.data[i].Opens);
            setcomplete_Perctage(Number(data.data[i].Due_in));
            setclose_Perctage(Number(data.data[i].Past));

          }

          Get_report_two();

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

      

    }

    
  };

  // Step : 02
  const Get_report_two = async () => {
    

    if (WIFI == 'OFFLINE') {


      db.transaction(function (txn) {

        txn.executeSql('select * from report_current_week', [], (tx, results) => {

          console.log('Get_report_two count', results.rows.length);
         
          setweek([])
          for (let i = 0; i < results.rows.length; ++i) {
            
            let t = results.rows.item(i).Total

            setweek(week=>[...week,{ 
              value: results.rows.item(i).Total,
              label: results.rows.item(i).DAY_NAME,
              frontColor: '#4ABFF4', 
              topLabelComponent: () => ( <Text style={{ marginBottom: 1, fontSize: 13, color: 'blue' }}>{t}</Text> )
            }]);

          }

         
          
          setspinner(false);
        

        });

      })

    }else{

      console.log( 'PIECHART TWO URL: ' + `${Baseurl}/get_report_wo_by_current_week.php?site_cd=${Site_Cd}&emp_id=${EmpID}`);

      fetch(`${Baseurl}/get_report_wo_by_current_week.php?site_cd=${Site_Cd}&emp_id=${EmpID}`)
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

          setweek([])
          

          for (let i = 0; i < data.data.length; ++i) {

            let t = data.data[i].Total

            setweek(week=>[...week,{ 
              value: data.data[i].Total,
              label: data.data[i].DAY_NAME,
              frontColor: '#4ABFF4', 
              topLabelComponent: () => ( <Text style={{ marginBottom: 1, fontSize: 13, color: 'blue' }}>{t}</Text> )
            }]);

           

          }

          
         

          db.transaction(function (txn) {
    
            txn.executeSql('SELECT * FROM costcenter', [], (tx, results) => {
              console.log('costcenter count', results.rows.length);
              if (results.rows.length > 0) {
                setspinner(false);
              } else {
                get_dropdown_ALL();
              }
  
            });
  
          });

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

      

    }

    
  };

  // Step : 03
  const get_dropdown_ALL= async () => {

   
    try {
     
      console.log( 'get_dropdown : ' + `${Baseurl}/get_dropdown.php?site_cd=${Site_Cd}&type=${'All'}&EmpID=${EmpID}&LoginID=${LoginID}`)
      const Dropdown = await fetch( `${Baseurl}/get_dropdown.php?site_cd=${Site_Cd}&type=${'All'}&EmpID=${EmpID}&LoginID=${LoginID}`);

      const responseJson = await Dropdown.json();

      if (responseJson.status === 'SUCCESS') {

        db.transaction(function (tx) {

          //01
          if (responseJson.data.CostCenter.length > 0) {

            db.transaction(function (tx) {
  
              let insertQuery = 'INSERT INTO costcenter (costcenter ,descs) VALUES';
              let values =[];
  
              responseJson.data.CostCenter.forEach((record, index)=>{
  
                insertQuery +='(?,?),';
                values.push(record.costcenter,record.descs);
  
                // console.log( 'lopp ',index, values);
  
                const batchSize = 20;
                if((index +1)% batchSize === 0 || index === responseJson.data.CostCenter.length -1){
  
  
                  insertQuery = insertQuery.slice(0,-1);
  
  
                  //console.log( 'lopp ',index, insertQuery);
  
                  tx.executeSql(insertQuery,values,(tx,results)=>{
  
                    if (results.rowsAffected > 0) {
                      console.log('INSERT TABLE CostCenter Successfully')
                    } else {
                      console.log('INSERT TABLE CostCenter unsuccessfully')
                    }
  
                  });
  
                  insertQuery = 'INSERT INTO costcenter (costcenter ,descs) VALUES';
                  values =[];
  
                }
  
              })
  
            })
  
          }

          //02
          if (responseJson.data.account.length > 0) {

            db.transaction(function (tx) {
  
              let insertQuery = 'INSERT INTO account (account ,descs) VALUES';
              let values =[];
  
              responseJson.data.account.forEach((record, index)=>{
  
                insertQuery +='(?,?),';
                values.push(record.account,record.descs);
  
                // console.log( 'lopp ',index, values);
  
                const batchSize = 20;
                if((index +1)% batchSize === 0 || index === responseJson.data.account.length -1){
  
  
                  insertQuery = insertQuery.slice(0,-1);
  
  
                  //console.log( 'lopp ',index, insertQuery);
  
                  tx.executeSql(insertQuery,values,(tx,results)=>{
  
                    if (results.rowsAffected > 0) {
                      console.log('INSERT TABLE account Successfully')
                    } else {
                      console.log('INSERT TABLE account unsuccessfully')
                    }
  
                  });
  
                  insertQuery = 'INSERT INTO account (account ,descs) VALUES ';
                  values =[];
  
                }
  
              })
  
            })
  
           
  
          }

          //03
          if (responseJson.data.FaultCode.length > 0) {

            db.transaction(function (tx) {
  
              let insertQuery = 'INSERT INTO faultcode (wrk_flt_fault_cd,wrk_flt_desc) VALUES';
              let values =[];
  
              responseJson.data.FaultCode.forEach((record, index)=>{
  
                insertQuery +='(?,?),';
                values.push(record.wrk_flt_fault_cd,record.wrk_flt_desc);
  
                // console.log( 'lopp ',index, values);
  
                const batchSize = 20;
                if((index +1)% batchSize === 0 || index === responseJson.data.FaultCode.length -1){
  
  
                  insertQuery = insertQuery.slice(0,-1);
  
  
                  //console.log( 'lopp ',index, insertQuery);
  
                  tx.executeSql(insertQuery,values,(tx,results)=>{
  
                    if (results.rowsAffected > 0) {
                      console.log('INSERT TABLE FaultCode Successfully')
                    } else {
                      console.log('INSERT TABLE FaultCode unsuccessfully')
                    }
  
                  });
  
                  insertQuery = 'INSERT INTO faultcode (wrk_flt_fault_cd ,wrk_flt_desc) VALUES';
                  values =[];
  
                }
  
              })
  
            })
  
            
            
  
          } 


          //04
          if (responseJson.data.Priority.length > 0) {

            db.transaction(function (tx) {
  
              let insertQuery = 'INSERT INTO priority (wrk_pri_desc ,wrk_pri_due_date_count ,wrk_pri_pri_cd ) VALUES';
              let values =[];
  
              responseJson.data.Priority.forEach((record, index)=>{
  
                insertQuery +='(?,?,?),';
                values.push(record.wrk_pri_desc,record.wrk_pri_due_date_count,record.wrk_pri_pri_cd);
  
                // console.log( 'lopp ',index, values);
  
                const batchSize = 20;
                if((index +1)% batchSize === 0 || index === responseJson.data.Priority.length -1){
  
  
                  insertQuery = insertQuery.slice(0,-1);
  
  
                  //console.log( 'lopp ',index, insertQuery);
  
                  tx.executeSql(insertQuery,values,(tx,results)=>{
  
                    if (results.rowsAffected > 0) {
                      console.log('INSERT TABLE Priority Successfully')
                    } else {
                      console.log('INSERT TABLE Priority unsuccessfully')
                    }
  
                  });
  
                  insertQuery = 'INSERT INTO priority (wrk_pri_desc ,wrk_pri_due_date_count ,wrk_pri_pri_cd ) VALUES';
                  values =[];
  
                }
  
              })
  
            })
  
            
            
            
          }

          //05
          if (responseJson.data.ActionCode.length > 0) {

            db.transaction(function (tx) {
  
              let insertQuery = 'INSERT INTO actioncode (wrk_act_action_cd ,wrk_act_desc) VALUES';
              let values =[];
  
              responseJson.data.ActionCode.forEach((record, index)=>{
  
                insertQuery +='(?,?),';
                values.push(record.wrk_act_action_cd,record.wrk_act_desc);
  
                // console.log( 'lopp ',index, values);
  
                const batchSize = 20;
                if((index +1)% batchSize === 0 || index === responseJson.data.ActionCode.length -1){
  
  
                  insertQuery = insertQuery.slice(0,-1);
  
  
                  //console.log( 'lopp ',index, insertQuery);
  
                  tx.executeSql(insertQuery,values,(tx,results)=>{
  
                    if (results.rowsAffected > 0) {
                      console.log('INSERT TABLE actioncode Successfully')
                    } else {
                      console.log('INSERT TABLE actioncode unsuccessfully')
                    }
  
                  });
  
                  insertQuery = 'INSERT INTO actioncode (wrk_act_action_cd ,wrk_act_desc) VALUES';
                  values =[];
  
                }
  
              })
  
            })
  
            
           
          } 


          //06
          if (responseJson.data.WorkArea.length > 0) {

            db.transaction(function (tx) {
  
              let insertQuery = 'INSERT INTO workarea (mst_war_desc ,mst_war_work_area) VALUES';
              let values =[];
  
              responseJson.data.WorkArea.forEach((record, index)=>{
  
                insertQuery +='(?,?),';
                values.push(record.mst_war_desc,record.mst_war_work_area);
  
                // console.log( 'lopp ',index, values);
  
                const batchSize = 20;
                if((index +1)% batchSize === 0 || index === responseJson.data.WorkArea.length -1){
  
  
                  insertQuery = insertQuery.slice(0,-1);
  
  
                  //console.log( 'lopp ',index, insertQuery);
  
                  tx.executeSql(insertQuery,values,(tx,results)=>{
  
                    if (results.rowsAffected > 0) {
                      console.log('INSERT TABLE workarea Successfully')
                    } else {
                      console.log('INSERT TABLE workarea unsuccessfully')
                    }
  
                  });
  
                  insertQuery = 'INSERT INTO workarea (mst_war_desc ,mst_war_work_area) VALUES';
                  values =[];
  
                }
  
              })
  
            })
  
           
            
            
          }


          //07
          if (responseJson.data.CasuseCode.length > 0) {

            db.transaction(function (tx) {
  
              let insertQuery = 'INSERT INTO casusecode (wrk_ccd_cause_cd ,wrk_ccd_desc) VALUES';
              let values =[];
  
              responseJson.data.CasuseCode.forEach((record, index)=>{
  
                insertQuery +='(?,?),';
                values.push(record.wrk_ccd_cause_cd,record.wrk_ccd_desc);
  
                // console.log( 'lopp ',index, values);
  
                const batchSize = 20;
                if((index +1)% batchSize === 0 || index === responseJson.data.CasuseCode.length -1){
  
  
                  insertQuery = insertQuery.slice(0,-1);
  
  
                  //console.log( 'lopp ',index, insertQuery);
  
                  tx.executeSql(insertQuery,values,(tx,results)=>{
  
                    if (results.rowsAffected > 0) {
                      console.log('INSERT TABLE casusecode Successfully')
                    } else {
                      console.log('INSERT TABLE casusecode unsuccessfully')
                    }
  
                  });
  
                  insertQuery = 'INSERT INTO casusecode (wrk_ccd_cause_cd ,wrk_ccd_desc) VALUES';
                  values =[];
  
                }
  
              })
  
            })
  
            
  
          }

          //08
          if (responseJson.data.WorkClass.length > 0) {

            db.transaction(function (tx) {
  
              let insertQuery = 'INSERT INTO workclass (wrk_cls_cls_cd ,wrk_cls_desc) VALUES';
              let values =[];
  
              responseJson.data.WorkClass.forEach((record, index)=>{
  
                insertQuery +='(?,?),';
                values.push(record.wrk_cls_cls_cd,record.wrk_cls_desc);
  
                // console.log( 'lopp ',index, values);
  
                const batchSize = 20;
                if((index +1)% batchSize === 0 || index === responseJson.data.WorkClass.length -1){
  
  
                  insertQuery = insertQuery.slice(0,-1);
  
  
                  //console.log( 'lopp ',index, insertQuery);
  
                  tx.executeSql(insertQuery,values,(tx,results)=>{
  
                    if (results.rowsAffected > 0) {
                      console.log('INSERT TABLE workclass Successfully')
                    } else {
                      console.log('INSERT TABLE workclass unsuccessfully')
                    }
  
                  });
  
                  insertQuery = 'INSERT INTO workclass (wrk_cls_cls_cd ,wrk_cls_desc) VALUES';
                  values =[];
  
                }
  
              })
  
            })
  
  
           
            
  
          }


          //09
          if (responseJson.data.wrk_group.length > 0) {

            db.transaction(function (tx) {
  
              let insertQuery = 'INSERT INTO wrk_group (wrk_grp_grp_cd ,wrk_grp_desc) VALUES';
              let values =[];
  
              responseJson.data.wrk_group.forEach((record, index)=>{
  
                insertQuery +='(?,?),';
                values.push(record.wrk_grp_grp_cd,record.wrk_grp_desc);
  
                // console.log( 'lopp ',index, values);
  
                const batchSize = 20;
                if((index +1)% batchSize === 0 || index === responseJson.data.wrk_group.length -1){
  
  
                  insertQuery = insertQuery.slice(0,-1);
  
  
                  //console.log( 'lopp ',index, insertQuery);
  
                  tx.executeSql(insertQuery,values,(tx,results)=>{
  
                    if (results.rowsAffected > 0) {
                      console.log('INSERT TABLE wrk_group Successfully')
                    } else {
                      console.log('INSERT TABLE wrk_group unsuccessfully')
                    }
  
                  });
  
                  insertQuery = 'INSERT INTO wrk_group (wrk_grp_grp_cd ,wrk_grp_desc) VALUES';
                  values =[];
  
                }
  
              })
  
            })
  
           
  
          }


          //10
          if (responseJson.data.WorkorderStatus.length > 0) {

            db.transaction(function (tx) {
  
              let insertQuery = 'INSERT INTO workorderstatus (wrk_sts_typ_cd ,wrk_sts_status ,wrk_sts_email_flag ,wrk_sts_desc,column1) VALUES';
              let values =[];
  
              responseJson.data.WorkorderStatus.forEach((record, index)=>{
  
                insertQuery +='(?,?,?,?,?),';
                values.push(record.wrk_sts_typ_cd,record.wrk_sts_status,record.wrk_sts_email_flag,record.wrk_sts_desc,'0');
  
                // console.log( 'lopp ',index, values);
  
                const batchSize = 20;
                if((index +1)% batchSize === 0 || index === responseJson.data.WorkorderStatus.length -1){
  
  
                  insertQuery = insertQuery.slice(0,-1);
  
  
                  //console.log( 'lopp ',index, insertQuery);
  
                  tx.executeSql(insertQuery,values,(tx,results)=>{
  
                    if (results.rowsAffected > 0) {
                      console.log('INSERT TABLE workorderstatus Successfully')
                    } else {
                      console.log('INSERT TABLE workorderstatus unsuccessfully')
                    }
  
                  });
  
                  insertQuery = 'INSERT INTO workorderstatus (wrk_sts_typ_cd ,wrk_sts_status ,wrk_sts_email_flag ,wrk_sts_desc,column1) VALUES ';
                  values =[];
  
                }
  
              })
  
            })
  
           
            
          }


          //11
          if (responseJson.data.WorkType.length > 0) {

            db.transaction(function (tx) {
  
              let insertQuery = 'INSERT INTO worktype (wrk_typ_typ_cd ,wrk_typ_desc ,wrk_typ_option ,wrk_typ_pm_option) VALUES';
              let values =[];
  
              responseJson.data.WorkType.forEach((record, index)=>{
  
                insertQuery +='(?,?,?,?),';
                values.push(

                  record.wrk_typ_typ_cd,
                  record.wrk_typ_desc,
                  record.wrk_typ_option,
                  record.wrk_typ_pm_option
                );
  
                // console.log( 'lopp ',index, values);
  
                const batchSize = 20;
                if((index +1)% batchSize === 0 || index === responseJson.data.WorkType.length -1){
  
  
                  insertQuery = insertQuery.slice(0,-1);
  
  
                  //console.log( 'lopp ',index, insertQuery);
  
                  tx.executeSql(insertQuery,values,(tx,results)=>{
  
                    if (results.rowsAffected > 0) {
                      console.log('INSERT TABLE worktype Successfully')
                    } else {
                      console.log('INSERT TABLE worktype unsuccessfully')
                    }
  
                  });
  
                  insertQuery = 'INSERT INTO worktype (wrk_typ_typ_cd ,wrk_typ_desc ,wrk_typ_option ,wrk_typ_pm_option) VALUES';
                  values =[];
  
                }
  
              })
  
            })

          }

          //12
          if (responseJson.data.Assetcode.length > 0) {
            db.transaction(function (tx) {
  
              let insertQuery = 'INSERT INTO assetcode (ast_cod_ast_cd ,ast_cod_desc) VALUES';
              let values =[];
  
              responseJson.data.Assetcode.forEach((record, index)=>{
  
                insertQuery +='(?,?),';
                values.push(
                  record.ast_cod_ast_cd,
                  record.ast_cod_desc
                  );
  
                // console.log( 'lopp ',index, values);
  
                const batchSize = 20;
                if((index +1)% batchSize === 0 || index === responseJson.data.Assetcode.length -1){
  
  
                  insertQuery = insertQuery.slice(0,-1);
  
  
                  //console.log( 'lopp ',index, insertQuery);
  
                  tx.executeSql(insertQuery,values,(tx,results)=>{
  
                    if (results.rowsAffected > 0) {
                      console.log('INSERT TABLE assetcode Successfully')
                    } else {
                      console.log('INSERT TABLE assetcode unsuccessfully')
                    }
  
                  });
  
                  insertQuery = 'INSERT INTO assetcode (ast_cod_ast_cd ,ast_cod_desc) VALUES';
                  values =[];
  
                }
  
              })
  
            })
          }

          //13
          if (responseJson.data.CriticalFactor.length > 0) {
            db.transaction(function (tx) {
  
              let insertQuery = 'INSERT INTO criticalfactor (ast_cri_cri_factor ,ast_cri_desc) VALUES';
              let values =[];
  
              responseJson.data.CriticalFactor.forEach((record, index)=>{
  
                insertQuery +='(?,?),';
                values.push(record.ast_cri_cri_factor,record.ast_cri_desc);
  
                // console.log( 'lopp ',index, values);
  
                const batchSize = 20;
                if((index +1)% batchSize === 0 || index === responseJson.data.CriticalFactor.length -1){
  
  
                  insertQuery = insertQuery.slice(0,-1);
  
  
                  //console.log( 'lopp ',index, insertQuery);
  
                  tx.executeSql(insertQuery,values,(tx,results)=>{
  
                    if (results.rowsAffected > 0) {
                      console.log('INSERT TABLE criticalfactor Successfully')
                    } else {
                      console.log('INSERT TABLE criticalfactor unsuccessfully')
                    }
  
                  });
  
                  insertQuery = 'INSERT INTO criticalfactor (ast_cri_cri_factor ,ast_cri_desc) VALUES';
                  values =[];
  
                }
  
              })
  
            })
          }

          //14
          if (responseJson.data.AssetGroupCode.length > 0) {

            db.transaction(function (tx) {
  
              let insertQuery = 'INSERT INTO assetgroupcode (ast_grp_grp_cd ,ast_grp_desc ,ast_grp_option) VALUES';
              let values =[];

              responseJson.data.AssetGroupCode.forEach((record, index)=>{

                insertQuery +='(?,?,?),';
                values.push(record.ast_grp_grp_cd,record.ast_grp_desc,record.ast_grp_option);

                // console.log( 'lopp ',index, values);

                const batchSize = 20;
                if((index +1)% batchSize === 0 || index === responseJson.data.AssetGroupCode.length -1){


                  insertQuery = insertQuery.slice(0,-1);


                  //console.log( 'lopp ',index, insertQuery);

                  tx.executeSql(insertQuery,values,(tx,results)=>{

                    if (results.rowsAffected > 0) {
                      console.log('INSERT TABLE AssetGroupCode Successfully')
                     
                    } else {
                      console.log('INSERT TABLE AssetGroupCode unsuccessfully')
                    }

                  });

                  insertQuery = 'INSERT INTO assetgroupcode (ast_grp_grp_cd ,ast_grp_desc ,ast_grp_option) VALUES';
                  values =[];

                }

              })
  
            })
          }

          //15
          if (responseJson.data.AssetLevel.length > 0) {
            db.transaction(function (tx) {
  
              let insertQuery = 'INSERT INTO assetlevel (ast_lvl_ast_lvl ,ast_lvl_desc) VALUES';
              let values =[];
  
              responseJson.data.AssetLevel.forEach((record, index)=>{
  
                insertQuery +='(?,?),';
                values.push(record.ast_lvl_ast_lvl,record.ast_lvl_desc);
  
                // console.log( 'lopp ',index, values);
  
                const batchSize = 20;
                if((index +1)% batchSize === 0 || index === responseJson.data.AssetLevel.length -1){
  
  
                  insertQuery = insertQuery.slice(0,-1);
  
  
                  //console.log( 'lopp ',index, insertQuery);
  
                  tx.executeSql(insertQuery,values,(tx,results)=>{
  
                    if (results.rowsAffected > 0) {
                      console.log('INSERT TABLE assetlevel Successfully')
                    } else {
                      console.log('INSERT TABLE assetlevel unsuccessfully')
                    }
  
                  });
  
                  insertQuery = 'INSERT INTO assetlevel (ast_lvl_ast_lvl ,ast_lvl_desc) VALUES';
                  values =[];
  
                }
  
              })
  
            })
          }

          //16
          if (responseJson.data.AssetLocation.length > 0) {
            db.transaction(function (tx) {
  
              let insertQuery = 'INSERT INTO assetlocation (ast_loc_ast_loc ,ast_loc_desc ,ast_loc_pm_option ,ast_loc_wo_option,ast_loc_wr_option) VALUES';
              let values =[];
  
              responseJson.data.AssetLocation.forEach((record, index)=>{
  
                insertQuery +='(?,?,?,?,?),';
                values.push(record.ast_loc_ast_loc,record.ast_loc_desc,record.ast_loc_pm_option,record.ast_loc_wo_option,record.ast_loc_wr_option);
  
                // console.log( 'lopp ',index, values);
  
                const batchSize = 20;
                if((index +1)% batchSize === 0 || index === responseJson.data.AssetLocation.length -1){
  
  
                  insertQuery = insertQuery.slice(0,-1);
  
  
                  //console.log( 'lopp ',index, insertQuery);
  
                  tx.executeSql(insertQuery,values,(tx,results)=>{
  
                    if (results.rowsAffected > 0) {
                      console.log('INSERT TABLE assetlocation Successfully')
                    } else {
                      console.log('INSERT TABLE assetlocation unsuccessfully')
                    }
  
                  });
  
                  insertQuery = 'INSERT INTO assetlocation (ast_loc_ast_loc ,ast_loc_desc ,ast_loc_pm_option ,ast_loc_wo_option,ast_loc_wr_option) VALUES';
                  values =[];
  
                }
  
              })
  
            })
          }

          //17
          if (responseJson.data.AssetStatus.length > 0) {
            db.transaction(function (tx) {
  
              let insertQuery = 'INSERT INTO assetstatus (ast_sts_status ,ast_sts_desc) VALUES';
              let values =[];
  
              responseJson.data.AssetStatus.forEach((record, index)=>{
  
                insertQuery +='(?,?),';
                values.push(record.ast_sts_status,record.ast_sts_desc);
  
                // console.log( 'lopp ',index, values);
  
                const batchSize = 20;
                if((index +1)% batchSize === 0 || index === responseJson.data.AssetStatus.length -1){
  
  
                  insertQuery = insertQuery.slice(0,-1);
  
  
                  //console.log( 'lopp ',index, insertQuery);
  
                  tx.executeSql(insertQuery,values,(tx,results)=>{
  
                    if (results.rowsAffected > 0) {
                      console.log('INSERT TABLE assetstatus Successfully')
                    } else {
                      console.log('INSERT TABLE assetstatus unsuccessfully')
                    }
  
                  });
  
                  insertQuery = 'INSERT INTO assetstatus (ast_sts_status ,ast_sts_desc) VALUES';
                  values =[];
  
                }
  
              })
  
            })
          }

          //18
          if (responseJson.data.AssetType.length > 0) {
            db.transaction(function (tx) {
  
              let insertQuery = 'INSERT INTO assettype (ast_type_cd ,ast_type_descs) VALUES';
              let values =[];
  
              responseJson.data.AssetType.forEach((record, index)=>{
  
                insertQuery +='(?,?),';
                values.push(record.ast_type_cd,record.ast_type_descs);
  
                // console.log( 'lopp ',index, values);
  
                const batchSize = 20;
                if((index +1)% batchSize === 0 || index === responseJson.data.AssetType.length -1){
  
  
                  insertQuery = insertQuery.slice(0,-1);
  
  
                  //console.log( 'lopp ',index, insertQuery);
  
                  tx.executeSql(insertQuery,values,(tx,results)=>{
  
                    if (results.rowsAffected > 0) {
                      console.log('INSERT TABLE assettype Successfully')
                    } else {
                      console.log('INSERT TABLE assettype unsuccessfully')
                    }
  
                  });
  
                  insertQuery = 'INSERT INTO assettype (ast_type_cd ,ast_type_descs) VALUES';
                  values =[];
  
                }
  
              })
  
            })
          }

          //19
          if (responseJson.data.Employee.length > 0) {
            db.transaction(function (tx) {
  
              let insertQuery = 'INSERT INTO employee (emp_mst_empl_id ,emp_mst_name ,emp_mst_emg_phone ,emp_ls1_charge_rate ,emp_det_craft ,emp_mst_title ) VALUES';
              let values =[];
  
              responseJson.data.Employee.forEach((record, index)=>{
  
                insertQuery +='(?,?,?,?,?,?),';
                values.push(record.emp_mst_empl_id,record.emp_mst_name,record.emp_mst_emg_phone,record.emp_ls1_charge_rate,record.emp_det_craft,record.emp_mst_title);
  
                // console.log( 'lopp ',index, values);
  
                const batchSize = 20;
                if((index +1)% batchSize === 0 || index === responseJson.data.Employee.length -1){
  
  
                  insertQuery = insertQuery.slice(0,-1);
  
  
                  //console.log( 'lopp ',index, insertQuery);
  
                  tx.executeSql(insertQuery,values,(tx,results)=>{
  
                    if (results.rowsAffected > 0) {
                      console.log('INSERT TABLE employee Successfully')
                    } else {
                      console.log('INSERT TABLE employee unsuccessfully')
                    }
  
                  });
  
                  insertQuery = 'INSERT INTO employee (emp_mst_empl_id ,emp_mst_name ,emp_mst_emg_phone ,emp_ls1_charge_rate ,emp_det_craft ,emp_mst_title ) VALUES';
                  values =[];
  
                }
  
              })
  
            })
          }

          //20
          if (responseJson.data.Auto_Numnering.length > 0) {
            db.transaction(function (tx) {
  
              let insertQuery = 'INSERT INTO auto_numnering (cnt_mst_module_cd ,cnt_mst_numbering ,cnt_mst_option ) VALUES';
              let values =[];
  
              responseJson.data.Auto_Numnering.forEach((record, index)=>{
  
                insertQuery +='(?,?,?),';
                values.push(record.cnt_mst_module_cd,record.cnt_mst_numbering,record.cnt_mst_option);
  
                // console.log( 'lopp ',index, values);
  
                const batchSize = 20;
                if((index +1)% batchSize === 0 || index === responseJson.data.Auto_Numnering.length -1){
  
  
                  insertQuery = insertQuery.slice(0,-1);
  
  
                  //console.log( 'lopp ',index, insertQuery);
  
                  tx.executeSql(insertQuery,values,(tx,results)=>{
  
                    if (results.rowsAffected > 0) {
                      console.log('INSERT TABLE auto_numnering Successfully')
                    } else {
                      console.log('INSERT TABLE auto_numnering unsuccessfully')
                    }
  
                  });
  
                  insertQuery = 'INSERT INTO auto_numnering (cnt_mst_module_cd ,cnt_mst_numbering ,cnt_mst_option ) VALUES ';
                  values =[];
  
                }
  
              })
  
            })
          }

          //21
          if (responseJson.data.Wko_Auto_numbering.length > 0) {
            db.transaction(function (tx) {
  
              let insertQuery = 'INSERT INTO wko_auto_numbering (cnt_mst_module_cd ,cnt_mst_numbering ,cnt_mst_option ) VALUES';
              let values =[];
  
              responseJson.data.Wko_Auto_numbering.forEach((record, index)=>{
  
                insertQuery +='(?,?,?),';
                values.push(record.cnt_mst_module_cd,record.cnt_mst_numbering,record.cnt_mst_option);
  
                // console.log( 'lopp ',index, values);
  
                const batchSize = 20;
                if((index +1)% batchSize === 0 || index === responseJson.data.Wko_Auto_numbering.length -1){
  
  
                  insertQuery = insertQuery.slice(0,-1);
  
  
                  //console.log( 'lopp ',index, insertQuery);
  
                  tx.executeSql(insertQuery,values,(tx,results)=>{
  
                    if (results.rowsAffected > 0) {
                      console.log('INSERT TABLE wko_auto_numbering Successfully')
                    } else {
                      console.log('INSERT TABLE wko_auto_numbering unsuccessfully')
                    }
  
                  });
  
                  insertQuery = 'INSERT INTO wko_auto_numbering (cnt_mst_module_cd ,cnt_mst_numbering ,cnt_mst_option ) VALUES';
                  values =[];
  
                }
  
              })
  
            })
          }

          //22
          if (responseJson.data.Wkr_Auto_numbering.length > 0) {
            db.transaction(function (tx) {
  
              let insertQuery = 'INSERT INTO Wkr_Auto_numbering (cnt_mst_module_cd ,cnt_mst_numbering ,cnt_mst_option ) VALUES';
              let values =[];
  
              responseJson.data.Wkr_Auto_numbering.forEach((record, index)=>{
  
                insertQuery +='(?,?,?),';
                values.push(record.cnt_mst_module_cd,record.cnt_mst_numbering,record.cnt_mst_option);
  
                // console.log( 'lopp ',index, values);
  
                const batchSize = 20;
                if((index +1)% batchSize === 0 || index === responseJson.data.Wkr_Auto_numbering.length -1){
  
  
                  insertQuery = insertQuery.slice(0,-1);
  
  
                  //console.log( 'lopp ',index, insertQuery);
  
                  tx.executeSql(insertQuery,values,(tx,results)=>{
  
                    if (results.rowsAffected > 0) {
                      console.log('INSERT TABLE Wkr_Auto_numbering Successfully')
                    } else {
                      console.log('INSERT TABLE Wkr_Auto_numbering unsuccessfully')
                    }
  
                  });
  
                  insertQuery = 'INSERT INTO Wkr_Auto_numbering (cnt_mst_module_cd ,cnt_mst_numbering ,cnt_mst_option ) VALUES';
                  values =[];
  
                }
  
              })
  
            })
          }

          //23
          if (responseJson.data.RatingQuestion.length > 0) {
            db.transaction(function (tx) {
  
              let insertQuery = 'INSERT INTO ratingquestion (column_name,language_cd ,table_name ,default_label,customize_label ,default_header ,customize_header ,cfr_flag ,cf_label_required ) VALUES';
              let values =[];
  
              responseJson.data.RatingQuestion.forEach((record, index)=>{
  
                insertQuery +='(?,?,?,?,?,?,?,?,?),';
                values.push(
                  record.column_name,
                  record.language_cd,
                  record.table_name,
                  record.default_label,
                  record.customize_label,
                  record.default_header,
                  record.customize_header,
                  record.cfr_flag,
                  record.cf_label_required,
                );
 
                // console.log( 'lopp ',index, values);
  
                const batchSize = 20;
                if((index +1)% batchSize === 0 || index === responseJson.data.RatingQuestion.length -1){
  
  
                  insertQuery = insertQuery.slice(0,-1);
  
  
                  //console.log( 'lopp ',index, insertQuery);
  
                  tx.executeSql(insertQuery,values,(tx,results)=>{
  
                    if (results.rowsAffected > 0) {
                      console.log('INSERT TABLE ratingquestion Successfully')
                    } else {
                      console.log('INSERT TABLE ratingquestion unsuccessfully')
                    }
  
                  });
  
                  insertQuery = 'INSERT INTO ratingquestion (column_name,language_cd ,table_name ,default_label,customize_label ,default_header ,customize_header ,cfr_flag ,cf_label_required ) VALUES';
                  values =[];
  
                }
  
              })
  
            })
          }

          //24
          if (responseJson.data.MRStockno.length > 0) {
            db.transaction(function (tx) {
  
              let insertQuery = 'INSERT INTO mrstockno (RowID, itm_mst_stockno, itm_mst_costcenter, itm_mst_mstr_locn, itm_mst_desc, itm_mst_issue_price, itm_mst_ttl_oh, itm_det_part_deac_status, itm_det_order_pt, itm_det_ttl_oh, category, itm_mst_issue_uom, itm_mst_account, itm_mst_ext_desc,itm_mst_partno) VALUES';
              let values =[];
  
              responseJson.data.MRStockno.forEach((record, index)=>{
  
                insertQuery +='(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?),';
                values.push(
                  record.RowID,
                  record.itm_mst_stockno,
                  record.itm_mst_costcenter,
                  record.itm_mst_mstr_locn,
                  record.itm_mst_desc,
                  record.itm_mst_issue_price,
                  record.itm_mst_ttl_oh,
                  record.itm_det_part_deac_status,
                  record.itm_det_order_pt,
                  record.itm_det_ttl_oh,
                  record.category,
                  record.itm_mst_issue_uom,
                  record.itm_mst_account,
                  record.itm_mst_ext_desc,
                  record.itm_mst_partno,
                );
  
                // console.log( 'lopp ',index, values);
  
                const batchSize = 20;
                if((index +1)% batchSize === 0 || index === responseJson.data.MRStockno.length -1){
  
  
                  insertQuery = insertQuery.slice(0,-1);
  
  
                  //console.log( 'lopp ',index, insertQuery);
  
                  tx.executeSql(insertQuery,values,(tx,results)=>{
  
                    if (results.rowsAffected > 0) {
                      console.log('INSERT TABLE mrstockno Successfully')
                    } else {
                      console.log('INSERT TABLE mrstockno unsuccessfully')
                    }
  
                  });
  
                  insertQuery = 'INSERT INTO mrstockno (RowID, itm_mst_stockno, itm_mst_costcenter, itm_mst_mstr_locn, itm_mst_desc, itm_mst_issue_price, itm_mst_ttl_oh, itm_det_part_deac_status, itm_det_order_pt, itm_det_ttl_oh, category, itm_mst_issue_uom, itm_mst_account, itm_mst_ext_desc,itm_mst_partno) VALUES';
                  values =[];
  
                }
  
              })
  
            })
          }

          //25
          if (responseJson.data.HoursType.length > 0) {
            db.transaction(function (tx) {
  
              let insertQuery = 'INSERT INTO hourstype (hours_type_cd ,hours_type_multiplier,hours_type_adder) VALUES';
              let values =[];
  
              responseJson.data.HoursType.forEach((record, index)=>{
  
                insertQuery +='(?,?,?),';
                values.push(record.hours_type_cd,record.hours_type_multiplier,record.hours_type_adder);
  
                // console.log( 'lopp ',index, values);
  
                const batchSize = 20;
                if((index +1)% batchSize === 0 || index === responseJson.data.HoursType.length -1){
  
  
                  insertQuery = insertQuery.slice(0,-1);
  
  
                  //console.log( 'lopp ',index, insertQuery);
  
                  tx.executeSql(insertQuery,values,(tx,results)=>{
  
                    if (results.rowsAffected > 0) {
                      console.log('INSERT TABLE hourstype Successfully')
                    } else {
                      console.log('INSERT TABLE hourstype unsuccessfully')
                    }
  
                  });
  
                  insertQuery = 'INSERT INTO hourstype (hours_type_cd ,hours_type_multiplier,hours_type_adder) VALUES';
                  values =[];
  
                }
  
              })
  
            })
          }

          //26
          if (responseJson.data.TimeCraft.length > 0) {
            db.transaction(function (tx) {
  
              let insertQuery = 'INSERT INTO TimeCraft (emp_mst_empl_id ,emp_ls1_craft,emp_ls1_charge_rate) VALUES';
              let values =[];
  
              responseJson.data.TimeCraft.forEach((record, index)=>{
  
                insertQuery +='(?,?,?),';
                values.push(record.emp_mst_empl_id,record.emp_ls1_craft,record.emp_ls1_charge_rate);
  
                // console.log( 'lopp ',index, values);
  
                const batchSize = 20;
                if((index +1)% batchSize === 0 || index === responseJson.data.TimeCraft.length -1){
  
  
                  insertQuery = insertQuery.slice(0,-1);
  
  
                  //console.log( 'lopp ',index, insertQuery);
  
                  tx.executeSql(insertQuery,values,(tx,results)=>{
  
                    if (results.rowsAffected > 0) {
                      console.log('INSERT TABLE TimeCraft Successfully')
                    } else {
                      console.log('INSERT TABLE TimeCraft unsuccessfully')
                    }
  
                  });
  
                  insertQuery = 'INSERT INTO TimeCraft (emp_mst_empl_id ,emp_ls1_craft,emp_ls1_charge_rate) VALUES';
                  values =[];
  
                }
  
              })
  
            })
          }

          //27
          if (responseJson.data.supplier.length > 0) {
            db.transaction(function (tx) {
  
              let insertQuery = 'INSERT INTO supplier (sup_mst_supplier_cd ,sup_mst_desc ,sup_mst_status) VALUES';
              let values =[];
  
              responseJson.data.supplier.forEach((record, index)=>{
  
                insertQuery +='(?,?,?),';
                values.push(record.sup_mst_supplier_cd,record.sup_mst_desc,record.sup_mst_status);
  
                // console.log( 'lopp ',index, values);
  
                const batchSize = 20;
                if((index +1)% batchSize === 0 || index === responseJson.data.supplier.length -1){
  
  
                  insertQuery = insertQuery.slice(0,-1);
  
  
                  //console.log( 'lopp ',index, insertQuery);
  
                  tx.executeSql(insertQuery,values,(tx,results)=>{
  
                    if (results.rowsAffected > 0) {
                      console.log('INSERT TABLE supplier Successfully')
                    } else {
                      console.log('INSERT TABLE supplier unsuccessfully')
                    }
  
                  });
  
                  insertQuery = 'INSERT INTO supplier (sup_mst_supplier_cd ,sup_mst_desc ,sup_mst_status) VALUES';
                  values =[];
  
                }
  
              })
  
            })
          }

          //28
          if (responseJson.data.uom.length > 0) {
            db.transaction(function (tx) {
  
              let insertQuery = 'INSERT INTO uom (uom_mst_uom ,uom_mst_desc) VALUES';
              let values =[];
  
              responseJson.data.uom.forEach((record, index)=>{
  
                insertQuery +='(?,?),';
                values.push(record.uom_mst_uom,record.uom_mst_desc);
  
                // console.log( 'lopp ',index, values);
  
                const batchSize = 20;
                if((index +1)% batchSize === 0 || index === responseJson.data.uom.length -1){
  
  
                  insertQuery = insertQuery.slice(0,-1);
  
  
                  //console.log( 'lopp ',index, insertQuery);
  
                  tx.executeSql(insertQuery,values,(tx,results)=>{
  
                    if (results.rowsAffected > 0) {
                      console.log('INSERT TABLE uom Successfully')
                    } else {
                      console.log('INSERT TABLE uom unsuccessfully')
                    }
  
                  });
  
                  insertQuery = 'INSERT INTO uom (uom_mst_uom ,uom_mst_desc) VALUES';
                  values =[];
  
                }
  
              })
  
            })
          }

          //29
          if (responseJson.data.tax_cd.length > 0) {
            db.transaction(function (tx) {
  
              let insertQuery = 'INSERT INTO tax_cd (tax_mst_tax_cd ,tax_mst_desc ,tax_mst_tax_rate) VALUES';
              let values =[];
  
              responseJson.data.tax_cd.forEach((record, index)=>{
  
                insertQuery +='(?,?,?),';
                values.push(record.tax_mst_tax_cd,record.tax_mst_desc,record.tax_mst_tax_rate);
  
                // console.log( 'lopp ',index, values);
  
                const batchSize = 20;
                if((index +1)% batchSize === 0 || index === responseJson.data.tax_cd.length -1){
  
  
                  insertQuery = insertQuery.slice(0,-1);
  
  
                  //console.log( 'lopp ',index, insertQuery);
  
                  tx.executeSql(insertQuery,values,(tx,results)=>{
  
                    if (results.rowsAffected > 0) {
                      console.log('INSERT TABLE tax_cd Successfully')
                    } else {
                      console.log('INSERT TABLE tax_cd unsuccessfully')
                    }
  
                  });
  
                  insertQuery = 'INSERT INTO tax_cd (tax_mst_tax_cd ,tax_mst_desc ,tax_mst_tax_rate) VALUES';
                  values =[];
  
                }
  
              })
  
            })
          }

          //30
          if (responseJson.data.Approvel_WorkOrderstatus.length > 0) {

            db.transaction(function (tx) {
  
              let insertQuery = 'INSERT INTO approve_workorderstatus (wrk_sts_typ_cd ,wrk_sts_desc ,wrk_sts_status,wrk_sts_email_flag) VALUES';
              let values =[];
  
              responseJson.data.Approvel_WorkOrderstatus.forEach((record, index)=>{
  
                insertQuery +='(?,?,?,?),';
                values.push(record.wrk_sts_typ_cd,record.wrk_sts_desc,record.wrk_sts_status,record.wrk_sts_email_flag);
  
                // console.log( 'lopp ',index, values);
  
                const batchSize = 20;
                if((index +1)% batchSize === 0 || index === responseJson.data.Approvel_WorkOrderstatus.length -1){
  
  
                  insertQuery = insertQuery.slice(0,-1);
  
  
                  //console.log( 'lopp ',index, insertQuery);
  
                  tx.executeSql(insertQuery,values,(tx,results)=>{
  
                    if (results.rowsAffected > 0) {
                      console.log('INSERT TABLE approve_workorderstatus Successfully')
                    } else {
                      console.log('INSERT TABLE approve_workorderstatus unsuccessfully')
                    }
  
                  });
  
                  insertQuery = 'INSERT INTO approve_workorderstatus (wrk_sts_typ_cd ,wrk_sts_desc ,wrk_sts_status,wrk_sts_email_flag) VALUES';
                  values =[];
  
                }
  
              })
  
            })
          }

          //31
          if (responseJson.data.Assign_Employee.length > 0) {
            db.transaction(function (tx) {
  
              let insertQuery = 'INSERT INTO assign_employee (emp_mst_empl_id ,emp_mst_name ,emp_mst_emg_phone ,emp_ls1_charge_rate ,emp_det_craft ,emp_mst_title,WOASSIGN ) VALUES';
              let values =[];
  
              responseJson.data.Assign_Employee.forEach((record, index)=>{
  
                insertQuery +='(?,?,?,?,?,?,?),';
                values.push(
                  record.emp_mst_empl_id,
                  record.emp_mst_name,
                  record.emp_mst_emg_phone,
                  record.emp_ls1_charge_rate,
                  record.emp_det_craft,
                  record.emp_mst_title,
                  record.WOASSIGN,
                );
  
                // console.log( 'lopp ',index, values);
  
                const batchSize = 20;
                if((index +1)% batchSize === 0 || index === responseJson.data.Assign_Employee.length -1){
  
  
                  insertQuery = insertQuery.slice(0,-1);
  
  
                  //console.log( 'lopp ',index, insertQuery);
  
                  tx.executeSql(insertQuery,values,(tx,results)=>{
  
                    if (results.rowsAffected > 0) {
                      console.log('INSERT TABLE assign_employee Successfully')
                    } else {
                      console.log('INSERT TABLE assign_employee unsuccessfully')
                    }
  
                  });
  
                  insertQuery = 'INSERT INTO assign_employee (emp_mst_empl_id ,emp_mst_name ,emp_mst_emg_phone ,emp_ls1_charge_rate ,emp_det_craft ,emp_mst_title,WOASSIGN ) VALUES';
                  values =[];
  
                }
  
              })
  
            })


          }

          //32
          if (responseJson.data.Dashbord_menu.length > 0) {
            db.transaction(function (tx) {
  
              let insertQuery = 'INSERT INTO cf_menu (object_name,object_descs,exe_flag,new_flag,edit_flag,column1,mobile_object_type,cf_menu_seq) VALUES';
              let values =[];
  
              responseJson.data.Dashbord_menu.forEach((record, index)=>{
  
                insertQuery +='(?,?,?,?,?,?,?,?),';
                values.push( 
                  record.object_name,
                  record.object_descs,
                  record.exe_flag,
                  record.new_flag,
                  record.edit_flag,
                  record.column1,
                  record.mobile_object_type,
                  record.cf_menu_seq
                );
  
                 //console.log( 'lopp ',index, values);
  
                const batchSize = 20;
                if((index +1)% batchSize === 0 || index === responseJson.data.Dashbord_menu.length -1){
  
  
                  insertQuery = insertQuery.slice(0,-1);
  
  
                  //console.log( 'lopp ',index, insertQuery);
  
                  tx.executeSql(insertQuery,values,(tx,results)=>{
  
                    if (results.rowsAffected > 0) {
                      console.log('INSERT TABLE Dashbord_menu Successfully')
                    } else {
                      console.log('INSERT TABLE Dashbord_menu unsuccessfully')
                    }
  
                  });
  
                  insertQuery = 'INSERT INTO cf_menu (object_name,object_descs,exe_flag,new_flag,edit_flag,column1,mobile_object_type,cf_menu_seq) VALUES';
                  values =[];
  
                }
  
              })
  
            })


           
          }


          setspinner(false);

        })

      }else {
        setspinner(false);
        setAlert(true,'danger',response.data.message,'');
        //alert(responseJson.data.message);
      }
    } catch (error) {
      setspinner(false);
      alert(error);
    }
  };


  //Quick Action on click 
  const get_MyworkOrder = value => {
    // console.warn(value)
    if (value === 'MyWorkOrder') {
      navigation.navigate('WorkOrderListing', { Screenname: 'MyWorkOrder' });
    } else if (value === 'ScanAsset') {
      navigation.navigate('ScanAssetScreen', { Screenname: 'ScanAssetScreen' });
    } else if (value === 'NewWorkORder') {
      navigation.navigate('CreateWorkOrder', { Screenname: 'CreateWorkOrder' });
    } else if (value === 'MyWorkRequest') {
      navigation.navigate('WorkRequestListing', { Screenname: 'MyWR' });
    } else if (value === 'WO_Dashboard') {
      navigation.navigate('WODashboard', { Screenname: 'WODashboard' });
    } else if (value === 'MYWO_Dashboard_Due') {
      navigation.navigate('Test', { Screenname: 'MyWorkOrder' });
      //navigation.navigate('WorkOrderListing', { Screenname: 'MyWorkOrder' });
    } else if (value === 'MYWO_Dashboard_Past') {
      navigation.navigate('WorkOrderListing', { Screenname: 'MYWO_Dashboard_Past' });
    }
  };

  const logout = () => {

    // navigation.navigate('Test')

    if (WIFI == 'OFFLINE') {
      
      setAlert_two(true,'info','Please switch to online mode before you want to logout...','Offline');
    } else {

      setAlert_two(true,'info','Do you confirm to logout?','Online');

    }

    
  };

  const Alret_onClick =(D) =>{

    if(D === 'Online'){

      setShow_two(false);
      delete_data();

    }else if(D === 'Logout'){

      
      delete_data_nonetwork()



    }else{

      setShow_two(false);
      navigation.navigate('SyncingData')

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
        console.log('Error :', data.message);
        return;
          
      }

    })
    .catch(error => {
      setspinner(false);
      setAlert(true, 'danger', error.message +' forcefully logout the app', 'Logout');
      console.log('Error :', error.message);
    });

  };

  

  const setoffline = value => {
    setonline(value);

    if (value) {
      setontext('Online');
      navigation.navigate('SyncingData');
    } else {
      setontext('Offline');
      navigation.navigate('SyncingData');
    }
  };

  const setAlert =(show,theme,title,type)=>{

    setShow(show);
    setTheme(theme);
    setTitle(title);
    setType(type);
    

  };

  const setAlert_two =(show,theme,title,type)=>{

    setShow_two(show);
    setTheme(theme);
    setTitle(title);
    setType(type);

  };

  const setAlert_update =(show,theme,title,subtitle)=>{

    setUpdateShow(show);
    setTheme(theme);
    setTitle(title);
    setsubtitle(subtitle);

  };



  const chartConfigs = [
    {
      backgroundColor: '#ffffff',
      backgroundGradientFrom: '#ffffff',
      backgroundGradientTo: '#ffffff',
      fillShadowGradient: '#1E90FF',
      fillShadowGradientOpacity: '5',
      color: (opacity = 1) => `rgba(33, 47, 60, ${opacity})`,
      strokeWidth: 2,
    },
  ];

  const data = {
    labels: week,
    datasets: [
      {
        data: per,
      },
    ],
  };


  const setupdate = () => {
    
    setUpdateShow(false)

    if(Platform.OS === 'android'){

      Linking.openURL("https://play.google.com/store/apps/details?id=com.evantage.cmmshybrid&hl=us");
      RNExitApp.exitApp();

    }else{

    }
    
  };



  return (
    <View style={styles.container}>

      <ProgressLoader visible={spinner} isModal={true} isHUD={true} hudColor={'#808080'} color={'#FFFFFF'} />

      <SCLAlert theme={Theme} show={Show} title={Title} >
        <SCLAlertButton theme={Theme}   onPress={()=>Alret(Type)}>OK</SCLAlertButton>
      </SCLAlert>

      <SCLAlert theme={Theme} show={Show_two} title={Title} >
        <SCLAlertButton theme={Theme}  onPress={()=>Alret_onClick(Type)}>Yes</SCLAlertButton>
        <SCLAlertButton theme="default" onPress={()=>setShow_two(false)}>No</SCLAlertButton>
      </SCLAlert>

      <SCLAlert theme={Theme} show={UpdateShow} title={Title} subtitle={Subtitle}>
        <SCLAlertButton theme={Theme} onPress={()=>setupdate()}>Update</SCLAlertButton>
      </SCLAlert>

      

      <Modal
          animationType="slide"
          transparent={true}
          visible={Indicators_Visible}
          onRequestClose={()=>{
             
              setIndicators_Visible(!Indicators_Visible)}}>
          
        <View style={styles.model_cardview}>

            <View style={{backgroundColor:'#FFFFFF',margin: 20,height:200, borderRadius:20}}>           
                <Text style={{fontSize: 20, marginTop: 20, color: '##FFF', fontWeight: 'bold', textAlign:'center'}}> Step: {Indicators_step} </Text>
                <Text style={{fontSize: 16, marginTop: 30, color: '#0096FF', fontWeight: 'bold', textAlign:'center'}}> {Indicators_text} </Text>
                <View style={{justifyContent: 'center',marginTop:50}}>

                  <PacmanIndicator color='#2ECC71' size={70}/>
                
                </View>
            </View>
        </View>
      
      </Modal>

    

      <SafeAreaView style={styles.View_01}>

        <View style={{ backgroundColor: '#42A5F5', height: 170 }}>
            <Svg
              height="70%"
              width="100%"
              viewBox="0 0 1440 320"
              style={{ position: 'absolute', top: 130 }}
            >
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
                <AntDesign
                  name="logout"
                  color="#FFF"
                  size={25}
                  style={{marginRight: 10, marginTop: 4}}
                  onPress={() => logout()}
                  />
              </View>

            </View>

            <View style={{ marginLeft: 10, marginTop: 4 }}>
              <ToggleSwitch
                isOn={online}
                onColor="green"
                offColor="red"
                label={ontext}
                labelStyle={{ color: '#fff', fontWeight: '900' }}
                size="medium"
                onToggle={isOn => setoffline(isOn)}
              />
            </View>

            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center',marginTop: 5,}}>
              <Text style={styles.text_stytle_ta}>{'Welcome, ' + welcome}</Text>

              <Text style={styles.text_stytle_ta}>{site_name}</Text>
            </View> 
        </View>
        {/* <View style={styles.view_tab}>
          <View style={{ flexDirection: 'row' }}>
            <Image
              style={styles.image_ta}
              source={require('../images/logo.png.png')}
            />

            <Text style={styles.text_stytle_ta}>{'Evantage C M M S'}</Text>
          </View>

          <View>
            <AntDesign
              name="logout"
              color="#FFF"
              size={25}
              style={{ marginRight: 15, marginTop: 4 }}
              onPress={() => logout()}
            />
          </View>
        </View>

        <View style={{ marginLeft: 10, marginTop: 4 }}>
          <ToggleSwitch
            isOn={online}
            onColor="green"
            offColor="red"
            label={ontext}
            labelStyle={{ color: '#fff', fontWeight: '900' }}
            size="medium"
            onToggle={isOn => setoffline(isOn)}
          />
        </View>

        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={styles.text_stytle_ta}>{'Welcome, ' + welcome}</Text>

          <Text style={styles.text_stytle_ta}>{site_name}</Text>
        </View> */}
      </SafeAreaView>

      <View>
        <Text style={{ marginTop: 50, marginLeft: 15, color: '#05375a', fontWeight: 'bold', }}> Quick Action </Text>
      </View>
      <View style={{ paddingTop: Platform.OS === 'ios' ? 5 : 5, flex: 1 }}>
        {!online ? 
        (
          <View  style={{ padding: 5, borderRadius: 20, backgroundColor: '#fff', margin: 10, }}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                style={{ justifyContent: 'center', alignItems: 'center', margin: 10, }} onPress={() => get_MyworkOrder('MyWorkOrder')}>
                <View style={styles.card_view}>
                <Image style={{ width: 25, height: 20 }} source={require('../images/history.png')} />
                </View>

                <Text style={styles.textCenter}>My Work Order</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ margin: 10, justifyContent: 'center', alignItems: 'center', }} onPress={() => get_MyworkOrder('NewWorkORder')}>
                <View style={styles.card_view}>
                <Image style={{ width: 30, height: 30 }} source={require('../images/newwok.png')} />
                </View>

                <Text style={styles.textCenter}>New Work Order</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        ) : 
        (
          <View style={{ padding: 5, borderRadius: 20, backgroundColor: '#fff', margin: 10,alignItems: 'center',  }}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                style={{ margin: 10, justifyContent: 'center', alignItems: 'center' }} onPress={() => get_MyworkOrder('MyWorkOrder')}>
                <View style={styles.card_view}>
                  <Image style={{ width: 25, height: 25}} source={require('../images/history.png')} />
                </View>

                <Text style={styles.textCenter}>My Work Order</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ margin: 10, justifyContent: 'center', alignItems: 'center', }} onPress={() => get_MyworkOrder('ScanAsset')}>
                <View style={styles.card_view}>
                  <Image style={{ width: 30, height: 30 }} source={require('../images/sacn.png')} />
                </View>

                <Text style={styles.textCenter}>Scan Asset</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ margin: 10, justifyContent: 'center', alignItems: 'center', }} onPress={() => get_MyworkOrder('WO_Dashboard')}>
                <View style={styles.card_view}>
                  <Image style={{ width: 30, height: 30 }} source={require('../images/dashboard.png')} />
                </View>

                <Text style={styles.textCenter}>WO Dashboard</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ margin: 10, justifyContent: 'center', alignItems: 'center', }} onPress={() => get_MyworkOrder('MyWorkRequest')}>
                <View style={styles.card_view}>
                  <Image style={{ width: 30, height: 30 }} source={require('../images/workrequest1.png')} />
                </View>

                <Text style={styles.textCenter}>Work Request</Text>
              </TouchableOpacity>

              <TouchableOpacity

                style={{ margin: 10, justifyContent: 'center', alignItems: 'center', }} onPress={() => get_MyworkOrder('NewWorkORder')}>

                <View style={styles.card_view}>
                  <Image style={{ width: 30, height: 30 }} source={require('../images/newwok.png')} />
                </View>

                <Text style={styles.textCenter}>New Work Order</Text>

              </TouchableOpacity>


            </ScrollView>
          </View>
        )}

        <ScrollView>
          <View>
            <Text style={{ marginLeft: 20, color: '#05375a', textAlign: 'left',  fontWeight: 'bold',}}> MY WO Dashboard </Text>
          </View>

          <View style={{ padding: 5, borderRadius: 20, backgroundColor: '#fff', margin: 10,alignItems: 'center', }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
              <TouchableOpacity
                style={{ justifyContent: 'center', alignItems: 'center', margin: 10, }} onPress={() => get_MyworkOrder('MyWorkOrder')}>
                <View
                  style={{ height: 50, width: 100, borderRadius: 30, padding: 10, backgroundColor: '#2ECC71', justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{ fontSize: 15, color: '#000', margin: 5, fontWeight: 'bold', color: 'black'}}> {open_Perctage} </Text>
                </View>

                <Text style={styles.textCenter}>All Open</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ justifyContent: 'center', alignItems: 'center', margin: 10, }} onPress={() => get_MyworkOrder('MYWO_Dashboard_Due')}>
                <View
                  style={{ height: 50, width: 100, borderRadius: 30, padding: 10, backgroundColor: '#F4D03F', justifyContent: 'center', alignItems: 'center', }}>
                  <Text style={{ fontSize: 15, color: '#000', margin: 5, fontWeight: 'bold', color: 'black', }}> {complete_Perctage} </Text>
                </View>

                <Text style={styles.textCenter}>Due in 3 Days</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ justifyContent: 'center', alignItems: 'center', margin: 10, }} onPress={() => get_MyworkOrder('MYWO_Dashboard_Past')}>
                <View
                  style={{ height: 50, width: 100, borderRadius: 30, padding: 10, backgroundColor: '#EC7063', justifyContent: 'center', alignItems: 'center', }}> 
                  <Text style={{ fontSize: 15, color: '#000', margin: 5, fontWeight: 'bold', color: 'black', }}> {close_Perctage} </Text>
                </View>

                <Text style={styles.textCenter}>Past Due</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <Text style={{ marginTop: 5, marginLeft: 20, color: '#05375a', textAlign: 'left', fontWeight: 'bold'}}> Last 7 Days Work Order </Text>
          </View>

          <View style={{flex: 1, margin: 10,backgroundColor: '#fff',borderRadius: 20,alignItems: 'center',}}>
            <View style={{justifyContent: 'center', alignItems: 'center', }}>
              <BarChat_two
                
                data={week}
                hideYAxisText
                yAxisThickness={0}
                barBorderRadius={10}
                barWidth={25}
                initialSpacing={10}
                spacing={14}
                noOfSections={6}
                isAnimated
                height={170} 
               
              />
            </View>

          </View>
          



          {/* <View style={{flex: 1, margin: 10}}>
            <View style={{ justifyContent: 'center', alignItems: 'center',}}>
              {chartConfigs.map(chartConfig => {
                const labelStyle = {
                  color: chartConfig.color(),
                  marginVertical: 0,
                  textAlign: 'center',
                  fontSize: 16,
                };
                const graphStyle = {
                  paddingRight: 0,

                  ...chartConfig.style,
                };

                return (
                  <BarChart
                    width={Dimensions.get('window').width - 10}
                    height={200}
                    data={data}
                    showValuesOnTopOfBars={true}
                    chartConfig={chartConfig}
                    style={{
                      marginVertical: 0,
                      borderRadius: 16,
                      paddingRight: 0,
                    }}
                  />
                );
              })}
            </View>
          </View> */}
        </ScrollView>

        
      </View>
    </View>
  );
};

export default HomeScreen;

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
    textAlign: 'left',
    fontWeight: 'bold',
    marginTop: 5,
    marginLeft:10,
    color: '#ffffffff',
  },

  text_stytle_ta: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 10,
    color: '#ffffffff',
  },

  textCenter: {
    fontSize: 10,
    margin: 5,
    fontWeight: 'bold',
    color: '#05375a',
  },

  card_view: {
    height: 50,
    width: 50,
    borderRadius: 20,
    padding: 10,
    backgroundColor: '#ECF0F1',
    justifyContent: 'center',
    alignItems: 'center', //Centered vertically
  },

  image: {
    width: 38,
    height: 38,
    resizeMode: 'contain',
  },

  image_ta: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
  },

  slide1: {
   
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,

    //backgroundColor: '#9DD6EB'
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: '#97CAE5'
  },
  model_cardview:{

    flex:1,
    justifyContent:'center',        
    backgroundColor:'rgba(0,0,0,0.8)'

},
});
