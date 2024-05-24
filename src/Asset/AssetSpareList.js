import React from 'react'
import {  View,  StyleSheet, Text, Dimensions,Image,FlatList ,ScrollView,
    TouchableOpacity,Alert, Pressable,Button,Modal,BackHandler,TouchableWithoutFeedback, Keyboard, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressLoader from 'rn-progress-loader';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SearchBar } from 'react-native-elements';
import axios from "axios";
import { Appbar } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import DeviceInfo from 'react-native-device-info'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TextInput } from 'react-native-element-textinput';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert'
import { TextInput as RNTextInput } from 'react-native';

let Baseurl,Site_cd,loginID,EmpName,EmpID,EmpPhone,EmpWorkGrp,dvc_id,dft_mst_tim_act;
var rowid;

const DismissKeyboard = ({children}) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
);

const AssetSpareList = ({route,navigation}) => {

    var Valid = false;


    const _goBack = () => {


        if(route.params.Screenname == "AssetListing"){    
            navigation.navigate('CreateAssetScreen',{

                ASL_Assetno:route.params.ASL_Assetno,
                ASL_RowID:route.params.ASL_RowID,
                Screenname:route.params.Screenname, 
                

                ASF_Assetno:route.params.ASF_Assetno,
                ASF_AssetDescription:route.params.ASF_AssetDescription,
                ASF_Employee:route.params.ASF_Employee,
                ASF_Fromdate: route.params.ASF_Fromdate,
                ASF_Todate: route.params.ASF_Todate,
                ASF_CostCenter:route.params.ASF_CostCenter,
                ASF_AssetStatus:route.params.ASF_AssetStatus,
                ASF_AssetType:route.params.ASF_AssetType,
                ASF_AssetGroupCode:route.params.ASF_AssetGroupCode,
                ASF_AssetCode:route.params.ASF_AssetCode,
                ASF_WorkArea:route.params.ASF_WorkArea,
                ASF_AssetLocation:route.params.ASF_AssetLocation,
                ASF_AssetLevel:route.params.ASF_AssetLevel
            });

        }else if(route.params.Screenname == "ScanAssetMaster"){

            navigation.navigate('CreateAssetScreen',{ 
                Screenname:route.params.Screenname,
                ScanAssetno:route.params.ScanAssetno,
                ScanAssetRowID:route.params.ScanAssetRowID})  
        }


        return true;
        
    }

    const [height, setHeight] = React.useState(0);

    const[spinner, setspinner]= React.useState(false)
    const[Toolbartext, setToolbartext]= React.useState("Asset Spare List") 

    const [StockNo, setStockNo]= React.useState([]);
    const [filteredDataSource, setFilteredDataSource] = React.useState([]);
    const [search, setSearch] = React.useState('');
    const [StockNoID,setStockNoID] = React.useState("");

    const [AssetSpareList, setAssetSpareList]= React.useState([]);
    const [modal2Visible, setmodal2Visible ] = React.useState(false); 

    const [isRender,setisRender]=React.useState(false);

    //Alert
    const [Show, setShow] = React.useState(false);
    const [Show_two, setShow_two] = React.useState(false);
    const [Theme, setTheme] = React.useState('');
    const [Title, setTitle] = React.useState('');
    const [Type, setType] = React.useState('');
    const [ImgValue, setImgValue] = React.useState([]);

    const minValue = 1; // Set the minimum value
    const maxValue = 999999;


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


       
        dvc_id = DeviceInfo.getDeviceId();
        console.log('dvcid',(dvc_id));
    
        Baseurl = await AsyncStorage.getItem('BaseURL');
        Site_cd = await AsyncStorage.getItem('Site_Cd');
        loginID = await AsyncStorage.getItem('emp_mst_login_id');
        EmpName = await AsyncStorage.getItem('emp_mst_name');
        EmpID = await AsyncStorage.getItem('emp_mst_empl_id');
        EmpPhone = await AsyncStorage.getItem('emp_mst_homephone');
        EmpWorkGrp = await AsyncStorage.getItem('emp_det_work_grp');
        dft_mst_tim_act = await AsyncStorage.getItem('dft_mst_tim_act');

        console.log("INTENT ROWID: "+ JSON.stringify(route.params.ASL_RowID));

        if(route.params.Screenname == "AssetListing"){ 

            rowid = (route.params.ASL_RowID);
            get_mr_stockmaster(route.params.ASL_RowID);

        }else if(route.params.Screenname == "ScanAssetMaster"){

            rowid = (route.params.ScanAssetRowID);
            get_mr_stockmaster(route.params.ScanAssetRowID);

        }
    
       
    }


    //GET PM GROUP ASSET API
    const get_mr_stockmaster=(async(rowid)=>{

        setspinner(true);

        try{

            console.log(`${Baseurl}/get_mr_stockmaster.php?site_cd=${Site_cd}`);
            const response = await axios.get(`${Baseurl}/get_mr_stockmaster.php?site_cd=${Site_cd}`);
           // console.log('MRSTOCK_MASTER response:'+ JSON.stringify(response.data));
            if (response.data.status === 'SUCCESS'){
                
            setStockNo(response.data.data);
            setFilteredDataSource(response.data.data);
            //setspinner(false);
            get_asset_spare_list(rowid);

            }else{
                setspinner(false)
                setAlert(true,'danger',response.data.message,'OK');
            }

        }catch(error){

            setspinner(false);
            alert(error);
        } 



    })

    //GET Asset Spare List
    const get_asset_spare_list=(async(rowid)=>{
        

        try{

            console.log(`${Baseurl}/get_asset_spare_list.php?mst_RowID=${rowid}`);
            const response = await axios.get(`${Baseurl}/get_asset_spare_list.php?mst_RowID=${rowid}`);
            console.log('MRSTOCK_MASTER response:'+ JSON.stringify(response.data.data));
            if (response.data.status === 'SUCCESS'){

               

                if(response.data.data.length>0){

                    for (let i = 0; i < response.data.data.length; ++i) {

                        let key = i + 1
                        let mst_RowID = response.data.data[i].mst_RowID;
                        let stock_no = response.data.data[i].ast_ls1_stock_no;
                        let ls1_desc = response.data.data[i].ast_ls1_desc;
                        let part_number = response.data.data[i].ast_ls1_varchar1;
                        let ttl_oh =response.data.data[i].itm_mst_ttl_oh;
                        let qty_needed = (parseFloat(response.data.data[i].ast_ls1_qty_needed)).toFixed(2);
                        let audit_user= response.data.data[i].audit_user;
                        let site_cd =response.data.data[i].site_cd;
                        let RowID = response.data.data[i].RowID;
                        let LoginID = '';
                        let remove_editable = true;

                        setAssetSpareList(AssetSpareList =>[...AssetSpareList,{

                            key,
                            mst_RowID,
                            stock_no,
                            ls1_desc,
                            part_number,
                            ttl_oh,
                            qty_needed,
                            audit_user,
                            site_cd,
                            RowID,
                            LoginID,
                            remove_editable
            
                        }])

                    }

                }

           
            setspinner(false);
           
            }else{
                setspinner(false)
                setAlert(true,'danger',response.data.message,'OK');
            }

        }catch(error){

            setspinner(false);
            alert(error);
        } 



    })


    //Save Asset Spare List
    const Save_AsssetSpartList =(async()=>{

        var Details;
    
        console.log(AssetSpareList.length)
       
        
        AssetSpareList.map(item =>{
    
          if(!item.stock_no){


            setAlert(true,'warning',`Alert line No: ${item.key} Please Select Stock No`,'OK');
            Valid = false;
            return

          }else{
    
            if(!item.part_number){
    
                setAlert(true,'warning',`Alert line No: ${item.key} Please Enter Part No`,'OK');
                Valid = false;
                return
    
            }else{
    
              if(!item.ls1_desc){
    
                setAlert(true,'warning',`Alert line No: ${item.key} Please enter Description`,'OK');
                Valid = false;
                return
    
              }else{
    

                if(!item.qty_needed){
    
                    setAlert(true,'warning',`Alert line No: ${item.key} Please enter Quantity`,'OK');
                    Valid = false;
                    return
    
                }else{

                    if(item.qty_needed <=0 ){

                        setAlert(true,'warning',`Alert line No: ${item.key} Quantity can not be zero`,'OK');
                        Valid = false;
                        return

                    }else{

                   
    
                     Valid = true;
                      ASPT = {
                        Details : AssetSpareList
                      }
    
                    } //console.log(JSON.stringify(ASPT))
                  
                }
                
              }
              
            }
    
          }
    
    
         })
    
         
         if(Valid){
    
          console.log(JSON.stringify(ASPT))
                
          try{
            const response = await axios.post(`${Baseurl}/insert_asset_spare.php?`,JSON.stringify(ASPT),
            {headers:{ 'Content-Type': 'application/json'}});
            console.log('Insert asset response:'+ JSON.stringify(response.data));
            if (response.data.status === 'SUCCESS'){
              setspinner(false);
              setAlert(true,'success',response.data.message,'Insert_asset');
            //   Alert.alert(response.data.status,response.data.message,
            //       [
                  
            //           { text: "OK", onPress: () => _goBack() }
    
            //       ]);
    
                
    
            }else{

                setspinner(false)

                setAlert(true,'danger',response.data.message,'OK');
            }
    
           }catch(error){
    
               setspinner(false);
               alert(error);
           } 
    
         }
    
                       
    
    
    })

    const open_search_asset_box =(item)=>{
        setmodal2Visible(true);
        setStockNoID(item)
        console.log(item)
    
    
    }

    const MR_searchFilterFunction = (text) => {
        // Check if searched text is not blank
        if (text) {
          
          const newData = StockNo.filter(function (item) {
            
              const itemData = `${item.itm_mst_stockno.toUpperCase()}
              ,${item.itm_mst_costcenter.toUpperCase()}
              ,${item.itm_mst_desc.toUpperCase()}
              ,${item.itm_mst_ext_desc.toUpperCase()}
              ,${item.itm_mst_partno.toUpperCase()})`
          
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setFilteredDataSource(newData);
          setSearch(text);
        } else {
          // Inserted text is blank
          // Update FilteredDataSource with masterDataSource
          setFilteredDataSource(StockNo);
          setSearch(text);
        }
    };

    const MR_ItemView = ({ item }) => {
    return (

        <TouchableOpacity onPress={() => MR_getItem(item)}>
            <View style={styles.PM_item}>

                {/* StockNo */}
                <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                    <View  style={{backgroundColor:'#D6EAF8',padding:5,borderRadius:10}}>
                        <Text style={{color:'#000',fontSize: 13, padding:5, fontWeight: 'bold'}} > {item.itm_mst_stockno}</Text>
                    </View>
                   
                    <Text style={{fontSize: 13,color:'#000',marginRight:10}} >{'ACT'}</Text>
                </View>

                {/*Master Location : */}
                <View style={{flexDirection:"row",marginTop:3}}>
                    <View style={{width:'40%'}}>
                        <Text placeholder="Test" style={{color:'#42A5F5',fontWeight: 'bold',justifyContent: 'flex-start'}} >Master Loc :</Text>
                    </View>
                    <View style={{flex:1}}>
                        <Text placeholder="Test" style={{color:'#000'}} >{item.itm_mst_mstr_locn}</Text>
                    </View>
                </View>


                {/* Cost Center */}
                <View style={{flexDirection:"row",marginTop:3}}>
                <View style={{width:'40%'}}>
                    <Text placeholder="Test" style={{color:'#42A5F5',fontWeight: 'bold',justifyContent: 'flex-start'}} >Cost Center :</Text>
                </View>
                <View style={{flex:1}}>
                    <Text placeholder="Test" style={{color:'#000'}} >{item.itm_mst_costcenter}</Text>
                </View>
                </View>



                {/* Description */}
                <View style={{flexDirection:"row",marginTop:3}}>
                    <View style={{width:'40%'}}>
                        <Text placeholder="Test" style={{color:'#42A5F5',fontWeight: 'bold',justifyContent: 'flex-start'}} >Description :</Text>
                    </View>
                    <View style={{flex:1}}>
                        <Text placeholder="Test" style={{color:'#000'}} >{item.itm_mst_desc}</Text>
                    </View>
                </View>

                {/* Extended Description */}
                <View style={{flexDirection:"row",marginTop:3}}>
                    <View style={{width:'40%'}}>
                        <Text placeholder="Test" style={{color:'#42A5F5',fontWeight: 'bold',justifyContent: 'flex-start'}} >Extended Desc :</Text>
                    </View>
                    <View style={{flex:1}}>
                        <Text placeholder="Test" style={{color:'#000'}} >{item.itm_mst_ext_desc}</Text>
                    </View>
                </View>

                

                {/* Part No */}
                <View style={{flexDirection:"row",marginTop:3}}>
                <View style={{width:'40%'}}>
                    <Text placeholder="Test" style={{color:'#42A5F5',fontWeight: 'bold',justifyContent: 'flex-start'}} >Part No :</Text>
                </View>
                <View style={{flex:1}}>
                    <Text placeholder="Test" style={{color:'#000'}} >{item.itm_mst_partno}</Text>
                </View>
                </View>

                

            </View>
        </TouchableOpacity>   

        
    );
    };

    const MR_ItemSeparatorView = () => {
    return (
        // Flat List Item Separator
        <View style={{ height: 0.5, width: '100%', backgroundColor: '#C8C8C8', }}
    />
    );
    };

    const MR_getItem = (pmitem) => {
        // Function for click on an item
        //alert('Id : ' + pmitem.ast_mst_asset_no  +"dfgh"+dateID);

        console.log(pmitem)
        setmodal2Visible(false);

        for (let i = 0; i < AssetSpareList.length; i++) { 
            
        
            if(AssetSpareList[i].stock_no === pmitem.itm_mst_stockno){

                setAlert(true,'warning',`This Stock no: ${pmitem.itm_mst_stockno} is already used please select different one`,'OK')
                Valid =false
                break
            }else{
                Valid =true
            }

        }

        


        if(Valid){

            AssetSpareList.map(item =>{

                if(item.key == StockNoID ){
                    //console.log("SELECTED ITEM "+  item.selected_Employee)
                    //console.log("SELECTED ITEM 2"+  option.key)
        
                
                    
                    item.stock_no = pmitem.itm_mst_stockno
                    item.part_number = pmitem.itm_mst_partno
                    item.ls1_desc = pmitem.itm_mst_desc
                    item.ttl_oh = pmitem.itm_mst_ttl_oh
                
                    
                    
                    
                    return ;
                
                }
                
               
            })
            
        }
        
    
    };
    


    //Add AssetSpareList 
    const addItem =(()=>{

       

        if(AssetSpareList.length > 0){
            console.log('IN')

            AssetSpareList.map(item =>{

                if(!item.stock_no){

                    setAlert(true,'warning',`Alert line No: ${item.key} Please Select Stock No`,'OK');
                    Valid = false;
                    return

                }else{

                    if(!item.part_number){
    
                        setAlert(true,'warning',`Alert line No: ${item.key} Please Enter Part No`,'OK');
                        Valid = false;
                        return
            
                    }else{

                        if(!item.ls1_desc){
    
                            setAlert(true,'warning',`Alert line No: ${item.key} Please enter Description`,'OK');
                            Valid = false;
                            return
                
                        }else{


                            if(!item.qty_needed){
    
                                setAlert(true,'warning',`Alert line No: ${item.key} Please enter Quantity`,'OK');
                                Valid = false;
                                return
                
                            }else{

                                Valid = true;



                            }



                        }


                    }

                }



            })

            if(Valid){

                let key = AssetSpareList.length + 1;
                let mst_RowID = rowid;
                let stock_no = '';
                let ls1_desc = '';
                let part_number = '';
                let ttl_oh ='';
                let qty_needed = '';
                let audit_user= EmpID;
                let site_cd =Site_cd;
                let RowID = '';
                let LoginID = loginID;
                let remove_editable = false;

                setAssetSpareList(AssetSpareList =>[...AssetSpareList,{

                    key,
                    mst_RowID,
                    stock_no,
                    ls1_desc,
                    part_number,
                    ttl_oh,
                    qty_needed,
                    audit_user,
                    site_cd,
                    RowID,
                    LoginID,
                    remove_editable

                }])


            }

        }else{

            console.log('OUT')

            let key = AssetSpareList.length + 1;
            let mst_RowID = rowid;
            let stock_no = '';
            let ls1_desc = '';
            let part_number = '';
            let ttl_oh ='';
            let qty_needed = '';
            let audit_user= EmpID;
            let site_cd =Site_cd;
            let RowID = '';
            let LoginID = loginID;
            let remove_editable = false;

            setAssetSpareList(AssetSpareList =>[...AssetSpareList,{

                key,
                mst_RowID,
                stock_no,
                ls1_desc,
                part_number,
                ttl_oh,
                qty_needed,
                audit_user,
                site_cd,
                RowID,
                LoginID,
                remove_editable

            }])

        }
    
    });

    const ItemView =({item,index})=>{

        //console.log("dfghjk"+JSON.stringify(item))
        return(
    
          <View style={styles.card}>
    
            <Modal 
                animationType="slide"
                transparent={true}
                visible={modal2Visible}
                onRequestClose={()=>{
                Alert.alert("Closed")
                setmodal2Visible(!modal2Visible)
                }}>             

                <View style={styles.model2_cardview}>

                    <View style={{flex:1,backgroundColor:'#fff'}}>

                        <View style={{flexDirection:'row',height:50,alignItems:'center',backgroundColor:'#0096FF'}}>

                            <Text style={{flex:1,fontSize:15, justifyContent:'center',color:'#ffffffff',margin:5}}>MR Stock No Search</Text> 

                            <Ionicons
                                name="close"
                                color='#ffffffff'
                                size={30}
                                style={{marginEnd:15}}
                                onPress={()=>setmodal2Visible(false)}
                            />   

                        </View>

                        <SearchBar
                            lightTheme
                            round
                            inputStyle={{color:'#000'}}
                            inputContainerStyle={{backgroundColor: '#FFFF'}}
                            searchIcon={{ size: 24 }}
                            onChangeText={(text) => MR_searchFilterFunction(text)}
                            onClear={(text) => MR_searchFilterFunction('')}
                            placeholder="Search here..."
                            value={search}
                        />

                        <FlatList
                            data={filteredDataSource}
                            keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator ={false}
                            showsHorizontalScrollIndicator={false}
                            ItemSeparatorComponent={MR_ItemSeparatorView}
                            renderItem={MR_ItemView}
                        />

                    </View>

                </View>

    
            </Modal>
    
                {/* Line */}
                <View style={styles.card_row}>                      
    
                  <Text style={{fontSize:15, justifyContent:'center',alignItems:'center',color:'#0096FF', margin:10,}}>Line no: {item.key}</Text> 
    
                  <TouchableOpacity onPress={()=>removeItem(item.key)}>
                        <Image
                            style={{  width: 35, height: 35,display: !item.remove_editable? 'flex' : 'none'}}
                            source={require('../../images/minus.png')}/>
                    </TouchableOpacity>

                    {/* <Ionicons 
                        name="close"
                        color={'#000'}
                        size={25}
                        disabled={item.remove_editable}  
                        onPress={()=>removeItem(item.key)}
                    />  */}
            
                </View>
    
                <View style={{backgroundColor:"#000",width:'100%',height:1,marginBottom:10}}></View>
    


                {/* Asset GroupCode*/}
                <View style={styles.view_style}>
                    <Pressable
                        onPress={() =>  open_search_asset_box(item.key)}
                        >
                        <View  
                            pointerEvents={ 'none'}
                            >
                            <TextInput
                                value={item.stock_no}
                                style={[styles.input,{height: Math.max(Platform.OS === 'ios' ? 50 : 50, height)}]}
                                inputStyle={[styles.inputStyle,{color:'#000'}]}
                                labelStyle={styles.labelStyle}
                                multiline={true}
                                placeholderStyle={{
                                    fontSize: 15,
                                    color: '#0096FF'
                                }}
                                
                                onContentSizeChange={(event) =>
                                    setHeight(event.nativeEvent.contentSize.height)
                                    }
                                textErrorStyle={styles.textErrorStyle}
                                label="Stock No"
                                focusColor="#808080"
                                editable={false}
                                selectTextOnFocus={false}
                                renderRightIcon={() => (    

                                    <AntDesign
                                        style={styles.icon}
                                        color={'black'}
                                        name={ 'search1'}
                                        size={22}
                                        disable={true}
                                       
                                    />
                                )}
                            />
                        </View>
                    </Pressable>
                </View>
                

                {/* Part Number */}
                <View style={styles.view_style}>

                    <TextInput
                        value={item.part_number}
                        style={[styles.input,{height:50}]}
                        inputStyle={[styles.inputStyle,{color: "#000" }]}
                        labelStyle={styles.labelStyle}
                        
                        placeholderStyle={{
                            fontSize: 15,
                            color: '#0096FF'
                        }}
                        
                        textErrorStyle={styles.textErrorStyle}
                        label="Part Number"
                        placeholderTextColor="gray"
                        focusColor="#808080"
                        onChangeText={(value)=>Part_no(value,item.key)}
                        renderRightIcon={() => (    

                            <AntDesign
                                style={styles.icon}
                                color={'black'}
                                name={ ''}
                                size={22}
                                disable={true}
                               
                            />
                        )}
                    />
                                                
                </View>

                {/* Description*/}
                <View style={styles.view_style}>

                    <TextInput
                        value={item.ls1_desc}
                        style={[styles.input,{height:50}]}
                        inputStyle={[styles.inputStyle,{color: "#000" }]}
                        labelStyle={styles.labelStyle}
                        
                        placeholderStyle={{
                            fontSize: 15,
                            color: '#0096FF'
                        }}
                        onChangeText={(value)=>ASP_Description(value,item.key)}
                        textErrorStyle={styles.textErrorStyle}
                        label="Description"
                        placeholderTextColor="gray"
                        focusColor="#808080"

                        renderRightIcon={() => (    

                            <AntDesign
                                style={styles.icon}
                                color={'black'}
                                name={ ''}
                                size={22}
                                disable={true}
                               
                            />
                        )}
                        
                        
                    />
                                                
                </View>

                {/* Total OH */}
                <View style={styles.view_style}>

                    <TextInput
                        value={item.ttl_oh}
                        style={[styles.input,{height:50}]}
                        inputStyle={[styles.inputStyle,{color: "#000" }]}
                        labelStyle={styles.labelStyle}
                        
                        placeholderStyle={{
                            fontSize: 15,
                            color: '#0096FF'
                        }}
                        editable={false}
                        selectTextOnFocus={false}
                        textErrorStyle={styles.textErrorStyle}
                        label="Total OH"
                        keyboardType="numeric"
                        placeholderTextColor="gray"
                        focusColor="#808080"

                        renderRightIcon={() => (    

                            <AntDesign
                                style={styles.icon}
                                color={'black'}
                                name={ ''}
                                size={22}
                                disable={true}
                               
                            />
                        )}
                        
                        
                    />
                                                
                </View>

                 {/* Quantity */}
                <View style={styles.view_style}>

                    {/* <TextInput
                        value={item.qty_needed}
                        style={[styles.input,{height:50}]}
                        inputStyle={[styles.inputStyle,{color: "#000" ,alignItems:'center'}]}
                        labelStyle={styles.labelStyle}
                        
                        placeholderStyle={{
                            fontSize: 15,
                            color: '#0096FF'
                        }}
                        
                        textErrorStyle={styles.textErrorStyle}
                        label="Quantity"
                        placeholderTextColor="gray"
                        focusColor="#808080"
                        keyboardType="numeric"
                        onChangeText={(value)=>ASP_Quantity(value,item.key)}
                        renderRightIcon={() => (    

                            <AntDesign
                                style={styles.icon}
                                color={'black'}
                                name={ ''}
                                size={22}
                                disable={true}
                               
                            />
                        )}
                        
                        
                    /> */}

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
                            
                            value={item.qty_needed}
                            key={item.key}
                            style={{flex: 1, height:50, borderColor: 'gray', borderRadius: 1, borderWidth: 1}}
                            keyboardType="numeric"
                            placeholder="Quantity"
                            maxLength={String(999999999).length} 
                            placeholderTextColor="#0096FF"
                            textAlign="center"
                            onChangeText={(text) => {
                            if (text===''|| text.match(/^\d+(\.\d{0,2})?$/)){

                                item.qty_needed = text
                                ASP_Quantity(text,item.key)
                            
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
    
        );
    
    }

    const ItemSeparatorView=()=>{

    return (
        // Flat List Item Separator
        <View
        style={{
        
        backgroundColor: '#C8C8C8',
        }}/>
    );
    }



    // const get_clearStockNo  =((getitem)=>{

    //     //console.log('Value test :',value)
    //     console.log('postions:',getitem)

    //     const newData = AssetSpareList.map(item =>{

    //         if(item.key == getitem){


    //             item.stock_no = ''

    //             return item;

    //         }

    //     })

    //     setAssetSpareList(newData)
    //     setisRender(!isRender)
    // })

    const Part_no  =((value,getitem)=>{

        console.log('Value test :',value)
        console.log('postions:',getitem)

        AssetSpareList.map(item =>{

            if(item.key == getitem){


                item.part_number = value

                return item;

            }

        })

        //setAssetSpareList(newData)
        setisRender(!isRender)
    })

    const ASP_Description  =((value,getitem)=>{

        //console.log('Value test :',value)
        //console.log('postions:',getitem)

        AssetSpareList.map(item =>{

            if(item.key == getitem){


                item.ls1_desc = value

                return item;

            }

        })

       // setAssetSpareList(newData)
       // setisRender(!isRender)
    })

    const ASP_Quantity  =((value,getitem)=>{

        //console.log('Value test :',value)
        //console.log('postions:',getitem)

        AssetSpareList.map(item =>{

            if(item.key == getitem){

                item.qty_needed = value
                return item;

            }

        })

        //setAssetSpareList(newData)
       setisRender(!isRender)
    })

    const increment = (key) => {

        console.log('increment key :',key)

        // Increment the value by 0.01 (or any other desired step)
        //setValue((prevValue) => (parseFloat(prevValue )+ 1).toFixed(2));

        

        AssetSpareList.map(item =>{

            if(item.key == key){


                const numberValue = Number(item.qty_needed);

                if (item.qty_needed > 0) {
                    //console.log('increment if :',item.qty_needed)
                    // const sum2 = (parseFloat(item.qty_needed ))
                    // const sum = (parseInt(sum2)+ 1);


                    if (Number.isInteger(numberValue)) {

                        item.qty_needed = (parseInt(item.qty_needed)+ 1).toString();

                    } else if (typeof numberValue === 'number') {
                        item.qty_needed = (parseFloat(item.qty_needed )+ 1).toFixed(2);

                    } 
                   
                }else{
                    console.log('increment else :',item.qty_needed)
                    //const sum = (parseInt(0)+ 1).toString();
                    if (Number.isInteger(numberValue)) {

                        item.qty_needed = (parseInt(0)+ 1).toString();

                    } else if (typeof numberValue === 'number') {
                        item.qty_needed = (parseFloat(0)+ 1).toFixed(2);

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

        AssetSpareList.map(item =>{

            const numberValue = Number(item.qty_needed);

            if(item.key == key){


                if (item.qty_needed <= 0 || item.qty_needed <= 1) {
                    //console.log('decrement if :',item.qty_needed)
                    

                }else{
                    //console.log('decrement else :',item.qty_needed)
                    //item.qty_needed = (parseFloat(item.qty_needed )- 1).toFixed(2)

                    if (Number.isInteger(numberValue)) {

                        item.qty_needed = (parseInt(item.qty_needed)- 1).toString();

                    } else if (typeof numberValue === 'number') {
                        item.qty_needed = (parseFloat(item.qty_needed)- 1).toFixed(2);

                    } 
                }


                //item.qty_needed = (parseFloat(item.qty_needed )- 1).toFixed(2)

                return item;

            }

        })
        setisRender(!isRender)
    };

    const End_Quantity  =((value,getitem)=>{

        console.log('Value test :',value)
        console.log('postions:',getitem)

        AssetSpareList.map(item =>{

            if(item.key == getitem){


                item.qty_needed = value

                return item;

            }

        })

        //setAssetSpareList(newData)
       setisRender(!isRender)
    })

  
    //Remove AssetSpareList Item
    removeItem =(key)=>{
  
    console.log("REMOVE"+key)

    setAlert_two(true,'delete','Do you confirm to remove line?','RemoveLine',key)


    // Alert.alert("Remove Line","Do you confirm to remove line?",
    //   [
      
    //       { text: "OK", onPress: () => setAssetSpareList(AssetSpareList.slice().filter((item)=>item.key !==key)) }
  
    //   ]);
  
    //setTimecard(Timecard.slice().filter((item)=>item.key !==key))
    }


    const setAlert =(show,theme,title,type)=>{


        setShow(show);
        setTheme(theme);
        setTitle(title);
        setType(type);
        
    
    }

    const setAlert_two =(show,theme,title,type,value)=>{

        setShow_two(show);
        setTheme(theme);
        setTitle(title);
        setType(type);
        setImgValue(value);
    
    }
    

    
    const One_Alret_onClick =(D) =>{

        console.log('DD', D);

    if (D === 'OK') {
      setShow(false);
    } else if (D === 'Insert_asset') {
        setShow(false);
        _goBack();
    }

        

    }

    const Alret_onClick =(D) =>{

        setShow_two(false)
        if(D === 'RemoveLine'){

            setAssetSpareList(AssetSpareList.slice().filter((item)=>item.key !==ImgValue))

        }else{

        }

        

    }

  return (

    <DismissKeyboard>
    <SafeAreaProvider>

        <Appbar.Header style={{backgroundColor:"#42A5F5"}}>

            <Appbar.BackAction onPress={_goBack} color={'#FFF'} size={30}/>
                
            <Appbar.Content title={Toolbartext}  color={'#FFF'} />
        
        </Appbar.Header>

            <ProgressLoader visible={spinner} isModal={true} isHUD={true} hudColor={"#808080"} color={"#FFFFFF"} />


            <SCLAlert theme={Theme} show={Show} title={Title}>
                <SCLAlertButton theme={Theme}   onPress={()=>One_Alret_onClick(Type)}>OK</SCLAlertButton>
            </SCLAlert>


            <SCLAlert theme={Theme} show={Show_two} title={Title} >
                <SCLAlertButton theme={Theme}  onPress={()=>Alret_onClick(Type)}>Yes</SCLAlertButton>
                <SCLAlertButton theme="default" onPress={()=>setShow_two(false)}>No</SCLAlertButton>
            </SCLAlert>

        <View style={{  flex: 1, marginBottom: 80}}>
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : null} 
                keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}> 

            <FlatList
                data={AssetSpareList}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={ItemSeparatorView}
                renderItem={ItemView}       
                extraData={isRender}     
            
            />
             </KeyboardAwareScrollView>
        
        </View>


         <View style={ styles.bottomView} >
            <TouchableOpacity
                style={{width:'50%',height:60,backgroundColor:'#0096FF',
                alignItems:'center',justifyContent:'center'}} onPress={()=> addItem()}>
                    <Text style={{color:'white', fontSize: 16}}>Add</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={{width:'50%',height:60,backgroundColor:'#8BC34A',marginLeft:5,
                alignItems:'center',justifyContent:'center'}} onPress={()=> Save_AsssetSpartList()}>
                    <Text style={{color:'white', fontSize: 16}}>Save</Text>
            </TouchableOpacity>
        </View>

    </SafeAreaProvider>
    </DismissKeyboard>
  )
}

export default AssetSpareList

const styles = StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: '#e0e0eb'
    },
  
    bottomView:{
      flex:1,
      flexDirection:'row',
      width: '100%', 
      height: 60, 
      justifyContent: 'center', 
      alignItems: 'center',
      position: 'absolute',
      bottom: 0
    },
    card: {
  
      backgroundColor: '#FFFFFF',
      margin:10,
      borderRadius: 10,  
      padding:10    
    },
    card_row: {
  
      flexDirection:'row',
      justifyContent:'space-between',
      marginTop:10,
      alignItems:'center' 
    },
  
    card_button: {
  
      flexDirection:'row',
      justifyContent:'space-between',
      marginTop:15 ,
      alignItems:'center' 
    },
  
    text_footer: {         
      fontSize: 13,
      color: '#42A5F5'
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
      marginTop: Platform.OS === 'ios' ? 0 : 7,
      paddingLeft: 10,
      fontSize:13,
      color: '#05375a'
      
  },
  model2_cardview:{
  
    flex:1,
    marginTop:50,
    padding:20,
    backgroundColor:'rgba(0,0,0,0.8)'
  
  },
  PM_item:{
     
   
   margin:10,
    
  
  },

  input: {
        
    paddingHorizontal: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#808080',
  },

  inputStyle: { fontSize: 15, marginTop: Platform.OS === 'ios' ? 8 : 0 },

  labelStyle: {
    fontSize: 13,
    position: 'absolute',
    top: -10,
    color:'#0096FF',
    backgroundColor: 'white',
    paddingHorizontal: 4,
    marginLeft: -4,
  },
  
  textErrorStyle: { fontSize: 16 },

  view_style:{
    marginTop:12,
    marginLeft:10,
    marginRight:10
},

  });