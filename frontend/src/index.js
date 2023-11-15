import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { CookiesProvider } from 'react-cookie';
import { UserContextProvider } from './user-store/user-context';

ReactDOM.render(
  <CookiesProvider>
    <UserContextProvider>
      <App />
    </UserContextProvider>
  </CookiesProvider>,
  document.getElementById('root')
);
