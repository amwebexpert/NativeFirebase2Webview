import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { WebView } from 'react-native-webview';
import { WebViewMessageEvent, WebViewNavigation } from 'react-native-webview/lib/WebViewTypes';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

import Spinner from './components/Spinner/Index';
import { Button } from 'react-native-paper';

export default function App() {
  const webviewRef = React.useRef<WebView>(null);
  const [user, setUser] = React.useState<FirebaseAuthTypes.User | null>(null);
  const serverBaseUrl = 'https://amw-hangman-api.herokuapp.com'; // hardcoded but this would normally be a config

  React.useEffect(() => {
    const subscriber = auth().onAuthStateChanged(user => {
      setUser(user);

      // https://stackoverflow.com/a/55473818/704681
      user?.getIdToken(/* forceRefresh */ true)
        .then(token => console.log('token ', token));
    });

    return subscriber; // unsubscribe on unmount
  }, []);

  function createUser() {
    console.log('calling createUserWithEmailAndPassword');
    auth()
      .createUserWithEmailAndPassword('jane.doe@example.com', 'SuperSecretPassword!')
      .then(() => console.log('User account created & signed in!'))
      .catch(console.error);
  }

  function signIn() {
    console.log('calling signInWithEmailAndPassword');
    auth()
      .signInWithEmailAndPassword('jane.doe@example.com', 'SuperSecretPassword!')
      .then(() => console.log('User signed in!'))
      .catch(console.error);
  }

  function signOut() {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  }

  async function authenticateWebViewFromNativeSide() {
    if (!user) {
      // TODO display error, warn user
      return;
    }

    const token = await user.getIdToken(true);
    const createCustomTokenApiURL = `${serverBaseUrl}/api/v1/token/createCustomToken`;

    const response = await fetch(createCustomTokenApiURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });

    const { customToken } = await response.json();
    console.log('customToken', customToken);
    postMessageToWebapp('customToken', customToken);
  }

  async function onMessage(event: WebViewMessageEvent) {
    const { type, data } = JSON.parse(event.nativeEvent.data);
    console.log(`NATIVE: receiving [${type}]`, data);
  }

  async function postMessageToWebapp(type: string, data: string) {
    if (webviewRef.current) {
      const message = JSON.stringify({ type, data });
      webviewRef.current.injectJavaScript(`window.postMessage(${message}, '${serverBaseUrl}'); true;`);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.userMetadata}>
        <Text>React Native Firebase</Text>
        <Text>{user?.email}</Text>
        {!user && <Button mode="contained" onPress={signIn}>Sign In</Button>}
        {user && <Button mode="contained" onPress={signOut}>Sign Out</Button>}
        <Button mode="contained" onPress={authenticateWebViewFromNativeSide}>Native 2 Webview</Button>
      </View>
      <View style={styles.webView}>
        <WebView
          ref={webviewRef}
          onMessage={onMessage}
          source={{ uri: serverBaseUrl }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          sharedCookiesEnabled={false}
          originWhitelist={[serverBaseUrl]}
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
