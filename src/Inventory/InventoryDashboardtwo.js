import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressLoader from 'rn-progress-loader';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'CMMS.db' });
let Baseurl, Site_cd, LoginID, EmpName, EmpID, EmpPhone, EmpWorkGrp;

const InventoryDashboardtwo = ({navigation, route}) => {
  const [spinner, setspinner] = React.useState(false);

  const [Dashboardlist, setDashboardlist] = React.useState([]);

  const _goBack = () => {
    navigation.navigate('MainTabScreen');
  };

  React.useEffect(() => {
    const fetchData = async () => {
      dvc_id = DeviceInfo.getDeviceId();

      Baseurl = await AsyncStorage.getItem('BaseURL');
      Site_cd = await AsyncStorage.getItem('Site_Cd');
      LoginID = await AsyncStorage.getItem('emp_mst_login_id');
      EmpName = await AsyncStorage.getItem('emp_mst_name');
      EmpID = await AsyncStorage.getItem('emp_mst_empl_id');
      EmpPhone = await AsyncStorage.getItem('emp_mst_homephone');
      EmpWorkGrp = await AsyncStorage.getItem('emp_det_work_grp');

      setDashboardlist([]);

      db.transaction(function(txn){           


        txn.executeSql("SELECT * FROM mrstockno where category='BELOW' ", [], (tx, { rows }) => { 

          var len = rows.raw().length;
          //setBelow_Qty(len)
          console.log('BELOW', len);

          setDashboardlist(Dashboardlist => [
            ...Dashboardlist,
            {
              name: 'Stock Below Min Quantity',
              value: len,
              color: '#FF6968',
            },
          ]);

        })


      
    });

    get_MRPending_list();
    };
    fetchData();
  }, []);

  // STEP : 1 GET Stock Master LIST API
  const get_stockMaster_list = async () => {
    setspinner(true);

    try {
      console.log( 'JSON DATA :DASHBOARD2  ' + `${Baseurl}/get_inventory_by_params_all.php?site_cd=${Site_cd}&status=ACTIVE`);

      const response = await axios.get( `${Baseurl}/get_inventory_by_params_all.php?site_cd=${Site_cd}&status=ACTIVE`);

      //console.log('JSON DATA DASHBOARD 2 : ' + response.data.data);
      if (response.data.status === 'SUCCESS') {
        //console.log(response.data.status);
        //console.log(response.data.message);
        //console.log(response.data.data)

        var count = Object.values(response.data.data).length;
       
        setDashboardlist(Dashboardlist => [
          ...Dashboardlist,
          {
            name: 'Stock Below Min Quantity',
            value: count,
            color: '#FF6968',
          },
        ]);

       
        get_MRPending_list();

        // setspinner(false);
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

  // STEP : 2 GET MR Pending for issue LIST API
  const get_MRPending_list = async () => {
    setspinner(true);

    try {
      console.log( 'JSON DATA :DASHBOARD2  ' + `${Baseurl}/get_material_requestno.php?site_cd=${Site_cd}&mtr_mst_requester=''&requester=''&Emp_ID=${EmpID}`, );

      const response = await axios.get( `${Baseurl}/get_material_requestno.php?site_cd=${Site_cd}&mtr_mst_requester=''&requester=''&Emp_ID=${EmpID}`, );
      //console.log('JSON DATA DASHBOARD 2 : ' + response.data.data);
      if (response.data.status === 'SUCCESS') {
        //console.log(response.data.status);
        //console.log(response.data.message);
        //console.log(response.data.data)

        var count = Object.values(response.data.data).length;
        setDashboardlist(Dashboardlist => [
          ...Dashboardlist,
          {
            name: 'MR Pending for issue',
            value: count,
            color: '#7752F8',
          },
        ]);

        
        get_MY_MRPending_list();

        //setspinner(false);
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

  // STEP : 2 GET MR Pending for issue LIST API
  const get_MY_MRPending_list = async () => {
    setspinner(true);

    try {
      console.log( 'JSON DATA :DASHBOARD2  ' + `${Baseurl}/get_material_requestno.php?site_cd=${Site_cd}&mtr_mst_requester=${EmpID}&requester=ME&Emp_ID=${EmpID}`, );

      const response = await axios.get( `${Baseurl}/get_material_requestno.php?site_cd=${Site_cd}&mtr_mst_requester=${EmpID}&requester=ME&Emp_ID=${EmpID}`, );
      //console.log('JSON DATA DASHBOARD 2 : ' + response.data.data);
      if (response.data.status === 'SUCCESS') {
        console.log(response.data.status);
        console.log(response.data.message);
        //console.log(response.data.data)

        var count = Object.values(response.data.data).length;
        setDashboardlist(Dashboardlist => [
          ...Dashboardlist,
          {
            name: 'My MR Pending for issue',
            value: count,
            color: '#FF8F61',
          },
        ]);

       

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
    return (
      <TouchableOpacity onPress={() => getItem(item)}>
        <View
          style={{
            flex: 1,
            height: 70,
            borderRadius: 10,
            backgroundColor: '#FFF',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <View
            style={{
              width: '30%',
              backgroundColor: item.color,
              justifyContent: 'center',
              borderTopLeftRadius: 10,
              borderBottomLeftRadius: 10,
            }}>
            <Text style={styles.textCenter2}>{item.value}</Text>
          </View>

          <View style={{flex: 1, justifyContent: 'center'}}>
            <Text style={styles.textCenter}>{item.name}</Text>
          </View>

          <View style={{justifyContent: 'center', marginRight: 20}}>
            <FontAwesome name="angle-right" color="#000" size={25} />
          </View>
        </View>
      </TouchableOpacity>
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

  //SELECT ASSET ITEM IN LIST
  const getItem = item => {
    // Function for click on an item
    //alert('Id : ' + item.name);

    if(item.name === 'Stock Below Min Quantity'){

      navigation.navigate('StockBelowMinQty', {
        Screenname: 'InventoryDashboard'
      });

    }else if(item.name === 'MR Pending for issue'){

      navigation.navigate('MRPendingIssue', {
        Screenname: 'InventoryDashboard',
        type:'MR_Pending'
      });

    }else if(item.name === 'My MR Pending for issue'){

      navigation.navigate('MRPendingIssue', {
        Screenname: 'InventoryDashboard',
        type:'MY_Pending'
      });

    }


  };

  return (
    <View style={styles.container}>

      <ProgressLoader visible={spinner} isModal={true} isHUD={true} hudColor={'#808080'} color={'#FFFFFF'} />

      <View style={{alignItems: 'center'}}>
        <Text style={{ margin: 15, color: '#2962FF', fontSize: 20, justifyContent: 'center', fontWeight: 'bold'}}> Inventory Dashboard </Text>
      </View>

      <View>
        <FlatList
          data={Dashboardlist}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeparatorView}
          renderItem={ItemView}
        />
      </View>
    </View>
  );
};
export default InventoryDashboardtwo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textCenter: {
    textAlign: 'center',
    fontWeight: 'bold',
    padding: 5,
    fontSize: 12,
    color: '#000',
  },

  textCenter2: {
    textAlign: 'center',
    fontWeight: 'bold',
    width: '100%',
    fontSize: 20,
    color: '#FFF',
  },
});
