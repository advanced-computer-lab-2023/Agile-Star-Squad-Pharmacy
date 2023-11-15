import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../../user-store/user-context';

const AdminHome = (props) => {
  const navigate = useNavigate();
  const userLogout = useContext(UserContext).logout;
  const logout = () => {
    userLogout();
    navigate('/');
  };

  const changePasswordHandler = () => {
    navigate('/changePassword');
  };

  return (
    <div>
      <h1>Welcome to Admin Home</h1>
      <Link to="/admin/manage">
        <button>Manage Users</button>
      </Link>
      <Link to="/pharmacy/home">
        <button>Go to Pharmacy</button>
      </Link>
      <button onClick={logout}>Logout</button>
      <button onClick={changePasswordHandler}>change password</button>
    </div>
  );
};

export default AdminHome;
