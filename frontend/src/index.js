import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { CookiesProvider } from 'react-cookie';
import { UserContextProvider } from './user-store/user-context';

import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { ToastContainer } from 'react-toastify';

const firebaseConfig = {
  apiKey: "AIzaSyB_EEjUYhdGRri3Zi2rfSv0r98uPcXnyJg",
  authDomain: "clinic-e378c.firebaseapp.com",
  projectId: "clinic-e378c",
  storageBucket: "clinic-e378c.appspot.com",
  messagingSenderId: "1084549128738",
  appId: "1:1084549128738:web:10d353eda8ceccdd57e07b"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export default storage;

ReactDOM.render(
  <CookiesProvider>
    <UserContextProvider>
      <App />
      <ToastContainer/>
    </UserContextProvider>
  </CookiesProvider>,
  document.getElementById('root')
);
