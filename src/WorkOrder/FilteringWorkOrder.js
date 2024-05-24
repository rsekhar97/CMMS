import React, {Fragment} from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, RefreshControl, Dimensions, Modal, ImageBackground, SafeAreaView, FlatList, Pressable, TouchableWithoutFeedback, Keyboard, } from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Appbar} from 'react-native-paper';
import ProgressLoader from 'rn-progress-loader';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {TextInput} from 'react-native-element-textinput';
import moment from 'moment';
import {SearchBar} from 'react-native-elements';
import {openDatabase} from 'react-native-sqlite-storage';
import DateTimePicker from 'react-native-modal-datetime-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';

var db = openDatabase({name: 'CMMS.db'});

const DismissKeyboard = ({children}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const deviceWidth = Dimensions.get('screen').width;
const deviceHeight = Dimensions.get('screen').height;

const FilteringWorkOrder = ({navigation, route}) => {


  const _goBack = () => {
    navigation.navigate('MainTabScreen');
  };

  const [spinner, setspinner] = React.useState(false);

  const [WorkOrderCategory,setWorkOrderCategory] = React.useState([
    { key:"C", label:"Corrective", column1 :"1" },
    { key:"P", label:"Preventive", column1 :"1" }])

  const [WorkOrderStatus, setWorkOrderStatus] = React.useState([]);
  const [Originator, setOriginator] = React.useState([]);
  const [WorkArea, setWorkArea] = React.useState([]);
  const [WorkType, setWorkType] = React.useState([]);
  const [AssetLocation, setAssetLocation] = React.useState([]);
  const [AssetLevel, setAssetLevel] = React.useState([]);
  const [CostCenter, setCostCenter] = React.useState([]);

  const [refresh, setRefresh] = React.useState(false);

  const [WR_No, setWR_No] = React.useState('');
  const [WO_No, setWO_No] = React.useState('');
  const [WO_Description, setWO_Description] = React.useState('');
  const [WO_Assetno, setWO_Assetno] = React.useState('');
  const [WO_AssetDescription, setWO_AssetDescription] = React.useState('');


  const [WorkOrderCategory_Key, setWorkOrderCategory_Key] = React.useState('');
  const [WorkOrderStatus_key, setWorkOrderStatus_key] = React.useState('');
  const [Originator_Key, setOriginator_Key] = React.useState('');
  const [WorkArea_Key, setWorkArea_Key] = React.useState('');
  const [WorkType_Key, setWorkType_Key] = React.useState('');
  const [Supervisor_ID_Key, setSupervisor_ID_Key] = React.useState('');
  const [AssetLocation_Key, setAssetLocation_Key] = React.useState('');
  const [AssetLevel_Key, setAssetLevel_Key] = React.useState('');
  const [CostCenter_Key, setCostCenter_Key] = React.useState('');
  const [Assignto_Key, setAssignto_Key] = React.useState('');


  const [WorkOrderCategory_label, setWorkOrderCategory_label] = React.useState('');
  const [WorkOrderStatus_label, setWorkOrderStatus_label] = React.useState('');
  const [Originator_label, setOriginator_label] = React.useState('');
  const [WorkArea_label, setWorkArea_label] = React.useState('');
  const [WorkType_label, setWorkType_label] = React.useState('');
  const [Supervisor_ID_label, setSupervisor_ID_label] = React.useState('');
  const [AssetLocation_label, setAssetLocation_label] = React.useState('');
  const [AssetLevel_label, setAssetLevel_label] = React.useState('');
  const [CostCenter_label, setCostCenter_label] = React.useState('');
  const [Assignto_label, setAssignto_label] = React.useState('');

  const [isDatepickerVisible, setDatePickerVisibility] = React.useState(false);
  const [WO_fromdate, setWO_fromdate] = React.useState('');
  const [WO_todate, setWO_todate] = React.useState('');

  const [datetitle, setDatetitle] = React.useState('');

  const [showqrcode, setshowqrcode] = React.useState(false);
  const [scan, setscan] = React.useState(false);
  const [ScanResult, setScanResult] = React.useState(false);
  const [result, setresult] = React.useState(null);

  const [textvalue, settextvalue] = React.useState('');
  const [dropdown_data, setdata] = React.useState([]);
  const [filteredDataSource, setFilteredDataSource] = React.useState([]);
  const [modalVisible, setmodalVisible] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [refreshing, setRefreshing] = React.useState(false);

  //Alert
  const [Show, setShow] = React.useState(false);
  const [Theme, setTheme] = React.useState('');
  const [Title, setTitle] = React.useState('');

  React.useEffect(() => {
    const focusHander = navigation.addListener('focus', () => {
      fetchData();
    });
    return focusHander;
  }, [navigation]);

  const fetchData = async () => {

    setspinner(true); 

    setWorkOrderCategory_Key('')
    setWorkOrderStatus_key('')
    setWR_No('');
    setWO_No('');
    setWO_Description('');
    setWO_Assetno('');
    setWO_AssetDescription('');
    setOriginator_Key('');
    setWorkArea_Key('');
    setAssetLocation_Key('');
    setAssetLevel_Key('');
    setCostCenter_Key('');
    setWO_fromdate('');
    setWO_todate('');
    setWorkType_Key('');
    setSupervisor_ID_Key('')
    setAssignto_Key('')

    setWorkOrderCategory_label('')
    setWorkOrderStatus_label('')
    setOriginator_label('')
    setWorkArea_label('')
    setWorkType_label('')
    setSupervisor_ID_label('')
    setAssetLocation_label('')
    setAssetLevel_label('')
    setCostCenter_label('')
    setWorkType_label('')
    setSupervisor_ID_label('')
    setAssignto_label('')


    db.transaction(function (txn) {

      //employee
      txn.executeSql( 'SELECT * FROM employee', [], (tx, { rows }) => { setOriginator(rows.raw())});
      
      //workarea
      txn.executeSql( 'SELECT * FROM workarea', [], (tx, { rows }) => { setWorkArea(rows.raw())});
      
      //workorderstatus
      txn.executeSql(`SELECT * FROM workorderstatus where  wrk_sts_typ_cd NOT IN('CANCEL') order by wrk_sts_desc `, [], (tx, { rows }) => { setWorkOrderStatus(rows.raw())});
      
      //worktype
      txn.executeSql( 'SELECT * FROM worktype', [], (tx, { rows }) => { setWorkType(rows.raw())});
     
      //assetlocation
      txn.executeSql( 'SELECT * FROM assetlocation', [], (tx, { rows }) => { setAssetLocation(rows.raw())});
      
      //assetlevel
      txn.executeSql( 'SELECT * FROM assetlevel', [], (tx, { rows }) => { setAssetLevel(rows.raw())});
      
      //costcenter
      txn.executeSql( 'SELECT * FROM costcenter', [], (tx, { rows }) => { setCostCenter(rows.raw())});

     

    });

   

    setspinner(false); 
  };

  const showDatePicker = title => {
    //console.warn(title)
    setDatePickerVisibility(true);
    setDatetitle(title);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    let fromDate = moment(date).format('yyyy-MM-DD');
    //console.warn(fromDate)
    if (datetitle === 'from') {
      setWO_fromdate(fromDate);
      if(!WO_todate){
        setWO_todate(fromDate);
      }
     
    } else {
      setWO_todate(fromDate);
    }

    hideDatePicker();
  };

  const onSuccess = e => {
    console.log(JSON.stringify(e));

    const check = e.data.split('\r\n');
    console.log('scanned data' + check[0]);
    setWO_Assetno(check[0]);
    
    setresult(e);
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

  const OpenQRCode = () => {
    setshowqrcode(true);
    scanAgain(true);
  };

  //Selection Dropdown
  const get_dropdown = (dropname, data) => {
    //console.log(data)
    settextvalue(dropname);
    setFilteredDataSource(data);
    setdata(data);
    setmodalVisible(!modalVisible);
  };

  //Dropdown Filter
  const searchFilterFunction = text => {
    // Check if searched text is not blank
    if (text) {
      let newData;

      if (textvalue == 'Originator' || textvalue == 'Supervisor_ID'|| textvalue == 'Assign To') {
        newData = dropdown_data.filter(function (item) {
          const itemData = `${item.emp_mst_empl_id.toUpperCase()},
                ,${item.emp_mst_title.toUpperCase()}
                ,${item.emp_mst_name.toUpperCase()})`;

          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      } else if (textvalue == 'Cost Center') {
        newData = dropdown_data.filter(function (item) {
          const itemData = `${item.costcenter.toUpperCase()},
                ,${item.descs.toUpperCase()})`;

          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      } else if (textvalue == 'Work Area') {
        newData = dropdown_data.filter(function (item) {
          const itemData = `${item.mst_war_work_area.toUpperCase()},
                ,${item.mst_war_desc.toUpperCase()})`;

          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      }else if (textvalue == 'Work Type') {
        newData = dropdown_data.filter(function (item) {
          const itemData = `${item.wrk_typ_typ_cd.toUpperCase()},
                ,${item.wrk_typ_desc.toUpperCase()})`;

          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      } else if (textvalue == 'Asset Location') {
        newData = dropdown_data.filter(function (item) {
          const itemData = `${item.ast_loc_ast_loc.toUpperCase()},
                ,${item.ast_loc_desc.toUpperCase()})`;

          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      } else if (textvalue == 'Asset Level') {
        newData = dropdown_data.filter(function (item) {
          const itemData = `${item.ast_lvl_ast_lvl.toUpperCase()},
                ,${item.ast_lvl_desc.toUpperCase()})`;

          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      }else if (textvalue == 'Work Order Status') {
        newData = dropdown_data.filter(function (item) {
        const itemData = `${item.wrk_sts_status.toUpperCase()},
            ,${item.wrk_sts_desc.toUpperCase()})`;

        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
        });
    }
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(dropdown_data);
      setSearch(text);
    }
  };

  //Dropdown Refresh
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);

    if (textvalue == 'Originator' || textvalue == 'Supervisor_ID'|| textvalue == 'Assign To') {
      setFilteredDataSource(Originator);
    } else if (textvalue == 'Cost Center') {
      setFilteredDataSource(CostCenter);
    } else if (textvalue == 'Work Area') {
      setFilteredDataSource(WorkArea);
    } else if (textvalue == 'Work Type') {
      setFilteredDataSource(WorkType);
    } else if (textvalue == 'Asset Location') {
      setFilteredDataSource(AssetLocation);
    } else if (textvalue == 'Asset Level') {
      setFilteredDataSource(AssetLevel);
    }else if (textvalue == 'Work Order Status') {
      setFilteredDataSource(WorkOrderStatus);
    }else if (textvalue == 'Work Order Category') {
      setFilteredDataSource(WorkOrderCategory);
    }

    setRefreshing(false);
  }, [refreshing]);

  //Dropdown XML
  const renderText = item => {
    if (textvalue == 'Originator' || textvalue == 'Supervisor_ID'|| textvalue == 'Assign To') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> ID : </Text>
            </View>
            <View style={{flex: 4}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.emp_mst_empl_id} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Name : </Text>
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
      )
    } else if (textvalue == 'Cost Center') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Cost Center : </Text>
            </View>
            <View style={{flex: 2}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.costcenter} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Description : </Text>
            </View>
            <View style={{flex: 2}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.descs} </Text>
            </View>
          </View>
        </View>
      );
    } else if (textvalue == 'Work Area') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Work Area : </Text>
            </View>
            <View style={{flex: 2}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.mst_war_work_area} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Description : </Text>
            </View>
            <View style={{flex: 2}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.mst_war_desc} </Text>
            </View>
          </View>
        </View>
      );
    } else if (textvalue == 'Work Type') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Type Code : </Text>
            </View>
            <View style={{flex: 2}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.wrk_typ_typ_cd} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Description : </Text>
            </View>
            <View style={{flex: 2}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.wrk_typ_desc} </Text>
            </View>
          </View>
        </View>
      );
    } else if (textvalue == 'Asset Location') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Asset Location : </Text>
            </View>
            <View style={{flex: 1.5}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.ast_loc_ast_loc} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Description : </Text>
            </View>
            <View style={{flex: 1.5}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.ast_loc_desc} </Text>
            </View>
          </View>
        </View>
      );
    } else if (textvalue == 'Asset Level') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Asset Level : </Text>
            </View>
            <View style={{flex: 2}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.ast_lvl_ast_lvl} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Description : </Text>
            </View>
            <View style={{flex: 2}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.ast_lvl_desc} </Text>
            </View>
          </View>
        </View>
      );
    } else if (textvalue == 'Work Order Status') {
      return (
          <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
              <View style={{flex: 1}}>
                <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Status Type Code : </Text>
              </View>
              <View style={{flex: 1}}>
                <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.wrk_sts_typ_cd} </Text>
              </View>
          </View>
  
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
              <View style={{flex: 1}}>
                <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Description : </Text>
              </View>
              <View style={{flex: 1}}>
                <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.wrk_sts_desc} </Text>
              </View>
          </View>
  
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
              <View style={{flex: 1}}>
                <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Status : </Text>
              </View>
              <View style={{flex: 1}}>
                <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.wrk_sts_status} </Text>
              </View>
          </View>
          </View>
      );
    } else if (textvalue == 'Work Order Category') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Type Code : </Text>
            </View>
            <View style={{flex: 2}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.key} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Description : </Text>
            </View>
            <View style={{flex: 2}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.label} </Text>
            </View>
          </View>
        </View>
      );
    }
  };

  //Dropdown View
  const ItemView = ({item}) => {
    return (
      <TouchableOpacity onPress={() => getItem(item)}>
        {renderText(item)}
      </TouchableOpacity>
    );
  };

  //Dropdown Serparator line
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

  //SELECT Dropdown ITEM
  const getItem = item => {
    // Function for click on an item
    //alert('Id : ' + JSON.stringify(item) );

    if (textvalue == 'Originator') {
      setOriginator_Key(item.emp_mst_empl_id + ' : ' + item.emp_mst_name);
      setOriginator_label(item.emp_mst_empl_id);
    } else if (textvalue == 'Cost Center') {
      setCostCenter_Key(item.costcenter + ' : ' + item.descs);
      setCostCenter_label(item.costcenter);
    } else if (textvalue == 'Work Area') {
      setWorkArea_Key(item.mst_war_work_area + ' : ' + item.mst_war_desc);
      setWorkArea_label(item.mst_war_work_area);
    } else if (textvalue == 'Asset Location') {
      setAssetLocation_Key(item.ast_loc_ast_loc + ' : ' + item.ast_loc_desc);
      setAssetLocation_label(item.ast_loc_ast_loc);
    } else if (textvalue == 'Asset Level') {
      setAssetLevel_Key(item.ast_lvl_ast_lvl + ' : ' + item.ast_lvl_desc);
      setAssetLevel_label(item.ast_lvl_ast_lvl);
    }else if (textvalue == 'Supervisor_ID') {
      setSupervisor_ID_Key(item.emp_mst_empl_id + ' : ' + item.emp_mst_name);
      setSupervisor_ID_label(item.emp_mst_empl_id);
    }else if (textvalue == 'Work Type') {
      setWorkType_Key(item.wrk_typ_typ_cd + ' : ' + item.wrk_typ_desc);
      setWorkType_label(item.wrk_typ_typ_cd);
    }else if (textvalue == 'Work Order Status') {
      setWorkOrderStatus_key(item.wrk_sts_status + ' : ' + item.wrk_sts_desc);
      setWorkOrderStatus_label(item.wrk_sts_status)
    }else if (textvalue == 'Work Order Category') {
      setWorkOrderCategory_Key(item.key + ' : ' + item.label);
      setWorkOrderCategory_label(item.key)
    }else if (textvalue == 'Assign To') {
      setAssignto_Key(item.emp_mst_empl_id + ' : ' + item.emp_mst_name);
      setAssignto_label(item.emp_mst_empl_id)
    }

    setSearch('');
    setmodalVisible(!modalVisible);
  };

  const onretrieve = () => {

    var C = [];
    var P = [];
    WorkOrderCategory.map(item => {

      if(item.label === 'Corrective' && item.column1 === '1'){

        C.push(item.key);   
        

      }else if( item.label === 'Preventive' && item.column1 === '1'){
        P.push(item.key);  
      }

    })


    console.log('scan C if'+C.length)
    console.log('scan P if'+P.length)

    var WOC,WOC1
    if(C.length > 0 && P.length > 0){
      WOC =''
      WOC1 ='ALL'
    }else if(C.length > 0){
      WOC ='C'
      WOC1 ='C'
    }else if(P.length > 0){
      WOC ='P'
      WOC1 ='P'
    }else{
      WOC =''
      WOC1 =''
    }

    var S = [];
    WorkOrderStatus.map(item => {

      if(item.column1 === '1'){

        S.push(item.wrk_sts_status);   
        
      }

    })

    console.log('scan S if'+S.length)

    var WOS =''
    if(S.length > 0 ){  
      
      for(var i=0; i< S.length; i++){
        WOS += S[i];  // concat Array value to a string variable
        if(i < (S.length-1) ){
          WOS += "','";  // add separator
        }
      }

    }else{
      WOS =''
    }

    console.log('scan WOS if'+ WOS)

    if (
      !WOC &&
      !WOC1 &&
      !WOS &&
      !WR_No &&
      !WO_No &&
      !WO_Description &&
      !WO_Assetno &&
      !WO_AssetDescription &&
      !Originator_label &&
      !Assignto_label &&
      !WorkArea_label &&
      !WorkType_label &&
      !WorkArea_label &&
      !Supervisor_ID_label &&
      !AssetLocation_label &&
      !AssetLevel_label &&
      !CostCenter_label &&
      !WO_fromdate &&
      !WO_todate

    ) {
      //alert('Please select at least one criteria to search');
      setAlert(true,'warning','Please select at least one criteria to search');
      return;
    } else {



     
     
     let  userStr = {
       
       
        WOC1 : WOC,
        WOS : WOS,
        WR_No : WR_No,
        WO_No : WO_No,
        WO_Description : WO_Description,
        WO_Assetno : WO_Assetno,
        WO_AssetDescription : WO_AssetDescription,
        Originator_label : Originator_label,
        Assignto_label : Assignto_label,
        WorkArea_label : WorkArea_label,
        WorkType_label : WorkType_label,
        Supervisor_ID_label : Supervisor_ID_label,
        AssetLocation_label : AssetLocation_label,
        AssetLevel_label : AssetLevel_label,
        CostCenter_label : CostCenter_label,
        WO_fromdate : WO_fromdate,
        WO_todate : WO_todate,

      };

      console.log('USE DATA Work Order Listing: ' + JSON.stringify(userStr));

      navigation.navigate('WorkOrderListing', {
        Screenname: 'FilteringWorkOrder',

        WOF_Workordercategory: WOC,
        WOF_Workorderstatus: WOS,
        WOF_WorkrequestNo: WR_No,
        WOF_WorkorderNo: WO_No,
        WOF_WorkorderDesc: WO_Description,
        WOF_AssetNo: WO_Assetno,
        WOF_AssetDesc: WO_AssetDescription,
        WOF_Originator: Originator_label,
        WOF_Assignto: Assignto_label,
        WOF_WorkArea: WorkArea_label,
        WOF_WorkType: WorkType_label,
        WOF_SupervisorID: Supervisor_ID_label,
        WOF_AssetLocation: AssetLocation_label,
        WOF_AssetLevel: AssetLevel_label,
        WOF_CostCenter: CostCenter_label,
        WOF_Fromdate: WO_fromdate,
        WOF_Todate: WO_todate,
      });
    }
  };


  //Dropdown View
  const WOC_ItemView = ({item}) => {


    let cor1,cor2
    if(item.column1 == "0"){
      cor1 ='#E5E7E9'
      cor2 ='#000'
    }else{
      cor1 ='#8BC34A'
      cor2 ='#FFFF'
    }
    return (
      <TouchableOpacity onPress={() => WOC_getItem(item)}>
        <View style={{flex:1,alignItems:'center',margin:5}}>
            <View style={{backgroundColor:cor1,padding:12,borderRadius:20,margin:5,width:120,alignItems:'center'}}>
              <Text style={{color:cor2,fontSize: 12,alignItems:'center',fontWeight: 'bold'}} > {item.label}</Text>
            </View>   
        </View>
        
      </TouchableOpacity>
    );
  };

  //SELECT Dropdown ITEM
  const WOC_getItem = items => {
    // Function for click on an item
  //  alert('Id : ' + JSON.stringify(item) );

    WorkOrderCategory.map(item => {
      if (item.label == items.label) {

          if(item.column1 === '1' || items.column1 === '1'){
            item.column1 = '0'
          }else if(item.column1 === '0' || items.column1 === '0'){
            item.column1 = '1'
          }
       
        return item;
      }
      return item;
    });
   
    setRefresh(!refresh)
    //console.log('s',JSON.stringify(WorkOrderStatus))
    
  };

  //Dropdown View
  const WOS_ItemView = ({item}) => {


    let cor1,cor2
    if(item.column1 == "0"){
      cor1 ='#E5E7E9'
      cor2 ='#000'
    }else{
      cor1 ='#8BC34A'
      cor2 ='#FFFF'
    }
    return (
      <TouchableOpacity onPress={() => WOS_getItem(item)}>
        <View style={{flex:1,alignItems:'center'}}>
            <View style={{backgroundColor:cor1,padding:12,borderRadius:20,margin:5,alignItems:'center'}}>
              <Text style={{color:cor2,fontSize: 12,alignItems:'center',fontWeight: 'bold'}} > {item.wrk_sts_desc}</Text>
            </View>   
        </View>
        
      </TouchableOpacity>
    );
  };

  //Dropdown Serparator line
  const WOS_ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View style={{ height: 0, width: '100%', backgroundColor: '#C8C8C8', }} />
    );
  };

  //SELECT Dropdown ITEM
  const WOS_getItem = items => {
    // Function for click on an item
  //  alert('Id : ' + JSON.stringify(item) );

    WorkOrderStatus.map(item => {
      if (item.wrk_sts_desc == items.wrk_sts_desc) {

          if(item.column1 === '1' || items.column1 === '1'){
            item.column1 = '0'
          }else if(item.column1 === '0' || items.column1 === '0'){
            item.column1 = '1'
          }
        
        return item;
      }
      return item;
    });
    
    setRefresh(!refresh)
    //console.log('s',JSON.stringify(WorkOrderStatus))
    
  };

  const setAlert =(show,theme,title)=>{


    setShow(show);
    setTheme(theme);
    setTitle(title);
    

  }

  return (

    <DismissKeyboard>
      <SafeAreaProvider>
        <Appbar.Header style={{backgroundColor:"#42A5F5"}}>
          <View style={{flexDirection:'row',flex:1,justifyContent:'space-between'}}>
            <Pressable onPress={_goBack}>
              <View style={{flexDirection:'row',alignItems:'center',}}>

                <FontAwesome 
                    name="angle-left"
                    color='#fff'
                    size={55}
                    style={{marginLeft:15,marginBottom:5}}
                  
                />  

                <Text style={{fontSize:20, justifyContent:'center',textAlign:'center',color:'#fff',fontWeight: 'bold',marginLeft:15}}>Filtering Work Order</Text>
              </View >

            </Pressable>
          </View>
        </Appbar.Header>

        <ProgressLoader visible={spinner} isModal={true} isHUD={true} hudColor={'#808080'} color={'#FFFFFF'} />

        <SCLAlert 
            theme={Theme} 
            show={Show} 
            title={Title}>

                <SCLAlertButton theme={Theme}   onPress={()=>setShow(false)}>OK</SCLAlertButton>
        </SCLAlert>

        <DateTimePicker
          isVisible={isDatepickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />

        <Modal visible={showqrcode}>
          <View style={styles.scrollViewStyle}>
            <Fragment>
              <SafeAreaView
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text></Text>
                <TouchableOpacity onPress={() => setshowqrcode(false)}>
                  <AntDesign
                    name="close"
                    color="#fff"
                    size={30}
                    style={{marginRight: 35, marginTop: 15}}
                  />
                </TouchableOpacity>
              </SafeAreaView>
              {!scan && !ScanResult && (
                <View style={styles.qr_cardView}>
                  <Image
                    source={require('../../images/camera.png')}
                    style={{height: 36, width: 36}}></Image>
                  <Text numberOfLines={8} style={styles.descText}>
                    Please move your camera {'\n'} over the QR Code
                  </Text>
                  <Image
                    source={require('../../images/qrcodescan.png')}
                    style={{margin: 20}}></Image>
                  <TouchableOpacity onPress={activeQR} style={styles.buttonScan}>
                    <View style={styles.buttonWrapper}>
                      {/* <Image source={require('../../images/camera.png')} style={{height: 36, width: 36}}></Image> */}
                      <Text style={{...styles.buttonTextStyle, color: '#2196f3'}}>
                        Scan QR Code
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              {ScanResult && (
                <Fragment>
                  <Text style={styles.textTitle1}>Result</Text>
                  <View
                    style={ScanResult ? styles.scanCardView : styles.cardView}>
                    <Text>Type : {result.type}</Text>
                    <Text>Result : {result.data}</Text>
                    <Text numberOfLines={1}>RawData: {result.rawData}</Text>
                    <TouchableOpacity
                      onPress={scanAgain}
                      style={styles.buttonScan}>
                      <View style={styles.buttonWrapper}>
                        {/* <Image source={require('./images/camera.png')} style={{height: 36, width: 36}}></Image> */}
                        <Text
                          style={{...styles.buttonTextStyle, color: '#2196f3'}}>
                          Click to scan again
                        </Text>
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
                  topContent={
                    <Text style={styles.centerText}>
                      Please move your camera {'\n'} over the QR Code
                    </Text>
                  }
                  bottomContent={
                    <View>
                      <ImageBackground style={styles.bottomContent}>
                        {/* <TouchableOpacity style={styles.buttonScan2} 
                                              onPress={() => this.scanner.reactivate()} 
                                              onLongPress={() => this.setState({ scan: false })}>
                                              <Image source={require('../../images/camera.png')}></Image>
                                          </TouchableOpacity> */}

                        <TouchableOpacity onPress={scanAgain2}>
                          <View>
                            {/* <Image source={require('./images/camera.png')} style={{height: 36, width: 36}}></Image> */}
                            <Text
                              style={{
                                color: '#FFFF',
                                textAlign: 'center',
                                fontSize: 18,
                                fontWeight: 'bold',
                              }}>
                              Cancel Scan
                            </Text>
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

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
           //Alert.alert('Closed');
            setmodalVisible(!modalVisible);
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
                  onPress={() => setmodalVisible(!modalVisible)}
                />
              </View>

              <SearchBar
                lightTheme
                round
                inputStyle={{color: '#000'}}
                inputContainerStyle={{backgroundColor: '#FFFF'}}
                searchIcon={{size: 24}}
                onChangeText={text => searchFilterFunction(text)}
                onClear={text => searchFilterFunction('')}
                placeholder="Search here..."
                value={search}
              />

              <FlatList
                data={filteredDataSource}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={ItemSeparatorView}
                renderItem={ItemView}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
              />
            </View>
          </View>
        </Modal>

        <View style={styles.container}>
          <ScrollView
            style={{flex: 1, marginBottom: 80}}
            contentContainerStyle={[{justifyContent: 'space-between'}]}>
            <View>
              
              <View>

                <Text style={{fontSize:15, justifyContent:'center',color:'#42A5F5',marginLeft:15}}>Work Order Category</Text>

                <FlatList
                  numColumns={3}
                  data={WorkOrderCategory}
                  keyExtractor={(item, index) => index.toString()}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  ItemSeparatorComponent={WOS_ItemSeparatorView}
                  renderItem={WOC_ItemView}
                  extraData={refresh} 
                  
                />


            </View>
              <View style={{marginLeft:15, marginRight: 15}}>

                <Text style={{fontSize:15, justifyContent:'center',color:'#42A5F5'}}>Work Order Status</Text>

                <FlatList
                  numColumns={2}
                  data={WorkOrderStatus}
                  keyExtractor={(item, index) => index.toString()}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  ItemSeparatorComponent={WOS_ItemSeparatorView}
                  renderItem={WOS_ItemView}
                  extraData={refresh} 
                  
                />


              </View>
              {/* Work Order Status*/}
              {/* <View style={styles.view_style}>
                <Pressable
                  onPress={() => get_dropdown('Work Order Category', WorkOrderCategory)}
                  onLongPress={() => setWorkOrderCategory_Key('')}>
                  <View pointerEvents={'none'}>
                    <TextInput
                      value={WorkOrderCategory_Key}
                      style={styles.input}
                      inputStyle={styles.inputStyle}
                      labelStyle={styles.labelStyle}
                      placeholderStyle={styles.placeholderStyle}
                      textErrorStyle={styles.textErrorStyle}
                      label="Work Order Category"
                      placeholderTextColor="gray"
                      focusColor="#808080"
                      editable={false}
                      selectTextOnFocus={false}
                      renderRightIcon={() => (
                        <AntDesign
                          style={styles.icon}
                          color={'black'}
                          name={WorkOrderCategory_Key ? 'close' : 'search1'}
                          size={22}
                          disable={true}
                          onPress={() =>
                            WorkOrderCategory_Key
                              ? setWorkOrderCategory_Key('')
                              : get_dropdown('Work Order Status', WorkOrderCategory)
                          }
                        />
                      )}
                    />
                  </View>
                </Pressable>
              </View> */}

              {/* Work Order Status*/}
              {/* <View style={styles.view_style}>
                <Pressable
                  onPress={() => get_dropdown('Work Order Status', WorkOrderStatus)}
                  onLongPress={() => setWorkOrderStatus_key('')}>
                  <View pointerEvents={'none'}>
                    <TextInput
                      value={WorkOrderStatus_key}
                      style={styles.input}
                      inputStyle={styles.inputStyle}
                      labelStyle={styles.labelStyle}
                      placeholderStyle={styles.placeholderStyle}
                      textErrorStyle={styles.textErrorStyle}
                      label="Work Order Status"
                      placeholderTextColor="gray"
                      focusColor="#808080"
                      editable={false}
                      selectTextOnFocus={false}
                      renderRightIcon={() => (
                        <AntDesign
                          style={styles.icon}
                          color={'black'}
                          name={WorkOrderStatus_key ? 'close' : 'search1'}
                          size={22}
                          disable={true}
                          onPress={() =>
                            WorkOrderStatus_key
                              ? setWorkOrderStatus_key('')
                              : get_dropdown('Work Order Status', WorkOrderStatus)
                          }
                        />
                      )}
                    />
                  </View>
                </Pressable>
              </View> */}


              {/* WR No */}
              <View style={styles.view_style}>
                <TextInput
                  value={WR_No}
                  style={styles.input}
                  inputStyle={styles.inputStyle}
                  labelStyle={styles.labelStyle}
                  placeholderStyle={styles.placeholderStyle}
                  textErrorStyle={styles.textErrorStyle}
                  label="Work Request No"
                  placeholderTextColor="gray"
                  focusColor="#808080"
                  onChangeText={text => setWR_No(text)}
                />
              </View>

              {/* WO No */}
              <View style={styles.view_style}>
                <TextInput
                  value={WO_No}
                  style={styles.input}
                  inputStyle={styles.inputStyle}
                  labelStyle={styles.labelStyle}
                  placeholderStyle={styles.placeholderStyle}
                  textErrorStyle={styles.textErrorStyle}
                  label="Work Order No"
                  placeholderTextColor="gray"
                  focusColor="#808080"
                  onChangeText={text => setWO_No(text)}
                />
              </View>

              <View
                style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                {/* From Date */}
                <View style={styles.view_style}>
                  <Pressable
                    onPress={() => showDatePicker('from')}
                    onLongPress={() => setWO_fromdate('')}>
                    <View pointerEvents={'none'}>
                      <TextInput
                        value={WO_fromdate}
                        style={[styles.input]}
                        inputStyle={styles.inputStyle}
                        labelStyle={styles.labelStyle}
                        placeholderStyle={styles.placeholderStyle}
                        textErrorStyle={styles.textErrorStyle}
                        label="From Date"
                        placeholderTextColor="gray"
                        focusColor="#808080"
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
                    onPress={() => showDatePicker('to')}
                    onLongPress={() => setWO_todate('')}>
                    <View pointerEvents={'none'}>
                      <TextInput
                        value={WO_todate}
                        style={styles.input}
                        inputStyle={styles.inputStyle}
                        labelStyle={styles.labelStyle}
                        placeholderStyle={styles.placeholderStyle}
                        textErrorStyle={styles.textErrorStyle}
                        label="To Date"
                        placeholderTextColor="gray"
                        focusColor="#808080"
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

              

              <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                {/* Asset No */}
                <View style={styles.view_style}>
                  <TextInput
                    value={WO_Assetno}
                    style={styles.input}
                    inputStyle={styles.inputStyle}
                    labelStyle={styles.labelStyle}
                    placeholderStyle={styles.placeholderStyle}
                    textErrorStyle={styles.textErrorStyle}
                    label="Asset No"
                    placeholderTextColor="gray"
                    focusColor="#808080"
                    onChangeText={text => setWO_Assetno(text)}
                  />
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

              {/* Asset Description */}
              <View style={styles.view_style}>
                <TextInput
                  value={WO_AssetDescription}
                  style={[styles.input]}
                  multiline={true}
                  numberOfLines={4}
                  inputStyle={styles.inputStyle}
                  labelStyle={styles.labelStyle}
                  placeholderStyle={styles.placeholderStyle}
                  textErrorStyle={styles.textErrorStyle}
                  label="Asset Description"
                  placeholderTextColor="gray"
                  clearButtonMode="always"
                  focusColor="#808080"
                  onChangeText={text => {
                    setWO_AssetDescription(text);
                  }}
                />
              </View>

              {/* WR Description */}
              <View style={styles.view_style}>
                <TextInput
                  value={WO_Description}
                  style={[styles.input]}
                  multiline={true}
                  numberOfLines={4}
                  inputStyle={styles.inputStyle}
                  labelStyle={styles.labelStyle}
                  placeholderStyle={styles.placeholderStyle}
                  textErrorStyle={styles.textErrorStyle}
                  label="Work Order Description"
                  placeholderTextColor="gray"
                  clearButtonMode="always"
                  focusColor="#808080"
                  onChangeText={text => {
                    setWO_Description(text);
                  }}
                />
              </View>

              {/* Cost Center */}
              <View style={styles.view_style}>
                <Pressable
                  onPress={() => get_dropdown('Cost Center', CostCenter)}
                  onLongPress={() => {setCostCenter_Key(''),setCostCenter_label('')}}>
                  <View pointerEvents={'none'}>
                    <TextInput
                      value={CostCenter_Key}
                      style={styles.input}
                      inputStyle={styles.inputStyle}
                      labelStyle={styles.labelStyle}
                      placeholderStyle={styles.placeholderStyle}
                      textErrorStyle={styles.textErrorStyle}
                      label="Charge Cost Center"
                      placeholderTextColor="gray"
                      focusColor="#808080"
                      editable={false}
                      selectTextOnFocus={false}
                      renderRightIcon={() => (
                        <AntDesign
                          style={styles.icon}
                          color={'black'}
                          name={CostCenter_Key ? 'close' : 'search1'}
                          size={22}
                          disable={true}
                          
                        />
                      )}
                    />
                  </View>
                </Pressable>
              </View>

              {/* Supervisor ID */}
              <View style={styles.view_style}>
                <Pressable
                  onPress={() => { get_dropdown('Supervisor_ID', Originator); }}
                  onLongPress={() => {setSupervisor_ID_Key(''),setSupervisor_ID_label('')}}>
                  <View pointerEvents={'none'}>
                    <TextInput
                      value={Supervisor_ID_Key}
                      style={styles.input}
                      inputStyle={styles.inputStyle}
                      labelStyle={styles.labelStyle}
                      placeholderStyle={styles.placeholderStyle}
                      textErrorStyle={styles.textErrorStyle}
                      label="Supervisor ID"
                      placeholderTextColor="gray"
                      focusColor="#808080"
                      editable={false}
                      selectTextOnFocus={false}
                      renderRightIcon={() => (
                        <AntDesign
                          style={styles.icon}
                          color={'black'}
                          name={Supervisor_ID_Key ? 'close' : 'search1'}
                          size={22}
                          disable={true}
                          
                        />
                      )}
                    />
                  </View>
                </Pressable>
              </View>

              {/* Originator */}
              <View style={styles.view_style}>
                <Pressable
                  onPress={() => { get_dropdown('Originator', Originator); }}
                  onLongPress={() => {setOriginator_Key(''),setOriginator_label('')}}>
                  <View pointerEvents={'none'}>
                    <TextInput
                      value={Originator_Key}
                      style={styles.input}
                      inputStyle={styles.inputStyle}
                      labelStyle={styles.labelStyle}
                      placeholderStyle={styles.placeholderStyle}
                      textErrorStyle={styles.textErrorStyle}
                      label="Originator"
                      placeholderTextColor="gray"
                      focusColor="#808080"
                      editable={false}
                      selectTextOnFocus={false}
                      renderRightIcon={() => (
                        <AntDesign
                          style={styles.icon}
                          color={'black'}
                          name={Originator_Key ? 'close' : 'search1'}
                          size={22}
                          disable={true}
                          
                        />
                      )}
                    />
                  </View>
                </Pressable>
              </View>

              {/* Originator */}
              <View style={styles.view_style}>
                <Pressable
                  onPress={() => { get_dropdown('Assign To', Originator); }}
                  onLongPress={() => {setAssignto_Key(''),setAssignto_label('')}}>
                  <View pointerEvents={'none'}>
                    <TextInput
                      value={Assignto_Key}
                      style={styles.input}
                      inputStyle={styles.inputStyle}
                      labelStyle={styles.labelStyle}
                      placeholderStyle={styles.placeholderStyle}
                      textErrorStyle={styles.textErrorStyle}
                      label="Assign To"
                      placeholderTextColor="gray"
                      focusColor="#808080"
                      editable={false}
                      selectTextOnFocus={false}
                      renderRightIcon={() => (
                        <AntDesign
                          style={styles.icon}
                          color={'black'}
                          name={Assignto_Key ? 'close' : 'search1'}
                          size={22}
                          disable={true}
                          
                        />
                      )}
                    />
                  </View>
                </Pressable>
              </View>

              {/* Work Area*/}
              <View style={styles.view_style}>
                <Pressable
                  onPress={() => get_dropdown('Work Area', WorkArea)}
                  onLongPress={() => {setWorkArea_Key(''),setWorkArea_label('')}}>
                  <View pointerEvents={'none'}>
                    <TextInput
                      value={WorkArea_Key}
                      style={styles.input}
                      inputStyle={styles.inputStyle}
                      labelStyle={styles.labelStyle}
                      placeholderStyle={styles.placeholderStyle}
                      textErrorStyle={styles.textErrorStyle}
                      label="Work Area"
                      placeholderTextColor="gray"
                      focusColor="#808080"
                      editable={false}
                      selectTextOnFocus={false}
                      renderRightIcon={() => (
                        <AntDesign
                          style={styles.icon}
                          color={'black'}
                          name={WorkArea_Key ? 'close' : 'search1'}
                          size={22}
                          disable={true}
                          
                        />
                      )}
                    />
                  </View>
                </Pressable>
              </View>

              {/* Work Area*/}
              <View style={styles.view_style}>
                <Pressable
                  onPress={() => get_dropdown('Work Type', WorkType)}
                  onLongPress={() => {setWorkType_Key(''),setWorkType_label('')}}>
                  <View pointerEvents={'none'}>
                    <TextInput
                      value={WorkType_Key}
                      style={styles.input}
                      inputStyle={styles.inputStyle}
                      labelStyle={styles.labelStyle}
                      placeholderStyle={styles.placeholderStyle}
                      textErrorStyle={styles.textErrorStyle}
                      label="Work Type"
                      placeholderTextColor="gray"
                      focusColor="#808080"
                      editable={false}
                      selectTextOnFocus={false}
                      renderRightIcon={() => (
                        <AntDesign
                          style={styles.icon}
                          color={'black'}
                          name={WorkType_Key ? 'close' : 'search1'}
                          size={22}
                          disable={true}
                          
                        />
                      )}
                    />
                  </View>
                </Pressable>
              </View>

              {/* Asset Location */}
              <View style={styles.view_style}>
                <Pressable
                  onPress={() => get_dropdown('Asset Location', AssetLocation)}
                  onLongPress={() => {setAssetLocation_Key(''),setAssetLocation_label('')}}>
                  <View pointerEvents={'none'}>
                    <TextInput
                      value={AssetLocation_Key}
                      style={styles.input}
                      inputStyle={styles.inputStyle}
                      labelStyle={styles.labelStyle}
                      placeholderStyle={styles.placeholderStyle}
                      textErrorStyle={styles.textErrorStyle}
                      label="Asset Location"
                      placeholderTextColor="gray"
                      focusColor="#808080"
                      editable={false}
                      selectTextOnFocus={false}
                      renderRightIcon={() => (
                        <AntDesign
                          style={styles.icon}
                          color={'black'}
                          name={AssetLocation_Key ? 'close' : 'search1'}
                          size={22}
                          disable={true}
                          
                        />
                      )}
                    />
                  </View>
                </Pressable>
              </View>

              {/* Asset Level */}
              <View style={styles.view_style}>
                <Pressable
                  onPress={() => get_dropdown('Asset Level', AssetLevel)}
                  onLongPress={() => {setAssetLevel_Key(''),setAssetLevel_label('')}}>
                  <View pointerEvents={'none'}>
                    <TextInput
                      value={AssetLevel_Key}
                      style={styles.input}
                      inputStyle={styles.inputStyle}
                      labelStyle={styles.labelStyle}
                      placeholderStyle={styles.placeholderStyle}
                      textErrorStyle={styles.textErrorStyle}
                      label="Asset Level"
                      placeholderTextColor="gray"
                      focusColor="#808080"
                      editable={false}
                      selectTextOnFocus={false}
                      renderRightIcon={() => (
                        <AntDesign
                          style={styles.icon}
                          color={'black'}
                          name={AssetLevel_Key ? 'close' : 'search1'}
                          size={22}
                          disable={true}
                          
                        />
                      )}
                    />
                  </View>
                </Pressable>
              </View>

            

            
            </View>
          </ScrollView>

          <View style={styles.bottomView} onPress={() => { onretrieve(); }}>
            <TouchableOpacity style={{ width: '100%', height: 50, alignItems: 'center', justifyContent: 'center'}}
              onPress={onretrieve}>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold'}}> RETRIEVE </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaProvider>
    </DismissKeyboard>
  );
};

export default FilteringWorkOrder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 10 : 10,
    backgroundColor: '#FFFFFF',
  },

  bottomView: {
    flexDirection: 'row',
    width: '100%',
    height: 70,
    backgroundColor: '#42A5F5',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },

  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : 6,
    paddingLeft: 10,
    color: '#05375a',
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

  view_style: {
    flex: 1,
    marginTop: 12,
    marginLeft: 10,
    marginRight: 10,
  },

  input: {
    height: 50,
    paddingHorizontal: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#808080',
  },
  inputStyle: {fontSize: 15},
  labelStyle: {
    fontSize: 14,
    position: 'absolute',
    top: -10,
    backgroundColor: 'white',
    paddingHorizontal: 4,
    marginLeft: -4,
    color: '#0096FF',
  },
  placeholderStyle: {fontSize: 15, color: '#0096FF'},
  textErrorStyle: {fontSize: 15},
  model2_cardview: {
    flex: 1,
    marginTop: 50,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  icon: {
    marginRight: 8,
  },
  dropdown_style: {
    margin: 10,
  },
});
