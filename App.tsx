import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { WebView } from 'react-native-webview';
import { WebViewMessageEvent, WebViewNavigation } from 'react-native-webview/lib/WebViewTypes';

import Spinner from './components/Spinner/Index';
import { Button } from 'react-native-paper';

export default function App() {
  const webviewRef = React.useRef<WebView>(null);
  const [fullName, setFullName] = React.useState('');
  const [metadata, setMetadata] = React.useState('');

  function onNavigationStateChange(navState: WebViewNavigation) {
    console.log('==> ${navState.url}' + navState.loading ? '...' : '.');
  }

  async function onMessage(event: WebViewMessageEvent) {
    const { type, data } = JSON.parse(event.nativeEvent.data);
    console.log(`NATIVE: receiving [${type}]`, data);
  }

  async function postMessageToWebapp(type: string, data: string) {
    if (!webviewRef.current) {
      return;
    }

    const message = JSON.stringify({ type, data });
    webviewRef.current.injectJavaScript(`window.postMessage(${message}, '*'); true;`);
  }

  return (
    <View style={styles.container}>
      <View style={styles.userMetadata}>
        <Text>{fullName}</Text>
        <Text>{metadata}</Text>
        <Button mode="contained" onPress={() => postMessageToWebapp('getValidAccessToken', '')}>get Valid Token</Button>
      </View>
      <View style={styles.webView}>
        <WebView
          ref={webviewRef}
          onMessage={onMessage}
          source={{
            uri: 'https://amwebexpert.github.io/auth0-demo-react',
            headers: { 'spa-id': 'poc-react-native-webview-oauth2' },
          }}
          onNavigationStateChange={onNavigationStateChange}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          sharedCookiesEnabled={true}
          originWhitelist={["*"]}
          scalesPageToFit={true}
          startInLoadingState={true}
          mixedContentMode={"always"}
          allowsInlineMediaPlayback={true}
          allowsFullscreenVideo={true}
          allowsBackForwardNavigationGestures={true}
          allowsLinkPreview={false}
          cacheEnabled={false}
          cacheMode='LOAD_NO_CACHE'
          renderLoading={() => (<Spinner />)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webView: {
    flex: 1,
    padding: 10,
    borderWidth: 8,
    borderColor: 'green',
  },
  userMetadata: {
    borderWidth: 8,
    borderColor: 'lightblue',
    padding: 30,
    marginTop: 30,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
