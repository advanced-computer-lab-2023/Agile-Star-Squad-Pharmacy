import React from "react";
import ReactDOM from "react-dom";

import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

import App from "./App";

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

ReactDOM.render(<App />, document.getElementById("root"));


