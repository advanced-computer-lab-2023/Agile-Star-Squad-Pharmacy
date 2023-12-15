import React, { useContext, useState, useEffect } from 'react';
import './NavBar.css';
import patient from '../../../patient.png';
import { Link } from 'react-router-dom';
import UserContext from '../../../user-store/user-context';

const NavBar = (props) => {
  const [walletAmount, setWalletAmount] = useState('');
  const userCtx = useContext(UserContext);

  useEffect(() => {
    getWallet();
  }, []);

  const getWallet = async () => {
    fetch(`http://localhost:4000/patients/${userCtx.userId}`, {
      credentials: 'include',
    }).then(async (response) => {
      const json = await response.json();
      setWalletAmount(json.data.patient.wallet);
    });
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
              <li className="nav-item"style={{paddingLeft:'270px'}}>
                <p className="nav-link" href="#"style={{color:"black"}}>
                Wallet : {walletAmount}
                </p>
              </li>
            </ul>
          </div>
            
          <div className="d-flex">
          <img id="patient" src={patient} alt='i'/>
            <div class="dropdown">
              <button
                class="btn btn-secondary dropdown-toggle"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                
              >
               
              </button>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton1">
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
