import React, { useContext, useState, useEffect } from 'react';
import './AdminNavBar.module.css';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../logo.png';
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

  return (
    <div className="bodyN">
      <nav className="navbar navbar-expand-lg navbar-light bg-light d-flex">
        <div className="container-fluid">
          <Link to={'/admin/home'} className="navbar-brand">
            Pharma
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav"></div>
          <div className="d-flex mx-4">
            <div className="btn-group ">
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
