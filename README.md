# NativeFirebase2Webview

Native firebase login within react-native, integrated with a SPA wrapped be a Webview.

POC for authenticating within a React Native app by the mean of Firebase Native. Once the login process is completed then try
to pass the token to an existing SPA as a single sign on process.

- Single page app source code available [here](https://github.com/amwebexpert/amw-hangman-api/blob/master/public/index.html)
  - self contained: you can Log In/Out (Firebase authentication)
  - yellow button calls a simple [backend in Nestjs](https://github.com/amwebexpert/amw-hangman-api/tree/master/src)
  - deployed on Heroku [here](https://amw-hangman-api.herokuapp.com/)
- See native firebase calls inside `App.tsx` which is a demo of:
  - native firebase authentication
  - calling the backend to create a Firebase custom token
  - transfer custom token to the SPA through the webview (using `postMessage` or `injectJavaScript`)

## References

* https://rnfirebase.io/auth/usage
* https://rnfirebase.io/reference/auth (API avec objets, interfaces et méthodes)
* https://firebase.google.com/docs/auth/web/custom-auth
* https://www.youtube.com/watch?v=WtYzHTXHBp0
* https://youtu.be/kX8by4eCyG4
* https://stackoverflow.com/a/55473818/704681
* https://auth0.com/blog/developing-real-time-apps-with-firebase-and-firestore/
* https://firebase.google.com/docs/auth/admin/verify-id-tokens#web
* https://stackoverflow.com/questions/41160221/react-native-webview-postmessage-does-not-work


