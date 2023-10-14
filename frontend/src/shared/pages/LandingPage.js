import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { setUserRole } from '../DummyUsers';

class LandingPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const loginHandler = (role) => {
      setUserRole(role);
    };

    return (
      <React.Fragment>
        <Link to="admin/home">
          <button
            type="button"
            onClick={() => {
              loginHandler('admin');
            }}
          >
            Login as an Admin
          </button>
        </Link>
        <hr />
        <Link to="pharmacy/home">
          <button
            type="button"
            onClick={() => {
              loginHandler('patient');
            }}
          >
            Login as an Patient
          </button>
        </Link>
        <Link to="pharmacy/home">
          <button
            type="button"
            onClick={() => {
              loginHandler('pharmacist');
            }}
          >
            Login as an Pharmacist
          </button>
        </Link>
        <hr />
        <Link to="patient/register">
          <button type="button">Register as a Patient</button>
        </Link>
        <Link to="pharmacist/register">
          <button type="button">Register as a Pharmacist</button>
        </Link>
        <hr />
        {/* // <Link to='patientRegisterForm'>
            //     <button type="button" onClick={routeChangeRegister}>Register as Doctor</button>
            // </Link>

            // 
            // <button type="button" onClick={routeChangeLogin}>Login</button> */}
      </React.Fragment>
    );
  }
}

export default LandingPage;
