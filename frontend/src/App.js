import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import PharmacyHome from './pharmacy/pages/pharmacyHome';
import LandingPage from './shared/pages/landingPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} exact />
          <Route path="/pharmacyHome" element={<PharmacyHome />} exact />
          {/*redirect to landing page if wrong url*/}
          <Route path="*" element={<Navigate to="/" />} />{' '}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
