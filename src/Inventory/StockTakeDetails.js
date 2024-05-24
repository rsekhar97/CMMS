import React,{Fragment}from "react";
import {  View,StyleSheet, Text, Pressable,TouchableOpacity,FlatList,BackHandler,Image,Alert,Dimensions,Modal,SafeAreaView} from 'react-native';
import { Button,SearchBar } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressLoader from 'rn-progress-loader';
import { Appbar } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TextInput} from 'react-native-element-textinput';
import axios from "axios";
import { openDatabase } from 'react-native-sqlite-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {ImageBackground} from 'react-native';
import {SCLAlert, SCLAlertButton} from 'react-native-scl-alert';
var db = openDatabase({ name: 'CMMS.db' });
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import { TextInput as RNTextInput } from 'react-native';


let BaseUrl,Site_cd,LoginID,EmpName,EmpID,EmpPhone,EmpWorkGrp,itm_rcb_book_no,itm_rcb_desc;

const deviceWidth = Dimensions.get('screen').width;
const deviceHeight = Dimensions.get('screen').height;

function StockTakeDetails({navigation,route}) {

    const _goBack = () => {

        if(route.params.Screenname === 'StockTake'){
          navigation.navigate('StockTake',{
            Screenname:route.params.Screenname,
          })
        }
        
    }

    const[spinner, setspinner]= React.useState(false)
    const [Editable, setEditable] = React.useState(false);
    const [Desc_height, setDesc_height] = React.useState(0);

    const[colorcode1, setcolorcode1]= React.useState("#0096FF")
    const[colorcode2, setcolorcode2]= React.useState("#FFF")
    const[colorcode3, setcolorcode3]= React.useState("#FFF")

    const [search, setSearch] = React.useState('');
    const [TotalItem,setTotalItem] = React.useState("0");
    const [PendingCount,setPendingCount] = React.useState("0");
    const [Completed,setCompleted] = React.useState("0");

    const [StockMasterList,setStockMasterList] = React.useState([])
    const [filteredDataSource, setFilteredDataSource] = React.useState([]);
    const [isRender,setisRender]=React.useState(false);

    //Alert
    const [Show, setShow] = React.useState(false);
    const [Theme, setTheme] = React.useState('');
    const [Title, setTitle] = React.useState('');
    const [Type, setType] = React.useState('');

    //QR CODE
    const [showqrcode, setshowqrcode] = React.useState(false);
    const [scan, setscan] = React.useState(false);
    const [ScanResult, setScanResult] = React.useState(false);
    const [result, setresult] = React.useState(null);


    const backAction = () => {
        Alert.alert("Alert", "Do you want to exit Stock Master?", [
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

        itm_rcb_book_no = route.params.Selected_itm_rcb_book_no;
        itm_rcb_desc = route.params.Selected_itm_rcb_desc;
        
        get_stockMaster_list(itm_rcb_book_no,'ALL');

    };

    //Button 
    const Button_select_list =(e)=>{

        console.log(e)

        setspinner(true); 

        

        if(e == 'Total_Item'){

            setcolorcode1('#0096FF')
            setcolorcode2('#FFF')
            setcolorcode3('#FFF')

            get_stockMaster_list(itm_rcb_book_no,'ALL');

        }else if(e == 'Pending_Count'){

            setcolorcode1('#FFF')
            setcolorcode2('#0096FF')
            setcolorcode3('#FFF')

            get_stockMaster_list(itm_rcb_book_no,'PENDING');

        }else if(e == 'Completed'){

            setcolorcode1('#FFF')
            setcolorcode2('#FFF')
            setcolorcode3('#0096FF')
        
            get_stockMaster_list(itm_rcb_book_no,'COMPLETED');

        }

    

    }


    // STEP : 1 GET Stock Master LIST API
    const get_stockMaster_list =(async (itm_rcb_book_no,type)=>{

            
        setspinner(true); 

        try{
        console.log("MR-Stock_No JSON DATA " + `${BaseUrl}/get_inventory_count_book_items_by_params.php?site_cd=${Site_cd}&itm_rcf_book_no=${itm_rcb_book_no}&counted=${type}`)

        const response = await axios.get(`${BaseUrl}/get_inventory_count_book_items_by_params.php?site_cd=${Site_cd}&itm_rcf_book_no=${itm_rcb_book_no}&counted=${type}`);
        // console.log("JSON DATA DASHBOARD 2 : " + response.data.data)
        if (response.data.status === 'SUCCESS') {

            setTotalItem(response.data.TotalCount)
            setPendingCount(response.data.PendingCount)
            setCompleted(response.data.CompletedCount)

            //console.log(response.data.data) 
            setStockMasterList(response.data.data);
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


    const searchFilterFunction = (text) => {
        // Check if searched text is not blank
        if (text) {
          // Inserted text is not blank
          // Filter the masterDataSource
          // Update FilteredDataSource
          const newData = StockMasterList.filter(function (item) {
            //const itemData = item.ast_mst_asset_no ? item.ast_mst_asset_no.toUpperCase() : ''.toUpperCase();
              //const itemData = item.ast_mst_asset_no.toUpperCase(),;
              const itemData = `${item.itm_rcf_stockno.toUpperCase()}
              ,${item.itm_mst_desc.toUpperCase()}
              ,${item.itm_rcf_stk_loc.toUpperCase()})`
          
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

    let oh_qty,status,cor,item_count;

    if(item.itm_rcf_item_count == null || !item.itm_rcf_item_count){
        status = 'PENDING'
        cor ='red'
    }else{
        cor ='#8BC34A'
        status = 'COMPLETED'
    }

    if(item.itm_rcf_oh_qty == '.0000'){
        oh_qty = '0'
    }else{
        oh_qty = item.itm_rcf_oh_qty
    }

    if(item.itm_rcf_item_count == '.0000'){
      item_count = ''
  }else{
    item_count = item.itm_rcf_oh_qty
  }

    let val_oh_qty = parseFloat(oh_qty).toFixed(2);

    let val_item_count = parseFloat(item_count).toFixed(2);
    
    

    return (
    

        
        <View style={styles.item}>

            <View style={{flex:1,justifyContent:'space-between',flexDirection:'row',alignItems: 'center',}}>
            <Text style={{color:'#2962FF',fontSize: 13,backgroundColor:'#D6EAF8',padding:10, fontWeight: 'bold',borderRadius:10}} > {item.itm_rcf_stockno}</Text>
            <Text style={{fontSize: 16,color:'#FFF',fontWeight: 'bold',fontSize:12,backgroundColor:cor,borderRadius:10,padding:10,}} >{status}</Text>
            </View>

            <View style={{flexDirection:"row",marginTop:10}}>
                <View style={{width:'40%'}}>
                    <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12}} >Part No :</Text>
                </View>
                <View style={{flex:1}}>
                    <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000',fontSize:12}} >{item.itm_mst_partno}</Text>
                </View>
            </View>

            <View style={{ height: 0.5, width: '100%', marginTop:10,backgroundColor: '#C8C8C8'}} />

            <View style={{flexDirection:"row",marginTop:10}}>
                <View style={{width:'40%'}}>
                    <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12}} >Description :</Text>
                </View>
                <View style={{flex:1}}>
                    <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000',fontSize:12}} >{item.itm_mst_desc}</Text>
                </View>

            </View>

            <View style={{flexDirection:"row",marginTop:2}}>
                <View style={{width:'40%'}}>
                    <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12}} >Extended Description :</Text>
                </View>
                <View style={{flex:1}}>
                    <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000',fontSize:12}} >{item.itm_mst_ext_desc}</Text>
                </View>
            </View>

            <View style={{ height: 0.5, width: '100%',marginTop:10, backgroundColor: '#C8C8C8'}} />

            <View style={{flexDirection:"row",marginTop:10}}>
                <View style={{width:'40%'}}>
                    <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12}} >Stock Location :</Text>
                </View>
                <View style={{flex:1}}>
                    <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000',fontSize:12}} >{item.itm_rcf_stk_loc}</Text>
                </View>
            </View>

            <View style={{flexDirection:"row",marginTop:2}}>
                <View style={{width:'40%'}}>
                    <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12}} >On Hand Qty :</Text>
                </View>
                <View style={{flex:1}}>
                    <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000',fontSize:12}} >{val_oh_qty}</Text>
                </View>
            </View>

            <View style={{flex:1,flexDirection:"row",marginTop:10,justifyContent:'space-evenly',}}>

                <View style={[styles.view_style,{flex:1,marginRight:10}]}>
                    {/* <TextInput
                        value={item.itm_rcf_item_count}
                        style={[ styles.input, { height: Platform.OS === 'ios' ? 50 : 50 }]}
                        inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}]}
                        labelStyle={styles.labelStyle}
                        placeholderStyle={{fontSize: 15, color: '#FF5733'}}
                        label="Item Count"
                        placeholderTextColor="gray"
                        clearButtonMode="always"
                        keyboardType="decimal-pad"
                        autoCorrect={false}
                        editable={!Editable}
                        selectTextOnFocus={!Editable}
                        onChangeText={text => {  changetext(item.rowid, text) }}
                        renderRightIcon={() =>
                            Editable ? (
                            ''
                        ) : (
                            <AntDesign
                            style={styles.icon}
                            name={item.itm_rcf_item_count ? 'close' : ''}
                            size={20}
                            disable={true}
                            
                            />
                        )
                        }
                    /> */}

                    <View style={{ flexDirection: 'row'}}>
                      <TouchableOpacity style={{borderColor: 'gray', borderRadius: 1, borderWidth: 1,backgroundColor:'#566573',height:50,justifyContent: 'center',padding:5}} 
                        onPress={()=>decrement(item.rowid)}>
                          <Ionicons
                              name="remove-outline"
                              color="#FDFEFE"
                              size={25}
                              
                          />
                      </TouchableOpacity>

                      <RNTextInput
                          
                        value={item.itm_rcf_item_count}
                        key={item.rowid}
                        style={{flex: 1, height:50, borderColor: 'gray', borderRadius: 1, borderWidth: 1,}}
                        keyboardType="numeric"
                        placeholder="Item Count"
                        placeholderTextColor="#0096FF"
                        textAlign="center"
                        onChangeText={(text) => {
                          if (text===''|| text.match(/^\d+(\.\d{0,2})?$/)){

                            item.itm_rcf_item_count = text
                            changetext(item.rowid, text)
                          
                          }
                        }}
                              
                      />

                      <TouchableOpacity style={{borderColor: 'gray', borderRadius: 1, borderWidth: 1,backgroundColor:'#566573',height:50,justifyContent: 'center',padding:5}} 
                        onPress={()=>increment(item.rowid)}>
                          <Ionicons
                              name="add-outline"
                              color="#FDFEFE"
                              size={25}
                              
                          />
                      </TouchableOpacity> 
                    </View>
                </View>

                <TouchableOpacity
                    style={{  flex:1, backgroundColor: '#0096FF', marginRight: 5, alignItems: 'center', justifyContent: 'center'}} 
                    onPress={()=>get_button(item.rowid)}>
                    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center'}}>
                        <AntDesign color={'#FFFF'} name={'Safety'} size={25} />
                        <Text style={{ color: 'white', fontSize: 16, marginLeft: 8, fontWeight: 'bold', }}> UPDATE </Text>
                    </View>
                </TouchableOpacity>

                

                
            </View>


            <View style={[styles.view_style,{marginTop:10}]}>
                <TextInput
                    value={item.itm_rcf_remark}
                    style={[ styles.input, { height: Math.max( Platform.OS === 'ios' ? 50 : 50, Desc_height)}]}
                    multiline
                    inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}]}
                    labelStyle={styles.labelStyle}
                    placeholderStyle={{fontSize: 15, color: '#FF5733'}}
                    onContentSizeChange={event => setDesc_height(event.nativeEvent.contentSize.height)}
                    label="Remark"
                    placeholderTextColor="gray"
                    clearButtonMode="always"
                    editable={!Editable}
                    selectTextOnFocus={!Editable}
                    onChangeText={text => { changetextremark(item.rowid, text) }}
                    renderRightIcon={() =>
                        Editable ? (
                        ''
                    ) : (
                        <AntDesign
                        style={styles.icon}
                        name={item.itm_rcf_remark ? 'close' : ''}
                        size={20}
                        disable={true}
                        
                        />
                    )
                    }
                />
            </View>

            
            
            
        </View>
      

        
    );
    };

    const ItemSeparatorView = () => {
    return (
        // Flat List Item Separator
        <View style={{ height: 0.5, width: '100%', backgroundColor: '#C8C8C8', }} />
    );
    };



   //Text
  const changetext = (id, value) => {
    console.log('Text RowID', id);
    console.log('Text Value', value);

    // var total, text_value;
    // if (!value) {
    //   text_value = null;
    // } else {
    //   text_value = value;
    // }

    StockMasterList.map(item => {
      if (item.rowid == id) {
        (item.itm_rcf_item_count = value);
        return item;
      }
      return item;
    });

    filteredDataSource.map(item => {
      if (item.rowid == id) {
        (item.itm_rcf_item_count = value);
        return item;
      }
      return item;
    });
  };

  const increment = (key) => {

    console.log('increment key :',key)

    // Increment the value by 0.01 (or any other desired step)
    //setValue((prevValue) => (parseFloat(prevValue )+ 1).toFixed(2));

    

    StockMasterList.map(item =>{

        if(item.rowid == key){

          const numberValue = Number(item.itm_rcf_item_count);

            if (item.itm_rcf_item_count > 0) {
              
              console.log('increment if :',item.itm_rcf_item_count)

               if (Number.isInteger(numberValue)) {

                  item.itm_rcf_item_count = (parseInt(item.itm_rcf_item_count)+ 1).toString();

                } else if (typeof numberValue === 'number') {

                  item.itm_rcf_item_count = (parseFloat(item.itm_rcf_item_count )+ 1).toFixed(2);

                } 

            }else{
                console.log('increment else :',item.itm_rcf_item_count)
                //item.itm_rcf_item_count = (parseFloat(0 )+ 1).toFixed(2)

                if (Number.isInteger(numberValue)) {

                  item.itm_rcf_item_count = (parseInt(0)+ 1).toString();

                } else if (typeof numberValue === 'number') {
                    item.itm_rcf_item_count = (parseFloat(0)+ 1).toFixed(2);

                } 
            }


            //item.quantity = (parseFloat(item.quantity )+ 1).toFixed(2)

            return item;

        }

    })

  //   filteredDataSource.map(item =>{

  //     if(item.rowid == key){

  //       const numberValue = Number(item.itm_rcf_item_count);

  //       if (item.itm_rcf_item_count > 0) {
  //         console.log('increment if :',item.itm_rcf_item_count)
  //          if (Number.isInteger(numberValue)) {

  //             item.itm_rcf_item_count = (parseInt(item.itm_rcf_item_count)+ 1).toString();

  //           } else if (typeof numberValue === 'number') {

  //             item.itm_rcf_item_count = (parseFloat(item.itm_rcf_item_count )+ 1).toFixed(2);

  //           } 

  //       }else{
  //           console.log('increment else :',item.itm_rcf_item_count)
  //           //item.itm_rcf_item_count = (parseFloat(0 )+ 1).toFixed(2)

  //           if (Number.isInteger(numberValue)) {

  //             item.itm_rcf_item_count = (parseInt(0)+ 1).toString();

  //           } else if (typeof numberValue === 'number') {
  //               item.itm_rcf_item_count = (parseFloat(0)+ 1).toFixed(2);

  //           } 
  //       }


  //       //item.quantity = (parseFloat(item.quantity )+ 1).toFixed(2)

  //       return item;

  //     }

  // })
  setisRender(!isRender)

};

const decrement = (key) => {

    console.log('decrement key :',key)
    // Decrement the value by 0.01 (or any other desired step)
    //setValue((prevValue) => (parseFloat(prevValue )- 1).toFixed(2));

    StockMasterList.map(item =>{

      const numberValue = Number(item.itm_rcf_item_count);

      console.log('decrement numberValue :',numberValue)

        if(item.rowid == key){


        if (item.itm_rcf_item_count <= 0 || item.itm_rcf_item_count <= 1) {
            console.log('decrement if :',item.itm_rcf_item_count)
            

        }else{
            console.log('decrement else :',item.itm_rcf_item_count)
            //item.qty_needed = (parseFloat(item.qty_needed )- 1).toFixed(2)

            if (Number.isInteger(numberValue)) {

                item.itm_rcf_item_count = (parseInt(item.itm_rcf_item_count)- 1).toString();

            } else if (typeof numberValue === 'number') {
                item.itm_rcf_item_count = (parseFloat(item.itm_rcf_item_count)- 1).toFixed(2);

            } 
        }


            //item.qty_needed = (parseFloat(item.qty_needed )- 1).toFixed(2)

            return item;

        }

    })

    // filteredDataSource.map(item =>{

    //   const numberValue = Number(item.itm_rcf_item_count);

    //     if(item.key == key){


    //     if (item.itm_rcf_item_count <= 0 || item.itm_rcf_item_count <= 1) {
    //         //console.log('decrement if :',item.qty_needed)
            

    //     }else{
    //         //console.log('decrement else :',item.qty_needed)
    //         //item.qty_needed = (parseFloat(item.qty_needed )- 1).toFixed(2)

    //         if (Number.isInteger(numberValue)) {

    //             item.itm_rcf_item_count = (parseInt(item.itm_rcf_item_count)- 1).toString();

    //         } else if (typeof numberValue === 'number') {
    //             item.itm_rcf_item_count = (parseFloat(item.itm_rcf_item_count)- 1).toFixed(2);

    //         } 
    //     }


    //         //item.qty_needed = (parseFloat(item.qty_needed )- 1).toFixed(2)

    //         return item;

    //     }

    // })
    setisRender(!isRender)
};
  //Text Remark
  const changetextremark = (id, value) => {

    console.log('TextRemark RowID', id);
    console.log('TextRemark Value', value);

    var text_remark_value;
    if (!value) {
      text_remark_value = null;
    } else {
      text_remark_value = value;
    }

    StockMasterList.map(item => {
      if (item.rowid == id) {
        item.itm_rcf_remark = text_remark_value;
        return item;
      }
      return item;
    });

    filteredDataSource.map(item => {
      if (item.rowid == id) {
        item.itm_rcf_remark = text_remark_value;
        return item;
      }
      return item;
    });
  };

    const get_button = (id)=> {

    StockMasterList.map(item => {
        if (item.rowid == id) {
        let update = {

            count:item.itm_rcf_item_count,
            rowid:item.rowid,
            site_cd:Site_cd,
            count_book:item.itm_rcf_book_no,
            remark:item.itm_rcf_remark,
            itm_rcb_completed_by:EmpID,
            LOGINID:LoginID,
        }

        update_inventory_count_book_item(update)
        return item;
        }
        return item;
    });



    }


    const update_inventory_count_book_item=(async(json_obj)=>{


        // console.log('test',json_obj);

        setspinner(true);
        try{
            console.log("MR-Stock_No JSON DATA " + `${BaseUrl}/update_inventory_count_book_item.php?`)

            const response = await axios.post(`${BaseUrl}/update_inventory_count_book_item.php?`,
                JSON.stringify(json_obj),
                {headers: {'Content-Type': 'application/json'}}
            );
            // console.log("JSON DATA DASHBOARD 2 : " + response.data.data)
            if (response.data.status === 'SUCCESS') {

                setAlert(true, 'success', response.data.message, 'Update');
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
        }else if (D === 'Update') {

            setShow(false);
            
            setcolorcode1('#0096FF')
            setcolorcode2('#FFF')
            setcolorcode3('#FFF')

            get_stockMaster_list(itm_rcb_book_no,'ALL');
        }
    };

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
      
          const newData = StockMasterList.filter(function (item) {
            //const itemData = item.ast_mst_asset_no ? item.ast_mst_asset_no.toUpperCase() : ''.toUpperCase();
              //const itemData = item.ast_mst_asset_no.toUpperCase(),;
              const itemData = `${item.itm_rcf_stockno.toUpperCase()}
              ,${item.itm_mst_desc.toUpperCase()}
              ,${item.itm_rcf_stk_loc.toUpperCase()})`
          
            const textData = e.data.toUpperCase();
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

                    <Text style={{fontSize:20, justifyContent:'center',textAlign:'center',color:'#fff',fontWeight: 'bold',marginLeft:15}}>Stock Take Details</Text> 

                    </View>

                </Pressable>

            </View>
        </Appbar.Header>

        <View style={styles.container}>

        <SCLAlert theme={Theme} show={Show} title={Title}>
            <SCLAlertButton theme={Theme} onPress={() => One_Alret_onClick(Type)}> OK </SCLAlertButton>
        </SCLAlert>

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



        <View style={{margin:10}}>

            <View style={{flexDirection:"row"}}>

                <View>
                    <Text placeholder="Test" style={{color:'#42A5F5',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:15,}} >Count Book : </Text>
                </View>
                <View>
                    <Text placeholder="Test" style={{justifyContent: 'flex-start',fontWeight: 'bold',color:'#42A5F5',fontSize:15,}} >{itm_rcb_book_no}</Text>
                </View>

            </View>


            <View style={{flexDirection:"row"}}>

                <View>
                    <Text placeholder="Test" style={{color:'#808080',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:15}} >Description : </Text>
                </View>
                <View>
                    <Text placeholder="Test" style={{justifyContent: 'flex-start',fontWeight: 'bold',color:'#808080',fontSize:15}} >{itm_rcb_desc}</Text>
                </View>

            </View>

        </View>


        <View style={styles.view_2}> 

            <Button
            title="Total Item"
            titleStyle={{ color: "white", fontSize: 12, fontWeight: 'bold'}}
            onPress={() =>Button_select_list("Total_Item")}
            buttonStyle={{ height:50, backgroundColor: '#F4D03F', borderRadius: 3}}
            containerStyle={{ flex: 1,marginRight:3}}
            /> 

            <Button
            title="Pending Count"
            titleStyle={{ color: "white", fontSize: 12, fontWeight: 'bold', }}
            onPress={() =>Button_select_list("Pending_Count")}
            buttonStyle={{ backgroundColor: '#FF0000', borderRadius: 3, height:50, }}
            containerStyle={{ flex: 1,marginRight:3}}
            />  

            <Button
            title="Completed"
            titleStyle={{ color: "white", fontSize: 12, fontWeight: 'bold'}}
            onPress={() =>Button_select_list("Completed")}
            buttonStyle={{ backgroundColor: '#8BC34A', borderRadius: 3, height:50}}
            containerStyle={{ flex: 1}}
            /> 

        </View> 

        <View style={styles.view_4}> 
            <View style={{flex:1,backgroundColor:colorcode1,height:2,marginHorizontal:5} }></View>
            <View style={{flex:1,backgroundColor:colorcode2,height:2,marginHorizontal:5}}></View>
            <View style={{flex:1,backgroundColor:colorcode3,height:2,marginHorizontal:5}}></View>
        </View>

        <View style={styles.view_3}> 
            <Text style={{color:'#F4D03F', fontSize: 14,fontWeight: "bold",flex: 1,textAlign: 'center',alignItems:'center',justifyContent:'center'}}>{TotalItem}</Text>
            <Text style={{color:'#FF0000', fontSize: 14,fontWeight: "bold",flex: 1,textAlign: 'center',alignItems:'center',justifyContent:'center'}}>{PendingCount}</Text>
            <Text style={{color:'#8BC34A', fontSize: 14,fontWeight: "bold",flex: 1,textAlign: 'center',alignItems:'center',justifyContent:'center'}}>{Completed}</Text>
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

            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : null} 
                keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>   
              <FlatList
                  data={filteredDataSource}
                  keyExtractor={(item, index) => index.toString()}
                  showsVerticalScrollIndicator ={false}
                  showsHorizontalScrollIndicator={false}
                  ItemSeparatorComponent={ItemSeparatorView}
                  renderItem={ItemView}
                  extraData={isRender}     
              />
            </KeyboardAwareScrollView>
        </View>    

    </SafeAreaProvider> 
  )
}

export default StockTakeDetails

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