import {useState, useEffect, useCallback} from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, Image, TouchableWithoutFeedback, Keyboard, FlatList, Pressable, RefreshControl, BackHandler, Alert, } from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Appbar} from 'react-native-paper';
import ProgressLoader from 'rn-progress-loader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {openDatabase} from 'react-native-sqlite-storage';
import moment from 'moment';
import {TextInput} from 'react-native-element-textinput';
import {SearchBar} from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';

var db = openDatabase({name: 'CMMS.db'});

const DismissKeyboard = ({children}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const FilteringAsset = ({route,navigation}) => {

  const _goBack = () => {
   
    navigation.navigate('MainTabScreen');
   
  };

  //Alert
  const [Show, setShow] = useState(false);
  const [Theme, setTheme] = useState('');
  const [Title, setTitle] = useState('');
  

  const [refreshing, setRefreshing] = useState(false);
  const [spinner, setspinner] = useState(false);

  const [Employee, setEmployee] = useState([]);
  const [CostCenter, setCostCenter] = useState([]);
  const [AssetStatus, setAssetStatus] = useState([]);
  const [AssetType, setAssetType] = useState([]);
  const [AssetGroupCode, setAssetGroupCode] = useState([]);
  const [Assetcode, setAssetcode] = useState([]);
  const [WorkArea, setWorkArea] = useState([]);
  const [AssetLocation, setAssetLocation] = useState([]);
  const [AssetLevel, setAssetLevel] = useState([]);

  const [Assetno, onChangeAssetno] = useState('');
  const [AssetDescription, onChangeAssetDescription] = useState('');
  const [Employee_Key, setEmployee_Key] = useState('');
  const [CostCenter_Key, setCostCenter_Key] = useState('');
  const [AssetStatus_Key, setAssetStatus_Key] = useState('');
  const [AssetType_Key, setAssetType_Key] = useState('');
  const [AssetGroupCode_Key, setAssetGroupCode_Key] = useState('');
  const [AssetCode_Key, setAssetCode_Key] = useState('');
  const [WorkArea_Key, setWorkArea_Key] = useState('');
  const [AssetLocation_Key, setAssetLocation_Key] = useState('');
  const [AssetLevel_Key, setAssetLevel_Key] = useState('');

  const [Employee_label, setEmployee_label] = useState('');
  const [CostCenter_label, setCostCenter_label] = useState('');
  const [AssetStatus_label, setAssetStatus_label] = useState('');
  const [AssetType_label, setAssetType_label] = useState('');
  const [AssetGroupCode_label, setAssetGroupCode_label] = useState('');
  const [AssetCode_label, setAssetCode_label] = useState('');
  const [WorkArea_label, setWorkArea_label] = useState('');
  const [AssetLocation_label, setAssetLocation_label] = useState('');
  const [AssetLevel_label, setAssetLevel_label] = useState('');

  const [isDatepickerVisible, setDatePickerVisibility] = useState(false);
  const [Fromdate, setFromdate] = useState('');
  const [Todate, setTodate] = useState('');

  const [datetitle, setDatetitle] = useState('');

  const [textvalue, settextvalue] = useState('');
  const [dropdown_data, setdata] = useState([]);
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [modalVisible, setmodalVisible] = useState(false);
  const [search, setSearch] = useState('');

  const [ScreenName, setScreenName] = useState('');

  

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', _goBack);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', _goBack);
    };
  }, []);

  useEffect(() => {
    const focusHander = navigation.addListener('focus', () => {
      fetchData();
    });
    return focusHander;
  }, [navigation]);

  const fetchData = async () => {

    console.log("Screenname",route.params.Screenname)

    setspinner(true);

    onChangeAssetno('');
    onChangeAssetDescription('');
    setEmployee_Key('');
    setCostCenter_Key('');
    setAssetStatus_Key('');
    setAssetType_Key('');
    setAssetGroupCode_Key('');
    setAssetCode_Key('');
    setWorkArea_Key('');
    setAssetLocation_Key('');
    setAssetLevel_Key('');
    setFromdate('');
    setTodate('');

    setEmployee_label('');
    setCostCenter_label('');
    setAssetStatus_label('');
    setAssetType_label('');
    setAssetGroupCode_label('');
    setAssetCode_label('');
    setWorkArea_label('');
    setAssetLocation_label('');
    setAssetLevel_label('');

    setScreenName('FilteringAsset');

    db.transaction(function (txn) {
      //employee
      txn.executeSql( 'SELECT * FROM employee', [], (tx, { rows }) => { setEmployee(rows.raw())});

    
      //costcenter
      txn.executeSql( 'SELECT * FROM costcenter', [], (tx, { rows }) => { setCostCenter(rows.raw())});
      

      //assetstatus
      txn.executeSql( 'SELECT * FROM assetstatus', [], (tx, { rows }) => { setAssetStatus(rows.raw())});
      

      //assettype
      txn.executeSql( 'SELECT * FROM assettype', [], (tx, { rows }) => { setAssetType(rows.raw())});
      

      //assetgroupcode
      txn.executeSql( 'SELECT * FROM assetgroupcode', [], (tx, { rows }) => { setAssetGroupCode(rows.raw())});
      

      //assetcode
      txn.executeSql( 'SELECT * FROM assetcode', [], (tx, { rows }) => { setAssetcode(rows.raw())});
      

      //workarea
      txn.executeSql( 'SELECT * FROM workarea', [], (tx, { rows }) => { setWorkArea(rows.raw())});
      

      //assetlocation
      txn.executeSql( 'SELECT * FROM assetlocation', [], (tx, { rows }) => { setAssetLocation(rows.raw())});
      

      //assetlevel
      txn.executeSql( 'SELECT * FROM assetlevel', [], (tx, { rows }) => { setAssetLevel(rows.raw())});

    
      setspinner(false);
    });
  };

  //Retrieve Asset List
  const onretrieve = () => {
    if (
      !Assetno &&
      !AssetDescription &&
      !Employee_Key &&
      !CostCenter_Key &&
      !AssetStatus_Key &&
      !AssetType_Key &&
      !AssetGroupCode_Key &&
      !AssetCode_Key &&
      !WorkArea_Key &&
      !AssetLocation_Key &&
      !Fromdate &&
      !Todate &&
      !AssetLevel_Key
    ) {
      //alert('Please select at least one criteria to search');

      setAlert(true,'warning','Please select at least one criteria to search');

    } else {
      console.log(
        Assetno +
          '\n' +
          AssetDescription +
          '\n' +
          Employee_label +
          '\n' +
          CostCenter_label +
          '\n' +
          AssetStatus_label +
          '\n' +
          AssetType_label +
          '\n' +
          AssetGroupCode_label +
          '\n' +
          AssetCode_label +
          '\n' +
          WorkArea_label +
          '\n' +
          AssetLocation_label +
          '\n' +
          AssetLevel_label +
          '\n' +
          Fromdate +
          '\n' +
          Todate,
      );

      // var fromDate, toDate ;

      // if(!Fromdate){
      //    fromDate ='';
      // }else{
      //    fromDate = moment(Fromdate).format('yyyy-MM-DD HH:mm')
      // }

      // if(!Todate){

      //    toDate ='';
      // }else{
      //    toDate = moment(Todate).format('yyyy-MM-DD HH:mm')
      // }

      // console.log(fromDate);
      // console.log(toDate);

      navigation.navigate('AssetListing', {

        Screenname: 'FilteringAsset',

        ASF_Assetno: Assetno,
        ASF_AssetDescription: AssetDescription,
        ASF_Employee: Employee_label,
        ASF_Fromdate: Fromdate,
        ASF_Todate: Todate,
        ASF_CostCenter: CostCenter_label,
        ASF_AssetStatus: AssetStatus_label,
        ASF_AssetType: AssetType_label,
        ASF_AssetGroupCode: AssetGroupCode_label,
        ASF_AssetCode: AssetCode_label,
        ASF_WorkArea: WorkArea_label,
        ASF_AssetLocation: AssetLocation_label,
        ASF_AssetLevel: AssetLevel_label,
      });
    }
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
      setFromdate(fromDate);

      if (!Todate) {
        setTodate(fromDate);
      }
    } else {
      setTodate(fromDate);
      if (!Fromdate) {
        setFromdate(fromDate);
      }
    }

    hideDatePicker();
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

      if (textvalue == 'Created By') {
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
      } else if (textvalue == 'Asset Status') {
        newData = dropdown_data.filter(function (item) {
          const itemData = `${item.ast_sts_status.toUpperCase()},
              ,${item.ast_sts_desc.toUpperCase()})`;

          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      } else if (textvalue == 'Asset Type') {
        newData = dropdown_data.filter(function (item) {
          const itemData = `${item.ast_type_cd.toUpperCase()},
              ,${item.ast_type_descs.toUpperCase()})`;

          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      } else if (textvalue == 'Asset Group Code') {
        newData = dropdown_data.filter(function (item) {
          const itemData = `${item.ast_grp_grp_cd.toUpperCase()},
              ,${item.ast_grp_desc.toUpperCase()})`;

          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      } else if (textvalue == 'Asset Code') {
        newData = dropdown_data.filter(function (item) {
          const itemData = `${item.ast_cod_ast_cd.toUpperCase()},
              ,${item.ast_cod_desc.toUpperCase()})`;

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
  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    if (textvalue == 'Created By') {
      setFilteredDataSource(Employee);
    } else if (textvalue == 'Cost Center') {
      setFilteredDataSource(CostCenter);
    } else if (textvalue == 'Asset Status') {
      setFilteredDataSource(AssetStatus);
    } else if (textvalue == 'Asset Type') {
      setFilteredDataSource(AssetType);
    } else if (textvalue == 'Asset Group Code') {
      setFilteredDataSource(AssetGroupCode);
    } else if (textvalue == 'Asset Code') {
      setFilteredDataSource(Assetcode);
    } else if (textvalue == 'Work Area') {
      setFilteredDataSource(WorkArea);
    } else if (textvalue == 'Asset Location') {
      setFilteredDataSource(AssetLocation);
    } else if (textvalue == 'Asset Level') {
      setFilteredDataSource(AssetLevel);
    }

    setRefreshing(false);
  }, [refreshing]);

  //Dropdown XML
  const renderText = item => {
    if (textvalue == 'Created By') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}>ID :</Text>
            </View>
            <View style={{flex: 4}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.emp_mst_empl_id}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}>Name :</Text>
            </View>
            <View style={{flex: 4}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}>{item.emp_mst_name}</Text>
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
      );
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
    } else if (textvalue == 'Asset Status') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Status : </Text>
            </View>
            <View style={{flex: 2}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.ast_sts_status} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Description : </Text>
            </View>
            <View style={{flex: 2}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.ast_sts_desc} </Text>
            </View>
          </View>
        </View>
      );
    } else if (textvalue == 'Asset Type') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Type Code : </Text>
            </View>
            <View style={{flex: 2}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.ast_type_cd} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Description : </Text>
            </View>
            <View style={{flex: 2}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.ast_type_descs} </Text>
            </View>
          </View>
        </View>
      );
    } else if (textvalue == 'Asset Group Code') {
      let option;
      if (item.ast_grp_option == 1) {
        option = 'Yes';
      } else {
        option = 'No';
      }
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Asset Group Code : </Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.ast_grp_grp_cd} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Asset Group Desc : </Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.ast_grp_desc} </Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Asset No : </Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {option} </Text>
            </View>
          </View>
        </View>
      );
    } else if (textvalue == 'Asset Code') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Asset Code : </Text>
            </View>
            <View style={{flex: 2}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.ast_cod_ast_cd} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Description : </Text>
            </View>
            <View style={{flex: 2}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.ast_cod_desc} </Text>
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
              <Text
                placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Description : </Text>
            </View>
            <View style={{flex: 2}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', color: '#000'}}> {item.mst_war_desc} </Text>
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

    if (textvalue == 'Created By') {
      setEmployee_Key(item.emp_mst_empl_id + ' : ' + item.emp_mst_name);
      setEmployee_label(item.emp_mst_empl_id);
    } else if (textvalue == 'Cost Center') {
      setCostCenter_Key(item.costcenter + ' : ' + item.descs);
      setCostCenter_label(item.costcenter);
    } else if (textvalue == 'Asset Status') {
      setAssetStatus_Key(item.ast_sts_status + ' : ' + item.ast_sts_desc);
      setAssetStatus_label(item.ast_sts_status);
    } else if (textvalue == 'Asset Type') {
      setAssetType_Key(item.ast_type_cd + ' : ' + item.ast_type_descs);
      setAssetType_label(item.ast_type_cd);
    } else if (textvalue == 'Asset Group Code') {
      setAssetGroupCode_Key(item.ast_grp_grp_cd + ' : ' + item.ast_grp_desc);
      setAssetGroupCode_label(item.ast_grp_grp_cd);
    } else if (textvalue == 'Asset Code') {
      setAssetCode_Key(item.ast_cod_ast_cd + ' : ' + item.ast_cod_desc);
      setAssetCode_label(item.ast_cod_ast_cd);
    } else if (textvalue == 'Work Area') {
      setWorkArea_Key(item.mst_war_work_area + ' : ' + item.mst_war_desc);
      setWorkArea_label(item.mst_war_work_area);
    } else if (textvalue == 'Asset Location') {
      setAssetLocation_Key(item.ast_loc_ast_loc + ' : ' + item.ast_loc_desc);
      setAssetLocation_label(item.ast_loc_ast_loc);
    } else if (textvalue == 'Asset Level') {
      setAssetLevel_Key(item.ast_lvl_ast_lvl + ' : ' + item.ast_lvl_desc);
      setAssetLevel_label(item.ast_lvl_ast_lvl);
    }

    setSearch('');
    setmodalVisible(!modalVisible);
  };


  const setAlert =(show,theme,title)=>{

    setShow(show);
    setTheme(theme);
    setTitle(title);

  }

  return (

    <DismissKeyboard>
      <SafeAreaProvider>
        <Appbar.Header style={{backgroundColor: '#42A5F5'}}>
          <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between'}}>
            <Pressable onPress={_goBack}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <FontAwesome name="angle-left" color="#fff" size={55} style={{marginLeft: 15, marginBottom: 5}} />
                <Text style={{ fontSize: 20, justifyContent: 'center', textAlign: 'center', color: '#fff', fontWeight: 'bold', marginLeft: 15, }}> Filtering Asset </Text>
              </View>
            </Pressable>
          </View>
        </Appbar.Header>

        <ProgressLoader
          visible={spinner}
          isModal={true}
          isHUD={true}
          hudColor={'#808080'}
          color={'#FFFFFF'}
        />

        <SCLAlert theme={Theme} show={Show} title={Title}>
          <SCLAlertButton theme={Theme}   onPress={()=>setShow(false)}>OK</SCLAlertButton>
        </SCLAlert>


        <DateTimePicker
          isVisible={isDatepickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
           //Alert.alert('Closed');
            setmodalVisible(!modalVisible);
          }}>
          <ProgressLoader visible={spinner} isModal={true} isHUD={true} hudColor={'#808080'} color={'#FFFFFF'} />

          <View style={styles.model2_cardview}>
            <View style={{flex: 1, margin: 20, backgroundColor: '#FFFFFF'}}>
              <View
                style={{flexDirection: 'row', alignItems: 'center', height: 50}}>
                <Text style={{ flex: 1, fontSize: 15, justifyContent: 'center', textAlign: 'center', color: '#000', fontWeight: 'bold', }}> {textvalue} </Text>
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

            

              {/* Asset No */}
              <View style={styles.view_style}>
                <TextInput
                  value={Assetno}
                  style={styles.input}
                  inputStyle={styles.inputStyle}
                  labelStyle={styles.labelStyle}
                  placeholderStyle={styles.placeholderStyle}
                  textErrorStyle={styles.textErrorStyle}
                  label="Asset No"
                  placeholderTextColor="gray"
                  focusColor="#808080"
                  onChangeText={text => onChangeAssetno(text)}
                />
              </View>

              {/* Asset Description */}
              <View style={styles.view_style}>
                <TextInput
                  value={AssetDescription}
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
                    onChangeAssetDescription(text);
                  }}
                />
              </View>

              {/* Created By */}
              <View style={styles.view_style}>
                <Pressable
                  onPress={() => { get_dropdown('Created By', Employee) }}
                  onLongPress={() => {setEmployee_Key(''),setEmployee_label('')}}>
                  <View pointerEvents={'none'}>
                    <TextInput
                      value={Employee_Key}
                      style={styles.input}
                      inputStyle={styles.inputStyle}
                      labelStyle={styles.labelStyle}
                      placeholderStyle={styles.placeholderStyle}
                      textErrorStyle={styles.textErrorStyle}
                      label="Created By"
                      placeholderTextColor="gray"
                      focusColor="#808080"
                      editable={false}
                      selectTextOnFocus={false}
                      renderRightIcon={() => (
                        <AntDesign
                          style={styles.icon}
                          color={'black'}
                          name={Employee_Key ? 'close' : 'search1'}
                          size={22}
                          disable={true}
                          
                        />
                      )}
                    />
                  </View>
                </Pressable>
              </View>

              <View
                style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                {/* From Date */}
                <View style={styles.view_style}>
                  <Pressable
                    onPress={() => showDatePicker('from')}
                    onLongPress={() => setFromdate('')}>
                    <View pointerEvents={'none'}>
                      <TextInput
                        value={Fromdate}
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
                    onLongPress={() => setTodate('')}>
                    <View pointerEvents={'none'}>
                      <TextInput
                        value={Todate}
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
                            color={'#000'}
                            name={'calendar'}
                            size={20}
                          />
                        )}
                      />
                    </View>
                  </Pressable>
                </View>
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
                      label="Cost Center"
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

              {/* Asset Status */}
              <View style={styles.view_style}>
                <Pressable
                  onPress={() => get_dropdown('Asset Status', AssetStatus)}
                  onLongPress={() => {setAssetStatus_Key(''),setAssetStatus_label('')}}>
                  <View pointerEvents={'none'}>
                    <TextInput
                      value={AssetStatus_Key}
                      style={styles.input}
                      inputStyle={styles.inputStyle}
                      labelStyle={styles.labelStyle}
                      placeholderStyle={styles.placeholderStyle}
                      textErrorStyle={styles.textErrorStyle}
                      label="Asset Status"
                      placeholderTextColor="gray"
                      focusColor="#808080"
                      editable={false}
                      selectTextOnFocus={false}
                      renderRightIcon={() => (
                        <AntDesign
                          style={styles.icon}
                          color={'black'}
                          name={AssetStatus_Key ? 'close' : 'search1'}
                          size={22}
                          disable={true}
                          
                        />
                      )}
                    />
                  </View>
                </Pressable>
              </View>

              {/* Asset Type*/}
              <View style={styles.view_style}>
                <Pressable
                  onPress={() => get_dropdown('Asset Type', AssetType)}
                  onLongPress={() => {setAssetType_Key(''),setAssetType_label('')}}>
                  <View pointerEvents={'none'}>
                    <TextInput
                      value={AssetType_Key}
                      style={styles.input}
                      inputStyle={styles.inputStyle}
                      labelStyle={styles.labelStyle}
                      placeholderStyle={styles.placeholderStyle}
                      textErrorStyle={styles.textErrorStyle}
                      label="Asset Type"
                      placeholderTextColor="gray"
                      focusColor="#808080"
                      editable={false}
                      selectTextOnFocus={false}
                      renderRightIcon={() => (
                        <AntDesign
                          style={styles.icon}
                          color={'black'}
                          name={AssetType_Key ? 'close' : 'search1'}
                          size={22}
                          disable={true}
                          
                        />
                      )}
                    />
                  </View>
                </Pressable>
              </View>

              {/* Asset GroupCode*/}
              <View style={styles.view_style}>
                <Pressable
                  onPress={() => get_dropdown('Asset Group Code', AssetGroupCode)}
                  onLongPress={() => {setAssetGroupCode_Key(''),setAssetGroupCode_label('')}}>
                  <View pointerEvents={'none'}>
                    <TextInput
                      value={AssetGroupCode_Key}
                      style={styles.input}
                      inputStyle={styles.inputStyle}
                      labelStyle={styles.labelStyle}
                      placeholderStyle={styles.placeholderStyle}
                      textErrorStyle={styles.textErrorStyle}
                      label="Asset Group Code"
                      placeholderTextColor="gray"
                      focusColor="#808080"
                      editable={false}
                      selectTextOnFocus={false}
                      renderRightIcon={() => (
                        <AntDesign
                          style={styles.icon}
                          color={'black'}
                          name={AssetGroupCode_Key ? 'close' : 'search1'}
                          size={22}
                          disable={true}
                          
                        />
                      )}
                    />
                  </View>
                </Pressable>
              </View>

              {/* Asset Code*/}
              <View style={styles.view_style}>
                <Pressable
                  onPress={() => get_dropdown('Asset Code', Assetcode)}
                  onLongPress={() => {setAssetCode_Key(''),setAssetCode_label('')}}>
                  <View pointerEvents={'none'}>
                    <TextInput
                      value={AssetCode_Key}
                      style={styles.input}
                      inputStyle={styles.inputStyle}
                      labelStyle={styles.labelStyle}
                      placeholderStyle={styles.placeholderStyle}
                      textErrorStyle={styles.textErrorStyle}
                      label="Asset Code"
                      placeholderTextColor="gray"
                      focusColor="#808080"
                      editable={false}
                      selectTextOnFocus={false}
                      renderRightIcon={() => (
                        <AntDesign
                          style={styles.icon}
                          color={'black'}
                          name={AssetCode_Key ? 'close' : 'search1'}
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
            <TouchableOpacity
              style={{ width: '100%', height: 50, alignItems: 'center', justifyContent: 'center', }}
              onPress={onretrieve}>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold'}}> RETRIEVE </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaProvider>
    </DismissKeyboard>
  );
};
export default FilteringAsset;

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

  dropdown_style: {
    margin: 10,
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
    
    fontSize: 13,
    position: 'absolute',
    top: -10,
    Index: 999,
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
});
