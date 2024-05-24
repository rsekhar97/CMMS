import React from "react";
import {  View,StyleSheet, Text, Pressable,TouchableOpacity,FlatList,BackHandler,Image,Alert} from 'react-native';
import { Button,SearchBar } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressLoader from 'rn-progress-loader';
import { Appbar } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from "axios";
import { openDatabase } from 'react-native-sqlite-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

var db = openDatabase({ name: 'CMMS.db' });

const MRPendingIssue = ({navigation,route}) => {

    const [search, setSearch] = React.useState('');
    const[spinner, setspinner]= React.useState(false);
    const [StockMasterList,setStockMasterList] = React.useState([]);
    const [filteredDataSource, setFilteredDataSource] = React.useState([]);
    const [title, settitle] = React.useState('');


    const _goBack = () => {

        if(route.params.Screenname === 'InventoryDashboard'){
          navigation.navigate('InventoryDashboard')
        }
        
    }

    const backAction = () => {
        Alert.alert("Alert", "Do you want to exit MR Pending Issue?", [
          {
            text: "No",
            onPress: () => null,
           
          },
          { text: "YES", onPress: () => _goBack() }
        ]);
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

        BaseUrl = await AsyncStorage.getItem('BaseURL');
        Site_cd = await AsyncStorage.getItem('Site_Cd');
        LoginID = await AsyncStorage.getItem('emp_mst_login_id');
        EmpName = await AsyncStorage.getItem('emp_mst_name');
        EmpID = await AsyncStorage.getItem('emp_mst_empl_id');
        EmpPhone = await AsyncStorage.getItem('emp_mst_homephone');
        EmpWorkGrp = await AsyncStorage.getItem('emp_det_work_grp'); 

        

        if(route.params.type === 'MR_Pending'){

            get_MR_Pending();

            settitle('MR Pending For Issue')
        }else if(route.params.type === 'MY_Pending'){

            get_MY_Pending();

             settitle('My MR Pending For Issue')
        }
       


    };

     // STEP : 1 GET Stock Master LIST API
    const get_MR_Pending =(async ()=>{

        
    setspinner(true); 

    try{
      console.log("MR-Stock_No JSON DATA " + `${BaseUrl}/get_material_requestno.php?site_cd=${Site_cd}&mtr_mst_requester=&requester=''&Emp_ID=${EmpID}`)

      const response = await axios.get(`${BaseUrl}/get_material_requestno.php?site_cd=${Site_cd}&mtr_mst_requester=&requester=''&Emp_ID=${EmpID}`);
     // console.log("JSON DATA DASHBOARD 2 : " + response.data.data)
      if (response.data.status === 'SUCCESS') {

        
        setStockMasterList(response.data.data);
        setFilteredDataSource(response.data.data);
       
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


    // STEP : 1 GET Stock Master LIST API
    const get_MY_Pending =(async ()=>{

        
        setspinner(true); 
    
        try{
          console.log("MR-Stock_No JSON DATA " + `${BaseUrl}/get_material_requestno.php?site_cd=${Site_cd}&mtr_mst_requester=${EmpID}&requester=ME&Emp_ID=${EmpID}`)
    
          const response = await axios.get(`${BaseUrl}/get_material_requestno.php?site_cd=${Site_cd}&mtr_mst_requester=${EmpID}&requester=ME&Emp_ID=${EmpID}`);
         // console.log("JSON DATA DASHBOARD 2 : " + response.data.data)
          if (response.data.status === 'SUCCESS') {
    
            
           
            setStockMasterList(response.data.data);
            setFilteredDataSource(response.data.data);
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


    const searchFilterFunction = (text) => {
        // Check if searched text is not blank
        if (text) {
            // Inserted text is not blank
            // Filter the masterDataSource
            // Update FilteredDataSource
            const newData = StockMasterList.filter(function (item) {
            //const itemData = item.ast_mst_asset_no ? item.ast_mst_asset_no.toUpperCase() : ''.toUpperCase();
                //const itemData = item.ast_mst_asset_no.toUpperCase(),;
                const itemData = `${item.mtr_mst_mtr_no.toUpperCase()}
                ,${item.mtr_mst_wo_no.toUpperCase()}
                )`
            
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
            });
            setFilteredDataSource(newData);
            setSearch(text);
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            setFilteredDataSource(StockMasterList);
            setSearch(text);
        }
    };
    
    const ItemView = ({ item }) => {

    let orgdate,duedate;

    let Org_Date = moment(item.mtr_mst_org_date.date).format('yyyy-MM-DD HH:mm');
      //console.log(Org_Date)
      if (Org_Date === '1900-01-01 00:00') {
        orgdate = '';
      } else {
        orgdate = moment(Org_Date).format('DD-MM-YYYY');
      }

      let Due_Date = moment(item.mtr_mst_req_date.date).format('yyyy-MM-DD HH:mm');
      //console.log(Org_Date)
      if (Due_Date === '1900-01-01 00:00') {
        duedate = '';
      } else {
        duedate = moment(Due_Date).format('DD-MM-YYYY');
      }
    

    return (

      <TouchableOpacity onPress={() => getItem(item)} > 
          <View style={[styles.item]}>
            <View style={{ flex: 1,flexDirection: 'row'}}>
              
              <View style={{ flex: 1,margin:10 }}>
                <View style={{ flexDirection: 'row', marginTop:5 }}>
                  <MaterialCommunityIcons
                    name="alpha-m-circle-outline"
                    color={'#05375a'}
                    size={20}/>
                    <Text style={{flex: 1,color: '#05375a', fontSize: 12, marginLeft:10 }}>{item.mtr_mst_mtr_no }</Text>
                 
                </View>

               

                <View style={{ flexDirection: 'row',marginTop:5 }}>
                  <MaterialCommunityIcons
                    name="archive-cog-outline"
                    color={'#05375a'}
                    size={20}/>
                  <Text style={{ flex: 1,color: '#05375a', fontSize: 12, marginLeft:10 }}>{'Cost center '+item.mtr_mst_costcenter}</Text>
                </View>

                <View style={{ flexDirection: 'row',marginTop:5 }}>
                  <MaterialCommunityIcons
                    name="account-tie-outline"
                    color={'#05375a'}
                    size={20}/>
                  <Text style={{ flex: 1,color: '#05375a', fontSize: 12, marginLeft:10 }}>{item.Requester_Name}</Text>
                </View>

                <View style={{flex: 1,flexDirection: 'row', marginTop:5, }}>
                  <View style={{ flex: 1,flexDirection: 'row', }}>
                    <View style={{flex: 1,flexDirection: 'row',alignItems: 'center', }}>
                      <MaterialCommunityIcons
                        name="calendar-check"
                        color={'#05375a'}
                        size={20}/>

                      <Text style={{flex: 1,color: '#05375a', fontSize: 12, marginLeft:10 }}>{'Origination Date '+orgdate}</Text>   
                    </View>
                    <View style={{flex: 1,flexDirection: 'row',alignItems: 'center', }}>
                      <MaterialCommunityIcons
                        name="calendar-check"
                        color={'#05375a'}
                        size={20}/>

                      <Text style={{flex: 1,color: '#05375a', fontSize: 12, marginLeft:10 }}>{'Required Date '+duedate}</Text>
                        
                    </View>
                  </View>
                </View>

                 
            </View>
        </View>
        </View>
      </TouchableOpacity>
    

        // <TouchableOpacity onPress={() => getItem(item)}>
        // <View style={styles.item}>

        //     <View style={{flex:1,justifyContent:'space-between',flexDirection:'row'}}>
        //     <Text style={{color:'#2962FF',fontSize: 13,backgroundColor:'#D6EAF8',padding:10, fontWeight: 'bold',borderRadius:10,fontSize:12}} > {item.mtr_mst_mtr_no}</Text>
        //     <Text style={{fontSize: 16,color:'#8BC34A',fontWeight: 'bold',fontSize:12}} ></Text>
        //     </View>

        //     <View style={{flexDirection:"row",marginTop:10}}>
        //         <View style={{width:'40%'}}>
        //             <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12}} >Cost Center :</Text>
        //         </View>
        //         <View style={{flex:1}}>
        //             <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000',fontSize:12}} >{item.mtr_mst_costcenter}</Text>
        //         </View>
        //     </View>

        //     <View style={{flexDirection:"row",marginTop:2}}>
        //         <View style={{width:'40%'}}>
        //             <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12}} >Name :</Text>
        //         </View>
        //         <View style={{flex:1}}>
        //             <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000',fontSize:12}} >{item.Requester_Name}</Text>
        //         </View>

        //     </View>

        //     <View style={{flexDirection:"row",marginTop:2}}>
        //         <View style={{width:'40%'}}>
        //             <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12}} >Requester ID :</Text>
        //         </View>
        //         <View style={{flex:1}}>
        //             <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000',fontSize:12}} >{item.mtr_mst_requester}</Text>
        //         </View>
        //     </View>

            

        //     <View style={{flexDirection:"row",marginTop:2,justifyContent:'space-between',}}>

        //         <View style={{flexDirection:"row"}}>

        //         <View>
        //             <Text placeholder="Test" style={{color:'#FF5733',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12,}} >Origination Date : </Text>
        //         </View>
        //         <View>
        //             <Text placeholder="Test" style={{justifyContent: 'flex-start',fontWeight: 'bold',color:'#FF5733',fontSize:12,}} >{orgdate}</Text>
        //         </View>

        //         </View>
                

        //         <View style={{flexDirection:"row"}}>

        //         <View>
        //             <Text placeholder="Test" style={{color:'#FF5733',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12}} >Required Date : </Text>
        //         </View>
        //         <View>
        //             <Text placeholder="Test" style={{justifyContent: 'flex-start',fontWeight: 'bold',color:'#FF5733',fontSize:12}} >{duedate}</Text>
        //         </View>

        //         </View>

                
        //     </View>
            
            
        // </View>
        // </TouchableOpacity>   

        
    );
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
    //alert('Id : ' + item.itm_mst_stockno );
    navigation.navigate('MRPendingIssueDetails',{
        Screenname:route.params.Screenname,
        Screentype:route.params.type,
        Selected_mtr_mst_mtr_no:item.mtr_mst_mtr_no,
        Selected_mtr_mst_costcenter:item.mtr_mst_costcenter,
        Selected_mtr_mst_assetno:item.mtr_mst_assetno,
        Selected_RowID:item.RowID,
        Selected_mtr_mst_wo_no:item.mtr_mst_wo_no,
        Selected_mtr_mst_account:item.mtr_mst_account,
        Selected_type:route.params.type,
        Selected_mtr_mst_mr_status:item.mtr_mst_mr_status,
        Selected_mtr_mst_requester:item.mtr_mst_requester +':' + item.Requester_Name
    })
    
    
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
                style={{marginLeft:12,marginBottom:5}}
                
            />  

            <Text style={{fontSize:20, justifyContent:'center',textAlign:'center',color:'#fff',fontWeight: 'bold',marginLeft:15}}>{title}</Text> 

            </View >

        </Pressable>


        </View>
  </Appbar.Header>

    <View style={styles.container}>

        <ProgressLoader
            visible={spinner}
            isModal={true} 
            isHUD={true}
            hudColor={"#808080"}
            color={"#FFFFFF"} />

            <SearchBar
                lightTheme
                round
                inputStyle={{color:'#000'}}
                inputContainerStyle={{backgroundColor:'#fff'}}
                searchIcon={{ size: 24 }}
                onChangeText={(text) => searchFilterFunction(text)}
                onClear={(text) => searchFilterFunction('')}
                placeholder="Search here..."
                value={search}
            />

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

export default MRPendingIssue

const styles = StyleSheet.create({

    container: {
      flex: 1 ,
         
    },
  
    
    view_2:{        
        
        flexDirection: 'row',       
        alignItems: 'stretch',
        justifyContent:'space-between',
        backgroundColor:"#FFFF",
        margin:5
    },

    view_3:{        
        
        flexDirection: 'row',       
        alignItems: 'stretch',
        justifyContent: 'center',
        backgroundColor:"#FFFF",
        paddingTop:10,
        paddingBottom:10
    },
    
    view_4:{        
        
      flexDirection: 'row',
      alignItems: 'stretch',
      backgroundColor:"#FFFF"  ,
      paddingTop:5
     
    },

    item:{
   
        backgroundColor: '#fff',
        margin:10,
        padding: 10,
        borderRadius: 10,
        
    
    },
    
  
});
  