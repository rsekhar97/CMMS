import React from 'react'
import {  View, StyleSheet,Text, RefreshControl,FlatList,BackHandler,TouchableOpacity,Alert,Pressable,Modal,TouchableWithoutFeedback,Keyboard } from 'react-native';
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
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SearchBar} from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { TextInput as RNTextInput } from 'react-native';
import moment from "moment";
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';

var db = openDatabase({ name: 'CMMS.db' });
let Baseurl,Site_cd,LoginID,EmpName,EmpID,EmpPhone,EmpWorkGrp,dvc_id,WIFI;



const ContractService = ({route,navigation}) => {

    var valid = false;

  const [spinner, setspinner]= React.useState(false);
  const [Toolbartext, setToolbartext]= React.useState("Contract Service");
  const [Editable, setEditable] = React.useState(false);
  const [height, setHeight] = React.useState(0);

  const [TexCode_height, setTexCode_height] = React.useState(0);

  const [HeaderList,setHeaderList] =  React.useState([]);

  const [CSList,setCSList] =  React.useState([]);

  const [ContractServiceList,setContractServiceList] =  React.useState([]);
  const [isRender,setisRender]=React.useState(false);


  const [Supplier,setSupplier] = React.useState([]);
  const [TaxCode,setTaxCode] = React.useState([]);
  const [ChargeCostCenter,setChargeCostCenter] = React.useState([]);
  const [ChargeAccount,setChargeAccount] = React.useState([]);
  const [UOM,setUOM] = React.useState([]);
  const [PMGroupAsset,setPMGroupAsset] = React.useState([]);

  const [select_key,setselect_key] = React.useState("");

  //DropDown Modal
  const [textvalue, settextvalue] = React.useState('');
  const [Boxtextvalue, setBoxtextvalue] = React.useState('');
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
    const [AlertData, setAlertData] = React.useState('');


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
    } else if (route.params.Screenname == 'WoDashboard'  || route.params.Screenname == 'MYWO_Dashboard_Due' || route.params.Screenname == 'MYWO_Dashboard_Past') {
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
    
    setAlert_two(true,'warning','Do you want to exit contract service screen?','BACK')
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

      console.log('WorkOrder_no:', route.params.Selected_WorkOrder_no)
      console.log('mst_RowID:', route.params.RowID)

      console.log('ASSETNO:', route.params.Selected_AssetNo)
      console.log('CostCenter:', route.params.Selected_CostCenter)
      console.log('LaborAccount:', route.params.Selected_LaborAccount)
      console.log('ContractAccount:', route.params.Selected_ContractAccount)
      console.log('MaterialAccount:', route.params.Selected_MaterialAccount)
      console.log('PMGroupType:', route.params.Selected_PMGroupType)

      console.log("WORK DATA:  "+ WIFI);

      let CostCenter,LaborAccount,ContractAccount,MaterialAccount;

      if(route.params.Selected_CostCenter === ''){
        CostCenter = '';
      }else{
        
        let CostCenter_split = route.params.Selected_CostCenter.split(':');
        CostCenter =CostCenter_split[0]
      }

      if(route.params.Selected_LaborAccount === ''){
        LaborAccount = '';
      }else{
        
        let LaborAccount_split = route.params.Selected_LaborAccount.split(':');
        LaborAccount=LaborAccount_split[0]
      }

      if(route.params.Selected_ContractAccount === ''){
        ContractAccount = '';
      }else{
        let ContractAccount_split= route.params.Selected_ContractAccount.split(':');
    
        ContractAccount=ContractAccount_split[0]
      }

      if(route.params.Selected_MaterialAccount === ''){
        MaterialAccount =''
      }else{
        
       let MaterialAccount_split= route.params.Selected_MaterialAccount.split(':')
       MaterialAccount =MaterialAccount_split[0]
      }

      
      
      setHeaderList([{

        site_cd:Site_cd,
        wko_RowID:route.params.RowID,
        wko_mst_wo_no:route.params.Selected_WorkOrder_no,
        wko_mst_assetno:route.params.Selected_AssetNo,
        chargecostcenter:CostCenter,
        wko_det_laccount:LaborAccount,
        wko_det_caccount:ContractAccount,
        wko_det_maccount:MaterialAccount,
        audit_user:EmpID,
        audit_date:sync_date,
        LOGINID:LoginID

      }])

    
      db.transaction(function(txn){

        //supplier
        txn.executeSql( 'SELECT * FROM supplier', [], (tx, { rows }) => { setSupplier(rows.raw())}); 
                    
        //tax_cd
        txn.executeSql( 'SELECT * FROM tax_cd', [], (tx, { rows }) => { setTaxCode(rows.raw())}); 
        
        //costcenter
        txn.executeSql( 'SELECT * FROM costcenter', [], (tx, { rows }) => { setChargeCostCenter(rows.raw())});
        
        //account
        txn.executeSql( 'SELECT * FROM account', [], (tx, { rows }) => { setChargeAccount(rows.raw())});
        
        //uom
        txn.executeSql( 'SELECT * FROM uom', [], (tx, { rows }) => { setUOM(rows.raw())});

      });

      get_materialrequest_list();
  }


  //GET CONSTRACT SERVICE LIST API ONLINE
  const get_materialrequest_list=(async()=>{

    setspinner(true);
    try{

      console.log("JSON DATA : " + `${Baseurl}/get_pr_list.php?site_cd=${(Site_cd)}&mst_RowID=${route.params.RowID}`)
      const response = await axios.get(`${Baseurl}/get_pr_list.php?site_cd=${(Site_cd)}&mst_RowID=${route.params.RowID}`);

      console.log("JSON DATA : " + JSON.stringify( response.data.data))
     
      if (response.data.status === 'SUCCESS') 
      {
        
        setCSList(response.data.data);
        //setspinner(false);
        if(route.params.Selected_PMGroupType === ''){
            setspinner(false);
        }else{
            get_pm_grouptype_asset();
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

  
  //Selected Supplier
  const selectedValueDescription = (text,select_key)=> {

    const newData = ContractServiceList.map(item =>{
        if(item.key == select_key){

            item.description = text
          
    
        return item;

        }
        return item;
    })
    //console.log("SELECTED ITEM 23"+ JSON.stringify(newData) )
    setContractServiceList(newData)
    setisRender(!isRender)


  };


  //Selected Supplier
  const selectedValueSupplier = (clear_key)=> {

    const newData = ContractServiceList.map(item =>{
        if(item.key == clear_key){

            item.supplier = '',
            item.supplier_label = ''
          
    
        return item;

        }
        return item;
    })
    //console.log("SELECTED ITEM 23"+ JSON.stringify(newData) )
    setContractServiceList(newData)
    setisRender(!isRender)


  };

  //Selected TaxCode
  const selectedValueTaxCode = (clear_key)=> {

    const newData = ContractServiceList.map(item =>{
        if(item.key == clear_key){

            item.tax_code = ''
            item.tax_code_label = ''
          
    
        return item;

        }
        return item;
    })
    //console.log("SELECTED ITEM 23"+ JSON.stringify(newData) )
    setContractServiceList(newData)
    setisRender(!isRender)

  };

  //Selected ChargeCostCenter
  const selectedValueChargeCostCenter = (clear_key)=> {
    

    const newData = ContractServiceList.map(item =>{
        if(item.key == clear_key){

            item.chargecostcenter = ''
            item.chargecostcenter_label = ''
          
    
        return item;

        }
        return item;
    })
    //console.log("SELECTED ITEM 23"+ JSON.stringify(newData) )
    setContractServiceList(newData)
    setisRender(!isRender)

  };

  //Selected ChargeAccount
  const selectedValueChargeAccount = (clear_key)=> {
    

    const newData = ContractServiceList.map(item =>{
        if(item.key == clear_key){

            item.chargeaccount = ''
            item.chargeaccount_label = ''
          
    
        return item;

        }
        return item;
    })
    //console.log("SELECTED ITEM 23"+ JSON.stringify(newData) )
    setContractServiceList(newData)
    setisRender(!isRender)

  };

  //Selected UOM
  const selectedValueUOM = (clear_key)=> {
    

    const newData = ContractServiceList.map(item =>{
        if(item.key == clear_key){

            item.uom = ''
            item.uom_label= ''
          
    
        return item;

        }
        return item;
    })
    //console.log("SELECTED ITEM 23"+ JSON.stringify(newData) )
    setContractServiceList(newData)
    setisRender(!isRender)

  };


   //Selected Quantity
   const selectedValueQuantity = (text,select_key)=> {

    ContractServiceList.map(item =>{
        if(item.key == select_key){

            item.quantity = text
          
    
        return item;

        }
        return item;
    })
    //console.log("SELECTED ITEM 23"+ JSON.stringify(newData) )
    //setContractServiceList(newData)
    setisRender(!isRender)


  };



    const increment = (key) => {

        console.log('increment key :',key)

        // Increment the value by 0.01 (or any other desired step)
        //setValue((prevValue) => (parseFloat(prevValue )+ 1).toFixed(2));

        

        ContractServiceList.map(item =>{

            if(item.key == key){

                const numberValue = Number(item.quantity);

                if (item.quantity > 0) {

                    // console.log('increment if :',item.quantity)

                    if (Number.isInteger(numberValue)) {

                        item.quantity = (parseInt(item.quantity)+ 1).toString();

                    } else if (typeof numberValue === 'number') {
                        item.quantity = (parseFloat(item.quantity )+ 1).toFixed(2);

                    }

                    //item.quantity = (parseFloat(item.quantity )+ 1).toFixed(2)

                }else{
                    //console.log('increment else :',item.quantity);

                    if (Number.isInteger(numberValue)) {

                        item.quantity = (parseInt(0)+ 1).toString();

                    } else if (typeof numberValue === 'number') {
                        item.quantity = (parseFloat(0)+ 1).toFixed(2);

                    } 
                }


                //item.quantity = (parseFloat(item.quantity )+ 1).toFixed(2)

                return item;

            }

        })
        setisRender(!isRender)

    };

    const decrement = (key) => {

        console.log('decrement key :',key)
        // Decrement the value by 0.01 (or any other desired step)
        //setValue((prevValue) => (parseFloat(prevValue )- 1).toFixed(2));

        ContractServiceList.map(item =>{

            if(item.key == key){

                const numberValue = Number(item.quantity);

                if (item.quantity <= 0 || item.quantity <= 1 ) {

                    console.log('decrement if :',item.quantity)
                    
                }else{
                    console.log('decrement else :',item.quantity)

                    if (Number.isInteger(numberValue)) {

                        item.quantity = (parseInt(item.quantity)- 1).toString();

                    } else if (typeof numberValue === 'number') {
                        item.quantity = (parseFloat(item.quantity)- 1).toFixed(2);

                    } 

                    //item.quantity = (parseFloat(item.quantity )- 1).toFixed(2)
                }


                //item.qty_needed = (parseFloat(item.qty_needed )- 1).toFixed(2)

                return item;

            }

        })
        setisRender(!isRender)
    };

  //Selected Quantity
  const selectedValueItemCost = (text,select_key)=> {

    ContractServiceList.map(item =>{
        if(item.key == select_key){


            if (!isNaN(text)) {
        
                console.log("SELECTED ITEM "+ text )
                item.itemcost = text

            }else{
                item.itemcost = ""
            }


            
          
    
        return item;

        }
        return item;
    })
    //console.log("SELECTED ITEM 23"+ JSON.stringify(newData) )
    //setContractServiceList(newData)
    setisRender(!isRender)


  };

  const ItemView =({item,index})=>{

    return(

     
            <View style={styles.item_list}>

            
                {/* <View style={{flexDirection:"row",marginTop:10}}>
                    <View style={{flex:1}}>
                        <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >PR Line No :</Text>
                    </View>
                    <View style={{flex:1.5}}>
                        <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{item.wko_ls4_pr_lineno}</Text>
                    </View>
                </View> */}

                <View style={{flexDirection:"row",marginTop:5}}>
                    <View style={{width:'40%'}}>
                        <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >PR No :</Text>
                    </View>
                    <View style={{flex:1}}>
                        <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{item.wko_ls4_pr_no + " - " + item.wko_ls4_pr_lineno}</Text>
                    </View>
                </View>

                <View style={{flexDirection:"row",marginTop:5}}>
                    <View style={{width:'40%'}}>
                        <Text  style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Asset No :</Text>
                    </View>
                    <View style={{flex:1}}>
                        <Text  style={{justifyContent: 'flex-start',color:'#000'}} >{item.wko_ls4_assetno}</Text>
                    </View>
                </View>

              

                <View style={{flexDirection:"row",marginTop:5}}>
                    <View style={{width:'40%'}}>
                        <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Supplier :</Text>
                    </View>
                    <View style={{flex:1}}>
                        <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{item.wko_ls4_supplier}</Text>
                    </View>
                </View>

                <View style={{flexDirection:"row",marginTop:5}}>
                    <View style={{width:'40%'}}>
                        <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Cost Center :</Text>
                    </View>
                    <View style={{flex:1}}>
                        <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{item.wko_ls4_chg_costcenter}</Text>
                    </View>
                </View>

              <View style={{flexDirection:"row",marginTop:5}}>
                <View style={{width:'40%'}}>
                    <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Description :</Text>
                </View>
                <View style={{flex:1}}>
                    <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{item.wko_ls4_descr}</Text>
                </View>
              </View>

              <View style={{flexDirection:"row",marginTop:5}}>
                <View style={{width:'40%'}}>
                    <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >UOM :</Text>
                </View>
                <View style={{flex:1}}>
                    <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{item.wko_ls4_svc_uom}</Text>
                </View>
              </View>

              <View style={{flexDirection:"row",marginTop:5}}>
                <View style={{width:'40%'}}>
                    <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Item Cost :</Text>
                </View>
                <View style={{flex:1}}>
                    <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{parseFloat(item.wko_ls4_est_cost).toFixed(2)}</Text>
                </View>
              </View>

              <View style={{flexDirection:"row",marginTop:5}}>
                <View style={{width:'40%'}}>
                    <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Requested Qty :</Text>
                </View>
                <View style={{flex:1}}>
                    <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{parseFloat(item.wko_ls4_qty_needed).toFixed(2)}</Text>
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


  //Add Contract Service Line 
  const addItem =(()=>{

    console.log(route.params.Selected_AssetNo);

    if(ContractServiceList.length > 0){

        ContractServiceList.map(item =>{
            
            if(item.PMGroupType){

                if(!item.assetno){
        
                  
                  setAlert(true,'warning',`Alert line No: ${item.key} Please select asset no`,'OK');
                  valid =false
                  return
                  
                  
                }
                
                
            }


            if(!item.description){
                valid = false;
                setAlert(true,'warning',`Alert line No: ${item.key} Please enter description`,'OK');
                return
        
            }else{
    
                if(!item.supplier){
                    valid = false;
                    setAlert(true,'warning',`Alert line No: ${item.key} Please select supplier`,'OK');
                    return
            
                }else{
    
                    if(!item.uom){
                        valid = false;
                        setAlert(true,'warning',`Alert line No: ${item.key} Please select UOM`,'OK');
                        return
                
                    }else{
    
                        if(!item.quantity){
                            valid = false;
                            setAlert(true,'warning',`Alert line No: ${item.key} Please select quantity`,'OK');
                            return
                    
                        }else{
    
                            if(!item.itemcost){
                                valid = false;
                                setAlert(true,'warning',`Alert line No: ${item.key} Please select estimate cost`,'OK');
                                return
                        
                            }else{
                                valid =true;
                                
                            }
            
                        }
        
                    }
                }
    
            }
    
    
        })
        if(valid){
            let key = ContractServiceList.length + 1;

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

            setContractServiceList(ContractServiceList =>[...ContractServiceList,
                            
            {
                key:key,
                assestno:Assetno,
                description:'',
                supplier:'',
                supplier_label:'',
                tax_code:'',
                tax_cod_label:'',
                chargecostcenter:'',
                chargecostcenter_label:'',
                chargeaccount:'',
                chargeaccount_label:'',
                uom:'',
                uom_label:'',
                quantity:'',
                itemcost:'',
                issueqty:'',
                PMGroupType:PMGroupType   
            },
        
            ]);

        }

        

    }else{

        let key = ContractServiceList.length + 1;

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
        setContractServiceList(ContractServiceList =>[...ContractServiceList,
                          
            {
              key:key,
              assestno:Assetno,
              description:'',
              supplier:'',
              supplier_label:'',
              tax_code:'',
              tax_cod_label:'',
              chargecostcenter:'',
              chargecostcenter_label:'',
              chargeaccount:'',
              chargeaccount_label:'',
              uom:'',
              uom_label:'',
              quantity:'',
              itemcost:'',
              issueqty:'' ,
              PMGroupType:PMGroupType 
            },
      
        ]);

    }

    
  });

  const ContractService_ItemView =({item,index})=>{

    console.log("ADD : "+JSON.stringify(item))
    
    return(

      <View style={styles.card}>

        {/* Line */}
        <View style={styles.card_row}>                      

            <Text style={{fontSize:15, justifyContent:'center',marginLeft:10,color:'#0096FF'}}>Line no: { item.key}</Text> 

            <Ionicons 
                name="close"
                color={'red'}
                size={35}
                disabled={item.remove_editable}  
                onPress={()=>removeItem(item.key)}
            /> 
    
        </View>

        <View style={{width:'100%',backgroundColor:'#0096FF',height:2}} ></View>

            {/* Asset No */}
            <View style={styles.view_style}>
            <Pressable onPress={() => !item.PMGroupType ? '' : select_dropdown('PM Group Asset',PMGroupAsset,item.key) } >
                  <View pointerEvents={'none'}>
                  <TextInput
                      value={item.assestno}
                      style={[styles.input, { height:(Platform.OS === 'ios' ? 50 : 50) }, ]}
                      inputStyle={[styles.inputStyle, {color: item.PMGroupType ? '#000' : '#808080'}]}
                      labelStyle={styles.labelStyle}
                      placeholderStyle={{ fontSize: 15, color: '#0096FF'}}
                      label="Asset No"
                      editable={item.PMGroupType ? true : false}
                      selectTextOnFocus={item.PMGroupType ? true : false}
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
        
            {/*  Description */}
            <View style={styles.view_style}>
            <TextInput
                value={item.description}
                style={[
                styles.input, { height: Math.max( Platform.OS === 'ios' ? 50 : 50, height, ), }, ]}
                multiline={true}
                numberOfLines={4}
                inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}, ]}
                labelStyle={styles.labelStyle}
                placeholderStyle={{ fontSize: 15, color: '#0096FF', }}
                onContentSizeChange={event => setHeight(event.nativeEvent.contentSize.height) }
                textErrorStyle={styles.textErrorStyle}
                label="Description"
                placeholderTextColor="gray"
                clearButtonMode="always"
                editable={!Editable}
                selectTextOnFocus={!Editable}
                focusColor="#808080"
                onChangeText={text => { selectedValueDescription(text,item.key)}}
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


            {/* Supplier*/}
            <View style={styles.view_style}>
            <Pressable
                onPress={() =>select_dropdown('Supplier', Supplier,item.key)}
                onLongPress={() => selectedValueSupplier(item.key)}>
                <View pointerEvents={'none'}>
                <TextInput
                    value={item.supplier_label}
                    style={[ styles.input, { height: ( Platform.OS === 'ios' ? 50 : 50) }, ]}
                    inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}, ]}
                    labelStyle={styles.labelStyle}
                    multiline={true}
                    placeholderStyle={{ fontSize: 15, color: '#0096FF', }}
                    label="Supplier"
                    editable={false}
                    selectTextOnFocus={false}
                    renderRightIcon={() =>
                    Editable ? (
                        ''
                    ) : (
                        <AntDesign
                        style={styles.icon}
                        color={'black'}
                        name={item.supplier_label ? 'close' : 'search1'}
                        size={22}
                        disable={true}/>
                    )
                    }
                />
                </View>
            </Pressable>
            </View>


            {/* TaxCode*/}
            <View style={styles.view_style}>
            <Pressable
                onPress={() => !Editable ? select_dropdown('Tax Code', TaxCode,item.key) : '' }
                onLongPress={() => selectedValueTaxCode(item.key)}>
                <View pointerEvents={'none'}>
                <TextInput
                    value={item.tax_code_label}
                    style={[ styles.input, { height: Math.max( Platform.OS === 'ios' ? 50 : 50, TexCode_height, ), }, ]}
                    inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}, ]}
                    labelStyle={styles.labelStyle}
                    multiline
                    placeholderStyle={{ fontSize: 15, color: '#0096FF' }}
                    onContentSizeChange={event => setTexCode_height(event.nativeEvent.contentSize.height) }
                    label="Tax Code"
                   
                    editable={false}
                    selectTextOnFocus={false}
                    renderRightIcon={() =>
                    Editable ? (
                        ''
                    ) : (
                        <AntDesign
                        style={styles.icon}
                        color={'black'}
                        name={item.tax_code_label ? 'close' : 'search1'}
                        size={22}
                        disable={true}
                        
                        />
                    )
                    }
                />
                </View>
            </Pressable>
            </View>


            {/* ChargeCostCenter*/}
            <View style={styles.view_style}>
            <Pressable
                onPress={() =>
                !Editable ? select_dropdown('Charge Cost Center', ChargeCostCenter,item.key) : ''
                }
                onLongPress={() => selectedValueChargeCostCenter(item.key)}>
                <View pointerEvents={'none'}>
                <TextInput
                    value={item.chargecostcenter_label}
                    style={[
                    styles.input,
                    {
                        height: ( Platform.OS === 'ios' ? 50 : 50)
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
                    
                    label="Charge Cost Center"
                    
                    editable={false}
                    selectTextOnFocus={false}
                    renderRightIcon={() =>
                    Editable ? (
                        ''
                    ) : (
                        <AntDesign
                        style={styles.icon}
                        color={'black'}
                        name={item.chargecostcenter_label ? 'close' : 'search1'}
                        size={22}
                        disable={true}
                        
                        />
                    )
                    }
                />
                </View>
            </Pressable>
            </View>


            {/* ChargeAccount*/}
            <View style={styles.view_style}>
            <Pressable
                onPress={() => !Editable ? select_dropdown('Charge Account', ChargeAccount,item.key) : '' }
                onLongPress={() => selectedValueChargeAccount(item.key)}>
                <View pointerEvents={'none'}>
                <TextInput
                    value={item.chargeaccount_label}
                    style={[
                    styles.input,
                    {
                        height: ( Platform.OS === 'ios' ? 50 : 50)
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
                   
                    
                    label="Charge Account"
                    
                    editable={false}
                    selectTextOnFocus={false}
                    renderRightIcon={() =>
                    Editable ? (
                        ''
                    ) : (
                        <AntDesign
                        style={styles.icon}
                        color={'black'}
                        name={item.chargeaccount_label ? 'close' : 'search1'}
                        size={22}
                        disable={true}
                        
                        />
                    )
                    }
                />
                </View>
            </Pressable>
            </View>


            {/* UOM*/}
            <View style={styles.view_style}>
            <Pressable
                onPress={() =>
                !Editable ? select_dropdown('UOM', UOM,item.key) : ''
                }
                onLongPress={() => selectedValueUOM(item.key)}>
                <View pointerEvents={'none'}>
                <TextInput
                    value={item.uom_label}
                    style={[
                    styles.input,
                    {
                        height: ( Platform.OS === 'ios' ? 50 : 50)
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
                    
                    label="UOM"
                    
                    editable={false}
                    selectTextOnFocus={false}
                    renderRightIcon={() =>
                    Editable ? (
                        ''
                    ) : (
                        <AntDesign
                        style={styles.icon}
                        color={'black'}
                        name={item.uom_label ? 'close' : 'search1'}
                        size={22}
                        disable={true}
                        
                        />
                    )
                    }
                />
                </View>
            </Pressable>
            </View>

            {/* quantity  */}
            <View style={styles.view_style}>
                {/* <TextInput
                    value={item.quantity}
                    style={[
                    styles.input,
                    {
                        height: ( Platform.OS === 'ios' ? 50 : 50)
                    },
                    ]}
                    multiline={true}
                    numberOfLines={4}
                    inputStyle={[
                    styles.inputStyle,
                    {color: Editable ? '#808080' : '#000'},
                    ]}
                    labelStyle={styles.labelStyle}
                    keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                    placeholderStyle={{
                    fontSize: 15,
                    color: '#0096FF',
                    }}
                    
                    label="Quantity"
                    
                    editable={!Editable}
                    selectTextOnFocus={!Editable}
                    focusColor="#808080"
                    onChangeText={text => {
                        selectedValueQuantity(text,item.key);
                    }}
                    renderRightIcon={() =>
                    Editable ? (
                        ''
                    ) : (
                        <AntDesign
                        style={styles.icon}
                        name={item.quantity ? 'close' : ''}
                        size={20}
                        disable={true}
                        
                        />
                    )
                    }
                /> */}

                <View style={{ flexDirection: 'row'}}>
                    <TouchableOpacity style={{flex: 0.2,borderColor: 'gray', borderRadius: 1, borderWidth: 1,backgroundColor:'#566573',height:50,justifyContent: 'center',padding:5,alignItems:'center',borderTopLeftRadius:5,borderBottomLeftRadius:5}} 
                    onPress={()=>decrement(item.key)}>
                        <Ionicons
                            name="remove-outline"
                            color="#FDFEFE"
                            size={25}
                            
                        />
                    </TouchableOpacity>

                    <RNTextInput
                        
                        value={item.quantity}
                        key={item.key}
                        style={{flex: 1, height:50, borderColor: 'gray', borderRadius: 1, borderWidth: 1}}
                        keyboardType="numeric"
                        placeholder="Quantity"
                        maxLength={String(999999999).length} 
                        placeholderTextColor="#0096FF"
                        textAlign="center"
                        onChangeText={(text) => {
                        if (text===''|| text.match(/^\d+(\.\d{0,2})?$/)){

                            item.quantity = text
                            selectedValueQuantity(text,item.key)
                        
                        }
                        }}
                        
                        
                    
                        
                    />

                    <TouchableOpacity style={{flex: 0.2,borderColor: 'gray', borderRadius: 1, borderWidth: 1,backgroundColor:'#566573',height:50,justifyContent: 'center',padding:5,alignItems:'center',borderTopRightRadius:5,borderBottomRightRadius:5}} 
                        onPress={()=>increment(item.key)}>
                        <Ionicons
                            name="add-outline"
                            color="#FDFEFE"
                            size={25}
                            
                        />
                    </TouchableOpacity> 
                </View> 

            </View> 


            {/* ItemCost  */}
            <View style={styles.view_style}>
            {/* <TextInput
                value={item.itemcost}
                style={[
                styles.input,
                {
                    height: ( Platform.OS === 'ios' ? 50 : 50)
                },
                ]}
                multiline={true}
                numberOfLines={4}
                inputStyle={[
                styles.inputStyle,
                {color: Editable ? '#808080' : '#000'},
                ]}
                labelStyle={styles.labelStyle}
                keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                placeholderStyle={{
                fontSize: 15,
                color: '#0096FF',
                }}
                
                label="Estimate Cost"
                
                clearButtonMode="always"
                editable={!Editable}
                selectTextOnFocus={!Editable}
                focusColor="#808080"
                onChangeText={text => {
                    selectedValueItemCost(text,item.key);
                }}
                renderRightIcon={() =>
                Editable ? (
                    ''
                ) : (
                    <AntDesign
                    style={styles.icon}
                    name={item.itemcost ? 'close' : ''}
                    size={20}
                    disable={true}
                    
                    />
                )
                }
            /> */}

                <RNTextInput
                    
                    value={item.itemcost}
                    key={item.key}
                    style={{flex: 1, height:50, borderColor: 'gray', borderRadius: 1, borderWidth: 1, borderRadius: 5, paddingHorizontal: 12,}}
                    keyboardType="numeric"
                    placeholder="Estimate Cost"
                   // maxLength={String(999999999).length} 
                    placeholderTextColor="#0096FF"
                    onChangeText={(text) => {
                      if (text===''|| text.match(/^\d+(\.\d{0,2})?$/)){
  
                        item.itemcost = text
                        selectedValueItemCost(text,item.key);
                      
                      }
                    }}
                          
                  />
  
            </View>

        </View>

    );

  }

  //Remove Time Card Item
  removeItem =(key)=>{

    console.log("REMOVE"+key)
    // Alert.alert("Remove Line","Do you confirm to remove the line?",
    //     [
        
    //         { text: "OK", onPress: () => setContractServiceList(ContractServiceList.slice().filter((item)=>item.key !==key)) }

    //     ]);


        setAlert_two(true,'delete','Do you confirm to remove the line?','REMOVE_LINE',key)

    //setTimecard(Timecard.slice().filter((item)=>item.key !==key))
  }
  
 
  const save =(async()=>{


    var ContractService;

    ContractServiceList.map(item =>{

        if(!item.description){
            valid = false;
            setAlert(true,'warning',`Alert line No: ${item.key} Please enter description`,'OK');
            return
    
        }else{

            if(!item.supplier){
                valid = false;
                setAlert(true,'warning',`Alert line No: ${item.key} Please select supplier`,'OK');
                return
        
            }else{

                if(!item.uom){
                    valid = false;
                    setAlert(true,'warning',`Alert line No: ${item.key} Please select UOM`,'OK');
                    return
            
                }else{

                    if(!item.quantity){
                        valid = false;
                        setAlert(true,'warning',`Alert line No: ${item.key} Please select quantity`,'OK');
                        return
                
                    }else{

                        if(!item.itemcost){
                            valid = false;
                            setAlert(true,'warning',`Alert line No: ${item.key} Please select estimate cost`,'OK');
                            return
                    
                        }else{
                            valid =true;
                            ContractService = {
                                Header : HeaderList,
                                Details: ContractServiceList
                            }
            
                        }
        
                    }
    
                }
            }

        }


    })


    if(valid){

    
        console.log(JSON.stringify(ContractService))

        try{
        const response = await axios.post(`${Baseurl}/insert_contractservice.php?`,ContractService,
        {headers:{ 'Content-Type': 'application/json'}});
        console.log('Insert asset response:'+ JSON.stringify(response.data));
        if (response.data.status === 'SUCCESS'){
            setspinner(false)
            // Alert.alert(response.data.status,response.data.message,
            //     [
                
            //         { text: "OK", onPress: () => _goBack()}

            //     ]);

            setAlert(true,'success',response.data.message,'INSERT_CS');
            

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

    }   
  
  })



//Selection Dropdown
const select_dropdown = (dropname, data,key) => {

    //console.log('SELCR'+data+'DROP'+dropname);

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

    if(textvalue == 'Supplier') {
        newData = Dropdown_data.filter(function (item) {
        const itemData = `${item.sup_mst_supplier_cd.toUpperCase()},
            ,${item.sup_mst_desc.toUpperCase()})`;

        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
        });
    } else if (textvalue == 'Tax Code') {
        newData = Dropdown_data.filter(function (item) {
        const itemData = `${item.tax_mst_tax_cd.toUpperCase()},
            ,${item.tax_mst_desc.toUpperCase()})`;

        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
        });
    } else if (textvalue == 'Charge Cost Center') {
        newData = Dropdown_data.filter(function (item) {
        const itemData = `${item.costcenter.toUpperCase()},
            ,${item.descs.toUpperCase()})`;

        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
        });
    } else if (textvalue == 'Charge Account') {
        newData = Dropdown_data.filter(function (item) {
        const itemData = `${item.account.toUpperCase()},
            ,${item.descs.toUpperCase()})`;

        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
        });
    } else if (textvalue == 'UOM') {
        newData = Dropdown_data.filter(function (item) {
        const itemData = `${item.uom_mst_uom.toUpperCase()},
            ,${item.uom_mst_desc.toUpperCase()})`;

        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
        });
    }else if(textvalue == 'PM Group Asset') {
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

    if (textvalue == 'Supplier') {
    setDropDownFilteredData(Supplier);
    } else if (textvalue == 'Tax Code') {
    setDropDownFilteredData(TaxCode);
    } else if (textvalue == 'Charge Cost Center') {
    setDropDownFilteredData(ChargeCostCenter);
    } else if (textvalue == 'Charge Account') {
    setDropDownFilteredData(ChargeAccount);
    } else if (textvalue == 'UOM') {
    setDropDownFilteredData(UOM);
    }else if (textvalue == 'PM Group Asset') {
        setDropDownFilteredData(PMGroupAsset);
    }  

    setRefreshing(false);
}, [refreshing]);


const renderText = item => {
    if (textvalue == 'Supplier') {
    return (
        <View style={styles.dropdown_style}>

        <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{width:'40%'}}>
                <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}>Supplier Code :</Text>
            </View>
            <View style={{flex: 1}}>
                <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.sup_mst_supplier_cd}</Text>
            </View>
        </View>

        <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{width:'40%'}}>
                <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}>Company Name :</Text>
            </View>
            <View style={{flex: 1}}>
                <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.sup_mst_desc}</Text>
            </View>
        </View>

        <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{width:'40%'}}>
                <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}>Status :</Text>
            </View>
            <View style={{flex: 1}}>
                <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.sup_mst_status}</Text>
            </View>
        </View>
        </View>
    );
    } else if (textvalue == 'Tax Code') {
    return (
        <View style={styles.dropdown_style}>
        <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{width:'40%'}}>
                <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}>Tax Code :</Text>
            </View>
            <View style={{flex: 1}}>
                <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.tax_mst_tax_cd}</Text>
            </View>
        </View>

        <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{width:'40%'}}>
                <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}>Description :</Text>
            </View>
            <View style={{flex: 1}}>
                <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.tax_mst_desc}</Text>
            </View>
        </View>

        <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{width:'40%'}}>
                <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}>Tax Rate :</Text>
            </View>
            <View style={{flex: 1}}>
                <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.tax_mst_tax_rate}</Text>
            </View>
        </View>
        </View>
    );
    } else if (textvalue == 'Charge Cost Center') {
    return (
        <View style={styles.dropdown_style}>
        <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{width:'40%'}}>
                <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}>Cost Center :</Text>
            </View>
            <View style={{flex: 1}}>
                <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.costcenter}</Text>
            </View>
        </View>

        <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{width:'40%'}}>
                <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}>Description :</Text>
            </View>
            <View style={{flex: 1}}>
                <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.descs}</Text>
            </View>
        </View>
        </View>
    );
    } else if (textvalue == 'Charge Account') {
        return (
            <View style={styles.dropdown_style}>
            <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
                <View style={{width:'40%'}}>
                    <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}>Account :</Text>
                </View>
                <View style={{flex: 1}}>
                    <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.account}</Text>
                </View>
            </View>
    
            <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
                <View style={{width:'40%'}}>
                    <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}>Description :</Text>
                </View>
                <View style={{flex: 1}}>
                    <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.descs}</Text>
                </View>
            </View>
    
            
            </View>
        );
    } else if (textvalue == 'UOM') {
    return (
        <View style={styles.dropdown_style}>
        <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{width:'40%'}}>
                <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}>UOM Code :</Text>
            </View>
            <View style={{flex: 1}}>
                <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.uom_mst_uom}</Text>
            </View>
        </View>

        <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{width:'40%'}}>
                <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}>Description :</Text>
            </View>
            <View style={{flex: 1}}>
                <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.uom_mst_desc}</Text>
            </View>
        </View>
        </View>
    );
    }else if (textvalue == 'PM Group Asset') {
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
        height: 0.5,
        width: '100%',
        backgroundColor: '#C8C8C8',
        }}
    />
    );
};


const getItem = ditem => {
    // Function for click on an item
    //alert('Id : ' + JSON.stringify(item) );

    if (textvalue == 'Supplier') {

       

        const newData = ContractServiceList.map(item =>{
            if(item.key == select_key){
    
                item.supplier_label = ditem.sup_mst_supplier_cd + ' : ' + ditem.sup_mst_desc,
                item.supplier = ditem.sup_mst_supplier_cd 
        
            return item;
    
            }
            return item;
        })
        //console.log("SELECTED ITEM 23"+ JSON.stringify(newData) )
        setContractServiceList(newData)
        setisRender(!isRender)

      
    } else if (textvalue == 'Tax Code' ) {

        const newData = ContractServiceList.map(item =>{
            if(item.key == select_key){
    
                item.tax_code_label = ditem.tax_mst_tax_cd + ' : ' + ditem.tax_mst_desc
                item.tax_code = ditem.tax_mst_tax_cd
        
            return item;
    
            }
            return item;
        })
        //console.log("SELECTED ITEM 23"+ JSON.stringify(newData) )
        setContractServiceList(newData)
        setisRender(!isRender)

      
    } else if (textvalue == 'Charge Cost Center' ) {

        const newData = ContractServiceList.map(item =>{
            if(item.key == select_key){
    
                item.chargecostcenter_label = ditem.costcenter + ' : ' + ditem.descs
                item.chargecostcenter = ditem.costcenter 
        
            return item;
    
            }
            return item;
        })
        //console.log("SELECTED ITEM 23"+ JSON.stringify(newData) )
        setContractServiceList(newData)
        setisRender(!isRender)
      
    } else if (textvalue == 'Charge Account') {
        const newData = ContractServiceList.map(item =>{
            if(item.key == select_key){
    
                item.chargeaccount_label = ditem.account + ' : ' + ditem.descs
                item.chargeaccount = ditem.account
        
            return item;
    
            }
            return item;
        })
        //console.log("SELECTED ITEM 23"+ JSON.stringify(newData) )
        setContractServiceList(newData)
        setisRender(!isRender)
    } else if (textvalue == 'UOM') {
        const newData = ContractServiceList.map(item =>{
            if(item.key == select_key){
    
                item.uom_label = ditem.uom_mst_uom + ' : ' + ditem.uom_mst_desc
                item.uom = ditem.uom_mst_uom
        
            return item;
    
            }
            return item;
        })
        //console.log("SELECTED ITEM 23"+ JSON.stringify(newData) )
        setContractServiceList(newData)
        setisRender(!isRender)
    }else if (textvalue == 'PM Group Asset') {

        const newData = ContractServiceList.map(item =>{
          if(item.key == select_key){
    
            
            item.assestno = ditem.ast_mst_asset_no
              
            
            
      
          return item;
    
          }
          return item;
      })
      //console.log("SELECTED ITEM 23"+ JSON.stringify(newData) )
      setContractServiceList(newData)
      setisRender(!isRender)
    
      
    
      }  


    setDropDown_search('');
    setDropDown_modalVisible(!DropDown_modalVisible);
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

}else if(D === 'INSERT_CS'){

    setShow(false)

    _goBack()

}

}

const Alret_onClick =(D) =>{

setShow_two(false)

if(D === 'BACK'){

    _goBack()

}else if(D === 'REMOVE_LINE'){

    setContractServiceList(ContractServiceList.slice().filter((item)=>item.key !==AlertData));
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


        <SCLAlert 
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

        </SCLAlert>


        <ProgressLoader
        visible={spinner}
        isModal={true} 
        isHUD={true}
        hudColor={"#808080"}
        color={"#FFFFFF"} />


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

    

        <View style={{  flex: 1, marginBottom: 50}}>


        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : null} 
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>        

            <FlatList
            ListHeaderComponent={

                <View style={styles.container}>
                    <FlatList
                    data={CSList}
                    keyboardShouldPersistTaps='handled'
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={ItemSeparatorView}
                    renderItem={ItemView}       
                    extraData={isRender}     
                    
                    />

                </View>

            }
            keyboardShouldPersistTaps='handled'
            data={ContractServiceList}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={ItemSeparatorView}
            renderItem={ContractService_ItemView}       
            extraData={isRender}     
            
            />
         </KeyboardAwareScrollView>
        </View>


    <View style={ styles.bottomView} >
        <TouchableOpacity
            style={{width:'50%',height:60,backgroundColor:'#0096FF',
            alignItems:'center',justifyContent:'center',marginRight:5}} onPress={()=> addItem()} >
        <Text style={{color:'white', fontSize: 16}}>ADD</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={{width:'50%',height:60,backgroundColor:'#2ECC71',
            alignItems:'center',justifyContent:'center'}} onPress={()=> save()} >
        <Text style={{color:'white', fontSize: 16}}>SAVE</Text>
        </TouchableOpacity>
    </View>

    </SafeAreaProvider>
  
  )
}

export default ContractService

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },

  text_footer: {
    color: '#42A5F5',
    fontSize: 14,
    marginTop: 10,
    marginLeft:5,
  },
  
  text_input:{
    flexDirection: 'row',
    height: 45,
    marginLeft:5,
    color:'#000',
  
  },

  text_input_desc:{
    
    maxHeight:100,
    marginTop: 5,
    marginLeft:5,
    marginRight:5,
    color:'#000',
    borderColor: '#808080',
    borderRadius: 5,
    borderWidth: 1,
  },
 
    
  
  action: {
    flexDirection: 'row',
    height:40,
    borderWidth: 1,
    alignItems:'center',
    marginLeft:5,
    marginRight:10, 
    marginTop:10,  
    borderColor: '#808080',
    borderRadius: 5,
   
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

  item_list:{
 
    backgroundColor: '#fff',
    margin:10,
    padding: 10,
    borderRadius: 10,
    

  },

  view_style: {
    flex:1,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
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