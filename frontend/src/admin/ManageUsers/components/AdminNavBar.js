import React, { useContext, useState, useEffect } from 'react';
import './AdminNavBar.module.css';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../../../user-store/user-context';

const AdminNavBar = (props) => {
  const navigate = useNavigate();
  const userCtx = useContext(UserContext);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const logout = async () => {
    await userCtx.logout();
    navigate('/');
  };

  const changePasswordHandler = () => {
    navigate('/changePassword');
  };

  const medicinesRedirect = () => { 
    navigate('/pharmacy/home');
  }

  return (
    <div className="bodyN">
      <nav className="navbar navbar-expand-lg navbar-light bg-light d-flex">
        <div className="container-fluid">
          <Link to={'/admin/home'} className="navbar-brand">
            PHARMA
          </Link>


          <div className="collapse navbar-collapse" id="navbarNav"></div>
          <div className="d-flex mx-4">

            <div className="btn-group">
              <a
                href="#"
                className="btn btn-white"
                onClick={medicinesRedirect}
              >
                Medicines
              </a>
              <a
                href="#"
                className="btn btn-white"
                onClick={changePasswordHandler}
              >
                Change Password
              </a>
              <a href="#" className="btn btn-white" id="last" onClick={logout}>
                Logout
              </a>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};
export default AdminNavBar;
