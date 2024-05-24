import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification,{Importance} from "react-native-push-notification";

import React from 'react';
import messaging from '@react-native-firebase/messaging';

import {Platform} from 'react-native';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import moment from 'moment';
import DeviceInfo from 'react-native-device-info';


import notifee from '@notifee/react-native';

let Baseurl;

const ForegroundHandler = ()=> {


  React.useEffect( () => {

    // Usesd to display notification when app is in foreground
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {

      console.log('handle in foreground:',remoteMessage);
      const {notification,messageId} =  remoteMessage;

      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      });
    
      // Required for iOS
      // See https://notifee.app/react-native/docs/ios/permissions
      await notifee.requestPermission();
    
      const notificationId = await notifee.displayNotification({
        id: messageId,
        title: notification.body,
        body:  notification.title,
        android: {
          channelId,
        },
      });
    




      // const {notification,messageId} =  remoteMessage;

      // if(Platform.OS =='ios'){

      //   PushNotificationIOS.addNotificationRequest({
      //     id:messageId,
      //     body: notification.body,
      //     title: notification.title,
          
      //   });

      // }else{

      //     PushNotification.localNotification({
      //       channelId: "fcm_fallback_notification_channel",
      //       id:messageId,
      //       title:notification.title,
      //       message: notification.body, 
      //       soundName: 'default',
      //       vibrate: true, 
      //       playSound: true, 
      //   })


      // }
      
    });

    return unsubscribe;
  }, []);






  const get_mobile_info = async (remoteMessage) => {

    Baseurl = await AsyncStorage.getItem('BaseURL');

    let device_id = DeviceInfo.getDeviceId();


    const date = new Date();
    var datetwo = moment(date).format('YYYY-MM-DD hh:mm');

    const SPLIT_URL = Baseurl.split('/');
    const SPLIT_URL2 = SPLIT_URL[SPLIT_URL.length - 1];

   

    try {
      
      const response = await axios.post( `${Baseurl}/notification_log.php?Folder=${SPLIT_URL2}&dvc_id=${device_id}&sync_time=${datetwo}`,JSON.stringify(remoteMessage));

      //console.log('response', response);
    } catch (e) {
      setspinner(false);
      alert(e);
    }
  };



  return null;
};

export default ForegroundHandler;
