import { View, Text } from 'react-native'
import React from 'react'

import DateTimePicker from 'react-native-modal-datetime-picker';

const Date_popup = ({value}) => {

    const [isVisible, setVisible] = React.useState(false);


    setVisible({...isVisible,isVisible:value});


    const handleConfirm = date => {


        setVisible(!isVisible)

        return date;

        
    }

    const hideDatePicker = () => {
        setVisible(false);
      };



  return (
    <View>
      <DateTimePicker
          isVisible={isVisible}
          mode="date"
          locale="en_GB"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
    </View>
  )
}

export default Date_popup