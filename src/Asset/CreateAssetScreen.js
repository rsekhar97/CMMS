import React from 'react';
import { View, StyleSheet, Text, Image, Dimensions, TouchableOpacity, Alert, Pressable, FlatList, Modal, RefreshControl, BackHandler, TouchableWithoutFeedback, Keyboard, PermissionsAndroid, Platform,ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import ProgressLoader from 'rn-progress-loader';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {Appbar} from 'react-native-paper';
import {openDatabase} from 'react-native-sqlite-storage';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import ImagePickerModal from 'react-native-image-picker-modal';
import Att_Modal from 'react-native-modal';
import Feather from 'react-native-vector-icons/Feather';
import {TextInput} from 'react-native-element-textinput';
import {SearchBar} from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {SCLAlert, SCLAlertButton} from 'react-native-scl-alert';
import ImageViewer from 'react-native-image-zoom-viewer';
import {launchCamera} from 'react-native-image-picker';
import Pdf from 'react-native-pdf';
import DocumentPicker from 'react-native-document-picker';
import Video from 'react-native-video-enhanced';
import { Image as CPImage} from 'react-native-compressor';
import { Video as CPVideo} from 'react-native-compressor';


var db = openDatabase({name: 'CMMS.db'});
let Baseurl, Site_cd, LoginID, EmpName, EmpID, EmpPhone, EmpWorkGrp, dvc_id;

const DismissKeyboard = ({children}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

  const CreateAssetScreen = ({route, navigation}) => {

  const _goBack = () => {
    if (route.params.Screenname == 'AssetListing') {
      navigation.navigate('AssetListing', {
        Screenname: route.params.Screenname,

        ASF_Assetno: route.params.ASF_Assetno,
        ASF_AssetDescription: route.params.ASF_AssetDescription,
        ASF_Employee: route.params.ASF_Employee,
        ASF_CostCenter: route.params.ASF_CostCenter,
        ASF_AssetStatus: route.params.ASF_AssetStatus,
        ASF_AssetType: route.params.ASF_AssetType,
        ASF_AssetGroupCode: route.params.ASF_AssetGroupCode,
        ASF_AssetCode: route.params.ASF_AssetCode,
        ASF_WorkArea: route.params.ASF_WorkArea,
        ASF_AssetLocation: route.params.ASF_AssetLocation,
        ASF_AssetLevel: route.params.ASF_AssetLevel,
        ASF_Fromdate: route.params.ASF_Fromdate,
        ASF_Todate: route.params.ASF_Todate,
      });
    } else if (route.params.Screenname == 'CreateAsset') {
      navigation.navigate('MainTabScreen');
    } else if (route.params.Screenname == 'ScanAssetMaster') {
      navigation.navigate('ScanAssetMaster', {
        Screenname: route.params.Screenname,
        ScanAssetno: route.params.ScanAssetno,
        ScanAssetRowID: route.params.ScanAssetRowID,
      });
    }

    return true;
  };

  const [isVisible, setVisible] = React.useState(false);
  const [Video_isVisible, setVideo_isVisible] = React.useState(false);

  const [spinner, setspinner] = React.useState(false);
  const [Toolbartext, setToolbartext] = React.useState('');

  const [Dropdown_data, setDropdown_data] = React.useState([]);
  const [filteredDataSource, setFilteredDataSource] = React.useState([]);

  const [refreshing, setRefreshing] = React.useState(false);
  const [textvalue, settextvalue] = React.useState('');
  const [DropDown_modalVisible, setDropDown_modalVisible] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const [Editable, setEditable] = React.useState(false);

  const [AGC_height, setAGC_height] = React.useState(50);
  const [height, setHeight] = React.useState(0);

  const [Description_height, setDescription_height] = React.useState(0);

  //Alert
  const [Show, setShow] = React.useState(false);
  const [Show_two, setShow_two] = React.useState(false);
  const [Theme, setTheme] = React.useState('');
  const [Title, setTitle] = React.useState('');
  const [Type, setType] = React.useState('');
  const [ImgValue, setImgValue] = React.useState([]);

  Valid = false;

  const [CostCenter, setCostCenter] = React.useState();
  const [AssetStatus, setAssetStatus] = React.useState();
  const [AssetType, setAssetType] = React.useState();
  const [AssetGroupCode, setAssetGroupCode] = React.useState();
  const [Assetcode, setAssetcode] = React.useState();
  const [WorkArea, setWorkArea] = React.useState();
  const [AssetLocation, setAssetLocation] = React.useState();
  const [AssetLevel, setAssetLevel] = React.useState();
  const [CriticalFactor, setCriticalFactor] = React.useState();

  const [Assetno, onChangeAssetno] = React.useState('');
  const [Assetno_editable, setAssetno_editable] = React.useState(false);
  const [Assetno_validation, setAssetno_validation] = React.useState(false);

  const [AssetGroupCode_key, setAssetGroupCode_key] = React.useState('');
  const [AssetDescription, onChangeAssetDescription] = React.useState('');
  const [AssetDescription_editable, setAssetDescription_editable] = React.useState(false);

  const [AssetType_key, setAssetType_key] = React.useState('');
  const [AssetCode_key, setAssetCode_key] = React.useState('');

  const [WorkArea_key, setWorkArea_key] = React.useState('');
  const [WorkAreaRelocationReason, onChangeWorkAreaRelocationReason] = React.useState('');
  const [visible_WLR, setvisible_WLR] = React.useState('none');
  const [visible_WRL, setvisible_WRL] = React.useState(false);

  const [AssetLocation_key, setAssetLocation_key] = React.useState('');
  const [AssetRelocationReason, onChangeAssetRelocationReason] = React.useState('');
  const [visible_ALR, setvisible_ALR] = React.useState('none');
  const [visible_ARL, setvisible_ARL] = React.useState(false);

  const [AssetLevel_key, setAssetLevel_key] = React.useState('');
  const [AssetStatus_key, setAssetStatus_key] = React.useState('');
  const [CriticalFactor_key, setCriticalFactor_key] = React.useState('');
  const [CostCenter_key, setCostCenter_key] = React.useState('');

  const [RowID, setRowID] = React.useState('');

  const [isDatepickerVisible, setDatePickerVisibility] = React.useState(false);
  const [Warranty_Date, setwarranty_Date] = React.useState('');
  const [Warranty_Date_editable, setWarranty_Date_editable] = React.useState(false);

  const [auto_numbering, setauto_numbering] = React.useState('');
  const [asset_group, setasset_group] = React.useState('');
  const [asset_type, setasset_type] = React.useState('');
  const [groupID, setgroupID] = React.useState('');

  const [SubmitButton, setSubmitButton] = React.useState('');
  const [SubmitButtonColor, setSubmitButtonColor] = React.useState('#0096FF');

  const [images, setImages] = React.useState([]);
  const [Attachments_List, setAttachments_List] = React.useState([]);
  const [images_list, setimages_list] = React.useState([]);

  const [modalVisible, setmodalVisible] = React.useState(false);
  const [MoreList, setMoreList] = React.useState();
  const [isMoreVisible, setMoreVisible] = React.useState(false);


  const [Type_link, setType_link] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [link, setlink] = React.useState([]);
  const [images_link, setimages_link] = React.useState([]);
  const [linkindex, setlinkindex] = React.useState(0);


  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', _goBack);

    return () => BackHandler.removeEventListener('hardwareBackPress', _goBack);
  }, []);

  React.useEffect(() => {
    const focusHander = navigation.addListener('focus', () => {
      fetchData();
    });
    return focusHander;
  }, [navigation]);

  const fetchData = async () => {
    setspinner(true);

    dvc_id = DeviceInfo.getDeviceId();
    console.log(DeviceInfo.getSystemVersion()) 

    Baseurl = await AsyncStorage.getItem('BaseURL');
    Site_cd = await AsyncStorage.getItem('Site_Cd');
    LoginID = await AsyncStorage.getItem('emp_mst_login_id');
    EmpName = await AsyncStorage.getItem('emp_mst_name');
    EmpID = await AsyncStorage.getItem('emp_mst_empl_id');
    EmpPhone = await AsyncStorage.getItem('emp_mst_homephone');
    EmpWorkGrp = await AsyncStorage.getItem('emp_det_work_grp');

    db.transaction(function (txn) {

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

      //criticalfactor
      txn.executeSql( 'SELECT * FROM criticalfactor', [], (tx, { rows }) => { setCriticalFactor(rows.raw())});
      
    });

    if (route.params.Screenname == 'AssetListing') {
      
      console.log(route.params.ASL_Assetno);
      console.log(route.params.ASL_RowID);

      setToolbartext('Edit Asset Master');
      setSubmitButton('Edit');
      setEditable(true);

      setAssetno_validation(false);
      setAssetDescription_editable(false);

      setMoreList([
        {Image: 'edit', Name: 'Asset Spare List'},
        {Image: 'clock', Name: 'Work Order History'},
      ]);

      get_asset_no(route.params.ASL_Assetno, route.params.ASL_RowID);
    } else if (route.params.Screenname == 'CreateAsset') {
      setToolbartext('Create Asset Master');
      setSubmitButton('Save');
      setvisible_WLR('none');
      setvisible_ALR('none');
      setSubmitButtonColor('#8BC34A');
      setAssetDescription_editable(true);

      get_dropdown();

    } else if (route.params.Screenname == 'ScanAssetMaster') {
      setToolbartext('Edit Asset Master');
      setSubmitButton('Edit');
      setEditable(true);

      setAssetno_validation(false);
      setAssetDescription_editable(false);

      setMoreList([
        {Image: 'edit', Name: 'Asset Spare List'},
        {Image: 'clock', Name: 'Work Order History'},
      ]);

      get_asset_no(route.params.ScanAssetno, route.params.ScanAssetRowID);
    }
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };

  const requestExternalReadPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'Your app needs access to storage to read media files.',
          }
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };


  const setAlert = (show, theme, title, type, value) => {
    setShow(show);
    setTheme(theme);
    setTitle(title);
    setType(type);
    setImgValue(value);
  };

  const setAlert_two = (show, theme, title, type, value) => {
    setShow_two(show);
    setTheme(theme);
    setTitle(title);
    setType(type);
    setImgValue(value);
  };

  //get_dropdown
  const get_dropdown = async () => {

    let EmpID = await AsyncStorage.getItem('emp_mst_empl_id');

    try {
      console.log( 'get_dropdown : ' + `${Baseurl}/get_dropdown.php?site_cd=${Site_cd}&type=Auto_Numnering&EmpID=${EmpID}&LoginID=${LoginID}`);

      const Dropdown = await fetch( `${Baseurl}/get_dropdown.php?site_cd=${Site_cd}&type=Auto_Numnering&EmpID=${EmpID}&LoginID=${LoginID}`);

      const responseJson = await Dropdown.json();

      if (responseJson.status === 'SUCCESS') {
        //console.log(responseJson.data.data)
        //console.log(responseJson.data.Auto_Numnering.length)
        //console.log(responseJson.data.CostCenter[0].costcenter , responseJson.data.CostCenter[0].descs)

        for (let i = 0; i < responseJson.data.Auto_Numnering.length; ++i) {
          //console.log(responseJson.data.Auto_Numnering[i].cnt_mst_module_cd ,responseJson.data.Auto_Numnering[i].cnt_mst_numbering ,responseJson.data.Auto_Numnering[i].cnt_mst_option)

          if ( responseJson.data.Auto_Numnering[i].cnt_mst_numbering == 'M' && responseJson.data.Auto_Numnering[i].cnt_mst_option == 'M' ) {
            setAssetno_editable(true);
            setAssetno_validation(true);
            setauto_numbering( responseJson.data.Auto_Numnering[i].cnt_mst_numbering);
            setasset_group(responseJson.data.Auto_Numnering[i].cnt_mst_option);

            setasset_type('MM');
          } else if ( responseJson.data.Auto_Numnering[i].cnt_mst_numbering == 'M' && responseJson.data.Auto_Numnering[i].cnt_mst_option == 'G' ) {
            setAssetno_editable(true);
            setAssetno_validation(true);
            setauto_numbering( responseJson.data.Auto_Numnering[i].cnt_mst_numbering);
            setasset_group(responseJson.data.Auto_Numnering[i].cnt_mst_option);

            setasset_type('MG');
          } else if ( responseJson.data.Auto_Numnering[i].cnt_mst_numbering == 'A' && responseJson.data.Auto_Numnering[i].cnt_mst_option == 'M' ) {
            setAssetno_editable(false);
            setAssetno_validation(false);
            setauto_numbering( responseJson.data.Auto_Numnering[i].cnt_mst_numbering );
            setasset_group(responseJson.data.Auto_Numnering[i].cnt_mst_option);

            setasset_type('AM');
          } else if ( responseJson.data.Auto_Numnering[i].cnt_mst_numbering == 'A' && responseJson.data.Auto_Numnering[i].cnt_mst_option == 'G' ) {
            setAssetno_editable(false);
            setAssetno_validation(false);
            setauto_numbering( responseJson.data.Auto_Numnering[i].cnt_mst_numbering );
            setasset_group(responseJson.data.Auto_Numnering[i].cnt_mst_option);

            setasset_type('AG');
          }
        }

        setspinner(false);
      } else {
        setspinner(false);
        //alert(responseJson.message);
        setAlert(true, 'danger', response.data.message, 'OK','');
      }
    } catch (error) {
      setspinner(false);
      alert(error);
    }
  };

  //GET ASSET NO API
  const get_asset_no = async (asset_no, row_id) => {
    setspinner(true);

    let userStr = {
      site_cd: Site_cd,
      ast_mst_asset_no: asset_no,
      asset_shortdesc: '',
      cost_center: '',
      asset_status: '',
      asset_type: '',
      asset_grpcode: '',
      work_area: '',
      asset_locn: '',
      asset_code: '',
      ast_lvl: '',
      ast_sts_typ_cd: '',
      createby: '',
      from_date: '',
      to_date: '',
      emp_det_work_grp: '',
      emp_id: '',
      type: '',
    };

    console.log('GET ASSET INFO :' + JSON.stringify(userStr));

    try {
      const response = await axios.post( `${Baseurl}/get_assetmaster.php?`, JSON.stringify(userStr));

      //console.log("JSON DATA : " + response.data.status)

      if (response.data.status === 'SUCCESS') {
        if (response.data.data.length > 0) {
          for (let value of Object.values(response.data.data)) {
            // console.log(value.ast_mst_asset_no);

            onChangeAssetno(value.ast_mst_asset_no);
            setAssetGroupCode_key(value.ast_mst_asset_grpcode);
            onChangeAssetDescription(value.ast_mst_asset_shortdesc);
            setAssetType_key(value.ast_mst_asset_type);
            setAssetCode_key(value.ast_mst_asset_code);
            setWorkArea_key(value.mst_war_work_area);
            setAssetLocation_key(value.ast_mst_asset_locn);
            setAssetLevel_key(value.ast_mst_asset_lvl);
            setAssetStatus_key(value.ast_mst_asset_status);
            setCriticalFactor_key(value.ast_mst_cri_factor);
            setCostCenter_key(value.ast_mst_cost_center);
            setRowID(value.RowID);

            //console.log(value.ast_det_warranty_date.date)

            // let momentObj = moment(value.ast_det_warranty_date.date, 'yyyy-MM-dd HH:mm:ss')
            let showDate = moment(value.ast_det_warranty_date.date).format( 'yyyy-MM-DD');
            if (showDate == '1900-01-01') {
            } else {
              console.log(showDate);
              setwarranty_Date(showDate);
            }
          }

          get_asset_attachment(asset_no, row_id);
          
        } else {
          setspinner(false);
          setAlert(true, 'warning', response.data.message, 'OK','');
        }
      } else {
        setspinner(false);
        setAlert(true, 'danger', response.data.message, 'OK','');
        return;
      }
    } catch (error) {
      setspinner(false);
      Alert.alert( 'Error', error.message, [ { text: 'OK' } ], { cancelable: false } );
    }
  };

  //GET ASSET ATTACHMENT API
  const get_asset_attachment = async (asset_no, row_id) => {
    let dvc_id = DeviceInfo.getDeviceId();
    const SPLIT_URL = Baseurl.split('/');
    const SPLIT_URL1 = SPLIT_URL[SPLIT_URL.length - 2];
    const SPLIT_URL2 = SPLIT_URL[SPLIT_URL.length - 1];
    const SPLIT_URL3 = SPLIT_URL1+'/'+SPLIT_URL2
    console.log('URL' + SPLIT_URL3);

    try {
      console.log( 'JSON DATA : ' + `${Baseurl}/get_asset_attachment_by_params.php?site_cd=${Site_cd}&rowid=${row_id}&type=P&url=${Baseurl}&folder=${SPLIT_URL3}&dvc_id=${dvc_id}`, );
      const response = await axios.get( `${Baseurl}/get_asset_attachment_by_params.php?site_cd=${Site_cd}&rowid=${row_id}&type=P&url=${Baseurl}&folder=${SPLIT_URL3}&dvc_id=${dvc_id}`, );

      //console.log("JSON DATA : " + response.data.status)

      if (response.data.status === 'SUCCESS') {

        Attachments_List.length = 0;
        images_list.length = 0;
        images_link.length = 0;

        if (response.data.data.length > 0) {

          setAttachments_List([]);
          setimages_list([])
          setimages_link([])
          for (let value of Object.values(response.data.data)) {

        
            let key = Attachments_List.length + 1;
            let localIdentifier = key;
            let path = value.full_size_link;
            let name = value.file_name;
            let rowid = value.rowid;
            let imagetype = 'Exist';
            let type
            const lowerCaseFileName = value.file_name.toLowerCase();

            if (lowerCaseFileName.endsWith('.jpg') || lowerCaseFileName.endsWith('.jpeg')) {

              type = 'image/jpg'
              
              images_list.unshift({ key, path, name, imagetype, type, localIdentifier, rowid});
              setimages_list(images_list.slice(0));

            } else if (lowerCaseFileName.endsWith('.mp4')) {
              
              type = 'video/mp4'
              //console.log('The file is a PNG image.');
            } else if (lowerCaseFileName.endsWith('.pdf')) {
             
              type = 'application/pdf'
             // console.log('The file is not a JPG or PNG image.');
            }

            //console.log('PATH' + JSON.stringify(path));

            Attachments_List.unshift({ key, path, name, imagetype, type, localIdentifier, rowid});
            setAttachments_List(Attachments_List.slice(0));
            key++;
            
          }

          for (let i = 0; i < images_list.length; i++) {

            let key = i + 1
            setimages_link(images_link=>[...images_link,{ key:key,url:images_list[i].path,name:images_list[i].name}]);

          }



          setspinner(false);
        } else {
          setspinner(false);
        }
      } else {
        setspinner(false);
        setAlert(true, 'danger', response.data.message, 'OK','');
      }
    } catch (error) {
      setspinner(false);
      Alert.alert(
        'Error',
        error.message,
        [
          { text: 'OK' }
        ],
        { cancelable: false }
      );
    }
  };

  const get_button = () => {
    console.log(SubmitButton);
    setspinner(true);
    if (SubmitButton == 'Save') {
      //setspinner(false)
      //Insert_image('40056','Asset Number : MSW102483 created successfully')

      get_validation();
    } else if (SubmitButton == 'Edit') {
      setSubmitButton('Update');
      setSubmitButtonColor('#8BC34A');
      setEditable(false);
      setAssetDescription_editable(true);

      setspinner(false);
    } else if (SubmitButton == 'Update') {
      setspinner(false);

      get_validation();
    }
  };

  const get_validation = () => {
    setspinner(true);

    console.log(Assetno_validation);

    if (Assetno_validation) {
      if (!Assetno) {
        setspinner(false);
        Valid = false;
        //alert('Please Enter Asset No');
        setAlert(true, 'warning', 'Please Enter Asset No', 'OK','');
        return;
      } else {
        Valid = true;
      }
    }

    if (visible_WRL) {
      if (!WorkAreaRelocationReason) {
        setspinner(false);
        Valid = false;
        //alert('Please Enter WorkArea Relocation Reason');
        setAlert( true, 'warning', 'Please Enter WorkArea Relocation Reason', 'OK','' );
        return;
      } else {
        Valid = true;
      }
    }

    if (visible_ARL) {
      if (!AssetRelocationReason) {
        setspinner(false);
        Valid = false;
        //alert('Please Enter Asset Relocation Reason');
        setAlert( true, 'warning', 'Please Enter  Asset Relocation Reason', 'OK','' );
        return;
      } else {
        Valid = true;
      }
    }

    if (!AssetGroupCode_key) {
      setspinner(false);
      Valid = false;
      //alert('Please Select Asset Group Code');
      setAlert(true, 'warning', 'Please Select Asset Group Code', 'OK','');
      return;
    } else {
      if (!AssetDescription) {
        setspinner(false);
        Valid = false;
        //alert('Please Enter Asset Description');
        setAlert(true, 'warning', 'Please Enter Asset Description', 'OK','');
        return;
      } else {
        if (!AssetType_key) {
          setspinner(false);
          Valid = false;
          //alert('Please Select Asset Type');
          setAlert(true, 'warning', 'Please Select Asset Type', 'OK','');
          return;
        } else {
          if (!AssetCode_key) {
            setspinner(false);
            Valid = false;
            //alert('Please Select Asset Code');
            setAlert(true, 'warning', 'Please Select Asset Code', 'OK','');
            return;
          } else {
            if (!WorkArea_key) {
              setspinner(false);
              Valid = false;
              //alert('Please Select Work Area');
              setAlert(true, 'warning', 'Please Select Work Area', 'OK','');
              return;
            } else {
              if (!AssetLocation_key) {
                setspinner(false);
                Valid = false;
                //alert('Please Select Asset Location');
                setAlert(true, 'warning', 'Please Select Asset Location', 'OK','');
                return;
              } else {
                if (!AssetLevel_key) {
                  setspinner(false);
                  Valid = false;
                  //alert('Please Select Asset Level');
                  setAlert(true, 'warning', 'Please Select Asset Level', 'OK','');
                  return;
                } else {
                  if (!AssetStatus_key) {
                    setspinner(false);
                    Valid = false;
                    //alert('Please Select Asset Status');
                    setAlert( true, 'warning', 'Please Select Asset Status', 'OK','' );
                    return;
                  } else {
                    if (!CriticalFactor_key) {
                      setspinner(false);
                      Valid = false;
                      //alert('Please Select Critical Factor');
                      setAlert(true, 'warning', 'Please Critical Factor', 'OK','');
                      return;
                    } else {
                      if (!CostCenter_key) {
                        setspinner(false);
                        Valid = false;
                        //alert('Please "Select Cost Center"');
                        setAlert( true, 'warning', 'Please Select Cost Center', 'OK','' );
                        return;
                      } else {
                        Valid = true;

                        if (Valid) {
                          if (SubmitButton == 'Save') {
                            Create_asset();

                            console.log('Save');
                          } else if (SubmitButton == 'Update') {
                            Update_asset();
                            console.log('Edit');
                          }
                        } else {
                          setspinner(false);
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };

  //CREATE NEW ASSET API
  const Create_asset = async () => {
    setspinner(true);

    // let AssetGroupCode,AssetType,AssetCode,WorkAreal,AssetLocation,AssetLevel,AssetStatus,CriticalFactor,CostCenter;

    // if(!AssetGroupCode_key){

    // }else{

    // }

    // if(!AssetType_key){

    // }else{

    // }

    // if(!AssetCode_key){

    // }else{

    // }

    // if(!WorkArea_key){

    // }else{

    // }

    const AssetGroupCode_str = AssetGroupCode_key.split(':');
    console.log(AssetGroupCode_str[0]);

    const AssetType_str = AssetType_key.split(':');
    console.log(AssetType_str[0]);

    const AssetCode_str = AssetCode_key.split(':');
    console.log(AssetCode_str[0]);

    const WorkAreal_str = WorkArea_key.split(':');
    console.log(WorkAreal_str[0]);

    const AssetLocation_str = AssetLocation_key.split(':');
    console.log(AssetLocation_str[0]);

    const AssetLevel_str = AssetLevel_key.split(':');
    console.log(AssetLevel_str[0]);

    const AssetStatus_str = AssetStatus_key.split(':');
    console.log(AssetStatus_str[0]);

    const CriticalFactor_str = CriticalFactor_key.split(':');
    console.log(CriticalFactor_str[0]);

    const CostCenter_str = CostCenter_key.split(':');
    console.log(CostCenter_str[0]);

    

    let Create_New_Asset = {
      site_cd: Site_cd,
      ast_mst_asset_no: Assetno,
      ast_mst_asset_group: AssetGroupCode_str[0].trim(),
      ast_mst_asset_shortdesc: AssetDescription.trim(),
      ast_mst_asset_type: AssetType_str[0].trim(),
      ast_mst_asset_code: AssetCode_str[0].trim(),
      mst_war_work_area: WorkAreal_str[0].trim(),
      ast_mst_asset_locn: AssetLocation_str[0].trim(),
      ast_mst_asset_lvl: AssetLevel_str[0].trim(),
      ast_mst_asset_status: AssetStatus_str[0].trim(),
      ast_mst_cri_factor: CriticalFactor_str[0].trim(),
      ast_mst_cost_center: CostCenter_str[0].trim(),
      ast_det_warranty_date: Warranty_Date,
      EmpID: EmpID,
      EmpName: EmpName,
      asset_group_ID: groupID,
      asset_type: asset_type,
      LOGINID: LoginID,
    };

    console.log('Create_New_Asset : ' + JSON.stringify(Create_New_Asset));

    try {
      const response = await axios.post( `${Baseurl}/insert_asset.php?`, JSON.stringify(Create_New_Asset),
        {headers: {'Content-Type': 'application/json'}},
      );

      console.log('Insert asset response:' + JSON.stringify(response.data));

      if (response.data.status === 'SUCCESS') {
        console.log('Insert asset Image lenght:' + Attachments_List);
        if (Attachments_List.length > 0) {
          Insert_image(response.data.ROW_ID, response.data.message);
        } else {
          setspinner(false);
          // Alert.alert(response.data.status, response.data.message, [
          //   {text: 'OK', onPress: () => navigation.navigate('MainTabScreen')},
          // ]);
          setAlert(true, 'success', response.data.message, 'InsertAsset','');
        }
      } else {
        setspinner(false);
        setAlert(true, 'danger', response.data.message, 'OK','');
      }
    } catch (error) {
      setspinner(false);
      Alert.alert(
        'Error',
        error.message,
        [
          { text: 'OK' }
        ],
        { cancelable: false }
      );
    }
  };

  //INSERT ATTACHMENT API
  const Insert_image = async (ROW_ID, message) => {
    
    console.log('LENGTH: ' + Attachments_List.length);
    console.log('ROW_ID: ' + ROW_ID);

    const SPLIT_URL = Baseurl.split('/');
    const SPLIT_URL1 = SPLIT_URL[SPLIT_URL.length - 2];
    const SPLIT_URL2 = SPLIT_URL[SPLIT_URL.length - 1];
    const SPLIT_URL3 = SPLIT_URL1+'/'+SPLIT_URL2
    console.log('URL' + SPLIT_URL3);

    let data = {
      data: {
        rowid: ROW_ID,
        site_cd: Site_cd,
        EMPID: EmpID,
        LoginID: LoginID,
        folder: SPLIT_URL3,
        dvc_id: dvc_id,
      },
    };

    console.log(JSON.stringify(data));
    console.log(Attachments_List);
    const formData = new FormData();
    formData.append('count', Attachments_List.length);
    formData.append('json', JSON.stringify(data));

    let k = 0;
    for (let i = 0; i < Attachments_List.length; i++) {

      const type = Attachments_List[i].type.split('/');
      console.log('type',type[0]);
      var t;
      if(type[0] === 'video'){
        t= '.mp4'
      }else{
        t =Attachments_List[i].name
      }

      k++;
      formData.append('file_' + [k], {
        uri: Attachments_List[i].path,
        name: t,
        type: Attachments_List[i].type,
      });
      //formData.append('photo', {uri: Attachments_List[i].path,name: Attachments_List[i].name});
      // formData.append('Content-Type', 'image/png');
    }

    console.log('formData: ' + JSON.stringify(formData));

      fetch(`${Baseurl}/insert_asset_image_file.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData, // Your FormData object
      })
      .then((response) => response.json())
      .then((data) => {
        
        if (data.status === 'SUCCESS') {
          setspinner(false);
          setAlert(true, 'success', data.message, 'InsertAsset','');

        }else{

          setspinner(false);
          setAlert(true, 'warning', data.message , 'OK', '', '');
        }
       
      })
      .catch((error) => {
        setspinner(false);
        Alert.alert(
          'Error',
          error.message,
          [
            { text: 'OK' }
          ],
          { cancelable: false }
        );
        
      });

    // try {
    //   const xhr = new XMLHttpRequest();
    //   xhr.open('POST', `${Baseurl}/insert_asset_image_file.php?`);
    //   xhr.setRequestHeader('Content-Type', 'multipart/form-data');
    //   xhr.send(formData);
    //   // console.log('success', xhr);
    //   xhr.onreadystatechange = e => {
    //     if (xhr.readyState !== 4) {
    //       setspinner(false);
    //       return;
    //     }

    //     if (xhr.status === 200) {
    //       console.log('success', xhr.responseText);

    //       var json_obj = JSON.parse(xhr.responseText);

    //       console.log('success', json_obj.data);

    //       if (json_obj.data.ast_ref.length > 0) {
    //         setspinner(false);
    //         // Alert.alert(json_obj.status, message , [
    //         //   {text: 'OK', onPress: () => navigation.navigate('MainTabScreen')},
    //         // ]);

    //         setAlert(true, 'success', message, 'InsertAsset','');
    //       } else {
    //         setspinner(false);
    //         // Alert.alert(json_obj.status, message, [
    //         //   {text: 'OK', onPress: () => navigation.navigate('MainTabScreen')},
    //         // ]);

    //         setAlert(true, 'success', message, 'InsertAsset','');
    //       }
    //     } else {
    //       setspinner(false);
    //       alert(xhr.responseText);
    //       setAlert(true, 'danger', xhr.responseText, 'OK','');
    //       //console.log('error', xhr.responseText);
    //     }
    //   };
    // } catch (error) {
    //   setspinner(false);
    //   alert(error);
    // }
  };

  //UPDATE ASSET API
  const Update_asset = async () => {
    setspinner(true);

    const AssetGroupCode_str = AssetGroupCode_key.split(':');
    console.log(AssetGroupCode_str[0]);

    const AssetType_str = AssetType_key.split(':');
    console.log(AssetType_str[0]);

    const AssetCode_str = AssetCode_key.split(':');
    console.log(AssetCode_str[0]);

    const WorkAreal_str = WorkArea_key.split(':');
    console.log(WorkAreal_str[0]);

    const AssetLocation_str = AssetLocation_key.split(':');
    console.log(AssetLocation_str[0]);

    const AssetLevel_str = AssetLevel_key.split(':');
    console.log(AssetLevel_str[0]);

    const AssetStatus_str = AssetStatus_key.split(':');
    console.log(AssetStatus_str[0]);

    const CriticalFactor_str = CriticalFactor_key.split(':');
    console.log(CriticalFactor_str[0]);

    const CostCenter_str = CostCenter_key.split(':');
    console.log(CostCenter_str[0])

    let update_asset = {
      site_cd: Site_cd,
      ast_mst_asset_no: Assetno.trim(),
      ast_mst_asset_grpcode: AssetGroupCode_str[0].trim(),
      ast_mst_asset_shortdesc: AssetDescription.trim(),
      ast_mst_asset_type: AssetType_str[0].trim(),
      ast_mst_asset_code: AssetCode_str[0].trim(),
      ast_mst_work_area: WorkAreal_str[0].trim(),
      ast_mst_asset_locn: AssetLocation_str[0].trim(),
      ast_mst_ast_lvl: AssetLevel_str[0].trim(),
      ast_mst_asset_status: AssetStatus_str[0].trim(),
      ast_mst_cri_factor: CriticalFactor_str[0].trim(),
      ast_mst_cost_center: CostCenter_str[0].trim(),
      ast_det_warranty_date: Warranty_Date,
      EmpID: EmpID,
      RowID: RowID,
      work_remake: WorkAreaRelocationReason,
      Loc_remake: AssetRelocationReason,
      LOGINID: LoginID,
    };

    console.log('Update Asset : ' + JSON.stringify(update_asset));

    try {
      const response = await axios.post( `${Baseurl}/update_asset.php?`, JSON.stringify(update_asset),
        {headers: {'Content-Type': 'application/json'}},
      );
      console.log(
        'Insert asset response:' + JSON.stringify(response.data.status),
      );
      if (response.data.status === 'SUCCESS') {
        if (Attachments_List.length > 0) {
          UploadImage(RowID, response.data.message);
        } else {
          setspinner(false);
          // Alert.alert(response.data.status, response.data.message, [
          //   {
          //     text: 'OK',
          //     onPress: () =>
          //       navigation.navigate('AssetListing', {
          //         Screenname: route.params.Screenname,
          //         Assetno: route.params.Assetno,
          //         AssetDescription: route.params.AssetDescription,
          //         Employee_Key: route.params.Employee_Key,
          //         CostCenter_Key: route.params.CostCenter_Key,
          //         AssetStatus_Key: route.params.AssetStatus_Key,
          //         AssetType_Key: route.params.AssetType_Key,
          //         AssetGroupCode_Key: route.params.AssetGroupCode_Key,
          //         Asset_Key: route.params.Asset_Key,
          //         WorkArea_Key: route.params.WorkArea_Key,
          //         AssetLocation_Key: route.params.AssetLocation_Key,
          //         AssetLevel_Key: route.params.AssetLevel_Key,
          //       }),
          //   },
          // ]);

          setAlert(true, 'success', response.data.message, 'UpdateAsset','');
        }
      } else {
        setspinner(false);
        // Alert.alert(response.data.status, response.data.message, [
        //   {text: 'OK'},
        // ]);

        setAlert(true, 'danger', response.data.message, 'OK','');
      }
    } catch (error) {
      setspinner(false);
      Alert.alert(
        'Error',
        error.message,
        [
          { text: 'OK' }
        ],
        { cancelable: false }
      );
    }
  };

  //UPDATE Asset ATTACHMENTS API
  const UploadImage = async (ROW_ID, message) => {

    console.log('LENGTH: ' + Attachments_List.length);
    console.log('ROW_ID: ' + ROW_ID);

    const SPLIT_URL = Baseurl.split('/');
    const SPLIT_URL1 = SPLIT_URL[SPLIT_URL.length - 2];
    const SPLIT_URL2 = SPLIT_URL[SPLIT_URL.length - 1];
    const SPLIT_URL3 = SPLIT_URL1+'/'+SPLIT_URL2
    console.log('URL' + SPLIT_URL3);

    let imagelist = [];

    let data = {
      data: {
        rowid: ROW_ID,
        site_cd: Site_cd,
        EMPID: EmpID,
        LOGINID: LoginID,
        folder: SPLIT_URL3,
        dvc_id: dvc_id
      },
    };

    for (let i = 0; i < Attachments_List.length; i++) {
      if (Attachments_List[i].imagetype === 'New') {
        imagelist.push(Attachments_List[i]);
      }
    }
    //console.log("IMAGE PATH : "+JSON.stringify(imagelist));
    //console.log(JSON.stringify(data));
    ///console.log(Attachments_List.data);

    const formData = new FormData();
    formData.append('count', imagelist.length);
    formData.append('json', JSON.stringify(data));

    let k = 0;
    for (let i = 0; i < imagelist.length; i++) {

      const type = Attachments_List[i].type.split('/');
      console.log('type',type[0]);
      var name;
      if(type[0] === 'video'){
        name= '.mp4'
      }else{
        name =Attachments_List[i].name
      }

      k++;
      formData.append('file_' + [k], {
        uri: imagelist[i].path,
        name: name,
        type: Attachments_List[i].type,
        filesize: Attachments_List[i].filesize,
      });

      //formData.append('photo', {uri: Attachments_List[i].path,name: Attachments_List[i].name});
      // formData.append('Content-Type', 'image/png');
    }
    //console.log('formData:' + JSON.stringify(formData));
    //console.log(Baseurl);

    //const starttime = Date.now();
    //setspinner(false);
    

    fetch(`${Baseurl}/update_asset_image_file.php?`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData, // Your FormData object
    })
      .then((response) => response.json())
      .then((data) => {
        

        if (data.status === 'SUCCESS') {
          setspinner(false);
          setAlert(true, 'success', data.message, 'UpdateAsset','');

        }else{

          setspinner(false);
          setAlert(true, 'warning', data.message , 'OK', '', '');
        }
       
      })
      .catch((error) => {
        setspinner(false);
        Alert.alert(
          'Error',
          error.message,
          [
            { text: 'OK' }
          ],
          { cancelable: false }
        );
        //console.log('error', error);
        
      });

    // try {
    //   const xhr = new XMLHttpRequest();
    //   xhr.open('POST', `${Baseurl}/update_asset_image_file.php?`);
    //   xhr.setRequestHeader('Content-Type', 'multipart/form-data');
    //   xhr.send(formData);
    //   // console.log('success', xhr);
    //   xhr.onreadystatechange = e => {
    //     if (xhr.readyState !== 4) {
    //       return;
    //     }

    //     if (xhr.status === 200) {
    //       console.log('success', xhr.responseText);

    //       var json_obj = JSON.parse(xhr.responseText);

    //       console.log('success', json_obj.data);

    //       if (json_obj.data.ast_ref.length > 0) {
    //         setspinner(false);
    //         // Alert.alert(json_obj.status, message, [
    //         //   {text: 'OK', onPress: () => _goBack()},
    //         // ]);

    //         setAlert(true, 'success', message, 'UpdateAsset','');
    //       } else {
    //         setspinner(false);
    //         // Alert.alert(json_obj.status, message, [
    //         //   {text: 'OK', onPress: () => _goBack()},
    //         // ]);

    //         setAlert(true, 'success', message, 'UpdateAsset','');
    //       }
    //     } else {
    //       setspinner(false);
    //       // alert(xhr.responseText);
    //       setAlert(true, 'danger', xhr.responseText, 'OK','');
    //       // console.log('error', xhr.responseText);
    //     }
    //   };
    // } catch (error) {
    //   setspinner(false);
    //   alert(error);
    // }
  };

  const Warranty_Date_clear = () => {
    if (!Warranty_Date_editable) {
      setwarranty_Date('');
    }
  };

  const showDatePicker = () => {
    //console.warn(title)
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    let fromDate = moment(date).format('yyyy-MM-DD');
    //console.warn(fromDate)
    setwarranty_Date(fromDate);

    hideDatePicker();
  };

  //Selection Dropdown
  const select_dropdown = (dropname, data) => {
    //console.log(data)
    settextvalue(dropname);
    setFilteredDataSource(data);
    setDropdown_data(data);
    setDropDown_modalVisible(!DropDown_modalVisible);
  };

  //Dropdown Filter
  const Dropdown_searchFilterFunction = text => {
    // Check if searched text is not blank
    if (text) {
      let newData;

      if (textvalue == 'Critical Factor') {
        newData = Dropdown_data.filter(function (item) {
          const itemData = `${item.ast_cri_cri_factor.toUpperCase()},
            ,${item.ast_cri_desc.toUpperCase()})`;

          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      } else if (textvalue == 'Cost Center') {
        newData = Dropdown_data.filter(function (item) {
          const itemData = `${item.costcenter.toUpperCase()},
            ,${item.descs.toUpperCase()})`;

          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      } else if (textvalue == 'Asset Status') {
        newData = Dropdown_data.filter(function (item) {
          const itemData = `${item.ast_sts_status.toUpperCase()},
            ,${item.ast_sts_desc.toUpperCase()})`;

          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      } else if (textvalue == 'Asset Type') {
        newData = Dropdown_data.filter(function (item) {
          const itemData = `${item.ast_type_cd.toUpperCase()},
            ,${item.ast_type_descs.toUpperCase()})`;

          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      } else if (textvalue == 'Asset Group Code') {
        newData = Dropdown_data.filter(function (item) {
          const itemData = `${item.ast_grp_grp_cd.toUpperCase()},
            ,${item.ast_grp_desc.toUpperCase()})`;

          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      } else if (textvalue == 'Asset Code') {
        newData = Dropdown_data.filter(function (item) {
          const itemData = `${item.ast_cod_ast_cd.toUpperCase()},
            ,${item.ast_cod_desc.toUpperCase()})`;

          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      } else if (textvalue == 'Work Area') {
        newData = Dropdown_data.filter(function (item) {
          const itemData = `${item.mst_war_work_area.toUpperCase()},
            ,${item.mst_war_desc.toUpperCase()})`;

          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      } else if (textvalue == 'Asset Location') {
        newData = Dropdown_data.filter(function (item) {
          const itemData = `${item.ast_loc_ast_loc.toUpperCase()},
            ,${item.ast_loc_desc.toUpperCase()})`;

          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      } else if (textvalue == 'Asset Level') {
        newData = Dropdown_data.filter(function (item) {
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
      setFilteredDataSource(Dropdown_data);
      setSearch(text);
    }
  };

  //Dropdown Refresh
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);

    if (textvalue == 'Cost Center') {
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
    } else if (textvalue == 'Critical Factor') {
      setFilteredDataSource(CriticalFactor);
    }

    setRefreshing(false);
  }, [refreshing]);

  //Dropdown XML
  const renderText = item => {
    if (textvalue == 'Critical Factor') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{width: '40%'}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}>Critical Factor :</Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{color: '#000'}}>{item.ast_cri_cri_factor}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{width: '40%'}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}>Description :</Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{color: '#000'}}>{item.ast_cri_desc}</Text>
            </View>
          </View>
        </View>
      );
    } else if (textvalue == 'Cost Center') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{width: '40%'}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}>Cost Center :</Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{color: '#000'}}>{item.costcenter} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{width: '40%'}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}>Description : </Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{color: '#000'}}>{item.descs} </Text>
            </View>
          </View>
        </View>
      );
    } else if (textvalue == 'Asset Status') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{width: '40%'}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}>Status : </Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{color: '#000'}}>{item.ast_sts_status} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{width: '40%'}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}>Description : </Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{color: '#000'}}>{item.ast_sts_desc} </Text>
            </View>
          </View>
        </View>
      );
    } else if (textvalue == 'Asset Type') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{width: '40%'}}>
              <Text placeholder="Test" style={{color: '#0096FF', fontWeight: 'bold'}}>Type Code :</Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{color: '#000'}}>{item.ast_type_cd} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{width: '40%'}}>
              <Text placeholder="Test" style={{color: '#0096FF', fontWeight: 'bold'}}>Description :</Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{color: '#000'}}>{item.ast_type_descs}</Text>
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
            <View style={{width: '50%'}}>
              <Text placeholder="Test" style={{color: '#0096FF', fontWeight: 'bold'}}>Asset Group Code :</Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{color: '#000'}}>{item.ast_grp_grp_cd} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{width: '50%'}}>
              <Text placeholder="Test" style={{color: '#0096FF', fontWeight: 'bold'}}>Asset Group Desc :</Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{color: '#000'}}>{item.ast_grp_desc} </Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{width: '50%'}}>
              <Text placeholder="Test" style={{color: '#0096FF', fontWeight: 'bold'}}>Asset Auto No :</Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{color: '#000'}}>{option} </Text>
            </View>
          </View>
        </View>
      );
    } else if (textvalue == 'Asset Code') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{width: '40%'}}>
              <Text placeholder="Test" style={{color: '#0096FF', fontWeight: 'bold'}}>Asset Code : </Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{marginLeft: 15, color: '#000'}}>{item.ast_cod_ast_cd}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{width: '40%'}}>
              <Text placeholder="Test" style={{color: '#0096FF', fontWeight: 'bold'}}>Description : </Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{marginLeft: 15, color: '#000'}}>{item.ast_cod_desc}</Text>
            </View>
          </View>
        </View>
      );
    } else if (textvalue == 'Work Area') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{width: '40%'}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}>Work Area : </Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{color: '#000'}}>{item.mst_war_work_area}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{width: '40%'}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}>Description : </Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{color: '#000'}}>{item.mst_war_desc}</Text>
            </View>
          </View>
        </View>
      );
    } else if (textvalue == 'Asset Location') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{width: '40%'}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}>Asset Location : </Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{color: '#000'}}>{item.ast_loc_ast_loc}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{width: '40%'}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}>Description : </Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{color: '#000'}}>{item.ast_loc_desc}</Text>
            </View>
          </View>
        </View>
      );
    } else if (textvalue == 'Asset Level') {
      return (
        <View style={styles.dropdown_style}>
          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{width: '40%'}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}>Asset Level : </Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{color: '#000'}}>{item.ast_lvl_ast_lvl}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 5}}>
            <View style={{width: '40%'}}>
              <Text placeholder="Test" style={{ color: '#0096FF', fontWeight: 'bold', justifyContent: 'flex-start', }}>Description : </Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{color: '#000'}}>{item.ast_lvl_desc}</Text>
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

    if (textvalue == 'Cost Center') {
      setCostCenter_key(item.costcenter + ' : ' + item.descs);
    } else if (textvalue == 'Asset Status') {
      setAssetStatus_key(item.ast_sts_status + ' : ' + item.ast_sts_desc);
    } else if (textvalue == 'Asset Type') {
      setAssetType_key(item.ast_type_cd + ' : ' + item.ast_type_descs);
    } else if (textvalue == 'Asset Group Code') {
      setAssetGroupCode_key(item.ast_grp_grp_cd + ' : ' + item.ast_grp_desc);

      if (item.ast_grp_option == '1') {
        setgroupID('1');
      } else {
        setgroupID('0');
      }
      if (auto_numbering == 'M' && asset_group == 'M') {
        setAssetno_editable(true);
        setAssetno_validation(true);
        setasset_type('MM');
      } else if (auto_numbering == 'M' && asset_group == 'G') {
        setAssetno_editable(true);
        setAssetno_validation(true);
        setasset_type('MG');
        if (groupID == '0') {
          setAssetno_editable(true);
          setAssetno_validation(true);
        } else {
          setAssetno_editable(false);
          setAssetno_validation(false);
        }
      } else if (auto_numbering == 'A' && asset_group == 'M') {
        setAssetno_editable(false);
        setAssetno_validation(false);
        setasset_type('AM');
      } else if (auto_numbering == 'A' && asset_group == 'G') {
        setAssetno_editable(false);
        setAssetno_validation(false);
        setasset_type('AG');
        if (groupID == '0') {
          setAssetno_editable(true);
          setAssetno_validation(true);
        } else {
          setAssetno_editable(false);
          setAssetno_validation(false);
        }
      }
    } else if (textvalue == 'Asset Code') {
      setAssetCode_key(item.ast_cod_ast_cd + ' : ' + item.ast_cod_desc);
    } else if (textvalue == 'Work Area') {
      setWorkArea_key(item.mst_war_work_area + ' : ' + item.mst_war_desc);
    } else if (textvalue == 'Asset Location') {
      setAssetLocation_key(item.ast_loc_ast_loc + ' : ' + item.ast_loc_desc);
    } else if (textvalue == 'Asset Level') {
      setAssetLevel_key(item.ast_lvl_ast_lvl + ' : ' + item.ast_lvl_desc);
    } else if (textvalue == 'Critical Factor') {
      setCriticalFactor_key(
        item.ast_cri_cri_factor + ' : ' + item.ast_cri_desc,
      );
    }

    setSearch('');
    setDropDown_modalVisible(!DropDown_modalVisible);
  };

  //Attachement File
  const onDelete = value => {
    console.log(value);

    if (value.imagetype == 'New') {
      // Alert.alert('Delete Image', 'Do you want to delete this image?', [
      //   {
      //     text: 'NO',
      //     onPress: () => console.log('Cancel Pressed'),
      //     style: 'cancel',
      //   },
      //   {text: 'YES', onPress: () => DeleteNewImage(value)},
      // ]);

      setAlert_two(
        true,
        'delete',
        'Do you want to delete this image?',
        'DeleteNewImage',
        value,
      );
    } else {
      // Alert.alert('Delete Image', 'Do you want to delete this image?', [
      //   {
      //     text: 'NO',
      //     onPress: () => console.log('Cancel Pressed'),
      //     style: 'cancel',
      //   },
      //   {text: 'YES', onPress: () => DeleteImage(value)},
      // ]);

      setAlert_two(
        true,
        'delete',
        'Do you want to delete this image?',
        'DeleteImage',
        value,
      );
    }
  };

  const DeleteNewImage = value => {
    const data = Attachments_List.filter(
      item =>
        item?.localIdentifier &&
        item?.localIdentifier !== value?.localIdentifier,
    );
    setAttachments_List(data);
  };

  const DeleteImage = async value => {
    console.log('VALUE IMG', value.rowid);
    setspinner(true);

    try {
      console.log( 'Delete Image API : ' + `${Baseurl}/delete_asset_attachment_file.php?site_cd=${Site_cd}&RowID=${value.rowid}`, );
      const response = await axios.get( `${Baseurl}/delete_asset_attachment_file.php?site_cd=${Site_cd}&RowID=${value.rowid}`, );

      console.log('JSON DATA : ' + response.data.status);

      if (response.data.status === 'SUCCESS') {
        // Alert.alert(response.data.status, response.data.message, [
        //   {
        //     text: 'OK',
        //     onPress: () => {
        //       const data = Attachments_List.filter(
        //         item =>
        //           item?.localIdentifier &&
        //           item?.localIdentifier !== value?.localIdentifier,
        //       );
        //       setAttachments_List(data);
        //     },
        //   },
        // ]);

        setAlert(true, 'success', response.data.message, 'DELETE_IMG',value);

        setspinner(false);
      } else {
        setspinner(false);
        setAlert(true, 'success', response.data.message, 'OK','');
       // alert(response.data.message);
        return;
      }
    } catch (error) {
      setspinner(false);
      alert(error);
    }
  };

  const Attachments_ItemView = ({item}) => {
    
    const type = item.type.split('/');
    //console.log('loop type',type[0]);

    return (

      <View style={{flex: 1,backgroundColor: '#fff', borderRadius: 10, margin: 10, alignItems: 'center',}}>

        <TouchableOpacity onPress={() => Attachment_show(item)}>

          {
            type[0] === 'image' && <Image width={IMAGE_WIDTH} source={{uri: item.path}} resizeMode="contain" style={{width: 160, height: 160, margin: 10}} /> ||
            type[0] === 'video' && <Image width={IMAGE_WIDTH} source={require('../../images/playervideo.png')} style={{width: 160, height: 160, margin: 10}} /> ||
            // type[0] === 'video' && 
            // <View style={{height: 150, width: 250, }}>
            //   <Thumbnail url={item.path} showPlayIcon={true} />
            // </View>
            
            
            // ||
            type[0] === 'application' && <Image width={IMAGE_WIDTH} source={require('../../images/pdf.png')} style={{width: 160, height: 160, margin: 10}} />
          }

        </TouchableOpacity>

        {!Editable && (
          <TouchableOpacity
            onPress={() => onDelete(item)}
            activeOpacity={0.5}
            style={styles.buttonDelete}>
            <Ionicons name="close-circle-outline" color="red" size={35} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const Attachments_onItem = item => {
    

    return (
      // Flat List Item Separator
      <View style={{ height: 1, marginLeft: 5, marginRight: 5, backgroundColor: '#C8C8C8', }} />
    );
  };


  //Onclick
  const Attachment_show = item => {
    console.log('show:', item);

    const type = item.type.split('/');
    console.log('type',type[0]);
    if(type[0] === 'image'){

      
      setType_link('image')

      //console.log('show KEY:', linkindex);

      console.log('show list', JSON.stringify(link));

      for (let i = 0; i < images_link.length; i++) {
        
        if(item.name === images_link[i].name){

          setlinkindex(images_link[i].key -1)

          console.log('show KEY:', images_link[i].key);

          console.log('show KEY after:', images_link[i].key -1 );

        }
     
      }

      
     
     

    }else if(type[0] === 'video'){

      setType_link('video')
      setlink(item.path);
      

    }else if(type[0] === 'application'){

      setType_link('application')
      setlink(item.path);
      
    }
    
    setmodalVisible(!modalVisible);
  };

  

  //MORE BUTTON ONCLICK OPTIONS
  const get_more = () => {
    if (SubmitButton == 'Save') {
      setAlert( true, 'warning', 'You must save asset before you go into more options...', 'OK','' );
    } else if (SubmitButton == 'Update') {
      setAlert( true, 'warning', 'You must update asset before you go into more options...', 'OK','' );
    } else {
      setMoreVisible(!isMoreVisible);
    }
  };

  const More_ItemView = ({item}) => {
    return (
      <TouchableOpacity onPress={() => getMore_Item(item)}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', margin: 10, borderRadius: 10, }}>
          <Feather
            name={item.Image}
            color={'#000'}
            size={25}
            onPress={() => setMoreVisible(false)}
          />

          <Text style={{ fontSize: 15, justifyContent: 'center', alignItems: 'center', color: '#000', marginTop: 5, }}> {item.Name} </Text>

          <Text style={{ fontSize: 15, justifyContent: 'center', alignItems: 'center', color: '#000', }}></Text>
        </View>
      </TouchableOpacity>
    );
  };

  const More_ItemSeparatorView = () => {
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

  const getMore_Item = item => {
    // Function for click on an item
    //alert('Id : ' + item.ast_mst_asset_no );
    setMoreVisible(!isMoreVisible);
    console.log(JSON.stringify(item.Name));

    if (item.Name == 'Asset Spare List') {
      
      if (route.params.Screenname == 'AssetListing') {

        navigation.navigate('AssetSpareList', {
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
      } else if (route.params.Screenname == 'ScanAssetMaster') {
        navigation.navigate('AssetSpareList', {
          Screenname: route.params.Screenname,
          ScanAssetno: route.params.ScanAssetno,
          ScanAssetRowID: route.params.ScanAssetRowID,
        });
      }
    } else if (item.Name == 'Work Order History') {
      if (route.params.Screenname == 'AssetListing') {
        navigation.navigate('WorkOrderListing', {
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
      } else if (route.params.Screenname == 'ScanAssetMaster') {
        navigation.navigate('WorkOrderListing', {
          Screenname: route.params.Screenname,
          ScanAssetno: route.params.ScanAssetno,
          ScanAssetType: 'Edit',
          ScanAssetRowID: route.params.ScanAssetRowID,
        });
      }
    }
  };

  const One_Alret_onClick = D => {
    if (D === 'OK') {
      setShow(false);
    } else if (D === 'InsertAsset') {
      setShow(false);

      navigation.navigate('MainTabScreen');
    } else if (D === 'UpdateAsset') {
      setShow(false);

      _goBack();
    }else if (D === 'DELETE_IMG') {
      setShow(false);

      const data = Attachments_List.filter(
        item => item?.localIdentifier && item?.localIdentifier !== ImgValue?.localIdentifier,
      );
      setAttachments_List(data);

      const images_list_data = images_list.filter(
        item => item?.localIdentifier && item?.localIdentifier !== ImgValue?.localIdentifier,
      );
      setimages_list(images_list_data);
  
      const images_link_data = images_link.filter(
        item => item?.localIdentifier && item?.localIdentifier !== ImgValue?.localIdentifier,
      );
      setimages_link(images_link_data);
    }
  };

  const Alret_onClick = D => {
    setShow_two(false);

    if (D === 'DeleteNewImage') {
      DeleteNewImage(ImgValue);
    } else if (D === 'DeleteImage') {
      DeleteImage(ImgValue);
    }
  };

  //video
  const captureImage = async type => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      videoQuality: 'high',
      durationLimit: 30, //Video max duration in seconds
      saveToPhotos: true,
     
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();

    if(DeviceInfo.getSystemVersion() === '13'){

      launchCamera(options, response => {
        console.log('Response = ', response);

         if (response.didCancel) {
          //alert('User cancelled camera picker');
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          alert('Camera not available on device');
          return;
        } else if (response.errorCode == 'permission') {
          alert('Permission not satisfied');
          return;
        } else if (response.errorCode == 'others') {
          alert(response.errorMessage);
          return;
        }


        for (let value of Object.values(response.assets)) {

          
          console.log('Valeu', value.uri);

          compress(value.uri,value.fileName,value.type,value.fileSize)

          // let key = Attachments_List.length + 1;
          // let localIdentifier = key;
          // let path = value.uri;
          // let name = value.fileName;
          // let rowid = '';
          // let type = value.type;
          // let imagetype = 'New';
          // Attachments_List.unshift({
          //   key,
          //   path,
          //   name,
          //   type,
          //   imagetype,
          //   localIdentifier,
          //   rowid,
          // });
          // setAttachments_List(Attachments_List.slice(0));
          // key++;
        }

       
        // console.log('base64 -> ', response.base64);
        // console.log('uri -> ', response.uri);
        // console.log('width -> ', response.width);
        // console.log('height -> ', response.height);
        // console.log('fileSize -> ', response.fileSize);
        // console.log('type -> ', response.type);
        // console.log('fileName -> ', response.fileName);
        //setFilePath(response);
      });
    
    

      

    }else{

      if (isCameraPermitted && isStoragePermitted) {

        launchCamera(options, response => {
          console.log('Response = ', response);
  
           if (response.didCancel) {
            //alert('User cancelled camera picker');
            return;
          } else if (response.errorCode == 'camera_unavailable') {
            alert('Camera not available on device');
            return;
          } else if (response.errorCode == 'permission') {
            alert('Permission not satisfied');
            return;
          } else if (response.errorCode == 'others') {
            alert(response.errorMessage);
            return;
          }
  
          
  
          for (let value of Object.values(response.assets)) {
            console.log('Valeu', value.uri);

            compress(value.uri,value.fileName,value.type,value.fileSize)


            // let key = Attachments_List.length + 1;
            // let localIdentifier = key;
            // let path = value.uri;
            // let name = value.fileName;
            // let rowid = '';
            // let type = value.type;
            // let imagetype = 'New';
            // Attachments_List.unshift({
            //   key,
            //   path,
            //   name,
            //   type,
            //   imagetype,
            //   localIdentifier,
            //   rowid,
            // });
            // setAttachments_List(Attachments_List.slice(0));
            // key++;
          }
  
         
          // console.log('base64 -> ', response.base64);
          // console.log('uri -> ', response.uri);
          // console.log('width -> ', response.width);
          // console.log('height -> ', response.height);
          // console.log('fileSize -> ', response.fileSize);
          // console.log('type -> ', response.type);
          // console.log('fileName -> ', response.fileName);
          //setFilePath(response);
        });
      
      }

    }
    
  };

  //PDF
  const selectFile = async () => {
    // Opening Document Picker to select one file

    let isReadPermitted = await requestExternalReadPermission();

    if(DeviceInfo.getSystemVersion() === '13'){

      try {
        const res = await DocumentPicker.pick({
          // Provide which type of file you want user to pick
          type: [DocumentPicker.types.pdf],
          copyTo:'documentDirectory'
          // There can me more options as well
          // DocumentPicker.types.allFiles
          // DocumentPicker.types.images
          // DocumentPicker.types.plainText
          // DocumentPicker.types.audio
          // DocumentPicker.types.pdf
        });
        // Printing the log realted to the file
        console.log('res : ' + JSON.stringify(res));
        // Setting the state to show single file attributes
        //setSingleFile(res);
    
    
        for (let value of Object.values(res)) {
          console.log('Valeu', value.uri);
          let key = Attachments_List.length + 1;
          let localIdentifier = key;
          let path = value.fileCopyUri;
          let name = value.name;
          let rowid = '';
          let type = value.type;
          let imagetype = 'New';
          Attachments_List.unshift({
            key,
            path,
            name,
            type,
            imagetype,
            localIdentifier,
            rowid,
          });
          setAttachments_List(Attachments_List.slice(0));
          key++;
        }
    
      } catch (err) {
        //setSingleFile(null);
        // Handling any exception (If any)
        if (DocumentPicker.isCancel(err)) {
          // If user canceled the document selection
          //alert('Canceled');
        } else {
          // For Unknown Error
          alert('Unknown Error: ' + JSON.stringify(err));
          throw err;
        }
      }

    }else{

      if(isReadPermitted){

        try {
          const res = await DocumentPicker.pick({
            // Provide which type of file you want user to pick
            type: [DocumentPicker.types.pdf],
            copyTo:'documentDirectory'
            // There can me more options as well
            // DocumentPicker.types.allFiles
            // DocumentPicker.types.images
            // DocumentPicker.types.plainText
            // DocumentPicker.types.audio
            // DocumentPicker.types.pdf
          });
          // Printing the log realted to the file
          console.log('res : ' + JSON.stringify(res));
          // Setting the state to show single file attributes
          //setSingleFile(res);
      
      
          for (let value of Object.values(res)) {
            console.log('Valeu', value.uri);
            let key = Attachments_List.length + 1;
            let localIdentifier = key;
            let path = value.fileCopyUri;
            let name = value.name;
            let rowid = '';
            let type = value.type;
            let imagetype = 'New';
            Attachments_List.unshift({
              key,
              path,
              name,
              type,
              imagetype,
              localIdentifier,
              rowid,
            });
            setAttachments_List(Attachments_List.slice(0));
            key++;
          }
      
        } catch (err) {
          //setSingleFile(null);
          // Handling any exception (If any)
          if (DocumentPicker.isCancel(err)) {
            // If user canceled the document selection
            alert('Canceled');
          } else {
            // For Unknown Error
            alert('Unknown Error: ' + JSON.stringify(err));
            throw err;
          }
        }
    
      }

    }
    
    
  };

  

  const compress =async (uri,fileName,IMGtype,IMGSIZE) =>{

    const sp_type = IMGtype.split('/');
    console.log('type',sp_type[0]);

    if(sp_type[0] === 'image'){

      const result = await CPImage.compress(uri);

     
      let key = Attachments_List.length + 1
      let localIdentifier = key
      let path = result
      let name = fileName
      let rowid = ''
      let type = IMGtype
      let imagetype = 'New'
      let filesize = IMGSIZE

     

      Attachments_List.unshift({ key, path, name, type, imagetype, localIdentifier, rowid,filesize});
      setAttachments_List(Attachments_List.slice(0));
      images_list.unshift({ key, path, name, imagetype, type, localIdentifier, rowid});
      setimages_list(images_list.slice(0));
      key++;
      setimages_link([]);
      for (let i = 0; i < images_list.length; i++) {
  
        let key = i + 1
        setimages_link(images_link=>[...images_link,{ key:key,url:images_list[i].path,name:images_list[i].name}]);
  
      }

    }else if(sp_type[0] === 'video'){

      const result = await CPVideo.compress(
        uri,
        {compressionMethod: 'auto'},
        (progress) => {
          console.log('Compression Progress: ', progress);

          setspinner(true);
          
        }
      );
      
      let key = Attachments_List.length + 1
      let localIdentifier = key
      let path = result
      let name = fileName
      let rowid = ''
      let type = IMGtype
      let imagetype = 'New'
      let filesize = IMGSIZE
      Attachments_List.unshift({ key, path, name, type, imagetype, localIdentifier, rowid,filesize});
      setAttachments_List(Attachments_List.slice(0));
      key++;
      setspinner(false);
    }
  
  }

  return (
    <DismissKeyboard>
      <SafeAreaProvider>
        <Appbar.Header style={{backgroundColor: '#42A5F5'}}>
          <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between'}}>
            <Pressable onPress={_goBack}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <FontAwesome name="angle-left" color="#fff" size={55} style={{marginLeft: 15, marginBottom: 5}} />
                <Text style={{ fontSize: 20, justifyContent: 'center', textAlign: 'center', color: '#fff', fontWeight: 'bold', marginLeft: 15, }}> {Toolbartext} </Text>
              </View>
            </Pressable>
          </View>
        </Appbar.Header>

        <ProgressLoader visible={spinner} isModal={true} isHUD={true} hudColor={'#808080'} color={'#FFFFFF'} />

        <SCLAlert theme={Theme} show={Show} title={Title}>
          <SCLAlertButton theme={Theme} onPress={() => One_Alret_onClick(Type)}> OK </SCLAlertButton>
        </SCLAlert>

        <SCLAlert theme={Theme} show={Show_two} title={Title}>
          <SCLAlertButton theme={Theme} onPress={() => Alret_onClick(Type)}> Yes </SCLAlertButton>

          <SCLAlertButton theme="default" onPress={() => setShow_two(false)}> No </SCLAlertButton>
        </SCLAlert>

        <DateTimePicker
          isVisible={isDatepickerVisible}
          mode="date"
          locale="en_GB"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />

        <Modal
          animationType="slide"
          transparent={true}
          visible={DropDown_modalVisible}
          onRequestClose={() => {
            Alert.alert('Closed');
            setDropDown_modalVisible(!DropDown_modalVisible);
          }}>
          <View style={styles.model2_cardview}>
            <View style={{flex: 1, margin: 20, backgroundColor: '#FFFFFF'}}>
              <View style={{ flexDirection: 'row', alignItems: 'center', height: 50, }}>
                <Text style={{ flex: 1, fontSize: 15, justifyContent: 'center', textAlign: 'center', color: '#000', fontWeight: 'bold', }}> {textvalue} </Text>
                <Ionicons name="close" color="red" size={30} style={{marginEnd: 15}} onPress={() => setDropDown_modalVisible(!DropDown_modalVisible) } />
              </View>

              <SearchBar
                lightTheme
                round
                inputStyle={{color: '#000'}}
                inputContainerStyle={{backgroundColor: '#FFFF'}}
                searchIcon={{size: 24}}
                onChangeText={text => Dropdown_searchFilterFunction(text)}
                onClear={text => Dropdown_searchFilterFunction('')}
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
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              />
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
           // Alert.alert('Closed');
            setmodalVisible(!modalVisible);
          }}>
          <View style={styles.model_cardview}>
            <View style={{ flex: 1,backgroundColor: '#FFFFFF'}}>
              

              {
                //Type_link === 'image' && <Image width={IMAGE_WIDTH} resizeMode="contain"  source={{uri: link}} style={{alignSelf: 'center', height:'100%', width:'100%', margin: 10,}}/> ||
                Type_link === 'image' && 

                <ImageViewer 
                  imageUrls={images_link} 
                  style={{flex: 1}} 
                  index={linkindex}
                  onSwipeDown={() => { setmodalVisible(!modalVisible)}} 
                  onClick={()=> setmodalVisible(!modalVisible)} 
                  enableSwipeDown={true}/>

                ||


                Type_link === 'video' &&  
                
                <View style={{flex: 1}}>

                  <Appbar.Header style={{backgroundColor: '#000'}}>
                      <View style={{ flex: 1,alignItems:'flex-end'}}>
                        
                           <AntDesign style={{marginRight:20}} color="#fff" name={'close'} size={25} onPress={() => setmodalVisible(!modalVisible) } />
                         
                      </View>
                    </Appbar.Header>

                  <Video 
                        source={{uri: link}} 
                        
                        //ref={ref => (videoPlayer.current = ref)}
                     // the video file
                       
                        disableFullscreen={true}
                        disableVolume={true}
                        disableBack={true}
                        resizeMode="contain"
                        paused={false}       
                        style={{ 
                          flex: 1,
                          
                        }}   // Can be a URL or a local file.
                        />     

                  
                </View>
                // <Video source={{ uri: link }} style={{flex: 1}} muted={false}/>
                
                ||

                Type_link === 'application' && 

                <View style={{flex: 1}}>

                  <Appbar.Header style={{backgroundColor: '#000'}}>
                      <View style={{ flex: 1,alignItems:'flex-end'}}>
                        
                           <AntDesign style={{marginRight:20}} color="#fff" name={'close'} size={25} onPress={() => setmodalVisible(!modalVisible) } />
                         
                      </View>
                    </Appbar.Header>
                    <Pdf 
                      trustAllCerts={false}
                      onError={(error) => { console.log(error)}} 
                      onLoadComplete={(numberOfPages, filePath) => { console.log(`Number of pages: ${numberOfPages}`) }}
                      source={{uri: link, cache: true }} 
                      style={{height: 700, margin: 10}}
                    /> 

                  
                </View>
                  
              }
             
            </View>
          </View>
        </Modal>

        <View style={{flex: 1, marginBottom: 60}}>
          <FlatList
            ListHeaderComponent={
              <View style={styles.container}>
                 <Pressable>
                <View style={styles.card}>
                  <View style={styles.card_heard}>
                    <Text style={styles.card_heard_text}> ASSET DESCRIPTION </Text>
                  </View>

                  {/* Asset No */}
                  <View style={styles.view_style}>
                    <TextInput
                      value={Assetno}
                      style={[styles.input, {height: 50}]}
                      inputStyle={[ styles.inputStyle, { color: Assetno_editable ? Assetno ? '#808080' : '#000' : Assetno ? '#808080' : '#000', }]}
                      labelStyle={styles.labelStyle}
                      placeholderStyle={{ fontSize: 15, color: Assetno_editable ? '#0096FF' : '#808080', }}
                      textErrorStyle={styles.textErrorStyle}
                      label="Asset No"
                      editable={Assetno_editable}
                      selectTextOnFocus={Assetno_editable}
                      onChangeText={text => { onChangeAssetno(text.toUpperCase()) }}
                      renderRightIcon={() =>
                        !Assetno_editable ? (
                          ''
                        ) : (
                          <AntDesign
                            style={styles.icon}
                            name={Assetno ? 'close' : 'search1'}
                            size={20}
                            disable={true}
                            onPress={() => (Assetno ? onChangeAssetno() : '')}
                          />
                        )
                      }
                    />
                  </View>

                  {/* Asset GroupCode*/}
                  <View style={styles.view_style}>
                    <Pressable
                      onPress={() => !Editable ? select_dropdown('Asset Group Code', AssetGroupCode) : '' }
                      onLongPress={() => setAssetGroupCode_key('')}>
                      <View pointerEvents={'none'}>
                        <TextInput
                          value={AssetGroupCode_key}
                          style={[ styles.input, { height: Math.max( 50, AGC_height )}]}
                          onContentSizeChange={event => setAGC_height(event.nativeEvent.contentSize.height) }
                          inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}]}
                          labelStyle={styles.labelStyle}
                          multiline
                          placeholderStyle={{ fontSize: 15, color: '#0096FF'}}
                          label="Asset Group Code"
                          editable={Editable}
                          selectTextOnFocus={Editable}
                          onChangeText={text => console.log(text)}
                          renderRightIcon={() =>
                            Editable ? (
                              ''
                            ) : (
                              <AntDesign
                                style={styles.icon}
                                color={'black'}
                                name={AssetGroupCode_key ? 'close' : 'search1'}
                                size={22}
                                disable={true}
                                onPress={() => AssetGroupCode_key ? setAssetGroupCode_key('') : select_dropdown( 'Asset Group Code', AssetGroupCode, ) }
                              />
                            )
                          }
                        />
                      </View>
                    </Pressable>
                  </View>

                  {/* Asset Description */}
                  <View style={styles.view_style}>
                    <TextInput
                      value={AssetDescription}
                      style={[ styles.input, { height: Math.max( Platform.OS === 'ios' ? 50 : 50, height )}]}
                      multiline
                      inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}, ]}
                      labelStyle={styles.labelStyle}
                      placeholderStyle={{ fontSize: 15, color: '#0096FF', }}
                      onContentSizeChange={event => setHeight(event.nativeEvent.contentSize.height) }
                      label="Description"
                      editable={AssetDescription_editable}
                      onChangeText={text => { onChangeAssetDescription(text) }} 
                      renderRightIcon={() =>
                        Editable ? (
                          ''
                        ) : (
                          <AntDesign
                            style={styles.icon}
                            name={AssetDescription ? 'close' : ''}
                            size={20}
                            disable={true}
                            onPress={() =>
                              AssetDescription
                                ? onChangeAssetDescription('')
                                : ''
                            }
                          />
                        )
                      }
                    />
                  </View>

                  {/* Asset Type*/}
                  <View style={styles.view_style}>
                    <Pressable
                      onPress={() => !Editable ? select_dropdown('Asset Type', AssetType) : '' }
                      onLongPress={() => setAssetType_key('')}>
                      <View pointerEvents={'none'}>
                        <TextInput
                          value={AssetType_key}
                          style={[styles.input, {height: 50}]}
                          inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}, ]}
                          labelStyle={styles.labelStyle}
                          multiline
                          placeholderStyle={{ fontSize: 15, color: '#0096FF', }}
                          label="Asset Type"
                          editable={false}
                          selectTextOnFocus={false}
                          renderRightIcon={() =>
                            Editable ? (
                              ''
                            ) : (
                              <AntDesign
                                style={styles.icon}
                                color={'black'}
                                name={AssetType_key ? 'close' : 'search1'}
                                size={22}
                                disable={true}
                                onPress={() =>
                                  AssetType_key
                                    ? setAssetType_key('')
                                    : select_dropdown('Asset Type', AssetType)
                                }
                              />
                            )
                          }
                        />
                      </View>
                    </Pressable>
                  </View>

                  {/* Asset Code*/}
                  <View style={styles.view_style}>
                    <Pressable
                      onPress={() => !Editable ? select_dropdown('Asset Code', Assetcode) : '' }
                      onLongPress={() => setAssetCode_key('')}>
                      <View pointerEvents={'none'}>
                        <TextInput
                          value={AssetCode_key}
                          style={[styles.input, {height: 50}]}
                          inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}, ]}
                          labelStyle={styles.labelStyle}
                          multiline={true}
                          placeholderStyle={{ fontSize: 15, color: '#0096FF', }}
                          label="Asset Code"
                          editable={false}
                          selectTextOnFocus={false}
                          renderRightIcon={() =>
                            Editable ? (
                              ''
                            ) : (
                              <AntDesign
                                style={styles.icon}
                                color={'black'}
                                name={AssetCode_key ? 'close' : 'search1'}
                                size={22}
                                disable={true}
                                onPress={() =>
                                  AssetCode_key
                                    ? setAssetCode_key('')
                                    : select_dropdown('Asset Code', Assetcode)
                                }
                              />
                            )
                          }
                        />
                      </View>
                    </Pressable>
                  </View>
                </View>

                <View style={styles.card}>
                  <View style={styles.card_heard}>
                    <Text style={styles.card_heard_text}>ASSET DEATAIL</Text>
                  </View>

                  {/* Work Area*/}
                  <View style={styles.view_style}>
                    <Pressable
                      onPress={() => !Editable ? select_dropdown('Work Area', WorkArea) : '' }
                      onLongPress={() => setWorkArea_key('')}>
                      <View pointerEvents={'none'}>
                        <TextInput
                          value={WorkArea_key}
                          style={[styles.input, {height: 50}]}
                          inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}]}
                          labelStyle={styles.labelStyle}
                          multiline={true}
                          placeholderStyle={{ fontSize: 15, color: '#0096FF'}}
                          label="Work Area"
                          editable={false}
                          selectTextOnFocus={false}
                          renderRightIcon={() =>
                            Editable ? (
                              ''
                            ) : (
                              <AntDesign
                                style={styles.icon}
                                color={'black'}
                                name={WorkArea_key ? 'close' : 'search1'}
                                size={22}
                                disable={true}
                                onPress={() =>
                                  WorkArea_key
                                    ? setWorkArea_key('')
                                    : select_dropdown('Work Area', WorkArea)
                                }
                              />
                            )
                          }
                        />
                      </View>
                    </Pressable>
                  </View>

                  {/* Work Area Relocation Reason */}
                  <View
                    style={[ styles.view_style, {display: visible_WRL ? 'flex' : 'none'}]}>
                    <TextInput
                      value={WorkAreaRelocationReason}
                      style={[styles.input, {height: 50}]}
                      inputStyle={[ styles.inputStyle, {color: visible_WRL ? '#808080' : '#000'}, ]}
                      labelStyle={styles.labelStyle}
                      placeholderStyle={{ fontSize: 15, color: '#0096FF', }}
                      label="Work Area Relocation Reason"
                      editable={visible_WRL}
                      selectTextOnFocus={visible_WRL}
                      onChangeText={text => { onChangeWorkAreaRelocationReason(text); }}
                    />
                  </View>

                  {/* Asset Location */}
                  <View style={styles.view_style}>
                    <Pressable onPress={() => !Editable ? select_dropdown('Asset Location', AssetLocation) : '' }
                      onLongPress={() => setAssetLocation_key('')}>
                      <View pointerEvents={'none'}>
                        <TextInput
                          value={AssetLocation_key}
                          style={[styles.input, {height: 50}]}
                          inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}]}
                          labelStyle={styles.labelStyle}
                          multiline={true}
                          placeholderStyle={{ fontSize: 15, color: '#0096FF'}}
                          label="Asset Location"
                          placeholderTextColor="gray"
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
                                name={AssetLocation_key ? 'close' : 'search1'}
                                size={22}
                                disable={true}
                                onPress={() =>
                                  AssetLocation_key
                                    ? setAssetLocation_key('')
                                    : select_dropdown(
                                        'Asset Location',
                                        AssetLocation,
                                      )
                                }
                              />
                            )
                          }
                        />
                      </View>
                    </Pressable>
                  </View>

                  {/* Asset Relocation Reason */}
                  <View
                    style={[
                      styles.view_style,
                      {display: visible_ARL ? 'flex' : 'none'},
                    ]}>
                    <TextInput
                      value={AssetRelocationReason}
                      style={[styles.input, {height: 50}]}
                      inputStyle={[
                        styles.inputStyle,
                        {color: visible_ARL ? '#808080' : '#000'},
                      ]}
                      labelStyle={styles.labelStyle}
                      placeholderStyle={{
                        fontSize: 15,
                        color: '#0096FF',
                      }}
                      label="Asset Relocation Reason"
                      editable={visible_ARL}
                      selectTextOnFocus={visible_ARL}
                      onChangeText={text => {
                        onChangeAssetRelocationReason(text);
                      }}
                    />
                  </View>

                  {/* Asset Level */}
                  <View style={styles.view_style}>
                    <Pressable
                      onPress={() =>
                        !Editable
                          ? select_dropdown('Asset Level', AssetLevel)
                          : ''
                      }
                      onLongPress={() => setAssetLevel_key('')}>
                      <View pointerEvents={'none'}>
                        <TextInput
                          value={AssetLevel_key}
                          style={[styles.input, {height: 50}]}
                          inputStyle={[
                            styles.inputStyle,
                            {color: Editable ? '#808080' : '#000'},
                          ]}
                          labelStyle={styles.labelStyle}
                          placeholderStyle={{
                            fontSize: 15,
                            color: '#0096FF',
                          }}
                          label="Asset Level"
                          editable={false}
                          selectTextOnFocus={false}
                          renderRightIcon={() =>
                            Editable ? (
                              ''
                            ) : (
                              <AntDesign
                                style={styles.icon}
                                color={'black'}
                                name={AssetLevel_key ? 'close' : 'search1'}
                                size={22}
                                disable={true}
                                onPress={() =>
                                  AssetLevel_key
                                    ? setAssetLevel_key('')
                                    : select_dropdown('Asset Level', AssetLevel)
                                }
                              />
                            )
                          }
                        />
                      </View>
                    </Pressable>
                  </View>

                  {/* Asset Status */}
                  <View style={styles.view_style}>
                    <Pressable
                      onPress={() =>
                        !Editable
                          ? select_dropdown('Asset Status', AssetStatus)
                          : ''
                      }
                      onLongPress={() => setAssetStatus_key('')}>
                      <View pointerEvents={'none'}>
                        <TextInput
                          value={AssetStatus_key}
                          style={[styles.input, {height: 50}]}
                          inputStyle={[
                            styles.inputStyle,
                            {color: Editable ? '#808080' : '#000'},
                          ]}
                          labelStyle={styles.labelStyle}
                          multiline={true}
                          placeholderStyle={{
                            fontSize: 15,
                            color: '#0096FF',
                          }}
                          label="Asset Status"
                          editable={false}
                          selectTextOnFocus={false}
                          renderRightIcon={() =>
                            Editable ? (
                              ''
                            ) : (
                              <AntDesign
                                style={styles.icon}
                                color={'black'}
                                name={AssetStatus_key ? 'close' : 'search1'}
                                size={22}
                                disable={true}
                                onPress={() =>
                                  AssetStatus_key
                                    ? setAssetStatus_key('')
                                    : select_dropdown(
                                        'Asset Status',
                                        AssetStatus,
                                      )
                                }
                              />
                            )
                          }
                        />
                      </View>
                    </Pressable>
                  </View>

                  {/* Critical Factor */}
                  <View style={styles.view_style}>
                    <Pressable
                      onPress={() =>
                        !Editable
                          ? select_dropdown('Critical Factor', CriticalFactor)
                          : ''
                      }
                      onLongPress={() => setCriticalFactor_key('')}>
                      <View pointerEvents={'none'}>
                        <TextInput
                          value={CriticalFactor_key}
                          style={[styles.input, {height: 50}]}
                          inputStyle={[
                            styles.inputStyle,
                            {color: Editable ? '#808080' : '#000'},
                          ]}
                          labelStyle={styles.labelStyle}
                          multiline={true}
                          placeholderStyle={{
                            fontSize: 15,
                            color: '#0096FF',
                          }}
                          label="Critical Factor"
                          editable={false}
                          selectTextOnFocus={false}
                          renderRightIcon={() =>
                            Editable ? (
                              ''
                            ) : (
                              <AntDesign
                                style={styles.icon}
                                color={'black'}
                                name={CriticalFactor_key ? 'close' : 'search1'}
                                size={22}
                                disable={true}
                                onPress={() =>
                                  CriticalFactor_key
                                    ? setCriticalFactor_key('')
                                    : select_dropdown(
                                        'Critical Factor',
                                        CriticalFactor,
                                      )
                                }
                              />
                            )
                          }
                        />
                      </View>
                    </Pressable>
                  </View>

                  {/* Cost Center */}
                  <View style={styles.view_style}>
                    <Pressable
                      onPress={() =>
                        !Editable
                          ? select_dropdown('Cost Center', CostCenter)
                          : ''
                      }
                      onLongPress={() => setCostCenter_key('')}>
                      <View pointerEvents={'none'}>
                        <TextInput
                          value={CostCenter_key}
                          style={[styles.input, {height: 50}]}
                          inputStyle={[
                            styles.inputStyle,
                            {color: Editable ? '#808080' : '#000'},
                          ]}
                          labelStyle={styles.labelStyle}
                          multiline={true}
                          placeholderStyle={{
                            fontSize: 15,
                            color: '#0096FF',
                          }}
                          label="Cost Center"
                          editable={false}
                          selectTextOnFocus={false}
                          renderRightIcon={() =>
                            Editable ? (
                              ''
                            ) : (
                              <AntDesign
                                style={styles.icon}
                                color={'black'}
                                name={CostCenter_key ? 'close' : 'search1'}
                                size={22}
                                disable={true}
                                onPress={() =>
                                  CostCenter_key
                                    ? setCostCenter_key('')
                                    : select_dropdown('Cost Center', CostCenter)
                                }
                              />
                            )
                          }
                        />
                      </View>
                    </Pressable>
                  </View>

                   {/* Warranty Date */}
                   <View style={styles.view_style}>
                    <Pressable
                      onPress={() => (!Editable ? showDatePicker() : '')}>
                      <View pointerEvents={'none'}>
                        <TextInput
                          value={Warranty_Date}
                          style={[styles.input, {height: 50}]}
                          inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}]}
                          labelStyle={styles.labelStyle}
                          multiline={true}
                          placeholderStyle={{ fontSize: 15, color: '#0096FF'}}
                          onTouchStart={() => { !Editable ? showDatePicker() : '' }}
                          label="Warranty Date"
                          editable={false}
                          selectTextOnFocus={false}
                          renderRightIcon={() =>
                            Editable ? (
                              ''
                            ) : (
                              <AntDesign
                                style={styles.icon}
                                color={ Warranty_Date_editable ? 'blue' : 'black' }
                                name={Warranty_Date ? 'close' : 'calendar'}
                                size={20}
                                onPress={() => Warranty_Date ? Warranty_Date_clear() : showDatePicker() }
                              />
                            )
                          }
                        />
                      </View>
                    </Pressable>

                   
                  </View>
                </View>

                <View style={styles.card}>
                  <View style={styles.card_heard}>
                    <Text style={styles.card_heard_text}> ASSET ATTACHMENTS </Text>
                  </View>

                 

                  <View style={[ styles.view_style, { display: !Editable ? 'flex' : 'none', flexDirection: 'row'}]}>
                    <TouchableOpacity
                      style={{ flex: 1.5, marginTop: 10, justifyContent: 'center', alignItems: 'center'}} 
                      onPress={() => setVisible(!isVisible)} 
                      disabled={Editable}>
                      <View style={{ height: 60, width: 60, borderRadius: 30, padding: 10, backgroundColor: '#F7DC6F', justifyContent: 'center', alignItems: 'center'}}>
                        <MaterialIcons
                          name="add-a-photo"
                          color="#05375a"
                          size={30}
                        />
                      </View>
                      <Text style={{margin: 10, color: '#000', fontWeight: 'bold'}}> Image </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{ flex: 1.5, marginTop: 10, justifyContent: 'center', alignItems: 'center'}}
                      onPress={() => captureImage('video')}
                      disabled={Editable}>
                      <View style={{ height: 60, width: 60, borderRadius: 30, padding: 10, backgroundColor: '#F7DC6F', justifyContent: 'center', alignItems: 'center'}}>
                        <MaterialIcons
                          name="switch-video"
                          color="#05375a"
                          size={30}
                        />
                      </View>
                      <Text style={{margin: 10, color: '#000', fontWeight: 'bold'}}> Video </Text>
                    </TouchableOpacity>


                    <TouchableOpacity
                      style={{ flex: 1.5, marginTop: 10, justifyContent: 'center', alignItems: 'center'}}
                      onPress={() => selectFile()}
                      disabled={Editable}>
                      <View style={{ height: 60, width: 60, borderRadius: 30, padding: 10, backgroundColor: '#F7DC6F', justifyContent: 'center', alignItems: 'center'}}>
                        <MaterialIcons
                          name="picture-as-pdf"
                          color="#05375a"
                          size={30}
                        />
                      </View>
                      <Text style={{margin: 10, color: '#000', fontWeight: 'bold'}}> PDF </Text>
                    </TouchableOpacity>

                  </View>

                  <ImagePickerModal
                    title="You can either take a picture or select one from your album."
                    data={['Take a photo', 'Select from the library']}
                    isVisible={isVisible}
                    onCancelPress={() => {
                      setVisible(false);
                    }}
                    onBackdropPress={() => {
                      setVisible(false);
                    }}
                    onPress={item => {
                      console.log('item', item);
                      setVisible(false);
                      for (let value of Object.values(item.assets)) {

                        if(value.duration > 30){
                          setAlert(true, 'danger', 'Video duration more then 30sec please select file less then 30sec', 'OK','');
                          return
                        }else{

                          console.log('Valeu', value.uri);

                          compress(value.uri,value.fileName,value.type,value.fileSize)
                          //console.log('Valeu result', ie);

                          // let key = Attachments_List.length + 1;
                          // let localIdentifier = key;
                          // let path = value.uri;
                          // let name = value.fileName;
                          // let rowid = '';
                          // let type = value.type;
                          // let imagetype = 'New';
                          // let filesize = value.fileSize;
                          // Attachments_List.unshift({ key, path, name, type, imagetype, localIdentifier, rowid,filesize});
                          // setAttachments_List(Attachments_List.slice(0));
                          // key++;

                        }
                       
                      }

                      // setSelectedItem(item);
                      // openPicker()
                    }}
                  />

               
                </View>

                

                {/* More Opstion XML */}
                <View style={styles.centeredView}>
                  <Att_Modal
                    style={styles.bottomModalView}
                    isVisible={isMoreVisible}
                    backdropOpacity={0}>
                    <View style={styles.modal2}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15, margin: 5, }}>
                        <Text style={{ fontSize: 15, justifyContent: 'center', alignItems: 'center', color: '#000', }}></Text>

                        <Ionicons
                          name="close"
                          color={'#000'}
                          size={25}
                          onPress={() => setMoreVisible(false)}
                        />
                      </View>

                      <FlatList
                        data={MoreList}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        ItemSeparatorComponent={More_ItemSeparatorView}
                        renderItem={More_ItemView}
                      />
                    </View>
                  </Att_Modal>
                </View>

              </Pressable>
              </View>
            }
            numColumns={2}
            data={Attachments_List}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={Attachments_onItem}
            renderItem={Attachments_ItemView}
          />
        </View>

        <View style={styles.bottomView}>
          <TouchableOpacity style={{ width: '65%', height: 80, backgroundColor: SubmitButtonColor, marginRight: 5, alignItems: 'center', justifyContent: 'center', }}
            onPress={get_button}>
            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', marginBottom: 15, }}>
              <AntDesign color={'#FFFF'} name={'Safety'} size={25} />
              <Text style={{ color: 'white', fontSize: 14, marginLeft: 8, fontWeight: 'bold', }}> {SubmitButton.toUpperCase()} </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={{ width: '45%', height: 80, backgroundColor: '#0096FF', alignItems: 'center', justifyContent: 'center', }} onPress={get_more}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15, marginRight: 20, }}>
              <AntDesign color={'#FFFF'} name={'ellipsis1'} size={26} />
              <Text style={{ color: 'white', fontSize: 14, marginLeft: 8, fontWeight: 'bold', }}> {'more'.toUpperCase()} </Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaProvider>
    </DismissKeyboard>
  );
};

const {width} = Dimensions.get('window');

const IMAGE_WIDTH = (width - 50) / 1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
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
    fontSize: 14,
    justifyContent: 'center',
    color: '#ffffffff',
    fontWeight: 'bold',
  },

  view_style: {
    marginTop: 12,
    marginLeft: 10,
    marginRight: 10,
  },

  bottomView: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },

  centeredView: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightgrey',
  },
  bottomModalView: {
    justifyContent: 'flex-end',
    margin: 0,
  },

  buttonDelete: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    position: 'absolute',
    alignItems: 'center',
    top: 8,
    right: 5,
    backgroundColor: '#ffffff92',
    borderRadius: 4,
  },

  modal2: {
    width: '100%',
    height: '40%',
    borderRadius: 10,
    borderWidth: 2,
    borderStyle: 'solid',
    backgroundColor: '#e7e7e7',
  },

  input: {
    paddingHorizontal: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#808080',
  },

  inputStyle: {fontSize: 15, marginTop: Platform.OS === 'ios' ? 0 : 0},

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

  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 5,
    top: -10,
    Index: 999,
    color: '#0096FF',
    paddingHorizontal: 8,
    fontSize: 13,
  },

  selectedTextStyle: {
    fontSize: 15,
  },
  iconStyle: {
    width: 25,
    height: 25,
  },
  inputSearchStyle: {
    height: 50,
    fontSize: 15,
    color: '#000',
  },

  model_cardview: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
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

export default CreateAssetScreen;
