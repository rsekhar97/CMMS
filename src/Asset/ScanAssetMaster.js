import React from "react";
import { View, StyleSheet, Text, Pressable, ScrollView,TouchableOpacity, FlatList, BackHandler, Alert,Dimensions,Modal,SafeAreaView } from 'react-native';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressLoader from 'rn-progress-loader';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appbar } from 'react-native-paper';
import { openDatabase } from 'react-native-sqlite-storage';
import axios from "axios";
import DeviceInfo from 'react-native-device-info'
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';

var db = openDatabase({ name: 'CMMS.db' });
let Baseurl,Site_cd,LoginID,EmpName,EmpID,EmpPhone,EmpWorkGrp,dvc_id;

const ScanAssetMaster = ({route,navigation}) => {

    const _goBack = () => {

        navigation.navigate('MainTabScreen')

        return true;

    }

    const[spinner, setspinner]= React.useState(false)
    const[Toolbartext, setToolbartext]= React.useState("") 

    const[AssetNo, setAssetNo]= React.useState('');
    const[AssetStatus, setAssetStatus]= React.useState('');
    const[CostCenter, setCostCenter]= React.useState('');
    const[WorkArea, setWorkArea]= React.useState('');
    const[AssetLocation, setAssetLocation]= React.useState('');
    const[Level, setLevel]= React.useState('');
    const[ShortDesc, setShortDesc]= React.useState('');

    const [RowID,setRowID] = React.useState("");

    const [PRM_List, setPRM_List] = React.useState([]);
    //Alert
    const [Show, setShow] = React.useState(false);
    const [Show_two, setShow_two] = React.useState(false);
    const [Theme, setTheme] = React.useState('');
    const [Title, setTitle] = React.useState('');


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

        setspinner(true);

        dvc_id = DeviceInfo.getDeviceId();

        Baseurl = await AsyncStorage.getItem('BaseURL');
        Site_cd = await AsyncStorage.getItem('Site_Cd');
        LoginID = await AsyncStorage.getItem('emp_mst_login_id');
        EmpName = await AsyncStorage.getItem('emp_mst_name');
        EmpID = await AsyncStorage.getItem('emp_mst_empl_id');
        EmpPhone = await AsyncStorage.getItem('emp_mst_homephone');
        EmpWorkGrp = await AsyncStorage.getItem('emp_det_work_grp'); 

        setToolbartext('Scan Asset Master');

        console.log(route.params.ScanAssetno);

        get_asset_no()
    };


    //GET ASSET NO API
    const get_asset_no =(async()=>{

        setspinner(true)
    
        let userStr = {site_cd:Site_cd,
            ast_mst_asset_no:route.params.ScanAssetno,
            asset_shortdesc:"",
            cost_center:"",
            asset_status:"",
            asset_type:"",
            asset_grpcode:"",
            work_area:"",
            asset_locn:"",
            asset_code:"",
            ast_lvl:"",
            ast_sts_typ_cd:"",
            createby:"",
            from_date:"",
            to_date:"",
            emp_det_work_grp:'',
            emp_id:'',
            type:'ScanAsset'};
    
        console.log('GET ASSET INFO :'+JSON.stringify(userStr));

        try{

            const response = await axios.post(`${Baseurl}/get_assetmaster.php?`,JSON.stringify(userStr));
            //console.log("JSON DATA : " + response.data.status)
  
           
            if (response.data.status === 'SUCCESS') 
            {
             
                if(response.data.data.length >0){
  
                    for(let value of Object.values(response.data.data)){
                        // console.log(value.ast_mst_asset_no);
            
                        setRowID(value.RowID)
                        setAssetNo(value.ast_mst_asset_no);
                        setShortDesc(value.ast_mst_asset_shortdesc);
                        setWorkArea(value.mst_war_work_area);
                        setAssetLocation(value.ast_mst_asset_locn);
                        setLevel(value.ast_mst_asset_lvl);
                        setCostCenter(value.ast_mst_cost_center);

                        //console.log(value.ast_mst_asset_status.split(':'));
                        if(value.ast_mst_asset_status == ''){

                        }else{
                           let  asset_status =value.ast_mst_asset_status.split(':');
                           let spllit =asset_status[0]
                           setAssetStatus(value.ast_mst_asset_status);
                        }
                    }
                   
                    get_dropdown_Assign_Employee();
                }else{

                  setspinner(false);
                  setAlert_two(true,'info',response.data.message)
                 
                }
    
            
            }else{
                setspinner(false);
                setAlert(true,'danger',response.data.message);
                return
            }
  
        }catch(error){

            setspinner(false);
            alert(error);
        } 
    
  
    
    
    });

    const get_dropdown_Assign_Employee = async () => {

       
        try {
        console.log( 'get_dropdown : ' + `${Baseurl}/get_prm_list.php?site_cd=${Site_cd}&prm_mst_assetno=${route.params.ScanAssetno}`, );
        const Dropdown = await fetch( `${Baseurl}/get_prm_list.php?site_cd=${Site_cd}&prm_mst_assetno=${route.params.ScanAssetno}`, );
        const responseJson = await Dropdown.json();

        if (responseJson.status === 'SUCCESS') {
            //console.log(responseJson.data.Assign_Employee);

            if (responseJson.data.length > 0) {
            
            // setAssignTo(responseJson.data.Assign_Employee);
            setspinner(false);
            
            setPRM_List(responseJson.data);
            
            
            } else {
            setspinner(false);
                //Alert.alert( 'Success', responseJson.message, [ { text: 'OK' } ], { cancelable: false } )
            
            }
        } else {
            setspinner(false);
            Alert.alert( 'Error', responseJson.message, [ { text: 'OK' } ], { cancelable: false } )
           
        }
        }catch (error) {
        setspinner(false);
        Alert.alert( 'Error', error.message, [ { text: 'OK' } ], { cancelable: false } )
        }

     };

    const get_ScanAsset =()=>{

        navigation.navigate('CreateAssetScreen',{ Screenname:route.params.Screenname,ScanAssetno:route.params.ScanAssetno,ScanAssetRowID:RowID})  
    }

    const get_ScanAsset_WOR =()=>{

       navigation.navigate('CreateWorkOrder',{ Screenname:route.params.Screenname,ScanAssetno:route.params.ScanAssetno,ScanAssetRowID:RowID,ScanAssetType:'New'})  
    }

    const get_ScanAsset_WRK =()=>{

        navigation.navigate('CreateWorkRequest',{ Screenname:route.params.Screenname,ScanAssetno:route.params.ScanAssetno,ScanAssetRowID:RowID})  

    }


    const setAlert =(show,theme,title)=>{

        setShow(show);
        setTheme(theme);
        setTitle(title);
    
    }

    const setAlert_two =(show,theme,title)=>{
    
        setShow_two(show);
        setTheme(theme);
        setTitle(title);
       
      
    }


    const Alret_onClick =(D) =>{

        setShow_two(false)
    
        _goBack()
    
    }


    const ItemView = ({item}) => {
   
        let orgdate, duedate;

        let Org_Date = moment(item.prm_mst_lpm_date.date).format( 'yyyy-MM-DD', );
        //console.log(Org_Date)
        if (Org_Date === '1900-01-01 00:00') {
            orgdate = '';
        } else {
            orgdate = moment(Org_Date).format('DD-MM-YYYY');
        }

        let Due_Date = moment(item.prm_mst_next_due.date).format( 'yyyy-MM-DD');
        //console.log(Org_Date)
        if (Due_Date === '1900-01-01 00:00') {
            duedate = '';
        } else {
            duedate = moment(Due_Date).format('DD-MM-YYYY');
        }

    

    return (
      
        <View style={styles.item}>

            <View style={{ flex: 1, justifyContent: 'space-between'}}>
            

                <View style={{flexDirection: 'row', marginTop: 10}}>
                    <View style={{width: '40%'}}>
                        <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start'}}>Frequency Code :</Text>
                    </View>
                    <View style={{flex: 1}}>
                        <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.prm_fcd_desc}</Text>
                    </View>
                </View>

                <View style={{flexDirection: 'row', marginTop: 5}}>
                    <View style={{width: '40%'}}>
                        <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start'}}>Description :</Text>
                    </View>
                    <View style={{flex: 1}}>
                        <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.prm_mst_desc.trim()}</Text>
                    </View>
                </View>
                
                <View style={{flexDirection: 'row', marginTop: 5}}>
                    <View style={{width: '40%'}}>
                        <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start'}}>LPM Date :</Text>
                    </View>
                    <View style={{flex: 1}}>
                        <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{orgdate}</Text>
                    </View>
                </View>

                <View style={{flexDirection: 'row', marginTop: 5}}>
                    <View style={{width: '40%'}}>
                        <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start'}}>Next Due Date :</Text>
                    </View>
                    <View style={{flex: 1}}>
                        <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{duedate}</Text>
                    </View>
                </View>
            </View>
        </View>
        
    )
  };

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View style={{ height: 1, width: '100%', backgroundColor: '#C8C8C8', }} />
    );
  };
    



   return (
    <SafeAreaProvider >

        <Appbar.Header style={{backgroundColor:"#42A5F5"}}>

        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', }}>
          <Pressable onPress={_goBack}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <FontAwesome name="angle-left" color="#fff" size={55} style={{marginLeft: 15, marginBottom: 5}} />
              <Text style={{ fontSize: 20, justifyContent: 'center', textAlign: 'center', color: '#fff', fontWeight: 'bold', marginLeft: 15, }}> {Toolbartext} </Text>
            </View>
          </Pressable>

          
        </View>
            
        </Appbar.Header>

        <ProgressLoader
            visible={spinner}
            isModal={true} 
            isHUD={true}
            hudColor={"#808080"}
            color={"#FFFFFF"} 
        />


        <SCLAlert 
            theme={Theme} 
            show={Show} 
            title={Title}>

                <SCLAlertButton theme={Theme}  onPress={()=>setShow(false)}>OK</SCLAlertButton>
        </SCLAlert>

         <SCLAlert

            theme={Theme} 
            show={Show_two} 
            title={Title} >

            <SCLAlertButton theme={Theme}  onPress={()=>Alret_onClick()}>OK</SCLAlertButton>

           

        </SCLAlert>

        <View style={styles.container}>
            <ScrollView>

                <View style={styles.card}>

                    <TouchableOpacity onPress={() => get_ScanAsset()}>

                        <View style={styles.item}>

                        <View style={{justifyContent:'space-between',flexDirection:'row',alignItems:'center'}}>
                            <View style={{backgroundColor:'#D6EAF8',borderRadius:10}}>
                            <Text style={{color:'#2962FF',fontSize: 13,padding:8, fontWeight: 'bold',}} > {AssetNo}</Text>
                            </View>
                            <Text style={{fontSize: 13,color:'#000',marginRight:10}} >{AssetStatus}</Text>
                            
                        </View>

                        
                        <View style={{flexDirection:"row",marginTop:5}}>
                            <View style={{flex:1}}>
                                <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Cost Center :</Text>
                            </View>
                            <View style={{flex:1.5}}>
                                <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{CostCenter}</Text>
                            </View>
                        </View>

                        <View style={{flexDirection:"row",marginTop:5}}>
                            <View style={{flex:1}}>
                                <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Work Area :</Text>
                            </View>
                            <View style={{flex:1.5}}>
                                <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{WorkArea}</Text>
                            </View>
                        </View>

                        <View style={{flexDirection:"row",marginTop:5}}>
                            <View style={{flex:1}}>
                                <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Asset Location :</Text>
                            </View>
                            <View style={{flex:1.5}}>
                                <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{AssetLocation}</Text>
                            </View>
                        </View>

                        <View style={{flexDirection:"row",marginTop:5}}>
                            <View style={{flex:1}}>
                                <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Level :</Text>
                            </View>
                            <View style={{flex:1.5}}>
                                <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{Level}</Text>
                            </View>
                        </View>

                        <View style={{flexDirection:"row",marginTop:5}}>
                            <View style={{flex:1}}>
                                <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Short Description :</Text>
                            </View>
                            <View style={{flex:1.5}}>
                                <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{ShortDesc}</Text>
                            </View>
                        </View>



                        </View>
                    </TouchableOpacity> 


                </View> 

                <View>
                    <FlatList
                        data={PRM_List}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        ItemSeparatorComponent={ItemSeparatorView}
                        renderItem={ItemView}
                    />

                </View> 
                

                <TouchableOpacity style={{ margin:10,}} onPress={() => get_ScanAsset_WOR()}>
                    <View style={styles.card_view_two}>

                        <AntDesign name={'form'} color="#05375a" size={25}/>   
                                            
                        <Text style={{fontSize:15,color:'black'}}>{'Create Work Order'}</Text>

                        <AntDesign name={'caretright'} color="#05375a" size={25}/>    
                    </View>  
                </TouchableOpacity>


                <TouchableOpacity style={{ margin:10,}} onPress={() => get_ScanAsset_WRK()}>
                    <View style={styles.card_view_two}>

                        <AntDesign name={'form'} color="#05375a" size={25}/>   
                                            
                        <Text style={{fontSize:15,color:'black'}}>{'Create Work Request'}</Text>

                        <AntDesign name={'caretright'} color="#05375a" size={25}/>    
                    </View>  
                </TouchableOpacity>
            
            </ScrollView>
        </View>
        
    
        
    </SafeAreaProvider>  

    );


};

const { width } = Dimensions.get('window');

const IMAGE_WIDTH = (width - 50)/2;

const styles = StyleSheet.create({

    container: {
      flex: 1,
      
    },
    card: {
        backgroundColor: '#FFFFFF',
        margin:10,
        borderRadius: 10,      
    },

  
      item:{
   
        backgroundColor: '#fff',
        margin:10,
        padding: 10,
        borderRadius: 10,
        
    
    },

    card_view_two: {
          
        height:50,
        width:'100%',
        flexDirection:'row',
        borderRadius: 10,
        margin:10,
        backgroundColor: '#ffffffff',
        justifyContent:'space-evenly',
        alignSelf:'center',
        alignItems: 'center', //Centered vertically
        
    },

    

  });

export default ScanAssetMaster