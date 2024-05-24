import { View, Text, TouchableWithoutFeedback, StyleSheet, Pressable, KeyboardAvoidingView, Alert, Keyboard, BackHandler, } from 'react-native';
import React from 'react';
import {GiftedChat, Actions} from 'react-native-gifted-chat';
import initialMessages from '../Utils/messages';
import { renderInputToolbar, renderComposer, renderSend, } from '../Utils/InputToolbar';
import { renderAvatar, renderBubble, renderSystemMessage, renderMessage, renderMessageText, renderCustomView, renderVideoMessage} from '../Utils/MessageContainer';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import ProgressLoader from 'rn-progress-loader';
import axios from 'axios';
import {Appbar} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import ImagePickerModal from 'react-native-image-picker-modal';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DeviceInfo from 'react-native-device-info';
import {SCLAlert, SCLAlertButton} from 'react-native-scl-alert';
import { Image as CPImage} from 'react-native-compressor';
let Baseurl, Site_cd, LoginID, EmpName, EmpID, EmpPhone, EmpWorkGrp, dvc_id, OrgPriority, dft_mst_wko_asset_no, WIFI;

const DismissKeyboard = ({children}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const Chat = ({route, navigation}) => {

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
      } else if (route.params.Screenname == 'WoDashboard' || route.params.Screenname == 'MYWO_Dashboard_Due' || route.params.Screenname == 'MYWO_Dashboard_Past') {
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

  const [spinner, setspinner] = React.useState(false);
  const [Toolbartext, setToolbartext] = React.useState('Comments');

  const [text, setText] = React.useState('');

  const [messages, setMessages] = React.useState([]);

  //Attachement Modal
  const [isVisible, setVisible] = React.useState(false);
  const [ZoomAttachments_modalVisible, setZoomAttachments_modalVisible] = React.useState(false);
  const [images, setImages] = React.useState([]);
  const [Attachments_List, setAttachments_List] = React.useState([]);
  const [images_link, setimages_link] = React.useState([]);

  //Alert
  const [Show, setShow] = React.useState(false);
  const [Show_two, setShow_two] = React.useState(false);
  const [Theme, setTheme] = React.useState('');
  const [Title, setTitle] = React.useState('');
  const [AlertType, setAlertType] = React.useState('');
  const [AlertData, setAlertData] = React.useState('');

  const backAction = () => {
    // Alert.alert("Alert", "Do you want to exit comments screen?", [
    //   {
    //     text: "NO",
    //     onPress: () => null,
        
    //   },
    //   { text: "YES", onPress: () => _goBack() }
    // ]);

    setAlert( true, 'warning', 'Do you want to exit Comments screen?', 'OK');
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
    WIFI = await AsyncStorage.getItem('WIFI');
    console.log('WORK DATA:  ' + WIFI);

    console.log('SCREE NAME:  ' + route.params.Screenname);

    console.log('WorkOrder_no:', route.params.Selected_WorkOrder_no);
    console.log('mst_RowID:', route.params.RowID);
    console.log('ASSETNO:', route.params.Selected_AssetNo);
    console.log('CostCenter:', route.params.Selected_CostCenter);
    console.log('LaborAccount:', route.params.Selected_LaborAccount);
    console.log('ContractAccount:', route.params.Selected_ContractAccount);
    console.log('MaterialAccount:', route.params.Selected_MaterialAccount);

    get_chart();
  };


  // setTimeout(() => {

  //   get_chart(); 

  // }, 5000)

  const get_chart = async () => {
    

    const SPLIT_URL = Baseurl.split('/'); 
    const SPLIT_URL1 = SPLIT_URL[SPLIT_URL.length - 2];
    const SPLIT_URL2 = SPLIT_URL[SPLIT_URL.length - 1];
    const SPLIT_URL3 = SPLIT_URL1+'/'+SPLIT_URL2
    console.log('URL'+SPLIT_URL3);

    try {

      console.log('URL'+`${Baseurl}/get_chart.php?site_cd=${Site_cd}&mst_RowID=${route.params.RowID}&url=${Baseurl}&folder=${SPLIT_URL3}&dvc_id=${dvc_id}`);
      const response = await axios.post( `${Baseurl}/get_chart.php?site_cd=${Site_cd}&mst_RowID=${route.params.RowID}&url=${Baseurl}&folder=${SPLIT_URL3}&dvc_id=${dvc_id}`);
      console.log('chat Response : ' + response.data.status);
      if (response.data.status === 'SUCCESS') {

        setMessages([]);

        console.log('chat Response : ' + messages.lenght);

        for (let i = 0; i < response.data.data.length; ++i) {
          let wko_ls11_name = response.data.data[i].wko_ls11_name;
          let wko_ls11_sts_upd = response.data.data[i].wko_ls11_sts_upd;
          let audit_user = response.data.data[i].audit_user;
          let audit_date = response.data.data[i].audit_date.date;
          let chatID = response.data.data[i].chatID;

          let url  = response.data.data[i].full_size_link;

          setMessages(previousMessages =>
            GiftedChat.append(previousMessages, {
              _id: chatID,
              text: wko_ls11_sts_upd,
              createdAt: audit_date,
              imgae: '',

              user: {
                _id: audit_user,
                name: wko_ls11_name,
              },
              image: url,
              sent: true,
              received: true,
            }),
          );
        }

        //console.log('Message',chat);
        setspinner(false);
      }
    } catch (error) {
      setspinner(false);
      alert(error);
    }
  };

  const onSend = React.useCallback((messages = []) => {
    console.log('send Message', messages);

    var chat = messages.map(item => ({
      _id: item._id,
      text: item.text,
      createdAt: item.createdAt,

      user: {
        _id: EmpID,
        name: EmpName,
      },
    }));

    setMessages(previousMessages => GiftedChat.append(previousMessages, chat));
    send(messages);
  }, []);

  const send = async messages => {
    //[{"_id": "1b65a983-5624-4d1d-a9b3-578f22fe9048", "createdAt": 2023-05-15T07:41:56.980Z, "text": "Hi", "user": {"_id": 1}}]
    //602354
    //9,12,15,18,21,24,27,30,33,36,39
    setspinner(true);

    var chat = messages.map(item => ({
      site_cd: Site_cd,
      mst_RowID: route.params.RowID,
      wko_ls11_name: EmpName,
      wko_ls11_sts_upd: item.text,
      audit_user: EmpID,
      chatID: item._id,
    }));

    //setMessages(previousMessages => GiftedChat.append(previousMessages, messages));

    var timecard = {
      Header: chat,
    };

    console.log('chat Message', timecard);

    try {
      const response = await axios.post( `${Baseurl}/insert_chart.php?`, JSON.stringify(timecard), );
      console.log('insert chat Response : ' + response.data.status);
      if (response.data.status === 'SUCCESS') {
        //get_chart()
        setspinner(false);
      }
    } catch (error) {
      setspinner(false);
      alert(error);
    }
  };

  const image = item => {
    console.log(item);
    setVisible(false);
    

    // let dvc_id = DeviceInfo.getDeviceId();
    // const SPLIT_URL = Baseurl.split('/');
    // const SPLIT_URL1 = SPLIT_URL[SPLIT_URL.length - 2];
    // const SPLIT_URL2 = SPLIT_URL[SPLIT_URL.length - 1];
    // const SPLIT_URL3 = SPLIT_URL1+'/'+SPLIT_URL2
    // console.log('URL' + SPLIT_URL3);

    // var sync_date = moment().format('YYYY-MM-DD HH:mm');

   
    // let data = {
    //   data: {
    //     rowid: route.params.RowID,
    //     site_cd: Site_cd,
    //     EMPID: EmpID,
    //     EmpName: EmpName,
    //     LOGINID: LoginID,
    //     folder: SPLIT_URL3,
    //     dvc_id: dvc_id,
       
    //   },
    // };

    // console.log('URL' + item.assets.length);

    // var chat
    // let k = 0;
    // const formData = new FormData();
    // formData.append('count', item.assets.length);
    // formData.append('json', JSON.stringify(data));

    // for (let i = 0; i < item.assets.length; ++i) {
    //   k++;
    //     formData.append('file_'+[k], {uri: item.assets[i].uri,name: item.assets[i].fileName,type: 'image/jpeg'});
    // }

    // chat = item.assets.map((item ,index)=> ({
    //   _id: Math.floor(Math.random() * 100),
    //   text: '',
    //   createdAt: sync_date,

    //   user: {
    //     _id: EmpID,
    //     name: EmpName,
    //   },
    //   image: item.uri,
    //   sent: true,
    //   received: true,
    // }));

    
    // console.log('Valeu', chat);
   
    // setMessages(previousMessages => GiftedChat.append(previousMessages, chat));
    // Insert_image(formData);
  };

  const compress =async (item) =>{

    setVisible(false);
    let dvc_id = DeviceInfo.getDeviceId();
    const SPLIT_URL = Baseurl.split('/');
    const SPLIT_URL1 = SPLIT_URL[SPLIT_URL.length - 2];
    const SPLIT_URL2 = SPLIT_URL[SPLIT_URL.length - 1];
    const SPLIT_URL3 = SPLIT_URL1+'/'+SPLIT_URL2
    console.log('URL' + SPLIT_URL3);

    var sync_date = moment().format('YYYY-MM-DD HH:mm');

   
    let data = {
      data: {
        rowid: route.params.RowID,
        site_cd: Site_cd,
        EMPID: EmpID,
        EmpName: EmpName,
        LOGINID: LoginID,
        folder: SPLIT_URL3,
        dvc_id: dvc_id,
       
      },
    };

    console.log('URL' + item.assets.length);

    var chat
    let k = 0;
    const formData = new FormData();
    formData.append('count', item.assets.length);
    formData.append('json', JSON.stringify(data));
    let result ="";
    for (let i = 0; i < item.assets.length; ++i) {

       result = await CPImage.compress(item.assets[i].uri);
      k++;
      formData.append('file_'+[k], {uri: result,name: item.assets[i].fileName,type: 'image/jpeg'});

    }

    chat = item.assets.map((item ,index)=> ({

      
      _id: Math.floor(Math.random() * 100),
      text: '',
      createdAt: sync_date,

      user: {
        _id: EmpID,
        name: EmpName,
      },
      image: result,
      sent: true,
      received: true,
    }));

    
    console.log('Valeu', chat);
   
    setMessages(previousMessages => GiftedChat.append(previousMessages, chat));
    Insert_image(formData);

  }
  //INSERT WORK ORDER ATTACHMENT FILE API
  const Insert_image = async (formData) => {
    setspinner(true);
    console.log('Image List : ',JSON.stringify(formData));

    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${Baseurl}/insert_chart_image_file.php?`);
      xhr.setRequestHeader('Content-Type', 'multipart/form-data');
      xhr.send(formData);
      console.log('success', xhr.responseText);
      xhr.onreadystatechange = e => {
        if (xhr.readyState !== 4) {
          return;
        }

        if (xhr.status === 200) {
          console.log('success', xhr.responseText);
          var json_obj = JSON.parse(xhr.responseText);
          console.log('success', json_obj.data);
          setspinner(false);
        } else {
          setspinner(false);
          alert(xhr.responseText);
          //console.log('error', xhr.responseText);
        }
      };
    } catch (error) {
      setspinner(false);
      alert(error);
    }
  };

  const renderActions = () => {
    return (
      <Ionicons
        name="camera"
        color={'#FFF'}
        size={30}
        style={{margin: 10, alignContent: 'center'}}
        onPress={() => setVisible(!isVisible)}
      />
    );
  };

  const setAlert = (show, theme, title, type) => {
    setShow(show);
    setTheme(theme);
    setTitle(title);
    setAlertType(type);
  };

  const One_Alret_onClick = D => {
    if (D === 'OK') {
      setShow(false);

      _goBack()
    } 
  };

  return (
    <DismissKeyboard>
      <SafeAreaProvider>
        <Appbar.Header style={{backgroundColor: '#42A5F5'}}>
          <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'center', }}>
            <Pressable onPress={_goBack}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <FontAwesome name="angle-left" color="#fff" size={55} style={{marginLeft: 15, marginBottom: 5}} />
                <Text style={{ fontSize: 20, justifyContent: 'center', textAlign: 'center', color: '#fff', fontWeight: 'bold', marginLeft: 15, }}> {Toolbartext} </Text>
              </View>
            </Pressable>

            <FontAwesome name="refresh" color="#fff" size={25} onPress={() => get_chart()} style={{marginRight: 15, alignContent: 'center'}} />
          </View>
        </Appbar.Header>

        <ProgressLoader visible={spinner} isModal={true} isHUD={true} hudColor={'#808080'} color={'#FFFFFF'} />

        <SCLAlert theme={Theme} show={Show} title={Title}> 
          <SCLAlertButton theme={Theme} onPress={() => One_Alret_onClick(AlertType)}> OK </SCLAlertButton> 
        </SCLAlert>

        <ImagePickerModal 
          title="You can either take a picture or select one from your album." 
          data={['Take a photo', 'Select from the library']} 
          isVisible={isVisible} 
          onCancelPress={() => { setVisible(false); }} 
          onBackdropPress={() => { setVisible(false); }} 
          onPress={item => compress(item)}
        />

        <View style={{flex: 1}}>
          <GiftedChat
            messages={messages}
            onSend={onSend}
            onInputTextChanged={setText}
            user={{ _id: EmpID, name: EmpName }}
            //showUserAvatar
            bottomOffset={-26}
            //alwaysShowSend
            renderUsernameOnMessage
            renderAvatarOnTop
            showAvatarForEveryMessage
            scrollToBottom
            renderInputToolbar={renderInputToolbar}
            renderActions={renderActions}
            renderComposer={renderComposer}
            renderSend={renderSend}
            //renderAvatar={renderAvatar}
            renderBubble={renderBubble}
            // renderSystemMessage={renderSystemMessage}
            //renderMessage={renderMessage}
            renderMessageText={renderMessageText}
            renderMessageVideo={renderVideoMessage}
            //renderMessageImage
            // renderCustomView={renderCustomView}
            isCustomViewBottom
            //messagesContainerStyle={{ backgroundColor: 'indigo' }}
          />
        </View>

        {/* <GiftedChat
      messages={messages}
      text={text}
      onInputTextChanged={setText}
      onSend={onSend}
      user={{
        _id: 1,
        name: 'Aaron',
        avatar: 'https://placeimg.com/150/150/any',
      }}
      //alignTop
      alwaysShowSend
      scrollToBottom
      // showUserAvatar
    
      renderAvatarOnTop
      renderUsernameOnMessage
      bottomOffset={26}
      onPressAvatar={console.log}
      renderInputToolbar={renderInputToolbar}
      renderActions={renderActions}
      renderComposer={renderComposer}
      renderSend={renderSend}
      renderAvatar={renderAvatar}
      //renderBubble={renderBubble}
      //renderSystemMessage={renderSystemMessage}
      //renderMessage={renderMessage}
      //renderMessageText={renderMessageText}
      // renderMessageImage
      //renderCustomView={renderCustomView}
      //isCustomViewBottom
      //messagesContainerStyle={{ backgroundColor: 'indigo' }}
      
    />
  
            <KeyboardAvoidingView behavior={ Platform.OS === 'android' ? 'padding' :  null} keyboardVerticalOffset={80} />
        </SafeAreaProvider> */}
      </SafeAreaProvider>
    </DismissKeyboard>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
