import React,{Fragment}from "react";
import {  View,StyleSheet,Text,Image,FlatList,TouchableOpacity,Pressable ,Modal,Dimensions,SafeAreaView, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressLoader from 'rn-progress-loader';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appbar } from 'react-native-paper';
import { openDatabase } from 'react-native-sqlite-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from "axios";
import moment from 'moment';
import { SearchBar } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {SCLAlert, SCLAlertButton} from 'react-native-scl-alert';
import {TextInput} from 'react-native-element-textinput';
import { ScrollView } from "react-native-gesture-handler";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CurrencyInput from 'react-native-currency-input';
import InputSpinner from "react-native-input-spinner";
import NumericInput from 'react-native-numeric-input';
import {Input} from 'react-native-elements';
import {ImageBackground} from 'react-native';
import { TextInput as RNTextInput } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';

const deviceWidth = Dimensions.get('screen').width;
const deviceHeight = Dimensions.get('screen').height;

var db = openDatabase({ name: 'CMMS.db' });
let Baseurl,Site_cd,LoginID,EmpName,EmpID,EmpPhone,EmpWorkGrp,dvc_id,dft_mst_mr_approval;

const StockReceive = ({navigation,route}) => {

    const _goBack = () => {

        if(route.params.Screenname === 'StockReceive'){
            navigation.navigate('MainTabScreen')
        }
    
        
    }   

    var valid = false;

    const [value, setValue] = React.useState(0.00); 


    const[spinner, setspinner]= React.useState(false);
    const[Editable, setEditable] = React.useState(false); 
    const[Visible, setVisible] = React.useState(false);
    const[search, setSearch] = React.useState('');

    const[StockReceive, setStockReceive]= React.useState([]);
    const[TotalMRLineNo, setTotalMRLineNo]= React.useState("0"); 
    const[isRender,setisRender]=React.useState(false);

    const[Reference_no, setReference_no]= React.useState('');
    const[Calender, setCalender]= React.useState('');

    const[Employee, setEmployee]= React.useState();
    const[StockCode, setStockCode]= React.useState();
    const[StockLocation, setStockLocation]= React.useState();
    const[RecevieUOM, setRecevieUOM]= React.useState();
   
    const[textvalue, settextvalue] = React.useState("");
    const[item_key, setitem_key] = React.useState('');
    const[Dropdown_data, setDropdown_data] = React.useState([]);
    const[DropDownFilteredData, setDropDownFilteredData] = React.useState([]);
    const[DropDown_modalVisible, setDropDown_modalVisible] = React.useState(false);
    const[DropDown_search, setDropDown_search] = React.useState('');
    const[EmployeeID, setEmployeeID]= React.useState('');
    const[EmployeeID_key, setEmployeeID_key]= React.useState('');

    const[Remark, setRemark]= React.useState('');
    const[Remark_height, setRemark_height] = React.useState(0);

    //Alert
    const[Show, setShow] = React.useState(false);
    const[Show_two, setShow_two] = React.useState(false);
    const[Theme, setTheme] = React.useState('');
    const[Title, setTitle] = React.useState('');
    const[Type, setType] = React.useState('');
    const[AlertData, setAlertData] = React.useState([]);

    //QR CODE
    const [showqrcode, setshowqrcode] = React.useState(false);
    const [scan, setscan] = React.useState(false);
    const [ScanResult, setScanResult] = React.useState(false);
    const [result, setresult] = React.useState(null);
    const [TabVisible, setTabVisible] = React.useState(false);

    React.useEffect(() => {

        const focusHander = navigation.addListener('focus', ()=>{

            fetchData()
            

        });
        return focusHander;

    
    },[navigation]); 
    
    const fetchData = async ()=>{ 

        setspinner(true); 

        setTimeout(() => {

            setspinner(false); 

        }, 500)

        Baseurl = await AsyncStorage.getItem('BaseURL');
        Site_cd = await AsyncStorage.getItem('Site_Cd');
        LoginID = await AsyncStorage.getItem('emp_mst_login_id');
        EmpName = await AsyncStorage.getItem('emp_mst_name');
        EmpID = await AsyncStorage.getItem('emp_mst_empl_id');
        EmpPhone = await AsyncStorage.getItem('emp_mst_homephone');
        EmpWorkGrp = await AsyncStorage.getItem('emp_det_work_grp');
        dft_mst_mr_approval = await AsyncStorage.getItem('dft_mst_mr_approval');
        console.log("WORK DATA:  "+ dft_mst_mr_approval);


        var date = moment().format('YYYY-MM-DD HH:mm');
        setCalender(date);

        db.transaction(function (txn) {

            txn.executeSql( 'SELECT * FROM employee', [], (tx, { rows }) => { setEmployee(rows.raw())});
            txn.executeSql( 'SELECT * FROM mrstockno', [], (tx, { rows }) => { setStockCode(rows.raw())});
            txn.executeSql( 'SELECT * FROM uom', [], (tx, { rows }) => { setRecevieUOM(rows.raw())});
        })
    
       
    }


    //Issue Emp
    const select_dropdown = (dropname,data,item) => {


        console.log("WORK DATA:  "+ JSON.stringify(item));

        if (dropname == 'Employee') {

            settextvalue('Employee');
            setDropDownFilteredData(data);
            setDropdown_data(data);
            setDropDown_search('');
            setDropDown_modalVisible(!DropDown_modalVisible);

        }else if (dropname == 'Stock Code') {

            settextvalue('Stock Code');
            setitem_key(item);
            setDropDownFilteredData(data);
            setDropdown_data(data);
            setDropDown_search('');
            setDropDown_modalVisible(!DropDown_modalVisible);

        }else if (dropname == 'StockLocation') {

            settextvalue('Stock Location');

            let stock_no_split
            if (!item.stock_no) {
                stock_no_split = '';
              } else {
                stock_no = item.stock_no.split(':');
                stock_no_split = stock_no[0].trim();
              }

            get_stock_location(stock_no_split);
            setitem_key(item.key);

        }else if (dropname == 'RecevieUOM') {

            settextvalue('Receive UOM');
            setitem_key(item.key);
            setDropDownFilteredData(data);
            setDropdown_data(data);
            setDropDown_search('')
            setDropDown_modalVisible(!DropDown_modalVisible);
        }
    
        

    }


    const renderText = item => {

        if (textvalue == 'Employee') {

        
            return (
                <View style={styles.dropdown_style}>

                    <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>

                        <View style={{flex: 1}}>

                            <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> ID : </Text>

                        </View>

                        <View style={{flex: 3}}>

                        <Text style={{ color: '#000', justifyContent: 'flex-start'}}> {item.emp_mst_empl_id} </Text>

                        </View>

                    </View>

                    <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>

                        <View style={{flex: 1}}>

                            <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Name : </Text>

                        </View>

                        <View style={{flex: 3}}>

                        <Text style={{ color: '#000', justifyContent: 'flex-start'}}> {item.emp_mst_name} </Text>

                        </View>

                    </View>

                    <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>

                        <View style={{flex: 1}}>

                            <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Title : </Text>

                        </View>

                        <View style={{flex: 3}}>

                            <Text style={{ color: '#000', justifyContent: 'flex-start'}}> {item.emp_mst_title} </Text>

                        </View>

                    </View>
                </View>
            )


        }else if (textvalue == 'Stock Code') {

            let min,issue,total;

            if(item.itm_det_order_pt == '.0000'){
            min = '0'
            }else{
            min = item.itm_det_order_pt
            }

            if(item.itm_mst_issue_price == '.0000'){
            issue = '0'
            }else{
                issue = item.itm_mst_issue_price
            }

            if(item.itm_mst_ttl_oh == '.0000'){
            total = '0'
            }else{
                total = item.itm_mst_ttl_oh
            }
            
            
            let val_min = parseFloat(min).toFixed(2);
            let val_issue = parseFloat(issue).toFixed(2);
            let val_total = parseFloat(total).toFixed(2);

        
            return (
                <View style={styles.dropdown_style}>

                     <View style={{flex:1,justifyContent:'space-between',flexDirection:'row'}}>
                        <Text style={{color:'#2962FF',fontSize: 13,backgroundColor:'#D6EAF8',padding:10, fontWeight: 'bold',borderRadius:10,fontSize:12}} > {item.itm_mst_stockno}</Text>
                        <Text style={{fontSize: 16,color:'#8BC34A',fontWeight: 'bold',fontSize:12}} >{item.itm_det_part_deac_status}</Text>
                    </View>

                    <View style={{flexDirection:"row",marginTop:10}}>
                        <View style={{width:'40%'}}>
                            <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12}} >Cost Center :</Text>
                        </View>
                        <View style={{flex:1}}>
                            <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000',fontSize:12}} >{item.itm_mst_costcenter}</Text>
                        </View>
                    </View>

                    <View style={{flexDirection:"row",marginTop:2}}>
                        <View style={{width:'40%'}}>
                            <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12}} >Master Location :</Text>
                        </View>
                        <View style={{flex:1}}>
                            <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000',fontSize:12}} >{item.itm_mst_mstr_locn}</Text>
                        </View>
                    </View>

                    <View style={{flexDirection:"row",marginTop:2}}>
                        <View style={{width:'40%'}}>
                            <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12}} >Description :</Text>
                        </View>
                        <View style={{flex:1}}>
                            <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000',fontSize:12}} >{item.itm_mst_desc}</Text>
                        </View>
                    </View>

                    <View style={{flexDirection:"row",marginTop:2}}>
                        <View style={{width:'40%'}}>
                            <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12}} >Extended Desc :</Text>
                        </View>
                        <View style={{flex:1}}>
                            <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000',fontSize:12}} >{item.itm_mst_ext_desc}</Text>
                        </View>
                    </View>

                    <View style={{flexDirection:"row",marginTop:2}}>
                        <View style={{width:'40%'}}>
                            <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12}} >Part No :</Text>
                        </View>
                        <View style={{flex:1}}>
                            <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000',fontSize:12}} >{item.itm_mst_partno}</Text>
                        </View>
                    </View>

                    <View style={{flexDirection:"row",marginTop:2,justifyContent:'space-between',}}>

                  <View style={{flexDirection:"row"}}>

                    <View>
                        <Text placeholder="Test" style={{color:'#FF5733',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12,}} >Min Qty : </Text>
                    </View>
                    <View>
                        <Text placeholder="Test" style={{justifyContent: 'flex-start',fontWeight: 'bold',color:'#FF5733',fontSize:12,}} >{val_min}</Text>
                    </View>

                  </View>
                  

                  <View style={{flexDirection:"row"}}>

                    <View>
                        <Text placeholder="Test" style={{color:'#FF5733',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12}} >Issue Price : </Text>
                    </View>
                    <View>
                        <Text placeholder="Test" style={{justifyContent: 'flex-start',fontWeight: 'bold',color:'#FF5733',fontSize:12}} >{val_issue}</Text>
                    </View>

                  </View>

                  

                  <View style={{flexDirection:"row"}}>

                    <View >
                        <Text placeholder="Test" style={{color:'#FF5733',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12}} >Total OH : </Text>
                    </View>
                    <View >
                        <Text placeholder="Test" style={{justifyContent: 'flex-start',fontWeight: 'bold',color:'#FF5733',fontSize:12}} >{val_total}</Text>
                    </View>
                  </View>

                  
                </View>

                    
                </View>
            )


        }else if (textvalue == 'Stock Location') {

            return (
                <View style={styles.dropdown_style}>

                    <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>

                        <View style={{flex: 1}}>

                            <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Stock Location : </Text>

                        </View>

                        <View style={{flex: 1.5}}>

                        <Text style={{ color: '#000', justifyContent: 'flex-start'}}> {item.itm_loc_stk_loc} </Text>

                        </View>

                    </View>

                    <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>

                        <View style={{flex: 1}}>

                            <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Description : </Text>

                        </View>

                        <View style={{flex: 1.5}}>

                        <Text style={{ color: '#000', justifyContent: 'flex-start'}}> {item.loc_mst_desc} </Text>

                        </View>

                    </View>

                    
                </View>
            )

        }else if (textvalue == 'Receive UOM') {

            return (
                <View style={styles.dropdown_style}>

                    <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>

                        <View style={{flex: 1}}>

                            <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> UOM Code : </Text>

                        </View>

                        <View style={{flex: 1.5}}>

                        <Text style={{ color: '#000', justifyContent: 'flex-start'}}> {item.uom_mst_uom} </Text>

                        </View>

                    </View>

                    <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>

                        <View style={{flex: 1}}>

                            <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Description : </Text>

                        </View>

                        <View style={{flex: 1.5}}>

                        <Text style={{ color: '#000', justifyContent: 'flex-start'}}> {item.uom_mst_desc} </Text>

                        </View>

                    </View>

                    
                </View>
            )

        }

    }
    
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
    

    const DropDown_searchFilterFunction = text => {

        console.log('r', textvalue);
        if (text) {

            let newData;

        if (textvalue == 'Employee') {

            newData = Dropdown_data.filter(function (item) {
                const itemData = `${item.emp_mst_empl_id.toUpperCase()},
                    ,${item.emp_mst_title.toUpperCase()}
                    ,${item.emp_mst_name.toUpperCase()})`;

                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });

        } else if ( textvalue == 'Stock Code' ) {

            newData = Dropdown_data.filter(function (item) {

                const itemData = `${item.itm_mst_stockno.toUpperCase()}`;

                const textData = text.toUpperCase();

                return itemData.indexOf(textData) > -1;
            });

        } else if (textvalue == 'StockLocation') {

            newData = Dropdown_data.filter(function (item) {

                const itemData = `${item.wrk_flt_fault_cd.toUpperCase()}`;

                const textData = text.toUpperCase();

                return itemData.indexOf(textData) > -1;

            });

        } else if (textvalue == 'RecevieUOM') {

            newData = Dropdown_data.filter(function (item) {

                const itemData = `${item.uom_mst_uom.toUpperCase()}`;

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

    const getItem = select_item => {

        console.log("WORK select_item:  "+ JSON.stringify(select_item));

        if (textvalue == 'Employee') {

            setEmployeeID(select_item.emp_mst_empl_id +' : '+ select_item.emp_mst_name)
            setEmployeeID_key(select_item.emp_mst_empl_id);

        }else if (textvalue == 'Stock Code') {

            StockReceive.map(item => {
                if (item.key == item_key) {

                  item.itm_mst_rowid = select_item.RowID
                  item.itm_mst_costcenter = select_item.itm_mst_costcenter
                  item.itm_mst_account = select_item.itm_mst_account
                  item.stock_no = select_item.itm_mst_stockno +' : '+ select_item.itm_mst_desc
                  item.stock_location = select_item.itm_mst_mstr_locn
                  item.rcv_uom = select_item.itm_mst_issue_uom
                 
                  
                        
                  return item;
                }
                return item;
              });


        }else if (textvalue == 'Stock Location') {

            StockReceive.map(item => {
                if (item.key == item_key) {

                  item.stock_location = select_item.itm_loc_stk_loc
                        
                  return item;
                }
                return item;
              });

        }else if (textvalue == 'Receive UOM') {

            StockReceive.map(item => {
                if (item.key == item_key) {

                  item.rcv_uom = select_item.uom_mst_uom
                     
                  return item;
                }
                return item;
              });

        }

        setSearch('');
        setDropDown_modalVisible(!DropDown_modalVisible);
    }


    const get_stock_location =(async(stockno)=>{


        setspinner(true);

        try{
 
            console.log('get_stock_location:',`${Baseurl}/get_stock_location.php?site_cd=${Site_cd}&itm_mst_stockno=${stockno}`);
            const response = await axios.post(`${Baseurl}/get_stock_location.php?site_cd=${Site_cd}&itm_mst_stockno=${stockno}`);
            //console.log("JSON DATA : " + response.data.data)
            if (response.data.status === 'SUCCESS') {
               
               
 
                setStockLocation(response.data.data);

                setDropDownFilteredData(response.data.data);
                setDropdown_data(response.data.data);

                setDropDown_modalVisible(!DropDown_modalVisible);

                 
 
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
 

    //Add Stock List 
    const addItem =(()=>{


        if(!Reference_no){

            setAlert(true, 'danger', 'Please enter the reference no', 'OK');
            valid = false;
        }else{

            if(!EmployeeID){

                setAlert(true, 'danger', 'Please select employee ID', 'OK');
                valid = false;
            }else{

                if(!Remark){

                    setAlert(true, 'danger', 'Please the Remark', 'OK');
                    valid = false;
                }else{
        
                    valid = true;
                }
    
    
            }

        }

        if(valid){

            if(StockReceive.length > 0){

                StockReceive.map(item =>{

                    if(!item.stock_no){

                        setAlert(true,'warning',`Alert line No: ${item.key} Please select stock no`,'OK');
                        
                        return

                    }else{

                        if(!item.stock_location){

                            setAlert(true,'warning',`Alert line No: ${item.key} Please select stock location`,'OK');
                            
                            return
    
                        }else{

                            if(!item.rcv_uom){

                                setAlert(true,'warning',`Alert line No: ${item.key} Please select receive uom`,'OK');
                               
                                return
        
                            }else{

                                if(!item.rcv_itm_cost){

                                    setAlert(true,'warning',`Alert line No: ${item.key} Please enter the cost`,'OK');
                                   
                                    return
            
                                }else{
    
                                    if(!item.rcv_qty){

                                        setAlert(true,'warning',`Alert line No: ${item.key} Please enter the quantity`,'OK');
                                       
                                        return
                
                                    }else{
        
                                        let key = StockReceive.length + 1;
                                        setStockReceive(StockReceive =>[...StockReceive,{
                                            key:key,
                            
                                            itm_mst_rowid:'',
                                            itm_mst_costcenter:'',
                                            itm_mst_account:'',
                                            stock_no:'',
                                            stock_location:'',
                                            rcv_uom:'',
                                            rcv_itm_cost:'',
                                            rcv_qty:'',
                            
                                        }])
        
                                        
                                    }
                                    
                                }
                                
                            }
    
                        }

                    }

                })
           

                
    
            }else{
    
                let key = StockReceive.length + 1;
                setStockReceive(StockReceive =>[...StockReceive,{
                    key:key,
    
                    itm_mst_rowid:'',
                    itm_mst_costcenter:'',
                    itm_mst_account:'',
                    stock_no:'',
                    stock_location:'',
                    rcv_uom:'',
                    rcv_itm_cost:'',
                    rcv_qty:'',
    
                }])
                setTotalMRLineNo(StockReceive.length);
                setVisible(true);
    
            }

        }
        
        
        
    })

    const ItemView =({item,index})=>{

        
        return(
    
          <View style={{ backgroundColor: '#FFFFFF', margin:15, borderRadius: 15, padding:15}}>
            {/* Line */}
            <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>                      
    
              <Text style={{fontSize:15, justifyContent:'center',alignItems:'center',color:'#0096FF',fontWeight: 'bold'}}>Stock no: {item.key}</Text> 
    
              <TouchableOpacity onPress={()=>removeItem(item.key)}>
                <Image 
                    style={{  width: 35, height: 35}} 
                    source={require('../../images/minus.png')}
                />
              </TouchableOpacity>
            
            </View>

            <View style={{ height: 0.5, width: '100%', backgroundColor: '#C8C8C8',marginTop:5,}} />

            <View style={[ styles.view_style]}>
                <Pressable
                    onPress={() => select_dropdown('Stock Code',StockCode,item.key)}>
                    <View pointerEvents={'none'}>
                        <TextInput
                            value={item.stock_no}
                            style={[ styles.input, { height: Platform.OS === 'ios' ? 50 : 50}]}
                            inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}]}
                            labelStyle={styles.labelStyle}
                            placeholderStyle={{ fontSize: 13, color: '#0096FF'}}
                            label="Stock Code"
                            editable={false}
                            selectTextOnFocus={false}
                            renderRightIcon={() =>
                                Editable ? (
                                ''
                                ) : (
                                <AntDesign
                                    style={styles.icon}
                                    color={'black'}
                                    name={item.stock_no ? 'search1' : 'search1'}
                                    size={22}
                                />
                                )
                            }
                        />
                    </View>
                </Pressable>
            </View>

            <View style={[ styles.view_style]}>
                <Pressable
                    onPress={() => select_dropdown('StockLocation',StockLocation,item)}>
                    <View pointerEvents={'none'}>
                        <TextInput
                            value={item.stock_location}
                            style={[ styles.input, { height: Platform.OS === 'ios' ? 50 : 50}]}
                            inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}]}
                            labelStyle={styles.labelStyle}
                            placeholderStyle={{ fontSize: 13, color: '#0096FF'}}
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
                                    name={item.stock_location ? 'search1' : 'search1'}
                                    size={22}
                                />
                                )
                            }
                        />
                    </View>
                </Pressable>
            </View>

            <View style={[ styles.view_style]}>
                <Pressable
                    onPress={() => select_dropdown('RecevieUOM',RecevieUOM,item)}>
                    <View pointerEvents={'none'}>
                        <TextInput
                            value={item.rcv_uom}
                            style={[ styles.input, { height: Platform.OS === 'ios' ? 50 : 50}]}
                            inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}]}
                            labelStyle={styles.labelStyle}
                            placeholderStyle={{ fontSize: 13, color: '#0096FF'}}
                            label="Receive UOM"
                            editable={false}
                            selectTextOnFocus={false}
                            renderRightIcon={() =>
                                Editable ? (
                                ''
                                ) : (
                                <AntDesign
                                    style={styles.icon}
                                    color={'black'}
                                    name={item.rcv_uom ? 'search1' : 'search1'}
                                    size={22}
                                />
                                )
                            }
                        />
                    </View>
                </Pressable>
            </View>

            {/* <View style={{flex: 1,flexDirection:"row"}}>
                <View style={[styles.view_style,{flex: 1,marginBottom:10}]}>
                    <TextInput
                        value={item.rcv_itm_cost}
                        style={[ styles.input, { height: Platform.OS === 'ios' ? 50 : 50}]}
                        inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}]}
                        labelStyle={styles.labelStyle}
                        placeholderStyle={{fontSize: 15, color: '#0096FF'}}
                        label="Cost $$$"
                        keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                        placeholderTextColor="gray"
                        editable={!Editable}
                        selectTextOnFocus={!Editable}
                        onChangeText={text => { changetext(item.key,text,'cost') }}
                        renderRightIcon={() =>
                            Editable ? (
                            ''
                        ) : (
                            <AntDesign
                                style={styles.icon}
                                name={item.rcv_itm_cost ? 'close' : ''}
                                size={20}
                                disable={true}
                                
                            />
                        )
                        }
                    />
                </View>

                <View style={[styles.view_style,{flex: 1,marginBottom:10}]}>
                    <TextInput
                        value={item.rcv_qty}
                        style={[ styles.input, { height: Platform.OS === 'ios' ? 50 : 50}]}
                        inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}]}
                        labelStyle={styles.labelStyle}
                        placeholderStyle={{fontSize: 15, color: '#0096FF'}}
                        label="Quantity ###"
                        keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                        placeholderTextColor="gray"
                        editable={!Editable}
                        selectTextOnFocus={!Editable}
                        onChangeText={text => { changetext(item.key,text,'quantity') }}
                        renderRightIcon={() =>
                            Editable ? (
                            ''
                        ) : (
                            <AntDesign
                                style={styles.icon}
                                name={item.rcv_qty ? 'close' : ''}
                                size={20}
                                disable={true}
                                
                            />
                        )
                        }
                    />
                </View>
            </View> */}

            <View style={{flex: 1,flexDirection:"row",}}>
                <View style={{flex: 1,marginTop: 5, marginLeft: 15, marginRight: 10,}}>
                <Text placeholder="Test" style={{color:'#FF5733',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12}} >Cost $$$:</Text>
                </View>

                <View style={{flex: 1,marginTop: 5, marginLeft: 15, marginRight: 10,}}>
                <Text placeholder="Test" style={{color:'#FF5733',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12}} >Quantity ###:</Text>
                </View>
            </View>

            <View style={{flex: 1,flexDirection:"row"}}>
                <View style={[{flex: 1,marginBottom:10, marginTop: 5,marginLeft: 10, marginRight: 10,}]}>
                    <CurrencyInput
                        value={item.rcv_itm_cost}
                        onChangeValue={value => changetext(item.key,value,'cost')} 
                        delimiter=","
                        precision={2}
                        separator="."
                        style={[ styles.input, { height: Platform.OS === 'ios' ? 50 : 50}]}

                    />
                </View>

                <View style={[{flex: 1,marginTop: 5,marginBottom:10,}]}>
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
                            
                            value={item.rcv_qty}
                            key={item.key}
                            style={{flex: 1, height:50, borderColor: 'gray', borderRadius: 1, borderWidth: 1}}
                            keyboardType="numeric"
                            placeholder="Quantity"
                            maxLength={String(999999999).length} 
                            placeholderTextColor="#0096FF"
                            textAlign="center"
                            onChangeText={(text) => {
                            if (text===''|| text.match(/^\d+(\.\d{0,2})?$/)){

                                item.rcv_qty = text
                                changetext(item.key,text,'quantity')
                            
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
          </View>
    
        );
    
    }
    
    const ItemSeparatorView=()=>{

        return ( <View style={{ backgroundColor: '#C8C8C8'}}/> );
    }

    const changetext = (id,value,type) => {

        console.log('Text id', id);
        console.log('Text Value', value);
        console.log('Text type', type);
        

        if(type === 'cost'){

            var text_remark_value;
            if (value >= 0) {

                text_remark_value = value
               
            }else{
                text_remark_value = 0
            }


            StockReceive.map(item => {
                if (item.key == id) {

                  item.rcv_itm_cost = text_remark_value
          
                   
                  return item;
                }
                return item;
            });

            setisRender(!isRender)

        }else if(type === 'quantity'){

            

           StockReceive.map(item => {
                if (item.key == id) {

                  item.rcv_qty = value
                   
                  return item;
                }
                return item;
            });

           
            setisRender(!isRender)
        }

        

    }

    const increment = (key) => {

        console.log('increment key :',key)

        // Increment the value by 0.01 (or any other desired step)
        //setValue((prevValue) => (parseFloat(prevValue )+ 1).toFixed(2));

        

        StockReceive.map(item =>{

            if(item.key == key){


                const numberValue = Number(item.rcv_qty);

                if (item.rcv_qty > 0) {
                    //console.log('increment if :',item.qty_needed)
                    // const sum2 = (parseFloat(item.qty_needed ))
                    // const sum = (parseInt(sum2)+ 1);


                    if (Number.isInteger(numberValue)) {

                        item.rcv_qty = (parseInt(item.rcv_qty)+ 1).toString();

                    } else if (typeof numberValue === 'number') {
                        item.rcv_qty = (parseFloat(item.rcv_qty )+ 1).toFixed(2);

                    } 
                   
                }else{
                    console.log('increment else :',item.rcv_qty)
                    //const sum = (parseInt(0)+ 1).toString();
                    if (Number.isInteger(numberValue)) {

                        item.rcv_qty = (parseInt(0)+ 1).toString();

                    } else if (typeof numberValue === 'number') {
                        item.rcv_qty = (parseFloat(0)+ 1).toFixed(2);

                    } 
                }


                //item.qty_needed = (parseFloat(item.qty_needed )+ 1).toFixed(2)

                return item;

            }

        })
        setisRender(!isRender)

    };
    
    const decrement = (key) => {

        console.log('decrement key :',key)
        // Decrement the value by 0.01 (or any other desired step)
        //setValue((prevValue) => (parseFloat(prevValue )- 1).toFixed(2));

        StockReceive.map(item =>{

            const numberValue = Number(item.rcv_qty);

            if(item.key == key){


                if (item.rcv_qty <= 0 || item.rcv_qty <= 1) {
                    //console.log('decrement if :',item.qty_needed)
                    

                }else{
                    //console.log('decrement else :',item.qty_needed)
                    //item.qty_needed = (parseFloat(item.qty_needed )- 1).toFixed(2)

                    if (Number.isInteger(numberValue)) {

                        item.rcv_qty = (parseInt(item.rcv_qty)- 1).toString();

                    } else if (typeof numberValue === 'number') {
                        item.rcv_qty = (parseFloat(item.rcv_qty)- 1).toFixed(2);

                    } 
                }


                //item.qty_needed = (parseFloat(item.qty_needed )- 1).toFixed(2)

                return item;

            }

        })
        setisRender(!isRender)
    };

    //Remove Time Card Item
    removeItem =(key)=>{

        console.log("REMOVE"+key)

        setAlert_two(true,'delete','Do you confirm to remove the line?','REMOVE_LINE',key,'')

        //setTimecard(Timecard.slice().filter((item)=>item.key !==key))
    }

    const get_history = () => {

        navigation.navigate('StockIssueHistory',{ Screenname:route.params.Screenname })
        
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
        }else if (D === 'Update') {

            setShow(false);
           _goBack();
        }else if (D === 'REMOVE_LINE') {

            setStockReceive(StockReceive.slice().filter((item)=>item.key !==AlertData));

            setShow_two(false)
        }
    };

    const setAlert_two =(show,theme,title,type,value)=>{

        setShow_two(show);
        setTheme(theme);
        setTitle(title);
        setType(type);
        setAlertData(value);
    
    }

    const get_button =()=>{

        var date = moment().format('YYYY-MM-DD HH:mm');

        if(!Reference_no){

            setAlert(true, 'danger', 'Please enter the reference no', 'OK');
            valid = false;
        }else{

            if(!EmployeeID){

                setAlert(true, 'danger', 'Please select employee ID', 'OK');
                valid = false;
            }else{

                if(!Remark){

                    setAlert(true, 'danger', 'Please the Remark', 'OK');
                    valid = false;
                }else{
        
                    valid = true;
                }
    
    
            }

        }
          
        if(valid){

            if(StockReceive.length > 0){

                var List =[]

                StockReceive.map(item =>{

                    if(!item.stock_no){

                        setAlert(true,'warning',`Alert line No: ${item.key} Please select stock no`,'OK');
                        
                        return

                    }else{

                        if(!item.stock_location){

                            setAlert(true,'warning',`Alert line No: ${item.key} Please select stock location`,'OK');
                            
                            return
    
                        }else{

                            if(!item.rcv_uom){

                                setAlert(true,'warning',`Alert line No: ${item.key} Please select receive uom`,'OK');
                               
                                return
        
                            }else{

                               
                                if(!item.rcv_itm_cost){

                                    setAlert(true,'warning',`Alert line No: ${item.key} Please enter the cost`,'OK');
                                   
                                    return
            
                                }else{
    
                                    if(!item.rcv_qty){

                                        setAlert(true,'warning',`Alert line No: ${item.key} Please enter the quantity`,'OK');
                                       
                                        return
                
                                    }else{


                                        let stock_no_split
                                        if (!item.stock_no) {
                                            stock_no_split = '';
                                        } else {
                                            stock_no = item.stock_no.split(':');
                                            stock_no_split = stock_no[0].trim();
                                        }
        
                                        List.push({

                                            itm_mst_rowid:item.itm_mst_rowid,
                                            stock_no: stock_no_split,
                                            stock_location: item.stock_location,
                                            rcv_uom: item.rcv_uom,
                                            rcv_itm_cost: item.rcv_itm_cost,
                                            rcv_qty: item.rcv_qty,
                                            itm_mst_costcenter: item.itm_mst_costcenter,
                                            itm_mst_account: item.itm_mst_account,
                                            
                                        })
        
                                        
                                    }
                                    
                                }
                        
                                
                            }
    
                        }

                    }

                })


                if(List.length>0){

                    var timeDetails = {


                    

                        Header : [{
    
                            site_cd:Site_cd,
                            pkg_slip: Reference_no,
                            rcv_emp: EmployeeID_key,
                            remark: Remark,
                            audit_user: EmpID,
                            audit_date: date,
                            supplier: "",
    
                        }],
    
                        Details : List
                    }
        
                    //console.log(JSON.stringify(timeDetails))
                    console.log(JSON.stringify(timeDetails))
                    update_stock_receive(timeDetails);

                }
                

            }else{

                setAlert(true, 'danger', 'Please create Stock Receive transaction ', 'OK');
            }
        }
      
       
    };


    const update_stock_receive =(async(data)=>{
        setspinner(true);
        try{


            const response = await axios.post(`${Baseurl}/update_stock_receive.php?`,
                JSON.stringify(data),
                {headers:{ 'Content-Type': 'application/json'}});

            console.log("JSON DATA : " + response)
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
      const newData = Dropdown_data.filter(function (item) {
        //const itemData = item.ast_mst_asset_no ? item.ast_mst_asset_no.toUpperCase() : ''.toUpperCase();
          //const itemData = item.ast_mst_asset_no.toUpperCase(),;
          const itemData = `${item.itm_mst_stockno.toUpperCase()}`
      
        const textData =  e.data.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setDropDownFilteredData(newData);
      setDropDown_search(e.data);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setDropDownFilteredData(Dropdown_data);
      setDropDown_search(e.data);
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
            <View style={{ flex: 1,flexDirection: 'row', justifyContent: 'space-between' }}>
                <Pressable onPress={_goBack}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <FontAwesome
                            name="angle-left"
                            color="#fff"
                            size={55}
                            style={{marginLeft: 15, marginBottom: 5}}
                        />
                        <Text style={{ fontSize: 20, justifyContent: 'center', textAlign: 'center', color: '#fff', fontWeight: 'bold', marginLeft: 15, }}> {'Stock Receive'} </Text>
                    </View>
                </Pressable>

                <View style={{flex: 1,flexDirection:'row',justifyContent:'flex-end',alignItems:'center',marginRight:20}}>
                    <Pressable onPress={() => addItem()}>
                        <View style={{justifyContent:'center',alignItems:'center'}}>
                            <Text style={{fontSize:12, justifyContent:'center',textAlign:'center',color:'#fff',fontWeight: 'bold'}}>NEW</Text> 
                        
                            <Ionicons 
                                name="add-circle-sharp"
                                color='#FFFF'
                                size={28}
                                style={{marginBottom:5}}
                            
                            /> 

                        </View>
                    </Pressable>
                </View>

               

            </View>
        </Appbar.Header>    

        <ProgressLoader visible={spinner} isModal={true} isHUD={true} hudColor={"#808080"} color={"#FFFFFF"} />

        <SCLAlert theme={Theme} show={Show} title={Title}>
            <SCLAlertButton theme={Theme} onPress={() => One_Alret_onClick(Type)}> OK </SCLAlertButton>
        </SCLAlert>

        <SCLAlert
          theme={Theme} 
          show={Show_two} 
          title={Title} >

          <SCLAlertButton theme={Theme}  onPress={()=>One_Alret_onClick(Type)}>Yes</SCLAlertButton>
          <SCLAlertButton theme="default" onPress={()=>setShow_two(false)}>No</SCLAlertButton>

        </SCLAlert>

        <Modal 
            animationType="slide"
            transparent={true}
            visible={DropDown_modalVisible}
            onRequestClose={()=>{
                Alert.alert("Closed")
                setDropDown_modalVisible(!DropDown_modalVisible)
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

                <View style={{flex:1,margin:20,backgroundColor:'#FFFFFF'}}>

                    <View style={{flexDirection:'row',alignItems:'center', height: 50}}>
                        <Text style={{flex:1,fontSize:15,justifyContent:'center',textAlign: 'center', color: '#000', fontWeight: 'bold'}}>{textvalue}</Text> 
                        <Ionicons 
                            name="close"
                            color="red"
                            size={30}
                            style={{marginEnd: 15}}
                            onPress={()=>setDropDown_modalVisible(false)}
                        />                        
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
                            value={DropDown_search}
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
                        inputStyle={{color:'#000'}}
                        inputContainerStyle={{backgroundColor: '#FFFF'}}
                        searchIcon={{ size: 24 }}
                        onChangeText={(text) => DropDown_searchFilterFunction(text)}
                        onClear={(text) => DropDown_searchFilterFunction('')}
                        placeholder="Search here..."
                        value={DropDown_search}
                    /> */}

                    <FlatList
                        data={DropDownFilteredData}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator ={false}
                        showsHorizontalScrollIndicator={false}
                        ItemSeparatorComponent={Dropdown_ItemSeparatorView}
                        renderItem={Dropdown_ItemView}
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

                        <View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'column'}}> 
                            <View style={styles.card_01}>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
                                    <View style={[styles.view_style,{flex:1}]}>
                                        <TextInput
                                            value={Reference_no}
                                            style={[ styles.input, { height: Platform.OS === 'ios' ? 50 : 50}]}
                                            inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}]}
                                            labelStyle={styles.labelStyle}
                                            placeholderStyle={{ fontSize: 13, color: '#0096FF'}}
                                            label="Reference No"
                                            editable={!Editable}
                                            selectTextOnFocus={!Editable}
                                            onChangeText={text => { setReference_no(text) }}
                                            renderRightIcon={() =>
                                                Editable ? (
                                                ''
                                                ) : (
                                                <AntDesign
                                                    style={styles.icon}
                                                    color={'black'}
                                                    name={Reference_no ? '' : ''}
                                                    size={22}
                                                />
                                                )
                                            }
                                        />
                                    </View>

                                    <View style={{alignItems: 'center',padding:5}}>
                                        <MaterialIcons
                                            name="format-list-numbered"
                                            color={'#05375a'}
                                            size={45}
                                            onPress={() => get_history()}
                                            disabled={Editable}
                                        />

                                        <Text style={{ color: '#05375a', fontSize: 12, fontWeight: 'bold', }}> History </Text>
                                    </View>
                                </View>

                                
                                <View style={[styles.view_style,{marginTop:15}]}>
                                    <TextInput
                                        value={Calender}
                                        style={[ styles.input, { height: Platform.OS === 'ios' ? 50 : 50}]}
                                        inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#808080'}]}
                                        labelStyle={styles.labelStyle}
                                        placeholderStyle={{fontSize: 12, color: '#0096FF'}}
                                        label="Calender"
                                        focusColor="#808080"
                                        editable={false}
                                        selectTextOnFocus={false}
                                        renderRightIcon={() =>
                                            Editable ? (
                                            ''
                                            ) : (
                                            <AntDesign
                                                style={styles.icon}
                                                color={'black'}
                                                name={Calender ? '' : ''}
                                                size={22}
                                            />
                                            )
                                        }
                                        
                                        
                                    />
                                </View>

                                <View style={[ styles.view_style]}>
                                    <Pressable
                                        onPress={() => select_dropdown('Employee',Employee,"")}>
                                        <View pointerEvents={'none'}>
                                            <TextInput
                                                value={EmployeeID}
                                                style={[ styles.input, { height: Platform.OS === 'ios' ? 50 : 50}]}
                                                inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}]}
                                                labelStyle={styles.labelStyle}
                                                placeholderStyle={{ fontSize: 13, color: '#0096FF'}}
                                                label="Employee ID"
                                                editable={false}
                                                selectTextOnFocus={false}
                                                renderRightIcon={() =>
                                                    Editable ? (
                                                    ''
                                                    ) : (
                                                    <AntDesign
                                                        style={styles.icon}
                                                        color={'black'}
                                                        name={EmployeeID ? 'search1' : 'search1'}
                                                        size={22}
                                                    />
                                                    )
                                                }
                                            />
                                        </View>
                                    </Pressable>
                                </View>

                                <View style={[styles.view_style,{marginBottom:10}]}>
                                    <TextInput
                                        value={Remark}
                                        style={[ styles.input, { height: Math.max( Platform.OS === 'ios' ? 50 : 50, Remark_height)}]}
                                        multiline
                                        inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}]}
                                        labelStyle={styles.labelStyle}
                                        placeholderStyle={{fontSize: 15, color: '#0096FF'}}
                                        onContentSizeChange={event => setRemark_height(event.nativeEvent.contentSize.height)}
                                        label="Remark"
                                        placeholderTextColor="gray"
                                        clearButtonMode="always"
                                        editable={!Editable}
                                        selectTextOnFocus={!Editable}
                                        onChangeText={text => { setRemark(text) }}
                                        renderRightIcon={() =>
                                            Editable ? (
                                            ''
                                        ) : (
                                            <AntDesign
                                                style={styles.icon}
                                                name={Remark ? 'close' : ''}
                                                size={20}
                                                disable={true}
                                                onPress={() => Remark ? setRemark('') : '' }
                                            />
                                        )
                                        }
                                    />
                                </View>

                                
                

                            </View>


                            <View style={{flexDirection:"row",justifyContent:'space-between',backgroundColor:'#0096FF',padding:10}}>
                                <Text style={{fontSize:15, color:'#ffffffff',margin:5}}>Stock Receive Transaction</Text>   
                                <Text style={{fontSize:15,color:'#ffffffff',margin:5}}>Total Stock No : {TotalMRLineNo}</Text>                      
                            </View>

                    

                        </View>
                            
                    }
                    data={StockReceive}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={ItemSeparatorView}
                    renderItem={ItemView}   
                    extraData={isRender}      
                    
                />
            </KeyboardAwareScrollView>

        </View>


        <View style={ [styles.bottomView,{display: Visible ? 'flex' : 'none'}]} >
            <TouchableOpacity style={{ flex: 1,height:50,backgroundColor:'#8BC34A', alignItems:'center',justifyContent:'center'}} 
               onPress={get_button}>
                <Text style={{color:'white', fontSize: 16}}>RECEIVE</Text>
            </TouchableOpacity>

        </View>
    </SafeAreaProvider>
  )
}

export default StockReceive

const styles = StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: '#e0e0eb'
    },

    card_01: {

        backgroundColor: '#FFFFFF',
        margin:10,
        borderRadius: 10,      
    },

    bottomView:{
        flex:1,
        flexDirection:'row',
        width: '100%', 
        height:50, 
        justifyContent: 'center', 
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
    },

    item:{
        padding:10,
        backgroundColor: '#fff',
        borderRadius: 10,
        margin:10
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
      
    model2_cardview:{

        flex:1,
        marginTop:50,
        backgroundColor:'rgba(0,0,0,0.8)'

    },
    text_footer: {
        color: '#42A5F5',
        fontSize: 14,
        marginLeft:5
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
        paddingLeft: 10,
        fontSize:13
        
    },
    view_style:{
        marginBottom:10,
        marginLeft:10,
        marginRight:10,
        marginTop:10
    }, 
    text_input_desc:{
    
        maxHeight:100,
        color:'#000',
        borderColor: '#808080',
        borderRadius: 5,
        borderWidth: 1,
        marginTop:5, 
        padding:5
    },
    view_style: {
        marginTop: 12, marginLeft: 10, marginRight: 10,
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
    dropdown_style: { margin: 10 },

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