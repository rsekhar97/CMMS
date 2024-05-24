import React from 'react';
import { View, StyleSheet, Text, Dimensions, FlatList, TouchableOpacity, Alert, Pressable, Modal, TouchableWithoutFeedback, Keyboard, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressLoader from 'rn-progress-loader';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Appbar} from 'react-native-paper';
import {openDatabase} from 'react-native-sqlite-storage';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {TextInput} from 'react-native-element-textinput';
var db = openDatabase({name: 'CMMS.db'});
let Baseurl, Site_cd, LoginID, EmpName, EmpID, EmpPhone, EmpWorkGrp, dvc_id;

import {SCLAlert, SCLAlertButton} from 'react-native-scl-alert';
const DismissKeyboard = ({children}) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
);

const MRAPprovalDetails = ({navigation, route}) => {
  const [spinner, setspinner] = React.useState(false);
  const [Toolbartext, setToolbartext] = React.useState( 'Material Request Approval', );
  const [height, setHeight] = React.useState(0);

  const _goBack = () => {
    if (route.params.Screenname === 'MRApproval') {
      navigation.navigate('MRApproval', {Screenname: route.params.Screenname});
    }
  };

  const [TotalMRLineNo, setTotalMRLineNo] = React.useState('');
  const [MaterialRequestNo, setMaterialRequestNo] = React.useState('');
  const [MRStatus, setMRStatus] = React.useState('');
  const [Requester, setRequester] = React.useState('');
  const [Origination_Date, setOrigination_Date] = React.useState('');
  const [Required_Date, setRequired_Date] = React.useState('');
  const [WorkOrder_No, setWorkOrder_No] = React.useState('');
  const [Asset_No, setAsset_No] = React.useState('');
  const [Cost_Center, setCost_Center] = React.useState('');
  const [Account, setAccount] = React.useState('');
  const [MRApproval_Status, setMRApproval_Status] = React.useState('');
  const [MRApproval_Process, setMRApproval_Process] = React.useState('');
  const [Total_cost, setTotal_cost] = React.useState('');

  const [MRList, setMRList] = React.useState([]);

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

    get_mr_approval_List_details(route.params.RowID);
  };

  //MR Approval List API
  const get_mr_approval_List_details = async RowID => {
    setspinner(true);

    try {
      console.log( 'JSON DATA : ' + `${Baseurl}/get_mr_approval_List_details.php?site_cd=${Site_cd}&RowID=${RowID}`, );

      const response = await axios.get( `${Baseurl}/get_mr_approval_List_details.php?site_cd=${Site_cd}&RowID=${RowID}`, );

      console.log(JSON.stringify(response));

      if (response.data.status === 'SUCCESS') {
        for (let i = 0; i < response.data.header.length; ++i) {
          let orgdate = moment( response.data.header[i].mtr_mst_org_date.date, ).format('yyyy-MM-DD HH:mm');
          let reqdate = moment( response.data.header[i].mtr_mst_req_date.date, ).format('yyyy-MM-DD HH:mm');

          setMaterialRequestNo(response.data.header[i].mtr_mst_mtr_no);
          setMRStatus(response.data.header[i].mtr_mst_mr_status);
          setRequester(
            response.data.header[i].mtr_mst_requester +
              ' : ' +
              response.data.header[i].requestername,
          );
          setOrigination_Date(orgdate);
          setRequired_Date(reqdate);
          setWorkOrder_No(response.data.header[i].mtr_mst_wo_no);
          setAsset_No(response.data.header[i].mtr_mst_assetno);
          setCost_Center(response.data.header[i].mtr_mst_costcenter);
          setAccount(response.data.header[i].mtr_mst_account);
          setMRApproval_Status(response.data.header[i].mtr_mst_status);
          setMRApproval_Process(response.data.header[i].Approval_Status);
          setTotal_cost(response.data.header[i].mtr_mst_tot_cost);
        }
        setTotalMRLineNo(response.data.line.length);
        setMRList(response.data.line);
        setspinner(false);
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

  const ItemView = ({item}) => {

     let total,req_qty,cost;

      if(item.TotalAvailable == '.0000'){
        total = '0'
      }else{
        total = item.TotalAvailable
      }
      if(item.mtr_ls1_req_qty == '.0000'){
        req_qty = '0'
      }else{
        req_qty = item.mtr_ls1_req_qty
      }

      if(item.mtr_ls1_item_cost == '.0000'){
        cost = '0'
      }else{
        cost = item.mtr_ls1_item_cost
      }

      let val_total = parseFloat(total).toFixed(2);
      let val_req_qty = parseFloat(req_qty).toFixed(2);
      let val_cost = parseFloat(cost).toFixed(2);

    return (
      
        <View style={styles.item}>
          <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', }}>
            <Text style={{ color: '#2962FF', fontSize: 13, fontWeight: 'bold', }}> {'MR LineNo: ' + item.mtr_ls1_mtr_lineno} </Text>
          </View>

          <View style={{ height: 0.5, width: '100%', backgroundColor: '#C8C8C8',margin: 5 }} />

          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{width: '45%'}}>
              <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start',fontSize: 13, }}> Stock No : </Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', fontSize: 13,color: '#000'}}> {item.mtr_ls1_stockno} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{width: '45%'}}>
              <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start',fontSize: 13, }}> Stock Loc : </Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', fontSize: 13,color: '#000'}}> {item.mtr_ls1_stk_locn} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{width: '45%'}}>
              <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start', fontSize: 13,}}> Description : </Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', fontSize: 13,color: '#000'}}> {item.mtr_ls1_desc} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{width: '45%'}}>
              <Text placeholder="Test" style={{ color: '#FF5733', fontWeight: 'bold', justifyContent: 'flex-start',fontSize: 13, }}> UOM : </Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', fontSize: 13,color: '#FF5733'}}> {item.mtr_ls1_mtl_uom} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View style={{width: '45%'}}>
              <Text placeholder="Test" style={{ color: '#3cFF00', fontWeight: 'bold', justifyContent: 'flex-start', fontSize: 13,}}> On Hand Quantity : </Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', fontSize: 13,color: '#3cFF00'}}> {val_total} </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 5}}>
            <View>
              <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', justifyContent: 'flex-start', fontSize: 13,}}> Request QTY : </Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', fontSize: 13,color: '#000'}}> {val_req_qty} </Text>
            </View>

            <View>
              <Text placeholder="Test" style={{ color: '#FF5733', fontWeight: 'bold', justifyContent: 'flex-start', fontSize: 13,}}> item Cost : </Text>
            </View>
            <View style={{flex: 1}}>
              <Text placeholder="Test" style={{justifyContent: 'flex-start', fontSize: 13,color: '#FF5733'}}> {val_cost} </Text>
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

    let Approve = {
      site_cd: Site_cd,
      loop: route.params.Closed_loop,
      type: route.params.Approval_type,
      EmpID: EmpID,
      LOGINID: LoginID,

      mst_costcenter: route.params.mst_costcenter,
      mtr_mst_mtr_no: route.params.mr_no,
      RowID: route.params.RowID,
    };

    console.log('Approve Request: ' + JSON.stringify(Approve));

    try {
      const response = await axios.post( `${Baseurl}/get_mr_approval_button.php?`, Approve, {headers: {'Content-Type': 'application/json'}}, );
      console.log('Insert asset response:' + JSON.stringify(response.data));

      if (response.data.status === 'SUCCESS') {
        setspinner(false);

       

        if(response.data.data.length >0 ){

          setApproval_level(response.data.data[0].mtr_app_level);
          setApproval_emp_id(response.data.data[0].mtr_app_empl_id);
          setApproval_limit(response.data.data[0].mtr_app_mr_limit);
          setApproval_RowId(response.data.data[0].RowID);
          setApproval_count('1');

        }else{
          setApproval_level(route.params.app_level + 1);
          setApproval_emp_id(EmpID);
          setApproval_limit(route.params.mr_limit);
          setApproval_RowId('');
          setApproval_count('0');
        }
     
        // if (response.data.message === 'No Record found') {
         
        // } else {
         
        // }

        if (status == 'Approve') {
          setmodal_approve(true);
        } else if (status == 'Disapprove') {
          setmodal_disapprove(true);
        } else if (status == 'Reject') {
          setmodal_reject(true);
        }
      } else {
        setspinner(false);
        Alert.alert(response.data.status, response.data.message, [ {text: 'OK'}]);
      }
    } catch (error) {
      setspinner(false);
      alert(error);
    }
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
      Mr_tot_cost: route.params.Mr_tot_cost,
      mtr_mst_mtr_no: route.params.mr_no,
      mst_costcenter: route.params.mst_costcenter,
      cur_app_level: route.params.cur_app_level,
      app_level: route.params.app_level,
    };

    console.log('approve : ' + JSON.stringify(disapprove));

    try {
      const response = await axios.post( `${Baseurl}/insert_mr_approval.php?`, disapprove,
       {headers: {'Content-Type': 'application/json'}}, );
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
          {text: 'OK'},
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
      Mr_tot_cost: route.params.Mr_tot_cost,
      mtr_mst_mtr_no: route.params.mr_no,
      mst_costcenter: route.params.mst_costcenter,
      cur_app_level: route.params.cur_app_level,
      app_level: route.params.app_level,
    };

    console.log('approve : ' + JSON.stringify(approve));

    try {
      const response = await axios.post( `${Baseurl}/insert_mr_disapproval.php?`, approve, 
      {headers: {'Content-Type': 'application/json'}}, );
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
          {text: 'OK'},
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
      const response = await axios.post( `${Baseurl}/insert_mr_reject.php?`, reject,
       {headers: {'Content-Type': 'application/json'}}, );
      console.log('Insert asset response:' + JSON.stringify(response.data));

      if (response.data.status === 'SUCCESS') {
        setspinner(false);
        setmodal_reject(false);
        // Alert.alert(response.data.status, response.data.message, [
        //   {text: 'OK', onPress: () => _goBack()},
        // ]);

        setAlert( true, 'success', response.data.message, 'OK');

      } else {
        setspinner(false);
        Alert.alert(response.data.status, response.data.message, [
          {text: 'OK'},
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
    <Appbar.Header style={{backgroundColor: '#42A5F5'}}>
        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', }}>
        <Pressable onPress={_goBack}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <FontAwesome
                name="angle-left"
                color="#fff"
                size={55}
                style={{marginLeft: 15, marginBottom: 5}}
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
                    <View style={{margin: 20, backgroundColor: '#FFFFFF'}}>
                        <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: '#0096FF',
                            height: 50,
                        }}>
                        <Text
                            style={{
                            fontSize: 15,
                            alignContent: 'center',
                            color: '#ffffffff',
                            marginLeft: 5,
                            fontWeight: 'bold',
                            }}>
                            Approval
                        </Text>
                        <Ionicons
                            name="close"
                            color="#ffffffff"
                            size={25}
                            style={{marginEnd: 15}}
                            onPress={() => setmodal_approve(!modal_approve)}
                        />
                        </View>

                        <View style={{flexDirection: 'column', margin: 15}}>
                        <View style={{flexDirection: 'row', marginTop: 10}}>
                            <View style={{width: '40%'}}>
                            <Text
                                style={{
                                color: '#DC7633',
                                fontSize: 13,
                                fontWeight: 'bold',
                                }}>
                                Level :
                            </Text>
                            </View>
                            <View style={{flex: 1}}>
                            <Text
                                style={{
                                color: '#DC7633',
                                fontSize: 13,
                                fontWeight: 'bold',
                                }}>
                                {Approval_level}
                            </Text>
                            </View>
                        </View>

                        <View style={{flexDirection: 'row', marginTop: 10}}>
                            <View style={{width: '40%'}}>
                            <Text
                                style={{
                                color: '#05375a',
                                fontSize: 13,
                                fontWeight: 'bold',
                                }}>
                                Employee ID :
                            </Text>
                            </View>
                            <View style={{flex: 1}}>
                            <Text
                                style={{
                                color: '#05375a',
                                fontSize: 13,
                                fontWeight: 'bold',
                                }}>
                                {Approval_emp_id}
                            </Text>
                            </View>
                        </View>

                        <View style={{flexDirection: 'row', marginTop: 10}}>
                            <View style={{width: '40%'}}>
                            <Text
                                style={{
                                color: '#99A3A4',
                                fontSize: 13,
                                fontWeight: 'bold',
                                }}>
                                Approval Date :
                            </Text>
                            </View>
                            <View style={{flex: 1}}>
                            <Text
                                style={{
                                color: '#99A3A4',
                                fontSize: 13,
                                fontWeight: 'bold',
                                }}>
                                {sync_date}
                            </Text>
                            </View>
                        </View>

                        <View style={{flexDirection: 'row', marginTop: 10}}>
                            <View style={{width: '40%'}}>
                            <Text
                                style={{
                                color: '#99A3A4',
                                fontSize: 13,
                                fontWeight: 'bold',
                                }}>
                                Approval Limit :
                            </Text>
                            </View>
                            <View style={{flex: 1}}>
                            <Text
                                style={{
                                color: '#99A3A4',
                                fontSize: 13,
                                fontWeight: 'bold',
                                }}>
                                {Approval_limit}
                            </Text>
                            </View>
                        </View>

                        <View style={{flexDirection: 'row', marginTop: 10}}>
                            <View style={{width: '40%'}}>
                            <Text
                                style={{
                                color: '#99A3A4',
                                fontSize: 13,
                                fontWeight: 'bold',
                                }}>
                                Status :
                            </Text>
                            </View>
                            <View style={{flex: 1}}>
                            <Text
                                style={{
                                color: '#99A3A4',
                                fontSize: 13,
                                fontWeight: 'bold',
                                }}>
                                Approve
                            </Text>
                            </View>
                        </View>

                        {/* Asset Description */}
                        <View style={styles.view_style}>
                            <TextInput
                            value={Approval_Remake}
                            style={[
                                styles.input,
                                {
                                height: Math.max(
                                    Platform.OS === 'ios' ? 150 : 150,
                                    height,
                                ),
                                },
                            ]}
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

                        <TouchableOpacity
                        style={{
                            width: '100%',
                            height: 50,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'green',
                            marginTop: 10,
                        }}
                        onPress={() => get_approve()}>
                        <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
                            SAVE
                        </Text>
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
                <View style={{margin: 20, backgroundColor: '#FFFFFF'}}>
                    <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: '#0096FF',
                        height: 50,
                    }}>
                    <Text
                        style={{
                        fontSize: 15,
                        alignContent: 'center',
                        color: '#ffffffff',
                        marginLeft: 5,
                        fontWeight: 'bold',
                        }}>
                        Disapproval
                    </Text>
                    <Ionicons
                        name="close"
                        color="#ffffffff"
                        size={25}
                        style={{marginEnd: 15}}
                        onPress={() => setmodal_disapprove(!modal_disapprove)}
                    />
                    </View>

                    <View style={{flexDirection: 'column', margin: 15}}>
                    <View style={{flexDirection: 'row', marginTop: 10}}>
                        <View style={{width: '40%'}}>
                        <Text
                            style={{
                            color: '#DC7633',
                            fontSize: 13,
                            fontWeight: 'bold',
                            }}>
                            Level :
                        </Text>
                        </View>
                        <View style={{flex: 1}}>
                        <Text
                            style={{
                            color: '#DC7633',
                            fontSize: 13,
                            fontWeight: 'bold',
                            }}>
                            {Approval_level}
                        </Text>
                        </View>
                    </View>

                    <View style={{flexDirection: 'row', marginTop: 10}}>
                        <View style={{width: '40%'}}>
                        <Text
                            style={{
                            color: '#05375a',
                            fontSize: 13,
                            fontWeight: 'bold',
                            }}>
                            Employee ID :
                        </Text>
                        </View>
                        <View style={{flex: 1}}>
                        <Text
                            style={{
                            color: '#05375a',
                            fontSize: 13,
                            fontWeight: 'bold',
                            }}>
                            {Approval_emp_id}
                        </Text>
                        </View>
                    </View>

                    <View style={{flexDirection: 'row', marginTop: 10}}>
                        <View style={{width: '40%'}}>
                        <Text
                            style={{
                            color: '#99A3A4',
                            fontSize: 13,
                            fontWeight: 'bold',
                            }}>
                            Approval Date :
                        </Text>
                        </View>
                        <View style={{flex: 1}}>
                        <Text
                            style={{
                            color: '#99A3A4',
                            fontSize: 13,
                            fontWeight: 'bold',
                            }}>
                            {sync_date}
                        </Text>
                        </View>
                    </View>

                    <View style={{flexDirection: 'row', marginTop: 10}}>
                        <View style={{width: '40%'}}>
                        <Text
                            style={{
                            color: '#99A3A4',
                            fontSize: 13,
                            fontWeight: 'bold',
                            }}>
                            Approval Limit :
                        </Text>
                        </View>
                        <View style={{flex: 1}}>
                        <Text
                            style={{
                            color: '#99A3A4',
                            fontSize: 13,
                            fontWeight: 'bold',
                            }}>
                            {Approval_limit}
                        </Text>
                        </View>
                    </View>

                    <View style={{flexDirection: 'row', marginTop: 10}}>
                        <View style={{width: '40%'}}>
                        <Text
                            style={{
                            color: '#99A3A4',
                            fontSize: 13,
                            fontWeight: 'bold',
                            }}>
                            Status :
                        </Text>
                        </View>
                        <View style={{flex: 1}}>
                        <Text
                            style={{
                            color: '#99A3A4',
                            fontSize: 13,
                            fontWeight: 'bold',
                            }}>
                            Disapproval
                        </Text>
                        </View>
                    </View>

                    {/* Asset Description */}
                    <View style={styles.view_style}>
                        <TextInput
                        value={Approval_Remake}
                        style={[
                            styles.input,
                            {
                            height: Math.max(
                                Platform.OS === 'ios' ? 150 : 150,
                                height,
                            ),
                            },
                        ]}
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

                    <TouchableOpacity
                    style={{
                        width: '100%',
                        height: 50,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'green',
                        marginTop: 10,
                    }}
                    onPress={() => get_disapprove()}>
                    <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
                        SAVE
                    </Text>
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
                <View style={{margin: 20, backgroundColor: '#FFFFFF'}}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0096FF', height: 50, }}>
                      <Text style={{ fontSize: 15, alignContent: 'center', color: '#ffffffff', marginLeft: 5, fontWeight: 'bold', }}> Reject </Text>
                      <Ionicons name="close" color="#ffffffff" size={25} style={{marginEnd: 15}} onPress={() => setmodal_reject(!modal_reject)} />
                    </View>

                    <View style={{flexDirection: 'column', margin: 15}}>
                    {/* Asset Description */}
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
                        onChangeText={text => { setApproval_Remake(text); }}
                        />
                    </View>
                    </View>

                    <TouchableOpacity style={{ width: '100%', height: 50, alignItems: 'center', justifyContent: 'center', backgroundColor: 'green', marginTop: 10, }}
                    onPress={() => get_reject()}>
                      <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}> SAVE </Text>
                    </TouchableOpacity>
                </View>
                </View>
            </DismissKeyboard>
    </Modal>

    <View style={{flex: 1, marginBottom: 80}}>
        <FlatList
        ListHeaderComponent={
            <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'column'}}> 
              <View style={styles.card_01}>
                <View style={{margin: 10}}>
                  <View style={{flexDirection: 'row', marginTop: 10}}>
                      <View style={{width: '45%'}}>
                        <Text placeholder="Test" style={{ color: '#2962FF', fontSize: 13,fontWeight: 'bold', justifyContent: 'flex-start', }}> Material Request No : </Text>
                      </View>
                      <View style={{flex: 1}}>
                        <Text placeholder="Test" style={{justifyContent: 'flex-start', fontSize: 13,color: '#000'}}> {MaterialRequestNo} </Text>
                      </View>
                  </View>

                  <View style={{flexDirection: 'row', marginTop: 5}}>
                      <View style={{width: '45%'}}>
                        <Text placeholder="Test" style={{ color: '#2962FF', fontSize: 13,fontWeight: 'bold', justifyContent: 'flex-start', }}> MR Status : </Text>
                      </View>
                      <View style={{flex: 1}}>
                        <Text placeholder="Test" style={{justifyContent: 'flex-start', fontSize: 13,color: '#000'}}> {MRStatus} </Text>
                      </View>
                  </View>

                  <View style={{flexDirection: 'row', marginTop: 5}}>
                      <View style={{width: '45%'}}>
                        <Text placeholder="Test" style={{ color: '#2962FF', fontSize: 13,fontWeight: 'bold', justifyContent: 'flex-start', }}> Requester : </Text>
                      </View>
                      <View style={{flex: 1}}>
                        <Text placeholder="Test" style={{justifyContent: 'flex-start', fontSize: 13,color: '#000'}}> {Requester} </Text>
                      </View>
                  </View>

                <View style={{flexDirection: 'row', marginTop: 5}}>
                    <View style={{width: '45%'}}>
                      <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', fontSize: 13,justifyContent: 'flex-start', }}> Orgination Date : </Text>
                    </View>
                    <View style={{flex: 1}}>
                      <Text placeholder="Test" style={{justifyContent: 'flex-start', fontSize: 13,color: '#000'}}> {Origination_Date} </Text>
                    </View>
                </View>

                <View style={{flexDirection: 'row', marginTop: 5}}>
                    <View style={{width: '45%'}}>
                      <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', fontSize: 13,justifyContent: 'flex-start', }}> Required Date : </Text>
                    </View>
                    <View style={{flex: 1}}>
                      <Text placeholder="Test" style={{justifyContent: 'flex-start', fontSize: 13,color: '#000'}}> {Required_Date} </Text>
                    </View>
                </View>

                <View style={{flexDirection: 'row', marginTop: 5}}>
                    <View style={{width: '45%'}}>
                      <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', fontSize: 13,justifyContent: 'flex-start', }}> Work Order No : </Text>
                    </View>
                    <View style={{flex: 1}}>
                      <Text placeholder="Test" style={{justifyContent: 'flex-start', fontSize: 13,color: '#000'}}> {WorkOrder_No} </Text>
                    </View>
                </View>

                <View style={{flexDirection: 'row', marginTop: 5}}>
                    <View style={{width: '45%'}}>
                      <Text placeholder="Test" style={{ color: '#FF5733', fontWeight: 'bold', fontSize: 13,justifyContent: 'flex-start', }}> Asset No : </Text>
                    </View>
                    <View style={{flex: 1}}>
                      <Text placeholder="Test" style={{ justifyContent: 'flex-start', fontSize: 13,color: '#FF5733', }}> {Asset_No} </Text>
                    </View>
                </View>

                <View style={{flexDirection: 'row', marginTop: 5}}>
                    <View style={{width: '45%'}}>
                      <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', fontSize: 13,justifyContent: 'flex-start', }}> Account : </Text>
                    </View>
                    <View style={{flex: 1}}>
                      <Text placeholder="Test" style={{justifyContent: 'flex-start', fontSize: 13,color: '#000'}}> {Account} </Text>
                    </View>
                </View>

                <View style={{flexDirection: 'row', marginTop: 5}}>
                    <View style={{width: '45%'}}>
                      <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', fontSize: 13,justifyContent: 'flex-start', }}> Mr Approval Status : </Text>
                    </View>
                    <View style={{flex: 1}}>
                      <Text placeholder="Test" style={{justifyContent: 'flex-start', fontSize: 13,color: '#000'}}> {MRApproval_Status} </Text>
                    </View>
                </View>

                <View style={{flexDirection: 'row', marginTop: 5}}>
                    <View style={{width: '45%'}}>
                      <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', fontSize: 13,justifyContent: 'flex-start', }}> Mr Approval Process : </Text>
                    </View>
                    <View style={{flex: 1}}>
                      <Text placeholder="Test" style={{justifyContent: 'flex-start', fontSize: 13,color: '#000'}}> {MRApproval_Process} </Text>
                    </View>
                </View>

                <View style={{flexDirection: 'row', marginTop: 5}}>
                    <View style={{width: '45%'}}>
                      <Text placeholder="Test" style={{ color: '#2962FF', fontWeight: 'bold', fontSize: 13,justifyContent: 'flex-start', }}> Total cost : </Text>
                    </View>
                    <View style={{flex: 1}}>
                      <Text placeholder="Test" style={{justifyContent: 'flex-start', fontSize: 13,color: '#000'}}> {Total_cost} </Text>
                    </View>
                </View>
                </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#0096FF'}}>
                <Text style={{fontSize: 15, color: '#ffffffff', margin: 5}}> MR LINE </Text>
                <Text style={{fontSize: 15, color: '#ffffffff', margin: 5}}> Total MR Line: {TotalMRLineNo} </Text>
            </View>
            </View>
        }
        numColumns={1}
        data={MRList}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={ItemSeparatorView}
        renderItem={ItemView}
        />
    </View>

    <View style={styles.bottomView}>
        <TouchableOpacity
        style={{
            flex: 1,
            width: '50%',
            height: 60,
            backgroundColor: 'green',
            alignItems: 'center',
            justifyContent: 'center',
        }}
        onPress={() => get_approval_button('Approve')}>
        <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
            APPROVE
        </Text>
        </TouchableOpacity>

        <TouchableOpacity
        style={{
            flex: 1,
            width: '50%',
            height: 60,
            marginLeft: 5,
            marginRight: 5,
            backgroundColor: '#F4D03F',
            alignItems: 'center',
            justifyContent: 'center',
        }}
        onPress={() => get_approval_button('Disapprove')}>
        <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
            DISAPPROVE
        </Text>
        </TouchableOpacity>

        <TouchableOpacity
        style={{
            flex: 1,
            width: '50%',
            height: 60,
            backgroundColor: 'red',
            alignItems: 'center',
            justifyContent: 'center',
        }}
        onPress={() => get_approval_button('Reject')}>
        <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
            REJECT
        </Text>
        </TouchableOpacity>
    </View>
    </SafeAreaProvider>
   
  );
};

export default MRAPprovalDetails;

const {width} = Dimensions.get('window');

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
});
