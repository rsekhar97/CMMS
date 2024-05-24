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
import { useNavigation } from '@react-navigation/native';

import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';

var db = openDatabase({name: 'CMMS.db'});

const DismissKeyboard = ({children}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const deviceWidth = Dimensions.get('screen').width;
const deviceHeight = Dimensions.get('screen').height;

const FilteringWorkRequest = ({route}) => {

  const navigation = useNavigation();

  const _goBack = () => {
    navigation.navigate('MainTabScreen');
  };

  const [spinner, setspinner] = React.useState(false);

  const [Originator, setOriginator] = React.useState([]);
  const [WorkArea, setWorkArea] = React.useState([]);
  const [AssetLocation, setAssetLocation] = React.useState([]);
  const [AssetLevel, setAssetLevel] = React.useState([]);
  const [CostCenter, setCostCenter] = React.useState([]);

  const [WR_No, setWR_No] = React.useState('');
  const [WR_Description, setWR_Description] = React.useState('');
  const [WR_Assetno, setWR_Assetno] = React.useState('');
  const [WR_AssetDescription, setWR_AssetDescription] = React.useState('');

  const [Originator_Key, setOriginator_Key] = React.useState('');
  const [WorkArea_Key, setWorkArea_Key] = React.useState('');
  const [AssetLocation_Key, setAssetLocation_Key] = React.useState('');
  const [AssetLevel_Key, setAssetLevel_Key] = React.useState('');
  const [CostCenter_Key, setCostCenter_Key] = React.useState('');

  const [Originator_label, setOriginator_label] = React.useState('');
  const [WorkArea_label, setWorkArea_label] = React.useState('');
  const [AssetLocation_label, setAssetLocation_label] = React.useState('');
  const [AssetLevel_label, setAssetLevel_label] = React.useState('');
  const [CostCenter_label, setCostCenter_label] = React.useState('');

  const [isDatepickerVisible, setDatePickerVisibility] = React.useState(false);
  const [WR_fromdate, setWR_fromdate] = React.useState('');
  const [WR_todate, setWR_todate] = React.useState('');

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
  
   const [ScreenName, setScreenName] = React.useState('');

  React.useEffect(() => {
    const focusHander = navigation.addListener('focus', () => {
      fetchData();
    });
    return focusHander;
  }, [navigation]);

  const fetchData = async () => {

   

    console.log('test123',route.params)
   
    
    setspinner(true);

    setWR_No('');
    setWR_Description('');
    setWR_Assetno('');
    setWR_AssetDescription('');
    setOriginator_Key('');
    setWorkArea_Key('');
    setAssetLocation_Key('');
    setAssetLevel_Key('');
    setCostCenter_Key('');
    setWR_fromdate('');
    setWR_todate('');

    setOriginator_label('');
    setWorkArea_label('');
    setAssetLocation_label('');
    setAssetLevel_label('');
    setCostCenter_label('');

    db.transaction(function (txn) {
      txn.executeSql('SELECT * FROM employee', [], (tx, results) => {
        var emp_temp = [];
        console.log('get:' + results.rows);
        for (let i = 0; i < results.rows.length; ++i) {
          emp_temp.push(results.rows.item(i));
        }

        setOriginator(emp_temp);
      });

      txn.executeSql('SELECT * FROM workarea', [], (tx, results) => {
        var workarea_temp = [];
        console.log('get:' + results.rows);
        for (let i = 0; i < results.rows.length; ++i) {
          workarea_temp.push(results.rows.item(i));
        }

        setWorkArea(workarea_temp);
      });

      txn.executeSql('SELECT * FROM assetlocation', [], (tx, results) => {
        var assetlocation_temp = [];
        console.log('get:' + results.rows);
        for (let i = 0; i < results.rows.length; ++i) {
          assetlocation_temp.push(results.rows.item(i));
        }
        setAssetLocation(assetlocation_temp);
      });

      txn.executeSql('SELECT * FROM assetlevel', [], (tx, results) => {
        var assetlevel_temp = [];
        console.log('get:' + results.rows);
        for (let i = 0; i < results.rows.length; ++i) {
          assetlevel_temp.push(results.rows.item(i));
        }

        setAssetLevel(assetlevel_temp);
      });

      txn.executeSql('SELECT * FROM costcenter', [], (tx, results) => {
        var costcenter_temp = [];
        console.log('get:' + results.rows);
        for (let i = 0; i < results.rows.length; ++i) {
          costcenter_temp.push(results.rows.item(i));
        }
        setCostCenter(costcenter_temp);
      });

      setspinner(false);
    });
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
      setWR_fromdate(fromDate);
      if (!WR_todate) {
        setWR_todate(fromDate);
      }
    } else {
      setWR_todate(fromDate);
    }

    hideDatePicker();
  };

  const onSuccess = e => {
    console.log(JSON.stringify(e));

    const check = e.data.split('\r\n');
    console.log('scanned data' + check[0]);
    setWR_Assetno(check[0]);
    setresult(e.data);
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

      if (textvalue == 'Originator') {
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
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);

    if (textvalue == 'Originator') {
      setFilteredDataSource(Originator);
    } else if (textvalue == 'Cost Center') {
      setFilteredDataSource(CostCenter);
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
    if (textvalue == 'Originator') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> ID : </Text>
            </View>
            <View style={{flex: 4}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.emp_mst_empl_id}
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                Name :
              </Text>
            </View>
            <View style={{flex: 4}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.emp_mst_name}
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                Title :
              </Text>
            </View>
            <View style={{flex: 4}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.emp_mst_title}
              </Text>
            </View>
          </View>
        </View>
      );
    } else if (textvalue == 'Cost Center') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                Cost Center :
              </Text>
            </View>
            <View style={{flex: 2}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.costcenter}
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                Description :
              </Text>
            </View>
            <View style={{flex: 2}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.descs}
              </Text>
            </View>
          </View>
        </View>
      );
    } else if (textvalue == 'Work Area') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                Work Area :
              </Text>
            </View>
            <View style={{flex: 2}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.mst_war_work_area}
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                Description :
              </Text>
            </View>
            <View style={{flex: 2}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.mst_war_desc}
              </Text>
            </View>
          </View>
        </View>
      );
    } else if (textvalue == 'Asset Location') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                Asset Location :
              </Text>
            </View>
            <View style={{flex: 1.5}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.ast_loc_ast_loc}
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                Description :
              </Text>
            </View>
            <View style={{flex: 1.5}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.ast_loc_desc}
              </Text>
            </View>
          </View>
        </View>
      );
    } else if (textvalue == 'Asset Level') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                Asset Level :
              </Text>
            </View>
            <View style={{flex: 2}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.ast_lvl_ast_lvl}
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{flex: 1}}>
              <Text
                placeholder="Test"
                style={{
                  color: '#0096FF',
                  fontWeight: 'bold',
                  justifyContent: 'flex-start',
                }}>
                Description :
              </Text>
            </View>
            <View style={{flex: 2}}>
              <Text
                placeholder="Test"
                style={{justifyContent: 'flex-start', color: '#000'}}>
                {item.ast_lvl_desc}
              </Text>
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
    }

    setSearch('');
    setmodalVisible(!modalVisible);
  };

  const onretrieve = () => {
    if (
      !WR_No &&
      !WR_Description &&
      !WR_Assetno &&
      !WR_AssetDescription &&
      !Originator_label &&
      !WR_Description &&
      !Originator_label &&
      !WorkArea_label &&
      !AssetLocation_label &&
      !AssetLevel_label &&
      !CostCenter_label &&
      !WR_fromdate &&
      !WR_todate
    ) {
        // alert('Please select at least one criteria to search');
        setAlert(true,'warning','Please select at least one criteria to search');
      return;
    } else {

     
   
      

      if(route.params.Screenname === 'FilteringWorkRequest'){
        console.log("WORK DATA IF:  "+ route.params.Screenname);
        
        navigation.navigate('WorkRequestListing', {
          Screenname: "FilteringWorkRequest",
          WRF_WorkrequestNo: WR_No,
          WRF_WorkrequestDesc: WR_Description,
          WRF_AssetNo: WR_Assetno,
          WRF_AssetDesc: WR_AssetDescription,
          WRF_Originator: Originator_label,
          WRF_WorkArea: WorkArea_label,
          WRF_AssetLocation: AssetLocation_label,
          WRF_AssetLevel: AssetLevel_label,
          WRF_CostCenter: CostCenter_label,
          WRF_Fromdate: WR_fromdate,
          WRF_Todate: WR_todate,
        });
        
      }else if(route.params.Screenname === 'MyWR'){
        console.log("WORK DATA ELSE:  "+ route.params.Screenname);
        navigation.navigate('WorkRequestListing', {
          Screenname: "FilteringWorkRequest",
          WRF_WorkrequestNo: WR_No,
          WRF_WorkrequestDesc: WR_Description,
          WRF_AssetNo: WR_Assetno,
          WRF_AssetDesc: WR_AssetDescription,
          WRF_Originator: Originator_label,
          WRF_WorkArea: WorkArea_label,
          WRF_AssetLocation: AssetLocation_label,
          WRF_AssetLevel: AssetLevel_label,
          WRF_CostCenter: CostCenter_label,
          WRF_Fromdate: WR_fromdate,
          WRF_Todate: WR_todate,
        });
      }

     
      
    }
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
                  Filtering Work Request
                </Text>
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

              {/* WR Description */}
              <View style={styles.view_style}>
                <TextInput
                  value={WR_Description}
                  style={[styles.input]}
                  multiline={true}
                  numberOfLines={4}
                  inputStyle={styles.inputStyle}
                  labelStyle={styles.labelStyle}
                  placeholderStyle={styles.placeholderStyle}
                  textErrorStyle={styles.textErrorStyle}
                  label="Work Request Description"
                  placeholderTextColor="gray"
                  clearButtonMode="always"
                  focusColor="#808080"
                  onChangeText={text => {
                    setWR_Description(text);
                  }}
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                }}>
                {/* Asset No */}
                <View style={styles.view_style}>
                  <TextInput
                    value={WR_Assetno}
                    style={styles.input}
                    inputStyle={styles.inputStyle}
                    labelStyle={styles.labelStyle}
                    placeholderStyle={styles.placeholderStyle}
                    textErrorStyle={styles.textErrorStyle}
                    label="Asset No"
                    placeholderTextColor="gray"
                    focusColor="#808080"
                    onChangeText={text => setWR_Assetno(text)}
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
                  value={WR_AssetDescription}
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
                    setWR_AssetDescription(text);
                  }}
                />
              </View>

              {/* Originator */}
              <View style={styles.view_style}>
                <Pressable
                  onPress={() => {
                    get_dropdown('Originator', Originator);
                  }}
                  onLongPress={() => {setOriginator_Key(''), setOriginator_label('')}}>
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

              <View
                style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                {/* From Date */}
                <View style={styles.view_style}>
                  <Pressable
                    onPress={() => showDatePicker('from')}
                    onLongPress={() => setWR_fromdate('')}>
                    <View pointerEvents={'none'}>
                      <TextInput
                        value={WR_fromdate}
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
                    onLongPress={() => setWR_todate('')}>
                    <View pointerEvents={'none'}>
                      <TextInput
                        value={WR_todate}
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
            </View>
          </ScrollView>

          <View style={styles.bottomView} onPress={() => { onretrieve(); }}>
            <TouchableOpacity style={{ width: '100%', height: 50, alignItems: 'center', justifyContent: 'center', }}
              onPress={onretrieve}>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold'}}> RETRIEVE </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaProvider>
    </DismissKeyboard>
  );
};

export default FilteringWorkRequest;

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
