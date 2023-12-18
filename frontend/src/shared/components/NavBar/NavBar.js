import React, { useContext, useState, useEffect } from 'react';
import './NavBar.css';
import patient from '../../../patient.png';
import { useNavigate, Link } from 'react-router-dom';
import UserContext from '../../../user-store/user-context';

const NavBar = (props) => {
  const navigate = useNavigate();
  const [walletAmount, setWalletAmount] = useState(0);
  const userCtx = useContext(UserContext);

  useEffect(() => {
    getWallet();
  }, []);

  const getWallet = async () => {
    const response = await fetch(
      `http://localhost:4000/patients/${userCtx.userId}`,
      {
        credentials: 'include',
      }
    );
    const json = await response.json();
    setWalletAmount(json.data.patient.wallet);
  };

  const logout = async () => {
    await userCtx.logout();
    navigate('/');
  };
  const viewCart = () => {
    navigate('/cart');
  };

  const redirectToAccountSettings = () => {
    navigate('/patient/account');
  };
  return (
    <div className="bodyN">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link to={'/pharmacy/home'} className="navbar-brand">
            {/* <img
              src={logo}
              alt=""
              width="30"
              height="24"
              className="d-inline-block align-text-top"
              id="logo"
            /> */}
            PHARMA
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

          <div className="collapse navbar-collapse" id="navbarNav">
            {userCtx.role === 'patient' && (
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a className="nav-link" aria-current="page" href="#">
                    Refill Presciption
                  </a>
                </li>
                <li className="nav-item">
                  <Link to="/healthPackages" style={{ all: 'unset' }}>
                    <a className="nav-link " href="#">
                      Buy Medicine
                    </a>
                  </Link>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Contact a Pharmacist
                  </a>
                </li>
                <li className="nav-item">
                  <Link to="/order" style={{ all: 'unset' }}>
                    <a className="nav-link " href="#">
                      View Orders
                    </a>
                  </Link>
                </li>
                <li className="nav-item" style={{ paddingLeft: '170px' }}>
                  <p className="nav-link" href="#">
                    Wallet : {walletAmount}
                  </p>
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
                <li className="nav-item">
                  <Link to="/" style={{ all: 'unset' }}>
                    <a className="nav-link" id="last" href="#" onClick={logout}>
                      Logout
                    </a>
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};
export default NavBar;
