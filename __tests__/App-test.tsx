import 'react-native';
import React from 'react';
import App from '../App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

const firebasemock = require('firebase-mock');
const mockAuth = new firebasemock.MockAuthentication();

jest.mock('@react-native-firebase/auth', () => () => mockAuth);
jest.useFakeTimers();

it('renders correctly', () => {
  renderer.create(<App />);
});
