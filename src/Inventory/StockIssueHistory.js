
import React from 'react'
import {  View,StyleSheet, Text, Pressable,TouchableOpacity,FlatList,BackHandler,Image,Alert} from 'react-native';
import { Button,SearchBar } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressLoader from 'rn-progress-loader';
import { Appbar } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import moment from 'moment';
import {TextInput} from 'react-native-element-textinput';
import DateTimePicker from 'react-native-modal-datetime-picker';
import axios from "axios";
import { openDatabase } from 'react-native-sqlite-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
var db = openDatabase({ name: 'CMMS.db' });
import {SCLAlert, SCLAlertButton} from 'react-native-scl-alert';
let BaseUrl,Site_cd,LoginID,EmpName,EmpID,EmpPhone,EmpWorkGrp;

const StockIssueHistory = ({navigation,route}) => {

    const _goBack = () => {


        if(route.params.Screenname === 'StockIssue'){
            navigation.navigate('StockIssue',{ Screenname:route.params.Screenname })
        }else if(route.params.Screenname === 'StockReceive'){
            navigation.navigate('StockReceive',{ Screenname:route.params.Screenname })
        }else if(route.params.Screenname === 'StockReturn'){
            navigation.navigate('StockReturn',{ Screenname:route.params.Screenname })
        }

       
        
    }

    const [spinner, setspinner] = React.useState(false);
    const [Toolbartext, setToolbartext] = React.useState('');
    const [Totaltext, setTotaltext] = React.useState('');

   

    const [isDatepickerVisible, setDatePickerVisibility] = React.useState(false);
    const [FromDate, setFromDate] = React.useState('');
    const [ToDate, setToDate] = React.useState('');

    const [Total, setTotal] = React.useState('0');

    const [StockIssueList,setStockIssueList] = React.useState([])
    const [filteredDataSource, setFilteredDataSource] = React.useState([]);


    //Alert
    const [Show, setShow] = React.useState(false);
    const [Theme, setTheme] = React.useState('');
    const [Title, setTitle] = React.useState('');
    const [Type, setType] = React.useState('0');


  const [Editable, setEditable] = React.useState(false); 

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

      console.log('Screenname',route.params.Screenname)

      if(route.params.Screenname === 'StockIssue'){
        setToolbartext('Stock Issue History')
        setTotaltext('Stock Issue Total: ')
      }else if(route.params.Screenname === 'StockReceive'){
        setToolbartext('Stock Receive History')
        setTotaltext('Stock Receive Total: ')
      }else if(route.params.Screenname === 'StockReturn'){
        setToolbartext('Stock Return History')
        setTotaltext('Stock Return Total: ')
      }
 

      var from_date = moment(new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)).format('YYYY-MM-DD');

      var to_date = moment().format('YYYY-MM-DD');
      setFromDate(from_date);
      setToDate(to_date);

      

    };

     //BUTTON EDIT 
     const get_button =()=>{

        var type;
        if(route.params.Screenname === 'StockIssue'){
            type ='MT21'
        }else if(route.params.Screenname === 'StockReceive'){
            type ='MT41'
        }else if(route.params.Screenname === 'StockReturn'){
            type ='MT51'
        }
        get_stockissue_list(type);
    };


    // STEP : 1 GET Stock Master LIST API
    const get_stockissue_list =(async (type)=>{

        
        setspinner(true); 
  
        try{
          console.log("MR-Stock_No JSON DATA " + `${BaseUrl}/get_history.php?site_cd=${Site_cd}&type=${type}&from_date=${FromDate}&to_date=${ToDate}`)
  
          const response = await axios.get(`${BaseUrl}/get_history.php?site_cd=${Site_cd}&type=${type}&from_date=${FromDate}&to_date=${ToDate}`);
         // console.log("JSON DATA DASHBOARD 2 : " + response.data.data)
          if (response.data.status === 'SUCCESS') {

            if (response.data.data.length > 0) {

                //console.log(response.data.data) 
                setStockIssueList(response.data.data);
                setFilteredDataSource(response.data.data);
                setTotal(response.data.data.length)
                setspinner(false);
              

            }
  
            
           
  
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

        let rcv_qty,isu_qty,rtn_qty,cost;

        if(item.itm_trx_rcv_qty == '.0000'){
            rcv_qty = '0'
        }else{
            rcv_qty = item.itm_trx_rcv_qty
        }

        if(item.itm_trx_isu_qty == '.0000'){
            isu_qty = '0'
        }else{
            isu_qty = item.itm_trx_isu_qty
        }

        if(item.itm_trx_rtn_qty == '.0000'){
            rtn_qty = '0'
        }else{
            rtn_qty = item.itm_trx_rtn_qty
        }

        if(item.itm_trx_item_cost == '.0000'){
            cost = '0'
        }else{
            cost = item.itm_trx_item_cost
        }
        
         
        let val_rcv_qty = parseFloat(rcv_qty).toFixed(2);
        let val_isu_qty = parseFloat(isu_qty).toFixed(2);
        let val_rtn_qty = parseFloat(rtn_qty).toFixed(2);
        let val_cost = parseFloat(cost).toFixed(2);

        let  date = moment(item.itm_trx_trx_date.date).format('DD-MM-yyyy');
       
  
        return (
        
  
         
            <View style={styles.item}>

                <View style={{flex:1,justifyContent:'space-between',flexDirection:'row'}}>
                <Text style={{color:'#2962FF',fontSize: 13,backgroundColor:'#D6EAF8',padding:10, fontWeight: 'bold',borderRadius:10,fontSize:12}} > {item.itm_trx_stockno}</Text>
                <Text style={{fontSize: 16,color:'#8BC34A',fontWeight: 'bold',fontSize:12}} >Date: {date}</Text>
                </View>

                <View style={{flexDirection:"row",marginTop:10}}>
                  <View style={{width:'40%'}}>
                      <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12}} >Cost Center:</Text>
                  </View>
                  <View style={{flex:1}}>
                      <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000',fontSize:12}} >{item.itm_trx_chg_costcenter}</Text>
                  </View>
                </View>

                <View style={{flexDirection:"row",marginTop:2}}>
                <View style={{width:'40%'}}>
                    <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12}} >Employee Name:</Text>
                </View>
                <View style={{flex:1}}>
                    <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000',fontSize:12}} >{item.emp_mst_name}</Text>
                </View>

                </View>

                <View style={{flexDirection:"row",marginTop:2}}>
                <View style={{width:'40%'}}>
                    <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12}} >Document:</Text>
                </View>
                <View style={{flex:1}}>
                    <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000',fontSize:12}} >{item.itm_trx_doc_no}</Text>
                </View>
                </View>

                <View style={{flexDirection:"row",marginTop:2}}>
                  <View style={{width:'40%'}}>
                      <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12}} >Description:</Text>
                  </View>
                  <View style={{flex:1}}>
                      <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000',fontSize:12}} >{item.itm_trx_desc}</Text>
                  </View>
                </View>

                <View style={{flexDirection:"row",marginTop:2}}>
                  <View style={{width:'40%'}}>
                      <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12}} >Remark:</Text>
                  </View>
                  <View style={{flex:1}}>
                      <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000',fontSize:12}} >{item.itm_trx_remark}</Text>
                  </View>
                </View>

                <View style={{flex:1,flexDirection:"row",marginTop:2,justifyContent:'space-around'}}>

                    <View style={{flex:1,flexDirection:"row"}}>

                        <View>
                            <Text placeholder="Test" style={{color:'#FF5733',fontWeight: 'bold',fontSize:12,}} >Receive Qty: </Text>
                        </View>
                        <View>
                            <Text placeholder="Test" style={{fontWeight: 'bold',color:'#FF5733',fontSize:12,}} >{val_rcv_qty}</Text>
                        </View>

                    </View>
                  

                    <View style={{flexDirection:"row"}}>

                        <View>
                            <Text placeholder="Test" style={{color:'#FF5733',fontWeight: 'bold',fontSize:12}} >Issue Qty: </Text>
                        </View>
                        <View>
                            <Text placeholder="Test" style={{fontWeight: 'bold',color:'#FF5733',fontSize:12}} >{val_isu_qty}</Text>
                        </View>

                    </View>

                </View>

                <View style={{flex:1,flexDirection:"row",marginTop:2,justifyContent:'space-around'}}>

                    <View style={{flex:1,flexDirection:"row",}}>

                        <View >
                            <Text placeholder="Test" style={{color:'#FF5733',fontWeight: 'bold',fontSize:12}} >Return Qty: </Text>
                        </View>
                        <View >
                            <Text placeholder="Test" style={{fontWeight: 'bold',color:'#FF5733',fontSize:12}} >{val_rtn_qty}</Text>
                        </View>
                    </View>

                    <View style={{flexDirection:"row",}}>

                        <View >
                            <Text placeholder="Test" style={{color:'#FF5733',fontWeight: 'bold',fontSize:12}} >Item Cost: </Text>
                        </View>
                        <View >
                            <Text placeholder="Test" style={{fontWeight: 'bold',color:'#FF5733',fontSize:12}} >{val_cost}</Text>
                        </View>
                    </View>

                  
                </View>
                
                
            </View>
         
  
          
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

    //Select Dates
    const showDatePicker = type => {
        // console.warn(type)

        setDatePickerVisibility(true);
        setType(type);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = date => {
        if (Type === 'from') {

            let select_from = moment(date).format('yyyy-MM-DD');
            setFromDate(select_OrgDate);
        } else if (Type === 'to') {

            let select_to = moment(date).format('yyyy-MM-DD');
            setToDate(select_to);
        } 
        hideDatePicker();
    };

    const setAlert = (show, theme, title, type) => {

        setShow(show);
        setTheme(theme);
        setTitle(title);
        setType(type);
    };

    const One_Alret_onClick = D => {
        console.log('DD',D)

        if (D === 'OK') {
            setShow(false);
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
                            style={{marginLeft:12,marginBottom:5}}
                        
                        />  

                        <Text style={{fontSize:20, justifyContent:'center',textAlign:'center',color:'#fff',fontWeight: 'bold',marginLeft:15}}>{Toolbartext}</Text>
                    </View>
                </Pressable>
            </View>
      </Appbar.Header>

        <View style={styles.container}>

            <ProgressLoader visible={spinner} isModal={true} isHUD={true} hudColor={"#808080"} color={"#FFFFFF"} />

            <SCLAlert theme={Theme} show={Show} title={Title}>
                <SCLAlertButton theme={Theme} onPress={() => One_Alret_onClick(AlertType)}> OK </SCLAlertButton>
            </SCLAlert>

            <DateTimePicker
                isVisible={isDatepickerVisible}
                mode="date"
                locale="en_GB"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />


            <View style={{flexDirection: 'column'}}> 
                <View style={{ backgroundColor:'#FFFFFF',paddingTop:10 }}>

                    <View style={{flexDirection: 'row', justifyContent: 'space-around',backgroundColor:'#FFFFFF' }}>

                        {/* From Date */}
                        <View style={styles.view_style}>
                            <Pressable onPress={() => !Editable ? showDatePicker('from') : '' } >
                                <View pointerEvents={'none'}>
                                <TextInput
                                    value={FromDate}
                                    style={[ styles.input, { height: Platform.OS === 'ios' ? 50 : 50}]}
                                    inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}]}
                                    labelStyle={styles.labelStyle}
                                    placeholderStyle={{ fontSize: 15, color: '#0096FF', }}
                                    label="From Date"
                                    editable={false}
                                    selectTextOnFocus={false}
                                    renderRightIcon={() => (
                                    <AntDesign
                                        style={styles.icon}
                                        color={'black'}
                                        name={'calendar'}
                                        size={20}
                                    />
                                    )}
                                />
                                </View>
                            </Pressable>
                        </View>

                        {/* To Date */}
                        <View style={styles.view_style}>
                            <Pressable
                                onPress={() => !Editable ? showDatePicker('to') : '' }>
                                <View pointerEvents={'none'}>
                                <TextInput
                                    value={ToDate}
                                    style={[ styles.input, { height: Platform.OS === 'ios' ? 50 : 50}]}
                                    inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}]}
                                    labelStyle={styles.labelStyle}
                                    placeholderStyle={{ fontSize: 15, color: '#0096FF', }}
                                    label="To Date"
                                    editable={false}
                                    selectTextOnFocus={false}
                                    renderRightIcon={() => (
                                    <AntDesign
                                        style={styles.icon}
                                        color={'black'}
                                        name={'calendar'}
                                        size={20}
                                    />
                                    )}
                                />
                                </View>
                            </Pressable>
                        </View>

                            
                            
                    </View>

                    <View style={{ height:50,margin:20 }}>
                        <TouchableOpacity style={{ flex: 1,height:50,backgroundColor:'#8BC34A', alignItems:'center',justifyContent:'center'}}  
                            onPress={get_button}>
                            <Text style={{color:'white', fontSize: 15,fontWeight: 'bold'}}>RETRIEVE</Text>
                        </TouchableOpacity>
                    </View>

                </View>

               

                <View style={{justifyContent:'center',backgroundColor:'#0096FF',alignItems:'center',height:50,}}>
                    <Text style={{fontSize:15,color:'#ffffffff',margin:5,alignItems:'center'}}>{Totaltext} {Total}</Text>                      
                </View>


            </View> 

            <FlatList
                data={StockIssueList}
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

export default StockIssueHistory

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
    view_style: {
        flex: 1 ,
        marginTop: 12,
        marginLeft: 10,
        marginRight: 10,
        
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
    placeholderStyle: {fontSize: 15},

    placeholderStyle_text: {fontSize: 15},
    textErrorStyle: {fontSize: 16},

    item:{
        padding:12,
        backgroundColor: '#fff',
        borderRadius: 10,
        margin:10
    },
  
  });