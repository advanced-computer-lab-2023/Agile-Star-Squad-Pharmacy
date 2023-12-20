import React, { useContext, useState, useEffect } from 'react';
import './NavBar.css';
import patient from '../../../patient.png';
import { useNavigate, Link } from 'react-router-dom';
import UserContext from '../../../user-store/user-context';
import BellDropdown from '../BellDropDown/BellDropDown';

const NavBar = (props) => {
  const navigate = useNavigate();
  const [walletAmount, setWalletAmount] = useState(0);
  const userCtx = useContext(UserContext);

  useEffect(() => {
    getWallet();
  }, []);

  const getWallet = async () => {
    if (userCtx.role == 'patient') {
      const response = await fetch(
        `http://localhost:4000/patients/${userCtx.userId}`,
        {
          credentials: 'include',
        }
      );
      const json = await response.json();
      setWalletAmount(json.data.patient.wallet);
    }
    if (userCtx.role == 'pharmacist') {
      const response = await fetch(
        `http://localhost:4000/pharmacist/${userCtx.userId}`,
        {
          credentials: 'include',
        }
      );
      const json = await response.json();
      console.log(json.data);
      setWalletAmount(json.data.pharmacist.wallet);
    }
  };

  const logout = async () => {
    await userCtx.logout();
    navigate('/');
  };
  const viewCart = () => {
    navigate('/cart');
  };

  const redirectToAccountSettings = () => {
    if (userCtx.role == 'patient') navigate('/patient/account');
    else if (userCtx.role == 'pharmacist') navigate('/pharmacist/account');
  };

  const changePasswordHandler = () => {
    navigate('/changePassword');
  };

  const medicinesRedirect = () => {
    navigate('/pharmacy/home');
  }

  return (
    <div className="bodyN">


      {userCtx.role === 'patient' && (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="">
            <Link to={'/pharmacy/home'} className="navbar-brand">
              PHARMA
            </Link>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav mt-3 ms-5 ps-5">
                <li className="nav-item ms-5">
                  <Link to="/prescriptions" style={{ all: 'unset' }}>
                    <a className="nav-link" aria-current="page" href="#">
                      Presciptions
                    </a>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/pharmacy/home" style={{ all: 'unset' }}>
                    <a className="nav-link " href="#">
                      All Medicine
                    </a>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/messages" style={{ all: 'unset' }}>
                    <a className="nav-link" href="#">
                      Chat with a Pharmacist
                    </a>
                  </Link>
                </li>

                <li className="nav-item" style={{ paddingLeft: '110px' }}>
                  <p className="nav-link" href="#">
                    Wallet : {walletAmount}
                  </p>
                </li>
                <li className="nav-item">
                  <Link to="/order" style={{ all: 'unset' }}>
                    <a className="nav-link " href="#">
                      View Orders
                    </a>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/cart" style={{ all: 'unset' }}>
                    <a className="nav-link" href="#" onClick={viewCart}>
                      View Cart
                    </a>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="//patient/account" style={{ all: 'unset' }}>
                    <a
                      className="nav-link "
                      href="#"
                      onClick={redirectToAccountSettings}
                    >
                      Account
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

      )}
      {/* Medicine Sales Report Chat .... Wallet Account */}
      {userCtx.role === 'pharmacist' && (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div>
            <Link to={'/pharmacy/home'} className="navbar-brand">
              PHARMA
            </Link>
            <div className="collapse navbar-collapse ms-5" id="navbarNav">
              <ul className="navbar-nav ms-5">
                <li className="nav-item">
                  <Link to="/pharmacy/home" style={{ all: 'unset' }}>
                    <a className="nav-link" aria-current="page" href="#">
                      All Medicine
                    </a>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/SalesReport" style={{ all: 'unset' }}>
                    <a className="nav-link " href="#">
                      Sales Report
                    </a>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/messages" style={{ all: 'unset' }}>
                    <a className="nav-link" href="#">
                      Chat
                    </a>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/archivedMedicines" style={{ all: 'unset' }}>
                    <a className="nav-link" aria-current="page" href="#">
                      Archived
                    </a>
                  </Link>
                </li>
                <li className="nav-item" style={{ paddingLeft: '7%' }}>
                  <BellDropdown />
                </li>
                <li className="nav-item">
                  <p className="nav-link" href="#">
                    Wallet : {walletAmount}
                  </p>
                </li>
                <li className="nav-item">
                  <a
                    href="#"
                    className="btn btn-white"
                    onClick={changePasswordHandler}
                  >
                    Change Password
                  </a>
                </li>
                <li className="nav-item">
                  <a href="#" className="btn btn-white" id="last" onClick={logout}>
                    Logout
                  </a>
                </li>
              </ul>          </div>
          </div>
        </nav>
      )}

      {userCtx.role === 'admin' && (
        <nav className="navbar navbar-expand-lg navbar-light bg-light d-flex">
          <div className="container-fluid">
            <Link to={'/admin/home'} className="navbar-brand">
              PHARMA
            </Link>


            <div className="collapse navbar-collapse" id="navbarNav"></div>
            <div className="d-flex mx-4">

              <div className="btn-group">
                <a
                  className="btn btn-white"
                >
                  <Link to={'/SalesReport'} >
                    Sales Report
                  </Link>
                </a>
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
      )}
    </div>

  );
};
export default NavBar;
