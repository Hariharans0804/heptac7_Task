import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigations/RootNavigator';
import Toast from 'react-native-toast-message';
import ToastConfig from './src/utils';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <RootNavigator />
           <Toast config={ToastConfig} />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView >
  )
}

export default App

const styles = StyleSheet.create({})