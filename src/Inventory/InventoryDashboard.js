import React from 'react'
import {  View,StyleSheet,Pressable,Text} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appbar } from 'react-native-paper';
import Swiper from 'react-native-swiper'
import Dashboardone from './InventoryDashboardone';
import Dashboardtwo from './InventoryDashboardtwo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const InventoryDashboard = ({navigation,route}) => {

    const _goBack = () => {
        navigation.navigate('MainTabScreen');
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
                    <Text style={{fontSize:20, justifyContent:'center',textAlign:'center',color:'#fff',fontWeight: 'bold',marginLeft:15}}>Dashboard</Text> 
                </View >
            </Pressable>
        </View>
    </Appbar.Header>   

    <View style={styles.container}>

        

    <Swiper style={styles.wrapper} showsButton={false} loop={false}>

        <View style={styles.slide2}>
        
            <Dashboardtwo navigation={navigation} /> 
        </View>
    
        <View style={styles.slide1}>
            <Dashboardone navigation={navigation}/> 
        </View>
        
    
    </Swiper>



    </View>    

</SafeAreaProvider>  
  )
}

export default InventoryDashboard

const styles = StyleSheet.create({

    container: {
        flex: 1 ,
      },
      slide1: {
          flex: 1,
          margin:10
      },
      slide2: {
          flex: 1,
          margin:10
      },
  
      wrapper: {},
  
  });
  
  