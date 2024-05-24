import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressLoader from 'rn-progress-loader';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import moment from 'moment';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

let Baseurl, Site_cd, LoginID, EmpName, EmpID, EmpPhone, EmpWorkGrp;

const Dashboardone = ({navigation, route}) => {
  const [spinner, setspinner] = React.useState(false);

  const [Dashboardlist, setDashboardlist] = React.useState([]);

  const _goBack = () => {
    navigation.navigate('MainTabScreen');
  };

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

    setDashboardlist([]);
    get_workorder_list();
  };

  // STEP : 1 GET MY WORK ORDER LIST API
  const get_workorder_list = async WorkOrderNO => {
    console.log('WorkOrderNO' + WorkOrderNO);

    setspinner(true);

    let userStr = {
      site_cd: Site_cd,
      wko_mst_wo_no: '',
      wko_mst_assetno: '',
      wko_mst_descs: '',
      wko_mst_originator: '',
      wko_mst_status: '',
      wko_mst_work_area: '',
      wko_mst_type: '',
      wko_mst_asset_location: '',
      wko_mst_asset_level: '',
      wko_mst_org_date: '',
      wko_mst_due_date: '',
      asset_shortdesc: '',
      wko_det_assign_to: EmpID,
      wko_det_work_type: '',
      wrk_sts_typ_cd: 'Open',
      type: '',
      emp_det_work_grp: EmpWorkGrp,
      emp_id: EmpID,
    };

    console.log('MY WORK ORDER: ' + JSON.stringify(userStr));

    try {
      const response = await axios.post( `${Baseurl}/get_workorderlist_count_dashbord.php?`, JSON.stringify(userStr), );
      //console.log('JSON DATA : ' + response.data.data);

      if (response.data.status === 'SUCCESS') {
        // console.log(response.data.status);
        // console.log(response.data.message);
        // console.log(response.data.data);

        for (let value of Object.values(response.data.data)) {
          

          setDashboardlist(Dashboardlist => [
            ...Dashboardlist,
            {
              name: 'My Work Order',
              value: value.total_Count,
              color: '#FF6968',
            },
          ]);
        }

        get_workorder_list_not_assign();
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

  // STEP : 2 GET WORK ORDER NOT ASSIGN  API
  const get_workorder_list_not_assign = async WorkOrderNO => {
    console.log('WorkOrderNO' + WorkOrderNO);

    setspinner(true);

    let userStr = {
      site_cd: Site_cd,
      wko_mst_wo_no: '',
      wko_mst_assetno: '',
      wko_mst_descs: '',
      wko_mst_originator: '',
      wko_mst_status: '',
      wko_mst_work_area: '',
      wko_mst_type: '',
      wko_mst_asset_location: '',
      wko_mst_asset_level: '',
      wko_mst_org_date: '',
      wko_mst_due_date: '',
      asset_shortdesc: '',
      wko_det_assign_to: '',
      wko_det_work_type: '',
      wrk_sts_typ_cd: '',
      type: 'assign',
      emp_det_work_grp: EmpWorkGrp,
      emp_id: EmpID,
    };

    console.log('WORK ORDER NOT ASSIGN: ' + JSON.stringify(userStr));

    try {
      const response = await axios.post( `${Baseurl}/get_workorderlist_count_dashbord.php?`, JSON.stringify(userStr), );
     // console.log('JSON DATA : ' + response.data.data);
      if (response.data.status === 'SUCCESS') {
        // console.log(response.data.status);
        // console.log(response.data.message);
        // console.log(response.data.data);

        for (let value of Object.values(response.data.data)) {
          
          setDashboardlist(Dashboardlist => [
            ...Dashboardlist,
            {
              name: 'Work Order not assign',
              value: value.total_Count,
              color: '#7752F8',
            },
          ]);
        }

        get_workorder_list_Corrective();

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

  // STEP : 3 GET WORK ORDER NOT ASSIGN  API
  const get_workorder_list_Corrective = async WorkOrderNO => {
   

    setspinner(true);

    let userStr = {
      site_cd: Site_cd,
      wko_mst_wo_no: '',
      wko_mst_assetno: '',
      wko_mst_descs: '',
      wko_mst_originator: '',
      wko_mst_status: '',
      wko_mst_work_area: '',
      wko_mst_type: 'C',
      wko_mst_asset_location: '',
      wko_mst_asset_level: '',
      wko_mst_org_date: '',
      wko_mst_due_date: '',
      asset_shortdesc: '',
      wko_det_assign_to: '',
      wko_det_work_type: '',
      wrk_sts_typ_cd: '',
      type: 'notcomplete',
      emp_det_work_grp: EmpWorkGrp,
      emp_id: EmpID,
    };

    console.log('WORK ORDER NOT ASSIGN: ' + JSON.stringify(userStr));

    try {
      const response = await axios.post( `${Baseurl}/get_workorderlist_count_dashbord.php?`, JSON.stringify(userStr), );
      //console.log('JSON DATA : ' + response.data.data);
      if (response.data.status === 'SUCCESS') {
        // console.log(response.data.status);
        // console.log(response.data.message);
        // console.log(response.data.data);

        for (let value of Object.values(response.data.data)) {
          
          setDashboardlist(Dashboardlist => [
            ...Dashboardlist,
            {
              name: 'Corrective Work order not complete',
              value: value.total_Count,
              color: '#FF8F61',
            },
          ]);
        }

        get_workorder_list_preventive_current_month();
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

  // STEP : 4 GET WORK ORDER NOT ASSIGN  API
  const get_workorder_list_preventive_current_month = async WorkOrderNO => {
    

    const now = new Date();

    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    var dateone = moment(firstDay).format('YYYY-MM-DD hh:mm');

    console.log(firstDay); // 👉️ Sat Oct 01 2022 ...

    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    var datetwo = moment(lastDay).format('YYYY-MM-DD hh:mm');
    console.log(lastDay); // 👉️ Mon Oct 31 2022 ...

    setspinner(true);

    let userStr = {
      site_cd: Site_cd,
      wko_mst_wo_no: '',
      wko_mst_assetno: '',
      wko_mst_descs: '',
      wko_mst_originator: '',
      wko_mst_status: '',
      wko_mst_work_area: '',
      wko_mst_type: 'P',
      wko_mst_asset_location: '',
      wko_mst_asset_level: '',
      wko_mst_org_date: dateone,
      wko_mst_due_date: datetwo,
      asset_shortdesc: '',
      wko_det_assign_to: '',
      wko_det_work_type: '',
      wrk_sts_typ_cd: '',
      type: 'notcomplete',
      emp_det_work_grp: EmpWorkGrp,
      emp_id: EmpID,
    };

    console.log('preventive_current_month: ' + JSON.stringify(userStr));

    try {
      const response = await axios.post( `${Baseurl}/get_workorderlist_count_dashbord.php?`, JSON.stringify(userStr), );
      //console.log('JSON DATA : ' + response.data.data);
      if (response.data.status === 'SUCCESS') {
        // console.log(response.data.status);
        // console.log(response.data.message);
        // console.log(response.data.data);

        for (let value of Object.values(response.data.data)) {
         
          setDashboardlist(Dashboardlist => [
            ...Dashboardlist,
            {
              name: 'PM Current month',
              value: value.total_Count,
              color: '#33CF9D',
            },
          ]);
        }

        get_workorder_list_preventive_next_month();
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

  // STEP : 5 GET WORK ORDER NOT ASSIGN  API
  const get_workorder_list_preventive_next_month = async WorkOrderNO => {
    

    const now = new Date();

    const firstDay = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    var dateone = moment(firstDay).format('YYYY-MM-DD hh:mm');

    console.log(dateone); // 👉️ Sat Oct 01 2022 ...

    const lastDay = new Date(now.getFullYear(), now.getMonth() + 2, 0);
    var datetwo = moment(lastDay).format('YYYY-MM-DD hh:mm');
    console.log(lastDay); // 👉️ Mon Oct 31 2022 ...

    setspinner(true);

    let userStr = {
      site_cd: Site_cd,
      wko_mst_wo_no: '',
      wko_mst_assetno: '',
      wko_mst_descs: '',
      wko_mst_originator: '',
      wko_mst_status: '',
      wko_mst_work_area: '',
      wko_mst_type: 'P',
      wko_mst_asset_location: '',
      wko_mst_asset_level: '',
      wko_mst_org_date: dateone,
      wko_mst_due_date: datetwo,
      asset_shortdesc: '',
      wko_det_assign_to: '',
      wko_det_work_type: '',
      wrk_sts_typ_cd: '',
      type: 'notcomplete',
      emp_det_work_grp: EmpWorkGrp,
      emp_id: EmpID,
    };

    console.log('preventive_next_month: ' + JSON.stringify(userStr));

    try {
      const response = await axios.post( `${Baseurl}/get_workorderlist_count_dashbord.php?`, JSON.stringify(userStr), );
     
      if (response.data.status === 'SUCCESS') {
        // console.log(response.data.status);
        // console.log(response.data.message);
        // console.log(response.data.data);

        for (let value of Object.values(response.data.data)) {
         
          setDashboardlist(Dashboardlist => [
            ...Dashboardlist,
            {
              name: 'PM Next month',
              value: value.total_Count,
              color: '#8D5D83',
            },
          ]);
        }

        get_workorder_list_preventive_previous_month();

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

  // STEP : 6 GET WORK ORDER NOT ASSIGN  API
  const get_workorder_list_preventive_previous_month = async WorkOrderNO => {
    console.log('WorkOrderNO' + WorkOrderNO);

    const now = new Date();

    const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    var dateone = moment(firstDay).format('YYYY-MM-DD hh:mm');

    console.log(dateone); // 👉️ Sat Oct 01 2022 ...

    const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);
    var datetwo = moment(lastDay).format('YYYY-MM-DD hh:mm');
    console.log(lastDay); // 👉️ Mon Oct 31 2022 ...

    setspinner(true);

    let userStr = {
      site_cd: Site_cd,
      wko_mst_wo_no: '',
      wko_mst_assetno: '',
      wko_mst_descs: '',
      wko_mst_originator: '',
      wko_mst_status: '',
      wko_mst_work_area: '',
      wko_mst_type: 'P',
      wko_mst_asset_location: '',
      wko_mst_asset_level: '',
      wko_mst_org_date: dateone,
      wko_mst_due_date: datetwo,
      asset_shortdesc: '',
      wko_det_assign_to: '',
      wko_det_work_type: '',
      wrk_sts_typ_cd: '',
      type: 'notcomplete',
      emp_det_work_grp: EmpWorkGrp,
      emp_id: EmpID,
    };

    console.log('preventive_next_month: ' + JSON.stringify(userStr));

    try {
      const response = await axios.post( `${Baseurl}/get_workorderlist_count_dashbord.php?`, JSON.stringify(userStr), );
      console.log('JSON DATA : ' + response.data.data);
      if (response.data.status === 'SUCCESS') {
        // console.log(response.data.status);
        // console.log(response.data.message);
        // console.log(response.data.data);

        for (let value of Object.values(response.data.data)) {
         // console.log(value);
          setDashboardlist(Dashboardlist => [
            ...Dashboardlist,
            {
              name: 'PM Previous month',
              value: value.total_Count,
              color: '#FB7572',
            },
          ]);
        }

        //get_workorder_list_preventive_next_month();

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
          width: '100%',
          backgroundColor: '#C8C8C8',
        }}
      />
    );
  };

  //SELECT ASSET ITEM IN LIST
  const getItem = item => {
    // Function for click on an item

    switch (item.name) {
      case 'My Work Order':
        // alert('Id : ' + item.name );

        navigation.navigate('WorkOrderListing', {
          Screenname: 'WoDashboard',
          type: 'My_WO',
        });

        break;

      case 'Work Order not assign':
        //alert('Id : ' + item.name );

        navigation.navigate('WorkOrderListing', {
          Screenname: 'WoDashboard',
          type: 'assign',
        });

        break;

      case 'Corrective Work order not complete':
        //alert('Id : ' + item.name );

        navigation.navigate('WorkOrderListing', {
          Screenname: 'WoDashboard',
          type: 'notcomplete',
          workordercategory: 'C',
          month: '',
        });

        break;

      case 'PM Current month':
        //alert('Id : ' + item.name );

        navigation.navigate('WorkOrderListing', {
          Screenname: 'WoDashboard',
          type: 'pmcurrent',
          workordercategory: 'P',
          month: 'current',
        });
        break;

      case 'PM Next month':
        //alert('Id : ' + item.name );

        navigation.navigate('WorkOrderListing', {
          Screenname: 'WoDashboard',
          type: 'pmnext',
          workordercategory: 'P',
          month: 'next',
        });
        break;

      case 'PM Previous month':
        //alert('Id : ' + item.name );

        navigation.navigate('WorkOrderListing', {
          Screenname: 'WoDashboard',
          type: 'pmprevious',
          workordercategory: 'P',
          month: 'previous',
        });
        break;
    }
  };

  return (
    <View style={styles.container}>
      <ProgressLoader
        visible={spinner}
        isModal={true}
        isHUD={true}
        hudColor={'#808080'}
        color={'#FFFFFF'}
      />

      <View style={{alignItems: 'center'}}>
        <Text
          style={{
            margin: 15,
            color: '#2962FF',
            fontSize: 20,
            justifyContent: 'center',
            fontWeight: 'bold',
          }}>
          Work Order Dashboard
        </Text>
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
export default Dashboardone;

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
