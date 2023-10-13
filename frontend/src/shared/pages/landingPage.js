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
        <Link to="pharmacyHome">
          <button type="button">Go to Pharmacy Home</button>
        </Link>
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
