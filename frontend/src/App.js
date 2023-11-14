import React, { useEffect, useState } from 'react';
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

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(['jwt']);
  const [user, setUser] = useState({
    role: null,
    userId: null,
  });
  const [userData, setUserData] = useState(null);

  const getUserRoutes = () => {
    // console.log(user);
    if (user.role === 'patient') {
      return (
        <Routes>
          <Route path="/pharmacy/home" element={<PharmacyHome />} exact />
          <Route path="*" element={<Navigate to="/pharmacy/home" />} />{' '}
        </Routes>
      );
    } else if (user.role === 'pharmacist') {
      return (
        <Routes>
          <Route path="/pharmacy/home" element={<PharmacyHome />} exact />
          <Route path="/medicine/add" element={<AddMedicineForm />} exact />
          <Route path="*" element={<Navigate to="/pharmacy/home" />} />{' '}
        </Routes>
      );
    } else if (user.role === 'admin') {
      return (
        <Routes>
          <Route path="/admin/home" element={<AdminHome />} exact />
          <Route path="/admin/manage" element={<ManageUsersPage />} exact />
          <Route path="*" element={<Navigate to="/admin/home" />} />{' '}
        </Routes>
      );
    } else {
      return (
        <Routes>
          <Route path="/" element={<Login setUser={setUser} />} exact />
          <Route path="/resetPassword" element={<ResetPassword />} exact />
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
          setUser({ role: 'guest', userId: null });
        } else {
          setUser((prev) => ({
            ...prev,
            role: res.data.data.role,
            userId: res.data.data.id,
          }));
        }
      });
  }, []);

  useEffect(() => {
    if (user.role === null || user.role === 'guest') return;
    axios
      .get(`http://localhost:4000/${user.role}s/${user.userId}`, {
        withCredentials: true,
      })
      .then((res) => {
        setUserData((prev) => ({
          ...res.data.data[user.role],
        }));

        console.log(res.data.data);
      });
  }, [user]);

  const logoutHandler = async () => {
    await axios.get('http://localhost:4000/auth/logout');
    removeCookie('jwt', { path: '/' });
    setUser({ role: 'guest', userId: null });
  };

  return (
    <div className="App">
      <button onClick={logoutHandler}>logout</button>
      <BrowserRouter>{getUserRoutes()}</BrowserRouter>
    </div>
  );
}

export default App;
