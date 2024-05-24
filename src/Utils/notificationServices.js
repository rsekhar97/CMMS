import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import NavigationServices from './NavigationServices';
import NetInfo from "@react-native-community/netinfo";


import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification,{Importance} from "react-native-push-notification";
import {Platform} from 'react-native';
import { Alert } from 'react-native';


export async function requestUserPermission(){
  
 
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    getFcmToken();
  }
}


const getFcmToken = async()=>{

    let checkToken =  await AsyncStorage.getItem('fcmToken')
    console.log(checkToken,"the old token")

    if(!checkToken){
        try{

          // await messaging().registerDeviceForRemoteMessages();
          const fcmToken = await messaging().getToken();
          if(!!fcmToken){
              console.log(fcmToken,"the new genrated token");
              await AsyncStorage.setItem('fcmToken',fcmToken)
          }

        }catch(error){
            console.log(error, "error rasied in fcmTocken")
            alert('error rasied in fcmTocken',error)
        }
    }
}


export  async function notificationListeners(){


 

  messaging().onNotificationOpenedApp(remoteMessage => {

      console.log('Notification caused app to open from background state:',remoteMessage,);

      NavigationServices.navigate('Notification');
      
      
  });


  messaging().getInitialNotification().then(remoteMessage => {

    if (remoteMessage) {
      console.log( 'Notification caused app to open from quit state:', remoteMessage);
    }
          
  });

 

}


// export const notificationLister =async()=>{


  


//     messaging().onMessage(async remoteMessage=>{

//       console.log('A new FCM message arrived', remoteMessage);

//       const {notification,messageId} =  remoteMessage;

//       if(Platform.OS =='ios'){

//         PushNotificationIOS.addNotificationRequest({
//           id:messageId,
//           body: notification.body,
//           title: notification.title,
          
//         });

//       }else{

//           PushNotification.localNotification({
//             channelId: "fcm_fallback_notification_channel",
//             id:messageId,
//             title:notification.title,
//             message: notification.body, 
//             soundName: 'default',
//             vibrate: true, 
//             playSound: true, 
//         })


//       }

//       //AlertPOPBox.setdanger(true,'f','fff');

//       Alert.alert('Opened push notification',notification.title, notification.body);

//     })
  
   
//     messaging().onNotificationOpenedApp(remoteMessage => {

//         console.log('Notification caused app to open from background state:',remoteMessage.notification,);

//         NavigationServices.navigate('Notification');
        
        
//     });

//     // Check whether an initial notification is available
//     messaging().getInitialNotification().then(remoteMessage => {

//       if (remoteMessage) {
//         console.log( 'Notification caused app to open from quit state:', remoteMessage.notification);

//         NavigationServices.navigate('Notification');
        
//       }
      
//     });

//     messaging().setBackgroundMessageHandler(async remoteMessage => {
//       //This handler is called when notification is delivered in the background.
//       //Handle the background notification here
//       console.log('Message handled in the background!', remoteMessage);
//     });
  

// }




