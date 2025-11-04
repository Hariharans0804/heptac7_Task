import { View, Text } from "react-native";
import React from "react";

const ToastConfig = {
  success: ({ text1, text2, ...rest }) => (
    <View
      style={{
        zIndex: 9999,
        height: 60,
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        paddingHorizontal: 15,
        justifyContent: 'center',
        elevation: 4,
        margin: 10,
      }}
      {...rest}
    >
      <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 16 }}>{text1}</Text>
      {text2 ? <Text style={{ color: 'white', fontSize: 14 }}>{text2}</Text> : null}
    </View>
  ),
  error: ({ text1, text2, ...rest }) => (
    <View
      style={{
        zIndex: 9999,
        height: 60,
        backgroundColor: '#f44336',
        borderRadius: 8,
        paddingHorizontal: 15,
        justifyContent: 'center',
        elevation: 4,
        margin: 10,
      }}
      {...rest}
    >
      <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 16 }}>{text1}</Text>
      {text2 ? <Text style={{ color: 'white', fontSize: 14 }}>{text2}</Text> : null}
    </View>
  ),
};

export default ToastConfig;
