import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import Login from './login/pages/Login';
import ResetPassword from './login/pages/ResetPassword';
import LandingPage from './shared/pages/LandingPage';
import PharmacyHome from './pharmacy/pages/PharmacyHome';
import AddMedicineForm from './pharmacist/pages/AddMedicine';
import PatientRegisterForm from './patient/pages/PatientRegister';
import PharmacistRequest from './pharmacist/pages/PharmacistRequest';
import AdminHome from './admin/Home/AdminHome';
import ManageUsersPage from './admin/ManageUsers/ManageUsersPage';
import UserContext from './user-store/user-context';
import CartPage from './patient/pages/cart/CartPage';
import ChangePassword from './login/pages/ChangePassword';
import { CartContextProvider } from './patient/pages/cart/Cart';
import AddingInfo from './patient/pages/payment/AddingInfo';
import './App.css';
import Order from './patient/pages/order/Order';
import ArchivedMedicines from './medicines/ArchivedMedicines';
import SignupOptions from './login/pages/SignupOptions';
import AddAddress from "./patient/pages/AddAddress";
import MedicineDetails from './patient/pages/MedicineDetails';
import Homepage from './patient/pages/home/Homepage';
import RevenueChart from './admin/ManageUsers/components/RevenueChart';

function App() {
  const user = useContext(UserContext);
  const [cookies, setCookie, removeCookie] = useCookies(['jwt']);

  const getUserRoutes = () => {
    if (user.role === 'patient') {
      return (
        <CartContextProvider>
          <Routes>
            <Route path="/pharmacy/home" element={<Homepage />} exact />
            <Route path="/cart" element={<CartPage />} exact />
            <Route path="/payment/AddingInfo" element={<AddingInfo />} exact />
            <Route path="/order" element={<Order />} exact />
            <Route path="/address/add" element={<AddAddress />} exact />
            <Route path="changePassword" element={<ChangePassword />} exact />
            <Route path="/medicine" element={<MedicineDetails />} exact />
            <Route path="*" element={<Navigate to="/pharmacy/home" />} />{' '}
          </Routes>
        </CartContextProvider>
      );
    } else if (user.role === 'pharmacist') {
      return (
        <Routes>
          <Route path="/pharmacy/home" element={<PharmacyHome />} exact />
          <Route path="/medicine/add" element={<AddMedicineForm />} exact />
          <Route path="changePassword" element={<ChangePassword />} exact />
          <Route
            path="/archivedMedicines"
            element={<ArchivedMedicines />}
            exact
          />
          <Route path="*" element={<Navigate to="/pharmacy/home" />} />{' '}
        </Routes>
      );
    } else if (user.role === 'admin') {
      return (
        <Routes>
          <Route path="/admin/home" element={<AdminHome />} exact />
          <Route path="/admin/manage" element={<ManageUsersPage />} exact />
          <Route path="changePassword" element={<ChangePassword />} exact />
          <Route path="*" element={<Navigate to="/admin/home" />} />{' '}
        </Routes>
      );
    } else {
      return (
        <Routes>
          <Route path="/" element={<Login />} exact />
          <Route path="/resetPassword" element={<ResetPassword />} exact />
          <Route path="signupOptions" element={<SignupOptions />} exact />
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
          <Route path="*" element={<Navigate to="/" />} />{' '}
        </Routes>
      );
    }
  };

  useEffect(() => {
    axios
      .get('http://localhost:4000/auth/me', { withCredentials: true })
      .then((res) => {
        if (res.data.data.user === null) {
          user.login({ role: 'guest', userId: null });
        } else {
          user.login({
            role: res.data.data.role,
            userId: res.data.data.id,
          });
        }
      });
  }, []);

  const logoutHandler = async () => {
    await axios.get('http://localhost:4000/auth/logout', {
      withCredentials: true,
    });
    removeCookie('jwt', { path: '/' });
    user.logout();
  };

  return (
    <div className="App">
      <BrowserRouter>{getUserRoutes()}</BrowserRouter>
    </div>
  );
}

export default App;
