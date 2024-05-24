import React, { useEffect } from 'react';
import { NavigationContainer,DefaultTheme as NavigationDefaultTheme,DarkTheme as NavigationDarkTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Test from './src/Test';

import SplashScreen from './src/SplashScreen';
import WebServices from './src/WebServices';
import LoginScreen from './src/LoginScreen';
import MainTabScreen from './src/MainTabScreen';

//Asset 
import CreateAssetScreen from './src/Asset/CreateAssetScreen';
import FilteringAsset from './src/Asset/FilteringAsset';
import SacnAssetScreen from './src/Asset/ScanAssetScreen';
import ScanAssetMaster from './src/Asset/ScanAssetMaster';
import AssetListing from './src/Asset/AssetListing';
import AssetSpareList from './src/Asset/AssetSpareList';

//WorkRequest
import FilteringWorkRequest from './src/WorkRequest/FilteringWorkRequest';
import WorkRequestListing from './src/WorkRequest/WorkRequestListing';
import WorkRequestApprovalListing from './src/WorkRequest/WorkRequestApprovalListing';
import CreateWorkRequest from './src/WorkRequest/CreateWorkRequest'
import CreateWorkRequestApproval from './src/WorkRequest/CreateWorkRequestApproval';

//WorkOrder
import WODashboard from './src/WorkOrder/WODashboard';
import FilteringWorkOrder from './src/WorkOrder/FilteringWorkOrder';
import WorkOrderListing from './src/WorkOrder/WorkOrderListing';
import CreateWorkOrder from './src/WorkOrder/CreateWorkOrder';

//WORK ORDER MORE OPTION
import Response from './src/WorkOrder/Response';
import Chargeable from './src/WorkOrder/Chargeable';
import Ackowledgement from './src/WorkOrder/Ackowledgement';
import WorkOrderCompletion from './src/WorkOrder/WorkOrderCompletion';
import ContractService from './src/WorkOrder/ContractService';
import MaterialRequest from './src/WorkOrder/MaterialRequest';
import CheckListHeader from './src/WorkOrder/CheckListHeader';
import ChekListDetalisupdate from './src/WorkOrder/CheckListDetalisupdate';
import TimeCard from './src/WorkOrder/TimeCard';
import AssetDowntime from './src/WorkOrder/AssetDowntime';
import PurchasingInfo from './src/WorkOrder/PurchasingInfo';
import AssignHistory from './src/WorkOrder/AssignHistory';
import Chat from './src/WorkOrder/Chat';
import SubWorkOrder from './src/WorkOrder/SubWorkOrder';

//Inventory
import InventoryDashboard from './src/Inventory/InventoryDashboard';
import StockMaster from './src/Inventory/StockMaster';
import StockMasterDetails from './src/Inventory/StockMasterDetails';
import StockMasterLocation from './src/Inventory/StockMasterLocation';
import StockIssue from './src/Inventory/StockIssue';
import StockIssueHistory from './src/Inventory/StockIssueHistory';
import StockReceive from './src/Inventory/StockReceive';
import StockReturn from './src/Inventory/StockReturn';
import StockTake from './src/Inventory/StockTake';
import StockTakeDetails from './src/Inventory/StockTakeDetails';
import StockBelowMinQty from './src/Inventory/StockBelowMinQty';
import MRPendingIssue from './src/Inventory/MRPendingIssue';
import MRPendingIssueDetails from './src/Inventory/MRPendingIssueDetails';

import MRApproval from './src/Approval/MRApproval';
import MRApprovalDetails from './src/Approval/MRApprovalDetails';
import PRApproval from './src/Approval/PRApproval';
import PRApprovalDetails from './src/Approval/PRApprovalDetails';

import SyncingData from './src/SyncingData/SyncingData';


import {requestUserPermission,notificationListeners} from './src/Utils/notificationServices';
import ForegroundHandler from './src/Utils/ForegroundHandler';
import { Platform } from 'react-native';
import NavigationServices from './src/Utils/NavigationServices';
import NotificationScreen from './src/NotificationScreen';
import NotificationDetails from './src/NotificationDetails';

import {checkNotifications} from 'react-native-permissions';

const Stack = createStackNavigator()

const App = () => {

  React.useEffect(()=>{

    // checkNotifications().then(({status, settings}) => {

    //   console.log('status',status);

    //   if(!!status && status == 'granted'){

        
    //   }

    // });


    requestUserPermission();
    notificationListeners();

   

  },[])
  return (

    <NavigationContainer ref={(ref)=> NavigationServices.setTopLevelNavigator(ref)} >
      <ForegroundHandler/>
      <Stack.Navigator initialRouteName='SplashScreen'>

        <Stack.Screen
          name='Test'
          component={Test}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>

        <Stack.Screen
          name='SplashScreen'
          component={SplashScreen}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>

        <Stack.Screen
          name='WebServices'
          component={WebServices}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>

        <Stack.Screen
          name='LoginScreen'
          component={LoginScreen}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>

        <Stack.Screen
          name='MainTabScreen'
          component={MainTabScreen}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>

        {/* Asset */}
        <Stack.Screen
          name='CreateAssetScreen'
          component={CreateAssetScreen}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>

        <Stack.Screen
          name='ScanAssetScreen'
          component={SacnAssetScreen}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>

        <Stack.Screen
          name='ScanAssetMaster'
          component={ScanAssetMaster}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>

        <Stack.Screen
          name='FilteringAsset'
          component={FilteringAsset}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>

        <Stack.Screen
          name='AssetListing'
          component={AssetListing}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>

        <Stack.Screen
          name='AssetSpareList'
          component={AssetSpareList}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>

        {/* Work Request */}
        <Stack.Screen
          name='FilteringWorkRequest'
          component={FilteringWorkRequest}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>

        <Stack.Screen
          name='WorkRequestListing'
          component={WorkRequestListing}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>

        <Stack.Screen
          name='WorkRequestApprovalListing'
          component={WorkRequestApprovalListing}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>

        <Stack.Screen
          name='CreateWorkRequest'
          component={CreateWorkRequest}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>

        <Stack.Screen
          name='CreateWorkRequestApproval'
          component={CreateWorkRequestApproval}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>


        {/* Work Order */}
        <Stack.Screen
          name='WODashboard'
          component={WODashboard}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>

        <Stack.Screen
          name='FilteringWorkOrder'
          component={FilteringWorkOrder}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>

        <Stack.Screen
          name='WorkOrderListing'
          component={WorkOrderListing}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>

        <Stack.Screen
          name='CreateWorkOrder'
          component={CreateWorkOrder}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>

        <Stack.Screen
          name='AssignHistory'
          component={AssignHistory}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>


        {/* MORE WORKORDER OPTIONS */}

        <Stack.Screen
          name='Response'
          component={Response}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>

        <Stack.Screen
          name='Chargeable'
          component={Chargeable}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>

        <Stack.Screen
          name='Ackowledgement'
          component={Ackowledgement}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>

        <Stack.Screen
          name='WorkOrderCompletion'
          component={WorkOrderCompletion}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>

        <Stack.Screen
          name='ContractService'
          component={ContractService}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>

        <Stack.Screen
          name='MaterialRequest'
          component={MaterialRequest}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>

        <Stack.Screen
          name='CheckListHeader'
          component={CheckListHeader}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>


        <Stack.Screen
          name='ChekListDetalisupdate'
          component={ChekListDetalisupdate}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>


        <Stack.Screen
          name='TimeCard'
          component={TimeCard}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>


        <Stack.Screen
          name='AssetDowntime'
          component={AssetDowntime}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>

        <Stack.Screen
          name='PurchasingInfo'
          component={PurchasingInfo}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>

        <Stack.Screen
          name='SubWorkOrder'
          component={SubWorkOrder}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>

        <Stack.Screen
          name='Chat'
          component={Chat}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>

      
        <Stack.Screen
          name='MRApproval'
          component={MRApproval}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>

        <Stack.Screen
          name='MRApprovalDetails'
          component={MRApprovalDetails}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>


        <Stack.Screen
          name='PRApproval'
          component={PRApproval}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>


        <Stack.Screen
          name='PRApprovalDetails'
          component={PRApprovalDetails}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>

        {/* Inventory */}
        <Stack.Screen
          name='InventoryDashboard'
          component={InventoryDashboard}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>


        <Stack.Screen
          name='StockMaster'
          component={StockMaster}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>

        <Stack.Screen
          name='StockMasterDetails'
          component={StockMasterDetails}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>

        <Stack.Screen
          name='StockMasterLocation'
          component={StockMasterLocation}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>
       

        <Stack.Screen
          name='StockIssue'
          component={StockIssue}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>

        <Stack.Screen
          name='StockIssueHistory'
          component={StockIssueHistory}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>
       

        <Stack.Screen
          name='StockReceive'
          component={StockReceive}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>
       

        <Stack.Screen
          name='StockReturn'
          component={StockReturn}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>
       

        <Stack.Screen
          name='StockTake'
          component={StockTake}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>

         <Stack.Screen
          name='StockTakeDetails'
          component={StockTakeDetails}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>

        <Stack.Screen
          name='StockBelowMinQty'
          component={StockBelowMinQty}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>

        <Stack.Screen
          name='MRPendingIssue'
          component={MRPendingIssue}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>

        <Stack.Screen
          name='MRPendingIssueDetails'
          component={MRPendingIssueDetails}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>
       

        <Stack.Screen
          name='SyncingData'
          component={SyncingData}
          options={{headerShown: false,gestureEnabled:false}}>
        </Stack.Screen>


        <Stack.Screen
          name='Notification'
          component={NotificationScreen}
          options={{headerShown: false}}>
        </Stack.Screen>

        <Stack.Screen
          name='NotificationDetails'
          component={NotificationDetails}
          options={{headerShown: false}}>
        </Stack.Screen>


      </Stack.Navigator>

    </NavigationContainer>
  
  )
}

export default App