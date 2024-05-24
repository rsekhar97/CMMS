import React from 'react'
import {  View,StyleSheet,Text, RefreshControl,Image,FlatList ,BackHandler,TouchableOpacity,Alert, Pressable,Button,Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressLoader from 'rn-progress-loader';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import axios from "axios";
import { Appbar } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { openDatabase } from 'react-native-sqlite-storage';
import DeviceInfo from 'react-native-device-info'
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {TextInput} from 'react-native-element-textinput';
import {SearchBar} from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from "moment";
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
var db = openDatabase({ name: 'CMMS.db' });

let Baseurl,Site_cd,LoginID,EmpName,EmpID,EmpPhone,EmpWorkGrp,
dvc_id,WIFI,emp_ls1_charge_rate,emp_det_craft,dft_mst_tim_act,Local_ID,
mst_RowID;


 const TimeCard = ({route,navigation}) => {

  var valid = false;

  const [spinner, setspinner]= React.useState(false);
  const [Toolbartext, setToolbartext]= React.useState("Time Card");
  const [Editable, setEditable] = React.useState(false);
  const [height, setHeight] = React.useState(0);

  const [Employee,setEmployee] = React.useState([]);
  const [Craft,setCraft] = React.useState([]);
  const [HourType,setHourType] = React.useState([]);

  const [PMGroupAsset,setPMGroupAsset] = React.useState([]);

  const [TimeCardList,setTimeCardList] = React.useState([]);
  const [isRender,setisRender]=React.useState(false);

  const [isDatepickerVisible,setDatePickerVisibility]=React.useState(false);
  const [startdate, setstartdate] = React.useState('');
  const [enddate, setenddate] = React.useState('');
  const [datetitle, setDatetitle] = React.useState('');

  const [Craft_height, setCraft_height] = React.useState(0);
  const [Hourtype_height, setHourtype_height] = React.useState(0);

  //DropDown Modal
  const [textvalue, settextvalue] = React.useState('');
  const [Boxtextvalue, setBoxtextvalue] = React.useState('');
  const [Dropdown_data, setDropdown_data] = React.useState([]);
  const [DropDownFilteredData, setDropDownFilteredData] = React.useState([]);
  const [DropDown_modalVisible, setDropDown_modalVisible] = React.useState(false);
  const [DropDown_search, setDropDown_search] = React.useState('');
  const [refreshing, setRefreshing] = React.useState(false);
  const [select_key,setselect_key] = React.useState("");

  const [MINDate,setMINDate] =  React.useState();
  const [MAXDate,setMAXDate] =  React.useState();

  //Alert
  const [Show, setShow] = React.useState(false);
  const [Show_two, setShow_two] = React.useState(false);
  const [Theme, setTheme] = React.useState('');
  const [Title, setTitle] = React.useState('');
  const [AlertType, setAlertType] = React.useState('');
  const [AlertData, setAlertData] = React.useState([]);

  
  const _goBack = () => {

    if (route.params.Screenname == 'FilteringWorkOrder'){

      navigation.navigate('CreateWorkOrder',{

      Selected_WorkOrder_no:route.params.Selected_WorkOrder_no,
      RowID:route.params.RowID,

      //no need back
      Selected_AssetNo:route.params.Selected_AssetNo,
     
      Screenname:route.params.Screenname,


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
    }else if (route.params.Screenname == 'MyWorkOrder') {
        navigation.navigate('CreateWorkOrder',{

          Selected_WorkOrder_no:route.params.Selected_WorkOrder_no,
          RowID:route.params.RowID,


          //no need back
          Selected_AssetNo:route.params.Selected_AssetNo,

          local_id:route.params.local_id,
          Selected_wko_mst_ast_cod:route.params.Selected_wko_mst_ast_cod,
          Selected_wko_mst_type:route.params.Selected_wko_mst_type,
          Screenname:route.params.Screenname,

        });
    }else if (route.params.Screenname == 'WoDashboard'  || route.params.Screenname == 'MYWO_Dashboard_Due' || route.params.Screenname == 'MYWO_Dashboard_Past') {
        navigation.navigate('CreateWorkOrder',{

          Selected_WorkOrder_no:route.params.Selected_WorkOrder_no,
          RowID:route.params.RowID,


          //no need back
          Selected_AssetNo:route.params.Selected_AssetNo,

          local_id:route.params.local_id,
          Selected_wko_mst_ast_cod:route.params.Selected_wko_mst_ast_cod,
          Selected_wko_mst_type:route.params.Selected_wko_mst_type,

          Screenname:route.params.Screenname,
          type:route.params.type,

        });
    }else if (route.params.Screenname == 'ScanAssetMaster'){

        if(route.params.ScanAssetType =='New'){

            

        }else if(route.params.ScanAssetType =='Edit'){

            navigation.navigate('CreateWorkOrder',{

              Selected_WorkOrder_no:route.params.Selected_WorkOrder_no,
              RowID:route.params.RowID,

              //no need back
              Selected_AssetNo:route.params.Selected_AssetNo,

              Screenname:route.params.Screenname,
              ScanAssetType:route.params.ScanAssetType,
              ScanAssetno:route.params.ScanAssetno,
              ScanAssetRowID:route.params.ScanAssetRowID

            });

        }
        
    }else if(route.params.Screenname == "AssetListing"){    
        navigation.navigate('CreateWorkOrder',{

          Selected_WorkOrder_no:route.params.Selected_WorkOrder_no,
          RowID:route.params.RowID,


          //no need back
          Selected_AssetNo:route.params.Selected_AssetNo,

          ASL_Assetno:route.params.ASL_Assetno,
          ASL_RowID:route.params.ASL_RowID,
          Screenname:route.params.Screenname, 
        

          ASF_Assetno:route.params.ASF_Assetno,
          ASF_AssetDescription:route.params.ASF_AssetDescription,
          ASF_Employee:route.params.ASF_Employee,
          ASF_Fromdate: route.params.ASF_Fromdate,
          ASF_Todate: route.params.ASF_Todate,
          ASF_CostCenter:route.params.ASF_CostCenter,
          ASF_AssetStatus:route.params.ASF_AssetStatus,
          ASF_AssetType:route.params.ASF_AssetType,
          ASF_AssetGroupCode:route.params.ASF_AssetGroupCode,
          ASF_AssetCode:route.params.ASF_AssetCode,
          ASF_WorkArea:route.params.ASF_WorkArea,
          ASF_AssetLocation:route.params.ASF_AssetLocation,
          ASF_AssetLevel:route.params.ASF_AssetLevel
        });

    } 
    
  }


  const backAction = () => {
    // Alert.alert("Alert", "Do you want to exit time card screen?", [
    //   {
    //     text: "Cancel",
    //     onPress: () => null,
    //     style: "cancel"
    //   },
    //   { text: "YES", onPress: () => _goBack() }
    // ]);
    setAlert_two(true,'warning','Do you want to exit time card screen?','BACK')
    return true;
  };

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);


  React.useEffect(() => {            

    const focusHander = navigation.addListener('focus', ()=>{
      

        fetchData();

    });
    return focusHander;
   
     
  },[navigation]);



  const fetchData = async ()=>{ 


    dvc_id = DeviceInfo.getDeviceId();

    Baseurl = await AsyncStorage.getItem('BaseURL');
    Site_cd = await AsyncStorage.getItem('Site_Cd');
    LoginID = await AsyncStorage.getItem('emp_mst_login_id');
    EmpName = await AsyncStorage.getItem('emp_mst_name');
    EmpID = await AsyncStorage.getItem('emp_mst_empl_id');
    EmpPhone = await AsyncStorage.getItem('emp_mst_homephone');
    EmpWorkGrp = await AsyncStorage.getItem('emp_det_work_grp');
    emp_ls1_charge_rate = await AsyncStorage.getItem('emp_ls1_charge_rate');
    emp_det_craft = await AsyncStorage.getItem('emp_det_craft');
    dft_mst_tim_act = await AsyncStorage.getItem('dft_mst_tim_act');
    WIFI = await AsyncStorage.getItem('WIFI');

    console.log('WORK OFF DATA:  ' + WIFI);
    console.log('dft_mst_tim_act:', dft_mst_tim_act)
    console.log('emp_det_craft:', emp_det_craft)
    console.log('emp_ls1_charge_rate:', emp_ls1_charge_rate)
    console.log('WorkOrder_no:', route.params.Selected_WorkOrder_no)
    console.log('mst_RowID:', route.params.RowID)
    console.log('ASSETNO:', route.params.Selected_AssetNo)
    console.log('CostCenter:', route.params.Selected_CostCenter)
    console.log('LaborAccount:', route.params.Selected_LaborAccount)
    console.log('ContractAccount:', route.params.Selected_ContractAccount)
    console.log('MaterialAccount:', route.params.Selected_MaterialAccount)
    console.log('PMGroupType:', route.params.Selected_PMGroupType)

    mst_RowID =route.params.RowID;
    Local_ID =route.params.local_id;

    console.log("WORK mst_RowID:  "+ mst_RowID);
    console.log("WORK Local_ID:  "+ Local_ID);

    db.transaction(function(txn){

      //employee
      txn.executeSql( 'SELECT * FROM employee', [], (tx, { rows }) => { setEmployee(rows.raw())});     
        
      //hourstype
      txn.executeSql( 'SELECT * FROM hourstype', [], (tx, { rows }) => { setHourType(rows.raw())});  
        
      //Time Craft
      txn.executeSql( 'SELECT * FROM TimeCraft WHERE emp_mst_empl_id=?', [EmpID], (tx, { rows }) => { setCraft(rows.raw())});
           

    });


    if (WIFI === 'OFFLINE') {

      get_timecard_offline();

    }else{

      get_timecard();

    }

   
}

 

  //GET TIMECARD LIST API
  const get_timecard=(async()=>{

    setspinner(true);

    try{

      console.log("JSON DATA : " + `${Baseurl}/get_time_card_list.php?site_cd=${(Site_cd)}&mst_RowID=${route.params.RowID}`)
      const response = await axios.get(`${Baseurl}/get_time_card_list.php?site_cd=${(Site_cd)}&mst_RowID=${route.params.RowID}`);

      console.log("JSON DATA : " + JSON.stringify( response.data.data))
     
      if (response.data.status === 'SUCCESS') 
      {

        if(response.data.data.length>0){

          for (let i = 0; i < response.data.data.length; ++i) {

            let key = i + 1

            var start_Date,end_Date;

            let startDate = moment(response.data.data[i].wko_ls8_datetime1.date).format('YYYY-MM-DD HH:mm')
            console.log(startDate)
            if(startDate === '1900-01-01 00:00'){
              start_Date ='';
            }else {
                
              start_Date = startDate;
            }

            let endDate = moment(response.data.data[i].wko_ls8_datetime2.date).format('YYYY-MM-DD HH:mm')
            console.log(endDate)
            if(endDate === '1900-01-01 00:00'){
              end_Date ='';

               var timestatus = 'Work In Progress'
               var timeeditable =true
               var stopeditable = false


            }else {

              var timestatus = 'Work Completed'
              var timeeditable = true
              var stopeditable = true
                
              end_Date = endDate;
            }

            if(end_Date.length > 0){

              const start = new Date(start_Date);
              const end   = new Date(end_Date);
              const range = moment.range(start, end);

              var msDiff = range.diff();  
            
              var days = Math.floor(msDiff / (1000 * 60 * 60 * 24));
              var hours = Math.floor((msDiff - (1000 * 60 * 60 * 24 * days)) / (1000 * 60 * 60));
              var min = Math.floor(msDiff - (1000 * 60 * 60 * 24 * days) - (1000 * 60 * 60 * hours)) / (1000 * 60);
          
              var Min = Math.floor(msDiff/(1000 * 60))
              var act_hour = Math.floor(Min/60);
      
              console.log("Min:", Min);
              console.log("act_hour:", act_hour);
      
              console.log("Total Duration in millis:", msDiff);
              console.log("Days:", days);
              console.log("Hours:", hours);
              console.log("Minutes:", min);

              var actualhoure_label;
              if(days == 0){
               
                actualhoure_label =('( '+days+' Days, '+hours+' Hours, '+min+' Minutes'+' )')
              }else{
                
                actualhoure_label =('( '+days+' Days, '+hours+' Hours, '+min+' Minutes'+' )')
              }


            }

            

            let wko_ls8_empl_id = response.data.data[i].wko_ls8_empl_id
            let wko_ls8_craft= response.data.data[i].wko_ls8_craft
            let wko_ls8_hours_type= response.data.data[i].wko_ls8_hours_type

            let wko_ls8_hrs = parseFloat(response.data.data[i].wko_ls8_hrs).toFixed(2)
            let wko_ls8_multiplier = parseFloat(response.data.data[i].wko_ls8_multiplier).toFixed(4)
            let wko_ls8_adder = parseFloat(response.data.data[i].wko_ls8_adder).toFixed(4)

            let wko_ls8_rate = parseFloat(response.data.data[i].wko_ls8_rate).toFixed(4)
            let wko_ls8_act_cost = parseFloat(response.data.data[i].wko_ls8_act_cost).toFixed(4)

            let mst_RowID = response.data.data[i].mst_RowID
            let rowid = response.data.data[i].RowID
            let sitecd = response.data.data[i].site_cd
            let wko_ls8_assetno = response.data.data[i].wko_ls8_assetno

            let wko_ls8_chg_costcenter = response.data.data[i].wko_ls8_chg_costcenter
          
            if(route.params.Selected_PMGroupType == '' || route.params.Selected_PMGroupType == null){
              
              var Time_PMGroupType = false
            }else{
             
              var Time_PMGroupType= true;
    
            }
            var sync_date = moment().format('YYYY-MM-DD HH:mm');

            let Startdate_Editable,Enddate_Editable
            if(dft_mst_tim_act === '0'){
              Startdate_Editable = false
              Enddate_Editable = false
            }else{

              Startdate_Editable = true
              Enddate_Editable = true

            }


            setTimeCardList(TimeCardList =>[...TimeCardList,
                            
              {
                key:key,

                site_cd:sitecd,
                mst_RowID:mst_RowID,
                assetno:wko_ls8_assetno,
                wko_mst_wo_no:route.params.Selected_WorkOrder_no,

                originator_label:wko_ls8_empl_id,
                originator:wko_ls8_empl_id,
                craft_label:wko_ls8_craft,
                craft:wko_ls8_craft,
                hourtype:wko_ls8_hours_type,
                hourtype_label:wko_ls8_hours_type,
                actualhoure_label:actualhoure_label,

                total_hrs:wko_ls8_hrs,
                rate:wko_ls8_rate,
                multiplier:wko_ls8_multiplier,
                adder:wko_ls8_adder,
                
                act_cost:wko_ls8_act_cost,
                chg_costcenter:wko_ls8_chg_costcenter,
                chg_account:'', 
                time_card_no:'', 
                datetime1:start_Date, 
                datetime2:end_Date, 

                audit_user:EmpID, 
                audit_date:sync_date, 

                RowId:rowid,
                dvc_id:dvc_id,
                LOGINID:LoginID,
                sync_step:'',
                sync_time:sync_date,
                sync_status:'online',
                sync_url:Baseurl + "/insert_time_card.php?",

                PMGroupType:Time_PMGroupType,
                status:timestatus,
                stop_editable:stopeditable,
                TimeEditable:timeeditable,
                coloum:'Edit',
                startdate_editable:Startdate_Editable,
                enddate_editable:Enddate_Editable,
                id:'', 

              },
        
            ]);


          }

          if(route.params.Selected_PMGroupType === ''){

            setspinner(false);

          }else{
            console.log("PM  esle :"+ route.params.Selected_PMGroupType);

            get_pm_grouptype_asset();
          }
          

        }else{

          if(route.params.Selected_PMGroupType === ''){

            setspinner(false);

          }else{
            console.log("PM  esle :"+ route.params.Selected_PMGroupType);

            get_pm_grouptype_asset();
          }
        
        }
        
       
      
      }else{
          setspinner(false);
          setAlert(true,'danger',response.data.message,'OK');
          return
      }

    }catch(error){

        setspinner(false);
        alert(error);
    } 



  }) 


  const get_timecard_offline =(async ()=>{

    if(!mst_RowID){

      console.log("Empty")

      db.transaction(function(txn){

        //GET OFFLINE TIME CARD
        txn.executeSql('SELECT * FROM wko_ls8_timecard WHERE  local_id =?',
        [Local_ID], (tx, results) => {
         
           var temp = [];
           console.log("GET TIME CARD LIST LOCAL_ID: "+JSON.stringify(results.rows.length));

           if(results.rows.length>0){
 
             for (let i = 0; i < results.rows.length; ++i) {
               
              let key = i + 1
              var start_Date,end_Date;

              let startDate = moment(results.rows.item(i).wko_ls8_datetime1.date).format('yyyy-MM-DD HH:mm')
              console.log(startDate)
              if(startDate === '1900-01-01 00:00'){
                start_Date ='';
              }else {
                  
                start_Date = startDate;
              }

              let Startdate_Editable,Enddate_Editable
  
              if(!results.rows.item(i).wko_ls8_datetime2){

                console.log("IF");
                end_Date ='';
                var timestatus = 'Work In Progress'
                var timeeditable =true
                var stopeditable = false
              }else{

                console.log("Else");
                let endDate = moment(results.rows.item(i).wko_ls8_datetime2).format('yyyy-MM-DD HH:mm')
                console.log("END DATE:",endDate)
                
                if(endDate === ''){
                  end_Date ='';
    
                  var timestatus = 'Work In Progress'
                  var timeeditable =true
                  var stopeditable = false


                  
                  if(dft_mst_tim_act === '0'){
                    Startdate_Editable = true
                    Enddate_Editable = true
                  }else{
      
                    Startdate_Editable = false
                    Enddate_Editable = false
      
                  }
    
    
                }else {
                  console.log("2 Else");
                  var timestatus = 'Work Completed'
                  var timeeditable = true
                  var stopeditable = true
                    
                  end_Date = endDate;


                    Startdate_Editable = false
                    Enddate_Editable = false
                }
              }

              if(end_Date.length > 0){

                const start = new Date(start_Date);
                const end   = new Date(end_Date);
                const range = moment.range(start, end);
  
                var msDiff = range.diff();  
              
                var days = Math.floor(msDiff / (1000 * 60 * 60 * 24));
                var hours = Math.floor((msDiff - (1000 * 60 * 60 * 24 * days)) / (1000 * 60 * 60));
                var min = Math.floor(msDiff - (1000 * 60 * 60 * 24 * days) - (1000 * 60 * 60 * hours)) / (1000 * 60);
            
                var Min = Math.floor(msDiff/(1000 * 60))
                var  act_hour = Math.floor(Min/60);
        
                console.log("Min:", Min);
                console.log("act_hour:", act_hour);
        
                console.log("Total Duration in millis:", msDiff);
                console.log("Days:", days);
                console.log("Hours:", hours);
                console.log("Minutes:", min);
  
                var actualhoure_label;
                if(days == 0){
                 
                  actualhoure_label =('( '+days+' Days, '+hours+' Hours, '+min+' Minutes'+' )')
                }else{
                  
                  actualhoure_label =('( '+days+' Days, '+hours+' Hours, '+min+' Minutes'+' )')
                }
  
  
              }
  
              
  
              let wko_ls8_empl_id = results.rows.item(i).wko_ls8_empl_id
              let wko_ls8_craft= results.rows.item(i).wko_ls8_craft
              let wko_ls8_hours_type= results.rows.item(i).wko_ls8_hours_type
  
              let wko_ls8_hrs = parseFloat(results.rows.item(i).wko_ls8_hrs).toFixed(4)
              let wko_ls8_multiplier = parseFloat(results.rows.item(i).wko_ls8_multiplier).toFixed(4)
              let wko_ls8_adder = parseFloat(results.rows.item(i).wko_ls8_adder).toFixed(4)
  
              let wko_ls8_rate = parseFloat(results.rows.item(i).wko_ls8_rate).toFixed(4)
              let wko_ls8_act_cost = parseFloat(results.rows.item(i).wko_ls8_act_cost).toFixed(4)
  
              let mst_RowID = results.rows.item(i).mst_RowID
              let rowid = results.rows.item(i).RowID
              let sitecd = results.rows.item(i).site_cd
              let wko_ls8_assetno = results.rows.item(i).wko_ls8_assetno
  
              let wko_ls8_chg_costcenter = results.rows.item(i).wko_ls8_chg_costcenter
            
              if(route.params.Selected_PMGroupType == '' || route.params.Selected_PMGroupType == null){
                
                var Time_PMGroupType = false
              }else{
               
                var Time_PMGroupType= true;
      
              }
              var sync_date = moment().format('YYYY-MM-DD HH:mm');
  
              // let Startdate_Editable,Enddate_Editable
              // if(dft_mst_tim_act === '0'){
              //   Startdate_Editable = true
              //   Enddate_Editable = true
              // }else{
  
              //   Startdate_Editable = false
              //   Enddate_Editable = false
  
              // }

              var ID =results.rows.item(i).ID
  
  
              setTimeCardList(TimeCardList =>[...TimeCardList,
                              
                {
                  key:key,
  
                  site_cd:sitecd,
                  mst_RowID:mst_RowID,
                  assetno:wko_ls8_assetno,
                  wko_mst_wo_no:route.params.Selected_WorkOrder_no,
  
                  originator_label:wko_ls8_empl_id,
                  originator:wko_ls8_empl_id,
                  craft_label:wko_ls8_craft,
                  craft:wko_ls8_craft,
                  hourtype:wko_ls8_hours_type,
                  hourtype_label:wko_ls8_hours_type,
                  actualhoure_label:actualhoure_label,
  
                  total_hrs:wko_ls8_hrs,
                  rate:wko_ls8_rate,
                  multiplier:wko_ls8_multiplier,
                  adder:wko_ls8_adder,
                  
                  act_cost:wko_ls8_act_cost,
                  chg_costcenter:wko_ls8_chg_costcenter,
                  chg_account:'', 
                  time_card_no:'', 
                  datetime1:start_Date, 
                  datetime2:end_Date, 
  
                  audit_user:EmpID, 
                  audit_date:sync_date, 
  
                  RowId:rowid,
                  dvc_id:dvc_id,
                  LOGINID:LoginID,
                  sync_step:'',
                  sync_time:sync_date,
                  sync_status:'online',
                  sync_url:Baseurl + "/insert_time_card.php?",
  
                  PMGroupType:Time_PMGroupType,
                  status:timestatus,
                  stop_editable:stopeditable,
                  TimeEditable:timeeditable,
                  coloum:'Edit',
                  startdate_editable:Startdate_Editable,
                  enddate_editable:Enddate_Editable,
                  id:ID,
  
                },
          
              ]);
 
               
             }
 
           }
 
           
       
         })


          txn.executeSql('SELECT * FROM prm_ast where prm_ast_grp_cd = ? and  prm_ast_wo_no= ? order by ast_mst_asset_no asc',
          [route.params.Selected_AssetNo,route.params.Selected_WorkOrder_no], (tx, results) => {
            var temp = [];
            console.log("PM ASSET LIST LOCAL_ID :"+JSON.stringify(results.rows.length));
            if(results.rows.length>0){

              for (let i = 0; i < results.rows.length; ++i) {
                temp.push(results.rows.item(i));    
              }

              setPMGroupAsset(temp);
              setspinner(false)

            }

          })

      })

    }else{

      console.log("Not Empty")

      db.transaction(function(txn){

        //GET OFFLINE TIME CARD
        txn.executeSql('SELECT * FROM wko_ls8_timecard WHERE  mst_RowID =?',
        [mst_RowID], 
        (tx, results) => {
         
           var temp = [];
           console.log("GET TIME CARD LIST MST_ROWID :"+JSON.stringify(results.rows.length));
           if(results.rows.length>0){
 
             for (let i = 0; i < results.rows.length; ++i) {

              console.log("LIST :",results.rows.item(i))
              let key = i + 1
              let start_Date,end_Date='';

              let startDate = moment(results.rows.item(i).wko_ls8_datetime1).format('yyyy-MM-DD HH:mm')
              console.log("START DATE:",startDate)
              if(startDate === '1900-01-01 00:00' || null){
                start_Date ='';
              }else {
                  
                start_Date = startDate;
              }
  
              let Startdate_Editable,Enddate_Editable

              if(!results.rows.item(i).wko_ls8_datetime2){

                console.log("IF");
                end_Date ='';
                var timestatus = 'Work In Progress'
                var timeeditable =true
                var stopeditable = false
              }else{

                console.log("Else");
                let endDate = moment(results.rows.item(i).wko_ls8_datetime2).format('yyyy-MM-DD HH:mm')
                console.log("END DATE:",endDate)
                
                if(endDate === ''){
                  end_Date ='';
    
                  var timestatus = 'Work In Progress'
                  var timeeditable =true
                  var stopeditable = false


                  
                  if(dft_mst_tim_act === '0'){
                    Startdate_Editable = true
                    Enddate_Editable = true
                  }else{
      
                    Startdate_Editable = false
                    Enddate_Editable = false
      
                  }
    
    
                }else {
                  console.log("2 Else");
                  var timestatus = 'Work Completed'
                  var timeeditable = true
                  var stopeditable = true

                  Startdate_Editable = false
                  Enddate_Editable = false
                    
                  end_Date = endDate;
                }
              }

              if(end_Date.length > 0){

                const start = new Date(start_Date);
                const end   = new Date(end_Date);
                const range = moment.range(start, end);
  
                var msDiff = range.diff();  
              
                var days = Math.floor(msDiff / (1000 * 60 * 60 * 24));
                var hours = Math.floor((msDiff - (1000 * 60 * 60 * 24 * days)) / (1000 * 60 * 60));
                var min = Math.floor(msDiff - (1000 * 60 * 60 * 24 * days) - (1000 * 60 * 60 * hours)) / (1000 * 60);
            
                var Min = Math.floor(msDiff/(1000 * 60))
                var  act_hour = Math.floor(Min/60);
        
                console.log("Min:", Min);
                console.log("act_hour:", act_hour);
        
                console.log("Total Duration in millis:", msDiff);
                console.log("Days:", days);
                console.log("Hours:", hours);
                console.log("Minutes:", min);
  
                var actualhoure_label;
                if(days == 0){
                 
                  actualhoure_label =('( '+days+' Days, '+hours+' Hours, '+min+' Minutes'+' )')
                }else{
                  
                  actualhoure_label =('( '+days+' Days, '+hours+' Hours, '+min+' Minutes'+' )')
                }
  
  
              }
  
              let wko_ls8_empl_id = results.rows.item(i).wko_ls8_empl_id
              let wko_ls8_craft= results.rows.item(i).wko_ls8_craft
              let wko_ls8_hours_type= results.rows.item(i).wko_ls8_hours_type
  
              let wko_ls8_hrs = parseFloat(results.rows.item(i).wko_ls8_hrs).toFixed(4)
              let wko_ls8_multiplier = parseFloat(results.rows.item(i).wko_ls8_multiplier).toFixed(4)
              let wko_ls8_adder = parseFloat(results.rows.item(i).wko_ls8_adder).toFixed(4)
  
              let wko_ls8_rate = parseFloat(results.rows.item(i).wko_ls8_rate).toFixed(4)
              let wko_ls8_act_cost = parseFloat(results.rows.item(i).wko_ls8_act_cost).toFixed(4)
  
              let mst_RowID = results.rows.item(i).mst_RowID
              let rowid = results.rows.item(i).RowID
              let sitecd = results.rows.item(i).site_cd
              let wko_ls8_assetno = results.rows.item(i).wko_ls8_assetno
  
              let wko_ls8_chg_costcenter = results.rows.item(i).wko_ls8_chg_costcenter
            
              if(route.params.Selected_PMGroupType == '' || route.params.Selected_PMGroupType == null){
                
                var Time_PMGroupType = false
              }else{
               
                var Time_PMGroupType= true;
      
              }
              var sync_date = moment().format('YYYY-MM-DD HH:mm');
  
              // let Startdate_Editable,Enddate_Editable
              // if(dft_mst_tim_act === '0'){
              //   Startdate_Editable = true
              //   Enddate_Editable = true
              // }else{
  
              //   Startdate_Editable = false
              //   Enddate_Editable = false
  
              // }
  
              var ID =results.rows.item(i).ID

              setTimeCardList(TimeCardList =>[...TimeCardList,
                              
                {
                  key:key,
  
                  site_cd:sitecd,
                  mst_RowID:mst_RowID,
                  assetno:wko_ls8_assetno,
                  wko_mst_wo_no:route.params.Selected_WorkOrder_no,
  
                  originator_label:wko_ls8_empl_id,
                  originator:wko_ls8_empl_id,
                  craft_label:wko_ls8_craft,
                  craft:wko_ls8_craft,
                  hourtype:wko_ls8_hours_type,
                  hourtype_label:wko_ls8_hours_type,
                  actualhoure_label:actualhoure_label,
  
                  total_hrs:wko_ls8_hrs,
                  rate:wko_ls8_rate,
                  multiplier:wko_ls8_multiplier,
                  adder:wko_ls8_adder,
                  
                  act_cost:wko_ls8_act_cost,
                  chg_costcenter:wko_ls8_chg_costcenter,
                  chg_account:'', 
                  time_card_no:'', 
                  datetime1:start_Date, 
                  datetime2:end_Date, 
  
                  audit_user:EmpID, 
                  audit_date:sync_date, 
  
                  RowId:rowid,
                  dvc_id:dvc_id,
                  LOGINID:LoginID,
                  sync_step:'',
                  sync_time:sync_date,
                  sync_status:'online',
                  sync_url:Baseurl + "/insert_time_card.php?",
  
                  PMGroupType:Time_PMGroupType,
                  status:timestatus,
                  stop_editable:stopeditable,
                  TimeEditable:timeeditable,
                  coloum:'Edit',
                  startdate_editable:Startdate_Editable,
                  enddate_editable:Enddate_Editable,
                  id:ID,  
                },
          
              ]);
 
               
             }
 
           }
         })

         txn.executeSql('SELECT * FROM prm_ast where prm_ast_grp_cd = ? and  prm_ast_wo_no= ? order by ast_mst_asset_no asc',
         [route.params.Selected_AssetNo,route.params.Selected_WorkOrder_no], (tx, results) => {
            var temp = [];
            console.log("PM ASSET LIST MST_ROWID: "+JSON.stringify(results.rows.length));
            if(results.rows.length>0){

              for (let i = 0; i < results.rows.length; ++i) {
                temp.push(results.rows.item(i));    
              }

              setPMGroupAsset(temp);
              setspinner(false)

            }

          })
 
 
      })

    }

  })

  //GET PM GROUP ASSET API
  const get_pm_grouptype_asset=(async()=>{


    let PM_GROUPTYPE={

      site_cd:Site_cd,
      prm_ast_grp_cd:route.params.Selected_AssetNo,
      prm_ast_wo_no:route.params.Selected_WorkOrder_no,
    }


    console.log("Get PM Group Type : "+JSON.stringify(PM_GROUPTYPE))  

      try{
         const response = await axios.post(`${Baseurl}/get_pm_group_asset.php?`,JSON.stringify(PM_GROUPTYPE),
         {headers:{ 'Content-Type': 'application/json'}});
         //console.log('PM GROUP  response:'+ JSON.stringify(response.data));
         if (response.data.status === 'SUCCESS'){
            
          setPMGroupAsset(response.data.data);
          setspinner(false)
         

         }else{
            setspinner(false)
            // Alert.alert(response.data.status,response.data.message,
            //     [
                
            //         { text: "OK" }

            //     ]);

            setAlert(true,'danger',response.data.message,'OK');
        }

      }catch(error){

          setspinner(false);
          alert(error);
      } 



  });

  

  //Add TimeCard 
  const addItem =(()=>{

    

    if(TimeCardList.length > 0){

      TimeCardList.map(item =>{


        if(item.PMGroupType){

          if(!item.assetno){
  
            
            setAlert(true,'warning',`Alert line No: ${item.key} Please select asset no`,'OK');
            valid =false
            return
            
            
          }
          
          
        }

        if(!item.originator){
  
          
          setAlert(true,'warning',`Alert line No: ${item.key} Please enter Employee`,'OK');
          valid =false
          return
          
        }else{
  
          if(!item.craft){
  
            
            setAlert(true,'warning',`Alert line No: ${item.key} Please enter Craft`,'OK');
            valid =false
            return
          }else{
  
            if(!item.hourtype){
  
              
              setAlert(true,'warning',`Alert line No: ${item.key} Please enter Hour type`,'OK');
              valid =false
              return
            }else{
  
              if(!item.datetime1){
  
                
                setAlert(true,'warning',`Alert line No: ${item.key} Please enter Start DateTime`,'OK');
                valid =false
                return
              }else{

                valid =true
                
                
              }
              
            }
            
          }
  
        }
  
  
       })


       if(valid){
        var sync_date = moment().format('YYYY-MM-DD HH:mm');
        let key = TimeCardList.length + 1;

        let TimeAssetno,Time_PMGroupType;
        if(route.params.Selected_PMGroupType == '' || route.params.Selected_PMGroupType == null){
          TimeAssetno=route.params.Selected_AssetNo;
          Time_PMGroupType = false
        }else{
          if(route.params.Selected_PMGroupType === 'G'){
            TimeAssetno = ""
            Time_PMGroupType= true;
          }else{
            TimeAssetno=route.params.Selected_AssetNo;
            Time_PMGroupType = false
          }

        }
      
        let det_craft;
        if(emp_det_craft === '' || emp_det_craft === null || emp_det_craft === 'null'){
          det_craft = '';
        }else{
          
          let det_craft_split = emp_det_craft.split(':');
          det_craft =det_craft_split[0]
        }


        let CostCenter
        if(route.params.Selected_CostCenter === ''){
          CostCenter = '';
        }else{
          
          let CostCenter_split = route.params.Selected_CostCenter.split(':');
          CostCenter =CostCenter_split[0]
        }

        let Startdate_Editable,Enddate_Editable
        
        if(dft_mst_tim_act === '0'){

          Startdate_Editable = true
          Enddate_Editable = true
        }else{

          Startdate_Editable = false
          Enddate_Editable = false

        }

      
        setTimeCardList(TimeCardList =>[...TimeCardList,
                          
            {
              key:key,

              site_cd:Site_cd,
              mst_RowID:route.params.RowID,
              assetno:TimeAssetno,
              wko_mst_wo_no:route.params.Selected_WorkOrder_no,

              originator_label:'',
              originator:'',
              craft_label:'',
              craft:'',
              hourtype:'',
              hourtype_label:'',
              actualhoure_label:'',

              total_hrs:'0',
              rate:'0',
              multiplier:'0',
              adder:'0',
              
              act_cost:'0',
              chg_costcenter:CostCenter,
              chg_account:'', 
              time_card_no:'', 
              datetime1:sync_date, 
              datetime2:'', 

              audit_user:EmpID, 
              audit_date:sync_date, 

              RowId:null,
              dvc_id:dvc_id,
              LOGINID:LoginID,
              sync_step:'',
              sync_time:sync_date,
              sync_status:'online',
              sync_url:Baseurl + "/insert_time_card.php?",

              PMGroupType:Time_PMGroupType,
              status:'Status',
              stop_editable:false,
              TimeEditable:false,
              coloum:'New',
              startdate_editable:Startdate_Editable,
              enddate_editable:Enddate_Editable,
              id:'',


            },
      
        ]);
      }


        

    }else{

        var sync_date = moment().format('YYYY-MM-DD HH:mm');

        let key = TimeCardList.length + 1;

        let TimeAssetno,Time_PMGroupType;
        if(route.params.Selected_PMGroupType == '' || route.params.Selected_PMGroupType == null){
          TimeAssetno=route.params.Selected_AssetNo;
          Time_PMGroupType = false
        }else{
          if(route.params.Selected_PMGroupType === 'G'){
            TimeAssetno = ""
            Time_PMGroupType= true;
          }else{
            TimeAssetno=route.params.Selected_AssetNo;
            Time_PMGroupType = false
          }

        }
      
        let det_craft;
        if(emp_det_craft === '' || emp_det_craft === null || emp_det_craft === 'null'){
          det_craft = '';
        }else{
          
          let det_craft_split = emp_det_craft.split(':');
          det_craft =det_craft_split[0]
        }


        let CostCenter
        if(route.params.Selected_CostCenter === ''){
          CostCenter = '';
        }else{
          
          let CostCenter_split = route.params.Selected_CostCenter.split(':');
          CostCenter =CostCenter_split[0]
        }

          
        let Startdate_Editable,Enddate_Editable

        if(dft_mst_tim_act === '0'){

          Startdate_Editable = true
          Enddate_Editable = true
        }else{

          Startdate_Editable = false
          Enddate_Editable = false

        }

       


        setTimeCardList(TimeCardList =>[...TimeCardList,
                          
            {
              key:key,

              site_cd:Site_cd,
              mst_RowID:route.params.RowID,
              assetno:TimeAssetno,
              wko_mst_wo_no:route.params.Selected_WorkOrder_no,

              originator_label:EmpID+':'+EmpName,
              originator:EmpID,
              craft_label:emp_det_craft,
              craft:det_craft,
              hourtype:'',
              hourtype_label:'',
              actualhoure_label:'',

              total_hrs:'0',
              rate:parseFloat(emp_ls1_charge_rate).toFixed(2),
              multiplier:'0',
              adder:'0',
              
              act_cost:'0',
              chg_costcenter:CostCenter,
              chg_account:'', 
              time_card_no:'', 
              datetime1:sync_date, 
              datetime2:'', 

              audit_user:EmpID, 
              audit_date:sync_date, 

              RowId:null,
              dvc_id:dvc_id,
              LOGINID:LoginID,
              sync_step:'',
              sync_time:sync_date,
              sync_status:'online',
              sync_url:Baseurl + "/insert_time_card.php?",

              PMGroupType:Time_PMGroupType,
              status:'Status',
              stop_editable:false,
              TimeEditable:false,
              coloum:'New',
              startdate_editable:Startdate_Editable,
              enddate_editable:Enddate_Editable,
              id:'',

            },
      
        ]);

    }

  });

  //Remove Time Card Item
  removeItem =(key)=>{

  console.log("REMOVE"+key)
  // Alert.alert("Remove Time Card","Do you confirm to remove timecard line?",
  //   [
    
  //       { text: "OK", onPress: () => setTimeCardList(TimeCardList.slice().filter((item)=>item.key !==key)) }

  //   ]);

  setAlert_two(true,'delete','Do you confirm to remove the line?','REMOVE_LINE',key,'')

  //setTimecard(Timecard.slice().filter((item)=>item.key !==key))
  }


  //Stop Button 
  const stop = (getitem)=>{


    

    var sync_date = moment().format('YYYY-MM-DD HH:mm');

  
    TimeCardList.map(item =>{

     

      if(item.key == getitem){
       //console.log("SELECTED ITEM "+  item.selected_Employee)
      
      
       if(item.PMGroupType){

          if(!item.assetno){
    
            // Alert.alert(`Alert time card line No: ${item.key}`,"Please select Asset No",
            // [
            
            //     { text: "OK" }

            // ]);
            setAlert(true,'warning',`Alert line No: ${item.key} Please select asset no`,'OK');
            valid =false
            return
            
            
          }

       }

        if(!item.originator){

          // Alert.alert(`Alert time card line No: ${item.key}`,"Please select Employee",
          // [
          
          //     { text: "OK" }

          // ]);
          setAlert(true,'warning',`Alert line No: ${item.key} Please select employee`,'OK');
          valid = false
          return

        }else{

          if(!item.craft){

            // Alert.alert(`Alert time card line No: ${item.key}`,"Please select craft",
            // [
            
            //     { text: "OK" }
  
            // ]);
            setAlert(true,'warning',`Alert line No: ${item.key} Please select craft`,'OK');
            valid = false
            return
  
          }else{
            
            if(!item.hourtype){

              // Alert.alert(`Alert time card line No: ${item.key}`,"Please select HourType",
              // [
              
              //     { text: "OK" }
    
              // ]);
              setAlert(true,'warning',`Alert line No: ${item.key} Please select HourType`,'OK');
              valid = false
              return
    
            }else{
              console.log('KEY == :' + item.hourtype);
              valid = true
    
            }
  
              
  
          }

            

        }

      }
      
   })


   if(valid){

      const newData = TimeCardList.map(item =>{
      if(item.key == getitem){

        console.log("SELECTED ITEM 2"+  item.key)

        item.status='Work Complete'
        item.stop_editable = true
        item.TimeEditable =true
        item.datetime2 = sync_date

        const start = new Date(item.datetime1);
        const end   = new Date(sync_date);
        const range = moment.range(start, end);
      
        var msDiff = range.diff();    
        var days = Math.floor(msDiff / (1000 * 60 * 60 * 24)) % 365;
        var hours = Math.floor((msDiff - (1000 * 60 * 60 * 24 * days )) / (1000 * 60 * 60));
        var min = Math.floor(msDiff - (1000 * 60 * 60 * 24 * days) - (1000 * 60 * 60 * hours)) / (1000 * 60);
    
      
        var Min = Math.floor(msDiff/(1000 * 60))
        var  act_hour = Math.floor(Min/60);

        console.log("Min:", Min);
        console.log("act_hour:", act_hour);

        console.log("Total Duration in millis:", msDiff);
        console.log("Days:", days);
        console.log("Hours:", hours);
        console.log("Minutes:", min);

        if(days == 0){
          item.total_hrs = msDiff
          item.actualhoure_label =('( '+days+' Days, '+hours+' Hours, '+min+' Minutes'+' )')
        }else{
           item.total_hrs = msDiff
          item.actualhoure_label =('( '+days+' Days, '+hours+' Hours, '+min+' Minutes'+' )')
        }
      
        //item.total_hrs =  parseFloat(hours).toFixed(2) 
      
        let h =  parseFloat(hours)
        let r =  parseFloat(item.rate)
        let a =  parseFloat(item.adder)
        let m =  parseFloat(item.multiplier)

        console.log("H : "+ h)
        console.log("R : "+ r)
        console.log("A : "+ a)
        console.log("M : "+ m)

        console.log("M : "+ act_hour*(r+a))

        let f3 = ((act_hour*(r+a))*m);

        console.log("ACTUAL COST"+ f3)

        item.act_cost = parseFloat(f3).toFixed(2)


  
      return item;

      }
      return item;
    })
    //console.log("SELECTED ITEM 23"+ JSON.stringify(newData) )
    setTimeCardList(newData)
    setisRender(!isRender)




   }
  
  

  }


  const ItemView =({item,index})=>{

    if(item.coloum == 'New'){
      var show = false
    }else{
      var show = true
    }

    
    return(

      <View style={styles.card}>
        {/* Line */}
        <View style={styles.card_row}>                      

          <Text style={{fontSize:15, justifyContent:'center',alignItems:'center',color:'#0096FF',fontWeight: 'bold'}}>Time Card line no: { item.key}</Text> 

          <TouchableOpacity onPress={()=>removeItem(item.key)}>
            <Image
                style={{  width: 35, height: 35,display: !show? 'flex' : 'none'}}
                source={require('../../images/minus.png')}/>
          </TouchableOpacity>
        
        </View>

        <View style={{backgroundColor:"#2962FF",width:'100%',height:1,marginTop:10}}></View>

            {/* Line */}
            <View style={styles.card_button}>
                                       

              <Text style={{fontSize:18,textAlign:'center',flex:1,marginLeft:10,color:!item.stop_editable? '#0096FF' : '#FF5b33',fontWeight: 'bold'}}>{item.status}</Text> 

              <TouchableOpacity style={{width:'50%',height:50,backgroundColor:'#FF0000',borderRadius: 15, alignItems:'center',justifyContent:'center',display: !item.stop_editable? 'flex' : 'none' }} 
              onPress={()=> stop(item.key)} >
                <Text style={{color:'white', fontSize: 16,fontWeight: 'bold'}}>STOP</Text>
              </TouchableOpacity>
             
        
            </View>


            {/* Asset No */}
            <View style={[styles.view_style,{display: item.PMGroupType ? 'flex' : 'none'}]}>
              <Pressable
                  onPress={() => !item.TimeEditable ? select_dropdown('PM Group Asset',PMGroupAsset,item.key) : '' }
                  >
                  <View pointerEvents={'none'}>
                  <TextInput
                      value={item.assetno}
                      style={[styles.input, { height:(Platform.OS === 'ios' ? 50 : 50) }, ]}
                      inputStyle={[styles.inputStyle, {color: item.TimeEditable ? '#808080' : '#000'}]}
                      labelStyle={styles.labelStyle}
                      placeholderStyle={{ fontSize: 15, color: '#0096FF'}}
                      label="Asset No"
                      editable={false}
                      selectTextOnFocus={false}
                      renderRightIcon={() =>
                        item.TimeEditable ? (
                          ''
                      ) : (
                          <AntDesign
                          style={styles.icon}
                          color={'black'}
                          name={item.assetno ? 'search1' : 'search1'}
                          size={22}
                          />
                      )
                      }
                  />
                  </View>
              </Pressable>
            </View>

            {/* Employee */}
            <View style={[styles.view_style]}>
              <Pressable
                  onPress={() => !item.TimeEditable ? select_dropdown('Employee',Employee,item.key) : '' } >
                  <View pointerEvents={'none'}>
                  <TextInput
                      value={item.originator_label}
                      style={[ styles.input, { height:(Platform.OS === 'ios' ? 50 : 50) }]}
                      inputStyle={[ styles.inputStyle, {color: item.TimeEditable ? '#808080' : '#000'}]}
                      labelStyle={styles.labelStyle}
                      placeholderStyle={{ fontSize: 15, color: '#0096FF'}}
                      label="Employee"
                      editable={false}
                      selectTextOnFocus={false}
                      renderRightIcon={() =>
                        item.TimeEditable ? (
                          ''
                      ) : (
                          <AntDesign
                          style={styles.icon}
                          color={'black'}
                          name={item.originator ? 'search1' : 'search1'}
                          size={22}
                          />
                      )
                      }
                  />
                  </View>
              </Pressable>
            </View>


            {/* Craft & Hour*/}
            <View style={styles.card_row}>
            
            {/* Craft */}
            <View style={[styles.view_style]}>
              <Pressable onPress={() => !item.TimeEditable ? select_dropdown('Craft',Craft,item.key) : '' } >
                  <View pointerEvents={'none'}>
                  <TextInput
                      value={item.craft_label}
                      style={[styles.input,{height: Math.max(50,Craft_height)}]}
                      multiline
                      inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}]}
                      labelStyle={styles.labelStyle}
                      onContentSizeChange={event => setCraft_height(event.nativeEvent.contentSize.height) }
                      placeholderStyle={{ fontSize: 15, color: '#0096FF'}}
                      label="Craft"
                      editable={false}
                      selectTextOnFocus={false}
                      renderRightIcon={() =>
                        item.TimeEditable ? (
                          ''
                      ) : (
                          <AntDesign
                          style={styles.icon}
                          color={'black'}
                          name={item.craft ? 'search1' : 'search1'}
                          size={20}
                          />
                      )
                      }
                  />
                  </View>
              </Pressable>
            </View>


            {/* HOURTYPE */}
            <View style={[styles.view_style]}>
              <Pressable onPress={() => !item.TimeEditable ? select_dropdown('Hour Type',HourType,item.key) : '' } >
                  <View pointerEvents={'none'}>
                  <TextInput
                      value={item.hourtype_label}
                      style={[styles.input,{height: Math.max(50,Hourtype_height)}]}
                      onContentSizeChange={event => setHourtype_height(event.nativeEvent.contentSize.height) }
                      multiline
                      inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}]}
                      labelStyle={styles.labelStyle}
                      placeholderStyle={{ fontSize: 15, color: '#0096FF'}}
                      label="Hour Type"
                      editable={false}
                      selectTextOnFocus={false}
                      renderRightIcon={() =>
                        item.TimeEditable ? (
                          ''
                      ) : (
                          <AntDesign
                          style={styles.icon}
                          color={'black'}
                          name={item.hourtype ? 'search1' : 'search1'}
                          size={20}
                          />
                      )
                      }
                  />
                  </View>
              </Pressable>
            </View>
                   

            </View>

            {/* Start & End*/}
            <View style={styles.card_row}>
            
              {/* Start time */}
              <View style={styles.view_style}>
                  <Pressable
                  onPress={() => item.startdate_editable ? showDatePicker('from',item.key) : '' }
                  >
                  <View pointerEvents={'none'}>
                      <TextInput
                      value={item.datetime1}
                      style={[ styles.input, { height:(Platform.OS === 'ios' ? 50 : 50) }, ]}
                      inputStyle={[ styles.inputStyle, {color: !item.startdate_editable? '#808080' : '#000'}]}
                      labelStyle={styles.labelStyle}
                      placeholderStyle={{ fontSize: 15, color: '#0096FF', }}
                      
                      label="Start Date Time"
                      
                      editable={false}
                      selectTextOnFocus={false}
                      renderRightIcon={() => (
                          <AntDesign
                          style={styles.icon}
                          color={'black'}
                          name={''}
                          size={20}
                          />
                      )}
                      />
                  </View>
                  </Pressable>
              </View>

              {/* End */}
              <View style={styles.view_style}>
                  <Pressable

                    onPress={() =>
                      item.enddate_editable ? showDatePicker('to',item.key) : ''
                    }
                  >
                  <View pointerEvents={'none'}>
                      <TextInput
                      value={item.datetime2}
                      style={[
                          styles.input,
                          {
                              height:(Platform.OS === 'ios' ? 50 : 50)
                          },
                      ]}
                      inputStyle={[
                      styles.inputStyle,
                      {color: !item.enddate_editable ? '#808080' : '#000'},
                      ]}
                      labelStyle={styles.labelStyle}
                      placeholderStyle={{
                      fontSize: 15,
                      color: '#0096FF',
                      }}
                      
                      label="End Date Time"
                      editable={false}
                      selectTextOnFocus={false}
                      renderRightIcon={() => (
                          <AntDesign
                          style={styles.icon}
                          color={'black'}
                          name={''}
                          size={20}
                          />
                      )}
                      />
                  </View>
                  </Pressable>
              </View>

                   

            </View>

            <View>

              <View style={{flexDirection:'row',marginTop:10}}>

                <Text style={{fontSize:15,color:'#0096FF',fontWeight: 'bold',marginLeft:10}}>Actual Hour :</Text> 
                {/* <Text style={{fontSize:15,color:'#000',fontWeight: 'bold',marginLeft:10}}>{item.total_hrs}</Text>  */}
                <Text style={{fontSize:10,color:'#000',fontWeight: 'bold',marginLeft:10}}>{item.actualhoure_label}</Text> 


              </View>


              <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:10,marginLeft:5}}>

                <View style={{flexDirection:'row'}}>

                  <Text style={{fontSize:15,color:'#0096FF',fontWeight: 'bold',marginLeft:5}}>Muitiplier :</Text> 
                  <Text style={{fontSize:15,color:'#000',fontWeight: 'bold',marginLeft:25}}>{item.multiplier}</Text> 

                </View>

                <View style={{flexDirection:'row'}}>

                  <Text style={{fontSize:15,color:'#0096FF',fontWeight: 'bold',marginRight:10}}>Rate :</Text> 
                  <Text style={{fontSize:15,color:'#000',fontWeight: 'bold',marginRight:25}}>{item.rate}</Text> 

                </View>

              </View>


              <View style={{backgroundColor:"#2962FF",width:'100%',height:1,marginTop:10}}></View>

              <View style={{flexDirection:'row',marginTop:10}}>

                <Text style={{fontSize:15,color:'#FF5733',fontWeight: 'bold',marginLeft:10}}>Actual Cost :</Text> 
                <Text style={{fontSize:15,color:'#FF5733',fontWeight: 'bold',marginLeft:10}}>{item.act_cost}</Text> 

              </View>

            </View>

            

             
            

      </View>

    );

  }

  const ItemSeparatorView=()=>{

    return (
      // Flat List Item Separator
      <View
      style={{
     
      backgroundColor: '#C8C8C8',
      }}/>
    );
  }


  //Save TIme Card
  const SaveTimeCard =(async()=>{

    var timecard;

    TimeCardList.map(item =>{


      if(item.PMGroupType == '' || item.PMGroupType == null){
        
        

      }else{

        if(!item.assetno){
          setAlert(true,'warning',`Alert line No: ${item.key} Please select asset no`,'OK');
          valid = false;
          return
        }
        
      }

      

      if(!item.originator){

        setAlert(true,'warning',`Alert line No: ${item.key} Please select employee`,'OK');
        valid = false;
        return

      }else{

        if(!item.craft){

          
          setAlert(true,'warning',`Alert line No: ${item.key} Please enter craft`,'OK');
          valid = false;
          return

        }else{

          if(!item.hourtype){

            
            setAlert(true,'warning',`Alert line No: ${item.key} Please enter hour type`,'OK');
            valid = false;
            return

          }else{

            if(!item.datetime1){

              
              setAlert(true,'warning',`Alert line No: ${item.key} Please enter Start DateTime`,'OK');
              valid = false;
              return

            }else{


              if(item.total_hrs < 0){

                
                setAlert(true,'warning',`Alert line No: ${item.key} Please check Start/End DateTime`,'OK');
                valid = false;
                return
  
              }else{

                valid = true;
                 
                timecard = {
                  Header : TimeCardList
                }

                console.log(JSON.stringify(timecard))

              }
              
            }
            
          }
          
        }

      }


     })

     
     if(valid){

      setspinner(true);
      console.log(JSON.stringify(TimeCardList))

      //console.log('Time Card ROW Length:', TimeCardList.length);

      if (WIFI === 'OFFLINE') {

        db.transaction(function (tx) {

          for (let i = 0; i < TimeCardList.length; ++i) {
           
        
            if(TimeCardList[i].id === ''){

              //console.log('Time Card ROW:', TimeCardList[i]);

              console.log("ID EMPTY")

                tx.executeSql('INSERT INTO wko_ls8_timecard (mst_RowID,RowID,site_cd,wko_ls8_assetno,wko_ls8_empl_id,wko_ls8_craft,wko_ls8_hours_type,wko_ls8_hrs,wko_ls8_rate,wko_ls8_multiplier,wko_ls8_adder,wko_ls8_act_cost,wko_ls8_chg_costcenter,wko_ls8_chg_account,wko_ls8_time_card_no,wko_ls8_datetime1,wko_ls8_datetime2,audit_date,audit_user,wko_mst_wo_no,local_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                [TimeCardList[i].mst_RowID,TimeCardList[i].RowId, TimeCardList[i].site_cd,TimeCardList[i].assetno, TimeCardList[i].originator, TimeCardList[i].craft, TimeCardList[i].hourtype, TimeCardList[i].total_hrs, TimeCardList[i].rate, TimeCardList[i].multiplier, TimeCardList[i].adder, TimeCardList[i].act_cost, TimeCardList[i].chg_costcenter, TimeCardList[i].chg_account, TimeCardList[i].time_card_no, TimeCardList[i].datetime1,TimeCardList[i].datetime2, TimeCardList[i].audit_date, TimeCardList[i].audit_user, TimeCardList[i].wko_mst_wo_no,Local_ID],
                (tx, results) => {
                    console.log('wko_ls8_timecard Results_test IF', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('INSERT TABLE wko_ls8_timecard Successfully')

                    }else{ 
                        setspinner(false); 
                        alert('INSERT TABLE wko_ls8_timecard Failed')
                    }

                }
                )


            }else{

                //console.log("ID NOT EMPTY",TimeCardList[i])

                console.log("ID NOT EMPTY")

                tx.executeSql('UPDATE wko_ls8_timecard SET wko_ls8_assetno=?,wko_ls8_empl_id=?,wko_ls8_craft=?,wko_ls8_hours_type=?,wko_ls8_hrs=?,wko_ls8_rate=?,wko_ls8_multiplier=?,wko_ls8_adder=?,wko_ls8_act_cost=?,wko_ls8_chg_costcenter=?,wko_ls8_chg_account=?,wko_ls8_time_card_no=?,wko_ls8_datetime1=?,wko_ls8_datetime2=?,local_id=? WHERE ID=?',
                [TimeCardList[i].assetno,TimeCardList[i].originator,TimeCardList[i].craft,TimeCardList[i].hourtype,TimeCardList[i].total_hrs,TimeCardList[i].rate,TimeCardList[i].multiplier,TimeCardList[i].adder,TimeCardList[i].act_cost,TimeCardList[i].chg_costcenter,TimeCardList[i].chg_account,TimeCardList[i].time_card_no,TimeCardList[i].datetime1,TimeCardList[i].datetime2,Local_ID,TimeCardList[i].id],
                (tx, results) => {
                    console.log('wko_ls8_timecard Results_test ELSE', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('INSERT TABLE wko_ls8_timecard Successfully')

                    }else{ 
                        setspinner(false); 
                        alert('INSERT TABLE wko_ls8_timecard Failed')
                    }

                }
                )

            }
          }

          setspinner(false);
          setAlert(true,'success','Time Card Saved Successfully','INSERT_TC');
          

        });

        



      }else{

        console.log(JSON.stringify(timecard))
            
        try{
          const response = await axios.post(`${Baseurl}/insert_time_card.php?`,JSON.stringify(timecard),
          {headers:{ 'Content-Type': 'application/json'}});
          console.log('Insert asset response:'+ JSON.stringify(response.data));

          if (response.data.status === 'SUCCESS'){
            setspinner(false)
            setAlert(true,'success',response.data.message,'INSERT_TC');
          }else{
              setspinner(false)
              setAlert(true,'danger',response.data.message,'OK');
          }

          }catch(error){

              setspinner(false);
              alert(error);
          } 

      }

    }

  })



  //Selection Dropdown
  const select_dropdown = (dropname, data, select_key) => {
      
      setselect_key(select_key)
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

      if(textvalue == 'Employee') {
          newData = Dropdown_data.filter(function (item) {
          const itemData = `${item.emp_mst_empl_id.toUpperCase()},
              ,${item.emp_mst_title.toUpperCase()}
              ,${item.emp_mst_name.toUpperCase()})`;

          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
          });
      } else if(textvalue == 'PM Group Asset') {
        newData = Dropdown_data.filter(function (item) {
        const itemData = `${item.ast_mst_asset_no.toUpperCase()},
            ,${item.ast_mst_asset_shortdesc.toUpperCase()}
            ,${item.ast_mst_asset_status.toUpperCase()})`;

        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
        });
      } else if(textvalue == 'Craft') {
        newData = Dropdown_data.filter(function (item) {
        const itemData = `${item.emp_ls1_craft.toUpperCase()},
            ,${item.emp_mst_empl_id.toUpperCase()})`;

        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
        });
      } else if(textvalue == 'Hour Type') {
        newData = Dropdown_data.filter(function (item) {
        const itemData = `${item.hours_type_cd.toUpperCase()},
            ,${item.hours_type_multiplier.toUpperCase()})`;

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

      if (textvalue == 'Employee') {
        setDropDownFilteredData(Employee);
      }else if (textvalue == 'PM Group Asset') {
        setDropDownFilteredData(PMGroupAsset);
      }else if (textvalue == 'Craft') {
        setDropDownFilteredData(Craft);
      } else if (textvalue == 'Hour Type') {
        setDropDownFilteredData(HourType);
      } 

      setRefreshing(false);
  }, [refreshing]);


  const renderText = item => {
    

      if (textvalue == 'Employee') {
      return (
          <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
              <View >
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> ID : </Text>
              </View>
              <View style={{flex: 1}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000',marginLeft:34}}> {item.emp_mst_empl_id} </Text>
              </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
              <View >
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Name : </Text>
              </View>
              <View style={{flex: 1}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000',marginLeft:10}}> {item.emp_mst_name} </Text>
              </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
              <View >
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Title : </Text>
              </View>
              <View style={{flex: 1}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000',marginLeft:20}}> {item.emp_mst_title} </Text>
              </View>
          </View>
          </View>
      );
      } else if (textvalue == 'PM Group Asset') {
      return (
          <View style={styles.dropdown_style}>
            {/* Asset No */}
            <View style={{flex:1,justifyContent:'space-between',flexDirection:'row'}}>
                    <Text style={{color:'#2962FF',fontSize: 13,backgroundColor:'#D6EAF8',padding:5, fontWeight: 'bold',borderRadius:10}} > {item.ast_mst_asset_no}</Text>
                    <Text style={{fontSize: 13,color:'#000',marginRight:10}} >{item.ast_mst_asset_status}</Text>
                </View>

                {/* Description */}
                <View style={{flexDirection:"row",marginTop:10}}>
                    <View >
                        <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Description :</Text>
                    </View>
                    <View style={{flex:1}}>
                        <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000',marginLeft:15}} >{item.ast_mst_asset_shortdesc}</Text>
                    </View>
                </View>

                {/* Cost Center */}
                <View style={{flexDirection:"row",marginTop:5}}>
                <View >
                    <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Cost Center :</Text>
                </View>
                <View style={{flex:1}}>
                    <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000',marginLeft:15}} >{item.ast_mst_cost_center}</Text>
                </View>
                </View>

                {/* Work Area  */}
                <View style={{flexDirection:"row",marginTop:5}}>
                <View >
                    <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Work Area :</Text>
                </View>
                <View style={{flex:1}}>
                    <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000',marginLeft:25}} >{item.ast_mst_work_area}</Text>
                </View>
                </View>

                {/* Asset Location */}
                <View style={{flexDirection:"row",marginTop:5}}>
                <View >
                    <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Asset Location :</Text>
                </View>

                <View style={{flex:1}}>
                    <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000',marginLeft:5}} >{item.ast_mst_asset_locn}</Text>
                </View>
                </View>

                {/* Level */}
                <View style={{flexDirection:"row",marginTop:5}}>
                <View >
                    <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Asset Level :</Text>
                </View>
                <View style={{flex:1}}>
                    <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000',marginLeft:15}} >{item.ast_mst_asset_lvl}</Text>
                </View>
                </View>
          </View>
      );
      } else if (textvalue == 'Craft') {
        return (
            <View style={styles.dropdown_style}>
            <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
                <View>
                <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Craft Type : </Text>
                </View>
                <View style={{flex: 1}}>
                <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000',marginLeft:23}}> {item.emp_ls1_craft} </Text>
                </View>
            </View>
    
            <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
                <View >
                <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Charge Rate : </Text>
                </View>
                <View style={{flex: 1}}>
                <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000',marginLeft:10}}> {parseFloat(item.emp_ls1_charge_rate).toFixed(4)} </Text>
                </View>
            </View>
    
          
            </View>
        );
      } else if (textvalue == 'Hour Type') {
        return (
            <View style={styles.dropdown_style}>
            <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
                <View>
                <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Hour Type : </Text>
                </View>
                <View style={{flex: 1}}>
                <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000',marginLeft:20}}> {item.hours_type_cd} </Text>
                </View>
            </View>
    
            <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
                <View >
                <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Multiplier : </Text>
                </View>
                <View style={{flex: 1}}>
                <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000',marginLeft:25}}> {parseFloat(item.hours_type_multiplier).toFixed(4)} </Text>
                </View>
            </View>

            <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
                <View >
                <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Adder : </Text>
                </View>
                <View style={{flex: 1}}>
                <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000',marginLeft:48}}> {parseFloat(item.hours_type_adder).toFixed(4)} </Text>
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
      // alert('Id : ' + JSON.stringify(item.PMGroupType) );

      if (textvalue == 'Employee') {

        console.log("get:"+ditem.emp_mst_empl_id)                    

        db.transaction(function(txn){

          //employee
          txn.executeSql(
              'SELECT * FROM TimeCraft WHERE emp_mst_empl_id=?',
              [ditem.emp_mst_empl_id],
              (tx, results) => {
                  var Craft_temp = [];
                  console.log("get:"+results.rows)
                  for (let i = 0; i < results.rows.length; ++i){   

                    Craft_temp.push(results.rows.item(i));  
                    console.log("get:"+results.rows.item(i).emp_mst_homephone)                    
                  }                    
                  setCraft(Craft_temp)
              }
          );      
          
        
        
        })

          const newData = TimeCardList.map(item =>{
            if(item.key == select_key){
    
                item.originator_label = ditem.emp_mst_empl_id + ' : ' + ditem.emp_mst_name
                item.originator = ditem.emp_mst_empl_id

                item.rate=parseFloat(ditem.emp_ls1_charge_rate).toFixed(2)

                let h =  parseFloat(item.total_hrs)
                let r =  parseFloat(item.rate)
                let a =  parseFloat(item.adder)
                let m =  parseFloat(item.multiplier)

                console.log("H : "+ h)
                console.log("R : "+ r)
                console.log("A : "+ a)
                console.log("M : "+ m)

                let f3 = ((h*(r+a))*m);

                console.log("ACTUAL COST"+ f3)

                item.act_cost = parseFloat(f3).toFixed(2)
        
            return item;
    
            }
            return item;
          })
          //console.log("SELECTED ITEM 23"+ JSON.stringify(newData) )
          setTimeCardList(newData)
          setisRender(!isRender)

      }else if (textvalue == 'PM Group Asset') {

        const newData = TimeCardList.map(item =>{
          if(item.key == select_key){
  
              item.assetno = ditem.ast_mst_asset_no
             
      
          return item;
  
          }
          return item;
        })
        //console.log("SELECTED ITEM 23"+ JSON.stringify(newData) )
        setTimeCardList(newData)
        setisRender(!isRender)
        
                           

        

      }else if (textvalue == 'Craft') {

        const newData = TimeCardList.map(item =>{
          if(item.key == select_key){
  
              item.craft_label = ditem.emp_mst_empl_id + ' : ' + ditem.emp_ls1_craft
              item.craft = ditem.emp_mst_empl_id

              item.rate=parseFloat(ditem.emp_ls1_charge_rate).toFixed(2)

                let h =  parseFloat(item.total_hrs)
                let r =  parseFloat(item.rate)
                let a =  parseFloat(item.adder)
                let m =  parseFloat(item.multiplier)

                console.log("H : "+ h)
                console.log("R : "+ r)
                console.log("A : "+ a)
                console.log("M : "+ m)

                let f3 = ((h*(r+a))*m);

                console.log("ACTUAL COST"+ f3)

                item.act_cost = parseFloat(f3).toFixed(2)
      
          return item;
  
          }
          return item;
        })
        //console.log("SELECTED ITEM 23"+ JSON.stringify(newData) )
        setTimeCardList(newData)
        setisRender(!isRender)

        //console.log("CRAFT :" + ditem.emp_ls1_charge_rate);
        
        

      }else if (textvalue == 'Hour Type') {

        const newData = TimeCardList.map(item =>{
          if(item.key == select_key){
  
              item.hourtype_label = ditem.hours_type_cd
              item.hourtype = ditem.hours_type_cd.split(':')[0].trim()
              item.multiplier=parseFloat(ditem.hours_type_multiplier).toFixed(2)
              item.adder=parseFloat(ditem.hours_type_adder).toFixed(2)
              
                let h =  parseFloat(item.total_hrs)
                let r =  parseFloat(item.rate)
                let a =  parseFloat(item.adder)
                let m =  parseFloat(item.multiplier)

                console.log("H : "+ h)
                console.log("R : "+ r)
                console.log("A : "+ a)
                console.log("M : "+ m)

                let f3 = ((h*(r+a))*m);

                console.log("ACTUAL COST"+ f3)

                item.act_cost = parseFloat(f3).toFixed(2)
      
          return item;
  
          }
          return item;
        })
        //console.log("SELECTED ITEM 23"+ JSON.stringify(newData) )
        setTimeCardList(newData)
        setisRender(!isRender)
        
        

      }      

      setDropDown_search('');
      setDropDown_modalVisible(!DropDown_modalVisible);
  };


  const showDatePicker = (title,select_key) => {
    //console.warn(title)
   
    console.log('title',title);
    console.log('select_key',select_key);
    if(title === 'from'){

      setMINDate('')
      setMAXDate('')
      setselect_key(select_key)
      setDatePickerVisibility(true);
      setDatetitle(title);

    }else if(title ==='to'){

        TimeCardList.map(item =>{
          if(item.key == select_key){

            console.log('select_key',item.datetime1);

            setMINDate(new Date(item.datetime1));
             
      
          return item;

          }
          return item;
        })
        setselect_key(select_key)
        setDatePickerVisibility(true);
        setDatetitle(title);

    }
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    let fromDate = moment(date).format('yyyy-MM-DD HH:mm');
    //console.warn(fromDate)
    if (datetitle === 'from') {
     
      const newData = TimeCardList.map(item =>{
        if(item.key == select_key){

            
            item.datetime1 = fromDate
            item.datetime2 =''
            item.total_hrs=''
            item.actualhoure_label =''
            item.act_cost = ''
    
        return item;

        }
        return item;
      })
      //console.log("SELECTED ITEM 23"+ JSON.stringify(newData) )
      setTimeCardList(newData)
      setisRender(!isRender)

     
      
     
    } else {
     
      const newData = TimeCardList.map(item =>{
        if(item.key == select_key){

            const start = new Date(item.datetime1);
            const end   = new Date(fromDate);
            const range = moment.range(start, end);
          
            var msDiff = range.diff();  
            
            var days = Math.floor(msDiff / (1000 * 60 * 60 * 24)) % 365;
            var hours = Math.floor((msDiff - (1000 * 60 * 60 * 24 * days)) / (1000 * 60 * 60));
            var min = Math.floor(msDiff - (1000 * 60 * 60 * 24 * days) - (1000 * 60 * 60 * hours)) / (1000 * 60);

            var Min = Math.floor(msDiff/(1000 * 60))
            var  act_hour = Math.floor(Min/60);

              console.log("Min:", Min);
              console.log("act_hour:", act_hour);
      
              console.log("Total Duration in millis:", msDiff);
              console.log("Days:", days);
              console.log("Hours:", hours);
              console.log("Minutes:", min);


            if(act_hour < 0){

              setAlert(true,'warning',`Time Card Actual Hour: ${act_hour} is negative hour please check start & end date/time`,'OK');
              

            }else{

              item.datetime2 = fromDate
      
              if(days == 0){
                item.total_hrs = msDiff
                item.actualhoure_label =('( '+days+' Days, '+hours+' Hours, '+min+' Minutes'+' )')
              }else{
                 item.total_hrs = msDiff
                item.actualhoure_label =('( '+days+' Days, '+hours+' Hours, '+min+' Minutes'+' )')
              }
          
              let h =  parseFloat(hours)
              let r =  parseFloat(item.rate)
              let a =  parseFloat(item.adder)
              let m =  parseFloat(item.multiplier)

              console.log("H : "+ h)
              console.log("R : "+ r)
              console.log("A : "+ a)
              console.log("M : "+ m)

              console.log("M : "+ h*(r+a))

              let f3 = ((h*(r+a))*m);

              console.log("ACTUAL COST"+ f3)

              item.act_cost = parseFloat(f3).toFixed(2)
      
              return item;

            }
    
            

        }
        return item;
      })
      //console.log("SELECTED ITEM 23"+ JSON.stringify(newData) )
      setTimeCardList(newData)
      setisRender(!isRender)
    }

    hideDatePicker();
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
    setAlertData(value);

  }


  const One_Alret_onClick =(D) =>{

    if(D === 'OK'){

      setShow(false)

    }else if(D === 'INSERT_TC'){

      setShow(false)

      _goBack()

    }

  }

  const Alret_onClick =(D) =>{

    setShow_two(false)

    if(D === 'BACK'){

      _goBack()

    }else if(D === 'REMOVE_LINE'){

        setTimeCardList(TimeCardList.slice().filter((item)=>item.key !==AlertData))
    } 

  }

  return (
    <SafeAreaProvider>

      <Appbar.Header style={{backgroundColor:"#42A5F5"}}>
          <View style={{flexDirection:'row',flex:1,justifyContent:'space-between'}}>
              <Pressable onPress={_goBack}>
                  <View style={{flexDirection:'row',alignItems:'center',}}>
                      <FontAwesome 
                          name="angle-left"
                          color='#fff'
                          size={55}
                          style={{marginLeft:15,marginBottom:5}}
                      />  
                      <Text style={{fontSize:20, justifyContent:'center',textAlign:'center',color:'#fff',fontWeight: 'bold',marginLeft:15}}>{Toolbartext}</Text> 
                  </View >
              </Pressable>
          </View>
      </Appbar.Header> 


        <SCLAlert theme={Theme} show={Show} title={Title}>
          <SCLAlertButton theme={Theme}   onPress={()=>One_Alret_onClick(AlertType)}>OK</SCLAlertButton>
        </SCLAlert>

        <SCLAlert theme={Theme} show={Show_two} title={Title} >
          <SCLAlertButton theme={Theme}  onPress={()=>Alret_onClick(AlertType)}>Yes</SCLAlertButton>
          <SCLAlertButton theme="default" onPress={()=>setShow_two(false)}>No</SCLAlertButton>
        </SCLAlert>

      <ProgressLoader visible={spinner} isModal={true} isHUD={true} hudColor={"#808080"} color={"#FFFFFF"} /> 

      <DateTimePicker
        isVisible={isDatepickerVisible}
        mode="datetime"
        locale="en_GB"
        minimumDate={ Platform.OS === 'ios' ? MINDate : MINDate || null}
        maximumDate={ Platform.OS === 'ios' ? MAXDate : MAXDate || null}
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
              <View style={{flexDirection: 'row', alignItems: 'center', height: 50}}>
                <Text style={{ flex: 1, fontSize: 15, justifyContent: 'center', textAlign: 'center', color: '#000', fontWeight: 'bold', }}>{textvalue}</Text>
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

       

      <View style={{  flex: 1, marginBottom: 80}}>

        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : null} 
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>    

          <FlatList
            data={TimeCardList}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={ItemSeparatorView}
            renderItem={ItemView}       
            extraData={isRender}     
          
          />

        </KeyboardAwareScrollView>
      
      </View>


      <View style={ styles.bottomView} >
        <TouchableOpacity
            style={{width:'50%',height:60,backgroundColor:'#0096FF',
            alignItems:'center',justifyContent:'center',fontWeight: 'bold'}} onPress={()=> addItem()} 
        >
        <Text style={{color:'white', fontSize: 16}}>Start</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={{width:'50%',height:60,backgroundColor:'#8BC34A',marginLeft:5,
            alignItems:'center',justifyContent:'center',fontWeight: 'bold'}} onPress={()=> SaveTimeCard()} 
        >
        <Text style={{color:'white', fontSize: 16}}>Save</Text>
        </TouchableOpacity>
        </View>

   </SafeAreaProvider>
  )
}

export default TimeCard;


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#e0e0eb'
  },

  bottomView:{
    flex:1,
    flexDirection:'row',
    width: '100%', 
    height: 60, 
    justifyContent: 'center', 
    alignItems: 'center',
    position: 'absolute',
    bottom: 0
  },
  card: {

    backgroundColor: '#FFFFFF',
    margin:15,
    borderRadius: 15,  
    padding:15    
  },
  card_row: {

    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center' 
  },

  card_button: {

    flexDirection:'row',
    justifyContent:'space-between',
    marginTop:15 ,
    alignItems:'center' 
  },

  text_footer: {         
    fontSize: 13,
    color: '#42A5F5'
  },

  action: {
    flexDirection: 'row',
    height:40,
    borderWidth: 1,
    alignItems:'center',     
    marginTop:5,  
    borderColor: '#808080',
    borderRadius: 5,
   
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : 7,
    paddingLeft: 10,
    fontSize:13,
    color: '#05375a'
    
},
model2_cardview:{

  flex:1,
  marginTop:50,
  backgroundColor:'rgba(0,0,0,0.8)'

},
PM_item:{
   
  backgroundColor: '#fff',
  padding: 10,
  borderRadius: 10,
  

},

view_style: {
  flex:1,
  marginTop: 15,
  marginLeft: 5,
  marginRight:5,
},

input: {
  paddingHorizontal: 12,
  borderRadius: 5,
  borderWidth: 1,
  borderColor: '#808080',
},

inputStyle: {fontSize: 15, marginTop: Platform.OS === 'ios' ? 8 : 0,textAlign:'left'},

labelStyle: {
  fontSize: 13,
  position: 'absolute',
  top: -10,
  color: '#0096FF',
  backgroundColor: 'white',
  paddingHorizontal: 4,
  marginLeft: -4,
  fontWeight: 'bold'
},
textErrorStyle: {fontSize: 16},

model2_cardview: {
  flex: 1,
  marginTop: 50,
  backgroundColor: 'rgba(0,0,0,0.8)',
},
dropdown_style: {
  margin: 10,
},
item:{
  margin:10,
  borderRadius: 10,
},

});