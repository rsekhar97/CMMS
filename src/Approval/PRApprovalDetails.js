import React from 'react';
import { View, StyleSheet, Text, Dimensions, FlatList, TouchableOpacity, Alert, Modal, Pressable, TouchableWithoutFeedback, Keyboard, Image} from 'react-native'; import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressLoader from 'rn-progress-loader';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appbar } from 'react-native-paper';
import { openDatabase } from 'react-native-sqlite-storage';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { TextInput } from 'react-native-element-textinput';
import {SCLAlert, SCLAlertButton} from 'react-native-scl-alert';
import Pdf from 'react-native-pdf';
import Video from 'react-native-video-enhanced';
import ImageViewer from 'react-native-image-zoom-viewer';
const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);


const PRApprovalDetails = ({ navigation, route }) => {  
  const [spinner, setspinner] = React.useState(false);
  const [Toolbartext, setToolbartext] = React.useState('Purchase Request Approval',);
  const [height, setHeight] = React.useState(0);
  const _goBack = () => {
    if (route.params.Screenname === 'PRApproval') {
      navigation.navigate('PRApproval', { Screenname: route.params.Screenname });
    }
  };

  const [TotalPRLineNo, setTotalPRLineNo] = React.useState('');
  const [PurchaseRequestNo, setPurchaseRequestNo] = React.useState('');
  const [PRStatus, setPRStatus] = React.useState('');
  const [Requester_Date, setRequester_Date] = React.useState('');
  const [Required_Date, setRequired_Date] = React.useState('');
  const [Requester_by, setRequester_by] = React.useState('');
  const [Entered_by, setEntered_by] = React.useState('');
  const [Cost_Center, setCost_Center] = React.useState('');
  const [Account, setAccount] = React.useState('');
  const [MRApproval_Status, setMRApproval_Status] = React.useState('');
  const [MRApproval_Process, setMRApproval_Process] = React.useState('');
  const [Total_cost, setTotal_cost] = React.useState('');
  const [PR_Note, setPR_Note] = React.useState('');

  const [PRList, setPRList] = React.useState([]);

  const [modal_approve, setmodal_approve] = React.useState(false);
  const [modal_disapprove, setmodal_disapprove] = React.useState(false);
  const [modal_reject, setmodal_reject] = React.useState(false);

  const [Approval_level, setApproval_level] = React.useState('');
  const [Approval_emp_id, setApproval_emp_id] = React.useState('');
  const [Approval_limit, setApproval_limit] = React.useState('');
  const [Approval_RowId, setApproval_RowId] = React.useState('');
  const [Approval_count, setApproval_count] = React.useState('');
  const [Approval_Remake, setApproval_Remake] = React.useState('');
  var sync_date = moment().format('YYYY-MM-DD HH:mm');

  //Alert
  const [Show, setShow] = React.useState(false);
  const [Theme, setTheme] = React.useState('');
  const [Title, setTitle] = React.useState('');
  const [AlertType, setAlertType] = React.useState('');

  //Attachement Modal
  const [Attachments_modalVisible, setAttachments_modalVisible] = React.useState(false);
  const [ZoomAttachments_modalVisible, setZoomAttachments_modalVisible] = React.useState(false);
  const [images, setImages] = React.useState([]);
  const [Attachments_List, setAttachments_List] = React.useState([]);
  const [images_list, setimages_list] = React.useState([]);

  const [Type_link, setType_link] = React.useState();
  const [link, setlink] = React.useState([]);
  const [images_link, setimages_link] = React.useState([]);
  const [linkindex, setlinkindex] = React.useState(0);

  const [Visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const focusHander = navigation.addListener('focus', () => {
      fetchData();
    });
    return focusHander;
  }, [navigation]);

  const fetchData = async () => {
    dvc_id = DeviceInfo.getDeviceId();
    brand = DeviceInfo.getBrand();

    Baseurl = await AsyncStorage.getItem('BaseURL');
    Site_cd = await AsyncStorage.getItem('Site_Cd');
    LoginID = await AsyncStorage.getItem('emp_mst_login_id');
    EmpName = await AsyncStorage.getItem('emp_mst_name');
    EmpID = await AsyncStorage.getItem('emp_mst_empl_id');
    EmpPhone = await AsyncStorage.getItem('emp_mst_homephone');
    EmpWorkGrp = await AsyncStorage.getItem('emp_det_work_grp');

    //console.log(route.params.RowId)

    get_pr_approval_List_details(route.params.RowID);
  };

  //MR Approval List API
  const get_pr_approval_List_details = async RowID => {
    setspinner(true);

    try {
      console.log( 'JSON DATA : ' + `${Baseurl}/get_pr_approval_List_details.php?site_cd=${Site_cd}&RowID=${RowID}`);

      const response = await axios.get( `${Baseurl}/get_pr_approval_List_details.php?site_cd=${Site_cd}&RowID=${RowID}`, );
     // console.log(JSON.stringify(response));

      if (response.data.status === 'SUCCESS') {
        for (let i = 0; i < response.data.header.length; ++i) {
          let reqdate = moment( response.data.header[i].pur_mst_req_date.date, ).format('yyyy-MM-DD HH:mm');
          let rqndate = moment( response.data.header[i].pur_mst_rqn_date.date, ).format('yyyy-MM-DD HH:mm');

          setPurchaseRequestNo(response.data.header[i].pur_mst_porqnnum);
          setPRStatus(response.data.header[i].pur_mst_status);
          setRequester_Date(reqdate);
          setRequired_Date(rqndate);
          setRequester_by(response.data.header[i].pur_mst_requested_by);
          setEntered_by(response.data.header[i].pur_mst_entered_by);
          setCost_Center(response.data.header[i].pur_mst_chg_costcenter);
          setAccount(response.data.header[i].pur_mst_chg_account);
          setMRApproval_Status(response.data.header[i].pur_mst_purq_approve);
          setMRApproval_Process(response.data.header[i].Approval_Status);
          setTotal_cost(response.data.header[i].pur_mst_tot_cost);
          setPR_Note(response.data.header[i].pur_mst_notes)
        }
        setTotalPRLineNo(response.data.line.length);
        setPRList(response.data.line);
        //setspinner(false);

        get_pr_approval_attachment(RowID)

      } else {
        setspinner(false);
        alert(response.data.message);
        return;
      }
    } catch (error) {
      setspinner(false);
      alert(error);
    }
  };

  // GET WORK ORDER ATTACHMENT FILE API
  const get_pr_approval_attachment = async (RowID) => {

      const SPLIT_URL = Baseurl.split('/');
      const SPLIT_URL1 = SPLIT_URL[SPLIT_URL.length - 2];
      const SPLIT_URL2 = SPLIT_URL[SPLIT_URL.length - 1];
      const SPLIT_URL3 = SPLIT_URL1+'/'+SPLIT_URL2
      // console.log('URL' + SPLIT_URL3);

      try {
        console.log( 'JSON DATA : ' + `${Baseurl}/get_pr_approval_attachment.php?site_cd=${Site_cd}&mst_RowID=${RowID}&EmpID=${EmpID}&url=${Baseurl}&folder=${SPLIT_URL3}&dvc_id=${dvc_id}`);
        const response = await axios.get( `${Baseurl}/get_pr_approval_attachment.php?site_cd=${Site_cd}&mst_RowID=${RowID}&EmpID=${EmpID}&url=${Baseurl}&folder=${SPLIT_URL3}&dvc_id=${dvc_id}`);

        //console.log("JSON DATA : " + response.data.status)
        //console.log("JSON DATA : " + Attachments_List.length)

        if (response.data.status === 'SUCCESS') {

          Attachments_List.length = 0;
          images_list.length = 0;
          images_link.length = 0;

          if (response.data.data.length > 0) {

            setAttachments_List([]);
            setimages_list([]);
            setimages_link([]);

            for (let value of Object.values(response.data.data)) {
              let key = Attachments_List.length + 1;
              let localIdentifier = key;
              let path = value.full_size_link;
              let name = value.file_name;
              let rowid = value.rowid;
              let imagetype = 'Exist';
              //let type = value.column2;

              let type
              const lowerCaseFileName = value.file_name.toLowerCase();

              if (lowerCaseFileName.endsWith('.jpg') || lowerCaseFileName.endsWith('.jpeg')) {

                type = 'image/jpg'
                images_list.unshift({ key, path, name, imagetype, type, localIdentifier, rowid});
                setimages_list(images_list.slice(0));
                //console.log('The file is a JPG image.');
              } else if (lowerCaseFileName.endsWith('.mp4')) {
                type = 'video/mp4'
                //console.log('The file is a PNG image.');
              } else if (lowerCaseFileName.endsWith('.pdf')) {
                type = 'application/pdf'
                //console.log('The file is not a JPG or PNG image.');
              }


              //console.log("PATH"+ JSON.stringify(path));

              Attachments_List.unshift({ key, path, name, imagetype, localIdentifier, rowid, type });
              setAttachments_List(Attachments_List.slice(0));
              key++;
            }

            for (let i = 0; i < images_list.length; i++) {

              let keys = i + 1
              setimages_link(images_link=>[...images_link,{ key:keys,url:images_list[i].path,name:images_list[i].name,localIdentifier:images_list[i].localIdentifier}]);

            }

            // const endtime = Date.now();
            // const uploadtime = endtime - starttime;
            // console.log('starttime', starttime);
            // console.log('endtime', endtime);
            // console.log('uploadtime', uploadtime);
            setspinner(false);

          
          } else {
          
            // const endtime = Date.now();
            // const uploadtime = endtime - starttime;
            // console.log('starttime', starttime);
            // console.log('endtime', endtime);
            // console.log('uploadtime', uploadtime);
            setspinner(false);
          }
        } else {
          setspinner(false);
          setAlert(true, 'danger', response.data.message, 'OK', '', '');
          return;
        }
      } catch (error) {
        setspinner(false);
        Alert.alert( 'Error', error.message, [ { text: 'OK' } ], { cancelable: false } );
      }
    

    
  };

  const ItemView = ({ item }) => {
    return (
      
        <View style={styles.item}>
          <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', }}>
            <Text style={{ color: '#2962FF', fontSize: 13, fontWeight: 'bold', }}> {'MR LineNo: ' + item.pur_ls1_pr_lineno} </Text>
          </View>

          <View style={{ height: 0.5, width: '100%', backgroundColor: '#C8C8C8',margin: 5 }} />

          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <View style={{ width: '40%' }}>
              <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Stock No : </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text placeholder="Test" style={{ justifyContent: 'flex-start', color: '#000' }}> {item.pur_ls1_stockno} </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', marginTop: 5 }}>
            <View style={{ width: '40%' }}>
              <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Supplier : </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text placeholder="Test" style={{ justifyContent: 'flex-start', color: '#000' }}> {item.pur_ls1_supplier} </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', marginTop: 5 }}>
            <View style={{ width: '40%' }}>
              <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Supplier Name : </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text placeholder="Test" style={{ justifyContent: 'flex-start', color: '#000' }}> {item.supplier_name} </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', marginTop: 5 }}>
            <View style={{ width: '40%' }}>
              <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Description : </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text placeholder="Test" style={{ justifyContent: 'flex-start', color: '#000' }}> {item.pur_ls1_desc} </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', marginTop: 5 }}>
            <View style={{ width: '40%' }}>
              <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> UOM : </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text placeholder="Test" style={{ justifyContent: 'flex-start', color: '#000' }}> {item.pur_ls1_ord_uom} </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', marginTop: 5 }}>
            <View>
              <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Request QTY : </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text placeholder="Test" style={{ justifyContent: 'flex-start', color: '#000' }}> {item.pur_ls1_ord_qty} </Text>
            </View>

            <View>
              <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> item Cost : </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text placeholder="Test" style={{ justifyContent: 'flex-start', color: '#000' }}> {item.pur_ls1_item_cost} </Text>
            </View>
          </View>
        </View>
     
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

  //get_approval_button API
  const get_approval_button = async status => {
    setspinner(true);

    let PR_Approve = {
      site_cd: Site_cd,
      loop: route.params.Closed_loop,
      type: route.params.Approval_type,
      EmpID: EmpID,
      LOGINID: LoginID,

      mst_costcenter: route.params.Pur_mst_chg_costcenter,
      mtr_mst_mtr_no: route.params.pr_no,
      RowID: route.params.RowID,
    };

    console.log('Approve Request: ' + JSON.stringify(PR_Approve));

    try {
      const response = await axios.post(`${Baseurl}/get_pr_approval_button.php?`, PR_Approve, { headers: { 'Content-Type': 'application/json' } });
      console.log('Insert asset response:' + JSON.stringify(response.data));

      if (response.data.status === 'SUCCESS') {
        setspinner(false);

        console.log(response.data.data[0]);
        if (response.data.message == 'No Records found') {
          //const num = Number('2020');

          setApproval_level(route.params.app_level + 1);
          setApproval_emp_id(EmpID);
          setApproval_limit(route.params.pr_limit);
          setApproval_RowId('');
          setApproval_count('0');
        } else {
          setApproval_level(response.data.data[0].pur_app_level);
          setApproval_emp_id(response.data.data[0].pur_app_empl_id);
          setApproval_limit(response.data.data[0].pur_app_pr_limit);
          setApproval_RowId(response.data.data[0].RowID);
          setApproval_count('1');
        }

        if (status == 'Approve') {
          setmodal_approve(true);
        } else if (status == 'Disapprove') {
          setmodal_disapprove(true);
        } else if (status == 'Reject') {
          setmodal_reject(true);
        }
      } else {
        setspinner(false);
        Alert.alert(response.data.status, response.data.message, [{ text: 'OK' },])
      }
    } catch (error) {
      setspinner(false);
      alert(error);
    }
  };
  

  //Attachement File
  const Attachments_ItemView = ({item,index}) => {

    //console.log('ITEM PATH:' + JSON.stringify(item));
     const type = item.type.split('/');
    //console.log('loop type', type[0]);
     
 
     return (
       
 
      <View style={{flex: 1,backgroundColor: '#fff', borderRadius: 10, alignItems: 'center'}}>

          

        <TouchableOpacity onPress={() => Attachment_show(item)}>

        {
          type[0] === 'image' && <Image width={IMAGE_WIDTH} source={{uri: item.path}} resizeMode="contain" style={{width: 160, height: 160, margin: 10}} /> ||
          type[0] === 'video' && <Image width={IMAGE_WIDTH} source={require('../../images/playervideo.png')} style={{width: 160, height: 160, margin: 10}} /> ||
          type[0] === 'application' && 
          <Image width={IMAGE_WIDTH} source={require('../../images/pdf.png')} style={{width: 100, height: 100, margin: 10}} />
          
        }
          
        </TouchableOpacity>

        

        {/* {!Editable && (
          <TouchableOpacity
            onPress={() => onDelete(item)}
            activeOpacity={0.5}
            style={styles.buttonDelete}>
            <Ionicons name="close-circle-outline" color="red" size={35} />
          </TouchableOpacity>
        )} */}
      </View>
     );
  };
 
  const Attachments_onItem = item => {
    //console.log(item);

    return (
      // Flat List Item Separator
      <View
        style={{
          height: 1,
          marginLeft: 5,
          marginRight: 5,
          backgroundColor: '#C8C8C8',
        }}
      />
    );
  };

  const Attachment_show = item => {
    //console.log('show:', 'file://'+RNFS.DocumentDirectoryPath+'storage/emulated/0/Download/AC/image_757997BA-9A70-4A83-9BF5-02FCF29AD0F5.jpg');

   // console.log('Att_show:',  JSON.stringify(item));

    const type = item.type.split('/');
    console.log('type',type[0]);
    if(type[0] === 'image'){

      setType_link('image');
      //console.log('show KEY:', linkindex);

      console.log('show list', JSON.stringify(images_link));

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

      //console.log('item.path',item.path);
      const encodepdfurl = encodeURI(item.path);
      //console.log('encodepdfurl',encodepdfurl);
      setType_link('application')
      setlink(encodepdfurl);
    }
    
    setZoomAttachments_modalVisible(!ZoomAttachments_modalVisible);
  };

  const Attachment = () => {
    setVisible(!isVisible);
  };

  const get_approve = async () => {
    setspinner(true);

    let disapprove = {
      site_cd: Site_cd,
      level: Approval_level,
      approval_limit: Approval_limit,
      status: 'Y',
      remark: Approval_Remake,
      loop: route.params.Closed_loop,
      type: route.params.Approval_type,
      count: Approval_count,
      EmpID: EmpID,
      LOGINID: LoginID,
      mtr_app_rowID: Approval_RowId,
      mtr_mst_rowID: route.params.RowID,
      header_audit_date: route.params.Audit_date,
      Mr_tot_cost: route.params.tot_cost,
      mtr_mst_mtr_no: route.params.pr_no,
      mst_costcenter: route.params.Pur_mst_chg_costcenter,
      cur_app_level: route.params.cur_app_level,
      app_level: route.params.app_level,
      dvc_id:dvc_id,
    };

    console.log('approve : ' + JSON.stringify(disapprove));

    try {
      const response = await axios.post(`${Baseurl}/insert_pr_approval.php?`, disapprove, { headers: { 'Content-Type': 'application/json' } });
      console.log('Insert asset response:' + JSON.stringify(response.data));

      if (response.data.status === 'SUCCESS') {
        setspinner(false);
        setmodal_approve(false);
        // Alert.alert(response.data.status, response.data.message, [
        //   {text: 'OK', onPress: () => _goBack()},
        // ]);

        setAlert( true, 'success', response.data.message, 'OK', );
      } else {
        setspinner(false);
        Alert.alert(response.data.status, response.data.message, [
          { text: 'OK' },
        ]);
      }
    } catch (error) {
      setspinner(false);
      alert(error);
    }
  };

  const get_disapprove = async () => {
    setspinner(true);

    let approve = {
      site_cd: Site_cd,
      level: Approval_level,
      approval_limit: Approval_limit,
      status: 'N',
      remark: Approval_Remake,
      loop: route.params.Closed_loop,
      type: route.params.Approval_type,
      count: Approval_count,
      EmpID: EmpID,
      LOGINID: LoginID,
      mtr_app_rowID: Approval_RowId,
      mtr_mst_rowID: route.params.RowID,
      header_audit_date: route.params.Audit_date,
      Mr_tot_cost: route.params.tot_cost,
      mtr_mst_mtr_no: route.params.pr_no,
      mst_costcenter: route.params.Pur_mst_chg_costcenter,
      cur_app_level: route.params.cur_app_level,
      app_level: route.params.app_level,
    };

    console.log('approve : ' + JSON.stringify(approve));

    try {
      const response = await axios.post(
        `${Baseurl}/insert_pr_disapproval.php?`,
        approve,
        { headers: { 'Content-Type': 'application/json' } },
      );
      console.log('Insert asset response:' + JSON.stringify(response.data));

      if (response.data.status === 'SUCCESS') {
        setspinner(false);
        setmodal_disapprove(false);
        // Alert.alert(response.data.status, response.data.message, [
        //   {text: 'OK', onPress: () => _goBack()},
        // ]);

        setAlert( true, 'success', response.data.message, 'OK', );
      } else {
        setspinner(false);
        Alert.alert(response.data.status, response.data.message, [
          { text: 'OK' },
        ]);
      }
    } catch (error) {
      setspinner(false);
      alert(error);
    }
  };

  const get_reject = async () => {
    setspinner(true);

    let reject = {
      site_cd: Site_cd,
      remark: Approval_Remake,
      EmpID: EmpID,
      LOGINID: LoginID,
      mtr_mst_rowID: route.params.RowID,
    };

    console.log('approve : ' + JSON.stringify(reject));

    try {
      const response = await axios.post( `${Baseurl}/insert_pr_reject.php?`, reject, { headers: { 'Content-Type': 'application/json' } }, );
      console.log('Insert asset response:' + JSON.stringify(response.data));

      if (response.data.status === 'SUCCESS') {
        setspinner(false);
        setmodal_reject(false);
        // Alert.alert(response.data.status, response.data.message, [
        //   {text: 'OK', onPress: () => _goBack()},
        // ]);

        setAlert( true, 'success', response.data.message, 'OK', );
      } else {
        setspinner(false);
        Alert.alert(response.data.status, response.data.message, [
          { text: 'OK' },
        ]);
      }
    } catch (error) {
      setspinner(false);
      alert(error);
    }
  };

  const setAlert = (show, theme, title,type) => {
    setShow(show);
    setTheme(theme);
    setTitle(title);
    setAlertType(type);
  };

  const One_Alret_onClick = D => {

    if (D === 'OK') {
      setShow(false);
      _goBack();
    }
    
  }

  return (
    <SafeAreaProvider>
      <Appbar.Header style={{ backgroundColor: '#42A5F5' }}>
        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', }}>
          <Pressable onPress={_goBack}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <FontAwesome
                name="angle-left"
                color="#fff"
                size={55}
                style={{ marginLeft: 15, marginBottom: 5 }}
              />
              <Text style={{ fontSize: 20, justifyContent: 'center', textAlign: 'center', color: '#fff', fontWeight: 'bold', marginLeft: 15, }}> {Toolbartext} </Text>
            </View>
          </Pressable>
        </View>
      </Appbar.Header>

      <ProgressLoader visible={spinner} isModal={true} isHUD={true} hudColor={'#808080'} color={'#FFFFFF'} />

      <SCLAlert theme={Theme} show={Show} title={Title}>
        <SCLAlertButton theme={Theme} onPress={() => One_Alret_onClick(AlertType)}> OK </SCLAlertButton>
      </SCLAlert>

      {/* Approve */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modal_approve}
        onRequestClose={() => {
         //Alert.alert('Closed');
          setmodal_approve(!modal_approve);
        }}>
        <DismissKeyboard>
          <View style={styles.model_cardview}>
            <View style={{ margin: 20, backgroundColor: '#FFFFFF' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0096FF', height: 50, }}>
                <Text style={{ fontSize: 15, alignContent: 'center', color: '#ffffffff', marginLeft: 5, fontWeight: 'bold', }}> Approval </Text>
                <Ionicons
                  name="close"
                  color="#ffffffff"
                  size={25}
                  style={{ marginEnd: 15 }}
                  onPress={() => setmodal_approve(!modal_approve)}
                />
              </View>

              <View style={{ flexDirection: 'column', margin: 15 }}>
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <View style={{ width: '40%' }}>
                    <Text style={{ color: '#DC7633', fontSize: 13, fontWeight: 'bold', }}> Level : </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#DC7633', fontSize: 13, fontWeight: 'bold', }}> {Approval_level} </Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <View style={{ width: '40%' }}>
                    <Text style={{ color: '#05375a', fontSize: 13, fontWeight: 'bold', }}> Employee ID : </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#05375a', fontSize: 13, fontWeight: 'bold', }}> {Approval_emp_id} </Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <View style={{ width: '40%' }}>
                    <Text style={{ color: '#99A3A4', fontSize: 13, fontWeight: 'bold', }}> Approval Date : </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#99A3A4', fontSize: 13, fontWeight: 'bold', }}> {sync_date} </Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <View style={{ width: '40%' }}>
                    <Text style={{ color: '#99A3A4', fontSize: 13, fontWeight: 'bold', }}> Approval Limit : </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#99A3A4', fontSize: 13, fontWeight: 'bold', }}> {Approval_limit} </Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <View style={{ width: '40%' }}>
                    <Text style={{ color: '#99A3A4', fontSize: 13, fontWeight: 'bold', }}> Status : </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#99A3A4', fontSize: 13, fontWeight: 'bold', }}> Approve </Text>
                  </View>
                </View>

                {/* Asset Description */}
                <View style={styles.view_style}>
                  <TextInput
                    value={Approval_Remake}
                    style={[ styles.input, { height: Math.max( Platform.OS === 'ios' ? 150 : 150, height)}]}
                    multiline={true}
                    onContentSizeChange={event =>
                      setHeight(event.nativeEvent.contentSize.height)
                    }
                    inputStyle={styles.inputStyle}
                    labelStyle={styles.labelStyle}
                    placeholderStyle={styles.placeholderStyle}
                    textErrorStyle={styles.textErrorStyle}
                    label="Remark"
                    placeholderTextColor="gray"
                    clearButtonMode="always"
                    focusColor="#808080"
                    onChangeText={text => {
                      setApproval_Remake(text);
                    }}
                  />
                </View>
              </View>

              <TouchableOpacity style={{ width: '100%', height: 50, alignItems: 'center', justifyContent: 'center', backgroundColor: 'green', marginTop: 10, }}
                onPress={() => get_approve()}>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}> SAVE </Text>
              </TouchableOpacity>
            </View>
          </View>
        </DismissKeyboard>
      </Modal>

      {/* disapprove */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modal_disapprove}
        onRequestClose={() => {
         //Alert.alert('Closed');
          setmodal_disapprove(!modal_disapprove);
        }}>
        <DismissKeyboard>
          <View style={styles.model_cardview}>
            <View style={{ margin: 20, backgroundColor: '#FFFFFF' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0096FF', height: 50, }}>
                <Text style={{ fontSize: 15, alignContent: 'center', color: '#ffffffff', marginLeft: 5, fontWeight: 'bold', }}> Disapproval </Text>
                <Ionicons name="close" color="#ffffffff" size={25} style={{ marginEnd: 15 }} onPress={() => setmodal_disapprove(!modal_disapprove)} />
              </View>

              <View style={{ flexDirection: 'column', margin: 15 }}>
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <View style={{ width: '40%' }}>
                    <Text style={{ color: '#DC7633', fontSize: 13, fontWeight: 'bold', }}> Level : </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#DC7633', fontSize: 13, fontWeight: 'bold', }}> {Approval_level} </Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <View style={{ width: '40%' }}>
                    <Text style={{ color: '#05375a', fontSize: 13, fontWeight: 'bold', }}> Employee ID : </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#05375a', fontSize: 13, fontWeight: 'bold', }}> {Approval_emp_id} </Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <View style={{ width: '40%' }}>
                    <Text style={{ color: '#99A3A4', fontSize: 13, fontWeight: 'bold', }}> Approval Date : </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#99A3A4', fontSize: 13, fontWeight: 'bold', }}> {sync_date} </Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <View style={{ width: '40%' }}>
                    <Text style={{ color: '#99A3A4', fontSize: 13, fontWeight: 'bold', }}> Approval Limit : </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#99A3A4', fontSize: 13, fontWeight: 'bold', }}> {Approval_limit} </Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <View style={{ width: '40%' }}>
                    <Text style={{ color: '#99A3A4', fontSize: 13, fontWeight: 'bold', }}> Status : </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#99A3A4', fontSize: 13, fontWeight: 'bold', }}> Disapproval </Text>
                  </View>
                </View>

                {/* Asset Description */}
                <View style={styles.view_style}>
                  <TextInput
                    value={Approval_Remake}
                    style={[ styles.input, { height: Math.max( Platform.OS === 'ios' ? 150 : 150, height, ), }, ]}
                    multiline={true}
                    onContentSizeChange={event => setHeight(event.nativeEvent.contentSize.height) }
                    inputStyle={styles.inputStyle}
                    labelStyle={styles.labelStyle}
                    placeholderStyle={styles.placeholderStyle}
                    textErrorStyle={styles.textErrorStyle}
                    label="Remark"
                    placeholderTextColor="gray"
                    clearButtonMode="always"
                    focusColor="#808080"
                    onChangeText={text => { setApproval_Remake(text); }}
                  />
                </View>
              </View>

              <TouchableOpacity style={{ width: '100%', height: 50, alignItems: 'center', justifyContent: 'center', backgroundColor: 'green', marginTop: 10, }}
                onPress={() => get_disapprove()}>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}> SAVE </Text>
              </TouchableOpacity>
            </View>
          </View>
        </DismissKeyboard>
      </Modal>

      {/*  reject*/}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modal_reject}
        onRequestClose={() => {
         //Alert.alert('Closed');
          setmodal_reject(!modal_reject);
        }}>
        <DismissKeyboard>
          <View style={styles.model_cardview}>
            <View style={{ margin: 20, backgroundColor: '#FFFFFF' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0096FF', height: 50, }}>
                <Text style={{ fontSize: 15, alignContent: 'center', color: '#ffffffff', marginLeft: 5, fontWeight: 'bold', }}> Reject</Text>
                <Ionicons
                  name="close"
                  color="#ffffffff"
                  size={25}
                  style={{ marginEnd: 15 }}
                  onPress={() => setmodal_reject(!modal_reject)}
                />
              </View>

              <View style={{ flexDirection: 'column', margin: 15 }}>
                
                <View style={styles.view_style}>
                  <TextInput
                    value={Approval_Remake}
                    style={[ styles.input, { height: Math.max( Platform.OS === 'ios' ? 150 : 150, height)}]}
                    multiline={true}
                    onContentSizeChange={event => setHeight(event.nativeEvent.contentSize.height) }
                    inputStyle={styles.inputStyle}
                    labelStyle={styles.labelStyle}
                    placeholderStyle={styles.placeholderStyle}
                    textErrorStyle={styles.textErrorStyle}
                    label="Remark"
                    placeholderTextColor="gray"
                    clearButtonMode="always"
                    focusColor="#808080"
                    onChangeText={text => { setApproval_Remake(text) }}
                  />
                </View>
              </View>

              <TouchableOpacity style={{ width: '100%', height: 50, alignItems: 'center', justifyContent: 'center', backgroundColor: 'green', marginTop: 10, }}
                onPress={() => get_reject()}>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}> SAVE </Text>
              </TouchableOpacity>
            </View>
          </View>
        </DismissKeyboard>
      </Modal>

      {/*ZOOM Attachment */}
      <Modal
          animationType="slide"
          transparent={true}
          visible={ZoomAttachments_modalVisible}
          onRequestClose={() => {
           //Alert.alert('Closed');
            setZoomAttachments_modalVisible(!ZoomAttachments_modalVisible);
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
                  onSwipeDown={() => setZoomAttachments_modalVisible(!ZoomAttachments_modalVisible)}
                  onClick={()=> setZoomAttachments_modalVisible(!ZoomAttachments_modalVisible)}
                  enableSwipeDown={true}/>

                ||


                Type_link === 'video' &&  
                
                <View style={{flex: 1}}>

                  <Appbar.Header style={{backgroundColor: '#000'}}>
                      <View style={{ flex: 1,alignItems:'flex-end'}}>
                        
                           <AntDesign style={{marginRight:20}} color="#fff" name={'close'} size={25} onPress={() =>setZoomAttachments_modalVisible(!ZoomAttachments_modalVisible) } />
                         
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
                      <AntDesign style={{marginRight:20}} color="#fff" name={'close'} size={25} 
                      onPress={() => setZoomAttachments_modalVisible(!ZoomAttachments_modalVisible) } />
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

      <View style={{ flex: 1, marginBottom: 80 }}>
        <FlatList
          ListHeaderComponent={
            <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'column'}}>
              <View style={styles.card_01}>

                <View style={{ margin: 10 }}>

                  <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <View style={{ width: '50%' }}>
                      <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Purchase Request No : </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text placeholder="Test" style={{ justifyContent: 'flex-start', color: '#000' }}> {PurchaseRequestNo} </Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', marginTop: 5 }}>
                    <View style={{ width: '50%' }}>
                      <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> PR Status : </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text placeholder="Test" style={{ justifyContent: 'flex-start', color: '#000' }}> {PRStatus} </Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', marginTop: 5 }}>
                    <View style={{ width: '50%' }}>
                      <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Requester Date: </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text placeholder="Test" style={{ justifyContent: 'flex-start', color: '#000' }}> {Requester_Date} </Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', marginTop: 5 }}>
                    <View style={{ width: '50%' }}>
                      <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Required Date : </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text placeholder="Test" style={{ justifyContent: 'flex-start', color: '#000' }}> {Required_Date} </Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', marginTop: 5 }}>
                    <View style={{ width: '50%' }}>
                      <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Requester By : </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text placeholder="Test" style={{ justifyContent: 'flex-start', color: '#000' }}> {Requester_by} </Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', marginTop: 5 }}>
                    <View style={{ width: '50%' }}>
                      <Text placeholder="Test" style={{ color: '#FF5733', fontWeight: 'bold', justifyContent: 'flex-start', }}> Entered By : </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text placeholder="Test" style={{ justifyContent: 'flex-start', color: '#FF5733', }}> {Entered_by} </Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', marginTop: 5 }}>
                    <View style={{ width: '50%' }}>
                      <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Cost Center : </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text placeholder="Test" style={{ justifyContent: 'flex-start', color: '#000' }}> {Cost_Center} </Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', marginTop: 5 }}>
                    <View style={{ width: '50%' }}>
                      <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Account : </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text placeholder="Test" style={{ justifyContent: 'flex-start', color: '#000' }}> {Account} </Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', marginTop: 5 }}>
                    <View style={{ width: '50%' }}>
                      <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Mr Approval Status : </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text placeholder="Test" style={{ justifyContent: 'flex-start', color: '#000' }}> {MRApproval_Status} </Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', marginTop: 5 }}>
                    <View style={{ width: '50%' }}>
                      <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Mr Approval Process : </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text placeholder="Test" style={{ justifyContent: 'flex-start', color: '#000' }}> {MRApproval_Process} </Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', marginTop: 5 }}>
                    <View style={{ width: '50%' }}>
                      <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> Total cost : </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text placeholder="Test" style={{ justifyContent: 'flex-start', color: '#000' }}> {Total_cost} </Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', marginTop: 5 }}>
                    <View style={{ width: '50%' }}>
                      <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start', }}> PR Note : </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text placeholder="Test" style={{ justifyContent: 'flex-start', color: '#000' }}> {PR_Note} </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.card_01}>

               
                  {/* <View style={{ flexDirection: 'row',padding: 15, backgroundColor: '#fff', marginLeft: 10, marginRight: 10, marginTop: 5, marginBottom: 5, borderRadius: 10, }}>
                    <View style={{ width: '10%' }}>
                      <FontAwesome5 name="file-pdf"  color={'#05375a'} size={25}  />
                    </View>
                    <View style={{ flex: 1,justifyContent: 'center', alignItems: 'center', }}>
                      <Text style={{fontSize: 15,  color: '#000',}}> {'View PDF'} </Text>
                    </View>
                  </View> */}

                  <View style={{ padding: 15, backgroundColor: '#fff', marginLeft: 10, marginRight: 10, marginTop: 5, marginBottom: 5, borderRadius: 10, }}>

                  <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start',fontSize:15,marginBottom: 5,}} >Total Attachments: {Attachments_List.length} </Text>

                  <FlatList
                      data={Attachments_List}
                      keyExtractor={(item, index) => index.toString()}
                      horizontal
                      ItemSeparatorComponent={Attachments_onItem}
                      renderItem={Attachments_ItemView}
                    />
                  </View>
               

              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#0096FF', }}>
                <Text style={{ fontSize: 15, color: '#ffffffff', margin: 5 }}> PR LINE </Text>
                <Text style={{ fontSize: 15, color: '#ffffffff', margin: 5 }}> Total PR Line: {TotalPRLineNo} </Text>
              </View>
            </View>
          }
          numColumns={1}
          data={PRList}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeparatorView}
          renderItem={ItemView}
        />
      </View>

      <View style={styles.bottomView}>
        <TouchableOpacity style={{ flex: 1, width: '50%', height: 60, backgroundColor: 'green', alignItems: 'center', justifyContent: 'center'}}
          onPress={() => get_approval_button('Approve')}>
          <Text style={{ color: 'white', fontSize: 16 }}>Approve</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ flex: 1, width: '50%', height: 60, marginLeft: 5, marginRight: 5, backgroundColor: '#F4D03F', alignItems: 'center', justifyContent: 'center'}} 
          onPress={() => get_approval_button('Disapprove')}>
          <Text style={{ color: 'white', fontSize: 16 }}>Disapprove</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ flex: 1, width: '50%', height: 60, backgroundColor: 'red', alignItems: 'center', justifyContent: 'center'}} 
          onPress={() => get_approval_button('Reject')}>
          <Text style={{ color: 'white', fontSize: 16 }}>Reject</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaProvider>
  );
};

export default PRApprovalDetails;

const {width} = Dimensions.get('window');
const IMAGE_WIDTH = (width - 50) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0e0eb',
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

  item: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 10,
  },

  model_cardview: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  text_input_desc: {
    maxHeight: 100,
    marginTop: 5,
    color: '#000',
    borderColor: '#808080',
    borderRadius: 5,
    borderWidth: 1,
  },

  view_style: {
    marginTop: 15,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 50,
  },

  input: {
    height: 50,
    paddingHorizontal: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#808080',
  },

  inputStyle: { fontSize: 15 },

  labelStyle: {
    fontSize: 14,
    position: 'absolute',
    top: -10,
    backgroundColor: 'white',
    paddingHorizontal: 4,
    marginLeft: -4,
    color: '#0096FF',
  },

  placeholderStyle: { fontSize: 15, color: '#0096FF' },

  textErrorStyle: { fontSize: 15 },
});
