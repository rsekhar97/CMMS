
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert'
import React from "react";



const setdanger = (Show,Title,Sub_title) => {

    console.log(Show)
    console.log(Title)
    console.log(Sub_title)
    
    return(

        <SCLAlert
            theme="danger"
            show={true}
            title={Title}
            subtitle={Sub_title}
        
        >

        <SCLAlertButton theme="danger" onPress={()=>setShow(false)}>OK</SCLAlertButton>
    </SCLAlert>



    )
}


const AlertPOPBox = {

   
    setdanger,

}


export default AlertPOPBox;