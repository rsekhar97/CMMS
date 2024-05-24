import React from 'react';
import {View, Text, Dimensions} from 'react-native';
import {openDatabase} from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'react-native-axios';
import ProgressLoader from 'rn-progress-loader';
import {BarChart} from 'react-native-chart-kit';

import NetInfo from '@react-native-community/netinfo';

var db = openDatabase({name: 'CMMS.db'});

let Baseurl,
  Site_Cd,
  LoginID,
  EmpName,
  EmpID,
  EmpPhone,
  EmpWorkGrp,
  dvc_id,
  mst_RowID;

const PieChartone = () => {
  const width = Dimensions.get('window').width;

  const [spinner, setspinner] = React.useState(false);

  const [isConnected, setisConnected] = React.useState();

  const [BarChartData, setBarChartData] = React.useState([]);

  const [week, setweek] = React.useState([]);
  const [per, setper] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      Baseurl = await AsyncStorage.getItem('BaseURL');
      Site_Cd = await AsyncStorage.getItem('Site_Cd');
      LoginID = await AsyncStorage.getItem('emp_mst_login_id');
      EmpID = await AsyncStorage.getItem('emp_mst_empl_id');

      NetInfo.addEventListener(networkState => {
        console.log('Connection type - ', networkState.type);
        console.log('Is connected? - ', networkState.isConnected);
  
       if(networkState.isConnected){
          Get_eportone();
       }else{
        alert('Sorry! please check your internet connection and try again');
       }
      });

     
    };

   

    fetchData();
  }, []);

  const Get_eportone = async () => {
    

    try {
      console.log( 'PIECHART ONE: URL: ' + `${Baseurl}/get_report_wo_by_current_week.php?site_cd=${Site_Cd}&emp_id=${EmpID}`);
      const response = await axios.get( `${Baseurl}/get_report_wo_by_current_week.php?site_cd=${Site_Cd}&emp_id=${EmpID}`);

      //console.log(JSON.stringify(response));

      console.log('RESPONSE ONE: ' + JSON.stringify(response.data.data));

      if (response.data.status === 'SUCCESS') {
        //console.log(JSON.stringify(response.data.data));

        var wek = [];
        var data = [];

        for (let i = 0; i < response.data.data.length; ++i) {
          //console.log(JSON.stringify(response.data.data[i].DAY_NAME+'-'+response.data.data[i].DATEE+'/'+response.data.data[i].MONTHH));
          wek.push(response.data.data[i].DAY_NAME);
          data.push(response.data.data[i].Total);
        }

        setweek(wek);
        setper(data);
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
  //console.log(JSON.stringify(BarChartData));

  // const data = {
  //   labels: ["M", "T", "W", "T", "F", "S", "S"],
  //   datasets: [
  //     {
  //       data: [40, 45, 28, 80, 99, 43,99]
  //     }
  //   ]
  // };

  const data = {
    labels: week,
    datasets: [
      {
        data: per,
      },
    ],
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ProgressLoader
        visible={spinner}
        isModal={true}
        isHUD={true}
        hudColor={'#808080'}
        color={'#FFFFFF'}
      />

      {chartConfigs.map(chartConfig => {
        const labelStyle = {
          color: chartConfig.color(),
          marginVertical: 0,
          textAlign: 'center',
          fontSize: 16,
        };
        const graphStyle = {
          paddingRight: 0,

          ...chartConfig.style,
        };

        return (
          <BarChart
            width={Dimensions.get('window').width - 10}
            height={200}
            data={data}
            showValuesOnTopOfBars={true}
            chartConfig={chartConfig}
            style={{
              marginVertical: 0,
              borderRadius: 16,
              paddingRight: 0,
            }}
          />
        );
      })}
    </View>
  );
};

const chartConfigs = [
  {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    fillShadowGradient: '#1E90FF',
    fillShadowGradientOpacity: '5',
    color: (opacity = 1) => `rgba(33, 47, 60, ${opacity})`,
    strokeWidth: 2,
  },
];
export default PieChartone;
