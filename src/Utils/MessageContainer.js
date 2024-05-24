import React from 'react';
import { View, Text } from 'react-native';
import { Avatar, Bubble, SystemMessage, Message, MessageText } from 'react-native-gifted-chat';

import Video from 'react-native-video-enhanced';

export const renderAvatar = (props) => (
  <Avatar
    {...props}
    //containerStyle={{ left: { borderWidth: 3, borderColor: 'red' }, right: {} }}
    imageStyle={{ left: { borderWidth: 3, borderColor: 'blue', }, right: {} }}
  />
);

export const renderBubble = (props) => (
  <Bubble
    {...props}
     //renderTime={() => <Text></Text>}
     renderTicks={() => <Text></Text>}
    // containerStyle={{
    //   left: { borderColor: 'teal', borderWidth: 1,margin:10 },
    //   right: {},
    // }}
    wrapperStyle={{
      left: {marginBottom:40 },
      right: {marginBottom:40},
    }}
    // bottomContainerStyle={{
    //   left: { borderColor: 'purple', borderWidth: 4,marginBottom:30 },
    //   right: {},
    // }}
     //tickStyle={{}}
     usernameStyle={{fontWeight: 'bold'}}
    // containerToNextStyle={{
    //   left: { borderColor: 'navy', borderWidth: 4 },
    //   right: {},
    // }}
   
    // containerToPreviousStyle={{
    //   left: { borderColor: 'mediumorchid', borderWidth: 4 },
    //   right: {},
    // }}
  />
);

export const renderSystemMessage = (props) => (
  <SystemMessage
    {...props}
    containerStyle={{ backgroundColor: 'pink' }}
    wrapperStyle={{ borderWidth: 10, borderColor: 'white' }}
    textStyle={{ color: 'crimson', fontWeight: '900' }}
  />
);

export const renderVideoMessage = (props) => (



  <Video

  {...conslog.log(props)}
      source={{ uri: videoUri }}
      resizeMode="contain"
      style={{ width: 200, height: 150 }}
      controls={true}
    />
);

export const renderMessage = (props) => (
  <Message
    {...props}
    // renderDay={() => <Text>Date</Text>}
    containerStyle={{
      left: { backgroundColor: 'lime' },
      right: { backgroundColor: 'gold' },
    }}
  />
);

export const renderMessageText = (props) => (
  <MessageText
    {...props}
    // containerStyle={{

    //   left: { backgroundColor: 'yellow' },
    //   //right: { backgroundColor: 'purple' },
    // }}
    // textStyle={{
    //   left: { color: 'red' },
    //   right: { color: 'green' },
    // }}
    // linkStyle={{
    //   left: { color: 'orange' },
    //   right: { color: 'orange' },
    // }}
    customTextStyle={{ fontSize: 20, lineHeight: 24 }}
  />
);

export const renderCustomView = ({ user }) => (
  <View style={{ minHeight: 20,alignItems: 'center' }}>
    <Text>
      Current user:
      {user.name}
    </Text>
    <Text>From CustomView</Text>
  </View>
);