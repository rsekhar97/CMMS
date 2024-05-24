import React from 'react';
import { View,Text,Dimensions } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import axios from "axios";
import ProgressLoader from 'rn-progress-loader';
import {PieChart} from "react-native-chart-kit";
var db = openDatabase({ name: 'CMMS.db' });


let Baseurl,Site_Cd,LoginID,EmpName,EmpID,EmpPhone,EmpWorkGrp,dvc_id,mst_RowID;

  const PieCharttwo =()=>{


    const width = Dimensions.get('window').width
   
    const[spinner, setspinner]= React.useState(false);

  
    var date = moment().format('MMM-YYYY');
    const [PieChartData, setPieChartData] = React.useState([]);
    

    React.useEffect(() => {  

      const fetchData = async ()=>{  

          Baseurl = await AsyncStorage.getItem('BaseURL');
          Site_Cd = await AsyncStorage.getItem('Site_Cd');
          LoginID = await AsyncStorage.getItem('emp_mst_login_id');

          Get_eport_two();
      }

      fetchData();

  },[])


  const Get_eport_two = (async()=>{

    setspinner(true)

    try{
              

      console.log("PIECHART TWO"+`${Baseurl}/get_report_status_by_current_month.php?site_cd=${(Site_Cd)}&emp_id=${(LoginID)}`)
      const response = await axios.get(`${Baseurl}/get_report_status_by_current_month.php?site_cd=${(Site_Cd)}&emp_id=${(LoginID)}`);

      //console.log(JSON.stringify(response));

      //console.log("JSON DATA : " + response.data.status)

      if (response.data.status === 'SUCCESS') 
      {
         console.log("RESPONSE TWO: "+ JSON.stringify(response.data.data.length));
        var sample=[];
        let Perctage,color,text;
          for (let i = 0; i < response.data.data.length; ++i){   
    
           // console.warn(responseJson.data[i].Perctage);   
            var a =  Number(response.data.data[i].Perctage);
           // console.warn(a); 

            if(response.data.data[i].columns === 'OPEN' ){
              color = "#52D017"
              Perctage = Number(response.data.data[i].Perctage);
              text =response.data.data[i].columns;
              sample.push({res_value:Perctage,res_color:color,res_text:text}) 
            }else{

              color = "#52D017"
              Perctage = 0;
              text ="OPEN";
              sample.push({res_value:Perctage,res_color:color,res_text:text}) 

            }
            
            
            if (response.data.data[i].columns === 'COMPLETE'){
              color = "#FDBD01"
              Perctage = Number(response.data.data[i].Perctage);
              text =response.data.data[i].columns;
              sample.push({res_value:Perctage,res_color:color,res_text:text}) 

            }else{

              color = "#FDBD01"
              Perctage = 0;
              text ="COMPLETE";
              sample.push({res_value:Perctage,res_color:color,res_text:text}) 
            }
            
            if (response.data.data[i].columns === 'CLOSE'){
              color= "#EB5406"
              Perctage = Number(response.data.data[i].Perctage);
              text =response.data.data[i].columns;

              sample.push({res_value:Perctage,res_color:color,res_text:text}) 
            }else{
              color = "#EB5406"
              Perctage = 0;
              text ="CLOSE";
              sample.push({res_value:Perctage,res_color:color,res_text:text}) 
            }
            
          }
         
          
          // console.log("add123"+JSON.stringify(sample))
           let piecode=  sample.map((item) => ({
           
             name:item.res_text,
             population:item.res_value,
             color: item.res_color,
             legendFontColor: "#7F7F7F",
             legendFontSize: 15,
                      
         }));          
         setPieChartData(piecode);

         console.log("add"+JSON.stringify(piecode))
         setspinner(false)
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
  
  const renderLegend = (text, color) => {
    return (
      <View style={{flexDirection: 'row', marginBottom: 12}}>
        <View
          style={{
            height: 18,
            width: 18,
            marginRight: 10,
            borderRadius: 4,
            backgroundColor: color || 'white',
          }}
      />
        <Text style={{color: 'red', fontSize: 16}}>{text || ''}</Text>
      </View>
    );
  };
    



  const data = [
    {
      name: "OPEN",
      population: 50,
      color: "#52D017",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "COMPLETE",
      population: 20,
      color: "#FDBD01",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    
    {
      name: "CLOSE",
      population: 30,
      color: "#EB5406",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    }
  ];
  


    return(
      <View style={{flex:1,justifyContent:'center',alignItems:'center',margin:10}}>

        <ProgressLoader
            visible={spinner}
            isModal={true} 
            isHUD={true}
            hudColor={"#808080"}
            color={"#FFFFFF"} />

         <Text style={{marginBottom:30,color:'#000'}}>Work Order Status({date})</Text>             
      
         {chartConfigs.map(chartConfig => {
          const labelStyle = {
            color: chartConfig.color(),
            marginVertical: 10,
            textAlign: 'center',
            fontSize: 16
          }
          const graphStyle = {
            marginVertical: 8,
            ...chartConfig.style
          }
        
          return (

           
            <PieChart
                data={PieChartData}
                height={300}
                width={width}
                chartConfig={chartConfig}
                backgroundColor={"#ffffff"}
                accessor="population"
                style={graphStyle}
                paddingLeft={30}
               
              />
           
            
          )

        })}
      </View>
    )
  }

  export default PieCharttwo;


  const chartConfigs = [
    
    {
      backgroundColor: '#ffffff',
      backgroundGradientFrom: '#ffffff',
      backgroundGradientTo: '#ffffff',
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
    
    },
    
    
    
    
  ]