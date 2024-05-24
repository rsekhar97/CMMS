import React from "react";
import {  View,StyleSheet, Text, Dimensions,Pressable,FlatList,TouchableOpacity,Image,Modal} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressLoader from 'rn-progress-loader';
import { Appbar } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import moment from 'moment';
import {TextInput} from 'react-native-element-textinput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from "axios";
import DeviceInfo from 'react-native-device-info'
import ImagePickerModal from "react-native-image-picker-modal";
import { openDatabase } from 'react-native-sqlite-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {SCLAlert, SCLAlertButton} from 'react-native-scl-alert';
import Att_Modal from 'react-native-modal';
import ImageZoom from 'react-native-image-pan-zoom';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Image as CPImage} from 'react-native-compressor';
var db = openDatabase({ name: 'CMMS.db' });

let Baseurl,Site_cd,LoginID,EmpName,EmpID,EmpPhone,EmpWorkGrp,dvc_id,WIFI,local_id;

const StockMasterDetails = ({navigation,route}) => {


    const _goBack = () => {


        if(route.params.Screenname === 'StockMaster'){
            navigation.navigate('StockMaster',{Screenname:route.params.Screenname})
        }else if(route.params.Screenname === 'InventoryDashboard' || route.params.Screenname === 'WoDashboard')
        {
            navigation.navigate('StockMaster',{Screenname:route.params.Screenname})
        }

        
          
        
    }

    const[spinner, setspinner]= React.useState(false);
    const [Stock_no,setStock_no] = React.useState("");
    const [Master_loc,setMaster_loc] = React.useState("");
    const [costcenter,setcostcenter] = React.useState("");
    const [Commoditycode,setCommoditycode] = React.useState("");
    const [stockgroup,setstockgroup] = React.useState("");
    const [issueprice,setissueprice] = React.useState("");
    const [totalOH,settotalOH] = React.useState("");
    const [RowID,setRowID] = React.useState("");

    const [Description,setDescription] = React.useState("");
    const [Desc_height, setDesc_height] = React.useState(0);
    const [Ex_Description,setEx_Description] = React.useState("");
    const [Ex_Desc_height, setEx_Desc_height] = React.useState(0);
    const [Part_no,setPart_no] = React.useState("");
    const [partno_height, setpartno_height] = React.useState(0);

    const [issue_uom,setissue_uom] = React.useState("");
    const [receive_uom,setreceive_uom] = React.useState("");
    const [Min_point,setMin_point] = React.useState("");
    const [Maximum,setMaximum] = React.useState("");

    const [isVisible, setVisible] = React.useState(false);
    const [Attachments_List,setAttachments_List] = React.useState([]);
    const [images_list, setimages_list] = React.useState([]);

    const [Editable, setEditable] = React.useState(false);
    const [SubmitButton, setSubmitButton] = React.useState("");
    const [SubmitButtonColor, setSubmitButtonColor] = React.useState("#0096FF");

    const [Type_link, setType_link] = React.useState();
    const [link, setlink] = React.useState([]);
    const [images_link, setimages_link] = React.useState([]);
    const [linkindex, setlinkindex] = React.useState(0);

    //Alert
    const [Show, setShow] = React.useState(false);
    const [Show_two, setShow_two] = React.useState(false);
    const [Theme, setTheme] = React.useState('');
    const [Title, setTitle] = React.useState('');
    const [Type, setType] = React.useState('');
    const [ImgValue, setImgValue] = React.useState([]);
   
    const [modalVisible, setmodalVisible] = React.useState(false);

    const [MoreList, setMoreList] = React.useState();
    const [isMoreVisible, setMoreVisible] = React.useState(false);



    React.useEffect(() => {

        const focusHander = navigation.addListener('focus', ()=>{
  
            fetchData()
            console.log(route.params.Selected_Stock_no)
  
        });
        return focusHander;
  
      
    },[navigation]);  


    const fetchData = async ()=>{ 

        dvc_id = DeviceInfo.getDeviceId();

        Baseurl = await AsyncStorage.getItem('BaseURL');
        Site_cd = await AsyncStorage.getItem('Site_Cd');
        LoginID = await AsyncStorage.getItem('emp_mst_login_id');
        EmpName = await AsyncStorage.getItem('emp_mst_name');
        EmpID = await AsyncStorage.getItem('emp_mst_empl_id');
        EmpPhone = await AsyncStorage.getItem('emp_mst_homephone');
        EmpWorkGrp = await AsyncStorage.getItem('emp_det_work_grp');

        setSubmitButton("Edit");

        setEditable(true);

        setMoreList([ {Image: 'edit', Name: 'STOCK LOCATION'}]);

        get_inventory_by_params();
    }

    
    const get_inventory_by_params =(async()=>{

        setspinner(true);
         let select_stockno = route.params.Selected_Stock_no;
        try{

            console.log('URL',`${Baseurl}/get_inventory_by_params.php?itm_mst_stockno=${select_stockno}&status=ACT&site_cd=${Site_cd}`)

            const response = await axios.post(`${Baseurl}/get_inventory_by_params.php?itm_mst_stockno=${select_stockno}&status=ACT&site_cd=${Site_cd}`);
            console.log("JSON DATA : " + response.data.data)
            if (response.data.status === 'SUCCESS') {

                let mst_RowID; 

                for (let i = 0; i < response.data.data.itm.length; ++i){   

                    mst_RowID = response.data.data.itm[i].itm_mst_rowid;

                    setRowID(response.data.data.itm[i].itm_mst_rowid)
                    setStock_no(response.data.data.itm[i].itm_mst_stockno)
                    setMaster_loc(response.data.data.itm[i].itm_mst_mstr_locn)
                    setcostcenter(response.data.data.itm[i].itm_mst_costcenter)
                    setCommoditycode(response.data.data.itm[i].itm_mst_com_code)
                    setstockgroup(response.data.data.itm[i].itm_mst_itm_grp)
                    setissueprice(parseFloat(response.data.data.itm[i].itm_mst_issue_price).toFixed(2))
                    settotalOH(parseFloat(response.data.data.itm[i].itm_det_ttl_oh).toFixed(2))

                    setDescription(response.data.data.itm[i].itm_mst_desc)

                    setEx_Description(response.data.data.itm[i].itm_mst_ext_desc)
                    setPart_no(response.data.data.itm[i].itm_mst_partno)

                    setissue_uom(response.data.data.itm[i].itm_det_issue_uom)
                    setreceive_uom(response.data.data.itm[i].itm_det_rcv_uom)
                    setMin_point(parseFloat(response.data.data.itm[i].itm_det_order_pt).toFixed(2))
                    setMaximum(parseFloat(response.data.data.itm[i].itm_det_maximum).toFixed(2))
                   
                }   

                get_attachment(mst_RowID);
    
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

    //GET ASSET ATTACHMENT API
    const get_attachment = async (mst_RowID) => {

        let dvc_id = DeviceInfo.getDeviceId();
        const SPLIT_URL = Baseurl.split('/');
        const SPLIT_URL1 = SPLIT_URL[SPLIT_URL.length - 2];
        const SPLIT_URL2 = SPLIT_URL[SPLIT_URL.length - 1];
        const SPLIT_URL3 = SPLIT_URL1+'/'+SPLIT_URL2
        console.log('URL' + SPLIT_URL3);

        try {

        console.log( 'JSON DATA : ' + `${Baseurl}/get_inventory_location_attachment_by_params.php?site_cd=${Site_cd}&rowid=${mst_RowID}&type=P&url=${Baseurl}&folder=${SPLIT_URL3}&dvc_id=${dvc_id}`, );
        const response = await axios.get( `${Baseurl}/get_inventory_location_attachment_by_params.php?site_cd=${Site_cd}&rowid=${mst_RowID}&type=P&url=${Baseurl}&folder=${SPLIT_URL3}&dvc_id=${dvc_id}`, );

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
                    //let type = value.column2;
                    //console.log('PATH' + JSON.stringify(path));

                    let type
                    const lowerCaseFileName = value.file_name.toLowerCase();

                    if (lowerCaseFileName.endsWith('.jpg') || lowerCaseFileName.endsWith('.jpeg')) {

                    type = 'image/jpg'
                    images_list.unshift({ key, path, name, imagetype, type, localIdentifier, rowid});
                    setimages_list(images_list.slice(0));
                    // console.log('The file is a JPG image.');
                    } else if (lowerCaseFileName.endsWith('.mp4')) {
                    type = 'video/mp4'
                    //console.log('The file is a PNG image.');
                    } else if (lowerCaseFileName.endsWith('.pdf')) {
                    type = 'application/pdf'
                    //console.log('The file is not a JPG or PNG image.');
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
        alert(error);
        }
    };

    const Attachments_ItemView = ({ item }) => {

        // console.log("ITEM:"+JSON.stringify(item))
        const type = item.type.split('/');
        console.log('loop type',type[0]);
    
        return ( 
    
            <View style={{flex: 1,backgroundColor: '#fff', borderRadius: 10, margin: 10,alignItems: 'center'}}>

                <TouchableOpacity onPress={() => Attachment_show(item)}>

                {
                    type[0] === 'image' && <Image width={IMAGE_WIDTH} source={{uri: item.path}} style={{width: 160, height: 160, margin: 10}} /> 
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
    
    const Attachments_ItemSeparatorView = () => {
    return (
        // Flat List Item Separator
        <View
        style={{
        height: 1,
        marginLeft:5,
        marginRight:5,
        backgroundColor: '#C8C8C8',
        }}
    />
    );
    };

    const onDelete = value => {
        console.log(value);
    
        if (value.imagetype == 'New') {
          
    
          setAlert_two( true, 'delete', 'Do you want to delete this image?', 'DeleteNewImage', value);
        } else {
          
    
          setAlert_two( true, 'delete', 'Do you want to delete this image?', 'DeleteImage', value);
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
          console.log( 'Delete Image API : ' + `${Baseurl}/delete_inventory_location_file.php?site_cd=${Site_cd}&RowID=${value.rowid}`, );
          const response = await axios.get( `${Baseurl}/delete_inventory_location_file.php?site_cd=${Site_cd}&RowID=${value.rowid}`, );
    
          console.log('JSON DATA : ' + response.data.status);
    
          if (response.data.status === 'SUCCESS') {
            
    
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

    //Show
    const Attachment_show = item => {
        //console.log('show:', item);

        const type = item.type.split('/');
        //console.log('type',type[0]);
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
        //console.log('show KEY:', linkindex);

        //console.log('show:', JSON.stringify(link));
        setmodalVisible(!modalVisible);
    };


    //MORE BUTTON ONCLICK OPTIONS
    const get_more = () => {

        if (SubmitButton == 'Update') {
            setAlert( true, 'warning', 'You must update asset before you go into more options...', 'OK');
        } else {
            setMoreVisible(!isMoreVisible);
        }
    };

    const More_ItemView = ({item}) => {
        return (
        <TouchableOpacity onPress={() => getMore_Item(item)}>
            <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', margin: 10, borderRadius: 10, }}>
            <Feather
                name={item.Image}
                color={'#000'}
                size={25}
                onPress={() => setMoreVisible(false)}
            />

            <Text style={{ fontSize: 15, justifyContent: 'center', alignItems: 'center', color: '#000', marginTop: 5, }}> {item.Name} </Text>

            <Text style={{ fontSize: 15, justifyContent: 'center', alignItems: 'center', color: '#000'}}></Text>
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

        if (item.Name == 'STOCK LOCATION') {
            navigation.navigate('StockMasterLocation',{
                Screenname:route.params.Screenname,
                Selected_Stock_no:route.params.Selected_Stock_no
            })
        }else{
            console.log('else');
        } 
    };

    //BUTTON EDIT 
    const get_button =()=>{

        if(SubmitButton == "Edit"){

            setSubmitButton("Update");
            setSubmitButtonColor("#8BC34A");
            setEditable(false);

        }else if(SubmitButton == "Update"){
            get_validation();
        }

    };

    const get_validation = () => {
        setspinner(true);
        if (!Description) {
          setspinner(false);
          Valid = false;
          //alert('Please Select Asset Group Code');
          setAlert(true, 'warning', 'Please Enter Description', 'OK');
          return;
        } else {
        //   if (!Ex_Description) {
        //     setspinner(false);
        //     Valid = false;
        //     //alert('Please Enter Asset Description');
        //     setAlert(true, 'warning', 'Please Enter Extended Description', 'OK');
        //     return;
        //   } else {
        //     if (!Part_no) {
        //       setspinner(false);
        //       Valid = false;
        //       //alert('Please Select Asset Type');
        //       setAlert(true, 'warning', 'Please Enter Part Number', 'OK','');
        //       return;
        //     } else {

                

              
        //     }
        //   }

            Valid = true;

            if (Valid) {
                Update_stockmaster();
            } else {
                setspinner(false);
            }
        }
    };

    //Update
    const Update_stockmaster =(async()=>{

        setspinner(true);
         let select_stockno = route.params.Selected_Stock_no;
        try{

            console.log('URL',`${Baseurl}/update_inventory_location.php?site_cd=${Site_cd}&partno=${Part_no}&ext_desc=${Ex_Description}&mst_desc=${Description}&EMPID=${LoginID}&RowID=${RowID}`);
            const response = await axios.post(`${Baseurl}/update_inventory_location.php?site_cd=${Site_cd}&partno=${Part_no}&ext_desc=${Ex_Description}&mst_desc=${Description}&EMPID=${LoginID}&RowID=${RowID}`);

            console.log("JSON DATA : " + response.data.data);

            if (response.data.status === 'SUCCESS') {

                if (Attachments_List.length > 0) {
                    Insert_image(RowID,response.data.message);
                }else{
                    setspinner(false);

                    setAlert(true, 'success', response.data.message, 'OK');
                }
    
            }else{
              setspinner(false);
              setAlert(true, 'danger', response.data.message, 'OK');
              return
            }
    
    
          }catch(error){
    
            setspinner(false);
            alert(error);
          } 
    })


    //INSERT ATTACHMENT API
  const Insert_image = async (ROW_ID, message) => {
    
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
        dvc_id: dvc_id,
      },
    };

    for (let i = 0; i < Attachments_List.length; i++) {
        if (Attachments_List[i].imagetype === 'New') {
          imagelist.push(Attachments_List[i]);
        }
    }

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
      });

      //formData.append('photo', {uri: Attachments_List[i].path,name: Attachments_List[i].name});
      // formData.append('Content-Type', 'image/png');
    }
    console.log('formData:' + JSON.stringify(formData));
    console.log(Baseurl);

    fetch(`${Baseurl}/insert_inventory_location_image_file.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData, // Your FormData object
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle the response data here
  
          // const endtime = Date.now();
          // const uploadtime = endtime - starttime;
          // console.log('starttime', starttime);
          // console.log('endtime', endtime);
          // console.log('uploadtime', uploadtime);
         
          // alert('uploadtime:', uploadtime);
          console.log('success', data.status);
          if (data.status === 'SUCCESS') {
            setspinner(false);
            setAlert(true, 'success', data.message, 'Update');
  
          }else{
  
            setspinner(false);
            setAlert(true, 'warning', data.message , 'OK');
          }
         
        })
        .catch((error) => {
          setspinner(false);
          alert('Error:', error)
          console.error('Error:', error);
        });

    // try {
    //   const xhr = new XMLHttpRequest();
    //   xhr.open('POST', `${Baseurl}/insert_inventory_location_image_file.php?`);
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

    //       if (json_obj.data.itm_ref.length > 0) {
    //         setspinner(false);
    //         // Alert.alert(json_obj.status, message , [
    //         //   {text: 'OK', onPress: () => navigation.navigate('MainTabScreen')},
    //         // ]);

    //         setAlert(true, 'success', message, 'Update');
    //       } else {
    //         setspinner(false);
    //         setAlert(true, 'success', message, 'Update');
    //       }
    //     } else {
    //       setspinner(false);
    //       alert(xhr.responseText);
    //       //setAlert(true, 'danger', xhr.responseText, 'OK');
    //       //console.log('error', xhr.responseText);
    //     }
    //   };
    // } catch (error) {
    //   setspinner(false);
    //   alert(error);
    // }
  };


    const setAlert = (show, theme, title, type) => {

        setShow(show);
        setTheme(theme);
        setTitle(title);
        setType(type);
    };

    const setAlert_two = (show, theme, title, type, value) => {

        setShow_two(show);
        setTheme(theme);
        setTitle(title);
        setType(type);
        setImgValue(value);
    };
    

    const One_Alret_onClick = D => {
        console.log('DD',D)

        if (D === 'OK') {
            setShow(false);
        }else if (D === 'Update') {
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

            setTimeout(() => {

                DeleteImage(ImgValue);
        
            }, 1000)

           
        }
  };


  const compress =async (uri,fileName,IMGtype,IMGSIZE) =>{

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
   
    

    
  }

  return (
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
                        <Text style={{fontSize:20, justifyContent:'center',textAlign:'center',color:'#fff',fontWeight: 'bold',marginLeft:15}}>Stock Master Details</Text> 
                    </View >
                </Pressable>
            </View>
        </Appbar.Header>

        <ProgressLoader visible={spinner} isModal={true} isHUD={true} hudColor={"#808080"} color={"#FFFFFF"} />

        <SCLAlert theme={Theme} show={Show} title={Title}>
          <SCLAlertButton theme={Theme} onPress={() => One_Alret_onClick(Type)}> OK </SCLAlertButton>
        </SCLAlert>

        <SCLAlert theme={Theme} show={Show_two} title={Title}>
          <SCLAlertButton theme={Theme} onPress={() => Alret_onClick(Type)}> Yes </SCLAlertButton>

          <SCLAlertButton theme="default" onPress={() => setShow_two(false)}> No </SCLAlertButton>
        </SCLAlert>

        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
           //Alert.alert('Closed');
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
                  onSwipeDown={() =>  setmodalVisible(!modalVisible) }
                  onClick={()=>  setmodalVisible(!modalVisible)}
                  enableSwipeDown={true}/>

                ||


                Type_link === 'video' &&  
                
                <View style={{flex: 1}}>

                  <Appbar.Header style={{backgroundColor: '#000'}}>
                      <View style={{ flex: 1,alignItems:'flex-end'}}>
                        
                           <AntDesign style={{marginRight:20}} color="#fff" name={'close'} size={25} onPress={() =>setmodalVisible(!modalVisible) } />
                         
                      </View>
                    </Appbar.Header>

                  <Video 
                        source={{uri: link}} 
                        
                        //ref={ref => (videoPlayer.current = ref)}
                     // the video file
                       
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
                </View  >
        </Modal>

       

        <View style={{  flex: 1, marginBottom: 80}}>

            <FlatList
                ListHeaderComponent={

                    <View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'column'}}>  
                
                        <View style={styles.card}>

                            <View style={styles.card_heard}>
                                <View style={{flexDirection:"row"}}>

                                    <View style={{width:'40%'}}>
                                        <Text placeholder="Test" style={{color:'#FFF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Stock No:</Text>
                                    </View>
                                    <View style={{flex:1}}>
                                        <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#FFF',fontWeight: 'bold'}} >{Stock_no}</Text>
                                    </View>

                                </View>                      
                            </View>

                            <View style={{flexDirection:"column"}}>

                                <View style={styles.view_01}>

                                    <View style={{width:'40%'}}>
                                        <Text placeholder="Test" style={styles.view_02} >Master Location :</Text>
                                    </View>
                                    <View style={{flex:1}}>
                                        <Text placeholder="Test" style={styles.view_03} >{Master_loc}</Text>
                                    </View>
                                    
                                </View>

                                <View style={styles.view_01}>

                                    <View style={{width:'40%'}}>
                                        <Text placeholder="Test" style={styles.view_02} >Cost Center :</Text>
                                    </View>
                                    <View style={{flex:1}}>
                                        <Text placeholder="Test" style={styles.view_03} >{costcenter}</Text>
                                    </View>
                                    
                                </View>

                                <View style={styles.view_01}>

                                    <View style={{width:'40%'}}>
                                        <Text placeholder="Test" style={styles.view_02} >Commodity Code :</Text>
                                    </View>
                                    <View style={{flex:1}}>
                                        <Text placeholder="Test" style={styles.view_03} >{Commoditycode}</Text>
                                    </View>
                                    
                                </View>

                                <View style={styles.view_01}>

                                    <View style={{width:'40%'}}>
                                        <Text placeholder="Test" style={styles.view_02} >Stock Group :</Text>
                                    </View>
                                    <View style={{flex:1}}>
                                        <Text placeholder="Test" style={styles.view_03} >{stockgroup}</Text>
                                    </View>
                                    
                                </View>

                                <View style={styles.view_01}>

                                    <View style={{width:'40%'}}>
                                        <Text placeholder="Test" style={[styles.view_02 ,{color:'#FF5733'}]} >Issue Price :</Text>
                                    </View>
                                    <View style={{flex:1}}>
                                        <Text placeholder="Test" style={[styles.view_03,{color:'#0096FF'}]} >{issueprice}</Text>
                                    </View>
                                    
                                </View>

                                <View style={styles.view_01}>

                                    <View style={{width:'40%'}}>
                                        <Text placeholder="Test" style={[styles.view_02,{color:'#FF5733'}]} >Total OH :</Text>
                                    </View>
                                    <View style={{flex:1}}>
                                        <Text placeholder="Test" style={[styles.view_03,{color:'#0096FF'}]} >{totalOH}</Text>
                                    </View>
                                    
                                </View>

                                {/* Description */}
                                <View style={styles.view_style}>
                                    <TextInput
                                        value={Description}
                                        style={[ styles.input, { height: Math.max( Platform.OS === 'ios' ? 50 : 50, Desc_height)}]}
                                        multiline
                                        inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}]}
                                        labelStyle={styles.labelStyle}
                                        placeholderStyle={{fontSize: 15, color: '#0096FF'}}
                                        onContentSizeChange={event => setDesc_height(event.nativeEvent.contentSize.height)}
                                        label="Description"
                                        placeholderTextColor="gray"
                                        clearButtonMode="always"
                                        editable={!Editable}
                                        selectTextOnFocus={!Editable}
                                        onChangeText={text => { setDescription(text) }}
                                        renderRightIcon={() =>
                                            Editable ? (
                                            ''
                                        ) : (
                                            <AntDesign
                                            style={styles.icon}
                                            name={Description ? 'close' : ''}
                                            size={20}
                                            disable={true}
                                            onPress={() =>
                                                Description ? setDescription('') : ''
                                            }
                                            />
                                        )
                                        }
                                    />
                                </View>

                                {/* Extended Description */}
                                <View style={styles.view_style}>
                                    <TextInput
                                        value={Ex_Description}
                                        style={[ styles.input, { height: Math.max( Platform.OS === 'ios' ? 50 : 50, Ex_Desc_height)}]}
                                        multiline
                                        inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}]}
                                        labelStyle={styles.labelStyle}
                                        placeholderStyle={{fontSize: 15, color: '#0096FF'}}
                                        onContentSizeChange={event => setEx_Desc_height(event.nativeEvent.contentSize.height)}
                                        label="Extended Description"
                                        placeholderTextColor="gray"
                                        clearButtonMode="always"
                                        editable={!Editable}
                                        selectTextOnFocus={!Editable}
                                        onChangeText={text => { setEx_Description(text) }}
                                        renderRightIcon={() =>
                                            Editable ? (
                                            ''
                                        ) : (
                                            <AntDesign
                                            style={styles.icon}
                                            name={Ex_Description ? 'close' : ''}
                                            size={20}
                                            disable={true}
                                            onPress={() =>
                                                Ex_Description ? setEx_Description('') : ''
                                            }
                                            />
                                        )
                                        }
                                    />
                                </View>

                                {/* Extended Description */}
                                <View style={[styles.view_style,{marginBottom:10}]}>
                                    <TextInput
                                        value={Part_no}
                                        style={[ styles.input, { height: Math.max( Platform.OS === 'ios' ? 50 : 50, partno_height)}]}
                                        multiline
                                        inputStyle={[ styles.inputStyle, {color: Editable ? '#808080' : '#000'}]}
                                        labelStyle={styles.labelStyle}
                                        placeholderStyle={{fontSize: 15, color: '#0096FF'}}
                                        onContentSizeChange={event => setpartno_height(event.nativeEvent.contentSize.height)}
                                        label="Part No"
                                        placeholderTextColor="gray"
                                        clearButtonMode="always"
                                        editable={!Editable}
                                        selectTextOnFocus={!Editable}
                                        onChangeText={text => { setPart_no(text) }}
                                        renderRightIcon={() =>
                                            Editable ? (
                                            ''
                                        ) : (
                                            <AntDesign
                                            style={styles.icon}
                                            name={Part_no ? 'close' : ''}
                                            size={20}
                                            disable={true}
                                            onPress={() =>
                                                Part_no ? setPart_no('') : ''
                                            }
                                            />
                                        )
                                        }
                                    />
                                </View>
                                
                            </View>

                         </View>

                         <View style={styles.card}>

                            <View style={styles.card_heard}>
                                <View style={{flexDirection:"row"}}>

                                    <View style={{flex:1}}>
                                        <Text placeholder="Test" style={{color:'#FFF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Stock Details</Text>
                                    </View>
                                   

                                </View>                      
                            </View>

                            <View style={{flexDirection:"column"}}>

                                <View style={{flexDirection:"row",marginTop:5,marginLeft:10,marginRight:10}}>

                                    <View style={{width:'40%'}}>
                                        <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Issue UOM :</Text>
                                    </View>
                                    <View style={{flex:1}}>
                                        <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#808080',fontWeight: 'bold'}} >{issue_uom}</Text>
                                    </View>
                                    
                                </View>

                                <View style={{flexDirection:"row",marginTop:5,marginLeft:10,marginRight:10}}>

                                    <View style={{width:'40%'}}>
                                        <Text placeholder="Test" style={{color:'#2962FF',fontWeight: 'bold',justifyContent: 'flex-start'}} >Receive UOM :</Text>
                                    </View>
                                    <View style={{flex:1}}>
                                        <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#808080',fontWeight: 'bold'}} >{receive_uom}</Text>
                                    </View>
                                    
                                </View>

                                <View style={{flexDirection:"row",marginTop:5,marginLeft:10,marginRight:10}}>

                                    <View style={{width:'40%'}}>
                                        <Text placeholder="Test" style={{color:'#FF5733',fontWeight: 'bold',justifyContent: 'flex-start'}} >Min Point :</Text>
                                    </View>
                                    <View style={{flex:1}}>
                                        <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#0096FF',fontWeight: 'bold'}} >{Min_point}</Text>
                                    </View>
                                    
                                </View>

                                <View style={{flexDirection:"row",marginTop:5,marginLeft:10,marginRight:10,marginBottom:10}}>

                                    <View style={{width:'40%'}}>
                                        <Text placeholder="Test" style={{color:'#FF5733',fontWeight: 'bold',justifyContent: 'flex-start'}} >Maximum :</Text>
                                    </View>
                                    <View style={{flex:1}}>
                                        <Text placeholder="Test" style={{justifyContent: 'flex-start',color:'#0096FF',fontWeight: 'bold'}} >{Maximum}</Text>
                                    </View>
                                    
                                </View>

                              

                                
                                
                            </View>

                         </View>

                        <View style={styles.card}>

                            <View style={styles.card_heard}>
                                <Text style={styles.card_heard_text}>Attachments</Text>                         
                            </View>
                            <View style={[ styles.view_style, { display: !Editable ? 'flex' : 'none', flexDirection: 'row'}]}>

                                <TouchableOpacity style={{flex: 1.5, marginTop:10, justifyContent: 'center', alignItems: 'center'}} 
                                    onPress={()=>setVisible(!isVisible)}
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



                            </View>
                            

                            <ImagePickerModal
                                title="You can either take a picture or select one from your album."
                                data={["Take a photo", "Select from the library"]}
                                isVisible={isVisible}
                                onCancelPress={() => {
                                setVisible(false);
                                }}
                                onBackdropPress={() => {
                                setVisible(false);
                                }}
                                onPress={(item) => {
                                    console.log(item)
                                    setVisible(false)
                                    for(let value of Object.values(item.assets)){
                                        console.log("Valeu", value.uri)
                                        compress(value.uri,value.fileName,value.type,value.fileSize)
                                        // let key = Attachments_List.length + 1;
                                        // let localIdentifier = key;
                                        // let path = value.uri;
                                        // let name = value.fileName;
                                        // let type = value.type;
                                        // let rowid = '';
                                        // let imagetype  = 'New';
                                        // Attachments_List.unshift({key,path,name,type,imagetype,localIdentifier,rowid})
                                        // setAttachments_List(Attachments_List.slice(0));
                                        // key++;
                        
                                    }
                                }}
                            />

                            {/* More Opstion XML */}
                            <View style={styles.centeredView}>
                            <Att_Modal
                                style={styles.bottomModalView}
                                isVisible={isMoreVisible}
                                backdropOpacity={0}>
                                <View style={styles.modal2}>

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15, margin: 5, }}>

                                        <Text style={{ fontSize: 15, justifyContent: 'center', alignItems: 'center', color: '#000', }}></Text>

                                        <Ionicons name="close" color={'#000'} size={25} onPress={() => setMoreVisible(false)} />
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
                        
                        </View>
                    </View>
                    
                }

                numColumns={2}
                data={Attachments_List}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={Attachments_ItemSeparatorView}
                renderItem={Attachments_ItemView}            
            
            />
        
        </View>
       

        <View style={ styles.bottomView} >
            <TouchableOpacity
                style={{ width: '65%', height: 80, backgroundColor: SubmitButtonColor, marginRight: 5, alignItems: 'center', justifyContent: 'center'}} 
                onPress={get_button}>
                <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', marginBottom: 15}}>
                    <AntDesign color={'#FFFF'} name={'Safety'} size={25} />
                    <Text style={{ color: 'white', fontSize: 16, marginLeft: 8, fontWeight: 'bold', }}> {SubmitButton.toUpperCase()} </Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={{ width: '45%', height: 80, backgroundColor: '#0096FF', alignItems: 'center', justifyContent: 'center', }}
                onPress={get_more}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15, marginRight: 20}}>
                    <AntDesign color={'#FFFF'} name={'ellipsis1'} size={26} />
                    <Text style={{ color: 'white', fontSize: 16, marginLeft: 8, marginRight: 5, fontWeight: 'bold', }}> {'more'.toUpperCase()} </Text>
                </View>
            </TouchableOpacity>
        </View>  

    </SafeAreaProvider>
  )
}

export default StockMasterDetails

const { width } = Dimensions.get('window');

const IMAGE_WIDTH = (width - 20)/3;

const styles = StyleSheet.create({

    container: { 

        flex: 1
    },
   card: {

        backgroundColor: '#FFFFFF',
        margin:10,
        borderRadius: 10,      
    },
    card_heard:{

        alignItems:'center', 
        padding:10,
        backgroundColor:'#0096FF',
        borderTopRightRadius:10,
        borderTopLeftRadius:10
    },
    card_heard_text:{

        fontSize:15, 
        justifyContent:'center',
        color:'#ffffffff'
    },

    bottomView:{

        flex: 1,
        flexDirection: 'row',
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
    },
    view_style:{

        marginBottom:10,
        marginLeft:10,
        marginRight:10,
        marginTop:10
    },
    text_footer: {
        color: '#2962FF',
        fontSize: 14,
        marginLeft:5
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

    view_01:{

        flexDirection:"row",
        marginTop:5

    },
    view_02:{

        color:'#2962FF',
        fontWeight: 'bold',
        justifyContent: 'flex-start',
        marginLeft:10,
        marginRight:10,
        fontSize:13

    },
    view_03:{

        color:'#808080',
        justifyContent: 'flex-start',
        fontSize:13,
        fontWeight: 'bold',

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
    model_cardview: {

        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)',
    },
    
    modal2: {
        width: '100%',
        height: '40%',
        borderRadius: 10,
        borderWidth: 2,
        borderStyle: 'solid',
        backgroundColor: '#e7e7e7',
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
  });