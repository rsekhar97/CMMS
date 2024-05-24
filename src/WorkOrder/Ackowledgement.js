import React from 'react'
import {  View,Pressable,StyleSheet, Text ,ScrollView,TouchableOpacity,Alert,Modal,Image,BackHandler,TouchableWithoutFeedback, Keyboard, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import axios from "axios";
import { Appbar } from 'react-native-paper';
import { openDatabase } from 'react-native-sqlite-storage';
import DeviceInfo from 'react-native-device-info'
import {TextInput} from 'react-native-element-textinput';
import { Rating } from 'react-native-ratings';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Signature from "react-native-signature-canvas";
import Permissions from 'react-native-permissions';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';



var db = openDatabase({ name: 'CMMS.db' });
let Baseurl,Site_cd,LoginID,EmpName,EmpID,EmpPhone,EmpWorkGrp,dvc_id,mst_RowID,WIFI,Local_ID;

const DismissKeyboard = ({children}) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);

function Ackowledgement({route,navigation}) {

    const[spinner, setspinner]= React.useState(false);
    const[Toolbartext, setToolbartext]= React.useState("Acknowledgement");
    const [Editable, setEditable] = React.useState(true);
    const [height, setHeight] = React.useState(0);

    const[question_one,setquestion_one]= React.useState('');
    const[rating1,setrating1]= React.useState('0');
    const[question_two,setquestion_two]= React.useState('');
    const[rating2,setrating2]= React.useState('0');
    const[question_three,setquestion_three]= React.useState('');
    const[rating3,setrating3]= React.useState('0');
    
    const[name,setname]= React.useState('');
    const[staffId,setstaffId]= React.useState('');
    const[Phone_no,setPhone_no]= React.useState('');

    const [SingVisible, setSingVisible ] = React.useState(false); 
    const [signature, setSignature] = React.useState(null);
    const [Attachments_List,setAttachments_List] = React.useState([]);

    //Alert
  const [Show, setShow] = React.useState(false);
  const [Show_two, setShow_two] = React.useState(false);
  const [Theme, setTheme] = React.useState('');
  const [Title, setTitle] = React.useState('');
  const [AlertType, setAlertType] = React.useState('');
  const [ImgValue, setImgValue] = React.useState([]);

    var Valid= false;   

    const _goBack = () => {

        if (route.params.Screenname == 'FilteringWorkOrder') {
            navigation.navigate('CreateWorkOrder',{
    
              Selected_WorkOrder_no:route.params.Selected_WorkOrder_no,
              RowID:route.params.RowID,
             
              Screenname:route.params.Screenname,
    
    
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
        }else  if (route.params.Screenname == 'MyWorkOrder') {
            navigation.navigate('CreateWorkOrder',{
    
                Selected_WorkOrder_no:route.params.Selected_WorkOrder_no,
                RowID:route.params.RowID,
    
                local_id:route.params.local_id,
                Selected_wko_mst_ast_cod:route.params.Selected_wko_mst_ast_cod,
                Selected_wko_mst_type:route.params.Selected_wko_mst_type,
                Screenname:route.params.Screenname,
    
            });
        } else if (route.params.Screenname == 'WoDashboard'  || route.params.Screenname == 'MYWO_Dashboard_Due' || route.params.Screenname == 'MYWO_Dashboard_Past') {
            navigation.navigate('CreateWorkOrder',{
    
                Selected_WorkOrder_no:route.params.Selected_WorkOrder_no,
                RowID:route.params.RowID,
    
                local_id:route.params.local_id,
                Selected_wko_mst_ast_cod:route.params.Selected_wko_mst_ast_cod,
                Selected_wko_mst_type:route.params.Selected_wko_mst_type,
    
                Screenname:route.params.Screenname,
                type:route.params.type,
    
            });
        }else if (route.params.Screenname == 'ScanAssetMaster') {
    
            if(route.params.ScanAssetType =='New'){
    
                navigation.navigate('CreateWorkOrder',{
    
    
                    Screenname:route.params.Screenname,
                    ScanAssetType:route.params.ScanAssetType,
                    ScanAssetRowID:route.params.ScanAssetRowID,
                    ScanAssetno:route.params.ScanAssetno,
        
                });
    
            }else if(route.params.ScanAssetType =='Edit'){
    
                navigation.navigate('CreateWorkOrder',{
    
                    Selected_WorkOrder_no:route.params.Selected_WorkOrder_no,
                    RowID:route.params.RowID,
    
                    Screenname:route.params.Screenname,
                    ScanAssetType:route.params.ScanAssetType,
                    ScanAssetno:route.params.ScanAssetno,
                    ScanAssetRowID:route.params.ScanAssetRowID
        
                });
    
            }
            
        }else if(route.params.Screenname == "AssetListing"){    
            navigation.navigate('CreateWorkOrder',{
    
                Selected_WorkOrder_no:route.params.Selected_WorkOrder_no,
                RowID:route.params.RowID,
    
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
    
        } 
    
        
    }
   
    const backAction = () => {
    
        setAlert_two(true,'warning','Do you want to exit ackowledgement screen?','BACK');
        return true;
    };

    React.useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', backAction);
    
        return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
      }, []);

    React.useEffect(() => {            

        const focusHander = navigation.addListener('focus', ()=>{

            fetchData();

        });
        return focusHander;
       
    },[navigation]);




    const fetchData = async ()=>{ 
    
        console.log(route.params)
        console.log(route.params.RowID)

        dvc_id = DeviceInfo.getDeviceId();

        Baseurl = await AsyncStorage.getItem('BaseURL');
        Site_cd = await AsyncStorage.getItem('Site_Cd');
        LoginID = await AsyncStorage.getItem('emp_mst_login_id');
        EmpName = await AsyncStorage.getItem('emp_mst_name');
        EmpID = await AsyncStorage.getItem('emp_mst_empl_id');
        EmpPhone = await AsyncStorage.getItem('emp_mst_homephone');
        EmpWorkGrp = await AsyncStorage.getItem('emp_det_work_grp');
        WIFI = await AsyncStorage.getItem('WIFI');
        console.log("WORK DATA:  "+ WIFI);

        mst_RowID =route.params.RowID;
        Local_ID =route.params.local_id;

        console.log("WORK DATA MST_ROWID :  "+ mst_RowID);
        console.log("WORK DATA LOCAL ID :  "+ Local_ID);
        
      
        if(WIFI === 'OFFLINE'){

            get_acknowledgement_OFFLINE();
          //get_workorder_listing();  
  
        }else{
  
            get_acknowledgement_ONLINE();
  
        }

     
      
        
    }

    ratingcompleted_one=(rating)=>{

        setrating1(rating.toString())
 
    }
 
    ratingcompleted_two=(rating)=>{

        setrating2(rating.toString())

    }

    ratingcompleted_three=(rating)=>{

        setrating3(rating.toString())

    }

    //GET ACKNOW LEDGEMENT OFFLINE API
    const get_acknowledgement_OFFLINE=(async()=>{

        setspinner(true);

        db.transaction(function(txn){
  
        
            //GET OFFLINE WORK ORDER
            txn.executeSql( 'SELECT  * FROM ratingquestion',
            [],
            (tx, results) => {

                var temp = [];

                //console.log("get:"+JSON.stringify(results));

                for (let i = 0; i < results.rows.length; ++i){   

                temp.push(results.rows.item(i));

                if(results.rows.item(i).default_label == 'Rating 1:'){

                    setquestion_one(results.rows.item(i).customize_label)

                }else if(results.rows.item(i).default_label == 'Rating 2:'){

                    setquestion_two(results.rows.item(i).customize_label)
                    
                }else if(results.rows.item(i).default_label == 'Rating 3:'){

                    setquestion_three(results.rows.item(i).customize_label)
                    
                }
                                    
                }  
                
            }
            );



            if(mst_RowID ==  null){

                console.log("EMPTY",Local_ID)
                //GET OFFLINE WORK ORDER
                txn.executeSql(
                    'select  * from wko_det_ackowledgement where local_id = ?',
                    [Local_ID],
                    (tx, results) => {
        
                       
                        console.log("get empty:"+JSON.stringify(results.rows.length));
                        for (let i = 0; i < results.rows.length; ++i){   
        
                            let rate1 = results.rows.item(i).wko_det_rating1;
                            setrating1(Number(rate1).toFixed(2))
                            

                            let rate2 = results.rows.item(i).wko_det_rating2;
                            setrating2(Number(rate2).toFixed(2))

                            let rate3 = results.rows.item(i).wko_det_rating3;
                            setrating3(Number(rate3).toFixed(2))

                            setname(results.rows.item(i).wko_det_ack_name)
                            setPhone_no(results.rows.item(i).wko_det_ack_contact)
                            setstaffId(results.rows.item(i).wko_det_ack_id)
                                                
                        }  
                    
                    }
                );

                get_offline_ackowledgement_img()
                

            }else {


                console.log("NOT EMPTY")
                //GET OFFLINE WORK ORDER

                txn.executeSql(
                    'SELECT  * FROM wko_det_ackowledgement where mst_RowID = ?',
                    [mst_RowID],
                    (tx, results) => {
        
                        
                        console.log("get:"+JSON.stringify(results));
                        for (let i = 0; i < results.rows.length; ++i){   
        
                            
                            let rate1 = results.rows.item(i).wko_det_rating1;
                            setrating1(Number(rate1).toFixed(2))
                            

                            let rate2 = results.rows.item(i).wko_det_rating2;
                            setrating2(Number(rate2).toFixed(2))

                            let rate3 = results.rows.item(i).wko_det_rating3;
                            setrating3(Number(rate3).toFixed(2))

                            setname(results.rows.item(i).wko_det_ack_name)
                            setPhone_no(results.rows.item(i).wko_det_ack_contact)
                            setstaffId(results.rows.item(i).wko_det_ack_id)                    
                        }  
                        
                    }
                );

                get_offline_ackowledgement_img()

                

            }

          
    
        });

    })

    //GET OFFLIME IMAGS
    const get_offline_ackowledgement_img =(async()=>{

        if(!mst_RowID){

            db.transaction(function(txn){

                txn.executeSql(
                    'select  * from wko_ref where local_id = ? and column2=?',
                    [Local_ID,'SIGN'],
                    (tx, results) => {
                        
                        for (let i = 0; i < results.rows.length; ++i){   

                            console.log("PATH 123"+ JSON.stringify(results.rows.item(i)));

                            if(results.rows.item(i).Exist === 'New'){

                                path = results.rows.item(i).attachment;
          
                              }else{
          
          
                                if(results.rows.item(i).ref_type === 'Gallery_image'){
            
                                  path = results.rows.item(i).Local_link;
                                }else{
                                  path = 'file://'+results.rows.item(i).Local_link;
                                }
          
                              }

                              setSignature(path);
          
                                                
                        }  

                        setspinner(false);
                    
                    }
                );

                setspinner(false);

            })

        }else{

           

            db.transaction(function(txn){
                
                txn.executeSql('select  * from wko_ref where mst_RowID =? and column2 =?',
                    [mst_RowID,'SIGN'],
                    (txn, results) => {

                        console.log("PATH 123"+ JSON.stringify(results));
                        for (let i = 0; i < results.rows.length; ++i){   

                            if(results.rows.item(i).Exist === 'New'){

                                path = results.rows.item(i).attachment;
          
                              }else{
          
          
                                if(results.rows.item(i).ref_type === 'Gallery_image'){
            
                                  path = results.rows.item(i).Local_link;
                                }else{
                                  path = 'file://'+results.rows.item(i).Local_link;
                                }
          
                              }
          
                              setSignature(path);
        
                            
                                                
                        }  

                        setspinner(false);
                    
                    }
                );

                setspinner(false);
                
            })

        }

    })

    //GET ACKNOW LEDGEMENT  QUESTION ONLINE API
    const get_acknowledgement_ONLINE=(async()=>{

        setspinner(true);
        try{
                

            console.log("JSON DATA : " + `${Baseurl}/get_acknowledgement.php?site_cd=${(Site_cd)}`)

            const response = await axios.get(`${Baseurl}/get_acknowledgement.php?site_cd=${(Site_cd)}`);

            console.log(JSON.stringify(response));

            console.log("JSON DATA : " + response.data.data)

            if (response.data.status === 'SUCCESS') 
            {
                for(let value of Object.values(response.data.data)){

                   console.log(value.column_name);

                   switch(value.column_name){

                    case'wko_det_rating1':
                    setquestion_one(value.customize_label)
                    break

                    case'wko_det_rating2':
                    setquestion_two(value.customize_label)
                    break

                    case'wko_det_rating3':
                    setquestion_three(value.customize_label)
                    break

                   }
                   
                }

                get_acknowledgement_list_ONLINE();
               

            
            }else{
                setspinner(false);
                setAlert(true,'warning',response.data.message,'OK');
                return
            }

        }catch(error){

            setspinner(false);
            alert(error);
        }  


    })


    //GET ACKNOW LEDGEMENT LIST ONLINE API
    const get_acknowledgement_list_ONLINE=(async()=>{

        setspinner(true);
        try{
                

            console.log("JSON DATA : " + `${Baseurl}/get_acknowledgement_list.php?site_cd=${(Site_cd)}&mst_RowID=${(mst_RowID)}`)

            const response = await axios.get(`${Baseurl}/get_acknowledgement_list.php?site_cd=${(Site_cd)}&mst_RowID=${(mst_RowID)}`);

            //console.log(JSON.stringify(response));

            console.log("JSON DATA : " + response.data.data.length)

            if (response.data.status === 'SUCCESS') 
            {
                for (let i = 0; i < response.data.data.length; ++i){   

                    setrating1(response.data.data[i].wko_det_rating1)
                    setrating2(response.data.data[i].wko_det_rating2)
                    setrating3(response.data.data[i].wko_det_rating3)
                    setname(response.data.data[i].wko_det_ack_name)
                    setstaffId(response.data.data[i].wko_det_ack_id)
                    setPhone_no(response.data.data[i].wko_det_ack_contact)
                                    
                } 

                get_action_workorder_attachment_by_params();
               
                //setspinner(false);
            
            }else{
                setspinner(false);
                setAlert(true,'warning',response.data.message,'OK');
                return
            }

        }catch(error){

            setspinner(false);
            alert(error);
        }  


    })


     // GET WORK ORDER SING_ATTACHMENT FILE API
     const get_action_workorder_attachment_by_params =(async()=>{

        const SPLIT_URL = Baseurl.split('/'); 
        const SPLIT_URL1 = SPLIT_URL[SPLIT_URL.length - 2];
        const SPLIT_URL2 = SPLIT_URL[SPLIT_URL.length - 1];
        const SPLIT_URL3 = SPLIT_URL1+'/'+SPLIT_URL2
        console.log('URL'+SPLIT_URL3);

        try{

            console.log("JSON DATA : " + `${Baseurl}/get_action_workorder_attachment_by_params.php?site_cd=${(Site_cd)}&rowid=${mst_RowID}&url=${(Baseurl)}&folder=${(SPLIT_URL3)}&dvc_id=${(dvc_id)}`)
            const response = await axios.get(`${Baseurl}/get_action_workorder_attachment_by_params.php?site_cd=${(Site_cd)}&rowid=${mst_RowID}&url=${(Baseurl)}&folder=${(SPLIT_URL3)}&dvc_id=${(dvc_id)}`);

             console.log("JSON DATA : " + response.data.status)
  
             console.log("JSON DATA : " + Attachments_List.length)
  
            if (response.data.status === 'SUCCESS') 
            {
                
                if(response.data.data.length>0){
                    
                    let signpath ;
                    for(let value of Object.values(response.data.data)){
                       
                         signpath = value.full_size_link ; 
                    }

                    console.log("JSON DATA : " + signpath+'?' + new Date())

                    setSignature(signpath+'?' + new Date());

                }else{
                    setspinner(false);
                
                }
                
                setspinner(false);
                
            
            }else{
                setspinner(false);
                setAlert(true,'warning',response.data.message,'OK');
                return
            }
  
          }catch(error){
  
              setspinner(false);
              alert(error);
          } 
    })

     //BUTTON EDIT 
     const get_save =()=>{

        if(!name){

           // alert('Please Enter the Name');
            setAlert(true,'warning','Please enter the name','OK');
            Valid= false;
            return
            
        }else{  


            if (Attachments_List.length > 0) {

                Valid = true;

              }else{
      
                //alert('Please sign the acknowledgement signature');
                setAlert(true,'warning','Please sign the acknowledgement signature','OK');
                Valid = false;
                return
      
            }

        }

        if(Valid){

            console.log(Valid)
            if(WIFI === 'OFFLINE'){

                update_acknowledgement_offline();
             
      
            }else{
      
                update_acknowledgement_online();
      
            }

        }


    };

    //ONLINE UPDATE ACKNOWLEDGEMENT
    const update_acknowledgement_online=(async()=>{

        setspinner(true);
        var sync_date = moment().format('YYYY-MM-DD HH:mm');
        let dvc_id = DeviceInfo.getDeviceId();  


        console.log(rating1)

        let update_acknowledgement = {

            site_cd:Site_cd,
            mst_RowID:mst_RowID,
           

            rating1:rating1,
            rating2:rating2,
            rating3:rating3,

            ack_name:name,
            ack_contact:Phone_no,
            ack_id:staffId,
            dvc_id:dvc_id,
            LOGINID:LoginID,

            sync_step:"",
            sync_time:sync_date,
            sync_status:"online",
            sync_url:Baseurl+"/update_acknowledgement.php?"};

           console.log("update_acknowledgement : "+JSON.stringify(update_acknowledgement))  

           try{
            const response = await axios.post(`${Baseurl}/update_acknowledgement.php?`,JSON.stringify(update_acknowledgement),
            {headers:{ 'Content-Type': 'application/json'}});
            console.log('update_acknowledgement response:'+ JSON.stringify(response.data));
            if (response.data.status === 'SUCCESS'){

                if(Attachments_List.length>0){
                    Insert_image(response.data.message);
                    //console.log("FILE"+JSON.stringify(Attachments_List));
                }else{

                    setspinner(false)
                    // Alert.alert(response.data.status,response.data.message,
                    //     [
                        
                    //         { text: "OK",onPress: () => _goBack() }

                    //     ]);

                    setAlert(true,'success',response.data.message,'UPDATE_ACK');

                }
               
               
               

            }else{
               setspinner(false)
            //    Alert.alert(response.data.status,response.data.message,
            //        [
                   
            //            { text: "OK" }

            //        ]);

            setAlert(true,'warning',response.data.message,'OK');
           }

       }catch(error){

           setspinner(false);
           alert(error);
       } 




    })

    //OFFLINE UPDATE ACKNOWLEDGEMENT
    const update_acknowledgement_offline=(async()=>{

        setspinner(true);
 

        if(!mst_RowID){

            console.log('ROWID IS EMPTY' + Local_ID )
            
            db.transaction(function(txn){
  
                console.log('ROWID IS  NOT EMPTY',rating1)
                console.log('ROWID IS  NOT EMPTY',rating2)
                console.log('ROWID IS  NOT EMPTY',rating3)
                console.log('ROWID IS  NOT EMPTY',name)
                console.log('ROWID IS  NOT EMPTY',Phone_no)
                console.log('ROWID IS  NOT EMPTY',staffId)

                //GET OFFLINE UPADTE ACKOWLEDGEMENT MST_ROWID
                txn.executeSql(
                    'select * from wko_det_ackowledgement where local_id = ?' , 
                    [Local_ID],
                    (tx, results) => {
                        console.log('Results select', results);
                        if (results.rows.length > 0) {

                            txn.executeSql(
                                'UPDATE wko_det_ackowledgement set wko_det_rating1 = ?, wko_det_rating2 = ?, wko_det_rating3 = ?, wko_det_ack_name = ?, wko_det_ack_contact = ?, wko_det_ack_id = ?, sts_column = ? where local_id = ?' , 
                                [rating1,rating2,rating3,name,Phone_no,staffId,'',Local_ID],
                               
                                (tx, results) => {
                    
                                    console.log('Results', results.rowsAffected);
                                    if (results.rowsAffected > 0) {


                                        if (Attachments_List.length > 0) {

                                            Insert_image_Offline()
            
                                        }else{

                                            setspinner(false);
                                            // Alert.alert(
                                            //     'Success',
                                            //     'Updated Acknowledgement successfully',
                                            //     [
                                            //     {
                                            //         text: 'Ok',
                                            //         onPress: () => _goBack(),
                                            //     },
                                            //     ],
                                            //     { cancelable: false }
                                            // );


                                            setAlert(true,'success','Updated acknowledgement successfully','UPDATE_ACK');

                                        }
                                        
                                    }else {
                                        setspinner(false); 
                                        setAlert(true,'warning','Updated acknowledgement Failed','OK');
                                        //alert('Updation Failed');
                                    }
                                    
                                    
                                }
                            );
                            
                        }else {
                           
                            txn.executeSql(
                                'INSERT INTO wko_det_ackowledgement (site_cd,wko_det_rating1,wko_det_rating2,wko_det_rating3,wko_det_ack_name,wko_det_ack_contact,wko_det_ack_id,local_id) VALUES (?,?,?,?,?,?,?,?)' , 
                                [Site_cd,rating1,rating2,rating3,name,Phone_no,staffId,Local_ID],
                               
                                (tx, results) => {
                    
                                    console.log('Results in', results.rowsAffected);
                                    if (results.rowsAffected > 0) {
                                        setspinner(false);
                                        if (Attachments_List.length > 0) {

                                            Insert_image_Offline()
            
                                        }else{

                                            setspinner(false);
                                            // Alert.alert(
                                            //     'Success',
                                            //     'Updated Acknowledgement successfully',
                                            //     [
                                            //     {
                                            //         text: 'Ok',
                                            //         onPress: () => _goBack(),
                                            //     },
                                            //     ],
                                            //     { cancelable: false }
                                            // );

                                            setAlert(true,'success','Update acknowledgement successfully','UPDATE_ACK');

                                        }
                                    }else {
                                        setspinner(false); 
                                        //alert('Insert Failed');
                                        setAlert(true,'warning','Update acknowledgement Failed','OK');
                                    }
                                    
                                    
                                }
                            );

                        };
                        
                        
                    }
                );
    
                
        
            });

              
        }else{

            console.log('ROWID IS  NOT EMPTY')

            db.transaction(function(txn){

                console.log('ROWID IS  NOT EMPTY')
                console.log('ROWID IS  NOT EMPTY',rating1)
                console.log('ROWID IS  NOT EMPTY',rating2)
                console.log('ROWID IS  NOT EMPTY',rating3)
                console.log('ROWID IS  NOT EMPTY',name)
                console.log('ROWID IS  NOT EMPTY',Phone_no)
                console.log('ROWID IS  NOT EMPTY',staffId)
        
                //GET OFFLINE UPADTE ACKOWLEDGEMENT MST_ROWID
                txn.executeSql(
                    'UPDATE wko_det_ackowledgement set wko_det_rating1 = ?, wko_det_rating2 = ?, wko_det_rating3 = ?, wko_det_ack_name = ?, wko_det_ack_contact = ?, wko_det_ack_id = ?, sts_column = ? where mst_RowID = ?', 
                    [rating1,rating2,rating3,name,Phone_no,staffId,'Update',mst_RowID],
                   
                    (tx, results) => {
        
                        console.log('Results', results.rowsAffected);
                        if (results.rowsAffected > 0) {

                            if (Attachments_List.length > 0) {

                                Insert_image_Offline()

                            }else{

                                setspinner(false);
                                // Alert.alert(
                                //     'Success',
                                //     'updated successfully',
                                //     [
                                //     {
                                //         text: 'Ok',
                                //         onPress: () => _goBack(),
                                //     },
                                //     ],
                                //     { cancelable: false }
                                // );

                                setAlert(true,'success','Updated acknowledgement successfully','UPDATE_ACK');

                            }

                            
                        }else {
                            setspinner(false); 
                            //alert('Updation Failed');
                            setAlert(true,'warning','Updated acknowledgement Failed','OK');
                        }
                        
                        
                    }
                );
    
            });

        }

    })


    //INSERT WORK ORDER ATTACHMENT OFFLINE
    const Insert_image_Offline=(async()=>{

        console.log("LENGTH: "+Attachments_List.length)
        console.log("LENGTH mst_RowID: "+mst_RowID)
    
        if(!mst_RowID){

            console.log('ROWID IS EMPTY');
    
            db.transaction(function (txn) {


                txn.executeSql( 'select * from wko_ref where local_id = ? and column2=?',
                [Local_ID,'SIGN'],
                    (tx, results) => {

                        console.log("LENGTH: "+JSON.stringify(results.rows))

                        if (results.rows.length > 0) {

                            
                            for (let i = 0; i < Attachments_List.length; i++){ 
            
                                let localpath = Attachments_List[i].signpath;
                        
                                //console.log('localpath' ,localpath);
                        
                                tx.executeSql('UPDATE wko_ref SET attachment=?,Exist=?,ref_type=?,type=? WHERE local_id=? and Column2=?',
                                [localpath,'New','Gallery_image',Local_ID,'SIGN','A'],
                                (tx, results) => {
                        
                                    if (results.rowsAffected > 0) {
                        
                                        console.log('INSERT TABLE wko_ref Successfully')

                                        setspinner(false);
                                        // Alert.alert(
                                        //     'Success',
                                        //     'Updated Acknowledgement successfully',
                                        //     [
                                        //         {
                                        //         text: 'Ok',
                                        //         onPress: () => _goBack(),
                                        //         },
                                        //     ],
                                        //     { cancelable: false }
                                        //     );

                                        setAlert(true,'success','Updated acknowledgement successfully','UPDATE_ACK');
                        
                                        
                        
                                    }else{
                        
                                        setspinner(false);
                                        //alert('INSERT TABLE wko_ref Failed');
                                        setAlert(true,'warning','Updated acknowledgement Failed','OK');
                        
                                    }
                        
                                })
                        
                            }



                        }else{

                            for (let i = 0; i < Attachments_List.length; i++){ 
        
                                let localpath = Attachments_List[i].signpath;
                        
                                console.log('localpath else ' ,Attachments_List[i]);
                        
                                tx.executeSql('INSERT INTO wko_ref (site_cd,type,file_name,ref_type,Exist,attachment,local_id,column2) VALUES (?,?,?,?,?,?,?,?)',
                                [Site_cd,'A','SIGN','Gallery_image','New',localpath,Local_ID,'SIGN'],
                                (tx, results) => {
                        
                                    if (results.rowsAffected > 0) {
                        
                                    console.log('INSERT TABLE wko_ref Successfully')
                                    setspinner(false);
                                    // Alert.alert(
                                    //     'Success',
                                    //     'Update Acknowledgement successfully',
                                    //     [
                                    //         {
                                    //         text: 'Ok',
                                    //         onPress: () => _goBack(),
                                    //         },
                                    //     ],
                                    //     { cancelable: false }
                                    //     );

                                    setAlert(true,'success','Updated acknowledgement successfully','UPDATE_ACK');
                    
                                        
                        
                                    }else{
                        
                                    setspinner(false);
                                    //alert('INSERT TABLE wko_ref Failed')
                                    setAlert(true,'warning','Updated acknowledgement Failed','OK');
                        
                                    }
                        
                                })
                        
                            }

                        }

                })
        
            })
        
                
            }else{
        
                console.log('ROWID IS NOT EMPTY');

        
                db.transaction(function (txn) {

                    txn.executeSql('select * from wko_ref where mst_RowID = ? and column2 is not ? ' , 
                        [mst_RowID,'RESPONSE_SIGN'],
                        (tx, results) => {

                            console.log('localpath' ,results.rows);

                            if (results.rows.length > 0) {

                                for (let i = 0; i < Attachments_List.length; i++){ 
            
                                    let localpath = Attachments_List[i].signpath;
                            
                                    //console.log('localpath' ,localpath);
                            
                                    tx.executeSql('UPDATE wko_ref SET attachment=?,Exist=?,ref_type=?,sts_column=?  WHERE mst_RowID=?',
                                    [localpath,'New','Gallery_image','Update',mst_RowID],
                                    (tx, results) => {
                            
                                        if (results.rowsAffected > 0) {
                            
                                            console.log('INSERT TABLE wko_ref Successfully')
                                            setspinner(false);
                                            // Alert.alert(
                                            //     'Success',
                                            //     'Update Acknowledgement successfully',
                                            //     [
                                            //         {
                                            //         text: 'Ok',
                                            //         onPress: () => _goBack(),
                                            //         },
                                            //     ],
                                            //     { cancelable: false }
                                            //     );

                                            setAlert(true,'success','Updated acknowledgement successfully','UPDATE_ACK');
                            
                                            
                            
                                        }else{
                            
                                            setspinner(false);
                                            //alert('Update Table wko_ref Failed')
                                            setAlert(true,'warning','Updated acknowledgement Failed','OK');
                            
                                        }
                            
                                    })
                            
                                }



                            }else{

                                //console.log('ROWID IS NOT EMPTY else');
                                //console.log('ROWID IS NOT EMPTY else',Attachments_List.length);

                                for (let i = 0; i < Attachments_List.length; i++){ 
            
                                    let localpath = Attachments_List[i].signpath;
                            
                                    //console.log('localpath' ,JSON.stringify(Attachments_List[i].name));
                            
                                    tx.executeSql('INSERT INTO wko_ref (site_cd,type,file_name,ref_type,Exist,attachment,column2,mst_RowID) VALUES (?,?,?,?,?,?,?,?)',
                                    [Site_cd,'A','SIGN','Gallery_image','New',localpath,'SIGN',mst_RowID],
                                    (tx, results) => {
                            
                                        if (results.rowsAffected > 0) {
                            
                                        console.log('INSERT TABLE wko_ref Successfully')
                                        setspinner(false);
                                        // Alert.alert(
                                        //     'Success',
                                        //     'Update Acknowledgement successfully',
                                        //     [
                                        //         {
                                        //         text: 'Ok',
                                        //         onPress: () => _goBack(),
                                        //         },
                                        //     ],
                                        //     { cancelable: false }
                                        //     );

                                        setAlert(true,'success','Updated acknowledgement successfully','UPDATE_ACK');
                            
                                            
                            
                                        }else{
                            
                                        setspinner(false);
                                        //alert('INSERT TABLE wko_ref Failed')
                                        setAlert(true,'warning','Updated acknowledgement Failed','OK');
                            
                                        }
                            
                                    })
                            
                                }

                            }
        
                        })
            
                })
        
        
        
            }
        
        
    })

    
     //INSERT WORK ORDER  RESPONSE SING FILE API
     const Insert_image =(async(message)=>{

        const SPLIT_URL = Baseurl.split('/'); 
        const SPLIT_URL1 = SPLIT_URL[SPLIT_URL.length - 2];
        const SPLIT_URL2 = SPLIT_URL[SPLIT_URL.length - 1];
        const SPLIT_URL3 = SPLIT_URL1+'/'+SPLIT_URL2
        console.log('URL'+SPLIT_URL3);

       // console.log("LENGTH: "+SignatureScreen.length)

        console.log("ROW_ID: "+mst_RowID)

    
        let data = {data:{
                    rowid:mst_RowID,
                    site_cd:Site_cd,
                    EMPID:EmpID,
                    LOGINID:LoginID,
                    folder:SPLIT_URL3,
                    dvc_id:dvc_id        
                }}

        
        console.log(JSON.stringify(data));
        console.log(Attachments_List);
        const formData = new FormData();
        formData.append('count', Attachments_List.length);
        formData.append('json', JSON.stringify(data));

        
            let k=0;
        for (let i = 0; i < Attachments_List.length; i++) {
            k++;
            //formData.append('file_'+[k], {uri: Attachments_List[i].signpath,name: Attachments_List[i].name,type: 'image/jpeg'});
            //formData.append('photo', {uri: Attachments_List[i].path,name: Attachments_List[i].name});
            // formData.append('Content-Type', 'image/png');
            formData.append('base64string', Attachments_List[i].signpath);
            
        }
        //console.log(JSON.stringify( formData));

        try{


            const xhr = new XMLHttpRequest();
            xhr.open('POST', `${Baseurl}/update_action_workorder_image_file_react.php?`);
            xhr.setRequestHeader("Content-Type","multipart/form-data"); 
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
                  if(json_obj.data.wko_ref.length> 0 ){

                    setspinner(false)
                    // Alert.alert(json_obj.status,json_obj.message,
                    //     [
                        
                    //         { text: "OK", onPress: () => _goBack()}
    
                    //     ]);

                    setAlert(true,'success',message,'UPDATE_ACK');

                    }else{

                        setspinner(false)
                        // Alert.alert(json_obj.status,json_obj.message,
                        //     [
                            
                        //         { text: "OK",onPress: () => _goBack() }
        
                        //     ]);

                        setAlert(true,'success',message,'UPDATE_ACK');
                    }

                } else {
                    setspinner(false);
                    //alert(xhr.responseText);
                    setAlert(true,'warning',xhr.responseText,'OK');
                  //console.log('error', xhr.responseText);
                }
              };


        }catch(error){
  
            setspinner(false);
            alert(error);
        } 
 

    })

    const takeSnapshot = (async (img) => {

        var sync_date = moment().format('YYYY-MM-DD HH:mm');

        var today = Math.round((new Date()).getTime() / 1000);

        console.log(today);


        setSingVisible(!SingVisible);

        console.log('path :-', img);
        console.log(img);
        setSignature(img);
    
        let signpath = img;
        let name = 'Signature_'+today+'.jpg';
        let exist = 'New';
        console.log('name :-', name);
        Attachments_List.unshift({signpath, name,exist});
        setAttachments_List(Attachments_List.slice(0));
               
    });
    


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
    
        setShow(false);
    
      }else if(D === 'UPDATE_ACK'){
    
        setShow(false);
    
        _goBack();
    
      }
    
    }


    const Alret_onClick =(D) =>{

        setShow_two(false)
    
        if(D === 'BACK'){
    
          _goBack()
    
        } 
    
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
                            <Text style={{fontSize:20, justifyContent:'center',textAlign:'center',color:'#fff',fontWeight: 'bold',marginLeft:15}}>{Toolbartext}</Text> 
                        </View >
                    </Pressable>
                </View>
            </Appbar.Header>   


            <SCLAlert theme={Theme} show={Show} title={Title}>
                <SCLAlertButton theme={Theme}   onPress={()=>One_Alret_onClick(AlertType)}>OK</SCLAlertButton>
            </SCLAlert> 

            <SCLAlert theme={Theme} show={Show_two} title={Title} >
                <SCLAlertButton theme={Theme}  onPress={()=>Alret_onClick(AlertType)}>Yes</SCLAlertButton>
                <SCLAlertButton theme="default" onPress={()=>setShow_two(false)}>No</SCLAlertButton>
            </SCLAlert>

            <Modal  
                animationType="slide"
                transparent={true}
                visible={SingVisible}
                onRequestClose={()=>{
                    Alert.alert("Closed")
                    setSingVisible(!SingVisible)}}>

                <View style={styles.model_cardview}>

                    <View style={{margin:20,height:"50%",backgroundColor:'#FFFFFF'}}>
                        <View style={{flexDirection:'row',height:50,alignItems:'center',backgroundColor:'#0096FF'}}>
                            <Text style={{flex:1,fontSize:15, justifyContent:'center',color:'#ffffffff',margin:5}}>Signature</Text> 
                            <Ionicons 
                                name="close"
                                color='#ffffffff'
                                size={25}
                                style={{marginEnd:15}}
                                onPress={()=>setSingVisible(false)}
                            />                        
                        </View>

                        <View style={{ flex: 1,alignItems:'center', }}>
                            
                            <Signature
                                onOK={img => takeSnapshot(img)}
                                onEmpty={() => console.log('onEmpty')}
                                onClear={() => setSignature(null)}
                                autoClear={true}
                                imageType={'image/png+xml'}
                                webStyle={style}
                            />
                        </View>
                    </View>
                
                </View>
            </Modal>


            <View style={styles.container}>

                <KeyboardAwareScrollView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : null} 
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>   

                    <ScrollView style={{flex: 1,marginBottom:80}}>

                        <View style={styles.card_01}>

                            <View style={{alignItems:'center', justifyContent:'center',backgroundColor:'#0096FF',borderTopRightRadius:10,borderTopLeftRadius:10}}>
                                <Text style={{fontSize:15, justifyContent:'center',color:'#ffffffff',margin:5,fontWeight: 'bold'}}>RATING</Text>                        
                            </View>

                            <Text style={{margin:10,fontSize:15,color:'#42A5F5', justifyContent:'center'}}>{'1. '+question_one}</Text>
                            <Rating
                                type="custom"
                                ratingCount={5}
                                startingValue={rating1}
                                onFinishRating={this.ratingcompleted_one}
                                style={{ paddingVertical: 10 }}
                            />

                            <Text style={{margin:10,fontSize:15, color:'#42A5F5',justifyContent:'center'}}>{'2. '+question_two}</Text>
                            <Rating
                                type="custom"
                                ratingCount={5}
                                startingValue={rating2}
                                onFinishRating={this.ratingcompleted_two}
                                style={{ paddingVertical: 10 }}
                            />

                            <Text style={{margin:10,fontSize:15, color:'#42A5F5',justifyContent:'center'}}>{'3. '+question_three}</Text>
                            <Rating
                                type="custom"
                                ratingCount={5}
                                startingValue={rating3}
                                onFinishRating={this.ratingcompleted_three}
                                style={{ paddingVertical: 10 }}
                            />

                        </View>

                        <View style={styles.card_01}>

                            <View style={{alignItems:'center', justifyContent:'center',backgroundColor:'#0096FF',borderTopRightRadius:10,borderTopLeftRadius:10}}>
                                <Text style={{fontSize:15, justifyContent:'center',color:'#ffffffff',margin:5,fontWeight: 'bold'}}>ACKNOWLEDGEMENT / SIGNATURE</Text>                        
                            </View>

                            <View  style={{marginTop:5,marginBottom:10}} >

                                {/* Requester Name */}
                                <View style={styles.view_style}>
                                <TextInput
                                    value={name}
                                    style={[
                                    styles.input,
                                    {
                                        height: Math.max(
                                        Platform.OS === 'ios' ? 50 : 50,
                                        height,
                                        ),
                                    },
                                    ]}
                                    inputStyle={[
                                    styles.inputStyle,
                                    {color: !Editable ? '#808080' : '#000'},
                                    ]}
                                    labelStyle={styles.labelStyle}
                                    
                                    placeholderStyle={{
                                    fontSize: 15,
                                    color: '#0096FF',
                                    }}
                                    textErrorStyle={styles.textErrorStyle}
                                    label="Name"
                                    placeholderTextColor="gray"
                                    focusColor="#808080"
                                    editable={Editable}
                                    selectTextOnFocus={Editable}
                                    onChangeText={text => {
                                        setname(text);
                                    }}
                                    renderRightIcon={() =>
                                        Editable ? (
                                            ''
                                        ) : (
                                            <AntDesign
                                            style={styles.icon}
                                            color={'black'}
                                            name={name ? 'close' : ''}
                                            size={22}
                                            disable={true}
                                            onPress={() =>
                                                name
                                                ? setname('')
                                                : ''
                                            }
                                            />
                                        )
                                    }
                                    
                                />
                                </View>

                                {/* IC No */}
                                <View style={styles.view_style}>
                                    <TextInput
                                        value={staffId}
                                        style={[
                                        styles.input,
                                        {
                                            height: Math.max(
                                            Platform.OS === 'ios' ? 50 : 50,
                                            height,
                                            ),
                                        },
                                        ]}
                                        inputStyle={[
                                        styles.inputStyle,
                                        {color: !Editable ? '#808080' : '#000'},
                                        ]}
                                        labelStyle={styles.labelStyle}
                                        
                                        placeholderStyle={{
                                        fontSize: 15,
                                        color: '#0096FF',
                                        }}
                                        textErrorStyle={styles.textErrorStyle}
                                        label="Staff ID/IC"
                                        placeholderTextColor="gray"
                                        focusColor="#808080"
                                        editable={Editable}
                                        selectTextOnFocus={Editable}
                                        onChangeText={text => {
                                            setstaffId(text);
                                        }}
                                        renderRightIcon={() =>
                                            Editable ? (
                                                ''
                                            ) : (
                                                <AntDesign
                                                style={styles.icon}
                                                color={'black'}
                                                name={staffId ? 'close' : ''}
                                                size={22}
                                                disable={true}
                                                onPress={() =>
                                                    staffId
                                                    ? setstaffId('')
                                                    : ''
                                                }
                                                />
                                            )
                                        }
                                        
                                    />
                                </View>

                                {/* Phone no */}
                                <View style={styles.view_style}>
                                    <TextInput
                                        value={Phone_no}
                                        style={[
                                        styles.input,
                                        {
                                            height: Math.max(
                                            Platform.OS === 'ios' ? 50 : 50,
                                            height,
                                            ),
                                        },
                                        ]}
                                        inputStyle={[
                                        styles.inputStyle,
                                        {color: !Editable ? '#808080' : '#000'},
                                        ]}
                                        labelStyle={styles.labelStyle}
                                        keyboardType="numeric"
                                        placeholderStyle={{
                                        fontSize: 15,
                                        color: '#0096FF',
                                        }}
                                        textErrorStyle={styles.textErrorStyle}
                                        label="Phone No"
                                        placeholderTextColor="gray"
                                        focusColor="#808080"
                                        editable={Editable}
                                        selectTextOnFocus={Editable}
                                        onChangeText={text => {
                                            setPhone_no(text);
                                        }}
                                        renderRightIcon={() =>
                                            Editable ? (
                                                ''
                                            ) : (
                                                <AntDesign
                                                style={styles.icon}
                                                color={'black'}
                                                name={Phone_no ? 'close' : ''}
                                                size={22}
                                                disable={true}
                                                onPress={() =>
                                                    Phone_no
                                                    ? setPhone_no('')
                                                    : ''
                                                }
                                                />
                                            )
                                        }
                                        
                                    />
                                </View>


                            </View>



                            {signature && (
                                <Image style={sing_styles.preview} source={{uri: signature, cache: "reload"}} />
                            )}

                            <TouchableOpacity
                                style={{height:40,backgroundColor:'#42A5F5',margin:20, borderRadius: 10,      
                                alignItems:'center',justifyContent:'center'} } onPress={()=>setSingVisible(true)}>
                                <Text style={{color:'white', fontSize: 16,fontWeight: 'bold'}}>SIGNATURE</Text>
                            </TouchableOpacity>
                    
                        </View>

                    </ScrollView>
                </KeyboardAwareScrollView>
            </View>


            <View style={ styles.bottomView} >

          
                <TouchableOpacity
                    style={{width:'100%',height:60,backgroundColor:'#8BC34A',
                    alignItems:'center',justifyContent:'center'} } onPress={get_save}
                >
                <Text style={{color:'white',fontWeight: 'bold', fontSize: 16}}>SAVE</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaProvider>
        </DismissKeyboard>
    )

}
export default Ackowledgement
const style = `.m-signature-pad--footer
    .button {
      background-color: #42A5F5;
      color: #FFF;
    }.m-signature-pad {
        position: fixed;
        margin:auto; 
        top: 0; 
        width:100%;
        height:85%
    }`;
const styles = StyleSheet.create({

    container: {
      flex: 1
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

    card_01: {

        backgroundColor: '#FFFFFF',
        margin:10,
        borderRadius: 10,      
    },


    text_footer: {         
        fontSize: 13,
        color: '#42A5F5'
    },
    model_cardview:{

        flex:1,
        justifyContent:'center',        
        backgroundColor:'rgba(0,0,0,0.8)'
    
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
  
    text_footer: {
        color: '#42A5F5',
        fontSize: 14,
        marginTop: 10,
        marginLeft:5,
    },
      
    text_input:{
        flexDirection: 'row',
        height: 45,
        marginLeft:5,
        color:'#000',
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

      view_style: {
        flex:1,
        marginTop: 15,
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
    textErrorStyle: {fontSize: 16},
   
});

const sing_styles = StyleSheet.create({
    preview: {
        width: "100%",
        height: 200,
        backgroundColor: "#F8F8F8",
        justifyContent: "center",
        alignItems: "center",
        padding:10,
        marginTop: 15,
        resizeMode:"contain"
      },
      previewText: {
        color: "#FFF",
        fontSize: 14,
        height: 40,
        lineHeight: 40,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: "#69B2FF",
        width: 120,
        textAlign: "center",
        marginTop: 10,
      },

      
});