import React,{Fragment}from "react";
import {  View,StyleSheet, Text, Image, TouchableOpacity,FlatList, Pressable,BackHandler ,Dimensions,Modal,SafeAreaView} from 'react-native';
import { Button,SearchBar } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressLoader from 'rn-progress-loader';
import { Appbar } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import moment from 'moment';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from "axios";
import { openDatabase } from 'react-native-sqlite-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {ImageBackground} from 'react-native';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
var db = openDatabase({ name: 'CMMS.db' });

let BaseUrl,Site_cd,LoginID,EmpName,EmpID,EmpPhone,EmpWorkGrp;

const deviceWidth = Dimensions.get('screen').width;
const deviceHeight = Dimensions.get('screen').height;

const WorkRequestApprovalListing =({navigation,route})=>{

   

    const _goBack = () => {

        if(route.params.Screenname === 'WRApprovalAll'){
          navigation.navigate('MainTabScreen')
        }else if(route.params.Screenname === 'WRApprovalMy'){
          navigation.navigate('MainTabScreen')
        }
        
        return true;
    }

    const[spinner, setspinner]= React.useState(true)

    const[colorcode1, setcolorcode1]= React.useState("#0096FF")
    const[colorcode2, setcolorcode2]= React.useState("#FFF")
    const[colorcode3, setcolorcode3]= React.useState("#FFF")
    
    const [search, setSearch] = React.useState('');
    const [Open,setOpen] = React.useState("0");
    const [Complete,setComplete] = React.useState("0");
    const [Close,setClose] = React.useState("0");

    const[colorcode4, setcolorcode4]= React.useState("#FFF")
    const[status, setstatus]= React.useState("")

    const [WorkOrderList,setWorkOrderList] = React.useState([])
    const [filteredDataSource, setFilteredDataSource] = React.useState([]);

    //Alert
    const [Show, setShow] = React.useState(false);
    const [Theme, setTheme] = React.useState('');
    const [Title, setTitle] = React.useState('');

    //QR CODE
    const [showqrcode, setshowqrcode] = React.useState(false);
    const [scan, setscan] = React.useState(false);
    const [ScanResult, setScanResult] = React.useState(false);
    const [result, setresult] = React.useState(null);


    React.useEffect(() => {
      BackHandler.addEventListener("hardwareBackPress", _goBack);
      
      return () =>
          BackHandler.removeEventListener("hardwareBackPress", _goBack);
    }, []);

    React.useEffect(() => {

      const focusHander = navigation.addListener('focus', ()=>{


        fetchData();

      });
      return focusHander;

    
    },[navigation]);  

  const fetchData = async ()=>{

    BaseUrl = await AsyncStorage.getItem('BaseURL');
    Site_cd = await AsyncStorage.getItem('Site_Cd');
    LoginID = await AsyncStorage.getItem('emp_mst_login_id');
    EmpName = await AsyncStorage.getItem('emp_mst_name');
    EmpID = await AsyncStorage.getItem('emp_mst_empl_id');
    EmpPhone = await AsyncStorage.getItem('emp_mst_homephone');
    EmpWorkGrp = (await AsyncStorage.getItem('emp_det_work_grp'));

    setSearch('')
    setcolorcode1("#0096FF")
    setcolorcode2("#FFF")
    setcolorcode3("#FFF")
    setcolorcode4("#8BC34A")

    get_workorder_listing();   
       
   
  };
 

    const get_workorder_listing =(async ()=>{

      setspinner(true);  
  
      if(route.params.Screenname === 'WRApprovalAll'){

          try{
                

            console.log("JSON DATA : " + `${BaseUrl}/get_workrequest_approvallist.php?site_cd=${Site_cd}&wkr_mst_wr_no=${''}&wkr_mst_assetno=${''}&wkr_mst_originator=${''}&wkr_mst_work_area=${''}&wko_mst_asset_location=${''}&wko_mst_asset_level=${''}&wkr_mst_org_date=${''}&wkr_mst_due_date=${''}&wkr_mst_wr_status=${'waiting'}&wkr_mst_wr_descs=${''}&wkr_mst_chg_costcenter=${''}&emp_det_work_grp=${''}&emp_id=${EmpID}`)

            const response = await axios.get(`${BaseUrl}/get_workrequest_approvallist.php?site_cd=${Site_cd}&wkr_mst_wr_no=${''}&wkr_mst_assetno=${''}&wkr_mst_originator=${''}&wkr_mst_work_area=${''}&wko_mst_asset_location=${''}&wko_mst_asset_level=${''}&wkr_mst_org_date=${''}&wkr_mst_due_date=${''}&wkr_mst_wr_status=${'waiting'}&wkr_mst_wr_descs=${''}&wkr_mst_chg_costcenter=${''}&emp_det_work_grp=${''}&emp_id=${EmpID}`);

              //console.log(JSON.stringify(response));
              if (response.data.status === 'SUCCESS') 
              {
                 
                //console.log("JSON DATA : " + JSON.stringify(response.data.data.length)) 
                setOpen(response.data.waiting)
                setComplete(response.data.approve)
                setClose(response.data.disapprove)            
                setWorkOrderList(response.data.data)
                setFilteredDataSource(response.data.data)
                setspinner(false);

              
              }else{
                  setspinner(false);
                  setAlert(true,'danger',response.data.message);
                  return
              }

          }catch(error){

              setspinner(false);
              alert(error);
          }  
              
      }else if(route.params.Screenname === 'WRApprovalMy'){
        
          try{
                  

            console.log("JSON DATA : " + `${BaseUrl}/get_workrequest_approvallist.php?site_cd=${Site_cd}&wkr_mst_wr_no=${''}&wkr_mst_assetno=${''}&wkr_mst_originator=${''}&wkr_mst_work_area=${''}&wko_mst_asset_location=${''}&wko_mst_asset_level=${''}&wkr_mst_org_date=${''}&wkr_mst_due_date=${''}&wkr_mst_wr_status=${'waiting'}&wkr_mst_wr_descs=${''}&wkr_mst_chg_costcenter=${''}&emp_det_work_grp=${EmpWorkGrp}&emp_id=${EmpID}`)

            const response = await axios.get(`${BaseUrl}/get_workrequest_approvallist.php?site_cd=${Site_cd}&wkr_mst_wr_no=${''}&wkr_mst_assetno=${''}&wkr_mst_originator=${''}&wkr_mst_work_area=${''}&wko_mst_asset_location=${''}&wko_mst_asset_level=${''}&wkr_mst_org_date=${''}&wkr_mst_due_date=${''}&wkr_mst_wr_status=${'waiting'}&wkr_mst_wr_descs=${''}&wkr_mst_chg_costcenter=${''}&emp_det_work_grp=${EmpWorkGrp}&emp_id=${EmpID}`);

            //console.log(JSON.stringify(response));

          

            if (response.data.status === 'SUCCESS') 
            {
              

              console.log("JSON DATA : " + JSON.stringify(response.data.data.length))
                  
                  
              setOpen(response.data.waiting)
              setComplete(response.data.approve)
              setClose(response.data.disapprove)            
              setWorkOrderList(response.data.data)
              setFilteredDataSource(response.data.data)
              setspinner(false);

            
            }else{
                setspinner(false);
                setAlert(true,'danger',response.data.message);
                return
            }

        }catch(error){

            setspinner(false);
            alert(error);
        }  
      }

     

      

    })

    const searchFilterFunction = (text) => {
      // Check if searched text is not blank
      if (text) {
        // Inserted text is not blank
        // Filter the masterDataSource
        // Update FilteredDataSource
        const newData = WorkOrderList.filter(function (item) {
          //const itemData = item.ast_mst_asset_no ? item.ast_mst_asset_no.toUpperCase() : ''.toUpperCase();
            //const itemData = item.ast_mst_asset_no.toUpperCase(),;
            const itemData = `${item.wkr_mst_wr_no.toUpperCase()}
            ,${item.wkr_mst_work_area.toUpperCase()}
            ,${item.wkr_mst_assetlocn.toUpperCase()})`
        
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
  
    const ItemView = ({ item }) => {

      let orgdate = moment(item.wkr_mst_org_date.date).format('yyyy-MM-DD HH:mm')
      let duedate = moment(item.wkr_mst_due_date.date).format('yyyy-MM-DD HH:mm')

      var wrk_status ,wrk_color;
      if(item.wkr_mst_wr_status == 'W'){
        wrk_status ='Awaiting'
        wrk_color='#F4D03F'
      } else if(item.wkr_mst_wr_status == 'A'){
        wrk_status ='Approved'
        wrk_color='#8BC34A'
      } else if(item.wkr_mst_wr_status == 'D'){
        wrk_status ='Disapproved'
        wrk_color='#FF0000'
      }  
    
      return (

        <TouchableOpacity onPress={() => getItem(item)}>
          <View style={styles.item}>
            <View style={{ flexDirection: 'row', marginTop:5 }}>
              <MaterialCommunityIcons
                name="alpha-w-circle-outline"
                color={'#05375a'}
                size={20}/>

              <Text style={{flex: 1,color: '#05375a', fontSize: 12, marginLeft:10 }}>{item.wkr_mst_wr_no }</Text>
              <Text style={{color: wrk_color, fontSize: 12, }}>{wrk_status}</Text>
            </View>

            <View style={{ flexDirection: 'row', marginTop:5 }}>
              <MaterialCommunityIcons
                name="align-horizontal-left"
                color={'#05375a'}
                size={20}/>

              <Text style={{flex: 1,color: '#05375a', fontSize: 12, marginLeft:10 }}>{item.wkr_mst_wr_descs}</Text>
            </View>

            <View style={{ alignItems: 'center',flexDirection: 'row', marginTop:5 }}>
              <MaterialCommunityIcons
                name="account-tie-outline"
                color={'#05375a'}
                size={20}/>

              <Text style={{flex: 1,color: '#05375a', fontSize: 12, marginLeft:10 }}>{item.wkr_mst_originator}</Text>
            </View>

            <View style={{ alignItems: 'center',flexDirection: 'row', marginTop:5 }}>
              <MaterialCommunityIcons
                name="calendar-check"
                color={'#05375a'}
                size={20}/>

              <Text style={{flex: 1,color: '#05375a', fontSize: 12, marginLeft:10 }}>{orgdate}</Text>
            </View>

            <View style={{ flexDirection: 'row', marginTop:5 }}>
              <MaterialCommunityIcons
                name="barcode-scan"
                color={'#05375a'}
                size={20}/>

              <Text style={{flex: 1,color: '#05375a', fontSize: 12, marginLeft:10 }}>{item.wkr_mst_assetno +' ( '+ item.ast_mst_asset_shortdesc +' )'}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop:5 }}>
              <MaterialCommunityIcons
                name="google-maps"
                color={'#05375a'}
                size={20}/>

              <Text style={{flex: 1,color: '#05375a', fontSize: 12, marginLeft:10 }}>{item.wkr_mst_work_area}</Text>
            </View>
            <View style={{ alignItems: 'center',flexDirection: 'row', marginTop:5 }}>
              <MaterialCommunityIcons
                name="book-open-outline"
                color={'#05375a'}
                size={20}/>

              <Text style={{flex: 1,color: '#05375a', fontSize: 12, marginLeft:10 }}>{item.wkr_mst_work_group}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop:5 }}>
              <MaterialCommunityIcons
                name="calendar-arrow-left"
                color={'#05375a'}
                size={20}/>

              <Text style={{flex: 1,color: '#05375a', fontSize: 12, marginLeft:10 }}>{'Due on '+duedate}</Text>
            </View> 

            {/* <View style={{flex:1,justifyContent:'space-between',flexDirection:'row'}}>
                <View style={{backgroundColor:'#D6EAF8',padding:10,borderRadius:5}}>
                  <Text style={{color:'#2962FF',fontSize: 13,fontWeight: 'bold'}} > {item.wkr_mst_wr_no}</Text>
                </View>
                  <Text style={{fontSize: 15,color:wrk_color,marginRight:10,marginTop:5,fontWeight:'bold'}} >{wrk_status}</Text>
                </View>
            <View style={{flexDirection:"row",marginTop:10}}>
              <View style={{width:'40%'}}>
                  <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Origination Date :</Text>
              </View>
              <View style={{flex:1}}>
                  <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{orgdate}</Text>
              </View>
            </View>
            <View style={{flexDirection:"row",marginTop:5}}>
              <View style={{width:'40%'}}>
                  <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Description :</Text>
              </View>
              <View style={{flex:1}}>
                  <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{item.wkr_mst_wr_descs}</Text>
              </View>
            </View>
            <View style={{flexDirection:"row",marginTop:5}}>
              <View style={{width:'40%'}}>
                  <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Requester Name :</Text>
              </View>
              <View style={{flex:1}}>
                  <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{item.wkr_mst_originator}</Text>
              </View>
            </View>
            <View style={{flexDirection:"row",marginTop:5}}>
              <View style={{width:'40%'}}>
                  <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Asset No :</Text>
              </View>
              <View style={{flex:1}}>
                  <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{item.wkr_mst_assetno}</Text>
              </View>
            </View>
            <View style={{flexDirection:"row",marginTop:5}}>
              <View style={{width:'40%'}}>
                  <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Asset Description :</Text>
              </View>
              <View style={{flex:1}}>
                  <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{item.ast_mst_asset_shortdesc}</Text>
              </View>
            </View>
            <View style={{flexDirection:"row",marginTop:5}}>
              <View style={{width:'40%'}}>
                  <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Work Area :</Text>
              </View>
              <View style={{flex:1}}>
                  <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{item.wkr_mst_work_area}</Text>
              </View>
            </View>
            <View style={{flexDirection:"row",marginTop:5}}>
              <View style={{width:'40%'}}>
                  <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Asset Location :</Text>
              </View>
              <View style={{flex:1}}>
                  <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{item.wkr_mst_assetlocn}</Text>
              </View>
            </View>
            <View style={{flexDirection:"row",marginTop:5}}>
              <View style={{width:'40%'}}>
                  <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Asset Level :</Text>
              </View>
              <View style={{flex:1}}>
                  <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{item.wkr_mst_location}</Text>
              </View>
            </View>
            <View style={{flexDirection:"row",marginTop:5}}>
              <View style={{width:'40%'}}>
                  <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Work Group :</Text>
              </View>
              <View style={{flex:1}}>
                  <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{item.wkr_mst_work_group}</Text>
              </View>
            </View>
            <View style={{flexDirection:"row",marginTop:5}}>
              <View style={{width:'40%'}}>
                  <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Due Date :</Text>
              </View>
              <View style={{flex:1}}>
                  <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{duedate}</Text>
              </View>
            </View> */} 
          </View>
        </TouchableOpacity>   

        
      );
    };
  
    const ItemSeparatorView = () => {
      return (
        // Flat List Item Separator
        <View style={{ height: 1, width: '100%', backgroundColor: '#C8C8C8', }} />
      );
    };
  
    const getItem = (item) => {
      // Function for click on an item
      //alert('Id : ' + item.ast_mst_asset_no );

      if(route.params.Screenname === 'WRApprovalAll'){
        navigation.navigate('CreateWorkRequestApproval',{
          Selected_WorkRequest_no:item.wkr_mst_wr_no,
          RowID:item.RowID,
          Screenname:route.params.Screenname
          });
      }else if(route.params.Screenname === 'WRApprovalMy'){
        navigation.navigate('CreateWorkRequestApproval',{
          Selected_WorkRequest_no:item.wkr_mst_wr_no,
          RowID:item.RowID,
          Screenname:route.params.Screenname
          });
      }

      
    };


    const Button_select_list =async (selected_value)=>{

      setspinner(true)

      console.log(selected_value);   
      let userStr;
      if(selected_value == "waiting"){

        setcolorcode1("#0096FF")
        setcolorcode2("#FFF")
        setcolorcode3("#FFF")
        setcolorcode4("#8BC34A")
        setstatus("Waiting")

      }else if(selected_value == "approve"){

        setcolorcode1("#FFF")
        setcolorcode2("#0096FF")
        setcolorcode3("#FFF")
        setcolorcode4("#F4D03F")
        setstatus("approve")

      }else if(selected_value == "disapprove"){

        setcolorcode1("#FFF")
        setcolorcode2("#FFF")
        setcolorcode3("#0096FF")
        setcolorcode4("#FF0000")
        setstatus("disapprove")


      }


      if(route.params.Screenname === 'WRApprovalAll'){

        try{
              

            console.log(" WRA ALL JSON DATA : " + `${BaseUrl}/get_workrequest_approvallist.php?site_cd=${Site_cd}&wkr_mst_wr_no=${''}&wkr_mst_assetno=${''}&wkr_mst_originator=${''}&wkr_mst_work_area=${''}&wko_mst_asset_location=${''}&wko_mst_asset_level=${''}&wkr_mst_org_date=${''}&wkr_mst_due_date=${''}&wkr_mst_wr_status=${selected_value}&wkr_mst_wr_descs=${''}&wkr_mst_chg_costcenter=${''}&emp_det_work_grp=${''}&emp_id=${EmpID}`);
            const response = await axios.get(`${BaseUrl}/get_workrequest_approvallist.php?site_cd=${Site_cd}&wkr_mst_wr_no=${''}&wkr_mst_assetno=${''}&wkr_mst_originator=${''}&wkr_mst_work_area=${''}&wko_mst_asset_location=${''}&wko_mst_asset_level=${''}&wkr_mst_org_date=${''}&wkr_mst_due_date=${''}&wkr_mst_wr_status=${selected_value}&wkr_mst_wr_descs=${''}&wkr_mst_chg_costcenter=${''}&emp_det_work_grp=${''}&emp_id=${EmpID}`);
            //console.log(JSON.stringify(response));
            if (response.data.status === 'SUCCESS') 
            {
               

              console.log("JSON DATA : " + JSON.stringify(response.data.data.length))
                   
                   
              setOpen(response.data.waiting)
              setComplete(response.data.approve)
              setClose(response.data.disapprove)            
              setWorkOrderList(response.data.data)
              setFilteredDataSource(response.data.data)
              setspinner(false);

            
            }else{
                setspinner(false);
                setAlert(true,'danger',response.data.message);
                return
            }

        }catch(error){

            setspinner(false);
            alert(error);
        }  
            
    }else if(route.params.Screenname === 'WRApprovalMy'){
      
        try{
                

          console.log("WRA GROUP JSON DATA : " + `${BaseUrl}/get_workrequest_approvallist.php?site_cd=${Site_cd}&wkr_mst_wr_no=${''}&wkr_mst_assetno=${''}&wkr_mst_originator=${''}&wkr_mst_work_area=${''}&wko_mst_asset_location=${''}&wko_mst_asset_level=${''}&wkr_mst_org_date=${''}&wkr_mst_due_date=${''}&wkr_mst_wr_status=${selected_value}&wkr_mst_wr_descs=${''}&wkr_mst_chg_costcenter=${''}&emp_det_work_grp=${EmpWorkGrp}&emp_id=${EmpID}`)

          const response = await axios.get(`${BaseUrl}/get_workrequest_approvallist.php?site_cd=${Site_cd}&wkr_mst_wr_no=${''}&wkr_mst_assetno=${''}&wkr_mst_originator=${''}&wkr_mst_work_area=${''}&wko_mst_asset_location=${''}&wko_mst_asset_level=${''}&wkr_mst_org_date=${''}&wkr_mst_due_date=${''}&wkr_mst_wr_status=${selected_value}&wkr_mst_wr_descs=${''}&wkr_mst_chg_costcenter=${''}&emp_det_work_grp=${EmpWorkGrp}&emp_id=${EmpID}`);

          //console.log(JSON.stringify(response));

        

          if (response.data.status === 'SUCCESS') 
          {
            

            console.log("JSON DATA : " + JSON.stringify(response.data.data.length))
                
                
            setOpen(response.data.waiting)
            setComplete(response.data.approve)
            setClose(response.data.disapprove)            
            setWorkOrderList(response.data.data)
            setFilteredDataSource(response.data.data)
            setspinner(false);

          
          }else{
              setspinner(false);
              setAlert(true,'danger',response.data.message);
              return
          }

      }catch(error){

          setspinner(false);
          alert(error);
      }  
    }
        
    
    
  }

    const setAlert =(show,theme,title)=>{


      setShow(show);
      setTheme(theme);
      setTitle(title);
      
  
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
        const newData = WorkOrderList.filter(function (item) {
          //const itemData = item.ast_mst_asset_no ? item.ast_mst_asset_no.toUpperCase() : ''.toUpperCase();
            //const itemData = item.ast_mst_asset_no.toUpperCase(),;
            const itemData = `${item.wkr_mst_wr_no.toUpperCase()}
            ,${item.wkr_mst_work_area.toUpperCase()}
            ,${item.wkr_mst_assetlocn.toUpperCase()})`
        
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
  

    return(

   
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
              <Text style={{fontSize:20, justifyContent:'center',textAlign:'center',color:'#fff',fontWeight: 'bold',marginLeft:15}}> Work Request Approval</Text> 
            </View >
          </Pressable> 
        </View>
      </Appbar.Header>

    <View style={styles.container}>

      <ProgressLoader visible={spinner} isModal={true} isHUD={true} hudColor={"#808080"} color={"#FFFFFF"} />

      <SCLAlert theme={Theme} show={Show} title={Title}>
        <SCLAlertButton theme={Theme}   onPress={()=>setShow(false)}>OK</SCLAlertButton>
      </SCLAlert>

      <Modal visible={showqrcode}>
        <View style={styles.scrollViewStyle}>
          <Fragment>
            <SafeAreaView style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text></Text>
              <TouchableOpacity onPress={() => setshowqrcode(false)}>
                <AntDesign
                  name="close"
                  color="#fff"
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
                <Text numberOfLines={8} style={styles.descText}> Please move your camera {'\n'} over the QR Code </Text>
                <Image
                  source={require('../../images/qrcodescan.png')}
                  style={{margin: 20}}></Image>
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


      <View style={styles.view_2}> 

        <Button
            title="Awaiting"
            titleStyle={{ color: "white", fontSize: 16, fontWeight: 'bold', }}
            onPress={() =>Button_select_list("waiting")}
            buttonStyle={{ backgroundColor: '#F4D03F', borderRadius: 3}}
            containerStyle={{ flex: 1, marginHorizontal: 5}}
          /> 

        <Button
          title="Approved"
          titleStyle={{ color: "white", fontSize: 16, fontWeight: 'bold'}}
          onPress={() =>Button_select_list("approve")}
          buttonStyle={{ backgroundColor: '#8BC34A', borderRadius: 3}}
          containerStyle={{ flex: 1, marginHorizontal: 5}}
        />  
    
        <Button
            title="Disapproved"
            titleStyle={{ color: "white", fontSize: 16, fontWeight: 'bold'}}
            onPress={() =>Button_select_list("disapprove")}
            buttonStyle={{ backgroundColor: '#FF0000', borderRadius: 3}}
            containerStyle={{ flex: 1, marginHorizontal: 5, }}
          /> 

      </View> 

      <View style={styles.view_4}> 
          <View style={{flex:1,backgroundColor:colorcode1,height:2,marginHorizontal:5} }></View>
          <View style={{flex:1,backgroundColor:colorcode2,height:2,marginHorizontal:5}}></View>
          <View style={{flex:1,backgroundColor:colorcode3,height:2,marginHorizontal:5}}></View>
      </View>

      <View style={styles.view_3}> 
          <Text style={{color:'#F4D03F', fontSize: 15,fontWeight: "bold",flex: 1,textAlign: 'center',alignItems:'center',justifyContent:'center'}}>{Open}</Text>
          <Text style={{color:'#8BC34A', fontSize: 15,fontWeight: "bold",flex: 1,textAlign: 'center',alignItems:'center',justifyContent:'center'}}>{Complete}</Text>
          <Text style={{color:'#FF0000', fontSize: 15,fontWeight: "bold",flex: 1,textAlign: 'center',alignItems:'center',justifyContent:'center'}}>{Close}</Text>
      </View>



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
          showsVerticalScrollIndicator ={false}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={ItemSeparatorView}
          renderItem={ItemView}
        />
      </View>    

        </SafeAreaProvider>
    )


}
export default WorkRequestApprovalListing;


const styles = StyleSheet.create({

  container: {
    flex: 1 ,
       
  },
  image: {
      width: 20,
      height: 20,        
      resizeMode: 'contain',
  },
  toolbar: {

      paddingTop:25,
      paddingBottom:10,
      backgroundColor: '#0096FF',
      flexDirection:'row',
      alignItems:'center'       
  },
  toolbartext:{
      fontSize:20,
      color:'#fff'
  },
  
  view_2:{        
      
      flexDirection: 'row',       
      alignItems: 'stretch',
      justifyContent: 'center',
      backgroundColor:"#FFFF"  ,
      paddingTop:5
  },
  view_3:{        
      
      flexDirection: 'row',       
      alignItems: 'stretch',
      justifyContent: 'center',
      backgroundColor:"#FFFF"  ,
      paddingTop:5,
      paddingBottom:5
  },
  view_4:{        
      
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor:"#FFFF"  ,
    paddingTop:5
   
},
view_5:{        
        
  flexDirection: 'row',       
  justifyContent: 'center',
  textAlign: 'center',
  alignItems:'center',
  marginHorizontal:5,
  backgroundColor:"#E5E7E9",
},
item:{

    backgroundColor: '#fff',
    margin:10,
    padding: 10,
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



