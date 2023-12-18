import React, { useContext, useState, useEffect } from 'react';
import './NavBar.css';
import patient from '../../../patient.png';
import { Link } from 'react-router-dom';
import UserContext from '../../../user-store/user-context';

const NavBar = (props) => {
  const [walletAmount, setWalletAmount] = useState(0);
  const userCtx = useContext(UserContext);

  useEffect(() => {
    if (userCtx.role === 'paient') getWallet();
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
                <li className="nav-item" style={{ paddingLeft: '270px' }}>
                  <a className="nav-link" href="#" style={{ color: 'black' }}>
                    Wallet : {walletAmount}
                  </a>
                </li>
              </ul>
            )}
          </div>

          <div className="d-flex">
            <Link to="/patient/account" style={{ all: 'unset' }}>
              <img id="patient" src={patient} alt="i" />
            </Link>
            <div class="dropdown">
              <button
                class="btn btn-secondary dropdown-toggle"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              ></button>
              <ul
                class="dropdown-menu dropdown-menu-end"
                aria-labelledby="dropdownMenuButton1"
              >
                <li>
                  <a class="dropdown-item" href="#">
                    Action
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#">
                    Another action
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#">
                    Something else here
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};
export default NavBar;
