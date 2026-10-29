import React from 'react';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';

const GAME_URL = process.env.EXPO_PUBLIC_GAME_URL || 'http://10.0.2.2:3000/game/';

export default function App() {
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar hidden />
      <WebView
        source={{ uri: GAME_URL }}
        style={styles.web}
        javaScriptEnabled
        domStorageEnabled
        allowsInlineMediaPlayback
        originWhitelist={['https://*', 'http://*']}
        mixedContentMode="never"
        onError={() => {}}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#101720' },
  web: { flex: 1, backgroundColor: '#101720' }
});
