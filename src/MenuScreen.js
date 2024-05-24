import React,{useState} from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, Alert,Image,TouchableOpacity,Dimensions } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import axios from "react-native-axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { openDatabase } from 'react-native-sqlite-storage';
import ProgressLoader from 'rn-progress-loader';

var db = openDatabase({ name: 'CMMS.db' });
let BaseUrl,Site_cd,LoginID,EmpName,EmpID,EmpPhone,EmpWorkGrp,WIFI,WR_Approver,MR_Approver,PR_Approver;

const MenuScreen = ({navigation}) =>{


  const [spinner, setspinner] = React.useState(false);
  const [sub,setsub] = useState([])
  const [Datasub,setDatasub] = useState([])


  React.useEffect(() => {  

    const focusHander = navigation.addListener('focus', ()=>{

      fetchData();

  });
  return focusHander;

      
    
  }, [navigation]);




  const fetchData = async ()=>{  

    setspinner(true);

    BaseUrl = await AsyncStorage.getItem('BaseURL');
    Site_cd = await AsyncStorage.getItem('Site_Cd');
    LoginID = await AsyncStorage.getItem('emp_mst_login_id');
    EmpName = await AsyncStorage.getItem('emp_mst_name');
    EmpID = await AsyncStorage.getItem('emp_mst_empl_id');
    EmpPhone = await AsyncStorage.getItem('emp_mst_homephone');
    EmpWorkGrp = await AsyncStorage.getItem('emp_det_work_grp'); 
    WR_Approver = await AsyncStorage.getItem('emp_det_wr_approver'); 

    MR_Approver = await AsyncStorage.getItem('emp_det_mr_approver'); 
    PR_Approver = await AsyncStorage.getItem('emp_det_pr_approver'); 


    console.log( "WR_Approver" , WR_Approver);
    console.log( "MR_Approver" , MR_Approver);
    console.log( "PR_Approver" , PR_Approver);

    WIFI = await AsyncStorage.getItem('WIFI');

    console.log( "DATA OFF"+ WIFI);

      if(WIFI == 'OFFLINE'){

        setDatasub([])

        const  DATA = [

          {
            id: 'WorkOrder',
            title: 'Work Order',
            imagesource :require('../images/newwok.png')  
          },
      
          
          {
            id: 'SyncData',
            title: 'Sync Data',
            imagesource :require('../images/iconassest.png')       
          },
          
        ];

        setDatasub(DATA)
        setspinner(false);
      }else{
        
        setDatasub([])

        // fetch(`${Baseurl}/get_dashbord_permission.php?site_cd=${Site_Cd}&login_id=${LoginID}`)
        // .then(response => {
        //     if (!response.ok) {
        //     throw new Error(`HTTP error! Status: ${response.status}`);
        //     }
        //     return response.json();
        // })
        // .then(data => {
        //     // Process the data
        //     //console.log('data :', data);
        //     if (data.status === 'SUCCESS') {
        //     }else{

        //     setspinner(false);
        //     setAlert(true,'danger',data.message);
        //     return;
            
        //     }
        // })
        // .catch(error => {
        //     setspinner(false);
        //     setAlert(true,'danger',error.message);
        //     console.error('Error :', error.message);
        // });                       
        
        

        db.transaction(function (txn) {

            //Asset
            txn.executeSql(`SELECT * FROM cf_menu where column1='Asset' and exe_flag='1' and mobile_object_type='M'`, 
            [], 
            (tx, results) => {

                if(results.rows.length >0){

                   console.log('ASSET')

                    setDatasub(Datasub => [...Datasub,

                        {
                        id: 'Asset',
                        title: 'Asset',
                        imagesource :require('../images/iconassest.png')   
                        },

                    ]);

                    
                }
                

            })
           

            //Work Request
            txn.executeSql(`SELECT * FROM cf_menu where column1='Work Request' and exe_flag='1' and mobile_object_type='M'`, 
            [], 
            (tx, results) => {

                if(results.rows.length >0){

                    console.log('WRK')

                    setDatasub(Datasub =>[...Datasub,
                        
                        {
                            id: 'WorkRequest',
                            title: 'Work Request',
                            imagesource :require('../images/workrequest1.png')   
                        },

                    ]);

                    
                }
                

            })

            //Work Order
            txn.executeSql(`SELECT * FROM cf_menu where column1='Work Order' and exe_flag='1' and mobile_object_type='M'`, 
            [], 
            (tx, results) => {

                if(results.rows.length >0){

                    console.log('WOK')

                    setDatasub(Datasub =>[...Datasub,
                        
                        {
                            id: 'WorkOrder',
                            title: 'Work Order',
                            imagesource :require('../images/newwok.png')    
                        },

                    ]);

                    
                }
                

            })

            //Inventory
            txn.executeSql(`SELECT * FROM cf_menu where column1='Inventory' and exe_flag='1' and mobile_object_type='M' order by cf_menu_seq`, 
            [], 
            (tx, results) => {

                if(results.rows.length >0){

                    console.log('INV')

                    setDatasub(Datasub =>[...Datasub,
                        
                        {
                            id: 'Inventory',
                            title: 'Inventory',
                            imagesource :require('../images/warehouse.png')   
                        },

                    ]);

                    
                }
                

            })

            //Approval
            txn.executeSql(`SELECT * FROM cf_menu where column1='Approval' and exe_flag='1' and mobile_object_type='M' order by cf_menu_seq`, 
            [], 
            (tx, results) => {

                if(results.rows.length >0){

                    console.log('APP')

                    setDatasub(Datasub =>[...Datasub,
                        
                        {
                            id: 'Approval',
                            title: 'Approval',
                            imagesource :require('../images/approv.png')   
                        },

                        {
                            id: 'SyncData',
                            title: 'Sync Data',
                            imagesource :require('../images/iconassest.png')     
                        },

                    ]);

                      
                    
                }else{

                    setDatasub(Datasub =>[...Datasub,
                        

                        {
                            id: 'SyncData',
                            title: 'Sync Data',
                            imagesource :require('../images/syncdata.png')    
                        },

                    ]);

                }
                

            })
           
        }); 


        setspinner(false);
        
      }

  }

  const selectedSID = (id)=> {

     setsub([]);

      console.log(id,"ITEM_ID")

      // setSelectedId (id)

      if(id === "Asset"){

        db.transaction(function (txn) {

            //Asset
            txn.executeSql(`SELECT * FROM cf_menu where column1='Asset' and mobile_object_type='M' order by cf_menu_seq`, 
            [], 
            (tx, results) => {

                if(results.rows.length >0){
                    console.log(results.rows.length); 
                    for (let i = 0; i < results.rows.length; ++i){   

                        console.log(results.rows.item(i).object_descs); 
                        
                        if(results.rows.item(i).object_name == 'm_ast_create_asset'){

                            if(results.rows.item(i).exe_flag == '1'){

                                setsub (sub=>[...sub,
                                    {
                                        id: 'CreateAsset',
                                        title: 'Create Asset',
                                        imagesource :require('../images/newasset.png')      
                                    },

                                ]);

                            }

                            if(results.rows.item(i).new_flag == '1'){

                            }

                            if(results.rows.item(i).edit_flag == '1'){

                            }
                        }

                        if(results.rows.item(i).object_name == 'm_ast_asset_master'){

                            if(results.rows.item(i).exe_flag == '1'){

                                setsub (sub=>[...sub,
                                    {
                                        id: 'AssetMaster',
                                        title: 'Asset Master',
                                        imagesource :require('../images/editasset.png')      
                                    },
                                ]);

                            }

                            if(results.rows.item(i).new_flag == '1'){

                            }

                            if(results.rows.item(i).edit_flag == '1'){

                            }
                        }

                        if(results.rows.item(i).object_name == 'm_ast_scan_Asset'){

                            if(results.rows.item(i).exe_flag == '1'){

                                setsub (sub=>[...sub,
                                    {
                                        id: 'ScanAsset',
                                        title: 'Scan Asset',
                                        imagesource :require('../images/sacn.png')      
                                    },
                                ]);

                            }

                            if(results.rows.item(i).new_flag == '1'){

                            }

                            if(results.rows.item(i).edit_flag == '1'){

                            }
                        }
                    } 

                    return 

                    
                }
                

            })


        })


      }else if(id === "WorkRequest"){

        db.transaction(function (txn) {

            //Asset
            txn.executeSql(`SELECT * FROM cf_menu where column1='Work Request' and mobile_object_type='M'`, 
            [], 
            (tx, results) => {

                if(results.rows.length >0){
                    console.log(results.rows.length); 
                    for (let i = 0; i < results.rows.length; ++i){   

                        console.log(results.rows.item(i).object_descs); 
                        
                        if(results.rows.item(i).object_name == 'm_wr_create_wr'){

                            if(results.rows.item(i).exe_flag == '1'){

                                setsub (sub=>[...sub,
                                    {
                                        id: 'CreateWR',
                                        title: 'Create WR',
                                        imagesource :require('../images/newasset.png')    
                                    },

                                ]);

                            }

                            if(results.rows.item(i).new_flag == '1'){

                            }

                            if(results.rows.item(i).edit_flag == '1'){

                            }
                        }

                        if(results.rows.item(i).object_name == 'm_wr_wr_listing'){

                            if(results.rows.item(i).exe_flag == '1'){

                                setsub (sub=>[...sub,
                                    {
                                        id: 'WRListing',
                                        title: 'WR Listing',
                                        imagesource :require('../images/workrwuestlist.png')     
                                    },
                                ]);

                            }

                            if(results.rows.item(i).new_flag == '1'){

                            }

                            if(results.rows.item(i).edit_flag == '1'){

                            }
                        }

                        if(results.rows.item(i).object_name == 'm_wr_wr_listing_all_grp'){

                            if(results.rows.item(i).exe_flag == '1'){

                                if(WR_Approver === '1'){

                                    setsub (sub=>[...sub,
                                        {
                                            id: 'WRApprovalAll',
                                            title: 'WR Approval\n(All Work Group)',
                                            imagesource :require('../images/workrequestapproval1.png')      
                                        },
                                    ]);


                                }

                                 

                            }

                            if(results.rows.item(i).new_flag == '1'){

                            }

                            if(results.rows.item(i).edit_flag == '1'){

                            }
                        }

                        if(results.rows.item(i).object_name == 'm_wr_wr_listing_my_grp'){

                            if(results.rows.item(i).exe_flag == '1'){

                                if(WR_Approver === '1'){

                                    setsub (sub=>[...sub,
                                        {
                                            id: 'WRApprovalMy',
                                            title: 'WR Approval\n(My Work Group)',
                                            imagesource :require('../images/workrequestapproval1.png')     
                                        },
                                    ]);

                                }

                                

                            }

                            if(results.rows.item(i).new_flag == '1'){

                            }

                            if(results.rows.item(i).edit_flag == '1'){

                            }
                        }

                        if(results.rows.item(i).object_name == 'm_wr_my_wr'){

                            if(results.rows.item(i).exe_flag == '1'){

                                 setsub (sub=>[...sub,
                                    {
                                        id: 'MyWR',
                                        title: 'My WR',
                                        imagesource :require('../images/workorderlist.png')      
                                    },
                                ]);

                            }

                            if(results.rows.item(i).new_flag == '1'){

                            }

                            if(results.rows.item(i).edit_flag == '1'){

                            }
                        }
                    } 

                    return 

                    
                }
                

            })


        })

          
      }else if(id === "WorkOrder"){

    

        if(WIFI == 'OFFLINE'){

          const WorkOrder_DATA = [
            
            {
              id: 'CreateWO',
              title: 'Create WO',
              imagesource :require('../images/newasset.png')      
            },
            
            {
                id: 'MyWorkOrder',
                title: 'My Work Order',
                imagesource :require('../images/iconassest.png')         
            },
            
            
          ];
          return setsub (WorkOrder_DATA);

        }else{

            db.transaction(function (txn) {

                //Asset
                txn.executeSql(`SELECT * FROM cf_menu where column1='Work Order' and mobile_object_type='M' order by cf_menu_seq`, 
                [], 
                (tx, results) => {

                    if(results.rows.length >0){
                        console.log(results.rows.length); 
                        for (let i = 0; i < results.rows.length; ++i){   

                            console.log(results.rows.item(i).object_descs); 
                            
                            if(results.rows.item(i).object_name == 'm_wo_dashboard'){

                                if(results.rows.item(i).exe_flag == '1'){

                                    setsub (sub=>[...sub,
                                        {
                                            id: 'WODashboard',
                                            title: 'WO Dashboard',
                                            imagesource :require('../images/dashboard.png')       
                                        },

                                    ]);

                                }

                                if(results.rows.item(i).new_flag == '1'){

                                }

                                if(results.rows.item(i).edit_flag == '1'){

                                }
                            }

                            if(results.rows.item(i).object_name == 'm_wo_create_wo'){

                                if(results.rows.item(i).exe_flag == '1'){

                                    setsub (sub=>[...sub,
                                        {
                                            id: 'CreateWO',
                                            title: 'Create WO',
                                            imagesource :require('../images/newasset.png')    
                                        },
                                    ]);

                                }

                                if(results.rows.item(i).new_flag == '1'){

                                }

                                if(results.rows.item(i).edit_flag == '1'){

                                }
                            }

                            if(results.rows.item(i).object_name == 'm_wo_wo_listing'){

                                if(results.rows.item(i).exe_flag == '1'){

                                    setsub (sub=>[...sub,
                                        {
                                            id: 'WOListing',
                                            title: 'WO Listing',
                                            imagesource :require('../images/workorderlist.png')    
                                        },
                                    ]);

                                }

                                if(results.rows.item(i).new_flag == '1'){

                                }

                                if(results.rows.item(i).edit_flag == '1'){

                                }
                            }

                            if(results.rows.item(i).object_name == 'm_wo_my_wo'){

                                if(results.rows.item(i).exe_flag == '1'){

                                    setsub (sub=>[...sub,
                                        {
                                            id: 'MyWorkOrder',
                                            title: 'My Work Order',
                                            imagesource :require('../images/iconassest.png')      
                                        },
                                    ]);

                                }

                                if(results.rows.item(i).new_flag == '1'){

                                }

                                if(results.rows.item(i).edit_flag == '1'){

                                }
                            }


                        } 

                        return 

                        
                    }
                    

                })


            })
        }
    
      }else if(id === "Inventory"){

        db.transaction(function (txn) {

            //Asset
            txn.executeSql(`SELECT * FROM cf_menu where column1='Inventory' and mobile_object_type='M' order by cf_menu_seq`, 
            [], 
            (tx, results) => {

                if(results.rows.length >0){
                    console.log(results.rows.length); 
                    for (let i = 0; i < results.rows.length; ++i){   

                        console.log(results.rows.item(i).object_descs); 
                        
                        if(results.rows.item(i).object_name == 'm_inv_dashboard'){

                            if(results.rows.item(i).exe_flag == '1'){

                                setsub (sub=>[...sub,
                                    {
                                        id: 'InventoryDashboard',
                                        title: 'Inventory Dashboard',
                                        imagesource :require('../images/dashboard.png')      
                                    },

                                ]);

                            }

                            if(results.rows.item(i).new_flag == '1'){

                            }

                            if(results.rows.item(i).edit_flag == '1'){

                            }
                        }

                        if(results.rows.item(i).object_name == 'm_inv_stock_master'){

                            if(results.rows.item(i).exe_flag == '1'){

                                setsub (sub=>[...sub,
                                    {
                                        id: 'StockMaster',
                                        title: 'Stock Master',
                                        imagesource :require('../images/stockmaster2.png')   
                                    },
                                ]);

                            }

                            if(results.rows.item(i).new_flag == '1'){

                            }

                            if(results.rows.item(i).edit_flag == '1'){

                            }
                        }

                        if(results.rows.item(i).object_name == 'm_inv_stock_issue'){

                            if(results.rows.item(i).exe_flag == '1'){

                                setsub (sub=>[...sub,
                                    {
                                        id: 'StockIssue',
                                        title: 'Stock Issue',
                                        imagesource :require('../images/stockissue2.png')       
                                    },
                                ]);

                            }

                            if(results.rows.item(i).new_flag == '1'){

                            }

                            if(results.rows.item(i).edit_flag == '1'){

                            }
                        }

                        if(results.rows.item(i).object_name == 'm_inv_stock_receive'){

                            if(results.rows.item(i).exe_flag == '1'){

                                setsub (sub=>[...sub,
                                    {
                                        id: 'StockReceive',
                                        title: 'Stock Receive',
                                        imagesource :require('../images/stockreceive1.png')     
                                    },
                                ]);

                            }

                            if(results.rows.item(i).new_flag == '1'){

                            }

                            if(results.rows.item(i).edit_flag == '1'){

                            }
                        }


                        if(results.rows.item(i).object_name == 'm_inv_stock_return'){

                            if(results.rows.item(i).exe_flag == '1'){

                                setsub (sub=>[...sub,
                                    {
                                        id: 'StockReturn',
                                        title: 'Stock Return',
                                        imagesource :require('../images/stockreturn1.png')      
                                    },
                                    
                                ]);

                            }

                            if(results.rows.item(i).new_flag == '1'){

                            }

                            if(results.rows.item(i).edit_flag == '1'){

                           
                           
                            }
                        }

                        if(results.rows.item(i).object_name == 'm_inv_stock_take'){

                            if(results.rows.item(i).exe_flag == '1'){

                                setsub (sub=>[...sub,
                                    {
                                        id: 'StockTake',
                                        title: 'Stock Take',
                                        imagesource :require('../images/stocktake1.png')      
                                    },
                                ]);

                            }

                            if(results.rows.item(i).new_flag == '1'){

                            }

                            if(results.rows.item(i).edit_flag == '1'){

                           
                           
                            }
                        }


                    } 

                    return 

                    
                }
                

            })


        })
      }else if(id === "Approval"){

        db.transaction(function (txn) {

            //Asset
            txn.executeSql(`SELECT * FROM cf_menu where column1='Approval' and mobile_object_type='M' order by cf_menu_seq`, 
            [], 
            (tx, results) => {

                if(results.rows.length >0){
                    console.log(results.rows.length); 
                    for (let i = 0; i < results.rows.length; ++i){   

                        console.log(results.rows.item(i).object_descs); 
                        
                        if(results.rows.item(i).object_name == 'm_appr_mr_approval'){

                            if(results.rows.item(i).exe_flag == '1'){

                                if(MR_Approver === '1'){

                                    setsub (sub=>[...sub,
                                        {
                                            id: 'MRApproval',
                                            title: 'MR Approval',
                                            imagesource :require('../images/approvalmr.png')    
                                        },
    
                                    ]);

                                }

                               

                            }

                            if(results.rows.item(i).new_flag == '1'){

                            }

                            if(results.rows.item(i).edit_flag == '1'){

                            }
                        }

                        if(results.rows.item(i).object_name == 'm_appr_pr_approval'){

                            if(results.rows.item(i).exe_flag == '1'){

                                if(PR_Approver === '1'){

                                    setsub (sub=>[...sub,
                                        {
                                            id: 'PRApproval',
                                            title: 'PR Approval',
                                            imagesource :require('../images/approvalmr.png')    
                                        },
                                    ]);
                                    
                                }

                                

                            }

                            if(results.rows.item(i).new_flag == '1'){

                            }

                            if(results.rows.item(i).edit_flag == '1'){

                            }
                        }


                    } 

                    return 

                    
                }
                

            })


        })
      }else if(id === "SyncData"){

        navigation.navigate("SyncingData")
      }else{
          return setsub ([])
      }
      
  }

  const selectedSID_two = (id)=> {

      console.log(id,"ITEM_ID_TWO")
  
        // setSelectedId (id)
        if(id === "CreateAsset"){
  
            navigation.navigate("CreateAssetScreen",{Screenname:"CreateAsset"})

        }else if(id === "AssetMaster"){
    
            navigation.navigate("FilteringAsset",{Screenname:"FilteringAsset"})

        }else if(id === "ScanAsset"){
    
            navigation.navigate("ScanAssetScreen",{Screenname:"ScanAssetScreen"})

        }
      
        //Work Order
        else if(id === "WODashboard"){

            navigation.navigate("WODashboard",{Screenname:"WODashboard"})
            
        }else if(id === "CreateWO"){

            navigation.navigate("CreateWorkOrder",{Screenname:"CreateWorkOrder"})
                
        }else if(id === "WOListing"){

            navigation.navigate("FilteringWorkOrder",{Screenname:"FilteringWorkOrder"})
                
        }else if(id === "MyWorkOrder"){
                
            navigation.navigate("WorkOrderListing",{Screenname:"MyWorkOrder"})
        }

        //Work Request
        else if(id === "CreateWR"){
                
            navigation.navigate("CreateWorkRequest",{Screenname:"CreateWorkRequest"});
            
        }else if(id === "WRListing"){
                
            navigation.navigate("FilteringWorkRequest",{Screenname:"FilteringWorkRequest"});
            
        }else if(id === "WRApprovalAll"){

            navigation.navigate("WorkRequestApprovalListing",{Screenname:"WRApprovalAll"});
            
        }else if(id === "WRApprovalMy"){
                
            navigation.navigate("WorkRequestApprovalListing",{Screenname:"WRApprovalMy"});

        }else if(id === "MyWR"){

            navigation.navigate("WorkRequestListing",{Screenname:"MyWR"});
            
        }

        //Approvval
        else if(id === "MRApproval"){

            navigation.navigate("MRApproval",{Screenname:"MRApproval"});
            
        }else if(id === "PRApproval"){

            navigation.navigate("PRApproval",{Screenname:"PRApproval"});
            
        }

        //Inventory
        else if(id === "InventoryDashboard"){

            navigation.navigate("InventoryDashboard",{Screenname:"InventoryDashboard"});
            
        }else if(id === "StockMaster"){

            navigation.navigate("StockMaster",{Screenname:"StockMaster"});
            
        }else if(id === "StockIssue"){

            navigation.navigate("StockIssue",{Screenname:"StockIssue"});
            
        }else if(id === "StockReceive"){

            navigation.navigate("StockReceive",{Screenname:"StockReceive"});
            
        }else if(id === "StockReturn"){

            navigation.navigate("StockReturn",{Screenname:"StockReturn"});
            
        }else if(id === "StockTake"){

            navigation.navigate("StockTake",{Screenname:"StockTake"});
            
        }

  }
    
  const renderItem = ({ item }) => {        
      return (

        <TouchableOpacity onPress={()=>selectedSID(item.id)}>

            <View style={styles.card_view}>

                <Image style={styles.image_ta} source={item.imagesource}/>    
                                    
                <Text style={styles.textCenter}>{item.title}</Text>

            </View>

        </TouchableOpacity>
      ); 
  };

  const ItemSeparatorView_one = () => {
    return (
        // Flat List Item Separator
        <View style={{ height: 0.5, width: '100%' }} />
    );
  };

  const ItemSeparatorView_two = () => {
        return (
            // Flat List Item Separator
            <View style={{ height: 10, width: '100%'}} />
        );
    };

  const renderItem_two = ({ item }) => {      

    return (

        <TouchableOpacity  onPress={()=> selectedSID_two(item.id)}  >
            <View style={styles.card_view_two}>
                <Image style={styles.image_two} source={item.imagesource}/>                                    
                <Text style={{marginLeft:15,fontSize:15,color: '#05375a',width:150}}>{item.title}</Text>
            </View>
        </TouchableOpacity>

    );

      
  };

  const logout =()=>{

    
    Alert.alert(
        "Logout",
        "Do you confirm to logout?",
        [
          {
            text: "No",
           // onPress: () => {delete_data},
            style: "cancel"
          },
          { text: "Yes", onPress: delete_data }
        ]
      );


    
  }

 const delete_data = (async()=>{

        

    try {

        await AsyncStorage.removeItem("Site_Cd");
        await AsyncStorage.removeItem("emp_mst_empl_id");
        await AsyncStorage.removeItem("emp_mst_name");
        await AsyncStorage.removeItem("emp_mst_title");
        await AsyncStorage.removeItem("emp_mst_homephone");
        await AsyncStorage.removeItem("emp_mst_login_id");
        await AsyncStorage.removeItem("emp_det_wr_approver");
        await AsyncStorage.removeItem("emp_det_mr_approver");
        await AsyncStorage.removeItem("emp_det_mr_limit");
        await AsyncStorage.removeItem("emp_det_pr_approver");
        await AsyncStorage.removeItem("emp_det_pr_approval_limit");
        await AsyncStorage.removeItem("emp_det_work_grp");
        await AsyncStorage.removeItem("emp_det_craft");
        await AsyncStorage.removeItem("emp_ls1_charge_rate");
        await AsyncStorage.removeItem("require_offline");

        await AsyncStorage.removeItem("dft_mst_wko_sts");
        await AsyncStorage.removeItem("dft_mst_lab_act");
        await AsyncStorage.removeItem("dft_mst_mat_act");
        await AsyncStorage.removeItem("dft_mst_con_act");
        await AsyncStorage.removeItem("dft_mst_wko_pri");
        await AsyncStorage.removeItem("dft_mst_temp_ast");
        await AsyncStorage.removeItem("dft_mst_wko_asset_no");
        await AsyncStorage.removeItem("dft_mst_wkr_asset_no");
        await AsyncStorage.removeItem("dft_mst_wo_default_cc");
        await AsyncStorage.removeItem("dft_mst_time_card_by");
        await AsyncStorage.removeItem("dft_mst_itm_resv");
        await AsyncStorage.removeItem("dft_mst_mr_approval");
        await AsyncStorage.removeItem("dft_mst_pur_email_approver");
        await AsyncStorage.removeItem("dft_mst_mtr_email_approver");
        await AsyncStorage.removeItem("dft_mst_tim_act");
        await AsyncStorage.removeItem("dft_mst_gen_inv");
        await AsyncStorage.removeItem("site_name");


    

        db.transaction((tx) => {

            //1 emp_det
            tx.executeSql(
                'DELETE FROM  emp_det',
                [],
                (tx, results) => {
                    console.log('emp_det Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('emp_det deleted successfully')

                    }else{
                        console.log('emp_det unsuccessfully')
                    }

                }
            )    

            //2 dft_mst
            tx.executeSql(
                'DELETE FROM  dft_mst',
                [],
                (tx, results) => {
                    console.log('dft_mst Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('dft_mst deleted successfully')

                    }else{
                        console.log('dft_mst unsuccessfully')
                    }

                }
            )    

            //3 costcenter
            tx.executeSql(
                'DELETE FROM  costcenter',
                [],
                (tx, results) => {
                    console.log('costcenter Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('costcenter deleted successfully')

                    }else{
                        console.log('costcenter unsuccessfully')
                    }

                }
            )    

            //4 account
            tx.executeSql(
                'DELETE FROM  account',
                [],
                (tx, results) => {
                    console.log('account Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('account deleted successfully')

                    }else{
                        console.log('account unsuccessfully')
                    }

                }
            )

            //5 faultcode
            tx.executeSql(
                'DELETE FROM  faultcode',
                [],
                (tx, results) => {
                    console.log(' faultcode Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('faultcode deleted successfully')

                    }else{
                        console.log('faultcode unsuccessfully')
                    }

                }
            )

            //6 priority
            tx.executeSql(
                'DELETE FROM  priority',
                [],
                (tx, results) => {
                    console.log('priority Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('priority deleted successfully')

                    }else{
                        console.log('priority unsuccessfully')
                    }

                }
            )

            //7 actioncode
            tx.executeSql(
                'DELETE FROM  actioncode',
                [],
                (tx, results) => {
                    console.log('actioncode Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('actioncode deleted successfully')

                    }else{
                        console.log('actioncode unsuccessfully')
                    }

                }
            )

            //8 workarea
            tx.executeSql(
                'DELETE FROM  workarea',
                [],
                (tx, results) => {
                    console.log('workarea Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('workarea deleted successfully')

                    }else{
                        console.log('workarea unsuccessfully')
                    }

                }
            )

            //9 casusecode
            tx.executeSql(
                'DELETE FROM  casusecode',
                [],
                (tx, results) => {
                    console.log('casusecode Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('casusecode deleted successfully')

                    }else{
                        console.log('casusecode unsuccessfully')
                    }

                }
            )

            //10 workclass
            tx.executeSql(
                'DELETE FROM  workclass',
                [],
                (tx, results) => {
                    console.log('workclass Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('workclass deleted successfully')

                    }else{
                        console.log('workclass unsuccessfully')
                    }

                }
            )

            //11 wrk_group
            tx.executeSql(
                'DELETE FROM  wrk_group',
                [],
                (tx, results) => {
                    console.log('wrk_group Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('wrk_group deleted successfully')

                    }else{
                        console.log('wrk_group unsuccessfully')
                    }

                }
            )

            //12 workorderstatus
            tx.executeSql(
                'DELETE FROM  workorderstatus',
                [],
                (tx, results) => {
                    console.log('workorderstatus Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('workorderstatus deleted successfully')

                    }else{
                        console.log('workorderstatus unsuccessfully')
                    }

                }
            )

            //13 worktype
            tx.executeSql(
                'DELETE FROM  worktype',
                [],
                (tx, results) => {
                    console.log('worktype Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('worktype deleted successfully')

                    }else{
                        console.log('worktype unsuccessfully')
                    }

                }
            )

            //14 assetcode
            tx.executeSql(
                'DELETE FROM  assetcode',
                [],
                (tx, results) => {
                    console.log('assetcode Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('assetcode deleted successfully')

                    }else{
                        console.log('assetcode unsuccessfully')
                    }

                }
            )    

            //15 criticalfactor
            tx.executeSql(
                'DELETE FROM  criticalfactor',
                [],
                (tx, results) => {
                    console.log('criticalfactor Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('criticalfactor deleted successfully')

                    }else{
                        console.log('criticalfactor unsuccessfully')
                    }

                }
            )    

            //16 assetgroupcode
            tx.executeSql(
                'DELETE FROM  assetgroupcode',
                [],
                (tx, results) => {
                    console.log('assetgroupcode Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('assetgroupcode deleted successfully')

                    }else{
                        console.log('assetgroupcode unsuccessfully')
                    }

                }
            )

            //17 assetlevel
            tx.executeSql(
                'DELETE FROM  assetlevel',
                [],
                (tx, results) => {
                    console.log('assetlevel Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('assetlevel deleted successfully')

                    }else{
                        console.log('assetlevel unsuccessfully')
                    }

                }
            )    

            //18 assetlocation
            tx.executeSql(
                'DELETE FROM  assetlocation',
                [],
                (tx, results) => {
                    console.log('assetlocation Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('assetlocation deleted successfully')

                    }else{
                        console.log('assetlocation unsuccessfully')
                    }

                }
            )    

            //19 assetstatus
            tx.executeSql(
                'DELETE FROM  assetstatus',
                [],
                (tx, results) => {
                    console.log('assetstatus Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('assetstatus deleted successfully')

                    }else{
                        console.log('assetstatus unsuccessfully')
                    }

                }
            )

            //20 assettype
            tx.executeSql(
                'DELETE FROM  assettype',
                [],
                (tx, results) => {
                    console.log('assettype Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('assettype deleted successfully')

                    }else{
                        console.log('assettype unsuccessfully')
                    }

                }
            )

            //21 employee
            tx.executeSql(
                'DELETE FROM  employee',
                [],
                (tx, results) => {
                    console.log('employee Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('employee deleted successfully')

                    }else{
                        console.log('employee unsuccessfully')
                    }

                }
            )

            //22 auto_numnering
            tx.executeSql(
                'DELETE FROM  auto_numnering',
                [],
                (tx, results) => {
                    console.log('auto_numnering Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('auto_numnering deleted successfully')

                    }else{
                        console.log('auto_numnering unsuccessfully')
                    }

                }
            )

            //23 wko_auto_numbering
            tx.executeSql(
                'DELETE FROM  wko_auto_numbering',
                [],
                (tx, results) => {
                    console.log('wko_auto_numbering Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('wko_auto_numbering deleted successfully')

                    }else{
                        console.log('wko_auto_numbering unsuccessfully')
                    }

                }
            )

            //24 ratingquestion
            tx.executeSql(
                'DELETE FROM  ratingquestion',
                [],
                (tx, results) => {
                    console.log('ratingquestion Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('ratingquestion deleted successfully')

                    }else{
                        console.log('ratingquestion  unsuccessfully')
                    }

                }
            )

            //25 mrstockno
            tx.executeSql(
                'DELETE FROM  mrstockno',
                [],
                (tx, results) => {
                    console.log('mrstockno Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('mrstockno deleted successfully')

                    }else{
                        console.log('mrstockno unsuccessfully')
                    }

                }
            )

            //26 hourstype
            tx.executeSql(
                'DELETE FROM  hourstype',
                [],
                (tx, results) => {
                    console.log('hourstype Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('hourstype deleted successfully')

                    }else{
                        console.log('hourstype unsuccessfully')
                    }

                }
            )    


            //27 TimeCraft
            tx.executeSql(
                'DELETE FROM  TimeCraft',
                [],
                (tx, results) => {
                    console.log('TimeCraft Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('TimeCraft deleted successfully')

                    }else{
                        console.log('TimeCraft unsuccessfully')
                    }

                }
            )    

            //28 supplier
            tx.executeSql(
                'DELETE FROM  supplier',
                [],
                (tx, results) => {
                    console.log('supplier Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('supplier deleted successfully')

                    }else{
                        console.log('supplier unsuccessfully')
                    }

                }
            )

            //29 uom
            tx.executeSql(
                'DELETE FROM  uom',
                [],
                (tx, results) => {
                    console.log('uom Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('uom deleted successfully')

                    }else{
                        console.log('uom unsuccessfully')
                    }

                }
            )       

            //30 tax_cd
            tx.executeSql(
                'DELETE FROM  tax_cd',
                [],
                (tx, results) => {
                    console.log('tax_cd Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('tax_cd deleted successfully')

                    }else{
                        console.log('tax_cd unsuccessfully')
                    }

                }
            )

            //31 approve_workorderstatus
            tx.executeSql(
                'DELETE FROM  approve_workorderstatus',
                [],
                (tx, results) => {
                    console.log('approve_workorderstatus Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('approve_workorderstatus deleted successfully')

                    }else{
                        console.log('approve_workorderstatus unsuccessfully')
                    }

                }
            )
            
            //32 wkr_auto_numbering
            tx.executeSql(
                'DELETE FROM  wkr_auto_numbering',
                [],
                (tx, results) => {
                    console.log('wkr_auto_numbering Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('wkr_auto_numbering deleted successfully')

                    }else{
                        console.log('wkr_auto_numbering unsuccessfully')
                    }

                }
            )


            //33 ast_mst
            tx.executeSql(
                'DELETE FROM  ast_mst',
                [],
                (tx, results) => {
                    console.log('ast_mst Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('ast_mst deleted successfully')

                    }else{
                        console.log('ast_mst unsuccessfully')
                    }

                }
            )

            //34 wko_mst
            tx.executeSql(
                'DELETE FROM  wko_mst',
                [],
                (tx, results) => {
                    console.log('wko_mst Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('wko_mst deleted successfully')

                    }else{
                        console.log('wko_mst unsuccessfully')
                    }

                }
            )


            //35 wko_ref
            tx.executeSql(
                'DELETE FROM  wko_ref',
                [],
                (tx, results) => {
                    console.log('wko_ref Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('wko_ref deleted successfully')

                    }else{
                        console.log('wko_ref unsuccessfully')
                    }

                }
            )


            //36 wko_det_completion
            tx.executeSql(
                'DELETE FROM  wko_det_completion',
                [],
                (tx, results) => {
                    console.log('wko_det_completion Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('wko_det_completion deleted successfully')

                    }else{
                        console.log('wko_det_completion unsuccessfully')
                    }

                }
            )


            //37 wko_det_ackowledgement
            tx.executeSql(
                'DELETE FROM  wko_det_ackowledgement',
                [],
                (tx, results) => {
                    console.log('wko_det_ackowledgement Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('wko_det_ackowledgement deleted successfully')

                    }else{
                        console.log('wko_det_ackowledgement unsuccessfully')
                    }

                }
            )

            //38 wko_isp_heard
            tx.executeSql(
                'DELETE FROM  wko_isp_heard',
                [],
                (tx, results) => {
                    console.log('wko_isp_heard Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('wko_isp_heard deleted successfully')

                    }else{
                        console.log('wko_isp_heard unsuccessfully')
                    }

                }
            )


            //39 wko_isp_details
            tx.executeSql(
                'DELETE FROM  wko_isp_details',
                [],
                (tx, results) => {
                    console.log('wko_isp_details Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('wko_isp_details deleted successfully')

                    }else{
                        console.log('wko_isp_details unsuccessfully')
                    }

                }
            )


            //40 stp_zom
            tx.executeSql(
                'DELETE FROM  stp_zom',
                [],
                (tx, results) => {
                    console.log('stp_zom Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('stp_zom deleted successfully')

                    }else{
                        console.log('stp_zom unsuccessfully')
                    }

                }
            )


            //41 wko_ls2
            tx.executeSql(
                'DELETE FROM  wko_ls2',
                [],
                (tx, results) => {
                    console.log('wko_ls2 Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('wko_ls2 deleted successfully')

                    }else{
                        console.log('wko_ls2 unsuccessfully')
                    }

                }
            )



            //42 wko_ls8_timecard
            tx.executeSql(
                'DELETE FROM  wko_ls8_timecard',
                [],
                (tx, results) => {
                    console.log('wko_ls8_timecard Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('wko_ls8_timecard deleted successfully')

                    }else{
                        console.log('wko_ls8_timecard unsuccessfully')
                    }

                }
            )


            //43 prm_ast
            tx.executeSql(
                'DELETE FROM  prm_ast',
                [],
                (tx, results) => {
                    console.log('prm_ast Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('prm_ast deleted successfully')

                    }else{
                        console.log('prm_ast unsuccessfully')
                    }

                }
            )


            //44 wko_det_response
            tx.executeSql(
                'DELETE FROM  wko_det_response',
                [],
                (tx, results) => {
                    console.log('wko_det_response Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('wko_det_response deleted successfully')

                    }else{
                        console.log('wko_det_response unsuccessfully')
                    }

                }
            )

            //45 cf_menu
            tx.executeSql(
                'DELETE FROM  cf_menu',
                [],
                (tx, results) => {
                    console.log('cf_menu Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {

                        console.log('cf_menu deleted successfully')

                    }else{
                        console.log('cf_menu unsuccessfully')
                    }

                }
            )


        });

        navigation.navigate("LoginScreen")
    
    
    }
    catch(exception) {
        alert(exception)
    }


})

  
  return (

    <View style={styles.container}>

        <SafeAreaView style={styles.View_01}>

          <View style={styles.view_tab}>

            <View style={{flexDirection: 'row'}}>

                <Image style={styles.image_ta} source={require('../images/logo.png.png')}/>

                <Text style={styles.text_stytle_ta}>{'Evantage C M M S'}</Text>

            </View>

            {/* <View >
                <AntDesign name="logout" color="#FFF" size={25} style={{marginRight:15, marginTop:4}} onPress={()=>logout()}/>
            </View> */}
              
          </View>

        </SafeAreaView>

      <SafeAreaProvider>

      <ProgressLoader
        visible={spinner}
        isModal={true}
        isHUD={true}
        hudColor={'#808080'}
        color={'#FFFFFF'}
    />
        <View style={{flexDirection:'row',margin:5}}>

           <FlatList  

              //style={{backgroundColor:"#f0f",width:150}}
              data={Datasub}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator ={false}
              showsHorizontalScrollIndicator={false}
              renderItem={renderItem}
              ItemSeparatorComponent={ItemSeparatorView_one}
              
          />


          <FlatList    
             // style={{padding:1,marginLeft:10}}            
              data={sub}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator ={false}
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={ItemSeparatorView_two}
              renderItem={renderItem_two}
              
          />
        </View>    

      </SafeAreaProvider>
      


    </View>
    
  );

}



const styles = StyleSheet.create({
  
  container: {
    flex: 1,
  },
  image_ta: {

    width: 45,
    height: 45,        
    resizeMode: 'contain',
  },


  View_01:{

    
    backgroundColor: '#42A5F5',

  },

  view_tab:{
    margin:10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  text_stytle_ta:{
    
    fontSize:15,
   fontWeight: "bold",
   marginTop:10,
   marginLeft:10,
   color:'#ffffffff'
  },

  image_two: {
      width: 30,
      height: 30,
      marginLeft:10,
      resizeMode: 'contain',
  },



  card_view: {
        
      height: 100,
      width:120,
      borderRadius: 10,
      margin:5,
      backgroundColor: '#ffffffff',
      justifyContent: 'center',
      alignItems: 'center', //Centered vertically
      
  },

  card_view_two: {
          
      height: 70,  
      width: Dimensions.get("window").width*0.6,     
      flexDirection:'row',
      borderRadius: 10,
      margin:5,
      backgroundColor: '#ffffffff',
      //justifyContent: 'left',
      alignSelf:'center',
      alignItems: 'center', //Centered vertically
      
  },

  textCenter: {
      textAlign: 'center',
      marginTop:15,
      fontSize:15,
      color: '#05375a'
  },            


});
  



export default MenuScreen;