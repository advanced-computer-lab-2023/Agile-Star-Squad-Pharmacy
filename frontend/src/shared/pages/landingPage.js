import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class LandingPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // let navigate = useNavigate();
    // const routeChangeLogin = () => {
    //     let LoginPath = newPath;
    //     navigate(LoginPath);
    // }
    // const routeChangeRegister = () => {
    //     let registerPath = newPath;
    //     navigate(registerPath);
    // }

    return (
      <React.Fragment>
        <Link to="pharmacy/home">
          <button type="button">Go to Pharmacy Home</button>
        </Link>
        <hr />
        <Link to="patient/register">
          <button type="button">Register as a Patient</button>
        </Link>
        <hr />
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
