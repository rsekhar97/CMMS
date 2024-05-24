import React from 'react';
import { View, StyleSheet, Text, Dimensions, Pressable, Modal, RefreshControl, FlatList, BackHandler, TouchableOpacity, Alert, TouchableWithoutFeedback, Keyboard, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressLoader from 'rn-progress-loader';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {TextInput} from 'react-native-element-textinput';
import {SearchBar} from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Appbar} from 'react-native-paper';
import {openDatabase} from 'react-native-sqlite-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { TextInput as RNTextInput } from 'react-native';

var db = openDatabase({name: 'CMMS.db'});
let Baseurl, Site_cd, LoginID, EmpName, EmpID, EmpPhone, EmpWorkGrp, dvc_id, WIFI;

const DismissKeyboard = ({children}) => (
<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
</TouchableWithoutFeedback>
);

const Chargeable = ({route, navigation}) => {
  let Valid = false;

  const [spinner, setspinner] = React.useState(false);
  const [Toolbartext, setToolbartext] = React.useState('Chargeable');
  const [Editable, setEditable] = React.useState(false);
  const [height, setHeight] = React.useState(0);

  const [checkboxState, setCheckboxState] = React.useState(false);

  const [LobourType, setLobourType] = React.useState([]);
  const [LobourType_key, setLobourType_key] = React.useState('');
  const [LobourType_label, setLobourType_label] = React.useState('');

  const [InvoiceAMT, setInvoiceAMT] = React.useState('');
  const [TotalMarkupCost, setTotalMarkupCost] = React.useState('');

  //DropDown Modal
  const [textvalue, settextvalue] = React.useState('');
  const [Boxtextvalue, setBoxtextvalue] = React.useState('');
  const [Dropdown_data, setDropdown_data] = React.useState([]);
  const [DropDownFilteredData, setDropDownFilteredData] = React.useState([]);
  const [DropDown_modalVisible, setDropDown_modalVisible] = React.useState(false);
  const [DropDown_search, setDropDown_search] = React.useState('');
  const [refreshing, setRefreshing] = React.useState(false);

    //Alert
    const [Show, setShow] = React.useState(false);
    const [Show_two, setShow_two] = React.useState(false);
    const [Theme, setTheme] = React.useState('');
    const [Title, setTitle] = React.useState('');
    const [AlertType, setAlertType] = React.useState('');

  const _goBack = () => {
    if (route.params.Screenname == 'FilteringWorkOrder') {
      navigation.navigate('CreateWorkOrder', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        Screenname: route.params.Screenname,

        WOF_Workordercategory: route.params.WOF_Workordercategory,
        WOF_Workorderstatus: route.params.WOF_Workorderstatus,
        WOF_WorkrequestNo: route.params.WOF_WorkrequestNo,
        WOF_WorkorderNo: route.params.WOF_WorkorderNo,
        WOF_WorkorderDesc: route.params.WOF_WorkorderDesc,
        WOF_AssetNo: route.params.WOF_AssetDesc,
        WOF_AssetDesc: route.params.WOF_AssetDesc,
        WOF_Originator: route.params.WOF_Originator,
        WOF_Assignto: route.params.WOF_Assignto,
        WOF_WorkArea: route.params.WOF_WorkArea,
        WOF_WorkType: route.params.WOF_WorkType,
        WOF_SupervisorID: route.params.WOF_SupervisorID,
        WOF_AssetLocation: route.params.WOF_AssetLocation,
        WOF_AssetLevel: route.params.WOF_AssetLevel,
        WOF_CostCenter: route.params.WOF_CostCenter,
        WOF_Fromdate: route.params.WOF_Fromdate,
        WOF_Todate: route.params.WOF_Todate,
      });
    } else if (route.params.Screenname == 'MyWorkOrder') {
      navigation.navigate('CreateWorkOrder', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        local_id: route.params.local_id,
        Selected_wko_mst_ast_cod: route.params.Selected_wko_mst_ast_cod,
        Selected_wko_mst_type: route.params.Selected_wko_mst_type,
        Screenname: route.params.Screenname,
      });
    } else if (route.params.Screenname == 'WoDashboard'  || route.params.Screenname == 'MYWO_Dashboard_Due' || route.params.Screenname == 'MYWO_Dashboard_Past') {
      navigation.navigate('CreateWorkOrder', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        local_id: route.params.local_id,
        Selected_wko_mst_ast_cod: route.params.Selected_wko_mst_ast_cod,
        Selected_wko_mst_type: route.params.Selected_wko_mst_type,

        Screenname: route.params.Screenname,
        type: route.params.type,
      });
    } else if (route.params.Screenname == 'ScanAssetMaster') {
      if (route.params.ScanAssetType == 'New') {
        navigation.navigate('CreateWorkOrder', {
          Screenname: route.params.Screenname,
          ScanAssetType: route.params.ScanAssetType,
          ScanAssetRowID: route.params.ScanAssetRowID,
          ScanAssetno: route.params.ScanAssetno,
        });
      } else if (route.params.ScanAssetType == 'Edit') {
        navigation.navigate('CreateWorkOrder', {
          Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
          RowID: route.params.RowID,

          Screenname: route.params.Screenname,
          ScanAssetType: route.params.ScanAssetType,
          ScanAssetno: route.params.ScanAssetno,
          ScanAssetRowID: route.params.ScanAssetRowID,
        });
      }
    } else if (route.params.Screenname == 'AssetListing') {
      navigation.navigate('CreateWorkOrder', {
        Selected_WorkOrder_no: route.params.Selected_WorkOrder_no,
        RowID: route.params.RowID,

        ASL_Assetno: route.params.ASL_Assetno,
        ASL_RowID: route.params.ASL_RowID,
        Screenname: route.params.Screenname,

        ASF_Assetno: route.params.ASF_Assetno,
        ASF_AssetDescription: route.params.ASF_AssetDescription,
        ASF_Employee: route.params.ASF_Employee,
        ASF_Fromdate: route.params.ASF_Fromdate,
        ASF_Todate: route.params.ASF_Todate,
        ASF_CostCenter: route.params.ASF_CostCenter,
        ASF_AssetStatus: route.params.ASF_AssetStatus,
        ASF_AssetType: route.params.ASF_AssetType,
        ASF_AssetGroupCode: route.params.ASF_AssetGroupCode,
        ASF_AssetCode: route.params.ASF_AssetCode,
        ASF_WorkArea: route.params.ASF_WorkArea,
        ASF_AssetLocation: route.params.ASF_AssetLocation,
        ASF_AssetLevel: route.params.ASF_AssetLevel,
      });
    }
  };

  const backAction = () => {
    // Alert.alert("Alert", "Do you want to exit chargeable screen?", [
    //   {
    //     text: "NO",
    //     onPress: () => null,
        
    //   },
    //   { text: "YES", onPress: () => _goBack() }
    // ]);

    setAlert_two(true,'warning','Do you want to exit chargeable screen?','BACK')

    return true;
  };

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  React.useEffect(() => {
    const focusHander = navigation.addListener('focus', () => {
      fetchData();
    });
    return focusHander;
  }, [navigation]);

  const fetchData = async () => {
    dvc_id = DeviceInfo.getDeviceId();

    Baseurl = await AsyncStorage.getItem('BaseURL');
    Site_cd = await AsyncStorage.getItem('Site_Cd');
    LoginID = await AsyncStorage.getItem('emp_mst_login_id');
    EmpName = await AsyncStorage.getItem('emp_mst_name');
    EmpID = await AsyncStorage.getItem('emp_mst_empl_id');
    EmpPhone = await AsyncStorage.getItem('emp_mst_homephone');
    EmpWorkGrp = await AsyncStorage.getItem('emp_det_work_grp');
    WIFI = await AsyncStorage.getItem('WIFI');
    console.log('WORK DATA:  ' + WIFI);
    mst_RowID = route.params.RowID;
    local_id = route.params.local_id;
    console.log('WORK DATA LOCAL ID:  ' + route.params.Screenname);

    db.transaction(function (txn) {

      //wrk_group
      txn.executeSql( 'SELECT * FROM wrk_group', [], (tx, { rows }) => { setLobourType(rows.raw())});
      
    });

    get_chargeable();
  };

  //get_chargeable API
  const get_chargeable = async () => {
    setspinner(true);
    try {

      console.log( 'get_chargeable : ' + `${Baseurl}/get_chargeable.php?site_cd=${Site_cd}&RowID=${mst_RowID}`);
      const response = await axios.get( `${Baseurl}/get_chargeable.php?site_cd=${Site_cd}&RowID=${mst_RowID}`);

      console.log('JSON DATA get_default_values: ' + response.data.data);

      if (response.data.status === 'SUCCESS') {
        var chargeable_temp = [];
        // console.log("get:"+results.rows)
        for (let i = 0; i < response.data.data.length; ++i) {

          if (response.data.data[i].wko_det_safety === '1') {
            setCheckboxState(true);
          } else {
            setCheckboxState(false);
          }

          setLobourType_key(response.data.data[i].wko_det_work_grp);
          setLobourType_label(response.data.data[i].wko_det_work_grp);

          let INV_QTY,TOTAL_COST;
          if(response.data.data[i].wko_det_numeric2 == '.0000'){
            INV_QTY = ''
          }else{
            INV_QTY = response.data.data[i].wko_det_numeric2
          }
          if(response.data.data[i].wko_det_numeric3 == '.0000'){
            TOTAL_COST = ''
          }else{
            TOTAL_COST = response.data.data[i].wko_det_numeric3
          }

          setInvoiceAMT(INV_QTY);
          setTotalMarkupCost(TOTAL_COST);

        }

        setspinner(false);
      } else {
        setspinner(false);
        setAlert(true,'warning',response.data.message,'OK');
       //alert(error);
      }
    } catch (error) {
      setspinner(false);
      alert(error);
    }
  };

  const get_validation = () => {
    if (!checkboxState) {
      //alert('Please select chargeable');
      setAlert(true,'warning','Please select chargeable','OK');
      Valid = false;
      return;
    } else {
      if (!LobourType_key) {
        //alert('Please select labour type');
        setAlert(true,'warning','Please select labour type','OK');
        Valid = false;
        return;
      } else {
        if (!InvoiceAMT) {
          setAlert(true,'warning','Please enter invoice AMT','OK');
          //alert('Please enter Invoice AMT');
          Valid = false;
          return;
        } else {
          if (!TotalMarkupCost) {
            setAlert(true,'warning','Please enter total markup cost','OK');
            //alert('Please enter Total Markup Cost');
            Valid = false;
            return;
          } else {
            Valid = true;

            if (Valid) {
              get_update_chargeable_workorder();
            }
          }
        }
      }
    }
  };

  //save
  const get_update_chargeable_workorder = async () => {
    let check;
    setspinner(true);

    if (checkboxState) {
      check = '1';
    } else {
      check = '0';
    }

    let update_chargeable = {
      site_cd: Site_cd,
      EmpID: EmpID,
      LOGINID: LoginID,
      RowID: mst_RowID,

      wko_det_safety: check,
      wko_det_work_grp: LobourType_label,

      wko_det_numeric2: InvoiceAMT,
      wko_det_numeric3: TotalMarkupCost,
    };

    console.log('update_chargeable' + JSON.stringify(update_chargeable));

    try {
      const response = await axios.post( `${Baseurl}/update_chargeable_workorder.php?`,JSON.stringify(update_chargeable),
        {headers: {'Content-Type': 'application/json'}},
      );
      console.log( 'update_chargeable response:' + JSON.stringify(response.data), );
      if (response.data.status === 'SUCCESS') {
        setspinner(false);
        // Alert.alert(response.data.status, response.data.message, [
        //   {
        //     text: 'OK',
        //     onPress: () => {
        //       _goBack();
        //     },
        //   },
        // ]);

        setAlert(true,'success',response.data.message,'UPDATE_CHARGEABLE');

      } else {
        setspinner(false);
        // Alert.alert(response.data.status, response.data.message, [
        //   {text: 'OK'},
        // ]);

        setAlert(true,'warning',response.data.message,'OK');
      }
    } catch (error) {
      setspinner(false);
      alert(error);
    }
  };

  //Selection Dropdown
  const select_dropdown = (dropname, data) => {
    console.log(data);

    settextvalue(dropname);
    setDropDownFilteredData(data);
    setDropdown_data(data);
    setDropDown_modalVisible(!DropDown_modalVisible);
  };

  //Dropdown Filter
  const DropDown_searchFilterFunction = text => {
    // Check if searched text is not blank
    if (text) {
      let newData;

      if (textvalue == 'Labour Type') {
        newData = Dropdown_data.filter(function (item) {
          const itemData = `${item.wrk_grp_grp_cd.toUpperCase()},
              ,${item.wrk_grp_desc.toUpperCase()})`;

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

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);

    if (textvalue == 'Labour Type') {
      setDropDownFilteredData(LobourType);
    }

    setRefreshing(false);
  }, [refreshing]);

  const renderText = item => {
    if (textvalue == 'Labour Type') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}>Work Group :</Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ justifyContent: 'flex-start', color: '#000', marginLeft: 15, }}> {item.wrk_grp_grp_cd} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}>Description :</Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ justifyContent: 'flex-start', color: '#000', marginLeft: 15, }}> {item.wrk_grp_desc} </Text>
            </View>
          </View>
        </View>
      );
    }
  };

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

  const getItem = item => {
    // Function for click on an item
    //alert('Id : ' + JSON.stringify(item) );

    if (textvalue == 'Labour Type') {
      setLobourType_key(item.wrk_grp_grp_cd + ' : ' + item.wrk_grp_desc);

      setLobourType_label(item.wrk_grp_grp_cd);

      let wrk_grp_desc = item.wrk_grp_desc.split(':');

      let desc = item.wrk_grp_desc.split('-');

      let desc2 = desc[0];

      console.log(Number(desc2).toFixed(3));
      setInvoiceAMT(Number(desc2).toFixed(3));
    }

    setDropDown_search('');
    setDropDown_modalVisible(!DropDown_modalVisible);
  };

  const check = () => {
    setCheckboxState(!checkboxState);

    if (checkboxState) {
    } else {
      setLobourType_key('');
      setLobourType_label('');
      setInvoiceAMT('');
      setTotalMarkupCost('');
    }
  };

  const setAlert =(show,theme,title,type)=>{

    setShow(show);
    setTheme(theme);
    setTitle(title);
    setAlertType(type);
    

  }


  const setAlert_two =(show,theme,title,type)=>{

    setShow_two(show);
    setTheme(theme);
    setTitle(title);
    setAlertType(type);

  }


  const One_Alret_onClick =(D) =>{

    if(D === 'OK'){

      setShow(false)

    }else if(D === 'UPDATE_CHARGEABLE'){

      setShow(false)

      _goBack()

    }

  }

  const Alret_onClick =(D) =>{

    setShow_two(false)

    if(D === 'BACK'){

      _goBack()

    } 

  }


  const increment = () => {

    const numberValue = Number(InvoiceAMT);

      if (InvoiceAMT > 0) {
          //console.log('increment if :',item.qty_needed)
          // const sum2 = (parseFloat(item.qty_needed ))
          // const sum = (parseInt(sum2)+ 1);


          if (Number.isInteger(numberValue)) {

            setInvoiceAMT( (parseInt(InvoiceAMT)+ 1).toString())

          } else if (typeof numberValue === 'number') {

            setInvoiceAMT( (parseFloat(InvoiceAMT )+ 1).toFixed(2))

          } 
         
      }else{
          console.log('increment else :',InvoiceAMT)
          //const sum = (parseInt(0)+ 1).toString();
          if (Number.isInteger(numberValue)) {

            setInvoiceAMT((parseInt(0)+ 1).toString())

          } else if (typeof numberValue === 'number') {
            setInvoiceAMT((parseFloat(0)+ 1).toFixed(2))

          } 
      }

    
  };

const decrement = (key) => {


  const numberValue = Number(InvoiceAMT);

      if (InvoiceAMT <= 0 ||InvoiceAMT <= 1) {
          
         
      }else{
          console.log('increment else :',InvoiceAMT)
          //const sum = (parseInt(0)+ 1).toString();
          if (Number.isInteger(numberValue)) {

            setInvoiceAMT((numberValue - 1).toString())

          } else if (typeof numberValue === 'number') {
            setInvoiceAMT((numberValue - 1).toFixed(2))

          } 
      }

    
};

  return (

    <DismissKeyboard>
      <SafeAreaProvider>
        <Appbar.Header style={{backgroundColor: '#42A5F5'}}>
            <View
            style={{
                flexDirection: 'row',
                flex: 1,
                justifyContent: 'space-between',
            }}>
            <Pressable onPress={_goBack}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <FontAwesome
                    name="angle-left"
                    color="#fff"
                    size={55}
                    style={{marginLeft: 15, marginBottom: 5}}
                />
                <Text
                    style={{
                    fontSize: 20,
                    justifyContent: 'center',
                    textAlign: 'center',
                    color: '#fff',
                    fontWeight: 'bold',
                    marginLeft: 15,
                    }}>
                    {Toolbartext}
                </Text>
                </View>
            </Pressable>
            </View>
        </Appbar.Header>

        <ProgressLoader visible={spinner} isModal={true} isHUD={true} hudColor={'#808080'} color={'#FFFFFF'} />

        <SCLAlert theme={Theme} show={Show} title={Title}>
          <SCLAlertButton theme={Theme}   onPress={()=>One_Alret_onClick(AlertType)}>OK</SCLAlertButton>
        </SCLAlert>

        <SCLAlert theme={Theme} show={Show_two} title={Title} >
          <SCLAlertButton theme={Theme}  onPress={()=>Alret_onClick(AlertType)}>Yes</SCLAlertButton>
          <SCLAlertButton theme="default" onPress={()=>setShow_two(false)}>No</SCLAlertButton>
        </SCLAlert>

        {/* DropDown Modal */}
        <Modal
            animationType="slide"
            transparent={true}
            visible={DropDown_modalVisible}
            onRequestClose={() => {
           //Alert.alert('Closed');
            setDropDown_modalVisible(!DropDown_modalVisible);
            }}>
            <View style={styles.model2_cardview}>
            <View style={{flex: 1, margin: 20, backgroundColor: '#FFFFFF'}}>
                <View
                style={{flexDirection: 'row', alignItems: 'center', height: 50}}>
                <Text
                    style={{
                    flex: 1,
                    fontSize: 15,
                    justifyContent: 'center',
                    textAlign: 'center',
                    color: '#000',
                    fontWeight: 'bold',
                    }}>
                    {textvalue}
                </Text>
                <Ionicons
                    name="close"
                    color="red"
                    size={30}
                    style={{marginEnd: 15}}
                    onPress={() => setDropDown_modalVisible(!DropDown_modalVisible)}
                />
                </View>

                <SearchBar
                lightTheme
                round
                inputStyle={{color: '#000'}}
                inputContainerStyle={{backgroundColor: '#FFFF'}}
                searchIcon={{size: 24}}
                onChangeText={text => DropDown_searchFilterFunction(text)}
                onClear={text => DropDown_searchFilterFunction('')}
                placeholder="Search here..."
                value={DropDown_search}
                />

                <FlatList
                data={DropDownFilteredData}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={Dropdown_ItemSeparatorView}
                renderItem={Dropdown_ItemView}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                />
            </View>
            </View>
        </Modal>

        {/* REQUESTER INFORMATION */}
        <View style={styles.card}>
            <View style={styles.card_heard}>
            <Text style={styles.card_heard_text}>CHARGEABLE</Text>
            </View>

            <View style={{margin: 10}}>
            <Text style={[styles.text_footer]}>Chargeable ?</Text>

            <BouncyCheckbox
                style={{margin: 10}}
                size={45}
                fillColor="red"
                unfillColor="#FFFFFF"
                isChecked={checkboxState}
                disableBuiltInState={true}
                iconStyle={{borderColor: 'red', borderRadius: 10}}
                innerIconStyle={{borderWidth: 2, borderRadius: 10}}
                textStyle={{fontFamily: 'JosefinSans-Regular'}}
                onPress={() => check()}
            />

            {/*Employee*/}
            <View style={styles.view_style}>
                <Pressable
                onPress={
                    () =>
                    !Editable ? select_dropdown('Labour Type', LobourType) : ''

                    //!Editable ? console.log("EE1"+Editable) : console.log("EE2"+Editable)
                }
                onLongPress={() => setLobourType_key('')}>
                <View pointerEvents={'none'}>
                    <TextInput
                    value={LobourType_key}
                    style={[
                        styles.input,
                        {
                        height: Math.max(Platform.OS === 'ios' ? 50 : 50, height),
                        },
                    ]}
                    inputStyle={[
                        styles.inputStyle,
                        {color: Editable ? '#808080' : '#000'},
                    ]}
                    labelStyle={styles.labelStyle}
                    placeholderStyle={{
                        fontSize: 15,
                        color: '#0096FF',
                    }}
                    onContentSizeChange={event =>
                        setHeight(event.nativeEvent.contentSize.height)
                    }
                    textErrorStyle={styles.textErrorStyle}
                    // onPressOut={()=>{!Editable ? select_dropdown("Asset Group Code",AssetGroupCode) : ''}}
                    label="Labour type"
                    focusColor="#808080"
                    editable={Editable}
                    selectTextOnFocus={Editable}
                    renderRightIcon={() =>
                        Editable ? (
                        ''
                        ) : (
                        <AntDesign
                            style={styles.icon}
                            color={'black'}
                            name={LobourType_key ? 'close' : 'search1'}
                            size={22}
                            disable={true}
                            onPress={() =>
                            LobourType_key
                                ? setLobourType_key('')
                                : select_dropdown('Labour Type', LobourType)
                            }
                        />
                        )
                    }
                    />
                </View>
                </Pressable>
            </View>

            {/* Invoice AMT */}
            <View style={[styles.view_style]}>
                {/* <TextInput
                value={InvoiceAMT}
                style={[ styles.input, { height: Math.max(Platform.OS === 'ios' ? 50 : 50, height)}]}
                keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}]}
                labelStyle={styles.labelStyle}
                placeholderStyle={{ fontSize: 15, color: '#0096FF'}}
                textErrorStyle={styles.textErrorStyle}
                label="Invoice AMT"
                placeholderTextColor="gray"
                focusColor="#808080"
                editable={!Editable}
                selectTextOnFocus={!Editable}
                onChangeText={text => { setInvoiceAMT(text) }}
                renderRightIcon={() =>
                    Editable ? ( '' ) : ( <AntDesign style={styles.icon} name={InvoiceAMT ? 'close' : ''} size={22} disable={true} onPress={() => (InvoiceAMT ? setInvoiceAMT('') : '')} /> )
                }
                /> */}

                <View style={{ flexDirection: 'row'}}>
                  <TouchableOpacity style={{flex: 0.2,borderColor: 'gray', borderRadius: 1, borderWidth: 1,backgroundColor:'#566573',height:50,justifyContent: 'center',padding:5,alignItems:'center',borderTopLeftRadius:5,borderBottomLeftRadius:5}} 
                  onPress={()=>decrement()}>
                      <Ionicons
                          name="remove-outline"
                          color="#FDFEFE"
                          size={25}
                          
                      />
                  </TouchableOpacity>

                  <RNTextInput
                      
                      value={InvoiceAMT}
                     
                      style={{flex: 1, height:50, borderColor: 'gray', borderRadius: 1, borderWidth: 1}}
                      keyboardType="numeric"
                      placeholder="Quantity"
                      maxLength={String(999999999).length} 
                      placeholderTextColor="#0096FF"
                      textAlign="center"
                      onChangeText={(text) => {
                      if (text===''|| text.match(/^\d+(\.\d{0,2})?$/)){

                          
                          setInvoiceAMT(text)
                      
                      }
                      }}
                      
                      
                  
                      
                  />

                  <TouchableOpacity style={{flex: 0.2,borderColor: 'gray', borderRadius: 1, borderWidth: 1,backgroundColor:'#566573',height:50,justifyContent: 'center',padding:5,alignItems:'center',borderTopRightRadius:5,borderBottomRightRadius:5}} 
                  onPress={()=>increment()}>
                      <Ionicons
                          name="add-outline"
                          color="#FDFEFE"
                          size={25}
                          
                      />
                  </TouchableOpacity> 
                </View> 
            </View>

            {/* Total Markup Cost */}
            <View style={[styles.view_style]}>
                <TextInput
                value={TotalMarkupCost}
                style={[ styles.input, { height: Math.max(Platform.OS === 'ios' ? 50 : 50, height)}]}
                keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}]}
                labelStyle={styles.labelStyle}
                placeholderStyle={{ fontSize: 15, color: '#0096FF'}}
                textErrorStyle={styles.textErrorStyle}
                label="Total Markup Cost"
                placeholderTextColor="gray"
                focusColor="#808080"
                editable={!Editable}
                selectTextOnFocus={!Editable}
                onChangeText={text => {
                    setTotalMarkupCost(text);
                }}
                renderRightIcon={() =>
                  Editable ? (
                  ''
                  ) : (
                  <AntDesign
                      style={styles.icon}
                      name={TotalMarkupCost ? 'close' : ''}
                      size={22}
                      disable={true}
                      onPress={() => TotalMarkupCost ? setTotalMarkupCost('') : '' }
                  />
                  )
                }
                />
            </View>
            </View>
        </View>

        <View style={styles.bottomView}>
          <TouchableOpacity
          style={{
              width: '100%',
              height: 60,
              backgroundColor: '#8BC34A',
              alignItems: 'center',
              justifyContent: 'center',
          }}
          onPress={get_validation}>
          <Text style={{color: 'white', fontSize: 16}}>{'Save'}</Text>
          </TouchableOpacity>
        </View>
       </SafeAreaProvider>
      </DismissKeyboard>
  );
};

export default Chargeable;

const {width} = Dimensions.get('window');

const IMAGE_WIDTH = (width - 20) / 3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0e0eb',
  },

  card: {
    backgroundColor: '#FFFFFF',
    margin: 10,
    paddingBottom: 20,
    borderRadius: 10,
  },

  card_heard: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#0096FF',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },

  card_heard_text: {
    fontSize: 15,
    justifyContent: 'center',
    color: '#ffffffff',
    fontWeight: 'bold',
  },

  text_stytle: {
    width: '100%',
    fontSize: 15,
    textAlign: 'left',
  },

  card_01: {
    backgroundColor: '#FFFFFF',
    margin: 10,
    borderRadius: 10,
  },

  bottomView: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },

  text_footer: {
    fontSize: 13,
    color: '#42A5F5',
  },

  text_stytle: {
    width: '100%',
    fontSize: 15,
    textAlign: 'left',
  },
  item: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },

  modal: {
    width: '100%',
    height: '30%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'solid',
    backgroundColor: 'white',
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

  textErrorStyle: {fontSize: 16},

  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 5,
    top: -10,
    zIndex: 999,
    color: '#0096FF',
    paddingHorizontal: 8,
    fontSize: 13,
  },
  model2_cardview: {
    flex: 1,
    marginTop: 50,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  dropdown_style: {
    margin: 10,
  },
});
