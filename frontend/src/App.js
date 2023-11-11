import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import LandingPage from './shared/pages/LandingPage';
import PharmacyHome from './pharmacy/pages/PharmacyHome';
import AddMedicineForm from './pharmacist/pages/AddMedicine';
import PatientRegisterForm from './patient/pages/PatientRegister';
import PharmacistRequest from './pharmacist/pages/PharmacistRequest';
import AdminHome from './admin/Home/AdminHome';
import ManageUsersPage from './admin/ManageUsers/ManageUsersPage';
import CartPage from './patient/pages/cart/CartPage';
import { CartContextProvider } from './patient/pages/cart/Cart';
import "./App.css";

function App() {
  return (
    <div className="App">
      <CartContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} exact />
          <Route path="/pharmacy/home" element={<PharmacyHome />} exact />
          <Route
            path="/pharmacist/register"
            element={<PharmacistRequest />}
            exact
          />
          <Route
            path="/patient/register"
            element={<PatientRegisterForm />}
            exact
          />
          <Route path="/patient/pages/Cart" element={<CartPage />} exact />
          <Route path="/medicine/add" element={<AddMedicineForm />} exact />
          <Route path="/admin/home" element={<AdminHome/>} exact/>
          <Route path="/admin/manage" element={<ManageUsersPage/>} exact/>
          {/*redirect to landing page if wrong url*/}
          <Route path="*" element={<Navigate to="/" />} />{' '}
        </Routes>
      </BrowserRouter>
      </CartContextProvider>
    </div>
  );
}

export default App;
