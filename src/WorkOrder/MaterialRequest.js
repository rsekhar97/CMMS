import React,{Fragment}from "react";
import {  View,  StyleSheet,Text, RefreshControl,Image,FlatList ,ScrollView,TouchableOpacity,Alert, Pressable,Dimensions,Modal,BackHandler,SafeAreaView } from 'react-native';
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
import {ImageBackground} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {TextInput} from 'react-native-element-textinput';
import {SearchBar} from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import moment from "moment";
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';
import  NumericPad  from  'react-native-numeric-pad'
import QRCodeScanner from 'react-native-qrcode-scanner';
import { TextInput as RNTextInput } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

var db = openDatabase({ name: 'CMMS.db' });
let Baseurl,Site_cd,LoginID,EmpName,EmpID,EmpPhone,EmpWorkGrp,dvc_id,WIFI;


const deviceWidth = Dimensions.get('screen').width;
const deviceHeight = Dimensions.get('screen').height;

const MaterialRequest = ({route,navigation}) => {

  var valid = false;
  const numpadRef =React.useRef(null)

  const { colors } = useTheme();

  const [spinner, setspinner]= React.useState(false);
  const [Toolbartext, setToolbartext]= React.useState("Material Request");
  const [Editable, setEditable] = React.useState(false);
  const [height, setHeight] = React.useState(0);

  const [PMGroupAsset,setPMGroupAsset] = React.useState([]);

  const [MRList,setMRList] =  React.useState([]);

  const [Stock_No,setStock_No] =  React.useState([]);
  const [StockLocation,setStockLocation] =  React.useState([]);

  const [HeaderList,setHeaderList] =  React.useState([]);

  const [MaterialRequestList,setMaterialRequestList] =  React.useState([]);
  const [isRender,setisRender]=React.useState(false);
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
  const [AlertData, setAlertData] = React.useState([]);



  const [search, setSearch] = React.useState('');

  //QR CODE
  const [showqrcode, setshowqrcode] = React.useState(false);
  const [scan, setscan] = React.useState(false);
  const [ScanResult, setScanResult] = React.useState(false);
  const [result, setresult] = React.useState(null);
  const [TabVisible, setTabVisible] = React.useState(false);

  const _goBack = () => {

    if (route.params.Screenname == 'FilteringWorkOrder'){
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
    } else if (route.params.Screenname == 'MyWorkOrder'){
        navigation.navigate('CreateWorkOrder',{

            Selected_WorkOrder_no:route.params.Selected_WorkOrder_no,
            RowID:route.params.RowID,

            local_id:route.params.local_id,
            Selected_wko_mst_ast_cod:route.params.Selected_wko_mst_ast_cod,
            Selected_wko_mst_type:route.params.Selected_wko_mst_type,
            Screenname:route.params.Screenname,

        });
    } else if (route.params.Screenname == 'WoDashboard'  || route.params.Screenname == 'MYWO_Dashboard_Due' || route.params.Screenname == 'MYWO_Dashboard_Past'){
        navigation.navigate('CreateWorkOrder',{

            Selected_WorkOrder_no:route.params.Selected_WorkOrder_no,
            RowID:route.params.RowID,

            local_id:route.params.local_id,
            Selected_wko_mst_ast_cod:route.params.Selected_wko_mst_ast_cod,
            Selected_wko_mst_type:route.params.Selected_wko_mst_type,

            Screenname:route.params.Screenname,
            type:route.params.type,

        });
    } else if (route.params.Screenname == 'ScanAssetMaster'){

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
        
    } else if(route.params.Screenname == "AssetListing"){    
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
    setAlert_two(true,'warning','Do you want to exit material request screen?','BACK')
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
    WIFI = await AsyncStorage.getItem('WIFI');
    console.log("WORK DATA:  "+ WIFI);

    console.log('WorkOrder_no:', route.params.Selected_WorkOrder_no)
    console.log('mst_RowID:', route.params.RowID)

    console.log('ASSETNO:', route.params.Selected_AssetNo)
    console.log('CostCenter:', route.params.Selected_CostCenter)
    console.log('LaborAccount:', route.params.Selected_LaborAccount)
    console.log('ContractAccount:', route.params.Selected_ContractAccount)
    console.log('MaterialAccount:', route.params.Selected_MaterialAccount)
    console.log('PMGroupType:', route.params.Selected_PMGroupType)

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

    if(route.params.Selected_LaborAccount === ''){
      ContractAccount = '';
    }else{
      let ContractAccount_split= route.params.Selected_ContractAccount.split(':');
  
      ContractAccount=ContractAccount_split[0]
    }

    if(route.params.Selected_LaborAccount === ''){
      MaterialAccount =''
    }else{
      
      let MaterialAccount_split= route.params.Selected_MaterialAccount.split(':')
      MaterialAccount =MaterialAccount_split[0]
    }

      // let Assetno,PMGroupType;
      //   if(route.params.Selected_PMGroupType == '' || route.params.Selected_PMGroupType == null){
      //     Assetno=route.params.Selected_AssetNo;
      //     PMGroupType = false
      //   }else{
      //     if(route.params.Selected_PMGroupType === 'G'){
      //       Assetno = ""
      //       PMGroupType= true;
      //     }else{
      //       Assetno=route.params.Selected_AssetNo;
      //       PMGroupType = false
      //     }

      //   }
      var sync_date = moment().format('YYYY-MM-DD hh:mm');

      setHeaderList([{

        site_cd:Site_cd,
        wko_RowID:route.params.RowID,
        wko_mst_wo_no:route.params.Selected_WorkOrder_no,
        wko_mst_assetno:route.params.Selected_AssetNo,
        wko_mst_chg_costcenter:CostCenter,
        wko_det_laccount:LaborAccount,
        wko_det_caccount:ContractAccount,
        wko_det_maccount:MaterialAccount,
        audit_user:EmpID,
        audit_date:sync_date,
        LOGINID:LoginID,
        type:route.params.Selected_PMGroupType
       
        

      }])

    
      db.transaction(function(txn){

          //mrstockno
          txn.executeSql( 'SELECT * FROM mrstockno', [], (tx, { rows }) => { setStock_No(rows.raw())});  

      });

      get_materialrequest_list();
      
  }


  //GET CONSTRACT SERVICE LIST API ONLINE
  const get_materialrequest_list=(async()=>{

    setspinner(true);
    try{

      console.log("JSON DATA : " + `${Baseurl}/get_materialrequest_list.php?site_cd=${(Site_cd)}&mst_RowID=${route.params.RowID}`)
      const response = await axios.get(`${Baseurl}/get_materialrequest_list.php?site_cd=${(Site_cd)}&mst_RowID=${route.params.RowID}`);

      console.log("JSON DATA : " + JSON.stringify( response.data.data))
     
      if (response.data.status === 'SUCCESS') 
      {
        
        setMRList(response.data.data);
        // setspinner(false);

        if(route.params.Selected_PMGroupType === ''){
          setspinner(false);
        }else{
          get_pm_grouptype_asset();
        }
      
      }else{
          setspinner(false);
          setAlert(true,'warning',response.data.message,'OK');
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



  //Selected Stock No
  const selectedValueStockNo = (clear_key)=> {

    const newData = MaterialRequestList.map(item =>{
        if(item.key == clear_key){

            item.stockno = ''
          
          
    
        return item;

        }
        return item;
    })
    //console.log("SELECTED ITEM 23"+ JSON.stringify(newData) )
    setMaterialRequestList(newData)
    setisRender(!isRender)


  };

  //Selected Supplier
  const selectedValueStockLoc = (clear_key)=> {

    const newData = MaterialRequestList.map(item =>{
        if(item.key == clear_key){

            item.stockloc = ''
           
          
    
        return item;

        }
        return item;
    })
    //console.log("SELECTED ITEM 23"+ JSON.stringify(newData) )
    setMaterialRequestList(newData)
    setisRender(!isRender)


  };

   //Selected Supplier
   const selectedValueDescription = (text,select_key)=> {

    const newData = MaterialRequestList.map(item =>{
        if(item.key == select_key){

            item.description = text
          
    
        return item;

        }
        return item;
    })
    //console.log("SELECTED ITEM 23"+ JSON.stringify(newData) )
    setMaterialRequestList(newData)
    setisRender(!isRender)


  };


  //Selected quantity
  const selectedValueQuantity = (text,clear_key)=> {

    MaterialRequestList.map(item =>{
        if(item.key == clear_key){

          item.quantity = text
           
        return item;

        }
        return item;
    })
    //console.log("SELECTED ITEM 23"+ JSON.stringify(newData) )
   // setMaterialRequestList(newData)
    setisRender(!isRender)


  };


  const increment = (key) => {

      console.log('increment key :',key)

      // Increment the value by 0.01 (or any other desired step)
      //setValue((prevValue) => (parseFloat(prevValue )+ 1).toFixed(2));

      

      MaterialRequestList.map(item =>{

          if(item.key == key){

            const numberValue = Number(item.quantity);

            if (item.quantity > 0) {
                
              if (Number.isInteger(numberValue)) {

                item.quantity = (parseInt(item.quantity)+ 1).toString();

              } else if (typeof numberValue === 'number') {

                item.quantity = (parseFloat(item.quantity )+ 1).toFixed(2);
              }

            }else{
                
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

      MaterialRequestList.map(item =>{

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

  //Add MR Line 
  const addItem =(()=>{

    console.log(route.params.Selected_AssetNo);
    var sync_date = moment().format('YYYY-MM-DD hh:mm');
    if(MaterialRequestList.length > 0){

      MaterialRequestList.map(item =>{

        if(item.PMGroupType){

          if(!item.Assetno){
  
            
            setAlert(true,'warning',`Alert line No: ${item.key} Please select asset no`,'OK');
            valid =false
            return
            
            
          }
          
          
        }

        if(!item.stockno){
          valid = false;
          setAlert(true,'warning',`Alert line No: ${item.key} Please select Stock No`,'OK');
          return
        }else{
  
          if(!item.stockloc){
            valid = false;
            setAlert(true,'warning',`Alert line No: ${item.key} Please select Stock Location`,'OK');
            return
      
          }else{
  
            if(!item.description){
              valid = false;
              setAlert(true,'warning',`Alert line No: ${item.key} Please enter Description`,'OK');
              return
  
            }else{
  
              if(!item.quantity){
                valid = false;
                setAlert(true,'warning',`Alert line No: ${item.key} Please enter Quantity`,'OK');
                return
              }else{
  
                if(item.quantity <= 0){
                  valid = false;
                  setAlert(true,'warning',`Alert line No: ${item.key} Quantity can not be zero`,'OK');
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
        let key = MaterialRequestList.length + 1;

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
        

        setMaterialRequestList(MaterialRequestList =>[...MaterialRequestList,              
        {

          key:key,
          stockno:'',
          stockloc:'',
          description:'',
          uom:'',
          issueqty:'0.0000',
          quantity:'',
          chargecostcenter:'',
          chargeaccount:'',
          itemcost:'',
          Assetno:Assetno,
          PMGroupType:PMGroupType,

        },
      
        ]);

      }

    }else{

        let key = MaterialRequestList.length + 1;

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

        setMaterialRequestList(MaterialRequestList =>[...MaterialRequestList,              
          {
            
            key:key,
            stockno:'',
            stockloc:'',
            description:'',
            uom:'',
            issueqty:'0.0000',
            quantity:'',
            chargecostcenter:'',
            chargeaccount:'',
            itemcost:'',
            Assetno:Assetno,
            PMGroupType:PMGroupType,
            
            
          },
      
        ]);

    }



  });

  const ItemView =({item,index})=>{

    console.log("ADD : "+item.key)
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
          <View style={[styles.view_style,{display: item.PMGroupType ? 'flex' : 'none'}]}>
              <Pressable onPress={() => !item.TimeEditable ? select_dropdown('PM Group Asset',PMGroupAsset,item.key) : '' } >
                  <View pointerEvents={'none'}>
                  <TextInput
                      value={item.Assetno}
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

           {/* stockno*/}
           <View style={styles.view_style}>
            <Pressable
                onPress={() =>select_dropdown('Stock Number', Stock_No,item.key)}
                onLongPress={() => selectedValueStockNo(item.key)}>
                <View pointerEvents={'none'}>
                <TextInput
                    value={item.stockno}
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
                    label="Stock No"
                    editable={false}
                    selectTextOnFocus={false}
                    renderRightIcon={() =>
                    Editable ? (
                        ''
                    ) : (
                        <AntDesign
                        style={styles.icon}
                        color={'black'}
                        name={item.stockno ? 'close' : 'search1'}
                        size={22}
                        disable={true}/>
                    )
                    }
                />
                </View>
            </Pressable>
            </View>


            {/* Stock Location*/}
            <View style={styles.view_style}>
            <Pressable
                onPress={() =>
                !Editable ? select_dropdown('Stock Location', StockLocation,item.key) : ''
                }
                onLongPress={() => selectedValueStockLoc(item.key)}>
                <View pointerEvents={'none'}>
                <TextInput
                    value={item.stockloc}
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
                    multiline
                    placeholderStyle={{
                    fontSize: 15,
                    color: '#0096FF',
                    }}
                   
                    label="Stock Location"
                   
                    editable={false}
                    selectTextOnFocus={false}
                    renderRightIcon={() =>
                    Editable ? (
                        ''
                    ) : (
                        <AntDesign
                        style={styles.icon}
                        color={'black'}
                        name={item.stockloc ? 'close' : 'search1'}
                        size={22}
                        disable={true}
                        
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
                    selectedValueDescription(text,item.key);
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

            {/* ChargeCostCenter*/}
            <View style={styles.view_style}>
            <Pressable
                
                onLongPress={() => selectedValueChargeCostCenter(item.key)}>
                <View pointerEvents={'none'}>
                <TextInput
                    value={item.chargecostcenter}
                    style={[
                    styles.input,
                    {
                        height: ( Platform.OS === 'ios' ? 50 : 50)
                    },
                    ]}
                    inputStyle={[
                    styles.inputStyle,
                    {color: !Editable ? '#808080' : '#000'},
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
                        name={item.chargecostcenter? '' : ''}
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
                
                onLongPress={() => selectedValueChargeAccount(item.key)}>
                <View pointerEvents={'none'}>
                <TextInput
                    value={item.chargeaccount}
                    style={[
                    styles.input,
                    {
                        height: ( Platform.OS === 'ios' ? 50 : 50)
                    },
                    ]}
                    inputStyle={[
                    styles.inputStyle,
                    {color: !Editable ? '#808080' : '#000'},
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
                        name={item.chargeaccount ? '' : ''}
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
                
                onLongPress={() => selectedValueUOM(item.key)}>
                <View pointerEvents={'none'}>
                <TextInput
                    value={item.uom}
                    style={[
                    styles.input,
                    {
                        height: ( Platform.OS === 'ios' ? 50 : 50)
                    },
                    ]}
                    inputStyle={[
                    styles.inputStyle,
                    {color: !Editable ? '#808080' : '#000'},
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
                        name={item.uom ? '' : ''}
                        size={22}
                        disable={true}
                        
                        />
                    )
                    }
                />
                </View>
            </Pressable>
            </View>

          
            {/* ItemCost  */}
            <View style={styles.view_style}>
            <TextInput
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
                {color: !Editable ? '#808080' : '#000'},
                ]}
                labelStyle={styles.labelStyle}
                
                placeholderStyle={{
                fontSize: 15,
                color: '#0096FF',
                }}
                
                label="Item Cost"
                
                clearButtonMode="always"
                editable={Editable}
                selectTextOnFocus={Editable}
                focusColor="#808080"
               
                renderRightIcon={() =>
                Editable ? (
                    ''
                ) : (
                    <AntDesign
                    style={styles.icon}
                    name={item.itemcost ? '' : ''}
                    size={20}
                    disable={true}
                    
                    />
                )
                }
            />
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
        
    //         { text: "OK", onPress: () => setMaterialRequestList(MaterialRequestList.slice().filter((item)=>item.key !==key)) }

    //     ]);


    setAlert_two(true,'delete','Do you confirm to remove the line?','REMOVE_LINE',key)

    //setTimecard(Timecard.slice().filter((item)=>item.key !==key))
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

    if(textvalue == 'Stock Number') {
        newData = Dropdown_data.filter(function (item) {
        const itemData = `${item.itm_mst_stockno.toUpperCase()}
            ,${item.itm_mst_costcenter.toUpperCase()}
            ,${item.itm_mst_desc.toUpperCase()}`;

        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
        });
    } else if(textvalue == 'Stock Location') {
      newData = Dropdown_data.filter(function (item) {
      const itemData = `${item.itm_loc_stk_loc.toUpperCase()}
          ,${item.loc_mst_desc.toUpperCase()}`;

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

    if (textvalue == 'Stock Number') {
      setDropDownFilteredData(Stock_No);
    } else if (textvalue == 'Stock Location') {
      setDropDownFilteredData(StockLocation);
    }else if (textvalue == 'PM Group Asset') {
      setDropDownFilteredData(PMGroupAsset);
    } 

    setRefreshing(false);
  }, [refreshing]);


  const renderText = item => {
    if (textvalue == 'Stock Number') {
    return (
        <View style={styles.dropdown_style}>

          <View style={{flex:1,justifyContent:'space-between',flexDirection:'row',alignItems:'center'}}>
            <View style={{backgroundColor:'#D6EAF8',padding:10,borderRadius:5}}>
              <Text style={{color:'#2962FF',fontSize: 13,fontWeight: 'bold'}} > {item.itm_mst_stockno}</Text>
            </View>
            <Text style={{fontSize: 12,color:'#000',marginRight:10,fontWeight:'bold'}} >ACT</Text>
          </View>


          <View style={{flex:1,justifyContent:'space-between',flexDirection:'row',alignItems:'center',marginTop: 5, marginLeft: 5}}>
            <View style={{width:'40%'}} >
              <Text style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Master Location : </Text>
            </View>

            <View style={{flex: 1}}>
              <Text style={{justifyContent: 'flex-start', color: '#000'}}> {item.itm_mst_mstr_locn} </Text>
            </View>

            <Pressable
              onPress={() => 
                Alert.alert(
                'View Details',
                `Stock No : ${item.itm_mst_stockno}\nTotal OH : ${item.itm_mst_ttl_oh}\nIssue Price : ${item.itm_mst_issue_price}\nMaster location: ${item.itm_mst_mstr_locn}`,
                [
                    {text:"OK",
                    
                    },
                    
                ]
              )}
            >
              <View style={{backgroundColor:'#2962FF',padding:10,borderRadius:5}}>
                <Text style={{color:'#fff',fontSize: 13,fontWeight: 'bold'}} > View Details</Text>
              </View>
            </Pressable>
            
          </View>

        

          <View style={{flexDirection: 'row', marginLeft: 5}}>
            <View style={{width:'40%'}}>
              <Text style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Cost Center : </Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={{justifyContent: 'flex-start', color: '#000'}}> {item.itm_mst_costcenter} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{width:'40%'}}>
              <Text style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Description :
            </Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={{justifyContent: 'flex-start', color: '#000'}}> {item.itm_mst_desc} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{width:'40%'}}>
              <Text style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Extended Desc : </Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={{justifyContent: 'flex-start', color: '#000'}}> {item.itm_mst_ext_desc} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{width:'40%'}}>
              <Text style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Part No : </Text>
            </View>
            <View style={{flex: 1}}> 
              <Text style={{justifyContent: 'flex-start', color: '#000'}}> {item.itm_mst_partno} </Text>
            </View>
          </View>
      </View>
    );
    } 
    else if (textvalue == 'Stock Location') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginLeft: 5}}>
            <View style={{width:'40%'}} >
              <Text style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Stock Location : </Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={{justifyContent: 'flex-start', color: '#000'}}> {item.itm_loc_stk_loc} </Text>
            </View>
          </View>
    
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{width:'40%'}}>
              <Text style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Description : </Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={{justifyContent: 'flex-start', color: '#000'}}> {item.loc_mst_desc} </Text>
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
        height: 0.8,
        width: '100%',
        backgroundColor: '#C8C8C8',
        }}
    />
    );
  };


  const getItem = ditem => {
    // Function for click on an item
  // alert('Id : ' + textvalue );

    if (textvalue == 'Stock Number') {

      
        const newData = MaterialRequestList.map(item =>{
            if(item.key == select_key){
    
                item.stockno = ditem.itm_mst_stockno,
                item.stockloc = ditem.itm_mst_mstr_locn,
                item.description = ditem.itm_mst_desc,
                item.uom = ditem.itm_mst_issue_uom,
                item.itemcost = ditem.itm_mst_issue_price,
                item.chargecostcenter = ditem.itm_mst_costcenter,
                item.chargeaccount = ditem.itm_mst_account
              
        
            return item;
    
            }
            return item;
        })
        //console.log("SELECTED ITEM 23"+ JSON.stringify(newData) )
        setMaterialRequestList(newData)
        setisRender(!isRender)

        setDropDown_search('');
        setDropDown_modalVisible(!DropDown_modalVisible);
        get_wkr_master_location(ditem.itm_mst_stockno)

      
    } else if (textvalue == 'Stock Location') {

      
      const newData = MaterialRequestList.map(item =>{
          if(item.key == select_key){

            
              item.stockloc = ditem.itm_loc_stk_loc,
              item.description = ditem.loc_mst_desc
            
            
      
          return item;

          }
          return item;
      })
      //console.log("SELECTED ITEM 23"+ JSON.stringify(newData) )
      setMaterialRequestList(newData)
      setisRender(!isRender)

      setDropDown_search('');
      setDropDown_modalVisible(!DropDown_modalVisible);
    

    
  }else if (textvalue == 'PM Group Asset') {

    const newData = MaterialRequestList.map(item =>{
      if(item.key == select_key){

        
        item.Assetno = ditem.ast_mst_asset_no
          
        
        
  
      return item;

      }
      return item;
  })
  //console.log("SELECTED ITEM 23"+ JSON.stringify(newData) )
  setMaterialRequestList(newData)
  setisRender(!isRender)

  setDropDown_search('');
  setDropDown_modalVisible(!DropDown_modalVisible);

  } 

  

  };


  const get_wkr_master_location =(async(mst_stockno)=>{

      try{

        console.log("JSON DATA : " + `${Baseurl}/get_wkr_master_location.php?site_cd=${(Site_cd)}&itm_mst_stockno=${mst_stockno}`)
        const response = await axios.get(`${Baseurl}/get_wkr_master_location.php?site_cd=${(Site_cd)}&itm_mst_stockno=${mst_stockno}`);

        console.log("JSON DATA : " + JSON.stringify( response.data.data))
      
        if (response.data.status === 'SUCCESS') 
        {
          
          setStockLocation(response.data.data);
          
        
        }else{
            
          setAlert(true,'warning',response.data.message,'OK');
            
        }

      }catch(error){

          
          alert(error);
      } 


  })


  const save =(async()=>{

    var MaterialRequest;

    //console.log('SORT: ',JSON.stringify([...MaterialRequestList].sort((a,b)=>a.Assetno > b.Assetno ?  1 : -1)))



    MaterialRequestList.map(item =>{

    
      if(!item.stockno){
        valid = false;
        setAlert(true,'warning',`Alert line No: ${item.key} Please select Stock No`,'OK');
        return
      }else{

        if(!item.stockloc){
          valid = false;
          setAlert(true,'warning',`Alert line No: ${item.key} Please select Stock Location`,'OK');
          return
    
        }else{

          if(!item.description){
            valid = false;
            setAlert(true,'warning',`Alert line No: ${item.key} Please enter Description`,'OK');
            return

          }else{

            if(!item.quantity){
              valid = false;
              setAlert(true,'warning',`Alert line No: ${item.key} Please enter Quantity`,'OK');
              return
            }else{

              if(item.quantity <= 0){
                valid = false;
                setAlert(true,'warning',`Alert line No: ${item.key} Quantity can not be zero`,'OK');
                return
              }else{

               

                valid =true;
                MaterialRequest = {
                  Header : HeaderList,
                  Details: [...MaterialRequestList].sort((a,b)=>a.Assetno > b.Assetno ?  1 : -1)
                }

              }

              

            }

          }
            

        }

      }


    })


    if(valid){

    
        console.log(JSON.stringify(MaterialRequest))

        console.log(JSON.stringify(MaterialRequestList.length))

        try{
        const response = await axios.post(`${Baseurl}/insert_mr.php?`,MaterialRequest,
        {headers:{ 'Content-Type': 'application/json'}});
        console.log('Insert asset response:'+ JSON.stringify(response.data));
        if (response.data.status === 'SUCCESS'){
            setspinner(false)
            // Alert.alert(response.data.status,response.data.message,
            //     [
                
            //         { text: "OK", onPress: () => _goBack()}

            //     ]);

            setAlert(true,'success',response.data.message,'INSERT_MR');
            

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


  const MR_ItemView =({item,index})=>{

    let status,statucolor,stockstatus,stockcolor;

    if(item.mtr_mst_status === 'A'){
      status='Approved'
      statucolor='#A7E230'

    }else if(item.mtr_mst_status === 'W'){

      status='Awaiting App'
      statucolor='#FC2F48'
      
    }else if(item.mtr_mst_status === 'D'){

      status='Disapproved'
      statucolor='#FC3F48'
      
    }

    // let NEED_QTY = item.wko_ls2_qty_needed;
    // let RCV_QTY = item.mtr_ls1_rcv_qty;
    // let CLR_QTY = item.mtr_ls1_clear_qty;
    // let TOTAL_QTY = item.TotalAvailable;


    let NEED_QTY,RCV_QTY,CLR_QTY,TOTAL_QTY;

    if(item.wko_ls2_qty_needed == '.0000'){
      NEED_QTY = '0'
    }else{
      NEED_QTY = item.wko_ls2_qty_needed
    }

    if(item.mtr_ls1_rcv_qty == '.0000'){
      RCV_QTY = '0'
    }else{
      RCV_QTY = item.mtr_ls1_rcv_qty
    }

    if(item.mtr_ls1_clear_qty == '.0000'){
      CLR_QTY = '0'
    }else{
      CLR_QTY = item.mtr_ls1_clear_qty
    }

    if(item.TotalAvailable == '.0000'){
      TOTAL_QTY = '0'
    }else{
      TOTAL_QTY = item.TotalAvailable
    }
    
     
    const val_NEED_QTY = parseFloat(NEED_QTY).toFixed(2);
    const val_RCV_QTY = parseFloat(RCV_QTY).toFixed(2);
    const val_CLR_QTY = parseFloat(CLR_QTY).toFixed(2);
    const val_TOTAL_QTY = parseFloat(TOTAL_QTY).toFixed(2);

    // console.log('N',val_NEED_QTY)
    // console.log('R',val_RCV_QTY)
    // console.log('C',val_CLR_QTY)
    // console.log('T',val_TOTAL_QTY)

    
    
    // console.log('N1',parseFloat(val_RCV_QTY )+ parseFloat(val_CLR_QTY));

    // console.log('N2',parseFloat(val_NEED_QTY) != (parseFloat(val_RCV_QTY) + parseFloat(val_CLR_QTY)) && (parseFloat(val_TOTAL_QTY) >= (parseFloat(val_NEED_QTY) - parseFloat(val_RCV_QTY) + parseFloat(val_CLR_QTY))))
    // console.log('N3',parseFloat(val_NEED_QTY) != (parseFloat(val_RCV_QTY) + parseFloat(val_CLR_QTY)) && (parseFloat(val_TOTAL_QTY) < (parseFloat(val_NEED_QTY) - parseFloat(val_RCV_QTY) + parseFloat(val_CLR_QTY))))
  
    

    if( val_NEED_QTY == parseFloat(val_RCV_QTY )+ parseFloat(val_CLR_QTY)){
      stockstatus='Fully Issued'
      stockcolor ='#A7E230'
    }else if(parseFloat(val_NEED_QTY) != (parseFloat(val_RCV_QTY) + parseFloat(val_CLR_QTY)) && (parseFloat(val_TOTAL_QTY) >= (parseFloat(val_NEED_QTY) - parseFloat(val_RCV_QTY) + parseFloat(val_CLR_QTY)))){
      stockstatus= 'Ready to Issued'
      stockcolor ='#A7E230'
    }else if(parseFloat(val_NEED_QTY) != (parseFloat(val_RCV_QTY) + parseFloat(val_CLR_QTY)) && (parseFloat(val_TOTAL_QTY) < (parseFloat(val_NEED_QTY) - parseFloat(val_RCV_QTY) + parseFloat(val_CLR_QTY)))){
      stockstatus='Shortage'
      stockcolor ='#FC3F48'

    }
    return(

      <TouchableOpacity onPress={() => getItem(item)}>
        <View style={styles.item_list}>
          <View style={{flexDirection:"row",marginTop:5}}>
            <View style={{width:'40%'}}>
                <Text  style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >MR Line No :</Text>
            </View>
            <View style={{flex:1}}>
                <Text  style={{justifyContent: 'flex-start',color:'#000'}} >{item.wko_ls2_mr_lineno}</Text>
            </View>
          </View>
          <View style={{flexDirection:"row",marginTop:5}}>
            <View style={{width:'40%'}}>
                <Text  style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Asset No :</Text>
            </View>
            <View style={{flex:1}}>
                <Text  style={{justifyContent: 'flex-start',color:'#000'}} >{item.wko_ls2_assetno}</Text>
            </View>
          </View>

          <View style={{flexDirection:"row",justifyContent:'space-between',marginTop:5}}>
            <View style={{width:'40%'}}>
                <Text  style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >MR No :</Text>
            </View>
            <View style={{flex:1}}>
                <Text  style={{justifyContent: 'flex-start',color:'#000'}} >{item.wko_ls2_mr_no}</Text>
            </View>
            <View style={{flex:1,backgroundColor:statucolor,padding:5,borderRadius:5,alignItems:'center'}}>
                <Text  style={{color:'#FFF',fontWeight: 'bold',justifyContent: 'flex-start'}} >{status}</Text>
            </View>
          </View>

          <View style={{flexDirection:"row",justifyContent:'space-between',marginTop:5}}>
            <View style={{width:'40%'}}>
                <Text  style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Stock No :</Text>
            </View>
            <View style={{flex:1}}>
                <Text  style={{justifyContent: 'flex-start',color:'#000'}} >{item.wko_ls2_stockno}</Text>
            </View>
            <View style={{flex:1,backgroundColor:stockcolor,padding:5,borderRadius:5,alignItems:'center'}}>
                <Text  style={{color:'#FFF',fontWeight: 'bold',}} >{stockstatus}</Text>
            </View>
          </View>
          
          <View style={{flexDirection:"row",marginTop:5}}>
            <View style={{width:'40%'}}>
                <Text  style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Cost Center :</Text>
            </View>
            <View style={{flex:1}}>
                <Text  style={{justifyContent: 'flex-start',color:'#000'}} >{item.wko_ls2_chg_costcenter}</Text>
            </View>
          </View>

          <View style={{flexDirection:"row",marginTop:5}}>
            <View style={{width:'40%'}}>
                <Text  style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >MR Location :</Text>
            </View>
            <View style={{flex:1}}>
                <Text  style={{justifyContent: 'flex-start',color:'#000'}} >{item.wko_ls2_stk_locn}</Text>
            </View>
          </View>

          <View style={{flexDirection:"row",marginTop:5}}>
            <View style={{width:'40%'}}>
                <Text  style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Description :</Text>
            </View>
            <View style={{flex:1}}>
                <Text  style={{justifyContent: 'flex-start',color:'#000'}} >{item.wko_ls2_desc}</Text>
            </View>
          </View>

          <View style={{flexDirection:"row",marginTop:5}}>
            <View style={{width:'40%'}}>
                <Text  style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >UOM :</Text>
            </View>
            <View style={{flex:1}}>
                <Text  style={{justifyContent: 'flex-start',color:'#000'}} >{item.wko_ls2_mtl_uom}</Text>
            </View>
          </View>

          <View style={{flexDirection:"row",marginTop:5}}>
            <View style={{width:'40%'}}>
                <Text  style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Item Cost :</Text>
            </View>
            <View style={{flex:1}}>
                <Text  style={{justifyContent: 'flex-start',color:'#000'}} >{parseFloat(item.wko_ls2_item_cost).toFixed(2)}</Text>
            </View>
          </View>

          <View style={{flexDirection:"row",marginTop:5,justifyContent:'space-between'}}>

            <View style={{flexDirection:"row"}}>
              <View >
                  <Text  style={{color:'#FF5733',fontWeight: 'bold',justifyContent: 'flex-start'}} >Issue Qty :</Text>
              </View>
              <View >
                  <Text  style={{justifyContent: 'flex-start',color:'#FF5733',marginLeft:5}} >{parseFloat(item.mtr_ls1_rcv_qty).toFixed(2)}</Text>
              </View>
            </View>

            <View style={{flexDirection:"row",}}>
              <View >
                  <Text  style={{color:'#FF5733',fontWeight: 'bold',justifyContent: 'flex-start'}} >Requested Qty :</Text>
              </View>
              
              <View >
                  <Text  style={{justifyContent: 'flex-start',color:'#FF5733',marginLeft:5}} >{parseFloat(item.wko_ls2_qty_needed).toFixed(2)}</Text>
              </View>
            </View>
            
          </View>  
        </View>
      </TouchableOpacity>  

    );

  }

  const MR_ItemSeparatorView=()=>{

    return (
      // Flat List Item Separator
      <View
      style={{
    
      backgroundColor: '#C8C8C8',
      }}/>
    );
  }


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

    }else if(D === 'INSERT_MR'){

      setShow(false)

      _goBack()

    }

  }

  const Alret_onClick =(D) =>{

    setShow_two(false)

    if(D === 'BACK'){

      _goBack()

    }else if(D === 'REMOVE_LINE'){

      setMaterialRequestList(MaterialRequestList.slice().filter((item)=>item.key !==AlertData))
    } 

  }

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
      const newData = Stock_No.filter(function (item) {
        //const itemData = item.ast_mst_asset_no ? item.ast_mst_asset_no.toUpperCase() : ''.toUpperCase();
          //const itemData = item.ast_mst_asset_no.toUpperCase(),;
          const itemData = `${item.itm_mst_stockno.toUpperCase()}`
      
        const textData =  e.data.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setDropDownFilteredData(newData);
      setSearch(e.data);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setDropDownFilteredData(WorkOrderList);
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

      <ProgressLoader visible={spinner} isModal={true} isHUD={true} hudColor={"#808080"} color={"#FFFFFF"} />

     

        <Modal
            animationType="slide"
            transparent={true}
            visible={DropDown_modalVisible}
            onRequestClose={() => {
            //Alert.alert('Closed');
            setDropDown_modalVisible(!DropDown_modalVisible);
            }}>
            <View style={styles.model2_cardview}>

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
              <View style={{flex: 1, margin: 20, backgroundColor: '#FFFFFF'}}>
                <View style={{flexDirection: 'row', alignItems: 'center', height: 50}}>
                  <Text style={{ flex: 1, fontSize: 15, justifyContent: 'center', textAlign: 'center', color: '#000', fontWeight: 'bold', }}> {textvalue} </Text>
                  <Ionicons name="close" color="red" size={30} style={{marginEnd: 15}} onPress={() => setDropDown_modalVisible(!DropDown_modalVisible)} />
                </View>

                <View style={styles.view_5}> 

                    <SearchBar
                      lightTheme
                      round
                      containerStyle={{flex:1}}
                      inputStyle={{color:'#000'}}
                      inputContainerStyle={{backgroundColor:'#fff'}}
                      searchIcon={{ size: 24 }}
                      onChangeText={text => DropDown_searchFilterFunction(text)}
                      onClear={text => DropDown_searchFilterFunction('')}
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

                  {/* <SearchBar
                    lightTheme
                    round
                    inputStyle={{color: '#000'}}
                    inputContainerStyle={{backgroundColor: '#FFFF'}}
                    searchIcon={{size: 24}}
                    onChangeText={text => DropDown_searchFilterFunction(text)}
                    onClear={text => DropDown_searchFilterFunction('')}
                    placeholder="Search here..."
                    value={DropDown_search}
                  /> */}

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
            ListHeaderComponent={

            <View style={styles.container}>
                <FlatList
                data={MRList}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={MR_ItemSeparatorView}
                renderItem={MR_ItemView}       
                extraData={isRender}     
                
                />

            </View>

            }
            data={MaterialRequestList}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={ItemSeparatorView}
            renderItem={ItemView}       
          
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

export default MaterialRequest

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#e0e0eb'
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
  model2_cardview:{

    flex:1,
    marginTop:50,
    backgroundColor:'rgba(0,0,0,0.8)'

},
item:{
   
  padding:10,
   backgroundColor: '#fff',
   borderRadius: 10,

 },
 item2:{
   margin:10,
   padding:10,
   backgroundColor: '#fff',
   borderRadius: 10,

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
  margin: 15,
},
item:{
  margin:10,
  borderRadius: 10,
},
view_5:{        
        
  flexDirection: 'row',       
  justifyContent: 'center',
  textAlign: 'center',
  alignItems:'center',
  marginHorizontal:5,
  backgroundColor:"#E5E7E9",
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