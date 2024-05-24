import React,{Fragment}from "react";
import {  View,StyleSheet,Text,Dimensions,FlatList,TouchableOpacity,Pressable,Image ,Modal,TouchableWithoutFeedback,Keyboard, Alert,SafeAreaView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressLoader from 'rn-progress-loader';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appbar } from 'react-native-paper';
import { openDatabase } from 'react-native-sqlite-storage';
import DeviceInfo from 'react-native-device-info'
import DateTimePicker from 'react-native-modal-datetime-picker';
import axios from "axios";
import moment from 'moment';
import { SearchBar } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {ImageBackground} from 'react-native';
import {SCLAlert, SCLAlertButton} from 'react-native-scl-alert';
import {TextInput} from 'react-native-element-textinput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import { TextInput as RNTextInput } from 'react-native';

var db = openDatabase({ name: 'CMMS.db' });
let Baseurl,Site_cd,LoginID,EmpName,EmpID,EmpPhone,EmpWorkGrp,dvc_id,dft_mst_mr_approval;

const deviceWidth = Dimensions.get('screen').width;
const deviceHeight = Dimensions.get('screen').height;

const DismissKeyboard = ({children}) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
);

const StockReturn = ({navigation,route}) => {

  const[spinner, setspinner]= React.useState(false)


  const _goBack = () => {

    if(route.params.Screenname === 'StockReturn'){
        navigation.navigate('MainTabScreen')
    }
      
  }
  var valid = false;

  const[MaterialRequestNoList, setMaterialRequestNoList]= React.useState([])
  const[FilteredDataSource, setFilteredDataSource]= React.useState([])
  const[modalVisible, setmodalVisible ] = React.useState(false); 
  const[search, setSearch] = React.useState('');

  const[Box_modalVisible, setBox_modalVisible ] = React.useState(false); 
  const[Box_MaterialRequestNo, setBox_MaterialRequestNo]= React.useState("") 
  const[Box_RequestID, setBox_RequestID]= React.useState("") 
  const [isDatepickerVisible, setDatePickerVisibility] = React.useState(false);
  const[Box_From, setBox_From]= React.useState("") 
  const[Box_To, setBox_To]= React.useState("") 
  const [textvalue, settextvalue] = React.useState("");

  const[MaterialRequestNo, setMaterialRequestNo]= React.useState("") 
  const[SRRasieDate, setSRRasieDate]= React.useState("") 
  
  const[Cost_Center, setCost_Center]= React.useState(""); 
  const[Account_no, setAccount_no]= React.useState(""); 
  const[Employee, setEmployee]= React.useState(""); 
  const[Issuetonamelist, setIssuetonamelist]= React.useState(); 

  const [Dropdown_data, setDropdown_data] = React.useState([]);
  const [DropDownFilteredData, setDropDownFilteredData] = React.useState([]);
  const [DropDown_modalVisible, setDropDown_modalVisible] = React.useState(false);
  
  const[ReturnFrom, setReturnFrom]= React.useState(""); 
  const[Remark, setRemark]= React.useState("");
  const[Remark_height, setRemark_height] = React.useState(0);

  const[mst_Rowid, setmst_Rowid]= React.useState("");
  const[wo_no, setwo_no]= React.useState("");
  const[assetno, setassetno]= React.useState("");
  const[mr_status, setmr_status]= React.useState("");

  const[StockIssueList, setStockIssueList]= React.useState([]); 
  const[TotalMRLineNo, setTotalMRLineNo]= React.useState("0"); 
  const [isRender,setisRender]=React.useState(false);

  const[StocK_LocationmodalVisible, setStocK_LocationmodalVisible ] = React.useState(false); 
  const[StockLocationList, setStockLocationList]= React.useState([]);
  const[FilteredDataStockLocation, setFilteredDataStockLocation]= React.useState([]);
  const[StockIssue_RowID, setStockIssue_RowID]= React.useState(""); 

  const [Editable, setEditable] = React.useState(false); 
  const [Visible, setVisible] = React.useState(false);

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

    


    React.useEffect(() => {

        const focusHander = navigation.addListener('focus', ()=>{

            fetchData()
            

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
        dft_mst_mr_approval = await AsyncStorage.getItem('dft_mst_mr_approval');
        console.log("WORK DATA:  "+ dft_mst_mr_approval);


        var date = moment().format('YYYY-MM-DD HH:mm');
        setSRRasieDate(date);

        db.transaction(function (txn) {

            txn.executeSql( 'SELECT * FROM employee', [], (tx, { rows }) => { setIssuetonamelist(rows.raw())});
        })
    
       
    }



    //MR_NO SEARCH BOX 
    const open_MR_box= () =>{

      setBox_MaterialRequestNo('')
      setBox_RequestID('')
      setBox_From('')
      setBox_To('')

      setBox_modalVisible(true);
     
    }

    //MR_NO SEARCH BOX 
    const MR_box_retrieve= () =>{

      if(!Box_MaterialRequestNo && !Box_RequestID && !Box_From && !Box_To){

          setAlert(true, 'danger', 'Please select at least one criteria to search', 'OK');

      }else{

        get_materal_requestlist()

      }

      
     
    }

    const get_materal_requestlist =(async()=>{

      let Box_RequestID_split

      if (!Box_RequestID) {
          Box_RequestID_split = '';
      } else {
          Employee_split = Box_RequestID.split(':');
          Box_RequestID_split = Employee_split[0].trim();
      }

      try{

          console.log('get_materal_requestlist:',`${Baseurl}/get_material_return_list.php?site_cd=${Site_cd}&mtr_mst_mtr_no=${Box_MaterialRequestNo}&mtr_mst_requester=${Box_RequestID_split}&mtr_mst_req_date=${Box_From}&mtr_mst_req_to_date=${Box_To}`);
          const response = await axios.get(`${Baseurl}/get_material_return_list.php?site_cd=${Site_cd}&mtr_mst_mtr_no=${Box_MaterialRequestNo}&mtr_mst_requester=${Box_RequestID_split}&mtr_mst_req_date=${Box_From}&mtr_mst_req_to_date=${Box_To}`);
          //console.log("JSON DATA : " + response.data.data)
          if (response.data.status === 'SUCCESS') {
             
              //console.log('StockmasterDeatils: ',response.data.data)

              setMaterialRequestNoList(response.data.data)
              setFilteredDataSource(response.data.data)   
             
              setspinner(false);
              setmodalVisible(true);
  
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

    //MR_NO LIST FILTER
    const searchFilterFunction = (text) => {
        // Check if searched text is not blank
        if (text) {
          
          const newData = MaterialRequestNoList.filter(function (item) {
            
              const itemData = `${item.mtr_mst_mtr_no}`
          
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setFilteredDataSource(newData);
          setSearch(text);
        } else {
          // Inserted text is blank
          // Update FilteredDataSource with masterDataSource
          setFilteredDataSource(MaterialRequestNoList);
          setSearch(text);
        }
    };

    //MR_NO LIST
    const ItemView = ({ item }) => {

    let  org_date = moment(item.mtr_mst_org_date.date).format('yyyy-MM-DD HH:mm');
    let  req_date =moment(item.mtr_mst_req_date.date).format('yyyy-MM-DD HH:mm');

    return (
        // Flat List Item
        // <Text style={styles.itemStyle} onPress={() => getItem(item)}>
        //   {item.ast_mst_asset_no}
        //   {'.'}
        //   {item.ast_mst_asset_no.toUpperCase()}
        // </Text>

        <TouchableOpacity onPress={() => getItem(item)}>
            <View style={styles.item}>
        

                <View style={{flexDirection:"row",marginTop:10}}>
                    <View style={{flex:1}}>
                        <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Material Request No :</Text>
                    </View>
                    <View style={{flex:1}}>
                        <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{item.mtr_mst_mtr_no}</Text>
                    </View>
                </View>

                <View style={{flexDirection:"row",marginTop:5}}>
                    <View style={{flex:1}}>
                        <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Cost Center :</Text>
                    </View>
                    <View style={{flex:1}}>
                        <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{item.mtr_mst_costcenter}</Text>
                    </View>
                </View>

                <View style={{flexDirection:"row",marginTop:5}}>
                <View style={{flex:1}}>
                    <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Name :</Text>
                </View>
                <View style={{flex:1}}>
                    <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{item.Requester_Name}</Text>
                </View>
                </View>

                <View style={{flexDirection:"row",marginTop:5}}>
                <View style={{flex:1}}>
                    <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Requester ID :</Text>
                </View>
                <View style={{flex:1}}>
                    <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{item.mtr_mst_requester}</Text>
                </View>
                </View>

                <View style={{flexDirection:"row",marginTop:5}}>
                <View style={{flex:1}}>
                    <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Origination Date :</Text>
                </View>

                <View style={{flex:1}}>
                    <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{org_date}</Text>
                </View>
                </View>

                <View style={{flexDirection:"row",marginTop:5}}>
                <View style={{flex:1}}>
                    <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Required Date :</Text>
                </View>
                <View style={{flex:1}}>
                    <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{req_date}</Text>
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

    //SELECT MR_NO LIST
    const getItem = (item) => {
        // Function for click on an item
        setmodalVisible(false)
        setBox_modalVisible(false);
        //alert('Id : ' + item.mtr_mst_mtr_no ); 

        setMaterialRequestNo(item.mtr_mst_mtr_no);
        setCost_Center(item.mtr_mst_costcenter);
        setAccount_no(item.mtr_mst_account);
        setEmployee(EmpID+':'+EmpName);
        setReturnFrom(item.mtr_mst_requester+':'+item.Requester_Name);

        setmst_Rowid(item.RowID)
        setwo_no(item.mtr_mst_wo_no)
        setassetno(item.mtr_mst_assetno)
        setmr_status(item.mtr_mst_mr_status)

        get_materiallist(item.mtr_mst_mtr_no);
        
    };

    const get_materiallist =(async(mrno)=>{

        setspinner(true);
       try{

           console.log('URL',`${Baseurl}/get_material_returnlist_details.php?site_cd=${Site_cd}&itm_mtu_mtr_no=${mrno}`)

           const response = await axios.post(`${Baseurl}/get_material_returnlist_details.php?site_cd=${Site_cd}&itm_mtu_mtr_no=${mrno}`);
           //console.log("JSON DATA : " + response.data.data)
           if (response.data.status === 'SUCCESS') {
            //console.log("JSON DATA : " + response.data.data.length)
                if(response.data.data.length > 0){

                    //console.log('StockmasterDeatils: ',response.data.data)
                    setTotalMRLineNo(response.data.data.length)
                    setStockIssueList(response.data.data)
                    setVisible(true);
                    setspinner(false);

                   
                }else{
                    setTotalMRLineNo(0)
                    setStockIssueList([])
                    setVisible(false);
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

    //Issue Emp
    const select_dropdown = (data,type) => {


      if(type === 'Box_RequestID'){

          settextvalue('Request ID');
         
          setDropDownFilteredData(data);
          setDropdown_data(data);
          setDropDown_modalVisible(!DropDown_modalVisible);

      }else if(type === 'ReturnFrom'){

        if(!MaterialRequestNo){

          setAlert(true, 'danger', 'Please select material request no', 'OK');
         
      }else{
          
          settextvalue('Return From');

          setDropDownFilteredData(data);
          setDropdown_data(data);
          setDropDown_modalVisible(!DropDown_modalVisible);
      }

      }

        

    }
    const Issue_emp_ItemView = ({ item }) => {

    return (
    

        <TouchableOpacity onPress={() => Issue_emp_getItem(item)}>
            <View style={styles.dropdown_style}>
                <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
                    <View style={{flex: 1}}>
                        <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start'}}> ID : </Text>
                    </View>
                    <View style={{flex: 4}}>
                        <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.emp_mst_empl_id} </Text>
                    </View>
                </View>

                <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
                    <View style={{flex: 1}}>
                        <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start'}}> Name : </Text>
                    </View>
                    <View style={{flex: 4}}>
                        <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.emp_mst_name} </Text>
                    </View>
                </View>

                <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
                    <View style={{flex: 1}}>
                        <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Title : </Text>
                    </View>
                    <View style={{flex: 4}}>
                        <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.emp_mst_title} </Text>
                    </View>
                </View>
                </View>
        </TouchableOpacity>   

        
    );
    };
    
    const Issue_emp_ItemSeparatorView = () => {
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

    const Issue_emp_getItem = (item) => {
        // Function for click on an item

        if(textvalue === 'Request ID'){
          setBox_RequestID(item.emp_mst_empl_id +':'+ item.emp_mst_name)
        }else if(textvalue === 'Return From'){
          setReturnFrom(item.emp_mst_empl_id +':'+ item.emp_mst_name)
        }
        setDropDown_modalVisible(false)
       
        setSearch('')
        
    };

    const DropDown_searchFilterFunction = text => {
        // Check if searched text is not blank
    
       

        if (text) {
          let newData;
    
          newData = Dropdown_data.filter(function (item) {
            const itemData = `${item.emp_mst_empl_id.toUpperCase()},
              ,${item.emp_mst_title.toUpperCase()}
              ,${item.emp_mst_name.toUpperCase()})`;
  
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
    
          setDropDownFilteredData(newData);
          setSearch(text);
        } else {
          // Inserted text is blank
          // Update FilteredDataSource with masterDataSource
          setDropDownFilteredData(Dropdown_data);
          setSearch(text);
        }
    };
    
    //Stock_Issue 
    const StockIssue_ItemView = ({ item }) => {


        let us_qty;
        if(item.itm_mtu_used_qty == '.0000'){
          us_qty = '0'
         }else{
          us_qty = item.itm_mtu_used_qty
         }

        
         let val_us_qty = parseFloat(us_qty).toFixed(2);

        return (
           
                <View style={styles.item}>
                    <View style={{marginTop:10}}>

                        <View style={{flex:1}}>
                            <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >MR Line No : {item.itm_mtu_mtr_lineno}</Text>
                        </View>

                        <View style={{ height: 0.5, width: '100%', backgroundColor: '#C8C8C8',marginTop:10,marginBottom:10 }} />

                        <View style={{flex:1}}>
                            <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12}} >Stock No : {item.itm_mtu_stockno}</Text>
                        </View>

                        <View style={{flex:1}}>
                            <Text placeholder="Test" style={{color:'#808080',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12,marginTop:5}} >Stock Location : {item.itm_mtu_stk_locn}</Text>
                        </View>

                        <View style={{flex:1}}>
                            <Text placeholder="Test" style={{color:'#808080',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12,marginTop:5}} >Description : {item.itm_mtu_desc}</Text>
                        </View>


                        <View style={{flex:1}}>
                            <Text placeholder="Test" style={{color:'#FF5733',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12,marginTop:5,}} >UOM : {item.itm_mtu_used_uom}</Text>
                        </View>

                    </View>
    
                   

                    <View>
                        <View style={{marginTop:5}}>

                            <View style={{flexDirection:"row",justifyContent:'space-between',alignItems:'center'}}>

                                
                                <View style={{flex:1,flexDirection:"row"}}>
                                    <View >
                                        <Text placeholder="Test" style={{flex:1,color:'#FF5733',fontWeight: 'bold',fontSize:12}} >Used Qty :</Text>
                                    </View>

                                    <View>
                                        <Text placeholder="Test" style={{flex:1,color:'#000',fontSize:12}} >{val_us_qty}</Text>
                                    </View>                            
                                </View>

                                <View style={{flex:1,justifyContent:'space-around'}}>
                                    {/* <TextInput
                                        value={item.return_qty}
                                        style={[ styles.input, { height: Platform.OS === 'ios' ? 50 : 50}]}
                                        inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#808080'}]}
                                        labelStyle={styles.labelStyle}
                                        placeholderStyle={{fontSize: 12, color: '#0096FF'}}
                                        label="Return Quantity"
                                        keyboardType="numeric"
                                        focusColor="#808080"
                                        editable={!Editable}
                                        selectTextOnFocus={!Editable}
                                        onChangeText={text => { changetextremark(item.RowID,text) }}
                                        renderRightIcon={() =>
                                            Editable ? (
                                            ''
                                            ) : (
                                            <AntDesign
                                                style={styles.icon}
                                                color={'black'}
                                                name={item.return_qty ? '' : ''}
                                                size={22}
                                            />
                                            )
                                        }
                                    />                    */}


                                    <View style={{ flexDirection: 'row'}}>
                                        <TouchableOpacity style={{borderColor: 'gray', borderRadius: 1, borderWidth: 1,backgroundColor:'#566573',height:50,justifyContent: 'center',padding:5}} 
                                            onPress={()=>decrement(item.RowID)}>
                                            <Ionicons
                                                name="remove-outline"
                                                color="#FDFEFE"
                                                size={25}
                                                
                                            />
                                        </TouchableOpacity>

                                        <RNTextInput
                                            
                                            value={item.return_qty}
                                            key={item.RowID}
                                            style={{flex: 1, height:50, borderColor: 'gray', borderRadius: 1, borderWidth: 1,}}
                                            keyboardType="numeric"
                                            placeholder="Quantity"
                                            placeholderTextColor="#0096FF"
                                            textAlign="center"
                                            onChangeText={(text) => {
                                            if (text===''|| text.match(/^\d+(\.\d{0,2})?$/)){

                                                item.return_qty = text
                                                changetextremark(item.RowID,text)
                                            
                                            }
                                            }}
                                                
                                        />

                                        <TouchableOpacity style={{borderColor: 'gray', borderRadius: 1, borderWidth: 1,backgroundColor:'#566573',height:50,justifyContent: 'center',padding:5}} 
                                            onPress={()=>increment(item.RowID)}>
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
                    </View>
                </View>
            
        );
    };
    
    const StockIssue_ItemSeparatorView = () => {
        return (
            // Flat List Item Separator
            <View style={{ height: 0.5, width: '100%', backgroundColor: '#C8C8C8' }} />
        );
    };

    const changetextremark = (id, value) => {
        console.log('TextRemark RowID', id);
        console.log('TextRemark Value',  value.replace(/[^0-9]/g, ''));

        // var text_remark_value;
        // if (!value) {
        //   text_remark_value = "";
        // } else {
        //   text_remark_value = value.replace(/[^0-9]/g, '');
        // }
        StockIssueList.map(item => {
          if (item.RowID == id) {
            item.return_qty = value;
            return item;
          }
          return item;
        });
    
        setisRender(!isRender)
    };

    const increment = (key) => {

        console.log('increment key :',key)
    
        // Increment the value by 0.01 (or any other desired step)
        //setValue((prevValue) => (parseFloat(prevValue )+ 1).toFixed(2));
    
        
    
        StockIssueList.map(item =>{
    
            if(item.RowID == key){
    

                const numberValue = Number(item.return_qty);

                if (item.return_qty > 0) {
                    
                    
                    if (Number.isInteger(numberValue)) {

                        item.return_qty = (parseInt(item.return_qty)+ 1).toString();

                    } else if (typeof numberValue === 'number') {
                        item.return_qty = (parseFloat(item.return_qty )+ 1).toFixed(2);

                    } 

    
                }else{
                    console.log('increment else :',item.return_qty)
                    if (Number.isInteger(numberValue)) {

                        item.return_qty = (parseInt(0)+ 1).toString();

                    } else if (typeof numberValue === 'number') {
                        item.return_qty = (parseFloat(0)+ 1).toFixed(2);

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
    
        StockIssueList.map(item =>{
    

            const numberValue = Number(item.return_qty);

            if(item.RowID == key){
    
    
                if (item.return_qty <= 0 || item.return_qty <= 1) {
                    console.log('decrement if :',item.return_qty)
                    
    
                }else{
                    console.log('decrement else :',item.return_qty)
                    if (Number.isInteger(numberValue)) {

                        item.return_qty = (parseInt(item.return_qty)- 1).toString();

                    } else if (typeof numberValue === 'number') {
                        item.return_qty = (parseFloat(item.return_qty)- 1).toFixed(2);

                    } 
                }
    
    
                //item.qty_needed = (parseFloat(item.qty_needed )- 1).toFixed(2)
    
                return item;
    
            }
    
        })
        setisRender(!isRender)
    };


    //BUTTON EDIT 
    const get_button =()=>{

        var date = moment().format('YYYY-MM-DD HH:mm');

        if(!MaterialRequestNo){

            setAlert(true, 'danger', 'Please select material request no', 'OK');

        }else{

            // if(!Remark){

            //     setAlert(true, 'danger', 'Please enter the remark', 'OK');
    
            // }else{
                
             
                
                
    
            // }


            let EmployeeName_split, IssueName_split

            if (!Employee) {
                EmployeeName_split = '';
            } else {
                Employee_split = Employee.split(':');
                EmployeeName_split = Employee_split[0].trim();
            }

            if (!ReturnFrom) {
                EmployeeName_split = '';
            } else {
                Issue_split = ReturnFrom.split(':');
                IssueName_split = Issue_split[0].trim();
            }

            var List =[]
          StockIssueList.map(item =>{

            if(item.return_qty == '' || item.return_qty == null){

                console.log('IF LOOP');

            }else{

                console.log('else LOOP');

                  List.push({
                      itm_mtu_stockno:item.itm_mtu_stockno,
                      itm_mtu_desc: item.itm_mtu_desc,
                      itm_mtu_stk_locn: item.itm_mtu_stk_locn,
                      itm_mtu_used_uom: item.itm_mtu_used_uom,
                      itm_mtu_used_qty: item.itm_mtu_used_qty,
                      itm_mtu_serial_no: item.itm_mtu_serial_no,
                      itm_mtu_mtr_no: item.itm_mtu_mtr_no,
                      itm_mtu_mtr_lineno: item.itm_mtu_mtr_lineno,
                      itm_mtu_wo: item.itm_mtu_wo,
                      itm_mtu_assetno: item.itm_mtu_assetno,

                      itm_mtu_chg_costcenter: item.itm_mtu_chg_costcenter,
                      itm_mtu_chg_account: item.itm_mtu_chg_account,

                      itm_mtu_crd_costcenter: item.itm_mtu_crd_costcenter,
                      itm_mtu_crd_account: item.itm_mtu_crd_account,

                      itm_mtu_po_costcenter: item.itm_mtu_po_costcenter,
                      itm_mtu_po_account: item.itm_mtu_po_account,

                      itm_mtu_po_crd_costcenter: item.itm_mtu_po_crd_costcenter,
                      itm_mtu_po_crd_account: item.itm_mtu_po_crd_account,

                      itm_mtu_item_cost: item.itm_mtu_item_cost,
                      itm_mtu_mtc_id: item.itm_mtu_mtc_id,

                      RowID: item.RowID,
                      ret_qty: item.return_qty,




                })
            }
          })


          if(List.length>0){

              var timeDetails = {
                  Header : [{
                      site_cd:Site_cd,
                      return_date: date,
                      mst_empl_id: EmployeeName_split,
                      LOGINID:LoginID,
                      isu_empl_id: IssueName_split,
                      remark: Remark
                  }],
                  Details : List
              }

              //console.log(JSON.stringify(timeDetails))
              console.log(JSON.stringify(timeDetails))

              update_stock_return(timeDetails)

          }else{
              setAlert(true, 'danger', 'Please enter Return Quantity', 'OK');
          }


        }

       
    };


    const update_stock_return =(async(data)=>{
        setspinner(true);
        try{


            const response = await axios.post(`${Baseurl}/update_stock_return.php?`,
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
        }
    };

    const History = () => {

        navigation.navigate('StockIssueHistory',{ Screenname:route.params.Screenname })
        
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
            setBox_From(select_from);
        } else if (Type === 'to') {

            let select_to = moment(date).format('yyyy-MM-DD');
            setBox_To(select_to);
        } 
        hideDatePicker();
    };

    //QR Code Scan
    const onSuccess = e => {

        console.log(JSON.stringify(e));
    
        const check = e.data.substring(0, 4);
        console.log('scanned data' + e.data);

        get_materal_requestlist_scan(e.data);

        setresult(e);
        setscan(false);
        setScanResult(false);
        setshowqrcode(false);

    };

    const get_materal_requestlist_scan =(async(MaterialRequestNo)=>{

        
        try{
  
            console.log('get_materal_requestlist:',`${Baseurl}/get_material_return_list.php?site_cd=${Site_cd}&mtr_mst_mtr_no=${MaterialRequestNo}&mtr_mst_requester=&mtr_mst_req_date=&mtr_mst_req_to_date=`);
            const response = await axios.get(`${Baseurl}/get_material_return_list.php?site_cd=${Site_cd}&mtr_mst_mtr_no=${MaterialRequestNo}&mtr_mst_requester=&mtr_mst_req_date=&mtr_mst_req_to_date=`);
            //console.log("JSON DATA : " + response.data.data)
            if (response.data.status === 'SUCCESS') {
               
                //console.log('StockmasterDeatils: ',response.data.data)
  
                setMaterialRequestNoList(response.data.data)
                setFilteredDataSource(response.data.data)   
               
                setspinner(false);
                setmodalVisible(true);
    
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
    
    const activeQR = () => {
    setscan(true);
    };

    const scanAgain = () => {
    setscan(true), setScanResult(false);
    };

    const scanAgain2 = () => {
    setscan(false), setScanResult(false);
    };

    const OpenQRCode = () => {
    setshowqrcode(true);
    scanAgain(true);
    };



  return (
    <DismissKeyboard>
        <SafeAreaProvider>
            <Appbar.Header style={{backgroundColor:"#42A5F5"}}>
                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between'}}>
                    <Pressable onPress={_goBack}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <FontAwesome
                            name="angle-left"
                            color="#fff"
                            size={55}
                            style={{marginLeft: 15, marginBottom: 5}}
                        />
                        <Text style={{ fontSize: 20, justifyContent: 'center', textAlign: 'center', color: '#fff', fontWeight: 'bold', marginLeft: 15, }}> {'Stock Return'} </Text>
                    </View>
                    </Pressable>

                    <View style={{flexDirection:'row',alignItems:'center'}}>

                        <Pressable onPress={() => History()}>

                        <View style={{justifyContent:'center',alignItems:'center'}}>

                            <Text style={{fontSize:12, justifyContent:'center',textAlign:'center',color:'#fff',fontWeight: 'bold',marginRight:25}}>History</Text> 
                        
                            <FontAwesome 
                                name="history"
                                color='#fff'
                                size={25}
                                style={{marginRight:20,marginBottom:5}}
                            
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


            <Modal 
                animationType="slide"
                transparent={true}
                visible={Box_modalVisible}
                onRequestClose={()=>{ setBox_modalVisible(!Box_modalVisible) }}
            >             


                <Modal 
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={()=>{
                        Alert.alert("Closed")
                        setmodalVisible(!modalVisible)
                    }}>             

                    <View style={styles.model2_cardview}>

                        <View style={{flex:1,margin:20,backgroundColor:'#FFFFFF'}}>

                            <View style={{flexDirection:'row',alignItems:'center', height: 50}}>
                                <Text style={{flex:1,fontSize:15,justifyContent:'center',textAlign: 'center', color: '#000', fontWeight: 'bold'}}>Search Approved MR Number</Text> 
                                <Ionicons 
                                    name="close"
                                    color="red"
                                    size={30}
                                    style={{marginEnd: 15}}
                                    onPress={()=>setmodalVisible(false)}
                                />                        
                            </View>

                            <SearchBar
                                lightTheme
                                round
                                inputStyle={{color:'#000'}}
                                inputContainerStyle={{backgroundColor: '#FFFF'}}
                                searchIcon={{ size: 24 }}
                                onChangeText={(text) => searchFilterFunction(text)}
                                onClear={(text) => searchFilterFunction('')}
                                placeholder="Search here..."
                                value={search}
                            />

                            <FlatList
                                data={FilteredDataSource}
                                keyExtractor={(item, index) => index.toString()}
                                showsVerticalScrollIndicator ={false}
                                showsHorizontalScrollIndicator={false}
                                ItemSeparatorComponent={ItemSeparatorView}
                                renderItem={ItemView}
                            />

                        </View>

                    </View>


                </Modal>

                <Modal 
                    animationType="slide"
                    transparent={true}
                    visible={DropDown_modalVisible}
                    onRequestClose={()=>{
                        Alert.alert("Closed")
                        setDropDown_modalVisible(!DropDown_modalVisible)
                    }}>             

                    <View style={styles.model2_cardview}>

                        <View style={{flex:1,margin:20,backgroundColor:'#FFFFFF'}}>

                            <View style={{flexDirection:'row',alignItems:'center', height: 50}}>
                                <Text style={{flex:1,fontSize:15,justifyContent:'center',textAlign: 'center', color: '#000', fontWeight: 'bold'}}>Issue to name</Text> 
                                <Ionicons 
                                    name="close"
                                    color="red"
                                    size={30}
                                    style={{marginEnd: 15}}
                                    onPress={()=>setDropDown_modalVisible(false)}
                                />                        
                            </View>

                            <SearchBar
                                lightTheme
                                round
                                inputStyle={{color:'#000'}}
                                inputContainerStyle={{backgroundColor: '#FFFF'}}
                                searchIcon={{ size: 24 }}
                                onChangeText={(text) => DropDown_searchFilterFunction(text)}
                                onClear={(text) => DropDown_searchFilterFunction('')}
                                placeholder="Search here..."
                                value={search}
                            />

                            <FlatList
                                data={DropDownFilteredData}
                                keyExtractor={(item, index) => index.toString()}
                                showsVerticalScrollIndicator ={false}
                                showsHorizontalScrollIndicator={false}
                                ItemSeparatorComponent={Issue_emp_ItemSeparatorView}
                                renderItem={Issue_emp_ItemView}
                            />

                        </View>

                    </View>


                </Modal>
            <DismissKeyboard>
            <View style={styles.model2_cardview}>

                <DateTimePicker isVisible={isDatepickerVisible} mode="date" locale="en_GB" onConfirm={handleConfirm} onCancel={hideDatePicker} />

                <View style={{flex:1,margin:20,backgroundColor:'#FFFFFF'}}>

                    <View style={{flexDirection:'row',alignItems:'center', height: 50}}>
                        <Text style={{flex:1,fontSize:15,justifyContent:'center',textAlign: 'center', color: '#000', fontWeight: 'bold'}}> MR Search</Text> 
                        <Ionicons name="close" color="red" size={30} style={{marginEnd: 15}} onPress={()=>setBox_modalVisible(false)} />                        
                    </View>

                    <View style={[styles.view_style,{marginBottom:5}]}>
                        <TextInput
                            value={Box_MaterialRequestNo}
                            style={[ styles.input, { height: Platform.OS === 'ios' ? 50 : 50}]}
                            multiline
                            inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}]}
                            labelStyle={styles.labelStyle}
                            placeholderStyle={{fontSize: 15, color: '#0096FF'}}
                            label="Material Request No"
                            placeholderTextColor="gray"
                            clearButtonMode="always"
                            editable={!Editable}
                            selectTextOnFocus={!Editable}
                            onChangeText={text => { setBox_MaterialRequestNo(text) }}
                            renderRightIcon={() =>
                                Editable ? (
                                ''
                            ) : (
                                <AntDesign
                                    style={styles.icon}
                                    name={Box_MaterialRequestNo ? 'close' : ''}
                                    size={20}
                                    disable={true}
                                    onPress={() => Box_MaterialRequestNo ? setBox_MaterialRequestNo('') : '' }
                                />
                            )
                            }
                        />
                    </View>

                    <View style={[ styles.view_style,{marginBottom:5}]}>
                        <Pressable onPress={() => (select_dropdown(Issuetonamelist,'Box_RequestID'))}>
                            <View pointerEvents={'none'}>
                                <TextInput
                                    value={Box_RequestID}
                                    style={[ styles.input, { height: Platform.OS === 'ios' ? 50 : 50}]}
                                    inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}]}
                                    labelStyle={styles.labelStyle}
                                    placeholderStyle={{ fontSize: 13, color: '#0096FF'}}
                                    label="Request ID"
                                    editable={false}
                                    selectTextOnFocus={false}
                                    renderRightIcon={() =>
                                        Editable ? (
                                        ''
                                        ) : (
                                        <AntDesign
                                            style={styles.icon}
                                            color={'black'}
                                            name={Box_RequestID ? 'search1' : 'search1'}
                                            size={22}
                                        />
                                        )
                                    }
                                />
                            </View>
                        </Pressable>
                    </View>

                    <View style={{flex:1,flexDirection: 'row', justifyContent: 'space-around' }}>

                        {/* From Date T8567005 */}
                        <View style={[styles.view_style,{flex:1}]}>
                            <Pressable onPress={() => showDatePicker('from') } >
                                <View pointerEvents={'none'}>
                                <TextInput
                                    value={Box_From}
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
                        <View style={[styles.view_style,{flex:1}]}>
                            <Pressable
                                onPress={() => showDatePicker('to') }>
                                <View pointerEvents={'none'}>
                                <TextInput
                                    value={Box_To}
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

                    <View style={{flexDirection:'row', height:50, justifyContent: 'center', alignItems: 'center'}} >
                    <TouchableOpacity style={{ flex: 1,height:50,backgroundColor:'#8BC34A', alignItems:'center',justifyContent:'center'}} 
                        onPress={MR_box_retrieve}>
                        <Text style={{color:'white', fontSize: 16}}>RETRIEVE</Text>
                    </TouchableOpacity>            
                    </View>
                </View>

                

            </View>
            </DismissKeyboard>

            </Modal>

            <Modal 
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={()=>{
                    Alert.alert("Closed")
                    setmodalVisible(!modalVisible)
                }}>             

                <View style={styles.model2_cardview}>

                    <View style={{flex:1,margin:20,backgroundColor:'#FFFFFF'}}>

                        <View style={{flexDirection:'row',alignItems:'center', height: 50}}>
                            <Text style={{flex:1,fontSize:15,justifyContent:'center',textAlign: 'center', color: '#000', fontWeight: 'bold'}}>Search Approved MR Number</Text> 
                            <Ionicons 
                                name="close"
                                color="red"
                                size={30}
                                style={{marginEnd: 15}}
                                onPress={()=>setmodalVisible(false)}
                            />                        
                        </View>

                        <SearchBar
                            lightTheme
                            round
                            inputStyle={{color:'#000'}}
                            inputContainerStyle={{backgroundColor: '#FFFF'}}
                            searchIcon={{ size: 24 }}
                            onChangeText={(text) => searchFilterFunction(text)}
                            onClear={(text) => searchFilterFunction('')}
                            placeholder="Search here..."
                            value={search}
                        />

                        <FlatList
                            data={FilteredDataSource}
                            keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator ={false}
                            showsHorizontalScrollIndicator={false}
                            ItemSeparatorComponent={ItemSeparatorView}
                            renderItem={ItemView}
                        />

                    </View>

                </View>


            </Modal>

            <Modal 
                animationType="slide"
                transparent={true}
                visible={DropDown_modalVisible}
                onRequestClose={()=>{
                    Alert.alert("Closed")
                    setDropDown_modalVisible(!DropDown_modalVisible)
                }}>             

                <View style={styles.model2_cardview}>

                    <View style={{flex:1,margin:20,backgroundColor:'#FFFFFF'}}>

                        <View style={{flexDirection:'row',alignItems:'center', height: 50}}>
                            <Text style={{flex:1,fontSize:15,justifyContent:'center',textAlign: 'center', color: '#000', fontWeight: 'bold'}}>Issue to name</Text> 
                            <Ionicons 
                                name="close"
                                color="red"
                                size={30}
                                style={{marginEnd: 15}}
                                onPress={()=>setDropDown_modalVisible(false)}
                            />                        
                        </View>

                        <SearchBar
                            lightTheme
                            round
                            inputStyle={{color:'#000'}}
                            inputContainerStyle={{backgroundColor: '#FFFF'}}
                            searchIcon={{ size: 24 }}
                            onChangeText={(text) => DropDown_searchFilterFunction(text)}
                            onClear={(text) => DropDown_searchFilterFunction('')}
                            placeholder="Search here..."
                            value={search}
                        />

                        <FlatList
                            data={DropDownFilteredData}
                            keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator ={false}
                            showsHorizontalScrollIndicator={false}
                            ItemSeparatorComponent={Issue_emp_ItemSeparatorView}
                            renderItem={Issue_emp_ItemView}
                        />

                    </View>

                </View>


            </Modal>

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
                            <TouchableOpacity onPress={scanAgain} style={styles.buttonScan}>
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

        

            
            <View style={{  flex: 1, marginBottom: 80}}>
                <KeyboardAwareScrollView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : null} 
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>   
                    <FlatList
                        ListHeaderComponent={

                            <View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'column'}}>  
                                <View style={styles.card_01}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                                        {/* Asset No */}
                                        <View style={[ styles.view_style,{flex: 1}]}>
                                            <Pressable
                                                onPress={() => (!Editable ? open_MR_box() : '')}
                                                onLongPress={() => setMaterialRequestNo('')}>
                                                <View pointerEvents={'none'}>
                                                    <TextInput
                                                        value={MaterialRequestNo}
                                                        style={[ styles.input, { height: Platform.OS === 'ios' ? 50 : 50}]}
                                                        inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}]}
                                                        labelStyle={styles.labelStyle}
                                                        placeholderStyle={{ fontSize: 13, color: '#0096FF'}}
                                                        label="Material Request No"
                                                        editable={false}
                                                        selectTextOnFocus={false}
                                                        renderRightIcon={() =>
                                                            Editable ? (
                                                            ''
                                                            ) : (
                                                            <AntDesign
                                                                style={styles.icon}
                                                                color={'black'}
                                                                name={MaterialRequestNo ? 'search1' : 'search1'}
                                                                size={22}
                                                            />
                                                            )
                                                        }
                                                    />
                                                </View>
                                            </Pressable>
                                        </View>

                                        <MaterialIcons
                                            name="qr-code-scanner"
                                            color={'#05375a'}
                                            size={45}
                                            style={{
                                            marginTop: Platform.OS === 'ios' ? 0 : 7,
                                            marginRight: 10,
                                            marginTop: 11,
                                            }}
                                            onPress={OpenQRCode}
                                        />
                                    </View>

                                    <View style={[styles.view_style,{marginTop:15}]}>
                                        <TextInput
                                            value={SRRasieDate}
                                            style={[ styles.input, { height: Platform.OS === 'ios' ? 50 : 50}]}
                                            inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#808080'}]}
                                            labelStyle={styles.labelStyle}
                                            placeholderStyle={{fontSize: 12, color: '#0096FF'}}
                                            label="Stock Return Date"
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
                                                    name={SRRasieDate ? '' : ''}
                                                    size={22}
                                                />
                                                )
                                            }
                                            
                                            
                                        />
                                    </View>

                                    <View style={{flexDirection:"row",marginTop:5}}>

                                        <View style={[styles.view_style,{flex:1}]}>
                                            <TextInput
                                                value={Cost_Center}
                                                style={[ styles.input, { height: Platform.OS === 'ios' ? 50 : 50}]}
                                                inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#808080'}]}
                                                labelStyle={styles.labelStyle}
                                                placeholderStyle={{fontSize: 12, color: '#0096FF'}}
                                                label="Cost Center"
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
                                                        name={Cost_Center ? '' : ''}
                                                        size={22}
                                                    />
                                                    )
                                                }
                                                
                                                
                                            />
                                        </View>

                                        <View style={[styles.view_style,{flex:1}]}>
                                            <TextInput
                                                value={Account_no}
                                                style={[ styles.input, { height: Platform.OS === 'ios' ? 50 : 50}]}
                                                inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#808080'}]}
                                                labelStyle={styles.labelStyle}
                                                placeholderStyle={{fontSize: 12, color: '#0096FF'}}
                                                label="Account No"
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
                                                        name={Account_no ? '' : ''}
                                                        size={22}
                                                    />
                                                    )
                                                }
                                                
                                                
                                            />
                                        </View>
                                        
                                    </View>

                                    <View style={[styles.view_style,{flex:1}]}>
                                        <TextInput
                                            value={Employee}
                                            style={[ styles.input, { height: Platform.OS === 'ios' ? 50 : 50}]}
                                            inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#808080'}]}
                                            labelStyle={styles.labelStyle}
                                            placeholderStyle={{fontSize: 12, color: '#0096FF'}}
                                            label="Employee Name"
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
                                                    name={Employee ? '' : ''}
                                                    size={22}
                                                />
                                                )
                                            }
                                            
                                            
                                        />
                                    </View>

                                    <View style={[ styles.view_style]}>
                                        <Pressable
                                            onPress={() => select_dropdown(Issuetonamelist,'ReturnFrom')}>
                                            <View pointerEvents={'none'}>
                                                <TextInput
                                                    value={ReturnFrom}
                                                    style={[ styles.input, { height: Platform.OS === 'ios' ? 50 : 50}]}
                                                    inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}]}
                                                    labelStyle={styles.labelStyle}
                                                    placeholderStyle={{ fontSize: 13, color: '#0096FF'}}
                                                    label="Return From"
                                                    editable={false}
                                                    selectTextOnFocus={false}
                                                    renderRightIcon={() =>
                                                        Editable ? (
                                                        ''
                                                        ) : (
                                                        <AntDesign
                                                            style={styles.icon}
                                                            color={'black'}
                                                            name={ReturnFrom ? 'search1' : 'search1'}
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
                                    <Text style={{fontSize:15, color:'#ffffffff',margin:5}}>Stock Return</Text>   
                                    <Text style={{fontSize:15,color:'#ffffffff',margin:5}}>Total MR Line: {TotalMRLineNo}</Text>                      
                                </View>

                            </View>
                            
                        }

                        numColumns={1}
                        data={StockIssueList}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator ={false}
                        showsHorizontalScrollIndicator={false}
                        ItemSeparatorComponent={StockIssue_ItemSeparatorView}
                        renderItem={StockIssue_ItemView}   
                        extraData={isRender}             
                    
                    />
                </KeyboardAwareScrollView>
            </View>
            

            <View style={ [styles.bottomView,{display: Visible ? 'flex' : 'none'}]} >
                <TouchableOpacity style={{ flex: 1,height:50,backgroundColor:'#8BC34A', alignItems:'center',justifyContent:'center'}} 
                    onPress={get_button}>
                    <Text style={{color:'white', fontSize: 16}}>RETURN </Text>
                </TouchableOpacity>

                
            </View>
        </SafeAreaProvider>
    </DismissKeyboard>
  )
}

export default StockReturn

const { width } = Dimensions.get('window');

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
    dropdown_style: { margin: 10 },

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