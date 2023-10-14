import React from 'react';
import { Link } from 'react-router-dom';

const AdminHome = (props) => {
  return (
    <div>
      <h1>Welcome to Admin Home</h1>
      <Link to="/admin/manage">
        <button>Manage Users</button>
      </Link>
      <Link to="/pharmacy/home">
        <button>Go to Pharmacy</button>
      </Link>
    </div>
  );
};

export default AdminHome;
