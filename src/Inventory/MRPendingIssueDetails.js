import React from "react";
import {  View,StyleSheet,Text,Dimensions,FlatList,TouchableOpacity,Pressable ,Modal,TouchableWithoutFeedback,Keyboard, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressLoader from 'rn-progress-loader';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appbar } from 'react-native-paper';
import { openDatabase } from 'react-native-sqlite-storage';
import DeviceInfo from 'react-native-device-info'
import axios from "axios";
import moment from 'moment';
import { SearchBar } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {SCLAlert, SCLAlertButton} from 'react-native-scl-alert';
import {TextInput} from 'react-native-element-textinput';

var db = openDatabase({ name: 'CMMS.db' });
let Baseurl,Site_cd,LoginID,EmpName,EmpID,EmpPhone,EmpWorkGrp,dvc_id,dft_mst_mr_approval;

const MRPendingIssueDetails = ({navigation,route}) => {

  const[spinner, setspinner]= React.useState(false)


  const _goBack = () => {

    navigation.navigate('MRPendingIssue',{
        Screenname:route.params.Screenname,
        Screentype:route.params.Screentype
    })
      
  }
  var valid = false;
  const [title, settitle] = React.useState('');

  const[MaterialRequestNoList, setMaterialRequestNoList]= React.useState([])
  const[FilteredDataSource, setFilteredDataSource]= React.useState([])
  const[modalVisible, setmodalVisible ] = React.useState(false); 
  const[search, setSearch] = React.useState('');

  const[MaterialRequestNo, setMaterialRequestNo]= React.useState("") 
  const[MRRasieDate, setMRRasieDate]= React.useState("") 
  
  const[Cost_Center, setCost_Center]= React.useState(""); 
  const[Account_no, setAccount_no]= React.useState(""); 
  const[Employee, setEmployee]= React.useState(""); 
  const[Issuetonamelist, setIssuetonamelist]= React.useState(); 

  const [Dropdown_data, setDropdown_data] = React.useState([]);
  const [DropDownFilteredData, setDropDownFilteredData] = React.useState([]);
  const [DropDown_modalVisible, setDropDown_modalVisible] = React.useState(false);
  
  const[Issuetoname, setIssuetoname]= React.useState(""); 
  const[Remark, setRemark]= React.useState("");
  const[Remark_height, setRemark_height] = React.useState(0);

  const[mst_Rowid, setmst_Rowid]= React.useState("");
  const[wo_no, setwo_no]= React.useState("");
  const[assetno, setassetno]= React.useState("");
  const[mr_status, setmr_status]= React.useState("");

  const[StockIssueList, setStockIssueList]= React.useState([]); 
  const[TotalMRLineNo, setTotalMRLineNo]= React.useState("0"); 

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

    React.useEffect(() => {

        const focusHander = navigation.addListener('focus', ()=>{

            fetchData()
            

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
        dft_mst_mr_approval = await AsyncStorage.getItem('dft_mst_mr_approval');
        console.log("WORK DATA:  "+ dft_mst_mr_approval);


        var date = moment().format('YYYY-MM-DD HH:mm');

        setMRRasieDate(date);

        db.transaction(function (txn) {

            txn.executeSql( 'SELECT * FROM employee', [], (tx, { rows }) => { setIssuetonamelist(rows.raw())});
        })

        if(route.params.Screentype === 'MR_Pending'){

            

            settitle('MR Pending For Issue Details')
        }else if(route.params.Screentype === 'MY_Pending'){

           

             settitle('My MR Pending For Issue Details')
        }



         console.log("WORK DATA 1:  "+ route.params.Selected_mtr_mst_mtr_no);
         console.log("WORK DATA 2:  "+ route.params.Selected_mtr_mst_costcenter);
         console.log("WORK DATA 3:  "+ route.params.Selected_mtr_mst_account);
         console.log("WORK DATA 4:  "+ route.params.Selected_mtr_mst_requester);
         console.log("WORK DATA: 5  "+ route.params.Selected_RowID);
         console.log("WORK DATA: 6 "+ route.params.Selected_mtr_mst_wo_no);
         console.log("WORK Selected_mtr_mst_assetno:  "+ route.params.Selected_mtr_mst_assetno);
         console.log("WORK Selected_mtr_mst_mr_status:  "+ route.params.Selected_mtr_mst_mr_status);
        
         
        setMaterialRequestNo(route.params.Selected_mtr_mst_mtr_no);
        setCost_Center(route.params.Selected_mtr_mst_costcenter);
        setAccount_no(route.params.Selected_mtr_mst_account);
        setEmployee(EmpID+':'+EmpName);
        setIssuetoname(route.params.Selected_mtr_mst_requester);

        setmst_Rowid(route.params.Selected_RowID)
        setwo_no(route.params.Selected_mtr_mst_wo_no)
        setassetno(route.params.Selected_mtr_mst_assetno)
        setmr_status(route.params.Selected_mtr_mst_mr_status)

        get_materiallist(route.params.Selected_mtr_mst_mtr_no);
        
    
    }

    const get_materiallist =(async(mrno)=>{

        setspinner(true);
       try{

           console.log('URL',`${Baseurl}/get_material_requestList.php?site_cd=${Site_cd}&mtr_no=${mrno}`)

           const response = await axios.post(`${Baseurl}/get_material_requestList.php?site_cd=${Site_cd}&mtr_no=${mrno}`);
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
    const select_dropdown = (data) => {

        if(!MaterialRequestNo){

            setAlert(true, 'danger', 'Please select material request no', 'OK');
           
        }else{
            setSearch('')
            setDropDownFilteredData(data);
            setDropdown_data(data);
            setDropDown_modalVisible(!DropDown_modalVisible);
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
        setDropDown_modalVisible(false)
        setIssuetoname(item.emp_mst_empl_id +':'+ item.emp_mst_name)
        
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


        let oh_qty,req_qty,rcv_qty;
        if(item.itm_loc_oh_qty == '.0000'){
            oh_qty = '0'
         }else{
            oh_qty = item.itm_loc_oh_qty
         }

         if(item.mtr_ls1_req_qty == '.0000'){
            req_qty = '0'
         }else{
            req_qty = item.mtr_ls1_req_qty
         }

         if(item.mtr_ls1_rcv_qty == '.0000'){
            rcv_qty = '0'
         }else{
            rcv_qty = item.mtr_ls1_rcv_qty
         }

         let val_oh_qty = parseFloat(oh_qty).toFixed(2);
         let val_req_qty = parseFloat(req_qty).toFixed(2);
         let val_rcv_qty = parseFloat(rcv_qty).toFixed(2);

        return (
            <TouchableOpacity>
                <View style={styles.item}>
                    <View style={{marginTop:10}}>

                        <View style={{flex:1}}>
                            <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >MR LineNo :{item.mtr_ls1_mtr_lineno}</Text>
                        </View>

                        <View style={{ height: 0.5, width: '100%', backgroundColor: '#C8C8C8',marginTop:10,marginBottom:10 }} />

                        <View style={{flex:1}}>
                            <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Stock No :{item.mtr_ls1_stockno}</Text>
                        </View>

                    </View>
    
                    <View style={{marginTop:10}}>
                        <Pressable
                            onPress={() => (!Editable ? open_STL(item) : '')}
                            onLongPress={() => setStockLocation('')}>
                            <View pointerEvents={'none'}>
                                <TextInput
                                    value={item.mtr_ls1_stk_locn}
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
                                            name={'search1'}
                                            size={22}
                                        />
                                        )
                                    }
                                />
                            </View>
                        </Pressable>
                        
                    </View>

                    <View style={{marginTop:10}}>
                        <View style={{flexDirection:"row"}}>
                            <View style={{width:'40%'}}>
                                <Text placeholder="Test" style={{color:'#8BC34A',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12}} >OH Quantity:</Text>
                            </View>

                            <View style={{flex:1}}>
                                <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000',fontSize:12}} >{val_oh_qty}</Text>
                            </View>
                        </View>

                        <View style={{flexDirection:"row",marginTop:5}}>
                            <View style={{width:'40%'}}>
                                <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12}} >Description:</Text>
                            </View>

                            <View style={{flex:1}}>
                                <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000',fontSize:12}} >{item.mtr_ls1_desc}</Text>
                            </View>
                        </View>

                        <View style={{flexDirection:"row",marginTop:5}}>
                            <View style={{width:'40%'}}>
                                <Text placeholder="Test" style={{color:'#FF5733',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:12}} >UOM:</Text>
                            </View>

                            <View style={{flex:1}}>
                                <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000',fontSize:12}} >{item.mtr_ls1_mtl_uom}</Text>
                            </View>
                        </View>

                        <View style={{marginTop:5}}>

                            <View style={{flexDirection:"row",justifyContent:'space-between',alignItems:'center'}}>

                                <View style={{flex:1,flexDirection:"row",justifyContent:'space-around'}}>
                                    <View>
                                        <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',fontSize:12}} >Required Qty:</Text>
                                    </View>

                                    <View>
                                        <Text placeholder="Test" style={{color:'#000',fontSize:12}} >{val_req_qty}</Text>
                                    </View>                            
                                </View>

                                <View style={{flex:1,flexDirection:"row",justifyContent:'space-around'}}>
                                    <View >
                                        <Text placeholder="Test" style={{color:'#FF5733',fontWeight: 'bold',fontSize:12}} >Actual Qty:</Text>
                                    </View>

                                    <View>
                                        <Text placeholder="Test" style={{color:'#000',fontSize:12}} >{val_rcv_qty}</Text>
                                    </View>                            
                                </View>

                                <View style={{flex:1,justifyContent:'space-around'}}>
                                    <TextInput
                                        value={item.issue_qty}
                                        style={[ styles.input, { height: Platform.OS === 'ios' ? 50 : 50}]}
                                        inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#808080'}]}
                                        labelStyle={styles.labelStyle}
                                        placeholderStyle={{fontSize: 12, color: '#0096FF'}}
                                        label="Issue Quantity"
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
                                                name={item.issue_qty ? '' : ''}
                                                size={22}
                                            />
                                            )
                                        }
                                    />                   
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>   
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
        console.log('TextRemark Value', value);

        var text_remark_value;
        if (!value) {
          text_remark_value = "";
        } else {
          text_remark_value = value;
        }
        StockIssueList.map(item => {
          if (item.RowID == id) {
            item.issue_qty = text_remark_value;
            return item;
          }
          return item;
        });
    
        
    };

    //Stock Location Onclick
    const open_STL= (item) =>{

        get_StockLoc_list(item);
        setStockIssue_RowID(item.RowID);

    }

    //Stock Location List API
    const get_StockLoc_list =(async(item)=>{

        setspinner(true);
       try{

           console.log('URL',`${Baseurl}/get_material_requestList_location.php?site_cd=${Site_cd}&mtr_no=${MaterialRequestNo}&stockno=${item.mtr_ls1_stockno}`)

           const response = await axios.post(`${Baseurl}/get_material_requestList_location.php?site_cd=${Site_cd}&mtr_no=${MaterialRequestNo}&stockno=${item.mtr_ls1_stockno}`);
           //console.log("JSON DATA : " + response.data.data)
           if (response.data.status === 'SUCCESS') {
            console.log("JSON DATA : " + response.data.data.length)
                if(response.data.data.length > 0){

                    //console.log('StockmasterDeatils: ',response.data.data)
                    setStockLocationList(response.data.data)
                    setFilteredDataStockLocation(response.data.data)
                    setspinner(false);
                    setStocK_LocationmodalVisible(true);

                }else{
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


    //Stock_Location POP_UP 
    const StockLoc_ItemView = ({ item }) => {

        let oh_qty,ac_qty;
        if(item.itm_loc_oh_qty == '.0000'){
            oh_qty = '0'
         }else{
            oh_qty = item.itm_loc_oh_qty
         }

         if(item.Ava_Qty == '.0000'){
            ac_qty = '0'
         }else{
            ac_qty = item.Ava_Qty
         }

         let val_oh_qty = parseFloat(oh_qty).toFixed(2);
         let val_ac_qty = parseFloat(ac_qty).toFixed(2);
    
        return (
    
            <TouchableOpacity onPress={() => StockLoc_getItem(item)}>

                <View style={styles.item}>
        
                    <View style={{flexDirection:"row",marginTop:10}}>
                        <View style={{flex:1}}>
                            <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Stock Location :</Text>
                        </View>
                        <View style={{flex:1}}>
                            <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{item.itm_loc_stk_loc}</Text>
                        </View>
                    </View>

                    <View style={{flexDirection:"row",marginTop:10}}>
                        <View style={{flex:1}}>
                            <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >OH Quantity :</Text>
                        </View>
                        <View style={{flex:1}}>
                            <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{val_oh_qty}</Text>
                        </View>
                    </View>

                    <View style={{flexDirection:"row",marginTop:10}}>
                        <View style={{flex:1}}>
                            <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Actual Quantity :</Text>
                        </View>
                        <View style={{flex:1}}>
                            <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#000'}} >{val_ac_qty}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>   
    
            
        );
    };
    
    const StockLoc_ItemSeparatorView = () => {
        return (
            // Flat List Item Separator
            <View style={{ height: 0.5, width: '100%', backgroundColor: '#C8C8C8' }} />
        );
    };


    //SELECT MR_NO LIST
    const StockLoc_getItem = (STitem) => {
        
        setStocK_LocationmodalVisible(false);

        StockIssueList.map(item=>{

            if(item.RowID === StockIssue_RowID){

                item.mtr_ls1_stk_locn = STitem.itm_loc_stk_loc
                item.itm_loc_oh_qty = STitem.itm_loc_oh_qty
                item.mtr_ls1_rcv_qty = STitem.Ava_Qty


                return item;
            }
            return item;
        });
       

        
        setStockIssueList(StockIssueList);
    };


    //BUTTON EDIT 
    const get_button =()=>{

        var date = moment().format('YYYY-MM-DD HH:mm');

        if(!MaterialRequestNo){

            setAlert(true, 'danger', 'Please select material request no', 'OK');

        }else{

            if(!Remark){

                setAlert(true, 'danger', 'Please enter the remark', 'OK');
    
            }else{
                
                StockIssueList.map(item =>{

                    if(item.issue_qty == '' || item.issue_qty == null){

                        console.log('IF LOOP');

                    }else{

                        let Req_qty,Rcv_qty,Issue_qty

                        if(item.mtr_ls1_req_qty == '.0000'){
                            Req_qty = '0'
                         }else{
                            Req_qty = item.mtr_ls1_req_qty
                         }
                
                         if(item.mtr_ls1_rcv_qty == '.0000'){
                            Rcv_qty = '0'
                         }else{
                            Rcv_qty = item.mtr_ls1_rcv_qty
                         }

                         if(item.issue_qty == '.0000'){
                            Issue_qty = '0'
                         }else{
                            Issue_qty = item.issue_qty
                         }
                
                         let val_req = parseFloat(Req_qty).toFixed(2);
                         let val_rcv = parseFloat(Rcv_qty).toFixed(2);
                         let val_issue = parseFloat(Issue_qty).toFixed(2);

                        
                         console.log('REQ',val_req);
                         console.log('RCV',val_rcv);
                         console.log('ISS',val_issue);



                         if(val_issue != 0){

                           

                            let is_qty = parseFloat(val_req) - parseFloat(val_rcv)
                            console.log('Not Zoro',parseFloat(is_qty));

                            if(parseFloat(is_qty) >= parseFloat(val_issue)){

                                console.log('Not Zoro if'); 

                                valid = true;

                            }else{

                                setAlert(true,'warning',`MR line No: ${item.mtr_ls1_mtr_lineno} Issue Quantity cannot be more then the required quantity`,'OK');
                                valid = false;
                                return

                            }

                         }else{

                            setAlert(true,'warning',`MR line No: ${item.mtr_ls1_mtr_lineno} Issue Quantity cannot be zoro the required quantity`,'OK');
                            valid = false;
                            return

                         }

                         

                    }
                })
                
    
            }


        }


        if(valid){

            let EmployeeName_split, IssueName_split

            if (!Employee) {
                EmployeeName_split = '';
            } else {
                Employee_split = Employee.split(':');
                EmployeeName_split = Employee_split[0].trim();
            }

            if (!Issuetoname) {
                EmployeeName_split = '';
            } else {
                Issue_split = Issuetoname.split(':');
                IssueName_split = Issue_split[0].trim();
            }

            //console.log(JSON.stringify(timecard))


            var List =[]
            StockIssueList.map(item =>{

                if(item.issue_qty == '' || item.issue_qty == null){

                    console.log('IF LOOP');

                }else{

                    List.push({
                        mtr_ls1_stockno:item.mtr_ls1_stockno,
                        mtr_ls1_desc: item.mtr_ls1_desc,
                        mtr_ls1_stk_locn: item.mtr_ls1_stk_locn,
                        crd_costcenter: item.mtr_ls1_chg_costcenter,
                        crd_account: item.mtr_ls1_chg_account,
                        mtr_ls1_mtr_lineno: item.mtr_ls1_mtr_lineno,
                        mtr_ls1_varchar1: item.mtr_ls1_varchar1,
                        issue_qty: item.issue_qty,
                        LslRow_ID: item.RowID,
                    })
                }
            })

            var timeDetails = {
                Header : [{
                    site_cd:Site_cd,
                    itm_mst_rowid: mst_Rowid,
                    mtr_no: MaterialRequestNo,
                    wo_no: wo_no,
                    mtr_mst_assetno: assetno,
                    issue_date: date,
                    mst_costcenter: Cost_Center,
                    mst_account: Account_no,
                    mst_empl_id: EmployeeName_split,
                    isu_empl_id: IssueName_split,
                    mr_status: mr_status,
                    remark: Remark
    
                }],
                Details : List
            }

            //console.log(JSON.stringify(timeDetails))
            console.log(JSON.stringify(timeDetails))

            update_stock_issue(timeDetails)

            
        }
       
    };


    const update_stock_issue =(async(data)=>{
        setspinner(true);
        try{


            const response = await axios.post(`${Baseurl}/update_stock_issue.php?`,
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


  return (
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
                    <Text style={{ fontSize: 20, justifyContent: 'center', textAlign: 'center', color: '#fff', fontWeight: 'bold', marginLeft: 15, }}> {title} </Text>
                </View>
                </Pressable>
            </View>
        </Appbar.Header>

        <ProgressLoader visible={spinner} isModal={true} isHUD={true} hudColor={"#808080"} color={"#FFFFFF"} />

        <SCLAlert theme={Theme} show={Show} title={Title}>
            <SCLAlertButton theme={Theme} onPress={() => One_Alret_onClick(Type)}> OK </SCLAlertButton>
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

        <Modal 
            animationType="slide"
            transparent={true}
            visible={StocK_LocationmodalVisible}
            onRequestClose={()=>{
                Alert.alert("Closed")
                setStocK_LocationmodalVisible(!StocK_LocationmodalVisible)
            }}>             

            <View style={styles.model2_cardview}>

                <View style={{flex:1,margin:20,backgroundColor:'#FFFFFF'}}>

                    <View style={{flexDirection:'row',alignItems:'center', height: 50}}>
                        <Text style={{flex:1,fontSize:15,justifyContent:'center',textAlign: 'center', color: '#000', fontWeight: 'bold'}}>Stock Location</Text> 
                        <Ionicons 
                            name="close"
                            color="red"
                            size={30}
                            style={{marginEnd: 15}}
                            onPress={()=>setStocK_LocationmodalVisible(false)}
                        />                        
                    </View>

                    <FlatList
                        data={FilteredDataStockLocation}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator ={false}
                        showsHorizontalScrollIndicator={false}
                        ItemSeparatorComponent={StockLoc_ItemSeparatorView}
                        renderItem={StockLoc_ItemView}
                    />

                </View>

            </View>


        </Modal>

        
        <View style={{  flex: 1, marginBottom: 80}}>
            <FlatList
                ListHeaderComponent={

                    <View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'column'}}>  
                        <View style={styles.card_01}>
                            <View style={[ styles.view_style]}>
                               
                                <View pointerEvents={'none'}>
                                    <TextInput
                                        value={MaterialRequestNo}
                                        style={[ styles.input, { height: Platform.OS === 'ios' ? 50 : 50}]}
                                        inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#808080'}]}
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
                                                name={MaterialRequestNo ? '' : ''}
                                                size={22}
                                            />
                                            )
                                        }
                                    />
                                </View>
                               
                            </View>

                            <View style={[styles.view_style,{marginTop:15}]}>
                                <TextInput
                                    value={MRRasieDate}
                                    style={[ styles.input, { height: Platform.OS === 'ios' ? 50 : 50}]}
                                    inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#808080'}]}
                                    labelStyle={styles.labelStyle}
                                    placeholderStyle={{fontSize: 12, color: '#0096FF'}}
                                    label="MR Raise Date"
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
                                            name={MRRasieDate ? '' : ''}
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
                                    onPress={() => (!Editable ? select_dropdown(Issuetonamelist) : '')}>
                                    <View pointerEvents={'none'}>
                                        <TextInput
                                            value={Issuetoname}
                                            style={[ styles.input, { height: Platform.OS === 'ios' ? 50 : 50}]}
                                            inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}]}
                                            labelStyle={styles.labelStyle}
                                            placeholderStyle={{ fontSize: 13, color: '#0096FF'}}
                                            label="Issue To Name"
                                            editable={false}
                                            selectTextOnFocus={false}
                                            renderRightIcon={() =>
                                                Editable ? (
                                                ''
                                                ) : (
                                                <AntDesign
                                                    style={styles.icon}
                                                    color={'black'}
                                                    name={Issuetoname ? 'search1' : 'search1'}
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
                            <Text style={{fontSize:15, color:'#ffffffff',margin:5}}>Stock Issue</Text>   
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
            
            />
        
        </View>
        

        <View style={ [styles.bottomView,{display: Visible ? 'flex' : 'none'}]} >
            <TouchableOpacity style={{ flex: 1,height:50,backgroundColor:'#8BC34A', alignItems:'center',justifyContent:'center'}} 
                onPress={get_button}>
                <Text style={{color:'white', fontSize: 16}}>ISSUE QUANTITY</Text>
            </TouchableOpacity>

            
        </View>
    </SafeAreaProvider>
  )
}

export default MRPendingIssueDetails

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

});