import React from 'react'
import {  View,  StyleSheet,Text, RefreshControl,Image,FlatList ,BackHandler,TouchableOpacity,Alert, Pressable,Button,Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressLoader from 'rn-progress-loader';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import axios from "axios";
import { Appbar } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { openDatabase } from 'react-native-sqlite-storage';
import DeviceInfo from 'react-native-device-info'
import Ionicons from 'react-native-vector-icons/Ionicons';
import ModalSelector from 'react-native-modal-selector-searchable'
import BouncyCheckbox from "react-native-bouncy-checkbox";
import {TextInput} from 'react-native-element-textinput';
import DateTimePicker from 'react-native-modal-datetime-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {SearchBar} from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign';

import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';
import { Time } from 'react-native-gifted-chat';

const moment = extendMoment(Moment);

var db = openDatabase({ name: 'CMMS.db' });
let Baseurl,Site_cd,LoginID,EmpName,EmpID,EmpPhone,EmpWorkGrp,dvc_id,WIFI,Local_ID,mst_RowID;


const AssetDowntime = ({route,navigation}) => {

  var valid = false;

  const [spinner, setspinner]= React.useState(false);
  const [Toolbartext, setToolbartext]= React.useState("Asset Downtime");
  const [Editable, setEditable] = React.useState(false);
  const [OSD_Editable, setOSD_Editable] = React.useState(false);
  const [height, setHeight] = React.useState(0);


  const [AssestDowntimeList,setAssestDowntimeList] =  React.useState([]);
  const [isRender,setisRender]=React.useState(false);

  const [isDatepickerVisible,setDatePickerVisibility]=React.useState(false);
  const [Type, setType] = React.useState('');
  const [select_key, setselect_key] = React.useState('');
  let count=0;


  const [OSD,setOSD] =  React.useState('');
  const [RSD,setRSD] =  React.useState('');
  const [RFD,setRFD] =  React.useState('');
  const [RTD,setRTD] =  React.useState('');
  const [MINDate,setMINDate] =  React.useState();
  const [MAXDate,setMAXDate] =  React.useState();

  //Alert
  const [Show, setShow] = React.useState(false);
  const [Show_two, setShow_two] = React.useState(false);
  const [Theme, setTheme] = React.useState('');
  const [Title, setTitle] = React.useState('');
  const [AlertType, setAlertType] = React.useState('');
  const [AlertData, setAlertData] = React.useState('');

  const [PMGroupAsset,setPMGroupAsset] = React.useState([]);

  //DropDown Modal
  const [textvalue, settextvalue] = React.useState('');
  const [Boxtextvalue, setBoxtextvalue] = React.useState('');
  const [Dropdown_data, setDropdown_data] = React.useState([]);
  const [DropDownFilteredData, setDropDownFilteredData] = React.useState([]);
  const [DropDown_modalVisible, setDropDown_modalVisible] = React.useState(false);
  const [DropDown_search, setDropDown_search] = React.useState('');
  const [refreshing, setRefreshing] = React.useState(false);

  const _goBack = () => {

    if (route.params.Screenname == 'FilteringWorkOrder') {
        navigation.navigate('CreateWorkOrder',{

          Selected_WorkOrder_no:route.params.Selected_WorkOrder_no,
          RowID:route.params.RowID,
         
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
    }else  if (route.params.Screenname == 'MyWorkOrder') {
        navigation.navigate('CreateWorkOrder',{

            Selected_WorkOrder_no:route.params.Selected_WorkOrder_no,
            RowID:route.params.RowID,

            local_id:route.params.local_id,
            Selected_wko_mst_ast_cod:route.params.Selected_wko_mst_ast_cod,
            Selected_wko_mst_type:route.params.Selected_wko_mst_type,
            Screenname:route.params.Screenname,

        });
    } else if (route.params.Screenname == 'WoDashboard' || route.params.Screenname == 'MYWO_Dashboard_Due' || route.params.Screenname == 'MYWO_Dashboard_Past') {
        navigation.navigate('CreateWorkOrder',{

            Selected_WorkOrder_no:route.params.Selected_WorkOrder_no,
            RowID:route.params.RowID,

            local_id:route.params.local_id,
            Selected_wko_mst_ast_cod:route.params.Selected_wko_mst_ast_cod,
            Selected_wko_mst_type:route.params.Selected_wko_mst_type,

            Screenname:route.params.Screenname,
            type:route.params.type,

        });
    }else if (route.params.Screenname == 'ScanAssetMaster') {

        if(route.params.ScanAssetType =='New'){

            navigation.navigate('CreateWorkOrder',{


                Screenname:route.params.Screenname,
                ScanAssetType:route.params.ScanAssetType,
                ScanAssetRowID:route.params.ScanAssetRowID,
                ScanAssetno:route.params.ScanAssetno,
    
            });

        }else if(route.params.ScanAssetType =='Edit'){

            navigation.navigate('CreateWorkOrder',{

                Selected_WorkOrder_no:route.params.Selected_WorkOrder_no,
                RowID:route.params.RowID,

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
    // Alert.alert("Alert", "Do you want to exit asset downtime screen?", [
    //   {
    //     text: "Cancel",
    //     onPress: () => null,
    //     style: "cancel"
    //   },
    //   { text: "YES", onPress: () => _goBack() }
    // ]);
    setAlert_two(true,'warning','Do you want to exit downtime screen?','BACK')
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

    var sync_date = moment().format('YYYY-MM-DD hh:mm');
    dvc_id = DeviceInfo.getDeviceId();

    Baseurl = await AsyncStorage.getItem('BaseURL');
    Site_cd = await AsyncStorage.getItem('Site_Cd');
    LoginID = await AsyncStorage.getItem('emp_mst_login_id');
    EmpName = await AsyncStorage.getItem('emp_mst_name');
    EmpID = await AsyncStorage.getItem('emp_mst_empl_id');
    EmpPhone = await AsyncStorage.getItem('emp_mst_homephone');
    EmpWorkGrp = await AsyncStorage.getItem('emp_det_work_grp');
    WIFI = await AsyncStorage.getItem('WIFI');

    console.log(EmpID);
    console.log('WorkOrder_no:', route.params.Selected_WorkOrder_no)
    console.log('mst_RowID:', route.params.RowID)

    console.log('ASSETNO:', route.params.Selected_AssetNo)
    console.log('CostCenter:', route.params.Selected_CostCenter)
    console.log('LaborAccount:', route.params.Selected_LaborAccount)
    console.log('ContractAccount:', route.params.Selected_ContractAccount)
    console.log('MaterialAccount:', route.params.Selected_MaterialAccount)
    console.log('PMGroupType:', route.params.Selected_PMGroupType)

    console.log("WORK DATA:  "+ WIFI);

    mst_RowID =route.params.RowID;
    Local_ID =route.params.local_id;

    console.log('WORK DATA LOCAL ID :  ' + Local_ID);
    console.log('WORK DATA MST_ROWID:', mst_RowID);


    if (WIFI === 'OFFLINE') {
      get_assetdowntime_list_offline()
    }else{
      get_assetdowntime_list();
    }

    

  }



  //GET ASSEST DOWNTIME LIST API ONLINE
  const get_assetdowntime_list=(async()=>{

    setspinner(true);
    try{

      console.log("JSON DATA : " + `${Baseurl}/get_work_order_asset_downtime.php?site_cd=${(Site_cd)}&ast_dwntime_down_wo=${route.params.Selected_WorkOrder_no}&ast_dwntime_asset_no=${route.params.Selected_AssetNo}`)
      const response = await axios.get(`${Baseurl}/get_work_order_asset_downtime.php?site_cd=${(Site_cd)}&ast_dwntime_down_wo=${route.params.Selected_WorkOrder_no}&ast_dwntime_asset_no=${route.params.Selected_AssetNo}`);

      console.log("JSON DATA : " + JSON.stringify( response.data.data))
      
      if (response.data.status === 'SUCCESS') 
      {

        if(response.data.data.length>0){

          for (let i = 0; i < response.data.data.length; ++i) {

            let key = i + 1

            var out_Date,return_Date,from_Date,to_Date,check_value,DownT,TOT,PMGroupType;

            console.log('wko_auto_numbering:' + response.data.data[i].ast_dwntime_out_date.date);

            let outDate = moment(response.data.data[i].ast_dwntime_out_date.date).format('yyyy-MM-DD HH:mm')
            console.log(outDate)
            if(outDate === '1900-01-01 00:00'){
                out_Date ='';
            }else {
                setOSD_Editable(true)
                out_Date = outDate;
            }

            let returnDate = moment(response.data.data[i].ast_dwntime_rts_date.date).format('yyyy-MM-DD HH:mm')
            
            if(returnDate === '1900-01-01 00:00'){
              return_Date ='';
              DownT =('( '+ 0 + ' Days ' + 0 +' Hours '+ 0 +' Mins ' +' )');
            }else {
              
              return_Date = returnDate;

              const start = new Date(out_Date);
              const end   = new Date(return_Date);
              const range = moment.range(start, end);
            
              var msDiff = range.diff();    
              var days = Math.floor(msDiff / (1000 * 60 * 60 * 24)) % 365;
              var hours = Math.floor((msDiff - (1000 * 60 * 60 * 24 * days)) / (1000 * 60 * 60));
              var min = Math.floor(msDiff - (1000 * 60 * 60 * 24 * days) - (1000 * 60 * 60 * hours)) / (1000 * 60);
      
              console.log(days +':'+ hours +':'+  min);

              DownT =('( '+ days + ' Days ' + hours +' Hours '+ min +' Mins ' +' )');

            }

            

            let fromDate = moment(response.data.data[i].ast_dwntime_repair_from.date).format('yyyy-MM-DD HH:mm')
            
            if(fromDate === '1900-01-01 00:00'){
              from_Date ='';
            }else {
              from_Date = fromDate;
            }


            let toDate = moment(response.data.data[i].ast_dwntime_repair_to.date).format('yyyy-MM-DD HH:mm')
            
            if(toDate === '1900-01-01 00:00'){
              to_Date ='';

              TOT =('( '+ 0 + ' Days ' + 0 +' Hours '+ 0 +' Mins ' +' )');
            }else {
              to_Date = toDate;

              const start = new Date(from_Date);
              const end   = new Date(to_Date);
              const range = moment.range(start, end);
            
              var msDiff = range.diff();    
              var days = Math.floor(msDiff / (1000 * 60 * 60 * 24)) % 365;
              var hours = Math.floor((msDiff - (1000 * 60 * 60 * 24 * days)) / (1000 * 60 * 60));
              var min = Math.floor(msDiff - (1000 * 60 * 60 * 24 * days) - (1000 * 60 * 60 * hours)) / (1000 * 60);
      
              console.log(days +':'+ hours +':'+  min);

              TOT =('( '+ days + ' Days ' + hours +' Hours '+ min +' Mins ' +' )');

            }

            let desc = response.data.data[i].ast_dwntime_remark
            let dwntime= response.data.data[i].ast_dwntime_downtime
            let reprtime= response.data.data[i].ast_dwntime_repairtime
            let sched_flg = response.data.data[i].ast_dwntime_sched_flag


            let down_wo = response.data.data[i].ast_dwntime_down_wo
            let up_wo = response.data.data[i].ast_dwntime_up_wo

            let rowid = response.data.data[i].rowid
            let sitecd = response.data.data[i].site_cd
            let assetno = response.data.data[i].ast_dwntime_asset_no


            if(response.data.data[i].ast_dwntime_sched_flag == '0'){
              check_value=false
            }else{
              check_value=true
            }
            if(route.params.Selected_PMGroupType == '' || route.params.Selected_PMGroupType == null){
              
               PMGroupType = false
            }else{
             
               PMGroupType= true;
    
            }

            
            let ID = response.data.data[i].ID

            setAssestDowntimeList(AssestDowntimeList =>[...AssestDowntimeList,
                        
              {
                key:key,
                site_cd:sitecd,
                ast_dwntime_asset_no:assetno,
                ast_dwntime_out_date:out_Date,
                ast_dwntime_out_date_MIN:'',
                ast_dwntime_rts_date:return_Date,
                ast_dwntime_rts_date_MIN:'',
                ast_dwntime_downtime_label:DownT,
                ast_dwntime_downtime:dwntime,
                ast_dwntime_repair_from:from_Date,
                ast_dwntime_repair_from_MIN:'',
                ast_dwntime_repair_to:to_Date,
                ast_dwntime_repair_to_MIN:'',
                ast_dwntime_repairtime_label:TOT,
                ast_dwntime_repairtime:reprtime,
                ast_dwntime_down_wo:down_wo,
                ast_dwntime_up_wo:up_wo,
                ast_dwntime_status_original:'',
                ast_dwntime_status_down:'',
                ast_dwntime_status_up:'',
                ast_dwntime_sched_flag:sched_flg,
                ast_dwntime_sched_flag_label:check_value,
                ast_dwntime_remark:desc,
                LOGINID:LoginID,
                EmpID:EmpID,
                RowID:rowid,
                coloum:'edit',
                id:ID,
                PMGroupType   
              },
            ]);

          }

          if(route.params.Selected_PMGroupType === ''){
            setspinner(false);
          }else{
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
            setAlert(true,'danger',response.data.message,'OK');
        }

      }catch(error){

          setspinner(false);
          alert(error);
      } 



  });

   //GET RESPONS OFFLINE
   const get_assetdowntime_list_offline = async () =>{


    if(!mst_RowID){

      console.log("not Empty")

      db.transaction(function(txn){

       //GET OFFLINE RESPONS
       txn.executeSql('SELECT * FROM ast_dwntime WHERE  local_id =?',
       [Local_ID], (tx, results) => {
        
          var temp = [];
          console.log("get empty:"+JSON.stringify(results.rows.length));
          if(results.rows.length>0){

            for (let i = 0; i < results.rows.length; ++i) {


              let key = i + 1

              var out_Date,return_Date,from_Date,to_Date,check_value,DownT,TOT,PMGroupType;

            
              if(results.rows.item(i).ast_dwntime_out_date === ''){
                  out_Date ='';
              }else {
                  setOSD_Editable(true)
                  out_Date = moment(results.rows.item(i).ast_dwntime_out_date).format('yyyy-MM-DD HH:mm');
              }

            
            
              if(results.rows.item(i).ast_dwntime_rts_date === ''){
                return_Date ='';
                DownT =('( '+ 0 + ' Days ' + 0 +' Hours '+ 0 +' Mins ' +' )');
              }else {
                
                return_Date = moment(results.rows.item(i).ast_dwntime_rts_date).format('yyyy-MM-DD HH:mm');

                const start = new Date(out_Date);
                const end   = new Date(return_Date);
                const range = moment.range(start, end);
              
                var msDiff = range.diff();    
                var days = Math.floor(msDiff / (1000 * 60 * 60 * 24)) % 365;
                var hours = Math.floor((msDiff - (1000 * 60 * 60 * 24 * days)) / (1000 * 60 * 60));
                var min = Math.floor(msDiff - (1000 * 60 * 60 * 24 * days) - (1000 * 60 * 60 * hours)) / (1000 * 60);
        
                console.log(days +':'+ hours +':'+  min);

                DownT =('( '+ days + ' Days ' + hours +' Hours '+ min +' Mins ' +' )');

              }

          
            
              if(results.rows.item(i).ast_dwntime_repair_from === ''){
                from_Date ='';
              }else {
                from_Date = moment(results.rows.item(i).ast_dwntime_repair_from).format('yyyy-MM-DD HH:mm');
              }

              
              if(results.rows.item(i).ast_dwntime_repair_to === ''){
                to_Date ='';

                TOT =('( '+ 0 + ' Days ' + 0 +' Hours '+ 0 +' Mins ' +' )');
              }else {
                to_Date = moment(results.rows.item(i).ast_dwntime_repair_to).format('yyyy-MM-DD HH:mm');

                const start = new Date(out_Date);
                const end   = new Date(return_Date);
                const range = moment.range(start, end);
              
                var msDiff = range.diff();    
                var days = Math.floor(msDiff / (1000 * 60 * 60 * 24)) % 365;
                var hours = Math.floor((msDiff - (1000 * 60 * 60 * 24 * days)) / (1000 * 60 * 60));
                var min = Math.floor(msDiff - (1000 * 60 * 60 * 24 * days) - (1000 * 60 * 60 * hours)) / (1000 * 60);
        
                console.log(days +':'+ hours +':'+  min);

                TOT =('( '+ days + ' Days ' + hours +' Hours '+ min +' Mins ' +' )');

              }

              let desc = results.rows.item(i).ast_dwntime_remark
              let dwntime= results.rows.item(i).ast_dwntime_downtime
              let reprtime= results.rows.item(i).ast_dwntime_repairtime
              let sched_flg = results.rows.item(i).ast_dwntime_sched_flag


              let down_wo = results.rows.item(i).ast_dwntime_down_wo
              let up_wo = results.rows.item(i).ast_dwntime_up_wo

              let rowid = results.rows.item(i).rowid
              let sitecd = results.rows.item(i).site_cd
              let assetno = results.rows.item(i).ast_dwntime_asset_no


              if(results.rows.item(i).ast_dwntime_sched_flag == '0'){
                check_value=false
              }else{
                check_value=true
              }

              if(route.params.Selected_PMGroupType == '' || route.params.Selected_PMGroupType == null){
              
                PMGroupType = false
             }else{
              
                PMGroupType= true;
     
             }

              let ID = results.rows.item(i).ID

            setAssestDowntimeList(AssestDowntimeList =>[...AssestDowntimeList,
                        
              {
                key:key,
                site_cd:sitecd,
                ast_dwntime_asset_no:assetno,
                ast_dwntime_out_date:out_Date,
                ast_dwntime_out_date_MIN:'',
                ast_dwntime_rts_date:return_Date,
                ast_dwntime_rts_date_MIN:'',
                ast_dwntime_downtime_label:DownT,
                ast_dwntime_downtime:dwntime,
                ast_dwntime_repair_from:from_Date,
                ast_dwntime_repair_from_MIN:'',
                ast_dwntime_repair_to:to_Date,
                ast_dwntime_repair_to_MIN:'',
                ast_dwntime_repairtime_label:TOT,
                ast_dwntime_repairtime:reprtime,
                ast_dwntime_down_wo:down_wo,
                ast_dwntime_up_wo:up_wo,
                ast_dwntime_status_original:'',
                ast_dwntime_status_down:'',
                ast_dwntime_status_up:'',
                ast_dwntime_sched_flag:sched_flg,
                ast_dwntime_sched_flag_label:check_value,
                ast_dwntime_remark:desc,
                LOGINID:LoginID,
                EmpID:EmpID,
                RowID:rowid,
                coloum:'edit',
                id:ID,
                PMGroupType   
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
      console.log(" Empty")


      db.transaction(function(txn){

        //GET OFFLINE RESPONS
        txn.executeSql('SELECT * FROM ast_dwntime WHERE  ast_dwntime_down_wo =?',
        [route.params.Selected_WorkOrder_no], (tx, results) => {
         
           var temp = [];
           console.log("get empty:"+JSON.stringify(results.rows.length));
           if(results.rows.length>0){
 
             for (let i = 0; i < results.rows.length; ++i) {

              console.log("get LIST:"+JSON.stringify(results.rows.item(i)));

              let key = i + 1

              var out_Date,return_Date,from_Date,to_Date,check_value,DownT,TOT,PMGroupType;

            
              if(results.rows.item(i).ast_dwntime_out_date === ''){
                  out_Date ='';
              }else {
                  setOSD_Editable(true)
                  out_Date = moment(results.rows.item(i).ast_dwntime_out_date).format('yyyy-MM-DD HH:mm');
              }

            
            
              if(results.rows.item(i).ast_dwntime_rts_date === ''){
                return_Date ='';
                DownT =('( '+ 0 + ' Days ' + 0 +' Hours '+ 0 +' Mins ' +' )');
              }else {
                
                return_Date = moment(results.rows.item(i).ast_dwntime_rts_date).format('yyyy-MM-DD HH:mm');

                const start = new Date(out_Date);
                const end   = new Date(return_Date);
                const range = moment.range(start, end);
              
                var msDiff = range.diff();    
                var days = Math.floor(msDiff / (1000 * 60 * 60 * 24)) % 365;
                var hours = Math.floor((msDiff - (1000 * 60 * 60 * 24 * days)) / (1000 * 60 * 60));
                var min = Math.floor(msDiff - (1000 * 60 * 60 * 24 * days) - (1000 * 60 * 60 * hours)) / (1000 * 60);
        
                console.log(days +':'+ hours +':'+  min);

                DownT =('( '+ days + ' Days ' + hours +' Hours '+ min +' Mins ' +' )');

              }

          
            
              if(results.rows.item(i).ast_dwntime_repair_from === ''){
                from_Date ='';
              }else {
                from_Date = moment(results.rows.item(i).ast_dwntime_repair_from).format('yyyy-MM-DD HH:mm');
              }

              
              if(results.rows.item(i).ast_dwntime_repair_to === ''){
                to_Date ='';

                TOT =('( '+ 0 + ' Days ' + 0 +' Hours '+ 0 +' Mins ' +' )');
              }else {
                to_Date = moment(results.rows.item(i).ast_dwntime_repair_to).format('yyyy-MM-DD HH:mm');

                const start = new Date(out_Date);
                const end   = new Date(return_Date);
                const range = moment.range(start, end);
              
                var msDiff = range.diff();    
                var days = Math.floor(msDiff / (1000 * 60 * 60 * 24)) % 365;
                var hours = Math.floor((msDiff - (1000 * 60 * 60 * 24 * days)) / (1000 * 60 * 60));
                var min = Math.floor(msDiff - (1000 * 60 * 60 * 24 * days) - (1000 * 60 * 60 * hours)) / (1000 * 60);
        
                console.log(days +':'+ hours +':'+  min);

                TOT =('( '+ days + ' Days ' + hours +' Hours '+ min +' Mins ' +' )');

              }

              let desc = results.rows.item(i).ast_dwntime_remark
              let dwntime= results.rows.item(i).ast_dwntime_downtime
              let reprtime= results.rows.item(i).ast_dwntime_repairtime
              let sched_flg = results.rows.item(i).ast_dwntime_sched_flag


              let down_wo = results.rows.item(i).ast_dwntime_down_wo
              let up_wo = results.rows.item(i).ast_dwntime_up_wo

              let rowid = results.rows.item(i).rowid
              let sitecd = results.rows.item(i).site_cd
              let assetno = results.rows.item(i).ast_dwntime_asset_no


              if(results.rows.item(i).ast_dwntime_sched_flag == '0'){
                check_value=false
              }else{
                check_value=true
              }
              if(route.params.Selected_PMGroupType == '' || route.params.Selected_PMGroupType == null){
              
                PMGroupType = false
             }else{
              
                PMGroupType= true;
     
             }

              let ID = results.rows.item(i).ID

            setAssestDowntimeList(AssestDowntimeList =>[...AssestDowntimeList,
                        
              {
                key:key,
                site_cd:sitecd,
                ast_dwntime_asset_no:assetno,
                ast_dwntime_out_date:out_Date,
                ast_dwntime_out_date_MIN:'',
                ast_dwntime_rts_date:return_Date,
                ast_dwntime_rts_date_MIN:'',
                ast_dwntime_downtime_label:DownT,
                ast_dwntime_downtime:dwntime,
                ast_dwntime_repair_from:from_Date,
                ast_dwntime_repair_from_MIN:'',
                ast_dwntime_repair_to:to_Date,
                ast_dwntime_repair_to_MIN:'',
                ast_dwntime_repairtime_label:TOT,
                ast_dwntime_repairtime:reprtime,
                ast_dwntime_down_wo:down_wo,
                ast_dwntime_up_wo:up_wo,
                ast_dwntime_status_original:'',
                ast_dwntime_status_down:'',
                ast_dwntime_status_up:'',
                ast_dwntime_sched_flag:sched_flg,
                ast_dwntime_sched_flag_label:check_value,
                ast_dwntime_remark:desc,
                LOGINID:LoginID,
                EmpID:EmpID,
                RowID:rowid,
                coloum:'edit',
                id:ID,
                PMGroupType 
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
    }

    

  };


  //Add Contract Service Line 
  const addItem =(()=>{

    console.log(AssestDowntimeList.length);

    if(AssestDowntimeList.length > 0){

      AssestDowntimeList.map(item =>{

        if(item.PMGroupType){

          if(!item.ast_dwntime_asset_no){
            
            setAlert(true,'warning',`Alert line No: ${item.key} Please select asset no`,'OK');
            valid =false
            return

          }
        }

        if(!item.ast_dwntime_out_date){

            setAlert(true,'warning',`Alert line No: ${item.key} Please select out of service date`,'OK');
            valid= false
            return
  
        }else{

          if(!item.ast_dwntime_rts_date){

              setAlert(true,'warning',`Alert line No: ${item.key} Please select return to service date`,'OK');
              valid= false
              return
    
          }else{
  
            valid =true
          }

        }
  
      })

      if(valid){

        let key = AssestDowntimeList.length + 1;

        let Assetno,PMGroupType;
        if(route.params.Selected_PMGroupType == '' || route.params.Selected_PMGroupType == null){
          Assetno=route.params.Selected_AssetNo;
          PMGroupType = false
        }else{
        if(route.params.Selected_PMGroupType === 'G'){
          Assetno = ""
          PMGroupType= true;
        }else{
          Assetno=route.params.Selected_AssetNo;
          PMGroupType = false
        }

        }

        setAssestDowntimeList(AssestDowntimeList =>[...AssestDowntimeList,
                            
          {
            key:key,
            site_cd:Site_cd,
            ast_dwntime_asset_no:Assetno,
            ast_dwntime_out_date:'',
            ast_dwntime_out_date_MIN:'',
            ast_dwntime_rts_date:'',
            ast_dwntime_rts_date_MIN:'',
            ast_dwntime_downtime_label:'',
            ast_dwntime_downtime:'',
            ast_dwntime_repair_from:'',
            ast_dwntime_repair_from_MIN:'',
            ast_dwntime_repair_to:'',
            ast_dwntime_repair_to_MIN:'',
            ast_dwntime_repairtime_label:'',
            ast_dwntime_repairtime:'',
            ast_dwntime_down_wo:'',
            ast_dwntime_up_wo:'',
            ast_dwntime_status_original:'',
            ast_dwntime_status_down:'',
            ast_dwntime_status_up:'',
            ast_dwntime_sched_flag:'0',
            ast_dwntime_sched_flag_label:false,
            ast_dwntime_remark:'',
            LOGINID:LoginID,
            EmpID:EmpID,
            RowID:null,
            coloum:'New',
            id:'',
            PMGroupType:PMGroupType   
          },

          ]);
      }

    }else{
      let key = AssestDowntimeList.length + 1;

      let Assetno,PMGroupType;
        if(route.params.Selected_PMGroupType == '' || route.params.Selected_PMGroupType == null){
          Assetno=route.params.Selected_AssetNo;
          PMGroupType = false
        }else{
        if(route.params.Selected_PMGroupType === 'G'){
          Assetno = ""
          PMGroupType= true;
        }else{
          Assetno=route.params.Selected_AssetNo;
          PMGroupType = false
        }

        }

      setAssestDowntimeList(AssestDowntimeList =>[...AssestDowntimeList,
                          
        {
          key:key,
          
          site_cd:Site_cd,
          ast_dwntime_asset_no:Assetno,
          ast_dwntime_out_date:'',
          ast_dwntime_out_date_MIN:'',
          ast_dwntime_rts_date:'',
          ast_dwntime_rts_date_MIN:'',
          ast_dwntime_downtime_label:'',
          ast_dwntime_downtime:'',
          ast_dwntime_repair_from:'',
          ast_dwntime_repair_from_MIN:'',
          ast_dwntime_repair_to:'',
          ast_dwntime_repair_to_MIN:'',
          ast_dwntime_repairtime_label:'',
          ast_dwntime_repairtime:'',
          ast_dwntime_down_wo:'',
          ast_dwntime_up_wo:'',
          ast_dwntime_status_original:'',
          ast_dwntime_status_down:'',
          ast_dwntime_status_up:'',
          ast_dwntime_sched_flag:'0',
          ast_dwntime_sched_flag_label:false,
          ast_dwntime_remark:'',
          LOGINID:LoginID,
          EmpID:EmpID,
          RowID:null  ,
          coloum:'New',
          id:'',
          PMGroupType:PMGroupType 
        },
  
        ]);
    }


  });


  const ItemView =({item,index})=>{

    console.log("ADD : "+item.key)

    if(item.coloum === 'New'){

      var show = false;
    }else{
      var show = true;
    }
    return(

      <View style={styles.card}>

        {/* Line */}
        <View style={styles.card_row}>                      

            <Text style={{fontSize:15, justifyContent:'center',marginLeft:10,color:'#0096FF',fontWeight: 'bold'}}>Downtime Line no: { item.key}</Text> 

            <Ionicons style={{display: !show ? 'flex' : 'none'}} name="close" color={'red'} size={35} disabled={item.remove_editable} onPress={()=>removeItem(item.key)} /> 
    
        </View>

        <View style={{width:'100%',backgroundColor:'#0096FF',height:1,marginTop:5}} ></View>

          {/* Asset No */}
          <View style={[styles.view_style,{display: item.PMGroupType ? 'flex' : 'none'}]}>
            <Pressable
                onPress={() => !item.Editable ? select_dropdown('PM Group Asset',PMGroupAsset,item.key) : '' } >
                <View pointerEvents={'none'}>
                <TextInput
                    value={item.ast_dwntime_asset_no}
                    style={[styles.input, { height:(Platform.OS === 'ios' ? 50 : 50) }, ]}
                    inputStyle={[styles.inputStyle, {color: item.PMGroupType ? '#808080' : '#000'}]}
                    labelStyle={styles.labelStyle}
                    placeholderStyle={{ fontSize: 15, color: '#0096FF'}}
                    label="Asset No"
                    editable={false}
                    selectTextOnFocus={false}
                    renderRightIcon={() =>
                      item.PMGroupType ? (
                        <AntDesign
                        style={styles.icon}
                        color={'black'}
                        name={item.ast_dwntime_asset_no ? 'search1' : 'search1'}
                        size={22}
                        />
                    ) : (
                       ''
                    )
                    }
                />
                </View>
            </Pressable>
          </View>

          <View style={{flexDirection:'row',justifyContent:'space-between'}}>

              {/* Out of service date */}
              <View style={styles.view_style}>
                <Pressable
                onPress={() => !Editable ? showDatePicker('OSD',item.key) : ''}
                onLongPress={() => !Editable ? Clear_OSD(item.key) : ''}>
                <View pointerEvents={'none'}>
                    <TextInput
                    value={item.ast_dwntime_out_date}
                    style={[ styles.input, { height: (Platform.OS === 'ios' ? 50 : 50) }, ]}
                    inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}, ]}
                    labelStyle={styles.labelStyle}
                    placeholderStyle={{ fontSize: 13, color: '#0096FF'}}
                    textErrorStyle={styles.textErrorStyle}
                    label="Out of service date"
                    placeholderTextColor="gray"
                    focusColor="#808080"
                    editable={false}
                    selectTextOnFocus={false}
                    renderRightIcon={() =>
                      OSD_Editable ? (
                          ''
                      ) : (
                          <AntDesign
                          style={styles.icon}
                          name={item.description ? 'close' : ''}
                          size={20}
                          disable={true}
                          
                          />
                      )
                      }
                    
                    />
                </View>
                </Pressable>
            </View>


              {/* Return to service date */}
              <View style={styles.view_style}>
                <Pressable
                onPress={() => !Editable ? showDatePicker('RSD',item.key) : ''}
                onLongPress={() => Clear_RSD(item.key)}>
                <View pointerEvents={'none'}>
                    <TextInput
                    value={item.ast_dwntime_rts_date}
                    style={[ styles.input, { height: (Platform.OS === 'ios' ? 50 : 50) }]}
                    inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}]}
                    labelStyle={styles.labelStyle}
                    placeholderStyle={{ fontSize: 13, color: '#0096FF'}}
                    textErrorStyle={styles.textErrorStyle}
                    label="Return to service date"
                    placeholderTextColor="gray"
                    focusColor="#808080"
                    editable={false}
                    selectTextOnFocus={false}
                    
                    />
                </View>
                </Pressable>
            </View>

          </View>


          <View style={{flexDirection:'row',justifyContent:'space-between'}}>


            {/*  Downtime Remark */}
            <View style={styles.view_style}>
            <TextInput
                value={item.ast_dwntime_remark}
                style={[ styles.input, { height: Math.max( Platform.OS === 'ios' ? 50 : 50, height )} ]}
                multiline={true}
                numberOfLines={4}
                inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}]}
                labelStyle={styles.labelStyle}
                
                placeholderStyle={{ fontSize: 13, color: '#0096FF'}}
                onContentSizeChange={event =>
                setHeight(event.nativeEvent.contentSize.height) }
                textErrorStyle={styles.textErrorStyle}
                label="Downtime Remark"
                placeholderTextColor="gray"
                clearButtonMode="always"
                editable={!Editable}
                selectTextOnFocus={!Editable}
                focusColor="#808080"
                onChangeText={text => {
                  Select_Desc(text,item.key);
                }}
                renderRightIcon={() =>
                Editable ? (
                    ''
                ) : (
                    <AntDesign
                    style={styles.icon}
                    name={item.description ? 'close' : ''}
                    size={20}
                    disable={true}
                    
                    />
                )
                }
            />
            </View>

            <View style={{flexDirection:'column',alignItems:'center',marginTop:10}}>

            <Text style={{fontSize:12, justifyContent:'center',marginLeft:10,color:'#0096FF'}}>Unplan Downtime ?</Text> 


            <BouncyCheckbox
                  style={{marginTop:10}}            
                  size={45}
                  fillColor={'#2Ecc71'}
                  unfillColor="#FFFFFF"
                  isChecked={item.ast_dwntime_sched_flag_label}
                  disableBuiltInState={true}
                  iconStyle={{ borderColor: "#f5dd4b",borderRadius: 10 }}
                  innerIconStyle={{ borderWidth: 3 ,borderRadius: 10}}
                  textStyle={{ fontFamily: "JosefinSans-Regular" }}
                  onPress={()=>{Select_Check(item.ast_dwntime_sched_flag_label,item.key)}}
              
              />

            </View>

          </View>

          <View style={{flexDirection:'row',justifyContent:'space-between'}}>

              {/* Repair from */}
              <View style={styles.view_style}>
                <Pressable
                onPress={() => !Editable ? showDatePicker('RFD',item.key) : ''}
                onLongPress={() => console.log('')}>
                <View pointerEvents={'none'}>
                    <TextInput
                    value={item.ast_dwntime_repair_from}
                    style={[ styles.input, { height: (Platform.OS === 'ios' ? 50 : 50) } ]}
                    inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'} ]}
                    labelStyle={styles.labelStyle}
                    placeholderStyle={{ fontSize: 13, color: '#0096FF', }}
                    textErrorStyle={styles.textErrorStyle}
                    label="Repair from"
                    placeholderTextColor="gray"
                    focusColor="#808080"
                    editable={false}
                    selectTextOnFocus={false}
                    
                    />
                </View>
                </Pressable>
            </View>


              {/* Repair to */}
              <View style={styles.view_style}>
                <Pressable
                onPress={() => !Editable ? showDatePicker('RTD',item.key) : ''}
                onLongPress={() => console.log('')}>
                <View pointerEvents={'none'}>
                    <TextInput
                    value={item.ast_dwntime_repair_to}
                    style={[ styles.input, { height: (Platform.OS === 'ios' ? 50 : 50) } ]}
                    inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'} ]}
                    labelStyle={styles.labelStyle}
                    placeholderStyle={{ fontSize: 13, color: '#0096FF', }}
                    textErrorStyle={styles.textErrorStyle}
                    label="Repair to"
                    placeholderTextColor="gray"
                    focusColor="#808080"
                    editable={false}
                    selectTextOnFocus={false}
                    
                    />
                </View>
                </Pressable>
            </View>

          </View>

          <View style={{width:'100%',backgroundColor:'#0096FF',height:1,marginTop:15}} ></View>
          

            <Text style={{fontSize:15, justifyContent:'center',marginLeft:10,color:'#FF5733',marginTop:15,fontWeight: 'bold'}}>Downtime    :  {item.ast_dwntime_downtime_label}</Text> 

            <Text style={{fontSize:15, justifyContent:'center',marginLeft:10,color:'#FF5733',marginTop:15,fontWeight: 'bold'}}>Repairtime  :  {item.ast_dwntime_repairtime_label}</Text> 


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

  //Remove Time Card Item
  removeItem =(key)=>{

    console.log("REMOVE"+key)
    // Alert.alert("Remove Line","Do you confirm to remove the line?",
    //     [
        
    //         { text: "OK", onPress: () => setAssestDowntimeList(AssestDowntimeList.slice().filter((item)=>item.key !==key)) }

    //     ]);

    setAlert_two(true,'delete','Do you confirm to remove the line?','REMOVE_LINE',key)

    //setTimecard(Timecard.slice().filter((item)=>item.key !==key))
  }


  //Clear OSD
  const Clear_OSD = (clear_key)=> {
    

    const newData = AssestDowntimeList.map(item =>{
        if(item.key == clear_key){

            item.ast_dwntime_out_date = ''
            item.ast_dwntime_down_wo =''
            item.ast_dwntime_rts_date = ''
            item.ast_dwntime_downtime = ''
            item.ast_dwntime_downtime_label = ''
            item.ast_dwntime_repair_from = ''
            item.ast_dwntime_repair_to = ''
            item.ast_dwntime_repairtime = ''
            item.ast_dwntime_repairtime_label = ''
          
    
        return item;

        }
        return item;
    })
    
    setAssestDowntimeList(newData)
    setisRender(!isRender)

  };


  //Clear RSD
  const Clear_RSD = (clear_key)=> {
    

    const newData = AssestDowntimeList.map(item =>{

        if(item.key == clear_key){

            
            item.ast_dwntime_rts_date = ''
            item.ast_dwntime_downtime = ''
            item.ast_dwntime_up_wo =''
            item.ast_dwntime_downtime_label = ''
            item.ast_dwntime_repair_to = ''
            item.ast_dwntime_repairtime = ''
            item.ast_dwntime_repairtime_label = ''
          
    
        return item;

        }
        return item;
    })
    
    setAssestDowntimeList(newData)
    setisRender(!isRender)

  };


   //Clear Desc
   const Clear_Desc = (clear_key)=> {
    

    const newData = AssestDowntimeList.map(item =>{

        if(item.key == clear_key){

            
            item.ast_dwntime_remark = ''
          
    
        return item;

        }
        return item;
    })
    
    setAssestDowntimeList(newData)
    setisRender(!isRender)

  };


  //Select Desc
  const Select_Desc = (text,select_key)=> {
    

    const newData = AssestDowntimeList.map(item =>{

        if(item.key == select_key){

            
            item.ast_dwntime_remark = text
          
    
        return item;

        }
        return item;
    })
    
    setAssestDowntimeList(newData)
    setisRender(!isRender)

  };


  //Select check
  const Select_Check = (value,select_key)=> {
    

    if(!value){
      console.log("EDIT TEXT  if"+ value)
      var chek ='1'
      var checklabel =true
  }else{
      console.log("EDIT TEXT else"+ value)
      var chek ='0'
      var checklabel =false
  }

    const newData = AssestDowntimeList.map(item =>{

        if(item.key == select_key){

            
            item.ast_dwntime_sched_flag = chek
            item.ast_dwntime_sched_flag_label = checklabel
          
    
        return item;

        }
        return item;
    })
    
    setAssestDowntimeList(newData)
    setisRender(!isRender)

  };




  //Select Dates
  const showDatePicker =(type,select_key)=>{
    
    console.log('select key in'+select_key )
    if(type === 'OSD'){

      setMINDate('')
      setMAXDate('')
      setDatePickerVisibility(true);
      setselect_key(select_key)
      setType(type)

    }else if(type === 'RSD'){

      setMAXDate('')

      AssestDowntimeList.map(item =>{

        if(item.key === select_key){

          if(!item.ast_dwntime_out_date){

            // Alert.alert(`Alert Downtime line No: ${item.key}`,"Please select out of service date",
            //   [
              
            //       { text: "OK" }
      
            //   ]);
            setAlert(true,'warning',`Alert line No: ${item.key} Please select out of service date`,'OK');
              return
  
          }else{
  
            console.log(new Date(OSD));
            setMINDate(new Date(OSD));
  
            const newData = AssestDowntimeList.map(item =>{
              if(item.key == select_key){
        
                setMINDate(new Date(item.ast_dwntime_out_date));
        
          
              return item;
        
              }
              return item;
          })
  
            setDatePickerVisibility(true);
            setselect_key(select_key)
            setType(type)
  
          }

        }

        

      })

      

    }else if(type === 'RFD'){
      
      AssestDowntimeList.map(item =>{
        console.log('select key in'+JSON.stringify(item) )
        if(item.key === select_key){

          if(!item.ast_dwntime_out_date){

            // Alert.alert(`Alert Downtime line No: ${item.key}`,"Please select out of service date",
            //   [
              
            //       { text: "OK" }
      
            //   ]);
            setAlert(true,'warning',`Alert line No: ${item.key} Please select out of service date`,'OK');
          
  
          }else if(!item.ast_dwntime_rts_date){

            setAlert(true,'warning',`Alert line No: ${item.key} Please select return to service date`,'OK');
            
          }else{
  
            const newData = AssestDowntimeList.map(item =>{
              if(item.key == select_key){
        
                setMINDate(new Date(item.ast_dwntime_out_date));
                setMAXDate(new Date(item.ast_dwntime_rts_date))
          
              return item;
        
              }
              return item;
          })
  
            
  
            setDatePickerVisibility(true);
            setselect_key(select_key)
            setType(type)
  
          }

        }

        

      })
      
    }else if(type === 'RTD'){

      AssestDowntimeList.map(item =>{

        if(item.key === select_key){

          if(!item.ast_dwntime_out_date){

            // Alert.alert(`Alert Downtime line No: ${item.key}`,"Please select out of service date",
            //   [
              
            //       { text: "OK" }
      
            //   ]);
            setAlert(true,'warning',`Alert line No: ${item.key} Please select out of service date`,'OK');
  
          }else{
  
            if(!item.ast_dwntime_rts_date){
  
              // Alert.alert(`Alert Downtime line No: ${item.key}`,"Please select return of service date",
              //   [
                
              //       { text: "OK" }
        
              //   ]);
              setAlert(true,'warning',`Alert line No: ${item.key} Please select return of service date`,'OK');
      
            }else{
  
  
              const newData = AssestDowntimeList.map(item =>{
                if(item.key == select_key){
          
                  setMINDate(new Date(item.ast_dwntime_repair_from));
                  setMAXDate(new Date(item.ast_dwntime_rts_date))
            
                return item;
          
                }
                return item;
            })
  
             
  
              setDatePickerVisibility(true);
              setselect_key(select_key)
              setType(type)
      
            }
          
          }

        }

        
      
      })
    
    }

    
      
  };

  const hideDatePicker =()=>{
    setDatePickerVisibility(false);
  };

  const handleConfirm =(date)=>{

    //console.warn('select key'+date)

    let select_Date = moment(date).format('YYYY-MM-DD HH:mm')


     //console.warn('select key'+select_Date)

    if(Type === 'OSD'){

      
      const newData = AssestDowntimeList.map(item =>{
        if(item.key == select_key){

            item.ast_dwntime_out_date = select_Date
            item.ast_dwntime_repair_from = select_Date
            item.ast_dwntime_down_wo = route.params.Selected_WorkOrder_no
            item.ast_dwntime_rts_date = ''
            item.ast_dwntime_repair_to = ''
            item.ast_dwntime_downtime = ''
            item.ast_dwntime_downtime_label = ''
            item.ast_dwntime_repairtime = ''
            item.ast_dwntime_repairtime_label = ''

    
        return item;

        }
        return item;
    })
    //console.log("SELECTED ITEM 23"+ JSON.stringify(newData) )
    setAssestDowntimeList(newData)
    setisRender(!isRender)

    
          
    }else if(Type === 'RSD'){

      

      const newData = AssestDowntimeList.map(item =>{
        if(item.key == select_key){

          const start = new Date(item.ast_dwntime_out_date);
          const end   = new Date(select_Date);
          const range = moment.range(start, end);
        
          var msDiff = range.diff();    
          var days = Math.floor(msDiff / (1000 * 60 * 60 * 24)) % 365;
          var hours = Math.floor((msDiff - (1000 * 60 * 60 * 24 * days)) / (1000 * 60 * 60));
          var min = Math.floor(msDiff - (1000 * 60 * 60 * 24 * days) - (1000 * 60 * 60 * hours)) / (1000 * 60);

          

          console.log("Total Duration in millis:", msDiff);
          console.log("Days:", days);
          console.log("Hours:", hours);
          console.log("Minutes:", min);

      
           
          item.ast_dwntime_rts_date = select_Date,
          item.ast_dwntime_rts_date_MIN= msDiff,
          item.ast_dwntime_repair_to = select_Date,
          item.ast_dwntime_up_wo = route.params.Selected_WorkOrder_no,
          item.ast_dwntime_downtime = msDiff,
          item.ast_dwntime_repairtime = msDiff,
          item.ast_dwntime_downtime_label = ('( '+ days + ' Days ' + hours +' Hours '+ min +' Mins ' +' )'),

          item.ast_dwntime_repairtime_label = ('( '+ days + ' Days ' + hours +' Hours '+ min +' Mins ' +' )')
            
    
        return item;

        }
        return item;
    })
    //console.log("SELECTED ITEM 23"+ JSON.stringify(newData) )
    setAssestDowntimeList(newData)
    setisRender(!isRender)

        

    }else if(Type === 'RFD'){

      setRFD(select_Date)

      const newData = AssestDowntimeList.map(item =>{
        if(item.key == select_key){

          const check_start = new Date(item.ast_dwntime_out_date);
          const check_end   = new Date(select_Date);
          const check_range = moment.range(check_start, check_end);
        
          var check_msDiff = check_range.diff();    
          var check_days = Math.floor(check_msDiff / (1000 * 60 * 60 * 24)) % 365;
          var check_hours = Math.floor((check_msDiff - (1000 * 60 * 60 * 24 * check_days)) / (1000 * 60 * 60));
          var check_min = Math.floor(check_msDiff - (1000 * 60 * 60 * 24 * check_days) - (1000 * 60 * 60 * check_hours)) / (1000 * 60);

          console.log("Total Duration in check_millis:", check_msDiff);
          console.log("check_Days:", check_days);
          console.log("check_Hours:", check_hours);
          console.log("check_Minutes:", check_min);

          item.ast_dwntime_repair_from_MIN = check_msDiff

          const start = new Date(select_Date);
          const end   = new Date(item.ast_dwntime_repair_to);

          const range = moment.range(start, end);
        
          var msDiff = range.diff();    
          var days = Math.floor(msDiff / (1000 * 60 * 60 * 24)) % 365;
          var hours = Math.floor((msDiff - (1000 * 60 * 60 * 24 * days)) / (1000 * 60 * 60));
          var min = Math.floor(msDiff - (1000 * 60 * 60 * 24 * days) - (1000 * 60 * 60 * hours)) / (1000 * 60);
      
          

          console.log("Total Duration in millis:", msDiff);
          console.log("Days:", days);
          console.log("Hours:", hours);
          console.log("Minutes:", min);

          item.ast_dwntime_repairtime_label = '( '+ days + ' Days' + ' , ' + hours +' Hours'+' , '+ min +' Mins'+ ' )'

          item.ast_dwntime_repair_from = select_Date
          
          item.ast_dwntime_repairtime = msDiff
            
    
        return item;
          

        }
        return item;
    })
    //console.log("SELECTED ITEM 23"+ JSON.stringify(newData) )
    setAssestDowntimeList(newData)
    setisRender(!isRender)

        

    }else if(Type === 'RTD'){

      setRTD(select_Date);

      

      const newData = AssestDowntimeList.map(item =>{
        if(item.key == select_key){


          const check_start = new Date(item.ast_dwntime_rts_date);
          const check_end   = new Date(select_Date);
          const check_range = moment.range(check_end, check_start);
        
          var check_msDiff = check_range.diff();    
          var check_days = Math.floor(check_msDiff / (1000 * 60 * 60 * 24)) % 365;
          var check_hours = Math.floor((check_msDiff - (1000 * 60 * 60 * 24 * check_days)) / (1000 * 60 * 60));
          var check_min = Math.floor(check_msDiff - (1000 * 60 * 60 * 24 * check_days) - (1000 * 60 * 60 * check_hours)) / (1000 * 60);

          console.log("RTD Total Duration in check_millis:", check_msDiff);
          console.log("RTD check_Days:", days);
          console.log("RTD check_Hours:", hours);
          console.log("RTD check_Minutes:", min);

          const start = new Date(item.ast_dwntime_repair_from);
          const end   = new Date(select_Date);
          const range = moment.range(start, end);
        
          var msDiff = range.diff();    


          var days = Math.floor(msDiff / (1000 * 60 * 60 * 24)) % 365;
          var hours = Math.floor((msDiff - (1000 * 60 * 60 * 24 * days)) / (1000 * 60 * 60));
          var min = Math.floor(msDiff - (1000 * 60 * 60 * 24 * days) - (1000 * 60 * 60 * hours)) / (1000 * 60);
      

          item.ast_dwntime_repair_to = select_Date,
          item.ast_dwntime_repair_to_MIN = check_msDiff,
          item.ast_dwntime_repairtime = msDiff,
          item.ast_dwntime_repairtime_label = ('( '+ days + ' Days ' + hours +' Hours '+ min +' Mins ' +' )')
            
            
    
        return item;

        }
        return item;
    })
    //console.log("SELECTED ITEM 23"+ JSON.stringify(newData) )
    setAssestDowntimeList(newData)
    setisRender(!isRender)

       

    }




  hideDatePicker();

  };


  //SAVE
  const save =(async()=>{

    //console.log(JSON.stringify(AssestDowntimeList))
    var AssestDowntime;

    AssestDowntimeList.map(item =>{

      if(item.PMGroupType){

        if(!item.ast_dwntime_asset_no){
          
          setAlert(true,'warning',`Alert line No: ${item.key} Please select asset no`,'OK');
          valid =false
          return

        }
      }

      if(!item.ast_dwntime_out_date){

        setAlert(true,'warning',`Alert line No: ${item.key} Please select out of service date`,'OK');
        valid =false;
        return

      }else{


        if(item.ast_dwntime_downtime  < 0 ){

          setAlert(true,'warning',`Alert line No: ${item.key} Please check asset downtime`,'OK');
          valid =false;
          return

        }else{

          if(item.ast_dwntime_repairtime  < 0 ){

            
            setAlert(true,'warning',`Alert line No: ${item.key} Please check repairtime downtime`,'OK');
            valid =false;
            return


          }else{

            


            if(item.ast_dwntime_rts_date_MIN  < 0 ){

              
              setAlert(true,'warning',`Alert line No: ${item.key} Please check return to setvice date/time is not less than to out of service date/time`,'OK');
              valid =false;
    
              return
  
  
            }else{
  
  
              if(item.ast_dwntime_repair_from_MIN  < 0 ){

                
                setAlert(true,'warning',`Alert line No: ${item.key} Please check repair from date/time  is not less than to out of service date/time`,'OK');
                valid =false;
                return
    
    
              }else{
    
    
                if(item.ast_dwntime_repair_to_MIN  < 0 ){

                  
                  setAlert(true,'warning',`Alert line No: ${item.key} Please check repair to date/time is not greater than to return to service date/time`,'OK');
                  valid =false;
                  return
      
      
                }else{
      
                 
                  valid =true;
                  AssestDowntime = {
      
                    Header : AssestDowntimeList,
                    
                  }
      
                }
    
              }
  
            }

          }

        }

      }

    })

   

    if(valid){

      setspinner(true); 
       //console.log("ASSET DN:"+JSON.stringify(AssestDowntime));
       var sync_date = moment().format('YYYY-MM-DD HH:mm');

      if(WIFI === 'OFFLINE'){

        console.log(JSON.stringify(AssestDowntimeList))
        db.transaction(function (tx) {

          for (let i = 0; i < AssestDowntimeList.length; ++i) {

            if(AssestDowntimeList[i].id === ''){

              console.log("ID EMPTY")

              tx.executeSql('INSERT INTO ast_dwntime (site_cd,ast_dwntime_out_date,ast_dwntime_rts_date,ast_dwntime_downtime,ast_dwntime_repair_from,ast_dwntime_repair_to,ast_dwntime_repairtime,ast_dwntime_down_wo,ast_dwntime_up_wo,ast_dwntime_asset_no,ast_dwntime_sched_flag,ast_dwntime_remark,audit_user,audit_date,rowid,mst_RowID,sts_column,LOGINID,local_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
              [AssestDowntimeList[i].site_cd,AssestDowntimeList[i].ast_dwntime_out_date,AssestDowntimeList[i].ast_dwntime_rts_date,AssestDowntimeList[i].ast_dwntime_downtime, AssestDowntimeList[i].ast_dwntime_repair_from, AssestDowntimeList[i].ast_dwntime_repair_to, AssestDowntimeList[i].ast_dwntime_repairtime, AssestDowntimeList[i].ast_dwntime_down_wo, AssestDowntimeList[i].ast_dwntime_up_wo, AssestDowntimeList[i].ast_dwntime_asset_no, AssestDowntimeList[i].ast_dwntime_sched_flag, AssestDowntimeList[i].ast_dwntime_remark, AssestDowntimeList[i].EmpID,sync_date,AssestDowntimeList[i].RowID,'','',LoginID,Local_ID],
              (tx, results) => {
                  //console.log('wko_det_response Results_test', results.rowsAffected);
                  if (results.rowsAffected > 0) {

                      console.log('INSERT TABLE ast_dwntime Successfully')

                  }else{ 
                      setspinner(false); 
                      alert('INSERT TABLE ast_dwntime Failed')
                  }

              }
              )


            }else{

              console.log("ID NOT EMPTY")

              tx.executeSql('UPDATE ast_dwntime SET ast_dwntime_out_date=?,ast_dwntime_rts_date=?,ast_dwntime_downtime=?,ast_dwntime_repair_from=?,ast_dwntime_repair_to=?,ast_dwntime_repairtime=?,ast_dwntime_down_wo=?,ast_dwntime_up_wo=?,ast_dwntime_asset_no=?,ast_dwntime_sched_flag=?,ast_dwntime_remark=?,rowid=? WHERE ID=?',
              [AssestDowntimeList[i].ast_dwntime_out_date,AssestDowntimeList[i].ast_dwntime_rts_date,AssestDowntimeList[i].ast_dwntime_downtime, AssestDowntimeList[i].ast_dwntime_repair_from, AssestDowntimeList[i].ast_dwntime_repair_to, AssestDowntimeList[i].ast_dwntime_repairtime, AssestDowntimeList[i].ast_dwntime_down_wo, AssestDowntimeList[i].ast_dwntime_up_wo, AssestDowntimeList[i].ast_dwntime_asset_no, AssestDowntimeList[i].ast_dwntime_sched_flag, AssestDowntimeList[i].ast_dwntime_remark,AssestDowntimeList[i].RowID,AssestDowntimeList[i].id],
              (tx, results) => {
                  //console.log('wko_det_response Results_test', results.rowsAffected);
                  if (results.rowsAffected > 0) {

                      console.log('Update TABLE ast_dwntime Successfully')

                  }else{ 
                      setspinner(false); 
                      alert('Update TABLE ast_dwntime Failed')
                  }

              }
              )

            }

          }

          setspinner(false);
          setAlert(true,'success','Update asset downtime successfully','INSERT_ADT');
          
        })


      }else{

        console.log(JSON.stringify(AssestDowntime))

        try{

          const response = await axios.post(`${Baseurl}/insert_work_order_asset_downtime.php?`,AssestDowntime,
          {headers:{ 'Content-Type': 'application/json'}});
          console.log('Insert asset response:'+ JSON.stringify(response.data));
          if (response.data.status === 'SUCCESS'){
              setspinner(false)
              setAlert(true,'success',response.data.message,'INSERT_ADT');
              
  
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

    }else if(D === 'INSERT_ADT'){

      setShow(false)

      _goBack()

    }

  }

  const Alret_onClick =(D) =>{

    setShow_two(false)

    if(D === 'BACK'){

      _goBack()

    }else if(D === 'REMOVE_LINE'){

       
        setAssestDowntimeList(AssestDowntimeList.slice().filter((item)=>item.key !==AlertData))
    } 

  }

  //Selection Dropdown
  const select_dropdown = (dropname, data,key) => {

    //console.log(dropname)
    setselect_key(key);
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

     if(textvalue == 'PM Group Asset') {
      newData = Dropdown_data.filter(function (item) {
      const itemData = `${item.ast_mst_asset_no.toUpperCase()},
          ,${item.ast_mst_asset_shortdesc.toUpperCase()}
          ,${item.ast_mst_asset_status.toUpperCase()}`;

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

    if (textvalue == 'PM Group Asset') {
      setDropDownFilteredData(PMGroupAsset);
    } 

    setRefreshing(false);
  }, [refreshing]);


  const renderText = item => {
     if (textvalue == 'PM Group Asset') {
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
          height: 0.8,
          width: '100%',
          backgroundColor: '#C8C8C8',
          }}
      />
      );
    };


    const getItem = ditem => {
    

      if (textvalue == 'PM Group Asset') {

      const newData = AssestDowntimeList.map(item =>{
        if(item.key == select_key){

          
          item.ast_dwntime_asset_no = ditem.ast_mst_asset_no
            
          
          
    
        return item;

        }
        return item;
      })
      //console.log("SELECTED ITEM 23"+ JSON.stringify(newData) )
      setAssestDowntimeList(newData)
      setisRender(!isRender)

      setDropDown_search('');
      setDropDown_modalVisible(!DropDown_modalVisible);

    } 

  

  };


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
                <Text style={{ flex: 1, fontSize: 15, justifyContent: 'center', textAlign: 'center', color: '#000', fontWeight: 'bold', }}> {textvalue} </Text>
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

      <View style={styles.container}>

        <FlatList
          data={AssestDowntimeList}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeparatorView}
          renderItem={ItemView}       
          extraData={isRender}     
        
        />
    
      </View>


      <View style={ styles.bottomView} >
        <TouchableOpacity
            style={{width:'50%',height:60,backgroundColor:'#0096FF',
            alignItems:'center',justifyContent:'center',marginRight:5}} onPress={addItem} >
              <Text style={{color:'white', fontSize: 16,fontWeight: 'bold'}}>ADD</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={{width:'50%',height:60,backgroundColor:'#2ECC71',
            alignItems:'center',justifyContent:'center'}} onPress={save}  >
              <Text style={{color:'white', fontSize: 16,fontWeight: 'bold'}}>SAVE</Text>
        </TouchableOpacity>
      </View>

</SafeAreaProvider>
  )
}

export default AssetDowntime

const styles = StyleSheet.create({

  container: {
    flex: 1,
    marginBottom: 50
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
    margin:10,
    borderRadius: 10,  
    padding:10    
  },

  card_row: {
    flexDirection:'row',
    justifyContent:'space-between',
    marginTop:10,
    alignItems:'center' 
  },

  view_style: {
    flex:1,
    marginTop: 15,
    marginLeft: 5,
    marginRight: 5,
  },

  input: {
      paddingHorizontal: 12,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#808080',
  },

  inputStyle: {fontSize: 12, marginTop: Platform.OS === 'ios' ? 8 : 0},

  labelStyle: {
      fontSize: 12,
      position: 'absolute',
      top: -10,
      color: '#0096FF',
      backgroundColor: 'white',
      paddingHorizontal: 4,
      marginLeft: -4,
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