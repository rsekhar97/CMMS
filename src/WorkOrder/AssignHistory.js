import React from "react";
import {  View,StyleSheet, Text, TouchableOpacity,FlatList } from 'react-native';
import { Button,SearchBar } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressLoader from 'rn-progress-loader';
import { Appbar } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import moment from 'moment';
import axios from "axios";
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'CMMS.db' });

let Baseurl,Site_cd,LoginID,EmpName,EmpID,EmpPhone,EmpWorkGrp,WIFI;


const AssignHistory = ({navigation,route}) => {

    const _goBack = () => {

        if(route.params.Screenname == "FilteringWorkOrder"){   
    
            navigation.navigate('CreateWorkOrder',{Screenname:route.params.Screenname
                ,Selected_WorkOrder_no :route.params.Selected_WorkOrder_no
                ,Assetno_value:route.params.Assetno_value
                ,Assetno:route.params.Assetno
                ,AssetDescription:route.params.AssetDescription
                ,Employee_Key:route.params.Employee_Key
                ,CostCenter_Key:route.params.CostCenter_Key
                ,AssetStatus_Key:route.params.AssetStatus_Key
                ,AssetType_Key:route.params.AssetType_Key
                ,AssetGroupCode_Key:route.params.AssetGroupCode_Key
                ,Asset_Key:route.params.Asset_Key
                ,WorkArea_Key:route.params.WorkArea_Key
                ,AssetLocation_Key:route.params.AssetLocation_Key
                ,AssetLevel_Key:route.params.AssetLevel_Key
            })
     
    
        }else if(route.params.Screenname == "MyWorkOrder"){
    
            navigation.navigate('CreateWorkOrder',{
                Screenname:route.params.Screenname
                ,Selected_WorkOrder_no :route.params.Selected_WorkOrder_no
                
            })
    
        }
        
    }


    const[spinner, setspinner]= React.useState(true)
    const[AssignHistory,setAssignHistory] = React.useState([]);



    React.useEffect(() => {

        const focusHander = navigation.addListener('focus', ()=>{
  
  
          fetchData();
  
        });
        return focusHander;
  
      
      },[navigation]);  

      const fetchData = async ()=>{

        Baseurl = await AsyncStorage.getItem('BaseURL');
        Site_cd = await AsyncStorage.getItem('Site_Cd');
        LoginID = await AsyncStorage.getItem('emp_mst_login_id');
        EmpName = await AsyncStorage.getItem('emp_mst_name');
        EmpID = await AsyncStorage.getItem('emp_mst_empl_id');
        EmpPhone = await AsyncStorage.getItem('emp_mst_homephone');
        EmpWorkGrp = await AsyncStorage.getItem('emp_det_work_grp'); 
  
        WIFI = await AsyncStorage.getItem('WIFI');
        console.log("WORK DATA:  "+ WIFI);
  
        if(WIFI === 'OFFLINE'){
  
           
  
        }else{
  
            get_assign_history();  
  
        }
  
       
       
      };

      const get_assign_history =(async ()=>{

        //setspinner(true);

        try{

            console.log("JSON DATA : " + `${Baseurl}/get_assign_history.php?site_cd=${(Site_cd)}&mst_RowID=${route.params.mst_RowID}`)
            const response = await axios.get(`${Baseurl}/get_assign_history.php?site_cd=${(Site_cd)}&mst_RowID=${route.params.mst_RowID}`);

             console.log("JSON DATA : " + response.data)
  
            if (response.data.status === 'SUCCESS') 
            {
                setAssignHistory(response.data.data)
                
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

        var orgdate,duedate,Assignment_Date,Re_Assignment_Date;

        if(item.wko_ls7_wo_org_date == null){
            orgdate = ''
        }else{
             orgdate = moment(item.wko_ls7_wo_org_date.date).format('yyyy-MM-DD HH:mm')
        }

        if(item.wko_ls7_due_date == null){
            duedate=''
        }else{
             duedate = moment(item.wko_ls7_due_date.date).format('yyyy-MM-DD HH:mm')
        }

        if(item.audit_date == null){
            Assignment_Date=''
        }else{
             Assignment_Date = moment(item.audit_date.date).format('yyyy-MM-DD HH:mm')
        }

        if(item.wko_ls7_date3 == null){
            Re_Assignment_Date=''
        }else{
             Re_Assignment_Date = moment(item.wko_ls7_date3.date).format('yyyy-MM-DD HH:mm')
        }
       
        
       
        
        
       
  
        return (
        
  
          <TouchableOpacity >
            <View style={styles.item}>

                <View style={{flexDirection:"row",marginTop:10}}>
                <View style={{flex:1}}>
                    <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Employee :</Text>
                </View>
                <View style={{flex:1.5}}>
                    <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{item.wko_ls7_emp_id}</Text>
                </View>
                </View>

                

                <View style={{flexDirection:"row",marginTop:5}}>
                <View style={{flex:1}}>
                    <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Start Date :</Text>
                </View>
                <View style={{flex:1.5}}>
                    <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{orgdate}</Text>
                </View>
                </View>

                <View style={{flexDirection:"row",marginTop:5}}>
                <View style={{flex:1}}>
                    <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Due Date :</Text>
                </View>
                <View style={{flex:1.5}}>
                    <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{duedate}</Text>
                </View>
                </View>

                <View style={{flexDirection:"row",marginTop:5}}>
                <View style={{flex:1}}>
                    <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Assignment Date :</Text>
                </View>
                <View style={{flex:1.5}}>
                    <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{Assignment_Date}</Text>
                </View>
                </View>

                <View style={{flexDirection:"row",marginTop:5}}>
                <View style={{flex:1}}>
                    <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Re-Assignment Date :</Text>
                </View>
                <View style={{flex:1.5}}>
                    <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{Re_Assignment_Date}</Text>
                </View>
                </View>

                <View style={{flexDirection:"row",marginTop:5}}>
                <View style={{flex:1}}>
                    <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Remark :</Text>
                </View>
                <View style={{flex:1.5}}>
                    <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{item.column1}</Text>
                </View>
                </View>

                
                
                
            </View>
          </TouchableOpacity>   
  
          
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
    
    



  return (
    <SafeAreaProvider>

        <Appbar.Header style={{backgroundColor:"#42A5F5"}}>

            <Appbar.BackAction onPress={_goBack} color={'#FFF'} size={30}/>
            
            <Appbar.Content title="Assign History"  color={'#FFF'} />
        
        </Appbar.Header>

        <View style={styles.container}>

        <ProgressLoader
            visible={spinner}
            isModal={true} 
            isHUD={true}
            hudColor={"#808080"}
            color={"#FFFFFF"} />


            <FlatList
                data={AssignHistory}
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

export default AssignHistory;

const styles = StyleSheet.create({

    container: {
      flex: 1 ,
         
    },
    item:{
   
        backgroundColor: '#fff',
        margin:10,
        padding: 10,
        borderRadius: 10,
        
    
    },
    
  
  });
  