import React,{Fragment}from "react";
import {  View,StyleSheet, Text, Image, TouchableOpacity,FlatList, Dimensions,Modal,SafeAreaView,Pressable } from 'react-native';
import { Button,SearchBar } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressLoader from 'rn-progress-loader';
import { Appbar } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import moment from 'moment';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from "axios";
import { openDatabase } from 'react-native-sqlite-storage';
import Swiper from 'react-native-swiper'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {ImageBackground} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
var db = openDatabase({ name: 'CMMS.db' });

let BaseUrl,Site_cd,LoginID,EmpName,EmpID,EmpPhone,EmpWorkGrp;

const deviceWidth = Dimensions.get('screen').width;
const deviceHeight = Dimensions.get('screen').height;

const PRApproval = ({navigation,route}) => {

  const _goBack = () => {

    if(route.params.Screenname === 'PRApproval'){
      navigation.navigate('MainTabScreen')
    }
    
  }
    const[spinner, setspinner]= React.useState(true)
    const [Toolbartext, setToolbartext]= React.useState("Purchase Request Approval") 

    const[colorcode1, setcolorcode1]= React.useState("#0096FF")
    const[colorcode2, setcolorcode2]= React.useState("#FFF")
    const[colorcode3, setcolorcode3]= React.useState("#FFF")
    

   
    const [search, setSearch] = React.useState('');
    const [MyLevel,setMyLevel] = React.useState("0");
    const [MyLimit,setMyLimit] = React.useState("0");
    const [AnyLevel,setAnyLevel] = React.useState("0");


    const[colorcode4, setcolorcode4]= React.useState("#FFF")
    const[status, setstatus]= React.useState("")

    const [MRList,setMRList] = React.useState([])
    const [filteredDataSource, setFilteredDataSource] = React.useState([]);
    

 
    const[emp_det_pr_approval_limit, setemp_det_pr_approval_limit]= React.useState("")
    const[dft_mst_pur_closed_loop, setdft_mst_pur_closed_loop]= React.useState("")
    const[dft_mst_pur_approval_type, setdft_mst_pur_approval_type]= React.useState("")

    //QR CODE
    const [showqrcode, setshowqrcode] = React.useState(false);
    const [scan, setscan] = React.useState(false);
    const [ScanResult, setScanResult] = React.useState(false);
    const [result, setresult] = React.useState(null);
   
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
    EmpWorkGrp = await AsyncStorage.getItem('emp_det_work_grp'); 

    get_mr_approval_dropdown();   
   
  }; 


  const get_mr_approval_dropdown =(async ()=>{

    setspinner(true);

  
    var dft_mst_pur_approval_type,emp_det_pr_approver,emp_det_pr_approval_limit,dft_mst_pur_closed_loop;

    try{
              

      console.log("JSON DATA : " + `${BaseUrl}/get_mr_approval_dropdown.php?site_cd=${Site_cd}&LOGINID=${LoginID}`)

      const response = await axios.get(`${BaseUrl}/get_mr_approval_dropdown.php?site_cd=${Site_cd}&LOGINID=${LoginID}`);

      //console.log(JSON.stringify(response))

      if (response.data.status === 'SUCCESS') 
      {
         
       
        for (let i = 0; i < response.data.data.length; ++i){

          dft_mst_pur_closed_loop = response.data.data[i].dft_mst_pur_closed_loop
          setdft_mst_pur_closed_loop(response.data.data[i].dft_mst_pur_closed_loop)

          if(response.data.data[i].dft_mst_pur_closed_loop == '0'){

            

          }else{
            
          }


          if(response.data.data[i].dft_mst_pur_approval == 'R'){

            dft_mst_pur_approval_type = 'my_level';
            setdft_mst_pur_approval_type(dft_mst_pur_approval_type)

              // setcolorcode1("#0096FF")
              // setcolorcode2("#FFF")
              // setcolorcode3("#FFF")

            if(response.data.data[i].dft_mst_pur_closed_loop == '0'){
              
              setcolorcode1("#0096FF")
              setcolorcode2("#FFF")
              setcolorcode3("#FFF")
            

            }else{

              setcolorcode1("#0096FF")
              setcolorcode2("#FFF")
              setcolorcode3("#FFF")
              
            }

          }else{
            dft_mst_pur_approval_type = 'my_limit';
            setdft_mst_pur_approval_type(dft_mst_pur_approval_type)

              
            // setcolorcode1("#FFF")
            //   setcolorcode2("#0096FF")
            //   setcolorcode3("#FFF")

            if(response.data.data[i].dft_mst_pur_closed_loop == '0'){

              setcolorcode1("#FFF")
              setcolorcode2("#0096FF")
              setcolorcode3("#FFF")

            }else{
              
              setcolorcode1("#FFF")
              setcolorcode2("#0096FF")
              setcolorcode3("#FFF")
            }

          }

        }


        for (let i = 0; i < response.data.data1.length; ++i){

          emp_det_pr_approver = response.data.data1[i].emp_det_pr_approver
          emp_det_pr_approval_limit = response.data.data1[i].emp_det_pr_approval_limit

          setemp_det_pr_approval_limit(response.data.data1[i].emp_det_pr_approval_limit);
        }
    
        //setspinner(false);
        get_pr_approval_list(dft_mst_pur_approval_type,emp_det_pr_approval_limit,dft_mst_pur_closed_loop)
      }else{
          setspinner(false);
          alert(response.data.message);
          return
      }

    }catch(error){

      setspinner(false);
      alert(error);
    } 

   

    

  })

  const get_pr_approval_list =(async (dft_mst_pur_approval_type,emp_det_pr_approval_limit,dft_mst_pur_closed_loop)=>{

    console.log("dft_mst_mtr_approval_type: "+dft_mst_pur_approval_type)
    console.log("emp_det_mr_limit: "+emp_det_pr_approval_limit)
    console.log("dft_mst_mtr_closed_loop: "+dft_mst_pur_closed_loop)
    

  
  //   var dft_mst_mtr_approval_type,emp_det_mr_approver,emp_det_mr_limit ;

    try{
              

      console.log("JSON DATA : " + `${BaseUrl}/get_pr_approval_list.php?site_cd=${Site_cd}&type=${dft_mst_pur_approval_type}&EmpID=${EmpID}&pr_approval_limit=${emp_det_pr_approval_limit}&loop=${dft_mst_pur_closed_loop}`)

      const response = await axios.get(`${BaseUrl}/get_pr_approval_list.php?site_cd=${Site_cd}&type=${dft_mst_pur_approval_type}&EmpID=${EmpID}&pr_approval_limit=${emp_det_pr_approval_limit}&loop=${dft_mst_pur_closed_loop}`);

     // console.log(JSON.stringify(response))

      if (response.data.status === 'SUCCESS') 
      {


        for (let i = 0; i < response.data.count.length; ++i){

          if(response.data.count[i].Label == 'MyLevel'){

             setMyLevel(response.data.count[i].MyLevelCount)

          }else if(response.data.count[i].Label == 'MyLimit'){

            setMyLimit(response.data.count[i].MyLevelCount)

          }else if(response.data.count[i].Label == 'AnyLabel'){

            setAnyLevel(response.data.count[i].MyLevelCount)  
          }

        }
                 
        setMRList(response.data.data)
        setFilteredDataSource(response.data.data)
    
        setspinner(false);
      
      }else{
          setspinner(false);
          alert(response.data.message);
          return
      }

    }catch(error){

        setspinner(false);
        alert(error);
    } 

   

    

  })

  const ItemView = ({ item }) => {

    let rngdate,reqdate;

    let Rqn_Date = moment(item.pur_mst_rqn_date.date).format('yyyy-MM-DD HH:mm');
    //console.log(Org_Date)
    if (Rqn_Date === '1900-01-01 00:00') {
      rngdate = '';
    } else {
      rngdate = moment(Rqn_Date).format('DD-MM-YYYY');
    }

    let Req_Date = moment(item.pur_mst_req_date.date).format('yyyy-MM-DD HH:mm');
    //console.log(Org_Date)
    if (Req_Date === '1900-01-01 00:00') {
      reqdate = '';
    } else {
      reqdate = moment(Req_Date).format('DD-MM-YYYY');
    }
  
    
   
    return (

      <TouchableOpacity onPress={() => getItem(item)}>
        <View style={styles.item}>
          <View style={{ flexDirection: 'row', marginTop:5 }}>
            <MaterialCommunityIcons
              name="alpha-p-circle-outline"
              color={'#05375a'}
              size={20}/>

            <Text style={{flex: 1,color: '#05375a', fontSize: 12, marginLeft:10 }}>{item.pur_mst_porqnnum}</Text>

            <Text style={{color: '#05375a', fontSize: 12, }}>{item.pur_mst_status}</Text>
          </View>

          <View style={{ alignItems: 'center',flexDirection: 'row', marginTop:5 }}>
            <MaterialCommunityIcons
              name="account-tie-outline"
              color={'#05375a'}
              size={20}/>

            <Text style={{flex: 1,color: '#05375a', fontSize: 12, marginLeft:10 }}>{item.pur_mst_requested_by}</Text>
          </View>

          <View style={{ alignItems: 'center',flexDirection: 'row', marginTop:5 }}>
            <MaterialCommunityIcons
              name="calendar-account-outline"
              color={'#05375a'}
              size={20}/>

            <Text style={{flex: 1,color: '#05375a', fontSize: 12, marginLeft:10 }}>{'Required Date '+rngdate}</Text>
          </View>

          <View style={{ alignItems: 'center',flexDirection: 'row', marginTop:5 }}>
            <MaterialCommunityIcons
              name="calendar-check"
              color={'#05375a'}
              size={20}/>

            <Text style={{flex: 1,color: '#05375a', fontSize: 12, marginLeft:10 }}>{'Request Date '+reqdate}</Text>
          </View>


          <View style={{ alignItems: 'center',flexDirection: 'row', marginTop:5 }}>
            <MaterialCommunityIcons
              name="office-building-cog-outline"
              color={'#05375a'}
              size={20}/>

            <Text style={{flex: 1,color: '#05375a', fontSize: 12, marginLeft:10 }}>{'Cost Center '+item.pur_mst_chg_costcenter}</Text>
          </View>

          <View style={{ alignItems: 'center',flexDirection: 'row', marginTop:5 }}>
            <MaterialCommunityIcons
                name="file-alert-outline"
              color={'#05375a'}
              size={20}/>

            <Text style={{flex: 1,color: '#05375a', fontSize: 12, marginLeft:10 }}>{'Approval Status '+item.pur_mst_purq_approve}</Text>
          </View>

          <View style={{ alignItems: 'center',flexDirection: 'row', marginTop:5 }}>
            <MaterialCommunityIcons
              name="currency-usd"
              color={'#05375a'}
              size={20}/>

            <Text style={{flex: 1,color: '#05375a', fontSize: 12, marginLeft:10 }}>{'Total Cost '+item.pur_mst_tot_cost}</Text>
          </View>
        </View>
      </TouchableOpacity>
    

      // <TouchableOpacity onPress={() => getItem(item)}>
      //   <View style={styles.item}>

      //     <View style={{flex:1,justifyContent:'space-between',flexDirection:'row'}}>
      //       <Text style={{color:'#2962FF',fontSize: 13,backgroundColor:'#D6EAF8',padding:5, fontWeight: 'bold'}} > {item.pur_mst_porqnnum}</Text>
      //       <Text style={{fontSize: 13,color:'#000'}} >{item.pur_mst_status}</Text>
      //     </View>

          

      //     <View style={{flexDirection:"row",marginTop:10}}>
      //       <View style={{width:'40%'}}>
      //           <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Required By :</Text>
      //       </View>
      //       <View style={{flex:1}}>
      //           <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{item.pur_mst_requested_by}</Text>
      //       </View>
      //     </View>


      //     <View style={{flexDirection:"row",marginTop:10}}>
      //       <View style={{width:'40%'}}>
      //           <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Required Date :</Text>
      //       </View>
      //       <View style={{flex:1}}>
      //           <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{rngdate}</Text>
      //       </View>
      //     </View>


      //     <View style={{flexDirection:"row",marginTop:10}}>
      //       <View style={{width:'40%'}}>
      //           <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Request Date :</Text>
      //       </View>
      //       <View style={{flex:1}}>
      //           <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{reqdate}</Text>
      //       </View>
      //     </View>


      //     <View style={{flexDirection:"row",marginTop:5}}>
      //       <View style={{width:'40%'}}>
      //           <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Cost Center :</Text>
      //       </View>
      //       <View style={{flex:1}}>
      //           <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{item.pur_mst_chg_costcenter}</Text>
      //       </View>
      //     </View>


      //     <View style={{flexDirection:"row",marginTop:5}}>
      //       <View style={{width:'40%'}}>
      //           <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Approval Status :</Text>
      //       </View>
      //       <View style={{flex:1}}>
      //           <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{item.pur_mst_purq_approve}</Text>
      //       </View>
      //     </View>


      //     <View style={{flexDirection:"row",marginTop:5}}>
      //       <View style={{width:'40%'}}>
      //           <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Total Cost :</Text>
      //       </View>
      //       <View style={{flex:1}}>
      //           <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{item.pur_mst_tot_cost}</Text>
      //       </View>
      //     </View>

      //   </View>
      // </TouchableOpacity>   

      
    );
  };

  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = MRList.filter(function (item) {
        //const itemData = item.ast_mst_asset_no ? item.ast_mst_asset_no.toUpperCase() : ''.toUpperCase();
          //const itemData = item.ast_mst_asset_no.toUpperCase(),;
          const itemData = `${item.pur_mst_porqnnum.toUpperCase()}`
      
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(MRList);
      setSearch(text);
    }
  };

  const ItemSeparatorView = () => {
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

  const getItem = (item) => {
    // Function for click on an item
     //alert('Id : ' + item.RowID );

     //console.log("SELECY "+item.RowID)
     var aduitdate = moment(item.audit_date.date).format('yyyy-MM-DD HH:mm:ss')

    navigation.navigate('PRApprovalDetails',{

      Screenname:route.params.Screenname,

      RowID:item.RowID,
      Closed_loop:dft_mst_pur_closed_loop,
      Approval_type:dft_mst_pur_approval_type,
      pr_limit:emp_det_pr_approval_limit,

      pr_no:item.pur_mst_porqnnum,
      Pur_mst_status:item.pur_mst_status,
      Pur_mst_requested_by:item.pur_mst_requested_by,
      Pur_mst_req_date:item.pur_mst_req_date.date,
      Pur_mst_entered_by:item.pur_mst_entered_by,
      Pur_mst_chg_costcenter:item.pur_mst_chg_costcenter,

      Pur_mst_crd_account:item.pur_mst_crd_account,
      Pur_mst_purq_approve:item.pur_mst_purq_approve,
      Approval_Status:item.Approval_Status,
      app_level:item.pur_mst_app_level,
      cur_app_level:item.pur_mst_cur_app_level,
      Audit_date:aduitdate,
      tot_cost:item.pur_mst_tot_cost,
      

      });
    
    
    

    
  };


  const Button_select_list =async (selected_value)=>{

    //setspinner(true)

    console.log(selected_value);   
    console.log("emp_det_pr_approval_limit: "+emp_det_pr_approval_limit)
    console.log("dft_mst_pur_closed_loop: "+dft_mst_pur_closed_loop)
   
    if(selected_value == "MyLevel"){

      setcolorcode1("#0096FF")
      setcolorcode2("#FFF")
      setcolorcode3("#FFF")
      setcolorcode4("#F4D03F")
      setFilteredDataSource('')
      setdft_mst_pur_approval_type('my_level')
      get_pr_approval_list('my_level',emp_det_pr_approval_limit,dft_mst_pur_closed_loop)
     
    }else if(selected_value == "MyLimit"){

      setcolorcode1("#FFF")
      setcolorcode2("#0096FF")
      setcolorcode3("#FFF")
      setcolorcode4("#8BC34A")
      setFilteredDataSource('')
      setdft_mst_pur_approval_type('my_limit')
      get_pr_approval_list('my_limit',emp_det_pr_approval_limit,dft_mst_pur_closed_loop)
    

    }else if(selected_value == "AnyLevel"){

      setcolorcode1("#FFF")
      setcolorcode2("#FFF")
      setcolorcode3("#0096FF")
      setcolorcode4("#FF0000")
      setFilteredDataSource('')
      setdft_mst_pur_approval_type('all_level')
      get_pr_approval_list('all_level',emp_det_pr_approval_limit,dft_mst_pur_closed_loop)
     


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
      const newData = MRList.filter(function (item) {
        //const itemData = item.ast_mst_asset_no ? item.ast_mst_asset_no.toUpperCase() : ''.toUpperCase();
          //const itemData = item.ast_mst_asset_no.toUpperCase(),;
          const itemData = `${item.pur_mst_porqnnum.toUpperCase()}`
      
        const textData =  e.data.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(e.data);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(MRList);
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
              <FontAwesome name="angle-left" color='#fff' size={55} style={{marginLeft:15,marginBottom:5}} />  
              <Text style={{fontSize:20, justifyContent:'center',textAlign:'center',color:'#fff',fontWeight: 'bold',marginLeft:15}}>{Toolbartext}</Text> 
            </View >
          </Pressable>
        </View>
      </Appbar.Header>

    <View style={styles.container}>

      <ProgressLoader visible={spinner} isModal={true} isHUD={true} hudColor={"#808080"} color={"#FFFFFF"} />

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
                      {/* <TouchableOpacity style={styles.buttonScan2} 
                                            onPress={() => this.scanner.reactivate()} 
                                            onLongPress={() => this.setState({ scan: false })}>
                                            <Image source={require('../../images/camera.png')}></Image>
                                        </TouchableOpacity> */}

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
            title="MyLevel"
            titleStyle={{ color: "white", fontSize: 16, fontWeight: 'bold', }}
            onPress={() =>Button_select_list("MyLevel")}
            buttonStyle={{ backgroundColor: '#F4D03F', borderRadius: 3}}
            containerStyle={{ flex: 1, marginHorizontal: 5}}
          /> 

        <Button
          title="MyLimit"
          titleStyle={{ color: "white", fontSize: 16, fontWeight: 'bold'}}
          onPress={() =>Button_select_list("MyLimit")}
          buttonStyle={{ backgroundColor: '#8BC34A', borderRadius: 3}}
          containerStyle={{ flex: 1, marginHorizontal: 5}}
        />  
    
        <Button
            title="AnyLevel"
            titleStyle={{ color: "white", fontSize: 16, fontWeight: 'bold'}}
            onPress={() =>Button_select_list("AnyLevel")}
            buttonStyle={{ backgroundColor: '#FF0000', borderRadius: 3}}
            containerStyle={{ flex: 1, marginHorizontal: 5}}
          /> 

      </View> 

      <View style={styles.view_4}> 
          <View style={{flex:1,backgroundColor:colorcode1,height:2,marginHorizontal:5} }></View>
          <View style={{flex:1,backgroundColor:colorcode2,height:2,marginHorizontal:5}}></View>
          <View style={{flex:1,backgroundColor:colorcode3,height:2,marginHorizontal:5}}></View>
      </View>

      <View style={styles.view_3}> 
          <Text style={{color:'#F4D03F', fontSize: 15,fontWeight: "bold",flex: 1,textAlign: 'center',alignItems:'center',justifyContent:'center'}}>{MyLevel}</Text>
          <Text style={{color:'#8BC34A', fontSize: 15,fontWeight: "bold",flex: 1,textAlign: 'center',alignItems:'center',justifyContent:'center'}}>{MyLimit}</Text>
          <Text style={{color:'#FF0000', fontSize: 15,fontWeight: "bold",flex: 1,textAlign: 'center',alignItems:'center',justifyContent:'center'}}>{AnyLevel}</Text>
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
          showsVerticalScrollIndicator ={false}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={ItemSeparatorView}
          renderItem={ItemView}
        />
      </View>    

        </SafeAreaProvider>
  )
}

export default PRApproval


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